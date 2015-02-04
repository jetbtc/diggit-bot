var fs = require('fs'),
    pkg = require('./package.json'),
    gulp = require('gulp'),
    del = require('del'),
    through2 = require('through2'),
    replace = require('gulp-replace'),
    stylus = require('gulp-stylus'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    streamqueue = require('streamqueue'),
    react = require('gulp-react');

var paths = {
    script: 'src/bot.js',
    ui: 'src/ui.jsx',
    react: 'bower_components/react/react.min.js',
    style: 'src/bot.styl',
    userscript: 'diggit-bot.user.js'
}

var jshintConfig = {
    sub: true,
    shadow: true,
    laxbreak: true,
    lookup: false
};

var styles = "";

gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del([paths.userscript], cb);
});

gulp.task('compile-stylus', function() {
    return gulp.src(paths.style)
        .pipe(stylus({
            compress: true
        }))
        .pipe(through2.obj(function(file, enc, done) {
            styles = String(file.contents);
            done();
        }));
});

gulp.task('build', ['compile-stylus'], function() {
    var ui = gulp.src(paths.ui)
            .pipe(react())
            .pipe( jshint(jshintConfig) )
            .pipe( jshint.reporter('jshint-stylish') )
            .pipe( jshint.reporter('fail') );

    var reactlib = gulp.src(paths.react);

    var bot = gulp.src(paths.script)
            .pipe(replace('{{styles}}', styles))
            .pipe(replace('{{version}}', pkg.version))
            .pipe( jshint(jshintConfig) )
            .pipe( jshint.reporter('jshint-stylish') )
            .pipe( jshint.reporter('fail') );

    return streamqueue({objectMode: true}, reactlib, bot, ui)
        .pipe( concat(paths.userscript) )
        .pipe( header(fs.readFileSync('src/header.js'), {pkg: pkg}) )
        .pipe( gulp.dest('./')) ;
});
