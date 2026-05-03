import './App.css'
import './styles/dashboard.css'
import Sidebar from './components/Sidebar'
import DashboardHome from './components/DashboardHome'
import { modules, navItems } from './data/modules'

function App() {
  return (
    <div className="layout">
      <Sidebar items={navItems} />
      <DashboardHome modules={modules} />
    </div>
  )
}

export default App
