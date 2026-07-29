import { readFile, writeFile } from "node:fs/promises";

const workflowPath = new URL(
  "../infrastructure/n8n_workflows/webchat_flow.json",
  import.meta.url,
);

const obsoleteNodeIds = new Set([
  "wc-booking-extract",
  "wc-booking-check",
  "wc-booking-query",
  "wc-booking-build",
  "wc-booking-cal",
  "wc-booking-save",
  "wc-booking-email",
  "wc-booking-admin-email",
]);

const workflow = JSON.parse(await readFile(workflowPath, "utf8"));

workflow.nodes = workflow.nodes.filter((node) => !obsoleteNodeIds.has(node.id));

const existingNodeNames = new Set(workflow.nodes.map((node) => node.name));
for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
  if (!existingNodeNames.has(sourceName)) {
    delete workflow.connections[sourceName];
    continue;
  }

  for (const outputGroup of Object.values(outputs)) {
    for (const branches of outputGroup) {
      for (let index = branches.length - 1; index >= 0; index -= 1) {
        if (!existingNodeNames.has(branches[index].node)) branches.splice(index, 1);
      }
    }
  }
}

workflow.connections["Save Chat History (LLM)"] = {
  main: [[{ node: "5. Respond to Widget", type: "main", index: 0 }]],
};

await writeFile(workflowPath, `${JSON.stringify(workflow, null, 2)}\n`, "utf8");

console.log(
  `WebChat workflow cleaned: ${workflow.nodes.length} nodes, ${obsoleteNodeIds.size} obsolete nodes removed.`,
);
