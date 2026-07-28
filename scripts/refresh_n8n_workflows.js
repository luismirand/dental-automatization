const { execSync } = require('child_process');

function runPsql(sql) {
  const sqlEscaped = sql.replace(/"/g, '\\"');
  return execSync(`docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db -c "${sqlEscaped}"`, { shell: 'powershell.exe', encoding: 'utf8' });
}

console.log("Deactivating webchat-llm-flow-01...");
runPsql("UPDATE workflow_entity SET active = false WHERE id = 'webchat-llm-flow-01';");

console.log("Reactivating webchat-llm-flow-01...");
runPsql("UPDATE workflow_entity SET active = true WHERE id = 'webchat-llm-flow-01';");

console.log("Restarting dental_n8n container...");
execSync("docker restart dental_n8n", { shell: 'powershell.exe' });

console.log("Done!");
