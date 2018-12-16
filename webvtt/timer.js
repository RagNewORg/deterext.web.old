function get_time(){

	console.log("get_time");
	t_t = document.getElementById("myVideo").textTracks[0];
	//console.log(t_t);
	//console.log(t_t.activeCues[0].id * 0.1);
	res = t_t.activeCues[0].id * 0.001;
	console.log(res);
	return res;
}

function start_clock(){
	v = document.getElementById("video");
	console.log(v);
	var playPromise = v.play();
	if (playPromise !== undefined) {
    		playPromise.then(_ => {
			setTimeout(get_time, 2000);
		})
    		.catch(error => {
		});
	}
}
