import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import GamePanel from './panels/GamePanel';
import LandingPanel from './panels/LandingPanel';
import PreTreatmentPanel from './panels/PreTreatmentPanel';
import PostTreatmentPanel from './panels/PostTreatmentPanel';
import ErrorPanel from './panels/ErrorPanel';
import SoundPlayer from './util/SoundPlayer';
import AudioTestPanel from './panels/AudioTestPanel';
import { ExperimentStatus } from './util/enums';
import { BAD_LINK_ERROR_TEXT, CONNECTION_ERROR_TEXT, USER_INELLIGIBLE_ERROR_TEXT } from './util/errorTextConstants';

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
const REST_BASE_URL = `https://${window.location.hostname}/api`;
const IS_PILOT = true;

export default function MainWindow(props) {
    const classes = useStyles(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);

    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [soundPlayer, setSoundPlayer] = useState();
    const [subjectID, setSubjectID] = useState(params.get('subjectID'))
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState(BAD_LINK_ERROR_TEXT)
    const [isSubjectElligible, setIsSubjectElligible] = useState();
    const panelCount = 5;

    function advanceToNextPanel() {
        const newIndex = currentPanelIndex + 1
        if (newIndex >= panelCount) {
            return;
        }

        setCurrentPanelIndex(newIndex);
    }

    function onSoundPlayerError(event) {
        console.log(event);
        setIsError(true);
        setErrorText(CONNECTION_ERROR_TEXT);
    }

    function postExperimentStarted() {
        fetch(REST_BASE_URL + `/subject/${subjectID}/start_experiment`, {
            method: "POST",
            headers: {
                'Accept': 'application/json'
            }
        })
        .catch(error => {
            setIsError(true);
            setErrorText(CONNECTION_ERROR_TEXT);
            console.log(error);
        })
    }

    function postExperimentComplete() {
        fetch(REST_BASE_URL + `/subject/${subjectID}/complete_experiment`, {
            method: "POST",
            headers: {
                'Accept': 'application/json'
            }
        })
        .catch(error => {
            setIsError(true);
            setErrorText(CONNECTION_ERROR_TEXT);
            console.log(error);
        })
    }

    function handleLandingPanelAdvance() {
        postExperimentStarted();
        advanceToNextPanel();
    }

    function handleGamePanelAdvance() {
        postExperimentComplete();
        advanceToNextPanel();
    }

    function renderCurrentPanel() {
        const newProps = {
            handleAdvance: advanceToNextPanel,
            soundPlayer: soundPlayer
        }

        if (subjectID == null || isError) {
            if (soundPlayer != null) {
                soundPlayer.cancelSound()
            }

            return <ErrorPanel errorText={errorText} {...newProps} />
        }

        if (currentPanelIndex === 0) {
            newProps.handleAdvance = handleLandingPanelAdvance;
            return <LandingPanel {...newProps}/>;
        }
        else if (currentPanelIndex === 1) {
            return <AudioTestPanel {...newProps} />;
        }
        else if (currentPanelIndex === 2) {
            return <PreTreatmentPanel {...newProps}/>;
        }
        else if (currentPanelIndex === 3) {
            newProps.handleAdvance = handleGamePanelAdvance;
            return <GamePanel numberOfGames={numberOfGames} {...newProps}/>;
        }
        else {
            return <PostTreatmentPanel {...newProps}/>;
        }
    }

    function initializeSounds() {
        if (subjectID == null) { 
            return
        }

        const noopHandler = () => {};
        const errorHandler = (event) => onSoundPlayerError(event)

        setSoundPlayer(new SoundPlayer(REST_BASE_URL, subjectID, noopHandler, errorHandler));
    }

    function retrieveSubjectAssignment() {
        if (subjectID == null) {
            return;
        }
        fetch(REST_BASE_URL + `/subject/${subjectID}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                const notStartedAndNotPilot = data['experiment_status'] === ExperimentStatus.NOT_STARTED && data['is_pilot'] === IS_PILOT;
                setIsSubjectElligible(notStartedAndNotPilot);

            })
            .catch(error => {
                setIsError(true);
                setErrorText(BAD_LINK_ERROR_TEXT);
                console.log(error);
            })
    }

    function assertIsElligble() {
        if (isSubjectElligible == null) {
            return;
        }
        else if (!isSubjectElligible) {
            setIsError(true);
            setErrorText(USER_INELLIGIBLE_ERROR_TEXT);
        }

    }

    useEffect(initializeSounds, []);
    useEffect(retrieveSubjectAssignment, [subjectID])
    useEffect(assertIsElligble, [isSubjectElligible]);

    return (
        <div>
            <Card className={classes.card}>
                <CardHeader title="UC Berkeley MIDS" />
                <CardContent>
                    {renderCurrentPanel()}
                </CardContent>
            </Card>
        </div>
    );
}


