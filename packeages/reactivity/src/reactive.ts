import { track, trigger } from './effect'

/**
 * @param raw  接受一个对象 给这个对象设置traps来处理收集和触发操作
 * @returns
 */
export function reactive(raw: { [key: string]: any }) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)

      track(target, key)
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)

      trigger(target, key)
      return res
    },
  })
}
