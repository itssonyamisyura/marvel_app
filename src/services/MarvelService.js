import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

    const getAllCharacters = async (offset = 0) => {
        const res = await request(`${_apiBase}characters?limit=20&offset=${offset}&${_apiKey}`
    ); // get data in json fromat
        return res.data.results.map(_transformCharacter); // form array with new objects
    }
    
    const getNineCharacters = async (offset = 0) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`); 
        return res.data.results.map(_transformCharacter); 
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`); 
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

	const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
        return _transformComics(res.data.results[0]);
    }


    const _transformCharacter = (char) => {
        return {
            id: char.id, 
            name: char.name,
            description: char.description,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension} `,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    } // get data and return transformed object 

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            description: comics.description || "There is no description",
            title: comics.title,
            price: comics.prices[0].price
            ? `${comics.prices[0].price}$`
            : "not available",
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension} `,
            pageCount: comics.pageCount
        }
    }

    return {loading, error, getAllCharacters, getCharacter, getNineCharacters, clearError, getAllComics, getComic}
}

export default useMarvelService;
