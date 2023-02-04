const client = require('../dbConnection')

const getProduct = async (productId) => {
  return client
    .db('olist')
    .collection('olist_products_dataset')
    .findOne({ product_id: productId })
    .then((p) => {
      return p
    })
}

module.exports = getProduct
