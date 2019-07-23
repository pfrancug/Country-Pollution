const getCities = (countryCode) => {
    fetch(`https://api.openaq.org/v1/measurements?country=${countryCode}&parameter=pm25&limit=250&order_by=value&sort=desc`).then((response) => {
        if (response.status === 200) {
            return response.json()
        } else {
            throw new Error('Error occured')
        }
    }).then((data) => {
        const cities = []
        data.results.forEach(element => {
            cities.push(element.city)
        })
        return cities.filter((v, i) => cities.indexOf(v) === i).slice(0, 10)
    }).then((cities) => {
        document.querySelector('#loader').remove()
        for (let i = 0; i < cities.length; i++) {
            getDescription(cities[i])
        }
    }).catch((error) => {
        document.querySelector('#loader').remove()
        results.appendChild(generateErrorElement(error))
    })
}

const getDescription = (city) => {
    fetch(`https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&titles=${city}`).then((response) => {
        if (response.status === 200) {
            return response.json()
        } else {
            throw new Error('Error occured')
        }
    }).then((data) => {
        const description = data.query.pages[Object.keys(data.query.pages)[0]].extract
        const formattedDesc = formatDescription(city, description)
        results.appendChild(generateCityElement(city, formattedDesc))
    }).catch((error) => {
        results.appendChild(generateCityElement(city, null, error))
    })
}