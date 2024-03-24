import { createContext, useContext } from 'react';

import { ChatRobotInstance } from './Instance';

export const context = createContext(new ChatRobotInstance());

export function useChatRobot(): ChatRobotInstance {
  return useContext(context);
}

export const ChatRobotProvider = context.Provider;
export const ChatRobotConsumer = context.Consumer;
