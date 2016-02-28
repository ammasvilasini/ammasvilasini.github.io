//GLOBAL VARIABLES
var map;

//MODEL
 	var myPlaces = [
		{ name: 'Piazzale Michelangelo',
		   lat: '43.7629',
		   lng: '11.2652',
		  id: "4b3276d5f964a520620c25e3",
		},
		{ name: 'Duomo',
			lat: '43.7732',
			lng: '11.2560',
		    id: "51a78933498e8d9e020f8d81",
		},
		{ name: 'Piazza della Signoria',
			lat: '43.7696',
			lng: '11.2558',
		    id: "4b81729af964a520a7a630e3",

		},
		{ name: 'Piazza del Duomo',
			lat: '43.7729',
			lng: '11.2558',
		    id: "4b36068ef964a520c12f25e3",

		},
		{ name: 'Ponte Vecchio',
			lat: '43.7680',
			lng: '11.2532',
		    id: "4b6ed35df964a52038cc2ce3",

		}
	];


//GETTING THE MAP ON THE SCREEN
	function initMap() {
		"use strict";
	  // Create a map object and specify the DOM element for display.
	  map = new google.maps.Map(document.getElementById('map'), {
		 center: {lat: 43.7658059, lng: 11.2619084},
		 scrollwheel: false,
		 zoom: 14,
		//Remove weird little man icon
		disableDefaultUI: true

	  });
	 // Start the ViewModel here so it doesn't initialize before Google Maps loads
		 ko.applyBindings(new ViewModel());
	}

//OBSERVABLE ITEMS FOR THE INFO WINDOW
var items = function (data) {
	"use strict";
	this.name 			= ko.observable(data.name);
	this.lat 			= ko.observable(data.lat);
	this.lng 			= ko.observable(data.lng);
	this.id				= ko.observable(data.id);
	this.marker			= ko.observable();
	this.rating			= ko.observable('');
	this.url			= ko.observable('');
	this.canonicalUrl	= ko.observable('');
	this.photoPrefix	= ko.observable('');
	this.photoSuffix	= ko.observable('');
	this.contentString	= ko.observable('');
};



//VIEW MODEL
var ViewModel = function () {
	"use strict";
	var self = this;

	// Pushes my static array into an observable array
	this.placeList = ko.observableArray([]);

	myPlaces.forEach(function (placeItem) {
		self.placeList.push(new items(placeItem));
	});

	  // INFO WINDOW
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 200,
		maxHeight: 200,
	});

	// MARKER
	var marker;

	// I NEED TO MAKE A NOTE HERE
	self.placeList().forEach(function (placeItem) {


		// MAKES MARKERS FOR EACH PLACE/ANIMATION
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(placeItem.lat(), placeItem.lng()),
			map: map,
			animation: google.maps.Animation.DROP
		});
		placeItem.marker = marker;

	// MAKES MARKERS AVAILABLE BASED ON SEARCH
	self.visible = ko.observableArray();

	// ALL MARKERS ARE VISIBLE
	self.placeList().forEach(function (place) {
		self.visible.push(place);
	});

		// FOURSQUARE API - AJAX REQUEST - FIND PLACE FROM THE ID
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/' + placeItem.id() +
		   '?client_id=CNSR1COIXHKZLLTK0VAA4UJHS10C41ZCY3E1FL2WBWGHO3YX&client_secret=NM4SCCPWABLZY1YNJLXKVX4Y5HUIWGSP21LXY4UKNM5KVWRT&v=20130815',
			//TO PARSE JSON RESPONSE
			dataType: "json",
			success: function (data) {
				// Make results easier to handle
				var result = data.response.venue;

				var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
				if (bestPhoto.hasOwnProperty('prefix')) {
					placeItem.photoPrefix(bestPhoto.prefix || '');
				}

				if (bestPhoto.hasOwnProperty('suffix')) {
					placeItem.photoSuffix(bestPhoto.suffix || '');
				}

				var rating = result.hasOwnProperty('rating') ? result.rating : '';
				placeItem.rating(rating || 'none');


			 // CONTENT STRING FOR THE INFOWINDOW
				var contentString = '<div id="iWindow"><h4>' + placeItem.name() + '</h4><div id="pic"><img src="' +
				placeItem.photoPrefix() + '110x110' + placeItem.photoSuffix() + '" alt="Image Location"></div><p>Foursquare Stats:</p><p>' + '</p><p>Rating: ' + placeItem.rating() +  '</div>';

			  //ADD INFO WINDOWS
				google.maps.event.addListener(placeItem.marker, 'click', function () {
					infowindow.open(map, this);
					// Bounce animation credit https://github.com/Pooja0131/FEND-Neighbourhood-Project5a/blob/master/js/app.js
					placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function () {
						placeItem.marker.setAnimation(null);
					}, 500);
					infowindow.setContent(contentString);
				});
			},
			// Alert the user on error. Set messages in the DOM and infowindow
			error: function (e) {
				infowindow.setContent('<h5>Foursquare aint happening now! Please try later.</h5>');
//				  document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
			}
		});

		// This event listener makes the error message on AJAX error display in the infowindow
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(map, this);
			placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
				placeItem.marker.setAnimation(null);
			}, 500);
		});
	});
//
	// MARKER ANIMATES ACCORDING TO USER CLICK
	self.showInfo = function (placeItem) {
		google.maps.event.trigger(placeItem.marker, 'click');
//	
	};

	self.userInput = ko.observable('');

	// USER INPUT MAKES MARKER AVAILABLE
	self.filterMarkers = function () {
		// Set all markers and places to not visible.
		var searchInput = self.userInput().toLowerCase();
		self.visible.removeAll();
		self.placeList().forEach(function (place) {
			place.marker.setVisible(false);
		// TO MAKE SEARCH NON- CASE SENSITIVE
			if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
				self.visible.push(place);
			}
		});
		self.visible().forEach(function (place) {
			place.marker.setVisible(true);
		});
	};
};














