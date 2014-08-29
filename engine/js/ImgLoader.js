"use strict"
define(["engine/baseResourceLoader"],function(loader){
	var imageLoaded = [];
	var imageAddress = [];
	
	var __getImageByName = function(name){
			var len = imageLoaded.length;
			for(var i=0;i<len;i++){
				if(imageLoaded[i].name == name){
					return imageLoaded[i];
				}
			}
			throw new Error("Image sources is not matched");
	};
	
	return {
		/**
		图片加载器
		@param imgs 图片地址数组
		*/
		load:function(imgs){
			imageAddress = imgs;
			var p = loader.load(imgs,this.__loadImage);
			p.then(this.__sortImages);
			return p;
		},
		/**
		图片加载
		*/
		__loadImage : function(name){
			var p = new Promise(function(resolve,reject){
				var image=new Image();
				//输入载图图像的地址
				image.src="res/images/"+name;
				image.name = name;
				image.onload=function(){
					if(image.complete==true){
						imageLoaded.push(image);
						resolve(1);
					}else{
						reject(-1);
					}
				};
			});
			return p;
		},
		
		/**
		图片排序
		*/
		__sortImages : function(){
			var images = [];
			imageAddress.forEach(function(d,idx,a){
				var image = __getImageByName(d);
				images.push(image);
			});
			g.LOADED_IMGS = images;
		},
	};
});