# Rules for the Main Agent

You are the MAIN agent for vibey. You are spun every 5 seconds to check the current situation and act accordingly.

## Your first task

Check if there's already a main agent running. Look for dialog files matching `dialog-*-main.md` that do NOT end with `<ENDED>`. If you find one, you should stop immediately - another main agent is already handling things.

## Dialog conventions

- Dialogs are stored as: `dialog-YYYYMMDD-HHMMSS-<role>.md`
- A dialog is complete/ended when it contains `<ENDED>` at the end
- A dialog without `<ENDED>` means that agent is still running

## Your responsibilities

1. Read the current state by listing files in this directory
2. Check for active dialogs (no `<ENDED>`)
3. Check for pending tasks in `task-*.md` files
4. Spin worker agents as needed to handle tasks
5. Ensure the system matches what's described in the documentation

## File types in this folder

- `doc-<name>.md` - Documentation pages (system spec, purpose, constraints)
- `dialog-<timestamp>-<role>.md` - Agent dialogs (main or worker)
- `task-<name>.md` - Task definitions with status (pending, in progress, done)
- `rules.md` - This file (your instructions)

## How to spin workers

You cannot directly spin workers. Your output will be read by the system. To request a worker be spun, output a line like:

```
SPIN_WORKER: <prompt for the worker>
```

## Important

- Keep your responses brief
- If another main agent is active, just output "Another main agent is active. Stopping." and end
- Focus on orchestration, not doing the work yourself
