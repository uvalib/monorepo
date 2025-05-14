# Collection Space Proxy

A simple proxy for [CollectionSpace](https://www.collectionspace.org/) that handles authentication and streamlines the interface for UVA Facilities Management. This lightweight server forwards requests to your CollectionSpace instance, performs automatic login, injects client-side scripts, and restricts access to authorized users. It can be extended to customize library-specific use cases as well.

## Features

- Automatic login to CollectionSpace using configured credentials
- HTTP proxy middleware forwarding all requests to your CollectionSpace backend
- HTML injection to simplify or extend the CollectionSpace UI
- Access control by enforcing `REMOTE_USER` headers against a whitelist
- Configurable verbosity for logging proxy activity

## Requirements

- Node.js v18 or higher (for built-in `fetch` support)
- npm, yarn, or pnpm
- Valid CollectionSpace user credentials

## Installation

```bash
# From the project root
cd apps/collection-space-proxy
pnpm install
```

Or using npm / yarn:

```bash
npm install    # or `yarn install`
```

## Configuration

Create a `.env` file in the root of this app (see `.env.example`):

```ini
PORT=3000
DESTINATION=https://your-instance.collectionspace.org
PROXY_HOST=your-instance.collectionspace.org
PROXY_URL=http://localhost:3000
VERBOSITY=1
USERNAME=your-cs-username
PASSWORD=your-cs-password
AUTH_IDS=user1,user2,user3
```

- `PORT` – local port to listen on (default: `3000`)
- `DESTINATION` – URL of your CollectionSpace server
- `PROXY_HOST` – host header forwarded to CollectionSpace
- `PROXY_URL` – base URL clients use to reach this proxy
- `VERBOSITY` – logging level (0 = silent, 1 = basic, 2 = verbose)
- `USERNAME` & `PASSWORD` – credentials for automatic CollectionSpace login
- `AUTH_IDS` – comma-separated list of allowed `REMOTE_USER` values

## Usage

### Development

```bash
# Start the proxy in development mode
pnpm start
```

Visit `http://localhost:3000/cspace/virginia/welcome` to initiate login. After authentication, all CollectionSpace routes will be proxied through this server.

### Production

1. Build the bundle:
   ```bash
   pnpm run build
   ```
2. Deploy `dist/` along with `inject.js` and environment config.
3. Use a process manager (e.g. PM2, Docker) to run `node index.js`.

## Directory Structure

```
collection-space-proxy/
├── index.js           # Main proxy server (ESM)
├── inject.js          # Client-side script injected into HTML
├── rollup.config.js   # Build configuration
├── .env               # Environment variables
├── dist/              # Compiled bundle output
└── packaging/         # Scripts for packaging or deployment
```

## Customization

- **Tenant Path**: Adjust the `tenantPathSegment` in `index.js` to match your CollectionSpace tenant.
- **Script Injection**: Modify `inject.js` to change how the UI is simplified or extended.
- **Access Control**: Update `AUTH_IDS` to manage user access.

## Contributing

Contributions and issues are welcome! Please open a PR or issue in the monorepo.

## License

ISC
