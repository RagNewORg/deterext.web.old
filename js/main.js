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
