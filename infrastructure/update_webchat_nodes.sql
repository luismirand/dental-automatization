UPDATE workflow_entity 
SET nodes = (SELECT pg_read_file('/tmp/webchat_nodes.json'))::jsonb 
WHERE id = 'webchat-llm-flow-01';
SELECT active, nodes::text LIKE '%openrouter/free%' AS has_free 
FROM workflow_entity WHERE id = 'webchat-llm-flow-01';
