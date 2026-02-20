console.log('farms-svg.js loaded');

/**
 * MatchaBack Farms Map (SVG Japan)
 * 
 * ピン配置ロジック（統一方式）:
 * すべてのファームは必ず prefecture_code (都道府県コード 1-47) を指定
 * 
 * 処理フロー:
 * 1. farms.json から全アクティブファームを読み込み
 * 2. prefecture_code でグループ化
 * 3. 各グループ（都道府県）ごとにSVG図形から中心位置を自動計算
 * 4. 計算した位置にピンを配置
 * 5. 同じ県に複数ファームある場合はタブで切り替え表示
 * 
 * 新規ファーム追加時の指定方法:
 * 基本は prefecture_code だけで OK
 * 例: { "prefecture_code": 27, "region": "大阪", ... }
 */

let farms = [];
let selectedFarmId = null;
let selectedFarmGroup = []; // 同じ位置に複数のfarmsがある場合
let svgElement = null;

// Approximate bounds for Japan (tune if needed for better alignment)
const MAP_BOUNDS = {
  minLat: 30.0,
  maxLat: 46.0,
  minLng: 128.0,
  maxLng: 146.0
};

function latLngToPercent(lat, lng) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x, y };
}

async function loadJapanSvg() {
  const container = document.getElementById('mapSvgContainer');
  if (!container) {
    console.error('mapSvgContainer not found');
    return;
  }

  const res = await fetch('/map-full.svg');
  if (!res.ok) {
    const error = `Failed to load Japan SVG map: ${res.status}`;
    console.error(error);
    throw new Error(error);
  }

  const svgText = await res.text();
  container.innerHTML = svgText;
  svgElement = container.querySelector('svg');
  
  if (!svgElement) {
    console.error('SVG element not found in loaded content');
    return;
  }
  
  const vb = svgElement.viewBox.baseVal;
  console.log(`SVG loaded successfully. viewBox: ${vb.x}, ${vb.y}, ${vb.width}, ${vb.height}`);
  console.log(`Prefecture elements found: ${svgElement.querySelectorAll('.prefecture').length}`);
}

function getPrefectureCenterPercent(code) {
  if (!svgElement) {
    console.warn(`Prefecture ${code}: SVG element not loaded`);
    return null;
  }

  const target = svgElement.querySelector(`.prefecture[data-code="${code}"]`);
  if (!target) {
    console.warn(`Prefecture ${code}: not found in SVG`);
    return null;
  }

  try {
    // Method 1: 実際に描画された位置を使う (getBoundingClientRect)
    const bbox = target.getBBox();
    const screenBBox = target.getBoundingClientRect();

    if (screenBBox.width > 0 && screenBBox.height > 0) {
      const screenCenterX = screenBBox.left + screenBBox.width / 2;
      const screenCenterY = screenBBox.top + screenBBox.height / 2;

      const mapPinsElement = document.getElementById('mapPins');
      if (mapPinsElement) {
        const mapPinsRect = mapPinsElement.getBoundingClientRect();
        const relX = screenCenterX - mapPinsRect.left;
        const relY = screenCenterY - mapPinsRect.top;

        const x = (relX / mapPinsRect.width) * 100;
        const y = (relY / mapPinsRect.height) * 100;

        if (!Number.isNaN(x) && !Number.isNaN(y)) {
          console.log(`Prefecture ${code}: (Method 1 - rendered) x=${x.toFixed(2)}%, y=${y.toFixed(2)}%`);
          return { x, y };
        }
      }
    }
  } catch (e) {
    console.warn(`Prefecture ${code}: Method 1 error: ${e.message}`);
  }

  try {
    // Method 2: ローカル座標とCTMを使う
    const bbox = target.getBBox();
    const localCenterX = bbox.x + bbox.width / 2;
    const localCenterY = bbox.y + bbox.height / 2;

    const point = svgElement.createSVGPoint();
    point.x = localCenterX;
    point.y = localCenterY;

    const ctm = target.getCTM();
    if (!ctm) {
      console.warn(`Prefecture ${code}: No CTM available`);
      return null;
    }

    const transformedPoint = point.matrixTransform(ctm);
    const vb = svgElement.viewBox.baseVal;

    if (vb && vb.width > 0 && vb.height > 0) {
      const x = ((transformedPoint.x - vb.x) / vb.width) * 100;
      const y = ((transformedPoint.y - vb.y) / vb.height) * 100;

      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        console.log(`Prefecture ${code}: (Method 2 - CTM) x=${x.toFixed(2)}%, y=${y.toFixed(2)}%`);
        return { x, y };
      }
    }
  } catch (e) {
    console.warn(`Prefecture ${code}: Method 2 error: ${e.message}`);
  }

  console.warn(`Prefecture ${code}: All methods failed`);
  return null;
}

