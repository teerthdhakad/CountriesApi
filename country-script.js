const themeToggleButton = document.querySelector('.theme-toggle');
const body = document.body;
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
} else {
    body.classList.remove('dark-mode');
}
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Save state to localStorage
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

function displayCountryDetails(country){
    const countryDetailsContainer = document.querySelector('.country-details');
        countryDetailsContainer.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.flags.alt} flag" class="country-flag">
        <div class="country-info">
            <h1 class="country-name">${country.name.common}</h1>
            <div class="country-info-columns" style="display: flex; gap: 40px;">
                <div>
                    <p><strong>Native Name</strong>: ${country.name.nativeName ? Object.values(country.name.nativeName)[0].common : country.name.common}</p>
                    <p><strong>Population</strong>: ${country.population.toLocaleString()}</p>
                    <p><strong>Region</strong>: ${country.region}</p>
                    <p><strong>Sub Region</strong>: ${country.subregion || 'N/A'}</p>
                    <p><strong>Capital</strong>: ${country.capital ? country.capital[0] : 'N/A'}</p>
                </div>
                <div>
                    <p><strong>Top Level Domain</strong>: ${country.tld ? country.tld.join(', ') : 'N/A'}</p>
                    <p><strong>Currencies</strong>: ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
                    <p><strong>Languages</strong>: ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                </div>
            </div>
            <div style="margin-top: 20px;" class="border-countries">
                <strong>Border Countries:</strong>
                ${country.borders
                ? country.borders
                    .filter(border => localStorage.getItem(border)) // Only borders with a value
                    .map(border => `<div class="border-country">${localStorage.getItem(border)}</div>`)
                    .join(' ')
                : 'None'}
            </div>
        </div>
    `;
    countryDetailsContainer.classList.add('country-details-visible');
    const borderCountries = document.querySelectorAll('.border-country');
    borderCountries.forEach(border => {
        border.addEventListener('click', () => {
            const borderCountryName = border.textContent;
            window.location.href = `country.html?name=${borderCountryName}`;
        });
    })
}

const params = new URLSearchParams(window.location.search);
const countryName = params.get('name');

async function fetchCountryDetails(name) {
    // Replace with your actual API endpoint or local data logic
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    const data = await response.json();
    if (data && data.length > 0) {
        displayCountryDetails(data[0]);
    }
}

if (countryName) {
    fetchCountryDetails(countryName);
}

const backbutton = document.querySelector('.back-button');
if (backbutton) {
    backbutton.addEventListener('click', () => {
        window.history.back();
    });
}

const title = document.querySelector('.title');
if (title) {
    title.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
