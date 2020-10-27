Hooks.on("preCreateMeasuredTemplate", (...args) => {
  console.log(args);
  if (args[1].distance % 5 === 0) {
    return true;
  } else {
    args[1].distance = Math.max(Math.round(args[1].distance / 5) * 5, 5);
    MeasuredTemplate.create(args[1]);
    return false;
  }
});

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
  game.settings.register('rounded-measured-templates', 'multiple', {
    name: "What Multiple To Use",
    hint: "The multiple you want the measured templates to round to. ",
    scope: 'world',
    config: true,
    restricted: true,
    default: 5,
    type: String,
  });
});

Hooks.on("ready", function() {
  console.log("This code runs once core initialization is ready and game data is available.");
});