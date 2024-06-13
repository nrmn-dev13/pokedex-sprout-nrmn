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
  const formatString = (str) => {
    return str.replace(/[-_]/g, " ");
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
      {isLoading && (
        <div className="loader-wrapper">
          <span className="loader"></span>
        </div>
      )}
      <div
        className={`h-screen main-card ${
          pokemons.types?.length > 0 ? `${pokemons.types[0].type.name}` : null
        }`}
      >
        <div className="main-card__header p-[15px]">
          <Link href="/pokemon" className="back--arrow">
            <IoMdArrowRoundBack size={32} />
          </Link>
          <div className="main-card__title flex justify-between items-center mt-[8px]">
            <div className="wrapper">
              <h4 className="name capitalize text-slate-400 font-bold">
                {pokemons.name}
              </h4>
              <div className="badge-wrapper">
                {pokemons.types?.map((type, index) => {
                  return (
                    <div className="badge" key={index}>
                      {type.type.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-slate-400 font-bold">#0{pokemons.id}</div>
          </div>

          <div className="flex items-center justify-center">
            <figure className="image-wrapper flex justify-center items-center w-[300px] h-[280px]">
              <img
                src={pokemons.sprites?.other?.dream_world.front_default}
                alt={pokemons.name}
              />
            </figure>
          </div>
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
              <div className="content">
                <div className="field flex items-center">
                  <div className="label  max-w-[30%] w-full">Species:</div>
                  <span className="font-bold capitalize">{species?.name}</span>
                </div>
                <div className="field flex items-center">
                  <div className="label max-w-[30%] w-full">Height:</div>
                  <span className="font-bold capitalize">{height}</span>
                </div>
                <div className="field flex items-center">
                  <div className="label max-w-[30%] w-full">Weight:</div>
                  <span className="font-bold capitalize">{weight}</span>
                </div>
                <div className="field flex items-start">
                  <div className="label max-w-[30%] w-full">Abilities:</div>
                  <div className="wrapper flex flex-wrap gap-2">
                    {abilities
                      ? abilities.map((ability, index) => {
                          return (
                            <span className="font-bold capitalize" key={index}>
                              {formatString(ability.ability.name)}
                            </span>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="Base Stats"
            />
            <div role="tabpanel" className="tab-content p-3">
              <div className="content">
                {pokemons.stats
                  ? pokemons.stats.map((stat, index) => {
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between">
                            <div className="wrapper flex items-center justify-between capitalize max-w-[30%] w-full">
                              <span className="label">
                                {/* {formatString(stat.stat?.name)} */}
                                {stat.stat?.name === "special-attack"
                                  ? "Sp. Atk"
                                  : stat.stat?.name === "special-defense"
                                  ? "Sp. Def"
                                  : stat.stat?.name}
                              </span>
                              <span className="power font-bold">
                                {stat.base_stat}
                              </span>
                            </div>
                            <progress
                              className="progress progress-primary max-w-[60%] w-full"
                              value={stat.base_stat}
                              max="100"
                            ></progress>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="Evolution"
            />
            <div role="tabpanel" className="tab-content p-3">
              <div className="content">
                {evolution ? (
                  <div>
                    {evolution.map((evolution, index) => (
                      <div className="label capitalize font-bold" key={index}>
                        {index + 1} - {evolution}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              className="tab"
              aria-label="Moves"
            />
            <div role="tabpanel" className="tab-content p-3">
              <div className="content">
                <ul>
                  {pokemons.moves
                    ? pokemons.moves.map((move, index) => {
                        return (
                          <li className="capitalize font-bold" key={index}>
                            {formatString(move.move.name)}
                          </li>
                        );
                      })
                    : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
