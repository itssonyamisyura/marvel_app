import './charList.scss';
import { useState, useEffect, useRef, createRef} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getNineCharacters} = useMarvelService();

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
        setNewItemLoading(offset !== 0);

        getNineCharacters(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        } 

        setCharList(prev => [...prev, ...newChars]);
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


    const itemRefs = useRef([]);
    const nodeRefs = useRef({});

    const setRef = (ref, i) => {
        itemRefs.current[i] = ref;
    }

    const focusOnItem = (i) => {
        itemRefs.current.forEach(item => item?.classList.remove('char__item_selected'));
        itemRefs.current[i]?.classList.add('char__item_selected');
        itemRefs.current[i]?.focus();
    }

    const blurOnItem = (i) => {
        itemRefs.current[i]?.classList.remove('char__item_selected');
    }


    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { objectFit: 'cover' };
            if (item.thumbnail.includes('image_not_available')) {
                imgStyle = { objectFit: 'unset' };
            }  

            if (!nodeRefs.current[item.id]) {
                nodeRefs.current[item.id] = createRef();
            }

            return (
                <CSSTransition
                    key={item.id}
                    timeout={500}
                    classNames='char__item'
                    nodeRef={nodeRefs.current[item.id]}>
                    <li className="char__item"
                        tabIndex={0}
                        ref={(el) => {
                            setRef(el, i);
                            nodeRefs.current[item.id].current = el;
                        }}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                    }}
                        onBlur={() => blurOnItem(i)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' '){
                                e.preventDefault();
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}
                    >
                        <img style={imgStyle} src={item.thumbnail} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return(
        <ul className="char__grid">
            <TransitionGroup component={null}>
                {items}
            </TransitionGroup>
        </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = (loading && !newItemLoading) ? <Spinner/> : null;
    
    return (
        <div className="char__list">
            {errorMessage}
            {spinner} 
            {items}

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