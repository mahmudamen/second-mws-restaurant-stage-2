var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var image = require('gulp-image');
const imagemin = require('gulp-imagemin');


gulp.task('styles', function() {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts:main', function() {
  browserify(['js/main.js', 'js/dbhelper.js', 'js/app.js', './sw.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('main_bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('./bundle_js'));
});

gulp.task('scripts:restaurant', function() {
  browserify(['js/restaurant_info.js', 'js/dbhelper.js', 'js/app.js', './sw.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('restaurant_bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest('./bundle_js'));
});

gulp.task('watch', function() {
  gulp.watch(['./sw.js', './js/**/*.js'], ['scripts:main', 'scripts:restaurant']);
});

gulp.task('serve', ['styles'], function() {
  browserSync.init({
    server: './',
	port:8000 ,
    browser: 'google chrome'
  });

  gulp.watch('./sass/**/*.scss', ['styles']);
  gulp.watch('./**/**.html').on('change', browserSync.reload);
  gulp.watch('./bundle_js/**/*.js').on('change', browserSync.reload);

});

gulp.task('copy-files', function() {
  gulp.src(['./index.html', './restaurant.html', 'manifest.json'])
    .pipe(gulp.dest('./dist'));
});



gulp.task('dist', ['copy-files','styles', 'scripts:main', 'scripts:restaurant']);
gulp.task('default', ['scripts:main', 'scripts:restaurant', 'watch', 'serve']);