package com.artgallery.service;

import com.artgallery.domain.user.EmailVerificationToken;
import com.artgallery.domain.user.OAuthProvider;
import com.artgallery.domain.user.PasswordResetToken;
import com.artgallery.domain.user.Role;
import com.artgallery.domain.user.User;
import com.artgallery.domain.user.UserAuthProvider;
import com.artgallery.dto.request.ForgotPasswordRequest;
import com.artgallery.dto.request.LoginRequest;
import com.artgallery.dto.request.OAuthLoginRequest;
import com.artgallery.dto.request.RegisterRequest;
import com.artgallery.dto.request.ResendVerificationEmailRequest;
import com.artgallery.dto.request.ResetPasswordRequest;
import com.artgallery.dto.response.LoginResponse;
import com.artgallery.dto.response.RegisterResponse;
import com.artgallery.exception.AccountDisabledException;
import com.artgallery.exception.DuplicateEmailException;
import com.artgallery.exception.EmailNotVerifiedException;
import com.artgallery.exception.EmailVerificationException;
import com.artgallery.exception.InvalidCredentialsException;
import com.artgallery.exception.PasswordResetException;
import com.artgallery.repository.EmailVerificationTokenRepository;
import com.artgallery.repository.PasswordResetTokenRepository;
import com.artgallery.repository.UserAuthProviderRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.security.JwtService;
import com.artgallery.security.TokenDenylist;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;

