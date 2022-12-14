require("dotenv").config();
const express = require("express");

const db = require('./db.js')

const app = express();

app.use(express.json())

app.listen(3000, ()=> console.log("Server listening at port 3000"))

//loader.io
app.get(process.env.TOKEN, (req, res) => {
  res.send(process.env.TOKEN);
})

app.get('/products', (req, res) => {
  let page = req.query.page || 1
  let count = req.query.count || 5
  if(page === 1){
    db.getProductsListDefaultPage(count)
    .then((result) => {
      res.status(200).send(result.rows)
    })
    .catch((err) => console.log(err))
  } else {
    db.getProductsListCustomPage(count, page)
    .then((result) => {
      res.status(200).send(result.rows)
    })
    .catch((err) => console.log(err))
  }
})

app.get(`/products/:product_id/related`, (req, res) =>{
  db.getRelatedProducts(req.params.product_id)
  .then((result) => {
    res.status(200).send(result.rows[0].json_agg)
  })
  .catch(err => console.log(err))
})

app.get(`/products/:product_id`, (req, res) =>{
  db.getProductInfo(req.params.product_id)
  .then((result) => {
    res.status(200).send(result.rows[0].productsobj)
  })
  .catch(err => console.log(err))
})

app.get(`/products/:product_id/styles`, (req, res) =>{
  db.getProductStyles(req.params.product_id)
  .then((result) => {
    res.status(200).send(result.rows[0])
  })
  .catch(err => console.log(err))
})

//add EXPLAIN ANALYZE in front of query to see