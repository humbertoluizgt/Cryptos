import React, { useState, useEffect, useContext } from 'react'
import './Wallet.css'
import { Context } from '../../context/ThemeContext'
import Modal from '../../components/Modal/Modal'
import { convertToCurrency } from '../../helper/helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faTrashCan } from '@fortawesome/free-solid-svg-icons'

export default function Wallet() {
  const context = useContext(Context)
  //fetching data from API url 
  useEffect( () => { 
    // const interval = setInterval( () => {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${context.settings.currency.code}`)
      .then( response => response.json())
      .then ( data => setDataAPI( [...data] ) ) 
  //  }, 100000)
  //  return () => clearInterval(interval)
  }, [] )

  //it will store the data from the API request above
  const [ dataAPI, setDataAPI ] = useState( [] )

  //it will store the cryptos added to the wallet
  const [ wallet, setWallet ] = useState( () => {
    return localStorage.getItem( 'cryptoWallet' ) && JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).length > 0
    ? JSON.parse( localStorage.getItem( 'cryptoWallet' ) )
    : [] 
  } )

  //this is to control the popup and its values to display 
  const [ popup, setPopup ] = useState( {
    isPopup: false,
    id: null,
    name: null,
    img: null,
    price: null
  } )

  //every time popup state changes it needs to update the wallet state (buy or sell)
  useEffect( () => {
    setWallet( () => {
      return localStorage.getItem( 'cryptoWallet' ) && JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).length > 0
      ? JSON.parse( localStorage.getItem( 'cryptoWallet' ) )
      : [] 
    } )
  }, [popup] )

  //change the popup state when user clicks on button
  const handlePopup = (id, name, img, price) => {
    setPopup( prevState => ( { 
        isPopup: !prevState.isPopup, 
        id: id,
        name: name,
        img: img,
        price: price
      } ) )
  }

  //function to delete crypto when user clicks on the bin icon. 
  const deleteCrypto = id => {
    const newWallet = wallet.filter( crypto => crypto.id !== id )
    setWallet( [...newWallet] )
    localStorage.setItem( 'cryptoWallet', JSON.stringify( [...newWallet] ) )
  }

  //the current price of each crypto in wallet
  const findCurrentPrice = id => {
    const findCrypto = dataAPI.filter( crypto => crypto.id === id )
    if (findCrypto.length > 0) {
      return findCrypto[0].current_price
    } else {
      return 0;
    }
  }

  //provides calculations for the summary
  const summaryCalc = calc => {
    const total = wallet.map( crypto => crypto.totalPrice ).reduce( ( prev, curr ) => prev + curr, 0 )
    const worth = wallet.map( crypto => findCurrentPrice( crypto.id ) * crypto.amount ).reduce( ( prev, curr ) => prev + curr, 0 )
    switch (calc) {
      case 'total':
        return convertToCurrency( context.settings.currency.symbol, total, context.settings.decimals )          
        case 'worth':
          return convertToCurrency( context.settings.currency.symbol, worth, context.settings.decimals )   
      default:
        return convertToCurrency( context.settings.currency.symbol, worth - total, context.settings.decimals )
    }
  }

  return (
    <div className='wallet--content'>
      <h1 className='wallet--title'>Wallet</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Asset</th>
            <th>Amount</th>
            <th>Avg Price</th>
            <th>Total</th>
            <th>Current Price</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {wallet.map( (crypto, index) => {
          const currentPrice = findCurrentPrice(crypto.id)
          return (           
            <tr key={ index }>
              <td><img src={ crypto.img } alt={ crypto.name } /></td>
              <td>{ crypto.name }</td>
              <td>{ crypto.amount }</td>
              <td>{ convertToCurrency( context.settings.currency.symbol, crypto.avgCoinPrice, context.settings.decimals ) }</td>
              <td>{ convertToCurrency( context.settings.currency.symbol, crypto.totalPrice, context.settings.decimals ) }</td>
              <td>{ convertToCurrency( context.settings.currency.symbol, currentPrice, context.settings.decimals ) }</td>
              <td><FontAwesomeIcon 
                className = 'wallet--icon'
                icon = { faWallet } 
                size = 'lg'
                onClick = { () => handlePopup(crypto.id, crypto.name, crypto.img, currentPrice) } />
              </td>
              <td><FontAwesomeIcon 
                className = 'wallet--icon'
                icon = { faTrashCan } 
                size = 'lg' 
                onClick = { () => deleteCrypto(crypto.id) } />
              </td>
            </tr>
          ) } ) }          
        </tbody>        
      </table>
      <section className='wallet--summary'>
            <h2>
              Total Invested: { summaryCalc( 'total' ) }
            </h2>
            <h2>
              Net Worth: { summaryCalc( 'worth' ) }
            </h2>
            <h2>
              Profit/Loss: { summaryCalc() }
            </h2>
      </section>
      { popup.isPopup && 
        <Modal 
          id = { popup.id } 
          name = { popup.name } 
          img = { popup.img } 
          price = { popup.price } 
          symbol = { context.settings.currency.symbol }
          decimals = { context.settings.decimals }
          handlePopup = { () => handlePopup() }
        /> }
    </div>
  )
}