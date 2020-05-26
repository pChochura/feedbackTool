import React, { useState, useEffect } from 'react';
import moment from 'moment';
import waitImg from '../../assets/images/wait.svg';
import { useCookies } from 'react-cookie';
import './style.css';

const Root = () => {
    const [locked, setLocked] = useState(false);
    const [link, setLink] = useState('');
    const [date, setDate] = useState('');
    const [cookies, setCookie] = useCookies(['seed']);
    const [seed] = useState(Math.random().toString(36).slice(2));

    useEffect(() => {
        const getData = async () => {
            let mainPage;
            mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`)).json();
    
            if (mainPage.locked) {
                setLocked(true);
                setDate(`${moment.unix(mainPage.expirationTimestamp).format('HH:mm:ss')}`);
            } else {
                mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`, {
                    method: 'POST',
                    body: JSON.stringify({
                        seed,
                    }),
                    headers: { 'Content-Type': 'application/json'},
                })).json();
                setLocked(false);
                setLink(`${window.location.href}${mainPage.id}`);
            }
        }

        getData();
    }, [seed]);

    return(
        <div className="container">
            <h1 className="title">Feedback tool</h1>
            <p className="subtitle">It's a simple tool to help your team share feedback anonymously</p>
            <div className="card">
                {locked ?
                    <>
                        <p className="title">Sorry, this session is occupied</p>
                        <p className="subtitle">You have to wait up to {date}</p>
                        <img src={waitImg} alt="Wait!"></img>
                    </>
                    :
                    <>
                        <p className="title">Generated a new session</p>
                        <a className="link" href={link} onClick={() => {
                            setCookie('seed', seed, { maxAge: 60 * 60 }, { path: '/' });
                        }}>{link}</a>
                    </>
                }
            </div>
        </div>
    );
};

export default Root;