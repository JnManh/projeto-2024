const express = require('express');
const { salvarPacote, listarPacotes } = require('../modelos/Pacote');

const router = express.Router();


router.get('/cad-roteiro', (req, res) => {
  res.render('cad-roteiro'); 
});

router.post('/cad-roteiro', async (req, res) => {
  try {
    const preco = parseFloat(req.body.preco.replace(',', '.')); 
    const novoPacote = { 
      ...req.body,
      preco 
    };
  } catch (err) {
    console.error('Erro ao salvar o pacote:', err);
    res.status(500).send('Erro ao salvar o pacote.');
  }
});


router.get('/', async (req, res) => {
  try {
    const pacotes = await listarPacotes();
    res.render('roteiro', { pacotes });
  } catch (err) {
    console.error('Erro ao buscar pacotes:', err);
    res.status(500).send('Erro ao buscar pacotes.');
  }
});

module.exports = router;