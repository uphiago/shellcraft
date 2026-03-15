import { useState, useEffect, useRef, useCallback } from 'react'
import './CommandFlow.css'

const STEPS = [
  {
    id: 'keyboard',
    label: 'Teclado',
    sublabel: 'hardware input',
    icon: '⌨',
    color: '#e6edf3',
    direction: 'down',
    payload: 'g i t   s t a t u s ⏎',
    payloadLabel: 'keycodes',
    desc: 'Você pressiona as teclas. O hardware gera scan codes que o SO converte em caracteres.',
    detail: [
      { label: 'evento', value: 'KeyDown → KeyUp' },
      { label: 'scan codes', value: '22 09 20 — 1f 20 1b 20 1c 15 1f' },
      { label: 'destino', value: 'Terminal Emulator via OS input system' },
    ],
  },
  {
    id: 'emulator',
    label: 'Terminal Emulator',
    sublabel: 'Alacritty / Kitty / WezTerm',
    icon: '🖥',
    color: '#58a6ff',
    direction: 'down',
    payload: '"git status\\n"',
    payloadLabel: 'string UTF-8',
    desc: 'O emulador captura o input e escreve os bytes no master end do PTY. Também renderiza o echo na tela.',
    detail: [
      { label: 'mecanismo', value: 'PTY (pseudo-terminal)' },
      { label: 'escreve em', value: '/dev/pts/N (master)' },
      { label: 'também faz', value: 'render do echo, suporte ANSI' },
    ],
  },
  {
    id: 'shell',
    label: 'Shell',
    sublabel: 'zsh / bash',
    icon: '$_',
    color: '#3fb950',
    direction: 'down',
    payload: 'argv = ["git", "status"]',
    payloadLabel: 'parsed command',
    desc: 'O shell lê do slave end do PTY, faz tokenização e parse, expande variáveis/aliases, resolve o PATH.',
    detail: [
      { label: 'lê de', value: '/dev/pts/N (slave)' },
      { label: 'parse', value: 'tokenize → expand → lookup PATH' },
      { label: 'encontra', value: '/usr/bin/git via $PATH' },
    ],
  },
  {
    id: 'fork',
    label: 'fork() + exec()',
    sublabel: 'processo filho',
    icon: '⑂',
    color: '#bc8cff',
    direction: 'down',
    payload: 'pid = fork()\nexecve("/usr/bin/git", …)',
    payloadLabel: 'syscalls',
    desc: 'Shell chama fork() para criar um processo filho, depois execve() para carregar o binário git no espaço do filho.',
    detail: [
      { label: 'fork()', value: 'duplica o processo do shell' },
      { label: 'execve()', value: 'substitui imagem pelo binário git' },
      { label: 'stdin/out/err', value: 'herdados do shell (PTY)' },
    ],
  },
  {
    id: 'kernel',
    label: 'Kernel',
    sublabel: 'Linux / macOS',
    icon: '◎',
    color: '#ff9442',
    direction: 'down',
    payload: 'open(".git/HEAD")\nread() → stat()',
    payloadLabel: 'syscalls',
    desc: 'git faz syscalls ao kernel para acessar o filesystem: open, read, stat, getdents nos objetos do repositório.',
    detail: [
      { label: 'syscalls', value: 'open(), read(), stat(), getdents()' },
      { label: 'VFS', value: 'Virtual Filesystem abstrai o disco' },
      { label: 'retorna', value: 'file descriptors + bytes lidos' },
    ],
  },
  {
    id: 'filesystem',
    label: 'Filesystem',
    sublabel: 'pasta .git',
    icon: '📁',
    color: '#39d353',
    direction: 'up',
    payload: '.git/HEAD\n.git/index\n.git/refs/…',
    payloadLabel: 'arquivos lidos',
    desc: 'O kernel acessa o disco e retorna os dados do repositório: HEAD aponta para o branch, index tem o staging area.',
    detail: [
      { label: '.git/HEAD', value: 'ref: refs/heads/main' },
      { label: '.git/index', value: 'staging area (arquivos tracked)' },
      { label: 'diff', value: 'compara working tree vs index' },
    ],
  },
  {
    id: 'output',
    label: 'Output',
    sublabel: 'stdout → PTY → tela',
    icon: '▶',
    color: '#58a6ff',
    direction: 'up',
    payload: 'On branch main\nnothing to commit',
    payloadLabel: 'bytes ANSI',
    desc: 'git escreve em stdout (o PTY slave). O kernel entrega ao emulador (master). O emulador interpreta ANSI e renderiza.',
    detail: [
      { label: 'git escreve', value: 'stdout → PTY slave' },
      { label: 'kernel entrega', value: 'PTY master → emulador' },
      { label: 'emulador', value: 'interpreta ANSI → renderiza pixels' },
    ],
  },
]

