import './Hero.css'

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-bg">
        <div className="hero-glow glow-1" />
        <div className="hero-glow glow-2" />
        <div className="hero-glow glow-3" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          ecossistema de terminal
        </div>

        <h1 className="hero-title">
          Você usa terminal.<br />
          Mas usa <span className="hero-highlight">5 softwares</span><br />
          ao mesmo tempo.
        </h1>

        <p className="hero-sub">
          Terminal, shell, multiplexer, framework, ferramentas CLI —
          cada camada tem um papel. Vamos destrinchar o ecossistema
          completo de forma visual.
        </p>

        <div className="hero-stack">
          {['Alacritty', 'tmux', 'zsh', 'Oh My Zsh', 'git'].map((tool, i) => (
            <div key={tool} className="hero-stack-item" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="mono">{tool}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-fade" />
      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </div>
  )
}
