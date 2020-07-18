## ESlint

```js
// .eslintrc.js
module.exports = {
	// 环境
	env: {
		browser: true,
		es2020: true,
	},
	// 继承配置
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  // 指定语法解析器
  parser: '@typescript-eslint/parser'
	// 检测语法
	parserOptions: {
		ecmaVersion: 11, // 设置语法允许的版本
  },
  plugins: [
    "@typescript-eslint",
  ],
	// 配置校验规则的开启和关闭
	rules: {
		"no-alert": "error",
  },
  // 配置全局变量
	globals: {
		jQuery: "readonly",
	},
}
```

#### ESlint 注释

使用`// eslint-disable-line`注释关闭对次行的检测  
可在后面加上规则名 `no-template-curly-in-string`

```js
const str1 = "${name}" // eslint-disable-line no-template-curly-in-string
```

#### Eslint Gulp

`gulp-eslint`

```js
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    // 执行 eslint
    .pipe(plugins.eslint())
    // 将结果输出到控制台。
    .pipe(plugins.eslint.format())
    // 错误后，终止后续任务
    .pipe(plugins.eslint.failAfterError())
    // 在进行编译
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
```

#### Eslint Webpack

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'eslint-loader',
  enforce: 'pre' // 提高优先级
},
```

## Stylelint

```js
//.stylelintrc.js
module.exports = {
	extends: [
    "stylelint-config-standard",
    "stylelint-config-sass-guidelines"
  ],
}
```

## Prettier

```shell
$ npx prettier . --write
```

## git hooks

用 npm 安装 husky （yarn 安装后的 husky 不会正常工作）

```json
"script": {
  "precommit": "lint-staged"
},
"husky": {
  "hooks": {
    "precommit": "npm run precommit"
  }
},
"lint-staged": {
  "*.js": ["eslint", "git add"]
}
```
