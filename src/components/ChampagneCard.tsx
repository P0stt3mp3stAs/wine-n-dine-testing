import React from "react";

type ChampagneProps = {
    name: string;
    description: string;
    price: string;
  };
  
  const ChampagneCard = ({ name, description, price }: ChampagneProps) => {
    return (
      <div className="border rounded-md p-4 shadow-md my-2 bg-yellow-400">
        <h1 className="text-xl font-bold text-red-500">{name}</h1>
        <p className="text-gray-600">{description}</p>
        <h2 className="text-lg font-semibold text-green-700">${price}</h2>
      </div>
    );
  };
  
  export default ChampagneCard;