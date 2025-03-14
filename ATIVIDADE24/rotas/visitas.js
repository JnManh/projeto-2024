const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/cadastroVisitante', (req, res) => {
  res.render('cadastroVisitante', {
    valores: {}, 
    resultado: null
  });
});

router.post('/salvar-visitante', 
  [
    body('nome')
      .trim()
      .notEmpty().withMessage('Nome é obrigatório'),
      
    body('telefone')
      .trim()
      .notEmpty().withMessage('Telefone é obrigatório'),
      
      body('email')
      .trim()
      .isEmail().withMessage('E-mail inválido')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('cadastroVisitante', {
        valores: req.body, 
        resultado: {
          tipo: 'error',
          mensagem: 'Corrija os erros abaixo:',
          erros: errors.array() 
        }
      });
    }

    try {

      await req.db.collection('visitantes').insertOne({
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email
      });


      res.render('cadastroVisitante', {
        valores: {}, 
        resultado: {
          tipo: 'success',
          mensagem: 'Cadastro realizado com sucesso! ✅'
        }
      });

    } catch (err) {
      console.error(err);
      res.render('cadastroVisitante', {
        valores: req.body,
        resultado: {
          tipo: 'error',
          mensagem: 'Erro interno no servidor ❌'
        }
      });
    }
  }
);

module.exports = router;