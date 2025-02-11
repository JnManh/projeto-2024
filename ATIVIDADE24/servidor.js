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

app.post("/salvar", async (req, res) => {
  let nomeNoForm = req.body.nome;
  let telefoneNoForm = req.body.telefone;
  let localNoForm = req.body.local;
  let diaNoForm = req.body.dia;

  let cadastro = {
    nome: nomeNoForm,
    telefone: telefoneNoForm,
    local: localNoForm,
    dia: diaNoForm,
  };
  //fs.appendFileSync("visitas.json", `\n${JSON.stringify(cadastro)}`);
  resultado = `Entraremos em contato para confirmar sua visita, ${nomeNoForm}.`;
  vetorVisitas.push(cadastro);

  //fs.writeFileSync('visitas.json', JSON.stringify(vetorVisitas))
  try {
    await client.connect();

    await client.db("TP-2").collection("visitas").insertOne(cadastro);
    console.log("Salvou?");
  } finally {
    await client.close();
  }
  res.render("cad", { resultado });
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