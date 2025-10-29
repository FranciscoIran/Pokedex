// 'Service' = camada que faz requisições externas
// Responsável por buscar dados da PokéAPI
const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

export class PokeAPIService {
  static async getPokemonList(limit = 150, offset = 0) {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
  }

  static async getPokemonByName(name) {
    const response = await fetch(`${BASE_URL}${name.toLowerCase()}`);
    if (!response.ok) throw new Error("Pokémon não encontrado!");
    const data = await response.json();
    return data;
  }
}
