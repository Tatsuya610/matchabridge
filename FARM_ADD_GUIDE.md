# Farm Addition Guide

## Points to Note When Adding Farms to farms.json

### How to Specify Pin Position on Map

#### ✅ Recommended: Use prefecture_code (Prefecture Unit)

```json
{
  "id": "new-farm-osaka",
  "status": "active",
  "name": { "en": "Farm Name", "ja": "農園名" },
  "region": { "en": "City, Prefecture", "ja": "都道府県・市町村" },
  "prefecture_code": 27,  // Osaka = 27
  "lat": 34.5,
  "lng": 135.5,
  "founded_year": 2020
}
```

**Benefits:**
- ✅ Simple - just specify prefecture_code
- ✅ Auto-positioned - center calculated automatically from SVG
- ✅ Better maintainability - no position drift issues
- ✅ Operational efficiency - no confusion when adding new farms

**Prefecture Code (Main Regions):**
- 22: Shizuoka / 23: Aichi / 26: Kyoto
- 27: Osaka / 28: Hyogo / 46: Kagoshima
- Full list: https://en.wikipedia.org/wiki/Prefectures_of_Japan

---

## Multiple Farms Per Location (Pin Overlap)

**When multiple farms have the same prefecture_code:**
- Automatically grouped together
- Selectable by tab in the right panel

Example:
```json
[
  {
    "id": "farm-kyoto-1",
    "prefecture_code": 26,
    "name": { "en": "Kyoto Farm 1", "ja": "京都農園1" },
    ...
  },
  {
    "id": "farm-kyoto-2", 
    "prefecture_code": 26,  // Same prefecture
    "name": { "en": "Kyoto Farm 2", "ja": "京都農園2" },
    ...
  }
]
```

→ Single pin displayed on Kyoto; click to switch between farms via tabs

---

## Position Verification

### Using the Debug Page
Visit `http://localhost:8000/debug.html`

- Verify calculated position for each prefecture
- ✅ / ❌ indicators show accuracy
- Adjust values if needed

---

## JSON Entry Examples

### Example 1: New Farm (Osaka)
```json
{
  "id": "new-farm-osaka",
  "status": "active",
  "name": { "en": "Osaka Matcha", "ja": "大阪抹茶" },
  "region": { "en": "Osaka", "ja": "大阪" },
  "prefecture_code": 27,
  "lat": 34.6762,
  "lng": 135.5023,
  "founded_year": 2020,
  "overview_en": "...",
  "overview_ja": "...",
  "tags": ["osaka", "..."],
  ...
}
```

### Example 2: Multiple Farms in Kyoto
```json
{
  "id": "farm-kyoto-uji",
  "prefecture_code": 26,
  "region": { "en": "Uji, Kyoto", "ja": "京都・宇治" },
  ...
},
{
  "id": "farm-kyoto-yame",
  "prefecture_code": 26,
  "region": { "en": "Yame, Kyoto", "ja": "京都・八女" },
  ...
}
```

→ Both positioned at Kyoto center (multiple farms selectable by tab)

---

## Troubleshooting

### Pin Not Displaying

1. **Verify `status` is `"active"`**
   ```json
   "status": "active"  // ← Required
   ```

2. **Verify `prefecture_code` is set**
   ```json
   "prefecture_code": 27  // ← Required
   ```

3. **Verify prefecture_code is within 1-47 range**

4. **Check browser console (F12) for errors**

### Pin Position Incorrect

1. Verify using debug page (`http://localhost:8000/debug.html`)
2. May be an SVG rendering engine issue → check GitHub Issues
3. Report issue if needed

---

## Complete prefecture_code List

| Code | Prefecture | Code | Prefecture |
|------|------------|------|------------|
| 1 | Hokkaido | 25 | Shiga |
| 2 | Aomori | 26 | **Kyoto** |
| 3 | Iwate | 27 | **Osaka** |
| 4 | Miyagi | 28 | **Hyogo** |
| 5 | Akita | 29 | Nara |
| 6 | Yamagata | 30 | Wakayama |
| 7 | Fukushima | 31 | Tottori |
| 8 | Ibaraki | 32 | Shimane |
| 9 | Tochigi | 33 | Okayama |
| 10 | Gunma | 34 | Hiroshima |
| 11 | Saitama | 35 | Yamaguchi |
| 12 | Chiba | 36 | Tokushima |
| 13 | Tokyo | 37 | Kagawa |
| 14 | Kanagawa | 38 | Ehime |
| 15 | Niigata | 39 | Kochi |
| 16 | Toyama | 40 | Fukuoka |
| 17 | Ishikawa | 41 | Saga |
| 18 | Fukui | 42 | Nagasaki |
| 19 | Yamanashi | 43 | Kumamoto |
| 20 | Nagano | 44 | Oita |
| 21 | Gifu | 45 | Miyazaki |
| 22 | **Shizuoka** | 46 | **Kagoshima** |
| 23 | **Aichi** | 47 | Okinawa |
| 24 | Mie | | |

**※ Bold = Current farm locations**

---

## Implementation Overview

1. **Grouping**
   - Farms grouped by prefecture_code
   - Multiple farms in same prefecture automatically become one pin

2. **Position Calculation**
   - `getPrefectureCenterPercent(code)` calculates prefecture center
   - Computed mathematically from SVG shapes

3. **Display**
   - Pins placed at calculated positions
   - Multiple farms switchable by tab

---

## Known Issues & Workarounds

### 🚨 Geolonia SVG Coordinate Bug (prefecture_code 46 - Kagoshima)

**Issue:**
- Geolonia SVG map had incorrect coordinates for Kagoshima (46)
- SVG translate value was pointing toward the Sea of Japan instead of Kyushu

**Solution:**
- Kagoshima only: **switched to lat/lng-based direct positioning**
- Code: conditional branch in `scripts/farms-svg.js` `renderPins()` function
- **If another prefecture shows this issue:**
  1. Check console output for pin position %
  2. Add same exception logic to `renderPins()`
  3. Use that prefecture's lat/lng coordinates

**Implementation Example (Kagoshima):**
```javascript
if (farmGroup[0].prefecture_code === 46 && farmGroup[0].lat && farmGroup[0].lng) {
  position = latLngToPercent(farmGroup[0].lat, farmGroup[0].lng);
}
```

**Reference Coordinates:**
- Kagoshima: lat=31.939, lng=130.765
- MAP_BOUNDS: minLat=30.0, maxLat=46.0, minLng=128.0, maxLng=146.0
