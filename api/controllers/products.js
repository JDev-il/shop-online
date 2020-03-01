var connection = require('../services/mongoose');
var ProductSchema = require('../models/productsSchemas/productSchema');
var CategorySchema = require('../models/productsSchemas/categorySchema');
var config = require("../services/authentications/userKey");
var jwtToken = require('../services/authentications/authentication')

class apiProducts {




    /* GET All Products
    -------------------------------------------------- */
    static getAllProducts(req, res, next){
        ProductSchema.find({}, function(err, products){
            if(err){
                res.send(["Error"])
            } else {
                res.send([products])      
            }
        })
    }




    /* GET Single Product
    -------------------------------------------------- */
    static getSingleProduct(req, res, next){
        res.send("Get Single Product")
    }


    

    /* Search Products In Store
    -------------------------------------------------- */
    static postSearchedProduct(req, res, next){
        if(req.body.searchData){
            const val = req.body.searchData
            var regVal = new RegExp(val.charAt(0).toUpperCase() + val.slice(1))
            var arrLong = []
                ProductSchema.find({}, function(err, products){
                    if(err) throw err
                    products.map(prod=>{
                            if(regVal.test(prod.productName)){
                                arrLong.push(prod)                                
                            }
                    })
                    res.send([arrLong])
                 })         
        } else {
            res.send(["error"])
        }

    }



    /* POST Single Product
    -------------------------------------------------- */
    static postSingleProduct(req, res, next){
        if(req.authData.customer == false){
            const productDetails = new ProductSchema ({
                productName: req.body.name,
                category_id: req.body.category,
                price: req.body.price,
                product_img: req.body.image,
            })
            productDetails.save({Product: productDetails}, function(err, saved){
                if(err) return err
                res.send(["Saved!"])
            })
        } else {
            res.sendStatus(403)
        }
    }




    /* POST Files (Images)
    -------------------------------------------------- */
    static postFiles(req, res, next){
        if(req.file != "" || req.file == null){
                res.send([req.file])
        } else {
            res.send(500)
        }
    }




    /* PUT Edit Product 
    -------------------------------------------------- */
    static putEditProduct(req, res, next){
        if(req.authData.customer == false){

            var findProduct = req.body.id

            const updatedDetails = new ProductSchema({
                productName: req.body.productname,
                category_id: req.body.category_id,
                price: req.body.price,
                product_img: req.body.image,
            })
            ProductSchema.updateOne({_id: findProduct}, {$set:{productName: updatedDetails.productName, category_id: updatedDetails.category_id, price: updatedDetails.price, product_img: updatedDetails.product_img}}, function(err, result){
                if(err){
                    throw err
                }
                res.send([result])
            })
            } else {
            res.sendStatus(403)
        }        
    }




    /**
    CATEGORIES SECTION
    */

    /* GET All Categories
    -------------------------------------------------- */
    static getCategories(req, res, next){
        CategorySchema.find({}, function(err, categories){
            res.send(categories)
        })
    }




    /* GET Filtered Categories
    -------------------------------------------------- */
    static getilteredCategories(req, res, next){
        ProductSchema.find({}, function(err, prod){
          if(err) throw err
          if(prod == [] || prod == undefined){
            res.send("not found")
        } else {
                var products = []
                products.push(prod)
                products[0].sort((a, b)=> a - b)
                var arrCat = []
                var newCatArr = []
                var unique;
                        Promise.all(products[0].map(prodCat=>{   
                        return CategorySchema.find({_id: prodCat.category_id}, function(err, result){
                            if(err) throw err
                            arrCat.push(result[0].category)
                            unique = [...new Set(arrCat)];
                            })
                        }
                        )).then(()=>{
                        Promise.all(unique.map(u=>{
                            return CategorySchema.findOne({category: u}, function(error, found){
                                if(error) throw err
                                if(found.category == u){    
                                    newCatArr.push(found)
                                } else {
                                    return false
                                }
                            })
                        })).then(()=>{                    
                            newCatArr.sort((a, b)=>{return a.category > b.category ? 1 : -1})
                        }).then(()=>{                    
                            if(newCatArr.length == unique.length){    
                                res.send(newCatArr)                        
                            } else {
                                return false
                            }
                        })
                    }).catch(err=>{
                        if(err){
                            console.log("Error");
                            return false
                         }
                    })              
                }
           })          
      }

    /**
    CATEGORIES SECTION
   */




}




module.exports = apiProducts