fillPokedex();

async function fillPokedex() {
    let response = await requestGeneration(1);
    let data = await response.json();

    let pokemons = data.pokemon_species.sort(function(a, b){
        return getId(a) - getId(b);
    });

    let ol = document.getElementById('pokemonSpecies');
    for (let pokemon of pokemons) {
        let id = String(getId(pokemon)).padStart(3, '0');
        let name = pokemon.name.slice(0, 1).toUpperCase() + pokemon.name.slice(1);

        let li = document.createElement('li');
        li.tabIndex = getId(pokemon);
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

        ol.appendChild(li);
    }
}

function requestGeneration(i) {
    return fetch(`https://pokeapi.co/api/v2/generation/${i}`);
}

function getId(a) {
    let url = a.url.slice(0, a.url.length - 1);
    url = url.slice(url.lastIndexOf('/') + 1);
    return parseInt(url);
}