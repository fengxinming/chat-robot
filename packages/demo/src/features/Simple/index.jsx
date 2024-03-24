
import { ChatRobot, InputBox } from 'chat-robot';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.scss';

export default function () {
  const ref = useRef();
  const [startTime, setStartTime] = useState('');
  useEffect(() => {
    setStartTime(moment().format('MM-DD HH:mm:ss'));

    const chatRobot  = ref.current;
    const prompt = () => {
      chatRobot.output('请问 1 + 1 = ?');
    };
    const error = () => {
      chatRobot.output('回答错误。');
    };
    const ok = () => {
      chatRobot.output('回答正确。');
    };

    chatRobot.on('input', ({ children }) => {
      if (+children !== 2) {
        error();
        prompt();
      }
      else {
        ok();
      }
    });

    prompt();
  }, []);

  return (
    <div className={styles.layout}>
      <ChatRobot
        ref={ref}
        messageMode="incoming"
        startTime={startTime}
      >
        <InputBox />
      </ChatRobot>
    </div>
  );
}
