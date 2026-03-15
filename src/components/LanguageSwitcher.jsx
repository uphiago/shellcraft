import { useLang } from '../LanguageContext'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  const next = lang === 'pt-BR' ? 'en' : 'pt-BR'
  const label = lang === 'pt-BR' ? 'EN' : 'PT'

  return (
    <button
      className="lang-switcher mono"
      onClick={() => setLang(next)}
      title={lang === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
      aria-label="Switch language"
    >
      {label}
    </button>
  )
}
