 var gulp = require('gulp'),
 	  concat = require('gulp-concat'),
  	  rename = require('gulp-rename'),
 	  uglify = require('gulp-uglify'),
 	  cleanCSS = require('gulp-clean-css'),
 	  sass = require('gulp-sass'),
 	  maps = require('gulp-sourcemaps'),
 	  imagemin = require('gulp-imagemin'),
 	  clean = require('gulp-clean');
 	  //extra credits

 	  //for livereload you must install a chrome extension : 
 	 // https://chrome.google.com/webstore/search/livereload?hl=es-419
 	  livereload = require('gulp-livereload')

// Scripts Task

//concat scripts, do it on dev server
gulp.task("concatScripts", function() {
	return gulp.src('js/**/*.js')
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

// should be minify scripts
gulp.task('scripts',['concatScripts'], function(){
	gulp.src('js/**/*.js')
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest('dist/js'));
});



// Styles Task
gulp.task('compileSass', function(){
	return gulp.src('sass/**/*.scss')
	// .pipe(plumber())
	 .pipe(maps.init())
	.pipe(sass({
		outputStyle: 'expanded'
	}))

	.pipe(maps.write('./'))
	.pipe(gulp.dest('css'));

});
gulp.task('styles',['compileSass'], function(){
	return gulp.src('css/**/*.css')
	 .pipe(concat('all.min.css'))//concatenate
	 .pipe(cleanCSS())	 //minify
	 .pipe(gulp.dest('dist/css'))//send it to dist
	 .pipe(livereload());//reload the browser page

});

//Images Task
//Min
gulp.task('images', function(){
    return gulp.src('images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'));

});

//clean Task

gulp.task('clean',function(){

	return gulp.src('dist/*')
	.pipe(clean());
});
//Watch Task
//Watch JS

// use 'http-server -p [PORT]' command to get your server running, then activate the livereload icon on your chrome browser to make the magic happen.

gulp.task('watch', function() {


	livereload.listen();	
	gulp.watch('sass/**/*.scss', ['styles'])
});


//build Task

gulp.task('build',['clean','scripts','styles','images'],function(){
	return 1;
});

//default
 gulp.task('default', ['build','watch']);