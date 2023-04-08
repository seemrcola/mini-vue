import { describe, expect, it, vitest } from 'vitest'
import { reactive, readonly } from '../src/reactive'

describe('响应式测试', () => {
  it('happy path', () => {
    const obj = reactive({ a: 100 })
    const read = readonly(obj)
    expect(read).not.toBe(obj)
    expect(obj.a).toBe(100)
  })

  it('readonly 警告', () => {
    console.warn = vitest.fn()
    const read = readonly({ a: 100 })
    read.a = 200 // 触发set
    expect(console.warn).toBeCalled()
  })
})
