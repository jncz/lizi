"use strict"
define(["engine/globalScope"],function(g){
	var tempAudios = [];
	var createAudioElement = function(path,name){
		var audioAreaId = "ENGINE_AUDIO_ELEMENT_AREA";
		var area = $(audioAreaId);
		if(!area){
			area = document.createElement("div");
			area.setAttribute("id",audioAreaId);
			area.style.display = "none";
			document.body.appendChild(area);
		}
		var audioTag = document.createElement("audio");
		var prefix = "audio_element";
		audioTag.setAttribute("id",prefix+"__"+name);
		audioTag.setAttribute("src",path);
		area.appendChild(audioTag);
		
		g.aud[name] = {};
		g.aud[name].inst = audioTag;//
		g.aud[name].play = function(){
			var end = this.inst.ended;
			if(end){
				this.inst.play();//如果上次播放已经结束，则可以重新播放
			}else{
				//如果上次播放未结束，则创建新元素，由新元素播放，从而达到多重声音混响效果。
				var audioTagNew = document.createElement("audio");
				audioTagNew.setAttribute("src",path);
				area.appendChild(audioTagNew);
				tempAudios.push(audioTagNew);
				audioTagNew.play();
				audioTagNew.onended = function(){
					area.removeChild(audioTagNew);
					tempAudios.splice(this,1);
				};
			}
			
		};
		g.aud[name].pause = function(){
			this.inst.pause();
			var len = tempAudios.length;
			for(var i = 0;i<len;i++){
				tempAudios[i].pause();
			}
		};
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