package com.artgallery.security;

import com.artgallery.domain.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Handles JWT issuance and validation for the art-gallery application.
 *
 * <p>Uses JJWT 0.12.x with HS256 signing. The secret and expiration are
 * injected from {@code app.jwt.secret} and {@code app.jwt.expiration-ms}
 * respectively.
 */
@Service
public class JwtService {

    private final String secret;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    // -------------------------------------------------------------------------
    // Token issuance
    // -------------------------------------------------------------------------

    /**
     * Issues a signed HS256 JWT for the given user.
     *
     * <p>Claims included:
     * <ul>
     *   <li>{@code sub}   – user UUID as string</li>
     *   <li>{@code email} – user e-mail address</li>
     *   <li>{@code role}  – user role string</li>
     *   <li>{@code jti}   – random UUID (token identifier)</li>
     *   <li>{@code iat}   – issued-at timestamp</li>
     *   <li>{@code exp}   – expiry timestamp (iat + expirationMs)</li>
     * </ul>
     *
     * @param user the authenticated user
     * @return compact, URL-safe JWT string
     */
    public String issueToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey(), Jwts.SIG.HS256)
                .compact();
    }

    // -------------------------------------------------------------------------
    // Token parsing
    // -------------------------------------------------------------------------

    /**
     * Parses and validates a JWT, returning its claims.
     *
     * @param token compact JWT string
     * @return verified {@link Claims}
     * @throws JwtException if the token is malformed, expired, or has an invalid signature
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // -------------------------------------------------------------------------
    // Convenience extractors
    // -------------------------------------------------------------------------

    /** Returns the {@code jti} claim (token identifier). */
    public String extractJti(String token) {
        return parseToken(token).getId();
    }

    /** Returns the {@code sub} claim parsed as a {@link UUID}. */
    public UUID extractUserId(String token) {
        return UUID.fromString(parseToken(token).getSubject());
    }

    /** Returns the {@code email} claim. */
    public String extractEmail(String token) {
        return parseToken(token).get("email", String.class);
    }

    /** Returns the {@code role} claim. */
    public String extractRole(String token) {
        return parseToken(token).get("role", String.class);
    }

    /** Returns the {@code exp} claim as a {@link Date}. */
    public Date extractExpiration(String token) {
        return parseToken(token).getExpiration();
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
