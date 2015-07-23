var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    nodemon = require('gulp-nodemon'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css');

var exec = require('child_process').exec;

gulp.task('scripts', function () {
    gulp.src(['app/main.js'])
        .pipe(browserify({
            debug: true,
            transform: [ 'reactify' ]
        }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('css', function () {
    return gulp.src([
        'bower_components/font-awesome/css/font-awesome.css',
        'views/styles/styles.css',
        'views/styles/spaceship-bootstrap.css',
        'node_modules/react-modal-bootstrap/lib/modal.css'
    ])
        .pipe(concat('css.css'))
       // .pipe(minifyCss())
        .pipe(gulp.dest('public/'));
});

gulp.task('fonts', function () {
    return gulp.src([
        'bower_components/font-awesome/fonts/*'
    ]).pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', function () {
    gulp.watch(['app/**/*.*'], ['scripts']);
});

gulp.task('start', function () {
    nodemon({
        script: 'server.js'
        , ext: 'js html css'
        , env: { 'NODE_ENV': 'development' }
        , tasks: ['scripts', 'css']
    }).on('restart', function () {
        console.log('restarted!')
    })
});

gulp.task('nodemon', ['scripts','css', 'fonts', 'start']);

gulp.task('default', ['scripts','css', 'fonts'], function() {});