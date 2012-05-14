function setLocal(id) {
  var select = document.getElementById(id);
  var power =  $("#"+id).val();
  localStorage[id] = power;
}

function checkAPI() {
	var my_api_key =  $("#api_key").val();
	if (my_api_key.length < 3) {
		my_api_key = localStorage["api_key"];
	}
	url="https://beaconinitiative.com/api/isvalid/"+my_api_key+"/";
	$.ajax({
		 type: "get",
		 url: url ,
		 dataType: "text",
		 data: {},
		 timeout: 5000,
		  success: function(request) {
		   if (request == '0') {
				alert("Your API key is invalid, please update to track achievements");
			} else if (request == '1') {
				localStorage["api_key"] = my_api_key;
			}
		  } // End success
	}); // End ajax method


  
}

// Saves options to localStorage.
function save_options() {
	setLocal("sense_facebook");
	setLocal("sense_google");
	setLocal("sense_twitter");
	setLocal("sense_youtube");
	setLocal("sense_4Chan");
	setLocal("sense_selector");
	setLocal("sense_color");
	checkAPI();
}



function restore_local(id) {
  var select = document.getElementById(id);
  if (!localStorage[id]) {
  	if (id == "sense_color") {
  		$("#"+id)[0].color.fromString('FFA23A');
  	} else {
  		$("#"+id).val("on");
  	}
  } else {
		if (id == "sense_color") {
			$("#"+id)[0].color.fromString(localStorage[id]);
		} else {
			$("#"+id).val(localStorage[id]);
		}
	}
  
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	restore_local("sense_facebook");
	restore_local("sense_google");
	restore_local("sense_twitter");
	restore_local("sense_youtube");
	restore_local("sense_4Chan");
	restore_local("sense_selector");
	restore_local("sense_color");
	restore_local("api_key");
	save_options();
}