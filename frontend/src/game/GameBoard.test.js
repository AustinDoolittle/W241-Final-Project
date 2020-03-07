import React from 'react';
import { mount } from 'enzyme';
import GameBoard from './GameBoard.js';
import GameCell, { cellStates } from './GameCell.js';
import { ExpansionPanelActions } from '@material-ui/core';

// TODO this is very broken. Figure out how unit testing works.
describe('<GameBoard /> with winning move', () => {
    it("should win on move", () => {
        const props = {
            initialBoardState: [
                [cellStates.UNCLAIMED, cellStates.X, cellStates.X],
                [cellStates.O, cellStates.UNCLAIMED, cellStates.O],
                [cellStates.UNCLAIMED, cellStates.UNCLAIMED, cellStates.UNCLAIMED],
            ]
        }
        const container = mount(<GameBoard {... props}/>)    
        container.find(GameCell).simulate('click');
        expect(container.state()).toEqual({
            boardState: [
                [cellStates.X, cellStats.X, cellStates.X],
                [cellStates.O, cellStats.UNCLAIMED, cellSTates.O],
                [cellStates.UNCLAIMED, cellStats.UNCLAIMED, cellSTates.UNCLAIMED],
            ]
        })
    })
});