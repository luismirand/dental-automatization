const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const flowPath = path.join(__dirname, '..', 'infrastructure', 'n8n_workflows', 'webchat_flow.json');
const flow = JSON.parse(fs.readFileSync(flowPath, 'utf8'));

// Format SQL dollar quote safely
const jsonStr = JSON.stringify(flow.nodes);
const connStr = JSON.stringify(flow.connections);

const sql = `UPDATE workflow_entity SET nodes = $json1$${jsonStr}$json1$::jsonb, connections = $json2$${connStr}$json2$::jsonb WHERE id = 'webchat-llm-flow-01';`;

const sqlFile = path.join(__dirname, 'update_wc_direct.sql');
fs.writeFileSync(sqlFile, sql, 'utf8');

console.log("SQL written to update_wc_direct.sql");

const res = execSync(`Get-Content "${sqlFile}" | docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db`, { shell: 'powershell.exe', encoding: 'utf8' });
console.log("Postgres update result:", res);
