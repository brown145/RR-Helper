// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForRR);

function checkForRR ( tabId, changeInfo, tab ) {
	if ( changeInfo.status === 'complete' ) {
		setTimeout(function(){
			chrome.tabs.getSelected(null, function (tab) {
		    	chrome.tabs.sendMessage(tab.id, {event: 'display'}, function (response) {
    				if ( typeof response != 'undefined' && response.rr_check ) {
    					chrome.pageAction.show(tabId);
    				}
    			});
			});
		}, 200);
	}
}
