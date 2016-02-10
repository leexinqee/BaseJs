
//处理兼容等tool.js
//获取跨浏览器获取窗口大小
function getInner(){
	if(typeof window.innerWidth != 'undefined'){
		return {
			width : window.innerWidth ,
			height : window.innerHeight
		}
	}else{
		return{
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		}
	}
};

//跨浏览器获取style
function getStyle(element,attr){
	var val;
	//javascript的getComputedStyle方法获取节点的计算后的CSS样式
	if(typeof window.getComputedStyle != 'undefined'){//此处是为了处理W3C标准
		val = window.getComputedStyle(element,null)[attr];
	}else if(typeof element.currentStyle !='undefined'){//IE
		val = element.currentStyle[attr];
	}
	return val;
};

//判断class是否存在
function hasClass(element,classname){
	return element.className.match(new RegExp('(\\s|^)'+classname+'(\\s|$)'));
};

//获取event对象
function getEvent(event){
	return event || window.event;
}

//阻止默认行为 ----低版本火狐浏览器，空DIV的时候会出现一个漏洞，需要阻止默认事件，但是就会阻止所有默认事件的发生。
function preDef(event){
	var e = getEvent(event);
	if(typeof e.preventDefault != 'undefined'){ //w3c标准
		e.preventDefault();
	}else{ //ie
		e.returnValue = false;
	}
}

//跨浏览器添加事件绑定
addEvent.ID=1;
function addEvent(obj, type, fn) {
	if (typeof obj.addEventListener != 'undefined') {
		obj.addEventListener(type, fn, false);
	} else {
		//创建事件类型的散列表(哈希表)
		if (!obj.events) obj.events = {};
		//创建存放事件处理函数的数组
		if (!obj.events[type]) {
			obj.events[type] = [];
			//存储第一个事件处理函数
			if (obj['on' + type]) {
				obj.events[type][0] = fn;
			}
			//执行事件处理
			obj['on' + type] = addEvent.exec;
		} else {
			//同一个注册函数取消计数
			if (addEvent.array(fn,obj.events[type])) return false;
		}
		//从第二个开始，通过计数器存储
		obj.events[type][addEvent.ID++] = fn;
	}
}

addEvent.array = function (fn, es){
	for (var i in es) {
	if (es[i] == fn) return true;
	}
	return false;
}
//执行事件处理函数
addEvent.exec = function (event) {
	var e = event || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for (var i in es) {
		es[i].call(this, e);
	}
};

//获取IE 的event，兼容W3C 的调用
addEvent.fixEvent = function (event) {
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
};

//兼容IE 和W3C 阻止默认行为
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
};
//兼容IE 和W3C 取消冒泡
addEvent.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};

//跨浏览器删除事件绑定
function removeEvent(obj, type, fn) {
	if (typeof obj.removeEventListener != 'undefined') {
		obj.removeEventListener(type, fn, false);
	} else {
		if(obj.events){
			var es = obj.events[type];
			for (var i in es) {
				if (es[i] == fn) {
					delete obj.events[type][i];
				}
			}
		}
	}
}

//删除左右空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}

//浏览器检测
(function (){
	window.sys = {};		//让外部可以访问，用来存储浏览器版本的对象
	var ua = navigator.userAgent.toLowerCase();//获取浏览器的信息字符串
	var s;		//在获取的信息中，利用正则把版本和相关信息分离，储存到数组
	//三步式验证浏览器的版本；
	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
	(s = ua.match(/opera.*version\/([\d.]+)/)) ? sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
})();

//DOM文档加载
function addDomLoaded(fn) {
	var isReady = false;
	var timer = null;
	function doReady(){
		if(isReady) return;
		isReady = true;
		if (timer) clearInterval(timer);
		fn();
	}
	if ((sys.webkit && sys.webkit < 525) || (sys.opera && sys.opera < 9) ||
	(sys.firefox && sys.firefox < 3)){
		timer = setInterval(function(){
			if(/loaded|complete/.test(document.readyState)){
				doReady();
			}
		}, 1);
	/*timer = setInterval(function(){
		if (document && document.getElementById &&
		document.getElementsByTagName && document.body document.documentElement )
		{
		doReady();
		}
	}, 1); */
	} else if (document.addEventListener) {//W3C
		addEvent(document, 'DOMContentLoaded', function () {
			doReady();
			removeEvent(document, 'DOMContentLoaded', arguments.callee);
		});
	}
	else if (sys.ie && sys.ie < 9) {//IE
	//IE8-
		timer = setInterval(function () {
		try {
			document.documentElement.doScroll('left');
			doReady();
		} catch (ex) {};
		});
	}
}

//跨浏览器获取滚动条高度位置
function getScroll(){		//因为ie和火狐支持documentElement，而谷歌支持文档对象下的body对象
	return {
		top : document.documentElement.scrollTop || document.body.scrollTop,
		left : document.documentElement.scrollLeft || document.body.scrollLeft
	}
}


















