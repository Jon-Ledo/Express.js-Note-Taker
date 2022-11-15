const router = require('express').Router()
const { readFile, writeFile } = require('fs')
const noteData = require('../db/db.json')
const { v4: uuidv4 } = require('uuid')

// GET request for notes
router.get('/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`)
  readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log('get route api/notes ')
      res.status(200).json(JSON.parse(data))
    }
  })
})

// POST request to add a note
router.post('/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`)

  console.log('calling post api method')

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

// DELETE target note
router.delete('/notes/:id', (req, res) => {
  console.info(`${req.method} request received to delete a note`)
  const { id } = req.params

  readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      // convert data into JSON
      const parsedData = JSON.parse(data)

      // use note ID to find index in db.json
      const index = parsedData.findIndex((note) => {
        return note.id === id
      })

      // splice method to delete note
      const removed = parsedData.splice(index, 1)

      // write db.json with new changes
      writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) => {
        if (err) {
          console.error(err)
        } else {
          console.info('Deleted Note')
        }
      })

      const response = {
        status: 'deleted',
        body: removed,
      }

      console.log(response)
      res.status(200).json(response)
    }
  })
})

module.exports = router
