const client = require('../dbConnection')

const findSeller = async (username, password) => {
  // let userDetails = {}
  let auth = false
  return client
    .db('olist')
    .collection('olist_sellers_dataset')
    .findOne({ seller_id: username })
    .then((user) => {
      //   console.log(user);
      // userDetails = user
      if (user.seller_zip_code_prefix === password) {
        auth = true
        return {
          user,
          auth
        }
      } else {
        return {
          auth
        }
      }
    })
    .catch((err) => {
      return {
        auth,
        message: 'Unable to find Seller.',
        error: err
      }
    })
}
const updateCity = async (sellerId, { city, state }) => {
  const response = await client
    .db('olist')
    .collection('olist_sellers_dataset')
    .findOneAndUpdate(
      { seller_id: sellerId },
      { $set: { seller_city: city, seller_state: state } },
      { returnDocument: 'after' }
    )
    .then((seller) => {
      console.log(seller.value)
      if (seller) {
        console.log('Seller value is ' + seller.value)
        return seller.value
      } else {
        return {
          msg: 'nothing to update'
        }
      }
    })
    .catch((e) => {
      console.log('error is ' + e)
      return { error: e }
    })
  console.log(response)
  if (!response.error) {
    return response
  } else return { error: true }
}

module.exports = { findSeller, updateCity }
