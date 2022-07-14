export const currencyMask = (data, lng) => {
   
    let currency;
    if(lng === 'pt') {
        currency = Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        })
    } else {
        currency = Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2           
        })
    }

    const localCurrency = currency.format(data)
    
    return localCurrency
}