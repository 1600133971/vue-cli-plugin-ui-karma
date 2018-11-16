module.exports = (api, options) => {
  const chalk = require("chalk");

  function removeArg(rawArgs, arg) {
    const matchRE = new RegExp(`^--${arg}`);
    const equalRE = new RegExp(`^--${arg}=`);
    const i = rawArgs.findIndex(arg => matchRE.test(arg));
    if (i > -1) {
      rawArgs.splice(i, equalRE.test(rawArgs[i]) ? 1 : 2);
    }
  }

  function run(args, rawArgs) {
    removeArg(rawArgs, "mode");
    removeArg(rawArgs, "file");

    const serverPromise = api.service.run("serve", { mode: args.mode || "production" });

    return serverPromise.then(({ url, server }) => {
      const { info } = require("@vue/cli-shared-utils");
      info(`Starting unit tests...`);
      //info(`args: ` + JSON.stringify(args));
      //info(`rawArgs: ` + rawArgs);
      const testCafeArgs = [
        `start`,
        args.file
      ].filter(v => v);
      info(`testcafe ` + testCafeArgs.join(" "));
      const execa = require("execa");
      const testCafeBinPath = require.resolve("karma/bin/karma");
      const runner = execa(testCafeBinPath, testCafeArgs, { stdio: "inherit" });
      if (server) {
        runner.on("exit", () => server.close());
        runner.on("error", () => server.close());
      }

      if (process.env.VUE_CLI_TEST) {
        runner.on("exit", code => {
          process.exit(code);
        });
      }

      return runner;
    });
  }

  const commandOptions = {
    "--mode":          "specify the mode the dev server should run in. (default: development)",
    "start":           "run unit tests against auto-starting karma server",
    "karma.conf.*.js": "runs with a specific karma conf file"
  };

  api.registerCommand(
    "karma",
    {
      description: "run unit tests with Karma",
      usage: "vue-cli-service karma [options]",
      options: Object.assign(
        {
          // "--arg": "insert extra argument here"
        },
        commandOptions
      ),
      details:
        `All Karma CLI options are also supported:\n` +
        chalk.yellow(
          `https://devexpress.github.io/testcafe/documentation/using-testcafe/command-line-interface.html`
        )
    },
    (args, rawArgs) => run(args, rawArgs)
  );
};