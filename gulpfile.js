var gulp = require('gulp');
var jade = require('gulp-pug');
var prettify = require('gulp-prettify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var sass = require('gulp-sass');
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var fsCache = require('gulp-fs-cache');

var config = {
    paths: {
        images: [
            // images
            'src/i/**/*',
            '!src/i/sprite/**/*'
        ],
        scripts: [
            // js
            'src/js/**/*'
        ],
        others: [
            // fonts
            'src/fonts/**/*',
            // other
            'src/robots.txt'
        ]
    }
};


gulp.task('build:copy:images', function (callback) {
    gulp.src(config.paths.images, {base: 'src'})
        .pipe(gulp.dest('build'))
        .on('finish', callback);
});

gulp.task('build:copy:scripts', function (callback) {
    gulp.src(config.paths.scripts, {base: 'src'})
        .pipe(gulp.dest('build'))
        .on('finish', callback);
});

gulp.task('build:copy:others', function (callback) {
    gulp.src(config.paths.others, {base: 'src'})
        .pipe(gulp.dest('build'))
        .on('finish', callback);
});

gulp.task('build:jade', function () {
    var jadeCache = fsCache('.gulp-cache/jade');

    return gulp.src([
        'src/jade/*.pug',
        '!src/jade/include',
        '!src/jade/include/**/*'
    ])
        .pipe(jadeCache)
        .pipe(jade())
        .pipe(prettify({
            unformatted: ['pre', 'code', 'br', 'strong', 'i', 'b', 'span', 'mark']
        }))
        .on('error', function (error) {
            console.log(error);
            this.emit('end');
        })
        .pipe(gulp.dest('./build'));
});


gulp.task('build:css', function () {
    var processors = [
        autoprefixer({browsers: ['last 5 versions', '> 0.5%']}),
        require('precss')({ /* options */})
    ];

    return gulp.src('./src/styles/*.scss')
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('build:iconfont', function (cb) {

    var fontName = 'book';

    gulp.src('src/i/icons/*.svg')
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'src/libs/font-template.scss',
            targetPath: '../styles/icons.scss',
            fontPath: '../fonts/',
            cssClass: 'ic'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            autohint: false,
            prependUnicode: true,
            fontHeight: 692
        }))
        .pipe(gulp.dest('./src/fonts/'))
        .on("finish", cb);
});

var filterByExtension = function (extension) {
    return filter(function (file) {
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

gulp.task('main-bower-files', function () {
    var mainFiles = mainBowerFiles();
    var jsCache = fsCache('.gulp-cache/js/main');

    if (!mainFiles.length) {
        // No main files found. Skipping....
        return;
    }

    var jsFilter = filterByExtension('js');

    return gulp.src(mainFiles)
        .pipe(jsFilter)
        .pipe(concat('vendor.min.js'))
        .pipe(jsCache)
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('plugins', function () {
    var jsCache = fsCache('.gulp-cache/js');
    var jsFilter = filterByExtension('js');

    return gulp.src('src/plugins/**/*.js')
        .pipe(jsFilter)
        .pipe(concat('vendor2.min.js'))
        .pipe(jsCache)
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('clean', function (callback) {
    del(['build/**/*']).then(function () {
        callback();
    });
});


gulp.task('build', ['clean', 'build:iconfont'], function () {
    gulp.run('build:css');
    gulp.run('build:jade');
    gulp.run('build:copy:images');
    gulp.run('build:copy:scripts');
    gulp.run('build:copy:others');
    gulp.run('main-bower-files');
    gulp.run('plugins');
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['src/styles/**/*.scss'], ['build:css']);
    gulp.watch(['src/jade/**/*.pug'], ['build:jade']);
    gulp.watch(config.paths.images, ['build:copy:images']);
    gulp.watch(config.paths.scripts, ['build:copy:scripts']);
    gulp.watch(config.paths.others, ['build:copy:others']);
});

gulp.task('default', [
    'build'
]);


