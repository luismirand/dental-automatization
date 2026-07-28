const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://dental_user:dental_password_secure_123@localhost:5432/dental_clinic_db"
});

async function main() {
  await client.connect();
  const res = await client.query("SELECT id, name, active, nodes FROM workflow_entity");
  for (const row of res.rows) {
    console.log(`\nWorkflow: ID=${row.id}, Active=${row.active}, Name=${row.name}`);
    for (const node of row.nodes) {
      if (node.parameters && node.parameters.query) {
        console.log(`  Node [${node.name}]: query = ${node.parameters.query}`);
      }
    }
  }
  await client.end();
}

main().catch(console.error);
