# 模块化
代码组成方式，通过把复杂代码按照功能不同划分为不同模块，单独维护

## 演变过程
- 文件划分方式，所有模块直接在全局工作，模块化全靠约定
  - 没有私有空间
  - 污染全局作用域
  - 命名冲突
  - 无法管理模块依赖关系
- 命名空间方式，每个模块只暴露一个全局对象，所有模块成员都挂载到这个对象下，在第一个方式的基础上包裹成为一个全局对象
  - 没有私有空间
  - 无法管理模块依赖关系
- IIFE 使用立即执行函数为模块提供私有空间
  - 将模块中每个成员都放在一个函数提供的私有作用域中，对于需要暴露给外部的成员，通过挂载到全局对象上的方式实现
  - 利用自执行函数的参数去作为依赖声明，使依赖关系变得明显

> script方式引用模块，模块加载不受代码控制，维护起来非常麻烦

- CommonJS 规范
  - 一个文件就是一个模块
  - 每个模块都有单独的作用域
  - 通过 module.exports 导出成员
  - 通过 require 函数载入模块
  - 同步方式加载模块

- AMD 规范 (Asynchronous Module Definition)
  - Require.js 实现了 AMD 规范（模块加载器）
  - 每个模块必须要通过 define 定义函数，默认接收2个参数，也可以传递三个参数（
    1. 模块名
    2. 声明依赖项的数组
    3. 函数，函数的参数与依赖一一对应，为当前模块提供私有空间，可以通过 return 的方式向外部导出成员
  - require 函数，载入模块  
    内部创建一个 script 标签，先发送脚本文件的请求并执行相应的代码
  - AMD 使用相对复杂
  - 模块 JS 文件请求频繁

- Sea.js + CMD (Common Module Definition)
  - 类似 CommonJS 规范

- Nodejs 环境中遵循 CommonJS 规范
- 在浏览器环境中遵循 ES Modules 规范

## ES Modules

通过 script 添加 type = module 的属性，就可以以 ES 的标准执行其中的代码
- 自动采用严格模式，忽略 'use strict'
- 每个 ESM 都是单独的私有作用域
- ESM 是通过 CORS 的方式请求外部 JS 模块
- ESM 的 script 标签会延迟执行脚本
```html
<script type="module">
  console.log("this is ES Module")
</script>
```

#### 导入导出
```js
// modules.js
export const name = 'bar'
export function hello () {}
export class Person {}

// modules-2.js
const name = 'foo'
const hello = () => {}
export { name as fooName, hello }

// modules-3.js
const name = 'ccc'
export default name

// app.js
import { name } from './modules.js'
import * as mod from './modules-2.js'
import 3rdName from './modules-3.js'

// 动态导入
import('./module.js').then(module => {
  console.log('module', module)
})

// 组织散落的组件，制作目录文件
export { name, hello } from './module-2.js'
```

## 兼容
- ES-module-loader
- Promise-polyfill
```html
<!-- 只会在不支持 ESM 的环境下运行，开发阶段可用 -->
<script nomodule></script>
```

使用 babel
```shell
$ yarn add @babel/node @babel/core @babel/preset-env --dev
$ yarn babel-node index.js --presets=@babel/preset-env
```

配置 `.babelrc`
```json
{
  // preset 是转换插件的集合
  "presets": ["@babel/preset-env"],
  // 分开添加插件
  // "plugins": [
  //   "@babel/plugin-transform-modules-commonjs"
  // ]
}
```
```shell
$ yarn babel-node index.js
```

## ES Modules in Node 
#### 导入
```js
// index.mjs
import { foo,bar } from './module.mjs
console.log(foo, bar)

// 支持 import { writeFileSync } from 'fs'
// 内置模块兼容了 ESM 的提取成员方式
import fs from 'fs'
fs.writeFileSync('foo.txt', 'es module working')

// 不支持 import { camelCase } from 'lodash'
import _ from 'lodash'
console.log(_.camelCase('ES Module'))
```

```shell
$ node --experimental-modules index.mjs
```

#### 与 CommonJS 交互
- ES Module 中可以导入 CommonJS 模块
- CommonJS 中不能导入 ES Module
- CommonJS 始终只会导出一个默认成员
- import 不是解构导出对象

#### 与 CommonJS 的差异
不能在 ES Module 中直接打印，内置在 commonJS 中
```js
console.log(require)
console.log(module)
console.log(exports)
```

ES Module 中不能直接使用`__dirname`, `__filename`
```js
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
console.log(__filename)

const __dirname = dirname(__filename)
console.log(__dirname)
```

#### Node 新版本支持
所有文件默认以 ES Module 工作，直接在 `.js` 文件中即可使用，CommonJS 则需在 `.cjs` 中使用
```json
// package.json
{ ..., "type": "module"}
```