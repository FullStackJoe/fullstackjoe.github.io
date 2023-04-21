import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Popup from "./Popup";

// Returns a given string with first letter capitalized
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Card Widget - Mark up and information regarding the pokemens in the pokedex
function Card(id, name, img, typeOne, typeTwo, handleClick) {
  return (
    <div id="pokeCard" onClick={() => handleClick(id)}>
      <div id="pokeInfo">
        <div id="pokeID">
          <p>#{id}</p>
        </div>
        <div id="pokeName">
          <h3>{capitalizeFirstLetter(name)}</h3>
        </div>{" "}
        <div id="types">
          Types: <div id={typeOne}></div>
          <div id={typeTwo}></div>
        </div>
      </div>

      <div id="pokeIMG">
        <img src={img} alt="Pokemon"></img>
      </div>
    </div>
  );
}

// Pokedex Widget with all the cards
function PokeDex({ currentPokemons, handleClick }) {
  // Checks if any pokemons is loaded
  if (!(currentPokemons === null)) {
    const listItems = currentPokemons.map((pokemon, i) => {
      let typeOne = "";
      let typeTwo = "";
      if (pokemon.data.types.length > 1) {
        typeOne = pokemon.data.types[0].type.name;
        typeTwo = pokemon.data.types[1].type.name;
      } else {
        typeOne = pokemon.data.types[0].type.name;
      }
      return (
        <div key={i}>
          {Card(
            pokemon.data.id,
            pokemon.name,
            pokemon.data.sprites.front_shiny,
            typeOne,
            typeTwo,
            handleClick
          )}
        </div>
      );
    });

    return <div id="pokeRow">{listItems}</div>;
  }
}

// Function to load data from the API
async function getData(func, offset, limit, pokemonData) {
  fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset
  )
    .then((response) => response.json())
    .then(async (data) => {
      // Read the data about reach pokemon into an array
      const pokemons = data.results;
      for (const pokemon of pokemons) {
        pokemon.data = await fetch(pokemon.url).then((res) => res.json());
      }
      if (pokemonData) {
        let array = [...pokemonData, ...pokemons];
        func(array);
      } else {
        func(pokemons);
      }
    });
}

// Controlling the pagination
function PaginatedItems({
  itemsPerPage,
  items,
  itemOffset,
  setItemOffset,
  setPokemonData,
  handleClick,
}) {
  if (!(items === null)) {
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    // Handling loading of new pokemons when going through the pages
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      // When fewer than the next 36 pokemons are loaded, 12 more pokemons are loaded (1 page).
      if (newOffset + 36 > items.length) {
        let amount = 12;
        // When fewer than the next 12 pokemons are loaded, 24 more pokemons are loaded (2 pages).
        if (newOffset + 12 === items.length) {
          amount = 24;
        }
        getData(setPokemonData, items.length, amount, items);
      }
      setItemOffset(newOffset);
    };

    return (
      <>
        <PokeDex currentPokemons={currentItems} handleClick={handleClick} />
        <ReactPaginate
          previousLabel="< Previus"
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={4}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          activeClassName={"item actively "}
          containerClassName={"pagination"}
          disabledClassName={"disabled-page"}
          marginPagesDisplayed={1}
          nextClassName={"item next "}
          pageClassName={"item pagination-page "}
          previousClassName={"item previous"}
          pageLinkClassName={"pageLink"}
        />
      </>
    );
  }
}

// Pop-up widget with markup and insertion of data into the pop-up.
function activatePopUp(pokemonData, isOpen) {
  let index = isOpen - 1;
  let name = capitalizeFirstLetter(pokemonData[index].name);
  let height = pokemonData[index].data.height;
  let weight = pokemonData[index].data.weight;
  let baseExperience = pokemonData[index].data.base_experience;
  let img = pokemonData[index].data.sprites.front_shiny;
  let types = pokemonData[index].data.types;

  let typeList = types.map((x, index) => (
    <li>
      <div
        title={capitalizeFirstLetter(x.type.name)}
        id={x.type.name}
        className="typeInfo"
      ></div>
      <span id="infoTypeName">{capitalizeFirstLetter(x.type.name)}</span>
    </li>
  ));

  return (
    <div id="popUpContent">
      <div id="pokeInfoBox">
        <div id="infoId">#{isOpen}</div>
        <h1>{name}</h1>
        <p className="pokeText">
          <b>Height:</b> {height} decimeters
        </p>
        <p className="pokeText">
          <b>Weight:</b> {weight} hectograms
        </p>
        <p className="pokeText">
          <b>Base experience:</b> {baseExperience} xp
        </p>
        <p className="pokeText">
          <b>Types: </b>
        </p>
        <ul>{typeList}</ul>
      </div>
      <div id="pokePicture">
        <img src={img} alt={name} id="infoPicture"></img>
      </div>
    </div>
  );
}

export default function Pokedex() {
  const [pokemonData, setPokemonData] = useState(null);
  const [itemOffset, setItemOffset] = useState(0);
  const [isOpen, setIsOpen] = useState();

  function togglePopup(id) {
    if (isOpen == true) {
      setIsOpen(false);
    } else {
      setIsOpen(id);
    }
  }

  useEffect(() => {
    getData(setPokemonData, 0, 24, pokemonData);
  }, []);

  return (
    <>
      <PaginatedItems
        itemsPerPage={12}
        items={pokemonData}
        itemOffset={itemOffset}
        setItemOffset={setItemOffset}
        setPokemonData={setPokemonData}
        handleClick={togglePopup}
      />
      {isOpen && (
        <Popup
          handleClose={() => togglePopup(null)}
          content={activatePopUp(pokemonData, isOpen)}
          handleNext={() =>
            setIsOpen(isOpen + 1 <= pokemonData.length && isOpen + 1)
          }
          handleBack={() => setIsOpen(isOpen - 1 >= 0 && isOpen - 1)}
        />
      )}
    </>
  );
}
