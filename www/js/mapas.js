// global var
let directionDisplay;
let directionsService;
let map;
let service;
let infowindow;
let markers = [];
let vector_locations = [{latitude: 39.91917625627857,longitude:3.0550693124460113},{latitude: 39.59716134363598,longitude:2.996749388515329}];
// portvil
let latitude  = 39.91925705252694;
let longitude = 3.0550600469500107;

// Default prortvil
function initMap() {
    let options = {
        center: { lat: latitude, lng: longitude },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 15,
    }
    // maps
    map = new google.maps.Map(document.getElementById("contact-google-map"),options);
    
    // infowindows
    const contentString =
    '<div id="content-window">' +
    '<h1>Portvil</h1>' + 
    '<h2>Gran selección de viviendas vacacionales</h2> ' +
    '<p>Empresa especializada con más de 40 años de experiencia en el alquiler de viviendas vacacionales</p> ' +
    "</div>";
    infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Uluru",
    });
    // marker
    const marker = addMarker( { lat: latitude, lng: longitude },"Portvil");
    // marker event
    addEventMarker("click",marker,"Portvil");

} // end function 


// Adds a marker to the map and push to the array.
let addMarker = (position,title) => {
    const marker = new google.maps.Marker({
        position,
        map,
    });
    markers.push(marker);
    return marker;
}


// Add event Marker
let addEventMarker = (event,marker,title) => {
    const contentString =
    '<div id="content-window">' +
    '<h1>'+title+'</h1>' + 
    "</div>";
    let infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Uluru",
    });

    marker.addListener(event, () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });
}


// Sets the map on all markers in the array.
let setMapOnAll = (map) => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}
  
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    hideMarkers();
    markers = [];
}

// Removes the markers from the map, but keeps them in the array.
let hideMarkers = () => {
    setMapOnAll(null);
}

  
let QueryByPhoneNumber = () => {
    // hide marks    
    hideMarkers();

    let phone = document.querySelector("#numero_telefono");
    phone = (phone.value == "") ? "+34971530250" : phone.value; 
    let requestPhoneNumber = {
        phoneNumber:phone,
        fields: ['name', 'geometry'],  
    };

    var request = {
        query: 'monumentos mallorca',
        bounds:new google.maps.LatLngBounds({lat: 39, lng: 3}),
        fields: ['name', 'geometry'],
    };

    // servicio Google Places
    var service = new google.maps.places.PlacesService(map);
    
    // resize
    // google.maps.event.trigger(map, 'resize');

    // Búsqueda por número de telefono
    service.findPlaceFromPhoneNumber(requestPhoneNumber,resultadoPlaces);
}


let QueryByNearPlace = (type) => {
    // hide marks    
    hideMarkers();

    onDeviceReadyMaps(type,executeQueryByNearPlace);

    console.log("query latitude: "+latitude+" longitude: "+longitude);
    let actual_location = { lat: latitude, lng: longitude };

    
}

let executeQueryByNearPlace = (type) => {
    var request = {
        location: { lat: latitude, lng: longitude },
        radius: '500',
        type: [type],
        fields: ['name', 'geometry'],
    };

    // servicio Google Places
    var service = new google.maps.places.PlacesService(map);
    
    // resize
    // google.maps.event.trigger(map, 'resize');

    // Búsqueda por monumentos
    service.nearbySearch(request, resultadoPlaces);
}

let resultadoPlaces = (results, status) =>{
    // console.log("resultado places: "+results);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log("resultado places: "+results[i].geometry.location);
          createMarkerPlaces(results[i]);
        }
    }
}

let createMarkerPlaces = (place) => {
    if (!place.geometry || !place.geometry.location) return;
    console.log(place.name);
    /*
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(place.name || "");
      infowindow.open(map);
    });

    */

    // infowindows
    const contentString =
    '<div id="content-window">' +
    '<h1'+place.name+'</h1>' + 
    "</div>";
    infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: "Uluru",
    });

   // marker
    const marker = addMarker( { lat:place.geometry.location.lat() , lng: place.geometry.location.lng() });
   
    // marker event
   addEventMarker("click",marker,place.name);
}




