const { MongoClient, ServerApiVersion } = require('mongodb')
const { config } = require('dotenv')
config()
const uri = process.env.MONGO_URI
// console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})

module.exports = client
