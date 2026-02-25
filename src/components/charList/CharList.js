import { useState, useEffect, useRef, createRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./charList.scss";

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(1);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (itemRef) => {
    itemRef.current.classList.add("char__item_selected");
    itemRef.current.focus();
  };

  const blurOnItem = (itemRef) => {
    itemRef.current.classList.remove("char__item_selected");
  };

  function renderItems(arr) {
    const items = arr.map((item) => {
      const itemRef = createRef(null);

      return (
        <CSSTransition
          key={item.id}
          in={true}
          timeout={300}
          classNames="char__item"
          nodeRef={itemRef}
        >
          <li
            className="char__item"
            key={item.id}
            tabIndex={0}
            ref={itemRef}
            onClick={() => {
              onCharSelected(item.id);
              focusOnItem(itemRef);
            }}
            onBlur={() => blurOnItem(itemRef)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                onCharSelected(item.id);
                focusOnItem(itemRef);
              }
            }}
          >
            <img src={item.thumbnail} alt={item.name} />
            <div className="char__name">{item.name}</div>
          </li>
        </CSSTransition>
      );
    });
    return (
      <ul>
        <TransitionGroup className="char__grid">{items}</TransitionGroup>
      </ul>
    );
  }

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      {renderItems(charList)}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
