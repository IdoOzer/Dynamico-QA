# Dynamico QA Automation — End-to-end tests for a Discord bot

End-to-end QA automation for **Dynamico**, a Discord bot for dynamic voice channels that served thousands of servers. The suite drives the real Discord web client with [Playwright](https://playwright.dev/) and exercises the bot the way a real admin would, so regressions are caught before they reach users.

## Background

I built and maintained this suite as the **QA Automation Engineer for Dynamico**. Dynamico let server admins spin up temporary voice channels on demand and manage them through the bot, with setup, per-server configuration, user limits, access control and a bad-words filter. Every release risked breaking one of those admin flows, so these tests drive the actual Discord UI end to end and assert the bot responds correctly before anything ships.

The bot service has since been discontinued. This is published with the owner's permission as a portfolio piece.

<!-- TODO: add a short GIF or screenshot of a test run (or the Playwright HTML report) at docs/run.png -->

---

## What it tests

The tests run against a live Discord server where the bot is installed, covering the full admin surface:

| Area | What it verifies |
|---|---|
| **Setup** | The `/setup` command and the multi-step wizard, including the master-channel limit |
| **Configuration** | The `/config` command, and that settings persist and display correctly |
| **Dynamic channels** | Creating and removing channels and categories, and the default-name template |
| **Channel management** | Rename, user limit, and switching a channel between public and private |
| **Access control** | Granting and removing user access to a private channel, including the duplicate and "nothing changed" cases |
| **Bad-words filter** | Setting and re-reading the bad-words list |
| **Validation** | Error states such as an out-of-range user limit or a rejected rename, asserting the bot replies with the right message |

Each run uses randomized names, numbers and limits, so the assertions check real round-trips rather than fixed values.

---

## Tech stack

| Area | Technology |
|---|---|
| Runtime | **Node.js** |
| Test framework | **Playwright** (Chromium) |
| Target | The **Discord web client** |
| Authentication | Playwright **storage state** from a saved Discord session |

### Testing approach
- **Real end-to-end.** Tests drive the actual Discord web app, clicking buttons, filling dialogs and reading the bot's replies from the UI, not mocked API calls.
- **Serial by design.** The suite runs on a single worker because every test shares and mutates the same Discord server state.
- **Randomized inputs.** Names, numbers and limits are generated per run, so a passing test proves a real round-trip rather than a hardcoded value.
- **Negative cases included.** Invalid user limits and rejected renames are asserted to fail with the correct bot message, not just the happy path.
- **No credentials in code.** Authentication reuses a saved Playwright storage state instead of handling a password or token, and that session file is kept out of version control.
