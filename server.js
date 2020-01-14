const express = require('express')
const app = express()
const port = 8080

// respond with "hello world" when a GET request is made to the homepage
// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage')
  })
  
  // POST method route
  app.post('/', function (req, res) {
    res.send('POST request to the homepage')
  })

  app.get('/json', function (req, res) {
    let obj = {
        aaa: "bbb",
        bbb: "ccc"
    }

    res.send(JSON.stringify(obj))
  })

  app.listen(port, () => console.log(`app listening on port ${port}!`))