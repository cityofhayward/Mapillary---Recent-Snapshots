var mapillaryTiles;
var maxDate, minDate;
var mapillary;
var map;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/VectorTileLayer",
    "dojo/domReady!"
  ], function(Map, MapView, VectorTileLayer) {
    map = new Map({
      basemap: "dark-gray"
    });
// max date is today, min date pass to getNewDate function, start with 12 months to subtract from today
    maxDate = new Date().getTime();
    minDate = getNewDate(12);

    mapillaryTiles = {
        "version": 8,
        "sources": {
            "mapillary-source": {
                "tiles": [
                   "https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt"
                ],
                "type": "vector"
            }
        },
        "layers": [{
                "id": "mapillary-lines",
                "type": "line",
                "source": "mapillary-source",
                "source-layer": "mapillary-sequences",
                "interactive": true,
                "minzoom": 0,
                "maxzoom": 14,
                "layout": {
                    "line-join": "round",
                    "line-cap":  "round",
                    "visibility": "visible"
                },
                "paint": {
                    "line-opacity": 0.6,
                    "line-color": "#00df4d",
                    "line-width": 2
                },
                "filter":  ["all",
                    [">=", "captured_at", minDate],
                    ["<=", "captured_at", maxDate],
                ]
            }
        ]
    };

    var view = new MapView({
      container: "map",
      map: map,
      center: [-122.0791286, 37.6504077],
      zoom: 14
    });

    mapillary = new VectorTileLayer({
            url: mapillaryTiles
          });
    map.add(mapillary);
});

//update the vector layer for last 3 months of photos
function threeMonths() {
  const mTiles3 = {...mapillaryTiles};
  mTiles3.layers[0].filter[1][2] = getNewDate(3);
  mapillary.loadStyle(mTiles3);
  document.getElementById("btn3").classList.add("btn-selected");
  document.getElementById("btn2").classList.remove("btn-selected");
  document.getElementById("btn1").classList.remove("btn-selected");
}

//update the vector layer for last 6 months of photos
function sixMonths() {
  const mTiles6 = {...mapillaryTiles};
  mTiles6.layers[0].filter[1][2] = getNewDate(6);
  mapillary.loadStyle(mTiles6);
  document.getElementById("btn2").classList.add("btn-selected");
  document.getElementById("btn3").classList.remove("btn-selected");
  document.getElementById("btn1").classList.remove("btn-selected");
}

//update the vector layer for last 12 months of photos
function twelveMonths() {
  const mTiles12 = {...mapillaryTiles};
  mTiles12.layers[0].filter[1][2] = getNewDate(12);
  mapillary.loadStyle(mTiles12);
  document.getElementById("btn1").classList.add("btn-selected");
  document.getElementById("btn2").classList.remove("btn-selected");
  document.getElementById("btn3").classList.remove("btn-selected");
}


//function to generate minimum date for filter after passing in months to subtract from today
function getNewDate(monthsToSubtract) {
  var minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - monthsToSubtract,
    new Date().getDate()
  ).getTime();
  return minDate;
}
