"use strict";

const gulp = require('gulp');
const pug  = require('gulp-pug');
const postcss = require('gulp-postcss');
const precss = require('precss');
const normalize = require('postcss-normalize');
const lost = require('lost');
const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const nano = require('cssnano');
const postcssassets  = require('postcss-assets');
const fontmagican = require('postcss-font-magician');
const flexbugs  = require("postcss-flexbugs-fixes");
const svgfallback = require('postcss-svg-fallback');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const combiner = require('stream-combiner2').obj;
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task("pug", () => {
    return combiner(
        gulp.src("./frontend/pug/*.pug"),
        sourcemaps.init(),
        pug({pretty: true}),
        sourcemaps.write('./'),
        gulp.dest("./public/")
    ).on("error", notify.onError());
});

gulp.task("css", () => {

    let processors = [
        fontmagican({
            hosted: './public/fonts'
        }),
        normalize(),
        precss(),
        cssnext(
            autoprefixer({
                browsers: ['last 5 versions']
            })),
        lost(),
        postcssassets({
            loadPaths: ['./public/img'],
            relativeTo: './public/css'
        }),
        flexbugs(),
        svgfallback({
              basePath: './public/img',
              dest: './public/img',
            })
        // nano({
        //     discardComments: {
        //         removeAll: true
        //     }
        // })
     ];

    return combiner(
        gulp.src('./frontend/css/*.css'),
        sourcemaps.init(),
        postcss(processors),
        sourcemaps.write('./'),
        gulp.dest('./public/css/')
    ).on('error', notify.onError());
});

gulp.task('watch', () => {
    gulp.watch("./frontend/css/*.css", gulp.series("css"));
    gulp.watch("./frontend/slim/*.slim", gulp.series("pug"));
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
    browserSync.watch('public/**/*.*').on('change', reload);
});

gulp.task('default', gulp.parallel('watch', 'serve'));
