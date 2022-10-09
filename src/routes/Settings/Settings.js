import React, { useContext } from 'react'
import { Context } from '../../context/ThemeContext'
import './Settings.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOff } from '@fortawesome/free-solid-svg-icons'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons'


export default function Settings() {
  const context = useContext(Context)   

  //options for decimal cases
  const decimalsOptions = [0, 1, 2, 3, 4, 5]
  //options for currency
  const currencyOptions = [
    { name: 'USD (US Dollar)', code: 'usd', symbol: '$' }, 
    { name: 'EUR (Euro)', code: 'eur', symbol: '€' }, 
    { name: 'GBP (British Pound Sterling)', code: 'gbp', symbol: '£' }, 
    { name: 'JPY (Japanese Yen)', code: 'jpy', symbol: '¥' },
    { name: 'AUD (Australian Dollar)', code: 'aud', symbol: 'AUD$' }, 
    { name: 'CAD (Canadian Dollar)', code: 'cad', symbol: 'CAD$' },
    { name: 'INR (Indian Rupee)', code: 'inr', symbol: '₹' }, 
    { name: 'BRL (Brazil Real)', code: 'brl', symbol: 'R$' }, 
    { name: 'ZAR (South African Rand)', code: 'zar', symbol: 'R' }, 
    { name: 'RUB (Russian Ruble)', code: 'rub', symbol: '₽' },    
    { name: 'CNY (Chinese Yuan)', code: 'cny', symbol: 'C¥' }
  ]

  return (
    <>
      <h1 className='settings--title'>Settings</h1>
      <div className='settings--dark-mode'>
        <h3>Dark Mode?</h3> 
          <div>
            <FontAwesomeIcon
              id='dark-mode-icon' 
              icon={ context.settings.darkMode? faToggleOn : faToggleOff } 
              size={ '3x' } 
              className='settings--dark-mode-icon'
              onClick={ event => context.handleSettings(event) } 
            />
          </div>       
          
        <h4>{context.settings.darkMode? 'ON' : 'OFF'}</h4>
      </div>
      <div className='settings--currency'>
        <h3>Currency:</h3>
        <select
          name='currency'
          id='currency'
          value={ JSON.stringify(context.settings.currency) }
          onChange={ event => context.handleSettings(event) }>  
          { currencyOptions.map( ( curr, idx ) => {  
            return (
              <option 
                key={ idx } 
                value={ JSON.stringify(curr) }>
                  { curr.name }
              </option>
            )
          } ) }
        </select>
      </div>
      <div className='settings--decimal-cases'>
        <h3>No of Decimal cases: </h3>
        <select 
          name='decimals' 
          id='decimals' 
          value={ context.settings.decimals }
          onChange={ event => context.handleSettings(event) }> 
          { decimalsOptions.map( value => {  
            return (
              <option 
                key={ value } 
                value={ value }>
                  { value }
              </option>
            )
          } ) }
        </select>
      </div>      
    </>
  )
}