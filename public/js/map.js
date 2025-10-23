mapboxgl.accessToken = mapToken;
let map, marker;

function initializeMap(coordinates, title) {
  if (map) {
    map.remove();
  }

  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 12,
  });

  const el = document.createElement("div");
  el.className = "custom-pin";
  el.innerHTML = '<i class="fa-solid fa-house"></i>';

  marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({
        offset: 25,
        className: "custom-listing-popup",
      }).setHTML(
        `<h3>${title}</h3><p>Exact Location Provided After Booking</p>`
      )
    )
    .addTo(map);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function updateMapLocation() {
  const locationInput = document.getElementById("location-input");
  const countryInput = document.getElementById("country-input");

  if (!locationInput || !countryInput) return;

  const location = locationInput.value;
  const country = countryInput.value;

  if (!location || !country) return;

  const query = `${location}, ${country}`;

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxgl.accessToken}&limit=1`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const newCoordinates = data.features[0].center;

      map.flyTo({
        center: newCoordinates,
        zoom: 12,
        duration: 1500,
      });

      marker.setLngLat(newCoordinates);
      marker.setPopup(
        new mapboxgl.Popup({
          offset: 25,
          className: "custom-listing-popup",
        }).setHTML(
          `<h3>${location}</h3><p>Exact Location Provided After Booking</p>`
        )
      );
    }
  } catch (error) {
    console.error("Error geocoding location:", error);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  if (
    typeof coordinates !== "undefined" &&
    typeof listingTitle !== "undefined"
  ) {
    initializeMap(coordinates, listingTitle);

    const debouncedUpdate = debounce(updateMapLocation, 1000);
    const locationInput = document.getElementById("location-input");
    const countryInput = document.getElementById("country-input");

    if (locationInput && countryInput) {
      locationInput.addEventListener("input", debouncedUpdate);
      countryInput.addEventListener("input", debouncedUpdate);
      locationInput.addEventListener("blur", updateMapLocation);
      countryInput.addEventListener("blur", updateMapLocation);
    }
  }
});
