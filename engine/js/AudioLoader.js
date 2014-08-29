"use strict"
define(["engine/globalScope"],function(g){
	var createAudioElement = function(path,name){
		var area = $("ENGINE_AUDIO_ELEMENT_AREA");
		if(!area){
			area = document.createElement("div");
			area.style.display = "none";
			document.body.appendChild(area);
		}
		var audioTag = document.createElement("audio");
		var prefix = "audio_element";
		audioTag.setAttribute("id",prefix+"__"+name);
		audioTag.setAttribute("src",path);
		area.appendChild(audioTag);
		
		g.aud[name] = audioTag;
	};
	var loader = {
		/**
		@param audios - 为音频对象数组,格式为：[{url:url,name:name},..,..]
		这个name属性非常关键。 将来通过g.aud.name来引用音频对象，并操作对象，比如g.aud.name.play()即为播放名称为name的音频，g.aud.name.pause()为暂停名称为name的音频
		*/
		load : function(audios){
			audios = audios || [];
			var len = audios.length;
			for(var i=0;i<len;i++){
				var audioObj = audios[i];
				var path = audioObj.url;
				var name = audioObj.name;
				//TODO 将这些信息注册到页面中
				createAudioElement(path,name);
			}
		},
	};
	
	Object.freeze(loader);
	return loader;
});