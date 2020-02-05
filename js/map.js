let url2 = "https://app.cpcbccr.com/caaqms/fetch_table_data";
let url = "https://app.cpcbccr.com/caaqms/caaqms_landing_map_all";

let map;

window.onload = function loadPage(){
    // var apiHeaders = new Headers();
    // apiHeaders.append('Content-Type', 'text/xml');
    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.btoa(JSON.stringify({"region":"landing_dashboard"})),
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            mapInit(data.map.station_list[0]); // Initialize map using center coordinates
            console.log(data.map.station_list[0]);
            // addDefaultData(data.def);
            // fetchDataForNode(data.def); // To be uncommented
            return (data.map).station_list;
        })
        .then((station_list) =>{
            addAllMarkers(station_list);
        });
}

function mapInit(center) {
    map = new MapmyIndia.Map("map",{ center:[center.latitude, center.longitude],zoomControl: true,hybrid:true,zoom:4 });
}

function addAllMarkers(station_list){
    station_list.forEach(station => {
        addMarker(station);
    });
}

function addMarker(station){
    let tempMk = new L.marker([station.latitude, station.longitude]).addTo(map);
    tempMk.on("click", function (e) {
        console.log(station);
        fetchDataForNode(station);
    })
    return tempMk;
}

function fetchDataForNode(station){
    // Fetch a data for node "props"
    // console.log(`${url2}/${station.id}`);
    // fetch(`${url2}/${station.id}`)
    //     .then((response) => {
    //         return response.json();
    //     })
    //     .then((data) => {
    //         let aqi = document.getElementById("aqi");
    //         let location = document.getElementById("location");
    //         aqi.value = data.aqi;
    //         location.innerHTML = data.name;
    //         for(var property in data.pollutants) {
    //             $(`.sparkbar.${property}`).sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
    //         }
    //     });
    // let aqi = document.getElementById("aqi");
    // let location = document.getElementById("location");
    // // aqi.value = station.aqi;
    // location.innerHTML = station.station_name;
    // for(var property in station.Ambient.AAQMS.parameter_map) {
    //     if(property.parameter_name == "PM2.5"){
    //         $(`.sparkbar.${property}`).sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
    //     }
    //     else{
    //         $(`.sparkbar.${property}`).sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
    //     }
    // }

    console.log(`${url2}`);
    let currentDateAndTime = new Date();
    let tenHrsBeforeDateAndTime = new Date();

    currentDateAndTime.setMinutes(0);
    tenHrsBeforeDateAndTime.setMinutes(0);

    // tenHrsBeforeDateAndTime.setDate(tenHrsBeforeDateAndTime.getDate()-1);
    tenHrsBeforeDateAndTime.setHours(tenHrsBeforeDateAndTime.getHours()-11);



    // console.log(currentDateAndTime);
    console.log(getDateAndTimeAsString(tenHrsBeforeDateAndTime),);
    console.log(getDateAndTimeAsString(currentDateAndTime),);


    fetch(`${url2}`,{
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: this.btoa(JSON.stringify({
            "draw": 1,
            "columns": [
              {
                "data": 0,
                "name": "",
                "searchable": true,
                "orderable": false,
                "search": {
                  "value": "",
                  "regex": false
                }
              }
            ],
            "order": [],
            "start": 0,
            "length": 200,
            "search": {
              "value": "",
              "regex": false
            },
            "filtersToApply": {
              "parameter_list": [
                {
                  "id": 0,
                  "itemName": "AT",
                  "itemValue": "parameter_204"
                },
                {
                  "id": 1,
                  "itemName": "BP",
                  "itemValue": "parameter_238"
                },
                {
                  "id": 2,
                  "itemName": "PM10",
                  "itemValue": "parameter_215"
                },
                {
                  "id": 3,
                  "itemName": "PM2.5",
                  "itemValue": "parameter_193"
                },
                {
                  "id": 4,
                  "itemName": "RH",
                  "itemValue": "parameter_235"
                },
                {
                  "id": 5,
                  "itemName": "SR",
                  "itemValue": "parameter_237"
                },
                {
                  "id": 6,
                  "itemName": "Temp",
                  "itemValue": "parameter_198"
                },
                {
                  "id": 7,
                  "itemName": "Toluene",
                  "itemValue": "parameter_232"
                },
                {
                  "id": 8,
                  "itemName": "WD",
                  "itemValue": "parameter_234"
                },
                {
                  "id": 9,
                  "itemName": "WS",
                  "itemValue": "parameter_233"
                },
                {
                  "id": 10,
                  "itemName": "CO",
                  "itemValue": "parameter_203"
                },
                {
                  "id": 11,
                  "itemName": "Benzene",
                  "itemValue": "parameter_202"
                },
                {
                  "id": 12,
                  "itemName": "P-Xylene",
                  "itemValue": "parameter_324"
                },
                {
                  "id": 13,
                  "itemName": "NH3",
                  "itemValue": "parameter_311"
                },
                {
                  "id": 14,
                  "itemName": "NO",
                  "itemValue": "parameter_226"
                },
                {
                  "id": 15,
                  "itemName": "NO2",
                  "itemValue": "parameter_194"
                },
                {
                  "id": 16,
                  "itemName": "NOx",
                  "itemValue": "parameter_225"
                },
                {
                  "id": 17,
                  "itemName": "Ozone",
                  "itemValue": "parameter_222"
                },
                {
                  "id": 18,
                  "itemName": "SO2",
                  "itemValue": "parameter_312"
                }
              ],
              "criteria": "1 Hours",
              "reportFormat": "Tabular",
              "fromDate": getDateAndTimeAsString(tenHrsBeforeDateAndTime),
              "toDate": getDateAndTimeAsString(currentDateAndTime),
              "station": "site_301",
              "parameter": [
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
              "parameterNames": [
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
            "pagination": 1
          })),
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            let aqi = document.getElementById("aqi");
            let location = document.getElementById("location");
            // aqi.value = data.aqi;
            location.innerHTML = data.name;
            // for(var property in data.pollutants) {
            //     $(`.sparkbar.${property}`).sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            // }
            for(param in data.data.siteInfo.parameters){
                let tempArray = [];
                
                for(var sample in data.data.tabularData.bodyContent){
                    tempArray.append(sample[param]);
                    // $('.sparkbar.pm25').sparkline(sample[param], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
                }
                if(param == "PM2.5"){
                    $('.sparkbar.pm25').sparkline(sample[param], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
                }
                else{
                    $(`.sparkbar.${param}`).sparkline(sample[param], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
                }
            }

            $('.sparkbar.').sparkline(data.data.tabularData.bodyContent[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            $('.sparkbar.').sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });

        });

}
            //   "fromDate": getDateAndTimeAsString(tenHrsBeforeDateAndTime),
            //   "toDate": getDateAndTimeAsString(currentDateAndTime),
function padData(input){
    console.log(input);
    return ("0" + input).slice(-2);
}

function getDateAndTimeAsString(dateObject){
    // let currentDateAndTime = new Date();
    console.log(dateObject);
    console.log(padData(dateObject.getDate())+"-"+padData(dateObject.getMonth()+1)+"-"+dateObject.getFullYear()+" "+"T"+padData(dateObject.getHours())+":"+padData(dateObject.getMinutes())+":"+"00"+"Z");
    return padData(dateObject.getDate())+"-"+padData(dateObject.getMonth()+1)+"-"+dateObject.getFullYear()+" "+"T"+padData(dateObject.getHours())+":"+padData(dateObject.getMinutes())+":"+"00"+"Z"
}