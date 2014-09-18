"use strict"

var canvas;
var context;//canvas context
var unit;//元素的单位长度
var maxXUnit;//X方向最大单位个数
var maxYUnit;//Y方向最大单位个数
var jsonmap;//json地图全局对象
var stage2d;//舞台对象


define(["engine/ImgLoader","engine/JSONLoader","engine/XMLLoader","engine/Promise","engine/MovieClip",
		"engine/DisplayObject","engine/Event","engine/displayObjectContainer","engine/AudioLoader","engine/globalScope","engine/Constants"],
	function(loader,jsonLoader,xmlLoader,Promise,MovieClip2D,Stage2D,Event2D,container,audioLoader,g,C){
	var imageAddress = [];
	var audioAddress = [];
	var jsonpath = null;
	var f = function(){};//empty function
	var masklayer = null;
	
	var vw;//屏幕可视宽度visual width
	var vh;//屏幕可视高度visual height
	
	var createMovieClip = function(obj){
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
					var x = (rawPoint[0]+0.5)*unit;//为什么要偏移0.5呢，MovieClip中的paint方法，会将坐标点translate到矩形的中心点然后才drawImage
					var y = (rawPoint[1]+0.5)*unit;
					if(x > vw || y > vh){//如果地图比可视区域偏大， 则大的部分不被加入绘制列表中，改进性能
						continue;
					}
					var mc = new MovieClip2D(g.LOADED_IMGS[1]);
					mc.renderType = C.RENDER_STATIC;
					mc.x = x;
					mc.y = y;
					mc.frameW = unit;
					mc.frameH = unit;
					mc.frameHeadX = imgPoint[0];
					mc.frameHeadY = imgPoint[1];
					stage2d.addChild(mc,i);
				}
			}
	};
	/**
	@param v
	校验配置信息对象
	*/
	var validate = function(v){
		return v;
	};
	/**
	@param - gcfg 全局的配置对象
	@param - cfg 用户输入的配置对象
	用户输入的值覆盖全局默认的配置信息,只有全局定义了的属性才可以被赋值。 未定义的会被忽略
	*/
	var merge = function(gcfg,cfg){
		if(!cfg){
			return;
		}
		for(var a in cfg){
			if(typeof cfg[a] === "object" && gcfg[a]){//如果属性值依然为对象，并且全局配置里也存在，则进一步进行merge
				merge(gcfg[a],cfg[a]);
			}else if(Array.isArray(cfg[a]) && gcfg[a]){//如果是数组，则拷贝数组
				gcfg[a] = [].concat(cfg[a]);//新的数组
			}else{
				gcfg[a] = cfg[a];
			}
		}
	};
	return {
		boot:function(){
			this.initStage()
			.then(this.showLoading)
			.then(this.loadResource)
			.then(this.initMap)
			.then(this.startPaint)
			.then(this.hideLoading)
			.then(f);
		},
		showLoading:function(){
			var ele = document.createElement("div");
			masklayer = ele;
			ele.style.top = 0;
			ele.style.left = 0;
			ele.style.width = 100;
			ele.style.height = 100;
			ele.style.position = "absolute";
			ele.innerHTML = "Loading......";
			
			canvas.parentNode.appendChild(ele);
		},
		hideLoading:function(){
			masklayer.style.display = "none";
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
			canvas.width = jsonmap.width > vw?vw:jsonmap.width;//设置画布大小,根据客户端可视区域大小设置，如果可视区域比地图小，则按照可视区域设置宽高
			canvas.height = jsonmap.height > vh?vh:jsonmap.height;
			var p = Promise.resolve();
			stage2d.start();
			return p;
		},
		initStage:function(){
			vw = document.body.clientWidth;//visual width
			vh = document.body.clientHeight;//visual height
			var p = Promise.resolve();
			p.then(function(){
				canvas = $("mycanvas");
				context = canvas.getContext("2d");//set it as global var
				//创建场景管理器
				stage2d=new Stage2D();
				//启用场景逻辑
				stage2d.init();
			});
			return p;
		},
		
		initMap:function(){
			var p = jsonLoader.load(jsonpath).then(function(mapobj){
				createMovieClip(mapobj);
			});

			return p;
		},
		/**
		@param imgs 图片地址数组，用于引擎初始化图片
		*/
		regImgRes : function(imgs){
			imageAddress = imgs;
		},
		/**
		@param json json文件路径
		*/
		regJSONRes : function(json){
			jsonpath = json;
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
		/**
		@param cfg - 配置信息对象,格式：
		{
			audio : {
				enable : true / false,//是否enable音效
				echo : true / false,//是否启用混响,似乎效果不太好
			},
			opt : {
				regionPaint : true / false,//是否启用局部绘制优化，仅仅绘制变动的局部
			}
		}
		*/
		config : function(cfg){
			validate(cfg);//校验配置对象，需要的配置信息如果不对抛出错误
			merge(g.cfg,cfg);
		},
	};
});