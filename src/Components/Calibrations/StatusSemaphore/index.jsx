import React from 'react';
import PropTypes from 'prop-types';
import { FaTruck, FaClipboardCheck, FaClipboardList, FaBell, FaWrench, FaShippingFast } from 'react-icons/fa';
import './StatusSemaphore.css';

const StatusSemaphore = ({ status }) => {
    const activities = [
        { name: 'Arribo', icon: <FaTruck /> },
        { name: 'O.S.', icon: <FaClipboardCheck /> },
        { name: 'Condiciones Fis.', icon: <FaClipboardList /> },
        { name: 'Notificacion llegada', icon: <FaBell /> },
        { name: 'Calibración', icon: <FaWrench /> },
        { name: 'Envio', icon: <FaShippingFast /> }
    ];

    return (
        <div className="status-semaphore">
            {activities.map((activity, index) => (
                <div key={index} className="status-item">
                    <div className={`icon ${status[activity.name] ? 'completed' : 'pending'}`}>
                        {activity.icon}
                    </div>
                    <span>{activity.name}</span>
                </div>
            ))}
        </div>
    );
};

StatusSemaphore.propTypes = {
    status: PropTypes.shape({
        'Arribo': PropTypes.bool,
        'O.S.': PropTypes.bool,
        'Condiciones Fis.': PropTypes.bool,
        'Notificacion llegada': PropTypes.bool,
        'Calibración': PropTypes.bool,
        'Envio': PropTypes.bool
    }).isRequired
};

export default StatusSemaphore;