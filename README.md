# THE GRAND INTERNET HOTEL

**An 8-bit desktop game for managing AI-inhabited websites.**

Built on [HERMES WebKit](https://github.com/psiloceyeben/HERMES-WebKit) — the vessel architecture for AI-generated websites.

Download at [thegrandinternethotel.com](https://thegrandinternethotel.com)

---

## What this is

The Grand Internet Hotel is an Electron desktop application that wraps the full HERMES vessel system in a retro game interface. You manage a hotel where every room is an AI vessel — a living website on your own server.

- Walk between rooms, each one a different website or AI personality
- Chat with vessels in-game — same bridge, same routing tree, same identity
- One-click site creation through the setup wizard
- Point-and-click server management — no terminal required

## Floors

**Floor 1 — The Pantheon**
Specialized AI gods, each with a domain of expertise:
- ATHENA — research and knowledge
- APOLLO — creative and artistic
- DEMETER — commerce and growth
- ARES — security and systems
- ARTEMIS, DIONYSUS, HEPHAESTUS, HESTIA, IRIS, PERSEPHONE, THEMIS

**Floor 2 — Your Vessels**
Every website you build gets a room. Enter a room to chat with the vessel, rebuild the site, upload files, or manage the domain.

## The Hotel Mind

Every conversation that matters gets saved to an Obsidian-compatible knowledge vault. When you leave a room, the system checks if the conversation was novel using [HRR (Holographic Reduced Representations)](https://github.com/NeoVertex1/nuggets) — a local math operation that takes under 10ms, no API call needed. If novel, a markdown note is written with wikilinks connecting it to other notes.

Open the vault in [Obsidian](https://obsidian.md) to see the hotel's knowledge graph grow over time.

## Install

### Windows
Download the installer from [thegrandinternethotel.com](https://thegrandinternethotel.com)

### From source
```bash
git clone https://github.com/psiloceyeben/TheGrandInternetHotel-
cd TheGrandInternetHotel-
npm install
npm start
```

### Build
```bash
npm run build
```

## Requirements

- A VPS (Hetzner recommended, ~4 EUR/month)
- An Anthropic, OpenAI, or Ollama API key
- The game walks you through setup

## Architecture

The game is a client. The backend is HERMES WebKit running on your server. Same bridge, same vessels, same vault — the game is just a different way to interact with it.

```
Game (Electron)  ──SSH──>  Your Server
                            ├── bridge.py (HERMES WebKit)
                            ├── hrr.py (holographic memory)
                            ├── vessel/ (tree nodes, vault)
                            └── vessels/ (your websites)
```

## CLI Alternative

Prefer terminals? Use the [HERMES CLI](https://github.com/psiloceyeben/HERMES-WebKit) instead:
```bash
npx github:psiloceyeben/HERMES-WebKit
```

Same backend. Different interface.

---

## Credits

- [HERMES WebKit](https://github.com/psiloceyeben/HERMES-WebKit) — the vessel architecture
- [NeoVertex1/nuggets](https://github.com/NeoVertex1/nuggets) — HRR holographic memory inspiration
- Built by [Prometheus7](https://prometheus7.com)

## Licence

MIT
