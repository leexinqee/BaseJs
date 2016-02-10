// 引入模块
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');
 
//定义一个concat任务
gulp.task('concat', function(){
    gulp.src(['src/js/tool.js', 'src/js/base.js'])
    	.pipe(concat("Base.js"))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//定义一个plugin任务
gulp.task('plugin', function(){
    gulp.src(['src/js/base_drag.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//定义一个默认任务
gulp.task('default', ['concat', 'plugin']);

