import * as fs from "fs";
import * as path from "path";

const logFile = path.join(__dirname, "app.log");

function log(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

setInterval(() => {
  log("Mensaje de log de ejemplo generado por TypeScript");
}, 5_000);
