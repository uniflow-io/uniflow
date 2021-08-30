import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes, forwardRef, ForwardRefRenderFunction } from "react";

export interface FlowMetadata {
  clients: string[];
  name: string;
  tags: string[];
}

export interface FlowHandle<T> {
  onSerialize: () => string | undefined
  onDeserialize: (data?: string) => T
  onCompile: () => string
  onExecute: () => void
}

export interface FlowProps<T> {
  isRunning: boolean
  data: T
  clients: string[];
  onPop: () => void
  onUpdate: (data: T) => void
  onPlay: () => void
}

export type FlowForwardRef<T> = ForwardRefRenderFunction<FlowHandle<T>, FlowProps<T>>

export const flow: <T>(render: FlowForwardRef<T>) => ForwardRefExoticComponent<PropsWithoutRef<FlowProps<T>> & RefAttributes<FlowHandle<T>>> = (render) => {
  return forwardRef(render)
}
