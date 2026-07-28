const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const standaloneWhatsAppWorkflow = {
  "id": "whatsapp-llm-flow-01",
  "name": "WhatsApp - LLM Assistant (Dental Clinic)",
  "active": true,
  "nodes": [
    {
      "parameters": {
        "httpMethod": "GET",
        "path": "whatsapp",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "1",
      "name": "WhatsApp Verification (GET)",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 150],
      "webhookId": "whatsapp-llm-get-webhook-id"
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "={{ $json.query['hub.challenge'] }}",
        "options": {}
      },
      "id": "1-verify",
      "name": "Respond Challenge",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [450, 150]
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "whatsapp",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "1-post",
      "name": "WhatsApp Webhook (POST)",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 350],
      "webhookId": "whatsapp-llm-webhook-id"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM upsert_whatsapp_session('{{ ($json.body || $json).entry[0].changes[0].value.messages[0].from }}', '{{ (($json.body || $json).entry[0].changes[0].value.contacts[0] || {}).profile?.name || \"Paciente\" }}');",
        "options": {}
      },
      "id": "2",
      "name": "1. Upsert Session (Lock)",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [450, 300],
      "credentials": {
        "postgres": {
          "id": "5xCEAI6rBEvMyYE5",
          "name": "Postgres account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const msg = ($('WhatsApp Webhook (POST)').first().json.body || $('WhatsApp Webhook (POST)').first().json).entry[0].changes[0].value.messages[0].text.body || '';\nconst msgLower = msg.toLowerCase().trim();\n\nlet intent = 'OTRO';\nlet isTrivial = false;\nlet staticResponse = '';\nlet needsHistory = true;\n\nif (/^(hola|buenos d[íi]as|buenas tardes|buenas noches|hey|saludos|q tal)$/.test(msgLower)) {\n  intent = 'SALUDO';\n  isTrivial = true;\n  staticResponse = '¡Hola! 😁 Bienvenido a Smile Studio. ¿En qué te puedo ayudar hoy?';\n} else if (/^(gracias|muchas gracias|te lo agradezco|ok|perfecto|vale|entendido)$/.test(msgLower)) {\n  intent = 'AGRADECIMIENTO';\n  isTrivial = true;\n  staticResponse = '¡Con mucho gusto! Aquí estoy si necesitas algo más. 🦷';\n} else if (/^(adi[óo]s|bye|hasta luego|nos vemos|chao)$/.test(msgLower)) {\n  intent = 'DESPEDIDA';\n  isTrivial = true;\n  staticResponse = '¡Hasta pronto! Que tengas un excelente día. 😊';\n} else if (msgLower.includes('precio') || msgLower.includes('cuesta') || msgLower.includes('costo') || msgLower.includes('pagar') || msgLower.includes('msi') || msgLower.includes('tarjeta')) {\n  intent = 'PRECIOS';\n} else if (msgLower.includes('horario') || msgLower.includes('ubicacion') || msgLower.includes('dónde están') || msgLower.includes('dirección') || msgLower.includes('abren')) {\n  intent = 'HORARIOS_UBICACION';\n  needsHistory = false;\n} else if (msgLower.includes('cita') || msgLower.includes('agendar') || msgLower.includes('turno')) {\n  intent = 'AGENDAR';\n}\n\nreturn { intent, isTrivial, staticResponse, needsHistory, originalMessage: msg };"
      },
      "id": "classifier-node",
      "name": "Intent Classifier",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [650, 300]
    },
    {
      "parameters": {
        "dataType": "boolean",
        "value1": "={{ $json.isTrivial }}",
        "rules": {
          "rules": [
            {
              "value2": true,
              "output": 0
            }
          ]
        },
        "fallbackOutput": 1
      },
      "id": "switch-node",
      "name": "Is Trivial?",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [850, 300]
    },
    {
      "parameters": {
        "keepOnlySet": true,
        "values": {
          "string": [
            {
              "name": "bot_response",
              "value": "={{ $('Intent Classifier').first().json.staticResponse }}"
            },
            {
              "name": "user_message",
              "value": "={{ $('Intent Classifier').first().json.originalMessage }}"
            }
          ]
        },
        "options": {}
      },
      "id": "static-response-node",
      "name": "Set Static Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.2,
      "position": [1050, 150]
    },
    {
      "parameters": {
        "jsCode": "const fs = require('fs');\n\nconst intent = $('Intent Classifier').first().json.intent;\nconst userMessage = $('Intent Classifier').first().json.originalMessage;\nconst needsHistory = $('Intent Classifier').first().json.needsHistory;\n\nlet systemContext = '';\ntry { systemContext = fs.readFileSync('/conocimiento/identidad.md', 'utf8'); } catch (e) { systemContext = 'Eres Sofía, asistente dental.'; }\n\nlet knowledgeContext = '';\ntry {\n  if (intent === 'PRECIOS') knowledgeContext = fs.readFileSync('/conocimiento/servicios_precios.md', 'utf8');\n  else if (intent === 'HORARIOS_UBICACION') knowledgeContext = fs.readFileSync('/conocimiento/horarios_ubicacion.md', 'utf8');\n  else if (intent === 'AGENDAR') knowledgeContext = fs.readFileSync('/conocimiento/protocolo_agendamiento.md', 'utf8');\n  else knowledgeContext = fs.readFileSync('/conocimiento/servicios_precios.md', 'utf8') + '\\n\\n' + fs.readFileSync('/conocimiento/horarios_ubicacion.md', 'utf8');\n} catch (e) { knowledgeContext = 'Información general de la clínica.'; }\n\nreturn { systemContext, knowledgeContext, userMessage, needsHistory };"
      },
      "id": "context-builder-node",
      "name": "Context Builder",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1050, 450]
    },
    {
      "parameters": {
        "dataType": "boolean",
        "value1": "={{ $json.needsHistory }}",
        "rules": {
          "rules": [
            {
              "value2": true,
              "output": 0
            }
          ]
        },
        "fallbackOutput": 1
      },
      "id": "switch-history-node",
      "name": "Needs History?",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [1250, 450]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO chat_messages (conversation_id, sender_type, message_text) VALUES ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'user', '{{ $('Intent Classifier').first().json.originalMessage.replace(\"'\", \"''\") }}'), ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'assistant', '{{ $('Set Static Response').first().json.bot_response.replace(\"'\", \"''\") }}');",
        "options": {}
      },
      "id": "5",
      "name": "Save Chat History (Static)",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [1250, 150],
      "credentials": {
        "postgres": {
          "id": "5xCEAI6rBEvMyYE5",
          "name": "Postgres account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v25.0/{{ $env.WHATSAPP_PHONE_NUMBER_ID }}/messages",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{ $env.WHATSAPP_SYSTEM_USER_PERMANENT_TOKEN }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"messaging_product\": \"whatsapp\",\n  \"recipient_type\": \"individual\",\n  \"to\": \"{{ ($('WhatsApp Webhook (POST)').first().json.body || $('WhatsApp Webhook (POST)').first().json).entry[0].changes[0].value.messages[0].from }}\",\n  \"type\": \"text\",\n  \"text\": {\n    \"preview_url\": false,\n    \"body\": \"{{ $('Set Static Response').first().json.bot_response }}\"\n  }\n}",
        "options": {}
      },
      "id": "6",
      "name": "Send WhatsApp (Static)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1450, 150]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT sender_type, message_text FROM chat_messages WHERE conversation_id = '{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}' ORDER BY created_at DESC LIMIT 10;",
        "options": {}
      },
      "alwaysOutputData": true,
      "id": "3",
      "name": "2. Get Recent History",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [1450, 350],
      "credentials": {
        "postgres": {
          "id": "5xCEAI6rBEvMyYE5",
          "name": "Postgres account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "=Bearer {{ $env.OPENROUTER_API_KEY }}"
            },
            {
              "name": "HTTP-Referer",
              "value": "http://localhost:3000"
            },
            {
              "name": "X-Title",
              "value": "Smile Studio"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"model\": \"openrouter/free\",\n  \"messages\": [\n    {\n      \"role\": \"system\",\n      \"content\": \"====== SISTEMA ======\\n{{ $('Context Builder').first().json.systemContext }}\\n\\n====== CONOCIMIENTO RELEVANTE ======\\n{{ $('Context Builder').first().json.knowledgeContext }}\"\n    },\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $('Context Builder').first().json.needsHistory ? '=== HISTORIAL RECIENTE ===\\\\n' + $('2. Get Recent History').all().reverse().map(m => (m.json.sender_type === 'user' ? 'Paciente' : 'Sofía') + ': ' + m.json.message_text).join('\\\\n') + '\\\\n\\\\n' : '' }}Mensaje actual del paciente: \\\"{{ $('Context Builder').first().json.userMessage }}\\\"\"\n    }\n  ]\n}",
        "options": {}
      },
      "id": "4",
      "name": "3. OpenRouter (LLM Main)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1650, 450]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO chat_messages (conversation_id, sender_type, message_text) VALUES ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'user', '{{ $('Intent Classifier').first().json.originalMessage.replace(\"'\", \"''\") }}'), ('{{ $('1. Upsert Session (Lock)').first().json.conversation_id }}', 'assistant', '{{ $('3. OpenRouter (LLM Main)').first().json.choices[0].message.content.replace(\"'\", \"''\") }}');",
        "options": {}
      },
      "id": "5-llm",
      "name": "Save Chat History (LLM)",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.3,
      "position": [1850, 450],
      "credentials": {
        "postgres": {
          "id": "5xCEAI6rBEvMyYE5",
          "name": "Postgres account"
        }
      }
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://graph.facebook.com/v25.0/{{ $env.WHATSAPP_PHONE_NUMBER_ID }}/messages",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "=Bearer {{ $env.WHATSAPP_SYSTEM_USER_PERMANENT_TOKEN }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"messaging_product\": \"whatsapp\",\n  \"recipient_type\": \"individual\",\n  \"to\": \"{{ ($('WhatsApp Webhook (POST)').first().json.body || $('WhatsApp Webhook (POST)').first().json).entry[0].changes[0].value.messages[0].from }}\",\n  \"type\": \"text\",\n  \"text\": {\n    \"preview_url\": false,\n    \"body\": \"{{ $('3. OpenRouter (LLM Main)').first().json.choices[0].message.content }}\"\n  }\n}",
        "options": {}
      },
      "id": "6-llm",
      "name": "Send WhatsApp (LLM)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [2050, 450]
    }
  ],
  "connections": {
    "WhatsApp Verification (GET)": {
      "main": [[{ "node": "Respond Challenge", "type": "main", "index": 0 }]]
    },
    "WhatsApp Webhook (POST)": {
      "main": [[{ "node": "1. Upsert Session (Lock)", "type": "main", "index": 0 }]]
    },
    "1. Upsert Session (Lock)": {
      "main": [[{ "node": "Intent Classifier", "type": "main", "index": 0 }]]
    },
    "Intent Classifier": {
      "main": [[{ "node": "Is Trivial?", "type": "main", "index": 0 }]]
    },
    "Is Trivial?": {
      "main": [
        [{ "node": "Set Static Response", "type": "main", "index": 0 }],
        [{ "node": "Context Builder", "type": "main", "index": 0 }]
      ]
    },
    "Set Static Response": {
      "main": [[{ "node": "Save Chat History (Static)", "type": "main", "index": 0 }]]
    },
    "Save Chat History (Static)": {
      "main": [[{ "node": "Send WhatsApp (Static)", "type": "main", "index": 0 }]]
    },
    "Context Builder": {
      "main": [[{ "node": "Needs History?", "type": "main", "index": 0 }]]
    },
    "Needs History?": {
      "main": [
        [{ "node": "2. Get Recent History", "type": "main", "index": 0 }],
        [{ "node": "3. OpenRouter (LLM Main)", "type": "main", "index": 0 }]
      ]
    },
    "2. Get Recent History": {
      "main": [[{ "node": "3. OpenRouter (LLM Main)", "type": "main", "index": 0 }]]
    },
    "3. OpenRouter (LLM Main)": {
      "main": [[{ "node": "Save Chat History (LLM)", "type": "main", "index": 0 }]]
    },
    "Save Chat History (LLM)": {
      "main": [[{ "node": "Send WhatsApp (LLM)", "type": "main", "index": 0 }]]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "saveDataErrorExecution": "all",
    "saveDataSuccessExecution": "all"
  }
};

