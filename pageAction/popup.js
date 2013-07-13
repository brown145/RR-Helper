(function() {
'use strict'
	var page_html = '',
		querystring_options = {
		'env' : {
			name : 'set environment',
			description: 'test configuration settings from other RR environments',
			radio_options : ['integration', 'recs']
		},
		'envCookie' : {
			name : 'set environment cookie',
			description: 'setting a cookie will preserve "set environment" between page requests',
			radio_options : ['session', 'remove']
		},
		'rad' : {
			name : 'enable rad',
			description: 'Enabled rad testing tool',
			radio_options : ['true']
		},
		'radLevel' : {
			name : 'set rad level',
			description: 'sets rad level',
			radio_options : ['4']
		},
		'forceDisplay' : {
			name : 'force display',
			description: 'force recommendations to display despite env config settings',
			radio_options : ['true']
		},
		'useDummyData' : {
			name : 'use dummy data',
			description: 'use random recommendations, ignoring behavioral data',
			radio_options : ['true']
		}
	};
	
	function send_selected () {
		var message = {};
		message.event = 'set_params';
		message.params = [];
		
		for(var id in querystring_options) {
			var value = '', current = querystring_options[id];
			
			if ( typeof current.selected !== 'undefined' ) {
				value = current.radio_options[current.selected] || '';
				message.params.push({key:'r3_'+id, value:value});
			}
		}
		
    	chrome.tabs.getSelected(null, function (tab) {
	    	chrome.tabs.sendMessage(tab.id, message, function (response) { });
		});
	}
	
	function window_close() {
		setTimeout(function() {
			window.close();
		}, 200);
	}
	
	function update_selected (id, index) {
		querystring_options[id].selected = index;
	}
	
	function attach_events() {
		document.body.addEventListener('click', function( evt ){
			if (evt.target.id.indexOf('str_') === 0){
				// update object to set current
				update_selected(evt.target.id.replace('str_',''), 0);
				// send message
				send_selected();
				window_close();
			} else if ( evt.target.id.indexOf('rdo_') === 0 ) {
				// update what is currently set
				update_selected(evt.target.name, evt.target.value);
			} else if ( evt.target.id === 'btn_reload' ) {
				// send message with current object
				send_selected();
				window_close();
			}
		});
	}
	
	function set_current ( hash ) {
		hash = hash.substring(hash.indexOf('?')+1);
		hash = hash.split('&');
		
		for(var i = 0; i < hash.length; i++ ){
			if(hash[i].indexOf('r3_') === 0){
				var values = hash[i].split('='),
					id = values[0].replace('r3_', ''),
					current = values[1];
					
				querystring_options[id].selected = querystring_options[id].radio_options.indexOf(current);
  			}
		}
	}
	
	function init( uri ) {
		set_current( uri );
		var x = 0;
	
		for(var id in querystring_options){
			var current = querystring_options[id];
			page_html += '<div id="' + id + '" ><strong id="str_' + id + x + '" >' + current.name + '</strong> - '+ current.description +'<div class="options">';
			page_html += '<input type="radio" checked="checked" name="'+ id +'" id="rdo_default' + x + '" value="" ><label for="rdo_default' + x + '">default</label>';
			
			for ( var i = 0; i < current.radio_options.length; i++ ) {
				var opt = current.radio_options[i],
					isSelected = Boolean( current.selected === i );
				
				page_html += '<input type="radio" '+ ((isSelected)?'checked=checked':'') +'" name="'+ id +'" id="rdo_'+ id + i + '" value="'+ i +'" ><label for="rdo_'+ id + i + '">' + opt + "</label>";
			}
			
			page_html += '</div></div>';
			x++;
		}
	
		page_html += '<button id="btn_reload">reload</button>';
	
		document.body.innerHTML = page_html;
		attach_events();
	}
	
	/**/
	chrome.tabs.getSelected(null, function (tab) {
		chrome.tabs.sendMessage(tab.id, {event: 'get_params'}, function ( response ) {
    		if ( typeof response != 'undefined' && response.uri ) {
    			init( response.uri );
			}
    	});
	});
	/**/
	
	//init('http://www.walmart.com/?&r3_env=integration&r3_useDummyData=true&r3_rad=true&r3_radLevel=4');
	
})();