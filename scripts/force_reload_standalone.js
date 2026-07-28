const { execSync } = require('child_process');
const fs = require('fs');

const sql = `
UPDATE workflow_entity SET active = false WHERE id = 'webchat-llm-flow-01';
UPDATE workflow_entity SET active = true, "activeVersionId" = "versionId" WHERE id = 'webchat-llm-flow-01';
`;

fs.writeFileSync(__dirname + '/reload.sql', sql, 'utf8');
execSync(`Get-Content "${__dirname}/reload.sql" | docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db`, { shell: 'powershell.exe' });
execSync(`docker restart dental_n8n`, { shell: 'powershell.exe' });
console.log("Reloaded successfully!");
