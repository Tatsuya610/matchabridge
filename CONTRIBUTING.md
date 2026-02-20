# Contributing to MatchaBack

Thank you for interest in contributing to the MatchaBack Partner Farms Platform! This guide explains how to set up your development environment and contribute to the project.

## 🚀 Getting Started

### Prerequisites
- Git installed on your machine
- A code editor (VS Code, Sublime Text, etc.)
- Python 3 or Node.js (for local HTTP server)
- A GitHub account (for submitting pull requests)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/matchaback.git
cd matchaback
```

### 2. Set Up Local Development Server

**Using Python (Recommended):**
```bash
# Python 3
python3 -m http.server 8000

# Visit: http://localhost:8000
```

**Using Node.js:**
```bash
npx http-server

# Visit: http://localhost:8080
```

**Important**: Do NOT directly open `index.html` in your browser (file:// protocol). The application requires HTTP protocol to load data properly.

### 3. Verify Setup
- Open your browser to `http://localhost:8000`
- Check that the farms map loads without errors
- Verify language switching works (English/Japanese toggle)

## 📝 Development Workflow

### Branch Naming Convention
- `feature/name` - For new features
- `fix/name` - For bug fixes
- `docs/name` - For documentation updates
- `chore/name` - For maintenance tasks

Example:
```bash
git checkout -b feature/add-new-farm
```

### Making Changes

#### For Café Content (cafes.html)
- Edit `cafes.html` for webpage content
- Modify `scripts/cafes.js` for interactive features
- Update `styles.css` for styling

#### For Farm Data (farms.html)
- Add/update farms in `data/farms.json`
- Edit `scripts/farms.js` for directory logic
- Modify `scripts/farms-svg.js` for map interactions
- See [FARM_ADD_GUIDE.md](FARM_ADD_GUIDE.md) for detailed instructions

#### For Multi-Language Support
- Update translations in `scripts/utilities.js`
- Add corresponding Japanese/English text
- Test with `?lang=ja` and `?lang=en` URL parameters

#### For Styling
- Global styles: `styles.css`
- Component-specific styles: within HTML `<style>` blocks

### Commit Messages
Use clear, descriptive commit messages following this format:

```
Type: Brief description

Longer description explaining what and why (if needed).

Examples:
- feat: Add producer voice section to farm detail pages
- fix: Correct map positioning for Kagoshima prefecture
- docs: Update README with deployment instructions
- style: Improve responsiveness of producer grid
```

### Testing Locally

#### Test Responsive Design
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at common breakpoints:
   - Mobile: 375px (iPhone SE)
   - Tablet: 768px (iPad)
   - Desktop: 1024px+

#### Test Language Switching
- Add `?lang=ja` to any URL to test Japanese
- Add `?lang=en` or omit for English
- Verify all fields have translations

#### Check for Errors
- Open DevTools Console (F12 → Console)
- Verify no red errors appear
- Check Network tab for failed requests

#### Validate HTML/CSS
```bash
# Using VS Code extensions:
# - Install "HTML Validator"
# - Install "CSS Peek"
```

## 📁 Project Structure Reference

```
/
├── index.html                 # Homepage
├── farms.html                 # Farms directory & map
├── farm.html                  # Individual farm details
├── cafes.html                 # Café resources
├── contact.html               # Contact page
├── traceability.html          # Traceability info
├── signin.html                # Sign-in portal (framework)
├── wholesale-inquiry.html     # New partner form
│
├── styles.css                 # Global stylesheet
├── scripts/
│   ├── utilities.js          # Shared functions & i18n
│   ├── farms.js              # Farms directory logic
│   ├── farm.js               # Individual farm logic
│   ├── farms-svg.js          # Map SVG handling
│   └── cafes.js              # Café features
│
├── data/
│   └── farms.json            # Farm registry
│
├── assets/
│   ├── products/             # Product images
│   └── farms/                # Farm images
│
├── .gitignore                # Git exclude rules
├── README.md                 # Main documentation
├── CONTRIBUTING.md           # This file
└── FARM_ADD_GUIDE.md         # How to add new farms
```

## 🔄 Creating a Pull Request

### Before Submitting
1. Pull latest changes from main branch
   ```bash
   git pull origin main
   ```

2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and test thoroughly

4. Commit with clear messages
   ```bash
   git add .
   git commit -m "feat: Descriptive message"
   ```

5. Push to your fork
   ```bash
   git push origin feature/your-feature
   ```

### PR Checklist
- [ ] Tested on at least 2 browsers
- [ ] Verified responsive design (mobile, tablet, desktop)
- [ ] Tested language switching (EN/JA)
- [ ] No console errors
- [ ] Commit messages are clear
- [ ] Documentation updated (if applicable)
- [ ] No sensitive data in commits
- [ ] Code follows project style

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Farm data update

## Testing
Describe testing performed:
- [ ] Desktop (Chrome/Firefox/Safari)
- [ ] Mobile responsiveness
- [ ] Language switching

## Related Issue
Fixes #(issue number, if applicable)
```

## 🎨 Styling Guidelines

### Color Palette
- Primary Green: `#2d5016`
- Neutral Light: `#faf9f6`
- Neutral Dark: `#1a1a1a`
- Accent Blue: `#4a90e2`

### Typography
- Headers: `Crimson Text` (serif)
- Body: `Noto Sans JP` (sans-serif)
- Code: Monospace

### Responsive Breakpoints
```css
/* Mobile First */
/* Tablet: 768px */
@media (max-width: 768px) { }

/* Desktop: 900px+ */
@media (min-width: 900px) { }
```

## 🐛 Reporting Issues

Create a GitHub Issue with:
- Clear title
- Reproduction steps
- Expected behavior
- Actual behavior
- Browser/device info
- Screenshots if applicable

Example:
```markdown
**Title**: Map pins not showing for new farms

**Steps to Reproduce**:
1. Add new farm to farms.json
2. Refresh farms.html
3. Map pins don't appear

**Expected**: All farms visible on map
**Actual**: Only 3 of 4 farms visible
**Browser**: Chrome 120, macOS
```

## 🤝 Team Collaboration Tips

### Setting Up for Team Work
```bash
# After cloning, configure Git
git config user.name "Your Name"
git config user.email "your.email@company.com"

# Set up tracking for origin and your fork
git remote add upstream https://github.com/original/repo.git
git fetch upstream
```

### Syncing with Main Project
```bash
# Get latest from main repository
git fetch upstream
git rebase upstream/main

# Push to your fork
git push origin feature/your-feature
```

### Branch Protection
- Main branch requires:
  - Pull request review
  - All tests passing
  - No conflicts

### Communication
- Use GitHub Issues for discussion
- Add labels for organization (bug, feature, documentation)
- Tag team members for reviews (@username)

## 📚 Useful Resources

- [MDN Web Docs](https://developer.mozilla.org/) - HTML/CSS/JS reference
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

## ❓ Questions?

- Check existing GitHub Issues
- Create a new Discussion
- Contact the team

---

**Thank you for contributing to MatchaBack!** 🍵
