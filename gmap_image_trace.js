/*
*
* Thanks to Martin Ove for the polygon drawing-to-coordinates base code
* (http://martinove.dk/2011/03/17/polylinepolygon-tool-for-google-maps/)
*
* Overlay code modified from https://developers.google.com/maps/documentation/javascript/examples/overlay-simple
*
*/

var line;
function initialize() {
    var latlng = new google.maps.LatLng(48.6, -19.8);
    var myOptions = {
      zoom: 3,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    line = new google.maps.Polyline({
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    var path = [new google.maps.LatLng(55, 12),
                new google.maps.LatLng(56, 12)
                ];

      line.setMap(map);

      google.maps.event.addListener(map, 'click', addNewPoint);
}
function addNewPoint(e) {
	if (plotActive==true) {
		var path = line.getPath();
		path.push(e.latLng);
		newPointShow(e.latLng);
		lastPoint = e.LatLng;
	}
}

function newPointShow(point) {
	$('#pointsPanel').append('<span>'+point+'</span>'+'<br />');
}

function removeLastPoint() {
	$('#pointsPanel>span:last').remove();
	$('#pointsPanel>br:last').remove();
	var path = line.getPath();
	  path.pop();
}

var plotActive = false;

function startPlot() {
	if (plotActive==false) {
		plotActive = true;
		$('#plotter').attr('value', 'Stop Plot');
	} else {
		$('#plotter').attr('value', 'Start Plot');
		plotActive = false;
	}
}
