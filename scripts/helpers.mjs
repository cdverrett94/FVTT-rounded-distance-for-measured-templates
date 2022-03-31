import { Settings } from './settings.mjs';

export const MODULE_NAME = 'rounded-distance-for-measured-templates';

/**
 *
 * @param {boolean} use_steps should the rounding be based on steps - set in the module settings
 * @param {number} number
 * @returns {number} rounded number based on steps or multiple
 */
export const roundDistance = (use_steps, number) => {
  if (use_steps) {
    return roundToStep(number);
  } else {
    return roundToMultiple(number, Settings.moduleSettings['distance-multiple'], Settings.moduleSettings['distance-multiple']);
  }
};

/**
 *
 * @param {number} number starting number before rounding to a step
 * @returns {number} number rounded to the steps in the Settings
 */
export const roundToStep = (number) => {
  let array = number < 0 ? Settings.moduleSettings['negative-steps-array'] : Settings.moduleSettings['positive-steps-array'];
  if (((number >= array[array.length - 1] && number >= 0) || (number <= array[array.length - 1] && number < 0)) && Settings.moduleSettings['use-multiple-after-steps']) {
    // check if number is >= (<=) last index if number is postive (negative) and if increase_after_step is true
    return roundToMultiple(number, Settings.moduleSettings['distance-multiple'], array[array.length - 1]);
  } else {
    let closest = 0;
    closest = array.reduce(function (prev, curr) {
      return Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev;
    });
    return closest;
  }
};

/**
 *
 * @param {number} number starting number for rounding
 * @param {number} multiple what multiple are we rounding to
 * @param {number} minimum what is the minimum value that can be rounded to
 * @returns {number} NUmber that has been rounded to the provided multiple limited to the minimum value
 */
export const roundToMultiple = (number, multiple, minimum) => {
  return number < 0 ? Math.min(Math.round(number / multiple) * multiple, -minimum) : Math.max(Math.round(number / multiple) * multiple, minimum);
};
