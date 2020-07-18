# 模块打包

- ES Modules 存在环境兼容问题  
  新特性代码编译
- 模块文件过多，网络请求频繁  
  模块化 JS 打包
- 所有前端资源都需要模块化  
  支持不同种类型的资源模块

## webpack

- 模块打包器 Module bundler  
  零散代码打包
- 模块加载器 Loader  
  处理代码兼容问题
- 代码拆分 Code Splitting  
  按需打包，分量加载
- 资源模块 Asset Module  
  以模块化方式载入任意类型文件

#### 工作原理

- 项目中散落着各种类型文件
- 根据配置找到文件作为打包入口，一般是 js 文件
- 顺着入口文件的代码，根据代码中出现的 import / require 推断出文件所依赖的资源模块，分别解析每个资源文件对应的依赖，形成整个项目所有用到文件的依赖关系的树
- 递归依赖树，找到每个节点对应资源文件
- 根据配置中的 rules 属性去找到模块对应的加载器，使用加载器加载模块
- 将加载后的结果放到 bundle.js （打包结果）中，实现项目打包

#### 打包原理

- 整体是一个立即执行函数，接收 `modules` 参数，调用时传入数组
- 数组中的每个元素都是参数列表相同的函数
- 函数对应的是源代码中的模块，每个模块都被包裹至函数中，实现模块私有作用域
- 定义 `installedModules` 对象，缓存加载过的模块
- 定义 `__webpack_require__` 函数，加载模块
- 在 `require` 上挂载其他数据及工具函数
- 调用 `require` 函数，加载源代码中的入口模块
- 如果加载过，就从缓存里读，没有则创建一个新对象
- 调用模块对应函数
- 在导出对象上添加 `ES Module` 标记，并调用下一个模块

#### 打包

```shell
$ yarn webpack
```

```html
<!-- 打包前 -->
<script type="module" src="src/index.js"></script>
<!-- 打包后 -->
<script src="dist/main.js"></script>
```

#### 配置文件

webpack 4 后支持零配置打包 `src/index.js` => `dist/main.js`
入口文件 `webpack.config.js`

#### 工作模式

`yarn webpack --mode development` 或添加 mode 属性

- production 优化打包结果 (默认值)
- development 优化打包速度
- none 不做任何处理

```js
module.exports = {
  ...,
  mode: 'development'
}
```

#### Entry & Output

```js
module.exports = {
  entry: "src/index.js",
  output: {
    filename: "bundle.js",
    path: resolve("dist"),
  },
  ...
}
```

#### Loader

通过 loader 加载任何类型资源

- 编译转换类
  将加载到的模块转化为 js 代码
- 文件操作类
  将加载模块拷贝到输出目录，将文件的访问路径相位导出
- 代码检查类
  对加载代码进行校验，统一代码风格，提高代码质量，一般不修改生产环境代码

```js
module.exports = {
	module: {
		rules: [
			{
        test: /.css$/,
        // 从后向前执行
				use: ["style-loader", "css-loader"],
			},
		],
  },
  ...
}
```

#### Custom Loader

```js
const marked = require("marked")

// source 加载到文件的内容
module.exports = source => {
	// markdown 解析模块 marked
	const html = marked(source)

	// html 转化为字符串
	// 通过 JSON.stringify 来解决换行符或其他符号可能引起的错误
	const validHtml = `${JSON.stringify(html)}`
	const jsResult = `module.exports = ${validHtml}`
	const esmResult = `export default ${validHtml}`

	// 返回结果必须是 JavaScript, 导出结果支持 ES Module 形式
	return jsResult || esmResult
}
```

#### Plugin

Plugins 解决其他自动化工作

`clean-webpack-plugin` 清除 dist 目录  
`html-webpack-plugin` 自动生成使用打包结果的 html，可配置多个 new HtmlWebpackPlugin() 来创建多个 html  
`copy-webpack-plugin` 拷贝静态文件到输出目录  
`imagemin-webpack-plugin` 压缩输出图片  
`webpack.HotModuleReplacementPlugin` 开启 module.hot 功能，配合 devServer 中的 hot 使用
`webpack.definePlugin` 配置全局常量，需导出 JS 代码片段
`MiniCssExtract` 样式文件单独存放到文件中，通过 link 引入

#### Custom Plugin
Plugin 通过钩子机制实现，必须是一个函数或者是一个包含 apply 方法的对象
webpack 几乎给每个环节埋下了钩子，可以通过往节点上挂载不同任务来扩展webpack 能力

```js
class RemoveDecorationPlugin {
	apply(compiler) {
		// 接收插件名称，和挂载到钩子上的函数
		compiler.hooks.emit.tap("RemoveDecorationPlugin", compilation => {
			// compilation 此次打包的上下文
			for (const name in compilation.assets) {
				// name 为每个文件的名称
				// 只处理 js 文件
				if (name.endsWith(".js")) {
					// source 为每个文件的值
					const contents = compilation.assets[name].source()
					// 去除 /******/
					const withoutComments = contents.replace(/\/\*\*+\*\//g, "")
					compilation.assets[name] = {
						source: () => withoutComments,
						// 返回文件大小，必须传递
						size: () => withoutComments.length,
					}
				}
			}
		})
	}
}
```
#### 动态导入，按需加载

需要用到某个模块时再加载这个模块，动态导入的模块会被自动分包  
webpack 会自动处理分包和按需加载  
react / vue 路由映射组件可以使用动态导入实现按需加载

```js
import("components/index.js").then(({ default: posts }) => {
	mainElement.appendChild(posts())
})
```

#### 魔法注释

可以把这两个文件打包到一个 bundle 中

```js
import(/* webpackChunkName: 'post' */ "./posts/posts.js")
import(/* webpackChunkName: 'post' */ "./album/album.js")
```

#### Hash 文件名

部署前段资源文件会启用服务器静态资源缓存
用户浏览器可以缓存住静态资源，不再需要请求服务器，得到这些资源，提高响应速度
设置缓存失效时间过短，效果不明显。时间过长，一旦应用更新，重新部署后，无法及时更新到客户端
生产模式下，文件名当中添加 hash 值，一旦资源发生改变，资源名称也会一起变化
对于客户端，全新文件名即全新请求，缓存时间可以设置非常长，不用担心文件更新后的问题

```
filename: '[name]-[hash].bundle.css'
[hash]: 项目级别，任何地方发生改动，这次打包后的 hash 值都会发生变化
[chunkhash]: chunk 级别，只要是同一路的打包，chunkhash 都是相同的，
[contenthash]: 文件级别，根据输出文件内容生成
引入·发生文件名发生变化的文件·的文件名也会改变（因引入link发生变化）
[contenthash:8] 指定 hash 长度
```
