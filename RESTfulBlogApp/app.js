var bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  express = require('express'),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer')
app = express()

// APP CONFIG
mongoose.connect('mongodb://localhost/restful_blog_app')
app.set('view engine', 'ejs')
//fo css
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSanitizer())
app.use(methodOverride('_method'))

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now } //default
})

var Blog = mongoose.model('Blog', blogSchema)

//RESTful routes
app.get('/', (req, res) => {
  res.redirect('/blogs')
})
//new route
app.get('/blogs/new', (req, res) => {
  res.render('new')
})

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blog) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', { blogs: blog })
    }
  })
})

//create route
app.post('/blogs', (req, res) => {
  req.body.body = req.sanitize(req.body.body)
  Blog.create(
    {
      title: req.body.title,
      image: req.body.image,
      body: req.body.body
    },
    (err, blogs) => {
      if (err) {
        res.render('new')
      } else {
        res.redirect('/blogs')
      }
    }
  )
})

app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, post) => {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.render('show', { blog: post })
    }
  })
})

//EDIT

app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.render('edit', { blogs: blog })
    }
  })
})

//UPDATE ROUTE

app.put('/blogs/:id', (req, res) => {
  var updatedBlog = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.body
  }
  Blog.findByIdAndUpdate(req.params.id, updatedBlog, (err, blog) => {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs/' + req.params.id)
    }
  })
})

//DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
  //detroy blog
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/blogs')
    } else {
      res.redirect('/blogs')
    }
  })
  //redirect
})
app.listen(3000, function () {
  console.log('SERVER IS RUNNING!')
})
