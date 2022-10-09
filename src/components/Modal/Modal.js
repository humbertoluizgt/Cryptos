import React, { useContext, useState } from 'react'
import './Modal.css'
import { Context } from '../../context/ThemeContext'
import { convertToCurrency } from '../../helper/helper'

export default function AddToWallet( props ) {

  const context = useContext(Context)

  //state to save user inputs
  const [ userInput, setUserInput ] = useState( { 
    amount: 0,
    coinPrice: 0
  } )

  //calculates the total price bsed on user inputs
  const totalPrice = userInput.amount * userInput.coinPrice

  //updates on every user's type 
  const handleChange = event => {
    const { name, value } = event.target
    setUserInput( prevInput => ( { ...prevInput, [name]: value } ) )
  }

  //runs after click on buy button
  const handleBuy = () => {
    if ( totalPrice === 0 ) {
      alert('Total Price cannot be zero')
      return
    }
    if ( localStorage.getItem( 'cryptoWallet' ) && JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).length > 0 ) {
      const currentWallet =  JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).map( crypto => crypto )
      const isExisting = currentWallet.filter( crypto => crypto.id === props.id )
      if ( isExisting.length > 0 ) {
        const updatedCrypto = {
          id: props.id,
          name: props.name,
          img: props.img,
          amount: parseInt(userInput.amount) + isExisting[0].amount,
          totalPrice: totalPrice + isExisting[0].totalPrice,
          avgCoinPrice: ( totalPrice + isExisting[0].totalPrice ) / ( parseInt(userInput.amount) + isExisting[0].amount )
        }
        const filteredWallet = currentWallet.filter( crypto => crypto.id !== props.id )
        localStorage.setItem( 'cryptoWallet', JSON.stringify( [ ...filteredWallet, updatedCrypto ] ) )
      } else {
        const newCrypto = {
          id: props.id,
          name: props.name,
          img: props.img,
          amount: parseInt( userInput.amount ),
          totalPrice: totalPrice,
          avgCoinPrice: ( totalPrice / parseInt( userInput.amount ) )
        } 
        localStorage.setItem( 'cryptoWallet', JSON.stringify( [ ...currentWallet, newCrypto ] ) )
      }
    } else {
      localStorage.setItem( 'cryptoWallet', JSON.stringify( [ {
        id: props.id,
        name: props.name,
        img: props.img,
        amount: parseInt(userInput.amount),
        totalPrice: totalPrice,
        avgCoinPrice: totalPrice / parseInt(userInput.amount)
      } ] ) )
    }    
    props.handlePopup()
    alert( 'Crypto Successfully added to the Walet!' )
  }

  //runs after click on sell button
  const handleSell = () => {
    if ( localStorage.getItem( 'cryptoWallet' ) && JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).length > 0 ) {
      const currentWallet =  JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).map( crypto => crypto )
      const filteredWallet = currentWallet.filter( crypto => crypto.id !== props.id )
      const isExisting = currentWallet.filter( crypto => crypto.id === props.id )
      
      if ( isExisting.length <= 0 ) {
        alert('Not enough coins in Wallet')
        return
      } else if ( isExisting[0].amount > parseInt( userInput.amount ) ) {
          const updatedCrypto = {
            id: props.id,
            name: props.name,
            img: props.img,
            amount: isExisting[0].amount - parseInt( userInput.amount ),
            totalPrice: isExisting[0].totalPrice - totalPrice,
            avgCoinPrice: ( ( isExisting[0].totalPrice - totalPrice ) / ( isExisting[0].amount - parseInt( userInput.amount ) ) )
          } 
          localStorage.setItem( 'cryptoWallet', JSON.stringify( [ ...filteredWallet, updatedCrypto ] ) )
          alert('Crypto Successfully sold!')
          props.handlePopup()
      } else if ( isExisting[0].amount === parseInt( userInput.amount ) ) {
          localStorage.setItem( 'cryptoWallet', JSON.stringify( [ ...filteredWallet ] ) )
          alert('Crypto Successfully sold!')
          props.handlePopup()
      } else alert('Not enough coins in Wallet')
    } else {
      alert('Not enough coins in Wallet')
    }
  }

  //checks the total crypto amount in wallet to display. If not found it will display zero
  const amountInWallet = () => {
    if ( localStorage.getItem( 'cryptoWallet' ) && JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).length > 0 ) {
      const currentWallet =  JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).map( crypto => crypto )
      const isExisting = currentWallet.filter( crypto => crypto.id === props.id )
      if ( isExisting.length <= 0 ) {        
        return '0'
      } else {
        return isExisting[0].amount
      }
    } else {
      return '0'
    }
  }

  //checks the crypto's average price in wallet to display. If not found it will display zero
  const avgPrice = () => {
    if ( localStorage.getItem( 'cryptoWallet' ) && JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).length > 0 ) {
      const currentWallet =  JSON.parse( localStorage.getItem( 'cryptoWallet' ) ).map( crypto => crypto )
      const isExisting = currentWallet.filter( crypto => crypto.id === props.id )
      if ( isExisting.length <= 0 ) {        
        return '0'
      } else {
        return convertToCurrency( context.settings.currency.symbol, isExisting[0].avgCoinPrice, context.settings.decimals )
      }
    } else {
      return '0'
    }
  }

  return (
    <div className='add_to_wallet--container'>      
      <div className='add_to_wallet--options'>
        <button
          onClick={ () => handleBuy() }>
            BUY
        </button>
        <button
          onClick={ () => handleSell() }>
            SELL
        </button>
      </div>
      <div className='add_to_wallet--content'>

        <section className='add_to_wallet--content-left'>
          <img src={ props.img } alt={ props.name } />
          <h2>{ props.name }</h2>
          <h2>Current Price: { convertToCurrency( context.settings.currency.symbol, props.price, context.settings.decimals ) }</h2> 
          <div className='add_to_wallet--stats'>
            <h3>Total in Wallet: { amountInWallet() }</h3>
            <h3>Avg price: { avgPrice() }</h3>
          </div>
        </section>

        <section className='add_to_wallet--content-right'>
          <div className='add_to_wallet--inputs'>
            <label htmlFor='amount'>Amount:</label>
            <input 
              type='number' 
              name='amount' 
              id='amount'
              value={ userInput.amount }
              min={ 0 }
              onChange={ event => handleChange( event ) } />
            <label htmlFor='price'>Price p/coin:</label>
            <input 
              type='number' 
              name='coinPrice' 
              id='coinPrice'
              value={ userInput.coinPrice }
              min={ 0 }
              onChange={ event => handleChange( event ) } />
            <h2>Total Value:</h2>
            <h2>{ convertToCurrency( context.settings.currency.symbol, totalPrice, context.settings.decimals ) }</h2>            
          </div>          
        </section>
      </div>

      <button 
        className='add_to_wallet--cancel'
        onClick={ () => props.handlePopup() }>
          Cancel
      </button>  
    </div>
  )
}
