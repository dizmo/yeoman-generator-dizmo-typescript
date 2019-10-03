const gulp = require('gulp');
const gulp_tslint = require('gulp-tslint');

gulp.task('lint', (done) => {
    const argv = require('yargs')
        .default('lint', true).argv;
    if (typeof argv.lint === 'string') {
        argv.lint = JSON.parse(argv.lint);
    }
    if (argv.lint || argv.lint === undefined) {
        let stream = gulp.src([
            './src/**/*.ts', '!src/lib/**', '!build/**', '!node_modules/**'
        ]);
        stream = stream.pipe(gulp_tslint({
            formatter: 'stylish', ...argv.lint
        }));
        stream = stream.pipe(gulp_tslint.report({
            emitError: false
        }));
        return stream;
    } else {
        done();
    }
});
