import './comicsList.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset)
    }, []) 

    useEffect(() => {
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [offset, loading, newItemLoading, error, comicsEnded]);

    const onRequest = (offset) => {
        setNewItemLoading(offset !== 0);

        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        } 

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(prev => prev + 8);
        setComicsEnded(ended);
    }

    const onScroll = () => {
        // если уже грузим или дошли до конца — ничего не делаем
        if (newItemLoading || loading || error || comicsEnded) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        // если почти внизу (за 100px до конца) — грузим еще
        if (scrollTop + windowHeight >= fullHeight - 100) {
            onRequest(offset)
        }
    }

    function renderItems(arr) {
        const items = arr.map((item) => {
            return (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);
    const errorMessage =error ? <ErrorMessage/> : null;;
    const spinner = (loading && !newItemLoading) ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner} 
            {items}
            <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            onClick={() => {
                onRequest(offset);
            }}
            style={{display: comicsEnded ? 'none' : 'block'}} >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;