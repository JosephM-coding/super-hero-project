module.exports = {
  superName: {
    id: "superName",
    name: "superName", // Make sure name matches
    label: "Super Hero Name",
    type: "text",
    placeholder: "Enter superhero name",
    required: true,
  },
  realName: {
    id: "realName",
    name: "realName",
    label: "Real Name",
    type: "text",
    placeholder: "Enter real name",
    required: true,
  },
  superpower: {
    id: "superpower",
    name: "superpower", // Fixed: was 'powerLevel'
    label: "Superpower",
    type: "text",
    placeholder: "Enter superpower",
    required: true,
  },
  powerLevel: {
    id: "powerLevel",
    name: "powerLevel",
    label: "Power Level",
    type: "number",
    placeholder: "Enter power level",
    min: 1,
    max: 100,
    required: true,
  },
};
