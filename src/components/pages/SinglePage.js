import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({Component, dataType}) => {
        const { id, comicId } = useParams();
        const currentId = id || comicId;
        const [data, setData] = useState(null);
        const {getComic, getCharacter, clearError, process, setProcess} = useMarvelService();

        useEffect(() => {
            updateData()
        }, [currentId])

        const updateData = () => {
            clearError();

            switch (dataType) {
                case 'comic':
                    getComic(currentId).then(onDataLoaded)
                    .then(() => setProcess('confirmed'));
                    break;
                case 'character':
                    getCharacter(currentId).then(onDataLoaded)
                    .then(() => setProcess('confirmed'));
                    break;
                default:
                    break;
            }
        }

        const onDataLoaded = (data) => {
            setData(data);
        }

        return (
            <>
                <AppBanner/>
                {setContent(process, Component, data)}
            </>
        )
}

export default SinglePage;