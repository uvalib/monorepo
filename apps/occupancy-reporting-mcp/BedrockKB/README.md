# Bedrock Knowledge Bases MCP Server

An MCP (Model Context Protocol) server that exposes AWS Bedrock Knowledge Bases for UVA Library and Virgo search tools. Deployed on AWS AgentCore Runtime and accessible behind the shared AgentCore Gateway.

---

## Knowledge Bases Exposed

| Knowledge Base Name | KB ID | Purpose / Scope |
| :--- | :--- | :--- |
| `uvalib-web-knowledge-base` | `N2B734PGWU` | UVA Library website pages, policies, collections, & research guides (Note: use `get_library_hours` for building hours) |
| `virgo-image-suggestions-knowledge-base` | `J34YBBVTGA` | Virgo visual media and image search suggestions |
| `virgo-item-suggestions-knowledge-base` | `UMMEKLDTPR` | Virgo item recommendations and catalog suggestions |
| `virgo-suggestions-knowledge-base` | `ANITQDQQXN` | Author suggestions from the catalog |

---

## Tools

### `search_uvalib_web`
Searches UVA Library website pages, policies, research guides, and documentation.
- **Parameters**: `query` (str), `max_results` (int, default `5`)

### `search_virgo_image_suggestions`
Searches Virgo visual media and image search suggestions.
- **Parameters**: `query` (str), `max_results` (int, default `5`)

### `search_virgo_item_suggestions`
Searches Virgo item recommendations and catalog suggestions.
- **Parameters**: `query` (str), `max_results` (int, default `5`)

### `search_virgo_suggestions`
Suggests authors from the catalog based on search queries.
- **Parameters**: `query` (str), `max_results` (int, default `5`)

### `retrieve_knowledge_base`
Generic retrieval tool allowing queries against any Bedrock KB by ID or alias.
- **Parameters**: `knowledge_base_id` (str), `query` (str), `max_results` (int, default `5`)

---

## Local Development & Testing

### Run local smoke test
```bash
python test_kb_mcp_locally.py
```

### Run FastMCP server locally
```bash
cd BedrockKB/app/BedrockKB
python main.py
```
Server starts on `http://0.0.0.0:8000`. Connect MCP inspector to `http://localhost:8000/mcp`.

---

## AWS AgentCore Deployment

```bash
cd BedrockKB
agentcore validate
agentcore deploy --target production -y
```

After deployment, update gateway targets:
```bash
python ops/setup_gateway.py
```
