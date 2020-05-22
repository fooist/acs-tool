const XLSX = require('xlsx')
const fs = require('fs')

let templatePath = '../2018_1yr_Summary_FileTemplates/'
let outputPath = '../headers/'

let templates = fs.readdirSync(templatePath)
  .filter(d => d.endsWith('xlsx'))

try {
  fs.mkdirSync(outputPath)
  console.log(`created header files  directory as ${outputPath}`)
} catch {
  console.log(`header files directory already exists`)
}
console.log(`Read ${templates.length} template files from '${templatePath}'.`)

for (const i in templates) {
  const template = templates[i]
  const workbook = XLSX.readFile(`${templatePath}/${template}`)
  const seq =  template.substr(3,template.length - 8).padStart(4,'0')
  for (const sheetName in workbook.Sheets) {
    const worksheet = workbook.Sheets[sheetName]
    const txt = XLSX.utils.sheet_to_csv(worksheet)
    let txtName
    if (seq.substr(0,1) == '0') {
       txtName = `${outputPath}${sheetName}.seq${seq}.csv`
    } else {
      txtName = `${outputPath}geography.csv`
    }
    fs.writeFileSync(txtName, txt)
  }
}
