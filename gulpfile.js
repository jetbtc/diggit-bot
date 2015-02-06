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
    riot = require('gulp-riot');

var paths = {
    script: 'src/bot.js',
    ui: 'src/ui.tag',
    riot: 'bower_components/riot/riot.min.js',
    style: 'src/bot.styl',
    userscript: 'diggit-bot.user.js'
}

var jshintConfig = {
    asi: true,
    sub: true,
    shadow: true,
    laxbreak: true,
    lookup: false
};

var styles = "";

gulp.task('clean', function(cb) {
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
            .pipe( riot() )
            .pipe(replace('{{styles}}', styles))
            .pipe( gulp.dest('build/') )
            .pipe( jshint(jshintConfig) )
            .pipe( jshint.reporter('jshint-stylish') )
            .pipe( jshint.reporter('fail') );

    var riotlib = gulp.src(paths.riot);

    var bot = gulp.src(paths.script)
            .pipe(replace('{{version}}', pkg.version))
            .pipe( jshint(jshintConfig) )
            .pipe( jshint.reporter('jshint-stylish') )
            .pipe( jshint.reporter('fail') );

    return streamqueue({objectMode: true}, riotlib, bot, ui)
        .pipe( concat(paths.userscript) )
        .pipe( header(fs.readFileSync('src/header.js'), {pkg: pkg}) )
        .pipe( gulp.dest('./')) ;
});

gulp.task('watch', function() {
    gulp.watch('src/*', ['build']);
});
