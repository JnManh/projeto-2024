const express = require('express')
const app = express ()
const fs = require('fs')
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

let vetorVisitas = []

app.get("/", (riquisicao, resposta ) => {
    resposta.render('index')
})

app.get("/jub", (riquisicao, resposta ) => {
    resposta.render('jub')
})

app.get("/cas", (riquisicao, resposta ) => {
    resposta.render('cas')
})

app.get("/sob", (riquisicao, resposta ) => {
    resposta.render('sob')
})

app.get("/mac", (riquisicao, resposta ) => {
    resposta.render('mac')
})

app.get("/pont", (riquisicao, resposta ) => {
    resposta.render('pont')
})

if (fs.existsSync('visitas.json')) {
    const dados = fs.readFileSync('visitas.json', 'utf-8')
    console.log(vetorVisitas)
    vetorVisitas = JSON.parse(dados)
}

app.get('/cad', (request, response) => {
    resultado = ""
    response.render('cad', { resultado })
})

app.post('/salvar', (req, res) => {
    let nomeNoForm = req.body.nome
    let telefoneNoForm = req.body.telefone
    let localNoForm = req.body.local
    let diaNoForm = req.body.dia
    
    let cadastro = {nome: nomeNoForm, telefone: telefoneNoForm, local: localNoForm, dia: diaNoForm}
    fs.appendFileSync('visitas.json', `\n${JSON.stringify(cadastro)}`)
    resultado = `Entraremos em contato para confirmar sua visita, ${nomeNoForm}.`
    vetorVisitas.push(cadastro)
    fs.writeFileSync('visitas.json', JSON.stringify(vetorVisitas))
    res.render('cad', { resultado });

})

app.get('/mostrar', (req, res) => {
    console.log(vetorVisitas);
    res.render('mostrar', { vetorVisitas })
})

app.listen(3000)