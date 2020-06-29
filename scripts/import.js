const fs = require('fs')
const cliProgress = require('cli-progress')
const d3 = require('d3')
const _ = require('lodash')
const mysql = require('mysql2/promise')
const Papa = require('papaparse')

"use strict"

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
// TODO: Should I normalize the data? Will slow things
const createTable =`CREATE TABLE IF NOT EXISTS census_main (
  prikey bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  file_id varchar(16) NOT NULL,
  file_type varchar(16) NOT NULL,
  state_abbrev varchar(2) NOT NULL,
  data_year int(11) NOT NULL,
  logrecno varchar(8) NOT NULL,
  geoid varchar(255) NOT NULL UNIQUE KEY,
  data_object json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`
const createIndex = `ALTER TABLE census_main
  ADD UNIQUE KEY complete_logrecno (file_id, state_abbrev, data_year, logrecno);`



// get the database params
// TODO: make the database code abstracted?
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_CATALOG
}

async function main() {
  // connect to the database
  try { var connection = await mysql.createConnection(dbConfig) }
  catch (e) { throw e }
    // make sure the data table is there
  try { await connection.execute(createTable) }
  catch (e) { throw e }

  // add a unique index for the logrecno fields if it's missing
  try { await connection.execute(createIndex) }
  catch (e) { /* nothing */ }


  // get the list of datafiles, but put geography first
  const dataFiles = fs.readdirSync(inputPath)
    .filter(d => d.endsWith('.csv')&& d != 'geography.csv')
  dataFiles.unshift('geography.csv')


  // set up a progress bar to measure based on # of files including geo
  const progressBar = new cliProgress.SingleBar({etaBuffer:1000}, cliProgress.Presets.shades_classic)

  // loop through the rows of each file to combine rows
  for (i in  dataFiles) {
    const filename = dataFiles[i]
    const hText = fs.readFileSync(headerPath + filename, 'latin1')
    const dText = fs.readFileSync(inputPath + filename, 'latin1')
    const dataType = filename.slice(0,1)
    const fileType = acsYears + '-year' // this is more readable than the census
    let header = d3.csvParseRows(hText)[0].map(d => d.toLowerCase())
    let data = d3.csvParseRows(dText)

    if (dataType == 'g') {
      // geography file should be first and is used to
      // populate the table
      console.log(`begin processing ${dataFiles.length} files of ${data.length} rows`)
      progressBar.start(dataFiles.length * data.length, 0)

      for (datum of data) {
        // using arrays of values because merging objects each time is o(n^2)
        datum = _.zip(header, datum)
        let fileId = datum.find(d => d[0] == 'fileid')[1]
        let fileType = `${acsYears}-year`
        let stateAbbrev = datum.find(d => d[0] == 'stusab')[1]
        let logrecno = datum.find(d => d[0] == 'logrecno')[1]
        let dataYear = year
        let geoid = datum.find(d => d[0] == 'geoid')[1]
        let dataObject = JSON.stringify(datum)
        //console.log(dataObject); process.exit()
        let q = `REPLACE INTO census_main
                 (file_id, file_type, state_abbrev, data_year, logrecno, geoid, data_object)
                 VALUES (?, ?, ?, ?, ?, ?, ?);`
        try {
          let [results, field] = await connection.execute(q,
            [fileId, fileType, stateAbbrev, dataYear, logrecno, geoid, dataObject])
        } catch (e) {
          console.log(e)
          console.log([fileId, fileType, stateAbbrev, dataYear, logrecno, geoid, dataObject])
          process.exit()
        }
        progressBar.increment()
      }
    } else {
      // the other files should be used for updating
      let headerKey = header.slice(0, 6)
      //console.log(header)
      header = header.slice(6)
      header = header.map(d => d + dataType)
      for (datum of data) {
        let datumKey = datum.slice(0, 6)
        let key = _.zipObject(headerKey, datumKey)
        datum = _.zip(header, datum.slice(6))
        let fileId = key.fileid
        let stateAbbrev = key.stusab
        let logrecno = key.logrecno
        let dataYear = year
        let geoid = key.geoid
        let dataObject = JSON.stringify(datum)
        // console.log(dataObject)
        let q = `UPDATE census_main SET
                 data_object = JSON_MERGE_PRESERVE(data_object, ?)
                 WHERE file_id = ? AND file_type = ? AND state_abbrev = ? AND data_year = ? AND logrecno = ?`
        try {
          let [results, fields] = await connection.execute(q,
            [dataObject, fileId, fileType, stateAbbrev, dataYear, logrecno])
        } catch (e) {
          console.log(e)
          process.exit()
        }
          progressBar.increment()

      }

    }
  }

  progressBar.stop()



  try { await connection.end() }
  catch (e) { console.log(e) }
  console.log('finished')
}

main()
