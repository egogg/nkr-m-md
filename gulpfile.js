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
var merge = require('merge-stream');
var htmlmin = require('gulp-htmlmin');
var order = require('gulp-order');

var diststatic = '/Users/dengxiaodi/Sites/m.wecenter/static/m';
var disthtml = '/Users/dengxiaodi/Sites/m.wecenter/views/default';

gulp.task('html', function() {
	return gulp.src(['./src/html/**/*.htm', './src/html/**/*.php'])
    	.pipe(htmlmin({collapseWhitespace: true}))
    	.pipe(gulp.dest(disthtml));
});

gulp.task('css', function() {
	var lessStream = gulp.src('./src/less/app.less')
		.pipe(less({ 
			paths: ['./src/less/inc']
		}));

	var cssLibStream =  gulp.src(mainBowerFiles())
		.pipe(filter('src/js/libs/**/*.css'))
		.pipe(concat('app.lib.css'));

	var cssFilter = filter('**/style.css', {restore: true});
	var iconStream = gulp.src('./src/fonts/naokr-webfont.zip')
		.pipe(unzip())
		.pipe(cssFilter)
		.pipe(replace(/(url\(\'fonts)/g, 'url(\'../fonts/naokr'));

	return merge(lessStream, cssLibStream, iconStream)
		.pipe(concat('app.css'))
		.pipe(rename('app.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest(diststatic + '/css/'));
});

gulp.task('js', function() {
	var jsLibStream = gulp.src(mainBowerFiles())
		.pipe(filter('src/js/libs/**/*.js'));

	var jsStream = gulp.src('./src/js/*.js');

	return merge(jsLibStream, jsStream)
		.pipe(order([
            'src/js/libs/jquery/**/*.js',
            'src/js/libs/bootstrap/**/*.js'
	        ], { base: './' }))
		.pipe(concat('app.js'))
		.pipe(rename('app.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest(diststatic + '/js/'));
});

gulp.task('img', function() {
	return gulp.src('./src/img/*')
		.pipe(filter('src/img/*.png'))
		.pipe(gulp.dest(diststatic + '/img/'));
});

gulp.task('fonts', function() {
	var fontFilter = filter(['**/fonts/*', '!fonts'], {restore: true});

	// icon style file

	gulp.src('./src/fonts/naokr-webfont.zip')
		.pipe(unzip())
		.pipe(fontFilter)
		.pipe(flatten())
		.pipe(gulp.dest(diststatic + '/fonts/naokr/'));

	return gulp.src('./src/fonts/**/*')
		.pipe(filter(['**', '!**/fonts/*.zip']))
		.pipe(gulp.dest(diststatic + '/fonts/'));
});

gulp.task('clean', function(){
	return del.sync([diststatic + '/js/*', diststatic + '/css/*', diststatic + '/fonts/*', diststatic + '/img/*', disthtml + '/*'], {force : true});
});

gulp.task('default', ['clean', 'html', 'css', 'js', 'fonts'],function() {
	console.log(mainBowerFiles());
});
