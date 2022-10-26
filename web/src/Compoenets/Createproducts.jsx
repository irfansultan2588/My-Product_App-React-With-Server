import React, { useContext, useState } from "react";
import { GlobalContext } from '../Context';
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

const Createproducts = () => {
    let { state, dispatch } = useContext(GlobalContext);
    const [toggleRefresh, setToggleRefresh] = useState(true);



    const formik = useFormik({
        initialValues: {
            productPicture: "",
            title: "",
            price: "",
            condition: "",
            description: "",
        },
        validationSchema: yup.object({
            productPicture: yup.string(4, "Enter your title"),
            title: yup.string("Enter your title"),
            price: yup
                .number("Enter a number")
                .moreThan(0, "price can not be zero")
                .required("price is required"),
            condition: yup.string("Enter your condition"),
            description: yup.string("Enter your description"),

        }),

        onSubmit: async (values, { resetForm }) => {
            console.log(values, "Values");
            let formData = new FormData();
            formData.append("productPicture", values["productPicture"][0]);
            formData.append("title", values["title"]);
            formData.append("price", values["price"]);
            formData.append("condition", values["condition"]);
            formData.append("description", values["description"]);
            formData.append("createdBy", state?.user?._id);

            axios({
                method: "post",
                url: `${state.baseUrl}/product`,
                data: formData,

                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            })
                .then((res) => {
                    console.log(`upload Success` + res.data);
                    setToggleRefresh(!toggleRefresh);
                    resetForm()
                })
                .catch((err) => {
                    console.log("ERROR", err);
                });

        },
    });

    return (
        <>
            <div className="formMain">


                <form className="productForm" onSubmit={formik.handleSubmit}>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="productPicture"
                            name="productPicture"
                            placeholder="productPicture"
                            onChange={(e) => {
                                const productPicture = document.getElementById("productPicture");
                                const url = URL.createObjectURL(productPicture.files[0]);

                                formik.handleChange({
                                    target: {
                                        name: "productPicture",
                                        value: e.target.files,
                                    },
                                });

                                console.log(url);
                                // document.getElementById(
                                // "product_img"
                                // ).innerHTML = ` <img width="200px" src="${url}" alt="#" id="product_img" />`;
                            }}
                        />
                    </div>
                    {/* <div id="product_img"></div> */}
                    {formik.touched.productPicture && formik.errors.productPicture ? (
                        <div className="errorMessage">{formik.errors.productPicture}</div>
                    ) : null}


                    <div>
                        <input
                            id="title"
                            name="title"
                            placeholder="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {formik.touched.title && formik.errors.title ? (
                        <div className="errorMessage">{formik.errors.title}</div>
                    ) : null}

                    <div>
                        <input
                            id="price"
                            name="price"
                            placeholder="Price"
                            type="text"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {formik.touched.price && formik.errors.price ? (
                        <div className="errorMessage">{formik.errors.price}</div>
                    ) : null}

                    <div>
                        <input
                            id="condition"
                            name="condition"
                            placeholder="Condition"
                            type="condition"
                            value={formik.values.condition}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {formik.touched.condition && formik.errors.condition ? (
                        <div className="errorMessage">{formik.errors.condition}</div>
                    ) : null}

                    <div>
                        <input
                            id="description"
                            name="description"
                            placeholder="Description"
                            type="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {formik.touched.description && formik.errors.description ? (
                        <div className="errorMessage">{formik.errors.description}</div>
                    ) : null}

                    <div>  <button className="addProduct" type="submit">Add Products</button></div>
                </form>
            </div>
        </>
    );
};

export default Createproducts;