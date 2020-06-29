--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE geography AS (
    /* id should be the same as the record point to its geoid in data_points */
    id TEXT (data_set_id||'-'||year||'-'||state||'-'||recno||'-'||identifier) STORED PRIMARY KEY,
    identifier TEXT, /* from the dataset it came from */
    geoid TEXT,
    name TEXT,
    data_set_id TEXT,
    year INTEGER,
    state  TEXT, /* state 2-character abbreviation */
    summary_level TEXT,
    component TEXT,
    recno INTEGER,
    us TEXT,
    region TEXT,
    division TEXT,
    statece TEXT,
    state_fips TEXT,
    county_fips TEXT,
    cousub_fips TEXT,
    place_fips TEXT,
    tract_fips TEXT,
    blkgrp_fips TEXT,
    concit fips TEXT,
    aianhh_fips TEXT,
    aianhhfp_fips TEXT,
    aihhtli_fips TEXT,
    aitsce_fips TEXT,
    aits_fips TEXT, 
    anrc_fips TEXT,
    cbsa_fips TEXT,
    csa_fips TEXT,
    metdiv_fips TEXT,
    macc_fips TEXT,
    memi_fips TEXT,
    necta_fips TEXT,
    cnecta_fips TEXT,
    nectadiv_fips TEXT,
    ua_fips TEXT,
    cdcurr_fips TEXT,
    sldu_fips TEXT,
    sldl_fips TEXT,
    zcta5_fips TEXT,
    submcd_fips TEXT,
    sdelm_fips TEXT,
    sdsec_fips TEXT,
    sduni_fips TEXT, 
    ur_fips TEXT,
    pci_fips TEXT,
    puma5_fips TEXT
    bttr_fips TEXT,
    btbg_fips TEXT
)

CREATE INDEX geography_ix_state ON geography (state);
CREATE INDEX geography_ix_year ON geography (year);
CREATE INDEX geography_ix_geoid ON geography (geoid);
CREATE INDEX geography_ix_recno ON geography (data_set_id, year, state, recno);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX geography_ix_state;
DROP INDEX geography_ix_year;
DROP INDEX geography_ix_geoid;
DROP INDEX geography_ix_recno;
DROP TABLE data_geography;
