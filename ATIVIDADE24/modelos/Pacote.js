const { connect } = require('../mongo'); 
async function salvarPacote(pacote, db) { 
  try {
    return await db.collection('pacotes').insertOne(pacote);
  } catch (err) {
    console.error('Erro ao salvar pacote:', err);
    throw err;
  }
}

async function listarPacotes(db) { 
  try {
    return await db.collection('pacotes').find().toArray();
  } catch (err) {
    throw err;
  }
}

module.exports = { salvarPacote, listarPacotes };