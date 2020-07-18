const webpack = require("webpack")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const path = require("path")
const htmlWebpackPlugin = require("html-webpack-plugin")

/**
 * @type {webpack.Configuration}
 */
module.exports = {
	entry: "./src/main.js",
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.less$/,
				use: ["style-loader", "css-loader", "less-loader"],
			},
			{
				test: /.(png|jpg)$/,
				use: {
					loader: "url-loader",
					options: {
						esModule: false,
						limit: 10 * 1024,
					},
				},
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new htmlWebpackPlugin({
			title: "Webpack Vue",
			template: "./public/index.html",
			url: "./public/",
		}),
	],
}
