var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    nodemon = require('gulp-nodemon'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    preprocess = require('gulp-preprocess'),
    minifyCss = require('gulp-minify-css');

var exec = require('child_process').exec;

gulp.task('scripts', function () {
    gulp.src(['app/main.js'])
        .pipe(browserify({
            debug: false,
            transform: [ 'reactify' ]
        }))
        .pipe(preprocess({context: { NODE_ENV: 'dev', ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL, SEARCHBOX_SSL_URL: process.env.SEARCHBOX_SSL_URL}})) //To set environment variables in-line
        .pipe(gulp.dest('./public/'));
});

gulp.task('scripts_prod', function () {
    gulp.src(['app/main.js'])
        .pipe(browserify({
            debug: false,
            transform: [ 'reactify' ]
        }))
        .pipe(preprocess({context: { NODE_ENV: 'prod', ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL, SEARCHBOX_SSL_URL: process.env.SEARCHBOX_SSL_URL}})) //To set environment variables in-line
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

gulp.task('images', function () {
    return gulp.src([
        'images/logo.*'
    ]).pipe(gulp.dest('public/images'));
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

gulp.task('dev', ['scripts','css', 'fonts', 'images', 'start']);

gulp.task('default', ['scripts','css', 'fonts', 'images'], function() {});

gulp.task('prod', ['scripts_prod','css', 'fonts', 'images'], function() {});