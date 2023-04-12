import { isObject } from '../../share'
import { track, trigger } from './effect'
import { ReactiveFlags } from './enums'
import { reactive, readonly } from './reactive'

function createGetter(isReadonly = false) {
  return function get(target, key) {
    // 当我们是想读取is_reactive的时候 直接return一个结果就行
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly
    // 当我们是想读取is_readonly的时候 直接return一个结果就行
    if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    const res = Reflect.get(target, key)
    // 默认深度监听
    if (isObject(res))
      return isReadonly ? readonly(res) : reactive(res)

    if (!isReadonly)
      track(target, key)
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

// 避免多次创建getter和setter
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutableHanlders = {
  get,
  set,
}

export const readonlyHanlders = {
  get: readonlyGet,
  set: function set(target, key) {
    console.warn(`[Vue warn] object is readonly, key: ${key} set failed, traget is ${target}`)
    return true
  },
}
