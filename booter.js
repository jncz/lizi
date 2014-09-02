"use strict"

var context;//canvas context
var unit;//Ԫ�صĵ�λ����
var maxXUnit;//X�������λ����
var maxYUnit;//Y�������λ����
var jsonmap;//json��ͼȫ�ֶ���
var stage2d;//��̨����


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
			//var idx = container.add();//����һ�²�
			for(var i=0;i<layers.length;i++){
				var layer = layers[i];
				var points = layer.points;
				for(var j=0;j<points.length;j++){
					var point = points[j];
					var imgPoint = point.imgPoint;
					var rawPoint = point.point;
					
					var mc = new MovieClip2D(g.LOADED_IMGS[1]);
					mc.isPlay = 1;
					mc.x = (rawPoint[0]+0.5)*unit;//ΪʲôҪƫ��0.5�أ�MovieClip�е�paint�������Ὣ�����translate�����ε����ĵ�Ȼ���drawImage
					mc.y = (rawPoint[1]+0.5)*unit;
					mc.frameW = unit;
					mc.frameH = unit;
					mc.frameHeadX = imgPoint[0];
					mc.frameHeadY = imgPoint[1];
					stage2d.addChild(mc,idx);
				}
			}
	};
	/**
	@param v
	У��������Ϣ����
	*/
	var validate = function(v){
		return v;
	};
	/**
	@param - gcfg ȫ�ֵ����ö���
	@param - cfg �û���������ö���
	�û������ֵ����ȫ��Ĭ�ϵ�������Ϣ,ֻ��ȫ�ֶ����˵����Բſ��Ա���ֵ�� δ����Ļᱻ����
	*/
	var merge = function(gcfg,cfg){
		if(!cfg){
			return;
		}
		for(var a in cfg){
			if(typeof cfg[a] === "object" && gcfg[a]){//�������ֵ��ȻΪ���󣬲���ȫ��������Ҳ���ڣ����һ������merge
				merge(gcfg[a],cfg[a]);
			}else if(Array.isArray(cfg[a]) && gcfg[a]){//��������飬�򿽱�����
				gcfg[a] = [].concat(cfg[a]);//�µ�����
			}else{
				gcfg[a] = cfg[a];
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
				//��������������
				stage2d=new Stage2D(stage.stageWidth,stage.stageHeight);
				//���ó����߼�
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
			};
			stage2d.addEventListener(eventObj1);
		},
		/**
		@param imgs ͼƬ��ַ���飬���������ʼ��ͼƬ
		*/
		regImgRes : function(imgs){
			imageAddress = imgs;
		},
		/**
		@param jsons json�ļ�·������
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
		@param fn - �û��Զ��������������������������֮�󣬵���
		*/
		regCustomerBoot : function(fn){
			f = fn;
		},
		regAudioRes : function(audios){
			audioAddress = audios;
		},
		/**
		@param cfg - ������Ϣ����,��ʽ��
		{
			audio : {
				enable : true / false,//�Ƿ�enable��Ч
				echo : true / false,//�Ƿ����û���,�ƺ�Ч����̫��
			}
		}
		*/
		config : function(cfg){
			validate(cfg);//У�����ö�����Ҫ��������Ϣ��������׳�����
			merge(g.cfg,cfg);
		},
	};
});