import React from "react";

const CardGrid = ({ cards }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 p-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">
            {card.title}
          </h3>
          <p className="text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
