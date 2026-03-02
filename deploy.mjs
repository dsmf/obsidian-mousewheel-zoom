import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);

const vault = process.env.VAULT;
if (!vault) {
	console.error("Error: VAULT environment variable is not set.");
	console.error("Set it to your test vault path, e.g.:");
	console.error("  export VAULT=\"/path/to/your/vault\"");
	console.error("  $env:VAULT = \"C:\\Path\\To\\Your\\Vault\"  (PowerShell)");
	process.exit(1);
}

const pluginId = "obsidian-mousewheel-zoom";
const destDir = join(vault, ".obsidian", "plugins", pluginId);

const files = ["main.js", "manifest.json", "styles.css"];

try {
	mkdirSync(destDir, { recursive: true });
	for (const file of files) {
		const src = join(root, file);
		if (!existsSync(src)) {
			console.error(`Error: ${file} not found. Run \`npm run build\` first.`);
			process.exit(1);
		}
		copyFileSync(src, join(destDir, file));
		console.log(`Copied ${file} -> ${destDir}`);
	}
	console.log(`Deployed to ${destDir}`);
} catch (err) {
	console.error("Deploy failed:", err.message);
	process.exit(1);
}
