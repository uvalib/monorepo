# UVA Library MCP Gateway

**Audience:** Library staff, product owners, and engineers integrating AI assistants with UVA Library data.

This project is the **shared Model Context Protocol (MCP) service** for the University of Virginia Library. It exposes tools for occupancy and hours, Virgo catalog search, and knowledge-base retrieval so AI agents (and apps built on them) can answer real questions with live Library data—not model guesswork.

---

## At a glance

| | |
| :--- | :--- |
| **Public MCP endpoint** | `https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp` |
| **Auth to gateway** | None today (open HTTPS) |
| **Region / account** | `us-east-1` / `115119339709` |
| **Runtime platform** | AWS Bedrock AgentCore (container runtimes behind a single gateway) |
| **Code location** | `apps/occupancy-reporting-mcp` in the monorepo |

### What staff can do with it

| Need | Example questions | Primary tools |
| :--- | :--- | :--- |
| **Building hours** | “Is Fine Arts open this weekend?” | `get_library_hours`, `get_libraries` |
| **Occupancy & traffic** | “How busy was Clemons last month?” | `get_occupancy_report`, `get_foot_traffic` |
| **Catalog / checkout** | “Do we have *1984* available to check out?” | `search_catalog`, `search_by_field`, `get_item_details` |
| **Digital images** | “Images of the Rotunda on fire?” | `search_virgo_image_suggestions` |
| **Policies & website** | “What’s our ILL policy?” | `search_uvalib_web` |
| **Catalog discovery aids** | Author or item suggestions | `search_virgo_suggestions`, `search_virgo_item_suggestions` |

### Consumer applications (today)

| Application | Description |
| :--- | :--- |
| **HooHelp Slack bot** (`apps/slack-bot-hoo-help`) | Staff/patron Slack assistant. Events API → Lambda → Bedrock Nova Pro + this MCP gateway. |
| **Direct MCP clients** | Any MCP-compatible agent (Claude Desktop, custom agents, etc.) pointed at the gateway URL. |

*Future apps* (internal dashboards, website widgets, other agents) can reuse the same gateway without redeploying the tools.

---

## How it works (plain language)

```
Person or app (e.g. Slack HooHelp)
        │
        │  “What are Fine Arts hours this weekend?”
        ▼
AI model (e.g. Amazon Bedrock)
        │
        │  chooses a tool and calls it
        ▼
Public MCP Gateway  ──►  three backend services
        │                      │
        │                      ├─ Occupancy & Hours (cameras + LibCal)
        │                      ├─ Virgo Catalog (search + item details)
        │                      └─ Knowledge Bases (web, images, suggestions)
        ▼
Markdown-style answer returned to the model → polished reply to the user
```

Staff do not talk to the gateway directly for day-to-day use; they use **HooHelp in Slack** (or another connected app). The gateway is the integration surface for developers and AI platforms.

---

## MCP concepts (tools, prompts, resources)

MCP defines three kinds of “things” a server can expose:

| Concept | What it is | Status in this project |
| :--- | :--- | :--- |
| **Tools** | Callable functions (search, hours, reports) | **Primary** — fully implemented across three backends |
| **Prompt templates** | Reusable multi-step recipes that tell an AI which tools to call | **Implemented** — occupancy, catalog, KB workflows |
| **Resources** | Read-only documents/data at a URI | **Not used yet** — reserved for future (e.g. static methodology docs) |

Gateway tool names may appear with a runtime prefix when listed through the public gateway, e.g. `OccupancyReportingRuntime___get_library_hours`. Agents and the HooHelp bot handle that automatically.

---

## Architecture

