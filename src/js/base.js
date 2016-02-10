


//前台的调用
var $ = function (args){
	return new Base(args);
};

//基础类库
function Base(args){
	//设置数据来储存，节点数组
	this.elements = [];	//将数组进行私有化
	if(typeof args == 'string'){
		//模拟CSS 选择器
		if (args.indexOf(' ') != -1) {
			var elements = args.split(' ');		//将节点拆分开，放进数组中。
			var childElements = [];				//用来存放临时父节点对象，解决被覆盖的问题
			var node = [];						//用来存储父节点的数组
			for (var i = 0; i < elements.length; i ++) {
				if (node.length == 0) node.push(document);//如果没有父节点，就将document放入到父节点中
				switch (elements[i].charAt(0)) {
					case '#' :
						childElements = [];		//清空临时父节点，以便父节点失效，子节点有效（在父节点范围内进行子节点操作）
						childElements.push(this.getId(elements[i].substring(1)));
						node = childElements;//保存父节点，因为childElements要进行清理，所以需要创建一个node数组进行父节点的存储
						break;
					case '.' :
						childElements = [];
						for (var j = 0; j < node.length; j ++) {
							var temps = this.getClass(elements[i].substring(1), node[j]);
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
						break;
					default :
					childElements = [];
					for (var j = 0; j < node.length; j ++) {
						var temps = this.getTag(elements[i], node[j]);
						for (var k = 0; k < temps.length; k ++) {
							childElements.push(temps[k]);
						}
					}
					node = childElements;
				}
			}
			this.elements = childElements;
		}else{
			//find模拟性查找节点
			switch (args.charAt(0)){
				case '#':
					this.elements.push(this.getId(args.substring(1)));
					break;
				case '.':
					this.elements = this.getClass(args.substring(1));
					break;
				default :
					this.elements = this.getTag(args);
				}
		}
	}else if(typeof args == 'object'){
		if(args != undefined){		//此处的undefined为一个对象，而非一个字符串
			this.elements[0] = args;
		}
	}else if(typeof args == 'function'){
		this.ready(args);
	}
};

//设置addDomLoaded函数
Base.prototype.ready = function(fn){
	addDomLoaded(fn);
};

//设置css选择器的查找子节点
Base.prototype.find = function (str) {
	var childElements = [];
	for (var i = 0; i < this.elements.length; i ++) {
		switch (str.charAt(0)) {
			case '#' :
				childElements.push(this.getId(str.substring(1)));
				break;
			case '.' :
				var element = this.getClass(str.substring(1), this.elements[i]);
				for (var j = 0; j < element.length; j ++) {
					childElements.push(element[j]);
				}
				break;
			default :
				var element = this.getTag(str, this.elements[i]);
				for (var j = 0; j < element.length; j ++) {
					childElements.push(element[j]);
				}
		}
	}
	this.elements = childElements;
	return this;
};

//在对象函数的外部添加函数的时候，需要加上prototype，原型字样
//获取id,并返回当前对象 ==================》 getId函数
Base.prototype.getId = function(id){
	return document.getElementById(id);
};

//获取元素节点，并返回一个对象 ==================》 getTag函数
Base.prototype.getTag = function (tag, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
		for (var i = 0; i < tags.length; i ++) {
			temps.push(tags[i]);
		}
	return tags;
};

//获取name属性的节点，并返回对象值 ==================》 getName函数
Base.prototype.getName = function (name){
	var names = document.getElementsByName(name);
	for(var i=0;i<names.length;i++){
		this.elements.push(names[i]);
	}
	return this;
};

//获取class节点数组 ==================》 getClass函数
Base.prototype.getClass = function (className, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for (var i = 0; i < all.length; i ++) {
		if (all[i].className == className) {
			temps.push(all[i]);
		}
	}
	return temps;
}

//添加class ==================》 addClass函数
Base.prototype.addClass = function(classname){
	for(var i=0;i<this.elements.length;i++){
		if(!hasClass(this.elements[i],classname)){
			this.elements[i].className += " "+ classname;
		}
	}
	return this;
};

//移除class ==================》 removeClass函数
Base.prototype.removeClass = function(classname){
	for(var i=0;i<this.elements.length;i++){
		if(hasClass(this.elements[i],classname)){
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+classname+'(\\s|$)')," ");
		}
	}
	return this;
};

