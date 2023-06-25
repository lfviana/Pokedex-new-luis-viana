
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(50);
  const [selectedType, setSelectedType] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=600');
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon list');
      }
      const data = await response.json();
      const pokemonData = await Promise.all(data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        return {
          name: pokemon.name,
          photo: data.sprites.front_default,
          types: data.types.map((type) => type.type.name),
        };
      }));
      setPokemonList(pokemonData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Paginação
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = pokemonList.slice(indexOfFirstPokemon, indexOfLastPokemon);

  // Função para mudar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Função para filtrar por tipo de Pokémon
  const filterByType = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  // Função para filtrar por texto
  const filterByText = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  // Filtrar a lista de Pokémon com base no tipo selecionado e texto pesquisado
  const filteredPokemons = currentPokemons.filter((pokemon) => {
    if (selectedType && !pokemon.types.includes(selectedType)) {
      return false;
    }
    if (searchText && !pokemon.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <p>Loading pokémons...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-pokemon font-bold text-white flex items-center mb-10 justify-center">
  POKÉDEX - Lista de Pokémons
  <img src="https://img.freepik.com/icones-gratis/pokebola_318-196468.jpg" className="w-8 h-8 ml-2" alt="Pokebola" />
</h1>

      <div className="flex mb-4 justify-center font-pokemon font-bold text-black">
      <div>
          <label htmlFor="searchInput">Name: </label>
          <input
            id="searchInput"
            type="text"
            value={searchText}
            onChange={(e) => filterByText(e.target.value)}
            className="border border-black-300 rounded px-2 py-1 text-black"
            placeholder='Text a Pokémon name here...'
          />
        </div>
        <div className="ml-4">
          <label htmlFor="typeFilter"> Type: </label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => filterByType(e.target.value)}
            className="border border-black-300 rounded px-2 py-1 "
          >
            <option value="" className='text-black'>All</option>
            <option value="grass" className='text-black'>Grass</option>
            <option value="fire" className='text-black'>Fire</option>
            <option value="water" className='text-black'>Water</option>
            <option value="electric" className='text-black'>Electric</option>
            <option value="normal" className='text-black'>Normal</option>
            <option value="flying" className='text-black'>Flying</option>
            <option value="poison" className='text-black'>Poison</option>
            <option value="bug" className='text-black'>Bug</option>
          </select>
        </div>
      </div>
      <Table data={filteredPokemons} />
      <Pagination
        pokemonsPerPage={pokemonsPerPage}
        totalPokemons={pokemonList.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}

const Table = ({ data }) => {
  return (
      <table className="min-w-full divide-y divide-darkblue-200 justify-center table-rounded">
        <thead>
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Photo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((pokemon) => (
            <tr key={pokemon.name}>
              <td className="py-4 px-6 text-left">{pokemon.name}</td>
              <td className="py-4 px-6 text-left">{pokemon.types.join(', ')}</td>
              <td className="py-4 px-6">
                <img src={pokemon.photo} alt={pokemon.name} className="w-12 h-12" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  );
};

function Pagination({ pokemonsPerPage, totalPokemons, currentPage, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPokemons / pokemonsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination flex justify-center">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button
              className={`page-link hover:bg-black hover:text-white focus:bg-darkblue focus:border-black rounded-full px-3 py-1 mt-5 ${currentPage === number ? 'bg-darkblue text-white' : 'bg-white text-darkblue'}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );  
}

export default App;

