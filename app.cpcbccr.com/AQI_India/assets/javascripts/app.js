$(function() {
  $("body").removeClass("loading");
  var air = new Air();
  var airui = new AirUI(air);
  var airuicomparator = new AirUIComparator(air);
    // air.configure(config);
    airui.configure();
    airuicomparator.configure();
    air.run();
    airui.run();
    //airuicomparator.run();
    air.on('stationsLoaded', function() {airui.stationClicked('site_301')});
    /* air.getStationMetrics(795, moment().format('DD/MM/YYYY'), 46)
       .done(airui.drawPanel) 
       .fail(airui.onJSONFail)
       .always(airui.afterStationSet);
       */
    /*air.getCityRankings(function(data) {
      setTimeout( function() {
        new AirUIRankings($("#city-rankings"), {}, data);
      },1000);
    });
    */
});
