const fs = require('fs');
const path = require('path');

// 1. Update webchat_flow.json
const jsonPath = path.join(__dirname, '..', 'infrastructure', 'n8n_workflows', 'webchat_flow.json');
let flow = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

flow.nodes = flow.nodes.map(node => {
  if (node.name === "2. Get Recent History") {
    node.parameters.query = "SELECT sender_type, message_text FROM chat_messages WHERE conversation_id = '{{ $('1. Upsert Session').first().json.conversation_id }}' ORDER BY created_at DESC LIMIT 10;";
  }
  return node;
});

fs.writeFileSync(jsonPath, JSON.stringify(flow, null, 2), 'utf8');
console.log("Updated webchat_flow.json file successfully.");
