import './App.css'
import './styles/dashboard.css'
import Sidebar from './components/Sidebar'
import DashboardHome from './components/DashboardHome'
import { modules } from './data/modules'

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <DashboardHome modules={modules} />
    </div>
  )
}

export default App
