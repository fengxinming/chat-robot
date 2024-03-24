import { Button, Icon, Upload } from '@alicloud/console-components';
import { useChatRobot } from 'chat-robot';
import { useEffect, useState } from 'react';

import { formatByteSize, openLink } from '../../util';
import styles from './index.module.scss';

function createAttachment(fileName, fileSize) {
  return (
    <div className={styles.attachment}>
      <Icon type="paperclip" size="xs" />
      <label>{fileName}</label>
      {fileSize ? <em>（{formatByteSize(fileSize)}）</em> : null}
    </div>
  );
}

export function createPrompt({ title, error, children }) {
  return (
    <div className={styles.prompt}>
      {error && <label>{error}</label>}
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function createPromptList({ title, error, items, onItemClick }) {
  return createPrompt({
    title,
    error,
    children: (
      <dl>
        <dt>您可以这样提问：</dt>
        {items
          && items.map((item) => (
            <dd key={item}>
              {'· '}
              <Button type="primary" text onClick={(e) => onItemClick(item, e)}>
                {item}
              </Button>
            </dd>
          ))}
      </dl>
    )
  });
}

function createProgress({ title, buttonText, onClick }) {
  return createPrompt({
    title,
    children: buttonText ? (
      <p className={styles['prompt-buttons']}>
        <Icon type="stop" size="xs" />
        <Button type="primary" text onClick={onClick}>
          {buttonText}
        </Button>
      </p>
    ) : null
  });
}

// 初始化协议
export const messageTypes = [
  '普通消息',
  '列表消息',
  '进度消息',
  '上传消息'
];

export function PromptStart() {
  const chatRobot = useChatRobot();
  return createPromptList({
    title: '请问您需要生成哪种类型的消息？',
    items: messageTypes,
    onItemClick(text) {
      chatRobot.input(text);
    }
  });
}

export function PromptProtocols() {
  const chatRobot = useChatRobot();
  return createPromptList({
    title: '请问您需要生成哪个协议的代码？',
    items: [
      'GB/T 32960',
      'JT/T 808',
      'LowPowerSensor',
      'DN40'
    ],
    onItemClick(text) {
      chatRobot.input(text);
    }
  });
}

export function PromptQuery() {
  const [status, setStatus] = useState(0);
  const chatRobot = useChatRobot();

  useEffect(() => {
    chatRobot.disable(true);
    const timer = setTimeout(() => {
      setStatus((prev) => {
        chatRobot.disable(false);
        return prev === -1 ? prev : 1;
      });
    }, Math.random().toFixed(1) * 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [chatRobot]);

  const handleStop = () => {
    setStatus(-1);
  };

  switch (status) {
    case 0:
      return createProgress({
        title: '正在查询，请稍候...',
        buttonText: '停止查询',
        onClick: handleStop
      });
    case 1:
      return <PromptProtocols />;
    case -1:
      return createPrompt({ title: '已停止查询。' });
  }
}

export function UploadFile({ error }) {
  const chatRobot = useChatRobot();

  const afterSelect = () => {
    return false;
  };
  const handleDownload = () => {
    openLink(
      'https://linkkit-export.oss-cn-shanghai.aliyuncs.com/protocol_plugin/user_defined_protocol.md',
      { target: '_blank', download: 'virtual_protocol.md' },
    );
  };
  const handleSelect = ([file]) => {
    chatRobot.input(createAttachment(file.name, file.size));
  };
  return createPrompt({
    title: '请您按照协议模板上传自定义协议的说明文档。',
    error,
    children: (
      <p className={styles['prompt-upload']}>
        <Upload
          action=""
          data={{}}
          value={[]}
          withCredentials={false}
          autoUpload={false}
          afterSelect={afterSelect}
          onSelect={handleSelect}
        >
          <Button>
            <Icon type="upload" />
            上传文件
          </Button>
        </Upload>
        <Button type="primary" text onClick={handleDownload}>
          下载模板
        </Button>
      </p>
    )
  });
}

export function Message({ data }) {
  let outputMessage;
  switch (messageTypes.indexOf(data)) {
    case 0:
      outputMessage = createPrompt({ title: data });
      break;
    case 1:
      outputMessage = <PromptProtocols />;
      break;
    case 2:
      outputMessage = <PromptQuery />;
      break;
    case 3:
      outputMessage = <UploadFile />;
      break;
    default:
      outputMessage = createPrompt({ title: '抱歉，该提问不在服务范围。' });
  }
  return outputMessage;
}
