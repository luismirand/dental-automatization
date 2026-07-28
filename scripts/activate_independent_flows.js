const { execSync } = require('child_process');

const sql = `
UPDATE workflow_entity SET active = true, "activeVersionId" = "versionId" 
WHERE id IN ('webchat-llm-flow-01', 'whatsapp-llm-flow-01', 'telegram-llm-flow-01', 'calcom-booking-flow-01');

INSERT INTO shared_workflow ("workflowId", "projectId", "role") VALUES
  ('webchat-llm-flow-01', '66MPRt53ZeFhgWYa', 'workflow:owner'),
  ('whatsapp-llm-flow-01', '66MPRt53ZeFhgWYa', 'workflow:owner'),
  ('telegram-llm-flow-01', '66MPRt53ZeFhgWYa', 'workflow:owner'),
  ('calcom-booking-flow-01', '66MPRt53ZeFhgWYa', 'workflow:owner')
ON CONFLICT DO NOTHING;

INSERT INTO webhook_entity ("webhookPath", "method", "node", "webhookId", "workflowId") VALUES
  ('webchat', 'POST', 'WebChat Webhook', 'webchat-llm-webhook-id', 'webchat-llm-flow-01'),
  ('whatsapp', 'GET', 'WhatsApp Verification (GET)', 'whatsapp-llm-get-webhook-id', 'whatsapp-llm-flow-01'),
  ('whatsapp', 'POST', 'WhatsApp Webhook (POST)', 'whatsapp-llm-webhook-id', 'whatsapp-llm-flow-01'),
  ('calcom-booking', 'POST', 'Cal.com Webhook', 'calcom-webhook-id', 'calcom-booking-flow-01')
ON CONFLICT DO NOTHING;
`;

require('fs').writeFileSync(__dirname + '/activate_indep.sql', sql, 'utf8');
execSync(`Get-Content "${__dirname}/activate_indep.sql" | docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db`, { shell: 'powershell.exe' });
console.log("All standalone independent workflows activated cleanly!");
