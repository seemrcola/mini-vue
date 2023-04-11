import { describe, expect, it, vi } from 'vitest'
import { isReactive, reactive } from '../src/reactive'
import { effect, stop } from '../src/effect'

describe('响应式测试', () => {
  it('happy path', () => {
    const original = { a: 100 }
    const obj = reactive(original)
    expect(obj.a).toBe(100)
    expect(isReactive(obj)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })

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

  it('stop函数测试', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    // 常规情况
    obj.prop = 2
    expect(dummy).toBe(2)
    // stop
    stop(runner)
    // case 1 直接赋值
    obj.prop = 3
    expect(dummy).toBe(2)
    // case 2 自增
    obj.prop++
    expect(dummy).toBe(2)
  })

  it('onStop测试', () => {
    const onStop = vi.fn()
    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
})
