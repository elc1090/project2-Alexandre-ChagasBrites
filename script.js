const pokedex = document.getElementById('pokedex');
const ol = document.getElementById('pokemonSpecies');

const entry = document.getElementById('entry');
const entryIcon = document.getElementById('entryIcon');
const entryId = document.getElementById('entryId');
const entryName = document.getElementById('entryName');
const entryCategory = document.getElementById('entryCategory');
const entryHeight = document.getElementById('entryHeight');
const entryWeight = document.getElementById('entryWeight');
const entryText = document.getElementById('entryText');
const entryMarker = document.getElementById('entryMarker');

const blank = document.getElementById('blank');

window.addEventListener("popstate", (event) => {
    loadEntry(event.state);
});

loadPokedex('kanto');
loadEntry(history.state);

async function loadPokedex(i) {
    let pokedex = await (await requestPokedex(i)).json();
    for (let pokemon of pokedex.pokemon_entries) {
        addEntry(pokemon);
    }
}

function addEntry(pokemon) {
    let id = String(pokemon.entry_number).padStart(3, '0');
    let name = pokemon.pokemon_species.name.toUpperCase();

    let li = document.createElement('li');
    li.classList.add('scroll-snap');
    li.innerHTML = (`
        <button type="button">
            <p class="id">${id}</p>
            <p><span class="arrow">▶</span>${name}</p>
        </button>
    `);

    let bt = li.querySelector('button');

    bt.addEventListener('focus', (e) => {
        let arrow = e.target.querySelector('.arrow');
        arrow.textContent = '▷';
    });

    bt.addEventListener('blur', (e) => {
        let arrow = e.target.querySelector('.arrow');
        arrow.textContent = '▶';
    });

    bt.addEventListener('click', (e) => {
        loadEntry(pokemon.entry_number);
        history.pushState(pokemon.entry_number, '', `?entry=${pokemon.entry_number}`);
    });

    ol.appendChild(li);
}

async function loadEntry(i) {
    pokedex.style.display = 'none';
    entry.style.display = 'none';
    blank.style.display = 'block';

    if (i != null) {
        let pokemon = await (await requestPokemon(i)).json();
        let specie = await (await requestSpecie(i)).json();

        entryIcon.src = getSprite(pokemon);
        entryId.textContent = '№.' + String(i).padStart(3, '0');
        entryName.textContent = specie.name.toUpperCase();
        entryCategory.textContent = getCategory(specie);
        entryHeight.textContent = String((pokemon.height / 10).toFixed(1)) + 'm';
        entryWeight.textContent = String((pokemon.weight / 10).toFixed(1)) + 'kg';

        let currentPage = 0;
        let textPages = getTextPages(specie);
        nextPage();

        function nextPage() {
            entryText.textContent = textPages[currentPage++];
            entryMarker.style.color = currentPage == textPages.length ? 'transparent' : '#181818';
        }

        entryText.addEventListener('click', (e) => {
            if (currentPage < textPages.length) {
                nextPage();
            }
        });
    }
    
    pokedex.style.display = i == null ? 'flex' : 'none';
    entry.style.display = i == null ? 'none' : 'block';
    blank.style.display = 'none';
}

function requestPokedex(i) {
    return fetch(`https://pokeapi.co/api/v2/pokedex/${i}/`);
}

function requestSpecie(i) {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}/`);
}

function requestPokemon(i) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
}

function getSprite(pokemon) {
    return pokemon.sprites.versions['generation-i']['yellow'].front_transparent;
}

function getCategory(specie) {
    for (let genus of specie.genera) {
        if (genus.language.name === 'en') {
            let category = genus.genus;
            category = category.replace('Pokémon', '');
            category = category.replaceAll(' ', '');
            return category.toUpperCase();
        }
    }
    return '';
}

function getTextPages(specie) {
    for (let flavor_text of specie.flavor_text_entries) {
        if (flavor_text.language.name === 'en' && flavor_text.version.name === 'yellow') {
            let text = flavor_text.flavor_text.replaceAll('\n', '\n\n');
            let pages = text.split('\f');
            return pages;
        }
    }
    return [];
}
