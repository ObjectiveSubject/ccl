var gulp 		 = require('gulp'),
	addsrc 		 = require('gulp-add-src'),
	autoprefixer = require('gulp-autoprefixer'),
	concat 		 = require('gulp-concat-util'),
	jshint 		 = require('gulp-jshint'),
	cleancss 	 = require('gulp-clean-css'),
	notify 		 = require('gulp-notify'),
	rename 		 = require('gulp-rename'),
	sass 		 = require('gulp-ruby-sass'),
	uglify 		 = require('gulp-uglify'),
	sourcemaps 	 = require('gulp-sourcemaps'),
    livereload   = require('gulp-livereload');
	
var pkg	   = require('./package.json'),
	banner = '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
			 ' * <%= pkg.homepage %>\n' +
			 ' * Copyright (c) <%= new Date().getFullYear() %>;' +
			 ' * Licensed GPLv2+' +
			 ' */\n\n';


// Styles
gulp.task('styles', function() {
	return sass('assets/css/sass/style.scss', { style: 'expanded', sourcemap: true })
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleancss())
		.pipe(gulp.dest('assets/css'))
		.pipe(notify({ message: 'Styles task complete' }))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(['assets/js/src/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(concat.header(banner, { pkg : pkg }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('assets/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(gulp.dest('assets/js'))
		.pipe(notify({ message: 'Scripts task complete' }))
        .pipe(livereload());
});

// Default task
gulp.task('default', [], function() {
	gulp.start('styles', 'scripts');
});

// Watch
gulp.task('watch', function() {

    livereload.listen();

    // Watch .scss files
    gulp.watch('assets/css/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('assets/js/**/*.js', ['scripts']);

});
