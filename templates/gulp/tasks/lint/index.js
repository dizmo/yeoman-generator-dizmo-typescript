let pkg = require('../../package.js'),
    extend = require('xtend');
let gulp = require('gulp'),
    gulp_tslint = require('gulp-tslint');

gulp.task('lint', function (done) {
    let lint = true;
    if (pkg.dizmo && pkg.dizmo.build) {
        let cfg_lint = pkg.dizmo.build.lint;
        if (cfg_lint || cfg_lint === undefined) {
            lint = extend({}, cfg_lint);
        } else {
            lint = false;
        }
    }

    let argv = require('yargs')
        .default('lint', lint).argv;
    if (typeof argv.lint === 'string') {
        argv.lint = JSON.parse(argv.lint);
    }

    if (argv.lint || argv.lint === undefined) {
        let stream = gulp.src([
            './src/**/*.ts', '!src/lib/**', '!build/**', '!node_modules/**'
        ]);
        stream = stream.pipe(gulp_tslint.apply(this, [extend({
            formatter: 'stylish'
        }, argv.lint)]));
        stream = stream.pipe(gulp_tslint.report({
            emitError: false
        }));
        return stream;
    } else {
        done();
    }
});
