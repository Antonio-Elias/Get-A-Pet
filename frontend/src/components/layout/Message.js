import { useState } from 'react';
import bus from '../../utils/bus';
import { useEffect } from 'react';

import styles from './Message.module.css'

function Message(){
    const [visibility, setVisibility ] = useState(false);
    const [message, setmessage] = useState('');
    const [type, setType] = useState('');

    useEffect(() =>{
        bus.addListener('flash', ({message, type}) =>{
            setVisibility(true);
            setmessage(message);
            setType(type);

            setTimeout(() =>{
                setVisibility(false)
            }, 3000)
        })
    },[])

    return(
        visibility && (
            <div className={`${styles.message} ${styles[type]}`}>{message}</div>
        )
    )
}

export default Message;