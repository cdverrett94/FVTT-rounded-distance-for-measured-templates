Hooks.once("init", function() {
    game.settings.register('rounded-distance-for-measured-templates', 'distance-multiple', {
        name: "What multiple should template distances be rounded to?",
        hint: "The multiple you want the measured templates distance to round to. If left blank, the measured templates will be rounded based on the scenes grid distance.",
        scope: 'world',
        config: true,
        restricted: true,
        default: "",
        type: String
    });

    game.settings.register('rounded-distance-for-measured-templates', 'cone-angle-multiple', {
        name: "What multiple should cone angles be rounded to when rotating?",
        hint: "The multiple you want the angle for cones to snap when rotating. If left blank, there won't be any angle snapping.",
        scope: 'world',
        config: true,
        restricted: true,
        default: "",
        type: String
    });

    game.settings.register('rounded-distance-for-measured-templates', 'ray-angle-multiple', {
        name: "What multiple should rays angles be rounded to when rotating?",
        hint: "The multiple you want the angle for rays to snap when rotating. If left blank, there won't be any angle snapping.",
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