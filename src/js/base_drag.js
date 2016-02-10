//推拽插件，当调用插件的时候，需要引入到主页basic.js后面

//推拽功能  ==================》 drag函数
//Base.prototype.drag = function(){
/*
	实现拖拽功能的步骤：
		1.当鼠标点击按钮下去的时候（onouserdown)
		2.移动效果（onmousemove）
		3.当鼠标弹起的时候，定下显示位置
*/
//此处的tags必需以数组的形式进行传值
$().extend('drag',function(){
	var tags = arguments;
	for(var i=0;i<this.elements.length;i++){
		//this.elements[i].onmousedown = function(e){
		addEvent(this.elements[i],'mousedown',function(e){

			//此处不能设置阻止默认行为，否则不能点击input事件输入
			//设置为默认事件是处理火狐的一个低版本bug，
			if(trim(this.innerHTML).length == 0) e.preventDefault();
			var _this = this;
			
			//获取点击位置与实际框体之间的间隔距离，diffX,与diffY;
			var diffX = e.clientX - _this.offsetLeft; //实现原位置拖动效果
			var diffY = e.clientY - _this.offsetTop;
			
			//自定义拖拽区域
			var flag =false;
			for(var i=0;i<tags.length;i++){
				if(e.target == tags[i]){
					flag = true;
					break;
				}
			}
			
			if(flag){
				addEvent(document,'mousemove',move);
				addEvent(document,'mouseup',up);
			}else{
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}
			function move(e){
				var left = e.clientX - diffX;
				var top = e.clientY - diffY;
				if(left<0){
					left=0;
				}else if(left > getInner().width - _this.offsetWidth){
					left = getInner().width- _this.offsetWidth;
				}
				if(top<0){
					top=0;
				}else if(top > getInner().height - _this.offsetHeight){
					top = getInner().height - _this.offsetHeight;
				}
				_this.style.left = left +"px";
				_this.style.top = top +"px";
				//此处为兼容ie低版本的向下拖拽的时候，出现漏洞，但是会阻止input事件的发生
				//识别IE漏洞
				if(typeof _this.setCapture != 'undefined'){
					_this.setCapture();
				}
			}
			function up(){
				removeEvent(document,'mousemove',move);	//此处意思为鼠标弹起后，移动事件设置为空，
				removeEvent(document,'mouseup',up);		//实现点击循环的一个效果，不然弹起事件会一直存在。
				//此处为兼容ie低版本的向下拖拽的时候，出现漏洞，但是会阻止input事件的发生
				if(typeof _this.releaseCapture != 'undefined'){
					_this.releaseCapture();
				}
			}
		});
	}
	return this;
});