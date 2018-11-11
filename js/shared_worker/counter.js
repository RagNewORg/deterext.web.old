self.onmessage = function(event){
	var buffer = event.data;
	var arr = new Uint32Array(buffer);

	//while(1){
	for(i=0; i < 1e7; i++){
		//Atomics.add(arr, 0, 1);
		arr[0]++;
	}
}
