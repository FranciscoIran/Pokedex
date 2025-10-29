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

  // Inicializa a aplicação
  static async init() {
    const listContainer = document.querySelector("#pokemon-list");
    const searchInput = document.querySelector("#search");

    // Carrega lista inicial
    await this.loadPokemons(listContainer);

    // Busca Pokémon pelo nome
    searchInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const query = e.target.value.trim();
        if (!query) return this.loadPokemons(listContainer);
        this.searchPokemon(query, listContainer);
      }
    });
  }

  // Busca a lista de pokémons na API
  static async loadPokemons(container) {
    container.innerHTML = "<p>Carregando...</p>";
    const list = await PokeAPIService.getPokemonList(150, 0); // você pode aumentar aqui o número de pokémons
    const pokemons = [];

    for (let item of list) {
      const data = await PokeAPIService.getPokemonByName(item.name);
      pokemons.push(new Pokemon(
        data.name,
        data.sprites.front_default,
        data.types.map(t => t.type.name),
        data.stats
      ));
    }

    this.renderList(pokemons, container);
  }

  // Busca um Pokémon específico pelo nome
  static async searchPokemon(name, container) {
    container.innerHTML = "<p>Buscando...</p>";
    try {
      const data = await PokeAPIService.getPokemonByName(name);
      const pokemon = new Pokemon(
        data.name,
        data.sprites.front_default,
        data.types.map(t => t.type.name),
        data.stats
      );
      this.renderList([pokemon], container);
    } catch {
      container.innerHTML = "<p>Pokémon não encontrado!</p>";
    }
  }

  // Renderiza os cards na tela
  static renderList(pokemons, container) {
    container.innerHTML = pokemons.map(p => {
      const mainType = p.types[0];
      const bgColor = typeColors[mainType] || "#fff";

      // Aqui adicionamos um data-name para identificar o Pokémon ao clicar
      return `
        <div class="pokemon-card" style="background:${bgColor}" data-name="${p.name}">
          <img class="pokemon-img" src="${p.image}" alt="${p.name}">
          <p class="pokemon-name">${p.name}</p>
          <p class="pokemon-types">${p.types.join(", ")}</p>
        </div>
      `;
    }).join("");

    // Após renderizar, adiciona evento de clique para mostrar detalhes
    const cards = container.querySelectorAll(".pokemon-card");
    cards.forEach(card => {
      card.addEventListener("click", async (e) => {
        const name = card.dataset.name;
        this.showDetails(name);
      });
    });
  }

  // Exibe os detalhes (stats) do Pokémon clicado
  static async showDetails(name) {
    const modal = document.createElement("div");
    modal.classList.add("pokemon-modal");
    modal.innerHTML = `<p>Carregando detalhes...</p>`;
    document.body.appendChild(modal);

    const data = await PokeAPIService.getPokemonByName(name);

    const statsHTML = data.stats.map(s => `
      <li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>
    `).join("");

    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">×</button>
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <ul>${statsHTML}</ul>
      </div>
    `;

    // Fecha o modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });
  }
}
