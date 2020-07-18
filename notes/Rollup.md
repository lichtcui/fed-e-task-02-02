# Rollup
ES Module 打包器，更小巧
- 输出结果更加扁平
- 自动移除未引用代码
- 打包结果完全可读
- 加载非ESM第三方模块比较复杂
- 模块最终都被打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD 库

如果症状开发应用程序 webpack
框架或者类库 rollup

```shell
$ yarn rollup ./src/index.js --format iife --file dist/bundle.js
```
`./src/index.js`: 入口文件
`--format iife`: 指定输出格式，自调用函数
`--file dist/bundle.js`: 指定输出文件路径

> rollup 默认开启 tree shaking

## 使用配置文件
```shell
$ yarn rollup --config
```
```js
export default {
	input: "src/index.js",
	output: {
		file: "dist/bundle.js",
		format: "iife",
	},
}
```
## 插件
唯一扩展途径
- 加载其他类型资源模块
- 导入 Common Js 模块
- 编译 ESM 新特性

```js
import json from "rollup-plugin-json"
export default {
	...,
	plugins: [json()],
}
```

## npm 模块 (ES Module)
只能安装文件路径方式加载本地文件模块，不能直接导入第三方模块
通过 `rollup-plugin-node-resolve` 加载第三方模块
```js
import resolve from "rollup-plugin-node-resolve"
export default {
  ...,
	plugins: [..., resolve()],
}
```

## CommonJS 模块
Rollup 默认只支持打包 ES Module，需要插件支持 Common JS
```js
import commonjs from "rollup-plugin-commonjs"
export default {
  ...,
	plugins: [..., commonjs()],
}
```

## Code Splitting
动态导入方式实现代码拆分
```js
// index.js
import("./logger").then(({ log }) => { log("split") })

// rollup.config.js
export default {
	output: {
		dir: 'dist',
		format: 'amd'
	},
	...
}
```

## 多入口打包
会自动提取公共部分
需要 amd 标准库加载
```js
// index.js
import fetchApi from './fetch'
import { log } from './logger'
fetchApi('/posts').then(data => {
  data.forEach(item => { log(item) })
})

// rollup config
export default {
	input: ['src/index.js', 'src/album'],
	// input: {
	// 	foo: 'src/index.js',
	// 	bar: 'src/album'
	// },
	output: {
		dir: 'dist',
		format: 'amd'
	},
	...
}
```
```html
<script
	src="https://unpkg.com/requirejs@2.3.6/require.js"
	data-main="index.js"
></script>
```