module.exports = (api, _, __, invoking) => {
  api.render('./template', {
  })

  api.extendPackage({
    devDependencies: {
    },
    scripts: {
      "karma": "vue-cli-service karma"
    }
  })
}
