import { mutableHanlders, readonlyHanlders } from './handlers'

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
