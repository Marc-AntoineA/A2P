const API_PATH = require('../settings.json').API_PATH;

// import Handlebars  from 'handlebars';
// import {  postForgotPassword } from './ApiRequests';

// const TEXTS = require('../static.json');

// export const forgotPassword = data => {
//     console.log("email: ", data);
//     return fetch('http://localhost:3000/forgot-password', {
//         method: "PUT",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ data })
//     })
//         .then(res => {
//             console.log("forgot password response: ", res);
//             return res.json();
//         })
//         .catch(err => console.log(err));
// };
// export const forgotPassword =(email) => {
//     postForgotPassword({ email: this.state.email.trim() })
//     .then((response) => {
//       const forgotPasswordTemplate = Handlebars.compile(TEXTS.SUCCESS_MESSAGES.FORGOT_PASSWORD);
//       this.props.handleModal(forgotPasswordTemplate({ mailAddress: this.state.email.trim() }), 'Success');
//     })
//     .catch((error) => {
//       this.props.handleModal(error.message ? error.message : error.toString(), 'Error');
//     });
//   }

export const resetPassword = data => {
    return fetch(API_PATH, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            console.log("forgot password response: ", res);
            return res.json();
        })
        .catch(err => console.log(err));
};