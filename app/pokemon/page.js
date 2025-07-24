"use client";
import PokemonCard from "@/components/PokemonCard";
import { useEffect, useState } from "react";
import Link from "next/link";

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
      <div className="flex justify-center items-center mb-[20px]">
        <figure className="image-wrapper max-w-[50%]">
          <img src="/logo-1.png" alt="" />
        </figure>
      </div>
      {isLoading && <div className="loader-wrapper"><span className="loader"></span></div>}
      <div className="pokemon-container">
        <div className="all-container">
          {allPokemons.map((pokemonStats, index) => (
            <Link href={`/pokemon/${pokemonStats.name}`} key={index}>
              <PokemonCard
                id={pokemonStats.id}
                image={pokemonStats.sprites.other.dream_world.front_default}
                name={pokemonStats.name}
                type={pokemonStats.types[0].type.name}
              />
            </Link>
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
