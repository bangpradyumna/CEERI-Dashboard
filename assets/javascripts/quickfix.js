$(function() {
	window.dateRanges = {
			"159" : {
				id: "159",
				name: "Madras Medical College",
				city: "Chennai",
				start: "03/01/2012",
				end: "01/01/2013"
			},
			"733" : {
				id: "733",
				name: "Sanath Nagar",
				city: "Hyderabad",
				start: "03/01/2012",
				end: "29/12/2012"
			},
			"348" : {
				id: "348",
				name: "Kasba",
				city: "Kolkata",
				start: "07/02/2012",
				end: "29/05/2012"
			},
			"391" : {
				id: "391",
				name: "Dabauli",
				city: "Kanpur",
				start: "04/07/2012",
				end: "30/06/2013"
			},
			"728" : {
				id: "728",
				name: "DTU, New Delhi",
				city: "Delhi",
				start: "02/04/2014",
				end: "01/01/2015"
			},
			"729" : {
				id: "729",
				name: "ITO",
				city: "Delhi",
				start: "02/04/2014",
				end: "26/12/2014"
			},
			"730" : {
				id: "730",
				name: "Dwarka",
				city: "Delhi",
				start: "01/01/2014",
				end: "01/01/2015"
			},
			"731" : {
				id: "731",
				name: "Shadipur",
				city: "Delhi",
				start: "01/01/2014",
				end: "19/12/2014"
			},
			"732" : {
				id: "732",
				name: "Dilshad Garden",
				city: "Delhi",
				start: "01/01/2014",
				end: "01/01/2015"
			},
	};
	
	$tbody = $("#data-availability tbody");
	
	for(i in window.dateRanges) {
		$tr = $("<tr></tr>");
		$tr.append($('<td class="col-md-3"></td>').html(window.dateRanges[i]["name"]));
		$tr.append($('<td class="col-md-3"></td>').html(window.dateRanges[i]["city"]));
		$tr.append($('<td class="col-md-3"></td>').html(window.dateRanges[i]["start"]));
		$tr.append($('<td class="col-md-3"></td>').html(window.dateRanges[i]["end"]));
		$tbody.append($tr);
	}
	
	window.quickfix = function(id) {
		if(window.dateRanges[id] && window.dateRanges[id]["end"]) {
			$("#date input").val(window.dateRanges[id]["end"]);
		}
	}
});

