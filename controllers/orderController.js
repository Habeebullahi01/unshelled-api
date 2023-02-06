const client = require('../dbConnection')

const getOrderItems = async (
  sellerId,
  limit = 20,
  sortByPrice = false,
  offset = 1
) => {
  const sortType =
    sortByPrice === 'true' || sortByPrice >= 1
      ? { price: -1 }
      : { shipping_limit_date: 1 }
  const collection = client.db('olist').collection('olist_order_items_dataset')
  const total = await collection.countDocuments({ seller_id: sellerId })
  const skip = offset * limit > total ? 0 : offset * limit
  if (limit > 100) {
    limit = 100
  }
  const cursor = client
    .db('olist')
    .collection('olist_order_items_dataset')
    .find({ seller_id: sellerId })
    .sort(sortType)
    .skip(skip)
    .limit(limit)
  //   await cursor.forEach((o) => {});

  const data = await cursor.toArray()

  return {
    data,
    total
  }
}

const deleteOrderItem = async (sellerId, orderItemId) => {
  return client
    .db('olist')
    .collection('olist_order_items_dataset')
    .deleteOne({ seller_id: sellerId, order_item_id: orderItemId })
    .then(() => {
      return 'done'
    })
    .catch((err) => {
      return err
    })
}
module.exports = { getOrderItems, deleteOrderItem }
