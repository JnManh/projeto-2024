const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/salvar-guia', 
  [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('experiencia').isIn(['sim', 'nao']).withMessage('Selecione uma opção válida')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('cad', {
        valores: req.body,
        resultado: {
          tipo: 'error',
          mensagem: 'Corrija os erros:',
          erros: errors.array()
        }
      });
    }

    try {
      await req.db.collection('guias').insertOne({
        nome: req.body.nome,
        email: req.body.email,
        experiencia: req.body.experiencia
      });
      
      res.render('cad', {
        valores: req.body,
        resultado: {
          tipo: 'error',
          mensagem: 'Erro no cadastro. Tente novamente.'
        }
      });
    } catch (err) {
      res.render('cad', {
        valores: {},
        resultado: {
          tipo: 'success', 
          mensagem: 'Cadastro realizado com sucesso! ✅'
        }
      });
    }
  }
);

module.exports = router;