import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../Context'
import axios from 'axios'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { json } from 'react-router-dom';


const UserProduct = () => {

    let { state, dispatch } = useContext(GlobalContext);
    let [products, setProducts] = useState([]);
    let [editProduct, setEditProduct] = useState(null);
    let [loading, setLoading] = useState(false);
    let [toggleReload, setToggleReload] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');




    useEffect(() => {

        const getAllProducts = async () => {
            try {
                let response = await axios({
                    url: `${state.baseUrl}/products`,
                    method: "get",
                    withCredentials: true
                })
                if (response.status === 200) {
                    console.log("response: ", response.data.data);

                    setProducts(response.data.data.reverse());

                } else {
                    console.log("error in api call")
                }
            } catch (e) {
                console.log("Error in api call: ", e);
            }
        }
        getAllProducts();

    }, [toggleReload]);


    let updateHandler = async (e) => {
        e.preventDefault();


        try {
            let updated = await
                axios.put(`${state.baseUrl}/product/${editProduct?._id}`,
                    {
                        productPicture: editProduct.productPicture,
                        title: editProduct.title,
                        condition: editProduct.condition,
                        price: editProduct.price,
                        description: editProduct.description,
                    },
                    {
                        withCredentials: true
                    })
            console.log("updated: ", updated.data);

            setToggleReload(!toggleReload);
            setEditProduct(null);
            handleClose()


        } catch (e) {
            console.log("Error in api call: ", e);
            setLoading(false)
        }

    }

    const handleClose = () => {
        setOpen(false);
    };


    const addToCard = (item) => {
        item.count = 1
        if (state.addcart.some(a => a._id == item._id)) {
            return;

        } else {
            const cartItem = [...state?.addcart, item]
            dispatch({
                type: "CART_ITEM",
                payload: cartItem,
            });
            localStorage.setItem("cartItem", JSON.stringify(cartItem))
            console.log(item._id);
        }


    };

    return (
        <>

            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle> <h2 className='haed-update' >Update Form</h2> </DialogTitle>
                <DialogContent>
                    {(editProduct !== null) ? (< div >

                        <form onSubmit={updateHandler}  >
                            <div className='update-fild'>
                                <h5> ProductPicture: </h5><input type="text" onChange={(e) => { setEditProduct({ ...editProduct, productPicture: e.target.value }) }} value={editProduct.productPicture} />
                            </div>
                            <div className='update-fild'>
                                <h5> Title:</h5> <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, title: e.target.value }) }} value={editProduct.title} />
                            </div>
                            <div className='update-fild'>
                                <h5> Price: </h5> <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, price: e.target.value }) }} value={editProduct.price} />
                            </div>
                            <div className='update-fild'>
                                <h5> Condition:</h5> <input type="condition" onChange={(e) => { setEditProduct({ ...editProduct, condition: e.target.value }) }} value={editProduct.condition} />
                            </div>
                            <div className='update-fild'>
                                <h5> Description:</h5>
                                <input type="description" onChange={(e) => { setEditProduct({ ...editProduct, description: e.target.value }) }} value={editProduct.description} />
                            </div>

                        </form>
                    </div>) : null}

                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={updateHandler}> Proceed Update </Button>
                </DialogActions>
            </Dialog>

            <h1 className='productHeading'>User Products</h1>
            <div className='card_container'>

                {products?.map(eachProduct => (
                    <div className='card-produdct23' key={eachProduct?._id}>

                        <div className='card_child'>
                            <img className='product-img' style={{ width: "100%" }} src={eachProduct?.productPicture} alt="" />
                        </div>
                        <div className='card_child-main' >
                            <div className='card_child'>
                                <h5 className='cardDiv'>{eachProduct?.title}</h5>
                            </div>
                            <div className='card_child'>
                                <h5 className='price'>Rs.{eachProduct?.price}</h5>
                            </div>
                        </div>
                        <div className='card_child'>
                            <h4 className='condition'>{eachProduct?.condition}</h4>
                        </div>
                        <div className='card_child'>
                            <p className='description'>{eachProduct?.description}</p>
                        </div>

                        {
                            state?.user?._id === eachProduct?.createdBy ? <div className="btnDiv">
                                <button className='productDelete' onClick={async () => {
                                    try {

                                        setLoading(true)

                                        let deleted = await
                                            axios.delete(`${state.baseUrl}/product/${eachProduct?._id}`,
                                                {
                                                    withCredentials: true
                                                })
                                        console.log("deleted: ", deleted.data);
                                        setLoading(false)

                                        setToggleReload(!toggleReload);

                                    } catch (e) {
                                        console.log("Error in api call: ", e);
                                        setLoading(false)
                                    }

                                }}>Delete Product</button>

                                <button className='productEdit' onClick={() => {
                                    setEditProduct({
                                        _id: eachProduct._id,
                                        productPicture: eachProduct?.productPicture,
                                        title: eachProduct?.title,
                                        price: eachProduct?.price,
                                        condition: eachProduct?.condition,
                                        description: eachProduct?.description,
                                    })
                                    setOpen(true)
                                }
                                }>Update Product</button>
                            </div> : <div className="btnDiv">
                                <button className='productDelete' onClick={() => addToCard(eachProduct)}>
                                    add to card</button>

                                <button className='productEdit' >Buy Now</button>
                            </div>
                        }


                    </div>
                ))}
            </div>



        </>
    )
}

export default UserProduct