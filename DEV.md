# Development Guide

## 📋 Overview

This guide covers:
- **Project Manager Integration** - How to connect and interact with the central project management system
- **General Coding Practices** - Universal best practices for all projects
- **Documentation Maintenance** - How to keep DEV.md, PLAN.md, and DEVLOG.md updated

**⚠️ Important**: Update this DEV.md file regularly as your project evolves. Add project-specific practices, tools, and workflows that are unique to your tech stack.

## 🔗 Project Manager Integration

### Database Schema (Key Tables)

**Projects Table:**
```sql
- id (UUID, primary key)
- name (string, required)
- type (WEBAPP/WEBSITE/CLI/API/MOBILE/DESKTOP/etc.)
- status (PLANNING/ACTIVE/COMPLETED/ON_HOLD/ARCHIVED)
- priority (LOW/MEDIUM/HIGH/URGENT)
- briefDescription (text)
- detailedDescription (text, optional)
- liveUrl, githubUrl, localPath (strings, optional)
- techStack, tags (JSON arrays as strings)
- createdAt, updatedAt (timestamps)
```

**ProjectItem Table:**
```sql
- id (UUID, primary key)
- projectId (UUID, foreign key)
- name (string, required)
- description (text, optional)
- type (FEATURE/BUG/IMPROVEMENT/TASK/RESEARCH/DOCUMENTATION)
- status (TODO/IN_PROGRESS/COMPLETED/BLOCKED/CANCELLED)
- priority (LOW/MEDIUM/HIGH/URGENT)
- labels (JSON array as string)
- createdAt, updatedAt (timestamps)
```

### Connection Setup

**Local Development:**
```bash
# Set environment variable
export PROJECT_MANAGER_DB="file:../project-manager/prisma/dev.db"
# Or relative to your project location
export PROJECT_MANAGER_DB="file:/path/to/project-manager/prisma/dev.db"
```

**Production:**
```bash
# For hosted database
export PROJECT_MANAGER_DB="postgresql://user:pass@host:port/db"
# Or MySQL
export PROJECT_MANAGER_DB="mysql://user:pass@host:port/db"
```

### Common Operations

**Query Your Project's Tasks:**
```bash
# Get all tasks for your project
sqlite3 $PROJECT_MANAGER_DB "
  SELECT pi.name, pi.type, pi.status, pi.priority, pi.description 
  FROM ProjectItem pi 
  JOIN Project p ON pi.projectId = p.id 
  WHERE p.name = 'YOUR_PROJECT_NAME' 
  ORDER BY pi.priority DESC, pi.createdAt ASC;
"

# Get high-priority TODO items
sqlite3 $PROJECT_MANAGER_DB "
  SELECT pi.name, pi.description, pi.priority 
  FROM ProjectItem pi 
  JOIN Project p ON pi.projectId = p.id 
  WHERE p.name = 'YOUR_PROJECT_NAME' 
  AND pi.priority IN ('HIGH', 'URGENT') 
  AND pi.status = 'TODO';
"
```

**Update Task Status:**
```bash
# Mark task as completed
sqlite3 $PROJECT_MANAGER_DB "
  UPDATE ProjectItem 
  SET status='COMPLETED', updatedAt=datetime('now') 
  WHERE name='TASK_NAME' 
  AND projectId=(SELECT id FROM Project WHERE name='YOUR_PROJECT_NAME');
"

# Mark task as in progress
sqlite3 $PROJECT_MANAGER_DB "
  UPDATE ProjectItem 
  SET status='IN_PROGRESS', updatedAt=datetime('now') 
  WHERE name='TASK_NAME' 
  AND projectId=(SELECT id FROM Project WHERE name='YOUR_PROJECT_NAME');
"
```

