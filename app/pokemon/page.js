"use client";
import PokemonThumb from "@/components/PokemonThumb";
import { useEffect, useState } from "react";

export default function PokemonPage() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=20"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const getAllPokemons  = async () => { 
    setIsLoading(true);
    const res = await fetch(loadMore);
    const data = await res.json();
    setLoadMore(data.next);
    const allPokemonData = [];

    for (const pokemon of data.results) {
      const pokemonRes = await fetch(pokemon.url);
      const pokemonData = await pokemonRes.json();
      allPokemonData.push(pokemonData);
    }
    setAllPokemons([...allPokemons, ...allPokemonData]);
    setIsLoading(false);
    setInitialLoad(false);
  }

  useEffect(() => {
    getAllPokemons();
  }, []);


  return (
    <div className="app-contaner">
      <h1>Pokemon Evolution</h1>
      {isLoading && <div className="loader-wrapper"><span className="loader"></span></div>}
      <div className="pokemon-container">
        <div className="all-container">
          {allPokemons.map((pokemonStats, index) => (
            <PokemonThumb
              key={index}
              id={pokemonStats.id}
              image={pokemonStats.sprites.other.dream_world.front_default}
              name={pokemonStats.name}
              type={pokemonStats.types[0].type.name}
            />
            // <li key={index}>{pokemonStats.name}</li>
          ))}
        </div>
        {!initialLoad && (
          <button
            className="load-more"
            onClick={() => {
              getAllPokemons();
            }}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}
