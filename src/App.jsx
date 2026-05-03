import { useState } from 'react'
import './App.css'
import './styles/dashboard.css'
import Sidebar from './components/Sidebar'
import DashboardHome from './components/DashboardHome'
import AlinityModule from './components/AlinityModule'
import InOutModule from './components/InOutModule'
import { modules } from './data/modules'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const handleModuleSelect = (module) => {
    if (module.name === 'ALINITY') {
      setCurrentView('alinity')
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      {currentView === 'home' && (
        <DashboardHome modules={modules} onModuleSelect={handleModuleSelect} />
      )}
      {currentView === 'alinity' && (
        <AlinityModule onBack={() => setCurrentView('home')} onOpenInOut={() => setCurrentView('inout')} />
      )}
      {currentView === 'inout' && (
        <InOutModule onBack={() => setCurrentView('alinity')} />
      )}
    </div>
  )
}

export default App
