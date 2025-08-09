import {fetchAllInfo} from './URLs.js';
const DEFAULT_REGION = 'All Regions';
const inputField = document.querySelector('#search');
inputField.addEventListener('focus', () => {
    inputField.classList.add('input-focused');
});
const themeToggleButton = document.querySelector('.theme-toggle');
const body = document.body;
// Apply dark mode on page load based on localStorage
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

let countries = [];
let countryDetails = {};
async function fetchCountries() {
    const response = await fetch(fetchAllInfo);
    countries = await response.json();
}

function createCountryCard(country) {
    const countryCard = document.createElement('div');
    countryCard.classList.add('country-card');
    countryCard.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common} flag" class="country-flag">
        <div class="country-info">
            <h2 class="country-name">${country.name.common}</h2>
            <p class="country-population"><strong>Population</strong>: ${country.population.toLocaleString()}</p>
            <p class="country-capital"><strong>Capital</strong>: ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p class="country-region"><strong>Region</strong>: ${country.region}</p>
        </div>
    `;
    document.querySelector('.countries-container').appendChild(countryCard);
    countryCard.addEventListener('click', () => {
        // take to a new page with country details
        const countryDetailsUrl = `https://restcountries.com/v3.1/name/${country.name.common}?fullText=true`;
        console.log('Fetching details for:', countryDetailsUrl);
        fetch(countryDetailsUrl)
            .then(response => response.json())
            .then(data => {
                countryDetails = {...data[0]};
                localStorage.setItem('countryDetails', JSON.stringify(countryDetails));
                window.location.href = `country.html?name=${country.name.common}`;
            })
            .catch(error => console.error('Error fetching country details:', error));
    });
}

const searchInput = document.querySelector('#search');
const regionFilter = document.querySelector('.region-filter');

function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        const countryName = card.querySelector('.country-name').textContent.toLowerCase();
        const countryRegion = card.querySelector('.country-region').textContent.toLowerCase();
        const matchesSearch = countryName.includes(searchTerm);
        const matchesRegion = selectedRegion === DEFAULT_REGION || countryRegion.includes(selectedRegion.toLowerCase());
        if (matchesSearch && matchesRegion) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

searchInput.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);

fetchCountries().then(() => {
    const myset = new Set();
    countries.forEach((country)=>{
        myset.add(country.region);
        localStorage.setItem(country.cca3, country.name.common);
        createCountryCard(country);
    })
    const regionFilter = document.querySelector('.region-filter');
    myset.forEach((region)=>{
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });
});