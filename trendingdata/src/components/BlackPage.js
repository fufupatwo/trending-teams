import React from 'react';

const BlackPage = ({ children }) => {
    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    );
};

export default BlackPage;
