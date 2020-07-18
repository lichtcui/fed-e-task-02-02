const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common")

/**
 * @type {webpack.Configuration}
 */
const devConfig = {
	mode: "development",
	devtool: "source-map",
	devServer: {
		contentBase: "dist",
		watchContentBase: true,
		watchOptions: { ignored: /node_modules/ },
		compress: true,
		port: 3000,
		open: true,
		hotOnly: true,
	},
}

module.exports = merge(common, devConfig)
