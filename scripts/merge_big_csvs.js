const fs = require('fs')
const cliProgress = require('cli-progress')
const d3 = require('d3')
const _ = require('lodash')
const Papa = require('papaparse')

// cli parameters
const year = process.argv[2]
const acsYears = process.argv[3]

if (year == null || acsYears == null) {
  console.log('Syntax: node merge_big_csvs.js YEAR ACSTYPE')
  process.exit()
}


// useful constants
const inputPath = `./data/processed/acs/${year}_${acsYears}_yr/combined/`
const headerPath = `./data/processed/acs/${year}_${acsYears}_yr/headers/`
const outputPath =`./data/processed/acs/${year}_${acsYears}_yr/wide/`


// important variables
let data = [] // the main dataset to be written out at the end


// prepare the output directory
console.log('preparing output directory...')
try {
  fs.mkdirSync(outputPath)
  console.log('created output directory')
} catch {
  fs.readdirSync(outputPath).forEach(f => fs.unlinkSync(outputPath+f))
  fs.rmdirSync(outputPath, {recursive: true})
  fs.mkdirSync(outputPath)
  console.log('cleared output directory')
}


// get the list of datafiles, but put geography first
const dataFiles = fs.readdirSync(inputPath)
  .filter(d => d.endsWith('.csv')&& d != 'geography.csv')
dataFiles.unshift('geography.csv')
console.log(dataFiles)
// set up a progress bar to measure based on # of files including geo
const progressBar = new cliProgress.SingleBar({etaBuffer:10}, cliProgress.Presets.shades_classic)

// display the bar
console.log(`processing ${dataFiles.length * 1000} data files...`)
//progressBar.start(100000,0)


// loop through the rows of each file to combine rows
for (filename of dataFiles) {
  const hText = fs.readFileSync(headerPath + filename, 'latin1')
  const dText = fs.readFileSync(inputPath + filename, 'latin1')
  const dataType = filename.slice(0,1)

  // rows is a variable because we'll be popping things out of it
  let header = Papa.parse(hText)

  // for the first file (geography) just make it the dataset
  if (data.length == 0) {
    data.push(header)
    Papa.parse(dText, {step: function(results, parser) {
        data.push(results.data)
        progressBar.increment()
        console.log(results.data)
    }, header: false
  })
    continue // skip the rest of the loop
  }


/*
  for (i in data) {

    // get the keys to match
    let fileid = data[i][0]  // FILEID from the original file
    let stusab = data[i][1]   // STUSB from the original file
    let logrecno = data[i][4] // LOGRECNO from the original file

    // next extract the matching object
    // usually this should be the next one in the file
    // but in case it's not we find the match and remove it from
    // the array. this should be pretty close to o(n) because we're
    // shortening the array each time. plus the match *should* be at the
    // top.
    //
    // goes to o(n^2) if there are a lot of misses

    let matchIndex = rows.findIndex(d => {
      return fileid==d[0] && stusab == d[2] && logrecno == d[5]
    })

    // if there wasn't a match, go to the next row
    if (matchIndex == -1) {
      continue
    }

    // remove the matching rows
    let row = rows.splice(matchIndex, 1)

    // remove the indexing columns
    row.splice(0,6)

    // if it's the header row, rename the variables based on data type
    if (i == 0) {
      row = row.map(d => d+dataType)
    }

    // append the row from the news data to the end of the row of existing data
    data[i].concat(row)
  }*/
}





// write it out to a big file`
const newFilename = 'wide.csv'
const newCsv =  d3.csvFormat(data)
fs.writeFileSync(`${outputPath}${newFilename}`, newCsv ,'utf8')



