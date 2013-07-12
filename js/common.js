chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	if ( request.event === 'display' ) {
		sendResponse({rr_check: hasRRContent()});
	} else if  ( request.event === 'set_params' ) {
		reload_with( request.params );
	} else if (request.event === 'get_params' ) {
    	sendResponse( {uri: document.location.href} );
    }
});

function hasRRContent () {
	var location = document.location.host;
	if ( location.indexOf('.richrelevance.com') > 0 ) {
		return false;
	}

	for( var i=0; i<document.scripts.length; i++ ){
		var s = document.scripts[i];
		if( typeof s.src !== undefined && s.src !== '' && s.src.indexOf( 'richrelevance.com' ) > 0 ) {
			return true;
    	}
    }

	return false;
}

function reload_with( params ) {
	var url = document.location.href;
	
	for (var i=0; i < params.length; i++) {
		url = updateQueryStringParameter(url, params[i].key, params[i].value);
	}
	
	window.location = url;
}


//TODO: rewrite without RegEx
function updateQueryStringParameter(uri, key, value) {
  	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
	  	separator = uri.indexOf('?') !== -1 ? "&" : "?";
  	
  	if (uri.match(re)) {
  		if (typeof value != 'undefined' && value !== '') {
    		return uri.replace(re, '$1' + key + "=" + value + '$2');
    	} else {
    		return uri.replace(re, '$1' + '$2');
    	}
  	}
  	else {
    	return uri + separator + key + "=" + value;
  	}
}
