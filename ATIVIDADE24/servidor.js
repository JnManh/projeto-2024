const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const roteirosRouter = require("./rotas/roteiro");
const visitasRouter = require("./rotas/visitas"); 

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

app.post("/adp", async (request, response) => {
  let descricao = request.body.descricao;
  let locais = request.body.locais;
  let cadastro = {descricao, locais};
 
  try {
    
    await client.connect();
    await client.db("TP-2").collection("ptsturisticos").insertOne(cadastro);
    response.render("adp",  {
    status: true,
    resultado: "Sucesso!",
    });
    
  } catch (e) {
    response.render("adp", {
    status: false,
    resultado: "Erro ao cadastrar.",
    });
  }
});

app.get("/adp",  (request, response) => {
  response.render("adp" ,  {
  status: true,
  resultado: "",
    });
  
});

app.get("/mostrar", async (req, res) => {
  try {
    const visitas = await req.db.collection("visitas").find().toArray();
    res.render("mostrar", { visitas });
  } catch (err) {
    console.error("Erro ao buscar visitas:", err);
    res.status(500).send("Erro ao carregar dados");
  }
});


app.use("/roteiro", roteirosRouter);
app.use("/visitas", visitasRouter);



async function startServer() {
  await connectToMongoDB(); 
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Erro ao iniciar o servidor:", err);
});
