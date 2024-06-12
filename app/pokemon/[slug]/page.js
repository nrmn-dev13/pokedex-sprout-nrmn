"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function PokemonDetailPage({ params }) {
  const baseUrl = `https://pokeapi.co/api/v2/`;
  const [pokemons, setPokemons] = useState([]);
  const [evolution, setEvolution] = useState([]);
  // console.log(evolution);
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
  };

  const handleGetEvolutions = async (url) => {
    const resEvolution = await fetch(`${url}`);
    const dataEvolution = await resEvolution.json();

    setEvolution(getSpeciesNames(dataEvolution.chain));
  };
  const getPokemon = async () => {
    const res = await fetch(`${baseUrl}pokemon/${params.slug}`);
    const data = await res.json();
    setPokemons(data);

    const speciesRes = await fetch(`${baseUrl}pokemon-species/${params.slug}`);
    const speciesData = await speciesRes.json();
    console.log(speciesData.evolution_chain.url);
    handleGetEvolutions(speciesData.evolution_chain.url);
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
    <div>
      {pokemons.name}
      <img src={pokemons.sprites?.other?.dream_world.front_default} alt={pokemons.name} />
      <div>#0{pokemons.id}</div>
      {pokemons.types?.map((type, index) => {
        return <div key={index}>{type.type.name}</div>;
      })}

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
          {height} - {weight} - {species?.name}{" "}
          {abilities
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
          {evolution ? (
            <div>
              {evolution.map((evolution, index) => (
                <div key={index}>{evolution}</div>
              ))}
            </div>
          ) : null}
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
    </div>
  );
}
