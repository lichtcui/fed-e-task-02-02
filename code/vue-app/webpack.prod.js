const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common")

const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

/**
 * @type {webpack.Configuration}
 */
const proConfig = {
	mode: "production",
	devtool: "nosources-source-map",
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "public/favicon.ico", to: "public/favicon.ico" },
				{ from: "src/assets", to: "assets" },
			],
		}),
	],
	
	optimization: {
		sideEffects: true,
		// 提取被重复引入的文件，单独生成一个或多个文件
		splitChunks: {
			cacheGroups: {
				commons: {
					name: 'commons', // 对所有模块生效
					chunks: 'all',
					minChunks: 2, //共同引用超过大于等于2次就可以分割成公共模块
					priority: 0,
					minSize: 0
				},
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',  // 对所有模块生效
					priority: 10
				},
				default: false
			}
		},
		// 将包含chunks映射关系的list单独从app.js里提取出来
		runtimeChunk: {
			name: 'mainfest'
		},
		removeAvailableModules: true, // parent chunk中解决了的chunk会被删除
		removeEmptyChunks: true, // 删除空的chunks
		mergeDuplicateChunks: true, // 合并重复的chunk
		concatenateModules: true, // 查找模块图中可以安全的连接到其它模块的片段
		noEmitOnErrors: true, // 确保webpack不会输入任何错误的包
		namedModules: true, // 使用可读的模块标识符进行调试
		namedChunks: true, // 使用可读的块标识符进行调试
		occurrenceOrder: true, // 标记模块的加载顺序，使初始包更小
	},
}

module.exports = merge(common, proConfig)
