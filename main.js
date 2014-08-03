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
    
	//initGround();
	
	addActorClip();
	//addActorClip();
	
	addMainActorClip();//主角，用户可控制的对象
	
	//addRandomClip(10);
	
	//addXMLClip();
	
	//addEvent();
	
	//initEvent();
}

function addEvent(){
	var eventObj1 = new Event2D();
	eventObj1.eventType = "mouseDown";
	eventObj1.callback = function(ele){
		ele.rotation = 30;
	};
	stage2d.addEventListener(eventObj1);
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
	var bg = new BackGround(imageLoaded[1]);
	//stage2d.addChild(bg);
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
	var mc = createMovementObj();//new MovementObject(imageLoaded[0]);
	mc.isPlay = 1;
	mc.x = stageWidth*Math.random();
	mc.y = stageHeight*Math.random();
	
	mc.totalFrames = 3;
	
	mc.moveDirection = [DIRECTION_LEFT,DIRECTION_RIGHT];
	
	stage2d.addChild(mc);
	
	mc.move();
}

function addMainActorClip(){
	var mc = createMovementObj();//new MovementObject(imageLoaded[0]);
	mc.isPlay = 1;
	mc.x = stageWidth*Math.random();
	mc.y = stageHeight*Math.random();
	
	mc.totalFrames = 3;
	
	mc.moveDirection = [DIRECTION_LEFT,DIRECTION_RIGHT];
	
	mc.faceRight = [0,1];
	mc.faceLeft = [0,2];
	mc.faceUp = [0,3];
	mc.faceDown = [0,0];
	
	stage2d.addChild(mc);
	
	mc.addEventListener("keyDown",function(e){
		var step = 2;
		if(goLeft(e)){
			if(actor.selectedDirection != DIRECTION_RIGHT){
				changeFace(mc,mc.faceRight);
				actor.selectedDirection == DIRECTION_RIGHT;
			}
			actor.x-=step;
		}else if(goRight(e)){
			if(actor.selectedDirection != DIRECTION_LEFT){
				changeFace(mc,mc.faceLeft);
				actor.selectedDirection == DIRECTION_LEFT;
			}
			actor.x+=step;
		}else if(goUp(e)){
			if(actor.selectedDirection != DIRECTION_UP){
				changeFace(mc,mc.faceUp);
				actor.selectedDirection == DIRECTION_UP;
			}
			actor.y-=step;
		}else if(goDown(e)){
			if(actor.selectedDirection != DIRECTION_DOWN){
				changeFace(mc,mc.faceDown);
				actor.selectedDirection == DIRECTION_DOWN;
			}
			actor.y+=step;
		}
	});
	
	regAsMainActor(mc);
}

function createMovementObj(){
	var obj = new MovementObject(imageLoaded[0]);
	extend(obj,new MovieClip2D());
	return obj;
}

function regAsMainActor(obj){
	actor = obj;
}

function changeFace(targetObj,face){
	targetObj.frameHeadX = face[0];
	targetObj.frameHeadY = face[1];
}