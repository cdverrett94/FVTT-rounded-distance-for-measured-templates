import { MODULE_NAME, roundDistance, roundToMultiple } from './helpers.mjs';
import { Settings } from './settings.mjs';

const onDragLeftMove = function (event) {
  const { destination, createState, preview, origin } = event.data;
  if (createState === 0) return;

  // Snap the destination to the grid
  event.data.destination = canvas.grid.getSnappedPosition(destination.x, destination.y, this.gridPrecision);

  // Compute the ray
  const ray = new Ray(origin, destination);
  const ratio = canvas.dimensions.size / canvas.dimensions.distance;

  // Start amended code to round distances
  try {
    if (preview.document.t === 'rect') {
      // for rectangles
      // round width and height to nearest multiple.
      ray.dx = roundDistance(Settings.moduleSettings['use-steps'], ray.dx);
      ray.dy = roundDistance(Settings.moduleSettings['use-steps'], ray.dy);
    } else {
      // for circles, cones, and rays
      ray._distance = roundDistance(Settings.moduleSettings['use-steps'], ray.distance);
    }

    // round angles for cones and rays
    if (preview.document.t === 'cone' && Settings.moduleSettings['cone-angle-multiple']) {
      // round angle
      ray._angle = Math.toRadians(roundToMultiple(Math.toDegrees(ray.angle), Settings.moduleSettings['cone-angle-multiple'], 0));
    }
    if (preview.document.t === 'ray' && Settings.moduleSettings['ray-angle-multiple']) {
      // round angle
      ray._angle = Math.toRadians(roundToMultiple(Math.toDegrees(ray.angle), Settings.moduleSettings['ray-angle-multiple'], 0));
    }
  } catch (error) {
    console.error(`Rounded Distance for Measured Templates: ${error.message}`);
  }
  // End amended code to round distances

  // Update the preview object
  preview.document.direction = Math.normalizeDegrees(Math.toDegrees(ray.angle));
  preview.document.distance = ray.distance / ratio;
  preview.refresh();

  // Confirm the creation state
  event.data.createState = 2;
};

Hooks.on('init', Settings.registerSettings);
Hooks.on('closeSettingsConfig', Settings.updateSettings);
Hooks.on('canvasInit', Settings.updateSettings);

Hooks.on('libWrapper.Ready', () => {
  libWrapper.register(MODULE_NAME, 'TemplateLayer.prototype._onDragLeftMove', onDragLeftMove, 'OVERRIDE');
});
