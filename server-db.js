const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const PORT = 3000;

const heroFields = require("./config/heroInputs.config.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const DATA_FILE = path.join(__dirname, "data", "ui-heros.json");

// Helper function to read heroes
async function readHeroes() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if file doesn't exist
  }
}
// Helper function to write heroes
async function writeHeroes(heroes) {
  await fs.writeFile(DATA_FILE, JSON.stringify(heroes, null, 2));
}
// Initialize empty heroes file
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await writeHeroes([]);
  }
}
initializeDataFile();

app.post("/form", async (req, res) => {
  try {
    const heroes = await readHeroes();
    const newHero = {
      id: Date.now().toString(),
      superName: req.body.superName,
      realName: req.body.realName,
      superpower: req.body.superpower,
      powerLevel: parseInt(req.body.powerLevel),
      secretIdentity: req.body.secretIdentity === "true",
      createdAt: new Date().toISOString(),
    };
    heroes.push(newHero);
    await writeHeroes(heroes);
    res.status(201).json({
      success: true,
      message: "Hero created successfully!",
      redirectTo: "/heroes",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/heroes", async (req, res) => {
  try {
    const heroes = await readHeroes();
    if (req.accepts("html")) {
      res.render("heroList", { heroes });
    } else {
      res.json({ success: true, count: heroes.length, data: heroes });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/heroes/:id", async (req, res) => {
  try {
    const heroes = await readHeroes();
    const heroIndex = heroes.findIndex((h) => h.id === req.params.id);
    if (heroIndex === -1) {
      return res.status(404).json({ success: false, error: "Hero not found" });
    }
    heroes[heroIndex] = {
      ...heroes[heroIndex],
      superName: req.body.superName,
      realName: req.body.realName,
      superpower: req.body.superpower,
      powerLevel: parseInt(req.body.powerLevel),
      secretIdentity: req.body.secretIdentity === "true",
      updatedAt: new Date().toISOString(),
    };
    await writeHeroes(heroes);
    res.json({ success: true, data: heroes[heroIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/form/:id", async (req, res) => {
  try {
    const heroes = await readHeroes();
    const filteredHeroes = heroes.filter((h) => h.id !== req.params.id);
    if (heroes.length === filteredHeroes.length) {
      return res.status(404).json({ success: false, error: "Hero not found" });
    }
    await writeHeroes(filteredHeroes);
    res.json({ success: true, message: "Hero deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/form", async (req, res) => {
  const heroFields = require("./config/heroInputs.config.js");
  const heroes = await readHeroes();
  // res.json({ heroes });
  res.render("heroForm", heroFields);
});

app.listen(PORT, () => {
  console.log("App is listening on 3000");
});

//  <% if (min !== undefined) { %>min="<%= min %>"<% } %>
// <% if (max !== undefined) { %>max="<%= max %>"<% } %>
// <% if (required) { %>required<% } %>
