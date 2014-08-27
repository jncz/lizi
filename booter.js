
var context;
var unit;

define(["engine/ImgLoader","engine/JSONLoader","engine/XMLLoader","engine/Promise","engine/MovieClip","engine/DisplayObject","engine/event"],
	function(loader,jsonLoader,xmlLoader,Promise,MovieClip2D,Stage2D,Event2D){
	var imageAddress = [];
	var f = function(){};//empty function
	return {
		boot:function(){
			this.initCanvas()
			.then(this.initStage)
			.then(this.loadResource)
			.then(this.initMap)
			.then(this.addEvent)
			.then(f);
		},
		initCanvas:function(){
			var canvas = $("mycanvas");
			var stageWidth = canvas.width;
			var stageHeight = canvas.height;
			context = canvas.getContext("2d");//set it as global var
			
			return Promise.resolve({stageWidth:stageWidth,stageHeight:stageHeight});
		},
		loadResource:function(){
			var p = loader.load(imageAddress);
			p.then(function(){
				var xmlAddress = ["spirit.xml","eff.xml"];
				xmlLoader.load(xmlAddress);
			});
			return p;
		},
		initStage:function(stage){
			var p = Promise.resolve();
			p.then(function(){
				//创建场景管理器
				stage2d=new Stage2D(stage.stageWidth,stage.stageHeight);
				//启用场景逻辑
				stage2d.init();
			});
			return p;
		},
		initMap:function(){
			var p = jsonLoader.load("map.json");
				p.then(function(obj,resolve,reject){
					jsonmap = obj;
					unit = obj.unit;
					maxXUnit = Math.floor(jsonmap.width/unit);
					maxYUnit = Math.floor(jsonmap.height/unit);
					var layers = obj.layers;
					for(var i=0;i<layers.length;i++){
						var layer = layers[i];
						var points = layer.points;
						for(var j=0;j<points.length;j++){
							var point = points[j];
							var imgPoint = point.imgPoint;
							var rawPoint = point.point;
							
							var mc = new MovieClip2D(g.LOADED_IMGS[1]);
							mc.isPlay = 1;
							mc.x = (rawPoint[0]+0.5)*unit;//为什么要偏移0.5呢，MovieClip中的paint方法，会将坐标点translate到矩形的中心点然后才drawImage
							mc.y = (rawPoint[1]+0.5)*unit;
							mc.frameW = unit;
							mc.frameH = unit;
							mc.frameHeadX = imgPoint[0];
							mc.frameHeadY = imgPoint[1];
							stage2d.addChild(mc);
						}
					}
					resolve(1);
				});
				return p;
		},
		addEvent:function(){
			var eventObj1 = new Event2D();
			eventObj1.eventType = "mouseDown";
			eventObj1.callback = function(ele){
				ele.rotation = 30;
			};
			stage2d.addEventListener(eventObj1);
		},
		/**
		@param imgs 图片地址数组，用于引擎初始化图片
		*/
		regImgRes : function(imgs){
			//TODO
			imageAddress = imgs;
		},
		/**
		@param jsons json文件路径数组
		*/
		regJSONRes : function(jsons){
			//TODO
		},
		/**
		@param fn - 用户自定义启动函数，在引擎启动完毕之后，调用
		*/
		regCustomerBoot : function(fn){
			//TODO
			f = fn;
		},
	};
});