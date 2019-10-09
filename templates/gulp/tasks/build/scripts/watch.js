const gulp = require('gulp');

gulp.task('scripts:watch', () =>
    gulp.watch('src/**/*.(js|ts|tsx)', gulp.series('scripts'))
);
