const express = require('express');
const { body, validationResult } = require('express-validator');
const { salvarPacote } = require('../modelos/Pacote');

const router = express.Router();

router.get('/cad-roteiro', (req, res) => {
  res.render('cad-roteiro', {
    resultado: null,
    valores: {}
  });
});

router.post('/cad-roteiro', 
  [
    body('nome')
      .trim()
      .escape()
      .notEmpty().withMessage('Nome do pacote é obrigatório'),
      
    body('destino')
      .trim()
      .escape()
      .notEmpty().withMessage('Destino é obrigatório'),
      
    body('descricao')
      .trim()
      .escape()
      .notEmpty().withMessage('Descrição é obrigatória'),
      
    body('duracao')
      .trim()
      .escape()
      .notEmpty().withMessage('Duração é obrigatória'),
      
    body('preco')
      .trim()
      .escape()
      .notEmpty().withMessage('Preço é obrigatório')
      .custom(value => {
        const numericValue = parseFloat(value.replace(',', '.'));
        if (isNaN(numericValue) || numericValue <= 0) {
          throw new Error('Preço inválido');
        }
        return true;
      })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('cad-roteiro', {
        resultado: {
          type: 'error',
          message: 'Corrija os erros abaixo:',
          details: errors.array()
        },
        valores: req.body
      });
    }

    try {
      const novoPacote = {
        nome: req.body.nome,
        destino: req.body.destino,
        descricao: req.body.descricao,
        duracao: req.body.duracao,
        preco: parseFloat(req.body.preco.replace(',', '.'))
      };

      await salvarPacote(novoPacote, req.db);

      res.render('cad-roteiro', {
        resultado: {},
        valores: {}
      });

    } catch (err) {
      console.error('Erro ao salvar pacote:', err);
      res.render('cad-roteiro', {
        resultado: {
          type: 'error',
          message: process.env.NODE_ENV === 'development' 
            ? `Erro: ${err.message}`
            : 'Erro ao processar o formulário'
        },
        valores: req.body
      });
    }
  }
);

module.exports = router;