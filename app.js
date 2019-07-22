const countries = [['Poland', 'PL'], ['Spain', 'ES'], ['France', 'FR'], ['Germany', 'DE']]
const results = document.querySelector('#results')
let countryCode
let city

getSavedCountry()

new autoComplete({
    selector: 'input[name="search-text"]',
    minChars: 0,
    source: (term, suggest) => {
        term = term.toLowerCase()
        const suggestions = [];
        for (i = 0; i < countries.length; i++)
            if (~(countries[i][0] + ' ' + countries[i][1]).toLowerCase().indexOf(term)) suggestions.push(countries[i])
        suggest(suggestions)
    },
    renderItem: (item, search) => {
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        const re = new RegExp("(" + search.split(' ').join('|') + ")", "gi")
        return `<div class="autocomplete-suggestion" data-langname="${item[0]}" data-lang="${item[1]}" data-val="${search}"><img src="src/img/${item[0]}.png"> ${item[0].replace(re, '<b>$1</b>')}</div>`
    },
    onSelect: (e, term, item) => {
        document.querySelector('#search-text').value = item.getAttribute('data-langname')
    }
})

document.querySelector('#search-text').addEventListener('input', (e) => saveCountry(e.target.value))

document.querySelector('#search').addEventListener('click', () => {
    results.innerHTML = ''
    setCountryCode()
    if (countryCode === null) {
        const msg = `Sorry, please try one of supported country from the list.`
        results.appendChild(generateErrorElement(msg))
    } else {
        results.appendChild(loadingElement())
        getCities((error, cities) => {
            document.querySelector('#loader').remove()
            if (error) {
                document.querySelector('#loader').remove()
                results.appendChild(generateErrorElement(error))
            } else {
                cities.forEach(element => {
                    city = element
                    getDescription((error, description) => {
                        if (error) {
                            results.appendChild(generateErrorElement(error))
                        } else {
                            const formattedDesc = formatDescription(city, description)
                            results.appendChild(generateCityElement(city, formattedDesc))
                        }
                    })
                })
            }
        })
    }
})

