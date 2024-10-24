import React from 'react';

const Popover = ({ message, type, onClose }) => {
    const getClassName = () => {
        switch (type) {
            case 'success':
                return 'popover success show';
            case 'error':
                return 'popover error show';
            default:
                return 'popover';
        }
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}></div>
            <div className={getClassName()}>
                <span>{message}</span>
                <button onClick={onClose} className="close-button">×</button>
            </div>
        </>
    );
};

export default Popover;
