var timesofsp = new Array();
var timeofsp = new Array();
var maxsize = 9;
var sizes = new Array();
var start;
var end;
var repeat = 15;
var current = 0;

var terminate = false;

var ticks = 0;
function tick(){
    if(terminate)return;
    ticks++;
    setTimeout(tick,1);
}
setTimeout(tick,1);

function scriptDisplay()
{
    draw(sizes,timesofsp,'Script Parsing Time for Files with Different Sizes');
}

function doScriptParse(index)
{	
    var s = document.createElement('script');

    start = ticks;

    document.body.appendChild(s);
    s.src = "./" + index + "e5.js";
    window.onerror = function(){
        end = ticks;
        duration = end - start;
        console.log(start, end);
        //console.log(end - start);
        if(current < 5){
            current++;
            doScriptParse(index);
        }
        else if(current < repeat){
            current++;
            timeofsp.push(duration);
            doScriptParse(index);
        }else{
            timeofsp.sort(sortNumber);
            res = timeofsp.reduce(function(a, b) { return a+b; }) / timeofsp.length;
            //res = timeofsp[Math.floor(timeofsp.length/2)];
            timesofsp.push([index*1.2,res]);
            
            timeofsp = [];
            sizes.push(index);
            current = 0;
            scriptDisplay();
            if(index < maxsize)doScriptParse(index+1);
            else terminate = true;
        }
    };
}

function scriptParse()
{
    timesofsp = new Array();
    doScriptParse(1);
}

function sortNumber(a,b) {
        return a - b;
}
