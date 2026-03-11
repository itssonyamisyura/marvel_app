import { useHttp } from "../hooks/http.hook";
import ironman from '../resources/img/iron-man.jpg';
import america from '../resources/img/america.jpg';

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

    const getAllCharacters = async (offset = 0) => {
        const res = await request(`${_apiBase}characters?limit=20&offset=${offset}&${_apiKey}`
    ); // get data in json fromat
        return res.data.results.map(_transformCharacter); // form array with new objects
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter); 
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
        let thumbnail = `${char.thumbnail.path}.${char.thumbnail.extension}`;
        if (char.id === 1) {
            thumbnail = ironman;
        } else if (char.id === 2) {
            thumbnail = america;
        }
        return {
            id: char.id, 
            name: char.name,
            description: char.description,
            thumbnail,
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

    return { getAllCharacters, getCharacter, getNineCharacters, clearError, process, setProcess, getAllComics, getComic, getCharacterByName}
}

export default useMarvelService;
