const getCities = (countryCode) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.addEventListener('readystatechange', (e) => {
        if (e.target.readyState === 4 && e.target.status === 200) {
            const data = JSON.parse(e.target.responseText)
            const cities = []
            data.results.forEach(element => {
                cities.push(element.city)
            })
            const topCities = (cities) => cities.filter((v, i) => cities.indexOf(v) === i).slice(0, 10)
            resolve(topCities(cities))
        } else if (e.target.readyState === 4) {
            reject('Please try again later.')
        }
    })
    request.open('GET', `https://api.openaq.org/v1/measurements?country=${countryCode}&parameter=pm25&limit=250&order_by=value&sort=desc`)
    request.send()
})

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
        results.appendChild(generateErrorElement(city, null, error))
    })
}