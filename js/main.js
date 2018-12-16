function test(url){
    display = document.getElementById('attack-iframe');
    display.height = 720;
    display.width = 900;
    display.src = url;
}

document.getElementById('svg-test-button').onclick = function(){
    test('./js/svgFiltering/testSvg.html');
};
document.getElementById('cache-test-button').onclick = function(){
    test('./js/testCache.html');
};
document.getElementById('script-test-button').onclick = function(){
    test('./js/scriptParsing/ScriptParse.html');
};
document.getElementById('image-test-button').onclick = function(){
    test('./js/imgDecoding/ImageDecode.html');
};
document.getElementById('script-async-test-button').onclick = function(){
    test('./js/scriptParsing/ScriptParse_clock.html');
};
document.getElementById('image-async-test-button').onclick = function(){
    test('./js/imgDecoding/ImageDecode_async.html');
};
document.getElementById('float-test-button').onclick = function(){
    test('./js/pixelStealing/testPS.html');
};
document.getElementById('loopscan-test-button').onclick = function(){
    test('./js/loopscan.html');
};
document.getElementById('loopscan-worker-test-button').onclick = function(){
    test('./js/loopscan_worker.html');
};
document.getElementById('paper-demo-button').onclick = function(){
    test('./js/paper_demo/paper_demo.html');
};
document.getElementById('css-test-button').onclick = function(){
    test('./js/animation.html');
};
document.getElementById('shared-buffer-test-button').onclick = function(){
    test('./js/scriptParsing/ScriptParse_shared_buffer.html');
};
document.getElementById('webvtt-test-button').onclick = function(){
    test('./webvtt/attack.html');
};
