const countries = [
    {
        name: 'Poland',
        cc: 'PL'
    }, {
        name: 'Germany',
        cc: 'DE'
    }, {
        name: 'Spain',
        cc: 'ES'
    }, {
        name: 'France',
        cc: 'FR'
    }
]
let countryCode
let city

getSavedCountry()

new autoComplete({
    selector: 'input[name="search-text"]',
    minChars: 0,
    source: function (term, suggest) {
        term = term.toLowerCase()
        const choices = []
        countries.forEach(element => {
            choices.push(element.name)
        })
        const matches = []
        for (i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i])
        suggest(matches)
    }
})

document.querySelector('#search').addEventListener('click', (e) => {
    loading()
    let cc = document.querySelector('#search-text').value.toLowerCase()
    cc = cc.charAt(0).toUpperCase() + cc.slice(1).toLowerCase()
    countryCode = getCC(cc)
    saveCountry()
    getCities((error, cities) => {
        if (error) {
            console.log(`Error: ${error}`)
        } else {
            document.querySelector('#loader').remove()
            cities.forEach(element => {
                city = element
                getDescription((error, description) => {
                    if (error) {
                        console.log(`Error: ${error}`)
                    } else {
                        generateCityElement(city, startFromIs(city, description))
                    }
                })
            })
        }
    })
})
