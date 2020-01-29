let url = "http://www.amock.io/api/theweblover/ihp";
let map;

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

function fetchDataForNode(props){
    // Fetch a data for node "props"
    console.log(`${url}/${props.id}`);
    fetch(`${url}/${props.id}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let aqi = document.getElementById("aqi");
            aqi.value = data.aqi;
            for(var property in data.pollutants) {
                $(`.sparkbar.${property}`).sparkline(data.pollutants[property], { type: 'bar', height: '20', barWidth: 40, barSpacing: 4, barColor: '#00C0DD', negBarColor: "#001DFF" });
            }
        });
}