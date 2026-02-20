/**
 * MatchaBack Farms Map
 * Interactive map showing partner farms with details panel
 */

let map;
let farms = [];
let markers = {};
let selectedFarmId = null;

async function initMap() {
  // Restrict map view to Japan only
  const japanBounds = L.latLngBounds(
    [30.0, 128.0],
    [46.0, 146.0]
  );

  map = L.map('farmMap', {
    maxBounds: japanBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 5,
    maxZoom: 12
  }).fitBounds(japanBounds);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 12,
  }).addTo(map);

  // Load farms data
  try {
    const res = await fetch('/data/farms.json');
    if (!res.ok) throw new Error('Failed to load farms data');
    farms = await res.json();

    // Add only active farms to map
    const activeFarms = farms.filter(f => f.status === 'active');
    activeFarms.forEach(farm => {
      addFarmMarker(farm);
    });
  } catch (error) {
    console.error('Error loading farms:', error);
    showErrorMessage('Unable to load farms data');
  }
}

function addFarmMarker(farm) {
  if (!farm.lat || !farm.lng) return;

  // Create marker with custom icon
  const marker = L.circleMarker([farm.lat, farm.lng], {
    radius: 12,
    fillColor: '#2d5016',
    color: '#1a1a1a',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
    className: 'farm-marker'
  });

  marker.bindPopup(`<strong>${farm.name.en}</strong><br>${farm.region.en}`);

  // Click handler
  marker.on('click', () => {
    selectFarm(farm.id, marker);
  });

  marker.addTo(map);
  markers[farm.id] = marker;
}

function selectFarm(farmId, marker) {
  // Deselect previous farm
  if (selectedFarmId && markers[selectedFarmId]) {
    markers[selectedFarmId].setStyle({ fillColor: '#2d5016' });
  }

  // Select new farm
  selectedFarmId = farmId;
  if (marker) {
    marker.setStyle({ fillColor: '#ff6b6b' });
  }

  // Display farm details
  const farm = farms.find(f => f.id === farmId);
  if (farm) {
    showFarmDetails(farm);
  }
}

function showFarmDetails(farm) {
  const panel = document.getElementById('farmDetailPanel');

  // Build characteristics string from tags and recommended uses
  const characteristics = [
    ...(farm.tags || []),
    ...(farm.quality?.recommended_use_en || [])
  ].slice(0, 8);

  // Build video section HTML
  let videoHTML = '';
  if (farm.videos && farm.videos.length > 0) {
    videoHTML = `
      <div class="farm-video-section">
        <h4>Product Video</h4>
        <div class="video-wrap">
          <iframe 
            src="${farm.videos[0].src}" 
            title="${farm.videos[0].title_en}" 
            frameborder="0" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
  }

  const html = `
    <div class="farm-detail-header">
      <h2>${farm.name.en}</h2>
      <div class="region">${farm.region.en}</div>
      <div class="founded">Founded ${farm.founded_year}</div>
    </div>

    <div class="farm-detail-section">
      <h4>About This Farm</h4>
      <p>${farm.overview_en}</p>
    </div>

    <div class="farm-detail-section">
      <h4>Tea Characteristics</h4>
      <div class="tea-characteristics">
        ${characteristics.map(tag => `<span class="tea-char-tag">${tag}</span>`).join('')}
      </div>
    </div>

    <div class="farm-detail-section">
      <h4>Flavor Profile</h4>
      <p>${(farm.quality?.flavor_profile_en || []).join(', ')}</p>
    </div>

    ${videoHTML}

    <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #eee;">
      <a href="/farm.html?id=${farm.id}" class="cta-button">View Full Details →</a>
    </div>
  `;

  panel.innerHTML = html;
}

function showErrorMessage(message) {
  const panel = document.getElementById('farmDetailPanel');
  panel.innerHTML = `
    <div style="color: #d32f2f; padding: 20px; background: #ffebee; border: 1px solid #ef5350; border-radius: 2px;">
      <strong>Error</strong><br>
      <span style="font-size: 12px;">${message}</span>
    </div>
  `;
}

// Initialize map when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
