// 引入模块
var gulp = require('gulp'),
    uglify = require('gulp-uglify');
 
//定义一个默认任务
gulp.task('default', function(){
    gulp.src(['src/js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});