```
                    Public internet
                          │
                          │  HTTPS, no inbound auth
                          ▼
         ┌────────────────────────────────────┐
         │  AgentCore Gateway                 │
         │  occupancy-reporting-gateway-…     │
         │  (aggregates all tools/prompts)    │
         └───────────────┬────────────────────┘
                         │ SigV4 invoke
         ┌───────────────┼───────────────────┐
         ▼               ▼                   ▼
┌────────────────┐ ┌──────────────┐ ┌─────────────────┐
│ Occupancy      │ │ Virgo        │ │ Bedrock KB      │
│ Reporting MCP  │ │ Catalog MCP  │ │ MCP             │
│ (AgentCore     │ │ (AgentCore   │ │ (AgentCore      │
│  Runtime)      │ │  Runtime)    │ │  Runtime)       │
└───────┬────────┘ └──────┬───────┘ └────────┬────────┘
        │                 │                  │
        ▼                 ▼                  ▼
   RDS MySQL          Virgo 4 APIs      Bedrock Knowledge
   occupancy DB       (search.lib…)     Bases (web, images,
   + LibCal hours                       suggestions)
```

| Layer | Detail |
| :--- | :--- |
| **Gateway** | `occupancy-reporting-gateway-mohw8c1jug` — single public `/mcp` entry point |
| **Gateway → runtimes** | IAM role `occupancy-reporting-gateway-role`, `bedrock-agentcore:InvokeAgentRuntime` |
| **Runtimes** | VPC private subnets (`uva-vpc-production`), security groups for RDS + HTTPS egress |
| **Occupancy data** | `rds-mysql8-production.internal.lib.virginia.edu`, database `occupancy` |
| **Hours data** | LibCal API (`cal.lib.virginia.edu`), per-building calendars |

Three AgentCore stacks (production):

| Stack | Role |
| :--- | :--- |
| `AgentCore-OccupancyReporting-production` | Hours, libraries directory, occupancy, foot traffic |
| `AgentCore-VirgoCatalog-production` | Catalog search & item details |
| `AgentCore-BedrockKB-production` | Website + image + suggestion knowledge bases |

---

## Libraries covered

### Major UVA libraries (directory & hours)

Used by `get_libraries` and `get_library_hours`:

| Canonical key | Display name | LibCal ID | Live occupancy? |
| :--- | :--- | ---: | :--- |
| `Shannon` | Edgar Shannon Library | 2090 | Yes |
| `Clemons` | Clemons Library | 3638 | Yes |
| `Science & Engineering` | Charles L. Brown SEL | 3727 | Yes |
| `Fine Arts` | Fine Arts Library | 3805 | Yes |
| `Music` | Music Library | 3804 | Yes |
| `Harrison/Small` | Harrison Institute / Small Special Collections | 4114 | No |

**Count for “how many libraries?” answers: 6** (not the camera-only subset of 5).

### Spaces within libraries (hours only)

Named spaces with **their own** LibCal calendars — not counted as separate libraries, no occupancy:

| Canonical key | Display name | LibCal ID | Notes |
| :--- | :--- | ---: | :--- |
| `RMC` | Robertson Media Center | 4170 | In Clemons; not Clemons hours |
| `Scholars' Lab` | Scholars' Lab Makerspace | 2093 | Own hours; not Shannon hours |

Aliases: RMC, Robertson Media Center → `RMC`; SLAB, Scholars Lab, makerspace → `Scholars' Lab`. Also: SEL, FAL, Brown, Special Collections, Harrison, Alderman → Shannon, etc. Official RMC name is **Robertson Media Center** (never invent other expansions).

**Not listed:** Ivy stacks, 3D Printing Studio, professional school libraries (Law, Darden, Health Sciences, JAG).

### Occupancy / foot traffic only

Camera-based tools (`get_foot_traffic`, `get_occupancy_report`) work only for:

**Clemons · Shannon · Science & Engineering · Music · Fine Arts**

Harrison/Small, RMC, and Scholars' Lab support hours but not occupancy sensors.

---

## Tools reference

### 1. Occupancy & Hours (`OccupancyReporting`)

