import React, { createContext, useState } from 'react';

export const Context = createContext()

export default function ThemeContext( props ) {
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
    <Context.Provider value={ { settings: settings, handleSettings: handleSettings } }>
      { props.children }
    </Context.Provider>
  )
}
