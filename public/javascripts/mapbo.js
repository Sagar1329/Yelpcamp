mapboxgl.accessToken = 'pk.eyJ1Ijoic2FnYXJnb3dkYTEzIiwiYSI6ImNsNGNkOWdhZDBiNTkzY281Y29zbWtibWkifQ._GELqP97PICbfN0oeSAjCw';
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v10', // style URL
  center:camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 10
   // starting zoom
  });
  new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset:30,closeButton: true,
closeOnClick: false})
.setHTML(
  `<h3>${camp.title}</h3><p>${camp.description}</p>`
)

    )
    .addTo(map)