import React from 'react';
import { W241_EMAIL_ADDRESS } from "../util/constants";

export default function LandingPanel(props) {
    return (
        <div>
            <p>Hello, and thank you for expressing interest in our study.</p>
            <p>Check your email inbox for an email from {W241_EMAIL_ADDRESS}, and follow the provided link.</p>
        </div>
    )
}