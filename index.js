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
            const tpl_path = this.templatePath('webpack.config.js');
            const dst_path = this.destinationPath('webpack.config.js');
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            try {
                const config = require(dst_path) || {};
                const module = config.module || {};
                const rules = module.rules || [];
                if (!rules.find((r) =>
                    typeof r.loader === 'object' &&
                    r.loader.indexOf('ts-loader') >= 0 ||
                    typeof r.loader === 'string' &&
                    r.loader.match(/ts-loader/)
                )) {
                    this.fs.copyTpl(tpl_path, dst_path, {
                        dizmoName: pkg.name
                    });
                }
            } catch (ex) {
                this.fs.copyTpl(tpl_path, dst_path, {
                    dizmoName: pkg.name
                });
            }
        }
        if (!upgrade || upgrade) {
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    '@dizmo/types': '^1.0.4'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'gulp-tslint': '^8.1.4',
                    'ts-loader': '^6.2.1',
                    'tslint': '^6.0.0',
                    'typescript': '^3.7.5'
                })
            );
            delete pkg.devDependencies['gulp-eslint'];
            this.fs.writeJSON(pkg_path, pkg, null, 2);
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
