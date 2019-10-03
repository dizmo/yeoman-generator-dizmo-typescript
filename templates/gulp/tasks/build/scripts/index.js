const pkg = require('../../../package.js');
const path = require('path');

const gulp = require('gulp');
const gulp_uglify = require('gulp-uglify');
const gulp_sourcemaps = require('gulp-sourcemaps');

const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const through = require('through2');

function ensure(package, callback) {
    require('fs').access(
        './node_modules/' + package, (error) =>
    {
        if (error) {
            let npm_install = require('child_process').spawn('npm', [
                'install', package
            ], {
                shell: true, stdio: 'ignore'
            });
            npm_install.on('exit', () => {
                callback(require(package));
            });
        } else {
            callback(require(package));
        }
    });
}

function gulp_obfuscator(opts) {
    return through.obj((file, encoding, callback) => {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            return callback(new Error('streaming not supported', null));
        }
        ensure('javascript-obfuscator', (obfuscator) => {
            const result = obfuscator.obfuscate(
                file.contents.toString(encoding), opts);
            file.contents = Buffer.from(
                result.getObfuscatedCode(), encoding);
            callback(null, file);
        });
    });
}

gulp.task('scripts', () => {
    const cli_min = require('yargs')
        .default('minify').argv.minify;
    const argv = require('yargs')
        .default('sourcemaps', false)
        .default('obfuscate', false)
        .default('uglify', cli_min === true
            ? { keep_fnames: true } : false).argv;

    if (typeof argv.sourcemaps === 'string') {
        argv.sourcemaps = JSON.parse(argv.sourcemaps);
    }
    if (typeof argv.obfuscate === 'string') {
        argv.obfuscate = JSON.parse(argv.obfuscate);
    }
    if (typeof argv.uglify === 'string') {
        argv.uglify = JSON.parse(argv.uglify);
    }

    const browserified = browserify({
        basedir: '.', debug: !!argv.sourcemaps, entries: [
            'node_modules/@babel/polyfill/dist/polyfill.js',
            'src/app/app.ts'
        ]
    })
    .plugin('tsify')
    .transform('babelify', {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    });

    let stream = browserified.bundle()
        .pipe(source('index.js')).pipe(buffer());
    if (argv.sourcemaps) {
        stream = stream.pipe(gulp_sourcemaps.init(
            { loadMaps: true, ...argv.sourcemaps }
        ));
    }
    if (argv.obfuscate || argv.obfuscate === undefined) {
        stream = stream.pipe(gulp_obfuscator({ ...argv.obfuscate }));
    }
    if (argv.uglify || argv.uglify === undefined) {
        stream = stream.pipe(gulp_uglify({ ...argv.uglify }));
    }
    if (argv.sourcemaps) {
        stream = stream.pipe(gulp_sourcemaps.write(
            './'
        ));
    }
    stream = stream.pipe(gulp.dest(
        path.join('build', pkg.name)
    ));
    return stream;
});
