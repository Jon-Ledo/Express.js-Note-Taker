const express = require('express')
const app = express()
const path = require('path')
const port = 5000
const { readFile, writeFile } = require('fs')
const noteData = require('./db/db.json')
const { v4: uuidv4 } = require('uuid')

// middlewares
app.use(express.static('public'))
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
})

// GET request for notes
app.get('/api/notes', (req, res) => {
  res.status(200).json(noteData)

  console.info(`${req.method} request received to get notes`)
})

// POST request to add a note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`)

  const { title, text } = req.body

  if (title && text) {
    const id = uuidv4()
    const newNote = {
      title,
      text,
      id,
    }

    readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      } else {
        // convert data into JSON
        const parsedData = JSON.parse(data)

        // push new note into previous data array
        parsedData.push(newNote)

        writeFile(
          './db/db.json',
          JSON.stringify(parsedData, null, 4),
          (err) => {
            if (err) {
              console.error(err)
            } else {
              console.info('Updated notes')
            }
          }
        )
      }
    })

    const response = {
      status: 'success',
      body: newNote,
    }

    console.log(response)
    res.status(201).json(response)
  } else {
    res.status(500).json('Error in posting note')
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(port, () => {
  console.log(`listening on port ${port}...`)
})
