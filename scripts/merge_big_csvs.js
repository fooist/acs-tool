const fs = require('fs')
const cliProgress = require('cli-progress')
const d3 = require('d3')
const _ = require('lodash')

// cli parameters
const year = process.argv[2]
const acsYears = process.argv[3]

if (year == null || acsYears == null) {
  console.log('Syntax: node merge_big_csvs.js YEAR ACSTYPE')
  process.exit()
}


// useful constants
const inputPat = `./data/processed/acs/${year}_${acsYears}_yr/combined/`
const outputPath =`./data/processed/acs/${year}_${acsYears}_yr/wide/`



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


// get the list of datafiles, but make sure geography is first
const dataFiles = fs.readdirSync(dataPath)
  .filter(d => d.endsWith('.csv')&& d != 'geography.csv')
  .unshift('geography.csv)

console.log(`processing ${dataFiles.length} data files...`)

const progressBar = new cliProgress.SingleBar({etaBuffer:1000}, cliProgress.Presets.shades_classic)

progressBar.start(dataFiles.length,0)

let data = []

for (i in dataFiles) {

  // extract data from filename
  const filename = dataFiles[i]
  const dataType = filename.substr(0,1)
  const dataSequence = filename.substr(5, 4)

  // convert to array of objects
  const text = fs.readFileSync(${inputPath}${filename})
  let objects = d3.csvParse(text)

  // make object keys "e" for estimate or "m" for margin or error
  objects.columns = object.columns.map(d => columnRenamer(d, dataType))
  objects.map(d => objectColumnRenamer(d, dataType))


  // add them to the list of objects
  if (data.length == 0) {
    data = objects
  // else we're going to (painfully slowly) merge the files
  } else {
    data.columns =
    for (i in data) {
      const d = _.union(data[i].columns, o.colums)

      // find the matching data object
      const oIndex = objects.findIndex(el => {
        el.FILEID == o.FILEID &&
        el.STUSAB == o.STUSAB &&
        el.CHARITER == o.CHARITER &&
        el.LOGRECNO == o.LOGRECNO
      })

      // if there's a match get it and merge it
      if (oIndex != -1) {
        const o = objects.splice(oIndex, 1)
        data[i] = Object.merge(d, o)
      }
    }
  }
  progressBar.increment()
}
progressBar.stop()



const newFilename = 'wide.csv'
const newCsv =  d3.csvFormat(data)
fs.writeFileSync(`${outputPath}${newFilename}`, newCsv ,'utf8')

function columnRenamer(d, type) {
  if (['FILEID','STUSAB', 'CHARITER','LOGRECNO'].find(d) != -1) {
    return d+type
  } else {
    return d
  }
)

function objectColumnsRenamer(d, type) {
  let keys = Object.keys()
  let values = Object.values()
  keys = keys.map(k => columnRenamer(k, type))
  return _.zipObject(keys, values)
}


