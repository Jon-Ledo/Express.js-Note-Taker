const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const htmlRoute = require('./routes/html')
const apiRoute = require('./routes/api')

// middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', apiRoute)
app.use('/', htmlRoute)

app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})
