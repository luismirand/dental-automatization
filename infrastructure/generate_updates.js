const fs = require('fs');

function generateSql(workflowFile, workflowId, outputFile) {
  const fileContent = fs.readFileSync(workflowFile, 'utf8');
  const flow = JSON.parse(fileContent);
  const nodesJson = JSON.stringify(flow.nodes);
  const escapedNodes = nodesJson.replace(/'/g, "''");
  
  // En n8n_workflows los layouts/conexiones se definen también. Si cambiamos nombres de nodos,
  // también es bueno actualizar 'connections' para mantener el archivo completamente consistente en n8n.
  const connectionsJson = JSON.stringify(flow.connections).replace(/'/g, "''");

  const sql = `UPDATE workflow_entity SET nodes = '${escapedNodes}'::jsonb, connections = '${connectionsJson}'::jsonb WHERE id = '${workflowId}';\n`;
  fs.writeFileSync(outputFile, sql);
  console.log(`Generated ${outputFile} for ${workflowId}`);
}

generateSql('n8n_workflows/webchat_flow.json', 'webchat-llm-flow-01', 'update_webchat.sql');
generateSql('n8n_workflows/telegram_flow.json', 'telegram-llm-flow-01', 'update_telegram.sql');
generateSql('n8n_workflows/whatsapp_llm_flow.json', 'whatsapp-llm-flow-01', 'update_whatsapp.sql');
