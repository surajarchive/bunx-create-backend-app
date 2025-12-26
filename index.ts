#!/usr/bin/env bun
import { execSync } from "child_process";
import { createInterface } from "readline";
import fs from "fs";
import path from "path";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q: string): Promise<string> {
  return new Promise((res) => rl.question(q, (a) => res(a.trim())));
}

async function main() {
  const name = (await ask("Project name (backend-app): ")) || "backend-app";
  rl.close();

  console.log(`\n🚀 Creating project: ${name}\n`);

  execSync(
    `git clone https://github.com/surajarchive/backend-ts-boilerplate.git ${name}`,
    { stdio: "inherit" }
  );

  const projectPath = path.join(process.cwd(), name);
  process.chdir(projectPath);

  // clean git
  fs.rmSync(".git", { recursive: true, force: true });
  execSync("git init", { stdio: "ignore" });

  // update package.json
  const pkgPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = name;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log("\n📦 Installing dependencies...\n");
  execSync("bun install", { stdio: "inherit" });

  console.log("\n✅ Project ready\n");
  console.log(`cd ${name}`);
  console.log("bun dev");
}

main();
