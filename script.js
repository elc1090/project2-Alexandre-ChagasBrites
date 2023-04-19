requestGeneration(1)
    .then(response => response.json())
    .then(data => {
        let pokemons = data.pokemon_species.sort(function(a, b){
            return getId(a) - getId(b);
        });

        let ol = document.getElementById('pokemonSpecies');
        for (let i in pokemons) {
            let pokemon = data.pokemon_species[i];

            let id = String(getId(pokemon)).padStart(3, '0');
            let name = pokemon.name.slice(0, 1).toUpperCase() + pokemon.name.slice(1);

            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = (`
                <p class="id">${id}</p>
                <p class="name">${name}</p>
            `);

            ol.appendChild(li);
        }
    });

function requestGeneration(i) {
    return Promise.resolve(fetch(`https://pokeapi.co/api/v2/generation/${i}`));
}

function getId(a) {
    let url = a.url.substring(0, a.url.length - 1);
    url = url.substring(url.lastIndexOf('/') + 1);
    return parseInt(url);
}