const STEP_DURATION = 1800

export default function CommandFlow() {
  const [active, setActive] = useState(0)
  const [pulse, setPulse] = useState(false)
  const timerRef = useRef(null)
  const total = STEPS.length

  const goTo = useCallback((i) => {
    setActive(i)
    setPulse(true)
    setTimeout(() => setPulse(false), 500)
  }, [])

  // autoplay — loop infinito
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % total
        setPulse(true)
        setTimeout(() => setPulse(false), 500)
        return next
      })
    }, STEP_DURATION)
    return () => clearInterval(timerRef.current)
  }, [total])

  // ao clicar num dot: pula para ele e o loop continua de lá
  function handleDotClick(i) {
    clearInterval(timerRef.current)
    goTo(i)
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % total
        setPulse(true)
        setTimeout(() => setPulse(false), 500)
        return next
      })
    }, STEP_DURATION)
  }

  const current = STEPS[active]

  return (
    <section className="flow-section">
      <div className="section-label">fluxo de execução</div>
      <h2 className="section-title">
        O que acontece quando você digita <span>git status</span>
      </h2>
      <p className="section-desc">
        Passo a passo desde o teclado até o filesystem e de volta ao terminal.
      </p>

      <div className="flow-root">
        {/* Pipeline vertical */}
        <div className="flow-pipeline">
          <div className="flow-prompt glass-card">
            <span className="flow-prompt-ps mono">~/projects</span>
            <span className="flow-prompt-sym mono"> $ </span>
            <span className="flow-prompt-cmd mono">git status</span>
            <span className="flow-prompt-cursor" />
          </div>

          <div className="flow-nodes">
            {STEPS.map((step, i) => {
              const isActive = i === active
              const isDone = i < active
              const isReturn = step.direction === 'up'

              return (
                <div key={step.id} className="flow-node-wrapper">
                  {i > 0 && (
                    <div
                      className={`flow-pipe ${isDone || isActive ? 'lit' : ''} ${isReturn ? 'return' : ''}`}
                      style={{ '--c': STEPS[i - 1].color }}
                    >
                      <div
                        className={`flow-pipe-fill ${isDone || isActive ? 'animate' : ''}`}
                        style={{ '--c': step.color }}
                      />
                      {isActive && (
                        <div className="flow-payload-bubble" style={{ '--c': step.color }}>
                          <span className="mono">{STEPS[i - 1].payload?.split('\n')[0]}</span>
                        </div>
                      )}
                      {isReturn && <div className="return-label mono">↑ return</div>}
                    </div>
                  )}

                  <div
                    className={`flow-node-card glass-card ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    style={{ '--c': step.color }}
                  >
                    <div className="fnc-left">
                      <div className={`fnc-icon mono ${isActive && pulse ? 'pulse' : ''}`}>{step.icon}</div>
                      <div className="fnc-text">
                        <div className="fnc-label">{step.label}</div>
                        <div className="fnc-sub mono">{step.sublabel}</div>
                      </div>
                    </div>
                    <div className="fnc-right">
                      {(isDone || isActive) && (
                        <div className="fnc-payload mono" style={{ color: step.color }}>
                          {step.payloadLabel}
                        </div>
                      )}
                      <div className={`fnc-status ${isActive ? 'active' : isDone ? 'done' : ''}`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flow-detail">
          <div className="flow-detail-inner">
            <div className="fd-header">
              <div className="fd-step mono" style={{ color: current.color }}>
                passo {active + 1} / {total}
              </div>
              <div className="fd-icon mono" style={{ color: current.color }}>{current.icon}</div>
              <div className="fd-title">{current.label}</div>
              <div className="fd-sub mono">{current.sublabel}</div>
            </div>

            <p className="fd-desc">{current.desc}</p>

            <div className="fd-payload glass-card">
              <div className="fd-payload-label mono">{current.payloadLabel}</div>
              <pre className="fd-payload-value mono">{current.payload}</pre>
            </div>

            <div className="fd-meta">
              {current.detail.map(d => (
                <div key={d.label} className="fd-meta-row">
                  <span className="fd-meta-key mono">{d.label}</span>
                  <span className="fd-meta-val mono">{d.value}</span>
                </div>
              ))}
            </div>

            {/* Só os dots — clicáveis */}
            <div className="fd-progress">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  className={`fd-progress-dot ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}
                  style={{ '--c': s.color }}
                  onClick={() => handleDotClick(i)}
                  title={s.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
