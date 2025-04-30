// Initialize map
const map = L.map('map').setView([41.8781, -87.6298], 12); // Chicago center

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load park data
let parksLayer;

let allParks = null;   // Store all loaded parks
let parksLayer = null; // Active layer shown on map

// Load the data
fetch("data/parks_all_with_amenities.geojson")
  .then(response => response.json())
  .then(data => {
    allParks = data;       // Store the full GeoJSON
    updateMap();           // Draw first version
  });

// Get filter elements
const filterPet = document.getElementById("filter-pet");
const filterRestroom = document.getElementById("filter-restroom");
const filterQuiet = document.getElementById("filter-quiet");

// Add listeners to checkboxes
filterPet.addEventListener("change", updateMap);
filterRestroom.addEventListener("change", updateMap);
filterQuiet.addEventListener("change", updateMap);

// Filter + render parks
function updateMap() {
  if (parksLayer) {
    map.removeLayer(parksLayer);
  }

  // Get selected filters
  const selectedFilters = [];
  if (filterPet.checked) selectedFilters.push("Pet-friendly");
  if (filterRestroom.checked) selectedFilters.push("Restrooms");
  if (filterQuiet.checked) selectedFilters.push("Quiet Areas");

  // Filter features based on selected amenities
  const filteredFeatures = allParks.features.filter(feature => {
    const amenities = feature.properties.amenities || [];
    // Every selected filter must be in this park's amenities
    return selectedFilters.every(f => amenities.includes(f));
  });

  // Create filtered GeoJSON object
  const filteredGeoJSON = {
    type: "FeatureCollection",
    features: filteredFeatures
  };

  // Render the filtered layer
  parksLayer = L.geoJSON(filteredGeoJSON, {
    onEachFeature: (feature, layer) => {
      const amenities = feature.properties.amenities || [];
      layer.bindPopup(`
        <strong>${feature.properties.name || "Unnamed Park"}</strong><br>
        Amenities: ${amenities.join(", ")}<br>
        <button onclick="saveFavorite('${feature.properties.name || "Unnamed Park"}')">Save to Favorites</button>
      `);
    }
  }).addTo(map);

  // Zoom to filtered results
  if (filteredFeatures.length > 0) {
    map.fitBounds(parksLayer.getBounds());
  }
}


// Save favorite parks
function saveFavorite(name) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(name)) {
    favorites.push(name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
  }
}

// Update favorites sidebar
function updateFavoritesList() {
  const list = document.getElementById('favorites-list');
  list.innerHTML = '';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    list.appendChild(li);
  });
}

updateFavoritesList();
