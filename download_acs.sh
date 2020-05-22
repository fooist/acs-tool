#!/bin/bash

# make sure the directory I want is there
# should throw an error and quit if it doesn't work
mkdir -p data
mkdir -p data/raw
mkdir -p data/raw/acs
mkdir -p data/raw/acs/2018_1_yr
mkdir -p data/raw/acs/2018_1_yr/data
mkdir -p data/raw/acs/2018_1_yr/templates

# create all the output directories I'm gonna need
mkdir -p data/processed
mkdir -p data/processed/acs
mkdir -p data/processed/acs/2018_1_yr
mkdir -p data/processed/acs/2018_1_yr/headers
mkdir -p data/processed/acs/2018_1_yr/combined
mkdir -p data/processed/acs/2018_1_yr/tall

# download the 2018 1-year ACS
# TODO: use command line parameters
curl https://www2.census.gov/programs-surveys/acs/summary_file/2018/data/1_year_entire_sf/All_Geographies.zip > data/raw/acs/2018_1_yr.zip
curl https://www2.census.gov/programs-surveys/acs/summary_file/2018/data/2018_1yr_Summary_FileTemplates.zip  > data/raw/acs/2018_1_yr_templates.zip

unzip -j -d data/raw/acs/2018_1_yr/data data/raw/acs/2018_1_yr.zip
unzip -j -d data/raw/acs/2018_1_yr/templates data/raw/acs/2018_1_yr_templates.zip
