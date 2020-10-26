var Air = function () {

  function configure(config) {
    // /* Required fields in configuration object */
    // var requiredFields = [];
    // /* Check if all required fields are present in config */  
    // _.each(requiredFields, function(field){
    //   if ( !_.has(config, field) ) return null;
    // });
    // self.config = config;
  }

  function loadStations() {
    // $.getJSON("assets/jsons/stations.json", function(data) {
    // if ( !data ) return null;
    // self.data = data;
    // self.emit('stationsLoaded');
    // });
    var currentTimeObj = new Date();
    var accessToken = {
      "time": currentTimeObj.getTime(),
      "timeZoneOffset": currentTimeObj.getTimezoneOffset()
    };
    fetch("https://ceeri-dashboard.bits-dvm.org/back/https://app.cpcbccr.com/aqi_dashboard/aqi_station_all_india", {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'text/plain',
        },
        body: btoa(JSON.stringify({})),
      })
      .then((response) => {
        console.log(response)
        return response.json();
      })
      .then((data) => {
        console.log(data);
        self.data = data;
        self.emit('stationsLoaded');
        // data_response = data;
        // mapInit(data.map.station_list[0]); // Initialize map using center coordinates
        // console.log(data.map.station_list[0]);
        // addDefaultData(data.def);
        // fetchDataForNode(data.def); // To be uncommented
        // return (data.map).station_list;
      });
    // $.ajax({	
    //     // url : "http://localhost/aqi_dashboard/aqi_stations",
    //     // url : "/aqi_dashboard/aqi_stations",
    // url: "https://app.cpcbccr.com/aqi_dashboard/aqi_station_all_india",
    //     type : 'POST',
    //     dataType : "json",
    //   headers: {
    // 	"accessToken": window.btoa(JSON.stringify(accessToken))
    //   },
    //     crossDomain : true,
    //     data : window.btoa('{}'),
    //     // data : '{"type":"PM"}',
    //     //contentType : "text/plain; charset=UTF-8",
    //     success : function(data) {
    //       if ( !data ) return null;
    //       self.data = data;
    //       self.emit('stationsLoaded');
    //     }
    // });
  }

  function stationsLoaded() {
    getAllStations();
    getAllCities();
    getAllStates();
    self.emit('ready');
  }

  //  function getStationMetrics(id, date, hours) {
  //    return $.getJSON(
  //      "assets/jsons/metric_station.json",
  //      { d: date , h: hours}
  //    );
  //  }


  function getStationMetrics(id, date, hours) {

    // return fetch("https://app.cpcbccr.com/aqi_dashboard/aqi_all_Parameters", {
    //     method: 'POST', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'text/plain',
    //     },
    //     body: window.btoa(JSON.stringify({"station_id":id+"", date:date})),
    //   })
      // .then((response) => {
      //   console.log(response)
      //   return response.json();
      // })
      // .then((data) => {
        // console.log(data);
        // self.data = data;
        // self.emit('stationsLoaded');
        // data_response = data;
        // mapInit(data.map.station_list[0]); // Initialize map using center coordinates
        // console.log(data.map.station_list[0]);
        // addDefaultData(data.def);
        // fetchDataForNode(data.def); // To be uncommented
        // return (data.map).station_list;
      // });


    /*return $.getJSON(
      "assets/jsons/metric_station_two.json",
      { d: date , h: hours}
    );*/
    var tmpData = date.split('/');
    console.log(tmpData)
      date = tmpData[2]+'-'+tmpData[1]+"-"+tmpData[0]+"T"+hours+":00Z";
    var currentTimeObj =  new Date();
    var accessToken = {"time":currentTimeObj.getTime(), "timeZoneOffset":currentTimeObj.getTimezoneOffset()};
    console.log(accessToken)
      return $.ajax({
        url : "https://ceeri-dashboard.bits-dvm.org/back/https://app.cpcbccr.com/aqi_dashboard/aqi_all_Parameters",
        // url : "http://172.30.14.63:8084/aqi_all_Parameters",
        type : 'POST',
        dataType : "json",
        // headers: { "accessToken": btoa(JSON.stringify(accessToken)), Accept, Key },
        crossDomain : true,
        data : btoa(JSON.stringify({"station_id":id, date:date})),
        // data : JSON.stringify({"station_id":id+"", date:date}),
        //contentType : "text/plain; charset=UTF-8",
        success : function(data) {
            return data;
        }
      });
  }


  function getCityMetrics(id, date, hours) {
    return $.getJSON(
      "/metrics/city/" + id, {
        d: date,
        h: hours
      }
    );
  }

  function getCityRankings(callback) {
    $.getJSON("/rankings/city", callback);
  }

  function run() {
    self.on('stationsLoaded', stationsLoaded)
    loadStations();
  }

  function getStation(id) {
    console.log(self.data.allStations, id)
    for (i in self.data.allStations) {
      if (id == self.data.allStations[i].id)
        return self.data.allStations[i];
    }
    return null;
  }

  function getCurrentStation() {

  }

  function getAllStations() {
    if (self.data.allStations) return self.data.allStations;
    self.data.allStations = [];
    for (i in self.data.stations) {
      self.data.allStations = self.data.allStations.concat(self.data.stations[i].stationsInCity);
    }
    self.data.allStations = self.data.allStations.sort(comparator);
    return self.data.allStations;
  }

  function getStationsByCity(cityID) {
    for (i in self.data.stations) {
      if (cityID == self.data.stations[i].cityID)
        return self.data.stations[i].stationsInCity;
    }
    return [];
  }

  function getStationsByState(stateID) {

  }

  function getCity(id) {
    for (i in self.data.allCities) {
      if (id == self.data.allCities[i].id)
        return self.data.allCities[i];
    }
    return null;
  }

  function getCurrentCity() {

  }

  function getAllCities() {
    if (self.data.allCities) return self.data.allCities;
    self.data.allCities = [];
    for (i in self.data.cities) {
      self.data.allCities = self.data.allCities.concat(self.data.cities[i].citiesInState);
    }
    self.data.allCities = self.data.allCities.sort(comparator);
    return self.data.allCities;
  }

  function comparator(a, b) {
    if (a.name > b.name) return 1;
    return -1;
  }

  function getCitiesByState(stateID) {
    for (i in self.data.cities) {
      if (stateID == self.data.cities[i].stateID)
        return self.data.cities[i].citiesInState;
    }
    return [];
  }

  function getState(id) {
    for (i in self.data.states) {
      if (self.data.states[i].id == id)
        return self.data.states[i];
    }
    return null;
  }

  function getCurrentState() {

  }

  function getAllStates() {
    if (self.data.allStates) return self.data.allStates;
    self.data.allStates = self.data.states.sort(comparator);
    return self.data.allStates;
  }

  function on(event, callback) {
    signal.on(event, callback);
  }

  function emit(event, arg) {
    signal.emit(event, arg);
  }

  /* All accessible properties of air will go below this line */
  /* Inheriting from EventEmitter2 to be able to emit and listen to events*/
  //EventEmitter2.call(this);
  var signal = new EventEmitter2();
  this.on = on;
  this.emit = emit;
  this.run = run;
  this.configure = configure;
  this.getStation = getStation;
  this.getAllStations = getAllStations;
  this.getStationsByCity = getStationsByCity;
  this.getStationsByState = getStationsByState;
  this.getCity = getCity;
  this.getAllCities = getAllCities;
  this.getCitiesByState = getCitiesByState;
  this.getState = getState;
  this.getAllStates = getAllStates;
  this.currentStation = null;
  this.currentCity = null;
  this.currentState = null;
  this.getStationMetrics = getStationMetrics;
  this.getCityMetrics = getCityMetrics;
  this.getCityRankings = getCityRankings;

  /* For context issues */
  var self = this;
};