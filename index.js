'use strict';

const fs = require('fs');
const Generator = require('yeoman-generator');
const lodash = require('lodash');
const rimraf = require('rimraf');

module.exports = class extends Generator {
    writing() {
        const upgrade = Boolean(
            this.options.upgrade && fs.existsSync('package.json')
        );
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('gulp/'),
                this.destinationPath('gulp/')
            );
        }
        if (!upgrade || upgrade) {
            const pkg = this.fs.readJSON(
                this.destinationPath('package.json')
            );
            pkg.dependencies = sort(
                lodash.assign(pkg.dependencies, {
                    '@dizmo/functions': '^2.7.5',
                    '@dizmo/types': '^1.0.4'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    '@types/i18next': '^12.1.0'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'gulp-tslint': '^8.1.4',
                    'tsify': '^4.0.1',
                    'tslint': '^5.17.0',
                    'typescript': '^3.5.2'
                })
            );
            delete pkg.devDependencies['gulp-eslint'];
            delete pkg.devDependencies['esmify'];
            delete pkg['babel'];
            this.fs.writeJSON(
                this.destinationPath('package.json'), pkg, null, 2
            );
        }
        if (!upgrade) {
            this.fs.copy(
                this.templatePath('src/'),
                this.destinationPath('src/')
            );
            this.fs.copy(
                this.templatePath('tslint.json'),
                this.destinationPath('tslint.json')
            );
            this.fs.copy(
                this.templatePath('tsconfig.json'),
                this.destinationPath('tsconfig.json')
            );
        }
        this.conflicter.force = this.options.force || upgrade;
    }
    end() {
        rimraf.sync(
            this.destinationPath('.eslintrc.json')
        );
        rimraf.sync(
            this.destinationPath('src/index.js')
        );
    }
};
function sort(object) {
    return Object.entries(object).sort().reduce(
        (a, [k, v]) => { a[k] = v; return a; }, {}
    );
}
