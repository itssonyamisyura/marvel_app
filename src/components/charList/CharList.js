import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 0,
        newItemLoading: false,
        charEnded: false
    }

    marvelService = new MarvelService(); 

    componentDidMount() {
        this.onRequest(this.state.offset);
    }

    onRequest = (offset) => {
        if (offset === 0) {
            this.setState({ loading: true });
        } else {
            this.setState({ newItemLoading: true });
        }
        this.marvelService.getNineCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState((state) => ({
            charList: [...state.charList, ...newChars], //Возьми старых персонажей, добавь к ним новых
            loading: false,
            newItemLoading: false,
            offset: state.offset + 9,
            charEnded: ended
        })) 
    }

    onError = () => {
        this.setState({
            loading: false, 
            newItemLoading: false,
            error: true
        })
    }
    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items = arr.map((item) => {
            return (
                <li className="char__item"
                key={item.id}
                onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
         // конструкция вынесена для центровки спиннера/ошибки
        return(
        <ul className="char__grid">
            {items}
        </ul>
        )
    }

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);

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
                        this.onRequest(offset);
                    }}
                    disabled={newItemLoading}
                    style={{display: charEnded ? 'none' : 'block'}} >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;