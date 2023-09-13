import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgo';
import { deleteAsync } from 'del';


// Styles

export const styles = (done) => {
  gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
  done()
}

//HTML
export const html = (done) => {
  gulp.src('source/*html')
  .pipe(htmlmin({collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
  done()
}

// JavaScript

export const scripts = (done) => {
  gulp.src('source/js/*js')
    .pipe(gulp.dest('build/js'))
  done()
}

// Images
export const opimizeImages = (done) => {
  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
  done()
}

export const copyImages = (done) => {
  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
  done()
}

// WebP
export const createWebp = (done) => {
  gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
  done()
}

// svg

export const svgTask = (done) => {
  gulp.src(['source/img/**/*.svg', '!source/img/sprites/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
  done()
}

// Sprites

export const sprite = (done) => {
  gulp.src(['source/img/sprites/*.svg'])
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img/sprites'));
  done()
}

// Copy

export const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*ico',
    'source/manifest.webmanifest'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
}

// Clean

export const clean = async(done) => {
  await deleteAsync('build')
  done()
}

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

export const reload =(done) => {
  browser.reload();
  done();
}
// Watcher

export const watcher = (done) => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/main.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
  done()
}

// Build
export const build = gulp.series(
  clean,
  copy,
  opimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svgTask,
    sprite,
    createWebp
  ),
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    svgTask,
    sprite,
    createWebp
),
gulp.series(
  server,
  watcher
));
