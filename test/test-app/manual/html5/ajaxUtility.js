
function doAjaxCall_Async_GET(){
	try{
		var xhrObj = new XMLHttpRequest();
		xhrObj.open('GET', "local:///manual/html5/local_ajax.htm", true); 
		
		xhrObj.onreadystatechange = function(){	
			if (xhrObj.readyState == 4) {
				if(xhrObj.responseText == 'Hello World')
					alert('PASS');
				else{
					alert('FAIL');
				}
			}
	    };
		xhrObj.send('');
	}catch(e) {
		alert(e);
	}
}

function doAjaxCall_Async_POST(){
	try{
		var xhrObj = new XMLHttpRequest();
		xhrObj.open('POST', "local:///manual/html5/local_ajax.htm", true); 
		
		xhrObj.onreadystatechange = function(){	
			if (xhrObj.readyState == 4) {
				if(xhrObj.responseText == 'Hello World')
					alert('PASS');
				else{
					alert('FAIL');
				}
			}
	    };
		xhrObj.send('');
	}catch(e) {
		alert(e);
	}
}

function doAjaxCall_Sync_GET(){
	try{
		var xhrObj = new XMLHttpRequest();
		xhrObj.open('GET', "local:///manual/html5/local_ajax.htm", false); 
		xhrObj.send('');
		alert(xhrObj.responseText);
		if(xhrObj.responseText == 'Hello World')
			alert('PASS');
		else
			alert('FAIL');
	}catch(e) {
		alert(e);
	}
}


function doAjaxCall_Sync_POST(){
	try{
		var xhrObj = new XMLHttpRequest();
		xhrObj.open('POST', "local:///manual/html5/local_ajax.htm", false); 
		xhrObj.send('');
		alert(xhrObj.responseText);
		if(xhrObj.responseText == 'Hello World')
			alert('PASS');
		else
			alert('FAIL');
	}catch(e) {
		alert(e);
	}
}

