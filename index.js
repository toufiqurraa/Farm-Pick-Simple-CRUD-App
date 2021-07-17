const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

const Product = require('./models/product')
const methorOverride = require('method-override')

mongoose
  .connect('mongodb://localhost:27017/farmStand', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MONGO CONNECTION OPEN!!!')
  })
  .catch((err) => {
    console.log('MONGO CONNECTION ERROR!!!!')
    console.log(err)
  })

// The views is a configuration variable that sets folder from which express will grab templates.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // This middleware is used to get the request body
app.use(methorOverride('_method')) // Method override is used to access put request in form

app.get('/products', async (req, res) => {
  const products = await Product.find({}) // Find {every} products

  res.render('products/index', { products })
})

app.get('/products/new', (req, res) => {
  res.render('products/new')
})

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()

  res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)

  res.render('products/edit', { product })
})

app.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  })
  res.redirect(`/products/${product._id}`)
})

app.listen(8080, () => {
  console.log('App is listening to port 8080')
})