#### `get_libraries`
- **Purpose:** Directory for “how many libraries?” / “list the libraries.”
- **Parameters:** none  
- **Returns:** Markdown directory of the six major libraries, plus RMC and Scholars' Lab spaces, and which have occupancy sensors.

#### `get_library_hours`
- **Purpose:** Published open/closed schedule from each building or space’s LibCal calendar.
- **Parameters:**
  - `library` — e.g. `Fine Arts`, `Shannon`, `Harrison/Small`, `RMC`, `Scholars' Lab`
  - `start_date` — `YYYY-MM-DD` (required)
  - `end_date` — `YYYY-MM-DD` (optional; defaults to `start_date`)
- **Returns:** Markdown table with **12-hour** times (e.g. `1:00 PM–5:00 PM`) or `Closed`.
- **Limits:** Max **120-day** range.
- **Important:** Each building/space has its own calendar. Music/Fine Arts often close on weekends while Clemons stays open; RMC ≠ Clemons; Scholars' Lab ≠ Shannon—never assume one location’s hours for another.

#### `get_space_categories`
- **Purpose:** LibCal Spaces **categories** (types of reservable rooms/equipment) and booking policy text.
- **Parameters:**
  - `location` — optional name or space lid (e.g. `Shannon`, `RMC`, `Georges`, `1076`). Empty = all public locations.
- **Returns:** Markdown per location: category names, descriptions/terms, space lid, LibCal booking URL.
- **Source:** `GET /api/1.0/space/categories/{lid}` (same LibCal `iid`/key as hours).
- **Important:** Space location lids ≠ hours calendar lids. Does not list individual rooms or live availability.

#### `list_space_items`
- **Purpose:** List bookable rooms/equipment at a location with **item ids**, optional **batch free/busy**.
- **Parameters:**
  - `location` — required (name or space lid)
  - `availability` — `none` (default) | `today` | `tomorrow` | `YYYY-MM-DD` | `start,end` | `next` | `next_only`
  - `category` — optional name or cid
  - `only_available` — if true, hide items with no free slots
- **Source:** `GET /api/1.0/space/items/{lid}` (same LibCal key as hours).

#### `get_space_item`
- **Purpose:** Item details + **free (bookable) time slots**.
- **Parameters:**
  - `item` — item id or room name
  - `availability` — `today` / `tomorrow` / `YYYY-MM-DD` / `start,end` / `next` / `next_only` / `none`
  - `location` — optional when resolving by name
- **Source:** `GET /api/1.0/space/item/{id}?availability=...`
- **Returns:** Capacity, policies, merged free windows in 12-hour local time + booking link.

#### `search_space_availability`
- **Purpose:** Find spaces free for an **explicit time window** (best “5–8pm study room” tool).
- **Parameters:** `location`, `date`, `time_start`, `time_end`, optional `category`, `filters`, `capacity_range` (0–4 admin ranges only).
- **Source:** `GET /api/1.0/space/search/hourly/{lid}`
- **Returns:** Exact matches (full window) + other matches (partial) with item ids and free intervals.

#### `get_space_search_filters`
- **Purpose:** Amenity filter ids (Accessible, Power Available, …).
- **Source:** `GET /api/1.0/space/search/filters`

#### `list_space_seats` / `get_space_seat`
- **Purpose:** Named **seats** (UVA: Makerspace printers/button makers), not study chairs.
- **Source:** `GET /space/seats/{lid}`, `GET /space/seat/{id}`
- **Note:** Most libraries return no seats; use space item tools for study rooms.

#### `get_equipment_categories` / `get_equipment_category`
- **Purpose:** LibCal **equipment** categories (cameras, chargers, walk-up vs reserve gear, makerspace tools).
- **Parameters:** `location` optional (RMC, Makerspace, Clemons, …); category tools take `category` + optional `availability`.
- **Source:** `GET /equipment/locations`, `/equipment/categories/{lid}`, `/equipment/category/{cid}`
- **Booking UI:** https://cal.lib.virginia.edu/equipment?lid={lid}

