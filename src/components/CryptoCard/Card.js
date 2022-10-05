import React from 'react'
import './CryptoCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faSolid, faWallet } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { convertToCurrency } from '../../helper/helper'

export default function Card( props ) {
  return (
    <section className={ props.settings.darkMode? 'crypto_card--card dark-card' : 'crypto_card--card' }>
      <div className='crypto_card--card-img'>
        <img src={ props.data.image } alt={ props.data.id } />          
      </div>
      <div className='crypto_card--card-id'>
        <div>
          <h1>{ props.data.name }</h1>
          <h2>Rank: { props.data.market_cap_rank }</h2>
        </div>
      </div>
      <div 
        className='crypto_card--wallet'
        onClick={ () => props.handlePopup( 
                          props.data.id,
                          props.data.name, 
                          props.data.image,
                          props.data.current_price ) 
        }>      
          <FontAwesomeIcon icon={ faWallet } size={ '2x' } />           
      </div>
      <div 
        className='crypto_card--favourite'
        onClick={ () => props.handleFavourite( props.data.id ) }>
          {props.favourites.find( favourite => props.data.id === favourite ) 
            ? <FontAwesomeIcon icon={ faSolid } size={ '2x' } color={ 'orange' } />
            : <FontAwesomeIcon icon={ faStar } size={ '2x' } color={ 'orange' } /> 
          }
      </div>
      <div className='crypto_card--card-price'>
          <h1>
            { convertToCurrency( props.settings.currency.symbol, props.data.current_price, props.settings.decimals ) }
          </h1>
          <h2 style={ { color: props.data.market_cap_change_percentage_24h > 0? 'rgb(51, 192, 51)' : 'red' } }>
            { props.data.market_cap_change_percentage_24h.toFixed(2) }%
          </h2>
      </div>      
    </section>  
  )
}