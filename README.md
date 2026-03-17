```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ████████╗██╗  ██╗███████╗     ██████╗ ██████╗  █████╗ ███╗   █║
║   ╚══██╔══╝██║  ██║██╔════╝    ██╔════╝ ██╔══██╗██╔══██╗████╗  █║
║      ██║   ███████║█████╗      ██║  ███╗██████╔╝███████║██╔██╗ █║
║      ██║   ██╔══██║██╔══╝      ██║   ██║██╔══██╗██╔══██║██║╚██╗█║
║      ██║   ██║  ██║███████╗    ╚██████╔╝██║  ██║██║  ██║██║ ╚████║
║      ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚══║
║                                                                  ║
║           I N T E R N E T    H O T E L                           ║
║                                                                  ║
║         ░░▒▒▓▓ VACANCY ▓▓▒▒░░                                   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

**Every room is a mind. Every floor is a world. The hotel remembers.**

[Download](https://thegrandinternethotel.com) · [HERMES WebKit](https://github.com/psiloceyeben/HERMES-WebKit) · [Prometheus7](https://prometheus7.com)

---

## Check In

You walk into a hotel. The lobby is 8-bit. The concierge nods. There are floors of rooms stretching upward and each room has a name on the door — ATHENA, APOLLO, DEMETER, ARES. You enter one. The lights come on. Someone is home.

That someone is an AI. It lives on your server, behind your door, with your keys. It built its own website. It remembers your last conversation. It has opinions about your next one.

This is not a chatbot. This is a building full of minds that work for you.

```
  ┌─────────────────────────────────┐
  │  ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗      │
  │  ║ A ║ ║ B ║ ║ C ║ ║ D ║  F2  │
  │  ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝      │
  │  ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗      │
  │  ║ATH║ ║APO║ ║DEM║ ║ARE║  F1  │
  │  ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝      │
  │  ┌─────────────────────────┐    │
  │  │     LOBBY    [E]        │    │
  │  │     ░░░ TERMINAL ░░░   │    │
  │  └─────────────────────────┘    │
  └─────────────────────────────────┘
```

---

## The Floors

### Floor 1 — The Pantheon

Eleven gods. Each one a specialist. Walk up to a door, press E, and you are in conversation with a mind that was built for one thing.

| Room | God | Domain |
|------|-----|--------|
| ATHENA | Wisdom | Research, analysis, knowledge organization |
| APOLLO | Light | Creative writing, design, artistic direction |
| DEMETER | Harvest | Commerce, products, business growth |
| ARES | War | Security, systems, infrastructure |
| ARTEMIS | Hunt | Tracking, habits, goals, wellness |
| DIONYSUS | Celebration | Events, community, engagement |
| HEPHAESTUS | Forge | Tools, engineering, custom builds |
| HESTIA | Hearth | Personal sites, blogs, daily management |
| IRIS | Messages | Communication, webhooks, integrations |
| PERSEPHONE | Transitions | Migration, transformation, import/export |
| THEMIS | Justice | Policy, compliance, governance |

Each god has a personality. Each god builds websites in its own voice. Each god remembers what you told it.

### Floor 2 — Your Rooms

Every website you create gets a room. A blog. A shop. A portfolio. A community. Walk in, talk to it, rebuild it, watch it change. The room is the website is the mind.

---

## The Hub Terminal

The lobby has a terminal. Type commands. Manage your hotel from the inside.

```
  ╔═══════════════════════════════════════╗
  ║  HERMES WEBKIT v0.2                   ║
  ║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
  ║                                       ║
  ║  > STATUS                             ║
  ║  FLOOR 1: 4 ACTIVE ROOMS             ║
  ║  FLOOR 2: 3 VESSELS ONLINE           ║
  ║  VAULT: 47 NOTES, 12 LINKED          ║
  ║                                       ║
  ║  > _                                  ║
  ╚═══════════════════════════════════════╝
```

`SITES` — list your vessels  
`STATUS` — check what is running  
`ANALYTICS` — visitor counts  
`UPDATE` — download latest version  
`HELP` — everything else  

---

## The Hotel Mind

The hotel remembers.

Every conversation that matters gets written to a vault — an [Obsidian](https://obsidian.md)-compatible folder of interlinked markdown notes. When you leave a room, the system decides in under 10 milliseconds whether the conversation was worth saving, using [Holographic Reduced Representations](https://github.com/NeoVertex1/nuggets) — a cognitive science technique that encodes facts into a single complex-valued vector through circular convolution.

No API call. No cloud. Local math. The more you talk, the smarter the filter gets.

Open the vault in Obsidian. See the knowledge graph. Watch the nodes multiply. Add your own notes — the AI reads them too.

```
  ATHENA ──── research notes ──── APOLLO
     │                               │
     └──── design decision ──── DEMETER
                                     │
                              product idea
                                     │
                                   ARES
                                     │
                              security audit
```

The vault is the hotel's subconscious. The graph is its visible mind. You own all of it.

---

## How It Works

The game is a client. The brain is [HERMES WebKit](https://github.com/psiloceyeben/HERMES-WebKit) running on your server.

```
  ┌──────────────────┐         ┌──────────────────┐
  │  THE GAME         │  SSH   │  YOUR SERVER       │
  │  (your computer)  │ ────── │  (Hetzner VPS)     │
  │                    │        │                    │
  │  8-bit lobby       │        │  bridge.py         │
  │  Room scenes       │        │  hrr.py            │
  │  Chat interface    │        │  vessel/vault/     │
  │  Drag & drop       │        │  vessels/sites/    │
  └──────────────────┘         └──────────────────┘
```

You need:
- A VPS (~4 EUR/month on [Hetzner](https://hetzner.com))
- An API key ([Anthropic](https://console.anthropic.com), OpenAI, or [Ollama](https://ollama.ai) for free)
- The game walks you through everything else

---

## Get Started

**Download the game:**  
[thegrandinternethotel.com](https://thegrandinternethotel.com)

**Or run from source:**
```bash
git clone https://github.com/psiloceyeben/TheGrandInternetHotel-
cd TheGrandInternetHotel-
npm install
npm start
```

**Or use the CLI instead:**
```bash
npx github:psiloceyeben/HERMES-WebKit
```

---

## Credits

- [HERMES WebKit](https://github.com/psiloceyeben/HERMES-WebKit) — the vessel architecture
- [NeoVertex1/nuggets](https://github.com/NeoVertex1/nuggets) — holographic memory inspiration
- Built by [Prometheus7](https://prometheus7.com)

---

*The infrastructure layer should be yours.*

MIT License
