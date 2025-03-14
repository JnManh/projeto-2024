require('dotenv').config();

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const helmet = require("helmet");
const path = require("path");

const roteirosRouter = require("./rotas/roteiro");
const visitasRouter = require("./rotas/visitas");
const guiaRouter = require("./rotas/guia");

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(helmet());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; 

app.use(async (req, res, next) => {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
      db = client.db("TP-2");
    }
    req.db = db;
    next();
  } catch (err) {
    console.error("Erro de conexão:", err);
    res.status(500).render("erro", { mensagem: "Erro no servidor" });
  }
});

app.use((req, res, next) => {
  req.db = db; 
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cadastroVisita", (req, res) => {
  res.render("cadastroVisita", { resultado: "" });
});

app.post("/salvar-visita", async (req, res) => {
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

  try {
    await req.db.collection("visitas").insertOne(cadastro);
    console.log("Dados salvos!");
    res.render("cad", { 
      resultado: `Entraremos em contato para confirmar sua visita, ${nomeNoForm}.` 
    });
  } catch (err) {
    console.error("Erro ao salvar:", err);
    res.render("cad", { 
      resultado: "Erro ao processar o cadastro. Tente novamente." 
    });
  }
});

app.get('/pont', (req, res) => res.render('pont'));
app.get('/cad', (req, res) => {
  res.render('cad', {
    valores: {},
    resultado: null
  });
});
app.get('/cadastroVisitante', (req, res) => {
  res.render('cadastroVisitante', {
    valores: {},
    resultado: null
  });
});
app.get('/roteiro', (req, res) => res.render('roteiro'));
app.get("/", (req, res) => res.render("index"));
app.get('/pont', (req, res) => res.render('pont'));
app.get('/jub', (req, res) => res.render('jub'));
app.get('/mac', (req, res) => res.render('mac'));
app.get('/cas', (req, res) => res.render('cas'));
app.get('/sob', (req, res) => res.render('sob'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(roteirosRouter);
app.use(visitasRouter);
app.use(guiaRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("erro", { mensagem: "Ocorreu um erro inesperado" });
});

async function startServer() {
  try {
    await client.connect();
    db = client.db("TP-2");
    console.log("✅ MongoDB conectado");
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando: http://localhost:${port}`);
    });
  } catch (err) {
    console.error("💣 Falha crítica:", err);
    process.exit(1);
  }
}

startServer();