//获取相同节点的某一个节点，返回该节点对象 ==================》 getE函数
Base.prototype.getE = function(num){
	return this.elements[num];
};

//获取首个节点对象==================》 first函数
Base.prototype.first = function (){
	return this.elements[0];
};

//获取首个节点对象==================》 last函数
Base.prototype.last = function (){
	var num = this.elements.length;
	return this.elements[num - 1];
};

//获取相同节点的某一个节点，返回该Base对象 ==================》 eq函数
Base.prototype.eq = function(num){
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
};

// 获取当前同级节点的下一个元素节点  =====================》 next 函数
Base.prototype.next = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].nextSibling;	//获取下一个节点对象
		if (this.elements[i] == null){
			throw new Error('找不到下一个同级元素节点！');		// 获取到的节点为null的时候，抛出异常
		}
		if (this.elements[i].nodeType == 3){ 		// 当获取的节点类型为三的时候，（空格节点对象）
			this.next();		//  ，继续下一个节点，递归调用
		}
	}
	return this;
};


//获取当前同级节点的上一个元素节点  ===================》 prev函数
Base.prototype.prev = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].previousSibling;
		if (this.elements[i] == null){
			throw new Error('找不到上一个同级元素节点！');
		} 
		if (this.elements[i].nodeType == 3){
			this.prev();
		}
	}
	return this;
};

//设置点击切换方法
Base.prototype.toggle = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		(function (element, args) {
			var count = 0;
			addEvent(element, 'click', function () {
				args[count++ % args.length].call(element);
			});
		})(this.elements[i], arguments);
	}
	return this;
};


//封装css样式，进行连缀， ==================》 css函数
Base.prototype.css = function(attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 1){
			return getStyle(this.elements[i],attr);
		}
		this.elements[i].style[attr] = value;
	}
	return this;
};

//封装段落文本。HTML文本内容; ==================》 html函数
Base.prototype.html = function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
};

//封装点击事件， ==================》 click函数
Base.prototype.click = function (fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onclick = fn;
	}
	return this;
};

//设置鼠标的移入移除方法，hover事件、 ==================》 hover函数
Base.prototype.hover = function (over,out){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',over);
		addEvent(this.elements[i],'mouseout',out);
	}
	return this;
};

//设置显示函数 ==================》 show函数
Base.prototype.show = function (){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';
	}
	return this;
};

//设置隐藏函数 ==================》 hide函数
Base.prototype.hide = function (){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
	}
	return this;
};

//设置物体居中   ==================》 center函数
Base.prototype.center = function(width,height){			//居中函数，屏幕中间，传入该块元素的宽和高
	var left = (getInner().width -width)/2;
	var top = (getInner().height -height)/2;
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.top =top + 'px';
		this.elements[i].style.left =left + 'px';
	}
	return this;
};

//触发浏览器窗口的事件  ==================》 resize函数
Base.prototype.resize = function(fn){
	for(var i=0;i<this.elements.length;i++){
		var element = this.elements[i];
		window.onresize = function(){
			fn();
			if(element.offsetLeft > getInner().width - element.offsetWidth){
				element.style.left = getInner().width - element.offsetWidth + "px";		
			}
			if(element.offsetTop > getInner().height - element.offsetHeight){
				element.style.top = getInner().height - element.offsetHeight + "px";
			}
		}
	}
	return this;
};

//滚动到顶部
function scrollTop(){
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}

