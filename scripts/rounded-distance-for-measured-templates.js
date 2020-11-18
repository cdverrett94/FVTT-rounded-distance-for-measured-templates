// register module settings for multiple to round to
Hooks.once("init", function() {
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

// round to nearest multiple
const roundToMultiple = (number, multiple) => {
  return (Math.sign(number) < 0) ? Math.min(Math.round(number / multiple) * multiple, -multiple) : Math.max(Math.round(number / multiple) * multiple, multiple);
}

Hooks.once("ready", () => {
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
    let multiple = game.settings.get('rounded-distance-for-measured-templates', 'distance-multiple') || canvas.scene.data.gridDistance;

    if (preview.data.t === "rect") { // if measured template
      ray.dx = roundToMultiple(ray.dx, ratio * multiple);
      ray.dy = roundToMultiple(ray.dy, ratio * multiple);


      ray.distance = Math.hypot(ray.dx, ray.dy);

      if (ray.dx < 0 & ray.dy > 0) {
        ray.angle = toRadians(90) - Math.atan(ray.dx / ray.dy);
      } else if (ray.dx < 0 && ray.dy < 0) {
        ray.angle = toRadians(-90) - Math.atan(ray.dx / ray.dy);
      } else {
        ray.angle = Math.atan(ray.dy / ray.dx);
      }
    } else {
      ray.distance = roundToMultiple(ray.distance, ratio * multiple);
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