const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const roteirosRouter = require("./routes/roteiros");
const visitasRouter = require("./routes/visitas"); 
const visitantesRouter = require('./routes/visitantes');

const app = express();
const port = 3000;

app.set("view engine", "ejs"); 
app.use(express.static("public")); 
app.use(express.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://jonathanmanhaes:Jms604071*@tp-2.dtroq.mongodb.net/?retryWrites=true&w=majority&appName=TP-2";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;


async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db("TP-2"); 
    console.log("Conectado ao MongoDB!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1); 
  }
}

app.use((req, res, next) => {
  req.db = db; 
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/jub", (req, res) => {
  res.render("jub");
});

app.get("/cas", (req, res) => {
  res.render("cas");
});

app.get("/sob", (req, res) => {
  res.render("sob");
});

app.get("/mac", (req, res) => {
  res.render("mac");
});

app.get("/pont", (req, res) => {
  res.render("pont");
});

app.get("/roteiro", (req, res) => {
  res.render("roteiro");
});

app.get("/mostrar", (req, res) => {
  let vetorVisitas = [];
  if (fs.existsSync("visitas.json")) {
    const dados = fs.readFileSync("visitas.json", "utf-8");
    vetorVisitas = JSON.parse(dados);
  }
  res.render("mostrar", { vetorVisitas });
});


app.use("/", roteirosRouter);
app.use("/", visitasRouter);
app.use('/', visitantesRouter);


async function startServer() {
  await connectToMongoDB(); 
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Erro ao iniciar o servidor:", err);
});