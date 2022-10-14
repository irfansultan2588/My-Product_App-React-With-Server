import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../Context'
import axios from 'axios'
import { useFormik } from 'formik';
import * as yup from 'yup';


let Product = () => {

    let { state, dispatch } = useContext(GlobalContext);
    let [products, setProducts] = useState([]);
    let [editProduct, setEditProduct] = useState(null);
    let [loading, setLoading] = useState(false);
    let [toggleReload, setToggleReload] = useState(false);



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

    }, [toggleReload])







    let updateHandler = async (e) => {
        e.preventDefault();


        try {
            let updated = await
                axios.put(`${state.baseUrl}/product/${editProduct?._id}`,
                    {
                        name: editProduct.name,
                        price: editProduct.price,
                        description: editProduct.description,
                        code: editProduct.code,
                    },
                    {
                        withCredentials: true
                    })
            console.log("updated: ", updated.data);

            setToggleReload(!toggleReload);
            setEditProduct(null);


        } catch (e) {
            console.log("Error in api call: ", e);
            setLoading(false)
        }


    }


    return (
        <div >
            <h1>Products Page</h1>




            {(editProduct !== null) ? (< div >

                <h1>
                    update form
                </h1>
                <form onSubmit={updateHandler} >
                    Name: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, name: e.target.value }) }} value={editProduct.name} /> <br />
                    Price: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, price: e.target.value }) }} value={editProduct.price} /> <br />
                    Description: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, description: e.target.value }) }} value={editProduct.description} /> <br />
                    Code: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, code: e.target.value }) }} value={editProduct.code} /> <br />

                    <button type="submit"> Proceed Update </button>
                </form>
            </div>) : null}



            <div className='card_container'>
                {products?.map(eachProduct => (
                    <div className='card' key={eachProduct?._id}>

                        <div className='card_child'>
                            <h3>Product Name :</h3>
                            <div>
                                {eachProduct?.name}
                            </div>
                        </div>
                        <div className='card_child'>
                            <h3>Description :</h3>
                            <div>{eachProduct?.description}</div>
                        </div>
                        <div className='card_child'>
                            <h3>Price :</h3>
                            <div>{eachProduct?.price}</div>
                        </div>
                        <div className='card_child'>
                            <h3>Code :</h3>
                            <div>{eachProduct?.code}</div>
                        </div>

                        <button onClick={async () => {
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

                        }}>Delete</button>

                        <button onClick={() => {
                            setEditProduct({
                                _id: eachProduct._id,
                                name: eachProduct?.name,
                                price: eachProduct?.price,
                                description: eachProduct?.description,
                                code: eachProduct?.code
                            })
                        }}>Edit</button>

                    </div>
                ))}
            </div>


        </div >
    );
}

export default Product;