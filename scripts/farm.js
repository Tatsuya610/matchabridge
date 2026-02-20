function params() { return new URLSearchParams(location.search); }
function getId() { return params().get('id'); }
function getLang() { return (params().get('lang') || 'en').toLowerCase(); }

async function init(){
  const id = getId();
  const lang = getLang();

  // language toggle link
  const p = params();
  p.set('lang', lang === 'ja' ? 'en' : 'ja');
  document.getElementById('ctaLang').href = `farm.html?${p.toString()}`;
  document.getElementById('ctaLang').textContent = (lang === 'ja') ? 'English' : '日本語';

  const res = await fetch('data/farms.json');
  const farms = await res.json();
  const farm = farms.find(f => f.id === id);

  if (!farm) {
    document.getElementById('farmRoot').innerHTML = `<h2>Farm not found.</h2>`;
    return;
  }

  // inactive banner
  if (farm.status !== 'active') {
    document.getElementById('farmBanner').innerHTML = `
      <div class="banner">
        ${lang === 'ja'
          ? '現在この農園からの新規受注は停止中です。代替案をご提案しますのでお問い合わせください。'
          : 'Currently not accepting new orders from this partner farm. Contact us for alternatives.'}
      </div>`;
  }

  const name = (lang === 'ja' ? farm.name.ja : farm.name.en);
  const region = (lang === 'ja' ? farm.region.ja : farm.region.en);
  const headline = (lang === 'ja' ? farm.hero.headline_ja : farm.hero.headline_en);

  document.getElementById('farmName').textContent = name;
  document.getElementById('farmRegion').textContent = region;
  document.getElementById('farmHeadline').textContent = headline;

  // i18n labels
  const t = (en, ja) => (lang === 'ja' ? ja : en);
  document.getElementById('producerTitle').textContent = t('Producer Voice', '生産者の声');
  document.getElementById('producerSub').textContent = t('Video verification & on-site stories', '現場映像とともにご紹介');
  document.getElementById('perfTitle').textContent = t('Cafe Performance', 'カフェでの再現性');
  document.getElementById('perfSub').textContent = t('What matters behind the bar', 'バリスタ視点で重要なポイント');
  document.getElementById('overviewTitle').textContent = t('Farm Overview', '農園概要');
  document.getElementById('overviewSub').textContent = t('Cultivation & processing', '栽培と加工');
  document.getElementById('traceTitle').textContent = t('Traceability', 'トレーサビリティ');
  document.getElementById('traceSub').textContent = t('Lot-level documentation', 'ロット単位の記録');
  document.getElementById('scoreTitle').textContent = t('Transparency Score', '透明性スコア');
  document.getElementById('scoreSub').textContent = t('Quantified trust signals', '信頼を数値化');
  document.getElementById('bestForLabel').textContent = t('Best for:', 'おすすめ用途：');

  // videos
  const videos = farm.videos || [];
  document.getElementById('farmVideos').innerHTML = videos.length
    ? videos.map(v => `
        <div>
          <div class="sub" style="margin-top:8px;">${lang === 'ja' ? v.title_ja : v.title_en}</div>
          <div class="video-wrap">
            <iframe src="${v.src}" title="${lang === 'ja' ? v.title_ja : v.title_en}" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>
      `).join('')
    : `<p class="sub">${t('Videos coming soon.', '動画は準備中です。')}</p>`;

  // performance
  document.getElementById('farmNotes').textContent = t(farm.quality?.notes_en || '', farm.quality?.notes_ja || '');
  document.getElementById('farmBestFor').textContent = (lang === 'ja'
    ? (farm.quality?.recommended_use_ja || []).join('、')
    : (farm.quality?.recommended_use_en || []).join(', ')
  ) || '—';

  // KPIs
  document.getElementById('farmKpis').innerHTML = `
    <div><b>${t('Harvest', '収穫')}</b>: ${t(farm.cultivation?.harvest_window_en, farm.cultivation?.harvest_window_ja) || '—'}</div>
    <div><b>${t('Shading', '被覆')}</b>: ${(farm.cultivation?.shading_days ?? '—')} ${t('days', '日')}</div>
    <div><b>${t('Steaming', '蒸し')}</b>: ${(farm.processing?.steaming_seconds ?? '—')} ${t('sec', '秒')}</div>
    <div><b>${t('Milling', '製粉')}</b>: ${(farm.processing?.milling ?? '—')}</div>
    <div><b>${t('Storage', '保管')}</b>: ${(farm.processing?.storage ?? '—')}</div>
  `;

  // tags
  document.getElementById('farmTags').innerHTML = (farm.tags || []).map(tag => `<span class="pill">${tag}</span>`).join('');

  // products
  const products = farm.products || [];
  document.getElementById('farmProducts').innerHTML = products.length
    ? products.map(prod => `
        <div class="product-card">
          <div class="product-image" style="${prod.image ? `background-image: url('${prod.image}');` : ''}">
            ${!prod.image ? t('Image coming soon', '画像準備中') : ''}
          </div>
          <div class="product-info">
            <div class="product-name">${lang === 'ja' ? (prod.name_ja || prod.name_en) : prod.name_en}</div>
            <div class="product-details">Grade ${prod.grade} • ${prod.size}</div>
          </div>
        </div>
      `).join('')
    : `<p class="sub">${t('Product lineup coming soon.', '商品ラインナップは準備中です。')}</p>`;

  // i18n for products section
  document.getElementById('productsTitle').textContent = t('Product Lineup', '商品ラインナップ');
  document.getElementById('productsSub').textContent = t('Available products', '取り扱い商品');

  // traceability
  document.getElementById('farmTrace').innerHTML = `
    <div><b>${t('Lot example', 'ロット例')}</b>: ${farm.traceability?.lot_example || '—'}</div>
    <div class="sub" style="margin-top:6px;">
      ${t('Recorded', '記録')}: ${(lang === 'ja'
        ? (farm.traceability?.records_ja || [])
        : (farm.traceability?.records_en || [])
      ).join(' / ') || '—'}
    </div>
  `;

  // score
  const s = farm.transparency_score;
  document.getElementById('farmScore').textContent = s ? `${s.total}/100` : '—';
  document.getElementById('farmScoreBreakdown').textContent = s
    ? `Traceability ${s.traceability} · Verification ${s.verification} · Quality ${s.quality} · Craft ${s.craft} · Cafe-ready ${s.cafe_ready}`
    : t('Score coming soon.', 'スコアは準備中です。');
}

// Error handling wrapper
async function initWithErrorHandling() {
  try {
    await init();
  } catch (error) {
    console.error('Error initializing farm page:', error);
    const farmRoot = document.getElementById('farmRoot');
    if (farmRoot) {
      farmRoot.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #d32f2f;">
          <h2 style="font-family: 'Crimson Text', serif; font-size: 28px; margin-bottom: 12px;">Error Loading Farm Details</h2>
          <p style="font-size: 13px; color: #666;">
            Unable to load farm information. The farm may not exist or there's a network issue.
            <br><a href="farms.html" style="color: #1a1a1a; text-decoration: underline;">← Back to Farms</a>
          </p>
        </div>
      `;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithErrorHandling);
} else {
  initWithErrorHandling();
}