var timesofsp = new Array();
var timeofsp = [];
var maxsize = 9;
var sizes = new Array();
var start;
var end;
var repeat = 95;
var current = 0;
var s;

var terminate = false;

var ticks = 0;
function tick(){
    if(terminate)return;
    ticks++;
    setTimeout(tick,1);
}
setTimeout(tick,1);

function imageDisplay()
{
    draw(sizes,timesofsp,'Image Decoding Time for Files with Different Sizes');
}

function doImageDecode(index)
{	
    s = document.createElement('img');
    start = ticks;
    s.src = "./" + index + "e5.png";
    s.onerror = function(){
        end = ticks;
        if(current < 15){
            current++;
            doImageDecode(index);
        }
        else if(current < repeat){
            current++;
            timeofsp.push(end-start);
            doImageDecode(index);
        }else{
            //timeofsp.sort(sortNumber);
            //timesofsp.push([index*1.2,timeofsp[Math.floor(timeofsp.length/2)]]);
            var sum = timeofsp.reduce(function(a, b) { return a + b; });
            var avg = sum / timeofsp.length;
            timesofsp.push([index*1.2,avg]);
            sizes.push(index);
            current = 0;
            timeofsp = [];
            imageDisplay();
            if(index < maxsize)doImageDecode(index+1);
        }
    };
    document.body.appendChild(s);
}

function imageDecode()
{
    timesofsp = new Array();
    doImageDecode(1);
}

function sortNumber(a,b) {
        return a - b;
}
