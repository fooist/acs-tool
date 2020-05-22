const fs = require('fs')
const Papa = require('papaparse')
const cliProgress = require('cli-progress')

const headerDir = '../headers/'
const dataDir = '../combinedFiles/'
const outputDir = '../tallFiles/'

const fieldsFile = outputDir + 'fields.csv'
const dataFile = outputDir + 'data.csv'

try {
  fs.unlinkSync(outputDir + '*')
} catch {}
try {
  fs.rmdirSync(outputDir)
} catch {}
try {
  fs.mkdirSync(outputDir)
} catch {}

  const fieldsFD = fs.openSync(fieldsFile, 'w', {encoding: 'utf8'})
  const dataFD = fs.openSync(dataFile, 'w', {encoding: 'utf8'})

const inputDataFiles = fs.readdirSync(dataDir)

// setup and begin the progress bar
const progressBar = new cliProgress.SingleBar({etaBuffer:10}, cliProgress.    Presets.shades_classic)
console.log(`processing ${inputDataFiles.length} sets of header and data files`)
progressBar.start(inputDataFiles.length,0)


  // loop through data files, using them to create entries
// in the fields definitions files and the data files
for (i in inputDataFiles) {

  // get the name of the data file file
  const filename = inputDataFiles[i]


  // skip the geography.txt file
  if (filename == 'geography.txt') {
    continue
  }
  // use that the get and read the field header info
  const headerString = fs.readFileSync(headerDir + filename, {encoding:'utf8'})
  const fieldData = Papa.parse(headerString)

  // get the fieldnames following the first six (which are the geo id, etc)
  const fieldNames = fieldData.data[0].slice(6)

  // get the definitions of those fields
  const fieldDefinitions = fieldData.data[1].slice(6)

  // loop through the fieldnames and add a row for each field/deifinition
  for (j in fieldNames) {
    const row = `${filename},${fieldNames[j]},"${fieldDefinitions[j]}"\n`

    fs.writeSync(fieldsFD, row)
  }

  // open the data file with papaparse and use step function to split
  // up each row
  const data = fs.readFileSync(dataDir + filename, {encoding: 'utf8'})
  Papa.parse(data, {
    //worker: true,
    step: function (row) {
      // first six rows have the unique key
      const key = row.data.slice(0,6)

      // the remaining fields have data
      const data  = row.data.slice(6)
      for (j in data) {
        const datum = key.concat(data[j])
        const csv = Papa.unparse({data:datum}) + "\n"
        fs.writeSync(dataFD, csv)

      }
      //console.log(row.data)
    }
  })
  progressBar.increment()

}
fs.closeSync(fieldsFD)
fs.closeSync(dataFD)
