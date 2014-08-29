"use strict"
define(["engine/ajax","engine/Promise","engine/QuadFrame","engine/QuadData"],function(ajax,Promise,QuadFrame,QuadData){
	//<SubTexture name="fashi0000" x="206" y="340" width="47" height="93" frameX="-19" frameY="-5" frameWidth="70" frameHeight="103"/>
	var getSpiritFrame = function (item){
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
	};
	
	var __sort = function(items){
		//TODO
		return items;
	}
	/**
	@param doc -- xml document
	@param dc -- data container
	*/
	var parseSpiritXml = function (doc,dc,i){
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
	};

	var groupByName = function (group,frame){
		var names = group[0];
		var frameArrays = group[1];
		var idx = names.indexOf(frame.name);
		if(idx == -1){
			names.push(frame.name);
			frameArrays.push([]);
			idx = names.indexOf(frame.name);
		}
		frameArrays[idx].push(frame);
	};
	
	return {
		load : function(xmls){
				
				
				var ps = [];
				var dcs = [];
				xmls.forEach(function(d,i,a){
						var p = new Promise(function(resolve,reject){
							ajax.openURL("res/xml/"+d,
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
					var xmlLoaded = [];
					dcs.forEach(function(d,i,a){
						xmlLoaded = xmlLoaded.concat(d);
					});
					g.LOADED_XMLS = xmlLoaded;
				});
				},
				
	};
	
});