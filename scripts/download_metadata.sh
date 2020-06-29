#!/bin/bash



# create a directory for the metadata
mkdir -p data/raw/acs/$1_$2_yr/metadata

# curl to download variable info as JSON from the API
# then pipe through jq for a csv
curl https://api.census.gov/data/$1/acs/acs$2/variables.json | \
  jq -r ".variables| to_entries | .[] | [.key, .value.label, .value.concept, .value.predicateType]| @csv" | \
  tail -n +3 >  data/raw/acs/$1_$2_yr/metadata/variables.csv

# curl to download group (table) info as JSON from the API
# tben pipe through jq for a csv
curl https://api.census.gov/data/$1/acs/acs$2/groups.json | \
  jq -r ".groups[]|[.name, .description, .variables]|@csv" >  data/raw/acs/$1_$2_yr/metadata/tables.csv

