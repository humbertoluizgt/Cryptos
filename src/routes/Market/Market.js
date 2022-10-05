import React, { Component } from 'react';
import './Market.css'
import Card from '../../components/CryptoCard/Card';
import Modal from '../../components/Modal/Modal';
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

//It is important to keep consistency throught out the code, 
//therefore I should have used the function components here as well. 
//However, my purpose here is to show that I can handle class components as well.

class Home extends Component {
  state = {
    dataAPI: [],
    sortBy: 'All Assets',    
    filterBy: { cryptoName: '' }
  }

  componentDidMount = () => {
    this.fetchCryptos()
    const interval = setInterval( () => {
      this.fetchCryptos()
     }, 100000)
     return () => clearInterval(interval)
  }

  //fetch data from API
  fetchCryptos = () => {
    fetch( `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${this.props.settings.currency.code}` )
      .then( response => response.json())
      .then ( data => this.setState( { dataAPI: data } ) )
  }

  //function to handle the filter buttons
  handleFilterBy = event => {      
    const { name, value } = event.target
    this.setState( { filterBy: { [name]: value } } )
  }  

  render() {
    return (
      <>
        <div className='home--controls'>
          <div className={ this.props.settings.darkMode? 'home--search dark-home' : 'home--search' }>
            <button className='home--search-button'>
              <FontAwesomeIcon icon={faMagnifyingGlass} size={'lg'}/>
            </button>
            <input 
              type='text'
              key='cryptoName' 
              name='cryptoName' 
              value={this.state.filterBy.cryptoName}
              onChange={(event) => this.handleFilterBy(event)}
              placeholder='Search crypto..' 
            />          
          </div>
          <div className='home--filters'>
            <button 
              className={this.state.sortBy === 'All Assets'? 'filter-btn selected' : 'filter-btn'}
              onClick={() => this.setState( { sortBy: 'All Assets' } )}>
                All Assets
            </button>
            <button 
              className={this.state.sortBy === 'Gainers'? 'filter-btn selected' : 'filter-btn'}
              onClick={() => this.setState( { sortBy: 'Gainers' } )}>
                Gainers
            </button>
            <button 
              className={this.state.sortBy === 'Losers'? 'filter-btn selected' : 'filter-btn'}
              onClick={() => this.setState( { sortBy: 'Losers' } )}>
                Losers
            </button>
            <button 
              className={this.state.sortBy === 'Favourites'? 'filter-btn selected' : 'filter-btn'}
              onClick={() => this.setState( { sortBy: 'Favourites' } )}>                       
                Favourities
            </button>
          </div>        
        </div>     
        <div className='home--cryptos-list'>
          <ListCryptos 
            state={ this.state }
            settings={ this.props.settings }
          />
        </div>       
      </>
    )
  }
}

class ListCryptos extends Component {
  state = { favourites: localStorage.getItem( 'favourites' )
              ? JSON.parse( localStorage.getItem( 'favourites' ) ) 
              : [],
            isPopup: false,
            id: null,
            name: null,
            img: null,
            price: null
          }

  //function to handle the favourites
  handleFavourite = id => {
    const favoriteIndex = this.state.favourites.findIndex( favourite => id === favourite )
    if ( favoriteIndex < 0 ) {
      this.setState( prev => ( { favourites: [...prev.favourites, id] } ) )           
    } else {
      this.setState( prev => ( { favourites: prev.favourites.filter( favourite => favourite !== id ) } ) )               
    }
  }

  //show or close popup and pass props to it
  handlePopup = (id, name, img, price) => {  
    this.setState( prev => ( { 
      isPopup: !prev.isPopup, 
      id: id,
      name: name, 
      img: img, 
      price: price 
    } ) )
  }

  componentDidUpdate = () => {
    localStorage.setItem( 'favourites', JSON.stringify( this.state.favourites ) );
  }

  render() {
    //list of cryptos filtered by user (search bar)
    const cryptosFiltered = this.props.state.dataAPI.filter( crypto => 
      crypto.name.toLowerCase().startsWith( this.props.state.filterBy.cryptoName.toLowerCase() ) );
 
    //list of cryptos sorted by user (buttons)
    let cryptoArr = []
    switch ( this.props.state.sortBy ) {      
      case 'Losers':
        cryptoArr = cryptosFiltered
                    .filter( crypto => crypto.market_cap_change_percentage_24h < 0 )
                    .sort( (a, b) => a.market_cap_change_percentage_24h - b.market_cap_change_percentage_24h )
      break;       

      case 'Gainers':
        cryptoArr = cryptosFiltered
                  .filter( crypto => crypto.market_cap_change_percentage_24h > 0 )
                  .sort( (a, b) => b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h )
      break;

      case 'Favourites':
        cryptoArr = this.state.favourites
                    .map( favourite => cryptosFiltered
                    .find( crypto => crypto.id === favourite ) )
                    .filter( crypto => crypto !== undefined )
      break;

      default:
        break;
    }

    //final checks wether user is filtering by favourites or not and then save to a new variable
    const cryptoList = cryptoArr.length === 0 && this.props.state.sortBy !== 'Favourites' ? cryptosFiltered : cryptoArr
    return (
      <>
        { cryptoList.map( crypto => (      
          <Card
            key={ nanoid() }
            settings={ this.props.settings } 
            data={ crypto } 
            favourites={ this.state.favourites } 
            handleFavourite={ id => this.handleFavourite( id ) }
            handlePopup={ (id, name, img, price) => this.handlePopup( id, name, img, price ) }
          /> ) ) }
        { this.state.isPopup && 
            <Modal 
              id={ this.state.id } 
              name={ this.state.name } 
              img={ this.state.img } 
              price={ this.state.price } 
              symbol= { this.props.settings.currency.symbol }
              decimals= { this.props.settings.decimals }
              handlePopup = { () => this.handlePopup() }
            /> 
        }
      </> 
    )
  }

}

export default Home