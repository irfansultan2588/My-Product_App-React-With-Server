import React, { useMemo } from "react";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useContext } from 'react'
import { GlobalContext } from '../Context'
import axios from 'axios';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";



const useOptions = () => {
    const options = useMemo(
        () => ({
            style: {
                base: {
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: "Source Code Pro, monospace",
                    "::placeholder": {
                        color: "#aab7c4"
                    },
                    fontSize: "20px"
                },
                invalid: {
                    color: "#9e2146"
                }
            }
        }),

    );

    return options;
};



const Payment = (cartItems) => {

    let { state, dispatch } = useContext(GlobalContext);


    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }


        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });
        if (!error) {
            const { id } = paymentMethod;
            const createdBy = state.user._id;
            // console.log(createdBy)
            try {

                const data = await axios.post(`${state.baseUrl}/create-checkout-session`, {
                    createdBy,
                    id,
                    amount: state.addcart.reduce((acc, obj) => {
                        let count = obj.price * obj.count
                        return acc + count
                    }, 0),
                    cartItems: state.addcart,
                }, {
                    withCredentials: true,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Content-Type": "application/json"
                    }
                });
                console.log(data)
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (



        <>
            <div className='payment-containor'>
                <div>
                    <div className='payment-child'>
                        <div><CreditCardIcon className='payment-icon' /></div>
                        <h5 className='credit'>Enter credit or debit card</h5>
                    </div>
                    <hr />

                    <div className='payment-child-pay'>
                        <h5>S,O Pay</h5>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className='inp-fild'>
                            <CardElement
                                options={options}
                                onReady={() => {
                                    console.log("CardElement [ready]");
                                }}
                                onChange={e => {
                                    console.log("CardElement [change]", e);
                                }}
                            />
                        </form>
                    </div>

                    <div className='purchese-containor'>
                        <button type='submit' disabled={!stripe} className='purchese-btn' onClick={handleSubmit}>Purchase</button>
                    </div>
                </div>
            </div>
        </>


    )
}

export default Payment