#!/usr/bin/env node

const yaml = require("js-yaml");
const fs = require("fs");
const { globSync } = require("glob");

// Find all YAML files, excluding node_modules
const ymlFiles = globSync(".github/workflows/*.yml", {
  ignore: ["node_modules/**"],
});

let hasErrors = false;

if (ymlFiles.length === 0) {
  console.log("No YAML files found.");
  process.exit(0);
}

ymlFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf8");
    yaml.load(content);
    console.log("✓", file);
  } catch (e) {
    console.error("✗", file, ":", e.message);
    hasErrors = true;
  }
});

process.exit(hasErrors ? 1 : 0);
