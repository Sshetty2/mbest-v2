# Meetup Batch Event Set Tool v2 (MBEST-v2)

A modern refactor of the [original Meetup Batch Event Set Tool](https://github.com/Sshetty2/meetup-batch-event-set), now with TypeScript and modern React patterns.

[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chromewebstore.google.com/detail/meetup-batch-event-set-to/cabfodbfjmgloaallchcnnkgcfpnobem)

## Overview

MBEST-v2 is a Chrome extension that enhances Meetup.com functionality by allowing users to:
- Schedule multiple Meetup events to Google Calendar in one action
- Select events within a specified date range
- Search and filter Meetup groups
- Manage event scheduling through an intuitive interface

## Technologies

- **Frontend**:
  - React 18 with functional components and hooks
  - TypeScript for type safety
  - Material-UI v6 for component library
  - Redux Toolkit for state management
  - React Calendar for date selection

- **Build Tools**:
  - Vite for fast development and building
  - CRXJS for Chrome extension development
  - ESLint for code quality

- **APIs**:
  - Meetup API for group and event data
  - Google Calendar API for event scheduling
  - Chrome Extension APIs for:
    - Identity management
    - Storage
    - Background scripts

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/Sshetty2/mbest-v2.git
cd mbest-v2
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
VITE_MEETUP_CLIENT_ID=your_meetup_client_id
VITE_MEETUP_CLIENT_SECRET=your_meetup_client_secret
VITE_REDIRECT_URI=your_redirect_uri
```

4. Update `manifest.json` with your Google OAuth client ID:

```json
"oauth2": {
  "client_id": "your_google_client_id"
}
```

5. Start development server:

```bash
npm run dev
```

6. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Features

- 🔍 Group search with autocomplete
- 📅 Date range selection
- ✅ Batch event selection
- 📲 Google Calendar integration
- 🔒 Secure OAuth authentication
- 💾 Local storage for preferences
- 🎨 Modern, responsive UI

## Architecture

- **Redux Store**: Manages application state for groups, events, and dates
- **Background Script**: Handles OAuth flows and API communications
- **Content Script**: Integrates with Meetup.com pages
- **Popup**: Main user interface for interaction

## Privacy

This extension prioritizes user privacy:
- No personal data storage
- Temporary token storage only
- Secure API communications
- See [Privacy Policy](./PRIVACY.md) for details

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the [repository](https://github.com/Sshetty2/mbest-v2).

## License

MIT License - see LICENSE file for details

## Links

- [Chrome Web Store](https://chromewebstore.google.com/detail/meetup-batch-event-set-to/cabfodbfjmgloaallchcnnkgcfpnobem)
- [Original Version](https://github.com/Sshetty2/meetup-batch-event-set)
- [Issue Tracker](https://github.com/Sshetty2/mbest-v2/issues)
