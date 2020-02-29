import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    card: {
        backgroundColor: "#f5eaea"
    },
    cardElement: {
        backgroundColor: "#f5eaea"
    },
    grid: {
        minHeight: '100vh'
    },
    typography: {
        overflowY: "auto"
    },
    button: {
        float: "right"
    }
})

class ExperimentWindow extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container 
                spacing={0}
                alignItems="center" 
                justify="center"
                direction="column"
                className={classes.grid}>

                <Grid item xs={6}>
                    <Card className={classes.card}>
                        <CardHeader title="UC Berkeley MIDS - W241-03 Experiment" />
                        <CardContent>
                        <Typography component="p" className={classes.typography}>
                            Thank you for participating in our study. This should take no longer than 10 minutes to complete. Please click the arrow to get started!
                        </Typography>
                        <Button className={classes.button}>
                            Next
                        </Button>
                        </CardContent>
                        <Stepper className={classes.cardElement} 
                            variant="progress"
                            position="static"
                            steps={5}>
                        </Stepper>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ExperimentWindow);