let queryMonuments = () => {
    var config = {
        method: 'get',
        //url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAdwVmyksTS6UV9w1w86_JuFSUA_8A1Haw&location=-'+latitude+','+longitude+'&query=monument&radius=50000000000&region=spain',
        //url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop&location=35.792491,-78.653009&radius=2000&region=us&type=cafe,bakery&key=AIzaSyAdwVmyksTS6UV9w1w86_JuFSUA_8A1Haw",
        url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=monumentos+pollensa&location="+latitude+","+longitude+"&radius=2000&region=spain&type=Historical Monuments&key=AIzaSyAdwVmyksTS6UV9w1w86_JuFSUA_8A1Haw",
        headers: {}
    };
}


function onDeviceReadyMaps(type,executeQueryByNearPlace) {
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    var onSuccess = function(position) {
        /*
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
        */
    
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;
        
        console.log("device ready latitude: "+latitude+" longitude: "+longitude);

        // callback
        executeQueryByNearPlace(type);

    };
 
    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
 
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}


function busquedaPorQuery(request,contenedor){
    var service = new google.maps.places.PlacesService(contenedor);
    service.findPlaceFromQuery(request, function(results, status) {
      /*
        if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
            createMarker(results[i]);
        }
        //map.setCenter(results[0].geometry.location);
      }
      */
    });
}


let resultadoPlacesRequest = (results, status) =>{
    /*
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log("resultado places: "+results[i].geometry.location);
        }
    }
    */
}


function initMapPlaces() {
    // url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=monumentos+pollensa&location="+latitude+","+longitude+"&radius=2000&region=spain&type=Historical Monuments&key=AIzaSyAdwVmyksTS6UV9w1w86_JuFSUA_8A1Haw",
    var sydney = new google.maps.LatLng(latitude, longitude);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('contact-google-map'), {center: sydney, zoom: 15});
    /*
    "39.91917625627857"
    "3.0550693124460113"
    let lat  = parseFloat(latitude);
    let long = parseFloat(longitude);
    */
    let phone = document.querySelector("#numero_telefono");
    phone = (phone.value == "") ? "+34971530250" : phone.value; 

    let requestPhoneNumber = {
        phoneNumber:phone,
        fields: ['name', 'geometry'],  
    };

    var request = {
      query: 'monumentos mallorca',
      bounds:new google.maps.LatLngBounds({lat: 39, lng: 3}),
      fields: ['name', 'geometry'],
    };
  
    
    // servicio Google Places
    var service = new google.maps.places.PlacesService(map);
    
    // Búsqueda por número de telefono
    service.findPlaceFromPhoneNumber(requestPhoneNumber,resultadoPlaces);

    // service.findPlaceFromQuery(request,resultadoPlaces); 
    // service.PlaceSearchRequest(request,resultadoPlacesRequest); 

    /*
    service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
            createMarker(results[i]);
        }
        //map.setCenter(results[0].geometry.location);
      }
    });
    */

  }

  
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var pollensa = new google.maps.LatLng(latitude,longitude);
    var myOptions = {
        zoom: 25,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: pollensa
    }
    map = new google.maps.Map(document.getElementById("contact-google-map"), myOptions);
    directionsDisplay.setMap(map);
    calcRoute();
}


function calcRoute() {

    // puntos simbólicos
    var request = {
        origin:latitude+","+longitude,
        destination:"39.919287340755666, 3.055849835225565",
        // origin: "1521 NW 54th St, Seattle, WA 98107 ",
        // destination: "San Diego, CA",
        waypoints: [
            {
                location: new google.maps.LatLng(39.87749835131577, 3.0158546458487447),
                stopover: true
            },
        ],

        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.WALKING,

    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            /*
            var summaryPanel = document.getElementById("directions_panel");
            summaryPanel.innerHTML = "";
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
                summaryPanel.innerHTML += route.legs[i].start_address + " to ";
                summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
                summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            }
            */
        } else {
            alert("directions response " + status);
        }
    });
}



$(function(){
    // directionsService = new google.maps.DirectionsService();
    // initialize();
    // google.maps.event.addDomListener(window, "load", initialize);
    initMap();
    
});