"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function PokemonDetailPage({ params }) {
  const baseUrl = `https://pokeapi.co/api/v2/`;
  const [pokemons, setPokemons] = useState([]);
  const [evolution, setEvolution] = useState([]);
  console.log(evolution);
  const { height, weight, species, abilities } = pokemons;
  const getSpeciesNames = (chain) => {
    let speciesNames = [];

    function recurse(evolutionChain) {
      // Add the species name to the array
      speciesNames.push(evolutionChain.species.name);

      // Recursively call this function for each evolves_to child
      for (let evolve of evolutionChain.evolves_to) {
        recurse(evolve);
      }
    }

    // Start the recursion with the top level chain
    recurse(chain);
    return speciesNames;
  }
  const evolutionId = (n) => {
    return Math.ceil(n / 3);
  };

  const getPokemonEvolutionGroup = (evolutionNumber, hasThreeEvolutions) => {
    if (hasThreeEvolutions) {
        return Math.floor((evolutionNumber - 1) / 3) + 1;
    } else {
        return evolutionNumber + 1;
    }
}
  const getPokemon = async () => {
    const res = await fetch(`${baseUrl}pokemon/${params.slug}`);
    const data = await res.json();
    //console.log(data.moves);
    // const rawData = []
    // rawData.push(data);
    setPokemons(data);
    
    const resEvolution = await fetch(
      `${baseUrl}evolution-chain/${evolutionId(data.id)}`
    );
    const dataEvolution = await resEvolution.json();
    
    setEvolution(getSpeciesNames(dataEvolution.chain));
    console.log(dataEvolution);
    function countSpecies(evolutionChain) {
      // Base case: if no evolution chain exists, return 0
      if (!evolutionChain) return 0;
      
      // Start with 1 for the current species
      let count = 1;
  
      // Recursively count the species in each evolves_to chain
      if (evolutionChain.evolves_to) {
          for (let evolution of evolutionChain.evolves_to) {
              count += countSpecies(evolution);
          }
      }
  
      return count;
  }
  
  const totalSpecies = countSpecies(dataEvolution.chain);
  console.log(totalSpecies); 
    // console.log(dataEvolution.chain.evolves_to[0].evolves_to[0].species.name);
  };

  // TODO
  // about : species, height, weight, abilities, breading: gender, egg groups, egg cycles,
  // base stats : hp, attack, defens, special attack, special defense, speed
  // evolution : evolution chain, evolution trigger
  // moves: move name

  useEffect(() => {
    getPokemon();
    // console.log(pokemons);
  }, []);

  return (
    <>
      <div>{params.slug}</div>
      {pokemons.name}
      
      {/* {pokemons.abilities.map(ability => {
        return <div>{ability.ability.name}</div>;
      })} */}
      <div role="tablist" className="tabs tabs-bordered">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="About"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content p-10">
          {height} - {weight} - {species?.name} {abilities
        ? abilities.map((ability, index) => {
            return <div key={index}>{ability.ability.name}</div>;
          })
        : null}
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Base Stats"
        />
        <div role="tabpanel" className="tab-content p-10">
          {pokemons.stats
            ? pokemons.stats.map((stat, index) => {
                return (
                  <div key={index}>
                    {stat.stat?.name} - {stat.base_stat}
                  </div>
                );
              })
            : null}
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Evolution"
        />
        <div role="tabpanel" className="tab-content p-10">
          {evolution ? <div>{evolution.map((evolution, index) => <div key={index}>{evolution}</div>)}</div> : null}
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="Moves"
        />
        <div role="tabpanel" className="tab-content p-10">
          {pokemons.moves
            ? pokemons.moves.map((move, index) => {
                return <div key={index}>{move.move.name}</div>;
              })
            : null}
        </div>
      </div>
      <button>
        <Link href="/pokemon">Back</Link>
      </button>
    </>
  );
}
