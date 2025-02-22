const ANY_NAME = '!ANY'

const emptyFn = () => { /* do nothing */ }

class Evt {
  constructor() {
    Object.defineProperty(this, 'listeners', {
      value: new Map(),
      iterable: false
    })
  }

  shallowCopyEvents(target, ...evtNames) {
    if (evtNames) {
      for (const evtName of evtNames) {
        const existingListeners = this.listeners.get(evtName)
        if (!existingListeners) { continue }
        target.listeners.set(evtName, existingListeners)
      }
    } else {
      for (const [evtName, existingListeners] of this.listeners) {
        target.listeners.set(evtName, existingListeners)
      }
    }
  }

  on(evtName, fn, scope) {
    if (typeof evtName !== 'string') { return emptyFn }
    if (!evtName) { return emptyFn }
    let existingListeners = this.listeners.get(evtName)
    if (!existingListeners) {
      existingListeners = new Map()
      this.listeners.set(evtName, existingListeners)
    }
    existingListeners.set(fn, { fn: fn, scope: scope })
    return () => {
      this.un(evtName, fn)
    }
  }

  /* this does not fire the event */
  once(evtName, fn, scope) {
    if (typeof evtName !== 'string') { return emptyFn }
    if (!evtName) { return emptyFn }
    let existingListeners = this.listeners.get(evtName)
    if (!existingListeners) {
      existingListeners = new Map()
      this.listeners.set(evtName, existingListeners)
    }
    existingListeners.set(fn, { scope: scope, once: true })
    return () => {
      this.un(evtName, fn)
    }
  }

  un(evtName, fn) {
    if (typeof evtName !== 'string') return
    if (!evtName) return
    const existingListeners = this.listeners.get(evtName)
    if (existingListeners) {
      existingListeners.delete(fn)
      if (!existingListeners.size) {
        this.listeners.delete(evtName)
      }
    }
  }

  /*
   * delete all events with the evtName
   * or deletes all events if evtName is boolean:true
   */
  purge(evtName) {
    if (typeof evtName === 'string') {
      if (evtName) {
        this.listeners.delete(evtName)
      }
    } else if (evtName === true) {
      this.listeners.clear()
    }
  }

  /* look through all events and delete anything with a matching scope */
  purgeScope(scope) {
    if (!scope) return

    for (const [evtName, evtMap] of this.listeners) {
      if (evtMap.size) {
        let remaining = evtMap.size
        for (const [key, value] of evtMap) {
          if (value.scope === scope) {
            evtMap.delete(key)
            remaining--
          }
        }
        if (!remaining) {
          this.listeners.delete(evtName)
        }
      }
    }
  }

  fire(evtName, payload, scope) {
    if (typeof evtName !== 'string') return
    if (!evtName) return

    const existingListeners = this.listeners.get(evtName)
    if (existingListeners) {
      for (const [evtFn, evtOb] of existingListeners) {
        if (typeof scope !== 'undefined') {
          evtFn.call(scope, payload)
        } else if (evtOb.scope) {
          evtFn.call(evtOb.scope, payload)
        } else {
          evtFn.call(this, payload)
        }
        if (evtOb.once) {
          existingListeners.delete(evtFn)
        }
      }
      if (!existingListeners.size) {
        this.listeners.delete(evtName)
      }
    }
    if (evtName !== ANY_NAME) this.fire(ANY_NAME, { evt: evtName, payload: payload, scope: scope }, scope)
  }
}

export default Evt
