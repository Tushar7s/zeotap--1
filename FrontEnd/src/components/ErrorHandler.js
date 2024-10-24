import React, { useImperativeHandle, useState, forwardRef } from 'react';
import Popover from './Popover'; // Import the Popover component

const ErrorHandler = forwardRef((props, ref) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState(''); // 'success' or 'error'
    const [visible, setVisible] = useState(false); // Track visibility of the popover

    useImperativeHandle(ref, () => ({
        showError(msg) {
            setMessage(msg);
            setType('error');
            setVisible(true);
            setTimeout(() => setVisible(false), 3000); // Clear message after 3 seconds
        },
        showSuccess(msg) {
            setMessage(msg);
            setType('success');
            setVisible(true);
            setTimeout(() => setVisible(false), 3000); // Clear message after 3 seconds
        },
    }));

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <div>
            {visible && <Popover message={message} type={type} onClose={handleClose} />}
        </div>
    );
});

export default ErrorHandler;
