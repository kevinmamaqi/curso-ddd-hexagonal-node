#!/usr/bin/env node
import fs from "fs";
import path from "path";

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (name.endsWith(".js")) {
      let src = fs.readFileSync(full, "utf8");

      // Handle `import ... from "X";` where X starts with "." (./ or ../)
      src = src.replace(
        /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
        (_, prefix, relPath, suffix) => {
          // if already has an extension, leave it alone
          if (relPath.match(/\.[cm]?js$/))
            return `${prefix}${relPath}${suffix}`;
          return `${prefix}${relPath}.js${suffix}`;
        }
      );

      // Same for dynamic imports: import("X")
      src = src.replace(
        /(import\(\s*['"])(\.\.?\/[^'"]+)(['"]\s*\))/g,
        (_, prefix, relPath, suffix) => {
          if (relPath.match(/\.[cm]?js$/))
            return `${prefix}${relPath}${suffix}`;
          return `${prefix}${relPath}.js${suffix}`;
        }
      );

      fs.writeFileSync(full, src);
    }
  }
}

walk(path.resolve(process.cwd(), "dist"));
console.log("✅ Appended .js extensions to all relative imports");
