const express = require('express');
const router = express.Router();

router.post('/salvar-visitante', async (req, res) => {
  const { nome, telefone, em: email } = req.body;


  if (!nome || !telefone || !email) {
    return res.render('cadastro', { 
      resultado: 'Todos os campos são obrigatórios!' 
    });
  }

  try {

    await req.db.collection('visitantes').insertOne({
      nome,
      telefone,
      email
    });
    
    res.render('cadastro', { 
      resultado: `Cadastro de ${nome} realizado com sucesso! ✅` 
    });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.render('cadastro', { 
      resultado: 'Erro no cadastro. Tente novamente. ❌' 
    });
  }
});

module.exports = router;