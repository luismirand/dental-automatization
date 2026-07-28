const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKFLOWS = [
  { id: 'webchat-llm-flow-01', file: 'n8n_workflows/webchat_flow.json' },
  { id: 'telegram-llm-flow-01', file: 'n8n_workflows/telegram_flow.json' },
  { id: 'whatsapp-llm-flow-01', file: 'n8n_workflows/whatsapp_llm_flow.json' },
];

for (const wf of WORKFLOWS) {
  console.log(`\nProcessing: ${wf.id}`);
  const filePath = path.join(__dirname, wf.file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const flow = JSON.parse(raw);

  const nodesJson = JSON.stringify(flow.nodes);
  const sql = `UPDATE workflow_entity SET nodes = $json_nodes$${nodesJson}$json_nodes$::jsonb WHERE id = '${wf.id}';`;

  const tmpSqlFile = path.join(__dirname, `tmp_update_${wf.id}.sql`);
  fs.writeFileSync(tmpSqlFile, sql, 'utf8');

  try {
    const cmd = `Get-Content "${tmpSqlFile}" | docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db`;
    const result = execSync(cmd, { shell: 'powershell.exe', encoding: 'utf8' });
    console.log('Result:', result.trim());
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (fs.existsSync(tmpSqlFile)) fs.unlinkSync(tmpSqlFile);
  }
}
