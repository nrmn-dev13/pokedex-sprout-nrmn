"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
export default function PokemonDetailPage({ params }) {
  const baseUrl = `https://pokeapi.co/api/v2/`;
  const [pokemons, setPokemons] = useState([]);
  const [evolution, setEvolution] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { height, weight, species, abilities, types } = pokemons;
  console.log(types);
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
    setIsLoading(true);
    const res = await fetch(`${baseUrl}pokemon/${params.slug}`);
    const data = await res.json();
    setPokemons(data);

    const speciesRes = await fetch(`${baseUrl}pokemon-species/${params.slug}`);
    const speciesData = await speciesRes.json();
    console.log(speciesData.evolution_chain.url);
    handleGetEvolutions(speciesData.evolution_chain.url);
    setIsLoading(false);
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
      {isLoading && <div className="loader-wrapper"><span className="loader"></span></div>}
      <div
        className={`h-screen main-card ${
          pokemons.types?.length > 0 ? `${pokemons.types[0].type.name}` : null
        }`}
      >
        <div className="main-card__header">
          <Link href="/pokemon">
            <IoMdArrowRoundBack />
          </Link>
          {pokemons.name}
          <img
            src={pokemons.sprites?.other?.dream_world.front_default}
            alt={pokemons.name}
          />
          <div>#0{pokemons.id}</div>
          {pokemons.types?.map((type, index) => {
            return (
              <div className="test" key={index}>
                {type.type.name}
              </div>
            );
          })}
        </div>
        <div className="main-card__body">
          <div
            role="tablist"
            className="tabs justify-center bg-white rounded-t-2xl tabs-bordered"
          >
            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="About"
              defaultChecked
            />
            <div role="tabpanel" className="tab-content p-3">
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
            <div role="tabpanel" className="tab-content p-3">
              {pokemons.stats
                ? pokemons.stats.map((stat, index) => {
                    return (
                      <div key={index}>
                        {stat.stat?.name} - {stat.base_stat}
                        <progress className="progress w-56" value={stat.base_stat} max="100"></progress>
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
            <div role="tabpanel" className="tab-content p-3">
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
            <div role="tabpanel" className="tab-content p-3">
              {pokemons.moves
                ? pokemons.moves.map((move, index) => {
                    return <div key={index}>{move.move.name}</div>;
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
