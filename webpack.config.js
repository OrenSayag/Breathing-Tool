const publicPath = "/breath"

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
}
