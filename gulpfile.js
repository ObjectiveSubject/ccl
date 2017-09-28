var addsrc 		 = require('gulp-add-src'),
	autoprefixer = require('gulp-autoprefixer'),
	cleancss 	 = require('gulp-clean-css'),
	combineMq	 = require('gulp-combine-mq'),
	concat 		 = require('gulp-concat-util'),
	gulp 		 = require('gulp'),
	jshint 		 = require('gulp-jshint'),
	livereload   = require('gulp-livereload'),
	rename 		 = require('gulp-rename'),
	sass 		 = require('gulp-ruby-sass'),
	sourcemaps 	 = require('gulp-sourcemaps'),
    uglify 		 = require('gulp-uglify');
	
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
		.pipe(combineMq({
			beautify: false
		}))
		.pipe(cleancss())
		.pipe(gulp.dest('assets/css'))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(['assets/js/src/_includes/*.js', 'assets/js/src/*.js'])
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
