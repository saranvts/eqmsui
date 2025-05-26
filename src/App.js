import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import LoginPage from'./components/login/login'
import Dashboard from'./components/dashboard/dashboard'



function App() {
  return (
    
    <div className="App dms-font " >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />}/> 
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
   
  );
}

export default App;
