import { Settings } from './settings.mjs'

export const MODULE_NAME = 'rounded-distance-for-measured-templates';

/*
  Rounds a number to the nearest step in the array

  array - array of steps
  number - current distance number before rounding
  multiple - what multiple to round to
  increase_after_step - if using stepped rounding, should the rounding stop (false) or go to default rounding (true)

*/
export const roundToStep = (number) => {
  let array = (number < 0) ? Settings.moduleSettings["negative-steps-array"] : Settings.moduleSettings["positive-steps-array"];
  if (((number >= array[array.length - 1] && number >= 0) || (number <= array[array.length - 1] && number < 0)) && Settings.moduleSettings["use-multiple-after-steps"]) { // check if number is >= (<=) last index if number is postive (negative) and if increase_after_step is true
    return roundToMultiple(number, Settings.moduleSettings["distance-multiple"], array[array.length - 1]);
  } else {
    let closest = 0;
    closest = array.reduce(function(prev, curr) {
      return (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev);
    });
    return closest;
  }
}

/**
  Choose which rounding method to use based on setting

  use_steps - should the rounding be based on steps - set in the module settings
  number - current distance number before rounding
*/
export const roundDistance = (use_steps, number) => {
  if (use_steps) {
    return roundToStep(number);
  } else {
    return roundToMultiple(number, Settings.moduleSettings["distance-multiple"], Settings.moduleSettings["distance-multiple"]);
  }
};

/*
  Round a number to the nearest multiple

  number - current distance number before rounding
  multiple - what multiple to round to
  minimum - minimum number to round to - prevents distance from being 0
*/
export const roundToMultiple = (number, multiple, minimum) => {
  return (number < 0) ? Math.min(Math.round(number / multiple) * multiple, -minimum) : Math.max(Math.round(number / multiple) * multiple, minimum);
}
