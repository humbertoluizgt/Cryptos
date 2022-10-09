import React, { useContext } from 'react';
import './Navbar.css'
import { Context } from '../../context/ThemeContext';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faWallet, faGear } from '@fortawesome/free-solid-svg-icons'

function Navbar() {
  const context = useContext(Context)   
  return (
    <header className={ context.settings.darkMode? 'navbar--header dark-nav' : 'navbar--header' }>
      <nav className='navbar--nav'>
        <Link 
          className='navbar--nav-button'
          to='/'>
            <FontAwesomeIcon icon={ faCoins } size='lg' className='navbar--icon' />
            Market
        </Link>
        <Link 
          className='navbar--nav-button'
          to='/wallet'>
            <FontAwesomeIcon icon={ faWallet } size='lg' className='navbar--icon' />
            My Wallet
        </Link>
        <Link  
          className='navbar--nav-button'
          to='/settings'>
            <FontAwesomeIcon icon={ faGear } size='lg' className='navbar--icon' />
            Settings
        </Link>        
      </nav>  
    </header>     
  )
}

export default Navbar