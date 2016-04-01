var gulp = require('gulp');
var ts = require('gulp-typescript');
var log = require('gulp-util').log;
var typescript = require('typescript');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var buildSources = './js/_all.ts';
var watchSources = './js/**/*.ts';

var projectConfig = {
    target: 'ES6',
    typescript: typescript,
    outFile: 'js/Application.js'
};

gulp.task('build', function () {
    return gulp.src(buildSources)
        .pipe(sourcemaps.init())
        .pipe(ts(projectConfig))
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '/js/' }))
        .pipe(gulp.dest('.'));
});

function serve(done) {
    browserSync({
        online: false,
        open: false,
        port: 8080,
        server: {
            baseDir: ['.']
        }
    }, done);
}

gulp.task('serve', serve);
gulp.task('buildAndServe', ['build'], serve);

gulp.task('bs-reload', ['build'], function() {
    browserSync.reload();
});

gulp.task('watch', ['buildAndServe'], function (cb) {
    log('Watching build sources...');
    gulp.watch(watchSources, ['build', 'bs-reload']);
});
