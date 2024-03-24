import joinClassName from 'classnames';
import ResizeObserver from 'dom-resize-observer';
import { createElement, Fragment, memo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { ChatRobotProvider } from './context';
import { ChatRobotEvent, MessageListProps, MessageProps } from './typings';

function createChild(parent: Element, tag: string, props: any): Element {
  const item = parent.appendChild(document.createElement(tag));
  Object.entries(props).forEach(([key, value]) => {
    item[key] = value;
  });
  return item;
}

function renderMessage(
  messageProps: MessageProps,
  parent: Element,
  isInput?: boolean
): void {
  const item = createChild(parent, 'div', {
    className: joinClassName('cr-widget-box-list-item', isInput ? '__item-input' : null)
  });
  ReactDOM.render(
    createElement(Fragment, null,
      createElement('span', { className: 'cr-widget-avatar' }),
      createElement('div', { className: 'cr-widget-message' },
        createElement(ChatRobotProvider, { value: messageProps.chatRobot }, messageProps.children)
      ),
    ),
    item
  );
}

export const MessageList = memo(({ chatRobot }: MessageListProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onInput = (e: ChatRobotEvent) => {
      // 渲染输入的消息
      renderMessage(
        {
          chatRobot,
          children: e.data
        },
        ref.current as Element,
        true
      );
    };
    const onOutput = (e: ChatRobotEvent) => {
      // 渲染输出的消息
      renderMessage(
        {
          chatRobot,
          children: e.data
        },
        ref.current as Element
      );
    };
    const unmount = () => {
      const parentEl = ref.current;
      if (parentEl) {
        let firstChild: ChildNode | null = null;
        while ((firstChild = parentEl.firstChild)) {
          ReactDOM.unmountComponentAtNode(firstChild as Element);
          parentEl.removeChild(firstChild);
        }
      }
    };
    chatRobot.on('clear', unmount);
    chatRobot.on('input', onInput);
    chatRobot.on('output', onOutput);

    return () => {
      unmount();
      chatRobot.off('clear', unmount);
      chatRobot.off('input', onInput);
      chatRobot.off('output', onOutput);
    };
  }, [chatRobot]);

  useEffect(() => {
    const boxListEl = ref.current as HTMLDivElement;
    let lastRect: DOMRect = boxListEl.getBoundingClientRect();
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((n) => n.target === boxListEl);
      if (entry) {
        const { contentRect } = entry;
        if (Math.round(contentRect.height) !== Math.round(lastRect.height)) {
          lastRect = contentRect;
          chatRobot.scroll('bottom');
        }
      }
    });

    resizeObserver.observe(boxListEl);
    return () => {
      resizeObserver.disconnect();
    };
  }, [chatRobot]);

  return createElement('div', {
    className: 'cr-widget-box-list',
    ref
  });
});
