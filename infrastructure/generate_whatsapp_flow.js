const fs = require('fs');
const path = require('path');

const originalFile = path.join(__dirname, 'n8n_workflows', 'whatsapp_llm_flow.json');
const originalData = JSON.parse(fs.readFileSync(originalFile, 'utf8'));

// Helper to find a node
const getNode = (name) => {
  const found = originalData.nodes.find(n => n.name === name || n.name.includes(name));
  return found ? JSON.parse(JSON.stringify(found)) : null;
};

// 1. Get original nodes we want to keep
const nodeVerifyGet = getNode("WhatsApp Verification (GET)");
const nodeRespondChallenge = getNode("Respond Challenge");
const nodeWebhookPost = getNode("WhatsApp Webhook (POST)");
const nodeUpsertSession = getNode("1. Upsert Session (Lock)");

const nodeGetHistory = getNode("2. Get Recent History");
const nodeOpenRouter = getNode("OpenRouter");
const nodeSaveHistory = getNode("Save Chat History");
const nodeSendWhatsApp = getNode("Send WhatsApp");

// LLM Branch Nodes
nodeGetHistory.parameters.query = "SELECT sender_type, message_text FROM chat_messages WHERE conversation_id = '{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}' ORDER BY created_at DESC LIMIT 10;";
nodeOpenRouter.name = "3. OpenRouter (LLM Main)";
nodeOpenRouter.parameters.jsonBody = `={\n  "model": "openrouter/free",\n  "messages": [\n    {\n      "role": "system",\n      "content": "====== SISTEMA ======\\n{{ $('Context Builder').first().json.systemContext }}\\n\\n====== CONOCIMIENTO RELEVANTE ======\\n{{ $('Context Builder').first().json.knowledgeContext }}"\n    },\n    {\n      "role": "user",\n      "content": "{{ $('Context Builder').first().json.needsHistory ? '=== HISTORIAL RECIENTE ===\\\\n' + $('2. Get Recent History').all().reverse().map(m => (m.json.sender_type === 'user' ? 'Paciente' : 'Sofía') + ': ' + m.json.message_text).join('\\\\n') + '\\\\n\\\\n' : '' }}Mensaje actual del paciente: \\"{{ $('Context Builder').first().json.userMessage }}\\""\n    }\n  ]\n}`;

const nodeSaveHistoryLLM = JSON.parse(JSON.stringify(nodeSaveHistory));
nodeSaveHistoryLLM.name = "Save Chat History (LLM)";
nodeSaveHistoryLLM.parameters.query = "INSERT INTO chat_messages (conversation_id, sender_type, message_text) VALUES ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'user', '{{ $('Intent Classifier').first().json.originalMessage.replace(\"'\", \"''\") }}'), ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'assistant', '{{ $('3. OpenRouter (LLM Main)').first().json.choices[0].message.content.replace(\"'\", \"''\") }}');";

const nodeSendWhatsAppLLM = JSON.parse(JSON.stringify(nodeSendWhatsApp));
nodeSendWhatsAppLLM.name = "Send WhatsApp (LLM)";
nodeSendWhatsAppLLM.parameters.jsonBody = "={\n  \"messaging_product\": \"whatsapp\",\n  \"recipient_type\": \"individual\",\n  \"to\": \"{{ ($('WhatsApp Webhook (POST)').first().json.body || $('WhatsApp Webhook (POST)').first().json).entry[0].changes[0].value.messages[0].from }}\",\n  \"type\": \"text\",\n  \"text\": {\n    \"preview_url\": false,\n    \"body\": \"{{ $('3. OpenRouter (LLM Main)').first().json.choices[0].message.content }}\"\n  }\n}";

// Static Branch Nodes
const nodeSaveHistoryStatic = JSON.parse(JSON.stringify(nodeSaveHistory));
nodeSaveHistoryStatic.name = "Save Chat History (Static)";
nodeSaveHistoryStatic.parameters.query = "INSERT INTO chat_messages (conversation_id, sender_type, message_text) VALUES ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'user', '{{ $('Intent Classifier').first().json.originalMessage.replace(\"'\", \"''\") }}'), ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'assistant', '{{ $('Set Static Response').first().json.bot_response.replace(\"'\", \"''\") }}');";

