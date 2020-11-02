Hooks.on("init", function() {
	game.settings.register('rounded-distance-for-measured-templates', 'distance-multiple', {
		name: "What multiple to round to?",
		hint: "The multiple you want the measured templates distance to round to. If left blank, the measured templates will be rounded based on the scenes grid distance.",
		scope: 'world',
		config: true,
		restricted: true,
		default: "",
		type: String,
	});
});


Hooks.on("preCreateMeasuredTemplate", (...args) => {
	let multiple = game.settings.get('rounded-distance-for-measured-templates', 'distance-multiple') || canvas.scene.data.gridDistance;
	console.log(multiple);

	console.log(args);
	if (args[1].distance % multiple === 0) {
		return true;
	} else {
		args[1].distance = Math.max(Math.round(args[1].distance / multiple) * multiple, multiple);
		MeasuredTemplate.create(args[1]);
		return false;
	}
});
console.log("Rounded Distance for Measured Templates Loaded");