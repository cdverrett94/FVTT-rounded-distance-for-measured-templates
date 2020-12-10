// register module settings for multiple to round to
Hooks.once("init", function() {
    game.settings.register('rounded-distance-for-measured-templates', 'distance-multiple', {
        name: "What multiple should the distances for your measured templated be?",
        hint: "The multiple you want the measured templates distance to round to. If left blank, the measured templates will be rounded based on the scenes grid distance.",
        scope: 'world',
        config: true,
        restricted: true,
        default: "",
        type: String
    });

    game.settings.register('rounded-distance-for-measured-templates', 'angle-multiple', {
        name: "What multiple should the angle for cones and rays be rounded to?",
        hint: "The multiple you want the angle for cones and rays to snap. If left blank, there won't be any angle snapping.",
        scope: 'world',
        config: true,
        restricted: true,
        default: "",
        type: String
    });

    game.settings.register('rounded-distance-for-measured-templates', 'use-steps', {
        name: "Should the distances be rounded by steps instead of a single value?",
        hint: "If set to yes, given a step array of '1, 5, 10, 20, 50', the rounded disatnce would start at 1, then round to 5, then round to 10, etc.",
        scope: 'world',
        config: true,
        restricted: true,
        default: false,
        type: Boolean
    });

    game.settings.register('rounded-distance-for-measured-templates', 'step-array', {
        name: "What array of steps do you want to use?",
        hint: "Put the steps you want separated by a comma. Example: 1, 5, 10, 20, 50",
        scope: 'world',
        config: true,
        restricted: true,
        default: "1, 5, 10, 20, 50",
        type: String
    });

    game.settings.register('rounded-distance-for-measured-templates', 'use-multiple-after-steps', {
        name: "After all steps are used, should the distances to default to round to the nearest multiple?",
        hint: "",
        scope: 'world',
        config: true,
        restricted: true,
        default: false,
        type: Boolean
    });
});



/*
  Round a number to the nearest multiple 

  number - current distance number before rounding
  multiple - what multiple to round to
  minimum - minimum number to round to - prevents distance from being 0
*/
const roundToMultiple = (number, multiple, minimum) => {
    return (Math.sign(number) < 0) ? Math.min(Math.round(number / multiple) * multiple, -minimum) : Math.max(Math.round(number / multiple) * multiple, minimum);
}


/*
  Rounds a number to the nearest step in the arry and 

  array - array of steps 
  number - current distance number before rounding
  multiple - what multiple to round to
  increase_after_step - if using stepped rounding, should the rounding stop (false) or go to default rounding (true) 

*/
const roundToStep = (array, number, multiple, increase_after_step) => {
    if (number < 0) array = array.map(x => -x).sort((first, second) => (second - first)); // if number is negative set each item in array to negative version of itself and reverse sort
    if (((number >= array[array.length - 1] && number >= 0) || (number <= array[array.length - 1] && number < 0)) && increase_after_step) { // check if number is >= (<=) last index if number is postive (negative) and if increase_after_step is true
        return roundToMultiple(number, multiple, array[array.length - 1]);
    } else {
        let closest = 0;
        closest = array.reduce(function(prev, curr) {
            return (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev);
        });

        console.log(array, increase_after_step, number, closest);
        return closest;
    }
}


/*
  Choose which rounding method to use based on setting
  
  use_steps - should the rounding be based on steps - set in the module settings
  number - current distance number before rounding
  multiple - what multiple to round to
  array - array of steps 
  increase_after_step - if using stepped rounding, should the rounding stop (false) or go to default rounding (true) 

*/
const roundDistance = (use_steps, number, multiple, minimum, array, increase_after_step) => {
    if (use_steps) {
        return roundToStep(array, number, multiple, increase_after_step);
    } else {
        return roundToMultiple(number, multiple, minimum);
    }
};

Hooks.on("ready", () => {
    TemplateLayer.prototype._onDragLeftMove = function(event) {
        const {
            destination,
            createState,
            preview,
            origin
        } = event.data;

        if (createState === 0) return;
        // Snap the destination to the grid
        event.data.destination = canvas.grid.getSnappedPosition(destination.x, destination.y, this.gridPrecision);
        // Compute the ray
        const ray = new Ray(origin, destination);
        const ratio = (canvas.dimensions.size / canvas.dimensions.distance);


        // Start amended code to round distances
        let distanceMultiple = game.settings.get('rounded-distance-for-measured-templates', 'distance-multiple') || canvas.scene.data.gridDistance; // distance multiple from settings. defaults to grid distance
        let angleMultiple = game.settings.get('rounded-distance-for-measured-templates', 'angle-multiple'); // multiple to snap angles for cones and rays
        let useSteps = game.settings.get('rounded-distance-for-measured-templates', 'use-steps'); // use stepped distance multiples
        let stepArray = game.settings.get('rounded-distance-for-measured-templates', 'step-array').split(",").map(x => parseInt(x) * ratio).sort((first, second) => (first - second)); // steps array converted to integers and converted to pixels and sorted
        let useMultiplesAfterSteps = game.settings.get('rounded-distance-for-measured-templates', 'use-multiple-after-steps'); // use distanceMultiple after reaching highest integer from stepArray

        if (preview.data.t === "rect") { // if measured template is a rectangle.
            // round width and height to nearest multiple.

            ray.dx = roundDistance(useSteps, ray.dx, ratio * distanceMultiple, ratio * distanceMultiple, stepArray, useMultiplesAfterSteps);
            ray.dy = roundDistance(useSteps, ray.dy, ratio * distanceMultiple, ratio * distanceMultiple, stepArray, useMultiplesAfterSteps);

            // set new ray distance based on updated width and height values
            ray.distance = Math.hypot(ray.dx, ray.dy);

            // when the width is a negative value (to the left of the origin point), foundry shows the angle becomes >90 or <-90, so have to add those values back to the angles as they get set to to <90 and >-90 based on calculatin angle of a square
            if (ray.dx < 0 & ray.dy > 0) { // if creating to the bottom left of start point
                ray.angle = toRadians(90) - Math.atan(ray.dx / ray.dy);
            } else if (ray.dx < 0 && ray.dy < 0) { // if creating to the top left of start point
                ray.angle = toRadians(-90) - Math.atan(ray.dx / ray.dy);
            } else { // if creating to the right of the start point
                ray.angle = Math.atan(ray.dy / ray.dx);
            }
        } else { // if measured template is anything other than a rectangle.
            ray.distance = roundDistance(useSteps, ray.distance, ratio * distanceMultiple, ratio * distanceMultiple, stepArray, useMultiplesAfterSteps);
        }

        // round angles to nearest angleMultiple for cones and rays
        if ((preview.data.t === "cone" || preview.data.t === "ray") && angleMultiple) {
            // round angle
            ray.angle = toRadians(roundToMultiple(toDegrees(ray.angle), angleMultiple, 0));
        }
        // End amended code to round distances


        // Update the preview object
        preview.data.direction = toDegrees(ray.angle);
        preview.data.distance = ray.distance / ratio;
        preview.refresh();
        // Confirm the creation state
        event.data.createState = 2;
    };
});