module.exports = api => {
  // 带命名空间的版本
  const {
    setSharedData,
    getSharedData,
    removeSharedData,
    watchSharedData,
    unwatchSharedData
  } = api.namespace('org.vue.st.karma.addon.');

  function addQuotes(text) {
    return '\\\"' + (text) + '\\\"';
  }

  String.prototype.startWith = function(str){     
    var reg = new RegExp("^" + str);     
    return reg.test(this);        
  }  
  
  String.prototype.endWith = function(str){     
    var reg = new RegExp(str + "$");     
    return reg.test(this);        
  }

  Date.prototype.format = function(format) {
    var date = {
       "M+": this.getMonth() + 1,
       "d+": this.getDate(),
       "h+": this.getHours(),
       "m+": this.getMinutes(),
       "s+": this.getSeconds(),
       "q+": Math.floor((this.getMonth() + 3) / 3),
       "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
       format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
       if (new RegExp("(" + k + ")").test(format)) {
           format = format.replace(RegExp.$1, RegExp.$1.length == 1
              ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
       }
    }
    return format;
  }

  api.describeConfig({
    id: 'org.vue.st.karma.configuration',
    name: 'Karma',
    description: 'org.vue.st.karma.config.description',
    link: 'https://github.com/1600133971/vue-cli-plugin-ui-karma',
    files: {
      // eslintrc.js
      eslint: {
        js: ['.eslintrc.js'],
        json: ['.eslintrc', '.eslintrc.json'],
        // 会从 `package.json` 读取
        package: 'eslintConfig'
      },
      // vue.config.js
      vue: {
        js: ['vue.config.js']
      }
    },
    onRead: ({ data, cwd }) => ({
      tabs: [
        {
          id: 'tab1',
          label: 'org.vue.st.karma.config.tab1.label',
          icon: 'settings',
          prompts: [
            // 提示符对象们
          ]
        },
        {
          id: 'tab2',
          label: 'org.vue.st.karma.config.tab2.label',
          icon: 'settings_applications',
          prompts: [
            // 提示符对象们
          ]
        }
      ]
    }),
    onWrite: ({ prompts, answers, data, files, cwd, api }) => {
      // ...
    }
  })

  api.describeTask({
    match: /vue-cli-service karma/,
    description: 'org.vue.st.karma.tasks.description',
    link: 'https://github.com/1600133971/vue-cli-plugin-ui-karma#injected-commands',
    prompts: [
      {
        name: 'conf',
        type: 'list',
        default: 'karma.conf.js',
        choices: [
          {
            name: 'karma.conf.js',
            value: 'karma.conf.js'
          },
          {
            name: 'karma.conf.1.js',
            value: 'karma.conf.1.js'
          },
          {
            name: 'karma.conf.2.js',
            value: 'karma.conf.2.js'
          },
          {
            name: 'karma.conf.3.js',
            value: 'karma.conf.3.js'
          },
          {
            name: 'custom',
            value: 'custom'
          }
        ],
        description: 'org.vue.st.karma.tasks.conf.description',
        group: 'org.vue.st.karma.tasks.group.recommended'
      },
      {
        name: 'customconf',
        type: 'input',
        default: '',
        description: 'org.vue.st.karma.tasks.customconf.description',
        group: 'org.vue.st.karma.tasks.group.recommended'
      }
    ],
    // 钩子
    // 任务运行之前立即执行
    onBeforeRun: ({ answers, args }) => {
      // answers: 配置界面获取参数
      // args: 参数整理输出
      args.push('--file', answers.conf !== "custom" ? answers.conf : answers.customconf);
    },
    // 任务运行之后立即执行
    onRun: async ({ args, child, cwd }) => {
      // child: Node 子进程
      // cwd: 进程所在目录

      // build-status
      api.setSharedData('build-status.status', 'Processing');
      api.setSharedData('build-status.total', '...');
      api.setSharedData('build-status.skipped', '...');
      api.setSharedData('build-status.processed', '...');
      api.setSharedData('build-status.passed', '...');
      api.setSharedData('build-status.failed', '...');
      api.setSharedData('build-status.startTime', '...');
      api.setSharedData('build-status.endTime', '...');
      api.setSharedData('build-status.duration', '...');
      api.setSharedData('build-status.userAgents', '...');

      // build-progress
      api.setSharedData('build-progress.status', 'Compiling');
      api.setSharedData('build-progress.progress', '0.4');
      api.setSharedData('build-progress.operations', 'unit test is started');
    },
    onExit: async ({ args, child, cwd, code, signal }) => {
      // code: 退出码
      // signal: 可能会被使用的杀进程信号
      var fs = require('fs');
      var json = JSON.parse(fs.readFileSync("./report/karma-result.json"));
      var newDate = new Date();

      // build-status
      api.setSharedData('build-status.status', 'Finished');
      api.setSharedData('build-status.total', json.browsers[0].browser.lastResult.total.toString());
      api.setSharedData('build-status.skipped', json.browsers[0].browser.lastResult.skipped.toString());
      api.setSharedData('build-status.processed', (json.browsers[0].browser.lastResult.total - json.browsers[0].browser.lastResult.skipped).toString());
      api.setSharedData('build-status.passed', json.browsers[0].browser.lastResult.success.toString());
      api.setSharedData('build-status.failed', (json.browsers[0].browser.lastResult.total - json.browsers[0].browser.lastResult.skipped - json.browsers[0].browser.lastResult.success).toString());
      newDate.setTime(json.browsers[0].browser.lastResult.startTime);
      api.setSharedData('build-status.startTime', newDate.format('yyyy-MM-dd h:m:s:S'));
      newDate.setTime(json.browsers[0].browser.lastResult.startTime + json.browsers[0].browser.lastResult.totalTime);
      api.setSharedData('build-status.endTime', newDate.format('yyyy-MM-dd h:m:s:S'));
      api.setSharedData('build-status.duration', json.browsers[0].browser.lastResult.totalTime);
      api.setSharedData('build-status.userAgents', json.browsers[0].browser.name);

      // build-progress
      api.setSharedData('build-progress.status', code === 0 ? 'Success' : 'Failed');
      api.setSharedData('build-progress.progress', '1');
      api.setSharedData('build-progress.operations', 'unit test is finished');
    },
    // 额外的视图(仪表盘)
    // 默认情况下，这里是展示终端输出的 `output` 视图
    views: [
      {
        id: 'org.vue.st.karma.client-addon',
        label: 'org.vue.st.karma.tasks.views.label',
        icon: 'dashboard',
        component: 'org.vue.st.karma.components.statistics'
      }
    ],
    // 展示任务详情时默认选择的视图 (默认是 `output`)
    //defaultView: 'org.vue.st.karma.client-addon'
  })

  api.addClientAddon({
    id: 'org.vue.st.karma.client-addon',
    // 包含构建出来的 JS 文件的文件夹
    path: 'vue-cli-addon-ui-karma/dist'
    //url: 'http://localhost:8042/index.js'
  })

  // Hooks
  api.onProjectOpen((project, previousProject) => {
    //console.log('onProjectOpen', project.id, previousProject)
  })

  api.onPluginReload((project) => {
    //console.log('plugin reloaded', project.id)
  })

  api.onViewOpen(({ view, cwd }) => {
    //console.log('onViewOpen', view.id)
  })

  api.onTaskOpen(({ task, cwd }) => {
    //console.log('onTaskOpen', task.id)
    if (task.id.endWith(':karma')) {
      // build-status
      api.setSharedData('build-status.status', 'Idle');
      api.setSharedData('build-status.total', '...');
      api.setSharedData('build-status.skipped', '...');
      api.setSharedData('build-status.processed', '...');
      api.setSharedData('build-status.passed', '...');
      api.setSharedData('build-status.failed', '...');
      api.setSharedData('build-status.startTime', '...');
      api.setSharedData('build-status.endTime', '...');
      api.setSharedData('build-status.duration', '...');
      api.setSharedData('build-status.userAgents', '...');

      // build-progress
      api.setSharedData('build-progress.status', 'Idle');
      api.setSharedData('build-progress.progress', '0');
      api.setSharedData('build-progress.operations', '...');
    }
  })

  api.onTaskRun(({ task, args, child, cwd }) => {
    //console.log('onTaskRun', task.id)
  })

  api.onTaskExit(({ task, args, child, signal, code, cwd }) => {
    //console.log('onTaskExit', task.id)
  })

  api.onConfigRead(({ config, data, onReadData, tabs, cwd }) => {
    //console.log('onConfigRead', config.id)
  })

  api.onConfigWrite(({ config, data, changedFields, cwd }) => {
    //console.log('onConfigWrite', config.id)
  })
}
