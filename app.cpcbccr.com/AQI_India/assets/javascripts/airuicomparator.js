var AirUIComparator = function(airObj) {
  if ( !airObj ) return null;
  var air = airObj;

  var map = new AirUIMap(air);
  if(!map) return  null;
  var $city1 = $("#city1 select");
  var $city2 = $("#city2 select");
  var $city3 = $("#city3 select");
  var $city4 = $("#city4 select");  

  var $cities = [$city1, $city2, $city3, $city4];

  var $date1 = $city1.closest(".panel-body").find(".date");
  var $date2 = $city2.closest(".panel-body").find(".date");
  var $date3 = $city3.closest(".panel-body").find(".date");
  var $date4 = $city4.closest(".panel-body").find(".date");  

  var $dates = [$date1, $date2, $date3, $date4];

  var dataMap = {};

  var datepickerOptions =  {
    format: "dd/mm/yyyy",
    startDate: "01/01/2012",
    endDate: "30/06/2013",
    setDate: "28/05/2012",
    startView: 2,
    todayBtn: "linked",
    autoclose: true,
    todayHighlight: true
  };

  function run() {
    air.on('ready', initialize);
  }

  function configure() {
    /* Required fields in configuration object */
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
    initializeDatepicker(datepickerOptions);
    populateCities();
    bindEvents();
  }

  function initializeDatepicker(options) {
    for ( i in $dates ) {
      $dates[i].datepicker(options);
      $dates[i].datepicker('setDate', options.setDate);
    }
  }

  function populateCities() {
    for( i in $cities ) {
      $cities[i].append($("<option>", {
        text: "--Select City--",
        value: -1,
        disabled: "disabled",
        selected: "selected"
      }));    
      _.each(
        air.getAllCities(),
        function(city) {
          $cities[i].append($("<option />", {
            value: city.id,
            text: city.name
          }));
        }
      );
    }
  }

  function getID($element) {
    return $element.closest("name").attr("id");
  }

  function citySelected() {
    $this = $(this);
    var id = $this.find(":selected").val();
    if ( id == -1 ) return;
    var $date = $this.closest(".panel-body").find(".date");
    var date = $date.find("input").val();
    if ( "" == date ) return;
    showCityInfo(id, date, $this.closest(".panel").find(".city-info").empty());
  }

  function dateChanged() {
    $this = $(this);
    var date = $this.find("input").val();
    if ( date == "" ) return;
    var $city = $this.closest(".panel-body").find("select");
    var id = $city.find(":selected").val();
    if ( id == -1 ) return;    
    showCityInfo(id, date, $this.closest(".panel").find(".city-info").empty()); 
  }

  function showCityInfo(id, date, $element) {
    //id = 73;
    var hours = 22;
    air.getCityMetrics(id, date, hours, function(data) {
      var panel = new AirUIPanel($element, "compare-template", self.config, data);
      panel.draw();
    });
  }

  function bindEvents() {
    for(i in $cities) {
      $cities[i].change(citySelected);
    }
    for(i in $dates) {
      $dates[i].datepicker().on("changeDate", dateChanged);
    }
  }

  this.configure = configure;
  this.run = run;
  var self = this;
}
