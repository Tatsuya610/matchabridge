# MatchaBack - Partner Farms Platform

A modern, interactive web platform for connecting Japanese matcha producers with international café partners. Built with vanilla HTML5, CSS3, and JavaScript.

## Features

### 🗺️ Interactive Farms Map
- Japan-wide map visualization showing partner farms
- Prefecture-based location pinning with precise coordinates
- Farm details on click/hover with producer information

### 🌾 Farm Profiles
- Detailed farm overview pages
- Producer type classification (farm/merchant)
- Tea characteristics and specialty information
- Product lineup with grades and sizes
- Traceability and lot-level documentation

### ☕ Café Resources
- Matcha preparation guide with multiple brewing methods
- Step-by-step instructions (Traditional, Latte, Smoothie, Dessert)
- Wholesale partner onboarding
- Educational content and FAQs

### 🌐 Multi-Language Support
- English and Japanese language toggle
- Context-aware language switching via URL parameters
- Seamless internationalization across all pages

### 🔒 Security Features
- Content Security Policy (CSP) headers
- Permissions policy for camera, microphone, geolocation
- Form validation and secure data handling
- Referrer policy for privacy

## Project Structure

```
/
├── index.html                 # Homepage
├── farms.html                 # Interactive farms map and directory
├── farm.html                  # Individual farm detail pages
├── cafes.html                 # Café partner resources and onboarding
├── contact.html               # Contact information
├── traceability.html          # Lot-level traceability documentation
├── signin.html                # Sign-in portal (structure ready)
├── wholesale-inquiry.html     # New partner inquiry form
├── styles.css                 # Main stylesheet
├── scripts/
│   ├── utilities.js          # Shared utilities and helpers
│   ├── farms.js              # Farms directory logic
│   ├── farm.js               # Individual farm page logic
│   ├── farms-svg.js          # Interactive map SVG handling
│   └── cafes.js              # Café resources logic
├── data/
│   └── farms.json            # Farm registry data (4 active farms)
├── assets/                   # Images and media
│   ├── products/             # Product images
│   └── farms/                # Farm images
└── .gitignore                # Git ignore rules

```

## Data Structure

### farms.json
Each farm record includes:
- `id`: Unique identifier
- `name_en` / `name_ja`: Farm names in English/Japanese
- `prefecture_code`: Prefecture location
- `producer_type`: "farm" or "merchant"
- `tea_characteristics`: Array of specialty types
- `products`: Array of product offerings
  - `name_en` / `name_ja`: Product names
  - `grade`: Tea grade (A, B, etc.)
  - `size`: Package size (100g, 1kg, etc.)
  - `image`: Path to product image

Example:
```json
{
  "id": "marukyu-tea",
  "name_en": "Marukyu Tea",
  "prefecture_code": "JP-40",
  "producer_type": "farm",
  "tea_characteristics": ["ceremonial", "shade-grown"],
  "products": [
    {
      "name_en": "Premium Ceremonial Matcha",
      "grade": "A",
      "size": "100g",
      "image": "/assets/products/marukyu-ceremonial.jpg"
    }
  ]
}
```

## Getting Started

### Local Development
```bash
# Using Python's built-in server
python3 -m http.server 8000

# Using Node.js http-server
npx http-server

# Visit http://localhost:8000
```

### Building for Production
1. Ensure all image assets are in `/assets/`
2. Verify CSP headers in server configuration
3. Test on HTTPS (required for full security header enforcement)
4. Configure server to serve from HTTPS with security headers

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 JavaScript required
- CSS Grid and Flexbox required
- SVG support required for map

## Security Considerations
- CSP headers enforce `'self'` origin policy by default
- External resources whitelisted: Google Fonts, CloudFlare CDN
- No inline scripts used (except for necessary initialization)
- All forms use `form-action 'self'`

### Deployment Headers (Required)
When deploying to production, ensure your server sends these headers:
```
Content-Security-Policy: default-src 'self'; ...
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Language Support
### i18n System
- Language detection via URL parameter: `?lang=ja` or `?lang=en`
- Default: English
- Stored in `window.translations` object (utilities.js)
- Dynamic language switching via language toggle link

## Contributing & Team Collaboration

### For Individual Contributors
1. Test on both English and Japanese content
2. Validate form inputs
3. Ensure CSP compliance
4. Test on mobile devices (responsive at 300px+)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

### For Team Development
This project is designed for team collaboration using Git workflows.

**Quick Start for Teams:**
```bash
# Clone the repository
git clone https://github.com/yourusername/matchaback.git
cd matchaback

# Create a feature branch
git checkout -b feature/your-feature

# Start local development server
python3 -m http.server 8000

# Visit http://localhost:8000
```

**Setup Instructions:** See [TEAM_SETUP.md](TEAM_SETUP.md) for comprehensive team setup and daily workflow.

**Key Team Features:**
- 📋 Feature branch workflow with PR reviews
- ✅ Automated validation checks via GitHub Actions
- 📝 Clear commit message conventions
- 🔍 Conflict resolution guidance
- 🎯 Code quality standards

### GitHub Workflow
1. Create feature branch from `main`
2. Make changes and test thoroughly
3. Push to your fork
4. Create Pull Request with description
5. Wait for team review and approval
6. Merge to main

### Team Resources
- [CONTRIBUTING.md](CONTRIBUTING.md) - Detailed contribution guidelines
- [TEAM_SETUP.md](TEAM_SETUP.md) - Team setup and troubleshooting
- [FARM_ADD_GUIDE.md](FARM_ADD_GUIDE.md) - How to add new partner farms

## License
[Add appropriate license]

## Contact
For inquiries about partners or developers, see [contact.html](contact.html)

---
**Note**: This is an open-source demonstration of a partner platform architecture. For production deployment, integrate with a backend authentication system and connect to a real database.
