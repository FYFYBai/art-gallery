CREATE TABLE page_view_daily_stats (
    view_date       DATE            NOT NULL,
    path            VARCHAR(512)    NOT NULL,
    locale          VARCHAR(10)     NOT NULL,
    total_views     BIGINT          NOT NULL DEFAULT 0,
    unique_views    BIGINT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_page_view_daily_stats
        PRIMARY KEY (view_date, path, locale)
);

CREATE TABLE page_view_dedup (
    session_hash    CHAR(64)        NOT NULL,
    path            VARCHAR(512)    NOT NULL,
    locale          VARCHAR(10)     NOT NULL,
    view_date       DATE            NOT NULL,
    expires_at      TIMESTAMPTZ     NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_page_view_dedup
        PRIMARY KEY (session_hash, path, locale, view_date)
);

CREATE INDEX idx_page_view_daily_stats_date
    ON page_view_daily_stats(view_date);

CREATE INDEX idx_page_view_dedup_expires_at
    ON page_view_dedup(expires_at);
