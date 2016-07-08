var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

gulp.task('js', function() {
    gulp.src('src/jquery-clockpicker.js')
        .pipe(gulp.dest('dist'))
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    gulp.src('src/jquery-clockpicker.css')
        .pipe(gulp.dest('dist'))
        .pipe(minifyCSS({
            keepSpecialComments: 1
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['js']);
    gulp.watch('src/*.css', ['css']);
});

gulp.task('default', ['js', 'css']);
