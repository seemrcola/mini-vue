### 基本概念
#### 什么是副作用函数
即会产生副作用函数 
该函数会修改文本内容，但是其他函数可能会读取文本内容，改函数就直接或间接影响了其他函数的执行
```js
 function effect() {
   document.body.innerText = 'hello vue3'
 }
```
由此推论，我们修改一个全局变量也是产生了副作用
```js
var a = 0

function setA() {
  a = 100
}
```
#### 什么是响应式数据
```js
 const obj = { text: 'hello world' }
 function effect() {
   // effect 函数的执行会读取 obj.text
   document.body.innerText = obj.text
 }

 obj.text = 'hhahaha'
```
document.body.innerText依赖obj.text属性，某一时刻obj.text被修改了，我们希望document.body.innerText也被通知到并且同步作出修改  
也就是说，我们希望obj.text修改之后，effect函数能重新执行一次。

#### 确定方案
我们在读取到一个响应式数据的时候，将这个effect函数收集起来，当这个响应式数据被改变的时候，将effect函数取出来全部执行一遍。  
那现在问题就变成了如何收集和触发。【Proxy拦截set和get】  



