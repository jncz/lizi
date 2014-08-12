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
    
	initGround().then(function(){
		addActorClip();
		addActorClip();
		addActorClip();
		addActorClip();
		
		addMainActorClip();
	},function(e){
		console.log(e);
	});
	
	//addActorClip();
	//addActorClip();
	//addActorClip();
	//addActorClip();
	
	//addMainActorClip();//主角，用户可控制的对象
	
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
	var p = jsonLoader.load("map.json");
	p.then(function(obj,resolve,reject){
		console.log(obj);
		var unit = obj.unit;
		var layers = obj.layers;
		for(var i=0;i<layers.length;i++){
			var layer = layers[i];
			var points = layer.points;
			for(var j=0;j<points.length;j++){
				var point = points[j];
				var imgPoint = point.imgPoint;
				var rawPoint = point.point;
				
				var mc = new MovieClip2D(imageLoaded[1]);
				mc.isPlay = 1;
				mc.x = (rawPoint[0]+0.5)*unit;//为什么要偏移0.5呢，MovieClip中的paint方法，会将坐标点translate到矩形的中心点然后才drawImage
				mc.y = (rawPoint[1]+0.5)*unit;
				mc.frameW = unit;
				mc.frameH = unit;
				mc.frameHeadX = imgPoint[0];
				mc.frameHeadY = imgPoint[1];
				stage2d.addChild(mc);
			}
		}
		resolve(1);
	});
	return p;
	//var bg = new BackGround(imageLoaded[1]);
	//stage2d.addChild(bg);
	/**
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
	*/
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
	mc.ifReverse = false;
	
	mc.moveDirection = [DIRECTION_LEFT,DIRECTION_RIGHT];
	
	mc.frameHeadX = 3;
	mc.frameHeadY = 0;
	mc.faceLeft = [3,1];
	mc.faceRight = [3,2];
	mc.faceUp = [3,3];
	mc.faceDown = [3,0];
	
	stage2d.addChild(mc);
	
	mc.addEventListener("keyDown",function(e){
		var step = 2;
		mc.movement(getDirection(e),step);
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