// import axios from 'axios';
//
// const STK_PUSH_API = 'https://daraja-api.safaricom.co.ke/api/v1/stk-push';
// const SHORTCODE = 'your_shortcode';
// const LIPA_NA_MPESA_SHORTCODE = 'your_shortcode';
// const LIPA_NA_MPESA_SHORTPIN = 'your_shortcode_pin';
// const LIPA_NA_MPESA_URL = 'https://daraja-api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
//
// const initiateSTKPush = async (phoneNumber: string) => {
//     try {
//         const accessToken = await getAccessToken(); // Get OAuth token for Safaricom
//
//         const response = await axios.post(LIPA_NA_MPESA_URL, {
//             Shortcode: LIPA_NA_MPESA_SHORTCODE,
//             Shortpin: LIPA_NA_MPESA_SHORTPIN,
//             PhoneNumber: phoneNumber,
//             Amount: 'some_amount',
//             CallbackURL: 'your_callback_url',
//         }, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });
//
//         return response.data;
//     } catch (error) {
//         console.error("STK Push failed:", error);
//         throw error;
//     }
// };
