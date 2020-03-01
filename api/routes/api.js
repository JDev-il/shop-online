var express = require('express');
var router = express.Router();

const apiProducts = require('../controllers/products')
const apiUsers = require('../controllers/users')
const apiOrders = require('../controllers/orders')
const apiCarts = require('../controllers/carts')
const apiItems = require('../controllers/items')

var verifyToken = require("../services/authentications/authentication");

var upload = require('../services/fileUpload')



/* GET All Users */
router.get('/users', apiUsers.getAllUsers);
/* POST Check Step 1 In Registration Form */
router.post('/users/cuscheck', apiUsers.checkBeforeSubmit)
/* POST Add New Customer */
router.post('/users/add', apiUsers.postSingleCustomer)
/* POST Login Customers */
router.post('/users/login', apiUsers.loginCustomers)
/* POST Type Check */
router.post('/users/prelogin', apiUsers.loginTypeCheck)
/* POST Verify Customer Details */
router.post('/users/verify', verifyToken, apiUsers.verifyCustomerDetails)

/* POST Verify Customer Details */
router.post('/users/order', verifyToken, apiUsers.userDetailsOrderPage)

/*=============================================
=        END POINT OF USERS SECTION           =
=============================================*/




/* GET All Products */
router.get('/products', apiProducts.getAllProducts);
/* GET Single Product */
router.get('/products/single', apiProducts.getSingleProduct);
/* POST/GET Searched Product */
router.post('/products/search', apiProducts.postSearchedProduct);
/* POST Add Single Product */
router.post('/products/add', verifyToken, apiProducts.postSingleProduct);
/* PUT Edit Single Product */
router.put('/products/edit', verifyToken, apiProducts.putEditProduct);


/* GET All Categories */
router.get('/products/categories', apiProducts.getCategories);
/* GET Available Categories */
router.get('/products/filcat', apiProducts.getilteredCategories);



/* POST Files */
router.post('/products/upload', upload.single('image'), apiProducts.postFiles);

/*=============================================
=        END POINT OF PRODUCTS SECTION        =
=============================================*/




/* GET All Orders */
router.get('/orders', apiOrders.getAllOrders);
/* POST New Order */
router.post('/orders/placeorder', verifyToken, apiOrders.postPlaceOrder);
/* POST Check Shipping Prior Ordering */
router.post('/orders/shipping', apiOrders.checkShippingBeforeOrder);

/*=============================================
=        END POINT OF ORDERS SECTION          =
=============================================*/




/* GET Cart */
router.post('/logincart', apiCarts.getCartBeforeLogin);
/* POST Create Cart */
router.get('/cart/new', verifyToken, apiCarts.createCart);
/* GET Single Cart + Items */
router.get('/cart/single', verifyToken, apiCarts.getCartByCustomer);
/* DELETE Clear Items From Cart */
router.delete('/cart/clear/:id', verifyToken, apiCarts.clearCart);

/*=============================================
=        END POINT OF CART SECTION            =
=============================================*/




/* POST Item To Cart */
router.post('/items/addtocart', verifyToken, apiItems.addItemsToCart);
/* PUT Edit Item In Cart */
router.post('/items/edit', verifyToken, apiItems.editItemInCart);
/* DELETE Item From Cart */
router.post('/items/remove', verifyToken, apiItems.removeItemFormCart);
/* POST/GET Searched Items In Checkout */
router.post('/items/search', verifyToken, apiItems.searchItemInCheckout);

/*=============================================
=        END POINT OF ITEMS SECTION           =
=============================================*/



module.exports = router;
