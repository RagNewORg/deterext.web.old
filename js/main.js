function test(url){
    display = document.getElementById('attack-iframe');
    display.height = 720;
    display.width = 900;
    display.src = url;
}

document.getElementById('svg-test-button').onclick = function(){
    test('./js/testSvg.html');
};
document.getElementById('cache-test-button').onclick = function(){
    test('./js/testCache.html');
};
document.getElementById('script-test-button').onclick = function(){
    test('./js/ScriptParse.html');
};
document.getElementById('image-test-button').onclick = function(){
    test('./js/ImageDecode.html');
};
document.getElementById('image-async-test-button').onclick = function(){
    test('./js/ImageDecode_async.html');
};
document.getElementById('float-test-button').onclick = function(){
    test('./js/pixelStealing/testPS.html');
};
