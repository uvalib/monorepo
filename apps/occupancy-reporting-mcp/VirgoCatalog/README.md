# Virgo Catalog Search MCP Server

An MCP (Model Context Protocol) server that exposes UVA Library Virgo catalog search tools and item details lookups. Deployed on AWS AgentCore Runtime and accessible behind the shared AgentCore Gateway.

---

## Tools

### `search_catalog`
Searches the UVA Library catalog or external Virgo pools for books, journals, manuscripts, audio, video, articles, and digital collections.
- **Parameters**:
  - `query` (str): Search keyword or phrase (e.g. `'clemons library'`, `'python programming'`).
  - `pool` (str, optional): Target search pool. `'uva_library'` (default), `'all'` (master search across all pools), `'articles'`, `'images'`, `'hathitrust'`, `'jmrl'`, `'worldcat'`.
  - `start` (int, default `0`): Pagination offset.
  - `rows` (int, default `20`): Number of search results to return.
- **Returns**: Markdown report sorted for checkout usefulness, including availability (On shelf / Online / Request), library building, shelf location, call number, digital access URLs, and Virgo record links.

### `search_by_field`
Searches the catalog targeting a specific metadata field.
- **Parameters**:
  - `query` (str): Search term for the specified field.
  - `field` (str, default `'title'`): `'title'`, `'author'`, `'subject'`, `'identifier'`, `'journal_title'`, `'series'`, `'published'`.
  - `pool` (str, default `'uva_library'`)
  - `start` (int, default `0`)
  - `rows` (int, default `20`)

### `get_item_details`
Retrieves detailed metadata fields, call number, publisher, availability, and related items for a specific catalog item.
- **Parameters**:
  - `item_id` (str): Item record ID (e.g. `'u321111'`).
  - `pool_id` (str, default `'uva_library'`)

---

## Local Development & Testing

### Run local test
```bash
python test_catalog_mcp_locally.py
```

### Run FastMCP server locally
```bash
cd VirgoCatalog/app/VirgoCatalog
python main.py
```
Server starts on `http://0.0.0.0:8000`. Connect MCP inspector to `http://localhost:8000/mcp`.

---

## AWS AgentCore Deployment

```bash
cd VirgoCatalog
agentcore validate
agentcore deploy
```

After deployment, update gateway targets:
```bash
python ops/setup_gateway.py
```
