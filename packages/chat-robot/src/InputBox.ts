import joinClassName from 'classnames';
import { ChangeEvent, createElement, KeyboardEvent, memo, useEffect, useRef, useState } from 'react';
import { __rest } from 'tslib';

import { useChatRobot } from './context';
import { ChatRobotEvent, InputBoxProps } from './typings';

function initMessage(text: string) {
  return { text: text, trim: text.trim() };
}

export const InputBox = memo<InputBoxProps>((props) => {
  const { disabled, value, onChange, onKeyUp } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const chatRobot = useChatRobot();
  const [message, setMessage] = useState(initMessage(value ?? ''));
  const [inputDisabled, setDisabled] = useState(chatRobot.disabled);

  useEffect(() => {
    const onDisable = ({ data }: ChatRobotEvent) => {
      data = !!data;
      setDisabled(data);

      // 重新激活后，光标聚焦到文本框
      if (!data) {
        const input = inputRef.current as HTMLInputElement;
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    };
    chatRobot.on('disable', onDisable);

    return () => {
      chatRobot.off('disable', onDisable);
    };
  }, [chatRobot]);

  useEffect(() => {
    setMessage(initMessage(value ?? ''));
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(initMessage(e.target.value));
    onChange && onChange(e);
  };

  const send = () => {
    // 组件禁用状态
    if (disabled) {
      return;
    }

    // 文本框禁用状态
    if (inputDisabled) {
      return;
    }

    const msg = message.trim;
    // 空白内容情况
    if (!msg) {
      return;
    }

    chatRobot.input(message.text, { value: msg });
    setMessage(initMessage(''));
  };
  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      send();
    }
    onKeyUp && onKeyUp(e);
  };

  const restProps = __rest(props, [
    'disabled',
    'chatRobot',
    'value',
    'onChange',
    'onKeyUp',
    'className',
    'placeholder',
    'startTime'
  ]);

  restProps.placeholder = props.placeholder || '请输入您要查询的内容';
  restProps.disabled = disabled || inputDisabled;
  restProps.onChange = handleChange;
  restProps.onKeyUp = handleKeyUp;
  restProps.value = message.text;
  restProps.ref = inputRef;

  return createElement('div',
    {
      className: joinClassName('cr-widget-input-box', props.className)
    },
    createElement('input', restProps),
    createElement('button', {
      disabled: disabled || inputDisabled || !message.trim,
      onClick: send
    }));
});
