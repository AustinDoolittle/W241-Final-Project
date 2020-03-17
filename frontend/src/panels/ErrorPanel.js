import React from 'react';
import Typography from '@material-ui/core/Typography';
import {W241_EMAIL_ADDRESS} from "../util/constants";


export default function ErrorPanel(props) {
    const {errorText} = props;
    return (
        <div>
            <Typography variant='h3'>Something went wrong</Typography>
            <Typography variant='body1'>
                {errorText} 
                Please contact <a href={`mailto:${W241_EMAIL_ADDRESS}?Subject=Encountered%20Error`}>{W241_EMAIL_ADDRESS}}</a> for further instructions
            </Typography>
        </div>
    )
}