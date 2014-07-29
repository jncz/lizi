var imageAddress = undefined;//["Actor1.png","map.png","donghua.png","eff.png","1.png"];
var imageLoaded = undefined;

var xmlAddress = undefined;//["spirit.xml","eff.xml"];
var xmlLoaded = undefined;

var resLoader = {};
var imgLoader = {};
var xmlLoader = {};

/**
@param imgs 传入图片路径数组
@param xmls 传入XML路径数组
*/
resLoader.load = function(imgs,xmls){
	var a = imgLoader.load(imgs);
	var b = xmlLoader.load(xmls);
	
	return Promise.all([a,b]);
};
/**
图片加载器
@param imgs 图片地址数组
*/
imgLoader.load = function(imgs){
	imageLoaded = [];
	imageAddress = imgs;
	return load(imgs,__loadImage).then(__sortImages);
};
/**
图片加载
*/
__loadImage = function(name){
	var promise = new Promise(function(resolve,reject){
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
	return promise;
};
/**
图片排序
*/
__sortImages = function(){
	var images = [];
	imageAddress.forEach(function(d,idx,a){
		var image = __getImageByName(d);
		images.push(image);
	});
	imageLoaded = images;
};

__getImageByName = function(name){
	var len = imageLoaded.length;
	for(var i=0;i<len;i++){
		if(imageLoaded[i].name == name){
			return imageLoaded[i];
		}
	}
	throw new Error("Image sources is not matched");
};

xmlLoader.load = function(xmls){
	xmlAddress = xmls;
	xmlLoaded = [];
	
	var ps = [];
	var dcs = [];
	xmls.forEach(function(d,i,a){
			var p = new Promise(function(resolve,reject){
				openURL("res/xml/"+d,
					function(http){
						var xml = http.responseXML;
						parseSpiritXml(xml,dcs,i);
						resolve(1);
					},
					function(){
						reject(-1);
					},
					{"Accecpt":"application/xml","Content-Type":"application/xml"},
					"GET",
					null,
					true);
			});
			ps.push(p);
		});
	
	
	return Promise.all(ps).then(function(resolve,reject){
		dcs.forEach(function(d,i,a){
			xmlLoaded = xmlLoaded.concat(d);
		});
	});
	
	
	
};

//<SubTexture name="fashi0000" x="206" y="340" width="47" height="93" frameX="-19" frameY="-5" frameWidth="70" frameHeight="103"/>
function getSpiritFrame(item){
	var frame = new QuadFrame();
	var name = item.getAttribute("name");
	frame.name = name.substr(0,name.length-4);
	frame.index = name.substr(name.length-4);
	frame.x = item.getAttribute("x");
	frame.y = item.getAttribute("y");
	frame.w = item.getAttribute("width");
	frame.h = item.getAttribute("height");
	frame.frameX = item.getAttribute("frameX");
	frame.frameY = item.getAttribute("frameY");
	frame.frameW = item.getAttribute("frameWidth");
	frame.frameH = item.getAttribute("frameHeight");
	
	return frame;
}
/**
@param doc -- xml document
@param dc -- data container
*/
function parseSpiritXml(doc,dc,i){
	dc[i] = [];
	var dcobj = dc[i];
	var items = doc.childNodes.item(0).getElementsByTagName("SubTexture");
	var group = [[],[]];//[["name1","name2"],[[],[]]] 数组结构如此。第一个元素也为一个数组类型，记录了动画组的名称，第二个元素也为数组，而且该数组内部的元素也为数组，记录了动画组的帧信息
	var len = items.length;
	for(var i=0;i<len;i++){
		var frame = getSpiritFrame(items[i]);
		groupByName(group,frame);
	}
	
	var names = group[0];
	var frameArrays = group[1];
	
	names.forEach(function(d,i,a){
		var quadData = new QuadData();
		quadData.name = d;
		quadData.quadFrameList = __sort(frameArrays[i]);
		dcobj.push(quadData);
	});
}

function groupByName(group,frame){
	var names = group[0];
	var frameArrays = group[1];
	var idx = names.indexOf(frame.name);
	if(idx == -1){
		names.push(frame.name);
		frameArrays.push([]);
		idx = names.indexOf(frame.name);
	}
	frameArrays[idx].push(frame);
}