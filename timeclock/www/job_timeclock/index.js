/**
* @vue/shared v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Ra(t, e) {
  const n = new Set(t.split(","));
  return e ? (r) => n.has(r.toLowerCase()) : (r) => n.has(r);
}
const we = {}, Mr = [], St = () => {
}, Cm = () => !1, yo = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), Pa = (t) => t.startsWith("onUpdate:"), Ve = Object.assign, Ia = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Em = Object.prototype.hasOwnProperty, he = (t, e) => Em.call(t, e), te = Array.isArray, Ar = (t) => bo(t) === "[object Map]", gf = (t) => bo(t) === "[object Set]", oe = (t) => typeof t == "function", Le = (t) => typeof t == "string", Hr = (t) => typeof t == "symbol", xe = (t) => t !== null && typeof t == "object", yf = (t) => (xe(t) || oe(t)) && oe(t.then) && oe(t.catch), bf = Object.prototype.toString, bo = (t) => bf.call(t), Mm = (t) => bo(t).slice(8, -1), vf = (t) => bo(t) === "[object Object]", La = (t) => Le(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, rs = /* @__PURE__ */ Ra(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), vo = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Am = /-(\w)/g, rn = vo((t) => t.replace(Am, (e, n) => n ? n.toUpperCase() : "")), Tm = /\B([A-Z])/g, Fr = vo(
  (t) => t.replace(Tm, "-$1").toLowerCase()
), wo = vo((t) => t.charAt(0).toUpperCase() + t.slice(1)), Go = vo((t) => t ? `on${wo(t)}` : ""), $n = (t, e) => !Object.is(t, e), ai = (t, e) => {
  for (let n = 0; n < t.length; n++)
    t[n](e);
}, xi = (t, e, n) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, Rl = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, Om = (t) => {
  const e = Le(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let Xc;
const wf = () => Xc || (Xc = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Na(t) {
  if (te(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = Le(r) ? Im(r) : Na(r);
      if (s)
        for (const i in s)
          e[i] = s[i];
    }
    return e;
  } else if (Le(t) || xe(t))
    return t;
}
const jm = /;(?![^(]*\))/g, Rm = /:([^]+)/, Pm = /\/\*[^]*?\*\//g;
function Im(t) {
  const e = {};
  return t.replace(Pm, "").split(jm).forEach((n) => {
    if (n) {
      const r = n.split(Rm);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function $t(t) {
  let e = "";
  if (Le(t))
    e = t;
  else if (te(t))
    for (let n = 0; n < t.length; n++) {
      const r = $t(t[n]);
      r && (e += r + " ");
    }
  else if (xe(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
const Lm = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Nm = /* @__PURE__ */ Ra(Lm);
function xf(t) {
  return !!t || t === "";
}
const at = (t) => Le(t) ? t : t == null ? "" : te(t) || xe(t) && (t.toString === bf || !oe(t.toString)) ? JSON.stringify(t, kf, 2) : String(t), kf = (t, e) => e && e.__v_isRef ? kf(t, e.value) : Ar(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [r, s], i) => (n[Jo(r, i) + " =>"] = s, n),
    {}
  )
} : gf(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Jo(n))
} : Hr(e) ? Jo(e) : xe(e) && !te(e) && !vf(e) ? String(e) : e, Jo = (t, e = "") => {
  var n;
  return Hr(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t;
};
let xt;
class zm {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this.parent = xt, !e && xt && (this.index = (xt.scopes || (xt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(e) {
    if (this._active) {
      const n = xt;
      try {
        return xt = this, e();
      } finally {
        xt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    xt = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    xt = this.parent;
  }
  stop(e) {
    if (this._active) {
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, r = this.scopes.length; n < r; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !e) {
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function $m(t, e = xt) {
  e && e.active && e.effects.push(t);
}
function _f() {
  return xt;
}
function Dm(t) {
  xt && xt.cleanups.push(t);
}
let ir;
class za {
  constructor(e, n, r, s) {
    this.fn = e, this.trigger = n, this.scheduler = r, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, $m(this, s);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1, Hn();
      for (let e = 0; e < this._depsLength; e++) {
        const n = this.deps[e];
        if (n.computed && (Bm(n.computed), this._dirtyLevel >= 4))
          break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), Fn();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(e) {
    this._dirtyLevel = e ? 4 : 0;
  }
  run() {
    if (this._dirtyLevel = 0, !this.active)
      return this.fn();
    let e = Pn, n = ir;
    try {
      return Pn = !0, ir = this, this._runnings++, Qc(this), this.fn();
    } finally {
      Zc(this), this._runnings--, ir = n, Pn = e;
    }
  }
  stop() {
    var e;
    this.active && (Qc(this), Zc(this), (e = this.onStop) == null || e.call(this), this.active = !1);
  }
}
function Bm(t) {
  return t.value;
}
function Qc(t) {
  t._trackId++, t._depsLength = 0;
}
function Zc(t) {
  if (t.deps.length > t._depsLength) {
    for (let e = t._depsLength; e < t.deps.length; e++)
      Sf(t.deps[e], t);
    t.deps.length = t._depsLength;
  }
}
function Sf(t, e) {
  const n = t.get(e);
  n !== void 0 && e._trackId !== n && (t.delete(e), t.size === 0 && t.cleanup());
}
let Pn = !0, Pl = 0;
const Cf = [];
function Hn() {
  Cf.push(Pn), Pn = !1;
}
function Fn() {
  const t = Cf.pop();
  Pn = t === void 0 ? !0 : t;
}
function $a() {
  Pl++;
}
function Da() {
  for (Pl--; !Pl && Il.length; )
    Il.shift()();
}
function Ef(t, e, n) {
  if (e.get(t) !== t._trackId) {
    e.set(t, t._trackId);
    const r = t.deps[t._depsLength];
    r !== e ? (r && Sf(r, t), t.deps[t._depsLength++] = e) : t._depsLength++;
  }
}
const Il = [];
function Mf(t, e, n) {
  $a();
  for (const r of t.keys()) {
    let s;
    r._dirtyLevel < e && (s ?? (s = t.get(r) === r._trackId)) && (r._shouldSchedule || (r._shouldSchedule = r._dirtyLevel === 0), r._dirtyLevel = e), r._shouldSchedule && (s ?? (s = t.get(r) === r._trackId)) && (r.trigger(), (!r._runnings || r.allowRecurse) && r._dirtyLevel !== 2 && (r._shouldSchedule = !1, r.scheduler && Il.push(r.scheduler)));
  }
  Da();
}
const Af = (t, e) => {
  const n = /* @__PURE__ */ new Map();
  return n.cleanup = t, n.computed = e, n;
}, Ll = /* @__PURE__ */ new WeakMap(), or = Symbol(""), Nl = Symbol("");
function vt(t, e, n) {
  if (Pn && ir) {
    let r = Ll.get(t);
    r || Ll.set(t, r = /* @__PURE__ */ new Map());
    let s = r.get(n);
    s || r.set(n, s = Af(() => r.delete(n))), Ef(
      ir,
      s
    );
  }
}
function un(t, e, n, r, s, i) {
  const o = Ll.get(t);
  if (!o)
    return;
  let l = [];
  if (e === "clear")
    l = [...o.values()];
  else if (n === "length" && te(t)) {
    const a = Number(r);
    o.forEach((c, u) => {
      (u === "length" || !Hr(u) && u >= a) && l.push(c);
    });
  } else
    switch (n !== void 0 && l.push(o.get(n)), e) {
      case "add":
        te(t) ? La(n) && l.push(o.get("length")) : (l.push(o.get(or)), Ar(t) && l.push(o.get(Nl)));
        break;
      case "delete":
        te(t) || (l.push(o.get(or)), Ar(t) && l.push(o.get(Nl)));
        break;
      case "set":
        Ar(t) && l.push(o.get(or));
        break;
    }
  $a();
  for (const a of l)
    a && Mf(
      a,
      4
    );
  Da();
}
const Hm = /* @__PURE__ */ Ra("__proto__,__v_isRef,__isVue"), Tf = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Hr)
), eu = /* @__PURE__ */ Fm();
function Fm() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const r = fe(this);
      for (let i = 0, o = this.length; i < o; i++)
        vt(r, "get", i + "");
      const s = r[e](...n);
      return s === -1 || s === !1 ? r[e](...n.map(fe)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Hn(), $a();
      const r = fe(this)[e].apply(this, n);
      return Da(), Fn(), r;
    };
  }), t;
}
function Wm(t) {
  const e = fe(this);
  return vt(e, "has", t), e.hasOwnProperty(t);
}
class Of {
  constructor(e = !1, n = !1) {
    this._isReadonly = e, this._shallow = n;
  }
  get(e, n, r) {
    const s = this._isReadonly, i = this._shallow;
    if (n === "__v_isReactive")
      return !s;
    if (n === "__v_isReadonly")
      return s;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return r === (s ? i ? n1 : If : i ? Pf : Rf).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(r) ? e : void 0;
    const o = te(e);
    if (!s) {
      if (o && he(eu, n))
        return Reflect.get(eu, n, r);
      if (n === "hasOwnProperty")
        return Wm;
    }
    const l = Reflect.get(e, n, r);
    return (Hr(n) ? Tf.has(n) : Hm(n)) || (s || vt(e, "get", n), i) ? l : ht(l) ? o && La(n) ? l : l.value : xe(l) ? s ? Fa(l) : Ts(l) : l;
  }
}
class jf extends Of {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, r, s) {
    let i = e[n];
    if (!this._shallow) {
      const a = Nr(i);
      if (!ki(r) && !Nr(r) && (i = fe(i), r = fe(r)), !te(e) && ht(i) && !ht(r))
        return a ? !1 : (i.value = r, !0);
    }
    const o = te(e) && La(n) ? Number(n) < e.length : he(e, n), l = Reflect.set(e, n, r, s);
    return e === fe(s) && (o ? $n(r, i) && un(e, "set", n, r) : un(e, "add", n, r)), l;
  }
  deleteProperty(e, n) {
    const r = he(e, n);
    e[n];
    const s = Reflect.deleteProperty(e, n);
    return s && r && un(e, "delete", n, void 0), s;
  }
  has(e, n) {
    const r = Reflect.has(e, n);
    return (!Hr(n) || !Tf.has(n)) && vt(e, "has", n), r;
  }
  ownKeys(e) {
    return vt(
      e,
      "iterate",
      te(e) ? "length" : or
    ), Reflect.ownKeys(e);
  }
}
class Vm extends Of {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, n) {
    return !0;
  }
  deleteProperty(e, n) {
    return !0;
  }
}
const Km = /* @__PURE__ */ new jf(), Um = /* @__PURE__ */ new Vm(), qm = /* @__PURE__ */ new jf(
  !0
), Ba = (t) => t, xo = (t) => Reflect.getPrototypeOf(t);
function Ns(t, e, n = !1, r = !1) {
  t = t.__v_raw;
  const s = fe(t), i = fe(e);
  n || ($n(e, i) && vt(s, "get", e), vt(s, "get", i));
  const { has: o } = xo(s), l = r ? Ba : n ? Va : gs;
  if (o.call(s, e))
    return l(t.get(e));
  if (o.call(s, i))
    return l(t.get(i));
  t !== s && t.get(e);
}
function zs(t, e = !1) {
  const n = this.__v_raw, r = fe(n), s = fe(t);
  return e || ($n(t, s) && vt(r, "has", t), vt(r, "has", s)), t === s ? n.has(t) : n.has(t) || n.has(s);
}
function $s(t, e = !1) {
  return t = t.__v_raw, !e && vt(fe(t), "iterate", or), Reflect.get(t, "size", t);
}
function tu(t) {
  t = fe(t);
  const e = fe(this);
  return xo(e).has.call(e, t) || (e.add(t), un(e, "add", t, t)), this;
}
function nu(t, e) {
  e = fe(e);
  const n = fe(this), { has: r, get: s } = xo(n);
  let i = r.call(n, t);
  i || (t = fe(t), i = r.call(n, t));
  const o = s.call(n, t);
  return n.set(t, e), i ? $n(e, o) && un(n, "set", t, e) : un(n, "add", t, e), this;
}
function ru(t) {
  const e = fe(this), { has: n, get: r } = xo(e);
  let s = n.call(e, t);
  s || (t = fe(t), s = n.call(e, t)), r && r.call(e, t);
  const i = e.delete(t);
  return s && un(e, "delete", t, void 0), i;
}
function su() {
  const t = fe(this), e = t.size !== 0, n = t.clear();
  return e && un(t, "clear", void 0, void 0), n;
}
function Ds(t, e) {
  return function(r, s) {
    const i = this, o = i.__v_raw, l = fe(o), a = e ? Ba : t ? Va : gs;
    return !t && vt(l, "iterate", or), o.forEach((c, u) => r.call(s, a(c), a(u), i));
  };
}
function Bs(t, e, n) {
  return function(...r) {
    const s = this.__v_raw, i = fe(s), o = Ar(i), l = t === "entries" || t === Symbol.iterator && o, a = t === "keys" && o, c = s[t](...r), u = n ? Ba : e ? Va : gs;
    return !e && vt(
      i,
      "iterate",
      a ? Nl : or
    ), {
      // iterator protocol
      next() {
        const { value: f, done: h } = c.next();
        return h ? { value: f, done: h } : {
          value: l ? [u(f[0]), u(f[1])] : u(f),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function pn(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function Gm() {
  const t = {
    get(i) {
      return Ns(this, i);
    },
    get size() {
      return $s(this);
    },
    has: zs,
    add: tu,
    set: nu,
    delete: ru,
    clear: su,
    forEach: Ds(!1, !1)
  }, e = {
    get(i) {
      return Ns(this, i, !1, !0);
    },
    get size() {
      return $s(this);
    },
    has: zs,
    add: tu,
    set: nu,
    delete: ru,
    clear: su,
    forEach: Ds(!1, !0)
  }, n = {
    get(i) {
      return Ns(this, i, !0);
    },
    get size() {
      return $s(this, !0);
    },
    has(i) {
      return zs.call(this, i, !0);
    },
    add: pn("add"),
    set: pn("set"),
    delete: pn("delete"),
    clear: pn("clear"),
    forEach: Ds(!0, !1)
  }, r = {
    get(i) {
      return Ns(this, i, !0, !0);
    },
    get size() {
      return $s(this, !0);
    },
    has(i) {
      return zs.call(this, i, !0);
    },
    add: pn("add"),
    set: pn("set"),
    delete: pn("delete"),
    clear: pn("clear"),
    forEach: Ds(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    t[i] = Bs(
      i,
      !1,
      !1
    ), n[i] = Bs(
      i,
      !0,
      !1
    ), e[i] = Bs(
      i,
      !1,
      !0
    ), r[i] = Bs(
      i,
      !0,
      !0
    );
  }), [
    t,
    n,
    e,
    r
  ];
}
const [
  Jm,
  Ym,
  Xm,
  Qm
] = /* @__PURE__ */ Gm();
function Ha(t, e) {
  const n = e ? t ? Qm : Xm : t ? Ym : Jm;
  return (r, s, i) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? r : Reflect.get(
    he(n, s) && s in r ? n : r,
    s,
    i
  );
}
const Zm = {
  get: /* @__PURE__ */ Ha(!1, !1)
}, e1 = {
  get: /* @__PURE__ */ Ha(!1, !0)
}, t1 = {
  get: /* @__PURE__ */ Ha(!0, !1)
}, Rf = /* @__PURE__ */ new WeakMap(), Pf = /* @__PURE__ */ new WeakMap(), If = /* @__PURE__ */ new WeakMap(), n1 = /* @__PURE__ */ new WeakMap();
function r1(t) {
  switch (t) {
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
function s1(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : r1(Mm(t));
}
function Ts(t) {
  return Nr(t) ? t : Wa(
    t,
    !1,
    Km,
    Zm,
    Rf
  );
}
function i1(t) {
  return Wa(
    t,
    !1,
    qm,
    e1,
    Pf
  );
}
function Fa(t) {
  return Wa(
    t,
    !0,
    Um,
    t1,
    If
  );
}
function Wa(t, e, n, r, s) {
  if (!xe(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const i = s.get(t);
  if (i)
    return i;
  const o = s1(t);
  if (o === 0)
    return t;
  const l = new Proxy(
    t,
    o === 2 ? r : n
  );
  return s.set(t, l), l;
}
function Tr(t) {
  return Nr(t) ? Tr(t.__v_raw) : !!(t && t.__v_isReactive);
}
function Nr(t) {
  return !!(t && t.__v_isReadonly);
}
function ki(t) {
  return !!(t && t.__v_isShallow);
}
function Lf(t) {
  return Tr(t) || Nr(t);
}
function fe(t) {
  const e = t && t.__v_raw;
  return e ? fe(e) : t;
}
function Nf(t) {
  return Object.isExtensible(t) && xi(t, "__v_skip", !0), t;
}
const gs = (t) => xe(t) ? Ts(t) : t, Va = (t) => xe(t) ? Fa(t) : t;
class zf {
  constructor(e, n, r, s) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this.effect = new za(
      () => e(this._value),
      () => ci(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    ), this.effect.computed = this, this.effect.active = this._cacheable = !s, this.__v_isReadonly = r;
  }
  get value() {
    const e = fe(this);
    return (!e._cacheable || e.effect.dirty) && $n(e._value, e._value = e.effect.run()) && ci(e, 4), $f(e), e.effect._dirtyLevel >= 2 && ci(e, 2), e._value;
  }
  set value(e) {
    this._setter(e);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(e) {
    this.effect.dirty = e;
  }
  // #endregion
}
function o1(t, e, n = !1) {
  let r, s;
  const i = oe(t);
  return i ? (r = t, s = St) : (r = t.get, s = t.set), new zf(r, s, i || !s, n);
}
function $f(t) {
  var e;
  Pn && ir && (t = fe(t), Ef(
    ir,
    (e = t.dep) != null ? e : t.dep = Af(
      () => t.dep = void 0,
      t instanceof zf ? t : void 0
    )
  ));
}
function ci(t, e = 4, n) {
  t = fe(t);
  const r = t.dep;
  r && Mf(
    r,
    e
  );
}
function ht(t) {
  return !!(t && t.__v_isRef === !0);
}
function Ue(t) {
  return Df(t, !1);
}
function l1(t) {
  return Df(t, !0);
}
function Df(t, e) {
  return ht(t) ? t : new a1(t, e);
}
class a1 {
  constructor(e, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? e : fe(e), this._value = n ? e : gs(e);
  }
  get value() {
    return $f(this), this._value;
  }
  set value(e) {
    const n = this.__v_isShallow || ki(e) || Nr(e);
    e = n ? e : fe(e), $n(e, this._rawValue) && (this._rawValue = e, this._value = n ? e : gs(e), ci(this, 4));
  }
}
function Bf(t) {
  return ht(t) ? t.value : t;
}
const c1 = {
  get: (t, e, n) => Bf(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const s = t[e];
    return ht(s) && !ht(n) ? (s.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function Hf(t) {
  return Tr(t) ? t : new Proxy(t, c1);
}
var ss = { PYTHONIOENCODING: "utf-8", npm_package_dependencies_onscan_js: "^1.5.2", USER: "pequea.avu.nu", SSH_CLIENT: "127.0.0.1 50754 22", npm_config_version_commit_hooks: "true", npm_config_user_agent: "yarn/1.22.19 npm/? node/v18.17.1 linux x64", npm_package_dependencies_vue: "^3.4.19", npm_package_scripts_dev_project_list: "vite build --watch --config=./timeclock/www/project_list/vite.config.js", npm_config_bin_links: "true", XDG_SESSION_TYPE: "tty", GIT_ASKPASS: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/extensions/git/dist/askpass.sh", npm_node_execpath: "/usr/bin/node", npm_package_devDependencies_vite: "^5.1.4", npm_config_init_version: "1.0.0", SHLVL: "1", BROWSER: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/bin/helpers/browser.sh", MOTD_SHOWN: "pam", HOME: "/var/www/pequea.avu.nu/html", TERM_PROGRAM_VERSION: "1.86.2", VSCODE_IPC_HOOK_CLI: "/run/user/1000/vscode-ipc-f9e9dd33-d0bd-4275-a9c0-3cb6121d440a.sock", npm_package_dependencies__eonasdan_tempus_dominus: "^6", PYTHONUNBUFFERED: "1", npm_package_dependencies__headlessui_vue: "^1.7.19", npm_config_init_license: "MIT", VSCODE_GIT_ASKPASS_MAIN: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/extensions/git/dist/askpass-main.js", YARN_WRAP_OUTPUT: "false", npm_config_version_tag_prefix: "v", PS1: "\\[\x1B]633;A\x07\\](env) ${debian_chroot:+($debian_chroot)}\\u@\\h:\\w\\$ \\[\x1B]633;B\x07\\]", VSCODE_GIT_ASKPASS_NODE: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node", LC_CTYPE: "C.UTF-8", DBUS_SESSION_BUS_ADDRESS: "unix:path=/run/user/1000/bus", npm_package_scripts_dev_timeclock: "vite build --watch --config=./timeclock/www/timeclock/vite.config.js", COLORTERM: "truecolor", npm_package_description: "ERPNext Timeclock", npm_package_devDependencies_tailwindcss: "^3.4.1", npm_package_readmeFilename: "README.md", npm_package_dependencies_jwt_decode: "^4.0.0", npm_package_scripts_preview_job_timeclock: "vite build --config=./timeclock/www/job_timeclock/src/vite.config.js", LOGNAME: "pequea.avu.nu", npm_package_dependencies__vueuse_core: "^10.8.0", npm_package_type: "module", _: "/usr/bin/yarn", npm_package_devDependencies_autoprefixer: "^10.4.17", npm_package_private: "true", XDG_SESSION_CLASS: "user", npm_config_registry: "https://registry.yarnpkg.com", TERM: "xterm-256color", XDG_SESSION_ID: "3072526", npm_package_devDependencies__vitejs_plugin_vue: "^5.0.4", npm_package_dependencies_getmac: "^6.6.0", npm_config_ignore_scripts: "", PATH: "/tmp/yarn--1709587915204-0.780963448301063:/var/www/pequea.avu.nu/html/apps/timeclock/node_modules/.bin:/var/www/pequea.avu.nu/html/.config/yarn/link/node_modules/.bin:/var/www/pequea.avu.nu/html/.yarn/bin:/usr/libexec/lib/node_modules/npm/bin/node-gyp-bin:/usr/lib/node_modules/npm/bin/node-gyp-bin:/usr/bin/node_modules/npm/bin/node-gyp-bin:/var/www/pequea.avu.nu/html/.vscode-server/extensions/ms-python.python-2024.2.0/pythonFiles/deactivate/bash:/var/www/pequea.avu.nu/html/env/bin:/var/www/pequea.avu.nu/html/.vscode-server/extensions/ms-python.python-2024.2.0/pythonFiles/deactivate/bash:/var/www/pequea.avu.nu/html/env/bin:/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/bin/remote-cli:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin", NODE: "/usr/bin/node", npm_package_name: "timeclock", XDG_RUNTIME_DIR: "/run/user/1000", npm_package_devDependencies_vite_plugin_compression: "^0.5.1", LANG: "en_US.UTF-8", VIRTUAL_ENV_PROMPT: "(env) ", VSCODE_GIT_IPC_HANDLE: "/run/user/1000/vscode-git-77f20ff1ac.sock", TERM_PROGRAM: "vscode", npm_lifecycle_script: "vite build --watch --config=./timeclock/www/job_timeclock/src/vite.config.js", npm_package_scripts_preview_project_list: "vite build --config=./timeclock/www/project_list/vite.config.js", npm_config_version_git_message: "v%s", SHELL: "/bin/bash", npm_lifecycle_event: "dev:job_timeclock", npm_package_version: "", npm_config_argv: '{"remain":[],"cooked":["run","dev:job_timeclock"],"original":["dev:job_timeclock"]}', npm_package_dependencies_vue_router: "^4.3.0", npm_config_version_git_tag: "true", npm_config_version_git_sign: "", npm_package_license: "MIT*", npm_package_scripts_dev_job_timeclock: "vite build --watch --config=./timeclock/www/job_timeclock/src/vite.config.js", npm_config_strict_ssl: "true", VIRTUAL_ENV: "/var/www/pequea.avu.nu/html/env", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", npm_package_dependencies__heroicons_vue: "^2.1.1", PWD: "/var/www/pequea.avu.nu/html/apps/timeclock", npm_execpath: "/usr/share/yarn/bin/yarn.js", npm_package_scripts_preview_timeclock: "vite build --config=./timeclock/www/timeclock/vite.config.js", SSH_CONNECTION: "127.0.0.1 50754 127.0.0.1 22", npm_package_dependencies__popperjs_core: "^2.11.8", npm_package_devDependencies_postcss: "^8.4.35", npm_config_save_prefix: "^", npm_config_ignore_optional: "", npm_package_dependencies_frappe_ui: "^0.1.31", INIT_CWD: "/var/www/pequea.avu.nu/html/apps/timeclock/timeclock/www/job_timeclock", NODE_ENV: "production" };
const is = [];
function u1(t, ...e) {
  Hn();
  const n = is.length ? is[is.length - 1].component : null, r = n && n.appContext.config.warnHandler, s = d1();
  if (r)
    dn(
      r,
      n,
      11,
      [
        t + e.join(""),
        n && n.proxy,
        s.map(
          ({ vnode: i }) => `at <${yh(n, i.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const i = [`[Vue warn]: ${t}`, ...e];
    s.length && i.push(`
`, ...f1(s)), console.warn(...i);
  }
  Fn();
}
function d1() {
  let t = is[is.length - 1];
  if (!t)
    return [];
  const e = [];
  for (; t; ) {
    const n = e[0];
    n && n.vnode === t ? n.recurseCount++ : e.push({
      vnode: t,
      recurseCount: 0
    });
    const r = t.component && t.component.parent;
    t = r && r.vnode;
  }
  return e;
}
function f1(t) {
  const e = [];
  return t.forEach((n, r) => {
    e.push(...r === 0 ? [] : [`
`], ...h1(n));
  }), e;
}
function h1({ vnode: t, recurseCount: e }) {
  const n = e > 0 ? `... (${e} recursive calls)` : "", r = t.component ? t.component.parent == null : !1, s = ` at <${yh(
    t.component,
    t.type,
    r
  )}`, i = ">" + n;
  return t.props ? [s, ...p1(t.props), i] : [s + i];
}
function p1(t) {
  const e = [], n = Object.keys(t);
  return n.slice(0, 3).forEach((r) => {
    e.push(...Ff(r, t[r]));
  }), n.length > 3 && e.push(" ..."), e;
}
function Ff(t, e, n) {
  return Le(e) ? (e = JSON.stringify(e), n ? e : [`${t}=${e}`]) : typeof e == "number" || typeof e == "boolean" || e == null ? n ? e : [`${t}=${e}`] : ht(e) ? (e = Ff(t, fe(e.value), !0), n ? e : [`${t}=Ref<`, e, ">"]) : oe(e) ? [`${t}=fn${e.name ? `<${e.name}>` : ""}`] : (e = fe(e), n ? e : [`${t}=`, e]);
}
function dn(t, e, n, r) {
  try {
    return r ? t(...r) : t();
  } catch (s) {
    ko(s, e, n);
  }
}
function Pt(t, e, n, r) {
  if (oe(t)) {
    const i = dn(t, e, n, r);
    return i && yf(i) && i.catch((o) => {
      ko(o, e, n);
    }), i;
  }
  const s = [];
  for (let i = 0; i < t.length; i++)
    s.push(Pt(t[i], e, n, r));
  return s;
}
function ko(t, e, n, r = !0) {
  const s = e ? e.vnode : null;
  if (e) {
    let i = e.parent;
    const o = e.proxy, l = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; i; ) {
      const c = i.ec;
      if (c) {
        for (let u = 0; u < c.length; u++)
          if (c[u](t, o, l) === !1)
            return;
      }
      i = i.parent;
    }
    const a = e.appContext.config.errorHandler;
    if (a) {
      dn(
        a,
        null,
        10,
        [t, o, l]
      );
      return;
    }
  }
  m1(t, n, s, r);
}
function m1(t, e, n, r = !0) {
  console.error(t);
}
let ys = !1, zl = !1;
const ot = [];
let Zt = 0;
const Or = [];
let xn = null, Xn = 0;
const Wf = /* @__PURE__ */ Promise.resolve();
let Ka = null;
function tn(t) {
  const e = Ka || Wf;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function g1(t) {
  let e = Zt + 1, n = ot.length;
  for (; e < n; ) {
    const r = e + n >>> 1, s = ot[r], i = bs(s);
    i < t || i === t && s.pre ? e = r + 1 : n = r;
  }
  return e;
}
function Ua(t) {
  (!ot.length || !ot.includes(
    t,
    ys && t.allowRecurse ? Zt + 1 : Zt
  )) && (t.id == null ? ot.push(t) : ot.splice(g1(t.id), 0, t), Vf());
}
function Vf() {
  !ys && !zl && (zl = !0, Ka = Wf.then(Uf));
}
function y1(t) {
  const e = ot.indexOf(t);
  e > Zt && ot.splice(e, 1);
}
function b1(t) {
  te(t) ? Or.push(...t) : (!xn || !xn.includes(
    t,
    t.allowRecurse ? Xn + 1 : Xn
  )) && Or.push(t), Vf();
}
function iu(t, e, n = ys ? Zt + 1 : 0) {
  for (; n < ot.length; n++) {
    const r = ot[n];
    if (r && r.pre) {
      if (t && r.id !== t.uid)
        continue;
      ot.splice(n, 1), n--, r();
    }
  }
}
function Kf(t) {
  if (Or.length) {
    const e = [...new Set(Or)].sort(
      (n, r) => bs(n) - bs(r)
    );
    if (Or.length = 0, xn) {
      xn.push(...e);
      return;
    }
    for (xn = e, Xn = 0; Xn < xn.length; Xn++)
      xn[Xn]();
    xn = null, Xn = 0;
  }
}
const bs = (t) => t.id == null ? 1 / 0 : t.id, v1 = (t, e) => {
  const n = bs(t) - bs(e);
  if (n === 0) {
    if (t.pre && !e.pre)
      return -1;
    if (e.pre && !t.pre)
      return 1;
  }
  return n;
};
function Uf(t) {
  zl = !1, ys = !0, ot.sort(v1);
  const e = St;
  try {
    for (Zt = 0; Zt < ot.length; Zt++) {
      const n = ot[Zt];
      n && n.active !== !1 && (ss.NODE_ENV !== "production" && e(n), dn(n, null, 14));
    }
  } finally {
    Zt = 0, ot.length = 0, Kf(), ys = !1, Ka = null, (ot.length || Or.length) && Uf();
  }
}
function w1(t, e, ...n) {
  if (t.isUnmounted)
    return;
  const r = t.vnode.props || we;
  let s = n;
  const i = e.startsWith("update:"), o = i && e.slice(7);
  if (o && o in r) {
    const u = `${o === "modelValue" ? "model" : o}Modifiers`, { number: f, trim: h } = r[u] || we;
    h && (s = n.map((m) => Le(m) ? m.trim() : m)), f && (s = n.map(Rl));
  }
  let l, a = r[l = Go(e)] || // also try camelCase event handler (#2249)
  r[l = Go(rn(e))];
  !a && i && (a = r[l = Go(Fr(e))]), a && Pt(
    a,
    t,
    6,
    s
  );
  const c = r[l + "Once"];
  if (c) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[l])
      return;
    t.emitted[l] = !0, Pt(
      c,
      t,
      6,
      s
    );
  }
}
function qf(t, e, n = !1) {
  const r = e.emitsCache, s = r.get(t);
  if (s !== void 0)
    return s;
  const i = t.emits;
  let o = {}, l = !1;
  if (!oe(t)) {
    const a = (c) => {
      const u = qf(c, e, !0);
      u && (l = !0, Ve(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(a), t.extends && a(t.extends), t.mixins && t.mixins.forEach(a);
  }
  return !i && !l ? (xe(t) && r.set(t, null), null) : (te(i) ? i.forEach((a) => o[a] = null) : Ve(o, i), xe(t) && r.set(t, o), o);
}
function _o(t, e) {
  return !t || !yo(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), he(t, e[0].toLowerCase() + e.slice(1)) || he(t, Fr(e)) || he(t, e));
}
let Fe = null, So = null;
function _i(t) {
  const e = Fe;
  return Fe = t, So = t && t.type.__scopeId || null, e;
}
function qa(t) {
  So = t;
}
function Ga() {
  So = null;
}
function yt(t, e = Fe, n) {
  if (!e || t._n)
    return t;
  const r = (...s) => {
    r._d && bu(-1);
    const i = _i(e);
    let o;
    try {
      o = t(...s);
    } finally {
      _i(i), r._d && bu(1);
    }
    return o;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function Yo(t) {
  const {
    type: e,
    vnode: n,
    proxy: r,
    withProxy: s,
    props: i,
    propsOptions: [o],
    slots: l,
    attrs: a,
    emit: c,
    render: u,
    renderCache: f,
    data: h,
    setupState: m,
    ctx: y,
    inheritAttrs: b
  } = t;
  let x, C;
  const T = _i(t);
  try {
    if (n.shapeFlag & 4) {
      const d = s || r, g = ss.NODE_ENV !== "production" && m.__isScriptSetup ? new Proxy(d, {
        get(p, v, w) {
          return u1(
            `Property '${String(
              v
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          ), Reflect.get(p, v, w);
        }
      }) : d;
      x = Qt(
        u.call(
          g,
          d,
          f,
          i,
          m,
          h,
          y
        )
      ), C = a;
    } else {
      const d = e;
      ss.NODE_ENV, x = Qt(
        d.length > 1 ? d(
          i,
          ss.NODE_ENV !== "production" ? {
            get attrs() {
              return a;
            },
            slots: l,
            emit: c
          } : { attrs: a, slots: l, emit: c }
        ) : d(
          i,
          null
          /* we know it doesn't need it */
        )
      ), C = e.props ? a : x1(a);
    }
  } catch (d) {
    us.length = 0, ko(d, t, 1), x = ye(It);
  }
  let O = x;
  if (C && b !== !1) {
    const d = Object.keys(C), { shapeFlag: g } = O;
    d.length && g & 7 && (o && d.some(Pa) && (C = k1(
      C,
      o
    )), O = fn(O, C));
  }
  return n.dirs && (O = fn(O), O.dirs = O.dirs ? O.dirs.concat(n.dirs) : n.dirs), n.transition && (O.transition = n.transition), x = O, _i(T), x;
}
const x1 = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || yo(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, k1 = (t, e) => {
  const n = {};
  for (const r in t)
    (!Pa(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function _1(t, e, n) {
  const { props: r, children: s, component: i } = t, { props: o, children: l, patchFlag: a } = e, c = i.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return r ? ou(r, o, c) : !!o;
    if (a & 8) {
      const u = e.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        const h = u[f];
        if (o[h] !== r[h] && !_o(c, h))
          return !0;
      }
    }
  } else
    return (s || l) && (!l || !l.$stable) ? !0 : r === o ? !1 : r ? o ? ou(r, o, c) : !0 : !!o;
  return !1;
}
function ou(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let s = 0; s < r.length; s++) {
    const i = r[s];
    if (e[i] !== t[i] && !_o(n, i))
      return !0;
  }
  return !1;
}
function S1({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const r = e.subTree;
    if (r.suspense && r.suspense.activeBranch === t && (r.el = t.el), r === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const Gf = "components";
function Ce(t, e) {
  return E1(Gf, t, !0, e) || t;
}
const C1 = Symbol.for("v-ndc");
function E1(t, e, n = !0, r = !1) {
  const s = Fe || He;
  if (s) {
    const i = s.type;
    if (t === Gf) {
      const l = gh(
        i,
        !1
      );
      if (l && (l === e || l === rn(e) || l === wo(rn(e))))
        return i;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      lu(s[t] || i[t], e) || // global registration
      lu(s.appContext[t], e)
    );
    return !o && r ? i : o;
  }
}
function lu(t, e) {
  return t && (t[e] || t[rn(e)] || t[wo(rn(e))]);
}
const M1 = (t) => t.__isSuspense;
function A1(t, e) {
  e && e.pendingBranch ? te(t) ? e.effects.push(...t) : e.effects.push(t) : b1(t);
}
const T1 = Symbol.for("v-scx"), O1 = () => In(T1);
function Wr(t, e) {
  return Ja(t, null, e);
}
const Hs = {};
function jr(t, e, n) {
  return Ja(t, e, n);
}
function Ja(t, e, {
  immediate: n,
  deep: r,
  flush: s,
  once: i,
  onTrack: o,
  onTrigger: l
} = we) {
  if (e && i) {
    const p = e;
    e = (...v) => {
      p(...v), g();
    };
  }
  const a = He, c = (p) => r === !0 ? p : (
    // for deep: false, only traverse root-level properties
    tr(p, r === !1 ? 1 : void 0)
  );
  let u, f = !1, h = !1;
  if (ht(t) ? (u = () => t.value, f = ki(t)) : Tr(t) ? (u = () => c(t), f = !0) : te(t) ? (h = !0, f = t.some((p) => Tr(p) || ki(p)), u = () => t.map((p) => {
    if (ht(p))
      return p.value;
    if (Tr(p))
      return c(p);
    if (oe(p))
      return dn(p, a, 2);
  })) : oe(t) ? e ? u = () => dn(t, a, 2) : u = () => (m && m(), Pt(
    t,
    a,
    3,
    [y]
  )) : u = St, e && r) {
    const p = u;
    u = () => tr(p());
  }
  let m, y = (p) => {
    m = O.onStop = () => {
      dn(p, a, 4), m = O.onStop = void 0;
    };
  }, b;
  if (jo)
    if (y = St, e ? n && Pt(e, a, 3, [
      u(),
      h ? [] : void 0,
      y
    ]) : u(), s === "sync") {
      const p = O1();
      b = p.__watcherHandles || (p.__watcherHandles = []);
    } else
      return St;
  let x = h ? new Array(t.length).fill(Hs) : Hs;
  const C = () => {
    if (!(!O.active || !O.dirty))
      if (e) {
        const p = O.run();
        (r || f || (h ? p.some((v, w) => $n(v, x[w])) : $n(p, x))) && (m && m(), Pt(e, a, 3, [
          p,
          // pass undefined as the old value when it's changed for the first time
          x === Hs ? void 0 : h && x[0] === Hs ? [] : x,
          y
        ]), x = p);
      } else
        O.run();
  };
  C.allowRecurse = !!e;
  let T;
  s === "sync" ? T = C : s === "post" ? T = () => mt(C, a && a.suspense) : (C.pre = !0, a && (C.id = a.uid), T = () => Ua(C));
  const O = new za(u, St, T), d = _f(), g = () => {
    O.stop(), d && Ia(d.effects, O);
  };
  return e ? n ? C() : x = O.run() : s === "post" ? mt(
    O.run.bind(O),
    a && a.suspense
  ) : O.run(), b && b.push(g), g;
}
function j1(t, e, n) {
  const r = this.proxy, s = Le(t) ? t.includes(".") ? Jf(r, t) : () => r[t] : t.bind(r, r);
  let i;
  oe(e) ? i = e : (i = e.handler, n = e);
  const o = js(this), l = Ja(s, i.bind(r), n);
  return o(), l;
}
function Jf(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let s = 0; s < n.length && r; s++)
      r = r[n[s]];
    return r;
  };
}
function tr(t, e, n = 0, r) {
  if (!xe(t) || t.__v_skip)
    return t;
  if (e && e > 0) {
    if (n >= e)
      return t;
    n++;
  }
  if (r = r || /* @__PURE__ */ new Set(), r.has(t))
    return t;
  if (r.add(t), ht(t))
    tr(t.value, e, n, r);
  else if (te(t))
    for (let s = 0; s < t.length; s++)
      tr(t[s], e, n, r);
  else if (gf(t) || Ar(t))
    t.forEach((s) => {
      tr(s, e, n, r);
    });
  else if (vf(t))
    for (const s in t)
      tr(t[s], e, n, r);
  return t;
}
function au(t, e) {
  if (Fe === null)
    return t;
  const n = Ro(Fe) || Fe.proxy, r = t.dirs || (t.dirs = []);
  for (let s = 0; s < e.length; s++) {
    let [i, o, l, a = we] = e[s];
    i && (oe(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && tr(o), r.push({
      dir: i,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return t;
}
function qn(t, e, n, r) {
  const s = t.dirs, i = e && e.dirs;
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    i && (l.oldValue = i[o].value);
    let a = l.dir[r];
    a && (Hn(), Pt(a, n, 8, [
      t.el,
      l,
      t,
      e
    ]), Fn());
  }
}
const kn = Symbol("_leaveCb"), Fs = Symbol("_enterCb");
function R1() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Os(() => {
    t.isMounted = !0;
  }), eh(() => {
    t.isUnmounting = !0;
  }), t;
}
const Mt = [Function, Array], Yf = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Mt,
  onEnter: Mt,
  onAfterEnter: Mt,
  onEnterCancelled: Mt,
  // leave
  onBeforeLeave: Mt,
  onLeave: Mt,
  onAfterLeave: Mt,
  onLeaveCancelled: Mt,
  // appear
  onBeforeAppear: Mt,
  onAppear: Mt,
  onAfterAppear: Mt,
  onAppearCancelled: Mt
}, P1 = {
  name: "BaseTransition",
  props: Yf,
  setup(t, { slots: e }) {
    const n = tc(), r = R1();
    let s;
    return () => {
      const i = e.default && Qf(e.default(), !0);
      if (!i || !i.length)
        return;
      let o = i[0];
      if (i.length > 1) {
        for (const b of i)
          if (b.type !== It) {
            o = b;
            break;
          }
      }
      const l = fe(t), { mode: a } = l;
      if (r.isLeaving)
        return Xo(o);
      const c = cu(o);
      if (!c)
        return Xo(o);
      const u = $l(
        c,
        l,
        r,
        n
      );
      Dl(c, u);
      const f = n.subTree, h = f && cu(f);
      let m = !1;
      const { getTransitionKey: y } = c.type;
      if (y) {
        const b = y();
        s === void 0 ? s = b : b !== s && (s = b, m = !0);
      }
      if (h && h.type !== It && (!Qn(c, h) || m)) {
        const b = $l(
          h,
          l,
          r,
          n
        );
        if (Dl(h, b), a === "out-in")
          return r.isLeaving = !0, b.afterLeave = () => {
            r.isLeaving = !1, n.update.active !== !1 && (n.effect.dirty = !0, n.update());
          }, Xo(o);
        a === "in-out" && c.type !== It && (b.delayLeave = (x, C, T) => {
          const O = Xf(
            r,
            h
          );
          O[String(h.key)] = h, x[kn] = () => {
            C(), x[kn] = void 0, delete u.delayedLeave;
          }, u.delayedLeave = T;
        });
      }
      return o;
    };
  }
}, I1 = P1;
function Xf(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(e.type, r)), r;
}
function $l(t, e, n, r) {
  const {
    appear: s,
    mode: i,
    persisted: o = !1,
    onBeforeEnter: l,
    onEnter: a,
    onAfterEnter: c,
    onEnterCancelled: u,
    onBeforeLeave: f,
    onLeave: h,
    onAfterLeave: m,
    onLeaveCancelled: y,
    onBeforeAppear: b,
    onAppear: x,
    onAfterAppear: C,
    onAppearCancelled: T
  } = e, O = String(t.key), d = Xf(n, t), g = (w, _) => {
    w && Pt(
      w,
      r,
      9,
      _
    );
  }, p = (w, _) => {
    const k = _[1];
    g(w, _), te(w) ? w.every((M) => M.length <= 1) && k() : w.length <= 1 && k();
  }, v = {
    mode: i,
    persisted: o,
    beforeEnter(w) {
      let _ = l;
      if (!n.isMounted)
        if (s)
          _ = b || l;
        else
          return;
      w[kn] && w[kn](
        !0
        /* cancelled */
      );
      const k = d[O];
      k && Qn(t, k) && k.el[kn] && k.el[kn](), g(_, [w]);
    },
    enter(w) {
      let _ = a, k = c, M = u;
      if (!n.isMounted)
        if (s)
          _ = x || a, k = C || c, M = T || u;
        else
          return;
      let j = !1;
      const P = w[Fs] = (L) => {
        j || (j = !0, L ? g(M, [w]) : g(k, [w]), v.delayedLeave && v.delayedLeave(), w[Fs] = void 0);
      };
      _ ? p(_, [w, P]) : P();
    },
    leave(w, _) {
      const k = String(t.key);
      if (w[Fs] && w[Fs](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return _();
      g(f, [w]);
      let M = !1;
      const j = w[kn] = (P) => {
        M || (M = !0, _(), P ? g(y, [w]) : g(m, [w]), w[kn] = void 0, d[k] === t && delete d[k]);
      };
      d[k] = t, h ? p(h, [w, j]) : j();
    },
    clone(w) {
      return $l(w, e, n, r);
    }
  };
  return v;
}
function Xo(t) {
  if (Co(t))
    return t = fn(t), t.children = null, t;
}
function cu(t) {
  return Co(t) ? (
    // #7121 ensure get the child component subtree in case
    // it's been replaced during HMR
    t.children ? t.children[0] : void 0
  ) : t;
}
function Dl(t, e) {
  t.shapeFlag & 6 && t.component ? Dl(t.component.subTree, e) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Qf(t, e = !1, n) {
  let r = [], s = 0;
  for (let i = 0; i < t.length; i++) {
    let o = t[i];
    const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
    o.type === Pe ? (o.patchFlag & 128 && s++, r = r.concat(
      Qf(o.children, e, l)
    )) : (e || o.type !== It) && r.push(l != null ? fn(o, { key: l }) : o);
  }
  if (s > 1)
    for (let i = 0; i < r.length; i++)
      r[i].patchFlag = -2;
  return r;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Xe(t, e) {
  return oe(t) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ve({ name: t.name }, e, { setup: t })
  ) : t;
}
const ls = (t) => !!t.type.__asyncLoader, Co = (t) => t.type.__isKeepAlive;
function L1(t, e) {
  Zf(t, "a", e);
}
function N1(t, e) {
  Zf(t, "da", e);
}
function Zf(t, e, n = He) {
  const r = t.__wdc || (t.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return t();
  });
  if (Eo(e, r, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      Co(s.parent.vnode) && z1(r, e, n, s), s = s.parent;
  }
}
function z1(t, e, n, r) {
  const s = Eo(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  Mo(() => {
    Ia(r[e], s);
  }, n);
}
function Eo(t, e, n = He, r = !1) {
  if (n) {
    const s = n[t] || (n[t] = []), i = e.__weh || (e.__weh = (...o) => {
      if (n.isUnmounted)
        return;
      Hn();
      const l = js(n), a = Pt(e, n, t, o);
      return l(), Fn(), a;
    });
    return r ? s.unshift(i) : s.push(i), i;
  }
}
const hn = (t) => (e, n = He) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!jo || t === "sp") && Eo(t, (...r) => e(...r), n)
), $1 = hn("bm"), Os = hn("m"), D1 = hn("bu"), B1 = hn("u"), eh = hn("bum"), Mo = hn("um"), H1 = hn("sp"), F1 = hn(
  "rtg"
), W1 = hn(
  "rtc"
);
function V1(t, e = He) {
  Eo("ec", t, e);
}
function Ao(t, e, n, r) {
  let s;
  const i = n && n[r];
  if (te(t) || Le(t)) {
    s = new Array(t.length);
    for (let o = 0, l = t.length; o < l; o++)
      s[o] = e(t[o], o, void 0, i && i[o]);
  } else if (typeof t == "number") {
    s = new Array(t);
    for (let o = 0; o < t; o++)
      s[o] = e(o + 1, o, void 0, i && i[o]);
  } else if (xe(t))
    if (t[Symbol.iterator])
      s = Array.from(
        t,
        (o, l) => e(o, l, void 0, i && i[l])
      );
    else {
      const o = Object.keys(t);
      s = new Array(o.length);
      for (let l = 0, a = o.length; l < a; l++) {
        const c = o[l];
        s[l] = e(t[c], c, l, i && i[l]);
      }
    }
  else
    s = [];
  return n && (n[r] = s), s;
}
function Cr(t, e, n = {}, r, s) {
  if (Fe.isCE || Fe.parent && ls(Fe.parent) && Fe.parent.isCE)
    return e !== "default" && (n.name = e), ye("slot", n, r && r());
  let i = t[e];
  i && i._c && (i._d = !1), Z();
  const o = i && th(i(n)), l = We(
    Pe,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      o && o.key || `_${e}`
    },
    o || (r ? r() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !s && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), i && i._c && (i._d = !0), l;
}
function th(t) {
  return t.some((e) => Ci(e) ? !(e.type === It || e.type === Pe && !th(e.children)) : !0) ? t : null;
}
const Bl = (t) => t ? hh(t) ? Ro(t) || t.proxy : Bl(t.parent) : null, as = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ve(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => Bl(t.parent),
    $root: (t) => Bl(t.root),
    $emit: (t) => t.emit,
    $options: (t) => Ya(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      t.effect.dirty = !0, Ua(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = tn.bind(t.proxy)),
    $watch: (t) => j1.bind(t)
  })
), Qo = (t, e) => t !== we && !t.__isScriptSetup && he(t, e), K1 = {
  get({ _: t }, e) {
    const { ctx: n, setupState: r, data: s, props: i, accessCache: o, type: l, appContext: a } = t;
    let c;
    if (e[0] !== "$") {
      const m = o[e];
      if (m !== void 0)
        switch (m) {
          case 1:
            return r[e];
          case 2:
            return s[e];
          case 4:
            return n[e];
          case 3:
            return i[e];
        }
      else {
        if (Qo(r, e))
          return o[e] = 1, r[e];
        if (s !== we && he(s, e))
          return o[e] = 2, s[e];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (c = t.propsOptions[0]) && he(c, e)
        )
          return o[e] = 3, i[e];
        if (n !== we && he(n, e))
          return o[e] = 4, n[e];
        Hl && (o[e] = 0);
      }
    }
    const u = as[e];
    let f, h;
    if (u)
      return e === "$attrs" && vt(t, "get", e), u(t);
    if (
      // css module (injected by vue-loader)
      (f = l.__cssModules) && (f = f[e])
    )
      return f;
    if (n !== we && he(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      h = a.config.globalProperties, he(h, e)
    )
      return h[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: s, ctx: i } = t;
    return Qo(s, e) ? (s[e] = n, !0) : r !== we && he(r, e) ? (r[e] = n, !0) : he(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (i[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: s, propsOptions: i }
  }, o) {
    let l;
    return !!n[o] || t !== we && he(t, o) || Qo(e, o) || (l = i[0]) && he(l, o) || he(r, o) || he(as, o) || he(s.config.globalProperties, o);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : he(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function U1() {
  return q1().slots;
}
function q1() {
  const t = tc();
  return t.setupContext || (t.setupContext = mh(t));
}
function uu(t) {
  return te(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let Hl = !0;
function G1(t) {
  const e = Ya(t), n = t.proxy, r = t.ctx;
  Hl = !1, e.beforeCreate && du(e.beforeCreate, t, "bc");
  const {
    // state
    data: s,
    computed: i,
    methods: o,
    watch: l,
    provide: a,
    inject: c,
    // lifecycle
    created: u,
    beforeMount: f,
    mounted: h,
    beforeUpdate: m,
    updated: y,
    activated: b,
    deactivated: x,
    beforeDestroy: C,
    beforeUnmount: T,
    destroyed: O,
    unmounted: d,
    render: g,
    renderTracked: p,
    renderTriggered: v,
    errorCaptured: w,
    serverPrefetch: _,
    // public API
    expose: k,
    inheritAttrs: M,
    // assets
    components: j,
    directives: P,
    filters: L
  } = e;
  if (c && J1(c, r, null), o)
    for (const R in o) {
      const N = o[R];
      oe(N) && (r[R] = N.bind(n));
    }
  if (s) {
    const R = s.call(n, n);
    xe(R) && (t.data = Ts(R));
  }
  if (Hl = !0, i)
    for (const R in i) {
      const N = i[R], q = oe(N) ? N.bind(n, n) : oe(N.get) ? N.get.bind(n, n) : St, re = !oe(N) && oe(N.set) ? N.set.bind(n) : St, J = lt({
        get: q,
        set: re
      });
      Object.defineProperty(r, R, {
        enumerable: !0,
        configurable: !0,
        get: () => J.value,
        set: (ce) => J.value = ce
      });
    }
  if (l)
    for (const R in l)
      nh(l[R], r, n, R);
  if (a) {
    const R = oe(a) ? a.call(n) : a;
    Reflect.ownKeys(R).forEach((N) => {
      Xa(N, R[N]);
    });
  }
  u && du(u, t, "c");
  function S(R, N) {
    te(N) ? N.forEach((q) => R(q.bind(n))) : N && R(N.bind(n));
  }
  if (S($1, f), S(Os, h), S(D1, m), S(B1, y), S(L1, b), S(N1, x), S(V1, w), S(W1, p), S(F1, v), S(eh, T), S(Mo, d), S(H1, _), te(k))
    if (k.length) {
      const R = t.exposed || (t.exposed = {});
      k.forEach((N) => {
        Object.defineProperty(R, N, {
          get: () => n[N],
          set: (q) => n[N] = q
        });
      });
    } else
      t.exposed || (t.exposed = {});
  g && t.render === St && (t.render = g), M != null && (t.inheritAttrs = M), j && (t.components = j), P && (t.directives = P);
}
function J1(t, e, n = St) {
  te(t) && (t = Fl(t));
  for (const r in t) {
    const s = t[r];
    let i;
    xe(s) ? "default" in s ? i = In(
      s.from || r,
      s.default,
      !0
    ) : i = In(s.from || r) : i = In(s), ht(i) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (o) => i.value = o
    }) : e[r] = i;
  }
}
function du(t, e, n) {
  Pt(
    te(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function nh(t, e, n, r) {
  const s = r.includes(".") ? Jf(n, r) : () => n[r];
  if (Le(t)) {
    const i = e[t];
    oe(i) && jr(s, i);
  } else if (oe(t))
    jr(s, t.bind(n));
  else if (xe(t))
    if (te(t))
      t.forEach((i) => nh(i, e, n, r));
    else {
      const i = oe(t.handler) ? t.handler.bind(n) : e[t.handler];
      oe(i) && jr(s, i, t);
    }
}
function Ya(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: s,
    optionsCache: i,
    config: { optionMergeStrategies: o }
  } = t.appContext, l = i.get(e);
  let a;
  return l ? a = l : !s.length && !n && !r ? a = e : (a = {}, s.length && s.forEach(
    (c) => Si(a, c, o, !0)
  ), Si(a, e, o)), xe(e) && i.set(e, a), a;
}
function Si(t, e, n, r = !1) {
  const { mixins: s, extends: i } = e;
  i && Si(t, i, n, !0), s && s.forEach(
    (o) => Si(t, o, n, !0)
  );
  for (const o in e)
    if (!(r && o === "expose")) {
      const l = Y1[o] || n && n[o];
      t[o] = l ? l(t[o], e[o]) : e[o];
    }
  return t;
}
const Y1 = {
  data: fu,
  props: hu,
  emits: hu,
  // objects
  methods: Qr,
  computed: Qr,
  // lifecycle
  beforeCreate: dt,
  created: dt,
  beforeMount: dt,
  mounted: dt,
  beforeUpdate: dt,
  updated: dt,
  beforeDestroy: dt,
  beforeUnmount: dt,
  destroyed: dt,
  unmounted: dt,
  activated: dt,
  deactivated: dt,
  errorCaptured: dt,
  serverPrefetch: dt,
  // assets
  components: Qr,
  directives: Qr,
  // watch
  watch: Q1,
  // provide / inject
  provide: fu,
  inject: X1
};
function fu(t, e) {
  return e ? t ? function() {
    return Ve(
      oe(t) ? t.call(this, this) : t,
      oe(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function X1(t, e) {
  return Qr(Fl(t), Fl(e));
}
function Fl(t) {
  if (te(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function dt(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function Qr(t, e) {
  return t ? Ve(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function hu(t, e) {
  return t ? te(t) && te(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Ve(
    /* @__PURE__ */ Object.create(null),
    uu(t),
    uu(e ?? {})
  ) : e;
}
function Q1(t, e) {
  if (!t)
    return e;
  if (!e)
    return t;
  const n = Ve(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = dt(t[r], e[r]);
  return n;
}
function rh() {
  return {
    app: null,
    config: {
      isNativeTag: Cm,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Z1 = 0;
function eg(t, e) {
  return function(r, s = null) {
    oe(r) || (r = Ve({}, r)), s != null && !xe(s) && (s = null);
    const i = rh(), o = /* @__PURE__ */ new WeakSet();
    let l = !1;
    const a = i.app = {
      _uid: Z1++,
      _component: r,
      _props: s,
      _container: null,
      _context: i,
      _instance: null,
      version: _g,
      get config() {
        return i.config;
      },
      set config(c) {
      },
      use(c, ...u) {
        return o.has(c) || (c && oe(c.install) ? (o.add(c), c.install(a, ...u)) : oe(c) && (o.add(c), c(a, ...u))), a;
      },
      mixin(c) {
        return i.mixins.includes(c) || i.mixins.push(c), a;
      },
      component(c, u) {
        return u ? (i.components[c] = u, a) : i.components[c];
      },
      directive(c, u) {
        return u ? (i.directives[c] = u, a) : i.directives[c];
      },
      mount(c, u, f) {
        if (!l) {
          const h = ye(r, s);
          return h.appContext = i, f === !0 ? f = "svg" : f === !1 && (f = void 0), u && e ? e(h, c) : t(h, c, f), l = !0, a._container = c, c.__vue_app__ = a, Ro(h.component) || h.component.proxy;
        }
      },
      unmount() {
        l && (t(null, a._container), delete a._container.__vue_app__);
      },
      provide(c, u) {
        return i.provides[c] = u, a;
      },
      runWithContext(c) {
        const u = cs;
        cs = a;
        try {
          return c();
        } finally {
          cs = u;
        }
      }
    };
    return a;
  };
}
let cs = null;
function Xa(t, e) {
  if (He) {
    let n = He.provides;
    const r = He.parent && He.parent.provides;
    r === n && (n = He.provides = Object.create(r)), n[t] = e;
  }
}
function In(t, e, n = !1) {
  const r = He || Fe;
  if (r || cs) {
    const s = r ? r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : cs._context.provides;
    if (s && t in s)
      return s[t];
    if (arguments.length > 1)
      return n && oe(e) ? e.call(r && r.proxy) : e;
  }
}
function tg(t, e, n, r = !1) {
  const s = {}, i = {};
  xi(i, Oo, 1), t.propsDefaults = /* @__PURE__ */ Object.create(null), sh(t, e, s, i);
  for (const o in t.propsOptions[0])
    o in s || (s[o] = void 0);
  n ? t.props = r ? s : i1(s) : t.type.props ? t.props = s : t.props = i, t.attrs = i;
}
function ng(t, e, n, r) {
  const {
    props: s,
    attrs: i,
    vnode: { patchFlag: o }
  } = t, l = fe(s), [a] = t.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const u = t.vnode.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        let h = u[f];
        if (_o(t.emitsOptions, h))
          continue;
        const m = e[h];
        if (a)
          if (he(i, h))
            m !== i[h] && (i[h] = m, c = !0);
          else {
            const y = rn(h);
            s[y] = Wl(
              a,
              l,
              y,
              m,
              t,
              !1
            );
          }
        else
          m !== i[h] && (i[h] = m, c = !0);
      }
    }
  } else {
    sh(t, e, s, i) && (c = !0);
    let u;
    for (const f in l)
      (!e || // for camelCase
      !he(e, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = Fr(f)) === f || !he(e, u))) && (a ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[u] !== void 0) && (s[f] = Wl(
        a,
        l,
        f,
        void 0,
        t,
        !0
      )) : delete s[f]);
    if (i !== l)
      for (const f in i)
        (!e || !he(e, f)) && (delete i[f], c = !0);
  }
  c && un(t, "set", "$attrs");
}
function sh(t, e, n, r) {
  const [s, i] = t.propsOptions;
  let o = !1, l;
  if (e)
    for (let a in e) {
      if (rs(a))
        continue;
      const c = e[a];
      let u;
      s && he(s, u = rn(a)) ? !i || !i.includes(u) ? n[u] = c : (l || (l = {}))[u] = c : _o(t.emitsOptions, a) || (!(a in r) || c !== r[a]) && (r[a] = c, o = !0);
    }
  if (i) {
    const a = fe(n), c = l || we;
    for (let u = 0; u < i.length; u++) {
      const f = i[u];
      n[f] = Wl(
        s,
        a,
        f,
        c[f],
        t,
        !he(c, f)
      );
    }
  }
  return o;
}
function Wl(t, e, n, r, s, i) {
  const o = t[n];
  if (o != null) {
    const l = he(o, "default");
    if (l && r === void 0) {
      const a = o.default;
      if (o.type !== Function && !o.skipFactory && oe(a)) {
        const { propsDefaults: c } = s;
        if (n in c)
          r = c[n];
        else {
          const u = js(s);
          r = c[n] = a.call(
            null,
            e
          ), u();
        }
      } else
        r = a;
    }
    o[
      0
      /* shouldCast */
    ] && (i && !l ? r = !1 : o[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === Fr(n)) && (r = !0));
  }
  return r;
}
function ih(t, e, n = !1) {
  const r = e.propsCache, s = r.get(t);
  if (s)
    return s;
  const i = t.props, o = {}, l = [];
  let a = !1;
  if (!oe(t)) {
    const u = (f) => {
      a = !0;
      const [h, m] = ih(f, e, !0);
      Ve(o, h), m && l.push(...m);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!i && !a)
    return xe(t) && r.set(t, Mr), Mr;
  if (te(i))
    for (let u = 0; u < i.length; u++) {
      const f = rn(i[u]);
      pu(f) && (o[f] = we);
    }
  else if (i)
    for (const u in i) {
      const f = rn(u);
      if (pu(f)) {
        const h = i[u], m = o[f] = te(h) || oe(h) ? { type: h } : Ve({}, h);
        if (m) {
          const y = yu(Boolean, m.type), b = yu(String, m.type);
          m[
            0
            /* shouldCast */
          ] = y > -1, m[
            1
            /* shouldCastTrue */
          ] = b < 0 || y < b, (y > -1 || he(m, "default")) && l.push(f);
        }
      }
    }
  const c = [o, l];
  return xe(t) && r.set(t, c), c;
}
function pu(t) {
  return t[0] !== "$" && !rs(t);
}
function mu(t) {
  return t === null ? "null" : typeof t == "function" ? t.name || "" : typeof t == "object" && t.constructor && t.constructor.name || "";
}
function gu(t, e) {
  return mu(t) === mu(e);
}
function yu(t, e) {
  return te(e) ? e.findIndex((n) => gu(n, t)) : oe(e) && gu(e, t) ? 0 : -1;
}
const oh = (t) => t[0] === "_" || t === "$stable", Qa = (t) => te(t) ? t.map(Qt) : [Qt(t)], rg = (t, e, n) => {
  if (e._n)
    return e;
  const r = yt((...s) => (ss.NODE_ENV !== "production" && He && (!n || (n.root, He.root)), Qa(e(...s))), n);
  return r._c = !1, r;
}, lh = (t, e, n) => {
  const r = t._ctx;
  for (const s in t) {
    if (oh(s))
      continue;
    const i = t[s];
    if (oe(i))
      e[s] = rg(s, i, r);
    else if (i != null) {
      const o = Qa(i);
      e[s] = () => o;
    }
  }
}, ah = (t, e) => {
  const n = Qa(e);
  t.slots.default = () => n;
}, sg = (t, e) => {
  if (t.vnode.shapeFlag & 32) {
    const n = e._;
    n ? (t.slots = fe(e), xi(e, "_", n)) : lh(
      e,
      t.slots = {}
    );
  } else
    t.slots = {}, e && ah(t, e);
  xi(t.slots, Oo, 1);
}, ig = (t, e, n) => {
  const { vnode: r, slots: s } = t;
  let i = !0, o = we;
  if (r.shapeFlag & 32) {
    const l = e._;
    l ? n && l === 1 ? i = !1 : (Ve(s, e), !n && l === 1 && delete s._) : (i = !e.$stable, lh(e, s)), o = e;
  } else
    e && (ah(t, e), o = { default: 1 });
  if (i)
    for (const l in s)
      !oh(l) && o[l] == null && delete s[l];
};
function Vl(t, e, n, r, s = !1) {
  if (te(t)) {
    t.forEach(
      (h, m) => Vl(
        h,
        e && (te(e) ? e[m] : e),
        n,
        r,
        s
      )
    );
    return;
  }
  if (ls(r) && !s)
    return;
  const i = r.shapeFlag & 4 ? Ro(r.component) || r.component.proxy : r.el, o = s ? null : i, { i: l, r: a } = t, c = e && e.r, u = l.refs === we ? l.refs = {} : l.refs, f = l.setupState;
  if (c != null && c !== a && (Le(c) ? (u[c] = null, he(f, c) && (f[c] = null)) : ht(c) && (c.value = null)), oe(a))
    dn(a, l, 12, [o, u]);
  else {
    const h = Le(a), m = ht(a);
    if (h || m) {
      const y = () => {
        if (t.f) {
          const b = h ? he(f, a) ? f[a] : u[a] : a.value;
          s ? te(b) && Ia(b, i) : te(b) ? b.includes(i) || b.push(i) : h ? (u[a] = [i], he(f, a) && (f[a] = u[a])) : (a.value = [i], t.k && (u[t.k] = a.value));
        } else
          h ? (u[a] = o, he(f, a) && (f[a] = o)) : m && (a.value = o, t.k && (u[t.k] = o));
      };
      o ? (y.id = -1, mt(y, n)) : y();
    }
  }
}
const mt = A1;
function og(t) {
  return lg(t);
}
function lg(t, e) {
  const n = wf();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: s,
    patchProp: i,
    createElement: o,
    createText: l,
    createComment: a,
    setText: c,
    setElementText: u,
    parentNode: f,
    nextSibling: h,
    setScopeId: m = St,
    insertStaticContent: y
  } = t, b = (E, A, I, $ = null, D = null, W = null, G = void 0, F = null, K = !!A.dynamicChildren) => {
    if (E === A)
      return;
    E && !Qn(E, A) && ($ = Be(E), ce(E, D, W, !0), E = null), A.patchFlag === -2 && (K = !1, A.dynamicChildren = null);
    const { type: B, ref: Y, shapeFlag: Q } = A;
    switch (B) {
      case To:
        x(E, A, I, $);
        break;
      case It:
        C(E, A, I, $);
        break;
      case el:
        E == null && T(A, I, $, G);
        break;
      case Pe:
        j(
          E,
          A,
          I,
          $,
          D,
          W,
          G,
          F,
          K
        );
        break;
      default:
        Q & 1 ? g(
          E,
          A,
          I,
          $,
          D,
          W,
          G,
          F,
          K
        ) : Q & 6 ? P(
          E,
          A,
          I,
          $,
          D,
          W,
          G,
          F,
          K
        ) : (Q & 64 || Q & 128) && B.process(
          E,
          A,
          I,
          $,
          D,
          W,
          G,
          F,
          K,
          Vt
        );
    }
    Y != null && D && Vl(Y, E && E.ref, W, A || E, !A);
  }, x = (E, A, I, $) => {
    if (E == null)
      r(
        A.el = l(A.children),
        I,
        $
      );
    else {
      const D = A.el = E.el;
      A.children !== E.children && c(D, A.children);
    }
  }, C = (E, A, I, $) => {
    E == null ? r(
      A.el = a(A.children || ""),
      I,
      $
    ) : A.el = E.el;
  }, T = (E, A, I, $) => {
    [E.el, E.anchor] = y(
      E.children,
      A,
      I,
      $,
      E.el,
      E.anchor
    );
  }, O = ({ el: E, anchor: A }, I, $) => {
    let D;
    for (; E && E !== A; )
      D = h(E), r(E, I, $), E = D;
    r(A, I, $);
  }, d = ({ el: E, anchor: A }) => {
    let I;
    for (; E && E !== A; )
      I = h(E), s(E), E = I;
    s(A);
  }, g = (E, A, I, $, D, W, G, F, K) => {
    A.type === "svg" ? G = "svg" : A.type === "math" && (G = "mathml"), E == null ? p(
      A,
      I,
      $,
      D,
      W,
      G,
      F,
      K
    ) : _(
      E,
      A,
      D,
      W,
      G,
      F,
      K
    );
  }, p = (E, A, I, $, D, W, G, F) => {
    let K, B;
    const { props: Y, shapeFlag: Q, transition: X, dirs: ie } = E;
    if (K = E.el = o(
      E.type,
      W,
      Y && Y.is,
      Y
    ), Q & 8 ? u(K, E.children) : Q & 16 && w(
      E.children,
      K,
      null,
      $,
      D,
      Zo(E, W),
      G,
      F
    ), ie && qn(E, null, $, "created"), v(K, E, E.scopeId, G, $), Y) {
      for (const ge in Y)
        ge !== "value" && !rs(ge) && i(
          K,
          ge,
          null,
          Y[ge],
          W,
          E.children,
          $,
          D,
          ve
        );
      "value" in Y && i(K, "value", null, Y.value, W), (B = Y.onVnodeBeforeMount) && Ut(B, $, E);
    }
    ie && qn(E, null, $, "beforeMount");
    const ue = ag(D, X);
    ue && X.beforeEnter(K), r(K, A, I), ((B = Y && Y.onVnodeMounted) || ue || ie) && mt(() => {
      B && Ut(B, $, E), ue && X.enter(K), ie && qn(E, null, $, "mounted");
    }, D);
  }, v = (E, A, I, $, D) => {
    if (I && m(E, I), $)
      for (let W = 0; W < $.length; W++)
        m(E, $[W]);
    if (D) {
      let W = D.subTree;
      if (A === W) {
        const G = D.vnode;
        v(
          E,
          G,
          G.scopeId,
          G.slotScopeIds,
          D.parent
        );
      }
    }
  }, w = (E, A, I, $, D, W, G, F, K = 0) => {
    for (let B = K; B < E.length; B++) {
      const Y = E[B] = F ? _n(E[B]) : Qt(E[B]);
      b(
        null,
        Y,
        A,
        I,
        $,
        D,
        W,
        G,
        F
      );
    }
  }, _ = (E, A, I, $, D, W, G) => {
    const F = A.el = E.el;
    let { patchFlag: K, dynamicChildren: B, dirs: Y } = A;
    K |= E.patchFlag & 16;
    const Q = E.props || we, X = A.props || we;
    let ie;
    if (I && Gn(I, !1), (ie = X.onVnodeBeforeUpdate) && Ut(ie, I, A, E), Y && qn(A, E, I, "beforeUpdate"), I && Gn(I, !0), B ? k(
      E.dynamicChildren,
      B,
      F,
      I,
      $,
      Zo(A, D),
      W
    ) : G || N(
      E,
      A,
      F,
      null,
      I,
      $,
      Zo(A, D),
      W,
      !1
    ), K > 0) {
      if (K & 16)
        M(
          F,
          A,
          Q,
          X,
          I,
          $,
          D
        );
      else if (K & 2 && Q.class !== X.class && i(F, "class", null, X.class, D), K & 4 && i(F, "style", Q.style, X.style, D), K & 8) {
        const ue = A.dynamicProps;
        for (let ge = 0; ge < ue.length; ge++) {
          const ke = ue[ge], Ke = Q[ke], Nt = X[ke];
          (Nt !== Ke || ke === "value") && i(
            F,
            ke,
            Ke,
            Nt,
            D,
            E.children,
            I,
            $,
            ve
          );
        }
      }
      K & 1 && E.children !== A.children && u(F, A.children);
    } else
      !G && B == null && M(
        F,
        A,
        Q,
        X,
        I,
        $,
        D
      );
    ((ie = X.onVnodeUpdated) || Y) && mt(() => {
      ie && Ut(ie, I, A, E), Y && qn(A, E, I, "updated");
    }, $);
  }, k = (E, A, I, $, D, W, G) => {
    for (let F = 0; F < A.length; F++) {
      const K = E[F], B = A[F], Y = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        K.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (K.type === Pe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Qn(K, B) || // - In the case of a component, it could contain anything.
        K.shapeFlag & 70) ? f(K.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          I
        )
      );
      b(
        K,
        B,
        Y,
        null,
        $,
        D,
        W,
        G,
        !0
      );
    }
  }, M = (E, A, I, $, D, W, G) => {
    if (I !== $) {
      if (I !== we)
        for (const F in I)
          !rs(F) && !(F in $) && i(
            E,
            F,
            I[F],
            null,
            G,
            A.children,
            D,
            W,
            ve
          );
      for (const F in $) {
        if (rs(F))
          continue;
        const K = $[F], B = I[F];
        K !== B && F !== "value" && i(
          E,
          F,
          B,
          K,
          G,
          A.children,
          D,
          W,
          ve
        );
      }
      "value" in $ && i(E, "value", I.value, $.value, G);
    }
  }, j = (E, A, I, $, D, W, G, F, K) => {
    const B = A.el = E ? E.el : l(""), Y = A.anchor = E ? E.anchor : l("");
    let { patchFlag: Q, dynamicChildren: X, slotScopeIds: ie } = A;
    ie && (F = F ? F.concat(ie) : ie), E == null ? (r(B, I, $), r(Y, I, $), w(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      A.children || [],
      I,
      Y,
      D,
      W,
      G,
      F,
      K
    )) : Q > 0 && Q & 64 && X && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    E.dynamicChildren ? (k(
      E.dynamicChildren,
      X,
      I,
      D,
      W,
      G,
      F
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (A.key != null || D && A === D.subTree) && ch(
      E,
      A,
      !0
      /* shallow */
    )) : N(
      E,
      A,
      I,
      Y,
      D,
      W,
      G,
      F,
      K
    );
  }, P = (E, A, I, $, D, W, G, F, K) => {
    A.slotScopeIds = F, E == null ? A.shapeFlag & 512 ? D.ctx.activate(
      A,
      I,
      $,
      G,
      K
    ) : L(
      A,
      I,
      $,
      D,
      W,
      G,
      K
    ) : z(E, A, K);
  }, L = (E, A, I, $, D, W, G) => {
    const F = E.component = gg(
      E,
      $,
      D
    );
    if (Co(E) && (F.ctx.renderer = Vt), yg(F), F.asyncDep) {
      if (D && D.registerDep(F, S), !E.el) {
        const K = F.subTree = ye(It);
        C(null, K, A, I);
      }
    } else
      S(
        F,
        E,
        A,
        I,
        D,
        W,
        G
      );
  }, z = (E, A, I) => {
    const $ = A.component = E.component;
    if (_1(E, A, I))
      if ($.asyncDep && !$.asyncResolved) {
        R($, A, I);
        return;
      } else
        $.next = A, y1($.update), $.effect.dirty = !0, $.update();
    else
      A.el = E.el, $.vnode = A;
  }, S = (E, A, I, $, D, W, G) => {
    const F = () => {
      if (E.isMounted) {
        let { next: Y, bu: Q, u: X, parent: ie, vnode: ue } = E;
        {
          const gr = uh(E);
          if (gr) {
            Y && (Y.el = ue.el, R(E, Y, G)), gr.asyncDep.then(() => {
              E.isUnmounted || F();
            });
            return;
          }
        }
        let ge = Y, ke;
        Gn(E, !1), Y ? (Y.el = ue.el, R(E, Y, G)) : Y = ue, Q && ai(Q), (ke = Y.props && Y.props.onVnodeBeforeUpdate) && Ut(ke, ie, Y, ue), Gn(E, !0);
        const Ke = Yo(E), Nt = E.subTree;
        E.subTree = Ke, b(
          Nt,
          Ke,
          // parent may have changed if it's in a teleport
          f(Nt.el),
          // anchor may have changed if it's in a fragment
          Be(Nt),
          E,
          D,
          W
        ), Y.el = Ke.el, ge === null && S1(E, Ke.el), X && mt(X, D), (ke = Y.props && Y.props.onVnodeUpdated) && mt(
          () => Ut(ke, ie, Y, ue),
          D
        );
      } else {
        let Y;
        const { el: Q, props: X } = A, { bm: ie, m: ue, parent: ge } = E, ke = ls(A);
        if (Gn(E, !1), ie && ai(ie), !ke && (Y = X && X.onVnodeBeforeMount) && Ut(Y, ge, A), Gn(E, !0), Q && Un) {
          const Ke = () => {
            E.subTree = Yo(E), Un(
              Q,
              E.subTree,
              E,
              D,
              null
            );
          };
          ke ? A.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !E.isUnmounted && Ke()
          ) : Ke();
        } else {
          const Ke = E.subTree = Yo(E);
          b(
            null,
            Ke,
            I,
            $,
            E,
            D,
            W
          ), A.el = Ke.el;
        }
        if (ue && mt(ue, D), !ke && (Y = X && X.onVnodeMounted)) {
          const Ke = A;
          mt(
            () => Ut(Y, ge, Ke),
            D
          );
        }
        (A.shapeFlag & 256 || ge && ls(ge.vnode) && ge.vnode.shapeFlag & 256) && E.a && mt(E.a, D), E.isMounted = !0, A = I = $ = null;
      }
    }, K = E.effect = new za(
      F,
      St,
      () => Ua(B),
      E.scope
      // track it in component's effect scope
    ), B = E.update = () => {
      K.dirty && K.run();
    };
    B.id = E.uid, Gn(E, !0), B();
  }, R = (E, A, I) => {
    A.component = E;
    const $ = E.vnode.props;
    E.vnode = A, E.next = null, ng(E, A.props, $, I), ig(E, A.children, I), Hn(), iu(E), Fn();
  }, N = (E, A, I, $, D, W, G, F, K = !1) => {
    const B = E && E.children, Y = E ? E.shapeFlag : 0, Q = A.children, { patchFlag: X, shapeFlag: ie } = A;
    if (X > 0) {
      if (X & 128) {
        re(
          B,
          Q,
          I,
          $,
          D,
          W,
          G,
          F,
          K
        );
        return;
      } else if (X & 256) {
        q(
          B,
          Q,
          I,
          $,
          D,
          W,
          G,
          F,
          K
        );
        return;
      }
    }
    ie & 8 ? (Y & 16 && ve(B, D, W), Q !== B && u(I, Q)) : Y & 16 ? ie & 16 ? re(
      B,
      Q,
      I,
      $,
      D,
      W,
      G,
      F,
      K
    ) : ve(B, D, W, !0) : (Y & 8 && u(I, ""), ie & 16 && w(
      Q,
      I,
      $,
      D,
      W,
      G,
      F,
      K
    ));
  }, q = (E, A, I, $, D, W, G, F, K) => {
    E = E || Mr, A = A || Mr;
    const B = E.length, Y = A.length, Q = Math.min(B, Y);
    let X;
    for (X = 0; X < Q; X++) {
      const ie = A[X] = K ? _n(A[X]) : Qt(A[X]);
      b(
        E[X],
        ie,
        I,
        null,
        D,
        W,
        G,
        F,
        K
      );
    }
    B > Y ? ve(
      E,
      D,
      W,
      !0,
      !1,
      Q
    ) : w(
      A,
      I,
      $,
      D,
      W,
      G,
      F,
      K,
      Q
    );
  }, re = (E, A, I, $, D, W, G, F, K) => {
    let B = 0;
    const Y = A.length;
    let Q = E.length - 1, X = Y - 1;
    for (; B <= Q && B <= X; ) {
      const ie = E[B], ue = A[B] = K ? _n(A[B]) : Qt(A[B]);
      if (Qn(ie, ue))
        b(
          ie,
          ue,
          I,
          null,
          D,
          W,
          G,
          F,
          K
        );
      else
        break;
      B++;
    }
    for (; B <= Q && B <= X; ) {
      const ie = E[Q], ue = A[X] = K ? _n(A[X]) : Qt(A[X]);
      if (Qn(ie, ue))
        b(
          ie,
          ue,
          I,
          null,
          D,
          W,
          G,
          F,
          K
        );
      else
        break;
      Q--, X--;
    }
    if (B > Q) {
      if (B <= X) {
        const ie = X + 1, ue = ie < Y ? A[ie].el : $;
        for (; B <= X; )
          b(
            null,
            A[B] = K ? _n(A[B]) : Qt(A[B]),
            I,
            ue,
            D,
            W,
            G,
            F,
            K
          ), B++;
      }
    } else if (B > X)
      for (; B <= Q; )
        ce(E[B], D, W, !0), B++;
    else {
      const ie = B, ue = B, ge = /* @__PURE__ */ new Map();
      for (B = ue; B <= X; B++) {
        const wt = A[B] = K ? _n(A[B]) : Qt(A[B]);
        wt.key != null && ge.set(wt.key, B);
      }
      let ke, Ke = 0;
      const Nt = X - ue + 1;
      let gr = !1, Gc = 0;
      const qr = new Array(Nt);
      for (B = 0; B < Nt; B++)
        qr[B] = 0;
      for (B = ie; B <= Q; B++) {
        const wt = E[B];
        if (Ke >= Nt) {
          ce(wt, D, W, !0);
          continue;
        }
        let Kt;
        if (wt.key != null)
          Kt = ge.get(wt.key);
        else
          for (ke = ue; ke <= X; ke++)
            if (qr[ke - ue] === 0 && Qn(wt, A[ke])) {
              Kt = ke;
              break;
            }
        Kt === void 0 ? ce(wt, D, W, !0) : (qr[Kt - ue] = B + 1, Kt >= Gc ? Gc = Kt : gr = !0, b(
          wt,
          A[Kt],
          I,
          null,
          D,
          W,
          G,
          F,
          K
        ), Ke++);
      }
      const Jc = gr ? cg(qr) : Mr;
      for (ke = Jc.length - 1, B = Nt - 1; B >= 0; B--) {
        const wt = ue + B, Kt = A[wt], Yc = wt + 1 < Y ? A[wt + 1].el : $;
        qr[B] === 0 ? b(
          null,
          Kt,
          I,
          Yc,
          D,
          W,
          G,
          F,
          K
        ) : gr && (ke < 0 || B !== Jc[ke] ? J(Kt, I, Yc, 2) : ke--);
      }
    }
  }, J = (E, A, I, $, D = null) => {
    const { el: W, type: G, transition: F, children: K, shapeFlag: B } = E;
    if (B & 6) {
      J(E.component.subTree, A, I, $);
      return;
    }
    if (B & 128) {
      E.suspense.move(A, I, $);
      return;
    }
    if (B & 64) {
      G.move(E, A, I, Vt);
      return;
    }
    if (G === Pe) {
      r(W, A, I);
      for (let Q = 0; Q < K.length; Q++)
        J(K[Q], A, I, $);
      r(E.anchor, A, I);
      return;
    }
    if (G === el) {
      O(E, A, I);
      return;
    }
    if ($ !== 2 && B & 1 && F)
      if ($ === 0)
        F.beforeEnter(W), r(W, A, I), mt(() => F.enter(W), D);
      else {
        const { leave: Q, delayLeave: X, afterLeave: ie } = F, ue = () => r(W, A, I), ge = () => {
          Q(W, () => {
            ue(), ie && ie();
          });
        };
        X ? X(W, ue, ge) : ge();
      }
    else
      r(W, A, I);
  }, ce = (E, A, I, $ = !1, D = !1) => {
    const {
      type: W,
      props: G,
      ref: F,
      children: K,
      dynamicChildren: B,
      shapeFlag: Y,
      patchFlag: Q,
      dirs: X
    } = E;
    if (F != null && Vl(F, null, I, E, !0), Y & 256) {
      A.ctx.deactivate(E);
      return;
    }
    const ie = Y & 1 && X, ue = !ls(E);
    let ge;
    if (ue && (ge = G && G.onVnodeBeforeUnmount) && Ut(ge, A, E), Y & 6)
      Te(E.component, I, $);
    else {
      if (Y & 128) {
        E.suspense.unmount(I, $);
        return;
      }
      ie && qn(E, null, A, "beforeUnmount"), Y & 64 ? E.type.remove(
        E,
        A,
        I,
        D,
        Vt,
        $
      ) : B && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (W !== Pe || Q > 0 && Q & 64) ? ve(
        B,
        A,
        I,
        !1,
        !0
      ) : (W === Pe && Q & 384 || !D && Y & 16) && ve(K, A, I), $ && Me(E);
    }
    (ue && (ge = G && G.onVnodeUnmounted) || ie) && mt(() => {
      ge && Ut(ge, A, E), ie && qn(E, null, A, "unmounted");
    }, I);
  }, Me = (E) => {
    const { type: A, el: I, anchor: $, transition: D } = E;
    if (A === Pe) {
      Ae(I, $);
      return;
    }
    if (A === el) {
      d(E);
      return;
    }
    const W = () => {
      s(I), D && !D.persisted && D.afterLeave && D.afterLeave();
    };
    if (E.shapeFlag & 1 && D && !D.persisted) {
      const { leave: G, delayLeave: F } = D, K = () => G(I, W);
      F ? F(E.el, W, K) : K();
    } else
      W();
  }, Ae = (E, A) => {
    let I;
    for (; E !== A; )
      I = h(E), s(E), E = I;
    s(A);
  }, Te = (E, A, I) => {
    const { bum: $, scope: D, update: W, subTree: G, um: F } = E;
    $ && ai($), D.stop(), W && (W.active = !1, ce(G, E, A, I)), F && mt(F, A), mt(() => {
      E.isUnmounted = !0;
    }, A), A && A.pendingBranch && !A.isUnmounted && E.asyncDep && !E.asyncResolved && E.suspenseId === A.pendingId && (A.deps--, A.deps === 0 && A.resolve());
  }, ve = (E, A, I, $ = !1, D = !1, W = 0) => {
    for (let G = W; G < E.length; G++)
      ce(E[G], A, I, $, D);
  }, Be = (E) => E.shapeFlag & 6 ? Be(E.component.subTree) : E.shapeFlag & 128 ? E.suspense.next() : h(E.anchor || E.el);
  let Qe = !1;
  const pr = (E, A, I) => {
    E == null ? A._vnode && ce(A._vnode, null, null, !0) : b(
      A._vnode || null,
      E,
      A,
      null,
      null,
      null,
      I
    ), Qe || (Qe = !0, iu(), Kf(), Qe = !1), A._vnode = E;
  }, Vt = {
    p: b,
    um: ce,
    m: J,
    r: Me,
    mt: L,
    mc: w,
    pc: N,
    pbc: k,
    n: Be,
    o: t
  };
  let mr, Un;
  return e && ([mr, Un] = e(
    Vt
  )), {
    render: pr,
    hydrate: mr,
    createApp: eg(pr, mr)
  };
}
function Zo({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function Gn({ effect: t, update: e }, n) {
  t.allowRecurse = e.allowRecurse = n;
}
function ag(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function ch(t, e, n = !1) {
  const r = t.children, s = e.children;
  if (te(r) && te(s))
    for (let i = 0; i < r.length; i++) {
      const o = r[i];
      let l = s[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = s[i] = _n(s[i]), l.el = o.el), n || ch(o, l)), l.type === To && (l.el = o.el);
    }
}
function cg(t) {
  const e = t.slice(), n = [0];
  let r, s, i, o, l;
  const a = t.length;
  for (r = 0; r < a; r++) {
    const c = t[r];
    if (c !== 0) {
      if (s = n[n.length - 1], t[s] < c) {
        e[r] = s, n.push(r);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        l = i + o >> 1, t[n[l]] < c ? i = l + 1 : o = l;
      c < t[n[i]] && (i > 0 && (e[r] = n[i - 1]), n[i] = r);
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; )
    n[i] = o, o = e[o];
  return n;
}
function uh(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : uh(e);
}
const ug = (t) => t.__isTeleport, Pe = Symbol.for("v-fgt"), To = Symbol.for("v-txt"), It = Symbol.for("v-cmt"), el = Symbol.for("v-stc"), us = [];
let Bt = null;
function Z(t = !1) {
  us.push(Bt = t ? null : []);
}
function dg() {
  us.pop(), Bt = us[us.length - 1] || null;
}
let vs = 1;
function bu(t) {
  vs += t;
}
function dh(t) {
  return t.dynamicChildren = vs > 0 ? Bt || Mr : null, dg(), vs > 0 && Bt && Bt.push(t), t;
}
function pe(t, e, n, r, s, i) {
  return dh(
    le(
      t,
      e,
      n,
      r,
      s,
      i,
      !0
    )
  );
}
function We(t, e, n, r, s) {
  return dh(
    ye(
      t,
      e,
      n,
      r,
      s,
      !0
    )
  );
}
function Ci(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Qn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const Oo = "__vInternal", fh = ({ key: t }) => t ?? null, ui = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Le(t) || ht(t) || oe(t) ? { i: Fe, r: t, k: e, f: !!n } : t : null);
function le(t, e = null, n = null, r = 0, s = null, i = t === Pe ? 0 : 1, o = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && fh(e),
    ref: e && ui(e),
    scopeId: So,
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
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: r,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: Fe
  };
  return l ? (Za(a, n), i & 128 && t.normalize(a)) : n && (a.shapeFlag |= Le(n) ? 8 : 16), vs > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Bt && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Bt.push(a), a;
}
const ye = fg;
function fg(t, e = null, n = null, r = 0, s = null, i = !1) {
  if ((!t || t === C1) && (t = It), Ci(t)) {
    const l = fn(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Za(l, n), vs > 0 && !i && Bt && (l.shapeFlag & 6 ? Bt[Bt.indexOf(t)] = l : Bt.push(l)), l.patchFlag |= -2, l;
  }
  if (kg(t) && (t = t.__vccOpts), e) {
    e = hg(e);
    let { class: l, style: a } = e;
    l && !Le(l) && (e.class = $t(l)), xe(a) && (Lf(a) && !te(a) && (a = Ve({}, a)), e.style = Na(a));
  }
  const o = Le(t) ? 1 : M1(t) ? 128 : ug(t) ? 64 : xe(t) ? 4 : oe(t) ? 2 : 0;
  return le(
    t,
    e,
    n,
    r,
    s,
    o,
    i,
    !0
  );
}
function hg(t) {
  return t ? Lf(t) || Oo in t ? Ve({}, t) : t : null;
}
function fn(t, e, n = !1) {
  const { props: r, ref: s, patchFlag: i, children: o } = t, l = e ? ec(r || {}, e) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: l,
    key: l && fh(l),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? te(s) ? s.concat(ui(e)) : [s, ui(e)] : ui(e)
    ) : s,
    scopeId: t.scopeId,
    slotScopeIds: t.slotScopeIds,
    children: o,
    target: t.target,
    targetAnchor: t.targetAnchor,
    staticCount: t.staticCount,
    shapeFlag: t.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: e && t.type !== Pe ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: t.dynamicProps,
    dynamicChildren: t.dynamicChildren,
    appContext: t.appContext,
    dirs: t.dirs,
    transition: t.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: t.component,
    suspense: t.suspense,
    ssContent: t.ssContent && fn(t.ssContent),
    ssFallback: t.ssFallback && fn(t.ssFallback),
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
}
function Ln(t = " ", e = 0) {
  return ye(To, null, t, e);
}
function Ge(t = "", e = !1) {
  return e ? (Z(), We(It, null, t)) : ye(It, null, t);
}
function Qt(t) {
  return t == null || typeof t == "boolean" ? ye(It) : te(t) ? ye(
    Pe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : typeof t == "object" ? _n(t) : ye(To, null, String(t));
}
function _n(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : fn(t);
}
function Za(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (te(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const s = e.default;
      s && (s._c && (s._d = !1), Za(t, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = e._;
      !s && !(Oo in e) ? e._ctx = Fe : s === 3 && Fe && (Fe.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else
    oe(e) ? (e = { default: e, _ctx: Fe }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [Ln(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function ec(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const s in r)
      if (s === "class")
        e.class !== r.class && (e.class = $t([e.class, r.class]));
      else if (s === "style")
        e.style = Na([e.style, r.style]);
      else if (yo(s)) {
        const i = e[s], o = r[s];
        o && i !== o && !(te(i) && i.includes(o)) && (e[s] = i ? [].concat(i, o) : o);
      } else
        s !== "" && (e[s] = r[s]);
  }
  return e;
}
function Ut(t, e, n, r = null) {
  Pt(t, e, 7, [
    n,
    r
  ]);
}
const pg = rh();
let mg = 0;
function gg(t, e, n) {
  const r = t.type, s = (e ? e.appContext : t.appContext) || pg, i = {
    uid: mg++,
    vnode: t,
    type: r,
    parent: e,
    appContext: s,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new zm(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(s.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: ih(r, s),
    emitsOptions: qf(r, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: we,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: we,
    data: we,
    props: we,
    attrs: we,
    slots: we,
    refs: we,
    setupState: we,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
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
    sp: null
  };
  return i.ctx = { _: i }, i.root = e ? e.root : i, i.emit = w1.bind(null, i), t.ce && t.ce(i), i;
}
let He = null;
const tc = () => He || Fe;
let Ei, Kl;
{
  const t = wf(), e = (n, r) => {
    let s;
    return (s = t[n]) || (s = t[n] = []), s.push(r), (i) => {
      s.length > 1 ? s.forEach((o) => o(i)) : s[0](i);
    };
  };
  Ei = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => He = n
  ), Kl = e(
    "__VUE_SSR_SETTERS__",
    (n) => jo = n
  );
}
const js = (t) => {
  const e = He;
  return Ei(t), t.scope.on(), () => {
    t.scope.off(), Ei(e);
  };
}, vu = () => {
  He && He.scope.off(), Ei(null);
};
function hh(t) {
  return t.vnode.shapeFlag & 4;
}
let jo = !1;
function yg(t, e = !1) {
  e && Kl(e);
  const { props: n, children: r } = t.vnode, s = hh(t);
  tg(t, n, s, e), sg(t, r);
  const i = s ? bg(t, e) : void 0;
  return e && Kl(!1), i;
}
function bg(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = Nf(new Proxy(t.ctx, K1));
  const { setup: r } = n;
  if (r) {
    const s = t.setupContext = r.length > 1 ? mh(t) : null, i = js(t);
    Hn();
    const o = dn(
      r,
      t,
      0,
      [
        t.props,
        s
      ]
    );
    if (Fn(), i(), yf(o)) {
      if (o.then(vu, vu), e)
        return o.then((l) => {
          wu(t, l, e);
        }).catch((l) => {
          ko(l, t, 0);
        });
      t.asyncDep = o;
    } else
      wu(t, o, e);
  } else
    ph(t, e);
}
function wu(t, e, n) {
  oe(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : xe(e) && (t.setupState = Hf(e)), ph(t, n);
}
let xu;
function ph(t, e, n) {
  const r = t.type;
  if (!t.render) {
    if (!e && xu && !r.render) {
      const s = r.template || Ya(t).template;
      if (s) {
        const { isCustomElement: i, compilerOptions: o } = t.appContext.config, { delimiters: l, compilerOptions: a } = r, c = Ve(
          Ve(
            {
              isCustomElement: i,
              delimiters: l
            },
            o
          ),
          a
        );
        r.render = xu(s, c);
      }
    }
    t.render = r.render || St;
  }
  {
    const s = js(t);
    Hn();
    try {
      G1(t);
    } finally {
      Fn(), s();
    }
  }
}
function vg(t) {
  return t.attrsProxy || (t.attrsProxy = new Proxy(
    t.attrs,
    {
      get(e, n) {
        return vt(t, "get", "$attrs"), e[n];
      }
    }
  ));
}
function mh(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    get attrs() {
      return vg(t);
    },
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function Ro(t) {
  if (t.exposed)
    return t.exposeProxy || (t.exposeProxy = new Proxy(Hf(Nf(t.exposed)), {
      get(e, n) {
        if (n in e)
          return e[n];
        if (n in as)
          return as[n](t);
      },
      has(e, n) {
        return n in e || n in as;
      }
    }));
}
const wg = /(?:^|[-_])(\w)/g, xg = (t) => t.replace(wg, (e) => e.toUpperCase()).replace(/[-_]/g, "");
function gh(t, e = !0) {
  return oe(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function yh(t, e, n = !1) {
  let r = gh(e);
  if (!r && e.__file) {
    const s = e.__file.match(/([^/\\]+)\.\w+$/);
    s && (r = s[1]);
  }
  if (!r && t && t.parent) {
    const s = (i) => {
      for (const o in i)
        if (i[o] === e)
          return o;
    };
    r = s(
      t.components || t.parent.type.components
    ) || s(t.appContext.components);
  }
  return r ? xg(r) : n ? "App" : "Anonymous";
}
function kg(t) {
  return oe(t) && "__vccOpts" in t;
}
const lt = (t, e) => o1(t, e, jo);
function Po(t, e, n) {
  const r = arguments.length;
  return r === 2 ? xe(e) && !te(e) ? Ci(e) ? ye(t, null, [e]) : ye(t, e) : ye(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ci(n) && (n = [n]), ye(t, e, n));
}
const _g = "3.4.19", Sg = "http://www.w3.org/2000/svg", Cg = "http://www.w3.org/1998/Math/MathML", Sn = typeof document < "u" ? document : null, ku = Sn && /* @__PURE__ */ Sn.createElement("template"), Eg = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const s = e === "svg" ? Sn.createElementNS(Sg, t) : e === "mathml" ? Sn.createElementNS(Cg, t) : Sn.createElement(t, n ? { is: n } : void 0);
    return t === "select" && r && r.multiple != null && s.setAttribute("multiple", r.multiple), s;
  },
  createText: (t) => Sn.createTextNode(t),
  createComment: (t) => Sn.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => Sn.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, n, r, s, i) {
    const o = n ? n.previousSibling : e.lastChild;
    if (s && (s === i || s.nextSibling))
      for (; e.insertBefore(s.cloneNode(!0), n), !(s === i || !(s = s.nextSibling)); )
        ;
    else {
      ku.innerHTML = r === "svg" ? `<svg>${t}</svg>` : r === "mathml" ? `<math>${t}</math>` : t;
      const l = ku.content;
      if (r === "svg" || r === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      e.insertBefore(l, n);
    }
    return [
      // first
      o ? o.nextSibling : e.firstChild,
      // last
      n ? n.previousSibling : e.lastChild
    ];
  }
}, mn = "transition", Gr = "animation", ws = Symbol("_vtc"), Io = (t, { slots: e }) => Po(I1, Mg(t), e);
Io.displayName = "Transition";
const bh = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Io.props = /* @__PURE__ */ Ve(
  {},
  Yf,
  bh
);
const Jn = (t, e = []) => {
  te(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, _u = (t) => t ? te(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function Mg(t) {
  const e = {};
  for (const j in t)
    j in bh || (e[j] = t[j]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: r,
    duration: s,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: o = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: a = i,
    appearActiveClass: c = o,
    appearToClass: u = l,
    leaveFromClass: f = `${n}-leave-from`,
    leaveActiveClass: h = `${n}-leave-active`,
    leaveToClass: m = `${n}-leave-to`
  } = t, y = Ag(s), b = y && y[0], x = y && y[1], {
    onBeforeEnter: C,
    onEnter: T,
    onEnterCancelled: O,
    onLeave: d,
    onLeaveCancelled: g,
    onBeforeAppear: p = C,
    onAppear: v = T,
    onAppearCancelled: w = O
  } = e, _ = (j, P, L) => {
    Yn(j, P ? u : l), Yn(j, P ? c : o), L && L();
  }, k = (j, P) => {
    j._isLeaving = !1, Yn(j, f), Yn(j, m), Yn(j, h), P && P();
  }, M = (j) => (P, L) => {
    const z = j ? v : T, S = () => _(P, j, L);
    Jn(z, [P, S]), Su(() => {
      Yn(P, j ? a : i), gn(P, j ? u : l), _u(z) || Cu(P, r, b, S);
    });
  };
  return Ve(e, {
    onBeforeEnter(j) {
      Jn(C, [j]), gn(j, i), gn(j, o);
    },
    onBeforeAppear(j) {
      Jn(p, [j]), gn(j, a), gn(j, c);
    },
    onEnter: M(!1),
    onAppear: M(!0),
    onLeave(j, P) {
      j._isLeaving = !0;
      const L = () => k(j, P);
      gn(j, f), jg(), gn(j, h), Su(() => {
        j._isLeaving && (Yn(j, f), gn(j, m), _u(d) || Cu(j, r, x, L));
      }), Jn(d, [j, L]);
    },
    onEnterCancelled(j) {
      _(j, !1), Jn(O, [j]);
    },
    onAppearCancelled(j) {
      _(j, !0), Jn(w, [j]);
    },
    onLeaveCancelled(j) {
      k(j), Jn(g, [j]);
    }
  });
}
function Ag(t) {
  if (t == null)
    return null;
  if (xe(t))
    return [tl(t.enter), tl(t.leave)];
  {
    const e = tl(t);
    return [e, e];
  }
}
function tl(t) {
  return Om(t);
}
function gn(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[ws] || (t[ws] = /* @__PURE__ */ new Set())).add(e);
}
function Yn(t, e) {
  e.split(/\s+/).forEach((r) => r && t.classList.remove(r));
  const n = t[ws];
  n && (n.delete(e), n.size || (t[ws] = void 0));
}
function Su(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Tg = 0;
function Cu(t, e, n, r) {
  const s = t._endId = ++Tg, i = () => {
    s === t._endId && r();
  };
  if (n)
    return setTimeout(i, n);
  const { type: o, timeout: l, propCount: a } = Og(t, e);
  if (!o)
    return r();
  const c = o + "end";
  let u = 0;
  const f = () => {
    t.removeEventListener(c, h), i();
  }, h = (m) => {
    m.target === t && ++u >= a && f();
  };
  setTimeout(() => {
    u < a && f();
  }, l + 1), t.addEventListener(c, h);
}
function Og(t, e) {
  const n = window.getComputedStyle(t), r = (y) => (n[y] || "").split(", "), s = r(`${mn}Delay`), i = r(`${mn}Duration`), o = Eu(s, i), l = r(`${Gr}Delay`), a = r(`${Gr}Duration`), c = Eu(l, a);
  let u = null, f = 0, h = 0;
  e === mn ? o > 0 && (u = mn, f = o, h = i.length) : e === Gr ? c > 0 && (u = Gr, f = c, h = a.length) : (f = Math.max(o, c), u = f > 0 ? o > c ? mn : Gr : null, h = u ? u === mn ? i.length : a.length : 0);
  const m = u === mn && /\b(transform|all)(,|$)/.test(
    r(`${mn}Property`).toString()
  );
  return {
    type: u,
    timeout: f,
    propCount: h,
    hasTransform: m
  };
}
function Eu(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, r) => Mu(n) + Mu(t[r])));
}
function Mu(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function jg() {
  return document.body.offsetHeight;
}
function Rg(t, e, n) {
  const r = t[ws];
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const Au = Symbol("_vod"), Pg = Symbol(""), Ig = /(^|;)\s*display\s*:/;
function Lg(t, e, n) {
  const r = t.style, s = Le(n), i = r.display;
  let o = !1;
  if (n && !s) {
    if (e && !Le(e))
      for (const l in e)
        n[l] == null && Ul(r, l, "");
    for (const l in n)
      l === "display" && (o = !0), Ul(r, l, n[l]);
  } else if (s) {
    if (e !== n) {
      const l = r[Pg];
      l && (n += ";" + l), r.cssText = n, o = Ig.test(n);
    }
  } else
    e && t.removeAttribute("style");
  Au in t && (t[Au] = o ? r.display : "", r.display = i);
}
const Tu = /\s*!important$/;
function Ul(t, e, n) {
  if (te(n))
    n.forEach((r) => Ul(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = Ng(t, e);
    Tu.test(n) ? t.setProperty(
      Fr(r),
      n.replace(Tu, ""),
      "important"
    ) : t[r] = n;
  }
}
const Ou = ["Webkit", "Moz", "ms"], nl = {};
function Ng(t, e) {
  const n = nl[e];
  if (n)
    return n;
  let r = rn(e);
  if (r !== "filter" && r in t)
    return nl[e] = r;
  r = wo(r);
  for (let s = 0; s < Ou.length; s++) {
    const i = Ou[s] + r;
    if (i in t)
      return nl[e] = i;
  }
  return e;
}
const ju = "http://www.w3.org/1999/xlink";
function zg(t, e, n, r, s) {
  if (r && e.startsWith("xlink:"))
    n == null ? t.removeAttributeNS(ju, e.slice(6, e.length)) : t.setAttributeNS(ju, e, n);
  else {
    const i = Nm(e);
    n == null || i && !xf(n) ? t.removeAttribute(e) : t.setAttribute(e, i ? "" : n);
  }
}
function $g(t, e, n, r, s, i, o) {
  if (e === "innerHTML" || e === "textContent") {
    r && o(r, s, i), t[e] = n ?? "";
    return;
  }
  const l = t.tagName;
  if (e === "value" && l !== "PROGRESS" && // custom elements may use _value internally
  !l.includes("-")) {
    t._value = n;
    const c = l === "OPTION" ? t.getAttribute("value") : t.value, u = n ?? "";
    c !== u && (t.value = u), n == null && t.removeAttribute(e);
    return;
  }
  let a = !1;
  if (n === "" || n == null) {
    const c = typeof t[e];
    c === "boolean" ? n = xf(n) : n == null && c === "string" ? (n = "", a = !0) : c === "number" && (n = 0, a = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  a && t.removeAttribute(e);
}
function vr(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function Dg(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
const Ru = Symbol("_vei");
function Bg(t, e, n, r, s = null) {
  const i = t[Ru] || (t[Ru] = {}), o = i[e];
  if (r && o)
    o.value = r;
  else {
    const [l, a] = Hg(e);
    if (r) {
      const c = i[e] = Vg(r, s);
      vr(t, l, c, a);
    } else
      o && (Dg(t, l, o, a), i[e] = void 0);
  }
}
const Pu = /(?:Once|Passive|Capture)$/;
function Hg(t) {
  let e;
  if (Pu.test(t)) {
    e = {};
    let r;
    for (; r = t.match(Pu); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Fr(t.slice(2)), e];
}
let rl = 0;
const Fg = /* @__PURE__ */ Promise.resolve(), Wg = () => rl || (Fg.then(() => rl = 0), rl = Date.now());
function Vg(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    Pt(
      Kg(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = Wg(), n;
}
function Kg(t, e) {
  if (te(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map((r) => (s) => !s._stopped && r && r(s));
  } else
    return e;
}
const Iu = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, Ug = (t, e, n, r, s, i, o, l, a) => {
  const c = s === "svg";
  e === "class" ? Rg(t, r, c) : e === "style" ? Lg(t, n, r) : yo(e) ? Pa(e) || Bg(t, e, n, r, o) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : qg(t, e, r, c)) ? $g(
    t,
    e,
    r,
    i,
    o,
    l,
    a
  ) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), zg(t, e, r, c));
};
function qg(t, e, n, r) {
  if (r)
    return !!(e === "innerHTML" || e === "textContent" || e in t && Iu(e) && oe(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const s = t.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return Iu(e) && Le(n) ? !1 : e in t;
}
const Lu = (t) => {
  const e = t.props["onUpdate:modelValue"] || !1;
  return te(e) ? (n) => ai(e, n) : e;
};
function Gg(t) {
  t.target.composing = !0;
}
function Nu(t) {
  const e = t.target;
  e.composing && (e.composing = !1, e.dispatchEvent(new Event("input")));
}
const sl = Symbol("_assign"), zu = {
  created(t, { modifiers: { lazy: e, trim: n, number: r } }, s) {
    t[sl] = Lu(s);
    const i = r || s.props && s.props.type === "number";
    vr(t, e ? "change" : "input", (o) => {
      if (o.target.composing)
        return;
      let l = t.value;
      n && (l = l.trim()), i && (l = Rl(l)), t[sl](l);
    }), n && vr(t, "change", () => {
      t.value = t.value.trim();
    }), e || (vr(t, "compositionstart", Gg), vr(t, "compositionend", Nu), vr(t, "change", Nu));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(t, { value: e }) {
    t.value = e ?? "";
  },
  beforeUpdate(t, { value: e, modifiers: { lazy: n, trim: r, number: s } }, i) {
    if (t[sl] = Lu(i), t.composing)
      return;
    const o = s || t.type === "number" ? Rl(t.value) : t.value, l = e ?? "";
    o !== l && (document.activeElement === t && t.type !== "range" && (n || r && t.value.trim() === l) || (t.value = l));
  }
}, Jg = /* @__PURE__ */ Ve({ patchProp: Ug }, Eg);
let $u;
function Yg() {
  return $u || ($u = og(Jg));
}
const Xg = (...t) => {
  const e = Yg().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const s = Zg(r);
    if (!s)
      return;
    const i = e._component;
    !oe(i) && !i.render && !i.template && (i.template = s.innerHTML), s.innerHTML = "";
    const o = n(s, !1, Qg(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, e;
};
function Qg(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function Zg(t) {
  return Le(t) ? document.querySelector(t) : t;
}
function e0(t) {
  return _f() ? (Dm(t), !0) : !1;
}
function nc(t) {
  return typeof t == "function" ? t() : Bf(t);
}
const t0 = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const n0 = Object.prototype.toString, r0 = (t) => n0.call(t) === "[object Object]", s0 = () => {
};
function i0(t, e) {
  function n(...r) {
    return new Promise((s, i) => {
      Promise.resolve(t(() => e.apply(this, r), { fn: e, thisArg: this, args: r })).then(s).catch(i);
    });
  }
  return n;
}
const vh = (t) => t();
function o0(t = vh) {
  const e = Ue(!0);
  function n() {
    e.value = !1;
  }
  function r() {
    e.value = !0;
  }
  const s = (...i) => {
    e.value && t(...i);
  };
  return { isActive: Fa(e), pause: n, resume: r, eventFilter: s };
}
function l0(t) {
  return t || tc();
}
function a0(t, e, n = {}) {
  const {
    eventFilter: r = vh,
    ...s
  } = n;
  return jr(
    t,
    i0(
      r,
      e
    ),
    s
  );
}
function c0(t, e, n = {}) {
  const {
    eventFilter: r,
    ...s
  } = n, { eventFilter: i, pause: o, resume: l, isActive: a } = o0(r);
  return { stop: a0(
    t,
    e,
    {
      ...s,
      eventFilter: i
    }
  ), pause: o, resume: l, isActive: a };
}
function u0(t, e = !0, n) {
  l0() ? Os(t, n) : e ? t() : tn(t);
}
function d0(t) {
  var e;
  const n = nc(t);
  return (e = n?.$el) != null ? e : n;
}
const ql = t0 ? window : void 0;
function Du(...t) {
  let e, n, r, s;
  if (typeof t[0] == "string" || Array.isArray(t[0]) ? ([n, r, s] = t, e = ql) : [e, n, r, s] = t, !e)
    return s0;
  Array.isArray(n) || (n = [n]), Array.isArray(r) || (r = [r]);
  const i = [], o = () => {
    i.forEach((u) => u()), i.length = 0;
  }, l = (u, f, h, m) => (u.addEventListener(f, h, m), () => u.removeEventListener(f, h, m)), a = jr(
    () => [d0(e), nc(s)],
    ([u, f]) => {
      if (o(), !u)
        return;
      const h = r0(f) ? { ...f } : f;
      i.push(
        ...n.flatMap((m) => r.map((y) => l(u, m, y, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    a(), o();
  };
  return e0(c), c;
}
const Ws = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Vs = "__vueuse_ssr_handlers__", f0 = /* @__PURE__ */ h0();
function h0() {
  return Vs in Ws || (Ws[Vs] = Ws[Vs] || {}), Ws[Vs];
}
function p0(t, e) {
  return f0[t] || e;
}
function m0(t) {
  return t == null ? "any" : t instanceof Set ? "set" : t instanceof Map ? "map" : t instanceof Date ? "date" : typeof t == "boolean" ? "boolean" : typeof t == "string" ? "string" : typeof t == "object" ? "object" : Number.isNaN(t) ? "any" : "number";
}
const g0 = {
  boolean: {
    read: (t) => t === "true",
    write: (t) => String(t)
  },
  object: {
    read: (t) => JSON.parse(t),
    write: (t) => JSON.stringify(t)
  },
  number: {
    read: (t) => Number.parseFloat(t),
    write: (t) => String(t)
  },
  any: {
    read: (t) => t,
    write: (t) => String(t)
  },
  string: {
    read: (t) => t,
    write: (t) => String(t)
  },
  map: {
    read: (t) => new Map(JSON.parse(t)),
    write: (t) => JSON.stringify(Array.from(t.entries()))
  },
  set: {
    read: (t) => new Set(JSON.parse(t)),
    write: (t) => JSON.stringify(Array.from(t))
  },
  date: {
    read: (t) => new Date(t),
    write: (t) => t.toISOString()
  }
}, Bu = "vueuse-storage";
function y0(t, e, n, r = {}) {
  var s;
  const {
    flush: i = "pre",
    deep: o = !0,
    listenToStorageChanges: l = !0,
    writeDefaults: a = !0,
    mergeDefaults: c = !1,
    shallow: u,
    window: f = ql,
    eventFilter: h,
    onError: m = (_) => {
      console.error(_);
    },
    initOnMounted: y
  } = r, b = (u ? l1 : Ue)(typeof e == "function" ? e() : e);
  if (!n)
    try {
      n = p0("getDefaultStorage", () => {
        var _;
        return (_ = ql) == null ? void 0 : _.localStorage;
      })();
    } catch (_) {
      m(_);
    }
  if (!n)
    return b;
  const x = nc(e), C = m0(x), T = (s = r.serializer) != null ? s : g0[C], { pause: O, resume: d } = c0(
    b,
    () => g(b.value),
    { flush: i, deep: o, eventFilter: h }
  );
  return f && l && u0(() => {
    Du(f, "storage", w), Du(f, Bu, v), y && w();
  }), y || w(), b;
  function g(_) {
    try {
      const k = n.getItem(t), M = (j) => {
        f && f.dispatchEvent(new CustomEvent(Bu, {
          detail: {
            key: t,
            oldValue: k,
            newValue: j,
            storageArea: n
          }
        }));
      };
      if (_ == null)
        M(null), n.removeItem(t);
      else {
        const j = T.write(_);
        k !== j && (n.setItem(t, j), M(j));
      }
    } catch (k) {
      m(k);
    }
  }
  function p(_) {
    const k = _ ? _.newValue : n.getItem(t);
    if (k == null)
      return a && x != null && n.setItem(t, T.write(x)), x;
    if (!_ && c) {
      const M = T.read(k);
      return typeof c == "function" ? c(M, x) : C === "object" && !Array.isArray(M) ? { ...x, ...M } : M;
    } else
      return typeof k != "string" ? k : T.read(k);
  }
  function v(_) {
    w(_.detail);
  }
  function w(_) {
    if (!(_ && _.storageArea !== n)) {
      if (_ && _.key == null) {
        b.value = x;
        return;
      }
      if (!(_ && _.key !== t)) {
        O();
        try {
          _?.newValue !== T.write(b.value) && (b.value = p(_));
        } catch (k) {
          m(k);
        } finally {
          _ ? tn(d) : d();
        }
      }
    }
  }
}
class Zr extends Error {
}
Zr.prototype.name = "InvalidTokenError";
function b0(t) {
  return decodeURIComponent(atob(t).replace(/(.)/g, (e, n) => {
    let r = n.charCodeAt(0).toString(16).toUpperCase();
    return r.length < 2 && (r = "0" + r), "%" + r;
  }));
}
function v0(t) {
  let e = t.replace(/-/g, "+").replace(/_/g, "/");
  switch (e.length % 4) {
    case 0:
      break;
    case 2:
      e += "==";
      break;
    case 3:
      e += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b0(e);
  } catch {
    return atob(e);
  }
}
function w0(t, e) {
  if (typeof t != "string")
    throw new Zr("Invalid token specified: must be a string");
  e || (e = {});
  const n = e.header === !0 ? 0 : 1, r = t.split(".")[n];
  if (typeof r != "string")
    throw new Zr(`Invalid token specified: missing part #${n + 1}`);
  let s;
  try {
    s = v0(r);
  } catch (i) {
    throw new Zr(`Invalid token specified: invalid base64 for part #${n + 1} (${i.message})`);
  }
  try {
    return JSON.parse(s);
  } catch (i) {
    throw new Zr(`Invalid token specified: invalid json for part #${n + 1} (${i.message})`);
  }
}
var rc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function sc(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var wh = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(rc, function() {
    var n = {
      /**
       * 
       * @param DomElement oDomElement
       * @param Object oOptions
       * @return self
       */
      attachTo: function(r, s) {
        if (r.scannerDetectionData !== void 0)
          throw new Error("onScan.js is already initialized for DOM element " + r);
        var i = {
          onScan: function(o, l) {
          },
          // Callback after detection of a successfull scanning:  function(){sScancode, iCount)}()
          onScanError: function(o) {
          },
          // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
          onKeyProcess: function(o, l) {
          },
          // Callback after receiving and processing a char (scanned char in parameter)
          onKeyDetect: function(o, l) {
          },
          // Callback after detecting a keyDown (key char in parameter) - in contrast to onKeyProcess, this fires for non-character keys like tab, arrows, etc. too!
          onPaste: function(o, l) {
          },
          // Callback after receiving a value on paste, no matter if it is a valid code or not
          keyCodeMapper: function(o) {
            return n.decodeKeyEvent(o);
          },
          // Custom function to decode a keydown event into a character. Must return decoded character or NULL if the given event should not be processed.
          onScanButtonLongPress: function() {
          },
          // Callback after detection of a successfull scan while the scan button was pressed and held down
          scanButtonKeyCode: !1,
          // Key code of the scanner hardware button (if the scanner button a acts as a key itself) 
          scanButtonLongPressTime: 500,
          // How long (ms) the hardware button should be pressed, until a callback gets executed
          timeBeforeScanTest: 100,
          // Wait duration (ms) after keypress event to check if scanning is finished
          avgTimeByChar: 30,
          // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
          minLength: 6,
          // Minimum length for a scanning
          suffixKeyCodes: [9, 13],
          // Chars to remove and means end of scanning
          prefixKeyCodes: [],
          // Chars to remove and means start of scanning
          ignoreIfFocusOn: !1,
          // do not handle scans if the currently focused element matches this selector or object
          stopPropagation: !1,
          // Stop immediate propagation on keypress event
          preventDefault: !1,
          // Prevent default action on keypress event
          captureEvents: !1,
          // Get the events before any listeners deeper in the DOM
          reactToKeydown: !0,
          // look for scan input in keyboard events
          reactToPaste: !1,
          // look for scan input in paste events
          singleScanQty: 1
          // Quantity of Items put out to onScan in a single scan
        };
        return s = this._mergeOptions(i, s), r.scannerDetectionData = {
          options: s,
          vars: {
            firstCharTime: 0,
            lastCharTime: 0,
            accumulatedString: "",
            testTimer: !1,
            longPressTimeStart: 0,
            longPressed: !1
          }
        }, s.reactToPaste === !0 && r.addEventListener("paste", this._handlePaste, s.captureEvents), s.scanButtonKeyCode !== !1 && r.addEventListener("keyup", this._handleKeyUp, s.captureEvents), (s.reactToKeydown === !0 || s.scanButtonKeyCode !== !1) && r.addEventListener("keydown", this._handleKeyDown, s.captureEvents), this;
      },
      /**
       * 
       * @param DomElement oDomElement
       * @return void
       */
      detachFrom: function(r) {
        r.scannerDetectionData.options.reactToPaste && r.removeEventListener("paste", this._handlePaste), r.scannerDetectionData.options.scanButtonKeyCode !== !1 && r.removeEventListener("keyup", this._handleKeyUp), r.removeEventListener("keydown", this._handleKeyDown), r.scannerDetectionData = void 0;
      },
      /**
       * 
       * @param DomElement oDomElement
       * @return Object
       */
      getOptions: function(r) {
        return r.scannerDetectionData.options;
      },
      /**
       * 
       * @param DomElement oDomElement
       * @param Object oOptions
       * @return self
       */
      setOptions: function(r, s) {
        switch (r.scannerDetectionData.options.reactToPaste) {
          case !0:
            s.reactToPaste === !1 && r.removeEventListener("paste", this._handlePaste);
            break;
          case !1:
            s.reactToPaste === !0 && r.addEventListener("paste", this._handlePaste);
            break;
        }
        switch (r.scannerDetectionData.options.scanButtonKeyCode) {
          case !1:
            s.scanButtonKeyCode !== !1 && r.addEventListener("keyup", this._handleKeyUp);
            break;
          default:
            s.scanButtonKeyCode === !1 && r.removeEventListener("keyup", this._handleKeyUp);
            break;
        }
        return r.scannerDetectionData.options = this._mergeOptions(r.scannerDetectionData.options, s), this._reinitialize(r), this;
      },
      /**
       * Transforms key codes into characters.
       * 
       * By default, only the follwing key codes are taken into account
       * - 48-90 (letters and regular numbers)
       * - 96-105 (numeric keypad numbers)
       * - 106-111 (numeric keypad operations)
       * 
       * All other keys will yield empty strings!
       * 
       * The above keycodes will be decoded using the KeyboardEvent.key property on modern
       * browsers. On older browsers the method will fall back to String.fromCharCode()
       * putting the result to upper/lower case depending on KeyboardEvent.shiftKey if
       * it is set.
       * 
       * @param KeyboardEvent oEvent
       * @return string
       */
      decodeKeyEvent: function(r) {
        var s = this._getNormalizedKeyNum(r);
        switch (!0) {
          case (s >= 48 && s <= 90):
          case (s >= 106 && s <= 111):
            if (r.key !== void 0 && r.key !== "")
              return r.key;
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
          case (s >= 96 && s <= 105):
            return 0 + (s - 96);
        }
        return "";
      },
      /**
       * Simulates a scan of the provided code.
          *
       * The scan code can be defined as
       * - a string - in this case no keyCode decoding is done and the code is merely validated
       * against constraints like minLenght, etc.
       * - an array of keyCodes (e.g. `[70,71,80]`) - will produce `keydown` events with corresponding
       * `keyCode` properties. NOTE: these events will have empty `key` properties, so decoding may
       * yield different results than with native events.
       * - an array of objects (e.g. `[{keyCode: 70, key: "F", shiftKey: true}, {keyCode: 71, key: "g"}]`) -
       * this way almost any event can be simulated, but it's a lot of work to do.
       *
       * @param DomElement oDomElement
       * @param string|array mStringOrArray
       * @return self
       */
      simulate: function(r, s) {
        return this._reinitialize(r), Array.isArray(s) ? s.forEach(function(i) {
          var o = {};
          (typeof i == "object" || typeof i == "function") && i !== null ? o = i : o.keyCode = parseInt(i);
          var l = new KeyboardEvent("keydown", o);
          document.dispatchEvent(l);
        }) : this._validateScanCode(r, s), this;
      },
      /**
       * @private
       * @param DomElement oDomElement
       * @return void
       */
      _reinitialize: function(r) {
        var s = r.scannerDetectionData.vars;
        s.firstCharTime = 0, s.lastCharTime = 0, s.accumulatedString = "";
      },
      /**
       * @private
       * @param DomElement oDomElement
          * @return boolean
       */
      _isFocusOnIgnoredElement: function(r) {
        var s = r.scannerDetectionData.options.ignoreIfFocusOn;
        if (!s)
          return !1;
        var i = document.activeElement;
        if (Array.isArray(s)) {
          for (var o = 0; o < s.length; o++)
            if (i.matches(s[o]) === !0)
              return !0;
        } else if (i.matches(s))
          return !0;
        return !1;
      },
      /**
       * Validates the scan code accumulated by the given DOM element and fires the respective events.
       * 
       * @private
       * @param DomElement oDomElement
       * @return boolean
       */
      _validateScanCode: function(r, s) {
        var i = r.scannerDetectionData, o = i.options, l = i.options.singleScanQty, a = i.vars.firstCharTime, c = i.vars.lastCharTime, u = {}, f;
        switch (!0) {
          case s.length < o.minLength:
            u = {
              message: "Receieved code is shorter then minimal length"
            };
            break;
          case c - a > s.length * o.avgTimeByChar:
            u = {
              message: "Receieved code was not entered in time"
            };
            break;
          default:
            return o.onScan.call(r, s, l), f = new CustomEvent(
              "scan",
              {
                detail: {
                  scanCode: s,
                  qty: l
                }
              }
            ), r.dispatchEvent(f), n._reinitialize(r), !0;
        }
        return u.scanCode = s, u.scanDuration = c - a, u.avgTimeByChar = o.avgTimeByChar, u.minLength = o.minLength, o.onScanError.call(r, u), f = new CustomEvent(
          "scanError",
          { detail: u }
        ), r.dispatchEvent(f), n._reinitialize(r), !1;
      },
      /**
       * @private
       * @param Object oDefaults
       * @param Object oOptions
       * @return Object
       */
      _mergeOptions: function(r, s) {
        var i = {}, o;
        for (o in r)
          Object.prototype.hasOwnProperty.call(r, o) && (i[o] = r[o]);
        for (o in s)
          Object.prototype.hasOwnProperty.call(s, o) && (i[o] = s[o]);
        return i;
      },
      /**
       * @private
       * @param KeyboardEvent e
       * @return int
       * @see https://www.w3schools.com/jsref/event_key_keycode.asp
       */
      _getNormalizedKeyNum: function(r) {
        return r.which || r.keyCode;
      },
      /**
       * @private
       * @param KeyboardEvent e
       * @return void
       */
      _handleKeyDown: function(r) {
        var s = n._getNormalizedKeyNum(r), i = this.scannerDetectionData.options, o = this.scannerDetectionData.vars, l = !1;
        if (i.onKeyDetect.call(this, s, r) !== !1 && !n._isFocusOnIgnoredElement(this)) {
          if (i.scanButtonKeyCode !== !1 && s == i.scanButtonKeyCode) {
            o.longPressed || (o.longPressTimer = setTimeout(i.onScanButtonLongPress, i.scanButtonLongPressTime, this), o.longPressed = !0);
            return;
          }
          switch (!0) {
            case (o.firstCharTime && i.suffixKeyCodes.indexOf(s) !== -1):
              r.preventDefault(), r.stopImmediatePropagation(), l = !0;
              break;
            case (!o.firstCharTime && i.prefixKeyCodes.indexOf(s) !== -1):
              r.preventDefault(), r.stopImmediatePropagation(), l = !1;
              break;
            default:
              var a = i.keyCodeMapper.call(this, r);
              if (a === null)
                return;
              o.accumulatedString += a, i.preventDefault && r.preventDefault(), i.stopPropagation && r.stopImmediatePropagation(), l = !1;
              break;
          }
          o.firstCharTime || (o.firstCharTime = Date.now()), o.lastCharTime = Date.now(), o.testTimer && clearTimeout(o.testTimer), l ? (n._validateScanCode(this, o.accumulatedString), o.testTimer = !1) : o.testTimer = setTimeout(n._validateScanCode, i.timeBeforeScanTest, this, o.accumulatedString), i.onKeyProcess.call(this, a, r);
        }
      },
      /**
       * @private
       * @param Event e
       * @return void
       */
      _handlePaste: function(r) {
        var s = this.scannerDetectionData.options, i = this.scannerDetectionData.vars, o = (event.clipboardData || window.clipboardData).getData("text");
        n._isFocusOnIgnoredElement(this) || (r.preventDefault(), s.stopPropagation && r.stopImmediatePropagation(), s.onPaste.call(this, o, event), i.firstCharTime = 0, i.lastCharTime = 0, n._validateScanCode(this, o));
      },
      /**
       * @private
       * @param KeyboardEvent e
       * @return void
       */
      _handleKeyUp: function(r) {
        if (!n._isFocusOnIgnoredElement(this)) {
          var s = n._getNormalizedKeyNum(r);
          s == this.scannerDetectionData.options.scanButtonKeyCode && (clearTimeout(this.scannerDetectionData.vars.longPressTimer), this.scannerDetectionData.vars.longPressed = !1);
        }
      },
      /**
       * Returns TRUE the scanner is currently in the middle of a scan sequence.
       * 
       * @param DomElement
       * @return boolean
       */
      isScanInProgressFor: function(r) {
        return r.scannerDetectionData.vars.firstCharTime > 0;
      },
      /**
       * Returns TRUE if onScan is attached to the given DOM element and FALSE otherwise.
       * 
       * @param DomElement
       * @return boolean
       */
      isAttachedTo: function(r) {
        return r.scannerDetectionData !== void 0;
      }
    };
    return n;
  });
})(wh);
var x0 = wh.exports;
const k0 = /* @__PURE__ */ sc(x0);
function Xt(t, e) {
  return fetch("/api/method/" + t, {
    method: "POST",
    headers: {
      "X-Frappe-CSRF-Token": window.csrf_token,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(e)
  }).then((n) => {
    if (!n.ok)
      throw new Error("Network response was not ok");
    return n.json();
  }).then((n) => {
    if (n.message)
      return n.message;
    throw new Error(n._server_messages || "Unknown server error");
  });
}
const rt = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, s] of e)
    n[r] = s;
  return n;
};
let _0 = Symbol("headlessui.useid"), S0 = 0;
function ic() {
  return In(_0, () => `${++S0}`)();
}
function Ie(t) {
  var e;
  if (t == null || t.value == null)
    return null;
  let n = (e = t.value.$el) != null ? e : t.value;
  return n instanceof Node ? n : null;
}
function Lo(t, e, ...n) {
  if (t in e) {
    let s = e[t];
    return typeof s == "function" ? s(...n) : s;
  }
  let r = new Error(`Tried to handle "${t}" but there is no handler defined. Only defined handlers are: ${Object.keys(e).map((s) => `"${s}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(r, Lo), r;
}
var C0 = Object.defineProperty, E0 = (t, e, n) => e in t ? C0(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Hu = (t, e, n) => (E0(t, typeof e != "symbol" ? e + "" : e, n), n);
let M0 = class {
  constructor() {
    Hu(this, "current", this.detect()), Hu(this, "currentId", 0);
  }
  set(e) {
    this.current !== e && (this.currentId = 0, this.current = e);
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
    return typeof window > "u" || typeof document > "u" ? "server" : "client";
  }
}, oc = new M0();
function lc(t) {
  if (oc.isServer)
    return null;
  if (t instanceof Node)
    return t.ownerDocument;
  if (t != null && t.hasOwnProperty("value")) {
    let e = Ie(t);
    if (e)
      return e.ownerDocument;
  }
  return document;
}
let Gl = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((t) => `${t}:not([tabindex='-1'])`).join(",");
var Jl = ((t) => (t[t.First = 1] = "First", t[t.Previous = 2] = "Previous", t[t.Next = 4] = "Next", t[t.Last = 8] = "Last", t[t.WrapAround = 16] = "WrapAround", t[t.NoScroll = 32] = "NoScroll", t))(Jl || {}), A0 = ((t) => (t[t.Error = 0] = "Error", t[t.Overflow = 1] = "Overflow", t[t.Success = 2] = "Success", t[t.Underflow = 3] = "Underflow", t))(A0 || {}), T0 = ((t) => (t[t.Previous = -1] = "Previous", t[t.Next = 1] = "Next", t))(T0 || {});
function xh(t = document.body) {
  return t == null ? [] : Array.from(t.querySelectorAll(Gl)).sort((e, n) => Math.sign((e.tabIndex || Number.MAX_SAFE_INTEGER) - (n.tabIndex || Number.MAX_SAFE_INTEGER)));
}
var ac = ((t) => (t[t.Strict = 0] = "Strict", t[t.Loose = 1] = "Loose", t))(ac || {});
function cc(t, e = 0) {
  var n;
  return t === ((n = lc(t)) == null ? void 0 : n.body) ? !1 : Lo(e, { 0() {
    return t.matches(Gl);
  }, 1() {
    let r = t;
    for (; r !== null; ) {
      if (r.matches(Gl))
        return !0;
      r = r.parentElement;
    }
    return !1;
  } });
}
function kh(t) {
  let e = lc(t);
  tn(() => {
    e && !cc(e.activeElement, 0) && j0(t);
  });
}
var O0 = ((t) => (t[t.Keyboard = 0] = "Keyboard", t[t.Mouse = 1] = "Mouse", t))(O0 || {});
typeof window < "u" && typeof document < "u" && (document.addEventListener("keydown", (t) => {
  t.metaKey || t.altKey || t.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
}, !0), document.addEventListener("click", (t) => {
  t.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : t.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
}, !0));
function j0(t) {
  t?.focus({ preventScroll: !0 });
}
let R0 = ["textarea", "input"].join(",");
function P0(t) {
  var e, n;
  return (n = (e = t?.matches) == null ? void 0 : e.call(t, R0)) != null ? n : !1;
}
function _h(t, e = (n) => n) {
  return t.slice().sort((n, r) => {
    let s = e(n), i = e(r);
    if (s === null || i === null)
      return 0;
    let o = s.compareDocumentPosition(i);
    return o & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : o & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function I0(t, e) {
  return L0(xh(), e, { relativeTo: t });
}
function L0(t, e, { sorted: n = !0, relativeTo: r = null, skipElements: s = [] } = {}) {
  var i;
  let o = (i = Array.isArray(t) ? t.length > 0 ? t[0].ownerDocument : document : t?.ownerDocument) != null ? i : document, l = Array.isArray(t) ? n ? _h(t) : t : xh(t);
  s.length > 0 && l.length > 1 && (l = l.filter((y) => !s.includes(y))), r = r ?? o.activeElement;
  let a = (() => {
    if (e & 5)
      return 1;
    if (e & 10)
      return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), c = (() => {
    if (e & 1)
      return 0;
    if (e & 2)
      return Math.max(0, l.indexOf(r)) - 1;
    if (e & 4)
      return Math.max(0, l.indexOf(r)) + 1;
    if (e & 8)
      return l.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), u = e & 32 ? { preventScroll: !0 } : {}, f = 0, h = l.length, m;
  do {
    if (f >= h || f + h <= 0)
      return 0;
    let y = c + f;
    if (e & 16)
      y = (y + h) % h;
    else {
      if (y < 0)
        return 3;
      if (y >= h)
        return 1;
    }
    m = l[y], m?.focus(u), f += a;
  } while (m !== o.activeElement);
  return e & 6 && P0(m) && m.select(), 2;
}
function N0() {
  return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
}
function z0() {
  return /Android/gi.test(window.navigator.userAgent);
}
function $0() {
  return N0() || z0();
}
function Ks(t, e, n) {
  oc.isServer || Wr((r) => {
    document.addEventListener(t, e, n), r(() => document.removeEventListener(t, e, n));
  });
}
function D0(t, e, n) {
  oc.isServer || Wr((r) => {
    window.addEventListener(t, e, n), r(() => window.removeEventListener(t, e, n));
  });
}
function B0(t, e, n = lt(() => !0)) {
  function r(i, o) {
    if (!n.value || i.defaultPrevented)
      return;
    let l = o(i);
    if (l === null || !l.getRootNode().contains(l))
      return;
    let a = function c(u) {
      return typeof u == "function" ? c(u()) : Array.isArray(u) || u instanceof Set ? u : [u];
    }(t);
    for (let c of a) {
      if (c === null)
        continue;
      let u = c instanceof HTMLElement ? c : Ie(c);
      if (u != null && u.contains(l) || i.composed && i.composedPath().includes(u))
        return;
    }
    return !cc(l, ac.Loose) && l.tabIndex !== -1 && i.preventDefault(), e(i, l);
  }
  let s = Ue(null);
  Ks("pointerdown", (i) => {
    var o, l;
    n.value && (s.value = ((l = (o = i.composedPath) == null ? void 0 : o.call(i)) == null ? void 0 : l[0]) || i.target);
  }, !0), Ks("mousedown", (i) => {
    var o, l;
    n.value && (s.value = ((l = (o = i.composedPath) == null ? void 0 : o.call(i)) == null ? void 0 : l[0]) || i.target);
  }, !0), Ks("click", (i) => {
    $0() || s.value && (r(i, () => s.value), s.value = null);
  }, !0), Ks("touchend", (i) => r(i, () => i.target instanceof HTMLElement ? i.target : null), !0), D0("blur", (i) => r(i, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), !0);
}
function Fu(t, e) {
  if (t)
    return t;
  let n = e ?? "button";
  if (typeof n == "string" && n.toLowerCase() === "button")
    return "button";
}
function H0(t, e) {
  let n = Ue(Fu(t.value.type, t.value.as));
  return Os(() => {
    n.value = Fu(t.value.type, t.value.as);
  }), Wr(() => {
    var r;
    n.value || Ie(e) && Ie(e) instanceof HTMLButtonElement && !((r = Ie(e)) != null && r.hasAttribute("type")) && (n.value = "button");
  }), n;
}
function Wu(t) {
  return [t.screenX, t.screenY];
}
function F0() {
  let t = Ue([-1, -1]);
  return { wasMoved(e) {
    let n = Wu(e);
    return t.value[0] === n[0] && t.value[1] === n[1] ? !1 : (t.value = n, !0);
  }, update(e) {
    t.value = Wu(e);
  } };
}
function W0({ container: t, accept: e, walk: n, enabled: r }) {
  Wr(() => {
    let s = t.value;
    if (!s || r !== void 0 && !r.value)
      return;
    let i = lc(t);
    if (!i)
      return;
    let o = Object.assign((a) => e(a), { acceptNode: e }), l = i.createTreeWalker(s, NodeFilter.SHOW_ELEMENT, o, !1);
    for (; l.nextNode(); )
      n(l.currentNode);
  });
}
var Yl = ((t) => (t[t.None = 0] = "None", t[t.RenderStrategy = 1] = "RenderStrategy", t[t.Static = 2] = "Static", t))(Yl || {}), V0 = ((t) => (t[t.Unmount = 0] = "Unmount", t[t.Hidden = 1] = "Hidden", t))(V0 || {});
function No({ visible: t = !0, features: e = 0, ourProps: n, theirProps: r, ...s }) {
  var i;
  let o = Ch(r, n), l = Object.assign(s, { props: o });
  if (t || e & 2 && o.static)
    return il(l);
  if (e & 1) {
    let a = (i = o.unmount) == null || i ? 0 : 1;
    return Lo(a, { 0() {
      return null;
    }, 1() {
      return il({ ...s, props: { ...o, hidden: !0, style: { display: "none" } } });
    } });
  }
  return il(l);
}
function il({ props: t, attrs: e, slots: n, slot: r, name: s }) {
  var i, o;
  let { as: l, ...a } = K0(t, ["unmount", "static"]), c = (i = n.default) == null ? void 0 : i.call(n, r), u = {};
  if (r) {
    let f = !1, h = [];
    for (let [m, y] of Object.entries(r))
      typeof y == "boolean" && (f = !0), y === !0 && h.push(m);
    f && (u["data-headlessui-state"] = h.join(" "));
  }
  if (l === "template") {
    if (c = Sh(c ?? []), Object.keys(a).length > 0 || Object.keys(e).length > 0) {
      let [f, ...h] = c ?? [];
      if (!U0(f) || h.length > 0)
        throw new Error(['Passing props on "template"!', "", `The current component <${s} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(a).concat(Object.keys(e)).map((b) => b.trim()).filter((b, x, C) => C.indexOf(b) === x).sort((b, x) => b.localeCompare(x)).map((b) => `  - ${b}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((b) => `  - ${b}`).join(`
`)].join(`
`));
      let m = Ch((o = f.props) != null ? o : {}, a, u), y = fn(f, m, !0);
      for (let b in m)
        b.startsWith("on") && (y.props || (y.props = {}), y.props[b] = m[b]);
      return y;
    }
    return Array.isArray(c) && c.length === 1 ? c[0] : c;
  }
  return Po(l, Object.assign({}, a, u), { default: () => c });
}
function Sh(t) {
  return t.flatMap((e) => e.type === Pe ? Sh(e.children) : [e]);
}
function Ch(...t) {
  if (t.length === 0)
    return {};
  if (t.length === 1)
    return t[0];
  let e = {}, n = {};
  for (let r of t)
    for (let s in r)
      s.startsWith("on") && typeof r[s] == "function" ? (n[s] != null || (n[s] = []), n[s].push(r[s])) : e[s] = r[s];
  if (e.disabled || e["aria-disabled"])
    return Object.assign(e, Object.fromEntries(Object.keys(n).map((r) => [r, void 0])));
  for (let r in n)
    Object.assign(e, { [r](s, ...i) {
      let o = n[r];
      for (let l of o) {
        if (s instanceof Event && s.defaultPrevented)
          return;
        l(s, ...i);
      }
    } });
  return e;
}
function K0(t, e = []) {
  let n = Object.assign({}, t);
  for (let r of e)
    r in n && delete n[r];
  return n;
}
function U0(t) {
  return t == null ? !1 : typeof t.type == "string" || typeof t.type == "object" || typeof t.type == "function";
}
let Eh = Symbol("Context");
var xs = ((t) => (t[t.Open = 1] = "Open", t[t.Closed = 2] = "Closed", t[t.Closing = 4] = "Closing", t[t.Opening = 8] = "Opening", t))(xs || {});
function q0() {
  return In(Eh, null);
}
function G0(t) {
  Xa(Eh, t);
}
var Ze = ((t) => (t.Space = " ", t.Enter = "Enter", t.Escape = "Escape", t.Backspace = "Backspace", t.Delete = "Delete", t.ArrowLeft = "ArrowLeft", t.ArrowUp = "ArrowUp", t.ArrowRight = "ArrowRight", t.ArrowDown = "ArrowDown", t.Home = "Home", t.End = "End", t.PageUp = "PageUp", t.PageDown = "PageDown", t.Tab = "Tab", t))(Ze || {});
function J0(t) {
  throw new Error("Unexpected object: " + t);
}
var Ct = ((t) => (t[t.First = 0] = "First", t[t.Previous = 1] = "Previous", t[t.Next = 2] = "Next", t[t.Last = 3] = "Last", t[t.Specific = 4] = "Specific", t[t.Nothing = 5] = "Nothing", t))(Ct || {});
function Y0(t, e) {
  let n = e.resolveItems();
  if (n.length <= 0)
    return null;
  let r = e.resolveActiveIndex(), s = r ?? -1;
  switch (t.focus) {
    case 0: {
      for (let i = 0; i < n.length; ++i)
        if (!e.resolveDisabled(n[i], i, n))
          return i;
      return r;
    }
    case 1: {
      s === -1 && (s = n.length);
      for (let i = s - 1; i >= 0; --i)
        if (!e.resolveDisabled(n[i], i, n))
          return i;
      return r;
    }
    case 2: {
      for (let i = s + 1; i < n.length; ++i)
        if (!e.resolveDisabled(n[i], i, n))
          return i;
      return r;
    }
    case 3: {
      for (let i = n.length - 1; i >= 0; --i)
        if (!e.resolveDisabled(n[i], i, n))
          return i;
      return r;
    }
    case 4: {
      for (let i = 0; i < n.length; ++i)
        if (e.resolveId(n[i], i, n) === t.id)
          return i;
      return r;
    }
    case 5:
      return null;
    default:
      J0(t);
  }
}
let Vu = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function Ku(t) {
  var e, n;
  let r = (e = t.innerText) != null ? e : "", s = t.cloneNode(!0);
  if (!(s instanceof HTMLElement))
    return r;
  let i = !1;
  for (let l of s.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))
    l.remove(), i = !0;
  let o = i ? (n = s.innerText) != null ? n : "" : r;
  return Vu.test(o) && (o = o.replace(Vu, "")), o;
}
function X0(t) {
  let e = t.getAttribute("aria-label");
  if (typeof e == "string")
    return e.trim();
  let n = t.getAttribute("aria-labelledby");
  if (n) {
    let r = n.split(" ").map((s) => {
      let i = document.getElementById(s);
      if (i) {
        let o = i.getAttribute("aria-label");
        return typeof o == "string" ? o.trim() : Ku(i).trim();
      }
      return null;
    }).filter(Boolean);
    if (r.length > 0)
      return r.join(", ");
  }
  return Ku(t).trim();
}
function Q0(t) {
  let e = Ue(""), n = Ue("");
  return () => {
    let r = Ie(t);
    if (!r)
      return "";
    let s = r.innerText;
    if (e.value === s)
      return n.value;
    let i = X0(r).trim().toLowerCase();
    return e.value = s, n.value = i, i;
  };
}
var Z0 = ((t) => (t[t.Open = 0] = "Open", t[t.Closed = 1] = "Closed", t))(Z0 || {}), ey = ((t) => (t[t.Pointer = 0] = "Pointer", t[t.Other = 1] = "Other", t))(ey || {});
function ty(t) {
  requestAnimationFrame(() => requestAnimationFrame(t));
}
let Mh = Symbol("MenuContext");
function zo(t) {
  let e = In(Mh, null);
  if (e === null) {
    let n = new Error(`<${t} /> is missing a parent <Menu /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n, zo), n;
  }
  return e;
}
let ny = /* @__PURE__ */ Xe({ name: "Menu", props: { as: { type: [Object, String], default: "template" } }, setup(t, { slots: e, attrs: n }) {
  let r = Ue(1), s = Ue(null), i = Ue(null), o = Ue([]), l = Ue(""), a = Ue(null), c = Ue(1);
  function u(h = (m) => m) {
    let m = a.value !== null ? o.value[a.value] : null, y = _h(h(o.value.slice()), (x) => Ie(x.dataRef.domRef)), b = m ? y.indexOf(m) : null;
    return b === -1 && (b = null), { items: y, activeItemIndex: b };
  }
  let f = { menuState: r, buttonRef: s, itemsRef: i, items: o, searchQuery: l, activeItemIndex: a, activationTrigger: c, closeMenu: () => {
    r.value = 1, a.value = null;
  }, openMenu: () => r.value = 0, goToItem(h, m, y) {
    let b = u(), x = Y0(h === Ct.Specific ? { focus: Ct.Specific, id: m } : { focus: h }, { resolveItems: () => b.items, resolveActiveIndex: () => b.activeItemIndex, resolveId: (C) => C.id, resolveDisabled: (C) => C.dataRef.disabled });
    l.value = "", a.value = x, c.value = y ?? 1, o.value = b.items;
  }, search(h) {
    let m = l.value !== "" ? 0 : 1;
    l.value += h.toLowerCase();
    let y = (a.value !== null ? o.value.slice(a.value + m).concat(o.value.slice(0, a.value + m)) : o.value).find((x) => x.dataRef.textValue.startsWith(l.value) && !x.dataRef.disabled), b = y ? o.value.indexOf(y) : -1;
    b === -1 || b === a.value || (a.value = b, c.value = 1);
  }, clearSearch() {
    l.value = "";
  }, registerItem(h, m) {
    let y = u((b) => [...b, { id: h, dataRef: m }]);
    o.value = y.items, a.value = y.activeItemIndex, c.value = 1;
  }, unregisterItem(h) {
    let m = u((y) => {
      let b = y.findIndex((x) => x.id === h);
      return b !== -1 && y.splice(b, 1), y;
    });
    o.value = m.items, a.value = m.activeItemIndex, c.value = 1;
  } };
  return B0([s, i], (h, m) => {
    var y;
    f.closeMenu(), cc(m, ac.Loose) || (h.preventDefault(), (y = Ie(s)) == null || y.focus());
  }, lt(() => r.value === 0)), Xa(Mh, f), G0(lt(() => Lo(r.value, { 0: xs.Open, 1: xs.Closed }))), () => {
    let h = { open: r.value === 0, close: f.closeMenu };
    return No({ ourProps: {}, theirProps: t, slot: h, slots: e, attrs: n, name: "Menu" });
  };
} }), ry = /* @__PURE__ */ Xe({ name: "MenuButton", props: { disabled: { type: Boolean, default: !1 }, as: { type: [Object, String], default: "button" }, id: { type: String, default: null } }, setup(t, { attrs: e, slots: n, expose: r }) {
  var s;
  let i = (s = t.id) != null ? s : `headlessui-menu-button-${ic()}`, o = zo("MenuButton");
  r({ el: o.buttonRef, $el: o.buttonRef });
  function l(f) {
    switch (f.key) {
      case Ze.Space:
      case Ze.Enter:
      case Ze.ArrowDown:
        f.preventDefault(), f.stopPropagation(), o.openMenu(), tn(() => {
          var h;
          (h = Ie(o.itemsRef)) == null || h.focus({ preventScroll: !0 }), o.goToItem(Ct.First);
        });
        break;
      case Ze.ArrowUp:
        f.preventDefault(), f.stopPropagation(), o.openMenu(), tn(() => {
          var h;
          (h = Ie(o.itemsRef)) == null || h.focus({ preventScroll: !0 }), o.goToItem(Ct.Last);
        });
        break;
    }
  }
  function a(f) {
    switch (f.key) {
      case Ze.Space:
        f.preventDefault();
        break;
    }
  }
  function c(f) {
    t.disabled || (o.menuState.value === 0 ? (o.closeMenu(), tn(() => {
      var h;
      return (h = Ie(o.buttonRef)) == null ? void 0 : h.focus({ preventScroll: !0 });
    })) : (f.preventDefault(), o.openMenu(), ty(() => {
      var h;
      return (h = Ie(o.itemsRef)) == null ? void 0 : h.focus({ preventScroll: !0 });
    })));
  }
  let u = H0(lt(() => ({ as: t.as, type: e.type })), o.buttonRef);
  return () => {
    var f;
    let h = { open: o.menuState.value === 0 }, { ...m } = t, y = { ref: o.buttonRef, id: i, type: u.value, "aria-haspopup": "menu", "aria-controls": (f = Ie(o.itemsRef)) == null ? void 0 : f.id, "aria-expanded": o.menuState.value === 0, onKeydown: l, onKeyup: a, onClick: c };
    return No({ ourProps: y, theirProps: m, slot: h, attrs: e, slots: n, name: "MenuButton" });
  };
} }), sy = /* @__PURE__ */ Xe({ name: "MenuItems", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: !1 }, unmount: { type: Boolean, default: !0 }, id: { type: String, default: null } }, setup(t, { attrs: e, slots: n, expose: r }) {
  var s;
  let i = (s = t.id) != null ? s : `headlessui-menu-items-${ic()}`, o = zo("MenuItems"), l = Ue(null);
  r({ el: o.itemsRef, $el: o.itemsRef }), W0({ container: lt(() => Ie(o.itemsRef)), enabled: lt(() => o.menuState.value === 0), accept(h) {
    return h.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : h.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(h) {
    h.setAttribute("role", "none");
  } });
  function a(h) {
    var m;
    switch (l.value && clearTimeout(l.value), h.key) {
      case Ze.Space:
        if (o.searchQuery.value !== "")
          return h.preventDefault(), h.stopPropagation(), o.search(h.key);
      case Ze.Enter:
        if (h.preventDefault(), h.stopPropagation(), o.activeItemIndex.value !== null) {
          let y = o.items.value[o.activeItemIndex.value];
          (m = Ie(y.dataRef.domRef)) == null || m.click();
        }
        o.closeMenu(), kh(Ie(o.buttonRef));
        break;
      case Ze.ArrowDown:
        return h.preventDefault(), h.stopPropagation(), o.goToItem(Ct.Next);
      case Ze.ArrowUp:
        return h.preventDefault(), h.stopPropagation(), o.goToItem(Ct.Previous);
      case Ze.Home:
      case Ze.PageUp:
        return h.preventDefault(), h.stopPropagation(), o.goToItem(Ct.First);
      case Ze.End:
      case Ze.PageDown:
        return h.preventDefault(), h.stopPropagation(), o.goToItem(Ct.Last);
      case Ze.Escape:
        h.preventDefault(), h.stopPropagation(), o.closeMenu(), tn(() => {
          var y;
          return (y = Ie(o.buttonRef)) == null ? void 0 : y.focus({ preventScroll: !0 });
        });
        break;
      case Ze.Tab:
        h.preventDefault(), h.stopPropagation(), o.closeMenu(), tn(() => I0(Ie(o.buttonRef), h.shiftKey ? Jl.Previous : Jl.Next));
        break;
      default:
        h.key.length === 1 && (o.search(h.key), l.value = setTimeout(() => o.clearSearch(), 350));
        break;
    }
  }
  function c(h) {
    switch (h.key) {
      case Ze.Space:
        h.preventDefault();
        break;
    }
  }
  let u = q0(), f = lt(() => u !== null ? (u.value & xs.Open) === xs.Open : o.menuState.value === 0);
  return () => {
    var h, m;
    let y = { open: o.menuState.value === 0 }, { ...b } = t, x = { "aria-activedescendant": o.activeItemIndex.value === null || (h = o.items.value[o.activeItemIndex.value]) == null ? void 0 : h.id, "aria-labelledby": (m = Ie(o.buttonRef)) == null ? void 0 : m.id, id: i, onKeydown: a, onKeyup: c, role: "menu", tabIndex: 0, ref: o.itemsRef };
    return No({ ourProps: x, theirProps: b, slot: y, attrs: e, slots: n, features: Yl.RenderStrategy | Yl.Static, visible: f.value, name: "MenuItems" });
  };
} }), iy = /* @__PURE__ */ Xe({ name: "MenuItem", inheritAttrs: !1, props: { as: { type: [Object, String], default: "template" }, disabled: { type: Boolean, default: !1 }, id: { type: String, default: null } }, setup(t, { slots: e, attrs: n, expose: r }) {
  var s;
  let i = (s = t.id) != null ? s : `headlessui-menu-item-${ic()}`, o = zo("MenuItem"), l = Ue(null);
  r({ el: l, $el: l });
  let a = lt(() => o.activeItemIndex.value !== null ? o.items.value[o.activeItemIndex.value].id === i : !1), c = Q0(l), u = lt(() => ({ disabled: t.disabled, get textValue() {
    return c();
  }, domRef: l }));
  Os(() => o.registerItem(i, u)), Mo(() => o.unregisterItem(i)), Wr(() => {
    o.menuState.value === 0 && a.value && o.activationTrigger.value !== 0 && tn(() => {
      var C, T;
      return (T = (C = Ie(l)) == null ? void 0 : C.scrollIntoView) == null ? void 0 : T.call(C, { block: "nearest" });
    });
  });
  function f(C) {
    if (t.disabled)
      return C.preventDefault();
    o.closeMenu(), kh(Ie(o.buttonRef));
  }
  function h() {
    if (t.disabled)
      return o.goToItem(Ct.Nothing);
    o.goToItem(Ct.Specific, i);
  }
  let m = F0();
  function y(C) {
    m.update(C);
  }
  function b(C) {
    m.wasMoved(C) && (t.disabled || a.value || o.goToItem(Ct.Specific, i, 0));
  }
  function x(C) {
    m.wasMoved(C) && (t.disabled || a.value && o.goToItem(Ct.Nothing));
  }
  return () => {
    let { disabled: C } = t, T = { active: a.value, disabled: C, close: o.closeMenu }, { ...O } = t;
    return No({ ourProps: { id: i, ref: l, role: "menuitem", tabIndex: C === !0 ? void 0 : -1, "aria-disabled": C === !0 ? !0 : void 0, disabled: void 0, onClick: f, onFocus: h, onPointerenter: y, onMouseenter: y, onPointermove: b, onMousemove: b, onPointerleave: x, onMouseleave: x }, theirProps: { ...n, ...O }, slot: T, attrs: n, slots: e, name: "MenuItem" });
  };
} });
var Ah = { exports: {} };
(function(t, e) {
  (function(r, s) {
    t.exports = s();
  })(typeof self < "u" ? self : rc, function() {
    return (
      /******/
      function(n) {
        var r = {};
        function s(i) {
          if (r[i])
            return r[i].exports;
          var o = r[i] = {
            /******/
            i,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return n[i].call(o.exports, o, o.exports, s), o.l = !0, o.exports;
        }
        return s.m = n, s.c = r, s.d = function(i, o, l) {
          s.o(i, o) || Object.defineProperty(i, o, {
            /******/
            configurable: !1,
            /******/
            enumerable: !0,
            /******/
            get: l
            /******/
          });
        }, s.r = function(i) {
          Object.defineProperty(i, "__esModule", { value: !0 });
        }, s.n = function(i) {
          var o = i && i.__esModule ? (
            /******/
            function() {
              return i.default;
            }
          ) : (
            /******/
            function() {
              return i;
            }
          );
          return s.d(o, "a", o), o;
        }, s.o = function(i, o) {
          return Object.prototype.hasOwnProperty.call(i, o);
        }, s.p = "", s(s.s = 0);
      }({
        /***/
        "./dist/icons.json": (
          /*!*************************!*\
            !*** ./dist/icons.json ***!
            \*************************/
          /*! exports provided: activity, airplay, alert-circle, alert-octagon, alert-triangle, align-center, align-justify, align-left, align-right, anchor, aperture, archive, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, award, bar-chart-2, bar-chart, battery-charging, battery, bell-off, bell, bluetooth, bold, book-open, book, bookmark, box, briefcase, calendar, camera-off, camera, cast, check-circle, check-square, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, chrome, circle, clipboard, clock, cloud-drizzle, cloud-lightning, cloud-off, cloud-rain, cloud-snow, cloud, code, codepen, codesandbox, coffee, columns, command, compass, copy, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, cpu, credit-card, crop, crosshair, database, delete, disc, divide-circle, divide-square, divide, dollar-sign, download-cloud, download, dribbble, droplet, edit-2, edit-3, edit, external-link, eye-off, eye, facebook, fast-forward, feather, figma, file-minus, file-plus, file-text, file, film, filter, flag, folder-minus, folder-plus, folder, framer, frown, gift, git-branch, git-commit, git-merge, git-pull-request, github, gitlab, globe, grid, hard-drive, hash, headphones, heart, help-circle, hexagon, home, image, inbox, info, instagram, italic, key, layers, layout, life-buoy, link-2, link, linkedin, list, loader, lock, log-in, log-out, mail, map-pin, map, maximize-2, maximize, meh, menu, message-circle, message-square, mic-off, mic, minimize-2, minimize, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, mouse-pointer, move, music, navigation-2, navigation, octagon, package, paperclip, pause-circle, pause, pen-tool, percent, phone-call, phone-forwarded, phone-incoming, phone-missed, phone-off, phone-outgoing, phone, pie-chart, play-circle, play, plus-circle, plus-square, plus, pocket, power, printer, radio, refresh-ccw, refresh-cw, repeat, rewind, rotate-ccw, rotate-cw, rss, save, scissors, search, send, server, settings, share-2, share, shield-off, shield, shopping-bag, shopping-cart, shuffle, sidebar, skip-back, skip-forward, slack, slash, sliders, smartphone, smile, speaker, square, star, stop-circle, sun, sunrise, sunset, table, tablet, tag, target, terminal, thermometer, thumbs-down, thumbs-up, toggle-left, toggle-right, tool, trash-2, trash, trello, trending-down, trending-up, triangle, truck, tv, twitch, twitter, type, umbrella, underline, unlock, upload-cloud, upload, user-check, user-minus, user-plus, user-x, user, users, video-off, video, voicemail, volume-1, volume-2, volume-x, volume, watch, wifi-off, wifi, wind, x-circle, x-octagon, x-square, x, youtube, zap-off, zap, zoom-in, zoom-out, default */
          /***/
          function(n) {
            n.exports = { activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>', airplay: '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>', "alert-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>', "alert-octagon": '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>', "alert-triangle": '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', "align-center": '<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>', "align-justify": '<line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>', "align-left": '<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>', "align-right": '<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>', anchor: '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>', aperture: '<circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>', archive: '<polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>', "arrow-down-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line>', "arrow-down-left": '<line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline>', "arrow-down-right": '<line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline>', "arrow-down": '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>', "arrow-left-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>', "arrow-left": '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>', "arrow-right-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>', "arrow-right": '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>', "arrow-up-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line>', "arrow-up-left": '<line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>', "arrow-up-right": '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>', "arrow-up": '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>', "at-sign": '<circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>', award: '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>', "bar-chart-2": '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', "bar-chart": '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>', "battery-charging": '<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>', battery: '<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>', "bell-off": '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line>', bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>', bluetooth: '<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>', bold: '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>', "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>', book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>', bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>', box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>', briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>', "camera-off": '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>', camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>', cast: '<path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line>', "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', "check-square": '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>', check: '<polyline points="20 6 9 17 4 12"></polyline>', "chevron-down": '<polyline points="6 9 12 15 18 9"></polyline>', "chevron-left": '<polyline points="15 18 9 12 15 6"></polyline>', "chevron-right": '<polyline points="9 18 15 12 9 6"></polyline>', "chevron-up": '<polyline points="18 15 12 9 6 15"></polyline>', "chevrons-down": '<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>', "chevrons-left": '<polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>', "chevrons-right": '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>', "chevrons-up": '<polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline>', chrome: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>', circle: '<circle cx="12" cy="12" r="10"></circle>', clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>', clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>', "cloud-drizzle": '<line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>', "cloud-lightning": '<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>', "cloud-off": '<path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>', "cloud-rain": '<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>', "cloud-snow": '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line>', cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>', code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>', codepen: '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line>', codesandbox: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>', coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>', columns: '<path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>', command: '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>', compass: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>', copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>', "corner-down-left": '<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>', "corner-down-right": '<polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>', "corner-left-down": '<polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path>', "corner-left-up": '<polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>', "corner-right-down": '<polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path>', "corner-right-up": '<polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path>', "corner-up-left": '<polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>', "corner-up-right": '<polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>', cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>', "credit-card": '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>', crop: '<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>', crosshair: '<circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line>', database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>', delete: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>', disc: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>', "divide-circle": '<line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle>', "divide-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line>', divide: '<circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle>', "dollar-sign": '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>', "download-cloud": '<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>', download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>', dribbble: '<circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>', droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>', "edit-2": '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>', "edit-3": '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>', edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>', "external-link": '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>', "eye-off": '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>', eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>', facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>', "fast-forward": '<polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon>', feather: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line>', figma: '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>', "file-minus": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>', "file-plus": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>', "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>', file: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>', film: '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>', filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>', flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>', "folder-minus": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>', "folder-plus": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>', folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>', framer: '<path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path>', frown: '<circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>', gift: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>', "git-branch": '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>', "git-commit": '<circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>', "git-merge": '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>', "git-pull-request": '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line>', github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>', gitlab: '<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>', globe: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>', grid: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>', "hard-drive": '<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line>', hash: '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>', headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>', heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', "help-circle": '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>', hexagon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>', home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>', inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>', info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>', instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>', italic: '<line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line>', key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>', layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>', layout: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>', "life-buoy": '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>', "link-2": '<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line>', link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>', linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>', list: '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>', loader: '<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>', lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>', "log-in": '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>', "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>', mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>', "map-pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>', map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>', "maximize-2": '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>', maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>', meh: '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>', menu: '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>', "message-circle": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>', "message-square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', "mic-off": '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>', mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>', "minimize-2": '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>', minimize: '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>', "minus-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>', "minus-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line>', minus: '<line x1="5" y1="12" x2="19" y2="12"></line>', monitor: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>', moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>', "more-horizontal": '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>', "more-vertical": '<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>', "mouse-pointer": '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path>', move: '<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>', music: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>', "navigation-2": '<polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>', navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>', octagon: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>', package: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>', paperclip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>', "pause-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line>', pause: '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>', "pen-tool": '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>', percent: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>', "phone-call": '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-forwarded": '<polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-incoming": '<polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-missed": '<line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-off": '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line>', "phone-outgoing": '<polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "pie-chart": '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>', "play-circle": '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>', play: '<polygon points="5 3 19 12 5 21 5 3"></polygon>', "plus-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', "plus-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>', pocket: '<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>', power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>', printer: '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>', radio: '<circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>', "refresh-ccw": '<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>', "refresh-cw": '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>', repeat: '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>', rewind: '<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>', "rotate-ccw": '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>', "rotate-cw": '<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>', rss: '<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>', save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>', scissors: '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line>', search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>', send: '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>', server: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>', settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>', "share-2": '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>', share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>', "shield-off": '<path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line>', shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', "shopping-bag": '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>', "shopping-cart": '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>', shuffle: '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>', sidebar: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>', "skip-back": '<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line>', "skip-forward": '<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>', slack: '<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>', slash: '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>', sliders: '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>', smartphone: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>', smile: '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>', speaker: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line>', square: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>', star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', "stop-circle": '<circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>', sun: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>', sunrise: '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline>', sunset: '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline>', table: '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>', tablet: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>', tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>', target: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>', terminal: '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>', thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>', "thumbs-down": '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>', "thumbs-up": '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>', "toggle-left": '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle>', "toggle-right": '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle>', tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>', "trash-2": '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>', trash: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>', trello: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect>', "trending-down": '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>', "trending-up": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>', triangle: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>', truck: '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>', tv: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>', twitch: '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7"></path>', twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>', type: '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>', umbrella: '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>', underline: '<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>', unlock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>', "upload-cloud": '<polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline>', upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>', "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>', "user-minus": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line>', "user-plus": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>', "user-x": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>', user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>', users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', "video-off": '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>', video: '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>', voicemail: '<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line>', "volume-1": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>', "volume-2": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>', "volume-x": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>', volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>', watch: '<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>', "wifi-off": '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>', wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>', wind: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>', "x-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>', "x-octagon": '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>', "x-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>', x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>', youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>', "zap-off": '<polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line>', zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>', "zoom-in": '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>', "zoom-out": '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>' };
          }
        ),
        /***/
        "./node_modules/classnames/dedupe.js": (
          /*!*******************************************!*\
            !*** ./node_modules/classnames/dedupe.js ***!
            \*******************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i, o;
            /*!
              Copyright (c) 2016 Jed Watson.
              Licensed under the MIT License (MIT), see
              http://jedwatson.github.io/classnames
            */
            (function() {
              var l = function() {
                function a() {
                }
                a.prototype = /* @__PURE__ */ Object.create(null);
                function c(C, T) {
                  for (var O = T.length, d = 0; d < O; ++d)
                    b(C, T[d]);
                }
                var u = {}.hasOwnProperty;
                function f(C, T) {
                  C[T] = !0;
                }
                function h(C, T) {
                  for (var O in T)
                    u.call(T, O) && (C[O] = !!T[O]);
                }
                var m = /\s+/;
                function y(C, T) {
                  for (var O = T.split(m), d = O.length, g = 0; g < d; ++g)
                    C[O[g]] = !0;
                }
                function b(C, T) {
                  if (T) {
                    var O = typeof T;
                    O === "string" ? y(C, T) : Array.isArray(T) ? c(C, T) : O === "object" ? h(C, T) : O === "number" && f(C, T);
                  }
                }
                function x() {
                  for (var C = arguments.length, T = Array(C), O = 0; O < C; O++)
                    T[O] = arguments[O];
                  var d = new a();
                  c(d, T);
                  var g = [];
                  for (var p in d)
                    d[p] && g.push(p);
                  return g.join(" ");
                }
                return x;
              }();
              typeof n < "u" && n.exports ? n.exports = l : (i = [], o = function() {
                return l;
              }.apply(r, i), o !== void 0 && (n.exports = o));
            })();
          }
        ),
        /***/
        "./node_modules/core-js/es/array/from.js": (
          /*!***********************************************!*\
            !*** ./node_modules/core-js/es/array/from.js ***!
            \***********************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            s(
              /*! ../../modules/es.string.iterator */
              "./node_modules/core-js/modules/es.string.iterator.js"
            ), s(
              /*! ../../modules/es.array.from */
              "./node_modules/core-js/modules/es.array.from.js"
            );
            var i = s(
              /*! ../../internals/path */
              "./node_modules/core-js/internals/path.js"
            );
            n.exports = i.Array.from;
          }
        ),
        /***/
        "./node_modules/core-js/internals/a-function.js": (
          /*!******************************************************!*\
            !*** ./node_modules/core-js/internals/a-function.js ***!
            \******************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = function(s) {
              if (typeof s != "function")
                throw TypeError(String(s) + " is not a function");
              return s;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/an-object.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/an-object.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            );
            n.exports = function(o) {
              if (!i(o))
                throw TypeError(String(o) + " is not an object");
              return o;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/array-from.js": (
          /*!******************************************************!*\
            !*** ./node_modules/core-js/internals/array-from.js ***!
            \******************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/bind-context */
              "./node_modules/core-js/internals/bind-context.js"
            ), o = s(
              /*! ../internals/to-object */
              "./node_modules/core-js/internals/to-object.js"
            ), l = s(
              /*! ../internals/call-with-safe-iteration-closing */
              "./node_modules/core-js/internals/call-with-safe-iteration-closing.js"
            ), a = s(
              /*! ../internals/is-array-iterator-method */
              "./node_modules/core-js/internals/is-array-iterator-method.js"
            ), c = s(
              /*! ../internals/to-length */
              "./node_modules/core-js/internals/to-length.js"
            ), u = s(
              /*! ../internals/create-property */
              "./node_modules/core-js/internals/create-property.js"
            ), f = s(
              /*! ../internals/get-iterator-method */
              "./node_modules/core-js/internals/get-iterator-method.js"
            );
            n.exports = function(m) {
              var y = o(m), b = typeof this == "function" ? this : Array, x = arguments.length, C = x > 1 ? arguments[1] : void 0, T = C !== void 0, O = 0, d = f(y), g, p, v, w;
              if (T && (C = i(C, x > 2 ? arguments[2] : void 0, 2)), d != null && !(b == Array && a(d)))
                for (w = d.call(y), p = new b(); !(v = w.next()).done; O++)
                  u(
                    p,
                    O,
                    T ? l(w, C, [v.value, O], !0) : v.value
                  );
              else
                for (g = c(y.length), p = new b(g); g > O; O++)
                  u(p, O, T ? C(y[O], O) : y[O]);
              return p.length = O, p;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/array-includes.js": (
          /*!**********************************************************!*\
            !*** ./node_modules/core-js/internals/array-includes.js ***!
            \**********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), o = s(
              /*! ../internals/to-length */
              "./node_modules/core-js/internals/to-length.js"
            ), l = s(
              /*! ../internals/to-absolute-index */
              "./node_modules/core-js/internals/to-absolute-index.js"
            );
            n.exports = function(a) {
              return function(c, u, f) {
                var h = i(c), m = o(h.length), y = l(f, m), b;
                if (a && u != u) {
                  for (; m > y; )
                    if (b = h[y++], b != b)
                      return !0;
                } else
                  for (; m > y; y++)
                    if ((a || y in h) && h[y] === u)
                      return a || y || 0;
                return !a && -1;
              };
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/bind-context.js": (
          /*!********************************************************!*\
            !*** ./node_modules/core-js/internals/bind-context.js ***!
            \********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/a-function */
              "./node_modules/core-js/internals/a-function.js"
            );
            n.exports = function(o, l, a) {
              if (i(o), l === void 0)
                return o;
              switch (a) {
                case 0:
                  return function() {
                    return o.call(l);
                  };
                case 1:
                  return function(c) {
                    return o.call(l, c);
                  };
                case 2:
                  return function(c, u) {
                    return o.call(l, c, u);
                  };
                case 3:
                  return function(c, u, f) {
                    return o.call(l, c, u, f);
                  };
              }
              return function() {
                return o.apply(l, arguments);
              };
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/call-with-safe-iteration-closing.js": (
          /*!****************************************************************************!*\
            !*** ./node_modules/core-js/internals/call-with-safe-iteration-closing.js ***!
            \****************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            );
            n.exports = function(o, l, a, c) {
              try {
                return c ? l(i(a)[0], a[1]) : l(a);
              } catch (f) {
                var u = o.return;
                throw u !== void 0 && i(u.call(o)), f;
              }
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/check-correctness-of-iteration.js": (
          /*!**************************************************************************!*\
            !*** ./node_modules/core-js/internals/check-correctness-of-iteration.js ***!
            \**************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), o = i("iterator"), l = !1;
            try {
              var a = 0, c = {
                next: function() {
                  return { done: !!a++ };
                },
                return: function() {
                  l = !0;
                }
              };
              c[o] = function() {
                return this;
              }, Array.from(c, function() {
                throw 2;
              });
            } catch {
            }
            n.exports = function(u, f) {
              if (!f && !l)
                return !1;
              var h = !1;
              try {
                var m = {};
                m[o] = function() {
                  return {
                    next: function() {
                      return { done: h = !0 };
                    }
                  };
                }, u(m);
              } catch {
              }
              return h;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/classof-raw.js": (
          /*!*******************************************************!*\
            !*** ./node_modules/core-js/internals/classof-raw.js ***!
            \*******************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            var s = {}.toString;
            n.exports = function(i) {
              return s.call(i).slice(8, -1);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/classof.js": (
          /*!***************************************************!*\
            !*** ./node_modules/core-js/internals/classof.js ***!
            \***************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/classof-raw */
              "./node_modules/core-js/internals/classof-raw.js"
            ), o = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), l = o("toStringTag"), a = i(/* @__PURE__ */ function() {
              return arguments;
            }()) == "Arguments", c = function(u, f) {
              try {
                return u[f];
              } catch {
              }
            };
            n.exports = function(u) {
              var f, h, m;
              return u === void 0 ? "Undefined" : u === null ? "Null" : typeof (h = c(f = Object(u), l)) == "string" ? h : a ? i(f) : (m = i(f)) == "Object" && typeof f.callee == "function" ? "Arguments" : m;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/copy-constructor-properties.js": (
          /*!***********************************************************************!*\
            !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
            \***********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), o = s(
              /*! ../internals/own-keys */
              "./node_modules/core-js/internals/own-keys.js"
            ), l = s(
              /*! ../internals/object-get-own-property-descriptor */
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
            ), a = s(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            );
            n.exports = function(c, u) {
              for (var f = o(u), h = a.f, m = l.f, y = 0; y < f.length; y++) {
                var b = f[y];
                i(c, b) || h(c, b, m(u, b));
              }
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/correct-prototype-getter.js": (
          /*!********************************************************************!*\
            !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
            \********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            );
            n.exports = !i(function() {
              function o() {
              }
              return o.prototype.constructor = null, Object.getPrototypeOf(new o()) !== o.prototype;
            });
          }
        ),
        /***/
        "./node_modules/core-js/internals/create-iterator-constructor.js": (
          /*!***********************************************************************!*\
            !*** ./node_modules/core-js/internals/create-iterator-constructor.js ***!
            \***********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/iterators-core */
              "./node_modules/core-js/internals/iterators-core.js"
            ).IteratorPrototype, o = s(
              /*! ../internals/object-create */
              "./node_modules/core-js/internals/object-create.js"
            ), l = s(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            ), a = s(
              /*! ../internals/set-to-string-tag */
              "./node_modules/core-js/internals/set-to-string-tag.js"
            ), c = s(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), u = function() {
              return this;
            };
            n.exports = function(f, h, m) {
              var y = h + " Iterator";
              return f.prototype = o(i, { next: l(1, m) }), a(f, y, !1, !0), c[y] = u, f;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/create-property-descriptor.js": (
          /*!**********************************************************************!*\
            !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
            \**********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = function(s, i) {
              return {
                enumerable: !(s & 1),
                configurable: !(s & 2),
                writable: !(s & 4),
                value: i
              };
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/create-property.js": (
          /*!***********************************************************!*\
            !*** ./node_modules/core-js/internals/create-property.js ***!
            \***********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), o = s(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), l = s(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            );
            n.exports = function(a, c, u) {
              var f = i(c);
              f in a ? o.f(a, f, l(0, u)) : a[f] = u;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/define-iterator.js": (
          /*!***********************************************************!*\
            !*** ./node_modules/core-js/internals/define-iterator.js ***!
            \***********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/export */
              "./node_modules/core-js/internals/export.js"
            ), o = s(
              /*! ../internals/create-iterator-constructor */
              "./node_modules/core-js/internals/create-iterator-constructor.js"
            ), l = s(
              /*! ../internals/object-get-prototype-of */
              "./node_modules/core-js/internals/object-get-prototype-of.js"
            ), a = s(
              /*! ../internals/object-set-prototype-of */
              "./node_modules/core-js/internals/object-set-prototype-of.js"
            ), c = s(
              /*! ../internals/set-to-string-tag */
              "./node_modules/core-js/internals/set-to-string-tag.js"
            ), u = s(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), f = s(
              /*! ../internals/redefine */
              "./node_modules/core-js/internals/redefine.js"
            ), h = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), m = s(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), y = s(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), b = s(
              /*! ../internals/iterators-core */
              "./node_modules/core-js/internals/iterators-core.js"
            ), x = b.IteratorPrototype, C = b.BUGGY_SAFARI_ITERATORS, T = h("iterator"), O = "keys", d = "values", g = "entries", p = function() {
              return this;
            };
            n.exports = function(v, w, _, k, M, j, P) {
              o(_, w, k);
              var L = function(Ae) {
                if (Ae === M && q)
                  return q;
                if (!C && Ae in R)
                  return R[Ae];
                switch (Ae) {
                  case O:
                    return function() {
                      return new _(this, Ae);
                    };
                  case d:
                    return function() {
                      return new _(this, Ae);
                    };
                  case g:
                    return function() {
                      return new _(this, Ae);
                    };
                }
                return function() {
                  return new _(this);
                };
              }, z = w + " Iterator", S = !1, R = v.prototype, N = R[T] || R["@@iterator"] || M && R[M], q = !C && N || L(M), re = w == "Array" && R.entries || N, J, ce, Me;
              if (re && (J = l(re.call(new v())), x !== Object.prototype && J.next && (!m && l(J) !== x && (a ? a(J, x) : typeof J[T] != "function" && u(J, T, p)), c(J, z, !0, !0), m && (y[z] = p))), M == d && N && N.name !== d && (S = !0, q = function() {
                return N.call(this);
              }), (!m || P) && R[T] !== q && u(R, T, q), y[w] = q, M)
                if (ce = {
                  values: L(d),
                  keys: j ? q : L(O),
                  entries: L(g)
                }, P)
                  for (Me in ce)
                    (C || S || !(Me in R)) && f(R, Me, ce[Me]);
                else
                  i({ target: w, proto: !0, forced: C || S }, ce);
              return ce;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/descriptors.js": (
          /*!*******************************************************!*\
            !*** ./node_modules/core-js/internals/descriptors.js ***!
            \*******************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            );
            n.exports = !i(function() {
              return Object.defineProperty({}, "a", { get: function() {
                return 7;
              } }).a != 7;
            });
          }
        ),
        /***/
        "./node_modules/core-js/internals/document-create-element.js": (
          /*!*******************************************************************!*\
            !*** ./node_modules/core-js/internals/document-create-element.js ***!
            \*******************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), l = i.document, a = o(l) && o(l.createElement);
            n.exports = function(c) {
              return a ? l.createElement(c) : {};
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/enum-bug-keys.js": (
          /*!*********************************************************!*\
            !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
            \*********************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = [
              "constructor",
              "hasOwnProperty",
              "isPrototypeOf",
              "propertyIsEnumerable",
              "toLocaleString",
              "toString",
              "valueOf"
            ];
          }
        ),
        /***/
        "./node_modules/core-js/internals/export.js": (
          /*!**************************************************!*\
            !*** ./node_modules/core-js/internals/export.js ***!
            \**************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/object-get-own-property-descriptor */
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
            ).f, l = s(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), a = s(
              /*! ../internals/redefine */
              "./node_modules/core-js/internals/redefine.js"
            ), c = s(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), u = s(
              /*! ../internals/copy-constructor-properties */
              "./node_modules/core-js/internals/copy-constructor-properties.js"
            ), f = s(
              /*! ../internals/is-forced */
              "./node_modules/core-js/internals/is-forced.js"
            );
            n.exports = function(h, m) {
              var y = h.target, b = h.global, x = h.stat, C, T, O, d, g, p;
              if (b ? T = i : x ? T = i[y] || c(y, {}) : T = (i[y] || {}).prototype, T)
                for (O in m) {
                  if (g = m[O], h.noTargetGet ? (p = o(T, O), d = p && p.value) : d = T[O], C = f(b ? O : y + (x ? "." : "#") + O, h.forced), !C && d !== void 0) {
                    if (typeof g == typeof d)
                      continue;
                    u(g, d);
                  }
                  (h.sham || d && d.sham) && l(g, "sham", !0), a(T, O, g, h);
                }
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/fails.js": (
          /*!*************************************************!*\
            !*** ./node_modules/core-js/internals/fails.js ***!
            \*************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = function(s) {
              try {
                return !!s();
              } catch {
                return !0;
              }
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/function-to-string.js": (
          /*!**************************************************************!*\
            !*** ./node_modules/core-js/internals/function-to-string.js ***!
            \**************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            );
            n.exports = i("native-function-to-string", Function.toString);
          }
        ),
        /***/
        "./node_modules/core-js/internals/get-iterator-method.js": (
          /*!***************************************************************!*\
            !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
            \***************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/classof */
              "./node_modules/core-js/internals/classof.js"
            ), o = s(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), l = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), a = l("iterator");
            n.exports = function(c) {
              if (c != null)
                return c[a] || c["@@iterator"] || o[i(c)];
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/global.js": (
          /*!**************************************************!*\
            !*** ./node_modules/core-js/internals/global.js ***!
            \**************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            (function(i) {
              var o = "object", l = function(a) {
                return a && a.Math == Math && a;
              };
              n.exports = // eslint-disable-next-line no-undef
              l(typeof globalThis == o && globalThis) || l(typeof window == o && window) || l(typeof self == o && self) || l(typeof i == o && i) || // eslint-disable-next-line no-new-func
              Function("return this")();
            }).call(this, s(
              /*! ./../../webpack/buildin/global.js */
              "./node_modules/webpack/buildin/global.js"
            ));
          }
        ),
        /***/
        "./node_modules/core-js/internals/has.js": (
          /*!***********************************************!*\
            !*** ./node_modules/core-js/internals/has.js ***!
            \***********************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            var s = {}.hasOwnProperty;
            n.exports = function(i, o) {
              return s.call(i, o);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/hidden-keys.js": (
          /*!*******************************************************!*\
            !*** ./node_modules/core-js/internals/hidden-keys.js ***!
            \*******************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = {};
          }
        ),
        /***/
        "./node_modules/core-js/internals/hide.js": (
          /*!************************************************!*\
            !*** ./node_modules/core-js/internals/hide.js ***!
            \************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = s(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), l = s(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            );
            n.exports = i ? function(a, c, u) {
              return o.f(a, c, l(1, u));
            } : function(a, c, u) {
              return a[c] = u, a;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/html.js": (
          /*!************************************************!*\
            !*** ./node_modules/core-js/internals/html.js ***!
            \************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i.document;
            n.exports = o && o.documentElement;
          }
        ),
        /***/
        "./node_modules/core-js/internals/ie8-dom-define.js": (
          /*!**********************************************************!*\
            !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
            \**********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = s(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), l = s(
              /*! ../internals/document-create-element */
              "./node_modules/core-js/internals/document-create-element.js"
            );
            n.exports = !i && !o(function() {
              return Object.defineProperty(l("div"), "a", {
                get: function() {
                  return 7;
                }
              }).a != 7;
            });
          }
        ),
        /***/
        "./node_modules/core-js/internals/indexed-object.js": (
          /*!**********************************************************!*\
            !*** ./node_modules/core-js/internals/indexed-object.js ***!
            \**********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), o = s(
              /*! ../internals/classof-raw */
              "./node_modules/core-js/internals/classof-raw.js"
            ), l = "".split;
            n.exports = i(function() {
              return !Object("z").propertyIsEnumerable(0);
            }) ? function(a) {
              return o(a) == "String" ? l.call(a, "") : Object(a);
            } : Object;
          }
        ),
        /***/
        "./node_modules/core-js/internals/internal-state.js": (
          /*!**********************************************************!*\
            !*** ./node_modules/core-js/internals/internal-state.js ***!
            \**********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/native-weak-map */
              "./node_modules/core-js/internals/native-weak-map.js"
            ), o = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), l = s(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), a = s(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), c = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), u = s(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), f = s(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), h = o.WeakMap, m, y, b, x = function(v) {
              return b(v) ? y(v) : m(v, {});
            }, C = function(v) {
              return function(w) {
                var _;
                if (!l(w) || (_ = y(w)).type !== v)
                  throw TypeError("Incompatible receiver, " + v + " required");
                return _;
              };
            };
            if (i) {
              var T = new h(), O = T.get, d = T.has, g = T.set;
              m = function(v, w) {
                return g.call(T, v, w), w;
              }, y = function(v) {
                return O.call(T, v) || {};
              }, b = function(v) {
                return d.call(T, v);
              };
            } else {
              var p = u("state");
              f[p] = !0, m = function(v, w) {
                return a(v, p, w), w;
              }, y = function(v) {
                return c(v, p) ? v[p] : {};
              }, b = function(v) {
                return c(v, p);
              };
            }
            n.exports = {
              set: m,
              get: y,
              has: b,
              enforce: x,
              getterFor: C
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/is-array-iterator-method.js": (
          /*!********************************************************************!*\
            !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
            \********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), o = s(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), l = i("iterator"), a = Array.prototype;
            n.exports = function(c) {
              return c !== void 0 && (o.Array === c || a[l] === c);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/is-forced.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/is-forced.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), o = /#|\.prototype\./, l = function(h, m) {
              var y = c[a(h)];
              return y == f ? !0 : y == u ? !1 : typeof m == "function" ? i(m) : !!m;
            }, a = l.normalize = function(h) {
              return String(h).replace(o, ".").toLowerCase();
            }, c = l.data = {}, u = l.NATIVE = "N", f = l.POLYFILL = "P";
            n.exports = l;
          }
        ),
        /***/
        "./node_modules/core-js/internals/is-object.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/is-object.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = function(s) {
              return typeof s == "object" ? s !== null : typeof s == "function";
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/is-pure.js": (
          /*!***************************************************!*\
            !*** ./node_modules/core-js/internals/is-pure.js ***!
            \***************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = !1;
          }
        ),
        /***/
        "./node_modules/core-js/internals/iterators-core.js": (
          /*!**********************************************************!*\
            !*** ./node_modules/core-js/internals/iterators-core.js ***!
            \**********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/object-get-prototype-of */
              "./node_modules/core-js/internals/object-get-prototype-of.js"
            ), o = s(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), l = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), a = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), c = s(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), u = a("iterator"), f = !1, h = function() {
              return this;
            }, m, y, b;
            [].keys && (b = [].keys(), "next" in b ? (y = i(i(b)), y !== Object.prototype && (m = y)) : f = !0), m == null && (m = {}), !c && !l(m, u) && o(m, u, h), n.exports = {
              IteratorPrototype: m,
              BUGGY_SAFARI_ITERATORS: f
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/iterators.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/iterators.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = {};
          }
        ),
        /***/
        "./node_modules/core-js/internals/native-symbol.js": (
          /*!*********************************************************!*\
            !*** ./node_modules/core-js/internals/native-symbol.js ***!
            \*********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            );
            n.exports = !!Object.getOwnPropertySymbols && !i(function() {
              return !String(Symbol());
            });
          }
        ),
        /***/
        "./node_modules/core-js/internals/native-weak-map.js": (
          /*!***********************************************************!*\
            !*** ./node_modules/core-js/internals/native-weak-map.js ***!
            \***********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/function-to-string */
              "./node_modules/core-js/internals/function-to-string.js"
            ), l = i.WeakMap;
            n.exports = typeof l == "function" && /native code/.test(o.call(l));
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-create.js": (
          /*!*********************************************************!*\
            !*** ./node_modules/core-js/internals/object-create.js ***!
            \*********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), o = s(
              /*! ../internals/object-define-properties */
              "./node_modules/core-js/internals/object-define-properties.js"
            ), l = s(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            ), a = s(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), c = s(
              /*! ../internals/html */
              "./node_modules/core-js/internals/html.js"
            ), u = s(
              /*! ../internals/document-create-element */
              "./node_modules/core-js/internals/document-create-element.js"
            ), f = s(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), h = f("IE_PROTO"), m = "prototype", y = function() {
            }, b = function() {
              var x = u("iframe"), C = l.length, T = "<", O = "script", d = ">", g = "java" + O + ":", p;
              for (x.style.display = "none", c.appendChild(x), x.src = String(g), p = x.contentWindow.document, p.open(), p.write(T + O + d + "document.F=Object" + T + "/" + O + d), p.close(), b = p.F; C--; )
                delete b[m][l[C]];
              return b();
            };
            n.exports = Object.create || function(C, T) {
              var O;
              return C !== null ? (y[m] = i(C), O = new y(), y[m] = null, O[h] = C) : O = b(), T === void 0 ? O : o(O, T);
            }, a[h] = !0;
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-define-properties.js": (
          /*!********************************************************************!*\
            !*** ./node_modules/core-js/internals/object-define-properties.js ***!
            \********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = s(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), l = s(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), a = s(
              /*! ../internals/object-keys */
              "./node_modules/core-js/internals/object-keys.js"
            );
            n.exports = i ? Object.defineProperties : function(u, f) {
              l(u);
              for (var h = a(f), m = h.length, y = 0, b; m > y; )
                o.f(u, b = h[y++], f[b]);
              return u;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-define-property.js": (
          /*!******************************************************************!*\
            !*** ./node_modules/core-js/internals/object-define-property.js ***!
            \******************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = s(
              /*! ../internals/ie8-dom-define */
              "./node_modules/core-js/internals/ie8-dom-define.js"
            ), l = s(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), a = s(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), c = Object.defineProperty;
            r.f = i ? c : function(f, h, m) {
              if (l(f), h = a(h, !0), l(m), o)
                try {
                  return c(f, h, m);
                } catch {
                }
              if ("get" in m || "set" in m)
                throw TypeError("Accessors not supported");
              return "value" in m && (f[h] = m.value), f;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-get-own-property-descriptor.js": (
          /*!******************************************************************************!*\
            !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
            \******************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = s(
              /*! ../internals/object-property-is-enumerable */
              "./node_modules/core-js/internals/object-property-is-enumerable.js"
            ), l = s(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            ), a = s(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), c = s(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), u = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), f = s(
              /*! ../internals/ie8-dom-define */
              "./node_modules/core-js/internals/ie8-dom-define.js"
            ), h = Object.getOwnPropertyDescriptor;
            r.f = i ? h : function(y, b) {
              if (y = a(y), b = c(b, !0), f)
                try {
                  return h(y, b);
                } catch {
                }
              if (u(y, b))
                return l(!o.f.call(y, b), y[b]);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-get-own-property-names.js": (
          /*!*************************************************************************!*\
            !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
            \*************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/object-keys-internal */
              "./node_modules/core-js/internals/object-keys-internal.js"
            ), o = s(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            ), l = o.concat("length", "prototype");
            r.f = Object.getOwnPropertyNames || function(c) {
              return i(c, l);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-get-own-property-symbols.js": (
          /*!***************************************************************************!*\
            !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
            \***************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            r.f = Object.getOwnPropertySymbols;
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-get-prototype-of.js": (
          /*!*******************************************************************!*\
            !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
            \*******************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), o = s(
              /*! ../internals/to-object */
              "./node_modules/core-js/internals/to-object.js"
            ), l = s(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), a = s(
              /*! ../internals/correct-prototype-getter */
              "./node_modules/core-js/internals/correct-prototype-getter.js"
            ), c = l("IE_PROTO"), u = Object.prototype;
            n.exports = a ? Object.getPrototypeOf : function(f) {
              return f = o(f), i(f, c) ? f[c] : typeof f.constructor == "function" && f instanceof f.constructor ? f.constructor.prototype : f instanceof Object ? u : null;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-keys-internal.js": (
          /*!****************************************************************!*\
            !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
            \****************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), o = s(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), l = s(
              /*! ../internals/array-includes */
              "./node_modules/core-js/internals/array-includes.js"
            ), a = s(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), c = l(!1);
            n.exports = function(u, f) {
              var h = o(u), m = 0, y = [], b;
              for (b in h)
                !i(a, b) && i(h, b) && y.push(b);
              for (; f.length > m; )
                i(h, b = f[m++]) && (~c(y, b) || y.push(b));
              return y;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-keys.js": (
          /*!*******************************************************!*\
            !*** ./node_modules/core-js/internals/object-keys.js ***!
            \*******************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/object-keys-internal */
              "./node_modules/core-js/internals/object-keys-internal.js"
            ), o = s(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            );
            n.exports = Object.keys || function(a) {
              return i(a, o);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-property-is-enumerable.js": (
          /*!*************************************************************************!*\
            !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
            \*************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, l = o && !i.call({ 1: 2 }, 1);
            r.f = l ? function(c) {
              var u = o(this, c);
              return !!u && u.enumerable;
            } : i;
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-set-prototype-of.js": (
          /*!*******************************************************************!*\
            !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
            \*******************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/validate-set-prototype-of-arguments */
              "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js"
            );
            n.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
              var o = !1, l = {}, a;
              try {
                a = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, a.call(l, []), o = l instanceof Array;
              } catch {
              }
              return function(u, f) {
                return i(u, f), o ? a.call(u, f) : u.__proto__ = f, u;
              };
            }() : void 0);
          }
        ),
        /***/
        "./node_modules/core-js/internals/own-keys.js": (
          /*!****************************************************!*\
            !*** ./node_modules/core-js/internals/own-keys.js ***!
            \****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/object-get-own-property-names */
              "./node_modules/core-js/internals/object-get-own-property-names.js"
            ), l = s(
              /*! ../internals/object-get-own-property-symbols */
              "./node_modules/core-js/internals/object-get-own-property-symbols.js"
            ), a = s(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), c = i.Reflect;
            n.exports = c && c.ownKeys || function(f) {
              var h = o.f(a(f)), m = l.f;
              return m ? h.concat(m(f)) : h;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/path.js": (
          /*!************************************************!*\
            !*** ./node_modules/core-js/internals/path.js ***!
            \************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            n.exports = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            );
          }
        ),
        /***/
        "./node_modules/core-js/internals/redefine.js": (
          /*!****************************************************!*\
            !*** ./node_modules/core-js/internals/redefine.js ***!
            \****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), l = s(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), a = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), c = s(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), u = s(
              /*! ../internals/function-to-string */
              "./node_modules/core-js/internals/function-to-string.js"
            ), f = s(
              /*! ../internals/internal-state */
              "./node_modules/core-js/internals/internal-state.js"
            ), h = f.get, m = f.enforce, y = String(u).split("toString");
            o("inspectSource", function(b) {
              return u.call(b);
            }), (n.exports = function(b, x, C, T) {
              var O = T ? !!T.unsafe : !1, d = T ? !!T.enumerable : !1, g = T ? !!T.noTargetGet : !1;
              if (typeof C == "function" && (typeof x == "string" && !a(C, "name") && l(C, "name", x), m(C).source = y.join(typeof x == "string" ? x : "")), b === i) {
                d ? b[x] = C : c(x, C);
                return;
              } else
                O ? !g && b[x] && (d = !0) : delete b[x];
              d ? b[x] = C : l(b, x, C);
            })(Function.prototype, "toString", function() {
              return typeof this == "function" && h(this).source || u.call(this);
            });
          }
        ),
        /***/
        "./node_modules/core-js/internals/require-object-coercible.js": (
          /*!********************************************************************!*\
            !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
            \********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            n.exports = function(s) {
              if (s == null)
                throw TypeError("Can't call method on " + s);
              return s;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/set-global.js": (
          /*!******************************************************!*\
            !*** ./node_modules/core-js/internals/set-global.js ***!
            \******************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            );
            n.exports = function(l, a) {
              try {
                o(i, l, a);
              } catch {
                i[l] = a;
              }
              return a;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/set-to-string-tag.js": (
          /*!*************************************************************!*\
            !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
            \*************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ).f, o = s(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), l = s(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), a = l("toStringTag");
            n.exports = function(c, u, f) {
              c && !o(c = f ? c : c.prototype, a) && i(c, a, { configurable: !0, value: u });
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/shared-key.js": (
          /*!******************************************************!*\
            !*** ./node_modules/core-js/internals/shared-key.js ***!
            \******************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), o = s(
              /*! ../internals/uid */
              "./node_modules/core-js/internals/uid.js"
            ), l = i("keys");
            n.exports = function(a) {
              return l[a] || (l[a] = o(a));
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/shared.js": (
          /*!**************************************************!*\
            !*** ./node_modules/core-js/internals/shared.js ***!
            \**************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), l = s(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), a = "__core-js_shared__", c = i[a] || o(a, {});
            (n.exports = function(u, f) {
              return c[u] || (c[u] = f !== void 0 ? f : {});
            })("versions", []).push({
              version: "3.1.3",
              mode: l ? "pure" : "global",
              copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
            });
          }
        ),
        /***/
        "./node_modules/core-js/internals/string-at.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/string-at.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = s(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(l, a, c) {
              var u = String(o(l)), f = i(a), h = u.length, m, y;
              return f < 0 || f >= h ? c ? "" : void 0 : (m = u.charCodeAt(f), m < 55296 || m > 56319 || f + 1 === h || (y = u.charCodeAt(f + 1)) < 56320 || y > 57343 ? c ? u.charAt(f) : m : c ? u.slice(f, f + 2) : (m - 55296 << 10) + (y - 56320) + 65536);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/to-absolute-index.js": (
          /*!*************************************************************!*\
            !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
            \*************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = Math.max, l = Math.min;
            n.exports = function(a, c) {
              var u = i(a);
              return u < 0 ? o(u + c, 0) : l(u, c);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/to-indexed-object.js": (
          /*!*************************************************************!*\
            !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
            \*************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/indexed-object */
              "./node_modules/core-js/internals/indexed-object.js"
            ), o = s(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(l) {
              return i(o(l));
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/to-integer.js": (
          /*!******************************************************!*\
            !*** ./node_modules/core-js/internals/to-integer.js ***!
            \******************************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            var s = Math.ceil, i = Math.floor;
            n.exports = function(o) {
              return isNaN(o = +o) ? 0 : (o > 0 ? i : s)(o);
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/to-length.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/to-length.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = Math.min;
            n.exports = function(l) {
              return l > 0 ? o(i(l), 9007199254740991) : 0;
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/to-object.js": (
          /*!*****************************************************!*\
            !*** ./node_modules/core-js/internals/to-object.js ***!
            \*****************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(o) {
              return Object(i(o));
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/to-primitive.js": (
          /*!********************************************************!*\
            !*** ./node_modules/core-js/internals/to-primitive.js ***!
            \********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            );
            n.exports = function(o, l) {
              if (!i(o))
                return o;
              var a, c;
              if (l && typeof (a = o.toString) == "function" && !i(c = a.call(o)) || typeof (a = o.valueOf) == "function" && !i(c = a.call(o)) || !l && typeof (a = o.toString) == "function" && !i(c = a.call(o)))
                return c;
              throw TypeError("Can't convert object to primitive value");
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/uid.js": (
          /*!***********************************************!*\
            !*** ./node_modules/core-js/internals/uid.js ***!
            \***********************************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            var s = 0, i = Math.random();
            n.exports = function(o) {
              return "Symbol(".concat(o === void 0 ? "" : o, ")_", (++s + i).toString(36));
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js": (
          /*!*******************************************************************************!*\
            !*** ./node_modules/core-js/internals/validate-set-prototype-of-arguments.js ***!
            \*******************************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), o = s(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            );
            n.exports = function(l, a) {
              if (o(l), !i(a) && a !== null)
                throw TypeError("Can't set " + String(a) + " as a prototype");
            };
          }
        ),
        /***/
        "./node_modules/core-js/internals/well-known-symbol.js": (
          /*!*************************************************************!*\
            !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
            \*************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), l = s(
              /*! ../internals/uid */
              "./node_modules/core-js/internals/uid.js"
            ), a = s(
              /*! ../internals/native-symbol */
              "./node_modules/core-js/internals/native-symbol.js"
            ), c = i.Symbol, u = o("wks");
            n.exports = function(f) {
              return u[f] || (u[f] = a && c[f] || (a ? c : l)("Symbol." + f));
            };
          }
        ),
        /***/
        "./node_modules/core-js/modules/es.array.from.js": (
          /*!*******************************************************!*\
            !*** ./node_modules/core-js/modules/es.array.from.js ***!
            \*******************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/export */
              "./node_modules/core-js/internals/export.js"
            ), o = s(
              /*! ../internals/array-from */
              "./node_modules/core-js/internals/array-from.js"
            ), l = s(
              /*! ../internals/check-correctness-of-iteration */
              "./node_modules/core-js/internals/check-correctness-of-iteration.js"
            ), a = !l(function(c) {
              Array.from(c);
            });
            i({ target: "Array", stat: !0, forced: a }, {
              from: o
            });
          }
        ),
        /***/
        "./node_modules/core-js/modules/es.string.iterator.js": (
          /*!************************************************************!*\
            !*** ./node_modules/core-js/modules/es.string.iterator.js ***!
            \************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ../internals/string-at */
              "./node_modules/core-js/internals/string-at.js"
            ), o = s(
              /*! ../internals/internal-state */
              "./node_modules/core-js/internals/internal-state.js"
            ), l = s(
              /*! ../internals/define-iterator */
              "./node_modules/core-js/internals/define-iterator.js"
            ), a = "String Iterator", c = o.set, u = o.getterFor(a);
            l(String, "String", function(f) {
              c(this, {
                type: a,
                string: String(f),
                index: 0
              });
            }, function() {
              var h = u(this), m = h.string, y = h.index, b;
              return y >= m.length ? { value: void 0, done: !0 } : (b = i(m, y, !0), h.index += b.length, { value: b, done: !1 });
            });
          }
        ),
        /***/
        "./node_modules/webpack/buildin/global.js": (
          /*!***********************************!*\
            !*** (webpack)/buildin/global.js ***!
            \***********************************/
          /*! no static exports found */
          /***/
          function(n, r) {
            var s;
            s = /* @__PURE__ */ function() {
              return this;
            }();
            try {
              s = s || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (s = window);
            }
            n.exports = s;
          }
        ),
        /***/
        "./src/default-attrs.json": (
          /*!********************************!*\
            !*** ./src/default-attrs.json ***!
            \********************************/
          /*! exports provided: xmlns, width, height, viewBox, fill, stroke, stroke-width, stroke-linecap, stroke-linejoin, default */
          /***/
          function(n) {
            n.exports = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" };
          }
        ),
        /***/
        "./src/icon.js": (
          /*!*********************!*\
            !*** ./src/icon.js ***!
            \*********************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var i = Object.assign || function(b) {
              for (var x = 1; x < arguments.length; x++) {
                var C = arguments[x];
                for (var T in C)
                  Object.prototype.hasOwnProperty.call(C, T) && (b[T] = C[T]);
              }
              return b;
            }, o = /* @__PURE__ */ function() {
              function b(x, C) {
                for (var T = 0; T < C.length; T++) {
                  var O = C[T];
                  O.enumerable = O.enumerable || !1, O.configurable = !0, "value" in O && (O.writable = !0), Object.defineProperty(x, O.key, O);
                }
              }
              return function(x, C, T) {
                return C && b(x.prototype, C), T && b(x, T), x;
              };
            }(), l = s(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), a = f(l), c = s(
              /*! ./default-attrs.json */
              "./src/default-attrs.json"
            ), u = f(c);
            function f(b) {
              return b && b.__esModule ? b : { default: b };
            }
            function h(b, x) {
              if (!(b instanceof x))
                throw new TypeError("Cannot call a class as a function");
            }
            var m = function() {
              function b(x, C) {
                var T = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                h(this, b), this.name = x, this.contents = C, this.tags = T, this.attrs = i({}, u.default, { class: "feather feather-" + x });
              }
              return o(b, [{
                key: "toSvg",
                value: function() {
                  var C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, T = i({}, this.attrs, C, { class: (0, a.default)(this.attrs.class, C.class) });
                  return "<svg " + y(T) + ">" + this.contents + "</svg>";
                }
                /**
                 * Return string representation of an `Icon`.
                 *
                 * Added for backward compatibility. If old code expects `feather.icons.<name>`
                 * to be a string, `toString()` will get implicitly called.
                 *
                 * @returns {string}
                 */
              }, {
                key: "toString",
                value: function() {
                  return this.contents;
                }
              }]), b;
            }();
            function y(b) {
              return Object.keys(b).map(function(x) {
                return x + '="' + b[x] + '"';
              }).join(" ");
            }
            r.default = m;
          }
        ),
        /***/
        "./src/icons.js": (
          /*!**********************!*\
            !*** ./src/icons.js ***!
            \**********************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var i = s(
              /*! ./icon */
              "./src/icon.js"
            ), o = f(i), l = s(
              /*! ../dist/icons.json */
              "./dist/icons.json"
            ), a = f(l), c = s(
              /*! ./tags.json */
              "./src/tags.json"
            ), u = f(c);
            function f(h) {
              return h && h.__esModule ? h : { default: h };
            }
            r.default = Object.keys(a.default).map(function(h) {
              return new o.default(h, a.default[h], u.default[h]);
            }).reduce(function(h, m) {
              return h[m.name] = m, h;
            }, {});
          }
        ),
        /***/
        "./src/index.js": (
          /*!**********************!*\
            !*** ./src/index.js ***!
            \**********************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            var i = s(
              /*! ./icons */
              "./src/icons.js"
            ), o = f(i), l = s(
              /*! ./to-svg */
              "./src/to-svg.js"
            ), a = f(l), c = s(
              /*! ./replace */
              "./src/replace.js"
            ), u = f(c);
            function f(h) {
              return h && h.__esModule ? h : { default: h };
            }
            n.exports = { icons: o.default, toSvg: a.default, replace: u.default };
          }
        ),
        /***/
        "./src/replace.js": (
          /*!************************!*\
            !*** ./src/replace.js ***!
            \************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var i = Object.assign || function(y) {
              for (var b = 1; b < arguments.length; b++) {
                var x = arguments[b];
                for (var C in x)
                  Object.prototype.hasOwnProperty.call(x, C) && (y[C] = x[C]);
              }
              return y;
            }, o = s(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), l = u(o), a = s(
              /*! ./icons */
              "./src/icons.js"
            ), c = u(a);
            function u(y) {
              return y && y.__esModule ? y : { default: y };
            }
            function f() {
              var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
              if (typeof document > "u")
                throw new Error("`feather.replace()` only works in a browser environment.");
              var b = document.querySelectorAll("[data-feather]");
              Array.from(b).forEach(function(x) {
                return h(x, y);
              });
            }
            function h(y) {
              var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, x = m(y), C = x["data-feather"];
              delete x["data-feather"];
              var T = c.default[C].toSvg(i({}, b, x, { class: (0, l.default)(b.class, x.class) })), O = new DOMParser().parseFromString(T, "image/svg+xml"), d = O.querySelector("svg");
              y.parentNode.replaceChild(d, y);
            }
            function m(y) {
              return Array.from(y.attributes).reduce(function(b, x) {
                return b[x.name] = x.value, b;
              }, {});
            }
            r.default = f;
          }
        ),
        /***/
        "./src/tags.json": (
          /*!***********************!*\
            !*** ./src/tags.json ***!
            \***********************/
          /*! exports provided: activity, airplay, alert-circle, alert-octagon, alert-triangle, align-center, align-justify, align-left, align-right, anchor, archive, at-sign, award, aperture, bar-chart, bar-chart-2, battery, battery-charging, bell, bell-off, bluetooth, book-open, book, bookmark, box, briefcase, calendar, camera, cast, chevron-down, chevron-up, circle, clipboard, clock, cloud-drizzle, cloud-lightning, cloud-rain, cloud-snow, cloud, codepen, codesandbox, code, coffee, columns, command, compass, copy, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, cpu, credit-card, crop, crosshair, database, delete, disc, dollar-sign, droplet, edit, edit-2, edit-3, eye, eye-off, external-link, facebook, fast-forward, figma, file-minus, file-plus, file-text, film, filter, flag, folder-minus, folder-plus, folder, framer, frown, gift, git-branch, git-commit, git-merge, git-pull-request, github, gitlab, globe, hard-drive, hash, headphones, heart, help-circle, hexagon, home, image, inbox, instagram, key, layers, layout, life-buoy, link, link-2, linkedin, list, lock, log-in, log-out, mail, map-pin, map, maximize, maximize-2, meh, menu, message-circle, message-square, mic-off, mic, minimize, minimize-2, minus, monitor, moon, more-horizontal, more-vertical, mouse-pointer, move, music, navigation, navigation-2, octagon, package, paperclip, pause, pause-circle, pen-tool, percent, phone-call, phone-forwarded, phone-incoming, phone-missed, phone-off, phone-outgoing, phone, play, pie-chart, play-circle, plus, plus-circle, plus-square, pocket, power, printer, radio, refresh-cw, refresh-ccw, repeat, rewind, rotate-ccw, rotate-cw, rss, save, scissors, search, send, settings, share-2, shield, shield-off, shopping-bag, shopping-cart, shuffle, skip-back, skip-forward, slack, slash, sliders, smartphone, smile, speaker, star, stop-circle, sun, sunrise, sunset, tablet, tag, target, terminal, thermometer, thumbs-down, thumbs-up, toggle-left, toggle-right, tool, trash, trash-2, triangle, truck, tv, twitch, twitter, type, umbrella, unlock, user-check, user-minus, user-plus, user-x, user, users, video-off, video, voicemail, volume, volume-1, volume-2, volume-x, watch, wifi-off, wifi, wind, x-circle, x-octagon, x-square, x, youtube, zap-off, zap, zoom-in, zoom-out, default */
          /***/
          function(n) {
            n.exports = { activity: ["pulse", "health", "action", "motion"], airplay: ["stream", "cast", "mirroring"], "alert-circle": ["warning", "alert", "danger"], "alert-octagon": ["warning", "alert", "danger"], "alert-triangle": ["warning", "alert", "danger"], "align-center": ["text alignment", "center"], "align-justify": ["text alignment", "justified"], "align-left": ["text alignment", "left"], "align-right": ["text alignment", "right"], anchor: [], archive: ["index", "box"], "at-sign": ["mention", "at", "email", "message"], award: ["achievement", "badge"], aperture: ["camera", "photo"], "bar-chart": ["statistics", "diagram", "graph"], "bar-chart-2": ["statistics", "diagram", "graph"], battery: ["power", "electricity"], "battery-charging": ["power", "electricity"], bell: ["alarm", "notification", "sound"], "bell-off": ["alarm", "notification", "silent"], bluetooth: ["wireless"], "book-open": ["read", "library"], book: ["read", "dictionary", "booklet", "magazine", "library"], bookmark: ["read", "clip", "marker", "tag"], box: ["cube"], briefcase: ["work", "bag", "baggage", "folder"], calendar: ["date"], camera: ["photo"], cast: ["chromecast", "airplay"], "chevron-down": ["expand"], "chevron-up": ["collapse"], circle: ["off", "zero", "record"], clipboard: ["copy"], clock: ["time", "watch", "alarm"], "cloud-drizzle": ["weather", "shower"], "cloud-lightning": ["weather", "bolt"], "cloud-rain": ["weather"], "cloud-snow": ["weather", "blizzard"], cloud: ["weather"], codepen: ["logo"], codesandbox: ["logo"], code: ["source", "programming"], coffee: ["drink", "cup", "mug", "tea", "cafe", "hot", "beverage"], columns: ["layout"], command: ["keyboard", "cmd", "terminal", "prompt"], compass: ["navigation", "safari", "travel", "direction"], copy: ["clone", "duplicate"], "corner-down-left": ["arrow", "return"], "corner-down-right": ["arrow"], "corner-left-down": ["arrow"], "corner-left-up": ["arrow"], "corner-right-down": ["arrow"], "corner-right-up": ["arrow"], "corner-up-left": ["arrow"], "corner-up-right": ["arrow"], cpu: ["processor", "technology"], "credit-card": ["purchase", "payment", "cc"], crop: ["photo", "image"], crosshair: ["aim", "target"], database: ["storage", "memory"], delete: ["remove"], disc: ["album", "cd", "dvd", "music"], "dollar-sign": ["currency", "money", "payment"], droplet: ["water"], edit: ["pencil", "change"], "edit-2": ["pencil", "change"], "edit-3": ["pencil", "change"], eye: ["view", "watch"], "eye-off": ["view", "watch", "hide", "hidden"], "external-link": ["outbound"], facebook: ["logo", "social"], "fast-forward": ["music"], figma: ["logo", "design", "tool"], "file-minus": ["delete", "remove", "erase"], "file-plus": ["add", "create", "new"], "file-text": ["data", "txt", "pdf"], film: ["movie", "video"], filter: ["funnel", "hopper"], flag: ["report"], "folder-minus": ["directory"], "folder-plus": ["directory"], folder: ["directory"], framer: ["logo", "design", "tool"], frown: ["emoji", "face", "bad", "sad", "emotion"], gift: ["present", "box", "birthday", "party"], "git-branch": ["code", "version control"], "git-commit": ["code", "version control"], "git-merge": ["code", "version control"], "git-pull-request": ["code", "version control"], github: ["logo", "version control"], gitlab: ["logo", "version control"], globe: ["world", "browser", "language", "translate"], "hard-drive": ["computer", "server", "memory", "data"], hash: ["hashtag", "number", "pound"], headphones: ["music", "audio", "sound"], heart: ["like", "love", "emotion"], "help-circle": ["question mark"], hexagon: ["shape", "node.js", "logo"], home: ["house", "living"], image: ["picture"], inbox: ["email"], instagram: ["logo", "camera"], key: ["password", "login", "authentication", "secure"], layers: ["stack"], layout: ["window", "webpage"], "life-buoy": ["help", "life ring", "support"], link: ["chain", "url"], "link-2": ["chain", "url"], linkedin: ["logo", "social media"], list: ["options"], lock: ["security", "password", "secure"], "log-in": ["sign in", "arrow", "enter"], "log-out": ["sign out", "arrow", "exit"], mail: ["email", "message"], "map-pin": ["location", "navigation", "travel", "marker"], map: ["location", "navigation", "travel"], maximize: ["fullscreen"], "maximize-2": ["fullscreen", "arrows", "expand"], meh: ["emoji", "face", "neutral", "emotion"], menu: ["bars", "navigation", "hamburger"], "message-circle": ["comment", "chat"], "message-square": ["comment", "chat"], "mic-off": ["record", "sound", "mute"], mic: ["record", "sound", "listen"], minimize: ["exit fullscreen", "close"], "minimize-2": ["exit fullscreen", "arrows", "close"], minus: ["subtract"], monitor: ["tv", "screen", "display"], moon: ["dark", "night"], "more-horizontal": ["ellipsis"], "more-vertical": ["ellipsis"], "mouse-pointer": ["arrow", "cursor"], move: ["arrows"], music: ["note"], navigation: ["location", "travel"], "navigation-2": ["location", "travel"], octagon: ["stop"], package: ["box", "container"], paperclip: ["attachment"], pause: ["music", "stop"], "pause-circle": ["music", "audio", "stop"], "pen-tool": ["vector", "drawing"], percent: ["discount"], "phone-call": ["ring"], "phone-forwarded": ["call"], "phone-incoming": ["call"], "phone-missed": ["call"], "phone-off": ["call", "mute"], "phone-outgoing": ["call"], phone: ["call"], play: ["music", "start"], "pie-chart": ["statistics", "diagram"], "play-circle": ["music", "start"], plus: ["add", "new"], "plus-circle": ["add", "new"], "plus-square": ["add", "new"], pocket: ["logo", "save"], power: ["on", "off"], printer: ["fax", "office", "device"], radio: ["signal"], "refresh-cw": ["synchronise", "arrows"], "refresh-ccw": ["arrows"], repeat: ["loop", "arrows"], rewind: ["music"], "rotate-ccw": ["arrow"], "rotate-cw": ["arrow"], rss: ["feed", "subscribe"], save: ["floppy disk"], scissors: ["cut"], search: ["find", "magnifier", "magnifying glass"], send: ["message", "mail", "email", "paper airplane", "paper aeroplane"], settings: ["cog", "edit", "gear", "preferences"], "share-2": ["network", "connections"], shield: ["security", "secure"], "shield-off": ["security", "insecure"], "shopping-bag": ["ecommerce", "cart", "purchase", "store"], "shopping-cart": ["ecommerce", "cart", "purchase", "store"], shuffle: ["music"], "skip-back": ["music"], "skip-forward": ["music"], slack: ["logo"], slash: ["ban", "no"], sliders: ["settings", "controls"], smartphone: ["cellphone", "device"], smile: ["emoji", "face", "happy", "good", "emotion"], speaker: ["audio", "music"], star: ["bookmark", "favorite", "like"], "stop-circle": ["media", "music"], sun: ["brightness", "weather", "light"], sunrise: ["weather", "time", "morning", "day"], sunset: ["weather", "time", "evening", "night"], tablet: ["device"], tag: ["label"], target: ["logo", "bullseye"], terminal: ["code", "command line", "prompt"], thermometer: ["temperature", "celsius", "fahrenheit", "weather"], "thumbs-down": ["dislike", "bad", "emotion"], "thumbs-up": ["like", "good", "emotion"], "toggle-left": ["on", "off", "switch"], "toggle-right": ["on", "off", "switch"], tool: ["settings", "spanner"], trash: ["garbage", "delete", "remove", "bin"], "trash-2": ["garbage", "delete", "remove", "bin"], triangle: ["delta"], truck: ["delivery", "van", "shipping", "transport", "lorry"], tv: ["television", "stream"], twitch: ["logo"], twitter: ["logo", "social"], type: ["text"], umbrella: ["rain", "weather"], unlock: ["security"], "user-check": ["followed", "subscribed"], "user-minus": ["delete", "remove", "unfollow", "unsubscribe"], "user-plus": ["new", "add", "create", "follow", "subscribe"], "user-x": ["delete", "remove", "unfollow", "unsubscribe", "unavailable"], user: ["person", "account"], users: ["group"], "video-off": ["camera", "movie", "film"], video: ["camera", "movie", "film"], voicemail: ["phone"], volume: ["music", "sound", "mute"], "volume-1": ["music", "sound"], "volume-2": ["music", "sound"], "volume-x": ["music", "sound", "mute"], watch: ["clock", "time"], "wifi-off": ["disabled"], wifi: ["connection", "signal", "wireless"], wind: ["weather", "air"], "x-circle": ["cancel", "close", "delete", "remove", "times", "clear"], "x-octagon": ["delete", "stop", "alert", "warning", "times", "clear"], "x-square": ["cancel", "close", "delete", "remove", "times", "clear"], x: ["cancel", "close", "delete", "remove", "times", "clear"], youtube: ["logo", "video", "play"], "zap-off": ["flash", "camera", "lightning"], zap: ["flash", "camera", "lightning"], "zoom-in": ["magnifying glass"], "zoom-out": ["magnifying glass"] };
          }
        ),
        /***/
        "./src/to-svg.js": (
          /*!***********************!*\
            !*** ./src/to-svg.js ***!
            \***********************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var i = s(
              /*! ./icons */
              "./src/icons.js"
            ), o = l(i);
            function l(c) {
              return c && c.__esModule ? c : { default: c };
            }
            function a(c) {
              var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              if (console.warn("feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead."), !c)
                throw new Error("The required `key` (icon name) parameter is missing.");
              if (!o.default[c])
                throw new Error("No icon matching '" + c + "'. See the complete list of icons at https://feathericons.com");
              return o.default[c].toSvg(u);
            }
            r.default = a;
          }
        ),
        /***/
        0: (
          /*!**************************************************!*\
            !*** multi core-js/es/array/from ./src/index.js ***!
            \**************************************************/
          /*! no static exports found */
          /***/
          function(n, r, s) {
            s(
              /*! core-js/es/array/from */
              "./node_modules/core-js/es/array/from.js"
            ), n.exports = s(
              /*! /home/runner/work/feather/feather/src/index.js */
              "./src/index.js"
            );
          }
        )
        /******/
      })
    );
  });
})(Ah);
var oy = Ah.exports;
const Xl = /* @__PURE__ */ sc(oy), Uu = Object.keys(Xl.icons), ol = {
  props: {
    name: {
      type: String,
      required: !0,
      validator(t) {
        const e = Uu.includes(t);
        return e || (console.groupCollapsed(
          "[frappe-ui] name property for feather-icon must be one of "
        ), console.dir(Uu), console.groupEnd()), e;
      }
    },
    color: {
      type: String,
      default: null
    },
    strokeWidth: {
      type: Number,
      default: 1.5
    }
  },
  render() {
    let t = Xl.icons[this.name];
    return t || (t = Xl.icons.circle), Po(
      "svg",
      ec(
        t.attrs,
        {
          fill: "none",
          stroke: "currentColor",
          color: this.color,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": this.strokeWidth,
          width: null,
          height: null,
          class: [t.attrs.class, "shrink-0"],
          innerHTML: t.contents
        },
        this.$attrs
      )
    );
  }
}, ly = {
  name: "LoadingIndicator"
}, ay = {
  class: "max-w-xs animate-spin",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, cy = /* @__PURE__ */ le("circle", {
  class: "opacity-25",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), uy = /* @__PURE__ */ le("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), dy = [
  cy,
  uy
];
function fy(t, e, n, r, s, i) {
  return Z(), pe("svg", ay, dy);
}
const hy = /* @__PURE__ */ rt(ly, [["render", fy]]);
var qu;
(function(t) {
  t.pop = "pop", t.push = "push";
})(qu || (qu = {}));
var Gu;
(function(t) {
  t.back = "back", t.forward = "forward", t.unknown = "";
})(Gu || (Gu = {}));
var Ju;
(function(t) {
  t[t.aborted = 4] = "aborted", t[t.cancelled = 8] = "cancelled", t[t.duplicated = 16] = "duplicated";
})(Ju || (Ju = {}));
const py = Symbol("");
function my() {
  return In(py);
}
const gy = ["disabled", "ariaLabel"], yy = /* @__PURE__ */ Xe({
  __name: "Button",
  props: {
    theme: { default: "gray" },
    size: { default: "sm" },
    variant: { default: "subtle" },
    label: {},
    icon: {},
    iconLeft: {},
    iconRight: {},
    loading: { type: Boolean, default: !1 },
    loadingText: {},
    disabled: { type: Boolean, default: !1 },
    route: {},
    link: {}
  },
  setup(t) {
    const e = t, n = U1(), r = my(), s = lt(() => {
      let u = {
        gray: "text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700",
        blue: "text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
        green: "text-white bg-green-600 hover:bg-green-700 active:bg-green-800",
        red: "text-white bg-red-600 hover:bg-red-700 active:bg-red-800"
      }[e.theme], f = {
        gray: "text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
        blue: "text-blue-600 bg-blue-100 hover:bg-blue-200 active:bg-blue-300",
        green: "text-green-800 bg-green-100 hover:bg-green-200 active:bg-green-300",
        red: "text-red-700 bg-red-100 hover:bg-red-200 active:bg-red-300"
      }[e.theme], h = {
        gray: "text-gray-800 bg-white border border-gray-300 hover:border-gray-400 active:border-gray-400 active:bg-gray-300",
        blue: "text-blue-600 bg-white border border-blue-300 hover:border-blue-400 active:border-blue-400 active:bg-blue-300",
        green: "text-green-800 bg-white border border-green-400 hover:border-green-500 active:border-green-500 active:bg-green-300",
        red: "text-red-700 bg-white border border-red-300 hover:border-red-400 active:border-red-400 active:bg-red-200"
      }[e.theme], m = {
        gray: "text-gray-800 bg-transparent hover:bg-gray-200 active:bg-gray-300",
        blue: "text-blue-600 bg-transparent hover:bg-blue-200 active:bg-blue-300",
        green: "text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300",
        red: "text-red-700 bg-transparent hover:bg-red-200 active:bg-red-300"
      }[e.theme], y = {
        gray: "focus-visible:ring focus-visible:ring-gray-400",
        blue: "focus-visible:ring focus-visible:ring-blue-400",
        green: "focus-visible:ring focus-visible:ring-green-400",
        red: "focus-visible:ring focus-visible:ring-red-400"
      }[e.theme], b = {
        subtle: f,
        solid: u,
        outline: h,
        ghost: m
      }[e.variant], x = `${e.theme}-${e.variant}`, C = {
        gray: "bg-gray-100 text-gray-500",
        "gray-outline": "bg-gray-100 text-gray-500 border border-gray-300",
        "gray-ghost": "text-gray-500",
        "blue-solid": "bg-blue-300 text-white",
        "blue-subtle": "bg-blue-100 text-blue-400",
        "blue-outline": "bg-blue-100 text-blue-400 border border-blue-300",
        "blue-ghost": "text-blue-400",
        green: "bg-green-100 text-green-500",
        "green-outline": "bg-green-100 text-green-500 border border-green-400",
        "green-ghost": "text-green-500",
        red: "bg-red-100 text-red-400",
        "red-outline": "bg-red-100 text-red-400 border border-red-300",
        "red-ghost": "text-red-400"
      }, T = C[x] || C[e.theme], O = {
        sm: "h-7 text-base px-2 rounded",
        md: "h-8 text-base font-medium px-2.5 rounded",
        lg: "h-10 text-lg font-medium px-3 rounded-md",
        xl: "h-11.5 text-xl font-medium px-3.5 rounded-lg",
        "2xl": "h-13 text-2xl font-medium px-3.5 rounded-xl"
      }[e.size];
      return a.value && (O = {
        sm: "h-7 w-7 rounded",
        md: "h-8 w-8 rounded",
        lg: "h-10 w-10 rounded-md",
        xl: "h-11.5 w-11.5 rounded-lg",
        "2xl": "h-13 w-13 rounded-xl"
      }[e.size]), [
        "inline-flex items-center justify-center gap-2 transition-colors focus:outline-none",
        o.value ? T : b,
        y,
        O
      ];
    }), i = lt(() => ({
      sm: "h-4",
      md: "h-4.5",
      lg: "h-5",
      xl: "h-6",
      "2xl": "h-6"
    })[e.size]), o = lt(() => e.disabled || e.loading), l = lt(() => a.value ? e.label : null), a = lt(() => e.icon || n.icon), c = () => {
      if (e.route)
        return r.push(e.route);
      if (e.link)
        return window.open(e.link, "_blank");
    };
    return (u, f) => (Z(), pe("button", ec(u.$attrs, {
      class: s.value,
      onClick: c,
      disabled: o.value,
      ariaLabel: l.value
    }), [
      u.loading ? (Z(), We(hy, {
        key: 0,
        class: $t({
          "h-3 w-3": u.size == "sm",
          "h-[13.5px] w-[13.5px]": u.size == "md",
          "h-[15px] w-[15px]": u.size == "lg",
          "h-4.5 w-4.5": u.size == "xl" || u.size == "2xl"
        })
      }, null, 8, ["class"])) : u.$slots.prefix || u.iconLeft ? Cr(u.$slots, "prefix", { key: 1 }, () => [
        u.iconLeft ? (Z(), We(ol, {
          key: 0,
          name: u.iconLeft,
          class: $t(i.value),
          "aria-hidden": "true"
        }, null, 8, ["name", "class"])) : Ge("", !0)
      ]) : Ge("", !0),
      u.loading && u.loadingText ? (Z(), pe(Pe, { key: 2 }, [
        Ln(at(u.loadingText), 1)
      ], 64)) : a.value && !u.loading ? (Z(), pe(Pe, { key: 3 }, [
        u.icon ? (Z(), We(ol, {
          key: 0,
          name: u.icon,
          class: $t(i.value),
          "aria-label": u.label
        }, null, 8, ["name", "class", "aria-label"])) : u.$slots.icon ? Cr(u.$slots, "icon", { key: 1 }) : Ge("", !0)
      ], 64)) : (Z(), pe("span", {
        key: 4,
        class: $t({ "sr-only": a.value })
      }, [
        Cr(u.$slots, "default", {}, () => [
          Ln(at(u.label), 1)
        ])
      ], 2)),
      Cr(u.$slots, "suffix", {}, () => [
        u.iconRight ? (Z(), We(ol, {
          key: 0,
          name: u.iconRight,
          class: $t(i.value),
          "aria-hidden": "true"
        }, null, 8, ["name", "class"])) : Ge("", !0)
      ])
    ], 16, gy));
  }
}), by = {}, Th = (t) => (qa("data-v-48d21730"), t = t(), Ga(), t), vy = {
  class: "spinner",
  viewBox: "0 0 50 50"
}, wy = /* @__PURE__ */ Th(() => /* @__PURE__ */ le("defs", null, [
  /* @__PURE__ */ le("linearGradient", {
    id: "gradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, [
    /* @__PURE__ */ le("stop", {
      offset: "0%",
      "stop-color": "rgba(0,110,219,1)"
    }),
    /* @__PURE__ */ le("stop", {
      offset: "100%",
      "stop-color": "rgba(255,255,255,0)"
    })
  ])
], -1)), xy = /* @__PURE__ */ Th(() => /* @__PURE__ */ le("circle", {
  stroke: "url(#gradient)",
  class: "spinner-path",
  cx: "25",
  cy: "25",
  r: "20",
  fill: "none",
  "stroke-width": "5"
}, null, -1)), ky = [
  wy,
  xy
];
function _y(t, e) {
  return Z(), pe("svg", vy, ky);
}
const Sy = /* @__PURE__ */ rt(by, [["render", _y], ["__scopeId", "data-v-48d21730"]]);
function Oh(t, e, n) {
  for (let r = 0; ; r++) {
    if (r == t.childCount || r == e.childCount)
      return t.childCount == e.childCount ? null : n;
    let s = t.child(r), i = e.child(r);
    if (s == i) {
      n += s.nodeSize;
      continue;
    }
    if (!s.sameMarkup(i))
      return n;
    if (s.isText && s.text != i.text) {
      for (let o = 0; s.text[o] == i.text[o]; o++)
        n++;
      return n;
    }
    if (s.content.size || i.content.size) {
      let o = Oh(s.content, i.content, n + 1);
      if (o != null)
        return o;
    }
    n += s.nodeSize;
  }
}
function jh(t, e, n, r) {
  for (let s = t.childCount, i = e.childCount; ; ) {
    if (s == 0 || i == 0)
      return s == i ? null : { a: n, b: r };
    let o = t.child(--s), l = e.child(--i), a = o.nodeSize;
    if (o == l) {
      n -= a, r -= a;
      continue;
    }
    if (!o.sameMarkup(l))
      return { a: n, b: r };
    if (o.isText && o.text != l.text) {
      let c = 0, u = Math.min(o.text.length, l.text.length);
      for (; c < u && o.text[o.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, n--, r--;
      return { a: n, b: r };
    }
    if (o.content.size || l.content.size) {
      let c = jh(o.content, l.content, n - 1, r - 1);
      if (c)
        return c;
    }
    n -= a, r -= a;
  }
}
class H {
  /**
  @internal
  */
  constructor(e, n) {
    if (this.content = e, this.size = n || 0, n == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, n, r, s = 0, i) {
    for (let o = 0, l = 0; l < n; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, s + l, i || null, o) !== !1 && a.content.size) {
        let u = l + 1;
        a.nodesBetween(Math.max(0, e - u), Math.min(a.content.size, n - u), r, s + u);
      }
      l = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, n, r, s) {
    let i = "", o = !0;
    return this.nodesBetween(e, n, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, n - a) : l.isLeaf ? s ? typeof s == "function" ? s(l) : s : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && r && (o ? o = !1 : i += r), i += c;
    }, 0), i;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let n = this.lastChild, r = e.firstChild, s = this.content.slice(), i = 0;
    for (n.isText && n.sameMarkup(r) && (s[s.length - 1] = n.withText(n.text + r.text), i = 1); i < e.content.length; i++)
      s.push(e.content[i]);
    return new H(s, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, n = this.size) {
    if (e == 0 && n == this.size)
      return this;
    let r = [], s = 0;
    if (n > e)
      for (let i = 0, o = 0; o < n; i++) {
        let l = this.content[i], a = o + l.nodeSize;
        a > e && ((o < e || a > n) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, n - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, n - o - 1))), r.push(l), s += l.nodeSize), o = a;
      }
    return new H(r, s);
  }
  /**
  @internal
  */
  cutByIndex(e, n) {
    return e == n ? H.empty : e == 0 && n == this.content.length ? this : new H(this.content.slice(e, n));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, n) {
    let r = this.content[e];
    if (r == n)
      return this;
    let s = this.content.slice(), i = this.size + n.nodeSize - r.nodeSize;
    return s[e] = n, new H(s, i);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new H([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new H(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let n = 0; n < this.content.length; n++)
      if (!this.content[n].eq(e.content[n]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let n = this.content[e];
    if (!n)
      throw new RangeError("Index " + e + " out of range for " + this);
    return n;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let n = 0, r = 0; n < this.content.length; n++) {
      let s = this.content[n];
      e(s, r, n), r += s.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, n = 0) {
    return Oh(this, e, n);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, n = this.size, r = e.size) {
    return jh(this, e, n, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, n = -1) {
    if (e == 0)
      return Us(0, e);
    if (e == this.size)
      return Us(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, s = 0; ; r++) {
      let i = this.child(r), o = s + i.nodeSize;
      if (o >= e)
        return o == e || n > 0 ? Us(r + 1, o) : Us(r, s);
      s = o;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, n) {
    if (!n)
      return H.empty;
    if (!Array.isArray(n))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new H(n.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return H.empty;
    let n, r = 0;
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      r += i.nodeSize, s && i.isText && e[s - 1].sameMarkup(i) ? (n || (n = e.slice(0, s)), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
    }
    return new H(n || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return H.empty;
    if (e instanceof H)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new H([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
H.empty = new H([], 0);
const ll = { index: 0, offset: 0 };
function Us(t, e) {
  return ll.index = t, ll.offset = e, ll;
}
function Ql(t, e) {
  if (t === e)
    return !0;
  if (!(t && typeof t == "object") || !(e && typeof e == "object"))
    return !1;
  let n = Array.isArray(t);
  if (Array.isArray(e) != n)
    return !1;
  if (n) {
    if (t.length != e.length)
      return !1;
    for (let r = 0; r < t.length; r++)
      if (!Ql(t[r], e[r]))
        return !1;
  } else {
    for (let r in t)
      if (!(r in e) || !Ql(t[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in t))
        return !1;
  }
  return !0;
}
let kt = class Zl {
  /**
  @internal
  */
  constructor(e, n) {
    this.type = e, this.attrs = n;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let n, r = !1;
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (this.eq(i))
        return e;
      if (this.type.excludes(i.type))
        n || (n = e.slice(0, s));
      else {
        if (i.type.excludes(this.type))
          return e;
        !r && i.type.rank > this.type.rank && (n || (n = e.slice(0, s)), n.push(this), r = !0), n && n.push(i);
      }
    }
    return n || (n = e.slice()), r || n.push(this), n;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let n = 0; n < e.length; n++)
      if (this.eq(e[n]))
        return e.slice(0, n).concat(e.slice(n + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let n = 0; n < e.length; n++)
      if (this.eq(e[n]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && Ql(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let n in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, n) {
    if (!n)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[n.type];
    if (!r)
      throw new RangeError(`There is no mark type ${n.type} in this schema`);
    return r.create(n.attrs);
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, n) {
    if (e == n)
      return !0;
    if (e.length != n.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(n[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return Zl.none;
    if (e instanceof Zl)
      return [e];
    let n = e.slice();
    return n.sort((r, s) => r.type.rank - s.type.rank), n;
  }
};
kt.none = [];
class Cy extends Error {
}
class U {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, n, r) {
    this.content = e, this.openStart = n, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, n) {
    let r = Ph(this.content, e + this.openStart, n);
    return r && new U(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, n) {
    return new U(Rh(this.content, e + this.openStart, n + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, n) {
    if (!n)
      return U.empty;
    let r = n.openStart || 0, s = n.openEnd || 0;
    if (typeof r != "number" || typeof s != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new U(H.fromJSON(e, n.content), r, s);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, n = !0) {
    let r = 0, s = 0;
    for (let i = e.firstChild; i && !i.isLeaf && (n || !i.type.spec.isolating); i = i.firstChild)
      r++;
    for (let i = e.lastChild; i && !i.isLeaf && (n || !i.type.spec.isolating); i = i.lastChild)
      s++;
    return new U(e, r, s);
  }
}
U.empty = new U(H.empty, 0, 0);
function Rh(t, e, n) {
  let { index: r, offset: s } = t.findIndex(e), i = t.maybeChild(r), { index: o, offset: l } = t.findIndex(n);
  if (s == e || i.isText) {
    if (l != n && !t.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return t.cut(0, e).append(t.cut(n));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return t.replaceChild(r, i.copy(Rh(i.content, e - s - 1, n - s - 1)));
}
function Ph(t, e, n, r) {
  let { index: s, offset: i } = t.findIndex(e), o = t.maybeChild(s);
  if (i == e || o.isText)
    return r && !r.canReplace(s, s, n) ? null : t.cut(0, e).append(n).append(t.cut(e));
  let l = Ph(o.content, e - i - 1, n);
  return l && t.replaceChild(s, o.copy(l));
}
class ea {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, n, r) {
    this.$from = e, this.$to = n, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
function Ey(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t) {
    let r = t[n];
    if (!r.hasDefault)
      return null;
    e[n] = r.default;
  }
  return e;
}
function My(t, e) {
  let n = /* @__PURE__ */ Object.create(null);
  for (let r in t) {
    let s = e && e[r];
    if (s === void 0) {
      let i = t[r];
      if (i.hasDefault)
        s = i.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    n[r] = s;
  }
  return n;
}
function Ay(t) {
  let e = /* @__PURE__ */ Object.create(null);
  if (t)
    for (let n in t)
      e[n] = new Ty(t[n]);
  return e;
}
class Ty {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class uc {
  /**
  @internal
  */
  constructor(e, n, r, s) {
    this.name = e, this.rank = n, this.schema = r, this.spec = s, this.attrs = Ay(s.attrs), this.excluded = null;
    let i = Ey(this.attrs);
    this.instance = i ? new kt(this, i) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new kt(this, My(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, n) {
    let r = /* @__PURE__ */ Object.create(null), s = 0;
    return e.forEach((i, o) => r[i] = new uc(i, s++, n, o)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var n = 0; n < e.length; n++)
      e[n].type == this && (e = e.slice(0, n).concat(e.slice(n + 1)), n--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let n = 0; n < e.length; n++)
      if (e[n].type == this)
        return e[n];
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let Ih = class ta {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, n) {
    this.schema = e, this.rules = n, this.tags = [], this.styles = [], n.forEach((r) => {
      r.tag ? this.tags.push(r) : r.style && this.styles.push(r);
    }), this.normalizeLists = !this.tags.some((r) => {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node)
        return !1;
      let s = e.nodes[r.node];
      return s.contentMatch.matchType(s);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, n = {}) {
    let r = new Xu(this, n, !1);
    return r.addAll(e, n.from, n.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, n = {}) {
    let r = new Xu(this, n, !0);
    return r.addAll(e, n.from, n.to), U.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, n, r) {
    for (let s = r ? this.tags.indexOf(r) + 1 : 0; s < this.tags.length; s++) {
      let i = this.tags[s];
      if (Ry(e, i.tag) && (i.namespace === void 0 || e.namespaceURI == i.namespace) && (!i.context || n.matchesContext(i.context))) {
        if (i.getAttrs) {
          let o = i.getAttrs(e);
          if (o === !1)
            continue;
          i.attrs = o || void 0;
        }
        return i;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, n, r, s) {
    for (let i = s ? this.styles.indexOf(s) + 1 : 0; i < this.styles.length; i++) {
      let o = this.styles[i], l = o.style;
      if (!(l.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != n))) {
        if (o.getAttrs) {
          let a = o.getAttrs(n);
          if (a === !1)
            continue;
          o.attrs = a || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let n = [];
    function r(s) {
      let i = s.priority == null ? 50 : s.priority, o = 0;
      for (; o < n.length; o++) {
        let l = n[o];
        if ((l.priority == null ? 50 : l.priority) < i)
          break;
      }
      n.splice(o, 0, s);
    }
    for (let s in e.marks) {
      let i = e.marks[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Qu(o)), o.mark || o.ignore || o.clearMark || (o.mark = s);
      });
    }
    for (let s in e.nodes) {
      let i = e.nodes[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Qu(o)), o.node || o.ignore || o.mark || (o.node = s);
      });
    }
    return n;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.ParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new ta(e, ta.schemaRules(e)));
  }
};
const Lh = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, Oy = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Nh = { ol: !0, ul: !0 }, Mi = 1, Ai = 2, ds = 4;
function Yu(t, e, n) {
  return e != null ? (e ? Mi : 0) | (e === "full" ? Ai : 0) : t && t.whitespace == "pre" ? Mi | Ai : n & ~ds;
}
class qs {
  constructor(e, n, r, s, i, o, l) {
    this.type = e, this.attrs = n, this.marks = r, this.pendingMarks = s, this.solid = i, this.options = l, this.content = [], this.activeMarks = kt.none, this.stashMarks = [], this.match = o || (l & ds ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let n = this.type.contentMatch.fillBefore(H.from(e));
      if (n)
        this.match = this.type.contentMatch.matchFragment(n);
      else {
        let r = this.type.contentMatch, s;
        return (s = r.findWrapping(e.type)) ? (this.match = r, s) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Mi)) {
      let r = this.content[this.content.length - 1], s;
      if (r && r.isText && (s = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let i = r;
        r.text.length == s[0].length ? this.content.pop() : this.content[this.content.length - 1] = i.withText(i.text.slice(0, i.text.length - s[0].length));
      }
    }
    let n = H.from(this.content);
    return !e && this.match && (n = n.append(this.match.fillBefore(H.empty, !0))), this.type ? this.type.create(this.attrs, n, this.marks) : n;
  }
  popFromStashMark(e) {
    for (let n = this.stashMarks.length - 1; n >= 0; n--)
      if (e.eq(this.stashMarks[n]))
        return this.stashMarks.splice(n, 1)[0];
  }
  applyPending(e) {
    for (let n = 0, r = this.pendingMarks; n < r.length; n++) {
      let s = r[n];
      (this.type ? this.type.allowsMarkType(s.type) : Iy(s.type, e)) && !s.isInSet(this.activeMarks) && (this.activeMarks = s.addToSet(this.activeMarks), this.pendingMarks = s.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Lh.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Xu {
  constructor(e, n, r) {
    this.parser = e, this.options = n, this.isOpen = r, this.open = 0;
    let s = n.topNode, i, o = Yu(null, n.preserveWhitespace, 0) | (r ? ds : 0);
    s ? i = new qs(s.type, s.attrs, kt.none, kt.none, !0, n.topMatch || s.type.contentMatch, o) : r ? i = new qs(null, null, kt.none, kt.none, !0, null, o) : i = new qs(e.schema.topNodeType, null, kt.none, kt.none, !0, null, o), this.nodes = [i], this.find = n.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e) {
    e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
  }
  withStyleRules(e, n) {
    let r = e.getAttribute("style");
    if (!r)
      return n();
    let s = this.readStyles(Py(r));
    if (!s)
      return;
    let [i, o] = s, l = this.top;
    for (let a = 0; a < o.length; a++)
      this.removePendingMark(o[a], l);
    for (let a = 0; a < i.length; a++)
      this.addPendingMark(i[a]);
    n();
    for (let a = 0; a < i.length; a++)
      this.removePendingMark(i[a], l);
    for (let a = 0; a < o.length; a++)
      this.addPendingMark(o[a]);
  }
  addTextNode(e) {
    let n = e.nodeValue, r = this.top;
    if (r.options & Ai || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (r.options & Mi)
        r.options & Ai ? n = n.replace(/\r\n?/g, `
`) : n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let s = r.content[r.content.length - 1], i = e.previousSibling;
        (!s || i && i.nodeName == "BR" || s.isText && /[ \t\r\n\u000c]$/.test(s.text)) && (n = n.slice(1));
      }
      n && this.insertNode(this.parser.schema.text(n)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, n) {
    let r = e.nodeName.toLowerCase(), s;
    Nh.hasOwnProperty(r) && this.parser.normalizeLists && jy(e);
    let i = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, n));
    if (i ? i.ignore : Oy.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!i || i.skip || i.closeParent) {
      i && i.closeParent ? this.open = Math.max(0, this.open - 1) : i && i.skip.nodeType && (e = i.skip);
      let o, l = this.top, a = this.needsBlock;
      if (Lh.hasOwnProperty(r))
        l.content.length && l.content[0].isInline && this.open && (this.open--, l = this.top), o = !0, l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), o && this.sync(l), this.needsBlock = a;
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, i, i.consuming === !1 ? s : void 0);
      });
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`));
  }
  // Called for ignored nodes
  ignoreFallback(e) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"));
  }
  // Run any style parser associated with the node's styles. Either
  // return an array of marks, or null to indicate some of the styles
  // had a rule with `ignore` set.
  readStyles(e) {
    let n = kt.none, r = kt.none;
    for (let s = 0; s < e.length; s += 2)
      for (let i = void 0; ; ) {
        let o = this.parser.matchStyle(e[s], e[s + 1], this, i);
        if (!o)
          break;
        if (o.ignore)
          return null;
        if (o.clearMark ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
          o.clearMark(l) && (r = l.addToSet(r));
        }) : n = this.parser.schema.marks[o.mark].create(o.attrs).addToSet(n), o.consuming === !1)
          i = o;
        else
          break;
      }
    return [n, r];
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, n, r) {
    let s, i, o;
    n.node ? (i = this.parser.schema.nodes[n.node], i.isLeaf ? this.insertNode(i.create(n.attrs)) || this.leafFallback(e) : s = this.enter(i, n.attrs || null, n.preserveWhitespace)) : (o = this.parser.schema.marks[n.mark].create(n.attrs), this.addPendingMark(o));
    let l = this.top;
    if (i && i.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (n.getContent)
      this.findInside(e), n.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof n.contentElement == "string" ? a = e.querySelector(n.contentElement) : typeof n.contentElement == "function" ? a = n.contentElement(e) : n.contentElement && (a = n.contentElement), this.findAround(e, a, !0), this.addAll(a);
    }
    s && this.sync(l) && this.open--, o && this.removePendingMark(o, l);
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, n, r) {
    let s = n || 0;
    for (let i = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; i != o; i = i.nextSibling, ++s)
      this.findAtPoint(e, s), this.addDOM(i);
    this.findAtPoint(e, s);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e) {
    let n, r;
    for (let s = this.open; s >= 0; s--) {
      let i = this.nodes[s], o = i.findWrapping(e);
      if (o && (!n || n.length > o.length) && (n = o, r = i, !o.length) || i.solid)
        break;
    }
    if (!n)
      return !1;
    this.sync(r);
    for (let s = 0; s < n.length; s++)
      this.enterInner(n[s], null, !1);
    return !0;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let n = this.textblockFromContext();
      n && this.enterInner(n);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let n = this.top;
      n.applyPending(e.type), n.match && (n.match = n.match.matchType(e.type));
      let r = n.activeMarks;
      for (let s = 0; s < e.marks.length; s++)
        (!n.type || n.type.allowsMarkType(e.marks[s].type)) && (r = e.marks[s].addToSet(r));
      return n.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, n, r) {
    let s = this.findPlace(e.create(n));
    return s && this.enterInner(e, n, !0, r), s;
  }
  // Open a node of the given type
  enterInner(e, n = null, r = !1, s) {
    this.closeExtra();
    let i = this.top;
    i.applyPending(e), i.match = i.match && i.match.matchType(e);
    let o = Yu(e, s, i.options);
    i.options & ds && i.content.length == 0 && (o |= ds), this.nodes.push(new qs(e, n, i.activeMarks, i.pendingMarks, r, null, o)), this.open++;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let n = this.nodes.length - 1;
    if (n > this.open) {
      for (; n > this.open; n--)
        this.nodes[n - 1].content.push(this.nodes[n].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen);
  }
  sync(e) {
    for (let n = this.open; n >= 0; n--)
      if (this.nodes[n] == e)
        return this.open = n, !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let n = this.open; n >= 0; n--) {
      let r = this.nodes[n].content;
      for (let s = r.length - 1; s >= 0; s--)
        e += r[s].nodeSize;
      n && e++;
    }
    return e;
  }
  findAtPoint(e, n) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == n && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let n = 0; n < this.find.length; n++)
        this.find[n].pos == null && e.nodeType == 1 && e.contains(this.find[n].node) && (this.find[n].pos = this.currentPos);
  }
  findAround(e, n, r) {
    if (e != n && this.find)
      for (let s = 0; s < this.find.length; s++)
        this.find[s].pos == null && e.nodeType == 1 && e.contains(this.find[s].node) && n.compareDocumentPosition(this.find[s].node) & (r ? 2 : 4) && (this.find[s].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let n = 0; n < this.find.length; n++)
        this.find[n].node == e && (this.find[n].pos = this.currentPos - (e.nodeValue.length - this.find[n].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let n = e.split("/"), r = this.options.context, s = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), i = -(r ? r.depth + 1 : 0) + (s ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = n[l];
        if (c == "") {
          if (l == n.length - 1 || l == 0)
            continue;
          for (; a >= i; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let u = a > 0 || a == 0 && s ? this.nodes[a].type : r && a >= i ? r.node(a - i).type : null;
          if (!u || u.name != c && u.groups.indexOf(c) == -1)
            return !1;
          a--;
        }
      }
      return !0;
    };
    return o(n.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let n = e.depth; n >= 0; n--) {
        let r = e.node(n).contentMatchAt(e.indexAfter(n)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let n in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[n];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
  addPendingMark(e) {
    let n = Ly(e, this.top.pendingMarks);
    n && this.top.stashMarks.push(n), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, n) {
    for (let r = this.open; r >= 0; r--) {
      let s = this.nodes[r];
      if (s.pendingMarks.lastIndexOf(e) > -1)
        s.pendingMarks = e.removeFromSet(s.pendingMarks);
      else {
        s.activeMarks = e.removeFromSet(s.activeMarks);
        let o = s.popFromStashMark(e);
        o && s.type && s.type.allowsMarkType(o.type) && (s.activeMarks = o.addToSet(s.activeMarks));
      }
      if (s == n)
        break;
    }
  }
}
function jy(t) {
  for (let e = t.firstChild, n = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Nh.hasOwnProperty(r) && n ? (n.appendChild(e), e = n) : r == "li" ? n = e : r && (n = null);
  }
}
function Ry(t, e) {
  return (t.matches || t.msMatchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector).call(t, e);
}
function Py(t) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, n, r = [];
  for (; n = e.exec(t); )
    r.push(n[1], n[2].trim());
  return r;
}
function Qu(t) {
  let e = {};
  for (let n in t)
    e[n] = t[n];
  return e;
}
function Iy(t, e) {
  let n = e.schema.nodes;
  for (let r in n) {
    let s = n[r];
    if (!s.allowsMarkType(t))
      continue;
    let i = [], o = (l) => {
      i.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: u } = l.edge(a);
        if (c == e || i.indexOf(u) < 0 && o(u))
          return !0;
      }
    };
    if (o(s.contentMatch))
      return !0;
  }
}
function Ly(t, e) {
  for (let n = 0; n < e.length; n++)
    if (t.eq(e[n]))
      return e[n];
}
class nr {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, n) {
    this.nodes = e, this.marks = n;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, n = {}, r) {
    r || (r = al(n).createDocumentFragment());
    let s = r, i = [];
    return e.forEach((o) => {
      if (i.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < i.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(i[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < i.length; )
          s = i.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], u = this.serializeMark(c, o.isInline, n);
          u && (i.push([c, s]), s.appendChild(u.dom), s = u.contentDOM || u.dom);
        }
      }
      s.appendChild(this.serializeNodeInner(o, n));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, n) {
    let { dom: r, contentDOM: s } = nr.renderSpec(al(n), this.nodes[e.type.name](e));
    if (s) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, n, s);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, n = {}) {
    let r = this.serializeNodeInner(e, n);
    for (let s = e.marks.length - 1; s >= 0; s--) {
      let i = this.serializeMark(e.marks[s], e.isInline, n);
      i && ((i.contentDOM || i.dom).appendChild(r), r = i.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, n, r = {}) {
    let s = this.marks[e.type.name];
    return s && nr.renderSpec(al(r), s(e, n));
  }
  /**
  Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
  the spec has a hole (zero) in it, `contentDOM` will point at the
  node with the hole.
  */
  static renderSpec(e, n, r = null) {
    if (typeof n == "string")
      return { dom: e.createTextNode(n) };
    if (n.nodeType != null)
      return { dom: n };
    if (n.dom && n.dom.nodeType != null)
      return n;
    let s = n[0], i = s.indexOf(" ");
    i > 0 && (r = s.slice(0, i), s = s.slice(i + 1));
    let o, l = r ? e.createElementNS(r, s) : e.createElement(s), a = n[1], c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let u in a)
        if (a[u] != null) {
          let f = u.indexOf(" ");
          f > 0 ? l.setAttributeNS(u.slice(0, f), u.slice(f + 1), a[u]) : l.setAttribute(u, a[u]);
        }
    }
    for (let u = c; u < n.length; u++) {
      let f = n[u];
      if (f === 0) {
        if (u < n.length - 1 || u > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: h, contentDOM: m } = nr.renderSpec(e, f, r);
        if (l.appendChild(h), m) {
          if (o)
            throw new RangeError("Multiple content holes");
          o = m;
        }
      }
    }
    return { dom: l, contentDOM: o };
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new nr(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let n = Zu(e.nodes);
    return n.text || (n.text = (r) => r.text), n;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Zu(e.marks);
  }
}
function Zu(t) {
  let e = {};
  for (let n in t) {
    let r = t[n].spec.toDOM;
    r && (e[n] = r);
  }
  return e;
}
function al(t) {
  return t.document || window.document;
}
const zh = 65535, $h = Math.pow(2, 16);
function Ny(t, e) {
  return t + e * $h;
}
function ed(t) {
  return t & zh;
}
function zy(t) {
  return (t - (t & zh)) / $h;
}
const Dh = 1, Bh = 2, di = 4, Hh = 8;
class na {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.pos = e, this.delInfo = n, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Hh) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Dh | di)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Bh | di)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & di) > 0;
  }
}
class _t {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, n = !1) {
    if (this.ranges = e, this.inverted = n, !e.length && _t.empty)
      return _t.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let n = 0, r = ed(e);
    if (!this.inverted)
      for (let s = 0; s < r; s++)
        n += this.ranges[s * 3 + 2] - this.ranges[s * 3 + 1];
    return this.ranges[r * 3] + n + zy(e);
  }
  mapResult(e, n = 1) {
    return this._map(e, n, !1);
  }
  map(e, n = 1) {
    return this._map(e, n, !0);
  }
  /**
  @internal
  */
  _map(e, n, r) {
    let s = 0, i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? s : 0);
      if (a > e)
        break;
      let c = this.ranges[l + i], u = this.ranges[l + o], f = a + c;
      if (e <= f) {
        let h = c ? e == a ? -1 : e == f ? 1 : n : n, m = a + s + (h < 0 ? 0 : u);
        if (r)
          return m;
        let y = e == (n < 0 ? a : f) ? null : Ny(l / 3, e - a), b = e == a ? Bh : e == f ? Dh : di;
        return (n < 0 ? e != a : e != f) && (b |= Hh), new na(m, b, y);
      }
      s += u - c;
    }
    return r ? e + s : new na(e + s, 0, null);
  }
  /**
  @internal
  */
  touches(e, n) {
    let r = 0, s = ed(n), i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + i], u = a + c;
      if (e <= u && l == s * 3)
        return !0;
      r += this.ranges[l + o] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let n = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let s = 0, i = 0; s < this.ranges.length; s += 3) {
      let o = this.ranges[s], l = o - (this.inverted ? i : 0), a = o + (this.inverted ? 0 : i), c = this.ranges[s + n], u = this.ranges[s + r];
      e(l, l + c, a, a + u), i += u - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new _t(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? _t.empty : new _t(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
_t.empty = new _t([]);
class Rr {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e = [], n, r = 0, s = e.length) {
    this.maps = e, this.mirror = n, this.from = r, this.to = s;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, n = this.maps.length) {
    return new Rr(this.maps, this.mirror, e, n);
  }
  /**
  @internal
  */
  copy() {
    return new Rr(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, n) {
    this.to = this.maps.push(e), n != null && this.setMirror(this.maps.length - 1, n);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let n = 0, r = this.maps.length; n < e.maps.length; n++) {
      let s = e.getMirror(n);
      this.appendMap(e.maps[n], s != null && s < n ? r + s : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let n = 0; n < this.mirror.length; n++)
        if (this.mirror[n] == e)
          return this.mirror[n + (n % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, n) {
    this.mirror || (this.mirror = []), this.mirror.push(e, n);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let n = e.maps.length - 1, r = this.maps.length + e.maps.length; n >= 0; n--) {
      let s = e.getMirror(n);
      this.appendMap(e.maps[n].invert(), s != null && s > n ? r - s - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new Rr();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, n = 1) {
    if (this.mirror)
      return this._map(e, n, !0);
    for (let r = this.from; r < this.to; r++)
      e = this.maps[r].map(e, n);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, n = 1) {
    return this._map(e, n, !1);
  }
  /**
  @internal
  */
  _map(e, n, r) {
    let s = 0;
    for (let i = this.from; i < this.to; i++) {
      let o = this.maps[i], l = o.mapResult(e, n);
      if (l.recover != null) {
        let a = this.getMirror(i);
        if (a != null && a > i && a < this.to) {
          i = a, e = this.maps[a].recover(l.recover);
          continue;
        }
      }
      s |= l.delInfo, e = l.pos;
    }
    return r ? e : new na(e, s, null);
  }
}
const cl = /* @__PURE__ */ Object.create(null);
class ut {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return _t.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, n) {
    if (!n || !n.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = cl[n.stepType];
    if (!r)
      throw new RangeError(`No step type ${n.stepType} defined`);
    return r.fromJSON(e, n);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, n) {
    if (e in cl)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return cl[e] = n, n.prototype.jsonID = e, n;
  }
}
class ze {
  /**
  @internal
  */
  constructor(e, n) {
    this.doc = e, this.failed = n;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new ze(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new ze(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, n, r, s) {
    try {
      return ze.ok(e.replace(n, r, s));
    } catch (i) {
      if (i instanceof Cy)
        return ze.fail(i.message);
      throw i;
    }
  }
}
function dc(t, e, n) {
  let r = [];
  for (let s = 0; s < t.childCount; s++) {
    let i = t.child(s);
    i.content.size && (i = i.copy(dc(i.content, e, i))), i.isInline && (i = e(i, n, s)), r.push(i);
  }
  return H.fromArray(r);
}
class On extends ut {
  /**
  Create a mark step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = e.resolve(this.from), s = r.node(r.sharedDepth(this.to)), i = new U(dc(n.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), s), n.openStart, n.openEnd);
    return ze.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new en(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new On(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof On && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new On(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new On(n.from, n.to, e.markFromJSON(n.mark));
  }
}
ut.jsonID("addMark", On);
class en extends ut {
  /**
  Create a mark-removing step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = new U(dc(n.content, (s) => s.mark(this.mark.removeFromSet(s.marks)), e), n.openStart, n.openEnd);
    return ze.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new On(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new en(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof en && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new en(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new en(n.from, n.to, e.markFromJSON(n.mark));
  }
}
ut.jsonID("removeMark", en);
class jn extends ut {
  /**
  Create a node mark step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return ze.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.addToSet(n.marks));
    return ze.fromReplace(e, this.pos, this.pos + 1, new U(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    if (n) {
      let r = this.mark.addToSet(n.marks);
      if (r.length == n.marks.length) {
        for (let s = 0; s < n.marks.length; s++)
          if (!n.marks[s].isInSet(r))
            return new jn(this.pos, n.marks[s]);
        return new jn(this.pos, this.mark);
      }
    }
    return new zr(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new jn(n.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new jn(n.pos, e.markFromJSON(n.mark));
  }
}
ut.jsonID("addNodeMark", jn);
class zr extends ut {
  /**
  Create a mark-removing step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return ze.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.removeFromSet(n.marks));
    return ze.fromReplace(e, this.pos, this.pos + 1, new U(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    return !n || !this.mark.isInSet(n.marks) ? this : new jn(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new zr(n.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new zr(n.pos, e.markFromJSON(n.mark));
  }
}
ut.jsonID("removeNodeMark", zr);
class qe extends ut {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, n, r, s = !1) {
    super(), this.from = e, this.to = n, this.slice = r, this.structure = s;
  }
  apply(e) {
    return this.structure && ra(e, this.from, this.to) ? ze.fail("Structure replace would overwrite content") : ze.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new _t([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new qe(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deletedAcross && r.deletedAcross ? null : new qe(n.pos, Math.max(n.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof qe) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let n = this.slice.size + e.slice.size == 0 ? U.empty : new U(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new qe(this.from, this.to + (e.to - e.from), n, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let n = this.slice.size + e.slice.size == 0 ? U.empty : new U(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new qe(e.from, this.to, n, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new qe(n.from, n.to, U.fromJSON(e, n.slice), !!n.structure);
  }
}
ut.jsonID("replace", qe);
class Je extends ut {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, n, r, s, i, o, l = !1) {
    super(), this.from = e, this.to = n, this.gapFrom = r, this.gapTo = s, this.slice = i, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (ra(e, this.from, this.gapFrom) || ra(e, this.gapTo, this.to)))
      return ze.fail("Structure gap-replace would overwrite content");
    let n = e.slice(this.gapFrom, this.gapTo);
    if (n.openStart || n.openEnd)
      return ze.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, n.content);
    return r ? ze.fromReplace(e, this.from, this.to, r) : ze.fail("Content does not fit in gap");
  }
  getMap() {
    return new _t([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let n = this.gapTo - this.gapFrom;
    return new Je(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), s = e.map(this.gapFrom, -1), i = e.map(this.gapTo, 1);
    return n.deletedAcross && r.deletedAcross || s < n.pos || i > r.pos ? null : new Je(n.pos, r.pos, s, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new Je(n.from, n.to, n.gapFrom, n.gapTo, U.fromJSON(e, n.slice), n.insert, !!n.structure);
  }
}
ut.jsonID("replaceAround", Je);
function ra(t, e, n) {
  let r = t.resolve(e), s = n - e, i = r.depth;
  for (; s > 0 && i > 0 && r.indexAfter(i) == r.node(i).childCount; )
    i--, s--;
  if (s > 0) {
    let o = r.node(i).maybeChild(r.indexAfter(i));
    for (; s > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, s--;
    }
  }
  return !1;
}
function $y(t, e, n, r) {
  let s = [], i = [], o, l;
  t.doc.nodesBetween(e, n, (a, c, u) => {
    if (!a.isInline)
      return;
    let f = a.marks;
    if (!r.isInSet(f) && u.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), m = Math.min(c + a.nodeSize, n), y = r.addToSet(f);
      for (let b = 0; b < f.length; b++)
        f[b].isInSet(y) || (o && o.to == h && o.mark.eq(f[b]) ? o.to = m : s.push(o = new en(h, m, f[b])));
      l && l.to == h ? l.to = m : i.push(l = new On(h, m, r));
    }
  }), s.forEach((a) => t.step(a)), i.forEach((a) => t.step(a));
}
function Dy(t, e, n, r) {
  let s = [], i = 0;
  t.doc.nodesBetween(e, n, (o, l) => {
    if (!o.isInline)
      return;
    i++;
    let a = null;
    if (r instanceof uc) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (a || (a = [])).push(u), c = u.removeFromSet(c);
    } else
      r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, n);
      for (let u = 0; u < a.length; u++) {
        let f = a[u], h;
        for (let m = 0; m < s.length; m++) {
          let y = s[m];
          y.step == i - 1 && f.eq(s[m].style) && (h = y);
        }
        h ? (h.to = c, h.step = i) : s.push({ style: f, from: Math.max(l, e), to: c, step: i });
      }
    }
  }), s.forEach((o) => t.step(new en(o.from, o.to, o.style)));
}
function By(t, e, n, r = n.contentMatch) {
  let s = t.doc.nodeAt(e), i = [], o = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let a = s.child(l), c = o + a.nodeSize, u = r.matchType(a.type);
    if (!u)
      i.push(new qe(o, c, U.empty));
    else {
      r = u;
      for (let f = 0; f < a.marks.length; f++)
        n.allowsMarkType(a.marks[f].type) || t.step(new en(o, c, a.marks[f]));
      if (a.isText && !n.spec.code) {
        let f, h = /\r?\n|\r/g, m;
        for (; f = h.exec(a.text); )
          m || (m = new U(H.from(n.schema.text(" ", n.allowedMarks(a.marks))), 0, 0)), i.push(new qe(o + f.index, o + f.index + f[0].length, m));
      }
    }
    o = c;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(H.empty, !0);
    t.replace(o, o, new U(l, 0, 0));
  }
  for (let l = i.length - 1; l >= 0; l--)
    t.step(i[l]);
}
function Hy(t, e, n) {
  return (e == 0 || t.canReplace(e, t.childCount)) && (n == t.childCount || t.canReplace(0, n));
}
function Vr(t) {
  let n = t.parent.content.cutByIndex(t.startIndex, t.endIndex);
  for (let r = t.depth; ; --r) {
    let s = t.$from.node(r), i = t.$from.index(r), o = t.$to.indexAfter(r);
    if (r < t.depth && s.canReplace(i, o, n))
      return r;
    if (r == 0 || s.type.spec.isolating || !Hy(s, i, o))
      break;
  }
  return null;
}
function Fy(t, e, n) {
  let { $from: r, $to: s, depth: i } = e, o = r.before(i + 1), l = s.after(i + 1), a = o, c = l, u = H.empty, f = 0;
  for (let y = i, b = !1; y > n; y--)
    b || r.index(y) > 0 ? (b = !0, u = H.from(r.node(y).copy(u)), f++) : a--;
  let h = H.empty, m = 0;
  for (let y = i, b = !1; y > n; y--)
    b || s.after(y + 1) < s.end(y) ? (b = !0, h = H.from(s.node(y).copy(h)), m++) : c++;
  t.step(new Je(a, c, o, l, new U(u.append(h), f, m), u.size - f, !0));
}
function fc(t, e, n = null, r = t) {
  let s = Wy(t, e), i = s && Vy(r, e);
  return i ? s.map(td).concat({ type: e, attrs: n }).concat(i.map(td)) : null;
}
function td(t) {
  return { type: t, attrs: null };
}
function Wy(t, e) {
  let { parent: n, startIndex: r, endIndex: s } = t, i = n.contentMatchAt(r).findWrapping(e);
  if (!i)
    return null;
  let o = i.length ? i[0] : e;
  return n.canReplaceWith(r, s, o) ? i : null;
}
function Vy(t, e) {
  let { parent: n, startIndex: r, endIndex: s } = t, i = n.child(r), o = e.contentMatch.findWrapping(i.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < s; c++)
    a = a.matchType(n.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function Ky(t, e, n) {
  let r = H.empty;
  for (let o = n.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = n[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = H.from(n[o].type.create(n[o].attrs, r));
  }
  let s = e.start, i = e.end;
  t.step(new Je(s, i, s, i, new U(r, 0, 0), n.length, !0));
}
function Uy(t, e, n, r, s) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let i = t.steps.length;
  t.doc.nodesBetween(e, n, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, s) && qy(t.doc, t.mapping.slice(i).map(l), r)) {
      t.clearIncompatible(t.mapping.slice(i).map(l, 1), r);
      let a = t.mapping.slice(i), c = a.map(l, 1), u = a.map(l + o.nodeSize, 1);
      return t.step(new Je(c, u, c + 1, u - 1, new U(H.from(r.create(s, null, o.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function qy(t, e, n) {
  let r = t.resolve(e), s = r.index();
  return r.parent.canReplaceWith(s, s + 1, n);
}
function Gy(t, e, n, r, s) {
  let i = t.doc.nodeAt(e);
  if (!i)
    throw new RangeError("No node at given position");
  n || (n = i.type);
  let o = n.create(r, null, s || i.marks);
  if (i.isLeaf)
    return t.replaceWith(e, e + i.nodeSize, o);
  if (!n.validContent(i.content))
    throw new RangeError("Invalid content for node type " + n.name);
  t.step(new Je(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new U(H.from(o), 0, 0), 1, !0));
}
function Pr(t, e, n = 1, r) {
  let s = t.resolve(e), i = s.depth - n, o = r && r[r.length - 1] || s.parent;
  if (i < 0 || s.parent.type.spec.isolating || !s.parent.canReplace(s.index(), s.parent.childCount) || !o.type.validContent(s.parent.content.cutByIndex(s.index(), s.parent.childCount)))
    return !1;
  for (let c = s.depth - 1, u = n - 2; c > i; c--, u--) {
    let f = s.node(c), h = s.index(c);
    if (f.type.spec.isolating)
      return !1;
    let m = f.content.cutByIndex(h, f.childCount), y = r && r[u + 1];
    y && (m = m.replaceChild(0, y.type.create(y.attrs)));
    let b = r && r[u] || f;
    if (!f.canReplace(h + 1, f.childCount) || !b.type.validContent(m))
      return !1;
  }
  let l = s.indexAfter(i), a = r && r[0];
  return s.node(i).canReplaceWith(l, l, a ? a.type : s.node(i + 1).type);
}
function Jy(t, e, n = 1, r) {
  let s = t.doc.resolve(e), i = H.empty, o = H.empty;
  for (let l = s.depth, a = s.depth - n, c = n - 1; l > a; l--, c--) {
    i = H.from(s.node(l).copy(i));
    let u = r && r[c];
    o = H.from(u ? u.type.create(u.attrs, o) : s.node(l).copy(o));
  }
  t.step(new qe(e, e, new U(i.append(o), n, n), !0));
}
function Wn(t, e) {
  let n = t.resolve(e), r = n.index();
  return Fh(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function Fh(t, e) {
  return !!(t && e && !t.isLeaf && t.canAppend(e));
}
function $o(t, e, n = -1) {
  let r = t.resolve(e);
  for (let s = r.depth; ; s--) {
    let i, o, l = r.index(s);
    if (s == r.depth ? (i = r.nodeBefore, o = r.nodeAfter) : n > 0 ? (i = r.node(s + 1), l++, o = r.node(s).maybeChild(l)) : (i = r.node(s).maybeChild(l - 1), o = r.node(s + 1)), i && !i.isTextblock && Fh(i, o) && r.node(s).canReplace(l, l + 1))
      return e;
    if (s == 0)
      break;
    e = n < 0 ? r.before(s) : r.after(s);
  }
}
function Yy(t, e, n) {
  let r = new qe(e - n, e + n, U.empty, !0);
  t.step(r);
}
function Xy(t, e, n) {
  let r = t.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), n))
    return e;
  if (r.parentOffset == 0)
    for (let s = r.depth - 1; s >= 0; s--) {
      let i = r.index(s);
      if (r.node(s).canReplaceWith(i, i, n))
        return r.before(s + 1);
      if (i > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let s = r.depth - 1; s >= 0; s--) {
      let i = r.indexAfter(s);
      if (r.node(s).canReplaceWith(i, i, n))
        return r.after(s + 1);
      if (i < r.node(s).childCount)
        return null;
    }
  return null;
}
function Wh(t, e, n) {
  let r = t.resolve(e);
  if (!n.content.size)
    return e;
  let s = n.content;
  for (let i = 0; i < n.openStart; i++)
    s = s.firstChild.content;
  for (let i = 1; i <= (n.openStart == 0 && n.size ? 2 : 1); i++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), u = !1;
      if (i == 1)
        u = c.canReplace(a, a, s);
      else {
        let f = c.contentMatchAt(a).findWrapping(s.firstChild.type);
        u = f && c.canReplaceWith(a, a, f[0]);
      }
      if (u)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function Do(t, e, n = e, r = U.empty) {
  if (e == n && !r.size)
    return null;
  let s = t.resolve(e), i = t.resolve(n);
  return Vh(s, i, r) ? new qe(e, n, r) : new Qy(s, i, r).fit();
}
function Vh(t, e, n) {
  return !n.openStart && !n.openEnd && t.start() == e.start() && t.parent.canReplace(t.index(), e.index(), n.content);
}
class Qy {
  constructor(e, n, r) {
    this.$from = e, this.$to = n, this.unplaced = r, this.frontier = [], this.placed = H.empty;
    for (let s = 0; s <= e.depth; s++) {
      let i = e.node(s);
      this.frontier.push({
        type: i.type,
        match: i.contentMatchAt(e.indexAfter(s))
      });
    }
    for (let s = e.depth; s > 0; s--)
      this.placed = H.from(e.node(s).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), n = this.placed.size - this.depth - this.$from.depth, r = this.$from, s = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!s)
      return null;
    let i = this.placed, o = r.depth, l = s.depth;
    for (; o && l && i.childCount == 1; )
      i = i.firstChild.content, o--, l--;
    let a = new U(i, o, l);
    return e > -1 ? new Je(r.pos, e, this.$to.pos, this.$to.end(), a, n) : a.size || r.pos != this.$to.pos ? new qe(r.pos, s.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let n = this.unplaced.content, r = 0, s = this.unplaced.openEnd; r < e; r++) {
      let i = n.firstChild;
      if (n.childCount > 1 && (s = 0), i.type.spec.isolating && s <= r) {
        e = r;
        break;
      }
      n = i.content;
    }
    for (let n = 1; n <= 2; n++)
      for (let r = n == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let s, i = null;
        r ? (i = ul(this.unplaced.content, r - 1).firstChild, s = i.content) : s = this.unplaced.content;
        let o = s.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], u, f = null;
          if (n == 1 && (o ? c.matchType(o.type) || (f = c.fillBefore(H.from(o), !1)) : i && a.compatibleContent(i.type)))
            return { sliceDepth: r, frontierDepth: l, parent: i, inject: f };
          if (n == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: i, wrap: u };
          if (i && c.matchType(i.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, s = ul(e, n);
    return !s.childCount || s.firstChild.isLeaf ? !1 : (this.unplaced = new U(e, n + 1, Math.max(r, s.size + n >= e.size - r ? n + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, s = ul(e, n);
    if (s.childCount <= 1 && n > 0) {
      let i = e.size - n <= n + s.size;
      this.unplaced = new U(es(e, n - 1, 1), n - 1, i ? n - 1 : r);
    } else
      this.unplaced = new U(es(e, n, 1), n, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: n, parent: r, inject: s, wrap: i }) {
    for (; this.depth > n; )
      this.closeFrontierNode();
    if (i)
      for (let b = 0; b < i.length; b++)
        this.openFrontierNode(i[b]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, u = [], { match: f, type: h } = this.frontier[n];
    if (s) {
      for (let b = 0; b < s.childCount; b++)
        u.push(s.child(b));
      f = f.matchFragment(s);
    }
    let m = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let b = l.child(c), x = f.matchType(b.type);
      if (!x)
        break;
      c++, (c > 1 || a == 0 || b.content.size) && (f = x, u.push(Kh(b.mark(h.allowedMarks(b.marks)), c == 1 ? a : 0, c == l.childCount ? m : -1)));
    }
    let y = c == l.childCount;
    y || (m = -1), this.placed = ts(this.placed, n, H.from(u)), this.frontier[n].match = f, y && m < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let b = 0, x = l; b < m; b++) {
      let C = x.lastChild;
      this.frontier.push({ type: C.type, match: C.contentMatchAt(C.childCount) }), x = C.content;
    }
    this.unplaced = y ? e == 0 ? U.empty : new U(es(o.content, e - 1, 1), e - 1, m < 0 ? o.openEnd : e - 1) : new U(es(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], n;
    if (!e.type.isTextblock || !dl(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (n = this.findCloseLevel(this.$to)) && n.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, s = this.$to.after(r);
    for (; r > 1 && s == this.$to.end(--r); )
      ++s;
    return s;
  }
  findCloseLevel(e) {
    e:
      for (let n = Math.min(this.depth, e.depth); n >= 0; n--) {
        let { match: r, type: s } = this.frontier[n], i = n < e.depth && e.end(n + 1) == e.pos + (e.depth - (n + 1)), o = dl(e, n, s, r, i);
        if (o) {
          for (let l = n - 1; l >= 0; l--) {
            let { match: a, type: c } = this.frontier[l], u = dl(e, l, c, a, !0);
            if (!u || u.childCount)
              continue e;
          }
          return { depth: n, fit: o, move: i ? e.doc.resolve(e.after(n + 1)) : e };
        }
      }
  }
  close(e) {
    let n = this.findCloseLevel(e);
    if (!n)
      return null;
    for (; this.depth > n.depth; )
      this.closeFrontierNode();
    n.fit.childCount && (this.placed = ts(this.placed, n.depth, n.fit)), e = n.move;
    for (let r = n.depth + 1; r <= e.depth; r++) {
      let s = e.node(r), i = s.type.contentMatch.fillBefore(s.content, !0, e.index(r));
      this.openFrontierNode(s.type, s.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, n = null, r) {
    let s = this.frontier[this.depth];
    s.match = s.match.matchType(e), this.placed = ts(this.placed, this.depth, H.from(e.create(n, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let n = this.frontier.pop().match.fillBefore(H.empty, !0);
    n.childCount && (this.placed = ts(this.placed, this.frontier.length, n));
  }
}
function es(t, e, n) {
  return e == 0 ? t.cutByIndex(n, t.childCount) : t.replaceChild(0, t.firstChild.copy(es(t.firstChild.content, e - 1, n)));
}
function ts(t, e, n) {
  return e == 0 ? t.append(n) : t.replaceChild(t.childCount - 1, t.lastChild.copy(ts(t.lastChild.content, e - 1, n)));
}
function ul(t, e) {
  for (let n = 0; n < e; n++)
    t = t.firstChild.content;
  return t;
}
function Kh(t, e, n) {
  if (e <= 0)
    return t;
  let r = t.content;
  return e > 1 && (r = r.replaceChild(0, Kh(r.firstChild, e - 1, r.childCount == 1 ? n - 1 : 0))), e > 0 && (r = t.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(t.type.contentMatch.matchFragment(r).fillBefore(H.empty, !0)))), t.copy(r);
}
function dl(t, e, n, r, s) {
  let i = t.node(e), o = s ? t.indexAfter(e) : t.index(e);
  if (o == i.childCount && !n.compatibleContent(i.type))
    return null;
  let l = r.fillBefore(i.content, !0, o);
  return l && !Zy(n, i.content, o) ? l : null;
}
function Zy(t, e, n) {
  for (let r = n; r < e.childCount; r++)
    if (!t.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function e2(t) {
  return t.spec.defining || t.spec.definingForContent;
}
function t2(t, e, n, r) {
  if (!r.size)
    return t.deleteRange(e, n);
  let s = t.doc.resolve(e), i = t.doc.resolve(n);
  if (Vh(s, i, r))
    return t.step(new qe(e, n, r));
  let o = qh(s, t.doc.resolve(n));
  o[o.length - 1] == 0 && o.pop();
  let l = -(s.depth + 1);
  o.unshift(l);
  for (let h = s.depth, m = s.pos - 1; h > 0; h--, m--) {
    let y = s.node(h).type.spec;
    if (y.defining || y.definingAsContext || y.isolating)
      break;
    o.indexOf(h) > -1 ? l = h : s.before(h) == m && o.splice(1, 0, -h);
  }
  let a = o.indexOf(l), c = [], u = r.openStart;
  for (let h = r.content, m = 0; ; m++) {
    let y = h.firstChild;
    if (c.push(y), m == r.openStart)
      break;
    h = y.content;
  }
  for (let h = u - 1; h >= 0; h--) {
    let m = c[h], y = e2(m.type);
    if (y && !m.sameMarkup(s.node(Math.abs(l) - 1)))
      u = h;
    else if (y || !m.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let m = (h + u + 1) % (r.openStart + 1), y = c[m];
    if (y)
      for (let b = 0; b < o.length; b++) {
        let x = o[(b + a) % o.length], C = !0;
        x < 0 && (C = !1, x = -x);
        let T = s.node(x - 1), O = s.index(x - 1);
        if (T.canReplaceWith(O, O, y.type, y.marks))
          return t.replace(s.before(x), C ? i.after(x) : n, new U(Uh(r.content, 0, r.openStart, m), m, r.openEnd));
      }
  }
  let f = t.steps.length;
  for (let h = o.length - 1; h >= 0 && (t.replace(e, n, r), !(t.steps.length > f)); h--) {
    let m = o[h];
    m < 0 || (e = s.before(m), n = i.after(m));
  }
}
function Uh(t, e, n, r, s) {
  if (e < n) {
    let i = t.firstChild;
    t = t.replaceChild(0, i.copy(Uh(i.content, e + 1, n, r, i)));
  }
  if (e > r) {
    let i = s.contentMatchAt(0), o = i.fillBefore(t).append(t);
    t = o.append(i.matchFragment(o).fillBefore(H.empty, !0));
  }
  return t;
}
function n2(t, e, n, r) {
  if (!r.isInline && e == n && t.doc.resolve(e).parent.content.size) {
    let s = Xy(t.doc, e, r.type);
    s != null && (e = n = s);
  }
  t.replaceRange(e, n, new U(H.from(r), 0, 0));
}
function r2(t, e, n) {
  let r = t.doc.resolve(e), s = t.doc.resolve(n), i = qh(r, s);
  for (let o = 0; o < i.length; o++) {
    let l = i[o], a = o == i.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return t.delete(r.start(l), s.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), s.indexAfter(l - 1))))
      return t.delete(r.before(l), s.after(l));
  }
  for (let o = 1; o <= r.depth && o <= s.depth; o++)
    if (e - r.start(o) == r.depth - o && n > r.end(o) && s.end(o) - n != s.depth - o)
      return t.delete(r.before(o), n);
  t.delete(e, n);
}
function qh(t, e) {
  let n = [], r = Math.min(t.depth, e.depth);
  for (let s = r; s >= 0; s--) {
    let i = t.start(s);
    if (i < t.pos - (t.depth - s) || e.end(s) > e.pos + (e.depth - s) || t.node(s).type.spec.isolating || e.node(s).type.spec.isolating)
      break;
    (i == e.start(s) || s == t.depth && s == e.depth && t.parent.inlineContent && e.parent.inlineContent && s && e.start(s - 1) == i - 1) && n.push(s);
  }
  return n;
}
class Ir extends ut {
  /**
  Construct an attribute step.
  */
  constructor(e, n, r) {
    super(), this.pos = e, this.attr = n, this.value = r;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return ze.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in n.attrs)
      r[i] = n.attrs[i];
    r[this.attr] = this.value;
    let s = n.type.create(r, null, n.marks);
    return ze.fromReplace(e, this.pos, this.pos + 1, new U(H.from(s), 0, n.isLeaf ? 0 : 1));
  }
  getMap() {
    return _t.empty;
  }
  invert(e) {
    return new Ir(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Ir(n.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.pos != "number" || typeof n.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Ir(n.pos, n.attr, n.value);
  }
}
ut.jsonID("attr", Ir);
class ks extends ut {
  /**
  Construct an attribute step.
  */
  constructor(e, n) {
    super(), this.attr = e, this.value = n;
  }
  apply(e) {
    let n = /* @__PURE__ */ Object.create(null);
    for (let s in e.attrs)
      n[s] = e.attrs[s];
    n[this.attr] = this.value;
    let r = e.type.create(n, e.content, e.marks);
    return ze.ok(r);
  }
  getMap() {
    return _t.empty;
  }
  invert(e) {
    return new ks(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new ks(n.attr, n.value);
  }
}
ut.jsonID("docAttr", ks);
let $r = class extends Error {
};
$r = function t(e) {
  let n = Error.call(this, e);
  return n.__proto__ = t.prototype, n;
};
$r.prototype = Object.create(Error.prototype);
$r.prototype.constructor = $r;
$r.prototype.name = "TransformError";
class Gh {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Rr();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let n = this.maybeStep(e);
    if (n.failed)
      throw new $r(n.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let n = e.apply(this.doc);
    return n.failed || this.addStep(e, n.doc), n;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  @internal
  */
  addStep(e, n) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = n;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, n = e, r = U.empty) {
    let s = Do(this.doc, e, n, r);
    return s && this.step(s), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, n, r) {
    return this.replace(e, n, new U(H.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, n) {
    return this.replace(e, n, U.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, n) {
    return this.replaceWith(e, e, n);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, n, r) {
    return t2(this, e, n, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, n, r) {
    return n2(this, e, n, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, n) {
    return r2(this, e, n), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, n) {
    return Fy(this, e, n), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, n = 1) {
    return Yy(this, e, n), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, n) {
    return Ky(this, e, n), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, n = e, r, s = null) {
    return Uy(this, e, n, r, s), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, n, r = null, s) {
    return Gy(this, e, n, r, s), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, n, r) {
    return this.step(new Ir(e, n, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, n) {
    return this.step(new ks(e, n)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, n) {
    return this.step(new jn(e, n)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, n) {
    if (!(n instanceof kt)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (n = n.isInSet(r.marks), !n)
        return this;
    }
    return this.step(new zr(e, n)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, n = 1, r) {
    return Jy(this, e, n, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, n, r) {
    return $y(this, e, n, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, n, r) {
    return Dy(this, e, n, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, n, r) {
    return By(this, e, n, r), this;
  }
}
const fl = /* @__PURE__ */ Object.create(null);
class se {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, n, r) {
    this.$anchor = e, this.$head = n, this.ranges = r || [new Jh(e.min(n), e.max(n))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let n = 0; n < e.length; n++)
      if (e[n].$from.pos != e[n].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, n = U.empty) {
    let r = n.content.lastChild, s = null;
    for (let l = 0; l < n.openEnd; l++)
      s = r, r = r.lastChild;
    let i = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], u = e.mapping.slice(i);
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? U.empty : n), l == 0 && sd(e, i, (r ? r.isInline : s && s.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, n) {
    let r = e.steps.length, s = this.ranges;
    for (let i = 0; i < s.length; i++) {
      let { $from: o, $to: l } = s[i], a = e.mapping.slice(r), c = a.map(o.pos), u = a.map(l.pos);
      i ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, n), sd(e, r, n.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, n, r = !1) {
    let s = e.parent.inlineContent ? new ne(e) : wr(e.node(0), e.parent, e.pos, e.index(), n, r);
    if (s)
      return s;
    for (let i = e.depth - 1; i >= 0; i--) {
      let o = n < 0 ? wr(e.node(0), e.node(i), e.before(i + 1), e.index(i), n, r) : wr(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, n, r);
      if (o)
        return o;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, n = 1) {
    return this.findFrom(e, n) || this.findFrom(e, -n) || new Ht(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return wr(e, e, 0, 0, 1) || new Ht(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return wr(e, e, e.content.size, e.childCount, -1) || new Ht(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, n) {
    if (!n || !n.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = fl[n.type];
    if (!r)
      throw new RangeError(`No selection type ${n.type} defined`);
    return r.fromJSON(e, n);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, n) {
    if (e in fl)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return fl[e] = n, n.prototype.jsonID = e, n;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return ne.between(this.$anchor, this.$head).getBookmark();
  }
}
se.prototype.visible = !0;
class Jh {
  /**
  Create a range.
  */
  constructor(e, n) {
    this.$from = e, this.$to = n;
  }
}
let nd = !1;
function rd(t) {
  !nd && !t.parent.inlineContent && (nd = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + t.parent.type.name + ")"));
}
class ne extends se {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, n = e) {
    rd(e), rd(n), super(e, n);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    if (!r.parent.inlineContent)
      return se.near(r);
    let s = e.resolve(n.map(this.anchor));
    return new ne(s.parent.inlineContent ? s : r, r);
  }
  replace(e, n = U.empty) {
    if (super.replace(e, n), n == U.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof ne && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Bo(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.anchor != "number" || typeof n.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new ne(e.resolve(n.anchor), e.resolve(n.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, n, r = n) {
    let s = e.resolve(n);
    return new this(s, r == n ? s : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, n, r) {
    let s = e.pos - n.pos;
    if ((!r || s) && (r = s >= 0 ? 1 : -1), !n.parent.inlineContent) {
      let i = se.findFrom(n, r, !0) || se.findFrom(n, -r, !0);
      if (i)
        n = i.$head;
      else
        return se.near(n, r);
    }
    return e.parent.inlineContent || (s == 0 ? e = n : (e = (se.findFrom(e, -r, !0) || se.findFrom(e, r, !0)).$anchor, e.pos < n.pos != s < 0 && (e = n))), new ne(e, n);
  }
}
se.jsonID("text", ne);
class Bo {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new Bo(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return ne.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class ee extends se {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let n = e.nodeAfter, r = e.node(0).resolve(e.pos + n.nodeSize);
    super(e, r), this.node = n;
  }
  map(e, n) {
    let { deleted: r, pos: s } = n.mapResult(this.anchor), i = e.resolve(s);
    return r ? se.near(i) : new ee(i);
  }
  content() {
    return new U(H.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof ee && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new hc(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new ee(e.resolve(n.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, n) {
    return new ee(e.resolve(n));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
ee.prototype.visible = !1;
se.jsonID("node", ee);
class hc {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: n, pos: r } = e.mapResult(this.anchor);
    return n ? new Bo(r, r) : new hc(r);
  }
  resolve(e) {
    let n = e.resolve(this.anchor), r = n.nodeAfter;
    return r && ee.isSelectable(r) ? new ee(n) : se.near(n);
  }
}
class Ht extends se {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, n = U.empty) {
    if (n == U.empty) {
      e.delete(0, e.doc.content.size);
      let r = se.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, n);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new Ht(e);
  }
  map(e) {
    return new Ht(e);
  }
  eq(e) {
    return e instanceof Ht;
  }
  getBookmark() {
    return s2;
  }
}
se.jsonID("all", Ht);
const s2 = {
  map() {
    return this;
  },
  resolve(t) {
    return new Ht(t);
  }
};
function wr(t, e, n, r, s, i = !1) {
  if (e.inlineContent)
    return ne.create(t, n);
  for (let o = r - (s > 0 ? 0 : 1); s > 0 ? o < e.childCount : o >= 0; o += s) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!i && ee.isSelectable(l))
        return ee.create(t, n - (s < 0 ? l.nodeSize : 0));
    } else {
      let a = wr(t, l, n + s, s < 0 ? l.childCount : 0, s, i);
      if (a)
        return a;
    }
    n += l.nodeSize * s;
  }
  return null;
}
function sd(t, e, n) {
  let r = t.steps.length - 1;
  if (r < e)
    return;
  let s = t.steps[r];
  if (!(s instanceof qe || s instanceof Je))
    return;
  let i = t.mapping.maps[r], o;
  i.forEach((l, a, c, u) => {
    o == null && (o = u);
  }), t.setSelection(se.near(t.doc.resolve(o), n));
}
function id(t, e) {
  return !e || !t ? t : t.bind(e);
}
class Gs {
  constructor(e, n, r) {
    this.name = e, this.init = id(n.init, r), this.apply = id(n.apply, r);
  }
}
new Gs("doc", {
  init(t) {
    return t.doc || t.schema.topNodeType.createAndFill();
  },
  apply(t) {
    return t.doc;
  }
}), new Gs("selection", {
  init(t, e) {
    return t.selection || se.atStart(e.doc);
  },
  apply(t) {
    return t.selection;
  }
}), new Gs("storedMarks", {
  init(t) {
    return t.storedMarks || null;
  },
  apply(t, e, n, r) {
    return r.selection.$cursor ? t.storedMarks : null;
  }
}), new Gs("scrollToSelection", {
  init() {
    return 0;
  },
  apply(t, e) {
    return t.scrolledIntoView ? e + 1 : e;
  }
});
function Yh(t, e, n) {
  for (let r in t) {
    let s = t[r];
    s instanceof Function ? s = s.bind(e) : r == "handleDOMEvents" && (s = Yh(s, e, {})), n[r] = s;
  }
  return n;
}
class st {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Yh(e.props, this, this.props), this.key = e.key ? e.key.key : Xh("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const hl = /* @__PURE__ */ Object.create(null);
function Xh(t) {
  return t in hl ? t + "$" + ++hl[t] : (hl[t] = 0, t + "$");
}
class it {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Xh(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const dr = function(t) {
  for (var e = 0; ; e++)
    if (t = t.previousSibling, !t)
      return e;
}, Qh = function(t, e, n, r) {
  return n && (od(t, e, n, r, -1) || od(t, e, n, r, 1));
}, i2 = /^(img|br|input|textarea|hr)$/i;
function od(t, e, n, r, s) {
  for (; ; ) {
    if (t == n && e == r)
      return !0;
    if (e == (s < 0 ? 0 : Ti(t))) {
      let i = t.parentNode;
      if (!i || i.nodeType != 1 || pc(t) || i2.test(t.nodeName) || t.contentEditable == "false")
        return !1;
      e = dr(t) + (s < 0 ? 0 : 1), t = i;
    } else if (t.nodeType == 1) {
      if (t = t.childNodes[e + (s < 0 ? -1 : 0)], t.contentEditable == "false")
        return !1;
      e = s < 0 ? Ti(t) : 0;
    } else
      return !1;
  }
}
function Ti(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function o2(t, e, n) {
  for (let r = e == 0, s = e == Ti(t); r || s; ) {
    if (t == n)
      return !0;
    let i = dr(t);
    if (t = t.parentNode, !t)
      return !1;
    r = r && i == 0, s = s && i == Ti(t);
  }
}
function pc(t) {
  let e;
  for (let n = t; n && !(e = n.pmViewDesc); n = n.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == t || e.contentDOM == t);
}
const Zh = function(t) {
  return t.focusNode && Qh(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset);
};
function ep(t, e) {
  let n = document.createEvent("Event");
  return n.initEvent("keydown", !0, !0), n.keyCode = t, n.key = n.code = e, n;
}
const sn = typeof navigator < "u" ? navigator : null, ld = typeof document < "u" ? document : null, Vn = sn && sn.userAgent || "", sa = /Edge\/(\d+)/.exec(Vn), tp = /MSIE \d/.exec(Vn), ia = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Vn), Rs = !!(tp || ia || sa), np = tp ? document.documentMode : ia ? +ia[1] : sa ? +sa[1] : 0, Ho = !Rs && /gecko\/(\d+)/i.test(Vn);
Ho && +(/Firefox\/(\d+)/.exec(Vn) || [0, 0])[1];
const oa = !Rs && /Chrome\/(\d+)/.exec(Vn), fr = !!oa, l2 = oa ? +oa[1] : 0, hr = !Rs && !!sn && /Apple Computer/.test(sn.vendor), mc = hr && (/Mobile\/\w+/.test(Vn) || !!sn && sn.maxTouchPoints > 2), Ot = mc || (sn ? /Mac/.test(sn.platform) : !1), a2 = sn ? /Win/.test(sn.platform) : !1, Ps = /Android \d/.test(Vn), gc = !!ld && "webkitFontSmoothing" in ld.documentElement.style, c2 = gc ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function u2(t, e = null) {
  let n = t.domSelectionRange(), r = t.state.doc;
  if (!n.focusNode)
    return null;
  let s = t.docView.nearestDesc(n.focusNode), i = s && s.size == 0, o = t.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (Zh(n)) {
    for (a = l; s && !s.node; )
      s = s.parent;
    let u = s.node;
    if (s && u.isAtom && ee.isSelectable(u) && s.parent && !(u.isInline && o2(n.focusNode, n.focusOffset, s.dom))) {
      let f = s.posBefore;
      c = new ee(o == f ? l : r.resolve(f));
    }
  } else {
    let u = t.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
    if (u < 0)
      return null;
    a = r.resolve(u);
  }
  if (!c) {
    let u = e == "pointer" || t.state.selection.head < l.pos && !i ? 1 : -1;
    c = sp(t, a, l, u);
  }
  return c;
}
function rp(t) {
  return t.editable ? t.hasFocus() : p2(t) && document.activeElement && document.activeElement.contains(t.dom);
}
function yc(t, e = !1) {
  let n = t.state.selection;
  if (h2(t, n), !!rp(t)) {
    if (!e && t.input.mouseDown && t.input.mouseDown.allowDefault && fr) {
      let r = t.domSelectionRange(), s = t.domObserver.currentSelection;
      if (r.anchorNode && s.anchorNode && Qh(r.anchorNode, r.anchorOffset, s.anchorNode, s.anchorOffset)) {
        t.input.mouseDown.delayedSelectionSync = !0, t.domObserver.setCurSelection();
        return;
      }
    }
    if (t.domObserver.disconnectSelection(), t.cursorWrapper)
      f2(t);
    else {
      let { anchor: r, head: s } = n, i, o;
      ad && !(n instanceof ne) && (n.$from.parent.inlineContent || (i = cd(t, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = cd(t, n.to))), t.docView.setSelection(r, s, t.root, e), ad && (i && ud(i), o && ud(o)), n.visible ? t.dom.classList.remove("ProseMirror-hideselection") : (t.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && d2(t));
    }
    t.domObserver.setCurSelection(), t.domObserver.connectSelection();
  }
}
const ad = hr || fr && l2 < 63;
function cd(t, e) {
  let { node: n, offset: r } = t.docView.domFromPos(e, 0), s = r < n.childNodes.length ? n.childNodes[r] : null, i = r ? n.childNodes[r - 1] : null;
  if (hr && s && s.contentEditable == "false")
    return pl(s);
  if ((!s || s.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (s)
      return pl(s);
    if (i)
      return pl(i);
  }
}
function pl(t) {
  return t.contentEditable = "true", hr && t.draggable && (t.draggable = !1, t.wasDraggable = !0), t;
}
function ud(t) {
  t.contentEditable = "false", t.wasDraggable && (t.draggable = !0, t.wasDraggable = null);
}
function d2(t) {
  let e = t.dom.ownerDocument;
  e.removeEventListener("selectionchange", t.input.hideSelectionGuard);
  let n = t.domSelectionRange(), r = n.anchorNode, s = n.anchorOffset;
  e.addEventListener("selectionchange", t.input.hideSelectionGuard = () => {
    (n.anchorNode != r || n.anchorOffset != s) && (e.removeEventListener("selectionchange", t.input.hideSelectionGuard), setTimeout(() => {
      (!rp(t) || t.state.selection.visible) && t.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function f2(t) {
  let e = t.domSelection(), n = document.createRange(), r = t.cursorWrapper.dom, s = r.nodeName == "IMG";
  s ? n.setEnd(r.parentNode, dr(r) + 1) : n.setEnd(r, 0), n.collapse(!1), e.removeAllRanges(), e.addRange(n), !s && !t.state.selection.visible && Rs && np <= 11 && (r.disabled = !0, r.disabled = !1);
}
function h2(t, e) {
  if (e instanceof ee) {
    let n = t.docView.descAt(e.from);
    n != t.lastSelectedViewDesc && (dd(t), n && n.selectNode(), t.lastSelectedViewDesc = n);
  } else
    dd(t);
}
function dd(t) {
  t.lastSelectedViewDesc && (t.lastSelectedViewDesc.parent && t.lastSelectedViewDesc.deselectNode(), t.lastSelectedViewDesc = void 0);
}
function sp(t, e, n, r) {
  return t.someProp("createSelectionBetween", (s) => s(t, e, n)) || ne.between(e, n, r);
}
function p2(t) {
  let e = t.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return t.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (t.editable || t.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function la(t, e) {
  let { $anchor: n, $head: r } = t.selection, s = e > 0 ? n.max(r) : n.min(r), i = s.parent.inlineContent ? s.depth ? t.doc.resolve(e > 0 ? s.after() : s.before()) : null : s;
  return i && se.findFrom(i, e);
}
function Cn(t, e) {
  return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()), !0;
}
function fd(t, e, n) {
  let r = t.state.selection;
  if (r instanceof ne)
    if (n.indexOf("s") > -1) {
      let { $head: s } = r, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter;
      if (!i || i.isText || !i.isLeaf)
        return !1;
      let o = t.state.doc.resolve(s.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return Cn(t, new ne(r.$anchor, o));
    } else if (r.empty) {
      if (t.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let s = la(t.state, e);
        return s && s instanceof ee ? Cn(t, s) : !1;
      } else if (!(Ot && n.indexOf("m") > -1)) {
        let s = r.$head, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter, o;
        if (!i || i.isText)
          return !1;
        let l = e < 0 ? s.pos - i.nodeSize : s.pos;
        return i.isAtom || (o = t.docView.descAt(l)) && !o.contentDOM ? ee.isSelectable(i) ? Cn(t, new ee(e < 0 ? t.state.doc.resolve(s.pos - i.nodeSize) : s)) : gc ? Cn(t, new ne(t.state.doc.resolve(e < 0 ? l : l + i.nodeSize))) : !1 : !1;
      }
    } else
      return !1;
  else {
    if (r instanceof ee && r.node.isInline)
      return Cn(t, new ne(e > 0 ? r.$to : r.$from));
    {
      let s = la(t.state, e);
      return s ? Cn(t, s) : !1;
    }
  }
}
function Oi(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function fs(t, e) {
  let n = t.pmViewDesc;
  return n && n.size == 0 && (e < 0 || t.nextSibling || t.nodeName != "BR");
}
function yr(t, e) {
  return e < 0 ? m2(t) : g2(t);
}
function m2(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let s, i, o = !1;
  for (Ho && n.nodeType == 1 && r < Oi(n) && fs(n.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (n.nodeType != 1)
        break;
      {
        let l = n.childNodes[r - 1];
        if (fs(l, -1))
          s = n, i = --r;
        else if (l.nodeType == 3)
          n = l, r = n.nodeValue.length;
        else
          break;
      }
    } else {
      if (ip(n))
        break;
      {
        let l = n.previousSibling;
        for (; l && fs(l, -1); )
          s = n.parentNode, i = dr(l), l = l.previousSibling;
        if (l)
          n = l, r = Oi(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = 0;
        }
      }
    }
  o ? aa(t, n, r) : s && aa(t, s, i);
}
function g2(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let s = Oi(n), i, o;
  for (; ; )
    if (r < s) {
      if (n.nodeType != 1)
        break;
      let l = n.childNodes[r];
      if (fs(l, 1))
        i = n, o = ++r;
      else
        break;
    } else {
      if (ip(n))
        break;
      {
        let l = n.nextSibling;
        for (; l && fs(l, 1); )
          i = l.parentNode, o = dr(l) + 1, l = l.nextSibling;
        if (l)
          n = l, r = 0, s = Oi(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = s = 0;
        }
      }
    }
  i && aa(t, i, o);
}
function ip(t) {
  let e = t.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function y2(t, e) {
  for (; t && e == t.childNodes.length && !pc(t); )
    e = dr(t) + 1, t = t.parentNode;
  for (; t && e < t.childNodes.length; ) {
    let n = t.childNodes[e];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = 0;
  }
}
function b2(t, e) {
  for (; t && !e && !pc(t); )
    e = dr(t), t = t.parentNode;
  for (; t && e; ) {
    let n = t.childNodes[e - 1];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = t.childNodes.length;
  }
}
function aa(t, e, n) {
  if (e.nodeType != 3) {
    let i, o;
    (o = y2(e, n)) ? (e = o, n = 0) : (i = b2(e, n)) && (e = i, n = i.nodeValue.length);
  }
  let r = t.domSelection();
  if (Zh(r)) {
    let i = document.createRange();
    i.setEnd(e, n), i.setStart(e, n), r.removeAllRanges(), r.addRange(i);
  } else
    r.extend && r.extend(e, n);
  t.domObserver.setCurSelection();
  let { state: s } = t;
  setTimeout(() => {
    t.state == s && yc(t);
  }, 50);
}
function hd(t, e) {
  let n = t.state.doc.resolve(e);
  if (!(fr || a2) && n.parent.inlineContent) {
    let s = t.coordsAtPos(e);
    if (e > n.start()) {
      let i = t.coordsAtPos(e - 1), o = (i.top + i.bottom) / 2;
      if (o > s.top && o < s.bottom && Math.abs(i.left - s.left) > 1)
        return i.left < s.left ? "ltr" : "rtl";
    }
    if (e < n.end()) {
      let i = t.coordsAtPos(e + 1), o = (i.top + i.bottom) / 2;
      if (o > s.top && o < s.bottom && Math.abs(i.left - s.left) > 1)
        return i.left > s.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(t.dom).direction == "rtl" ? "rtl" : "ltr";
}
function pd(t, e, n) {
  let r = t.state.selection;
  if (r instanceof ne && !r.empty || n.indexOf("s") > -1 || Ot && n.indexOf("m") > -1)
    return !1;
  let { $from: s, $to: i } = r;
  if (!s.parent.inlineContent || t.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = la(t.state, e);
    if (o && o instanceof ee)
      return Cn(t, o);
  }
  if (!s.parent.inlineContent) {
    let o = e < 0 ? s : i, l = r instanceof Ht ? se.near(o, e) : se.findFrom(o, e);
    return l ? Cn(t, l) : !1;
  }
  return !1;
}
function md(t, e) {
  if (!(t.state.selection instanceof ne))
    return !0;
  let { $head: n, $anchor: r, empty: s } = t.state.selection;
  if (!n.sameParent(r))
    return !0;
  if (!s)
    return !1;
  if (t.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let i = !n.textOffset && (e < 0 ? n.nodeBefore : n.nodeAfter);
  if (i && !i.isText) {
    let o = t.state.tr;
    return e < 0 ? o.delete(n.pos - i.nodeSize, n.pos) : o.delete(n.pos, n.pos + i.nodeSize), t.dispatch(o), !0;
  }
  return !1;
}
function gd(t, e, n) {
  t.domObserver.stop(), e.contentEditable = n, t.domObserver.start();
}
function v2(t) {
  if (!hr || t.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: n } = t.domSelectionRange();
  if (e && e.nodeType == 1 && n == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    gd(t, r, "true"), setTimeout(() => gd(t, r, "false"), 20);
  }
  return !1;
}
function w2(t) {
  let e = "";
  return t.ctrlKey && (e += "c"), t.metaKey && (e += "m"), t.altKey && (e += "a"), t.shiftKey && (e += "s"), e;
}
function x2(t, e) {
  let n = e.keyCode, r = w2(e);
  if (n == 8 || Ot && n == 72 && r == "c")
    return md(t, -1) || yr(t, -1);
  if (n == 46 && !e.shiftKey || Ot && n == 68 && r == "c")
    return md(t, 1) || yr(t, 1);
  if (n == 13 || n == 27)
    return !0;
  if (n == 37 || Ot && n == 66 && r == "c") {
    let s = n == 37 ? hd(t, t.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return fd(t, s, r) || yr(t, s);
  } else if (n == 39 || Ot && n == 70 && r == "c") {
    let s = n == 39 ? hd(t, t.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return fd(t, s, r) || yr(t, s);
  } else {
    if (n == 38 || Ot && n == 80 && r == "c")
      return pd(t, -1, r) || yr(t, -1);
    if (n == 40 || Ot && n == 78 && r == "c")
      return v2(t) || pd(t, 1, r) || yr(t, 1);
    if (r == (Ot ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90))
      return !0;
  }
  return !1;
}
function op(t, e) {
  t.someProp("transformCopied", (m) => {
    e = m(e, t);
  });
  let n = [], { content: r, openStart: s, openEnd: i } = e;
  for (; s > 1 && i > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    s--, i--;
    let m = r.firstChild;
    n.push(m.type.name, m.attrs != m.type.defaultAttrs ? m.attrs : null), r = m.content;
  }
  let o = t.someProp("clipboardSerializer") || nr.fromSchema(t.state.schema), l = fp(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, f = 0;
  for (; c && c.nodeType == 1 && (u = dp[c.nodeName.toLowerCase()]); ) {
    for (let m = u.length - 1; m >= 0; m--) {
      let y = l.createElement(u[m]);
      for (; a.firstChild; )
        y.appendChild(a.firstChild);
      a.appendChild(y), f++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${s} ${i}${f ? ` -${f}` : ""} ${JSON.stringify(n)}`);
  let h = t.someProp("clipboardTextSerializer", (m) => m(e, t)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: h };
}
function lp(t, e, n, r, s) {
  let i = s.parent.type.spec.code, o, l;
  if (!n && !e)
    return null;
  let a = e && (r || i || !n);
  if (a) {
    if (t.someProp("transformPastedText", (h) => {
      e = h(e, i || r, t);
    }), i)
      return e ? new U(H.from(t.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : U.empty;
    let f = t.someProp("clipboardTextParser", (h) => h(e, s, r, t));
    if (f)
      l = f;
    else {
      let h = s.marks(), { schema: m } = t.state, y = nr.fromSchema(m);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((b) => {
        let x = o.appendChild(document.createElement("p"));
        b && x.appendChild(y.serializeNode(m.text(b, h)));
      });
    }
  } else
    t.someProp("transformPastedHTML", (f) => {
      n = f(n, t);
    }), o = S2(n), gc && C2(o);
  let c = o && o.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let f = +u[3]; f > 0; f--) {
      let h = o.firstChild;
      for (; h && h.nodeType != 1; )
        h = h.nextSibling;
      if (!h)
        break;
      o = h;
    }
  if (l || (l = (t.someProp("clipboardParser") || t.someProp("domParser") || Ih.fromSchema(t.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || u),
    context: s,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !k2.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = E2(yd(l, +u[1], +u[2]), u[4]);
  else if (l = U.maxOpen(_2(l.content, s), !0), l.openStart || l.openEnd) {
    let f = 0, h = 0;
    for (let m = l.content.firstChild; f < l.openStart && !m.type.spec.isolating; f++, m = m.firstChild)
      ;
    for (let m = l.content.lastChild; h < l.openEnd && !m.type.spec.isolating; h++, m = m.lastChild)
      ;
    l = yd(l, f, h);
  }
  return t.someProp("transformPasted", (f) => {
    l = f(l, t);
  }), l;
}
const k2 = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function _2(t, e) {
  if (t.childCount < 2)
    return t;
  for (let n = e.depth; n >= 0; n--) {
    let s = e.node(n).contentMatchAt(e.index(n)), i, o = [];
    if (t.forEach((l) => {
      if (!o)
        return;
      let a = s.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && i.length && cp(a, i, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = up(o[o.length - 1], i.length));
        let u = ap(l, a);
        o.push(u), s = s.matchType(u.type), i = a;
      }
    }), o)
      return H.from(o);
  }
  return t;
}
function ap(t, e, n = 0) {
  for (let r = e.length - 1; r >= n; r--)
    t = e[r].create(null, H.from(t));
  return t;
}
function cp(t, e, n, r, s) {
  if (s < t.length && s < e.length && t[s] == e[s]) {
    let i = cp(t, e, n, r.lastChild, s + 1);
    if (i)
      return r.copy(r.content.replaceChild(r.childCount - 1, i));
    if (r.contentMatchAt(r.childCount).matchType(s == t.length - 1 ? n.type : t[s + 1]))
      return r.copy(r.content.append(H.from(ap(n, t, s + 1))));
  }
}
function up(t, e) {
  if (e == 0)
    return t;
  let n = t.content.replaceChild(t.childCount - 1, up(t.lastChild, e - 1)), r = t.contentMatchAt(t.childCount).fillBefore(H.empty, !0);
  return t.copy(n.append(r));
}
function ca(t, e, n, r, s, i) {
  let o = e < 0 ? t.firstChild : t.lastChild, l = o.content;
  return t.childCount > 1 && (i = 0), s < r - 1 && (l = ca(l, e, n, r, s + 1, i)), s >= n && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, i <= s).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(H.empty, !0))), t.replaceChild(e < 0 ? 0 : t.childCount - 1, o.copy(l));
}
function yd(t, e, n) {
  return e < t.openStart && (t = new U(ca(t.content, -1, e, t.openStart, 0, t.openEnd), e, t.openEnd)), n < t.openEnd && (t = new U(ca(t.content, 1, n, t.openEnd, 0, 0), t.openStart, n)), t;
}
const dp = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
let bd = null;
function fp() {
  return bd || (bd = document.implementation.createHTMLDocument("title"));
}
function S2(t) {
  let e = /^(\s*<meta [^>]*>)*/.exec(t);
  e && (t = t.slice(e[0].length));
  let n = fp().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(t), s;
  if ((s = r && dp[r[1].toLowerCase()]) && (t = s.map((i) => "<" + i + ">").join("") + t + s.map((i) => "</" + i + ">").reverse().join("")), n.innerHTML = t, s)
    for (let i = 0; i < s.length; i++)
      n = n.querySelector(s[i]) || n;
  return n;
}
function C2(t) {
  let e = t.querySelectorAll(fr ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "), r);
  }
}
function E2(t, e) {
  if (!t.size)
    return t;
  let n = t.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return t;
  }
  let { content: s, openStart: i, openEnd: o } = t;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = n.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    s = H.from(a.create(r[l + 1], s)), i++, o++;
  }
  return new U(s, i, o);
}
const Ft = {}, Et = {};
function Rn(t, e) {
  t.input.lastSelectionOrigin = e, t.input.lastSelectionTime = Date.now();
}
Et.keydown = (t, e) => {
  let n = e;
  if (t.input.shiftKey = n.keyCode == 16 || n.shiftKey, !pp(t, n) && (t.input.lastKeyCode = n.keyCode, t.input.lastKeyCodeTime = Date.now(), !(Ps && fr && n.keyCode == 13)))
    if (n.keyCode != 229 && t.domObserver.forceFlush(), mc && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
      let r = Date.now();
      t.input.lastIOSEnter = r, t.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        t.input.lastIOSEnter == r && (t.someProp("handleKeyDown", (s) => s(t, ep(13, "Enter"))), t.input.lastIOSEnter = 0);
      }, 200);
    } else
      t.someProp("handleKeyDown", (r) => r(t, n)) || x2(t, n) ? n.preventDefault() : Rn(t, "key");
};
Et.keyup = (t, e) => {
  e.keyCode == 16 && (t.input.shiftKey = !1);
};
Et.keypress = (t, e) => {
  let n = e;
  if (pp(t, n) || !n.charCode || n.ctrlKey && !n.altKey || Ot && n.metaKey)
    return;
  if (t.someProp("handleKeyPress", (s) => s(t, n))) {
    n.preventDefault();
    return;
  }
  let r = t.state.selection;
  if (!(r instanceof ne) || !r.$from.sameParent(r.$to)) {
    let s = String.fromCharCode(n.charCode);
    !/[\r\n]/.test(s) && !t.someProp("handleTextInput", (i) => i(t, r.$from.pos, r.$to.pos, s)) && t.dispatch(t.state.tr.insertText(s).scrollIntoView()), n.preventDefault();
  }
};
function Fo(t) {
  return { left: t.clientX, top: t.clientY };
}
function M2(t, e) {
  let n = e.x - t.clientX, r = e.y - t.clientY;
  return n * n + r * r < 100;
}
function bc(t, e, n, r, s) {
  if (r == -1)
    return !1;
  let i = t.state.doc.resolve(r);
  for (let o = i.depth + 1; o > 0; o--)
    if (t.someProp(e, (l) => o > i.depth ? l(t, n, i.nodeAfter, i.before(o), s, !0) : l(t, n, i.node(o), i.before(o), s, !1)))
      return !0;
  return !1;
}
function Lr(t, e, n) {
  t.focused || t.focus();
  let r = t.state.tr.setSelection(e);
  n == "pointer" && r.setMeta("pointer", !0), t.dispatch(r);
}
function A2(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.doc.resolve(e), r = n.nodeAfter;
  return r && r.isAtom && ee.isSelectable(r) ? (Lr(t, new ee(n), "pointer"), !0) : !1;
}
function T2(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.selection, r, s;
  n instanceof ee && (r = n.node);
  let i = t.state.doc.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let l = o > i.depth ? i.nodeAfter : i.node(o);
    if (ee.isSelectable(l)) {
      r && n.$from.depth > 0 && o >= n.$from.depth && i.before(n.$from.depth + 1) == n.$from.pos ? s = i.before(n.$from.depth) : s = i.before(o);
      break;
    }
  }
  return s != null ? (Lr(t, ee.create(t.state.doc, s), "pointer"), !0) : !1;
}
function O2(t, e, n, r, s) {
  return bc(t, "handleClickOn", e, n, r) || t.someProp("handleClick", (i) => i(t, e, r)) || (s ? T2(t, n) : A2(t, n));
}
function j2(t, e, n, r) {
  return bc(t, "handleDoubleClickOn", e, n, r) || t.someProp("handleDoubleClick", (s) => s(t, e, r));
}
function R2(t, e, n, r) {
  return bc(t, "handleTripleClickOn", e, n, r) || t.someProp("handleTripleClick", (s) => s(t, e, r)) || P2(t, n, r);
}
function P2(t, e, n) {
  if (n.button != 0)
    return !1;
  let r = t.state.doc;
  if (e == -1)
    return r.inlineContent ? (Lr(t, ne.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let s = r.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let o = i > s.depth ? s.nodeAfter : s.node(i), l = s.before(i);
    if (o.inlineContent)
      Lr(t, ne.create(r, l + 1, l + 1 + o.content.size), "pointer");
    else if (ee.isSelectable(o))
      Lr(t, ee.create(r, l), "pointer");
    else
      continue;
    return !0;
  }
}
function vc(t) {
  return ji(t);
}
const hp = Ot ? "metaKey" : "ctrlKey";
Ft.mousedown = (t, e) => {
  let n = e;
  t.input.shiftKey = n.shiftKey;
  let r = vc(t), s = Date.now(), i = "singleClick";
  s - t.input.lastClick.time < 500 && M2(n, t.input.lastClick) && !n[hp] && (t.input.lastClick.type == "singleClick" ? i = "doubleClick" : t.input.lastClick.type == "doubleClick" && (i = "tripleClick")), t.input.lastClick = { time: s, x: n.clientX, y: n.clientY, type: i };
  let o = t.posAtCoords(Fo(n));
  o && (i == "singleClick" ? (t.input.mouseDown && t.input.mouseDown.done(), t.input.mouseDown = new I2(t, o, n, !!r)) : (i == "doubleClick" ? j2 : R2)(t, o.pos, o.inside, n) ? n.preventDefault() : Rn(t, "pointer"));
};
class I2 {
  constructor(e, n, r, s) {
    this.view = e, this.pos = n, this.event = r, this.flushed = s, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[hp], this.allowDefault = r.shiftKey;
    let i, o;
    if (n.inside > -1)
      i = e.state.doc.nodeAt(n.inside), o = n.inside;
    else {
      let u = e.state.doc.resolve(n.pos);
      i = u.parent, o = u.depth ? u.before() : 0;
    }
    const l = s ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a ? a.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof ee && c.from <= o && c.to > o) && (this.mightDrag = {
      node: i,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Ho && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Rn(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => yc(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let n = this.pos;
    this.view.state.doc != this.startDoc && (n = this.view.posAtCoords(Fo(e))), this.updateAllowDefault(e), this.allowDefault || !n ? Rn(this.view, "pointer") : O2(this.view, n.pos, n.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    hr && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    fr && !this.view.state.selection.visible && Math.min(Math.abs(n.pos - this.view.state.selection.from), Math.abs(n.pos - this.view.state.selection.to)) <= 2) ? (Lr(this.view, se.near(this.view.state.doc.resolve(n.pos)), "pointer"), e.preventDefault()) : Rn(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Rn(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Ft.touchstart = (t) => {
  t.input.lastTouch = Date.now(), vc(t), Rn(t, "pointer");
};
Ft.touchmove = (t) => {
  t.input.lastTouch = Date.now(), Rn(t, "pointer");
};
Ft.contextmenu = (t) => vc(t);
function pp(t, e) {
  return t.composing ? !0 : hr && Math.abs(e.timeStamp - t.input.compositionEndedAt) < 500 ? (t.input.compositionEndedAt = -2e8, !0) : !1;
}
const L2 = Ps ? 5e3 : -1;
Et.compositionstart = Et.compositionupdate = (t) => {
  if (!t.composing) {
    t.domObserver.flush();
    let { state: e } = t, n = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      t.markCursor = t.state.storedMarks || n.marks(), ji(t, !0), t.markCursor = null;
    else if (ji(t), Ho && e.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
      let r = t.domSelectionRange();
      for (let s = r.focusNode, i = r.focusOffset; s && s.nodeType == 1 && i != 0; ) {
        let o = i < 0 ? s.lastChild : s.childNodes[i - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          t.domSelection().collapse(o, o.nodeValue.length);
          break;
        } else
          s = o, i = -1;
      }
    }
    t.input.composing = !0;
  }
  mp(t, L2);
};
Et.compositionend = (t, e) => {
  t.composing && (t.input.composing = !1, t.input.compositionEndedAt = e.timeStamp, t.input.compositionPendingChanges = t.domObserver.pendingRecords().length ? t.input.compositionID : 0, t.input.compositionPendingChanges && Promise.resolve().then(() => t.domObserver.flush()), t.input.compositionID++, mp(t, 20));
};
function mp(t, e) {
  clearTimeout(t.input.composingTimeout), e > -1 && (t.input.composingTimeout = setTimeout(() => ji(t), e));
}
function N2(t) {
  for (t.composing && (t.input.composing = !1, t.input.compositionEndedAt = z2()); t.input.compositionNodes.length > 0; )
    t.input.compositionNodes.pop().markParentsDirty();
}
function z2() {
  let t = document.createEvent("Event");
  return t.initEvent("event", !0, !0), t.timeStamp;
}
function ji(t, e = !1) {
  if (!(Ps && t.domObserver.flushingSoon >= 0)) {
    if (t.domObserver.forceFlush(), N2(t), e || t.docView && t.docView.dirty) {
      let n = u2(t);
      return n && !n.eq(t.state.selection) ? t.dispatch(t.state.tr.setSelection(n)) : t.updateState(t.state), !0;
    }
    return !1;
  }
}
function $2(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.dom.parentNode.appendChild(document.createElement("div"));
  n.appendChild(e), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), s = document.createRange();
  s.selectNodeContents(e), t.dom.blur(), r.removeAllRanges(), r.addRange(s), setTimeout(() => {
    n.parentNode && n.parentNode.removeChild(n), t.focus();
  }, 50);
}
const _s = Rs && np < 15 || mc && c2 < 604;
Ft.copy = Et.cut = (t, e) => {
  let n = e, r = t.state.selection, s = n.type == "cut";
  if (r.empty)
    return;
  let i = _s ? null : n.clipboardData, o = r.content(), { dom: l, text: a } = op(t, o);
  i ? (n.preventDefault(), i.clearData(), i.setData("text/html", l.innerHTML), i.setData("text/plain", a)) : $2(t, l), s && t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function D2(t) {
  return t.openStart == 0 && t.openEnd == 0 && t.content.childCount == 1 ? t.content.firstChild : null;
}
function B2(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.input.shiftKey || t.state.selection.$from.parent.type.spec.code, r = t.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
  n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let s = t.input.shiftKey && t.input.lastKeyCode != 45;
  setTimeout(() => {
    t.focus(), r.parentNode && r.parentNode.removeChild(r), n ? ua(t, r.value, null, s, e) : ua(t, r.textContent, r.innerHTML, s, e);
  }, 50);
}
function ua(t, e, n, r, s) {
  let i = lp(t, e, n, r, t.state.selection.$from);
  if (t.someProp("handlePaste", (a) => a(t, s, i || U.empty)))
    return !0;
  if (!i)
    return !1;
  let o = D2(i), l = o ? t.state.tr.replaceSelectionWith(o, r) : t.state.tr.replaceSelection(i);
  return t.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function gp(t) {
  let e = t.getData("text/plain") || t.getData("Text");
  if (e)
    return e;
  let n = t.getData("text/uri-list");
  return n ? n.replace(/\r?\n/g, " ") : "";
}
Et.paste = (t, e) => {
  let n = e;
  if (t.composing && !Ps)
    return;
  let r = _s ? null : n.clipboardData, s = t.input.shiftKey && t.input.lastKeyCode != 45;
  r && ua(t, gp(r), r.getData("text/html"), s, n) ? n.preventDefault() : B2(t, n);
};
class H2 {
  constructor(e, n, r) {
    this.slice = e, this.move = n, this.node = r;
  }
}
const yp = Ot ? "altKey" : "ctrlKey";
Ft.dragstart = (t, e) => {
  let n = e, r = t.input.mouseDown;
  if (r && r.done(), !n.dataTransfer)
    return;
  let s = t.state.selection, i = s.empty ? null : t.posAtCoords(Fo(n)), o;
  if (!(i && i.pos >= s.from && i.pos <= (s instanceof ee ? s.to - 1 : s.to))) {
    if (r && r.mightDrag)
      o = ee.create(t.state.doc, r.mightDrag.pos);
    else if (n.target && n.target.nodeType == 1) {
      let u = t.docView.nearestDesc(n.target, !0);
      u && u.node.type.spec.draggable && u != t.docView && (o = ee.create(t.state.doc, u.posBefore));
    }
  }
  let l = (o || t.state.selection).content(), { dom: a, text: c } = op(t, l);
  n.dataTransfer.clearData(), n.dataTransfer.setData(_s ? "Text" : "text/html", a.innerHTML), n.dataTransfer.effectAllowed = "copyMove", _s || n.dataTransfer.setData("text/plain", c), t.dragging = new H2(l, !n[yp], o);
};
Ft.dragend = (t) => {
  let e = t.dragging;
  window.setTimeout(() => {
    t.dragging == e && (t.dragging = null);
  }, 50);
};
Et.dragover = Et.dragenter = (t, e) => e.preventDefault();
Et.drop = (t, e) => {
  let n = e, r = t.dragging;
  if (t.dragging = null, !n.dataTransfer)
    return;
  let s = t.posAtCoords(Fo(n));
  if (!s)
    return;
  let i = t.state.doc.resolve(s.pos), o = r && r.slice;
  o ? t.someProp("transformPasted", (y) => {
    o = y(o, t);
  }) : o = lp(t, gp(n.dataTransfer), _s ? null : n.dataTransfer.getData("text/html"), !1, i);
  let l = !!(r && !n[yp]);
  if (t.someProp("handleDrop", (y) => y(t, n, o || U.empty, l))) {
    n.preventDefault();
    return;
  }
  if (!o)
    return;
  n.preventDefault();
  let a = o ? Wh(t.state.doc, i.pos, o) : i.pos;
  a == null && (a = i.pos);
  let c = t.state.tr;
  if (l) {
    let { node: y } = r;
    y ? y.replace(c) : c.deleteSelection();
  }
  let u = c.mapping.map(a), f = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, h = c.doc;
  if (f ? c.replaceRangeWith(u, u, o.content.firstChild) : c.replaceRange(u, u, o), c.doc.eq(h))
    return;
  let m = c.doc.resolve(u);
  if (f && ee.isSelectable(o.content.firstChild) && m.nodeAfter && m.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new ee(m));
  else {
    let y = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((b, x, C, T) => y = T), c.setSelection(sp(t, m, c.doc.resolve(y)));
  }
  t.focus(), t.dispatch(c.setMeta("uiEvent", "drop"));
};
Ft.focus = (t) => {
  t.input.lastFocus = Date.now(), t.focused || (t.domObserver.stop(), t.dom.classList.add("ProseMirror-focused"), t.domObserver.start(), t.focused = !0, setTimeout(() => {
    t.docView && t.hasFocus() && !t.domObserver.currentSelection.eq(t.domSelectionRange()) && yc(t);
  }, 20));
};
Ft.blur = (t, e) => {
  let n = e;
  t.focused && (t.domObserver.stop(), t.dom.classList.remove("ProseMirror-focused"), t.domObserver.start(), n.relatedTarget && t.dom.contains(n.relatedTarget) && t.domObserver.currentSelection.clear(), t.focused = !1);
};
Ft.beforeinput = (t, e) => {
  if (fr && Ps && e.inputType == "deleteContentBackward") {
    t.domObserver.flushSoon();
    let { domChangeCount: r } = t.input;
    setTimeout(() => {
      if (t.input.domChangeCount != r || (t.dom.blur(), t.focus(), t.someProp("handleKeyDown", (i) => i(t, ep(8, "Backspace")))))
        return;
      let { $cursor: s } = t.state.selection;
      s && s.pos > 0 && t.dispatch(t.state.tr.delete(s.pos - 1, s.pos).scrollIntoView());
    }, 50);
  }
};
for (let t in Et)
  Ft[t] = Et[t];
function Ss(t, e) {
  if (t == e)
    return !0;
  for (let n in t)
    if (t[n] !== e[n])
      return !1;
  for (let n in e)
    if (!(n in t))
      return !1;
  return !0;
}
class Ri {
  constructor(e, n) {
    this.toDOM = e, this.spec = n || lr, this.side = this.spec.side || 0;
  }
  map(e, n, r, s) {
    let { pos: i, deleted: o } = e.mapResult(n.from + s, this.side < 0 ? -1 : 1);
    return o ? null : new bt(i - r, i - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof Ri && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Ss(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Nn {
  constructor(e, n) {
    this.attrs = e, this.spec = n || lr;
  }
  map(e, n, r, s) {
    let i = e.map(n.from + s, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(n.to + s, this.spec.inclusiveEnd ? 1 : -1) - r;
    return i >= o ? null : new bt(i, o, this);
  }
  valid(e, n) {
    return n.from < n.to;
  }
  eq(e) {
    return this == e || e instanceof Nn && Ss(this.attrs, e.attrs) && Ss(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Nn;
  }
  destroy() {
  }
}
class wc {
  constructor(e, n) {
    this.attrs = e, this.spec = n || lr;
  }
  map(e, n, r, s) {
    let i = e.mapResult(n.from + s, 1);
    if (i.deleted)
      return null;
    let o = e.mapResult(n.to + s, -1);
    return o.deleted || o.pos <= i.pos ? null : new bt(i.pos - r, o.pos - r, this);
  }
  valid(e, n) {
    let { index: r, offset: s } = e.content.findIndex(n.from), i;
    return s == n.from && !(i = e.child(r)).isText && s + i.nodeSize == n.to;
  }
  eq(e) {
    return this == e || e instanceof wc && Ss(this.attrs, e.attrs) && Ss(this.spec, e.spec);
  }
  destroy() {
  }
}
class bt {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.from = e, this.to = n, this.type = r;
  }
  /**
  @internal
  */
  copy(e, n) {
    return new bt(e, n, this.type);
  }
  /**
  @internal
  */
  eq(e, n = 0) {
    return this.type.eq(e.type) && this.from + n == e.from && this.to + n == e.to;
  }
  /**
  @internal
  */
  map(e, n, r) {
    return this.type.map(e, this, n, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, n, r) {
    return new bt(e, e, new Ri(n, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, n, r, s) {
    return new bt(e, n, new Nn(r, s));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, n, r, s) {
    return new bt(e, n, new wc(r, s));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof Nn;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof Ri;
  }
}
const xr = [], lr = {};
class Se {
  /**
  @internal
  */
  constructor(e, n) {
    this.local = e.length ? e : xr, this.children = n.length ? n : xr;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, n) {
    return n.length ? Pi(n, e, 0, lr) : ft;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, n, r) {
    let s = [];
    return this.findInner(e ?? 0, n ?? 1e9, s, 0, r), s;
  }
  findInner(e, n, r, s, i) {
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      l.from <= n && l.to >= e && (!i || i(l.spec)) && r.push(l.copy(l.from + s, l.to + s));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < n && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, n - l, r, s + l, i);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, n, r) {
    return this == ft || e.maps.length == 0 ? this : this.mapInner(e, n, 0, 0, r || lr);
  }
  /**
  @internal
  */
  mapInner(e, n, r, s, i) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, s);
      a && a.type.valid(n, a) ? (o || (o = [])).push(a) : i.onRemove && i.onRemove(this.local[l].spec);
    }
    return this.children.length ? F2(this.children, o || [], e, n, r, s, i) : o ? new Se(o.sort(ar), xr) : ft;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, n) {
    return n.length ? this == ft ? Se.create(e, n) : this.addInner(e, n, 0) : this;
  }
  addInner(e, n, r) {
    let s, i = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (u = vp(n, l, c)) {
        for (s || (s = this.children.slice()); i < s.length && s[i] < a; )
          i += 3;
        s[i] == a ? s[i + 2] = s[i + 2].addInner(l, u, c + 1) : s.splice(i, 0, a, a + l.nodeSize, Pi(u, l, c + 1, lr)), i += 3;
      }
    });
    let o = bp(i ? wp(n) : n, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new Se(o.length ? this.local.concat(o).sort(ar) : this.local, s || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == ft ? this : this.removeInner(e, 0);
  }
  removeInner(e, n) {
    let r = this.children, s = this.local;
    for (let i = 0; i < r.length; i += 3) {
      let o, l = r[i] + n, a = r[i + 1] + n;
      for (let u = 0, f; u < e.length; u++)
        (f = e[u]) && f.from > l && f.to < a && (e[u] = null, (o || (o = [])).push(f));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[i + 2].removeInner(o, l + 1);
      c != ft ? r[i + 2] = c : (r.splice(i, 3), i -= 3);
    }
    if (s.length) {
      for (let i = 0, o; i < e.length; i++)
        if (o = e[i])
          for (let l = 0; l < s.length; l++)
            s[l].eq(o, n) && (s == this.local && (s = this.local.slice()), s.splice(l--, 1));
    }
    return r == this.children && s == this.local ? this : s.length || r.length ? new Se(s, r) : ft;
  }
  forChild(e, n) {
    if (this == ft)
      return this;
    if (n.isLeaf)
      return Se.empty;
    let r, s;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let i = e + 1, o = i + n.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > i && a.type instanceof Nn) {
        let c = Math.max(i, a.from) - i, u = Math.min(o, a.to) - i;
        c < u && (s || (s = [])).push(a.copy(c, u));
      }
    }
    if (s) {
      let l = new Se(s.sort(ar), xr);
      return r ? new Zn([l, r]) : l;
    }
    return r || ft;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof Se) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let n = 0; n < this.local.length; n++)
      if (!this.local[n].eq(e.local[n]))
        return !1;
    for (let n = 0; n < this.children.length; n += 3)
      if (this.children[n] != e.children[n] || this.children[n + 1] != e.children[n + 1] || !this.children[n + 2].eq(e.children[n + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return xc(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == ft)
      return xr;
    if (e.inlineContent || !this.local.some(Nn.is))
      return this.local;
    let n = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Nn || n.push(this.local[r]);
    return n;
  }
}
Se.empty = new Se([], []);
Se.removeOverlap = xc;
const ft = Se.empty;
class Zn {
  constructor(e) {
    this.members = e;
  }
  map(e, n) {
    const r = this.members.map((s) => s.map(e, n, lr));
    return Zn.from(r);
  }
  forChild(e, n) {
    if (n.isLeaf)
      return Se.empty;
    let r = [];
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].forChild(e, n);
      i != ft && (i instanceof Zn ? r = r.concat(i.members) : r.push(i));
    }
    return Zn.from(r);
  }
  eq(e) {
    if (!(e instanceof Zn) || e.members.length != this.members.length)
      return !1;
    for (let n = 0; n < this.members.length; n++)
      if (!this.members[n].eq(e.members[n]))
        return !1;
    return !0;
  }
  locals(e) {
    let n, r = !0;
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].localsInner(e);
      if (i.length)
        if (!n)
          n = i;
        else {
          r && (n = n.slice(), r = !1);
          for (let o = 0; o < i.length; o++)
            n.push(i[o]);
        }
    }
    return n ? xc(r ? n : n.sort(ar)) : xr;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return ft;
      case 1:
        return e[0];
      default:
        return new Zn(e.every((n) => n instanceof Se) ? e : e.reduce((n, r) => n.concat(r instanceof Se ? r : r.members), []));
    }
  }
}
function F2(t, e, n, r, s, i, o) {
  let l = t.slice();
  for (let c = 0, u = i; c < n.maps.length; c++) {
    let f = 0;
    n.maps[c].forEach((h, m, y, b) => {
      let x = b - y - (m - h);
      for (let C = 0; C < l.length; C += 3) {
        let T = l[C + 1];
        if (T < 0 || h > T + u - f)
          continue;
        let O = l[C] + u - f;
        m >= O ? l[C + 1] = h <= O ? -2 : -1 : h >= u && x && (l[C] += x, l[C + 1] += x);
      }
      f += x;
    }), u = n.maps[c].map(u, -1);
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        a = !0, l[c + 1] = -1;
        continue;
      }
      let u = n.map(t[c] + i), f = u - s;
      if (f < 0 || f >= r.content.size) {
        a = !0;
        continue;
      }
      let h = n.map(t[c + 1] + i, -1), m = h - s, { index: y, offset: b } = r.content.findIndex(f), x = r.maybeChild(y);
      if (x && b == f && b + x.nodeSize == m) {
        let C = l[c + 2].mapInner(n, x, u + 1, t[c] + i + 1, o);
        C != ft ? (l[c] = f, l[c + 1] = m, l[c + 2] = C) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = W2(l, t, e, n, s, i, o), u = Pi(c, r, 0, o);
    e = u.local;
    for (let f = 0; f < l.length; f += 3)
      l[f + 1] < 0 && (l.splice(f, 3), f -= 3);
    for (let f = 0, h = 0; f < u.children.length; f += 3) {
      let m = u.children[f];
      for (; h < l.length && l[h] < m; )
        h += 3;
      l.splice(h, 0, u.children[f], u.children[f + 1], u.children[f + 2]);
    }
  }
  return new Se(e.sort(ar), l);
}
function bp(t, e) {
  if (!e || !t.length)
    return t;
  let n = [];
  for (let r = 0; r < t.length; r++) {
    let s = t[r];
    n.push(new bt(s.from + e, s.to + e, s.type));
  }
  return n;
}
function W2(t, e, n, r, s, i, o) {
  function l(a, c) {
    for (let u = 0; u < a.local.length; u++) {
      let f = a.local[u].map(r, s, c);
      f ? n.push(f) : o.onRemove && o.onRemove(a.local[u].spec);
    }
    for (let u = 0; u < a.children.length; u += 3)
      l(a.children[u + 2], a.children[u] + c + 1);
  }
  for (let a = 0; a < t.length; a += 3)
    t[a + 1] == -1 && l(t[a + 2], e[a] + i + 1);
  return n;
}
function vp(t, e, n) {
  if (e.isLeaf)
    return null;
  let r = n + e.nodeSize, s = null;
  for (let i = 0, o; i < t.length; i++)
    (o = t[i]) && o.from > n && o.to < r && ((s || (s = [])).push(o), t[i] = null);
  return s;
}
function wp(t) {
  let e = [];
  for (let n = 0; n < t.length; n++)
    t[n] != null && e.push(t[n]);
  return e;
}
function Pi(t, e, n, r) {
  let s = [], i = !1;
  e.forEach((l, a) => {
    let c = vp(t, l, a + n);
    if (c) {
      i = !0;
      let u = Pi(c, l, n + a + 1, r);
      u != ft && s.push(a, a + l.nodeSize, u);
    }
  });
  let o = bp(i ? wp(t) : t, -n).sort(ar);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || s.length ? new Se(o, s) : ft;
}
function ar(t, e) {
  return t.from - e.from || t.to - e.to;
}
function xc(t) {
  let e = t;
  for (let n = 0; n < e.length - 1; n++) {
    let r = e[n];
    if (r.from != r.to)
      for (let s = n + 1; s < e.length; s++) {
        let i = e[s];
        if (i.from == r.from) {
          i.to != r.to && (e == t && (e = t.slice()), e[s] = i.copy(i.from, r.to), vd(e, s + 1, i.copy(r.to, i.to)));
          continue;
        } else {
          i.from < r.to && (e == t && (e = t.slice()), e[n] = r.copy(r.from, i.from), vd(e, s, r.copy(i.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function vd(t, e, n) {
  for (; e < t.length && ar(n, t[e]) > 0; )
    e++;
  t.splice(e, 0, n);
}
var Dn = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Ii = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, V2 = typeof navigator < "u" && /Mac/.test(navigator.platform), K2 = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var et = 0; et < 10; et++)
  Dn[48 + et] = Dn[96 + et] = String(et);
for (var et = 1; et <= 24; et++)
  Dn[et + 111] = "F" + et;
for (var et = 65; et <= 90; et++)
  Dn[et] = String.fromCharCode(et + 32), Ii[et] = String.fromCharCode(et);
for (var ml in Dn)
  Ii.hasOwnProperty(ml) || (Ii[ml] = Dn[ml]);
function U2(t) {
  var e = V2 && t.metaKey && t.shiftKey && !t.ctrlKey && !t.altKey || K2 && t.shiftKey && t.key && t.key.length == 1 || t.key == "Unidentified", n = !e && t.key || (t.shiftKey ? Ii : Dn)[t.keyCode] || t.key || "Unidentified";
  return n == "Esc" && (n = "Escape"), n == "Del" && (n = "Delete"), n == "Left" && (n = "ArrowLeft"), n == "Up" && (n = "ArrowUp"), n == "Right" && (n = "ArrowRight"), n == "Down" && (n = "ArrowDown"), n;
}
const q2 = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function G2(t) {
  let e = t.split(/-(?!$)/), n = e[e.length - 1];
  n == "Space" && (n = " ");
  let r, s, i, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      s = !0;
    else if (/^s(hift)?$/i.test(a))
      i = !0;
    else if (/^mod$/i.test(a))
      q2 ? o = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (n = "Alt-" + n), s && (n = "Ctrl-" + n), o && (n = "Meta-" + n), i && (n = "Shift-" + n), n;
}
function J2(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t)
    e[G2(n)] = t[n];
  return e;
}
function gl(t, e, n = !0) {
  return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), n && e.shiftKey && (t = "Shift-" + t), t;
}
function xp(t) {
  let e = J2(t);
  return function(n, r) {
    let s = U2(r), i, o = e[gl(s, r)];
    if (o && o(n.state, n.dispatch, n))
      return !0;
    if (s.length == 1 && s != " ") {
      if (r.shiftKey) {
        let l = e[gl(s, r, !1)];
        if (l && l(n.state, n.dispatch, n))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || s.charCodeAt(0) > 127) && (i = Dn[r.keyCode]) && i != s) {
        let l = e[gl(i, r)];
        if (l && l(n.state, n.dispatch, n))
          return !0;
      }
    }
    return !1;
  };
}
const Y2 = (t, e) => t.selection.empty ? !1 : (e && e(t.tr.deleteSelection().scrollIntoView()), !0);
function kp(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("backward", t) : n.parentOffset > 0) ? null : n;
}
const X2 = (t, e, n) => {
  let r = kp(t, n);
  if (!r)
    return !1;
  let s = kc(r);
  if (!s) {
    let o = r.blockRange(), l = o && Vr(o);
    return l == null ? !1 : (e && e(t.tr.lift(o, l).scrollIntoView()), !0);
  }
  let i = s.nodeBefore;
  if (!i.type.spec.isolating && Ep(t, s, e))
    return !0;
  if (r.parent.content.size == 0 && (Dr(i, "end") || ee.isSelectable(i))) {
    let o = Do(t.doc, r.before(), r.after(), U.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = t.tr.step(o);
        l.setSelection(Dr(i, "end") ? se.findFrom(l.doc.resolve(l.mapping.map(s.pos, -1)), -1) : ee.create(l.doc, s.pos - i.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(t.tr.delete(s.pos - i.nodeSize, s.pos).scrollIntoView()), !0) : !1;
}, Q2 = (t, e, n) => {
  let r = kp(t, n);
  if (!r)
    return !1;
  let s = kc(r);
  return s ? _p(t, s, e) : !1;
}, Z2 = (t, e, n) => {
  let r = Sp(t, n);
  if (!r)
    return !1;
  let s = _c(r);
  return s ? _p(t, s, e) : !1;
};
function _p(t, e, n) {
  let r = e.nodeBefore, s = r, i = e.pos - 1;
  for (; !s.isTextblock; i--) {
    if (s.type.spec.isolating)
      return !1;
    let u = s.lastChild;
    if (!u)
      return !1;
    s = u;
  }
  let o = e.nodeAfter, l = o, a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating)
      return !1;
    let u = l.firstChild;
    if (!u)
      return !1;
    l = u;
  }
  let c = Do(t.doc, i, a, U.empty);
  if (!c || c.from != i || c instanceof qe && c.slice.size >= a - i)
    return !1;
  if (n) {
    let u = t.tr.step(c);
    u.setSelection(ne.create(u.doc, i)), n(u.scrollIntoView());
  }
  return !0;
}
function Dr(t, e, n = !1) {
  for (let r = t; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (n && r.childCount != 1)
      return !1;
  }
  return !1;
}
const eb = (t, e, n) => {
  let { $head: r, empty: s } = t.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("backward", t) : r.parentOffset > 0)
      return !1;
    i = kc(r);
  }
  let o = i && i.nodeBefore;
  return !o || !ee.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(ee.create(t.doc, i.pos - o.nodeSize)).scrollIntoView()), !0);
};
function kc(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      if (t.index(e) > 0)
        return t.doc.resolve(t.before(e + 1));
      if (t.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Sp(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("forward", t) : n.parentOffset < n.parent.content.size) ? null : n;
}
const tb = (t, e, n) => {
  let r = Sp(t, n);
  if (!r)
    return !1;
  let s = _c(r);
  if (!s)
    return !1;
  let i = s.nodeAfter;
  if (Ep(t, s, e))
    return !0;
  if (r.parent.content.size == 0 && (Dr(i, "start") || ee.isSelectable(i))) {
    let o = Do(t.doc, r.before(), r.after(), U.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = t.tr.step(o);
        l.setSelection(Dr(i, "start") ? se.findFrom(l.doc.resolve(l.mapping.map(s.pos)), 1) : ee.create(l.doc, l.mapping.map(s.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(t.tr.delete(s.pos, s.pos + i.nodeSize).scrollIntoView()), !0) : !1;
}, nb = (t, e, n) => {
  let { $head: r, empty: s } = t.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("forward", t) : r.parentOffset < r.parent.content.size)
      return !1;
    i = _c(r);
  }
  let o = i && i.nodeAfter;
  return !o || !ee.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(ee.create(t.doc, i.pos)).scrollIntoView()), !0);
};
function _c(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      let n = t.node(e);
      if (t.index(e) + 1 < n.childCount)
        return t.doc.resolve(t.after(e + 1));
      if (n.type.spec.isolating)
        break;
    }
  return null;
}
const rb = (t, e) => {
  let n = t.selection, r = n instanceof ee, s;
  if (r) {
    if (n.node.isTextblock || !Wn(t.doc, n.from))
      return !1;
    s = n.from;
  } else if (s = $o(t.doc, n.from, -1), s == null)
    return !1;
  if (e) {
    let i = t.tr.join(s);
    r && i.setSelection(ee.create(i.doc, s - t.doc.resolve(s).nodeBefore.nodeSize)), e(i.scrollIntoView());
  }
  return !0;
}, sb = (t, e) => {
  let n = t.selection, r;
  if (n instanceof ee) {
    if (n.node.isTextblock || !Wn(t.doc, n.to))
      return !1;
    r = n.to;
  } else if (r = $o(t.doc, n.to, 1), r == null)
    return !1;
  return e && e(t.tr.join(r).scrollIntoView()), !0;
}, ib = (t, e) => {
  let { $from: n, $to: r } = t.selection, s = n.blockRange(r), i = s && Vr(s);
  return i == null ? !1 : (e && e(t.tr.lift(s, i).scrollIntoView()), !0);
}, ob = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (e && e(t.tr.insertText(`
`).scrollIntoView()), !0);
};
function Cp(t) {
  for (let e = 0; e < t.edgeCount; e++) {
    let { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
const lb = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  if (!n.parent.type.spec.code || !n.sameParent(r))
    return !1;
  let s = n.node(-1), i = n.indexAfter(-1), o = Cp(s.contentMatchAt(i));
  if (!o || !s.canReplaceWith(i, i, o))
    return !1;
  if (e) {
    let l = n.after(), a = t.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(se.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, ab = (t, e) => {
  let n = t.selection, { $from: r, $to: s } = n;
  if (n instanceof Ht || r.parent.inlineContent || s.parent.inlineContent)
    return !1;
  let i = Cp(s.parent.contentMatchAt(s.indexAfter()));
  if (!i || !i.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && s.index() < s.parent.childCount ? r : s).pos, l = t.tr.insert(o, i.createAndFill());
    l.setSelection(ne.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, cb = (t, e) => {
  let { $cursor: n } = t.selection;
  if (!n || n.parent.content.size)
    return !1;
  if (n.depth > 1 && n.after() != n.end(-1)) {
    let i = n.before();
    if (Pr(t.doc, i))
      return e && e(t.tr.split(i).scrollIntoView()), !0;
  }
  let r = n.blockRange(), s = r && Vr(r);
  return s == null ? !1 : (e && e(t.tr.lift(r, s).scrollIntoView()), !0);
}, ub = (t, e) => {
  let { $from: n, to: r } = t.selection, s, i = n.sharedDepth(r);
  return i == 0 ? !1 : (s = n.before(i), e && e(t.tr.setSelection(ee.create(t.doc, s))), !0);
};
function db(t, e, n) {
  let r = e.nodeBefore, s = e.nodeAfter, i = e.index();
  return !r || !s || !r.type.compatibleContent(s.type) ? !1 : !r.content.size && e.parent.canReplace(i - 1, i) ? (n && n(t.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(i, i + 1) || !(s.isTextblock || Wn(t.doc, e.pos)) ? !1 : (n && n(t.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Ep(t, e, n) {
  let r = e.nodeBefore, s = e.nodeAfter, i, o;
  if (r.type.spec.isolating || s.type.spec.isolating)
    return !1;
  if (db(t, e, n))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (i = (o = r.contentMatchAt(r.childCount)).findWrapping(s.type)) && o.matchType(i[0] || s.type).validEnd) {
    if (n) {
      let f = e.pos + s.nodeSize, h = H.empty;
      for (let b = i.length - 1; b >= 0; b--)
        h = H.from(i[b].create(null, h));
      h = H.from(r.copy(h));
      let m = t.tr.step(new Je(e.pos - 1, f, e.pos, f, new U(h, 1, 0), i.length, !0)), y = f + 2 * i.length;
      Wn(m.doc, y) && m.join(y), n(m.scrollIntoView());
    }
    return !0;
  }
  let a = se.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), u = c && Vr(c);
  if (u != null && u >= e.depth)
    return n && n(t.tr.lift(c, u).scrollIntoView()), !0;
  if (l && Dr(s, "start", !0) && Dr(r, "end")) {
    let f = r, h = [];
    for (; h.push(f), !f.isTextblock; )
      f = f.lastChild;
    let m = s, y = 1;
    for (; !m.isTextblock; m = m.firstChild)
      y++;
    if (f.canReplace(f.childCount, f.childCount, m.content)) {
      if (n) {
        let b = H.empty;
        for (let C = h.length - 1; C >= 0; C--)
          b = H.from(h[C].copy(b));
        let x = t.tr.step(new Je(e.pos - h.length, e.pos + s.nodeSize, e.pos + y, e.pos + s.nodeSize - y, new U(b, h.length, 0), 0, !0));
        n(x.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Mp(t) {
  return function(e, n) {
    let r = e.selection, s = t < 0 ? r.$from : r.$to, i = s.depth;
    for (; s.node(i).isInline; ) {
      if (!i)
        return !1;
      i--;
    }
    return s.node(i).isTextblock ? (n && n(e.tr.setSelection(ne.create(e.doc, t < 0 ? s.start(i) : s.end(i)))), !0) : !1;
  };
}
const fb = Mp(-1), hb = Mp(1);
function pb(t, e = null) {
  return function(n, r) {
    let { $from: s, $to: i } = n.selection, o = s.blockRange(i), l = o && fc(o, t, e);
    return l ? (r && r(n.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function wd(t, e = null) {
  return function(n, r) {
    let s = !1;
    for (let i = 0; i < n.selection.ranges.length && !s; i++) {
      let { $from: { pos: o }, $to: { pos: l } } = n.selection.ranges[i];
      n.doc.nodesBetween(o, l, (a, c) => {
        if (s)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(t, e)))
          if (a.type == t)
            s = !0;
          else {
            let u = n.doc.resolve(c), f = u.index();
            s = u.parent.canReplaceWith(f, f + 1, t);
          }
      });
    }
    if (!s)
      return !1;
    if (r) {
      let i = n.tr;
      for (let o = 0; o < n.selection.ranges.length; o++) {
        let { $from: { pos: l }, $to: { pos: a } } = n.selection.ranges[o];
        i.setBlockType(l, a, t, e);
      }
      r(i.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function mb(t, e = null) {
  return function(n, r) {
    let { $from: s, $to: i } = n.selection, o = s.blockRange(i), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && s.node(o.depth - 1).type.compatibleContent(t) && o.startIndex == 0) {
      if (s.index(o.depth - 1) == 0)
        return !1;
      let u = n.doc.resolve(o.start - 2);
      a = new ea(u, u, o.depth), o.endIndex < o.parent.childCount && (o = new ea(s, n.doc.resolve(i.end(o.depth)), o.depth)), l = !0;
    }
    let c = fc(a, t, e, o);
    return c ? (r && r(gb(n.tr, o, c, l, t).scrollIntoView()), !0) : !1;
  };
}
function gb(t, e, n, r, s) {
  let i = H.empty;
  for (let u = n.length - 1; u >= 0; u--)
    i = H.from(n[u].type.create(n[u].attrs, i));
  t.step(new Je(e.start - (r ? 2 : 0), e.end, e.start, e.end, new U(i, 0, 0), n.length, !0));
  let o = 0;
  for (let u = 0; u < n.length; u++)
    n[u].type == s && (o = u + 1);
  let l = n.length - o, a = e.start + n.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, f = e.endIndex, h = !0; u < f; u++, h = !1)
    !h && Pr(t.doc, a, l) && (t.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return t;
}
function yb(t) {
  return function(e, n) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (o) => o.childCount > 0 && o.firstChild.type == t);
    return i ? n ? r.node(i.depth - 1).type == t ? bb(e, n, t, i) : vb(e, n, i) : !0 : !1;
  };
}
function bb(t, e, n, r) {
  let s = t.tr, i = r.end, o = r.$to.end(r.depth);
  i < o && (s.step(new Je(i - 1, o, i, o, new U(H.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new ea(s.doc.resolve(r.$from.pos), s.doc.resolve(o), r.depth));
  const l = Vr(r);
  if (l == null)
    return !1;
  s.lift(r, l);
  let a = s.mapping.map(i, -1) - 1;
  return Wn(s.doc, a) && s.join(a), e(s.scrollIntoView()), !0;
}
function vb(t, e, n) {
  let r = t.tr, s = n.parent;
  for (let m = n.end, y = n.endIndex - 1, b = n.startIndex; y > b; y--)
    m -= s.child(y).nodeSize, r.delete(m - 1, m + 1);
  let i = r.doc.resolve(n.start), o = i.nodeAfter;
  if (r.mapping.map(n.end) != n.start + i.nodeAfter.nodeSize)
    return !1;
  let l = n.startIndex == 0, a = n.endIndex == s.childCount, c = i.node(-1), u = i.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, o.content.append(a ? H.empty : H.from(s))))
    return !1;
  let f = i.pos, h = f + o.nodeSize;
  return r.step(new Je(f - (l ? 1 : 0), h + (a ? 1 : 0), f + 1, h - 1, new U((l ? H.empty : H.from(s.copy(H.empty))).append(a ? H.empty : H.from(s.copy(H.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function wb(t) {
  return function(e, n) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (c) => c.childCount > 0 && c.firstChild.type == t);
    if (!i)
      return !1;
    let o = i.startIndex;
    if (o == 0)
      return !1;
    let l = i.parent, a = l.child(o - 1);
    if (a.type != t)
      return !1;
    if (n) {
      let c = a.lastChild && a.lastChild.type == l.type, u = H.from(c ? t.create() : null), f = new U(H.from(t.create(null, H.from(l.type.create(null, u)))), c ? 3 : 1, 0), h = i.start, m = i.end;
      n(e.tr.step(new Je(h - (c ? 3 : 1), m, h, m, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Ap(t) {
  const { state: e, transaction: n } = t;
  let { selection: r } = n, { doc: s } = n, { storedMarks: i } = n;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return r;
    },
    get doc() {
      return s;
    },
    get tr() {
      return r = n.selection, s = n.doc, i = n.storedMarks, n;
    }
  };
}
class xb {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: n, state: r } = this, { view: s } = n, { tr: i } = r, o = this.buildProps(i);
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...u) => {
      const f = a(...u)(o);
      return !i.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(i), f;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, n = !0) {
    const { rawCommands: r, editor: s, state: i } = this, { view: o } = s, l = [], a = !!e, c = e || i.tr, u = () => (!a && n && !c.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(c), l.every((h) => h === !0)), f = {
      ...Object.fromEntries(Object.entries(r).map(([h, m]) => [h, (...b) => {
        const x = this.buildProps(c, n), C = m(...b)(x);
        return l.push(C), f;
      }])),
      run: u
    };
    return f;
  }
  createCan(e) {
    const { rawCommands: n, state: r } = this, s = !1, i = e || r.tr, o = this.buildProps(i, s);
    return {
      ...Object.fromEntries(Object.entries(n).map(([a, c]) => [a, (...u) => c(...u)({ ...o, dispatch: void 0 })])),
      chain: () => this.createChain(i, s)
    };
  }
  buildProps(e, n = !0) {
    const { rawCommands: r, editor: s, state: i } = this, { view: o } = s, l = {
      tr: e,
      editor: s,
      view: o,
      state: Ap({
        state: i,
        transaction: e
      }),
      dispatch: n ? () => {
      } : void 0,
      chain: () => this.createChain(e, n),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([a, c]) => [a, (...u) => c(...u)(l)]));
      }
    };
    return l;
  }
}
function Ne(t, e, n) {
  return t.config[e] === void 0 && t.parent ? Ne(t.parent, e, n) : typeof t.config[e] == "function" ? t.config[e].bind({
    ...n,
    parent: t.parent ? Ne(t.parent, e, n) : null
  }) : t.config[e];
}
function kb(t) {
  const e = t.filter((s) => s.type === "extension"), n = t.filter((s) => s.type === "node"), r = t.filter((s) => s.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: n,
    markExtensions: r
  };
}
function tt(t, e) {
  if (typeof t == "string") {
    if (!e.nodes[t])
      throw Error(`There is no node type named '${t}'. Maybe you forgot to add the extension?`);
    return e.nodes[t];
  }
  return t;
}
function me(...t) {
  return t.filter((e) => !!e).reduce((e, n) => {
    const r = { ...e };
    return Object.entries(n).forEach(([s, i]) => {
      if (!r[s]) {
        r[s] = i;
        return;
      }
      if (s === "class") {
        const l = i ? i.split(" ") : [], a = r[s] ? r[s].split(" ") : [], c = l.filter((u) => !a.includes(u));
        r[s] = [...a, ...c].join(" ");
      } else
        s === "style" ? r[s] = [r[s], i].join("; ") : r[s] = i;
    }), r;
  }, {});
}
function _b(t) {
  return typeof t == "function";
}
function Ee(t, e = void 0, ...n) {
  return _b(t) ? e ? t.bind(e)(...n) : t(...n) : t;
}
function Sb(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}
class Is {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
class Cb {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
function Eb(t) {
  return Object.prototype.toString.call(t).slice(8, -1);
}
function yl(t) {
  return Eb(t) !== "Object" ? !1 : t.constructor === Object && Object.getPrototypeOf(t) === Object.prototype;
}
function Wo(t, e) {
  const n = { ...t };
  return yl(t) && yl(e) && Object.keys(e).forEach((r) => {
    yl(e[r]) ? r in t ? n[r] = Wo(t[r], e[r]) : Object.assign(n, { [r]: e[r] }) : Object.assign(n, { [r]: e[r] });
  }), n;
}
class nt {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Ee(Ne(this, "addOptions", {
      name: this.name
    }))), this.storage = Ee(Ne(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new nt(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = Wo(this.options, e), n.storage = Ee(Ne(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new nt({ ...this.config, ...e });
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Ee(Ne(n, "addOptions", {
      name: n.name
    })), n.storage = Ee(Ne(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function Mb(t, e, n) {
  const { from: r, to: s } = e, { blockSeparator: i = `

`, textSerializers: o = {} } = n || {};
  let l = "", a = !0;
  return t.nodesBetween(r, s, (c, u, f, h) => {
    var m;
    const y = o?.[c.type.name];
    y ? (c.isBlock && !a && (l += i, a = !0), f && (l += y({
      node: c,
      pos: u,
      parent: f,
      index: h,
      range: e
    }))) : c.isText ? (l += (m = c?.text) === null || m === void 0 ? void 0 : m.slice(Math.max(r, u) - u, s - u), a = !1) : c.isBlock && !a && (l += i, a = !0);
  }), l;
}
function Ab(t) {
  return Object.fromEntries(Object.entries(t.nodes).filter(([, e]) => e.spec.toText).map(([e, n]) => [e, n.spec.toText]));
}
nt.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new st({
        key: new it("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: t } = this, { state: e, schema: n } = t, { doc: r, selection: s } = e, { ranges: i } = s, o = Math.min(...i.map((u) => u.$from.pos)), l = Math.max(...i.map((u) => u.$to.pos)), a = Ab(n);
            return Mb(r, { from: o, to: l }, {
              textSerializers: a
            });
          }
        }
      })
    ];
  }
});
const Tb = () => ({ editor: t, view: e }) => (requestAnimationFrame(() => {
  var n;
  t.isDestroyed || (e.dom.blur(), (n = window?.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), Ob = (t = !1) => ({ commands: e }) => e.setContent("", t), jb = () => ({ state: t, tr: e, dispatch: n }) => {
  const { selection: r } = e, { ranges: s } = r;
  return n && s.forEach(({ $from: i, $to: o }) => {
    t.doc.nodesBetween(i.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, f = c.resolve(u.map(a)), h = c.resolve(u.map(a + l.nodeSize)), m = f.blockRange(h);
      if (!m)
        return;
      const y = Vr(m);
      if (l.type.isTextblock) {
        const { defaultType: b } = f.parent.contentMatchAt(f.index());
        e.setNodeMarkup(m.start, b);
      }
      (y || y === 0) && e.lift(m, y);
    });
  }), !0;
}, Rb = (t) => (e) => t(e), Pb = () => ({ state: t, dispatch: e }) => ab(t, e), Ib = (t, e) => ({ editor: n, tr: r }) => {
  const { state: s } = n, i = s.doc.slice(t.from, t.to);
  r.deleteRange(t.from, t.to);
  const o = r.mapping.map(e);
  return r.insert(o, i.content), r.setSelection(new ne(r.doc.resolve(o - 1))), !0;
}, Lb = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, r = n.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const s = t.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === r.type) {
      if (e) {
        const l = s.before(i), a = s.after(i);
        t.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Nb = (t) => ({ tr: e, state: n, dispatch: r }) => {
  const s = tt(t, n.schema), i = e.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === s) {
      if (r) {
        const a = i.before(o), c = i.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, zb = (t) => ({ tr: e, dispatch: n }) => {
  const { from: r, to: s } = t;
  return n && e.delete(r, s), !0;
}, $b = () => ({ state: t, dispatch: e }) => Y2(t, e), Db = () => ({ commands: t }) => t.keyboardShortcut("Enter"), Bb = () => ({ state: t, dispatch: e }) => lb(t, e);
function Li(t, e, n = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((s) => n.strict ? e[s] === t[s] : Sb(e[s]) ? e[s].test(t[s]) : e[s] === t[s]) : !0;
}
function da(t, e, n = {}) {
  return t.find((r) => r.type === e && Li(r.attrs, n));
}
function Hb(t, e, n = {}) {
  return !!da(t, e, n);
}
function Sc(t, e, n = {}) {
  if (!t || !e)
    return;
  let r = t.parent.childAfter(t.parentOffset);
  if (t.parentOffset === r.offset && r.offset !== 0 && (r = t.parent.childBefore(t.parentOffset)), !r.node)
    return;
  const s = da([...r.node.marks], e, n);
  if (!s)
    return;
  let i = r.index, o = t.start() + r.offset, l = i + 1, a = o + r.node.nodeSize;
  for (da([...r.node.marks], e, n); i > 0 && s.isInSet(t.parent.child(i - 1).marks); )
    i -= 1, o -= t.parent.child(i).nodeSize;
  for (; l < t.parent.childCount && Hb([...t.parent.child(l).marks], e, n); )
    a += t.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function Kn(t, e) {
  if (typeof t == "string") {
    if (!e.marks[t])
      throw Error(`There is no mark type named '${t}'. Maybe you forgot to add the extension?`);
    return e.marks[t];
  }
  return t;
}
const Fb = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  const i = Kn(t, r.schema), { doc: o, selection: l } = n, { $from: a, from: c, to: u } = l;
  if (s) {
    const f = Sc(a, i, e);
    if (f && f.from <= c && f.to >= u) {
      const h = ne.create(o, f.from, f.to);
      n.setSelection(h);
    }
  }
  return !0;
}, Wb = (t) => (e) => {
  const n = typeof t == "function" ? t(e) : t;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](e))
      return !0;
  return !1;
};
function Tp(t) {
  return t instanceof ne;
}
function rr(t = 0, e = 0, n = 0) {
  return Math.min(Math.max(t, e), n);
}
function Vb(t, e = null) {
  if (!e)
    return null;
  const n = se.atStart(t), r = se.atEnd(t);
  if (e === "start" || e === !0)
    return n;
  if (e === "end")
    return r;
  const s = n.from, i = r.to;
  return e === "all" ? ne.create(t, rr(0, s, i), rr(t.content.size, s, i)) : ne.create(t, rr(e, s, i), rr(e, s, i));
}
function Cc() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const Kb = (t = null, e = {}) => ({ editor: n, view: r, tr: s, dispatch: i }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    Cc() && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), e?.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && t === null || t === !1)
    return !0;
  if (i && t === null && !Tp(n.state.selection))
    return o(), !0;
  const l = Vb(s.doc, t) || n.state.selection, a = n.state.selection.eq(l);
  return i && (a || s.setSelection(l), a && s.storedMarks && s.setStoredMarks(s.storedMarks), o()), !0;
}, Ub = (t, e) => (n) => t.every((r, s) => e(r, { ...n, index: s })), qb = (t, e) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, t, e), Op = (t) => {
  const e = t.childNodes;
  for (let n = e.length - 1; n >= 0; n -= 1) {
    const r = e[n];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? t.removeChild(r) : r.nodeType === 1 && Op(r);
  }
  return t;
};
function xd(t) {
  const e = `<body>${t}</body>`, n = new window.DOMParser().parseFromString(e, "text/html").body;
  return Op(n);
}
function Ni(t, e, n) {
  if (n = {
    slice: !0,
    parseOptions: {},
    ...n
  }, typeof t == "object" && t !== null)
    try {
      return Array.isArray(t) && t.length > 0 ? H.fromArray(t.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(t);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", t, "Error:", r), Ni("", e, n);
    }
  if (typeof t == "string") {
    const r = Ih.fromSchema(e);
    return n.slice ? r.parseSlice(xd(t), n.parseOptions).content : r.parse(xd(t), n.parseOptions);
  }
  return Ni("", e, n);
}
function Gb(t, e, n) {
  const r = t.steps.length - 1;
  if (r < e)
    return;
  const s = t.steps[r];
  if (!(s instanceof qe || s instanceof Je))
    return;
  const i = t.mapping.maps[r];
  let o = 0;
  i.forEach((l, a, c, u) => {
    o === 0 && (o = u);
  }), t.setSelection(se.near(t.doc.resolve(o), n));
}
const Jb = (t) => t.toString().startsWith("<"), Yb = (t, e, n) => ({ tr: r, dispatch: s, editor: i }) => {
  if (s) {
    n = {
      parseOptions: {},
      updateSelection: !0,
      ...n
    };
    const o = Ni(e, i.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...n.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof t == "number" ? { from: t, to: t } : { from: t.from, to: t.to }, c = !0, u = !0;
    if ((Jb(o) ? o : [o]).forEach((h) => {
      h.check(), c = c ? h.isText && h.marks.length === 0 : !1, u = u ? h.isBlock : !1;
    }), l === a && u) {
      const { parent: h } = r.doc.resolve(l);
      h.isTextblock && !h.type.spec.code && !h.childCount && (l -= 1, a += 1);
    }
    c ? Array.isArray(e) ? r.insertText(e.map((h) => h.text || "").join(""), l, a) : typeof e == "object" && e && e.text ? r.insertText(e.text, l, a) : r.insertText(e, l, a) : r.replaceWith(l, a, o), n.updateSelection && Gb(r, r.steps.length - 1, -1);
  }
  return !0;
}, Xb = () => ({ state: t, dispatch: e }) => rb(t, e), Qb = () => ({ state: t, dispatch: e }) => sb(t, e), Zb = () => ({ state: t, dispatch: e }) => X2(t, e), ev = () => ({ state: t, dispatch: e }) => tb(t, e), tv = () => ({ tr: t, state: e, dispatch: n }) => {
  try {
    const r = $o(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), n && n(t), !0);
  } catch {
    return !1;
  }
}, nv = () => ({ state: t, dispatch: e, tr: n }) => {
  try {
    const r = $o(t.doc, t.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), e && e(n), !0);
  } catch {
    return !1;
  }
}, rv = () => ({ state: t, dispatch: e }) => Q2(t, e), sv = () => ({ state: t, dispatch: e }) => Z2(t, e);
function Ec() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function iv(t) {
  const e = t.split(/-(?!$)/);
  let n = e[e.length - 1];
  n === "Space" && (n = " ");
  let r, s, i, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      s = !0;
    else if (/^s(hift)?$/i.test(a))
      i = !0;
    else if (/^mod$/i.test(a))
      Cc() || Ec() ? o = !0 : s = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (n = `Alt-${n}`), s && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), i && (n = `Shift-${n}`), n;
}
const ov = (t) => ({ editor: e, view: n, tr: r, dispatch: s }) => {
  const i = iv(t).split(/-(?!$)/), o = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: i.includes("Alt"),
    ctrlKey: i.includes("Ctrl"),
    metaKey: i.includes("Meta"),
    shiftKey: i.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    n.someProp("handleKeyDown", (c) => c(n, l));
  });
  return a?.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && s && r.maybeStep(u);
  }), !0;
};
function Mc(t, e, n = {}) {
  const { from: r, to: s, empty: i } = t.selection, o = e ? tt(e, t.schema) : null, l = [];
  t.doc.nodesBetween(r, s, (f, h) => {
    if (f.isText)
      return;
    const m = Math.max(r, h), y = Math.min(s, h + f.nodeSize);
    l.push({
      node: f,
      from: m,
      to: y
    });
  });
  const a = s - r, c = l.filter((f) => o ? o.name === f.node.type.name : !0).filter((f) => Li(f.node.attrs, n, { strict: !1 }));
  return i ? !!c.length : c.reduce((f, h) => f + h.to - h.from, 0) >= a;
}
const lv = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const s = tt(t, n.schema);
  return Mc(n, s, e) ? ib(n, r) : !1;
}, av = () => ({ state: t, dispatch: e }) => cb(t, e), cv = (t) => ({ state: e, dispatch: n }) => {
  const r = tt(t, e.schema);
  return yb(r)(e, n);
}, uv = () => ({ state: t, dispatch: e }) => ob(t, e);
function Ac(t, e) {
  return e.nodes[t] ? "node" : e.marks[t] ? "mark" : null;
}
function kd(t, e) {
  const n = typeof e == "string" ? [e] : e;
  return Object.keys(t).reduce((r, s) => (n.includes(s) || (r[s] = t[s]), r), {});
}
const dv = (t, e) => ({ tr: n, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = Ac(typeof t == "string" ? t : t.name, r.schema);
  return l ? (l === "node" && (i = tt(t, r.schema)), l === "mark" && (o = Kn(t, r.schema)), s && n.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, u) => {
      i && i === c.type && n.setNodeMarkup(u, void 0, kd(c.attrs, e)), o && c.marks.length && c.marks.forEach((f) => {
        o === f.type && n.addMark(u, u + c.nodeSize, o.create(kd(f.attrs, e)));
      });
    });
  }), !0) : !1;
}, fv = () => ({ tr: t, dispatch: e }) => (e && t.scrollIntoView(), !0), hv = () => ({ tr: t, commands: e }) => e.setTextSelection({
  from: 0,
  to: t.doc.content.size
}), pv = () => ({ state: t, dispatch: e }) => eb(t, e), mv = () => ({ state: t, dispatch: e }) => nb(t, e), gv = () => ({ state: t, dispatch: e }) => ub(t, e), yv = () => ({ state: t, dispatch: e }) => hb(t, e), bv = () => ({ state: t, dispatch: e }) => fb(t, e);
function vv(t, e, n = {}) {
  return Ni(t, e, { slice: !1, parseOptions: n });
}
const wv = (t, e = !1, n = {}) => ({ tr: r, editor: s, dispatch: i }) => {
  const { doc: o } = r, l = vv(t, s.schema, n);
  return i && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function Ls(t, e) {
  const n = Kn(e, t.schema), { from: r, to: s, empty: i } = t.selection, o = [];
  i ? (t.storedMarks && o.push(...t.storedMarks), o.push(...t.selection.$head.marks())) : t.doc.nodesBetween(r, s, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === n.name);
  return l ? { ...l.attrs } : {};
}
function xv(t, e) {
  const n = new Gh(t);
  return e.forEach((r) => {
    r.steps.forEach((s) => {
      n.step(s);
    });
  }), n;
}
function kv(t) {
  for (let e = 0; e < t.edgeCount; e += 1) {
    const { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
function _v(t, e, n) {
  const r = [];
  return t.nodesBetween(e.from, e.to, (s, i) => {
    n(s) && r.push({
      node: s,
      pos: i
    });
  }), r;
}
function jp(t, e) {
  for (let n = t.depth; n > 0; n -= 1) {
    const r = t.node(n);
    if (e(r))
      return {
        pos: n > 0 ? t.before(n) : 0,
        start: t.start(n),
        depth: n,
        node: r
      };
  }
}
function Tc(t) {
  return (e) => jp(e.$from, t);
}
function Sv(t, e) {
  const n = tt(e, t.schema), { from: r, to: s } = t.selection, i = [];
  t.doc.nodesBetween(r, s, (l) => {
    i.push(l);
  });
  const o = i.reverse().find((l) => l.type.name === n.name);
  return o ? { ...o.attrs } : {};
}
function Cv(t, e) {
  const n = Ac(typeof e == "string" ? e : e.name, t.schema);
  return n === "node" ? Sv(t, e) : n === "mark" ? Ls(t, e) : {};
}
function Ev(t, e = JSON.stringify) {
  const n = {};
  return t.filter((r) => {
    const s = e(r);
    return Object.prototype.hasOwnProperty.call(n, s) ? !1 : n[s] = !0;
  });
}
function Mv(t) {
  const e = Ev(t);
  return e.length === 1 ? e : e.filter((n, r) => !e.filter((i, o) => o !== r).some((i) => n.oldRange.from >= i.oldRange.from && n.oldRange.to <= i.oldRange.to && n.newRange.from >= i.newRange.from && n.newRange.to <= i.newRange.to));
}
function Av(t) {
  const { mapping: e, steps: n } = t, r = [];
  return e.maps.forEach((s, i) => {
    const o = [];
    if (s.ranges.length)
      s.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = n[i];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(i).map(l, -1), u = e.slice(i).map(a), f = e.invert().map(c, -1), h = e.invert().map(u);
      r.push({
        oldRange: {
          from: f,
          to: h
        },
        newRange: {
          from: c,
          to: u
        }
      });
    });
  }), Mv(r);
}
function Oc(t, e, n) {
  const r = [];
  return t === e ? n.resolve(t).marks().forEach((s) => {
    const i = n.resolve(t - 1), o = Sc(i, s.type);
    o && r.push({
      mark: s,
      ...o
    });
  }) : n.nodesBetween(t, e, (s, i) => {
    !s || s?.nodeSize === void 0 || r.push(...s.marks.map((o) => ({
      from: i,
      to: i + s.nodeSize,
      mark: o
    })));
  }), r;
}
function fi(t, e, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const s = t.find((i) => i.type === e && i.name === r);
    return s ? s.attribute.keepOnSplit : !1;
  }));
}
function Tv(t, e, n = {}) {
  const { empty: r, ranges: s } = t.selection, i = e ? Kn(e, t.schema) : null;
  if (r)
    return !!(t.storedMarks || t.selection.$from.marks()).filter((f) => i ? i.name === f.type.name : !0).find((f) => Li(f.attrs, n, { strict: !1 }));
  let o = 0;
  const l = [];
  if (s.forEach(({ $from: f, $to: h }) => {
    const m = f.pos, y = h.pos;
    t.doc.nodesBetween(m, y, (b, x) => {
      if (!b.isText && !b.marks.length)
        return;
      const C = Math.max(m, x), T = Math.min(y, x + b.nodeSize), O = T - C;
      o += O, l.push(...b.marks.map((d) => ({
        mark: d,
        from: C,
        to: T
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((f) => i ? i.name === f.mark.type.name : !0).filter((f) => Li(f.mark.attrs, n, { strict: !1 })).reduce((f, h) => f + h.to - h.from, 0), c = l.filter((f) => i ? f.mark.type !== i && f.mark.type.excludes(i) : !0).reduce((f, h) => f + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function _d(t, e) {
  const { nodeExtensions: n } = kb(e), r = n.find((o) => o.name === t);
  if (!r)
    return !1;
  const s = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, i = Ee(Ne(r, "group", s));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function Ov(t, e, n) {
  var r;
  const { selection: s } = e;
  let i = null;
  if (Tp(s) && (i = s.$cursor), i) {
    const l = (r = t.storedMarks) !== null && r !== void 0 ? r : i.marks();
    return !!n.isInSet(l) || !l.some((a) => a.type.excludes(n));
  }
  const { ranges: o } = s;
  return o.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? t.doc.inlineContent && t.doc.type.allowsMarkType(n) : !1;
    return t.doc.nodesBetween(l.pos, a.pos, (u, f, h) => {
      if (c)
        return !1;
      if (u.isInline) {
        const m = !h || h.type.allowsMarkType(n), y = !!n.isInSet(u.marks) || !u.marks.some((b) => b.type.excludes(n));
        c = m && y;
      }
      return !c;
    }), c;
  });
}
const jv = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  const { selection: i } = n, { empty: o, ranges: l } = i, a = Kn(t, r.schema);
  if (s)
    if (o) {
      const c = Ls(r, a);
      n.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const u = c.$from.pos, f = c.$to.pos;
        r.doc.nodesBetween(u, f, (h, m) => {
          const y = Math.max(m, u), b = Math.min(m + h.nodeSize, f);
          h.marks.find((C) => C.type === a) ? h.marks.forEach((C) => {
            a === C.type && n.addMark(y, b, a.create({
              ...C.attrs,
              ...e
            }));
          }) : n.addMark(y, b, a.create(e));
        });
      });
  return Ov(r, n, a);
}, Rv = (t, e) => ({ tr: n }) => (n.setMeta(t, e), !0), Pv = (t, e = {}) => ({ state: n, dispatch: r, chain: s }) => {
  const i = tt(t, n.schema);
  return i.isTextblock ? s().command(({ commands: o }) => wd(i, e)(n) ? !0 : o.clearNodes()).command(({ state: o }) => wd(i, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Iv = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, s = rr(t, 0, r.content.size), i = ee.create(r, s);
    e.setSelection(i);
  }
  return !0;
}, Lv = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, { from: s, to: i } = typeof t == "number" ? { from: t, to: t } : t, o = ne.atStart(r).from, l = ne.atEnd(r).to, a = rr(s, o, l), c = rr(i, o, l), u = ne.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, Nv = (t) => ({ state: e, dispatch: n }) => {
  const r = tt(t, e.schema);
  return wb(r)(e, n);
};
function Sd(t, e) {
  const n = t.storedMarks || t.selection.$to.parentOffset && t.selection.$from.marks();
  if (n) {
    const r = n.filter((s) => e?.includes(s.type.name));
    t.tr.ensureMarks(r);
  }
}
const zv = ({ keepMarks: t = !0 } = {}) => ({ tr: e, state: n, dispatch: r, editor: s }) => {
  const { selection: i, doc: o } = e, { $from: l, $to: a } = i, c = s.extensionManager.attributes, u = fi(c, l.node().type.name, l.node().attrs);
  if (i instanceof ee && i.node.isBlock)
    return !l.parentOffset || !Pr(o, l.pos) ? !1 : (r && (t && Sd(n, s.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const f = a.parentOffset === a.parent.content.size;
    i instanceof ne && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : kv(l.node(-1).contentMatchAt(l.indexAfter(-1)));
    let m = f && h ? [
      {
        type: h,
        attrs: u
      }
    ] : void 0, y = Pr(e.doc, e.mapping.map(l.pos), 1, m);
    if (!m && !y && Pr(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (y = !0, m = h ? [
      {
        type: h,
        attrs: u
      }
    ] : void 0), y && (e.split(e.mapping.map(l.pos), 1, m), h && !f && !l.parentOffset && l.parent.type !== h)) {
      const b = e.mapping.map(l.before()), x = e.doc.resolve(b);
      l.node(-1).canReplaceWith(x.index(), x.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    t && Sd(n, s.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, $v = (t) => ({ tr: e, state: n, dispatch: r, editor: s }) => {
  var i;
  const o = tt(t, n.schema), { $from: l, $to: a } = n.selection, c = n.selection.node;
  if (c && c.isBlock || l.depth < 2 || !l.sameParent(a))
    return !1;
  const u = l.node(-1);
  if (u.type !== o)
    return !1;
  const f = s.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== o || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (r) {
      let x = H.empty;
      const C = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let v = l.depth - C; v >= l.depth - 3; v -= 1)
        x = H.from(l.node(v).copy(x));
      const T = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, O = fi(f, l.node().type.name, l.node().attrs), d = ((i = o.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(O)) || void 0;
      x = x.append(H.from(o.createAndFill(null, d) || void 0));
      const g = l.before(l.depth - (C - 1));
      e.replace(g, l.after(-T), new U(x, 4 - C, 0));
      let p = -1;
      e.doc.nodesBetween(g, e.doc.content.size, (v, w) => {
        if (p > -1)
          return !1;
        v.isTextblock && v.content.size === 0 && (p = w + 1);
      }), p > -1 && e.setSelection(ne.near(e.doc.resolve(p))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? u.contentMatchAt(0).defaultType : null, m = fi(f, u.type.name, u.attrs), y = fi(f, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const b = h ? [
    { type: o, attrs: m },
    { type: h, attrs: y }
  ] : [{ type: o, attrs: m }];
  if (!Pr(e.doc, l.pos, 2))
    return !1;
  if (r) {
    const { selection: x, storedMarks: C } = n, { splittableMarks: T } = s.extensionManager, O = C || x.$to.parentOffset && x.$from.marks();
    if (e.split(l.pos, 2, b).scrollIntoView(), !O || !r)
      return !0;
    const d = O.filter((g) => T.includes(g.type.name));
    e.ensureMarks(d);
  }
  return !0;
}, bl = (t, e) => {
  const n = Tc((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const s = t.doc.nodeAt(r);
  return n.node.type === s?.type && Wn(t.doc, n.pos) && t.join(n.pos), !0;
}, vl = (t, e) => {
  const n = Tc((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const s = t.doc.nodeAt(r);
  return n.node.type === s?.type && Wn(t.doc, r) && t.join(r), !0;
}, Dv = (t, e, n, r = {}) => ({ editor: s, tr: i, state: o, dispatch: l, chain: a, commands: c, can: u }) => {
  const { extensions: f, splittableMarks: h } = s.extensionManager, m = tt(t, o.schema), y = tt(e, o.schema), { selection: b, storedMarks: x } = o, { $from: C, $to: T } = b, O = C.blockRange(T), d = x || b.$to.parentOffset && b.$from.marks();
  if (!O)
    return !1;
  const g = Tc((p) => _d(p.type.name, f))(b);
  if (O.depth >= 1 && g && O.depth - g.depth <= 1) {
    if (g.node.type === m)
      return c.liftListItem(y);
    if (_d(g.node.type.name, f) && m.validContent(g.node.content) && l)
      return a().command(() => (i.setNodeMarkup(g.pos, m), !0)).command(() => bl(i, m)).command(() => vl(i, m)).run();
  }
  return !n || !d || !l ? a().command(() => u().wrapInList(m, r) ? !0 : c.clearNodes()).wrapInList(m, r).command(() => bl(i, m)).command(() => vl(i, m)).run() : a().command(() => {
    const p = u().wrapInList(m, r), v = d.filter((w) => h.includes(w.type.name));
    return i.ensureMarks(v), p ? !0 : c.clearNodes();
  }).wrapInList(m, r).command(() => bl(i, m)).command(() => vl(i, m)).run();
}, Bv = (t, e = {}, n = {}) => ({ state: r, commands: s }) => {
  const { extendEmptyMarkRange: i = !1 } = n, o = Kn(t, r.schema);
  return Tv(r, o, e) ? s.unsetMark(o, { extendEmptyMarkRange: i }) : s.setMark(o, e);
}, Hv = (t, e, n = {}) => ({ state: r, commands: s }) => {
  const i = tt(t, r.schema), o = tt(e, r.schema);
  return Mc(r, i, n) ? s.setNode(o) : s.setNode(i, n);
}, Fv = (t, e = {}) => ({ state: n, commands: r }) => {
  const s = tt(t, n.schema);
  return Mc(n, s, e) ? r.lift(s) : r.wrapIn(s, e);
}, Wv = () => ({ state: t, dispatch: e }) => {
  const n = t.plugins;
  for (let r = 0; r < n.length; r += 1) {
    const s = n[r];
    let i;
    if (s.spec.isInputRules && (i = s.getState(t))) {
      if (e) {
        const o = t.tr, l = i.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (i.text) {
          const a = o.doc.resolve(i.from).marks();
          o.replaceWith(i.from, i.to, t.schema.text(i.text, a));
        } else
          o.delete(i.from, i.to);
      }
      return !0;
    }
  }
  return !1;
}, Vv = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, { empty: r, ranges: s } = n;
  return r || e && s.forEach((i) => {
    t.removeMark(i.$from.pos, i.$to.pos);
  }), !0;
}, Kv = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  var i;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = n, a = Kn(t, r.schema), { $from: c, empty: u, ranges: f } = l;
  if (!s)
    return !0;
  if (u && o) {
    let { from: h, to: m } = l;
    const y = (i = c.marks().find((x) => x.type === a)) === null || i === void 0 ? void 0 : i.attrs, b = Sc(c, a, y);
    b && (h = b.from, m = b.to), n.removeMark(h, m, a);
  } else
    f.forEach((h) => {
      n.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return n.removeStoredMark(a), !0;
}, Uv = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = Ac(typeof t == "string" ? t : t.name, r.schema);
  return l ? (l === "node" && (i = tt(t, r.schema)), l === "mark" && (o = Kn(t, r.schema)), s && n.selection.ranges.forEach((a) => {
    const c = a.$from.pos, u = a.$to.pos;
    r.doc.nodesBetween(c, u, (f, h) => {
      i && i === f.type && n.setNodeMarkup(h, void 0, {
        ...f.attrs,
        ...e
      }), o && f.marks.length && f.marks.forEach((m) => {
        if (o === m.type) {
          const y = Math.max(h, c), b = Math.min(h + f.nodeSize, u);
          n.addMark(y, b, o.create({
            ...m.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, qv = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const s = tt(t, n.schema);
  return pb(s, e)(n, r);
}, Gv = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const s = tt(t, n.schema);
  return mb(s, e)(n, r);
};
var Jv = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Tb,
  clearContent: Ob,
  clearNodes: jb,
  command: Rb,
  createParagraphNear: Pb,
  cut: Ib,
  deleteCurrentNode: Lb,
  deleteNode: Nb,
  deleteRange: zb,
  deleteSelection: $b,
  enter: Db,
  exitCode: Bb,
  extendMarkRange: Fb,
  first: Wb,
  focus: Kb,
  forEach: Ub,
  insertContent: qb,
  insertContentAt: Yb,
  joinUp: Xb,
  joinDown: Qb,
  joinBackward: Zb,
  joinForward: ev,
  joinItemBackward: tv,
  joinItemForward: nv,
  joinTextblockBackward: rv,
  joinTextblockForward: sv,
  keyboardShortcut: ov,
  lift: lv,
  liftEmptyBlock: av,
  liftListItem: cv,
  newlineInCode: uv,
  resetAttributes: dv,
  scrollIntoView: fv,
  selectAll: hv,
  selectNodeBackward: pv,
  selectNodeForward: mv,
  selectParentNode: gv,
  selectTextblockEnd: yv,
  selectTextblockStart: bv,
  setContent: wv,
  setMark: jv,
  setMeta: Rv,
  setNode: Pv,
  setNodeSelection: Iv,
  setTextSelection: Lv,
  sinkListItem: Nv,
  splitBlock: zv,
  splitListItem: $v,
  toggleList: Dv,
  toggleMark: Bv,
  toggleNode: Hv,
  toggleWrap: Fv,
  undoInputRule: Wv,
  unsetAllMarks: Vv,
  unsetMark: Kv,
  updateAttributes: Uv,
  wrapIn: qv,
  wrapInList: Gv
});
nt.create({
  name: "commands",
  addCommands() {
    return {
      ...Jv
    };
  }
});
nt.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new st({
        key: new it("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
nt.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: t } = this;
    return [
      new st({
        key: new it("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, n) => {
              t.isFocused = !0;
              const r = t.state.tr.setMeta("focus", { event: n }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, n) => {
              t.isFocused = !1;
              const r = t.state.tr.setMeta("blur", { event: n }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
});
nt.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const t = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: f } = a, { pos: h, parent: m } = f, y = f.parent.isTextblock ? l.doc.resolve(h - 1) : f, b = y.parent.type.spec.isolating, x = f.pos - f.parentOffset, C = b && y.parent.childCount === 1 ? x === f.pos : se.atStart(c).from === h;
        return !u || !C || !m.type.isTextblock || m.textContent.length ? !1 : o.clearNodes();
      }),
      () => o.deleteSelection(),
      () => o.joinBackward(),
      () => o.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: o }) => [
      () => o.deleteSelection(),
      () => o.deleteCurrentNode(),
      () => o.joinForward(),
      () => o.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: o }) => [
        () => o.newlineInCode(),
        () => o.createParagraphNear(),
        () => o.liftEmptyBlock(),
        () => o.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: t,
      "Mod-Backspace": t,
      "Shift-Backspace": t,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, s = {
      ...r
    }, i = {
      ...r,
      "Ctrl-h": t,
      "Alt-Backspace": t,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Cc() || Ec() ? i : s;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new st({
        key: new it("clearDocument"),
        appendTransaction: (t, e, n) => {
          if (!(t.some((y) => y.docChanged) && !e.doc.eq(n.doc)))
            return;
          const { empty: s, from: i, to: o } = e.selection, l = se.atStart(e.doc).from, a = se.atEnd(e.doc).to;
          if (s || !(i === l && o === a) || !(n.doc.textBetween(0, n.doc.content.size, " ", " ").length === 0))
            return;
          const f = n.tr, h = Ap({
            state: n,
            transaction: f
          }), { commands: m } = new xb({
            editor: this.editor,
            state: h
          });
          if (m.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
});
nt.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new st({
        key: new it("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
function cr(t) {
  return new Is({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const s = Ee(t.getAttributes, void 0, r);
      if (s === !1 || s === null)
        return null;
      const { tr: i } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = n.from + l.indexOf(o), u = c + o.length;
        if (Oc(n.from, n.to, e.doc).filter((m) => m.mark.type.excluded.find((b) => b === t.type && b !== m.mark.type)).filter((m) => m.to > c).length)
          return null;
        u < n.to && i.delete(u, n.to), c > n.from && i.delete(n.from + a, c);
        const h = n.from + a + o.length;
        i.addMark(n.from + a, h, t.type.create(s || {})), i.removeStoredMark(t.type);
      }
    }
  });
}
function Rp(t) {
  return new Is({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const s = Ee(t.getAttributes, void 0, r) || {}, { tr: i } = e, o = n.from;
      let l = n.to;
      const a = t.type.create(s);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let u = o + c;
        u > l ? u = l : l = u + r[1].length;
        const f = r[0][r[0].length - 1];
        i.insertText(f, o + r[0].length - 1), i.replaceWith(u, l, a);
      } else
        r[0] && i.insert(o - 1, t.type.create(s)).delete(i.mapping.map(o), i.mapping.map(l));
      i.scrollIntoView();
    }
  });
}
function fa(t) {
  return new Is({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const s = e.doc.resolve(n.from), i = Ee(t.getAttributes, void 0, r) || {};
      if (!s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), t.type))
        return null;
      e.tr.delete(n.from, n.to).setBlockType(n.from, n.from, t.type, i);
    }
  });
}
function Re(t) {
  return new Is({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      let s = t.replace, i = n.from;
      const o = n.to;
      if (r[1]) {
        const l = r[0].lastIndexOf(r[1]);
        s += r[0].slice(l + r[1].length), i += l;
        const a = i - o;
        a > 0 && (s = r[0].slice(l - a, l) + s, i = o);
      }
      e.tr.insertText(s, i, o);
    }
  });
}
function Cs(t) {
  return new Is({
    find: t.find,
    handler: ({ state: e, range: n, match: r, chain: s }) => {
      const i = Ee(t.getAttributes, void 0, r) || {}, o = e.tr.delete(n.from, n.to), a = o.doc.resolve(n.from).blockRange(), c = a && fc(a, t.type, i);
      if (!c)
        return null;
      if (o.wrap(a, c), t.keepMarks && t.editor) {
        const { selection: f, storedMarks: h } = e, { splittableMarks: m } = t.editor.extensionManager, y = h || f.$to.parentOffset && f.$from.marks();
        if (y) {
          const b = y.filter((x) => m.includes(x.type.name));
          o.ensureMarks(b);
        }
      }
      if (t.keepAttributes) {
        const f = t.type.name === "bulletList" || t.type.name === "orderedList" ? "listItem" : "taskList";
        s().updateAttributes(f, i).run();
      }
      const u = o.doc.resolve(n.from - 1).nodeBefore;
      u && u.type === t.type && Wn(o.doc, n.from - 1) && (!t.joinPredicate || t.joinPredicate(r, u)) && o.join(n.from - 1);
    }
  });
}
class Lt {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Ee(Ne(this, "addOptions", {
      name: this.name
    }))), this.storage = Ee(Ne(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Lt(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = Wo(this.options, e), n.storage = Ee(Ne(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Lt({ ...this.config, ...e });
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Ee(Ne(n, "addOptions", {
      name: n.name
    })), n.storage = Ee(Ne(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  static handleExit({ editor: e, mark: n }) {
    const { tr: r } = e.state, s = e.state.selection.$from;
    if (s.pos === s.end()) {
      const o = s.marks();
      if (!!!o.find((c) => c?.type.name === n.name))
        return !1;
      const a = o.find((c) => c?.type.name === n.name);
      return a && r.removeStoredMark(a), r.insertText(" ", s.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
let De = class ha {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Ee(Ne(this, "addOptions", {
      name: this.name
    }))), this.storage = Ee(Ne(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new ha(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = Wo(this.options, e), n.storage = Ee(Ne(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new ha({ ...this.config, ...e });
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Ee(Ne(n, "addOptions", {
      name: n.name
    })), n.storage = Ee(Ne(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
};
function Bn(t) {
  return new Cb({
    find: t.find,
    handler: ({ state: e, range: n, match: r, pasteEvent: s }) => {
      const i = Ee(t.getAttributes, void 0, r, s);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = n.to;
      if (l) {
        const u = a.search(/\S/), f = n.from + a.indexOf(l), h = f + l.length;
        if (Oc(n.from, n.to, e.doc).filter((y) => y.mark.type.excluded.find((x) => x === t.type && x !== y.mark.type)).filter((y) => y.to > f).length)
          return null;
        h < n.to && o.delete(h, n.to), f > n.from && o.delete(n.from + u, f), c = n.from + u + l.length, o.addMark(n.from + u, c, t.type.create(i || {})), o.removeStoredMark(t.type);
      }
    }
  });
}
function Yv(t) {
  return t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
const Xv = /^\s*>\s$/, Qv = De.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: !0,
  parseHTML() {
    return [
      { tag: "blockquote" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["blockquote", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands: t }) => t.wrapIn(this.name),
      toggleBlockquote: () => ({ commands: t }) => t.toggleWrap(this.name),
      unsetBlockquote: () => ({ commands: t }) => t.lift(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
    };
  },
  addInputRules() {
    return [
      Cs({
        find: Xv,
        type: this.type
      })
    ];
  }
}), Zv = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/, e3 = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g, t3 = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/, n3 = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g, r3 = Lt.create({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b",
        getAttrs: (t) => t.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight",
        getAttrs: (t) => /^(bold(er)?|[5-9]\d{2,})$/.test(t) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["strong", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setBold: () => ({ commands: t }) => t.setMark(this.name),
      toggleBold: () => ({ commands: t }) => t.toggleMark(this.name),
      unsetBold: () => ({ commands: t }) => t.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [
      cr({
        find: Zv,
        type: this.type
      }),
      cr({
        find: t3,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Bn({
        find: e3,
        type: this.type
      }),
      Bn({
        find: n3,
        type: this.type
      })
    ];
  }
}), s3 = De.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["li", me(this.options.HTMLAttributes, t), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Cd = Lt.create({
  name: "textStyle",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (t) => t.hasAttribute("style") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["span", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: t, commands: e }) => {
        const n = Ls(t, this.type);
        return Object.entries(n).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), Ed = /^\s*([-+*])\s$/, i3 = De.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      { tag: "ul" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["ul", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(s3.name, this.editor.getAttributes(Cd.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let t = Cs({
      find: Ed,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = Cs({
      find: Ed,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(Cd.name),
      editor: this.editor
    })), [
      t
    ];
  }
}), o3 = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/, l3 = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g, a3 = Lt.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: !0,
  exitable: !0,
  parseHTML() {
    return [
      { tag: "code" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["code", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setCode: () => ({ commands: t }) => t.setMark(this.name),
      toggleCode: () => ({ commands: t }) => t.toggleMark(this.name),
      unsetCode: () => ({ commands: t }) => t.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      cr({
        find: o3,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Bn({
        find: l3,
        type: this.type
      })
    ];
  }
}), c3 = /^```([a-z]+)?[\s\n]$/, u3 = /^~~~([a-z]+)?[\s\n]$/, d3 = De.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (t) => {
          var e;
          const { languageClassPrefix: n } = this.options, i = [...((e = t.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((o) => o.startsWith(n)).map((o) => o.replace(n, ""))[0];
          return i || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: t, HTMLAttributes: e }) {
    return [
      "pre",
      me(this.options.HTMLAttributes, e),
      [
        "code",
        {
          class: t.attrs.language ? this.options.languageClassPrefix + t.attrs.language : null
        },
        0
      ]
    ];
  },
  addCommands() {
    return {
      setCodeBlock: (t) => ({ commands: e }) => e.setNode(this.name, t),
      toggleCodeBlock: (t) => ({ commands: e }) => e.toggleNode(this.name, "paragraph", t)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      // remove code block when at start of document or code block is empty
      Backspace: () => {
        const { empty: t, $anchor: e } = this.editor.state.selection, n = e.pos === 1;
        return !t || e.parent.type.name !== this.name ? !1 : n || !e.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      // exit node on triple enter
      Enter: ({ editor: t }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: e } = t, { selection: n } = e, { $from: r, empty: s } = n;
        if (!s || r.parent.type !== this.type)
          return !1;
        const i = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !i || !o ? !1 : t.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: t }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = t, { selection: n, doc: r } = e, { $from: s, empty: i } = n;
        if (!i || s.parent.type !== this.type || !(s.parentOffset === s.parent.nodeSize - 2))
          return !1;
        const l = s.after();
        return l === void 0 || r.nodeAt(l) ? !1 : t.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      fa({
        find: c3,
        type: this.type,
        getAttributes: (t) => ({
          language: t[1]
        })
      }),
      fa({
        find: u3,
        type: this.type,
        getAttributes: (t) => ({
          language: t[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new st({
        key: new it("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (t, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const n = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), s = r ? JSON.parse(r) : void 0, i = s?.mode;
            if (!n || !i)
              return !1;
            const { tr: o } = t.state;
            return o.replaceSelectionWith(this.type.create({ language: i })), o.setSelection(ne.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(n.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), t.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), f3 = De.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function h3(t = {}) {
  return new st({
    view(e) {
      return new p3(e, t);
    }
  });
}
class p3 {
  constructor(e, n) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = n.width) !== null && r !== void 0 ? r : 1, this.color = n.color === !1 ? void 0 : n.color || "black", this.class = n.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((s) => {
      let i = (o) => {
        this[s](o);
      };
      return e.dom.addEventListener(s, i), { name: s, handler: i };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: n }) => this.editorView.dom.removeEventListener(e, n));
  }
  update(e, n) {
    this.cursorPos != null && n.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), n = !e.parent.inlineContent, r;
    if (n) {
      let l = e.nodeBefore, a = e.nodeAfter;
      if (l || a) {
        let c = this.editorView.nodeDOM(this.cursorPos - (l ? l.nodeSize : 0));
        if (c) {
          let u = c.getBoundingClientRect(), f = l ? u.bottom : u.top;
          l && a && (f = (f + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), r = { left: u.left, right: u.right, top: f - this.width / 2, bottom: f + this.width / 2 };
        }
      }
    }
    if (!r) {
      let l = this.editorView.coordsAtPos(this.cursorPos);
      r = { left: l.left - this.width / 2, right: l.left + this.width / 2, top: l.top, bottom: l.bottom };
    }
    let s = this.editorView.dom.offsetParent;
    this.element || (this.element = s.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", n), this.element.classList.toggle("prosemirror-dropcursor-inline", !n);
    let i, o;
    if (!s || s == document.body && getComputedStyle(s).position == "static")
      i = -pageXOffset, o = -pageYOffset;
    else {
      let l = s.getBoundingClientRect();
      i = l.left - s.scrollLeft, o = l.top - s.scrollTop;
    }
    this.element.style.left = r.left - i + "px", this.element.style.top = r.top - o + "px", this.element.style.width = r.right - r.left + "px", this.element.style.height = r.bottom - r.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let n = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = n && n.inside >= 0 && this.editorView.state.doc.nodeAt(n.inside), s = r && r.type.spec.disableDropCursor, i = typeof s == "function" ? s(this.editorView, n, e) : s;
    if (n && !i) {
      let o = n.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let l = Wh(this.editorView.state.doc, o, this.editorView.dragging.slice);
        l != null && (o = l);
      }
      this.setCursor(o), this.scheduleRemoval(5e3);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    (e.target == this.editorView.dom || !this.editorView.dom.contains(e.relatedTarget)) && this.setCursor(null);
  }
}
const m3 = nt.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      h3(this.options)
    ];
  }
});
class Oe extends se {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    return Oe.valid(r) ? new Oe(r) : se.near(r);
  }
  content() {
    return U.empty;
  }
  eq(e) {
    return e instanceof Oe && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new Oe(e.resolve(n.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new jc(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let n = e.parent;
    if (n.isTextblock || !g3(e) || !y3(e))
      return !1;
    let r = n.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let s = n.contentMatchAt(e.index()).defaultType;
    return s && s.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, n, r = !1) {
    e:
      for (; ; ) {
        if (!r && Oe.valid(e))
          return e;
        let s = e.pos, i = null;
        for (let o = e.depth; ; o--) {
          let l = e.node(o);
          if (n > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
            i = l.child(n > 0 ? e.indexAfter(o) : e.index(o) - 1);
            break;
          } else if (o == 0)
            return null;
          s += n;
          let a = e.doc.resolve(s);
          if (Oe.valid(a))
            return a;
        }
        for (; ; ) {
          let o = n > 0 ? i.firstChild : i.lastChild;
          if (!o) {
            if (i.isAtom && !i.isText && !ee.isSelectable(i)) {
              e = e.doc.resolve(s + i.nodeSize * n), r = !1;
              continue e;
            }
            break;
          }
          i = o, s += n;
          let l = e.doc.resolve(s);
          if (Oe.valid(l))
            return l;
        }
        return null;
      }
  }
}
Oe.prototype.visible = !1;
Oe.findFrom = Oe.findGapCursorFrom;
se.jsonID("gapcursor", Oe);
class jc {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new jc(e.map(this.pos));
  }
  resolve(e) {
    let n = e.resolve(this.pos);
    return Oe.valid(n) ? new Oe(n) : se.near(n);
  }
}
function g3(t) {
  for (let e = t.depth; e >= 0; e--) {
    let n = t.index(e), r = t.node(e);
    if (n == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let s = r.child(n - 1); ; s = s.lastChild) {
      if (s.childCount == 0 && !s.inlineContent || s.isAtom || s.type.spec.isolating)
        return !0;
      if (s.inlineContent)
        return !1;
    }
  }
  return !0;
}
function y3(t) {
  for (let e = t.depth; e >= 0; e--) {
    let n = t.indexAfter(e), r = t.node(e);
    if (n == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let s = r.child(n); ; s = s.firstChild) {
      if (s.childCount == 0 && !s.inlineContent || s.isAtom || s.type.spec.isolating)
        return !0;
      if (s.inlineContent)
        return !1;
    }
  }
  return !0;
}
function b3() {
  return new st({
    props: {
      decorations: k3,
      createSelectionBetween(t, e, n) {
        return e.pos == n.pos && Oe.valid(n) ? new Oe(n) : null;
      },
      handleClick: w3,
      handleKeyDown: v3,
      handleDOMEvents: { beforeinput: x3 }
    }
  });
}
const v3 = xp({
  ArrowLeft: Js("horiz", -1),
  ArrowRight: Js("horiz", 1),
  ArrowUp: Js("vert", -1),
  ArrowDown: Js("vert", 1)
});
function Js(t, e) {
  const n = t == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, s, i) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof ne) {
      if (!i.endOfTextblock(n) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = Oe.findGapCursorFrom(l, e, a);
    return c ? (s && s(r.tr.setSelection(new Oe(c))), !0) : !1;
  };
}
function w3(t, e, n) {
  if (!t || !t.editable)
    return !1;
  let r = t.state.doc.resolve(e);
  if (!Oe.valid(r))
    return !1;
  let s = t.posAtCoords({ left: n.clientX, top: n.clientY });
  return s && s.inside > -1 && ee.isSelectable(t.state.doc.nodeAt(s.inside)) ? !1 : (t.dispatch(t.state.tr.setSelection(new Oe(r))), !0);
}
function x3(t, e) {
  if (e.inputType != "insertCompositionText" || !(t.state.selection instanceof Oe))
    return !1;
  let { $from: n } = t.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(t.state.schema.nodes.text);
  if (!r)
    return !1;
  let s = H.empty;
  for (let o = r.length - 1; o >= 0; o--)
    s = H.from(r[o].createAndFill(null, s));
  let i = t.state.tr.replace(n.pos, n.pos, new U(s, 0, 0));
  return i.setSelection(ne.near(i.doc.resolve(n.pos + 1))), t.dispatch(i), !1;
}
function k3(t) {
  if (!(t.selection instanceof Oe))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", Se.create(t.doc, [bt.widget(t.selection.head, e, { key: "gapcursor" })]);
}
const _3 = nt.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      b3()
    ];
  },
  extendNodeSchema(t) {
    var e;
    const n = {
      name: t.name,
      options: t.options,
      storage: t.storage
    };
    return {
      allowGapCursor: (e = Ee(Ne(t, "allowGapCursor", n))) !== null && e !== void 0 ? e : null
    };
  }
}), S3 = De.create({
  name: "hardBreak",
  addOptions() {
    return {
      keepMarks: !0,
      HTMLAttributes: {}
    };
  },
  inline: !0,
  group: "inline",
  selectable: !1,
  parseHTML() {
    return [
      { tag: "br" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["br", me(this.options.HTMLAttributes, t)];
  },
  renderText() {
    return `
`;
  },
  addCommands() {
    return {
      setHardBreak: () => ({ commands: t, chain: e, state: n, editor: r }) => t.first([
        () => t.exitCode(),
        () => t.command(() => {
          const { selection: s, storedMarks: i } = n;
          if (s.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: l } = r.extensionManager, a = i || s.$to.parentOffset && s.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: u }) => {
            if (u && a && o) {
              const f = a.filter((h) => l.includes(h.type.name));
              c.ensureMarks(f);
            }
            return !0;
          }).run();
        })
      ])
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
}), C3 = De.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: !0,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: !1
      }
    };
  },
  parseHTML() {
    return this.options.levels.map((t) => ({
      tag: `h${t}`,
      attrs: { level: t }
    }));
  },
  renderHTML({ node: t, HTMLAttributes: e }) {
    return [`h${this.options.levels.includes(t.attrs.level) ? t.attrs.level : this.options.levels[0]}`, me(this.options.HTMLAttributes, e), 0];
  },
  addCommands() {
    return {
      setHeading: (t) => ({ commands: e }) => this.options.levels.includes(t.level) ? e.setNode(this.name, t) : !1,
      toggleHeading: (t) => ({ commands: e }) => this.options.levels.includes(t.level) ? e.toggleNode(this.name, "paragraph", t) : !1
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce((t, e) => ({
      ...t,
      [`Mod-Alt-${e}`]: () => this.editor.commands.toggleHeading({ level: e })
    }), {});
  },
  addInputRules() {
    return this.options.levels.map((t) => fa({
      find: new RegExp(`^(#{1,${t}})\\s$`),
      type: this.type,
      getAttributes: {
        level: t
      }
    }));
  }
});
var zi = 200, Ye = function() {
};
Ye.prototype.append = function(e) {
  return e.length ? (e = Ye.from(e), !this.length && e || e.length < zi && this.leafAppend(e) || this.length < zi && e.leafPrepend(this) || this.appendInner(e)) : this;
};
Ye.prototype.prepend = function(e) {
  return e.length ? Ye.from(e).append(this) : this;
};
Ye.prototype.appendInner = function(e) {
  return new E3(this, e);
};
Ye.prototype.slice = function(e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = this.length), e >= n ? Ye.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, n));
};
Ye.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
Ye.prototype.forEach = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length), n <= r ? this.forEachInner(e, n, r, 0) : this.forEachInvertedInner(e, n, r, 0);
};
Ye.prototype.map = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length);
  var s = [];
  return this.forEach(function(i, o) {
    return s.push(e(i, o));
  }, n, r), s;
};
Ye.from = function(e) {
  return e instanceof Ye ? e : e && e.length ? new Pp(e) : Ye.empty;
};
var Pp = /* @__PURE__ */ function(t) {
  function e(r) {
    t.call(this), this.values = r;
  }
  t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
  var n = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(s, i) {
    return s == 0 && i == this.length ? this : new e(this.values.slice(s, i));
  }, e.prototype.getInner = function(s) {
    return this.values[s];
  }, e.prototype.forEachInner = function(s, i, o, l) {
    for (var a = i; a < o; a++)
      if (s(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(s, i, o, l) {
    for (var a = i - 1; a >= o; a--)
      if (s(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(s) {
    if (this.length + s.length <= zi)
      return new e(this.values.concat(s.flatten()));
  }, e.prototype.leafPrepend = function(s) {
    if (this.length + s.length <= zi)
      return new e(s.flatten().concat(this.values));
  }, n.length.get = function() {
    return this.values.length;
  }, n.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, n), e;
}(Ye);
Ye.empty = new Pp([]);
var E3 = /* @__PURE__ */ function(t) {
  function e(n, r) {
    t.call(this), this.left = n, this.right = r, this.length = n.length + r.length, this.depth = Math.max(n.depth, r.depth) + 1;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, s, i, o) {
    var l = this.left.length;
    if (s < l && this.left.forEachInner(r, s, Math.min(i, l), o) === !1 || i > l && this.right.forEachInner(r, Math.max(s - l, 0), Math.min(this.length, i) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, s, i, o) {
    var l = this.left.length;
    if (s > l && this.right.forEachInvertedInner(r, s - l, Math.max(i, l) - l, o + l) === !1 || i < l && this.left.forEachInvertedInner(r, Math.min(s, l), i, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, s) {
    if (r == 0 && s == this.length)
      return this;
    var i = this.left.length;
    return s <= i ? this.left.slice(r, s) : r >= i ? this.right.slice(r - i, s - i) : this.left.slice(r, i).append(this.right.slice(0, s - i));
  }, e.prototype.leafAppend = function(r) {
    var s = this.right.leafAppend(r);
    if (s)
      return new e(this.left, s);
  }, e.prototype.leafPrepend = function(r) {
    var s = this.left.leafPrepend(r);
    if (s)
      return new e(s, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(Ye);
const M3 = 500;
class Dt {
  constructor(e, n) {
    this.items = e, this.eventCount = n;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, n) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let s, i;
    n && (s = this.remapping(r, this.items.length), i = s.maps.length);
    let o = e.tr, l, a, c = [], u = [];
    return this.items.forEach((f, h) => {
      if (!f.step) {
        s || (s = this.remapping(r, h + 1), i = s.maps.length), i--, u.push(f);
        return;
      }
      if (s) {
        u.push(new qt(f.map));
        let m = f.step.map(s.slice(i)), y;
        m && o.maybeStep(m).doc && (y = o.mapping.maps[o.mapping.maps.length - 1], c.push(new qt(y, void 0, void 0, c.length + u.length))), i--, y && s.appendMap(y, i);
      } else
        o.maybeStep(f.step);
      if (f.selection)
        return l = s ? f.selection.map(s.slice(i)) : f.selection, a = new Dt(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, n, r, s) {
    let i = [], o = this.eventCount, l = this.items, a = !s && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let f = e.steps[u].invert(e.docs[u]), h = new qt(e.mapping.maps[u], f, n), m;
      (m = a && a.merge(h)) && (h = m, u ? i.pop() : l = l.slice(0, l.length - 1)), i.push(h), n && (o++, n = void 0), s || (a = h);
    }
    let c = o - r.depth;
    return c > T3 && (l = A3(l, c), o -= c), new Dt(l.append(i), o);
  }
  remapping(e, n) {
    let r = new Rr();
    return this.items.forEach((s, i) => {
      let o = s.mirrorOffset != null && i - s.mirrorOffset >= e ? r.maps.length - s.mirrorOffset : void 0;
      r.appendMap(s.map, o);
    }, e, n), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Dt(this.items.append(e.map((n) => new qt(n))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, n) {
    if (!this.eventCount)
      return this;
    let r = [], s = Math.max(0, this.items.length - n), i = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, s);
    let a = n;
    this.items.forEach((h) => {
      let m = i.getMirror(--a);
      if (m == null)
        return;
      o = Math.min(o, m);
      let y = i.maps[m];
      if (h.step) {
        let b = e.steps[m].invert(e.docs[m]), x = h.selection && h.selection.map(i.slice(a + 1, m));
        x && l++, r.push(new qt(y, b, x));
      } else
        r.push(new qt(y));
    }, s);
    let c = [];
    for (let h = n; h < o; h++)
      c.push(new qt(i.maps[h]));
    let u = this.items.slice(0, s).append(c).append(r), f = new Dt(u, l);
    return f.emptyItemCount() > M3 && (f = f.compress(this.items.length - r.length)), f;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((n) => {
      n.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let n = this.remapping(0, e), r = n.maps.length, s = [], i = 0;
    return this.items.forEach((o, l) => {
      if (l >= e)
        s.push(o), o.selection && i++;
      else if (o.step) {
        let a = o.step.map(n.slice(r)), c = a && a.getMap();
        if (r--, c && n.appendMap(c, r), a) {
          let u = o.selection && o.selection.map(n.slice(r));
          u && i++;
          let f = new qt(c.invert(), a, u), h, m = s.length - 1;
          (h = s.length && s[m].merge(f)) ? s[m] = h : s.push(f);
        }
      } else
        o.map && r--;
    }, this.items.length, 0), new Dt(Ye.from(s.reverse()), i);
  }
}
Dt.empty = new Dt(Ye.empty, 0);
function A3(t, e) {
  let n;
  return t.forEach((r, s) => {
    if (r.selection && e-- == 0)
      return n = s, !1;
  }), t.slice(n);
}
class qt {
  constructor(e, n, r, s) {
    this.map = e, this.step = n, this.selection = r, this.mirrorOffset = s;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let n = e.step.merge(this.step);
      if (n)
        return new qt(n.getMap().invert(), n, this.selection);
    }
  }
}
class En {
  constructor(e, n, r, s, i) {
    this.done = e, this.undone = n, this.prevRanges = r, this.prevTime = s, this.prevComposition = i;
  }
}
const T3 = 20;
function O3(t, e, n, r) {
  let s = n.getMeta(zn), i;
  if (s)
    return s.historyState;
  n.getMeta(R3) && (t = new En(t.done, t.undone, null, 0, -1));
  let o = n.getMeta("appendedTransaction");
  if (n.steps.length == 0)
    return t;
  if (o && o.getMeta(zn))
    return o.getMeta(zn).redo ? new En(t.done.addTransform(n, void 0, r, hi(e)), t.undone, Md(n.mapping.maps[n.steps.length - 1]), t.prevTime, t.prevComposition) : new En(t.done, t.undone.addTransform(n, void 0, r, hi(e)), null, t.prevTime, t.prevComposition);
  if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = n.getMeta("composition"), a = t.prevTime == 0 || !o && t.prevComposition != l && (t.prevTime < (n.time || 0) - r.newGroupDelay || !j3(n, t.prevRanges)), c = o ? wl(t.prevRanges, n.mapping) : Md(n.mapping.maps[n.steps.length - 1]);
    return new En(t.done.addTransform(n, a ? e.selection.getBookmark() : void 0, r, hi(e)), Dt.empty, c, n.time, l ?? t.prevComposition);
  } else
    return (i = n.getMeta("rebased")) ? new En(t.done.rebased(n, i), t.undone.rebased(n, i), wl(t.prevRanges, n.mapping), t.prevTime, t.prevComposition) : new En(t.done.addMaps(n.mapping.maps), t.undone.addMaps(n.mapping.maps), wl(t.prevRanges, n.mapping), t.prevTime, t.prevComposition);
}
function j3(t, e) {
  if (!e)
    return !1;
  if (!t.docChanged)
    return !0;
  let n = !1;
  return t.mapping.maps[0].forEach((r, s) => {
    for (let i = 0; i < e.length; i += 2)
      r <= e[i + 1] && s >= e[i] && (n = !0);
  }), n;
}
function Md(t) {
  let e = [];
  return t.forEach((n, r, s, i) => e.push(s, i)), e;
}
function wl(t, e) {
  if (!t)
    return null;
  let n = [];
  for (let r = 0; r < t.length; r += 2) {
    let s = e.map(t[r], 1), i = e.map(t[r + 1], -1);
    s <= i && n.push(s, i);
  }
  return n;
}
function Ip(t, e, n, r) {
  let s = hi(e), i = zn.get(e).spec.config, o = (r ? t.undone : t.done).popEvent(e, s);
  if (!o)
    return;
  let l = o.selection.resolve(o.transform.doc), a = (r ? t.done : t.undone).addTransform(o.transform, e.selection.getBookmark(), i, s), c = new En(r ? a : o.remaining, r ? o.remaining : a, null, 0, -1);
  n(o.transform.setSelection(l).setMeta(zn, { redo: r, historyState: c }).scrollIntoView());
}
let xl = !1, Ad = null;
function hi(t) {
  let e = t.plugins;
  if (Ad != e) {
    xl = !1, Ad = e;
    for (let n = 0; n < e.length; n++)
      if (e[n].spec.historyPreserveItems) {
        xl = !0;
        break;
      }
  }
  return xl;
}
const zn = new it("history"), R3 = new it("closeHistory");
function P3(t = {}) {
  return t = {
    depth: t.depth || 100,
    newGroupDelay: t.newGroupDelay || 500
  }, new st({
    key: zn,
    state: {
      init() {
        return new En(Dt.empty, Dt.empty, null, 0, -1);
      },
      apply(e, n, r) {
        return O3(n, r, e, t);
      }
    },
    config: t,
    props: {
      handleDOMEvents: {
        beforeinput(e, n) {
          let r = n.inputType, s = r == "historyUndo" ? Lp : r == "historyRedo" ? Np : null;
          return s ? (n.preventDefault(), s(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const Lp = (t, e) => {
  let n = zn.getState(t);
  return !n || n.done.eventCount == 0 ? !1 : (e && Ip(n, t, e, !1), !0);
}, Np = (t, e) => {
  let n = zn.getState(t);
  return !n || n.undone.eventCount == 0 ? !1 : (e && Ip(n, t, e, !0), !0);
}, I3 = nt.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: t, dispatch: e }) => Lp(t, e),
      redo: () => ({ state: t, dispatch: e }) => Np(t, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      P3(this.options)
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
}), L3 = De.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["hr", me(this.options.HTMLAttributes, t)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: t, state: e }) => {
        const { $to: n } = e.selection, r = t();
        return n.parentOffset === 0 ? r.insertContentAt(Math.max(n.pos - 2, 0), { type: this.name }) : r.insertContent({ type: this.name }), r.command(({ tr: s, dispatch: i }) => {
          var o;
          if (i) {
            const { $to: l } = s.selection, a = l.end();
            if (l.nodeAfter)
              l.nodeAfter.isTextblock ? s.setSelection(ne.create(s.doc, l.pos + 1)) : l.nodeAfter.isBlock ? s.setSelection(ee.create(s.doc, l.pos)) : s.setSelection(ne.create(s.doc, l.pos));
            else {
              const c = (o = l.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (s.insert(a, c), s.setSelection(ne.create(s.doc, a + 1)));
            }
            s.scrollIntoView();
          }
          return !0;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      Rp({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), N3 = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/, z3 = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g, $3 = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/, D3 = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g, B3 = Lt.create({
  name: "italic",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "em"
      },
      {
        tag: "i",
        getAttrs: (t) => t.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=italic"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["em", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands: t }) => t.setMark(this.name),
      toggleItalic: () => ({ commands: t }) => t.toggleMark(this.name),
      unsetItalic: () => ({ commands: t }) => t.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [
      cr({
        find: N3,
        type: this.type
      }),
      cr({
        find: $3,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Bn({
        find: z3,
        type: this.type
      }),
      Bn({
        find: D3,
        type: this.type
      })
    ];
  }
}), H3 = De.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["li", me(this.options.HTMLAttributes, t), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), F3 = De.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["li", me(this.options.HTMLAttributes, t), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Td = Lt.create({
  name: "textStyle",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (t) => t.hasAttribute("style") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["span", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: t, commands: e }) => {
        const n = Ls(t, this.type);
        return Object.entries(n).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), Od = /^(\d+)\.\s$/, W3 = De.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: !1,
      keepAttributes: !1
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (t) => t.hasAttribute("start") ? parseInt(t.getAttribute("start") || "", 10) : 1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    const { start: e, ...n } = t;
    return e === 1 ? ["ol", me(this.options.HTMLAttributes, n), 0] : ["ol", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(F3.name, this.editor.getAttributes(Td.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let t = Cs({
      find: Od,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = Cs({
      find: Od,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(Td.name) }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1],
      editor: this.editor
    })), [
      t
    ];
  }
}), V3 = De.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      { tag: "p" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["p", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands: t }) => t.setNode(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
}), K3 = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/, U3 = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g, q3 = Lt.create({
  name: "strike",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "s"
      },
      {
        tag: "del"
      },
      {
        tag: "strike"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (t) => t.includes("line-through") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["s", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setStrike: () => ({ commands: t }) => t.setMark(this.name),
      toggleStrike: () => ({ commands: t }) => t.toggleMark(this.name),
      unsetStrike: () => ({ commands: t }) => t.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    const t = {};
    return Ec() ? t["Mod-Shift-s"] = () => this.editor.commands.toggleStrike() : t["Ctrl-Shift-s"] = () => this.editor.commands.toggleStrike(), t;
  },
  addInputRules() {
    return [
      cr({
        find: K3,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Bn({
        find: U3,
        type: this.type
      })
    ];
  }
}), G3 = De.create({
  name: "text",
  group: "inline"
});
nt.create({
  name: "starterKit",
  addExtensions() {
    var t, e, n, r, s, i, o, l, a, c, u, f, h, m, y, b, x, C;
    const T = [];
    return this.options.blockquote !== !1 && T.push(Qv.configure((t = this.options) === null || t === void 0 ? void 0 : t.blockquote)), this.options.bold !== !1 && T.push(r3.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && T.push(i3.configure((n = this.options) === null || n === void 0 ? void 0 : n.bulletList)), this.options.code !== !1 && T.push(a3.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && T.push(d3.configure((s = this.options) === null || s === void 0 ? void 0 : s.codeBlock)), this.options.document !== !1 && T.push(f3.configure((i = this.options) === null || i === void 0 ? void 0 : i.document)), this.options.dropcursor !== !1 && T.push(m3.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && T.push(_3.configure((l = this.options) === null || l === void 0 ? void 0 : l.gapcursor)), this.options.hardBreak !== !1 && T.push(S3.configure((a = this.options) === null || a === void 0 ? void 0 : a.hardBreak)), this.options.heading !== !1 && T.push(C3.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && T.push(I3.configure((u = this.options) === null || u === void 0 ? void 0 : u.history)), this.options.horizontalRule !== !1 && T.push(L3.configure((f = this.options) === null || f === void 0 ? void 0 : f.horizontalRule)), this.options.italic !== !1 && T.push(B3.configure((h = this.options) === null || h === void 0 ? void 0 : h.italic)), this.options.listItem !== !1 && T.push(H3.configure((m = this.options) === null || m === void 0 ? void 0 : m.listItem)), this.options.orderedList !== !1 && T.push(W3.configure((y = this.options) === null || y === void 0 ? void 0 : y.orderedList)), this.options.paragraph !== !1 && T.push(V3.configure((b = this.options) === null || b === void 0 ? void 0 : b.paragraph)), this.options.strike !== !1 && T.push(q3.configure((x = this.options) === null || x === void 0 ? void 0 : x.strike)), this.options.text !== !1 && T.push(G3.configure((C = this.options) === null || C === void 0 ? void 0 : C.text)), T;
  }
});
nt.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      placeholder: "Write something …",
      showOnlyWhenEditable: !0,
      considerAnyAsEmpty: !1,
      showOnlyCurrent: !0,
      includeChildren: !1
    };
  },
  addProseMirrorPlugins() {
    return [
      new st({
        key: new it("placeholder"),
        props: {
          decorations: ({ doc: t, selection: e }) => {
            var n;
            const r = this.editor.isEditable || !this.options.showOnlyWhenEditable, { anchor: s } = e, i = [];
            if (!r)
              return null;
            const { firstChild: o } = t.content, l = o && o.type.isLeaf, a = o && o.isAtom, c = this.options.considerAnyAsEmpty ? !0 : o && o.type.name === ((n = t.type.contentMatch.defaultType) === null || n === void 0 ? void 0 : n.name), u = t.content.childCount <= 1 && o && c && o.nodeSize <= 2 && (!l || !a);
            return t.descendants((f, h) => {
              const m = s >= h && s <= h + f.nodeSize, y = !f.isLeaf && !f.childCount;
              if ((m || !this.options.showOnlyCurrent) && y) {
                const b = [this.options.emptyNodeClass];
                u && b.push(this.options.emptyEditorClass);
                const x = bt.node(h, h + f.nodeSize, {
                  class: b.join(" "),
                  "data-placeholder": typeof this.options.placeholder == "function" ? this.options.placeholder({
                    editor: this.editor,
                    node: f,
                    pos: h,
                    hasAnchor: m
                  }) : this.options.placeholder
                });
                i.push(x);
              }
              return this.options.includeChildren;
            }), Se.create(t, i);
          }
        }
      })
    ];
  }
});
nt.create({
  name: "textAlign",
  addOptions() {
    return {
      types: [],
      alignments: ["left", "center", "right", "justify"],
      defaultAlignment: "left"
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (t) => t.style.textAlign || this.options.defaultAlignment,
            renderHTML: (t) => t.textAlign === this.options.defaultAlignment ? {} : { style: `text-align: ${t.textAlign}` }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setTextAlign: (t) => ({ commands: e }) => this.options.alignments.includes(t) ? this.options.types.every((n) => e.updateAttributes(n, { textAlign: t })) : !1,
      unsetTextAlign: () => ({ commands: t }) => this.options.types.every((e) => t.resetAttributes(e, "textAlign"))
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-l": () => this.editor.commands.setTextAlign("left"),
      "Mod-Shift-e": () => this.editor.commands.setTextAlign("center"),
      "Mod-Shift-r": () => this.editor.commands.setTextAlign("right"),
      "Mod-Shift-j": () => this.editor.commands.setTextAlign("justify")
    };
  }
});
var pa, ma;
if (typeof WeakMap < "u") {
  let t = /* @__PURE__ */ new WeakMap();
  pa = (e) => t.get(e), ma = (e, n) => (t.set(e, n), n);
} else {
  const t = [];
  let n = 0;
  pa = (r) => {
    for (let s = 0; s < t.length; s += 2)
      if (t[s] == r)
        return t[s + 1];
  }, ma = (r, s) => (n == 10 && (n = 0), t[n++] = r, t[n++] = s);
}
var je = class {
  constructor(t, e, n, r) {
    this.width = t, this.height = e, this.map = n, this.problems = r;
  }
  // Find the dimensions of the cell at the given position.
  findCell(t) {
    for (let e = 0; e < this.map.length; e++) {
      const n = this.map[e];
      if (n != t)
        continue;
      const r = e % this.width, s = e / this.width | 0;
      let i = r + 1, o = s + 1;
      for (let l = 1; i < this.width && this.map[e + l] == n; l++)
        i++;
      for (let l = 1; o < this.height && this.map[e + this.width * l] == n; l++)
        o++;
      return { left: r, top: s, right: i, bottom: o };
    }
    throw new RangeError(`No cell with offset ${t} found`);
  }
  // Find the left side of the cell at the given position.
  colCount(t) {
    for (let e = 0; e < this.map.length; e++)
      if (this.map[e] == t)
        return e % this.width;
    throw new RangeError(`No cell with offset ${t} found`);
  }
  // Find the next cell in the given direction, starting from the cell
  // at `pos`, if any.
  nextCell(t, e, n) {
    const { left: r, right: s, top: i, bottom: o } = this.findCell(t);
    return e == "horiz" ? (n < 0 ? r == 0 : s == this.width) ? null : this.map[i * this.width + (n < 0 ? r - 1 : s)] : (n < 0 ? i == 0 : o == this.height) ? null : this.map[r + this.width * (n < 0 ? i - 1 : o)];
  }
  // Get the rectangle spanning the two given cells.
  rectBetween(t, e) {
    const {
      left: n,
      right: r,
      top: s,
      bottom: i
    } = this.findCell(t), {
      left: o,
      right: l,
      top: a,
      bottom: c
    } = this.findCell(e);
    return {
      left: Math.min(n, o),
      top: Math.min(s, a),
      right: Math.max(r, l),
      bottom: Math.max(i, c)
    };
  }
  // Return the position of all cells that have the top left corner in
  // the given rectangle.
  cellsInRect(t) {
    const e = [], n = {};
    for (let r = t.top; r < t.bottom; r++)
      for (let s = t.left; s < t.right; s++) {
        const i = r * this.width + s, o = this.map[i];
        n[o] || (n[o] = !0, !(s == t.left && s && this.map[i - 1] == o || r == t.top && r && this.map[i - this.width] == o) && e.push(o));
      }
    return e;
  }
  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  positionAt(t, e, n) {
    for (let r = 0, s = 0; ; r++) {
      const i = s + n.child(r).nodeSize;
      if (r == t) {
        let o = e + t * this.width;
        const l = (t + 1) * this.width;
        for (; o < l && this.map[o] < s; )
          o++;
        return o == l ? i - 1 : this.map[o];
      }
      s = i;
    }
  }
  // Find the table map for the given table node.
  static get(t) {
    return pa(t) || ma(t, J3(t));
  }
};
function J3(t) {
  if (t.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + t.type.name);
  const e = Y3(t), n = t.childCount, r = [];
  let s = 0, i = null;
  const o = [];
  for (let c = 0, u = e * n; c < u; c++)
    r[c] = 0;
  for (let c = 0, u = 0; c < n; c++) {
    const f = t.child(c);
    u++;
    for (let y = 0; ; y++) {
      for (; s < r.length && r[s] != 0; )
        s++;
      if (y == f.childCount)
        break;
      const b = f.child(y), { colspan: x, rowspan: C, colwidth: T } = b.attrs;
      for (let O = 0; O < C; O++) {
        if (O + c >= n) {
          (i || (i = [])).push({
            type: "overlong_rowspan",
            pos: u,
            n: C - O
          });
          break;
        }
        const d = s + O * e;
        for (let g = 0; g < x; g++) {
          r[d + g] == 0 ? r[d + g] = u : (i || (i = [])).push({
            type: "collision",
            row: c,
            pos: u,
            n: x - g
          });
          const p = T && T[g];
          if (p) {
            const v = (d + g) % e * 2, w = o[v];
            w == null || w != p && o[v + 1] == 1 ? (o[v] = p, o[v + 1] = 1) : w == p && o[v + 1]++;
          }
        }
      }
      s += x, u += b.nodeSize;
    }
    const h = (c + 1) * e;
    let m = 0;
    for (; s < h; )
      r[s++] == 0 && m++;
    m && (i || (i = [])).push({ type: "missing", row: c, n: m }), u++;
  }
  const l = new je(e, n, r, i);
  let a = !1;
  for (let c = 0; !a && c < o.length; c += 2)
    o[c] != null && o[c + 1] < n && (a = !0);
  return a && X3(l, o, t), l;
}
function Y3(t) {
  let e = -1, n = !1;
  for (let r = 0; r < t.childCount; r++) {
    const s = t.child(r);
    let i = 0;
    if (n)
      for (let o = 0; o < r; o++) {
        const l = t.child(o);
        for (let a = 0; a < l.childCount; a++) {
          const c = l.child(a);
          o + c.attrs.rowspan > r && (i += c.attrs.colspan);
        }
      }
    for (let o = 0; o < s.childCount; o++) {
      const l = s.child(o);
      i += l.attrs.colspan, l.attrs.rowspan > 1 && (n = !0);
    }
    e == -1 ? e = i : e != i && (e = Math.max(e, i));
  }
  return e;
}
function X3(t, e, n) {
  t.problems || (t.problems = []);
  const r = {};
  for (let s = 0; s < t.map.length; s++) {
    const i = t.map[s];
    if (r[i])
      continue;
    r[i] = !0;
    const o = n.nodeAt(i);
    if (!o)
      throw new RangeError(`No cell with offset ${i} found`);
    let l = null;
    const a = o.attrs;
    for (let c = 0; c < a.colspan; c++) {
      const u = (s + c) % t.width, f = e[u * 2];
      f != null && (!a.colwidth || a.colwidth[c] != f) && ((l || (l = Q3(a)))[c] = f);
    }
    l && t.problems.unshift({
      type: "colwidth mismatch",
      pos: i,
      colwidth: l
    });
  }
}
function Q3(t) {
  if (t.colwidth)
    return t.colwidth.slice();
  const e = [];
  for (let n = 0; n < t.colspan; n++)
    e.push(0);
  return e;
}
function ct(t) {
  let e = t.cached.tableNodeTypes;
  if (!e) {
    e = t.cached.tableNodeTypes = {};
    for (const n in t.nodes) {
      const r = t.nodes[n], s = r.spec.tableRole;
      s && (e[s] = r);
    }
  }
  return e;
}
var An = new it("selectingCells");
function Kr(t) {
  for (let e = t.depth - 1; e > 0; e--)
    if (t.node(e).type.spec.tableRole == "row")
      return t.node(0).resolve(t.before(e + 1));
  return null;
}
function Z3(t) {
  for (let e = t.depth; e > 0; e--) {
    const n = t.node(e).type.spec.tableRole;
    if (n === "cell" || n === "header_cell")
      return t.node(e);
  }
  return null;
}
function Wt(t) {
  const e = t.selection.$head;
  for (let n = e.depth; n > 0; n--)
    if (e.node(n).type.spec.tableRole == "row")
      return !0;
  return !1;
}
function Vo(t) {
  const e = t.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const n = Kr(e.$head) || ew(e.$head);
  if (n)
    return n;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function ew(t) {
  for (let e = t.nodeAfter, n = t.pos; e; e = e.firstChild, n++) {
    const r = e.type.spec.tableRole;
    if (r == "cell" || r == "header_cell")
      return t.doc.resolve(n);
  }
  for (let e = t.nodeBefore, n = t.pos; e; e = e.lastChild, n--) {
    const r = e.type.spec.tableRole;
    if (r == "cell" || r == "header_cell")
      return t.doc.resolve(n - e.nodeSize);
  }
}
function ga(t) {
  return t.parent.type.spec.tableRole == "row" && !!t.nodeAfter;
}
function tw(t) {
  return t.node(0).resolve(t.pos + t.nodeAfter.nodeSize);
}
function Rc(t, e) {
  return t.depth == e.depth && t.pos >= e.start(-1) && t.pos <= e.end(-1);
}
function zp(t, e, n) {
  const r = t.node(-1), s = je.get(r), i = t.start(-1), o = s.nextCell(t.pos - i, e, n);
  return o == null ? null : t.node(0).resolve(i + o);
}
function ur(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan - n };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, n), r.colwidth.some((s) => s > 0) || (r.colwidth = null)), r;
}
function $p(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan + n };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let s = 0; s < n; s++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function nw(t, e, n) {
  const r = ct(e.type.schema).header_cell;
  for (let s = 0; s < t.height; s++)
    if (e.nodeAt(t.map[n + s * t.width]).type != r)
      return !1;
  return !0;
}
var be = class an extends se {
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  constructor(e, n = e) {
    const r = e.node(-1), s = je.get(r), i = e.start(-1), o = s.rectBetween(
      e.pos - i,
      n.pos - i
    ), l = e.node(0), a = s.cellsInRect(o).filter((u) => u != n.pos - i);
    a.unshift(n.pos - i);
    const c = a.map((u) => {
      const f = r.nodeAt(u);
      if (!f)
        throw RangeError(`No cell with offset ${u} found`);
      const h = i + u + 1;
      return new Jh(
        l.resolve(h),
        l.resolve(h + f.content.size)
      );
    });
    super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = n;
  }
  map(e, n) {
    const r = e.resolve(n.map(this.$anchorCell.pos)), s = e.resolve(n.map(this.$headCell.pos));
    if (ga(r) && ga(s) && Rc(r, s)) {
      const i = this.$anchorCell.node(-1) != r.node(-1);
      return i && this.isRowSelection() ? an.rowSelection(r, s) : i && this.isColSelection() ? an.colSelection(r, s) : new an(r, s);
    }
    return ne.between(r, s);
  }
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  content() {
    const e = this.$anchorCell.node(-1), n = je.get(e), r = this.$anchorCell.start(-1), s = n.rectBetween(
      this.$anchorCell.pos - r,
      this.$headCell.pos - r
    ), i = {}, o = [];
    for (let a = s.top; a < s.bottom; a++) {
      const c = [];
      for (let u = a * n.width + s.left, f = s.left; f < s.right; f++, u++) {
        const h = n.map[u];
        if (i[h])
          continue;
        i[h] = !0;
        const m = n.findCell(h);
        let y = e.nodeAt(h);
        if (!y)
          throw RangeError(`No cell with offset ${h} found`);
        const b = s.left - m.left, x = m.right - s.right;
        if (b > 0 || x > 0) {
          let C = y.attrs;
          if (b > 0 && (C = ur(C, 0, b)), x > 0 && (C = ur(
            C,
            C.colspan - x,
            x
          )), m.left < s.left) {
            if (y = y.type.createAndFill(C), !y)
              throw RangeError(
                `Could not create cell with attrs ${JSON.stringify(C)}`
              );
          } else
            y = y.type.create(C, y.content);
        }
        if (m.top < s.top || m.bottom > s.bottom) {
          const C = {
            ...y.attrs,
            rowspan: Math.min(m.bottom, s.bottom) - Math.max(m.top, s.top)
          };
          m.top < s.top ? y = y.type.createAndFill(C) : y = y.type.create(C, y.content);
        }
        c.push(y);
      }
      o.push(e.child(a).copy(H.from(c)));
    }
    const l = this.isColSelection() && this.isRowSelection() ? e : o;
    return new U(H.from(l), 1, 1);
  }
  replace(e, n = U.empty) {
    const r = e.steps.length, s = this.ranges;
    for (let o = 0; o < s.length; o++) {
      const { $from: l, $to: a } = s[o], c = e.mapping.slice(r);
      e.replace(
        c.map(l.pos),
        c.map(a.pos),
        o ? U.empty : n
      );
    }
    const i = se.findFrom(
      e.doc.resolve(e.mapping.slice(r).map(this.to)),
      -1
    );
    i && e.setSelection(i);
  }
  replaceWith(e, n) {
    this.replace(e, new U(H.from(n), 0, 0));
  }
  forEachCell(e) {
    const n = this.$anchorCell.node(-1), r = je.get(n), s = this.$anchorCell.start(-1), i = r.cellsInRect(
      r.rectBetween(
        this.$anchorCell.pos - s,
        this.$headCell.pos - s
      )
    );
    for (let o = 0; o < i.length; o++)
      e(n.nodeAt(i[o]), s + i[o]);
  }
  // True if this selection goes all the way from the top to the
  // bottom of the table.
  isColSelection() {
    const e = this.$anchorCell.index(-1), n = this.$headCell.index(-1);
    if (Math.min(e, n) > 0)
      return !1;
    const r = e + this.$anchorCell.nodeAfter.attrs.rowspan, s = n + this.$headCell.nodeAfter.attrs.rowspan;
    return Math.max(r, s) == this.$headCell.node(-1).childCount;
  }
  // Returns the smallest column selection that covers the given anchor
  // and head cell.
  static colSelection(e, n = e) {
    const r = e.node(-1), s = je.get(r), i = e.start(-1), o = s.findCell(e.pos - i), l = s.findCell(n.pos - i), a = e.node(0);
    return o.top <= l.top ? (o.top > 0 && (e = a.resolve(i + s.map[o.left])), l.bottom < s.height && (n = a.resolve(
      i + s.map[s.width * (s.height - 1) + l.right - 1]
    ))) : (l.top > 0 && (n = a.resolve(i + s.map[l.left])), o.bottom < s.height && (e = a.resolve(
      i + s.map[s.width * (s.height - 1) + o.right - 1]
    ))), new an(e, n);
  }
  // True if this selection goes all the way from the left to the
  // right of the table.
  isRowSelection() {
    const e = this.$anchorCell.node(-1), n = je.get(e), r = this.$anchorCell.start(-1), s = n.colCount(this.$anchorCell.pos - r), i = n.colCount(this.$headCell.pos - r);
    if (Math.min(s, i) > 0)
      return !1;
    const o = s + this.$anchorCell.nodeAfter.attrs.colspan, l = i + this.$headCell.nodeAfter.attrs.colspan;
    return Math.max(o, l) == n.width;
  }
  eq(e) {
    return e instanceof an && e.$anchorCell.pos == this.$anchorCell.pos && e.$headCell.pos == this.$headCell.pos;
  }
  // Returns the smallest row selection that covers the given anchor
  // and head cell.
  static rowSelection(e, n = e) {
    const r = e.node(-1), s = je.get(r), i = e.start(-1), o = s.findCell(e.pos - i), l = s.findCell(n.pos - i), a = e.node(0);
    return o.left <= l.left ? (o.left > 0 && (e = a.resolve(
      i + s.map[o.top * s.width]
    )), l.right < s.width && (n = a.resolve(
      i + s.map[s.width * (l.top + 1) - 1]
    ))) : (l.left > 0 && (n = a.resolve(i + s.map[l.top * s.width])), o.right < s.width && (e = a.resolve(
      i + s.map[s.width * (o.top + 1) - 1]
    ))), new an(e, n);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(e, n) {
    return new an(e.resolve(n.anchor), e.resolve(n.head));
  }
  static create(e, n, r = n) {
    return new an(e.resolve(n), e.resolve(r));
  }
  getBookmark() {
    return new rw(this.$anchorCell.pos, this.$headCell.pos);
  }
};
be.prototype.visible = !1;
se.jsonID("cell", be);
var rw = class Dp {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new Dp(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    const n = e.resolve(this.anchor), r = e.resolve(this.head);
    return n.parent.type.spec.tableRole == "row" && r.parent.type.spec.tableRole == "row" && n.index() < n.parent.childCount && r.index() < r.parent.childCount && Rc(n, r) ? new be(n, r) : se.near(r, 1);
  }
};
function sw(t) {
  if (!(t.selection instanceof be))
    return null;
  const e = [];
  return t.selection.forEachCell((n, r) => {
    e.push(
      bt.node(r, r + n.nodeSize, { class: "selectedCell" })
    );
  }), Se.create(t.doc, e);
}
function iw({ $from: t, $to: e }) {
  if (t.pos == e.pos || t.pos < t.pos - 6)
    return !1;
  let n = t.pos, r = e.pos, s = t.depth;
  for (; s >= 0 && !(t.after(s + 1) < t.end(s)); s--, n++)
    ;
  for (let i = e.depth; i >= 0 && !(e.before(i + 1) > e.start(i)); i--, r--)
    ;
  return n == r && /row|table/.test(t.node(s).type.spec.tableRole);
}
function ow({ $from: t, $to: e }) {
  let n, r;
  for (let s = t.depth; s > 0; s--) {
    const i = t.node(s);
    if (i.type.spec.tableRole === "cell" || i.type.spec.tableRole === "header_cell") {
      n = i;
      break;
    }
  }
  for (let s = e.depth; s > 0; s--) {
    const i = e.node(s);
    if (i.type.spec.tableRole === "cell" || i.type.spec.tableRole === "header_cell") {
      r = i;
      break;
    }
  }
  return n !== r && e.parentOffset === 0;
}
function lw(t, e, n) {
  const r = (e || t).selection, s = (e || t).doc;
  let i, o;
  if (r instanceof ee && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      i = be.create(s, r.from);
    else if (o == "row") {
      const l = s.resolve(r.from + 1);
      i = be.rowSelection(l, l);
    } else if (!n) {
      const l = je.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      i = be.create(s, a + 1, c);
    }
  } else
    r instanceof ne && iw(r) ? i = ne.create(s, r.from) : r instanceof ne && ow(r) && (i = ne.create(s, r.$from.start(), r.$from.end()));
  return i && (e || (e = t.tr)).setSelection(i), e;
}
var aw = new it("fix-tables");
function Bp(t, e, n, r) {
  const s = t.childCount, i = e.childCount;
  e:
    for (let o = 0, l = 0; o < i; o++) {
      const a = e.child(o);
      for (let c = l, u = Math.min(s, o + 3); c < u; c++)
        if (t.child(c) == a) {
          l = c + 1, n += a.nodeSize;
          continue e;
        }
      r(a, n), l < s && t.child(l).sameMarkup(a) ? Bp(t.child(l), a, n + 1, r) : a.nodesBetween(0, a.content.size, r, n + 1), n += a.nodeSize;
    }
}
function Hp(t, e) {
  let n;
  const r = (s, i) => {
    s.type.spec.tableRole == "table" && (n = cw(t, s, i, n));
  };
  return e ? e.doc != t.doc && Bp(e.doc, t.doc, 0, r) : t.doc.descendants(r), n;
}
function cw(t, e, n, r) {
  const s = je.get(e);
  if (!s.problems)
    return r;
  r || (r = t.tr);
  const i = [];
  for (let a = 0; a < s.height; a++)
    i.push(0);
  for (let a = 0; a < s.problems.length; a++) {
    const c = s.problems[a];
    if (c.type == "collision") {
      const u = e.nodeAt(c.pos);
      if (!u)
        continue;
      const f = u.attrs;
      for (let h = 0; h < f.rowspan; h++)
        i[c.row + h] += c.n;
      r.setNodeMarkup(
        r.mapping.map(n + 1 + c.pos),
        null,
        ur(f, f.colspan - c.n, c.n)
      );
    } else if (c.type == "missing")
      i[c.row] += c.n;
    else if (c.type == "overlong_rowspan") {
      const u = e.nodeAt(c.pos);
      if (!u)
        continue;
      r.setNodeMarkup(r.mapping.map(n + 1 + c.pos), null, {
        ...u.attrs,
        rowspan: u.attrs.rowspan - c.n
      });
    } else if (c.type == "colwidth mismatch") {
      const u = e.nodeAt(c.pos);
      if (!u)
        continue;
      r.setNodeMarkup(r.mapping.map(n + 1 + c.pos), null, {
        ...u.attrs,
        colwidth: c.colwidth
      });
    }
  }
  let o, l;
  for (let a = 0; a < i.length; a++)
    i[a] && (o == null && (o = a), l = a);
  for (let a = 0, c = n + 1; a < s.height; a++) {
    const u = e.child(a), f = c + u.nodeSize, h = i[a];
    if (h > 0) {
      let m = "cell";
      u.firstChild && (m = u.firstChild.type.spec.tableRole);
      const y = [];
      for (let x = 0; x < h; x++) {
        const C = ct(t.schema)[m].createAndFill();
        C && y.push(C);
      }
      const b = (a == 0 || o == a - 1) && l == a ? c + 1 : f - 1;
      r.insert(r.mapping.map(b), y);
    }
    c = f;
  }
  return r.setMeta(aw, { fixTables: !0 });
}
function uw(t) {
  if (!t.size)
    return null;
  let { content: e, openStart: n, openEnd: r } = t;
  for (; e.childCount == 1 && (n > 0 && r > 0 || e.child(0).type.spec.tableRole == "table"); )
    n--, r--, e = e.child(0).content;
  const s = e.child(0), i = s.type.spec.tableRole, o = s.type.schema, l = [];
  if (i == "row")
    for (let a = 0; a < e.childCount; a++) {
      let c = e.child(a).content;
      const u = a ? 0 : Math.max(0, n - 1), f = a < e.childCount - 1 ? 0 : Math.max(0, r - 1);
      (u || f) && (c = ya(
        ct(o).row,
        new U(c, u, f)
      ).content), l.push(c);
    }
  else if (i == "cell" || i == "header_cell")
    l.push(
      n || r ? ya(
        ct(o).row,
        new U(e, n, r)
      ).content : e
    );
  else
    return null;
  return dw(o, l);
}
function dw(t, e) {
  const n = [];
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    for (let o = i.childCount - 1; o >= 0; o--) {
      const { rowspan: l, colspan: a } = i.child(o).attrs;
      for (let c = s; c < s + l; c++)
        n[c] = (n[c] || 0) + a;
    }
  }
  let r = 0;
  for (let s = 0; s < n.length; s++)
    r = Math.max(r, n[s]);
  for (let s = 0; s < n.length; s++)
    if (s >= e.length && e.push(H.empty), n[s] < r) {
      const i = ct(t).cell.createAndFill(), o = [];
      for (let l = n[s]; l < r; l++)
        o.push(i);
      e[s] = e[s].append(H.from(o));
    }
  return { height: e.length, width: r, rows: e };
}
function ya(t, e) {
  const n = t.createAndFill();
  return new Gh(n).replace(0, n.content.size, e).doc;
}
function fw({ width: t, height: e, rows: n }, r, s) {
  if (t != r) {
    const i = [], o = [];
    for (let l = 0; l < n.length; l++) {
      const a = n[l], c = [];
      for (let u = i[l] || 0, f = 0; u < r; f++) {
        let h = a.child(f % a.childCount);
        u + h.attrs.colspan > r && (h = h.type.createChecked(
          ur(
            h.attrs,
            h.attrs.colspan,
            u + h.attrs.colspan - r
          ),
          h.content
        )), c.push(h), u += h.attrs.colspan;
        for (let m = 1; m < h.attrs.rowspan; m++)
          i[l + m] = (i[l + m] || 0) + h.attrs.colspan;
      }
      o.push(H.from(c));
    }
    n = o, t = r;
  }
  if (e != s) {
    const i = [];
    for (let o = 0, l = 0; o < s; o++, l++) {
      const a = [], c = n[l % e];
      for (let u = 0; u < c.childCount; u++) {
        let f = c.child(u);
        o + f.attrs.rowspan > s && (f = f.type.create(
          {
            ...f.attrs,
            rowspan: Math.max(1, s - f.attrs.rowspan)
          },
          f.content
        )), a.push(f);
      }
      i.push(H.from(a));
    }
    n = i, e = s;
  }
  return { width: t, height: e, rows: n };
}
function hw(t, e, n, r, s, i, o) {
  const l = t.doc.type.schema, a = ct(l);
  let c, u;
  if (s > e.width)
    for (let f = 0, h = 0; f < e.height; f++) {
      const m = n.child(f);
      h += m.nodeSize;
      const y = [];
      let b;
      m.lastChild == null || m.lastChild.type == a.cell ? b = c || (c = a.cell.createAndFill()) : b = u || (u = a.header_cell.createAndFill());
      for (let x = e.width; x < s; x++)
        y.push(b);
      t.insert(t.mapping.slice(o).map(h - 1 + r), y);
    }
  if (i > e.height) {
    const f = [];
    for (let y = 0, b = (e.height - 1) * e.width; y < Math.max(e.width, s); y++) {
      const x = y >= e.width ? !1 : n.nodeAt(e.map[b + y]).type == a.header_cell;
      f.push(
        x ? u || (u = a.header_cell.createAndFill()) : c || (c = a.cell.createAndFill())
      );
    }
    const h = a.row.create(null, H.from(f)), m = [];
    for (let y = e.height; y < i; y++)
      m.push(h);
    t.insert(t.mapping.slice(o).map(r + n.nodeSize - 2), m);
  }
  return !!(c || u);
}
function jd(t, e, n, r, s, i, o, l) {
  if (o == 0 || o == e.height)
    return !1;
  let a = !1;
  for (let c = s; c < i; c++) {
    const u = o * e.width + c, f = e.map[u];
    if (e.map[u - e.width] == f) {
      a = !0;
      const h = n.nodeAt(f), { top: m, left: y } = e.findCell(f);
      t.setNodeMarkup(t.mapping.slice(l).map(f + r), null, {
        ...h.attrs,
        rowspan: o - m
      }), t.insert(
        t.mapping.slice(l).map(e.positionAt(o, y, n)),
        h.type.createAndFill({
          ...h.attrs,
          rowspan: m + h.attrs.rowspan - o
        })
      ), c += h.attrs.colspan - 1;
    }
  }
  return a;
}
function Rd(t, e, n, r, s, i, o, l) {
  if (o == 0 || o == e.width)
    return !1;
  let a = !1;
  for (let c = s; c < i; c++) {
    const u = c * e.width + o, f = e.map[u];
    if (e.map[u - 1] == f) {
      a = !0;
      const h = n.nodeAt(f), m = e.colCount(f), y = t.mapping.slice(l).map(f + r);
      t.setNodeMarkup(
        y,
        null,
        ur(
          h.attrs,
          o - m,
          h.attrs.colspan - (o - m)
        )
      ), t.insert(
        y + h.nodeSize,
        h.type.createAndFill(
          ur(h.attrs, 0, o - m)
        )
      ), c += h.attrs.rowspan - 1;
    }
  }
  return a;
}
function Pd(t, e, n, r, s) {
  let i = n ? t.doc.nodeAt(n - 1) : t.doc;
  if (!i)
    throw new Error("No table found");
  let o = je.get(i);
  const { top: l, left: a } = r, c = a + s.width, u = l + s.height, f = t.tr;
  let h = 0;
  function m() {
    if (i = n ? f.doc.nodeAt(n - 1) : f.doc, !i)
      throw new Error("No table found");
    o = je.get(i), h = f.mapping.maps.length;
  }
  hw(f, o, i, n, c, u, h) && m(), jd(f, o, i, n, a, c, l, h) && m(), jd(f, o, i, n, a, c, u, h) && m(), Rd(f, o, i, n, l, u, a, h) && m(), Rd(f, o, i, n, l, u, c, h) && m();
  for (let y = l; y < u; y++) {
    const b = o.positionAt(y, a, i), x = o.positionAt(y, c, i);
    f.replace(
      f.mapping.slice(h).map(b + n),
      f.mapping.slice(h).map(x + n),
      new U(s.rows[y - l], 0, 0)
    );
  }
  m(), f.setSelection(
    new be(
      f.doc.resolve(n + o.positionAt(l, a, i)),
      f.doc.resolve(n + o.positionAt(u - 1, c - 1, i))
    )
  ), e(f);
}
var pw = xp({
  ArrowLeft: Ys("horiz", -1),
  ArrowRight: Ys("horiz", 1),
  ArrowUp: Ys("vert", -1),
  ArrowDown: Ys("vert", 1),
  "Shift-ArrowLeft": Xs("horiz", -1),
  "Shift-ArrowRight": Xs("horiz", 1),
  "Shift-ArrowUp": Xs("vert", -1),
  "Shift-ArrowDown": Xs("vert", 1),
  Backspace: Qs,
  "Mod-Backspace": Qs,
  Delete: Qs,
  "Mod-Delete": Qs
});
function pi(t, e, n) {
  return n.eq(t.selection) ? !1 : (e && e(t.tr.setSelection(n).scrollIntoView()), !0);
}
function Ys(t, e) {
  return (n, r, s) => {
    if (!s)
      return !1;
    const i = n.selection;
    if (i instanceof be)
      return pi(
        n,
        r,
        se.near(i.$headCell, e)
      );
    if (t != "horiz" && !i.empty)
      return !1;
    const o = Fp(s, t, e);
    if (o == null)
      return !1;
    if (t == "horiz")
      return pi(
        n,
        r,
        se.near(n.doc.resolve(i.head + e), e)
      );
    {
      const l = n.doc.resolve(o), a = zp(l, t, e);
      let c;
      return a ? c = se.near(a, 1) : e < 0 ? c = se.near(n.doc.resolve(l.before(-1)), -1) : c = se.near(n.doc.resolve(l.after(-1)), 1), pi(n, r, c);
    }
  };
}
function Xs(t, e) {
  return (n, r, s) => {
    if (!s)
      return !1;
    const i = n.selection;
    let o;
    if (i instanceof be)
      o = i;
    else {
      const a = Fp(s, t, e);
      if (a == null)
        return !1;
      o = new be(n.doc.resolve(a));
    }
    const l = zp(o.$headCell, t, e);
    return l ? pi(
      n,
      r,
      new be(o.$anchorCell, l)
    ) : !1;
  };
}
function Qs(t, e) {
  const n = t.selection;
  if (!(n instanceof be))
    return !1;
  if (e) {
    const r = t.tr, s = ct(t.schema).cell.createAndFill().content;
    n.forEachCell((i, o) => {
      i.content.eq(s) || r.replace(
        r.mapping.map(o + 1),
        r.mapping.map(o + i.nodeSize - 1),
        new U(s, 0, 0)
      );
    }), r.docChanged && e(r);
  }
  return !0;
}
function mw(t, e) {
  const n = t.state.doc, r = Kr(n.resolve(e));
  return r ? (t.dispatch(t.state.tr.setSelection(new be(r))), !0) : !1;
}
function gw(t, e, n) {
  if (!Wt(t.state))
    return !1;
  let r = uw(n);
  const s = t.state.selection;
  if (s instanceof be) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        H.from(
          ya(ct(t.state.schema).cell, n)
        )
      ]
    });
    const i = s.$anchorCell.node(-1), o = s.$anchorCell.start(-1), l = je.get(i).rectBetween(
      s.$anchorCell.pos - o,
      s.$headCell.pos - o
    );
    return r = fw(r, l.right - l.left, l.bottom - l.top), Pd(t.state, t.dispatch, o, l, r), !0;
  } else if (r) {
    const i = Vo(t.state), o = i.start(-1);
    return Pd(
      t.state,
      t.dispatch,
      o,
      je.get(i.node(-1)).findCell(i.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function yw(t, e) {
  var n;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = Id(t, e.target);
  let s;
  if (e.shiftKey && t.state.selection instanceof be)
    i(t.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (s = Kr(t.state.selection.$anchor)) != null && ((n = kl(t, e)) == null ? void 0 : n.pos) != s.pos)
    i(s, e), e.preventDefault();
  else if (!r)
    return;
  function i(a, c) {
    let u = kl(t, c);
    const f = An.getState(t.state) == null;
    if (!u || !Rc(a, u))
      if (f)
        u = a;
      else
        return;
    const h = new be(a, u);
    if (f || !t.state.selection.eq(h)) {
      const m = t.state.tr.setSelection(h);
      f && m.setMeta(An, a.pos), t.dispatch(m);
    }
  }
  function o() {
    t.root.removeEventListener("mouseup", o), t.root.removeEventListener("dragstart", o), t.root.removeEventListener("mousemove", l), An.getState(t.state) != null && t.dispatch(t.state.tr.setMeta(An, -1));
  }
  function l(a) {
    const c = a, u = An.getState(t.state);
    let f;
    if (u != null)
      f = t.state.doc.resolve(u);
    else if (Id(t, c.target) != r && (f = kl(t, e), !f))
      return o();
    f && i(f, c);
  }
  t.root.addEventListener("mouseup", o), t.root.addEventListener("dragstart", o), t.root.addEventListener("mousemove", l);
}
function Fp(t, e, n) {
  if (!(t.state.selection instanceof ne))
    return null;
  const { $head: r } = t.state.selection;
  for (let s = r.depth - 1; s >= 0; s--) {
    const i = r.node(s);
    if ((n < 0 ? r.index(s) : r.indexAfter(s)) != (n < 0 ? 0 : i.childCount))
      return null;
    if (i.type.spec.tableRole == "cell" || i.type.spec.tableRole == "header_cell") {
      const l = r.before(s), a = e == "vert" ? n > 0 ? "down" : "up" : n > 0 ? "right" : "left";
      return t.endOfTextblock(a) ? l : null;
    }
  }
  return null;
}
function Id(t, e) {
  for (; e && e != t.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function kl(t, e) {
  const n = t.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return n && n ? Kr(t.state.doc.resolve(n.pos)) : null;
}
var bw = class {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), ba(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, ba(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function ba(t, e, n, r, s, i) {
  var o;
  let l = 0, a = !0, c = e.firstChild;
  const u = t.firstChild;
  if (u) {
    for (let f = 0, h = 0; f < u.childCount; f++) {
      const { colspan: m, colwidth: y } = u.child(f).attrs;
      for (let b = 0; b < m; b++, h++) {
        const x = s == h ? i : y && y[b], C = x ? x + "px" : "";
        l += x || r, x || (a = !1), c ? (c.style.width != C && (c.style.width = C), c = c.nextSibling) : e.appendChild(document.createElement("col")).style.width = C;
      }
    }
    for (; c; ) {
      const f = c.nextSibling;
      (o = c.parentNode) == null || o.removeChild(c), c = f;
    }
    a ? (n.style.width = l + "px", n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = l + "px");
  }
}
var Rt = new it(
  "tableColumnResizing"
);
function vw({
  handleWidth: t = 5,
  cellMinWidth: e = 25,
  View: n = bw,
  lastColumnResizable: r = !0
} = {}) {
  const s = new st({
    key: Rt,
    state: {
      init(i, o) {
        return s.spec.props.nodeViews[ct(o.schema).table.name] = (l, a) => new n(l, e, a), new ww(-1, !1);
      },
      apply(i, o) {
        return o.apply(i);
      }
    },
    props: {
      attributes: (i) => {
        const o = Rt.getState(i);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (i, o) => {
          xw(
            i,
            o,
            t,
            e,
            r
          );
        },
        mouseleave: (i) => {
          kw(i);
        },
        mousedown: (i, o) => {
          _w(i, o, e);
        }
      },
      decorations: (i) => {
        const o = Rt.getState(i);
        if (o && o.activeHandle > -1)
          return Tw(i, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return s;
}
var ww = class mi {
  constructor(e, n) {
    this.activeHandle = e, this.dragging = n;
  }
  apply(e) {
    const n = this, r = e.getMeta(Rt);
    if (r && r.setHandle != null)
      return new mi(r.setHandle, !1);
    if (r && r.setDragging !== void 0)
      return new mi(n.activeHandle, r.setDragging);
    if (n.activeHandle > -1 && e.docChanged) {
      let s = e.mapping.map(n.activeHandle, -1);
      return ga(e.doc.resolve(s)) || (s = -1), new mi(s, n.dragging);
    }
    return n;
  }
};
function xw(t, e, n, r, s) {
  const i = Rt.getState(t.state);
  if (i && !i.dragging) {
    const o = Cw(e.target);
    let l = -1;
    if (o) {
      const { left: a, right: c } = o.getBoundingClientRect();
      e.clientX - a <= n ? l = Ld(t, e, "left", n) : c - e.clientX <= n && (l = Ld(t, e, "right", n));
    }
    if (l != i.activeHandle) {
      if (!s && l !== -1) {
        const a = t.state.doc.resolve(l), c = a.node(-1), u = je.get(c), f = a.start(-1);
        if (u.colCount(a.pos - f) + a.nodeAfter.attrs.colspan - 1 == u.width - 1)
          return;
      }
      Wp(t, l);
    }
  }
}
function kw(t) {
  const e = Rt.getState(t.state);
  e && e.activeHandle > -1 && !e.dragging && Wp(t, -1);
}
function _w(t, e, n) {
  const r = Rt.getState(t.state);
  if (!r || r.activeHandle == -1 || r.dragging)
    return !1;
  const s = t.state.doc.nodeAt(r.activeHandle), i = Sw(t, r.activeHandle, s.attrs);
  t.dispatch(
    t.state.tr.setMeta(Rt, {
      setDragging: { startX: e.clientX, startWidth: i }
    })
  );
  function o(a) {
    window.removeEventListener("mouseup", o), window.removeEventListener("mousemove", l);
    const c = Rt.getState(t.state);
    c?.dragging && (Ew(
      t,
      c.activeHandle,
      Nd(c.dragging, a, n)
    ), t.dispatch(
      t.state.tr.setMeta(Rt, { setDragging: null })
    ));
  }
  function l(a) {
    if (!a.which)
      return o(a);
    const c = Rt.getState(t.state);
    if (c && c.dragging) {
      const u = Nd(c.dragging, a, n);
      Mw(t, c.activeHandle, u, n);
    }
  }
  return window.addEventListener("mouseup", o), window.addEventListener("mousemove", l), e.preventDefault(), !0;
}
function Sw(t, e, { colspan: n, colwidth: r }) {
  const s = r && r[r.length - 1];
  if (s)
    return s;
  const i = t.domAtPos(e);
  let l = i.node.childNodes[i.offset].offsetWidth, a = n;
  if (r)
    for (let c = 0; c < n; c++)
      r[c] && (l -= r[c], a--);
  return l / a;
}
function Cw(t) {
  for (; t && t.nodeName != "TD" && t.nodeName != "TH"; )
    t = t.classList && t.classList.contains("ProseMirror") ? null : t.parentNode;
  return t;
}
function Ld(t, e, n, r) {
  const s = n == "right" ? -r : r, i = t.posAtCoords({
    left: e.clientX + s,
    top: e.clientY
  });
  if (!i)
    return -1;
  const { pos: o } = i, l = Kr(t.state.doc.resolve(o));
  if (!l)
    return -1;
  if (n == "right")
    return l.pos;
  const a = je.get(l.node(-1)), c = l.start(-1), u = a.map.indexOf(l.pos - c);
  return u % a.width == 0 ? -1 : c + a.map[u - 1];
}
function Nd(t, e, n) {
  const r = e.clientX - t.startX;
  return Math.max(n, t.startWidth + r);
}
function Wp(t, e) {
  t.dispatch(
    t.state.tr.setMeta(Rt, { setHandle: e })
  );
}
function Ew(t, e, n) {
  const r = t.state.doc.resolve(e), s = r.node(-1), i = je.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, a = t.state.tr;
  for (let c = 0; c < i.height; c++) {
    const u = c * i.width + l;
    if (c && i.map[u] == i.map[u - i.width])
      continue;
    const f = i.map[u], h = s.nodeAt(f).attrs, m = h.colspan == 1 ? 0 : l - i.colCount(f);
    if (h.colwidth && h.colwidth[m] == n)
      continue;
    const y = h.colwidth ? h.colwidth.slice() : Aw(h.colspan);
    y[m] = n, a.setNodeMarkup(o + f, null, { ...h, colwidth: y });
  }
  a.docChanged && t.dispatch(a);
}
function Mw(t, e, n, r) {
  const s = t.state.doc.resolve(e), i = s.node(-1), o = s.start(-1), l = je.get(i).colCount(s.pos - o) + s.nodeAfter.attrs.colspan - 1;
  let a = t.domAtPos(s.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; )
    a = a.parentNode;
  a && ba(
    i,
    a.firstChild,
    a,
    r,
    l,
    n
  );
}
function Aw(t) {
  return Array(t).fill(0);
}
function Tw(t, e) {
  const n = [], r = t.doc.resolve(e), s = r.node(-1);
  if (!s)
    return Se.empty;
  const i = je.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let a = 0; a < i.height; a++) {
    const c = l + a * i.width - 1;
    if ((l == i.width || i.map[c] != i.map[c + 1]) && (a == 0 || i.map[c] != i.map[c - i.width])) {
      const u = i.map[c], f = o + u + s.nodeAt(u).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", n.push(bt.widget(f, h));
    }
  }
  return Se.create(t.doc, n);
}
function ln(t) {
  const e = t.selection, n = Vo(t), r = n.node(-1), s = n.start(-1), i = je.get(r);
  return { ...e instanceof be ? i.rectBetween(
    e.$anchorCell.pos - s,
    e.$headCell.pos - s
  ) : i.findCell(n.pos - s), tableStart: s, map: i, table: r };
}
function Vp(t, { map: e, tableStart: n, table: r }, s) {
  let i = s > 0 ? -1 : 0;
  nw(e, r, s + i) && (i = s == 0 || s == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const l = o * e.width + s;
    if (s > 0 && s < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      t.setNodeMarkup(
        t.mapping.map(n + a),
        null,
        $p(c.attrs, s - e.colCount(a))
      ), o += c.attrs.rowspan - 1;
    } else {
      const a = i == null ? ct(r.type.schema).cell : r.nodeAt(e.map[l + i]).type, c = e.positionAt(o, s, r);
      t.insert(t.mapping.map(n + c), a.createAndFill());
    }
  }
  return t;
}
function Ow(t, e) {
  if (!Wt(t))
    return !1;
  if (e) {
    const n = ln(t);
    e(Vp(t.tr, n, n.left));
  }
  return !0;
}
function jw(t, e) {
  if (!Wt(t))
    return !1;
  if (e) {
    const n = ln(t);
    e(Vp(t.tr, n, n.right));
  }
  return !0;
}
function Rw(t, { map: e, table: n, tableStart: r }, s) {
  const i = t.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const l = o * e.width + s, a = e.map[l], c = n.nodeAt(a), u = c.attrs;
    if (s > 0 && e.map[l - 1] == a || s < e.width - 1 && e.map[l + 1] == a)
      t.setNodeMarkup(
        t.mapping.slice(i).map(r + a),
        null,
        ur(u, s - e.colCount(a))
      );
    else {
      const f = t.mapping.slice(i).map(r + a);
      t.delete(f, f + c.nodeSize);
    }
    o += u.rowspan;
  }
}
function Pw(t, e) {
  if (!Wt(t))
    return !1;
  if (e) {
    const n = ln(t), r = t.tr;
    if (n.left == 0 && n.right == n.map.width)
      return !1;
    for (let s = n.right - 1; Rw(r, n, s), s != n.left; s--) {
      const i = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      n.table = i, n.map = je.get(i);
    }
    e(r);
  }
  return !0;
}
function Iw(t, e, n) {
  var r;
  const s = ct(e.type.schema).header_cell;
  for (let i = 0; i < t.width; i++)
    if (((r = e.nodeAt(t.map[i + n * t.width])) == null ? void 0 : r.type) != s)
      return !1;
  return !0;
}
function Kp(t, { map: e, tableStart: n, table: r }, s) {
  var i;
  let o = n;
  for (let c = 0; c < s; c++)
    o += r.child(c).nodeSize;
  const l = [];
  let a = s > 0 ? -1 : 0;
  Iw(e, r, s + a) && (a = s == 0 || s == e.height ? null : 0);
  for (let c = 0, u = e.width * s; c < e.width; c++, u++)
    if (s > 0 && s < e.height && e.map[u] == e.map[u - e.width]) {
      const f = e.map[u], h = r.nodeAt(f).attrs;
      t.setNodeMarkup(n + f, null, {
        ...h,
        rowspan: h.rowspan + 1
      }), c += h.colspan - 1;
    } else {
      const f = a == null ? ct(r.type.schema).cell : (i = r.nodeAt(e.map[u + a * e.width])) == null ? void 0 : i.type, h = f?.createAndFill();
      h && l.push(h);
    }
  return t.insert(o, ct(r.type.schema).row.create(null, l)), t;
}
function Lw(t, e) {
  if (!Wt(t))
    return !1;
  if (e) {
    const n = ln(t);
    e(Kp(t.tr, n, n.top));
  }
  return !0;
}
function Nw(t, e) {
  if (!Wt(t))
    return !1;
  if (e) {
    const n = ln(t);
    e(Kp(t.tr, n, n.bottom));
  }
  return !0;
}
function zw(t, { map: e, table: n, tableStart: r }, s) {
  let i = 0;
  for (let c = 0; c < s; c++)
    i += n.child(c).nodeSize;
  const o = i + n.child(s).nodeSize, l = t.mapping.maps.length;
  t.delete(i + r, o + r);
  const a = /* @__PURE__ */ new Set();
  for (let c = 0, u = s * e.width; c < e.width; c++, u++) {
    const f = e.map[u];
    if (!a.has(f)) {
      if (a.add(f), s > 0 && f == e.map[u - e.width]) {
        const h = n.nodeAt(f).attrs;
        t.setNodeMarkup(t.mapping.slice(l).map(f + r), null, {
          ...h,
          rowspan: h.rowspan - 1
        }), c += h.colspan - 1;
      } else if (s < e.height && f == e.map[u + e.width]) {
        const h = n.nodeAt(f), m = h.attrs, y = h.type.create(
          { ...m, rowspan: h.attrs.rowspan - 1 },
          h.content
        ), b = e.positionAt(s + 1, c, n);
        t.insert(t.mapping.slice(l).map(r + b), y), c += m.colspan - 1;
      }
    }
  }
}
function $w(t, e) {
  if (!Wt(t))
    return !1;
  if (e) {
    const n = ln(t), r = t.tr;
    if (n.top == 0 && n.bottom == n.map.height)
      return !1;
    for (let s = n.bottom - 1; zw(r, n, s), s != n.top; s--) {
      const i = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      n.table = i, n.map = je.get(n.table);
    }
    e(r);
  }
  return !0;
}
function zd(t) {
  const e = t.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function Dw({ width: t, height: e, map: n }, r) {
  let s = r.top * t + r.left, i = s, o = (r.bottom - 1) * t + r.left, l = s + (r.right - r.left - 1);
  for (let a = r.top; a < r.bottom; a++) {
    if (r.left > 0 && n[i] == n[i - 1] || r.right < t && n[l] == n[l + 1])
      return !0;
    i += t, l += t;
  }
  for (let a = r.left; a < r.right; a++) {
    if (r.top > 0 && n[s] == n[s - t] || r.bottom < e && n[o] == n[o + t])
      return !0;
    s++, o++;
  }
  return !1;
}
function $d(t, e) {
  const n = t.selection;
  if (!(n instanceof be) || n.$anchorCell.pos == n.$headCell.pos)
    return !1;
  const r = ln(t), { map: s } = r;
  if (Dw(s, r))
    return !1;
  if (e) {
    const i = t.tr, o = {};
    let l = H.empty, a, c;
    for (let u = r.top; u < r.bottom; u++)
      for (let f = r.left; f < r.right; f++) {
        const h = s.map[u * s.width + f], m = r.table.nodeAt(h);
        if (!(o[h] || !m))
          if (o[h] = !0, a == null)
            a = h, c = m;
          else {
            zd(m) || (l = l.append(m.content));
            const y = i.mapping.map(h + r.tableStart);
            i.delete(y, y + m.nodeSize);
          }
      }
    if (a == null || c == null)
      return !0;
    if (i.setNodeMarkup(a + r.tableStart, null, {
      ...$p(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), l.size) {
      const u = a + 1 + c.content.size, f = zd(c) ? a + 1 : u;
      i.replaceWith(f + r.tableStart, u + r.tableStart, l);
    }
    i.setSelection(
      new be(i.doc.resolve(a + r.tableStart))
    ), e(i);
  }
  return !0;
}
function Dd(t, e) {
  const n = ct(t.schema);
  return Bw(({ node: r }) => n[r.type.spec.tableRole])(t, e);
}
function Bw(t) {
  return (e, n) => {
    var r;
    const s = e.selection;
    let i, o;
    if (s instanceof be) {
      if (s.$anchorCell.pos != s.$headCell.pos)
        return !1;
      i = s.$anchorCell.nodeAfter, o = s.$anchorCell.pos;
    } else {
      if (i = Z3(s.$from), !i)
        return !1;
      o = (r = Kr(s.$from)) == null ? void 0 : r.pos;
    }
    if (i == null || o == null || i.attrs.colspan == 1 && i.attrs.rowspan == 1)
      return !1;
    if (n) {
      let l = i.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = { ...l, rowspan: 1 }), l.colspan > 1 && (l = { ...l, colspan: 1 });
      const u = ln(e), f = e.tr;
      for (let m = 0; m < u.right - u.left; m++)
        a.push(
          c ? {
            ...l,
            colwidth: c && c[m] ? [c[m]] : null
          } : l
        );
      let h;
      for (let m = u.top; m < u.bottom; m++) {
        let y = u.map.positionAt(m, u.left, u.table);
        m == u.top && (y += i.nodeSize);
        for (let b = u.left, x = 0; b < u.right; b++, x++)
          b == u.left && m == u.top || f.insert(
            h = f.mapping.map(y + u.tableStart, 1),
            t({ node: i, row: m, col: b }).createAndFill(a[x])
          );
      }
      f.setNodeMarkup(
        o,
        t({ node: i, row: u.top, col: u.left }),
        a[0]
      ), s instanceof be && f.setSelection(
        new be(
          f.doc.resolve(s.$anchorCell.pos),
          h ? f.doc.resolve(h) : void 0
        )
      ), n(f);
    }
    return !0;
  };
}
function Hw(t, e) {
  return function(n, r) {
    if (!Wt(n))
      return !1;
    const s = Vo(n);
    if (s.nodeAfter.attrs[t] === e)
      return !1;
    if (r) {
      const i = n.tr;
      n.selection instanceof be ? n.selection.forEachCell((o, l) => {
        o.attrs[t] !== e && i.setNodeMarkup(l, null, {
          ...o.attrs,
          [t]: e
        });
      }) : i.setNodeMarkup(s.pos, null, {
        ...s.nodeAfter.attrs,
        [t]: e
      }), r(i);
    }
    return !0;
  };
}
function Fw(t) {
  return function(e, n) {
    if (!Wt(e))
      return !1;
    if (n) {
      const r = ct(e.schema), s = ln(e), i = e.tr, o = s.map.cellsInRect(
        t == "column" ? {
          left: s.left,
          top: 0,
          right: s.right,
          bottom: s.map.height
        } : t == "row" ? {
          left: 0,
          top: s.top,
          right: s.map.width,
          bottom: s.bottom
        } : s
      ), l = o.map((a) => s.table.nodeAt(a));
      for (let a = 0; a < o.length; a++)
        l[a].type == r.header_cell && i.setNodeMarkup(
          s.tableStart + o[a],
          r.cell,
          l[a].attrs
        );
      if (i.steps.length == 0)
        for (let a = 0; a < o.length; a++)
          i.setNodeMarkup(
            s.tableStart + o[a],
            r.header_cell,
            l[a].attrs
          );
      n(i);
    }
    return !0;
  };
}
function Bd(t, e, n) {
  const r = e.map.cellsInRect({
    left: 0,
    top: 0,
    right: t == "row" ? e.map.width : 1,
    bottom: t == "column" ? e.map.height : 1
  });
  for (let s = 0; s < r.length; s++) {
    const i = e.table.nodeAt(r[s]);
    if (i && i.type !== n.header_cell)
      return !1;
  }
  return !0;
}
function Es(t, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? Fw(t) : function(n, r) {
    if (!Wt(n))
      return !1;
    if (r) {
      const s = ct(n.schema), i = ln(n), o = n.tr, l = Bd("row", i, s), a = Bd(
        "column",
        i,
        s
      ), u = (t === "column" ? l : t === "row" ? a : !1) ? 1 : 0, f = t == "column" ? {
        left: 0,
        top: u,
        right: 1,
        bottom: i.map.height
      } : t == "row" ? {
        left: u,
        top: 0,
        right: i.map.width,
        bottom: 1
      } : i, h = t == "column" ? a ? s.cell : s.header_cell : t == "row" ? l ? s.cell : s.header_cell : s.cell;
      i.map.cellsInRect(f).forEach((m) => {
        const y = m + i.tableStart, b = o.doc.nodeAt(y);
        b && o.setNodeMarkup(y, h, b.attrs);
      }), r(o);
    }
    return !0;
  };
}
Es("row", {
  useDeprecatedLogic: !0
});
Es("column", {
  useDeprecatedLogic: !0
});
var Ww = Es("cell", {
  useDeprecatedLogic: !0
});
function Vw(t, e) {
  if (e < 0) {
    const n = t.nodeBefore;
    if (n)
      return t.pos - n.nodeSize;
    for (let r = t.index(-1) - 1, s = t.before(); r >= 0; r--) {
      const i = t.node(-1).child(r), o = i.lastChild;
      if (o)
        return s - 1 - o.nodeSize;
      s -= i.nodeSize;
    }
  } else {
    if (t.index() < t.parent.childCount - 1)
      return t.pos + t.nodeAfter.nodeSize;
    const n = t.node(-1);
    for (let r = t.indexAfter(-1), s = t.after(); r < n.childCount; r++) {
      const i = n.child(r);
      if (i.childCount)
        return s + 1;
      s += i.nodeSize;
    }
  }
  return null;
}
function Hd(t) {
  return function(e, n) {
    if (!Wt(e))
      return !1;
    const r = Vw(Vo(e), t);
    if (r == null)
      return !1;
    if (n) {
      const s = e.doc.resolve(r);
      n(
        e.tr.setSelection(ne.between(s, tw(s))).scrollIntoView()
      );
    }
    return !0;
  };
}
function Kw(t, e) {
  const n = t.selection.$anchor;
  for (let r = n.depth; r > 0; r--)
    if (n.node(r).type.spec.tableRole == "table")
      return e && e(
        t.tr.delete(n.before(r), n.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function Uw({
  allowTableNodeSelection: t = !1
} = {}) {
  return new st({
    key: An,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, n) {
        const r = e.getMeta(An);
        if (r != null)
          return r == -1 ? null : r;
        if (n == null || !e.docChanged)
          return n;
        const { deleted: s, pos: i } = e.mapping.mapResult(n);
        return s ? null : i;
      }
    },
    props: {
      decorations: sw,
      handleDOMEvents: {
        mousedown: yw
      },
      createSelectionBetween(e) {
        return An.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: mw,
      handleKeyDown: pw,
      handlePaste: gw
    },
    appendTransaction(e, n, r) {
      return lw(
        r,
        Hp(r, n),
        t
      );
    }
  });
}
function Fd(t, e, n, r, s, i) {
  let o = 0, l = !0, a = e.firstChild;
  const c = t.firstChild;
  for (let u = 0, f = 0; u < c.childCount; u += 1) {
    const { colspan: h, colwidth: m } = c.child(u).attrs;
    for (let y = 0; y < h; y += 1, f += 1) {
      const b = s === f ? i : m && m[y], x = b ? `${b}px` : "";
      o += b || r, b || (l = !1), a ? (a.style.width !== x && (a.style.width = x), a = a.nextSibling) : e.appendChild(document.createElement("col")).style.width = x;
    }
  }
  for (; a; ) {
    const u = a.nextSibling;
    a.parentNode.removeChild(a), a = u;
  }
  l ? (n.style.width = `${o}px`, n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = `${o}px`);
}
class qw {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Fd(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, Fd(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function Gw(t, e, n, r) {
  let s = 0, i = !0;
  const o = [], l = t.firstChild;
  if (!l)
    return {};
  for (let f = 0, h = 0; f < l.childCount; f += 1) {
    const { colspan: m, colwidth: y } = l.child(f).attrs;
    for (let b = 0; b < m; b += 1, h += 1) {
      const x = n === h ? r : y && y[b], C = x ? `${x}px` : "";
      s += x || e, x || (i = !1), o.push(["col", C ? { style: `width: ${C}` } : {}]);
    }
  }
  const a = i ? `${s}px` : "", c = i ? "" : `${s}px`;
  return { colgroup: ["colgroup", {}, ...o], tableWidth: a, tableMinWidth: c };
}
function Wd(t, e) {
  return e ? t.createChecked(null, e) : t.createAndFill();
}
function Jw(t) {
  if (t.cached.tableNodeTypes)
    return t.cached.tableNodeTypes;
  const e = {};
  return Object.keys(t.nodes).forEach((n) => {
    const r = t.nodes[n];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), t.cached.tableNodeTypes = e, e;
}
function Yw(t, e, n, r, s) {
  const i = Jw(t), o = [], l = [];
  for (let c = 0; c < n; c += 1) {
    const u = Wd(i.cell, s);
    if (u && l.push(u), r) {
      const f = Wd(i.header_cell, s);
      f && o.push(f);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(i.row.createChecked(null, r && c === 0 ? o : l));
  return i.table.createChecked(null, a);
}
function Xw(t) {
  return t instanceof be;
}
const Zs = ({ editor: t }) => {
  const { selection: e } = t.state;
  if (!Xw(e))
    return !1;
  let n = 0;
  const r = jp(e.ranges[0].$from, (i) => i.type.name === "table");
  return r?.node.descendants((i) => {
    if (i.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(i.type.name) && (n += 1);
  }), n === e.ranges.length ? (t.commands.deleteTable(), !0) : !1;
};
De.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: qw,
      lastColumnResizable: !0,
      allowTableNodeSelection: !1
    };
  },
  content: "tableRow+",
  tableRole: "table",
  isolating: !0,
  group: "block",
  parseHTML() {
    return [{ tag: "table" }];
  },
  renderHTML({ node: t, HTMLAttributes: e }) {
    const { colgroup: n, tableWidth: r, tableMinWidth: s } = Gw(t, this.options.cellMinWidth);
    return [
      "table",
      me(this.options.HTMLAttributes, e, {
        style: r ? `width: ${r}` : `minWidth: ${s}`
      }),
      n,
      ["tbody", 0]
    ];
  },
  addCommands() {
    return {
      insertTable: ({ rows: t = 3, cols: e = 3, withHeaderRow: n = !0 } = {}) => ({ tr: r, dispatch: s, editor: i }) => {
        const o = Yw(i.schema, t, e, n);
        if (s) {
          const l = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(ne.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: t, dispatch: e }) => Ow(t, e),
      addColumnAfter: () => ({ state: t, dispatch: e }) => jw(t, e),
      deleteColumn: () => ({ state: t, dispatch: e }) => Pw(t, e),
      addRowBefore: () => ({ state: t, dispatch: e }) => Lw(t, e),
      addRowAfter: () => ({ state: t, dispatch: e }) => Nw(t, e),
      deleteRow: () => ({ state: t, dispatch: e }) => $w(t, e),
      deleteTable: () => ({ state: t, dispatch: e }) => Kw(t, e),
      mergeCells: () => ({ state: t, dispatch: e }) => $d(t, e),
      splitCell: () => ({ state: t, dispatch: e }) => Dd(t, e),
      toggleHeaderColumn: () => ({ state: t, dispatch: e }) => Es("column")(t, e),
      toggleHeaderRow: () => ({ state: t, dispatch: e }) => Es("row")(t, e),
      toggleHeaderCell: () => ({ state: t, dispatch: e }) => Ww(t, e),
      mergeOrSplit: () => ({ state: t, dispatch: e }) => $d(t, e) ? !0 : Dd(t, e),
      setCellAttribute: (t, e) => ({ state: n, dispatch: r }) => Hw(t, e)(n, r),
      goToNextCell: () => ({ state: t, dispatch: e }) => Hd(1)(t, e),
      goToPreviousCell: () => ({ state: t, dispatch: e }) => Hd(-1)(t, e),
      fixTables: () => ({ state: t, dispatch: e }) => (e && Hp(t), !0),
      setCellSelection: (t) => ({ tr: e, dispatch: n }) => {
        if (n) {
          const r = be.create(e.doc, t.anchorCell, t.headCell);
          e.setSelection(r);
        }
        return !0;
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.goToNextCell() ? !0 : this.editor.can().addRowAfter() ? this.editor.chain().addRowAfter().goToNextCell().run() : !1,
      "Shift-Tab": () => this.editor.commands.goToPreviousCell(),
      Backspace: Zs,
      "Mod-Backspace": Zs,
      Delete: Zs,
      "Mod-Delete": Zs
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        vw({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      Uw({
        allowTableNodeSelection: this.options.allowTableNodeSelection
      })
    ];
  },
  extendNodeSchema(t) {
    const e = {
      name: t.name,
      options: t.options,
      storage: t.storage
    };
    return {
      tableRole: Ee(Ne(t, "tableRole", e))
    };
  }
});
De.create({
  name: "tableCell",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (t) => {
          const e = t.getAttribute("colwidth");
          return e ? [parseInt(e, 10)] : null;
        }
      }
    };
  },
  tableRole: "cell",
  isolating: !0,
  parseHTML() {
    return [
      { tag: "td" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["td", me(this.options.HTMLAttributes, t), 0];
  }
});
De.create({
  name: "tableHeader",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (t) => {
          const e = t.getAttribute("colwidth");
          return e ? [parseInt(e, 10)] : null;
        }
      }
    };
  },
  tableRole: "header_cell",
  isolating: !0,
  parseHTML() {
    return [
      { tag: "th" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["th", me(this.options.HTMLAttributes, t), 0];
  }
});
De.create({
  name: "tableRow",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "(tableCell | tableHeader)*",
  tableRole: "row",
  parseHTML() {
    return [
      { tag: "tr" }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["tr", me(this.options.HTMLAttributes, t), 0];
  }
});
const Vd = (t) => new Promise((e) => {
  let n = new FileReader();
  n.onloadend = () => {
    e(n.result);
  }, n.readAsDataURL(t);
}), Qw = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
De.create({
  name: "image",
  addOptions() {
    return {
      inline: !1,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: !0,
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["img", me(this.options.HTMLAttributes, t)];
  },
  addCommands() {
    return {
      setImage: (t) => ({ commands: e }) => e.insertContent({
        type: this.name,
        attrs: t
      })
    };
  },
  addInputRules() {
    return [
      Rp({
        find: Qw,
        type: this.type,
        getAttributes: (t) => {
          const [, , e, n, r] = t;
          return { src: n, alt: e, title: r };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    return [Zw()];
  }
});
const Zw = () => new st({
  props: {
    handlePaste(t, e, n) {
      const r = Array.from(e.clipboardData?.items || []), { schema: s } = t.state;
      return r.forEach((i) => {
        const o = i.getAsFile();
        o && i.type.indexOf("image") === 0 && (e.preventDefault(), Vd(o).then((l) => {
          const a = s.nodes.image.create({
            src: l
          }), c = t.state.tr.replaceSelectionWith(a);
          t.dispatch(c);
        }));
      }), !1;
    },
    handleDOMEvents: {
      drop: (t, e) => {
        if (!(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length))
          return !1;
        const r = Array.from(e.dataTransfer?.files ?? []).filter(
          (o) => /image/i.test(o.type)
        );
        if (r.length === 0)
          return !1;
        e.preventDefault();
        const { schema: s } = t.state, i = t.posAtCoords({
          left: e.clientX,
          top: e.clientY
        });
        return i ? (r.forEach(async (o) => {
          Vd(o).then((l) => {
            const a = s.nodes.image.create({
              src: l
            }), c = t.state.tr.insert(i.pos, a);
            t.dispatch(c);
          });
        }), !0) : !1;
      }
    }
  }
});
De.create({
  name: "video",
  group: "block",
  selectable: !0,
  draggable: !0,
  atom: !0,
  addAttributes() {
    return {
      src: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "video"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["video", me(t)];
  },
  addNodeView() {
    return ({ editor: t, node: e }) => {
      const n = document.createElement("div");
      n.className = "relative aspect-w-16 aspect-h-9" + (t.isEditable ? " cursor-pointer" : "");
      const r = document.createElement("video");
      if (t.isEditable && (r.className = "pointer-events-none"), r.src = e.attrs.src, !t.isEditable)
        r.setAttribute("controls", "");
      else {
        let s = document.createElement("div");
        s.className = "absolute top-0 right-0 text-xs m-2 bg-gray-800 text-white px-2 py-1 rounded-md", s.innerHTML = "Video", n.append(s);
      }
      return n.append(r), {
        dom: n
      };
    };
  }
});
const e8 = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", t8 = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Br = (t, e) => {
  for (const n in e)
    t[n] = e[n];
  return t;
}, va = "numeric", wa = "ascii", xa = "alpha", gi = "asciinumeric", ei = "alphanumeric", ka = "domain", Up = "emoji", n8 = "scheme", r8 = "slashscheme", Kd = "whitespace";
function s8(t, e) {
  return t in e || (e[t] = []), e[t];
}
function sr(t, e, n) {
  e[va] && (e[gi] = !0, e[ei] = !0), e[wa] && (e[gi] = !0, e[xa] = !0), e[gi] && (e[ei] = !0), e[xa] && (e[ei] = !0), e[ei] && (e[ka] = !0), e[Up] && (e[ka] = !0);
  for (const r in e) {
    const s = s8(r, n);
    s.indexOf(t) < 0 && s.push(t);
  }
}
function i8(t, e) {
  const n = {};
  for (const r in e)
    e[r].indexOf(t) >= 0 && (n[r] = !0);
  return n;
}
function gt(t) {
  t === void 0 && (t = null), this.j = {}, this.jr = [], this.jd = null, this.t = t;
}
gt.groups = {};
gt.prototype = {
  accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go(t) {
    const e = this, n = e.j[t];
    if (n)
      return n;
    for (let r = 0; r < e.jr.length; r++) {
      const s = e.jr[r][0], i = e.jr[r][1];
      if (i && s.test(t))
        return i;
    }
    return e.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has(t, e) {
    return e === void 0 && (e = !1), e ? t in this.j : !!this.go(t);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta(t, e, n, r) {
    for (let s = 0; s < t.length; s++)
      this.tt(t[s], e, n, r);
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr(t, e, n, r) {
    r = r || gt.groups;
    let s;
    return e && e.j ? s = e : (s = new gt(e), n && r && sr(e, n, r)), this.jr.push([t, s]), s;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts(t, e, n, r) {
    let s = this;
    const i = t.length;
    if (!i)
      return s;
    for (let o = 0; o < i - 1; o++)
      s = s.tt(t[o]);
    return s.tt(t[i - 1], e, n, r);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt(t, e, n, r) {
    r = r || gt.groups;
    const s = this;
    if (e && e.j)
      return s.j[t] = e, e;
    const i = e;
    let o, l = s.go(t);
    if (l ? (o = new gt(), Br(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new gt(), i) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = Br(i8(o.t, r), n);
          sr(i, a, r);
        } else
          n && sr(i, n, r);
      o.t = i;
    }
    return s.j[t] = o, o;
  }
};
const ae = (t, e, n, r, s) => t.ta(e, n, r, s), At = (t, e, n, r, s) => t.tr(e, n, r, s), Ud = (t, e, n, r, s) => t.ts(e, n, r, s), V = (t, e, n, r, s) => t.tt(e, n, r, s), cn = "WORD", _a = "UWORD", Ms = "LOCALHOST", Sa = "TLD", Ca = "UTLD", yi = "SCHEME", kr = "SLASH_SCHEME", Pc = "NUM", qp = "WS", Ic = "NL", hs = "OPENBRACE", ps = "CLOSEBRACE", $i = "OPENBRACKET", Di = "CLOSEBRACKET", Bi = "OPENPAREN", Hi = "CLOSEPAREN", Fi = "OPENANGLEBRACKET", Wi = "CLOSEANGLEBRACKET", Vi = "FULLWIDTHLEFTPAREN", Ki = "FULLWIDTHRIGHTPAREN", Ui = "LEFTCORNERBRACKET", qi = "RIGHTCORNERBRACKET", Gi = "LEFTWHITECORNERBRACKET", Ji = "RIGHTWHITECORNERBRACKET", Yi = "FULLWIDTHLESSTHAN", Xi = "FULLWIDTHGREATERTHAN", Qi = "AMPERSAND", Zi = "APOSTROPHE", eo = "ASTERISK", Mn = "AT", to = "BACKSLASH", no = "BACKTICK", ro = "CARET", Tn = "COLON", Lc = "COMMA", so = "DOLLAR", Gt = "DOT", io = "EQUALS", Nc = "EXCLAMATION", Jt = "HYPHEN", oo = "PERCENT", lo = "PIPE", ao = "PLUS", co = "POUND", uo = "QUERY", zc = "QUOTE", $c = "SEMI", Yt = "SLASH", ms = "TILDE", fo = "UNDERSCORE", Gp = "EMOJI", ho = "SYM";
var Jp = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: cn,
  UWORD: _a,
  LOCALHOST: Ms,
  TLD: Sa,
  UTLD: Ca,
  SCHEME: yi,
  SLASH_SCHEME: kr,
  NUM: Pc,
  WS: qp,
  NL: Ic,
  OPENBRACE: hs,
  CLOSEBRACE: ps,
  OPENBRACKET: $i,
  CLOSEBRACKET: Di,
  OPENPAREN: Bi,
  CLOSEPAREN: Hi,
  OPENANGLEBRACKET: Fi,
  CLOSEANGLEBRACKET: Wi,
  FULLWIDTHLEFTPAREN: Vi,
  FULLWIDTHRIGHTPAREN: Ki,
  LEFTCORNERBRACKET: Ui,
  RIGHTCORNERBRACKET: qi,
  LEFTWHITECORNERBRACKET: Gi,
  RIGHTWHITECORNERBRACKET: Ji,
  FULLWIDTHLESSTHAN: Yi,
  FULLWIDTHGREATERTHAN: Xi,
  AMPERSAND: Qi,
  APOSTROPHE: Zi,
  ASTERISK: eo,
  AT: Mn,
  BACKSLASH: to,
  BACKTICK: no,
  CARET: ro,
  COLON: Tn,
  COMMA: Lc,
  DOLLAR: so,
  DOT: Gt,
  EQUALS: io,
  EXCLAMATION: Nc,
  HYPHEN: Jt,
  PERCENT: oo,
  PIPE: lo,
  PLUS: ao,
  POUND: co,
  QUERY: uo,
  QUOTE: zc,
  SEMI: $c,
  SLASH: Yt,
  TILDE: ms,
  UNDERSCORE: fo,
  EMOJI: Gp,
  SYM: ho
});
const br = /[a-z]/, _l = /\p{L}/u, Sl = /\p{Emoji}/u, Cl = /\d/, qd = /\s/, Gd = `
`, o8 = "️", l8 = "‍";
let ti = null, ni = null;
function a8(t) {
  t === void 0 && (t = []);
  const e = {};
  gt.groups = e;
  const n = new gt();
  ti == null && (ti = Jd(e8)), ni == null && (ni = Jd(t8)), V(n, "'", Zi), V(n, "{", hs), V(n, "}", ps), V(n, "[", $i), V(n, "]", Di), V(n, "(", Bi), V(n, ")", Hi), V(n, "<", Fi), V(n, ">", Wi), V(n, "（", Vi), V(n, "）", Ki), V(n, "「", Ui), V(n, "」", qi), V(n, "『", Gi), V(n, "』", Ji), V(n, "＜", Yi), V(n, "＞", Xi), V(n, "&", Qi), V(n, "*", eo), V(n, "@", Mn), V(n, "`", no), V(n, "^", ro), V(n, ":", Tn), V(n, ",", Lc), V(n, "$", so), V(n, ".", Gt), V(n, "=", io), V(n, "!", Nc), V(n, "-", Jt), V(n, "%", oo), V(n, "|", lo), V(n, "+", ao), V(n, "#", co), V(n, "?", uo), V(n, '"', zc), V(n, "/", Yt), V(n, ";", $c), V(n, "~", ms), V(n, "_", fo), V(n, "\\", to);
  const r = At(n, Cl, Pc, {
    [va]: !0
  });
  At(r, Cl, r);
  const s = At(n, br, cn, {
    [wa]: !0
  });
  At(s, br, s);
  const i = At(n, _l, _a, {
    [xa]: !0
  });
  At(i, br), At(i, _l, i);
  const o = At(n, qd, qp, {
    [Kd]: !0
  });
  V(n, Gd, Ic, {
    [Kd]: !0
  }), V(o, Gd), At(o, qd, o);
  const l = At(n, Sl, Gp, {
    [Up]: !0
  });
  At(l, Sl, l), V(l, o8, l);
  const a = V(l, l8);
  At(a, Sl, l);
  const c = [[br, s]], u = [[br, null], [_l, i]];
  for (let f = 0; f < ti.length; f++)
    yn(n, ti[f], Sa, cn, c);
  for (let f = 0; f < ni.length; f++)
    yn(n, ni[f], Ca, _a, u);
  sr(Sa, {
    tld: !0,
    ascii: !0
  }, e), sr(Ca, {
    utld: !0,
    alpha: !0
  }, e), yn(n, "file", yi, cn, c), yn(n, "mailto", yi, cn, c), yn(n, "http", kr, cn, c), yn(n, "https", kr, cn, c), yn(n, "ftp", kr, cn, c), yn(n, "ftps", kr, cn, c), sr(yi, {
    scheme: !0,
    ascii: !0
  }, e), sr(kr, {
    slashscheme: !0,
    ascii: !0
  }, e), t = t.sort((f, h) => f[0] > h[0] ? 1 : -1);
  for (let f = 0; f < t.length; f++) {
    const h = t[f][0], y = t[f][1] ? {
      [n8]: !0
    } : {
      [r8]: !0
    };
    h.indexOf("-") >= 0 ? y[ka] = !0 : br.test(h) ? Cl.test(h) ? y[gi] = !0 : y[wa] = !0 : y[va] = !0, Ud(n, h, h, y);
  }
  return Ud(n, "localhost", Ms, {
    ascii: !0
  }), n.jd = new gt(ho), {
    start: n,
    tokens: Br({
      groups: e
    }, Jp)
  };
}
function c8(t, e) {
  const n = u8(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = n.length, s = [];
  let i = 0, o = 0;
  for (; o < r; ) {
    let l = t, a = null, c = 0, u = null, f = -1, h = -1;
    for (; o < r && (a = l.go(n[o])); )
      l = a, l.accepts() ? (f = 0, h = 0, u = l) : f >= 0 && (f += n[o].length, h++), c += n[o].length, i += n[o].length, o++;
    i -= f, o -= h, c -= f, s.push({
      t: u.t,
      // token type/name
      v: e.slice(i - c, i),
      // string value
      s: i - c,
      // start index
      e: i
      // end index (excluding)
    });
  }
  return s;
}
function u8(t) {
  const e = [], n = t.length;
  let r = 0;
  for (; r < n; ) {
    let s = t.charCodeAt(r), i, o = s < 55296 || s > 56319 || r + 1 === n || (i = t.charCodeAt(r + 1)) < 56320 || i > 57343 ? t[r] : t.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function yn(t, e, n, r, s) {
  let i;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    t.j[a] ? i = t.j[a] : (i = new gt(r), i.jr = s.slice(), t.j[a] = i), t = i;
  }
  return i = new gt(n), i.jr = s.slice(), t.j[e[o - 1]] = i, i;
}
function Jd(t) {
  const e = [], n = [];
  let r = 0, s = "0123456789";
  for (; r < t.length; ) {
    let i = 0;
    for (; s.indexOf(t[r + i]) >= 0; )
      i++;
    if (i > 0) {
      e.push(n.join(""));
      for (let o = parseInt(t.substring(r, r + i), 10); o > 0; o--)
        n.pop();
      r += i;
    } else
      n.push(t[r]), r++;
  }
  return e;
}
const As = {
  defaultProtocol: "http",
  events: null,
  format: Yd,
  formatHref: Yd,
  nl2br: !1,
  tagName: "a",
  target: null,
  rel: null,
  validate: !0,
  truncate: 1 / 0,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};
function Dc(t, e) {
  e === void 0 && (e = null);
  let n = Br({}, As);
  t && (n = Br(n, t instanceof Dc ? t.o : t));
  const r = n.ignoreTags, s = [];
  for (let i = 0; i < r.length; i++)
    s.push(r[i].toUpperCase());
  this.o = n, e && (this.defaultRender = e), this.ignoreTags = s;
}
Dc.prototype = {
  o: As,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender(t) {
    return t;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check(t) {
    return this.get("validate", t.toString(), t);
  },
  // Private methods
  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get(t, e, n) {
    const r = e != null;
    let s = this.o[t];
    return s && (typeof s == "object" ? (s = n.t in s ? s[n.t] : As[t], typeof s == "function" && r && (s = s(e, n))) : typeof s == "function" && r && (s = s(e, n.t, n)), s);
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj(t, e, n) {
    let r = this.o[t];
    return typeof r == "function" && e != null && (r = r(e, n.t, n)), r;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render(t) {
    const e = t.render(this);
    return (this.get("render", null, t) || this.defaultRender)(e, t.t, t);
  }
};
function Yd(t) {
  return t;
}
function Yp(t, e) {
  this.t = "token", this.v = t, this.tk = e;
}
Yp.prototype = {
  isLink: !1,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
  */
  toHref(t) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString(t) {
    const e = this.toString(), n = t.get("truncate", e, this), r = t.get("format", e, this);
    return n && r.length > n ? r.substring(0, n) + "…" : r;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref(t) {
    return t.get("formatHref", this.toHref(t.get("defaultProtocol")), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject(t) {
    return t === void 0 && (t = As.defaultProtocol), {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(t),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject(t) {
    return {
      type: this.t,
      value: this.toFormattedString(t),
      isLink: this.isLink,
      href: this.toFormattedHref(t),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate(t) {
    return t.get("validate", this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render(t) {
    const e = this, n = this.toHref(t.get("defaultProtocol")), r = t.get("formatHref", n, this), s = t.get("tagName", n, e), i = this.toFormattedString(t), o = {}, l = t.get("className", n, e), a = t.get("target", n, e), c = t.get("rel", n, e), u = t.getObj("attributes", n, e), f = t.getObj("events", n, e);
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), u && Br(o, u), {
      tagName: s,
      attributes: o,
      content: i,
      eventListeners: f
    };
  }
};
function Ko(t, e) {
  class n extends Yp {
    constructor(s, i) {
      super(s, i), this.t = t;
    }
  }
  for (const r in e)
    n.prototype[r] = e[r];
  return n.t = t, n;
}
const Xd = Ko("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), Qd = Ko("text"), d8 = Ko("nl"), ri = Ko("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(t) {
    return t === void 0 && (t = As.defaultProtocol), this.hasProtocol() ? this.v : `${t}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const t = this.tk;
    return t.length >= 2 && t[0].t !== Ms && t[1].t === Tn;
  }
}), Tt = (t) => new gt(t);
function f8(t) {
  let {
    groups: e
  } = t;
  const n = e.domain.concat([Qi, eo, Mn, to, no, ro, so, io, Jt, Pc, oo, lo, ao, co, Yt, ho, ms, fo]), r = [Zi, Tn, Lc, Gt, Nc, uo, zc, $c, Fi, Wi, hs, ps, Di, $i, Bi, Hi, Vi, Ki, Ui, qi, Gi, Ji, Yi, Xi], s = [Qi, Zi, eo, to, no, ro, so, io, Jt, hs, ps, oo, lo, ao, co, uo, Yt, ho, ms, fo], i = Tt(), o = V(i, ms);
  ae(o, s, o), ae(o, e.domain, o);
  const l = Tt(), a = Tt(), c = Tt();
  ae(i, e.domain, l), ae(i, e.scheme, a), ae(i, e.slashscheme, c), ae(l, s, o), ae(l, e.domain, l);
  const u = V(l, Mn);
  V(o, Mn, u), V(a, Mn, u), V(c, Mn, u);
  const f = V(o, Gt);
  ae(f, s, o), ae(f, e.domain, o);
  const h = Tt();
  ae(u, e.domain, h), ae(h, e.domain, h);
  const m = V(h, Gt);
  ae(m, e.domain, h);
  const y = Tt(Xd);
  ae(m, e.tld, y), ae(m, e.utld, y), V(u, Ms, y);
  const b = V(h, Jt);
  ae(b, e.domain, h), ae(y, e.domain, h), V(y, Gt, m), V(y, Jt, b);
  const x = V(y, Tn);
  ae(x, e.numeric, Xd);
  const C = V(l, Jt), T = V(l, Gt);
  ae(C, e.domain, l), ae(T, s, o), ae(T, e.domain, l);
  const O = Tt(ri);
  ae(T, e.tld, O), ae(T, e.utld, O), ae(O, e.domain, l), ae(O, s, o), V(O, Gt, T), V(O, Jt, C), V(O, Mn, u);
  const d = V(O, Tn), g = Tt(ri);
  ae(d, e.numeric, g);
  const p = Tt(ri), v = Tt();
  ae(p, n, p), ae(p, r, v), ae(v, n, p), ae(v, r, v), V(O, Yt, p), V(g, Yt, p);
  const w = V(a, Tn), _ = V(c, Tn), k = V(_, Yt), M = V(k, Yt);
  ae(a, e.domain, l), V(a, Gt, T), V(a, Jt, C), ae(c, e.domain, l), V(c, Gt, T), V(c, Jt, C), ae(w, e.domain, p), V(w, Yt, p), ae(M, e.domain, p), ae(M, n, p), V(M, Yt, p);
  const j = [
    [hs, ps],
    // {}
    [$i, Di],
    // []
    [Bi, Hi],
    // ()
    [Fi, Wi],
    // <>
    [Vi, Ki],
    // （）
    [Ui, qi],
    // 「」
    [Gi, Ji],
    // 『』
    [Yi, Xi]
    // ＜＞
  ];
  for (let P = 0; P < j.length; P++) {
    const [L, z] = j[P], S = V(p, L);
    V(v, L, S), V(S, z, p);
    const R = Tt(ri);
    ae(S, n, R);
    const N = Tt();
    ae(S, r), ae(R, n, R), ae(R, r, N), ae(N, n, R), ae(N, r, N), V(R, z, p), V(N, z, p);
  }
  return V(i, Ms, O), V(i, Ic, d8), {
    start: i,
    tokens: Jp
  };
}
function h8(t, e, n) {
  let r = n.length, s = 0, i = [], o = [];
  for (; s < r; ) {
    let l = t, a = null, c = null, u = 0, f = null, h = -1;
    for (; s < r && !(a = l.go(n[s].t)); )
      o.push(n[s++]);
    for (; s < r && (c = a || l.go(n[s].t)); )
      a = null, l = c, l.accepts() ? (h = 0, f = l) : h >= 0 && h++, s++, u++;
    if (h < 0)
      s -= u, s < r && (o.push(n[s]), s++);
    else {
      o.length > 0 && (i.push(El(Qd, e, o)), o = []), s -= h, u -= h;
      const m = f.t, y = n.slice(s - u, s);
      i.push(El(m, e, y));
    }
  }
  return o.length > 0 && i.push(El(Qd, e, o)), i;
}
function El(t, e, n) {
  const r = n[0].s, s = n[n.length - 1].e, i = e.slice(r, s);
  return new t(i, n);
}
const p8 = typeof console < "u" && console && console.warn || (() => {
}), m8 = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", _e = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function g8() {
  gt.groups = {}, _e.scanner = null, _e.parser = null, _e.tokenQueue = [], _e.pluginQueue = [], _e.customSchemes = [], _e.initialized = !1;
}
function Zd(t, e) {
  if (e === void 0 && (e = !1), _e.initialized && p8(`linkifyjs: already initialized - will not register custom scheme "${t}" ${m8}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(t))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  _e.customSchemes.push([t, e]);
}
function y8() {
  _e.scanner = a8(_e.customSchemes);
  for (let t = 0; t < _e.tokenQueue.length; t++)
    _e.tokenQueue[t][1]({
      scanner: _e.scanner
    });
  _e.parser = f8(_e.scanner.tokens);
  for (let t = 0; t < _e.pluginQueue.length; t++)
    _e.pluginQueue[t][1]({
      scanner: _e.scanner,
      parser: _e.parser
    });
  _e.initialized = !0;
}
function b8(t) {
  return _e.initialized || y8(), h8(_e.parser.start, t, c8(_e.scanner.start, t));
}
function Bc(t, e, n) {
  if (e === void 0 && (e = null), n === void 0 && (n = null), e && typeof e == "object") {
    if (n)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    n = e, e = null;
  }
  const r = new Dc(n), s = b8(t), i = [];
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    l.isLink && (!e || l.t === e) && r.check(l) && i.push(l.toFormattedObject(r));
  }
  return i;
}
function v8(t) {
  return new st({
    key: new it("autolink"),
    appendTransaction: (e, n, r) => {
      const s = e.some((c) => c.docChanged) && !n.doc.eq(r.doc), i = e.some((c) => c.getMeta("preventAutolink"));
      if (!s || i)
        return;
      const { tr: o } = r, l = xv(n.doc, [...e]);
      if (Av(l).forEach(({ newRange: c }) => {
        const u = _v(r.doc, c, (m) => m.isTextblock);
        let f, h;
        if (u.length > 1 ? (f = u[0], h = r.doc.textBetween(f.pos, f.pos + f.node.nodeSize, void 0, " ")) : u.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (f = u[0], h = r.doc.textBetween(f.pos, c.to, void 0, " ")), f && h) {
          const m = h.split(" ").filter((x) => x !== "");
          if (m.length <= 0)
            return !1;
          const y = m[m.length - 1], b = f.pos + h.lastIndexOf(y);
          if (!y)
            return !1;
          Bc(y).filter((x) => x.isLink).map((x) => ({
            ...x,
            from: b + x.start + 1,
            to: b + x.end + 1
          })).filter((x) => r.schema.marks.code ? !r.doc.rangeHasMark(x.from, x.to, r.schema.marks.code) : !0).filter((x) => t.validate ? t.validate(x.value) : !0).forEach((x) => {
            Oc(x.from, x.to, r.doc).some((C) => C.mark.type === t.type) || o.addMark(x.from, x.to, t.type.create({
              href: x.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function w8(t) {
  return new st({
    key: new it("handleClickLink"),
    props: {
      handleClick: (e, n, r) => {
        var s, i;
        if (r.button !== 0)
          return !1;
        let o = r.target;
        const l = [];
        for (; o.nodeName !== "DIV"; )
          l.push(o), o = o.parentNode;
        if (!l.find((h) => h.nodeName === "A"))
          return !1;
        const a = Cv(e.state, t.type.name), c = r.target, u = (s = c?.href) !== null && s !== void 0 ? s : a.href, f = (i = c?.target) !== null && i !== void 0 ? i : a.target;
        return c && u ? (window.open(u, f), !0) : !1;
      }
    }
  });
}
function x8(t) {
  return new st({
    key: new it("handlePasteLink"),
    props: {
      handlePaste: (e, n, r) => {
        const { state: s } = e, { selection: i } = s, { empty: o } = i;
        if (o)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = Bc(l).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : (t.editor.commands.setMark(t.type, {
          href: a.href
        }), !0);
      }
    }
  });
}
Lt.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((t) => {
      if (typeof t == "string") {
        Zd(t);
        return;
      }
      Zd(t.scheme, t.optionalSlashes);
    });
  },
  onDestroy() {
    g8();
  },
  inclusive() {
    return this.options.autolink;
  },
  addOptions() {
    return {
      openOnClick: !0,
      linkOnPaste: !0,
      autolink: !0,
      protocols: [],
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        class: null
      },
      validate: void 0
    };
  },
  addAttributes() {
    return {
      href: {
        default: null
      },
      target: {
        default: this.options.HTMLAttributes.target
      },
      rel: {
        default: this.options.HTMLAttributes.rel
      },
      class: {
        default: this.options.HTMLAttributes.class
      }
    };
  },
  parseHTML() {
    return [{ tag: 'a[href]:not([href *= "javascript:" i])' }];
  },
  renderHTML({ HTMLAttributes: t }) {
    var e;
    return !((e = t.href) === null || e === void 0) && e.startsWith("javascript:") ? ["a", me(this.options.HTMLAttributes, { ...t, href: "" }), 0] : ["a", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setLink: (t) => ({ chain: e }) => e().setMark(this.name, t).setMeta("preventAutolink", !0).run(),
      toggleLink: (t) => ({ chain: e }) => e().toggleMark(this.name, t, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run(),
      unsetLink: () => ({ chain: t }) => t().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
    };
  },
  addPasteRules() {
    return [
      Bn({
        find: (t) => {
          const e = [];
          if (t) {
            const n = Bc(t).filter((r) => r.isLink);
            n.length && n.forEach((r) => e.push({
              text: r.value,
              data: {
                href: r.href
              },
              index: r.start
            }));
          }
          return e;
        },
        type: this.type,
        getAttributes: (t) => {
          var e;
          return {
            href: (e = t.data) === null || e === void 0 ? void 0 : e.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const t = [];
    return this.options.autolink && t.push(v8({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && t.push(w8({
      type: this.type
    })), this.options.linkOnPaste && t.push(x8({
      editor: this.editor,
      type: this.type
    })), t;
  }
});
const k8 = (t) => Re({
  find: /--$/,
  replace: t ?? "—"
}), _8 = (t) => Re({
  find: /\.\.\.$/,
  replace: t ?? "…"
}), S8 = (t) => Re({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(")$/,
  replace: t ?? "“"
}), C8 = (t) => Re({
  find: /"$/,
  replace: t ?? "”"
}), E8 = (t) => Re({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(')$/,
  replace: t ?? "‘"
}), M8 = (t) => Re({
  find: /'$/,
  replace: t ?? "’"
}), A8 = (t) => Re({
  find: /<-$/,
  replace: t ?? "←"
}), T8 = (t) => Re({
  find: /->$/,
  replace: t ?? "→"
}), O8 = (t) => Re({
  find: /\(c\)$/,
  replace: t ?? "©"
}), j8 = (t) => Re({
  find: /\(tm\)$/,
  replace: t ?? "™"
}), R8 = (t) => Re({
  find: /\(sm\)$/,
  replace: t ?? "℠"
}), P8 = (t) => Re({
  find: /\(r\)$/,
  replace: t ?? "®"
}), I8 = (t) => Re({
  find: /(?:^|\s)(1\/2)\s$/,
  replace: t ?? "½"
}), L8 = (t) => Re({
  find: /\+\/-$/,
  replace: t ?? "±"
}), N8 = (t) => Re({
  find: /!=$/,
  replace: t ?? "≠"
}), z8 = (t) => Re({
  find: /<<$/,
  replace: t ?? "«"
}), $8 = (t) => Re({
  find: />>$/,
  replace: t ?? "»"
}), D8 = (t) => Re({
  find: /\d+\s?([*x])\s?\d+$/,
  replace: t ?? "×"
}), B8 = (t) => Re({
  find: /\^2$/,
  replace: t ?? "²"
}), H8 = (t) => Re({
  find: /\^3$/,
  replace: t ?? "³"
}), F8 = (t) => Re({
  find: /(?:^|\s)(1\/4)\s$/,
  replace: t ?? "¼"
}), W8 = (t) => Re({
  find: /(?:^|\s)(3\/4)\s$/,
  replace: t ?? "¾"
});
nt.create({
  name: "typography",
  addInputRules() {
    const t = [];
    return this.options.emDash !== !1 && t.push(k8(this.options.emDash)), this.options.ellipsis !== !1 && t.push(_8(this.options.ellipsis)), this.options.openDoubleQuote !== !1 && t.push(S8(this.options.openDoubleQuote)), this.options.closeDoubleQuote !== !1 && t.push(C8(this.options.closeDoubleQuote)), this.options.openSingleQuote !== !1 && t.push(E8(this.options.openSingleQuote)), this.options.closeSingleQuote !== !1 && t.push(M8(this.options.closeSingleQuote)), this.options.leftArrow !== !1 && t.push(A8(this.options.leftArrow)), this.options.rightArrow !== !1 && t.push(T8(this.options.rightArrow)), this.options.copyright !== !1 && t.push(O8(this.options.copyright)), this.options.trademark !== !1 && t.push(j8(this.options.trademark)), this.options.servicemark !== !1 && t.push(R8(this.options.servicemark)), this.options.registeredTrademark !== !1 && t.push(P8(this.options.registeredTrademark)), this.options.oneHalf !== !1 && t.push(I8(this.options.oneHalf)), this.options.plusMinus !== !1 && t.push(L8(this.options.plusMinus)), this.options.notEqual !== !1 && t.push(N8(this.options.notEqual)), this.options.laquo !== !1 && t.push(z8(this.options.laquo)), this.options.raquo !== !1 && t.push($8(this.options.raquo)), this.options.multiplication !== !1 && t.push(D8(this.options.multiplication)), this.options.superscriptTwo !== !1 && t.push(B8(this.options.superscriptTwo)), this.options.superscriptThree !== !1 && t.push(H8(this.options.superscriptThree)), this.options.oneQuarter !== !1 && t.push(F8(this.options.oneQuarter)), this.options.threeQuarters !== !1 && t.push(W8(this.options.threeQuarters)), t;
  }
});
Lt.create({
  name: "textStyle",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (t) => t.hasAttribute("style") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["span", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: t, commands: e }) => {
        const n = Ls(t, this.type);
        return Object.entries(n).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
});
const V8 = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/, K8 = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;
Lt.create({
  name: "highlight",
  addOptions() {
    return {
      multicolor: !1,
      HTMLAttributes: {}
    };
  },
  addAttributes() {
    return this.options.multicolor ? {
      color: {
        default: null,
        parseHTML: (t) => t.getAttribute("data-color") || t.style.backgroundColor,
        renderHTML: (t) => t.color ? {
          "data-color": t.color,
          style: `background-color: ${t.color}; color: inherit`
        } : {}
      }
    } : {};
  },
  parseHTML() {
    return [
      {
        tag: "mark"
      }
    ];
  },
  renderHTML({ HTMLAttributes: t }) {
    return ["mark", me(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      setHighlight: (t) => ({ commands: e }) => e.setMark(this.name, t),
      toggleHighlight: (t) => ({ commands: e }) => e.toggleMark(this.name, t),
      unsetHighlight: () => ({ commands: t }) => t.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight()
    };
  },
  addInputRules() {
    return [
      cr({
        find: V8,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Bn({
        find: K8,
        type: this.type
      })
    ];
  }
});
nt.create({
  name: "color",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: (t) => {
              var e;
              return (e = t.style.color) === null || e === void 0 ? void 0 : e.replace(/['"]+/g, "");
            },
            renderHTML: (t) => t.color ? {
              style: `color: ${t.color}`
            } : {}
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setColor: (t) => ({ chain: e }) => e().setMark("textStyle", { color: t }).run(),
      unsetColor: () => ({ chain: t }) => t().setMark("textStyle", { color: null }).removeEmptyTextStyle().run()
    };
  }
});
function U8(t) {
  var e;
  const { char: n, allowSpaces: r, allowedPrefixes: s, startOfLine: i, $position: o } = t, l = Yv(n), a = new RegExp(`\\s${l}$`), c = i ? "^" : "", u = r ? new RegExp(`${c}${l}.*?(?=\\s${l}|$)`, "gm") : new RegExp(`${c}(?:^)?${l}[^\\s${l}]*`, "gm"), f = ((e = o.nodeBefore) === null || e === void 0 ? void 0 : e.isText) && o.nodeBefore.text;
  if (!f)
    return null;
  const h = o.pos - f.length, m = Array.from(f.matchAll(u)).pop();
  if (!m || m.input === void 0 || m.index === void 0)
    return null;
  const y = m.input.slice(Math.max(0, m.index - 1), m.index), b = new RegExp(`^[${s?.join("")}\0]?$`).test(y);
  if (s !== null && !b)
    return null;
  const x = h + m.index;
  let C = x + m[0].length;
  return r && a.test(f.slice(C - 1, C + 1)) && (m[0] += " ", C += 1), x < o.pos && C >= o.pos ? {
    range: {
      from: x,
      to: C
    },
    query: m[0].slice(n.length),
    text: m[0]
  } : null;
}
const q8 = new it("suggestion");
function G8({ pluginKey: t = q8, editor: e, char: n = "@", allowSpaces: r = !1, allowedPrefixes: s = [" "], startOfLine: i = !1, decorationTag: o = "span", decorationClass: l = "suggestion", command: a = () => null, items: c = () => [], render: u = () => ({}), allow: f = () => !0, findSuggestionMatch: h = U8 }) {
  let m;
  const y = u?.(), b = new st({
    key: t,
    view() {
      return {
        update: async (x, C) => {
          var T, O, d, g, p, v, w;
          const _ = (T = this.key) === null || T === void 0 ? void 0 : T.getState(C), k = (O = this.key) === null || O === void 0 ? void 0 : O.getState(x.state), M = _.active && k.active && _.range.from !== k.range.from, j = !_.active && k.active, P = _.active && !k.active, L = !j && !P && _.query !== k.query, z = j || M, S = L && !M, R = P || M;
          if (!z && !S && !R)
            return;
          const N = R && !z ? _ : k, q = x.dom.querySelector(`[data-decoration-id="${N.decorationId}"]`);
          m = {
            editor: e,
            range: N.range,
            query: N.query,
            text: N.text,
            items: [],
            command: (re) => {
              a({
                editor: e,
                range: N.range,
                props: re
              });
            },
            decorationNode: q,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: q ? () => {
              var re;
              const { decorationId: J } = (re = this.key) === null || re === void 0 ? void 0 : re.getState(e.state), ce = x.dom.querySelector(`[data-decoration-id="${J}"]`);
              return ce?.getBoundingClientRect() || null;
            } : null
          }, z && ((d = y?.onBeforeStart) === null || d === void 0 || d.call(y, m)), S && ((g = y?.onBeforeUpdate) === null || g === void 0 || g.call(y, m)), (S || z) && (m.items = await c({
            editor: e,
            query: N.query
          })), R && ((p = y?.onExit) === null || p === void 0 || p.call(y, m)), S && ((v = y?.onUpdate) === null || v === void 0 || v.call(y, m)), z && ((w = y?.onStart) === null || w === void 0 || w.call(y, m));
        },
        destroy: () => {
          var x;
          m && ((x = y?.onExit) === null || x === void 0 || x.call(y, m));
        }
      };
    },
    state: {
      // Initialize the plugin's internal state.
      init() {
        return {
          active: !1,
          range: {
            from: 0,
            to: 0
          },
          query: null,
          text: null,
          composing: !1
        };
      },
      // Apply changes to the plugin state from a view transaction.
      apply(x, C, T, O) {
        const { isEditable: d } = e, { composing: g } = e.view, { selection: p } = x, { empty: v, from: w } = p, _ = { ...C };
        if (_.composing = g, d && (v || e.view.composing)) {
          (w < C.range.from || w > C.range.to) && !g && !C.composing && (_.active = !1);
          const k = h({
            char: n,
            allowSpaces: r,
            allowedPrefixes: s,
            startOfLine: i,
            $position: p.$from
          }), M = `id_${Math.floor(Math.random() * 4294967295)}`;
          k && f({ editor: e, state: O, range: k.range }) ? (_.active = !0, _.decorationId = C.decorationId ? C.decorationId : M, _.range = k.range, _.query = k.query, _.text = k.text) : _.active = !1;
        } else
          _.active = !1;
        return _.active || (_.decorationId = null, _.range = { from: 0, to: 0 }, _.query = null, _.text = null), _;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(x, C) {
        var T;
        const { active: O, range: d } = b.getState(x.state);
        return O && ((T = y?.onKeyDown) === null || T === void 0 ? void 0 : T.call(y, { view: x, event: C, range: d })) || !1;
      },
      // Setup decorator on the currently active suggestion.
      decorations(x) {
        const { active: C, range: T, decorationId: O } = b.getState(x);
        return C ? Se.create(x.doc, [
          bt.inline(T.from, T.to, {
            nodeName: o,
            class: l,
            "data-decoration-id": O
          })
        ]) : null;
      }
    }
  });
  return b;
}
const J8 = new it("mention");
De.create({
  name: "mention",
  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ options: t, node: e }) {
        var n;
        return `${t.suggestion.char}${(n = e.attrs.label) !== null && n !== void 0 ? n : e.attrs.id}`;
      },
      renderHTML({ options: t, node: e }) {
        var n;
        return [
          "span",
          this.HTMLAttributes,
          `${t.suggestion.char}${(n = e.attrs.label) !== null && n !== void 0 ? n : e.attrs.id}`
        ];
      },
      suggestion: {
        char: "@",
        pluginKey: J8,
        command: ({ editor: t, range: e, props: n }) => {
          var r, s;
          const i = t.view.state.selection.$to.nodeAfter;
          ((r = i?.text) === null || r === void 0 ? void 0 : r.startsWith(" ")) && (e.to += 1), t.chain().focus().insertContentAt(e, [
            {
              type: this.name,
              attrs: n
            },
            {
              type: "text",
              text: " "
            }
          ]).run(), (s = window.getSelection()) === null || s === void 0 || s.collapseToEnd();
        },
        allow: ({ state: t, range: e }) => {
          const n = t.doc.resolve(e.from), r = t.schema.nodes[this.name];
          return !!n.parent.type.contentMatch.matchType(r);
        }
      }
    };
  },
  group: "inline",
  inline: !0,
  selectable: !1,
  atom: !0,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (t) => t.getAttribute("data-id"),
        renderHTML: (t) => t.id ? {
          "data-id": t.id
        } : {}
      },
      label: {
        default: null,
        parseHTML: (t) => t.getAttribute("data-label"),
        renderHTML: (t) => t.label ? {
          "data-label": t.label
        } : {}
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`
      }
    ];
  },
  renderHTML({ node: t, HTMLAttributes: e }) {
    if (this.options.renderLabel !== void 0)
      return console.warn("renderLabel is deprecated use renderText and renderHTML instead"), [
        "span",
        me({ "data-type": this.name }, this.options.HTMLAttributes, e),
        this.options.renderLabel({
          options: this.options,
          node: t
        })
      ];
    const n = this.options.renderHTML({
      options: this.options,
      node: t
    });
    return typeof n == "string" ? [
      "span",
      me({ "data-type": this.name }, this.options.HTMLAttributes, e),
      n
    ] : n;
  },
  renderText({ node: t }) {
    return this.options.renderLabel !== void 0 ? (console.warn("renderLabel is deprecated use renderText and renderHTML instead"), this.options.renderLabel({
      options: this.options,
      node: t
    })) : this.options.renderText({
      options: this.options,
      node: t
    });
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr: t, state: e }) => {
        let n = !1;
        const { selection: r } = e, { empty: s, anchor: i } = r;
        return s ? (e.doc.nodesBetween(i - 1, i, (o, l) => {
          if (o.type.name === this.name)
            return n = !0, t.insertText(this.options.suggestion.char || "", l, l + o.nodeSize), !1;
        }), n) : !1;
      })
    };
  },
  addProseMirrorPlugins() {
    return [
      G8({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
var Y8 = { exports: {} };
(function(t) {
  (function() {
    function e(d) {
      var g = {
        omitExtraWLInCodeBlocks: {
          defaultValue: !1,
          describe: "Omit the default extra whiteline added to code blocks",
          type: "boolean"
        },
        noHeaderId: {
          defaultValue: !1,
          describe: "Turn on/off generated header id",
          type: "boolean"
        },
        prefixHeaderId: {
          defaultValue: !1,
          describe: "Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic 'section-' prefix",
          type: "string"
        },
        rawPrefixHeaderId: {
          defaultValue: !1,
          describe: 'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',
          type: "boolean"
        },
        ghCompatibleHeaderId: {
          defaultValue: !1,
          describe: "Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)",
          type: "boolean"
        },
        rawHeaderId: {
          defaultValue: !1,
          describe: `Remove only spaces, ' and " from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids`,
          type: "boolean"
        },
        headerLevelStart: {
          defaultValue: !1,
          describe: "The header blocks level start",
          type: "integer"
        },
        parseImgDimensions: {
          defaultValue: !1,
          describe: "Turn on/off image dimension parsing",
          type: "boolean"
        },
        simplifiedAutoLink: {
          defaultValue: !1,
          describe: "Turn on/off GFM autolink style",
          type: "boolean"
        },
        excludeTrailingPunctuationFromURLs: {
          defaultValue: !1,
          describe: "Excludes trailing punctuation from links generated with autoLinking",
          type: "boolean"
        },
        literalMidWordUnderscores: {
          defaultValue: !1,
          describe: "Parse midword underscores as literal underscores",
          type: "boolean"
        },
        literalMidWordAsterisks: {
          defaultValue: !1,
          describe: "Parse midword asterisks as literal asterisks",
          type: "boolean"
        },
        strikethrough: {
          defaultValue: !1,
          describe: "Turn on/off strikethrough support",
          type: "boolean"
        },
        tables: {
          defaultValue: !1,
          describe: "Turn on/off tables support",
          type: "boolean"
        },
        tablesHeaderId: {
          defaultValue: !1,
          describe: "Add an id to table headers",
          type: "boolean"
        },
        ghCodeBlocks: {
          defaultValue: !0,
          describe: "Turn on/off GFM fenced code blocks support",
          type: "boolean"
        },
        tasklists: {
          defaultValue: !1,
          describe: "Turn on/off GFM tasklist support",
          type: "boolean"
        },
        smoothLivePreview: {
          defaultValue: !1,
          describe: "Prevents weird effects in live previews due to incomplete input",
          type: "boolean"
        },
        smartIndentationFix: {
          defaultValue: !1,
          describe: "Tries to smartly fix indentation in es6 strings",
          type: "boolean"
        },
        disableForced4SpacesIndentedSublists: {
          defaultValue: !1,
          describe: "Disables the requirement of indenting nested sublists by 4 spaces",
          type: "boolean"
        },
        simpleLineBreaks: {
          defaultValue: !1,
          describe: "Parses simple line breaks as <br> (GFM Style)",
          type: "boolean"
        },
        requireSpaceBeforeHeadingText: {
          defaultValue: !1,
          describe: "Makes adding a space between `#` and the header text mandatory (GFM Style)",
          type: "boolean"
        },
        ghMentions: {
          defaultValue: !1,
          describe: "Enables github @mentions",
          type: "boolean"
        },
        ghMentionsLink: {
          defaultValue: "https://github.com/{u}",
          describe: "Changes the link generated by @mentions. Only applies if ghMentions option is enabled.",
          type: "string"
        },
        encodeEmails: {
          defaultValue: !0,
          describe: "Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities",
          type: "boolean"
        },
        openLinksInNewWindow: {
          defaultValue: !1,
          describe: "Open all links in new windows",
          type: "boolean"
        },
        backslashEscapesHTMLTags: {
          defaultValue: !1,
          describe: "Support for HTML Tag escaping. ex: <div>foo</div>",
          type: "boolean"
        },
        emoji: {
          defaultValue: !1,
          describe: "Enable emoji support. Ex: `this is a :smile: emoji`",
          type: "boolean"
        },
        underline: {
          defaultValue: !1,
          describe: "Enable support for underline. Syntax is double or triple underscores: `__underline word__`. With this option enabled, underscores no longer parses into `<em>` and `<strong>`",
          type: "boolean"
        },
        ellipsis: {
          defaultValue: !0,
          describe: "Replaces three dots with the ellipsis unicode character",
          type: "boolean"
        },
        completeHTMLDocument: {
          defaultValue: !1,
          describe: "Outputs a complete html document, including `<html>`, `<head>` and `<body>` tags",
          type: "boolean"
        },
        metadata: {
          defaultValue: !1,
          describe: "Enable support for document metadata (defined at the top of the document between `«««` and `»»»` or between `---` and `---`).",
          type: "boolean"
        },
        splitAdjacentBlockquotes: {
          defaultValue: !1,
          describe: "Split adjacent blockquote blocks",
          type: "boolean"
        }
      };
      if (d === !1)
        return JSON.parse(JSON.stringify(g));
      var p = {};
      for (var v in g)
        g.hasOwnProperty(v) && (p[v] = g[v].defaultValue);
      return p;
    }
    function n() {
      var d = e(!0), g = {};
      for (var p in d)
        d.hasOwnProperty(p) && (g[p] = !0);
      return g;
    }
    var r = {}, s = {}, i = {}, o = e(!0), l = "vanilla", a = {
      github: {
        omitExtraWLInCodeBlocks: !0,
        simplifiedAutoLink: !0,
        excludeTrailingPunctuationFromURLs: !0,
        literalMidWordUnderscores: !0,
        strikethrough: !0,
        tables: !0,
        tablesHeaderId: !0,
        ghCodeBlocks: !0,
        tasklists: !0,
        disableForced4SpacesIndentedSublists: !0,
        simpleLineBreaks: !0,
        requireSpaceBeforeHeadingText: !0,
        ghCompatibleHeaderId: !0,
        ghMentions: !0,
        backslashEscapesHTMLTags: !0,
        emoji: !0,
        splitAdjacentBlockquotes: !0
      },
      original: {
        noHeaderId: !0,
        ghCodeBlocks: !1
      },
      ghost: {
        omitExtraWLInCodeBlocks: !0,
        parseImgDimensions: !0,
        simplifiedAutoLink: !0,
        excludeTrailingPunctuationFromURLs: !0,
        literalMidWordUnderscores: !0,
        strikethrough: !0,
        tables: !0,
        tablesHeaderId: !0,
        ghCodeBlocks: !0,
        tasklists: !0,
        smoothLivePreview: !0,
        simpleLineBreaks: !0,
        requireSpaceBeforeHeadingText: !0,
        ghMentions: !1,
        encodeEmails: !0
      },
      vanilla: e(!0),
      allOn: n()
    };
    r.helper = {}, r.extensions = {}, r.setOption = function(d, g) {
      return o[d] = g, this;
    }, r.getOption = function(d) {
      return o[d];
    }, r.getOptions = function() {
      return o;
    }, r.resetOptions = function() {
      o = e(!0);
    }, r.setFlavor = function(d) {
      if (!a.hasOwnProperty(d))
        throw Error(d + " flavor was not found");
      r.resetOptions();
      var g = a[d];
      l = d;
      for (var p in g)
        g.hasOwnProperty(p) && (o[p] = g[p]);
    }, r.getFlavor = function() {
      return l;
    }, r.getFlavorOptions = function(d) {
      if (a.hasOwnProperty(d))
        return a[d];
    }, r.getDefaultOptions = function(d) {
      return e(d);
    }, r.subParser = function(d, g) {
      if (r.helper.isString(d))
        if (typeof g < "u")
          s[d] = g;
        else {
          if (s.hasOwnProperty(d))
            return s[d];
          throw Error("SubParser named " + d + " not registered!");
        }
    }, r.extension = function(d, g) {
      if (!r.helper.isString(d))
        throw Error("Extension 'name' must be a string");
      if (d = r.helper.stdExtName(d), r.helper.isUndefined(g)) {
        if (!i.hasOwnProperty(d))
          throw Error("Extension named " + d + " is not registered!");
        return i[d];
      } else {
        typeof g == "function" && (g = g()), r.helper.isArray(g) || (g = [g]);
        var p = c(g, d);
        if (p.valid)
          i[d] = g;
        else
          throw Error(p.error);
      }
    }, r.getAllExtensions = function() {
      return i;
    }, r.removeExtension = function(d) {
      delete i[d];
    }, r.resetExtensions = function() {
      i = {};
    };
    function c(d, g) {
      var p = g ? "Error in " + g + " extension->" : "Error in unnamed extension", v = {
        valid: !0,
        error: ""
      };
      r.helper.isArray(d) || (d = [d]);
      for (var w = 0; w < d.length; ++w) {
        var _ = p + " sub-extension " + w + ": ", k = d[w];
        if (typeof k != "object")
          return v.valid = !1, v.error = _ + "must be an object, but " + typeof k + " given", v;
        if (!r.helper.isString(k.type))
          return v.valid = !1, v.error = _ + 'property "type" must be a string, but ' + typeof k.type + " given", v;
        var M = k.type = k.type.toLowerCase();
        if (M === "language" && (M = k.type = "lang"), M === "html" && (M = k.type = "output"), M !== "lang" && M !== "output" && M !== "listener")
          return v.valid = !1, v.error = _ + "type " + M + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', v;
        if (M === "listener") {
          if (r.helper.isUndefined(k.listeners))
            return v.valid = !1, v.error = _ + '. Extensions of type "listener" must have a property called "listeners"', v;
        } else if (r.helper.isUndefined(k.filter) && r.helper.isUndefined(k.regex))
          return v.valid = !1, v.error = _ + M + ' extensions must define either a "regex" property or a "filter" method', v;
        if (k.listeners) {
          if (typeof k.listeners != "object")
            return v.valid = !1, v.error = _ + '"listeners" property must be an object but ' + typeof k.listeners + " given", v;
          for (var j in k.listeners)
            if (k.listeners.hasOwnProperty(j) && typeof k.listeners[j] != "function")
              return v.valid = !1, v.error = _ + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + j + " must be a function but " + typeof k.listeners[j] + " given", v;
        }
        if (k.filter) {
          if (typeof k.filter != "function")
            return v.valid = !1, v.error = _ + '"filter" must be a function, but ' + typeof k.filter + " given", v;
        } else if (k.regex) {
          if (r.helper.isString(k.regex) && (k.regex = new RegExp(k.regex, "g")), !(k.regex instanceof RegExp))
            return v.valid = !1, v.error = _ + '"regex" property must either be a string or a RegExp object, but ' + typeof k.regex + " given", v;
          if (r.helper.isUndefined(k.replace))
            return v.valid = !1, v.error = _ + '"regex" extensions must implement a replace string or function', v;
        }
      }
      return v;
    }
    r.validateExtension = function(d) {
      var g = c(d, null);
      return g.valid ? !0 : (console.warn(g.error), !1);
    }, r.hasOwnProperty("helper") || (r.helper = {}), r.helper.isString = function(d) {
      return typeof d == "string" || d instanceof String;
    }, r.helper.isFunction = function(d) {
      var g = {};
      return d && g.toString.call(d) === "[object Function]";
    }, r.helper.isArray = function(d) {
      return Array.isArray(d);
    }, r.helper.isUndefined = function(d) {
      return typeof d > "u";
    }, r.helper.forEach = function(d, g) {
      if (r.helper.isUndefined(d))
        throw new Error("obj param is required");
      if (r.helper.isUndefined(g))
        throw new Error("callback param is required");
      if (!r.helper.isFunction(g))
        throw new Error("callback param must be a function/closure");
      if (typeof d.forEach == "function")
        d.forEach(g);
      else if (r.helper.isArray(d))
        for (var p = 0; p < d.length; p++)
          g(d[p], p, d);
      else if (typeof d == "object")
        for (var v in d)
          d.hasOwnProperty(v) && g(d[v], v, d);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, r.helper.stdExtName = function(d) {
      return d.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function u(d, g) {
      var p = g.charCodeAt(0);
      return "¨E" + p + "E";
    }
    r.helper.escapeCharactersCallback = u, r.helper.escapeCharacters = function(d, g, p) {
      var v = "([" + g.replace(/([\[\]\\])/g, "\\$1") + "])";
      p && (v = "\\\\" + v);
      var w = new RegExp(v, "g");
      return d = d.replace(w, u), d;
    }, r.helper.unescapeHTMLEntities = function(d) {
      return d.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var f = function(d, g, p, v) {
      var w = v || "", _ = w.indexOf("g") > -1, k = new RegExp(g + "|" + p, "g" + w.replace(/g/g, "")), M = new RegExp(g, w.replace(/g/g, "")), j = [], P, L, z, S, R;
      do
        for (P = 0; z = k.exec(d); )
          if (M.test(z[0]))
            P++ || (L = k.lastIndex, S = L - z[0].length);
          else if (P && !--P) {
            R = z.index + z[0].length;
            var N = {
              left: { start: S, end: L },
              match: { start: L, end: z.index },
              right: { start: z.index, end: R },
              wholeMatch: { start: S, end: R }
            };
            if (j.push(N), !_)
              return j;
          }
      while (P && (k.lastIndex = L));
      return j;
    };
    r.helper.matchRecursiveRegExp = function(d, g, p, v) {
      for (var w = f(d, g, p, v), _ = [], k = 0; k < w.length; ++k)
        _.push([
          d.slice(w[k].wholeMatch.start, w[k].wholeMatch.end),
          d.slice(w[k].match.start, w[k].match.end),
          d.slice(w[k].left.start, w[k].left.end),
          d.slice(w[k].right.start, w[k].right.end)
        ]);
      return _;
    }, r.helper.replaceRecursiveRegExp = function(d, g, p, v, w) {
      if (!r.helper.isFunction(g)) {
        var _ = g;
        g = function() {
          return _;
        };
      }
      var k = f(d, p, v, w), M = d, j = k.length;
      if (j > 0) {
        var P = [];
        k[0].wholeMatch.start !== 0 && P.push(d.slice(0, k[0].wholeMatch.start));
        for (var L = 0; L < j; ++L)
          P.push(
            g(
              d.slice(k[L].wholeMatch.start, k[L].wholeMatch.end),
              d.slice(k[L].match.start, k[L].match.end),
              d.slice(k[L].left.start, k[L].left.end),
              d.slice(k[L].right.start, k[L].right.end)
            )
          ), L < j - 1 && P.push(d.slice(k[L].wholeMatch.end, k[L + 1].wholeMatch.start));
        k[j - 1].wholeMatch.end < d.length && P.push(d.slice(k[j - 1].wholeMatch.end)), M = P.join("");
      }
      return M;
    }, r.helper.regexIndexOf = function(d, g, p) {
      if (!r.helper.isString(d))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(g instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var v = d.substring(p || 0).search(g);
      return v >= 0 ? v + (p || 0) : v;
    }, r.helper.splitAtIndex = function(d, g) {
      if (!r.helper.isString(d))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [d.substring(0, g), d.substring(g)];
    }, r.helper.encodeEmailAddress = function(d) {
      var g = [
        function(p) {
          return "&#" + p.charCodeAt(0) + ";";
        },
        function(p) {
          return "&#x" + p.charCodeAt(0).toString(16) + ";";
        },
        function(p) {
          return p;
        }
      ];
      return d = d.replace(/./g, function(p) {
        if (p === "@")
          p = g[Math.floor(Math.random() * 2)](p);
        else {
          var v = Math.random();
          p = v > 0.9 ? g[2](p) : v > 0.45 ? g[1](p) : g[0](p);
        }
        return p;
      }), d;
    }, r.helper.padEnd = function(g, p, v) {
      return p = p >> 0, v = String(v || " "), g.length > p ? String(g) : (p = p - g.length, p > v.length && (v += v.repeat(p / v.length)), String(g) + v.slice(0, p));
    }, typeof console > "u" && (console = {
      warn: function(d) {
        alert(d);
      },
      log: function(d) {
        alert(d);
      },
      error: function(d) {
        throw d;
      }
    }), r.helper.regexes = {
      asteriskDashAndColon: /([*_:~])/g
    }, r.helper.emojis = {
      "+1": "👍",
      "-1": "👎",
      100: "💯",
      1234: "🔢",
      "1st_place_medal": "🥇",
      "2nd_place_medal": "🥈",
      "3rd_place_medal": "🥉",
      "8ball": "🎱",
      a: "🅰️",
      ab: "🆎",
      abc: "🔤",
      abcd: "🔡",
      accept: "🉑",
      aerial_tramway: "🚡",
      airplane: "✈️",
      alarm_clock: "⏰",
      alembic: "⚗️",
      alien: "👽",
      ambulance: "🚑",
      amphora: "🏺",
      anchor: "⚓️",
      angel: "👼",
      anger: "💢",
      angry: "😠",
      anguished: "😧",
      ant: "🐜",
      apple: "🍎",
      aquarius: "♒️",
      aries: "♈️",
      arrow_backward: "◀️",
      arrow_double_down: "⏬",
      arrow_double_up: "⏫",
      arrow_down: "⬇️",
      arrow_down_small: "🔽",
      arrow_forward: "▶️",
      arrow_heading_down: "⤵️",
      arrow_heading_up: "⤴️",
      arrow_left: "⬅️",
      arrow_lower_left: "↙️",
      arrow_lower_right: "↘️",
      arrow_right: "➡️",
      arrow_right_hook: "↪️",
      arrow_up: "⬆️",
      arrow_up_down: "↕️",
      arrow_up_small: "🔼",
      arrow_upper_left: "↖️",
      arrow_upper_right: "↗️",
      arrows_clockwise: "🔃",
      arrows_counterclockwise: "🔄",
      art: "🎨",
      articulated_lorry: "🚛",
      artificial_satellite: "🛰",
      astonished: "😲",
      athletic_shoe: "👟",
      atm: "🏧",
      atom_symbol: "⚛️",
      avocado: "🥑",
      b: "🅱️",
      baby: "👶",
      baby_bottle: "🍼",
      baby_chick: "🐤",
      baby_symbol: "🚼",
      back: "🔙",
      bacon: "🥓",
      badminton: "🏸",
      baggage_claim: "🛄",
      baguette_bread: "🥖",
      balance_scale: "⚖️",
      balloon: "🎈",
      ballot_box: "🗳",
      ballot_box_with_check: "☑️",
      bamboo: "🎍",
      banana: "🍌",
      bangbang: "‼️",
      bank: "🏦",
      bar_chart: "📊",
      barber: "💈",
      baseball: "⚾️",
      basketball: "🏀",
      basketball_man: "⛹️",
      basketball_woman: "⛹️&zwj;♀️",
      bat: "🦇",
      bath: "🛀",
      bathtub: "🛁",
      battery: "🔋",
      beach_umbrella: "🏖",
      bear: "🐻",
      bed: "🛏",
      bee: "🐝",
      beer: "🍺",
      beers: "🍻",
      beetle: "🐞",
      beginner: "🔰",
      bell: "🔔",
      bellhop_bell: "🛎",
      bento: "🍱",
      biking_man: "🚴",
      bike: "🚲",
      biking_woman: "🚴&zwj;♀️",
      bikini: "👙",
      biohazard: "☣️",
      bird: "🐦",
      birthday: "🎂",
      black_circle: "⚫️",
      black_flag: "🏴",
      black_heart: "🖤",
      black_joker: "🃏",
      black_large_square: "⬛️",
      black_medium_small_square: "◾️",
      black_medium_square: "◼️",
      black_nib: "✒️",
      black_small_square: "▪️",
      black_square_button: "🔲",
      blonde_man: "👱",
      blonde_woman: "👱&zwj;♀️",
      blossom: "🌼",
      blowfish: "🐡",
      blue_book: "📘",
      blue_car: "🚙",
      blue_heart: "💙",
      blush: "😊",
      boar: "🐗",
      boat: "⛵️",
      bomb: "💣",
      book: "📖",
      bookmark: "🔖",
      bookmark_tabs: "📑",
      books: "📚",
      boom: "💥",
      boot: "👢",
      bouquet: "💐",
      bowing_man: "🙇",
      bow_and_arrow: "🏹",
      bowing_woman: "🙇&zwj;♀️",
      bowling: "🎳",
      boxing_glove: "🥊",
      boy: "👦",
      bread: "🍞",
      bride_with_veil: "👰",
      bridge_at_night: "🌉",
      briefcase: "💼",
      broken_heart: "💔",
      bug: "🐛",
      building_construction: "🏗",
      bulb: "💡",
      bullettrain_front: "🚅",
      bullettrain_side: "🚄",
      burrito: "🌯",
      bus: "🚌",
      business_suit_levitating: "🕴",
      busstop: "🚏",
      bust_in_silhouette: "👤",
      busts_in_silhouette: "👥",
      butterfly: "🦋",
      cactus: "🌵",
      cake: "🍰",
      calendar: "📆",
      call_me_hand: "🤙",
      calling: "📲",
      camel: "🐫",
      camera: "📷",
      camera_flash: "📸",
      camping: "🏕",
      cancer: "♋️",
      candle: "🕯",
      candy: "🍬",
      canoe: "🛶",
      capital_abcd: "🔠",
      capricorn: "♑️",
      car: "🚗",
      card_file_box: "🗃",
      card_index: "📇",
      card_index_dividers: "🗂",
      carousel_horse: "🎠",
      carrot: "🥕",
      cat: "🐱",
      cat2: "🐈",
      cd: "💿",
      chains: "⛓",
      champagne: "🍾",
      chart: "💹",
      chart_with_downwards_trend: "📉",
      chart_with_upwards_trend: "📈",
      checkered_flag: "🏁",
      cheese: "🧀",
      cherries: "🍒",
      cherry_blossom: "🌸",
      chestnut: "🌰",
      chicken: "🐔",
      children_crossing: "🚸",
      chipmunk: "🐿",
      chocolate_bar: "🍫",
      christmas_tree: "🎄",
      church: "⛪️",
      cinema: "🎦",
      circus_tent: "🎪",
      city_sunrise: "🌇",
      city_sunset: "🌆",
      cityscape: "🏙",
      cl: "🆑",
      clamp: "🗜",
      clap: "👏",
      clapper: "🎬",
      classical_building: "🏛",
      clinking_glasses: "🥂",
      clipboard: "📋",
      clock1: "🕐",
      clock10: "🕙",
      clock1030: "🕥",
      clock11: "🕚",
      clock1130: "🕦",
      clock12: "🕛",
      clock1230: "🕧",
      clock130: "🕜",
      clock2: "🕑",
      clock230: "🕝",
      clock3: "🕒",
      clock330: "🕞",
      clock4: "🕓",
      clock430: "🕟",
      clock5: "🕔",
      clock530: "🕠",
      clock6: "🕕",
      clock630: "🕡",
      clock7: "🕖",
      clock730: "🕢",
      clock8: "🕗",
      clock830: "🕣",
      clock9: "🕘",
      clock930: "🕤",
      closed_book: "📕",
      closed_lock_with_key: "🔐",
      closed_umbrella: "🌂",
      cloud: "☁️",
      cloud_with_lightning: "🌩",
      cloud_with_lightning_and_rain: "⛈",
      cloud_with_rain: "🌧",
      cloud_with_snow: "🌨",
      clown_face: "🤡",
      clubs: "♣️",
      cocktail: "🍸",
      coffee: "☕️",
      coffin: "⚰️",
      cold_sweat: "😰",
      comet: "☄️",
      computer: "💻",
      computer_mouse: "🖱",
      confetti_ball: "🎊",
      confounded: "😖",
      confused: "😕",
      congratulations: "㊗️",
      construction: "🚧",
      construction_worker_man: "👷",
      construction_worker_woman: "👷&zwj;♀️",
      control_knobs: "🎛",
      convenience_store: "🏪",
      cookie: "🍪",
      cool: "🆒",
      policeman: "👮",
      copyright: "©️",
      corn: "🌽",
      couch_and_lamp: "🛋",
      couple: "👫",
      couple_with_heart_woman_man: "💑",
      couple_with_heart_man_man: "👨&zwj;❤️&zwj;👨",
      couple_with_heart_woman_woman: "👩&zwj;❤️&zwj;👩",
      couplekiss_man_man: "👨&zwj;❤️&zwj;💋&zwj;👨",
      couplekiss_man_woman: "💏",
      couplekiss_woman_woman: "👩&zwj;❤️&zwj;💋&zwj;👩",
      cow: "🐮",
      cow2: "🐄",
      cowboy_hat_face: "🤠",
      crab: "🦀",
      crayon: "🖍",
      credit_card: "💳",
      crescent_moon: "🌙",
      cricket: "🏏",
      crocodile: "🐊",
      croissant: "🥐",
      crossed_fingers: "🤞",
      crossed_flags: "🎌",
      crossed_swords: "⚔️",
      crown: "👑",
      cry: "😢",
      crying_cat_face: "😿",
      crystal_ball: "🔮",
      cucumber: "🥒",
      cupid: "💘",
      curly_loop: "➰",
      currency_exchange: "💱",
      curry: "🍛",
      custard: "🍮",
      customs: "🛃",
      cyclone: "🌀",
      dagger: "🗡",
      dancer: "💃",
      dancing_women: "👯",
      dancing_men: "👯&zwj;♂️",
      dango: "🍡",
      dark_sunglasses: "🕶",
      dart: "🎯",
      dash: "💨",
      date: "📅",
      deciduous_tree: "🌳",
      deer: "🦌",
      department_store: "🏬",
      derelict_house: "🏚",
      desert: "🏜",
      desert_island: "🏝",
      desktop_computer: "🖥",
      male_detective: "🕵️",
      diamond_shape_with_a_dot_inside: "💠",
      diamonds: "♦️",
      disappointed: "😞",
      disappointed_relieved: "😥",
      dizzy: "💫",
      dizzy_face: "😵",
      do_not_litter: "🚯",
      dog: "🐶",
      dog2: "🐕",
      dollar: "💵",
      dolls: "🎎",
      dolphin: "🐬",
      door: "🚪",
      doughnut: "🍩",
      dove: "🕊",
      dragon: "🐉",
      dragon_face: "🐲",
      dress: "👗",
      dromedary_camel: "🐪",
      drooling_face: "🤤",
      droplet: "💧",
      drum: "🥁",
      duck: "🦆",
      dvd: "📀",
      "e-mail": "📧",
      eagle: "🦅",
      ear: "👂",
      ear_of_rice: "🌾",
      earth_africa: "🌍",
      earth_americas: "🌎",
      earth_asia: "🌏",
      egg: "🥚",
      eggplant: "🍆",
      eight_pointed_black_star: "✴️",
      eight_spoked_asterisk: "✳️",
      electric_plug: "🔌",
      elephant: "🐘",
      email: "✉️",
      end: "🔚",
      envelope_with_arrow: "📩",
      euro: "💶",
      european_castle: "🏰",
      european_post_office: "🏤",
      evergreen_tree: "🌲",
      exclamation: "❗️",
      expressionless: "😑",
      eye: "👁",
      eye_speech_bubble: "👁&zwj;🗨",
      eyeglasses: "👓",
      eyes: "👀",
      face_with_head_bandage: "🤕",
      face_with_thermometer: "🤒",
      fist_oncoming: "👊",
      factory: "🏭",
      fallen_leaf: "🍂",
      family_man_woman_boy: "👪",
      family_man_boy: "👨&zwj;👦",
      family_man_boy_boy: "👨&zwj;👦&zwj;👦",
      family_man_girl: "👨&zwj;👧",
      family_man_girl_boy: "👨&zwj;👧&zwj;👦",
      family_man_girl_girl: "👨&zwj;👧&zwj;👧",
      family_man_man_boy: "👨&zwj;👨&zwj;👦",
      family_man_man_boy_boy: "👨&zwj;👨&zwj;👦&zwj;👦",
      family_man_man_girl: "👨&zwj;👨&zwj;👧",
      family_man_man_girl_boy: "👨&zwj;👨&zwj;👧&zwj;👦",
      family_man_man_girl_girl: "👨&zwj;👨&zwj;👧&zwj;👧",
      family_man_woman_boy_boy: "👨&zwj;👩&zwj;👦&zwj;👦",
      family_man_woman_girl: "👨&zwj;👩&zwj;👧",
      family_man_woman_girl_boy: "👨&zwj;👩&zwj;👧&zwj;👦",
      family_man_woman_girl_girl: "👨&zwj;👩&zwj;👧&zwj;👧",
      family_woman_boy: "👩&zwj;👦",
      family_woman_boy_boy: "👩&zwj;👦&zwj;👦",
      family_woman_girl: "👩&zwj;👧",
      family_woman_girl_boy: "👩&zwj;👧&zwj;👦",
      family_woman_girl_girl: "👩&zwj;👧&zwj;👧",
      family_woman_woman_boy: "👩&zwj;👩&zwj;👦",
      family_woman_woman_boy_boy: "👩&zwj;👩&zwj;👦&zwj;👦",
      family_woman_woman_girl: "👩&zwj;👩&zwj;👧",
      family_woman_woman_girl_boy: "👩&zwj;👩&zwj;👧&zwj;👦",
      family_woman_woman_girl_girl: "👩&zwj;👩&zwj;👧&zwj;👧",
      fast_forward: "⏩",
      fax: "📠",
      fearful: "😨",
      feet: "🐾",
      female_detective: "🕵️&zwj;♀️",
      ferris_wheel: "🎡",
      ferry: "⛴",
      field_hockey: "🏑",
      file_cabinet: "🗄",
      file_folder: "📁",
      film_projector: "📽",
      film_strip: "🎞",
      fire: "🔥",
      fire_engine: "🚒",
      fireworks: "🎆",
      first_quarter_moon: "🌓",
      first_quarter_moon_with_face: "🌛",
      fish: "🐟",
      fish_cake: "🍥",
      fishing_pole_and_fish: "🎣",
      fist_raised: "✊",
      fist_left: "🤛",
      fist_right: "🤜",
      flags: "🎏",
      flashlight: "🔦",
      fleur_de_lis: "⚜️",
      flight_arrival: "🛬",
      flight_departure: "🛫",
      floppy_disk: "💾",
      flower_playing_cards: "🎴",
      flushed: "😳",
      fog: "🌫",
      foggy: "🌁",
      football: "🏈",
      footprints: "👣",
      fork_and_knife: "🍴",
      fountain: "⛲️",
      fountain_pen: "🖋",
      four_leaf_clover: "🍀",
      fox_face: "🦊",
      framed_picture: "🖼",
      free: "🆓",
      fried_egg: "🍳",
      fried_shrimp: "🍤",
      fries: "🍟",
      frog: "🐸",
      frowning: "😦",
      frowning_face: "☹️",
      frowning_man: "🙍&zwj;♂️",
      frowning_woman: "🙍",
      middle_finger: "🖕",
      fuelpump: "⛽️",
      full_moon: "🌕",
      full_moon_with_face: "🌝",
      funeral_urn: "⚱️",
      game_die: "🎲",
      gear: "⚙️",
      gem: "💎",
      gemini: "♊️",
      ghost: "👻",
      gift: "🎁",
      gift_heart: "💝",
      girl: "👧",
      globe_with_meridians: "🌐",
      goal_net: "🥅",
      goat: "🐐",
      golf: "⛳️",
      golfing_man: "🏌️",
      golfing_woman: "🏌️&zwj;♀️",
      gorilla: "🦍",
      grapes: "🍇",
      green_apple: "🍏",
      green_book: "📗",
      green_heart: "💚",
      green_salad: "🥗",
      grey_exclamation: "❕",
      grey_question: "❔",
      grimacing: "😬",
      grin: "😁",
      grinning: "😀",
      guardsman: "💂",
      guardswoman: "💂&zwj;♀️",
      guitar: "🎸",
      gun: "🔫",
      haircut_woman: "💇",
      haircut_man: "💇&zwj;♂️",
      hamburger: "🍔",
      hammer: "🔨",
      hammer_and_pick: "⚒",
      hammer_and_wrench: "🛠",
      hamster: "🐹",
      hand: "✋",
      handbag: "👜",
      handshake: "🤝",
      hankey: "💩",
      hatched_chick: "🐥",
      hatching_chick: "🐣",
      headphones: "🎧",
      hear_no_evil: "🙉",
      heart: "❤️",
      heart_decoration: "💟",
      heart_eyes: "😍",
      heart_eyes_cat: "😻",
      heartbeat: "💓",
      heartpulse: "💗",
      hearts: "♥️",
      heavy_check_mark: "✔️",
      heavy_division_sign: "➗",
      heavy_dollar_sign: "💲",
      heavy_heart_exclamation: "❣️",
      heavy_minus_sign: "➖",
      heavy_multiplication_x: "✖️",
      heavy_plus_sign: "➕",
      helicopter: "🚁",
      herb: "🌿",
      hibiscus: "🌺",
      high_brightness: "🔆",
      high_heel: "👠",
      hocho: "🔪",
      hole: "🕳",
      honey_pot: "🍯",
      horse: "🐴",
      horse_racing: "🏇",
      hospital: "🏥",
      hot_pepper: "🌶",
      hotdog: "🌭",
      hotel: "🏨",
      hotsprings: "♨️",
      hourglass: "⌛️",
      hourglass_flowing_sand: "⏳",
      house: "🏠",
      house_with_garden: "🏡",
      houses: "🏘",
      hugs: "🤗",
      hushed: "😯",
      ice_cream: "🍨",
      ice_hockey: "🏒",
      ice_skate: "⛸",
      icecream: "🍦",
      id: "🆔",
      ideograph_advantage: "🉐",
      imp: "👿",
      inbox_tray: "📥",
      incoming_envelope: "📨",
      tipping_hand_woman: "💁",
      information_source: "ℹ️",
      innocent: "😇",
      interrobang: "⁉️",
      iphone: "📱",
      izakaya_lantern: "🏮",
      jack_o_lantern: "🎃",
      japan: "🗾",
      japanese_castle: "🏯",
      japanese_goblin: "👺",
      japanese_ogre: "👹",
      jeans: "👖",
      joy: "😂",
      joy_cat: "😹",
      joystick: "🕹",
      kaaba: "🕋",
      key: "🔑",
      keyboard: "⌨️",
      keycap_ten: "🔟",
      kick_scooter: "🛴",
      kimono: "👘",
      kiss: "💋",
      kissing: "😗",
      kissing_cat: "😽",
      kissing_closed_eyes: "😚",
      kissing_heart: "😘",
      kissing_smiling_eyes: "😙",
      kiwi_fruit: "🥝",
      koala: "🐨",
      koko: "🈁",
      label: "🏷",
      large_blue_circle: "🔵",
      large_blue_diamond: "🔷",
      large_orange_diamond: "🔶",
      last_quarter_moon: "🌗",
      last_quarter_moon_with_face: "🌜",
      latin_cross: "✝️",
      laughing: "😆",
      leaves: "🍃",
      ledger: "📒",
      left_luggage: "🛅",
      left_right_arrow: "↔️",
      leftwards_arrow_with_hook: "↩️",
      lemon: "🍋",
      leo: "♌️",
      leopard: "🐆",
      level_slider: "🎚",
      libra: "♎️",
      light_rail: "🚈",
      link: "🔗",
      lion: "🦁",
      lips: "👄",
      lipstick: "💄",
      lizard: "🦎",
      lock: "🔒",
      lock_with_ink_pen: "🔏",
      lollipop: "🍭",
      loop: "➿",
      loud_sound: "🔊",
      loudspeaker: "📢",
      love_hotel: "🏩",
      love_letter: "💌",
      low_brightness: "🔅",
      lying_face: "🤥",
      m: "Ⓜ️",
      mag: "🔍",
      mag_right: "🔎",
      mahjong: "🀄️",
      mailbox: "📫",
      mailbox_closed: "📪",
      mailbox_with_mail: "📬",
      mailbox_with_no_mail: "📭",
      man: "👨",
      man_artist: "👨&zwj;🎨",
      man_astronaut: "👨&zwj;🚀",
      man_cartwheeling: "🤸&zwj;♂️",
      man_cook: "👨&zwj;🍳",
      man_dancing: "🕺",
      man_facepalming: "🤦&zwj;♂️",
      man_factory_worker: "👨&zwj;🏭",
      man_farmer: "👨&zwj;🌾",
      man_firefighter: "👨&zwj;🚒",
      man_health_worker: "👨&zwj;⚕️",
      man_in_tuxedo: "🤵",
      man_judge: "👨&zwj;⚖️",
      man_juggling: "🤹&zwj;♂️",
      man_mechanic: "👨&zwj;🔧",
      man_office_worker: "👨&zwj;💼",
      man_pilot: "👨&zwj;✈️",
      man_playing_handball: "🤾&zwj;♂️",
      man_playing_water_polo: "🤽&zwj;♂️",
      man_scientist: "👨&zwj;🔬",
      man_shrugging: "🤷&zwj;♂️",
      man_singer: "👨&zwj;🎤",
      man_student: "👨&zwj;🎓",
      man_teacher: "👨&zwj;🏫",
      man_technologist: "👨&zwj;💻",
      man_with_gua_pi_mao: "👲",
      man_with_turban: "👳",
      tangerine: "🍊",
      mans_shoe: "👞",
      mantelpiece_clock: "🕰",
      maple_leaf: "🍁",
      martial_arts_uniform: "🥋",
      mask: "😷",
      massage_woman: "💆",
      massage_man: "💆&zwj;♂️",
      meat_on_bone: "🍖",
      medal_military: "🎖",
      medal_sports: "🏅",
      mega: "📣",
      melon: "🍈",
      memo: "📝",
      men_wrestling: "🤼&zwj;♂️",
      menorah: "🕎",
      mens: "🚹",
      metal: "🤘",
      metro: "🚇",
      microphone: "🎤",
      microscope: "🔬",
      milk_glass: "🥛",
      milky_way: "🌌",
      minibus: "🚐",
      minidisc: "💽",
      mobile_phone_off: "📴",
      money_mouth_face: "🤑",
      money_with_wings: "💸",
      moneybag: "💰",
      monkey: "🐒",
      monkey_face: "🐵",
      monorail: "🚝",
      moon: "🌔",
      mortar_board: "🎓",
      mosque: "🕌",
      motor_boat: "🛥",
      motor_scooter: "🛵",
      motorcycle: "🏍",
      motorway: "🛣",
      mount_fuji: "🗻",
      mountain: "⛰",
      mountain_biking_man: "🚵",
      mountain_biking_woman: "🚵&zwj;♀️",
      mountain_cableway: "🚠",
      mountain_railway: "🚞",
      mountain_snow: "🏔",
      mouse: "🐭",
      mouse2: "🐁",
      movie_camera: "🎥",
      moyai: "🗿",
      mrs_claus: "🤶",
      muscle: "💪",
      mushroom: "🍄",
      musical_keyboard: "🎹",
      musical_note: "🎵",
      musical_score: "🎼",
      mute: "🔇",
      nail_care: "💅",
      name_badge: "📛",
      national_park: "🏞",
      nauseated_face: "🤢",
      necktie: "👔",
      negative_squared_cross_mark: "❎",
      nerd_face: "🤓",
      neutral_face: "😐",
      new: "🆕",
      new_moon: "🌑",
      new_moon_with_face: "🌚",
      newspaper: "📰",
      newspaper_roll: "🗞",
      next_track_button: "⏭",
      ng: "🆖",
      no_good_man: "🙅&zwj;♂️",
      no_good_woman: "🙅",
      night_with_stars: "🌃",
      no_bell: "🔕",
      no_bicycles: "🚳",
      no_entry: "⛔️",
      no_entry_sign: "🚫",
      no_mobile_phones: "📵",
      no_mouth: "😶",
      no_pedestrians: "🚷",
      no_smoking: "🚭",
      "non-potable_water": "🚱",
      nose: "👃",
      notebook: "📓",
      notebook_with_decorative_cover: "📔",
      notes: "🎶",
      nut_and_bolt: "🔩",
      o: "⭕️",
      o2: "🅾️",
      ocean: "🌊",
      octopus: "🐙",
      oden: "🍢",
      office: "🏢",
      oil_drum: "🛢",
      ok: "🆗",
      ok_hand: "👌",
      ok_man: "🙆&zwj;♂️",
      ok_woman: "🙆",
      old_key: "🗝",
      older_man: "👴",
      older_woman: "👵",
      om: "🕉",
      on: "🔛",
      oncoming_automobile: "🚘",
      oncoming_bus: "🚍",
      oncoming_police_car: "🚔",
      oncoming_taxi: "🚖",
      open_file_folder: "📂",
      open_hands: "👐",
      open_mouth: "😮",
      open_umbrella: "☂️",
      ophiuchus: "⛎",
      orange_book: "📙",
      orthodox_cross: "☦️",
      outbox_tray: "📤",
      owl: "🦉",
      ox: "🐂",
      package: "📦",
      page_facing_up: "📄",
      page_with_curl: "📃",
      pager: "📟",
      paintbrush: "🖌",
      palm_tree: "🌴",
      pancakes: "🥞",
      panda_face: "🐼",
      paperclip: "📎",
      paperclips: "🖇",
      parasol_on_ground: "⛱",
      parking: "🅿️",
      part_alternation_mark: "〽️",
      partly_sunny: "⛅️",
      passenger_ship: "🛳",
      passport_control: "🛂",
      pause_button: "⏸",
      peace_symbol: "☮️",
      peach: "🍑",
      peanuts: "🥜",
      pear: "🍐",
      pen: "🖊",
      pencil2: "✏️",
      penguin: "🐧",
      pensive: "😔",
      performing_arts: "🎭",
      persevere: "😣",
      person_fencing: "🤺",
      pouting_woman: "🙎",
      phone: "☎️",
      pick: "⛏",
      pig: "🐷",
      pig2: "🐖",
      pig_nose: "🐽",
      pill: "💊",
      pineapple: "🍍",
      ping_pong: "🏓",
      pisces: "♓️",
      pizza: "🍕",
      place_of_worship: "🛐",
      plate_with_cutlery: "🍽",
      play_or_pause_button: "⏯",
      point_down: "👇",
      point_left: "👈",
      point_right: "👉",
      point_up: "☝️",
      point_up_2: "👆",
      police_car: "🚓",
      policewoman: "👮&zwj;♀️",
      poodle: "🐩",
      popcorn: "🍿",
      post_office: "🏣",
      postal_horn: "📯",
      postbox: "📮",
      potable_water: "🚰",
      potato: "🥔",
      pouch: "👝",
      poultry_leg: "🍗",
      pound: "💷",
      rage: "😡",
      pouting_cat: "😾",
      pouting_man: "🙎&zwj;♂️",
      pray: "🙏",
      prayer_beads: "📿",
      pregnant_woman: "🤰",
      previous_track_button: "⏮",
      prince: "🤴",
      princess: "👸",
      printer: "🖨",
      purple_heart: "💜",
      purse: "👛",
      pushpin: "📌",
      put_litter_in_its_place: "🚮",
      question: "❓",
      rabbit: "🐰",
      rabbit2: "🐇",
      racehorse: "🐎",
      racing_car: "🏎",
      radio: "📻",
      radio_button: "🔘",
      radioactive: "☢️",
      railway_car: "🚃",
      railway_track: "🛤",
      rainbow: "🌈",
      rainbow_flag: "🏳️&zwj;🌈",
      raised_back_of_hand: "🤚",
      raised_hand_with_fingers_splayed: "🖐",
      raised_hands: "🙌",
      raising_hand_woman: "🙋",
      raising_hand_man: "🙋&zwj;♂️",
      ram: "🐏",
      ramen: "🍜",
      rat: "🐀",
      record_button: "⏺",
      recycle: "♻️",
      red_circle: "🔴",
      registered: "®️",
      relaxed: "☺️",
      relieved: "😌",
      reminder_ribbon: "🎗",
      repeat: "🔁",
      repeat_one: "🔂",
      rescue_worker_helmet: "⛑",
      restroom: "🚻",
      revolving_hearts: "💞",
      rewind: "⏪",
      rhinoceros: "🦏",
      ribbon: "🎀",
      rice: "🍚",
      rice_ball: "🍙",
      rice_cracker: "🍘",
      rice_scene: "🎑",
      right_anger_bubble: "🗯",
      ring: "💍",
      robot: "🤖",
      rocket: "🚀",
      rofl: "🤣",
      roll_eyes: "🙄",
      roller_coaster: "🎢",
      rooster: "🐓",
      rose: "🌹",
      rosette: "🏵",
      rotating_light: "🚨",
      round_pushpin: "📍",
      rowing_man: "🚣",
      rowing_woman: "🚣&zwj;♀️",
      rugby_football: "🏉",
      running_man: "🏃",
      running_shirt_with_sash: "🎽",
      running_woman: "🏃&zwj;♀️",
      sa: "🈂️",
      sagittarius: "♐️",
      sake: "🍶",
      sandal: "👡",
      santa: "🎅",
      satellite: "📡",
      saxophone: "🎷",
      school: "🏫",
      school_satchel: "🎒",
      scissors: "✂️",
      scorpion: "🦂",
      scorpius: "♏️",
      scream: "😱",
      scream_cat: "🙀",
      scroll: "📜",
      seat: "💺",
      secret: "㊙️",
      see_no_evil: "🙈",
      seedling: "🌱",
      selfie: "🤳",
      shallow_pan_of_food: "🥘",
      shamrock: "☘️",
      shark: "🦈",
      shaved_ice: "🍧",
      sheep: "🐑",
      shell: "🐚",
      shield: "🛡",
      shinto_shrine: "⛩",
      ship: "🚢",
      shirt: "👕",
      shopping: "🛍",
      shopping_cart: "🛒",
      shower: "🚿",
      shrimp: "🦐",
      signal_strength: "📶",
      six_pointed_star: "🔯",
      ski: "🎿",
      skier: "⛷",
      skull: "💀",
      skull_and_crossbones: "☠️",
      sleeping: "😴",
      sleeping_bed: "🛌",
      sleepy: "😪",
      slightly_frowning_face: "🙁",
      slightly_smiling_face: "🙂",
      slot_machine: "🎰",
      small_airplane: "🛩",
      small_blue_diamond: "🔹",
      small_orange_diamond: "🔸",
      small_red_triangle: "🔺",
      small_red_triangle_down: "🔻",
      smile: "😄",
      smile_cat: "😸",
      smiley: "😃",
      smiley_cat: "😺",
      smiling_imp: "😈",
      smirk: "😏",
      smirk_cat: "😼",
      smoking: "🚬",
      snail: "🐌",
      snake: "🐍",
      sneezing_face: "🤧",
      snowboarder: "🏂",
      snowflake: "❄️",
      snowman: "⛄️",
      snowman_with_snow: "☃️",
      sob: "😭",
      soccer: "⚽️",
      soon: "🔜",
      sos: "🆘",
      sound: "🔉",
      space_invader: "👾",
      spades: "♠️",
      spaghetti: "🍝",
      sparkle: "❇️",
      sparkler: "🎇",
      sparkles: "✨",
      sparkling_heart: "💖",
      speak_no_evil: "🙊",
      speaker: "🔈",
      speaking_head: "🗣",
      speech_balloon: "💬",
      speedboat: "🚤",
      spider: "🕷",
      spider_web: "🕸",
      spiral_calendar: "🗓",
      spiral_notepad: "🗒",
      spoon: "🥄",
      squid: "🦑",
      stadium: "🏟",
      star: "⭐️",
      star2: "🌟",
      star_and_crescent: "☪️",
      star_of_david: "✡️",
      stars: "🌠",
      station: "🚉",
      statue_of_liberty: "🗽",
      steam_locomotive: "🚂",
      stew: "🍲",
      stop_button: "⏹",
      stop_sign: "🛑",
      stopwatch: "⏱",
      straight_ruler: "📏",
      strawberry: "🍓",
      stuck_out_tongue: "😛",
      stuck_out_tongue_closed_eyes: "😝",
      stuck_out_tongue_winking_eye: "😜",
      studio_microphone: "🎙",
      stuffed_flatbread: "🥙",
      sun_behind_large_cloud: "🌥",
      sun_behind_rain_cloud: "🌦",
      sun_behind_small_cloud: "🌤",
      sun_with_face: "🌞",
      sunflower: "🌻",
      sunglasses: "😎",
      sunny: "☀️",
      sunrise: "🌅",
      sunrise_over_mountains: "🌄",
      surfing_man: "🏄",
      surfing_woman: "🏄&zwj;♀️",
      sushi: "🍣",
      suspension_railway: "🚟",
      sweat: "😓",
      sweat_drops: "💦",
      sweat_smile: "😅",
      sweet_potato: "🍠",
      swimming_man: "🏊",
      swimming_woman: "🏊&zwj;♀️",
      symbols: "🔣",
      synagogue: "🕍",
      syringe: "💉",
      taco: "🌮",
      tada: "🎉",
      tanabata_tree: "🎋",
      taurus: "♉️",
      taxi: "🚕",
      tea: "🍵",
      telephone_receiver: "📞",
      telescope: "🔭",
      tennis: "🎾",
      tent: "⛺️",
      thermometer: "🌡",
      thinking: "🤔",
      thought_balloon: "💭",
      ticket: "🎫",
      tickets: "🎟",
      tiger: "🐯",
      tiger2: "🐅",
      timer_clock: "⏲",
      tipping_hand_man: "💁&zwj;♂️",
      tired_face: "😫",
      tm: "™️",
      toilet: "🚽",
      tokyo_tower: "🗼",
      tomato: "🍅",
      tongue: "👅",
      top: "🔝",
      tophat: "🎩",
      tornado: "🌪",
      trackball: "🖲",
      tractor: "🚜",
      traffic_light: "🚥",
      train: "🚋",
      train2: "🚆",
      tram: "🚊",
      triangular_flag_on_post: "🚩",
      triangular_ruler: "📐",
      trident: "🔱",
      triumph: "😤",
      trolleybus: "🚎",
      trophy: "🏆",
      tropical_drink: "🍹",
      tropical_fish: "🐠",
      truck: "🚚",
      trumpet: "🎺",
      tulip: "🌷",
      tumbler_glass: "🥃",
      turkey: "🦃",
      turtle: "🐢",
      tv: "📺",
      twisted_rightwards_arrows: "🔀",
      two_hearts: "💕",
      two_men_holding_hands: "👬",
      two_women_holding_hands: "👭",
      u5272: "🈹",
      u5408: "🈴",
      u55b6: "🈺",
      u6307: "🈯️",
      u6708: "🈷️",
      u6709: "🈶",
      u6e80: "🈵",
      u7121: "🈚️",
      u7533: "🈸",
      u7981: "🈲",
      u7a7a: "🈳",
      umbrella: "☔️",
      unamused: "😒",
      underage: "🔞",
      unicorn: "🦄",
      unlock: "🔓",
      up: "🆙",
      upside_down_face: "🙃",
      v: "✌️",
      vertical_traffic_light: "🚦",
      vhs: "📼",
      vibration_mode: "📳",
      video_camera: "📹",
      video_game: "🎮",
      violin: "🎻",
      virgo: "♍️",
      volcano: "🌋",
      volleyball: "🏐",
      vs: "🆚",
      vulcan_salute: "🖖",
      walking_man: "🚶",
      walking_woman: "🚶&zwj;♀️",
      waning_crescent_moon: "🌘",
      waning_gibbous_moon: "🌖",
      warning: "⚠️",
      wastebasket: "🗑",
      watch: "⌚️",
      water_buffalo: "🐃",
      watermelon: "🍉",
      wave: "👋",
      wavy_dash: "〰️",
      waxing_crescent_moon: "🌒",
      wc: "🚾",
      weary: "😩",
      wedding: "💒",
      weight_lifting_man: "🏋️",
      weight_lifting_woman: "🏋️&zwj;♀️",
      whale: "🐳",
      whale2: "🐋",
      wheel_of_dharma: "☸️",
      wheelchair: "♿️",
      white_check_mark: "✅",
      white_circle: "⚪️",
      white_flag: "🏳️",
      white_flower: "💮",
      white_large_square: "⬜️",
      white_medium_small_square: "◽️",
      white_medium_square: "◻️",
      white_small_square: "▫️",
      white_square_button: "🔳",
      wilted_flower: "🥀",
      wind_chime: "🎐",
      wind_face: "🌬",
      wine_glass: "🍷",
      wink: "😉",
      wolf: "🐺",
      woman: "👩",
      woman_artist: "👩&zwj;🎨",
      woman_astronaut: "👩&zwj;🚀",
      woman_cartwheeling: "🤸&zwj;♀️",
      woman_cook: "👩&zwj;🍳",
      woman_facepalming: "🤦&zwj;♀️",
      woman_factory_worker: "👩&zwj;🏭",
      woman_farmer: "👩&zwj;🌾",
      woman_firefighter: "👩&zwj;🚒",
      woman_health_worker: "👩&zwj;⚕️",
      woman_judge: "👩&zwj;⚖️",
      woman_juggling: "🤹&zwj;♀️",
      woman_mechanic: "👩&zwj;🔧",
      woman_office_worker: "👩&zwj;💼",
      woman_pilot: "👩&zwj;✈️",
      woman_playing_handball: "🤾&zwj;♀️",
      woman_playing_water_polo: "🤽&zwj;♀️",
      woman_scientist: "👩&zwj;🔬",
      woman_shrugging: "🤷&zwj;♀️",
      woman_singer: "👩&zwj;🎤",
      woman_student: "👩&zwj;🎓",
      woman_teacher: "👩&zwj;🏫",
      woman_technologist: "👩&zwj;💻",
      woman_with_turban: "👳&zwj;♀️",
      womans_clothes: "👚",
      womans_hat: "👒",
      women_wrestling: "🤼&zwj;♀️",
      womens: "🚺",
      world_map: "🗺",
      worried: "😟",
      wrench: "🔧",
      writing_hand: "✍️",
      x: "❌",
      yellow_heart: "💛",
      yen: "💴",
      yin_yang: "☯️",
      yum: "😋",
      zap: "⚡️",
      zipper_mouth_face: "🤐",
      zzz: "💤",
      /* special emojis :P */
      octocat: '<img alt=":octocat:" height="20" width="20" align="absmiddle" src="https://assets-cdn.github.com/images/icons/emoji/octocat.png">',
      showdown: `<span style="font-family: 'Anonymous Pro', monospace; text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #3e8b8a;text-underline-position: under;">S</span>`
    }, r.Converter = function(d) {
      var g = {}, p = [], v = [], w = {}, _ = l, k = {
        parsed: {},
        raw: "",
        format: ""
      };
      M();
      function M() {
        d = d || {};
        for (var S in o)
          o.hasOwnProperty(S) && (g[S] = o[S]);
        if (typeof d == "object")
          for (var R in d)
            d.hasOwnProperty(R) && (g[R] = d[R]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof d + " was passed instead.");
        g.extensions && r.helper.forEach(g.extensions, j);
      }
      function j(S, R) {
        if (R = R || null, r.helper.isString(S))
          if (S = r.helper.stdExtName(S), R = S, r.extensions[S]) {
            console.warn("DEPRECATION WARNING: " + S + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), P(r.extensions[S], S);
            return;
          } else if (!r.helper.isUndefined(i[S]))
            S = i[S];
          else
            throw Error('Extension "' + S + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof S == "function" && (S = S()), r.helper.isArray(S) || (S = [S]);
        var N = c(S, R);
        if (!N.valid)
          throw Error(N.error);
        for (var q = 0; q < S.length; ++q) {
          switch (S[q].type) {
            case "lang":
              p.push(S[q]);
              break;
            case "output":
              v.push(S[q]);
              break;
          }
          if (S[q].hasOwnProperty("listeners"))
            for (var re in S[q].listeners)
              S[q].listeners.hasOwnProperty(re) && L(re, S[q].listeners[re]);
        }
      }
      function P(S, R) {
        typeof S == "function" && (S = S(new r.Converter())), r.helper.isArray(S) || (S = [S]);
        var N = c(S, R);
        if (!N.valid)
          throw Error(N.error);
        for (var q = 0; q < S.length; ++q)
          switch (S[q].type) {
            case "lang":
              p.push(S[q]);
              break;
            case "output":
              v.push(S[q]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function L(S, R) {
        if (!r.helper.isString(S))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof S + " given");
        if (typeof R != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof R + " given");
        w.hasOwnProperty(S) || (w[S] = []), w[S].push(R);
      }
      function z(S) {
        var R = S.match(/^\s*/)[0].length, N = new RegExp("^\\s{0," + R + "}", "gm");
        return S.replace(N, "");
      }
      this._dispatch = function(R, N, q, re) {
        if (w.hasOwnProperty(R))
          for (var J = 0; J < w[R].length; ++J) {
            var ce = w[R][J](R, N, this, q, re);
            ce && typeof ce < "u" && (N = ce);
          }
        return N;
      }, this.listen = function(S, R) {
        return L(S, R), this;
      }, this.makeHtml = function(S) {
        if (!S)
          return S;
        var R = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: p,
          outputModifiers: v,
          converter: this,
          ghCodeBlocks: [],
          metadata: {
            parsed: {},
            raw: "",
            format: ""
          }
        };
        return S = S.replace(/¨/g, "¨T"), S = S.replace(/\$/g, "¨D"), S = S.replace(/\r\n/g, `
`), S = S.replace(/\r/g, `
`), S = S.replace(/\u00A0/g, "&nbsp;"), g.smartIndentationFix && (S = z(S)), S = `

` + S + `

`, S = r.subParser("detab")(S, g, R), S = S.replace(/^[ \t]+$/mg, ""), r.helper.forEach(p, function(N) {
          S = r.subParser("runExtension")(N, S, g, R);
        }), S = r.subParser("metadata")(S, g, R), S = r.subParser("hashPreCodeTags")(S, g, R), S = r.subParser("githubCodeBlocks")(S, g, R), S = r.subParser("hashHTMLBlocks")(S, g, R), S = r.subParser("hashCodeTags")(S, g, R), S = r.subParser("stripLinkDefinitions")(S, g, R), S = r.subParser("blockGamut")(S, g, R), S = r.subParser("unhashHTMLSpans")(S, g, R), S = r.subParser("unescapeSpecialChars")(S, g, R), S = S.replace(/¨D/g, "$$"), S = S.replace(/¨T/g, "¨"), S = r.subParser("completeHTMLDocument")(S, g, R), r.helper.forEach(v, function(N) {
          S = r.subParser("runExtension")(N, S, g, R);
        }), k = R.metadata, S;
      }, this.makeMarkdown = this.makeMd = function(S, R) {
        if (S = S.replace(/\r\n/g, `
`), S = S.replace(/\r/g, `
`), S = S.replace(/>[ \t]+</, ">¨NBSP;<"), !R)
          if (window && window.document)
            R = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var N = R.createElement("div");
        N.innerHTML = S;
        var q = {
          preList: Ae(N)
        };
        Me(N);
        for (var re = N.childNodes, J = "", ce = 0; ce < re.length; ce++)
          J += r.subParser("makeMarkdown.node")(re[ce], q);
        function Me(Te) {
          for (var ve = 0; ve < Te.childNodes.length; ++ve) {
            var Be = Te.childNodes[ve];
            Be.nodeType === 3 ? !/\S/.test(Be.nodeValue) && !/^[ ]+$/.test(Be.nodeValue) ? (Te.removeChild(Be), --ve) : (Be.nodeValue = Be.nodeValue.split(`
`).join(" "), Be.nodeValue = Be.nodeValue.replace(/(\s)+/g, "$1")) : Be.nodeType === 1 && Me(Be);
          }
        }
        function Ae(Te) {
          for (var ve = Te.querySelectorAll("pre"), Be = [], Qe = 0; Qe < ve.length; ++Qe)
            if (ve[Qe].childElementCount === 1 && ve[Qe].firstChild.tagName.toLowerCase() === "code") {
              var pr = ve[Qe].firstChild.innerHTML.trim(), Vt = ve[Qe].firstChild.getAttribute("data-language") || "";
              if (Vt === "")
                for (var mr = ve[Qe].firstChild.className.split(" "), Un = 0; Un < mr.length; ++Un) {
                  var E = mr[Un].match(/^language-(.+)$/);
                  if (E !== null) {
                    Vt = E[1];
                    break;
                  }
                }
              pr = r.helper.unescapeHTMLEntities(pr), Be.push(pr), ve[Qe].outerHTML = '<precode language="' + Vt + '" precodenum="' + Qe.toString() + '"></precode>';
            } else
              Be.push(ve[Qe].innerHTML), ve[Qe].innerHTML = "", ve[Qe].setAttribute("prenum", Qe.toString());
          return Be;
        }
        return J;
      }, this.setOption = function(S, R) {
        g[S] = R;
      }, this.getOption = function(S) {
        return g[S];
      }, this.getOptions = function() {
        return g;
      }, this.addExtension = function(S, R) {
        R = R || null, j(S, R);
      }, this.useExtension = function(S) {
        j(S);
      }, this.setFlavor = function(S) {
        if (!a.hasOwnProperty(S))
          throw Error(S + " flavor was not found");
        var R = a[S];
        _ = S;
        for (var N in R)
          R.hasOwnProperty(N) && (g[N] = R[N]);
      }, this.getFlavor = function() {
        return _;
      }, this.removeExtension = function(S) {
        r.helper.isArray(S) || (S = [S]);
        for (var R = 0; R < S.length; ++R) {
          for (var N = S[R], q = 0; q < p.length; ++q)
            p[q] === N && p.splice(q, 1);
          for (var re = 0; re < v.length; ++re)
            v[re] === N && v.splice(re, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: p,
          output: v
        };
      }, this.getMetadata = function(S) {
        return S ? k.raw : k.parsed;
      }, this.getMetadataFormat = function() {
        return k.format;
      }, this._setMetadataPair = function(S, R) {
        k.parsed[S] = R;
      }, this._setMetadataFormat = function(S) {
        k.format = S;
      }, this._setMetadataRaw = function(S) {
        k.raw = S;
      };
    }, r.subParser("anchors", function(d, g, p) {
      d = p.converter._dispatch("anchors.before", d, g, p);
      var v = function(w, _, k, M, j, P, L) {
        if (r.helper.isUndefined(L) && (L = ""), k = k.toLowerCase(), w.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          M = "";
        else if (!M)
          if (k || (k = _.toLowerCase().replace(/ ?\n/g, " ")), M = "#" + k, !r.helper.isUndefined(p.gUrls[k]))
            M = p.gUrls[k], r.helper.isUndefined(p.gTitles[k]) || (L = p.gTitles[k]);
          else
            return w;
        M = M.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var z = '<a href="' + M + '"';
        return L !== "" && L !== null && (L = L.replace(/"/g, "&quot;"), L = L.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), z += ' title="' + L + '"'), g.openLinksInNewWindow && !/^#/.test(M) && (z += ' rel="noopener noreferrer" target="¨E95Eblank"'), z += ">" + _ + "</a>", z;
      };
      return d = d.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, v), d = d.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        v
      ), d = d.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        v
      ), d = d.replace(/\[([^\[\]]+)]()()()()()/g, v), g.ghMentions && (d = d.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(w, _, k, M, j) {
        if (k === "\\")
          return _ + M;
        if (!r.helper.isString(g.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var P = g.ghMentionsLink.replace(/\{u}/g, j), L = "";
        return g.openLinksInNewWindow && (L = ' rel="noopener noreferrer" target="¨E95Eblank"'), _ + '<a href="' + P + '"' + L + ">" + M + "</a>";
      })), d = p.converter._dispatch("anchors.after", d, g, p), d;
    });
    var h = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, m = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, y = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, b = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, x = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, C = function(d) {
      return function(g, p, v, w, _, k, M) {
        v = v.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var j = v, P = "", L = "", z = p || "", S = M || "";
        return /^www\./i.test(v) && (v = v.replace(/^www\./i, "http://www.")), d.excludeTrailingPunctuationFromURLs && k && (P = k), d.openLinksInNewWindow && (L = ' rel="noopener noreferrer" target="¨E95Eblank"'), z + '<a href="' + v + '"' + L + ">" + j + "</a>" + P + S;
      };
    }, T = function(d, g) {
      return function(p, v, w) {
        var _ = "mailto:";
        return v = v || "", w = r.subParser("unescapeSpecialChars")(w, d, g), d.encodeEmails ? (_ = r.helper.encodeEmailAddress(_ + w), w = r.helper.encodeEmailAddress(w)) : _ = _ + w, v + '<a href="' + _ + '">' + w + "</a>";
      };
    };
    r.subParser("autoLinks", function(d, g, p) {
      return d = p.converter._dispatch("autoLinks.before", d, g, p), d = d.replace(y, C(g)), d = d.replace(x, T(g, p)), d = p.converter._dispatch("autoLinks.after", d, g, p), d;
    }), r.subParser("simplifiedAutoLinks", function(d, g, p) {
      return g.simplifiedAutoLink && (d = p.converter._dispatch("simplifiedAutoLinks.before", d, g, p), g.excludeTrailingPunctuationFromURLs ? d = d.replace(m, C(g)) : d = d.replace(h, C(g)), d = d.replace(b, T(g, p)), d = p.converter._dispatch("simplifiedAutoLinks.after", d, g, p)), d;
    }), r.subParser("blockGamut", function(d, g, p) {
      return d = p.converter._dispatch("blockGamut.before", d, g, p), d = r.subParser("blockQuotes")(d, g, p), d = r.subParser("headers")(d, g, p), d = r.subParser("horizontalRule")(d, g, p), d = r.subParser("lists")(d, g, p), d = r.subParser("codeBlocks")(d, g, p), d = r.subParser("tables")(d, g, p), d = r.subParser("hashHTMLBlocks")(d, g, p), d = r.subParser("paragraphs")(d, g, p), d = p.converter._dispatch("blockGamut.after", d, g, p), d;
    }), r.subParser("blockQuotes", function(d, g, p) {
      d = p.converter._dispatch("blockQuotes.before", d, g, p), d = d + `

`;
      var v = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return g.splitAdjacentBlockquotes && (v = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), d = d.replace(v, function(w) {
        return w = w.replace(/^[ \t]*>[ \t]?/gm, ""), w = w.replace(/¨0/g, ""), w = w.replace(/^[ \t]+$/gm, ""), w = r.subParser("githubCodeBlocks")(w, g, p), w = r.subParser("blockGamut")(w, g, p), w = w.replace(/(^|\n)/g, "$1  "), w = w.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(_, k) {
          var M = k;
          return M = M.replace(/^  /mg, "¨0"), M = M.replace(/¨0/g, ""), M;
        }), r.subParser("hashBlock")(`<blockquote>
` + w + `
</blockquote>`, g, p);
      }), d = p.converter._dispatch("blockQuotes.after", d, g, p), d;
    }), r.subParser("codeBlocks", function(d, g, p) {
      d = p.converter._dispatch("codeBlocks.before", d, g, p), d += "¨0";
      var v = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return d = d.replace(v, function(w, _, k) {
        var M = _, j = k, P = `
`;
        return M = r.subParser("outdent")(M, g, p), M = r.subParser("encodeCode")(M, g, p), M = r.subParser("detab")(M, g, p), M = M.replace(/^\n+/g, ""), M = M.replace(/\n+$/g, ""), g.omitExtraWLInCodeBlocks && (P = ""), M = "<pre><code>" + M + P + "</code></pre>", r.subParser("hashBlock")(M, g, p) + j;
      }), d = d.replace(/¨0/, ""), d = p.converter._dispatch("codeBlocks.after", d, g, p), d;
    }), r.subParser("codeSpans", function(d, g, p) {
      return d = p.converter._dispatch("codeSpans.before", d, g, p), typeof d > "u" && (d = ""), d = d.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(v, w, _, k) {
          var M = k;
          return M = M.replace(/^([ \t]*)/g, ""), M = M.replace(/[ \t]*$/g, ""), M = r.subParser("encodeCode")(M, g, p), M = w + "<code>" + M + "</code>", M = r.subParser("hashHTMLSpans")(M, g, p), M;
        }
      ), d = p.converter._dispatch("codeSpans.after", d, g, p), d;
    }), r.subParser("completeHTMLDocument", function(d, g, p) {
      if (!g.completeHTMLDocument)
        return d;
      d = p.converter._dispatch("completeHTMLDocument.before", d, g, p);
      var v = "html", w = `<!DOCTYPE HTML>
`, _ = "", k = `<meta charset="utf-8">
`, M = "", j = "";
      typeof p.metadata.parsed.doctype < "u" && (w = "<!DOCTYPE " + p.metadata.parsed.doctype + `>
`, v = p.metadata.parsed.doctype.toString().toLowerCase(), (v === "html" || v === "html5") && (k = '<meta charset="utf-8">'));
      for (var P in p.metadata.parsed)
        if (p.metadata.parsed.hasOwnProperty(P))
          switch (P.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              _ = "<title>" + p.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              v === "html" || v === "html5" ? k = '<meta charset="' + p.metadata.parsed.charset + `">
` : k = '<meta name="charset" content="' + p.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              M = ' lang="' + p.metadata.parsed[P] + '"', j += '<meta name="' + P + '" content="' + p.metadata.parsed[P] + `">
`;
              break;
            default:
              j += '<meta name="' + P + '" content="' + p.metadata.parsed[P] + `">
`;
          }
      return d = w + "<html" + M + `>
<head>
` + _ + k + j + `</head>
<body>
` + d.trim() + `
</body>
</html>`, d = p.converter._dispatch("completeHTMLDocument.after", d, g, p), d;
    }), r.subParser("detab", function(d, g, p) {
      return d = p.converter._dispatch("detab.before", d, g, p), d = d.replace(/\t(?=\t)/g, "    "), d = d.replace(/\t/g, "¨A¨B"), d = d.replace(/¨B(.+?)¨A/g, function(v, w) {
        for (var _ = w, k = 4 - _.length % 4, M = 0; M < k; M++)
          _ += " ";
        return _;
      }), d = d.replace(/¨A/g, "    "), d = d.replace(/¨B/g, ""), d = p.converter._dispatch("detab.after", d, g, p), d;
    }), r.subParser("ellipsis", function(d, g, p) {
      return g.ellipsis && (d = p.converter._dispatch("ellipsis.before", d, g, p), d = d.replace(/\.\.\./g, "…"), d = p.converter._dispatch("ellipsis.after", d, g, p)), d;
    }), r.subParser("emoji", function(d, g, p) {
      if (!g.emoji)
        return d;
      d = p.converter._dispatch("emoji.before", d, g, p);
      var v = /:([\S]+?):/g;
      return d = d.replace(v, function(w, _) {
        return r.helper.emojis.hasOwnProperty(_) ? r.helper.emojis[_] : w;
      }), d = p.converter._dispatch("emoji.after", d, g, p), d;
    }), r.subParser("encodeAmpsAndAngles", function(d, g, p) {
      return d = p.converter._dispatch("encodeAmpsAndAngles.before", d, g, p), d = d.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), d = d.replace(/<(?![a-z\/?$!])/gi, "&lt;"), d = d.replace(/</g, "&lt;"), d = d.replace(/>/g, "&gt;"), d = p.converter._dispatch("encodeAmpsAndAngles.after", d, g, p), d;
    }), r.subParser("encodeBackslashEscapes", function(d, g, p) {
      return d = p.converter._dispatch("encodeBackslashEscapes.before", d, g, p), d = d.replace(/\\(\\)/g, r.helper.escapeCharactersCallback), d = d.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, r.helper.escapeCharactersCallback), d = p.converter._dispatch("encodeBackslashEscapes.after", d, g, p), d;
    }), r.subParser("encodeCode", function(d, g, p) {
      return d = p.converter._dispatch("encodeCode.before", d, g, p), d = d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, r.helper.escapeCharactersCallback), d = p.converter._dispatch("encodeCode.after", d, g, p), d;
    }), r.subParser("escapeSpecialCharsWithinTagAttributes", function(d, g, p) {
      d = p.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", d, g, p);
      var v = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, w = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return d = d.replace(v, function(_) {
        return _.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), d = d.replace(w, function(_) {
        return _.replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), d = p.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", d, g, p), d;
    }), r.subParser("githubCodeBlocks", function(d, g, p) {
      return g.ghCodeBlocks ? (d = p.converter._dispatch("githubCodeBlocks.before", d, g, p), d += "¨0", d = d.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(v, w, _, k) {
        var M = g.omitExtraWLInCodeBlocks ? "" : `
`;
        return k = r.subParser("encodeCode")(k, g, p), k = r.subParser("detab")(k, g, p), k = k.replace(/^\n+/g, ""), k = k.replace(/\n+$/g, ""), k = "<pre><code" + (_ ? ' class="' + _ + " language-" + _ + '"' : "") + ">" + k + M + "</code></pre>", k = r.subParser("hashBlock")(k, g, p), `

¨G` + (p.ghCodeBlocks.push({ text: v, codeblock: k }) - 1) + `G

`;
      }), d = d.replace(/¨0/, ""), p.converter._dispatch("githubCodeBlocks.after", d, g, p)) : d;
    }), r.subParser("hashBlock", function(d, g, p) {
      return d = p.converter._dispatch("hashBlock.before", d, g, p), d = d.replace(/(^\n+|\n+$)/g, ""), d = `

¨K` + (p.gHtmlBlocks.push(d) - 1) + `K

`, d = p.converter._dispatch("hashBlock.after", d, g, p), d;
    }), r.subParser("hashCodeTags", function(d, g, p) {
      d = p.converter._dispatch("hashCodeTags.before", d, g, p);
      var v = function(w, _, k, M) {
        var j = k + r.subParser("encodeCode")(_, g, p) + M;
        return "¨C" + (p.gHtmlSpans.push(j) - 1) + "C";
      };
      return d = r.helper.replaceRecursiveRegExp(d, v, "<code\\b[^>]*>", "</code>", "gim"), d = p.converter._dispatch("hashCodeTags.after", d, g, p), d;
    }), r.subParser("hashElement", function(d, g, p) {
      return function(v, w) {
        var _ = w;
        return _ = _.replace(/\n\n/g, `
`), _ = _.replace(/^\n/, ""), _ = _.replace(/\n+$/g, ""), _ = `

¨K` + (p.gHtmlBlocks.push(_) - 1) + `K

`, _;
      };
    }), r.subParser("hashHTMLBlocks", function(d, g, p) {
      d = p.converter._dispatch("hashHTMLBlocks.before", d, g, p);
      var v = [
        "pre",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "table",
        "dl",
        "ol",
        "ul",
        "script",
        "noscript",
        "form",
        "fieldset",
        "iframe",
        "math",
        "style",
        "section",
        "header",
        "footer",
        "nav",
        "article",
        "aside",
        "address",
        "audio",
        "canvas",
        "figure",
        "hgroup",
        "output",
        "video",
        "p"
      ], w = function(S, R, N, q) {
        var re = S;
        return N.search(/\bmarkdown\b/) !== -1 && (re = N + p.converter.makeHtml(R) + q), `

¨K` + (p.gHtmlBlocks.push(re) - 1) + `K

`;
      };
      g.backslashEscapesHTMLTags && (d = d.replace(/\\<(\/?[^>]+?)>/g, function(S, R) {
        return "&lt;" + R + "&gt;";
      }));
      for (var _ = 0; _ < v.length; ++_)
        for (var k, M = new RegExp("^ {0,3}(<" + v[_] + "\\b[^>]*>)", "im"), j = "<" + v[_] + "\\b[^>]*>", P = "</" + v[_] + ">"; (k = r.helper.regexIndexOf(d, M)) !== -1; ) {
          var L = r.helper.splitAtIndex(d, k), z = r.helper.replaceRecursiveRegExp(L[1], w, j, P, "im");
          if (z === L[1])
            break;
          d = L[0].concat(z);
        }
      return d = d.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(d, g, p)
      ), d = r.helper.replaceRecursiveRegExp(d, function(S) {
        return `

¨K` + (p.gHtmlBlocks.push(S) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), d = d.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(d, g, p)
      ), d = p.converter._dispatch("hashHTMLBlocks.after", d, g, p), d;
    }), r.subParser("hashHTMLSpans", function(d, g, p) {
      d = p.converter._dispatch("hashHTMLSpans.before", d, g, p);
      function v(w) {
        return "¨C" + (p.gHtmlSpans.push(w) - 1) + "C";
      }
      return d = d.replace(/<[^>]+?\/>/gi, function(w) {
        return v(w);
      }), d = d.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(w) {
        return v(w);
      }), d = d.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(w) {
        return v(w);
      }), d = d.replace(/<[^>]+?>/gi, function(w) {
        return v(w);
      }), d = p.converter._dispatch("hashHTMLSpans.after", d, g, p), d;
    }), r.subParser("unhashHTMLSpans", function(d, g, p) {
      d = p.converter._dispatch("unhashHTMLSpans.before", d, g, p);
      for (var v = 0; v < p.gHtmlSpans.length; ++v) {
        for (var w = p.gHtmlSpans[v], _ = 0; /¨C(\d+)C/.test(w); ) {
          var k = RegExp.$1;
          if (w = w.replace("¨C" + k + "C", p.gHtmlSpans[k]), _ === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++_;
        }
        d = d.replace("¨C" + v + "C", w);
      }
      return d = p.converter._dispatch("unhashHTMLSpans.after", d, g, p), d;
    }), r.subParser("hashPreCodeTags", function(d, g, p) {
      d = p.converter._dispatch("hashPreCodeTags.before", d, g, p);
      var v = function(w, _, k, M) {
        var j = k + r.subParser("encodeCode")(_, g, p) + M;
        return `

¨G` + (p.ghCodeBlocks.push({ text: w, codeblock: j }) - 1) + `G

`;
      };
      return d = r.helper.replaceRecursiveRegExp(d, v, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), d = p.converter._dispatch("hashPreCodeTags.after", d, g, p), d;
    }), r.subParser("headers", function(d, g, p) {
      d = p.converter._dispatch("headers.before", d, g, p);
      var v = isNaN(parseInt(g.headerLevelStart)) ? 1 : parseInt(g.headerLevelStart), w = g.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, _ = g.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      d = d.replace(w, function(j, P) {
        var L = r.subParser("spanGamut")(P, g, p), z = g.noHeaderId ? "" : ' id="' + M(P) + '"', S = v, R = "<h" + S + z + ">" + L + "</h" + S + ">";
        return r.subParser("hashBlock")(R, g, p);
      }), d = d.replace(_, function(j, P) {
        var L = r.subParser("spanGamut")(P, g, p), z = g.noHeaderId ? "" : ' id="' + M(P) + '"', S = v + 1, R = "<h" + S + z + ">" + L + "</h" + S + ">";
        return r.subParser("hashBlock")(R, g, p);
      });
      var k = g.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      d = d.replace(k, function(j, P, L) {
        var z = L;
        g.customizedHeaderId && (z = L.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var S = r.subParser("spanGamut")(z, g, p), R = g.noHeaderId ? "" : ' id="' + M(L) + '"', N = v - 1 + P.length, q = "<h" + N + R + ">" + S + "</h" + N + ">";
        return r.subParser("hashBlock")(q, g, p);
      });
      function M(j) {
        var P, L;
        if (g.customizedHeaderId) {
          var z = j.match(/\{([^{]+?)}\s*$/);
          z && z[1] && (j = z[1]);
        }
        return P = j, r.helper.isString(g.prefixHeaderId) ? L = g.prefixHeaderId : g.prefixHeaderId === !0 ? L = "section-" : L = "", g.rawPrefixHeaderId || (P = L + P), g.ghCompatibleHeaderId ? P = P.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : g.rawHeaderId ? P = P.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : P = P.replace(/[^\w]/g, "").toLowerCase(), g.rawPrefixHeaderId && (P = L + P), p.hashLinkCounts[P] ? P = P + "-" + p.hashLinkCounts[P]++ : p.hashLinkCounts[P] = 1, P;
      }
      return d = p.converter._dispatch("headers.after", d, g, p), d;
    }), r.subParser("horizontalRule", function(d, g, p) {
      d = p.converter._dispatch("horizontalRule.before", d, g, p);
      var v = r.subParser("hashBlock")("<hr />", g, p);
      return d = d.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, v), d = d.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, v), d = d.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, v), d = p.converter._dispatch("horizontalRule.after", d, g, p), d;
    }), r.subParser("images", function(d, g, p) {
      d = p.converter._dispatch("images.before", d, g, p);
      var v = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, w = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, _ = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, k = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, M = /!\[([^\[\]]+)]()()()()()/g;
      function j(L, z, S, R, N, q, re, J) {
        return R = R.replace(/\s/g, ""), P(L, z, S, R, N, q, re, J);
      }
      function P(L, z, S, R, N, q, re, J) {
        var ce = p.gUrls, Me = p.gTitles, Ae = p.gDimensions;
        if (S = S.toLowerCase(), J || (J = ""), L.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          R = "";
        else if (R === "" || R === null)
          if ((S === "" || S === null) && (S = z.toLowerCase().replace(/ ?\n/g, " ")), R = "#" + S, !r.helper.isUndefined(ce[S]))
            R = ce[S], r.helper.isUndefined(Me[S]) || (J = Me[S]), r.helper.isUndefined(Ae[S]) || (N = Ae[S].width, q = Ae[S].height);
          else
            return L;
        z = z.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), R = R.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var Te = '<img src="' + R + '" alt="' + z + '"';
        return J && r.helper.isString(J) && (J = J.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), Te += ' title="' + J + '"'), N && q && (N = N === "*" ? "auto" : N, q = q === "*" ? "auto" : q, Te += ' width="' + N + '"', Te += ' height="' + q + '"'), Te += " />", Te;
      }
      return d = d.replace(k, P), d = d.replace(_, j), d = d.replace(w, P), d = d.replace(v, P), d = d.replace(M, P), d = p.converter._dispatch("images.after", d, g, p), d;
    }), r.subParser("italicsAndBold", function(d, g, p) {
      d = p.converter._dispatch("italicsAndBold.before", d, g, p);
      function v(w, _, k) {
        return _ + w + k;
      }
      return g.literalMidWordUnderscores ? (d = d.replace(/\b___(\S[\s\S]*?)___\b/g, function(w, _) {
        return v(_, "<strong><em>", "</em></strong>");
      }), d = d.replace(/\b__(\S[\s\S]*?)__\b/g, function(w, _) {
        return v(_, "<strong>", "</strong>");
      }), d = d.replace(/\b_(\S[\s\S]*?)_\b/g, function(w, _) {
        return v(_, "<em>", "</em>");
      })) : (d = d.replace(/___(\S[\s\S]*?)___/g, function(w, _) {
        return /\S$/.test(_) ? v(_, "<strong><em>", "</em></strong>") : w;
      }), d = d.replace(/__(\S[\s\S]*?)__/g, function(w, _) {
        return /\S$/.test(_) ? v(_, "<strong>", "</strong>") : w;
      }), d = d.replace(/_([^\s_][\s\S]*?)_/g, function(w, _) {
        return /\S$/.test(_) ? v(_, "<em>", "</em>") : w;
      })), g.literalMidWordAsterisks ? (d = d.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(w, _, k) {
        return v(k, _ + "<strong><em>", "</em></strong>");
      }), d = d.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(w, _, k) {
        return v(k, _ + "<strong>", "</strong>");
      }), d = d.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(w, _, k) {
        return v(k, _ + "<em>", "</em>");
      })) : (d = d.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(w, _) {
        return /\S$/.test(_) ? v(_, "<strong><em>", "</em></strong>") : w;
      }), d = d.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(w, _) {
        return /\S$/.test(_) ? v(_, "<strong>", "</strong>") : w;
      }), d = d.replace(/\*([^\s*][\s\S]*?)\*/g, function(w, _) {
        return /\S$/.test(_) ? v(_, "<em>", "</em>") : w;
      })), d = p.converter._dispatch("italicsAndBold.after", d, g, p), d;
    }), r.subParser("lists", function(d, g, p) {
      function v(k, M) {
        p.gListLevel++, k = k.replace(/\n{2,}$/, `
`), k += "¨0";
        var j = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, P = /\n[ \t]*\n(?!¨0)/.test(k);
        return g.disableForced4SpacesIndentedSublists && (j = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), k = k.replace(j, function(L, z, S, R, N, q, re) {
          re = re && re.trim() !== "";
          var J = r.subParser("outdent")(N, g, p), ce = "";
          return q && g.tasklists && (ce = ' class="task-list-item" style="list-style-type: none;"', J = J.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var Me = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return re && (Me += " checked"), Me += ">", Me;
          })), J = J.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(Me) {
            return "¨A" + Me;
          }), z || J.search(/\n{2,}/) > -1 ? (J = r.subParser("githubCodeBlocks")(J, g, p), J = r.subParser("blockGamut")(J, g, p)) : (J = r.subParser("lists")(J, g, p), J = J.replace(/\n$/, ""), J = r.subParser("hashHTMLBlocks")(J, g, p), J = J.replace(/\n\n+/g, `

`), P ? J = r.subParser("paragraphs")(J, g, p) : J = r.subParser("spanGamut")(J, g, p)), J = J.replace("¨A", ""), J = "<li" + ce + ">" + J + `</li>
`, J;
        }), k = k.replace(/¨0/g, ""), p.gListLevel--, M && (k = k.replace(/\s+$/, "")), k;
      }
      function w(k, M) {
        if (M === "ol") {
          var j = k.match(/^ *(\d+)\./);
          if (j && j[1] !== "1")
            return ' start="' + j[1] + '"';
        }
        return "";
      }
      function _(k, M, j) {
        var P = g.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, L = g.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, z = M === "ul" ? P : L, S = "";
        if (k.search(z) !== -1)
          (function N(q) {
            var re = q.search(z), J = w(k, M);
            re !== -1 ? (S += `

<` + M + J + `>
` + v(q.slice(0, re), !!j) + "</" + M + `>
`, M = M === "ul" ? "ol" : "ul", z = M === "ul" ? P : L, N(q.slice(re))) : S += `

<` + M + J + `>
` + v(q, !!j) + "</" + M + `>
`;
          })(k);
        else {
          var R = w(k, M);
          S = `

<` + M + R + `>
` + v(k, !!j) + "</" + M + `>
`;
        }
        return S;
      }
      return d = p.converter._dispatch("lists.before", d, g, p), d += "¨0", p.gListLevel ? d = d.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(k, M, j) {
          var P = j.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return _(M, P, !0);
        }
      ) : d = d.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(k, M, j, P) {
          var L = P.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return _(j, L, !1);
        }
      ), d = d.replace(/¨0/, ""), d = p.converter._dispatch("lists.after", d, g, p), d;
    }), r.subParser("metadata", function(d, g, p) {
      if (!g.metadata)
        return d;
      d = p.converter._dispatch("metadata.before", d, g, p);
      function v(w) {
        p.metadata.raw = w, w = w.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), w = w.replace(/\n {4}/g, " "), w.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(_, k, M) {
          return p.metadata.parsed[k] = M, "";
        });
      }
      return d = d.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(w, _, k) {
        return v(k), "¨M";
      }), d = d.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(w, _, k) {
        return _ && (p.metadata.format = _), v(k), "¨M";
      }), d = d.replace(/¨M/g, ""), d = p.converter._dispatch("metadata.after", d, g, p), d;
    }), r.subParser("outdent", function(d, g, p) {
      return d = p.converter._dispatch("outdent.before", d, g, p), d = d.replace(/^(\t|[ ]{1,4})/gm, "¨0"), d = d.replace(/¨0/g, ""), d = p.converter._dispatch("outdent.after", d, g, p), d;
    }), r.subParser("paragraphs", function(d, g, p) {
      d = p.converter._dispatch("paragraphs.before", d, g, p), d = d.replace(/^\n+/g, ""), d = d.replace(/\n+$/g, "");
      for (var v = d.split(/\n{2,}/g), w = [], _ = v.length, k = 0; k < _; k++) {
        var M = v[k];
        M.search(/¨(K|G)(\d+)\1/g) >= 0 ? w.push(M) : M.search(/\S/) >= 0 && (M = r.subParser("spanGamut")(M, g, p), M = M.replace(/^([ \t]*)/g, "<p>"), M += "</p>", w.push(M));
      }
      for (_ = w.length, k = 0; k < _; k++) {
        for (var j = "", P = w[k], L = !1; /¨(K|G)(\d+)\1/.test(P); ) {
          var z = RegExp.$1, S = RegExp.$2;
          z === "K" ? j = p.gHtmlBlocks[S] : L ? j = r.subParser("encodeCode")(p.ghCodeBlocks[S].text, g, p) : j = p.ghCodeBlocks[S].codeblock, j = j.replace(/\$/g, "$$$$"), P = P.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, j), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(P) && (L = !0);
        }
        w[k] = P;
      }
      return d = w.join(`
`), d = d.replace(/^\n+/g, ""), d = d.replace(/\n+$/g, ""), p.converter._dispatch("paragraphs.after", d, g, p);
    }), r.subParser("runExtension", function(d, g, p, v) {
      if (d.filter)
        g = d.filter(g, v.converter, p);
      else if (d.regex) {
        var w = d.regex;
        w instanceof RegExp || (w = new RegExp(w, "g")), g = g.replace(w, d.replace);
      }
      return g;
    }), r.subParser("spanGamut", function(d, g, p) {
      return d = p.converter._dispatch("spanGamut.before", d, g, p), d = r.subParser("codeSpans")(d, g, p), d = r.subParser("escapeSpecialCharsWithinTagAttributes")(d, g, p), d = r.subParser("encodeBackslashEscapes")(d, g, p), d = r.subParser("images")(d, g, p), d = r.subParser("anchors")(d, g, p), d = r.subParser("autoLinks")(d, g, p), d = r.subParser("simplifiedAutoLinks")(d, g, p), d = r.subParser("emoji")(d, g, p), d = r.subParser("underline")(d, g, p), d = r.subParser("italicsAndBold")(d, g, p), d = r.subParser("strikethrough")(d, g, p), d = r.subParser("ellipsis")(d, g, p), d = r.subParser("hashHTMLSpans")(d, g, p), d = r.subParser("encodeAmpsAndAngles")(d, g, p), g.simpleLineBreaks ? /\n\n¨K/.test(d) || (d = d.replace(/\n+/g, `<br />
`)) : d = d.replace(/  +\n/g, `<br />
`), d = p.converter._dispatch("spanGamut.after", d, g, p), d;
    }), r.subParser("strikethrough", function(d, g, p) {
      function v(w) {
        return g.simplifiedAutoLink && (w = r.subParser("simplifiedAutoLinks")(w, g, p)), "<del>" + w + "</del>";
      }
      return g.strikethrough && (d = p.converter._dispatch("strikethrough.before", d, g, p), d = d.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(w, _) {
        return v(_);
      }), d = p.converter._dispatch("strikethrough.after", d, g, p)), d;
    }), r.subParser("stripLinkDefinitions", function(d, g, p) {
      var v = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, w = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      d += "¨0";
      var _ = function(k, M, j, P, L, z, S) {
        return M = M.toLowerCase(), d.toLowerCase().split(M).length - 1 < 2 ? k : (j.match(/^data:.+?\/.+?;base64,/) ? p.gUrls[M] = j.replace(/\s/g, "") : p.gUrls[M] = r.subParser("encodeAmpsAndAngles")(j, g, p), z ? z + S : (S && (p.gTitles[M] = S.replace(/"|'/g, "&quot;")), g.parseImgDimensions && P && L && (p.gDimensions[M] = {
          width: P,
          height: L
        }), ""));
      };
      return d = d.replace(w, _), d = d.replace(v, _), d = d.replace(/¨0/, ""), d;
    }), r.subParser("tables", function(d, g, p) {
      if (!g.tables)
        return d;
      var v = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, w = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function _(L) {
        return /^:[ \t]*--*$/.test(L) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(L) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(L) ? ' style="text-align:center;"' : "";
      }
      function k(L, z) {
        var S = "";
        return L = L.trim(), (g.tablesHeaderId || g.tableHeaderId) && (S = ' id="' + L.replace(/ /g, "_").toLowerCase() + '"'), L = r.subParser("spanGamut")(L, g, p), "<th" + S + z + ">" + L + `</th>
`;
      }
      function M(L, z) {
        var S = r.subParser("spanGamut")(L, g, p);
        return "<td" + z + ">" + S + `</td>
`;
      }
      function j(L, z) {
        for (var S = `<table>
<thead>
<tr>
`, R = L.length, N = 0; N < R; ++N)
          S += L[N];
        for (S += `</tr>
</thead>
<tbody>
`, N = 0; N < z.length; ++N) {
          S += `<tr>
`;
          for (var q = 0; q < R; ++q)
            S += z[N][q];
          S += `</tr>
`;
        }
        return S += `</tbody>
</table>
`, S;
      }
      function P(L) {
        var z, S = L.split(`
`);
        for (z = 0; z < S.length; ++z)
          /^ {0,3}\|/.test(S[z]) && (S[z] = S[z].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(S[z]) && (S[z] = S[z].replace(/\|[ \t]*$/, "")), S[z] = r.subParser("codeSpans")(S[z], g, p);
        var R = S[0].split("|").map(function(Te) {
          return Te.trim();
        }), N = S[1].split("|").map(function(Te) {
          return Te.trim();
        }), q = [], re = [], J = [], ce = [];
        for (S.shift(), S.shift(), z = 0; z < S.length; ++z)
          S[z].trim() !== "" && q.push(
            S[z].split("|").map(function(Te) {
              return Te.trim();
            })
          );
        if (R.length < N.length)
          return L;
        for (z = 0; z < N.length; ++z)
          J.push(_(N[z]));
        for (z = 0; z < R.length; ++z)
          r.helper.isUndefined(J[z]) && (J[z] = ""), re.push(k(R[z], J[z]));
        for (z = 0; z < q.length; ++z) {
          for (var Me = [], Ae = 0; Ae < re.length; ++Ae)
            r.helper.isUndefined(q[z][Ae]), Me.push(M(q[z][Ae], J[Ae]));
          ce.push(Me);
        }
        return j(re, ce);
      }
      return d = p.converter._dispatch("tables.before", d, g, p), d = d.replace(/\\(\|)/g, r.helper.escapeCharactersCallback), d = d.replace(v, P), d = d.replace(w, P), d = p.converter._dispatch("tables.after", d, g, p), d;
    }), r.subParser("underline", function(d, g, p) {
      return g.underline && (d = p.converter._dispatch("underline.before", d, g, p), g.literalMidWordUnderscores ? (d = d.replace(/\b___(\S[\s\S]*?)___\b/g, function(v, w) {
        return "<u>" + w + "</u>";
      }), d = d.replace(/\b__(\S[\s\S]*?)__\b/g, function(v, w) {
        return "<u>" + w + "</u>";
      })) : (d = d.replace(/___(\S[\s\S]*?)___/g, function(v, w) {
        return /\S$/.test(w) ? "<u>" + w + "</u>" : v;
      }), d = d.replace(/__(\S[\s\S]*?)__/g, function(v, w) {
        return /\S$/.test(w) ? "<u>" + w + "</u>" : v;
      })), d = d.replace(/(_)/g, r.helper.escapeCharactersCallback), d = p.converter._dispatch("underline.after", d, g, p)), d;
    }), r.subParser("unescapeSpecialChars", function(d, g, p) {
      return d = p.converter._dispatch("unescapeSpecialChars.before", d, g, p), d = d.replace(/¨E(\d+)E/g, function(v, w) {
        var _ = parseInt(w);
        return String.fromCharCode(_);
      }), d = p.converter._dispatch("unescapeSpecialChars.after", d, g, p), d;
    }), r.subParser("makeMarkdown.blockquote", function(d, g) {
      var p = "";
      if (d.hasChildNodes())
        for (var v = d.childNodes, w = v.length, _ = 0; _ < w; ++_) {
          var k = r.subParser("makeMarkdown.node")(v[_], g);
          k !== "" && (p += k);
        }
      return p = p.trim(), p = "> " + p.split(`
`).join(`
> `), p;
    }), r.subParser("makeMarkdown.codeBlock", function(d, g) {
      var p = d.getAttribute("language"), v = d.getAttribute("precodenum");
      return "```" + p + `
` + g.preList[v] + "\n```";
    }), r.subParser("makeMarkdown.codeSpan", function(d) {
      return "`" + d.innerHTML + "`";
    }), r.subParser("makeMarkdown.emphasis", function(d, g) {
      var p = "";
      if (d.hasChildNodes()) {
        p += "*";
        for (var v = d.childNodes, w = v.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(v[_], g);
        p += "*";
      }
      return p;
    }), r.subParser("makeMarkdown.header", function(d, g, p) {
      var v = new Array(p + 1).join("#"), w = "";
      if (d.hasChildNodes()) {
        w = v + " ";
        for (var _ = d.childNodes, k = _.length, M = 0; M < k; ++M)
          w += r.subParser("makeMarkdown.node")(_[M], g);
      }
      return w;
    }), r.subParser("makeMarkdown.hr", function() {
      return "---";
    }), r.subParser("makeMarkdown.image", function(d) {
      var g = "";
      return d.hasAttribute("src") && (g += "![" + d.getAttribute("alt") + "](", g += "<" + d.getAttribute("src") + ">", d.hasAttribute("width") && d.hasAttribute("height") && (g += " =" + d.getAttribute("width") + "x" + d.getAttribute("height")), d.hasAttribute("title") && (g += ' "' + d.getAttribute("title") + '"'), g += ")"), g;
    }), r.subParser("makeMarkdown.links", function(d, g) {
      var p = "";
      if (d.hasChildNodes() && d.hasAttribute("href")) {
        var v = d.childNodes, w = v.length;
        p = "[";
        for (var _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(v[_], g);
        p += "](", p += "<" + d.getAttribute("href") + ">", d.hasAttribute("title") && (p += ' "' + d.getAttribute("title") + '"'), p += ")";
      }
      return p;
    }), r.subParser("makeMarkdown.list", function(d, g, p) {
      var v = "";
      if (!d.hasChildNodes())
        return "";
      for (var w = d.childNodes, _ = w.length, k = d.getAttribute("start") || 1, M = 0; M < _; ++M)
        if (!(typeof w[M].tagName > "u" || w[M].tagName.toLowerCase() !== "li")) {
          var j = "";
          p === "ol" ? j = k.toString() + ". " : j = "- ", v += j + r.subParser("makeMarkdown.listItem")(w[M], g), ++k;
        }
      return v += `
<!-- -->
`, v.trim();
    }), r.subParser("makeMarkdown.listItem", function(d, g) {
      for (var p = "", v = d.childNodes, w = v.length, _ = 0; _ < w; ++_)
        p += r.subParser("makeMarkdown.node")(v[_], g);
      return /\n$/.test(p) ? p = p.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : p += `
`, p;
    }), r.subParser("makeMarkdown.node", function(d, g, p) {
      p = p || !1;
      var v = "";
      if (d.nodeType === 3)
        return r.subParser("makeMarkdown.txt")(d, g);
      if (d.nodeType === 8)
        return "<!--" + d.data + `-->

`;
      if (d.nodeType !== 1)
        return "";
      var w = d.tagName.toLowerCase();
      switch (w) {
        case "h1":
          p || (v = r.subParser("makeMarkdown.header")(d, g, 1) + `

`);
          break;
        case "h2":
          p || (v = r.subParser("makeMarkdown.header")(d, g, 2) + `

`);
          break;
        case "h3":
          p || (v = r.subParser("makeMarkdown.header")(d, g, 3) + `

`);
          break;
        case "h4":
          p || (v = r.subParser("makeMarkdown.header")(d, g, 4) + `

`);
          break;
        case "h5":
          p || (v = r.subParser("makeMarkdown.header")(d, g, 5) + `

`);
          break;
        case "h6":
          p || (v = r.subParser("makeMarkdown.header")(d, g, 6) + `

`);
          break;
        case "p":
          p || (v = r.subParser("makeMarkdown.paragraph")(d, g) + `

`);
          break;
        case "blockquote":
          p || (v = r.subParser("makeMarkdown.blockquote")(d, g) + `

`);
          break;
        case "hr":
          p || (v = r.subParser("makeMarkdown.hr")(d, g) + `

`);
          break;
        case "ol":
          p || (v = r.subParser("makeMarkdown.list")(d, g, "ol") + `

`);
          break;
        case "ul":
          p || (v = r.subParser("makeMarkdown.list")(d, g, "ul") + `

`);
          break;
        case "precode":
          p || (v = r.subParser("makeMarkdown.codeBlock")(d, g) + `

`);
          break;
        case "pre":
          p || (v = r.subParser("makeMarkdown.pre")(d, g) + `

`);
          break;
        case "table":
          p || (v = r.subParser("makeMarkdown.table")(d, g) + `

`);
          break;
        case "code":
          v = r.subParser("makeMarkdown.codeSpan")(d, g);
          break;
        case "em":
        case "i":
          v = r.subParser("makeMarkdown.emphasis")(d, g);
          break;
        case "strong":
        case "b":
          v = r.subParser("makeMarkdown.strong")(d, g);
          break;
        case "del":
          v = r.subParser("makeMarkdown.strikethrough")(d, g);
          break;
        case "a":
          v = r.subParser("makeMarkdown.links")(d, g);
          break;
        case "img":
          v = r.subParser("makeMarkdown.image")(d, g);
          break;
        default:
          v = d.outerHTML + `

`;
      }
      return v;
    }), r.subParser("makeMarkdown.paragraph", function(d, g) {
      var p = "";
      if (d.hasChildNodes())
        for (var v = d.childNodes, w = v.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(v[_], g);
      return p = p.trim(), p;
    }), r.subParser("makeMarkdown.pre", function(d, g) {
      var p = d.getAttribute("prenum");
      return "<pre>" + g.preList[p] + "</pre>";
    }), r.subParser("makeMarkdown.strikethrough", function(d, g) {
      var p = "";
      if (d.hasChildNodes()) {
        p += "~~";
        for (var v = d.childNodes, w = v.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(v[_], g);
        p += "~~";
      }
      return p;
    }), r.subParser("makeMarkdown.strong", function(d, g) {
      var p = "";
      if (d.hasChildNodes()) {
        p += "**";
        for (var v = d.childNodes, w = v.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(v[_], g);
        p += "**";
      }
      return p;
    }), r.subParser("makeMarkdown.table", function(d, g) {
      var p = "", v = [[], []], w = d.querySelectorAll("thead>tr>th"), _ = d.querySelectorAll("tbody>tr"), k, M;
      for (k = 0; k < w.length; ++k) {
        var j = r.subParser("makeMarkdown.tableCell")(w[k], g), P = "---";
        if (w[k].hasAttribute("style")) {
          var L = w[k].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (L) {
            case "text-align:left;":
              P = ":---";
              break;
            case "text-align:right;":
              P = "---:";
              break;
            case "text-align:center;":
              P = ":---:";
              break;
          }
        }
        v[0][k] = j.trim(), v[1][k] = P;
      }
      for (k = 0; k < _.length; ++k) {
        var z = v.push([]) - 1, S = _[k].getElementsByTagName("td");
        for (M = 0; M < w.length; ++M) {
          var R = " ";
          typeof S[M] < "u" && (R = r.subParser("makeMarkdown.tableCell")(S[M], g)), v[z].push(R);
        }
      }
      var N = 3;
      for (k = 0; k < v.length; ++k)
        for (M = 0; M < v[k].length; ++M) {
          var q = v[k][M].length;
          q > N && (N = q);
        }
      for (k = 0; k < v.length; ++k) {
        for (M = 0; M < v[k].length; ++M)
          k === 1 ? v[k][M].slice(-1) === ":" ? v[k][M] = r.helper.padEnd(v[k][M].slice(-1), N - 1, "-") + ":" : v[k][M] = r.helper.padEnd(v[k][M], N, "-") : v[k][M] = r.helper.padEnd(v[k][M], N);
        p += "| " + v[k].join(" | ") + ` |
`;
      }
      return p.trim();
    }), r.subParser("makeMarkdown.tableCell", function(d, g) {
      var p = "";
      if (!d.hasChildNodes())
        return "";
      for (var v = d.childNodes, w = v.length, _ = 0; _ < w; ++_)
        p += r.subParser("makeMarkdown.node")(v[_], g, !0);
      return p.trim();
    }), r.subParser("makeMarkdown.txt", function(d) {
      var g = d.nodeValue;
      return g = g.replace(/ +/g, " "), g = g.replace(/¨NBSP;/g, " "), g = r.helper.unescapeHTMLEntities(g), g = g.replace(/([*_~|`])/g, "\\$1"), g = g.replace(/^(\s*)>/g, "\\$1>"), g = g.replace(/^#/gm, "\\#"), g = g.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), g = g.replace(/^( {0,3}\d+)\./gm, "$1\\."), g = g.replace(/^( {0,3})([+-])/gm, "$1\\$2"), g = g.replace(/]([\s]*)\(/g, "\\]$1\\("), g = g.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), g;
    });
    var O = this;
    t.exports ? t.exports = r : O.showdown = r;
  }).call(rc);
})(Y8);
Ue([]);
let X8 = document.querySelector('link[rel="icon"]');
X8.href;
Ts({});
Ts({});
const on = /* @__PURE__ */ Object.create(null);
on.open = "0";
on.close = "1";
on.ping = "2";
on.pong = "3";
on.message = "4";
on.upgrade = "5";
on.noop = "6";
const bi = /* @__PURE__ */ Object.create(null);
Object.keys(on).forEach((t) => {
  bi[on[t]] = t;
});
const Ea = { type: "error", data: "parser error" }, Xp = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", Qp = typeof ArrayBuffer == "function", Zp = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, Hc = ({ type: t, data: e }, n, r) => Xp && e instanceof Blob ? n ? r(e) : ef(e, r) : Qp && (e instanceof ArrayBuffer || Zp(e)) ? n ? r(e) : ef(new Blob([e]), r) : r(on[t] + (e || "")), ef = (t, e) => {
  const n = new FileReader();
  return n.onload = function() {
    const r = n.result.split(",")[1];
    e("b" + (r || ""));
  }, n.readAsDataURL(t);
};
function tf(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let Ml;
function Q8(t, e) {
  if (Xp && t.data instanceof Blob)
    return t.data.arrayBuffer().then(tf).then(e);
  if (Qp && (t.data instanceof ArrayBuffer || Zp(t.data)))
    return e(tf(t.data));
  Hc(t, !1, (n) => {
    Ml || (Ml = new TextEncoder()), e(Ml.encode(n));
  });
}
const nf = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ns = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < nf.length; t++)
  ns[nf.charCodeAt(t)] = t;
const Z8 = (t) => {
  let e = t.length * 0.75, n = t.length, r, s = 0, i, o, l, a;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const c = new ArrayBuffer(e), u = new Uint8Array(c);
  for (r = 0; r < n; r += 4)
    i = ns[t.charCodeAt(r)], o = ns[t.charCodeAt(r + 1)], l = ns[t.charCodeAt(r + 2)], a = ns[t.charCodeAt(r + 3)], u[s++] = i << 2 | o >> 4, u[s++] = (o & 15) << 4 | l >> 2, u[s++] = (l & 3) << 6 | a & 63;
  return c;
}, ex = typeof ArrayBuffer == "function", Fc = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: em(t, e)
    };
  const n = t.charAt(0);
  return n === "b" ? {
    type: "message",
    data: tx(t.substring(1), e)
  } : bi[n] ? t.length > 1 ? {
    type: bi[n],
    data: t.substring(1)
  } : {
    type: bi[n]
  } : Ea;
}, tx = (t, e) => {
  if (ex) {
    const n = Z8(t);
    return em(n, e);
  } else
    return { base64: !0, data: t };
}, em = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, tm = "", nx = (t, e) => {
  const n = t.length, r = new Array(n);
  let s = 0;
  t.forEach((i, o) => {
    Hc(i, !1, (l) => {
      r[o] = l, ++s === n && e(r.join(tm));
    });
  });
}, rx = (t, e) => {
  const n = t.split(tm), r = [];
  for (let s = 0; s < n.length; s++) {
    const i = Fc(n[s], e);
    if (r.push(i), i.type === "error")
      break;
  }
  return r;
};
function sx() {
  return new TransformStream({
    transform(t, e) {
      Q8(t, (n) => {
        const r = n.length;
        let s;
        if (r < 126)
          s = new Uint8Array(1), new DataView(s.buffer).setUint8(0, r);
        else if (r < 65536) {
          s = new Uint8Array(3);
          const i = new DataView(s.buffer);
          i.setUint8(0, 126), i.setUint16(1, r);
        } else {
          s = new Uint8Array(9);
          const i = new DataView(s.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(r));
        }
        t.data && typeof t.data != "string" && (s[0] |= 128), e.enqueue(s), e.enqueue(n);
      });
    }
  });
}
let Al;
function si(t) {
  return t.reduce((e, n) => e + n.length, 0);
}
function ii(t, e) {
  if (t[0].length === e)
    return t.shift();
  const n = new Uint8Array(e);
  let r = 0;
  for (let s = 0; s < e; s++)
    n[s] = t[0][r++], r === t[0].length && (t.shift(), r = 0);
  return t.length && r < t[0].length && (t[0] = t[0].slice(r)), n;
}
function ix(t, e) {
  Al || (Al = new TextDecoder());
  const n = [];
  let r = 0, s = -1, i = !1;
  return new TransformStream({
    transform(o, l) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (si(n) < 1)
            break;
          const a = ii(n, 1);
          i = (a[0] & 128) === 128, s = a[0] & 127, s < 126 ? r = 3 : s === 126 ? r = 1 : r = 2;
        } else if (r === 1) {
          if (si(n) < 2)
            break;
          const a = ii(n, 2);
          s = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), r = 3;
        } else if (r === 2) {
          if (si(n) < 8)
            break;
          const a = ii(n, 8), c = new DataView(a.buffer, a.byteOffset, a.length), u = c.getUint32(0);
          if (u > Math.pow(2, 21) - 1) {
            l.enqueue(Ea);
            break;
          }
          s = u * Math.pow(2, 32) + c.getUint32(4), r = 3;
        } else {
          if (si(n) < s)
            break;
          const a = ii(n, s);
          l.enqueue(Fc(i ? a : Al.decode(a), e)), r = 0;
        }
        if (s === 0 || s > t) {
          l.enqueue(Ea);
          break;
        }
      }
    }
  });
}
const nm = 4;
function $e(t) {
  if (t)
    return ox(t);
}
function ox(t) {
  for (var e in $e.prototype)
    t[e] = $e.prototype[e];
  return t;
}
$e.prototype.on = $e.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
$e.prototype.once = function(t, e) {
  function n() {
    this.off(t, n), e.apply(this, arguments);
  }
  return n.fn = e, this.on(t, n), this;
};
$e.prototype.off = $e.prototype.removeListener = $e.prototype.removeAllListeners = $e.prototype.removeEventListener = function(t, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var n = this._callbacks["$" + t];
  if (!n)
    return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + t], this;
  for (var r, s = 0; s < n.length; s++)
    if (r = n[s], r === e || r.fn === e) {
      n.splice(s, 1);
      break;
    }
  return n.length === 0 && delete this._callbacks["$" + t], this;
};
$e.prototype.emit = function(t) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), n = this._callbacks["$" + t], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  if (n) {
    n = n.slice(0);
    for (var r = 0, s = n.length; r < s; ++r)
      n[r].apply(this, e);
  }
  return this;
};
$e.prototype.emitReserved = $e.prototype.emit;
$e.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
$e.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const jt = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")();
function rm(t, ...e) {
  return e.reduce((n, r) => (t.hasOwnProperty(r) && (n[r] = t[r]), n), {});
}
const lx = jt.setTimeout, ax = jt.clearTimeout;
function Uo(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = lx.bind(jt), t.clearTimeoutFn = ax.bind(jt)) : (t.setTimeoutFn = jt.setTimeout.bind(jt), t.clearTimeoutFn = jt.clearTimeout.bind(jt));
}
const cx = 1.33;
function ux(t) {
  return typeof t == "string" ? dx(t) : Math.ceil((t.byteLength || t.size) * cx);
}
function dx(t) {
  let e = 0, n = 0;
  for (let r = 0, s = t.length; r < s; r++)
    e = t.charCodeAt(r), e < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || e >= 57344 ? n += 3 : (r++, n += 4);
  return n;
}
function fx(t) {
  let e = "";
  for (let n in t)
    t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
  return e;
}
function hx(t) {
  let e = {}, n = t.split("&");
  for (let r = 0, s = n.length; r < s; r++) {
    let i = n[r].split("=");
    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return e;
}
class px extends Error {
  constructor(e, n, r) {
    super(e), this.description = n, this.context = r, this.type = "TransportError";
  }
}
class Wc extends $e {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, Uo(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, n, r) {
    return super.emitReserved("error", new px(e, n, r)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const n = Fc(e, this.socket.binaryType);
    this.onPacket(n);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, n = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(n);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const n = fx(e);
    return n.length ? "?" + n : "";
  }
}
const sm = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), Ma = 64, mx = {};
let rf = 0, oi = 0, sf;
function of(t) {
  let e = "";
  do
    e = sm[t % Ma] + e, t = Math.floor(t / Ma);
  while (t > 0);
  return e;
}
function im() {
  const t = of(+/* @__PURE__ */ new Date());
  return t !== sf ? (rf = 0, sf = t) : t + "." + of(rf++);
}
for (; oi < Ma; oi++)
  mx[sm[oi]] = oi;
let om = !1;
try {
  om = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const gx = om;
function lm(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || gx))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new jt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function yx() {
}
const bx = function() {
  return new lm({
    xdomain: !1
  }).responseType != null;
}();
class vx extends Wc {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), this.polling = !1, typeof location < "u") {
      const r = location.protocol === "https:";
      let s = location.port;
      s || (s = r ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || s !== e.port;
    }
    const n = e && e.forceBase64;
    this.supportsBinary = bx && !n, this.opts.withCredentials && (this.cookieJar = void 0);
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this.poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const n = () => {
      this.readyState = "paused", e();
    };
    if (this.polling || !this.writable) {
      let r = 0;
      this.polling && (r++, this.once("pollComplete", function() {
        --r || n();
      })), this.writable || (r++, this.once("drain", function() {
        --r || n();
      }));
    } else
      n();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  poll() {
    this.polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const n = (r) => {
      if (this.readyState === "opening" && r.type === "open" && this.onOpen(), r.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(r);
    };
    rx(e, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, nx(e, (n) => {
      this.doWrite(n, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", n = this.query || {};
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = im()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Creates a request.
   *
   * @param {String} method
   * @private
   */
  request(e = {}) {
    return Object.assign(e, { xd: this.xd, cookieJar: this.cookieJar }, this.opts), new nn(this.uri(), e);
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, n) {
    const r = this.request({
      method: "POST",
      data: e
    });
    r.on("success", n), r.on("error", (s, i) => {
      this.onError("xhr post error", s, i);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (n, r) => {
      this.onError("xhr poll error", n, r);
    }), this.pollXhr = e;
  }
}
class nn extends $e {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, n) {
    super(), Uo(this, n), this.opts = n, this.method = n.method || "GET", this.uri = e, this.data = n.data !== void 0 ? n.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const n = rm(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this.opts.xd;
    const r = this.xhr = new lm(n);
    try {
      r.open(this.method, this.uri, !0);
      try {
        if (this.opts.extraHeaders) {
          r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
          for (let s in this.opts.extraHeaders)
            this.opts.extraHeaders.hasOwnProperty(s) && r.setRequestHeader(s, this.opts.extraHeaders[s]);
        }
      } catch {
      }
      if (this.method === "POST")
        try {
          r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        r.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this.opts.cookieJar) === null || e === void 0 || e.addCookies(r), "withCredentials" in r && (r.withCredentials = this.opts.withCredentials), this.opts.requestTimeout && (r.timeout = this.opts.requestTimeout), r.onreadystatechange = () => {
        var s;
        r.readyState === 3 && ((s = this.opts.cookieJar) === null || s === void 0 || s.parseCookies(r)), r.readyState === 4 && (r.status === 200 || r.status === 1223 ? this.onLoad() : this.setTimeoutFn(() => {
          this.onError(typeof r.status == "number" ? r.status : 0);
        }, 0));
      }, r.send(this.data);
    } catch (s) {
      this.setTimeoutFn(() => {
        this.onError(s);
      }, 0);
      return;
    }
    typeof document < "u" && (this.index = nn.requestsCount++, nn.requests[this.index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  onError(e) {
    this.emitReserved("error", e, this.xhr), this.cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  cleanup(e) {
    if (!(typeof this.xhr > "u" || this.xhr === null)) {
      if (this.xhr.onreadystatechange = yx, e)
        try {
          this.xhr.abort();
        } catch {
        }
      typeof document < "u" && delete nn.requests[this.index], this.xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  onLoad() {
    const e = this.xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this.cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this.cleanup();
  }
}
nn.requestsCount = 0;
nn.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", lf);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in jt ? "pagehide" : "unload";
    addEventListener(t, lf, !1);
  }
}
function lf() {
  for (let t in nn.requests)
    nn.requests.hasOwnProperty(t) && nn.requests[t].abort();
}
const Vc = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, n) => n(e, 0), li = jt.WebSocket || jt.MozWebSocket, af = !0, wx = "arraybuffer", cf = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class xx extends Wc {
  /**
   * WebSocket transport constructor.
   *
   * @param {Object} opts - connection options
   * @protected
   */
  constructor(e) {
    super(e), this.supportsBinary = !e.forceBase64;
  }
  get name() {
    return "websocket";
  }
  doOpen() {
    if (!this.check())
      return;
    const e = this.uri(), n = this.opts.protocols, r = cf ? {} : rm(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
    try {
      this.ws = af && !cf ? n ? new li(e, n) : new li(e) : new li(e, n, r);
    } catch (s) {
      return this.emitReserved("error", s);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let n = 0; n < e.length; n++) {
      const r = e[n], s = n === e.length - 1;
      Hc(r, this.supportsBinary, (i) => {
        const o = {};
        try {
          af && this.ws.send(i);
        } catch {
        }
        s && Vc(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", n = this.query || {};
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = im()), this.supportsBinary || (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @private
   */
  check() {
    return !!li;
  }
}
class kx extends Wc {
  get name() {
    return "webtransport";
  }
  doOpen() {
    typeof WebTransport == "function" && (this.transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]), this.transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this.transport.ready.then(() => {
      this.transport.createBidirectionalStream().then((e) => {
        const n = ix(Number.MAX_SAFE_INTEGER, this.socket.binaryType), r = e.readable.pipeThrough(n).getReader(), s = sx();
        s.readable.pipeTo(e.writable), this.writer = s.writable.getWriter();
        const i = () => {
          r.read().then(({ done: l, value: a }) => {
            l || (this.onPacket(a), i());
          }).catch((l) => {
          });
        };
        i();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this.writer.write(o).then(() => this.onOpen());
      });
    }));
  }
  write(e) {
    this.writable = !1;
    for (let n = 0; n < e.length; n++) {
      const r = e[n], s = n === e.length - 1;
      this.writer.write(r).then(() => {
        s && Vc(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this.transport) === null || e === void 0 || e.close();
  }
}
const _x = {
  websocket: xx,
  webtransport: kx,
  polling: vx
}, Sx = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Cx = [
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
  "anchor"
];
function Aa(t) {
  if (t.length > 2e3)
    throw "URI too long";
  const e = t, n = t.indexOf("["), r = t.indexOf("]");
  n != -1 && r != -1 && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
  let s = Sx.exec(t || ""), i = {}, o = 14;
  for (; o--; )
    i[Cx[o]] = s[o] || "";
  return n != -1 && r != -1 && (i.source = e, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = Ex(i, i.path), i.queryKey = Mx(i, i.query), i;
}
function Ex(t, e) {
  const n = /\/{2,9}/g, r = e.replace(n, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && r.splice(0, 1), e.slice(-1) == "/" && r.splice(r.length - 1, 1), r;
}
function Mx(t, e) {
  const n = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(r, s, i) {
    s && (n[s] = i);
  }), n;
}
let am = class _r extends $e {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, n = {}) {
    super(), this.binaryType = wx, this.writeBuffer = [], e && typeof e == "object" && (n = e, e = null), e ? (e = Aa(e), n.hostname = e.host, n.secure = e.protocol === "https" || e.protocol === "wss", n.port = e.port, e.query && (n.query = e.query)) : n.host && (n.hostname = Aa(n.host).host), Uo(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = n.transports || [
      "polling",
      "websocket",
      "webtransport"
    ], this.writeBuffer = [], this.prevBufferLen = 0, this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = hx(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this.beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this.offlineEventListener = () => {
      this.onClose("transport close", {
        description: "network connection lost"
      });
    }, addEventListener("offline", this.offlineEventListener, !1))), this.open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const n = Object.assign({}, this.opts.query);
    n.EIO = nm, n.transport = e, this.id && (n.sid = this.id);
    const r = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new _x[e](r);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && _r.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
      e = "websocket";
    else if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    } else
      e = this.transports[0];
    this.readyState = "opening";
    try {
      e = this.createTransport(e);
    } catch {
      this.transports.shift(), this.open();
      return;
    }
    e.open(), this.setTransport(e);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (n) => this.onClose("transport close", n));
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  probe(e) {
    let n = this.createTransport(e), r = !1;
    _r.priorWebsocketSuccess = !1;
    const s = () => {
      r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (f) => {
        if (!r)
          if (f.type === "pong" && f.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            _r.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              r || this.readyState !== "closed" && (u(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const h = new Error("probe error");
            h.transport = n.name, this.emitReserved("upgradeError", h);
          }
      }));
    };
    function i() {
      r || (r = !0, u(), n.close(), n = null);
    }
    const o = (f) => {
      const h = new Error("probe error: " + f);
      h.transport = n.name, i(), this.emitReserved("upgradeError", h);
    };
    function l() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function c(f) {
      n && f.name !== n.name && i();
    }
    const u = () => {
      n.removeListener("open", s), n.removeListener("error", o), n.removeListener("close", l), this.off("close", a), this.off("upgrading", c);
    };
    n.once("open", s), n.once("error", o), n.once("close", l), this.once("close", a), this.once("upgrading", c), this.upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      r || n.open();
    }, 200) : n.open();
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    if (this.readyState = "open", _r.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
      let e = 0;
      const n = this.upgrades.length;
      for (; e < n; e++)
        this.probe(this.upgrades[e]);
    }
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), this.resetPingTimeout(), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this.sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong");
          break;
        case "error":
          const n = new Error("server error");
          n.code = e.data, this.onError(n);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this.resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer), this.pingTimeoutTimer = this.setTimeoutFn(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout), this.opts.autoUnref && this.pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this.getWritablePackets();
      this.transport.send(e), this.prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  getWritablePackets() {
    if (!(this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let n = 1;
    for (let r = 0; r < this.writeBuffer.length; r++) {
      const s = this.writeBuffer[r].data;
      if (s && (n += ux(s)), r > 0 && n > this.maxPayload)
        return this.writeBuffer.slice(0, r);
      n += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} callback function.
   * @return {Socket} for chaining.
   */
  write(e, n, r) {
    return this.sendPacket("message", e, n, r), this;
  }
  send(e, n, r) {
    return this.sendPacket("message", e, n, r), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  sendPacket(e, n, r, s) {
    if (typeof n == "function" && (s = n, n = void 0), typeof r == "function" && (s = r, r = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    r = r || {}, r.compress = r.compress !== !1;
    const i = {
      type: e,
      data: n,
      options: r
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), s && this.once("flush", s), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this.onClose("forced close"), this.transport.close();
    }, n = () => {
      this.off("upgrade", n), this.off("upgradeError", n), e();
    }, r = () => {
      this.once("upgrade", n), this.once("upgradeError", n);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? r() : e();
    }) : this.upgrading ? r() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  onError(e) {
    _r.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  onClose(e, n) {
    (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") && (this.clearTimeoutFn(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), typeof removeEventListener == "function" && (removeEventListener("beforeunload", this.beforeunloadEventListener, !1), removeEventListener("offline", this.offlineEventListener, !1)), this.readyState = "closed", this.id = null, this.emitReserved("close", e, n), this.writeBuffer = [], this.prevBufferLen = 0);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  filterUpgrades(e) {
    const n = [];
    let r = 0;
    const s = e.length;
    for (; r < s; r++)
      ~this.transports.indexOf(e[r]) && n.push(e[r]);
    return n;
  }
};
am.protocol = nm;
function Ax(t, e = "", n) {
  let r = t;
  n = n || typeof location < "u" && location, t == null && (t = n.protocol + "//" + n.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = n.protocol + t : t = n.host + t), /^(https?|wss?):\/\//.test(t) || (typeof n < "u" ? t = n.protocol + "//" + t : t = "https://" + t), r = Aa(t)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/";
  const i = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return r.id = r.protocol + "://" + i + ":" + r.port + e, r.href = r.protocol + "://" + i + (n && n.port === r.port ? "" : ":" + r.port), r;
}
const Tx = typeof ArrayBuffer == "function", Ox = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, cm = Object.prototype.toString, jx = typeof Blob == "function" || typeof Blob < "u" && cm.call(Blob) === "[object BlobConstructor]", Rx = typeof File == "function" || typeof File < "u" && cm.call(File) === "[object FileConstructor]";
function Kc(t) {
  return Tx && (t instanceof ArrayBuffer || Ox(t)) || jx && t instanceof Blob || Rx && t instanceof File;
}
function vi(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let n = 0, r = t.length; n < r; n++)
      if (vi(t[n]))
        return !0;
    return !1;
  }
  if (Kc(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return vi(t.toJSON(), !0);
  for (const n in t)
    if (Object.prototype.hasOwnProperty.call(t, n) && vi(t[n]))
      return !0;
  return !1;
}
function Px(t) {
  const e = [], n = t.data, r = t;
  return r.data = Ta(n, e), r.attachments = e.length, { packet: r, buffers: e };
}
function Ta(t, e) {
  if (!t)
    return t;
  if (Kc(t)) {
    const n = { _placeholder: !0, num: e.length };
    return e.push(t), n;
  } else if (Array.isArray(t)) {
    const n = new Array(t.length);
    for (let r = 0; r < t.length; r++)
      n[r] = Ta(t[r], e);
    return n;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const n = {};
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (n[r] = Ta(t[r], e));
    return n;
  }
  return t;
}
function Ix(t, e) {
  return t.data = Oa(t.data, e), delete t.attachments, t;
}
function Oa(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let n = 0; n < t.length; n++)
      t[n] = Oa(t[n], e);
  else if (typeof t == "object")
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (t[n] = Oa(t[n], e));
  return t;
}
const Lx = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Nx = 5;
var de;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(de || (de = {}));
class zx {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === de.EVENT || e.type === de.ACK) && vi(e) ? this.encodeAsBinary({
      type: e.type === de.EVENT ? de.BINARY_EVENT : de.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let n = "" + e.type;
    return (e.type === de.BINARY_EVENT || e.type === de.BINARY_ACK) && (n += e.attachments + "-"), e.nsp && e.nsp !== "/" && (n += e.nsp + ","), e.id != null && (n += e.id), e.data != null && (n += JSON.stringify(e.data, this.replacer)), n;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const n = Px(e), r = this.encodeAsString(n.packet), s = n.buffers;
    return s.unshift(r), s;
  }
}
function uf(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class Uc extends $e {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let n;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      n = this.decodeString(e);
      const r = n.type === de.BINARY_EVENT;
      r || n.type === de.BINARY_ACK ? (n.type = r ? de.EVENT : de.ACK, this.reconstructor = new $x(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (Kc(e) || e.base64)
      if (this.reconstructor)
        n = this.reconstructor.takeBinaryData(e), n && (this.reconstructor = null, super.emitReserved("decoded", n));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let n = 0;
    const r = {
      type: Number(e.charAt(0))
    };
    if (de[r.type] === void 0)
      throw new Error("unknown packet type " + r.type);
    if (r.type === de.BINARY_EVENT || r.type === de.BINARY_ACK) {
      const i = n + 1;
      for (; e.charAt(++n) !== "-" && n != e.length; )
        ;
      const o = e.substring(i, n);
      if (o != Number(o) || e.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      r.attachments = Number(o);
    }
    if (e.charAt(n + 1) === "/") {
      const i = n + 1;
      for (; ++n && !(e.charAt(n) === "," || n === e.length); )
        ;
      r.nsp = e.substring(i, n);
    } else
      r.nsp = "/";
    const s = e.charAt(n + 1);
    if (s !== "" && Number(s) == s) {
      const i = n + 1;
      for (; ++n; ) {
        const o = e.charAt(n);
        if (o == null || Number(o) != o) {
          --n;
          break;
        }
        if (n === e.length)
          break;
      }
      r.id = Number(e.substring(i, n + 1));
    }
    if (e.charAt(++n)) {
      const i = this.tryParse(e.substr(n));
      if (Uc.isPayloadValid(r.type, i))
        r.data = i;
      else
        throw new Error("invalid payload");
    }
    return r;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, n) {
    switch (e) {
      case de.CONNECT:
        return uf(n);
      case de.DISCONNECT:
        return n === void 0;
      case de.CONNECT_ERROR:
        return typeof n == "string" || uf(n);
      case de.EVENT:
      case de.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && Lx.indexOf(n[0]) === -1);
      case de.ACK:
      case de.BINARY_ACK:
        return Array.isArray(n);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class $x {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const n = Ix(this.reconPack, this.buffers);
      return this.finishedReconstruction(), n;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Dx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Uc,
  Encoder: zx,
  get PacketType() {
    return de;
  },
  protocol: Nx
}, Symbol.toStringTag, { value: "Module" }));
function zt(t, e, n) {
  return t.on(e, n), function() {
    t.off(e, n);
  };
}
const Bx = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class um extends $e {
  /**
   * `Socket` constructor.
   */
  constructor(e, n, r) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = n, r && r.auth && (this.auth = r.auth), this._opts = Object.assign({}, r), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      zt(e, "open", this.onopen.bind(this)),
      zt(e, "packet", this.onpacket.bind(this)),
      zt(e, "error", this.onerror.bind(this)),
      zt(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...n) {
    if (Bx.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (n.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const r = {
      type: de.EVENT,
      data: n
    };
    if (r.options = {}, r.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const o = this.ids++, l = n.pop();
      this._registerAckCallback(o, l), r.id = o;
    }
    const s = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
    return this.flags.volatile && (!s || !this.connected) || (this.connected ? (this.notifyOutgoingListeners(r), this.packet(r)) : this.sendBuffer.push(r)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, n) {
    var r;
    const s = (r = this.flags.timeout) !== null && r !== void 0 ? r : this._opts.ackTimeout;
    if (s === void 0) {
      this.acks[e] = n;
      return;
    }
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let o = 0; o < this.sendBuffer.length; o++)
        this.sendBuffer[o].id === e && this.sendBuffer.splice(o, 1);
      n.call(this, new Error("operation has timed out"));
    }, s);
    this.acks[e] = (...o) => {
      this.io.clearTimeoutFn(i), n.apply(this, [null, ...o]);
    };
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...n) {
    const r = this.flags.timeout !== void 0 || this._opts.ackTimeout !== void 0;
    return new Promise((s, i) => {
      n.push((o, l) => r ? o ? i(o) : s(l) : s(o)), this.emit(e, ...n);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let n;
    typeof e[e.length - 1] == "function" && (n = e.pop());
    const r = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((s, ...i) => r !== this._queue[0] ? void 0 : (s !== null ? r.tryCount > this._opts.retries && (this._queue.shift(), n && n(s)) : (this._queue.shift(), n && n(null, ...i)), r.pending = !1, this._drainQueue())), this._queue.push(r), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const n = this._queue[0];
    n.pending && !e || (n.pending = !0, n.tryCount++, this.flags = n.flags, this.emit.apply(this, n.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: de.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, n) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, n);
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case de.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case de.EVENT:
        case de.BINARY_EVENT:
          this.onevent(e);
          break;
        case de.ACK:
        case de.BINARY_ACK:
          this.onack(e);
          break;
        case de.DISCONNECT:
          this.ondisconnect();
          break;
        case de.CONNECT_ERROR:
          this.destroy();
          const r = new Error(e.data.message);
          r.data = e.data.data, this.emitReserved("connect_error", r);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const n = e.data || [];
    e.id != null && n.push(this.ack(e.id)), this.connected ? this.emitEvent(n) : this.receiveBuffer.push(Object.freeze(n));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const n = this._anyListeners.slice();
      for (const r of n)
        r.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const n = this;
    let r = !1;
    return function(...s) {
      r || (r = !0, n.packet({
        type: de.ACK,
        id: e,
        data: s
      }));
    };
  }
  /**
   * Called upon a server acknowlegement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const n = this.acks[e.id];
    typeof n == "function" && (n.apply(this, e.data), delete this.acks[e.id]);
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, n) {
    this.id = e, this.recovered = n && this._pid === n, this._pid = n, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: de.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const n = this._anyListeners;
      for (let r = 0; r < n.length; r++)
        if (e === n[r])
          return n.splice(r, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const n = this._anyOutgoingListeners;
      for (let r = 0; r < n.length; r++)
        if (e === n[r])
          return n.splice(r, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const n = this._anyOutgoingListeners.slice();
      for (const r of n)
        r.apply(this, e.data);
    }
  }
}
function Ur(t) {
  t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
}
Ur.prototype.duration = function() {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), n = Math.floor(e * this.jitter * t);
    t = Math.floor(e * 10) & 1 ? t + n : t - n;
  }
  return Math.min(t, this.max) | 0;
};
Ur.prototype.reset = function() {
  this.attempts = 0;
};
Ur.prototype.setMin = function(t) {
  this.ms = t;
};
Ur.prototype.setMax = function(t) {
  this.max = t;
};
Ur.prototype.setJitter = function(t) {
  this.jitter = t;
};
class ja extends $e {
  constructor(e, n) {
    var r;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (n = e, e = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, Uo(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5), this.backoff = new Ur({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = e;
    const s = n.parser || Dx;
    this.encoder = new s.Encoder(), this.decoder = new s.Decoder(), this._autoConnect = n.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var n;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (n = this.backoff) === null || n === void 0 || n.setMin(e), this);
  }
  randomizationFactor(e) {
    var n;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (n = this.backoff) === null || n === void 0 || n.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var n;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (n = this.backoff) === null || n === void 0 || n.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new am(this.uri, this.opts);
    const n = this.engine, r = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const s = zt(n, "open", function() {
      r.onopen(), e && e();
    }), i = (l) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", l), e ? e(l) : this.maybeReconnectOnOpen();
    }, o = zt(n, "error", i);
    if (this._timeout !== !1) {
      const l = this._timeout, a = this.setTimeoutFn(() => {
        s(), i(new Error("timeout")), n.close();
      }, l);
      this.opts.autoUnref && a.unref(), this.subs.push(() => {
        this.clearTimeoutFn(a);
      });
    }
    return this.subs.push(s), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(zt(e, "ping", this.onping.bind(this)), zt(e, "data", this.ondata.bind(this)), zt(e, "error", this.onerror.bind(this)), zt(e, "close", this.onclose.bind(this)), zt(this.decoder, "decoded", this.ondecoded.bind(this)));
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (n) {
      this.onclose("parse error", n);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    Vc(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, n) {
    let r = this.nsps[e];
    return r ? this._autoConnect && !r.active && r.connect() : (r = new um(this, e, n), this.nsps[e] = r), r;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const n = Object.keys(this.nsps);
    for (const r of n)
      if (this.nsps[r].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const n = this.encoder.encode(e);
    for (let r = 0; r < n.length; r++)
      this.engine.write(n[r], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close"), this.engine && this.engine.close();
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called upon engine close.
   *
   * @private
   */
  onclose(e, n) {
    this.cleanup(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, n), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const n = this.backoff.duration();
      this._reconnecting = !0;
      const r = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((s) => {
          s ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", s)) : e.onreconnect();
        }));
      }, n);
      this.opts.autoUnref && r.unref(), this.subs.push(() => {
        this.clearTimeoutFn(r);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const Jr = {};
function Tl(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const n = Ax(t, e.path || "/socket.io"), r = n.source, s = n.id, i = n.path, o = Jr[s] && i in Jr[s].nsps, l = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return l ? a = new ja(r, e) : (Jr[s] || (Jr[s] = new ja(r, e)), a = Jr[s]), n.query && !e.query && (e.query = n.queryKey), a.socket(n.path, e);
}
Object.assign(Tl, {
  Manager: ja,
  Socket: um,
  io: Tl,
  connect: Tl
});
const Hx = /* @__PURE__ */ Xe({
  name: "AuthorizationMessage",
  components: {
    Spinner: Sy
  }
}), Fx = { class: "h-screen flex flex-col justify-around items-center bg-gray-400" }, Wx = { class: "block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100" }, Vx = /* @__PURE__ */ le("p", { class: "text-center text-3xl font-bold text-red-300" }, "Please scan your employee ID to continue.", -1);
function Kx(t, e, n, r, s, i) {
  const o = Ce("Spinner");
  return Z(), pe("div", Fx, [
    le("div", Wx, [
      ye(o, { class: "w-8 mb-4 mx-auto" }),
      Vx
    ])
  ]);
}
const dm = /* @__PURE__ */ rt(Hx, [["render", Kx]]), Ux = {
  name: "SessionTimer",
  props: {
    employeeName: {
      type: String,
      required: !0
    },
    tokenExpiration: {
      type: Number,
      required: !0
    }
  },
  setup(t) {
    let e = null;
    const n = Ue(0), r = lt(() => {
      const i = Math.floor(n.value / 60), o = n.value % 60;
      return n.value > 0 ? `Timeout in ${i}m ${o}s` : "Session Timed Out.";
    }), s = () => {
      const i = Date.now();
      n.value = Math.floor((t.tokenExpiration - i) / 1e3);
    };
    return Wr(() => {
      clearInterval(e), t.tokenExpiration && t.tokenExpiration > Date.now() && (e = setInterval(s, 1e3), s());
    }), Mo(() => {
      clearInterval(e);
    }), {
      timeLeftDisplay: r
    };
  }
}, qx = { class: "text-black-500 xl:text-2xl" }, Gx = /* @__PURE__ */ le("strong", null, "Employee:", -1), Jx = {
  key: 0,
  class: "text-gray-500 text-m xl:text-xl"
};
function Yx(t, e, n, r, s, i) {
  return Z(), pe("div", qx, [
    Gx,
    Ln(" " + at(n.employeeName) + " ", 1),
    n.tokenExpiration ? (Z(), pe("div", Jx, at(r.timeLeftDisplay), 1)) : Ge("", !0)
  ]);
}
const Xx = /* @__PURE__ */ rt(Ux, [["render", Yx]]), Qx = /* @__PURE__ */ Xe({
  name: "TimerWidget",
  data() {
    return {
      taskStarted: !1,
      startTime: /* @__PURE__ */ new Date(),
      elapsedTime: "00:00:00",
      interval: null,
      // Adjust as necessary
      completed_jobCard: !1,
      start_time_frappe: /* @__PURE__ */ new Date()
    };
  },
  props: {
    jobCard: {
      type: Object,
      default: () => {
      }
    },
    employee_id: String
    // watch: {
    //   jobCard(new_card, old_card){
    //   }
    // },
  },
  methods: {
    get_time_in_string(t) {
      const e = t.getUTCFullYear(), n = t.getUTCMonth() + 1, r = t.getUTCDate(), s = t.getUTCHours(), i = t.getUTCMinutes(), o = t.getUTCSeconds(), l = (c) => c < 10 ? "0" + c : c;
      return `${e}-${l(n)}-${l(r)} ${l(s - 5)}:${l(i)}:${l(o)}`;
    },
    async startTask(t) {
      this.startTime = /* @__PURE__ */ new Date(), this.start_time_frappe = this.get_time_in_string(this.startTime);
      const e = await Xt("timeclock.www.job_timeclock.log_start_time_of_jobcard", { employee_id: this.employee_id, start_time: this.start_time_frappe, jobcard_name: t.name });
      e?.status === "success" ? (console.log("Start Time sent."), console.log("Work Orders ", e.work_orders), this.taskStarted = !0, this.start_timer(this.startTime)) : (console.log("did not work."), console.log(e.job_card));
    },
    start_timer(t) {
      this.interval = setInterval(() => {
        const n = (/* @__PURE__ */ new Date()).getTime() - t.getTime(), r = Math.floor(n / (1e3 * 60 * 60)), s = Math.floor(n % (1e3 * 60 * 60) / (1e3 * 60)), i = Math.floor(n % (1e3 * 60) / 1e3);
        this.elapsedTime = `${r.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
      }, 1e3);
    },
    async stopTask(t) {
      this.endTime = /* @__PURE__ */ new Date(), this.end_time_frappe = this.get_time_in_string(this.endTime), (await Xt("timeclock.www.job_timeclock.log_end_time_of_jobcard", { employee_id: this.employee_id, end_time: this.end_time_frappe, jobcard_name: t.name }))?.status === "success" ? (console.log("End Time sent."), clearInterval(this.interval), this.taskStarted = !1) : console.log("End job card did not work.");
    },
    complete_task() {
      this.completed_jobCard === !1 ? confirm("Are you sure you want to submit?") ? this.completed_jobCard = !0 : this.completed_jobCard = !1 : console.log("aye");
    }
  },
  mounted() {
    this.jobCard.status === "Completed" && (this.completed_jobCard = !0);
  },
  beforeMount() {
    if (this.jobCard.time_logs.time_in_mins !== 0)
      this.taskStarted = !1;
    else {
      this.taskStarted = !0;
      const t = this.jobCard.time_logs.from_time;
      this.start_time = new Date(t), this.start_timer(this.start_time);
    }
  },
  unmounted() {
  }
}), Zx = /* @__PURE__ */ le("h4", { class: "font-bold text-xl" }, "Task Timer", -1), ek = {
  key: 2,
  class: "text-gray-700 text-md font-family-sans"
};
function tk(t, e, n, r, s, i) {
  return Z(), pe("div", null, [
    Zx,
    t.taskStarted === !1 && t.completed_jobCard === !1 ? (Z(), pe("button", {
      key: 0,
      class: "bg-green-400 text-white font-normal lg:text-3xl focus:bg-green-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
      onClick: e[0] || (e[0] = (o) => t.startTask(t.jobCard))
    }, "Start Timer")) : Ge("", !0),
    t.taskStarted && t.completed_jobCard === !1 ? (Z(), pe("button", {
      key: 1,
      class: "bg-red-400 text-white font-normal lg:text-3xl focus:bg-red-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
      onClick: e[1] || (e[1] = (o) => t.stopTask(t.jobCard))
    }, "Stop Timer")) : Ge("", !0),
    le("button", {
      class: "bg-gray-800 text-white font-normal lg:text-3xl focus:bg-gray-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
      onClick: e[2] || (e[2] = (...o) => t.complete_task && t.complete_task(...o))
    }, "Complete"),
    t.completed_jobCard === !1 ? (Z(), pe("p", ek, at(t.elapsedTime), 1)) : Ge("", !0)
  ]);
}
const fm = /* @__PURE__ */ rt(Qx, [["render", tk]]), nk = {}, rk = { class: "card divide-y divide-gray-100 rounded-md border border-gray-200 flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 mt-2 mb-2" };
function sk(t, e) {
  return Z(), pe("div", rk, [
    Cr(t.$slots, "default")
  ]);
}
const qo = /* @__PURE__ */ rt(nk, [["render", sk]]), ik = /* @__PURE__ */ Xe({
  name: "WorkOrderWidget",
  components: {
    Card: qo
  },
  props: {
    workOrder: {
      type: Object,
      required: !0
    },
    isSelected: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      selected: !1
    };
  },
  methods: {
    click(t) {
      this.selected === !0 ? this.selected = !1 : (this.$emit("click", t), this.selected = !0);
    },
    mounted() {
      this.selected = !1;
    }
  },
  unmounted() {
    this.selected = !1;
  }
}), ok = { class: "flex flex-col" }, lk = { class: "text-xl xl:text-4xl" }, ak = {
  key: 0,
  class: "text-lg"
}, ck = {
  key: 0,
  class: "px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"
};
function uk(t, e, n, r, s, i) {
  const o = Ce("Card");
  return Z(), We(o, {
    onClick: t.click,
    class: $t([{ "bg-blue-100": t.isSelected }, "overflow-hidden"])
  }, {
    default: yt(() => [
      le("div", ok, [
        le("h3", lk, at(t.workOrder.production_item), 1),
        t.selected === !1 ? (Z(), pe("span", ak, at(t.workOrder.name), 1)) : Ge("", !0)
      ]),
      t.selected === !1 ? (Z(), pe("span", ck, at(t.workOrder.status), 1)) : Ge("", !0)
    ]),
    _: 1
  }, 8, ["onClick", "class"]);
}
const dk = /* @__PURE__ */ rt(ik, [["render", uk]]);
var fk = typeof global == "object" && global && global.Object === Object && global, hk = typeof self == "object" && self && self.Object === Object && self, hm = fk || hk || Function("return this")(), po = hm.Symbol, pm = Object.prototype, pk = pm.hasOwnProperty, mk = pm.toString, Yr = po ? po.toStringTag : void 0;
function gk(t) {
  var e = pk.call(t, Yr), n = t[Yr];
  try {
    t[Yr] = void 0;
    var r = !0;
  } catch {
  }
  var s = mk.call(t);
  return r && (e ? t[Yr] = n : delete t[Yr]), s;
}
var yk = Object.prototype, bk = yk.toString;
function vk(t) {
  return bk.call(t);
}
var wk = "[object Null]", xk = "[object Undefined]", df = po ? po.toStringTag : void 0;
function kk(t) {
  return t == null ? t === void 0 ? xk : wk : df && df in Object(t) ? gk(t) : vk(t);
}
function _k(t) {
  return t != null && typeof t == "object";
}
var Sk = "[object Symbol]";
function Ck(t) {
  return typeof t == "symbol" || _k(t) && kk(t) == Sk;
}
var Ek = /\s/;
function Mk(t) {
  for (var e = t.length; e-- && Ek.test(t.charAt(e)); )
    ;
  return e;
}
var Ak = /^\s+/;
function Tk(t) {
  return t && t.slice(0, Mk(t) + 1).replace(Ak, "");
}
function mo(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var ff = NaN, Ok = /^[-+]0x[0-9a-f]+$/i, jk = /^0b[01]+$/i, Rk = /^0o[0-7]+$/i, Pk = parseInt;
function hf(t) {
  if (typeof t == "number")
    return t;
  if (Ck(t))
    return ff;
  if (mo(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = mo(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = Tk(t);
  var n = jk.test(t);
  return n || Rk.test(t) ? Pk(t.slice(2), n ? 2 : 8) : Ok.test(t) ? ff : +t;
}
var Ol = function() {
  return hm.Date.now();
}, Ik = "Expected a function", Lk = Math.max, Nk = Math.min;
function wi(t, e, n) {
  var r, s, i, o, l, a, c = 0, u = !1, f = !1, h = !0;
  if (typeof t != "function")
    throw new TypeError(Ik);
  e = hf(e) || 0, mo(n) && (u = !!n.leading, f = "maxWait" in n, i = f ? Lk(hf(n.maxWait) || 0, e) : i, h = "trailing" in n ? !!n.trailing : h);
  function m(p) {
    var v = r, w = s;
    return r = s = void 0, c = p, o = t.apply(w, v), o;
  }
  function y(p) {
    return c = p, l = setTimeout(C, e), u ? m(p) : o;
  }
  function b(p) {
    var v = p - a, w = p - c, _ = e - v;
    return f ? Nk(_, i - w) : _;
  }
  function x(p) {
    var v = p - a, w = p - c;
    return a === void 0 || v >= e || v < 0 || f && w >= i;
  }
  function C() {
    var p = Ol();
    if (x(p))
      return T(p);
    l = setTimeout(C, b(p));
  }
  function T(p) {
    return l = void 0, h && r ? m(p) : (r = s = void 0, o);
  }
  function O() {
    l !== void 0 && clearTimeout(l), c = 0, r = a = s = l = void 0;
  }
  function d() {
    return l === void 0 ? o : T(Ol());
  }
  function g() {
    var p = Ol(), v = x(p);
    if (r = arguments, s = this, a = p, v) {
      if (l === void 0)
        return y(a);
      if (f)
        return clearTimeout(l), l = setTimeout(C, e), m(a);
    }
    return l === void 0 && (l = setTimeout(C, e)), o;
  }
  return g.cancel = O, g.flush = d, g;
}
var zk = "Expected a function";
function $k(t, e, n) {
  var r = !0, s = !0;
  if (typeof t != "function")
    throw new TypeError(zk);
  return mo(n) && (r = "leading" in n ? !!n.leading : r, s = "trailing" in n ? !!n.trailing : s), wi(t, e, {
    leading: r,
    maxWait: e,
    trailing: s
  });
}
var Dk = !!(typeof window < "u" && window.document && window.document.createElement), Bk = Dk;
const mm = /* @__PURE__ */ sc(Bk);
var Er = function() {
  return Er = Object.assign || function(e) {
    for (var n, r = 1, s = arguments.length; r < s; r++) {
      n = arguments[r];
      for (var i in n)
        Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, Er.apply(this, arguments);
}, Sr = null, pf = null;
mm && window.addEventListener("resize", function() {
  pf !== window.devicePixelRatio && (pf = window.devicePixelRatio, Sr = null);
});
function mf() {
  if (Sr === null) {
    if (typeof document > "u")
      return Sr = 0, Sr;
    var t = document.body, e = document.createElement("div");
    e.classList.add("simplebar-hide-scrollbar"), t.appendChild(e);
    var n = e.getBoundingClientRect().right;
    t.removeChild(e), Sr = n;
  }
  return Sr;
}
function gm(t) {
  return !t || !t.ownerDocument || !t.ownerDocument.defaultView ? window : t.ownerDocument.defaultView;
}
function ym(t) {
  return !t || !t.ownerDocument ? document : t.ownerDocument;
}
var bm = function(t) {
  var e = {}, n = Array.prototype.reduce.call(t, function(r, s) {
    var i = s.name.match(/data-simplebar-(.+)/);
    if (i) {
      var o = i[1].replace(/\W+(.)/g, function(l, a) {
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
  }, e);
  return n;
};
function vm(t, e) {
  var n;
  t && (n = t.classList).add.apply(n, e.split(" "));
}
function wm(t, e) {
  t && e.split(" ").forEach(function(n) {
    t.classList.remove(n);
  });
}
function xm(t) {
  return ".".concat(t.split(" ").join("."));
}
var Hk = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getElementWindow: gm,
  getElementDocument: ym,
  getOptions: bm,
  addClasses: vm,
  removeClasses: wm,
  classNamesToQuery: xm
}), bn = gm, jl = ym, Fk = bm, vn = vm, wn = wm, pt = xm, go = (
  /** @class */
  function() {
    function t(e, n) {
      n === void 0 && (n = {});
      var r = this;
      if (this.removePreventClickId = null, this.minScrollbarWidth = 20, this.stopScrollDelay = 175, this.isScrolling = !1, this.isMouseEntering = !1, this.scrollXTicking = !1, this.scrollYTicking = !1, this.wrapperEl = null, this.contentWrapperEl = null, this.contentEl = null, this.offsetEl = null, this.maskEl = null, this.placeholderEl = null, this.heightAutoObserverWrapperEl = null, this.heightAutoObserverEl = null, this.rtlHelpers = null, this.scrollbarWidth = 0, this.resizeObserver = null, this.mutationObserver = null, this.elStyles = null, this.isRtl = null, this.mouseX = 0, this.mouseY = 0, this.onMouseMove = function() {
      }, this.onWindowResize = function() {
      }, this.onStopScrolling = function() {
      }, this.onMouseEntered = function() {
      }, this.onScroll = function() {
        var s = bn(r.el);
        r.scrollXTicking || (s.requestAnimationFrame(r.scrollX), r.scrollXTicking = !0), r.scrollYTicking || (s.requestAnimationFrame(r.scrollY), r.scrollYTicking = !0), r.isScrolling || (r.isScrolling = !0, vn(r.el, r.classNames.scrolling)), r.showScrollbar("x"), r.showScrollbar("y"), r.onStopScrolling();
      }, this.scrollX = function() {
        r.axis.x.isOverflowing && r.positionScrollbar("x"), r.scrollXTicking = !1;
      }, this.scrollY = function() {
        r.axis.y.isOverflowing && r.positionScrollbar("y"), r.scrollYTicking = !1;
      }, this._onStopScrolling = function() {
        wn(r.el, r.classNames.scrolling), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isScrolling = !1;
      }, this.onMouseEnter = function() {
        r.isMouseEntering || (vn(r.el, r.classNames.mouseEntered), r.showScrollbar("x"), r.showScrollbar("y"), r.isMouseEntering = !0), r.onMouseEntered();
      }, this._onMouseEntered = function() {
        wn(r.el, r.classNames.mouseEntered), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isMouseEntering = !1;
      }, this._onMouseMove = function(s) {
        r.mouseX = s.clientX, r.mouseY = s.clientY, (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseMoveForAxis("x"), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseMoveForAxis("y");
      }, this.onMouseLeave = function() {
        r.onMouseMove.cancel(), (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseLeaveForAxis("x"), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseLeaveForAxis("y"), r.mouseX = -1, r.mouseY = -1;
      }, this._onWindowResize = function() {
        r.scrollbarWidth = r.getScrollbarWidth(), r.hideNativeScrollbar();
      }, this.onPointerEvent = function(s) {
        if (!(!r.axis.x.track.el || !r.axis.y.track.el || !r.axis.x.scrollbar.el || !r.axis.y.scrollbar.el)) {
          var i, o;
          r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect(), r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect(), (r.axis.x.isOverflowing || r.axis.x.forceVisible) && (i = r.isWithinBounds(r.axis.x.track.rect)), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && (o = r.isWithinBounds(r.axis.y.track.rect)), (i || o) && (s.stopPropagation(), s.type === "pointerdown" && s.pointerType !== "touch" && (i && (r.axis.x.scrollbar.rect = r.axis.x.scrollbar.el.getBoundingClientRect(), r.isWithinBounds(r.axis.x.scrollbar.rect) ? r.onDragStart(s, "x") : r.onTrackClick(s, "x")), o && (r.axis.y.scrollbar.rect = r.axis.y.scrollbar.el.getBoundingClientRect(), r.isWithinBounds(r.axis.y.scrollbar.rect) ? r.onDragStart(s, "y") : r.onTrackClick(s, "y"))));
        }
      }, this.drag = function(s) {
        var i, o, l, a, c, u, f, h, m, y, b;
        if (!(!r.draggedAxis || !r.contentWrapperEl)) {
          var x, C = r.axis[r.draggedAxis].track, T = (o = (i = C.rect) === null || i === void 0 ? void 0 : i[r.axis[r.draggedAxis].sizeAttr]) !== null && o !== void 0 ? o : 0, O = r.axis[r.draggedAxis].scrollbar, d = (a = (l = r.contentWrapperEl) === null || l === void 0 ? void 0 : l[r.axis[r.draggedAxis].scrollSizeAttr]) !== null && a !== void 0 ? a : 0, g = parseInt((u = (c = r.elStyles) === null || c === void 0 ? void 0 : c[r.axis[r.draggedAxis].sizeAttr]) !== null && u !== void 0 ? u : "0px", 10);
          s.preventDefault(), s.stopPropagation(), r.draggedAxis === "y" ? x = s.pageY : x = s.pageX;
          var p = x - ((h = (f = C.rect) === null || f === void 0 ? void 0 : f[r.axis[r.draggedAxis].offsetAttr]) !== null && h !== void 0 ? h : 0) - r.axis[r.draggedAxis].dragOffset;
          p = r.draggedAxis === "x" && r.isRtl ? ((y = (m = C.rect) === null || m === void 0 ? void 0 : m[r.axis[r.draggedAxis].sizeAttr]) !== null && y !== void 0 ? y : 0) - O.size - p : p;
          var v = p / (T - O.size), w = v * (d - g);
          r.draggedAxis === "x" && r.isRtl && (w = !((b = t.getRtlHelpers()) === null || b === void 0) && b.isScrollingToNegative ? -w : w), r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = w;
        }
      }, this.onEndDrag = function(s) {
        var i = jl(r.el), o = bn(r.el);
        s.preventDefault(), s.stopPropagation(), wn(r.el, r.classNames.dragging), i.removeEventListener("mousemove", r.drag, !0), i.removeEventListener("mouseup", r.onEndDrag, !0), r.removePreventClickId = o.setTimeout(function() {
          i.removeEventListener("click", r.preventClick, !0), i.removeEventListener("dblclick", r.preventClick, !0), r.removePreventClickId = null;
        });
      }, this.preventClick = function(s) {
        s.preventDefault(), s.stopPropagation();
      }, this.el = e, this.options = Er(Er({}, t.defaultOptions), n), this.classNames = Er(Er({}, t.defaultOptions.classNames), n.classNames), this.axis = {
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
          scrollbar: { size: null, el: null, rect: null, isVisible: !1 }
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
          scrollbar: { size: null, el: null, rect: null, isVisible: !1 }
        }
      }, typeof this.el != "object" || !this.el.nodeName)
        throw new Error("Argument passed to SimpleBar must be an HTML element instead of ".concat(this.el));
      this.onMouseMove = $k(this._onMouseMove, 64), this.onWindowResize = wi(this._onWindowResize, 64, { leading: !0 }), this.onStopScrolling = wi(this._onStopScrolling, this.stopScrollDelay), this.onMouseEntered = wi(this._onMouseEntered, this.stopScrollDelay), this.init();
    }
    return t.getRtlHelpers = function() {
      if (t.rtlHelpers)
        return t.rtlHelpers;
      var e = document.createElement("div");
      e.innerHTML = '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
      var n = e.firstElementChild, r = n?.firstElementChild;
      if (!r)
        return null;
      document.body.appendChild(n), n.scrollLeft = 0;
      var s = t.getOffset(n), i = t.getOffset(r);
      n.scrollLeft = -999;
      var o = t.getOffset(r);
      return document.body.removeChild(n), t.rtlHelpers = {
        // determines if the scrolling is responding with negative values
        isScrollOriginAtZero: s.left !== i.left,
        // determines if the origin scrollbar position is inverted or not (positioned on left or right)
        isScrollingToNegative: i.left !== o.left
      }, t.rtlHelpers;
    }, t.prototype.getScrollbarWidth = function() {
      try {
        return this.contentWrapperEl && getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display === "none" || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style ? 0 : mf();
      } catch {
        return mf();
      }
    }, t.getOffset = function(e) {
      var n = e.getBoundingClientRect(), r = jl(e), s = bn(e);
      return {
        top: n.top + (s.pageYOffset || r.documentElement.scrollTop),
        left: n.left + (s.pageXOffset || r.documentElement.scrollLeft)
      };
    }, t.prototype.init = function() {
      mm && (this.initDOM(), this.rtlHelpers = t.getRtlHelpers(), this.scrollbarWidth = this.getScrollbarWidth(), this.recalculate(), this.initListeners());
    }, t.prototype.initDOM = function() {
      var e, n;
      this.wrapperEl = this.el.querySelector(pt(this.classNames.wrapper)), this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector(pt(this.classNames.contentWrapper)), this.contentEl = this.options.contentNode || this.el.querySelector(pt(this.classNames.contentEl)), this.offsetEl = this.el.querySelector(pt(this.classNames.offset)), this.maskEl = this.el.querySelector(pt(this.classNames.mask)), this.placeholderEl = this.findChild(this.wrapperEl, pt(this.classNames.placeholder)), this.heightAutoObserverWrapperEl = this.el.querySelector(pt(this.classNames.heightAutoObserverWrapperEl)), this.heightAutoObserverEl = this.el.querySelector(pt(this.classNames.heightAutoObserverEl)), this.axis.x.track.el = this.findChild(this.el, "".concat(pt(this.classNames.track)).concat(pt(this.classNames.horizontal))), this.axis.y.track.el = this.findChild(this.el, "".concat(pt(this.classNames.track)).concat(pt(this.classNames.vertical))), this.axis.x.scrollbar.el = ((e = this.axis.x.track.el) === null || e === void 0 ? void 0 : e.querySelector(pt(this.classNames.scrollbar))) || null, this.axis.y.scrollbar.el = ((n = this.axis.y.track.el) === null || n === void 0 ? void 0 : n.querySelector(pt(this.classNames.scrollbar))) || null, this.options.autoHide || (vn(this.axis.x.scrollbar.el, this.classNames.visible), vn(this.axis.y.scrollbar.el, this.classNames.visible));
    }, t.prototype.initListeners = function() {
      var e = this, n, r = bn(this.el);
      if (this.el.addEventListener("mouseenter", this.onMouseEnter), this.el.addEventListener("pointerdown", this.onPointerEvent, !0), this.el.addEventListener("mousemove", this.onMouseMove), this.el.addEventListener("mouseleave", this.onMouseLeave), (n = this.contentWrapperEl) === null || n === void 0 || n.addEventListener("scroll", this.onScroll), r.addEventListener("resize", this.onWindowResize), !!this.contentEl) {
        if (window.ResizeObserver) {
          var s = !1, i = r.ResizeObserver || ResizeObserver;
          this.resizeObserver = new i(function() {
            s && r.requestAnimationFrame(function() {
              e.recalculate();
            });
          }), this.resizeObserver.observe(this.el), this.resizeObserver.observe(this.contentEl), r.requestAnimationFrame(function() {
            s = !0;
          });
        }
        this.mutationObserver = new r.MutationObserver(function() {
          r.requestAnimationFrame(function() {
            e.recalculate();
          });
        }), this.mutationObserver.observe(this.contentEl, {
          childList: !0,
          subtree: !0,
          characterData: !0
        });
      }
    }, t.prototype.recalculate = function() {
      if (!(!this.heightAutoObserverEl || !this.contentEl || !this.contentWrapperEl || !this.wrapperEl || !this.placeholderEl)) {
        var e = bn(this.el);
        this.elStyles = e.getComputedStyle(this.el), this.isRtl = this.elStyles.direction === "rtl";
        var n = this.contentEl.offsetWidth, r = this.heightAutoObserverEl.offsetHeight <= 1, s = this.heightAutoObserverEl.offsetWidth <= 1 || n > 0, i = this.contentWrapperEl.offsetWidth, o = this.elStyles.overflowX, l = this.elStyles.overflowY;
        this.contentEl.style.padding = "".concat(this.elStyles.paddingTop, " ").concat(this.elStyles.paddingRight, " ").concat(this.elStyles.paddingBottom, " ").concat(this.elStyles.paddingLeft), this.wrapperEl.style.margin = "-".concat(this.elStyles.paddingTop, " -").concat(this.elStyles.paddingRight, " -").concat(this.elStyles.paddingBottom, " -").concat(this.elStyles.paddingLeft);
        var a = this.contentEl.scrollHeight, c = this.contentEl.scrollWidth;
        this.contentWrapperEl.style.height = r ? "auto" : "100%", this.placeholderEl.style.width = s ? "".concat(n || c, "px") : "auto", this.placeholderEl.style.height = "".concat(a, "px");
        var u = this.contentWrapperEl.offsetHeight;
        this.axis.x.isOverflowing = n !== 0 && c > n, this.axis.y.isOverflowing = a > u, this.axis.x.isOverflowing = o === "hidden" ? !1 : this.axis.x.isOverflowing, this.axis.y.isOverflowing = l === "hidden" ? !1 : this.axis.y.isOverflowing, this.axis.x.forceVisible = this.options.forceVisible === "x" || this.options.forceVisible === !0, this.axis.y.forceVisible = this.options.forceVisible === "y" || this.options.forceVisible === !0, this.hideNativeScrollbar();
        var f = this.axis.x.isOverflowing ? this.scrollbarWidth : 0, h = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
        this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > i - h, this.axis.y.isOverflowing = this.axis.y.isOverflowing && a > u - f, this.axis.x.scrollbar.size = this.getScrollbarSize("x"), this.axis.y.scrollbar.size = this.getScrollbarSize("y"), this.axis.x.scrollbar.el && (this.axis.x.scrollbar.el.style.width = "".concat(this.axis.x.scrollbar.size, "px")), this.axis.y.scrollbar.el && (this.axis.y.scrollbar.el.style.height = "".concat(this.axis.y.scrollbar.size, "px")), this.positionScrollbar("x"), this.positionScrollbar("y"), this.toggleTrackVisibility("x"), this.toggleTrackVisibility("y");
      }
    }, t.prototype.getScrollbarSize = function(e) {
      var n, r;
      if (e === void 0 && (e = "y"), !this.axis[e].isOverflowing || !this.contentEl)
        return 0;
      var s = this.contentEl[this.axis[e].scrollSizeAttr], i = (r = (n = this.axis[e].track.el) === null || n === void 0 ? void 0 : n[this.axis[e].offsetSizeAttr]) !== null && r !== void 0 ? r : 0, o = i / s, l;
      return l = Math.max(~~(o * i), this.options.scrollbarMinSize), this.options.scrollbarMaxSize && (l = Math.min(l, this.options.scrollbarMaxSize)), l;
    }, t.prototype.positionScrollbar = function(e) {
      var n, r, s;
      e === void 0 && (e = "y");
      var i = this.axis[e].scrollbar;
      if (!(!this.axis[e].isOverflowing || !this.contentWrapperEl || !i.el || !this.elStyles)) {
        var o = this.contentWrapperEl[this.axis[e].scrollSizeAttr], l = ((n = this.axis[e].track.el) === null || n === void 0 ? void 0 : n[this.axis[e].offsetSizeAttr]) || 0, a = parseInt(this.elStyles[this.axis[e].sizeAttr], 10), c = this.contentWrapperEl[this.axis[e].scrollOffsetAttr];
        c = e === "x" && this.isRtl && (!((r = t.getRtlHelpers()) === null || r === void 0) && r.isScrollOriginAtZero) ? -c : c, e === "x" && this.isRtl && (c = !((s = t.getRtlHelpers()) === null || s === void 0) && s.isScrollingToNegative ? c : -c);
        var u = c / (o - a), f = ~~((l - i.size) * u);
        f = e === "x" && this.isRtl ? -f + (l - i.size) : f, i.el.style.transform = e === "x" ? "translate3d(".concat(f, "px, 0, 0)") : "translate3d(0, ".concat(f, "px, 0)");
      }
    }, t.prototype.toggleTrackVisibility = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e].track.el, r = this.axis[e].scrollbar.el;
      !n || !r || !this.contentWrapperEl || (this.axis[e].isOverflowing || this.axis[e].forceVisible ? (n.style.visibility = "visible", this.contentWrapperEl.style[this.axis[e].overflowAttr] = "scroll", this.el.classList.add("".concat(this.classNames.scrollable, "-").concat(e))) : (n.style.visibility = "hidden", this.contentWrapperEl.style[this.axis[e].overflowAttr] = "hidden", this.el.classList.remove("".concat(this.classNames.scrollable, "-").concat(e))), this.axis[e].isOverflowing ? r.style.display = "block" : r.style.display = "none");
    }, t.prototype.showScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && !this.axis[e].scrollbar.isVisible && (vn(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !0);
    }, t.prototype.hideScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && this.axis[e].scrollbar.isVisible && (wn(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !1);
    }, t.prototype.hideNativeScrollbar = function() {
      this.offsetEl && (this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px", this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px");
    }, t.prototype.onMouseMoveForAxis = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e];
      !n.track.el || !n.scrollbar.el || (n.track.rect = n.track.el.getBoundingClientRect(), n.scrollbar.rect = n.scrollbar.el.getBoundingClientRect(), this.isWithinBounds(n.track.rect) ? (this.showScrollbar(e), vn(n.track.el, this.classNames.hover), this.isWithinBounds(n.scrollbar.rect) ? vn(n.scrollbar.el, this.classNames.hover) : wn(n.scrollbar.el, this.classNames.hover)) : (wn(n.track.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e)));
    }, t.prototype.onMouseLeaveForAxis = function(e) {
      e === void 0 && (e = "y"), wn(this.axis[e].track.el, this.classNames.hover), wn(this.axis[e].scrollbar.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e);
    }, t.prototype.onDragStart = function(e, n) {
      var r;
      n === void 0 && (n = "y");
      var s = jl(this.el), i = bn(this.el), o = this.axis[n].scrollbar, l = n === "y" ? e.pageY : e.pageX;
      this.axis[n].dragOffset = l - (((r = o.rect) === null || r === void 0 ? void 0 : r[this.axis[n].offsetAttr]) || 0), this.draggedAxis = n, vn(this.el, this.classNames.dragging), s.addEventListener("mousemove", this.drag, !0), s.addEventListener("mouseup", this.onEndDrag, !0), this.removePreventClickId === null ? (s.addEventListener("click", this.preventClick, !0), s.addEventListener("dblclick", this.preventClick, !0)) : (i.clearTimeout(this.removePreventClickId), this.removePreventClickId = null);
    }, t.prototype.onTrackClick = function(e, n) {
      var r = this, s, i, o, l;
      n === void 0 && (n = "y");
      var a = this.axis[n];
      if (!(!this.options.clickOnTrack || !a.scrollbar.el || !this.contentWrapperEl)) {
        e.preventDefault();
        var c = bn(this.el);
        this.axis[n].scrollbar.rect = a.scrollbar.el.getBoundingClientRect();
        var u = this.axis[n].scrollbar, f = (i = (s = u.rect) === null || s === void 0 ? void 0 : s[this.axis[n].offsetAttr]) !== null && i !== void 0 ? i : 0, h = parseInt((l = (o = this.elStyles) === null || o === void 0 ? void 0 : o[this.axis[n].sizeAttr]) !== null && l !== void 0 ? l : "0px", 10), m = this.contentWrapperEl[this.axis[n].scrollOffsetAttr], y = n === "y" ? this.mouseY - f : this.mouseX - f, b = y < 0 ? -1 : 1, x = b === -1 ? m - h : m + h, C = 40, T = function() {
          r.contentWrapperEl && (b === -1 ? m > x && (m -= C, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = m, c.requestAnimationFrame(T)) : m < x && (m += C, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = m, c.requestAnimationFrame(T)));
        };
        T();
      }
    }, t.prototype.getContentElement = function() {
      return this.contentEl;
    }, t.prototype.getScrollElement = function() {
      return this.contentWrapperEl;
    }, t.prototype.removeListeners = function() {
      var e = bn(this.el);
      this.el.removeEventListener("mouseenter", this.onMouseEnter), this.el.removeEventListener("pointerdown", this.onPointerEvent, !0), this.el.removeEventListener("mousemove", this.onMouseMove), this.el.removeEventListener("mouseleave", this.onMouseLeave), this.contentWrapperEl && this.contentWrapperEl.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onWindowResize), this.mutationObserver && this.mutationObserver.disconnect(), this.resizeObserver && this.resizeObserver.disconnect(), this.onMouseMove.cancel(), this.onWindowResize.cancel(), this.onStopScrolling.cancel(), this.onMouseEntered.cancel();
    }, t.prototype.unMount = function() {
      this.removeListeners();
    }, t.prototype.isWithinBounds = function(e) {
      return this.mouseX >= e.left && this.mouseX <= e.left + e.width && this.mouseY >= e.top && this.mouseY <= e.top + e.height;
    }, t.prototype.findChild = function(e, n) {
      var r = e.matches || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector;
      return Array.prototype.filter.call(e.children, function(s) {
        return r.call(s, n);
      })[0];
    }, t.rtlHelpers = null, t.defaultOptions = {
      forceVisible: !1,
      clickOnTrack: !0,
      scrollbarMinSize: 25,
      scrollbarMaxSize: 0,
      ariaLabel: "scrollable content",
      classNames: {
        contentEl: "simplebar-content",
        contentWrapper: "simplebar-content-wrapper",
        offset: "simplebar-offset",
        mask: "simplebar-mask",
        wrapper: "simplebar-wrapper",
        placeholder: "simplebar-placeholder",
        scrollbar: "simplebar-scrollbar",
        track: "simplebar-track",
        heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
        heightAutoObserverEl: "simplebar-height-auto-observer",
        visible: "simplebar-visible",
        horizontal: "simplebar-horizontal",
        vertical: "simplebar-vertical",
        hover: "simplebar-hover",
        dragging: "simplebar-dragging",
        scrolling: "simplebar-scrolling",
        scrollable: "simplebar-scrollable",
        mouseEntered: "simplebar-mouse-entered"
      },
      scrollableNode: null,
      contentNode: null,
      autoHide: !0
    }, t.getOptions = Fk, t.helpers = Hk, t;
  }()
), er = function() {
  return er = Object.assign || function(e) {
    for (var n, r = 1, s = arguments.length; r < s; r++) {
      n = arguments[r];
      for (var i in n)
        Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, er.apply(this, arguments);
}, Wk = {
  beforeUnmount: "beforeUnmount",
  unmount: "unmount"
}, Xr;
function Vk(t) {
  var e, n = t.h, r = t.emit, s = t.slots, i = t.props, o = function(a) {
    return r("scroll", a);
  }, l = er(er({}, go.defaultOptions.classNames), i.classNames);
  return n("div", er({ ref: "element" }, {
    "data-simplebar": "init"
  }), [
    n("div", {
      class: l.wrapper
    }, [
      n("div", { class: l.heightAutoObserverWrapperEl }, [
        n("div", { class: l.heightAutoObserverEl })
      ]),
      n("div", { class: l.mask }, [
        n("div", { class: l.offset }, [
          n("div", er(er({}, {
            onScroll: o,
            class: l.contentWrapper,
            tabIndex: 0,
            role: "region",
            "aria-label": i.ariaLabel || go.defaultOptions.ariaLabel
          }), { ref: "scrollElement" }), [
            n("div", { class: l.contentEl, ref: "contentElement" }, (e = s.default) === null || e === void 0 ? void 0 : e.call(s))
          ])
        ])
      ]),
      n("div", { class: l.placeholder })
    ]),
    n("div", { class: "".concat(l.track, " simplebar-horizontal") }, [
      n("div", { class: l.scrollbar })
    ]),
    n("div", { class: "".concat(l.track, " simplebar-vertical") }, [
      n("div", { class: l.scrollbar })
    ])
  ]);
}
var Kk = /* @__PURE__ */ Xe((Xr = {
  name: "simplebar-vue",
  props: {
    /**
     * By default SimpleBar automatically hides the scrollbar if the user is not scrolling
     * (it emulates Mac OSX Lion's scrollbar). You can make the scrollbar always visible
     * by passing `false`.
     *
     * Default value is `true`.
     *
     * You can also control the animation via CSS as it's a simple CSS opacity transition.
     */
    autoHide: { type: Boolean, default: void 0 },
    /**
     * It is possible to change the default class names that SimpleBar uses.
     * To get your own styles to work refer to simplebar.css to get an idea how to setup your css.
     * - `content` represents the wrapper for the content being scrolled.
     * - `scrollContent` represents the container containing the elements being scrolled.
     * - `scrollbar` defines the style of the scrollbar with which the user can interact to scroll the content.
     * - `track` styles the area surrounding the `scrollbar`.
     *
     * ```js
     * classNames: {
     *   // defaults
     *   content: 'simplebar-content',
     *   scrollContent: 'simplebar-scroll-content',
     *   scrollbar: 'simplebar-scrollbar',
     *   track: 'simplebar-track'
     * }
     * ```
     */
    classNames: Object,
    /**
     * Force the track to be visible (same behaviour as `overflow: scroll`).
     * Can be `boolean | 'x' | 'y'`, defaults to `false`, which behaves like `overflow: auto`.
     */
    forceVisible: {
      type: [Boolean, String],
      validator: function(t) {
        return typeof t == "boolean" || t === "x" || t === "y";
      },
      default: void 0
    },
    /**
     * Set custom aria-label attribute for users with screen reader.
     */
    ariaLabel: String,
    /**
     * Activate RTL support by passing `'rtl'`.
     * You will also need a css rule with `direction: rtl`.
     */
    direction: {
      type: String,
      validator: function(t) {
        return t === "ltr" || t === "rtl";
      }
    },
    /**
     * Define the delay until the scrollbar hides. Has no effect if `autoHide` is `false`.
     * Default value is `1000`.
     */
    timeout: Number,
    /**
     * Controls the click on track behaviour.
     * Default to `true`.
     */
    clickOnTrack: { type: Boolean, default: void 0 },
    /**
     * Controls the min size of the scrollbar in `px`.
     * Default is `25`.
     */
    scrollbarMinSize: Number,
    /**
     * Controls the max size of the scrollbar in `px`.
     * Default is `0` (no max size).
     */
    scrollbarMaxSize: Number
  },
  // @ts-ignore
  emits: ["scroll"],
  /**
   * @returns {{ SimpleBar?: SimpleBar; scrollElement?: HTMLDivElement; contentElement?: HTMLDivElement }}
   */
  data: function() {
    return {};
  },
  mounted: function() {
    for (var t = go.getOptions(this.$refs.element.attributes), e = 0, n = Object.entries(this.$props); e < n.length; e++) {
      var r = n[e], s = r[0], i = r[1];
      i != null && typeof i != "function" && (t[s] = i);
    }
    this.SimpleBar = new go(this.$refs.element, t), this.scrollElement = this.$refs.scrollElement, this.contentElement = this.$refs.contentElement;
  }
}, Xr[Wk.beforeUnmount] = function() {
  var t;
  (t = this.SimpleBar) === null || t === void 0 || t.unMount(), this.SimpleBar = void 0;
}, Xr.methods = {
  recalculate: function() {
    var t;
    (t = this.SimpleBar) === null || t === void 0 || t.recalculate();
  }
}, /**
 * Note that createElement argument is only provided in <=vue@2.7.x,
 * in other versions it's a context object that we do not use.
 */
Xr.render = function(t) {
  var e = this;
  return Vk({
    h: typeof t == "function" ? t : Po,
    // @ts-ignore
    emit: function() {
      for (var n = [], r = 0; r < arguments.length; r++)
        n[r] = arguments[r];
      return e.$emit.apply(e, n);
    },
    // @ts-ignore
    slots: this.$slots,
    props: this.$props
  });
}, Xr));
const Uk = /* @__PURE__ */ Xe({
  name: "Column",
  components: {
    Simplebar: Kk
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  }
}), qk = { class: "px-4 py-6 sm:px-0" }, Gk = { class: "text-lg leading-6 font-medium text-gray-900" }, Jk = { class: "mt-1 text-sm text-gray-500" };
function Yk(t, e, n, r, s, i) {
  const o = Ce("Simplebar");
  return Z(), We(o, {
    class: "flex-none transition ease-in-out duration-500 py-6 sm:px-6 lg:px-8",
    transition: "expand"
  }, {
    default: yt(() => [
      le("div", qk, [
        le("h3", Gk, at(t.title), 1),
        le("p", Jk, at(t.description), 1)
      ]),
      Cr(t.$slots, "default")
    ]),
    _: 3
  });
}
const km = /* @__PURE__ */ rt(Uk, [["render", Yk]]), Xk = /* @__PURE__ */ Xe({
  name: "WorkOrderList",
  components: {
    WorkOrderWidget: dk,
    Column: km
  },
  props: {
    workOrders: {
      type: Array,
      default: () => []
    },
    selectedWorkOrder: Object
  },
  methods: {
    selectWorkOrder(t) {
      this.selectedWorkOrder && this.selectedWorkOrder.name === t.name ? (this.$emit("select", null), this.isSelected = !1) : this.$emit("select", t);
    }
  }
});
function Qk(t, e, n, r, s, i) {
  const o = Ce("WorkOrderWidget"), l = Ce("Column");
  return Z(), We(l, {
    class: $t({ "w-full": !t.selectedWorkOrder, "w-1/2": t.selectedWorkOrder }),
    title: "Work Orders",
    description: "Select a work order to view job cards"
  }, {
    default: yt(() => [
      le("div", null, [
        (Z(!0), pe(Pe, null, Ao(t.workOrders, (a) => (Z(), We(o, {
          key: a.name,
          workOrder: a,
          isSelected: t.selectedWorkOrder && t.selectedWorkOrder.name === a.name,
          onClick: (c) => t.selectWorkOrder(a)
        }, null, 8, ["workOrder", "isSelected", "onClick"]))), 128))
      ])
    ]),
    _: 1
  }, 8, ["class"]);
}
const Zk = /* @__PURE__ */ rt(Xk, [["render", Qk]]), e_ = {
  name: "Button",
  props: {
    text: String,
    label: String
  },
  methods: {
    updatelabel(t) {
      console.log(t), t === "Work In Progress" ? console.log("Good so far") : t === "Completed" && console.log("Good so far 2");
    },
    starttimer() {
      console.log("aye yo");
    },
    stoptimer() {
      console.log("aye yo yo");
    }
  }
};
function t_(t, e, n, r, s, i) {
  return Z(), pe(Pe, null, [
    le("button", {
      class: "btn",
      onClick: e[0] || (e[0] = (...o) => i.starttimer && i.starttimer(...o))
    }, "Start"),
    le("button", {
      class: "btn",
      onClick: e[1] || (e[1] = (...o) => i.stoptimer && i.stoptimer(...o))
    }, "Stop")
  ], 64);
}
const n_ = /* @__PURE__ */ rt(e_, [["render", t_], ["__scopeId", "data-v-dbc45126"]]), r_ = /* @__PURE__ */ Xe({
  name: "JobCardWidget",
  components: {
    Button: n_,
    Card: qo,
    TimerWidget: fm
  },
  props: {
    jobCard: {
      type: Object,
      default: () => {
      }
    },
    employee_id: String
  },
  methods: {}
}), s_ = { class: "w-2/5" };
function i_(t, e, n, r, s, i) {
  const o = Ce("TimerWidget"), l = Ce("Card");
  return Z(), We(l, { class: "flex flex-row font-sans text-black text-lg lg:text-4xl" }, {
    default: yt(() => [
      le("div", s_, at(t.jobCard.operation), 1),
      ye(o, {
        class: "w-3/5",
        jobCard: t.jobCard,
        employee_id: t.employee_id
      }, null, 8, ["jobCard", "employee_id"])
    ]),
    _: 1
  });
}
const o_ = /* @__PURE__ */ rt(r_, [["render", i_]]), l_ = /* @__PURE__ */ Xe({
  name: "JobCards",
  components: {
    JobCardWidget: o_,
    Column: km
  },
  props: {
    jobCards: {
      type: Array,
      default: () => []
    },
    employee_id: String
  },
  data() {
    return {
      jobCard: []
    };
  },
  methods: {},
  mounted() {
  }
}), a_ = { id: "JobCards" };
function c_(t, e, n, r, s, i) {
  const o = Ce("JobCardWidget"), l = Ce("Column");
  return Z(), We(l, {
    title: "Job Cards",
    description: "Select a job card to start the timer",
    class: "w-1/2"
  }, {
    default: yt(() => [
      le("div", a_, [
        (Z(!0), pe(Pe, null, Ao(t.jobCards, (a) => (Z(), We(o, {
          name: "job_card_widget",
          key: a.name,
          jobCard: a,
          employee_id: t.employee_id
        }, null, 8, ["jobCard", "employee_id"]))), 128))
      ])
    ]),
    _: 1
  });
}
const u_ = /* @__PURE__ */ rt(l_, [["render", c_]]), d_ = /* @__PURE__ */ Xe({
  name: "Employee List",
  components: {
    Card: qo
  },
  inheritAttrs: !1,
  props: {
    employees: {
      type: Array
    }
  },
  data() {
    return {
      employee: ""
    };
  },
  methods: {
    send_employee(t) {
      this.$emit("send_employee", t);
    }
  }
}), f_ = { class: "flex-row overflow-x-auto w-screen" }, h_ = { class: "text-4xl center font-thin" };
function p_(t, e, n, r, s, i) {
  const o = Ce("Card");
  return Z(), pe("div", f_, [
    (Z(!0), pe(Pe, null, Ao(t.employees, (l) => (Z(), We(o, {
      class: "w-full p-4 m-4 bg-white shadow-lg rounded-lg box-border h-20 hover:bg-blue-300 justify_content:center",
      key: l.id,
      onClick: (a) => t.send_employee(l)
    }, {
      default: yt(() => [
        le("h1", h_, at(l.name), 1)
      ]),
      _: 2
    }, 1032, ["onClick"]))), 128))
  ]);
}
const _m = /* @__PURE__ */ rt(d_, [["render", p_]]), m_ = /* @__PURE__ */ Xe({
  name: "LogInModule",
  components: {
    Card: qo,
    Button: yy
  },
  data() {
    return {
      email: "",
      password: "",
      authenticated: !1,
      error_message: "",
      return_triggered: !1
    };
  },
  methods: {
    // This should be a server call to verify user and password.
    async submit_login(t, e) {
      (await Xt("timeclock.www.job_timeclock.verify_login", t))?.status === "success" ? (this.verified = !0, this.authenticated = !0, this.$emit("submit_login", this.authenticated)) : (this.error_message = "Incorrect Login and/or Password. Please try again.", this.password = "");
    },
    return_trigger() {
      this.return_triggered = !0, this.$emit("return_triggered", this.return_triggered);
    }
  },
  unmounted() {
    this.password = "", this.verified = !1, this.error_message = "", this.return_triggered = !1;
  }
}), Sm = (t) => (qa("data-v-fea387e5"), t = t(), Ga(), t), g_ = { class: "backdrop" }, y_ = /* @__PURE__ */ Sm(() => /* @__PURE__ */ le("h3", null, "Username:", -1)), b_ = /* @__PURE__ */ Sm(() => /* @__PURE__ */ le("h3", null, "Password:", -1));
function v_(t, e, n, r, s, i) {
  const o = Ce("Card");
  return Z(), pe("div", g_, [
    ye(o, { class: "card" }, {
      default: yt(() => [
        y_,
        Ln(),
        au(le("input", {
          type: "email",
          required: "",
          "onUpdate:modelValue": e[0] || (e[0] = (l) => t.email = l)
        }, null, 512), [
          [zu, t.email]
        ]),
        b_,
        Ln(),
        au(le("input", {
          type: "password",
          required: "",
          "onUpdate:modelValue": e[1] || (e[1] = (l) => t.password = l)
        }, null, 512), [
          [zu, t.password]
        ]),
        Ln(" " + at(this.error_message) + " ", 1),
        le("button", {
          class: "btn",
          onClick: e[2] || (e[2] = (l) => t.submit_login(this.email, this.password))
        }, " Submit "),
        le("button", {
          class: "btn",
          onClick: e[3] || (e[3] = (...l) => t.return_trigger && t.return_trigger(...l))
        }, " Return ")
      ]),
      _: 1
    })
  ]);
}
const w_ = /* @__PURE__ */ rt(m_, [["render", v_], ["__scopeId", "data-v-fea387e5"]]), x_ = /* @__PURE__ */ Xe({
  name: "StartScreen",
  components: {
    EmployeeList: _m,
    LogInModule: w_,
    AuthorizationMessage: dm
  },
  props: {
    employees: {
      type: Array
    }
  },
  data() {
    return {
      log_in: !1,
      authenticated: !1
    };
  },
  methods: {
    log_in_module() {
      console.log("logged in dude."), this.log_in = !0;
    },
    // Return from log in menu if accidentally clicked, or log in failed.
    return_triggered(t) {
      t && (this.log_in = !1, console.log("aye"));
    },
    send_login(t) {
      this.$emit("send_login", t);
    },
    return_auth(t) {
      console.log("dope"), this.authenticated = t, this.log_in = !1;
    },
    return_employee(t) {
      this.$emit("send_employee", t);
    }
  },
  mounted() {
    const t = onScan.attachTo(document, {
      onScan: this.send_scan,
      ignoreIfFocusOn: ".frappe-input"
    });
    this.scanner = t, console.log(this.employees);
  },
  unmounted() {
    this.employees = [], this.log_in = !1;
  }
}), qc = (t) => (qa("data-v-5fe76613"), t = t(), Ga(), t), k_ = {
  key: 0,
  class: "h-screen flex flex-col justify-around items-center"
}, __ = /* @__PURE__ */ qc(() => /* @__PURE__ */ le("p", { class: "text-4xl" }, "or", -1)), S_ = { key: 1 }, C_ = { key: 2 }, E_ = /* @__PURE__ */ qc(() => /* @__PURE__ */ le("h1", { class: "text-3xl font-bold top-50" }, "Employee List", -1)), M_ = /* @__PURE__ */ qc(() => /* @__PURE__ */ le("p", null, "Click who you are:", -1));
function A_(t, e, n, r, s, i) {
  const o = Ce("AuthorizationMessage"), l = Ce("LogInModule"), a = Ce("EmployeeList");
  return Z(), pe(Pe, null, [
    t.log_in === !1 && this.authenticated === !1 ? (Z(), pe("div", k_, [
      le("button", {
        class: "bg-green-300 rounded-full text-center-white me-2 mb-2 px-5 py-2 active:bg-green-500 focus:outline-none focus:ring focus:ring-green-200",
        onClick: e[0] || (e[0] = (...c) => t.log_in_module && t.log_in_module(...c))
      }, "ERP Log In"),
      __,
      ye(o)
    ])) : Ge("", !0),
    t.log_in ? (Z(), pe("div", S_, [
      ye(l, {
        onReturn_triggered: t.return_triggered,
        onSubmit_login: t.return_auth
      }, null, 8, ["onReturn_triggered", "onSubmit_login"])
    ])) : Ge("", !0),
    t.log_in === !1 && this.authenticated ? (Z(), pe("div", C_, [
      E_,
      M_,
      ye(a, {
        employees: t.employees,
        onSend_employee: t.return_employee
      }, null, 8, ["employees", "onSend_employee"])
    ])) : Ge("", !0)
  ], 64);
}
const T_ = /* @__PURE__ */ rt(x_, [["render", A_], ["__scopeId", "data-v-5fe76613"]]), O_ = /* @__PURE__ */ Xe({
  name: "DropdownMenu",
  components: {
    MenuItems: sy,
    MenuItem: iy,
    Menu: ny,
    MenuButton: ry
  },
  data() {
    return {
      // The local data property that holds the selected option
      // Should be workstation getting sent over.
      selected: "Workstation",
      // The state that controls the visibility of the menu
      active: !1,
      workstations: [{ id: 1, name: "Planer" }, { id: 2, name: "CNC" }, { id: 3, name: "Hand Sanding" }, { id: 4, name: "Sander/Stainer" }, { id: 5, name: "Truss Assembly" }, { id: 6, name: "Hardware" }, { id: 7, name: "T&G Cutting" }],
      workstation_name: "Workstation"
    };
  },
  watch: {
    // The watcher that emits an event to the parent component when the selected option changes
    selected(t) {
      this.$emit("set_workstation", t);
    }
  },
  methods: {
    // The method that toggles the active state and shows or hides the menu
    toggle() {
      this.active = !this.active;
    },
    send_workstation(t) {
      console.log(t.name);
    }
  },
  mounted() {
    console.log("Dropdown Working.");
  }
}), j_ = { class: "z-100" }, R_ = { class: "py-1 text-3xl" };
function P_(t, e, n, r, s, i) {
  const o = Ce("MenuButton"), l = Ce("MenuItem"), a = Ce("MenuItems"), c = Ce("Menu");
  return Z(), We(c, {
    as: "div",
    class: "relative inline-block text-left"
  }, {
    default: yt(() => [
      le("div", j_, [
        ye(o, { class: "bg-teal-500 hover:bg-teal-700 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100" }, {
          default: yt(() => [
            Ln(at(this.selected), 1)
          ]),
          _: 1
        })
      ]),
      ye(Io, {
        "enter-active-class": "transition ease-out duration-100",
        "enter-from-class": "transform opacity-90 scale-95",
        "enter-to-class": "transform opacity-100 scale-100",
        "leave-active-class": "transition ease-in duration-75",
        "leave-from-class": "transform opacity-100 scale-100",
        "leave-to-class": "transform opacity-0 scale-95"
      }, {
        default: yt(() => [
          ye(a, { class: "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" }, {
            default: yt(() => [
              le("div", R_, [
                (Z(!0), pe(Pe, null, Ao(this.workstations, (u) => (Z(), We(l, {
                  key: u,
                  onClick: (f) => t.send_workstation(u)
                }, {
                  default: yt(({ active: f }) => [
                    le("a", {
                      href: "#",
                      class: $t([f ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-3xl"])
                    }, at(u.name), 3)
                  ]),
                  _: 2
                }, 1032, ["onClick"]))), 128))
              ])
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ]),
    _: 1
  });
}
const I_ = /* @__PURE__ */ rt(O_, [["render", P_]]), L_ = /* @__PURE__ */ Xe({
  name: "JobTimeClock",
  components: {
    AuthorizationMessage: dm,
    JobCardList: u_,
    SessionTimer: Xx,
    TimerWidget: fm,
    WorkOrderList: Zk,
    EmployeeList: _m,
    StartScreen: T_,
    DropDownMenu: I_
  },
  data() {
    return {
      employeeId: "",
      employeeName: "",
      header: "Job Timeclock",
      jobCards: [],
      selectedWorkOrder: null,
      showAuthMessage: !1,
      token: y0("token", null),
      tokenExpiration: 0,
      workOrders: [],
      activeSession: !1,
      employeeLoggedIn: !1,
      employees: [],
      active_dropdown: !1
    };
  },
  // computed: {
  //     isSessionActive() {
  //         const currentTime = Date.now();
  //         // console.log(currentTime);
  //         // console.log(this.tokenExpiration);
  //         if((this.tokenExpiration) && (this.tokenExpiration > currentTime)){
  //             console.log('Logged in');
  //             return true
  //         } else {
  //             console.log('session was not activated');
  //             return false
  //         }
  //         // return (this.tokenExpiration && this.tokenExpiration > currentTime) as boolean;
  //     }
  // },
  methods: {
    async check_for_erp_log_in() {
      const t = await Xt("timeclock.www.job_timeclock.check_for_erp_log_in", {});
      t.user_id === "Guest" ? console.log(t.user_id) : console.log("Session logged in", t.user_id);
    },
    // async test_erp_log_in(){
    //     const response = await FrappeCall('login', { usr: 'Administrator', pwd: 'admin' });
    //     console.log(response);
    // },
    async authenticateEmployee(t) {
      this.activeSession === !0 && (this.setSessionFalse, this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "");
      const e = await Xt("timeclock.www.job_timeclock.authenticate_employee", { rfid: t });
      e?.status === "success" ? (this.token = e.token, this.activeSession = !0, e.last_checkin === "OUT" ? this.log_employee_in(this.token) : this.employeeLoggedIn = !0, await this.getWorkOrders()) : (console.log("Sorry! You are not authenticated."), console.log(e.message), this.activeSession = !1, this.setSessionFalse, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "");
    },
    async decodeToken() {
      const t = w0(this.token);
      this.tokenExpiration = t.exp * 1e3, this.employeeId = t.employee_id, this.employeeName = t.employee_name, console.log("Hurrah! You are authenticated as ", t.employee_name);
      const e = Date.now(), n = this.tokenExpiration - e;
      this.resetTimer(n);
    },
    async getWorkOrders() {
      const t = await Xt("timeclock.www.job_timeclock.get_work_orders", { token: this.token });
      t?.status === "success" ? (this.token = t.token, this.workOrders = t.work_orders) : (this.workOrders = [], this.activeSession = !1);
    },
    selectWorkOrder(t) {
      this.selectedWorkOrder = t, this.getJobCards(t.name);
    },
    async getJobCards(t) {
      const e = await Xt("timeclock.www.job_timeclock.get_job_cards", { token: this.token, work_order: t });
      e?.status === "success" ? (this.token = e.token, this.jobCards = e.job_cards, this.time_logs = e.time_logs) : (this.jobCards = [], this.activeSession = !1);
    },
    // These functions are to turn off the session once it is done. 
    setSessionFalse() {
      this.activeSession = !1, console.log("Logged out of Job Time Clock Session");
    },
    startTimer(t) {
      setTimeout(this.endTimer, t);
    },
    endTimer() {
      this.setSessionFalse, this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "";
    },
    resetTimer(t) {
      clearTimeout(this.timeoutId), this.startTimer(t);
    },
    async log_employee_in(t) {
      this.date = /* @__PURE__ */ new Date();
      const e = this.date.getUTCFullYear(), n = this.date.getUTCMonth() + 1, r = this.date.getUTCDate(), s = this.date.getUTCHours(), i = this.date.getUTCMinutes();
      this.date.getUTCSeconds();
      const o = (c) => c < 10 ? "0" + c : c, l = `${e}-${o(n)}-${o(r)} ${o(s - 5)}:${o(i)}`;
      (await Xt("timeclock.www.job_timeclock.log_in_employee", { token: t, time: l }))?.status === "success" ? console.log("You are now logged in.") : console.log("did not work. You are still logged out:");
    },
    switchEmployee() {
      this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "";
    },
    async log_out_employee(t) {
      const e = /* @__PURE__ */ new Date(), n = e.getUTCFullYear(), r = e.getUTCMonth() + 1, s = e.getUTCDate(), i = e.getUTCHours(), o = e.getUTCMinutes();
      e.getUTCSeconds();
      const l = (u) => u < 10 ? "0" + u : u, a = `${n}-${l(r)}-${l(s)} ${l(i - 5)}:${l(o)}`, c = await Xt("timeclock.www.job_timeclock.log_out_employee", { token: t, time: a });
      c?.status === "success" ? (console.log("You are now logged out.", c.log), this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "", this.employees = []) : console.log("Did not work. You are still logged in:", c.log);
    },
    async get_employees() {
      const t = await Xt("timeclock.www.job_timeclock.get_employees");
      t?.status === "success" && (this.employees = t.employees);
    },
    get_token_from_employee(t) {
      this.authenticateEmployee(t.sCode);
    },
    // To receive send_login Emit from StartScreen.vue
    receive_login(t) {
      console.log("Receive login succeeded: ", t), this.authenticateEmployee(t);
    },
    refresh_page() {
      window.location.reload(), console.log("Page reloaded.");
    },
    show_dropdown() {
      this.active_dropdown = !0, console.log("drop down:", this.active_dropdown);
    },
    select_workstation(t) {
      console.log("Workstation Name", t);
    }
  },
  mounted() {
    this.token && this.getWorkOrders(), this.check_for_erp_log_in(), this.employees = this.get_employees();
    const t = k0.attachTo(document, {
      onScan: this.authenticateEmployee,
      ignoreIfFocusOn: ".frappe-input"
    });
    this.scanner = t, jr(
      () => this.token,
      (e) => {
        e !== this.token ? this.decodeToken() : e && this.decodeToken();
      },
      { immediate: !0 }
    );
  }
}), N_ = { class: "h-screen flex flex-col" }, z_ = { class: "block rounded-lg bg-gray-300 fixed w-screen" }, $_ = { class: "mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between" }, D_ = {
  key: 0,
  class: "h-screen overflow-hidden pt-16 z-1"
}, B_ = { key: 1 };
function H_(t, e, n, r, s, i) {
  const o = Ce("DropDownMenu"), l = Ce("SessionTimer"), a = Ce("WorkOrderList"), c = Ce("JobCardList"), u = Ce("AuthorizationMessage");
  return Z(), pe("div", N_, [
    le("header", z_, [
      le("div", $_, [
        le("button", {
          class: "text-4xl font-bold tracking-tight text-gray-900",
          onClick: e[0] || (e[0] = (...f) => t.refresh_page && t.refresh_page(...f))
        }, at(t.header), 1),
        t.activeSession ? (Z(), pe("button", {
          key: 0,
          class: "z-1 bg-teal-300 hover:bg-teal-400 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100",
          onClick: e[1] || (e[1] = (f) => t.log_out_employee(this.token))
        }, "Clock Out")) : Ge("", !0),
        t.activeSession ? (Z(), We(o, {
          key: 1,
          onSelect_workstation: t.select_workstation
        }, null, 8, ["onSelect_workstation"])) : Ge("", !0),
        t.activeSession ? (Z(), pe("button", {
          key: 2,
          class: "bg-green-500 hover:bg-green-600 text-white font-normal lg:text-3xl py-4 px-4 rounded ring-2 ring-offset-1 ring-gray-100",
          onClick: e[2] || (e[2] = (...f) => t.switchEmployee && t.switchEmployee(...f))
        }, "Switch Employee")) : Ge("", !0),
        t.activeSession ? (Z(), We(l, {
          key: 3,
          employeeName: t.employeeName,
          tokenExpiration: t.tokenExpiration
        }, null, 8, ["employeeName", "tokenExpiration"])) : Ge("", !0)
      ])
    ]),
    t.activeSession ? (Z(), pe("main", D_, [
      ye(a, {
        workOrders: t.workOrders,
        selectedWorkOrder: t.selectedWorkOrder,
        onSelect: t.selectWorkOrder
      }, null, 8, ["workOrders", "selectedWorkOrder", "onSelect"]),
      ye(Io, { name: "job_card_list" }, {
        default: yt(() => [
          t.selectedWorkOrder ? (Z(), We(c, {
            key: 0,
            name: "job_cards_comp",
            jobCards: t.jobCards,
            employee_id: this.employeeId
          }, null, 8, ["jobCards", "employee_id"])) : Ge("", !0)
        ]),
        _: 1
      })
    ])) : (Z(), pe("main", B_, [
      ye(u),
      ye(o, { onSelect_workstation: t.select_workstation }, null, 8, ["onSelect_workstation"])
    ]))
  ]);
}
const F_ = /* @__PURE__ */ rt(L_, [["render", H_], ["__scopeId", "data-v-854bc792"]]);
let W_ = Xg(F_);
W_.mount("#app");
