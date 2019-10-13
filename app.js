const express = require('express')
const morgan = require('morgan')
const app = express()
const store = require('./playstore-data.js')
const cors = require('cors')
app.use(morgan('common'))
app.use(cors())

app.get('/apps', (req, res) => {
  const { sort, genre } = req.query
  let results = store

  if(sort) {
    if(!['rating', 'app'].includes(sort)) {
      return res.status(400).send('Sort must be one of rating or app')
    }
  }
  if(sort === 'app') {
    results = store.sort((a, b) => {
      let x = a['App'].toLowerCase()
      let y = b['App'].toLowerCase()

      return x > y ? 1 : x < y ? -1 : 0
    })
  }
  else if (sort === 'rating') {
    results = results.sort((a, b) => {
      return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0
    })
  }

  if(genre) {
    if(!['action', 'arcade', 'card', 'casual', 'puzzle', 'strategy'].includes(genre.toLowerCase())) {
      return res.status(400).send('Genre must be one of Action, Arcade, Card, Casual, Puzzle or Strategy')
    }
    results = results.filter(app => {
      return app.Genres.toLowerCase() === genre.toLowerCase()
    })
  }

  return res.json(results)
})

module.exports = app;
