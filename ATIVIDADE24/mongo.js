const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://jonathanmanhaes:Jms604071*@tp-2.dtroq.mongodb.net/?retryWrites=true&w=majority&appName=TP-2";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB!");
    return client.db("TP-2");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

module.exports = { connect };