fillPokedex();

window.addEventListener("popstate", (event) => {
    loadEntry(event.state);
});

async function fillPokedex() {
    let response = await requestGeneration(1);
    let data = await response.json();

    let pokemons = data.pokemon_species.sort(function(a, b){
        return getId(a) - getId(b);
    });

    let ol = document.getElementById('pokemonSpecies');
    for (let pokemon of pokemons) {
        let pokemonId = getId(pokemon);
        let id = String(pokemonId).padStart(3, '0');
        let name = pokemon.name.toUpperCase();

        let li = document.createElement('li');
        li.tabIndex = pokemonId;
        li.innerHTML = (`
            <p class="id">${id}</p>
            <p><span class="arrow">▶</span>${name}</p>
        `);

        li.addEventListener('focus', (e) => {
            let arrow = e.target.querySelector('.arrow');
            arrow.textContent = '▷';
        });

        li.addEventListener('blur', (e) => {
            let arrow = e.target.querySelector('.arrow');
            arrow.textContent = '▶';
        });

        li.addEventListener('click', (e) => {
            loadEntry(pokemonId);
            history.pushState(pokemonId, '', `?entry=${pokemonId}`);
        });

        ol.appendChild(li);
    }

    loadEntry(history.state);
}

function requestGeneration(i) {
    return fetch(`https://pokeapi.co/api/v2/generation/${i}/`);
}

function getId(a) {
    let url = a.url.slice(0, a.url.length - 1);
    url = url.slice(url.lastIndexOf('/') + 1);
    return parseInt(url);
}

async function loadEntry(i) {
    if (i != null) {
        let pokemon = await (await requestPokemon(i)).json();
        let specie = await (await requestSpecie(i)).json();

        let entryIcon = document.getElementById('entryIcon');
        let entryName = document.getElementById('entryName');
        let entryCategory = document.getElementById('entryCategory');
        let entryHeight = document.getElementById('entryHeight');
        let entryWeight = document.getElementById('entryWeight');
        let entryText = document.getElementById('entryText');

        entryIcon.src = pokemon.sprites.versions['generation-i']['yellow'].front_transparent;
        entryName.textContent = specie.name.toUpperCase();
        entryCategory.textContent = getCategory(specie);
        entryHeight.textContent = String(pokemon.height / 10) + 'm';
        entryWeight.textContent = String(pokemon.weight / 10) + 'kg';
        entryText.textContent = getText(specie);
    }
    
    let pokedex = document.getElementById('pokedex');
    let entry = document.getElementById('entry');
    
    pokedex.style.display = i == null ? 'block' : 'none';
    entry.style.display = i == null ? 'none' : 'block';
}

function requestSpecie(i) {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}/`);
}

function requestPokemon(i) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
}

function getCategory(a) {
    for (let genera of a.genera) {
        if (genera.language.name === 'en') {
            let category = genera.genus;
            category = category.replace('Pokémon', '');
            category = category.replaceAll(' ', '');
            return category.toUpperCase();
        }
    }
    return '';
}

function getText(a) {
    let text = a.flavor_text_entries[2].flavor_text;
    text = text.slice(0, text.indexOf('\f'));
    text = text.replaceAll('\n', '\n\n');
    return text;
}
