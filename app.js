const countries = [['Poland', 'PL'], ['Spain', 'ES'], ['France', 'FR'], ['Germany', 'DE']]
const results = document.querySelector('#results')

getSavedCountry()

new autoComplete({
    selector: 'input[name="search-text"]',
    minChars: 0,
    source: (term, suggest) => {
        term = term.toLowerCase()
        const suggestions = [];
        for (i = 0; i < countries.length; i++)
            if (~(`${countries[i][0]} ${countries[i][1]}`).toLowerCase().indexOf(term)) suggestions.push(countries[i])
        suggest(suggestions)
    },
    renderItem: (item, search) => {
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        const re = new RegExp("(" + search.split(' ').join('|') + ")", "gi")
        if (item[0].toLowerCase() === search.toLowerCase()) {
            document.querySelector('.autocomplete-suggestions').setAttribute('hidden', true)
        } else {
            document.querySelector('.autocomplete-suggestions').removeAttribute('hidden')
        }
        return `<div class="autocomplete-suggestion" data-langname="${item[0]}" data-lang="${item[1]}" data-val="${search}"><img src="src/img/${item[0]}.png"> ${item[0].replace(re, '<b>$1</b>')}</div>`
    },
    onSelect: (e, term, item) => document.querySelector('#search-text').value = item.getAttribute('data-langname')
})

document.querySelector('#search-text').addEventListener('input', (e) => saveCountry(e.target.value))

document.querySelector('#search').addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('#search-text').blur()
    fetchData()
})