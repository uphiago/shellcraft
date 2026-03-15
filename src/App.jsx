import './App.css'
import Hero from './components/Hero'
import LayerDiagram from './components/LayerDiagram'
import EcosystemGraph from './components/EcosystemGraph'
import CommandFlow from './components/CommandFlow'

export default function App() {
  return (
    <div className="app">
      <Hero />
      <LayerDiagram />
      <CommandFlow />
      <EcosystemGraph />
    </div>
  )
}
