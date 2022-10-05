export const convertToCurrency = (symbol, price, decimals) => {
  return `${ symbol }${ price.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,') }`
}