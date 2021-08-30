import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes, forwardRef, ForwardRefRenderFunction } from "react";

export interface FlowMetadata {
  clients: string[];
  name: string;
  tags: string[];
}

export interface FlowHandle<T extends object> {
  onSerialize: () => string | undefined
  onDeserialize: (data?: string) => T
  onCompile: () => string
  onExecute: () => void
}

export interface FlowProps<T extends object> {
  isRunning: boolean
  data?: T
  clients: string[];
  onPop: () => void
  onUpdate: (data: T) => void
  onPlay: () => void
}

export type FlowForwardRef<T extends object> = ForwardRefRenderFunction<FlowHandle<T>, FlowProps<T>>

export const flow: <T extends object>(render: FlowForwardRef<T>) => ForwardRefExoticComponent<PropsWithoutRef<FlowProps<T>> & RefAttributes<FlowHandle<T>>> = (render) => {
  return forwardRef(render)
}
