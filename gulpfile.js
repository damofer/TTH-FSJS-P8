 var gulp = require('gulp'),
 	  concat = require('gulp-concat'),
  	  rename = require('gulp-rename'),
 	  uglify = require('gulp-uglify'),
 	  cleanCSS = require('gulp-clean-css'),
 	  sass = require('gulp-sass'),
 	  maps = require('gulp-sourcemaps'),
 	  imagemin = require('gulp-imagemin'),
 	  clean = require('gulp-clean'),
 	  //extra credits
 	  eslint = require('gulp-eslint'),
 	  //for livereload you must install a chrome extension : 
 	 // https://chrome.google.com/webstore/search/livereload?hl=es-419
 	  livereload = require('gulp-livereload')

// Scripts Task

//it will clear the global.js and global.js.map files every time the script task runs.
gulp.task('clean-scripts', function () {
  return gulp.src(['js/global.js','js/global.js.map'])
    .pipe(clean());
});
//concat scripts on global.js files and write a sourcemap
gulp.task("concatScripts",['clean-scripts'], function() {
	return gulp.src(['js/**/*.js','!global.js'])
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

// Minify the script, rename it and copy it on the dist js folder
gulp.task('scripts',['lint','concatScripts'], function(){
	gulp.src('js/global.js')
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest('dist/js'));
});



// Styles Task

//compile to css
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
	.pipe(gulp.dest('dist/content'));

});

//clean Task

gulp.task('clean',function(){

	return gulp.src('dist/*')
	.pipe(clean());
});

gulp.task('lint', function(){
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src(['js/**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
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