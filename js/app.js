// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
	$('#search').val('');
    var mapElem = document.getElementById('map');
    var center = {lat: 47.6, lng: -122.3};
    var markers = [];
    var cameras;
    var infoWin = new google.maps.InfoWindow;
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });
	$("#search").bind("search keyup", function() {
		var search = $('#search').val();
		for (var i = 0; i < cameras.length; i++) {
			if (cameras[i].cameralabel.toLowerCase().indexOf(search.toLowerCase()) != -1) {
				markers[i].setMap(map);
			} else {
				markers[i].setMap(null);
			}
		}
	});
	
	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			cameras = data;

			data.forEach(function(camera) {
				var newMarker = new google.maps.Marker({
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					map: map,
					animation: google.maps.Animation.DROP
				});
				markers.push(newMarker);

				google.maps.event.addListener(newMarker, "click", function() {
					map.panTo(this.getPosition());

					for (var index = 0; index < markers.length; index++) {
						if (this == markers[index]) {
							break;
						}
					}

					var label = cameras[index].cameralabel;
					var image = cameras[index].imageurl.url;

					infoWin.setContent("<p>" + label + "<br><img src=" + image + "></img></p>");
					infoWin.open(map, this);
				});

			});
		})

		.fail(function(error) {
			alert("Failed to get cameras");
		})
});

