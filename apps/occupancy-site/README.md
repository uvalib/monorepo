# UVA Library Occupancy Reports

Static Astro site that publishes **monthly occupancy and foot-traffic reports** for University of Virginia Library buildings.

## Libraries covered

- Clemons  
- Fine Arts  
- Music  
- Science & Engineering  
- Shannon  

Reports span the last **24 complete calendar months** for each library.

## Stack

- [Astro](https://astro.build/) static site generation  
- [Occupancy MCP gateway](https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp) for live report generation  
- Hosted at **https://occupancy.library.virginia.edu/** (S3 + CloudFront)

## Quick start

```bash
cd apps/occupancy-site
npm install

# Pull ~2 years of monthly reports (takes several minutes; resumable)
npm run fetch-data

# Dev server
npm run dev

# Production build
npm run build
```

Or fetch + build in one step:

```bash
npm run build:full
```

## Deploy (S3)

Production assets are uploaded to the `occupancy.library.virginia.edu` S3 bucket. CloudFront is configured outside this project; deploy only needs to put files in the bucket.

Requires AWS CLI credentials with `s3:PutObject` / `s3:DeleteObject` on the bucket.

```bash
# Build current reports.json and push to production
npm run deploy

# Preview the sync without writing
npm run deploy:dry-run

# Upload an existing dist/ without rebuilding
npm run deploy:skip-build

# Re-fetch MCP data, rebuild, and deploy
npm run deploy:full
```

`scripts/deploy.sh` will:

1. Build the Astro site (unless `--skip-build`)
2. `aws s3 sync dist/ s3://occupancy.library.virginia.edu/ --delete`

| Env var | Default |
| --- | --- |
| `S3_BUCKET` | `occupancy.library.virginia.edu` |
| `AWS_REGION` | `us-east-1` |

For CI, see `pipeline/buildspec.yml` (CodeBuild). Set `FETCH_DATA=true` on scheduled jobs that should re-pull occupancy reports before publishing.

## Data refresh

`scripts/fetch-data.mjs` calls `get_occupancy_report` on the MCP gateway for each library × month and writes `src/data/reports.json`.

| Flag | Meaning |
| --- | --- |
| `--concurrency N` | Parallel requests (default `2`) |
| `--months N` | Number of complete months (default `24`) |
| `--library NAME` | Only one library (e.g. `Music`) |
| `--no-resume` | Ignore existing cache |

Successful months are cached so re-runs only fill gaps. Override the gateway URL with `OCCUPANCY_MCP_URL` if needed.

## Site map

| Path | Content |
| --- | --- |
| `/` | Overview + library cards |
| `/methodology/` | Counting system and estimate notes |
| `/libraries/[slug]/` | 24-month table for one library |
| `/reports/[slug]/[YYYY-MM]/` | Full monthly executive report |

## Notes on data quality

Counts are **estimates** derived from entrance cameras during published open hours. Shannon and Clemons figures are known to be imperfect relative to true headcount, but remain stronger than the previous gate-counter system. Each monthly page includes the full service report text for archival use.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Local Astro dev server |
| `npm run build` | Build from cached `reports.json` |
| `npm run fetch-data` | Refresh report cache from MCP |
| `npm run build:full` | Fetch then build |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and publish to S3 |
| `npm run deploy:dry-run` | Show planned S3 changes without uploading |
| `npm run deploy:skip-build` | Publish existing `dist/` only |
| `npm run deploy:full` | Fetch data, build, and deploy |
