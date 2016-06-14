var gulp = require('gulp');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var path = require('path');
var rename = require('gulp-rename');
var concat = require('gulp-concat'); 
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var del = require('del');
var unzip = require("gulp-unzip");
var replace = require('gulp-replace');
var flatten = require('gulp-flatten');

var distpath = '/Users/dengxiaodi/Sites/m.wecenter/static/m';

gulp.task('less', function() {
	return gulp.src('./src/less/app.less')
  	.pipe(less({
    	paths: ['./src/less/inc']
    }))
    .pipe(cssmin())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(distpath + '/css/'));
});

gulp.task('js', function() {
	return gulp.src('./src/js/*.js')
	.pipe(concat('app.js'))
	.pipe(rename('app.min.js'))
	.pipe(uglify())
    .pipe(gulp.dest(distpath + '/js/'));
});

gulp.task('js-libs', function() {
	return gulp.src(mainBowerFiles())
	.pipe(filter('src/js/libs/**/*.js'))
	.pipe(concat('app.lib.js'))
	.pipe(rename('app.lib.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(distpath + '/js/'));
});

gulp.task('css-libs', function() {
	return gulp.src(mainBowerFiles())
	.pipe(filter('src/js/libs/**/*.css'))
	.pipe(concat('app.lib.css'))
	.pipe(rename('app.lib.min.css'))
	.pipe(cssmin())
	.pipe(gulp.dest(distpath + '/css/'));
});

gulp.task('img', function() {
	return gulp.src('./src/img/*')
	.pipe(filter('src/img/*.png'))
	.pipe(gulp.dest(distpath + '/img/'));
});

gulp.task('fonts', function() {
	var cssFilter = filter('**/style.css', {restore: true});
	var fontFilter = filter(['**/fonts/*', '!fonts'], {restore: true});

	// icon style file

	gulp.src('./src/fonts/naokr-webfont.zip')
	.pipe(unzip())
	.pipe(cssFilter)
	.pipe(replace(/(url\(\'fonts)/g, 'url(\'../fonts/naokr'))
	.pipe(cssmin())
	.pipe(rename('icon.min.css'))
	.pipe(gulp.dest(distpath + '/css/'));

	// icon font files

	cssFilter.restore
	.pipe(fontFilter)
	.pipe(flatten())
	.pipe(gulp.dest(distpath + '/fonts/naokr/'));

	return gulp.src('./src/fonts/**/*')
	.pipe(filter(['**', '!**/fonts/*.zip']))
	.pipe(gulp.dest(distpath + '/fonts/'));
});

gulp.task('clean', function(){
	return del.sync([distpath + '/js/*', distpath + '/css/*', distpath + '/fonts/*', distpath + '/img/*'], {force : true});
});

gulp.task('default', ['clean', 'less', 'js', 'js-libs', 'css-libs', 'img', 'fonts'],function() {
	console.log(mainBowerFiles());
});
