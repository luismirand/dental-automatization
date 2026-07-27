/**
 * Script para actualizar los workflows en PostgreSQL
 * Usa los archivos JSON locales actualizados para sincronizar la base de datos
 */
const fs = require('fs');
const { execSync } = require('child_process');

const WORKFLOWS = [
  { id: 'webchat-llm-flow-01', file: 'n8n_workflows/webchat_flow.json' },
  { id: 'telegram-llm-flow-01', file: 'n8n_workflows/telegram_flow.json' },
  { id: 'whatsapp-llm-flow-01', file: 'n8n_workflows/whatsapp_llm_flow.json' },
];

for (const wf of WORKFLOWS) {
  console.log(`\nProcessing: ${wf.id}`);
  const raw = fs.readFileSync(wf.file, 'utf8');
  const flow = JSON.parse(raw);

  const nodesEscaped = JSON.stringify(flow.nodes).replace(/\\/g, '\\\\').replace(/'/g, "''");
  const sql = `UPDATE workflow_entity SET nodes = '${nodesEscaped}'::jsonb WHERE id = '${wf.id}'; SELECT id, active FROM workflow_entity WHERE id = '${wf.id}';`;

  const tmpFile = `/tmp/update_${wf.id}.sql`;
  fs.writeFileSync(tmpFile, sql);

  try {
    const result = execSync(`docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db -c "${sql.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err.message);
    // Try alternative approach with heredoc via stdin
    const escapedSql = sql.replace(/"/g, '\\"');
    try {
      const result2 = execSync(
        `echo "${escapedSql}" | docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db`,
        { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
      );
      console.log('Result2:', result2);
    } catch (err2) {
      console.error('Error2:', err2.message);
    }
  }
}
