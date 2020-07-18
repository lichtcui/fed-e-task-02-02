# 简答题答案及说明

## 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

#### 主要环节

- 模块打包器 Module bundler  
  零散代码打包
- 模块加载器 Loader  
  处理代码兼容问题
- 代码拆分 Code Splitting  
  按需打包，分量加载
- 资源模块 Asset Module  
  以模块化方式载入任意类型文件

#### 打包过程

- 项目中散落着各种类型文件
- 根据配置找到文件作为打包入口，一般是 js 文件
- 顺着入口文件的代码，根据代码中出现的 import / require 推断出文件所依赖的资源模块，分别解析每个资源文件对应的依赖，形成整个项目所有用到文件的依赖关系的树
- 递归依赖树，找到每个节点对应资源文件
- 根据配置中的 rules 属性去找到模块对应的加载器，使用加载器加载模块
- 将加载后的结果放到 bundle.js （打包结果）中，实现项目打包

## 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

#### 不同

- Loader 通过 loader 加载任何类型资源
- Plugins 解决其他自动化工作

#### Loader 开发思路

通过 source 加载到文件的内容，处理函数并输出 Javascript（支持 ES Modules）

#### Plugin 开发思路

在 class 中添加 apply 方法，接收 compiler 参数  
在 comiler.hooks 的钩子上挂载插件名称及使用 compilation（打包的上下文） 参数的函数  
遍历 compilation.assets 中的元素做相应处理
