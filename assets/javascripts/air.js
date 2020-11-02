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
        return response.json();
      })
      .then((data) => {
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

  function leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  function getDateOneDayBefore(date) {
    var d = parseInt(date[0]);
    var m = parseInt(date[1]);
    var y = parseInt(date[2]);
    d = d - 1;
    if(d == 0) {
      m = m - 1;
      if(m == 0) {
        y = y - 1;
        m = 12;
        d = 31;
      }
      else {
        const dates = [31, 28, 31, 30, 31, 30, 31, ,31, 30, 31, 30, 31];
        d = dates[m];
        if(leapYear(year) && m == 2)
          d += 1;
      }
    }
    var dd, mm, yy;
    if(d < 10)
      dd = "0"+d;
    else 
      dd = ""+d;
    
    if(m < 10)
      mm = "0"+m;
    else 
      mm = ""+m;
    yy = ""+y;
    return [dd, mm, yy];
  }

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
      date = tmpData[2]+'-'+tmpData[1]+"-"+tmpData[0]+"T"+hours+":00Z";
    var currentTimeObj =  new Date();
    var accessToken = {"time":currentTimeObj.getTime(), "timeZoneOffset":currentTimeObj.getTimezoneOffset()};
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

  function getAllParameters(id, date, hours) {
    var body = {
      "draw":1,
      "columns":[
         {
            "data":0,
            "name":"",
            "searchable":true,
            "orderable":false,
            "search":{
               "value":"",
               "regex":false
            }
         }
      ],
      "order":[
         
      ],
      "start":0,
      "length":40,
      "search":{
         "value":"",
         "regex":false
      },
      "filtersToApply":{
         "parameter_list":[
            {
               "id":0,
               "itemName":"AT",
               "itemValue":"parameter_204"
            },
            {
               "id":1,
               "itemName":"BP",
               "itemValue":"parameter_238"
            },
            {
               "id":2,
               "itemName":"PM10",
               "itemValue":"parameter_215"
            },
            {
               "id":3,
               "itemName":"PM2.5",
               "itemValue":"parameter_193"
            },
            {
               "id":4,
               "itemName":"RH",
               "itemValue":"parameter_235"
            },
            {
               "id":5,
               "itemName":"SR",
               "itemValue":"parameter_237"
            },
            {
               "id":6,
               "itemName":"Temp",
               "itemValue":"parameter_198"
            },
            {
               "id":7,
               "itemName":"Toluene",
               "itemValue":"parameter_232"
            },
            {
               "id":8,
               "itemName":"WD",
               "itemValue":"parameter_234"
            },
            {
               "id":9,
               "itemName":"WS",
               "itemValue":"parameter_233"
            },
            {
               "id":10,
               "itemName":"CO",
               "itemValue":"parameter_203"
            },
            {
               "id":11,
               "itemName":"Benzene",
               "itemValue":"parameter_202"
            },
            {
               "id":12,
               "itemName":"P-Xylene",
               "itemValue":"parameter_324"
            },
            {
               "id":13,
               "itemName":"NH3",
               "itemValue":"parameter_311"
            },
            {
               "id":14,
               "itemName":"NO",
               "itemValue":"parameter_226"
            },
            {
               "id":15,
               "itemName":"NO2",
               "itemValue":"parameter_194"
            },
            {
               "id":16,
               "itemName":"NOx",
               "itemValue":"parameter_225"
            },
            {
               "id":17,
               "itemName":"Ozone",
               "itemValue":"parameter_222"
            },
            {
               "id":18,
               "itemName":"SO2",
               "itemValue":"parameter_312"
            }
         ],
         "criteria":"1 Hours",
         "reportFormat":"Tabular",
         "fromDate":"28-10-2020 T00:00:00Z",
         "toDate":"29-10-2020 T02:05:59Z",
         "state":"Delhi",
         "city":"Delhi",
         "station":"site_301",
         "parameter":[
            "parameter_204",
            "parameter_238",
            "parameter_215",
            "parameter_193",
            "parameter_235",
            "parameter_237",
            "parameter_198",
            "parameter_232",
            "parameter_234",
            "parameter_233",
            "parameter_203",
            "parameter_202",
            "parameter_324",
            "parameter_311",
            "parameter_226",
            "parameter_194",
            "parameter_225",
            "parameter_222",
            "parameter_312"
         ],
         "parameterNames":[
            "AT",
            "BP",
            "PM10",
            "PM2.5",
            "RH",
            "SR",
            "Temp",
            "Toluene",
            "WD",
            "WS",
            "CO",
            "Benzene",
            "P-Xylene",
            "NH3",
            "NO",
            "NO2",
            "NOx",
            "Ozone",
            "SO2"
         ]
      },
      "pagination":1
    };
    var tmpData = date.split('/');
    date = tmpData[0]+'-'+tmpData[1]+"-"+tmpData[2]+" T"+hours+":10Z";
    var currentTimeObj =  new Date();
    var tmpData = getDateOneDayBefore(tmpData);
    date2 = tmpData[0]+'-'+tmpData[1]+"-"+tmpData[2]+" T"+hours+":00Z";
    body.filtersToApply.fromDate = date2;
    console.log(date2, date, tmpData);
    body.filtersToApply.toDate = date;

    $states = $("#states");
    $cities = $("#cities");
    $stations = $("#stations");
    var stationID = $stations.find(":selected").val();
    body.filtersToApply.station = stationID;
    var state = $states.find(":selected").val();
    body.filtersToApply.state = state;
    var city = $cities.find(":selected").val();
    body.filtersToApply.city = city;

    var accessToken = {"time":currentTimeObj.getTime(), "timeZoneOffset":currentTimeObj.getTimezoneOffset()};
      return $.ajax({
        url : "https://app.cpcbccr.com/caaqms/fetch_table_data",
        // url : "http://172.30.14.63:8084/aqi_all_Parameters",
        type : 'POST',
        dataType : "json",
        // headers: { "accessToken": btoa(JSON.stringify(accessToken)), Accept, Key },
        crossDomain : true,
        data : btoa(JSON.stringify(body)),
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
  this.getAllParameters = getAllParameters;
  this.getCityMetrics = getCityMetrics;
  this.getCityRankings = getCityRankings;

  /* For context issues */
  var self = this;
};