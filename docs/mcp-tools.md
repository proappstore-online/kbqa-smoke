# MCP Tools — kbqa-smoke

## Status: N/A

This app uses **only `app.kv`** for persistence. There is no `app.db` (no SQLite/D1 tables).

The MCP tool surface is defined per entity backed by `app.db`. Since kbqa-smoke has no database entities, **no MCP tools are required or specified**.

---

## If the app is ever extended with `app.db`

If a future iteration adds a database (e.g. a leaderboard or history log), revisit this file and define tools following the pattern:

```
tool name        — one-line description
read | write     — operation type
table/columns    — what it touches
params           — input shape
scope            — per-user | shared
```

For now, no `mcp.json` should be created for this app.
