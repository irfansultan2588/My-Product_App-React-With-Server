import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../Context'
import axios from 'axios'


const MyOrder = () => {
    let { state, dispatch } = useContext(GlobalContext);
    const [order, setOrder] = useState([])
    let [toggleReload, setToggleReload] = useState(false);

    // console.log(order, "order==")

    useEffect(() => {

        const getAllOrders = async () => {
            try {
                let response = await axios({
                    url: `${state.baseUrl}/orderlist`,
                    method: "get",
                    withCredentials: true
                })
                console.log(response, "response=");
                if (response.status === 200) {
                    console.log("response: ", response.data.data);

                    setOrder(response.data.data);
                    console.log(response?.data?.data);

                } else {
                    console.log("error in api call")
                }
            } catch (e) {
                console.log("Error in api call: ", e.message);
            }
        }
        getAllOrders();

    }, [toggleReload]);

    return (
        <div className="left-container">

            {order?.map((eachOrder) => {
                console.log("eachOrder", eachOrder)
                return (

                    eachOrder.cartItems.map((Items) => {
                        return <div className='checkcard_main'>
                            <div className='check-out'>
                                <div><img className='img_cart' src={Items.productPicture} alt="" /></div>
                                <div className='title-price-checkout'>
                                    <div className='cart-containor'>
                                        <h5>{Items.title}</h5>

                                    </div>
                                    <div className='cart-containor'>
                                        <h5 className='des-item'> {Items.description}</h5>
                                    </div>
                                    <div className='cart-containor'>
                                        <h5 className='condition-item'>{Items.condition}</h5>
                                    </div>
                                    <div className='cart-containor'>
                                        <h5 className='condition-item'>Quaintity : {Items.count}</h5>
                                    </div>
                                </div>

                                <div className=''>
                                    <div className='cart-containor'>
                                        <h5 className='checkout-price'>Rs, {Items.price}</h5>
                                    </div>

                                </div>

                            </div>
                        </div>
                    })


                )
            })
            }

        </div>
    )
}

export default MyOrder