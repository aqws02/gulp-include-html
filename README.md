# 欢迎使用 gulp-include-html 小组件

------

这个是个人使用的组件方法比较简单，还请大家多多谅解。
主要功能就是将html中规定的 url路径，转换成URL的html内容。

##API
> * note: true // 默认false， 是否在头尾添加注解


### 案例
```html
<!--#insert file="./arts/header.html" -->
```

```javascript
var gulp = require('gulp'),
    includer = require('gulp-include-html');
    
gulp.src('static/pages/*.html')
    //.pipe(replaceHtml())
    .pipe(includer({note: true})) 
    .pipe(gulp.dest('dist/pages'));
```
```html
<!-- ========== ./arts/header.html   begin ===========-->
  <title>AdminLTE 2 | Dashboard</title>
<!-- ========== ./arts/header.html   end ===========-->
```
