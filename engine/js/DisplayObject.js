/**
该类用于总体绘制图像， 将添加进来的各种显示对象进行绘制，重绘
Note: 并不用于负责某个具体对象如何绘制
*/
"use strict"
define(["engine/Constants","engine/displayObjectContainer","engine/FrameBuffer","engine/log/log"],function(C,container,frameBuffer,log){
	var Stage2D = function(){
		var that;
		var hunit = unit/2;//means haft unit;
		//场景宽度
		var stageWidth = 1024;
		this.setStageWidth = function(w){
			stageWidth = w;
		}
		
		//场景高度
		var stageHeight= 768;
		this.setStageHeight = function(h){
			stageHeight = h;
		}
		//事件列表
		var eventList = [];
		
		var draw = function(id,layer,cache){
			var objs = layer;
			for(var i=0;i<objs.length;i++)
			{
				var obj = objs[i];
				obj.paint();
			}
			if(cache){
				frameBuffer.cache(id,canvas);
			}
		};
		
		var cache = function(id,layer){
			if(!layer){
				//log.info("数据为空，跳过");
				return;
			}
			context.clearRect(0,0,canvas.width,canvas.height);
			draw(id,layer,true);
		};

		//初始化启动计时器
		this.init=function()
		{
			that = this;
			document.addEventListener("mouseup",this.stageMouseUp);
			document.addEventListener("mousedown",this.stageMouseDown);
			document.addEventListener("mousemove",this.stageMouseMove);
			document.addEventListener("keydown",this.stageKeyDown);
			//document.addEventListener("keyDown",this.stageKeyDown);
		}
		
		this.start = function(){
			requestAnimationFrame(this.paint);
		}
	 
		this.fireEvent = function(e,eventType){
			//TODO
			if(isKeyEvent(eventType)){
				for(var j=0;j<eventList.length;j++)
				{
					if(eventList[j].eventType==eventType)
					{
						eventList[j].callback(e);
					}
				}
				return;
			}
			
			var layerDatas = container.all();
			for(var x = 0;x<layerDatas.length;x++){
				var objs = layerDatas[x];
				//因为最后添加的对象在最顶上,从画面理解,上层的内容会挡住下层的内容,所以我们的事件触发循序也应该是从显示列表的最后一位开始检测
				for(var i = objs.length-1;i>=0;i--){
					if(Math.abs(objs[i].x-e.pageX) <= objs[i].width/2 && Math.abs(objs[i].y-e.pageY) <= objs[i].height/2)
					{
						for(var j=0;j<eventList.length;j++)
						{
							if(eventList[j].eventType==eventType)
							{
								//如果检测通过并且有相应的事件就回调事件模块中的函数然后把当前点击的对象通过回调函数传递出去,并且返回出去不再执行下一次的逻辑,这就好像上层的图像挡住了下层的对                        //象而导致你点不到
								eventList[j].callback(objs[i]);
								return;
							}
						}
					}
				}
			}
			
		}
		this.stageMouseDown = function(e){
			that.fireEvent(e,C.EVENT_MOUSE_DOWN);
		}
		
		this.stageMouseUp = function(e){
			that.fireEvent(e,C.EVENT_MOUSE_UP);
		}
		
		this.stageMouseMove = function(e){
			//that.fireEvent(e,C.EVENT_MOUSE_MOVE);
		}
		this.stageKeyDown = function(e){
			that.fireEvent(e,C.EVENT_KEY_DOWN);
		}
		/**
		添加子对象。
		如果子对象是动画对象，即child.animation()返回为true时，有点不同。
		比如addChild(animationObj,2);意思为将动画对象放置在索引为2的层。那么如果索引为2的层已经有了其他静态内容怎么办呢。这里会将动画对象放置在索引为2的层，同时将原先的内容移动到后一个层，后续的层依次后移。
		这么做是为了进行绘制的性能的优化，优化原理：
		假设绘制层背景，动画层，前景层，三层这种简单结构，那么由于背景层，前景层都是不变的。所以我们可以将这两层缓存起来，下次绘制的时候，直接将背景层直接绘制，然后将动画层绘制，然后再将缓存的前景层绘制，这样理想情况只需要调用3次drawImage即可。根据测试数据，drawImage绘制缓存的canvas对象1000*100次，每次耗时约0.01ms。那么这三次调用只需要0.03ms即可完成。
		
		如果按照之前的优化方法，把动画相关的元素找出来，然后只绘制这几个受到影响的元素，最好情况是只需要绘制背景1个方格，动画元素一个方格。调用drawImage两次，最坏情况就要看收到影响的元素有多少了，比如动画元素比较大，比如是长宽都为2个单位长度，那么最坏情况，会有包含自身共10个元素被覆盖着，那么需要调用10次drawImage。 根据测试直接调用drawImage绘制Image对象，1000*1000次，平均每次调用0.0054ms。那么10次需要0.054ms大于上一个方法的0.03ms。再加上上一个方法，即使背景，前景都包含多层，那么由于动的元素只有动画对象本身，那么可以将层合并，所以始终可以能保持3层运行的模式。而这个优化方法呢，图层依然是分离的。所以意味着，如果包含多层，那么就有多个9个元素需要绘制。此外，由于需要找到动画元素影响到了哪些背景层元素，前景层元素，这里有脚本运行的开销。
		@param child - 添加的动画元素对象
		@param idx - 将该child对象放置于舞台画布的第几层。0表示为最下面一层
		*/
		this.addChild=function(child,idx)
		{
			idx = idx || 0;
			var objs = container.get(idx);
			if(!this.exist(child,idx))
			{
				objs.push(child);
			}else
			{
				//错误修正
				objs.splice(objs.indexOf(child),1);
				objs.push(child);
			}
		}
	 
		//删除子对象
		this.removeChild=function(child,idx)
		{
			idx = idx || 0;
			var objs = container.get(idx);
			if(this.exist(child,idx))
			{
				objs.splice(child,1);
			}
		}
		
		this.addAniObj = function(obj){
			container.addAni(obj);
		}
		this.removeAniObj = function(obj){
			container.removeAni(obj);
		}
		this.addEventListener = function(eventObj){
			if(eventList.indexOf(eventObj) == -1){
				eventList.push(eventObj);
			}
		}
		
		this.removeEventListener = function(eventObj){
			if(eventList.indexOf(eventObj) != -1){
				eventList.splice(eventObj,1);
			}		
		}
		/**
		@param ele - 待判断的元素
		@param idx - 舞台图层第几层
		*/
		this.exist = function(ele,idx){
			idx = idx || 0;
			var objs = container.get(idx);
			for(var i = 0;i<objs.length;i++){  
				if(objs[i] == ele){  
				   return true;
				 }  
			}  
			return false;
		}
		/**
		本方法，先绘制背景，再绘制动画层，最后绘制前景。次序不能乱
		*/
		this.paint = function(t){
			//pp.mark("paint_start");
			context.clearRect(0,0,stageWidth,stageHeight);
			//重置画布的透明度
			context.globalAlpha=1;
			
			var bgcached = frameBuffer.cached("bg");
			var fgcached = frameBuffer.cached("fg");
			
			var layerDatas;
			var bglayer;
			if(!bgcached){
				layerDatas = container.all();
				//背景
				bglayer = layerDatas[0];
				cache("bg",bglayer);
			}
			
			var fglayer;
			if(!fgcached){
				//前景
				if(!layerDatas){
					layerDatas = container.all();
				}
				fglayer = layerDatas[1];
				cache("fg",fglayer);
			}
			
			var cachedBG = frameBuffer.get("bg");
			if(cachedBG)
				cachedBG.paint(context);
			//动画层
			var anlayer = container.allAni();
			if(anlayer)
				draw("an",anlayer,false);
			var cachedFG = frameBuffer.get("fg");
			if(cachedFG)
				cachedFG.paint(context);
			
			if(layerDatas && layerDatas.length > 2){
				console.log("期望层数为2，分别为前景和背景。当前地图层数为："+layerDatas.length);
			}
			/**
			pp.mark("paint_end");
			pp.measure("paint","paint_start","paint_end");
			var ms = pp.getEntriesByName("paint");
			console.log("between:  "+ms[0].duration);
			pp.clearMarks("paint_start");
			pp.clearMarks("paint_end");
			pp.clearMeasures("paint");
			*/
			requestAnimationFrame(that.paint);
			
		}
	};

	return Stage2D;
});