const nodeSendWhatsAppStatic = JSON.parse(JSON.stringify(nodeSendWhatsApp));
nodeSendWhatsAppStatic.name = "Send WhatsApp (Static)";
nodeSendWhatsAppStatic.parameters.jsonBody = "={\n  \"messaging_product\": \"whatsapp\",\n  \"recipient_type\": \"individual\",\n  \"to\": \"{{ ($('WhatsApp Webhook (POST)').first().json.body || $('WhatsApp Webhook (POST)').first().json).entry[0].changes[0].value.messages[0].from }}\",\n  \"type\": \"text\",\n  \"text\": {\n    \"preview_url\": false,\n    \"body\": \"{{ $('Set Static Response').first().json.bot_response }}\"\n  }\n}";

// 2. Create New Nodes
const nodeClassifier = {
  "parameters": {
    "jsCode": "const msg = ($('WhatsApp Webhook (POST)').first().json.body || $('WhatsApp Webhook (POST)').first().json).entry[0].changes[0].value.messages[0].text.body || '';\nconst msgLower = msg.toLowerCase().trim();\n\nlet intent = 'OTRO';\nlet isTrivial = false;\nlet staticResponse = '';\nlet needsHistory = true;\n\nif (/^(hola|buenos d[íi]as|buenas tardes|buenas noches|hey|saludos|q tal)$/.test(msgLower)) {\n  intent = 'SALUDO';\n  isTrivial = true;\n  staticResponse = '¡Hola! 😁 Bienvenido a Smile Studio. ¿En qué te puedo ayudar hoy?';\n} else if (/^(gracias|muchas gracias|te lo agradezco|ok|perfecto|vale|entendido)$/.test(msgLower)) {\n  intent = 'AGRADECIMIENTO';\n  isTrivial = true;\n  staticResponse = '¡Con mucho gusto! Aquí estoy si necesitas algo más. 🦷';\n} else if (/^(adi[óo]s|bye|hasta luego|nos vemos|chao)$/.test(msgLower)) {\n  intent = 'DESPEDIDA';\n  isTrivial = true;\n  staticResponse = '¡Hasta pronto! Que tengas un excelente día. 😊';\n} else if (msgLower.includes('precio') || msgLower.includes('cuesta') || msgLower.includes('costo') || msgLower.includes('pagar') || msgLower.includes('msi') || msgLower.includes('tarjeta')) {\n  intent = 'PRECIOS';\n} else if (msgLower.includes('horario') || msgLower.includes('ubicacion') || msgLower.includes('dónde están') || msgLower.includes('dirección') || msgLower.includes('abren')) {\n  intent = 'HORARIOS_UBICACION';\n  needsHistory = false;\n} else if (msgLower.includes('cita') || msgLower.includes('agendar') || msgLower.includes('turno')) {\n  intent = 'AGENDAR';\n}\n\nreturn { intent, isTrivial, staticResponse, needsHistory, originalMessage: msg };"
  },
  "id": "classifier-node",
  "name": "Intent Classifier",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [650, 300]
};

const nodeSwitch = {
  "parameters": {
    "dataType": "boolean",
    "value1": "={{ $json.isTrivial }}",
    "rules": { "rules": [ { "value2": true, "output": 0 } ] },
    "fallbackOutput": 1
  },
  "id": "switch-node",
  "name": "Is Trivial?",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3,
  "position": [850, 300]
};

const nodeSetStatic = {
  "parameters": {
    "keepOnlySet": true,
    "values": {
      "string": [
        { "name": "bot_response", "value": "={{ $('Intent Classifier').first().json.staticResponse }}" },
        { "name": "user_message", "value": "={{ $('Intent Classifier').first().json.originalMessage }}" }
      ]
    },
    "options": {}
  },
  "id": "static-response-node",
  "name": "Set Static Response",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.2,
  "position": [1050, 150]
};

