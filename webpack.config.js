const { appPrefix } = require("./src/constants");
const publicPath = appPrefix;

module.exports = {
  output: {
    publicPath,
  },
  devServer: {
    publicPath,
    historyApiFallback: {
      index: publicPath,
    },
  },
};
