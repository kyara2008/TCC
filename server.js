// Ponto de entrada do servidor na raiz - direciona para backend/server.js
const app = require('./backend/server');
const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Azulize rodando em: http://localhost:${PORT}`);
  });
}

module.exports = app;