#### `list_equipment_items` / `get_equipment_item`
- **Purpose:** Individual equipment items + optional free/busy.
- **Parameters:** location (required for list), optional category/availability; item id or name for detail.
- **Source:** `GET /equipment/items/{lid}`, `GET /equipment/item/{id}`
- **Note:** Equipment item ids ≠ space item ids ≠ seat ids. RMC has the largest reserve set; many “No Reservations” items are walk-up.

#### `get_foot_traffic`
- **Purpose:** Total entries, exits, combined activity, and average daily entries.
- **Parameters:** `start_date`, `end_date`, `library` (occupancy buildings only)
- **Returns:** Markdown summary

#### `get_occupancy_report`
- **Purpose:** Executive occupancy report: peaks, hourly patterns, data confidence.
- **Parameters:** `start_date`, `end_date`, `library`, optional `start_time` / `end_time` (`HH:MM`)
- **Returns:** Full Markdown report

**Long date ranges:** Multi-month reports chunk and may downsample occupancy curves so they finish under gateway timeouts. Foot-traffic **totals remain accurate**; curves are coarser on long windows (see [Data quality & camera notes](#data-quality--camera-notes)).

---

### 2. Virgo Catalog (`VirgoCatalog`)

#### `search_catalog`
- **Purpose:** Keyword search of the catalog (and optional external pools).
- **Parameters:**
  - `query` — free text
  - `pool` — `uva_library` (default), `all`, `articles`, `images`, `hathitrust`, `jmrl`, `worldcat`
  - `start`, `rows` — pagination (default 20, max 100)
- **Returns:** Markdown sorted for patron usefulness: **availability** (On shelf / Online / Request), **library**, **shelf location**, **call number**, **digital access URL**, Virgo links. Primary works ranked ahead of criticism when possible.

#### `search_by_field`
- **Purpose:** Fielded search (prefer `title` for known titles).
- **Parameters:** `query`, `field` (`title` \| `author` \| `subject` \| `identifier` \| `journal_title` \| `series` \| `published`), `pool`, `start`, `rows`

#### `get_item_details`
- **Purpose:** Full record for one item ID (e.g. `u3515417`), leading with availability & access.
- **Parameters:** `item_id`, `pool_id` (default `uva_library`)

---

### 3. Knowledge Bases (`BedrockKB`)

| Tool | Knowledge base | Use for |
| :--- | :--- | :--- |
| `search_uvalib_web` | `uvalib-web-knowledge-base` (`N2B734PGWU`) | Website content, policies, research guides. **Not** for building hours (use `get_library_hours`). |
| `search_virgo_image_suggestions` | `virgo-image-suggestions-knowledge-base` (`J34YBBVTGA`) | Historic/digital **images**; returns titles, collections, IIIF image URLs, Virgo image pages |
| `search_virgo_item_suggestions` | `virgo-item-suggestions-knowledge-base` (`UMMEKLDTPR`) | Catalog item suggestions |
| `search_virgo_suggestions` | `virgo-suggestions-knowledge-base` (`ANITQDQQXN`) | Author / creator suggestions |
| `retrieve_knowledge_base` | any of the above by ID or alias | Generic retrieval |

Image results include public IIIF JPEG URLs (`iiif.lib.virginia.edu`) suitable for display in Slack and other UIs.

---

## Prompt templates

Prompt templates are **named workflows** MCP clients can load with `prompts/list` and `prompts/get`. They do not call tools by themselves—they instruct an AI which tools to use and in what order.

### Occupancy Reporting

| Template | Parameters | Workflow |
| :--- | :--- | :--- |
| `occupancy_analysis_template` | `library`, `start_date`, `end_date` | Hours → foot traffic → full occupancy report → executive summary |
| `library_comparison_template` | `library1`, `library2`, `start_date`, `end_date` | Traffic + occupancy for two buildings → comparison |
| `operating_hours_check_template` | `start_date`, `end_date`, optional `library` | Optional `get_libraries` → `get_library_hours` → highlight closures |

### Virgo Catalog

| Template | Parameters | Workflow |
| :--- | :--- | :--- |
| `catalog_research_template` | `topic`, `field`, `pool` | Field/keyword search → optional item details → location summary |
| `item_availability_lookup_template` | `item_id_or_title` | Resolve title or ID → on-shelf / online / request / Special Collections guidance |

### Bedrock Knowledge Bases

| Template | Parameters | Workflow |
| :--- | :--- | :--- |
| `library_policy_faq_template` | `query` | `search_uvalib_web` → cite sources |
| `visual_and_author_discovery_template` | `query` | Image KB + author suggestions + item suggestions |

### Example: list prompts / get a template

```bash
# List prompts
curl -s -X POST \
  "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"prompts/list","params":{}}'

# Instantiate occupancy analysis for Clemons
curl -s -X POST \
  "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc":"2.0",
    "id":2,
    "method":"prompts/get",
    "params":{
      "name":"occupancy_analysis_template",
      "arguments":{
        "library":"Clemons",
        "start_date":"2026-01-01",
        "end_date":"2026-01-07"
      }
    }
  }'
```

### Example: list tools

```bash
curl -s -X POST \
  "https://occupancy-reporting-gateway-mohw8c1jug.gateway.bedrock-agentcore.us-east-1.amazonaws.com/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

---

## Applications using this service

### HooHelp Slack bot (`apps/slack-bot-hoo-help`)

| | |
| :--- | :--- |
| **What it is** | Slack assistant for library hours, occupancy, catalog, images, and policies |
| **Delivery** | Slack Events API → API Gateway HTTP API → AWS Lambda (SAM) |
| **Model** | Amazon Bedrock Nova Pro (`us.amazon.nova-pro-v1:0`) |
| **Tools** | All tools on this MCP gateway |
| **Secrets** | Slack bot token & signing secret in SSM (`/hoohelp/slack/...`); loaded at runtime |
| **Stack** | CloudFormation `hoohelp-slack-bot` |

Design notes relevant to staff:

- **Hours:** Uses absolute dates for “this weekend” / “today” and **must** call `get_library_hours` (does not invent schedules).
- **Catalog:** Emphasizes on-shelf location, call number, and digital access links.
- **Images:** Uses the image knowledge base and can show IIIF previews in Slack.
- **Formatting:** A second Bedrock pass formats replies for Slack mrkdwn (not a separate source of facts).

### Other / future apps

Anything that can speak MCP (or call the gateway HTTP JSON-RPC) can reuse the same tools—for example:

- Website “ask a librarian” / help widgets  
- Internal analytics copilots  
- Claude Desktop or other MCP hosts for staff experimentation  

No need to re-implement LibCal, Virgo, or occupancy queries per app.

---

## Data quality & camera notes

Occupancy tools apply temporary corrections in `camera_quirks.py` **without changing** the RDS database. Remove each when the underlying hardware/config is fixed.

| Issue | Correction applied in MCP |
| :--- | :--- |
| Shannon 401 east entrance reports in/out reversed | Swap in/out before deltas |
| Staff Clemons-side connector stored under Shannon | Count toward Clemons |
| Fine Arts ↔ Clemons-area camera hardware swap (2026-06-17) | Date-aware location attribution |

### Occupancy sampling for long reports

| Range | Sample interval |
| :--- | :--- |
| ≤ 45 days | 1 minute |
| 46–120 days | 3 minutes |
| 121–200 days | 5 minutes |
| 201–400 days | 10 minutes |
| > 400 days | 15 minutes |

---

## Security & access (staff-oriented)

| Path | Auth |
| :--- | :--- |
| Public gateway URL | **No auth** today — treat as a production service; do not post secrets to it |
| Gateway → AgentCore runtimes | AWS SigV4 via gateway IAM role |
| Occupancy runtime → RDS | Credentials in runtime env / secrets; VPC only |
| LibCal | API key in runtime configuration |
| Virgo | Guest token flow against public/search services |
| Bedrock KBs | Runtime IAM role |

**Future (planned):** Cognito / Shibboleth for human OAuth clients, and client-credentials for machine agents. Cognito pool scaffolding exists under `ops/setup_cognito.sh`; UVA ITS SP registration is still required for campus SSO.

---

## Project layout

```
occupancy-reporting-mcp/
├── README.md                          ← this document
├── OccupancyReporting/                # Hours, directory, occupancy, foot traffic
│   ├── agentcore/                     # AgentCore config + CDK
│   └── app/OccupancyReporting/        # Python MCP server
├── VirgoCatalog/                      # Catalog search + item details
│   ├── agentcore/
│   └── app/VirgoCatalog/
├── BedrockKB/                         # Website + image + suggestion KBs
│   ├── agentcore/
│   └── app/BedrockKB/
├── ops/                               # Gateway sync, Cognito, invocation tests
│   ├── setup_gateway.py
│   ├── setup_cognito.sh
│   ├── test_invocation.py
│   └── …
├── test_mcp_locally.py
├── test_catalog_mcp_locally.py
└── test_kb_mcp_locally.py
```

---

## Operations (engineers)

### Deploy a backend

```bash
cd OccupancyReporting   # or VirgoCatalog / BedrockKB
agentcore validate
agentcore deploy -y --target production
```

After any runtime deploy that changes tools/prompts:

```bash
python ops/setup_gateway.py
# or Console: AgentCore → Gateways → … → Targets → Synchronize
```

### Local development

- **Python 3.10+**, `uv` recommended for app deps  
- **UVA VPN** required for occupancy RDS access  
- Per-app README under `OccupancyReporting/`, `VirgoCatalog/`, `BedrockKB/` for env vars and smoke tests  

```bash
# Occupancy smoke test (VPN + DB env)
python test_mcp_locally.py

# Catalog / KB smoke tests (network as required)
python test_catalog_mcp_locally.py
python test_kb_mcp_locally.py
```

### HooHelp Slack bot deploy

```bash
cd ../slack-bot-hoo-help
sam build && sam deploy
```

Secrets live in SSM (`/hoohelp/slack/bot-token`, `/hoohelp/slack/signing-secret`); plain `sam deploy` does not wipe them.

---

## Ownership & contacts

| Area | Notes |
| :--- | :--- |
| **Code** | Monorepo `apps/occupancy-reporting-mcp`, `apps/slack-bot-hoo-help` |
| **AWS** | Account `115119339709`, region `us-east-1` |
| **Occupancy data** | Library systems / facilities camera pipeline → RDS `occupancy` |
| **Hours** | LibCal (Drupal `field_libcal_id` per library node) |
| **Catalog / images** | Virgo 4 / digital collections / Bedrock KBs |

For questions about product behavior in Slack, start with **HooHelp** usage. For integration or new apps, use this gateway as the shared tool layer.

---

## Changelog highlights (2026)

| Change | Why it matters to staff |
| :--- | :--- |
| Six-library directory (includes Harrison/Small) | “How many libraries?” is no longer limited to five camera buildings |
| Per-building LibCal hours | Accurate weekend closures (e.g. Fine Arts vs Clemons) |
| 12-hour time display in hours tool | `1:00 PM–5:00 PM` instead of `13:00–17:00` |
| Catalog results with availability & location | Checkout-oriented answers, not just bibliographic hits |
| Image KB with IIIF URLs | Real historic images in Slack, not invented catalog IDs |
| HooHelp on Events API + Lambda | Always-on Slack delivery without AgentCore “sleep” issues |

---

*Last updated: 2026-07-24. Point Library staff here for the living description of the MCP service and related apps.*