**Add New Tasks:**
```bash
# Add a new feature
sqlite3 $PROJECT_MANAGER_DB "
  INSERT INTO ProjectItem (id, projectId, name, description, type, status, priority, labels, createdAt, updatedAt)
  VALUES (
    lower(hex(randomblob(16))),
    (SELECT id FROM Project WHERE name='YOUR_PROJECT_NAME'),
    'New Feature Name',
    'Feature description',
    'FEATURE',
    'TODO',
    'MEDIUM',
    '[]',
    datetime('now'),
    datetime('now')
  );
"
```

### MCP Server Integration (Future)

When the Project Manager MCP server is available, you'll be able to use AI tools directly:
- AI assistants can query your project tasks
- Automatic status updates when you complete work
- Better integration with development workflow

## 🛠️ General Coding Practices

### Git Workflow
- **Commit regularly** - Don't let changes pile up
- **Use conventional commits** - `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- **Write meaningful commit messages** - Explain what and why, not just what
- **Create branches for features** - Don't work directly on main
- **Tag releases** - Use semantic versioning (v1.0.0, v1.1.0, etc.)

```bash
# Good commit examples
git commit -m "feat: add user authentication with JWT"
git commit -m "fix: resolve database connection timeout issue"
git commit -m "docs: update API documentation for new endpoints"
```

### Security Best Practices
- **Never commit secrets** - Use .env files for sensitive data
- **Add .env to .gitignore** - But include .env.example
- **Use environment variables** - For API keys, database URLs, etc.
- **Validate all inputs** - Sanitize user data
- **Keep dependencies updated** - Regular security updates
- **Use HTTPS everywhere** - Especially in production

```bash
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Code Quality
- **Use linting tools** - ESLint, Prettier, etc.
- **Write tests** - Unit tests, integration tests
- **Document your code** - Comments for complex logic
- **Follow naming conventions** - Consistent and descriptive names
- **Keep functions small** - Single responsibility principle
- **Handle errors properly** - Don't ignore exceptions

### Versioning & Releases
- **Use semantic versioning** - MAJOR.MINOR.PATCH
- **Tag releases in git** - `git tag v1.0.0`
- **Maintain a CHANGELOG** - Document what changed
- **Test before releasing** - Don't break production
- **Backup before major changes** - Safety first

### Documentation Standards
- **Keep README.md current** - Update as features change
- **Document API endpoints** - If you have an API
- **Include setup instructions** - For new developers
- **Add troubleshooting section** - Common issues and solutions

## 📝 Documentation Maintenance

### When to Update DEV.md
- **Add new tools or dependencies** - Document setup and usage
- **Change development workflow** - Update processes
- **Add project-specific practices** - Customize for your tech stack
- **Discover new best practices** - Share knowledge

### When to Update PLAN.md
- **Add new features** - Document what you plan to build
- **Change priorities** - Update what's important
- **Complete milestones** - Mark progress
- **Discover new requirements** - Add to backlog

### When to Update DEVLOG.md
- **Complete significant work** - Document what was done
- **Make important decisions** - Record reasoning
- **Solve difficult problems** - Share solutions
- **Learn something new** - Document insights

## 🎯 My Coffee Website - Specific Practices

### HTML5/CSS3/Vanilla JS Best Practices

#### HTML5 Semantic Structure
```html
<!-- Use semantic HTML5 elements for better SEO and accessibility -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Welcome to My Coffee</h1>
  </section>
</main>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

#### CSS3 Performance & Organization
```css
/* Use CSS custom properties for consistent theming */
:root {
  --coffee-brown: #8B4513;
  --cream-white: #FFF8DC;
  --gold-accent: #DAA520;
  --text-dark: #2F1B14;
}

/* Optimize animations for performance */
.coffee-animation {
  transform: translateZ(0); /* Force hardware acceleration */
  will-change: transform; /* Hint browser for optimization */
}

/* Use efficient selectors */
.coffee-card { /* Class selectors are faster than descendant selectors */ }
```

#### Vanilla JavaScript Best Practices
```javascript
// Use modern ES6+ features
const coffeeData = {
  origins: ['Ethiopia', 'Colombia', 'Guatemala'],
  roastLevels: ['Light', 'Medium', 'Dark']
};

