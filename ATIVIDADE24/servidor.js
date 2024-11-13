const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const fs = require("fs");
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

let vetorVisitas = [];

app.get("/", (riquisicao, resposta) => {
  resposta.render("index");
});

app.get("/jub", (riquisicao, resposta) => {
  resposta.render("jub");
});

app.get("/cas", (riquisicao, resposta) => {
  resposta.render("cas");
});

app.get("/sob", (riquisicao, resposta) => {
  resposta.render("sob");
});

app.get("/mac", (riquisicao, resposta) => {
  resposta.render("mac");
});

app.get("/pont", (riquisicao, resposta) => {
  resposta.render("pont");
});

if (fs.existsSync("visitas.json")) {
  const dados = fs.readFileSync("visitas.json", "utf-8");
  console.log(vetorVisitas);
  vetorVisitas = JSON.parse(dados);
}

app.get("/cadvisi", (request, response) => {
  resultado = "";
  response.render("cadvisi", { resultado });
});

app.get("/cad", (request, response) => {
  resultado = "";
  response.render("cad", { resultado });
});

app.get("/cad-roteiro", (request, response) => {
  response.render("cad-roteiro", {
    status: true,
    resultado: "",
  });
});

app.post("/cad-roteiro", async (request, response) => {
  let titulo = request.body.titulo;
  let descricao = request.body.descricao;
  let locais = request.body.locais;
  let valor = request.body.valor;
  let cadastro = { titulo, descricao, locais, valor };
  try {
    await client.connect();
    await client.db("TP-2").collection("roteiro").insertOne(cadastro);
    response.render("cad-roteiro", {
      status: true,
      resultado: "Roteiro cadastrado com sucesso!",
    });
  } catch (e) {
    response.render("cad-roteiro", {
      status: false,
      resultado: "Erro ao cadastrar o roteiro.",
    });
  }
});

app.get("/roteiro", (request, response) => {
  response.render("roteiro");
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
  } finally {
    await client.close();
  }

  res.render("cad", { resultado });
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

app.get("/mostrar", (req, res) => {
  console.log(vetorVisitas);
  res.render("mostrar", { vetorVisitas });
});

app.listen(3000);
