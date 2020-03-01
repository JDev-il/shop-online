var connection = require('../services/mongoose')
var CartSchema = require("../models/productsSchemas/cartSchema");
var CustomerSchema = require("../models/usersSchemas/customerSchema");
var ItemSchema = require("../models/productsSchemas/itemSchema");
var ProductSchema = require("../models/productsSchemas/productSchema");
var CategorySchema = require('../models/productsSchemas/categorySchema');
var config = require("../services/authentications/userKey");
var jwtToken = require('../services/authentications/authentication')

class apiItems {

    


    /* POST Add Items To Cart (product/s in cart)
    -------------------------------------------------- */
    static addItemsToCart(req, res, next) {
     if (req.authData.customer == true) {
      CustomerSchema.findOne({ email: req.authData.email }, function(
        err,
        customer
      ) {
        if (err) {
          throw err;
        } else {
          CartSchema.findOne({ customer_id: customer._id }, function(error,cart) {
            if (error) {
              throw error;
            } else {
              ItemSchema.aggregate([{$match: {product_id: req.body[0]._id}}], function(err, result){                          
                  if(result = [] || result == ""){                    
                    var newItem = new ItemSchema({
                    product_id: req.body[0]._id,
                    quantity: req.body[1],
                    total_price: parseInt(req.body[0].price) * req.body[1],
                    cart_id: cart._id
                  });
                  newItem.save(function(errors, saved) {
                    if (errors) {
                      throw errors;
                    } else {
                      ItemSchema.find({ cart_id: saved.cart_id }, function(errors, allItems){
                        if(errors) throw err
                        res.send([allItems])              
                      })
                    }})
                } else {
                  res.send(["Error"])
                }       
              })
            }
          });
        }
      });
      } else {
        res.send(["Access Denied"]);
    }
  }



    /* POST Add Items To Cart (product/s in cart)
    -------------------------------------------------- */
    static editItemInCart (req, res, next){
        if(req.authData.customer == true){
          var originalPrice = req.body[0].total_price / req.body[0].quantity
          var newQuantity = req.body[1]

          var totalPrice = originalPrice * newQuantity

          var currentItemsInCart = req.body[2]
          var itemsArray = []
          
          var newArrayOfItems = []

          CustomerSchema.findOne({email: req.authData.email}, function(error, customer){
            if(customer){

              ItemSchema.updateOne({product_id: req.body[0].product_id}, {$set: {quantity: newQuantity, total_price: totalPrice, cart_id: req.body[0].cart_id}}, {upsert: true}, function(err, updated){
                if(err) throw err
                if(updated.nModified == 1){
                ItemSchema.find({cart_id: req.body[0].cart_id}, function(err, items){
                  itemsArray.push(items)
                  Promise.all(itemsArray[0].map(updatedItems=>{   
                    return ProductSchema.findOne({_id: updatedItems.product_id}, function(err, prod){  
                      var itemsObj = {
                        cart_id: updatedItems.cart_id,
                        itemId: updatedItems._id,
                        quantity: updatedItems.quantity,
                        total_price: updatedItems.total_price,
                        product_id: prod._id,
                        productName: prod.productName,
                        price: parseInt(prod.price),
                        category_id: prod.category_id,
                        product_img: prod.product_img
                      }           
                      newArrayOfItems.push(itemsObj)
                    })
                  })).then(()=>{
                    newArrayOfItems.sort((a, b) => (a.itemId > b.itemId) ? 1 : -1)
                    res.send([newArrayOfItems]).end()
                  }).catch(err=>{
                    if(err) throw err
                  })
                })
                } else {
                  return false
                }                
              })
            } else {
              return false
            }
          })
        } else {
          res.send(['Access Denied'])  
        }

    }


    /* DELETE Items From Cart
    -------------------------------------------------- */
    static removeItemFormCart(req, res, next){
      if(req.authData.customer == true){
        var afterDeleteItems = []
        var itemArr= []
        ItemSchema.find({cart_id: req.body.cart_id}, function(err, items){
          if (err) throw err
          items.map(item=>{
            if(item.product_id == req.body.product_id){
              itemArr.push(item)
            }
          })  
          ItemSchema.deleteOne({_id: itemArr[0]._id}, function(error, removed){
            if(error) throw error
            if(removed.ok == 1){
              ItemSchema.find({cart_id: req.body.cart_id}, function(errors, itemsArr){
                if(errors) throw errors
                if(itemsArr.length > 0){
                  Promise.all(itemsArr.map((findItem, index)=>{                    
                    return ProductSchema.findOne({_id: findItem.product_id}, function(err, prod){
                      var itemsObj = {
                        cart_id: findItem.cart_id,
                        itemId: findItem._id,
                        quantity: findItem.quantity,
                        total_price: findItem.total_price,
                        product_id: prod._id,
                        productName: prod.productName,
                        price: parseInt(prod.price),
                        category_id: prod.category_id,
                        product_img: prod.product_img
                      }
                      afterDeleteItems.push(itemsObj)
                    })
                  })).then(()=>{
                    afterDeleteItems.sort((a, b) => (a.itemId > b.itemId) ? 1 : -1)
                    res.send([afterDeleteItems]).end()
                  }).catch(err=>{
                    if(err) throw err
                  })
                } else {
                    res.send([]).end()                  
                }
              })
            } else {
              res.send(["Error Removing Items"])              
            }
          })
        })
      } else {
        res.send(["Access Denied"])
      }

  }




  /* Search Items In Checkout Section
  -------------------------------------------------- */
  static searchItemInCheckout(req, res, next){    
    if(req.authData.customer == true){
      const val = req.body.searchItems
      var regVal = new RegExp(val.charAt(0).toUpperCase() + val.slice(1))
      var arrLong = []
      CustomerSchema.findOne({email: req.authData.email}, function(err, customer){
        if(err) throw err
          CartSchema.findOne({customer_id: customer._id}, function(error, cart){
            if(error) throw error            
                ProductSchema.find({}, function(e, products){
                  if(e) throw e
                    Promise.all(products.map(prod=>{
                      if(regVal.test(prod.productName)){
                        if(arrLong.length < 1){
                          arrLong.push(prod)                                
                        } else {
                          return false
                        }
                      }
                })).then(()=>{
                  ItemSchema.aggregate([{$match: {product_id: arrLong[0]._id}}], function(errors, itemInCart){
                    if(errors) throw errors
                    if(itemInCart[0] !== undefined){
                      if(arrLong[0]._id = itemInCart[0].product_id){
                        res.send([arrLong[0]])
                        } else {
                          res.send(["Item empty"])
                      }
                    } else {
                      return false
                    }
                   })
                 }).catch(err=>{
                   if(err) return false
                 })
                })
              })         
           })
      } else {
      res.send(["Access Denied"])
    }

  }   




}


module.exports = apiItems


