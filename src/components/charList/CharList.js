import './charList.scss';
import { useState, useEffect, useRef, use } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);


    const marvelService = new MarvelService(); 

    useEffect(() => {
        onRequest(offset)
    }, []) //выполнить один раз после первого рендера

    useEffect(() => { //подписка на scroll
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [offset, loading, newItemLoading, error, charEnded]);


    const onRequest = (offset) => {
        if (offset === 0) {
            setLoading(true);
        } else {
            setNewItemLoading(true);
        }
        marvelService
            .getNineCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        } 

        setCharList(prev => [...prev, ...newChars]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(prev => prev + 9);
        setCharEnded(ended);
    }

    const onScroll = () => {
        // если уже грузим или дошли до конца — ничего не делаем
        if (newItemLoading || loading || error || charEnded) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        // если почти внизу (за 100px до конца) — грузим еще
        if (scrollTop + windowHeight >= fullHeight - 100) {
            onRequest(offset)
        }
    }

    const onError = () => {
        setLoading(false);
        setNewItemLoading(false);
        setError(true);
    }


    const itemRefs = useRef([]);

    const setRef = (ref, i) => {
        itemRefs.current[i] = ref;
    }

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="char__item"
                tabIndex={0}
                ref={(ref) => setRef(ref, i)}
                key={item.id}
                onClick={() => {
                    props.onCharSelected(item.id);
                    focusOnItem(i);
                }}
                >
                    <img src={item.thumbnail} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return(
        <ul className="char__grid">
            {items}
        </ul>
        )
    }


    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(error || loading) ? items : null;
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner} 
            {content}

            <button 
                type='button'
                className="button button__main button__long"
                onClick={() => {
                    onRequest(offset);
                }}
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}} >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;