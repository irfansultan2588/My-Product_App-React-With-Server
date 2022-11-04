import React, { useContext, useState } from 'react'
import { GlobalContext } from '../Context'
import CheckOutCart from './CheckOutCart';
import Payment from './Payment';


const CheckOut = () => {

    let { state, dispatch } = useContext(GlobalContext);
    const [val, setval] = useState(false);




    const count = state.addcart;
    let adds = state.addcart.reduce((acc, obj) => {
        let count = obj.price * obj.count
        return acc + count
    }, 0)




    return (

        <div className='main-checkout'>
            {
                (val == true) ? <Payment cartItems={state.addcart} /> : <CheckOutCart />
            }

            <div className="secDiv" >
                <div className="inerDiv">
                    <div className="sideCard">
                        <h3>SubTotal</h3>
                        <h4 className='pricess'>Rs.{adds}</h4>
                    </div>
                    <div className="line"><hr /></div>
                    <div className="sideCard">
                        <h3>Total</h3>
                        <h4 className='pricess'>Rs.{adds}</h4>
                    </div>
                    <div className="sideCard"><p>Tax for the full value and fees will be calculated at checkout.❤️</p></div>
                    <div className="summryBtn">
                        <button className="next" onClick={() => { setval(true) }}>Next</button>
                        <button className="Back" onClick={() => { setval(false) }}>Back</button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default CheckOut