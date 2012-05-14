

var activeselection = "";
var harmony_processed = { "key": "keyed" };
var notbullytype = { "bullying": "not bullying", "not bullying": "bullying"};

var bullyforms = 0;

function getUser(text,orig,callback) {
	chrome.extension.sendRequest({id: "api_key"}, function(local) {
		postcontent(local,text,orig,callback);
	});
}

function getUserCorrection(text,bullytype) {
	chrome.extension.sendRequest({id: "api_key"}, function(local) {
		submitCorrectionAPI(text,local,bullytype);
	});
}




myfilter=function(node){
	if (node.tagName=="DIV" || node.tagName=="div" || node.tagName=="SPAN" || node.tagName=="span") {
		if (node.hasAttribute("class")) {
			for( var x = 0; x < node.attributes.length; x++ ) {
				if( node.attributes[x].nodeName.toLowerCase() == 'class' ) {
					if (node.attributes[x].nodeValue == 'mts uiAttachmentDesc translationEligibleUserAttachmentMessage') {
						return NodeFilter.FILTER_ACCEPT;
					} else if (node.attributes[x].nodeValue == 'messageBody') {
						return NodeFilter.FILTER_ACCEPT;
					}  else if (node.attributes[x].nodeValue == 'commentBody') {
						return NodeFilter.FILTER_ACCEPT;
					} else if (node.attributes[x].nodeValue == 'tlTxFe') {
						return NodeFilter.FILTER_ACCEPT;
					}
					
				}
			}		
		}
	}
	return NodeFilter.FILTER_SKIP
}

function scrollFunc(e) {
    if ( typeof scrollFunc.x == 'undefined' ) {
        scrollFunc.x=window.pageXOffset;
        scrollFunc.y=window.pageYOffset;
    }
    var diffX=scrollFunc.x-window.pageXOffset;
    var diffY=scrollFunc.y-window.pageYOffset;

    if( diffX<0 ) {
        // Scroll right
    } else if( diffX>0 ) {
        // Scroll left
    } else if( diffY<0 ) {
        breakitdown();
    } else {
        //breakitdown();
    }
    scrollFunc.x=window.pageXOffset;
    scrollFunc.y=window.pageYOffset;
}
window.onscroll=scrollFunc
breakitdown();

function hasBeenProcessed(noded) {
	return harmony_processed.hasOwnProperty(noded);
}

function scrapeFacebook(data) {
		var rootnode=document.getElementById("content")
		var walker=document.createTreeWalker(rootnode, NodeFilter.SHOW_ELEMENT, myfilter, false)
		while (walker.nextNode()) {
			if (!hasBeenProcessed(walker.currentNode.innerText)) {
				getUser(walker.currentNode.innerText,walker.currentNode.innerText,colorme);
				harmony_processed[walker.currentNode.innerText] = 'processed';
			}
		}
}

function scrapeGoogle(data) {
		$('.rXnUBd').each(function(index) {
			if (!hasBeenProcessed($(this).text())) {
				getUser($(this).text(),$(this).text(),colorme);
				harmony_processed[$(this).text()] = 'processed';
			}
		});
		$('.oX401d').each(function(index) {
			if (!hasBeenProcessed($(this).text())) {
				getUser($(this).text(),$(this).text(),colorme);
				harmony_processed[$(this).text()] = 'processed';
			}
		});
		$(".kH").each(function(index) {
			
			if (!hasBeenProcessed($(this).text())) {
				getUser($(this).text(),$(this).text(),colorme);
				harmony_processed[$(this).text()] = 'processed';
			}
		});
}

function scrapeTwitter(data) {
		$('.js-tweet-text').each(function(index) {
			if ($(this)[0].firstChild.nodeValue && !hasBeenProcessed($(this)[0].firstChild.nodeValue)) { 
				getUser($(this).text(),$(this)[0].firstChild.nodeValue,colorme);
				harmony_processed[$(this)[0].firstChild.nodeValue] = 'processed';
			}
		});
}

function scrapeYouTube(data) { 
		$('.comment-text').each(function(index) {
			var mytext = $(this).text().replace(/^@\S+\s+/, "");
			if (!hasBeenProcessed(mytext)) {
				getUser(mytext,mytext,colorme);
				harmony_processed[mytext] = 'processed';
			}
		});
}
function scrape4Chan(data) { 
		$('blockquote').each(function(index) {
			var mytext = $(this).text().replace(/>*\d+/, " ");
			if (!hasBeenProcessed(mytext)) {
				getUser(mytext,mytext,colorme);
				harmony_processed[mytext] = 'processed';
			}
		});
}

