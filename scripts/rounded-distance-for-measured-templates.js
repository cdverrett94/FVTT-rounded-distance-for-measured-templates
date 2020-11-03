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

// round to nearest decimal place. will delete when foundry global function is fixed.
const roundToDecimalPlace = (number, places) => {
	const factorOfTen = Math.pow(10, places);
	return Math.round(number * factorOfTen) / factorOfTen;
}

// round to nearest multiple
const roundToMultiple = (number, multiple) => {
	return Math.round(number / multiple) * multiple;
}

Hooks.on("preCreateMeasuredTemplate", (...args) => {
	let data = args[1];
	let multiple = game.settings.get('rounded-distance-for-measured-templates', 'distance-multiple') || canvas.scene.data.gridDistance;

	if (data.t === "rect") { // process if type is rectangle/square
		// use Sine and Tangent functions to figure out width and height based on the angle and distance provided
		let oppositeSide = roundToDecimalPlace(Math.sin(toRadians(data.direction)) * data.distance, 14);
		let adjacentSide = roundToDecimalPlace(Math.cos(toRadians(data.direction)) * data.distance, 14);

		if ((Math.abs(oppositeSide % multiple) < 0.00001 || Math.abs(oppositeSide % multiple) > (multiple - 0.00001)) && (Math.abs(adjacentSide % multiple) < 0.00001 || Math.abs(adjacentSide % multiple) > (multiple - 0.00001))) { // see if the width and height are within 0.00001 of the multiple. Did it like this because there were some rounding issues that could result in an infinite loop and crash
			return true;
		} else {
			// round the width and height to the multiple
			oppositeSide = (oppositeSide >= 0) ? Math.max(roundToMultiple(oppositeSide, multiple), multiple) : Math.min(roundToMultiple(oppositeSide, multiple), -multiple);
			adjacentSide = (adjacentSide >= 0) ? Math.max(roundToMultiple(adjacentSide, multiple), multiple) : Math.min(roundToMultiple(adjacentSide, multiple), -multiple);

			if (adjacentSide < 0)[oppositeSide, adjacentSide] = [adjacentSide, oppositeSide]; // if adjacentSide is a negative integer, flip the values.

			// set the new distance and degrees based on the width/height
			// set degrees for when oppositeSide is negative and direction is more than 90 or less than -90
			if (oppositeSide < 0 && data.direction > 90) {
				data.direction = 90 - toDegrees(Math.atan(oppositeSide / adjacentSide));
			} else if (oppositeSide < 0 && data.direction < -90) {
				data.direction = -90 - toDegrees(Math.atan(oppositeSide / adjacentSide));
			} else {
				data.direction = toDegrees(Math.atan(oppositeSide / adjacentSide));
			}
			data.distance = Math.hypot(oppositeSide, adjacentSide); // get new hypotenuse/distance

			MeasuredTemplate.create(data);
			return false;
		}
	} else { // process if type is anything other than rectangle/square
		if (data.distance % multiple === 0) {
			return true;
		} else {
			data.distance = Math.max(roundToMultiple(data.distance, multiple), multiple);
			MeasuredTemplate.create(data);
			return false;
		}
	}
});
console.log("Rounded Distance for Measured Templates Loaded");