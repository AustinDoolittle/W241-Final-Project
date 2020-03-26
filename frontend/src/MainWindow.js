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
import NoSubjectIDPanel from './panels/NoSubjectIDPanel';
import { ExperimentStatus, AssignmentStatus } from './util/enums';
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

export default function MainWindow(props) {
    const classes = useStyles(props);
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const subjectID = params.get('subjectID');

    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [soundPlayer, setSoundPlayer] = useState();
    const [isError, setIsError] = useState(false);
    const [errorText, setErrorText] = useState(BAD_LINK_ERROR_TEXT)
    const [inControlGroup, setInControlGroup] = useState();
    const [isSubjectElligible, setIsSubjectElligible] = useState();
    const panelCount = 5;

    window.onbeforeunload = function(event) {
        if (currentPanelIndex > 1 && currentPanelIndex <= 3)
        return "If you leave, you will not be given another opportunity to participate. Continue?";
    };

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

    function postMove(move) {
        fetch(REST_BASE_URL + `/subject/${subjectID}/move`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(move)
        })
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

    function handleAudioTestPanelAdvance() {
        postExperimentStarted();
        advanceToNextPanel();
    }

    function handleGamePanelAdvance() {
        postExperimentComplete();
        advanceToNextPanel();
    }

    function isOnInternetExplorer() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
    }

    function isOnMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function renderCurrentPanel() {
        const newProps = {
            handleAdvance: advanceToNextPanel,
            soundPlayer: soundPlayer,
            inControlGroup: inControlGroup,
        }

        if(subjectID == null) {
            return <NoSubjectIDPanel></NoSubjectIDPanel>
        }

        if (isError) {
            if (soundPlayer != null) {
                soundPlayer.cancelSound()
            }

            return <ErrorPanel errorText={errorText} {...newProps} />
        }

        if (isOnMobile()) {
            return <p>You may not use a mobile device. You must use a computer. Please navigate to this link on a computer.</p> 
        }

        if(isOnInternetExplorer()) {
            return <p>You must use chrome or Firefox. Please copy paste this link into a chrome or firefox browser.</p> 
        }

        if (currentPanelIndex === 0) {
            return <LandingPanel {...newProps}/>;
        }
        else if (currentPanelIndex === 1) {
            newProps.handleAdvance = handleAudioTestPanelAdvance
            return <AudioTestPanel {...newProps} />;
        }
        else if (currentPanelIndex === 2) {
            return <PreTreatmentPanel {...newProps}/>;
        }
        else if (currentPanelIndex === 3) {
            newProps.handleAdvance = handleGamePanelAdvance;
            return <GamePanel handlePlayerMove={postMove} numberOfGames={numberOfGames} {...newProps}/>;
        }
        else {
            return <PostTreatmentPanel {...newProps}/>;
        }
    }

    function initialize() {
        initializeSounds();
        retrieveSubjectAssignment();
    }

    function initializeSounds() {
        if (subjectID == null) { 
            return
        }

        if (inControlGroup) {
            setSoundPlayer(null);
            return;
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
            .then(response => {
                return response.json()
            })
            .then(data => {
                const notStarted = data['experiment_status'] === ExperimentStatus.NOT_STARTED;
                setIsSubjectElligible(notStarted);

                if (data['assignment_status'] === AssignmentStatus.NOT_ASSIGNED) {
                    setErrorText(BAD_LINK_ERROR_TEXT)
                    setIsError(true);
                    return;
                }

                setInControlGroup(data['assignment_status'] === AssignmentStatus.CONTROL)

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

    useEffect(initialize, []);
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


