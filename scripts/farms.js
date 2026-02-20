let FARMS = [];

function normalize(s){ return (s || '').toLowerCase(); }

function matchesUseCase(farm, use) {
  if (!use) return true;

  const tags = (farm.tags || []).map(normalize);
  const rec = (farm.quality?.recommended_use_en || []).map(normalize).join(' ');
  const all = tags.join(' ') + ' ' + rec;

  if (use === 'ice') return all.includes('ice');
  return all.includes(normalize(use));
}

function matchesMilling(farm, milling) {
  if (!milling) return true;
  return normalize(farm.processing?.milling || '').includes(normalize(milling));
}

function scoreOf(farm){
  return farm.transparency_score?.total ?? 0;
}

function render(farms){
  const grid = document.getElementById('farmsGrid');
  if (!farms.length) {
    grid.innerHTML = `<div style="color:#666;">No farms match your filters.</div>`;
    return;
  }

  grid.innerHTML = farms.map(f => `
    <div class="farm-card">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div>
          <h3>${f.name.en}</h3>
          <div class="farm-meta">${f.region.en}</div>
        </div>
        <div class="score-badge">${scoreOf(f)}/100</div>
      </div>

      <div class="farm-spec">
        <div><b>Shading:</b> ${f.cultivation?.shading_days ?? '—'} days</div>
        <div><b>Harvest:</b> ${f.cultivation?.harvest_window_en ?? '—'}</div>
        <div><b>Milling:</b> ${f.processing?.milling ?? '—'}</div>
        <div><b>Best for:</b> ${(f.quality?.recommended_use_en || []).join(', ') || '—'}</div>
      </div>

      <div>
        ${(f.tags||[]).slice(0,6).map(t => `<span class="pill">${t}</span>`).join('')}
      </div>

      <div class="farm-actions">
        <a class="btn primary" href="farm.html?id=${encodeURIComponent(f.id)}">View Farm</a>
        <a class="btn" href="cafes.html#samples">Request Samples</a>
      </div>
    </div>
  `).join('');
}

function applyFilters(){
  const region = document.getElementById('regionFilter').value;
  const use = document.getElementById('useFilter').value;
  const milling = document.getElementById('millingFilter').value;
  const minScore = parseInt(document.getElementById('minScoreFilter').value || '0', 10);

  const active = FARMS.filter(f => f.status === 'active');

  const filtered = active.filter(f => {
    if (region && f.region.en !== region) return false;
    if (!matchesUseCase(f, use)) return false;
    if (!matchesMilling(f, milling)) return false;
    if (scoreOf(f) < minScore) return false;
    return true;
  });

  render(filtered);
}

async function init(){
  const res = await fetch('data/farms.json');
  FARMS = await res.json();

  ['regionFilter','useFilter','millingFilter','minScoreFilter']
    .forEach(id => document.getElementById(id).addEventListener('change', applyFilters));

  applyFilters();
}

// Error handling wrapper
async function initWithErrorHandling() {
  try {
    await init();
  } catch (error) {
    console.error('Error initializing farms page:', error);
    const grid = document.getElementById('farmsGrid');
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; color: #d32f2f; padding: 20px; background: #ffebee; border: 1px solid #ef5350; border-radius: 2px;">
          <strong>Error Loading Farms</strong><br>
          <span style="font-size: 12px;">Unable to load farms data. Please refresh the page or contact support.</span>
        </div>
      `;
    }
  }
}

initWithErrorHandling();