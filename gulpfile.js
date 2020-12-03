"use strict";
// gulpプラグイン 必須
const gulp = require("gulp");
// Sassをコンパイルするプラグイン 必須
const sass = require("gulp-sass");
// エラーがあった際に、gulpを落とさないプラグイン
const plumber = require("gulp-plumber");
// エラーがあった際にウィンドウに通知してくれるプラグイン
const notify = require("gulp-notify");
// 開発者ツールにSCSSファイルの情報が見られるようにするプラグイン
const sourcemaps = require("gulp-sourcemaps");
//ベンタープレフィックスの自動追加
const autoprefixer = require("gulp-autoprefixer");
// コンパイル後にメディアクエリをまとめる
const postcss = require("gulp-postcss");
const mqpacker = require("css-mqpacker");
// ブラウザの自動起動と自動リロード
// const { watch } = require("browser-sync");
const browserSync = require("browser-sync").create();

//====================
//  タスクの追加
//====================

gulp.task("sass", function () {
  // style.scssファイルを取得
  return (
    gulp
      // Sassのコンパイルを実行
      .src("./scss/*.scss")
      //sourcemap 読み込み srcの直後
      .pipe(sourcemaps.init())
      //エラーが出ても落ちないようにして、ターミナルにエラーメッセージを出す
      .pipe(
        plumber({
          errorHandler: notify.onError("Error: <%= error.message %>"),
        })
      )
      //outputStyleでインデントや改行の設定
      .pipe(sass({ outputStyle: "compressed" }))
      //メディアクエリの整理
      .pipe(postcss([mqpacker()]))
      //ベンダープレフレックスをつける
      .pipe(autoprefixer())
      //sourcemap 実行 destの直前
      .pipe(sourcemaps.write("./"))
      // 保存先 直下に保存
      .pipe(gulp.dest("./"))
  );
});
//./cssのsassファイルの変更を検知してsassタスクを自動で実行
// gulp.task("watch-sass", function () {
//   gulp.watch("./scss/*.scss", gulp.task("sass"));
// });

//====================
//ブラウザの自動起動と自動リロード
//====================
gulp.task("serve", (done) => {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html",
    },
  });
  done();
});

//====================
//  すべての監視
//====================
gulp.task("watch", () => {
  const browserReload = (done) => {
    browserSync.reload();
    done();
  };
  gulp.watch("./scss/*.scss", gulp.series("sass"));
  gulp.watch("./**/*", browserReload);
});

//====================
//  デフォルトとして登録。 コマンド gulpでスタート
//====================
gulp.task("default", gulp.series("serve", "watch"));
