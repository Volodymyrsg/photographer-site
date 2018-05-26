var gulp = require("gulp");
var less = require("gulp-less");
var cssnano = require("gulp-cssnano");
var jsuglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var sourcemaps = require("gulp-sourcemaps");
var sync = require("browser-sync").create();
var htmlExtend = require("gulp-html-extend");
var rename = require('gulp-rename');
var fontmin = require('gulp-fontmin');
var imagemin = require('gulp-imagemin');

gulp.task('html:index', function() {
	return gulp.src('src/index.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:home', function() {
	return gulp.src('src/home.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:portfolio', function() {
	return gulp.src('src/portfolio.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:portfolio__oksanka&volodymyr', function() {
	return gulp.src('src/portfolio__oksanka&volodymyr.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:wanderlust', function() {
	return gulp.src('src/wanderlust.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:wanderlust__mountain', function() {
	return gulp.src('src/wanderlust__mountain.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:price', function() {
	return gulp.src('src/price.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});

gulp.task('html:contacts', function() {
	return gulp.src('src/contacts.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});
gulp.task('html:build', ['html:index', 
	'html:home',
	'html:portfolio',
	'html:portfolio__oksanka&volodymyr',
	'html:wanderlust',
	'html:wanderlust__mountain',
	'html:price', 
	'html:contacts'
	]);
 
gulp.task('cssOwn:build', function() {
	return gulp.src([
		'src/css/partial/reset.less',
		'src/css/partial/general.less',
		'src/css/partial/header.less',
		'src/css/partial/menu.less',
		'src/css/partial/slider.less',
		'src/css/partial/modal.less',
		'src/css/partial/gallery.less',
		'src/css/partial/contacts.less',
		'src/css/partial/footer.less',
		''
		])
	.pipe(sourcemaps.init())
	.pipe(concat('all.less'))
	.pipe(less())
	.pipe(cssnano())
	.pipe(sourcemaps.write())
	.pipe(rename('custom.min.css'))
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest("dist/css"))
	.pipe(sync.stream())
});

gulp.task('cssVendor:build', function () {
  return gulp.src("src/css/vendor/*.css") // Берем папку vendor
		.pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('dist/css')) //выгрузим в build
});
gulp.task('css:build', ['cssOwn:build', 'cssVendor:build']); // билдим css целиком


gulp.task('minifyFont', function () {
  return gulp.src('src/fonts/*.ttf')
    .pipe(fontmin())
    .pipe(gulp.dest('dist/fonts'))
});
gulp.task('fontsCss:build', ['minifyFont'], function() {
  return gulp.src('src/css/font-style.css')
    .pipe(gulp.dest('dist/css')) //выгружаем в build
});
gulp.task('font:build', ['minifyFont', 'fontsCss:build']);

gulp.task('albums-img:min', function() {
	return gulp.src('src/images/albums/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/albums'))
});

gulp.task('content-img:min', function() {
	return gulp.src('src/images/content/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/content'))
});

gulp.task('gallery-img:min', function() {
	return gulp.src('src/images/gallery/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/gallery'))
});

gulp.task('icons-img:min', function() {
	return gulp.src('src/images/icons/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/icons'))
});

gulp.task('slider-img:min', function() {
	return gulp.src('src/images/slider/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images/slider'))
});

gulp.task('images:build', ['albums-img:min', 'content-img:min', 'gallery-img:min', 'icons-img:min', 'slider-img:min']);

gulp.task('jsOwn:build', function() {
	return gulp.src([
		'src/js/custom.js',
		'src/js/jquery.sliderPro.js'
	])
	.pipe(concat('all.js'))
	.pipe(sourcemaps.init())
	.pipe(jsuglify())
	.pipe(sourcemaps.write())
	.pipe(rename('custom.min.js'))
	.pipe(gulp.dest('dist/js'))
});
gulp.task('jsVendor:build', function() {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
	// .pipe(sourcemaps.init())
	// .pipe(jsuglify())
	// .pipe(sourcemaps.write())
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest('dist/js'))
});
gulp.task('js:build', ['jsOwn:build', 'jsVendor:build']);


gulp.task('music:build', function() {
	return gulp.src('src/music/*.mp3')
		.pipe(gulp.dest('dist/music'))
});


gulp.task("build", ["html:build", "css:build",
	"font:build", "images:build", "js:build", "music:build"]);

gulp.task('watch', ["build"], function() {
	sync.init({
		server: "dist"
	});
	gulp.watch('src/include/*.html', ['html:build']);
	gulp.watch('src/**/*{.less, .css}', ['css:build']);
	gulp.watch('src/fonts/*.ttf', ['font:build']);
	gulp.watch('src/images/*.*', ['images:build']);
	gulp.watch('src/js/*.js', ['js:build']);

	gulp.watch('dist/*.html').on('change', sync.reload);
	gulp.watch('dist/css/custom.min.css').on('change', sync.reload);
	gulp.watch('dist/js/*.js').on('change', sync.reload);
});
gulp.task("default", ["watch"]);