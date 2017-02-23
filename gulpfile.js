/**
 * Created by mumu on 2017/2/23.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
gulp.task('default', function(){
    //gulp.src(['**/*.js','!node_modules/**','!dist/**', '!gulpfile.js']).
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/'));
});
