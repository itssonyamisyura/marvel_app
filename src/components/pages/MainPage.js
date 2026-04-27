import { useState } from "react";
import { Helmet } from "react-helmet";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharInfoDialog from "../charInfoDialog/CharInfoDialog";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import decoration from '../../resources/img/vision.png';
import CharSearchForm from "../charSearchForm/CharSearchForm";

const MOBILE_BREAKPOINT = 768;

const MainPage = () => {

    const [selectedChar, setChar] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const onCharSelected = (id) => {
        setChar(id);
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            setDialogOpen(true);
        }
    }

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                    />
                <title>Marvel information portal</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>    
                </ErrorBoundary>
                <div style={{'position': 'sticky', 'top': 0}}>
                <ErrorBoundary>
                    <CharInfo charId={selectedChar}/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <CharSearchForm/>
                </ErrorBoundary>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>

            {dialogOpen && selectedChar && (
                <CharInfoDialog
                    charId={selectedChar}
                    onClose={() => setDialogOpen(false)}
                />
            )}
        </>
    )
}

export default MainPage;
