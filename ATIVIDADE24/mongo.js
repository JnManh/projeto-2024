const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jonathanmanhaes:Jms604071*@tp-2.dtroq.mongodb.net/?retryWrites=true&w=majority&appName=TP-2";

const client = new MongoClient(uri, {
serverApi: {
version: ServerApiVersion.v1,
strict: true,
deprecationErrors: true,
}
});

async function run() {
try {
await client.connect();

let objeto = {teste: "Teste", x: 10};
await client.db("TP-2").collection("teste2").insertOne(objeto);
console.log("Salvou?");
} finally {
await client.close(); 

}
}
run().catch(console.dir);