function postcontent(uid,text,orig,callback) {
	var negative = 0;
	var positive = 0;
	var reqarray = new Array();
	text = text.replace(/<[^>]+>/g, " ");
	text = text.replace(/http\S+/g, " ");
	text = text.replace(/\s+/g, " ");
	text = text.replace(/^\s+|\s+$/g, "");
	var to_score = text;
	var url = 'https://beaconinitiative.com/api/put/salience/';
	
	
	$.ajax({
	 type: "post",
	 url: url ,
	 dataType: "text",
	 data: {
	 'uid' : uid,
	 'mode' : 'auto',
	 'to_score' : to_score
	 },
	 timeout: 5000,
	  success: function(request) {
	   if (request.indexOf('not') < 0) {
			callback('neg '+orig);
		} else {
			callback('pos '+orig);
		} 
	  } // End success
	}); // End ajax method
};


function breakitdown() {
	if (location.href.indexOf('facebook.com') != -1) {
		chrome.extension.sendRequest({id: "sense_facebook"}, function(local) {
			if (local == 'on') {
				scrapeFacebook();
			} else {
				chrome.extension.sendRequest({action: "flameoff"});
			}
		});
	} else if (location.href.indexOf('plus.google.com') != -1) {
		chrome.extension.sendRequest({id: "sense_google"}, function(local) {
			if (local == 'on') {
				scrapeGoogle();
			} else {
				chrome.extension.sendRequest({action: "flameoff"});
			}
		});
	} else if (location.href.indexOf('twitter.com') != -1) {
		chrome.extension.sendRequest({id: "sense_twitter"}, function(local) {
			if (local == 'on') {
				scrapeTwitter();
			} else {
				chrome.extension.sendRequest({action: "flameoff"});
			}
		});
	} else if (location.href.indexOf('youtube.com') != -1) {
		chrome.extension.sendRequest({id: "sense_youtube"}, function(local) {
			if (local == 'on') {
				scrapeYouTube();
			} else {
				chrome.extension.sendRequest({action: "flameoff"});
			}
		});
	} else if (location.href.indexOf('4chan.org') != -1) {
		chrome.extension.sendRequest({id: "sense_4Chan"}, function(local) {
			if (local == 'on') {
				scrape4Chan();
			} else {
				chrome.extension.sendRequest({action: "flameoff"});
			}
		});
	}
}

function colorme(data) {
	chrome.extension.sendRequest({action: "flameon"});
	if (location.href.indexOf('facebook.com') != -1) {
		if (data.indexOf('neg') != -1) {
			var rootnode=document.getElementById("content");
			var walker=document.createTreeWalker(rootnode, NodeFilter.SHOW_ELEMENT, myfilter, false);
			while (walker.nextNode()) {
				if (walker.currentNode.innerText != null) {
					if (walker.currentNode.innerText.indexOf(data.substring(4)) != -1) {
						chrome.extension.sendRequest({id: "sense_color"}, function(local) {
							walker.currentNode.style.color="#"+local;
						});
						
						selectText(walker.currentNode);
						var imageset = 0;
						var child;
						break;
					} 
				}
			}
		} 
	}	
	else if (location.href.indexOf('plus.google.com') != -1) {
		if (data.indexOf('neg') != -1) {
			$('.rXnUBd:contains('+data.substring(4)+')').each(function(index) {
				var active_el = $(this)[index];
				chrome.extension.sendRequest({id: "sense_color"}, function(local) {
					active_el.style.color="#"+local;
				});
				selectText($(this)[0]);
			});
			$('.oX401d:contains('+data.substring(4)+')').each(function(index) {
				var active_el = $(this)[index];
				chrome.extension.sendRequest({id: "sense_color"}, function(local) {
					active_el.style.color="#"+local;
				});
				selectText($(this)[0]);
			});
			$('.kH:contains('+data.substring(4)+')').each(function(index) {
				var active_el = $(this)[index];
				chrome.extension.sendRequest({id: "sense_color"}, function(local) {
					active_el.style.color="#"+local;
				});
				selectText($(this)[0]);
			});
		}
	}
	else if (location.href.indexOf('twitter.com') != -1) {
		if (data.indexOf('neg') != -1) {
			$('.js-tweet-text').each(function(index) {
				if ($(this).text().indexOf(data.substring(4)) > -1) {
					var active_el = $(this)[0];
					chrome.extension.sendRequest({id: "sense_color"}, function(local) {
						active_el.style.color="#"+local;
					});
					selectTweet($(this)[0]);
				}
			});
		}
	}
	else if (location.href.indexOf('youtube.com') != -1) {
		if (data.indexOf('neg') != -1) {
			$('.comment-text:contains('+data.substring(4)+')').each(function(index) {
				var active_el = $(this)[index];
				chrome.extension.sendRequest({id: "sense_color"}, function(local) {
					active_el.style.color="#"+local;
				});
				selectText($(this)[0]);
			});
		}
	} else if (location.href.indexOf('4chan.org') != -1) {
		if (data.indexOf('neg') != -1) {
			$('blockquote:contains('+data.substring(4)+')').each(function(index) {
				var active_el = $(this)[index];
				chrome.extension.sendRequest({id: "sense_color"}, function(local) {
					active_el.style.color="#"+local;
				});
				selectText($(this)[0]);
			});
		}
	}
}

