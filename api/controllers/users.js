var connection = require("../services/mongoose");
var CustomerSchema = require("../models/usersSchemas/customerSchema");
var config = require("../services/authentications/userKey");
var jwt = require("jsonwebtoken");
var jwtToken = require('../services/authentications/authentication')

class apiUsers {




    /* GET All Users
      -------------------------------------------------- */
    static getAllUsers(req, res, next) {
      
      CustomerSchema.find({}, function(err, results){
        if(!err){
        } else { 
          throw err
        }
      })
      // res.send("Get All Users");
    }




  /* POST Check Customer Details (MiddleWare)
    -------------------------------------------------- */
    static checkBeforeSubmit(req, res, next) {
      const check = {
        idnumber: req.body.idnumber,
        email: req.body.email,
        password: req.body.password,
        confirm: req.body.confirmPassword
      }

      var idRes, emailRes;

      CustomerSchema.find({ idnumber: check.idnumber }, function(err, idResult) {      
      if(err) return err
        idRes = idResult[0]
      }).then(()=>{
        CustomerSchema.find({ email: check.email }, function(error, emailResult) {
          if (error) return error
        emailRes = emailResult[0]
        }).then(()=>{
          if(idRes == null && emailRes == null){
            res.send("clear")
          } else {
            if(idRes !== undefined || idRes !== "" || emailRes !== undefined || emailRes !== ""){
              res.send("failed")
            }
          }
        })
      })
    }




    /* POST New Customer (after checkBeforeSubmit MiddleWare)
      -------------------------------------------------- */
    static postSingleCustomer(req, res, next) {
        var newCustomer = new CustomerSchema({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          idnumber: req.body.idnumber,
          password: req.body.password,
          email: req.body.email,
          city: req.body.city,
          street: req.body.street,
          customer: true
        });
          const inToken = {
            firstname: newCustomer.firstname,
            password: newCustomer.password,
            idnumber: newCustomer.idnumber,
            email: newCustomer.email,
            customer: newCustomer.customer,
            new: true 
          };
          jwt.sign(inToken, config.secret, function(err, token) {
            const returnToUser= {
              token: token,
              customer: newCustomer.customer,
            }
            newCustomer.save(function(err, saved) {
                if (err) return err;
                  res.send({userKey: returnToUser}).end();
                });  
          });
    }




    /* POST Verify Token Details
    -------------------------------------------------- */
    static verifyCustomerDetails(req, res) {

      let customerData = req.authData
    
      if(customerData){
        if(customerData.customer == false){
          res.send([false, customerData.firstname, customerData.new])
        }
        if(customerData.customer == true){
          res.send([true, customerData.firstname, customerData.new])
        }
      } else {
      res.send("Access Denied")
     }
    }




    /* POST Login Customer
    -------------------------------------------------- */
    static loginCustomers(req, res) {
      const loginDetails = {
        email: req.body.email,
        password: req.body.password
      }    
      CustomerSchema.findOne({email: loginDetails.email, password: loginDetails.password}, function(err, result){
        if(result == "" || result == undefined){
          res.send(false)
        } else {
          if(result.email == loginDetails.email && result.password == loginDetails.password){
            const inToken = {
              firstname: result.firstname,
              email: req.body.email,
              password: req.body.password,
              customer: result.customer,
              new: false
            };
            jwt.sign(inToken, config.secret, function(err, token) {
              const returnToUser = {
                token: token,
                customer: result.customer
              }
              res.send(returnToUser)
            })
          }
        }
      })

    }



    /* POST Type Check
    -------------------------------------------------- */
    static loginTypeCheck(req, res) {
      const loginDetails = {
        email: req.body.email,
        password: req.body.password
      } 
         
      CustomerSchema.findOne({email: loginDetails.email, password: loginDetails.password}, function(err, result){
        if(result == "" || result == undefined){
          res.send(false)
        } else {
          if(result.customer == false){
            res.send([result.firstname])
          } else {
            if(result.customer == true){
              res.send([result.customer])
            }
          }
        }
      })
    }


    static userDetailsOrderPage(req, res, next){
      if(req.authData.customer == true){
        CustomerSchema.findOne({email: req.authData.email}, function(err, customer){
          if(err) throw err
          const userDetails = {
            id: customer._id,
            firstname: customer.firstname,
            lastname: customer.lastname,
            city: customer.city,
            street: customer.street
          }
          res.send([userDetails])
        })
      } else {
        res.send(["Access Denied"])
      }
    }

    

}




module.exports = apiUsers;
