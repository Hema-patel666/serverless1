const serverless = require('serverless-http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid').v4;

const dbConnection = require('../config/dbconfig');
const ProductService = require('../Services/product');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  base url to test our API
app.get('/index', async (req, res) => {
   await res.send("Welcome to the Product API for LogRocket Blog serverless Example!!")
})


//  function for creating a new product
app.post('/in',async(req,res)=>{
    console.log("Hello")
    await res.send("hello")
})
// this is test line
app.post('/add', async (req, res) => {
  try {
      console.log("postdata...")
      await dbConnection();
   const data  = req.body;
   const {name, type, description, cost} = data;
 if(!data) 
 {
     return "Please pass all required fields!"
  }
   const dataToSave = {name,type,description,cost,productId:uuid()};
   let createProduct =  await ProductService.createProduct(dataToSave);
   if (createProduct) {
     return res.status(200).send(
       createProduct
    )
   }
  }
   catch (error) {
   
    console.log(error, "error!!");
  }
})

//  function for getting all products
app.get('/lists', async (req, res) => {
try {
    await dbConnection();
    const allProducts = await ProductService.getAllProduct();
    if (allProducts) {
      return res.status(200).send({
        data: allProducts,
        msg:"hello"
      })
    }
  } catch (error) {
     //  handle errors here
     console.log(error, "error!!");
  }
})


//  function for getting a  product by Id
app.get('/:productId', async (req, res) => {
  try {
    await dbConnection();
    const id = req.params.productId;
    const getProduct = await ProductService.getProductById(id);
    if(getProduct) {
      return res.status(200).send({
        data: getProduct
      })
    }
  } catch (error) {
     //  handle errors here
     console.log(error, "error!!");
  }
});

module.exports.handler = serverless(app);