// Efficient DOM manipulation
const updateCoffeeDisplay = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach(coffee => {
    const element = createCoffeeElement(coffee);
    fragment.appendChild(element);
  });
  document.getElementById('coffee-container').appendChild(fragment);
};

// Use event delegation for better performance
document.addEventListener('click', (e) => {
  if (e.target.matches('.coffee-card')) {
    handleCoffeeSelection(e.target);
  }
});
```

### Tailwind CSS Guidelines

#### Custom Coffee Theme Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FFF8DC',
          100: '#F5F5DC',
          200: '#DEB887',
          300: '#D2B48C',
          400: '#CD853F',
          500: '#A0522D',
          600: '#8B4513',
          700: '#654321',
          800: '#4A2C2A',
          900: '#2F1B14'
        }
      },
      fontFamily: {
        'coffee': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'steam': 'steam 3s ease-in-out infinite',
        'pour': 'pour 2s ease-out forwards'
      }
    }
  }
}
```

#### Responsive Design Patterns
```html
<!-- Mobile-first responsive classes -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="coffee-card p-4 bg-coffee-50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <!-- Coffee card content -->
  </div>
</div>

<!-- Responsive typography -->
<h1 class="text-2xl md:text-4xl lg:text-6xl font-coffee text-coffee-900">
  Artisan Coffee Roastery
</h1>
```

### Development Environment Setup

#### Required Tools & Versions
```bash
# No Node.js required - pure HTML/CSS/JS
# Recommended tools:
- VS Code with Live Server extension
- Git for version control
- Modern web browser for testing
- Image optimization tools (TinyPNG, ImageOptim)

# Optional development server:
python -m http.server 8000
# or
npx http-server -p 8000
```

#### File Organization Structure
```
mycoffee/
├── index.html              # Homepage
├── coffee.html             # Our Coffee page
├── about.html              # About Us page
├── brewing.html            # Brewing Guide page
├── shop.html               # Shop page
├── contact.html            # Contact page
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   └── components.css  # Component styles
│   ├── js/
│   │   ├── main.js         # Main JavaScript
│   │   ├── coffee-map.js   # Interactive map
│   │   └── brewing-calc.js # Brewing calculators
│   ├── images/
│   │   ├── coffee/         # Coffee product images
│   │   ├── process/        # Roasting process images
│   │   └── team/           # Team photos
│   └── icons/              # SVG icons and favicons
├── docs/                   # Documentation
└── README.md
```

### Code Style Guidelines

#### Naming Conventions
```javascript
// Use descriptive, coffee-themed naming
const coffeeOriginMap = new Map();
const brewingCalculator = {
  calculateRatio: (coffee, water) => coffee / water,
  getBrewTime: (method) => brewTimes[method]
};

// CSS class naming (BEM methodology)
.coffee-card { }
.coffee-card__image { }
.coffee-card__title { }
.coffee-card--featured { }
```

#### File Organization Patterns
```html
<!-- Consistent HTML structure across pages -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - My Coffee</title>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
  <header class="site-header">
    <!-- Navigation component -->
  </header>

  <main class="main-content">
    <!-- Page-specific content -->
  </main>

  <footer class="site-footer">
    <!-- Footer component -->
  </footer>

  <script src="assets/js/main.js"></script>
</body>
</html>
```

### Performance Optimization

#### Image Optimization
```bash
# Optimize images for web
- Use WebP format for modern browsers with JPEG fallbacks
- Compress images to 80-85% quality
- Use responsive images with srcset
- Implement lazy loading for below-fold images

# Example responsive image markup
<picture>
  <source srcset="coffee-beans.webp" type="image/webp">
  <img src="coffee-beans.jpg" alt="Fresh coffee beans" loading="lazy">
</picture>
```

#### JavaScript Performance
```javascript
// Debounce scroll events for better performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Use intersection observer for scroll animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
};
```

