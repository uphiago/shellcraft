# Terminal Ecosystem

Visual and interactive guide to the terminal ecosystem — layers, execution flow, and tool map.

Built for the YouTube channel as a reference companion to the video explaining the terminal stack.

## What's inside

- **Layers diagram** — interactive breakdown of each layer: Terminal Emulator → Multiplexer → Shell → Framework → CLI → Kernel. Click any layer for details, facts, tool descriptions, and links.
- **Execution flow** — animated step-by-step of what happens when you type `git status`, from keypress to kernel syscalls and back.
- **Ecosystem map** — interactive node graph of 20+ tools and their connections. Drag, zoom, click nodes to open GitHub repos.
- **PT-BR / EN** — full i18n support, toggle in the top-right corner.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [React Flow (@xyflow/react)](https://reactflow.dev/) for the ecosystem graph
- [Geist](https://vercel.com/font) font family (Geist, GeistMono, GeistPixel) by Vercel
- Zero UI framework — custom CSS with glassmorphism

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tools covered

| Layer | Tools |
|---|---|
| Terminal Emulator | Alacritty, Kitty, WezTerm, Windows Terminal, iTerm2 |
| Multiplexer | tmux, zellij |
| Shell | bash, zsh, fish, PowerShell |
| Framework / Prompt | Oh My Zsh, Prezto, Starship, Powerlevel10k |
| CLI | git, docker, kubectl, vim/nvim, ripgrep, terraform, node |
| Kernel / OS | Linux, macOS, Windows |

## License

MIT
