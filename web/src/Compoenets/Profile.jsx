import { useContext } from "react";
import React, { useState } from 'react'
import { GlobalContext } from '../Context'
import axios from 'axios'


const Profile = () => {

    let { state, dispatch } = useContext(GlobalContext);
    let [loading, setLoading] = useState(false);
    let [toggleReload, setToggleReload] = useState(false);
    const [fname, setfName] = useState(state?.user.firstName);
    const [lname, setlName] = useState(state?.user.lastName);
    const [gender, setGender] = useState(state.user?.gender);
    const [address, setAddress] = useState(state.user?.address);





    let updateHandler = async () => {

        try {
            let updated = await
                axios.put(`${state.baseUrl}/profile/${state?.user?._id}`,
                    {
                        firstName: fname,
                        lastName: lname,
                        address: address,
                        gender: gender,
                    },
                    {
                        withCredentials: true
                    })
            console.log("user=== ", updated.data);

            setToggleReload(!toggleReload);



        } catch (e) {
            console.log("Error in api call: ", e);
            setLoading(false)
        }

    }

    return (
        <div>

            {

                (state.user === null) ?
                    <div> Loading... </div>
                    :
                    <div className="profileMain">
                        <div className="profileDiv">
                            <div className="userHead">
                                <h2><i>User Details</i></h2>
                            </div>
                            <br />

                            <div className="profileInput">
                                <h4>First Name </h4>{" "}
                                <input
                                    className="profileField"
                                    type="text"
                                    value={fname}
                                    onChange={(event) => setfName(event.target.value)}
                                />
                            </div>
                            <br />
                            <div className="profileInput">
                                {" "}
                                <h4>Last Name </h4>{" "}
                                <input
                                    className="profileField"
                                    type="text"
                                    value={lname}
                                    onChange={(event) => setlName(event.target.value)}
                                />{" "}
                            </div>
                            <br />
                            <div className="profileInput">
                                {" "}
                                <h4>Email </h4>
                                <input
                                    className="profileField"
                                    type="text"
                                    value={state.user?.email}
                                    disabled
                                />
                            </div>
                            <br />
                            <div className="profileInput">
                                {" "}
                                <h4>Gender </h4>{" "}
                                <input
                                    className="profileField"
                                    type="text"
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
                                />
                            </div>
                            <br />
                            <div className="profileInput">
                                {" "}
                                <h4>Address </h4>{" "}
                                <input
                                    className="profileField"
                                    type="text"
                                    value={address}
                                    onChange={(event) => setAddress(event.target.value)}
                                />
                            </div>
                            <br />
                            <div className="profilebtnDiv">
                                <button className="profileUpdate" onClick={updateHandler}>Update</button>
                            </div>
                        </div>
                    </div>
            }

        </div>
    );
}

export default Profile