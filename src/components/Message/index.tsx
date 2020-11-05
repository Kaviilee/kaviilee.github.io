import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Message from './message';
import { MessageType, MessageApi } from './index.d';

import styles from './index.less'

// type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right' | 'slide-in-top'

export interface Notice {
    text: string;
    key: string;
    type: MessageType;
}

let uid = 0
const now = Date.now()
const getUuid = (): string => {
    const id = uid;
    uid += 1
    return `MESSAGE_${now}_${id}`
}

let add: (notice: Notice) => void


export const MessageContainer = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const duration = 3000;
    const max = 10;
    const remove = (notice: Notice) => {
        const {key} = notice;

        setNotices((prevNotices) => {
            return prevNotices.filter(({ key: noticeKey }) => key !== noticeKey);
        })
    }

    add = (notice: Notice) => {
        setNotices((prevNotices) => [...prevNotices, notice]);

        setTimeout(() => {
            remove(notice)
        }, duration);
    }

    useEffect(() => {
        console.log(notices)
        if (notices.length > max) {
            const [first] = notices;
            remove(first)
        }
    }, [notices])

    return (
        <div className={styles.messageContainer}>
            <TransitionGroup>
                {
                    notices.map(({ text, key, type }) => (
                        <CSSTransition
                            timeout={200}
                            classNames="slide-in-top"
                            key={key}
                            >
                            <Message type={type} text={text} />
                        </CSSTransition>
                    ))
                }
            </TransitionGroup>
        </div>
    )
}

let el = document.querySelector('#message-wrapper');
if (!el) {
    el = document.createElement('div');
    el.className = 'message-wrapper';
    el.id = 'message-wrapper';
    document.body.append(el)
}

ReactDOM.render(
    <MessageContainer></MessageContainer>,
    el
)

const api: MessageApi = {
    info: (text) => {
        // console.log(text)
        add({
            text,
            key: getUuid(),
            type: 'info'
        })
    },
    success: (text) => {
      add({
        text,
        key: getUuid(),
        type: 'success'
      })
    },
    warn: (text) => {
      add({
        text,
        key: getUuid(),
        type: 'warn'
      })
    },
    error: (text) => {
      add({
        text,
        key: getUuid(),
        type: 'error'
      })
    }
}

export default api;
