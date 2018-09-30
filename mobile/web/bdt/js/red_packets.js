// red_packets.js
var publishLocationId = "0";
var publishLocationType = "";
var from ="";
$(document).ready(function(){

});


function gotoRed_packets_fightluckHtml(index){
	var circleId = request('circle_id');
	if(circleId){
        window.location.href = "/pockets/red_packets_fightluck.html?type="+index+'&from='+request('from')+'&publishtype='+request('publishtype')+'&circle_id='+circleId;
	}else{
        window.location.href = "/pockets/red_packets_fightluck.html?type="+index+'&from='+request('from')+'&publishtype='+request('publishtype');
	}

}

function gotoRed_packets_recordHtml(){
	window.location.href = "/pockets/red_packets_record.html"+'?from='+request('from')+'&publishtype='+request('publishtype');
}