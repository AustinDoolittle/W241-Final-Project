import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

})

export const cellStates = {
    X: 'X',
    O: 'O',
    UNCLAIMED: 'U'
}

function GameCell() {
    return "Hi!"
}

export default withStyles(styles)(GameCell);