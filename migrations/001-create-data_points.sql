--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE data_points (
    id          TEXT AS  (data_set_id||'-'||year||'-'||state||'-'||recno||'-'
                            ||identifier) STORED PRIMARY KEY,
    data_set_id TEXT,
    year        TEXT,
    state       TEXT,
    recno       TEXT,
    identifier  TEXT,
    value       NUMERIC
);






--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE dat_points;