function groupFarmsByPosition(activeFarms) {
  // 位置ごとにfarmsをグループ化
  // prefecture_codeで都道府県単位のグループを作成
  const groups = {};
  
  activeFarms.forEach(farm => {
    if (typeof farm.prefecture_code === 'number') {
      const key = `pref_${farm.prefecture_code}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(farm);
    } else {
      // prefecture_codeなしは個別グループ
      const key = `farm_${farm.id}`;
      groups[key] = [farm];
    }
  });
  
  return groups;
}

function createSharedPin(farmGroup, position) {
  // farmGroupは同じ位置にあるfarmsの配列
  // positionは { x, y } 
  
  const pin = document.createElement('div');
  pin.className = 'map-pin';
  pin.style.left = `${position.x}%`;
  pin.style.top = `${position.y}%`;
  
  // 複数のfarmsがある場合、最初のID、なければグループのkey
  if (farmGroup.length === 1) {
    pin.dataset.farmId = farmGroup[0].id;
  } else {
    pin.dataset.farmGroup = farmGroup.map(f => f.id).join(',');
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Select farm (${farmGroup.length})`);
  button.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c-2.8 0-5 2.2-5 5 0 3.9 4.5 7.7 4.8 8 .1.1.2.2.2.2s.1-.1.2-.2c.3-.3 4.8-4.1 4.8-8 0-2.8-2.2-5-5-5zm0 7.2c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2 1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2z" />
    </svg>
  `;

  button.addEventListener('click', () => {
    if (farmGroup.length === 1) {
      selectFarm(farmGroup[0].id);
    } else {
      selectFarmGroup(farmGroup);
    }
  });
  
  pin.appendChild(button);
  return pin;
}

function renderPins(activeFarms) {
  const pinsContainer = document.getElementById('mapPins');
  if (!pinsContainer) {
    console.error('mapPins container not found');
    return;
  }
  pinsContainer.innerHTML = '';

  // SVGが描画されるまで少し待つ
  setTimeout(() => {
    const groups = groupFarmsByPosition(activeFarms);
    console.log(`Rendering ${Object.keys(groups).length} pin groups from ${activeFarms.length} farms`);

    Object.entries(groups).forEach(([groupKey, farmGroup]) => {
      if (!farmGroup[0].prefecture_code) {
        console.warn(`  Group "${groupKey}": prefecture_code not specified`);
        return;
      }

      let position;

      // Special case: Kagoshima (46) uses lat/lng positioning due to SVG coordinate issues
      if (farmGroup[0].prefecture_code === 46 && farmGroup[0].lat && farmGroup[0].lng) {
        position = latLngToPercent(farmGroup[0].lat, farmGroup[0].lng);
        console.log(`Prefecture 46: (lat/lng) x=${position.x.toFixed(2)}%, y=${position.y.toFixed(2)}%`);
      } else {
        // SVGの都道府県図形から中心位置を自動計算
        position = getPrefectureCenterPercent(farmGroup[0].prefecture_code);
      }
      
      if (!position) {
        console.warn(`  Group "${groupKey}": Failed to calculate position for prefecture_code ${farmGroup[0].prefecture_code}`);
        return;
      }

      const pin = createSharedPin(farmGroup, position);
      console.log(`  Pin group "${groupKey}" (${farmGroup.length} farms) - prefecture_code ${farmGroup[0].prefecture_code} at ${position.x.toFixed(2)}%, ${position.y.toFixed(2)}%`);
      pinsContainer.appendChild(pin);
    });
  }, 100); // 100msの遅延でSVG描画を待つ
}

function updatePinStates() {
  document.querySelectorAll('.map-pin').forEach(pin => {
    const farmId = pin.dataset.farmId;
    if (farmId === selectedFarmId) {
      pin.classList.add('active');
    } else {
      pin.classList.remove('active');
    }
  });
}

function selectFarm(farmId) {
  selectedFarmId = farmId;
  selectedFarmGroup = [farms.find(f => f.id === farmId)].filter(Boolean);
  updatePinStates();

  const farm = farms.find(f => f.id === farmId);
  if (farm) {
    showFarmDetails(farm);
  }
}

function selectFarmGroup(farmGroup) {
  // 複数のfarmsを選択
  selectedFarmGroup = farmGroup;
  selectedFarmId = null;
  updatePinStates();
  
  if (farmGroup.length === 1) {
    // 1つだけの場合は通常表示
    showFarmDetails(farmGroup[0]);
  } else {
    // 複数の場合、リスト表示
    showFarmGroupDetails(farmGroup);
  }
}

function showFarmGroupDetails(farmGroup) {
  const panel = document.getElementById('farmDetailPanel');
  if (!panel) return;

  const farmListHtml = farmGroup.map((farm, idx) => `
    <div class="farm-list-item ${idx === 0 ? 'active' : ''}" data-farm-id="${farm.id}" onclick="selectFarm('${farm.id}')">
      ${farm.name.en}
      <small>${farm.region.en}</small>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="farm-list-container">
      <div style="flex: 0 0 auto;">
        <h3 style="font-size: 14px; margin-bottom: 10px; font-weight: 600;">複数の農園があります</h3>
        <div class="farm-list">
          ${farmListHtml}
        </div>
      </div>
      <div id="farmDetailsArea" style="flex: 1; overflow-y: auto;"></div>
    </div>
  `;

  // 最初のfarmを表示
  showFarmDetails(farmGroup[0]);
}

function showFarmDetails(farm) {
  // 複数ファーム表示時はfarmDetailsAreaに、単独時はpanelに出力
  const detailsAreaElement = document.getElementById('farmDetailsArea');
  const targetElement = detailsAreaElement || document.getElementById('farmDetailPanel');
  
  if (!targetElement) return;

  // Tea characteristics: use farm.tea_characteristics if available
  const characteristics = farm.tea_characteristics || [];

  const video = farm.videos && farm.videos.length > 0 ? farm.videos[0] : null;
  const videoHTML = video ? `
    <div class="farm-detail-section">
      <h4>Image Video</h4>
      <div class="video-wrap">
        <iframe
          src="${video.src}"
          title="${video.title_en}"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  ` : '';

  // Producer type section
  const producerTypeHTML = farm.producer_type ? `
    <div class="farm-detail-section" style="font-size: 13px;">
      <div><strong>Producer Type:</strong> ${farm.producer_type}</div>
    </div>
  ` : '';

  const innerHTML = `
    <div class="farm-detail-header">
      <h3>${farm.name.en}</h3>
      <div class="region">${farm.region.en}</div>
      <div class="founded">Founded ${farm.founded_year}</div>
    </div>

    ${producerTypeHTML}

    <div class="farm-detail-section">
      <h4>Overview</h4>
      <p>${farm.overview_en}</p>
    </div>

    <div class="farm-detail-section">
      <h4>Tea Characteristics</h4>
      <div class="tea-characteristics">
        ${characteristics.map(tag => `<span class="tea-char-tag">${tag}</span>`).join('')}
      </div>
    </div>

    ${videoHTML}

    <div class="farm-detail-section">
      <a href="farm.html?id=${farm.id}" class="cta-button">View Full Details →</a>
    </div>
  `;

  if (detailsAreaElement) {
    // 複数ファーム表示時
    detailsAreaElement.innerHTML = innerHTML;
    // アクティブスタイルを更新
    document.querySelectorAll('.farm-list-item').forEach(item => {
      if (item.dataset.farmId === farm.id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  } else {
    // 単独表示時
    targetElement.innerHTML = innerHTML;
  }
}

async function initFarmsMap() {
  if (location.protocol === 'file:') {
    showErrorPanel('Please open this page via an HTTP server (e.g., `python3 -m http.server 8000`) to load data.');
    return;
  }

  try {
    await loadJapanSvg();
  } catch (error) {
    console.error('Error loading Japan SVG map:', error);
    const container = document.getElementById('mapSvgContainer');
    if (container) {
      container.innerHTML = '<p style="color:#d32f2f; font-size:12px;">Map failed to load.</p>';
    }
  }

  try {
    const res = await fetch('/data/farms.json');
    if (!res.ok) throw new Error(`Failed to load farms data: ${res.status}`);
    farms = await res.json();

    const activeFarms = farms.filter(f => f.status === 'active');
    renderPins(activeFarms);

    if (activeFarms.length > 0) {
      selectFarm(activeFarms[0].id);
    }
  } catch (error) {
    console.error('Error loading farms data:', error);
    showErrorPanel('Unable to load farms data. Please refresh the page.');
  }
}

function showErrorPanel(message) {
  const panel = document.getElementById('farmDetailPanel');
  if (!panel) return;
  panel.innerHTML = `
    <div style="color: #d32f2f; padding: 20px; background: #ffebee; border: 1px solid #ef5350; border-radius: 2px;">
      <strong>Error</strong><br>
      <span style="font-size: 12px;">${message}</span>
    </div>
  `;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFarmsMap);
} else {
  initFarmsMap();
}
