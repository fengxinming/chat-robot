import joinClassName from 'classnames';
import {
  createElement,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';

import { ChatRobotProvider } from './context';
import { ChatRobotInstance } from './Instance';
import { MessageList } from './Message';
import { ChatRobotEvent, ChatRobotProps } from './typings';

function ChatRobot({ messageMode, className, startTime, children }: ChatRobotProps, ref: Ref<ChatRobotInstance>) {
  const el = useRef<HTMLDivElement>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const chatRobot = useMemo(() => new ChatRobotInstance(), []);

  useImperativeHandle(ref, () => {
    chatRobot.el = el.current as HTMLDivElement;
    return chatRobot;
  });

  useEffect(() => {
    const onScroll = (e: ChatRobotEvent) => {
      const el = chatBox.current;
      if (el) {
        let offset = e.data;
        switch (offset) {
          case 'bottom':
            offset = el.scrollHeight;
            break;
          case 'top':
            offset = 0;
            break;
          case 'middle':
            offset = el.scrollHeight / 2;
            break;
        }
        el.scrollTop = offset;
      }
    };

    chatRobot.on('scroll', onScroll);

    return () => {
      chatRobot.emit('dispose');
      chatRobot.removeAllListeners();
    };
  }, [chatRobot]);

  className = joinClassName(
    'cr-widget',
    messageMode ? `__animation-${messageMode}` : null,
    className
  );

  return createElement('div', { className, ref: el },
    createElement('div', { className: 'cr-widget-box', ref: chatBox },
      startTime && createElement('div', {
        className: 'cr-widget-box-time'
      }, null, startTime),
      createElement(MessageList, { chatRobot })),
    createElement(ChatRobotProvider, { value: chatRobot },
      children
    )
  );
}

const ChatRobotWrapper = forwardRef(ChatRobot);

export { ChatRobotWrapper as ChatRobot };
