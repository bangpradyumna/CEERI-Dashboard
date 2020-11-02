var AirUI = function(airObj) {
  if ( !airObj ) return null;

  var air = airObj;
  var map = new AirUIMap(air);
  var currentTime = "";
  var states, cities, stations;
  var onLoad = true;
  var loading = false;

  var datepickerOptions =  {
    format: "dd/mm/yyyy",
    startDate: "01/03/2013",
    endDate: new Date(),
    setDate: new Date(),
    startView: 0,
    todayBtn: "linked",
    autoclose: true,
    todayHighlight: true,
    orientation: "top auto"
  };

  function configure() {
    // /* Required fields in configuration object */
    // var requiredFields = [];
    // /* Check if all required fields are present in config */  
    // _.each(requiredFields, function(field){
    //   if ( !_.has(config, field) ) {
    //     console.log("Field" + field + " not found in config");
    //     return null;
    //   }
    // });
    // self.config = config;
    map.configure();
  }
  
  /* Sets up and draws all the ui elements */
  function initialize() {
    $states = $("#states");
    $cities = $("#cities");
    $stations = $("#stations");
    $date = $("#date");
    $date2 = $("#date2");

    initializeDatepicker(datepickerOptions);
    // map.initialize();
    // map.pinStations(air.getAllStations());
    resetDropdowns();
    // populateAQIDescTable(self.config.breakpoints);
    map.on('stationClick', stationClicked);
    bindEvents();
    // setDropdowns("Delhi", "Delhi", "site_1420")
  }

  function initializeDatepicker(options) {
    $date.datepicker(options);
    $date.datepicker('setDate', moment().format('DD/MM/YYYY'));
    $date2.datepicker(options);
    $date2.datepicker('setDate', moment().format('DD/MM/YYYY'));
	$('#time').timepicker({minuteStep: 60,showMeridian:false});
	$('#time2').timepicker({minuteStep: 60,showMeridian:false});
	var time = $('#time').val();
	time = parseInt(time.split(':')[0])-1;
	if(time == -1){
		time = 23
	}
	currentTime = time+':00';
	$('#time').timepicker('setTime', time+':00');
	$('#time2').timepicker('setTime', time+':00');

  }

  function populateAQIDescTable(brkpts) {
    var last = 0;
    var $papa = $(".aqi-desc-container");
    for(i in brkpts) {
      $row = $(".aqi-desc-row-template").clone().removeClass("aqi-desc-row-template").css("display", "");
      $row.find(".aqi-value").html(last + "-" + brkpts[i].uplimit);
      $row.find(".remark").html(brkpts[i].remark);
      $row.find(".color-code").css("background-color", brkpts[i].color);
      $row.find(".desc").html(brkpts[i].description);
      $row.appendTo($papa);
      last = brkpts[i].uplimit + 1;
    }
  }

  function stationClicked(id) {
    //window.quickfix(id);
    self.emit('stationClick', id);
    var station = air.getStation(id);
  // console.log('Id - '+id);
    setDropdowns(station.stateID, station.cityID, station.id);
    loading = false;
  }

  function setDropdowns(stateID, cityID, stationID) {
    clearStates();
    populateStates();
    $states.val(stateID);    
    clearCities();
    populateCities();
    $cities.val(cityID);    
    clearStations();
    populateStations();
    $stations.val(stationID);
    // map.showStation(air.getStation(stationID));    
    stationSet(stationID);
  }

  /* The 'this' context in below 3 function will belong
     to the dropdown element
   */
  function stateSelected() {
    map.showState(air.getState($(this).val()));
    clearCities();
    clearStations();
    populateCities();
  }
  
  function citySelected() {
    map.showCity(air.getCity($(this).val()));
    clearStations();
    populateStations();
  }
  
  function stationSelected(e) {
    var id = $(this).val();
    if ( "0" != id ) {
      // map.showStation(air.getStation(id));
    }
    window.quickfix(id);
    stationSet(id);
  }

  function beforeStationSet() {
    $("#aqi-info").empty();
    // $("#no-response-panel").clone().appendTo("#aqi-info");
    // $("#no-data-panel").clone().appendTo("#aqi-info");
    $("#aqi-info-wrapper").addClass("loading");
    $("#aqi-info").removeClass("no-data");
    $("#aqi-info").removeClass("no-response");
  }

  function afterStationSet() {
    $("#aqi-info-wrapper").removeClass("loading");    
  }

  function stationSet(id) {
    beforeStationSet();
    var hours = $('#time').val();
    var date = $date.find("input").val();
    if ( "0" != id ) {
      $.when(air.getStationMetrics(id, date, hours), air.getAllParameters(id, date, hours))
        .done(function(d1, d2) {
            drawPanel({
              data: d1, 
              allData: d2,
            })
          })
        .fail(onJSONFail)
        .always(afterStationSet);
      // air.getStationMetrics(id, date, hours)
      // .done(drawPanel)
      // .fail(onJSONFail)
      // .always(afterStationSet);
       
    } else {
      $.when(air.getStationMetrics(id, date, hours), air.getAllParameters(id, date, hours))
      .done(function(d1, d2) {
          drawPanel({
            data: d1, 
            allData: d2,
          })
        })
      .fail(onJSONFail)
      .always(afterStationSet);
    }
    
  }

  function dateChanged(e) {
    var stationID = $stations.find(":selected").val();
    if ( stationID == -1) return;
    stationSet(stationID);
  }
  function timeChanged(e) {
    setTimeout(function(){ 
      if(currentTime == $('#time').val()){
        return;
      }else{
        currentTime = $('#time').val();
      }
        var stationID = $stations.find(":selected").val();
        if ( stationID == -1) return;
        stationSet(stationID);
     }, 2000);
  }
  
  function downloadExcel(){
  	var stationID = $stations.find(":selected").val();
  	if ( stationID == -1) return;
  	var hours = $('#time').val();
  	var date = $date.find("input").val();
  	var tmpData = date.split('/');
  	date = tmpData[2]+'-'+tmpData[1]+"-"+tmpData[0]+"T"+hours+":00Z";
  	/*$('#downloadExcel i').removeClass('glyphicon-download-alt');
  	$('#downloadExcel i').addClass('glyphicon-refresh');
  	$('#downloadExcel').attr('disabled','true');*/
  	var currentTimeObj =  new Date();
  	var accessToken = {"time":currentTimeObj.getTime(), "timeZoneOffset":currentTimeObj.getTimezoneOffset()};
      $.ajax({
        url : "https://ceeri-dashboard.bits-dvm.org/back/https://app.cpcbccr.com/aqi_dashboard/aqi_all_parameter_excel",
        type : 'POST',
        dataType : "json",
  	  headers: {
  		"accessToken": window.btoa(JSON.stringify(accessToken))
  	  },
        crossDomain : true,
        data : window.btoa(JSON.stringify({"station_id":stationID+"", date:date})),
        // data : JSON.stringify({"station_id":id+"", date:date}),
        //contentType : "text/plain; charset=UTF-8",
        success : function(data) {
  		  if(data.status == 'success'){
  			  $.fileDownload('/aqi_dashboard/download?filename='+data.filename)
  			  .done(function(){  
  					/*$('#downloadExcel i').removeClass('glyphicon-refresh');
  					$('#downloadExcel i').addClass('glyphicon-download-alt');
  					$('#downloadExcel').attr('disabled','false');*/
  			  })
  			  .fail(function () { alert('File download failed!'); });
  			  
  			  /*$.fileDownload('/aqi_dashboard/download?filename='+data.filename, {
  				successCallback: function (url) {
  					$('#downloadExcel i').removeClass('glyphicon-refresh');
  					$('#downloadExcel i').addClass('glyphicon-download-alt');
  					$('#downloadExcel').attr('disabled','false');
  				},
  				failCallback: function (responseHtml, url){
  					$('#downloadExcel i').removeClass('glyphicon-refresh');
  					$('#downloadExcel i').addClass('glyphicon-download-alt');
  					$('#downloadExcel').attr('disabled','false');
  				}
  			  });*/
  		  }
        }
      });
  }

  function downloadData(){

    var body = {
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
      "fromDate":"16-10-2020 T00:00:00Z",
      "toDate":"17-10-2020 T00:17:59Z",
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
      ],
      "type":"excel"
   }

    var stationID = $stations.find(":selected").val();
    body.station = stationID;
    var state = $states.find(":selected").val();
    body.state = state;
    var city = $cities.find(":selected").val();
    body.city = city;
    if ( stationID == -1) return;
    var hours1 = $('#time').val();
    var date1 = $date.find("input").val();
    var tmpData = date1.split('/');
    date1 = tmpData[0]+'-'+tmpData[1]+"-"+tmpData[2]+"T"+hours1+":00Z";

    body.fromDate = date1;
    
    var hours2 = $('#time2').val();
    var date2 = $date2.find("input").val();
    var tmpData = date2.split('/');
    date2 = tmpData[0]+'-'+tmpData[1]+"-"+tmpData[2]+"T"+hours2+":00Z";

    body.toDate = date2;

    /*$('#downloadExcel i').removeClass('glyphicon-download-alt');
    $('#downloadExcel i').addClass('glyphicon-refresh');
    $('#downloadExcel').attr('disabled','true');*/
    var currentTimeObj =  new Date();
    var accessToken = {"time":currentTimeObj.getTime(), "timeZoneOffset":currentTimeObj.getTimezoneOffset()};
      $.ajax({
        url : "https://ceeri-dashboard.bits-dvm.org/back/https://app.cpcbccr.com/caaqms/ReportRedirections",
        type : 'POST',
        crossDomain : true,
        data : window.btoa(JSON.stringify(body)),
        // data : JSON.stringify({"station_id":id+"", date:date}),
        //contentType : "text/plain; charset=UTF-8",
        success : function(data) {
        if(data.status == 'success'){
          $.fileDownload('https://app.cpcbccr.com/caaqms/download?filename='+data.filename)
          .done(function(){  
            /*$('#downloadExcel i').removeClass('glyphicon-refresh');
            $('#downloadExcel i').addClass('glyphicon-download-alt');
            $('#downloadExcel').attr('disabled','false');*/
          })
          .fail(function () { alert('File download failed!'); });
          
          /*$.fileDownload('/aqi_dashboard/download?filename='+data.filename, {
          successCallback: function (url) {
            $('#downloadExcel i').removeClass('glyphicon-refresh');
            $('#downloadExcel i').addClass('glyphicon-download-alt');
            $('#downloadExcel').attr('disabled','false');
          },
          failCallback: function (responseHtml, url){
            $('#downloadExcel i').removeClass('glyphicon-refresh');
            $('#downloadExcel i').addClass('glyphicon-download-alt');
            $('#downloadExcel').attr('disabled','false');
          }
          });*/
        }
        }
      });
    }
  

  function bindEvents() {
    /* Map event binding */
    map.on('stationClick', function(id) {
      if(loading) return;
      loading = true;
      stationClicked(id);
    });
    /* Dropdown event binding */
    $states.change(stateSelected);
    $cities.change(citySelected);
    $stations.change(stationSelected);
    $date.datepicker().on('changeDate', dateChanged);
	$('#time').change(timeChanged);
	$('#downloadExcel').on("click", downloadExcel);
	$('#downloadData').on("click", downloadData);
	
  }

  function resetDropdowns() {
    clearStates();
    populateStates(air.getAllStates());
    clearCities();
    clearStations();
  }

  function clearStates() {
    $states.empty();
    $states.append($("<option>", {
      text: "--Select State--",
      value: -1,
      disabled: "disabled",
      selected: "selected"
    }));
  }

  function populateStates() {
    _.each(
      air.getAllStates(),
      function(state) {
        if(state.live) $states.append($("<option />", {
          value: state.id,
          text: state.name
        }));
      }
    );
  }

  function clearCities() {
    $cities.empty();
    $cities.append($("<option>", {
      text: "--Select City--",
      value: -1,
      disabled: "disabled",
      selected: "selected"
    }));
  }

  function populateCities() {
    _.each(
      air.getCitiesByState($states.find(":selected").val()),
      function(city) {
        if(city.live) $cities.append($("<option />", {
          value: city.id,
          text: city.name
        }));
      }
    );
  }

  function clearStations() {
    $stations.empty();
    $stations.append($("<option>", {
      text: "--Select Station--",
      value: -1,
      disabled: "disabled",
      selected: "selected"
    }));    
  }

  function populateStations() {
	  /*
	  $stations.append($("<option />", {
      value: 0,
      text: "CITY AVERAGE"
    }));
    	*/
    _.each(
      air.getStationsByCity($cities.find(":selected").val()),
      function(station) {
        if(true) $stations.append($("<option />", {
          value: station.id,
          text: station.name
        }));
      }
    );
  }

  function drawPanel(data) {
      if(onLoad){
        if(data.data[0].aqi != null && data.data[0].down != "true"){
            onLoad = false;
            var panel = new AirUIPanel($("#aqi-info"), "panel-template", self.config, data.data[0], data.allData[0].data);
            panel.draw();
          // $('#downloadExcel').click(downloadExcel)
        }
      }else{
        if(data.data[0].aqi != null){
            onLoad = false;
            var panel = new AirUIPanel($("#aqi-info"), "panel-template", self.config, data.data[0], data.allData[0].data);
            panel.draw();
          // $('#downloadExcel').click(downloadExcel)
        }else{
          $("#aqi-info").addClass("no-data");
        }
      }
    }
  // function download(){
	 //  $('#downloadExcel').trigger('click')
  // }

  function onJSONFail() {
    $("#aqi-info").addClass("no-response");
  }

  function run() {
    air.on('ready', initialize)
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
  this.run = run;
  this.configure = configure;
  this.onJSONFail = onJSONFail;
  this.drawPanel = drawPanel;
  this.afterStationSet = afterStationSet;
  this.stationClicked = stationClicked;  
	// this.download=download;
  /* For context issues */
  var self = this;
};