function selectTweet(element) {
	bullyforms = bullyforms+1;
    insertHtmlAfterTweet(element,'_not_bullying');
}

function selectText(element) {
	bullyforms = bullyforms+1;
    if (window.getSelection) { // moz, opera, webkit
        var selection = window.getSelection();            
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    chrome.extension.sendRequest({'action' : 'transferUrl','bullytype': '_not_bullying_'+bullyforms},insertHtmlAfterAutoSelection);
}

var eventsrc = "";

document.body.addEventListener(
  "mousedown", 
  function (e) {
   eventsrc = e.srcElement;
});
document.body.addEventListener(
  "mouseup", 
  function (e) {
  if (e.srcElement.type != 'image' 
  		&& e.srcElement.nodeName != 'INPUT' 
  		&& e.srcElement.nodeName != 'TEXTAREA' 
  		&& e.srcElement.nodeName != 'input' 
  		&& e.srcElement.nodeName != 'textarea'
  		&& e.srcElement.nodeName != 'FORM' 
  		&& e.srcElement.nodeName != 'form' ) {
   selection('bullying');   
   }

});
function submitCorrectionAPI(text,uid,bullytype) {	
	var negative = 0;
	var positive = 0;
	var reqarray = new Array();
	var orig = text;
	text = text.replace(/<[^>]+>/g, " ");
	text = text.replace(/http\S+/g, " ");
	text = text.replace(/\s+/g, " ");
	text = text.replace(/^\s+|\s+$/g, "");
	var to_score = text;
	var url = 'https://beaconinitiative.com/api/put/salience/';
	
	
	
	$.ajax({
	 type: "post",
	 url: url ,
	 dataType: "text",
	 data: {
	 'uid' : uid,
	 'mode' : 'manual',
	 'to_score' : to_score,
	 'model_label' : bullytype.replace(/_/g," ")
	 },
	 timeout: 5000,
	  success: function(request) {
	   if (request.indexOf('not') < 0) {
			alert('thanks');
		} else {
			alert('thanks');
		} 
	  } // End success
	}); // End ajax method


 }


function selection(bullytype) {
		chrome.extension.sendRequest({id: "sense_selector"}, function(local) {
			if (local == 'on') {
				if (window.getSelection().toString().length > 0) {
					$('.beacon_api_not_bullying').remove();
					$('.beacon_api_bullying').remove();
					chrome.extension.sendRequest({'action' : 'transferSelectUrl'},insertHtmlAroundSelection);
				}
			}
		});

}; 
 
function buildform(url,sel,bullytype) {

	var selectedText = sel.toString();
    selectedText = selectedText.replace(/<a.+?a>/g, " ");
    selectedText = selectedText.replace(/\s+/g, " ");

	var api_form = document.createElement('form');
	 api_form.setAttribute('class','beacon_api'+bullytype);
	 api_form.setAttribute('action','#');
	 api_form.setAttribute('style','margin: 0; padding: 0; display: inline;');
	 api_form.setAttribute('method','POST');
	 
	 
	 
	 var submit = document.createElement('input');
	 submit.setAttribute('type', 'image');
	 submit.setAttribute('class','beacon_api'+bullytype);
	 submit.setAttribute('style','width: 14px; height: 14px;');
	 submit.setAttribute('height','14px');
	 if (bullytype.indexOf('_bullying') == 0) {
	 	submit.setAttribute('src', chrome.extension.getURL("flame.png"));
	 } else {
	 	submit.setAttribute('src', chrome.extension.getURL("cool.png"));
	 }
	 //submit.setAttribute('class', 'beaconinitiative_api_submission');
	 submit.addEventListener(

		  "click", 

		  function (e) {
			e.preventDefault();		
			var to_score = selectedText;
			to_score = to_score.replace(/<a.+?a>/g, " ");
			to_score = to_score.replace(/\s+/g, " ");  
			getUserCorrection(to_score,bullytype.replace(/_/g," "));
		});   
    api_form.appendChild(submit);
 	
	return api_form;
}

function buildtweetform(element,bullytype) {
	var api_form = document.createElement('form');
	 api_form.setAttribute('class','beacon_api'+bullytype);
	 api_form.setAttribute('action','#');
	 api_form.setAttribute('style','margin: 0; padding: 0; display: inline;');
	 api_form.setAttribute('method','POST');
	 
	 
	 
	 var submit = document.createElement('input');
	 submit.setAttribute('type', 'image');
	 submit.setAttribute('class','beacon_api'+bullytype);
	 submit.setAttribute('style','width: 14px; height: 14px;');
	 submit.setAttribute('height','14px');
	 if (bullytype.indexOf('_bullying') == 0) {
	 	submit.setAttribute('src', chrome.extension.getURL("flame.png"));
	 } else {
	 	submit.setAttribute('src', chrome.extension.getURL("cool.png"));
	 }
	 //submit.setAttribute('class', 'beaconinitiative_api_submission');
	 submit.addEventListener(

		  "click", 

		  function (e) {
			e.preventDefault();		 
			var to_score = element.innerHTML;
			to_score = to_score.replace(/<a.+?a>/g, " ");
			to_score = to_score.replace(/\s+/g, " ");  
			getUserCorrection(to_score,bullytype.replace(/_/g," "));
		});   
    api_form.appendChild(submit);

	return api_form;
}

function insertHtmlAroundSelection(url) {
            var sel, range, node;
                sel = window.getSelection();
                text = sel.toString();
                if (activeselection == text) {
                	return;
                } else {
                	activeselection = text;
                }
                if (sel.getRangeAt && sel.rangeCount && text.length > 0) {
                    range = window.getSelection().getRangeAt(0); 
                    range.collapse(false);

                    // Range.createContextualFragment() would be useful here but is
                    // non-standard and not supported in all browsers (IE9, for one)
                    var el = document.createElement("div");
                    
                    el.appendChild(buildform(url,sel,"_bullying"));
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                }
                if (sel.getRangeAt && sel.rangeCount && text.length > 0) {
                    range = window.getSelection().getRangeAt(0);
                    range.collapse(false);

                    // Range.createContextualFragment() would be useful here but is
                    // non-standard and not supported in all browsers (IE9, for one)
                    var el = document.createElement("div");
                    
                    el.appendChild(buildform(url,sel,"_not_bullying"));
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                }
        }

function insertHtmlAfterAutoSelection(url) {
            var sel, range, node;
            var bullytype = url.substring(url.indexOf('BEACONINITIATIVEBREAK')+21);
            url = url.replace(/BEACONINITIATIVEBREAK.*/,'');
                sel = window.getSelection();
                text = sel.toString();
                if (activeselection == text) {
                	return;
                } else {
                	activeselection = text;
                }

                if (sel.getRangeAt && sel.rangeCount && text.length > 0) {
                    range = window.getSelection().getRangeAt(0);
                    range.collapse(false);

                    // Range.createContextualFragment() would be useful here but is
                    // non-standard and not supported in all browsers (IE9, for one)
                    var el = document.createElement("div");
                    
                    el.appendChild(buildform(url,range,bullytype));
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                }
				sel.removeAllRanges();
        }
        
function insertHtmlAfterTweet(element,bullytype) {
	element.appendChild(buildtweetform(element,bullytype));
}




