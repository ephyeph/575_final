// Initialize map
const map = L.map('map').setView([41.8781, -87.6298], 12); // Chicago center

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load park data
let allParks = null;
let parksLayer = null;

fetch("data/parks.geojson")
  .then(response => response.json())
  .then(data => {
    allParks = data;
    updateMap();
  });

// Get filter elements
const filterPet = document.getElementById("filter-pet");
const filterRestroom = document.getElementById("filter-restroom");
const filterQuiet = document.getElementById("filter-quiet");

filterPet.addEventListener("change", updateMap);
filterRestroom.addEventListener("change", updateMap);
filterQuiet.addEventListener("change", updateMap);

// Main map update
function updateMap() {
  if (parksLayer) {
    map.removeLayer(parksLayer);
  }

  const selectedFilters = [];
  if (filterPet.checked) selectedFilters.push("Pet-friendly");
  if (filterRestroom.checked) selectedFilters.push("Restrooms");
  if (filterQuiet.checked) selectedFilters.push("Quiet Areas");

  const filteredFeatures = allParks.features.filter(feature => {
    const amenities = feature.properties.amenities || [];
    return selectedFilters.every(f => amenities.includes(f));
  });

  const filteredGeoJSON = {
    type: "FeatureCollection",
    features: filteredFeatures
  };

  // Render with style
  parksLayer = L.geoJSON(filteredGeoJSON, {
    style: function (feature) {
      const amenities = feature.properties.amenities || [];
      const count = amenities.length;

      if (count === 3) return { color: "#000", weight: 2, fillColor: "#ffc107", fillOpacity: 0.7 }; // gold
      if (count === 2) return { color: "#000", weight: 2, fillColor: "#17a2b8", fillOpacity: 0.6 }; // blue
      if (count === 1) return { color: "#000", weight: 2, fillColor: "#6f42c1", fillOpacity: 0.5 }; // purple
      return { color: "#999", weight: 1, fillColor: "#ccc", fillOpacity: 0.3 };
    },
    onEachFeature: (feature, layer) => {
      const amenities = feature.properties.amenities || [];
      layer.bindPopup(`
        <strong>${feature.properties.name || "Unnamed Park"}</strong><br>
        Amenities: ${amenities.join(", ")}<br>
        <button onclick="saveFavorite('${feature.properties.name || "Unnamed Park"}')">Save to Favorites</button>
      `);
    }
  }).addTo(map);

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

// Clear favorites
const clearBtn = document.getElementById("clear-favorites");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("favorites");
    updateFavoritesList();
  });
}

updateFavoritesList();

document.getElementById("locate-btn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Add a marker at user's location
      const userMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 You are here!")
        .openPopup();

      // Zoom to user's location
      map.setView([lat, lng], 14);
    },
    () => {
      alert("Unable to retrieve your location.");
    }
  );
});

