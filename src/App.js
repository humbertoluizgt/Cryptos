import React from 'react';
import './App.css';
import ThemeContext from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Main from './components/Main/Main';
import Market from './routes/Market/Market';
import Wallet from './routes/Wallet/Wallet'
import Settings from './routes/Settings/Settings'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return(
    <ThemeContext>
      <Router>
        <Navbar/>   
        <Main>
          <Routes>  
            <Route              
              index element={ <Market /> }/>      
    
            <Route 
              path='/wallet' 
              element={ <Wallet /> }/>     
            <Route 
              path='/settings' 
              element={ <Settings /> }/>               
          </Routes> 
        </Main>  
      </Router>
    </ThemeContext>
  );
}

export default App;