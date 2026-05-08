package com.artgallery.repository;

import com.artgallery.dto.response.AdminDashboardResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AnalyticsRepository {

    private final JdbcTemplate jdbcTemplate;

    public AnalyticsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void recordPageView(String path, String locale, String sessionId) {
        LocalDate today = LocalDate.now();
        String normalizedPath = normalizePath(path);
        String normalizedLocale = normalizeLocale(locale);
        String sessionHash = hashSession(sessionId);

        jdbcTemplate.update("delete from page_view_dedup where expires_at < now()");

        int insertedDedup = jdbcTemplate.update("""
                insert into page_view_dedup (session_hash, path, locale, view_date, expires_at)
                values (?, ?, ?, ?, now() + interval '2 days')
                on conflict do nothing
                """, sessionHash, normalizedPath, normalizedLocale, today);

        jdbcTemplate.update("""
                insert into page_view_daily_stats (view_date, path, locale, total_views, unique_views)
                values (?, ?, ?, 1, ?)
                on conflict (view_date, path, locale) do update
                set total_views = page_view_daily_stats.total_views + 1,
                    unique_views = page_view_daily_stats.unique_views + excluded.unique_views,
                    updated_at = now()
                """, today, normalizedPath, normalizedLocale, insertedDedup > 0 ? 1 : 0);
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardResponse.DailyViews> dailyViewsLast40Days() {
        return jdbcTemplate.query("""
                select day::date as view_date,
                       coalesce(sum(stats.total_views), 0) as total_views,
                       coalesce(sum(stats.unique_views), 0) as unique_views
                from generate_series(current_date - interval '39 days', current_date, interval '1 day') as day
                left join page_view_daily_stats stats on stats.view_date = day::date
                group by day
                order by day
                """, (rs, rowNum) -> new AdminDashboardResponse.DailyViews(
                rs.getDate("view_date").toLocalDate().toString(),
                rs.getLong("total_views"),
                rs.getLong("unique_views")
        ));
    }

    private String normalizePath(String path) {
        String normalized = path == null || path.isBlank() ? "/" : path.trim();
        return normalized.length() > 512 ? normalized.substring(0, 512) : normalized;
    }

    private String normalizeLocale(String locale) {
        String normalized = locale == null || locale.isBlank() ? "unknown" : locale.trim().toLowerCase();
        return normalized.length() > 10 ? normalized.substring(0, 10) : normalized;
    }

    private String hashSession(String sessionId) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(sessionId.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is not available", ex);
        }
    }
}
