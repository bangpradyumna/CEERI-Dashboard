var AirUIMap = function (airObj) {
  if (!airObj) return null;

  /* Required fields in configuration object */
  var requiredFields = ['mapCenterLat', 'mapCenterLng', 'mapZoom', 'mapStateZoom', 'mapCityZoom', 'mapStationZoom'];
  var map;
  var air = airObj;
  var MAP_ID = "map";
  var loaded = false;
  var loadedMap = false;
  let data_response;
  let url = "https://ceeri-dashboard.bits-dvm.org/back/https://app.cpcbccr.com/caaqms/caaqms_landing_map_all";

  function isVisible() {
    return $("#" + MAP_ID).is(':visible');
  }

  function makeHollow() {
    self.on = function () {};
    self.emit = function () {};
    self.configure = function () {};
    self.initialize = function () {};
    self.pinStations = function () {};
    self.showState = function () {};
    self.showCity = function () {};
    self.showStation = function () {};
  }

  function configure() {
    if (!isVisible()) {
      makeHollow();
      return;
    }
    // /* Check if all required fields are present in config */  
    // _.each(requiredFields, function(field){
    //   if ( !_.has(config, field) ) {
    //     console.log("Field" + field + " not found in config");
    //     return null;
    //   }
    // });
    // self.config = config;
    // self.config.mapStationZoom =  parseInt(self.config.mapStationZoom);
    // self.config.mapStateZoom =  parseInt(self.config.mapStateZoom);
    // self.config.mapCityZoom =  parseInt(self.config.mapCityZoom);
    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: btoa(JSON.stringify({
          "region": "landing_dashboard"
        })),
      })
      .then(async(response) => {
        let data = await response.json();
        console.log(data);
        data_response = data;
        // mapInit(data.map.station_list[0]); // Initialize map using center coordinates
        console.log(data.map.station_list[0]);
        initialize();
        // addDefaultData(data.def);
        // fetchDataForNode(data.def); // To be uncommented
        // return (data.map).station_list;
      });
  }

  function drawMap(center) {
    map = new MapmyIndia.Map("map", {
      center: [center.latitude, center.longitude],
      zoomControl: true,
      hybrid: true,
      zoom: 4
    });
    loadedMap = true;
  }

  function latLng(lat, lng) {
    // return new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
  }

  async function initialize() {
    console.log("INITIAL", loadedMap)
    if(loadedMap) return;
    loadedMap = true;
    // var mapOptions = {
    //   'center': latLng(self.config.mapCenterLat, self.config.mapCenterLng),
    //   'zoom': parseInt(self.config.mapZoom),
    //   'streetViewControl': false
    // };
    console.log(data_response)
    await drawMap(data_response.map.station_list[0]);
    console.log(map)
    await pinStations(air.getAllStations());
    // google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    // 	loaded = true;
    // });
  }

  function showState(state) {
    if (typeof (state.latitude) != "undefined" && state.latitude.trim().length > 0) {
      map.panTo(latLng(state.latitude, state.longitude));
      map.setZoom(self.config.mapStateZoom);
    }
  }

  function showCity(city) {
    if (typeof (city.latitude) != "undefined" && city.latitude.trim().length > 0) {
      map.panTo(latLng(city.latitude, city.longitude));
      map.setZoom(self.config.mapCityZoom);
    }
  }

  function showStation(station) {
    if (typeof (station.latitude) != "undefined" && station.latitude.trim().length > 0) {
      map.panTo(latLng(station.latitude, station.longitude));
      // map.setZoom(self.config.mapStationZoom);
    }
  }

  function stationClicked(id) {
    self.emit('stationClick', id);
  }

  async function pinStation(station) {
    // var markerOptions = {
    //   'position': latLng(station.latitude, station.longitude),
    //   'map': map,
    //   'id': station.id,
    //   'icon': station.live ? "assets/images/live-circle-16.png" : "assets/images/future-circle-16.png",
    //   'title': station.name
    // };
    // var marker = new google.maps.Marker(markerOptions);
    // if(station.live)
    //   google.maps.event.addListener(marker, 'click', stationClicked);
    // return marker;
    // console.log(map)
    let tempMk = new L.marker([station.latitude, station.longitude]).addTo(map);
    tempMk.on("click", function (e) {
      console.log(station);
      stationClicked(station.id);
  })
    return tempMk;
  }

  function pinStations(stations) {
    console.log(map)
    if(loaded) return;
    
    loaded = true;
    //   if( !loaded ) {
    //     google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    // _.each(stations, pinStation);	  
    //     });
    //   } else {
    //     _.each(stations, pinStation);	  
    //   }
    console.log(stations, loaded)
    stations.forEach(station => {
      pinStation(station);
    });
  }

  function on(event, callback) {
    signal.on(event, callback);
  }

  function emit(event, arg) {
    signal.emit(event, arg);
  }

  /* All accessible properties of airui will go below this line */
  /* Inheriting from EventEmitter2 to be able to emit and listen to events*/
  //EventEmitter2.call(this);
  var signal = new EventEmitter2();
  this.on = on;
  this.emit = emit;
  this.configure = configure;
  this.initialize = initialize;
  this.pinStations = pinStations;
  this.showState = showState;
  this.showCity = showCity;
  this.showStation = showStation;
  /* For context issues */
  var self = this;
};