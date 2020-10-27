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