(function (Pn) {
  typeof define == "function" && define.amd ? define(Pn) : Pn();
})(function () {
  "use strict";
  function Pn(e) {
    const t = Object.create(null);
    for (const n of e.split(",")) t[n] = 1;
    return (n) => n in t;
  }
  const ye = {},
    Rn = [],
    _t = () => {},
    dl = () => !1,
    Ur = (e) =>
      e.charCodeAt(0) === 111 &&
      e.charCodeAt(1) === 110 &&
      (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
    mi = (e) => e.startsWith("onUpdate:"),
    Ae = Object.assign,
    vi = (e, t) => {
      const n = e.indexOf(t);
      n > -1 && e.splice(n, 1);
    },
    Wf = Object.prototype.hasOwnProperty,
    ue = (e, t) => Wf.call(e, t),
    W = Array.isArray,
    Dn = (e) => rr(e) === "[object Map]",
    hl = (e) => rr(e) === "[object Set]",
    Uf = (e) => rr(e) === "[object RegExp]",
    G = (e) => typeof e == "function",
    me = (e) => typeof e == "string",
    zt = (e) => typeof e == "symbol",
    ge = (e) => e !== null && typeof e == "object",
    pl = (e) => (ge(e) || G(e)) && G(e.then) && G(e.catch),
    yl = Object.prototype.toString,
    rr = (e) => yl.call(e),
    Kf = (e) => rr(e).slice(8, -1),
    gl = (e) => rr(e) === "[object Object]",
    Kr = (e) =>
      me(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
    sr = Pn(
      ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted",
    ),
    qr = (e) => {
      const t = Object.create(null);
      return (n) => t[n] || (t[n] = e(n));
    },
    qf = /-\w/g,
    ze = qr((e) => e.replace(qf, (t) => t.slice(1).toUpperCase())),
    Gf = /\B([A-Z])/g,
    vn = qr((e) => e.replace(Gf, "-$1").toLowerCase()),
    Gr = qr((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    ir = qr((e) => (e ? `on${Gr(e)}` : "")),
    tn = (e, t) => !Object.is(e, t),
    $n = (e, ...t) => {
      for (let n = 0; n < e.length; n++) e[n](...t);
    },
    ml = (e, t, n, r = !1) => {
      Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !1,
        writable: r,
        value: n,
      });
    },
    bi = (e) => {
      const t = parseFloat(e);
      return isNaN(t) ? e : t;
    },
    Yf = (e) => {
      const t = me(e) ? Number(e) : NaN;
      return isNaN(t) ? e : t;
    };
  let vl;
  const Yr = () =>
    vl ||
    (vl =
      typeof globalThis < "u"
        ? globalThis
        : typeof self < "u"
          ? self
          : typeof window < "u"
            ? window
            : typeof global < "u"
              ? global
              : {});
  function St(e) {
    if (W(e)) {
      const t = {};
      for (let n = 0; n < e.length; n++) {
        const r = e[n],
          s = me(r) ? Zf(r) : St(r);
        if (s) for (const i in s) t[i] = s[i];
      }
      return t;
    } else if (me(e) || ge(e)) return e;
  }
  const Jf = /;(?![^(]*\))/g,
    Xf = /:([^]+)/,
    Qf = /\/\*[^]*?\*\//g;
  function Zf(e) {
    const t = {};
    return (
      e
        .replace(Qf, "")
        .split(Jf)
        .forEach((n) => {
          if (n) {
            const r = n.split(Xf);
            r.length > 1 && (t[r[0].trim()] = r[1].trim());
          }
        }),
      t
    );
  }
  function we(e) {
    let t = "";
    if (me(e)) t = e;
    else if (W(e))
      for (let n = 0; n < e.length; n++) {
        const r = we(e[n]);
        r && (t += r + " ");
      }
    else if (ge(e)) for (const n in e) e[n] && (t += n + " ");
    return t.trim();
  }
  function bl(e) {
    if (!e) return null;
    let { class: t, style: n } = e;
    return (t && !me(t) && (e.class = we(t)), n && (e.style = St(n)), e);
  }
  const ed = Pn(
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  );
  function xl(e) {
    return !!e || e === "";
  }
  const wl = (e) => !!(e && e.__v_isRef === !0),
    _e = (e) =>
      me(e)
        ? e
        : e == null
          ? ""
          : W(e) || (ge(e) && (e.toString === yl || !G(e.toString)))
            ? wl(e)
              ? _e(e.value)
              : JSON.stringify(e, _l, 2)
            : String(e),
    _l = (e, t) =>
      wl(t)
        ? _l(e, t.value)
        : Dn(t)
          ? {
              [`Map(${t.size})`]: [...t.entries()].reduce(
                (n, [r, s], i) => ((n[xi(r, i) + " =>"] = s), n),
                {},
              ),
            }
          : hl(t)
            ? { [`Set(${t.size})`]: [...t.values()].map((n) => xi(n)) }
            : zt(t)
              ? xi(t)
              : ge(t) && !W(t) && !gl(t)
                ? String(t)
                : t,
    xi = (e, t = "") => {
      var n;
      return zt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
    };
  let De;
  class td {
    constructor(t = !1) {
      ((this.detached = t),
        (this._active = !0),
        (this._on = 0),
        (this.effects = []),
        (this.cleanups = []),
        (this._isPaused = !1),
        (this.parent = De),
        !t &&
          De &&
          (this.index = (De.scopes || (De.scopes = [])).push(this) - 1));
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = !0;
        let t, n;
        if (this.scopes)
          for (t = 0, n = this.scopes.length; t < n; t++)
            this.scopes[t].pause();
        for (t = 0, n = this.effects.length; t < n; t++)
          this.effects[t].pause();
      }
    }
    resume() {
      if (this._active && this._isPaused) {
        this._isPaused = !1;
        let t, n;
        if (this.scopes)
          for (t = 0, n = this.scopes.length; t < n; t++)
            this.scopes[t].resume();
        for (t = 0, n = this.effects.length; t < n; t++)
          this.effects[t].resume();
      }
    }
    run(t) {
      if (this._active) {
        const n = De;
        try {
          return ((De = this), t());
        } finally {
          De = n;
        }
      }
    }
    on() {
      ++this._on === 1 && ((this.prevScope = De), (De = this));
    }
    off() {
      this._on > 0 &&
        --this._on === 0 &&
        ((De = this.prevScope), (this.prevScope = void 0));
    }
    stop(t) {
      if (this._active) {
        this._active = !1;
        let n, r;
        for (n = 0, r = this.effects.length; n < r; n++) this.effects[n].stop();
        for (
          this.effects.length = 0, n = 0, r = this.cleanups.length;
          n < r;
          n++
        )
          this.cleanups[n]();
        if (((this.cleanups.length = 0), this.scopes)) {
          for (n = 0, r = this.scopes.length; n < r; n++)
            this.scopes[n].stop(!0);
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !t) {
          const s = this.parent.scopes.pop();
          s &&
            s !== this &&
            ((this.parent.scopes[this.index] = s), (s.index = this.index));
        }
        this.parent = void 0;
      }
    }
  }
  function wi() {
    return De;
  }
  function Sl(e, t = !1) {
    De && De.cleanups.push(e);
  }
  let ve;
  const _i = new WeakSet();
  class El {
    constructor(t) {
      ((this.fn = t),
        (this.deps = void 0),
        (this.depsTail = void 0),
        (this.flags = 5),
        (this.next = void 0),
        (this.cleanup = void 0),
        (this.scheduler = void 0),
        De && De.active && De.effects.push(this));
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      this.flags & 64 &&
        ((this.flags &= -65),
        _i.has(this) && (_i.delete(this), this.trigger()));
    }
    notify() {
      (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || Tl(this);
    }
    run() {
      if (!(this.flags & 1)) return this.fn();
      ((this.flags |= 2), Ml(this), Ol(this));
      const t = ve,
        n = dt;
      ((ve = this), (dt = !0));
      try {
        return this.fn();
      } finally {
        (jl(this), (ve = t), (dt = n), (this.flags &= -3));
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let t = this.deps; t; t = t.nextDep) Ti(t);
        ((this.deps = this.depsTail = void 0),
          Ml(this),
          this.onStop && this.onStop(),
          (this.flags &= -2));
      }
    }
    trigger() {
      this.flags & 64
        ? _i.add(this)
        : this.scheduler
          ? this.scheduler()
          : this.runIfDirty();
    }
    runIfDirty() {
      Ci(this) && this.run();
    }
    get dirty() {
      return Ci(this);
    }
  }
  let Cl = 0,
    or,
    lr;
  function Tl(e, t = !1) {
    if (((e.flags |= 8), t)) {
      ((e.next = lr), (lr = e));
      return;
    }
    ((e.next = or), (or = e));
  }
  function Si() {
    Cl++;
  }
  function Ei() {
    if (--Cl > 0) return;
    if (lr) {
      let t = lr;
      for (lr = void 0; t; ) {
        const n = t.next;
        ((t.next = void 0), (t.flags &= -9), (t = n));
      }
    }
    let e;
    for (; or; ) {
      let t = or;
      for (or = void 0; t; ) {
        const n = t.next;
        if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
          try {
            t.trigger();
          } catch (r) {
            e || (e = r);
          }
        t = n;
      }
    }
    if (e) throw e;
  }
  function Ol(e) {
    for (let t = e.deps; t; t = t.nextDep)
      ((t.version = -1),
        (t.prevActiveLink = t.dep.activeLink),
        (t.dep.activeLink = t));
  }
  function jl(e) {
    let t,
      n = e.depsTail,
      r = n;
    for (; r; ) {
      const s = r.prevDep;
      (r.version === -1 ? (r === n && (n = s), Ti(r), nd(r)) : (t = r),
        (r.dep.activeLink = r.prevActiveLink),
        (r.prevActiveLink = void 0),
        (r = s));
    }
    ((e.deps = t), (e.depsTail = n));
  }
  function Ci(e) {
    for (let t = e.deps; t; t = t.nextDep)
      if (
        t.dep.version !== t.version ||
        (t.dep.computed && (Al(t.dep.computed) || t.dep.version !== t.version))
      )
        return !0;
    return !!e._dirty;
  }
  function Al(e) {
    if (
      (e.flags & 4 && !(e.flags & 16)) ||
      ((e.flags &= -17), e.globalVersion === ar) ||
      ((e.globalVersion = ar),
      !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Ci(e)))
    )
      return;
    e.flags |= 2;
    const t = e.dep,
      n = ve,
      r = dt;
    ((ve = e), (dt = !0));
    try {
      Ol(e);
      const s = e.fn(e._value);
      (t.version === 0 || tn(s, e._value)) &&
        ((e.flags |= 128), (e._value = s), t.version++);
    } catch (s) {
      throw (t.version++, s);
    } finally {
      ((ve = n), (dt = r), jl(e), (e.flags &= -3));
    }
  }
  function Ti(e, t = !1) {
    const { dep: n, prevSub: r, nextSub: s } = e;
    if (
      (r && ((r.nextSub = s), (e.prevSub = void 0)),
      s && ((s.prevSub = r), (e.nextSub = void 0)),
      n.subs === e && ((n.subs = r), !r && n.computed))
    ) {
      n.computed.flags &= -5;
      for (let i = n.computed.deps; i; i = i.nextDep) Ti(i, !0);
    }
    !t && !--n.sc && n.map && n.map.delete(n.key);
  }
  function nd(e) {
    const { prevDep: t, nextDep: n } = e;
    (t && ((t.nextDep = n), (e.prevDep = void 0)),
      n && ((n.prevDep = t), (e.nextDep = void 0)));
  }
  let dt = !0;
  const kl = [];
  function Et() {
    (kl.push(dt), (dt = !1));
  }
  function Ct() {
    const e = kl.pop();
    dt = e === void 0 ? !0 : e;
  }
  function Ml(e) {
    const { cleanup: t } = e;
    if (((e.cleanup = void 0), t)) {
      const n = ve;
      ve = void 0;
      try {
        t();
      } finally {
        ve = n;
      }
    }
  }
  let ar = 0;
  class rd {
    constructor(t, n) {
      ((this.sub = t),
        (this.dep = n),
        (this.version = n.version),
        (this.nextDep =
          this.prevDep =
          this.nextSub =
          this.prevSub =
          this.prevActiveLink =
            void 0));
    }
  }
  class Jr {
    constructor(t) {
      ((this.computed = t),
        (this.version = 0),
        (this.activeLink = void 0),
        (this.subs = void 0),
        (this.map = void 0),
        (this.key = void 0),
        (this.sc = 0),
        (this.__v_skip = !0));
    }
    track(t) {
      if (!ve || !dt || ve === this.computed) return;
      let n = this.activeLink;
      if (n === void 0 || n.sub !== ve)
        ((n = this.activeLink = new rd(ve, this)),
          ve.deps
            ? ((n.prevDep = ve.depsTail),
              (ve.depsTail.nextDep = n),
              (ve.depsTail = n))
            : (ve.deps = ve.depsTail = n),
          Pl(n));
      else if (n.version === -1 && ((n.version = this.version), n.nextDep)) {
        const r = n.nextDep;
        ((r.prevDep = n.prevDep),
          n.prevDep && (n.prevDep.nextDep = r),
          (n.prevDep = ve.depsTail),
          (n.nextDep = void 0),
          (ve.depsTail.nextDep = n),
          (ve.depsTail = n),
          ve.deps === n && (ve.deps = r));
      }
      return n;
    }
    trigger(t) {
      (this.version++, ar++, this.notify(t));
    }
    notify(t) {
      Si();
      try {
        for (let n = this.subs; n; n = n.prevSub)
          n.sub.notify() && n.sub.dep.notify();
      } finally {
        Ei();
      }
    }
  }
  function Pl(e) {
    if ((e.dep.sc++, e.sub.flags & 4)) {
      const t = e.dep.computed;
      if (t && !e.dep.subs) {
        t.flags |= 20;
        for (let r = t.deps; r; r = r.nextDep) Pl(r);
      }
      const n = e.dep.subs;
      (n !== e && ((e.prevSub = n), n && (n.nextSub = e)), (e.dep.subs = e));
    }
  }
  const Xr = new WeakMap(),
    bn = Symbol(""),
    Oi = Symbol(""),
    cr = Symbol("");
  function $e(e, t, n) {
    if (dt && ve) {
      let r = Xr.get(e);
      r || Xr.set(e, (r = new Map()));
      let s = r.get(n);
      (s || (r.set(n, (s = new Jr())), (s.map = r), (s.key = n)), s.track());
    }
  }
  function Wt(e, t, n, r, s, i) {
    const o = Xr.get(e);
    if (!o) {
      ar++;
      return;
    }
    const l = (a) => {
      a && a.trigger();
    };
    if ((Si(), t === "clear")) o.forEach(l);
    else {
      const a = W(e),
        u = a && Kr(n);
      if (a && n === "length") {
        const c = Number(r);
        o.forEach((f, d) => {
          (d === "length" || d === cr || (!zt(d) && d >= c)) && l(f);
        });
      } else
        switch (
          ((n !== void 0 || o.has(void 0)) && l(o.get(n)), u && l(o.get(cr)), t)
        ) {
          case "add":
            a ? u && l(o.get("length")) : (l(o.get(bn)), Dn(e) && l(o.get(Oi)));
            break;
          case "delete":
            a || (l(o.get(bn)), Dn(e) && l(o.get(Oi)));
            break;
          case "set":
            Dn(e) && l(o.get(bn));
            break;
        }
    }
    Ei();
  }
  function sd(e, t) {
    const n = Xr.get(e);
    return n && n.get(t);
  }
  function Ln(e) {
    const t = ae(e);
    return t === e ? t : ($e(t, "iterate", cr), Xe(e) ? t : t.map(ht));
  }
  function Qr(e) {
    return ($e((e = ae(e)), "iterate", cr), e);
  }
  function nn(e, t) {
    return Kt(e) ? (wn(e) ? Nn(ht(t)) : Nn(t)) : ht(t);
  }
  const id = {
    __proto__: null,
    [Symbol.iterator]() {
      return ji(this, Symbol.iterator, (e) => nn(this, e));
    },
    concat(...e) {
      return Ln(this).concat(...e.map((t) => (W(t) ? Ln(t) : t)));
    },
    entries() {
      return ji(this, "entries", (e) => ((e[1] = nn(this, e[1])), e));
    },
    every(e, t) {
      return Ut(this, "every", e, t, void 0, arguments);
    },
    filter(e, t) {
      return Ut(
        this,
        "filter",
        e,
        t,
        (n) => n.map((r) => nn(this, r)),
        arguments,
      );
    },
    find(e, t) {
      return Ut(this, "find", e, t, (n) => nn(this, n), arguments);
    },
    findIndex(e, t) {
      return Ut(this, "findIndex", e, t, void 0, arguments);
    },
    findLast(e, t) {
      return Ut(this, "findLast", e, t, (n) => nn(this, n), arguments);
    },
    findLastIndex(e, t) {
      return Ut(this, "findLastIndex", e, t, void 0, arguments);
    },
    forEach(e, t) {
      return Ut(this, "forEach", e, t, void 0, arguments);
    },
    includes(...e) {
      return Ai(this, "includes", e);
    },
    indexOf(...e) {
      return Ai(this, "indexOf", e);
    },
    join(e) {
      return Ln(this).join(e);
    },
    lastIndexOf(...e) {
      return Ai(this, "lastIndexOf", e);
    },
    map(e, t) {
      return Ut(this, "map", e, t, void 0, arguments);
    },
    pop() {
      return ur(this, "pop");
    },
    push(...e) {
      return ur(this, "push", e);
    },
    reduce(e, ...t) {
      return Rl(this, "reduce", e, t);
    },
    reduceRight(e, ...t) {
      return Rl(this, "reduceRight", e, t);
    },
    shift() {
      return ur(this, "shift");
    },
    some(e, t) {
      return Ut(this, "some", e, t, void 0, arguments);
    },
    splice(...e) {
      return ur(this, "splice", e);
    },
    toReversed() {
      return Ln(this).toReversed();
    },
    toSorted(e) {
      return Ln(this).toSorted(e);
    },
    toSpliced(...e) {
      return Ln(this).toSpliced(...e);
    },
    unshift(...e) {
      return ur(this, "unshift", e);
    },
    values() {
      return ji(this, "values", (e) => nn(this, e));
    },
  };
  function ji(e, t, n) {
    const r = Qr(e),
      s = r[t]();
    return (
      r !== e &&
        !Xe(e) &&
        ((s._next = s.next),
        (s.next = () => {
          const i = s._next();
          return (i.done || (i.value = n(i.value)), i);
        })),
      s
    );
  }
  const od = Array.prototype;
  function Ut(e, t, n, r, s, i) {
    const o = Qr(e),
      l = o !== e && !Xe(e),
      a = o[t];
    if (a !== od[t]) {
      const f = a.apply(e, i);
      return l ? ht(f) : f;
    }
    let u = n;
    o !== e &&
      (l
        ? (u = function (f, d) {
            return n.call(this, nn(e, f), d, e);
          })
        : n.length > 2 &&
          (u = function (f, d) {
            return n.call(this, f, d, e);
          }));
    const c = a.call(o, u, r);
    return l && s ? s(c) : c;
  }
  function Rl(e, t, n, r) {
    const s = Qr(e);
    let i = n;
    return (
      s !== e &&
        (Xe(e)
          ? n.length > 3 &&
            (i = function (o, l, a) {
              return n.call(this, o, l, a, e);
            })
          : (i = function (o, l, a) {
              return n.call(this, o, nn(e, l), a, e);
            })),
      s[t](i, ...r)
    );
  }
  function Ai(e, t, n) {
    const r = ae(e);
    $e(r, "iterate", cr);
    const s = r[t](...n);
    return (s === -1 || s === !1) && rs(n[0])
      ? ((n[0] = ae(n[0])), r[t](...n))
      : s;
  }
  function ur(e, t, n = []) {
    (Et(), Si());
    const r = ae(e)[t].apply(e, n);
    return (Ei(), Ct(), r);
  }
  const ld = Pn("__proto__,__v_isRef,__isVue"),
    Dl = new Set(
      Object.getOwnPropertyNames(Symbol)
        .filter((e) => e !== "arguments" && e !== "caller")
        .map((e) => Symbol[e])
        .filter(zt),
    );
  function ad(e) {
    zt(e) || (e = String(e));
    const t = ae(this);
    return ($e(t, "has", e), t.hasOwnProperty(e));
  }
  class $l {
    constructor(t = !1, n = !1) {
      ((this._isReadonly = t), (this._isShallow = n));
    }
    get(t, n, r) {
      if (n === "__v_skip") return t.__v_skip;
      const s = this._isReadonly,
        i = this._isShallow;
      if (n === "__v_isReactive") return !s;
      if (n === "__v_isReadonly") return s;
      if (n === "__v_isShallow") return i;
      if (n === "__v_raw")
        return r === (s ? (i ? Vl : Fl) : i ? Bl : Nl).get(t) ||
          Object.getPrototypeOf(t) === Object.getPrototypeOf(r)
          ? t
          : void 0;
      const o = W(t);
      if (!s) {
        let a;
        if (o && (a = id[n])) return a;
        if (n === "hasOwnProperty") return ad;
      }
      const l = Reflect.get(t, n, Te(t) ? t : r);
      if ((zt(n) ? Dl.has(n) : ld(n)) || (s || $e(t, "get", n), i)) return l;
      if (Te(l)) {
        const a = o && Kr(n) ? l : l.value;
        return s && ge(a) ? xn(a) : a;
      }
      return ge(l) ? (s ? xn(l) : Tt(l)) : l;
    }
  }
  class Ll extends $l {
    constructor(t = !1) {
      super(!1, t);
    }
    set(t, n, r, s) {
      let i = t[n];
      const o = W(t) && Kr(n);
      if (!this._isShallow) {
        const u = Kt(i);
        if (
          (!Xe(r) && !Kt(r) && ((i = ae(i)), (r = ae(r))),
          !o && Te(i) && !Te(r))
        )
          return (u || (i.value = r), !0);
      }
      const l = o ? Number(n) < t.length : ue(t, n),
        a = Reflect.set(t, n, r, Te(t) ? t : s);
      return (
        t === ae(s) &&
          (l ? tn(r, i) && Wt(t, "set", n, r) : Wt(t, "add", n, r)),
        a
      );
    }
    deleteProperty(t, n) {
      const r = ue(t, n);
      t[n];
      const s = Reflect.deleteProperty(t, n);
      return (s && r && Wt(t, "delete", n, void 0), s);
    }
    has(t, n) {
      const r = Reflect.has(t, n);
      return ((!zt(n) || !Dl.has(n)) && $e(t, "has", n), r);
    }
    ownKeys(t) {
      return ($e(t, "iterate", W(t) ? "length" : bn), Reflect.ownKeys(t));
    }
  }
  class Il extends $l {
    constructor(t = !1) {
      super(!0, t);
    }
    set(t, n) {
      return !0;
    }
    deleteProperty(t, n) {
      return !0;
    }
  }
  const cd = new Ll(),
    ud = new Il(),
    fd = new Ll(!0),
    dd = new Il(!0),
    ki = (e) => e,
    Zr = (e) => Reflect.getPrototypeOf(e);
  function hd(e, t, n) {
    return function (...r) {
      const s = this.__v_raw,
        i = ae(s),
        o = Dn(i),
        l = e === "entries" || (e === Symbol.iterator && o),
        a = e === "keys" && o,
        u = s[e](...r),
        c = n ? ki : t ? Nn : ht;
      return (
        !t && $e(i, "iterate", a ? Oi : bn),
        {
          next() {
            const { value: f, done: d } = u.next();
            return d
              ? { value: f, done: d }
              : { value: l ? [c(f[0]), c(f[1])] : c(f), done: d };
          },
          [Symbol.iterator]() {
            return this;
          },
        }
      );
    };
  }
  function es(e) {
    return function (...t) {
      return e === "delete" ? !1 : e === "clear" ? void 0 : this;
    };
  }
  function pd(e, t) {
    const n = {
      get(s) {
        const i = this.__v_raw,
          o = ae(i),
          l = ae(s);
        e || (tn(s, l) && $e(o, "get", s), $e(o, "get", l));
        const { has: a } = Zr(o),
          u = t ? ki : e ? Nn : ht;
        if (a.call(o, s)) return u(i.get(s));
        if (a.call(o, l)) return u(i.get(l));
        i !== o && i.get(s);
      },
      get size() {
        const s = this.__v_raw;
        return (!e && $e(ae(s), "iterate", bn), s.size);
      },
      has(s) {
        const i = this.__v_raw,
          o = ae(i),
          l = ae(s);
        return (
          e || (tn(s, l) && $e(o, "has", s), $e(o, "has", l)),
          s === l ? i.has(s) : i.has(s) || i.has(l)
        );
      },
      forEach(s, i) {
        const o = this,
          l = o.__v_raw,
          a = ae(l),
          u = t ? ki : e ? Nn : ht;
        return (
          !e && $e(a, "iterate", bn),
          l.forEach((c, f) => s.call(i, u(c), u(f), o))
        );
      },
    };
    return (
      Ae(
        n,
        e
          ? {
              add: es("add"),
              set: es("set"),
              delete: es("delete"),
              clear: es("clear"),
            }
          : {
              add(s) {
                !t && !Xe(s) && !Kt(s) && (s = ae(s));
                const i = ae(this);
                return (
                  Zr(i).has.call(i, s) || (i.add(s), Wt(i, "add", s, s)),
                  this
                );
              },
              set(s, i) {
                !t && !Xe(i) && !Kt(i) && (i = ae(i));
                const o = ae(this),
                  { has: l, get: a } = Zr(o);
                let u = l.call(o, s);
                u || ((s = ae(s)), (u = l.call(o, s)));
                const c = a.call(o, s);
                return (
                  o.set(s, i),
                  u ? tn(i, c) && Wt(o, "set", s, i) : Wt(o, "add", s, i),
                  this
                );
              },
              delete(s) {
                const i = ae(this),
                  { has: o, get: l } = Zr(i);
                let a = o.call(i, s);
                (a || ((s = ae(s)), (a = o.call(i, s))), l && l.call(i, s));
                const u = i.delete(s);
                return (a && Wt(i, "delete", s, void 0), u);
              },
              clear() {
                const s = ae(this),
                  i = s.size !== 0,
                  o = s.clear();
                return (i && Wt(s, "clear", void 0, void 0), o);
              },
            },
      ),
      ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
        n[s] = hd(s, e, t);
      }),
      n
    );
  }
  function ts(e, t) {
    const n = pd(e, t);
    return (r, s, i) =>
      s === "__v_isReactive"
        ? !e
        : s === "__v_isReadonly"
          ? e
          : s === "__v_raw"
            ? r
            : Reflect.get(ue(n, s) && s in r ? n : r, s, i);
  }
  const yd = { get: ts(!1, !1) },
    gd = { get: ts(!1, !0) },
    md = { get: ts(!0, !1) },
    vd = { get: ts(!0, !0) },
    Nl = new WeakMap(),
    Bl = new WeakMap(),
    Fl = new WeakMap(),
    Vl = new WeakMap();
  function bd(e) {
    switch (e) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function xd(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : bd(Kf(e));
  }
  function Tt(e) {
    return Kt(e) ? e : ns(e, !1, cd, yd, Nl);
  }
  function wd(e) {
    return ns(e, !1, fd, gd, Bl);
  }
  function xn(e) {
    return ns(e, !0, ud, md, Fl);
  }
  function In(e) {
    return ns(e, !0, dd, vd, Vl);
  }
  function ns(e, t, n, r, s) {
    if (!ge(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
    const i = xd(e);
    if (i === 0) return e;
    const o = s.get(e);
    if (o) return o;
    const l = new Proxy(e, i === 2 ? r : n);
    return (s.set(e, l), l);
  }
  function wn(e) {
    return Kt(e) ? wn(e.__v_raw) : !!(e && e.__v_isReactive);
  }
  function Kt(e) {
    return !!(e && e.__v_isReadonly);
  }
  function Xe(e) {
    return !!(e && e.__v_isShallow);
  }
  function rs(e) {
    return e ? !!e.__v_raw : !1;
  }
  function ae(e) {
    const t = e && e.__v_raw;
    return t ? ae(t) : e;
  }
  function _d(e) {
    return (
      !ue(e, "__v_skip") && Object.isExtensible(e) && ml(e, "__v_skip", !0),
      e
    );
  }
  const ht = (e) => (ge(e) ? Tt(e) : e),
    Nn = (e) => (ge(e) ? xn(e) : e);
  function Te(e) {
    return e ? e.__v_isRef === !0 : !1;
  }
  function Q(e) {
    return Hl(e, !1);
  }
  function fr(e) {
    return Hl(e, !0);
  }
  function Hl(e, t) {
    return Te(e) ? e : new Sd(e, t);
  }
  class Sd {
    constructor(t, n) {
      ((this.dep = new Jr()),
        (this.__v_isRef = !0),
        (this.__v_isShallow = !1),
        (this._rawValue = n ? t : ae(t)),
        (this._value = n ? t : ht(t)),
        (this.__v_isShallow = n));
    }
    get value() {
      return (this.dep.track(), this._value);
    }
    set value(t) {
      const n = this._rawValue,
        r = this.__v_isShallow || Xe(t) || Kt(t);
      ((t = r ? t : ae(t)),
        tn(t, n) &&
          ((this._rawValue = t),
          (this._value = r ? t : ht(t)),
          this.dep.trigger()));
    }
  }
  function F(e) {
    return Te(e) ? e.value : e;
  }
  function Oe(e) {
    return G(e) ? e() : F(e);
  }
  const Ed = {
    get: (e, t, n) => (t === "__v_raw" ? e : F(Reflect.get(e, t, n))),
    set: (e, t, n, r) => {
      const s = e[t];
      return Te(s) && !Te(n) ? ((s.value = n), !0) : Reflect.set(e, t, n, r);
    },
  };
  function zl(e) {
    return wn(e) ? e : new Proxy(e, Ed);
  }
  class Cd {
    constructor(t) {
      ((this.__v_isRef = !0), (this._value = void 0));
      const n = (this.dep = new Jr()),
        { get: r, set: s } = t(n.track.bind(n), n.trigger.bind(n));
      ((this._get = r), (this._set = s));
    }
    get value() {
      return (this._value = this._get());
    }
    set value(t) {
      this._set(t);
    }
  }
  function Wl(e) {
    return new Cd(e);
  }
  function Ul(e) {
    const t = W(e) ? new Array(e.length) : {};
    for (const n in e) t[n] = ql(e, n);
    return t;
  }
  class Td {
    constructor(t, n, r) {
      ((this._object = t),
        (this._key = n),
        (this._defaultValue = r),
        (this.__v_isRef = !0),
        (this._value = void 0),
        (this._raw = ae(t)));
      let s = !0,
        i = t;
      if (!W(t) || !Kr(String(n)))
        do s = !rs(i) || Xe(i);
        while (s && (i = i.__v_raw));
      this._shallow = s;
    }
    get value() {
      let t = this._object[this._key];
      return (
        this._shallow && (t = F(t)),
        (this._value = t === void 0 ? this._defaultValue : t)
      );
    }
    set value(t) {
      if (this._shallow && Te(this._raw[this._key])) {
        const n = this._object[this._key];
        if (Te(n)) {
          n.value = t;
          return;
        }
      }
      this._object[this._key] = t;
    }
    get dep() {
      return sd(this._raw, this._key);
    }
  }
  class Od {
    constructor(t) {
      ((this._getter = t),
        (this.__v_isRef = !0),
        (this.__v_isReadonly = !0),
        (this._value = void 0));
    }
    get value() {
      return (this._value = this._getter());
    }
  }
  function Kl(e, t, n) {
    return Te(e)
      ? e
      : G(e)
        ? new Od(e)
        : ge(e) && arguments.length > 1
          ? ql(e, t, n)
          : Q(e);
  }
  function ql(e, t, n) {
    return new Td(e, t, n);
  }
  class jd {
    constructor(t, n, r) {
      ((this.fn = t),
        (this.setter = n),
        (this._value = void 0),
        (this.dep = new Jr(this)),
        (this.__v_isRef = !0),
        (this.deps = void 0),
        (this.depsTail = void 0),
        (this.flags = 16),
        (this.globalVersion = ar - 1),
        (this.next = void 0),
        (this.effect = this),
        (this.__v_isReadonly = !n),
        (this.isSSR = r));
    }
    notify() {
      if (((this.flags |= 16), !(this.flags & 8) && ve !== this))
        return (Tl(this, !0), !0);
    }
    get value() {
      const t = this.dep.track();
      return (Al(this), t && (t.version = this.dep.version), this._value);
    }
    set value(t) {
      this.setter && this.setter(t);
    }
  }
  function Ad(e, t, n = !1) {
    let r, s;
    return (G(e) ? (r = e) : ((r = e.get), (s = e.set)), new jd(r, s, n));
  }
  const ss = {},
    is = new WeakMap();
  let _n;
  function kd(e, t = !1, n = _n) {
    if (n) {
      let r = is.get(n);
      (r || is.set(n, (r = [])), r.push(e));
    }
  }
  function Md(e, t, n = ye) {
    const {
        immediate: r,
        deep: s,
        once: i,
        scheduler: o,
        augmentJob: l,
        call: a,
      } = n,
      u = (w) => (s ? w : Xe(w) || s === !1 || s === 0 ? qt(w, 1) : qt(w));
    let c,
      f,
      d,
      h,
      p = !1,
      y = !1;
    if (
      (Te(e)
        ? ((f = () => e.value), (p = Xe(e)))
        : wn(e)
          ? ((f = () => u(e)), (p = !0))
          : W(e)
            ? ((y = !0),
              (p = e.some((w) => wn(w) || Xe(w))),
              (f = () =>
                e.map((w) => {
                  if (Te(w)) return w.value;
                  if (wn(w)) return u(w);
                  if (G(w)) return a ? a(w, 2) : w();
                })))
            : G(e)
              ? t
                ? (f = a ? () => a(e, 2) : e)
                : (f = () => {
                    if (d) {
                      Et();
                      try {
                        d();
                      } finally {
                        Ct();
                      }
                    }
                    const w = _n;
                    _n = c;
                    try {
                      return a ? a(e, 3, [h]) : e(h);
                    } finally {
                      _n = w;
                    }
                  })
              : (f = _t),
      t && s)
    ) {
      const w = f,
        S = s === !0 ? 1 / 0 : s;
      f = () => qt(w(), S);
    }
    const v = wi(),
      g = () => {
        (c.stop(), v && v.active && vi(v.effects, c));
      };
    if (i && t) {
      const w = t;
      t = (...S) => {
        (w(...S), g());
      };
    }
    let m = y ? new Array(e.length).fill(ss) : ss;
    const b = (w) => {
      if (!(!(c.flags & 1) || (!c.dirty && !w)))
        if (t) {
          const S = c.run();
          if (s || p || (y ? S.some((E, T) => tn(E, m[T])) : tn(S, m))) {
            d && d();
            const E = _n;
            _n = c;
            try {
              const T = [S, m === ss ? void 0 : y && m[0] === ss ? [] : m, h];
              ((m = S), a ? a(t, 3, T) : t(...T));
            } finally {
              _n = E;
            }
          }
        } else c.run();
    };
    return (
      l && l(b),
      (c = new El(f)),
      (c.scheduler = o ? () => o(b, !1) : b),
      (h = (w) => kd(w, !1, c)),
      (d = c.onStop =
        () => {
          const w = is.get(c);
          if (w) {
            if (a) a(w, 4);
            else for (const S of w) S();
            is.delete(c);
          }
        }),
      t ? (r ? b(!0) : (m = c.run())) : o ? o(b.bind(null, !0), !0) : c.run(),
      (g.pause = c.pause.bind(c)),
      (g.resume = c.resume.bind(c)),
      (g.stop = g),
      g
    );
  }
  function qt(e, t = 1 / 0, n) {
    if (
      t <= 0 ||
      !ge(e) ||
      e.__v_skip ||
      ((n = n || new Map()), (n.get(e) || 0) >= t)
    )
      return e;
    if ((n.set(e, t), t--, Te(e))) qt(e.value, t, n);
    else if (W(e)) for (let r = 0; r < e.length; r++) qt(e[r], t, n);
    else if (hl(e) || Dn(e))
      e.forEach((r) => {
        qt(r, t, n);
      });
    else if (gl(e)) {
      for (const r in e) qt(e[r], t, n);
      for (const r of Object.getOwnPropertySymbols(e))
        Object.prototype.propertyIsEnumerable.call(e, r) && qt(e[r], t, n);
    }
    return e;
  }
  const dr = [];
  let Mi = !1;
  function gb(e, ...t) {
    if (Mi) return;
    ((Mi = !0), Et());
    const n = dr.length ? dr[dr.length - 1].component : null,
      r = n && n.appContext.config.warnHandler,
      s = Pd();
    if (r)
      Bn(r, n, 11, [
        e +
          t
            .map((i) => {
              var o, l;
              return (l = (o = i.toString) == null ? void 0 : o.call(i)) != null
                ? l
                : JSON.stringify(i);
            })
            .join(""),
        n && n.proxy,
        s.map(({ vnode: i }) => `at <${ec(n, i.type)}>`).join(`
`),
        s,
      ]);
    else {
      const i = [`[Vue warn]: ${e}`, ...t];
      (s.length &&
        i.push(
          `
`,
          ...Rd(s),
        ),
        console.warn(...i));
    }
    (Ct(), (Mi = !1));
  }
  function Pd() {
    let e = dr[dr.length - 1];
    if (!e) return [];
    const t = [];
    for (; e; ) {
      const n = t[0];
      n && n.vnode === e
        ? n.recurseCount++
        : t.push({ vnode: e, recurseCount: 0 });
      const r = e.component && e.component.parent;
      e = r && r.vnode;
    }
    return t;
  }
  function Rd(e) {
    const t = [];
    return (
      e.forEach((n, r) => {
        t.push(
          ...(r === 0
            ? []
            : [
                `
`,
              ]),
          ...Dd(n),
        );
      }),
      t
    );
  }
  function Dd({ vnode: e, recurseCount: t }) {
    const n = t > 0 ? `... (${t} recursive calls)` : "",
      r = e.component ? e.component.parent == null : !1,
      s = ` at <${ec(e.component, e.type, r)}`,
      i = ">" + n;
    return e.props ? [s, ...$d(e.props), i] : [s + i];
  }
  function $d(e) {
    const t = [],
      n = Object.keys(e);
    return (
      n.slice(0, 3).forEach((r) => {
        t.push(...Gl(r, e[r]));
      }),
      n.length > 3 && t.push(" ..."),
      t
    );
  }
  function Gl(e, t, n) {
    return me(t)
      ? ((t = JSON.stringify(t)), n ? t : [`${e}=${t}`])
      : typeof t == "number" || typeof t == "boolean" || t == null
        ? n
          ? t
          : [`${e}=${t}`]
        : Te(t)
          ? ((t = Gl(e, ae(t.value), !0)), n ? t : [`${e}=Ref<`, t, ">"])
          : G(t)
            ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`]
            : ((t = ae(t)), n ? t : [`${e}=`, t]);
  }
  function Bn(e, t, n, r) {
    try {
      return r ? e(...r) : e();
    } catch (s) {
      os(s, t, n);
    }
  }
  function pt(e, t, n, r) {
    if (G(e)) {
      const s = Bn(e, t, n, r);
      return (
        s &&
          pl(s) &&
          s.catch((i) => {
            os(i, t, n);
          }),
        s
      );
    }
    if (W(e)) {
      const s = [];
      for (let i = 0; i < e.length; i++) s.push(pt(e[i], t, n, r));
      return s;
    }
  }
  function os(e, t, n, r = !0) {
    const s = t ? t.vnode : null,
      { errorHandler: i, throwUnhandledErrorInProduction: o } =
        (t && t.appContext.config) || ye;
    if (t) {
      let l = t.parent;
      const a = t.proxy,
        u = `https://vuejs.org/error-reference/#runtime-${n}`;
      for (; l; ) {
        const c = l.ec;
        if (c) {
          for (let f = 0; f < c.length; f++) if (c[f](e, a, u) === !1) return;
        }
        l = l.parent;
      }
      if (i) {
        (Et(), Bn(i, null, 10, [e, a, u]), Ct());
        return;
      }
    }
    Ld(e, n, s, r, o);
  }
  function Ld(e, t, n, r = !0, s = !1) {
    if (s) throw e;
    console.error(e);
  }
  const Fe = [];
  let Ot = -1;
  const Fn = [];
  let rn = null,
    Vn = 0;
  const Yl = Promise.resolve();
  let ls = null;
  function Le(e) {
    const t = ls || Yl;
    return e ? t.then(this ? e.bind(this) : e) : t;
  }
  function Id(e) {
    let t = Ot + 1,
      n = Fe.length;
    for (; t < n; ) {
      const r = (t + n) >>> 1,
        s = Fe[r],
        i = hr(s);
      i < e || (i === e && s.flags & 2) ? (t = r + 1) : (n = r);
    }
    return t;
  }
  function Pi(e) {
    if (!(e.flags & 1)) {
      const t = hr(e),
        n = Fe[Fe.length - 1];
      (!n || (!(e.flags & 2) && t >= hr(n))
        ? Fe.push(e)
        : Fe.splice(Id(t), 0, e),
        (e.flags |= 1),
        Jl());
    }
  }
  function Jl() {
    ls || (ls = Yl.then(Zl));
  }
  function Nd(e) {
    (W(e)
      ? Fn.push(...e)
      : rn && e.id === -1
        ? rn.splice(Vn + 1, 0, e)
        : e.flags & 1 || (Fn.push(e), (e.flags |= 1)),
      Jl());
  }
  function Xl(e, t, n = Ot + 1) {
    for (; n < Fe.length; n++) {
      const r = Fe[n];
      if (r && r.flags & 2) {
        if (e && r.id !== e.uid) continue;
        (Fe.splice(n, 1),
          n--,
          r.flags & 4 && (r.flags &= -2),
          r(),
          r.flags & 4 || (r.flags &= -2));
      }
    }
  }
  function Ql(e) {
    if (Fn.length) {
      const t = [...new Set(Fn)].sort((n, r) => hr(n) - hr(r));
      if (((Fn.length = 0), rn)) {
        rn.push(...t);
        return;
      }
      for (rn = t, Vn = 0; Vn < rn.length; Vn++) {
        const n = rn[Vn];
        (n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), (n.flags &= -2));
      }
      ((rn = null), (Vn = 0));
    }
  }
  const hr = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
  function Zl(e) {
    try {
      for (Ot = 0; Ot < Fe.length; Ot++) {
        const t = Fe[Ot];
        t &&
          !(t.flags & 8) &&
          (t.flags & 4 && (t.flags &= -2),
          Bn(t, t.i, t.i ? 15 : 14),
          t.flags & 4 || (t.flags &= -2));
      }
    } finally {
      for (; Ot < Fe.length; Ot++) {
        const t = Fe[Ot];
        t && (t.flags &= -2);
      }
      ((Ot = -1),
        (Fe.length = 0),
        Ql(),
        (ls = null),
        (Fe.length || Fn.length) && Zl());
    }
  }
  let Pe = null,
    ea = null;
  function as(e) {
    const t = Pe;
    return ((Pe = e), (ea = (e && e.type.__scopeId) || null), t);
  }
  function se(e, t = Pe, n) {
    if (!t || e._n) return e;
    const r = (...s) => {
      r._d && Ss(-1);
      const i = as(t);
      let o;
      try {
        o = e(...s);
      } finally {
        (as(i), r._d && Ss(1));
      }
      return o;
    };
    return ((r._n = !0), (r._c = !0), (r._d = !0), r);
  }
  function ta(e, t) {
    if (Pe === null) return e;
    const n = Ts(Pe),
      r = e.dirs || (e.dirs = []);
    for (let s = 0; s < t.length; s++) {
      let [i, o, l, a = ye] = t[s];
      i &&
        (G(i) && (i = { mounted: i, updated: i }),
        i.deep && qt(o),
        r.push({
          dir: i,
          instance: n,
          value: o,
          oldValue: void 0,
          arg: l,
          modifiers: a,
        }));
    }
    return e;
  }
  function Sn(e, t, n, r) {
    const s = e.dirs,
      i = t && t.dirs;
    for (let o = 0; o < s.length; o++) {
      const l = s[o];
      i && (l.oldValue = i[o].value);
      let a = l.dir[r];
      a && (Et(), pt(a, n, 8, [e.el, l, e, t]), Ct());
    }
  }
  function cs(e, t) {
    if (Ie) {
      let n = Ie.provides;
      const r = Ie.parent && Ie.parent.provides;
      (r === n && (n = Ie.provides = Object.create(r)), (n[e] = t));
    }
  }
  function jt(e, t, n = !1) {
    const r = qe();
    if (r || zn) {
      let s = zn
        ? zn._context.provides
        : r
          ? r.parent == null || r.ce
            ? r.vnode.appContext && r.vnode.appContext.provides
            : r.parent.provides
          : void 0;
      if (s && e in s) return s[e];
      if (arguments.length > 1) return n && G(t) ? t.call(r && r.proxy) : t;
    }
  }
  const Bd = Symbol.for("v-scx"),
    Fd = () => jt(Bd);
  function We(e, t) {
    return us(e, null, t);
  }
  function na(e, t) {
    return us(e, null, { flush: "post" });
  }
  function Ee(e, t, n) {
    return us(e, t, n);
  }
  function us(e, t, n = ye) {
    const { immediate: r, deep: s, flush: i, once: o } = n,
      l = Ae({}, n),
      a = (t && r) || (!t && i !== "post");
    let u;
    if (Er) {
      if (i === "sync") {
        const h = Fd();
        u = h.__watcherHandles || (h.__watcherHandles = []);
      } else if (!a) {
        const h = () => {};
        return ((h.stop = _t), (h.resume = _t), (h.pause = _t), h);
      }
    }
    const c = Ie;
    l.call = (h, p, y) => pt(h, c, p, y);
    let f = !1;
    (i === "post"
      ? (l.scheduler = (h) => {
          ke(h, c && c.suspense);
        })
      : i !== "sync" &&
        ((f = !0),
        (l.scheduler = (h, p) => {
          p ? h() : Pi(h);
        })),
      (l.augmentJob = (h) => {
        (t && (h.flags |= 4),
          f && ((h.flags |= 2), c && ((h.id = c.uid), (h.i = c))));
      }));
    const d = Md(e, t, l);
    return (Er && (u ? u.push(d) : a && d()), d);
  }
  function Vd(e, t, n) {
    const r = this.proxy,
      s = me(e) ? (e.includes(".") ? ra(r, e) : () => r[e]) : e.bind(r, r);
    let i;
    G(t) ? (i = t) : ((i = t.handler), (n = t));
    const o = Sr(this),
      l = us(s, i.bind(r), n);
    return (o(), l);
  }
  function ra(e, t) {
    const n = t.split(".");
    return () => {
      let r = e;
      for (let s = 0; s < n.length && r; s++) r = r[n[s]];
      return r;
    };
  }
  const sa = Symbol("_vte"),
    ia = (e) => e.__isTeleport,
    pr = (e) => e && (e.disabled || e.disabled === ""),
    oa = (e) => e && (e.defer || e.defer === ""),
    la = (e) => typeof SVGElement < "u" && e instanceof SVGElement,
    aa = (e) =>
      typeof MathMLElement == "function" && e instanceof MathMLElement,
    Ri = (e, t) => {
      const n = e && e.to;
      return me(n) ? (t ? t(n) : null) : n;
    },
    ca = {
      name: "Teleport",
      __isTeleport: !0,
      process(e, t, n, r, s, i, o, l, a, u) {
        const {
            mc: c,
            pc: f,
            pbc: d,
            o: { insert: h, querySelector: p, createText: y, createComment: v },
          } = u,
          g = pr(t.props);
        let { shapeFlag: m, children: b, dynamicChildren: w } = t;
        if (e == null) {
          const S = (t.el = y("")),
            E = (t.anchor = y(""));
          (h(S, n, r), h(E, n, r));
          const T = (R, H) => {
              m & 16 && c(b, R, H, s, i, o, l, a);
            },
            D = () => {
              const R = (t.target = Ri(t.props, p)),
                H = ua(R, t, y, h);
              R &&
                (o !== "svg" && la(R)
                  ? (o = "svg")
                  : o !== "mathml" && aa(R) && (o = "mathml"),
                s &&
                  s.isCE &&
                  (
                    s.ce._teleportTargets || (s.ce._teleportTargets = new Set())
                  ).add(R),
                g || (T(R, H), ds(t, !1)));
            };
          (g && (T(n, E), ds(t, !0)),
            oa(t.props)
              ? ((t.el.__isMounted = !1),
                ke(() => {
                  (D(), delete t.el.__isMounted);
                }, i))
              : D());
        } else {
          if (oa(t.props) && e.el.__isMounted === !1) {
            ke(() => {
              ca.process(e, t, n, r, s, i, o, l, a, u);
            }, i);
            return;
          }
          ((t.el = e.el), (t.targetStart = e.targetStart));
          const S = (t.anchor = e.anchor),
            E = (t.target = e.target),
            T = (t.targetAnchor = e.targetAnchor),
            D = pr(e.props),
            R = D ? n : E,
            H = D ? S : T;
          if (
            (o === "svg" || la(E)
              ? (o = "svg")
              : (o === "mathml" || aa(E)) && (o = "mathml"),
            w
              ? (d(e.dynamicChildren, w, R, s, i, o, l), Gi(e, t, !0))
              : a || f(e, t, R, H, s, i, o, l, !1),
            g)
          )
            D
              ? t.props &&
                e.props &&
                t.props.to !== e.props.to &&
                (t.props.to = e.props.to)
              : fs(t, n, S, u, 1);
          else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
            const U = (t.target = Ri(t.props, p));
            U && fs(t, U, null, u, 0);
          } else D && fs(t, E, T, u, 1);
          ds(t, g);
        }
      },
      remove(e, t, n, { um: r, o: { remove: s } }, i) {
        const {
          shapeFlag: o,
          children: l,
          anchor: a,
          targetStart: u,
          targetAnchor: c,
          target: f,
          props: d,
        } = e;
        if ((f && (s(u), s(c)), i && s(a), o & 16)) {
          const h = i || !pr(d);
          for (let p = 0; p < l.length; p++) {
            const y = l[p];
            r(y, t, n, h, !!y.dynamicChildren);
          }
        }
      },
      move: fs,
      hydrate: Hd,
    };
  function fs(e, t, n, { o: { insert: r }, m: s }, i = 2) {
    i === 0 && r(e.targetAnchor, t, n);
    const { el: o, anchor: l, shapeFlag: a, children: u, props: c } = e,
      f = i === 2;
    if ((f && r(o, t, n), (!f || pr(c)) && a & 16))
      for (let d = 0; d < u.length; d++) s(u[d], t, n, 2);
    f && r(l, t, n);
  }
  function Hd(
    e,
    t,
    n,
    r,
    s,
    i,
    {
      o: {
        nextSibling: o,
        parentNode: l,
        querySelector: a,
        insert: u,
        createText: c,
      },
    },
    f,
  ) {
    function d(y, v, g, m) {
      ((v.anchor = f(o(y), v, l(y), n, r, s, i)),
        (v.targetStart = g),
        (v.targetAnchor = m));
    }
    const h = (t.target = Ri(t.props, a)),
      p = pr(t.props);
    if (h) {
      const y = h._lpa || h.firstChild;
      if (t.shapeFlag & 16)
        if (p) d(e, t, y, y && o(y));
        else {
          t.anchor = o(e);
          let v = y;
          for (; v; ) {
            if (v && v.nodeType === 8) {
              if (v.data === "teleport start anchor") t.targetStart = v;
              else if (v.data === "teleport anchor") {
                ((t.targetAnchor = v),
                  (h._lpa = t.targetAnchor && o(t.targetAnchor)));
                break;
              }
            }
            v = o(v);
          }
          (t.targetAnchor || ua(h, t, c, u), f(y && o(y), t, h, n, r, s, i));
        }
      ds(t, p);
    } else p && t.shapeFlag & 16 && d(e, t, e, o(e));
    return t.anchor && o(t.anchor);
  }
  const zd = ca;
  function ds(e, t) {
    const n = e.ctx;
    if (n && n.ut) {
      let r, s;
      for (
        t
          ? ((r = e.el), (s = e.anchor))
          : ((r = e.targetStart), (s = e.targetAnchor));
        r && r !== s;
      )
        (r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid),
          (r = r.nextSibling));
      n.ut();
    }
  }
  function ua(e, t, n, r) {
    const s = (t.targetStart = n("")),
      i = (t.targetAnchor = n(""));
    return ((s[sa] = i), e && (r(s, e), r(i, e)), i);
  }
  const Gt = Symbol("_leaveCb"),
    hs = Symbol("_enterCb");
  function fa() {
    const e = {
      isMounted: !1,
      isLeaving: !1,
      isUnmounting: !1,
      leavingVNodes: new Map(),
    };
    return (
      At(() => {
        e.isMounted = !0;
      }),
      Ni(() => {
        e.isUnmounting = !0;
      }),
      e
    );
  }
  const ot = [Function, Array],
    da = {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      onBeforeEnter: ot,
      onEnter: ot,
      onAfterEnter: ot,
      onEnterCancelled: ot,
      onBeforeLeave: ot,
      onLeave: ot,
      onAfterLeave: ot,
      onLeaveCancelled: ot,
      onBeforeAppear: ot,
      onAppear: ot,
      onAfterAppear: ot,
      onAppearCancelled: ot,
    },
    ha = (e) => {
      const t = e.subTree;
      return t.component ? ha(t.component) : t;
    },
    Wd = {
      name: "BaseTransition",
      props: da,
      setup(e, { slots: t }) {
        const n = qe(),
          r = fa();
        return () => {
          const s = t.default && $i(t.default(), !0);
          if (!s || !s.length) return;
          const i = pa(s),
            o = ae(e),
            { mode: l } = o;
          if (r.isLeaving) return Di(i);
          const a = ga(i);
          if (!a) return Di(i);
          let u = yr(a, o, r, n, (f) => (u = f));
          a.type !== Me && sn(a, u);
          let c = n.subTree && ga(n.subTree);
          if (c && c.type !== Me && !ln(c, a) && ha(n).type !== Me) {
            let f = yr(c, o, r, n);
            if ((sn(c, f), l === "out-in" && a.type !== Me))
              return (
                (r.isLeaving = !0),
                (f.afterLeave = () => {
                  ((r.isLeaving = !1),
                    n.job.flags & 8 || n.update(),
                    delete f.afterLeave,
                    (c = void 0));
                }),
                Di(i)
              );
            l === "in-out" && a.type !== Me
              ? (f.delayLeave = (d, h, p) => {
                  const y = ya(r, c);
                  ((y[String(c.key)] = c),
                    (d[Gt] = () => {
                      (h(),
                        (d[Gt] = void 0),
                        delete u.delayedLeave,
                        (c = void 0));
                    }),
                    (u.delayedLeave = () => {
                      (p(), delete u.delayedLeave, (c = void 0));
                    }));
                })
              : (c = void 0);
          } else c && (c = void 0);
          return i;
        };
      },
    };
  function pa(e) {
    let t = e[0];
    if (e.length > 1) {
      for (const n of e)
        if (n.type !== Me) {
          t = n;
          break;
        }
    }
    return t;
  }
  const Ud = Wd;
  function ya(e, t) {
    const { leavingVNodes: n } = e;
    let r = n.get(t.type);
    return (r || ((r = Object.create(null)), n.set(t.type, r)), r);
  }
  function yr(e, t, n, r, s) {
    const {
        appear: i,
        mode: o,
        persisted: l = !1,
        onBeforeEnter: a,
        onEnter: u,
        onAfterEnter: c,
        onEnterCancelled: f,
        onBeforeLeave: d,
        onLeave: h,
        onAfterLeave: p,
        onLeaveCancelled: y,
        onBeforeAppear: v,
        onAppear: g,
        onAfterAppear: m,
        onAppearCancelled: b,
      } = t,
      w = String(e.key),
      S = ya(n, e),
      E = (R, H) => {
        R && pt(R, r, 9, H);
      },
      T = (R, H) => {
        const U = H[1];
        (E(R, H),
          W(R) ? R.every((P) => P.length <= 1) && U() : R.length <= 1 && U());
      },
      D = {
        mode: o,
        persisted: l,
        beforeEnter(R) {
          let H = a;
          if (!n.isMounted)
            if (i) H = v || a;
            else return;
          R[Gt] && R[Gt](!0);
          const U = S[w];
          (U && ln(e, U) && U.el[Gt] && U.el[Gt](), E(H, [R]));
        },
        enter(R) {
          let H = u,
            U = c,
            P = f;
          if (!n.isMounted)
            if (i) ((H = g || u), (U = m || c), (P = b || f));
            else return;
          let re = !1;
          const I = (R[hs] = (oe) => {
            re ||
              ((re = !0),
              oe ? E(P, [R]) : E(U, [R]),
              D.delayedLeave && D.delayedLeave(),
              (R[hs] = void 0));
          });
          H ? T(H, [R, I]) : I();
        },
        leave(R, H) {
          const U = String(e.key);
          if ((R[hs] && R[hs](!0), n.isUnmounting)) return H();
          E(d, [R]);
          let P = !1;
          const re = (R[Gt] = (I) => {
            P ||
              ((P = !0),
              H(),
              I ? E(y, [R]) : E(p, [R]),
              (R[Gt] = void 0),
              S[U] === e && delete S[U]);
          });
          ((S[U] = e), h ? T(h, [R, re]) : re());
        },
        clone(R) {
          const H = yr(R, t, n, r, s);
          return (s && s(H), H);
        },
      };
    return D;
  }
  function Di(e) {
    if (ys(e)) return ((e = yt(e)), (e.children = null), e);
  }
  function ga(e) {
    if (!ys(e)) return ia(e.type) && e.children ? pa(e.children) : e;
    if (e.component) return e.component.subTree;
    const { shapeFlag: t, children: n } = e;
    if (n) {
      if (t & 16) return n[0];
      if (t & 32 && G(n.default)) return n.default();
    }
  }
  function sn(e, t) {
    e.shapeFlag & 6 && e.component
      ? ((e.transition = t), sn(e.component.subTree, t))
      : e.shapeFlag & 128
        ? ((e.ssContent.transition = t.clone(e.ssContent)),
          (e.ssFallback.transition = t.clone(e.ssFallback)))
        : (e.transition = t);
  }
  function $i(e, t = !1, n) {
    let r = [],
      s = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      const l =
        n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
      o.type === pe
        ? (o.patchFlag & 128 && s++, (r = r.concat($i(o.children, t, l))))
        : (t || o.type !== Me) && r.push(l != null ? yt(o, { key: l }) : o);
    }
    if (s > 1) for (let i = 0; i < r.length; i++) r[i].patchFlag = -2;
    return r;
  }
  function Z(e, t) {
    return G(e) ? Ae({ name: e.name }, t, { setup: e }) : e;
  }
  function ma() {
    const e = qe();
    return e
      ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++
      : "";
  }
  function va(e) {
    e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
  }
  const ps = new WeakMap();
  function gr(e, t, n, r, s = !1) {
    if (W(e)) {
      e.forEach((p, y) => gr(p, t && (W(t) ? t[y] : t), n, r, s));
      return;
    }
    if (on(r) && !s) {
      r.shapeFlag & 512 &&
        r.type.__asyncResolved &&
        r.component.subTree.component &&
        gr(e, t, n, r.component.subTree);
      return;
    }
    const i = r.shapeFlag & 4 ? Ts(r.component) : r.el,
      o = s ? null : i,
      { i: l, r: a } = e,
      u = t && t.r,
      c = l.refs === ye ? (l.refs = {}) : l.refs,
      f = l.setupState,
      d = ae(f),
      h = f === ye ? dl : (p) => ue(d, p);
    if (u != null && u !== a) {
      if ((ba(t), me(u))) ((c[u] = null), h(u) && (f[u] = null));
      else if (Te(u)) {
        u.value = null;
        const p = t;
        p.k && (c[p.k] = null);
      }
    }
    if (G(a)) Bn(a, l, 12, [o, c]);
    else {
      const p = me(a),
        y = Te(a);
      if (p || y) {
        const v = () => {
          if (e.f) {
            const g = p ? (h(a) ? f[a] : c[a]) : a.value;
            if (s) W(g) && vi(g, i);
            else if (W(g)) g.includes(i) || g.push(i);
            else if (p) ((c[a] = [i]), h(a) && (f[a] = c[a]));
            else {
              const m = [i];
              ((a.value = m), e.k && (c[e.k] = m));
            }
          } else
            p
              ? ((c[a] = o), h(a) && (f[a] = o))
              : y && ((a.value = o), e.k && (c[e.k] = o));
        };
        if (o) {
          const g = () => {
            (v(), ps.delete(e));
          };
          ((g.id = -1), ps.set(e, g), ke(g, n));
        } else (ba(e), v());
      }
    }
  }
  function ba(e) {
    const t = ps.get(e);
    t && ((t.flags |= 8), ps.delete(e));
  }
  (Yr().requestIdleCallback, Yr().cancelIdleCallback);
  const on = (e) => !!e.type.__asyncLoader,
    ys = (e) => e.type.__isKeepAlive,
    Kd = {
      name: "KeepAlive",
      __isKeepAlive: !0,
      props: {
        include: [String, RegExp, Array],
        exclude: [String, RegExp, Array],
        max: [String, Number],
      },
      setup(e, { slots: t }) {
        const n = qe(),
          r = n.ctx;
        if (!r.renderer)
          return () => {
            const m = t.default && t.default();
            return m && m.length === 1 ? m[0] : m;
          };
        const s = new Map(),
          i = new Set();
        let o = null;
        const l = n.suspense,
          {
            renderer: {
              p: a,
              m: u,
              um: c,
              o: { createElement: f },
            },
          } = r,
          d = f("div");
        ((r.activate = (m, b, w, S, E) => {
          const T = m.component;
          (u(m, b, w, 0, l),
            a(T.vnode, m, b, w, T, l, S, m.slotScopeIds, E),
            ke(() => {
              ((T.isDeactivated = !1), T.a && $n(T.a));
              const D = m.props && m.props.onVnodeMounted;
              D && lt(D, T.parent, m);
            }, l));
        }),
          (r.deactivate = (m) => {
            const b = m.component;
            (xs(b.m),
              xs(b.a),
              u(m, d, null, 1, l),
              ke(() => {
                b.da && $n(b.da);
                const w = m.props && m.props.onVnodeUnmounted;
                (w && lt(w, b.parent, m), (b.isDeactivated = !0));
              }, l));
          }));
        function h(m) {
          (Li(m), c(m, n, l, !0));
        }
        function p(m) {
          s.forEach((b, w) => {
            const S = Os(on(b) ? b.type.__asyncResolved || {} : b.type);
            S && !m(S) && y(w);
          });
        }
        function y(m) {
          const b = s.get(m);
          (b && (!o || !ln(b, o)) ? h(b) : o && Li(o),
            s.delete(m),
            i.delete(m));
        }
        Ee(
          () => [e.include, e.exclude],
          ([m, b]) => {
            (m && p((w) => mr(m, w)), b && p((w) => !mr(b, w)));
          },
          { flush: "post", deep: !0 },
        );
        let v = null;
        const g = () => {
          v != null &&
            (ws(n.subTree.type)
              ? ke(() => {
                  s.set(v, gs(n.subTree));
                }, n.subTree.suspense)
              : s.set(v, gs(n.subTree)));
        };
        return (
          At(g),
          Ii(g),
          Ni(() => {
            s.forEach((m) => {
              const { subTree: b, suspense: w } = n,
                S = gs(b);
              if (m.type === S.type && m.key === S.key) {
                Li(S);
                const E = S.component.da;
                E && ke(E, w);
                return;
              }
              h(m);
            });
          }),
          () => {
            if (((v = null), !t.default)) return (o = null);
            const m = t.default(),
              b = m[0];
            if (m.length > 1) return ((o = null), m);
            if (!Wn(b) || (!(b.shapeFlag & 4) && !(b.shapeFlag & 128)))
              return ((o = null), b);
            let w = gs(b);
            if (w.type === Me) return ((o = null), w);
            const S = w.type,
              E = Os(on(w) ? w.type.__asyncResolved || {} : S),
              { include: T, exclude: D, max: R } = e;
            if ((T && (!E || !mr(T, E))) || (D && E && mr(D, E)))
              return ((w.shapeFlag &= -257), (o = w), b);
            const H = w.key == null ? S : w.key,
              U = s.get(H);
            return (
              w.el && ((w = yt(w)), b.shapeFlag & 128 && (b.ssContent = w)),
              (v = H),
              U
                ? ((w.el = U.el),
                  (w.component = U.component),
                  w.transition && sn(w, w.transition),
                  (w.shapeFlag |= 512),
                  i.delete(H),
                  i.add(H))
                : (i.add(H),
                  R && i.size > parseInt(R, 10) && y(i.values().next().value)),
              (w.shapeFlag |= 256),
              (o = w),
              ws(b.type) ? b : w
            );
          }
        );
      },
    };
  function mr(e, t) {
    return W(e)
      ? e.some((n) => mr(n, t))
      : me(e)
        ? e.split(",").includes(t)
        : Uf(e)
          ? ((e.lastIndex = 0), e.test(t))
          : !1;
  }
  function qd(e, t) {
    xa(e, "a", t);
  }
  function Gd(e, t) {
    xa(e, "da", t);
  }
  function xa(e, t, n = Ie) {
    const r =
      e.__wdc ||
      (e.__wdc = () => {
        let s = n;
        for (; s; ) {
          if (s.isDeactivated) return;
          s = s.parent;
        }
        return e();
      });
    if ((ms(t, r, n), n)) {
      let s = n.parent;
      for (; s && s.parent; )
        (ys(s.parent.vnode) && Yd(r, t, n, s), (s = s.parent));
    }
  }
  function Yd(e, t, n, r) {
    const s = ms(t, e, r, !0);
    vr(() => {
      vi(r[t], s);
    }, n);
  }
  function Li(e) {
    ((e.shapeFlag &= -257), (e.shapeFlag &= -513));
  }
  function gs(e) {
    return e.shapeFlag & 128 ? e.ssContent : e;
  }
  function ms(e, t, n = Ie, r = !1) {
    if (n) {
      const s = n[e] || (n[e] = []),
        i =
          t.__weh ||
          (t.__weh = (...o) => {
            Et();
            const l = Sr(n),
              a = pt(t, n, e, o);
            return (l(), Ct(), a);
          });
      return (r ? s.unshift(i) : s.push(i), i);
    }
  }
  const Yt =
      (e) =>
      (t, n = Ie) => {
        (!Er || e === "sp") && ms(e, (...r) => t(...r), n);
      },
    Jd = Yt("bm"),
    At = Yt("m"),
    Xd = Yt("bu"),
    Ii = Yt("u"),
    Ni = Yt("bum"),
    vr = Yt("um"),
    Qd = Yt("sp"),
    Zd = Yt("rtg"),
    eh = Yt("rtc");
  function th(e, t = Ie) {
    ms("ec", e, t);
  }
  const wa = "components";
  function de(e, t) {
    return Sa(wa, e, !0, t) || e;
  }
  const _a = Symbol.for("v-ndc");
  function En(e) {
    return me(e) ? Sa(wa, e, !1) || e : e || _a;
  }
  function Sa(e, t, n = !0, r = !1) {
    const s = Pe || Ie;
    if (s) {
      const i = s.type;
      {
        const l = Os(i, !1);
        if (l && (l === t || l === ze(t) || l === Gr(ze(t)))) return i;
      }
      const o = Ea(s[e] || i[e], t) || Ea(s.appContext[e], t);
      return !o && r ? i : o;
    }
  }
  function Ea(e, t) {
    return e && (e[t] || e[ze(t)] || e[Gr(ze(t))]);
  }
  function Hn(e, t, n, r) {
    let s;
    const i = n,
      o = W(e);
    if (o || me(e)) {
      const l = o && wn(e);
      let a = !1,
        u = !1;
      (l && ((a = !Xe(e)), (u = Kt(e)), (e = Qr(e))),
        (s = new Array(e.length)));
      for (let c = 0, f = e.length; c < f; c++)
        s[c] = t(a ? (u ? Nn(ht(e[c])) : ht(e[c])) : e[c], c, void 0, i);
    } else if (typeof e == "number") {
      s = new Array(e);
      for (let l = 0; l < e; l++) s[l] = t(l + 1, l, void 0, i);
    } else if (ge(e))
      if (e[Symbol.iterator]) s = Array.from(e, (l, a) => t(l, a, void 0, i));
      else {
        const l = Object.keys(e);
        s = new Array(l.length);
        for (let a = 0, u = l.length; a < u; a++) {
          const c = l[a];
          s[a] = t(e[c], c, a, i);
        }
      }
    else s = [];
    return s;
  }
  function he(e, t, n = {}, r, s) {
    if (Pe.ce || (Pe.parent && on(Pe.parent) && Pe.parent.ce)) {
      const u = Object.keys(n).length > 0;
      return (
        t !== "default" && (n.name = t),
        M(),
        Y(pe, null, [le("slot", n, r && r())], u ? -2 : 64)
      );
    }
    let i = e[t];
    (i && i._c && (i._d = !1), M());
    const o = i && Ca(i(n)),
      l = n.key || (o && o.key),
      a = Y(
        pe,
        { key: (l && !zt(l) ? l : `_${t}`) + (!o && r ? "_fb" : "") },
        o || (r ? r() : []),
        o && e._ === 1 ? 64 : -2,
      );
    return (
      a.scopeId && (a.slotScopeIds = [a.scopeId + "-s"]),
      i && i._c && (i._d = !0),
      a
    );
  }
  function Ca(e) {
    return e.some((t) =>
      Wn(t) ? !(t.type === Me || (t.type === pe && !Ca(t.children))) : !0,
    )
      ? e
      : null;
  }
  function Ta(e, t) {
    const n = {};
    for (const r in e) n[ir(r)] = e[r];
    return n;
  }
  const Bi = (e) => (e ? (Ja(e) ? Ts(e) : Bi(e.parent)) : null),
    br = Ae(Object.create(null), {
      $: (e) => e,
      $el: (e) => e.vnode.el,
      $data: (e) => e.data,
      $props: (e) => e.props,
      $attrs: (e) => e.attrs,
      $slots: (e) => e.slots,
      $refs: (e) => e.refs,
      $parent: (e) => Bi(e.parent),
      $root: (e) => Bi(e.root),
      $host: (e) => e.ce,
      $emit: (e) => e.emit,
      $options: (e) => Aa(e),
      $forceUpdate: (e) =>
        e.f ||
        (e.f = () => {
          Pi(e.update);
        }),
      $nextTick: (e) => e.n || (e.n = Le.bind(e.proxy)),
      $watch: (e) => Vd.bind(e),
    }),
    Fi = (e, t) => e !== ye && !e.__isScriptSetup && ue(e, t),
    nh = {
      get({ _: e }, t) {
        if (t === "__v_skip") return !0;
        const {
          ctx: n,
          setupState: r,
          data: s,
          props: i,
          accessCache: o,
          type: l,
          appContext: a,
        } = e;
        if (t[0] !== "$") {
          const d = o[t];
          if (d !== void 0)
            switch (d) {
              case 1:
                return r[t];
              case 2:
                return s[t];
              case 4:
                return n[t];
              case 3:
                return i[t];
            }
          else {
            if (Fi(r, t)) return ((o[t] = 1), r[t]);
            if (s !== ye && ue(s, t)) return ((o[t] = 2), s[t]);
            if (ue(i, t)) return ((o[t] = 3), i[t]);
            if (n !== ye && ue(n, t)) return ((o[t] = 4), n[t]);
            Hi && (o[t] = 0);
          }
        }
        const u = br[t];
        let c, f;
        if (u) return (t === "$attrs" && $e(e.attrs, "get", ""), u(e));
        if ((c = l.__cssModules) && (c = c[t])) return c;
        if (n !== ye && ue(n, t)) return ((o[t] = 4), n[t]);
        if (((f = a.config.globalProperties), ue(f, t))) return f[t];
      },
      set({ _: e }, t, n) {
        const { data: r, setupState: s, ctx: i } = e;
        return Fi(s, t)
          ? ((s[t] = n), !0)
          : r !== ye && ue(r, t)
            ? ((r[t] = n), !0)
            : ue(e.props, t) || (t[0] === "$" && t.slice(1) in e)
              ? !1
              : ((i[t] = n), !0);
      },
      has(
        {
          _: {
            data: e,
            setupState: t,
            accessCache: n,
            ctx: r,
            appContext: s,
            props: i,
            type: o,
          },
        },
        l,
      ) {
        let a;
        return !!(
          n[l] ||
          (e !== ye && l[0] !== "$" && ue(e, l)) ||
          Fi(t, l) ||
          ue(i, l) ||
          ue(r, l) ||
          ue(br, l) ||
          ue(s.config.globalProperties, l) ||
          ((a = o.__cssModules) && a[l])
        );
      },
      defineProperty(e, t, n) {
        return (
          n.get != null
            ? (e._.accessCache[t] = 0)
            : ue(n, "value") && this.set(e, t, n.value, null),
          Reflect.defineProperty(e, t, n)
        );
      },
    };
  function rh() {
    return sh().slots;
  }
  function sh(e) {
    const t = qe();
    return t.setupContext || (t.setupContext = Za(t));
  }
  function Vi(e) {
    return W(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
  }
  function ih(e, t) {
    const n = Vi(e);
    for (const r in t) {
      if (r.startsWith("__skip")) continue;
      let s = n[r];
      (s
        ? W(s) || G(s)
          ? (s = n[r] = { type: s, default: t[r] })
          : (s.default = t[r])
        : s === null && (s = n[r] = { default: t[r] }),
        s && t[`__skip_${r}`] && (s.skipFactory = !0));
    }
    return n;
  }
  let Hi = !0;
  function oh(e) {
    const t = Aa(e),
      n = e.proxy,
      r = e.ctx;
    ((Hi = !1), t.beforeCreate && Oa(t.beforeCreate, e, "bc"));
    const {
      data: s,
      computed: i,
      methods: o,
      watch: l,
      provide: a,
      inject: u,
      created: c,
      beforeMount: f,
      mounted: d,
      beforeUpdate: h,
      updated: p,
      activated: y,
      deactivated: v,
      beforeDestroy: g,
      beforeUnmount: m,
      destroyed: b,
      unmounted: w,
      render: S,
      renderTracked: E,
      renderTriggered: T,
      errorCaptured: D,
      serverPrefetch: R,
      expose: H,
      inheritAttrs: U,
      components: P,
      directives: re,
      filters: I,
    } = t;
    if ((u && lh(u, r, null), o))
      for (const X in o) {
        const K = o[X];
        G(K) && (r[X] = K.bind(n));
      }
    if (s) {
      const X = s.call(n, n);
      ge(X) && (e.data = Tt(X));
    }
    if (((Hi = !0), i))
      for (const X in i) {
        const K = i[X],
          xe = G(K) ? K.bind(n, n) : G(K.get) ? K.get.bind(n, n) : _t,
          en = !G(K) && G(K.set) ? K.set.bind(n) : _t,
          He = V({ get: xe, set: en });
        Object.defineProperty(r, X, {
          enumerable: !0,
          configurable: !0,
          get: () => He.value,
          set: (Be) => (He.value = Be),
        });
      }
    if (l) for (const X in l) ja(l[X], r, n, X);
    if (a) {
      const X = G(a) ? a.call(n) : a;
      Reflect.ownKeys(X).forEach((K) => {
        cs(K, X[K]);
      });
    }
    c && Oa(c, e, "c");
    function te(X, K) {
      W(K) ? K.forEach((xe) => X(xe.bind(n))) : K && X(K.bind(n));
    }
    if (
      (te(Jd, f),
      te(At, d),
      te(Xd, h),
      te(Ii, p),
      te(qd, y),
      te(Gd, v),
      te(th, D),
      te(eh, E),
      te(Zd, T),
      te(Ni, m),
      te(vr, w),
      te(Qd, R),
      W(H))
    )
      if (H.length) {
        const X = e.exposed || (e.exposed = {});
        H.forEach((K) => {
          Object.defineProperty(X, K, {
            get: () => n[K],
            set: (xe) => (n[K] = xe),
            enumerable: !0,
          });
        });
      } else e.exposed || (e.exposed = {});
    (S && e.render === _t && (e.render = S),
      U != null && (e.inheritAttrs = U),
      P && (e.components = P),
      re && (e.directives = re),
      R && va(e));
  }
  function lh(e, t, n = _t) {
    W(e) && (e = zi(e));
    for (const r in e) {
      const s = e[r];
      let i;
      (ge(s)
        ? "default" in s
          ? (i = jt(s.from || r, s.default, !0))
          : (i = jt(s.from || r))
        : (i = jt(s)),
        Te(i)
          ? Object.defineProperty(t, r, {
              enumerable: !0,
              configurable: !0,
              get: () => i.value,
              set: (o) => (i.value = o),
            })
          : (t[r] = i));
    }
  }
  function Oa(e, t, n) {
    pt(W(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n);
  }
  function ja(e, t, n, r) {
    let s = r.includes(".") ? ra(n, r) : () => n[r];
    if (me(e)) {
      const i = t[e];
      G(i) && Ee(s, i);
    } else if (G(e)) Ee(s, e.bind(n));
    else if (ge(e))
      if (W(e)) e.forEach((i) => ja(i, t, n, r));
      else {
        const i = G(e.handler) ? e.handler.bind(n) : t[e.handler];
        G(i) && Ee(s, i, e);
      }
  }
  function Aa(e) {
    const t = e.type,
      { mixins: n, extends: r } = t,
      {
        mixins: s,
        optionsCache: i,
        config: { optionMergeStrategies: o },
      } = e.appContext,
      l = i.get(t);
    let a;
    return (
      l
        ? (a = l)
        : !s.length && !n && !r
          ? (a = t)
          : ((a = {}),
            s.length && s.forEach((u) => vs(a, u, o, !0)),
            vs(a, t, o)),
      ge(t) && i.set(t, a),
      a
    );
  }
  function vs(e, t, n, r = !1) {
    const { mixins: s, extends: i } = t;
    (i && vs(e, i, n, !0), s && s.forEach((o) => vs(e, o, n, !0)));
    for (const o in t)
      if (!(r && o === "expose")) {
        const l = ah[o] || (n && n[o]);
        e[o] = l ? l(e[o], t[o]) : t[o];
      }
    return e;
  }
  const ah = {
    data: ka,
    props: Ma,
    emits: Ma,
    methods: xr,
    computed: xr,
    beforeCreate: Ve,
    created: Ve,
    beforeMount: Ve,
    mounted: Ve,
    beforeUpdate: Ve,
    updated: Ve,
    beforeDestroy: Ve,
    beforeUnmount: Ve,
    destroyed: Ve,
    unmounted: Ve,
    activated: Ve,
    deactivated: Ve,
    errorCaptured: Ve,
    serverPrefetch: Ve,
    components: xr,
    directives: xr,
    watch: uh,
    provide: ka,
    inject: ch,
  };
  function ka(e, t) {
    return t
      ? e
        ? function () {
            return Ae(
              G(e) ? e.call(this, this) : e,
              G(t) ? t.call(this, this) : t,
            );
          }
        : t
      : e;
  }
  function ch(e, t) {
    return xr(zi(e), zi(t));
  }
  function zi(e) {
    if (W(e)) {
      const t = {};
      for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
      return t;
    }
    return e;
  }
  function Ve(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
  }
  function xr(e, t) {
    return e ? Ae(Object.create(null), e, t) : t;
  }
  function Ma(e, t) {
    return e
      ? W(e) && W(t)
        ? [...new Set([...e, ...t])]
        : Ae(Object.create(null), Vi(e), Vi(t ?? {}))
      : t;
  }
  function uh(e, t) {
    if (!e) return t;
    if (!t) return e;
    const n = Ae(Object.create(null), e);
    for (const r in t) n[r] = Ve(e[r], t[r]);
    return n;
  }
  function Pa() {
    return {
      app: null,
      config: {
        isNativeTag: dl,
        performance: !1,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {},
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap(),
    };
  }
  let fh = 0;
  function dh(e, t) {
    return function (r, s = null) {
      (G(r) || (r = Ae({}, r)), s != null && !ge(s) && (s = null));
      const i = Pa(),
        o = new WeakSet(),
        l = [];
      let a = !1;
      const u = (i.app = {
        _uid: fh++,
        _component: r,
        _props: s,
        _container: null,
        _context: i,
        _instance: null,
        version: Hh,
        get config() {
          return i.config;
        },
        set config(c) {},
        use(c, ...f) {
          return (
            o.has(c) ||
              (c && G(c.install)
                ? (o.add(c), c.install(u, ...f))
                : G(c) && (o.add(c), c(u, ...f))),
            u
          );
        },
        mixin(c) {
          return (i.mixins.includes(c) || i.mixins.push(c), u);
        },
        component(c, f) {
          return f ? ((i.components[c] = f), u) : i.components[c];
        },
        directive(c, f) {
          return f ? ((i.directives[c] = f), u) : i.directives[c];
        },
        mount(c, f, d) {
          if (!a) {
            const h = u._ceVNode || le(r, s);
            return (
              (h.appContext = i),
              d === !0 ? (d = "svg") : d === !1 && (d = void 0),
              e(h, c, d),
              (a = !0),
              (u._container = c),
              (c.__vue_app__ = u),
              Ts(h.component)
            );
          }
        },
        onUnmount(c) {
          l.push(c);
        },
        unmount() {
          a &&
            (pt(l, u._instance, 16),
            e(null, u._container),
            delete u._container.__vue_app__);
        },
        provide(c, f) {
          return ((i.provides[c] = f), u);
        },
        runWithContext(c) {
          const f = zn;
          zn = u;
          try {
            return c();
          } finally {
            zn = f;
          }
        },
      });
      return u;
    };
  }
  let zn = null;
  const hh = (e, t) =>
    t === "modelValue" || t === "model-value"
      ? e.modelModifiers
      : e[`${t}Modifiers`] || e[`${ze(t)}Modifiers`] || e[`${vn(t)}Modifiers`];
  function ph(e, t, ...n) {
    if (e.isUnmounted) return;
    const r = e.vnode.props || ye;
    let s = n;
    const i = t.startsWith("update:"),
      o = i && hh(r, t.slice(7));
    o &&
      (o.trim && (s = n.map((c) => (me(c) ? c.trim() : c))),
      o.number && (s = n.map(bi)));
    let l,
      a = r[(l = ir(t))] || r[(l = ir(ze(t)))];
    (!a && i && (a = r[(l = ir(vn(t)))]), a && pt(a, e, 6, s));
    const u = r[l + "Once"];
    if (u) {
      if (!e.emitted) e.emitted = {};
      else if (e.emitted[l]) return;
      ((e.emitted[l] = !0), pt(u, e, 6, s));
    }
  }
  const yh = new WeakMap();
  function Ra(e, t, n = !1) {
    const r = n ? yh : t.emitsCache,
      s = r.get(e);
    if (s !== void 0) return s;
    const i = e.emits;
    let o = {},
      l = !1;
    if (!G(e)) {
      const a = (u) => {
        const c = Ra(u, t, !0);
        c && ((l = !0), Ae(o, c));
      };
      (!n && t.mixins.length && t.mixins.forEach(a),
        e.extends && a(e.extends),
        e.mixins && e.mixins.forEach(a));
    }
    return !i && !l
      ? (ge(e) && r.set(e, null), null)
      : (W(i) ? i.forEach((a) => (o[a] = null)) : Ae(o, i),
        ge(e) && r.set(e, o),
        o);
  }
  function bs(e, t) {
    return !e || !Ur(t)
      ? !1
      : ((t = t.slice(2).replace(/Once$/, "")),
        ue(e, t[0].toLowerCase() + t.slice(1)) || ue(e, vn(t)) || ue(e, t));
  }
  function vb() {}
  function Da(e) {
    const {
        type: t,
        vnode: n,
        proxy: r,
        withProxy: s,
        propsOptions: [i],
        slots: o,
        attrs: l,
        emit: a,
        render: u,
        renderCache: c,
        props: f,
        data: d,
        setupState: h,
        ctx: p,
        inheritAttrs: y,
      } = e,
      v = as(e);
    let g, m;
    try {
      if (n.shapeFlag & 4) {
        const w = s || r,
          S = w;
        ((g = kt(u.call(S, w, c, f, h, d, p))), (m = l));
      } else {
        const w = t;
        ((g = kt(
          w.length > 1 ? w(f, { attrs: l, slots: o, emit: a }) : w(f, null),
        )),
          (m = t.props ? l : gh(l)));
      }
    } catch (w) {
      ((wr.length = 0), os(w, e, 1), (g = le(Me)));
    }
    let b = g;
    if (m && y !== !1) {
      const w = Object.keys(m),
        { shapeFlag: S } = b;
      w.length &&
        S & 7 &&
        (i && w.some(mi) && (m = mh(m, i)), (b = yt(b, m, !1, !0)));
    }
    return (
      n.dirs &&
        ((b = yt(b, null, !1, !0)),
        (b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs)),
      n.transition && sn(b, n.transition),
      (g = b),
      as(v),
      g
    );
  }
  const gh = (e) => {
      let t;
      for (const n in e)
        (n === "class" || n === "style" || Ur(n)) &&
          ((t || (t = {}))[n] = e[n]);
      return t;
    },
    mh = (e, t) => {
      const n = {};
      for (const r in e) (!mi(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
      return n;
    };
  function vh(e, t, n) {
    const { props: r, children: s, component: i } = e,
      { props: o, children: l, patchFlag: a } = t,
      u = i.emitsOptions;
    if (t.dirs || t.transition) return !0;
    if (n && a >= 0) {
      if (a & 1024) return !0;
      if (a & 16) return r ? $a(r, o, u) : !!o;
      if (a & 8) {
        const c = t.dynamicProps;
        for (let f = 0; f < c.length; f++) {
          const d = c[f];
          if (o[d] !== r[d] && !bs(u, d)) return !0;
        }
      }
    } else
      return (s || l) && (!l || !l.$stable)
        ? !0
        : r === o
          ? !1
          : r
            ? o
              ? $a(r, o, u)
              : !0
            : !!o;
    return !1;
  }
  function $a(e, t, n) {
    const r = Object.keys(t);
    if (r.length !== Object.keys(e).length) return !0;
    for (let s = 0; s < r.length; s++) {
      const i = r[s];
      if (t[i] !== e[i] && !bs(n, i)) return !0;
    }
    return !1;
  }
  function bh({ vnode: e, parent: t }, n) {
    for (; t; ) {
      const r = t.subTree;
      if (
        (r.suspense && r.suspense.activeBranch === e && (r.el = e.el), r === e)
      )
        (((e = t.vnode).el = n), (t = t.parent));
      else break;
    }
  }
  const La = {},
    Ia = () => Object.create(La),
    Na = (e) => Object.getPrototypeOf(e) === La;
  function xh(e, t, n, r = !1) {
    const s = {},
      i = Ia();
    ((e.propsDefaults = Object.create(null)), Ba(e, t, s, i));
    for (const o in e.propsOptions[0]) o in s || (s[o] = void 0);
    (n
      ? (e.props = r ? s : wd(s))
      : e.type.props
        ? (e.props = s)
        : (e.props = i),
      (e.attrs = i));
  }
  function wh(e, t, n, r) {
    const {
        props: s,
        attrs: i,
        vnode: { patchFlag: o },
      } = e,
      l = ae(s),
      [a] = e.propsOptions;
    let u = !1;
    if ((r || o > 0) && !(o & 16)) {
      if (o & 8) {
        const c = e.vnode.dynamicProps;
        for (let f = 0; f < c.length; f++) {
          let d = c[f];
          if (bs(e.emitsOptions, d)) continue;
          const h = t[d];
          if (a)
            if (ue(i, d)) h !== i[d] && ((i[d] = h), (u = !0));
            else {
              const p = ze(d);
              s[p] = Wi(a, l, p, h, e, !1);
            }
          else h !== i[d] && ((i[d] = h), (u = !0));
        }
      }
    } else {
      Ba(e, t, s, i) && (u = !0);
      let c;
      for (const f in l)
        (!t || (!ue(t, f) && ((c = vn(f)) === f || !ue(t, c)))) &&
          (a
            ? n &&
              (n[f] !== void 0 || n[c] !== void 0) &&
              (s[f] = Wi(a, l, f, void 0, e, !0))
            : delete s[f]);
      if (i !== l)
        for (const f in i) (!t || !ue(t, f)) && (delete i[f], (u = !0));
    }
    u && Wt(e.attrs, "set", "");
  }
  function Ba(e, t, n, r) {
    const [s, i] = e.propsOptions;
    let o = !1,
      l;
    if (t)
      for (let a in t) {
        if (sr(a)) continue;
        const u = t[a];
        let c;
        s && ue(s, (c = ze(a)))
          ? !i || !i.includes(c)
            ? (n[c] = u)
            : ((l || (l = {}))[c] = u)
          : bs(e.emitsOptions, a) ||
            ((!(a in r) || u !== r[a]) && ((r[a] = u), (o = !0)));
      }
    if (i) {
      const a = ae(n),
        u = l || ye;
      for (let c = 0; c < i.length; c++) {
        const f = i[c];
        n[f] = Wi(s, a, f, u[f], e, !ue(u, f));
      }
    }
    return o;
  }
  function Wi(e, t, n, r, s, i) {
    const o = e[n];
    if (o != null) {
      const l = ue(o, "default");
      if (l && r === void 0) {
        const a = o.default;
        if (o.type !== Function && !o.skipFactory && G(a)) {
          const { propsDefaults: u } = s;
          if (n in u) r = u[n];
          else {
            const c = Sr(s);
            ((r = u[n] = a.call(null, t)), c());
          }
        } else r = a;
        s.ce && s.ce._setProp(n, r);
      }
      o[0] &&
        (i && !l ? (r = !1) : o[1] && (r === "" || r === vn(n)) && (r = !0));
    }
    return r;
  }
  const _h = new WeakMap();
  function Fa(e, t, n = !1) {
    const r = n ? _h : t.propsCache,
      s = r.get(e);
    if (s) return s;
    const i = e.props,
      o = {},
      l = [];
    let a = !1;
    if (!G(e)) {
      const c = (f) => {
        a = !0;
        const [d, h] = Fa(f, t, !0);
        (Ae(o, d), h && l.push(...h));
      };
      (!n && t.mixins.length && t.mixins.forEach(c),
        e.extends && c(e.extends),
        e.mixins && e.mixins.forEach(c));
    }
    if (!i && !a) return (ge(e) && r.set(e, Rn), Rn);
    if (W(i))
      for (let c = 0; c < i.length; c++) {
        const f = ze(i[c]);
        Va(f) && (o[f] = ye);
      }
    else if (i)
      for (const c in i) {
        const f = ze(c);
        if (Va(f)) {
          const d = i[c],
            h = (o[f] = W(d) || G(d) ? { type: d } : Ae({}, d)),
            p = h.type;
          let y = !1,
            v = !0;
          if (W(p))
            for (let g = 0; g < p.length; ++g) {
              const m = p[g],
                b = G(m) && m.name;
              if (b === "Boolean") {
                y = !0;
                break;
              } else b === "String" && (v = !1);
            }
          else y = G(p) && p.name === "Boolean";
          ((h[0] = y), (h[1] = v), (y || ue(h, "default")) && l.push(f));
        }
      }
    const u = [o, l];
    return (ge(e) && r.set(e, u), u);
  }
  function Va(e) {
    return e[0] !== "$" && !sr(e);
  }
  const Ui = (e) => e === "_" || e === "_ctx" || e === "$stable",
    Ki = (e) => (W(e) ? e.map(kt) : [kt(e)]),
    Sh = (e, t, n) => {
      if (t._n) return t;
      const r = se((...s) => Ki(t(...s)), n);
      return ((r._c = !1), r);
    },
    Ha = (e, t, n) => {
      const r = e._ctx;
      for (const s in e) {
        if (Ui(s)) continue;
        const i = e[s];
        if (G(i)) t[s] = Sh(s, i, r);
        else if (i != null) {
          const o = Ki(i);
          t[s] = () => o;
        }
      }
    },
    za = (e, t) => {
      const n = Ki(t);
      e.slots.default = () => n;
    },
    Wa = (e, t, n) => {
      for (const r in t) (n || !Ui(r)) && (e[r] = t[r]);
    },
    Eh = (e, t, n) => {
      const r = (e.slots = Ia());
      if (e.vnode.shapeFlag & 32) {
        const s = t._;
        s ? (Wa(r, t, n), n && ml(r, "_", s, !0)) : Ha(t, r);
      } else t && za(e, t);
    },
    Ch = (e, t, n) => {
      const { vnode: r, slots: s } = e;
      let i = !0,
        o = ye;
      if (r.shapeFlag & 32) {
        const l = t._;
        (l
          ? n && l === 1
            ? (i = !1)
            : Wa(s, t, n)
          : ((i = !t.$stable), Ha(t, s)),
          (o = t));
      } else t && (za(e, t), (o = { default: 1 }));
      if (i) for (const l in s) !Ui(l) && o[l] == null && delete s[l];
    },
    ke = kh;
  function Th(e) {
    return Oh(e);
  }
  function Oh(e, t) {
    const n = Yr();
    n.__VUE__ = !0;
    const {
        insert: r,
        remove: s,
        patchProp: i,
        createElement: o,
        createText: l,
        createComment: a,
        setText: u,
        setElementText: c,
        parentNode: f,
        nextSibling: d,
        setScopeId: h = _t,
        insertStaticContent: p,
      } = e,
      y = (
        x,
        _,
        C,
        k = null,
        O = null,
        j = null,
        N = void 0,
        L = null,
        $ = !!_.dynamicChildren,
      ) => {
        if (x === _) return;
        (x && !ln(x, _) && ((k = gi(x)), Be(x, O, j, !0), (x = null)),
          _.patchFlag === -2 && (($ = !1), (_.dynamicChildren = null)));
        const { type: A, ref: q, shapeFlag: B } = _;
        switch (A) {
          case _s:
            v(x, _, C, k);
            break;
          case Me:
            g(x, _, C, k);
            break;
          case Yi:
            x == null && m(_, C, k, N);
            break;
          case pe:
            P(x, _, C, k, O, j, N, L, $);
            break;
          default:
            B & 1
              ? S(x, _, C, k, O, j, N, L, $)
              : B & 6
                ? re(x, _, C, k, O, j, N, L, $)
                : (B & 64 || B & 128) &&
                  A.process(x, _, C, k, O, j, N, L, $, zr);
        }
        q != null && O
          ? gr(q, x && x.ref, j, _ || x, !_)
          : q == null && x && x.ref != null && gr(x.ref, null, j, x, !0);
      },
      v = (x, _, C, k) => {
        if (x == null) r((_.el = l(_.children)), C, k);
        else {
          const O = (_.el = x.el);
          _.children !== x.children && u(O, _.children);
        }
      },
      g = (x, _, C, k) => {
        x == null ? r((_.el = a(_.children || "")), C, k) : (_.el = x.el);
      },
      m = (x, _, C, k) => {
        [x.el, x.anchor] = p(x.children, _, C, k, x.el, x.anchor);
      },
      b = ({ el: x, anchor: _ }, C, k) => {
        let O;
        for (; x && x !== _; ) ((O = d(x)), r(x, C, k), (x = O));
        r(_, C, k);
      },
      w = ({ el: x, anchor: _ }) => {
        let C;
        for (; x && x !== _; ) ((C = d(x)), s(x), (x = C));
        s(_);
      },
      S = (x, _, C, k, O, j, N, L, $) => {
        if (
          (_.type === "svg" ? (N = "svg") : _.type === "math" && (N = "mathml"),
          x == null)
        )
          E(_, C, k, O, j, N, L, $);
        else {
          const A = x.el && x.el._isVueCE ? x.el : null;
          try {
            (A && A._beginPatch(), R(x, _, O, j, N, L, $));
          } finally {
            A && A._endPatch();
          }
        }
      },
      E = (x, _, C, k, O, j, N, L) => {
        let $, A;
        const { props: q, shapeFlag: B, transition: z, dirs: ne } = x;
        if (
          (($ = x.el = o(x.type, j, q && q.is, q)),
          B & 8
            ? c($, x.children)
            : B & 16 && D(x.children, $, null, k, O, qi(x, j), N, L),
          ne && Sn(x, null, k, "created"),
          T($, x, x.scopeId, N, k),
          q)
        ) {
          for (const be in q)
            be !== "value" && !sr(be) && i($, be, null, q[be], j, k);
          ("value" in q && i($, "value", null, q.value, j),
            (A = q.onVnodeBeforeMount) && lt(A, k, x));
        }
        ne && Sn(x, null, k, "beforeMount");
        const ce = jh(O, z);
        (ce && z.beforeEnter($),
          r($, _, C),
          ((A = q && q.onVnodeMounted) || ce || ne) &&
            ke(() => {
              (A && lt(A, k, x),
                ce && z.enter($),
                ne && Sn(x, null, k, "mounted"));
            }, O));
      },
      T = (x, _, C, k, O) => {
        if ((C && h(x, C), k)) for (let j = 0; j < k.length; j++) h(x, k[j]);
        if (O) {
          let j = O.subTree;
          if (
            _ === j ||
            (ws(j.type) && (j.ssContent === _ || j.ssFallback === _))
          ) {
            const N = O.vnode;
            T(x, N, N.scopeId, N.slotScopeIds, O.parent);
          }
        }
      },
      D = (x, _, C, k, O, j, N, L, $ = 0) => {
        for (let A = $; A < x.length; A++) {
          const q = (x[A] = L ? an(x[A]) : kt(x[A]));
          y(null, q, _, C, k, O, j, N, L);
        }
      },
      R = (x, _, C, k, O, j, N) => {
        const L = (_.el = x.el);
        let { patchFlag: $, dynamicChildren: A, dirs: q } = _;
        $ |= x.patchFlag & 16;
        const B = x.props || ye,
          z = _.props || ye;
        let ne;
        if (
          (C && Cn(C, !1),
          (ne = z.onVnodeBeforeUpdate) && lt(ne, C, _, x),
          q && Sn(_, x, C, "beforeUpdate"),
          C && Cn(C, !0),
          ((B.innerHTML && z.innerHTML == null) ||
            (B.textContent && z.textContent == null)) &&
            c(L, ""),
          A
            ? H(x.dynamicChildren, A, L, C, k, qi(_, O), j)
            : N || K(x, _, L, null, C, k, qi(_, O), j, !1),
          $ > 0)
        ) {
          if ($ & 16) U(L, B, z, C, O);
          else if (
            ($ & 2 && B.class !== z.class && i(L, "class", null, z.class, O),
            $ & 4 && i(L, "style", B.style, z.style, O),
            $ & 8)
          ) {
            const ce = _.dynamicProps;
            for (let be = 0; be < ce.length; be++) {
              const fe = ce[be],
                Ye = B[fe],
                Je = z[fe];
              (Je !== Ye || fe === "value") && i(L, fe, Ye, Je, O, C);
            }
          }
          $ & 1 && x.children !== _.children && c(L, _.children);
        } else !N && A == null && U(L, B, z, C, O);
        ((ne = z.onVnodeUpdated) || q) &&
          ke(() => {
            (ne && lt(ne, C, _, x), q && Sn(_, x, C, "updated"));
          }, k);
      },
      H = (x, _, C, k, O, j, N) => {
        for (let L = 0; L < _.length; L++) {
          const $ = x[L],
            A = _[L],
            q =
              $.el && ($.type === pe || !ln($, A) || $.shapeFlag & 198)
                ? f($.el)
                : C;
          y($, A, q, null, k, O, j, N, !0);
        }
      },
      U = (x, _, C, k, O) => {
        if (_ !== C) {
          if (_ !== ye)
            for (const j in _) !sr(j) && !(j in C) && i(x, j, _[j], null, O, k);
          for (const j in C) {
            if (sr(j)) continue;
            const N = C[j],
              L = _[j];
            N !== L && j !== "value" && i(x, j, L, N, O, k);
          }
          "value" in C && i(x, "value", _.value, C.value, O);
        }
      },
      P = (x, _, C, k, O, j, N, L, $) => {
        const A = (_.el = x ? x.el : l("")),
          q = (_.anchor = x ? x.anchor : l(""));
        let { patchFlag: B, dynamicChildren: z, slotScopeIds: ne } = _;
        (ne && (L = L ? L.concat(ne) : ne),
          x == null
            ? (r(A, C, k), r(q, C, k), D(_.children || [], C, q, O, j, N, L, $))
            : B > 0 &&
                B & 64 &&
                z &&
                x.dynamicChildren &&
                x.dynamicChildren.length === z.length
              ? (H(x.dynamicChildren, z, C, O, j, N, L),
                (_.key != null || (O && _ === O.subTree)) && Gi(x, _, !0))
              : K(x, _, C, q, O, j, N, L, $));
      },
      re = (x, _, C, k, O, j, N, L, $) => {
        ((_.slotScopeIds = L),
          x == null
            ? _.shapeFlag & 512
              ? O.ctx.activate(_, C, k, N, $)
              : I(_, C, k, O, j, N, $)
            : oe(x, _, $));
      },
      I = (x, _, C, k, O, j, N) => {
        const L = (x.component = $h(x, k, O));
        if ((ys(x) && (L.ctx.renderer = zr), Lh(L, !1, N), L.asyncDep)) {
          if ((O && O.registerDep(L, te, N), !x.el)) {
            const $ = (L.subTree = le(Me));
            (g(null, $, _, C), (x.placeholder = $.el));
          }
        } else te(L, x, _, C, O, j, N);
      },
      oe = (x, _, C) => {
        const k = (_.component = x.component);
        if (vh(x, _, C))
          if (k.asyncDep && !k.asyncResolved) {
            X(k, _, C);
            return;
          } else ((k.next = _), k.update());
        else ((_.el = x.el), (k.vnode = _));
      },
      te = (x, _, C, k, O, j, N) => {
        const L = () => {
          if (x.isMounted) {
            let { next: B, bu: z, u: ne, parent: ce, vnode: be } = x;
            {
              const Vt = Ua(x);
              if (Vt) {
                (B && ((B.el = be.el), X(x, B, N)),
                  Vt.asyncDep.then(() => {
                    x.isUnmounted || L();
                  }));
                return;
              }
            }
            let fe = B,
              Ye;
            (Cn(x, !1),
              B ? ((B.el = be.el), X(x, B, N)) : (B = be),
              z && $n(z),
              (Ye = B.props && B.props.onVnodeBeforeUpdate) &&
                lt(Ye, ce, B, be),
              Cn(x, !0));
            const Je = Da(x),
              Ft = x.subTree;
            ((x.subTree = Je),
              y(Ft, Je, f(Ft.el), gi(Ft), x, O, j),
              (B.el = Je.el),
              fe === null && bh(x, Je.el),
              ne && ke(ne, O),
              (Ye = B.props && B.props.onVnodeUpdated) &&
                ke(() => lt(Ye, ce, B, be), O));
          } else {
            let B;
            const { el: z, props: ne } = _,
              { bm: ce, m: be, parent: fe, root: Ye, type: Je } = x,
              Ft = on(_);
            (Cn(x, !1),
              ce && $n(ce),
              !Ft && (B = ne && ne.onVnodeBeforeMount) && lt(B, fe, _),
              Cn(x, !0));
            {
              Ye.ce &&
                Ye.ce._def.shadowRoot !== !1 &&
                Ye.ce._injectChildStyle(Je);
              const Vt = (x.subTree = Da(x));
              (y(null, Vt, C, k, x, O, j), (_.el = Vt.el));
            }
            if ((be && ke(be, O), !Ft && (B = ne && ne.onVnodeMounted))) {
              const Vt = _;
              ke(() => lt(B, fe, Vt), O);
            }
            ((_.shapeFlag & 256 ||
              (fe && on(fe.vnode) && fe.vnode.shapeFlag & 256)) &&
              x.a &&
              ke(x.a, O),
              (x.isMounted = !0),
              (_ = C = k = null));
          }
        };
        x.scope.on();
        const $ = (x.effect = new El(L));
        x.scope.off();
        const A = (x.update = $.run.bind($)),
          q = (x.job = $.runIfDirty.bind($));
        ((q.i = x),
          (q.id = x.uid),
          ($.scheduler = () => Pi(q)),
          Cn(x, !0),
          A());
      },
      X = (x, _, C) => {
        _.component = x;
        const k = x.vnode.props;
        ((x.vnode = _),
          (x.next = null),
          wh(x, _.props, k, C),
          Ch(x, _.children, C),
          Et(),
          Xl(x),
          Ct());
      },
      K = (x, _, C, k, O, j, N, L, $ = !1) => {
        const A = x && x.children,
          q = x ? x.shapeFlag : 0,
          B = _.children,
          { patchFlag: z, shapeFlag: ne } = _;
        if (z > 0) {
          if (z & 128) {
            en(A, B, C, k, O, j, N, L, $);
            return;
          } else if (z & 256) {
            xe(A, B, C, k, O, j, N, L, $);
            return;
          }
        }
        ne & 8
          ? (q & 16 && Hr(A, O, j), B !== A && c(C, B))
          : q & 16
            ? ne & 16
              ? en(A, B, C, k, O, j, N, L, $)
              : Hr(A, O, j, !0)
            : (q & 8 && c(C, ""), ne & 16 && D(B, C, k, O, j, N, L, $));
      },
      xe = (x, _, C, k, O, j, N, L, $) => {
        ((x = x || Rn), (_ = _ || Rn));
        const A = x.length,
          q = _.length,
          B = Math.min(A, q);
        let z;
        for (z = 0; z < B; z++) {
          const ne = (_[z] = $ ? an(_[z]) : kt(_[z]));
          y(x[z], ne, C, null, O, j, N, L, $);
        }
        A > q ? Hr(x, O, j, !0, !1, B) : D(_, C, k, O, j, N, L, $, B);
      },
      en = (x, _, C, k, O, j, N, L, $) => {
        let A = 0;
        const q = _.length;
        let B = x.length - 1,
          z = q - 1;
        for (; A <= B && A <= z; ) {
          const ne = x[A],
            ce = (_[A] = $ ? an(_[A]) : kt(_[A]));
          if (ln(ne, ce)) y(ne, ce, C, null, O, j, N, L, $);
          else break;
          A++;
        }
        for (; A <= B && A <= z; ) {
          const ne = x[B],
            ce = (_[z] = $ ? an(_[z]) : kt(_[z]));
          if (ln(ne, ce)) y(ne, ce, C, null, O, j, N, L, $);
          else break;
          (B--, z--);
        }
        if (A > B) {
          if (A <= z) {
            const ne = z + 1,
              ce = ne < q ? _[ne].el : k;
            for (; A <= z; )
              (y(null, (_[A] = $ ? an(_[A]) : kt(_[A])), C, ce, O, j, N, L, $),
                A++);
          }
        } else if (A > z) for (; A <= B; ) (Be(x[A], O, j, !0), A++);
        else {
          const ne = A,
            ce = A,
            be = new Map();
          for (A = ce; A <= z; A++) {
            const it = (_[A] = $ ? an(_[A]) : kt(_[A]));
            it.key != null && be.set(it.key, A);
          }
          let fe,
            Ye = 0;
          const Je = z - ce + 1;
          let Ft = !1,
            Vt = 0;
          const Wr = new Array(Je);
          for (A = 0; A < Je; A++) Wr[A] = 0;
          for (A = ne; A <= B; A++) {
            const it = x[A];
            if (Ye >= Je) {
              Be(it, O, j, !0);
              continue;
            }
            let Ht;
            if (it.key != null) Ht = be.get(it.key);
            else
              for (fe = ce; fe <= z; fe++)
                if (Wr[fe - ce] === 0 && ln(it, _[fe])) {
                  Ht = fe;
                  break;
                }
            Ht === void 0
              ? Be(it, O, j, !0)
              : ((Wr[Ht - ce] = A + 1),
                Ht >= Vt ? (Vt = Ht) : (Ft = !0),
                y(it, _[Ht], C, null, O, j, N, L, $),
                Ye++);
          }
          const Vf = Ft ? Ah(Wr) : Rn;
          for (fe = Vf.length - 1, A = Je - 1; A >= 0; A--) {
            const it = ce + A,
              Ht = _[it],
              Hf = _[it + 1],
              zf = it + 1 < q ? Hf.el || Ka(Hf) : k;
            Wr[A] === 0
              ? y(null, Ht, C, zf, O, j, N, L, $)
              : Ft && (fe < 0 || A !== Vf[fe] ? He(Ht, C, zf, 2) : fe--);
          }
        }
      },
      He = (x, _, C, k, O = null) => {
        const { el: j, type: N, transition: L, children: $, shapeFlag: A } = x;
        if (A & 6) {
          He(x.component.subTree, _, C, k);
          return;
        }
        if (A & 128) {
          x.suspense.move(_, C, k);
          return;
        }
        if (A & 64) {
          N.move(x, _, C, zr);
          return;
        }
        if (N === pe) {
          r(j, _, C);
          for (let B = 0; B < $.length; B++) He($[B], _, C, k);
          r(x.anchor, _, C);
          return;
        }
        if (N === Yi) {
          b(x, _, C);
          return;
        }
        if (k !== 2 && A & 1 && L)
          if (k === 0) (L.beforeEnter(j), r(j, _, C), ke(() => L.enter(j), O));
          else {
            const { leave: B, delayLeave: z, afterLeave: ne } = L,
              ce = () => {
                x.ctx.isUnmounted ? s(j) : r(j, _, C);
              },
              be = () => {
                (j._isLeaving && j[Gt](!0),
                  B(j, () => {
                    (ce(), ne && ne());
                  }));
              };
            z ? z(j, ce, be) : be();
          }
        else r(j, _, C);
      },
      Be = (x, _, C, k = !1, O = !1) => {
        const {
          type: j,
          props: N,
          ref: L,
          children: $,
          dynamicChildren: A,
          shapeFlag: q,
          patchFlag: B,
          dirs: z,
          cacheIndex: ne,
        } = x;
        if (
          (B === -2 && (O = !1),
          L != null && (Et(), gr(L, null, C, x, !0), Ct()),
          ne != null && (_.renderCache[ne] = void 0),
          q & 256)
        ) {
          _.ctx.deactivate(x);
          return;
        }
        const ce = q & 1 && z,
          be = !on(x);
        let fe;
        if ((be && (fe = N && N.onVnodeBeforeUnmount) && lt(fe, _, x), q & 6))
          yi(x.component, C, k);
        else {
          if (q & 128) {
            x.suspense.unmount(C, k);
            return;
          }
          (ce && Sn(x, null, _, "beforeUnmount"),
            q & 64
              ? x.type.remove(x, _, C, zr, k)
              : A && !A.hasOnce && (j !== pe || (B > 0 && B & 64))
                ? Hr(A, _, C, !1, !0)
                : ((j === pe && B & 384) || (!O && q & 16)) && Hr($, _, C),
            k && Mn(x));
        }
        ((be && (fe = N && N.onVnodeUnmounted)) || ce) &&
          ke(() => {
            (fe && lt(fe, _, x), ce && Sn(x, null, _, "unmounted"));
          }, C);
      },
      Mn = (x) => {
        const { type: _, el: C, anchor: k, transition: O } = x;
        if (_ === pe) {
          Bt(C, k);
          return;
        }
        if (_ === Yi) {
          w(x);
          return;
        }
        const j = () => {
          (s(C), O && !O.persisted && O.afterLeave && O.afterLeave());
        };
        if (x.shapeFlag & 1 && O && !O.persisted) {
          const { leave: N, delayLeave: L } = O,
            $ = () => N(C, j);
          L ? L(x.el, j, $) : $();
        } else j();
      },
      Bt = (x, _) => {
        let C;
        for (; x !== _; ) ((C = d(x)), s(x), (x = C));
        s(_);
      },
      yi = (x, _, C) => {
        const { bum: k, scope: O, job: j, subTree: N, um: L, m: $, a: A } = x;
        (xs($),
          xs(A),
          k && $n(k),
          O.stop(),
          j && ((j.flags |= 8), Be(N, x, _, C)),
          L && ke(L, _),
          ke(() => {
            x.isUnmounted = !0;
          }, _));
      },
      Hr = (x, _, C, k = !1, O = !1, j = 0) => {
        for (let N = j; N < x.length; N++) Be(x[N], _, C, k, O);
      },
      gi = (x) => {
        if (x.shapeFlag & 6) return gi(x.component.subTree);
        if (x.shapeFlag & 128) return x.suspense.next();
        const _ = d(x.anchor || x.el),
          C = _ && _[sa];
        return C ? d(C) : _;
      };
    let fl = !1;
    const Ff = (x, _, C) => {
        let k;
        (x == null
          ? _._vnode && (Be(_._vnode, null, null, !0), (k = _._vnode.component))
          : y(_._vnode || null, x, _, null, null, null, C),
          (_._vnode = x),
          fl || ((fl = !0), Xl(k), Ql(), (fl = !1)));
      },
      zr = {
        p: y,
        um: Be,
        m: He,
        r: Mn,
        mt: I,
        mc: D,
        pc: K,
        pbc: H,
        n: gi,
        o: e,
      };
    return { render: Ff, hydrate: void 0, createApp: dh(Ff) };
  }
  function qi({ type: e, props: t }, n) {
    return (n === "svg" && e === "foreignObject") ||
      (n === "mathml" &&
        e === "annotation-xml" &&
        t &&
        t.encoding &&
        t.encoding.includes("html"))
      ? void 0
      : n;
  }
  function Cn({ effect: e, job: t }, n) {
    n ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
  }
  function jh(e, t) {
    return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
  }
  function Gi(e, t, n = !1) {
    const r = e.children,
      s = t.children;
    if (W(r) && W(s))
      for (let i = 0; i < r.length; i++) {
        const o = r[i];
        let l = s[i];
        (l.shapeFlag & 1 &&
          !l.dynamicChildren &&
          ((l.patchFlag <= 0 || l.patchFlag === 32) &&
            ((l = s[i] = an(s[i])), (l.el = o.el)),
          !n && l.patchFlag !== -2 && Gi(o, l)),
          l.type === _s &&
            (l.patchFlag !== -1
              ? (l.el = o.el)
              : (l.__elIndex = i + (e.type === pe ? 1 : 0))),
          l.type === Me && !l.el && (l.el = o.el));
      }
  }
  function Ah(e) {
    const t = e.slice(),
      n = [0];
    let r, s, i, o, l;
    const a = e.length;
    for (r = 0; r < a; r++) {
      const u = e[r];
      if (u !== 0) {
        if (((s = n[n.length - 1]), e[s] < u)) {
          ((t[r] = s), n.push(r));
          continue;
        }
        for (i = 0, o = n.length - 1; i < o; )
          ((l = (i + o) >> 1), e[n[l]] < u ? (i = l + 1) : (o = l));
        u < e[n[i]] && (i > 0 && (t[r] = n[i - 1]), (n[i] = r));
      }
    }
    for (i = n.length, o = n[i - 1]; i-- > 0; ) ((n[i] = o), (o = t[o]));
    return n;
  }
  function Ua(e) {
    const t = e.subTree.component;
    if (t) return t.asyncDep && !t.asyncResolved ? t : Ua(t);
  }
  function xs(e) {
    if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
  }
  function Ka(e) {
    if (e.placeholder) return e.placeholder;
    const t = e.component;
    return t ? Ka(t.subTree) : null;
  }
  const ws = (e) => e.__isSuspense;
  function kh(e, t) {
    t && t.pendingBranch
      ? W(e)
        ? t.effects.push(...e)
        : t.effects.push(e)
      : Nd(e);
  }
  const pe = Symbol.for("v-fgt"),
    _s = Symbol.for("v-txt"),
    Me = Symbol.for("v-cmt"),
    Yi = Symbol.for("v-stc"),
    wr = [];
  let Qe = null;
  function M(e = !1) {
    wr.push((Qe = e ? null : []));
  }
  function Mh() {
    (wr.pop(), (Qe = wr[wr.length - 1] || null));
  }
  let _r = 1;
  function Ss(e, t = !1) {
    ((_r += e), e < 0 && Qe && t && (Qe.hasOnce = !0));
  }
  function qa(e) {
    return (
      (e.dynamicChildren = _r > 0 ? Qe || Rn : null),
      Mh(),
      _r > 0 && Qe && Qe.push(e),
      e
    );
  }
  function ee(e, t, n, r, s, i) {
    return qa(J(e, t, n, r, s, i, !0));
  }
  function Y(e, t, n, r, s) {
    return qa(le(e, t, n, r, s, !0));
  }
  function Wn(e) {
    return e ? e.__v_isVNode === !0 : !1;
  }
  function ln(e, t) {
    return e.type === t.type && e.key === t.key;
  }
  const Ga = ({ key: e }) => e ?? null,
    Es = ({ ref: e, ref_key: t, ref_for: n }) => (
      typeof e == "number" && (e = "" + e),
      e != null
        ? me(e) || Te(e) || G(e)
          ? { i: Pe, r: e, k: t, f: !!n }
          : e
        : null
    );
  function J(
    e,
    t = null,
    n = null,
    r = 0,
    s = null,
    i = e === pe ? 0 : 1,
    o = !1,
    l = !1,
  ) {
    const a = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e,
      props: t,
      key: t && Ga(t),
      ref: t && Es(t),
      scopeId: ea,
      slotScopeIds: null,
      children: n,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag: i,
      patchFlag: r,
      dynamicProps: s,
      dynamicChildren: null,
      appContext: null,
      ctx: Pe,
    };
    return (
      l
        ? (Xi(a, n), i & 128 && e.normalize(a))
        : n && (a.shapeFlag |= me(n) ? 8 : 16),
      _r > 0 &&
        !o &&
        Qe &&
        (a.patchFlag > 0 || i & 6) &&
        a.patchFlag !== 32 &&
        Qe.push(a),
      a
    );
  }
  const le = Ph;
  function Ph(e, t = null, n = null, r = 0, s = null, i = !1) {
    if (((!e || e === _a) && (e = Me), Wn(e))) {
      const l = yt(e, t, !0);
      return (
        n && Xi(l, n),
        _r > 0 &&
          !i &&
          Qe &&
          (l.shapeFlag & 6 ? (Qe[Qe.indexOf(e)] = l) : Qe.push(l)),
        (l.patchFlag = -2),
        l
      );
    }
    if ((Vh(e) && (e = e.__vccOpts), t)) {
      t = Ji(t);
      let { class: l, style: a } = t;
      (l && !me(l) && (t.class = we(l)),
        ge(a) && (rs(a) && !W(a) && (a = Ae({}, a)), (t.style = St(a))));
    }
    const o = me(e) ? 1 : ws(e) ? 128 : ia(e) ? 64 : ge(e) ? 4 : G(e) ? 2 : 0;
    return J(e, t, n, r, s, o, i, !0);
  }
  function Ji(e) {
    return e ? (rs(e) || Na(e) ? Ae({}, e) : e) : null;
  }
  function yt(e, t, n = !1, r = !1) {
    const { props: s, ref: i, patchFlag: o, children: l, transition: a } = e,
      u = t ? Ke(s || {}, t) : s,
      c = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: u,
        key: u && Ga(u),
        ref:
          t && t.ref
            ? n && i
              ? W(i)
                ? i.concat(Es(t))
                : [i, Es(t)]
              : Es(t)
            : i,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: l,
        target: e.target,
        targetStart: e.targetStart,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== pe ? (o === -1 ? 16 : o | 16) : o,
        dynamicProps: e.dynamicProps,
        dynamicChildren: e.dynamicChildren,
        appContext: e.appContext,
        dirs: e.dirs,
        transition: a,
        component: e.component,
        suspense: e.suspense,
        ssContent: e.ssContent && yt(e.ssContent),
        ssFallback: e.ssFallback && yt(e.ssFallback),
        placeholder: e.placeholder,
        el: e.el,
        anchor: e.anchor,
        ctx: e.ctx,
        ce: e.ce,
      };
    return (a && r && sn(c, a.clone(c)), c);
  }
  function Ue(e = " ", t = 0) {
    return le(_s, null, e, t);
  }
  function Se(e = "", t = !1) {
    return t ? (M(), Y(Me, null, e)) : le(Me, null, e);
  }
  function kt(e) {
    return e == null || typeof e == "boolean"
      ? le(Me)
      : W(e)
        ? le(pe, null, e.slice())
        : Wn(e)
          ? an(e)
          : le(_s, null, String(e));
  }
  function an(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : yt(e);
  }
  function Xi(e, t) {
    let n = 0;
    const { shapeFlag: r } = e;
    if (t == null) t = null;
    else if (W(t)) n = 16;
    else if (typeof t == "object")
      if (r & 65) {
        const s = t.default;
        s && (s._c && (s._d = !1), Xi(e, s()), s._c && (s._d = !0));
        return;
      } else {
        n = 32;
        const s = t._;
        !s && !Na(t)
          ? (t._ctx = Pe)
          : s === 3 &&
            Pe &&
            (Pe.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
      }
    else
      G(t)
        ? ((t = { default: t, _ctx: Pe }), (n = 32))
        : ((t = String(t)), r & 64 ? ((n = 16), (t = [Ue(t)])) : (n = 8));
    ((e.children = t), (e.shapeFlag |= n));
  }
  function Ke(...e) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      for (const s in r)
        if (s === "class")
          t.class !== r.class && (t.class = we([t.class, r.class]));
        else if (s === "style") t.style = St([t.style, r.style]);
        else if (Ur(s)) {
          const i = t[s],
            o = r[s];
          o &&
            i !== o &&
            !(W(i) && i.includes(o)) &&
            (t[s] = i ? [].concat(i, o) : o);
        } else s !== "" && (t[s] = r[s]);
    }
    return t;
  }
  function lt(e, t, n, r = null) {
    pt(e, t, 7, [n, r]);
  }
  const Rh = Pa();
  let Dh = 0;
  function $h(e, t, n) {
    const r = e.type,
      s = (t ? t.appContext : e.appContext) || Rh,
      i = {
        uid: Dh++,
        vnode: e,
        type: r,
        parent: t,
        appContext: s,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        job: null,
        scope: new td(!0),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: t ? t.provides : Object.create(s.provides),
        ids: t ? t.ids : ["", 0, 0],
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: Fa(r, s),
        emitsOptions: Ra(r, s),
        emit: null,
        emitted: null,
        propsDefaults: ye,
        inheritAttrs: r.inheritAttrs,
        ctx: ye,
        data: ye,
        props: ye,
        attrs: ye,
        slots: ye,
        refs: ye,
        setupState: ye,
        setupContext: null,
        suspense: n,
        suspenseId: n ? n.pendingId : 0,
        asyncDep: null,
        asyncResolved: !1,
        isMounted: !1,
        isUnmounted: !1,
        isDeactivated: !1,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null,
      };
    return (
      (i.ctx = { _: i }),
      (i.root = t ? t.root : i),
      (i.emit = ph.bind(null, i)),
      e.ce && e.ce(i),
      i
    );
  }
  let Ie = null;
  const qe = () => Ie || Pe;
  let Cs, Qi;
  {
    const e = Yr(),
      t = (n, r) => {
        let s;
        return (
          (s = e[n]) || (s = e[n] = []),
          s.push(r),
          (i) => {
            s.length > 1 ? s.forEach((o) => o(i)) : s[0](i);
          }
        );
      };
    ((Cs = t("__VUE_INSTANCE_SETTERS__", (n) => (Ie = n))),
      (Qi = t("__VUE_SSR_SETTERS__", (n) => (Er = n))));
  }
  const Sr = (e) => {
      const t = Ie;
      return (
        Cs(e),
        e.scope.on(),
        () => {
          (e.scope.off(), Cs(t));
        }
      );
    },
    Ya = () => {
      (Ie && Ie.scope.off(), Cs(null));
    };
  function Ja(e) {
    return e.vnode.shapeFlag & 4;
  }
  let Er = !1;
  function Lh(e, t = !1, n = !1) {
    t && Qi(t);
    const { props: r, children: s } = e.vnode,
      i = Ja(e);
    (xh(e, r, i, t), Eh(e, s, n || t));
    const o = i ? Ih(e, t) : void 0;
    return (t && Qi(!1), o);
  }
  function Ih(e, t) {
    const n = e.type;
    ((e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, nh)));
    const { setup: r } = n;
    if (r) {
      Et();
      const s = (e.setupContext = r.length > 1 ? Za(e) : null),
        i = Sr(e),
        o = Bn(r, e, 0, [e.props, s]),
        l = pl(o);
      if ((Ct(), i(), (l || e.sp) && !on(e) && va(e), l)) {
        if ((o.then(Ya, Ya), t))
          return o
            .then((a) => {
              Xa(e, a);
            })
            .catch((a) => {
              os(a, e, 0);
            });
        e.asyncDep = o;
      } else Xa(e, o);
    } else Qa(e);
  }
  function Xa(e, t, n) {
    (G(t)
      ? e.type.__ssrInlineRender
        ? (e.ssrRender = t)
        : (e.render = t)
      : ge(t) && (e.setupState = zl(t)),
      Qa(e));
  }
  function Qa(e, t, n) {
    const r = e.type;
    e.render || (e.render = r.render || _t);
    {
      const s = Sr(e);
      Et();
      try {
        oh(e);
      } finally {
        (Ct(), s());
      }
    }
  }
  const Nh = {
    get(e, t) {
      return ($e(e, "get", ""), e[t]);
    },
  };
  function Za(e) {
    const t = (n) => {
      e.exposed = n || {};
    };
    return {
      attrs: new Proxy(e.attrs, Nh),
      slots: e.slots,
      emit: e.emit,
      expose: t,
    };
  }
  function Ts(e) {
    return e.exposed
      ? e.exposeProxy ||
          (e.exposeProxy = new Proxy(zl(_d(e.exposed)), {
            get(t, n) {
              if (n in t) return t[n];
              if (n in br) return br[n](e);
            },
            has(t, n) {
              return n in t || n in br;
            },
          }))
      : e.proxy;
  }
  const Bh = /(?:^|[-_])\w/g,
    Fh = (e) => e.replace(Bh, (t) => t.toUpperCase()).replace(/[-_]/g, "");
  function Os(e, t = !0) {
    return G(e) ? e.displayName || e.name : e.name || (t && e.__name);
  }
  function ec(e, t, n = !1) {
    let r = Os(t);
    if (!r && t.__file) {
      const s = t.__file.match(/([^/\\]+)\.\w+$/);
      s && (r = s[1]);
    }
    if (!r && e) {
      const s = (i) => {
        for (const o in i) if (i[o] === t) return o;
      };
      r =
        s(e.components) ||
        (e.parent && s(e.parent.type.components)) ||
        s(e.appContext.components);
    }
    return r ? Fh(r) : n ? "App" : "Anonymous";
  }
  function Vh(e) {
    return G(e) && "__vccOpts" in e;
  }
  const V = (e, t) => Ad(e, t, Er);
  function cn(e, t, n) {
    try {
      Ss(-1);
      const r = arguments.length;
      return r === 2
        ? ge(t) && !W(t)
          ? Wn(t)
            ? le(e, null, [t])
            : le(e, t)
          : le(e, null, t)
        : (r > 3
            ? (n = Array.prototype.slice.call(arguments, 2))
            : r === 3 && Wn(n) && (n = [n]),
          le(e, t, n));
    } finally {
      Ss(1);
    }
  }
  const Hh = "3.5.26";
  let Zi;
  const tc = typeof window < "u" && window.trustedTypes;
  if (tc)
    try {
      Zi = tc.createPolicy("vue", { createHTML: (e) => e });
    } catch {}
  const nc = Zi ? (e) => Zi.createHTML(e) : (e) => e,
    zh = "http://www.w3.org/2000/svg",
    Wh = "http://www.w3.org/1998/Math/MathML",
    Jt = typeof document < "u" ? document : null,
    rc = Jt && Jt.createElement("template"),
    Uh = {
      insert: (e, t, n) => {
        t.insertBefore(e, n || null);
      },
      remove: (e) => {
        const t = e.parentNode;
        t && t.removeChild(e);
      },
      createElement: (e, t, n, r) => {
        const s =
          t === "svg"
            ? Jt.createElementNS(zh, e)
            : t === "mathml"
              ? Jt.createElementNS(Wh, e)
              : n
                ? Jt.createElement(e, { is: n })
                : Jt.createElement(e);
        return (
          e === "select" &&
            r &&
            r.multiple != null &&
            s.setAttribute("multiple", r.multiple),
          s
        );
      },
      createText: (e) => Jt.createTextNode(e),
      createComment: (e) => Jt.createComment(e),
      setText: (e, t) => {
        e.nodeValue = t;
      },
      setElementText: (e, t) => {
        e.textContent = t;
      },
      parentNode: (e) => e.parentNode,
      nextSibling: (e) => e.nextSibling,
      querySelector: (e) => Jt.querySelector(e),
      setScopeId(e, t) {
        e.setAttribute(t, "");
      },
      insertStaticContent(e, t, n, r, s, i) {
        const o = n ? n.previousSibling : t.lastChild;
        if (s && (s === i || s.nextSibling))
          for (
            ;
            t.insertBefore(s.cloneNode(!0), n),
              !(s === i || !(s = s.nextSibling));
          );
        else {
          rc.innerHTML = nc(
            r === "svg"
              ? `<svg>${e}</svg>`
              : r === "mathml"
                ? `<math>${e}</math>`
                : e,
          );
          const l = rc.content;
          if (r === "svg" || r === "mathml") {
            const a = l.firstChild;
            for (; a.firstChild; ) l.appendChild(a.firstChild);
            l.removeChild(a);
          }
          t.insertBefore(l, n);
        }
        return [
          o ? o.nextSibling : t.firstChild,
          n ? n.previousSibling : t.lastChild,
        ];
      },
    },
    un = "transition",
    Cr = "animation",
    Un = Symbol("_vtc"),
    sc = {
      name: String,
      type: String,
      css: { type: Boolean, default: !0 },
      duration: [String, Number, Object],
      enterFromClass: String,
      enterActiveClass: String,
      enterToClass: String,
      appearFromClass: String,
      appearActiveClass: String,
      appearToClass: String,
      leaveFromClass: String,
      leaveActiveClass: String,
      leaveToClass: String,
    },
    ic = Ae({}, da, sc),
    oc = ((e) => ((e.displayName = "Transition"), (e.props = ic), e))(
      (e, { slots: t }) => cn(Ud, ac(e), t),
    ),
    Tn = (e, t = []) => {
      W(e) ? e.forEach((n) => n(...t)) : e && e(...t);
    },
    lc = (e) => (e ? (W(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
  function ac(e) {
    const t = {};
    for (const P in e) P in sc || (t[P] = e[P]);
    if (e.css === !1) return t;
    const {
        name: n = "v",
        type: r,
        duration: s,
        enterFromClass: i = `${n}-enter-from`,
        enterActiveClass: o = `${n}-enter-active`,
        enterToClass: l = `${n}-enter-to`,
        appearFromClass: a = i,
        appearActiveClass: u = o,
        appearToClass: c = l,
        leaveFromClass: f = `${n}-leave-from`,
        leaveActiveClass: d = `${n}-leave-active`,
        leaveToClass: h = `${n}-leave-to`,
      } = e,
      p = Kh(s),
      y = p && p[0],
      v = p && p[1],
      {
        onBeforeEnter: g,
        onEnter: m,
        onEnterCancelled: b,
        onLeave: w,
        onLeaveCancelled: S,
        onBeforeAppear: E = g,
        onAppear: T = m,
        onAppearCancelled: D = b,
      } = t,
      R = (P, re, I, oe) => {
        ((P._enterCancelled = oe),
          fn(P, re ? c : l),
          fn(P, re ? u : o),
          I && I());
      },
      H = (P, re) => {
        ((P._isLeaving = !1), fn(P, f), fn(P, h), fn(P, d), re && re());
      },
      U = (P) => (re, I) => {
        const oe = P ? T : m,
          te = () => R(re, P, I);
        (Tn(oe, [re, te]),
          cc(() => {
            (fn(re, P ? a : i), Mt(re, P ? c : l), lc(oe) || uc(re, r, y, te));
          }));
      };
    return Ae(t, {
      onBeforeEnter(P) {
        (Tn(g, [P]), Mt(P, i), Mt(P, o));
      },
      onBeforeAppear(P) {
        (Tn(E, [P]), Mt(P, a), Mt(P, u));
      },
      onEnter: U(!1),
      onAppear: U(!0),
      onLeave(P, re) {
        P._isLeaving = !0;
        const I = () => H(P, re);
        (Mt(P, f),
          P._enterCancelled ? (Mt(P, d), to(P)) : (to(P), Mt(P, d)),
          cc(() => {
            P._isLeaving && (fn(P, f), Mt(P, h), lc(w) || uc(P, r, v, I));
          }),
          Tn(w, [P, I]));
      },
      onEnterCancelled(P) {
        (R(P, !1, void 0, !0), Tn(b, [P]));
      },
      onAppearCancelled(P) {
        (R(P, !0, void 0, !0), Tn(D, [P]));
      },
      onLeaveCancelled(P) {
        (H(P), Tn(S, [P]));
      },
    });
  }
  function Kh(e) {
    if (e == null) return null;
    if (ge(e)) return [eo(e.enter), eo(e.leave)];
    {
      const t = eo(e);
      return [t, t];
    }
  }
  function eo(e) {
    return Yf(e);
  }
  function Mt(e, t) {
    (t.split(/\s+/).forEach((n) => n && e.classList.add(n)),
      (e[Un] || (e[Un] = new Set())).add(t));
  }
  function fn(e, t) {
    t.split(/\s+/).forEach((r) => r && e.classList.remove(r));
    const n = e[Un];
    n && (n.delete(t), n.size || (e[Un] = void 0));
  }
  function cc(e) {
    requestAnimationFrame(() => {
      requestAnimationFrame(e);
    });
  }
  let qh = 0;
  function uc(e, t, n, r) {
    const s = (e._endId = ++qh),
      i = () => {
        s === e._endId && r();
      };
    if (n != null) return setTimeout(i, n);
    const { type: o, timeout: l, propCount: a } = fc(e, t);
    if (!o) return r();
    const u = o + "end";
    let c = 0;
    const f = () => {
        (e.removeEventListener(u, d), i());
      },
      d = (h) => {
        h.target === e && ++c >= a && f();
      };
    (setTimeout(() => {
      c < a && f();
    }, l + 1),
      e.addEventListener(u, d));
  }
  function fc(e, t) {
    const n = window.getComputedStyle(e),
      r = (p) => (n[p] || "").split(", "),
      s = r(`${un}Delay`),
      i = r(`${un}Duration`),
      o = dc(s, i),
      l = r(`${Cr}Delay`),
      a = r(`${Cr}Duration`),
      u = dc(l, a);
    let c = null,
      f = 0,
      d = 0;
    t === un
      ? o > 0 && ((c = un), (f = o), (d = i.length))
      : t === Cr
        ? u > 0 && ((c = Cr), (f = u), (d = a.length))
        : ((f = Math.max(o, u)),
          (c = f > 0 ? (o > u ? un : Cr) : null),
          (d = c ? (c === un ? i.length : a.length) : 0));
    const h =
      c === un &&
      /\b(?:transform|all)(?:,|$)/.test(r(`${un}Property`).toString());
    return { type: c, timeout: f, propCount: d, hasTransform: h };
  }
  function dc(e, t) {
    for (; e.length < t.length; ) e = e.concat(e);
    return Math.max(...t.map((n, r) => hc(n) + hc(e[r])));
  }
  function hc(e) {
    return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function to(e) {
    return (e ? e.ownerDocument : document).body.offsetHeight;
  }
  function Gh(e, t, n) {
    const r = e[Un];
    (r && (t = (t ? [t, ...r] : [...r]).join(" ")),
      t == null
        ? e.removeAttribute("class")
        : n
          ? e.setAttribute("class", t)
          : (e.className = t));
  }
  const pc = Symbol("_vod"),
    Yh = Symbol("_vsh"),
    Jh = Symbol(""),
    Xh = /(?:^|;)\s*display\s*:/;
  function Qh(e, t, n) {
    const r = e.style,
      s = me(n);
    let i = !1;
    if (n && !s) {
      if (t)
        if (me(t))
          for (const o of t.split(";")) {
            const l = o.slice(0, o.indexOf(":")).trim();
            n[l] == null && js(r, l, "");
          }
        else for (const o in t) n[o] == null && js(r, o, "");
      for (const o in n) (o === "display" && (i = !0), js(r, o, n[o]));
    } else if (s) {
      if (t !== n) {
        const o = r[Jh];
        (o && (n += ";" + o), (r.cssText = n), (i = Xh.test(n)));
      }
    } else t && e.removeAttribute("style");
    pc in e && ((e[pc] = i ? r.display : ""), e[Yh] && (r.display = "none"));
  }
  const yc = /\s*!important$/;
  function js(e, t, n) {
    if (W(n)) n.forEach((r) => js(e, t, r));
    else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
    else {
      const r = Zh(e, t);
      yc.test(n)
        ? e.setProperty(vn(r), n.replace(yc, ""), "important")
        : (e[r] = n);
    }
  }
  const gc = ["Webkit", "Moz", "ms"],
    no = {};
  function Zh(e, t) {
    const n = no[t];
    if (n) return n;
    let r = ze(t);
    if (r !== "filter" && r in e) return (no[t] = r);
    r = Gr(r);
    for (let s = 0; s < gc.length; s++) {
      const i = gc[s] + r;
      if (i in e) return (no[t] = i);
    }
    return t;
  }
  const mc = "http://www.w3.org/1999/xlink";
  function vc(e, t, n, r, s, i = ed(t)) {
    r && t.startsWith("xlink:")
      ? n == null
        ? e.removeAttributeNS(mc, t.slice(6, t.length))
        : e.setAttributeNS(mc, t, n)
      : n == null || (i && !xl(n))
        ? e.removeAttribute(t)
        : e.setAttribute(t, i ? "" : zt(n) ? String(n) : n);
  }
  function bc(e, t, n, r, s) {
    if (t === "innerHTML" || t === "textContent") {
      n != null && (e[t] = t === "innerHTML" ? nc(n) : n);
      return;
    }
    const i = e.tagName;
    if (t === "value" && i !== "PROGRESS" && !i.includes("-")) {
      const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value,
        a = n == null ? (e.type === "checkbox" ? "on" : "") : String(n);
      ((l !== a || !("_value" in e)) && (e.value = a),
        n == null && e.removeAttribute(t),
        (e._value = n));
      return;
    }
    let o = !1;
    if (n === "" || n == null) {
      const l = typeof e[t];
      l === "boolean"
        ? (n = xl(n))
        : n == null && l === "string"
          ? ((n = ""), (o = !0))
          : l === "number" && ((n = 0), (o = !0));
    }
    try {
      e[t] = n;
    } catch {}
    o && e.removeAttribute(s || t);
  }
  function Kn(e, t, n, r) {
    e.addEventListener(t, n, r);
  }
  function ep(e, t, n, r) {
    e.removeEventListener(t, n, r);
  }
  const xc = Symbol("_vei");
  function tp(e, t, n, r, s = null) {
    const i = e[xc] || (e[xc] = {}),
      o = i[t];
    if (r && o) o.value = r;
    else {
      const [l, a] = np(t);
      if (r) {
        const u = (i[t] = ip(r, s));
        Kn(e, l, u, a);
      } else o && (ep(e, l, o, a), (i[t] = void 0));
    }
  }
  const wc = /(?:Once|Passive|Capture)$/;
  function np(e) {
    let t;
    if (wc.test(e)) {
      t = {};
      let r;
      for (; (r = e.match(wc)); )
        ((e = e.slice(0, e.length - r[0].length)),
          (t[r[0].toLowerCase()] = !0));
    }
    return [e[2] === ":" ? e.slice(3) : vn(e.slice(2)), t];
  }
  let ro = 0;
  const rp = Promise.resolve(),
    sp = () => ro || (rp.then(() => (ro = 0)), (ro = Date.now()));
  function ip(e, t) {
    const n = (r) => {
      if (!r._vts) r._vts = Date.now();
      else if (r._vts <= n.attached) return;
      pt(op(r, n.value), t, 5, [r]);
    };
    return ((n.value = e), (n.attached = sp()), n);
  }
  function op(e, t) {
    if (W(t)) {
      const n = e.stopImmediatePropagation;
      return (
        (e.stopImmediatePropagation = () => {
          (n.call(e), (e._stopped = !0));
        }),
        t.map((r) => (s) => !s._stopped && r && r(s))
      );
    } else return t;
  }
  const _c = (e) =>
      e.charCodeAt(0) === 111 &&
      e.charCodeAt(1) === 110 &&
      e.charCodeAt(2) > 96 &&
      e.charCodeAt(2) < 123,
    lp = (e, t, n, r, s, i) => {
      const o = s === "svg";
      t === "class"
        ? Gh(e, r, o)
        : t === "style"
          ? Qh(e, n, r)
          : Ur(t)
            ? mi(t) || tp(e, t, n, r, i)
            : (
                  t[0] === "."
                    ? ((t = t.slice(1)), !0)
                    : t[0] === "^"
                      ? ((t = t.slice(1)), !1)
                      : ap(e, t, r, o)
                )
              ? (bc(e, t, r),
                !e.tagName.includes("-") &&
                  (t === "value" || t === "checked" || t === "selected") &&
                  vc(e, t, r, o, i, t !== "value"))
              : e._isVueCE && (/[A-Z]/.test(t) || !me(r))
                ? bc(e, ze(t), r, i, t)
                : (t === "true-value"
                    ? (e._trueValue = r)
                    : t === "false-value" && (e._falseValue = r),
                  vc(e, t, r, o));
    };
  function ap(e, t, n, r) {
    if (r)
      return !!(
        t === "innerHTML" ||
        t === "textContent" ||
        (t in e && _c(t) && G(n))
      );
    if (
      t === "spellcheck" ||
      t === "draggable" ||
      t === "translate" ||
      t === "autocorrect" ||
      (t === "sandbox" && e.tagName === "IFRAME") ||
      t === "form" ||
      (t === "list" && e.tagName === "INPUT") ||
      (t === "type" && e.tagName === "TEXTAREA")
    )
      return !1;
    if (t === "width" || t === "height") {
      const s = e.tagName;
      if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
        return !1;
    }
    return _c(t) && me(n) ? !1 : t in e;
  }
  const Sc = new WeakMap(),
    Ec = new WeakMap(),
    As = Symbol("_moveCb"),
    Cc = Symbol("_enterCb"),
    cp = ((e) => (delete e.props.mode, e))({
      name: "TransitionGroup",
      props: Ae({}, ic, { tag: String, moveClass: String }),
      setup(e, { slots: t }) {
        const n = qe(),
          r = fa();
        let s, i;
        return (
          Ii(() => {
            if (!s.length) return;
            const o = e.moveClass || `${e.name || "v"}-move`;
            if (!hp(s[0].el, n.vnode.el, o)) {
              s = [];
              return;
            }
            (s.forEach(up), s.forEach(fp));
            const l = s.filter(dp);
            (to(n.vnode.el),
              l.forEach((a) => {
                const u = a.el,
                  c = u.style;
                (Mt(u, o),
                  (c.transform =
                    c.webkitTransform =
                    c.transitionDuration =
                      ""));
                const f = (u[As] = (d) => {
                  (d && d.target !== u) ||
                    ((!d || d.propertyName.endsWith("transform")) &&
                      (u.removeEventListener("transitionend", f),
                      (u[As] = null),
                      fn(u, o)));
                });
                u.addEventListener("transitionend", f);
              }),
              (s = []));
          }),
          () => {
            const o = ae(e),
              l = ac(o);
            let a = o.tag || pe;
            if (((s = []), i))
              for (let u = 0; u < i.length; u++) {
                const c = i[u];
                c.el &&
                  c.el instanceof Element &&
                  (s.push(c),
                  sn(c, yr(c, l, r, n)),
                  Sc.set(c, { left: c.el.offsetLeft, top: c.el.offsetTop }));
              }
            i = t.default ? $i(t.default()) : [];
            for (let u = 0; u < i.length; u++) {
              const c = i[u];
              c.key != null && sn(c, yr(c, l, r, n));
            }
            return le(a, null, i);
          }
        );
      },
    });
  function up(e) {
    const t = e.el;
    (t[As] && t[As](), t[Cc] && t[Cc]());
  }
  function fp(e) {
    Ec.set(e, { left: e.el.offsetLeft, top: e.el.offsetTop });
  }
  function dp(e) {
    const t = Sc.get(e),
      n = Ec.get(e),
      r = t.left - n.left,
      s = t.top - n.top;
    if (r || s) {
      const i = e.el.style;
      return (
        (i.transform = i.webkitTransform = `translate(${r}px,${s}px)`),
        (i.transitionDuration = "0s"),
        e
      );
    }
  }
  function hp(e, t, n) {
    const r = e.cloneNode(),
      s = e[Un];
    (s &&
      s.forEach((l) => {
        l.split(/\s+/).forEach((a) => a && r.classList.remove(a));
      }),
      n.split(/\s+/).forEach((l) => l && r.classList.add(l)),
      (r.style.display = "none"));
    const i = t.nodeType === 1 ? t : t.parentNode;
    i.appendChild(r);
    const { hasTransform: o } = fc(r);
    return (i.removeChild(r), o);
  }
  const Tc = (e) => {
    const t = e.props["onUpdate:modelValue"] || !1;
    return W(t) ? (n) => $n(t, n) : t;
  };
  function pp(e) {
    e.target.composing = !0;
  }
  function Oc(e) {
    const t = e.target;
    t.composing && ((t.composing = !1), t.dispatchEvent(new Event("input")));
  }
  const so = Symbol("_assign");
  function jc(e, t, n) {
    return (t && (e = e.trim()), n && (e = bi(e)), e);
  }
  const Ac = {
      created(e, { modifiers: { lazy: t, trim: n, number: r } }, s) {
        e[so] = Tc(s);
        const i = r || (s.props && s.props.type === "number");
        (Kn(e, t ? "change" : "input", (o) => {
          o.target.composing || e[so](jc(e.value, n, i));
        }),
          (n || i) &&
            Kn(e, "change", () => {
              e.value = jc(e.value, n, i);
            }),
          t ||
            (Kn(e, "compositionstart", pp),
            Kn(e, "compositionend", Oc),
            Kn(e, "change", Oc)));
      },
      mounted(e, { value: t }) {
        e.value = t ?? "";
      },
      beforeUpdate(
        e,
        { value: t, oldValue: n, modifiers: { lazy: r, trim: s, number: i } },
        o,
      ) {
        if (((e[so] = Tc(o)), e.composing)) return;
        const l =
            (i || e.type === "number") && !/^0\d/.test(e.value)
              ? bi(e.value)
              : e.value,
          a = t ?? "";
        l !== a &&
          ((document.activeElement === e &&
            e.type !== "range" &&
            ((r && t === n) || (s && e.value.trim() === a))) ||
            (e.value = a));
      },
    },
    yp = ["ctrl", "shift", "alt", "meta"],
    gp = {
      stop: (e) => e.stopPropagation(),
      prevent: (e) => e.preventDefault(),
      self: (e) => e.target !== e.currentTarget,
      ctrl: (e) => !e.ctrlKey,
      shift: (e) => !e.shiftKey,
      alt: (e) => !e.altKey,
      meta: (e) => !e.metaKey,
      left: (e) => "button" in e && e.button !== 0,
      middle: (e) => "button" in e && e.button !== 1,
      right: (e) => "button" in e && e.button !== 2,
      exact: (e, t) => yp.some((n) => e[`${n}Key`] && !t.includes(n)),
    },
    kc = (e, t) => {
      const n = e._withMods || (e._withMods = {}),
        r = t.join(".");
      return (
        n[r] ||
        (n[r] = (s, ...i) => {
          for (let o = 0; o < t.length; o++) {
            const l = gp[t[o]];
            if (l && l(s, t)) return;
          }
          return e(s, ...i);
        })
      );
    },
    mp = Ae({ patchProp: lp }, Uh);
  let Mc;
  function vp() {
    return Mc || (Mc = Th(mp));
  }
  const Pc = (...e) => {
    const t = vp().createApp(...e),
      { mount: n } = t;
    return (
      (t.mount = (r) => {
        const s = xp(r);
        if (!s) return;
        const i = t._component;
        (!G(i) && !i.render && !i.template && (i.template = s.innerHTML),
          s.nodeType === 1 && (s.textContent = ""));
        const o = n(s, !1, bp(s));
        return (
          s instanceof Element &&
            (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")),
          o
        );
      }),
      t
    );
  };
  function bp(e) {
    if (e instanceof SVGElement) return "svg";
    if (typeof MathMLElement == "function" && e instanceof MathMLElement)
      return "mathml";
  }
  function xp(e) {
    return me(e) ? document.querySelector(e) : e;
  }
  const wp = typeof window < "u" && typeof document < "u";
  typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
  const _p = Object.prototype.toString,
    Sp = (e) => _p.call(e) === "[object Object]",
    Ep = () => {};
  function Cp(...e) {
    if (e.length !== 1) return Kl(...e);
    const t = e[0];
    return typeof t == "function" ? xn(Wl(() => ({ get: t, set: Ep }))) : Q(t);
  }
  function Tp(e, t) {
    function n(...r) {
      return new Promise((s, i) => {
        Promise.resolve(
          e(() => t.apply(this, r), { fn: t, thisArg: this, args: r }),
        )
          .then(s)
          .catch(i);
      });
    }
    return n;
  }
  const Rc = (e) => e();
  function Op(e = Rc, t = {}) {
    const { initialState: n = "active" } = t,
      r = Cp(n === "active");
    function s() {
      r.value = !1;
    }
    function i() {
      r.value = !0;
    }
    const o = (...l) => {
      r.value && e(...l);
    };
    return { isActive: xn(r), pause: s, resume: i, eventFilter: o };
  }
  function io(e) {
    return Array.isArray(e) ? e : [e];
  }
  function jp(e) {
    return qe();
  }
  function Ap(e, t, n = {}) {
    const { eventFilter: r = Rc, ...s } = n;
    return Ee(e, Tp(r, t), s);
  }
  function kp(e, t, n = {}) {
    const { eventFilter: r, initialState: s = "active", ...i } = n,
      {
        eventFilter: o,
        pause: l,
        resume: a,
        isActive: u,
      } = Op(r, { initialState: s });
    return {
      stop: Ap(e, t, { ...i, eventFilter: o }),
      pause: l,
      resume: a,
      isActive: u,
    };
  }
  const Mp = kp;
  function Pp(e, t = !0, n) {
    jp() ? At(e, n) : t ? e() : Le(e);
  }
  function Rp(e, t, n) {
    return Ee(e, t, { ...n, immediate: !0 });
  }
  const Tr = wp ? window : void 0;
  function Dp(e) {
    var t;
    const n = Oe(e);
    return (t = n?.$el) !== null && t !== void 0 ? t : n;
  }
  function Dc(...e) {
    const t = (r, s, i, o) => (
        r.addEventListener(s, i, o),
        () => r.removeEventListener(s, i, o)
      ),
      n = V(() => {
        const r = io(Oe(e[0])).filter((s) => s != null);
        return r.every((s) => typeof s != "string") ? r : void 0;
      });
    return Rp(
      () => {
        var r, s;
        return [
          (r =
            (s = n.value) === null || s === void 0
              ? void 0
              : s.map((i) => Dp(i))) !== null && r !== void 0
            ? r
            : [Tr].filter((i) => i != null),
          io(Oe(n.value ? e[1] : e[0])),
          io(F(n.value ? e[2] : e[1])),
          Oe(n.value ? e[3] : e[2]),
        ];
      },
      ([r, s, i, o], l, a) => {
        if (!r?.length || !s?.length || !i?.length) return;
        const u = Sp(o) ? { ...o } : o,
          c = r.flatMap((f) => s.flatMap((d) => i.map((h) => t(f, d, h, u))));
        a(() => {
          c.forEach((f) => f());
        });
      },
      { flush: "post" },
    );
  }
  const ks =
      typeof globalThis < "u"
        ? globalThis
        : typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof self < "u"
              ? self
              : {},
    Ms = "__vueuse_ssr_handlers__",
    $p = Lp();
  function Lp() {
    return (Ms in ks || (ks[Ms] = ks[Ms] || {}), ks[Ms]);
  }
  function Ip(e, t) {
    return $p[e] || t;
  }
  function Np(e) {
    return e == null
      ? "any"
      : e instanceof Set
        ? "set"
        : e instanceof Map
          ? "map"
          : e instanceof Date
            ? "date"
            : typeof e == "boolean"
              ? "boolean"
              : typeof e == "string"
                ? "string"
                : typeof e == "object"
                  ? "object"
                  : Number.isNaN(e)
                    ? "any"
                    : "number";
  }
  const Bp = {
      boolean: { read: (e) => e === "true", write: (e) => String(e) },
      object: { read: (e) => JSON.parse(e), write: (e) => JSON.stringify(e) },
      number: { read: (e) => Number.parseFloat(e), write: (e) => String(e) },
      any: { read: (e) => e, write: (e) => String(e) },
      string: { read: (e) => e, write: (e) => String(e) },
      map: {
        read: (e) => new Map(JSON.parse(e)),
        write: (e) => JSON.stringify(Array.from(e.entries())),
      },
      set: {
        read: (e) => new Set(JSON.parse(e)),
        write: (e) => JSON.stringify(Array.from(e)),
      },
      date: { read: (e) => new Date(e), write: (e) => e.toISOString() },
    },
    $c = "vueuse-storage";
  function Lc(e, t, n, r = {}) {
    var s;
    const {
        flush: i = "pre",
        deep: o = !0,
        listenToStorageChanges: l = !0,
        writeDefaults: a = !0,
        mergeDefaults: u = !1,
        shallow: c,
        window: f = Tr,
        eventFilter: d,
        onError: h = (I) => {
          console.error(I);
        },
        initOnMounted: p,
      } = r,
      y = (c ? fr : Q)(typeof t == "function" ? t() : t),
      v = V(() => Oe(e));
    if (!n)
      try {
        n = Ip("getDefaultStorage", () => Tr?.localStorage)();
      } catch (I) {
        h(I);
      }
    if (!n) return y;
    const g = Oe(t),
      m = Np(g),
      b = (s = r.serializer) !== null && s !== void 0 ? s : Bp[m],
      { pause: w, resume: S } = Mp(y, (I) => H(I), {
        flush: i,
        deep: o,
        eventFilter: d,
      });
    Ee(v, () => P(), { flush: i });
    let E = !1;
    const T = (I) => {
        (p && !E) || P(I);
      },
      D = (I) => {
        (p && !E) || re(I);
      };
    (f &&
      l &&
      (n instanceof Storage
        ? Dc(f, "storage", T, { passive: !0 })
        : Dc(f, $c, D)),
      p
        ? Pp(() => {
            ((E = !0), P());
          })
        : P());
    function R(I, oe) {
      if (f) {
        const te = { key: v.value, oldValue: I, newValue: oe, storageArea: n };
        f.dispatchEvent(
          n instanceof Storage
            ? new StorageEvent("storage", te)
            : new CustomEvent($c, { detail: te }),
        );
      }
    }
    function H(I) {
      try {
        const oe = n.getItem(v.value);
        if (I == null) (R(oe, null), n.removeItem(v.value));
        else {
          const te = b.write(I);
          oe !== te && (n.setItem(v.value, te), R(oe, te));
        }
      } catch (oe) {
        h(oe);
      }
    }
    function U(I) {
      const oe = I ? I.newValue : n.getItem(v.value);
      if (oe == null)
        return (a && g != null && n.setItem(v.value, b.write(g)), g);
      if (!I && u) {
        const te = b.read(oe);
        return typeof u == "function"
          ? u(te, g)
          : m === "object" && !Array.isArray(te)
            ? { ...g, ...te }
            : te;
      } else return typeof oe != "string" ? oe : b.read(oe);
    }
    function P(I) {
      if (!(I && I.storageArea !== n)) {
        if (I && I.key == null) {
          y.value = g;
          return;
        }
        if (!(I && I.key !== v.value)) {
          w();
          try {
            const oe = b.write(y.value);
            (I === void 0 || I?.newValue !== oe) && (y.value = U(I));
          } catch (oe) {
            h(oe);
          } finally {
            I ? Le(S) : S();
          }
        }
      }
    }
    function re(I) {
      P(I.detail);
    }
    return y;
  }
  class Or extends Error {}
  Or.prototype.name = "InvalidTokenError";
  function Fp(e) {
    return decodeURIComponent(
      atob(e).replace(/(.)/g, (t, n) => {
        let r = n.charCodeAt(0).toString(16).toUpperCase();
        return (r.length < 2 && (r = "0" + r), "%" + r);
      }),
    );
  }
  function Vp(e) {
    let t = e.replace(/-/g, "+").replace(/_/g, "/");
    switch (t.length % 4) {
      case 0:
        break;
      case 2:
        t += "==";
        break;
      case 3:
        t += "=";
        break;
      default:
        throw new Error("base64 string is not of the correct length");
    }
    try {
      return Fp(t);
    } catch {
      return atob(t);
    }
  }
  function Hp(e, t) {
    if (typeof e != "string")
      throw new Or("Invalid token specified: must be a string");
    t || (t = {});
    const n = t.header === !0 ? 0 : 1,
      r = e.split(".")[n];
    if (typeof r != "string")
      throw new Or(`Invalid token specified: missing part #${n + 1}`);
    let s;
    try {
      s = Vp(r);
    } catch (i) {
      throw new Or(
        `Invalid token specified: invalid base64 for part #${n + 1} (${i.message})`,
      );
    }
    try {
      return JSON.parse(s);
    } catch (i) {
      throw new Or(
        `Invalid token specified: invalid json for part #${n + 1} (${i.message})`,
      );
    }
  }
  function Ic(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e.default
      : e;
  }
  var Ps = { exports: {} },
    zp = Ps.exports,
    Nc;
  function Wp() {
    return (
      Nc ||
        ((Nc = 1),
        (function (e, t) {
          (function (n, r) {
            e.exports = r();
          })(zp, function () {
            var n = {
              attachTo: function (r, s) {
                if (r.scannerDetectionData !== void 0)
                  throw new Error(
                    "onScan.js is already initialized for DOM element " + r,
                  );
                var i = {
                  onScan: function (o, l) {},
                  onScanError: function (o) {},
                  onKeyProcess: function (o, l) {},
                  onKeyDetect: function (o, l) {},
                  onPaste: function (o, l) {},
                  keyCodeMapper: function (o) {
                    return n.decodeKeyEvent(o);
                  },
                  onScanButtonLongPress: function () {},
                  scanButtonKeyCode: !1,
                  scanButtonLongPressTime: 500,
                  timeBeforeScanTest: 100,
                  avgTimeByChar: 30,
                  minLength: 6,
                  suffixKeyCodes: [9, 13],
                  prefixKeyCodes: [],
                  ignoreIfFocusOn: !1,
                  stopPropagation: !1,
                  preventDefault: !1,
                  captureEvents: !1,
                  reactToKeydown: !0,
                  reactToPaste: !1,
                  singleScanQty: 1,
                };
                return (
                  (s = this._mergeOptions(i, s)),
                  (r.scannerDetectionData = {
                    options: s,
                    vars: {
                      firstCharTime: 0,
                      lastCharTime: 0,
                      accumulatedString: "",
                      testTimer: !1,
                      longPressTimeStart: 0,
                      longPressed: !1,
                    },
                  }),
                  s.reactToPaste === !0 &&
                    r.addEventListener(
                      "paste",
                      this._handlePaste,
                      s.captureEvents,
                    ),
                  s.scanButtonKeyCode !== !1 &&
                    r.addEventListener(
                      "keyup",
                      this._handleKeyUp,
                      s.captureEvents,
                    ),
                  (s.reactToKeydown === !0 || s.scanButtonKeyCode !== !1) &&
                    r.addEventListener(
                      "keydown",
                      this._handleKeyDown,
                      s.captureEvents,
                    ),
                  this
                );
              },
              detachFrom: function (r) {
                (r.scannerDetectionData.options.reactToPaste &&
                  r.removeEventListener("paste", this._handlePaste),
                  r.scannerDetectionData.options.scanButtonKeyCode !== !1 &&
                    r.removeEventListener("keyup", this._handleKeyUp),
                  r.removeEventListener("keydown", this._handleKeyDown),
                  (r.scannerDetectionData = void 0));
              },
              getOptions: function (r) {
                return r.scannerDetectionData.options;
              },
              setOptions: function (r, s) {
                switch (r.scannerDetectionData.options.reactToPaste) {
                  case !0:
                    s.reactToPaste === !1 &&
                      r.removeEventListener("paste", this._handlePaste);
                    break;
                  case !1:
                    s.reactToPaste === !0 &&
                      r.addEventListener("paste", this._handlePaste);
                    break;
                }
                return (
                  r.scannerDetectionData.options.scanButtonKeyCode === !1
                    ? s.scanButtonKeyCode !== !1 &&
                      r.addEventListener("keyup", this._handleKeyUp)
                    : s.scanButtonKeyCode === !1 &&
                      r.removeEventListener("keyup", this._handleKeyUp),
                  (r.scannerDetectionData.options = this._mergeOptions(
                    r.scannerDetectionData.options,
                    s,
                  )),
                  this._reinitialize(r),
                  this
                );
              },
              decodeKeyEvent: function (r) {
                var s = this._getNormalizedKeyNum(r);
                switch (!0) {
                  case s >= 48 && s <= 90:
                  case s >= 106 && s <= 111:
                    if (r.key !== void 0 && r.key !== "") return r.key;
                    var i = String.fromCharCode(s);
                    switch (r.shiftKey) {
                      case !1:
                        i = i.toLowerCase();
                        break;
                      case !0:
                        i = i.toUpperCase();
                        break;
                    }
                    return i;
                  case s >= 96 && s <= 105:
                    return 0 + (s - 96);
                }
                return "";
              },
              simulate: function (r, s) {
                return (
                  this._reinitialize(r),
                  Array.isArray(s)
                    ? s.forEach(function (i) {
                        var o = {};
                        (typeof i == "object" || typeof i == "function") &&
                        i !== null
                          ? (o = i)
                          : (o.keyCode = parseInt(i));
                        var l = new KeyboardEvent("keydown", o);
                        document.dispatchEvent(l);
                      })
                    : this._validateScanCode(r, s),
                  this
                );
              },
              _reinitialize: function (r) {
                var s = r.scannerDetectionData.vars;
                ((s.firstCharTime = 0),
                  (s.lastCharTime = 0),
                  (s.accumulatedString = ""));
              },
              _isFocusOnIgnoredElement: function (r) {
                var s = r.scannerDetectionData.options.ignoreIfFocusOn;
                if (!s) return !1;
                var i = document.activeElement;
                if (Array.isArray(s)) {
                  for (var o = 0; o < s.length; o++)
                    if (i.matches(s[o]) === !0) return !0;
                } else if (i.matches(s)) return !0;
                return !1;
              },
              _validateScanCode: function (r, s) {
                var i = r.scannerDetectionData,
                  o = i.options,
                  l = i.options.singleScanQty,
                  a = i.vars.firstCharTime,
                  u = i.vars.lastCharTime,
                  c = {},
                  f;
                switch (!0) {
                  case s.length < o.minLength:
                    c = {
                      message: "Receieved code is shorter then minimal length",
                    };
                    break;
                  case u - a > s.length * o.avgTimeByChar:
                    c = { message: "Receieved code was not entered in time" };
                    break;
                  default:
                    return (
                      o.onScan.call(r, s, l),
                      (f = new CustomEvent("scan", {
                        detail: { scanCode: s, qty: l },
                      })),
                      r.dispatchEvent(f),
                      n._reinitialize(r),
                      !0
                    );
                }
                return (
                  (c.scanCode = s),
                  (c.scanDuration = u - a),
                  (c.avgTimeByChar = o.avgTimeByChar),
                  (c.minLength = o.minLength),
                  o.onScanError.call(r, c),
                  (f = new CustomEvent("scanError", { detail: c })),
                  r.dispatchEvent(f),
                  n._reinitialize(r),
                  !1
                );
              },
              _mergeOptions: function (r, s) {
                var i = {},
                  o;
                for (o in r)
                  Object.prototype.hasOwnProperty.call(r, o) && (i[o] = r[o]);
                for (o in s)
                  Object.prototype.hasOwnProperty.call(s, o) && (i[o] = s[o]);
                return i;
              },
              _getNormalizedKeyNum: function (r) {
                return r.which || r.keyCode;
              },
              _handleKeyDown: function (r) {
                var s = n._getNormalizedKeyNum(r),
                  i = this.scannerDetectionData.options,
                  o = this.scannerDetectionData.vars,
                  l = !1;
                if (
                  i.onKeyDetect.call(this, s, r) !== !1 &&
                  !n._isFocusOnIgnoredElement(this)
                ) {
                  if (i.scanButtonKeyCode !== !1 && s == i.scanButtonKeyCode) {
                    o.longPressed ||
                      ((o.longPressTimer = setTimeout(
                        i.onScanButtonLongPress,
                        i.scanButtonLongPressTime,
                        this,
                      )),
                      (o.longPressed = !0));
                    return;
                  }
                  switch (!0) {
                    case o.firstCharTime && i.suffixKeyCodes.indexOf(s) !== -1:
                      (r.preventDefault(),
                        r.stopImmediatePropagation(),
                        (l = !0));
                      break;
                    case !o.firstCharTime && i.prefixKeyCodes.indexOf(s) !== -1:
                      (r.preventDefault(),
                        r.stopImmediatePropagation(),
                        (l = !1));
                      break;
                    default:
                      var a = i.keyCodeMapper.call(this, r);
                      if (a === null) return;
                      ((o.accumulatedString += a),
                        i.preventDefault && r.preventDefault(),
                        i.stopPropagation && r.stopImmediatePropagation(),
                        (l = !1));
                      break;
                  }
                  (o.firstCharTime || (o.firstCharTime = Date.now()),
                    (o.lastCharTime = Date.now()),
                    o.testTimer && clearTimeout(o.testTimer),
                    l
                      ? (n._validateScanCode(this, o.accumulatedString),
                        (o.testTimer = !1))
                      : (o.testTimer = setTimeout(
                          n._validateScanCode,
                          i.timeBeforeScanTest,
                          this,
                          o.accumulatedString,
                        )),
                    i.onKeyProcess.call(this, a, r));
                }
              },
              _handlePaste: function (r) {
                var s = this.scannerDetectionData.options,
                  i = this.scannerDetectionData.vars,
                  o = (event.clipboardData || window.clipboardData).getData(
                    "text",
                  );
                n._isFocusOnIgnoredElement(this) ||
                  (r.preventDefault(),
                  s.stopPropagation && r.stopImmediatePropagation(),
                  s.onPaste.call(this, o, event),
                  (i.firstCharTime = 0),
                  (i.lastCharTime = 0),
                  n._validateScanCode(this, o));
              },
              _handleKeyUp: function (r) {
                if (!n._isFocusOnIgnoredElement(this)) {
                  var s = n._getNormalizedKeyNum(r);
                  s == this.scannerDetectionData.options.scanButtonKeyCode &&
                    (clearTimeout(
                      this.scannerDetectionData.vars.longPressTimer,
                    ),
                    (this.scannerDetectionData.vars.longPressed = !1));
                }
              },
              isScanInProgressFor: function (r) {
                return r.scannerDetectionData.vars.firstCharTime > 0;
              },
              isAttachedTo: function (r) {
                return r.scannerDetectionData !== void 0;
              },
            };
            return n;
          });
        })(Ps)),
      Ps.exports
    );
  }
  var Up = Wp();
  const Kp = Ic(Up);
  function at(e, t) {
    return fetch("/api/method/" + e, {
      method: "POST",
      headers: {
        "X-Frappe-CSRF-Token": window.csrf_token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(t),
    })
      .then((n) => {
        if (!n.ok) throw new Error("Network response was not ok");
        return n.json();
      })
      .then((n) => {
        if (n.message) return n.message;
        throw new Error(n._server_messages || "Unknown server error");
      });
  }
  function qp(e, t, n) {
    var r;
    return function () {
      var s = this,
        i = arguments,
        o = function () {
          ((r = void 0), e.apply(s, i));
        };
      (clearTimeout(r), (r = window.setTimeout(o, t)));
    };
  }
  function Gp(e) {
    let t = Object.assign({}, e);
    if (!t.url) throw new Error("[request] options.url is required");
    (t.transformRequest && (t = t.transformRequest(e)),
      t.responseType || (t.responseType = "json"),
      t.method || (t.method = "GET"));
    let n = t.url,
      r;
    if (t.params)
      if (t.method === "GET") {
        let s = new URLSearchParams();
        for (let i in t.params) s.append(i, t.params[i]);
        n = t.url + "?" + s.toString();
      } else r = JSON.stringify(t.params);
    return fetch(n, { method: t.method || "GET", headers: t.headers, body: r })
      .then((s) => {
        if (t.transformResponse) return t.transformResponse(s, t);
        if (s.status >= 200 && s.status < 300)
          return t.responseType === "json" ? s.json() : s;
        {
          let i = new Error(s.statusText);
          throw ((i.response = s), i);
        }
      })
      .catch((s) => {
        if (t.transformError) return t.transformError(s);
        throw s;
      });
  }
  function Rs(e) {
    return new Promise((t, n) => {
      ((e.oncomplete = e.onsuccess = () => t(e.result)),
        (e.onabort = e.onerror = () => n(e.error)));
    });
  }
  function Yp(e, t) {
    let n;
    const r = () => {
      if (n) return n;
      const s = indexedDB.open(e);
      return (
        (s.onupgradeneeded = () => s.result.createObjectStore(t)),
        (n = Rs(s)),
        n.then(
          (i) => {
            i.onclose = () => (n = void 0);
          },
          () => {},
        ),
        n
      );
    };
    return (s, i) => r().then((o) => i(o.transaction(t, s).objectStore(t)));
  }
  let oo;
  function lo() {
    return (oo || (oo = Yp("keyval-store", "keyval")), oo);
  }
  function Jp(e, t = lo()) {
    return t("readonly", (n) => Rs(n.get(e)));
  }
  function Xp(e, t, n = lo()) {
    return n("readwrite", (r) => (r.put(t, e), Rs(r.transaction)));
  }
  function Qp(e, t = lo()) {
    return t("readwrite", (n) => (n.delete(e), Rs(n.transaction)));
  }
  function ao(e, t) {
    return typeof indexedDB > "u"
      ? Promise.resolve(null)
      : e
        ? Xp(e, JSON.stringify(t))
        : Promise.resolve();
  }
  function Zp(e) {
    return typeof indexedDB > "u"
      ? Promise.resolve(null)
      : e
        ? Qp(e)
        : Promise.resolve();
  }
  function co(e) {
    return typeof indexedDB > "u"
      ? Promise.resolve(null)
      : Jp(e).then((t) => t && JSON.parse(t));
  }
  let e1 = {};
  function gt(e) {
    return e1[e] ?? null;
  }
  let Ds = {};
  function Ze(e, t) {
    let n = null;
    if (e.cache) {
      n = qn(e.cache);
      let f = Ds[n];
      if (f) return (f.auto && f.reload(), f);
    }
    typeof e == "string" && (e = { url: e, auto: !0 });
    let r = e.debounce ? qp(i, e.debounce) : i,
      s = Tt({
        method: e.method,
        url: e.url,
        data: e.initialData || null,
        previousData: null,
        loading: !1,
        fetched: !1,
        error: null,
        promise: null,
        auto: e.auto,
        params: null,
        fetch: r,
        reload: r,
        submit: r,
        reset: l,
        update: o,
        setData: u,
      });
    async function i(f, d = {}) {
      let h = e.resourceFetcher || gt("resourceFetcher") || Gp;
      (f instanceof Event && (f = null),
        (f = f || s.params),
        e.makeParams && (f = e.makeParams.call(t, f)),
        (s.params = f),
        (s.previousData = s.data ? JSON.parse(JSON.stringify(s.data)) : null),
        (s.loading = !0),
        (s.error = null),
        e.onFetch && e.onFetch.call(t, s.params));
      let p = [e.beforeSubmit, d.beforeSubmit];
      for (let b of p) b && b.call(t, s.params);
      let y = d.validate || e.validate,
        v = [e.onError, d.onError],
        g = [e.onSuccess, d.onSuccess],
        m = [e.onData, d.onData];
      if (y) {
        let b;
        try {
          if (((b = await y.call(t, s.params)), b && typeof b == "string"))
            throw new Error(b);
        } catch (w) {
          a(w, v);
          return;
        }
      }
      try {
        s.promise = h({ ...e, params: f || e.params });
        let b = await s.promise;
        (ao(n, b), (s.data = c(b)), (s.fetched = !0));
        for (let w of g) w && w.call(t, b);
        for (let w of m) w && w.call(t, b);
      } catch (b) {
        a(b, v);
      }
      return ((s.loading = !1), s.data);
    }
    function o({ method: f, url: d, params: h, auto: p }) {
      (f && f !== e.method && (s.method = f),
        d && d !== e.url && (s.url = d),
        h && h !== e.params && (s.params = h),
        p !== void 0 && p !== s.auto && (s.auto = p));
    }
    function l() {
      ((s.data = e.initialData || null),
        (s.previousData = null),
        (s.loading = !1),
        (s.fetched = !1),
        (s.error = null),
        (s.params = null),
        (s.auto = e.auto));
    }
    function a(f, d) {
      ((s.loading = !1),
        s.previousData && (s.data = s.previousData),
        (s.error = f));
      for (let h of d) h && h.call(t, f);
      if (d.every((h) => h == null)) {
        let h = gt("fallbackErrorHandler");
        if (h)
          try {
            h(f);
          } catch (p) {
            console.warn("Error in fallbackErrorHandler", p);
          }
      }
      throw f;
    }
    function u(f) {
      (typeof f == "function" && (f = f.call(t, s.data)), (s.data = c(f)));
    }
    function c(f) {
      if (e.transform) {
        let d = e.transform.call(t, f);
        if (d != null) return d;
      }
      return f;
    }
    return (
      n &&
        !Ds[n] &&
        ((Ds[n] = s),
        co(n).then((f) => {
          (s.loading || !s.fetched) && f && (u(f), e.onData?.call(t, f));
        })),
      e.auto && s.fetch(),
      s
    );
  }
  function qn(e) {
    return e ? (typeof e == "string" && (e = [e]), JSON.stringify(e)) : null;
  }
  function t1(e) {
    return ((e = qn(e)), Ds[e] || null);
  }
  function Bc(e, t, n) {
    (n1(e, t),
      e.on("list_update", (r) => {
        r.doctype == t && n(r.name);
      }));
  }
  let Fc = {};
  function n1(e, t) {
    Fc[t] || (e.emit("doctype_subscribe", t), (Fc[t] = !0));
  }
  let uo = Tt({}),
    Gn = {};
  function r1(e, t) {
    if (!e.doctype) throw new Error("List resource requires doctype");
    let n = qn(e.cache);
    if (n) {
      let g = uo[n];
      if (g) return (g.auto && g.reload(), g);
    }
    let r = gt("defaultListUrl") || "frappe.client.get_list",
      s = gt("defaultDocInsertUrl") || "frappe.client.insert",
      i = gt("defaultDocUpdateUrl") || "frappe.client.set_value",
      o = gt("defaultDocDeleteUrl") || "frappe.client.delete",
      l = gt("defaultRunDocMethodUrl") || "run_doc_method",
      a = Tt({
        doctype: e.doctype,
        fields: e.fields,
        filters: e.filters,
        orFilters: e.orFilters,
        orderBy: e.orderBy,
        start: e.start || 0,
        pageLength: e.pageLength || 20,
        groupBy: e.groupBy,
        parent: e.parent,
        debug: e.debug || 0,
        originalData: null,
        dataMap: {},
        data: null,
        previous: p,
        hasPreviousPage: !1,
        next: y,
        hasNextPage: !0,
        auto: e.auto,
        list: Ze(
          {
            url: e.url || r,
            makeParams() {
              return {
                doctype: a.doctype,
                fields: a.fields,
                filters: a.filters,
                or_filters: a.orFilters,
                order_by: a.orderBy,
                start: a.start,
                limit: a.pageLength,
                limit_start: a.start,
                limit_page_length: a.pageLength,
                group_by: a.groupBy,
                parent: a.parent,
                debug: a.debug,
              };
            },
            onSuccess(g) {
              ((a.hasPreviousPage = !!a.start),
                (a.hasNextPage = !(g.length < a.pageLength)));
              let m;
              (!a.start || a.start == 0
                ? (m = g)
                : a.start > 0 && (m = a.originalData.concat(g)),
                ao(n, m),
                h(m),
                e.onSuccess?.call(t, a.data));
            },
            onError: e.onError,
          },
          t,
        ),
        fetchOne: Ze(
          {
            url: e.url || r,
            makeParams(g) {
              return {
                doctype: a.doctype,
                fields: a.fields || "*",
                filters: { name: g },
              };
            },
            onSuccess(g) {
              if (g.length > 0 && a.originalData) {
                let m = g[0];
                jr(a.doctype, m);
              }
              e.fetchOne?.onSuccess?.call(t, a.data);
            },
            onError: e.fetchOne?.onError,
          },
          t,
        ),
        insert: Ze(
          {
            url: s,
            makeParams(g) {
              return { doc: { doctype: a.doctype, ...g } };
            },
            onSuccess(g) {
              (a.list.fetch(), e.insert?.onSuccess?.call(t, g));
            },
            onError: e.insert?.onError,
          },
          t,
        ),
        setValue: Ze(
          {
            url: i,
            makeParams(g) {
              let { name: m, ...b } = g;
              return { doctype: a.doctype, name: m, fieldname: b };
            },
            onSuccess(g) {
              (jr(a.doctype, g), e.setValue?.onSuccess?.call(t, g));
            },
            onError: e.setValue?.onError,
          },
          t,
        ),
        delete: Ze(
          {
            url: o,
            makeParams(g) {
              return { doctype: a.doctype, name: g };
            },
            onSuccess(g) {
              (a.list.fetch(), e.delete?.onSuccess?.call(t, g));
            },
            onError: e.delete?.onError,
          },
          t,
        ),
        runDocMethod: Ze(
          {
            url: l,
            makeParams({ method: g, name: m, ...b }) {
              return { dt: a.doctype, dn: m, method: g, args: b };
            },
            onSuccess(g) {
              if (g.docs) for (let m of g.docs) jr(m.doctype, m);
              e.runDocMethod?.onSuccess?.call(t, g);
            },
            onError: e.runDocMethod?.onError,
          },
          t,
        ),
        update: u,
        fetch: d,
        reload: f,
        setData: h,
        transform: c,
        getRow: v,
      });
    function u(g) {
      Object.assign(a, g);
    }
    function c(g) {
      if (e.transform) {
        let m = e.transform.call(t, g);
        if (m != null) return m;
      }
      return g;
    }
    function f() {
      let g = a.start,
        m = a.pageLength;
      return (
        a.start > 0 && ((a.start = 0), (a.pageLength = a.originalData.length)),
        a.list.fetch().finally(() => {
          ((a.start = g), (a.pageLength = m));
        })
      );
    }
    function d() {
      f();
    }
    function h(g) {
      if (
        ((a.originalData = g),
        typeof g == "function" && (g = g.call(t, a.data)),
        (a.data = c(g)),
        Array.isArray(a.data))
      ) {
        a.dataMap = {};
        for (let m of a.data) {
          if (!m.name) continue;
          let b = m.name.toString();
          a.dataMap[b] = m;
        }
      }
    }
    function p() {
      ((a.start = a.start - a.pageLength), a.list.fetch());
    }
    function y() {
      ((a.start = a.start + a.pageLength), a.list.fetch());
    }
    function v(g) {
      let m = g.toString();
      return a.dataMap[m];
    }
    return (
      e.realtime &&
        t?.$socket &&
        Bc(t.$socket, a.doctype, (g) => {
          a.originalData?.find((m) => m.name === g) && a.fetchOne.submit(g);
        }),
      n &&
        ((uo[n] = a),
        co(n).then((g) => {
          (a.list.loading || !a.list.fetched) &&
            g &&
            (h(g), e.onData?.call(t, g));
        })),
      e.auto && a.list.fetch(),
      (Gn[a.doctype] = Gn[a.doctype] || []),
      Gn[a.doctype].push(a),
      a
    );
  }
  function s1(e) {
    return ((e = qn(e)), uo[e] || null);
  }
  function jr(e, t) {
    if (!t.name) return;
    let n = Gn[e] || [];
    for (let r of n)
      if (r.originalData) {
        for (let s of r.originalData)
          if (s.name && s.name == t.name) {
            delete s._previousData;
            let i = JSON.stringify(s);
            for (let o in s) o in t && (s[o] = t[o]);
            s._previousData = i;
          }
        r.data = r.transform(r.originalData);
      }
  }
  function i1(e, t) {
    let n = Gn[e] || [];
    for (let r of n)
      r.originalData &&
        ((r.originalData = r.originalData.filter(
          (s) => s.name.toString() !== t.toString(),
        )),
        (r.data = r.transform(r.originalData)));
  }
  function o1(e, t) {
    let n = Gn[e] || [];
    for (let r of n)
      if (r.originalData) {
        for (let s of r.originalData)
          if (s.name && s.name == t.name) {
            let i = JSON.parse(s._previousData);
            for (let o in s) s[o] = i[o];
            delete s._previousData;
          }
        r.data = r.transform(r.originalData);
      }
  }
  let fo = Tt({});
  function l1(e, t) {
    if (!(e.doctype && e.name)) return;
    let n = qn([e.doctype, e.name]),
      r = fo[n];
    if (r) return (r.auto && r.reload(), r);
    let s = gt("defaultDocGetUrl") || "frappe.client.get",
      i = gt("defaultDocUpdateUrl") || "frappe.client.set_value",
      o = gt("defaultDocDeleteUrl") || "frappe.client.delete",
      l = gt("defaultRunDocMethodUrl") || "run_doc_method",
      a = {
        url: i,
        makeParams(p) {
          return { doctype: c.doctype, name: c.name, fieldname: p };
        },
        validate(p) {
          e.setValue?.validate?.call(t, p);
        },
        beforeSubmit(p) {
          ((c.previousDoc = JSON.stringify(c.doc)),
            Object.assign(c.doc, p.fieldname || {}),
            jr(c.doctype, c.doc));
        },
        onSuccess(p) {
          ((c.doc = h(p)),
            (c.originalDoc = JSON.parse(JSON.stringify(c.doc))),
            e.setValue?.onSuccess?.call(t, p));
        },
        onError(p) {
          ((c.doc = JSON.parse(c.previousDoc)),
            e.setValue?.onError?.call(t, p),
            o1(c.doctype, c.doc));
        },
      };
    const u = e.auto !== void 0;
    let c = Tt({
      doctype: e.doctype,
      name: e.name,
      doc: null,
      originalDoc: null,
      isDirty: !1,
      auto: u ? e.auto : !0,
      get: Ze(
        {
          url: s,
          makeParams() {
            return { doctype: c.doctype, name: c.name };
          },
          onSuccess(p) {
            (ao(n, p),
              (c.doc = h(p)),
              (c.originalDoc = JSON.parse(JSON.stringify(c.doc))),
              e.onSuccess?.call(t, c.doc));
          },
          onError(p) {
            (Zp(n),
              (c.doc = null),
              (c.originalDoc = null),
              e.onError?.call(t, p));
          },
        },
        t,
      ),
      setValue: Ze(a, t),
      setValueDebounced: Ze({ ...a, debounce: e.debounce || 500 }, t),
      save: Ze(
        {
          ...a,
          makeParams() {
            let p = JSON.parse(JSON.stringify(c.doc));
            return (
              delete p.doctype,
              delete p.name,
              { doctype: c.doctype, name: c.name, fieldname: p }
            );
          },
        },
        t,
      ),
      delete: Ze(
        {
          url: o,
          makeParams() {
            return { doctype: c.doctype, name: c.name };
          },
          onSuccess() {
            ((c.doc = null),
              e.delete?.onSuccess?.call(t),
              i1(c.doctype, c.name));
          },
          onError: e.delete?.onError,
        },
        t,
      ),
      reload: f,
      setDoc: d,
    });
    Ee(
      () => c.doc,
      () => {
        c.isDirty = JSON.stringify(c.doc) !== JSON.stringify(c.originalDoc);
      },
      { deep: !0 },
    );
    for (let p in e.whitelistedMethods) {
      let y = e.whitelistedMethods[p];
      typeof y == "string" && (y = { method: y });
      let { method: v, onSuccess: g, makeParams: m, transform: b, ...w } = y;
      c[p] = Ze(
        {
          url: l,
          makeParams(S) {
            return (
              (S = m ? m.call(t, S) : S),
              { dt: c.doctype, dn: c.name, method: v, args: S }
            );
          },
          transform(S) {
            if (b) {
              let E = b.call(t, S.message);
              if (E != null) return E;
            }
            return S.message;
          },
          onSuccess(S) {
            if (S.docs) {
              for (let E of S.docs)
                if (
                  E.doctype === c.doctype &&
                  E.name.toString() === c.name.toString()
                ) {
                  ((c.doc = h(E)), jr(c.doctype, c.doc));
                  break;
                }
            }
            g?.call(t, S.message);
          },
          ...w,
        },
        t,
      );
    }
    function f() {
      return c.get.fetch();
    }
    function d(p) {
      (typeof p == "function" && (p = p.call(t, c.doc)), (c.doc = h(p)));
    }
    function h(p) {
      if (e.transform) {
        let y = e.transform.call(t, p);
        if (typeof y == "object") return y;
      }
      return p;
    }
    return (
      e.realtime &&
        t.$socket &&
        Bc(t.$socket, c.doctype, (p) => {
          p == c.name && c.get.fetch();
        }),
      (fo[n] = c),
      co(n).then((p) => {
        (c.get.loading || !c.get.fetched) && p && (c.doc = h(p));
      }),
      c.auto && c.get.fetch(),
      c
    );
  }
  function a1(e, t) {
    let n = qn([e, t]);
    return fo[n] || null;
  }
  let c1 = (e) => ({
    created() {
      if (this.$options.resources) {
        this._resources = Tt({});
        for (let t in this.$options.resources) {
          let n = this.$options.resources[t];
          if (typeof n == "function")
            Ee(
              () => {
                let r = null;
                try {
                  r = n.call(this);
                } catch (s) {
                  (console.warn(
                    `Failed to get resource options

`,
                    s,
                  ),
                    (r = null));
                }
                return r;
              },
              (r, s) => {
                !r ||
                  !(!s || JSON.stringify(r) !== JSON.stringify(s)) ||
                  (this._resources[t] = Vc(r, this));
              },
              { immediate: !0, deep: !0 },
            );
          else {
            let r = Vc(n, this);
            this._resources[t] = r;
          }
        }
      }
    },
    methods: {
      $getResource(t) {
        return t1(t);
      },
      $getDocumentResource(t, n) {
        return a1(t, n);
      },
      $getDoc(t, n) {
        let r = this.$getDocumentResource(t, n);
        return r ? r.doc : null;
      },
      $getListResource(t) {
        return s1(t);
      },
      $refetchResource(t) {
        let n = this.$getResource(t);
        n && n.fetch();
      },
    },
    computed: {
      $resources() {
        return this._resources;
      },
    },
  });
  function Vc(e, t) {
    return e.type === "document"
      ? l1(e, t)
      : e.type === "list"
        ? r1(e, t)
        : Ze(e, t);
  }
  const u1 = {
    install(e, t) {
      let n = c1();
      e.mixin(n);
    },
  };
  var Hc;
  let f1 = Symbol("headlessui.useid"),
    d1 = 0;
  const ho =
    (Hc = ma) != null
      ? Hc
      : function () {
          return jt(f1, () => `${++d1}`)();
        };
  function Ce(e) {
    var t;
    if (e == null || e.value == null) return null;
    let n = (t = e.value.$el) != null ? t : e.value;
    return n instanceof Node ? n : null;
  }
  function $s(e, t, ...n) {
    if (e in t) {
      let s = t[e];
      return typeof s == "function" ? s(...n) : s;
    }
    let r = new Error(
      `Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(
        t,
      )
        .map((s) => `"${s}"`)
        .join(", ")}.`,
    );
    throw (Error.captureStackTrace && Error.captureStackTrace(r, $s), r);
  }
  var h1 = Object.defineProperty,
    p1 = (e, t, n) =>
      t in e
        ? h1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
        : (e[t] = n),
    zc = (e, t, n) => (p1(e, typeof t != "symbol" ? t + "" : t, n), n);
  let y1 = class {
      constructor() {
        (zc(this, "current", this.detect()), zc(this, "currentId", 0));
      }
      set(t) {
        this.current !== t && ((this.currentId = 0), (this.current = t));
      }
      reset() {
        this.set(this.detect());
      }
      nextId() {
        return ++this.currentId;
      }
      get isServer() {
        return this.current === "server";
      }
      get isClient() {
        return this.current === "client";
      }
      detect() {
        return typeof window > "u" || typeof document > "u"
          ? "server"
          : "client";
      }
    },
    po = new y1();
  function yo(e) {
    if (po.isServer) return null;
    if (e instanceof Node) return e.ownerDocument;
    if (e != null && e.hasOwnProperty("value")) {
      let t = Ce(e);
      if (t) return t.ownerDocument;
    }
    return document;
  }
  let go = [
    "[contentEditable=true]",
    "[tabindex]",
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "iframe",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
  ]
    .map((e) => `${e}:not([tabindex='-1'])`)
    .join(",");
  var mo = ((e) => (
      (e[(e.First = 1)] = "First"),
      (e[(e.Previous = 2)] = "Previous"),
      (e[(e.Next = 4)] = "Next"),
      (e[(e.Last = 8)] = "Last"),
      (e[(e.WrapAround = 16)] = "WrapAround"),
      (e[(e.NoScroll = 32)] = "NoScroll"),
      e
    ))(mo || {}),
    g1 = ((e) => (
      (e[(e.Error = 0)] = "Error"),
      (e[(e.Overflow = 1)] = "Overflow"),
      (e[(e.Success = 2)] = "Success"),
      (e[(e.Underflow = 3)] = "Underflow"),
      e
    ))(g1 || {}),
    m1 = ((e) => (
      (e[(e.Previous = -1)] = "Previous"),
      (e[(e.Next = 1)] = "Next"),
      e
    ))(m1 || {});
  function Wc(e = document.body) {
    return e == null
      ? []
      : Array.from(e.querySelectorAll(go)).sort((t, n) =>
          Math.sign(
            (t.tabIndex || Number.MAX_SAFE_INTEGER) -
              (n.tabIndex || Number.MAX_SAFE_INTEGER),
          ),
        );
  }
  var vo = ((e) => (
    (e[(e.Strict = 0)] = "Strict"),
    (e[(e.Loose = 1)] = "Loose"),
    e
  ))(vo || {});
  function bo(e, t = 0) {
    var n;
    return e === ((n = yo(e)) == null ? void 0 : n.body)
      ? !1
      : $s(t, {
          0() {
            return e.matches(go);
          },
          1() {
            let r = e;
            for (; r !== null; ) {
              if (r.matches(go)) return !0;
              r = r.parentElement;
            }
            return !1;
          },
        });
  }
  function Uc(e) {
    let t = yo(e);
    Le(() => {
      t && !bo(t.activeElement, 0) && b1(e);
    });
  }
  var v1 = ((e) => (
    (e[(e.Keyboard = 0)] = "Keyboard"),
    (e[(e.Mouse = 1)] = "Mouse"),
    e
  ))(v1 || {});
  typeof window < "u" &&
    typeof document < "u" &&
    (document.addEventListener(
      "keydown",
      (e) => {
        e.metaKey ||
          e.altKey ||
          e.ctrlKey ||
          (document.documentElement.dataset.headlessuiFocusVisible = "");
      },
      !0,
    ),
    document.addEventListener(
      "click",
      (e) => {
        e.detail === 1
          ? delete document.documentElement.dataset.headlessuiFocusVisible
          : e.detail === 0 &&
            (document.documentElement.dataset.headlessuiFocusVisible = "");
      },
      !0,
    ));
  function b1(e) {
    e?.focus({ preventScroll: !0 });
  }
  let x1 = ["textarea", "input"].join(",");
  function w1(e) {
    var t, n;
    return (n = (t = e?.matches) == null ? void 0 : t.call(e, x1)) != null
      ? n
      : !1;
  }
  function Kc(e, t = (n) => n) {
    return e.slice().sort((n, r) => {
      let s = t(n),
        i = t(r);
      if (s === null || i === null) return 0;
      let o = s.compareDocumentPosition(i);
      return o & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : o & Node.DOCUMENT_POSITION_PRECEDING
          ? 1
          : 0;
    });
  }
  function _1(e, t) {
    return S1(Wc(), t, { relativeTo: e });
  }
  function S1(
    e,
    t,
    { sorted: n = !0, relativeTo: r = null, skipElements: s = [] } = {},
  ) {
    var i;
    let o =
        (i = Array.isArray(e)
          ? e.length > 0
            ? e[0].ownerDocument
            : document
          : e?.ownerDocument) != null
          ? i
          : document,
      l = Array.isArray(e) ? (n ? Kc(e) : e) : Wc(e);
    (s.length > 0 && l.length > 1 && (l = l.filter((p) => !s.includes(p))),
      (r = r ?? o.activeElement));
    let a = (() => {
        if (t & 5) return 1;
        if (t & 10) return -1;
        throw new Error(
          "Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last",
        );
      })(),
      u = (() => {
        if (t & 1) return 0;
        if (t & 2) return Math.max(0, l.indexOf(r)) - 1;
        if (t & 4) return Math.max(0, l.indexOf(r)) + 1;
        if (t & 8) return l.length - 1;
        throw new Error(
          "Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last",
        );
      })(),
      c = t & 32 ? { preventScroll: !0 } : {},
      f = 0,
      d = l.length,
      h;
    do {
      if (f >= d || f + d <= 0) return 0;
      let p = u + f;
      if (t & 16) p = (p + d) % d;
      else {
        if (p < 0) return 3;
        if (p >= d) return 1;
      }
      ((h = l[p]), h?.focus(c), (f += a));
    } while (h !== o.activeElement);
    return (t & 6 && w1(h) && h.select(), 2);
  }
  function E1() {
    return (
      /iPhone/gi.test(window.navigator.platform) ||
      (/Mac/gi.test(window.navigator.platform) &&
        window.navigator.maxTouchPoints > 0)
    );
  }
  function C1() {
    return /Android/gi.test(window.navigator.userAgent);
  }
  function T1() {
    return E1() || C1();
  }
  function Ls(e, t, n) {
    po.isServer ||
      We((r) => {
        (document.addEventListener(e, t, n),
          r(() => document.removeEventListener(e, t, n)));
      });
  }
  function O1(e, t, n) {
    po.isServer ||
      We((r) => {
        (window.addEventListener(e, t, n),
          r(() => window.removeEventListener(e, t, n)));
      });
  }
  function j1(e, t, n = V(() => !0)) {
    function r(i, o) {
      if (!n.value || i.defaultPrevented) return;
      let l = o(i);
      if (l === null || !l.getRootNode().contains(l)) return;
      let a = (function u(c) {
        return typeof c == "function"
          ? u(c())
          : Array.isArray(c) || c instanceof Set
            ? c
            : [c];
      })(e);
      for (let u of a) {
        if (u === null) continue;
        let c = u instanceof HTMLElement ? u : Ce(u);
        if (
          (c != null && c.contains(l)) ||
          (i.composed && i.composedPath().includes(c))
        )
          return;
      }
      return (
        !bo(l, vo.Loose) && l.tabIndex !== -1 && i.preventDefault(),
        t(i, l)
      );
    }
    let s = Q(null);
    (Ls(
      "pointerdown",
      (i) => {
        var o, l;
        n.value &&
          (s.value =
            ((l = (o = i.composedPath) == null ? void 0 : o.call(i)) == null
              ? void 0
              : l[0]) || i.target);
      },
      !0,
    ),
      Ls(
        "mousedown",
        (i) => {
          var o, l;
          n.value &&
            (s.value =
              ((l = (o = i.composedPath) == null ? void 0 : o.call(i)) == null
                ? void 0
                : l[0]) || i.target);
        },
        !0,
      ),
      Ls(
        "click",
        (i) => {
          T1() || (s.value && (r(i, () => s.value), (s.value = null)));
        },
        !0,
      ),
      Ls(
        "touchend",
        (i) => r(i, () => (i.target instanceof HTMLElement ? i.target : null)),
        !0,
      ),
      O1(
        "blur",
        (i) =>
          r(i, () =>
            window.document.activeElement instanceof HTMLIFrameElement
              ? window.document.activeElement
              : null,
          ),
        !0,
      ));
  }
  function qc(e, t) {
    if (e) return e;
    let n = t ?? "button";
    if (typeof n == "string" && n.toLowerCase() === "button") return "button";
  }
  function A1(e, t) {
    let n = Q(qc(e.value.type, e.value.as));
    return (
      At(() => {
        n.value = qc(e.value.type, e.value.as);
      }),
      We(() => {
        var r;
        n.value ||
          (Ce(t) &&
            Ce(t) instanceof HTMLButtonElement &&
            !((r = Ce(t)) != null && r.hasAttribute("type")) &&
            (n.value = "button"));
      }),
      n
    );
  }
  function Gc(e) {
    return [e.screenX, e.screenY];
  }
  function k1() {
    let e = Q([-1, -1]);
    return {
      wasMoved(t) {
        let n = Gc(t);
        return e.value[0] === n[0] && e.value[1] === n[1]
          ? !1
          : ((e.value = n), !0);
      },
      update(t) {
        e.value = Gc(t);
      },
    };
  }
  function M1({ container: e, accept: t, walk: n, enabled: r }) {
    We(() => {
      let s = e.value;
      if (!s || (r !== void 0 && !r.value)) return;
      let i = yo(e);
      if (!i) return;
      let o = Object.assign((a) => t(a), { acceptNode: t }),
        l = i.createTreeWalker(s, NodeFilter.SHOW_ELEMENT, o, !1);
      for (; l.nextNode(); ) n(l.currentNode);
    });
  }
  var xo = ((e) => (
      (e[(e.None = 0)] = "None"),
      (e[(e.RenderStrategy = 1)] = "RenderStrategy"),
      (e[(e.Static = 2)] = "Static"),
      e
    ))(xo || {}),
    P1 = ((e) => (
      (e[(e.Unmount = 0)] = "Unmount"),
      (e[(e.Hidden = 1)] = "Hidden"),
      e
    ))(P1 || {});
  function Is({
    visible: e = !0,
    features: t = 0,
    ourProps: n,
    theirProps: r,
    ...s
  }) {
    var i;
    let o = Jc(r, n),
      l = Object.assign(s, { props: o });
    if (e || (t & 2 && o.static)) return wo(l);
    if (t & 1) {
      let a = (i = o.unmount) == null || i ? 0 : 1;
      return $s(a, {
        0() {
          return null;
        },
        1() {
          return wo({
            ...s,
            props: { ...o, hidden: !0, style: { display: "none" } },
          });
        },
      });
    }
    return wo(l);
  }
  function wo({ props: e, attrs: t, slots: n, slot: r, name: s }) {
    var i, o;
    let { as: l, ...a } = R1(e, ["unmount", "static"]),
      u = (i = n.default) == null ? void 0 : i.call(n, r),
      c = {};
    if (r) {
      let f = !1,
        d = [];
      for (let [h, p] of Object.entries(r))
        (typeof p == "boolean" && (f = !0), p === !0 && d.push(h));
      f && (c["data-headlessui-state"] = d.join(" "));
    }
    if (l === "template") {
      if (
        ((u = Yc(u ?? [])),
        Object.keys(a).length > 0 || Object.keys(t).length > 0)
      ) {
        let [f, ...d] = u ?? [];
        if (!D1(f) || d.length > 0)
          throw new Error(
            [
              'Passing props on "template"!',
              "",
              `The current component <${s} /> is rendering a "template".`,
              "However we need to passthrough the following props:",
              Object.keys(a)
                .concat(Object.keys(t))
                .map((y) => y.trim())
                .filter((y, v, g) => g.indexOf(y) === v)
                .sort((y, v) => y.localeCompare(v))
                .map((y) => `  - ${y}`).join(`
`),
              "",
              "You can apply a few solutions:",
              [
                'Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',
                "Render a single element as the child so that we can forward the props onto that element.",
              ].map((y) => `  - ${y}`).join(`
`),
            ].join(`
`),
          );
        let h = Jc((o = f.props) != null ? o : {}, a, c),
          p = yt(f, h, !0);
        for (let y in h)
          y.startsWith("on") &&
            (p.props || (p.props = {}), (p.props[y] = h[y]));
        return p;
      }
      return Array.isArray(u) && u.length === 1 ? u[0] : u;
    }
    return cn(l, Object.assign({}, a, c), { default: () => u });
  }
  function Yc(e) {
    return e.flatMap((t) => (t.type === pe ? Yc(t.children) : [t]));
  }
  function Jc(...e) {
    if (e.length === 0) return {};
    if (e.length === 1) return e[0];
    let t = {},
      n = {};
    for (let r of e)
      for (let s in r)
        s.startsWith("on") && typeof r[s] == "function"
          ? (n[s] != null || (n[s] = []), n[s].push(r[s]))
          : (t[s] = r[s]);
    if (t.disabled || t["aria-disabled"])
      return Object.assign(
        t,
        Object.fromEntries(Object.keys(n).map((r) => [r, void 0])),
      );
    for (let r in n)
      Object.assign(t, {
        [r](s, ...i) {
          let o = n[r];
          for (let l of o) {
            if (s instanceof Event && s.defaultPrevented) return;
            l(s, ...i);
          }
        },
      });
    return t;
  }
  function R1(e, t = []) {
    let n = Object.assign({}, e);
    for (let r of t) r in n && delete n[r];
    return n;
  }
  function D1(e) {
    return e == null
      ? !1
      : typeof e.type == "string" ||
          typeof e.type == "object" ||
          typeof e.type == "function";
  }
  let Xc = Symbol("Context");
  var Ar = ((e) => (
    (e[(e.Open = 1)] = "Open"),
    (e[(e.Closed = 2)] = "Closed"),
    (e[(e.Closing = 4)] = "Closing"),
    (e[(e.Opening = 8)] = "Opening"),
    e
  ))(Ar || {});
  function $1() {
    return jt(Xc, null);
  }
  function L1(e) {
    cs(Xc, e);
  }
  var Re = ((e) => (
    (e.Space = " "),
    (e.Enter = "Enter"),
    (e.Escape = "Escape"),
    (e.Backspace = "Backspace"),
    (e.Delete = "Delete"),
    (e.ArrowLeft = "ArrowLeft"),
    (e.ArrowUp = "ArrowUp"),
    (e.ArrowRight = "ArrowRight"),
    (e.ArrowDown = "ArrowDown"),
    (e.Home = "Home"),
    (e.End = "End"),
    (e.PageUp = "PageUp"),
    (e.PageDown = "PageDown"),
    (e.Tab = "Tab"),
    e
  ))(Re || {});
  function I1(e) {
    throw new Error("Unexpected object: " + e);
  }
  var et = ((e) => (
    (e[(e.First = 0)] = "First"),
    (e[(e.Previous = 1)] = "Previous"),
    (e[(e.Next = 2)] = "Next"),
    (e[(e.Last = 3)] = "Last"),
    (e[(e.Specific = 4)] = "Specific"),
    (e[(e.Nothing = 5)] = "Nothing"),
    e
  ))(et || {});
  function N1(e, t) {
    let n = t.resolveItems();
    if (n.length <= 0) return null;
    let r = t.resolveActiveIndex(),
      s = r ?? -1;
    switch (e.focus) {
      case 0: {
        for (let i = 0; i < n.length; ++i)
          if (!t.resolveDisabled(n[i], i, n)) return i;
        return r;
      }
      case 1: {
        s === -1 && (s = n.length);
        for (let i = s - 1; i >= 0; --i)
          if (!t.resolveDisabled(n[i], i, n)) return i;
        return r;
      }
      case 2: {
        for (let i = s + 1; i < n.length; ++i)
          if (!t.resolveDisabled(n[i], i, n)) return i;
        return r;
      }
      case 3: {
        for (let i = n.length - 1; i >= 0; --i)
          if (!t.resolveDisabled(n[i], i, n)) return i;
        return r;
      }
      case 4: {
        for (let i = 0; i < n.length; ++i)
          if (t.resolveId(n[i], i, n) === e.id) return i;
        return r;
      }
      case 5:
        return null;
      default:
        I1(e);
    }
  }
  let Qc =
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
  function Zc(e) {
    var t, n;
    let r = (t = e.innerText) != null ? t : "",
      s = e.cloneNode(!0);
    if (!(s instanceof HTMLElement)) return r;
    let i = !1;
    for (let l of s.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))
      (l.remove(), (i = !0));
    let o = i ? ((n = s.innerText) != null ? n : "") : r;
    return (Qc.test(o) && (o = o.replace(Qc, "")), o);
  }
  function B1(e) {
    let t = e.getAttribute("aria-label");
    if (typeof t == "string") return t.trim();
    let n = e.getAttribute("aria-labelledby");
    if (n) {
      let r = n
        .split(" ")
        .map((s) => {
          let i = document.getElementById(s);
          if (i) {
            let o = i.getAttribute("aria-label");
            return typeof o == "string" ? o.trim() : Zc(i).trim();
          }
          return null;
        })
        .filter(Boolean);
      if (r.length > 0) return r.join(", ");
    }
    return Zc(e).trim();
  }
  function F1(e) {
    let t = Q(""),
      n = Q("");
    return () => {
      let r = Ce(e);
      if (!r) return "";
      let s = r.innerText;
      if (t.value === s) return n.value;
      let i = B1(r).trim().toLowerCase();
      return ((t.value = s), (n.value = i), i);
    };
  }
  var V1 = ((e) => (
      (e[(e.Open = 0)] = "Open"),
      (e[(e.Closed = 1)] = "Closed"),
      e
    ))(V1 || {}),
    H1 = ((e) => (
      (e[(e.Pointer = 0)] = "Pointer"),
      (e[(e.Other = 1)] = "Other"),
      e
    ))(H1 || {});
  function z1(e) {
    requestAnimationFrame(() => requestAnimationFrame(e));
  }
  let eu = Symbol("MenuContext");
  function Ns(e) {
    let t = jt(eu, null);
    if (t === null) {
      let n = new Error(`<${e} /> is missing a parent <Menu /> component.`);
      throw (Error.captureStackTrace && Error.captureStackTrace(n, Ns), n);
    }
    return t;
  }
  let W1 = Z({
      name: "Menu",
      props: { as: { type: [Object, String], default: "template" } },
      setup(e, { slots: t, attrs: n }) {
        let r = Q(1),
          s = Q(null),
          i = Q(null),
          o = Q([]),
          l = Q(""),
          a = Q(null),
          u = Q(1);
        function c(d = (h) => h) {
          let h = a.value !== null ? o.value[a.value] : null,
            p = Kc(d(o.value.slice()), (v) => Ce(v.dataRef.domRef)),
            y = h ? p.indexOf(h) : null;
          return (y === -1 && (y = null), { items: p, activeItemIndex: y });
        }
        let f = {
          menuState: r,
          buttonRef: s,
          itemsRef: i,
          items: o,
          searchQuery: l,
          activeItemIndex: a,
          activationTrigger: u,
          closeMenu: () => {
            ((r.value = 1), (a.value = null));
          },
          openMenu: () => (r.value = 0),
          goToItem(d, h, p) {
            let y = c(),
              v = N1(
                d === et.Specific
                  ? { focus: et.Specific, id: h }
                  : { focus: d },
                {
                  resolveItems: () => y.items,
                  resolveActiveIndex: () => y.activeItemIndex,
                  resolveId: (g) => g.id,
                  resolveDisabled: (g) => g.dataRef.disabled,
                },
              );
            ((l.value = ""),
              (a.value = v),
              (u.value = p ?? 1),
              (o.value = y.items));
          },
          search(d) {
            let h = l.value !== "" ? 0 : 1;
            l.value += d.toLowerCase();
            let p = (
                a.value !== null
                  ? o.value
                      .slice(a.value + h)
                      .concat(o.value.slice(0, a.value + h))
                  : o.value
              ).find(
                (v) =>
                  v.dataRef.textValue.startsWith(l.value) &&
                  !v.dataRef.disabled,
              ),
              y = p ? o.value.indexOf(p) : -1;
            y === -1 || y === a.value || ((a.value = y), (u.value = 1));
          },
          clearSearch() {
            l.value = "";
          },
          registerItem(d, h) {
            let p = c((y) => [...y, { id: d, dataRef: h }]);
            ((o.value = p.items), (a.value = p.activeItemIndex), (u.value = 1));
          },
          unregisterItem(d) {
            let h = c((p) => {
              let y = p.findIndex((v) => v.id === d);
              return (y !== -1 && p.splice(y, 1), p);
            });
            ((o.value = h.items), (a.value = h.activeItemIndex), (u.value = 1));
          },
        };
        return (
          j1(
            [s, i],
            (d, h) => {
              var p;
              (f.closeMenu(),
                bo(h, vo.Loose) ||
                  (d.preventDefault(), (p = Ce(s)) == null || p.focus()));
            },
            V(() => r.value === 0),
          ),
          cs(eu, f),
          L1(V(() => $s(r.value, { 0: Ar.Open, 1: Ar.Closed }))),
          () => {
            let d = { open: r.value === 0, close: f.closeMenu };
            return Is({
              ourProps: {},
              theirProps: e,
              slot: d,
              slots: t,
              attrs: n,
              name: "Menu",
            });
          }
        );
      },
    }),
    U1 = Z({
      name: "MenuButton",
      props: {
        disabled: { type: Boolean, default: !1 },
        as: { type: [Object, String], default: "button" },
        id: { type: String, default: null },
      },
      setup(e, { attrs: t, slots: n, expose: r }) {
        var s;
        let i = (s = e.id) != null ? s : `headlessui-menu-button-${ho()}`,
          o = Ns("MenuButton");
        r({ el: o.buttonRef, $el: o.buttonRef });
        function l(f) {
          switch (f.key) {
            case Re.Space:
            case Re.Enter:
            case Re.ArrowDown:
              (f.preventDefault(),
                f.stopPropagation(),
                o.openMenu(),
                Le(() => {
                  var d;
                  ((d = Ce(o.itemsRef)) == null ||
                    d.focus({ preventScroll: !0 }),
                    o.goToItem(et.First));
                }));
              break;
            case Re.ArrowUp:
              (f.preventDefault(),
                f.stopPropagation(),
                o.openMenu(),
                Le(() => {
                  var d;
                  ((d = Ce(o.itemsRef)) == null ||
                    d.focus({ preventScroll: !0 }),
                    o.goToItem(et.Last));
                }));
              break;
          }
        }
        function a(f) {
          f.key === Re.Space && f.preventDefault();
        }
        function u(f) {
          e.disabled ||
            (o.menuState.value === 0
              ? (o.closeMenu(),
                Le(() => {
                  var d;
                  return (d = Ce(o.buttonRef)) == null
                    ? void 0
                    : d.focus({ preventScroll: !0 });
                }))
              : (f.preventDefault(),
                o.openMenu(),
                z1(() => {
                  var d;
                  return (d = Ce(o.itemsRef)) == null
                    ? void 0
                    : d.focus({ preventScroll: !0 });
                })));
        }
        let c = A1(
          V(() => ({ as: e.as, type: t.type })),
          o.buttonRef,
        );
        return () => {
          var f;
          let d = { open: o.menuState.value === 0 },
            { ...h } = e,
            p = {
              ref: o.buttonRef,
              id: i,
              type: c.value,
              "aria-haspopup": "menu",
              "aria-controls": (f = Ce(o.itemsRef)) == null ? void 0 : f.id,
              "aria-expanded": o.menuState.value === 0,
              onKeydown: l,
              onKeyup: a,
              onClick: u,
            };
          return Is({
            ourProps: p,
            theirProps: h,
            slot: d,
            attrs: t,
            slots: n,
            name: "MenuButton",
          });
        };
      },
    }),
    K1 = Z({
      name: "MenuItems",
      props: {
        as: { type: [Object, String], default: "div" },
        static: { type: Boolean, default: !1 },
        unmount: { type: Boolean, default: !0 },
        id: { type: String, default: null },
      },
      setup(e, { attrs: t, slots: n, expose: r }) {
        var s;
        let i = (s = e.id) != null ? s : `headlessui-menu-items-${ho()}`,
          o = Ns("MenuItems"),
          l = Q(null);
        (r({ el: o.itemsRef, $el: o.itemsRef }),
          M1({
            container: V(() => Ce(o.itemsRef)),
            enabled: V(() => o.menuState.value === 0),
            accept(d) {
              return d.getAttribute("role") === "menuitem"
                ? NodeFilter.FILTER_REJECT
                : d.hasAttribute("role")
                  ? NodeFilter.FILTER_SKIP
                  : NodeFilter.FILTER_ACCEPT;
            },
            walk(d) {
              d.setAttribute("role", "none");
            },
          }));
        function a(d) {
          var h;
          switch ((l.value && clearTimeout(l.value), d.key)) {
            case Re.Space:
              if (o.searchQuery.value !== "")
                return (
                  d.preventDefault(),
                  d.stopPropagation(),
                  o.search(d.key)
                );
            case Re.Enter:
              if (
                (d.preventDefault(),
                d.stopPropagation(),
                o.activeItemIndex.value !== null)
              ) {
                let p = o.items.value[o.activeItemIndex.value];
                (h = Ce(p.dataRef.domRef)) == null || h.click();
              }
              (o.closeMenu(), Uc(Ce(o.buttonRef)));
              break;
            case Re.ArrowDown:
              return (
                d.preventDefault(),
                d.stopPropagation(),
                o.goToItem(et.Next)
              );
            case Re.ArrowUp:
              return (
                d.preventDefault(),
                d.stopPropagation(),
                o.goToItem(et.Previous)
              );
            case Re.Home:
            case Re.PageUp:
              return (
                d.preventDefault(),
                d.stopPropagation(),
                o.goToItem(et.First)
              );
            case Re.End:
            case Re.PageDown:
              return (
                d.preventDefault(),
                d.stopPropagation(),
                o.goToItem(et.Last)
              );
            case Re.Escape:
              (d.preventDefault(),
                d.stopPropagation(),
                o.closeMenu(),
                Le(() => {
                  var p;
                  return (p = Ce(o.buttonRef)) == null
                    ? void 0
                    : p.focus({ preventScroll: !0 });
                }));
              break;
            case Re.Tab:
              (d.preventDefault(),
                d.stopPropagation(),
                o.closeMenu(),
                Le(() =>
                  _1(Ce(o.buttonRef), d.shiftKey ? mo.Previous : mo.Next),
                ));
              break;
            default:
              d.key.length === 1 &&
                (o.search(d.key),
                (l.value = setTimeout(() => o.clearSearch(), 350)));
              break;
          }
        }
        function u(d) {
          d.key === Re.Space && d.preventDefault();
        }
        let c = $1(),
          f = V(() =>
            c !== null
              ? (c.value & Ar.Open) === Ar.Open
              : o.menuState.value === 0,
          );
        return () => {
          var d, h;
          let p = { open: o.menuState.value === 0 },
            { ...y } = e,
            v = {
              "aria-activedescendant":
                o.activeItemIndex.value === null ||
                (d = o.items.value[o.activeItemIndex.value]) == null
                  ? void 0
                  : d.id,
              "aria-labelledby": (h = Ce(o.buttonRef)) == null ? void 0 : h.id,
              id: i,
              onKeydown: a,
              onKeyup: u,
              role: "menu",
              tabIndex: 0,
              ref: o.itemsRef,
            };
          return Is({
            ourProps: v,
            theirProps: y,
            slot: p,
            attrs: t,
            slots: n,
            features: xo.RenderStrategy | xo.Static,
            visible: f.value,
            name: "MenuItems",
          });
        };
      },
    }),
    q1 = Z({
      name: "MenuItem",
      inheritAttrs: !1,
      props: {
        as: { type: [Object, String], default: "template" },
        disabled: { type: Boolean, default: !1 },
        id: { type: String, default: null },
      },
      setup(e, { slots: t, attrs: n, expose: r }) {
        var s;
        let i = (s = e.id) != null ? s : `headlessui-menu-item-${ho()}`,
          o = Ns("MenuItem"),
          l = Q(null);
        r({ el: l, $el: l });
        let a = V(() =>
            o.activeItemIndex.value !== null
              ? o.items.value[o.activeItemIndex.value].id === i
              : !1,
          ),
          u = F1(l),
          c = V(() => ({
            disabled: e.disabled,
            get textValue() {
              return u();
            },
            domRef: l,
          }));
        (At(() => o.registerItem(i, c)),
          vr(() => o.unregisterItem(i)),
          We(() => {
            o.menuState.value === 0 &&
              a.value &&
              o.activationTrigger.value !== 0 &&
              Le(() => {
                var g, m;
                return (m = (g = Ce(l)) == null ? void 0 : g.scrollIntoView) ==
                  null
                  ? void 0
                  : m.call(g, { block: "nearest" });
              });
          }));
        function f(g) {
          if (e.disabled) return g.preventDefault();
          (o.closeMenu(), Uc(Ce(o.buttonRef)));
        }
        function d() {
          if (e.disabled) return o.goToItem(et.Nothing);
          o.goToItem(et.Specific, i);
        }
        let h = k1();
        function p(g) {
          h.update(g);
        }
        function y(g) {
          h.wasMoved(g) &&
            (e.disabled || a.value || o.goToItem(et.Specific, i, 0));
        }
        function v(g) {
          h.wasMoved(g) && (e.disabled || (a.value && o.goToItem(et.Nothing)));
        }
        return () => {
          let { disabled: g, ...m } = e,
            b = { active: a.value, disabled: g, close: o.closeMenu };
          return Is({
            ourProps: {
              id: i,
              ref: l,
              role: "menuitem",
              tabIndex: g === !0 ? void 0 : -1,
              "aria-disabled": g === !0 ? !0 : void 0,
              onClick: f,
              onFocus: d,
              onPointerenter: p,
              onMouseenter: p,
              onPointermove: y,
              onMousemove: y,
              onPointerleave: v,
              onMouseleave: v,
            },
            theirProps: { ...n, ...m },
            slot: b,
            attrs: n,
            slots: t,
            name: "MenuItem",
          });
        };
      },
    });
  function Bs(e, t) {
    const n = typeof e == "string" && !t ? `${e}Context` : t,
      r = Symbol(n);
    return [
      (o) => {
        const l = jt(r, o);
        if (l || l === null) return l;
        throw new Error(
          `Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(", ")}` : `\`${e}\``}`,
        );
      },
      (o) => (cs(r, o), o),
    ];
  }
  function tu(e, t, n) {
    const r = n.originalEvent.target,
      s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
    (t && r.addEventListener(e, t, { once: !0 }), r.dispatchEvent(s));
  }
  function G1(e) {
    return e == null;
  }
  function _o(e) {
    return e ? e.flatMap((t) => (t.type === pe ? _o(t.children) : [t])) : [];
  }
  function Y1(e, t) {
    var n;
    const r = fr();
    return (
      We(
        () => {
          r.value = e();
        },
        { ...t, flush: (n = void 0) != null ? n : "sync" },
      ),
      xn(r)
    );
  }
  function kr(e) {
    return wi() ? (Sl(e), !0) : !1;
  }
  function J1() {
    const e = new Set(),
      t = (i) => {
        e.delete(i);
      };
    return {
      on: (i) => {
        e.add(i);
        const o = () => t(i);
        return (kr(o), { off: o });
      },
      off: t,
      trigger: (...i) => Promise.all(Array.from(e).map((o) => o(...i))),
      clear: () => {
        e.clear();
      },
    };
  }
  const Mr = typeof window < "u" && typeof document < "u";
  typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
  const X1 = (e) => typeof e < "u",
    Q1 = Object.prototype.toString,
    Z1 = (e) => Q1.call(e) === "[object Object]";
  function So(e) {
    return Array.isArray(e) ? e : [e];
  }
  function ey(e, t = 1e4) {
    return Wl((n, r) => {
      let s = Oe(e),
        i;
      const o = () =>
        setTimeout(() => {
          ((s = Oe(e)), r());
        }, Oe(t));
      return (
        kr(() => {
          clearTimeout(i);
        }),
        {
          get() {
            return (n(), s);
          },
          set(l) {
            ((s = l), r(), clearTimeout(i), (i = o()));
          },
        }
      );
    });
  }
  function nu(e, t, n = {}) {
    const { immediate: r = !0, immediateCallback: s = !1 } = n,
      i = fr(!1);
    let o = null;
    function l() {
      o && (clearTimeout(o), (o = null));
    }
    function a() {
      ((i.value = !1), l());
    }
    function u(...c) {
      (s && e(),
        l(),
        (i.value = !0),
        (o = setTimeout(() => {
          ((i.value = !1), (o = null), e(...c));
        }, Oe(t))));
    }
    return (
      r && ((i.value = !0), Mr && u()),
      kr(a),
      { isPending: xn(i), start: u, stop: a }
    );
  }
  function ty(e, t, n) {
    return Ee(e, t, { ...n, immediate: !0 });
  }
  const Eo = Mr ? window : void 0;
  function Fs(e) {
    var t;
    const n = Oe(e);
    return (t = n?.$el) != null ? t : n;
  }
  function Co(...e) {
    const t = [],
      n = () => {
        (t.forEach((l) => l()), (t.length = 0));
      },
      r = (l, a, u, c) => (
        l.addEventListener(a, u, c),
        () => l.removeEventListener(a, u, c)
      ),
      s = V(() => {
        const l = So(Oe(e[0])).filter((a) => a != null);
        return l.every((a) => typeof a != "string") ? l : void 0;
      }),
      i = ty(
        () => {
          var l, a;
          return [
            (a = (l = s.value) == null ? void 0 : l.map((u) => Fs(u))) != null
              ? a
              : [Eo].filter((u) => u != null),
            So(Oe(s.value ? e[1] : e[0])),
            So(F(s.value ? e[2] : e[1])),
            Oe(s.value ? e[3] : e[2]),
          ];
        },
        ([l, a, u, c]) => {
          if ((n(), !l?.length || !a?.length || !u?.length)) return;
          const f = Z1(c) ? { ...c } : c;
          t.push(
            ...l.flatMap((d) => a.flatMap((h) => u.map((p) => r(d, h, p, f)))),
          );
        },
        { flush: "post" },
      ),
      o = () => {
        (i(), n());
      };
    return (kr(n), o);
  }
  function ny() {
    const e = fr(!1),
      t = qe();
    return (
      t &&
        At(() => {
          e.value = !0;
        }, t),
      e
    );
  }
  function ry(e) {
    return typeof e == "function"
      ? e
      : typeof e == "string"
        ? (t) => t.key === e
        : Array.isArray(e)
          ? (t) => e.includes(t.key)
          : () => !0;
  }
  function sy(...e) {
    let t,
      n,
      r = {};
    e.length === 3
      ? ((t = e[0]), (n = e[1]), (r = e[2]))
      : e.length === 2
        ? typeof e[1] == "object"
          ? ((t = !0), (n = e[0]), (r = e[1]))
          : ((t = e[0]), (n = e[1]))
        : ((t = !0), (n = e[0]));
    const {
        target: s = Eo,
        eventName: i = "keydown",
        passive: o = !1,
        dedupe: l = !1,
      } = r,
      a = ry(t);
    return Co(
      s,
      i,
      (c) => {
        (c.repeat && Oe(l)) || (a(c) && n(c));
      },
      o,
    );
  }
  function iy(e) {
    return JSON.parse(JSON.stringify(e));
  }
  function oy(e, t, n, r = {}) {
    var s, i, o;
    const {
        clone: l = !1,
        passive: a = !1,
        eventName: u,
        deep: c = !1,
        defaultValue: f,
        shouldEmit: d,
      } = r,
      h = qe(),
      p =
        n ||
        h?.emit ||
        ((s = h?.$emit) == null ? void 0 : s.bind(h)) ||
        ((o = (i = h?.proxy) == null ? void 0 : i.$emit) == null
          ? void 0
          : o.bind(h?.proxy));
    let y = u;
    y = y || `update:${t.toString()}`;
    const v = (b) => (l ? (typeof l == "function" ? l(b) : iy(b)) : b),
      g = () => (X1(e[t]) ? v(e[t]) : f),
      m = (b) => {
        d ? d(b) && p(y, b) : p(y, b);
      };
    if (a) {
      const b = g(),
        w = Q(b);
      let S = !1;
      return (
        Ee(
          () => e[t],
          (E) => {
            S || ((S = !0), (w.value = v(E)), Le(() => (S = !1)));
          },
        ),
        Ee(
          w,
          (E) => {
            !S && (E !== e[t] || c) && m(E);
          },
          { deep: c },
        ),
        w
      );
    } else
      return V({
        get() {
          return g();
        },
        set(b) {
          m(b);
        },
      });
  }
  function ly(e) {
    const t = qe(),
      n = t?.type.emits,
      r = {};
    return (
      n?.length ||
        console.warn(
          `No emitted event found. Please check component: ${t?.type.__name}`,
        ),
      n?.forEach((s) => {
        r[ir(ze(s))] = (...i) => e(s, ...i);
      }),
      r
    );
  }
  function ct() {
    const e = qe(),
      t = Q(),
      n = V(() =>
        ["#text", "#comment"].includes(t.value?.$el.nodeName)
          ? t.value?.$el.nextElementSibling
          : Fs(t),
      ),
      r = Object.assign({}, e.exposed),
      s = {};
    for (const o in e.props)
      Object.defineProperty(s, o, {
        enumerable: !0,
        configurable: !0,
        get: () => e.props[o],
      });
    if (Object.keys(r).length > 0)
      for (const o in r)
        Object.defineProperty(s, o, {
          enumerable: !0,
          configurable: !0,
          get: () => r[o],
        });
    (Object.defineProperty(s, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => e.vnode.el,
    }),
      (e.exposed = s));
    function i(o) {
      if (
        ((t.value = o),
        !!o &&
          (Object.defineProperty(s, "$el", {
            enumerable: !0,
            configurable: !0,
            get: () => (o instanceof Element ? o : o.$el),
          }),
          !(o instanceof Element) && !Object.hasOwn(o, "$el")))
      ) {
        const l = o.$.exposed,
          a = Object.assign({}, s);
        for (const u in l)
          Object.defineProperty(a, u, {
            enumerable: !0,
            configurable: !0,
            get: () => l[u],
          });
        e.exposed = a;
      }
    }
    return { forwardRef: i, currentRef: t, currentElement: n };
  }
  function ru(e) {
    const t = qe(),
      n = Object.keys(t?.type.props ?? {}).reduce((s, i) => {
        const o = (t?.type.props[i]).default;
        return (o !== void 0 && (s[i] = o), s);
      }, {}),
      r = Kl(e);
    return V(() => {
      const s = {},
        i = t?.vnode.props ?? {};
      return (
        Object.keys(i).forEach((o) => {
          s[ze(o)] = i[o];
        }),
        Object.keys({ ...n, ...s }).reduce(
          (o, l) => (r.value[l] !== void 0 && (o[l] = r.value[l]), o),
          {},
        )
      );
    });
  }
  function ay(e, t) {
    const n = ru(e),
      r = t ? ly(t) : {};
    return V(() => ({ ...n.value, ...r }));
  }
  function cy(e, t) {
    const n = ey(!1, 300);
    kr(() => {
      n.value = !1;
    });
    const r = Q(null),
      s = J1();
    function i() {
      ((r.value = null), (n.value = !1));
    }
    function o(l, a) {
      const u = l.currentTarget,
        c = { x: l.clientX, y: l.clientY },
        f = uy(c, u.getBoundingClientRect()),
        d = fy(c, f),
        h = dy(a.getBoundingClientRect()),
        p = py([...d, ...h]);
      ((r.value = p), (n.value = !0));
    }
    return (
      We((l) => {
        if (e.value && t.value) {
          const a = (c) => o(c, t.value),
            u = (c) => o(c, e.value);
          (e.value.addEventListener("pointerleave", a),
            t.value.addEventListener("pointerleave", u),
            l(() => {
              (e.value?.removeEventListener("pointerleave", a),
                t.value?.removeEventListener("pointerleave", u));
            }));
        }
      }),
      We((l) => {
        if (r.value) {
          const a = (u) => {
            if (!r.value || !(u.target instanceof Element)) return;
            const c = u.target,
              f = { x: u.clientX, y: u.clientY },
              d = e.value?.contains(c) || t.value?.contains(c),
              h = !hy(f, r.value),
              p = !!c.closest("[data-grace-area-trigger]");
            d ? i() : (h || p) && (i(), s.trigger());
          };
          (e.value?.ownerDocument.addEventListener("pointermove", a),
            l(() =>
              e.value?.ownerDocument.removeEventListener("pointermove", a),
            ));
        }
      }),
      { isPointerInTransit: n, onPointerExit: s.on }
    );
  }
  function uy(e, t) {
    const n = Math.abs(t.top - e.y),
      r = Math.abs(t.bottom - e.y),
      s = Math.abs(t.right - e.x),
      i = Math.abs(t.left - e.x);
    switch (Math.min(n, r, s, i)) {
      case i:
        return "left";
      case s:
        return "right";
      case n:
        return "top";
      case r:
        return "bottom";
      default:
        throw new Error("unreachable");
    }
  }
  function fy(e, t, n = 5) {
    const r = [];
    switch (t) {
      case "top":
        r.push({ x: e.x - n, y: e.y + n }, { x: e.x + n, y: e.y + n });
        break;
      case "bottom":
        r.push({ x: e.x - n, y: e.y - n }, { x: e.x + n, y: e.y - n });
        break;
      case "left":
        r.push({ x: e.x + n, y: e.y - n }, { x: e.x + n, y: e.y + n });
        break;
      case "right":
        r.push({ x: e.x - n, y: e.y - n }, { x: e.x - n, y: e.y + n });
        break;
    }
    return r;
  }
  function dy(e) {
    const { top: t, right: n, bottom: r, left: s } = e;
    return [
      { x: s, y: t },
      { x: n, y: t },
      { x: n, y: r },
      { x: s, y: r },
    ];
  }
  function hy(e, t) {
    const { x: n, y: r } = e;
    let s = !1;
    for (let i = 0, o = t.length - 1; i < t.length; o = i++) {
      const l = t[i].x,
        a = t[i].y,
        u = t[o].x,
        c = t[o].y;
      a > r != c > r && n < ((u - l) * (r - a)) / (c - a) + l && (s = !s);
    }
    return s;
  }
  function py(e) {
    const t = e.slice();
    return (
      t.sort((n, r) =>
        n.x < r.x ? -1 : n.x > r.x ? 1 : n.y < r.y ? -1 : n.y > r.y ? 1 : 0,
      ),
      yy(t)
    );
  }
  function yy(e) {
    if (e.length <= 1) return e.slice();
    const t = [];
    for (let r = 0; r < e.length; r++) {
      const s = e[r];
      for (; t.length >= 2; ) {
        const i = t[t.length - 1],
          o = t[t.length - 2];
        if ((i.x - o.x) * (s.y - o.y) >= (i.y - o.y) * (s.x - o.x)) t.pop();
        else break;
      }
      t.push(s);
    }
    t.pop();
    const n = [];
    for (let r = e.length - 1; r >= 0; r--) {
      const s = e[r];
      for (; n.length >= 2; ) {
        const i = n[n.length - 1],
          o = n[n.length - 2];
        if ((i.x - o.x) * (s.y - o.y) >= (i.y - o.y) * (s.x - o.x)) n.pop();
        else break;
      }
      n.push(s);
    }
    return (
      n.pop(),
      t.length === 1 && n.length === 1 && t[0].x === n[0].x && t[0].y === n[0].y
        ? t
        : t.concat(n)
    );
  }
  function gy(e, t = "reka") {
    return `${t}-${ma?.()}`;
  }
  function my(e) {
    const t = Q(),
      n = V(() => t.value?.width ?? 0),
      r = V(() => t.value?.height ?? 0);
    return (
      At(() => {
        const s = Fs(e);
        if (s) {
          t.value = { width: s.offsetWidth, height: s.offsetHeight };
          const i = new ResizeObserver((o) => {
            if (!Array.isArray(o) || !o.length) return;
            const l = o[0];
            let a, u;
            if ("borderBoxSize" in l) {
              const c = l.borderBoxSize,
                f = Array.isArray(c) ? c[0] : c;
              ((a = f.inlineSize), (u = f.blockSize));
            } else ((a = s.offsetWidth), (u = s.offsetHeight));
            t.value = { width: a, height: u };
          });
          return (i.observe(s, { box: "border-box" }), () => i.unobserve(s));
        } else t.value = void 0;
      }),
      { width: n, height: r }
    );
  }
  function vy(e, t) {
    const n = Q(e);
    function r(i) {
      return t[n.value][i] ?? n.value;
    }
    return {
      state: n,
      dispatch: (i) => {
        n.value = r(i);
      },
    };
  }
  function by(e, t) {
    const n = Q({}),
      r = Q("none"),
      s = Q(e),
      i = e.value ? "mounted" : "unmounted";
    let o;
    const l = t.value?.ownerDocument.defaultView ?? Eo,
      { state: a, dispatch: u } = vy(i, {
        mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
        unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
        unmounted: { MOUNT: "mounted" },
      }),
      c = (v) => {
        if (Mr) {
          const g = new CustomEvent(v, { bubbles: !1, cancelable: !1 });
          t.value?.dispatchEvent(g);
        }
      };
    Ee(
      e,
      async (v, g) => {
        const m = g !== v;
        if ((await Le(), m)) {
          const b = r.value,
            w = Vs(t.value);
          v
            ? (u("MOUNT"), c("enter"), w === "none" && c("after-enter"))
            : w === "none" || w === "undefined" || n.value?.display === "none"
              ? (u("UNMOUNT"), c("leave"), c("after-leave"))
              : g && b !== w
                ? (u("ANIMATION_OUT"), c("leave"))
                : (u("UNMOUNT"), c("after-leave"));
        }
      },
      { immediate: !0 },
    );
    const f = (v) => {
        const g = Vs(t.value),
          m = g.includes(CSS.escape(v.animationName)),
          b = a.value === "mounted" ? "enter" : "leave";
        if (
          v.target === t.value &&
          m &&
          (c(`after-${b}`), u("ANIMATION_END"), !s.value)
        ) {
          const w = t.value.style.animationFillMode;
          ((t.value.style.animationFillMode = "forwards"),
            (o = l?.setTimeout(() => {
              t.value?.style.animationFillMode === "forwards" &&
                (t.value.style.animationFillMode = w);
            })));
        }
        v.target === t.value && g === "none" && u("ANIMATION_END");
      },
      d = (v) => {
        v.target === t.value && (r.value = Vs(t.value));
      },
      h = Ee(
        t,
        (v, g) => {
          v
            ? ((n.value = getComputedStyle(v)),
              v.addEventListener("animationstart", d),
              v.addEventListener("animationcancel", f),
              v.addEventListener("animationend", f))
            : (u("ANIMATION_END"),
              o !== void 0 && l?.clearTimeout(o),
              g?.removeEventListener("animationstart", d),
              g?.removeEventListener("animationcancel", f),
              g?.removeEventListener("animationend", f));
        },
        { immediate: !0 },
      ),
      p = Ee(a, () => {
        const v = Vs(t.value);
        r.value = a.value === "mounted" ? v : "none";
      });
    return (
      vr(() => {
        (h(), p());
      }),
      { isPresent: V(() => ["mounted", "unmountSuspended"].includes(a.value)) }
    );
  }
  function Vs(e) {
    return (e && getComputedStyle(e).animationName) || "none";
  }
  var xy = Z({
    name: "Presence",
    props: {
      present: { type: Boolean, required: !0 },
      forceMount: { type: Boolean },
    },
    slots: {},
    setup(e, { slots: t, expose: n }) {
      const { present: r, forceMount: s } = Ul(e),
        i = Q(),
        { isPresent: o } = by(r, i);
      n({ present: o });
      let l = t.default({ present: o.value });
      l = _o(l || []);
      const a = qe();
      if (l && l?.length > 1) {
        const u = a?.parent?.type.name
          ? `<${a.parent.type.name} />`
          : "component";
        throw new Error(
          [
            `Detected an invalid children for \`${u}\` for  \`Presence\` component.`,
            "",
            "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
            "You can apply a few solutions:",
            [
              "Provide a single child element so that `presence` directive attach correctly.",
              "Ensure the first child is an actual element instead of a raw text node or comment node.",
            ].map((c) => `  - ${c}`).join(`
`),
          ].join(`
`),
        );
      }
      return () =>
        s.value || r.value || o.value
          ? cn(t.default({ present: o.value })[0], {
              ref: (u) => {
                const c = Fs(u);
                return (
                  typeof c?.hasAttribute > "u" ||
                    (c?.hasAttribute("data-reka-popper-content-wrapper")
                      ? (i.value = c.firstElementChild)
                      : (i.value = c)),
                  c
                );
              },
            })
          : null;
    },
  });
  const wy = Z({
      name: "PrimitiveSlot",
      inheritAttrs: !1,
      setup(e, { attrs: t, slots: n }) {
        return () => {
          if (!n.default) return null;
          const r = _o(n.default()),
            s = r.findIndex((a) => a.type !== Me);
          if (s === -1) return r;
          const i = r[s];
          delete i.props?.ref;
          const o = i.props ? Ke(t, i.props) : t,
            l = yt({ ...i, props: {} }, o);
          return r.length === 1 ? l : ((r[s] = l), r);
        };
      },
    }),
    _y = ["area", "img", "input"],
    Yn = Z({
      name: "Primitive",
      inheritAttrs: !1,
      props: {
        asChild: { type: Boolean, default: !1 },
        as: { type: [String, Object], default: "div" },
      },
      setup(e, { attrs: t, slots: n }) {
        const r = e.asChild ? "template" : e.as;
        return typeof r == "string" && _y.includes(r)
          ? () => cn(r, t)
          : r !== "template"
            ? () => cn(e.as, t, { default: n.default })
            : () => cn(wy, t, { default: n.default });
      },
    }),
    Sy = "dismissableLayer.pointerDownOutside",
    Ey = "dismissableLayer.focusOutside";
  function su(e, t) {
    const n = t.closest("[data-dismissable-layer]"),
      r =
        e.dataset.dismissableLayer === ""
          ? e
          : e.querySelector("[data-dismissable-layer]"),
      s = Array.from(
        e.ownerDocument.querySelectorAll("[data-dismissable-layer]"),
      );
    return !!(n && (r === n || s.indexOf(r) < s.indexOf(n)));
  }
  function Cy(e, t, n = !0) {
    const r = t?.value?.ownerDocument ?? globalThis?.document,
      s = Q(!1),
      i = Q(() => {});
    return (
      We((o) => {
        if (!Mr || !Oe(n)) return;
        const l = async (u) => {
            const c = u.target;
            if (!(!t?.value || !c)) {
              if (su(t.value, c)) {
                s.value = !1;
                return;
              }
              if (u.target && !s.value) {
                let d = function () {
                  tu(Sy, e, f);
                };
                const f = { originalEvent: u };
                u.pointerType === "touch"
                  ? (r.removeEventListener("click", i.value),
                    (i.value = d),
                    r.addEventListener("click", i.value, { once: !0 }))
                  : d();
              } else r.removeEventListener("click", i.value);
              s.value = !1;
            }
          },
          a = window.setTimeout(() => {
            r.addEventListener("pointerdown", l);
          }, 0);
        o(() => {
          (window.clearTimeout(a),
            r.removeEventListener("pointerdown", l),
            r.removeEventListener("click", i.value));
        });
      }),
      {
        onPointerDownCapture: () => {
          Oe(n) && (s.value = !0);
        },
      }
    );
  }
  function Ty(e, t, n = !0) {
    const r = t?.value?.ownerDocument ?? globalThis?.document,
      s = Q(!1);
    return (
      We((i) => {
        if (!Mr || !Oe(n)) return;
        const o = async (l) => {
          if (!t?.value) return;
          (await Le(), await Le());
          const a = l.target;
          !t.value ||
            !a ||
            su(t.value, a) ||
            (l.target && !s.value && tu(Ey, e, { originalEvent: l }));
        };
        (r.addEventListener("focusin", o),
          i(() => r.removeEventListener("focusin", o)));
      }),
      {
        onFocusCapture: () => {
          Oe(n) && (s.value = !0);
        },
        onBlurCapture: () => {
          Oe(n) && (s.value = !1);
        },
      }
    );
  }
  const ut = Tt({
    layersRoot: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    originalBodyPointerEvents: void 0,
    branches: new Set(),
  });
  var Oy = Z({
      __name: "DismissableLayer",
      props: {
        disableOutsidePointerEvents: {
          type: Boolean,
          required: !1,
          default: !1,
        },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1 },
      },
      emits: [
        "escapeKeyDown",
        "pointerDownOutside",
        "focusOutside",
        "interactOutside",
        "dismiss",
      ],
      setup(e, { emit: t }) {
        const n = e,
          r = t,
          { forwardRef: s, currentElement: i } = ct(),
          o = V(() => i.value?.ownerDocument ?? globalThis.document),
          l = V(() => ut.layersRoot),
          a = V(() => (i.value ? Array.from(l.value).indexOf(i.value) : -1)),
          u = V(() => ut.layersWithOutsidePointerEventsDisabled.size > 0),
          c = V(() => {
            const h = Array.from(l.value),
              [p] = [...ut.layersWithOutsidePointerEventsDisabled].slice(-1),
              y = h.indexOf(p);
            return a.value >= y;
          }),
          f = Cy(async (h) => {
            const p = [...ut.branches].some((y) => y?.contains(h.target));
            !c.value ||
              p ||
              (r("pointerDownOutside", h),
              r("interactOutside", h),
              await Le(),
              h.defaultPrevented || r("dismiss"));
          }, i),
          d = Ty((h) => {
            [...ut.branches].some((y) => y?.contains(h.target)) ||
              (r("focusOutside", h),
              r("interactOutside", h),
              h.defaultPrevented || r("dismiss"));
          }, i);
        return (
          sy("Escape", (h) => {
            a.value === l.value.size - 1 &&
              (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
          }),
          We((h) => {
            i.value &&
              (n.disableOutsidePointerEvents &&
                (ut.layersWithOutsidePointerEventsDisabled.size === 0 &&
                  ((ut.originalBodyPointerEvents =
                    o.value.body.style.pointerEvents),
                  (o.value.body.style.pointerEvents = "none")),
                ut.layersWithOutsidePointerEventsDisabled.add(i.value)),
              l.value.add(i.value),
              h(() => {
                n.disableOutsidePointerEvents &&
                  ut.layersWithOutsidePointerEventsDisabled.size === 1 &&
                  !G1(ut.originalBodyPointerEvents) &&
                  (o.value.body.style.pointerEvents =
                    ut.originalBodyPointerEvents);
              }));
          }),
          We((h) => {
            h(() => {
              i.value &&
                (l.value.delete(i.value),
                ut.layersWithOutsidePointerEventsDisabled.delete(i.value));
            });
          }),
          (h, p) => (
            M(),
            Y(
              F(Yn),
              {
                ref: F(s),
                "as-child": h.asChild,
                as: h.as,
                "data-dismissable-layer": "",
                style: St({
                  pointerEvents: u.value ? (c.value ? "auto" : "none") : void 0,
                }),
                onFocusCapture: F(d).onFocusCapture,
                onBlurCapture: F(d).onBlurCapture,
                onPointerdownCapture: F(f).onPointerDownCapture,
              },
              { default: se(() => [he(h.$slots, "default")]), _: 3 },
              8,
              [
                "as-child",
                "as",
                "style",
                "onFocusCapture",
                "onBlurCapture",
                "onPointerdownCapture",
              ],
            )
          )
        );
      },
    }),
    jy = Oy,
    Ay = Z({
      __name: "Teleport",
      props: {
        to: { type: null, required: !1, default: "body" },
        disabled: { type: Boolean, required: !1 },
        defer: { type: Boolean, required: !1 },
        forceMount: { type: Boolean, required: !1 },
      },
      setup(e) {
        const t = ny();
        return (n, r) =>
          F(t) || n.forceMount
            ? (M(),
              Y(
                zd,
                { key: 0, to: n.to, disabled: n.disabled, defer: n.defer },
                [he(n.$slots, "default")],
                8,
                ["to", "disabled", "defer"],
              ))
            : Se("v-if", !0);
      },
    }),
    ky = Ay,
    My = Z({
      __name: "VisuallyHidden",
      props: {
        feature: { type: String, required: !1, default: "focusable" },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1, default: "span" },
      },
      setup(e) {
        return (t, n) => (
          M(),
          Y(
            F(Yn),
            {
              as: t.as,
              "as-child": t.asChild,
              "aria-hidden": t.feature === "focusable" ? "true" : void 0,
              "data-hidden": t.feature === "fully-hidden" ? "" : void 0,
              tabindex: t.feature === "fully-hidden" ? "-1" : void 0,
              style: {
                position: "absolute",
                border: 0,
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                clipPath: "inset(50%)",
                whiteSpace: "nowrap",
                wordWrap: "normal",
                top: "-1px",
                left: "-1px",
              },
            },
            { default: se(() => [he(t.$slots, "default")]), _: 3 },
            8,
            ["as", "as-child", "aria-hidden", "data-hidden", "tabindex"],
          )
        );
      },
    }),
    Py = My;
  const [iu, Ry] = Bs("PopperRoot");
  var Dy = Z({
      inheritAttrs: !1,
      __name: "PopperRoot",
      setup(e) {
        const t = Q();
        return (
          Ry({ anchor: t, onAnchorChange: (n) => (t.value = n) }),
          (n, r) => he(n.$slots, "default")
        );
      },
    }),
    $y = Dy,
    Ly = Z({
      __name: "PopperAnchor",
      props: {
        reference: { type: null, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1 },
      },
      setup(e) {
        const t = e,
          { forwardRef: n, currentElement: r } = ct(),
          s = iu();
        return (
          na(() => {
            s.onAnchorChange(t.reference ?? r.value);
          }),
          (i, o) => (
            M(),
            Y(
              F(Yn),
              { ref: F(n), as: i.as, "as-child": i.asChild },
              { default: se(() => [he(i.$slots, "default")]), _: 3 },
              8,
              ["as", "as-child"],
            )
          )
        );
      },
    }),
    Iy = Ly;
  const Ny = { key: 0, d: "M0 0L6 6L12 0" },
    By = {
      key: 1,
      d: "M0 0L4.58579 4.58579C5.36683 5.36683 6.63316 5.36684 7.41421 4.58579L12 0",
    };
  var Fy = Z({
      __name: "Arrow",
      props: {
        width: { type: Number, required: !1, default: 10 },
        height: { type: Number, required: !1, default: 5 },
        rounded: { type: Boolean, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1, default: "svg" },
      },
      setup(e) {
        const t = e;
        return (
          ct(),
          (n, r) => (
            M(),
            Y(
              F(Yn),
              Ke(t, {
                width: n.width,
                height: n.height,
                viewBox: n.asChild ? void 0 : "0 0 12 6",
                preserveAspectRatio: n.asChild ? void 0 : "none",
              }),
              {
                default: se(() => [
                  he(n.$slots, "default", {}, () => [
                    n.rounded ? (M(), ee("path", By)) : (M(), ee("path", Ny)),
                  ]),
                ]),
                _: 3,
              },
              16,
              ["width", "height", "viewBox", "preserveAspectRatio"],
            )
          )
        );
      },
    }),
    Vy = Fy;
  function Hy(e) {
    return e !== null;
  }
  function zy(e) {
    return {
      name: "transformOrigin",
      options: e,
      fn(t) {
        const { placement: n, rects: r, middlewareData: s } = t,
          o = s.arrow?.centerOffset !== 0,
          l = o ? 0 : e.arrowWidth,
          a = o ? 0 : e.arrowHeight,
          [u, c] = To(n),
          f = { start: "0%", center: "50%", end: "100%" }[c],
          d = (s.arrow?.x ?? 0) + l / 2,
          h = (s.arrow?.y ?? 0) + a / 2;
        let p = "",
          y = "";
        return (
          u === "bottom"
            ? ((p = o ? f : `${d}px`), (y = `${-a}px`))
            : u === "top"
              ? ((p = o ? f : `${d}px`), (y = `${r.floating.height + a}px`))
              : u === "right"
                ? ((p = `${-a}px`), (y = o ? f : `${h}px`))
                : u === "left" &&
                  ((p = `${r.floating.width + a}px`), (y = o ? f : `${h}px`)),
          { data: { x: p, y } }
        );
      },
    };
  }
  function To(e) {
    const [t, n = "center"] = e.split("-");
    return [t, n];
  }
  const Wy = ["top", "right", "bottom", "left"],
    dn = Math.min,
    tt = Math.max,
    Hs = Math.round,
    zs = Math.floor,
    Pt = (e) => ({ x: e, y: e }),
    Uy = { left: "right", right: "left", bottom: "top", top: "bottom" },
    Ky = { start: "end", end: "start" };
  function Oo(e, t, n) {
    return tt(e, dn(t, n));
  }
  function Xt(e, t) {
    return typeof e == "function" ? e(t) : e;
  }
  function Qt(e) {
    return e.split("-")[0];
  }
  function Jn(e) {
    return e.split("-")[1];
  }
  function jo(e) {
    return e === "x" ? "y" : "x";
  }
  function Ao(e) {
    return e === "y" ? "height" : "width";
  }
  const qy = new Set(["top", "bottom"]);
  function Rt(e) {
    return qy.has(Qt(e)) ? "y" : "x";
  }
  function ko(e) {
    return jo(Rt(e));
  }
  function Gy(e, t, n) {
    n === void 0 && (n = !1);
    const r = Jn(e),
      s = ko(e),
      i = Ao(s);
    let o =
      s === "x"
        ? r === (n ? "end" : "start")
          ? "right"
          : "left"
        : r === "start"
          ? "bottom"
          : "top";
    return (t.reference[i] > t.floating[i] && (o = Ws(o)), [o, Ws(o)]);
  }
  function Yy(e) {
    const t = Ws(e);
    return [Mo(e), t, Mo(t)];
  }
  function Mo(e) {
    return e.replace(/start|end/g, (t) => Ky[t]);
  }
  const ou = ["left", "right"],
    lu = ["right", "left"],
    Jy = ["top", "bottom"],
    Xy = ["bottom", "top"];
  function Qy(e, t, n) {
    switch (e) {
      case "top":
      case "bottom":
        return n ? (t ? lu : ou) : t ? ou : lu;
      case "left":
      case "right":
        return t ? Jy : Xy;
      default:
        return [];
    }
  }
  function Zy(e, t, n, r) {
    const s = Jn(e);
    let i = Qy(Qt(e), n === "start", r);
    return (
      s && ((i = i.map((o) => o + "-" + s)), t && (i = i.concat(i.map(Mo)))),
      i
    );
  }
  function Ws(e) {
    return e.replace(/left|right|bottom|top/g, (t) => Uy[t]);
  }
  function eg(e) {
    return { top: 0, right: 0, bottom: 0, left: 0, ...e };
  }
  function au(e) {
    return typeof e != "number"
      ? eg(e)
      : { top: e, right: e, bottom: e, left: e };
  }
  function Us(e) {
    const { x: t, y: n, width: r, height: s } = e;
    return {
      width: r,
      height: s,
      top: n,
      left: t,
      right: t + r,
      bottom: n + s,
      x: t,
      y: n,
    };
  }
  function cu(e, t, n) {
    let { reference: r, floating: s } = e;
    const i = Rt(t),
      o = ko(t),
      l = Ao(o),
      a = Qt(t),
      u = i === "y",
      c = r.x + r.width / 2 - s.width / 2,
      f = r.y + r.height / 2 - s.height / 2,
      d = r[l] / 2 - s[l] / 2;
    let h;
    switch (a) {
      case "top":
        h = { x: c, y: r.y - s.height };
        break;
      case "bottom":
        h = { x: c, y: r.y + r.height };
        break;
      case "right":
        h = { x: r.x + r.width, y: f };
        break;
      case "left":
        h = { x: r.x - s.width, y: f };
        break;
      default:
        h = { x: r.x, y: r.y };
    }
    switch (Jn(t)) {
      case "start":
        h[o] -= d * (n && u ? -1 : 1);
        break;
      case "end":
        h[o] += d * (n && u ? -1 : 1);
        break;
    }
    return h;
  }
  const tg = async (e, t, n) => {
    const {
        placement: r = "bottom",
        strategy: s = "absolute",
        middleware: i = [],
        platform: o,
      } = n,
      l = i.filter(Boolean),
      a = await (o.isRTL == null ? void 0 : o.isRTL(t));
    let u = await o.getElementRects({ reference: e, floating: t, strategy: s }),
      { x: c, y: f } = cu(u, r, a),
      d = r,
      h = {},
      p = 0;
    for (let y = 0; y < l.length; y++) {
      const { name: v, fn: g } = l[y],
        {
          x: m,
          y: b,
          data: w,
          reset: S,
        } = await g({
          x: c,
          y: f,
          initialPlacement: r,
          placement: d,
          strategy: s,
          middlewareData: h,
          rects: u,
          platform: o,
          elements: { reference: e, floating: t },
        });
      ((c = m ?? c),
        (f = b ?? f),
        (h = { ...h, [v]: { ...h[v], ...w } }),
        S &&
          p <= 50 &&
          (p++,
          typeof S == "object" &&
            (S.placement && (d = S.placement),
            S.rects &&
              (u =
                S.rects === !0
                  ? await o.getElementRects({
                      reference: e,
                      floating: t,
                      strategy: s,
                    })
                  : S.rects),
            ({ x: c, y: f } = cu(u, d, a))),
          (y = -1)));
    }
    return { x: c, y: f, placement: d, strategy: s, middlewareData: h };
  };
  async function Pr(e, t) {
    var n;
    t === void 0 && (t = {});
    const { x: r, y: s, platform: i, rects: o, elements: l, strategy: a } = e,
      {
        boundary: u = "clippingAncestors",
        rootBoundary: c = "viewport",
        elementContext: f = "floating",
        altBoundary: d = !1,
        padding: h = 0,
      } = Xt(t, e),
      p = au(h),
      v = l[d ? (f === "floating" ? "reference" : "floating") : f],
      g = Us(
        await i.getClippingRect({
          element:
            (n = await (i.isElement == null ? void 0 : i.isElement(v))) ==
              null || n
              ? v
              : v.contextElement ||
                (await (i.getDocumentElement == null
                  ? void 0
                  : i.getDocumentElement(l.floating))),
          boundary: u,
          rootBoundary: c,
          strategy: a,
        }),
      ),
      m =
        f === "floating"
          ? { x: r, y: s, width: o.floating.width, height: o.floating.height }
          : o.reference,
      b = await (i.getOffsetParent == null
        ? void 0
        : i.getOffsetParent(l.floating)),
      w = (await (i.isElement == null ? void 0 : i.isElement(b)))
        ? (await (i.getScale == null ? void 0 : i.getScale(b))) || {
            x: 1,
            y: 1,
          }
        : { x: 1, y: 1 },
      S = Us(
        i.convertOffsetParentRelativeRectToViewportRelativeRect
          ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
              elements: l,
              rect: m,
              offsetParent: b,
              strategy: a,
            })
          : m,
      );
    return {
      top: (g.top - S.top + p.top) / w.y,
      bottom: (S.bottom - g.bottom + p.bottom) / w.y,
      left: (g.left - S.left + p.left) / w.x,
      right: (S.right - g.right + p.right) / w.x,
    };
  }
  const ng = (e) => ({
      name: "arrow",
      options: e,
      async fn(t) {
        const {
            x: n,
            y: r,
            placement: s,
            rects: i,
            platform: o,
            elements: l,
            middlewareData: a,
          } = t,
          { element: u, padding: c = 0 } = Xt(e, t) || {};
        if (u == null) return {};
        const f = au(c),
          d = { x: n, y: r },
          h = ko(s),
          p = Ao(h),
          y = await o.getDimensions(u),
          v = h === "y",
          g = v ? "top" : "left",
          m = v ? "bottom" : "right",
          b = v ? "clientHeight" : "clientWidth",
          w = i.reference[p] + i.reference[h] - d[h] - i.floating[p],
          S = d[h] - i.reference[h],
          E = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(u));
        let T = E ? E[b] : 0;
        (!T || !(await (o.isElement == null ? void 0 : o.isElement(E)))) &&
          (T = l.floating[b] || i.floating[p]);
        const D = w / 2 - S / 2,
          R = T / 2 - y[p] / 2 - 1,
          H = dn(f[g], R),
          U = dn(f[m], R),
          P = H,
          re = T - y[p] - U,
          I = T / 2 - y[p] / 2 + D,
          oe = Oo(P, I, re),
          te =
            !a.arrow &&
            Jn(s) != null &&
            I !== oe &&
            i.reference[p] / 2 - (I < P ? H : U) - y[p] / 2 < 0,
          X = te ? (I < P ? I - P : I - re) : 0;
        return {
          [h]: d[h] + X,
          data: {
            [h]: oe,
            centerOffset: I - oe - X,
            ...(te && { alignmentOffset: X }),
          },
          reset: te,
        };
      },
    }),
    rg = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: "flip",
          options: e,
          async fn(t) {
            var n, r;
            const {
                placement: s,
                middlewareData: i,
                rects: o,
                initialPlacement: l,
                platform: a,
                elements: u,
              } = t,
              {
                mainAxis: c = !0,
                crossAxis: f = !0,
                fallbackPlacements: d,
                fallbackStrategy: h = "bestFit",
                fallbackAxisSideDirection: p = "none",
                flipAlignment: y = !0,
                ...v
              } = Xt(e, t);
            if ((n = i.arrow) != null && n.alignmentOffset) return {};
            const g = Qt(s),
              m = Rt(l),
              b = Qt(l) === l,
              w = await (a.isRTL == null ? void 0 : a.isRTL(u.floating)),
              S = d || (b || !y ? [Ws(l)] : Yy(l)),
              E = p !== "none";
            !d && E && S.push(...Zy(l, y, p, w));
            const T = [l, ...S],
              D = await Pr(t, v),
              R = [];
            let H = ((r = i.flip) == null ? void 0 : r.overflows) || [];
            if ((c && R.push(D[g]), f)) {
              const I = Gy(s, o, w);
              R.push(D[I[0]], D[I[1]]);
            }
            if (
              ((H = [...H, { placement: s, overflows: R }]),
              !R.every((I) => I <= 0))
            ) {
              var U, P;
              const I = (((U = i.flip) == null ? void 0 : U.index) || 0) + 1,
                oe = T[I];
              if (
                oe &&
                (!(f === "alignment" ? m !== Rt(oe) : !1) ||
                  H.every((K) =>
                    Rt(K.placement) === m ? K.overflows[0] > 0 : !0,
                  ))
              )
                return {
                  data: { index: I, overflows: H },
                  reset: { placement: oe },
                };
              let te =
                (P = H.filter((X) => X.overflows[0] <= 0).sort(
                  (X, K) => X.overflows[1] - K.overflows[1],
                )[0]) == null
                  ? void 0
                  : P.placement;
              if (!te)
                switch (h) {
                  case "bestFit": {
                    var re;
                    const X =
                      (re = H.filter((K) => {
                        if (E) {
                          const xe = Rt(K.placement);
                          return xe === m || xe === "y";
                        }
                        return !0;
                      })
                        .map((K) => [
                          K.placement,
                          K.overflows
                            .filter((xe) => xe > 0)
                            .reduce((xe, en) => xe + en, 0),
                        ])
                        .sort((K, xe) => K[1] - xe[1])[0]) == null
                        ? void 0
                        : re[0];
                    X && (te = X);
                    break;
                  }
                  case "initialPlacement":
                    te = l;
                    break;
                }
              if (s !== te) return { reset: { placement: te } };
            }
            return {};
          },
        }
      );
    };
  function uu(e, t) {
    return {
      top: e.top - t.height,
      right: e.right - t.width,
      bottom: e.bottom - t.height,
      left: e.left - t.width,
    };
  }
  function fu(e) {
    return Wy.some((t) => e[t] >= 0);
  }
  const sg = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: "hide",
          options: e,
          async fn(t) {
            const { rects: n } = t,
              { strategy: r = "referenceHidden", ...s } = Xt(e, t);
            switch (r) {
              case "referenceHidden": {
                const i = await Pr(t, { ...s, elementContext: "reference" }),
                  o = uu(i, n.reference);
                return {
                  data: { referenceHiddenOffsets: o, referenceHidden: fu(o) },
                };
              }
              case "escaped": {
                const i = await Pr(t, { ...s, altBoundary: !0 }),
                  o = uu(i, n.floating);
                return { data: { escapedOffsets: o, escaped: fu(o) } };
              }
              default:
                return {};
            }
          },
        }
      );
    },
    du = new Set(["left", "top"]);
  async function ig(e, t) {
    const { placement: n, platform: r, elements: s } = e,
      i = await (r.isRTL == null ? void 0 : r.isRTL(s.floating)),
      o = Qt(n),
      l = Jn(n),
      a = Rt(n) === "y",
      u = du.has(o) ? -1 : 1,
      c = i && a ? -1 : 1,
      f = Xt(t, e);
    let {
      mainAxis: d,
      crossAxis: h,
      alignmentAxis: p,
    } = typeof f == "number"
      ? { mainAxis: f, crossAxis: 0, alignmentAxis: null }
      : {
          mainAxis: f.mainAxis || 0,
          crossAxis: f.crossAxis || 0,
          alignmentAxis: f.alignmentAxis,
        };
    return (
      l && typeof p == "number" && (h = l === "end" ? p * -1 : p),
      a ? { x: h * c, y: d * u } : { x: d * u, y: h * c }
    );
  }
  const og = function (e) {
      return (
        e === void 0 && (e = 0),
        {
          name: "offset",
          options: e,
          async fn(t) {
            var n, r;
            const { x: s, y: i, placement: o, middlewareData: l } = t,
              a = await ig(t, e);
            return o === ((n = l.offset) == null ? void 0 : n.placement) &&
              (r = l.arrow) != null &&
              r.alignmentOffset
              ? {}
              : { x: s + a.x, y: i + a.y, data: { ...a, placement: o } };
          },
        }
      );
    },
    lg = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: "shift",
          options: e,
          async fn(t) {
            const { x: n, y: r, placement: s } = t,
              {
                mainAxis: i = !0,
                crossAxis: o = !1,
                limiter: l = {
                  fn: (v) => {
                    let { x: g, y: m } = v;
                    return { x: g, y: m };
                  },
                },
                ...a
              } = Xt(e, t),
              u = { x: n, y: r },
              c = await Pr(t, a),
              f = Rt(Qt(s)),
              d = jo(f);
            let h = u[d],
              p = u[f];
            if (i) {
              const v = d === "y" ? "top" : "left",
                g = d === "y" ? "bottom" : "right",
                m = h + c[v],
                b = h - c[g];
              h = Oo(m, h, b);
            }
            if (o) {
              const v = f === "y" ? "top" : "left",
                g = f === "y" ? "bottom" : "right",
                m = p + c[v],
                b = p - c[g];
              p = Oo(m, p, b);
            }
            const y = l.fn({ ...t, [d]: h, [f]: p });
            return {
              ...y,
              data: { x: y.x - n, y: y.y - r, enabled: { [d]: i, [f]: o } },
            };
          },
        }
      );
    },
    ag = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          options: e,
          fn(t) {
            const { x: n, y: r, placement: s, rects: i, middlewareData: o } = t,
              { offset: l = 0, mainAxis: a = !0, crossAxis: u = !0 } = Xt(e, t),
              c = { x: n, y: r },
              f = Rt(s),
              d = jo(f);
            let h = c[d],
              p = c[f];
            const y = Xt(l, t),
              v =
                typeof y == "number"
                  ? { mainAxis: y, crossAxis: 0 }
                  : { mainAxis: 0, crossAxis: 0, ...y };
            if (a) {
              const b = d === "y" ? "height" : "width",
                w = i.reference[d] - i.floating[b] + v.mainAxis,
                S = i.reference[d] + i.reference[b] - v.mainAxis;
              h < w ? (h = w) : h > S && (h = S);
            }
            if (u) {
              var g, m;
              const b = d === "y" ? "width" : "height",
                w = du.has(Qt(s)),
                S =
                  i.reference[f] -
                  i.floating[b] +
                  ((w && ((g = o.offset) == null ? void 0 : g[f])) || 0) +
                  (w ? 0 : v.crossAxis),
                E =
                  i.reference[f] +
                  i.reference[b] +
                  (w ? 0 : ((m = o.offset) == null ? void 0 : m[f]) || 0) -
                  (w ? v.crossAxis : 0);
              p < S ? (p = S) : p > E && (p = E);
            }
            return { [d]: h, [f]: p };
          },
        }
      );
    },
    cg = function (e) {
      return (
        e === void 0 && (e = {}),
        {
          name: "size",
          options: e,
          async fn(t) {
            var n, r;
            const { placement: s, rects: i, platform: o, elements: l } = t,
              { apply: a = () => {}, ...u } = Xt(e, t),
              c = await Pr(t, u),
              f = Qt(s),
              d = Jn(s),
              h = Rt(s) === "y",
              { width: p, height: y } = i.floating;
            let v, g;
            f === "top" || f === "bottom"
              ? ((v = f),
                (g =
                  d ===
                  ((await (o.isRTL == null ? void 0 : o.isRTL(l.floating)))
                    ? "start"
                    : "end")
                    ? "left"
                    : "right"))
              : ((g = f), (v = d === "end" ? "top" : "bottom"));
            const m = y - c.top - c.bottom,
              b = p - c.left - c.right,
              w = dn(y - c[v], m),
              S = dn(p - c[g], b),
              E = !t.middlewareData.shift;
            let T = w,
              D = S;
            if (
              ((n = t.middlewareData.shift) != null && n.enabled.x && (D = b),
              (r = t.middlewareData.shift) != null && r.enabled.y && (T = m),
              E && !d)
            ) {
              const H = tt(c.left, 0),
                U = tt(c.right, 0),
                P = tt(c.top, 0),
                re = tt(c.bottom, 0);
              h
                ? (D =
                    p - 2 * (H !== 0 || U !== 0 ? H + U : tt(c.left, c.right)))
                : (T =
                    y -
                    2 * (P !== 0 || re !== 0 ? P + re : tt(c.top, c.bottom)));
            }
            await a({ ...t, availableWidth: D, availableHeight: T });
            const R = await o.getDimensions(l.floating);
            return p !== R.width || y !== R.height
              ? { reset: { rects: !0 } }
              : {};
          },
        }
      );
    };
  function Ks() {
    return typeof window < "u";
  }
  function On(e) {
    return Po(e) ? (e.nodeName || "").toLowerCase() : "#document";
  }
  function nt(e) {
    var t;
    return (
      (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) ||
      window
    );
  }
  function Dt(e) {
    var t;
    return (t = (Po(e) ? e.ownerDocument : e.document) || window.document) ==
      null
      ? void 0
      : t.documentElement;
  }
  function Po(e) {
    return Ks() ? e instanceof Node || e instanceof nt(e).Node : !1;
  }
  function mt(e) {
    return Ks() ? e instanceof Element || e instanceof nt(e).Element : !1;
  }
  function $t(e) {
    return Ks()
      ? e instanceof HTMLElement || e instanceof nt(e).HTMLElement
      : !1;
  }
  function hu(e) {
    return !Ks() || typeof ShadowRoot > "u"
      ? !1
      : e instanceof ShadowRoot || e instanceof nt(e).ShadowRoot;
  }
  const ug = new Set(["inline", "contents"]);
  function Rr(e) {
    const { overflow: t, overflowX: n, overflowY: r, display: s } = vt(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !ug.has(s);
  }
  const fg = new Set(["table", "td", "th"]);
  function dg(e) {
    return fg.has(On(e));
  }
  const hg = [":popover-open", ":modal"];
  function qs(e) {
    return hg.some((t) => {
      try {
        return e.matches(t);
      } catch {
        return !1;
      }
    });
  }
  const pg = ["transform", "translate", "scale", "rotate", "perspective"],
    yg = ["transform", "translate", "scale", "rotate", "perspective", "filter"],
    gg = ["paint", "layout", "strict", "content"];
  function Ro(e) {
    const t = Do(),
      n = mt(e) ? vt(e) : e;
    return (
      pg.some((r) => (n[r] ? n[r] !== "none" : !1)) ||
      (n.containerType ? n.containerType !== "normal" : !1) ||
      (!t && (n.backdropFilter ? n.backdropFilter !== "none" : !1)) ||
      (!t && (n.filter ? n.filter !== "none" : !1)) ||
      yg.some((r) => (n.willChange || "").includes(r)) ||
      gg.some((r) => (n.contain || "").includes(r))
    );
  }
  function mg(e) {
    let t = hn(e);
    for (; $t(t) && !Xn(t); ) {
      if (Ro(t)) return t;
      if (qs(t)) return null;
      t = hn(t);
    }
    return null;
  }
  function Do() {
    return typeof CSS > "u" || !CSS.supports
      ? !1
      : CSS.supports("-webkit-backdrop-filter", "none");
  }
  const vg = new Set(["html", "body", "#document"]);
  function Xn(e) {
    return vg.has(On(e));
  }
  function vt(e) {
    return nt(e).getComputedStyle(e);
  }
  function Gs(e) {
    return mt(e)
      ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
      : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
  }
  function hn(e) {
    if (On(e) === "html") return e;
    const t = e.assignedSlot || e.parentNode || (hu(e) && e.host) || Dt(e);
    return hu(t) ? t.host : t;
  }
  function pu(e) {
    const t = hn(e);
    return Xn(t)
      ? e.ownerDocument
        ? e.ownerDocument.body
        : e.body
      : $t(t) && Rr(t)
        ? t
        : pu(t);
  }
  function Dr(e, t, n) {
    var r;
    (t === void 0 && (t = []), n === void 0 && (n = !0));
    const s = pu(e),
      i = s === ((r = e.ownerDocument) == null ? void 0 : r.body),
      o = nt(s);
    if (i) {
      const l = $o(o);
      return t.concat(
        o,
        o.visualViewport || [],
        Rr(s) ? s : [],
        l && n ? Dr(l) : [],
      );
    }
    return t.concat(s, Dr(s, [], n));
  }
  function $o(e) {
    return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
  }
  function yu(e) {
    const t = vt(e);
    let n = parseFloat(t.width) || 0,
      r = parseFloat(t.height) || 0;
    const s = $t(e),
      i = s ? e.offsetWidth : n,
      o = s ? e.offsetHeight : r,
      l = Hs(n) !== i || Hs(r) !== o;
    return (l && ((n = i), (r = o)), { width: n, height: r, $: l });
  }
  function Lo(e) {
    return mt(e) ? e : e.contextElement;
  }
  function Qn(e) {
    const t = Lo(e);
    if (!$t(t)) return Pt(1);
    const n = t.getBoundingClientRect(),
      { width: r, height: s, $: i } = yu(t);
    let o = (i ? Hs(n.width) : n.width) / r,
      l = (i ? Hs(n.height) : n.height) / s;
    return (
      (!o || !Number.isFinite(o)) && (o = 1),
      (!l || !Number.isFinite(l)) && (l = 1),
      { x: o, y: l }
    );
  }
  const bg = Pt(0);
  function gu(e) {
    const t = nt(e);
    return !Do() || !t.visualViewport
      ? bg
      : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
  }
  function xg(e, t, n) {
    return (t === void 0 && (t = !1), !n || (t && n !== nt(e)) ? !1 : t);
  }
  function jn(e, t, n, r) {
    (t === void 0 && (t = !1), n === void 0 && (n = !1));
    const s = e.getBoundingClientRect(),
      i = Lo(e);
    let o = Pt(1);
    t && (r ? mt(r) && (o = Qn(r)) : (o = Qn(e)));
    const l = xg(i, n, r) ? gu(i) : Pt(0);
    let a = (s.left + l.x) / o.x,
      u = (s.top + l.y) / o.y,
      c = s.width / o.x,
      f = s.height / o.y;
    if (i) {
      const d = nt(i),
        h = r && mt(r) ? nt(r) : r;
      let p = d,
        y = $o(p);
      for (; y && r && h !== p; ) {
        const v = Qn(y),
          g = y.getBoundingClientRect(),
          m = vt(y),
          b = g.left + (y.clientLeft + parseFloat(m.paddingLeft)) * v.x,
          w = g.top + (y.clientTop + parseFloat(m.paddingTop)) * v.y;
        ((a *= v.x),
          (u *= v.y),
          (c *= v.x),
          (f *= v.y),
          (a += b),
          (u += w),
          (p = nt(y)),
          (y = $o(p)));
      }
    }
    return Us({ width: c, height: f, x: a, y: u });
  }
  function Ys(e, t) {
    const n = Gs(e).scrollLeft;
    return t ? t.left + n : jn(Dt(e)).left + n;
  }
  function mu(e, t) {
    const n = e.getBoundingClientRect(),
      r = n.left + t.scrollLeft - Ys(e, n),
      s = n.top + t.scrollTop;
    return { x: r, y: s };
  }
  function wg(e) {
    let { elements: t, rect: n, offsetParent: r, strategy: s } = e;
    const i = s === "fixed",
      o = Dt(r),
      l = t ? qs(t.floating) : !1;
    if (r === o || (l && i)) return n;
    let a = { scrollLeft: 0, scrollTop: 0 },
      u = Pt(1);
    const c = Pt(0),
      f = $t(r);
    if (
      (f || (!f && !i)) &&
      ((On(r) !== "body" || Rr(o)) && (a = Gs(r)), $t(r))
    ) {
      const h = jn(r);
      ((u = Qn(r)), (c.x = h.x + r.clientLeft), (c.y = h.y + r.clientTop));
    }
    const d = o && !f && !i ? mu(o, a) : Pt(0);
    return {
      width: n.width * u.x,
      height: n.height * u.y,
      x: n.x * u.x - a.scrollLeft * u.x + c.x + d.x,
      y: n.y * u.y - a.scrollTop * u.y + c.y + d.y,
    };
  }
  function _g(e) {
    return Array.from(e.getClientRects());
  }
  function Sg(e) {
    const t = Dt(e),
      n = Gs(e),
      r = e.ownerDocument.body,
      s = tt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth),
      i = tt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
    let o = -n.scrollLeft + Ys(e);
    const l = -n.scrollTop;
    return (
      vt(r).direction === "rtl" && (o += tt(t.clientWidth, r.clientWidth) - s),
      { width: s, height: i, x: o, y: l }
    );
  }
  const vu = 25;
  function Eg(e, t) {
    const n = nt(e),
      r = Dt(e),
      s = n.visualViewport;
    let i = r.clientWidth,
      o = r.clientHeight,
      l = 0,
      a = 0;
    if (s) {
      ((i = s.width), (o = s.height));
      const c = Do();
      (!c || (c && t === "fixed")) && ((l = s.offsetLeft), (a = s.offsetTop));
    }
    const u = Ys(r);
    if (u <= 0) {
      const c = r.ownerDocument,
        f = c.body,
        d = getComputedStyle(f),
        h =
          (c.compatMode === "CSS1Compat" &&
            parseFloat(d.marginLeft) + parseFloat(d.marginRight)) ||
          0,
        p = Math.abs(r.clientWidth - f.clientWidth - h);
      p <= vu && (i -= p);
    } else u <= vu && (i += u);
    return { width: i, height: o, x: l, y: a };
  }
  const Cg = new Set(["absolute", "fixed"]);
  function Tg(e, t) {
    const n = jn(e, !0, t === "fixed"),
      r = n.top + e.clientTop,
      s = n.left + e.clientLeft,
      i = $t(e) ? Qn(e) : Pt(1),
      o = e.clientWidth * i.x,
      l = e.clientHeight * i.y,
      a = s * i.x,
      u = r * i.y;
    return { width: o, height: l, x: a, y: u };
  }
  function bu(e, t, n) {
    let r;
    if (t === "viewport") r = Eg(e, n);
    else if (t === "document") r = Sg(Dt(e));
    else if (mt(t)) r = Tg(t, n);
    else {
      const s = gu(e);
      r = { x: t.x - s.x, y: t.y - s.y, width: t.width, height: t.height };
    }
    return Us(r);
  }
  function xu(e, t) {
    const n = hn(e);
    return n === t || !mt(n) || Xn(n)
      ? !1
      : vt(n).position === "fixed" || xu(n, t);
  }
  function Og(e, t) {
    const n = t.get(e);
    if (n) return n;
    let r = Dr(e, [], !1).filter((l) => mt(l) && On(l) !== "body"),
      s = null;
    const i = vt(e).position === "fixed";
    let o = i ? hn(e) : e;
    for (; mt(o) && !Xn(o); ) {
      const l = vt(o),
        a = Ro(o);
      (!a && l.position === "fixed" && (s = null),
        (
          i
            ? !a && !s
            : (!a && l.position === "static" && !!s && Cg.has(s.position)) ||
              (Rr(o) && !a && xu(e, o))
        )
          ? (r = r.filter((c) => c !== o))
          : (s = l),
        (o = hn(o)));
    }
    return (t.set(e, r), r);
  }
  function jg(e) {
    let { element: t, boundary: n, rootBoundary: r, strategy: s } = e;
    const o = [
        ...(n === "clippingAncestors"
          ? qs(t)
            ? []
            : Og(t, this._c)
          : [].concat(n)),
        r,
      ],
      l = o[0],
      a = o.reduce(
        (u, c) => {
          const f = bu(t, c, s);
          return (
            (u.top = tt(f.top, u.top)),
            (u.right = dn(f.right, u.right)),
            (u.bottom = dn(f.bottom, u.bottom)),
            (u.left = tt(f.left, u.left)),
            u
          );
        },
        bu(t, l, s),
      );
    return {
      width: a.right - a.left,
      height: a.bottom - a.top,
      x: a.left,
      y: a.top,
    };
  }
  function Ag(e) {
    const { width: t, height: n } = yu(e);
    return { width: t, height: n };
  }
  function kg(e, t, n) {
    const r = $t(t),
      s = Dt(t),
      i = n === "fixed",
      o = jn(e, !0, i, t);
    let l = { scrollLeft: 0, scrollTop: 0 };
    const a = Pt(0);
    function u() {
      a.x = Ys(s);
    }
    if (r || (!r && !i))
      if (((On(t) !== "body" || Rr(s)) && (l = Gs(t)), r)) {
        const h = jn(t, !0, i, t);
        ((a.x = h.x + t.clientLeft), (a.y = h.y + t.clientTop));
      } else s && u();
    i && !r && s && u();
    const c = s && !r && !i ? mu(s, l) : Pt(0),
      f = o.left + l.scrollLeft - a.x - c.x,
      d = o.top + l.scrollTop - a.y - c.y;
    return { x: f, y: d, width: o.width, height: o.height };
  }
  function Io(e) {
    return vt(e).position === "static";
  }
  function wu(e, t) {
    if (!$t(e) || vt(e).position === "fixed") return null;
    if (t) return t(e);
    let n = e.offsetParent;
    return (Dt(e) === n && (n = n.ownerDocument.body), n);
  }
  function _u(e, t) {
    const n = nt(e);
    if (qs(e)) return n;
    if (!$t(e)) {
      let s = hn(e);
      for (; s && !Xn(s); ) {
        if (mt(s) && !Io(s)) return s;
        s = hn(s);
      }
      return n;
    }
    let r = wu(e, t);
    for (; r && dg(r) && Io(r); ) r = wu(r, t);
    return r && Xn(r) && Io(r) && !Ro(r) ? n : r || mg(e) || n;
  }
  const Mg = async function (e) {
    const t = this.getOffsetParent || _u,
      n = this.getDimensions,
      r = await n(e.floating);
    return {
      reference: kg(e.reference, await t(e.floating), e.strategy),
      floating: { x: 0, y: 0, width: r.width, height: r.height },
    };
  };
  function Pg(e) {
    return vt(e).direction === "rtl";
  }
  const Rg = {
    convertOffsetParentRelativeRectToViewportRelativeRect: wg,
    getDocumentElement: Dt,
    getClippingRect: jg,
    getOffsetParent: _u,
    getElementRects: Mg,
    getClientRects: _g,
    getDimensions: Ag,
    getScale: Qn,
    isElement: mt,
    isRTL: Pg,
  };
  function Su(e, t) {
    return (
      e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
    );
  }
  function Dg(e, t) {
    let n = null,
      r;
    const s = Dt(e);
    function i() {
      var l;
      (clearTimeout(r), (l = n) == null || l.disconnect(), (n = null));
    }
    function o(l, a) {
      (l === void 0 && (l = !1), a === void 0 && (a = 1), i());
      const u = e.getBoundingClientRect(),
        { left: c, top: f, width: d, height: h } = u;
      if ((l || t(), !d || !h)) return;
      const p = zs(f),
        y = zs(s.clientWidth - (c + d)),
        v = zs(s.clientHeight - (f + h)),
        g = zs(c),
        b = {
          rootMargin: -p + "px " + -y + "px " + -v + "px " + -g + "px",
          threshold: tt(0, dn(1, a)) || 1,
        };
      let w = !0;
      function S(E) {
        const T = E[0].intersectionRatio;
        if (T !== a) {
          if (!w) return o();
          T
            ? o(!1, T)
            : (r = setTimeout(() => {
                o(!1, 1e-7);
              }, 1e3));
        }
        (T === 1 && !Su(u, e.getBoundingClientRect()) && o(), (w = !1));
      }
      try {
        n = new IntersectionObserver(S, { ...b, root: s.ownerDocument });
      } catch {
        n = new IntersectionObserver(S, b);
      }
      n.observe(e);
    }
    return (o(!0), i);
  }
  function $g(e, t, n, r) {
    r === void 0 && (r = {});
    const {
        ancestorScroll: s = !0,
        ancestorResize: i = !0,
        elementResize: o = typeof ResizeObserver == "function",
        layoutShift: l = typeof IntersectionObserver == "function",
        animationFrame: a = !1,
      } = r,
      u = Lo(e),
      c = s || i ? [...(u ? Dr(u) : []), ...Dr(t)] : [];
    c.forEach((g) => {
      (s && g.addEventListener("scroll", n, { passive: !0 }),
        i && g.addEventListener("resize", n));
    });
    const f = u && l ? Dg(u, n) : null;
    let d = -1,
      h = null;
    o &&
      ((h = new ResizeObserver((g) => {
        let [m] = g;
        (m &&
          m.target === u &&
          h &&
          (h.unobserve(t),
          cancelAnimationFrame(d),
          (d = requestAnimationFrame(() => {
            var b;
            (b = h) == null || b.observe(t);
          }))),
          n());
      })),
      u && !a && h.observe(u),
      h.observe(t));
    let p,
      y = a ? jn(e) : null;
    a && v();
    function v() {
      const g = jn(e);
      (y && !Su(y, g) && n(), (y = g), (p = requestAnimationFrame(v)));
    }
    return (
      n(),
      () => {
        var g;
        (c.forEach((m) => {
          (s && m.removeEventListener("scroll", n),
            i && m.removeEventListener("resize", n));
        }),
          f?.(),
          (g = h) == null || g.disconnect(),
          (h = null),
          a && cancelAnimationFrame(p));
      }
    );
  }
  const Lg = og,
    Ig = lg,
    Eu = rg,
    Ng = cg,
    Bg = sg,
    Fg = ng,
    Vg = ag,
    Hg = (e, t, n) => {
      const r = new Map(),
        s = { platform: Rg, ...n },
        i = { ...s.platform, _c: r };
      return tg(e, t, { ...s, platform: i });
    };
  function zg(e) {
    return e != null && typeof e == "object" && "$el" in e;
  }
  function No(e) {
    if (zg(e)) {
      const t = e.$el;
      return Po(t) && On(t) === "#comment" ? null : t;
    }
    return e;
  }
  function Zn(e) {
    return typeof e == "function" ? e() : F(e);
  }
  function Wg(e) {
    return {
      name: "arrow",
      options: e,
      fn(t) {
        const n = No(Zn(e.element));
        return n == null ? {} : Fg({ element: n, padding: e.padding }).fn(t);
      },
    };
  }
  function Cu(e) {
    return typeof window > "u"
      ? 1
      : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
  }
  function Tu(e, t) {
    const n = Cu(e);
    return Math.round(t * n) / n;
  }
  function Ug(e, t, n) {
    n === void 0 && (n = {});
    const r = n.whileElementsMounted,
      s = V(() => {
        var T;
        return (T = Zn(n.open)) != null ? T : !0;
      }),
      i = V(() => Zn(n.middleware)),
      o = V(() => {
        var T;
        return (T = Zn(n.placement)) != null ? T : "bottom";
      }),
      l = V(() => {
        var T;
        return (T = Zn(n.strategy)) != null ? T : "absolute";
      }),
      a = V(() => {
        var T;
        return (T = Zn(n.transform)) != null ? T : !0;
      }),
      u = V(() => No(e.value)),
      c = V(() => No(t.value)),
      f = Q(0),
      d = Q(0),
      h = Q(l.value),
      p = Q(o.value),
      y = fr({}),
      v = Q(!1),
      g = V(() => {
        const T = { position: h.value, left: "0", top: "0" };
        if (!c.value) return T;
        const D = Tu(c.value, f.value),
          R = Tu(c.value, d.value);
        return a.value
          ? {
              ...T,
              transform: "translate(" + D + "px, " + R + "px)",
              ...(Cu(c.value) >= 1.5 && { willChange: "transform" }),
            }
          : { position: h.value, left: D + "px", top: R + "px" };
      });
    let m;
    function b() {
      if (u.value == null || c.value == null) return;
      const T = s.value;
      Hg(u.value, c.value, {
        middleware: i.value,
        placement: o.value,
        strategy: l.value,
      }).then((D) => {
        ((f.value = D.x),
          (d.value = D.y),
          (h.value = D.strategy),
          (p.value = D.placement),
          (y.value = D.middlewareData),
          (v.value = T !== !1));
      });
    }
    function w() {
      typeof m == "function" && (m(), (m = void 0));
    }
    function S() {
      if ((w(), r === void 0)) {
        b();
        return;
      }
      if (u.value != null && c.value != null) {
        m = r(u.value, c.value, b);
        return;
      }
    }
    function E() {
      s.value || (v.value = !1);
    }
    return (
      Ee([i, o, l, s], b, { flush: "sync" }),
      Ee([u, c], S, { flush: "sync" }),
      Ee(s, E, { flush: "sync" }),
      wi() && Sl(w),
      {
        x: In(f),
        y: In(d),
        strategy: In(h),
        placement: In(p),
        middlewareData: In(y),
        isPositioned: In(v),
        floatingStyles: g,
        update: b,
      }
    );
  }
  const Kg = {
      side: "bottom",
      sideOffset: 0,
      sideFlip: !0,
      align: "center",
      alignOffset: 0,
      alignFlip: !0,
      arrowPadding: 0,
      avoidCollisions: !0,
      collisionBoundary: () => [],
      collisionPadding: 0,
      sticky: "partial",
      hideWhenDetached: !1,
      positionStrategy: "fixed",
      updatePositionStrategy: "optimized",
      prioritizePosition: !1,
    },
    [qg, Gg] = Bs("PopperContent");
  var Yg = Z({
      inheritAttrs: !1,
      __name: "PopperContent",
      props: ih(
        {
          side: { type: null, required: !1 },
          sideOffset: { type: Number, required: !1 },
          sideFlip: { type: Boolean, required: !1 },
          align: { type: null, required: !1 },
          alignOffset: { type: Number, required: !1 },
          alignFlip: { type: Boolean, required: !1 },
          avoidCollisions: { type: Boolean, required: !1 },
          collisionBoundary: { type: null, required: !1 },
          collisionPadding: { type: [Number, Object], required: !1 },
          arrowPadding: { type: Number, required: !1 },
          sticky: { type: String, required: !1 },
          hideWhenDetached: { type: Boolean, required: !1 },
          positionStrategy: { type: String, required: !1 },
          updatePositionStrategy: { type: String, required: !1 },
          disableUpdateOnLayoutShift: { type: Boolean, required: !1 },
          prioritizePosition: { type: Boolean, required: !1 },
          reference: { type: null, required: !1 },
          asChild: { type: Boolean, required: !1 },
          as: { type: null, required: !1 },
        },
        { ...Kg },
      ),
      emits: ["placed"],
      setup(e, { emit: t }) {
        const n = e,
          r = t,
          s = iu(),
          { forwardRef: i, currentElement: o } = ct(),
          l = Q(),
          a = Q(),
          { width: u, height: c } = my(a),
          f = V(() => n.side + (n.align !== "center" ? `-${n.align}` : "")),
          d = V(() =>
            typeof n.collisionPadding == "number"
              ? n.collisionPadding
              : { top: 0, right: 0, bottom: 0, left: 0, ...n.collisionPadding },
          ),
          h = V(() =>
            Array.isArray(n.collisionBoundary)
              ? n.collisionBoundary
              : [n.collisionBoundary],
          ),
          p = V(() => ({
            padding: d.value,
            boundary: h.value.filter(Hy),
            altBoundary: h.value.length > 0,
          })),
          y = V(() => ({ mainAxis: n.sideFlip, crossAxis: n.alignFlip })),
          v = Y1(() => [
            Lg({
              mainAxis: n.sideOffset + c.value,
              alignmentAxis: n.alignOffset,
            }),
            n.prioritizePosition &&
              n.avoidCollisions &&
              Eu({ ...p.value, ...y.value }),
            n.avoidCollisions &&
              Ig({
                mainAxis: !0,
                crossAxis: !!n.prioritizePosition,
                limiter: n.sticky === "partial" ? Vg() : void 0,
                ...p.value,
              }),
            !n.prioritizePosition &&
              n.avoidCollisions &&
              Eu({ ...p.value, ...y.value }),
            Ng({
              ...p.value,
              apply: ({
                elements: P,
                rects: re,
                availableWidth: I,
                availableHeight: oe,
              }) => {
                const { width: te, height: X } = re.reference,
                  K = P.floating.style;
                (K.setProperty("--reka-popper-available-width", `${I}px`),
                  K.setProperty("--reka-popper-available-height", `${oe}px`),
                  K.setProperty("--reka-popper-anchor-width", `${te}px`),
                  K.setProperty("--reka-popper-anchor-height", `${X}px`));
              },
            }),
            a.value && Wg({ element: a.value, padding: n.arrowPadding }),
            zy({ arrowWidth: u.value, arrowHeight: c.value }),
            n.hideWhenDetached &&
              Bg({ strategy: "referenceHidden", ...p.value }),
          ]),
          g = V(() => n.reference ?? s.anchor.value),
          {
            floatingStyles: m,
            placement: b,
            isPositioned: w,
            middlewareData: S,
          } = Ug(g, l, {
            strategy: n.positionStrategy,
            placement: f,
            whileElementsMounted: (...P) =>
              $g(...P, {
                layoutShift: !n.disableUpdateOnLayoutShift,
                animationFrame: n.updatePositionStrategy === "always",
              }),
            middleware: v,
          }),
          E = V(() => To(b.value)[0]),
          T = V(() => To(b.value)[1]);
        na(() => {
          w.value && r("placed");
        });
        const D = V(() => S.value.arrow?.centerOffset !== 0),
          R = Q("");
        We(() => {
          o.value && (R.value = window.getComputedStyle(o.value).zIndex);
        });
        const H = V(() => S.value.arrow?.x ?? 0),
          U = V(() => S.value.arrow?.y ?? 0);
        return (
          Gg({
            placedSide: E,
            onArrowChange: (P) => (a.value = P),
            arrowX: H,
            arrowY: U,
            shouldHideArrow: D,
          }),
          (P, re) => (
            M(),
            ee(
              "div",
              {
                ref_key: "floatingRef",
                ref: l,
                "data-reka-popper-content-wrapper": "",
                style: St({
                  ...F(m),
                  transform: F(w) ? F(m).transform : "translate(0, -200%)",
                  minWidth: "max-content",
                  zIndex: R.value,
                  "--reka-popper-transform-origin": [
                    F(S).transformOrigin?.x,
                    F(S).transformOrigin?.y,
                  ].join(" "),
                  ...(F(S).hide?.referenceHidden && {
                    visibility: "hidden",
                    pointerEvents: "none",
                  }),
                }),
              },
              [
                le(
                  F(Yn),
                  Ke({ ref: F(i) }, P.$attrs, {
                    "as-child": n.asChild,
                    as: P.as,
                    "data-side": E.value,
                    "data-align": T.value,
                    style: { animation: F(w) ? void 0 : "none" },
                  }),
                  { default: se(() => [he(P.$slots, "default")]), _: 3 },
                  16,
                  ["as-child", "as", "data-side", "data-align", "style"],
                ),
              ],
              4,
            )
          )
        );
      },
    }),
    Jg = Yg;
  const Xg = { top: "bottom", right: "left", bottom: "top", left: "right" };
  var Qg = Z({
      inheritAttrs: !1,
      __name: "PopperArrow",
      props: {
        width: { type: Number, required: !1 },
        height: { type: Number, required: !1 },
        rounded: { type: Boolean, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1, default: "svg" },
      },
      setup(e) {
        const { forwardRef: t } = ct(),
          n = qg(),
          r = V(() => Xg[n.placedSide.value]);
        return (s, i) => (
          M(),
          ee(
            "span",
            {
              ref: (o) => {
                F(n).onArrowChange(o);
              },
              style: St({
                position: "absolute",
                left: F(n).arrowX?.value ? `${F(n).arrowX?.value}px` : void 0,
                top: F(n).arrowY?.value ? `${F(n).arrowY?.value}px` : void 0,
                [r.value]: 0,
                transformOrigin: {
                  top: "",
                  right: "0 0",
                  bottom: "center 0",
                  left: "100% 0",
                }[F(n).placedSide.value],
                transform: {
                  top: "translateY(100%)",
                  right: "translateY(50%) rotate(90deg) translateX(-50%)",
                  bottom: "rotate(180deg)",
                  left: "translateY(50%) rotate(-90deg) translateX(50%)",
                }[F(n).placedSide.value],
                visibility: F(n).shouldHideArrow.value ? "hidden" : void 0,
              }),
            },
            [
              le(
                Vy,
                Ke(s.$attrs, {
                  ref: F(t),
                  style: { display: "block" },
                  as: s.as,
                  "as-child": s.asChild,
                  rounded: s.rounded,
                  width: s.width,
                  height: s.height,
                }),
                { default: se(() => [he(s.$slots, "default")]), _: 3 },
                16,
                ["as", "as-child", "rounded", "width", "height"],
              ),
            ],
            4,
          )
        );
      },
    }),
    Zg = Qg,
    em = Z({
      __name: "TooltipArrow",
      props: {
        width: { type: Number, required: !1, default: 10 },
        height: { type: Number, required: !1, default: 5 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1, default: "svg" },
      },
      setup(e) {
        const t = e;
        return (
          ct(),
          (n, r) => (
            M(),
            Y(
              F(Zg),
              bl(Ji(t)),
              { default: se(() => [he(n.$slots, "default")]), _: 3 },
              16,
            )
          )
        );
      },
    }),
    tm = em;
  const [Bo, nm] = Bs("TooltipProvider");
  var rm = Z({
      inheritAttrs: !1,
      __name: "TooltipProvider",
      props: {
        delayDuration: { type: Number, required: !1, default: 700 },
        skipDelayDuration: { type: Number, required: !1, default: 300 },
        disableHoverableContent: { type: Boolean, required: !1, default: !1 },
        disableClosingTrigger: { type: Boolean, required: !1 },
        disabled: { type: Boolean, required: !1 },
        ignoreNonKeyboardFocus: { type: Boolean, required: !1, default: !1 },
      },
      setup(e) {
        const t = e,
          {
            delayDuration: n,
            skipDelayDuration: r,
            disableHoverableContent: s,
            disableClosingTrigger: i,
            ignoreNonKeyboardFocus: o,
            disabled: l,
          } = Ul(t);
        ct();
        const a = Q(!0),
          u = Q(!1),
          { start: c, stop: f } = nu(
            () => {
              a.value = !0;
            },
            r,
            { immediate: !1 },
          );
        return (
          nm({
            isOpenDelayed: a,
            delayDuration: n,
            onOpen() {
              (f(), (a.value = !1));
            },
            onClose() {
              c();
            },
            isPointerInTransitRef: u,
            disableHoverableContent: s,
            disableClosingTrigger: i,
            disabled: l,
            ignoreNonKeyboardFocus: o,
          }),
          (d, h) => he(d.$slots, "default")
        );
      },
    }),
    sm = rm;
  const Ou = "tooltip.open",
    [Js, im] = Bs("TooltipRoot");
  var om = Z({
      __name: "TooltipRoot",
      props: {
        defaultOpen: { type: Boolean, required: !1, default: !1 },
        open: { type: Boolean, required: !1, default: void 0 },
        delayDuration: { type: Number, required: !1, default: void 0 },
        disableHoverableContent: {
          type: Boolean,
          required: !1,
          default: void 0,
        },
        disableClosingTrigger: { type: Boolean, required: !1, default: void 0 },
        disabled: { type: Boolean, required: !1, default: void 0 },
        ignoreNonKeyboardFocus: {
          type: Boolean,
          required: !1,
          default: void 0,
        },
      },
      emits: ["update:open"],
      setup(e, { emit: t }) {
        const n = e,
          r = t;
        ct();
        const s = Bo(),
          i = V(
            () => n.disableHoverableContent ?? s.disableHoverableContent.value,
          ),
          o = V(() => n.disableClosingTrigger ?? s.disableClosingTrigger.value),
          l = V(() => n.disabled ?? s.disabled.value),
          a = V(() => n.delayDuration ?? s.delayDuration.value),
          u = V(
            () => n.ignoreNonKeyboardFocus ?? s.ignoreNonKeyboardFocus.value,
          ),
          c = oy(n, "open", r, {
            defaultValue: n.defaultOpen,
            passive: n.open === void 0,
          });
        Ee(c, (b) => {
          s.onClose &&
            (b
              ? (s.onOpen(), document.dispatchEvent(new CustomEvent(Ou)))
              : s.onClose());
        });
        const f = Q(!1),
          d = Q(),
          h = V(() =>
            c.value ? (f.value ? "delayed-open" : "instant-open") : "closed",
          ),
          { start: p, stop: y } = nu(
            () => {
              ((f.value = !0), (c.value = !0));
            },
            a,
            { immediate: !1 },
          );
        function v() {
          (y(), (f.value = !1), (c.value = !0));
        }
        function g() {
          (y(), (c.value = !1));
        }
        function m() {
          p();
        }
        return (
          im({
            contentId: "",
            open: c,
            stateAttribute: h,
            trigger: d,
            onTriggerChange(b) {
              d.value = b;
            },
            onTriggerEnter() {
              s.isOpenDelayed.value ? m() : v();
            },
            onTriggerLeave() {
              i.value ? g() : y();
            },
            onOpen: v,
            onClose: g,
            disableHoverableContent: i,
            disableClosingTrigger: o,
            disabled: l,
            ignoreNonKeyboardFocus: u,
          }),
          (b, w) => (
            M(),
            Y(F($y), null, {
              default: se(() => [he(b.$slots, "default", { open: F(c) })]),
              _: 3,
            })
          )
        );
      },
    }),
    lm = om,
    am = Z({
      __name: "TooltipContentImpl",
      props: {
        ariaLabel: { type: String, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1 },
        side: { type: null, required: !1, default: "top" },
        sideOffset: { type: Number, required: !1, default: 0 },
        align: { type: null, required: !1, default: "center" },
        alignOffset: { type: Number, required: !1 },
        avoidCollisions: { type: Boolean, required: !1, default: !0 },
        collisionBoundary: { type: null, required: !1, default: () => [] },
        collisionPadding: { type: [Number, Object], required: !1, default: 0 },
        arrowPadding: { type: Number, required: !1, default: 0 },
        sticky: { type: String, required: !1, default: "partial" },
        hideWhenDetached: { type: Boolean, required: !1, default: !1 },
        positionStrategy: { type: String, required: !1 },
        updatePositionStrategy: { type: String, required: !1 },
      },
      emits: ["escapeKeyDown", "pointerDownOutside"],
      setup(e, { emit: t }) {
        const n = e,
          r = t,
          s = Js(),
          { forwardRef: i, currentElement: o } = ct(),
          l = V(() => n.ariaLabel || o.value?.textContent),
          a = V(() => {
            const { ariaLabel: u, ...c } = n;
            return c;
          });
        return (
          At(() => {
            (Co(window, "scroll", (u) => {
              u.target?.contains(s.trigger.value) && s.onClose();
            }),
              Co(window, Ou, s.onClose));
          }),
          (u, c) => (
            M(),
            Y(
              F(jy),
              {
                "as-child": "",
                "disable-outside-pointer-events": !1,
                onEscapeKeyDown: c[0] || (c[0] = (f) => r("escapeKeyDown", f)),
                onPointerDownOutside:
                  c[1] ||
                  (c[1] = (f) => {
                    (F(s).disableClosingTrigger.value &&
                      F(s).trigger.value?.contains(f.target) &&
                      f.preventDefault(),
                      r("pointerDownOutside", f));
                  }),
                onFocusOutside: c[2] || (c[2] = kc(() => {}, ["prevent"])),
                onDismiss: c[3] || (c[3] = (f) => F(s).onClose()),
              },
              {
                default: se(() => [
                  le(
                    F(Jg),
                    Ke(
                      { ref: F(i), "data-state": F(s).stateAttribute.value },
                      { ...u.$attrs, ...a.value },
                      {
                        style: {
                          "--reka-tooltip-content-transform-origin":
                            "var(--reka-popper-transform-origin)",
                          "--reka-tooltip-content-available-width":
                            "var(--reka-popper-available-width)",
                          "--reka-tooltip-content-available-height":
                            "var(--reka-popper-available-height)",
                          "--reka-tooltip-trigger-width":
                            "var(--reka-popper-anchor-width)",
                          "--reka-tooltip-trigger-height":
                            "var(--reka-popper-anchor-height)",
                        },
                      },
                    ),
                    {
                      default: se(() => [
                        he(u.$slots, "default"),
                        le(
                          F(Py),
                          { id: F(s).contentId, role: "tooltip" },
                          { default: se(() => [Ue(_e(l.value), 1)]), _: 1 },
                          8,
                          ["id"],
                        ),
                      ]),
                      _: 3,
                    },
                    16,
                    ["data-state"],
                  ),
                ]),
                _: 3,
              },
            )
          )
        );
      },
    }),
    ju = am,
    cm = Z({
      __name: "TooltipContentHoverable",
      props: {
        ariaLabel: { type: String, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1 },
        side: { type: null, required: !1 },
        sideOffset: { type: Number, required: !1 },
        align: { type: null, required: !1 },
        alignOffset: { type: Number, required: !1 },
        avoidCollisions: { type: Boolean, required: !1 },
        collisionBoundary: { type: null, required: !1 },
        collisionPadding: { type: [Number, Object], required: !1 },
        arrowPadding: { type: Number, required: !1 },
        sticky: { type: String, required: !1 },
        hideWhenDetached: { type: Boolean, required: !1 },
        positionStrategy: { type: String, required: !1 },
        updatePositionStrategy: { type: String, required: !1 },
      },
      setup(e) {
        const n = ru(e),
          { forwardRef: r, currentElement: s } = ct(),
          { trigger: i, onClose: o } = Js(),
          l = Bo(),
          { isPointerInTransit: a, onPointerExit: u } = cy(i, s);
        return (
          (l.isPointerInTransitRef = a),
          u(() => {
            o();
          }),
          (c, f) => (
            M(),
            Y(
              ju,
              Ke({ ref: F(r) }, F(n)),
              { default: se(() => [he(c.$slots, "default")]), _: 3 },
              16,
            )
          )
        );
      },
    }),
    um = cm,
    fm = Z({
      __name: "TooltipContent",
      props: {
        forceMount: { type: Boolean, required: !1 },
        ariaLabel: { type: String, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1 },
        side: { type: null, required: !1, default: "top" },
        sideOffset: { type: Number, required: !1 },
        align: { type: null, required: !1 },
        alignOffset: { type: Number, required: !1 },
        avoidCollisions: { type: Boolean, required: !1 },
        collisionBoundary: { type: null, required: !1 },
        collisionPadding: { type: [Number, Object], required: !1 },
        arrowPadding: { type: Number, required: !1 },
        sticky: { type: String, required: !1 },
        hideWhenDetached: { type: Boolean, required: !1 },
        positionStrategy: { type: String, required: !1 },
        updatePositionStrategy: { type: String, required: !1 },
      },
      emits: ["escapeKeyDown", "pointerDownOutside"],
      setup(e, { emit: t }) {
        const n = e,
          r = t,
          s = Js(),
          i = ay(n, r),
          { forwardRef: o } = ct();
        return (l, a) => (
          M(),
          Y(
            F(xy),
            { present: l.forceMount || F(s).open.value },
            {
              default: se(() => [
                (M(),
                Y(
                  En(F(s).disableHoverableContent.value ? ju : um),
                  Ke({ ref: F(o) }, F(i)),
                  { default: se(() => [he(l.$slots, "default")]), _: 3 },
                  16,
                )),
              ]),
              _: 3,
            },
            8,
            ["present"],
          )
        );
      },
    }),
    dm = fm,
    hm = Z({
      __name: "TooltipPortal",
      props: {
        to: { type: null, required: !1 },
        disabled: { type: Boolean, required: !1 },
        defer: { type: Boolean, required: !1 },
        forceMount: { type: Boolean, required: !1 },
      },
      setup(e) {
        const t = e;
        return (n, r) => (
          M(),
          Y(
            F(ky),
            bl(Ji(t)),
            { default: se(() => [he(n.$slots, "default")]), _: 3 },
            16,
          )
        );
      },
    }),
    pm = hm,
    ym = Z({
      __name: "TooltipTrigger",
      props: {
        reference: { type: null, required: !1 },
        asChild: { type: Boolean, required: !1 },
        as: { type: null, required: !1, default: "button" },
      },
      setup(e) {
        const t = e,
          n = Js(),
          r = Bo();
        n.contentId || (n.contentId = gy(void 0, "reka-tooltip-content"));
        const { forwardRef: s, currentElement: i } = ct(),
          o = Q(!1),
          l = Q(!1),
          a = V(() =>
            n.disabled.value
              ? {}
              : {
                  click: y,
                  focus: h,
                  pointermove: f,
                  pointerleave: d,
                  pointerdown: c,
                  blur: p,
                },
          );
        At(() => {
          n.onTriggerChange(i.value);
        });
        function u() {
          setTimeout(() => {
            o.value = !1;
          }, 1);
        }
        function c() {
          (n.open && !n.disableClosingTrigger.value && n.onClose(),
            (o.value = !0),
            document.addEventListener("pointerup", u, { once: !0 }));
        }
        function f(v) {
          v.pointerType !== "touch" &&
            !l.value &&
            !r.isPointerInTransitRef.value &&
            (n.onTriggerEnter(), (l.value = !0));
        }
        function d() {
          (n.onTriggerLeave(), (l.value = !1));
        }
        function h(v) {
          o.value ||
            (n.ignoreNonKeyboardFocus.value &&
              !v.target.matches?.(":focus-visible")) ||
            n.onOpen();
        }
        function p() {
          n.onClose();
        }
        function y() {
          n.disableClosingTrigger.value || n.onClose();
        }
        return (v, g) => (
          M(),
          Y(
            F(Iy),
            { "as-child": "", reference: v.reference },
            {
              default: se(() => [
                le(
                  F(Yn),
                  Ke(
                    {
                      ref: F(s),
                      "aria-describedby": F(n).open.value
                        ? F(n).contentId
                        : void 0,
                      "data-state": F(n).stateAttribute.value,
                      as: v.as,
                      "as-child": t.asChild,
                      "data-grace-area-trigger": "",
                    },
                    Ta(a.value),
                  ),
                  { default: se(() => [he(v.$slots, "default")]), _: 3 },
                  16,
                  ["aria-describedby", "data-state", "as", "as-child"],
                ),
              ]),
              _: 3,
            },
            8,
            ["reference"],
          )
        );
      },
    }),
    gm = ym,
    Xs = { exports: {} },
    mm = Xs.exports,
    Au;
  function vm() {
    return (
      Au ||
        ((Au = 1),
        (function (e, t) {
          (function (r, s) {
            e.exports = s();
          })(typeof self < "u" ? self : mm, function () {
            return (function (n) {
              var r = {};
              function s(i) {
                if (r[i]) return r[i].exports;
                var o = (r[i] = { i, l: !1, exports: {} });
                return (
                  n[i].call(o.exports, o, o.exports, s),
                  (o.l = !0),
                  o.exports
                );
              }
              return (
                (s.m = n),
                (s.c = r),
                (s.d = function (i, o, l) {
                  s.o(i, o) ||
                    Object.defineProperty(i, o, {
                      configurable: !1,
                      enumerable: !0,
                      get: l,
                    });
                }),
                (s.r = function (i) {
                  Object.defineProperty(i, "__esModule", { value: !0 });
                }),
                (s.n = function (i) {
                  var o =
                    i && i.__esModule
                      ? function () {
                          return i.default;
                        }
                      : function () {
                          return i;
                        };
                  return (s.d(o, "a", o), o);
                }),
                (s.o = function (i, o) {
                  return Object.prototype.hasOwnProperty.call(i, o);
                }),
                (s.p = ""),
                s((s.s = 0))
              );
            })({
              "./dist/icons.json": function (n) {
                n.exports = {
                  activity:
                    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
                  airplay:
                    '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>',
                  "alert-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
                  "alert-octagon":
                    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
                  "alert-triangle":
                    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
                  "align-center":
                    '<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>',
                  "align-justify":
                    '<line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>',
                  "align-left":
                    '<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>',
                  "align-right":
                    '<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>',
                  anchor:
                    '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>',
                  aperture:
                    '<circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>',
                  archive:
                    '<polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>',
                  "arrow-down-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line>',
                  "arrow-down-left":
                    '<line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline>',
                  "arrow-down-right":
                    '<line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline>',
                  "arrow-down":
                    '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>',
                  "arrow-left-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>',
                  "arrow-left":
                    '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
                  "arrow-right-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>',
                  "arrow-right":
                    '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
                  "arrow-up-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line>',
                  "arrow-up-left":
                    '<line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>',
                  "arrow-up-right":
                    '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>',
                  "arrow-up":
                    '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>',
                  "at-sign":
                    '<circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>',
                  award:
                    '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',
                  "bar-chart-2":
                    '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
                  "bar-chart":
                    '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>',
                  "battery-charging":
                    '<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>',
                  battery:
                    '<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>',
                  "bell-off":
                    '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
                  bluetooth:
                    '<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>',
                  bold: '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>',
                  "book-open":
                    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
                  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
                  bookmark:
                    '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>',
                  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                  briefcase:
                    '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
                  calendar:
                    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
                  "camera-off":
                    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>',
                  camera:
                    '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
                  cast: '<path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line>',
                  "check-circle":
                    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
                  "check-square":
                    '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
                  check: '<polyline points="20 6 9 17 4 12"></polyline>',
                  "chevron-down":
                    '<polyline points="6 9 12 15 18 9"></polyline>',
                  "chevron-left":
                    '<polyline points="15 18 9 12 15 6"></polyline>',
                  "chevron-right":
                    '<polyline points="9 18 15 12 9 6"></polyline>',
                  "chevron-up":
                    '<polyline points="18 15 12 9 6 15"></polyline>',
                  "chevrons-down":
                    '<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>',
                  "chevrons-left":
                    '<polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>',
                  "chevrons-right":
                    '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>',
                  "chevrons-up":
                    '<polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline>',
                  chrome:
                    '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>',
                  circle: '<circle cx="12" cy="12" r="10"></circle>',
                  clipboard:
                    '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>',
                  clock:
                    '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
                  "cloud-drizzle":
                    '<line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
                  "cloud-lightning":
                    '<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>',
                  "cloud-off":
                    '<path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                  "cloud-rain":
                    '<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
                  "cloud-snow":
                    '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line>',
                  cloud:
                    '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>',
                  code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
                  codepen:
                    '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line>',
                  codesandbox:
                    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                  coffee:
                    '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>',
                  columns:
                    '<path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>',
                  command:
                    '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>',
                  compass:
                    '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>',
                  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
                  "corner-down-left":
                    '<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>',
                  "corner-down-right":
                    '<polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>',
                  "corner-left-down":
                    '<polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path>',
                  "corner-left-up":
                    '<polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>',
                  "corner-right-down":
                    '<polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path>',
                  "corner-right-up":
                    '<polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path>',
                  "corner-up-left":
                    '<polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>',
                  "corner-up-right":
                    '<polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>',
                  cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>',
                  "credit-card":
                    '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
                  crop: '<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>',
                  crosshair:
                    '<circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line>',
                  database:
                    '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
                  delete:
                    '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>',
                  disc: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>',
                  "divide-circle":
                    '<line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle>',
                  "divide-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line>',
                  divide:
                    '<circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle>',
                  "dollar-sign":
                    '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
                  "download-cloud":
                    '<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>',
                  download:
                    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
                  dribbble:
                    '<circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>',
                  droplet:
                    '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>',
                  "edit-2":
                    '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
                  "edit-3":
                    '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>',
                  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',
                  "external-link":
                    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
                  "eye-off":
                    '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>',
                  facebook:
                    '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
                  "fast-forward":
                    '<polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon>',
                  feather:
                    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line>',
                  figma:
                    '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>',
                  "file-minus":
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>',
                  "file-plus":
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>',
                  "file-text":
                    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
                  file: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>',
                  film: '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>',
                  filter:
                    '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>',
                  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',
                  "folder-minus":
                    '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>',
                  "folder-plus":
                    '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>',
                  folder:
                    '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
                  framer:
                    '<path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path>',
                  frown:
                    '<circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
                  gift: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',
                  "git-branch":
                    '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
                  "git-commit":
                    '<circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>',
                  "git-merge":
                    '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>',
                  "git-pull-request":
                    '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line>',
                  github:
                    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
                  gitlab:
                    '<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>',
                  globe:
                    '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
                  grid: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
                  "hard-drive":
                    '<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line>',
                  hash: '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>',
                  headphones:
                    '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',
                  heart:
                    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
                  "help-circle":
                    '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
                  hexagon:
                    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>',
                  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
                  image:
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>',
                  inbox:
                    '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>',
                  info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
                  instagram:
                    '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>',
                  italic:
                    '<line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line>',
                  key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>',
                  layers:
                    '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
                  layout:
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>',
                  "life-buoy":
                    '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>',
                  "link-2":
                    '<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line>',
                  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
                  linkedin:
                    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
                  list: '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>',
                  loader:
                    '<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>',
                  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
                  "log-in":
                    '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>',
                  "log-out":
                    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
                  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
                  "map-pin":
                    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
                  map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>',
                  "maximize-2":
                    '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
                  maximize:
                    '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>',
                  meh: '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
                  menu: '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
                  "message-circle":
                    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
                  "message-square":
                    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
                  "mic-off":
                    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
                  mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>',
                  "minimize-2":
                    '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>',
                  minimize:
                    '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>',
                  "minus-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>',
                  "minus-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line>',
                  minus: '<line x1="5" y1="12" x2="19" y2="12"></line>',
                  monitor:
                    '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>',
                  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
                  "more-horizontal":
                    '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
                  "more-vertical":
                    '<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>',
                  "mouse-pointer":
                    '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path>',
                  move: '<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>',
                  music:
                    '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
                  "navigation-2":
                    '<polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>',
                  navigation:
                    '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>',
                  octagon:
                    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>',
                  package:
                    '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                  paperclip:
                    '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>',
                  "pause-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line>',
                  pause:
                    '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',
                  "pen-tool":
                    '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>',
                  percent:
                    '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>',
                  "phone-call":
                    '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                  "phone-forwarded":
                    '<polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                  "phone-incoming":
                    '<polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                  "phone-missed":
                    '<line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                  "phone-off":
                    '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line>',
                  "phone-outgoing":
                    '<polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                  phone:
                    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                  "pie-chart":
                    '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>',
                  "play-circle":
                    '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>',
                  play: '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
                  "plus-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',
                  "plus-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>',
                  plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
                  pocket:
                    '<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>',
                  power:
                    '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>',
                  printer:
                    '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>',
                  radio:
                    '<circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>',
                  "refresh-ccw":
                    '<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>',
                  "refresh-cw":
                    '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',
                  repeat:
                    '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>',
                  rewind:
                    '<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>',
                  "rotate-ccw":
                    '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>',
                  "rotate-cw":
                    '<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>',
                  rss: '<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>',
                  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>',
                  scissors:
                    '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line>',
                  search:
                    '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',
                  send: '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
                  server:
                    '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
                  settings:
                    '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
                  "share-2":
                    '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>',
                  share:
                    '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>',
                  "shield-off":
                    '<path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                  shield:
                    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
                  "shopping-bag":
                    '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
                  "shopping-cart":
                    '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
                  shuffle:
                    '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>',
                  sidebar:
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>',
                  "skip-back":
                    '<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line>',
                  "skip-forward":
                    '<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>',
                  slack:
                    '<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>',
                  slash:
                    '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>',
                  sliders:
                    '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
                  smartphone:
                    '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
                  smile:
                    '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>',
                  speaker:
                    '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line>',
                  square:
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
                  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
                  "stop-circle":
                    '<circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>',
                  sun: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
                  sunrise:
                    '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline>',
                  sunset:
                    '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline>',
                  table:
                    '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>',
                  tablet:
                    '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>',
                  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
                  target:
                    '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
                  terminal:
                    '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',
                  thermometer:
                    '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>',
                  "thumbs-down":
                    '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>',
                  "thumbs-up":
                    '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>',
                  "toggle-left":
                    '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle>',
                  "toggle-right":
                    '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle>',
                  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
                  "trash-2":
                    '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
                  trash:
                    '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
                  trello:
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect>',
                  "trending-down":
                    '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>',
                  "trending-up":
                    '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
                  triangle:
                    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>',
                  truck:
                    '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
                  tv: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>',
                  twitch:
                    '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>',
                  twitter:
                    '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>',
                  type: '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>',
                  umbrella:
                    '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>',
                  underline:
                    '<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>',
                  unlock:
                    '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>',
                  "upload-cloud":
                    '<polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline>',
                  upload:
                    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>',
                  "user-check":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
                  "user-minus":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line>',
                  "user-plus":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
                  "user-x":
                    '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>',
                  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
                  users:
                    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
                  "video-off":
                    '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>',
                  video:
                    '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>',
                  voicemail:
                    '<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line>',
                  "volume-1":
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
                  "volume-2":
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
                  "volume-x":
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>',
                  volume:
                    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
                  watch:
                    '<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>',
                  "wifi-off":
                    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
                  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
                  wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>',
                  "x-circle":
                    '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
                  "x-octagon":
                    '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
                  "x-square":
                    '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>',
                  x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
                  youtube:
                    '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>',
                  "zap-off":
                    '<polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line>',
                  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
                  "zoom-in":
                    '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>',
                  "zoom-out":
                    '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>',
                };
              },
              "./node_modules/classnames/dedupe.js": function (n, r, s) {
                var i, o;
                (function () {
                  var l = (function () {
                    function a() {}
                    a.prototype = Object.create(null);
                    function u(g, m) {
                      for (var b = m.length, w = 0; w < b; ++w) y(g, m[w]);
                    }
                    var c = {}.hasOwnProperty;
                    function f(g, m) {
                      g[m] = !0;
                    }
                    function d(g, m) {
                      for (var b in m) c.call(m, b) && (g[b] = !!m[b]);
                    }
                    var h = /\s+/;
                    function p(g, m) {
                      for (var b = m.split(h), w = b.length, S = 0; S < w; ++S)
                        g[b[S]] = !0;
                    }
                    function y(g, m) {
                      if (m) {
                        var b = typeof m;
                        b === "string"
                          ? p(g, m)
                          : Array.isArray(m)
                            ? u(g, m)
                            : b === "object"
                              ? d(g, m)
                              : b === "number" && f(g, m);
                      }
                    }
                    function v() {
                      for (
                        var g = arguments.length, m = Array(g), b = 0;
                        b < g;
                        b++
                      )
                        m[b] = arguments[b];
                      var w = new a();
                      u(w, m);
                      var S = [];
                      for (var E in w) w[E] && S.push(E);
                      return S.join(" ");
                    }
                    return v;
                  })();
                  typeof n < "u" && n.exports
                    ? (n.exports = l)
                    : ((i = []),
                      (o = function () {
                        return l;
                      }.apply(r, i)),
                      o !== void 0 && (n.exports = o));
                })();
              },
              "./node_modules/core-js/es/array/from.js": function (n, r, s) {
                (s("./node_modules/core-js/modules/es.string.iterator.js"),
                  s("./node_modules/core-js/modules/es.array.from.js"));
                var i = s("./node_modules/core-js/internals/path.js");
                n.exports = i.Array.from;
              },
              "./node_modules/core-js/internals/a-function.js": function (
                n,
                r,
              ) {
                n.exports = function (s) {
                  if (typeof s != "function")
                    throw TypeError(String(s) + " is not a function");
                  return s;
                };
              },
              "./node_modules/core-js/internals/an-object.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/is-object.js");
                n.exports = function (o) {
                  if (!i(o)) throw TypeError(String(o) + " is not an object");
                  return o;
                };
              },
              "./node_modules/core-js/internals/array-from.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/bind-context.js"),
                  o = s("./node_modules/core-js/internals/to-object.js"),
                  l = s(
                    "./node_modules/core-js/internals/call-with-safe-iteration-closing.js",
                  ),
                  a = s(
                    "./node_modules/core-js/internals/is-array-iterator-method.js",
                  ),
                  u = s("./node_modules/core-js/internals/to-length.js"),
                  c = s("./node_modules/core-js/internals/create-property.js"),
                  f = s(
                    "./node_modules/core-js/internals/get-iterator-method.js",
                  );
                n.exports = function (h) {
                  var p = o(h),
                    y = typeof this == "function" ? this : Array,
                    v = arguments.length,
                    g = v > 1 ? arguments[1] : void 0,
                    m = g !== void 0,
                    b = 0,
                    w = f(p),
                    S,
                    E,
                    T,
                    D;
                  if (
                    (m && (g = i(g, v > 2 ? arguments[2] : void 0, 2)),
                    w != null && !(y == Array && a(w)))
                  )
                    for (D = w.call(p), E = new y(); !(T = D.next()).done; b++)
                      c(E, b, m ? l(D, g, [T.value, b], !0) : T.value);
                  else
                    for (S = u(p.length), E = new y(S); S > b; b++)
                      c(E, b, m ? g(p[b], b) : p[b]);
                  return ((E.length = b), E);
                };
              },
              "./node_modules/core-js/internals/array-includes.js": function (
                n,
                r,
                s,
              ) {
                var i = s(
                    "./node_modules/core-js/internals/to-indexed-object.js",
                  ),
                  o = s("./node_modules/core-js/internals/to-length.js"),
                  l = s(
                    "./node_modules/core-js/internals/to-absolute-index.js",
                  );
                n.exports = function (a) {
                  return function (u, c, f) {
                    var d = i(u),
                      h = o(d.length),
                      p = l(f, h),
                      y;
                    if (a && c != c) {
                      for (; h > p; ) if (((y = d[p++]), y != y)) return !0;
                    } else
                      for (; h > p; p++)
                        if ((a || p in d) && d[p] === c) return a || p || 0;
                    return !a && -1;
                  };
                };
              },
              "./node_modules/core-js/internals/bind-context.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/a-function.js");
                n.exports = function (o, l, a) {
                  if ((i(o), l === void 0)) return o;
                  switch (a) {
                    case 0:
                      return function () {
                        return o.call(l);
                      };
                    case 1:
                      return function (u) {
                        return o.call(l, u);
                      };
                    case 2:
                      return function (u, c) {
                        return o.call(l, u, c);
                      };
                    case 3:
                      return function (u, c, f) {
                        return o.call(l, u, c, f);
                      };
                  }
                  return function () {
                    return o.apply(l, arguments);
                  };
                };
              },
              "./node_modules/core-js/internals/call-with-safe-iteration-closing.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/an-object.js");
                  n.exports = function (o, l, a, u) {
                    try {
                      return u ? l(i(a)[0], a[1]) : l(a);
                    } catch (f) {
                      var c = o.return;
                      throw (c !== void 0 && i(c.call(o)), f);
                    }
                  };
                },
              "./node_modules/core-js/internals/check-correctness-of-iteration.js":
                function (n, r, s) {
                  var i = s(
                      "./node_modules/core-js/internals/well-known-symbol.js",
                    ),
                    o = i("iterator"),
                    l = !1;
                  try {
                    var a = 0,
                      u = {
                        next: function () {
                          return { done: !!a++ };
                        },
                        return: function () {
                          l = !0;
                        },
                      };
                    ((u[o] = function () {
                      return this;
                    }),
                      Array.from(u, function () {
                        throw 2;
                      }));
                  } catch {}
                  n.exports = function (c, f) {
                    if (!f && !l) return !1;
                    var d = !1;
                    try {
                      var h = {};
                      ((h[o] = function () {
                        return {
                          next: function () {
                            return { done: (d = !0) };
                          },
                        };
                      }),
                        c(h));
                    } catch {}
                    return d;
                  };
                },
              "./node_modules/core-js/internals/classof-raw.js": function (
                n,
                r,
              ) {
                var s = {}.toString;
                n.exports = function (i) {
                  return s.call(i).slice(8, -1);
                };
              },
              "./node_modules/core-js/internals/classof.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/classof-raw.js"),
                  o = s(
                    "./node_modules/core-js/internals/well-known-symbol.js",
                  ),
                  l = o("toStringTag"),
                  a =
                    i(
                      (function () {
                        return arguments;
                      })(),
                    ) == "Arguments",
                  u = function (c, f) {
                    try {
                      return c[f];
                    } catch {}
                  };
                n.exports = function (c) {
                  var f, d, h;
                  return c === void 0
                    ? "Undefined"
                    : c === null
                      ? "Null"
                      : typeof (d = u((f = Object(c)), l)) == "string"
                        ? d
                        : a
                          ? i(f)
                          : (h = i(f)) == "Object" &&
                              typeof f.callee == "function"
                            ? "Arguments"
                            : h;
                };
              },
              "./node_modules/core-js/internals/copy-constructor-properties.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/has.js"),
                    o = s("./node_modules/core-js/internals/own-keys.js"),
                    l = s(
                      "./node_modules/core-js/internals/object-get-own-property-descriptor.js",
                    ),
                    a = s(
                      "./node_modules/core-js/internals/object-define-property.js",
                    );
                  n.exports = function (u, c) {
                    for (
                      var f = o(c), d = a.f, h = l.f, p = 0;
                      p < f.length;
                      p++
                    ) {
                      var y = f[p];
                      i(u, y) || d(u, y, h(c, y));
                    }
                  };
                },
              "./node_modules/core-js/internals/correct-prototype-getter.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/fails.js");
                  n.exports = !i(function () {
                    function o() {}
                    return (
                      (o.prototype.constructor = null),
                      Object.getPrototypeOf(new o()) !== o.prototype
                    );
                  });
                },
              "./node_modules/core-js/internals/create-iterator-constructor.js":
                function (n, r, s) {
                  var i = s(
                      "./node_modules/core-js/internals/iterators-core.js",
                    ).IteratorPrototype,
                    o = s("./node_modules/core-js/internals/object-create.js"),
                    l = s(
                      "./node_modules/core-js/internals/create-property-descriptor.js",
                    ),
                    a = s(
                      "./node_modules/core-js/internals/set-to-string-tag.js",
                    ),
                    u = s("./node_modules/core-js/internals/iterators.js"),
                    c = function () {
                      return this;
                    };
                  n.exports = function (f, d, h) {
                    var p = d + " Iterator";
                    return (
                      (f.prototype = o(i, { next: l(1, h) })),
                      a(f, p, !1, !0),
                      (u[p] = c),
                      f
                    );
                  };
                },
              "./node_modules/core-js/internals/create-property-descriptor.js":
                function (n, r) {
                  n.exports = function (s, i) {
                    return {
                      enumerable: !(s & 1),
                      configurable: !(s & 2),
                      writable: !(s & 4),
                      value: i,
                    };
                  };
                },
              "./node_modules/core-js/internals/create-property.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/to-primitive.js"),
                  o = s(
                    "./node_modules/core-js/internals/object-define-property.js",
                  ),
                  l = s(
                    "./node_modules/core-js/internals/create-property-descriptor.js",
                  );
                n.exports = function (a, u, c) {
                  var f = i(u);
                  f in a ? o.f(a, f, l(0, c)) : (a[f] = c);
                };
              },
              "./node_modules/core-js/internals/define-iterator.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/export.js"),
                  o = s(
                    "./node_modules/core-js/internals/create-iterator-constructor.js",
                  ),
                  l = s(
                    "./node_modules/core-js/internals/object-get-prototype-of.js",
                  ),
                  a = s(
                    "./node_modules/core-js/internals/object-set-prototype-of.js",
                  ),
                  u = s(
                    "./node_modules/core-js/internals/set-to-string-tag.js",
                  ),
                  c = s("./node_modules/core-js/internals/hide.js"),
                  f = s("./node_modules/core-js/internals/redefine.js"),
                  d = s(
                    "./node_modules/core-js/internals/well-known-symbol.js",
                  ),
                  h = s("./node_modules/core-js/internals/is-pure.js"),
                  p = s("./node_modules/core-js/internals/iterators.js"),
                  y = s("./node_modules/core-js/internals/iterators-core.js"),
                  v = y.IteratorPrototype,
                  g = y.BUGGY_SAFARI_ITERATORS,
                  m = d("iterator"),
                  b = "keys",
                  w = "values",
                  S = "entries",
                  E = function () {
                    return this;
                  };
                n.exports = function (T, D, R, H, U, P, re) {
                  o(R, D, H);
                  var I = function (Bt) {
                      if (Bt === U && xe) return xe;
                      if (!g && Bt in X) return X[Bt];
                      switch (Bt) {
                        case b:
                          return function () {
                            return new R(this, Bt);
                          };
                        case w:
                          return function () {
                            return new R(this, Bt);
                          };
                        case S:
                          return function () {
                            return new R(this, Bt);
                          };
                      }
                      return function () {
                        return new R(this);
                      };
                    },
                    oe = D + " Iterator",
                    te = !1,
                    X = T.prototype,
                    K = X[m] || X["@@iterator"] || (U && X[U]),
                    xe = (!g && K) || I(U),
                    en = (D == "Array" && X.entries) || K,
                    He,
                    Be,
                    Mn;
                  if (
                    (en &&
                      ((He = l(en.call(new T()))),
                      v !== Object.prototype &&
                        He.next &&
                        (!h &&
                          l(He) !== v &&
                          (a
                            ? a(He, v)
                            : typeof He[m] != "function" && c(He, m, E)),
                        u(He, oe, !0, !0),
                        h && (p[oe] = E))),
                    U == w &&
                      K &&
                      K.name !== w &&
                      ((te = !0),
                      (xe = function () {
                        return K.call(this);
                      })),
                    (!h || re) && X[m] !== xe && c(X, m, xe),
                    (p[D] = xe),
                    U)
                  )
                    if (
                      ((Be = {
                        values: I(w),
                        keys: P ? xe : I(b),
                        entries: I(S),
                      }),
                      re)
                    )
                      for (Mn in Be)
                        (g || te || !(Mn in X)) && f(X, Mn, Be[Mn]);
                    else i({ target: D, proto: !0, forced: g || te }, Be);
                  return Be;
                };
              },
              "./node_modules/core-js/internals/descriptors.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/fails.js");
                n.exports = !i(function () {
                  return (
                    Object.defineProperty({}, "a", {
                      get: function () {
                        return 7;
                      },
                    }).a != 7
                  );
                });
              },
              "./node_modules/core-js/internals/document-create-element.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/global.js"),
                    o = s("./node_modules/core-js/internals/is-object.js"),
                    l = i.document,
                    a = o(l) && o(l.createElement);
                  n.exports = function (u) {
                    return a ? l.createElement(u) : {};
                  };
                },
              "./node_modules/core-js/internals/enum-bug-keys.js": function (
                n,
                r,
              ) {
                n.exports = [
                  "constructor",
                  "hasOwnProperty",
                  "isPrototypeOf",
                  "propertyIsEnumerable",
                  "toLocaleString",
                  "toString",
                  "valueOf",
                ];
              },
              "./node_modules/core-js/internals/export.js": function (n, r, s) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = s(
                    "./node_modules/core-js/internals/object-get-own-property-descriptor.js",
                  ).f,
                  l = s("./node_modules/core-js/internals/hide.js"),
                  a = s("./node_modules/core-js/internals/redefine.js"),
                  u = s("./node_modules/core-js/internals/set-global.js"),
                  c = s(
                    "./node_modules/core-js/internals/copy-constructor-properties.js",
                  ),
                  f = s("./node_modules/core-js/internals/is-forced.js");
                n.exports = function (d, h) {
                  var p = d.target,
                    y = d.global,
                    v = d.stat,
                    g,
                    m,
                    b,
                    w,
                    S,
                    E;
                  if (
                    (y
                      ? (m = i)
                      : v
                        ? (m = i[p] || u(p, {}))
                        : (m = (i[p] || {}).prototype),
                    m)
                  )
                    for (b in h) {
                      if (
                        ((S = h[b]),
                        d.noTargetGet
                          ? ((E = o(m, b)), (w = E && E.value))
                          : (w = m[b]),
                        (g = f(y ? b : p + (v ? "." : "#") + b, d.forced)),
                        !g && w !== void 0)
                      ) {
                        if (typeof S == typeof w) continue;
                        c(S, w);
                      }
                      ((d.sham || (w && w.sham)) && l(S, "sham", !0),
                        a(m, b, S, d));
                    }
                };
              },
              "./node_modules/core-js/internals/fails.js": function (n, r) {
                n.exports = function (s) {
                  try {
                    return !!s();
                  } catch {
                    return !0;
                  }
                };
              },
              "./node_modules/core-js/internals/function-to-string.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/shared.js");
                  n.exports = i("native-function-to-string", Function.toString);
                },
              "./node_modules/core-js/internals/get-iterator-method.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/classof.js"),
                    o = s("./node_modules/core-js/internals/iterators.js"),
                    l = s(
                      "./node_modules/core-js/internals/well-known-symbol.js",
                    ),
                    a = l("iterator");
                  n.exports = function (u) {
                    if (u != null) return u[a] || u["@@iterator"] || o[i(u)];
                  };
                },
              "./node_modules/core-js/internals/global.js": function (n, r, s) {
                (function (i) {
                  var o = "object",
                    l = function (a) {
                      return a && a.Math == Math && a;
                    };
                  n.exports =
                    l(typeof globalThis == o && globalThis) ||
                    l(typeof window == o && window) ||
                    l(typeof self == o && self) ||
                    l(typeof i == o && i) ||
                    Function("return this")();
                }).call(this, s("./node_modules/webpack/buildin/global.js"));
              },
              "./node_modules/core-js/internals/has.js": function (n, r) {
                var s = {}.hasOwnProperty;
                n.exports = function (i, o) {
                  return s.call(i, o);
                };
              },
              "./node_modules/core-js/internals/hidden-keys.js": function (
                n,
                r,
              ) {
                n.exports = {};
              },
              "./node_modules/core-js/internals/hide.js": function (n, r, s) {
                var i = s("./node_modules/core-js/internals/descriptors.js"),
                  o = s(
                    "./node_modules/core-js/internals/object-define-property.js",
                  ),
                  l = s(
                    "./node_modules/core-js/internals/create-property-descriptor.js",
                  );
                n.exports = i
                  ? function (a, u, c) {
                      return o.f(a, u, l(1, c));
                    }
                  : function (a, u, c) {
                      return ((a[u] = c), a);
                    };
              },
              "./node_modules/core-js/internals/html.js": function (n, r, s) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = i.document;
                n.exports = o && o.documentElement;
              },
              "./node_modules/core-js/internals/ie8-dom-define.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/descriptors.js"),
                  o = s("./node_modules/core-js/internals/fails.js"),
                  l = s(
                    "./node_modules/core-js/internals/document-create-element.js",
                  );
                n.exports =
                  !i &&
                  !o(function () {
                    return (
                      Object.defineProperty(l("div"), "a", {
                        get: function () {
                          return 7;
                        },
                      }).a != 7
                    );
                  });
              },
              "./node_modules/core-js/internals/indexed-object.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/fails.js"),
                  o = s("./node_modules/core-js/internals/classof-raw.js"),
                  l = "".split;
                n.exports = i(function () {
                  return !Object("z").propertyIsEnumerable(0);
                })
                  ? function (a) {
                      return o(a) == "String" ? l.call(a, "") : Object(a);
                    }
                  : Object;
              },
              "./node_modules/core-js/internals/internal-state.js": function (
                n,
                r,
                s,
              ) {
                var i = s(
                    "./node_modules/core-js/internals/native-weak-map.js",
                  ),
                  o = s("./node_modules/core-js/internals/global.js"),
                  l = s("./node_modules/core-js/internals/is-object.js"),
                  a = s("./node_modules/core-js/internals/hide.js"),
                  u = s("./node_modules/core-js/internals/has.js"),
                  c = s("./node_modules/core-js/internals/shared-key.js"),
                  f = s("./node_modules/core-js/internals/hidden-keys.js"),
                  d = o.WeakMap,
                  h,
                  p,
                  y,
                  v = function (T) {
                    return y(T) ? p(T) : h(T, {});
                  },
                  g = function (T) {
                    return function (D) {
                      var R;
                      if (!l(D) || (R = p(D)).type !== T)
                        throw TypeError(
                          "Incompatible receiver, " + T + " required",
                        );
                      return R;
                    };
                  };
                if (i) {
                  var m = new d(),
                    b = m.get,
                    w = m.has,
                    S = m.set;
                  ((h = function (T, D) {
                    return (S.call(m, T, D), D);
                  }),
                    (p = function (T) {
                      return b.call(m, T) || {};
                    }),
                    (y = function (T) {
                      return w.call(m, T);
                    }));
                } else {
                  var E = c("state");
                  ((f[E] = !0),
                    (h = function (T, D) {
                      return (a(T, E, D), D);
                    }),
                    (p = function (T) {
                      return u(T, E) ? T[E] : {};
                    }),
                    (y = function (T) {
                      return u(T, E);
                    }));
                }
                n.exports = {
                  set: h,
                  get: p,
                  has: y,
                  enforce: v,
                  getterFor: g,
                };
              },
              "./node_modules/core-js/internals/is-array-iterator-method.js":
                function (n, r, s) {
                  var i = s(
                      "./node_modules/core-js/internals/well-known-symbol.js",
                    ),
                    o = s("./node_modules/core-js/internals/iterators.js"),
                    l = i("iterator"),
                    a = Array.prototype;
                  n.exports = function (u) {
                    return u !== void 0 && (o.Array === u || a[l] === u);
                  };
                },
              "./node_modules/core-js/internals/is-forced.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/fails.js"),
                  o = /#|\.prototype\./,
                  l = function (d, h) {
                    var p = u[a(d)];
                    return p == f
                      ? !0
                      : p == c
                        ? !1
                        : typeof h == "function"
                          ? i(h)
                          : !!h;
                  },
                  a = (l.normalize = function (d) {
                    return String(d).replace(o, ".").toLowerCase();
                  }),
                  u = (l.data = {}),
                  c = (l.NATIVE = "N"),
                  f = (l.POLYFILL = "P");
                n.exports = l;
              },
              "./node_modules/core-js/internals/is-object.js": function (n, r) {
                n.exports = function (s) {
                  return typeof s == "object"
                    ? s !== null
                    : typeof s == "function";
                };
              },
              "./node_modules/core-js/internals/is-pure.js": function (n, r) {
                n.exports = !1;
              },
              "./node_modules/core-js/internals/iterators-core.js": function (
                n,
                r,
                s,
              ) {
                var i = s(
                    "./node_modules/core-js/internals/object-get-prototype-of.js",
                  ),
                  o = s("./node_modules/core-js/internals/hide.js"),
                  l = s("./node_modules/core-js/internals/has.js"),
                  a = s(
                    "./node_modules/core-js/internals/well-known-symbol.js",
                  ),
                  u = s("./node_modules/core-js/internals/is-pure.js"),
                  c = a("iterator"),
                  f = !1,
                  d = function () {
                    return this;
                  },
                  h,
                  p,
                  y;
                ([].keys &&
                  ((y = [].keys()),
                  "next" in y
                    ? ((p = i(i(y))), p !== Object.prototype && (h = p))
                    : (f = !0)),
                  h == null && (h = {}),
                  !u && !l(h, c) && o(h, c, d),
                  (n.exports = {
                    IteratorPrototype: h,
                    BUGGY_SAFARI_ITERATORS: f,
                  }));
              },
              "./node_modules/core-js/internals/iterators.js": function (n, r) {
                n.exports = {};
              },
              "./node_modules/core-js/internals/native-symbol.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/fails.js");
                n.exports =
                  !!Object.getOwnPropertySymbols &&
                  !i(function () {
                    return !String(Symbol());
                  });
              },
              "./node_modules/core-js/internals/native-weak-map.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = s(
                    "./node_modules/core-js/internals/function-to-string.js",
                  ),
                  l = i.WeakMap;
                n.exports =
                  typeof l == "function" && /native code/.test(o.call(l));
              },
              "./node_modules/core-js/internals/object-create.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/an-object.js"),
                  o = s(
                    "./node_modules/core-js/internals/object-define-properties.js",
                  ),
                  l = s("./node_modules/core-js/internals/enum-bug-keys.js"),
                  a = s("./node_modules/core-js/internals/hidden-keys.js"),
                  u = s("./node_modules/core-js/internals/html.js"),
                  c = s(
                    "./node_modules/core-js/internals/document-create-element.js",
                  ),
                  f = s("./node_modules/core-js/internals/shared-key.js"),
                  d = f("IE_PROTO"),
                  h = "prototype",
                  p = function () {},
                  y = function () {
                    var v = c("iframe"),
                      g = l.length,
                      m = "<",
                      b = "script",
                      w = ">",
                      S = "java" + b + ":",
                      E;
                    for (
                      v.style.display = "none",
                        u.appendChild(v),
                        v.src = String(S),
                        E = v.contentWindow.document,
                        E.open(),
                        E.write(
                          m + b + w + "document.F=Object" + m + "/" + b + w,
                        ),
                        E.close(),
                        y = E.F;
                      g--;
                    )
                      delete y[h][l[g]];
                    return y();
                  };
                ((n.exports =
                  Object.create ||
                  function (g, m) {
                    var b;
                    return (
                      g !== null
                        ? ((p[h] = i(g)),
                          (b = new p()),
                          (p[h] = null),
                          (b[d] = g))
                        : (b = y()),
                      m === void 0 ? b : o(b, m)
                    );
                  }),
                  (a[d] = !0));
              },
              "./node_modules/core-js/internals/object-define-properties.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/descriptors.js"),
                    o = s(
                      "./node_modules/core-js/internals/object-define-property.js",
                    ),
                    l = s("./node_modules/core-js/internals/an-object.js"),
                    a = s("./node_modules/core-js/internals/object-keys.js");
                  n.exports = i
                    ? Object.defineProperties
                    : function (c, f) {
                        l(c);
                        for (var d = a(f), h = d.length, p = 0, y; h > p; )
                          o.f(c, (y = d[p++]), f[y]);
                        return c;
                      };
                },
              "./node_modules/core-js/internals/object-define-property.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/descriptors.js"),
                    o = s("./node_modules/core-js/internals/ie8-dom-define.js"),
                    l = s("./node_modules/core-js/internals/an-object.js"),
                    a = s("./node_modules/core-js/internals/to-primitive.js"),
                    u = Object.defineProperty;
                  r.f = i
                    ? u
                    : function (f, d, h) {
                        if ((l(f), (d = a(d, !0)), l(h), o))
                          try {
                            return u(f, d, h);
                          } catch {}
                        if ("get" in h || "set" in h)
                          throw TypeError("Accessors not supported");
                        return ("value" in h && (f[d] = h.value), f);
                      };
                },
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/descriptors.js"),
                    o = s(
                      "./node_modules/core-js/internals/object-property-is-enumerable.js",
                    ),
                    l = s(
                      "./node_modules/core-js/internals/create-property-descriptor.js",
                    ),
                    a = s(
                      "./node_modules/core-js/internals/to-indexed-object.js",
                    ),
                    u = s("./node_modules/core-js/internals/to-primitive.js"),
                    c = s("./node_modules/core-js/internals/has.js"),
                    f = s("./node_modules/core-js/internals/ie8-dom-define.js"),
                    d = Object.getOwnPropertyDescriptor;
                  r.f = i
                    ? d
                    : function (p, y) {
                        if (((p = a(p)), (y = u(y, !0)), f))
                          try {
                            return d(p, y);
                          } catch {}
                        if (c(p, y)) return l(!o.f.call(p, y), p[y]);
                      };
                },
              "./node_modules/core-js/internals/object-get-own-property-names.js":
                function (n, r, s) {
                  var i = s(
                      "./node_modules/core-js/internals/object-keys-internal.js",
                    ),
                    o = s("./node_modules/core-js/internals/enum-bug-keys.js"),
                    l = o.concat("length", "prototype");
                  r.f =
                    Object.getOwnPropertyNames ||
                    function (u) {
                      return i(u, l);
                    };
                },
              "./node_modules/core-js/internals/object-get-own-property-symbols.js":
                function (n, r) {
                  r.f = Object.getOwnPropertySymbols;
                },
              "./node_modules/core-js/internals/object-get-prototype-of.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/has.js"),
                    o = s("./node_modules/core-js/internals/to-object.js"),
                    l = s("./node_modules/core-js/internals/shared-key.js"),
                    a = s(
                      "./node_modules/core-js/internals/correct-prototype-getter.js",
                    ),
                    u = l("IE_PROTO"),
                    c = Object.prototype;
                  n.exports = a
                    ? Object.getPrototypeOf
                    : function (f) {
                        return (
                          (f = o(f)),
                          i(f, u)
                            ? f[u]
                            : typeof f.constructor == "function" &&
                                f instanceof f.constructor
                              ? f.constructor.prototype
                              : f instanceof Object
                                ? c
                                : null
                        );
                      };
                },
              "./node_modules/core-js/internals/object-keys-internal.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/has.js"),
                    o = s(
                      "./node_modules/core-js/internals/to-indexed-object.js",
                    ),
                    l = s("./node_modules/core-js/internals/array-includes.js"),
                    a = s("./node_modules/core-js/internals/hidden-keys.js"),
                    u = l(!1);
                  n.exports = function (c, f) {
                    var d = o(c),
                      h = 0,
                      p = [],
                      y;
                    for (y in d) !i(a, y) && i(d, y) && p.push(y);
                    for (; f.length > h; )
                      i(d, (y = f[h++])) && (~u(p, y) || p.push(y));
                    return p;
                  };
                },
              "./node_modules/core-js/internals/object-keys.js": function (
                n,
                r,
                s,
              ) {
                var i = s(
                    "./node_modules/core-js/internals/object-keys-internal.js",
                  ),
                  o = s("./node_modules/core-js/internals/enum-bug-keys.js");
                n.exports =
                  Object.keys ||
                  function (a) {
                    return i(a, o);
                  };
              },
              "./node_modules/core-js/internals/object-property-is-enumerable.js":
                function (n, r, s) {
                  var i = {}.propertyIsEnumerable,
                    o = Object.getOwnPropertyDescriptor,
                    l = o && !i.call({ 1: 2 }, 1);
                  r.f = l
                    ? function (u) {
                        var c = o(this, u);
                        return !!c && c.enumerable;
                      }
                    : i;
                },
              "./node_modules/core-js/internals/object-set-prototype-of.js":
                function (n, r, s) {
                  var i = s(
                    "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js",
                  );
                  n.exports =
                    Object.setPrototypeOf ||
                    ("__proto__" in {}
                      ? (function () {
                          var o = !1,
                            l = {},
                            a;
                          try {
                            ((a = Object.getOwnPropertyDescriptor(
                              Object.prototype,
                              "__proto__",
                            ).set),
                              a.call(l, []),
                              (o = l instanceof Array));
                          } catch {}
                          return function (c, f) {
                            return (
                              i(c, f),
                              o ? a.call(c, f) : (c.__proto__ = f),
                              c
                            );
                          };
                        })()
                      : void 0);
                },
              "./node_modules/core-js/internals/own-keys.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = s(
                    "./node_modules/core-js/internals/object-get-own-property-names.js",
                  ),
                  l = s(
                    "./node_modules/core-js/internals/object-get-own-property-symbols.js",
                  ),
                  a = s("./node_modules/core-js/internals/an-object.js"),
                  u = i.Reflect;
                n.exports =
                  (u && u.ownKeys) ||
                  function (f) {
                    var d = o.f(a(f)),
                      h = l.f;
                    return h ? d.concat(h(f)) : d;
                  };
              },
              "./node_modules/core-js/internals/path.js": function (n, r, s) {
                n.exports = s("./node_modules/core-js/internals/global.js");
              },
              "./node_modules/core-js/internals/redefine.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = s("./node_modules/core-js/internals/shared.js"),
                  l = s("./node_modules/core-js/internals/hide.js"),
                  a = s("./node_modules/core-js/internals/has.js"),
                  u = s("./node_modules/core-js/internals/set-global.js"),
                  c = s(
                    "./node_modules/core-js/internals/function-to-string.js",
                  ),
                  f = s("./node_modules/core-js/internals/internal-state.js"),
                  d = f.get,
                  h = f.enforce,
                  p = String(c).split("toString");
                (o("inspectSource", function (y) {
                  return c.call(y);
                }),
                  (n.exports = function (y, v, g, m) {
                    var b = m ? !!m.unsafe : !1,
                      w = m ? !!m.enumerable : !1,
                      S = m ? !!m.noTargetGet : !1;
                    if (
                      (typeof g == "function" &&
                        (typeof v == "string" &&
                          !a(g, "name") &&
                          l(g, "name", v),
                        (h(g).source = p.join(typeof v == "string" ? v : ""))),
                      y === i)
                    ) {
                      w ? (y[v] = g) : u(v, g);
                      return;
                    } else b ? !S && y[v] && (w = !0) : delete y[v];
                    w ? (y[v] = g) : l(y, v, g);
                  })(Function.prototype, "toString", function () {
                    return (
                      (typeof this == "function" && d(this).source) ||
                      c.call(this)
                    );
                  }));
              },
              "./node_modules/core-js/internals/require-object-coercible.js":
                function (n, r) {
                  n.exports = function (s) {
                    if (s == null) throw TypeError("Can't call method on " + s);
                    return s;
                  };
                },
              "./node_modules/core-js/internals/set-global.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = s("./node_modules/core-js/internals/hide.js");
                n.exports = function (l, a) {
                  try {
                    o(i, l, a);
                  } catch {
                    i[l] = a;
                  }
                  return a;
                };
              },
              "./node_modules/core-js/internals/set-to-string-tag.js":
                function (n, r, s) {
                  var i = s(
                      "./node_modules/core-js/internals/object-define-property.js",
                    ).f,
                    o = s("./node_modules/core-js/internals/has.js"),
                    l = s(
                      "./node_modules/core-js/internals/well-known-symbol.js",
                    ),
                    a = l("toStringTag");
                  n.exports = function (u, c, f) {
                    u &&
                      !o((u = f ? u : u.prototype), a) &&
                      i(u, a, { configurable: !0, value: c });
                  };
                },
              "./node_modules/core-js/internals/shared-key.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/shared.js"),
                  o = s("./node_modules/core-js/internals/uid.js"),
                  l = i("keys");
                n.exports = function (a) {
                  return l[a] || (l[a] = o(a));
                };
              },
              "./node_modules/core-js/internals/shared.js": function (n, r, s) {
                var i = s("./node_modules/core-js/internals/global.js"),
                  o = s("./node_modules/core-js/internals/set-global.js"),
                  l = s("./node_modules/core-js/internals/is-pure.js"),
                  a = "__core-js_shared__",
                  u = i[a] || o(a, {});
                (n.exports = function (c, f) {
                  return u[c] || (u[c] = f !== void 0 ? f : {});
                })("versions", []).push({
                  version: "3.1.3",
                  mode: l ? "pure" : "global",
                  copyright: "© 2019 Denis Pushkarev (zloirock.ru)",
                });
              },
              "./node_modules/core-js/internals/string-at.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/to-integer.js"),
                  o = s(
                    "./node_modules/core-js/internals/require-object-coercible.js",
                  );
                n.exports = function (l, a, u) {
                  var c = String(o(l)),
                    f = i(a),
                    d = c.length,
                    h,
                    p;
                  return f < 0 || f >= d
                    ? u
                      ? ""
                      : void 0
                    : ((h = c.charCodeAt(f)),
                      h < 55296 ||
                      h > 56319 ||
                      f + 1 === d ||
                      (p = c.charCodeAt(f + 1)) < 56320 ||
                      p > 57343
                        ? u
                          ? c.charAt(f)
                          : h
                        : u
                          ? c.slice(f, f + 2)
                          : ((h - 55296) << 10) + (p - 56320) + 65536);
                };
              },
              "./node_modules/core-js/internals/to-absolute-index.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/to-integer.js"),
                    o = Math.max,
                    l = Math.min;
                  n.exports = function (a, u) {
                    var c = i(a);
                    return c < 0 ? o(c + u, 0) : l(c, u);
                  };
                },
              "./node_modules/core-js/internals/to-indexed-object.js":
                function (n, r, s) {
                  var i = s(
                      "./node_modules/core-js/internals/indexed-object.js",
                    ),
                    o = s(
                      "./node_modules/core-js/internals/require-object-coercible.js",
                    );
                  n.exports = function (l) {
                    return i(o(l));
                  };
                },
              "./node_modules/core-js/internals/to-integer.js": function (
                n,
                r,
              ) {
                var s = Math.ceil,
                  i = Math.floor;
                n.exports = function (o) {
                  return isNaN((o = +o)) ? 0 : (o > 0 ? i : s)(o);
                };
              },
              "./node_modules/core-js/internals/to-length.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/to-integer.js"),
                  o = Math.min;
                n.exports = function (l) {
                  return l > 0 ? o(i(l), 9007199254740991) : 0;
                };
              },
              "./node_modules/core-js/internals/to-object.js": function (
                n,
                r,
                s,
              ) {
                var i = s(
                  "./node_modules/core-js/internals/require-object-coercible.js",
                );
                n.exports = function (o) {
                  return Object(i(o));
                };
              },
              "./node_modules/core-js/internals/to-primitive.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/is-object.js");
                n.exports = function (o, l) {
                  if (!i(o)) return o;
                  var a, u;
                  if (
                    (l &&
                      typeof (a = o.toString) == "function" &&
                      !i((u = a.call(o)))) ||
                    (typeof (a = o.valueOf) == "function" &&
                      !i((u = a.call(o)))) ||
                    (!l &&
                      typeof (a = o.toString) == "function" &&
                      !i((u = a.call(o))))
                  )
                    return u;
                  throw TypeError("Can't convert object to primitive value");
                };
              },
              "./node_modules/core-js/internals/uid.js": function (n, r) {
                var s = 0,
                  i = Math.random();
                n.exports = function (o) {
                  return "Symbol(".concat(
                    o === void 0 ? "" : o,
                    ")_",
                    (++s + i).toString(36),
                  );
                };
              },
              "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/is-object.js"),
                    o = s("./node_modules/core-js/internals/an-object.js");
                  n.exports = function (l, a) {
                    if ((o(l), !i(a) && a !== null))
                      throw TypeError(
                        "Can't set " + String(a) + " as a prototype",
                      );
                  };
                },
              "./node_modules/core-js/internals/well-known-symbol.js":
                function (n, r, s) {
                  var i = s("./node_modules/core-js/internals/global.js"),
                    o = s("./node_modules/core-js/internals/shared.js"),
                    l = s("./node_modules/core-js/internals/uid.js"),
                    a = s("./node_modules/core-js/internals/native-symbol.js"),
                    u = i.Symbol,
                    c = o("wks");
                  n.exports = function (f) {
                    return (
                      c[f] || (c[f] = (a && u[f]) || (a ? u : l)("Symbol." + f))
                    );
                  };
                },
              "./node_modules/core-js/modules/es.array.from.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/export.js"),
                  o = s("./node_modules/core-js/internals/array-from.js"),
                  l = s(
                    "./node_modules/core-js/internals/check-correctness-of-iteration.js",
                  ),
                  a = !l(function (u) {
                    Array.from(u);
                  });
                i({ target: "Array", stat: !0, forced: a }, { from: o });
              },
              "./node_modules/core-js/modules/es.string.iterator.js": function (
                n,
                r,
                s,
              ) {
                var i = s("./node_modules/core-js/internals/string-at.js"),
                  o = s("./node_modules/core-js/internals/internal-state.js"),
                  l = s("./node_modules/core-js/internals/define-iterator.js"),
                  a = "String Iterator",
                  u = o.set,
                  c = o.getterFor(a);
                l(
                  String,
                  "String",
                  function (f) {
                    u(this, { type: a, string: String(f), index: 0 });
                  },
                  function () {
                    var d = c(this),
                      h = d.string,
                      p = d.index,
                      y;
                    return p >= h.length
                      ? { value: void 0, done: !0 }
                      : ((y = i(h, p, !0)),
                        (d.index += y.length),
                        { value: y, done: !1 });
                  },
                );
              },
              "./node_modules/webpack/buildin/global.js": function (n, r) {
                var s;
                s = (function () {
                  return this;
                })();
                try {
                  s = s || Function("return this")() || (0, eval)("this");
                } catch {
                  typeof window == "object" && (s = window);
                }
                n.exports = s;
              },
              "./src/default-attrs.json": function (n) {
                n.exports = {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: 24,
                  height: 24,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": 2,
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                };
              },
              "./src/icon.js": function (n, r, s) {
                Object.defineProperty(r, "__esModule", { value: !0 });
                var i =
                    Object.assign ||
                    function (y) {
                      for (var v = 1; v < arguments.length; v++) {
                        var g = arguments[v];
                        for (var m in g)
                          Object.prototype.hasOwnProperty.call(g, m) &&
                            (y[m] = g[m]);
                      }
                      return y;
                    },
                  o = (function () {
                    function y(v, g) {
                      for (var m = 0; m < g.length; m++) {
                        var b = g[m];
                        ((b.enumerable = b.enumerable || !1),
                          (b.configurable = !0),
                          "value" in b && (b.writable = !0),
                          Object.defineProperty(v, b.key, b));
                      }
                    }
                    return function (v, g, m) {
                      return (g && y(v.prototype, g), m && y(v, m), v);
                    };
                  })(),
                  l = s("./node_modules/classnames/dedupe.js"),
                  a = f(l),
                  u = s("./src/default-attrs.json"),
                  c = f(u);
                function f(y) {
                  return y && y.__esModule ? y : { default: y };
                }
                function d(y, v) {
                  if (!(y instanceof v))
                    throw new TypeError("Cannot call a class as a function");
                }
                var h = (function () {
                  function y(v, g) {
                    var m =
                      arguments.length > 2 && arguments[2] !== void 0
                        ? arguments[2]
                        : [];
                    (d(this, y),
                      (this.name = v),
                      (this.contents = g),
                      (this.tags = m),
                      (this.attrs = i({}, c.default, {
                        class: "feather feather-" + v,
                      })));
                  }
                  return (
                    o(y, [
                      {
                        key: "toSvg",
                        value: function () {
                          var g =
                              arguments.length > 0 && arguments[0] !== void 0
                                ? arguments[0]
                                : {},
                            m = i({}, this.attrs, g, {
                              class: (0, a.default)(this.attrs.class, g.class),
                            });
                          return (
                            "<svg " + p(m) + ">" + this.contents + "</svg>"
                          );
                        },
                      },
                      {
                        key: "toString",
                        value: function () {
                          return this.contents;
                        },
                      },
                    ]),
                    y
                  );
                })();
                function p(y) {
                  return Object.keys(y)
                    .map(function (v) {
                      return v + '="' + y[v] + '"';
                    })
                    .join(" ");
                }
                r.default = h;
              },
              "./src/icons.js": function (n, r, s) {
                Object.defineProperty(r, "__esModule", { value: !0 });
                var i = s("./src/icon.js"),
                  o = f(i),
                  l = s("./dist/icons.json"),
                  a = f(l),
                  u = s("./src/tags.json"),
                  c = f(u);
                function f(d) {
                  return d && d.__esModule ? d : { default: d };
                }
                r.default = Object.keys(a.default)
                  .map(function (d) {
                    return new o.default(d, a.default[d], c.default[d]);
                  })
                  .reduce(function (d, h) {
                    return ((d[h.name] = h), d);
                  }, {});
              },
              "./src/index.js": function (n, r, s) {
                var i = s("./src/icons.js"),
                  o = f(i),
                  l = s("./src/to-svg.js"),
                  a = f(l),
                  u = s("./src/replace.js"),
                  c = f(u);
                function f(d) {
                  return d && d.__esModule ? d : { default: d };
                }
                n.exports = {
                  icons: o.default,
                  toSvg: a.default,
                  replace: c.default,
                };
              },
              "./src/replace.js": function (n, r, s) {
                Object.defineProperty(r, "__esModule", { value: !0 });
                var i =
                    Object.assign ||
                    function (p) {
                      for (var y = 1; y < arguments.length; y++) {
                        var v = arguments[y];
                        for (var g in v)
                          Object.prototype.hasOwnProperty.call(v, g) &&
                            (p[g] = v[g]);
                      }
                      return p;
                    },
                  o = s("./node_modules/classnames/dedupe.js"),
                  l = c(o),
                  a = s("./src/icons.js"),
                  u = c(a);
                function c(p) {
                  return p && p.__esModule ? p : { default: p };
                }
                function f() {
                  var p =
                    arguments.length > 0 && arguments[0] !== void 0
                      ? arguments[0]
                      : {};
                  if (typeof document > "u")
                    throw new Error(
                      "`feather.replace()` only works in a browser environment.",
                    );
                  var y = document.querySelectorAll("[data-feather]");
                  Array.from(y).forEach(function (v) {
                    return d(v, p);
                  });
                }
                function d(p) {
                  var y =
                      arguments.length > 1 && arguments[1] !== void 0
                        ? arguments[1]
                        : {},
                    v = h(p),
                    g = v["data-feather"];
                  if ((delete v["data-feather"], u.default[g] === void 0)) {
                    console.warn("feather: '" + g + "' is not a valid icon");
                    return;
                  }
                  var m = u.default[g].toSvg(
                      i({}, y, v, { class: (0, l.default)(y.class, v.class) }),
                    ),
                    b = new DOMParser().parseFromString(m, "image/svg+xml"),
                    w = b.querySelector("svg");
                  p.parentNode.replaceChild(w, p);
                }
                function h(p) {
                  return Array.from(p.attributes).reduce(function (y, v) {
                    return ((y[v.name] = v.value), y);
                  }, {});
                }
                r.default = f;
              },
              "./src/tags.json": function (n) {
                n.exports = {
                  activity: ["pulse", "health", "action", "motion"],
                  airplay: ["stream", "cast", "mirroring"],
                  "alert-circle": ["warning", "alert", "danger"],
                  "alert-octagon": ["warning", "alert", "danger"],
                  "alert-triangle": ["warning", "alert", "danger"],
                  "align-center": ["text alignment", "center"],
                  "align-justify": ["text alignment", "justified"],
                  "align-left": ["text alignment", "left"],
                  "align-right": ["text alignment", "right"],
                  anchor: [],
                  archive: ["index", "box"],
                  "at-sign": ["mention", "at", "email", "message"],
                  award: ["achievement", "badge"],
                  aperture: ["camera", "photo"],
                  "bar-chart": ["statistics", "diagram", "graph"],
                  "bar-chart-2": ["statistics", "diagram", "graph"],
                  battery: ["power", "electricity"],
                  "battery-charging": ["power", "electricity"],
                  bell: ["alarm", "notification", "sound"],
                  "bell-off": ["alarm", "notification", "silent"],
                  bluetooth: ["wireless"],
                  "book-open": ["read", "library"],
                  book: [
                    "read",
                    "dictionary",
                    "booklet",
                    "magazine",
                    "library",
                  ],
                  bookmark: ["read", "clip", "marker", "tag"],
                  box: ["cube"],
                  briefcase: ["work", "bag", "baggage", "folder"],
                  calendar: ["date"],
                  camera: ["photo"],
                  cast: ["chromecast", "airplay"],
                  "chevron-down": ["expand"],
                  "chevron-up": ["collapse"],
                  circle: ["off", "zero", "record"],
                  clipboard: ["copy"],
                  clock: ["time", "watch", "alarm"],
                  "cloud-drizzle": ["weather", "shower"],
                  "cloud-lightning": ["weather", "bolt"],
                  "cloud-rain": ["weather"],
                  "cloud-snow": ["weather", "blizzard"],
                  cloud: ["weather"],
                  codepen: ["logo"],
                  codesandbox: ["logo"],
                  code: ["source", "programming"],
                  coffee: [
                    "drink",
                    "cup",
                    "mug",
                    "tea",
                    "cafe",
                    "hot",
                    "beverage",
                  ],
                  columns: ["layout"],
                  command: ["keyboard", "cmd", "terminal", "prompt"],
                  compass: ["navigation", "safari", "travel", "direction"],
                  copy: ["clone", "duplicate"],
                  "corner-down-left": ["arrow", "return"],
                  "corner-down-right": ["arrow"],
                  "corner-left-down": ["arrow"],
                  "corner-left-up": ["arrow"],
                  "corner-right-down": ["arrow"],
                  "corner-right-up": ["arrow"],
                  "corner-up-left": ["arrow"],
                  "corner-up-right": ["arrow"],
                  cpu: ["processor", "technology"],
                  "credit-card": ["purchase", "payment", "cc"],
                  crop: ["photo", "image"],
                  crosshair: ["aim", "target"],
                  database: ["storage", "memory"],
                  delete: ["remove"],
                  disc: ["album", "cd", "dvd", "music"],
                  "dollar-sign": ["currency", "money", "payment"],
                  droplet: ["water"],
                  edit: ["pencil", "change"],
                  "edit-2": ["pencil", "change"],
                  "edit-3": ["pencil", "change"],
                  eye: ["view", "watch"],
                  "eye-off": ["view", "watch", "hide", "hidden"],
                  "external-link": ["outbound"],
                  facebook: ["logo", "social"],
                  "fast-forward": ["music"],
                  figma: ["logo", "design", "tool"],
                  "file-minus": ["delete", "remove", "erase"],
                  "file-plus": ["add", "create", "new"],
                  "file-text": ["data", "txt", "pdf"],
                  film: ["movie", "video"],
                  filter: ["funnel", "hopper"],
                  flag: ["report"],
                  "folder-minus": ["directory"],
                  "folder-plus": ["directory"],
                  folder: ["directory"],
                  framer: ["logo", "design", "tool"],
                  frown: ["emoji", "face", "bad", "sad", "emotion"],
                  gift: ["present", "box", "birthday", "party"],
                  "git-branch": ["code", "version control"],
                  "git-commit": ["code", "version control"],
                  "git-merge": ["code", "version control"],
                  "git-pull-request": ["code", "version control"],
                  github: ["logo", "version control"],
                  gitlab: ["logo", "version control"],
                  globe: ["world", "browser", "language", "translate"],
                  "hard-drive": ["computer", "server", "memory", "data"],
                  hash: ["hashtag", "number", "pound"],
                  headphones: ["music", "audio", "sound"],
                  heart: ["like", "love", "emotion"],
                  "help-circle": ["question mark"],
                  hexagon: ["shape", "node.js", "logo"],
                  home: ["house", "living"],
                  image: ["picture"],
                  inbox: ["email"],
                  instagram: ["logo", "camera"],
                  key: ["password", "login", "authentication", "secure"],
                  layers: ["stack"],
                  layout: ["window", "webpage"],
                  "life-buoy": ["help", "life ring", "support"],
                  link: ["chain", "url"],
                  "link-2": ["chain", "url"],
                  linkedin: ["logo", "social media"],
                  list: ["options"],
                  lock: ["security", "password", "secure"],
                  "log-in": ["sign in", "arrow", "enter"],
                  "log-out": ["sign out", "arrow", "exit"],
                  mail: ["email", "message"],
                  "map-pin": ["location", "navigation", "travel", "marker"],
                  map: ["location", "navigation", "travel"],
                  maximize: ["fullscreen"],
                  "maximize-2": ["fullscreen", "arrows", "expand"],
                  meh: ["emoji", "face", "neutral", "emotion"],
                  menu: ["bars", "navigation", "hamburger"],
                  "message-circle": ["comment", "chat"],
                  "message-square": ["comment", "chat"],
                  "mic-off": ["record", "sound", "mute"],
                  mic: ["record", "sound", "listen"],
                  minimize: ["exit fullscreen", "close"],
                  "minimize-2": ["exit fullscreen", "arrows", "close"],
                  minus: ["subtract"],
                  monitor: ["tv", "screen", "display"],
                  moon: ["dark", "night"],
                  "more-horizontal": ["ellipsis"],
                  "more-vertical": ["ellipsis"],
                  "mouse-pointer": ["arrow", "cursor"],
                  move: ["arrows"],
                  music: ["note"],
                  navigation: ["location", "travel"],
                  "navigation-2": ["location", "travel"],
                  octagon: ["stop"],
                  package: ["box", "container"],
                  paperclip: ["attachment"],
                  pause: ["music", "stop"],
                  "pause-circle": ["music", "audio", "stop"],
                  "pen-tool": ["vector", "drawing"],
                  percent: ["discount"],
                  "phone-call": ["ring"],
                  "phone-forwarded": ["call"],
                  "phone-incoming": ["call"],
                  "phone-missed": ["call"],
                  "phone-off": ["call", "mute"],
                  "phone-outgoing": ["call"],
                  phone: ["call"],
                  play: ["music", "start"],
                  "pie-chart": ["statistics", "diagram"],
                  "play-circle": ["music", "start"],
                  plus: ["add", "new"],
                  "plus-circle": ["add", "new"],
                  "plus-square": ["add", "new"],
                  pocket: ["logo", "save"],
                  power: ["on", "off"],
                  printer: ["fax", "office", "device"],
                  radio: ["signal"],
                  "refresh-cw": ["synchronise", "arrows"],
                  "refresh-ccw": ["arrows"],
                  repeat: ["loop", "arrows"],
                  rewind: ["music"],
                  "rotate-ccw": ["arrow"],
                  "rotate-cw": ["arrow"],
                  rss: ["feed", "subscribe"],
                  save: ["floppy disk"],
                  scissors: ["cut"],
                  search: ["find", "magnifier", "magnifying glass"],
                  send: [
                    "message",
                    "mail",
                    "email",
                    "paper airplane",
                    "paper aeroplane",
                  ],
                  settings: ["cog", "edit", "gear", "preferences"],
                  "share-2": ["network", "connections"],
                  shield: ["security", "secure"],
                  "shield-off": ["security", "insecure"],
                  "shopping-bag": ["ecommerce", "cart", "purchase", "store"],
                  "shopping-cart": ["ecommerce", "cart", "purchase", "store"],
                  shuffle: ["music"],
                  "skip-back": ["music"],
                  "skip-forward": ["music"],
                  slack: ["logo"],
                  slash: ["ban", "no"],
                  sliders: ["settings", "controls"],
                  smartphone: ["cellphone", "device"],
                  smile: ["emoji", "face", "happy", "good", "emotion"],
                  speaker: ["audio", "music"],
                  star: ["bookmark", "favorite", "like"],
                  "stop-circle": ["media", "music"],
                  sun: ["brightness", "weather", "light"],
                  sunrise: ["weather", "time", "morning", "day"],
                  sunset: ["weather", "time", "evening", "night"],
                  tablet: ["device"],
                  tag: ["label"],
                  target: ["logo", "bullseye"],
                  terminal: ["code", "command line", "prompt"],
                  thermometer: [
                    "temperature",
                    "celsius",
                    "fahrenheit",
                    "weather",
                  ],
                  "thumbs-down": ["dislike", "bad", "emotion"],
                  "thumbs-up": ["like", "good", "emotion"],
                  "toggle-left": ["on", "off", "switch"],
                  "toggle-right": ["on", "off", "switch"],
                  tool: ["settings", "spanner"],
                  trash: ["garbage", "delete", "remove", "bin"],
                  "trash-2": ["garbage", "delete", "remove", "bin"],
                  triangle: ["delta"],
                  truck: ["delivery", "van", "shipping", "transport", "lorry"],
                  tv: ["television", "stream"],
                  twitch: ["logo"],
                  twitter: ["logo", "social"],
                  type: ["text"],
                  umbrella: ["rain", "weather"],
                  unlock: ["security"],
                  "user-check": ["followed", "subscribed"],
                  "user-minus": ["delete", "remove", "unfollow", "unsubscribe"],
                  "user-plus": ["new", "add", "create", "follow", "subscribe"],
                  "user-x": [
                    "delete",
                    "remove",
                    "unfollow",
                    "unsubscribe",
                    "unavailable",
                  ],
                  user: ["person", "account"],
                  users: ["group"],
                  "video-off": ["camera", "movie", "film"],
                  video: ["camera", "movie", "film"],
                  voicemail: ["phone"],
                  volume: ["music", "sound", "mute"],
                  "volume-1": ["music", "sound"],
                  "volume-2": ["music", "sound"],
                  "volume-x": ["music", "sound", "mute"],
                  watch: ["clock", "time"],
                  "wifi-off": ["disabled"],
                  wifi: ["connection", "signal", "wireless"],
                  wind: ["weather", "air"],
                  "x-circle": [
                    "cancel",
                    "close",
                    "delete",
                    "remove",
                    "times",
                    "clear",
                  ],
                  "x-octagon": [
                    "delete",
                    "stop",
                    "alert",
                    "warning",
                    "times",
                    "clear",
                  ],
                  "x-square": [
                    "cancel",
                    "close",
                    "delete",
                    "remove",
                    "times",
                    "clear",
                  ],
                  x: ["cancel", "close", "delete", "remove", "times", "clear"],
                  youtube: ["logo", "video", "play"],
                  "zap-off": ["flash", "camera", "lightning"],
                  zap: ["flash", "camera", "lightning"],
                  "zoom-in": ["magnifying glass"],
                  "zoom-out": ["magnifying glass"],
                };
              },
              "./src/to-svg.js": function (n, r, s) {
                Object.defineProperty(r, "__esModule", { value: !0 });
                var i = s("./src/icons.js"),
                  o = l(i);
                function l(u) {
                  return u && u.__esModule ? u : { default: u };
                }
                function a(u) {
                  var c =
                    arguments.length > 1 && arguments[1] !== void 0
                      ? arguments[1]
                      : {};
                  if (
                    (console.warn(
                      "feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead.",
                    ),
                    !u)
                  )
                    throw new Error(
                      "The required `key` (icon name) parameter is missing.",
                    );
                  if (!o.default[u])
                    throw new Error(
                      "No icon matching '" +
                        u +
                        "'. See the complete list of icons at https://feathericons.com",
                    );
                  return o.default[u].toSvg(c);
                }
                r.default = a;
              },
              0: function (n, r, s) {
                (s("./node_modules/core-js/es/array/from.js"),
                  (n.exports = s("./src/index.js")));
              },
            });
          });
        })(Xs)),
      Xs.exports
    );
  }
  var bm = vm();
  const Fo = Ic(bm),
    ku = Object.keys(Fo.icons),
    Vo = {
      props: {
        name: {
          type: String,
          required: !0,
          validator(e) {
            const t = ku.includes(e);
            return (
              t ||
                (console.groupCollapsed(
                  "[frappe-ui] name property for feather-icon must be one of ",
                ),
                console.dir(ku),
                console.groupEnd()),
              t
            );
          },
        },
        color: { type: String, default: null },
        strokeWidth: { type: Number, default: 1.5 },
      },
      render() {
        let e = Fo.icons[this.name];
        return (
          e || (e = Fo.icons.circle),
          cn(
            "svg",
            Ke(
              e.attrs,
              {
                fill: "none",
                stroke: "currentColor",
                color: this.color,
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": this.strokeWidth,
                width: null,
                height: null,
                class: [e.attrs.class, "shrink-0"],
                innerHTML: e.contents,
              },
              this.$attrs,
            ),
          )
        );
      },
    },
    xm = Z({
      __name: "LoadingIndicator",
      props: { scale: { required: !1, default: 100 } },
      setup(e) {
        return (t, n) => (
          M(),
          ee(
            "svg",
            {
              class: "max-w-xs animate-spin",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              style: St(`scale: ${e.scale}%;`),
              viewBox: "0 0 24 24",
            },
            [
              ...(n[0] ||
                (n[0] = [
                  J(
                    "circle",
                    {
                      class: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      "stroke-width": "4",
                    },
                    null,
                    -1,
                  ),
                  J(
                    "path",
                    {
                      class: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                    },
                    null,
                    -1,
                  ),
                ])),
            ],
            4,
          )
        );
      },
    });
  const wm = Symbol("");
  function _m() {
    return jt(wm);
  }
  const Sm = {
      class:
        "rounded bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-xl",
    },
    Em = Z({
      inheritAttrs: !1,
      __name: "Tooltip",
      props: {
        text: { default: "" },
        hoverDelay: { default: 0.5 },
        placement: { default: "top" },
        arrowClass: { default: "fill-surface-gray-7" },
        disabled: { type: Boolean, default: !1 },
      },
      setup(e) {
        const t = e,
          n = V(() => t.hoverDelay * 1e3);
        return (r, s) =>
          e.disabled
            ? he(r.$slots, "default", { key: 0 })
            : (M(),
              Y(
                F(sm),
                { key: 1, delayDuration: n.value },
                {
                  default: se(() => [
                    le(F(lm), null, {
                      default: se(() => [
                        le(
                          F(gm),
                          { "as-child": "" },
                          {
                            default: se(() => [he(r.$slots, "default")]),
                            _: 3,
                          },
                        ),
                        le(F(pm), null, {
                          default: se(() => [
                            t.text || r.$slots.body || r.$slots.content
                              ? (M(),
                                Y(
                                  F(dm),
                                  {
                                    key: 0,
                                    side: t.placement,
                                    "side-offset": 4,
                                    class: "z-[100]",
                                  },
                                  {
                                    default: se(() => [
                                      he(r.$slots, "body", {}, () => [
                                        J("div", Sm, [
                                          he(r.$slots, "content", {}, () => [
                                            Ue(_e(t.text), 1),
                                          ]),
                                        ]),
                                      ]),
                                      le(
                                        F(tm),
                                        {
                                          class: we(t.arrowClass),
                                          width: 8,
                                          height: 4,
                                        },
                                        null,
                                        8,
                                        ["class"],
                                      ),
                                    ]),
                                    _: 3,
                                  },
                                  8,
                                  ["side"],
                                ))
                              : Se("", !0),
                          ]),
                          _: 3,
                        }),
                      ]),
                      _: 3,
                    }),
                  ]),
                  _: 3,
                },
                8,
                ["delayDuration"],
              ));
      },
    }),
    Cm = ["disabled", "ariaLabel", "type"],
    Tm = Z({
      inheritAttrs: !1,
      __name: "Button",
      props: {
        theme: { default: "gray" },
        size: { default: "sm" },
        variant: { default: "subtle" },
        label: {},
        icon: {},
        iconLeft: {},
        iconRight: {},
        tooltip: {},
        loading: { type: Boolean, default: !1 },
        loadingText: {},
        disabled: { type: Boolean, default: !1 },
        route: {},
        link: {},
        type: { default: "button" },
      },
      setup(e, { expose: t }) {
        const n = e,
          r = rh(),
          s = _m(),
          i = V(() => {
            let h = {
                gray: "text-ink-white bg-surface-gray-7 hover:bg-surface-gray-6 active:bg-surface-gray-5",
                blue: "text-ink-white bg-blue-500 hover:bg-surface-blue-3 active:bg-blue-700",
                green:
                  "text-ink-white bg-surface-green-3 hover:bg-green-700 active:bg-green-800",
                red: "text-ink-white bg-surface-red-5 hover:bg-surface-red-6 active:bg-surface-red-7",
              }[n.theme],
              p = {
                gray: "text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4",
                blue: "text-ink-blue-3 bg-surface-blue-2 hover:bg-blue-200 active:bg-blue-300",
                green:
                  "text-green-800 bg-surface-green-2 hover:bg-green-200 active:bg-green-300",
                red: "text-red-700 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4",
              }[n.theme],
              y = {
                gray: "text-ink-gray-8 bg-surface-white bg-surface-white border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4",
                blue: "text-ink-blue-3 bg-surface-white border border-outline-blue-1 hover:border-blue-400 active:border-blue-400 active:bg-blue-300",
                green:
                  "text-green-800 bg-surface-white border border-outline-green-2 hover:border-green-500 active:border-green-500 active:bg-green-300",
                red: "text-red-700 bg-surface-white border border-outline-red-1 hover:border-outline-red-2 active:border-outline-red-2 active:bg-surface-red-3",
              }[n.theme],
              v = {
                gray: "text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4",
                blue: "text-ink-blue-3 bg-transparent hover:bg-blue-200 active:bg-blue-300",
                green:
                  "text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300",
                red: "text-red-700 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4",
              }[n.theme],
              g = {
                gray: "focus-visible:ring focus-visible:ring-outline-gray-3",
                blue: "focus-visible:ring focus-visible:ring-blue-400",
                green: "focus-visible:ring focus-visible:ring-outline-green-2",
                red: "focus-visible:ring focus-visible:ring-outline-red-2",
              }[n.theme],
              m = { subtle: p, solid: h, outline: y, ghost: v }[n.variant],
              b = `${n.theme}-${n.variant}`,
              S = {
                "gray-solid": "bg-surface-gray-2 text-ink-gray-4",
                "gray-subtle": "bg-surface-gray-2 text-ink-gray-4",
                "gray-outline":
                  "bg-surface-gray-2 text-ink-gray-4 border border-outline-gray-2",
                "gray-ghost": "text-ink-gray-4",
                "blue-solid": "bg-blue-300 text-ink-white",
                "blue-subtle": "bg-surface-blue-2 text-ink-blue-link",
                "blue-outline":
                  "bg-surface-blue-2 text-ink-blue-link border border-outline-blue-1",
                "blue-ghost": "text-ink-blue-link",
                "green-solid": "bg-surface-green-2 text-ink-green-2",
                "green-subtle": "bg-surface-green-2 text-ink-green-2",
                "green-outline":
                  "bg-surface-green-2 text-ink-green-2 border border-outline-green-2",
                "green-ghost": "text-ink-green-2",
                "red-solid": "bg-surface-red-2 text-ink-red-2",
                "red-subtle": "bg-surface-red-2 text-ink-red-2",
                "red-outline":
                  "bg-surface-red-2 text-ink-red-2 border border-outline-red-1",
                "red-ghost": "text-ink-red-2",
              }[b],
              E = {
                sm: "h-7 text-base px-2 rounded",
                md: "h-8 text-base font-medium px-2.5 rounded",
                lg: "h-10 text-lg font-medium px-3 rounded-md",
                xl: "h-11.5 text-xl font-medium px-3.5 rounded-lg",
                "2xl": "h-13 text-2xl font-medium px-3.5 rounded-xl",
              }[n.size];
            return (
              u.value &&
                (E = {
                  sm: "h-7 w-7 rounded",
                  md: "h-8 w-8 rounded",
                  lg: "h-10 w-10 rounded-md",
                  xl: "h-11.5 w-11.5 rounded-lg",
                  "2xl": "h-13 w-13 rounded-xl",
                }[n.size]),
              [
                "inline-flex items-center justify-center gap-2 transition-colors focus:outline-none shrink-0",
                l.value ? S : m,
                g,
                E,
              ]
            );
          }),
          o = V(
            () =>
              ({ sm: "h-4", md: "h-4.5", lg: "h-5", xl: "h-6", "2xl": "h-6" })[
                n.size
              ],
          ),
          l = V(() => n.disabled || n.loading),
          a = V(() => (u.value ? n.label : null)),
          u = V(() => n.icon || r.icon || c.value),
          c = V(() => {
            if (!r.default) return !1;
            const h = r.default();
            if (!Array.isArray(h)) return !1;
            let p = h[0];
            return !!(
              typeof p.type?.name == "string" &&
              p.type?.name?.startsWith("lucide-")
            );
          }),
          f = () => {
            if (n.route) return s.push(n.route);
            if (n.link) return window.open(n.link, "_blank");
          },
          d = Q();
        return (
          t({ rootRef: d }),
          (h, p) => (
            M(),
            Y(
              Em,
              { text: e.tooltip, disabled: !e.tooltip?.length },
              {
                default: se(() => [
                  J(
                    "button",
                    Ke(h.$attrs, {
                      class: i.value,
                      onClick: f,
                      disabled: l.value,
                      ariaLabel: a.value,
                      type: n.type,
                      ref_key: "rootRef",
                      ref: d,
                    }),
                    [
                      e.loading
                        ? (M(),
                          Y(
                            xm,
                            {
                              key: 0,
                              class: we({
                                "h-3 w-3": e.size == "sm",
                                "h-[13.5px] w-[13.5px]": e.size == "md",
                                "h-[15px] w-[15px]": e.size == "lg",
                                "h-4.5 w-4.5":
                                  e.size == "xl" || e.size == "2xl",
                              }),
                            },
                            null,
                            8,
                            ["class"],
                          ))
                        : h.$slots.prefix || e.iconLeft
                          ? he(h.$slots, "prefix", { key: 1 }, () => [
                              e.iconLeft && typeof e.iconLeft == "string"
                                ? (M(),
                                  Y(
                                    Vo,
                                    {
                                      key: 0,
                                      name: e.iconLeft,
                                      class: we(o.value),
                                      "aria-hidden": "true",
                                    },
                                    null,
                                    8,
                                    ["name", "class"],
                                  ))
                                : e.iconLeft
                                  ? (M(),
                                    Y(
                                      En(e.iconLeft),
                                      { key: 1, class: we(o.value) },
                                      null,
                                      8,
                                      ["class"],
                                    ))
                                  : Se("", !0),
                            ])
                          : Se("", !0),
                      e.loading && e.loadingText
                        ? (M(),
                          ee(pe, { key: 2 }, [Ue(_e(e.loadingText), 1)], 64))
                        : u.value && !e.loading
                          ? (M(),
                            ee(
                              pe,
                              { key: 3 },
                              [
                                e.icon && typeof e.icon == "string"
                                  ? (M(),
                                    Y(
                                      Vo,
                                      {
                                        key: 0,
                                        name: e.icon,
                                        class: we(o.value),
                                        "aria-label": e.label,
                                      },
                                      null,
                                      8,
                                      ["name", "class", "aria-label"],
                                    ))
                                  : e.icon
                                    ? (M(),
                                      Y(
                                        En(e.icon),
                                        { key: 1, class: we(o.value) },
                                        null,
                                        8,
                                        ["class"],
                                      ))
                                    : h.$slots.icon
                                      ? he(h.$slots, "icon", { key: 2 })
                                      : c.value
                                        ? (M(),
                                          ee(
                                            "div",
                                            { key: 3, class: we(o.value) },
                                            [
                                              he(
                                                h.$slots,
                                                "default",
                                                {},
                                                () => [Ue(_e(e.label), 1)],
                                              ),
                                            ],
                                            2,
                                          ))
                                        : Se("", !0),
                              ],
                              64,
                            ))
                          : (M(),
                            ee(
                              "span",
                              {
                                key: 4,
                                class: we([{ "sr-only": u.value }, "truncate"]),
                              },
                              [
                                he(h.$slots, "default", {}, () => [
                                  Ue(_e(e.label), 1),
                                ]),
                              ],
                              2,
                            )),
                      he(h.$slots, "suffix", {}, () => [
                        e.iconRight && typeof e.iconRight == "string"
                          ? (M(),
                            Y(
                              Vo,
                              {
                                key: 0,
                                name: e.iconRight,
                                class: we(o.value),
                                "aria-hidden": "true",
                              },
                              null,
                              8,
                              ["name", "class"],
                            ))
                          : e.iconRight
                            ? (M(),
                              Y(
                                En(e.iconRight),
                                { key: 1, class: we(o.value) },
                                null,
                                8,
                                ["class"],
                              ))
                            : Se("", !0),
                      ]),
                    ],
                    16,
                    Cm,
                  ),
                ]),
                _: 3,
              },
              8,
              ["text", "disabled"],
            )
          )
        );
      },
    }),
    Ne = (e, t) => {
      const n = e.__vccOpts || e;
      for (const [r, s] of t) n[r] = s;
      return n;
    },
    Om = {},
    jm = { class: "spinner", viewBox: "0 0 50 50" };
  function Am(e, t) {
    return (
      M(),
      ee("svg", jm, [
        ...(t[0] ||
          (t[0] = [
            J(
              "defs",
              null,
              [
                J(
                  "linearGradient",
                  { id: "gradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
                  [
                    J("stop", {
                      offset: "0%",
                      "stop-color": "rgba(0,110,219,1)",
                    }),
                    J("stop", {
                      offset: "100%",
                      "stop-color": "rgba(255,255,255,0)",
                    }),
                  ],
                ),
              ],
              -1,
            ),
            J(
              "circle",
              {
                stroke: "url(#gradient)",
                class: "spinner-path",
                cx: "25",
                cy: "25",
                r: "20",
                fill: "none",
                "stroke-width": "5",
              },
              null,
              -1,
            ),
          ])),
      ])
    );
  }
  const km = Ne(Om, [
    ["render", Am],
    ["__scopeId", "data-v-5c03f65e"],
  ]);
  async function Mm(e, t, n = {}) {
    t || (t = {});
    let r = Object.assign(
      {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "X-Frappe-Site-Name": window.location.hostname,
      },
      n.headers || {},
    );
    window.csrf_token &&
      window.csrf_token !== "{{ csrf_token }}" &&
      (r["X-Frappe-CSRF-Token"] = window.csrf_token);
    let s = e.startsWith("/") ? e : `/api/method/${e}`;
    const i = await fetch(s, {
      method: "POST",
      headers: r,
      body: JSON.stringify(t),
    });
    if (i.ok) {
      const o = await i.json();
      if (o.docs || e === "login") return o;
      if (o.exc)
        try {
          (console.groupCollapsed(e),
            console.log(`method: ${e}`),
            console.log("params:", t));
          let l = JSON.parse(o.exc);
          for (let a of l) console.log(a);
          console.groupEnd();
        } catch (l) {
          console.warn("Error printing debug messages", l);
        }
      return o.message;
    } else {
      let o = await i.text(),
        l,
        a;
      try {
        l = JSON.parse(o);
      } catch {}
      let u = [[e, l.exc_type, l._error_message].filter(Boolean).join(" ")];
      if (l.exc) {
        a = l.exc;
        try {
          ((a = JSON.parse(a)[0]), console.log(a));
        } catch {}
      }
      let c = new Error(
        u.join(`
`),
      );
      throw (
        (c.exc_type = l.exc_type),
        (c.exc = a),
        (c.status = i.status),
        (c.messages = l._server_messages ? JSON.parse(l._server_messages) : []),
        (c.messages = c.messages.concat(l.message)),
        (c.messages = c.messages.map((f) => {
          try {
            return JSON.parse(f).message;
          } catch {
            return f;
          }
        })),
        (c.messages = c.messages.filter(Boolean)),
        c.messages.length ||
          (c.messages = l._error_message
            ? [l._error_message]
            : ["Internal Server Error"]),
        n.onError && n.onError({ response: i, status: i.status, error: c }),
        c
      );
    }
  }
  const Lt = Object.create(null);
  ((Lt.open = "0"),
    (Lt.close = "1"),
    (Lt.ping = "2"),
    (Lt.pong = "3"),
    (Lt.message = "4"),
    (Lt.upgrade = "5"),
    (Lt.noop = "6"));
  const Qs = Object.create(null);
  Object.keys(Lt).forEach((e) => {
    Qs[Lt[e]] = e;
  });
  const Ho = { type: "error", data: "parser error" },
    Mu =
      typeof Blob == "function" ||
      (typeof Blob < "u" &&
        Object.prototype.toString.call(Blob) === "[object BlobConstructor]"),
    Pu = typeof ArrayBuffer == "function",
    Ru = (e) =>
      typeof ArrayBuffer.isView == "function"
        ? ArrayBuffer.isView(e)
        : e && e.buffer instanceof ArrayBuffer,
    zo = ({ type: e, data: t }, n, r) =>
      Mu && t instanceof Blob
        ? n
          ? r(t)
          : Du(t, r)
        : Pu && (t instanceof ArrayBuffer || Ru(t))
          ? n
            ? r(t)
            : Du(new Blob([t]), r)
          : r(Lt[e] + (t || "")),
    Du = (e, t) => {
      const n = new FileReader();
      return (
        (n.onload = function () {
          const r = n.result.split(",")[1];
          t("b" + (r || ""));
        }),
        n.readAsDataURL(e)
      );
    };
  function $u(e) {
    return e instanceof Uint8Array
      ? e
      : e instanceof ArrayBuffer
        ? new Uint8Array(e)
        : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  }
  let Wo;
  function Pm(e, t) {
    if (Mu && e.data instanceof Blob)
      return e.data.arrayBuffer().then($u).then(t);
    if (Pu && (e.data instanceof ArrayBuffer || Ru(e.data)))
      return t($u(e.data));
    zo(e, !1, (n) => {
      (Wo || (Wo = new TextEncoder()), t(Wo.encode(n)));
    });
  }
  const Lu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    $r = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
  for (let e = 0; e < Lu.length; e++) $r[Lu.charCodeAt(e)] = e;
  const Rm = (e) => {
      let t = e.length * 0.75,
        n = e.length,
        r,
        s = 0,
        i,
        o,
        l,
        a;
      e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
      const u = new ArrayBuffer(t),
        c = new Uint8Array(u);
      for (r = 0; r < n; r += 4)
        ((i = $r[e.charCodeAt(r)]),
          (o = $r[e.charCodeAt(r + 1)]),
          (l = $r[e.charCodeAt(r + 2)]),
          (a = $r[e.charCodeAt(r + 3)]),
          (c[s++] = (i << 2) | (o >> 4)),
          (c[s++] = ((o & 15) << 4) | (l >> 2)),
          (c[s++] = ((l & 3) << 6) | (a & 63)));
      return u;
    },
    Dm = typeof ArrayBuffer == "function",
    Uo = (e, t) => {
      if (typeof e != "string") return { type: "message", data: Iu(e, t) };
      const n = e.charAt(0);
      return n === "b"
        ? { type: "message", data: $m(e.substring(1), t) }
        : Qs[n]
          ? e.length > 1
            ? { type: Qs[n], data: e.substring(1) }
            : { type: Qs[n] }
          : Ho;
    },
    $m = (e, t) => {
      if (Dm) {
        const n = Rm(e);
        return Iu(n, t);
      } else return { base64: !0, data: e };
    },
    Iu = (e, t) =>
      t === "blob"
        ? e instanceof Blob
          ? e
          : new Blob([e])
        : e instanceof ArrayBuffer
          ? e
          : e.buffer,
    Nu = "",
    Lm = (e, t) => {
      const n = e.length,
        r = new Array(n);
      let s = 0;
      e.forEach((i, o) => {
        zo(i, !1, (l) => {
          ((r[o] = l), ++s === n && t(r.join(Nu)));
        });
      });
    },
    Im = (e, t) => {
      const n = e.split(Nu),
        r = [];
      for (let s = 0; s < n.length; s++) {
        const i = Uo(n[s], t);
        if ((r.push(i), i.type === "error")) break;
      }
      return r;
    };
  function Nm() {
    return new TransformStream({
      transform(e, t) {
        Pm(e, (n) => {
          const r = n.length;
          let s;
          if (r < 126)
            ((s = new Uint8Array(1)), new DataView(s.buffer).setUint8(0, r));
          else if (r < 65536) {
            s = new Uint8Array(3);
            const i = new DataView(s.buffer);
            (i.setUint8(0, 126), i.setUint16(1, r));
          } else {
            s = new Uint8Array(9);
            const i = new DataView(s.buffer);
            (i.setUint8(0, 127), i.setBigUint64(1, BigInt(r)));
          }
          (e.data && typeof e.data != "string" && (s[0] |= 128),
            t.enqueue(s),
            t.enqueue(n));
        });
      },
    });
  }
  let Ko;
  function Zs(e) {
    return e.reduce((t, n) => t + n.length, 0);
  }
  function ei(e, t) {
    if (e[0].length === t) return e.shift();
    const n = new Uint8Array(t);
    let r = 0;
    for (let s = 0; s < t; s++)
      ((n[s] = e[0][r++]), r === e[0].length && (e.shift(), (r = 0)));
    return (e.length && r < e[0].length && (e[0] = e[0].slice(r)), n);
  }
  function Bm(e, t) {
    Ko || (Ko = new TextDecoder());
    const n = [];
    let r = 0,
      s = -1,
      i = !1;
    return new TransformStream({
      transform(o, l) {
        for (n.push(o); ; ) {
          if (r === 0) {
            if (Zs(n) < 1) break;
            const a = ei(n, 1);
            ((i = (a[0] & 128) === 128),
              (s = a[0] & 127),
              s < 126 ? (r = 3) : s === 126 ? (r = 1) : (r = 2));
          } else if (r === 1) {
            if (Zs(n) < 2) break;
            const a = ei(n, 2);
            ((s = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0)),
              (r = 3));
          } else if (r === 2) {
            if (Zs(n) < 8) break;
            const a = ei(n, 8),
              u = new DataView(a.buffer, a.byteOffset, a.length),
              c = u.getUint32(0);
            if (c > Math.pow(2, 21) - 1) {
              l.enqueue(Ho);
              break;
            }
            ((s = c * Math.pow(2, 32) + u.getUint32(4)), (r = 3));
          } else {
            if (Zs(n) < s) break;
            const a = ei(n, s);
            (l.enqueue(Uo(i ? a : Ko.decode(a), t)), (r = 0));
          }
          if (s === 0 || s > e) {
            l.enqueue(Ho);
            break;
          }
        }
      },
    });
  }
  const Bu = 4;
  function je(e) {
    if (e) return Fm(e);
  }
  function Fm(e) {
    for (var t in je.prototype) e[t] = je.prototype[t];
    return e;
  }
  ((je.prototype.on = je.prototype.addEventListener =
    function (e, t) {
      return (
        (this._callbacks = this._callbacks || {}),
        (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t),
        this
      );
    }),
    (je.prototype.once = function (e, t) {
      function n() {
        (this.off(e, n), t.apply(this, arguments));
      }
      return ((n.fn = t), this.on(e, n), this);
    }),
    (je.prototype.off =
      je.prototype.removeListener =
      je.prototype.removeAllListeners =
      je.prototype.removeEventListener =
        function (e, t) {
          if (
            ((this._callbacks = this._callbacks || {}), arguments.length == 0)
          )
            return ((this._callbacks = {}), this);
          var n = this._callbacks["$" + e];
          if (!n) return this;
          if (arguments.length == 1)
            return (delete this._callbacks["$" + e], this);
          for (var r, s = 0; s < n.length; s++)
            if (((r = n[s]), r === t || r.fn === t)) {
              n.splice(s, 1);
              break;
            }
          return (n.length === 0 && delete this._callbacks["$" + e], this);
        }),
    (je.prototype.emit = function (e) {
      this._callbacks = this._callbacks || {};
      for (
        var t = new Array(arguments.length - 1),
          n = this._callbacks["$" + e],
          r = 1;
        r < arguments.length;
        r++
      )
        t[r - 1] = arguments[r];
      if (n) {
        n = n.slice(0);
        for (var r = 0, s = n.length; r < s; ++r) n[r].apply(this, t);
      }
      return this;
    }),
    (je.prototype.emitReserved = je.prototype.emit),
    (je.prototype.listeners = function (e) {
      return (
        (this._callbacks = this._callbacks || {}),
        this._callbacks["$" + e] || []
      );
    }),
    (je.prototype.hasListeners = function (e) {
      return !!this.listeners(e).length;
    }));
  const ti =
      typeof Promise == "function" && typeof Promise.resolve == "function"
        ? (t) => Promise.resolve().then(t)
        : (t, n) => n(t, 0),
    ft =
      typeof self < "u"
        ? self
        : typeof window < "u"
          ? window
          : Function("return this")(),
    Vm = "arraybuffer";
  function _b() {}
  function Fu(e, ...t) {
    return t.reduce((n, r) => (e.hasOwnProperty(r) && (n[r] = e[r]), n), {});
  }
  const Hm = ft.setTimeout,
    zm = ft.clearTimeout;
  function ni(e, t) {
    t.useNativeTimers
      ? ((e.setTimeoutFn = Hm.bind(ft)), (e.clearTimeoutFn = zm.bind(ft)))
      : ((e.setTimeoutFn = ft.setTimeout.bind(ft)),
        (e.clearTimeoutFn = ft.clearTimeout.bind(ft)));
  }
  const Wm = 1.33;
  function Um(e) {
    return typeof e == "string"
      ? Km(e)
      : Math.ceil((e.byteLength || e.size) * Wm);
  }
  function Km(e) {
    let t = 0,
      n = 0;
    for (let r = 0, s = e.length; r < s; r++)
      ((t = e.charCodeAt(r)),
        t < 128
          ? (n += 1)
          : t < 2048
            ? (n += 2)
            : t < 55296 || t >= 57344
              ? (n += 3)
              : (r++, (n += 4)));
    return n;
  }
  function Vu() {
    return (
      Date.now().toString(36).substring(3) +
      Math.random().toString(36).substring(2, 5)
    );
  }
  function qm(e) {
    let t = "";
    for (let n in e)
      e.hasOwnProperty(n) &&
        (t.length && (t += "&"),
        (t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n])));
    return t;
  }
  function Gm(e) {
    let t = {},
      n = e.split("&");
    for (let r = 0, s = n.length; r < s; r++) {
      let i = n[r].split("=");
      t[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
    }
    return t;
  }
  class Ym extends Error {
    constructor(t, n, r) {
      (super(t),
        (this.description = n),
        (this.context = r),
        (this.type = "TransportError"));
    }
  }
  class qo extends je {
    constructor(t) {
      (super(),
        (this.writable = !1),
        ni(this, t),
        (this.opts = t),
        (this.query = t.query),
        (this.socket = t.socket),
        (this.supportsBinary = !t.forceBase64));
    }
    onError(t, n, r) {
      return (super.emitReserved("error", new Ym(t, n, r)), this);
    }
    open() {
      return ((this.readyState = "opening"), this.doOpen(), this);
    }
    close() {
      return (
        (this.readyState === "opening" || this.readyState === "open") &&
          (this.doClose(), this.onClose()),
        this
      );
    }
    send(t) {
      this.readyState === "open" && this.write(t);
    }
    onOpen() {
      ((this.readyState = "open"),
        (this.writable = !0),
        super.emitReserved("open"));
    }
    onData(t) {
      const n = Uo(t, this.socket.binaryType);
      this.onPacket(n);
    }
    onPacket(t) {
      super.emitReserved("packet", t);
    }
    onClose(t) {
      ((this.readyState = "closed"), super.emitReserved("close", t));
    }
    pause(t) {}
    createUri(t, n = {}) {
      return (
        t +
        "://" +
        this._hostname() +
        this._port() +
        this.opts.path +
        this._query(n)
      );
    }
    _hostname() {
      const t = this.opts.hostname;
      return t.indexOf(":") === -1 ? t : "[" + t + "]";
    }
    _port() {
      return this.opts.port &&
        ((this.opts.secure && Number(this.opts.port) !== 443) ||
          (!this.opts.secure && Number(this.opts.port) !== 80))
        ? ":" + this.opts.port
        : "";
    }
    _query(t) {
      const n = qm(t);
      return n.length ? "?" + n : "";
    }
  }
  class Jm extends qo {
    constructor() {
      (super(...arguments), (this._polling = !1));
    }
    get name() {
      return "polling";
    }
    doOpen() {
      this._poll();
    }
    pause(t) {
      this.readyState = "pausing";
      const n = () => {
        ((this.readyState = "paused"), t());
      };
      if (this._polling || !this.writable) {
        let r = 0;
        (this._polling &&
          (r++,
          this.once("pollComplete", function () {
            --r || n();
          })),
          this.writable ||
            (r++,
            this.once("drain", function () {
              --r || n();
            })));
      } else n();
    }
    _poll() {
      ((this._polling = !0), this.doPoll(), this.emitReserved("poll"));
    }
    onData(t) {
      const n = (r) => {
        if (
          (this.readyState === "opening" && r.type === "open" && this.onOpen(),
          r.type === "close")
        )
          return (
            this.onClose({ description: "transport closed by the server" }),
            !1
          );
        this.onPacket(r);
      };
      (Im(t, this.socket.binaryType).forEach(n),
        this.readyState !== "closed" &&
          ((this._polling = !1),
          this.emitReserved("pollComplete"),
          this.readyState === "open" && this._poll()));
    }
    doClose() {
      const t = () => {
        this.write([{ type: "close" }]);
      };
      this.readyState === "open" ? t() : this.once("open", t);
    }
    write(t) {
      ((this.writable = !1),
        Lm(t, (n) => {
          this.doWrite(n, () => {
            ((this.writable = !0), this.emitReserved("drain"));
          });
        }));
    }
    uri() {
      const t = this.opts.secure ? "https" : "http",
        n = this.query || {};
      return (
        this.opts.timestampRequests !== !1 &&
          (n[this.opts.timestampParam] = Vu()),
        !this.supportsBinary && !n.sid && (n.b64 = 1),
        this.createUri(t, n)
      );
    }
  }
  let Hu = !1;
  try {
    Hu =
      typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
  } catch {}
  const Xm = Hu;
  function Qm() {}
  class Zm extends Jm {
    constructor(t) {
      if ((super(t), typeof location < "u")) {
        const n = location.protocol === "https:";
        let r = location.port;
        (r || (r = n ? "443" : "80"),
          (this.xd =
            (typeof location < "u" && t.hostname !== location.hostname) ||
            r !== t.port));
      }
    }
    doWrite(t, n) {
      const r = this.request({ method: "POST", data: t });
      (r.on("success", n),
        r.on("error", (s, i) => {
          this.onError("xhr post error", s, i);
        }));
    }
    doPoll() {
      const t = this.request();
      (t.on("data", this.onData.bind(this)),
        t.on("error", (n, r) => {
          this.onError("xhr poll error", n, r);
        }),
        (this.pollXhr = t));
    }
  }
  class It extends je {
    constructor(t, n, r) {
      (super(),
        (this.createRequest = t),
        ni(this, r),
        (this._opts = r),
        (this._method = r.method || "GET"),
        (this._uri = n),
        (this._data = r.data !== void 0 ? r.data : null),
        this._create());
    }
    _create() {
      var t;
      const n = Fu(
        this._opts,
        "agent",
        "pfx",
        "key",
        "passphrase",
        "cert",
        "ca",
        "ciphers",
        "rejectUnauthorized",
        "autoUnref",
      );
      n.xdomain = !!this._opts.xd;
      const r = (this._xhr = this.createRequest(n));
      try {
        r.open(this._method, this._uri, !0);
        try {
          if (this._opts.extraHeaders) {
            r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
            for (let s in this._opts.extraHeaders)
              this._opts.extraHeaders.hasOwnProperty(s) &&
                r.setRequestHeader(s, this._opts.extraHeaders[s]);
          }
        } catch {}
        if (this._method === "POST")
          try {
            r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
          } catch {}
        try {
          r.setRequestHeader("Accept", "*/*");
        } catch {}
        ((t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(r),
          "withCredentials" in r &&
            (r.withCredentials = this._opts.withCredentials),
          this._opts.requestTimeout && (r.timeout = this._opts.requestTimeout),
          (r.onreadystatechange = () => {
            var s;
            (r.readyState === 3 &&
              ((s = this._opts.cookieJar) === null ||
                s === void 0 ||
                s.parseCookies(r.getResponseHeader("set-cookie"))),
              r.readyState === 4 &&
                (r.status === 200 || r.status === 1223
                  ? this._onLoad()
                  : this.setTimeoutFn(() => {
                      this._onError(typeof r.status == "number" ? r.status : 0);
                    }, 0)));
          }),
          r.send(this._data));
      } catch (s) {
        this.setTimeoutFn(() => {
          this._onError(s);
        }, 0);
        return;
      }
      typeof document < "u" &&
        ((this._index = It.requestsCount++), (It.requests[this._index] = this));
    }
    _onError(t) {
      (this.emitReserved("error", t, this._xhr), this._cleanup(!0));
    }
    _cleanup(t) {
      if (!(typeof this._xhr > "u" || this._xhr === null)) {
        if (((this._xhr.onreadystatechange = Qm), t))
          try {
            this._xhr.abort();
          } catch {}
        (typeof document < "u" && delete It.requests[this._index],
          (this._xhr = null));
      }
    }
    _onLoad() {
      const t = this._xhr.responseText;
      t !== null &&
        (this.emitReserved("data", t),
        this.emitReserved("success"),
        this._cleanup());
    }
    abort() {
      this._cleanup();
    }
  }
  if (((It.requestsCount = 0), (It.requests = {}), typeof document < "u")) {
    if (typeof attachEvent == "function") attachEvent("onunload", zu);
    else if (typeof addEventListener == "function") {
      const e = "onpagehide" in ft ? "pagehide" : "unload";
      addEventListener(e, zu, !1);
    }
  }
  function zu() {
    for (let e in It.requests)
      It.requests.hasOwnProperty(e) && It.requests[e].abort();
  }
  const e2 = (function () {
    const e = Wu({ xdomain: !1 });
    return e && e.responseType !== null;
  })();
  class t2 extends Zm {
    constructor(t) {
      super(t);
      const n = t && t.forceBase64;
      this.supportsBinary = e2 && !n;
    }
    request(t = {}) {
      return (
        Object.assign(t, { xd: this.xd }, this.opts),
        new It(Wu, this.uri(), t)
      );
    }
  }
  function Wu(e) {
    const t = e.xdomain;
    try {
      if (typeof XMLHttpRequest < "u" && (!t || Xm))
        return new XMLHttpRequest();
    } catch {}
    if (!t)
      try {
        return new ft[["Active"].concat("Object").join("X")](
          "Microsoft.XMLHTTP",
        );
      } catch {}
  }
  const Uu =
    typeof navigator < "u" &&
    typeof navigator.product == "string" &&
    navigator.product.toLowerCase() === "reactnative";
  class n2 extends qo {
    get name() {
      return "websocket";
    }
    doOpen() {
      const t = this.uri(),
        n = this.opts.protocols,
        r = Uu
          ? {}
          : Fu(
              this.opts,
              "agent",
              "perMessageDeflate",
              "pfx",
              "key",
              "passphrase",
              "cert",
              "ca",
              "ciphers",
              "rejectUnauthorized",
              "localAddress",
              "protocolVersion",
              "origin",
              "maxPayload",
              "family",
              "checkServerIdentity",
            );
      this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
      try {
        this.ws = this.createSocket(t, n, r);
      } catch (s) {
        return this.emitReserved("error", s);
      }
      ((this.ws.binaryType = this.socket.binaryType), this.addEventListeners());
    }
    addEventListeners() {
      ((this.ws.onopen = () => {
        (this.opts.autoUnref && this.ws._socket.unref(), this.onOpen());
      }),
        (this.ws.onclose = (t) =>
          this.onClose({
            description: "websocket connection closed",
            context: t,
          })),
        (this.ws.onmessage = (t) => this.onData(t.data)),
        (this.ws.onerror = (t) => this.onError("websocket error", t)));
    }
    write(t) {
      this.writable = !1;
      for (let n = 0; n < t.length; n++) {
        const r = t[n],
          s = n === t.length - 1;
        zo(r, this.supportsBinary, (i) => {
          try {
            this.doWrite(r, i);
          } catch {}
          s &&
            ti(() => {
              ((this.writable = !0), this.emitReserved("drain"));
            }, this.setTimeoutFn);
        });
      }
    }
    doClose() {
      typeof this.ws < "u" &&
        ((this.ws.onerror = () => {}), this.ws.close(), (this.ws = null));
    }
    uri() {
      const t = this.opts.secure ? "wss" : "ws",
        n = this.query || {};
      return (
        this.opts.timestampRequests && (n[this.opts.timestampParam] = Vu()),
        this.supportsBinary || (n.b64 = 1),
        this.createUri(t, n)
      );
    }
  }
  const Go = ft.WebSocket || ft.MozWebSocket;
  class r2 extends n2 {
    createSocket(t, n, r) {
      return Uu ? new Go(t, n, r) : n ? new Go(t, n) : new Go(t);
    }
    doWrite(t, n) {
      this.ws.send(n);
    }
  }
  class s2 extends qo {
    get name() {
      return "webtransport";
    }
    doOpen() {
      try {
        this._transport = new WebTransport(
          this.createUri("https"),
          this.opts.transportOptions[this.name],
        );
      } catch (t) {
        return this.emitReserved("error", t);
      }
      (this._transport.closed
        .then(() => {
          this.onClose();
        })
        .catch((t) => {
          this.onError("webtransport error", t);
        }),
        this._transport.ready.then(() => {
          this._transport.createBidirectionalStream().then((t) => {
            const n = Bm(Number.MAX_SAFE_INTEGER, this.socket.binaryType),
              r = t.readable.pipeThrough(n).getReader(),
              s = Nm();
            (s.readable.pipeTo(t.writable),
              (this._writer = s.writable.getWriter()));
            const i = () => {
              r.read()
                .then(({ done: l, value: a }) => {
                  l || (this.onPacket(a), i());
                })
                .catch((l) => {});
            };
            i();
            const o = { type: "open" };
            (this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`),
              this._writer.write(o).then(() => this.onOpen()));
          });
        }));
    }
    write(t) {
      this.writable = !1;
      for (let n = 0; n < t.length; n++) {
        const r = t[n],
          s = n === t.length - 1;
        this._writer.write(r).then(() => {
          s &&
            ti(() => {
              ((this.writable = !0), this.emitReserved("drain"));
            }, this.setTimeoutFn);
        });
      }
    }
    doClose() {
      var t;
      (t = this._transport) === null || t === void 0 || t.close();
    }
  }
  const i2 = { websocket: r2, webtransport: s2, polling: t2 },
    o2 =
      /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
    l2 = [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor",
    ];
  function Yo(e) {
    if (e.length > 8e3) throw "URI too long";
    const t = e,
      n = e.indexOf("["),
      r = e.indexOf("]");
    n != -1 &&
      r != -1 &&
      (e =
        e.substring(0, n) +
        e.substring(n, r).replace(/:/g, ";") +
        e.substring(r, e.length));
    let s = o2.exec(e || ""),
      i = {},
      o = 14;
    for (; o--; ) i[l2[o]] = s[o] || "";
    return (
      n != -1 &&
        r != -1 &&
        ((i.source = t),
        (i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":")),
        (i.authority = i.authority
          .replace("[", "")
          .replace("]", "")
          .replace(/;/g, ":")),
        (i.ipv6uri = !0)),
      (i.pathNames = a2(i, i.path)),
      (i.queryKey = c2(i, i.query)),
      i
    );
  }
  function a2(e, t) {
    const n = /\/{2,9}/g,
      r = t.replace(n, "/").split("/");
    return (
      (t.slice(0, 1) == "/" || t.length === 0) && r.splice(0, 1),
      t.slice(-1) == "/" && r.splice(r.length - 1, 1),
      r
    );
  }
  function c2(e, t) {
    const n = {};
    return (
      t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (r, s, i) {
        s && (n[s] = i);
      }),
      n
    );
  }
  const Jo =
      typeof addEventListener == "function" &&
      typeof removeEventListener == "function",
    ri = [];
  Jo &&
    addEventListener(
      "offline",
      () => {
        ri.forEach((e) => e());
      },
      !1,
    );
  class pn extends je {
    constructor(t, n) {
      if (
        (super(),
        (this.binaryType = Vm),
        (this.writeBuffer = []),
        (this._prevBufferLen = 0),
        (this._pingInterval = -1),
        (this._pingTimeout = -1),
        (this._maxPayload = -1),
        (this._pingTimeoutTime = 1 / 0),
        t && typeof t == "object" && ((n = t), (t = null)),
        t)
      ) {
        const r = Yo(t);
        ((n.hostname = r.host),
          (n.secure = r.protocol === "https" || r.protocol === "wss"),
          (n.port = r.port),
          r.query && (n.query = r.query));
      } else n.host && (n.hostname = Yo(n.host).host);
      (ni(this, n),
        (this.secure =
          n.secure != null
            ? n.secure
            : typeof location < "u" && location.protocol === "https:"),
        n.hostname && !n.port && (n.port = this.secure ? "443" : "80"),
        (this.hostname =
          n.hostname ||
          (typeof location < "u" ? location.hostname : "localhost")),
        (this.port =
          n.port ||
          (typeof location < "u" && location.port
            ? location.port
            : this.secure
              ? "443"
              : "80")),
        (this.transports = []),
        (this._transportsByName = {}),
        n.transports.forEach((r) => {
          const s = r.prototype.name;
          (this.transports.push(s), (this._transportsByName[s] = r));
        }),
        (this.opts = Object.assign(
          {
            path: "/engine.io",
            agent: !1,
            withCredentials: !1,
            upgrade: !0,
            timestampParam: "t",
            rememberUpgrade: !1,
            addTrailingSlash: !0,
            rejectUnauthorized: !0,
            perMessageDeflate: { threshold: 1024 },
            transportOptions: {},
            closeOnBeforeunload: !1,
          },
          n,
        )),
        (this.opts.path =
          this.opts.path.replace(/\/$/, "") +
          (this.opts.addTrailingSlash ? "/" : "")),
        typeof this.opts.query == "string" &&
          (this.opts.query = Gm(this.opts.query)),
        Jo &&
          (this.opts.closeOnBeforeunload &&
            ((this._beforeunloadEventListener = () => {
              this.transport &&
                (this.transport.removeAllListeners(), this.transport.close());
            }),
            addEventListener(
              "beforeunload",
              this._beforeunloadEventListener,
              !1,
            )),
          this.hostname !== "localhost" &&
            ((this._offlineEventListener = () => {
              this._onClose("transport close", {
                description: "network connection lost",
              });
            }),
            ri.push(this._offlineEventListener))),
        this.opts.withCredentials && (this._cookieJar = void 0),
        this._open());
    }
    createTransport(t) {
      const n = Object.assign({}, this.opts.query);
      ((n.EIO = Bu), (n.transport = t), this.id && (n.sid = this.id));
      const r = Object.assign(
        {},
        this.opts,
        {
          query: n,
          socket: this,
          hostname: this.hostname,
          secure: this.secure,
          port: this.port,
        },
        this.opts.transportOptions[t],
      );
      return new this._transportsByName[t](r);
    }
    _open() {
      if (this.transports.length === 0) {
        this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
        return;
      }
      const t =
        this.opts.rememberUpgrade &&
        pn.priorWebsocketSuccess &&
        this.transports.indexOf("websocket") !== -1
          ? "websocket"
          : this.transports[0];
      this.readyState = "opening";
      const n = this.createTransport(t);
      (n.open(), this.setTransport(n));
    }
    setTransport(t) {
      (this.transport && this.transport.removeAllListeners(),
        (this.transport = t),
        t
          .on("drain", this._onDrain.bind(this))
          .on("packet", this._onPacket.bind(this))
          .on("error", this._onError.bind(this))
          .on("close", (n) => this._onClose("transport close", n)));
    }
    onOpen() {
      ((this.readyState = "open"),
        (pn.priorWebsocketSuccess = this.transport.name === "websocket"),
        this.emitReserved("open"),
        this.flush());
    }
    _onPacket(t) {
      if (
        this.readyState === "opening" ||
        this.readyState === "open" ||
        this.readyState === "closing"
      )
        switch (
          (this.emitReserved("packet", t),
          this.emitReserved("heartbeat"),
          t.type)
        ) {
          case "open":
            this.onHandshake(JSON.parse(t.data));
            break;
          case "ping":
            (this._sendPacket("pong"),
              this.emitReserved("ping"),
              this.emitReserved("pong"),
              this._resetPingTimeout());
            break;
          case "error":
            const n = new Error("server error");
            ((n.code = t.data), this._onError(n));
            break;
          case "message":
            (this.emitReserved("data", t.data),
              this.emitReserved("message", t.data));
            break;
        }
    }
    onHandshake(t) {
      (this.emitReserved("handshake", t),
        (this.id = t.sid),
        (this.transport.query.sid = t.sid),
        (this._pingInterval = t.pingInterval),
        (this._pingTimeout = t.pingTimeout),
        (this._maxPayload = t.maxPayload),
        this.onOpen(),
        this.readyState !== "closed" && this._resetPingTimeout());
    }
    _resetPingTimeout() {
      this.clearTimeoutFn(this._pingTimeoutTimer);
      const t = this._pingInterval + this._pingTimeout;
      ((this._pingTimeoutTime = Date.now() + t),
        (this._pingTimeoutTimer = this.setTimeoutFn(() => {
          this._onClose("ping timeout");
        }, t)),
        this.opts.autoUnref && this._pingTimeoutTimer.unref());
    }
    _onDrain() {
      (this.writeBuffer.splice(0, this._prevBufferLen),
        (this._prevBufferLen = 0),
        this.writeBuffer.length === 0
          ? this.emitReserved("drain")
          : this.flush());
    }
    flush() {
      if (
        this.readyState !== "closed" &&
        this.transport.writable &&
        !this.upgrading &&
        this.writeBuffer.length
      ) {
        const t = this._getWritablePackets();
        (this.transport.send(t),
          (this._prevBufferLen = t.length),
          this.emitReserved("flush"));
      }
    }
    _getWritablePackets() {
      if (
        !(
          this._maxPayload &&
          this.transport.name === "polling" &&
          this.writeBuffer.length > 1
        )
      )
        return this.writeBuffer;
      let n = 1;
      for (let r = 0; r < this.writeBuffer.length; r++) {
        const s = this.writeBuffer[r].data;
        if ((s && (n += Um(s)), r > 0 && n > this._maxPayload))
          return this.writeBuffer.slice(0, r);
        n += 2;
      }
      return this.writeBuffer;
    }
    _hasPingExpired() {
      if (!this._pingTimeoutTime) return !0;
      const t = Date.now() > this._pingTimeoutTime;
      return (
        t &&
          ((this._pingTimeoutTime = 0),
          ti(() => {
            this._onClose("ping timeout");
          }, this.setTimeoutFn)),
        t
      );
    }
    write(t, n, r) {
      return (this._sendPacket("message", t, n, r), this);
    }
    send(t, n, r) {
      return (this._sendPacket("message", t, n, r), this);
    }
    _sendPacket(t, n, r, s) {
      if (
        (typeof n == "function" && ((s = n), (n = void 0)),
        typeof r == "function" && ((s = r), (r = null)),
        this.readyState === "closing" || this.readyState === "closed")
      )
        return;
      ((r = r || {}), (r.compress = r.compress !== !1));
      const i = { type: t, data: n, options: r };
      (this.emitReserved("packetCreate", i),
        this.writeBuffer.push(i),
        s && this.once("flush", s),
        this.flush());
    }
    close() {
      const t = () => {
          (this._onClose("forced close"), this.transport.close());
        },
        n = () => {
          (this.off("upgrade", n), this.off("upgradeError", n), t());
        },
        r = () => {
          (this.once("upgrade", n), this.once("upgradeError", n));
        };
      return (
        (this.readyState === "opening" || this.readyState === "open") &&
          ((this.readyState = "closing"),
          this.writeBuffer.length
            ? this.once("drain", () => {
                this.upgrading ? r() : t();
              })
            : this.upgrading
              ? r()
              : t()),
        this
      );
    }
    _onError(t) {
      if (
        ((pn.priorWebsocketSuccess = !1),
        this.opts.tryAllTransports &&
          this.transports.length > 1 &&
          this.readyState === "opening")
      )
        return (this.transports.shift(), this._open());
      (this.emitReserved("error", t), this._onClose("transport error", t));
    }
    _onClose(t, n) {
      if (
        this.readyState === "opening" ||
        this.readyState === "open" ||
        this.readyState === "closing"
      ) {
        if (
          (this.clearTimeoutFn(this._pingTimeoutTimer),
          this.transport.removeAllListeners("close"),
          this.transport.close(),
          this.transport.removeAllListeners(),
          Jo &&
            (this._beforeunloadEventListener &&
              removeEventListener(
                "beforeunload",
                this._beforeunloadEventListener,
                !1,
              ),
            this._offlineEventListener))
        ) {
          const r = ri.indexOf(this._offlineEventListener);
          r !== -1 && ri.splice(r, 1);
        }
        ((this.readyState = "closed"),
          (this.id = null),
          this.emitReserved("close", t, n),
          (this.writeBuffer = []),
          (this._prevBufferLen = 0));
      }
    }
  }
  pn.protocol = Bu;
  class u2 extends pn {
    constructor() {
      (super(...arguments), (this._upgrades = []));
    }
    onOpen() {
      if ((super.onOpen(), this.readyState === "open" && this.opts.upgrade))
        for (let t = 0; t < this._upgrades.length; t++)
          this._probe(this._upgrades[t]);
    }
    _probe(t) {
      let n = this.createTransport(t),
        r = !1;
      pn.priorWebsocketSuccess = !1;
      const s = () => {
        r ||
          (n.send([{ type: "ping", data: "probe" }]),
          n.once("packet", (f) => {
            if (!r)
              if (f.type === "pong" && f.data === "probe") {
                if (
                  ((this.upgrading = !0), this.emitReserved("upgrading", n), !n)
                )
                  return;
                ((pn.priorWebsocketSuccess = n.name === "websocket"),
                  this.transport.pause(() => {
                    r ||
                      (this.readyState !== "closed" &&
                        (c(),
                        this.setTransport(n),
                        n.send([{ type: "upgrade" }]),
                        this.emitReserved("upgrade", n),
                        (n = null),
                        (this.upgrading = !1),
                        this.flush()));
                  }));
              } else {
                const d = new Error("probe error");
                ((d.transport = n.name), this.emitReserved("upgradeError", d));
              }
          }));
      };
      function i() {
        r || ((r = !0), c(), n.close(), (n = null));
      }
      const o = (f) => {
        const d = new Error("probe error: " + f);
        ((d.transport = n.name), i(), this.emitReserved("upgradeError", d));
      };
      function l() {
        o("transport closed");
      }
      function a() {
        o("socket closed");
      }
      function u(f) {
        n && f.name !== n.name && i();
      }
      const c = () => {
        (n.removeListener("open", s),
          n.removeListener("error", o),
          n.removeListener("close", l),
          this.off("close", a),
          this.off("upgrading", u));
      };
      (n.once("open", s),
        n.once("error", o),
        n.once("close", l),
        this.once("close", a),
        this.once("upgrading", u),
        this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport"
          ? this.setTimeoutFn(() => {
              r || n.open();
            }, 200)
          : n.open());
    }
    onHandshake(t) {
      ((this._upgrades = this._filterUpgrades(t.upgrades)),
        super.onHandshake(t));
    }
    _filterUpgrades(t) {
      const n = [];
      for (let r = 0; r < t.length; r++)
        ~this.transports.indexOf(t[r]) && n.push(t[r]);
      return n;
    }
  }
  let f2 = class extends u2 {
    constructor(t, n = {}) {
      const r = typeof t == "object" ? t : n;
      ((!r.transports ||
        (r.transports && typeof r.transports[0] == "string")) &&
        (r.transports = (
          r.transports || ["polling", "websocket", "webtransport"]
        )
          .map((s) => i2[s])
          .filter((s) => !!s)),
        super(t, r));
    }
  };
  function d2(e, t = "", n) {
    let r = e;
    ((n = n || (typeof location < "u" && location)),
      e == null && (e = n.protocol + "//" + n.host),
      typeof e == "string" &&
        (e.charAt(0) === "/" &&
          (e.charAt(1) === "/" ? (e = n.protocol + e) : (e = n.host + e)),
        /^(https?|wss?):\/\//.test(e) ||
          (typeof n < "u" ? (e = n.protocol + "//" + e) : (e = "https://" + e)),
        (r = Yo(e))),
      r.port ||
        (/^(http|ws)$/.test(r.protocol)
          ? (r.port = "80")
          : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
      (r.path = r.path || "/"));
    const i = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
    return (
      (r.id = r.protocol + "://" + i + ":" + r.port + t),
      (r.href =
        r.protocol + "://" + i + (n && n.port === r.port ? "" : ":" + r.port)),
      r
    );
  }
  const h2 = typeof ArrayBuffer == "function",
    p2 = (e) =>
      typeof ArrayBuffer.isView == "function"
        ? ArrayBuffer.isView(e)
        : e.buffer instanceof ArrayBuffer,
    Ku = Object.prototype.toString,
    y2 =
      typeof Blob == "function" ||
      (typeof Blob < "u" && Ku.call(Blob) === "[object BlobConstructor]"),
    g2 =
      typeof File == "function" ||
      (typeof File < "u" && Ku.call(File) === "[object FileConstructor]");
  function Xo(e) {
    return (
      (h2 && (e instanceof ArrayBuffer || p2(e))) ||
      (y2 && e instanceof Blob) ||
      (g2 && e instanceof File)
    );
  }
  function si(e, t) {
    if (!e || typeof e != "object") return !1;
    if (Array.isArray(e)) {
      for (let n = 0, r = e.length; n < r; n++) if (si(e[n])) return !0;
      return !1;
    }
    if (Xo(e)) return !0;
    if (e.toJSON && typeof e.toJSON == "function" && arguments.length === 1)
      return si(e.toJSON(), !0);
    for (const n in e)
      if (Object.prototype.hasOwnProperty.call(e, n) && si(e[n])) return !0;
    return !1;
  }
  function m2(e) {
    const t = [],
      n = e.data,
      r = e;
    return (
      (r.data = Qo(n, t)),
      (r.attachments = t.length),
      { packet: r, buffers: t }
    );
  }
  function Qo(e, t) {
    if (!e) return e;
    if (Xo(e)) {
      const n = { _placeholder: !0, num: t.length };
      return (t.push(e), n);
    } else if (Array.isArray(e)) {
      const n = new Array(e.length);
      for (let r = 0; r < e.length; r++) n[r] = Qo(e[r], t);
      return n;
    } else if (typeof e == "object" && !(e instanceof Date)) {
      const n = {};
      for (const r in e)
        Object.prototype.hasOwnProperty.call(e, r) && (n[r] = Qo(e[r], t));
      return n;
    }
    return e;
  }
  function v2(e, t) {
    return ((e.data = Zo(e.data, t)), delete e.attachments, e);
  }
  function Zo(e, t) {
    if (!e) return e;
    if (e && e._placeholder === !0) {
      if (typeof e.num == "number" && e.num >= 0 && e.num < t.length)
        return t[e.num];
      throw new Error("illegal attachments");
    } else if (Array.isArray(e))
      for (let n = 0; n < e.length; n++) e[n] = Zo(e[n], t);
    else if (typeof e == "object")
      for (const n in e)
        Object.prototype.hasOwnProperty.call(e, n) && (e[n] = Zo(e[n], t));
    return e;
  }
  const qu = [
      "connect",
      "connect_error",
      "disconnect",
      "disconnecting",
      "newListener",
      "removeListener",
    ],
    b2 = 5;
  var ie;
  (function (e) {
    ((e[(e.CONNECT = 0)] = "CONNECT"),
      (e[(e.DISCONNECT = 1)] = "DISCONNECT"),
      (e[(e.EVENT = 2)] = "EVENT"),
      (e[(e.ACK = 3)] = "ACK"),
      (e[(e.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
      (e[(e.BINARY_EVENT = 5)] = "BINARY_EVENT"),
      (e[(e.BINARY_ACK = 6)] = "BINARY_ACK"));
  })(ie || (ie = {}));
  class x2 {
    constructor(t) {
      this.replacer = t;
    }
    encode(t) {
      return (t.type === ie.EVENT || t.type === ie.ACK) && si(t)
        ? this.encodeAsBinary({
            type: t.type === ie.EVENT ? ie.BINARY_EVENT : ie.BINARY_ACK,
            nsp: t.nsp,
            data: t.data,
            id: t.id,
          })
        : [this.encodeAsString(t)];
    }
    encodeAsString(t) {
      let n = "" + t.type;
      return (
        (t.type === ie.BINARY_EVENT || t.type === ie.BINARY_ACK) &&
          (n += t.attachments + "-"),
        t.nsp && t.nsp !== "/" && (n += t.nsp + ","),
        t.id != null && (n += t.id),
        t.data != null && (n += JSON.stringify(t.data, this.replacer)),
        n
      );
    }
    encodeAsBinary(t) {
      const n = m2(t),
        r = this.encodeAsString(n.packet),
        s = n.buffers;
      return (s.unshift(r), s);
    }
  }
  class el extends je {
    constructor(t) {
      (super(), (this.reviver = t));
    }
    add(t) {
      let n;
      if (typeof t == "string") {
        if (this.reconstructor)
          throw new Error("got plaintext data when reconstructing a packet");
        n = this.decodeString(t);
        const r = n.type === ie.BINARY_EVENT;
        r || n.type === ie.BINARY_ACK
          ? ((n.type = r ? ie.EVENT : ie.ACK),
            (this.reconstructor = new w2(n)),
            n.attachments === 0 && super.emitReserved("decoded", n))
          : super.emitReserved("decoded", n);
      } else if (Xo(t) || t.base64)
        if (this.reconstructor)
          ((n = this.reconstructor.takeBinaryData(t)),
            n &&
              ((this.reconstructor = null), super.emitReserved("decoded", n)));
        else
          throw new Error("got binary data when not reconstructing a packet");
      else throw new Error("Unknown type: " + t);
    }
    decodeString(t) {
      let n = 0;
      const r = { type: Number(t.charAt(0)) };
      if (ie[r.type] === void 0)
        throw new Error("unknown packet type " + r.type);
      if (r.type === ie.BINARY_EVENT || r.type === ie.BINARY_ACK) {
        const i = n + 1;
        for (; t.charAt(++n) !== "-" && n != t.length; );
        const o = t.substring(i, n);
        if (o != Number(o) || t.charAt(n) !== "-")
          throw new Error("Illegal attachments");
        r.attachments = Number(o);
      }
      if (t.charAt(n + 1) === "/") {
        const i = n + 1;
        for (; ++n && !(t.charAt(n) === "," || n === t.length); );
        r.nsp = t.substring(i, n);
      } else r.nsp = "/";
      const s = t.charAt(n + 1);
      if (s !== "" && Number(s) == s) {
        const i = n + 1;
        for (; ++n; ) {
          const o = t.charAt(n);
          if (o == null || Number(o) != o) {
            --n;
            break;
          }
          if (n === t.length) break;
        }
        r.id = Number(t.substring(i, n + 1));
      }
      if (t.charAt(++n)) {
        const i = this.tryParse(t.substr(n));
        if (el.isPayloadValid(r.type, i)) r.data = i;
        else throw new Error("invalid payload");
      }
      return r;
    }
    tryParse(t) {
      try {
        return JSON.parse(t, this.reviver);
      } catch {
        return !1;
      }
    }
    static isPayloadValid(t, n) {
      switch (t) {
        case ie.CONNECT:
          return ii(n);
        case ie.DISCONNECT:
          return n === void 0;
        case ie.CONNECT_ERROR:
          return typeof n == "string" || ii(n);
        case ie.EVENT:
        case ie.BINARY_EVENT:
          return (
            Array.isArray(n) &&
            (typeof n[0] == "number" ||
              (typeof n[0] == "string" && qu.indexOf(n[0]) === -1))
          );
        case ie.ACK:
        case ie.BINARY_ACK:
          return Array.isArray(n);
      }
    }
    destroy() {
      this.reconstructor &&
        (this.reconstructor.finishedReconstruction(),
        (this.reconstructor = null));
    }
  }
  class w2 {
    constructor(t) {
      ((this.packet = t), (this.buffers = []), (this.reconPack = t));
    }
    takeBinaryData(t) {
      if (
        (this.buffers.push(t),
        this.buffers.length === this.reconPack.attachments)
      ) {
        const n = v2(this.reconPack, this.buffers);
        return (this.finishedReconstruction(), n);
      }
      return null;
    }
    finishedReconstruction() {
      ((this.reconPack = null), (this.buffers = []));
    }
  }
  function _2(e) {
    return typeof e == "string";
  }
  const S2 =
    Number.isInteger ||
    function (e) {
      return typeof e == "number" && isFinite(e) && Math.floor(e) === e;
    };
  function E2(e) {
    return e === void 0 || S2(e);
  }
  function ii(e) {
    return Object.prototype.toString.call(e) === "[object Object]";
  }
  function C2(e, t) {
    switch (e) {
      case ie.CONNECT:
        return t === void 0 || ii(t);
      case ie.DISCONNECT:
        return t === void 0;
      case ie.EVENT:
        return (
          Array.isArray(t) &&
          (typeof t[0] == "number" ||
            (typeof t[0] == "string" && qu.indexOf(t[0]) === -1))
        );
      case ie.ACK:
        return Array.isArray(t);
      case ie.CONNECT_ERROR:
        return typeof t == "string" || ii(t);
      default:
        return !1;
    }
  }
  function T2(e) {
    return _2(e.nsp) && E2(e.id) && C2(e.type, e.data);
  }
  const O2 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        Decoder: el,
        Encoder: x2,
        get PacketType() {
          return ie;
        },
        isPacketValid: T2,
        protocol: b2,
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
  function bt(e, t, n) {
    return (
      e.on(t, n),
      function () {
        e.off(t, n);
      }
    );
  }
  const j2 = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    newListener: 1,
    removeListener: 1,
  });
  class Gu extends je {
    constructor(t, n, r) {
      (super(),
        (this.connected = !1),
        (this.recovered = !1),
        (this.receiveBuffer = []),
        (this.sendBuffer = []),
        (this._queue = []),
        (this._queueSeq = 0),
        (this.ids = 0),
        (this.acks = {}),
        (this.flags = {}),
        (this.io = t),
        (this.nsp = n),
        r && r.auth && (this.auth = r.auth),
        (this._opts = Object.assign({}, r)),
        this.io._autoConnect && this.open());
    }
    get disconnected() {
      return !this.connected;
    }
    subEvents() {
      if (this.subs) return;
      const t = this.io;
      this.subs = [
        bt(t, "open", this.onopen.bind(this)),
        bt(t, "packet", this.onpacket.bind(this)),
        bt(t, "error", this.onerror.bind(this)),
        bt(t, "close", this.onclose.bind(this)),
      ];
    }
    get active() {
      return !!this.subs;
    }
    connect() {
      return this.connected
        ? this
        : (this.subEvents(),
          this.io._reconnecting || this.io.open(),
          this.io._readyState === "open" && this.onopen(),
          this);
    }
    open() {
      return this.connect();
    }
    send(...t) {
      return (t.unshift("message"), this.emit.apply(this, t), this);
    }
    emit(t, ...n) {
      var r, s, i;
      if (j2.hasOwnProperty(t))
        throw new Error('"' + t.toString() + '" is a reserved event name');
      if (
        (n.unshift(t),
        this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      )
        return (this._addToQueue(n), this);
      const o = { type: ie.EVENT, data: n };
      if (
        ((o.options = {}),
        (o.options.compress = this.flags.compress !== !1),
        typeof n[n.length - 1] == "function")
      ) {
        const c = this.ids++,
          f = n.pop();
        (this._registerAckCallback(c, f), (o.id = c));
      }
      const l =
          (s =
            (r = this.io.engine) === null || r === void 0
              ? void 0
              : r.transport) === null || s === void 0
            ? void 0
            : s.writable,
        a =
          this.connected &&
          !(
            !((i = this.io.engine) === null || i === void 0) &&
            i._hasPingExpired()
          );
      return (
        (this.flags.volatile && !l) ||
          (a
            ? (this.notifyOutgoingListeners(o), this.packet(o))
            : this.sendBuffer.push(o)),
        (this.flags = {}),
        this
      );
    }
    _registerAckCallback(t, n) {
      var r;
      const s =
        (r = this.flags.timeout) !== null && r !== void 0
          ? r
          : this._opts.ackTimeout;
      if (s === void 0) {
        this.acks[t] = n;
        return;
      }
      const i = this.io.setTimeoutFn(() => {
          delete this.acks[t];
          for (let l = 0; l < this.sendBuffer.length; l++)
            this.sendBuffer[l].id === t && this.sendBuffer.splice(l, 1);
          n.call(this, new Error("operation has timed out"));
        }, s),
        o = (...l) => {
          (this.io.clearTimeoutFn(i), n.apply(this, l));
        };
      ((o.withError = !0), (this.acks[t] = o));
    }
    emitWithAck(t, ...n) {
      return new Promise((r, s) => {
        const i = (o, l) => (o ? s(o) : r(l));
        ((i.withError = !0), n.push(i), this.emit(t, ...n));
      });
    }
    _addToQueue(t) {
      let n;
      typeof t[t.length - 1] == "function" && (n = t.pop());
      const r = {
        id: this._queueSeq++,
        tryCount: 0,
        pending: !1,
        args: t,
        flags: Object.assign({ fromQueue: !0 }, this.flags),
      };
      (t.push(
        (s, ...i) => (
          this._queue[0],
          s !== null
            ? r.tryCount > this._opts.retries &&
              (this._queue.shift(), n && n(s))
            : (this._queue.shift(), n && n(null, ...i)),
          (r.pending = !1),
          this._drainQueue()
        ),
      ),
        this._queue.push(r),
        this._drainQueue());
    }
    _drainQueue(t = !1) {
      if (!this.connected || this._queue.length === 0) return;
      const n = this._queue[0];
      (n.pending && !t) ||
        ((n.pending = !0),
        n.tryCount++,
        (this.flags = n.flags),
        this.emit.apply(this, n.args));
    }
    packet(t) {
      ((t.nsp = this.nsp), this.io._packet(t));
    }
    onopen() {
      typeof this.auth == "function"
        ? this.auth((t) => {
            this._sendConnectPacket(t);
          })
        : this._sendConnectPacket(this.auth);
    }
    _sendConnectPacket(t) {
      this.packet({
        type: ie.CONNECT,
        data: this._pid
          ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t)
          : t,
      });
    }
    onerror(t) {
      this.connected || this.emitReserved("connect_error", t);
    }
    onclose(t, n) {
      ((this.connected = !1),
        delete this.id,
        this.emitReserved("disconnect", t, n),
        this._clearAcks());
    }
    _clearAcks() {
      Object.keys(this.acks).forEach((t) => {
        if (!this.sendBuffer.some((r) => String(r.id) === t)) {
          const r = this.acks[t];
          (delete this.acks[t],
            r.withError &&
              r.call(this, new Error("socket has been disconnected")));
        }
      });
    }
    onpacket(t) {
      if (t.nsp === this.nsp)
        switch (t.type) {
          case ie.CONNECT:
            t.data && t.data.sid
              ? this.onconnect(t.data.sid, t.data.pid)
              : this.emitReserved(
                  "connect_error",
                  new Error(
                    "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)",
                  ),
                );
            break;
          case ie.EVENT:
          case ie.BINARY_EVENT:
            this.onevent(t);
            break;
          case ie.ACK:
          case ie.BINARY_ACK:
            this.onack(t);
            break;
          case ie.DISCONNECT:
            this.ondisconnect();
            break;
          case ie.CONNECT_ERROR:
            this.destroy();
            const r = new Error(t.data.message);
            ((r.data = t.data.data), this.emitReserved("connect_error", r));
            break;
        }
    }
    onevent(t) {
      const n = t.data || [];
      (t.id != null && n.push(this.ack(t.id)),
        this.connected
          ? this.emitEvent(n)
          : this.receiveBuffer.push(Object.freeze(n)));
    }
    emitEvent(t) {
      if (this._anyListeners && this._anyListeners.length) {
        const n = this._anyListeners.slice();
        for (const r of n) r.apply(this, t);
      }
      (super.emit.apply(this, t),
        this._pid &&
          t.length &&
          typeof t[t.length - 1] == "string" &&
          (this._lastOffset = t[t.length - 1]));
    }
    ack(t) {
      const n = this;
      let r = !1;
      return function (...s) {
        r || ((r = !0), n.packet({ type: ie.ACK, id: t, data: s }));
      };
    }
    onack(t) {
      const n = this.acks[t.id];
      typeof n == "function" &&
        (delete this.acks[t.id],
        n.withError && t.data.unshift(null),
        n.apply(this, t.data));
    }
    onconnect(t, n) {
      ((this.id = t),
        (this.recovered = n && this._pid === n),
        (this._pid = n),
        (this.connected = !0),
        this.emitBuffered(),
        this._drainQueue(!0),
        this.emitReserved("connect"));
    }
    emitBuffered() {
      (this.receiveBuffer.forEach((t) => this.emitEvent(t)),
        (this.receiveBuffer = []),
        this.sendBuffer.forEach((t) => {
          (this.notifyOutgoingListeners(t), this.packet(t));
        }),
        (this.sendBuffer = []));
    }
    ondisconnect() {
      (this.destroy(), this.onclose("io server disconnect"));
    }
    destroy() {
      (this.subs && (this.subs.forEach((t) => t()), (this.subs = void 0)),
        this.io._destroy(this));
    }
    disconnect() {
      return (
        this.connected && this.packet({ type: ie.DISCONNECT }),
        this.destroy(),
        this.connected && this.onclose("io client disconnect"),
        this
      );
    }
    close() {
      return this.disconnect();
    }
    compress(t) {
      return ((this.flags.compress = t), this);
    }
    get volatile() {
      return ((this.flags.volatile = !0), this);
    }
    timeout(t) {
      return ((this.flags.timeout = t), this);
    }
    onAny(t) {
      return (
        (this._anyListeners = this._anyListeners || []),
        this._anyListeners.push(t),
        this
      );
    }
    prependAny(t) {
      return (
        (this._anyListeners = this._anyListeners || []),
        this._anyListeners.unshift(t),
        this
      );
    }
    offAny(t) {
      if (!this._anyListeners) return this;
      if (t) {
        const n = this._anyListeners;
        for (let r = 0; r < n.length; r++)
          if (t === n[r]) return (n.splice(r, 1), this);
      } else this._anyListeners = [];
      return this;
    }
    listenersAny() {
      return this._anyListeners || [];
    }
    onAnyOutgoing(t) {
      return (
        (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
        this._anyOutgoingListeners.push(t),
        this
      );
    }
    prependAnyOutgoing(t) {
      return (
        (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
        this._anyOutgoingListeners.unshift(t),
        this
      );
    }
    offAnyOutgoing(t) {
      if (!this._anyOutgoingListeners) return this;
      if (t) {
        const n = this._anyOutgoingListeners;
        for (let r = 0; r < n.length; r++)
          if (t === n[r]) return (n.splice(r, 1), this);
      } else this._anyOutgoingListeners = [];
      return this;
    }
    listenersAnyOutgoing() {
      return this._anyOutgoingListeners || [];
    }
    notifyOutgoingListeners(t) {
      if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
        const n = this._anyOutgoingListeners.slice();
        for (const r of n) r.apply(this, t.data);
      }
    }
  }
  function er(e) {
    ((e = e || {}),
      (this.ms = e.min || 100),
      (this.max = e.max || 1e4),
      (this.factor = e.factor || 2),
      (this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0),
      (this.attempts = 0));
  }
  ((er.prototype.duration = function () {
    var e = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var t = Math.random(),
        n = Math.floor(t * this.jitter * e);
      e = (Math.floor(t * 10) & 1) == 0 ? e - n : e + n;
    }
    return Math.min(e, this.max) | 0;
  }),
    (er.prototype.reset = function () {
      this.attempts = 0;
    }),
    (er.prototype.setMin = function (e) {
      this.ms = e;
    }),
    (er.prototype.setMax = function (e) {
      this.max = e;
    }),
    (er.prototype.setJitter = function (e) {
      this.jitter = e;
    }));
  class tl extends je {
    constructor(t, n) {
      var r;
      (super(),
        (this.nsps = {}),
        (this.subs = []),
        t && typeof t == "object" && ((n = t), (t = void 0)),
        (n = n || {}),
        (n.path = n.path || "/socket.io"),
        (this.opts = n),
        ni(this, n),
        this.reconnection(n.reconnection !== !1),
        this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0),
        this.reconnectionDelay(n.reconnectionDelay || 1e3),
        this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3),
        this.randomizationFactor(
          (r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5,
        ),
        (this.backoff = new er({
          min: this.reconnectionDelay(),
          max: this.reconnectionDelayMax(),
          jitter: this.randomizationFactor(),
        })),
        this.timeout(n.timeout == null ? 2e4 : n.timeout),
        (this._readyState = "closed"),
        (this.uri = t));
      const s = n.parser || O2;
      ((this.encoder = new s.Encoder()),
        (this.decoder = new s.Decoder()),
        (this._autoConnect = n.autoConnect !== !1),
        this._autoConnect && this.open());
    }
    reconnection(t) {
      return arguments.length
        ? ((this._reconnection = !!t), t || (this.skipReconnect = !0), this)
        : this._reconnection;
    }
    reconnectionAttempts(t) {
      return t === void 0
        ? this._reconnectionAttempts
        : ((this._reconnectionAttempts = t), this);
    }
    reconnectionDelay(t) {
      var n;
      return t === void 0
        ? this._reconnectionDelay
        : ((this._reconnectionDelay = t),
          (n = this.backoff) === null || n === void 0 || n.setMin(t),
          this);
    }
    randomizationFactor(t) {
      var n;
      return t === void 0
        ? this._randomizationFactor
        : ((this._randomizationFactor = t),
          (n = this.backoff) === null || n === void 0 || n.setJitter(t),
          this);
    }
    reconnectionDelayMax(t) {
      var n;
      return t === void 0
        ? this._reconnectionDelayMax
        : ((this._reconnectionDelayMax = t),
          (n = this.backoff) === null || n === void 0 || n.setMax(t),
          this);
    }
    timeout(t) {
      return arguments.length ? ((this._timeout = t), this) : this._timeout;
    }
    maybeReconnectOnOpen() {
      !this._reconnecting &&
        this._reconnection &&
        this.backoff.attempts === 0 &&
        this.reconnect();
    }
    open(t) {
      if (~this._readyState.indexOf("open")) return this;
      this.engine = new f2(this.uri, this.opts);
      const n = this.engine,
        r = this;
      ((this._readyState = "opening"), (this.skipReconnect = !1));
      const s = bt(n, "open", function () {
          (r.onopen(), t && t());
        }),
        i = (l) => {
          (this.cleanup(),
            (this._readyState = "closed"),
            this.emitReserved("error", l),
            t ? t(l) : this.maybeReconnectOnOpen());
        },
        o = bt(n, "error", i);
      if (this._timeout !== !1) {
        const l = this._timeout,
          a = this.setTimeoutFn(() => {
            (s(), i(new Error("timeout")), n.close());
          }, l);
        (this.opts.autoUnref && a.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(a);
          }));
      }
      return (this.subs.push(s), this.subs.push(o), this);
    }
    connect(t) {
      return this.open(t);
    }
    onopen() {
      (this.cleanup(), (this._readyState = "open"), this.emitReserved("open"));
      const t = this.engine;
      this.subs.push(
        bt(t, "ping", this.onping.bind(this)),
        bt(t, "data", this.ondata.bind(this)),
        bt(t, "error", this.onerror.bind(this)),
        bt(t, "close", this.onclose.bind(this)),
        bt(this.decoder, "decoded", this.ondecoded.bind(this)),
      );
    }
    onping() {
      this.emitReserved("ping");
    }
    ondata(t) {
      try {
        this.decoder.add(t);
      } catch (n) {
        this.onclose("parse error", n);
      }
    }
    ondecoded(t) {
      ti(() => {
        this.emitReserved("packet", t);
      }, this.setTimeoutFn);
    }
    onerror(t) {
      this.emitReserved("error", t);
    }
    socket(t, n) {
      let r = this.nsps[t];
      return (
        r
          ? this._autoConnect && !r.active && r.connect()
          : ((r = new Gu(this, t, n)), (this.nsps[t] = r)),
        r
      );
    }
    _destroy(t) {
      const n = Object.keys(this.nsps);
      for (const r of n) if (this.nsps[r].active) return;
      this._close();
    }
    _packet(t) {
      const n = this.encoder.encode(t);
      for (let r = 0; r < n.length; r++) this.engine.write(n[r], t.options);
    }
    cleanup() {
      (this.subs.forEach((t) => t()),
        (this.subs.length = 0),
        this.decoder.destroy());
    }
    _close() {
      ((this.skipReconnect = !0),
        (this._reconnecting = !1),
        this.onclose("forced close"));
    }
    disconnect() {
      return this._close();
    }
    onclose(t, n) {
      var r;
      (this.cleanup(),
        (r = this.engine) === null || r === void 0 || r.close(),
        this.backoff.reset(),
        (this._readyState = "closed"),
        this.emitReserved("close", t, n),
        this._reconnection && !this.skipReconnect && this.reconnect());
    }
    reconnect() {
      if (this._reconnecting || this.skipReconnect) return this;
      const t = this;
      if (this.backoff.attempts >= this._reconnectionAttempts)
        (this.backoff.reset(),
          this.emitReserved("reconnect_failed"),
          (this._reconnecting = !1));
      else {
        const n = this.backoff.duration();
        this._reconnecting = !0;
        const r = this.setTimeoutFn(() => {
          t.skipReconnect ||
            (this.emitReserved("reconnect_attempt", t.backoff.attempts),
            !t.skipReconnect &&
              t.open((s) => {
                s
                  ? ((t._reconnecting = !1),
                    t.reconnect(),
                    this.emitReserved("reconnect_error", s))
                  : t.onreconnect();
              }));
        }, n);
        (this.opts.autoUnref && r.unref(),
          this.subs.push(() => {
            this.clearTimeoutFn(r);
          }));
      }
    }
    onreconnect() {
      const t = this.backoff.attempts;
      ((this._reconnecting = !1),
        this.backoff.reset(),
        this.emitReserved("reconnect", t));
    }
  }
  const Lr = {};
  function oi(e, t) {
    (typeof e == "object" && ((t = e), (e = void 0)), (t = t || {}));
    const n = d2(e, t.path || "/socket.io"),
      r = n.source,
      s = n.id,
      i = n.path,
      o = Lr[s] && i in Lr[s].nsps,
      l = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
    let a;
    return (
      l ? (a = new tl(r, t)) : (Lr[s] || (Lr[s] = new tl(r, t)), (a = Lr[s])),
      n.query && !t.query && (t.query = n.queryKey),
      a.socket(n.path, t)
    );
  }
  Object.assign(oi, { Manager: tl, Socket: Gu, io: oi, connect: oi });
  function A2(e = {}) {
    let t = window.location.hostname,
      n = window.site_name,
      r = e.port || 9e3,
      s = window.location.port ? `:${r}` : "",
      o = `${s ? "http" : "https"}://${t}${s}/${n}`;
    return oi(o, { withCredentials: !0 });
  }
  let k2 = { resources: !0, call: !0, socketio: !0 };
  const M2 = {
      install(e, t = {}) {
        if (
          ((t = Object.assign({}, k2, t)),
          t.resources && e.use(u1, t.resources),
          t.call)
        ) {
          let n = typeof t.call == "function" ? t.call : Mm;
          e.config.globalProperties.$call = n;
        }
        t.socketio && (e.config.globalProperties.$socket = A2(t.socketio));
      },
    },
    P2 = Z({ name: "AuthorizationMessage", components: { Spinner: km } }),
    R2 = {
      class: "h-screen flex flex-col justify-around items-center bg-gray-400",
    },
    D2 = {
      class:
        "block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100",
    };
  function $2(e, t, n, r, s, i) {
    const o = de("Spinner");
    return (
      M(),
      ee("div", R2, [
        J("div", D2, [
          le(o, { class: "w-8 mb-4 mx-auto" }),
          t[0] ||
            (t[0] = J(
              "p",
              { class: "text-center text-3xl font-bold text-red-300" },
              "Please scan your employee ID to continue.",
              -1,
            )),
        ]),
      ])
    );
  }
  const Yu = Ne(P2, [["render", $2]]),
    L2 = {
      name: "SessionTimer",
      props: {
        employeeName: { type: String, required: !0 },
        tokenExpiration: { type: Number, required: !0 },
      },
      setup(e) {
        let t = null;
        const n = Q(0),
          r = V(() => {
            const i = Math.floor(n.value / 60),
              o = n.value % 60;
            return n.value > 0
              ? `Timeout in ${i}m ${o}s`
              : "Session Timed Out.";
          }),
          s = () => {
            const i = Date.now();
            n.value = Math.floor((e.tokenExpiration - i) / 1e3);
          };
        return (
          We(() => {
            (clearInterval(t),
              e.tokenExpiration &&
                e.tokenExpiration > Date.now() &&
                ((t = setInterval(s, 1e3)), s()));
          }),
          vr(() => {
            clearInterval(t);
          }),
          { timeLeftDisplay: r }
        );
      },
    },
    I2 = { class: "text-black-500 xl:text-2xl" },
    N2 = { key: 0, class: "text-gray-500 text-m xl:text-xl" };
  function B2(e, t, n, r, s, i) {
    return (
      M(),
      ee("div", I2, [
        t[0] || (t[0] = J("strong", null, "Employee:", -1)),
        Ue(" " + _e(n.employeeName) + " ", 1),
        n.tokenExpiration
          ? (M(), ee("div", N2, _e(r.timeLeftDisplay), 1))
          : Se("", !0),
      ])
    );
  }
  const F2 = Ne(L2, [["render", B2]]);
  var V2 = Object.defineProperty,
    Ju = Object.getOwnPropertySymbols,
    H2 = Object.prototype.hasOwnProperty,
    z2 = Object.prototype.propertyIsEnumerable,
    Xu = (e, t, n) =>
      t in e
        ? V2(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
        : (e[t] = n),
    Qu = (e, t) => {
      for (var n in t || (t = {})) H2.call(t, n) && Xu(e, n, t[n]);
      if (Ju) for (var n of Ju(t)) z2.call(t, n) && Xu(e, n, t[n]);
      return e;
    },
    li = (e) => typeof e == "function",
    ai = (e) => typeof e == "string",
    Zu = (e) => ai(e) && e.trim().length > 0,
    W2 = (e) => typeof e == "number",
    An = (e) => typeof e > "u",
    Ir = (e) => typeof e == "object" && e !== null,
    U2 = (e) => Nt(e, "tag") && Zu(e.tag),
    ef = (e) => window.TouchEvent && e instanceof TouchEvent,
    tf = (e) => Nt(e, "component") && nf(e.component),
    K2 = (e) => li(e) || Ir(e),
    nf = (e) => !An(e) && (ai(e) || K2(e) || tf(e)),
    rf = (e) =>
      Ir(e) &&
      ["height", "width", "right", "left", "top", "bottom"].every((t) =>
        W2(e[t]),
      ),
    Nt = (e, t) => (Ir(e) || li(e)) && t in e,
    q2 = (
      (e) => () =>
        e++
    )(0);
  function nl(e) {
    return ef(e) ? e.targetTouches[0].clientX : e.clientX;
  }
  function sf(e) {
    return ef(e) ? e.targetTouches[0].clientY : e.clientY;
  }
  var G2 = (e) => {
      An(e.remove) ? e.parentNode && e.parentNode.removeChild(e) : e.remove();
    },
    Nr = (e) =>
      tf(e)
        ? Nr(e.component)
        : U2(e)
          ? Z({
              render() {
                return e;
              },
            })
          : typeof e == "string"
            ? e
            : ae(F(e)),
    Y2 = (e) => {
      if (typeof e == "string") return e;
      const t = Nt(e, "props") && Ir(e.props) ? e.props : {},
        n = Nt(e, "listeners") && Ir(e.listeners) ? e.listeners : {};
      return { component: Nr(e), props: t, listeners: n };
    },
    J2 = () => typeof window < "u",
    rl = class {
      constructor() {
        this.allHandlers = {};
      }
      getHandlers(e) {
        return this.allHandlers[e] || [];
      }
      on(e, t) {
        const n = this.getHandlers(e);
        (n.push(t), (this.allHandlers[e] = n));
      }
      off(e, t) {
        const n = this.getHandlers(e);
        n.splice(n.indexOf(t) >>> 0, 1);
      }
      emit(e, t) {
        this.getHandlers(e).forEach((r) => r(t));
      }
    },
    X2 = (e) => ["on", "off", "emit"].every((t) => Nt(e, t) && li(e[t])),
    rt;
  (function (e) {
    ((e.SUCCESS = "success"),
      (e.ERROR = "error"),
      (e.WARNING = "warning"),
      (e.INFO = "info"),
      (e.DEFAULT = "default"));
  })(rt || (rt = {}));
  var ci;
  (function (e) {
    ((e.TOP_LEFT = "top-left"),
      (e.TOP_CENTER = "top-center"),
      (e.TOP_RIGHT = "top-right"),
      (e.BOTTOM_LEFT = "bottom-left"),
      (e.BOTTOM_CENTER = "bottom-center"),
      (e.BOTTOM_RIGHT = "bottom-right"));
  })(ci || (ci = {}));
  var st;
  (function (e) {
    ((e.ADD = "add"),
      (e.DISMISS = "dismiss"),
      (e.UPDATE = "update"),
      (e.CLEAR = "clear"),
      (e.UPDATE_DEFAULTS = "update_defaults"));
  })(st || (st = {}));
  var xt = "Vue-Toastification",
    wt = {
      type: { type: String, default: rt.DEFAULT },
      classNames: { type: [String, Array], default: () => [] },
      trueBoolean: { type: Boolean, default: !0 },
    },
    of = {
      type: wt.type,
      customIcon: { type: [String, Boolean, Object, Function], default: !0 },
    },
    ui = {
      component: {
        type: [String, Object, Function, Boolean],
        default: "button",
      },
      classNames: wt.classNames,
      showOnHover: { type: Boolean, default: !1 },
      ariaLabel: { type: String, default: "close" },
    },
    sl = {
      timeout: { type: [Number, Boolean], default: 5e3 },
      hideProgressBar: { type: Boolean, default: !1 },
      isRunning: { type: Boolean, default: !1 },
    },
    lf = { transition: { type: [Object, String], default: `${xt}__bounce` } },
    Q2 = {
      position: { type: String, default: ci.TOP_RIGHT },
      draggable: wt.trueBoolean,
      draggablePercent: { type: Number, default: 0.6 },
      pauseOnFocusLoss: wt.trueBoolean,
      pauseOnHover: wt.trueBoolean,
      closeOnClick: wt.trueBoolean,
      timeout: sl.timeout,
      hideProgressBar: sl.hideProgressBar,
      toastClassName: wt.classNames,
      bodyClassName: wt.classNames,
      icon: of.customIcon,
      closeButton: ui.component,
      closeButtonClassName: ui.classNames,
      showCloseButtonOnHover: ui.showOnHover,
      accessibility: {
        type: Object,
        default: () => ({ toastRole: "alert", closeButtonLabel: "close" }),
      },
      rtl: { type: Boolean, default: !1 },
      eventBus: { type: Object, required: !1, default: () => new rl() },
    },
    Z2 = {
      id: { type: [String, Number], required: !0, default: 0 },
      type: wt.type,
      content: { type: [String, Object, Function], required: !0, default: "" },
      onClick: { type: Function, default: void 0 },
      onClose: { type: Function, default: void 0 },
    },
    e0 = {
      container: { type: [Object, Function], default: () => document.body },
      newestOnTop: wt.trueBoolean,
      maxToasts: { type: Number, default: 20 },
      transition: lf.transition,
      toastDefaults: Object,
      filterBeforeCreate: { type: Function, default: (e) => e },
      filterToasts: { type: Function, default: (e) => e },
      containerClassName: wt.classNames,
      onMounted: Function,
      shareAppContext: [Boolean, Object],
    },
    Zt = {
      CORE_TOAST: Q2,
      TOAST: Z2,
      CONTAINER: e0,
      PROGRESS_BAR: sl,
      ICON: of,
      TRANSITION: lf,
      CLOSE_BUTTON: ui,
    },
    af = Z({
      name: "VtProgressBar",
      props: Zt.PROGRESS_BAR,
      data() {
        return { hasClass: !0 };
      },
      computed: {
        style() {
          return {
            animationDuration: `${this.timeout}ms`,
            animationPlayState: this.isRunning ? "running" : "paused",
            opacity: this.hideProgressBar ? 0 : 1,
          };
        },
        cpClass() {
          return this.hasClass ? `${xt}__progress-bar` : "";
        },
      },
      watch: {
        timeout() {
          ((this.hasClass = !1), this.$nextTick(() => (this.hasClass = !0)));
        },
      },
      mounted() {
        this.$el.addEventListener("animationend", this.animationEnded);
      },
      beforeUnmount() {
        this.$el.removeEventListener("animationend", this.animationEnded);
      },
      methods: {
        animationEnded() {
          this.$emit("close-toast");
        },
      },
    });
  function t0(e, t) {
    return (
      M(),
      ee("div", { style: St(e.style), class: we(e.cpClass) }, null, 6)
    );
  }
  af.render = t0;
  var n0 = af,
    cf = Z({
      name: "VtCloseButton",
      props: Zt.CLOSE_BUTTON,
      computed: {
        buttonComponent() {
          return this.component !== !1 ? Nr(this.component) : "button";
        },
        classes() {
          const e = [`${xt}__close-button`];
          return (
            this.showOnHover && e.push("show-on-hover"),
            e.concat(this.classNames)
          );
        },
      },
    }),
    r0 = Ue(" × ");
  function s0(e, t) {
    return (
      M(),
      Y(
        En(e.buttonComponent),
        Ke({ "aria-label": e.ariaLabel, class: e.classes }, e.$attrs),
        { default: se(() => [r0]), _: 1 },
        16,
        ["aria-label", "class"],
      )
    );
  }
  cf.render = s0;
  var i0 = cf,
    uf = {},
    o0 = {
      "aria-hidden": "true",
      focusable: "false",
      "data-prefix": "fas",
      "data-icon": "check-circle",
      class: "svg-inline--fa fa-check-circle fa-w-16",
      role: "img",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
    },
    l0 = J(
      "path",
      {
        fill: "currentColor",
        d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z",
      },
      null,
      -1,
    ),
    a0 = [l0];
  function c0(e, t) {
    return (M(), ee("svg", o0, a0));
  }
  uf.render = c0;
  var u0 = uf,
    ff = {},
    f0 = {
      "aria-hidden": "true",
      focusable: "false",
      "data-prefix": "fas",
      "data-icon": "info-circle",
      class: "svg-inline--fa fa-info-circle fa-w-16",
      role: "img",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
    },
    d0 = J(
      "path",
      {
        fill: "currentColor",
        d: "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z",
      },
      null,
      -1,
    ),
    h0 = [d0];
  function p0(e, t) {
    return (M(), ee("svg", f0, h0));
  }
  ff.render = p0;
  var df = ff,
    hf = {},
    y0 = {
      "aria-hidden": "true",
      focusable: "false",
      "data-prefix": "fas",
      "data-icon": "exclamation-circle",
      class: "svg-inline--fa fa-exclamation-circle fa-w-16",
      role: "img",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
    },
    g0 = J(
      "path",
      {
        fill: "currentColor",
        d: "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z",
      },
      null,
      -1,
    ),
    m0 = [g0];
  function v0(e, t) {
    return (M(), ee("svg", y0, m0));
  }
  hf.render = v0;
  var b0 = hf,
    pf = {},
    x0 = {
      "aria-hidden": "true",
      focusable: "false",
      "data-prefix": "fas",
      "data-icon": "exclamation-triangle",
      class: "svg-inline--fa fa-exclamation-triangle fa-w-18",
      role: "img",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 576 512",
    },
    w0 = J(
      "path",
      {
        fill: "currentColor",
        d: "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z",
      },
      null,
      -1,
    ),
    _0 = [w0];
  function S0(e, t) {
    return (M(), ee("svg", x0, _0));
  }
  pf.render = S0;
  var E0 = pf,
    yf = Z({
      name: "VtIcon",
      props: Zt.ICON,
      computed: {
        customIconChildren() {
          return Nt(this.customIcon, "iconChildren")
            ? this.trimValue(this.customIcon.iconChildren)
            : "";
        },
        customIconClass() {
          return ai(this.customIcon)
            ? this.trimValue(this.customIcon)
            : Nt(this.customIcon, "iconClass")
              ? this.trimValue(this.customIcon.iconClass)
              : "";
        },
        customIconTag() {
          return Nt(this.customIcon, "iconTag")
            ? this.trimValue(this.customIcon.iconTag, "i")
            : "i";
        },
        hasCustomIcon() {
          return this.customIconClass.length > 0;
        },
        component() {
          return this.hasCustomIcon
            ? this.customIconTag
            : nf(this.customIcon)
              ? Nr(this.customIcon)
              : this.iconTypeComponent;
        },
        iconTypeComponent() {
          return {
            [rt.DEFAULT]: df,
            [rt.INFO]: df,
            [rt.SUCCESS]: u0,
            [rt.ERROR]: E0,
            [rt.WARNING]: b0,
          }[this.type];
        },
        iconClasses() {
          const e = [`${xt}__icon`];
          return this.hasCustomIcon ? e.concat(this.customIconClass) : e;
        },
      },
      methods: {
        trimValue(e, t = "") {
          return Zu(e) ? e.trim() : t;
        },
      },
    });
  function C0(e, t) {
    return (
      M(),
      Y(
        En(e.component),
        { class: we(e.iconClasses) },
        { default: se(() => [Ue(_e(e.customIconChildren), 1)]), _: 1 },
        8,
        ["class"],
      )
    );
  }
  yf.render = C0;
  var T0 = yf,
    gf = Z({
      name: "VtToast",
      components: { ProgressBar: n0, CloseButton: i0, Icon: T0 },
      inheritAttrs: !1,
      props: Object.assign({}, Zt.CORE_TOAST, Zt.TOAST),
      data() {
        return {
          isRunning: !0,
          disableTransitions: !1,
          beingDragged: !1,
          dragStart: 0,
          dragPos: { x: 0, y: 0 },
          dragRect: {},
        };
      },
      computed: {
        classes() {
          const e = [
            `${xt}__toast`,
            `${xt}__toast--${this.type}`,
            `${this.position}`,
          ].concat(this.toastClassName);
          return (
            this.disableTransitions && e.push("disable-transition"),
            this.rtl && e.push(`${xt}__toast--rtl`),
            e
          );
        },
        bodyClasses() {
          return [
            `${xt}__toast-${ai(this.content) ? "body" : "component-body"}`,
          ].concat(this.bodyClassName);
        },
        draggableStyle() {
          return this.dragStart === this.dragPos.x
            ? {}
            : this.beingDragged
              ? {
                  transform: `translateX(${this.dragDelta}px)`,
                  opacity: 1 - Math.abs(this.dragDelta / this.removalDistance),
                }
              : {
                  transition: "transform 0.2s, opacity 0.2s",
                  transform: "translateX(0)",
                  opacity: 1,
                };
        },
        dragDelta() {
          return this.beingDragged ? this.dragPos.x - this.dragStart : 0;
        },
        removalDistance() {
          return rf(this.dragRect)
            ? (this.dragRect.right - this.dragRect.left) * this.draggablePercent
            : 0;
        },
      },
      mounted() {
        (this.draggable && this.draggableSetup(),
          this.pauseOnFocusLoss && this.focusSetup());
      },
      beforeUnmount() {
        (this.draggable && this.draggableCleanup(),
          this.pauseOnFocusLoss && this.focusCleanup());
      },
      methods: {
        hasProp: Nt,
        getVueComponentFromObj: Nr,
        closeToast() {
          this.eventBus.emit(st.DISMISS, this.id);
        },
        clickHandler() {
          (this.onClick && this.onClick(this.closeToast),
            this.closeOnClick &&
              (!this.beingDragged || this.dragStart === this.dragPos.x) &&
              this.closeToast());
        },
        timeoutHandler() {
          this.closeToast();
        },
        hoverPause() {
          this.pauseOnHover && (this.isRunning = !1);
        },
        hoverPlay() {
          this.pauseOnHover && (this.isRunning = !0);
        },
        focusPause() {
          this.isRunning = !1;
        },
        focusPlay() {
          this.isRunning = !0;
        },
        focusSetup() {
          (addEventListener("blur", this.focusPause),
            addEventListener("focus", this.focusPlay));
        },
        focusCleanup() {
          (removeEventListener("blur", this.focusPause),
            removeEventListener("focus", this.focusPlay));
        },
        draggableSetup() {
          const e = this.$el;
          (e.addEventListener("touchstart", this.onDragStart, { passive: !0 }),
            e.addEventListener("mousedown", this.onDragStart),
            addEventListener("touchmove", this.onDragMove, { passive: !1 }),
            addEventListener("mousemove", this.onDragMove),
            addEventListener("touchend", this.onDragEnd),
            addEventListener("mouseup", this.onDragEnd));
        },
        draggableCleanup() {
          const e = this.$el;
          (e.removeEventListener("touchstart", this.onDragStart),
            e.removeEventListener("mousedown", this.onDragStart),
            removeEventListener("touchmove", this.onDragMove),
            removeEventListener("mousemove", this.onDragMove),
            removeEventListener("touchend", this.onDragEnd),
            removeEventListener("mouseup", this.onDragEnd));
        },
        onDragStart(e) {
          ((this.beingDragged = !0),
            (this.dragPos = { x: nl(e), y: sf(e) }),
            (this.dragStart = nl(e)),
            (this.dragRect = this.$el.getBoundingClientRect()));
        },
        onDragMove(e) {
          this.beingDragged &&
            (e.preventDefault(),
            this.isRunning && (this.isRunning = !1),
            (this.dragPos = { x: nl(e), y: sf(e) }));
        },
        onDragEnd() {
          this.beingDragged &&
            (Math.abs(this.dragDelta) >= this.removalDistance
              ? ((this.disableTransitions = !0),
                this.$nextTick(() => this.closeToast()))
              : setTimeout(() => {
                  ((this.beingDragged = !1),
                    rf(this.dragRect) &&
                    this.pauseOnHover &&
                    this.dragRect.bottom >= this.dragPos.y &&
                    this.dragPos.y >= this.dragRect.top &&
                    this.dragRect.left <= this.dragPos.x &&
                    this.dragPos.x <= this.dragRect.right
                      ? (this.isRunning = !1)
                      : (this.isRunning = !0));
                }));
        },
      },
    }),
    O0 = ["role"];
  function j0(e, t) {
    const n = de("Icon"),
      r = de("CloseButton"),
      s = de("ProgressBar");
    return (
      M(),
      ee(
        "div",
        {
          class: we(e.classes),
          style: St(e.draggableStyle),
          onClick:
            t[0] || (t[0] = (...i) => e.clickHandler && e.clickHandler(...i)),
          onMouseenter:
            t[1] || (t[1] = (...i) => e.hoverPause && e.hoverPause(...i)),
          onMouseleave:
            t[2] || (t[2] = (...i) => e.hoverPlay && e.hoverPlay(...i)),
        },
        [
          e.icon
            ? (M(),
              Y(n, { key: 0, "custom-icon": e.icon, type: e.type }, null, 8, [
                "custom-icon",
                "type",
              ]))
            : Se("v-if", !0),
          J(
            "div",
            {
              role: e.accessibility.toastRole || "alert",
              class: we(e.bodyClasses),
            },
            [
              typeof e.content == "string"
                ? (M(), ee(pe, { key: 0 }, [Ue(_e(e.content), 1)], 2112))
                : (M(),
                  Y(
                    En(e.getVueComponentFromObj(e.content)),
                    Ke(
                      { key: 1, "toast-id": e.id },
                      e.hasProp(e.content, "props") ? e.content.props : {},
                      Ta(
                        e.hasProp(e.content, "listeners")
                          ? e.content.listeners
                          : {},
                      ),
                      { onCloseToast: e.closeToast },
                    ),
                    null,
                    16,
                    ["toast-id", "onCloseToast"],
                  )),
            ],
            10,
            O0,
          ),
          e.closeButton
            ? (M(),
              Y(
                r,
                {
                  key: 1,
                  component: e.closeButton,
                  "class-names": e.closeButtonClassName,
                  "show-on-hover": e.showCloseButtonOnHover,
                  "aria-label": e.accessibility.closeButtonLabel,
                  onClick: kc(e.closeToast, ["stop"]),
                },
                null,
                8,
                [
                  "component",
                  "class-names",
                  "show-on-hover",
                  "aria-label",
                  "onClick",
                ],
              ))
            : Se("v-if", !0),
          e.timeout
            ? (M(),
              Y(
                s,
                {
                  key: 2,
                  "is-running": e.isRunning,
                  "hide-progress-bar": e.hideProgressBar,
                  timeout: e.timeout,
                  onCloseToast: e.timeoutHandler,
                },
                null,
                8,
                ["is-running", "hide-progress-bar", "timeout", "onCloseToast"],
              ))
            : Se("v-if", !0),
        ],
        38,
      )
    );
  }
  gf.render = j0;
  var A0 = gf,
    mf = Z({
      name: "VtTransition",
      props: Zt.TRANSITION,
      emits: ["leave"],
      methods: {
        hasProp: Nt,
        leave(e) {
          e instanceof HTMLElement &&
            ((e.style.left = e.offsetLeft + "px"),
            (e.style.top = e.offsetTop + "px"),
            (e.style.width = getComputedStyle(e).width),
            (e.style.position = "absolute"));
        },
      },
    });
  function k0(e, t) {
    return (
      M(),
      Y(
        cp,
        {
          tag: "div",
          "enter-active-class": e.transition.enter
            ? e.transition.enter
            : `${e.transition}-enter-active`,
          "move-class": e.transition.move
            ? e.transition.move
            : `${e.transition}-move`,
          "leave-active-class": e.transition.leave
            ? e.transition.leave
            : `${e.transition}-leave-active`,
          onLeave: e.leave,
        },
        { default: se(() => [he(e.$slots, "default")]), _: 3 },
        8,
        ["enter-active-class", "move-class", "leave-active-class", "onLeave"],
      )
    );
  }
  mf.render = k0;
  var M0 = mf,
    vf = Z({
      name: "VueToastification",
      devtools: { hide: !0 },
      components: { Toast: A0, VtTransition: M0 },
      props: Object.assign({}, Zt.CORE_TOAST, Zt.CONTAINER, Zt.TRANSITION),
      data() {
        return {
          count: 0,
          positions: Object.values(ci),
          toasts: {},
          defaults: {},
        };
      },
      computed: {
        toastArray() {
          return Object.values(this.toasts);
        },
        filteredToasts() {
          return this.defaults.filterToasts(this.toastArray);
        },
      },
      beforeMount() {
        const e = this.eventBus;
        (e.on(st.ADD, this.addToast),
          e.on(st.CLEAR, this.clearToasts),
          e.on(st.DISMISS, this.dismissToast),
          e.on(st.UPDATE, this.updateToast),
          e.on(st.UPDATE_DEFAULTS, this.updateDefaults),
          (this.defaults = this.$props));
      },
      mounted() {
        this.setup(this.container);
      },
      methods: {
        async setup(e) {
          (li(e) && (e = await e()), G2(this.$el), e.appendChild(this.$el));
        },
        setToast(e) {
          An(e.id) || (this.toasts[e.id] = e);
        },
        addToast(e) {
          e.content = Y2(e.content);
          const t = Object.assign(
              {},
              this.defaults,
              e.type &&
                this.defaults.toastDefaults &&
                this.defaults.toastDefaults[e.type],
              e,
            ),
            n = this.defaults.filterBeforeCreate(t, this.toastArray);
          n && this.setToast(n);
        },
        dismissToast(e) {
          const t = this.toasts[e];
          (!An(t) && !An(t.onClose) && t.onClose(), delete this.toasts[e]);
        },
        clearToasts() {
          Object.keys(this.toasts).forEach((e) => {
            this.dismissToast(e);
          });
        },
        getPositionToasts(e) {
          const t = this.filteredToasts
            .filter((n) => n.position === e)
            .slice(0, this.defaults.maxToasts);
          return this.defaults.newestOnTop ? t.reverse() : t;
        },
        updateDefaults(e) {
          (An(e.container) || this.setup(e.container),
            (this.defaults = Object.assign({}, this.defaults, e)));
        },
        updateToast({ id: e, options: t, create: n }) {
          this.toasts[e]
            ? (t.timeout && t.timeout === this.toasts[e].timeout && t.timeout++,
              this.setToast(Object.assign({}, this.toasts[e], t)))
            : n && this.addToast(Object.assign({}, { id: e }, t));
        },
        getClasses(e) {
          return [`${xt}__container`, e].concat(
            this.defaults.containerClassName,
          );
        },
      },
    });
  function P0(e, t) {
    const n = de("Toast"),
      r = de("VtTransition");
    return (
      M(),
      ee("div", null, [
        (M(!0),
        ee(
          pe,
          null,
          Hn(
            e.positions,
            (s) => (
              M(),
              ee("div", { key: s }, [
                le(
                  r,
                  {
                    transition: e.defaults.transition,
                    class: we(e.getClasses(s)),
                  },
                  {
                    default: se(() => [
                      (M(!0),
                      ee(
                        pe,
                        null,
                        Hn(
                          e.getPositionToasts(s),
                          (i) => (M(), Y(n, Ke({ key: i.id }, i), null, 16)),
                        ),
                        128,
                      )),
                    ]),
                    _: 2,
                  },
                  1032,
                  ["transition", "class"],
                ),
              ])
            ),
          ),
          128,
        )),
      ])
    );
  }
  vf.render = P0;
  var R0 = vf,
    bf = (e = {}, t = !0) => {
      const n = (e.eventBus = e.eventBus || new rl());
      t &&
        Le(() => {
          const i = Pc(R0, Qu({}, e)),
            o = i.mount(document.createElement("div")),
            l = e.onMounted;
          if ((An(l) || l(o, i), e.shareAppContext)) {
            const a = e.shareAppContext;
            a === !0
              ? console.warn(
                  `[${xt}] App to share context with was not provided.`,
                )
              : ((i._context.components = a._context.components),
                (i._context.directives = a._context.directives),
                (i._context.mixins = a._context.mixins),
                (i._context.provides = a._context.provides),
                (i.config.globalProperties = a.config.globalProperties));
          }
        });
      const r = (i, o) => {
        const l = Object.assign({}, { id: q2(), type: rt.DEFAULT }, o, {
          content: i,
        });
        return (n.emit(st.ADD, l), l.id);
      };
      ((r.clear = () => n.emit(st.CLEAR, void 0)),
        (r.updateDefaults = (i) => {
          n.emit(st.UPDATE_DEFAULTS, i);
        }),
        (r.dismiss = (i) => {
          n.emit(st.DISMISS, i);
        }));
      function s(i, { content: o, options: l }, a = !1) {
        const u = Object.assign({}, l, { content: o });
        n.emit(st.UPDATE, { id: i, options: u, create: a });
      }
      return (
        (r.update = s),
        (r.success = (i, o) =>
          r(i, Object.assign({}, o, { type: rt.SUCCESS }))),
        (r.info = (i, o) => r(i, Object.assign({}, o, { type: rt.INFO }))),
        (r.error = (i, o) => r(i, Object.assign({}, o, { type: rt.ERROR }))),
        (r.warning = (i, o) =>
          r(i, Object.assign({}, o, { type: rt.WARNING }))),
        r
      );
    },
    D0 = () => {
      const e = () => console.warn(`[${xt}] This plugin does not support SSR!`);
      return new Proxy(e, {
        get() {
          return e;
        },
      });
    };
  function xf(e) {
    return J2() ? (X2(e) ? bf({ eventBus: e }, !1) : bf(e, !0)) : D0();
  }
  var wf = Symbol("VueToastification"),
    _f = new rl(),
    $0 = (e, t) => {
      t?.shareAppContext === !0 && (t.shareAppContext = e);
      const n = xf(Qu({ eventBus: _f }, t));
      e.provide(wf, n);
    },
    Sf = (e) => {
      const t = qe() ? jt(wf, void 0) : void 0;
      return t || xf(_f);
    },
    L0 = $0;
  const il = Sf(),
    I0 = Z({
      name: "TimerWidget",
      data() {
        return {
          taskStarted: !1,
          startTime: new Date(),
          elapsedTime: "00:00:00",
          interval: null,
          completed_jobCard: !1,
          start_time_frappe: new Date(),
        };
      },
      props: {
        jobCard: { type: Object, default: () => {} },
        employee_id: String,
      },
      methods: {
        get_time_in_string(e) {
          const t = e.getUTCFullYear(),
            n = e.getUTCMonth() + 1,
            r = e.getUTCDate(),
            s = e.getUTCHours(),
            i = e.getUTCMinutes(),
            o = e.getUTCSeconds(),
            l = (u) => (u < 10 ? "0" + u : u);
          return `${t}-${l(n)}-${l(r)} ${l(s - 5)}:${l(i)}:${l(o)}`;
        },
        async startTask(e) {
          ((this.startTime = new Date()),
            (this.start_time_frappe = this.get_time_in_string(this.startTime)));
          const t = await at(
            "employee_timeclock.www.job_timeclock.log_start_time_of_jobcard",
            {
              employee_id: this.employee_id,
              start_time: this.start_time_frappe,
              jobcard_name: e.name,
            },
          );
          t?.status === "success"
            ? ((this.taskStarted = !0),
              this.start_timer(this.startTime),
              (this.timer_started = !0),
              this.$emit("emit_timer", this.timer_started),
              (this.jobCard.is_active = !0),
              t.card_logged_out !== "no cards logged out" &&
                (console.log(t.card_logged_out),
                il.success("Another card was logged out."),
                this.$emit("emit_logged_out_card", {
                  card_logged_out: t.card_logged_out,
                  card_logged_in: this.jobCard,
                })))
            : (il.error(`${this.jobCard.Operation} failed to start.`),
              console.log("did not work."),
              console.log(t.job_card));
        },
        start_timer(e) {
          this.interval = setInterval(() => {
            const n = new Date().getTime() - e.getTime(),
              r = Math.floor(n / (1e3 * 60 * 60)),
              s = Math.floor((n % (1e3 * 60 * 60)) / (1e3 * 60)),
              i = Math.floor((n % (1e3 * 60)) / 1e3);
            this.elapsedTime = `${r.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
          }, 1e3);
        },
        async stopTask(e) {
          ((this.endTime = new Date()),
            (this.end_time_frappe = this.get_time_in_string(this.endTime)),
            (
              await at("employee_timeclock.www.job_timeclock.log_end_time_of_jobcard", {
                employee_id: this.employee_id,
                end_time: this.end_time_frappe,
                jobcard_name: e.name,
              })
            )?.status === "success"
              ? (console.log("End Time sent."),
                clearInterval(this.interval),
                (this.taskStarted = !1),
                (this.timer_started = !1),
                this.$emit("emit_timer", this.timer_started),
                (this.jobCard.is_active = !1))
              : (il.error(`${this.jobCard.Operation} failed to end.`),
                console.log("End job card did not work.")));
        },
        async complete_task(e) {
          if (this.completed_jobCard === !1)
            if (
              (console.log(this.jobCard),
              confirm("Are you sure you want to submit?"))
            ) {
              const t = new Date(),
                n = this.get_time_in_string(t),
                r = await at("employee_timeclock.www.job_timeclock.submit_jobcard", {
                  jobCard: e,
                  complete_time: n,
                  employee_id: this.employee_id,
                });
              r?.status === "success"
                ? ((this.completed_jobCard = !0), console.log(r.job_card))
                : ((this.completed_jobCard = !1), console.log(r.error_message));
            } else this.completed_jobCard = !1;
          else console.log("aye");
        },
        initialize_ongoing_timer() {
          this.taskStarted = !0;
          const e = this.jobCard.time_logs.from_time;
          ((this.start_time = new Date(e)),
            this.start_timer(this.start_time),
            (this.timer_started = !0),
            this.$emit("emit_timer", this.timer_started));
        },
      },
      mounted() {
        (this.jobCard.status === "Completed" && (this.completed_jobCard = !0),
          Ee(
            () => this.jobCard.is_active,
            (e) => {
              e === !1 &&
                ((this.taskStarted = !1),
                clearInterval(this.interval),
                (this.timer_started = !1),
                this.$emit("emit_timer", this.timer_started));
            },
            { immediate: !0 },
          ));
      },
      beforeMount() {
        this.jobCard.is_active === !0
          ? this.initialize_ongoing_timer()
          : (this.taskStarted = !1);
      },
      unmounted() {},
    }),
    N0 = { key: 2, class: "text-gray-700 text-md font-family-sans" };
  function B0(e, t, n, r, s, i) {
    return (
      M(),
      ee("div", null, [
        t[3] ||
          (t[3] = J("h4", { class: "font-bold text-xl" }, "Task Timer", -1)),
        e.taskStarted === !1 && e.completed_jobCard === !1
          ? (M(),
            ee(
              "button",
              {
                key: 0,
                class:
                  "bg-green-400 text-white font-normal lg:text-3xl focus:bg-green-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
                onClick: t[0] || (t[0] = (o) => e.startTask(e.jobCard)),
              },
              "Start Timer",
            ))
          : Se("", !0),
        e.taskStarted && e.completed_jobCard === !1
          ? (M(),
            ee(
              "button",
              {
                key: 1,
                class:
                  "bg-red-400 text-white font-normal lg:text-3xl focus:bg-red-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
                onClick: t[1] || (t[1] = (o) => e.stopTask(e.jobCard)),
              },
              "Stop Timer",
            ))
          : Se("", !0),
        J(
          "button",
          {
            class:
              "bg-gray-800 text-white font-normal lg:text-3xl focus:bg-gray-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
            onClick: t[2] || (t[2] = (o) => e.complete_task(e.jobCard)),
          },
          "Complete",
        ),
        e.completed_jobCard === !1
          ? (M(), ee("p", N0, _e(e.elapsedTime), 1))
          : Se("", !0),
      ])
    );
  }
  const Ef = Ne(I0, [["render", B0]]),
    F0 = {},
    V0 = {
      class:
        "card divide-y divide-gray-100 rounded-md border border-gray-200 flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 mt-2 mb-2",
    };
  function H0(e, t) {
    return (M(), ee("div", V0, [he(e.$slots, "default")]));
  }
  const fi = Ne(F0, [["render", H0]]),
    z0 = Z({
      name: "WorkOrderWidget",
      components: { Card: fi },
      props: {
        workOrder: { type: Object, required: !0 },
        isSelected: { type: Boolean, default: !1 },
      },
      data() {
        return { selected: !1 };
      },
      methods: {
        click(e) {
          this.selected === !0
            ? (this.selected = !1)
            : (this.$emit("click", e), (this.selected = !0));
        },
        mounted() {
          this.selected = !1;
        },
      },
      unmounted() {
        this.selected = !1;
      },
    }),
    W0 = { class: "flex flex-col" },
    U0 = { class: "text-xl xl:text-4xl" },
    K0 = { key: 0, class: "text-lg" },
    q0 = {
      key: 0,
      class:
        "px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800",
    };
  function G0(e, t, n, r, s, i) {
    const o = de("Card");
    return (
      M(),
      Y(
        o,
        {
          onClick: e.click,
          class: we([{ "bg-blue-100": e.isSelected }, "overflow-hidden"]),
        },
        {
          default: se(() => [
            J("div", W0, [
              J("h3", U0, _e(e.workOrder.production_item), 1),
              e.selected === !1
                ? (M(), ee("span", K0, _e(e.workOrder.name), 1))
                : Se("", !0),
            ]),
            e.selected === !1
              ? (M(), ee("span", q0, _e(e.workOrder.status), 1))
              : Se("", !0),
          ]),
          _: 1,
        },
        8,
        ["onClick", "class"],
      )
    );
  }
  const Y0 = Ne(z0, [["render", G0]]);
  function di(e) {
    var t = typeof e;
    return e != null && (t == "object" || t == "function");
  }
  var J0 =
      typeof global == "object" && global && global.Object === Object && global,
    X0 = typeof self == "object" && self && self.Object === Object && self,
    Cf = J0 || X0 || Function("return this")(),
    ol = function () {
      return Cf.Date.now();
    },
    Q0 = /\s/;
  function Z0(e) {
    for (var t = e.length; t-- && Q0.test(e.charAt(t)); );
    return t;
  }
  var ev = /^\s+/;
  function tv(e) {
    return e && e.slice(0, Z0(e) + 1).replace(ev, "");
  }
  var hi = Cf.Symbol,
    Tf = Object.prototype,
    nv = Tf.hasOwnProperty,
    rv = Tf.toString,
    Br = hi ? hi.toStringTag : void 0;
  function sv(e) {
    var t = nv.call(e, Br),
      n = e[Br];
    try {
      e[Br] = void 0;
      var r = !0;
    } catch {}
    var s = rv.call(e);
    return (r && (t ? (e[Br] = n) : delete e[Br]), s);
  }
  var iv = Object.prototype,
    ov = iv.toString;
  function lv(e) {
    return ov.call(e);
  }
  var av = "[object Null]",
    cv = "[object Undefined]",
    Of = hi ? hi.toStringTag : void 0;
  function uv(e) {
    return e == null
      ? e === void 0
        ? cv
        : av
      : Of && Of in Object(e)
        ? sv(e)
        : lv(e);
  }
  function fv(e) {
    return e != null && typeof e == "object";
  }
  var dv = "[object Symbol]";
  function hv(e) {
    return typeof e == "symbol" || (fv(e) && uv(e) == dv);
  }
  var jf = NaN,
    pv = /^[-+]0x[0-9a-f]+$/i,
    yv = /^0b[01]+$/i,
    gv = /^0o[0-7]+$/i,
    mv = parseInt;
  function Af(e) {
    if (typeof e == "number") return e;
    if (hv(e)) return jf;
    if (di(e)) {
      var t = typeof e.valueOf == "function" ? e.valueOf() : e;
      e = di(t) ? t + "" : t;
    }
    if (typeof e != "string") return e === 0 ? e : +e;
    e = tv(e);
    var n = yv.test(e);
    return n || gv.test(e) ? mv(e.slice(2), n ? 2 : 8) : pv.test(e) ? jf : +e;
  }
  var vv = "Expected a function",
    bv = Math.max,
    xv = Math.min;
  function pi(e, t, n) {
    var r,
      s,
      i,
      o,
      l,
      a,
      u = 0,
      c = !1,
      f = !1,
      d = !0;
    if (typeof e != "function") throw new TypeError(vv);
    ((t = Af(t) || 0),
      di(n) &&
        ((c = !!n.leading),
        (f = "maxWait" in n),
        (i = f ? bv(Af(n.maxWait) || 0, t) : i),
        (d = "trailing" in n ? !!n.trailing : d)));
    function h(E) {
      var T = r,
        D = s;
      return ((r = s = void 0), (u = E), (o = e.apply(D, T)), o);
    }
    function p(E) {
      return ((u = E), (l = setTimeout(g, t)), c ? h(E) : o);
    }
    function y(E) {
      var T = E - a,
        D = E - u,
        R = t - T;
      return f ? xv(R, i - D) : R;
    }
    function v(E) {
      var T = E - a,
        D = E - u;
      return a === void 0 || T >= t || T < 0 || (f && D >= i);
    }
    function g() {
      var E = ol();
      if (v(E)) return m(E);
      l = setTimeout(g, y(E));
    }
    function m(E) {
      return ((l = void 0), d && r ? h(E) : ((r = s = void 0), o));
    }
    function b() {
      (l !== void 0 && clearTimeout(l), (u = 0), (r = a = s = l = void 0));
    }
    function w() {
      return l === void 0 ? o : m(ol());
    }
    function S() {
      var E = ol(),
        T = v(E);
      if (((r = arguments), (s = this), (a = E), T)) {
        if (l === void 0) return p(a);
        if (f) return (clearTimeout(l), (l = setTimeout(g, t)), h(a));
      }
      return (l === void 0 && (l = setTimeout(g, t)), o);
    }
    return ((S.cancel = b), (S.flush = w), S);
  }
  var wv = "Expected a function";
  function _v(e, t, n) {
    var r = !0,
      s = !0;
    if (typeof e != "function") throw new TypeError(wv);
    return (
      di(n) &&
        ((r = "leading" in n ? !!n.leading : r),
        (s = "trailing" in n ? !!n.trailing : s)),
      pi(e, t, { leading: r, maxWait: t, trailing: s })
    );
  }
  var tr = function () {
    return (
      (tr =
        Object.assign ||
        function (t) {
          for (var n, r = 1, s = arguments.length; r < s; r++) {
            n = arguments[r];
            for (var i in n)
              Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
          }
          return t;
        }),
      tr.apply(this, arguments)
    );
  };
  function kf(e) {
    return !e || !e.ownerDocument || !e.ownerDocument.defaultView
      ? window
      : e.ownerDocument.defaultView;
  }
  function Mf(e) {
    return !e || !e.ownerDocument ? document : e.ownerDocument;
  }
  var Pf = function (e) {
    var t = {},
      n = Array.prototype.reduce.call(
        e,
        function (r, s) {
          var i = s.name.match(/data-simplebar-(.+)/);
          if (i) {
            var o = i[1].replace(/\W+(.)/g, function (l, a) {
              return a.toUpperCase();
            });
            switch (s.value) {
              case "true":
                r[o] = !0;
                break;
              case "false":
                r[o] = !1;
                break;
              case void 0:
                r[o] = !0;
                break;
              default:
                r[o] = s.value;
            }
          }
          return r;
        },
        t,
      );
    return n;
  };
  function Rf(e, t) {
    var n;
    e && (n = e.classList).add.apply(n, t.split(" "));
  }
  function Df(e, t) {
    e &&
      t.split(" ").forEach(function (n) {
        e.classList.remove(n);
      });
  }
  function $f(e) {
    return ".".concat(e.split(" ").join("."));
  }
  var ll = !!(
      typeof window < "u" &&
      window.document &&
      window.document.createElement
    ),
    Sv = Object.freeze({
      __proto__: null,
      addClasses: Rf,
      canUseDOM: ll,
      classNamesToQuery: $f,
      getElementDocument: Mf,
      getElementWindow: kf,
      getOptions: Pf,
      removeClasses: Df,
    }),
    nr = null,
    Lf = null;
  ll &&
    window.addEventListener("resize", function () {
      Lf !== window.devicePixelRatio &&
        ((Lf = window.devicePixelRatio), (nr = null));
    });
  function If() {
    if (nr === null) {
      if (typeof document > "u") return ((nr = 0), nr);
      var e = document.body,
        t = document.createElement("div");
      (t.classList.add("simplebar-hide-scrollbar"), e.appendChild(t));
      var n = t.getBoundingClientRect().right;
      (e.removeChild(t), (nr = n));
    }
    return nr;
  }
  var yn = kf,
    al = Mf,
    Ev = Pf,
    gn = Rf,
    mn = Df,
    Ge = $f,
    Fr = (function () {
      function e(t, n) {
        n === void 0 && (n = {});
        var r = this;
        if (
          ((this.removePreventClickId = null),
          (this.minScrollbarWidth = 20),
          (this.stopScrollDelay = 175),
          (this.isScrolling = !1),
          (this.isMouseEntering = !1),
          (this.isDragging = !1),
          (this.scrollXTicking = !1),
          (this.scrollYTicking = !1),
          (this.wrapperEl = null),
          (this.contentWrapperEl = null),
          (this.contentEl = null),
          (this.offsetEl = null),
          (this.maskEl = null),
          (this.placeholderEl = null),
          (this.heightAutoObserverWrapperEl = null),
          (this.heightAutoObserverEl = null),
          (this.rtlHelpers = null),
          (this.scrollbarWidth = 0),
          (this.resizeObserver = null),
          (this.mutationObserver = null),
          (this.elStyles = null),
          (this.isRtl = null),
          (this.mouseX = 0),
          (this.mouseY = 0),
          (this.onMouseMove = function () {}),
          (this.onWindowResize = function () {}),
          (this.onStopScrolling = function () {}),
          (this.onMouseEntered = function () {}),
          (this.onScroll = function () {
            var s = yn(r.el);
            (r.scrollXTicking ||
              (s.requestAnimationFrame(r.scrollX), (r.scrollXTicking = !0)),
              r.scrollYTicking ||
                (s.requestAnimationFrame(r.scrollY), (r.scrollYTicking = !0)),
              r.isScrolling ||
                ((r.isScrolling = !0), gn(r.el, r.classNames.scrolling)),
              r.showScrollbar("x"),
              r.showScrollbar("y"),
              r.onStopScrolling());
          }),
          (this.scrollX = function () {
            (r.axis.x.isOverflowing && r.positionScrollbar("x"),
              (r.scrollXTicking = !1));
          }),
          (this.scrollY = function () {
            (r.axis.y.isOverflowing && r.positionScrollbar("y"),
              (r.scrollYTicking = !1));
          }),
          (this._onStopScrolling = function () {
            (mn(r.el, r.classNames.scrolling),
              r.options.autoHide &&
                (r.hideScrollbar("x"), r.hideScrollbar("y")),
              (r.isScrolling = !1));
          }),
          (this.onMouseEnter = function () {
            (r.isMouseEntering ||
              (gn(r.el, r.classNames.mouseEntered),
              r.showScrollbar("x"),
              r.showScrollbar("y"),
              (r.isMouseEntering = !0)),
              r.onMouseEntered());
          }),
          (this._onMouseEntered = function () {
            (mn(r.el, r.classNames.mouseEntered),
              r.options.autoHide &&
                (r.hideScrollbar("x"), r.hideScrollbar("y")),
              (r.isMouseEntering = !1));
          }),
          (this._onMouseMove = function (s) {
            ((r.mouseX = s.clientX),
              (r.mouseY = s.clientY),
              (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                r.onMouseMoveForAxis("x"),
              (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                r.onMouseMoveForAxis("y"));
          }),
          (this.onMouseLeave = function () {
            (r.onMouseMove.cancel(),
              (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                r.onMouseLeaveForAxis("x"),
              (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                r.onMouseLeaveForAxis("y"),
              (r.mouseX = -1),
              (r.mouseY = -1));
          }),
          (this._onWindowResize = function () {
            ((r.scrollbarWidth = r.getScrollbarWidth()),
              r.hideNativeScrollbar());
          }),
          (this.onPointerEvent = function (s) {
            if (
              !(
                !r.axis.x.track.el ||
                !r.axis.y.track.el ||
                !r.axis.x.scrollbar.el ||
                !r.axis.y.scrollbar.el
              )
            ) {
              var i, o;
              ((r.axis.x.track.rect =
                r.axis.x.track.el.getBoundingClientRect()),
                (r.axis.y.track.rect =
                  r.axis.y.track.el.getBoundingClientRect()),
                (r.axis.x.isOverflowing || r.axis.x.forceVisible) &&
                  (i = r.isWithinBounds(r.axis.x.track.rect)),
                (r.axis.y.isOverflowing || r.axis.y.forceVisible) &&
                  (o = r.isWithinBounds(r.axis.y.track.rect)),
                (i || o) &&
                  (s.stopPropagation(),
                  s.type === "pointerdown" &&
                    s.pointerType !== "touch" &&
                    (i &&
                      ((r.axis.x.scrollbar.rect =
                        r.axis.x.scrollbar.el.getBoundingClientRect()),
                      r.isWithinBounds(r.axis.x.scrollbar.rect)
                        ? r.onDragStart(s, "x")
                        : r.onTrackClick(s, "x")),
                    o &&
                      ((r.axis.y.scrollbar.rect =
                        r.axis.y.scrollbar.el.getBoundingClientRect()),
                      r.isWithinBounds(r.axis.y.scrollbar.rect)
                        ? r.onDragStart(s, "y")
                        : r.onTrackClick(s, "y")))));
            }
          }),
          (this.drag = function (s) {
            var i, o, l, a, u, c, f, d, h, p, y;
            if (!(!r.draggedAxis || !r.contentWrapperEl)) {
              var v,
                g = r.axis[r.draggedAxis].track,
                m =
                  (o =
                    (i = g.rect) === null || i === void 0
                      ? void 0
                      : i[r.axis[r.draggedAxis].sizeAttr]) !== null &&
                  o !== void 0
                    ? o
                    : 0,
                b = r.axis[r.draggedAxis].scrollbar,
                w =
                  (a =
                    (l = r.contentWrapperEl) === null || l === void 0
                      ? void 0
                      : l[r.axis[r.draggedAxis].scrollSizeAttr]) !== null &&
                  a !== void 0
                    ? a
                    : 0,
                S = parseInt(
                  (c =
                    (u = r.elStyles) === null || u === void 0
                      ? void 0
                      : u[r.axis[r.draggedAxis].sizeAttr]) !== null &&
                    c !== void 0
                    ? c
                    : "0px",
                  10,
                );
              (s.preventDefault(),
                s.stopPropagation(),
                r.draggedAxis === "y" ? (v = s.pageY) : (v = s.pageX));
              var E =
                v -
                ((d =
                  (f = g.rect) === null || f === void 0
                    ? void 0
                    : f[r.axis[r.draggedAxis].offsetAttr]) !== null &&
                d !== void 0
                  ? d
                  : 0) -
                r.axis[r.draggedAxis].dragOffset;
              E =
                r.draggedAxis === "x" && r.isRtl
                  ? ((p =
                      (h = g.rect) === null || h === void 0
                        ? void 0
                        : h[r.axis[r.draggedAxis].sizeAttr]) !== null &&
                    p !== void 0
                      ? p
                      : 0) -
                    b.size -
                    E
                  : E;
              var T = E / (m - b.size),
                D = T * (w - S);
              (r.draggedAxis === "x" &&
                r.isRtl &&
                (D =
                  !((y = e.getRtlHelpers()) === null || y === void 0) &&
                  y.isScrollingToNegative
                    ? -D
                    : D),
                (r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] =
                  D));
            }
          }),
          (this.onEndDrag = function (s) {
            r.isDragging = !1;
            var i = al(r.el),
              o = yn(r.el);
            (s.preventDefault(),
              s.stopPropagation(),
              mn(r.el, r.classNames.dragging),
              r.onStopScrolling(),
              i.removeEventListener("mousemove", r.drag, !0),
              i.removeEventListener("mouseup", r.onEndDrag, !0),
              (r.removePreventClickId = o.setTimeout(function () {
                (i.removeEventListener("click", r.preventClick, !0),
                  i.removeEventListener("dblclick", r.preventClick, !0),
                  (r.removePreventClickId = null));
              })));
          }),
          (this.preventClick = function (s) {
            (s.preventDefault(), s.stopPropagation());
          }),
          (this.el = t),
          (this.options = tr(tr({}, e.defaultOptions), n)),
          (this.classNames = tr(
            tr({}, e.defaultOptions.classNames),
            n.classNames,
          )),
          (this.axis = {
            x: {
              scrollOffsetAttr: "scrollLeft",
              sizeAttr: "width",
              scrollSizeAttr: "scrollWidth",
              offsetSizeAttr: "offsetWidth",
              offsetAttr: "left",
              overflowAttr: "overflowX",
              dragOffset: 0,
              isOverflowing: !0,
              forceVisible: !1,
              track: { size: null, el: null, rect: null, isVisible: !1 },
              scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
            },
            y: {
              scrollOffsetAttr: "scrollTop",
              sizeAttr: "height",
              scrollSizeAttr: "scrollHeight",
              offsetSizeAttr: "offsetHeight",
              offsetAttr: "top",
              overflowAttr: "overflowY",
              dragOffset: 0,
              isOverflowing: !0,
              forceVisible: !1,
              track: { size: null, el: null, rect: null, isVisible: !1 },
              scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
            },
          }),
          typeof this.el != "object" || !this.el.nodeName)
        )
          throw new Error(
            "Argument passed to SimpleBar must be an HTML element instead of ".concat(
              this.el,
            ),
          );
        ((this.onMouseMove = _v(this._onMouseMove, 64)),
          (this.onWindowResize = pi(this._onWindowResize, 64, { leading: !0 })),
          (this.onStopScrolling = pi(
            this._onStopScrolling,
            this.stopScrollDelay,
          )),
          (this.onMouseEntered = pi(
            this._onMouseEntered,
            this.stopScrollDelay,
          )),
          this.init());
      }
      return (
        (e.getRtlHelpers = function () {
          if (e.rtlHelpers) return e.rtlHelpers;
          var t = document.createElement("div");
          t.innerHTML =
            '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
          var n = t.firstElementChild,
            r = n?.firstElementChild;
          if (!r) return null;
          (document.body.appendChild(n), (n.scrollLeft = 0));
          var s = e.getOffset(n),
            i = e.getOffset(r);
          n.scrollLeft = -999;
          var o = e.getOffset(r);
          return (
            document.body.removeChild(n),
            (e.rtlHelpers = {
              isScrollOriginAtZero: s.left !== i.left,
              isScrollingToNegative: i.left !== o.left,
            }),
            e.rtlHelpers
          );
        }),
        (e.prototype.getScrollbarWidth = function () {
          try {
            return (this.contentWrapperEl &&
              getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar")
                .display === "none") ||
              "scrollbarWidth" in document.documentElement.style ||
              "-ms-overflow-style" in document.documentElement.style
              ? 0
              : If();
          } catch {
            return If();
          }
        }),
        (e.getOffset = function (t) {
          var n = t.getBoundingClientRect(),
            r = al(t),
            s = yn(t);
          return {
            top: n.top + (s.pageYOffset || r.documentElement.scrollTop),
            left: n.left + (s.pageXOffset || r.documentElement.scrollLeft),
          };
        }),
        (e.prototype.init = function () {
          ll &&
            (this.initDOM(),
            (this.rtlHelpers = e.getRtlHelpers()),
            (this.scrollbarWidth = this.getScrollbarWidth()),
            this.recalculate(),
            this.initListeners());
        }),
        (e.prototype.initDOM = function () {
          var t, n;
          ((this.wrapperEl = this.el.querySelector(
            Ge(this.classNames.wrapper),
          )),
            (this.contentWrapperEl =
              this.options.scrollableNode ||
              this.el.querySelector(Ge(this.classNames.contentWrapper))),
            (this.contentEl =
              this.options.contentNode ||
              this.el.querySelector(Ge(this.classNames.contentEl))),
            (this.offsetEl = this.el.querySelector(Ge(this.classNames.offset))),
            (this.maskEl = this.el.querySelector(Ge(this.classNames.mask))),
            (this.placeholderEl = this.findChild(
              this.wrapperEl,
              Ge(this.classNames.placeholder),
            )),
            (this.heightAutoObserverWrapperEl = this.el.querySelector(
              Ge(this.classNames.heightAutoObserverWrapperEl),
            )),
            (this.heightAutoObserverEl = this.el.querySelector(
              Ge(this.classNames.heightAutoObserverEl),
            )),
            (this.axis.x.track.el = this.findChild(
              this.el,
              ""
                .concat(Ge(this.classNames.track))
                .concat(Ge(this.classNames.horizontal)),
            )),
            (this.axis.y.track.el = this.findChild(
              this.el,
              ""
                .concat(Ge(this.classNames.track))
                .concat(Ge(this.classNames.vertical)),
            )),
            (this.axis.x.scrollbar.el =
              ((t = this.axis.x.track.el) === null || t === void 0
                ? void 0
                : t.querySelector(Ge(this.classNames.scrollbar))) || null),
            (this.axis.y.scrollbar.el =
              ((n = this.axis.y.track.el) === null || n === void 0
                ? void 0
                : n.querySelector(Ge(this.classNames.scrollbar))) || null),
            this.options.autoHide ||
              (gn(this.axis.x.scrollbar.el, this.classNames.visible),
              gn(this.axis.y.scrollbar.el, this.classNames.visible)));
        }),
        (e.prototype.initListeners = function () {
          var t = this,
            n,
            r = yn(this.el);
          if (
            (this.el.addEventListener("mouseenter", this.onMouseEnter),
            this.el.addEventListener("pointerdown", this.onPointerEvent, !0),
            this.el.addEventListener("mousemove", this.onMouseMove),
            this.el.addEventListener("mouseleave", this.onMouseLeave),
            (n = this.contentWrapperEl) === null ||
              n === void 0 ||
              n.addEventListener("scroll", this.onScroll),
            r.addEventListener("resize", this.onWindowResize),
            !!this.contentEl)
          ) {
            if (window.ResizeObserver) {
              var s = !1,
                i = r.ResizeObserver || ResizeObserver;
              ((this.resizeObserver = new i(function () {
                s &&
                  r.requestAnimationFrame(function () {
                    t.recalculate();
                  });
              })),
                this.resizeObserver.observe(this.el),
                this.resizeObserver.observe(this.contentEl),
                r.requestAnimationFrame(function () {
                  s = !0;
                }));
            }
            ((this.mutationObserver = new r.MutationObserver(function () {
              r.requestAnimationFrame(function () {
                t.recalculate();
              });
            })),
              this.mutationObserver.observe(this.contentEl, {
                childList: !0,
                subtree: !0,
                characterData: !0,
              }));
          }
        }),
        (e.prototype.recalculate = function () {
          if (
            !(
              !this.heightAutoObserverEl ||
              !this.contentEl ||
              !this.contentWrapperEl ||
              !this.wrapperEl ||
              !this.placeholderEl
            )
          ) {
            var t = yn(this.el);
            ((this.elStyles = t.getComputedStyle(this.el)),
              (this.isRtl = this.elStyles.direction === "rtl"));
            var n = this.contentEl.offsetWidth,
              r = this.heightAutoObserverEl.offsetHeight <= 1,
              s = this.heightAutoObserverEl.offsetWidth <= 1 || n > 0,
              i = this.contentWrapperEl.offsetWidth,
              o = this.elStyles.overflowX,
              l = this.elStyles.overflowY;
            ((this.contentEl.style.padding = ""
              .concat(this.elStyles.paddingTop, " ")
              .concat(this.elStyles.paddingRight, " ")
              .concat(this.elStyles.paddingBottom, " ")
              .concat(this.elStyles.paddingLeft)),
              (this.wrapperEl.style.margin = "-"
                .concat(this.elStyles.paddingTop, " -")
                .concat(this.elStyles.paddingRight, " -")
                .concat(this.elStyles.paddingBottom, " -")
                .concat(this.elStyles.paddingLeft)));
            var a = this.contentEl.scrollHeight,
              u = this.contentEl.scrollWidth;
            ((this.contentWrapperEl.style.height = r ? "auto" : "100%"),
              (this.placeholderEl.style.width = s
                ? "".concat(n || u, "px")
                : "auto"),
              (this.placeholderEl.style.height = "".concat(a, "px")));
            var c = this.contentWrapperEl.offsetHeight;
            ((this.axis.x.isOverflowing = n !== 0 && u > n),
              (this.axis.y.isOverflowing = a > c),
              (this.axis.x.isOverflowing =
                o === "hidden" ? !1 : this.axis.x.isOverflowing),
              (this.axis.y.isOverflowing =
                l === "hidden" ? !1 : this.axis.y.isOverflowing),
              (this.axis.x.forceVisible =
                this.options.forceVisible === "x" ||
                this.options.forceVisible === !0),
              (this.axis.y.forceVisible =
                this.options.forceVisible === "y" ||
                this.options.forceVisible === !0),
              this.hideNativeScrollbar());
            var f = this.axis.x.isOverflowing ? this.scrollbarWidth : 0,
              d = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
            ((this.axis.x.isOverflowing =
              this.axis.x.isOverflowing && u > i - d),
              (this.axis.y.isOverflowing =
                this.axis.y.isOverflowing && a > c - f),
              (this.axis.x.scrollbar.size = this.getScrollbarSize("x")),
              (this.axis.y.scrollbar.size = this.getScrollbarSize("y")),
              this.axis.x.scrollbar.el &&
                (this.axis.x.scrollbar.el.style.width = "".concat(
                  this.axis.x.scrollbar.size,
                  "px",
                )),
              this.axis.y.scrollbar.el &&
                (this.axis.y.scrollbar.el.style.height = "".concat(
                  this.axis.y.scrollbar.size,
                  "px",
                )),
              this.positionScrollbar("x"),
              this.positionScrollbar("y"),
              this.toggleTrackVisibility("x"),
              this.toggleTrackVisibility("y"));
          }
        }),
        (e.prototype.getScrollbarSize = function (t) {
          var n, r;
          if (
            (t === void 0 && (t = "y"),
            !this.axis[t].isOverflowing || !this.contentEl)
          )
            return 0;
          var s = this.contentEl[this.axis[t].scrollSizeAttr],
            i =
              (r =
                (n = this.axis[t].track.el) === null || n === void 0
                  ? void 0
                  : n[this.axis[t].offsetSizeAttr]) !== null && r !== void 0
                ? r
                : 0,
            o = i / s,
            l;
          return (
            (l = Math.max(~~(o * i), this.options.scrollbarMinSize)),
            this.options.scrollbarMaxSize &&
              (l = Math.min(l, this.options.scrollbarMaxSize)),
            l
          );
        }),
        (e.prototype.positionScrollbar = function (t) {
          var n, r, s;
          t === void 0 && (t = "y");
          var i = this.axis[t].scrollbar;
          if (
            !(
              !this.axis[t].isOverflowing ||
              !this.contentWrapperEl ||
              !i.el ||
              !this.elStyles
            )
          ) {
            var o = this.contentWrapperEl[this.axis[t].scrollSizeAttr],
              l =
                ((n = this.axis[t].track.el) === null || n === void 0
                  ? void 0
                  : n[this.axis[t].offsetSizeAttr]) || 0,
              a = parseInt(this.elStyles[this.axis[t].sizeAttr], 10),
              u = this.contentWrapperEl[this.axis[t].scrollOffsetAttr];
            ((u =
              t === "x" &&
              this.isRtl &&
              !((r = e.getRtlHelpers()) === null || r === void 0) &&
              r.isScrollOriginAtZero
                ? -u
                : u),
              t === "x" &&
                this.isRtl &&
                (u =
                  !((s = e.getRtlHelpers()) === null || s === void 0) &&
                  s.isScrollingToNegative
                    ? u
                    : -u));
            var c = u / (o - a),
              f = ~~((l - i.size) * c);
            ((f = t === "x" && this.isRtl ? -f + (l - i.size) : f),
              (i.el.style.transform =
                t === "x"
                  ? "translate3d(".concat(f, "px, 0, 0)")
                  : "translate3d(0, ".concat(f, "px, 0)")));
          }
        }),
        (e.prototype.toggleTrackVisibility = function (t) {
          t === void 0 && (t = "y");
          var n = this.axis[t].track.el,
            r = this.axis[t].scrollbar.el;
          !n ||
            !r ||
            !this.contentWrapperEl ||
            (this.axis[t].isOverflowing || this.axis[t].forceVisible
              ? ((n.style.visibility = "visible"),
                (this.contentWrapperEl.style[this.axis[t].overflowAttr] =
                  "scroll"),
                this.el.classList.add(
                  "".concat(this.classNames.scrollable, "-").concat(t),
                ))
              : ((n.style.visibility = "hidden"),
                (this.contentWrapperEl.style[this.axis[t].overflowAttr] =
                  "hidden"),
                this.el.classList.remove(
                  "".concat(this.classNames.scrollable, "-").concat(t),
                )),
            this.axis[t].isOverflowing
              ? (r.style.display = "block")
              : (r.style.display = "none"));
        }),
        (e.prototype.showScrollbar = function (t) {
          (t === void 0 && (t = "y"),
            this.axis[t].isOverflowing &&
              !this.axis[t].scrollbar.isVisible &&
              (gn(this.axis[t].scrollbar.el, this.classNames.visible),
              (this.axis[t].scrollbar.isVisible = !0)));
        }),
        (e.prototype.hideScrollbar = function (t) {
          (t === void 0 && (t = "y"),
            !this.isDragging &&
              this.axis[t].isOverflowing &&
              this.axis[t].scrollbar.isVisible &&
              (mn(this.axis[t].scrollbar.el, this.classNames.visible),
              (this.axis[t].scrollbar.isVisible = !1)));
        }),
        (e.prototype.hideNativeScrollbar = function () {
          this.offsetEl &&
            ((this.offsetEl.style[this.isRtl ? "left" : "right"] =
              this.axis.y.isOverflowing || this.axis.y.forceVisible
                ? "-".concat(this.scrollbarWidth, "px")
                : "0px"),
            (this.offsetEl.style.bottom =
              this.axis.x.isOverflowing || this.axis.x.forceVisible
                ? "-".concat(this.scrollbarWidth, "px")
                : "0px"));
        }),
        (e.prototype.onMouseMoveForAxis = function (t) {
          t === void 0 && (t = "y");
          var n = this.axis[t];
          !n.track.el ||
            !n.scrollbar.el ||
            ((n.track.rect = n.track.el.getBoundingClientRect()),
            (n.scrollbar.rect = n.scrollbar.el.getBoundingClientRect()),
            this.isWithinBounds(n.track.rect)
              ? (this.showScrollbar(t),
                gn(n.track.el, this.classNames.hover),
                this.isWithinBounds(n.scrollbar.rect)
                  ? gn(n.scrollbar.el, this.classNames.hover)
                  : mn(n.scrollbar.el, this.classNames.hover))
              : (mn(n.track.el, this.classNames.hover),
                this.options.autoHide && this.hideScrollbar(t)));
        }),
        (e.prototype.onMouseLeaveForAxis = function (t) {
          (t === void 0 && (t = "y"),
            mn(this.axis[t].track.el, this.classNames.hover),
            mn(this.axis[t].scrollbar.el, this.classNames.hover),
            this.options.autoHide && this.hideScrollbar(t));
        }),
        (e.prototype.onDragStart = function (t, n) {
          var r;
          (n === void 0 && (n = "y"), (this.isDragging = !0));
          var s = al(this.el),
            i = yn(this.el),
            o = this.axis[n].scrollbar,
            l = n === "y" ? t.pageY : t.pageX;
          ((this.axis[n].dragOffset =
            l -
            (((r = o.rect) === null || r === void 0
              ? void 0
              : r[this.axis[n].offsetAttr]) || 0)),
            (this.draggedAxis = n),
            gn(this.el, this.classNames.dragging),
            s.addEventListener("mousemove", this.drag, !0),
            s.addEventListener("mouseup", this.onEndDrag, !0),
            this.removePreventClickId === null
              ? (s.addEventListener("click", this.preventClick, !0),
                s.addEventListener("dblclick", this.preventClick, !0))
              : (i.clearTimeout(this.removePreventClickId),
                (this.removePreventClickId = null)));
        }),
        (e.prototype.onTrackClick = function (t, n) {
          var r = this,
            s,
            i,
            o,
            l;
          n === void 0 && (n = "y");
          var a = this.axis[n];
          if (
            !(
              !this.options.clickOnTrack ||
              !a.scrollbar.el ||
              !this.contentWrapperEl
            )
          ) {
            t.preventDefault();
            var u = yn(this.el);
            this.axis[n].scrollbar.rect =
              a.scrollbar.el.getBoundingClientRect();
            var c = this.axis[n].scrollbar,
              f =
                (i =
                  (s = c.rect) === null || s === void 0
                    ? void 0
                    : s[this.axis[n].offsetAttr]) !== null && i !== void 0
                  ? i
                  : 0,
              d = parseInt(
                (l =
                  (o = this.elStyles) === null || o === void 0
                    ? void 0
                    : o[this.axis[n].sizeAttr]) !== null && l !== void 0
                  ? l
                  : "0px",
                10,
              ),
              h = this.contentWrapperEl[this.axis[n].scrollOffsetAttr],
              p = n === "y" ? this.mouseY - f : this.mouseX - f,
              y = p < 0 ? -1 : 1,
              v = y === -1 ? h - d : h + d,
              g = 40,
              m = function () {
                r.contentWrapperEl &&
                  (y === -1
                    ? h > v &&
                      ((h -= g),
                      (r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = h),
                      u.requestAnimationFrame(m))
                    : h < v &&
                      ((h += g),
                      (r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = h),
                      u.requestAnimationFrame(m)));
              };
            m();
          }
        }),
        (e.prototype.getContentElement = function () {
          return this.contentEl;
        }),
        (e.prototype.getScrollElement = function () {
          return this.contentWrapperEl;
        }),
        (e.prototype.removeListeners = function () {
          var t = yn(this.el);
          (this.el.removeEventListener("mouseenter", this.onMouseEnter),
            this.el.removeEventListener("pointerdown", this.onPointerEvent, !0),
            this.el.removeEventListener("mousemove", this.onMouseMove),
            this.el.removeEventListener("mouseleave", this.onMouseLeave),
            this.contentWrapperEl &&
              this.contentWrapperEl.removeEventListener(
                "scroll",
                this.onScroll,
              ),
            t.removeEventListener("resize", this.onWindowResize),
            this.mutationObserver && this.mutationObserver.disconnect(),
            this.resizeObserver && this.resizeObserver.disconnect(),
            this.onMouseMove.cancel(),
            this.onWindowResize.cancel(),
            this.onStopScrolling.cancel(),
            this.onMouseEntered.cancel());
        }),
        (e.prototype.unMount = function () {
          this.removeListeners();
        }),
        (e.prototype.isWithinBounds = function (t) {
          return (
            this.mouseX >= t.left &&
            this.mouseX <= t.left + t.width &&
            this.mouseY >= t.top &&
            this.mouseY <= t.top + t.height
          );
        }),
        (e.prototype.findChild = function (t, n) {
          var r =
            t.matches ||
            t.webkitMatchesSelector ||
            t.mozMatchesSelector ||
            t.msMatchesSelector;
          return Array.prototype.filter.call(t.children, function (s) {
            return r.call(s, n);
          })[0];
        }),
        (e.rtlHelpers = null),
        (e.defaultOptions = {
          forceVisible: !1,
          clickOnTrack: !0,
          scrollbarMinSize: 25,
          scrollbarMaxSize: 0,
          ariaLabel: "scrollable content",
          tabIndex: 0,
          classNames: {
            contentEl: "simplebar-content",
            contentWrapper: "simplebar-content-wrapper",
            offset: "simplebar-offset",
            mask: "simplebar-mask",
            wrapper: "simplebar-wrapper",
            placeholder: "simplebar-placeholder",
            scrollbar: "simplebar-scrollbar",
            track: "simplebar-track",
            heightAutoObserverWrapperEl:
              "simplebar-height-auto-observer-wrapper",
            heightAutoObserverEl: "simplebar-height-auto-observer",
            visible: "simplebar-visible",
            horizontal: "simplebar-horizontal",
            vertical: "simplebar-vertical",
            hover: "simplebar-hover",
            dragging: "simplebar-dragging",
            scrolling: "simplebar-scrolling",
            scrollable: "simplebar-scrollable",
            mouseEntered: "simplebar-mouse-entered",
          },
          scrollableNode: null,
          contentNode: null,
          autoHide: !0,
        }),
        (e.getOptions = Ev),
        (e.helpers = Sv),
        e
      );
    })(),
    kn = function () {
      return (
        (kn =
          Object.assign ||
          function (t) {
            for (var n, r = 1, s = arguments.length; r < s; r++) {
              n = arguments[r];
              for (var i in n)
                Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
            }
            return t;
          }),
        kn.apply(this, arguments)
      );
    },
    Cv = { beforeUnmount: "beforeUnmount" },
    Vr;
  function Tv(e) {
    var t,
      n = e.h,
      r = e.emit,
      s = e.slots,
      i = e.props,
      o = function (a) {
        return r("scroll", a);
      },
      l = kn(kn({}, Fr.defaultOptions.classNames), i.classNames);
    return n("div", kn({ ref: "element" }, { "data-simplebar": "init" }), [
      n("div", { class: l.wrapper }, [
        n("div", { class: l.heightAutoObserverWrapperEl }, [
          n("div", { class: l.heightAutoObserverEl }),
        ]),
        n("div", { class: l.mask }, [
          n("div", { class: l.offset }, [
            n(
              "div",
              kn(
                kn(
                  {},
                  {
                    onScroll: o,
                    class: l.contentWrapper,
                    tabIndex: i.tabIndex || Fr.defaultOptions.tabIndex,
                    role: "region",
                    "aria-label": i.ariaLabel || Fr.defaultOptions.ariaLabel,
                  },
                ),
                { ref: "scrollElement" },
              ),
              [
                n(
                  "div",
                  { class: l.contentEl, ref: "contentElement" },
                  (t = s.default) === null || t === void 0 ? void 0 : t.call(s),
                ),
              ],
            ),
          ]),
        ]),
        n("div", { class: l.placeholder }),
      ]),
      n("div", { class: "".concat(l.track, " simplebar-horizontal") }, [
        n("div", { class: l.scrollbar }),
      ]),
      n("div", { class: "".concat(l.track, " simplebar-vertical") }, [
        n("div", { class: l.scrollbar }),
      ]),
    ]);
  }
  var Ov = Z(
    ((Vr = {
      name: "simplebar-vue",
      props: {
        autoHide: { type: Boolean, default: void 0 },
        classNames: Object,
        forceVisible: {
          type: [Boolean, String],
          validator: function (e) {
            return typeof e == "boolean" || e === "x" || e === "y";
          },
          default: void 0,
        },
        ariaLabel: String,
        tabIndex: Number,
        direction: {
          type: String,
          validator: function (e) {
            return e === "ltr" || e === "rtl";
          },
        },
        timeout: Number,
        clickOnTrack: { type: Boolean, default: void 0 },
        scrollbarMinSize: Number,
        scrollbarMaxSize: Number,
      },
      emits: ["scroll"],
      data: function () {
        return {};
      },
      mounted: function () {
        for (
          var e = Fr.getOptions(this.$refs.element.attributes),
            t = 0,
            n = Object.entries(this.$props);
          t < n.length;
          t++
        ) {
          var r = n[t],
            s = r[0],
            i = r[1];
          i != null && typeof i != "function" && (e[s] = i);
        }
        ((this.SimpleBar = new Fr(this.$refs.element, e)),
          (this.scrollElement = this.$refs.scrollElement),
          (this.contentElement = this.$refs.contentElement));
      },
    }),
    (Vr[Cv.beforeUnmount] = function () {
      var e;
      ((e = this.SimpleBar) === null || e === void 0 || e.unMount(),
        (this.SimpleBar = void 0));
    }),
    (Vr.methods = {
      recalculate: function () {
        var e;
        (e = this.SimpleBar) === null || e === void 0 || e.recalculate();
      },
    }),
    (Vr.render = function (e) {
      var t = this;
      return Tv({
        h: typeof e == "function" ? e : cn,
        emit: function () {
          for (var n = [], r = 0; r < arguments.length; r++)
            n[r] = arguments[r];
          return t.$emit.apply(t, n);
        },
        slots: this.$slots,
        props: this.$props,
      });
    }),
    Vr),
  );
  const jv = Z({
      name: "Column",
      components: { Simplebar: Ov },
      props: {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    }),
    Av = { class: "px-4 py-6 sm:px-0" },
    kv = { class: "text-lg leading-6 font-medium text-gray-900" },
    Mv = { class: "mt-1 text-sm text-gray-500" };
  function Pv(e, t, n, r, s, i) {
    const o = de("Simplebar");
    return (
      M(),
      Y(
        o,
        {
          class:
            "flex-none transition ease-in-out duration-500 py-6 sm:px-6 lg:px-8",
          transition: "expand",
        },
        {
          default: se(() => [
            J("div", Av, [
              J("h3", kv, _e(e.title), 1),
              J("p", Mv, _e(e.description), 1),
            ]),
            he(e.$slots, "default"),
          ]),
          _: 3,
        },
      )
    );
  }
  const Nf = Ne(jv, [["render", Pv]]),
    Rv = Z({
      name: "WorkOrderList",
      components: { WorkOrderWidget: Y0, Column: Nf },
      props: {
        workOrders: { type: Array, default: () => [] },
        selectedWorkOrder: Object,
      },
      methods: {
        selectWorkOrder(e) {
          this.selectedWorkOrder && this.selectedWorkOrder.name === e.name
            ? (this.$emit("select", null), (this.isSelected = !1))
            : this.$emit("select", e);
        },
      },
    });
  function Dv(e, t, n, r, s, i) {
    const o = de("WorkOrderWidget"),
      l = de("Column");
    return (
      M(),
      Y(
        l,
        {
          class: we({
            "w-full": !e.selectedWorkOrder,
            "w-1/2": e.selectedWorkOrder,
          }),
          title: "Work Orders",
          description: "Select a work order to view job cards",
        },
        {
          default: se(() => [
            J("div", null, [
              (M(!0),
              ee(
                pe,
                null,
                Hn(
                  e.workOrders,
                  (a) => (
                    M(),
                    Y(
                      o,
                      {
                        key: a.name,
                        workOrder: a,
                        isSelected:
                          e.selectedWorkOrder &&
                          e.selectedWorkOrder.name === a.name,
                        onClick: (u) => e.selectWorkOrder(a),
                      },
                      null,
                      8,
                      ["workOrder", "isSelected", "onClick"],
                    )
                  ),
                ),
                128,
              )),
            ]),
          ]),
          _: 1,
        },
        8,
        ["class"],
      )
    );
  }
  const $v = Ne(Rv, [["render", Dv]]),
    Lv = {
      name: "Button",
      props: { text: String, label: String },
      methods: {
        updatelabel(e) {
          (console.log(e),
            e === "Work In Progress"
              ? console.log("Good so far")
              : e === "Completed" && console.log("Good so far 2"));
        },
        starttimer() {
          console.log("aye yo");
        },
        stoptimer() {
          console.log("aye yo yo");
        },
      },
    };
  function Iv(e, t, n, r, s, i) {
    return (
      M(),
      ee(
        pe,
        null,
        [
          J(
            "button",
            {
              class: "btn",
              onClick:
                t[0] || (t[0] = (...o) => i.starttimer && i.starttimer(...o)),
            },
            "Start",
          ),
          J(
            "button",
            {
              class: "btn",
              onClick:
                t[1] || (t[1] = (...o) => i.stoptimer && i.stoptimer(...o)),
            },
            "Stop",
          ),
        ],
        64,
      )
    );
  }
  const Nv = Z({
      name: "JobCardWidget",
      components: {
        Button: Ne(Lv, [
          ["render", Iv],
          ["__scopeId", "data-v-dbc45126"],
        ]),
        Card: fi,
        TimerWidget: Ef,
      },
      props: {
        jobCard: { type: Object, default: () => {} },
        employee_id: String,
      },
      data() {
        return { active_user: !1 };
      },
      methods: {
        emit_timer(e) {
          e === !0 ? (this.active_user = !0) : (this.active_user = !1);
        },
        emit_logged_out_card(e) {
          this.$emit("emit_logged_out_card", e);
        },
      },
      mounted() {},
    }),
    Bv = { class: "w-2/5" };
  function Fv(e, t, n, r, s, i) {
    const o = de("TimerWidget"),
      l = de("Card");
    return (
      M(),
      Y(
        l,
        {
          class: we([
            "flex flex-row font-sans text-black text-lg lg:text-4xl",
            {
              "bg-green-100": this.active_user,
              "bg-white": this.active_user === !1,
            },
          ]),
        },
        {
          default: se(() => [
            J("div", Bv, _e(e.jobCard.operation), 1),
            le(
              o,
              {
                class: "w-3/5",
                jobCard: e.jobCard,
                employee_id: e.employee_id,
                onEmit_timer: e.emit_timer,
                onEmit_logged_out_card: e.emit_logged_out_card,
              },
              null,
              8,
              [
                "jobCard",
                "employee_id",
                "onEmit_timer",
                "onEmit_logged_out_card",
              ],
            ),
          ]),
          _: 1,
        },
        8,
        ["class"],
      )
    );
  }
  const Vv = Z({
      name: "JobCards",
      components: { JobCardWidget: Ne(Nv, [["render", Fv]]), Column: Nf },
      props: {
        jobCards: { type: Array, default: () => [] },
        employee_id: String,
      },
      data() {
        return { jobCard: [] };
      },
      methods: {
        emit_logged_out_card(e) {
          for (let t = 0; t < this.jobCards.length; t++)
            this.jobCards[t].name === e.card_logged_out[0].parent
              ? (this.jobCards[t].is_active = !1)
              : this.jobCards[t].name === e.card_logged_in.name &&
                (this.jobCards[t].is_active = !0);
        },
      },
      mounted() {},
    }),
    Hv = { id: "JobCards" };
  function zv(e, t, n, r, s, i) {
    const o = de("JobCardWidget"),
      l = de("Column");
    return (
      M(),
      Y(
        l,
        {
          title: "Job Cards",
          description: "Select a job card to start the timer",
          class: "w-1/2",
        },
        {
          default: se(() => [
            J("div", Hv, [
              (M(!0),
              ee(
                pe,
                null,
                Hn(
                  e.jobCards,
                  (a) => (
                    M(),
                    Y(
                      o,
                      {
                        name: "job_card_widget",
                        key: a.name,
                        jobCard: a,
                        employee_id: e.employee_id,
                        onEmit_logged_out_card: e.emit_logged_out_card,
                      },
                      null,
                      8,
                      ["jobCard", "employee_id", "onEmit_logged_out_card"],
                    )
                  ),
                ),
                128,
              )),
            ]),
          ]),
          _: 1,
        },
      )
    );
  }
  const Wv = Ne(Vv, [["render", zv]]),
    Uv = Z({
      name: "Employee List",
      components: { Card: fi },
      inheritAttrs: !1,
      props: { employees: { type: Array } },
      data() {
        return { employee: "" };
      },
      methods: {
        send_employee(e) {
          this.$emit("send_employee", e);
        },
      },
    }),
    Kv = { class: "flex-row overflow-x-auto w-screen" },
    qv = { class: "text-4xl center font-thin" };
  function Gv(e, t, n, r, s, i) {
    const o = de("Card");
    return (
      M(),
      ee("div", Kv, [
        (M(!0),
        ee(
          pe,
          null,
          Hn(
            e.employees,
            (l) => (
              M(),
              Y(
                o,
                {
                  class:
                    "w-full p-4 m-4 bg-white shadow-lg rounded-lg box-border h-20 hover:bg-blue-300 justify_content:center",
                  key: l.id,
                  onClick: (a) => e.send_employee(l),
                },
                { default: se(() => [J("h1", qv, _e(l.name), 1)]), _: 2 },
                1032,
                ["onClick"],
              )
            ),
          ),
          128,
        )),
      ])
    );
  }
  const Bf = Ne(Uv, [["render", Gv]]),
    Yv = Z({
      name: "LogInModule",
      components: { Card: fi, Button: Tm },
      data() {
        return {
          email: "",
          password: "",
          authenticated: !1,
          error_message: "",
          return_triggered: !1,
        };
      },
      methods: {
        async submit_login(e, t) {
          (await at("employee_timeclock.www.job_timeclock.verify_login", e))?.status ===
          "success"
            ? ((this.verified = !0),
              (this.authenticated = !0),
              this.$emit("submit_login", this.authenticated))
            : ((this.error_message =
                "Incorrect Login and/or Password. Please try again."),
              (this.password = ""));
        },
        return_trigger() {
          ((this.return_triggered = !0),
            this.$emit("return_triggered", this.return_triggered));
        },
      },
      unmounted() {
        ((this.password = ""),
          (this.verified = !1),
          (this.error_message = ""),
          (this.return_triggered = !1));
      },
    }),
    Jv = { class: "backdrop" };
  function Xv(e, t, n, r, s, i) {
    const o = de("Card");
    return (
      M(),
      ee("div", Jv, [
        le(
          o,
          { class: "card" },
          {
            default: se(() => [
              t[4] || (t[4] = J("h3", null, "Username:", -1)),
              t[5] || (t[5] = Ue()),
              ta(
                J(
                  "input",
                  {
                    type: "email",
                    required: "",
                    "onUpdate:modelValue":
                      t[0] || (t[0] = (l) => (e.email = l)),
                  },
                  null,
                  512,
                ),
                [[Ac, e.email]],
              ),
              t[6] || (t[6] = J("h3", null, "Password:", -1)),
              t[7] || (t[7] = Ue()),
              ta(
                J(
                  "input",
                  {
                    type: "password",
                    required: "",
                    "onUpdate:modelValue":
                      t[1] || (t[1] = (l) => (e.password = l)),
                  },
                  null,
                  512,
                ),
                [[Ac, e.password]],
              ),
              Ue(" " + _e(this.error_message) + " ", 1),
              J(
                "button",
                {
                  class: "btn",
                  onClick:
                    t[2] ||
                    (t[2] = (l) => e.submit_login(this.email, this.password)),
                },
                " Submit ",
              ),
              J(
                "button",
                {
                  class: "btn",
                  onClick:
                    t[3] ||
                    (t[3] = (...l) =>
                      e.return_trigger && e.return_trigger(...l)),
                },
                " Return ",
              ),
            ]),
            _: 1,
          },
        ),
      ])
    );
  }
  const Qv = Z({
      name: "StartScreen",
      components: {
        EmployeeList: Bf,
        LogInModule: Ne(Yv, [
          ["render", Xv],
          ["__scopeId", "data-v-fea387e5"],
        ]),
        AuthorizationMessage: Yu,
      },
      props: { employees: { type: Array } },
      data() {
        return { log_in: !1, authenticated: !1 };
      },
      methods: {
        log_in_module() {
          (console.log("logged in dude."), (this.log_in = !0));
        },
        return_triggered(e) {
          e && ((this.log_in = !1), console.log("aye"));
        },
        send_login(e) {
          this.$emit("send_login", e);
        },
        return_auth(e) {
          (console.log("dope"), (this.authenticated = e), (this.log_in = !1));
        },
        return_employee(e) {
          this.$emit("send_employee", e);
        },
      },
      mounted() {
        const e = onScan.attachTo(document, {
          onScan: this.send_scan,
          ignoreIfFocusOn: ".frappe-input",
        });
        ((this.scanner = e), console.log(this.employees));
      },
      unmounted() {
        ((this.employees = []), (this.log_in = !1));
      },
    }),
    Zv = {
      key: 0,
      class: "h-screen flex flex-col justify-around items-center",
    },
    eb = { key: 1 },
    tb = { key: 2 };
  function nb(e, t, n, r, s, i) {
    const o = de("AuthorizationMessage"),
      l = de("LogInModule"),
      a = de("EmployeeList");
    return (
      M(),
      ee(
        pe,
        null,
        [
          e.log_in === !1 && this.authenticated === !1
            ? (M(),
              ee("div", Zv, [
                J(
                  "button",
                  {
                    class:
                      "bg-green-300 rounded-full text-center-white me-2 mb-2 px-5 py-2 active:bg-green-500 focus:outline-none focus:ring focus:ring-green-200",
                    onClick:
                      t[0] ||
                      (t[0] = (...u) =>
                        e.log_in_module && e.log_in_module(...u)),
                  },
                  "ERP Log In",
                ),
                t[1] || (t[1] = J("p", { class: "text-4xl" }, "or", -1)),
                le(o),
              ]))
            : Se("", !0),
          e.log_in
            ? (M(),
              ee("div", eb, [
                le(
                  l,
                  {
                    onReturn_triggered: e.return_triggered,
                    onSubmit_login: e.return_auth,
                  },
                  null,
                  8,
                  ["onReturn_triggered", "onSubmit_login"],
                ),
              ]))
            : Se("", !0),
          e.log_in === !1 && this.authenticated
            ? (M(),
              ee("div", tb, [
                t[2] ||
                  (t[2] = J(
                    "h1",
                    { class: "text-3xl font-bold top-50" },
                    "Employee List",
                    -1,
                  )),
                t[3] || (t[3] = J("p", null, "Click who you are:", -1)),
                le(
                  a,
                  {
                    employees: e.employees,
                    onSend_employee: e.return_employee,
                  },
                  null,
                  8,
                  ["employees", "onSend_employee"],
                ),
              ]))
            : Se("", !0),
        ],
        64,
      )
    );
  }
  const rb = Ne(Qv, [
      ["render", nb],
      ["__scopeId", "data-v-5fe76613"],
    ]),
    sb = Z({
      name: "DropDownMenu",
      components: { MenuItems: K1, MenuItem: q1, Menu: W1, MenuButton: U1 },
      data() {
        return {
          selected: "Workstation",
          active: !1,
          workstations: [
            { id: 1, name: "Planer" },
            { id: 2, name: "CNC" },
            { id: 3, name: "Hand Sanding" },
            { id: 4, name: "Sander/Stainer" },
            { id: 5, name: "Truss Assembly" },
            { id: 6, name: "Hardware" },
            { id: 7, name: "T&G Cutting" },
          ],
          workstation_name: "Workstation",
        };
      },
      computed: {
        workstation_name() {
          this.state
            ? (this.workstation_name = this.state)
            : this.workstation_name;
        },
      },
      watch: {},
      methods: {
        toggle() {
          this.active = !this.active;
        },
        send_workstation(e) {
          (this.$emit("send_workstation", e.name),
            (this.selected = e.name),
            Lc("defaultWorkstation", e.name));
        },
        mounted() {
          this.state && (this.selected = this.state);
        },
      },
    }),
    ib = { class: "py-1 text-3xl" };
  function ob(e, t, n, r, s, i) {
    const o = de("MenuButton"),
      l = de("MenuItem"),
      a = de("MenuItems"),
      u = de("Menu");
    return (
      M(),
      Y(
        u,
        { as: "div", class: "z-1000 relative inline-block text-left" },
        {
          default: se(() => [
            J("div", null, [
              le(
                o,
                {
                  class:
                    "bg-teal-500 hover:bg-teal-700 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100",
                },
                { default: se(() => [Ue(_e(this.selected), 1)]), _: 1 },
              ),
            ]),
            le(
              oc,
              {
                "enter-active-class": "transition ease-out duration-100",
                "enter-from-class": "transform opacity-90 scale-95",
                "enter-to-class": "transform opacity-100 scale-100",
                "leave-active-class": "transition ease-in duration-75",
                "leave-from-class": "transform opacity-100 scale-100",
                "leave-to-class": "transform opacity-0 scale-95",
              },
              {
                default: se(() => [
                  le(
                    a,
                    {
                      class:
                        "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                    },
                    {
                      default: se(() => [
                        J("div", ib, [
                          (M(!0),
                          ee(
                            pe,
                            null,
                            Hn(
                              this.workstations,
                              (c) => (
                                M(),
                                Y(
                                  l,
                                  {
                                    class: "z-100",
                                    key: c,
                                    onClick: (f) => e.send_workstation(c),
                                  },
                                  {
                                    default: se(({ active: f }) => [
                                      J(
                                        "a",
                                        {
                                          href: "#",
                                          class: we([
                                            f
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "block px-4 py-2 text-3xl",
                                          ]),
                                        },
                                        _e(c.name),
                                        3,
                                      ),
                                    ]),
                                    _: 2,
                                  },
                                  1032,
                                  ["onClick"],
                                )
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
                _: 1,
              },
            ),
          ]),
          _: 1,
        },
      )
    );
  }
  const lb = Ne(sb, [["render", ob]]),
    cl = Sf(),
    ab = Z({
      name: "JobTimeClock",
      components: {
        AuthorizationMessage: Yu,
        JobCardList: Wv,
        SessionTimer: F2,
        TimerWidget: Ef,
        WorkOrderList: $v,
        EmployeeList: Bf,
        StartScreen: rb,
        DropDownMenu: lb,
      },
      data() {
        return {
          employeeId: "",
          employeeName: "",
          header: "Job Timeclock",
          jobCards: [],
          selectedWorkOrder: null,
          showAuthMessage: !1,
          token: Lc("token", null),
          tokenExpiration: 0,
          workOrders: [],
          activeSession: !1,
          employeeLoggedIn: !1,
          employees: [],
          active_dropdown: !1,
          workstation: "",
        };
      },
      methods: {
        async check_for_erp_log_in() {
          const e = await at(
            "employee_timeclock.www.job_timeclock.check_for_erp_log_in",
            {},
          );
          e.user_id === "Guest"
            ? console.log(e.user_id)
            : console.log("Session logged in", e.user_id);
        },
        async authenticateEmployee(e) {
          ((this.token = null),
            (this.tokenExpiration = 0),
            (this.jobCards = []),
            (this.selectedWorkOrder = null),
            (this.workOrders = []),
            (this.employeeId = ""),
            (this.employeeName = ""),
            (this.workstation = this.workstation));
          const t = await at(
            "employee_timeclock.www.job_timeclock.authenticate_employee",
            { rfid: e },
          );
          t?.status === "success"
            ? ((this.token = t.token),
              (this.activeSession = !0),
              await this.getWorkOrders())
            : (console.log("Sorry! You are not authenticated."),
              console.log(t.message),
              (this.activeSession = !1),
              this.setSessionFalse,
              (this.token = null),
              (this.tokenExpiration = 0),
              (this.jobCards = []),
              (this.selectedWorkOrder = null),
              (this.workOrders = []),
              (this.employeeId = ""),
              (this.employeeName = ""));
        },
        async decodeToken() {
          const e = Hp(this.token);
          ((this.tokenExpiration = e.exp * 1e3),
            (this.employeeId = e.employee_id),
            (this.employeeName = e.employee_name),
            console.log("Hurrah! You are authenticated as ", e.employee_name));
          const t = Date.now(),
            n = this.tokenExpiration - t;
          this.resetTimer(n);
        },
        async getWorkOrders() {
          const e = await at("employee_timeclock.www.job_timeclock.get_work_orders", {
            token: this.token,
          });
          e?.status === "success"
            ? ((this.token = e.token), (this.workOrders = e.work_orders))
            : ((this.workOrders = []), (this.activeSession = !1));
        },
        selectWorkOrder(e) {
          ((this.selectedWorkOrder = e), this.getJobCards(e.name));
        },
        async getJobCards(e) {
          const t = await at("employee_timeclock.www.job_timeclock.get_job_cards", {
            token: this.token,
            work_order: e,
          });
          if (t?.status === "success") {
            ((this.token = t.token), (this.jobCards = t.job_cards));
            for (let n = 0; n < this.jobCards.length; n++)
              this.jobCards[n].is_active = t.active_cards[n];
            if (this.workstation !== "") {
              const n = await at(
                "employee_timeclock.www.job_timeclock.sort_jobcard_by_workstation",
                { jobCards: this.jobCards, workstation: this.workstation },
              );
              n?.status === "success"
                ? (this.jobCards = n.sorted_job_cards)
                : console.log("sort failed.");
            } else console.log("Workstation: default");
          } else ((this.jobCards = []), (this.activeSession = !1));
        },
        setSessionFalse() {
          ((this.activeSession = !1),
            console.log("Logged out of Job Time Clock Session"));
        },
        startTimer(e) {
          setTimeout(this.endTimer, e);
        },
        endTimer() {
          (this.setSessionFalse,
            (this.activeSession = !1),
            (this.token = null),
            (this.tokenExpiration = 0),
            (this.jobCards = []),
            (this.selectedWorkOrder = null),
            (this.workOrders = []),
            (this.employeeId = ""),
            (this.employeeName = ""));
        },
        resetTimer(e) {
          (clearTimeout(this.timeoutId), this.startTimer(e));
        },
        async log_employee_in(e) {
          this.date = new Date();
          const t = this.date.getUTCFullYear(),
            n = this.date.getUTCMonth() + 1,
            r = this.date.getUTCDate(),
            s = this.date.getUTCHours(),
            i = this.date.getUTCMinutes();
          this.date.getUTCSeconds();
          const o = (u) => (u < 10 ? "0" + u : u),
            l = `${t}-${o(n)}-${o(r)} ${o(s - 4)}:${o(i)}`;
          (
            await at("employee_timeclock.www.job_timeclock.log_in_employee", {
              token: e,
              time: l,
            })
          )?.status === "success"
            ? console.log("You are now logged in.")
            : console.log("did not work. You are still logged out:");
        },
        switchEmployee() {
          (cl.success(`${this.employeeName} switched user.`),
            (this.activeSession = !1),
            (this.token = null),
            (this.tokenExpiration = 0),
            (this.jobCards = []),
            (this.selectedWorkOrder = null),
            (this.workOrders = []),
            (this.employeeId = ""),
            (this.employeeName = ""),
            (this.employeeId = ""),
            (this.employeeName = ""),
            (this.jobCards = []),
            (this.selectedWorkOrder = null),
            (this.tokenExpiration = 0),
            (this.workOrders = []),
            (this.activeSession = !1),
            (this.employeeLoggedIn = !1),
            (this.employees = []));
        },
        async log_out_employee(e) {
          const t = new Date(),
            n = t.getUTCFullYear(),
            r = t.getUTCMonth() + 1,
            s = t.getUTCDate(),
            i = t.getUTCHours(),
            o = t.getUTCMinutes();
          t.getUTCSeconds();
          const l = (c) => (c < 10 ? "0" + c : c),
            a = `${n}-${l(r)}-${l(s)} ${l(i - 4)}:${l(o)}`,
            u = await at("employee_timeclock.www.job_timeclock.log_out_employee", {
              token: e,
              time: a,
            });
          u?.status === "success"
            ? (cl.success(`${this.employeeName} has punched out.`),
              console.log("You are now logged out.", u.log),
              (this.activeSession = !1),
              (this.token = null),
              (this.tokenExpiration = 0),
              (this.jobCards = []),
              (this.selectedWorkOrder = null),
              (this.workOrders = []),
              (this.employeeId = ""),
              (this.employeeName = ""),
              (this.employees = []))
            : (cl.error(`${this.employeeName} was not properly signed out.`),
              console.log("Did not work. You are still logged in:", u.log));
        },
        async get_employees() {
          const e = await at("employee_timeclock.www.job_timeclock.get_employees");
          e?.status === "success" && (this.employees = e.employees);
        },
        get_token_from_employee(e) {
          this.authenticateEmployee(e.sCode);
        },
        receive_login(e) {
          (console.log("Receive login succeeded: ", e),
            this.authenticateEmployee(e));
        },
        refresh_page() {
          (window.location.reload(), console.log("Page reloaded."));
        },
        select_workstation(e) {
          (console.log("Workstation Name", e),
            (this.workstation = e),
            localStorage.getItem("workstation") &&
              (this.replaceState(Object.assign(state, JSON)),
              localStorage.setItem("workstation", e)));
        },
      },
      mounted() {
        (this.token && this.getWorkOrders(),
          this.check_for_erp_log_in(),
          (this.employees = this.get_employees()));
        const e = Kp.attachTo(document, {
          onScan: this.authenticateEmployee,
          ignoreIfFocusOn: ".frappe-input",
        });
        ((this.scanner = e),
          (window.scanner = e),
          Ee(
            () => this.token,
            (t) => {
              t !== this.token ? this.decodeToken() : t && this.decodeToken();
            },
            { immediate: !0 },
          ));
      },
    }),
    cb = { class: "static h-screen flex z-0" },
    ub = { class: "z-10 block rounded-lg bg-gray-300 fixed w-screen" },
    fb = {
      class:
        "z-100 mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between",
    },
    db = { key: 0, class: "z-0 flex w-full overflow-hidden my-16 pt-16" },
    hb = { key: 1, class: "w-full h-screen" };
  function pb(e, t, n, r, s, i) {
    const o = de("DropDownMenu"),
      l = de("SessionTimer"),
      a = de("WorkOrderList"),
      u = de("JobCardList"),
      c = de("AuthorizationMessage");
    return (
      M(),
      ee("div", cb, [
        J("header", ub, [
          J("div", fb, [
            J(
              "button",
              {
                class: "text-4xl font-bold tracking-tight text-gray-900",
                onClick:
                  t[0] ||
                  (t[0] = (...f) => e.refresh_page && e.refresh_page(...f)),
              },
              _e(e.header),
              1,
            ),
            (M(),
            Y(
              Kd,
              { include: "workstation" },
              [
                e.activeSession
                  ? (M(),
                    Y(
                      o,
                      { key: 0, onSend_workstation: e.select_workstation },
                      null,
                      8,
                      ["onSend_workstation"],
                    ))
                  : Se("", !0),
              ],
              1024,
            )),
            e.activeSession
              ? (M(),
                ee(
                  "button",
                  {
                    key: 0,
                    class:
                      "bg-green-500 hover:bg-green-600 text-white font-normal lg:text-3xl py-4 px-4 rounded ring-2 ring-offset-1 ring-gray-100",
                    onClick:
                      t[1] ||
                      (t[1] = (...f) =>
                        e.switchEmployee && e.switchEmployee(...f)),
                  },
                  "Switch Employee",
                ))
              : Se("", !0),
            e.activeSession
              ? (M(),
                Y(
                  l,
                  {
                    key: 1,
                    employeeName: e.employeeName,
                    tokenExpiration: e.tokenExpiration,
                  },
                  null,
                  8,
                  ["employeeName", "tokenExpiration"],
                ))
              : Se("", !0),
          ]),
        ]),
        e.activeSession
          ? (M(),
            ee("main", db, [
              le(
                a,
                {
                  class: "z-0",
                  workOrders: e.workOrders,
                  selectedWorkOrder: e.selectedWorkOrder,
                  onSelect: e.selectWorkOrder,
                },
                null,
                8,
                ["workOrders", "selectedWorkOrder", "onSelect"],
              ),
              le(
                oc,
                { name: "job_card_list" },
                {
                  default: se(() => [
                    e.selectedWorkOrder
                      ? (M(),
                        Y(
                          u,
                          {
                            key: 0,
                            class: "z-0",
                            name: "job_cards_comp",
                            jobCards: e.jobCards,
                            employee_id: this.employeeId,
                          },
                          null,
                          8,
                          ["jobCards", "employee_id"],
                        ))
                      : Se("", !0),
                  ]),
                  _: 1,
                },
              ),
            ]))
          : (M(), ee("main", hb, [le(c)])),
      ])
    );
  }
  let ul = Pc(
    Ne(ab, [
      ["render", pb],
      ["__scopeId", "data-v-57f073ee"],
    ]),
  );
  (ul.use(L0), ul.use(M2), ul.mount("#app"));
});
