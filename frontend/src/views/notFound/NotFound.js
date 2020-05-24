import React from 'react';
import './style.css';
import NotFoundImg from '../../assets/images/notFound.svg'

const NotFound = () => {
    return(
        <div className="card">
            <p className="title">Sorry, there's nothing here</p>
            <img src={NotFoundImg} alt="Not found" />
	    </div>
    )
}

export default NotFound