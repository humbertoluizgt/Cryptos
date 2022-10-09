import React, { useContext } from "react";
import { Context } from "../../context/ThemeContext";
import './Main.css'

export default function Main( props ) {
  const context = useContext(Context)
  return (
    <main className={ context.settings.darkMode? 'app--main dark-main' : 'app--main' }>
      { props.children }
    </main>
  )
}
