let url = "http://www.mocky.io/v2/5e3186623200002b008885ee";
var map;

window.onload = function loadPage(){
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            mapInit(data.center); // Initialize map using center coordinates
            // addDefaultData(data.def);
            fetchDataForNode(data.def);
            return data.markers;
        })
        .then((data) =>{
            addAllMarkers(data);
        });
}

function mapInit(center) {
    map = new MapmyIndia.Map("map",{ center:[center.lat, center.lng],zoomControl: true,hybrid:true,zoom:4 });
}

function addAllMarkers(markers){
    markers.forEach(element => {
        addMarker(element);
    });
}

function addMarker(mk){
    let tempMk = new L.marker([mk.lat, mk.lng]).addTo(map);
    tempMk.on("click", function (e) {
        console.log(mk);
        fetchDataForNode(mk);
    })
    return tempMk;
}

// function addDefaultData(props){
//     // Something to fetch data of default city
//     return;
// }

function fetchDataForNode(props){
    // Fetch a data for node "props"
    // let property_div = document.getElementById("pm2_5");
    // property_div.innerHTML = "20,20,20,20,20,20,20";
    $('.sparkbar.pm10').sparkline([1,5,-1,-10,20], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
    // console.log("Fetching data for ");
    // console.log(props);
}