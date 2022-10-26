import { React, useContext } from 'react'
import { GlobalContext } from '../Context';

const AddToCart = () => {
    let { state, dispatch } = useContext(GlobalContext);
    console.log(state.addcart, 'state.addcart');

    const addCartDelete = (items) => {
        const Data = state.addcart.filter(item => item._id != items._id)
        console.log("item", items);
        console.log(Data, "delete data");
        dispatch({
            type: "CART_ITEM",
            payload: Data
        });
        localStorage.setItem("cartItem", JSON.stringify(Data))

    }

    return (

        <div className='main-cart'>

            {
                state.addcart.map((item) => {
                    return (
                        <div className='addcard_main'>
                            <div className='main-two'>
                                <div><img className='img_cart' src={item.productPicture} alt="" /></div>
                                <div className='title-price'>
                                    <div className='cart-containor'>
                                        <h5>{item.title}</h5>
                                    </div>
                                    <div className='cart-containor'>
                                        <h5 className='des-item'>{item.description}</h5>
                                    </div>
                                    <div className='cart-containor'>
                                        <h5 className='condition-item'>{item.condition}</h5>
                                    </div>
                                </div>



                                <div className='price-btn-containor'>
                                    <div className='cart-containor'>
                                        <h5 className='price-cart'>Rs, {item.price}</h5>
                                    </div>

                                    <div>
                                        <button className='cart-btn'
                                            onClick={() => addCartDelete(item)}
                                        >Delete</button>
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

export default AddToCart