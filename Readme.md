####介绍
jqPagination采用了交互式的文本框来显示类似“Page 1 of 5”的页码，可以在文本框中输入指定的页码并跳转到该页面
#### 使用方法
1.引入文件
```js
<link rel="stylesheet" href="./css/jqpagination.css">
<script src="./js/jquery-1.7.2.min.js"></script>
<script src="./js/jquery.jqpagination.js"></script>
```
2.html代码
```js
<div class="pagination">
    <a href="#" class="first" data-action="first">?</a> <a href="#"class="previous" data-action="previous">?</a> <input type="text"readonly="readonly" data-max-page="40"> <a href="#" class="next" data-action="next">?</a> <a href="#" class="last" data-action="last">?</a>
</div>
```
3.js调用
```js
 $('.pagination').jqPagination({
    paged: function(page) {
        // 分页事件
    }
});
```
#### 参数配置
current_page 
初始化设置当前的页码，默认值为：1
max_page
设置最大的页数，这个往往是从数据库中读取的数据的 count 总数来填充的
page_string 
文本框中显示的页码样式。如下图
alt=""/>
那么以上显示的参数为默认配置
page_string：'Page {current_page} of {max_page}'
当然你也可以设置成自己的样式，一般情况下我们需要设置成中文显示：
page_string：'当前 {current_page} / {max_page}' 
或者直接数字显示：
alt=""/>
page_string：'{current_page} / {max_page}' 
回调函数
当我们点击页码跳转到相应页时就要用到回调函数了，格式如下：
```
paged: function(page) {
    //点击页码要做的操作
        //如果是无刷新分页的话，就可以写成 getDataByPage(page) 这里 getDataByPage 是一个从服务端获取指定页数据的方法
        //如果是一般动态页或者是静态页的话，就直接跳转到相应的页面   location.href="view.aspx?id="+page  或者 location.href="view-"+page+".html"
}
```
#### 兼容性

兼容到ie6和Safari,Chrome,Firefox等主流浏览器