import { Emitter } from 'eemitt';
import { ReactNode } from 'react';

export class ChatRobotInstance extends Emitter {
  el: HTMLDivElement | null = null;
  disabled: boolean = false;

  input!: (data: ReactNode | ReactNode[], options?: {[key: string]: any}) => void;
  output!: (data: ReactNode | ReactNode[], options?: {[key: string]: any}) => void;
  scroll!: (data: number | 'bottom' | 'top' | 'middle', options?: {[key: string]: any}) => void;
  disable!: (data: boolean, options?: {[key: string]: any}) => void;

  constructor() {
    super();

    this.on('disable', (evt) => {
      if (evt.data === this.disabled) {
        evt.stopImmediatePropagation();
      }
      else {
        this.disabled = evt.data;
      }
    });

    this.on('input', function (this: ChatRobotInstance, evt) {
      if (this.disabled) {
        evt.stopImmediatePropagation();
      }
    });
  }

  clear(options?: {[key: string]: any}): void {
    this.emit(Object.assign({
      type: 'clear'
    }, options));
  }
}

['input', 'output', 'clear', 'scroll', 'disable'].forEach((eventName) => {
  ChatRobotInstance.prototype[eventName] = function (data: any, options: any): void {
    this.emit(Object.assign({
      type: eventName,
      data
    }, options));
  };
});
// ['clear'].forEach((eventName) => {
//   ChatRobotInstance.prototype[eventName] = function (options?: any) {
//     this.emit(Object.assign({
//       type: eventName
//     }, options));
//   };
// });
