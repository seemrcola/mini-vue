let activeEffect: any

/**
 * ReactiveEfect 类
 * 一个private参数 fn 在使用effect函数的时候 会传入一个函数
 * 我们实例化合格类 把这个函数挂载到ReactiveEffect实例上 在调用obj.run的时候 执行这个函数
 */
class ReactiveEffect {
  private fn: any

  constructor(fn: any) {
    this.fn = fn
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    return this.fn()
  }
}

/**
 * @param fn function
 * @returns
 * 传入一个函数 生成一个effectReactive类 然后用这个类执行这个函数
 * 返回这个函数
 */
export function effect(fn: any, options: any = {}) {
  // effect => runner() => fn => return
  const { schedular } = options
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  return _effect.run.bind(_effect)
}

/**
 * 收集依赖 形如
 * Map :{
 *    objname : Map => {key: [fn1, fn2, fn3]}
 *    objname2 : Map => {key: [fn1, fn2, fn3]}
 * }
 */
const targetMap = new Map()
export function track(target, key) {
  // target => key => values
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(activeEffect)
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
