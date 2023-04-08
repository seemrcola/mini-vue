import { track, trigger } from './effect'

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
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
