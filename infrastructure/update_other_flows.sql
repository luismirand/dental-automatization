UPDATE workflow_entity 
SET nodes = (SELECT pg_read_file('/tmp/telegram_nodes.json'))::jsonb 
WHERE id = 'telegram-llm-flow-01';
SELECT active, nodes::text LIKE '%openrouter/free%' AS has_free 
FROM workflow_entity WHERE id = 'telegram-llm-flow-01';

UPDATE workflow_entity 
SET nodes = (SELECT pg_read_file('/tmp/whatsapp_nodes.json'))::jsonb 
WHERE id = 'whatsapp-llm-flow-01';
SELECT active, nodes::text LIKE '%openrouter/free%' AS has_free 
FROM workflow_entity WHERE id = 'whatsapp-llm-flow-01';
