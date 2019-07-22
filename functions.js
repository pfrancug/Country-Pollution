const saveCountry = (country) => {
    localStorage.setItem('country', JSON.stringify(country))
}

const getSavedCountry = () => {
    const savedCountry = JSON.parse(localStorage.getItem('country'))
    document.querySelector('#search-text').value = savedCountry
}

const setCountryCode = () => {
    let input = document.querySelector('#search-text').value
    input = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
    saveCountry(input)
    for (let i = 0; i < countries.length; i++) {
        if (countries[i][0] === input) {
            countryCode = countries[i][1]
            return
        } else {
            countryCode = null
        }
    }
}

const formatDescription = (city, description) => {
    let index
    if (description === undefined) {
        return null
    } else if (description.indexOf('is a') >= 0) {
        index = description.indexOf('is a')
    } else if (description.indexOf('is the') >= 0) {
        index = description.indexOf('is the')
    }
    if (index === undefined) {
        return null
    } else {
        return `${city} ${description.slice(index)}`
    }
}

const loadingElement = () => {
    const text = document.createElement('div')
    text.setAttribute('id', 'loader')
    text.setAttribute('class', 'text-center')
    const spinner = document.createElement('div')
    spinner.setAttribute('class', 'spinner-border')
    spinner.setAttribute('role', 'status')
    const sr = document.createElement('span')
    sr.setAttribute('class', 'sr-only')
    sr.textContent = 'Loading...'
    text.appendChild(spinner).appendChild(sr)
    return text
}

const generateCityElement = (city, description, error) => {
    const cityEl = document.createElement('div')
    cityEl.setAttribute('class', 'border border-dark rounded my-1 col-8')
    const paragraphEl = document.createElement('p')
    paragraphEl.setAttribute('class', 'row pt-3 px-3')
    const headEl = document.createElement('p')
    headEl.setAttribute('class', 'h4 col-8')
    headEl.textContent = city
    cityEl.appendChild(paragraphEl)
    paragraphEl.appendChild(headEl)
    const btnEl = document.createElement('button')
    btnEl.setAttribute('type', 'button')
    if (description) {
        btnEl.setAttribute('class', 'btn btn-success text-dark my-1 col-4')
        btnEl.setAttribute('data-toggle', 'collapse')
        btnEl.setAttribute('data-target', `#${city.replace(/\s/g, '')}`)
        btnEl.textContent = 'Learn more'
        const collapseEl = document.createElement('div')
        collapseEl.setAttribute('class', 'collapse pb-3')
        collapseEl.setAttribute('id', city.replace(/\s/g, ''))
        const cardEl = document.createElement('div')
        cardEl.setAttribute('class', 'card card-body text-justify')
        cardEl.textContent = description
        cityEl.appendChild(collapseEl)
        collapseEl.appendChild(cardEl)
    } else if (error) {
        btnEl.setAttribute('class', 'btn btn-danger my-1 col-4')
        btnEl.setAttribute('disabled', true)
        btnEl.textContent = 'Error occured'
    } else {
        btnEl.setAttribute('class', 'btn btn-dark my-1 col-4')
        btnEl.setAttribute('disabled', true)
        btnEl.textContent = 'Lack of data'
    }
    paragraphEl.appendChild(btnEl)
    return cityEl
}

const generateErrorElement = (error) => {
    const alertEl = document.createElement('div')
    alertEl.setAttribute('class', 'alert alert-light')
    alertEl.setAttribute('role', 'alert')
    const headingEl = document.createElement('p')
    headingEl.setAttribute('class', 'h4 alert-heading')
    headingEl.textContent = 'Error!'
    const messageEl = document.createElement('p')
    messageEl.textContent = error
    const hrEl = document.createElement('hr')
    const pEl = document.createElement('p')
    pEl.setAttribute('class', 'text-right mb-0')
    pEl.textContent = 'Stay healthy!'
    alertEl.appendChild(headingEl)
    alertEl.appendChild(messageEl)
    alertEl.appendChild(hrEl)
    alertEl.appendChild(pEl)
    return alertEl
}

const getData = () => {
    getCities(countryCode).then((cities) => {
        document.querySelector('#loader').remove()
        for (let i = 0; i < cities.length; i++) {
            getDescription(cities[i]).then((description) => {
                results.appendChild(generateCityElement(cities[i], description))
            }, (error) => {
                results.appendChild(generateCityElement(cities[i], null, error))
            })
        }
    }, (error) => {
        document.querySelector('#loader').remove()
        results.appendChild(generateErrorElement(error))
    })
}