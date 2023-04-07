import { extend } from '../../share/index'

let activeEffect: any

/**
 * ReactiveEfect 类
 * 一个private参数 fn 在使用effect函数的时候 会传入一个函数
 * 我们实例化合格类 把这个函数挂载到ReactiveEffect实例上 在调用obj.run的时候 执行这个函数
 */
class ReactiveEffect {
  private fn: any
  public schedular: any
  deps = [] // 用来存放这个effect函数被哪些reactive对象依赖
  active = true // 当前的副作用函数对象是否活跃
  onStop?: () => void

  constructor(fn, schedular) {
    this.fn = fn
    this.schedular = schedular
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    return this.fn()
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop)
        this.onStop()
      this.active = false
    }
  }
}

/**
 * @param fn function
 * @params options { schedular }
 * @returns
 * 传入一个函数 生成一个effectReactive类 然后用这个类执行这个函数
 * 返回这个函数 effect.run
 */
export function effect(fn: any, options: any = {}) {
  // effect => runner() => fn => return
  // 拿到reactiveEffect的实例
  const _effect = new ReactiveEffect(fn, options.schedular)
  extend(_effect, options)
  // 执行run方法相当于执行fn
  _effect.run()
  // 拿到effect实例的run方法（相当于拿到ReactiveEffect实例下的fn）
  const runner = _effect.run.bind(_effect)
  // 反向依赖一下 这样就可以依靠runner方法来找到拥有它的实例了
  runner.effect = _effect
  // 返回这个runner
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}

/**
 * 收集依赖 形如
 * Map :{
 *    objname1 : Map => {
 *       key: Set[fn1, fn2, fn3],
 *       key: Set[fn1, fn2, fn3]
 *    }
 *    objname2 : Map => {
 *      key: Set[fn1, fn2, fn3],
 *      key: Set[fn1, fn2, fn3]
 *    }
 */
const targetMap = new Map()
export function track(target, key) {
  // target => key => values
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  // 拿到deps deps内是一个个effect函数
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(activeEffect)
  // 反向收集一下 使得activeEffect知道自己是在哪些deps里 以后可以根据这个删除deps中的effect
  activeEffect.deps.push(deps)
}

/**
 * 触发依赖 根据objname => key => fn_list 遍历执行
 */
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  for (const effect of deps) {
    if (effect.schedular)
      effect.schedular()
    else
      effect.run()
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    // dep is a Set
    dep.delete(effect)
  })
}
