import { PokeAPIService } from "../service/PokeAPIService.js";
import { Pokemon } from "../model/PokemonModel.js";

const typeColors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#E6DAF0',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};

export class PokemonController {

  static async init() {
    const listContainer = document.querySelector("#pokemon-list");
    const searchInput = document.querySelector("#search");

    await this.loadPokemons(listContainer);

    searchInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const query = e.target.value.trim();
        if (!query) return this.loadPokemons(listContainer);
        this.searchPokemon(query, listContainer);
      }
    });
  }

  static async loadPokemons(container) {
    container.innerHTML = "<p>Carregando...</p>";
    const list = await PokeAPIService.getPokemonList();
    const pokemons = [];

    for (let item of list) {
      const data = await PokeAPIService.getPokemonByName(item.name);
      pokemons.push(new Pokemon(
        data.name,
        data.sprites.front_default,
        data.types.map(t => t.type.name),

      ));
    }

    this.renderList(pokemons, container);
  }

  static async searchPokemon(name, container) {
    container.innerHTML = "<p>Buscando...</p>";
    try {
      const data = await PokeAPIService.getPokemonByName(name);
      const pokemon = new Pokemon(
        data.name,
        data.sprites.front_default,
        data.types.map(t => t.type.name),
      );
      this.renderList([pokemon], container);
    } catch {
      container.innerHTML = "<p>Pokémon não encontrado!</p>";
    }
  }

  static renderList(pokemons, container) {
    container.innerHTML = pokemons.map(p => {
      const mainType = p.types[0];
      const bgColor = typeColors[mainType] || "#fff";

      return `
        <div class="pokemon-card" style="background:${bgColor}">
          <img class="pokemon-img" src="${p.image}" alt="${p.name}">
          <p class="pokemon-name">${p.name}</p>
          <p class="pokemon-types">${p.types.join(", ")}</p>
        </div>
      `;
    }).join("");
  }

}
