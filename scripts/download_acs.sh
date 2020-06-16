#!/bin/bash



# make sure the directory I want is there
# should be run from main directory, not scripts
# should throw an error and quit if it doesn't work
mkdir -p data/raw/acs/$1_$2_yr/data
mkdir -p data/raw/acs/$1_$2_yr/geo
mkdir -p data/raw/acs/$1_$2_yr/templates

# create all the output directories I'm gonna need
mkdir -p data/processed/acs/$1_$2_yr/headers
mkdir -p data/processed/acs/$1_$2_yr/combined
mkdir -p data/processed/acs/$1_$2_yr/tall

# try the formats for the 1 and 5 yr ACS files then fail

echo "Check for /All_Geographies.zip"
has_all_zip=`curl -m 60 --silent --head https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies.zip | head -n 1`

echo "Check for /All_Geographies.tar"
has_all_tar=`curl -m 60 --silent --head https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies.tar | head -n 1`

echo "Check for /$1$2YRSF.zip"
has_year_specific_zip=`curl -m 60 --silent --head https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/$1$2YRSF.zip | head -n 1`

echo "Check for /All_Geographies_Not_Tracts_Block_Groups.zip"
has_no_tracts_zip=`curl -m 60 --silent --head https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies_Not_Tracts_Block_Groups.zip | head -n 1`

echo "Check for /All_Geographies_Not_Tracts_Block_Groups.tar"
has_no_tracts_tar=`curl -m 60 --silent --head https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies_Not_Tracts_Block_Groups.tar|head -n 1`

echo "check for /All_Geographies_Not_Tracts_Block_Groups.tar.gz"
has_no_tracts_targz=`curl -m 60 --silent --head https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies_Not_Tracts_Block_Groups.tar.gz |head -n 1`


if [[ $has_no_tracts_zip != *"404"* ]]; then
    echo "downloading no_tracts zipfile"
    curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies_Not_Tracts_Block_Groups.zip > data/raw/acs/$1_$2_yr.zip 
    unzip -j -d data/raw/acs/$1_$2_yr/data data/raw/acs/$1_$2_yr.zip
	 # ridiculous looking quotation sequences below are necessary
	 unzip -d data/raw/acs/"$1"_"$2"_yr""/data/ "data/raw/acs/"$1"_"$2"_yr""/data/*.zip"

elif [[ "$has_no_tracts_targz" != *"404"* ]]; then
	echo "downloading no_tracts tar.gz file"

	 curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies_Not_Tracts_Block_Groups.tar.gz > data/raw/acs/$1_$2_yr.tar.gz
	 tar -xzf data/raw/acs/$1_$2_yr.tar.gz -C data/raw/acs/$1_$2_yr/data
	
	
	 # ridiculous looking quotation sequences below are necessary
	 unzip -d data/raw/acs/"$1"_"$2"_yr""/data/ "data/raw/acs/"$1"_"$2"_yr""/data/*.zip"

 elif [[ "$has_no_tracts_tar" != *"404"* ]]; then
	 curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies_Not_Tracts_Block_Groups.tar > data/raw/acs/$1_$2_yr.tar
	 tar -xf data/raw/acs/$1_$2_yr.tar -C data/raw/acs/$1_$2_yr/data
	 
	 # ridiculous looking quotation sequences below are necessary
	 unzip -d data/raw/acs/"$1"_"$2"_yr""/data/ "data/raw/acs/"$1"_"$2"_yr""/data/*.zip"
 elif [[ "$has_all_zip" != *"404"* ]]; then
    echo "downloading all geographies zipfile"
    curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies.zip > data/raw/acs/$1_$2_yr.zip
    unzip -j -d data/raw/acs/$1_$2_yr/data data/raw/acs/$1_$2_yr.zip
elif [[ "$has_all_tar" != *"404"* ]]; then
	echo "downloading all geographies tarfile"
	curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies.tar > data/raw/acs/$1_$2_yr.tar
       tar -xf data/raw/acs/$1_$2_yr.tar -C data/raw/acs/$1_$2_yr/data
 elif [[ "$has_all_zip" != *"404"* ]]; then
    echo "downloading all geographies zipfile"
    curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/All_Geographies.zip > data/raw/acs/$1_$2_yr.zip
    unzip -j -d data/raw/acs/$1_$2_yr/data data/raw/acs/$1_$2_yr.zip
elif [[ "has_year_specific_zip" != *"404"* ]]; then
	echo "downloading $1$2YRSF.zip"
	curl ftp://ftp2.census.gov/programs-surveys/acs/summary_file/$1/data/$2_year_entire_sf/$1$2YRSF.zip > data/raw/acs/$1_$2_yr.zip
    unzip -j -d data/raw/acs/$1_$2_yr/data data/raw/acs/$1_$2_yr.zip
else
	echo "can't find data"
	exit
fi
	
	
curl https://www2.census.gov/programs-surveys/acs/summary_file/$1/data/$1_$2yr_Summary_FileTemplates.zip  > data/raw/acs/$1_$2_yr_templates.zip
unzip -j -d  data/raw/acs/$1_$2_yr/templates data/raw/acs/$1_$2_yr_templates.zip

