import { EEvent } from 'eemitt';
import { InputHTMLAttributes, ReactNode } from 'react';

import { ChatRobotInstance } from './Instance';

export interface ChatRobotProps {
  startTime?: string;
  className?: any;
  messageMode?: 'incoming';
  children?: ReactNode | ReactNode[];
}

export interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
}

export interface MessageListProps {
  chatRobot: ChatRobotInstance;
}

export interface MessageProps {
  chatRobot: ChatRobotInstance;
  children?: ReactNode[];
}

export type ChatRobotEvent = EEvent;
