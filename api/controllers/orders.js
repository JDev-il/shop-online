var connection = require('../services/mongoose');
var OrderSchema = require('../models/ordersSchemas/orderSchema')
var CartSchema = require("../models/productsSchemas/cartSchema");
var CustomerSchema = require("../models/usersSchemas/customerSchema");
var jwtToken = require('../services/authentications/authentication')

class apiOrders {



    
    /* GET All Orders
    -------------------------------------------------- */
    static getAllOrders(req, res, next){
        OrderSchema.find({}, function(err, orders){
            if(err) throw err            
            res.send([orders])
        })
    }    



    
    /* POST Place Order
    -------------------------------------------------- */
    static postPlaceOrder(req, res, next){
        if(req.authData.customer == true){     
            CustomerSchema.findOne({email: req.authData.email}, function(err, customer){
                if(err) throw err
                CartSchema.findOne({customer_id: customer._id}, function(error, cart){
                    if(error) throw error
                                      
                    let digitsObj = Object.entries(req.body.orderDetails.cd_4_last_digits)
                    let matchReg = digitsObj[0][1].match(/\d{4}\s*$/g).map(Number)

                    var order = new OrderSchema({
                        customer_id: customer._id,
                        cart_id: cart._id,
                        total_price: req.body.orderDetails.total_price,
                        shipping_address: {
                            city: req.body.orderDetails.city,
                            street: req.body.orderDetails.street,
                        },
                        shipping_date: new Date(req.body.orderDetails.shipping_date),
                        order_date: new Date(),
                        cd_4_last_digits: matchReg[0]
                    })
                    order.save(function(errors){
                        if(errors){
                            res.send([false]).end()
                        }
                        res.send([true]).end()
                    })
                })
            })
        } else {
        res.send(["Access Denied"])
        }
    }
    
    

    /* GET Check Shipping Date Prior Ordering
    -------------------------------------------------- */
    static checkShippingBeforeOrder(req, res, next){
        let date = new Date(req.body.shippingDate)
        OrderSchema.find({}, function(err){
            if(err) throw err     
                OrderSchema.aggregate([{$match: {shipping_date: date}}], function(error, shipping){
                    if(shipping.length >= 3){
                        res.send([false]).end()
                    } else {
                        res.send([true]).end()                        
                    }
                })
        })
    }    




}




module.exports = apiOrders