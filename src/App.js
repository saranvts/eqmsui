import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from'./components/login/login';
import Dashboard from'./components/dashboard/dashboard';
import Equipment from'./components/masters/equipment';
import EquipmentLog from './components/masters/equipmentLog';
import Make from './components/masters/make';
import Model from './components/masters/model';



function App() {
  return (
    
    <div className="App dms-font " >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />}/> 
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipmentlog" element={<EquipmentLog />} />
        <Route path="/make" element={<Make />} />
        <Route path="/model" element={<Model />} />
      </Routes>
    </div>
   
  );
}

export default App;
