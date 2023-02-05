const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
// const { MongoClient, ServerApiVersion } = require('mongodb')
const client = require('./dbConnection')
const orderRoute = require('./routes/order_items')
const accountRoute = require('./routes/account')
// const { urlencoded } = require('express')
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/order_items', orderRoute)
app.use('/account', accountRoute)

// const uri =
//   "mongodb+srv://admin:unshelled@unshelled.xmhc8do.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

app.get('/', (req, res) => {
  res.send('Olist Server')
})

client
  .connect()
  .then(
    app.listen(4000, async () => {
      // (err) => {
      // console.log('Unable to connect to database.')
      // console.log(err)
      // }
      console.log('Olist server is running.')
    })
  )
  .catch((e) => {
    console.log('Unable to connect to server')
  })
