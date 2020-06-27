const fs = require('fs')
const cliProgress = require('cli-progress')


let year = process.argv[2]
let acsYears = process.argv[3]

if (year == null || acsYears == null) {
  console.log('Syntax: node create_headers.js YEAR ACSTYPE')
  process.exit()
}

const dataPath = `./data/raw/acs/${year}_${acsYears}_yr/data/`
const outputPath = `./data/processed/acs/${year}_${acsYears}_yr/combined/`

console.log('preparing output directory...')
try {
  fs.mkdirSync(outputPath)
  console.log('created output directory')
} catch {
  fs.readdirSync(outputPath).forEach(f => fs.unlinkSync(outputPath+f))
  fs.rmdirSync(outputPath, {recursive: true})
  fs.mkdirSync(outputPath)
}


const dataFiles = fs.readdirSync(dataPath)
  .filter(d => /.*(txt|csv)$/.test(d))
  .filter(d => /^g.*txt$/.test(d) == false)
//console.log(dataFiles.length)


console.log(`processing ${dataFiles.length} data files...`)

const progressBar = new cliProgress.SingleBar({etaBuffer:1000}, cliProgress.Presets.shades_classic)


progressBar.start(dataFiles.length,0)

for (i in dataFiles) {
  const filename = dataFiles[i]
  const data = fs.readFileSync(`${dataPath}${filename}`)
  //console.log(data.length)
  const dataType = filename.substr(0,1)
  const dataYear = filename.substr(1,4)
  const dataPeriod = filename.substr(5,1)
  const dataState = filename.substr(6,2)
  const dataSequence = filename.substr(8, 4)
  const dataSubSequence = filename.substr(12, 3)
  let newFilename;
  if (dataType == 'g') {
    newFilename = `geography.csv`
  } else {
    newFilename = `${dataType}.seq${dataSequence}.csv`
  }
  //console.log(filename)
  //console.log(`append ${dataState} '${dataType}' records to ${newFilename}`)
  fs.appendFileSync(`${outputPath}${newFilename}`, data ,'utf8')
  progressBar.increment()
}

progressBar.stop()
