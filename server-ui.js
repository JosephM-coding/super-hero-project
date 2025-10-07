const express = require("express");
const app = express();
const fs = require("fs").promises;
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const heroUIDBpath = path.join(__dirname, "data", "ui-heros.json");
const PORT = 4000;

// read, write functions
const readUsers = () => {
    try {
      return JSON.parse(fs.readFileSync(heroUIDBpath, "utf8"));
    } catch (e) {
      console.log('no users file found, initializing empty array');
      return [];
     }
}

const writeUsers = (users) => {
    const dataDir = path.dirname(heroUIDBpath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    //write file code
    fs.writeFileSync(heroUIDBpath, JSON.stringify(heroes, null, 2));
  }

  app.get("/heros/list", (req, res) => {
    const heroes = readUsers();
    res.render("heroList", { heroes });
  });
// --- routes ----
// ---- GET ----
app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(heroUIDBpath, "utf-8");
    const heroes = await JSON.parse(data);
    res.render("heroList.ejs", { heroes });
  } catch (error) {
    console.error("error reading console", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`App is serving UI listening on ${PORT}`);
});