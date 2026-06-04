# MCP Tools — kbqa-smoke

## Status: Not Applicable

This app uses **`app.kv` only** — there are no `app.db` SQL tables.

MCP tools are designed to expose structured database entities to external AI agents
(read/write operations on named tables). Because there is no `app.db` in this app,
there is no meaningful MCP surface to define.

### If the app ever gains SQL tables

Should a future iteration add `app.db` (e.g. a count-history log table), return
here and add tool definitions following this schema:

```md
### tool_name
- **Description:** one-line description
- **Type:** read | write
- **Table(s):** table_name (columns touched)
- **Params:** `{ param: type }` — description
- **Scope:** per-user | shared
```

Until then, no `mcp.json` should be generated for this app.
