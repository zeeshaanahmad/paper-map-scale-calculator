Number.prototype.toRadians = function() { return this * Math.PI / 180; };
Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
var map;
var bounds;
var markers = [];
// // 26.329481, 50.208709 - topLeft
// var topLeftCorner = {"lat": 26.329481, "lng":50.208709}
// // var topLeftCorner = {"lat": 26.329811, "lng":50.210336}

// // 26.328997, 50.210530 - currentPt
// var currentPt = {"lat": 26.328997, "lng":50.210530}

function initMap() {
    map = new google.maps.Map(
    document.getElementById('map'), {zoom:7, center: {lat: 27.6648, lng: -81.5158}});
    bounds  = new google.maps.LatLngBounds();
}

function handleClick() {
    resetMap()

    var topLeftCorner = {
        "lat": Number(document.getElementById("inputTopLeftLat").value),
        "lng": Number(document.getElementById("inputTopLeftLon").value)
    }

    addPointToMap(topLeftCorner, "yellow", "top corner")

    var currentPt = {
        "lat": Number(document.getElementById("inputLat").value),
        "lng": Number(document.getElementById("inputLon").value)
    }

    addPointToMap(currentPt, "yellow", "point of interest")
    
    addPointToMap(getRightAnglePt(topLeftCorner, currentPt), "green", "third point")

    map.fitBounds(bounds);
    map.panToBounds(bounds);

    var scale = Number(document.getElementById("inputScale").value)

    findDistanceComponents(topLeftCorner, currentPt, scale)
}

function addMarker(latLng, color) {
    let url = "http://maps.google.com/mapfiles/ms/icons/";
    url += color + "-dot.png";
  
    let marker = new google.maps.Marker({
      map: map,
      position: latLng,
      icon: {
        url: url
      }
    });
}

function findDistanceComponents(topLeftCorner, currentPt, scale) {
	var rightAnglePt = getRightAnglePt(topLeftCorner, currentPt)
	var verticalDist = calculateDistance(topLeftCorner, rightAnglePt)
	var horizontalDist = calculateDistance(rightAnglePt, currentPt)

	console.log("Vertical Distance", ground2Map(verticalDist, 'meter', scale, 'centimeter'))
    console.log("Horizontal Distance", ground2Map(horizontalDist, 'meter', scale, 'centimeter'))
    
    document.getElementById("latDist").innerHTML = ground2Map(verticalDist, 'meter', scale, 'centimeter')
    document.getElementById("lonDist").innerHTML = ground2Map(horizontalDist, 'meter', scale, 'centimeter')
}

function getRightAnglePt(topLeftCorner, currentPt) {
	var newPt = {
		"lat": currentPt.lat,
		"lng":topLeftCorner.lng
	}

	return newPt;
}

function calculateDistance(point1, point2) {
	var R = 6371e3; // metres
	var φ1 = point1.lat.toRadians();
	var φ2 = point2.lat.toRadians();
	var Δφ = (point2.lat-point1.lat).toRadians();
	var Δλ = (point2.lng-point1.lng).toRadians();

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;

	return d;
}

function ground2Map(actualDistance, actualDistanceUnit, scale, mapUnit) {
    var mapDist = (metersToUnit( unitToMeters(actualDistance, actualDistanceUnit) / scale, mapUnit )).toFixed(2);
    var answer = 'At a map scale of 1:'+scale+', '+formatDistance(actualDistance, actualDistanceUnit)+' on the ground is equivalent to '+formatDistance(mapDist, mapUnit)+' on the map.';
    return answer;
}

function unitToMeters(value, unit) {
    switch(unit)
    {
        case 'millimeter':
            return value / 1000;
        case 'centimeter':
            return value / 100;
        case 'meter':
            return value;
        case 'kilometer':
            return value * 1000;
        case 'inch':
            return value / 39.370079;
        case 'feet':
            return value / 3.2808399;
        case 'statute mile':
            return value * 1609.344;
        case 'nautical mile':
            return value * 1852;
    }
}

function metersToUnit(value, unit) {
    switch(unit)
    {
        case 'millimeter':
            return value * 1000;
        case 'centimeter':
            return value * 100;
        case 'meter':
            return value;
        case 'kilometer':
            return value / 1000;
        case 'inch':
            return value * 39.370079;
        case 'feet':
            return value * 3.2808399;
        case 'statute mile':
            return value / 1609.344;
        case 'nautical mile':
            return value / 1852;
    }
}

function formatDistance(distance, unit) {
    var unitText = '';
    if (unit == 'inch') {
        if (distance != 1) {
            unitText = 'inches';
        } else {
            unitText = 'inch'
        }
    } else if (unit == 'feet') {
        if (distance != 1) {
            unitText = 'feet';
        } else {
            unitText = 'foot'
        }
    } else if (distance) {
        unitText = unit + 's';
    }
    return distance+' '+unitText;
}

function addPointToMap(point, color, title) {
    let url = "http://maps.google.com/mapfiles/ms/icons/";
    url += color + "-dot.png";

    let marker = new google.maps.Marker({
        map: map,
        position: point,
        title: title,
        icon: {
            url: url
        }
    });

    var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    bounds.extend(loc);
    markers.push(marker);
}

function removeMarkersFromMap() {
    for (var idx = 0; idx < markers.length; idx++) {
        markers[idx].setMap(null);
    }
}

function resetMap() {
    removeMarkersFromMap();
    markers.length = 0;
    bounds  = new google.maps.LatLngBounds();
}

// ******* UNUASED  **********

// function calculateDestinationPointUsingDistanceAndAngle(startingPt, verticalDistance, horizontalDistance, radius=6371e5) {
//     var downwardPt = calculateDestinationPt(startingPt, verticalDistance, 180)
// 	//		top corner
// 	//			(•)
// 	//			 |
// 	//			 |
// 	//			 |
// 	//			 |
// 	//			(•)
// 	//		vertical pt


//     var destinationPt = calculateDestinationPt(downwardPt, horizontalDistance, 90)
// 	//		top corner
// 	//		   (•)
// 	//			|\
// 	//			| \
// 	//			|  \
// 	//			|   \
// 	//		   (•)--(•)
// 	//  vertical pt  destination pt

// 	return destinationPt
// }

// function calculateDestinationPt(startingPt, distance, angle, radius) {
// 	const δ = distance / radius; // angular distance in radians
//     const θ = Number(angle).toRadians();

//     const φ1 = startingPt["lat"].toRadians(), λ1 = startingPt["lng"].toRadians();

//     const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
//     const φ2 = Math.asin(sinφ2);
//     const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
//     const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
//     const λ2 = λ1 + Math.atan2(y, x);

//     const lat = φ2.toDegrees();
//     const lon = λ2.toDegrees();

//     return {"lat": lat, "lng":lon};
// }

