#!/usr/bin/env node
/**
 * THE GRAND INTERNET HOTEL — launcher
 * Run with: npx github:psiloceyeben/TheGrandInternetHotel-
 * 
 * Installs dependencies if needed and launches the Electron game.
 */

const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.resolve(__dirname);
const nm = path.join(root, "node_modules");

console.log("\n  ╔════════════════════════════════════╗");
console.log("  ║   THE GRAND INTERNET HOTEL         ║");
console.log("  ║   Loading...                        ║");
console.log("  ╚════════════════════════════════════╝\n");

// Check if electron is installed
const electronPath = path.join(nm, ".bin", process.platform === "win32" ? "electron.cmd" : "electron");

if (!fs.existsSync(electronPath)) {
  console.log("  Installing dependencies (first run only)...\n");
  try {
    execSync("npm install", { cwd: root, stdio: "inherit" });
  } catch (e) {
    console.error("  Failed to install dependencies:", e.message);
    process.exit(1);
  }
}

// Launch electron
console.log("  Launching game...\n");
const child = spawn(electronPath, [root], {
  cwd: root,
  stdio: "inherit",
  detached: process.platform !== "win32",
});

child.on("error", (err) => {
  console.error("  Failed to launch:", err.message);
  process.exit(1);
});

child.unref();

// Exit the launcher — game runs independently
setTimeout(() => process.exit(0), 2000);
