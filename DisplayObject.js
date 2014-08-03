/**
该类用于总体绘制图像， 将添加进来的各种显示对象进行绘制，重绘
Note: 并不用于负责某个具体对象如何绘制
*/

var canvas;

var context;

//场景宽度
var stageWidth=1024;
 
//场景高度
var stageHeight=768;
//事件列表
var displayObjectList = new Array();

var eventList = [];

var EVENT_MOUSE_DOWN = "mouseDown";
var EVENT_MOUSE_UP = "mouseUp";
var EVENT_MOUSE_MOVE = "mouseMove";
var EVENT_KEY_DOWN = "keyDown";

function __initCanvas(){
	canvas = $("mycanvas");
	stageWidth = canvas.width;
	stageHeight = canvas.height;
	context = canvas.getContext("2d");
}

function Stage2D()
{
	var that;
    //初始化启动计时器
    this.init=function()
    {
		that = this;
		canvas.addEventListener("mouseup",this.stageMouseUp);
		canvas.addEventListener("mousedown",this.stageMouseDown);
		canvas.addEventListener("mousemove",this.stageMouseMove);
		document.addEventListener("keydown",this.stageKeyDown);
		//document.addEventListener("keyDown",this.stageKeyDown);
        setTimeout(paint,0);
    }
 
	this.fireEvent = function(e,eventType){
		//TODO
		if(isKeyEvent(eventType)){
			for(var j=0;j<eventList.length;j++)
			{
				if(eventList[j].eventType==eventType)
				{
					eventList[j].callback(e);
					return;
				}
			}
			return;
		}
		//因为最后添加的对象在最顶上,从画面理解,上层的内容会挡住下层的内容,所以我们的事件触发循序也应该是从显示列表的最后一位开始检测
        for(var i = displayObjectList.length-1;i>=0;i--){
            if(Math.abs(displayObjectList[i].x-e.pageX) <= displayObjectList[i].width/2 && Math.abs(displayObjectList[i].y-e.pageY) <= displayObjectList[i].height/2)
            {
                for(var j=0;j<eventList.length;j++)
                {
                    if(eventList[j].eventType==eventType)
                    {
                        //如果检测通过并且有相应的事件就回调事件模块中的函数然后把当前点击的对象通过回调函数传递出去,并且返回出去不再执行下一次的逻辑,这就好像上层的图像挡住了下层的对                        //象而导致你点不到
                        eventList[j].callback(displayObjectList[i]);
                        return;
                    }
                }
            }
        }
	}
	this.stageMouseDown = function(e){
		that.fireEvent(e,EVENT_MOUSE_DOWN);
	}
	
	this.stageMouseUp = function(e){
		that.fireEvent(e,EVENT_MOUSE_UP);
	}
	
	this.stageMouseMove = function(e){
		//that.fireEvent(e,EVENT_MOUSE_MOVE);
	}
	this.stageKeyDown = function(e){
		that.fireEvent(e,EVENT_KEY_DOWN);
	}
    //添加子对象
    this.addChild=function(child)
    {
        if(indexOf(child)==-1)
        {
            displayObjectList.push(child);
        }else
        {
            //错误修正
            displayObjectList.splice(displayObjectList.indexOf(child),1);
            displayObjectList.push(child);
        }
    }
 
    //删除子对象
    this.removeChild=function(child)
    {
        if(indexOf(child)!=-1)
        {
            displayObjectList.splice(child,1);
        }
    }
	
	this.addEventListener = function(eventObj){
		if(eventList.indexOf(eventObj) == -1){
			eventList.push(eventObj);
		}		
	}
	
	this.removeEventListener = function(eventObj){
		if(eventList.indexOf(eventObj) != -1){
			eventList.splice(eventObj,1);
		}		
	}
}

function indexOf(Object)
{
    for(var i = 0;i<displayObjectList.length;i++){  
        if(displayObjectList[i] == Object){  
           return i;  
         }  
    }  
    return -1;  
}

function paint()
{
    //清理画面
    context.clearRect(0,0,stageWidth,stageHeight);
 
    //重置画布的透明度
    context.globalAlpha=1;
 
    //循环遍历显示对象
    for(var i=0;i<displayObjectList.length;i++)
    {
        //调用显示对象的paint重绘方法
        displayObjectList[i].paint();
    }
 
    //设置计时器延迟为0
    setTimeout(paint,20);
}

//动画信息
function QuadData(){
	//动画名称
	this.name="";
	//动画片段
	this.quadFrameList;
}

function QuadFrame(){
	this.name = "";
	this.index = 0;
	this.x = 0;
	this.y = 0;
	this.w = 0;
	this.h = 0;
	this.frameX = 0;
	this.frameY = 0;
	this.frameW = 0;
	this.frameH = 0;
}