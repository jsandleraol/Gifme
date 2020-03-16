import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {slide as Menu} from "react-burger-menu";
import logo3 from '../../resources/gifme_logo_3.png';
import camera_icon from '../../resources/camera_icon_white.png'
import fetchAuth from '../../utils/FetchAuth';

const Navbar = () =>{
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetchAuth().then(res => {
          if (res) {
            setLoggedIn(true);
          }
        });
      }, []);

    //  scroll to top does not work
    const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
        }

    return(
        <div>
        <div className="header_absolute">
                	<div className="container-l">
                    	<Link className="navbar_logo" to="/" onClick={scrollToTop()}>
                            <img src={logo3} className="gifme_logo" alt="logo"/>
                        </Link>
                	</div>
                	<div className="container-m"></div>
                	<div className="container-r">
                    	<NavbarLogin loggedIn={loggedIn}/>
                    </div>
            </div>
        <div className="header_relative">
            <div className="container_camera_icon">
                {loggedIn ? 
                <Link className="photobooth_link" to="/photobooth">
                    <img className="camera_icon" src={camera_icon} alt="photobooth"></img>
                </Link>
                : null}
            </div>
            <div className="container-r-relative">
            </div>
        </div>
        </div>
    );
}


const NavbarLogin = () => {
    const [menuState, setMenuState] = useState(true)
    
    const openMenu = () =>{setMenuState(false)}
    return(
        <div>
            <Link to='/PhotoBooth' className="temporal_link">Take a Photo</Link>
            <Menu noOverlay isOpen={menuState} onStateChange={openMenu}>
                <Link to='/Account' onClick={openMenu}>Account</Link>
                <Link to='/MyPosts' onClick={openMenu}>My posts</Link>
                <Link to='/likes' onClick={openMenu}>Favorite posts</Link>
                <Link to='/settings' onClick={openMenu}>Settings</Link>
                <SwitchPrivacy/>       
            </Menu>
        </div>
    )
}

const SwitchPrivacy= () =>{
    const V_Token = localStorage.getItem('myToken');

    const deleteToken = () =>{
        localStorage.removeItem('myToken');
        localStorage.removeItem('myGifmeUserID');
        window.location.href = '/';
    }
    if (V_Token){ 
        return(
        <div>
            <Link className="bm-item" onClick={deleteToken}>Log out</Link>
        </div>
    )} 
    else {
        return (
        <div>
            <Link to='/Login' className="bm-item">Log in</Link>
        </div>
    )}
}

export default Navbar;