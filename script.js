requestGeneration(1)
    .then(response => response.json())
    .then(data => {
        let pokemons = data.pokemon_species.sort(function(a, b){
            return getId(a) - getId(b);
        });

        let ul = document.getElementById('pokemonSpecies');
        for (let i in pokemons) {
            let pokemon = data.pokemon_species[i];

            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = (`
                <p><strong>Name:</strong> ${pokemon.name}</p>
                <p><strong>URL:</strong> <a href="${pokemon.url}">${pokemon.url}</a></p>
            `);

            ul.appendChild(li);
        }
    });

function requestGeneration(i) {
    return Promise.resolve(fetch(`https://pokeapi.co/api/v2/generation/${i}`));
}

function getId(a) {
    let url = a.url.substring(0, a.url.length - 1);
    return url.substring(url.lastIndexOf('/') + 1);
}