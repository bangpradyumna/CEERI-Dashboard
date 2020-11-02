var AirUIPanel = function($papa, templateClass, options, data, allData) {
  if (!data || !data.metrics || !data.metrics.length) {
    $papa.addClass("no-data");
  }

  var chartData = [];
  console.log(data);
  var $panel;
  var $prev = $("#prevButton");
  var $next = $("#nextButton");
  var flag = true;
  $panel = $("." + templateClass)
    .clone()
    .removeClass(templateClass)
    .css("display", "");
  $panel.find(".title").text(data.title);
  $panel.find(".prominent-param").text(data.aqi.param);
  $panel.find(".date-on").text(data.date);

  var gaugeOptions = {
    parentNode: $panel.find(".aqi-meter").get(0),
    value: data.aqi.value,
    min: 0,
    max: 500,
    startAnimationType: "linear",
    startAnimationTime: 0,
    title: data.aqi.remark,
    titleFontColor: "black", //data.aqi.color,
    label: "AQI",
    showMinMax: true,
    levelColorsGradient: false
    //levelColors: genGaugeColors(options.breakpoints)
    // customSectors: genCustomSectors(options.breakpoints)
  };

  var metricGraphOptions = {
    height: 25,
    page: "enable",
    pageSize: 20,
    pagingSymbols: {
      prev: "prev",
      next: "next"
    },
    chartArea: {
      top: 0,
      width: "100%",
      height: "100%"
    },
    bar: { groupWidth: "90%" },
    legend: { position: "none" },
    vAxis: {
      textPosition: "none",
      gridlines: {
        count: 0
      }
    },
    hAxis: {
      textPosition: "none",
      baselineColor: "transparent"
    } //,
    // animation: {
    //   duration: 1000,
    //   easing: "out"
    // },
    // explorer: {
    //   maxZoomOut:0,
    //   maxZoomIn:1,
    //   keepInBounds: true
    // }
  };

  var lastMetricGraphOptions = {
    height: 40,
    chartArea: {
      top: 0,
      width: "100%",
      height: "60%"
    },
    hAxis: {
      textPosition: "out",
      format: "haa, EEE",
      baselineColor: "transparent"
    } // ,
    // explorer: {
    //   maxZoomOut:0,
    //   maxZoomIn:1,
    //   keepInBounds: true
    // }
  };

  function preProcessData() {
    /*if(!data || !data.metrics || !data.metrics.length) return;
    var minDate, maxDate;
    var noData = {
      date: '',
      value: 500,
      tooltip: 'No data available',
      color: 'lightgray',
      dummy: true
    };
    minDate = maxDate = new Date(data.metrics[0].data[0].date);
    for(i in data.metrics) {
      minDate = Math.min(minDate, new Date(data.metrics[i].data[0].date));
      maxDate = Math.max(maxDate, new Date(data.metrics[i].data.slice(-1)[0].date));      
    }
    //minDate = new Date(minDate);
    minDate = new Date(maxDate);    
    maxDate = new Date(maxDate);
    minDate = minDate.setDate(maxDate.getDate() - 1);
    
    for(i in data.metrics) {
      old = data.metrics[i].data;
      stuffedData = [];
      var d = new Date(minDate);
      var j = 0;    
      while(d < maxDate && j < old.length) {
        if(d.toString() == (new Date(old[j].date)).toString()) {
          stuffedData.push(old[j]);
          j++;
        } else {
          var noData = {
            date: d.toString(),
            value: parseInt(data.metrics[i].max),
            tooltip: 'No data available',
            color: 'lightgray',
            dummy: true
          };          
          stuffedData.push(noData);
        }
        d.setHours(d.getHours() + 1);
      }
      while(d < maxDate) {
        var noData = {
          date: d.toString(),
          value: parseInt(data.metrics[i].max),
          tooltip: 'No data available',
          color: 'lightgray',
          dummy: true
        };                  
        stuffedData.push(noData);
        d.setHours(d.getHours() + 1);        
      }
      if(d.toString() == maxDate.toString()) {
        if(j < old.length && d.toString() == (new Date(old[j].date)).toString()) {
          stuffedData.push(old[j]);
          j++;
        } else {        
          var noData = {
            date: d.toString(),
            value: parseInt(data.metrics[i].max),
            tooltip: 'No data available',
            color: 'lightgray',
            dummy: true
          };                  
          stuffedData.push(noData);
        }
      }
      data.metrics[i].data = stuffedData;
    }

    for(i in data.metrics) {
      if(data.metrics[i].avg == '-') {
        data.metrics[i].min = '-';
        data.metrics[i].max = '-';
        data.metrics[i].hideStats = true;
      }
    }*/
    console.log(allData);
    var k = 0;
    for (i in allData.siteInfo.parameters) {
      const param = allData.siteInfo.parameters[i];
      var datas = [];
      var min = 9999,
        max = 0,
        avg = 0;
      for (let j = 0; j < 24; j++) {
        datas[j] = [];
        datas[j][1] = parseFloat(allData.tabularData.bodyContent[j][param]);
        datas[j][0] = allData.tabularData.bodyContent[j]["from date"];
        datas[j][2] = ColorReplace(datas[j][1]);
        if (allData.tabularData.bodyContent[j][param] == null) {
          datas[j][1] = null;
          continue;
        }
        if (datas[j][1] < min) min = datas[j][1];
        if (datas[j][1] > max) max = datas[j][1];
        avg += datas[j][1] / 24;
      }
      if (min == 9999) continue;
      chartData[k] = {};
      chartData[k]["name"] = param;
      chartData[k]["data"] = datas;
      chartData[k]["min"] = min;
      chartData[k]["max"] = max;
      chartData[k]["avg"] = avg.toFixed(2);
      k++;
    }
    console.log(chartData);
    for (i in data.metrics) {
      for (j in data.chartData[i]) {
        data.chartData[i][j][2] = ColorReplace(data.chartData[i][j][1]);
        //console.log(data.chartData[i][j][2]);
      }
      if (
        typeof data.chartData != "undefined" &&
        typeof data.chartData[i] != "undefined"
      ) {
        data.metrics[i].data = data.chartData[i];
      }
    }
    console.log(data);
  }
  function ColorReplace(color) {
    /*if(color == "color:#b30000;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#C00000;stroke-color: #caccdc   ; stroke-width: 1;";
	  }else if(color == "color:#ff0000;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#FF0000;stroke-color: #caccdc   ; stroke-width: 1;";
	  }else if(color == "color:#ff9900;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#FF9900;stroke-color: #caccdc   ; stroke-width: 1;";
	  }else if(color == "color:#ffff00;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#FFFF00;stroke-color: #caccdc   ; stroke-width: 1;";
	  }else if(color == "color:#009933;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#92D050;stroke-color: #caccdc   ; stroke-width: 1;";
	  }else if(color == "color:#006600;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#00B050;stroke-color: #caccdc   ; stroke-width: 1;";
	  }else if(color == "color:#aaa4a4;stroke-color: #caccdc   ; stroke-width: 1;") {
		  return "color:#b30000;stroke-color: #caccdc   ; stroke-width: 1;";
	  }*/
    if (color >= 401) {
      return "color:#C00000;stroke-color: #caccdc   ; stroke-width: 1;";
    } else if (color >= 301 && color <= 400) {
      return "color:#FF0000;stroke-color: #caccdc   ; stroke-width: 1;";
    } else if (color >= 201 && color <= 300) {
      return "color:#FF9900;stroke-color: #caccdc   ; stroke-width: 1;";
    } else if (color >= 101 && color <= 200) {
      return "color:#FFFF00;stroke-color: #caccdc   ; stroke-width: 1;";
    } else if (color >= 51 && color <= 100) {
      return "color:#92D050;stroke-color: #caccdc   ; stroke-width: 1;";
    } else if (color >= 0 && color <= 50) {
      return "color:#00B050;stroke-color: #caccdc   ; stroke-width: 1;";
    } else {
      return "color:#b30000;stroke-color: #caccdc   ; stroke-width: 1;";
    }
  }

  function getDate(data) {
    var d, m, y;
    d = parseInt(data[0] + data[1]);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    for (i in months) if (data.substring(3, 6) == months[i]) m = i;
    y = parseInt(data.substring(7, 11));
    var hh = parseInt(data.substring(14, 16));
    var ss = parseInt(data.substring(17, 19));
    return new Date(y, m, d, hh, ss);
  }

  function drawMetricGraph(element, data, options) {
    var chart = new google.visualization.ColumnChart(element);
    var dt = new google.visualization.DataTable();
    dt.addColumn("datetime", "Time");
    dt.addColumn("number", "ParameterIndex");
    dt.addColumn({ type: "string", role: "tooltip" });
    dt.addColumn({ type: "string", role: "style" });

    /*    var dt1 = new google.visualization.DataTable();
    dt1.addColumn('datetime', "Time");
    dt1.addColumn('number', 'ParameterIndex');
    dt1.addColumn({type: 'string', role:'tooltip'});
    dt1.addColumn({type: 'string', role:'style'});

    dt1.addRow([new Date(), 0, "0", "gray"]);
    chart.draw(dt1, options);*/

    for (let i = 0; i < 24; i++) {
      const date = getDate(data.data[i][0]);
      //dt.addRow([new Date(data[i].date), parseInt(data[i].value), data[i].tooltip, data[i].color]);
      dt.addRow([date, data.data[i][1], "" + data.data[i][1], data.data[i][2]]);
    }
    chart.draw(dt, options);
  }

  function insertMetricRow($papa, metric, options, allData) {
    $row = $(".metrics-row-template")
      .clone()
      .removeClass("metrics-row-template")
      .css("display", "");
    $row.find(".element-name").html(metric.name);
    $row.find(".avg-value").html(Math.round(metric.avg));
    $row.find(".min-value").html(metric.min);
    $row.find(".max-value").html(metric.max);
    if (metric.hideStats) {
      $row.find(".avg-value").attr("title", "Insufficient data");
      $row.find(".min-value").attr("title", "Insufficient data");
      $row.find(".max-value").attr("title", "Insufficient data");
    } else {
      $row.find(".avg-value").attr("title", metric.avgDesc);
      $row.find(".min-value").attr("title", metric.avgDesc);
      $row.find(".max-value").attr("title", metric.avgDesc);
    }
    $row.appendTo($papa);
    drawMetricGraph(
      $row.find(".graph-container").get(0),
      metric,
      options,
      allData
    );
  }

  function insertMetricRows($papa, metrics, allData) {
    if (chartData.length < 9) {
      for (var i = 0; i < metrics.length - 1; i++) {
        insertMetricRow($papa, metrics[i], metricGraphOptions, allData);
      }
      if (i == metrics.length - 1) {
        var options = {};
        insertMetricRow(
          $papa,
          metrics[i],
          _.extend(options, metricGraphOptions, lastMetricGraphOptions),
          allData
        );
      }
      $prev.css("display", "none");
      $next.css("display", "none");
    } else {
      $prev.css("display", "");
      $next.css("display", "");
      if (flag) {
        $next.attr("disabled", false);
        $prev.attr("disabled", true);
        for (var i = 0; i < parseInt(chartData.length / 2); i++) {
          insertMetricRow($papa, metrics[i], metricGraphOptions, allData);
        }
        if (true) {
          var options = {};
          insertMetricRow(
            $papa,
            metrics[parseInt(chartData.length / 2)],
            _.extend(options, metricGraphOptions, lastMetricGraphOptions),
            allData
          );
        }
      } else {
        $prev.attr("disabled", false);
        $next.attr("disabled", true);
        for (
          var i = parseInt(chartData.length / 2) + 1;
          i < chartData.length - 1;
          i++
        ) {
          insertMetricRow($papa, metrics[i], metricGraphOptions, allData);
        }
        if (true) {
          var options = {};
          insertMetricRow(
            $papa,
            metrics[chartData.length - 1],
            _.extend(options, metricGraphOptions, lastMetricGraphOptions),
            allData
          );
        }
      }
    }
  }

  function drawGauge() {
    var g = new JustGage(gaugeOptions);
  }

  function isInsufData() {
    for (i in data.metrics) {
      //if( (data.metrics[i].name == "PM10" || data.metrics[i].name == "PM2.5") && !data.metrics[i].hideStats ) return false;
      if (
        (data.metrics[i].param == "PM10" ||
          data.metrics[i].param == "PM2.5" ||
          data.metrics[i].name == "PM10" ||
          data.metrics[i].name == "PM2.5") &&
        !data.metrics[i].hideStats
      )
        return false;
    }
    return true;
  }

  function draw() {
    $("#aqi-info").empty();

    $panel = $("." + templateClass)
      .clone()
      .removeClass(templateClass)
      .css("display", "");
    $panel.find(".title").text(data.title);
    $panel.find(".prominent-param").text(data.aqi.param);
    $panel.find(".date-on").text(data.date);

    // if(data.down) {
    if (data.down != "false" && typeof data.down != "undefined") {
      $panel
        .find("#station-down-message")
        .text("Insufficient data for computing AQI");
      $panel.find(".aqi-meter-panel").addClass("station-down");
    } else if (isInsufData()) {
      $panel.find(".aqi-meter-panel").addClass("insuf-data");
    }
    drawGauge($panel.find(".aqi-meter").get(0), data);
    setTimeout(function() {
      insertMetricRows($panel.find(".metrics-container"), chartData, allData);
      set_baseLines();
    }, gaugeOptions.startAnimationTime);
    $papa.append($panel);
  }

  function set_baseLines() {
    $("g[clip-path]").each(function() {
      if ($(this).find("> g").length < 3) {
        width = $(this)
          .siblings("rect")
          .attr("width");
        height =
          $(this)
            .siblings("rect")
            .attr("height") - 1;

        d3.select(this)
          .append("g")
          .append("rect")
          .attr("x", 0)
          .attr("y", height)
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("fill", "#333333")
          .attr("width", width)
          .attr("height", 1);
      }
    });
  }

  function gcd(a, b) {
    if (!b) {
      return a;
    }
    return gcd(b, a % b);
  }

  function genGaugeColors(breakpoints) {
    var g = breakpoints[0].uplimit;
    for (i in breakpoints) {
      g = gcd(g, breakpoints[i].uplimit);
    }
    var colors = [];
    var last = 0;
    for (i in breakpoints) {
      var j = (breakpoints[i].uplimit - last) / g;
      last = breakpoints[i].uplimit;
      while (j--) {
        colors.push(breakpoints[i].color);
      }
    }
    return colors;
  }

  function genCustomSectors(breakpoints) {
    var sectors = [];
    var last = 0;
    for (i in breakpoints) {
      var sector = {
        color: breakpoints[i].color,
        lo: last,
        hi: breakpoints[i].uplimit
      };
      last = breakpoints[i].uplimit;
      sectors.push(sector);
    }
    return sectors;
  }

  function toggle() {
    flag = !flag;
    draw();
  }

  $prev.on("click", toggle);
  $next.on("click", toggle);

  preProcessData();
  this.draw = draw;
};
