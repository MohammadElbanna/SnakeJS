var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

// default
gulp.task("default", ["sync"]);


// Static server
gulp.task("sync", function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(["./index.html" , "css/*.css", "js/*.js"]).on("change", browserSync.reload);
});