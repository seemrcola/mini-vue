import { mutableHanlders, readonlyHanlders } from './handlers'
import { ReactiveFlags } from './enums'
/**
 * @param raw  接受一个对象 给这个对象设置traps来处理收集和触发操作
 * @returns
 */
export function reactive(raw: { [key: string]: any }) {
  return createActiveObject(raw, mutableHanlders)
}

export function readonly(raw: { [key: string]: any }) {
  return createActiveObject(raw, readonlyHanlders)
}

export function createActiveObject(
  raw: { [key: string]: any },
  baseHanlders: { [key: string]: any },
) {
  return new Proxy(raw, baseHanlders)
}

// 用来判断一个对象是不是reactive模式
export function isReactive(obj: { [key: string]: any }) {
  // 一个非proxy代理的对象这时候会返回 undefined 因为读取不到这个属性 也不回走getter
  // 所以这里做个处理
  return Boolean(obj[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(obj: { [key: string]: any }) {
  return Boolean(obj[ReactiveFlags.IS_READONLY])
}
