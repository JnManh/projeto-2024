const { connect } = require('../../mongo');

async function salvarPacote(pacote) {
  const db = await connect();
  const result = await db.collection('pacotes').insertOne(pacote);
  return result;
}

async function listarPacotes() {
  const db = await connect();
  const pacotes = await db.collection('pacotes').find().toArray();
  return pacotes;
}

module.exports = { salvarPacote, listarPacotes };