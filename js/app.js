// Initialize map
const map = L.map('map').setView([41.8781, -87.6298], 12); // Chicago center

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load park data
let parksLayer;

fetch('data/parks.geojson')
  .then(response => response.json())
  .then(data => {
    parksLayer = L.geoJSON(data, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`
          <strong>${feature.properties.name}</strong><br>
          Amenities: ${feature.properties.amenities.join(', ')}<br>
          <button onclick="saveFavorite('${feature.properties.name}')">Save to Favorites</button>
        `);
      }
    }).addTo(map);
  });

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
