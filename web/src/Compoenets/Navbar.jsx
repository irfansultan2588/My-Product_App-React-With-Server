import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from '../Context';
import axios from "axios"


const Navbar = () => {

    let { state, dispatch } = useContext(GlobalContext);


    const logouthandler = async () => {

        try {
            let response = await axios.post(`${state.baseUrl}/logout`, {},

                {
                    withCredentials: true
                })
            console.log("response", response.data);

            dispatch({ type: "USER_LOGOUT", })


        } catch (e) {
            console.log("Error in api", e);

        }

    }


    return <>
        <nav className='nav_2'>
            <div className="userName"> {state?.user?.firstName} {state?.user?.lastName}</div>



            {(state.isLogin === true) ?
                <ul>
                    <li><Link to="/Createproducts">Create Products</Link> </li>
                    <li><Link to="/">Products</Link> </li>
                    <li><Link to="/Profile">Profile</Link> </li>
                    <li><Link to="/login" onClick={logouthandler}>Logout</Link></li>
                </ul>
                :
                null
            }

            {(state.isLogin === false) ?

                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                </ul>
                :
                null
            }
        </nav>
    </>
}

export default Navbar