//锁屏功能  ==================》 lock函数
Base.prototype.lock = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.width = getInner().width + 'px';
		this.elements[i].style.height =getInner().height + 'px';
		this.elements[i].style.display = "block";
		document.documentElement.overflow = "hidden";
		/*这里为了对文本的选定，点击拖动存在一定的问题，这样虽然可以，但是阻止了默认行为
			addEvent(document,'mousedown',function(e){
				e.preventDefault();
				addEvent(document,'mousemove',function(){
					e.preventDefault();
				});
			});	
		*/
		addEvent(window,'scroll',scrollTop);
	}
	return this;
};
//开启屏幕功能	 ==================》 unlock函数
Base.prototype.unlock = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = "none";
		document.documentElement.overflow = "auto";
		removeEvent(window,'scroll',scrollTop);		//当屏幕锁定后，移除window对象下的滚动条事件
	}
	return this;
};

//设置事件绑定  ================》 bind函数
Base.prototype.bind = function(event,fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],event,fn);
	}
	return this;	
}

// 设置表单字段元素  ==============》  form函数,(获取form表单下有name的对象)
Base.prototype.form = function(name){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i] = this.elements[i][name];
	}
	return this;
};

// 获取value值  ==================》 val函数 
Base.prototype.val = function(str){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].value;
		}else{
			this.elements[i].value = str;
		}
	}
	return this;
}





//定义插件入口，
Base.prototype.extend = function(name,fn){
	Base.prototype[name]=fn;				//以函数的形式进行函数的定义，定义一个接口函数
};





