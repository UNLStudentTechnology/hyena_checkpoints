var gulp 	     = 	require('gulp'),
	concat 	     =	require('gulp-concat'),
	uglify 	     =	require('gulp-uglify'),
	rename 	     = 	require('gulp-rename'),
	notify 	     =	require('gulp-notify'),
  minifyCSS    =  require('gulp-minify-css'),
	less 	       = 	require('gulp-less');

gulp.task('default', ['less', 'css']);

var paths = {
  less: ['public/less/*.less']
};

gulp.task('scripts', function() {
  return gulp.src(['public/design/js-build/jquery.dragsort-0.5.2.min.js', 'public/design/js-build/chart.min.js', 'public/design/js-build/redactor.min.js', 'public/design/js-build/kloudless.explorer.js', 'public/design/js-build/dropzone.js', 'public/design/js-build/tooltip.js', 'public/design/js-build/popover.js', 'public/design/js-build/slimscroll.min.js', 'public/design/js-build/nprogress.js', 'public/design/js-build/tabs.js', 'public/design/js-build/cal.js', 'public/design/js-build/classie.js', 'public/design/js-build/modalEffects.js', 'public/design/js-build/jquery.popupwindow.js', 'public/design/js-build/socket.io.js', 'public/design/js-build/video.js', 'public/design/js-build/tags.js', 'public/design/js-build/masonry.min.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/design/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/design/js'))
    .pipe(notify({ message: 'JS processed successfully!' }));
});

gulp.task('less', function () {
  return gulp.src('public/less/main.less')
    .pipe(less({
      paths: [ './' ]
    }))
    .pipe(gulp.dest('public/css-build'))
    .pipe(notify({ message: 'LESS processed successfully!' }));
});

gulp.task('css', function() {
  return gulp.src(['public/css-build/animate.css', 'public/css-build/fonts-gotham.css', 'public/css-build/fonts-wdn.css', 'public/css-build/main.css'])
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('public/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('public/css'))
    .pipe(notify({ message: 'Stylesheets processed successfully!' }));
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less', 'css']);
});