/**
 * Script de Automatización: Importador de Workflows a n8n
 * Permite cargar automáticamente los flujos JSON de infrastructure/n8n_workflows hacia n8n mediante Docker CLI o n8n REST API.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKFLOWS_DIR = path.resolve(__dirname, "../infrastructure/n8n_workflows");

console.log("🚀 Iniciando importación automática de workflows a n8n...\n");

if (!fs.existsSync(WORKFLOWS_DIR)) {
  console.error(`❌ La carpeta de workflows no existe: ${WORKFLOWS_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(WORKFLOWS_DIR).filter(file => file.endsWith(".json"));

if (files.length === 0) {
  console.log("⚠️ No se encontraron archivos JSON en infrastructure/n8n_workflows.");
  process.exit(0);
}

let successCount = 0;

for (const file of files) {
  const containerPath = `/n8n_workflows/${file}`;
  console.log(`📦 Importando workflow: ${file}...`);

  try {
    const cmd = `docker exec -i dental_n8n n8n import:workflow --input=${containerPath}`;
    const output = execSync(cmd, { encoding: "utf-8" });
    console.log(`✅ ¡Éxito al importar ${file}!`);
    console.log(output.trim());
    successCount++;
  } catch (err) {
    console.error(`❌ Error al importar ${file} vía Docker:`, err.message);
  }
}

console.log(`\n🎉 Resumen: Se importaron ${successCount}/${files.length} workflows en n8n automáticamente.`);
