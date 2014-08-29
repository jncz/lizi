"use strict"

var context;//canvas context
var unit;//元素的单位长度
var maxXUnit;//X方向最大单位个数
var maxYUnit;//Y方向最大单位个数
var jsonmap;//json地图全局对象
var stage2d;//舞台对象


define(["engine/ImgLoader","engine/JSONLoader","engine/XMLLoader","engine/Promise","engine/MovieClip",
		"engine/DisplayObject","engine/Event","engine/displayObjectContainer","engine/AudioLoader","engine/globalScope"],
	function(loader,jsonLoader,xmlLoader,Promise,MovieClip2D,Stage2D,Event2D,container,audioLoader,g){
	var imageAddress = [];
	var audioAddress = [];
	var jsonmaps = [];
	var f = function(){};//empty function
	
	var createMovieClip = function(obj,idx){
			jsonmap = obj;
			unit = obj.unit;
			maxXUnit = Math.floor(jsonmap.width/unit);
			maxYUnit = Math.floor(jsonmap.height/unit);
			var layers = obj.layers;
			//var idx = container.add();//增加一新层
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
					stage2d.addChild(mc,idx);
				}
			}
	};
	return {
		boot:function(){
			this.initCanvas()
			.then(this.initStage)
			.then(this.loadResource)
			.then(this.initMap)
			.then(this.startPaint)
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
			}).then(function(){
				audioLoader.load(audioAddress);
			});
			return p;
		},
		startPaint : function(){
			var p = Promise.resolve();
			stage2d.start();
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
			var ps = [];
			jsonmaps.forEach(function(d,i,a){
				var p = jsonLoader.load(d).then(function(mapobj){
					createMovieClip(mapobj,i);
				});
				ps.push(p);
			});
			return Promise.all(ps);
		},
		addEvent:function(){
			var eventObj1 = new Event2D();
			eventObj1.eventType = "keyDown";
			eventObj1.callback = function(ele){
				ele.rotation = 30;
				g.aud.test1.currentTime = 0;
				g.aud.test1.play();
				g.aud.test2.currentTime = 0;
				g.aud.test2.play();
			};
			stage2d.addEventListener(eventObj1);
		},
		/**
		@param imgs 图片地址数组，用于引擎初始化图片
		*/
		regImgRes : function(imgs){
			imageAddress = imgs;
		},
		/**
		@param jsons json文件路径数组
		*/
		regJSONRes : function(jsons){
			if(Array.isArray(jsons)){
				for(var i = 0;i<jsons.length;i++){
					var json = jsons[i];
					var idx = jsonmaps.indexOf(json);
					if(idx == -1){
						jsonmaps.push(json);
					}
				}
			}else{
				var idx = jsonmaps.indexOf(jsons);
				if(idx == -1){
					jsonmaps.push(jsons);
				}
			}
		},
		/**
		@param fn - 用户自定义启动函数，在引擎启动完毕之后，调用
		*/
		regCustomerBoot : function(fn){
			f = fn;
		},
		regAudioRes : function(audios){
			audioAddress = audios;
		},
	};
});