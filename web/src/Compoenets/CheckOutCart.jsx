import React from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../Context'

const CheckOutCart = () => {

    let { state, dispatch } = useContext(GlobalContext);



    const increment = (item) => {
        console.log("item", item)

        const updateValue = state.addcart.map(obj => {
            if (obj._id === item._id) {
                return { ...obj, count: obj.count + 1 }
            }
            return obj

        })
        dispatch({
            type: "CART_ITEM",
            payload: updateValue,
        });
        console.log(updateValue, 'updateValue');
    };

    const handleDecrement = (item) => {

        if (item.count === 1) {
            return;
        }
        const updateValues = state.addcart.map(obj => {
            if (obj._id === item._id) {
                return { ...obj, count: obj.count - 1 }
            }
            console.log(obj, 'obj');
            return obj

        })
        dispatch({
            type: "CART_ITEM",
            payload: updateValues,
        });
        console.log(updateValues, 'updateValue');
    }
    return (

        <div className="left-container">
            {state.addcart.map((eachProduct) => {
                console.log("eachProduct", eachProduct)
                return (
                    <div className='checkcard_main'>
                        <div className='check-out'>
                            <div><img className='img_cart' src={eachProduct.productPicture} alt="" /></div>
                            <div className='title-price-checkout'>
                                <div className='cart-containor'>
                                    <h5>{eachProduct.title}</h5>
                                </div>
                                <div className='cart-containor'>
                                    <h5 className='des-item'>{eachProduct.description}</h5>
                                </div>
                                <div className='cart-containor'>
                                    <h5 className='condition-item'>{eachProduct.condition}</h5>
                                </div>
                            </div>

                            <div className=''>
                                <div className='cart-containor'>
                                    <h5 className='checkout-price'>Rs, {eachProduct.price}</h5>
                                </div>
                                <div className="main9">
                                    <div>
                                        <button className="increment" onClick={() => increment(eachProduct)}>
                                            +
                                        </button>
                                    </div>
                                    <div className="countDiv">
                                        <h5 className='counter'> {eachProduct.count}</h5>
                                    </div>
                                    <div>
                                        <button className="decrement" onClick={() => handleDecrement(eachProduct)}>
                                            -
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}

export default CheckOutCart