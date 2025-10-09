export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  type: ToastType;
  text: string;
}
