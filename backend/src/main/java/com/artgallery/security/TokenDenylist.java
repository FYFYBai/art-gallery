package com.artgallery.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory denylist for revoked JWT tokens.
 *
 * <p>Entries are keyed by the token's {@code jti} claim and expire automatically
 * once the original token's TTL has elapsed. A scheduled task evicts stale
 * entries every 10 minutes to prevent unbounded memory growth.
 */
@Component
public class TokenDenylist {

    private final ConcurrentHashMap<String, Instant> denylist = new ConcurrentHashMap<>();

    /**
     * Adds a token identifier to the denylist.
     *
     * @param jti          the JWT ID ({@code jti} claim) to revoke
     * @param remainingTtl how long until the token would have naturally expired
     */
    public void add(String jti, Duration remainingTtl) {
        denylist.put(jti, Instant.now().plus(remainingTtl));
    }

    /**
     * Returns {@code true} if the given token identifier is on the denylist
     * and its denylist entry has not yet expired.
     *
     * @param jti the JWT ID to check
     * @return {@code true} if the token is revoked and the entry is still valid
     */
    public boolean isDenylisted(String jti) {
        Instant expiresAt = denylist.get(jti);
        return expiresAt != null && expiresAt.isAfter(Instant.now());
    }

    /**
     * Removes all expired entries from the denylist.
     *
     * <p>Runs automatically every 10 minutes (600 000 ms fixed delay).
     */
    @Scheduled(fixedDelay = 600_000)
    public void evictExpired() {
        denylist.entrySet().removeIf(e -> e.getValue().isBefore(Instant.now()));
    }
}
