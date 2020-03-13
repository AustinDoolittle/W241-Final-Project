import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import GamePanel from './panels/GamePanel';
import LandingPanel from './panels/LandingPanel';
import PreTreatmentPanel from './panels/PreTreatmentPanel';
import PostTreatmentPanel from './panels/PostTreatmentPanel';
import ErrorPanel from './panels/ErrorPanel';
import SoundPlayer from './util/SoundPlayer';

const useStyles = makeStyles( theme => ({
    card: {
        margin: "0 auto",
        maxWidth: "1000px",
        backgroundColor: "#f5eaea"
    },
    continueButton: {
        float: "right",
        margin: "auto"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const numberOfGames = 5;
const REST_BASE_URL = 'http://localhost:5000';

export default function MainWindow(props) {
    const classes = useStyles(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const subjectID = params.get('subjectID');

    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [soundPlayer, setSoundPlayer] = useState(new SoundPlayer(REST_BASE_URL, subjectID, () => setIsInitializing(false)));
    const [isInitializing, setIsInitializing] = useState(true);
    const panelCount = 4;

    function advanceToNextPanel() {
        const newIndex = currentPanelIndex + 1
        if (newIndex >= panelCount) {
            return;
        }

        setCurrentPanelIndex(newIndex);
    }

    function renderCurrentPanel() {
        const newProps = {
            handleAdvance: advanceToNextPanel,
            subjectID: subjectID,
            soundPlayer: soundPlayer
        }

        if (subjectID == null) {
            return <ErrorPanel {...newProps} />
        }

        if (currentPanelIndex === 0) {
            return <LandingPanel {...newProps}/>;
        }
        else if (currentPanelIndex === 1) {
            return <PreTreatmentPanel {...newProps}/>;
        }
        else if (currentPanelIndex === 2) {
            return <GamePanel numberOfGames={numberOfGames} {...newProps}/>;
        }
        else {
            return <PostTreatmentPanel {...newProps}/>;
        }
    }
    


    return (
        <div>
            <Card className={classes.card}>
                <CardHeader title="UC Berkeley MIDS - W241 Experiment" />
                <CardContent>
                    {renderCurrentPanel()}
                </CardContent>
            </Card>
            <Backdrop className={classes.backdrop} open={isInitializing}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}


