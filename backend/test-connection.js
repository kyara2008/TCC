const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  try {
    console.log('Testando conexão com o Neon...');
    const result = await sql`SELECT NOW() as agora, current_database() as banco, current_user as usuario;`;
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('Banco de dados:', result[0].banco);
    console.log('Usuário:', result[0].usuario);
    console.log('Horário do servidor Neon:', result[0].agora);

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('\nTabelas encontradas no banco:', tables.map(t => t.table_name).join(', '));

    const summary = await sql`SELECT * FROM vw_monthly_summary;`;
    console.log('\nResumo mensal (vw_monthly_summary):', summary);
  } catch (error) {
    console.error('Erro ao conectar ao Neon:', error.message);
  }
}

testConnection();
