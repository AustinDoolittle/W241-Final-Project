import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    triggerAudioButton: {
        margin: "20px"
    },
    audioTestContainer: {
        textAlign: "center",
        display: 'block'
    },
    audioTestButton: {
        margin: "0 auto",
        fontSize: "75px",
        borderRadius: "3px",
        justifyContent: "center",
        textAlign: "center",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        backgroundColor: "#7bb2ff",
    }
});

export default function AudioTestPanel(props) {
    const { soundPlayer, handleAdvance, inControlGroup } = props;
    const classes = useStyles(props);

    function wrongOption() {
        window.alert('This is the incorrect option. Please retrigger the audio and try again.');
    }

    function initialize() {
        if (inControlGroup) {
            handleAdvance();
            return;
        }

        triggerAudio();
    }

    function triggerAudio() {
        soundPlayer.cancelSound();
        soundPlayer.triggerSelectBSound();
    }

    useEffect(initialize, []);

    return (
        <div>
            <Typography variant="h4">Follow the directions in the audio prompt to continue</Typography>
            <Button variant="contained" onClick={triggerAudio} className={classes.triggerAudioButton}>Retrigger Audio</Button>
            <Grid container>
                <Grid item xs="4" className={classes.audioTestContainer}>
                    <span className={classes.audioTestButton} onClick={wrongOption}>A</span>
                </Grid>
                <Grid item xs="4" className={classes.audioTestContainer}>
                    <span className={classes.audioTestButton} onClick={handleAdvance}>B</span>
                </Grid>
                <Grid item xs="4" className={classes.audioTestContainer}>
                    <span className={classes.audioTestButton} onClick={wrongOption}>C</span>
                </Grid>
            </Grid>
        </div>
    )
}