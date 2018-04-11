var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');



// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./src"
    });

    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/js/*.js").on('change', browserSync.reload);
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch("node_modules/bootstrap/scss/*.scss", ['sass']);

    
    
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/main.scss")
        .pipe(sass())
        .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
    
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

gulp.task('srctodist', function(){
    gulp.src(['src/css/main.css', 'src/index.html', 'src/js/*.js'])
    .pipe(gulp.dest(['dist/css', 'dist', 'dist/js']));
})
gulp.task('default', ['serve']);
