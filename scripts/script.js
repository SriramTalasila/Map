window.addEventListener("offline", function (e) {
    alert('Your offline');
});
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//Display error message if map not loaded
function googleError() {
    alert("Failed to load map Check your connection");
    console.log("Error in loading google map"); 
}

//To open the sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}
//To close the sidebar
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

var stringStartsWith = function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};
var map; //global variable to be access anywhere
var markers = [];
var infow;

// Initialize Map 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 5
    });
    var Infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    viewModel.mapmarker = ko.computed(function () {
        setMapOnAll(null);
        markers = [];
        viewModel.markedlocations.removeAll()
        ko.utils.arrayForEach(viewModel.filteredlocations(), function (loc) {
            var position = loc.location;
            var title = loc.title;
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            infow = Infowindow;
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function () {
                setallAnimationNull()
                fillInfoWindow(this);
                this.setAnimation(google.maps.Animation.BOUNCE)
                flickrImage(this);
            });
            //Adding marker to observable array
            viewModel.markedlocations.push({
                mark: marker
            });
            //Show marked places
            showListings();
        });
    }, viewModel);


}

//Fills Info window with title of place

function fillInfoWindow(marker) {
    infowindow = infow;
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<h3>' + marker.title + '</h3><br><p>Click on marker for photos</a>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
            marker.setAnimation(null)
        });
    }
    infowindow.open(map, marker);
}
//Shows all markers on map
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
// This function will clear the previous marked places
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
// Clears the animation
function setallAnimationNull() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setAnimation(null);
    }
}
//open the selected place
function selection(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    fillInfoWindow(marker)
}

// request images from flicker api and append to modal

function flickrImage(marker) {
    modal.style.display = "block";
    $('#mhead').html(marker.title);
    var flickrAPIKey = "72b79941d9dfd62a965e113fa013250e",
        title = marker.title;
    var photoQueryURL = 'https://api.flickr.com/services/rest/?' + $.param({
        'method': 'flickr.photos.search',
        'api_key': flickrAPIKey,
        'text': title,
        'tags': title,
        'accuracy ': '13',
        'format': 'json',
        'nojsoncallback': '1'
    });
    // AJAX Query:
    $.ajax(photoQueryURL)
        .done(function (data) {
            console.log('Sucessful query.');
            var len = data.photos.photo.length,
                html = "";
            if (len > 0) {
                var i;
                for (i = 0; i < 5; i++) {
                    ima = data.photos.photo[i];
                    html += "<img width='200px' height='200px' src='";
                    html += 'https://farm' + ima.farm + '.staticflickr.com/' + ima.server + '/' + ima.id + '_' +
                        ima.secret + '.jpg';
                    html += "'>";
                }
                $("#images").html(html);
            }
        })
        .fail(function (err) {
            console.log('Failed query.');
            alert("failed to load images");
            $("#images").html('Unable to load');
        });

}

//knockout js modal
function ViewModel() {
    //Locations of the places
    this.locations = ko.observableArray([{
        title: 'Silicon Valley, CA, USA',
        location: {
            lat: 37.387474,
            lng: -122.05754339999999
        }
    },
    {
        title: 'Araku, Andhra Pradesh, India',
        location: {
            lat: 18.3273486,
            lng: 82.87752180000007
        }
    },
    {
        title: 'Niagara Falls, ON, Canada',
        location: {
            lat: 43.0895577,
            lng: -79.08494359999997
        }
    },
    {
        title: 'Amazon Rainforest, Brazil',
        location: {
            lat: -3.4653053,
            lng: -62.215880500000026
        }
    },
    {
        title: 'Goa beach, India',
        location: {
            lat: 15.2993265,
            lng: 74.12399600000003
        }
    },
    {
        title: 'Table Mountain, South Africa',
        location: {
            lat: -33.962822,
            lng: 18.409840600000052
        }
    },
    {
        title: 'Paris, France',
        location: {
            lat: 48.856614,
            lng: 2.3522219000000177
        }
    },
    {
        title: 'New York City',
        location: {
            lat: 40.7128,
            lng: -74.0060
        }
    },
    {
        title: 'Valley of flowers',
        location: {
            lat: 38.796471,
            lng: -90.332542
        }
    }
    ]);
    this.markedlocations = ko.observableArray([]);
    this.title = ko.observable('');
    this.filteredlocations = ko.computed(function () {
        var filter = this.title().toLowerCase();
        //console.log(this.items());
        return ko.utils.arrayFilter(this.locations(), function (item) {
            return stringStartsWith(item.title.toLowerCase(), filter);
        });
    }, this);
    this.clickfunction = function (m) {
        setallAnimationNull();
        w3_close()
        selection(m.mark)
    };
}
var viewModel = new ViewModel();
ko.applyBindings(viewModel);