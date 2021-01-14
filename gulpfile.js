// npm i gulp gulp-autoprefixer gulp-sourcemaps gulp-sass browser-sync --save-dev
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();

var sassOptions = {
  errLogToConsole: true,
  // outputStyle: 'compressed'
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  overrideBrowserslist: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var srcRoot = './src/';
var appRoot = './public/';

var SOURCE = {
  path: {
    scss: srcRoot + 'scss/**/*.scss',
    //js: srcRoot + 'assets/js/**/*.js',
    //svg: srcRoot + 'assets/svg/*.svg'
  }
  // entry: {
  //   js: srcRoot + 'assets/js/main.js'
  // }
};

var APP = {
  path: {
    root: appRoot,
    css: appRoot + 'css',
    html: appRoot + '*.html'
    // js: appRoot + 'js',
    // svg: appRoot + 'images'
  }
  // output: {
  //   js: 'bundle.js'
  // }
};

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(SOURCE.path.scss)
        .pipe(sourcemaps.init())
        // Run Sass on those files
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(APP.path.css))
        .pipe(browserSync.stream({stream: true}));
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        server: "./public",
        // proxy: 'https://sprucetest.com', // makes a proxy for localhost:8080
        // host: 'sprucetest.com',
        // port: 443,
        // open: 'external'
    });

    gulp.watch(SOURCE.path.scss, gulp.series('sass'));
    gulp.watch(APP.path.html).on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));
