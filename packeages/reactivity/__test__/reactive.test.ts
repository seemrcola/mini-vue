import { describe, expect, it } from 'vitest'
import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('响应式测试', () => {
  it('响应式基本测试', () => {
    // 受影响数据
    let dummy = 0
    // 响应式数据
    const obj = reactive({
      text: 'hello world',
      count: 0,
    })
    // 副作用函数
    effect(() => {
      // 受影响数据 赋值给 响应式数据
      dummy = obj.count
    })
    // 改变响应式数据
    obj.count = 10
    // 期望受影响数据可以随响应式数据改变
    expect(dummy).toBe(10)
  })

  it('effect函数返回runner', () => {
    let dummy = 0
    const runner = effect(() => {
      dummy = 100
      return 'dummy is 100'
    })
    const ans = runner()
    expect(dummy).toBe(100)
    expect(ans).toBe('dummy is 100')
  })

  it('schedular', () => {

  })
})
