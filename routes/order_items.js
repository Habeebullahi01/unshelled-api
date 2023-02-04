const express = require('express')
const orderRoute = express.Router()
const { findSeller } = require('../controllers/sellersController')
const {
  getOrderItems,
  deleteOrderItem
} = require('../controllers/orderController')
const getProduct = require('../controllers/productController')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic charset=utf-8')
    //   res.status(401).send("enter auth");
    return res.status(401).json({ msg: 'Enter Auth' })
  }
  const authorizationString = new Buffer.from( // eslint-disable-line new-cap
    authHeader.split(' ')[1],
    'base64'
  )
    .toString()
    .split(':')
  const user = authorizationString[0]
  const password = authorizationString[1]
  // console.log(user + " " + password);
  const userD = await findSeller(user, password)
  // await userD;
  // console.log(userD);
  if (userD.auth === true) {
    req.body.seller = userD.user
    next()
  } else {
    res.send('Unable to login')
  }
}

orderRoute.route('/').get(authMiddleware, async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 20
  // console.log(limit);
  const sortByPrice = req.query.price ? req.query.price : false
  // console.log(sort_by_price);
  const offset = req.query.offset ? parseInt(req.query.offset) : 0
  const seller = req.body.seller
  // console.log(seller);
  const orderData = await getOrderItems(
    seller.seller_id,
    limit,
    sortByPrice,
    offset
  )
  //   const productData
  const data = []
  const orderItems = orderData.data
  // order_items.forEach(async (order) => {
  //   const prod = getProduct(order.product_id);
  //   data.push({
  //     id: order.order_item_id,
  //     product_id: prod.product_id,
  //     product_category: prod.product_category_name,
  //     price: order.price,
  //     date: order.shipping_limit_date,
  //   });
  // });
  // console.log(orderItems)
  for (let index = 0; index < orderItems.length; index++) {
    const order = orderItems[index]
    const prod = await getProduct(order.product_id)
    data.push({
      id: order.order_item_id,
      product_id: prod.product_id,
      product_category: prod.product_category_name,
      price: order.price,
      date: order.shipping_limit_date
    })
  }

  // res.send("In progress");
  res.json({
    data,
    total: orderData.total,
    limit,
    offset
  })
})
orderRoute.route('/:id').delete(authMiddleware, async (req, res) => {
  const delOp = await deleteOrderItem(req.body.seller.seller_id, req.params.id)
  if (delOp === 'done') {
    res.status(200).send('Deleted Successfully.')
  } else {
    res.status(400).send('Unable to delete order.')
  }
})
module.exports = orderRoute
