import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Market from './routes/Market/Market';
import Wallet from './routes/Wallet/Wallet'
import Settings from './routes/Settings/Settings'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


function App() {

  const [settings, setSettings] = useState( {
    darkMode: false,
    currency: { name: "USD (US Dollar)", code: "usd", symbol: "$" },  
    decimals: 2
  } )

  const handleSettings = event => {
    const { id, name, value } = event.target
    id === "dark-mode-icon" || id === ""
    ? setSettings( prevState => ( {...prevState, 'darkMode': !prevState.darkMode} ) )
    : setSettings( prevState => ( {...prevState, [name]: JSON.parse(value) } ) )
  }

  return (
    <Router>
        <Navbar
          settings={settings}
        /> 
        <main className={settings.darkMode? 'app--main dark-main' : 'app--main'}> 
          <Routes>        
            <Route 
              path='/' 
              element={ 
                <Market 
                  settings={settings}
                /> 
              }/>
            <Route 
              path='/wallet' 
              element={ 
                <Wallet 
                  settings={settings}
                />
              }/>     
            <Route 
              path='/settings' 
              element={ 
                <Settings
                  settings={ settings }
                  handleSettings={ (event) => handleSettings(event) }
                /> 
              }/>               
          </Routes> 
        </main> 
    </Router>
  );
}

export default App;