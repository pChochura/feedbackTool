import React, { useState, useCallback } from 'react';
import './style.css';
import { useCookies } from 'react-cookie';

const Add = ({ history }) => {
    const [cookie, setCookie] = useCookies('seed');
    const [seed] = useState(Math.random().toString(36).slice(2));
    const [name, setName] = useState('');

    const join = useCallback(async () => {
        const room = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                seed: cookie || seed,
                name
            }),
            headers: { 'Content-Type': 'application/json' },
        })).json();

        setCookie('seed', cookie || seed);
        history.push(`/room/${room.id}`);
    }, [history, seed, cookie, setCookie, name]);

    return (
        <div className="card">
            <p className="title">Type your name!</p>
            <input type="text" className="input" autoFocus onChange={(e) => setName(e.target.value)} onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    join();
                }
            }} />
            <button className="button submitBtn" onClick={() => join()}>Join</button>
        </div>
    )
}

export default Add