const nodeContextBuilder = {
  "parameters": {
    "jsCode": "const fs = require('fs');\nconst path = require('path');\n\nconst intent = $('Intent Classifier').first().json.intent;\nconst userMessage = $('Intent Classifier').first().json.originalMessage;\nconst needsHistory = $('Intent Classifier').first().json.needsHistory;\n\nlet systemContext = '';\ntry { systemContext = fs.readFileSync('/conocimiento/identidad.md', 'utf8'); } catch (e) { systemContext = 'Eres Sofía, asistente dental.'; }\n\nlet knowledgeContext = '';\ntry {\n  if (intent === 'PRECIOS') knowledgeContext = fs.readFileSync('/conocimiento/servicios_precios.md', 'utf8');\n  else if (intent === 'HORARIOS_UBICACION') knowledgeContext = fs.readFileSync('/conocimiento/horarios_ubicacion.md', 'utf8');\n  else if (intent === 'AGENDAR') knowledgeContext = fs.readFileSync('/conocimiento/protocolo_agendamiento.md', 'utf8');\n  else knowledgeContext = fs.readFileSync('/conocimiento/servicios_precios.md', 'utf8') + '\\n\\n' + fs.readFileSync('/conocimiento/horarios_ubicacion.md', 'utf8');\n} catch (e) { knowledgeContext = 'Información general de la clínica.'; }\n\nreturn { systemContext, knowledgeContext, userMessage, needsHistory };"
  },
  "id": "context-builder-node",
  "name": "Context Builder",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [1050, 450]
};

const nodeSwitchHistory = {
  "parameters": {
    "dataType": "boolean",
    "value1": "={{ $json.needsHistory }}",
    "rules": { "rules": [ { "value2": true, "output": 0 } ] },
    "fallbackOutput": 1
  },
  "id": "switch-history-node",
  "name": "Needs History?",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3,
  "position": [1250, 450]
};

// Positions
nodeSaveHistoryStatic.position = [1250, 150];
nodeSendWhatsAppStatic.position = [1450, 150];

nodeGetHistory.position = [1450, 350];
nodeOpenRouter.position = [1650, 450];
nodeSaveHistoryLLM.position = [1850, 450];
nodeSendWhatsAppLLM.position = [2050, 450];


const newConnections = {
  "WhatsApp Verification (GET)": { "main": [ [ { "node": "Respond Challenge", "type": "main", "index": 0 } ] ] },
  "WhatsApp Webhook (POST)": { "main": [ [ { "node": "1. Upsert Session (Lock)", "type": "main", "index": 0 } ] ] },
  "1. Upsert Session (Lock)": { "main": [ [ { "node": "Intent Classifier", "type": "main", "index": 0 } ] ] },
  "Intent Classifier": { "main": [ [ { "node": "Is Trivial?", "type": "main", "index": 0 } ] ] },
  "Is Trivial?": {
    "main": [
      [ { "node": "Set Static Response", "type": "main", "index": 0 } ],
      [ { "node": "Context Builder", "type": "main", "index": 0 } ]
    ]
  },
  "Set Static Response": { "main": [ [ { "node": "Save Chat History (Static)", "type": "main", "index": 0 } ] ] },
  "Save Chat History (Static)": { "main": [ [ { "node": "Send WhatsApp (Static)", "type": "main", "index": 0 } ] ] },
  
  "Context Builder": { "main": [ [ { "node": "Needs History?", "type": "main", "index": 0 } ] ] },
  "Needs History?": {
    "main": [
      [ { "node": "2. Get Recent History", "type": "main", "index": 0 } ],
      [ { "node": "3. OpenRouter (LLM Main)", "type": "main", "index": 0 } ]
    ]
  },
  "2. Get Recent History": { "main": [ [ { "node": "3. OpenRouter (LLM Main)", "type": "main", "index": 0 } ] ] },
  "3. OpenRouter (LLM Main)": { "main": [ [ { "node": "Save Chat History (LLM)", "type": "main", "index": 0 } ] ] },
  "Save Chat History (LLM)": { "main": [ [ { "node": "Send WhatsApp (LLM)", "type": "main", "index": 0 } ] ] }
};

const newNodes = [
  nodeVerifyGet, nodeRespondChallenge, nodeWebhookPost, nodeUpsertSession,
  nodeClassifier, nodeSwitch, nodeSetStatic, nodeContextBuilder, nodeSwitchHistory,
  nodeSaveHistoryStatic, nodeSendWhatsAppStatic,
  nodeGetHistory, nodeOpenRouter, nodeSaveHistoryLLM, nodeSendWhatsAppLLM
];

const newFlow = { ...originalData, nodes: newNodes, connections: newConnections };

fs.writeFileSync(originalFile, JSON.stringify(newFlow, null, 2), 'utf8');
console.log("whatsapp_llm_flow.json regenerated cleanly.");
