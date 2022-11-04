import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from '../Context';
import axios from "axios"
import { styled } from '@mui/material/styles';
import images from '../assets/img.png'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge } from "@mui/material";





///////navber/////////
const NavbarComponent = () => {

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
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        position: 'absolute',

    }));

    return <>

        <Navbar bg="#fff" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#"> <img src={images} alt="logo" className="img_logo" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2 inpsearch"
                            aria-label="Search"

                        />
                        <Button className="btn33" >Search</Button>
                    </Form>
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >

                        {(state.isLogin === true) ?
                            <>

                                <Badge badgeContent={state?.addcart?.length} sx={{
                                    "& .MuiBadge-badge": {
                                        color: "#fff",
                                        backgroundColor: "#f85606 !important"
                                    }
                                }}>
                                    <Nav.Link> <Link to="AddToCart"><button className="nav-icons"> <ShoppingCartIcon /></button></Link> </Nav.Link>
                                </Badge>
                                <Nav.Link> <Link to="/"> <button className="navBtn">My Products</button></Link> </Nav.Link>
                                <Nav.Link> <Link to="/Createproducts"><button className="navBtn">CreateProducts</button></Link></Nav.Link>
                                <Nav.Link> <Link to="/product"><button className="navBtn">Products</button></Link> </Nav.Link>
                                <Nav.Link> <Link to="/MyOrder"><button className="navBtn">MyOrder</button></Link> </Nav.Link>
                                <Nav.Link> <Link to="/Profile"><button className="navBtn">Profile</button></Link> </Nav.Link>
                                <Nav.Link> <Link to="/" onClick={logouthandler}><button className="navBtn">Logout</button></Link> </Nav.Link>

                            </>
                            :
                            null
                        }

                        {(state.isLogin === false) ?

                            <>

                                <Badge badgeContent={state?.addcart?.length} sx={{
                                    "& .MuiBadge-badge": {
                                        color: "#fff",
                                        backgroundColor: "#f85606 !important"
                                    }
                                }}>
                                    <Nav.Link> <Link to="AddToCart"><button className="nav-icons"> <ShoppingCartIcon /></button></Link> </Nav.Link>
                                </Badge>
                                <Nav.Link> <Link to="/login"> <button className="navBtn"> Login</button></Link> </Nav.Link>
                                <Nav.Link>  <Link to="/signup"><button className="navBtn">Signup</button></Link> </Nav.Link>
                            </>
                            :
                            null
                        }
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default NavbarComponent