const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Papa = require('papaparse')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

// papa parse below
const csvPath = path.join(__dirname, 'cohorts.csv')
const csv = fs.readFileSync(csvPath, 'utf8')
const options = { header: true, skipEmptyLines: true, dynamicTyping: true }
const data = Papa.parse(csv, options)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(morgan('tiny'))
app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res)=> {
    res.send(data.data)
})
app.get('/:id', (req, res, next)=>{
    let id = req.params.id
    let idData = data.data.filter(item => item['ID'] == id)
    if (idData.length == 0){
        next({'status':500, 'error': "No matching ID"})
    } else {
        res.send(idData)
    }
})
app.use((err, req, res, next)=> {
    res.status(err.status).send({'error': err.error})
})
app.use((req, res)=>{
    res.status(404).send({'error': "Nothing here."})
})

const listener = ()=> console.log(`We are serving up data on port: ${port}`)

app.listen(port, listener)
