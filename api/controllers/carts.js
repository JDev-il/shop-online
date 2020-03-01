var connection = require("../services/mongoose");
var CartSchema = require("../models/productsSchemas/cartSchema");
var CustomerSchema = require("../models/usersSchemas/customerSchema");
var ItemSchema = require("../models/productsSchemas/itemSchema");
var ProductSchema = require("../models/productsSchemas/productSchema");
var CategorySchema = require("../models/productsSchemas/categorySchema");
var config = require("../services/authentications/userKey");
var jwtToken = require("../services/authentications/authentication");



class apiCarts {
  
  
  

  /* GET Cart
  -------------------------------------------------- */
  static getCartBeforeLogin(req, res, next) {
    CustomerSchema.findOne({email: req.body.details}, function(err, customer){
      if(err) throw err
      CartSchema.findOne({customer_id: customer._id}, function(error, found){     
          ItemSchema.find({cart_id: found._id}, function(errors, items){
            if(items.length == 0){
              res.send([false])              
            } else {
              if(items.length > 0){
              res.send([true, customer.firstname])
              }
            }
          })
      })      
    })
  }



  /* POST Create Cart
  -------------------------------------------------- */
  static createCart(req, res, next) {
    if (req.authData.customer == true) {
      CustomerSchema.findOne({ email: req.authData.email }, function(err, customer) {
        if (err) {
          throw err;
        } else {
          CartSchema.findOne({ customer_id: customer._id }, function(err, userCart) {
            if (err) return err;
            if (userCart == undefined || userCart == "" || userCart == []) {
              let date = new Date();
              let dd = String(date.getDate());
              let mm = String(date.getMonth() + 1);
              let yyyy = date.getFullYear();

              let today = yyyy + "-" + mm + "-" + dd;

              let cart = new CartSchema({
                customer_id: customer._id,
                date_created: today
              });
              //Creates New Cart//
              cart.save({ cart: cart }, function(err, cart) {                
                if (err) return err;
                res.send([true]);
              });
              //Creates New Cart//
            } else { 
              //Cart Has Items//              
              res.send([false])
              //Cart Has Items//
            }
          })}
        })
      } else {
        res.send(["Access Denied"])
      }
  }
  




  /* GET Single Cart By Customer + Items
  -------------------------------------------------- */
  static getCartByCustomer(req, res, next) {
    if (req.authData.customer == true) {
      CustomerSchema.findOne({ email: req.authData.email }, function(err,found) {
        if (err) {
          return err;
        } else {
          CartSchema.findOne({ customer_id: found._id }, function(err,userCart) {
            if (err) return err;
            if (userCart == undefined || userCart == "" || userCart == []) {
              res.send("No cart was found..")
            } else {
              /*=============================================
              =         Returning cart with items           =
              =============================================*/              
              ItemSchema.find({ cart_id: userCart._id })
              .populate("Product")
              .exec(function(err, items) {
                if (err) {
                  return err;
                } else {
                    var cartItems = []
                    cartItems.push(items)
                    var newItems = [];
                    Promise.all(cartItems[0].map(item => {                              
                      return ProductSchema.aggregate([{$match: {_id: item.product_id}}, {$sort: {_id: 1}}], function(err, res){                       
                        if(err) return err 
                        if(item.product_id = res[0]._id){
                        var newItemObj = {
                          cart_id: userCart._id,
                          itemId: item._id,
                          quantity: item.quantity,
                          total_price: item.total_price,
                          product_id: res[0]._id,
                          productName: res[0].productName,
                          price: parseInt(res[0].price),
                          category_id: res[0].category_id,
                          product_img: res[0].product_img
                        }  
                        newItems.push(newItemObj)
                      }
                    })})).then(() => {
                      newItems.sort((a, b) => (a.itemId > b.itemId) ? 1 : -1)
                      res.send([newItems])    
                      }).catch(err => {
                        if (err) {
                          return err;
                        }
                      });   
                  }
                })
              /*============  End of Section  =============*/
            }
          });
        }
      });
    } else {
      res.send(["Access Denied"]);
    }
  }




  static clearCart(req, res, next){
    if (req.authData.customer == true) {
      let cartId = req.params.id
      CartSchema.find({_id: cartId}, function(err, cart){
        ItemSchema.find({cart_id: cart[0]._id}).deleteMany().exec(function(err, removed){
          ItemSchema.find({cart_id: cart[0]._id}, function(error, allItems){
            res.send(allItems)            
          })
        })
      })
    } else {
      res.send(["Access Denied"])
    }
    
  }




}

module.exports = apiCarts;
