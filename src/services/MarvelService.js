import { useHttp } from "../hooks/http.hook";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  // const _apiBase = "https://marvel-server-zeta.vercel.app/";
  const _apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";
  const _baseOffset = 1;

  const getAllCharacters = async (offset = _baseOffset) => {
    const response = await request(
      `${BASE_URL}/characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return response.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const response = await request(`${BASE_URL}/characters/${id}?${_apiKey}`);
    return _transformCharacter(response.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: validDescription(char.description),
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const validDescription = (description) => {
    if (!description) {
      return "There is no description for this character.";
    }

    if (description.length > 210) {
      return (
        description.slice(0, 210) +
        description.slice(210, description.indexOf(" ", 211)) +
        "..."
      );
    }

    return description;
  };

  const getAllComics = async (offset = 0) => {
    const response = await request(
      `${BASE_URL}/comics?limit=8&offset=${offset}&${_apiKey}`
    );
    return response.data.results.map(_transformComic);
  };

  const getComic = async (comicId) => {
    const response = await request(`${BASE_URL}/comics/${comicId}?${_apiKey}`);
    return _transformComic(response.data.results[0]);
  };

  function _transformComic(comic) {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || "There is no description",
      pageCount: comic.pageCount
        ? `${comic.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: comic.thumbnail.path + "." + comic.thumbnail.extension,
      language: comic.textObjects[0]?.language || "en-us",
      price: comic.prices[0].price
        ? `${comic.prices[0].price}$`
        : "not available",
    };
  };

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    clearError,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
