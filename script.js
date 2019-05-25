Number.prototype.toRadians = function() { return this * Math.PI / 180; };
Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };

// // 26.329481, 50.208709 - topLeft
// var topLeftCorner = {"lat": 26.329481, "lon":50.208709}
// // var topLeftCorner = {"lat": 26.329811, "lon":50.210336}

// // 26.328997, 50.210530 - currentPt
// var currentPt = {"lat": 26.328997, "lon":50.210530}

function handleClick() {
    var topLeftCorner = {
        "lat": Number(document.getElementById("inputTopLeftLat").value),
        "lon": Number(document.getElementById("inputTopLeftLon").value)
    }

    var currentPt = {
        "lat": Number(document.getElementById("inputLat").value),
        "lon": Number(document.getElementById("inputLon").value)
    }

    var scale = Number(document.getElementById("inputScale").value)

    findDistanceComponents(topLeftCorner, currentPt, scale)
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
		"lon":topLeftCorner.lon
	}

	return newPt;
}

function calculateDistance(point1, point2) {
	var R = 6371e3; // metres
	var φ1 = point1.lat.toRadians();
	var φ2 = point2.lat.toRadians();
	var Δφ = (point2.lat-point1.lat).toRadians();
	var Δλ = (point2.lon-point1.lon).toRadians();

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

//     const φ1 = startingPt["lat"].toRadians(), λ1 = startingPt["lon"].toRadians();

//     const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
//     const φ2 = Math.asin(sinφ2);
//     const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
//     const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
//     const λ2 = λ1 + Math.atan2(y, x);

//     const lat = φ2.toDegrees();
//     const lon = λ2.toDegrees();

//     return {"lat": lat, "lon":lon};
// }

