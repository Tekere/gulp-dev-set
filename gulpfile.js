'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const postcss = require('gulp-postcss')
const mqpacker = require('css-mqpacker')
// const pug = require('gulp-pug')
// const typescript = require('gulp-typescript')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()

//====================
//  タスクの追加
//====================
// gulp.task('ts', function () {
// 	return gulp
// 		.src('./src/ts/*.ts')
// 		.pipe(typescript())
// 		.pipe(gulp.dest('./src/js'))
// })

gulp.task('sass', function () {
	return gulp
		.src('./src/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: notify.onError('Error: <%= error.message %>')
			})
		)
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(postcss([mqpacker()]))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css'))
})

// gulp.task('pug', function () {
// 	return gulp
// 		.src('./src/pug/*.pug')
// 		.pipe(pug({ pretty: true }))
// 		.pipe(gulp.dest('./dist'))
// })

gulp.task('babel', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(
			babel({
				presets: ['@babel/env']
			})
		)
		.pipe(gulp.dest('./dist/js'))
})

gulp.task('serve', done => {
	browserSync.init({
		server: {
			baseDir: './dist',
			index: '/index.html'
		}
	})
	done()
})

//====================
//  すべての監視
//====================
gulp.task('watch', () => {
	const browserReload = done => {
		browserSync.reload()
		done()
	}

	// gulp.watch('./src/pug/*.pug', gulp.series('pug'))
	gulp.watch('./src/scss/*.scss', gulp.series('sass'))
	// gulp.watch('./src/ts/*.ts', gulp.series('ts'))
	gulp.watch('./src/js/*.js', gulp.series('babel'))
	gulp.watch('./dist/**/*', browserReload)
})

//====================
//  デフォルトとして登録。 コマンド gulpでスタート
//====================
gulp.task(
	'default',
	gulp.series('sass', 'babel', 'serve', 'watch')
)