//设置动画效果==================》 animate函数
Base.prototype.animate = function(obj){
	for(var i=0;i<this.elements.length;i++){
		var element = this.elements[i];		//获取得到得该动画的对象数组
		
		var attr = obj['attr'] =='x' ? 'left' : obj['attr'] =='y' ? 'top' :		//以x,y轴左右方向
					obj['attr'] =='w' ? 'width': obj['attr'] =='h' ? 'height' : 		//以w,h,来表示该块元素的宽高，
					obj['attr'] == 'o' ? 'opacity' : 					//‘O’表示透明度，   当不进行传参的时候，默认为向left为初始方向
					obj['attr'] != undefined  ? obj['attr'] : 'left';   	//如果不等于undefined的话，进行传入该指定的值进行该属性的变化	
		
		var start = obj['start'] != undefined  ? obj['start'] : 
					attr == 'opacity' ?  parseFloat(getStyle(element,attr)) * 100 :
										parseInt(getStyle(element,attr));	//可选参数,默认为初始位置。当为透明度的时候，几位透明度的变化，

		var time = obj['time'] != undefined ? obj['time'] : 30;		//可选参数，默认循环时间函数为 30 毫秒
		
		var step = obj['step'] != undefined ? obj['step'] : 10;		//可选参数，默认步长为 10
		
		var speed = obj['speed'] != undefined ? obj['speed'] : 6; 		//可选参数，缓冲速度为 6
		
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer': 'constant';	//判断类型，默认为直线运动 constant为直线，buffer为缓冲
		
		
		
		var alter = obj['alter'];			//必选之一，位置的增量 透明度和位置的增量
		var target = obj['target'];			//必选之一，位置的末位置
		
		var mul = obj['mul'];  		//此处主要实现同步动画，只有target属性，以对象键值对的形式传值
		
		
		
		if(alter != undefined && target == undefined){		//该变量如果是增量，进行增量的改变
			target = start + alter;	
		}else if(alter == undefined && target == undefined && mul == undefined){		//判断是否alter或者target是否都为空，如果为空时，抛出错误异常
			throw new Error('alter增量或者target目标量必须至少传一个参数！');
		}
		
		
		if(start > target) step = -step;		//判断步长，如果目标点大于起始点步长则为正，反之步长则为负 
		if(attr == 'opacity'){
			element.style.opacity = parseInt(start) / 100;  //W3C标准支持格式
			element.style.filter = 'alpha(opacity ='+ parseInt(start) +')'; //IE中的透明度
		}else{
			element.style[attr]= start + 'px';		//如果要实现事件的重复性，必须进行start传值，不然start获取的只是当前的位置，不会进行重复动作的处理			
		}

		//如果是单个动画
		if (mul == undefined) {
			mul = {};
			mul[attr] = target;
		}
		
		//清理定时器
		clearInterval(element.timer);	//为了清除多余事件造成的，定时器叠加的效果。		element.timer 是以每个对象进行一个timer，以免造成事件的互相干扰
		
		//定时器
		element.timer = setInterval(function(){		//以对象的形式进行赋值一个定时器，非所有对象一起共用
		
			//处理极端问题停滞的问题，
			//创建一个判断是否多个动画全部执行完毕
			var flag = true;
		
			for (var i in mul) {
				attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : 
						i == 'h' ? 'height' : i == 'o' ? 'opacity' : 
						i != undefined ? i : 'left';			//属性传参过来时候的判断器
				target = mul[i];   //------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>存在bug，同步动画只能进行宽高动画，其他会单步进行
				
		
				//如果该运动为缓冲运动的话，进行步长的设置。----------此处为难点
				if (type == 'buffer') {
					var parse = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr) * 100)) :
													(target - parseInt(getStyle(element, attr)));  //对什么样的运动的判断
					var temp = parse / speed;				//缓冲运动的主要特点就是这里，
					step = step > 0 ? Math.ceil(temp) : Math.floor(temp);			//进行不同符号的步长，保留整数的方式不同，否则会造成死循环现象，-----难
				}
				
				if (attr == 'opacity') {			//如果是透明度的改变，进行以下的操作
					
					if (step == 0) {
						setOpacity();
					} else if (step > 0 && Math.abs(temp - target) <= step) {			//此处为处理一个到达终点的时候的一个闪动现象
						setOpacity();
					} else if (step < 0 && (temp - target) <= Math.abs(step)) {			//同上
						setOpacity();
					} else {
						var temp = parseFloat(getStyle(element, attr)) * 100;			//创建临时变量，获取当前的透明度值，每次调用的时候都会有一个值，所以进行临时变量的存储
						element.style.filter = 'alpha(opacity='+ parseInt(temp + step) +')';		//ie
						element.style.opacity = parseInt(temp + step) / 100;			//w3c
					}
					
					//判断透明度动画是否执行完毕，没有就是false，parseInt(target) 防止小数
					if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) 
						flag = false;
					
				}else{							//如果是运动的改变，进行以下的操作
					if(step == 0){
						setTarget();
					}else if(step>0 && Math.abs( parseInt(getStyle(element,attr)) - target) <= step){  //判断到达终止位置的时候，与步长的大小，使动画不会存在闪动的状况
						setTarget();
					}else if(step < 0 &&  parseInt(getStyle(element,attr)) - target <= Math.abs(step)){
						setTarget();
					}else {
						element.style[attr] =  parseInt(getStyle(element,attr)) + step + 'px';			//步长的添加
					}
					//判断运动动画是否执行完毕，没有就是false
					if (parseInt(target) != parseInt(getStyle(element, attr))) 
						flag = false;
				}
			}
			if(flag){			//让回调函数执行一次，
				clearInterval(element.timer);		//element.timer主要是为了实现动画的不同定时器
				if(obj.fn != undefined) obj.fn();		//相当于回调函数，用来队列函数的实现

			}
	},time);
		
		
		function setOpacity() {		//透明度结束函数的调用，清理到达指定透明度后的定时器
			element.style.filter = 'alpha(opacity='+ target +')';		//IE
			element.style.opacity = target / 100;		//w3c
		}
		
		function setTarget(){		//运动函数的调用，清理到达位置后的定时器
			element.style[attr] = target + 'px';
		}
	}
	return this;			//返回对象，进行连缀的处理
};






















