"use strict"
define(["engine/globalScope"],function(g){
	var tempAudios = [];
	var createAudioElement = function(path,name){
		if(g.cfg.audio.enable){//如果audio enable则创建audio元素
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
				if(!g.cfg.audio.echo){//如果不启用回响
					this.inst.play();//直接播放
				}else{//如果启用回响，则先判断当前音频是否已经播放结束，如果结束了，则用已存在的audio元素播放，减少audio元素的创建，减少文档的re-flow
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
				}
			};
			g.aud[name].pause = function(){
				this.inst.pause();
				var len = tempAudios.length;
				for(var i = 0;i<len;i++){
					tempAudios[i].pause();
				}
			};
		}else{//如果audio 没有enable，继续创建全局的audio对象，只是play,pause方法为空方法，inst属性为null。 这样保证，即使用户后期禁用了audio，以前通过g.aud.audioName.play()调用也不会出错。
			g.aud[name] = {};
			g.aud[name].inst = null;
			g.aud[name].play = function(){console.log("audio disabled");};
			g.aud[name].pause = function(){console.log("audio disabled");};
		}
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