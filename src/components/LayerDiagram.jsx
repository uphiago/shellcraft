import { useState } from 'react'
import './LayerDiagram.css'

const LAYERS = [
  {
    id: 'user',
    label: 'Usuário',
    color: '#e6edf3',
    accent: 'rgba(230,237,243,0.15)',
    icon: '⌨',
    tools: ['Teclado', 'Monitor'],
    desc: 'Você — quem digita e lê o output.',
    details: 'O ponto de entrada de tudo. Você pressiona teclas, o terminal exibe o resultado. Parece simples, mas tem muita coisa acontecendo entre uma coisa e a outra.',
  },
  {
    id: 'emulator',
    label: 'Terminal Emulator',
    color: '#58a6ff',
    accent: 'rgba(88,166,255,0.15)',
    icon: '🖥',
    tools: ['Alacritty', 'Kitty', 'WezTerm', 'Windows Terminal', 'iTerm2'],
    desc: 'Renderiza texto, recebe input, suporta cores e fontes.',
    details: 'Não interpreta comandos — só exibe. É a janela. Faz renderização de texto com cores ANSI, suporta fontes (Nerd Fonts), e conecta seu teclado ao shell via pseudo-terminal (PTY).',
  },
  {
    id: 'multiplexer',
    label: 'Multiplexer',
    color: '#bc8cff',
    accent: 'rgba(188,140,255,0.15)',
    icon: '⊞',
    tools: ['tmux', 'zellij'],
    desc: 'Sessões persistentes, splits, múltiplas janelas.',
    details: 'Fica entre o emulador e o shell. Permite ter múltiplos terminais na mesma janela, sessões que sobrevivem ao disconnect, e trabalho remoto via SSH sem perder contexto.',
    optional: true,
  },
  {
    id: 'shell',
    label: 'Shell',
    color: '#3fb950',
    accent: 'rgba(63,185,80,0.15)',
    icon: '$',
    tools: ['bash', 'zsh', 'fish', 'powershell'],
    desc: 'Interpreta comandos, roda programas, gerencia variáveis.',
    details: 'O coração do terminal. Recebe o texto que você digitou, faz o parse, e executa programas. Gerencia variáveis de ambiente, aliases, histórico, e permite scripting.',
  },
  {
    id: 'framework',
    label: 'Shell Framework',
    color: '#ff9442',
    accent: 'rgba(255,148,66,0.15)',
    icon: '⚙',
    tools: ['Oh My Zsh', 'Prezto', 'Starship', 'Powerlevel10k'],
    desc: 'Plugins, temas e configuração do shell.',
    details: 'Não é um shell — é configuração. Oh My Zsh por exemplo adiciona plugins (git, docker, kubectl), temas (Powerlevel10k) e gerencia o .zshrc. Starship é um prompt cross-shell.',
    optional: true,
  },
  {
    id: 'cli',
    label: 'Programas CLI',
    color: '#39d353',
    accent: 'rgba(57,211,83,0.15)',
    icon: '>_',
    tools: ['git', 'docker', 'kubectl', 'grep', 'vim', 'terraform', 'node'],
    desc: 'As ferramentas que você realmente usa.',
    details: 'Executáveis que o shell chama. Recebem argumentos, leem stdin, escrevem em stdout/stderr. Cada um faz uma coisa bem feita (princípio Unix). Podem ser encadeados com pipes.',
  },
  {
    id: 'kernel',
    label: 'Kernel / OS',
    color: '#f85149',
    accent: 'rgba(248,81,73,0.15)',
    icon: '◎',
    tools: ['Linux', 'macOS', 'Windows'],
    desc: 'Gerencia processos, filesystem, hardware.',
    details: 'A camada mais baixa que você interage indiretamente. Syscalls, file descriptors, processos, memória. Todo programa CLI faz chamadas ao kernel para ler arquivos, criar processos, etc.',
  },
]

export default function LayerDiagram() {
  const [active, setActive] = useState(null)

  const activeLayer = LAYERS.find(l => l.id === active)

  return (
    <section>
      <div className="section-label">diagrama principal</div>
      <h2 className="section-title">
        As <span>camadas</span> do terminal
      </h2>
      <p className="section-desc">
        Terminal é essencialmente isso — camadas. Cada uma com uma responsabilidade clara.
        Clique em cada camada para entender o papel dela.
      </p>

      <div className="layer-layout">
        <div className="layer-stack">
          {LAYERS.map((layer, i) => (
            <div key={layer.id} className="layer-row">
              <button
                className={`layer-block glass-card ${active === layer.id ? 'active' : ''}`}
                style={{ '--accent': layer.accent, '--color': layer.color }}
                onClick={() => setActive(active === layer.id ? null : layer.id)}
              >
                <div className="layer-left">
                  <span className="layer-icon mono" style={{ color: layer.color }}>{layer.icon}</span>
                  <div className="layer-info">
                    <div className="layer-name">
                      {layer.label}
                      {layer.optional && <span className="layer-optional">opcional</span>}
                    </div>
                    <div className="layer-desc">{layer.desc}</div>
                  </div>
                </div>
                <div className="layer-tools">
                  {layer.tools.slice(0, 4).map(t => (
                    <span key={t} className="tool-chip mono">{t}</span>
                  ))}
                  {layer.tools.length > 4 && (
                    <span className="tool-chip mono muted">+{layer.tools.length - 4}</span>
                  )}
                </div>
              </button>

              {i < LAYERS.length - 1 && (
                <div className="layer-connector">
                  <div className="connector-line" />
                  <div className="connector-arrow">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`layer-detail glass-card ${activeLayer ? 'visible' : ''}`}>
          {activeLayer ? (
            <>
              <div className="detail-header" style={{ '--color': activeLayer.color }}>
                <span className="detail-icon mono">{activeLayer.icon}</span>
                <span className="detail-label">{activeLayer.label}</span>
              </div>
              <p className="detail-text">{activeLayer.details}</p>
              <div className="detail-tools">
                <div className="detail-tools-label mono">exemplos</div>
                <div className="detail-tools-list">
                  {activeLayer.tools.map(t => (
                    <span key={t} className="tool-chip-lg mono">{t}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="detail-placeholder">
              <span>←</span>
              <p>Clique em uma camada para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
