import React from "react";
import Link from "next/link";

const PokemonCard = ({ id, image, name, type, _callback }) => {
  const style = type + " thumb-container";
  return (
    <div className={style}>
      <div className="number">
        <small>#0{id}</small>
      </div>
      <img src={image} alt={name} />
      <div className="detail-wrapper">
        <h3 className="capitalize">{name}</h3>
        <div className="badge">Type: {type}</div>
      </div>
    </div>
  );
};

export default PokemonCard;
