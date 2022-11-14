const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./public'))
app.use(express.json())

app.get('/notes', (req, res) => {
  console.log('connected')
})

app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})
