var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://127.0.0.1:8080/"
    });
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: "http://127.0.0.1:8080/"
    });

    gulp.watch("sass/**/*.scss", ['sass']);
    gulp.watch("views/**/*.pug").on('change', browserSync.reload);
});


gulp.task('default', ['serve'])