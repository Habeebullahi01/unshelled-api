// const client = require('../dbConnection')
const express = require('express')
const { updateCity, findSeller } = require('../controllers/sellersController')
const accountRoute = express.Router()
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic charset=utf-8')
    //   res.status(401).send("enter auth");
    return res.status(401).json({ msg: 'Enter Auth' })
  }
  const AuthorizationString = new Buffer.from( // eslint-disable-line new-cap
    authHeader.split(' ')[1],
    'base64'
  )
    .toString()
    .split(':')
  const user = AuthorizationString[0]
  const password = AuthorizationString[1]
  // console.log(user + " " + password);
  const userD = await findSeller(user, password)
  // await userD;
  // console.log(userD);
  if (userD.auth === true) {
    req.body.seller = userD.user
    // console.log("body set");
    // req.body.seller = { ...req.body, seller: userD.user };
    next()
  } else {
    res.send('Unable to login')
  }
}
accountRoute
  .route('/')
  .patch(
    (req, res, next) => {
      console.log(req.body)
      // console.log(req);
      next()
    },
    authMiddleware,
    async (req, res) => {
      const seller = req.body.seller
      const location = req.body.location
      // console.log(req.body);
      const r = await updateCity(seller.seller_id, { ...location })
      if (!r.error) {
        if (r.msg) {
          res.status(203).json(r.msg)
        } else {
          res.status(200).json({ city: r.seller_city, state: r.seller_state })
        }
      } else {
        res.status(400).json({ msg: 'An error occured' })
      }
    }
  )
  .get(authMiddleware, (req, res) => {
    res.status(200).json(req.body.seller)
  })

// accountRoute.route("/get").get(authMiddleware, (req, res) => {
//   res.json(req.body.seller);
// });

module.exports = accountRoute
