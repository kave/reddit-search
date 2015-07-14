var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    nodemon = require('gulp-nodemon');

gulp.task('scripts', function () {

    gulp.src(['app/main.js'])
        .pipe(browserify({
            debug: true,
            transform: [ 'reactify' ]
        }))
        .pipe(gulp.dest('./public/'));

});

gulp.task('watch', function () {
    gulp.watch(['app/**/*.*'], ['scripts']);
});

gulp.task('start', function () {
    nodemon({
        script: 'server.js'
        , ext: 'js html'
        , env: { 'NODE_ENV': 'development' }
        , tasks: ['scripts']
    }).on('restart', function () {
        console.log('restarted!')
    })
});

gulp.task('default', ['scripts', 'start']);

