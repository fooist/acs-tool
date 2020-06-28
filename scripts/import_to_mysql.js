const fs = require('fs')
const cliProgress = require('cli-progress')
const d3 = require('d3')
const _ = require('lodash')
const mysql = require('mysql')
const Papa = require('papaparse')


// use dotenv to add env variables
require('dotenv').config()

// cli parameters
const year = process.argv[2]
const acsYears = process.argv[3]

// if cli parameters are missing, throw error and quit
if (year == null || acsYears == null) {
  console.log('Syntax: node merge_big_csvs.js YEAR ACSTYPE')
  process.exit()
}

// useful constants
const inputPath = `./data/processed/acs/${year}_${acsYears}_yr/combined/`
const headerPath = `./data/processed/acs/${year}_${acsYears}_yr/headers/`


// important variables
let data = [] // the main dataset to be written out at the end
const create_table_sql =`
DROP TABLE IF EXISTS census_main;
CREATE TABLE IF NOT EXISTS census_main (
  prikey bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  file_type varchar(16) NOT NULL,
  state_abbrev varchar(2) NOT NULL,
  data_year int(11) NOT NULL,
  logrecno varchar(8) NOT NULL,
  geoid varchar(255) NOT NULL UNIQUE KEY,
  data_object json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE census_main
  ADD UNIQUE KEY complete_logrecno (file_type, state_abbrev, data_year, logrecno);
`.trim()



// get the database params
// TODO: make the database code abstracted?
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_CATALOG
}

const connection = mysql.createConnection(dbConfig)

connection.connect()




/*

// get the list of datafiles, but put geography first
const dataFiles = fs.readdirSync(inputPath)
  .filter(d => d.endsWith('.csv')&& d != 'geography.csv')
dataFiles.unshift('geography.csv')
console.log(dataFiles)


// set up a progress bar to measure based on # of files including geo
const progressBar = new cliProgress.SingleBar({etaBuffer:10}, cliProgress.Presets.shades_classic)

progressBar.start(dataFiles.length, 0)



// loop through the rows of each file to combine rows
for (filename of dataFiles) {
  const hText = fs.readFileSync(headerPath + filename, 'latin1')
  const dText = fs.readFileSync(inputPath + filename, 'latin1')
  const dataType = filename.slice(0,1)


*/
