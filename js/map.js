var url = "https://darshmap.free.beeceptor.com";

var props = getProps(url);
var map = mapInit(props.center);

function getProps(url) 
{
  let response = fetch(url);
  let data = response.json();
  return data;
}

function mapInit(center) {
    var tempMap = new MapmyIndia.Map("map",{ center:[center.lat, center.lng],zoomControl: true,hybrid:true,zoom:4 });
    return tempMap;
}