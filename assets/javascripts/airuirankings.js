var AirUIRankings = function($papa, options, data) {

  var $panel;
  $panel = $(".rankings-template").clone().removeClass("rankings-template").css("display", "");
  $panel.find(".title").text(data.title);

  var gaugeOptions = {
  };

  function pushRow($papa, data) {
    $row = $(".rankings-row-template").clone().removeClass("rankings-row-template").css("display", "");
    $row.find(".rank").html(data.rank);
    $row.find(".city").html(data.name);
    $row.find(".state").html(data.state);    
    $row.find(".remark").css("color", data.color).html(data.remark);
    $row.find(".value").html(data.aqi);
    $row.appendTo($papa);
  }
  
  function pushRowsIn($papa, data) {
    for(i in data) {
      pushRow($papa, data[i]);
    }
    $.bootstrapSortable(true);
  }
  
  function draw() {
    // $papa.append($panel);
    // pushRowsIn($panel.find(".rankings-container").empty(), data.rankings);
  }

  this.draw = draw;
  this.draw();
};
