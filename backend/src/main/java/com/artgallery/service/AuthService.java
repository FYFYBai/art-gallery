package com.artgallery.service;

import com.artgallery.domain.user.OAuthProvider;
import com.artgallery.domain.user.Role;
import com.artgallery.domain.user.User;
import com.artgallery.domain.user.UserAuthProvider;
import com.artgallery.dto.request.LoginRequest;
import com.artgallery.dto.request.OAuthLoginRequest;
import com.artgallery.dto.request.RegisterRequest;
import com.artgallery.dto.response.LoginResponse;
import com.artgallery.dto.response.RegisterResponse;
import com.artgallery.exception.AccountDisabledException;
import com.artgallery.exception.DuplicateEmailException;
import com.artgallery.exception.InvalidCredentialsException;
import com.artgallery.repository.UserAuthProviderRepository;
import com.artgallery.repository.UserRepository;
import com.artgallery.security.JwtService;
import com.artgallery.security.TokenDenylist;
import io.jsonwebtoken.Claims;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenDenylist tokenDenylist;
    private final UserAuthProviderRepository userAuthProviderRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       TokenDenylist tokenDenylist,
                       UserAuthProviderRepository userAuthProviderRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenDenylist = tokenDenylist;
        this.userAuthProviderRepository = userAuthProviderRepository;
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

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                "Registration succeeded"
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
}