### UI/UX Best Practices for Coffee Websites

#### Visual Hierarchy & Typography
```css
/* Establish clear visual hierarchy */
h1 { font-size: 3rem; font-weight: 700; color: var(--coffee-900); }
h2 { font-size: 2.25rem; font-weight: 600; color: var(--coffee-800); }
h3 { font-size: 1.875rem; font-weight: 500; color: var(--coffee-700); }

/* Readable body text */
body {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--coffee-800);
}

/* Coffee-themed accents */
.accent-text { color: var(--gold-accent); font-weight: 600; }
```

#### Interactive Elements
```javascript
// Smooth hover effects for coffee cards
.coffee-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coffee-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(139, 69, 19, 0.15);
}

// Coffee brewing animation
const animateBrewingProcess = () => {
  const steps = ['grind', 'heat', 'pour', 'brew', 'serve'];
  steps.forEach((step, index) => {
    setTimeout(() => {
      document.querySelector(`.step-${step}`).classList.add('active');
    }, index * 1000);
  });
};
```

#### Accessibility Guidelines
```html
<!-- Proper ARIA labels for interactive elements -->
<button aria-label="Add Ethiopian coffee to cart" class="add-to-cart-btn">
  <span aria-hidden="true">+</span>
  Add to Cart
</button>

<!-- Skip navigation for keyboard users -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Proper heading structure -->
<h1>My Coffee Roastery</h1>
  <h2>Our Coffee Selection</h2>
    <h3>Ethiopian Single Origin</h3>
    <h3>Colombian Blend</h3>
  <h2>Brewing Guides</h2>
```

### Security Best Practices

#### Form Security
```javascript
// Input validation and sanitization
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Contact form handling
const handleContactForm = (formData) => {
  const email = sanitizeInput(formData.get('email'));
  const message = sanitizeInput(formData.get('message'));

  if (!validateEmail(email)) {
    showError('Please enter a valid email address');
    return;
  }

  // Process form submission
};
```

#### Content Security
```html
<!-- Add security headers via meta tags -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; script-src 'self';">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

### Testing Strategy

#### Manual Testing Checklist
```bash
# Cross-browser testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

# Device testing
- [ ] Mobile phones (iOS/Android)
- [ ] Tablets (iPad/Android)
- [ ] Desktop (various screen sizes)

# Feature testing
- [ ] Coffee origin map interactions
- [ ] Brewing calculator accuracy
- [ ] Product filtering functionality
- [ ] Contact form validation
- [ ] Shopping cart operations
- [ ] Image lazy loading
- [ ] Scroll animations
```

#### Performance Testing
```bash
# Use Lighthouse for audits
npx lighthouse https://mycoffee.com --output html --output-path ./lighthouse-report.html

# Test loading times
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] First Input Delay < 100ms
```

### Deployment Process

#### Pre-deployment Checklist
```bash
# Code quality checks
- [ ] HTML validation (W3C validator)
- [ ] CSS validation (W3C CSS validator)
- [ ] JavaScript linting (ESLint)
- [ ] Image optimization completed
- [ ] Accessibility testing (WAVE, axe)
- [ ] Performance optimization verified

# Content checks
- [ ] All images have alt text
- [ ] Meta descriptions added
- [ ] Favicon implemented
- [ ] 404 page created
- [ ] Sitemap.xml generated
```

#### Static Site Deployment
```bash
# GitHub Pages deployment
git add .
git commit -m "Deploy: Add coffee website v1.0"
git push origin main

# Netlify deployment (drag & drop or Git integration)
# 1. Build command: (none needed for static site)
# 2. Publish directory: /
# 3. Environment variables: (none needed)

# Performance monitoring post-deployment
- Set up Google Analytics
- Configure Google Search Console
- Monitor Core Web Vitals
- Set up uptime monitoring
```

---

**Remember**: This DEV.md file should evolve with your coffee website project. Keep it updated with new techniques, optimizations, and lessons learned during development!
