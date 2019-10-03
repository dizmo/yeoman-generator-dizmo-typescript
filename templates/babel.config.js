const ignore = [
    '*.min.js', '*.umd.js'
];
const plugins = [
];
const presets = [
    '@babel/env'
];
module.exports = function (api) {
    api.cache(true);
    return {
        ignore, plugins, presets
    };
};
