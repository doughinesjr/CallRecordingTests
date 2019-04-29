// var gulp = require('gulp')
// var ts = require('gulp-typescript');
// var sourcemaps = require('gulp-sourcemaps');

// gulp.task('build', function() {
//     var tsResult = gulp.src('./test/**/**/*.ts')
//         .pipe(sourcemaps.init()) // This means sourcemaps will be generated
//         .pipe(ts({
//             // ...
//         }));

//     return tsResult.js
//         .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
//         .pipe(gulp.dest('build'));
// });

var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var nodemon = require('gulp-nodemon');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');

var tsProject = ts.createProject('tsconfig.json', {
    declaration: false
});

gulp.task('default', ['build']);

gulp.task('build', ['build-js']);

var buildFolder = 'build';


gulp.task('build-js', function() {
    var tsResult = gulp.src(['./test/**/**/*.ts', './config.ts', '!./node_modules/**/*.ts'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(tsProject());
 
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts.pipe(gulp.dest('typedefs')),
        tsResult.js
            .pipe(sourcemaps.write({
                mapSources: (path) => path, // This affects the "sources" attribute even if it is a no-op. I don't know why.
                sourceRoot: (file) => {
                    return path.relative(file.relative, file.cwd);
                }
            }))
            .pipe(gulp.dest(buildFolder)),
    ]);
});

var buildTasks = ['build'];

gulp.task('watch', buildTasks, function () {
    var stream = nodemon({
        script: './' + buildFolder + '/',
        watch: ['./test'],
        ext: 'ts html css',
        tasks: buildTasks
    });

    return stream;
});
