# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `deno task build` - Full build: downloads data from WordPress API, downloads images, and generates static site
- `deno task dev` - Start local development server on http://localhost:4000
- `deno task build:pages` - Build pages only (without downloading new data/images)
- `deno task download:data` - Download data from WordPress API only
- `deno task download:images` - Download images from WordPress only
- `deno task cache` - Cache all Deno dependencies

## Architecture Overview

This is a static site generator that creates a website from WordPress content via the WordPress REST API. The architecture follows these key patterns:

### Core Flow
1. **Data Layer** (`data/post.js`) - Fetches and caches WordPress posts, pages, categories, and media from the REST API
2. **Build System** (`build.js`, `build-deno.js`) - Generates static HTML files using Preact components
3. **Template System** (`layouts/`, `pages/`) - Preact-based templates for different page types
4. **Static Assets** - Images downloaded to `_pictures/`, API data cached in `_api/`

### Key Components
- **Configuration** (`_config.js`) - WordPress API endpoints, site settings, and redirects
- **Pages** (`pages/`) - Page templates (post.js, category.js, recipes.js, etc.)
- **Layouts** (`layouts/`) - Shared layout templates and special files (sitemap, robots.txt)
- **Helpers** (`helpers/`) - Utilities for HTML processing, URL normalization, and data fetching
- **Components** (`components/`) - Reusable Preact components

### Content Management
- WordPress content is fetched from `content.dollyskettle.com` API
- Images are downloaded and stored locally in `_pictures/` with multiple size variants
- API responses are cached in `_api/` as JSON files for offline builds
- Generated site outputs to `_site/` directory

### Technology Stack
- **Runtime**: Deno 2.4.4+
- **Templating**: Preact with HTM (no JSX compilation)
- **Content Source**: WordPress REST API
- **Deployment**: Static files suitable for Netlify/Vercel

The build process is fault-tolerant - if the WordPress API is unavailable, it falls back to cached data in `_api/`.
