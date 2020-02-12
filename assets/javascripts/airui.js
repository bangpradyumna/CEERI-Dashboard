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
	$('#time').timepicker({minuteStep: 60,showMeridian:false});
	var time = $('#time').val();
	time = parseInt(time.split(':')[0])-1;
	if(time == -1){
		time = 23
	}
	currentTime = time+':00';
	$('#time').timepicker('setTime', time+':00');
	
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
    console.log(id)
    self.emit('stationClick', id);
    var station = air.getStation(id);
  // console.log('Id - '+id);
  console.log(station)
    setDropdowns(station.stateID, station.cityID, station.id);
    loading = false;
  }

  function setDropdowns(stateID, cityID, stationID) {
    clearStates();
    console.log('clicked')
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
  
  function stationSelected() {
    var id = $(this).val();
    if ( "0" != id ) {
      map.showStation(air.getStation(id));
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
      air.getStationMetrics(id, date, hours)
      .done(drawPanel)
      .fail(onJSONFail)
      .always(afterStationSet);
       
    } else {
      air.getCityMetrics($cities.find(":selected").val(), date, hours) 
      .done(drawPanel)
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
        url : "https://app.cpcbccr.com/aqi_dashboard/aqi_all_parameter_excel",
        type : 'POST',
        dataType : "json",
  	  headers: {
  		"accessToken": window.btoa(JSON.stringify(accessToken))
  	  },
        crossDomain : true,
        data : window.btoa(JSON.stringify({"station_id":stationID+"", date:date})),
        // data : JSON.stringify({"station_id":id+"", date:date}),
        //contentType : "application/x-www-form-urlencoded; charset=UTF-8",
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
            console.log( data);
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
        if(data.aqi != null && data.down != "true"){
            onLoad = false;
            var panel = new AirUIPanel($("#aqi-info"), "panel-template", self.config, data);
            panel.draw();
          // $('#downloadExcel').click(downloadExcel)
        }
      }else{
        if(data.aqi != null){
            onLoad = false;
            var panel = new AirUIPanel($("#aqi-info"), "panel-template", self.config, data);
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
