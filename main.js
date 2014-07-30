/**
用于启动动画
*/
var imageAddress = ["Actor1.png","map.png","donghua.png","eff.png"];

var xmlAddress = ["spirit.xml","eff.xml"];

this.loadResource = function(){
	resLoader.load(imageAddress,xmlAddress).then(init);
};

window.onload=function(){
	__initCanvas();
	loadResource();
}

var direction;
//定义场景管理器
var stage2d;
//初始化函数
function init () {
    //创建场景管理器
    stage2d=new Stage2D();
	
    //启用场景逻辑
    stage2d.init();
    
	initGround();
	
	addActorClip();
	//addRandomClip(10);
	
	//addXMLClip();
	
	addEvent();
	
	initEvent();
}

function addEvent(){
	var eventObj1 = new Event2D();
	eventObj1.eventType = "mouseDown";
	eventObj1.callback = function(ele){
		ele.rotation = 30;
	};
	stage2d.addEventListener(eventObj1);
	
	var eventObj2 = new Event2D();
	eventObj2.eventType = "keyDowns";
	eventObj2.callback = function(e){
		//actor.rotation = 30;
		console.log(e.keyCode);
		if(goLeft(e)){
			actor.x-=5;
		}else if(goRight(e)){
			actor.x+=5;
		}else if(goFire(e)){
			//fire
			fire();
		}
	};
	
	stage2d.addEventListener(eventObj2);
	
	var eventObj3 = new Event2D();
	eventObj3.eventType = "keyDown";
	eventObj3.callback = function(e){
		console.log(e.keyCode);
		if(goLeft(e)){
			if(direction != "left"){
				actor.frameHeadX = 0;
				actor.frameHeadY = 1;
				direction = "left";
			}
			actor.x-=5;
		}else if(goRight(e)){
			if(direction != "right"){
				actor.frameHeadX = 0;
				actor.frameHeadY = 2;
				direction = "right";
			}
			actor.x+=5;
		}else if(goUp(e)){
			if(direction != "up"){
				actor.frameHeadX = 0;
				actor.frameHeadY = 3;
				direction = "up";
			}
			actor.y-=5;
		}else if(goDown(e)){
			if(direction != "down"){
				actor.frameHeadX = 0;
				actor.frameHeadY = 0;
				direction = "down";
			}
			actor.y+=5;
		}
	};
	
	stage2d.addEventListener(eventObj3);
}

function fire(){
	var zidan = xmlLoaded[3];
	var mc5 = new MovieClip2D(imageLoaded[3],zidan.quadFrameList);
    mc5.isPlay=2;
    mc5.x=actor.x;
    mc5.y=actor.y;
	mc5.blend="lighter";
	mc5.move(function(){
			this.x-=3;
	});
    stage2d.addChild(mc5);
}
function addXMLClip(){
	var fashi = xmlLoaded[0];
	var mc = new MovieClip2D(imageLoaded[2],fashi.quadFrameList);
    mc.isPlay=2;
    mc.x=300;
    mc.y=300;
    stage2d.addChild(mc);
	actor = mc;
	
	var niao = xmlLoaded[1];
	var mc2 = new MovieClip2D(imageLoaded[2],niao.quadFrameList);
    mc2.isPlay=2;
    mc2.x=200;
    mc2.y=300;
    stage2d.addChild(mc2);
	
	var mc3 = new MovieClip2D(imageLoaded[2],niao.quadFrameList);
    mc3.isPlay=2;
    mc3.x=200;
    mc3.y=200;
    stage2d.addChild(mc3);
	
	var mc4 = new MovieClip2D(imageLoaded[2],niao.quadFrameList);
    mc4.isPlay=2;
    mc4.x=200;
    mc4.y=400;
    stage2d.addChild(mc4);
	
	var zidan = xmlLoaded[3];
	var mc5 = new MovieClip2D(imageLoaded[3],zidan.quadFrameList);
    mc5.isPlay=2;
    mc5.x=200;
    mc5.y=500;
	mc5.blend="lighter";
	mc5.move(function(){
		
	});
    stage2d.addChild(mc5);
	
}
function initGround(){
	for(var i=0;i<40;i++){
		for(var j=0;j<40;j++){
			var mc = new MovieClip2D(imageLoaded[1]);
			mc.isPlay = 1;
			mc.x = j*32;
			mc.y = i*32;
			mc.frameW = 32;
			mc.frameH = 32;
			mc.mcX = 0;
			mc.mcY = 0;
			stage2d.addChild(mc);
		}
	}
}
function addRandomClip(objSize){
	for(var i=0;i<objSize;i++){
		var mc = new MovieClip2D(imageLoaded[0]);
		mc.isPlay = 1;
		mc.x = stageWidth*Math.random();
		mc.y = stageHeight*Math.random();
		
		mc.frameW = 32;
		mc.frameH = 32;
		
		mc.frameHeadX = Math.floor(Math.random()*4)*3;
		mc.frameHeadY = Math.floor(Math.random()*8);
		
		mc.totalFrames = 3;
		
		stage2d.addChild(mc);
	}
}

function addActorClip(){
	var mc = new MovieClip2D(imageLoaded[0]);
	mc.isPlay = 1;
	mc.x = stageWidth*Math.random();
	mc.y = stageHeight*Math.random();
	
	mc.frameW = 32;
	mc.frameH = 32;
	
	mc.frameHeadX = 0;
	mc.frameHeadY = 0;
	
	mc.totalFrames = 3;
	
	stage2d.addChild(mc);
	
	actor = mc;
}

