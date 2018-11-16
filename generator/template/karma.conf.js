// Karma configuration
"use strict";
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    //测试脚本的位置
    files: ["tests/unit/*.spec.js"],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //使用webpack对脚本进行处理
      "tests/unit/*.spec.js": ["webpack"]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "coverage-istanbul"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    //监听测试用例文件的修改
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["ChromeHeadless"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    //覆盖率报告的格式和位置
    coverageIstanbulReporter: {
      reports: ["text-summary", "html"],
      fixWebpackSourcePaths: true,
      dir: "tests/report"
    },
    client: {
      captureConsole: true
    },
    browserConsoleLogOptions: {
      terminal: true,
      level: ""
    },
    webpack: {
      mode: "development",
      entry: "./src/main.js",
      resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
          vue$: "vue/dist/vue.esm.js",
          "@": resolve("src")
        }
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              {
                loader: "babel-loader"
              },
              {
                loader: "istanbul-instrumenter-loader",
                options: {
                  esModules: true
                }
              }
            ]
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: "url-loader"
          },
          {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
              loaders: {
                js: "babel-loader"
              },
              postLoaders: {
                js: "istanbul-instrumenter-loader?esModules=true"
              }
            }
          },
          {
            test: /\.scss$/,
            use: ["vue-style-loader", "css-loader", "sass-loader"]
          }
        ]
      },
      plugins: [new VueLoaderPlugin()]
    }
  });
};
