import { describe, expect, it, vitest } from 'vitest'
import { isReadonly, reactive, readonly, shallowReadonly } from '../src/reactive'
import { effect } from '../src/effect'

describe('响应式测试', () => {
  it('happy path', () => {
    const original = { a: 100 }
    const obj = reactive(original)
    const read = readonly(obj)
    expect(read).not.toBe(obj)
    expect(obj.a).toBe(100)
    expect(isReadonly(read)).toBe(true)
    expect(isReadonly(original)).toBe(false)
  })

  it('readonly 警告', () => {
    console.warn = vitest.fn()
    const read = readonly({ a: 100 })
    read.a = 200 // 触发set
    expect(console.warn).toBeCalled()
  })

  it('readonly嵌套', () => {
    const outer = {
      name: 1,
      inner: {
        name: 100,
      },
    }
    const data = readonly(outer)
    expect(isReadonly(data)).toBe(true)
    expect(isReadonly(data.inner)).toBe(true)
  })

  it('shallow reactive', () => {
    const outer = {
      name: 1,
      inner: {
        name: 100,
      },
    }
    const data = shallowReadonly(outer)
    let x, y
    const runner = effect(() => {
      x = data.name
      y = data.inner.name
    })
    data.name = 'seemr'
    data.inner.name = 'cola'
    expect(x).toBe(1)
    expect(y).toBe(100)
  })
})
