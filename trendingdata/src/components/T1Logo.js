import React from 'react';
import T1LogoImage from '../images/T1_Logo.jpg';

const T1Logo= () => {

    return (

        <img
            src={T1LogoImage}
            alt="Picture of T1 Logo"
            style={{
        width: '200px',
        height: 'auto',
                opacity: 0,
                transition: 'opacity 6s ease-in-out',
        }}
            onLoad={(e) => {
            e.target.style.opacity = 1;
        }}
        />
    );
};
export default T1Logo;



