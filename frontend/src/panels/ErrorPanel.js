import React from 'react';
import Typography from '@material-ui/core/Typography';


export default function ErrorPanel(props) {
    const {errorText} = props;
    return (
        <div>
            <Typography variant='h3'>Something went wrong</Typography>
            <Typography variant='body1'>
                {errorText} Please contact <a href="mailto:berkeleyw241experiment@gmail.com?Subject=Bad%20Link">berkeleyw241experiment@gmail.com</a> for further instructions
            </Typography>
        </div>
    )
}