@Service
public class AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Duration VERIFICATION_RESEND_COOLDOWN = Duration.ofSeconds(60);
    private static final Duration PASSWORD_RESET_RESEND_COOLDOWN = Duration.ofSeconds(60);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenDenylist tokenDenylist;
    private final UserAuthProviderRepository userAuthProviderRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final String frontendBaseUrl;
    private final long verificationTokenTtlHours;
    private final long passwordResetTokenTtlHours;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       TokenDenylist tokenDenylist,
                       UserAuthProviderRepository userAuthProviderRepository,
                       EmailVerificationTokenRepository emailVerificationTokenRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       EmailService emailService,
                       @Value("${app.frontend.base-url}") String frontendBaseUrl,
                       @Value("${app.email.verification-token-ttl-hours}") long verificationTokenTtlHours,
                       @Value("${app.email.password-reset-token-ttl-hours}") long passwordResetTokenTtlHours) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenDenylist = tokenDenylist;
        this.userAuthProviderRepository = userAuthProviderRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.frontendBaseUrl = frontendBaseUrl;
        this.verificationTokenTtlHours = verificationTokenTtlHours;
        this.passwordResetTokenTtlHours = passwordResetTokenTtlHours;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException(normalizedEmail);
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setActive(true);
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);
        String rawToken = createVerificationToken(savedUser);
        String verificationLink = buildVerificationLink(rawToken, request.getLocale());
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationLink);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                "Registration succeeded. Please verify your email before logging in."
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(InvalidCredentialsException::new);
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        if (!user.isActive()) {
            throw new AccountDisabledException();
        }
        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }
        String token = jwtService.issueToken(user);
        return new LoginResponse(user.getId(), user.getEmail(), user.getRole().name(), token);
    }

    @Transactional(readOnly = true)
    public LoginResponse oauthLogin(OAuthLoginRequest request) {
        OAuthProvider provider;
        try {
            provider = OAuthProvider.valueOf(request.getProvider().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unsupported OAuth provider");
        }

        // TODO: Implement real OAuth token verification against the provider's
        // user-info endpoint to obtain the providerUserId from the access token.
        // For now, look up by provider only and take the first result as a stub.
        List<UserAuthProvider> authProviders = userAuthProviderRepository.findByProvider(provider);
        if (authProviders.isEmpty()) {
            throw new InvalidCredentialsException();
        }
        UserAuthProvider authProvider = authProviders.get(0);
        User user = authProvider.getUser();

        if (!user.isActive()) {
            throw new AccountDisabledException();
        }

        String token = jwtService.issueToken(user);
        return new LoginResponse(user.getId(), user.getEmail(), user.getRole().name(), token);
    }

    public void logout(String token) {
        Claims claims = jwtService.parseToken(token);
        String jti = claims.getId();
        Date expiration = claims.getExpiration();
        Duration remainingTtl = Duration.between(Instant.now(), expiration.toInstant());
        if (!remainingTtl.isNegative()) {
            tokenDenylist.add(jti, remainingTtl);
        }
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new EmailVerificationException("Verification token is required");
        }

        EmailVerificationToken token = emailVerificationTokenRepository.findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new EmailVerificationException("Verification link is invalid"));

        User user = token.getUser();

        if (token.getUsedAt() != null) {
            if (user.isEmailVerified()) {
                return;
            }
            throw new EmailVerificationException("Verification link has already been used");
        }

        if (token.getExpiresAt().isBefore(OffsetDateTime.now(ZoneOffset.UTC))) {
            throw new EmailVerificationException("Verification link has expired");
        }

        user.setEmailVerified(true);
        token.setUsedAt(OffsetDateTime.now(ZoneOffset.UTC));
    }

    @Transactional
    public void resendVerificationEmail(ResendVerificationEmailRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new EmailVerificationException("Account was not found"));

        if (user.isEmailVerified()) {
            throw new EmailVerificationException("Account is already verified");
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        emailVerificationTokenRepository
                .findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(user)
                .ifPresent(token -> {
                    if (token.getCreatedAt().plus(VERIFICATION_RESEND_COOLDOWN).isAfter(now)) {
                        throw new EmailVerificationException("Please wait before requesting another verification email");
                    }
                });

        String rawToken = createVerificationToken(user);
        String verificationLink = buildVerificationLink(rawToken, request.getLocale());
        emailService.sendVerificationEmail(user.getEmail(), verificationLink);
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new PasswordResetException("No account exists for this email"));

        if (!user.isActive()) {
            throw new PasswordResetException("Account is disabled");
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        passwordResetTokenRepository
                .findTopByUserAndUsedAtIsNullOrderByCreatedAtDesc(user)
                .ifPresent(token -> {
                    if (token.getCreatedAt().plus(PASSWORD_RESET_RESEND_COOLDOWN).isAfter(now)) {
                        throw new PasswordResetException("Please wait before requesting another password reset email");
                    }
                });

        String rawToken = createPasswordResetToken(user);
        String resetLink = buildPasswordResetLink(rawToken, request.getLocale());
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByTokenHash(hashToken(request.getToken()))
                .orElseThrow(() -> new PasswordResetException("Password reset link is invalid"));

        if (token.getUsedAt() != null) {
            throw new PasswordResetException("Password reset link has already been used");
        }

        if (token.getExpiresAt().isBefore(OffsetDateTime.now(ZoneOffset.UTC))) {
            throw new PasswordResetException("Password reset link has expired");
        }

        User user = token.getUser();
        if (!user.isActive()) {
            throw new PasswordResetException("Account is disabled");
        }

        if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new PasswordResetException("New password must be different from the current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        token.setUsedAt(OffsetDateTime.now(ZoneOffset.UTC));
    }

    private String createVerificationToken(User user) {
        String rawToken = createRawToken();

        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setTokenHash(hashToken(rawToken));
        token.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusHours(verificationTokenTtlHours));
        emailVerificationTokenRepository.save(token);

        return rawToken;
    }

    private String createPasswordResetToken(User user) {
        String rawToken = createRawToken();

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setTokenHash(hashToken(rawToken));
        token.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusHours(passwordResetTokenTtlHours));
        passwordResetTokenRepository.save(token);

        return rawToken;
    }

    private String createRawToken() {
        byte[] tokenBytes = new byte[24];
        SECURE_RANDOM.nextBytes(tokenBytes);
        return HexFormat.of().formatHex(tokenBytes);
    }

    private String buildVerificationLink(String rawToken, String locale) {
        String encodedToken = URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        String safeLocale = locale != null && List.of("fr", "en", "zh").contains(locale) ? locale : "fr";
        return frontendBaseUrl.replaceAll("/+$", "") + "/" + safeLocale + "/verify-email?token=" + encodedToken;
    }

    private String buildPasswordResetLink(String rawToken, String locale) {
        String encodedToken = URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        String safeLocale = locale != null && List.of("fr", "en", "zh").contains(locale) ? locale : "fr";
        return frontendBaseUrl.replaceAll("/+$", "") + "/" + safeLocale + "/reset-password?token=" + encodedToken;
    }

    private static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(rawToken.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is not available", ex);
        }
    }
}
