/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2FsaW16YWthcmkiLCJhIjoiY2w0MThodms5MGRzNDNlbnZ5OTJmZjZjMyJ9.evbFI31AJIVa51M_6f4DgQ';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/salimzakari/cl41ay1n7001714n0sx7ftup1', // style URL
    // center: [], // starting position [lng, lat]
    // zoom: 9, // starting zoom
    // interactive: false,
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popoup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `
        <p>Day ${loc.day}: ${loc.description}</p>
    `
      )
      .addTo(map);

    //Extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: { top: 200, left: 100, right: 100, bottom: 200 },
  });
};
