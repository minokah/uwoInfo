var data = require("./data")
var database = require("./database")
var scraper = require("./scraper")

var fs = require("fs")
var pages = {}
pages["index"] = fs.readFileSync("index.html").toString()
pages["courses"] = fs.readFileSync("courses.html").toString()
pages["modules"] = fs.readFileSync("modules.html").toString()
pages["info"] = fs.readFileSync("info.html").toString()
pages["profile"] = fs.readFileSync("profile.html").toString()
pages["about"] = fs.readFileSync("about.html").toString()

var express = require('express');
var app = express()
var port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(pages["index"])
})

app.get('/courses', async (req, res) => {
  res.send(pages["courses"])
})

app.get('/modules', (req, res) => {
  res.send(pages["modules"])
})

app.get('/info', async (req, res) => {
  res.send(pages["info"])
})

app.get('/profile', (req, res) => {
  res.send(pages["profile"])
})

app.get('/about', (req, res) => {
  res.send(pages["about"])
})


// api i guess?
// get listing for either course categories or full course listing
app.get("/listing", (req, res) => {
  var list = {}
  var query = req.query.get
  if (query == null || query == "") query = "list,cat" // everything

  query = query.split(",")

  for (var i = 0; i != query.length; i++) {
    if (query[i] == "list") list.listing = scraper
    else if (query[i] == "cat") list.cat = data.courseCategories
  }

  res.send(JSON.stringify(list))
})

// databases
var emailRegex = /^.+@.+\..+$/
var alphanumRegex = /^[0-9a-zA-Z]+$/

/*

    Account Management

*/

app.get('/createAccount', async (req, res) => {
  if (req.query == null || req.query.username == null || req.query.username.length == 0 || !req.query.username.match(alphanumRegex) || req.query.password == null || req.query.password.length < 6 || req.query.email == null || !emailRegex.test(req.query.email)) {
    res.send(JSON.stringify({ success: 0, message: "Invalid input" }))
    return
  }

  await database.createAccount(req.query.username, req.query.password, req.query.email)
    .then((hash) => {
      res.send(JSON.stringify({ success: 1, hash: hash }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})

app.get('/loginAccount', async (req, res) => {
  if (req.query == null || req.query.username == null || req.query.username.length == 0 || req.query.password == null || req.query.password.length < 6) {
    res.send(JSON.stringify({ success: 0, message: "Invalid input" }))
  }

  await database.loginAccount(req.query.username, req.query.password)
    .then((hash) => {
      res.send(JSON.stringify({ success: 1, hash: hash }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})

app.get('/changePassword', async (req, res) => {
  console.log(req.query)
  if (req.query == null || req.query.username == null || req.query.username.length == 0 || req.query.hash == null || req.query.hash.length == 0 || req.query.old == null || req.query.old.length < 6 || req.query.new == null || req.query.new.length < 6) {
    res.send(JSON.stringify({ success: 0, message: "Invalid input" }))
  }

  await database.changePassword(req.query.username, req.query.hash, req.query.old, req.query.new)
    .then((hash) => {
      res.send(JSON.stringify({ success: 1, hash: hash }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})

app.get('/deleteAccount', async (req, res) => {
  if (req.query == null || req.query.username == null || req.query.username.length == 0 || req.query.hash == null || req.query.hash.length == 0) {
    res.send(JSON.stringify({ success: 0, message: "Invalid input" }))
  }

  await database.deleteAccount(req.query.username, req.query.hash)
    .then(() => {
      res.send(JSON.stringify({ success: 1 }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})


/*

    Course and Review Queries

*/

app.get('/getReviews', async (req, res) => {
  if (req.query == null || req.query.course == null || req.query.course.length == 0) {
    res.send(JSON.stringify({ success: 0, message: "Invalid course name" }))
    return
  }

  await database.getReviews(req.query.course)
    .then((reviews) => {
      res.send(JSON.stringify({ success: 1, reviews: reviews }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})

app.get('/postReview', async (req, res) => {
  if (req.query == null || req.query.course == null || req.query.course.length == 0 || req.query.username == null || req.query.username.length == 0 || req.query.hash == null || req.query.hash.length == 0 || req.query.liked == null || parseInt(req.query.liked) < 1 || parseInt(req.query.liked) > 5 || req.query.easy == null || parseInt(req.query.easy) < 1 || parseInt(req.query.easy) > 5 || req.query.useful == null || parseInt(req.query.useful) < 1 || parseInt(req.query.useful) > 5 || req.query.anonymous == null || req.query.description == null || req.query.description.split(" ").length < 6) {
    res.send(JSON.stringify({ success: 0, message: "Invalid input" }))
    return
  }

  await database.postReview(req.query.username, req.query.hash, req.query.course, req.query.liked, req.query.easy, req.query.useful, req.query.anonymous, req.query.description)
    .then(() => {
      res.send(JSON.stringify({ success: 1 }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})

app.get('/deleteReview', async (req, res) => {
  if (req.query == null || req.query.course == null || req.query.course.length == 0 || req.query.username == null || req.query.username.length == 0 || req.query.hash == null || req.query.hash.length == 0) {
    res.send(JSON.stringify({ success: 0, message: "Invalid input" }))
    return
  }

  await database.deleteReview(req.query.username, req.query.hash, req.query.course)
    .then(() => {
      res.send(JSON.stringify({ success: 1 }))
    })
    .catch((err) => {
      res.send(JSON.stringify({ success: 0, message: err }))
    })
})

// --------------------------------------

app.listen(port, () => {
  console.log(`Site open on port ${port}`)
})
