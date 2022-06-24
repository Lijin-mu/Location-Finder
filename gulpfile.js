const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const htmlPartial = require('gulp-html-partial');
const clean = require('gulp-clean');
const webp = require('gulp-webp');
const include = require('gulp-include');
const formatHtml = require('gulp-format-html');
const isProd = process.env.NODE_ENV === 'prod'; 

const htmlFile = [
    'src/*.html'
]

function html() {
    return gulp.src(htmlFile)
        .pipe(htmlPartial({
            basePath: 'src/includes/'
        }))
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(formatHtml())
        .pipe(gulp.dest('dist'));
}

function ie_css() {
  return gulp.src('src/assets/sass/ie.scss')
      .pipe(gulpIf(!isProd, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulpIf(!isProd, sourcemaps.write()))
      .pipe(gulpIf(isProd, cssmin()))
      .pipe(concat('ie.min.css'))
      .pipe(gulp.dest('dist/assets/css/'));
}

function app_css() {
    return gulp.src('src/assets/sass/app.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('dist/assets/css/'));
}

function plugins_css() {
  return gulp.src('src/assets/sass/plugins.scss')
      .pipe(gulpIf(!isProd, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulpIf(!isProd, sourcemaps.write()))
      .pipe(gulpIf(isProd, cssmin()))
      .pipe(concat('plugins.min.css'))
      .pipe(gulp.dest('dist/assets/css/'));
}

function app_js() {
    return gulp.src('src/assets/js/app.js')
        .pipe(include()).on('error', console.log)
        .pipe(concat('app.min.js'))
        .pipe(gulpIf(isProd, uglify({
          keep_fnames: true,
          mangle: false,
          ie8: true,
          warnings: true,
          compress: true
        })))
        .pipe(gulp.dest('dist/assets/js'));
}

function swiper_js() {
  return gulp.src('src/assets/js/swiper.js')
      .pipe(include()).on('error', console.log)
      .pipe(concat('swiper.min.js'))
      .pipe(gulp.dest('dist/assets/js'));
}

function plugins_js() {
  return gulp.src('src/assets/js/plugins.js')
      .pipe(include()).on('error', console.log)
      .pipe(concat('plugins.min.js'))
      .pipe(gulpIf(isProd, uglify({
        keep_fnames: true,
        mangle: false,
        ie8: true,
        warnings: true,
        compress: true
      })))
      .pipe(gulp.dest('dist/assets/js'));
}

function jquery_js() {
  return gulp.src('src/assets/js/jquery.js')
      .pipe(include()).on('error', console.log)
      .pipe(concat('jquery.min.js'))
      .pipe(gulpIf(isProd, uglify()))
      .pipe(gulp.dest('dist/assets/js'));
}

function modernizr_js() {
  return gulp.src('src/assets/js/modernizr.js')
      .pipe(include()).on('error', console.log)
      .pipe(concat('modernizr.min.js'))
      .pipe(gulpIf(isProd, uglify()))
      .pipe(gulp.dest('dist/assets/js'));
}

function fonts() {
    return gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts/'));
}

function database() {
    return gulp.src('src/database/*')
        .pipe(gulp.dest('dist/database/'));
}

function webfonts() {
    return gulp.src('src/assets/webfonts/*')
        .pipe(gulp.dest('dist/assets/webfonts/'));
}

function img() {
    return gulp.src('src/assets/img/**/*')
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('dist/assets/img/'));
}


function img_webp() {
  return gulp.src('src/assets/img/**/*')
      .pipe(webp({quality: 100}))
      .pipe(gulpIf(isProd, imagemin()))
      .pipe(gulp.dest('dist/assets/img/'));
}

function serve() {
    browserSync.init({
        open: true,
        server: './dist'
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


function watchFiles() {
    gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
    gulp.watch('src/assets/sass/**/*.scss', gulp.series(plugins_css, browserSyncReload));
    gulp.watch('src/assets/sass/**/*.scss', gulp.series(app_css, browserSyncReload)); 
    gulp.watch('src/assets/sass/**/*.scss', gulp.series(ie_css, browserSyncReload));
    gulp.watch('src/assets/js/**/*.js', gulp.series(app_js, browserSyncReload));
    gulp.watch('src/assets/js/**/*.js', gulp.series(plugins_js, browserSyncReload));
    gulp.watch('src/assets/js/**/*.js', gulp.series(modernizr_js, browserSyncReload));
    gulp.watch('src/assets/img/**/*.*', gulp.series(img));
    gulp.watch('src/database/*', gulp.series(database, browserSyncReload));
    gulp.watch('src/assets/img/**/*.*', gulp.series(img_webp));

    return;
}

function del() {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
}

exports.html = html;
exports.ie_css = ie_css;
exports.app_css = app_css;
exports.plugins_css = plugins_css;
exports.app_js = app_js;
exports.jquery_js = jquery_js;
exports.swiper_js = swiper_js;
exports.plugins_js = plugins_js;
exports.modernizr_js = modernizr_js;
exports.fonts = fonts;
exports.database = database;

exports.del = del;
exports.serve = gulp.parallel(html, ie_css, app_css, plugins_css, jquery_js, app_js, swiper_js, plugins_js, modernizr_js, fonts, webfonts, database, img, img_webp, watchFiles, serve);
exports.default = gulp.series(del, html, ie_css, app_css, plugins_css, jquery_js, app_js, swiper_js, plugins_js, modernizr_js, fonts,database, webfonts, img, img_webp);