import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Popup from "./Popup";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

function PokeDex({ currentPokemons, handleClick }) {
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

async function getData(func, offset, limit, pokemonData) {
  fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset
  )
    .then((response) => response.json())
    .then(async (data) => {
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

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      if (newOffset + 27 > items.length) {
        let amount = 9;
        if (newOffset + 9 === items.length) {
          console.log("Woho");
          amount = 18;
        }
        getData(setPokemonData, items.length, amount, items);
      }
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
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
        <span>#{isOpen}</span>
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
    getData(setPokemonData, 0, 18, pokemonData);
  }, []);

  return (
    <>
      <PaginatedItems
        itemsPerPage={9}
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
