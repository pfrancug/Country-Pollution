const getCities = (callback) => {
    const request = new XMLHttpRequest()
    request.addEventListener('readystatechange', (e) => {
        if (e.target.readyState === 4 && e.target.status === 200) {
            const data = JSON.parse(e.target.responseText)
            const cities = []
            data.results.forEach(element => {
                cities.push(element.city)
            })
            const topCities = (cities) => cities.filter((v, i) => cities.indexOf(v) === i).slice(0, 10)
            callback(undefined, topCities(cities))
        } else if (e.target.readyState === 4) {
            console.log(e)

            callback('An error has taken place, please try again later.', undefined)
        }
    })
    request.open('GET', `https://api.openaq.org/v1/measurements?country=${countryCode}&parameter=pm25&limit=250&order_by=value&sort=desc`)
    request.send()
}

const getDescription = (callback) => {
    const request = new XMLHttpRequest()
    request.addEventListener('readystatechange', (e) => {
        if (e.target.readyState === 4 && e.target.status === 200) {
            let data = JSON.parse(e.target.responseText).query.pages
            data = data[Object.keys(data)[0]].extract
            callback(undefined, data)
        } else if (e.target.readyState === 4) {
            console.log(e)

            callback('An error has taken place, please try again later.', undefined)
        }
    })
    request.open('GET', `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&titles=${city}`, false)
    request.send()
}