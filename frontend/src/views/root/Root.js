import React, { useState, useEffect } from 'react'
import './style.css'

const Root = () => {

    const [locked, setLocked] = useState(false)
    const [link, setLink] = useState('')
    const [date, setDate] = useState('')

    const getData = async () => {
        let mainPage;
        mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`)).json()
        console.log(mainPage);

        if (mainPage.locked) {
            const date = new Date(mainPage.expirationTimestamp * 1000);
            const hours =
                date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            const minutes =
                date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            const seconds =
                date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            setLocked(true)
            setDate(`${hours}:${minutes}:${seconds}`)
            //return;
        } else {
            mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`, { method: 'POST' })).json();
            setLocked(false)
            setLink(`${window.location.href}${mainPage.id}`)
        }
    }

    useEffect(() => {
        getData()
    }, [])


    return(
        <div className="container">
            <h1 className="title">Feedback tool</h1>
            <p className="subtitle">It's a simple tool to help your team share feedback anonymously</p>
            <div className="card">
                {locked ?
                    <>
                        <p className="title">Sorry, this session is occupied</p>
                        <p className="subtitle">You have to wait up to {date}</p>
                        <img src="public/wait.svg" alt="Wait!"></img>
                    </>
                    :
                    <>
                        <p className="title">Generated a new session</p>
                        <a className="link" href={link}>{link}</a>
                    </>
                }
            </div>
        </div>
    )
}

export default Root