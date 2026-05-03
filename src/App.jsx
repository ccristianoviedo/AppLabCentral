import { useState } from 'react'
import './App.css'
import './styles/dashboard.css'
import Sidebar from './components/Sidebar'
import DashboardHome from './components/DashboardHome'
import AlinityModule from './components/AlinityModule'
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
      {currentView === 'home' ? (
        <DashboardHome modules={modules} onModuleSelect={handleModuleSelect} />
      ) : (
        <AlinityModule onBack={() => setCurrentView('home')} />
      )}
    </div>
  )
}

export default App