const outputFile = path.join(__dirname, '..', 'infrastructure', 'n8n_workflows', 'whatsapp_llm_flow.json');
fs.writeFileSync(outputFile, JSON.stringify(standaloneWhatsAppWorkflow, null, 2), 'utf8');
console.log("Standalone WhatsApp Workflow written to:", outputFile);

const sql = `
UPDATE workflow_entity SET
  name = '${standaloneWhatsAppWorkflow.name}',
  active = true,
  nodes = '${JSON.stringify(standaloneWhatsAppWorkflow.nodes).replace(/'/g, "''")}'::json,
  connections = '${JSON.stringify(standaloneWhatsAppWorkflow.connections).replace(/'/g, "''")}'::json,
  settings = '${JSON.stringify(standaloneWhatsAppWorkflow.settings || {}).replace(/'/g, "''")}'::json,
  "updatedAt" = NOW()
WHERE id = 'whatsapp-llm-flow-01';

INSERT INTO shared_workflow ("workflowId", "projectId", "role") 
VALUES ('whatsapp-llm-flow-01', '66MPRt53ZeFhgWYa', 'workflow:owner') 
ON CONFLICT DO NOTHING;

INSERT INTO webhook_entity ("webhookPath", "method", "node", "webhookId", "workflowId") 
VALUES ('whatsapp', 'GET', 'WhatsApp Verification (GET)', 'whatsapp-llm-get-webhook-id', 'whatsapp-llm-flow-01') 
ON CONFLICT DO NOTHING;

INSERT INTO webhook_entity ("webhookPath", "method", "node", "webhookId", "workflowId") 
VALUES ('whatsapp', 'POST', 'WhatsApp Webhook (POST)', 'whatsapp-llm-webhook-id', 'whatsapp-llm-flow-01') 
ON CONFLICT DO NOTHING;
`;

const sqlFile = path.join(__dirname, 'restore_wa_standalone.sql');
fs.writeFileSync(sqlFile, sql, 'utf8');
execSync(`Get-Content "${sqlFile}" | docker exec -i dental_postgres psql -U dental_user -d dental_clinic_db`, { shell: 'powershell.exe' });
console.log("Standalone WhatsApp registered in DB successfully!");
