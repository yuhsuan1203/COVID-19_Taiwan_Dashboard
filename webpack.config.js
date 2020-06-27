const path = require("path");

module.exports = {
  entry: { index: path.resolve(__dirname, 'js', 'index.js') },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.json$/,
        use: 'json5-loader',
        type: 'javascript/auto'
      }
    ]
  }
};