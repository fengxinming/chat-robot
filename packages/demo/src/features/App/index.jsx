import { Breadcrumb, Button } from '@alicloud/console-components';
import { ChatRobot, InputBox, useChatRobot } from 'chat-robot';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';

import styles from './index.module.scss';
import { Message, PromptStart } from './Messages';

function Header() {
  const chatRobot = useChatRobot();
  const handleReset = () => {
    // 清空对话框的消息节点
    chatRobot.clear();
  };

  return (
    <header className={styles.header}>
      <Breadcrumb className={styles.breadcrumb} separator="/">
        <Breadcrumb.Item link="">物联网平台</Breadcrumb.Item>
        <Breadcrumb.Item link="">iot-060a0d1z</Breadcrumb.Item>
        <Breadcrumb.Item link="">聊天机器人</Breadcrumb.Item>
      </Breadcrumb>
      <h1>聊天机器人<Button onClick={handleReset}>重置对话</Button></h1>
    </header>
  );
}

const startTime = moment().format('MM-DD HH:mm:ss');
export default function App() {
  const ref = useRef();
  useEffect(() => {
    const chatRobot  = ref.current;
    chatRobot.on('input', (evt) => {
      chatRobot.output(<Message {...evt} />);
    });
    const onClear = () => {
      chatRobot.output(<PromptStart />);
    };
    chatRobot.on('clear', onClear);

    onClear();
  }, []);

  return (
    <div className={styles.layout}>
      <ChatRobot ref={ref} className={styles['chat-robot']} startTime={startTime}>
        <Header />
        <InputBox className={styles['chat-input-box']} />
      </ChatRobot>
    </div>
  );
}
