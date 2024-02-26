/**
* @vue/shared v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function fa(t, e) {
  const n = new Set(t.split(","));
  return e ? (r) => n.has(r.toLowerCase()) : (r) => n.has(r);
}
const ve = {}, xr = [], bt = () => {
}, qp = () => !1, lo = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // uppercase letter
(t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97), ha = (t) => t.startsWith("onUpdate:"), He = Object.assign, pa = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Gp = Object.prototype.hasOwnProperty, he = (t, e) => Gp.call(t, e), ee = Array.isArray, _r = (t) => ao(t) === "[object Map]", Wd = (t) => ao(t) === "[object Set]", oe = (t) => typeof t == "function", Le = (t) => typeof t == "string", Ir = (t) => typeof t == "symbol", we = (t) => t !== null && typeof t == "object", Kd = (t) => (we(t) || oe(t)) && oe(t.then) && oe(t.catch), Ud = Object.prototype.toString, ao = (t) => Ud.call(t), Jp = (t) => ao(t).slice(8, -1), qd = (t) => ao(t) === "[object Object]", ma = (t) => Le(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Yr = /* @__PURE__ */ fa(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), co = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Yp = /-(\w)/g, Yt = co((t) => t.replace(Yp, (e, n) => n ? n.toUpperCase() : "")), Xp = /\B([A-Z])/g, Nr = co(
  (t) => t.replace(Xp, "-$1").toLowerCase()
), uo = co((t) => t.charAt(0).toUpperCase() + t.slice(1)), Lo = co((t) => t ? `on${uo(t)}` : ""), Tn = (t, e) => !Object.is(t, e), Zs = (t, e) => {
  for (let n = 0; n < t.length; n++)
    t[n](e);
}, fi = (t, e, n) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, gl = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, Qp = (t) => {
  const e = Le(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let Oc;
const Gd = () => Oc || (Oc = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ga(t) {
  if (ee(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = Le(r) ? nm(r) : ga(r);
      if (s)
        for (const i in s)
          e[i] = s[i];
    }
    return e;
  } else if (Le(t) || we(t))
    return t;
}
const Zp = /;(?![^(]*\))/g, em = /:([^]+)/, tm = /\/\*[^]*?\*\//g;
function nm(t) {
  const e = {};
  return t.replace(tm, "").split(Zp).forEach((n) => {
    if (n) {
      const r = n.split(em);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function Ut(t) {
  let e = "";
  if (Le(t))
    e = t;
  else if (ee(t))
    for (let n = 0; n < t.length; n++) {
      const r = Ut(t[n]);
      r && (e += r + " ");
    }
  else if (we(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
const rm = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", sm = /* @__PURE__ */ fa(rm);
function Jd(t) {
  return !!t || t === "";
}
const ft = (t) => Le(t) ? t : t == null ? "" : ee(t) || we(t) && (t.toString === Ud || !oe(t.toString)) ? JSON.stringify(t, Yd, 2) : String(t), Yd = (t, e) => e && e.__v_isRef ? Yd(t, e.value) : _r(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce(
    (n, [r, s], i) => (n[Po(r, i) + " =>"] = s, n),
    {}
  )
} : Wd(e) ? {
  [`Set(${e.size})`]: [...e.values()].map((n) => Po(n))
} : Ir(e) ? Po(e) : we(e) && !ee(e) && !qd(e) ? String(e) : e, Po = (t, e = "") => {
  var n;
  return Ir(t) ? `Symbol(${(n = t.description) != null ? n : e})` : t;
};
let mt;
class im {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this.parent = mt, !e && mt && (this.index = (mt.scopes || (mt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(e) {
    if (this._active) {
      const n = mt;
      try {
        return mt = this, e();
      } finally {
        mt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    mt = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    mt = this.parent;
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
function om(t, e = mt) {
  e && e.active && e.effects.push(t);
}
function Xd() {
  return mt;
}
function lm(t) {
  mt && mt.cleanups.push(t);
}
let Qn;
class ya {
  constructor(e, n, r, s) {
    this.fn = e, this.trigger = n, this.scheduler = r, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, om(this, s);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1, Ln();
      for (let e = 0; e < this._depsLength; e++) {
        const n = this.deps[e];
        if (n.computed && (am(n.computed), this._dirtyLevel >= 4))
          break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), Pn();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(e) {
    this._dirtyLevel = e ? 4 : 0;
  }
  run() {
    if (this._dirtyLevel = 0, !this.active)
      return this.fn();
    let e = En, n = Qn;
    try {
      return En = !0, Qn = this, this._runnings++, Rc(this), this.fn();
    } finally {
      Lc(this), this._runnings--, Qn = n, En = e;
    }
  }
  stop() {
    var e;
    this.active && (Rc(this), Lc(this), (e = this.onStop) == null || e.call(this), this.active = !1);
  }
}
function am(t) {
  return t.value;
}
function Rc(t) {
  t._trackId++, t._depsLength = 0;
}
function Lc(t) {
  if (t.deps.length > t._depsLength) {
    for (let e = t._depsLength; e < t.deps.length; e++)
      Qd(t.deps[e], t);
    t.deps.length = t._depsLength;
  }
}
function Qd(t, e) {
  const n = t.get(e);
  n !== void 0 && e._trackId !== n && (t.delete(e), t.size === 0 && t.cleanup());
}
let En = !0, yl = 0;
const Zd = [];
function Ln() {
  Zd.push(En), En = !1;
}
function Pn() {
  const t = Zd.pop();
  En = t === void 0 ? !0 : t;
}
function ba() {
  yl++;
}
function va() {
  for (yl--; !yl && bl.length; )
    bl.shift()();
}
function ef(t, e, n) {
  if (e.get(t) !== t._trackId) {
    e.set(t, t._trackId);
    const r = t.deps[t._depsLength];
    r !== e ? (r && Qd(r, t), t.deps[t._depsLength++] = e) : t._depsLength++;
  }
}
const bl = [];
function tf(t, e, n) {
  ba();
  for (const r of t.keys()) {
    let s;
    r._dirtyLevel < e && (s ?? (s = t.get(r) === r._trackId)) && (r._shouldSchedule || (r._shouldSchedule = r._dirtyLevel === 0), r._dirtyLevel = e), r._shouldSchedule && (s ?? (s = t.get(r) === r._trackId)) && (r.trigger(), (!r._runnings || r.allowRecurse) && r._dirtyLevel !== 2 && (r._shouldSchedule = !1, r.scheduler && bl.push(r.scheduler)));
  }
  va();
}
const nf = (t, e) => {
  const n = /* @__PURE__ */ new Map();
  return n.cleanup = t, n.computed = e, n;
}, vl = /* @__PURE__ */ new WeakMap(), Zn = Symbol(""), wl = Symbol("");
function ht(t, e, n) {
  if (En && Qn) {
    let r = vl.get(t);
    r || vl.set(t, r = /* @__PURE__ */ new Map());
    let s = r.get(n);
    s || r.set(n, s = nf(() => r.delete(n))), ef(
      Qn,
      s
    );
  }
}
function nn(t, e, n, r, s, i) {
  const o = vl.get(t);
  if (!o)
    return;
  let l = [];
  if (e === "clear")
    l = [...o.values()];
  else if (n === "length" && ee(t)) {
    const a = Number(r);
    o.forEach((c, u) => {
      (u === "length" || !Ir(u) && u >= a) && l.push(c);
    });
  } else
    switch (n !== void 0 && l.push(o.get(n)), e) {
      case "add":
        ee(t) ? ma(n) && l.push(o.get("length")) : (l.push(o.get(Zn)), _r(t) && l.push(o.get(wl)));
        break;
      case "delete":
        ee(t) || (l.push(o.get(Zn)), _r(t) && l.push(o.get(wl)));
        break;
      case "set":
        _r(t) && l.push(o.get(Zn));
        break;
    }
  ba();
  for (const a of l)
    a && tf(
      a,
      4
    );
  va();
}
const cm = /* @__PURE__ */ fa("__proto__,__v_isRef,__isVue"), rf = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Ir)
), Pc = /* @__PURE__ */ um();
function um() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const r = fe(this);
      for (let i = 0, o = this.length; i < o; i++)
        ht(r, "get", i + "");
      const s = r[e](...n);
      return s === -1 || s === !1 ? r[e](...n.map(fe)) : s;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Ln(), ba();
      const r = fe(this)[e].apply(this, n);
      return va(), Pn(), r;
    };
  }), t;
}
function dm(t) {
  const e = fe(this);
  return ht(e, "has", t), e.hasOwnProperty(t);
}
class sf {
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
      return r === (s ? i ? Sm : cf : i ? af : lf).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(r) ? e : void 0;
    const o = ee(e);
    if (!s) {
      if (o && he(Pc, n))
        return Reflect.get(Pc, n, r);
      if (n === "hasOwnProperty")
        return dm;
    }
    const l = Reflect.get(e, n, r);
    return (Ir(n) ? rf.has(n) : cm(n)) || (s || ht(e, "get", n), i) ? l : lt(l) ? o && ma(n) ? l : l.value : we(l) ? s ? _a(l) : _s(l) : l;
  }
}
class of extends sf {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, n, r, s) {
    let i = e[n];
    if (!this._shallow) {
      const a = jr(i);
      if (!hi(r) && !jr(r) && (i = fe(i), r = fe(r)), !ee(e) && lt(i) && !lt(r))
        return a ? !1 : (i.value = r, !0);
    }
    const o = ee(e) && ma(n) ? Number(n) < e.length : he(e, n), l = Reflect.set(e, n, r, s);
    return e === fe(s) && (o ? Tn(r, i) && nn(e, "set", n, r) : nn(e, "add", n, r)), l;
  }
  deleteProperty(e, n) {
    const r = he(e, n);
    e[n];
    const s = Reflect.deleteProperty(e, n);
    return s && r && nn(e, "delete", n, void 0), s;
  }
  has(e, n) {
    const r = Reflect.has(e, n);
    return (!Ir(n) || !rf.has(n)) && ht(e, "has", n), r;
  }
  ownKeys(e) {
    return ht(
      e,
      "iterate",
      ee(e) ? "length" : Zn
    ), Reflect.ownKeys(e);
  }
}
class fm extends sf {
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
const hm = /* @__PURE__ */ new of(), pm = /* @__PURE__ */ new fm(), mm = /* @__PURE__ */ new of(
  !0
), wa = (t) => t, fo = (t) => Reflect.getPrototypeOf(t);
function As(t, e, n = !1, r = !1) {
  t = t.__v_raw;
  const s = fe(t), i = fe(e);
  n || (Tn(e, i) && ht(s, "get", e), ht(s, "get", i));
  const { has: o } = fo(s), l = r ? wa : n ? Sa : us;
  if (o.call(s, e))
    return l(t.get(e));
  if (o.call(s, i))
    return l(t.get(i));
  t !== s && t.get(e);
}
function Ts(t, e = !1) {
  const n = this.__v_raw, r = fe(n), s = fe(t);
  return e || (Tn(t, s) && ht(r, "has", t), ht(r, "has", s)), t === s ? n.has(t) : n.has(t) || n.has(s);
}
function js(t, e = !1) {
  return t = t.__v_raw, !e && ht(fe(t), "iterate", Zn), Reflect.get(t, "size", t);
}
function Ic(t) {
  t = fe(t);
  const e = fe(this);
  return fo(e).has.call(e, t) || (e.add(t), nn(e, "add", t, t)), this;
}
function Nc(t, e) {
  e = fe(e);
  const n = fe(this), { has: r, get: s } = fo(n);
  let i = r.call(n, t);
  i || (t = fe(t), i = r.call(n, t));
  const o = s.call(n, t);
  return n.set(t, e), i ? Tn(e, o) && nn(n, "set", t, e) : nn(n, "add", t, e), this;
}
function zc(t) {
  const e = fe(this), { has: n, get: r } = fo(e);
  let s = n.call(e, t);
  s || (t = fe(t), s = n.call(e, t)), r && r.call(e, t);
  const i = e.delete(t);
  return s && nn(e, "delete", t, void 0), i;
}
function $c() {
  const t = fe(this), e = t.size !== 0, n = t.clear();
  return e && nn(t, "clear", void 0, void 0), n;
}
function Os(t, e) {
  return function(r, s) {
    const i = this, o = i.__v_raw, l = fe(o), a = e ? wa : t ? Sa : us;
    return !t && ht(l, "iterate", Zn), o.forEach((c, u) => r.call(s, a(c), a(u), i));
  };
}
function Rs(t, e, n) {
  return function(...r) {
    const s = this.__v_raw, i = fe(s), o = _r(i), l = t === "entries" || t === Symbol.iterator && o, a = t === "keys" && o, c = s[t](...r), u = n ? wa : e ? Sa : us;
    return !e && ht(
      i,
      "iterate",
      a ? wl : Zn
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
function ln(t) {
  return function(...e) {
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function gm() {
  const t = {
    get(i) {
      return As(this, i);
    },
    get size() {
      return js(this);
    },
    has: Ts,
    add: Ic,
    set: Nc,
    delete: zc,
    clear: $c,
    forEach: Os(!1, !1)
  }, e = {
    get(i) {
      return As(this, i, !1, !0);
    },
    get size() {
      return js(this);
    },
    has: Ts,
    add: Ic,
    set: Nc,
    delete: zc,
    clear: $c,
    forEach: Os(!1, !0)
  }, n = {
    get(i) {
      return As(this, i, !0);
    },
    get size() {
      return js(this, !0);
    },
    has(i) {
      return Ts.call(this, i, !0);
    },
    add: ln("add"),
    set: ln("set"),
    delete: ln("delete"),
    clear: ln("clear"),
    forEach: Os(!0, !1)
  }, r = {
    get(i) {
      return As(this, i, !0, !0);
    },
    get size() {
      return js(this, !0);
    },
    has(i) {
      return Ts.call(this, i, !0);
    },
    add: ln("add"),
    set: ln("set"),
    delete: ln("delete"),
    clear: ln("clear"),
    forEach: Os(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    t[i] = Rs(
      i,
      !1,
      !1
    ), n[i] = Rs(
      i,
      !0,
      !1
    ), e[i] = Rs(
      i,
      !1,
      !0
    ), r[i] = Rs(
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
  ym,
  bm,
  vm,
  wm
] = /* @__PURE__ */ gm();
function xa(t, e) {
  const n = e ? t ? wm : vm : t ? bm : ym;
  return (r, s, i) => s === "__v_isReactive" ? !t : s === "__v_isReadonly" ? t : s === "__v_raw" ? r : Reflect.get(
    he(n, s) && s in r ? n : r,
    s,
    i
  );
}
const xm = {
  get: /* @__PURE__ */ xa(!1, !1)
}, _m = {
  get: /* @__PURE__ */ xa(!1, !0)
}, km = {
  get: /* @__PURE__ */ xa(!0, !1)
}, lf = /* @__PURE__ */ new WeakMap(), af = /* @__PURE__ */ new WeakMap(), cf = /* @__PURE__ */ new WeakMap(), Sm = /* @__PURE__ */ new WeakMap();
function Cm(t) {
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
function Em(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Cm(Jp(t));
}
function _s(t) {
  return jr(t) ? t : ka(
    t,
    !1,
    hm,
    xm,
    lf
  );
}
function Mm(t) {
  return ka(
    t,
    !1,
    mm,
    _m,
    af
  );
}
function _a(t) {
  return ka(
    t,
    !0,
    pm,
    km,
    cf
  );
}
function ka(t, e, n, r, s) {
  if (!we(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const i = s.get(t);
  if (i)
    return i;
  const o = Em(t);
  if (o === 0)
    return t;
  const l = new Proxy(
    t,
    o === 2 ? r : n
  );
  return s.set(t, l), l;
}
function kr(t) {
  return jr(t) ? kr(t.__v_raw) : !!(t && t.__v_isReactive);
}
function jr(t) {
  return !!(t && t.__v_isReadonly);
}
function hi(t) {
  return !!(t && t.__v_isShallow);
}
function uf(t) {
  return kr(t) || jr(t);
}
function fe(t) {
  const e = t && t.__v_raw;
  return e ? fe(e) : t;
}
function df(t) {
  return Object.isExtensible(t) && fi(t, "__v_skip", !0), t;
}
const us = (t) => we(t) ? _s(t) : t, Sa = (t) => we(t) ? _a(t) : t;
class ff {
  constructor(e, n, r, s) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this.effect = new ya(
      () => e(this._value),
      () => ei(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    ), this.effect.computed = this, this.effect.active = this._cacheable = !s, this.__v_isReadonly = r;
  }
  get value() {
    const e = fe(this);
    return (!e._cacheable || e.effect.dirty) && Tn(e._value, e._value = e.effect.run()) && ei(e, 4), hf(e), e.effect._dirtyLevel >= 2 && ei(e, 2), e._value;
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
function Am(t, e, n = !1) {
  let r, s;
  const i = oe(t);
  return i ? (r = t, s = bt) : (r = t.get, s = t.set), new ff(r, s, i || !s, n);
}
function hf(t) {
  var e;
  En && Qn && (t = fe(t), ef(
    Qn,
    (e = t.dep) != null ? e : t.dep = nf(
      () => t.dep = void 0,
      t instanceof ff ? t : void 0
    )
  ));
}
function ei(t, e = 4, n) {
  t = fe(t);
  const r = t.dep;
  r && tf(
    r,
    e
  );
}
function lt(t) {
  return !!(t && t.__v_isRef === !0);
}
function ho(t) {
  return pf(t, !1);
}
function Tm(t) {
  return pf(t, !0);
}
function pf(t, e) {
  return lt(t) ? t : new jm(t, e);
}
class jm {
  constructor(e, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? e : fe(e), this._value = n ? e : us(e);
  }
  get value() {
    return hf(this), this._value;
  }
  set value(e) {
    const n = this.__v_isShallow || hi(e) || jr(e);
    e = n ? e : fe(e), Tn(e, this._rawValue) && (this._rawValue = e, this._value = n ? e : us(e), ei(this, 4));
  }
}
function mf(t) {
  return lt(t) ? t.value : t;
}
const Om = {
  get: (t, e, n) => mf(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const s = t[e];
    return lt(s) && !lt(n) ? (s.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function gf(t) {
  return kr(t) ? t : new Proxy(t, Om);
}
var Xr = { PYTHONIOENCODING: "utf-8", npm_package_dependencies_onscan_js: "^1.5.2", USER: "pequea.avu.nu", SSH_CLIENT: "127.0.0.1 48624 22", npm_config_version_commit_hooks: "true", npm_config_user_agent: "yarn/1.22.19 npm/? node/v18.17.1 linux x64", npm_package_dependencies_vue: "^3.4.19", npm_package_scripts_dev_project_list: "vite build --watch --config=./timeclock/www/project_list/vite.config.js", npm_config_bin_links: "true", XDG_SESSION_TYPE: "tty", GIT_ASKPASS: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/extensions/git/dist/askpass.sh", npm_node_execpath: "/usr/bin/node", npm_package_devDependencies_vite: "^5.1.4", npm_config_init_version: "1.0.0", SHLVL: "1", BROWSER: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/bin/helpers/browser.sh", MOTD_SHOWN: "pam", HOME: "/var/www/pequea.avu.nu/html", TERM_PROGRAM_VERSION: "1.86.2", VSCODE_IPC_HOOK_CLI: "/run/user/1000/vscode-ipc-4183a0c9-1424-4689-9d36-d985db1645f5.sock", npm_package_dependencies__eonasdan_tempus_dominus: "^6", PYTHONUNBUFFERED: "1", npm_package_dependencies__headlessui_vue: "^1.7.19", npm_config_init_license: "MIT", VSCODE_GIT_ASKPASS_MAIN: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/extensions/git/dist/askpass-main.js", YARN_WRAP_OUTPUT: "false", npm_config_version_tag_prefix: "v", PS1: "\\[\x1B]633;A\x07\\](env) ${debian_chroot:+($debian_chroot)}\\u@\\h:\\w\\$ \\[\x1B]633;B\x07\\]", VSCODE_GIT_ASKPASS_NODE: "/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node", LC_CTYPE: "C.UTF-8", DBUS_SESSION_BUS_ADDRESS: "unix:path=/run/user/1000/bus", npm_package_scripts_dev_timeclock: "vite build --watch --config=./timeclock/www/timeclock/vite.config.js", COLORTERM: "truecolor", npm_package_description: "ERPNext Timeclock", npm_package_devDependencies_tailwindcss: "^3.4.1", npm_package_readmeFilename: "README.md", npm_package_dependencies_jwt_decode: "^4.0.0", npm_package_scripts_preview_job_timeclock: "vite build --config=./timeclock/www/job_timeclock/src/vite.config.js", LOGNAME: "pequea.avu.nu", npm_package_dependencies__vueuse_core: "^10.8.0", npm_package_type: "module", _: "/usr/bin/yarn", npm_package_devDependencies_autoprefixer: "^10.4.17", npm_package_private: "true", XDG_SESSION_CLASS: "user", npm_config_registry: "https://registry.yarnpkg.com", TERM: "xterm-256color", XDG_SESSION_ID: "1413768", npm_package_devDependencies__vitejs_plugin_vue: "^5.0.4", npm_package_dependencies_getmac: "^6.6.0", npm_config_ignore_scripts: "", PATH: "/tmp/yarn--1708960383839-0.2396827984988945:/var/www/pequea.avu.nu/html/apps/timeclock/node_modules/.bin:/var/www/pequea.avu.nu/html/.config/yarn/link/node_modules/.bin:/var/www/pequea.avu.nu/html/.yarn/bin:/usr/libexec/lib/node_modules/npm/bin/node-gyp-bin:/usr/lib/node_modules/npm/bin/node-gyp-bin:/usr/bin/node_modules/npm/bin/node-gyp-bin:/var/www/pequea.avu.nu/html/.vscode-server/extensions/ms-python.python-2024.0.1/pythonFiles/deactivate/bash:/var/www/pequea.avu.nu/html/env/bin:/var/www/pequea.avu.nu/html/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/bin/remote-cli:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin", NODE: "/usr/bin/node", npm_package_name: "timeclock", XDG_RUNTIME_DIR: "/run/user/1000", npm_package_devDependencies_vite_plugin_compression: "^0.5.1", LANG: "en_US.UTF-8", VIRTUAL_ENV_PROMPT: "(env) ", VSCODE_GIT_IPC_HANDLE: "/run/user/1000/vscode-git-77f20ff1ac.sock", TERM_PROGRAM: "vscode", npm_lifecycle_script: "vite build --watch --config=./timeclock/www/job_timeclock/src/vite.config.js", npm_package_scripts_preview_project_list: "vite build --config=./timeclock/www/project_list/vite.config.js", npm_config_version_git_message: "v%s", SHELL: "/bin/bash", npm_lifecycle_event: "dev:job_timeclock", npm_package_version: "", npm_config_argv: '{"remain":[],"cooked":["run","dev:job_timeclock"],"original":["dev:job_timeclock"]}', npm_package_dependencies_vue_router: "^4.3.0", npm_config_version_git_tag: "true", npm_config_version_git_sign: "", npm_package_license: "MIT*", npm_package_scripts_dev_job_timeclock: "vite build --watch --config=./timeclock/www/job_timeclock/src/vite.config.js", npm_config_strict_ssl: "true", VIRTUAL_ENV: "/var/www/pequea.avu.nu/html/env", VSCODE_GIT_ASKPASS_EXTRA_ARGS: "", npm_package_dependencies__heroicons_vue: "^2.1.1", PWD: "/var/www/pequea.avu.nu/html/apps/timeclock", npm_execpath: "/usr/share/yarn/bin/yarn.js", npm_package_scripts_preview_timeclock: "vite build --config=./timeclock/www/timeclock/vite.config.js", SSH_CONNECTION: "127.0.0.1 48624 127.0.0.1 22", npm_package_dependencies__popperjs_core: "^2.11.8", npm_package_devDependencies_postcss: "^8.4.35", npm_config_save_prefix: "^", npm_config_ignore_optional: "", npm_package_dependencies_frappe_ui: "^0.1.31", INIT_CWD: "/var/www/pequea.avu.nu/html/apps/timeclock/timeclock/www/job_timeclock", NODE_ENV: "production" };
const Qr = [];
function Rm(t, ...e) {
  Ln();
  const n = Qr.length ? Qr[Qr.length - 1].component : null, r = n && n.appContext.config.warnHandler, s = Lm();
  if (r)
    rn(
      r,
      n,
      11,
      [
        t + e.join(""),
        n && n.proxy,
        s.map(
          ({ vnode: i }) => `at <${Uf(n, i.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const i = [`[Vue warn]: ${t}`, ...e];
    s.length && i.push(`
`, ...Pm(s)), console.warn(...i);
  }
  Pn();
}
function Lm() {
  let t = Qr[Qr.length - 1];
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
function Pm(t) {
  const e = [];
  return t.forEach((n, r) => {
    e.push(...r === 0 ? [] : [`
`], ...Im(n));
  }), e;
}
function Im({ vnode: t, recurseCount: e }) {
  const n = e > 0 ? `... (${e} recursive calls)` : "", r = t.component ? t.component.parent == null : !1, s = ` at <${Uf(
    t.component,
    t.type,
    r
  )}`, i = ">" + n;
  return t.props ? [s, ...Nm(t.props), i] : [s + i];
}
function Nm(t) {
  const e = [], n = Object.keys(t);
  return n.slice(0, 3).forEach((r) => {
    e.push(...yf(r, t[r]));
  }), n.length > 3 && e.push(" ..."), e;
}
function yf(t, e, n) {
  return Le(e) ? (e = JSON.stringify(e), n ? e : [`${t}=${e}`]) : typeof e == "number" || typeof e == "boolean" || e == null ? n ? e : [`${t}=${e}`] : lt(e) ? (e = yf(t, fe(e.value), !0), n ? e : [`${t}=Ref<`, e, ">"]) : oe(e) ? [`${t}=fn${e.name ? `<${e.name}>` : ""}`] : (e = fe(e), n ? e : [`${t}=`, e]);
}
function rn(t, e, n, r) {
  try {
    return r ? t(...r) : t();
  } catch (s) {
    po(s, e, n);
  }
}
function Mt(t, e, n, r) {
  if (oe(t)) {
    const i = rn(t, e, n, r);
    return i && Kd(i) && i.catch((o) => {
      po(o, e, n);
    }), i;
  }
  const s = [];
  for (let i = 0; i < t.length; i++)
    s.push(Mt(t[i], e, n, r));
  return s;
}
function po(t, e, n, r = !0) {
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
      rn(
        a,
        null,
        10,
        [t, o, l]
      );
      return;
    }
  }
  zm(t, n, s, r);
}
function zm(t, e, n, r = !0) {
  console.error(t);
}
let ds = !1, xl = !1;
const et = [];
let qt = 0;
const Sr = [];
let pn = null, Vn = 0;
const bf = /* @__PURE__ */ Promise.resolve();
let Ca = null;
function Ea(t) {
  const e = Ca || bf;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function $m(t) {
  let e = qt + 1, n = et.length;
  for (; e < n; ) {
    const r = e + n >>> 1, s = et[r], i = fs(s);
    i < t || i === t && s.pre ? e = r + 1 : n = r;
  }
  return e;
}
function Ma(t) {
  (!et.length || !et.includes(
    t,
    ds && t.allowRecurse ? qt + 1 : qt
  )) && (t.id == null ? et.push(t) : et.splice($m(t.id), 0, t), vf());
}
function vf() {
  !ds && !xl && (xl = !0, Ca = bf.then(xf));
}
function Dm(t) {
  const e = et.indexOf(t);
  e > qt && et.splice(e, 1);
}
function Bm(t) {
  ee(t) ? Sr.push(...t) : (!pn || !pn.includes(
    t,
    t.allowRecurse ? Vn + 1 : Vn
  )) && Sr.push(t), vf();
}
function Dc(t, e, n = ds ? qt + 1 : 0) {
  for (; n < et.length; n++) {
    const r = et[n];
    if (r && r.pre) {
      if (t && r.id !== t.uid)
        continue;
      et.splice(n, 1), n--, r();
    }
  }
}
function wf(t) {
  if (Sr.length) {
    const e = [...new Set(Sr)].sort(
      (n, r) => fs(n) - fs(r)
    );
    if (Sr.length = 0, pn) {
      pn.push(...e);
      return;
    }
    for (pn = e, Vn = 0; Vn < pn.length; Vn++)
      pn[Vn]();
    pn = null, Vn = 0;
  }
}
const fs = (t) => t.id == null ? 1 / 0 : t.id, Hm = (t, e) => {
  const n = fs(t) - fs(e);
  if (n === 0) {
    if (t.pre && !e.pre)
      return -1;
    if (e.pre && !t.pre)
      return 1;
  }
  return n;
};
function xf(t) {
  xl = !1, ds = !0, et.sort(Hm);
  const e = bt;
  try {
    for (qt = 0; qt < et.length; qt++) {
      const n = et[qt];
      n && n.active !== !1 && (Xr.NODE_ENV !== "production" && e(n), rn(n, null, 14));
    }
  } finally {
    qt = 0, et.length = 0, wf(), ds = !1, Ca = null, (et.length || Sr.length) && xf();
  }
}
function Fm(t, e, ...n) {
  if (t.isUnmounted)
    return;
  const r = t.vnode.props || ve;
  let s = n;
  const i = e.startsWith("update:"), o = i && e.slice(7);
  if (o && o in r) {
    const u = `${o === "modelValue" ? "model" : o}Modifiers`, { number: f, trim: h } = r[u] || ve;
    h && (s = n.map((g) => Le(g) ? g.trim() : g)), f && (s = n.map(gl));
  }
  let l, a = r[l = Lo(e)] || // also try camelCase event handler (#2249)
  r[l = Lo(Yt(e))];
  !a && i && (a = r[l = Lo(Nr(e))]), a && Mt(
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
    t.emitted[l] = !0, Mt(
      c,
      t,
      6,
      s
    );
  }
}
function _f(t, e, n = !1) {
  const r = e.emitsCache, s = r.get(t);
  if (s !== void 0)
    return s;
  const i = t.emits;
  let o = {}, l = !1;
  if (!oe(t)) {
    const a = (c) => {
      const u = _f(c, e, !0);
      u && (l = !0, He(o, u));
    };
    !n && e.mixins.length && e.mixins.forEach(a), t.extends && a(t.extends), t.mixins && t.mixins.forEach(a);
  }
  return !i && !l ? (we(t) && r.set(t, null), null) : (ee(i) ? i.forEach((a) => o[a] = null) : He(o, i), we(t) && r.set(t, o), o);
}
function mo(t, e) {
  return !t || !lo(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), he(t, e[0].toLowerCase() + e.slice(1)) || he(t, Nr(e)) || he(t, e));
}
let Be = null, go = null;
function pi(t) {
  const e = Be;
  return Be = t, go = t && t.type.__scopeId || null, e;
}
function Aa(t) {
  go = t;
}
function Ta() {
  go = null;
}
function sn(t, e = Be, n) {
  if (!e || t._n)
    return t;
  const r = (...s) => {
    r._d && Qc(-1);
    const i = pi(e);
    let o;
    try {
      o = t(...s);
    } finally {
      pi(i), r._d && Qc(1);
    }
    return o;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function Io(t) {
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
    setupState: g,
    ctx: y,
    inheritAttrs: v
  } = t;
  let k, E;
  const T = pi(t);
  try {
    if (n.shapeFlag & 4) {
      const d = s || r, m = Xr.NODE_ENV !== "production" && g.__isScriptSetup ? new Proxy(d, {
        get(p, b, w) {
          return Rm(
            `Property '${String(
              b
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          ), Reflect.get(p, b, w);
        }
      }) : d;
      k = Kt(
        u.call(
          m,
          d,
          f,
          i,
          g,
          h,
          y
        )
      ), E = a;
    } else {
      const d = e;
      Xr.NODE_ENV, k = Kt(
        d.length > 1 ? d(
          i,
          Xr.NODE_ENV !== "production" ? {
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
      ), E = e.props ? a : Vm(a);
    }
  } catch (d) {
    rs.length = 0, po(d, t, 1), k = Ce(At);
  }
  let j = k;
  if (E && v !== !1) {
    const d = Object.keys(E), { shapeFlag: m } = j;
    d.length && m & 7 && (o && d.some(ha) && (E = Wm(
      E,
      o
    )), j = jn(j, E));
  }
  return n.dirs && (j = jn(j), j.dirs = j.dirs ? j.dirs.concat(n.dirs) : n.dirs), n.transition && (j.transition = n.transition), k = j, pi(T), k;
}
const Vm = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || lo(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, Wm = (t, e) => {
  const n = {};
  for (const r in t)
    (!ha(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function Km(t, e, n) {
  const { props: r, children: s, component: i } = t, { props: o, children: l, patchFlag: a } = e, c = i.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return r ? Bc(r, o, c) : !!o;
    if (a & 8) {
      const u = e.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        const h = u[f];
        if (o[h] !== r[h] && !mo(c, h))
          return !0;
      }
    }
  } else
    return (s || l) && (!l || !l.$stable) ? !0 : r === o ? !1 : r ? o ? Bc(r, o, c) : !0 : !!o;
  return !1;
}
function Bc(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let s = 0; s < r.length; s++) {
    const i = r[s];
    if (e[i] !== t[i] && !mo(n, i))
      return !0;
  }
  return !1;
}
function Um({ vnode: t, parent: e }, n) {
  for (; e; ) {
    const r = e.subTree;
    if (r.suspense && r.suspense.activeBranch === t && (r.el = t.el), r === t)
      (t = e.vnode).el = n, e = e.parent;
    else
      break;
  }
}
const kf = "components";
function We(t, e) {
  return Gm(kf, t, !0, e) || t;
}
const qm = Symbol.for("v-ndc");
function Gm(t, e, n = !0, r = !1) {
  const s = Be || De;
  if (s) {
    const i = s.type;
    if (t === kf) {
      const l = Kf(
        i,
        !1
      );
      if (l && (l === e || l === Yt(e) || l === uo(Yt(e))))
        return i;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      Hc(s[t] || i[t], e) || // global registration
      Hc(s.appContext[t], e)
    );
    return !o && r ? i : o;
  }
}
function Hc(t, e) {
  return t && (t[e] || t[Yt(e)] || t[uo(Yt(e))]);
}
const Jm = (t) => t.__isSuspense;
function Ym(t, e) {
  e && e.pendingBranch ? ee(t) ? e.effects.push(...t) : e.effects.push(t) : Bm(t);
}
const Xm = Symbol.for("v-scx"), Qm = () => ns(Xm);
function Zm(t, e) {
  return ja(t, null, e);
}
const Ls = {};
function Cr(t, e, n) {
  return ja(t, e, n);
}
function ja(t, e, {
  immediate: n,
  deep: r,
  flush: s,
  once: i,
  onTrack: o,
  onTrigger: l
} = ve) {
  if (e && i) {
    const p = e;
    e = (...b) => {
      p(...b), m();
    };
  }
  const a = De, c = (p) => r === !0 ? p : (
    // for deep: false, only traverse root-level properties
    Gn(p, r === !1 ? 1 : void 0)
  );
  let u, f = !1, h = !1;
  if (lt(t) ? (u = () => t.value, f = hi(t)) : kr(t) ? (u = () => c(t), f = !0) : ee(t) ? (h = !0, f = t.some((p) => kr(p) || hi(p)), u = () => t.map((p) => {
    if (lt(p))
      return p.value;
    if (kr(p))
      return c(p);
    if (oe(p))
      return rn(p, a, 2);
  })) : oe(t) ? e ? u = () => rn(t, a, 2) : u = () => (g && g(), Mt(
    t,
    a,
    3,
    [y]
  )) : u = bt, e && r) {
    const p = u;
    u = () => Gn(p());
  }
  let g, y = (p) => {
    g = j.onStop = () => {
      rn(p, a, 4), g = j.onStop = void 0;
    };
  }, v;
  if (xo)
    if (y = bt, e ? n && Mt(e, a, 3, [
      u(),
      h ? [] : void 0,
      y
    ]) : u(), s === "sync") {
      const p = Qm();
      v = p.__watcherHandles || (p.__watcherHandles = []);
    } else
      return bt;
  let k = h ? new Array(t.length).fill(Ls) : Ls;
  const E = () => {
    if (!(!j.active || !j.dirty))
      if (e) {
        const p = j.run();
        (r || f || (h ? p.some((b, w) => Tn(b, k[w])) : Tn(p, k))) && (g && g(), Mt(e, a, 3, [
          p,
          // pass undefined as the old value when it's changed for the first time
          k === Ls ? void 0 : h && k[0] === Ls ? [] : k,
          y
        ]), k = p);
      } else
        j.run();
  };
  E.allowRecurse = !!e;
  let T;
  s === "sync" ? T = E : s === "post" ? T = () => ct(E, a && a.suspense) : (E.pre = !0, a && (E.id = a.uid), T = () => Ma(E));
  const j = new ya(u, bt, T), d = Xd(), m = () => {
    j.stop(), d && pa(d.effects, j);
  };
  return e ? n ? E() : k = j.run() : s === "post" ? ct(
    j.run.bind(j),
    a && a.suspense
  ) : j.run(), v && v.push(m), m;
}
function e1(t, e, n) {
  const r = this.proxy, s = Le(t) ? t.includes(".") ? Sf(r, t) : () => r[t] : t.bind(r, r);
  let i;
  oe(e) ? i = e : (i = e.handler, n = e);
  const o = ks(this), l = ja(s, i.bind(r), n);
  return o(), l;
}
function Sf(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let s = 0; s < n.length && r; s++)
      r = r[n[s]];
    return r;
  };
}
function Gn(t, e, n = 0, r) {
  if (!we(t) || t.__v_skip)
    return t;
  if (e && e > 0) {
    if (n >= e)
      return t;
    n++;
  }
  if (r = r || /* @__PURE__ */ new Set(), r.has(t))
    return t;
  if (r.add(t), lt(t))
    Gn(t.value, e, n, r);
  else if (ee(t))
    for (let s = 0; s < t.length; s++)
      Gn(t[s], e, n, r);
  else if (Wd(t) || _r(t))
    t.forEach((s) => {
      Gn(s, e, n, r);
    });
  else if (qd(t))
    for (const s in t)
      Gn(t[s], e, n, r);
  return t;
}
function Fc(t, e) {
  if (Be === null)
    return t;
  const n = _o(Be) || Be.proxy, r = t.dirs || (t.dirs = []);
  for (let s = 0; s < e.length; s++) {
    let [i, o, l, a = ve] = e[s];
    i && (oe(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && Gn(o), r.push({
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
function Dn(t, e, n, r) {
  const s = t.dirs, i = e && e.dirs;
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    i && (l.oldValue = i[o].value);
    let a = l.dir[r];
    a && (Ln(), Mt(a, n, 8, [
      t.el,
      l,
      t,
      e
    ]), Pn());
  }
}
const mn = Symbol("_leaveCb"), Ps = Symbol("_enterCb");
function t1() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Oa(() => {
    t.isMounted = !0;
  }), Tf(() => {
    t.isUnmounting = !0;
  }), t;
}
const xt = [Function, Array], Cf = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: xt,
  onEnter: xt,
  onAfterEnter: xt,
  onEnterCancelled: xt,
  // leave
  onBeforeLeave: xt,
  onLeave: xt,
  onAfterLeave: xt,
  onLeaveCancelled: xt,
  // appear
  onBeforeAppear: xt,
  onAppear: xt,
  onAfterAppear: xt,
  onAppearCancelled: xt
}, n1 = {
  name: "BaseTransition",
  props: Cf,
  setup(t, { slots: e }) {
    const n = $a(), r = t1();
    let s;
    return () => {
      const i = e.default && Mf(e.default(), !0);
      if (!i || !i.length)
        return;
      let o = i[0];
      if (i.length > 1) {
        for (const v of i)
          if (v.type !== At) {
            o = v;
            break;
          }
      }
      const l = fe(t), { mode: a } = l;
      if (r.isLeaving)
        return No(o);
      const c = Vc(o);
      if (!c)
        return No(o);
      const u = _l(
        c,
        l,
        r,
        n
      );
      kl(c, u);
      const f = n.subTree, h = f && Vc(f);
      let g = !1;
      const { getTransitionKey: y } = c.type;
      if (y) {
        const v = y();
        s === void 0 ? s = v : v !== s && (s = v, g = !0);
      }
      if (h && h.type !== At && (!Wn(c, h) || g)) {
        const v = _l(
          h,
          l,
          r,
          n
        );
        if (kl(h, v), a === "out-in")
          return r.isLeaving = !0, v.afterLeave = () => {
            r.isLeaving = !1, n.update.active !== !1 && (n.effect.dirty = !0, n.update());
          }, No(o);
        a === "in-out" && c.type !== At && (v.delayLeave = (k, E, T) => {
          const j = Ef(
            r,
            h
          );
          j[String(h.key)] = h, k[mn] = () => {
            E(), k[mn] = void 0, delete u.delayedLeave;
          }, u.delayedLeave = T;
        });
      }
      return o;
    };
  }
}, r1 = n1;
function Ef(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(e.type, r)), r;
}
function _l(t, e, n, r) {
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
    onAfterLeave: g,
    onLeaveCancelled: y,
    onBeforeAppear: v,
    onAppear: k,
    onAfterAppear: E,
    onAppearCancelled: T
  } = e, j = String(t.key), d = Ef(n, t), m = (w, _) => {
    w && Mt(
      w,
      r,
      9,
      _
    );
  }, p = (w, _) => {
    const x = _[1];
    m(w, _), ee(w) ? w.every((M) => M.length <= 1) && x() : w.length <= 1 && x();
  }, b = {
    mode: i,
    persisted: o,
    beforeEnter(w) {
      let _ = l;
      if (!n.isMounted)
        if (s)
          _ = v || l;
        else
          return;
      w[mn] && w[mn](
        !0
        /* cancelled */
      );
      const x = d[j];
      x && Wn(t, x) && x.el[mn] && x.el[mn](), m(_, [w]);
    },
    enter(w) {
      let _ = a, x = c, M = u;
      if (!n.isMounted)
        if (s)
          _ = k || a, x = E || c, M = T || u;
        else
          return;
      let O = !1;
      const L = w[Ps] = (I) => {
        O || (O = !0, I ? m(M, [w]) : m(x, [w]), b.delayedLeave && b.delayedLeave(), w[Ps] = void 0);
      };
      _ ? p(_, [w, L]) : L();
    },
    leave(w, _) {
      const x = String(t.key);
      if (w[Ps] && w[Ps](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return _();
      m(f, [w]);
      let M = !1;
      const O = w[mn] = (L) => {
        M || (M = !0, _(), L ? m(y, [w]) : m(g, [w]), w[mn] = void 0, d[x] === t && delete d[x]);
      };
      d[x] = t, h ? p(h, [w, O]) : O();
    },
    clone(w) {
      return _l(w, e, n, r);
    }
  };
  return b;
}
function No(t) {
  if (yo(t))
    return t = jn(t), t.children = null, t;
}
function Vc(t) {
  return yo(t) ? (
    // #7121 ensure get the child component subtree in case
    // it's been replaced during HMR
    t.children ? t.children[0] : void 0
  ) : t;
}
function kl(t, e) {
  t.shapeFlag & 6 && t.component ? kl(t.component.subTree, e) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Mf(t, e = !1, n) {
  let r = [], s = 0;
  for (let i = 0; i < t.length; i++) {
    let o = t[i];
    const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
    o.type === Pe ? (o.patchFlag & 128 && s++, r = r.concat(
      Mf(o.children, e, l)
    )) : (e || o.type !== At) && r.push(l != null ? jn(o, { key: l }) : o);
  }
  if (s > 1)
    for (let i = 0; i < r.length; i++)
      r[i].patchFlag = -2;
  return r;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function wt(t, e) {
  return oe(t) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    He({ name: t.name }, e, { setup: t })
  ) : t;
}
const Zr = (t) => !!t.type.__asyncLoader, yo = (t) => t.type.__isKeepAlive;
function s1(t, e) {
  Af(t, "a", e);
}
function i1(t, e) {
  Af(t, "da", e);
}
function Af(t, e, n = De) {
  const r = t.__wdc || (t.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return t();
  });
  if (bo(e, r, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      yo(s.parent.vnode) && o1(r, e, n, s), s = s.parent;
  }
}
function o1(t, e, n, r) {
  const s = bo(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  Ra(() => {
    pa(r[e], s);
  }, n);
}
function bo(t, e, n = De, r = !1) {
  if (n) {
    const s = n[t] || (n[t] = []), i = e.__weh || (e.__weh = (...o) => {
      if (n.isUnmounted)
        return;
      Ln();
      const l = ks(n), a = Mt(e, n, t, o);
      return l(), Pn(), a;
    });
    return r ? s.unshift(i) : s.push(i), i;
  }
}
const on = (t) => (e, n = De) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!xo || t === "sp") && bo(t, (...r) => e(...r), n)
), l1 = on("bm"), Oa = on("m"), a1 = on("bu"), c1 = on("u"), Tf = on("bum"), Ra = on("um"), u1 = on("sp"), d1 = on(
  "rtg"
), f1 = on(
  "rtc"
);
function h1(t, e = De) {
  bo("ec", t, e);
}
function La(t, e, n, r) {
  let s;
  const i = n && n[r];
  if (ee(t) || Le(t)) {
    s = new Array(t.length);
    for (let o = 0, l = t.length; o < l; o++)
      s[o] = e(t[o], o, void 0, i && i[o]);
  } else if (typeof t == "number") {
    s = new Array(t);
    for (let o = 0; o < t; o++)
      s[o] = e(o + 1, o, void 0, i && i[o]);
  } else if (we(t))
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
function vr(t, e, n = {}, r, s) {
  if (Be.isCE || Be.parent && Zr(Be.parent) && Be.parent.isCE)
    return e !== "default" && (n.name = e), Ce("slot", n, r && r());
  let i = t[e];
  i && i._c && (i._d = !1), ne();
  const o = i && jf(i(n)), l = tt(
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
function jf(t) {
  return t.some((e) => gi(e) ? !(e.type === At || e.type === Pe && !jf(e.children)) : !0) ? t : null;
}
const Sl = (t) => t ? Ff(t) ? _o(t) || t.proxy : Sl(t.parent) : null, es = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ He(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => Sl(t.parent),
    $root: (t) => Sl(t.root),
    $emit: (t) => t.emit,
    $options: (t) => Pa(t),
    $forceUpdate: (t) => t.f || (t.f = () => {
      t.effect.dirty = !0, Ma(t.update);
    }),
    $nextTick: (t) => t.n || (t.n = Ea.bind(t.proxy)),
    $watch: (t) => e1.bind(t)
  })
), zo = (t, e) => t !== ve && !t.__isScriptSetup && he(t, e), p1 = {
  get({ _: t }, e) {
    const { ctx: n, setupState: r, data: s, props: i, accessCache: o, type: l, appContext: a } = t;
    let c;
    if (e[0] !== "$") {
      const g = o[e];
      if (g !== void 0)
        switch (g) {
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
        if (zo(r, e))
          return o[e] = 1, r[e];
        if (s !== ve && he(s, e))
          return o[e] = 2, s[e];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (c = t.propsOptions[0]) && he(c, e)
        )
          return o[e] = 3, i[e];
        if (n !== ve && he(n, e))
          return o[e] = 4, n[e];
        Cl && (o[e] = 0);
      }
    }
    const u = es[e];
    let f, h;
    if (u)
      return e === "$attrs" && ht(t, "get", e), u(t);
    if (
      // css module (injected by vue-loader)
      (f = l.__cssModules) && (f = f[e])
    )
      return f;
    if (n !== ve && he(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      h = a.config.globalProperties, he(h, e)
    )
      return h[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: s, ctx: i } = t;
    return zo(s, e) ? (s[e] = n, !0) : r !== ve && he(r, e) ? (r[e] = n, !0) : he(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (i[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: s, propsOptions: i }
  }, o) {
    let l;
    return !!n[o] || t !== ve && he(t, o) || zo(e, o) || (l = i[0]) && he(l, o) || he(r, o) || he(es, o) || he(s.config.globalProperties, o);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : he(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function m1() {
  return g1().slots;
}
function g1() {
  const t = $a();
  return t.setupContext || (t.setupContext = Wf(t));
}
function Wc(t) {
  return ee(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let Cl = !0;
function y1(t) {
  const e = Pa(t), n = t.proxy, r = t.ctx;
  Cl = !1, e.beforeCreate && Kc(e.beforeCreate, t, "bc");
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
    beforeUpdate: g,
    updated: y,
    activated: v,
    deactivated: k,
    beforeDestroy: E,
    beforeUnmount: T,
    destroyed: j,
    unmounted: d,
    render: m,
    renderTracked: p,
    renderTriggered: b,
    errorCaptured: w,
    serverPrefetch: _,
    // public API
    expose: x,
    inheritAttrs: M,
    // assets
    components: O,
    directives: L,
    filters: I
  } = e;
  if (c && b1(c, r, null), o)
    for (const R in o) {
      const N = o[R];
      oe(N) && (r[R] = N.bind(n));
    }
  if (s) {
    const R = s.call(n, n);
    we(R) && (t.data = _s(R));
  }
  if (Cl = !0, i)
    for (const R in i) {
      const N = i[R], q = oe(N) ? N.bind(n, n) : oe(N.get) ? N.get.bind(n, n) : bt, re = !oe(N) && oe(N.set) ? N.set.bind(n) : bt, J = Kn({
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
      Of(l[R], r, n, R);
  if (a) {
    const R = oe(a) ? a.call(n) : a;
    Reflect.ownKeys(R).forEach((N) => {
      S1(N, R[N]);
    });
  }
  u && Kc(u, t, "c");
  function S(R, N) {
    ee(N) ? N.forEach((q) => R(q.bind(n))) : N && R(N.bind(n));
  }
  if (S(l1, f), S(Oa, h), S(a1, g), S(c1, y), S(s1, v), S(i1, k), S(h1, w), S(f1, p), S(d1, b), S(Tf, T), S(Ra, d), S(u1, _), ee(x))
    if (x.length) {
      const R = t.exposed || (t.exposed = {});
      x.forEach((N) => {
        Object.defineProperty(R, N, {
          get: () => n[N],
          set: (q) => n[N] = q
        });
      });
    } else
      t.exposed || (t.exposed = {});
  m && t.render === bt && (t.render = m), M != null && (t.inheritAttrs = M), O && (t.components = O), L && (t.directives = L);
}
function b1(t, e, n = bt) {
  ee(t) && (t = El(t));
  for (const r in t) {
    const s = t[r];
    let i;
    we(s) ? "default" in s ? i = ns(
      s.from || r,
      s.default,
      !0
    ) : i = ns(s.from || r) : i = ns(s), lt(i) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (o) => i.value = o
    }) : e[r] = i;
  }
}
function Kc(t, e, n) {
  Mt(
    ee(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Of(t, e, n, r) {
  const s = r.includes(".") ? Sf(n, r) : () => n[r];
  if (Le(t)) {
    const i = e[t];
    oe(i) && Cr(s, i);
  } else if (oe(t))
    Cr(s, t.bind(n));
  else if (we(t))
    if (ee(t))
      t.forEach((i) => Of(i, e, n, r));
    else {
      const i = oe(t.handler) ? t.handler.bind(n) : e[t.handler];
      oe(i) && Cr(s, i, t);
    }
}
function Pa(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: s,
    optionsCache: i,
    config: { optionMergeStrategies: o }
  } = t.appContext, l = i.get(e);
  let a;
  return l ? a = l : !s.length && !n && !r ? a = e : (a = {}, s.length && s.forEach(
    (c) => mi(a, c, o, !0)
  ), mi(a, e, o)), we(e) && i.set(e, a), a;
}
function mi(t, e, n, r = !1) {
  const { mixins: s, extends: i } = e;
  i && mi(t, i, n, !0), s && s.forEach(
    (o) => mi(t, o, n, !0)
  );
  for (const o in e)
    if (!(r && o === "expose")) {
      const l = v1[o] || n && n[o];
      t[o] = l ? l(t[o], e[o]) : e[o];
    }
  return t;
}
const v1 = {
  data: Uc,
  props: qc,
  emits: qc,
  // objects
  methods: Kr,
  computed: Kr,
  // lifecycle
  beforeCreate: it,
  created: it,
  beforeMount: it,
  mounted: it,
  beforeUpdate: it,
  updated: it,
  beforeDestroy: it,
  beforeUnmount: it,
  destroyed: it,
  unmounted: it,
  activated: it,
  deactivated: it,
  errorCaptured: it,
  serverPrefetch: it,
  // assets
  components: Kr,
  directives: Kr,
  // watch
  watch: x1,
  // provide / inject
  provide: Uc,
  inject: w1
};
function Uc(t, e) {
  return e ? t ? function() {
    return He(
      oe(t) ? t.call(this, this) : t,
      oe(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function w1(t, e) {
  return Kr(El(t), El(e));
}
function El(t) {
  if (ee(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function it(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function Kr(t, e) {
  return t ? He(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function qc(t, e) {
  return t ? ee(t) && ee(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : He(
    /* @__PURE__ */ Object.create(null),
    Wc(t),
    Wc(e ?? {})
  ) : e;
}
function x1(t, e) {
  if (!t)
    return e;
  if (!e)
    return t;
  const n = He(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = it(t[r], e[r]);
  return n;
}
function Rf() {
  return {
    app: null,
    config: {
      isNativeTag: qp,
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
let _1 = 0;
function k1(t, e) {
  return function(r, s = null) {
    oe(r) || (r = He({}, r)), s != null && !we(s) && (s = null);
    const i = Rf(), o = /* @__PURE__ */ new WeakSet();
    let l = !1;
    const a = i.app = {
      _uid: _1++,
      _component: r,
      _props: s,
      _container: null,
      _context: i,
      _instance: null,
      version: q1,
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
          const h = Ce(r, s);
          return h.appContext = i, f === !0 ? f = "svg" : f === !1 && (f = void 0), u && e ? e(h, c) : t(h, c, f), l = !0, a._container = c, c.__vue_app__ = a, _o(h.component) || h.component.proxy;
        }
      },
      unmount() {
        l && (t(null, a._container), delete a._container.__vue_app__);
      },
      provide(c, u) {
        return i.provides[c] = u, a;
      },
      runWithContext(c) {
        const u = ts;
        ts = a;
        try {
          return c();
        } finally {
          ts = u;
        }
      }
    };
    return a;
  };
}
let ts = null;
function S1(t, e) {
  if (De) {
    let n = De.provides;
    const r = De.parent && De.parent.provides;
    r === n && (n = De.provides = Object.create(r)), n[t] = e;
  }
}
function ns(t, e, n = !1) {
  const r = De || Be;
  if (r || ts) {
    const s = r ? r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : ts._context.provides;
    if (s && t in s)
      return s[t];
    if (arguments.length > 1)
      return n && oe(e) ? e.call(r && r.proxy) : e;
  }
}
function C1(t, e, n, r = !1) {
  const s = {}, i = {};
  fi(i, wo, 1), t.propsDefaults = /* @__PURE__ */ Object.create(null), Lf(t, e, s, i);
  for (const o in t.propsOptions[0])
    o in s || (s[o] = void 0);
  n ? t.props = r ? s : Mm(s) : t.type.props ? t.props = s : t.props = i, t.attrs = i;
}
function E1(t, e, n, r) {
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
        if (mo(t.emitsOptions, h))
          continue;
        const g = e[h];
        if (a)
          if (he(i, h))
            g !== i[h] && (i[h] = g, c = !0);
          else {
            const y = Yt(h);
            s[y] = Ml(
              a,
              l,
              y,
              g,
              t,
              !1
            );
          }
        else
          g !== i[h] && (i[h] = g, c = !0);
      }
    }
  } else {
    Lf(t, e, s, i) && (c = !0);
    let u;
    for (const f in l)
      (!e || // for camelCase
      !he(e, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = Nr(f)) === f || !he(e, u))) && (a ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[u] !== void 0) && (s[f] = Ml(
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
  c && nn(t, "set", "$attrs");
}
function Lf(t, e, n, r) {
  const [s, i] = t.propsOptions;
  let o = !1, l;
  if (e)
    for (let a in e) {
      if (Yr(a))
        continue;
      const c = e[a];
      let u;
      s && he(s, u = Yt(a)) ? !i || !i.includes(u) ? n[u] = c : (l || (l = {}))[u] = c : mo(t.emitsOptions, a) || (!(a in r) || c !== r[a]) && (r[a] = c, o = !0);
    }
  if (i) {
    const a = fe(n), c = l || ve;
    for (let u = 0; u < i.length; u++) {
      const f = i[u];
      n[f] = Ml(
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
function Ml(t, e, n, r, s, i) {
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
          const u = ks(s);
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
    ] && (r === "" || r === Nr(n)) && (r = !0));
  }
  return r;
}
function Pf(t, e, n = !1) {
  const r = e.propsCache, s = r.get(t);
  if (s)
    return s;
  const i = t.props, o = {}, l = [];
  let a = !1;
  if (!oe(t)) {
    const u = (f) => {
      a = !0;
      const [h, g] = Pf(f, e, !0);
      He(o, h), g && l.push(...g);
    };
    !n && e.mixins.length && e.mixins.forEach(u), t.extends && u(t.extends), t.mixins && t.mixins.forEach(u);
  }
  if (!i && !a)
    return we(t) && r.set(t, xr), xr;
  if (ee(i))
    for (let u = 0; u < i.length; u++) {
      const f = Yt(i[u]);
      Gc(f) && (o[f] = ve);
    }
  else if (i)
    for (const u in i) {
      const f = Yt(u);
      if (Gc(f)) {
        const h = i[u], g = o[f] = ee(h) || oe(h) ? { type: h } : He({}, h);
        if (g) {
          const y = Xc(Boolean, g.type), v = Xc(String, g.type);
          g[
            0
            /* shouldCast */
          ] = y > -1, g[
            1
            /* shouldCastTrue */
          ] = v < 0 || y < v, (y > -1 || he(g, "default")) && l.push(f);
        }
      }
    }
  const c = [o, l];
  return we(t) && r.set(t, c), c;
}
function Gc(t) {
  return t[0] !== "$" && !Yr(t);
}
function Jc(t) {
  return t === null ? "null" : typeof t == "function" ? t.name || "" : typeof t == "object" && t.constructor && t.constructor.name || "";
}
function Yc(t, e) {
  return Jc(t) === Jc(e);
}
function Xc(t, e) {
  return ee(e) ? e.findIndex((n) => Yc(n, t)) : oe(e) && Yc(e, t) ? 0 : -1;
}
const If = (t) => t[0] === "_" || t === "$stable", Ia = (t) => ee(t) ? t.map(Kt) : [Kt(t)], M1 = (t, e, n) => {
  if (e._n)
    return e;
  const r = sn((...s) => (Xr.NODE_ENV !== "production" && De && (!n || (n.root, De.root)), Ia(e(...s))), n);
  return r._c = !1, r;
}, Nf = (t, e, n) => {
  const r = t._ctx;
  for (const s in t) {
    if (If(s))
      continue;
    const i = t[s];
    if (oe(i))
      e[s] = M1(s, i, r);
    else if (i != null) {
      const o = Ia(i);
      e[s] = () => o;
    }
  }
}, zf = (t, e) => {
  const n = Ia(e);
  t.slots.default = () => n;
}, A1 = (t, e) => {
  if (t.vnode.shapeFlag & 32) {
    const n = e._;
    n ? (t.slots = fe(e), fi(e, "_", n)) : Nf(
      e,
      t.slots = {}
    );
  } else
    t.slots = {}, e && zf(t, e);
  fi(t.slots, wo, 1);
}, T1 = (t, e, n) => {
  const { vnode: r, slots: s } = t;
  let i = !0, o = ve;
  if (r.shapeFlag & 32) {
    const l = e._;
    l ? n && l === 1 ? i = !1 : (He(s, e), !n && l === 1 && delete s._) : (i = !e.$stable, Nf(e, s)), o = e;
  } else
    e && (zf(t, e), o = { default: 1 });
  if (i)
    for (const l in s)
      !If(l) && o[l] == null && delete s[l];
};
function Al(t, e, n, r, s = !1) {
  if (ee(t)) {
    t.forEach(
      (h, g) => Al(
        h,
        e && (ee(e) ? e[g] : e),
        n,
        r,
        s
      )
    );
    return;
  }
  if (Zr(r) && !s)
    return;
  const i = r.shapeFlag & 4 ? _o(r.component) || r.component.proxy : r.el, o = s ? null : i, { i: l, r: a } = t, c = e && e.r, u = l.refs === ve ? l.refs = {} : l.refs, f = l.setupState;
  if (c != null && c !== a && (Le(c) ? (u[c] = null, he(f, c) && (f[c] = null)) : lt(c) && (c.value = null)), oe(a))
    rn(a, l, 12, [o, u]);
  else {
    const h = Le(a), g = lt(a);
    if (h || g) {
      const y = () => {
        if (t.f) {
          const v = h ? he(f, a) ? f[a] : u[a] : a.value;
          s ? ee(v) && pa(v, i) : ee(v) ? v.includes(i) || v.push(i) : h ? (u[a] = [i], he(f, a) && (f[a] = u[a])) : (a.value = [i], t.k && (u[t.k] = a.value));
        } else
          h ? (u[a] = o, he(f, a) && (f[a] = o)) : g && (a.value = o, t.k && (u[t.k] = o));
      };
      o ? (y.id = -1, ct(y, n)) : y();
    }
  }
}
const ct = Ym;
function j1(t) {
  return O1(t);
}
function O1(t, e) {
  const n = Gd();
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
    setScopeId: g = bt,
    insertStaticContent: y
  } = t, v = (C, A, P, $ = null, D = null, V = null, G = void 0, F = null, K = !!A.dynamicChildren) => {
    if (C === A)
      return;
    C && !Wn(C, A) && ($ = $e(C), ce(C, D, V, !0), C = null), A.patchFlag === -2 && (K = !1, A.dynamicChildren = null);
    const { type: B, ref: Y, shapeFlag: Q } = A;
    switch (B) {
      case vo:
        k(C, A, P, $);
        break;
      case At:
        E(C, A, P, $);
        break;
      case Do:
        C == null && T(A, P, $, G);
        break;
      case Pe:
        O(
          C,
          A,
          P,
          $,
          D,
          V,
          G,
          F,
          K
        );
        break;
      default:
        Q & 1 ? m(
          C,
          A,
          P,
          $,
          D,
          V,
          G,
          F,
          K
        ) : Q & 6 ? L(
          C,
          A,
          P,
          $,
          D,
          V,
          G,
          F,
          K
        ) : (Q & 64 || Q & 128) && B.process(
          C,
          A,
          P,
          $,
          D,
          V,
          G,
          F,
          K,
          zt
        );
    }
    Y != null && D && Al(Y, C && C.ref, V, A || C, !A);
  }, k = (C, A, P, $) => {
    if (C == null)
      r(
        A.el = l(A.children),
        P,
        $
      );
    else {
      const D = A.el = C.el;
      A.children !== C.children && c(D, A.children);
    }
  }, E = (C, A, P, $) => {
    C == null ? r(
      A.el = a(A.children || ""),
      P,
      $
    ) : A.el = C.el;
  }, T = (C, A, P, $) => {
    [C.el, C.anchor] = y(
      C.children,
      A,
      P,
      $,
      C.el,
      C.anchor
    );
  }, j = ({ el: C, anchor: A }, P, $) => {
    let D;
    for (; C && C !== A; )
      D = h(C), r(C, P, $), C = D;
    r(A, P, $);
  }, d = ({ el: C, anchor: A }) => {
    let P;
    for (; C && C !== A; )
      P = h(C), s(C), C = P;
    s(A);
  }, m = (C, A, P, $, D, V, G, F, K) => {
    A.type === "svg" ? G = "svg" : A.type === "math" && (G = "mathml"), C == null ? p(
      A,
      P,
      $,
      D,
      V,
      G,
      F,
      K
    ) : _(
      C,
      A,
      D,
      V,
      G,
      F,
      K
    );
  }, p = (C, A, P, $, D, V, G, F) => {
    let K, B;
    const { props: Y, shapeFlag: Q, transition: X, dirs: ie } = C;
    if (K = C.el = o(
      C.type,
      V,
      Y && Y.is,
      Y
    ), Q & 8 ? u(K, C.children) : Q & 16 && w(
      C.children,
      K,
      null,
      $,
      D,
      $o(C, V),
      G,
      F
    ), ie && Dn(C, null, $, "created"), b(K, C, C.scopeId, G, $), Y) {
      for (const ge in Y)
        ge !== "value" && !Yr(ge) && i(
          K,
          ge,
          null,
          Y[ge],
          V,
          C.children,
          $,
          D,
          be
        );
      "value" in Y && i(K, "value", null, Y.value, V), (B = Y.onVnodeBeforeMount) && Dt(B, $, C);
    }
    ie && Dn(C, null, $, "beforeMount");
    const ue = R1(D, X);
    ue && X.beforeEnter(K), r(K, A, P), ((B = Y && Y.onVnodeMounted) || ue || ie) && ct(() => {
      B && Dt(B, $, C), ue && X.enter(K), ie && Dn(C, null, $, "mounted");
    }, D);
  }, b = (C, A, P, $, D) => {
    if (P && g(C, P), $)
      for (let V = 0; V < $.length; V++)
        g(C, $[V]);
    if (D) {
      let V = D.subTree;
      if (A === V) {
        const G = D.vnode;
        b(
          C,
          G,
          G.scopeId,
          G.slotScopeIds,
          D.parent
        );
      }
    }
  }, w = (C, A, P, $, D, V, G, F, K = 0) => {
    for (let B = K; B < C.length; B++) {
      const Y = C[B] = F ? gn(C[B]) : Kt(C[B]);
      v(
        null,
        Y,
        A,
        P,
        $,
        D,
        V,
        G,
        F
      );
    }
  }, _ = (C, A, P, $, D, V, G) => {
    const F = A.el = C.el;
    let { patchFlag: K, dynamicChildren: B, dirs: Y } = A;
    K |= C.patchFlag & 16;
    const Q = C.props || ve, X = A.props || ve;
    let ie;
    if (P && Bn(P, !1), (ie = X.onVnodeBeforeUpdate) && Dt(ie, P, A, C), Y && Dn(A, C, P, "beforeUpdate"), P && Bn(P, !0), B ? x(
      C.dynamicChildren,
      B,
      F,
      P,
      $,
      $o(A, D),
      V
    ) : G || N(
      C,
      A,
      F,
      null,
      P,
      $,
      $o(A, D),
      V,
      !1
    ), K > 0) {
      if (K & 16)
        M(
          F,
          A,
          Q,
          X,
          P,
          $,
          D
        );
      else if (K & 2 && Q.class !== X.class && i(F, "class", null, X.class, D), K & 4 && i(F, "style", Q.style, X.style, D), K & 8) {
        const ue = A.dynamicProps;
        for (let ge = 0; ge < ue.length; ge++) {
          const xe = ue[ge], Fe = Q[xe], jt = X[xe];
          (jt !== Fe || xe === "value") && i(
            F,
            xe,
            Fe,
            jt,
            D,
            C.children,
            P,
            $,
            be
          );
        }
      }
      K & 1 && C.children !== A.children && u(F, A.children);
    } else
      !G && B == null && M(
        F,
        A,
        Q,
        X,
        P,
        $,
        D
      );
    ((ie = X.onVnodeUpdated) || Y) && ct(() => {
      ie && Dt(ie, P, A, C), Y && Dn(A, C, P, "updated");
    }, $);
  }, x = (C, A, P, $, D, V, G) => {
    for (let F = 0; F < A.length; F++) {
      const K = C[F], B = A[F], Y = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        K.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (K.type === Pe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Wn(K, B) || // - In the case of a component, it could contain anything.
        K.shapeFlag & 70) ? f(K.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          P
        )
      );
      v(
        K,
        B,
        Y,
        null,
        $,
        D,
        V,
        G,
        !0
      );
    }
  }, M = (C, A, P, $, D, V, G) => {
    if (P !== $) {
      if (P !== ve)
        for (const F in P)
          !Yr(F) && !(F in $) && i(
            C,
            F,
            P[F],
            null,
            G,
            A.children,
            D,
            V,
            be
          );
      for (const F in $) {
        if (Yr(F))
          continue;
        const K = $[F], B = P[F];
        K !== B && F !== "value" && i(
          C,
          F,
          B,
          K,
          G,
          A.children,
          D,
          V,
          be
        );
      }
      "value" in $ && i(C, "value", P.value, $.value, G);
    }
  }, O = (C, A, P, $, D, V, G, F, K) => {
    const B = A.el = C ? C.el : l(""), Y = A.anchor = C ? C.anchor : l("");
    let { patchFlag: Q, dynamicChildren: X, slotScopeIds: ie } = A;
    ie && (F = F ? F.concat(ie) : ie), C == null ? (r(B, P, $), r(Y, P, $), w(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      A.children || [],
      P,
      Y,
      D,
      V,
      G,
      F,
      K
    )) : Q > 0 && Q & 64 && X && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    C.dynamicChildren ? (x(
      C.dynamicChildren,
      X,
      P,
      D,
      V,
      G,
      F
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (A.key != null || D && A === D.subTree) && $f(
      C,
      A,
      !0
      /* shallow */
    )) : N(
      C,
      A,
      P,
      Y,
      D,
      V,
      G,
      F,
      K
    );
  }, L = (C, A, P, $, D, V, G, F, K) => {
    A.slotScopeIds = F, C == null ? A.shapeFlag & 512 ? D.ctx.activate(
      A,
      P,
      $,
      G,
      K
    ) : I(
      A,
      P,
      $,
      D,
      V,
      G,
      K
    ) : z(C, A, K);
  }, I = (C, A, P, $, D, V, G) => {
    const F = C.component = B1(
      C,
      $,
      D
    );
    if (yo(C) && (F.ctx.renderer = zt), H1(F), F.asyncDep) {
      if (D && D.registerDep(F, S), !C.el) {
        const K = F.subTree = Ce(At);
        E(null, K, A, P);
      }
    } else
      S(
        F,
        C,
        A,
        P,
        D,
        V,
        G
      );
  }, z = (C, A, P) => {
    const $ = A.component = C.component;
    if (Km(C, A, P))
      if ($.asyncDep && !$.asyncResolved) {
        R($, A, P);
        return;
      } else
        $.next = A, Dm($.update), $.effect.dirty = !0, $.update();
    else
      A.el = C.el, $.vnode = A;
  }, S = (C, A, P, $, D, V, G) => {
    const F = () => {
      if (C.isMounted) {
        let { next: Y, bu: Q, u: X, parent: ie, vnode: ue } = C;
        {
          const ur = Df(C);
          if (ur) {
            Y && (Y.el = ue.el, R(C, Y, G)), ur.asyncDep.then(() => {
              C.isUnmounted || F();
            });
            return;
          }
        }
        let ge = Y, xe;
        Bn(C, !1), Y ? (Y.el = ue.el, R(C, Y, G)) : Y = ue, Q && Zs(Q), (xe = Y.props && Y.props.onVnodeBeforeUpdate) && Dt(xe, ie, Y, ue), Bn(C, !0);
        const Fe = Io(C), jt = C.subTree;
        C.subTree = Fe, v(
          jt,
          Fe,
          // parent may have changed if it's in a teleport
          f(jt.el),
          // anchor may have changed if it's in a fragment
          $e(jt),
          C,
          D,
          V
        ), Y.el = Fe.el, ge === null && Um(C, Fe.el), X && ct(X, D), (xe = Y.props && Y.props.onVnodeUpdated) && ct(
          () => Dt(xe, ie, Y, ue),
          D
        );
      } else {
        let Y;
        const { el: Q, props: X } = A, { bm: ie, m: ue, parent: ge } = C, xe = Zr(A);
        if (Bn(C, !1), ie && Zs(ie), !xe && (Y = X && X.onVnodeBeforeMount) && Dt(Y, ge, A), Bn(C, !0), Q && $n) {
          const Fe = () => {
            C.subTree = Io(C), $n(
              Q,
              C.subTree,
              C,
              D,
              null
            );
          };
          xe ? A.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !C.isUnmounted && Fe()
          ) : Fe();
        } else {
          const Fe = C.subTree = Io(C);
          v(
            null,
            Fe,
            P,
            $,
            C,
            D,
            V
          ), A.el = Fe.el;
        }
        if (ue && ct(ue, D), !xe && (Y = X && X.onVnodeMounted)) {
          const Fe = A;
          ct(
            () => Dt(Y, ge, Fe),
            D
          );
        }
        (A.shapeFlag & 256 || ge && Zr(ge.vnode) && ge.vnode.shapeFlag & 256) && C.a && ct(C.a, D), C.isMounted = !0, A = P = $ = null;
      }
    }, K = C.effect = new ya(
      F,
      bt,
      () => Ma(B),
      C.scope
      // track it in component's effect scope
    ), B = C.update = () => {
      K.dirty && K.run();
    };
    B.id = C.uid, Bn(C, !0), B();
  }, R = (C, A, P) => {
    A.component = C;
    const $ = C.vnode.props;
    C.vnode = A, C.next = null, E1(C, A.props, $, P), T1(C, A.children, P), Ln(), Dc(C), Pn();
  }, N = (C, A, P, $, D, V, G, F, K = !1) => {
    const B = C && C.children, Y = C ? C.shapeFlag : 0, Q = A.children, { patchFlag: X, shapeFlag: ie } = A;
    if (X > 0) {
      if (X & 128) {
        re(
          B,
          Q,
          P,
          $,
          D,
          V,
          G,
          F,
          K
        );
        return;
      } else if (X & 256) {
        q(
          B,
          Q,
          P,
          $,
          D,
          V,
          G,
          F,
          K
        );
        return;
      }
    }
    ie & 8 ? (Y & 16 && be(B, D, V), Q !== B && u(P, Q)) : Y & 16 ? ie & 16 ? re(
      B,
      Q,
      P,
      $,
      D,
      V,
      G,
      F,
      K
    ) : be(B, D, V, !0) : (Y & 8 && u(P, ""), ie & 16 && w(
      Q,
      P,
      $,
      D,
      V,
      G,
      F,
      K
    ));
  }, q = (C, A, P, $, D, V, G, F, K) => {
    C = C || xr, A = A || xr;
    const B = C.length, Y = A.length, Q = Math.min(B, Y);
    let X;
    for (X = 0; X < Q; X++) {
      const ie = A[X] = K ? gn(A[X]) : Kt(A[X]);
      v(
        C[X],
        ie,
        P,
        null,
        D,
        V,
        G,
        F,
        K
      );
    }
    B > Y ? be(
      C,
      D,
      V,
      !0,
      !1,
      Q
    ) : w(
      A,
      P,
      $,
      D,
      V,
      G,
      F,
      K,
      Q
    );
  }, re = (C, A, P, $, D, V, G, F, K) => {
    let B = 0;
    const Y = A.length;
    let Q = C.length - 1, X = Y - 1;
    for (; B <= Q && B <= X; ) {
      const ie = C[B], ue = A[B] = K ? gn(A[B]) : Kt(A[B]);
      if (Wn(ie, ue))
        v(
          ie,
          ue,
          P,
          null,
          D,
          V,
          G,
          F,
          K
        );
      else
        break;
      B++;
    }
    for (; B <= Q && B <= X; ) {
      const ie = C[Q], ue = A[X] = K ? gn(A[X]) : Kt(A[X]);
      if (Wn(ie, ue))
        v(
          ie,
          ue,
          P,
          null,
          D,
          V,
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
          v(
            null,
            A[B] = K ? gn(A[B]) : Kt(A[B]),
            P,
            ue,
            D,
            V,
            G,
            F,
            K
          ), B++;
      }
    } else if (B > X)
      for (; B <= Q; )
        ce(C[B], D, V, !0), B++;
    else {
      const ie = B, ue = B, ge = /* @__PURE__ */ new Map();
      for (B = ue; B <= X; B++) {
        const pt = A[B] = K ? gn(A[B]) : Kt(A[B]);
        pt.key != null && ge.set(pt.key, B);
      }
      let xe, Fe = 0;
      const jt = X - ue + 1;
      let ur = !1, Ac = 0;
      const Br = new Array(jt);
      for (B = 0; B < jt; B++)
        Br[B] = 0;
      for (B = ie; B <= Q; B++) {
        const pt = C[B];
        if (Fe >= jt) {
          ce(pt, D, V, !0);
          continue;
        }
        let $t;
        if (pt.key != null)
          $t = ge.get(pt.key);
        else
          for (xe = ue; xe <= X; xe++)
            if (Br[xe - ue] === 0 && Wn(pt, A[xe])) {
              $t = xe;
              break;
            }
        $t === void 0 ? ce(pt, D, V, !0) : (Br[$t - ue] = B + 1, $t >= Ac ? Ac = $t : ur = !0, v(
          pt,
          A[$t],
          P,
          null,
          D,
          V,
          G,
          F,
          K
        ), Fe++);
      }
      const Tc = ur ? L1(Br) : xr;
      for (xe = Tc.length - 1, B = jt - 1; B >= 0; B--) {
        const pt = ue + B, $t = A[pt], jc = pt + 1 < Y ? A[pt + 1].el : $;
        Br[B] === 0 ? v(
          null,
          $t,
          P,
          jc,
          D,
          V,
          G,
          F,
          K
        ) : ur && (xe < 0 || B !== Tc[xe] ? J($t, P, jc, 2) : xe--);
      }
    }
  }, J = (C, A, P, $, D = null) => {
    const { el: V, type: G, transition: F, children: K, shapeFlag: B } = C;
    if (B & 6) {
      J(C.component.subTree, A, P, $);
      return;
    }
    if (B & 128) {
      C.suspense.move(A, P, $);
      return;
    }
    if (B & 64) {
      G.move(C, A, P, zt);
      return;
    }
    if (G === Pe) {
      r(V, A, P);
      for (let Q = 0; Q < K.length; Q++)
        J(K[Q], A, P, $);
      r(C.anchor, A, P);
      return;
    }
    if (G === Do) {
      j(C, A, P);
      return;
    }
    if ($ !== 2 && B & 1 && F)
      if ($ === 0)
        F.beforeEnter(V), r(V, A, P), ct(() => F.enter(V), D);
      else {
        const { leave: Q, delayLeave: X, afterLeave: ie } = F, ue = () => r(V, A, P), ge = () => {
          Q(V, () => {
            ue(), ie && ie();
          });
        };
        X ? X(V, ue, ge) : ge();
      }
    else
      r(V, A, P);
  }, ce = (C, A, P, $ = !1, D = !1) => {
    const {
      type: V,
      props: G,
      ref: F,
      children: K,
      dynamicChildren: B,
      shapeFlag: Y,
      patchFlag: Q,
      dirs: X
    } = C;
    if (F != null && Al(F, null, P, C, !0), Y & 256) {
      A.ctx.deactivate(C);
      return;
    }
    const ie = Y & 1 && X, ue = !Zr(C);
    let ge;
    if (ue && (ge = G && G.onVnodeBeforeUnmount) && Dt(ge, A, C), Y & 6)
      Te(C.component, P, $);
    else {
      if (Y & 128) {
        C.suspense.unmount(P, $);
        return;
      }
      ie && Dn(C, null, A, "beforeUnmount"), Y & 64 ? C.type.remove(
        C,
        A,
        P,
        D,
        zt,
        $
      ) : B && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (V !== Pe || Q > 0 && Q & 64) ? be(
        B,
        A,
        P,
        !1,
        !0
      ) : (V === Pe && Q & 384 || !D && Y & 16) && be(K, A, P), $ && Me(C);
    }
    (ue && (ge = G && G.onVnodeUnmounted) || ie) && ct(() => {
      ge && Dt(ge, A, C), ie && Dn(C, null, A, "unmounted");
    }, P);
  }, Me = (C) => {
    const { type: A, el: P, anchor: $, transition: D } = C;
    if (A === Pe) {
      Ae(P, $);
      return;
    }
    if (A === Do) {
      d(C);
      return;
    }
    const V = () => {
      s(P), D && !D.persisted && D.afterLeave && D.afterLeave();
    };
    if (C.shapeFlag & 1 && D && !D.persisted) {
      const { leave: G, delayLeave: F } = D, K = () => G(P, V);
      F ? F(C.el, V, K) : K();
    } else
      V();
  }, Ae = (C, A) => {
    let P;
    for (; C !== A; )
      P = h(C), s(C), C = P;
    s(A);
  }, Te = (C, A, P) => {
    const { bum: $, scope: D, update: V, subTree: G, um: F } = C;
    $ && Zs($), D.stop(), V && (V.active = !1, ce(G, C, A, P)), F && ct(F, A), ct(() => {
      C.isUnmounted = !0;
    }, A), A && A.pendingBranch && !A.isUnmounted && C.asyncDep && !C.asyncResolved && C.suspenseId === A.pendingId && (A.deps--, A.deps === 0 && A.resolve());
  }, be = (C, A, P, $ = !1, D = !1, V = 0) => {
    for (let G = V; G < C.length; G++)
      ce(C[G], A, P, $, D);
  }, $e = (C) => C.shapeFlag & 6 ? $e(C.component.subTree) : C.shapeFlag & 128 ? C.suspense.next() : h(C.anchor || C.el);
  let qe = !1;
  const ar = (C, A, P) => {
    C == null ? A._vnode && ce(A._vnode, null, null, !0) : v(
      A._vnode || null,
      C,
      A,
      null,
      null,
      null,
      P
    ), qe || (qe = !0, Dc(), wf(), qe = !1), A._vnode = C;
  }, zt = {
    p: v,
    um: ce,
    m: J,
    r: Me,
    mt: I,
    mc: w,
    pc: N,
    pbc: x,
    n: $e,
    o: t
  };
  let cr, $n;
  return e && ([cr, $n] = e(
    zt
  )), {
    render: ar,
    hydrate: cr,
    createApp: k1(ar, cr)
  };
}
function $o({ type: t, props: e }, n) {
  return n === "svg" && t === "foreignObject" || n === "mathml" && t === "annotation-xml" && e && e.encoding && e.encoding.includes("html") ? void 0 : n;
}
function Bn({ effect: t, update: e }, n) {
  t.allowRecurse = e.allowRecurse = n;
}
function R1(t, e) {
  return (!t || t && !t.pendingBranch) && e && !e.persisted;
}
function $f(t, e, n = !1) {
  const r = t.children, s = e.children;
  if (ee(r) && ee(s))
    for (let i = 0; i < r.length; i++) {
      const o = r[i];
      let l = s[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = s[i] = gn(s[i]), l.el = o.el), n || $f(o, l)), l.type === vo && (l.el = o.el);
    }
}
function L1(t) {
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
function Df(t) {
  const e = t.subTree.component;
  if (e)
    return e.asyncDep && !e.asyncResolved ? e : Df(e);
}
const P1 = (t) => t.__isTeleport, Pe = Symbol.for("v-fgt"), vo = Symbol.for("v-txt"), At = Symbol.for("v-cmt"), Do = Symbol.for("v-stc"), rs = [];
let Lt = null;
function ne(t = !1) {
  rs.push(Lt = t ? null : []);
}
function I1() {
  rs.pop(), Lt = rs[rs.length - 1] || null;
}
let hs = 1;
function Qc(t) {
  hs += t;
}
function Bf(t) {
  return t.dynamicChildren = hs > 0 ? Lt || xr : null, I1(), hs > 0 && Lt && Lt.push(t), t;
}
function pe(t, e, n, r, s, i) {
  return Bf(
    ae(
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
function tt(t, e, n, r, s) {
  return Bf(
    Ce(
      t,
      e,
      n,
      r,
      s,
      !0
    )
  );
}
function gi(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Wn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const wo = "__vInternal", Hf = ({ key: t }) => t ?? null, ti = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Le(t) || lt(t) || oe(t) ? { i: Be, r: t, k: e, f: !!n } : t : null);
function ae(t, e = null, n = null, r = 0, s = null, i = t === Pe ? 0 : 1, o = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && Hf(e),
    ref: e && ti(e),
    scopeId: go,
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
    ctx: Be
  };
  return l ? (Na(a, n), i & 128 && t.normalize(a)) : n && (a.shapeFlag |= Le(n) ? 8 : 16), hs > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Lt && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Lt.push(a), a;
}
const Ce = N1;
function N1(t, e = null, n = null, r = 0, s = null, i = !1) {
  if ((!t || t === qm) && (t = At), gi(t)) {
    const l = jn(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Na(l, n), hs > 0 && !i && Lt && (l.shapeFlag & 6 ? Lt[Lt.indexOf(t)] = l : Lt.push(l)), l.patchFlag |= -2, l;
  }
  if (U1(t) && (t = t.__vccOpts), e) {
    e = z1(e);
    let { class: l, style: a } = e;
    l && !Le(l) && (e.class = Ut(l)), we(a) && (uf(a) && !ee(a) && (a = He({}, a)), e.style = ga(a));
  }
  const o = Le(t) ? 1 : Jm(t) ? 128 : P1(t) ? 64 : we(t) ? 4 : oe(t) ? 2 : 0;
  return ae(
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
function z1(t) {
  return t ? uf(t) || wo in t ? He({}, t) : t : null;
}
function jn(t, e, n = !1) {
  const { props: r, ref: s, patchFlag: i, children: o } = t, l = e ? za(r || {}, e) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: l,
    key: l && Hf(l),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? ee(s) ? s.concat(ti(e)) : [s, ti(e)] : ti(e)
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
    ssContent: t.ssContent && jn(t.ssContent),
    ssFallback: t.ssFallback && jn(t.ssFallback),
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
}
function er(t = " ", e = 0) {
  return Ce(vo, null, t, e);
}
function Je(t = "", e = !1) {
  return e ? (ne(), tt(At, null, t)) : Ce(At, null, t);
}
function Kt(t) {
  return t == null || typeof t == "boolean" ? Ce(At) : ee(t) ? Ce(
    Pe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : typeof t == "object" ? gn(t) : Ce(vo, null, String(t));
}
function gn(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : jn(t);
}
function Na(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (ee(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const s = e.default;
      s && (s._c && (s._d = !1), Na(t, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = e._;
      !s && !(wo in e) ? e._ctx = Be : s === 3 && Be && (Be.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else
    oe(e) ? (e = { default: e, _ctx: Be }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [er(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function za(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const s in r)
      if (s === "class")
        e.class !== r.class && (e.class = Ut([e.class, r.class]));
      else if (s === "style")
        e.style = ga([e.style, r.style]);
      else if (lo(s)) {
        const i = e[s], o = r[s];
        o && i !== o && !(ee(i) && i.includes(o)) && (e[s] = i ? [].concat(i, o) : o);
      } else
        s !== "" && (e[s] = r[s]);
  }
  return e;
}
function Dt(t, e, n, r = null) {
  Mt(t, e, 7, [
    n,
    r
  ]);
}
const $1 = Rf();
let D1 = 0;
function B1(t, e, n) {
  const r = t.type, s = (e ? e.appContext : t.appContext) || $1, i = {
    uid: D1++,
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
    scope: new im(
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
    propsOptions: Pf(r, s),
    emitsOptions: _f(r, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ve,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: ve,
    data: ve,
    props: ve,
    attrs: ve,
    slots: ve,
    refs: ve,
    setupState: ve,
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
  return i.ctx = { _: i }, i.root = e ? e.root : i, i.emit = Fm.bind(null, i), t.ce && t.ce(i), i;
}
let De = null;
const $a = () => De || Be;
let yi, Tl;
{
  const t = Gd(), e = (n, r) => {
    let s;
    return (s = t[n]) || (s = t[n] = []), s.push(r), (i) => {
      s.length > 1 ? s.forEach((o) => o(i)) : s[0](i);
    };
  };
  yi = e(
    "__VUE_INSTANCE_SETTERS__",
    (n) => De = n
  ), Tl = e(
    "__VUE_SSR_SETTERS__",
    (n) => xo = n
  );
}
const ks = (t) => {
  const e = De;
  return yi(t), t.scope.on(), () => {
    t.scope.off(), yi(e);
  };
}, Zc = () => {
  De && De.scope.off(), yi(null);
};
function Ff(t) {
  return t.vnode.shapeFlag & 4;
}
let xo = !1;
function H1(t, e = !1) {
  e && Tl(e);
  const { props: n, children: r } = t.vnode, s = Ff(t);
  C1(t, n, s, e), A1(t, r);
  const i = s ? F1(t, e) : void 0;
  return e && Tl(!1), i;
}
function F1(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = df(new Proxy(t.ctx, p1));
  const { setup: r } = n;
  if (r) {
    const s = t.setupContext = r.length > 1 ? Wf(t) : null, i = ks(t);
    Ln();
    const o = rn(
      r,
      t,
      0,
      [
        t.props,
        s
      ]
    );
    if (Pn(), i(), Kd(o)) {
      if (o.then(Zc, Zc), e)
        return o.then((l) => {
          eu(t, l, e);
        }).catch((l) => {
          po(l, t, 0);
        });
      t.asyncDep = o;
    } else
      eu(t, o, e);
  } else
    Vf(t, e);
}
function eu(t, e, n) {
  oe(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : we(e) && (t.setupState = gf(e)), Vf(t, n);
}
let tu;
function Vf(t, e, n) {
  const r = t.type;
  if (!t.render) {
    if (!e && tu && !r.render) {
      const s = r.template || Pa(t).template;
      if (s) {
        const { isCustomElement: i, compilerOptions: o } = t.appContext.config, { delimiters: l, compilerOptions: a } = r, c = He(
          He(
            {
              isCustomElement: i,
              delimiters: l
            },
            o
          ),
          a
        );
        r.render = tu(s, c);
      }
    }
    t.render = r.render || bt;
  }
  {
    const s = ks(t);
    Ln();
    try {
      y1(t);
    } finally {
      Pn(), s();
    }
  }
}
function V1(t) {
  return t.attrsProxy || (t.attrsProxy = new Proxy(
    t.attrs,
    {
      get(e, n) {
        return ht(t, "get", "$attrs"), e[n];
      }
    }
  ));
}
function Wf(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    get attrs() {
      return V1(t);
    },
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function _o(t) {
  if (t.exposed)
    return t.exposeProxy || (t.exposeProxy = new Proxy(gf(df(t.exposed)), {
      get(e, n) {
        if (n in e)
          return e[n];
        if (n in es)
          return es[n](t);
      },
      has(e, n) {
        return n in e || n in es;
      }
    }));
}
const W1 = /(?:^|[-_])(\w)/g, K1 = (t) => t.replace(W1, (e) => e.toUpperCase()).replace(/[-_]/g, "");
function Kf(t, e = !0) {
  return oe(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Uf(t, e, n = !1) {
  let r = Kf(e);
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
  return r ? K1(r) : n ? "App" : "Anonymous";
}
function U1(t) {
  return oe(t) && "__vccOpts" in t;
}
const Kn = (t, e) => Am(t, e, xo);
function Da(t, e, n) {
  const r = arguments.length;
  return r === 2 ? we(e) && !ee(e) ? gi(e) ? Ce(t, null, [e]) : Ce(t, e) : Ce(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && gi(n) && (n = [n]), Ce(t, e, n));
}
const q1 = "3.4.19", G1 = "http://www.w3.org/2000/svg", J1 = "http://www.w3.org/1998/Math/MathML", yn = typeof document < "u" ? document : null, nu = yn && /* @__PURE__ */ yn.createElement("template"), Y1 = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const s = e === "svg" ? yn.createElementNS(G1, t) : e === "mathml" ? yn.createElementNS(J1, t) : yn.createElement(t, n ? { is: n } : void 0);
    return t === "select" && r && r.multiple != null && s.setAttribute("multiple", r.multiple), s;
  },
  createText: (t) => yn.createTextNode(t),
  createComment: (t) => yn.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => yn.querySelector(t),
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
      nu.innerHTML = r === "svg" ? `<svg>${t}</svg>` : r === "mathml" ? `<math>${t}</math>` : t;
      const l = nu.content;
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
}, an = "transition", Hr = "animation", ps = Symbol("_vtc"), Ba = (t, { slots: e }) => Da(r1, X1(t), e);
Ba.displayName = "Transition";
const qf = {
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
Ba.props = /* @__PURE__ */ He(
  {},
  Cf,
  qf
);
const Hn = (t, e = []) => {
  ee(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, ru = (t) => t ? ee(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function X1(t) {
  const e = {};
  for (const O in t)
    O in qf || (e[O] = t[O]);
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
    leaveToClass: g = `${n}-leave-to`
  } = t, y = Q1(s), v = y && y[0], k = y && y[1], {
    onBeforeEnter: E,
    onEnter: T,
    onEnterCancelled: j,
    onLeave: d,
    onLeaveCancelled: m,
    onBeforeAppear: p = E,
    onAppear: b = T,
    onAppearCancelled: w = j
  } = e, _ = (O, L, I) => {
    Fn(O, L ? u : l), Fn(O, L ? c : o), I && I();
  }, x = (O, L) => {
    O._isLeaving = !1, Fn(O, f), Fn(O, g), Fn(O, h), L && L();
  }, M = (O) => (L, I) => {
    const z = O ? b : T, S = () => _(L, O, I);
    Hn(z, [L, S]), su(() => {
      Fn(L, O ? a : i), cn(L, O ? u : l), ru(z) || iu(L, r, v, S);
    });
  };
  return He(e, {
    onBeforeEnter(O) {
      Hn(E, [O]), cn(O, i), cn(O, o);
    },
    onBeforeAppear(O) {
      Hn(p, [O]), cn(O, a), cn(O, c);
    },
    onEnter: M(!1),
    onAppear: M(!0),
    onLeave(O, L) {
      O._isLeaving = !0;
      const I = () => x(O, L);
      cn(O, f), tg(), cn(O, h), su(() => {
        O._isLeaving && (Fn(O, f), cn(O, g), ru(d) || iu(O, r, k, I));
      }), Hn(d, [O, I]);
    },
    onEnterCancelled(O) {
      _(O, !1), Hn(j, [O]);
    },
    onAppearCancelled(O) {
      _(O, !0), Hn(w, [O]);
    },
    onLeaveCancelled(O) {
      x(O), Hn(m, [O]);
    }
  });
}
function Q1(t) {
  if (t == null)
    return null;
  if (we(t))
    return [Bo(t.enter), Bo(t.leave)];
  {
    const e = Bo(t);
    return [e, e];
  }
}
function Bo(t) {
  return Qp(t);
}
function cn(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t[ps] || (t[ps] = /* @__PURE__ */ new Set())).add(e);
}
function Fn(t, e) {
  e.split(/\s+/).forEach((r) => r && t.classList.remove(r));
  const n = t[ps];
  n && (n.delete(e), n.size || (t[ps] = void 0));
}
function su(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let Z1 = 0;
function iu(t, e, n, r) {
  const s = t._endId = ++Z1, i = () => {
    s === t._endId && r();
  };
  if (n)
    return setTimeout(i, n);
  const { type: o, timeout: l, propCount: a } = eg(t, e);
  if (!o)
    return r();
  const c = o + "end";
  let u = 0;
  const f = () => {
    t.removeEventListener(c, h), i();
  }, h = (g) => {
    g.target === t && ++u >= a && f();
  };
  setTimeout(() => {
    u < a && f();
  }, l + 1), t.addEventListener(c, h);
}
function eg(t, e) {
  const n = window.getComputedStyle(t), r = (y) => (n[y] || "").split(", "), s = r(`${an}Delay`), i = r(`${an}Duration`), o = ou(s, i), l = r(`${Hr}Delay`), a = r(`${Hr}Duration`), c = ou(l, a);
  let u = null, f = 0, h = 0;
  e === an ? o > 0 && (u = an, f = o, h = i.length) : e === Hr ? c > 0 && (u = Hr, f = c, h = a.length) : (f = Math.max(o, c), u = f > 0 ? o > c ? an : Hr : null, h = u ? u === an ? i.length : a.length : 0);
  const g = u === an && /\b(transform|all)(,|$)/.test(
    r(`${an}Property`).toString()
  );
  return {
    type: u,
    timeout: f,
    propCount: h,
    hasTransform: g
  };
}
function ou(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, r) => lu(n) + lu(t[r])));
}
function lu(t) {
  return t === "auto" ? 0 : Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function tg() {
  return document.body.offsetHeight;
}
function ng(t, e, n) {
  const r = t[ps];
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
const au = Symbol("_vod"), rg = Symbol(""), sg = /(^|;)\s*display\s*:/;
function ig(t, e, n) {
  const r = t.style, s = Le(n), i = r.display;
  let o = !1;
  if (n && !s) {
    if (e && !Le(e))
      for (const l in e)
        n[l] == null && jl(r, l, "");
    for (const l in n)
      l === "display" && (o = !0), jl(r, l, n[l]);
  } else if (s) {
    if (e !== n) {
      const l = r[rg];
      l && (n += ";" + l), r.cssText = n, o = sg.test(n);
    }
  } else
    e && t.removeAttribute("style");
  au in t && (t[au] = o ? r.display : "", r.display = i);
}
const cu = /\s*!important$/;
function jl(t, e, n) {
  if (ee(n))
    n.forEach((r) => jl(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = og(t, e);
    cu.test(n) ? t.setProperty(
      Nr(r),
      n.replace(cu, ""),
      "important"
    ) : t[r] = n;
  }
}
const uu = ["Webkit", "Moz", "ms"], Ho = {};
function og(t, e) {
  const n = Ho[e];
  if (n)
    return n;
  let r = Yt(e);
  if (r !== "filter" && r in t)
    return Ho[e] = r;
  r = uo(r);
  for (let s = 0; s < uu.length; s++) {
    const i = uu[s] + r;
    if (i in t)
      return Ho[e] = i;
  }
  return e;
}
const du = "http://www.w3.org/1999/xlink";
function lg(t, e, n, r, s) {
  if (r && e.startsWith("xlink:"))
    n == null ? t.removeAttributeNS(du, e.slice(6, e.length)) : t.setAttributeNS(du, e, n);
  else {
    const i = sm(e);
    n == null || i && !Jd(n) ? t.removeAttribute(e) : t.setAttribute(e, i ? "" : n);
  }
}
function ag(t, e, n, r, s, i, o) {
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
    c === "boolean" ? n = Jd(n) : n == null && c === "string" ? (n = "", a = !0) : c === "number" && (n = 0, a = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  a && t.removeAttribute(e);
}
function hr(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function cg(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
const fu = Symbol("_vei");
function ug(t, e, n, r, s = null) {
  const i = t[fu] || (t[fu] = {}), o = i[e];
  if (r && o)
    o.value = r;
  else {
    const [l, a] = dg(e);
    if (r) {
      const c = i[e] = pg(r, s);
      hr(t, l, c, a);
    } else
      o && (cg(t, l, o, a), i[e] = void 0);
  }
}
const hu = /(?:Once|Passive|Capture)$/;
function dg(t) {
  let e;
  if (hu.test(t)) {
    e = {};
    let r;
    for (; r = t.match(hu); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Nr(t.slice(2)), e];
}
let Fo = 0;
const fg = /* @__PURE__ */ Promise.resolve(), hg = () => Fo || (fg.then(() => Fo = 0), Fo = Date.now());
function pg(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    Mt(
      mg(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = hg(), n;
}
function mg(t, e) {
  if (ee(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map((r) => (s) => !s._stopped && r && r(s));
  } else
    return e;
}
const pu = (t) => t.charCodeAt(0) === 111 && t.charCodeAt(1) === 110 && // lowercase letter
t.charCodeAt(2) > 96 && t.charCodeAt(2) < 123, gg = (t, e, n, r, s, i, o, l, a) => {
  const c = s === "svg";
  e === "class" ? ng(t, r, c) : e === "style" ? ig(t, n, r) : lo(e) ? ha(e) || ug(t, e, n, r, o) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : yg(t, e, r, c)) ? ag(
    t,
    e,
    r,
    i,
    o,
    l,
    a
  ) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), lg(t, e, r, c));
};
function yg(t, e, n, r) {
  if (r)
    return !!(e === "innerHTML" || e === "textContent" || e in t && pu(e) && oe(n));
  if (e === "spellcheck" || e === "draggable" || e === "translate" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA")
    return !1;
  if (e === "width" || e === "height") {
    const s = t.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return pu(e) && Le(n) ? !1 : e in t;
}
const mu = (t) => {
  const e = t.props["onUpdate:modelValue"] || !1;
  return ee(e) ? (n) => Zs(e, n) : e;
};
function bg(t) {
  t.target.composing = !0;
}
function gu(t) {
  const e = t.target;
  e.composing && (e.composing = !1, e.dispatchEvent(new Event("input")));
}
const Vo = Symbol("_assign"), yu = {
  created(t, { modifiers: { lazy: e, trim: n, number: r } }, s) {
    t[Vo] = mu(s);
    const i = r || s.props && s.props.type === "number";
    hr(t, e ? "change" : "input", (o) => {
      if (o.target.composing)
        return;
      let l = t.value;
      n && (l = l.trim()), i && (l = gl(l)), t[Vo](l);
    }), n && hr(t, "change", () => {
      t.value = t.value.trim();
    }), e || (hr(t, "compositionstart", bg), hr(t, "compositionend", gu), hr(t, "change", gu));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(t, { value: e }) {
    t.value = e ?? "";
  },
  beforeUpdate(t, { value: e, modifiers: { lazy: n, trim: r, number: s } }, i) {
    if (t[Vo] = mu(i), t.composing)
      return;
    const o = s || t.type === "number" ? gl(t.value) : t.value, l = e ?? "";
    o !== l && (document.activeElement === t && t.type !== "range" && (n || r && t.value.trim() === l) || (t.value = l));
  }
}, vg = /* @__PURE__ */ He({ patchProp: gg }, Y1);
let bu;
function wg() {
  return bu || (bu = j1(vg));
}
const xg = (...t) => {
  const e = wg().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const s = kg(r);
    if (!s)
      return;
    const i = e._component;
    !oe(i) && !i.render && !i.template && (i.template = s.innerHTML), s.innerHTML = "";
    const o = n(s, !1, _g(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), o;
  }, e;
};
function _g(t) {
  if (t instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && t instanceof MathMLElement)
    return "mathml";
}
function kg(t) {
  return Le(t) ? document.querySelector(t) : t;
}
function Sg(t) {
  return Xd() ? (lm(t), !0) : !1;
}
function Ha(t) {
  return typeof t == "function" ? t() : mf(t);
}
const Cg = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Eg = Object.prototype.toString, Mg = (t) => Eg.call(t) === "[object Object]", Ag = () => {
};
function Tg(t, e) {
  function n(...r) {
    return new Promise((s, i) => {
      Promise.resolve(t(() => e.apply(this, r), { fn: e, thisArg: this, args: r })).then(s).catch(i);
    });
  }
  return n;
}
const Gf = (t) => t();
function jg(t = Gf) {
  const e = ho(!0);
  function n() {
    e.value = !1;
  }
  function r() {
    e.value = !0;
  }
  const s = (...i) => {
    e.value && t(...i);
  };
  return { isActive: _a(e), pause: n, resume: r, eventFilter: s };
}
function Og(t) {
  return t || $a();
}
function Rg(t, e, n = {}) {
  const {
    eventFilter: r = Gf,
    ...s
  } = n;
  return Cr(
    t,
    Tg(
      r,
      e
    ),
    s
  );
}
function Lg(t, e, n = {}) {
  const {
    eventFilter: r,
    ...s
  } = n, { eventFilter: i, pause: o, resume: l, isActive: a } = jg(r);
  return { stop: Rg(
    t,
    e,
    {
      ...s,
      eventFilter: i
    }
  ), pause: o, resume: l, isActive: a };
}
function Pg(t, e = !0, n) {
  Og() ? Oa(t, n) : e ? t() : Ea(t);
}
function Ig(t) {
  var e;
  const n = Ha(t);
  return (e = n?.$el) != null ? e : n;
}
const Ol = Cg ? window : void 0;
function vu(...t) {
  let e, n, r, s;
  if (typeof t[0] == "string" || Array.isArray(t[0]) ? ([n, r, s] = t, e = Ol) : [e, n, r, s] = t, !e)
    return Ag;
  Array.isArray(n) || (n = [n]), Array.isArray(r) || (r = [r]);
  const i = [], o = () => {
    i.forEach((u) => u()), i.length = 0;
  }, l = (u, f, h, g) => (u.addEventListener(f, h, g), () => u.removeEventListener(f, h, g)), a = Cr(
    () => [Ig(e), Ha(s)],
    ([u, f]) => {
      if (o(), !u)
        return;
      const h = Mg(f) ? { ...f } : f;
      i.push(
        ...n.flatMap((g) => r.map((y) => l(u, g, y, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    a(), o();
  };
  return Sg(c), c;
}
const Is = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ns = "__vueuse_ssr_handlers__", Ng = /* @__PURE__ */ zg();
function zg() {
  return Ns in Is || (Is[Ns] = Is[Ns] || {}), Is[Ns];
}
function $g(t, e) {
  return Ng[t] || e;
}
function Dg(t) {
  return t == null ? "any" : t instanceof Set ? "set" : t instanceof Map ? "map" : t instanceof Date ? "date" : typeof t == "boolean" ? "boolean" : typeof t == "string" ? "string" : typeof t == "object" ? "object" : Number.isNaN(t) ? "any" : "number";
}
const Bg = {
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
}, wu = "vueuse-storage";
function Hg(t, e, n, r = {}) {
  var s;
  const {
    flush: i = "pre",
    deep: o = !0,
    listenToStorageChanges: l = !0,
    writeDefaults: a = !0,
    mergeDefaults: c = !1,
    shallow: u,
    window: f = Ol,
    eventFilter: h,
    onError: g = (_) => {
      console.error(_);
    },
    initOnMounted: y
  } = r, v = (u ? Tm : ho)(typeof e == "function" ? e() : e);
  if (!n)
    try {
      n = $g("getDefaultStorage", () => {
        var _;
        return (_ = Ol) == null ? void 0 : _.localStorage;
      })();
    } catch (_) {
      g(_);
    }
  if (!n)
    return v;
  const k = Ha(e), E = Dg(k), T = (s = r.serializer) != null ? s : Bg[E], { pause: j, resume: d } = Lg(
    v,
    () => m(v.value),
    { flush: i, deep: o, eventFilter: h }
  );
  return f && l && Pg(() => {
    vu(f, "storage", w), vu(f, wu, b), y && w();
  }), y || w(), v;
  function m(_) {
    try {
      const x = n.getItem(t), M = (O) => {
        f && f.dispatchEvent(new CustomEvent(wu, {
          detail: {
            key: t,
            oldValue: x,
            newValue: O,
            storageArea: n
          }
        }));
      };
      if (_ == null)
        M(null), n.removeItem(t);
      else {
        const O = T.write(_);
        x !== O && (n.setItem(t, O), M(O));
      }
    } catch (x) {
      g(x);
    }
  }
  function p(_) {
    const x = _ ? _.newValue : n.getItem(t);
    if (x == null)
      return a && k != null && n.setItem(t, T.write(k)), k;
    if (!_ && c) {
      const M = T.read(x);
      return typeof c == "function" ? c(M, k) : E === "object" && !Array.isArray(M) ? { ...k, ...M } : M;
    } else
      return typeof x != "string" ? x : T.read(x);
  }
  function b(_) {
    w(_.detail);
  }
  function w(_) {
    if (!(_ && _.storageArea !== n)) {
      if (_ && _.key == null) {
        v.value = k;
        return;
      }
      if (!(_ && _.key !== t)) {
        j();
        try {
          _?.newValue !== T.write(v.value) && (v.value = p(_));
        } catch (x) {
          g(x);
        } finally {
          _ ? Ea(d) : d();
        }
      }
    }
  }
}
class Ur extends Error {
}
Ur.prototype.name = "InvalidTokenError";
function Fg(t) {
  return decodeURIComponent(atob(t).replace(/(.)/g, (e, n) => {
    let r = n.charCodeAt(0).toString(16).toUpperCase();
    return r.length < 2 && (r = "0" + r), "%" + r;
  }));
}
function Vg(t) {
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
    return Fg(e);
  } catch {
    return atob(e);
  }
}
function Wg(t, e) {
  if (typeof t != "string")
    throw new Ur("Invalid token specified: must be a string");
  e || (e = {});
  const n = e.header === !0 ? 0 : 1, r = t.split(".")[n];
  if (typeof r != "string")
    throw new Ur(`Invalid token specified: missing part #${n + 1}`);
  let s;
  try {
    s = Vg(r);
  } catch (i) {
    throw new Ur(`Invalid token specified: invalid base64 for part #${n + 1} (${i.message})`);
  }
  try {
    return JSON.parse(s);
  } catch (i) {
    throw new Ur(`Invalid token specified: invalid json for part #${n + 1} (${i.message})`);
  }
}
var Fa = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Va(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Jf = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(Fa, function() {
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
})(Jf);
var Kg = Jf.exports;
const Ug = /* @__PURE__ */ Va(Kg);
function Wt(t, e) {
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
var Yf = { exports: {} };
(function(t, e) {
  (function(r, s) {
    t.exports = s();
  })(typeof self < "u" ? self : Fa, function() {
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
                function c(E, T) {
                  for (var j = T.length, d = 0; d < j; ++d)
                    v(E, T[d]);
                }
                var u = {}.hasOwnProperty;
                function f(E, T) {
                  E[T] = !0;
                }
                function h(E, T) {
                  for (var j in T)
                    u.call(T, j) && (E[j] = !!T[j]);
                }
                var g = /\s+/;
                function y(E, T) {
                  for (var j = T.split(g), d = j.length, m = 0; m < d; ++m)
                    E[j[m]] = !0;
                }
                function v(E, T) {
                  if (T) {
                    var j = typeof T;
                    j === "string" ? y(E, T) : Array.isArray(T) ? c(E, T) : j === "object" ? h(E, T) : j === "number" && f(E, T);
                  }
                }
                function k() {
                  for (var E = arguments.length, T = Array(E), j = 0; j < E; j++)
                    T[j] = arguments[j];
                  var d = new a();
                  c(d, T);
                  var m = [];
                  for (var p in d)
                    d[p] && m.push(p);
                  return m.join(" ");
                }
                return k;
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
            n.exports = function(g) {
              var y = o(g), v = typeof this == "function" ? this : Array, k = arguments.length, E = k > 1 ? arguments[1] : void 0, T = E !== void 0, j = 0, d = f(y), m, p, b, w;
              if (T && (E = i(E, k > 2 ? arguments[2] : void 0, 2)), d != null && !(v == Array && a(d)))
                for (w = d.call(y), p = new v(); !(b = w.next()).done; j++)
                  u(
                    p,
                    j,
                    T ? l(w, E, [b.value, j], !0) : b.value
                  );
              else
                for (m = c(y.length), p = new v(m); m > j; j++)
                  u(p, j, T ? E(y[j], j) : y[j]);
              return p.length = j, p;
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
                var h = i(c), g = o(h.length), y = l(f, g), v;
                if (a && u != u) {
                  for (; g > y; )
                    if (v = h[y++], v != v)
                      return !0;
                } else
                  for (; g > y; y++)
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
                var g = {};
                g[o] = function() {
                  return {
                    next: function() {
                      return { done: h = !0 };
                    }
                  };
                }, u(g);
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
              var f, h, g;
              return u === void 0 ? "Undefined" : u === null ? "Null" : typeof (h = c(f = Object(u), l)) == "string" ? h : a ? i(f) : (g = i(f)) == "Object" && typeof f.callee == "function" ? "Arguments" : g;
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
              for (var f = o(u), h = a.f, g = l.f, y = 0; y < f.length; y++) {
                var v = f[y];
                i(c, v) || h(c, v, g(u, v));
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
            n.exports = function(f, h, g) {
              var y = h + " Iterator";
              return f.prototype = o(i, { next: l(1, g) }), a(f, y, !1, !0), c[y] = u, f;
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
            ), g = s(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), y = s(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), v = s(
              /*! ../internals/iterators-core */
              "./node_modules/core-js/internals/iterators-core.js"
            ), k = v.IteratorPrototype, E = v.BUGGY_SAFARI_ITERATORS, T = h("iterator"), j = "keys", d = "values", m = "entries", p = function() {
              return this;
            };
            n.exports = function(b, w, _, x, M, O, L) {
              o(_, w, x);
              var I = function(Ae) {
                if (Ae === M && q)
                  return q;
                if (!E && Ae in R)
                  return R[Ae];
                switch (Ae) {
                  case j:
                    return function() {
                      return new _(this, Ae);
                    };
                  case d:
                    return function() {
                      return new _(this, Ae);
                    };
                  case m:
                    return function() {
                      return new _(this, Ae);
                    };
                }
                return function() {
                  return new _(this);
                };
              }, z = w + " Iterator", S = !1, R = b.prototype, N = R[T] || R["@@iterator"] || M && R[M], q = !E && N || I(M), re = w == "Array" && R.entries || N, J, ce, Me;
              if (re && (J = l(re.call(new b())), k !== Object.prototype && J.next && (!g && l(J) !== k && (a ? a(J, k) : typeof J[T] != "function" && u(J, T, p)), c(J, z, !0, !0), g && (y[z] = p))), M == d && N && N.name !== d && (S = !0, q = function() {
                return N.call(this);
              }), (!g || L) && R[T] !== q && u(R, T, q), y[w] = q, M)
                if (ce = {
                  values: I(d),
                  keys: O ? q : I(j),
                  entries: I(m)
                }, L)
                  for (Me in ce)
                    (E || S || !(Me in R)) && f(R, Me, ce[Me]);
                else
                  i({ target: w, proto: !0, forced: E || S }, ce);
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
            n.exports = function(h, g) {
              var y = h.target, v = h.global, k = h.stat, E, T, j, d, m, p;
              if (v ? T = i : k ? T = i[y] || c(y, {}) : T = (i[y] || {}).prototype, T)
                for (j in g) {
                  if (m = g[j], h.noTargetGet ? (p = o(T, j), d = p && p.value) : d = T[j], E = f(v ? j : y + (k ? "." : "#") + j, h.forced), !E && d !== void 0) {
                    if (typeof m == typeof d)
                      continue;
                    u(m, d);
                  }
                  (h.sham || d && d.sham) && l(m, "sham", !0), a(T, j, m, h);
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
            ), h = o.WeakMap, g, y, v, k = function(b) {
              return v(b) ? y(b) : g(b, {});
            }, E = function(b) {
              return function(w) {
                var _;
                if (!l(w) || (_ = y(w)).type !== b)
                  throw TypeError("Incompatible receiver, " + b + " required");
                return _;
              };
            };
            if (i) {
              var T = new h(), j = T.get, d = T.has, m = T.set;
              g = function(b, w) {
                return m.call(T, b, w), w;
              }, y = function(b) {
                return j.call(T, b) || {};
              }, v = function(b) {
                return d.call(T, b);
              };
            } else {
              var p = u("state");
              f[p] = !0, g = function(b, w) {
                return a(b, p, w), w;
              }, y = function(b) {
                return c(b, p) ? b[p] : {};
              }, v = function(b) {
                return c(b, p);
              };
            }
            n.exports = {
              set: g,
              get: y,
              has: v,
              enforce: k,
              getterFor: E
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
            ), o = /#|\.prototype\./, l = function(h, g) {
              var y = c[a(h)];
              return y == f ? !0 : y == u ? !1 : typeof g == "function" ? i(g) : !!g;
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
            }, g, y, v;
            [].keys && (v = [].keys(), "next" in v ? (y = i(i(v)), y !== Object.prototype && (g = y)) : f = !0), g == null && (g = {}), !c && !l(g, u) && o(g, u, h), n.exports = {
              IteratorPrototype: g,
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
            ), h = f("IE_PROTO"), g = "prototype", y = function() {
            }, v = function() {
              var k = u("iframe"), E = l.length, T = "<", j = "script", d = ">", m = "java" + j + ":", p;
              for (k.style.display = "none", c.appendChild(k), k.src = String(m), p = k.contentWindow.document, p.open(), p.write(T + j + d + "document.F=Object" + T + "/" + j + d), p.close(), v = p.F; E--; )
                delete v[g][l[E]];
              return v();
            };
            n.exports = Object.create || function(E, T) {
              var j;
              return E !== null ? (y[g] = i(E), j = new y(), y[g] = null, j[h] = E) : j = v(), T === void 0 ? j : o(j, T);
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
              for (var h = a(f), g = h.length, y = 0, v; g > y; )
                o.f(u, v = h[y++], f[v]);
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
            r.f = i ? c : function(f, h, g) {
              if (l(f), h = a(h, !0), l(g), o)
                try {
                  return c(f, h, g);
                } catch {
                }
              if ("get" in g || "set" in g)
                throw TypeError("Accessors not supported");
              return "value" in g && (f[h] = g.value), f;
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
            r.f = i ? h : function(y, v) {
              if (y = a(y), v = c(v, !0), f)
                try {
                  return h(y, v);
                } catch {
                }
              if (u(y, v))
                return l(!o.f.call(y, v), y[v]);
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
              var h = o(u), g = 0, y = [], v;
              for (v in h)
                !i(a, v) && i(h, v) && y.push(v);
              for (; f.length > g; )
                i(h, v = f[g++]) && (~c(y, v) || y.push(v));
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
              var h = o.f(a(f)), g = l.f;
              return g ? h.concat(g(f)) : h;
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
            ), h = f.get, g = f.enforce, y = String(u).split("toString");
            o("inspectSource", function(v) {
              return u.call(v);
            }), (n.exports = function(v, k, E, T) {
              var j = T ? !!T.unsafe : !1, d = T ? !!T.enumerable : !1, m = T ? !!T.noTargetGet : !1;
              if (typeof E == "function" && (typeof k == "string" && !a(E, "name") && l(E, "name", k), g(E).source = y.join(typeof k == "string" ? k : "")), v === i) {
                d ? v[k] = E : c(k, E);
                return;
              } else
                j ? !m && v[k] && (d = !0) : delete v[k];
              d ? v[k] = E : l(v, k, E);
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
              var u = String(o(l)), f = i(a), h = u.length, g, y;
              return f < 0 || f >= h ? c ? "" : void 0 : (g = u.charCodeAt(f), g < 55296 || g > 56319 || f + 1 === h || (y = u.charCodeAt(f + 1)) < 56320 || y > 57343 ? c ? u.charAt(f) : g : c ? u.slice(f, f + 2) : (g - 55296 << 10) + (y - 56320) + 65536);
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
              var h = u(this), g = h.string, y = h.index, v;
              return y >= g.length ? { value: void 0, done: !0 } : (v = i(g, y, !0), h.index += v.length, { value: v, done: !1 });
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
            var i = Object.assign || function(v) {
              for (var k = 1; k < arguments.length; k++) {
                var E = arguments[k];
                for (var T in E)
                  Object.prototype.hasOwnProperty.call(E, T) && (v[T] = E[T]);
              }
              return v;
            }, o = /* @__PURE__ */ function() {
              function v(k, E) {
                for (var T = 0; T < E.length; T++) {
                  var j = E[T];
                  j.enumerable = j.enumerable || !1, j.configurable = !0, "value" in j && (j.writable = !0), Object.defineProperty(k, j.key, j);
                }
              }
              return function(k, E, T) {
                return E && v(k.prototype, E), T && v(k, T), k;
              };
            }(), l = s(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), a = f(l), c = s(
              /*! ./default-attrs.json */
              "./src/default-attrs.json"
            ), u = f(c);
            function f(v) {
              return v && v.__esModule ? v : { default: v };
            }
            function h(v, k) {
              if (!(v instanceof k))
                throw new TypeError("Cannot call a class as a function");
            }
            var g = function() {
              function v(k, E) {
                var T = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                h(this, v), this.name = k, this.contents = E, this.tags = T, this.attrs = i({}, u.default, { class: "feather feather-" + k });
              }
              return o(v, [{
                key: "toSvg",
                value: function() {
                  var E = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, T = i({}, this.attrs, E, { class: (0, a.default)(this.attrs.class, E.class) });
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
              }]), v;
            }();
            function y(v) {
              return Object.keys(v).map(function(k) {
                return k + '="' + v[k] + '"';
              }).join(" ");
            }
            r.default = g;
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
            }).reduce(function(h, g) {
              return h[g.name] = g, h;
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
              for (var v = 1; v < arguments.length; v++) {
                var k = arguments[v];
                for (var E in k)
                  Object.prototype.hasOwnProperty.call(k, E) && (y[E] = k[E]);
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
              var v = document.querySelectorAll("[data-feather]");
              Array.from(v).forEach(function(k) {
                return h(k, y);
              });
            }
            function h(y) {
              var v = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, k = g(y), E = k["data-feather"];
              delete k["data-feather"];
              var T = c.default[E].toSvg(i({}, v, k, { class: (0, l.default)(v.class, k.class) })), j = new DOMParser().parseFromString(T, "image/svg+xml"), d = j.querySelector("svg");
              y.parentNode.replaceChild(d, y);
            }
            function g(y) {
              return Array.from(y.attributes).reduce(function(v, k) {
                return v[k.name] = k.value, v;
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
})(Yf);
var qg = Yf.exports;
const Rl = /* @__PURE__ */ Va(qg), xu = Object.keys(Rl.icons), Wo = {
  props: {
    name: {
      type: String,
      required: !0,
      validator(t) {
        const e = xu.includes(t);
        return e || (console.groupCollapsed(
          "[frappe-ui] name property for feather-icon must be one of "
        ), console.dir(xu), console.groupEnd()), e;
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
    let t = Rl.icons[this.name];
    return t || (t = Rl.icons.circle), Da(
      "svg",
      za(
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
}, Gg = {
  name: "LoadingIndicator"
}, Jg = {
  class: "max-w-xs animate-spin",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, Yg = /* @__PURE__ */ ae("circle", {
  class: "opacity-25",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), Xg = /* @__PURE__ */ ae("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), Qg = [
  Yg,
  Xg
];
function Zg(t, e, n, r, s, i) {
  return ne(), pe("svg", Jg, Qg);
}
const e0 = /* @__PURE__ */ rt(Gg, [["render", Zg]]);
var _u;
(function(t) {
  t.pop = "pop", t.push = "push";
})(_u || (_u = {}));
var ku;
(function(t) {
  t.back = "back", t.forward = "forward", t.unknown = "";
})(ku || (ku = {}));
var Su;
(function(t) {
  t[t.aborted = 4] = "aborted", t[t.cancelled = 8] = "cancelled", t[t.duplicated = 16] = "duplicated";
})(Su || (Su = {}));
const t0 = Symbol("");
function n0() {
  return ns(t0);
}
const r0 = ["disabled", "ariaLabel"], s0 = /* @__PURE__ */ wt({
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
    const e = t, n = m1(), r = n0(), s = Kn(() => {
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
      }[e.theme], g = {
        gray: "text-gray-800 bg-transparent hover:bg-gray-200 active:bg-gray-300",
        blue: "text-blue-600 bg-transparent hover:bg-blue-200 active:bg-blue-300",
        green: "text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300",
        red: "text-red-700 bg-transparent hover:bg-red-200 active:bg-red-300"
      }[e.theme], y = {
        gray: "focus-visible:ring focus-visible:ring-gray-400",
        blue: "focus-visible:ring focus-visible:ring-blue-400",
        green: "focus-visible:ring focus-visible:ring-green-400",
        red: "focus-visible:ring focus-visible:ring-red-400"
      }[e.theme], v = {
        subtle: f,
        solid: u,
        outline: h,
        ghost: g
      }[e.variant], k = `${e.theme}-${e.variant}`, E = {
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
      }, T = E[k] || E[e.theme], j = {
        sm: "h-7 text-base px-2 rounded",
        md: "h-8 text-base font-medium px-2.5 rounded",
        lg: "h-10 text-lg font-medium px-3 rounded-md",
        xl: "h-11.5 text-xl font-medium px-3.5 rounded-lg",
        "2xl": "h-13 text-2xl font-medium px-3.5 rounded-xl"
      }[e.size];
      return a.value && (j = {
        sm: "h-7 w-7 rounded",
        md: "h-8 w-8 rounded",
        lg: "h-10 w-10 rounded-md",
        xl: "h-11.5 w-11.5 rounded-lg",
        "2xl": "h-13 w-13 rounded-xl"
      }[e.size]), [
        "inline-flex items-center justify-center gap-2 transition-colors focus:outline-none",
        o.value ? T : v,
        y,
        j
      ];
    }), i = Kn(() => ({
      sm: "h-4",
      md: "h-4.5",
      lg: "h-5",
      xl: "h-6",
      "2xl": "h-6"
    })[e.size]), o = Kn(() => e.disabled || e.loading), l = Kn(() => a.value ? e.label : null), a = Kn(() => e.icon || n.icon), c = () => {
      if (e.route)
        return r.push(e.route);
      if (e.link)
        return window.open(e.link, "_blank");
    };
    return (u, f) => (ne(), pe("button", za(u.$attrs, {
      class: s.value,
      onClick: c,
      disabled: o.value,
      ariaLabel: l.value
    }), [
      u.loading ? (ne(), tt(e0, {
        key: 0,
        class: Ut({
          "h-3 w-3": u.size == "sm",
          "h-[13.5px] w-[13.5px]": u.size == "md",
          "h-[15px] w-[15px]": u.size == "lg",
          "h-4.5 w-4.5": u.size == "xl" || u.size == "2xl"
        })
      }, null, 8, ["class"])) : u.$slots.prefix || u.iconLeft ? vr(u.$slots, "prefix", { key: 1 }, () => [
        u.iconLeft ? (ne(), tt(Wo, {
          key: 0,
          name: u.iconLeft,
          class: Ut(i.value),
          "aria-hidden": "true"
        }, null, 8, ["name", "class"])) : Je("", !0)
      ]) : Je("", !0),
      u.loading && u.loadingText ? (ne(), pe(Pe, { key: 2 }, [
        er(ft(u.loadingText), 1)
      ], 64)) : a.value && !u.loading ? (ne(), pe(Pe, { key: 3 }, [
        u.icon ? (ne(), tt(Wo, {
          key: 0,
          name: u.icon,
          class: Ut(i.value),
          "aria-label": u.label
        }, null, 8, ["name", "class", "aria-label"])) : u.$slots.icon ? vr(u.$slots, "icon", { key: 1 }) : Je("", !0)
      ], 64)) : (ne(), pe("span", {
        key: 4,
        class: Ut({ "sr-only": a.value })
      }, [
        vr(u.$slots, "default", {}, () => [
          er(ft(u.label), 1)
        ])
      ], 2)),
      vr(u.$slots, "suffix", {}, () => [
        u.iconRight ? (ne(), tt(Wo, {
          key: 0,
          name: u.iconRight,
          class: Ut(i.value),
          "aria-hidden": "true"
        }, null, 8, ["name", "class"])) : Je("", !0)
      ])
    ], 16, r0));
  }
}), i0 = {}, Xf = (t) => (Aa("data-v-48d21730"), t = t(), Ta(), t), o0 = {
  class: "spinner",
  viewBox: "0 0 50 50"
}, l0 = /* @__PURE__ */ Xf(() => /* @__PURE__ */ ae("defs", null, [
  /* @__PURE__ */ ae("linearGradient", {
    id: "gradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, [
    /* @__PURE__ */ ae("stop", {
      offset: "0%",
      "stop-color": "rgba(0,110,219,1)"
    }),
    /* @__PURE__ */ ae("stop", {
      offset: "100%",
      "stop-color": "rgba(255,255,255,0)"
    })
  ])
], -1)), a0 = /* @__PURE__ */ Xf(() => /* @__PURE__ */ ae("circle", {
  stroke: "url(#gradient)",
  class: "spinner-path",
  cx: "25",
  cy: "25",
  r: "20",
  fill: "none",
  "stroke-width": "5"
}, null, -1)), c0 = [
  l0,
  a0
];
function u0(t, e) {
  return ne(), pe("svg", o0, c0);
}
const d0 = /* @__PURE__ */ rt(i0, [["render", u0], ["__scopeId", "data-v-48d21730"]]);
function Qf(t, e, n) {
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
      let o = Qf(s.content, i.content, n + 1);
      if (o != null)
        return o;
    }
    n += s.nodeSize;
  }
}
function Zf(t, e, n, r) {
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
      let c = Zf(o.content, l.content, n - 1, r - 1);
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
    return Qf(this, e, n);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, n = this.size, r = e.size) {
    return Zf(this, e, n, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, n = -1) {
    if (e == 0)
      return zs(0, e);
    if (e == this.size)
      return zs(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, s = 0; ; r++) {
      let i = this.child(r), o = s + i.nodeSize;
      if (o >= e)
        return o == e || n > 0 ? zs(r + 1, o) : zs(r, s);
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
const Ko = { index: 0, offset: 0 };
function zs(t, e) {
  return Ko.index = t, Ko.offset = e, Ko;
}
function Ll(t, e) {
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
      if (!Ll(t[r], e[r]))
        return !1;
  } else {
    for (let r in t)
      if (!(r in e) || !Ll(t[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in t))
        return !1;
  }
  return !0;
}
let gt = class Pl {
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
    return this == e || this.type == e.type && Ll(this.attrs, e.attrs);
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
      return Pl.none;
    if (e instanceof Pl)
      return [e];
    let n = e.slice();
    return n.sort((r, s) => r.type.rank - s.type.rank), n;
  }
};
gt.none = [];
class f0 extends Error {
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
    let r = th(this.content, e + this.openStart, n);
    return r && new U(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, n) {
    return new U(eh(this.content, e + this.openStart, n + this.openStart), this.openStart, this.openEnd);
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
function eh(t, e, n) {
  let { index: r, offset: s } = t.findIndex(e), i = t.maybeChild(r), { index: o, offset: l } = t.findIndex(n);
  if (s == e || i.isText) {
    if (l != n && !t.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return t.cut(0, e).append(t.cut(n));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return t.replaceChild(r, i.copy(eh(i.content, e - s - 1, n - s - 1)));
}
function th(t, e, n, r) {
  let { index: s, offset: i } = t.findIndex(e), o = t.maybeChild(s);
  if (i == e || o.isText)
    return r && !r.canReplace(s, s, n) ? null : t.cut(0, e).append(n).append(t.cut(e));
  let l = th(o.content, e - i - 1, n);
  return l && t.replaceChild(s, o.copy(l));
}
class Il {
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
function h0(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t) {
    let r = t[n];
    if (!r.hasDefault)
      return null;
    e[n] = r.default;
  }
  return e;
}
function p0(t, e) {
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
function m0(t) {
  let e = /* @__PURE__ */ Object.create(null);
  if (t)
    for (let n in t)
      e[n] = new g0(t[n]);
  return e;
}
class g0 {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Wa {
  /**
  @internal
  */
  constructor(e, n, r, s) {
    this.name = e, this.rank = n, this.schema = r, this.spec = s, this.attrs = m0(s.attrs), this.excluded = null;
    let i = h0(this.attrs);
    this.instance = i ? new gt(this, i) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new gt(this, p0(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, n) {
    let r = /* @__PURE__ */ Object.create(null), s = 0;
    return e.forEach((i, o) => r[i] = new Wa(i, s++, n, o)), r;
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
let nh = class Nl {
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
    let r = new Eu(this, n, !1);
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
    let r = new Eu(this, n, !0);
    return r.addAll(e, n.from, n.to), U.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, n, r) {
    for (let s = r ? this.tags.indexOf(r) + 1 : 0; s < this.tags.length; s++) {
      let i = this.tags[s];
      if (v0(e, i.tag) && (i.namespace === void 0 || e.namespaceURI == i.namespace) && (!i.context || n.matchesContext(i.context))) {
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
        r(o = Mu(o)), o.mark || o.ignore || o.clearMark || (o.mark = s);
      });
    }
    for (let s in e.nodes) {
      let i = e.nodes[s].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Mu(o)), o.node || o.ignore || o.mark || (o.node = s);
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
    return e.cached.domParser || (e.cached.domParser = new Nl(e, Nl.schemaRules(e)));
  }
};
const rh = {
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
}, y0 = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, sh = { ol: !0, ul: !0 }, bi = 1, vi = 2, ss = 4;
function Cu(t, e, n) {
  return e != null ? (e ? bi : 0) | (e === "full" ? vi : 0) : t && t.whitespace == "pre" ? bi | vi : n & ~ss;
}
class $s {
  constructor(e, n, r, s, i, o, l) {
    this.type = e, this.attrs = n, this.marks = r, this.pendingMarks = s, this.solid = i, this.options = l, this.content = [], this.activeMarks = gt.none, this.stashMarks = [], this.match = o || (l & ss ? null : e.contentMatch);
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
    if (!(this.options & bi)) {
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
      (this.type ? this.type.allowsMarkType(s.type) : x0(s.type, e)) && !s.isInSet(this.activeMarks) && (this.activeMarks = s.addToSet(this.activeMarks), this.pendingMarks = s.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !rh.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Eu {
  constructor(e, n, r) {
    this.parser = e, this.options = n, this.isOpen = r, this.open = 0;
    let s = n.topNode, i, o = Cu(null, n.preserveWhitespace, 0) | (r ? ss : 0);
    s ? i = new $s(s.type, s.attrs, gt.none, gt.none, !0, n.topMatch || s.type.contentMatch, o) : r ? i = new $s(null, null, gt.none, gt.none, !0, null, o) : i = new $s(e.schema.topNodeType, null, gt.none, gt.none, !0, null, o), this.nodes = [i], this.find = n.findPositions, this.needsBlock = !1;
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
    let s = this.readStyles(w0(r));
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
    if (r.options & vi || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (r.options & bi)
        r.options & vi ? n = n.replace(/\r\n?/g, `
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
    sh.hasOwnProperty(r) && this.parser.normalizeLists && b0(e);
    let i = this.options.ruleFromNode && this.options.ruleFromNode(e) || (s = this.parser.matchTag(e, this, n));
    if (i ? i.ignore : y0.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!i || i.skip || i.closeParent) {
      i && i.closeParent ? this.open = Math.max(0, this.open - 1) : i && i.skip.nodeType && (e = i.skip);
      let o, l = this.top, a = this.needsBlock;
      if (rh.hasOwnProperty(r))
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
    let n = gt.none, r = gt.none;
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
    let o = Cu(e, s, i.options);
    i.options & ss && i.content.length == 0 && (o |= ss), this.nodes.push(new $s(e, n, i.activeMarks, i.pendingMarks, r, null, o)), this.open++;
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
    let n = _0(e, this.top.pendingMarks);
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
function b0(t) {
  for (let e = t.firstChild, n = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && sh.hasOwnProperty(r) && n ? (n.appendChild(e), e = n) : r == "li" ? n = e : r && (n = null);
  }
}
function v0(t, e) {
  return (t.matches || t.msMatchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector).call(t, e);
}
function w0(t) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, n, r = [];
  for (; n = e.exec(t); )
    r.push(n[1], n[2].trim());
  return r;
}
function Mu(t) {
  let e = {};
  for (let n in t)
    e[n] = t[n];
  return e;
}
function x0(t, e) {
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
function _0(t, e) {
  for (let n = 0; n < e.length; n++)
    if (t.eq(e[n]))
      return e[n];
}
class Jn {
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
    r || (r = Uo(n).createDocumentFragment());
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
    let { dom: r, contentDOM: s } = Jn.renderSpec(Uo(n), this.nodes[e.type.name](e));
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
    return s && Jn.renderSpec(Uo(r), s(e, n));
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
        let { dom: h, contentDOM: g } = Jn.renderSpec(e, f, r);
        if (l.appendChild(h), g) {
          if (o)
            throw new RangeError("Multiple content holes");
          o = g;
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
    return e.cached.domSerializer || (e.cached.domSerializer = new Jn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let n = Au(e.nodes);
    return n.text || (n.text = (r) => r.text), n;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Au(e.marks);
  }
}
function Au(t) {
  let e = {};
  for (let n in t) {
    let r = t[n].spec.toDOM;
    r && (e[n] = r);
  }
  return e;
}
function Uo(t) {
  return t.document || window.document;
}
const ih = 65535, oh = Math.pow(2, 16);
function k0(t, e) {
  return t + e * oh;
}
function Tu(t) {
  return t & ih;
}
function S0(t) {
  return (t - (t & ih)) / oh;
}
const lh = 1, ah = 2, ni = 4, ch = 8;
class zl {
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
    return (this.delInfo & ch) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (lh | ni)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (ah | ni)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & ni) > 0;
  }
}
class yt {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, n = !1) {
    if (this.ranges = e, this.inverted = n, !e.length && yt.empty)
      return yt.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let n = 0, r = Tu(e);
    if (!this.inverted)
      for (let s = 0; s < r; s++)
        n += this.ranges[s * 3 + 2] - this.ranges[s * 3 + 1];
    return this.ranges[r * 3] + n + S0(e);
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
        let h = c ? e == a ? -1 : e == f ? 1 : n : n, g = a + s + (h < 0 ? 0 : u);
        if (r)
          return g;
        let y = e == (n < 0 ? a : f) ? null : k0(l / 3, e - a), v = e == a ? ah : e == f ? lh : ni;
        return (n < 0 ? e != a : e != f) && (v |= ch), new zl(g, v, y);
      }
      s += u - c;
    }
    return r ? e + s : new zl(e + s, 0, null);
  }
  /**
  @internal
  */
  touches(e, n) {
    let r = 0, s = Tu(n), i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
    return new yt(this.ranges, !this.inverted);
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
    return e == 0 ? yt.empty : new yt(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
yt.empty = new yt([]);
class Er {
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
    return new Er(this.maps, this.mirror, e, n);
  }
  /**
  @internal
  */
  copy() {
    return new Er(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
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
    let e = new Er();
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
    return r ? e : new zl(e, s, null);
  }
}
const qo = /* @__PURE__ */ Object.create(null);
class st {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return yt.empty;
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
    let r = qo[n.stepType];
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
    if (e in qo)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return qo[e] = n, n.prototype.jsonID = e, n;
  }
}
class Ne {
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
    return new Ne(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new Ne(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, n, r, s) {
    try {
      return Ne.ok(e.replace(n, r, s));
    } catch (i) {
      if (i instanceof f0)
        return Ne.fail(i.message);
      throw i;
    }
  }
}
function Ka(t, e, n) {
  let r = [];
  for (let s = 0; s < t.childCount; s++) {
    let i = t.child(s);
    i.content.size && (i = i.copy(Ka(i.content, e, i))), i.isInline && (i = e(i, n, s)), r.push(i);
  }
  return H.fromArray(r);
}
class kn extends st {
  /**
  Create a mark step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = e.resolve(this.from), s = r.node(r.sharedDepth(this.to)), i = new U(Ka(n.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), s), n.openStart, n.openEnd);
    return Ne.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new Gt(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new kn(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof kn && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new kn(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new kn(n.from, n.to, e.markFromJSON(n.mark));
  }
}
st.jsonID("addMark", kn);
class Gt extends st {
  /**
  Create a mark-removing step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = new U(Ka(n.content, (s) => s.mark(this.mark.removeFromSet(s.marks)), e), n.openStart, n.openEnd);
    return Ne.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new kn(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new Gt(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Gt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Gt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Gt(n.from, n.to, e.markFromJSON(n.mark));
  }
}
st.jsonID("removeMark", Gt);
class Sn extends st {
  /**
  Create a node mark step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Ne.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.addToSet(n.marks));
    return Ne.fromReplace(e, this.pos, this.pos + 1, new U(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    if (n) {
      let r = this.mark.addToSet(n.marks);
      if (r.length == n.marks.length) {
        for (let s = 0; s < n.marks.length; s++)
          if (!n.marks[s].isInSet(r))
            return new Sn(this.pos, n.marks[s]);
        return new Sn(this.pos, this.mark);
      }
    }
    return new Or(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Sn(n.pos, this.mark);
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
    return new Sn(n.pos, e.markFromJSON(n.mark));
  }
}
st.jsonID("addNodeMark", Sn);
class Or extends st {
  /**
  Create a mark-removing step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Ne.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.removeFromSet(n.marks));
    return Ne.fromReplace(e, this.pos, this.pos + 1, new U(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    return !n || !this.mark.isInSet(n.marks) ? this : new Sn(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Or(n.pos, this.mark);
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
    return new Or(n.pos, e.markFromJSON(n.mark));
  }
}
st.jsonID("removeNodeMark", Or);
class Ve extends st {
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
    return this.structure && $l(e, this.from, this.to) ? Ne.fail("Structure replace would overwrite content") : Ne.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new yt([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Ve(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deletedAcross && r.deletedAcross ? null : new Ve(n.pos, Math.max(n.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Ve) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let n = this.slice.size + e.slice.size == 0 ? U.empty : new U(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new Ve(this.from, this.to + (e.to - e.from), n, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let n = this.slice.size + e.slice.size == 0 ? U.empty : new U(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new Ve(e.from, this.to, n, this.structure);
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
    return new Ve(n.from, n.to, U.fromJSON(e, n.slice), !!n.structure);
  }
}
st.jsonID("replace", Ve);
class Ke extends st {
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
    if (this.structure && ($l(e, this.from, this.gapFrom) || $l(e, this.gapTo, this.to)))
      return Ne.fail("Structure gap-replace would overwrite content");
    let n = e.slice(this.gapFrom, this.gapTo);
    if (n.openStart || n.openEnd)
      return Ne.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, n.content);
    return r ? Ne.fromReplace(e, this.from, this.to, r) : Ne.fail("Content does not fit in gap");
  }
  getMap() {
    return new yt([
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
    return new Ke(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), s = e.map(this.gapFrom, -1), i = e.map(this.gapTo, 1);
    return n.deletedAcross && r.deletedAcross || s < n.pos || i > r.pos ? null : new Ke(n.pos, r.pos, s, i, this.slice, this.insert, this.structure);
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
    return new Ke(n.from, n.to, n.gapFrom, n.gapTo, U.fromJSON(e, n.slice), n.insert, !!n.structure);
  }
}
st.jsonID("replaceAround", Ke);
function $l(t, e, n) {
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
function C0(t, e, n, r) {
  let s = [], i = [], o, l;
  t.doc.nodesBetween(e, n, (a, c, u) => {
    if (!a.isInline)
      return;
    let f = a.marks;
    if (!r.isInSet(f) && u.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), g = Math.min(c + a.nodeSize, n), y = r.addToSet(f);
      for (let v = 0; v < f.length; v++)
        f[v].isInSet(y) || (o && o.to == h && o.mark.eq(f[v]) ? o.to = g : s.push(o = new Gt(h, g, f[v])));
      l && l.to == h ? l.to = g : i.push(l = new kn(h, g, r));
    }
  }), s.forEach((a) => t.step(a)), i.forEach((a) => t.step(a));
}
function E0(t, e, n, r) {
  let s = [], i = 0;
  t.doc.nodesBetween(e, n, (o, l) => {
    if (!o.isInline)
      return;
    i++;
    let a = null;
    if (r instanceof Wa) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (a || (a = [])).push(u), c = u.removeFromSet(c);
    } else
      r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, n);
      for (let u = 0; u < a.length; u++) {
        let f = a[u], h;
        for (let g = 0; g < s.length; g++) {
          let y = s[g];
          y.step == i - 1 && f.eq(s[g].style) && (h = y);
        }
        h ? (h.to = c, h.step = i) : s.push({ style: f, from: Math.max(l, e), to: c, step: i });
      }
    }
  }), s.forEach((o) => t.step(new Gt(o.from, o.to, o.style)));
}
function M0(t, e, n, r = n.contentMatch) {
  let s = t.doc.nodeAt(e), i = [], o = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let a = s.child(l), c = o + a.nodeSize, u = r.matchType(a.type);
    if (!u)
      i.push(new Ve(o, c, U.empty));
    else {
      r = u;
      for (let f = 0; f < a.marks.length; f++)
        n.allowsMarkType(a.marks[f].type) || t.step(new Gt(o, c, a.marks[f]));
      if (a.isText && !n.spec.code) {
        let f, h = /\r?\n|\r/g, g;
        for (; f = h.exec(a.text); )
          g || (g = new U(H.from(n.schema.text(" ", n.allowedMarks(a.marks))), 0, 0)), i.push(new Ve(o + f.index, o + f.index + f[0].length, g));
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
function A0(t, e, n) {
  return (e == 0 || t.canReplace(e, t.childCount)) && (n == t.childCount || t.canReplace(0, n));
}
function zr(t) {
  let n = t.parent.content.cutByIndex(t.startIndex, t.endIndex);
  for (let r = t.depth; ; --r) {
    let s = t.$from.node(r), i = t.$from.index(r), o = t.$to.indexAfter(r);
    if (r < t.depth && s.canReplace(i, o, n))
      return r;
    if (r == 0 || s.type.spec.isolating || !A0(s, i, o))
      break;
  }
  return null;
}
function T0(t, e, n) {
  let { $from: r, $to: s, depth: i } = e, o = r.before(i + 1), l = s.after(i + 1), a = o, c = l, u = H.empty, f = 0;
  for (let y = i, v = !1; y > n; y--)
    v || r.index(y) > 0 ? (v = !0, u = H.from(r.node(y).copy(u)), f++) : a--;
  let h = H.empty, g = 0;
  for (let y = i, v = !1; y > n; y--)
    v || s.after(y + 1) < s.end(y) ? (v = !0, h = H.from(s.node(y).copy(h)), g++) : c++;
  t.step(new Ke(a, c, o, l, new U(u.append(h), f, g), u.size - f, !0));
}
function Ua(t, e, n = null, r = t) {
  let s = j0(t, e), i = s && O0(r, e);
  return i ? s.map(ju).concat({ type: e, attrs: n }).concat(i.map(ju)) : null;
}
function ju(t) {
  return { type: t, attrs: null };
}
function j0(t, e) {
  let { parent: n, startIndex: r, endIndex: s } = t, i = n.contentMatchAt(r).findWrapping(e);
  if (!i)
    return null;
  let o = i.length ? i[0] : e;
  return n.canReplaceWith(r, s, o) ? i : null;
}
function O0(t, e) {
  let { parent: n, startIndex: r, endIndex: s } = t, i = n.child(r), o = e.contentMatch.findWrapping(i.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < s; c++)
    a = a.matchType(n.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function R0(t, e, n) {
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
  t.step(new Ke(s, i, s, i, new U(r, 0, 0), n.length, !0));
}
function L0(t, e, n, r, s) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let i = t.steps.length;
  t.doc.nodesBetween(e, n, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, s) && P0(t.doc, t.mapping.slice(i).map(l), r)) {
      t.clearIncompatible(t.mapping.slice(i).map(l, 1), r);
      let a = t.mapping.slice(i), c = a.map(l, 1), u = a.map(l + o.nodeSize, 1);
      return t.step(new Ke(c, u, c + 1, u - 1, new U(H.from(r.create(s, null, o.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function P0(t, e, n) {
  let r = t.resolve(e), s = r.index();
  return r.parent.canReplaceWith(s, s + 1, n);
}
function I0(t, e, n, r, s) {
  let i = t.doc.nodeAt(e);
  if (!i)
    throw new RangeError("No node at given position");
  n || (n = i.type);
  let o = n.create(r, null, s || i.marks);
  if (i.isLeaf)
    return t.replaceWith(e, e + i.nodeSize, o);
  if (!n.validContent(i.content))
    throw new RangeError("Invalid content for node type " + n.name);
  t.step(new Ke(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new U(H.from(o), 0, 0), 1, !0));
}
function Mr(t, e, n = 1, r) {
  let s = t.resolve(e), i = s.depth - n, o = r && r[r.length - 1] || s.parent;
  if (i < 0 || s.parent.type.spec.isolating || !s.parent.canReplace(s.index(), s.parent.childCount) || !o.type.validContent(s.parent.content.cutByIndex(s.index(), s.parent.childCount)))
    return !1;
  for (let c = s.depth - 1, u = n - 2; c > i; c--, u--) {
    let f = s.node(c), h = s.index(c);
    if (f.type.spec.isolating)
      return !1;
    let g = f.content.cutByIndex(h, f.childCount), y = r && r[u + 1];
    y && (g = g.replaceChild(0, y.type.create(y.attrs)));
    let v = r && r[u] || f;
    if (!f.canReplace(h + 1, f.childCount) || !v.type.validContent(g))
      return !1;
  }
  let l = s.indexAfter(i), a = r && r[0];
  return s.node(i).canReplaceWith(l, l, a ? a.type : s.node(i + 1).type);
}
function N0(t, e, n = 1, r) {
  let s = t.doc.resolve(e), i = H.empty, o = H.empty;
  for (let l = s.depth, a = s.depth - n, c = n - 1; l > a; l--, c--) {
    i = H.from(s.node(l).copy(i));
    let u = r && r[c];
    o = H.from(u ? u.type.create(u.attrs, o) : s.node(l).copy(o));
  }
  t.step(new Ve(e, e, new U(i.append(o), n, n), !0));
}
function In(t, e) {
  let n = t.resolve(e), r = n.index();
  return uh(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function uh(t, e) {
  return !!(t && e && !t.isLeaf && t.canAppend(e));
}
function ko(t, e, n = -1) {
  let r = t.resolve(e);
  for (let s = r.depth; ; s--) {
    let i, o, l = r.index(s);
    if (s == r.depth ? (i = r.nodeBefore, o = r.nodeAfter) : n > 0 ? (i = r.node(s + 1), l++, o = r.node(s).maybeChild(l)) : (i = r.node(s).maybeChild(l - 1), o = r.node(s + 1)), i && !i.isTextblock && uh(i, o) && r.node(s).canReplace(l, l + 1))
      return e;
    if (s == 0)
      break;
    e = n < 0 ? r.before(s) : r.after(s);
  }
}
function z0(t, e, n) {
  let r = new Ve(e - n, e + n, U.empty, !0);
  t.step(r);
}
function $0(t, e, n) {
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
function dh(t, e, n) {
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
function So(t, e, n = e, r = U.empty) {
  if (e == n && !r.size)
    return null;
  let s = t.resolve(e), i = t.resolve(n);
  return fh(s, i, r) ? new Ve(e, n, r) : new D0(s, i, r).fit();
}
function fh(t, e, n) {
  return !n.openStart && !n.openEnd && t.start() == e.start() && t.parent.canReplace(t.index(), e.index(), n.content);
}
class D0 {
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
    return e > -1 ? new Ke(r.pos, e, this.$to.pos, this.$to.end(), a, n) : a.size || r.pos != this.$to.pos ? new Ve(r.pos, s.pos, a) : null;
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
        r ? (i = Go(this.unplaced.content, r - 1).firstChild, s = i.content) : s = this.unplaced.content;
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
    let { content: e, openStart: n, openEnd: r } = this.unplaced, s = Go(e, n);
    return !s.childCount || s.firstChild.isLeaf ? !1 : (this.unplaced = new U(e, n + 1, Math.max(r, s.size + n >= e.size - r ? n + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, s = Go(e, n);
    if (s.childCount <= 1 && n > 0) {
      let i = e.size - n <= n + s.size;
      this.unplaced = new U(qr(e, n - 1, 1), n - 1, i ? n - 1 : r);
    } else
      this.unplaced = new U(qr(e, n, 1), n, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: n, parent: r, inject: s, wrap: i }) {
    for (; this.depth > n; )
      this.closeFrontierNode();
    if (i)
      for (let v = 0; v < i.length; v++)
        this.openFrontierNode(i[v]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, u = [], { match: f, type: h } = this.frontier[n];
    if (s) {
      for (let v = 0; v < s.childCount; v++)
        u.push(s.child(v));
      f = f.matchFragment(s);
    }
    let g = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let v = l.child(c), k = f.matchType(v.type);
      if (!k)
        break;
      c++, (c > 1 || a == 0 || v.content.size) && (f = k, u.push(hh(v.mark(h.allowedMarks(v.marks)), c == 1 ? a : 0, c == l.childCount ? g : -1)));
    }
    let y = c == l.childCount;
    y || (g = -1), this.placed = Gr(this.placed, n, H.from(u)), this.frontier[n].match = f, y && g < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let v = 0, k = l; v < g; v++) {
      let E = k.lastChild;
      this.frontier.push({ type: E.type, match: E.contentMatchAt(E.childCount) }), k = E.content;
    }
    this.unplaced = y ? e == 0 ? U.empty : new U(qr(o.content, e - 1, 1), e - 1, g < 0 ? o.openEnd : e - 1) : new U(qr(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], n;
    if (!e.type.isTextblock || !Jo(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (n = this.findCloseLevel(this.$to)) && n.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, s = this.$to.after(r);
    for (; r > 1 && s == this.$to.end(--r); )
      ++s;
    return s;
  }
  findCloseLevel(e) {
    e:
      for (let n = Math.min(this.depth, e.depth); n >= 0; n--) {
        let { match: r, type: s } = this.frontier[n], i = n < e.depth && e.end(n + 1) == e.pos + (e.depth - (n + 1)), o = Jo(e, n, s, r, i);
        if (o) {
          for (let l = n - 1; l >= 0; l--) {
            let { match: a, type: c } = this.frontier[l], u = Jo(e, l, c, a, !0);
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
    n.fit.childCount && (this.placed = Gr(this.placed, n.depth, n.fit)), e = n.move;
    for (let r = n.depth + 1; r <= e.depth; r++) {
      let s = e.node(r), i = s.type.contentMatch.fillBefore(s.content, !0, e.index(r));
      this.openFrontierNode(s.type, s.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, n = null, r) {
    let s = this.frontier[this.depth];
    s.match = s.match.matchType(e), this.placed = Gr(this.placed, this.depth, H.from(e.create(n, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let n = this.frontier.pop().match.fillBefore(H.empty, !0);
    n.childCount && (this.placed = Gr(this.placed, this.frontier.length, n));
  }
}
function qr(t, e, n) {
  return e == 0 ? t.cutByIndex(n, t.childCount) : t.replaceChild(0, t.firstChild.copy(qr(t.firstChild.content, e - 1, n)));
}
function Gr(t, e, n) {
  return e == 0 ? t.append(n) : t.replaceChild(t.childCount - 1, t.lastChild.copy(Gr(t.lastChild.content, e - 1, n)));
}
function Go(t, e) {
  for (let n = 0; n < e; n++)
    t = t.firstChild.content;
  return t;
}
function hh(t, e, n) {
  if (e <= 0)
    return t;
  let r = t.content;
  return e > 1 && (r = r.replaceChild(0, hh(r.firstChild, e - 1, r.childCount == 1 ? n - 1 : 0))), e > 0 && (r = t.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(t.type.contentMatch.matchFragment(r).fillBefore(H.empty, !0)))), t.copy(r);
}
function Jo(t, e, n, r, s) {
  let i = t.node(e), o = s ? t.indexAfter(e) : t.index(e);
  if (o == i.childCount && !n.compatibleContent(i.type))
    return null;
  let l = r.fillBefore(i.content, !0, o);
  return l && !B0(n, i.content, o) ? l : null;
}
function B0(t, e, n) {
  for (let r = n; r < e.childCount; r++)
    if (!t.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function H0(t) {
  return t.spec.defining || t.spec.definingForContent;
}
function F0(t, e, n, r) {
  if (!r.size)
    return t.deleteRange(e, n);
  let s = t.doc.resolve(e), i = t.doc.resolve(n);
  if (fh(s, i, r))
    return t.step(new Ve(e, n, r));
  let o = mh(s, t.doc.resolve(n));
  o[o.length - 1] == 0 && o.pop();
  let l = -(s.depth + 1);
  o.unshift(l);
  for (let h = s.depth, g = s.pos - 1; h > 0; h--, g--) {
    let y = s.node(h).type.spec;
    if (y.defining || y.definingAsContext || y.isolating)
      break;
    o.indexOf(h) > -1 ? l = h : s.before(h) == g && o.splice(1, 0, -h);
  }
  let a = o.indexOf(l), c = [], u = r.openStart;
  for (let h = r.content, g = 0; ; g++) {
    let y = h.firstChild;
    if (c.push(y), g == r.openStart)
      break;
    h = y.content;
  }
  for (let h = u - 1; h >= 0; h--) {
    let g = c[h], y = H0(g.type);
    if (y && !g.sameMarkup(s.node(Math.abs(l) - 1)))
      u = h;
    else if (y || !g.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let g = (h + u + 1) % (r.openStart + 1), y = c[g];
    if (y)
      for (let v = 0; v < o.length; v++) {
        let k = o[(v + a) % o.length], E = !0;
        k < 0 && (E = !1, k = -k);
        let T = s.node(k - 1), j = s.index(k - 1);
        if (T.canReplaceWith(j, j, y.type, y.marks))
          return t.replace(s.before(k), E ? i.after(k) : n, new U(ph(r.content, 0, r.openStart, g), g, r.openEnd));
      }
  }
  let f = t.steps.length;
  for (let h = o.length - 1; h >= 0 && (t.replace(e, n, r), !(t.steps.length > f)); h--) {
    let g = o[h];
    g < 0 || (e = s.before(g), n = i.after(g));
  }
}
function ph(t, e, n, r, s) {
  if (e < n) {
    let i = t.firstChild;
    t = t.replaceChild(0, i.copy(ph(i.content, e + 1, n, r, i)));
  }
  if (e > r) {
    let i = s.contentMatchAt(0), o = i.fillBefore(t).append(t);
    t = o.append(i.matchFragment(o).fillBefore(H.empty, !0));
  }
  return t;
}
function V0(t, e, n, r) {
  if (!r.isInline && e == n && t.doc.resolve(e).parent.content.size) {
    let s = $0(t.doc, e, r.type);
    s != null && (e = n = s);
  }
  t.replaceRange(e, n, new U(H.from(r), 0, 0));
}
function W0(t, e, n) {
  let r = t.doc.resolve(e), s = t.doc.resolve(n), i = mh(r, s);
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
function mh(t, e) {
  let n = [], r = Math.min(t.depth, e.depth);
  for (let s = r; s >= 0; s--) {
    let i = t.start(s);
    if (i < t.pos - (t.depth - s) || e.end(s) > e.pos + (e.depth - s) || t.node(s).type.spec.isolating || e.node(s).type.spec.isolating)
      break;
    (i == e.start(s) || s == t.depth && s == e.depth && t.parent.inlineContent && e.parent.inlineContent && s && e.start(s - 1) == i - 1) && n.push(s);
  }
  return n;
}
class Ar extends st {
  /**
  Construct an attribute step.
  */
  constructor(e, n, r) {
    super(), this.pos = e, this.attr = n, this.value = r;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Ne.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in n.attrs)
      r[i] = n.attrs[i];
    r[this.attr] = this.value;
    let s = n.type.create(r, null, n.marks);
    return Ne.fromReplace(e, this.pos, this.pos + 1, new U(H.from(s), 0, n.isLeaf ? 0 : 1));
  }
  getMap() {
    return yt.empty;
  }
  invert(e) {
    return new Ar(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Ar(n.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.pos != "number" || typeof n.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Ar(n.pos, n.attr, n.value);
  }
}
st.jsonID("attr", Ar);
class ms extends st {
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
    return Ne.ok(r);
  }
  getMap() {
    return yt.empty;
  }
  invert(e) {
    return new ms(this.attr, e.attrs[this.attr]);
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
    return new ms(n.attr, n.value);
  }
}
st.jsonID("docAttr", ms);
let Rr = class extends Error {
};
Rr = function t(e) {
  let n = Error.call(this, e);
  return n.__proto__ = t.prototype, n;
};
Rr.prototype = Object.create(Error.prototype);
Rr.prototype.constructor = Rr;
Rr.prototype.name = "TransformError";
class gh {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Er();
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
      throw new Rr(n.failed);
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
    let s = So(this.doc, e, n, r);
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
    return F0(this, e, n, r), this;
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
    return V0(this, e, n, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, n) {
    return W0(this, e, n), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, n) {
    return T0(this, e, n), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, n = 1) {
    return z0(this, e, n), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, n) {
    return R0(this, e, n), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, n = e, r, s = null) {
    return L0(this, e, n, r, s), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, n, r = null, s) {
    return I0(this, e, n, r, s), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, n, r) {
    return this.step(new Ar(e, n, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, n) {
    return this.step(new ms(e, n)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, n) {
    return this.step(new Sn(e, n)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, n) {
    if (!(n instanceof gt)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (n = n.isInSet(r.marks), !n)
        return this;
    }
    return this.step(new Or(e, n)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, n = 1, r) {
    return N0(this, e, n, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, n, r) {
    return C0(this, e, n, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, n, r) {
    return E0(this, e, n, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, n, r) {
    return M0(this, e, n, r), this;
  }
}
const Yo = /* @__PURE__ */ Object.create(null);
class se {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, n, r) {
    this.$anchor = e, this.$head = n, this.ranges = r || [new yh(e.min(n), e.max(n))];
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
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? U.empty : n), l == 0 && Lu(e, i, (r ? r.isInline : s && s.isTextblock) ? -1 : 1);
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
      i ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, n), Lu(e, r, n.isInline ? -1 : 1));
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
    let s = e.parent.inlineContent ? new te(e) : pr(e.node(0), e.parent, e.pos, e.index(), n, r);
    if (s)
      return s;
    for (let i = e.depth - 1; i >= 0; i--) {
      let o = n < 0 ? pr(e.node(0), e.node(i), e.before(i + 1), e.index(i), n, r) : pr(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, n, r);
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
    return this.findFrom(e, n) || this.findFrom(e, -n) || new Pt(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return pr(e, e, 0, 0, 1) || new Pt(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return pr(e, e, e.content.size, e.childCount, -1) || new Pt(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, n) {
    if (!n || !n.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Yo[n.type];
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
    if (e in Yo)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Yo[e] = n, n.prototype.jsonID = e, n;
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
    return te.between(this.$anchor, this.$head).getBookmark();
  }
}
se.prototype.visible = !0;
class yh {
  /**
  Create a range.
  */
  constructor(e, n) {
    this.$from = e, this.$to = n;
  }
}
let Ou = !1;
function Ru(t) {
  !Ou && !t.parent.inlineContent && (Ou = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + t.parent.type.name + ")"));
}
class te extends se {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, n = e) {
    Ru(e), Ru(n), super(e, n);
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
    return new te(s.parent.inlineContent ? s : r, r);
  }
  replace(e, n = U.empty) {
    if (super.replace(e, n), n == U.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof te && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Co(this.anchor, this.head);
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
    return new te(e.resolve(n.anchor), e.resolve(n.head));
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
    return e.parent.inlineContent || (s == 0 ? e = n : (e = (se.findFrom(e, -r, !0) || se.findFrom(e, r, !0)).$anchor, e.pos < n.pos != s < 0 && (e = n))), new te(e, n);
  }
}
se.jsonID("text", te);
class Co {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new Co(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return te.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class Z extends se {
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
    return r ? se.near(i) : new Z(i);
  }
  content() {
    return new U(H.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof Z && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new qa(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new Z(e.resolve(n.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, n) {
    return new Z(e.resolve(n));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
Z.prototype.visible = !1;
se.jsonID("node", Z);
class qa {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: n, pos: r } = e.mapResult(this.anchor);
    return n ? new Co(r, r) : new qa(r);
  }
  resolve(e) {
    let n = e.resolve(this.anchor), r = n.nodeAfter;
    return r && Z.isSelectable(r) ? new Z(n) : se.near(n);
  }
}
class Pt extends se {
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
    return new Pt(e);
  }
  map(e) {
    return new Pt(e);
  }
  eq(e) {
    return e instanceof Pt;
  }
  getBookmark() {
    return K0;
  }
}
se.jsonID("all", Pt);
const K0 = {
  map() {
    return this;
  },
  resolve(t) {
    return new Pt(t);
  }
};
function pr(t, e, n, r, s, i = !1) {
  if (e.inlineContent)
    return te.create(t, n);
  for (let o = r - (s > 0 ? 0 : 1); s > 0 ? o < e.childCount : o >= 0; o += s) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!i && Z.isSelectable(l))
        return Z.create(t, n - (s < 0 ? l.nodeSize : 0));
    } else {
      let a = pr(t, l, n + s, s < 0 ? l.childCount : 0, s, i);
      if (a)
        return a;
    }
    n += l.nodeSize * s;
  }
  return null;
}
function Lu(t, e, n) {
  let r = t.steps.length - 1;
  if (r < e)
    return;
  let s = t.steps[r];
  if (!(s instanceof Ve || s instanceof Ke))
    return;
  let i = t.mapping.maps[r], o;
  i.forEach((l, a, c, u) => {
    o == null && (o = u);
  }), t.setSelection(se.near(t.doc.resolve(o), n));
}
function Pu(t, e) {
  return !e || !t ? t : t.bind(e);
}
class Ds {
  constructor(e, n, r) {
    this.name = e, this.init = Pu(n.init, r), this.apply = Pu(n.apply, r);
  }
}
new Ds("doc", {
  init(t) {
    return t.doc || t.schema.topNodeType.createAndFill();
  },
  apply(t) {
    return t.doc;
  }
}), new Ds("selection", {
  init(t, e) {
    return t.selection || se.atStart(e.doc);
  },
  apply(t) {
    return t.selection;
  }
}), new Ds("storedMarks", {
  init(t) {
    return t.storedMarks || null;
  },
  apply(t, e, n, r) {
    return r.selection.$cursor ? t.storedMarks : null;
  }
}), new Ds("scrollToSelection", {
  init() {
    return 0;
  },
  apply(t, e) {
    return t.scrolledIntoView ? e + 1 : e;
  }
});
function bh(t, e, n) {
  for (let r in t) {
    let s = t[r];
    s instanceof Function ? s = s.bind(e) : r == "handleDOMEvents" && (s = bh(s, e, {})), n[r] = s;
  }
  return n;
}
class Qe {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && bh(e.props, this, this.props), this.key = e.key ? e.key.key : vh("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Xo = /* @__PURE__ */ Object.create(null);
function vh(t) {
  return t in Xo ? t + "$" + ++Xo[t] : (Xo[t] = 0, t + "$");
}
class Ze {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = vh(e);
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
const ir = function(t) {
  for (var e = 0; ; e++)
    if (t = t.previousSibling, !t)
      return e;
}, wh = function(t, e, n, r) {
  return n && (Iu(t, e, n, r, -1) || Iu(t, e, n, r, 1));
}, U0 = /^(img|br|input|textarea|hr)$/i;
function Iu(t, e, n, r, s) {
  for (; ; ) {
    if (t == n && e == r)
      return !0;
    if (e == (s < 0 ? 0 : wi(t))) {
      let i = t.parentNode;
      if (!i || i.nodeType != 1 || Ga(t) || U0.test(t.nodeName) || t.contentEditable == "false")
        return !1;
      e = ir(t) + (s < 0 ? 0 : 1), t = i;
    } else if (t.nodeType == 1) {
      if (t = t.childNodes[e + (s < 0 ? -1 : 0)], t.contentEditable == "false")
        return !1;
      e = s < 0 ? wi(t) : 0;
    } else
      return !1;
  }
}
function wi(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function q0(t, e, n) {
  for (let r = e == 0, s = e == wi(t); r || s; ) {
    if (t == n)
      return !0;
    let i = ir(t);
    if (t = t.parentNode, !t)
      return !1;
    r = r && i == 0, s = s && i == wi(t);
  }
}
function Ga(t) {
  let e;
  for (let n = t; n && !(e = n.pmViewDesc); n = n.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == t || e.contentDOM == t);
}
const xh = function(t) {
  return t.focusNode && wh(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset);
};
function _h(t, e) {
  let n = document.createEvent("Event");
  return n.initEvent("keydown", !0, !0), n.keyCode = t, n.key = n.code = e, n;
}
const Xt = typeof navigator < "u" ? navigator : null, Nu = typeof document < "u" ? document : null, Nn = Xt && Xt.userAgent || "", Dl = /Edge\/(\d+)/.exec(Nn), kh = /MSIE \d/.exec(Nn), Bl = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Nn), Ss = !!(kh || Bl || Dl), Sh = kh ? document.documentMode : Bl ? +Bl[1] : Dl ? +Dl[1] : 0, Eo = !Ss && /gecko\/(\d+)/i.test(Nn);
Eo && +(/Firefox\/(\d+)/.exec(Nn) || [0, 0])[1];
const Hl = !Ss && /Chrome\/(\d+)/.exec(Nn), or = !!Hl, G0 = Hl ? +Hl[1] : 0, lr = !Ss && !!Xt && /Apple Computer/.test(Xt.vendor), Ja = lr && (/Mobile\/\w+/.test(Nn) || !!Xt && Xt.maxTouchPoints > 2), St = Ja || (Xt ? /Mac/.test(Xt.platform) : !1), J0 = Xt ? /Win/.test(Xt.platform) : !1, Cs = /Android \d/.test(Nn), Ya = !!Nu && "webkitFontSmoothing" in Nu.documentElement.style, Y0 = Ya ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function X0(t, e = null) {
  let n = t.domSelectionRange(), r = t.state.doc;
  if (!n.focusNode)
    return null;
  let s = t.docView.nearestDesc(n.focusNode), i = s && s.size == 0, o = t.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (xh(n)) {
    for (a = l; s && !s.node; )
      s = s.parent;
    let u = s.node;
    if (s && u.isAtom && Z.isSelectable(u) && s.parent && !(u.isInline && q0(n.focusNode, n.focusOffset, s.dom))) {
      let f = s.posBefore;
      c = new Z(o == f ? l : r.resolve(f));
    }
  } else {
    let u = t.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
    if (u < 0)
      return null;
    a = r.resolve(u);
  }
  if (!c) {
    let u = e == "pointer" || t.state.selection.head < l.pos && !i ? 1 : -1;
    c = Eh(t, a, l, u);
  }
  return c;
}
function Ch(t) {
  return t.editable ? t.hasFocus() : ty(t) && document.activeElement && document.activeElement.contains(t.dom);
}
function Xa(t, e = !1) {
  let n = t.state.selection;
  if (ey(t, n), !!Ch(t)) {
    if (!e && t.input.mouseDown && t.input.mouseDown.allowDefault && or) {
      let r = t.domSelectionRange(), s = t.domObserver.currentSelection;
      if (r.anchorNode && s.anchorNode && wh(r.anchorNode, r.anchorOffset, s.anchorNode, s.anchorOffset)) {
        t.input.mouseDown.delayedSelectionSync = !0, t.domObserver.setCurSelection();
        return;
      }
    }
    if (t.domObserver.disconnectSelection(), t.cursorWrapper)
      Z0(t);
    else {
      let { anchor: r, head: s } = n, i, o;
      zu && !(n instanceof te) && (n.$from.parent.inlineContent || (i = $u(t, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = $u(t, n.to))), t.docView.setSelection(r, s, t.root, e), zu && (i && Du(i), o && Du(o)), n.visible ? t.dom.classList.remove("ProseMirror-hideselection") : (t.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Q0(t));
    }
    t.domObserver.setCurSelection(), t.domObserver.connectSelection();
  }
}
const zu = lr || or && G0 < 63;
function $u(t, e) {
  let { node: n, offset: r } = t.docView.domFromPos(e, 0), s = r < n.childNodes.length ? n.childNodes[r] : null, i = r ? n.childNodes[r - 1] : null;
  if (lr && s && s.contentEditable == "false")
    return Qo(s);
  if ((!s || s.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (s)
      return Qo(s);
    if (i)
      return Qo(i);
  }
}
function Qo(t) {
  return t.contentEditable = "true", lr && t.draggable && (t.draggable = !1, t.wasDraggable = !0), t;
}
function Du(t) {
  t.contentEditable = "false", t.wasDraggable && (t.draggable = !0, t.wasDraggable = null);
}
function Q0(t) {
  let e = t.dom.ownerDocument;
  e.removeEventListener("selectionchange", t.input.hideSelectionGuard);
  let n = t.domSelectionRange(), r = n.anchorNode, s = n.anchorOffset;
  e.addEventListener("selectionchange", t.input.hideSelectionGuard = () => {
    (n.anchorNode != r || n.anchorOffset != s) && (e.removeEventListener("selectionchange", t.input.hideSelectionGuard), setTimeout(() => {
      (!Ch(t) || t.state.selection.visible) && t.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Z0(t) {
  let e = t.domSelection(), n = document.createRange(), r = t.cursorWrapper.dom, s = r.nodeName == "IMG";
  s ? n.setEnd(r.parentNode, ir(r) + 1) : n.setEnd(r, 0), n.collapse(!1), e.removeAllRanges(), e.addRange(n), !s && !t.state.selection.visible && Ss && Sh <= 11 && (r.disabled = !0, r.disabled = !1);
}
function ey(t, e) {
  if (e instanceof Z) {
    let n = t.docView.descAt(e.from);
    n != t.lastSelectedViewDesc && (Bu(t), n && n.selectNode(), t.lastSelectedViewDesc = n);
  } else
    Bu(t);
}
function Bu(t) {
  t.lastSelectedViewDesc && (t.lastSelectedViewDesc.parent && t.lastSelectedViewDesc.deselectNode(), t.lastSelectedViewDesc = void 0);
}
function Eh(t, e, n, r) {
  return t.someProp("createSelectionBetween", (s) => s(t, e, n)) || te.between(e, n, r);
}
function ty(t) {
  let e = t.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return t.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (t.editable || t.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Fl(t, e) {
  let { $anchor: n, $head: r } = t.selection, s = e > 0 ? n.max(r) : n.min(r), i = s.parent.inlineContent ? s.depth ? t.doc.resolve(e > 0 ? s.after() : s.before()) : null : s;
  return i && se.findFrom(i, e);
}
function bn(t, e) {
  return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Hu(t, e, n) {
  let r = t.state.selection;
  if (r instanceof te)
    if (n.indexOf("s") > -1) {
      let { $head: s } = r, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter;
      if (!i || i.isText || !i.isLeaf)
        return !1;
      let o = t.state.doc.resolve(s.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return bn(t, new te(r.$anchor, o));
    } else if (r.empty) {
      if (t.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let s = Fl(t.state, e);
        return s && s instanceof Z ? bn(t, s) : !1;
      } else if (!(St && n.indexOf("m") > -1)) {
        let s = r.$head, i = s.textOffset ? null : e < 0 ? s.nodeBefore : s.nodeAfter, o;
        if (!i || i.isText)
          return !1;
        let l = e < 0 ? s.pos - i.nodeSize : s.pos;
        return i.isAtom || (o = t.docView.descAt(l)) && !o.contentDOM ? Z.isSelectable(i) ? bn(t, new Z(e < 0 ? t.state.doc.resolve(s.pos - i.nodeSize) : s)) : Ya ? bn(t, new te(t.state.doc.resolve(e < 0 ? l : l + i.nodeSize))) : !1 : !1;
      }
    } else
      return !1;
  else {
    if (r instanceof Z && r.node.isInline)
      return bn(t, new te(e > 0 ? r.$to : r.$from));
    {
      let s = Fl(t.state, e);
      return s ? bn(t, s) : !1;
    }
  }
}
function xi(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function is(t, e) {
  let n = t.pmViewDesc;
  return n && n.size == 0 && (e < 0 || t.nextSibling || t.nodeName != "BR");
}
function dr(t, e) {
  return e < 0 ? ny(t) : ry(t);
}
function ny(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let s, i, o = !1;
  for (Eo && n.nodeType == 1 && r < xi(n) && is(n.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (n.nodeType != 1)
        break;
      {
        let l = n.childNodes[r - 1];
        if (is(l, -1))
          s = n, i = --r;
        else if (l.nodeType == 3)
          n = l, r = n.nodeValue.length;
        else
          break;
      }
    } else {
      if (Mh(n))
        break;
      {
        let l = n.previousSibling;
        for (; l && is(l, -1); )
          s = n.parentNode, i = ir(l), l = l.previousSibling;
        if (l)
          n = l, r = xi(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Vl(t, n, r) : s && Vl(t, s, i);
}
function ry(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let s = xi(n), i, o;
  for (; ; )
    if (r < s) {
      if (n.nodeType != 1)
        break;
      let l = n.childNodes[r];
      if (is(l, 1))
        i = n, o = ++r;
      else
        break;
    } else {
      if (Mh(n))
        break;
      {
        let l = n.nextSibling;
        for (; l && is(l, 1); )
          i = l.parentNode, o = ir(l) + 1, l = l.nextSibling;
        if (l)
          n = l, r = 0, s = xi(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = s = 0;
        }
      }
    }
  i && Vl(t, i, o);
}
function Mh(t) {
  let e = t.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function sy(t, e) {
  for (; t && e == t.childNodes.length && !Ga(t); )
    e = ir(t) + 1, t = t.parentNode;
  for (; t && e < t.childNodes.length; ) {
    let n = t.childNodes[e];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = 0;
  }
}
function iy(t, e) {
  for (; t && !e && !Ga(t); )
    e = ir(t), t = t.parentNode;
  for (; t && e; ) {
    let n = t.childNodes[e - 1];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = t.childNodes.length;
  }
}
function Vl(t, e, n) {
  if (e.nodeType != 3) {
    let i, o;
    (o = sy(e, n)) ? (e = o, n = 0) : (i = iy(e, n)) && (e = i, n = i.nodeValue.length);
  }
  let r = t.domSelection();
  if (xh(r)) {
    let i = document.createRange();
    i.setEnd(e, n), i.setStart(e, n), r.removeAllRanges(), r.addRange(i);
  } else
    r.extend && r.extend(e, n);
  t.domObserver.setCurSelection();
  let { state: s } = t;
  setTimeout(() => {
    t.state == s && Xa(t);
  }, 50);
}
function Fu(t, e) {
  let n = t.state.doc.resolve(e);
  if (!(or || J0) && n.parent.inlineContent) {
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
function Vu(t, e, n) {
  let r = t.state.selection;
  if (r instanceof te && !r.empty || n.indexOf("s") > -1 || St && n.indexOf("m") > -1)
    return !1;
  let { $from: s, $to: i } = r;
  if (!s.parent.inlineContent || t.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Fl(t.state, e);
    if (o && o instanceof Z)
      return bn(t, o);
  }
  if (!s.parent.inlineContent) {
    let o = e < 0 ? s : i, l = r instanceof Pt ? se.near(o, e) : se.findFrom(o, e);
    return l ? bn(t, l) : !1;
  }
  return !1;
}
function Wu(t, e) {
  if (!(t.state.selection instanceof te))
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
function Ku(t, e, n) {
  t.domObserver.stop(), e.contentEditable = n, t.domObserver.start();
}
function oy(t) {
  if (!lr || t.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: n } = t.domSelectionRange();
  if (e && e.nodeType == 1 && n == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    Ku(t, r, "true"), setTimeout(() => Ku(t, r, "false"), 20);
  }
  return !1;
}
function ly(t) {
  let e = "";
  return t.ctrlKey && (e += "c"), t.metaKey && (e += "m"), t.altKey && (e += "a"), t.shiftKey && (e += "s"), e;
}
function ay(t, e) {
  let n = e.keyCode, r = ly(e);
  if (n == 8 || St && n == 72 && r == "c")
    return Wu(t, -1) || dr(t, -1);
  if (n == 46 && !e.shiftKey || St && n == 68 && r == "c")
    return Wu(t, 1) || dr(t, 1);
  if (n == 13 || n == 27)
    return !0;
  if (n == 37 || St && n == 66 && r == "c") {
    let s = n == 37 ? Fu(t, t.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Hu(t, s, r) || dr(t, s);
  } else if (n == 39 || St && n == 70 && r == "c") {
    let s = n == 39 ? Fu(t, t.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Hu(t, s, r) || dr(t, s);
  } else {
    if (n == 38 || St && n == 80 && r == "c")
      return Vu(t, -1, r) || dr(t, -1);
    if (n == 40 || St && n == 78 && r == "c")
      return oy(t) || Vu(t, 1, r) || dr(t, 1);
    if (r == (St ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90))
      return !0;
  }
  return !1;
}
function Ah(t, e) {
  t.someProp("transformCopied", (g) => {
    e = g(e, t);
  });
  let n = [], { content: r, openStart: s, openEnd: i } = e;
  for (; s > 1 && i > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    s--, i--;
    let g = r.firstChild;
    n.push(g.type.name, g.attrs != g.type.defaultAttrs ? g.attrs : null), r = g.content;
  }
  let o = t.someProp("clipboardSerializer") || Jn.fromSchema(t.state.schema), l = Ph(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, f = 0;
  for (; c && c.nodeType == 1 && (u = Lh[c.nodeName.toLowerCase()]); ) {
    for (let g = u.length - 1; g >= 0; g--) {
      let y = l.createElement(u[g]);
      for (; a.firstChild; )
        y.appendChild(a.firstChild);
      a.appendChild(y), f++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${s} ${i}${f ? ` -${f}` : ""} ${JSON.stringify(n)}`);
  let h = t.someProp("clipboardTextSerializer", (g) => g(e, t)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: h };
}
function Th(t, e, n, r, s) {
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
      let h = s.marks(), { schema: g } = t.state, y = Jn.fromSchema(g);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((v) => {
        let k = o.appendChild(document.createElement("p"));
        v && k.appendChild(y.serializeNode(g.text(v, h)));
      });
    }
  } else
    t.someProp("transformPastedHTML", (f) => {
      n = f(n, t);
    }), o = dy(n), Ya && fy(o);
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
  if (l || (l = (t.someProp("clipboardParser") || t.someProp("domParser") || nh.fromSchema(t.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || u),
    context: s,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !cy.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = hy(Uu(l, +u[1], +u[2]), u[4]);
  else if (l = U.maxOpen(uy(l.content, s), !0), l.openStart || l.openEnd) {
    let f = 0, h = 0;
    for (let g = l.content.firstChild; f < l.openStart && !g.type.spec.isolating; f++, g = g.firstChild)
      ;
    for (let g = l.content.lastChild; h < l.openEnd && !g.type.spec.isolating; h++, g = g.lastChild)
      ;
    l = Uu(l, f, h);
  }
  return t.someProp("transformPasted", (f) => {
    l = f(l, t);
  }), l;
}
const cy = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function uy(t, e) {
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
      if (c = o.length && i.length && Oh(a, i, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Rh(o[o.length - 1], i.length));
        let u = jh(l, a);
        o.push(u), s = s.matchType(u.type), i = a;
      }
    }), o)
      return H.from(o);
  }
  return t;
}
function jh(t, e, n = 0) {
  for (let r = e.length - 1; r >= n; r--)
    t = e[r].create(null, H.from(t));
  return t;
}
function Oh(t, e, n, r, s) {
  if (s < t.length && s < e.length && t[s] == e[s]) {
    let i = Oh(t, e, n, r.lastChild, s + 1);
    if (i)
      return r.copy(r.content.replaceChild(r.childCount - 1, i));
    if (r.contentMatchAt(r.childCount).matchType(s == t.length - 1 ? n.type : t[s + 1]))
      return r.copy(r.content.append(H.from(jh(n, t, s + 1))));
  }
}
function Rh(t, e) {
  if (e == 0)
    return t;
  let n = t.content.replaceChild(t.childCount - 1, Rh(t.lastChild, e - 1)), r = t.contentMatchAt(t.childCount).fillBefore(H.empty, !0);
  return t.copy(n.append(r));
}
function Wl(t, e, n, r, s, i) {
  let o = e < 0 ? t.firstChild : t.lastChild, l = o.content;
  return t.childCount > 1 && (i = 0), s < r - 1 && (l = Wl(l, e, n, r, s + 1, i)), s >= n && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, i <= s).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(H.empty, !0))), t.replaceChild(e < 0 ? 0 : t.childCount - 1, o.copy(l));
}
function Uu(t, e, n) {
  return e < t.openStart && (t = new U(Wl(t.content, -1, e, t.openStart, 0, t.openEnd), e, t.openEnd)), n < t.openEnd && (t = new U(Wl(t.content, 1, n, t.openEnd, 0, 0), t.openStart, n)), t;
}
const Lh = {
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
let qu = null;
function Ph() {
  return qu || (qu = document.implementation.createHTMLDocument("title"));
}
function dy(t) {
  let e = /^(\s*<meta [^>]*>)*/.exec(t);
  e && (t = t.slice(e[0].length));
  let n = Ph().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(t), s;
  if ((s = r && Lh[r[1].toLowerCase()]) && (t = s.map((i) => "<" + i + ">").join("") + t + s.map((i) => "</" + i + ">").reverse().join("")), n.innerHTML = t, s)
    for (let i = 0; i < s.length; i++)
      n = n.querySelector(s[i]) || n;
  return n;
}
function fy(t) {
  let e = t.querySelectorAll(or ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "), r);
  }
}
function hy(t, e) {
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
const It = {}, vt = {};
function Cn(t, e) {
  t.input.lastSelectionOrigin = e, t.input.lastSelectionTime = Date.now();
}
vt.keydown = (t, e) => {
  let n = e;
  if (t.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Nh(t, n) && (t.input.lastKeyCode = n.keyCode, t.input.lastKeyCodeTime = Date.now(), !(Cs && or && n.keyCode == 13)))
    if (n.keyCode != 229 && t.domObserver.forceFlush(), Ja && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
      let r = Date.now();
      t.input.lastIOSEnter = r, t.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        t.input.lastIOSEnter == r && (t.someProp("handleKeyDown", (s) => s(t, _h(13, "Enter"))), t.input.lastIOSEnter = 0);
      }, 200);
    } else
      t.someProp("handleKeyDown", (r) => r(t, n)) || ay(t, n) ? n.preventDefault() : Cn(t, "key");
};
vt.keyup = (t, e) => {
  e.keyCode == 16 && (t.input.shiftKey = !1);
};
vt.keypress = (t, e) => {
  let n = e;
  if (Nh(t, n) || !n.charCode || n.ctrlKey && !n.altKey || St && n.metaKey)
    return;
  if (t.someProp("handleKeyPress", (s) => s(t, n))) {
    n.preventDefault();
    return;
  }
  let r = t.state.selection;
  if (!(r instanceof te) || !r.$from.sameParent(r.$to)) {
    let s = String.fromCharCode(n.charCode);
    !/[\r\n]/.test(s) && !t.someProp("handleTextInput", (i) => i(t, r.$from.pos, r.$to.pos, s)) && t.dispatch(t.state.tr.insertText(s).scrollIntoView()), n.preventDefault();
  }
};
function Mo(t) {
  return { left: t.clientX, top: t.clientY };
}
function py(t, e) {
  let n = e.x - t.clientX, r = e.y - t.clientY;
  return n * n + r * r < 100;
}
function Qa(t, e, n, r, s) {
  if (r == -1)
    return !1;
  let i = t.state.doc.resolve(r);
  for (let o = i.depth + 1; o > 0; o--)
    if (t.someProp(e, (l) => o > i.depth ? l(t, n, i.nodeAfter, i.before(o), s, !0) : l(t, n, i.node(o), i.before(o), s, !1)))
      return !0;
  return !1;
}
function Tr(t, e, n) {
  t.focused || t.focus();
  let r = t.state.tr.setSelection(e);
  n == "pointer" && r.setMeta("pointer", !0), t.dispatch(r);
}
function my(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.doc.resolve(e), r = n.nodeAfter;
  return r && r.isAtom && Z.isSelectable(r) ? (Tr(t, new Z(n), "pointer"), !0) : !1;
}
function gy(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.selection, r, s;
  n instanceof Z && (r = n.node);
  let i = t.state.doc.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let l = o > i.depth ? i.nodeAfter : i.node(o);
    if (Z.isSelectable(l)) {
      r && n.$from.depth > 0 && o >= n.$from.depth && i.before(n.$from.depth + 1) == n.$from.pos ? s = i.before(n.$from.depth) : s = i.before(o);
      break;
    }
  }
  return s != null ? (Tr(t, Z.create(t.state.doc, s), "pointer"), !0) : !1;
}
function yy(t, e, n, r, s) {
  return Qa(t, "handleClickOn", e, n, r) || t.someProp("handleClick", (i) => i(t, e, r)) || (s ? gy(t, n) : my(t, n));
}
function by(t, e, n, r) {
  return Qa(t, "handleDoubleClickOn", e, n, r) || t.someProp("handleDoubleClick", (s) => s(t, e, r));
}
function vy(t, e, n, r) {
  return Qa(t, "handleTripleClickOn", e, n, r) || t.someProp("handleTripleClick", (s) => s(t, e, r)) || wy(t, n, r);
}
function wy(t, e, n) {
  if (n.button != 0)
    return !1;
  let r = t.state.doc;
  if (e == -1)
    return r.inlineContent ? (Tr(t, te.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let s = r.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let o = i > s.depth ? s.nodeAfter : s.node(i), l = s.before(i);
    if (o.inlineContent)
      Tr(t, te.create(r, l + 1, l + 1 + o.content.size), "pointer");
    else if (Z.isSelectable(o))
      Tr(t, Z.create(r, l), "pointer");
    else
      continue;
    return !0;
  }
}
function Za(t) {
  return _i(t);
}
const Ih = St ? "metaKey" : "ctrlKey";
It.mousedown = (t, e) => {
  let n = e;
  t.input.shiftKey = n.shiftKey;
  let r = Za(t), s = Date.now(), i = "singleClick";
  s - t.input.lastClick.time < 500 && py(n, t.input.lastClick) && !n[Ih] && (t.input.lastClick.type == "singleClick" ? i = "doubleClick" : t.input.lastClick.type == "doubleClick" && (i = "tripleClick")), t.input.lastClick = { time: s, x: n.clientX, y: n.clientY, type: i };
  let o = t.posAtCoords(Mo(n));
  o && (i == "singleClick" ? (t.input.mouseDown && t.input.mouseDown.done(), t.input.mouseDown = new xy(t, o, n, !!r)) : (i == "doubleClick" ? by : vy)(t, o.pos, o.inside, n) ? n.preventDefault() : Cn(t, "pointer"));
};
class xy {
  constructor(e, n, r, s) {
    this.view = e, this.pos = n, this.event = r, this.flushed = s, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Ih], this.allowDefault = r.shiftKey;
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
    (r.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1 || c instanceof Z && c.from <= o && c.to > o) && (this.mightDrag = {
      node: i,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Eo && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Cn(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Xa(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let n = this.pos;
    this.view.state.doc != this.startDoc && (n = this.view.posAtCoords(Mo(e))), this.updateAllowDefault(e), this.allowDefault || !n ? Cn(this.view, "pointer") : yy(this.view, n.pos, n.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    lr && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    or && !this.view.state.selection.visible && Math.min(Math.abs(n.pos - this.view.state.selection.from), Math.abs(n.pos - this.view.state.selection.to)) <= 2) ? (Tr(this.view, se.near(this.view.state.doc.resolve(n.pos)), "pointer"), e.preventDefault()) : Cn(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Cn(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
It.touchstart = (t) => {
  t.input.lastTouch = Date.now(), Za(t), Cn(t, "pointer");
};
It.touchmove = (t) => {
  t.input.lastTouch = Date.now(), Cn(t, "pointer");
};
It.contextmenu = (t) => Za(t);
function Nh(t, e) {
  return t.composing ? !0 : lr && Math.abs(e.timeStamp - t.input.compositionEndedAt) < 500 ? (t.input.compositionEndedAt = -2e8, !0) : !1;
}
const _y = Cs ? 5e3 : -1;
vt.compositionstart = vt.compositionupdate = (t) => {
  if (!t.composing) {
    t.domObserver.flush();
    let { state: e } = t, n = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      t.markCursor = t.state.storedMarks || n.marks(), _i(t, !0), t.markCursor = null;
    else if (_i(t), Eo && e.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
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
  zh(t, _y);
};
vt.compositionend = (t, e) => {
  t.composing && (t.input.composing = !1, t.input.compositionEndedAt = e.timeStamp, t.input.compositionPendingChanges = t.domObserver.pendingRecords().length ? t.input.compositionID : 0, t.input.compositionPendingChanges && Promise.resolve().then(() => t.domObserver.flush()), t.input.compositionID++, zh(t, 20));
};
function zh(t, e) {
  clearTimeout(t.input.composingTimeout), e > -1 && (t.input.composingTimeout = setTimeout(() => _i(t), e));
}
function ky(t) {
  for (t.composing && (t.input.composing = !1, t.input.compositionEndedAt = Sy()); t.input.compositionNodes.length > 0; )
    t.input.compositionNodes.pop().markParentsDirty();
}
function Sy() {
  let t = document.createEvent("Event");
  return t.initEvent("event", !0, !0), t.timeStamp;
}
function _i(t, e = !1) {
  if (!(Cs && t.domObserver.flushingSoon >= 0)) {
    if (t.domObserver.forceFlush(), ky(t), e || t.docView && t.docView.dirty) {
      let n = X0(t);
      return n && !n.eq(t.state.selection) ? t.dispatch(t.state.tr.setSelection(n)) : t.updateState(t.state), !0;
    }
    return !1;
  }
}
function Cy(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.dom.parentNode.appendChild(document.createElement("div"));
  n.appendChild(e), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), s = document.createRange();
  s.selectNodeContents(e), t.dom.blur(), r.removeAllRanges(), r.addRange(s), setTimeout(() => {
    n.parentNode && n.parentNode.removeChild(n), t.focus();
  }, 50);
}
const gs = Ss && Sh < 15 || Ja && Y0 < 604;
It.copy = vt.cut = (t, e) => {
  let n = e, r = t.state.selection, s = n.type == "cut";
  if (r.empty)
    return;
  let i = gs ? null : n.clipboardData, o = r.content(), { dom: l, text: a } = Ah(t, o);
  i ? (n.preventDefault(), i.clearData(), i.setData("text/html", l.innerHTML), i.setData("text/plain", a)) : Cy(t, l), s && t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Ey(t) {
  return t.openStart == 0 && t.openEnd == 0 && t.content.childCount == 1 ? t.content.firstChild : null;
}
function My(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.input.shiftKey || t.state.selection.$from.parent.type.spec.code, r = t.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
  n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let s = t.input.shiftKey && t.input.lastKeyCode != 45;
  setTimeout(() => {
    t.focus(), r.parentNode && r.parentNode.removeChild(r), n ? Kl(t, r.value, null, s, e) : Kl(t, r.textContent, r.innerHTML, s, e);
  }, 50);
}
function Kl(t, e, n, r, s) {
  let i = Th(t, e, n, r, t.state.selection.$from);
  if (t.someProp("handlePaste", (a) => a(t, s, i || U.empty)))
    return !0;
  if (!i)
    return !1;
  let o = Ey(i), l = o ? t.state.tr.replaceSelectionWith(o, r) : t.state.tr.replaceSelection(i);
  return t.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function $h(t) {
  let e = t.getData("text/plain") || t.getData("Text");
  if (e)
    return e;
  let n = t.getData("text/uri-list");
  return n ? n.replace(/\r?\n/g, " ") : "";
}
vt.paste = (t, e) => {
  let n = e;
  if (t.composing && !Cs)
    return;
  let r = gs ? null : n.clipboardData, s = t.input.shiftKey && t.input.lastKeyCode != 45;
  r && Kl(t, $h(r), r.getData("text/html"), s, n) ? n.preventDefault() : My(t, n);
};
class Ay {
  constructor(e, n, r) {
    this.slice = e, this.move = n, this.node = r;
  }
}
const Dh = St ? "altKey" : "ctrlKey";
It.dragstart = (t, e) => {
  let n = e, r = t.input.mouseDown;
  if (r && r.done(), !n.dataTransfer)
    return;
  let s = t.state.selection, i = s.empty ? null : t.posAtCoords(Mo(n)), o;
  if (!(i && i.pos >= s.from && i.pos <= (s instanceof Z ? s.to - 1 : s.to))) {
    if (r && r.mightDrag)
      o = Z.create(t.state.doc, r.mightDrag.pos);
    else if (n.target && n.target.nodeType == 1) {
      let u = t.docView.nearestDesc(n.target, !0);
      u && u.node.type.spec.draggable && u != t.docView && (o = Z.create(t.state.doc, u.posBefore));
    }
  }
  let l = (o || t.state.selection).content(), { dom: a, text: c } = Ah(t, l);
  n.dataTransfer.clearData(), n.dataTransfer.setData(gs ? "Text" : "text/html", a.innerHTML), n.dataTransfer.effectAllowed = "copyMove", gs || n.dataTransfer.setData("text/plain", c), t.dragging = new Ay(l, !n[Dh], o);
};
It.dragend = (t) => {
  let e = t.dragging;
  window.setTimeout(() => {
    t.dragging == e && (t.dragging = null);
  }, 50);
};
vt.dragover = vt.dragenter = (t, e) => e.preventDefault();
vt.drop = (t, e) => {
  let n = e, r = t.dragging;
  if (t.dragging = null, !n.dataTransfer)
    return;
  let s = t.posAtCoords(Mo(n));
  if (!s)
    return;
  let i = t.state.doc.resolve(s.pos), o = r && r.slice;
  o ? t.someProp("transformPasted", (y) => {
    o = y(o, t);
  }) : o = Th(t, $h(n.dataTransfer), gs ? null : n.dataTransfer.getData("text/html"), !1, i);
  let l = !!(r && !n[Dh]);
  if (t.someProp("handleDrop", (y) => y(t, n, o || U.empty, l))) {
    n.preventDefault();
    return;
  }
  if (!o)
    return;
  n.preventDefault();
  let a = o ? dh(t.state.doc, i.pos, o) : i.pos;
  a == null && (a = i.pos);
  let c = t.state.tr;
  if (l) {
    let { node: y } = r;
    y ? y.replace(c) : c.deleteSelection();
  }
  let u = c.mapping.map(a), f = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, h = c.doc;
  if (f ? c.replaceRangeWith(u, u, o.content.firstChild) : c.replaceRange(u, u, o), c.doc.eq(h))
    return;
  let g = c.doc.resolve(u);
  if (f && Z.isSelectable(o.content.firstChild) && g.nodeAfter && g.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new Z(g));
  else {
    let y = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((v, k, E, T) => y = T), c.setSelection(Eh(t, g, c.doc.resolve(y)));
  }
  t.focus(), t.dispatch(c.setMeta("uiEvent", "drop"));
};
It.focus = (t) => {
  t.input.lastFocus = Date.now(), t.focused || (t.domObserver.stop(), t.dom.classList.add("ProseMirror-focused"), t.domObserver.start(), t.focused = !0, setTimeout(() => {
    t.docView && t.hasFocus() && !t.domObserver.currentSelection.eq(t.domSelectionRange()) && Xa(t);
  }, 20));
};
It.blur = (t, e) => {
  let n = e;
  t.focused && (t.domObserver.stop(), t.dom.classList.remove("ProseMirror-focused"), t.domObserver.start(), n.relatedTarget && t.dom.contains(n.relatedTarget) && t.domObserver.currentSelection.clear(), t.focused = !1);
};
It.beforeinput = (t, e) => {
  if (or && Cs && e.inputType == "deleteContentBackward") {
    t.domObserver.flushSoon();
    let { domChangeCount: r } = t.input;
    setTimeout(() => {
      if (t.input.domChangeCount != r || (t.dom.blur(), t.focus(), t.someProp("handleKeyDown", (i) => i(t, _h(8, "Backspace")))))
        return;
      let { $cursor: s } = t.state.selection;
      s && s.pos > 0 && t.dispatch(t.state.tr.delete(s.pos - 1, s.pos).scrollIntoView());
    }, 50);
  }
};
for (let t in vt)
  It[t] = vt[t];
function ys(t, e) {
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
class ki {
  constructor(e, n) {
    this.toDOM = e, this.spec = n || tr, this.side = this.spec.side || 0;
  }
  map(e, n, r, s) {
    let { pos: i, deleted: o } = e.mapResult(n.from + s, this.side < 0 ? -1 : 1);
    return o ? null : new dt(i - r, i - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof ki && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && ys(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Mn {
  constructor(e, n) {
    this.attrs = e, this.spec = n || tr;
  }
  map(e, n, r, s) {
    let i = e.map(n.from + s, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(n.to + s, this.spec.inclusiveEnd ? 1 : -1) - r;
    return i >= o ? null : new dt(i, o, this);
  }
  valid(e, n) {
    return n.from < n.to;
  }
  eq(e) {
    return this == e || e instanceof Mn && ys(this.attrs, e.attrs) && ys(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Mn;
  }
  destroy() {
  }
}
class ec {
  constructor(e, n) {
    this.attrs = e, this.spec = n || tr;
  }
  map(e, n, r, s) {
    let i = e.mapResult(n.from + s, 1);
    if (i.deleted)
      return null;
    let o = e.mapResult(n.to + s, -1);
    return o.deleted || o.pos <= i.pos ? null : new dt(i.pos - r, o.pos - r, this);
  }
  valid(e, n) {
    let { index: r, offset: s } = e.content.findIndex(n.from), i;
    return s == n.from && !(i = e.child(r)).isText && s + i.nodeSize == n.to;
  }
  eq(e) {
    return this == e || e instanceof ec && ys(this.attrs, e.attrs) && ys(this.spec, e.spec);
  }
  destroy() {
  }
}
class dt {
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
    return new dt(e, n, this.type);
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
    return new dt(e, e, new ki(n, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, n, r, s) {
    return new dt(e, n, new Mn(r, s));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, n, r, s) {
    return new dt(e, n, new ec(r, s));
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
    return this.type instanceof Mn;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof ki;
  }
}
const mr = [], tr = {};
class ke {
  /**
  @internal
  */
  constructor(e, n) {
    this.local = e.length ? e : mr, this.children = n.length ? n : mr;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, n) {
    return n.length ? Si(n, e, 0, tr) : ot;
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
    return this == ot || e.maps.length == 0 ? this : this.mapInner(e, n, 0, 0, r || tr);
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
    return this.children.length ? Ty(this.children, o || [], e, n, r, s, i) : o ? new ke(o.sort(nr), mr) : ot;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, n) {
    return n.length ? this == ot ? ke.create(e, n) : this.addInner(e, n, 0) : this;
  }
  addInner(e, n, r) {
    let s, i = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (u = Hh(n, l, c)) {
        for (s || (s = this.children.slice()); i < s.length && s[i] < a; )
          i += 3;
        s[i] == a ? s[i + 2] = s[i + 2].addInner(l, u, c + 1) : s.splice(i, 0, a, a + l.nodeSize, Si(u, l, c + 1, tr)), i += 3;
      }
    });
    let o = Bh(i ? Fh(n) : n, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new ke(o.length ? this.local.concat(o).sort(nr) : this.local, s || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == ot ? this : this.removeInner(e, 0);
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
      c != ot ? r[i + 2] = c : (r.splice(i, 3), i -= 3);
    }
    if (s.length) {
      for (let i = 0, o; i < e.length; i++)
        if (o = e[i])
          for (let l = 0; l < s.length; l++)
            s[l].eq(o, n) && (s == this.local && (s = this.local.slice()), s.splice(l--, 1));
    }
    return r == this.children && s == this.local ? this : s.length || r.length ? new ke(s, r) : ot;
  }
  forChild(e, n) {
    if (this == ot)
      return this;
    if (n.isLeaf)
      return ke.empty;
    let r, s;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let i = e + 1, o = i + n.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > i && a.type instanceof Mn) {
        let c = Math.max(i, a.from) - i, u = Math.min(o, a.to) - i;
        c < u && (s || (s = [])).push(a.copy(c, u));
      }
    }
    if (s) {
      let l = new ke(s.sort(nr), mr);
      return r ? new Un([l, r]) : l;
    }
    return r || ot;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof ke) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return tc(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == ot)
      return mr;
    if (e.inlineContent || !this.local.some(Mn.is))
      return this.local;
    let n = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Mn || n.push(this.local[r]);
    return n;
  }
}
ke.empty = new ke([], []);
ke.removeOverlap = tc;
const ot = ke.empty;
class Un {
  constructor(e) {
    this.members = e;
  }
  map(e, n) {
    const r = this.members.map((s) => s.map(e, n, tr));
    return Un.from(r);
  }
  forChild(e, n) {
    if (n.isLeaf)
      return ke.empty;
    let r = [];
    for (let s = 0; s < this.members.length; s++) {
      let i = this.members[s].forChild(e, n);
      i != ot && (i instanceof Un ? r = r.concat(i.members) : r.push(i));
    }
    return Un.from(r);
  }
  eq(e) {
    if (!(e instanceof Un) || e.members.length != this.members.length)
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
    return n ? tc(r ? n : n.sort(nr)) : mr;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return ot;
      case 1:
        return e[0];
      default:
        return new Un(e.every((n) => n instanceof ke) ? e : e.reduce((n, r) => n.concat(r instanceof ke ? r : r.members), []));
    }
  }
}
function Ty(t, e, n, r, s, i, o) {
  let l = t.slice();
  for (let c = 0, u = i; c < n.maps.length; c++) {
    let f = 0;
    n.maps[c].forEach((h, g, y, v) => {
      let k = v - y - (g - h);
      for (let E = 0; E < l.length; E += 3) {
        let T = l[E + 1];
        if (T < 0 || h > T + u - f)
          continue;
        let j = l[E] + u - f;
        g >= j ? l[E + 1] = h <= j ? -2 : -1 : h >= u && k && (l[E] += k, l[E + 1] += k);
      }
      f += k;
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
      let h = n.map(t[c + 1] + i, -1), g = h - s, { index: y, offset: v } = r.content.findIndex(f), k = r.maybeChild(y);
      if (k && v == f && v + k.nodeSize == g) {
        let E = l[c + 2].mapInner(n, k, u + 1, t[c] + i + 1, o);
        E != ot ? (l[c] = f, l[c + 1] = g, l[c + 2] = E) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = jy(l, t, e, n, s, i, o), u = Si(c, r, 0, o);
    e = u.local;
    for (let f = 0; f < l.length; f += 3)
      l[f + 1] < 0 && (l.splice(f, 3), f -= 3);
    for (let f = 0, h = 0; f < u.children.length; f += 3) {
      let g = u.children[f];
      for (; h < l.length && l[h] < g; )
        h += 3;
      l.splice(h, 0, u.children[f], u.children[f + 1], u.children[f + 2]);
    }
  }
  return new ke(e.sort(nr), l);
}
function Bh(t, e) {
  if (!e || !t.length)
    return t;
  let n = [];
  for (let r = 0; r < t.length; r++) {
    let s = t[r];
    n.push(new dt(s.from + e, s.to + e, s.type));
  }
  return n;
}
function jy(t, e, n, r, s, i, o) {
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
function Hh(t, e, n) {
  if (e.isLeaf)
    return null;
  let r = n + e.nodeSize, s = null;
  for (let i = 0, o; i < t.length; i++)
    (o = t[i]) && o.from > n && o.to < r && ((s || (s = [])).push(o), t[i] = null);
  return s;
}
function Fh(t) {
  let e = [];
  for (let n = 0; n < t.length; n++)
    t[n] != null && e.push(t[n]);
  return e;
}
function Si(t, e, n, r) {
  let s = [], i = !1;
  e.forEach((l, a) => {
    let c = Hh(t, l, a + n);
    if (c) {
      i = !0;
      let u = Si(c, l, n + a + 1, r);
      u != ot && s.push(a, a + l.nodeSize, u);
    }
  });
  let o = Bh(i ? Fh(t) : t, -n).sort(nr);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || s.length ? new ke(o, s) : ot;
}
function nr(t, e) {
  return t.from - e.from || t.to - e.to;
}
function tc(t) {
  let e = t;
  for (let n = 0; n < e.length - 1; n++) {
    let r = e[n];
    if (r.from != r.to)
      for (let s = n + 1; s < e.length; s++) {
        let i = e[s];
        if (i.from == r.from) {
          i.to != r.to && (e == t && (e = t.slice()), e[s] = i.copy(i.from, r.to), Gu(e, s + 1, i.copy(r.to, i.to)));
          continue;
        } else {
          i.from < r.to && (e == t && (e = t.slice()), e[n] = r.copy(r.from, i.from), Gu(e, s, r.copy(i.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Gu(t, e, n) {
  for (; e < t.length && nr(n, t[e]) > 0; )
    e++;
  t.splice(e, 0, n);
}
var On = {
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
}, Ci = {
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
}, Oy = typeof navigator < "u" && /Mac/.test(navigator.platform), Ry = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Ge = 0; Ge < 10; Ge++)
  On[48 + Ge] = On[96 + Ge] = String(Ge);
for (var Ge = 1; Ge <= 24; Ge++)
  On[Ge + 111] = "F" + Ge;
for (var Ge = 65; Ge <= 90; Ge++)
  On[Ge] = String.fromCharCode(Ge + 32), Ci[Ge] = String.fromCharCode(Ge);
for (var Zo in On)
  Ci.hasOwnProperty(Zo) || (Ci[Zo] = On[Zo]);
function Ly(t) {
  var e = Oy && t.metaKey && t.shiftKey && !t.ctrlKey && !t.altKey || Ry && t.shiftKey && t.key && t.key.length == 1 || t.key == "Unidentified", n = !e && t.key || (t.shiftKey ? Ci : On)[t.keyCode] || t.key || "Unidentified";
  return n == "Esc" && (n = "Escape"), n == "Del" && (n = "Delete"), n == "Left" && (n = "ArrowLeft"), n == "Up" && (n = "ArrowUp"), n == "Right" && (n = "ArrowRight"), n == "Down" && (n = "ArrowDown"), n;
}
const Py = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function Iy(t) {
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
      Py ? o = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (n = "Alt-" + n), s && (n = "Ctrl-" + n), o && (n = "Meta-" + n), i && (n = "Shift-" + n), n;
}
function Ny(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t)
    e[Iy(n)] = t[n];
  return e;
}
function el(t, e, n = !0) {
  return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), n && e.shiftKey && (t = "Shift-" + t), t;
}
function Vh(t) {
  let e = Ny(t);
  return function(n, r) {
    let s = Ly(r), i, o = e[el(s, r)];
    if (o && o(n.state, n.dispatch, n))
      return !0;
    if (s.length == 1 && s != " ") {
      if (r.shiftKey) {
        let l = e[el(s, r, !1)];
        if (l && l(n.state, n.dispatch, n))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || s.charCodeAt(0) > 127) && (i = On[r.keyCode]) && i != s) {
        let l = e[el(i, r)];
        if (l && l(n.state, n.dispatch, n))
          return !0;
      }
    }
    return !1;
  };
}
const zy = (t, e) => t.selection.empty ? !1 : (e && e(t.tr.deleteSelection().scrollIntoView()), !0);
function Wh(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("backward", t) : n.parentOffset > 0) ? null : n;
}
const $y = (t, e, n) => {
  let r = Wh(t, n);
  if (!r)
    return !1;
  let s = nc(r);
  if (!s) {
    let o = r.blockRange(), l = o && zr(o);
    return l == null ? !1 : (e && e(t.tr.lift(o, l).scrollIntoView()), !0);
  }
  let i = s.nodeBefore;
  if (!i.type.spec.isolating && Gh(t, s, e))
    return !0;
  if (r.parent.content.size == 0 && (Lr(i, "end") || Z.isSelectable(i))) {
    let o = So(t.doc, r.before(), r.after(), U.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = t.tr.step(o);
        l.setSelection(Lr(i, "end") ? se.findFrom(l.doc.resolve(l.mapping.map(s.pos, -1)), -1) : Z.create(l.doc, s.pos - i.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(t.tr.delete(s.pos - i.nodeSize, s.pos).scrollIntoView()), !0) : !1;
}, Dy = (t, e, n) => {
  let r = Wh(t, n);
  if (!r)
    return !1;
  let s = nc(r);
  return s ? Kh(t, s, e) : !1;
}, By = (t, e, n) => {
  let r = Uh(t, n);
  if (!r)
    return !1;
  let s = rc(r);
  return s ? Kh(t, s, e) : !1;
};
function Kh(t, e, n) {
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
  let c = So(t.doc, i, a, U.empty);
  if (!c || c.from != i || c instanceof Ve && c.slice.size >= a - i)
    return !1;
  if (n) {
    let u = t.tr.step(c);
    u.setSelection(te.create(u.doc, i)), n(u.scrollIntoView());
  }
  return !0;
}
function Lr(t, e, n = !1) {
  for (let r = t; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (n && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Hy = (t, e, n) => {
  let { $head: r, empty: s } = t.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("backward", t) : r.parentOffset > 0)
      return !1;
    i = nc(r);
  }
  let o = i && i.nodeBefore;
  return !o || !Z.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(Z.create(t.doc, i.pos - o.nodeSize)).scrollIntoView()), !0);
};
function nc(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      if (t.index(e) > 0)
        return t.doc.resolve(t.before(e + 1));
      if (t.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Uh(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("forward", t) : n.parentOffset < n.parent.content.size) ? null : n;
}
const Fy = (t, e, n) => {
  let r = Uh(t, n);
  if (!r)
    return !1;
  let s = rc(r);
  if (!s)
    return !1;
  let i = s.nodeAfter;
  if (Gh(t, s, e))
    return !0;
  if (r.parent.content.size == 0 && (Lr(i, "start") || Z.isSelectable(i))) {
    let o = So(t.doc, r.before(), r.after(), U.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = t.tr.step(o);
        l.setSelection(Lr(i, "start") ? se.findFrom(l.doc.resolve(l.mapping.map(s.pos)), 1) : Z.create(l.doc, l.mapping.map(s.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && s.depth == r.depth - 1 ? (e && e(t.tr.delete(s.pos, s.pos + i.nodeSize).scrollIntoView()), !0) : !1;
}, Vy = (t, e, n) => {
  let { $head: r, empty: s } = t.selection, i = r;
  if (!s)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("forward", t) : r.parentOffset < r.parent.content.size)
      return !1;
    i = rc(r);
  }
  let o = i && i.nodeAfter;
  return !o || !Z.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(Z.create(t.doc, i.pos)).scrollIntoView()), !0);
};
function rc(t) {
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
const Wy = (t, e) => {
  let n = t.selection, r = n instanceof Z, s;
  if (r) {
    if (n.node.isTextblock || !In(t.doc, n.from))
      return !1;
    s = n.from;
  } else if (s = ko(t.doc, n.from, -1), s == null)
    return !1;
  if (e) {
    let i = t.tr.join(s);
    r && i.setSelection(Z.create(i.doc, s - t.doc.resolve(s).nodeBefore.nodeSize)), e(i.scrollIntoView());
  }
  return !0;
}, Ky = (t, e) => {
  let n = t.selection, r;
  if (n instanceof Z) {
    if (n.node.isTextblock || !In(t.doc, n.to))
      return !1;
    r = n.to;
  } else if (r = ko(t.doc, n.to, 1), r == null)
    return !1;
  return e && e(t.tr.join(r).scrollIntoView()), !0;
}, Uy = (t, e) => {
  let { $from: n, $to: r } = t.selection, s = n.blockRange(r), i = s && zr(s);
  return i == null ? !1 : (e && e(t.tr.lift(s, i).scrollIntoView()), !0);
}, qy = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (e && e(t.tr.insertText(`
`).scrollIntoView()), !0);
};
function qh(t) {
  for (let e = 0; e < t.edgeCount; e++) {
    let { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
const Gy = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  if (!n.parent.type.spec.code || !n.sameParent(r))
    return !1;
  let s = n.node(-1), i = n.indexAfter(-1), o = qh(s.contentMatchAt(i));
  if (!o || !s.canReplaceWith(i, i, o))
    return !1;
  if (e) {
    let l = n.after(), a = t.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(se.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, Jy = (t, e) => {
  let n = t.selection, { $from: r, $to: s } = n;
  if (n instanceof Pt || r.parent.inlineContent || s.parent.inlineContent)
    return !1;
  let i = qh(s.parent.contentMatchAt(s.indexAfter()));
  if (!i || !i.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && s.index() < s.parent.childCount ? r : s).pos, l = t.tr.insert(o, i.createAndFill());
    l.setSelection(te.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, Yy = (t, e) => {
  let { $cursor: n } = t.selection;
  if (!n || n.parent.content.size)
    return !1;
  if (n.depth > 1 && n.after() != n.end(-1)) {
    let i = n.before();
    if (Mr(t.doc, i))
      return e && e(t.tr.split(i).scrollIntoView()), !0;
  }
  let r = n.blockRange(), s = r && zr(r);
  return s == null ? !1 : (e && e(t.tr.lift(r, s).scrollIntoView()), !0);
}, Xy = (t, e) => {
  let { $from: n, to: r } = t.selection, s, i = n.sharedDepth(r);
  return i == 0 ? !1 : (s = n.before(i), e && e(t.tr.setSelection(Z.create(t.doc, s))), !0);
};
function Qy(t, e, n) {
  let r = e.nodeBefore, s = e.nodeAfter, i = e.index();
  return !r || !s || !r.type.compatibleContent(s.type) ? !1 : !r.content.size && e.parent.canReplace(i - 1, i) ? (n && n(t.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(i, i + 1) || !(s.isTextblock || In(t.doc, e.pos)) ? !1 : (n && n(t.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Gh(t, e, n) {
  let r = e.nodeBefore, s = e.nodeAfter, i, o;
  if (r.type.spec.isolating || s.type.spec.isolating)
    return !1;
  if (Qy(t, e, n))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (i = (o = r.contentMatchAt(r.childCount)).findWrapping(s.type)) && o.matchType(i[0] || s.type).validEnd) {
    if (n) {
      let f = e.pos + s.nodeSize, h = H.empty;
      for (let v = i.length - 1; v >= 0; v--)
        h = H.from(i[v].create(null, h));
      h = H.from(r.copy(h));
      let g = t.tr.step(new Ke(e.pos - 1, f, e.pos, f, new U(h, 1, 0), i.length, !0)), y = f + 2 * i.length;
      In(g.doc, y) && g.join(y), n(g.scrollIntoView());
    }
    return !0;
  }
  let a = se.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), u = c && zr(c);
  if (u != null && u >= e.depth)
    return n && n(t.tr.lift(c, u).scrollIntoView()), !0;
  if (l && Lr(s, "start", !0) && Lr(r, "end")) {
    let f = r, h = [];
    for (; h.push(f), !f.isTextblock; )
      f = f.lastChild;
    let g = s, y = 1;
    for (; !g.isTextblock; g = g.firstChild)
      y++;
    if (f.canReplace(f.childCount, f.childCount, g.content)) {
      if (n) {
        let v = H.empty;
        for (let E = h.length - 1; E >= 0; E--)
          v = H.from(h[E].copy(v));
        let k = t.tr.step(new Ke(e.pos - h.length, e.pos + s.nodeSize, e.pos + y, e.pos + s.nodeSize - y, new U(v, h.length, 0), 0, !0));
        n(k.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Jh(t) {
  return function(e, n) {
    let r = e.selection, s = t < 0 ? r.$from : r.$to, i = s.depth;
    for (; s.node(i).isInline; ) {
      if (!i)
        return !1;
      i--;
    }
    return s.node(i).isTextblock ? (n && n(e.tr.setSelection(te.create(e.doc, t < 0 ? s.start(i) : s.end(i)))), !0) : !1;
  };
}
const Zy = Jh(-1), e2 = Jh(1);
function t2(t, e = null) {
  return function(n, r) {
    let { $from: s, $to: i } = n.selection, o = s.blockRange(i), l = o && Ua(o, t, e);
    return l ? (r && r(n.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Ju(t, e = null) {
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
function n2(t, e = null) {
  return function(n, r) {
    let { $from: s, $to: i } = n.selection, o = s.blockRange(i), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && s.node(o.depth - 1).type.compatibleContent(t) && o.startIndex == 0) {
      if (s.index(o.depth - 1) == 0)
        return !1;
      let u = n.doc.resolve(o.start - 2);
      a = new Il(u, u, o.depth), o.endIndex < o.parent.childCount && (o = new Il(s, n.doc.resolve(i.end(o.depth)), o.depth)), l = !0;
    }
    let c = Ua(a, t, e, o);
    return c ? (r && r(r2(n.tr, o, c, l, t).scrollIntoView()), !0) : !1;
  };
}
function r2(t, e, n, r, s) {
  let i = H.empty;
  for (let u = n.length - 1; u >= 0; u--)
    i = H.from(n[u].type.create(n[u].attrs, i));
  t.step(new Ke(e.start - (r ? 2 : 0), e.end, e.start, e.end, new U(i, 0, 0), n.length, !0));
  let o = 0;
  for (let u = 0; u < n.length; u++)
    n[u].type == s && (o = u + 1);
  let l = n.length - o, a = e.start + n.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, f = e.endIndex, h = !0; u < f; u++, h = !1)
    !h && Mr(t.doc, a, l) && (t.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return t;
}
function s2(t) {
  return function(e, n) {
    let { $from: r, $to: s } = e.selection, i = r.blockRange(s, (o) => o.childCount > 0 && o.firstChild.type == t);
    return i ? n ? r.node(i.depth - 1).type == t ? i2(e, n, t, i) : o2(e, n, i) : !0 : !1;
  };
}
function i2(t, e, n, r) {
  let s = t.tr, i = r.end, o = r.$to.end(r.depth);
  i < o && (s.step(new Ke(i - 1, o, i, o, new U(H.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Il(s.doc.resolve(r.$from.pos), s.doc.resolve(o), r.depth));
  const l = zr(r);
  if (l == null)
    return !1;
  s.lift(r, l);
  let a = s.mapping.map(i, -1) - 1;
  return In(s.doc, a) && s.join(a), e(s.scrollIntoView()), !0;
}
function o2(t, e, n) {
  let r = t.tr, s = n.parent;
  for (let g = n.end, y = n.endIndex - 1, v = n.startIndex; y > v; y--)
    g -= s.child(y).nodeSize, r.delete(g - 1, g + 1);
  let i = r.doc.resolve(n.start), o = i.nodeAfter;
  if (r.mapping.map(n.end) != n.start + i.nodeAfter.nodeSize)
    return !1;
  let l = n.startIndex == 0, a = n.endIndex == s.childCount, c = i.node(-1), u = i.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, o.content.append(a ? H.empty : H.from(s))))
    return !1;
  let f = i.pos, h = f + o.nodeSize;
  return r.step(new Ke(f - (l ? 1 : 0), h + (a ? 1 : 0), f + 1, h - 1, new U((l ? H.empty : H.from(s.copy(H.empty))).append(a ? H.empty : H.from(s.copy(H.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function l2(t) {
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
      let c = a.lastChild && a.lastChild.type == l.type, u = H.from(c ? t.create() : null), f = new U(H.from(t.create(null, H.from(l.type.create(null, u)))), c ? 3 : 1, 0), h = i.start, g = i.end;
      n(e.tr.step(new Ke(h - (c ? 3 : 1), g, h, g, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Yh(t) {
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
class a2 {
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
      ...Object.fromEntries(Object.entries(r).map(([h, g]) => [h, (...v) => {
        const k = this.buildProps(c, n), E = g(...v)(k);
        return l.push(E), f;
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
      state: Yh({
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
function Ie(t, e, n) {
  return t.config[e] === void 0 && t.parent ? Ie(t.parent, e, n) : typeof t.config[e] == "function" ? t.config[e].bind({
    ...n,
    parent: t.parent ? Ie(t.parent, e, n) : null
  }) : t.config[e];
}
function c2(t) {
  const e = t.filter((s) => s.type === "extension"), n = t.filter((s) => s.type === "node"), r = t.filter((s) => s.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: n,
    markExtensions: r
  };
}
function Ye(t, e) {
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
function u2(t) {
  return typeof t == "function";
}
function Se(t, e = void 0, ...n) {
  return u2(t) ? e ? t.bind(e)(...n) : t(...n) : t;
}
function d2(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}
class Es {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
class f2 {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
function h2(t) {
  return Object.prototype.toString.call(t).slice(8, -1);
}
function tl(t) {
  return h2(t) !== "Object" ? !1 : t.constructor === Object && Object.getPrototypeOf(t) === Object.prototype;
}
function Ao(t, e) {
  const n = { ...t };
  return tl(t) && tl(e) && Object.keys(e).forEach((r) => {
    tl(e[r]) ? r in t ? n[r] = Ao(t[r], e[r]) : Object.assign(n, { [r]: e[r] }) : Object.assign(n, { [r]: e[r] });
  }), n;
}
class Xe {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Se(Ie(this, "addOptions", {
      name: this.name
    }))), this.storage = Se(Ie(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Xe(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = Ao(this.options, e), n.storage = Se(Ie(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Xe({ ...this.config, ...e });
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Ie(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Ie(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function p2(t, e, n) {
  const { from: r, to: s } = e, { blockSeparator: i = `

`, textSerializers: o = {} } = n || {};
  let l = "", a = !0;
  return t.nodesBetween(r, s, (c, u, f, h) => {
    var g;
    const y = o?.[c.type.name];
    y ? (c.isBlock && !a && (l += i, a = !0), f && (l += y({
      node: c,
      pos: u,
      parent: f,
      index: h,
      range: e
    }))) : c.isText ? (l += (g = c?.text) === null || g === void 0 ? void 0 : g.slice(Math.max(r, u) - u, s - u), a = !1) : c.isBlock && !a && (l += i, a = !0);
  }), l;
}
function m2(t) {
  return Object.fromEntries(Object.entries(t.nodes).filter(([, e]) => e.spec.toText).map(([e, n]) => [e, n.spec.toText]));
}
Xe.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new Qe({
        key: new Ze("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: t } = this, { state: e, schema: n } = t, { doc: r, selection: s } = e, { ranges: i } = s, o = Math.min(...i.map((u) => u.$from.pos)), l = Math.max(...i.map((u) => u.$to.pos)), a = m2(n);
            return p2(r, { from: o, to: l }, {
              textSerializers: a
            });
          }
        }
      })
    ];
  }
});
const g2 = () => ({ editor: t, view: e }) => (requestAnimationFrame(() => {
  var n;
  t.isDestroyed || (e.dom.blur(), (n = window?.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), y2 = (t = !1) => ({ commands: e }) => e.setContent("", t), b2 = () => ({ state: t, tr: e, dispatch: n }) => {
  const { selection: r } = e, { ranges: s } = r;
  return n && s.forEach(({ $from: i, $to: o }) => {
    t.doc.nodesBetween(i.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, f = c.resolve(u.map(a)), h = c.resolve(u.map(a + l.nodeSize)), g = f.blockRange(h);
      if (!g)
        return;
      const y = zr(g);
      if (l.type.isTextblock) {
        const { defaultType: v } = f.parent.contentMatchAt(f.index());
        e.setNodeMarkup(g.start, v);
      }
      (y || y === 0) && e.lift(g, y);
    });
  }), !0;
}, v2 = (t) => (e) => t(e), w2 = () => ({ state: t, dispatch: e }) => Jy(t, e), x2 = (t, e) => ({ editor: n, tr: r }) => {
  const { state: s } = n, i = s.doc.slice(t.from, t.to);
  r.deleteRange(t.from, t.to);
  const o = r.mapping.map(e);
  return r.insert(o, i.content), r.setSelection(new te(r.doc.resolve(o - 1))), !0;
}, _2 = () => ({ tr: t, dispatch: e }) => {
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
}, k2 = (t) => ({ tr: e, state: n, dispatch: r }) => {
  const s = Ye(t, n.schema), i = e.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === s) {
      if (r) {
        const a = i.before(o), c = i.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, S2 = (t) => ({ tr: e, dispatch: n }) => {
  const { from: r, to: s } = t;
  return n && e.delete(r, s), !0;
}, C2 = () => ({ state: t, dispatch: e }) => zy(t, e), E2 = () => ({ commands: t }) => t.keyboardShortcut("Enter"), M2 = () => ({ state: t, dispatch: e }) => Gy(t, e);
function Ei(t, e, n = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((s) => n.strict ? e[s] === t[s] : d2(e[s]) ? e[s].test(t[s]) : e[s] === t[s]) : !0;
}
function Ul(t, e, n = {}) {
  return t.find((r) => r.type === e && Ei(r.attrs, n));
}
function A2(t, e, n = {}) {
  return !!Ul(t, e, n);
}
function sc(t, e, n = {}) {
  if (!t || !e)
    return;
  let r = t.parent.childAfter(t.parentOffset);
  if (t.parentOffset === r.offset && r.offset !== 0 && (r = t.parent.childBefore(t.parentOffset)), !r.node)
    return;
  const s = Ul([...r.node.marks], e, n);
  if (!s)
    return;
  let i = r.index, o = t.start() + r.offset, l = i + 1, a = o + r.node.nodeSize;
  for (Ul([...r.node.marks], e, n); i > 0 && s.isInSet(t.parent.child(i - 1).marks); )
    i -= 1, o -= t.parent.child(i).nodeSize;
  for (; l < t.parent.childCount && A2([...t.parent.child(l).marks], e, n); )
    a += t.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function zn(t, e) {
  if (typeof t == "string") {
    if (!e.marks[t])
      throw Error(`There is no mark type named '${t}'. Maybe you forgot to add the extension?`);
    return e.marks[t];
  }
  return t;
}
const T2 = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  const i = zn(t, r.schema), { doc: o, selection: l } = n, { $from: a, from: c, to: u } = l;
  if (s) {
    const f = sc(a, i, e);
    if (f && f.from <= c && f.to >= u) {
      const h = te.create(o, f.from, f.to);
      n.setSelection(h);
    }
  }
  return !0;
}, j2 = (t) => (e) => {
  const n = typeof t == "function" ? t(e) : t;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](e))
      return !0;
  return !1;
};
function Xh(t) {
  return t instanceof te;
}
function Yn(t = 0, e = 0, n = 0) {
  return Math.min(Math.max(t, e), n);
}
function O2(t, e = null) {
  if (!e)
    return null;
  const n = se.atStart(t), r = se.atEnd(t);
  if (e === "start" || e === !0)
    return n;
  if (e === "end")
    return r;
  const s = n.from, i = r.to;
  return e === "all" ? te.create(t, Yn(0, s, i), Yn(t.content.size, s, i)) : te.create(t, Yn(e, s, i), Yn(e, s, i));
}
function ic() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const R2 = (t = null, e = {}) => ({ editor: n, view: r, tr: s, dispatch: i }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    ic() && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), e?.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && t === null || t === !1)
    return !0;
  if (i && t === null && !Xh(n.state.selection))
    return o(), !0;
  const l = O2(s.doc, t) || n.state.selection, a = n.state.selection.eq(l);
  return i && (a || s.setSelection(l), a && s.storedMarks && s.setStoredMarks(s.storedMarks), o()), !0;
}, L2 = (t, e) => (n) => t.every((r, s) => e(r, { ...n, index: s })), P2 = (t, e) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, t, e), Qh = (t) => {
  const e = t.childNodes;
  for (let n = e.length - 1; n >= 0; n -= 1) {
    const r = e[n];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? t.removeChild(r) : r.nodeType === 1 && Qh(r);
  }
  return t;
};
function Yu(t) {
  const e = `<body>${t}</body>`, n = new window.DOMParser().parseFromString(e, "text/html").body;
  return Qh(n);
}
function Mi(t, e, n) {
  if (n = {
    slice: !0,
    parseOptions: {},
    ...n
  }, typeof t == "object" && t !== null)
    try {
      return Array.isArray(t) && t.length > 0 ? H.fromArray(t.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(t);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", t, "Error:", r), Mi("", e, n);
    }
  if (typeof t == "string") {
    const r = nh.fromSchema(e);
    return n.slice ? r.parseSlice(Yu(t), n.parseOptions).content : r.parse(Yu(t), n.parseOptions);
  }
  return Mi("", e, n);
}
function I2(t, e, n) {
  const r = t.steps.length - 1;
  if (r < e)
    return;
  const s = t.steps[r];
  if (!(s instanceof Ve || s instanceof Ke))
    return;
  const i = t.mapping.maps[r];
  let o = 0;
  i.forEach((l, a, c, u) => {
    o === 0 && (o = u);
  }), t.setSelection(se.near(t.doc.resolve(o), n));
}
const N2 = (t) => t.toString().startsWith("<"), z2 = (t, e, n) => ({ tr: r, dispatch: s, editor: i }) => {
  if (s) {
    n = {
      parseOptions: {},
      updateSelection: !0,
      ...n
    };
    const o = Mi(e, i.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...n.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof t == "number" ? { from: t, to: t } : { from: t.from, to: t.to }, c = !0, u = !0;
    if ((N2(o) ? o : [o]).forEach((h) => {
      h.check(), c = c ? h.isText && h.marks.length === 0 : !1, u = u ? h.isBlock : !1;
    }), l === a && u) {
      const { parent: h } = r.doc.resolve(l);
      h.isTextblock && !h.type.spec.code && !h.childCount && (l -= 1, a += 1);
    }
    c ? Array.isArray(e) ? r.insertText(e.map((h) => h.text || "").join(""), l, a) : typeof e == "object" && e && e.text ? r.insertText(e.text, l, a) : r.insertText(e, l, a) : r.replaceWith(l, a, o), n.updateSelection && I2(r, r.steps.length - 1, -1);
  }
  return !0;
}, $2 = () => ({ state: t, dispatch: e }) => Wy(t, e), D2 = () => ({ state: t, dispatch: e }) => Ky(t, e), B2 = () => ({ state: t, dispatch: e }) => $y(t, e), H2 = () => ({ state: t, dispatch: e }) => Fy(t, e), F2 = () => ({ tr: t, state: e, dispatch: n }) => {
  try {
    const r = ko(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), n && n(t), !0);
  } catch {
    return !1;
  }
}, V2 = () => ({ state: t, dispatch: e, tr: n }) => {
  try {
    const r = ko(t.doc, t.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), e && e(n), !0);
  } catch {
    return !1;
  }
}, W2 = () => ({ state: t, dispatch: e }) => Dy(t, e), K2 = () => ({ state: t, dispatch: e }) => By(t, e);
function oc() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function U2(t) {
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
      ic() || oc() ? o = !0 : s = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (n = `Alt-${n}`), s && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), i && (n = `Shift-${n}`), n;
}
const q2 = (t) => ({ editor: e, view: n, tr: r, dispatch: s }) => {
  const i = U2(t).split(/-(?!$)/), o = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
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
function lc(t, e, n = {}) {
  const { from: r, to: s, empty: i } = t.selection, o = e ? Ye(e, t.schema) : null, l = [];
  t.doc.nodesBetween(r, s, (f, h) => {
    if (f.isText)
      return;
    const g = Math.max(r, h), y = Math.min(s, h + f.nodeSize);
    l.push({
      node: f,
      from: g,
      to: y
    });
  });
  const a = s - r, c = l.filter((f) => o ? o.name === f.node.type.name : !0).filter((f) => Ei(f.node.attrs, n, { strict: !1 }));
  return i ? !!c.length : c.reduce((f, h) => f + h.to - h.from, 0) >= a;
}
const G2 = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const s = Ye(t, n.schema);
  return lc(n, s, e) ? Uy(n, r) : !1;
}, J2 = () => ({ state: t, dispatch: e }) => Yy(t, e), Y2 = (t) => ({ state: e, dispatch: n }) => {
  const r = Ye(t, e.schema);
  return s2(r)(e, n);
}, X2 = () => ({ state: t, dispatch: e }) => qy(t, e);
function ac(t, e) {
  return e.nodes[t] ? "node" : e.marks[t] ? "mark" : null;
}
function Xu(t, e) {
  const n = typeof e == "string" ? [e] : e;
  return Object.keys(t).reduce((r, s) => (n.includes(s) || (r[s] = t[s]), r), {});
}
const Q2 = (t, e) => ({ tr: n, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = ac(typeof t == "string" ? t : t.name, r.schema);
  return l ? (l === "node" && (i = Ye(t, r.schema)), l === "mark" && (o = zn(t, r.schema)), s && n.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, u) => {
      i && i === c.type && n.setNodeMarkup(u, void 0, Xu(c.attrs, e)), o && c.marks.length && c.marks.forEach((f) => {
        o === f.type && n.addMark(u, u + c.nodeSize, o.create(Xu(f.attrs, e)));
      });
    });
  }), !0) : !1;
}, Z2 = () => ({ tr: t, dispatch: e }) => (e && t.scrollIntoView(), !0), eb = () => ({ tr: t, commands: e }) => e.setTextSelection({
  from: 0,
  to: t.doc.content.size
}), tb = () => ({ state: t, dispatch: e }) => Hy(t, e), nb = () => ({ state: t, dispatch: e }) => Vy(t, e), rb = () => ({ state: t, dispatch: e }) => Xy(t, e), sb = () => ({ state: t, dispatch: e }) => e2(t, e), ib = () => ({ state: t, dispatch: e }) => Zy(t, e);
function ob(t, e, n = {}) {
  return Mi(t, e, { slice: !1, parseOptions: n });
}
const lb = (t, e = !1, n = {}) => ({ tr: r, editor: s, dispatch: i }) => {
  const { doc: o } = r, l = ob(t, s.schema, n);
  return i && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function Ms(t, e) {
  const n = zn(e, t.schema), { from: r, to: s, empty: i } = t.selection, o = [];
  i ? (t.storedMarks && o.push(...t.storedMarks), o.push(...t.selection.$head.marks())) : t.doc.nodesBetween(r, s, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === n.name);
  return l ? { ...l.attrs } : {};
}
function ab(t, e) {
  const n = new gh(t);
  return e.forEach((r) => {
    r.steps.forEach((s) => {
      n.step(s);
    });
  }), n;
}
function cb(t) {
  for (let e = 0; e < t.edgeCount; e += 1) {
    const { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
function ub(t, e, n) {
  const r = [];
  return t.nodesBetween(e.from, e.to, (s, i) => {
    n(s) && r.push({
      node: s,
      pos: i
    });
  }), r;
}
function Zh(t, e) {
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
function cc(t) {
  return (e) => Zh(e.$from, t);
}
function db(t, e) {
  const n = Ye(e, t.schema), { from: r, to: s } = t.selection, i = [];
  t.doc.nodesBetween(r, s, (l) => {
    i.push(l);
  });
  const o = i.reverse().find((l) => l.type.name === n.name);
  return o ? { ...o.attrs } : {};
}
function fb(t, e) {
  const n = ac(typeof e == "string" ? e : e.name, t.schema);
  return n === "node" ? db(t, e) : n === "mark" ? Ms(t, e) : {};
}
function hb(t, e = JSON.stringify) {
  const n = {};
  return t.filter((r) => {
    const s = e(r);
    return Object.prototype.hasOwnProperty.call(n, s) ? !1 : n[s] = !0;
  });
}
function pb(t) {
  const e = hb(t);
  return e.length === 1 ? e : e.filter((n, r) => !e.filter((i, o) => o !== r).some((i) => n.oldRange.from >= i.oldRange.from && n.oldRange.to <= i.oldRange.to && n.newRange.from >= i.newRange.from && n.newRange.to <= i.newRange.to));
}
function mb(t) {
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
  }), pb(r);
}
function uc(t, e, n) {
  const r = [];
  return t === e ? n.resolve(t).marks().forEach((s) => {
    const i = n.resolve(t - 1), o = sc(i, s.type);
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
function ri(t, e, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const s = t.find((i) => i.type === e && i.name === r);
    return s ? s.attribute.keepOnSplit : !1;
  }));
}
function gb(t, e, n = {}) {
  const { empty: r, ranges: s } = t.selection, i = e ? zn(e, t.schema) : null;
  if (r)
    return !!(t.storedMarks || t.selection.$from.marks()).filter((f) => i ? i.name === f.type.name : !0).find((f) => Ei(f.attrs, n, { strict: !1 }));
  let o = 0;
  const l = [];
  if (s.forEach(({ $from: f, $to: h }) => {
    const g = f.pos, y = h.pos;
    t.doc.nodesBetween(g, y, (v, k) => {
      if (!v.isText && !v.marks.length)
        return;
      const E = Math.max(g, k), T = Math.min(y, k + v.nodeSize), j = T - E;
      o += j, l.push(...v.marks.map((d) => ({
        mark: d,
        from: E,
        to: T
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((f) => i ? i.name === f.mark.type.name : !0).filter((f) => Ei(f.mark.attrs, n, { strict: !1 })).reduce((f, h) => f + h.to - h.from, 0), c = l.filter((f) => i ? f.mark.type !== i && f.mark.type.excludes(i) : !0).reduce((f, h) => f + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function Qu(t, e) {
  const { nodeExtensions: n } = c2(e), r = n.find((o) => o.name === t);
  if (!r)
    return !1;
  const s = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, i = Se(Ie(r, "group", s));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function yb(t, e, n) {
  var r;
  const { selection: s } = e;
  let i = null;
  if (Xh(s) && (i = s.$cursor), i) {
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
        const g = !h || h.type.allowsMarkType(n), y = !!n.isInSet(u.marks) || !u.marks.some((v) => v.type.excludes(n));
        c = g && y;
      }
      return !c;
    }), c;
  });
}
const bb = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  const { selection: i } = n, { empty: o, ranges: l } = i, a = zn(t, r.schema);
  if (s)
    if (o) {
      const c = Ms(r, a);
      n.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const u = c.$from.pos, f = c.$to.pos;
        r.doc.nodesBetween(u, f, (h, g) => {
          const y = Math.max(g, u), v = Math.min(g + h.nodeSize, f);
          h.marks.find((E) => E.type === a) ? h.marks.forEach((E) => {
            a === E.type && n.addMark(y, v, a.create({
              ...E.attrs,
              ...e
            }));
          }) : n.addMark(y, v, a.create(e));
        });
      });
  return yb(r, n, a);
}, vb = (t, e) => ({ tr: n }) => (n.setMeta(t, e), !0), wb = (t, e = {}) => ({ state: n, dispatch: r, chain: s }) => {
  const i = Ye(t, n.schema);
  return i.isTextblock ? s().command(({ commands: o }) => Ju(i, e)(n) ? !0 : o.clearNodes()).command(({ state: o }) => Ju(i, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, xb = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, s = Yn(t, 0, r.content.size), i = Z.create(r, s);
    e.setSelection(i);
  }
  return !0;
}, _b = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, { from: s, to: i } = typeof t == "number" ? { from: t, to: t } : t, o = te.atStart(r).from, l = te.atEnd(r).to, a = Yn(s, o, l), c = Yn(i, o, l), u = te.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, kb = (t) => ({ state: e, dispatch: n }) => {
  const r = Ye(t, e.schema);
  return l2(r)(e, n);
};
function Zu(t, e) {
  const n = t.storedMarks || t.selection.$to.parentOffset && t.selection.$from.marks();
  if (n) {
    const r = n.filter((s) => e?.includes(s.type.name));
    t.tr.ensureMarks(r);
  }
}
const Sb = ({ keepMarks: t = !0 } = {}) => ({ tr: e, state: n, dispatch: r, editor: s }) => {
  const { selection: i, doc: o } = e, { $from: l, $to: a } = i, c = s.extensionManager.attributes, u = ri(c, l.node().type.name, l.node().attrs);
  if (i instanceof Z && i.node.isBlock)
    return !l.parentOffset || !Mr(o, l.pos) ? !1 : (r && (t && Zu(n, s.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const f = a.parentOffset === a.parent.content.size;
    i instanceof te && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : cb(l.node(-1).contentMatchAt(l.indexAfter(-1)));
    let g = f && h ? [
      {
        type: h,
        attrs: u
      }
    ] : void 0, y = Mr(e.doc, e.mapping.map(l.pos), 1, g);
    if (!g && !y && Mr(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (y = !0, g = h ? [
      {
        type: h,
        attrs: u
      }
    ] : void 0), y && (e.split(e.mapping.map(l.pos), 1, g), h && !f && !l.parentOffset && l.parent.type !== h)) {
      const v = e.mapping.map(l.before()), k = e.doc.resolve(v);
      l.node(-1).canReplaceWith(k.index(), k.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    t && Zu(n, s.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, Cb = (t) => ({ tr: e, state: n, dispatch: r, editor: s }) => {
  var i;
  const o = Ye(t, n.schema), { $from: l, $to: a } = n.selection, c = n.selection.node;
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
      let k = H.empty;
      const E = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let b = l.depth - E; b >= l.depth - 3; b -= 1)
        k = H.from(l.node(b).copy(k));
      const T = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, j = ri(f, l.node().type.name, l.node().attrs), d = ((i = o.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(j)) || void 0;
      k = k.append(H.from(o.createAndFill(null, d) || void 0));
      const m = l.before(l.depth - (E - 1));
      e.replace(m, l.after(-T), new U(k, 4 - E, 0));
      let p = -1;
      e.doc.nodesBetween(m, e.doc.content.size, (b, w) => {
        if (p > -1)
          return !1;
        b.isTextblock && b.content.size === 0 && (p = w + 1);
      }), p > -1 && e.setSelection(te.near(e.doc.resolve(p))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? u.contentMatchAt(0).defaultType : null, g = ri(f, u.type.name, u.attrs), y = ri(f, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const v = h ? [
    { type: o, attrs: g },
    { type: h, attrs: y }
  ] : [{ type: o, attrs: g }];
  if (!Mr(e.doc, l.pos, 2))
    return !1;
  if (r) {
    const { selection: k, storedMarks: E } = n, { splittableMarks: T } = s.extensionManager, j = E || k.$to.parentOffset && k.$from.marks();
    if (e.split(l.pos, 2, v).scrollIntoView(), !j || !r)
      return !0;
    const d = j.filter((m) => T.includes(m.type.name));
    e.ensureMarks(d);
  }
  return !0;
}, nl = (t, e) => {
  const n = cc((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const s = t.doc.nodeAt(r);
  return n.node.type === s?.type && In(t.doc, n.pos) && t.join(n.pos), !0;
}, rl = (t, e) => {
  const n = cc((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const s = t.doc.nodeAt(r);
  return n.node.type === s?.type && In(t.doc, r) && t.join(r), !0;
}, Eb = (t, e, n, r = {}) => ({ editor: s, tr: i, state: o, dispatch: l, chain: a, commands: c, can: u }) => {
  const { extensions: f, splittableMarks: h } = s.extensionManager, g = Ye(t, o.schema), y = Ye(e, o.schema), { selection: v, storedMarks: k } = o, { $from: E, $to: T } = v, j = E.blockRange(T), d = k || v.$to.parentOffset && v.$from.marks();
  if (!j)
    return !1;
  const m = cc((p) => Qu(p.type.name, f))(v);
  if (j.depth >= 1 && m && j.depth - m.depth <= 1) {
    if (m.node.type === g)
      return c.liftListItem(y);
    if (Qu(m.node.type.name, f) && g.validContent(m.node.content) && l)
      return a().command(() => (i.setNodeMarkup(m.pos, g), !0)).command(() => nl(i, g)).command(() => rl(i, g)).run();
  }
  return !n || !d || !l ? a().command(() => u().wrapInList(g, r) ? !0 : c.clearNodes()).wrapInList(g, r).command(() => nl(i, g)).command(() => rl(i, g)).run() : a().command(() => {
    const p = u().wrapInList(g, r), b = d.filter((w) => h.includes(w.type.name));
    return i.ensureMarks(b), p ? !0 : c.clearNodes();
  }).wrapInList(g, r).command(() => nl(i, g)).command(() => rl(i, g)).run();
}, Mb = (t, e = {}, n = {}) => ({ state: r, commands: s }) => {
  const { extendEmptyMarkRange: i = !1 } = n, o = zn(t, r.schema);
  return gb(r, o, e) ? s.unsetMark(o, { extendEmptyMarkRange: i }) : s.setMark(o, e);
}, Ab = (t, e, n = {}) => ({ state: r, commands: s }) => {
  const i = Ye(t, r.schema), o = Ye(e, r.schema);
  return lc(r, i, n) ? s.setNode(o) : s.setNode(i, n);
}, Tb = (t, e = {}) => ({ state: n, commands: r }) => {
  const s = Ye(t, n.schema);
  return lc(n, s, e) ? r.lift(s) : r.wrapIn(s, e);
}, jb = () => ({ state: t, dispatch: e }) => {
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
}, Ob = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, { empty: r, ranges: s } = n;
  return r || e && s.forEach((i) => {
    t.removeMark(i.$from.pos, i.$to.pos);
  }), !0;
}, Rb = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  var i;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = n, a = zn(t, r.schema), { $from: c, empty: u, ranges: f } = l;
  if (!s)
    return !0;
  if (u && o) {
    let { from: h, to: g } = l;
    const y = (i = c.marks().find((k) => k.type === a)) === null || i === void 0 ? void 0 : i.attrs, v = sc(c, a, y);
    v && (h = v.from, g = v.to), n.removeMark(h, g, a);
  } else
    f.forEach((h) => {
      n.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return n.removeStoredMark(a), !0;
}, Lb = (t, e = {}) => ({ tr: n, state: r, dispatch: s }) => {
  let i = null, o = null;
  const l = ac(typeof t == "string" ? t : t.name, r.schema);
  return l ? (l === "node" && (i = Ye(t, r.schema)), l === "mark" && (o = zn(t, r.schema)), s && n.selection.ranges.forEach((a) => {
    const c = a.$from.pos, u = a.$to.pos;
    r.doc.nodesBetween(c, u, (f, h) => {
      i && i === f.type && n.setNodeMarkup(h, void 0, {
        ...f.attrs,
        ...e
      }), o && f.marks.length && f.marks.forEach((g) => {
        if (o === g.type) {
          const y = Math.max(h, c), v = Math.min(h + f.nodeSize, u);
          n.addMark(y, v, o.create({
            ...g.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, Pb = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const s = Ye(t, n.schema);
  return t2(s, e)(n, r);
}, Ib = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const s = Ye(t, n.schema);
  return n2(s, e)(n, r);
};
var Nb = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: g2,
  clearContent: y2,
  clearNodes: b2,
  command: v2,
  createParagraphNear: w2,
  cut: x2,
  deleteCurrentNode: _2,
  deleteNode: k2,
  deleteRange: S2,
  deleteSelection: C2,
  enter: E2,
  exitCode: M2,
  extendMarkRange: T2,
  first: j2,
  focus: R2,
  forEach: L2,
  insertContent: P2,
  insertContentAt: z2,
  joinUp: $2,
  joinDown: D2,
  joinBackward: B2,
  joinForward: H2,
  joinItemBackward: F2,
  joinItemForward: V2,
  joinTextblockBackward: W2,
  joinTextblockForward: K2,
  keyboardShortcut: q2,
  lift: G2,
  liftEmptyBlock: J2,
  liftListItem: Y2,
  newlineInCode: X2,
  resetAttributes: Q2,
  scrollIntoView: Z2,
  selectAll: eb,
  selectNodeBackward: tb,
  selectNodeForward: nb,
  selectParentNode: rb,
  selectTextblockEnd: sb,
  selectTextblockStart: ib,
  setContent: lb,
  setMark: bb,
  setMeta: vb,
  setNode: wb,
  setNodeSelection: xb,
  setTextSelection: _b,
  sinkListItem: kb,
  splitBlock: Sb,
  splitListItem: Cb,
  toggleList: Eb,
  toggleMark: Mb,
  toggleNode: Ab,
  toggleWrap: Tb,
  undoInputRule: jb,
  unsetAllMarks: Ob,
  unsetMark: Rb,
  updateAttributes: Lb,
  wrapIn: Pb,
  wrapInList: Ib
});
Xe.create({
  name: "commands",
  addCommands() {
    return {
      ...Nb
    };
  }
});
Xe.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Qe({
        key: new Ze("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
Xe.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: t } = this;
    return [
      new Qe({
        key: new Ze("focusEvents"),
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
Xe.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const t = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: f } = a, { pos: h, parent: g } = f, y = f.parent.isTextblock ? l.doc.resolve(h - 1) : f, v = y.parent.type.spec.isolating, k = f.pos - f.parentOffset, E = v && y.parent.childCount === 1 ? k === f.pos : se.atStart(c).from === h;
        return !u || !E || !g.type.isTextblock || g.textContent.length ? !1 : o.clearNodes();
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
    return ic() || oc() ? i : s;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new Qe({
        key: new Ze("clearDocument"),
        appendTransaction: (t, e, n) => {
          if (!(t.some((y) => y.docChanged) && !e.doc.eq(n.doc)))
            return;
          const { empty: s, from: i, to: o } = e.selection, l = se.atStart(e.doc).from, a = se.atEnd(e.doc).to;
          if (s || !(i === l && o === a) || !(n.doc.textBetween(0, n.doc.content.size, " ", " ").length === 0))
            return;
          const f = n.tr, h = Yh({
            state: n,
            transaction: f
          }), { commands: g } = new a2({
            editor: this.editor,
            state: h
          });
          if (g.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
});
Xe.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Qe({
        key: new Ze("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
function rr(t) {
  return new Es({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const s = Se(t.getAttributes, void 0, r);
      if (s === !1 || s === null)
        return null;
      const { tr: i } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = n.from + l.indexOf(o), u = c + o.length;
        if (uc(n.from, n.to, e.doc).filter((g) => g.mark.type.excluded.find((v) => v === t.type && v !== g.mark.type)).filter((g) => g.to > c).length)
          return null;
        u < n.to && i.delete(u, n.to), c > n.from && i.delete(n.from + a, c);
        const h = n.from + a + o.length;
        i.addMark(n.from + a, h, t.type.create(s || {})), i.removeStoredMark(t.type);
      }
    }
  });
}
function ep(t) {
  return new Es({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const s = Se(t.getAttributes, void 0, r) || {}, { tr: i } = e, o = n.from;
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
function ql(t) {
  return new Es({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const s = e.doc.resolve(n.from), i = Se(t.getAttributes, void 0, r) || {};
      if (!s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), t.type))
        return null;
      e.tr.delete(n.from, n.to).setBlockType(n.from, n.from, t.type, i);
    }
  });
}
function Re(t) {
  return new Es({
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
function bs(t) {
  return new Es({
    find: t.find,
    handler: ({ state: e, range: n, match: r, chain: s }) => {
      const i = Se(t.getAttributes, void 0, r) || {}, o = e.tr.delete(n.from, n.to), a = o.doc.resolve(n.from).blockRange(), c = a && Ua(a, t.type, i);
      if (!c)
        return null;
      if (o.wrap(a, c), t.keepMarks && t.editor) {
        const { selection: f, storedMarks: h } = e, { splittableMarks: g } = t.editor.extensionManager, y = h || f.$to.parentOffset && f.$from.marks();
        if (y) {
          const v = y.filter((k) => g.includes(k.type.name));
          o.ensureMarks(v);
        }
      }
      if (t.keepAttributes) {
        const f = t.type.name === "bulletList" || t.type.name === "orderedList" ? "listItem" : "taskList";
        s().updateAttributes(f, i).run();
      }
      const u = o.doc.resolve(n.from - 1).nodeBefore;
      u && u.type === t.type && In(o.doc, n.from - 1) && (!t.joinPredicate || t.joinPredicate(r, u)) && o.join(n.from - 1);
    }
  });
}
class Tt {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Se(Ie(this, "addOptions", {
      name: this.name
    }))), this.storage = Se(Ie(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Tt(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = Ao(this.options, e), n.storage = Se(Ie(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Tt({ ...this.config, ...e });
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Ie(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Ie(n, "addStorage", {
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
class Ee {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && Object.keys(e.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Se(Ie(this, "addOptions", {
      name: this.name
    }))), this.storage = Se(Ie(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ee(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = Ao(this.options, e), n.storage = Se(Ie(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Ee({ ...this.config, ...e });
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Ie(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Ie(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function Rn(t) {
  return new f2({
    find: t.find,
    handler: ({ state: e, range: n, match: r, pasteEvent: s }) => {
      const i = Se(t.getAttributes, void 0, r, s);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = n.to;
      if (l) {
        const u = a.search(/\S/), f = n.from + a.indexOf(l), h = f + l.length;
        if (uc(n.from, n.to, e.doc).filter((y) => y.mark.type.excluded.find((k) => k === t.type && k !== y.mark.type)).filter((y) => y.to > f).length)
          return null;
        h < n.to && o.delete(h, n.to), f > n.from && o.delete(n.from + u, f), c = n.from + u + l.length, o.addMark(n.from + u, c, t.type.create(i || {})), o.removeStoredMark(t.type);
      }
    }
  });
}
function zb(t) {
  return t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
const $b = /^\s*>\s$/, Db = Ee.create({
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
      bs({
        find: $b,
        type: this.type
      })
    ];
  }
}), Bb = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/, Hb = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g, Fb = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/, Vb = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g, Wb = Tt.create({
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
      rr({
        find: Bb,
        type: this.type
      }),
      rr({
        find: Fb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Rn({
        find: Hb,
        type: this.type
      }),
      Rn({
        find: Vb,
        type: this.type
      })
    ];
  }
}), Kb = Ee.create({
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
}), ed = Tt.create({
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
        const n = Ms(t, this.type);
        return Object.entries(n).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), td = /^\s*([-+*])\s$/, Ub = Ee.create({
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
      toggleBulletList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Kb.name, this.editor.getAttributes(ed.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let t = bs({
      find: td,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = bs({
      find: td,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(ed.name),
      editor: this.editor
    })), [
      t
    ];
  }
}), qb = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/, Gb = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g, Jb = Tt.create({
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
      rr({
        find: qb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Rn({
        find: Gb,
        type: this.type
      })
    ];
  }
}), Yb = /^```([a-z]+)?[\s\n]$/, Xb = /^~~~([a-z]+)?[\s\n]$/, Qb = Ee.create({
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
      ql({
        find: Yb,
        type: this.type,
        getAttributes: (t) => ({
          language: t[1]
        })
      }),
      ql({
        find: Xb,
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
      new Qe({
        key: new Ze("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (t, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const n = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), s = r ? JSON.parse(r) : void 0, i = s?.mode;
            if (!n || !i)
              return !1;
            const { tr: o } = t.state;
            return o.replaceSelectionWith(this.type.create({ language: i })), o.setSelection(te.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(n.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), t.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), Zb = Ee.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function ev(t = {}) {
  return new Qe({
    view(e) {
      return new tv(e, t);
    }
  });
}
class tv {
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
        let l = dh(this.editorView.state.doc, o, this.editorView.dragging.slice);
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
const nv = Xe.create({
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
      ev(this.options)
    ];
  }
});
class je extends se {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    return je.valid(r) ? new je(r) : se.near(r);
  }
  content() {
    return U.empty;
  }
  eq(e) {
    return e instanceof je && e.head == this.head;
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
    return new je(e.resolve(n.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new dc(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let n = e.parent;
    if (n.isTextblock || !rv(e) || !sv(e))
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
        if (!r && je.valid(e))
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
          if (je.valid(a))
            return a;
        }
        for (; ; ) {
          let o = n > 0 ? i.firstChild : i.lastChild;
          if (!o) {
            if (i.isAtom && !i.isText && !Z.isSelectable(i)) {
              e = e.doc.resolve(s + i.nodeSize * n), r = !1;
              continue e;
            }
            break;
          }
          i = o, s += n;
          let l = e.doc.resolve(s);
          if (je.valid(l))
            return l;
        }
        return null;
      }
  }
}
je.prototype.visible = !1;
je.findFrom = je.findGapCursorFrom;
se.jsonID("gapcursor", je);
class dc {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new dc(e.map(this.pos));
  }
  resolve(e) {
    let n = e.resolve(this.pos);
    return je.valid(n) ? new je(n) : se.near(n);
  }
}
function rv(t) {
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
function sv(t) {
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
function iv() {
  return new Qe({
    props: {
      decorations: cv,
      createSelectionBetween(t, e, n) {
        return e.pos == n.pos && je.valid(n) ? new je(n) : null;
      },
      handleClick: lv,
      handleKeyDown: ov,
      handleDOMEvents: { beforeinput: av }
    }
  });
}
const ov = Vh({
  ArrowLeft: Bs("horiz", -1),
  ArrowRight: Bs("horiz", 1),
  ArrowUp: Bs("vert", -1),
  ArrowDown: Bs("vert", 1)
});
function Bs(t, e) {
  const n = t == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, s, i) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof te) {
      if (!i.endOfTextblock(n) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = je.findGapCursorFrom(l, e, a);
    return c ? (s && s(r.tr.setSelection(new je(c))), !0) : !1;
  };
}
function lv(t, e, n) {
  if (!t || !t.editable)
    return !1;
  let r = t.state.doc.resolve(e);
  if (!je.valid(r))
    return !1;
  let s = t.posAtCoords({ left: n.clientX, top: n.clientY });
  return s && s.inside > -1 && Z.isSelectable(t.state.doc.nodeAt(s.inside)) ? !1 : (t.dispatch(t.state.tr.setSelection(new je(r))), !0);
}
function av(t, e) {
  if (e.inputType != "insertCompositionText" || !(t.state.selection instanceof je))
    return !1;
  let { $from: n } = t.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(t.state.schema.nodes.text);
  if (!r)
    return !1;
  let s = H.empty;
  for (let o = r.length - 1; o >= 0; o--)
    s = H.from(r[o].createAndFill(null, s));
  let i = t.state.tr.replace(n.pos, n.pos, new U(s, 0, 0));
  return i.setSelection(te.near(i.doc.resolve(n.pos + 1))), t.dispatch(i), !1;
}
function cv(t) {
  if (!(t.selection instanceof je))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", ke.create(t.doc, [dt.widget(t.selection.head, e, { key: "gapcursor" })]);
}
const uv = Xe.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      iv()
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
      allowGapCursor: (e = Se(Ie(t, "allowGapCursor", n))) !== null && e !== void 0 ? e : null
    };
  }
}), dv = Ee.create({
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
}), fv = Ee.create({
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
    return this.options.levels.map((t) => ql({
      find: new RegExp(`^(#{1,${t}})\\s$`),
      type: this.type,
      getAttributes: {
        level: t
      }
    }));
  }
});
var Ai = 200, Ue = function() {
};
Ue.prototype.append = function(e) {
  return e.length ? (e = Ue.from(e), !this.length && e || e.length < Ai && this.leafAppend(e) || this.length < Ai && e.leafPrepend(this) || this.appendInner(e)) : this;
};
Ue.prototype.prepend = function(e) {
  return e.length ? Ue.from(e).append(this) : this;
};
Ue.prototype.appendInner = function(e) {
  return new hv(this, e);
};
Ue.prototype.slice = function(e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = this.length), e >= n ? Ue.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, n));
};
Ue.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
Ue.prototype.forEach = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length), n <= r ? this.forEachInner(e, n, r, 0) : this.forEachInvertedInner(e, n, r, 0);
};
Ue.prototype.map = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length);
  var s = [];
  return this.forEach(function(i, o) {
    return s.push(e(i, o));
  }, n, r), s;
};
Ue.from = function(e) {
  return e instanceof Ue ? e : e && e.length ? new tp(e) : Ue.empty;
};
var tp = /* @__PURE__ */ function(t) {
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
    if (this.length + s.length <= Ai)
      return new e(this.values.concat(s.flatten()));
  }, e.prototype.leafPrepend = function(s) {
    if (this.length + s.length <= Ai)
      return new e(s.flatten().concat(this.values));
  }, n.length.get = function() {
    return this.values.length;
  }, n.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, n), e;
}(Ue);
Ue.empty = new tp([]);
var hv = /* @__PURE__ */ function(t) {
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
}(Ue);
const pv = 500;
class Rt {
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
        u.push(new Bt(f.map));
        let g = f.step.map(s.slice(i)), y;
        g && o.maybeStep(g).doc && (y = o.mapping.maps[o.mapping.maps.length - 1], c.push(new Bt(y, void 0, void 0, c.length + u.length))), i--, y && s.appendMap(y, i);
      } else
        o.maybeStep(f.step);
      if (f.selection)
        return l = s ? f.selection.map(s.slice(i)) : f.selection, a = new Rt(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, n, r, s) {
    let i = [], o = this.eventCount, l = this.items, a = !s && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let f = e.steps[u].invert(e.docs[u]), h = new Bt(e.mapping.maps[u], f, n), g;
      (g = a && a.merge(h)) && (h = g, u ? i.pop() : l = l.slice(0, l.length - 1)), i.push(h), n && (o++, n = void 0), s || (a = h);
    }
    let c = o - r.depth;
    return c > gv && (l = mv(l, c), o -= c), new Rt(l.append(i), o);
  }
  remapping(e, n) {
    let r = new Er();
    return this.items.forEach((s, i) => {
      let o = s.mirrorOffset != null && i - s.mirrorOffset >= e ? r.maps.length - s.mirrorOffset : void 0;
      r.appendMap(s.map, o);
    }, e, n), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Rt(this.items.append(e.map((n) => new Bt(n))), this.eventCount);
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
      let g = i.getMirror(--a);
      if (g == null)
        return;
      o = Math.min(o, g);
      let y = i.maps[g];
      if (h.step) {
        let v = e.steps[g].invert(e.docs[g]), k = h.selection && h.selection.map(i.slice(a + 1, g));
        k && l++, r.push(new Bt(y, v, k));
      } else
        r.push(new Bt(y));
    }, s);
    let c = [];
    for (let h = n; h < o; h++)
      c.push(new Bt(i.maps[h]));
    let u = this.items.slice(0, s).append(c).append(r), f = new Rt(u, l);
    return f.emptyItemCount() > pv && (f = f.compress(this.items.length - r.length)), f;
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
          let f = new Bt(c.invert(), a, u), h, g = s.length - 1;
          (h = s.length && s[g].merge(f)) ? s[g] = h : s.push(f);
        }
      } else
        o.map && r--;
    }, this.items.length, 0), new Rt(Ue.from(s.reverse()), i);
  }
}
Rt.empty = new Rt(Ue.empty, 0);
function mv(t, e) {
  let n;
  return t.forEach((r, s) => {
    if (r.selection && e-- == 0)
      return n = s, !1;
  }), t.slice(n);
}
class Bt {
  constructor(e, n, r, s) {
    this.map = e, this.step = n, this.selection = r, this.mirrorOffset = s;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let n = e.step.merge(this.step);
      if (n)
        return new Bt(n.getMap().invert(), n, this.selection);
    }
  }
}
class vn {
  constructor(e, n, r, s, i) {
    this.done = e, this.undone = n, this.prevRanges = r, this.prevTime = s, this.prevComposition = i;
  }
}
const gv = 20;
function yv(t, e, n, r) {
  let s = n.getMeta(An), i;
  if (s)
    return s.historyState;
  n.getMeta(vv) && (t = new vn(t.done, t.undone, null, 0, -1));
  let o = n.getMeta("appendedTransaction");
  if (n.steps.length == 0)
    return t;
  if (o && o.getMeta(An))
    return o.getMeta(An).redo ? new vn(t.done.addTransform(n, void 0, r, si(e)), t.undone, nd(n.mapping.maps[n.steps.length - 1]), t.prevTime, t.prevComposition) : new vn(t.done, t.undone.addTransform(n, void 0, r, si(e)), null, t.prevTime, t.prevComposition);
  if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = n.getMeta("composition"), a = t.prevTime == 0 || !o && t.prevComposition != l && (t.prevTime < (n.time || 0) - r.newGroupDelay || !bv(n, t.prevRanges)), c = o ? sl(t.prevRanges, n.mapping) : nd(n.mapping.maps[n.steps.length - 1]);
    return new vn(t.done.addTransform(n, a ? e.selection.getBookmark() : void 0, r, si(e)), Rt.empty, c, n.time, l ?? t.prevComposition);
  } else
    return (i = n.getMeta("rebased")) ? new vn(t.done.rebased(n, i), t.undone.rebased(n, i), sl(t.prevRanges, n.mapping), t.prevTime, t.prevComposition) : new vn(t.done.addMaps(n.mapping.maps), t.undone.addMaps(n.mapping.maps), sl(t.prevRanges, n.mapping), t.prevTime, t.prevComposition);
}
function bv(t, e) {
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
function nd(t) {
  let e = [];
  return t.forEach((n, r, s, i) => e.push(s, i)), e;
}
function sl(t, e) {
  if (!t)
    return null;
  let n = [];
  for (let r = 0; r < t.length; r += 2) {
    let s = e.map(t[r], 1), i = e.map(t[r + 1], -1);
    s <= i && n.push(s, i);
  }
  return n;
}
function np(t, e, n, r) {
  let s = si(e), i = An.get(e).spec.config, o = (r ? t.undone : t.done).popEvent(e, s);
  if (!o)
    return;
  let l = o.selection.resolve(o.transform.doc), a = (r ? t.done : t.undone).addTransform(o.transform, e.selection.getBookmark(), i, s), c = new vn(r ? a : o.remaining, r ? o.remaining : a, null, 0, -1);
  n(o.transform.setSelection(l).setMeta(An, { redo: r, historyState: c }).scrollIntoView());
}
let il = !1, rd = null;
function si(t) {
  let e = t.plugins;
  if (rd != e) {
    il = !1, rd = e;
    for (let n = 0; n < e.length; n++)
      if (e[n].spec.historyPreserveItems) {
        il = !0;
        break;
      }
  }
  return il;
}
const An = new Ze("history"), vv = new Ze("closeHistory");
function wv(t = {}) {
  return t = {
    depth: t.depth || 100,
    newGroupDelay: t.newGroupDelay || 500
  }, new Qe({
    key: An,
    state: {
      init() {
        return new vn(Rt.empty, Rt.empty, null, 0, -1);
      },
      apply(e, n, r) {
        return yv(n, r, e, t);
      }
    },
    config: t,
    props: {
      handleDOMEvents: {
        beforeinput(e, n) {
          let r = n.inputType, s = r == "historyUndo" ? rp : r == "historyRedo" ? sp : null;
          return s ? (n.preventDefault(), s(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const rp = (t, e) => {
  let n = An.getState(t);
  return !n || n.done.eventCount == 0 ? !1 : (e && np(n, t, e, !1), !0);
}, sp = (t, e) => {
  let n = An.getState(t);
  return !n || n.undone.eventCount == 0 ? !1 : (e && np(n, t, e, !0), !0);
}, xv = Xe.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: t, dispatch: e }) => rp(t, e),
      redo: () => ({ state: t, dispatch: e }) => sp(t, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      wv(this.options)
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
}), _v = Ee.create({
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
              l.nodeAfter.isTextblock ? s.setSelection(te.create(s.doc, l.pos + 1)) : l.nodeAfter.isBlock ? s.setSelection(Z.create(s.doc, l.pos)) : s.setSelection(te.create(s.doc, l.pos));
            else {
              const c = (o = l.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (s.insert(a, c), s.setSelection(te.create(s.doc, a + 1)));
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
      ep({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), kv = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/, Sv = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g, Cv = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/, Ev = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g, Mv = Tt.create({
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
      rr({
        find: kv,
        type: this.type
      }),
      rr({
        find: Cv,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Rn({
        find: Sv,
        type: this.type
      }),
      Rn({
        find: Ev,
        type: this.type
      })
    ];
  }
}), Av = Ee.create({
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
}), Tv = Ee.create({
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
}), sd = Tt.create({
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
        const n = Ms(t, this.type);
        return Object.entries(n).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), id = /^(\d+)\.\s$/, jv = Ee.create({
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
      toggleOrderedList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Tv.name, this.editor.getAttributes(sd.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let t = bs({
      find: id,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = bs({
      find: id,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(sd.name) }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1],
      editor: this.editor
    })), [
      t
    ];
  }
}), Ov = Ee.create({
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
}), Rv = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/, Lv = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g, Pv = Tt.create({
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
    return oc() ? t["Mod-Shift-s"] = () => this.editor.commands.toggleStrike() : t["Ctrl-Shift-s"] = () => this.editor.commands.toggleStrike(), t;
  },
  addInputRules() {
    return [
      rr({
        find: Rv,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Rn({
        find: Lv,
        type: this.type
      })
    ];
  }
}), Iv = Ee.create({
  name: "text",
  group: "inline"
});
Xe.create({
  name: "starterKit",
  addExtensions() {
    var t, e, n, r, s, i, o, l, a, c, u, f, h, g, y, v, k, E;
    const T = [];
    return this.options.blockquote !== !1 && T.push(Db.configure((t = this.options) === null || t === void 0 ? void 0 : t.blockquote)), this.options.bold !== !1 && T.push(Wb.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && T.push(Ub.configure((n = this.options) === null || n === void 0 ? void 0 : n.bulletList)), this.options.code !== !1 && T.push(Jb.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && T.push(Qb.configure((s = this.options) === null || s === void 0 ? void 0 : s.codeBlock)), this.options.document !== !1 && T.push(Zb.configure((i = this.options) === null || i === void 0 ? void 0 : i.document)), this.options.dropcursor !== !1 && T.push(nv.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && T.push(uv.configure((l = this.options) === null || l === void 0 ? void 0 : l.gapcursor)), this.options.hardBreak !== !1 && T.push(dv.configure((a = this.options) === null || a === void 0 ? void 0 : a.hardBreak)), this.options.heading !== !1 && T.push(fv.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && T.push(xv.configure((u = this.options) === null || u === void 0 ? void 0 : u.history)), this.options.horizontalRule !== !1 && T.push(_v.configure((f = this.options) === null || f === void 0 ? void 0 : f.horizontalRule)), this.options.italic !== !1 && T.push(Mv.configure((h = this.options) === null || h === void 0 ? void 0 : h.italic)), this.options.listItem !== !1 && T.push(Av.configure((g = this.options) === null || g === void 0 ? void 0 : g.listItem)), this.options.orderedList !== !1 && T.push(jv.configure((y = this.options) === null || y === void 0 ? void 0 : y.orderedList)), this.options.paragraph !== !1 && T.push(Ov.configure((v = this.options) === null || v === void 0 ? void 0 : v.paragraph)), this.options.strike !== !1 && T.push(Pv.configure((k = this.options) === null || k === void 0 ? void 0 : k.strike)), this.options.text !== !1 && T.push(Iv.configure((E = this.options) === null || E === void 0 ? void 0 : E.text)), T;
  }
});
Xe.create({
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
      new Qe({
        key: new Ze("placeholder"),
        props: {
          decorations: ({ doc: t, selection: e }) => {
            var n;
            const r = this.editor.isEditable || !this.options.showOnlyWhenEditable, { anchor: s } = e, i = [];
            if (!r)
              return null;
            const { firstChild: o } = t.content, l = o && o.type.isLeaf, a = o && o.isAtom, c = this.options.considerAnyAsEmpty ? !0 : o && o.type.name === ((n = t.type.contentMatch.defaultType) === null || n === void 0 ? void 0 : n.name), u = t.content.childCount <= 1 && o && c && o.nodeSize <= 2 && (!l || !a);
            return t.descendants((f, h) => {
              const g = s >= h && s <= h + f.nodeSize, y = !f.isLeaf && !f.childCount;
              if ((g || !this.options.showOnlyCurrent) && y) {
                const v = [this.options.emptyNodeClass];
                u && v.push(this.options.emptyEditorClass);
                const k = dt.node(h, h + f.nodeSize, {
                  class: v.join(" "),
                  "data-placeholder": typeof this.options.placeholder == "function" ? this.options.placeholder({
                    editor: this.editor,
                    node: f,
                    pos: h,
                    hasAnchor: g
                  }) : this.options.placeholder
                });
                i.push(k);
              }
              return this.options.includeChildren;
            }), ke.create(t, i);
          }
        }
      })
    ];
  }
});
Xe.create({
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
var Gl, Jl;
if (typeof WeakMap < "u") {
  let t = /* @__PURE__ */ new WeakMap();
  Gl = (e) => t.get(e), Jl = (e, n) => (t.set(e, n), n);
} else {
  const t = [];
  let n = 0;
  Gl = (r) => {
    for (let s = 0; s < t.length; s += 2)
      if (t[s] == r)
        return t[s + 1];
  }, Jl = (r, s) => (n == 10 && (n = 0), t[n++] = r, t[n++] = s);
}
var Oe = class {
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
    return Gl(t) || Jl(t, Nv(t));
  }
};
function Nv(t) {
  if (t.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + t.type.name);
  const e = zv(t), n = t.childCount, r = [];
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
      const v = f.child(y), { colspan: k, rowspan: E, colwidth: T } = v.attrs;
      for (let j = 0; j < E; j++) {
        if (j + c >= n) {
          (i || (i = [])).push({
            type: "overlong_rowspan",
            pos: u,
            n: E - j
          });
          break;
        }
        const d = s + j * e;
        for (let m = 0; m < k; m++) {
          r[d + m] == 0 ? r[d + m] = u : (i || (i = [])).push({
            type: "collision",
            row: c,
            pos: u,
            n: k - m
          });
          const p = T && T[m];
          if (p) {
            const b = (d + m) % e * 2, w = o[b];
            w == null || w != p && o[b + 1] == 1 ? (o[b] = p, o[b + 1] = 1) : w == p && o[b + 1]++;
          }
        }
      }
      s += k, u += v.nodeSize;
    }
    const h = (c + 1) * e;
    let g = 0;
    for (; s < h; )
      r[s++] == 0 && g++;
    g && (i || (i = [])).push({ type: "missing", row: c, n: g }), u++;
  }
  const l = new Oe(e, n, r, i);
  let a = !1;
  for (let c = 0; !a && c < o.length; c += 2)
    o[c] != null && o[c + 1] < n && (a = !0);
  return a && $v(l, o, t), l;
}
function zv(t) {
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
function $v(t, e, n) {
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
      f != null && (!a.colwidth || a.colwidth[c] != f) && ((l || (l = Dv(a)))[c] = f);
    }
    l && t.problems.unshift({
      type: "colwidth mismatch",
      pos: i,
      colwidth: l
    });
  }
}
function Dv(t) {
  if (t.colwidth)
    return t.colwidth.slice();
  const e = [];
  for (let n = 0; n < t.colspan; n++)
    e.push(0);
  return e;
}
function nt(t) {
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
var xn = new Ze("selectingCells");
function $r(t) {
  for (let e = t.depth - 1; e > 0; e--)
    if (t.node(e).type.spec.tableRole == "row")
      return t.node(0).resolve(t.before(e + 1));
  return null;
}
function Bv(t) {
  for (let e = t.depth; e > 0; e--) {
    const n = t.node(e).type.spec.tableRole;
    if (n === "cell" || n === "header_cell")
      return t.node(e);
  }
  return null;
}
function Nt(t) {
  const e = t.selection.$head;
  for (let n = e.depth; n > 0; n--)
    if (e.node(n).type.spec.tableRole == "row")
      return !0;
  return !1;
}
function To(t) {
  const e = t.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const n = $r(e.$head) || Hv(e.$head);
  if (n)
    return n;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function Hv(t) {
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
function Yl(t) {
  return t.parent.type.spec.tableRole == "row" && !!t.nodeAfter;
}
function Fv(t) {
  return t.node(0).resolve(t.pos + t.nodeAfter.nodeSize);
}
function fc(t, e) {
  return t.depth == e.depth && t.pos >= e.start(-1) && t.pos <= e.end(-1);
}
function ip(t, e, n) {
  const r = t.node(-1), s = Oe.get(r), i = t.start(-1), o = s.nextCell(t.pos - i, e, n);
  return o == null ? null : t.node(0).resolve(i + o);
}
function sr(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan - n };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, n), r.colwidth.some((s) => s > 0) || (r.colwidth = null)), r;
}
function op(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan + n };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let s = 0; s < n; s++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function Vv(t, e, n) {
  const r = nt(e.type.schema).header_cell;
  for (let s = 0; s < t.height; s++)
    if (e.nodeAt(t.map[n + s * t.width]).type != r)
      return !1;
  return !0;
}
var ye = class en extends se {
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  constructor(e, n = e) {
    const r = e.node(-1), s = Oe.get(r), i = e.start(-1), o = s.rectBetween(
      e.pos - i,
      n.pos - i
    ), l = e.node(0), a = s.cellsInRect(o).filter((u) => u != n.pos - i);
    a.unshift(n.pos - i);
    const c = a.map((u) => {
      const f = r.nodeAt(u);
      if (!f)
        throw RangeError(`No cell with offset ${u} found`);
      const h = i + u + 1;
      return new yh(
        l.resolve(h),
        l.resolve(h + f.content.size)
      );
    });
    super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = n;
  }
  map(e, n) {
    const r = e.resolve(n.map(this.$anchorCell.pos)), s = e.resolve(n.map(this.$headCell.pos));
    if (Yl(r) && Yl(s) && fc(r, s)) {
      const i = this.$anchorCell.node(-1) != r.node(-1);
      return i && this.isRowSelection() ? en.rowSelection(r, s) : i && this.isColSelection() ? en.colSelection(r, s) : new en(r, s);
    }
    return te.between(r, s);
  }
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  content() {
    const e = this.$anchorCell.node(-1), n = Oe.get(e), r = this.$anchorCell.start(-1), s = n.rectBetween(
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
        const g = n.findCell(h);
        let y = e.nodeAt(h);
        if (!y)
          throw RangeError(`No cell with offset ${h} found`);
        const v = s.left - g.left, k = g.right - s.right;
        if (v > 0 || k > 0) {
          let E = y.attrs;
          if (v > 0 && (E = sr(E, 0, v)), k > 0 && (E = sr(
            E,
            E.colspan - k,
            k
          )), g.left < s.left) {
            if (y = y.type.createAndFill(E), !y)
              throw RangeError(
                `Could not create cell with attrs ${JSON.stringify(E)}`
              );
          } else
            y = y.type.create(E, y.content);
        }
        if (g.top < s.top || g.bottom > s.bottom) {
          const E = {
            ...y.attrs,
            rowspan: Math.min(g.bottom, s.bottom) - Math.max(g.top, s.top)
          };
          g.top < s.top ? y = y.type.createAndFill(E) : y = y.type.create(E, y.content);
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
    const n = this.$anchorCell.node(-1), r = Oe.get(n), s = this.$anchorCell.start(-1), i = r.cellsInRect(
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
    const r = e.node(-1), s = Oe.get(r), i = e.start(-1), o = s.findCell(e.pos - i), l = s.findCell(n.pos - i), a = e.node(0);
    return o.top <= l.top ? (o.top > 0 && (e = a.resolve(i + s.map[o.left])), l.bottom < s.height && (n = a.resolve(
      i + s.map[s.width * (s.height - 1) + l.right - 1]
    ))) : (l.top > 0 && (n = a.resolve(i + s.map[l.left])), o.bottom < s.height && (e = a.resolve(
      i + s.map[s.width * (s.height - 1) + o.right - 1]
    ))), new en(e, n);
  }
  // True if this selection goes all the way from the left to the
  // right of the table.
  isRowSelection() {
    const e = this.$anchorCell.node(-1), n = Oe.get(e), r = this.$anchorCell.start(-1), s = n.colCount(this.$anchorCell.pos - r), i = n.colCount(this.$headCell.pos - r);
    if (Math.min(s, i) > 0)
      return !1;
    const o = s + this.$anchorCell.nodeAfter.attrs.colspan, l = i + this.$headCell.nodeAfter.attrs.colspan;
    return Math.max(o, l) == n.width;
  }
  eq(e) {
    return e instanceof en && e.$anchorCell.pos == this.$anchorCell.pos && e.$headCell.pos == this.$headCell.pos;
  }
  // Returns the smallest row selection that covers the given anchor
  // and head cell.
  static rowSelection(e, n = e) {
    const r = e.node(-1), s = Oe.get(r), i = e.start(-1), o = s.findCell(e.pos - i), l = s.findCell(n.pos - i), a = e.node(0);
    return o.left <= l.left ? (o.left > 0 && (e = a.resolve(
      i + s.map[o.top * s.width]
    )), l.right < s.width && (n = a.resolve(
      i + s.map[s.width * (l.top + 1) - 1]
    ))) : (l.left > 0 && (n = a.resolve(i + s.map[l.top * s.width])), o.right < s.width && (e = a.resolve(
      i + s.map[s.width * (o.top + 1) - 1]
    ))), new en(e, n);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(e, n) {
    return new en(e.resolve(n.anchor), e.resolve(n.head));
  }
  static create(e, n, r = n) {
    return new en(e.resolve(n), e.resolve(r));
  }
  getBookmark() {
    return new Wv(this.$anchorCell.pos, this.$headCell.pos);
  }
};
ye.prototype.visible = !1;
se.jsonID("cell", ye);
var Wv = class lp {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new lp(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    const n = e.resolve(this.anchor), r = e.resolve(this.head);
    return n.parent.type.spec.tableRole == "row" && r.parent.type.spec.tableRole == "row" && n.index() < n.parent.childCount && r.index() < r.parent.childCount && fc(n, r) ? new ye(n, r) : se.near(r, 1);
  }
};
function Kv(t) {
  if (!(t.selection instanceof ye))
    return null;
  const e = [];
  return t.selection.forEachCell((n, r) => {
    e.push(
      dt.node(r, r + n.nodeSize, { class: "selectedCell" })
    );
  }), ke.create(t.doc, e);
}
function Uv({ $from: t, $to: e }) {
  if (t.pos == e.pos || t.pos < t.pos - 6)
    return !1;
  let n = t.pos, r = e.pos, s = t.depth;
  for (; s >= 0 && !(t.after(s + 1) < t.end(s)); s--, n++)
    ;
  for (let i = e.depth; i >= 0 && !(e.before(i + 1) > e.start(i)); i--, r--)
    ;
  return n == r && /row|table/.test(t.node(s).type.spec.tableRole);
}
function qv({ $from: t, $to: e }) {
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
function Gv(t, e, n) {
  const r = (e || t).selection, s = (e || t).doc;
  let i, o;
  if (r instanceof Z && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      i = ye.create(s, r.from);
    else if (o == "row") {
      const l = s.resolve(r.from + 1);
      i = ye.rowSelection(l, l);
    } else if (!n) {
      const l = Oe.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      i = ye.create(s, a + 1, c);
    }
  } else
    r instanceof te && Uv(r) ? i = te.create(s, r.from) : r instanceof te && qv(r) && (i = te.create(s, r.$from.start(), r.$from.end()));
  return i && (e || (e = t.tr)).setSelection(i), e;
}
var Jv = new Ze("fix-tables");
function ap(t, e, n, r) {
  const s = t.childCount, i = e.childCount;
  e:
    for (let o = 0, l = 0; o < i; o++) {
      const a = e.child(o);
      for (let c = l, u = Math.min(s, o + 3); c < u; c++)
        if (t.child(c) == a) {
          l = c + 1, n += a.nodeSize;
          continue e;
        }
      r(a, n), l < s && t.child(l).sameMarkup(a) ? ap(t.child(l), a, n + 1, r) : a.nodesBetween(0, a.content.size, r, n + 1), n += a.nodeSize;
    }
}
function cp(t, e) {
  let n;
  const r = (s, i) => {
    s.type.spec.tableRole == "table" && (n = Yv(t, s, i, n));
  };
  return e ? e.doc != t.doc && ap(e.doc, t.doc, 0, r) : t.doc.descendants(r), n;
}
function Yv(t, e, n, r) {
  const s = Oe.get(e);
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
        sr(f, f.colspan - c.n, c.n)
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
      let g = "cell";
      u.firstChild && (g = u.firstChild.type.spec.tableRole);
      const y = [];
      for (let k = 0; k < h; k++) {
        const E = nt(t.schema)[g].createAndFill();
        E && y.push(E);
      }
      const v = (a == 0 || o == a - 1) && l == a ? c + 1 : f - 1;
      r.insert(r.mapping.map(v), y);
    }
    c = f;
  }
  return r.setMeta(Jv, { fixTables: !0 });
}
function Xv(t) {
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
      (u || f) && (c = Xl(
        nt(o).row,
        new U(c, u, f)
      ).content), l.push(c);
    }
  else if (i == "cell" || i == "header_cell")
    l.push(
      n || r ? Xl(
        nt(o).row,
        new U(e, n, r)
      ).content : e
    );
  else
    return null;
  return Qv(o, l);
}
function Qv(t, e) {
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
      const i = nt(t).cell.createAndFill(), o = [];
      for (let l = n[s]; l < r; l++)
        o.push(i);
      e[s] = e[s].append(H.from(o));
    }
  return { height: e.length, width: r, rows: e };
}
function Xl(t, e) {
  const n = t.createAndFill();
  return new gh(n).replace(0, n.content.size, e).doc;
}
function Zv({ width: t, height: e, rows: n }, r, s) {
  if (t != r) {
    const i = [], o = [];
    for (let l = 0; l < n.length; l++) {
      const a = n[l], c = [];
      for (let u = i[l] || 0, f = 0; u < r; f++) {
        let h = a.child(f % a.childCount);
        u + h.attrs.colspan > r && (h = h.type.createChecked(
          sr(
            h.attrs,
            h.attrs.colspan,
            u + h.attrs.colspan - r
          ),
          h.content
        )), c.push(h), u += h.attrs.colspan;
        for (let g = 1; g < h.attrs.rowspan; g++)
          i[l + g] = (i[l + g] || 0) + h.attrs.colspan;
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
function e3(t, e, n, r, s, i, o) {
  const l = t.doc.type.schema, a = nt(l);
  let c, u;
  if (s > e.width)
    for (let f = 0, h = 0; f < e.height; f++) {
      const g = n.child(f);
      h += g.nodeSize;
      const y = [];
      let v;
      g.lastChild == null || g.lastChild.type == a.cell ? v = c || (c = a.cell.createAndFill()) : v = u || (u = a.header_cell.createAndFill());
      for (let k = e.width; k < s; k++)
        y.push(v);
      t.insert(t.mapping.slice(o).map(h - 1 + r), y);
    }
  if (i > e.height) {
    const f = [];
    for (let y = 0, v = (e.height - 1) * e.width; y < Math.max(e.width, s); y++) {
      const k = y >= e.width ? !1 : n.nodeAt(e.map[v + y]).type == a.header_cell;
      f.push(
        k ? u || (u = a.header_cell.createAndFill()) : c || (c = a.cell.createAndFill())
      );
    }
    const h = a.row.create(null, H.from(f)), g = [];
    for (let y = e.height; y < i; y++)
      g.push(h);
    t.insert(t.mapping.slice(o).map(r + n.nodeSize - 2), g);
  }
  return !!(c || u);
}
function od(t, e, n, r, s, i, o, l) {
  if (o == 0 || o == e.height)
    return !1;
  let a = !1;
  for (let c = s; c < i; c++) {
    const u = o * e.width + c, f = e.map[u];
    if (e.map[u - e.width] == f) {
      a = !0;
      const h = n.nodeAt(f), { top: g, left: y } = e.findCell(f);
      t.setNodeMarkup(t.mapping.slice(l).map(f + r), null, {
        ...h.attrs,
        rowspan: o - g
      }), t.insert(
        t.mapping.slice(l).map(e.positionAt(o, y, n)),
        h.type.createAndFill({
          ...h.attrs,
          rowspan: g + h.attrs.rowspan - o
        })
      ), c += h.attrs.colspan - 1;
    }
  }
  return a;
}
function ld(t, e, n, r, s, i, o, l) {
  if (o == 0 || o == e.width)
    return !1;
  let a = !1;
  for (let c = s; c < i; c++) {
    const u = c * e.width + o, f = e.map[u];
    if (e.map[u - 1] == f) {
      a = !0;
      const h = n.nodeAt(f), g = e.colCount(f), y = t.mapping.slice(l).map(f + r);
      t.setNodeMarkup(
        y,
        null,
        sr(
          h.attrs,
          o - g,
          h.attrs.colspan - (o - g)
        )
      ), t.insert(
        y + h.nodeSize,
        h.type.createAndFill(
          sr(h.attrs, 0, o - g)
        )
      ), c += h.attrs.rowspan - 1;
    }
  }
  return a;
}
function ad(t, e, n, r, s) {
  let i = n ? t.doc.nodeAt(n - 1) : t.doc;
  if (!i)
    throw new Error("No table found");
  let o = Oe.get(i);
  const { top: l, left: a } = r, c = a + s.width, u = l + s.height, f = t.tr;
  let h = 0;
  function g() {
    if (i = n ? f.doc.nodeAt(n - 1) : f.doc, !i)
      throw new Error("No table found");
    o = Oe.get(i), h = f.mapping.maps.length;
  }
  e3(f, o, i, n, c, u, h) && g(), od(f, o, i, n, a, c, l, h) && g(), od(f, o, i, n, a, c, u, h) && g(), ld(f, o, i, n, l, u, a, h) && g(), ld(f, o, i, n, l, u, c, h) && g();
  for (let y = l; y < u; y++) {
    const v = o.positionAt(y, a, i), k = o.positionAt(y, c, i);
    f.replace(
      f.mapping.slice(h).map(v + n),
      f.mapping.slice(h).map(k + n),
      new U(s.rows[y - l], 0, 0)
    );
  }
  g(), f.setSelection(
    new ye(
      f.doc.resolve(n + o.positionAt(l, a, i)),
      f.doc.resolve(n + o.positionAt(u - 1, c - 1, i))
    )
  ), e(f);
}
var t3 = Vh({
  ArrowLeft: Hs("horiz", -1),
  ArrowRight: Hs("horiz", 1),
  ArrowUp: Hs("vert", -1),
  ArrowDown: Hs("vert", 1),
  "Shift-ArrowLeft": Fs("horiz", -1),
  "Shift-ArrowRight": Fs("horiz", 1),
  "Shift-ArrowUp": Fs("vert", -1),
  "Shift-ArrowDown": Fs("vert", 1),
  Backspace: Vs,
  "Mod-Backspace": Vs,
  Delete: Vs,
  "Mod-Delete": Vs
});
function ii(t, e, n) {
  return n.eq(t.selection) ? !1 : (e && e(t.tr.setSelection(n).scrollIntoView()), !0);
}
function Hs(t, e) {
  return (n, r, s) => {
    if (!s)
      return !1;
    const i = n.selection;
    if (i instanceof ye)
      return ii(
        n,
        r,
        se.near(i.$headCell, e)
      );
    if (t != "horiz" && !i.empty)
      return !1;
    const o = up(s, t, e);
    if (o == null)
      return !1;
    if (t == "horiz")
      return ii(
        n,
        r,
        se.near(n.doc.resolve(i.head + e), e)
      );
    {
      const l = n.doc.resolve(o), a = ip(l, t, e);
      let c;
      return a ? c = se.near(a, 1) : e < 0 ? c = se.near(n.doc.resolve(l.before(-1)), -1) : c = se.near(n.doc.resolve(l.after(-1)), 1), ii(n, r, c);
    }
  };
}
function Fs(t, e) {
  return (n, r, s) => {
    if (!s)
      return !1;
    const i = n.selection;
    let o;
    if (i instanceof ye)
      o = i;
    else {
      const a = up(s, t, e);
      if (a == null)
        return !1;
      o = new ye(n.doc.resolve(a));
    }
    const l = ip(o.$headCell, t, e);
    return l ? ii(
      n,
      r,
      new ye(o.$anchorCell, l)
    ) : !1;
  };
}
function Vs(t, e) {
  const n = t.selection;
  if (!(n instanceof ye))
    return !1;
  if (e) {
    const r = t.tr, s = nt(t.schema).cell.createAndFill().content;
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
function n3(t, e) {
  const n = t.state.doc, r = $r(n.resolve(e));
  return r ? (t.dispatch(t.state.tr.setSelection(new ye(r))), !0) : !1;
}
function r3(t, e, n) {
  if (!Nt(t.state))
    return !1;
  let r = Xv(n);
  const s = t.state.selection;
  if (s instanceof ye) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        H.from(
          Xl(nt(t.state.schema).cell, n)
        )
      ]
    });
    const i = s.$anchorCell.node(-1), o = s.$anchorCell.start(-1), l = Oe.get(i).rectBetween(
      s.$anchorCell.pos - o,
      s.$headCell.pos - o
    );
    return r = Zv(r, l.right - l.left, l.bottom - l.top), ad(t.state, t.dispatch, o, l, r), !0;
  } else if (r) {
    const i = To(t.state), o = i.start(-1);
    return ad(
      t.state,
      t.dispatch,
      o,
      Oe.get(i.node(-1)).findCell(i.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function s3(t, e) {
  var n;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = cd(t, e.target);
  let s;
  if (e.shiftKey && t.state.selection instanceof ye)
    i(t.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (s = $r(t.state.selection.$anchor)) != null && ((n = ol(t, e)) == null ? void 0 : n.pos) != s.pos)
    i(s, e), e.preventDefault();
  else if (!r)
    return;
  function i(a, c) {
    let u = ol(t, c);
    const f = xn.getState(t.state) == null;
    if (!u || !fc(a, u))
      if (f)
        u = a;
      else
        return;
    const h = new ye(a, u);
    if (f || !t.state.selection.eq(h)) {
      const g = t.state.tr.setSelection(h);
      f && g.setMeta(xn, a.pos), t.dispatch(g);
    }
  }
  function o() {
    t.root.removeEventListener("mouseup", o), t.root.removeEventListener("dragstart", o), t.root.removeEventListener("mousemove", l), xn.getState(t.state) != null && t.dispatch(t.state.tr.setMeta(xn, -1));
  }
  function l(a) {
    const c = a, u = xn.getState(t.state);
    let f;
    if (u != null)
      f = t.state.doc.resolve(u);
    else if (cd(t, c.target) != r && (f = ol(t, e), !f))
      return o();
    f && i(f, c);
  }
  t.root.addEventListener("mouseup", o), t.root.addEventListener("dragstart", o), t.root.addEventListener("mousemove", l);
}
function up(t, e, n) {
  if (!(t.state.selection instanceof te))
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
function cd(t, e) {
  for (; e && e != t.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function ol(t, e) {
  const n = t.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return n && n ? $r(t.state.doc.resolve(n.pos)) : null;
}
var i3 = class {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Ql(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, Ql(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function Ql(t, e, n, r, s, i) {
  var o;
  let l = 0, a = !0, c = e.firstChild;
  const u = t.firstChild;
  if (u) {
    for (let f = 0, h = 0; f < u.childCount; f++) {
      const { colspan: g, colwidth: y } = u.child(f).attrs;
      for (let v = 0; v < g; v++, h++) {
        const k = s == h ? i : y && y[v], E = k ? k + "px" : "";
        l += k || r, k || (a = !1), c ? (c.style.width != E && (c.style.width = E), c = c.nextSibling) : e.appendChild(document.createElement("col")).style.width = E;
      }
    }
    for (; c; ) {
      const f = c.nextSibling;
      (o = c.parentNode) == null || o.removeChild(c), c = f;
    }
    a ? (n.style.width = l + "px", n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = l + "px");
  }
}
var Et = new Ze(
  "tableColumnResizing"
);
function o3({
  handleWidth: t = 5,
  cellMinWidth: e = 25,
  View: n = i3,
  lastColumnResizable: r = !0
} = {}) {
  const s = new Qe({
    key: Et,
    state: {
      init(i, o) {
        return s.spec.props.nodeViews[nt(o.schema).table.name] = (l, a) => new n(l, e, a), new l3(-1, !1);
      },
      apply(i, o) {
        return o.apply(i);
      }
    },
    props: {
      attributes: (i) => {
        const o = Et.getState(i);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (i, o) => {
          a3(
            i,
            o,
            t,
            e,
            r
          );
        },
        mouseleave: (i) => {
          c3(i);
        },
        mousedown: (i, o) => {
          u3(i, o, e);
        }
      },
      decorations: (i) => {
        const o = Et.getState(i);
        if (o && o.activeHandle > -1)
          return g3(i, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return s;
}
var l3 = class oi {
  constructor(e, n) {
    this.activeHandle = e, this.dragging = n;
  }
  apply(e) {
    const n = this, r = e.getMeta(Et);
    if (r && r.setHandle != null)
      return new oi(r.setHandle, !1);
    if (r && r.setDragging !== void 0)
      return new oi(n.activeHandle, r.setDragging);
    if (n.activeHandle > -1 && e.docChanged) {
      let s = e.mapping.map(n.activeHandle, -1);
      return Yl(e.doc.resolve(s)) || (s = -1), new oi(s, n.dragging);
    }
    return n;
  }
};
function a3(t, e, n, r, s) {
  const i = Et.getState(t.state);
  if (i && !i.dragging) {
    const o = f3(e.target);
    let l = -1;
    if (o) {
      const { left: a, right: c } = o.getBoundingClientRect();
      e.clientX - a <= n ? l = ud(t, e, "left", n) : c - e.clientX <= n && (l = ud(t, e, "right", n));
    }
    if (l != i.activeHandle) {
      if (!s && l !== -1) {
        const a = t.state.doc.resolve(l), c = a.node(-1), u = Oe.get(c), f = a.start(-1);
        if (u.colCount(a.pos - f) + a.nodeAfter.attrs.colspan - 1 == u.width - 1)
          return;
      }
      dp(t, l);
    }
  }
}
function c3(t) {
  const e = Et.getState(t.state);
  e && e.activeHandle > -1 && !e.dragging && dp(t, -1);
}
function u3(t, e, n) {
  const r = Et.getState(t.state);
  if (!r || r.activeHandle == -1 || r.dragging)
    return !1;
  const s = t.state.doc.nodeAt(r.activeHandle), i = d3(t, r.activeHandle, s.attrs);
  t.dispatch(
    t.state.tr.setMeta(Et, {
      setDragging: { startX: e.clientX, startWidth: i }
    })
  );
  function o(a) {
    window.removeEventListener("mouseup", o), window.removeEventListener("mousemove", l);
    const c = Et.getState(t.state);
    c?.dragging && (h3(
      t,
      c.activeHandle,
      dd(c.dragging, a, n)
    ), t.dispatch(
      t.state.tr.setMeta(Et, { setDragging: null })
    ));
  }
  function l(a) {
    if (!a.which)
      return o(a);
    const c = Et.getState(t.state);
    if (c && c.dragging) {
      const u = dd(c.dragging, a, n);
      p3(t, c.activeHandle, u, n);
    }
  }
  return window.addEventListener("mouseup", o), window.addEventListener("mousemove", l), e.preventDefault(), !0;
}
function d3(t, e, { colspan: n, colwidth: r }) {
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
function f3(t) {
  for (; t && t.nodeName != "TD" && t.nodeName != "TH"; )
    t = t.classList && t.classList.contains("ProseMirror") ? null : t.parentNode;
  return t;
}
function ud(t, e, n, r) {
  const s = n == "right" ? -r : r, i = t.posAtCoords({
    left: e.clientX + s,
    top: e.clientY
  });
  if (!i)
    return -1;
  const { pos: o } = i, l = $r(t.state.doc.resolve(o));
  if (!l)
    return -1;
  if (n == "right")
    return l.pos;
  const a = Oe.get(l.node(-1)), c = l.start(-1), u = a.map.indexOf(l.pos - c);
  return u % a.width == 0 ? -1 : c + a.map[u - 1];
}
function dd(t, e, n) {
  const r = e.clientX - t.startX;
  return Math.max(n, t.startWidth + r);
}
function dp(t, e) {
  t.dispatch(
    t.state.tr.setMeta(Et, { setHandle: e })
  );
}
function h3(t, e, n) {
  const r = t.state.doc.resolve(e), s = r.node(-1), i = Oe.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, a = t.state.tr;
  for (let c = 0; c < i.height; c++) {
    const u = c * i.width + l;
    if (c && i.map[u] == i.map[u - i.width])
      continue;
    const f = i.map[u], h = s.nodeAt(f).attrs, g = h.colspan == 1 ? 0 : l - i.colCount(f);
    if (h.colwidth && h.colwidth[g] == n)
      continue;
    const y = h.colwidth ? h.colwidth.slice() : m3(h.colspan);
    y[g] = n, a.setNodeMarkup(o + f, null, { ...h, colwidth: y });
  }
  a.docChanged && t.dispatch(a);
}
function p3(t, e, n, r) {
  const s = t.state.doc.resolve(e), i = s.node(-1), o = s.start(-1), l = Oe.get(i).colCount(s.pos - o) + s.nodeAfter.attrs.colspan - 1;
  let a = t.domAtPos(s.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; )
    a = a.parentNode;
  a && Ql(
    i,
    a.firstChild,
    a,
    r,
    l,
    n
  );
}
function m3(t) {
  return Array(t).fill(0);
}
function g3(t, e) {
  const n = [], r = t.doc.resolve(e), s = r.node(-1);
  if (!s)
    return ke.empty;
  const i = Oe.get(s), o = r.start(-1), l = i.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let a = 0; a < i.height; a++) {
    const c = l + a * i.width - 1;
    if ((l == i.width || i.map[c] != i.map[c + 1]) && (a == 0 || i.map[c] != i.map[c - i.width])) {
      const u = i.map[c], f = o + u + s.nodeAt(u).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", n.push(dt.widget(f, h));
    }
  }
  return ke.create(t.doc, n);
}
function Zt(t) {
  const e = t.selection, n = To(t), r = n.node(-1), s = n.start(-1), i = Oe.get(r);
  return { ...e instanceof ye ? i.rectBetween(
    e.$anchorCell.pos - s,
    e.$headCell.pos - s
  ) : i.findCell(n.pos - s), tableStart: s, map: i, table: r };
}
function fp(t, { map: e, tableStart: n, table: r }, s) {
  let i = s > 0 ? -1 : 0;
  Vv(e, r, s + i) && (i = s == 0 || s == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const l = o * e.width + s;
    if (s > 0 && s < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      t.setNodeMarkup(
        t.mapping.map(n + a),
        null,
        op(c.attrs, s - e.colCount(a))
      ), o += c.attrs.rowspan - 1;
    } else {
      const a = i == null ? nt(r.type.schema).cell : r.nodeAt(e.map[l + i]).type, c = e.positionAt(o, s, r);
      t.insert(t.mapping.map(n + c), a.createAndFill());
    }
  }
  return t;
}
function y3(t, e) {
  if (!Nt(t))
    return !1;
  if (e) {
    const n = Zt(t);
    e(fp(t.tr, n, n.left));
  }
  return !0;
}
function b3(t, e) {
  if (!Nt(t))
    return !1;
  if (e) {
    const n = Zt(t);
    e(fp(t.tr, n, n.right));
  }
  return !0;
}
function v3(t, { map: e, table: n, tableStart: r }, s) {
  const i = t.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const l = o * e.width + s, a = e.map[l], c = n.nodeAt(a), u = c.attrs;
    if (s > 0 && e.map[l - 1] == a || s < e.width - 1 && e.map[l + 1] == a)
      t.setNodeMarkup(
        t.mapping.slice(i).map(r + a),
        null,
        sr(u, s - e.colCount(a))
      );
    else {
      const f = t.mapping.slice(i).map(r + a);
      t.delete(f, f + c.nodeSize);
    }
    o += u.rowspan;
  }
}
function w3(t, e) {
  if (!Nt(t))
    return !1;
  if (e) {
    const n = Zt(t), r = t.tr;
    if (n.left == 0 && n.right == n.map.width)
      return !1;
    for (let s = n.right - 1; v3(r, n, s), s != n.left; s--) {
      const i = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      n.table = i, n.map = Oe.get(i);
    }
    e(r);
  }
  return !0;
}
function x3(t, e, n) {
  var r;
  const s = nt(e.type.schema).header_cell;
  for (let i = 0; i < t.width; i++)
    if (((r = e.nodeAt(t.map[i + n * t.width])) == null ? void 0 : r.type) != s)
      return !1;
  return !0;
}
function hp(t, { map: e, tableStart: n, table: r }, s) {
  var i;
  let o = n;
  for (let c = 0; c < s; c++)
    o += r.child(c).nodeSize;
  const l = [];
  let a = s > 0 ? -1 : 0;
  x3(e, r, s + a) && (a = s == 0 || s == e.height ? null : 0);
  for (let c = 0, u = e.width * s; c < e.width; c++, u++)
    if (s > 0 && s < e.height && e.map[u] == e.map[u - e.width]) {
      const f = e.map[u], h = r.nodeAt(f).attrs;
      t.setNodeMarkup(n + f, null, {
        ...h,
        rowspan: h.rowspan + 1
      }), c += h.colspan - 1;
    } else {
      const f = a == null ? nt(r.type.schema).cell : (i = r.nodeAt(e.map[u + a * e.width])) == null ? void 0 : i.type, h = f?.createAndFill();
      h && l.push(h);
    }
  return t.insert(o, nt(r.type.schema).row.create(null, l)), t;
}
function _3(t, e) {
  if (!Nt(t))
    return !1;
  if (e) {
    const n = Zt(t);
    e(hp(t.tr, n, n.top));
  }
  return !0;
}
function k3(t, e) {
  if (!Nt(t))
    return !1;
  if (e) {
    const n = Zt(t);
    e(hp(t.tr, n, n.bottom));
  }
  return !0;
}
function S3(t, { map: e, table: n, tableStart: r }, s) {
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
        const h = n.nodeAt(f), g = h.attrs, y = h.type.create(
          { ...g, rowspan: h.attrs.rowspan - 1 },
          h.content
        ), v = e.positionAt(s + 1, c, n);
        t.insert(t.mapping.slice(l).map(r + v), y), c += g.colspan - 1;
      }
    }
  }
}
function C3(t, e) {
  if (!Nt(t))
    return !1;
  if (e) {
    const n = Zt(t), r = t.tr;
    if (n.top == 0 && n.bottom == n.map.height)
      return !1;
    for (let s = n.bottom - 1; S3(r, n, s), s != n.top; s--) {
      const i = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!i)
        throw RangeError("No table found");
      n.table = i, n.map = Oe.get(n.table);
    }
    e(r);
  }
  return !0;
}
function fd(t) {
  const e = t.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function E3({ width: t, height: e, map: n }, r) {
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
function hd(t, e) {
  const n = t.selection;
  if (!(n instanceof ye) || n.$anchorCell.pos == n.$headCell.pos)
    return !1;
  const r = Zt(t), { map: s } = r;
  if (E3(s, r))
    return !1;
  if (e) {
    const i = t.tr, o = {};
    let l = H.empty, a, c;
    for (let u = r.top; u < r.bottom; u++)
      for (let f = r.left; f < r.right; f++) {
        const h = s.map[u * s.width + f], g = r.table.nodeAt(h);
        if (!(o[h] || !g))
          if (o[h] = !0, a == null)
            a = h, c = g;
          else {
            fd(g) || (l = l.append(g.content));
            const y = i.mapping.map(h + r.tableStart);
            i.delete(y, y + g.nodeSize);
          }
      }
    if (a == null || c == null)
      return !0;
    if (i.setNodeMarkup(a + r.tableStart, null, {
      ...op(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), l.size) {
      const u = a + 1 + c.content.size, f = fd(c) ? a + 1 : u;
      i.replaceWith(f + r.tableStart, u + r.tableStart, l);
    }
    i.setSelection(
      new ye(i.doc.resolve(a + r.tableStart))
    ), e(i);
  }
  return !0;
}
function pd(t, e) {
  const n = nt(t.schema);
  return M3(({ node: r }) => n[r.type.spec.tableRole])(t, e);
}
function M3(t) {
  return (e, n) => {
    var r;
    const s = e.selection;
    let i, o;
    if (s instanceof ye) {
      if (s.$anchorCell.pos != s.$headCell.pos)
        return !1;
      i = s.$anchorCell.nodeAfter, o = s.$anchorCell.pos;
    } else {
      if (i = Bv(s.$from), !i)
        return !1;
      o = (r = $r(s.$from)) == null ? void 0 : r.pos;
    }
    if (i == null || o == null || i.attrs.colspan == 1 && i.attrs.rowspan == 1)
      return !1;
    if (n) {
      let l = i.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = { ...l, rowspan: 1 }), l.colspan > 1 && (l = { ...l, colspan: 1 });
      const u = Zt(e), f = e.tr;
      for (let g = 0; g < u.right - u.left; g++)
        a.push(
          c ? {
            ...l,
            colwidth: c && c[g] ? [c[g]] : null
          } : l
        );
      let h;
      for (let g = u.top; g < u.bottom; g++) {
        let y = u.map.positionAt(g, u.left, u.table);
        g == u.top && (y += i.nodeSize);
        for (let v = u.left, k = 0; v < u.right; v++, k++)
          v == u.left && g == u.top || f.insert(
            h = f.mapping.map(y + u.tableStart, 1),
            t({ node: i, row: g, col: v }).createAndFill(a[k])
          );
      }
      f.setNodeMarkup(
        o,
        t({ node: i, row: u.top, col: u.left }),
        a[0]
      ), s instanceof ye && f.setSelection(
        new ye(
          f.doc.resolve(s.$anchorCell.pos),
          h ? f.doc.resolve(h) : void 0
        )
      ), n(f);
    }
    return !0;
  };
}
function A3(t, e) {
  return function(n, r) {
    if (!Nt(n))
      return !1;
    const s = To(n);
    if (s.nodeAfter.attrs[t] === e)
      return !1;
    if (r) {
      const i = n.tr;
      n.selection instanceof ye ? n.selection.forEachCell((o, l) => {
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
function T3(t) {
  return function(e, n) {
    if (!Nt(e))
      return !1;
    if (n) {
      const r = nt(e.schema), s = Zt(e), i = e.tr, o = s.map.cellsInRect(
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
function md(t, e, n) {
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
function vs(t, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? T3(t) : function(n, r) {
    if (!Nt(n))
      return !1;
    if (r) {
      const s = nt(n.schema), i = Zt(n), o = n.tr, l = md("row", i, s), a = md(
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
      i.map.cellsInRect(f).forEach((g) => {
        const y = g + i.tableStart, v = o.doc.nodeAt(y);
        v && o.setNodeMarkup(y, h, v.attrs);
      }), r(o);
    }
    return !0;
  };
}
vs("row", {
  useDeprecatedLogic: !0
});
vs("column", {
  useDeprecatedLogic: !0
});
var j3 = vs("cell", {
  useDeprecatedLogic: !0
});
function O3(t, e) {
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
function gd(t) {
  return function(e, n) {
    if (!Nt(e))
      return !1;
    const r = O3(To(e), t);
    if (r == null)
      return !1;
    if (n) {
      const s = e.doc.resolve(r);
      n(
        e.tr.setSelection(te.between(s, Fv(s))).scrollIntoView()
      );
    }
    return !0;
  };
}
function R3(t, e) {
  const n = t.selection.$anchor;
  for (let r = n.depth; r > 0; r--)
    if (n.node(r).type.spec.tableRole == "table")
      return e && e(
        t.tr.delete(n.before(r), n.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function L3({
  allowTableNodeSelection: t = !1
} = {}) {
  return new Qe({
    key: xn,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, n) {
        const r = e.getMeta(xn);
        if (r != null)
          return r == -1 ? null : r;
        if (n == null || !e.docChanged)
          return n;
        const { deleted: s, pos: i } = e.mapping.mapResult(n);
        return s ? null : i;
      }
    },
    props: {
      decorations: Kv,
      handleDOMEvents: {
        mousedown: s3
      },
      createSelectionBetween(e) {
        return xn.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: n3,
      handleKeyDown: t3,
      handlePaste: r3
    },
    appendTransaction(e, n, r) {
      return Gv(
        r,
        cp(r, n),
        t
      );
    }
  });
}
function yd(t, e, n, r, s, i) {
  let o = 0, l = !0, a = e.firstChild;
  const c = t.firstChild;
  for (let u = 0, f = 0; u < c.childCount; u += 1) {
    const { colspan: h, colwidth: g } = c.child(u).attrs;
    for (let y = 0; y < h; y += 1, f += 1) {
      const v = s === f ? i : g && g[y], k = v ? `${v}px` : "";
      o += v || r, v || (l = !1), a ? (a.style.width !== k && (a.style.width = k), a = a.nextSibling) : e.appendChild(document.createElement("col")).style.width = k;
    }
  }
  for (; a; ) {
    const u = a.nextSibling;
    a.parentNode.removeChild(a), a = u;
  }
  l ? (n.style.width = `${o}px`, n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = `${o}px`);
}
class P3 {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), yd(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, yd(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function I3(t, e, n, r) {
  let s = 0, i = !0;
  const o = [], l = t.firstChild;
  if (!l)
    return {};
  for (let f = 0, h = 0; f < l.childCount; f += 1) {
    const { colspan: g, colwidth: y } = l.child(f).attrs;
    for (let v = 0; v < g; v += 1, h += 1) {
      const k = n === h ? r : y && y[v], E = k ? `${k}px` : "";
      s += k || e, k || (i = !1), o.push(["col", E ? { style: `width: ${E}` } : {}]);
    }
  }
  const a = i ? `${s}px` : "", c = i ? "" : `${s}px`;
  return { colgroup: ["colgroup", {}, ...o], tableWidth: a, tableMinWidth: c };
}
function bd(t, e) {
  return e ? t.createChecked(null, e) : t.createAndFill();
}
function N3(t) {
  if (t.cached.tableNodeTypes)
    return t.cached.tableNodeTypes;
  const e = {};
  return Object.keys(t.nodes).forEach((n) => {
    const r = t.nodes[n];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), t.cached.tableNodeTypes = e, e;
}
function z3(t, e, n, r, s) {
  const i = N3(t), o = [], l = [];
  for (let c = 0; c < n; c += 1) {
    const u = bd(i.cell, s);
    if (u && l.push(u), r) {
      const f = bd(i.header_cell, s);
      f && o.push(f);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(i.row.createChecked(null, r && c === 0 ? o : l));
  return i.table.createChecked(null, a);
}
function $3(t) {
  return t instanceof ye;
}
const Ws = ({ editor: t }) => {
  const { selection: e } = t.state;
  if (!$3(e))
    return !1;
  let n = 0;
  const r = Zh(e.ranges[0].$from, (i) => i.type.name === "table");
  return r?.node.descendants((i) => {
    if (i.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(i.type.name) && (n += 1);
  }), n === e.ranges.length ? (t.commands.deleteTable(), !0) : !1;
};
Ee.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: P3,
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
    const { colgroup: n, tableWidth: r, tableMinWidth: s } = I3(t, this.options.cellMinWidth);
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
        const o = z3(i.schema, t, e, n);
        if (s) {
          const l = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(te.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: t, dispatch: e }) => y3(t, e),
      addColumnAfter: () => ({ state: t, dispatch: e }) => b3(t, e),
      deleteColumn: () => ({ state: t, dispatch: e }) => w3(t, e),
      addRowBefore: () => ({ state: t, dispatch: e }) => _3(t, e),
      addRowAfter: () => ({ state: t, dispatch: e }) => k3(t, e),
      deleteRow: () => ({ state: t, dispatch: e }) => C3(t, e),
      deleteTable: () => ({ state: t, dispatch: e }) => R3(t, e),
      mergeCells: () => ({ state: t, dispatch: e }) => hd(t, e),
      splitCell: () => ({ state: t, dispatch: e }) => pd(t, e),
      toggleHeaderColumn: () => ({ state: t, dispatch: e }) => vs("column")(t, e),
      toggleHeaderRow: () => ({ state: t, dispatch: e }) => vs("row")(t, e),
      toggleHeaderCell: () => ({ state: t, dispatch: e }) => j3(t, e),
      mergeOrSplit: () => ({ state: t, dispatch: e }) => hd(t, e) ? !0 : pd(t, e),
      setCellAttribute: (t, e) => ({ state: n, dispatch: r }) => A3(t, e)(n, r),
      goToNextCell: () => ({ state: t, dispatch: e }) => gd(1)(t, e),
      goToPreviousCell: () => ({ state: t, dispatch: e }) => gd(-1)(t, e),
      fixTables: () => ({ state: t, dispatch: e }) => (e && cp(t), !0),
      setCellSelection: (t) => ({ tr: e, dispatch: n }) => {
        if (n) {
          const r = ye.create(e.doc, t.anchorCell, t.headCell);
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
      Backspace: Ws,
      "Mod-Backspace": Ws,
      Delete: Ws,
      "Mod-Delete": Ws
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        o3({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      L3({
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
      tableRole: Se(Ie(t, "tableRole", e))
    };
  }
});
Ee.create({
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
Ee.create({
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
Ee.create({
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
const vd = (t) => new Promise((e) => {
  let n = new FileReader();
  n.onloadend = () => {
    e(n.result);
  }, n.readAsDataURL(t);
}), D3 = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
Ee.create({
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
      ep({
        find: D3,
        type: this.type,
        getAttributes: (t) => {
          const [, , e, n, r] = t;
          return { src: n, alt: e, title: r };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    return [B3()];
  }
});
const B3 = () => new Qe({
  props: {
    handlePaste(t, e, n) {
      const r = Array.from(e.clipboardData?.items || []), { schema: s } = t.state;
      return r.forEach((i) => {
        const o = i.getAsFile();
        o && i.type.indexOf("image") === 0 && (e.preventDefault(), vd(o).then((l) => {
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
          vd(o).then((l) => {
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
Ee.create({
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
const H3 = "aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster6d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", F3 = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Pr = (t, e) => {
  for (const n in e)
    t[n] = e[n];
  return t;
}, Zl = "numeric", ea = "ascii", ta = "alpha", li = "asciinumeric", Ks = "alphanumeric", na = "domain", pp = "emoji", V3 = "scheme", W3 = "slashscheme", wd = "whitespace";
function K3(t, e) {
  return t in e || (e[t] = []), e[t];
}
function Xn(t, e, n) {
  e[Zl] && (e[li] = !0, e[Ks] = !0), e[ea] && (e[li] = !0, e[ta] = !0), e[li] && (e[Ks] = !0), e[ta] && (e[Ks] = !0), e[Ks] && (e[na] = !0), e[pp] && (e[na] = !0);
  for (const r in e) {
    const s = K3(r, n);
    s.indexOf(t) < 0 && s.push(t);
  }
}
function U3(t, e) {
  const n = {};
  for (const r in e)
    e[r].indexOf(t) >= 0 && (n[r] = !0);
  return n;
}
function ut(t) {
  t === void 0 && (t = null), this.j = {}, this.jr = [], this.jd = null, this.t = t;
}
ut.groups = {};
ut.prototype = {
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
    r = r || ut.groups;
    let s;
    return e && e.j ? s = e : (s = new ut(e), n && r && Xn(e, n, r)), this.jr.push([t, s]), s;
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
    r = r || ut.groups;
    const s = this;
    if (e && e.j)
      return s.j[t] = e, e;
    const i = e;
    let o, l = s.go(t);
    if (l ? (o = new ut(), Pr(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new ut(), i) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = Pr(U3(o.t, r), n);
          Xn(i, a, r);
        } else
          n && Xn(i, n, r);
      o.t = i;
    }
    return s.j[t] = o, o;
  }
};
const le = (t, e, n, r, s) => t.ta(e, n, r, s), _t = (t, e, n, r, s) => t.tr(e, n, r, s), xd = (t, e, n, r, s) => t.ts(e, n, r, s), W = (t, e, n, r, s) => t.tt(e, n, r, s), tn = "WORD", ra = "UWORD", ws = "LOCALHOST", sa = "TLD", ia = "UTLD", ai = "SCHEME", gr = "SLASH_SCHEME", hc = "NUM", mp = "WS", pc = "NL", ls = "OPENBRACE", as = "CLOSEBRACE", Ti = "OPENBRACKET", ji = "CLOSEBRACKET", Oi = "OPENPAREN", Ri = "CLOSEPAREN", Li = "OPENANGLEBRACKET", Pi = "CLOSEANGLEBRACKET", Ii = "FULLWIDTHLEFTPAREN", Ni = "FULLWIDTHRIGHTPAREN", zi = "LEFTCORNERBRACKET", $i = "RIGHTCORNERBRACKET", Di = "LEFTWHITECORNERBRACKET", Bi = "RIGHTWHITECORNERBRACKET", Hi = "FULLWIDTHLESSTHAN", Fi = "FULLWIDTHGREATERTHAN", Vi = "AMPERSAND", Wi = "APOSTROPHE", Ki = "ASTERISK", wn = "AT", Ui = "BACKSLASH", qi = "BACKTICK", Gi = "CARET", _n = "COLON", mc = "COMMA", Ji = "DOLLAR", Ht = "DOT", Yi = "EQUALS", gc = "EXCLAMATION", Ft = "HYPHEN", Xi = "PERCENT", Qi = "PIPE", Zi = "PLUS", eo = "POUND", to = "QUERY", yc = "QUOTE", bc = "SEMI", Vt = "SLASH", cs = "TILDE", no = "UNDERSCORE", gp = "EMOJI", ro = "SYM";
var yp = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: tn,
  UWORD: ra,
  LOCALHOST: ws,
  TLD: sa,
  UTLD: ia,
  SCHEME: ai,
  SLASH_SCHEME: gr,
  NUM: hc,
  WS: mp,
  NL: pc,
  OPENBRACE: ls,
  CLOSEBRACE: as,
  OPENBRACKET: Ti,
  CLOSEBRACKET: ji,
  OPENPAREN: Oi,
  CLOSEPAREN: Ri,
  OPENANGLEBRACKET: Li,
  CLOSEANGLEBRACKET: Pi,
  FULLWIDTHLEFTPAREN: Ii,
  FULLWIDTHRIGHTPAREN: Ni,
  LEFTCORNERBRACKET: zi,
  RIGHTCORNERBRACKET: $i,
  LEFTWHITECORNERBRACKET: Di,
  RIGHTWHITECORNERBRACKET: Bi,
  FULLWIDTHLESSTHAN: Hi,
  FULLWIDTHGREATERTHAN: Fi,
  AMPERSAND: Vi,
  APOSTROPHE: Wi,
  ASTERISK: Ki,
  AT: wn,
  BACKSLASH: Ui,
  BACKTICK: qi,
  CARET: Gi,
  COLON: _n,
  COMMA: mc,
  DOLLAR: Ji,
  DOT: Ht,
  EQUALS: Yi,
  EXCLAMATION: gc,
  HYPHEN: Ft,
  PERCENT: Xi,
  PIPE: Qi,
  PLUS: Zi,
  POUND: eo,
  QUERY: to,
  QUOTE: yc,
  SEMI: bc,
  SLASH: Vt,
  TILDE: cs,
  UNDERSCORE: no,
  EMOJI: gp,
  SYM: ro
});
const fr = /[a-z]/, ll = /\p{L}/u, al = /\p{Emoji}/u, cl = /\d/, _d = /\s/, kd = `
`, q3 = "️", G3 = "‍";
let Us = null, qs = null;
function J3(t) {
  t === void 0 && (t = []);
  const e = {};
  ut.groups = e;
  const n = new ut();
  Us == null && (Us = Sd(H3)), qs == null && (qs = Sd(F3)), W(n, "'", Wi), W(n, "{", ls), W(n, "}", as), W(n, "[", Ti), W(n, "]", ji), W(n, "(", Oi), W(n, ")", Ri), W(n, "<", Li), W(n, ">", Pi), W(n, "（", Ii), W(n, "）", Ni), W(n, "「", zi), W(n, "」", $i), W(n, "『", Di), W(n, "』", Bi), W(n, "＜", Hi), W(n, "＞", Fi), W(n, "&", Vi), W(n, "*", Ki), W(n, "@", wn), W(n, "`", qi), W(n, "^", Gi), W(n, ":", _n), W(n, ",", mc), W(n, "$", Ji), W(n, ".", Ht), W(n, "=", Yi), W(n, "!", gc), W(n, "-", Ft), W(n, "%", Xi), W(n, "|", Qi), W(n, "+", Zi), W(n, "#", eo), W(n, "?", to), W(n, '"', yc), W(n, "/", Vt), W(n, ";", bc), W(n, "~", cs), W(n, "_", no), W(n, "\\", Ui);
  const r = _t(n, cl, hc, {
    [Zl]: !0
  });
  _t(r, cl, r);
  const s = _t(n, fr, tn, {
    [ea]: !0
  });
  _t(s, fr, s);
  const i = _t(n, ll, ra, {
    [ta]: !0
  });
  _t(i, fr), _t(i, ll, i);
  const o = _t(n, _d, mp, {
    [wd]: !0
  });
  W(n, kd, pc, {
    [wd]: !0
  }), W(o, kd), _t(o, _d, o);
  const l = _t(n, al, gp, {
    [pp]: !0
  });
  _t(l, al, l), W(l, q3, l);
  const a = W(l, G3);
  _t(a, al, l);
  const c = [[fr, s]], u = [[fr, null], [ll, i]];
  for (let f = 0; f < Us.length; f++)
    un(n, Us[f], sa, tn, c);
  for (let f = 0; f < qs.length; f++)
    un(n, qs[f], ia, ra, u);
  Xn(sa, {
    tld: !0,
    ascii: !0
  }, e), Xn(ia, {
    utld: !0,
    alpha: !0
  }, e), un(n, "file", ai, tn, c), un(n, "mailto", ai, tn, c), un(n, "http", gr, tn, c), un(n, "https", gr, tn, c), un(n, "ftp", gr, tn, c), un(n, "ftps", gr, tn, c), Xn(ai, {
    scheme: !0,
    ascii: !0
  }, e), Xn(gr, {
    slashscheme: !0,
    ascii: !0
  }, e), t = t.sort((f, h) => f[0] > h[0] ? 1 : -1);
  for (let f = 0; f < t.length; f++) {
    const h = t[f][0], y = t[f][1] ? {
      [V3]: !0
    } : {
      [W3]: !0
    };
    h.indexOf("-") >= 0 ? y[na] = !0 : fr.test(h) ? cl.test(h) ? y[li] = !0 : y[ea] = !0 : y[Zl] = !0, xd(n, h, h, y);
  }
  return xd(n, "localhost", ws, {
    ascii: !0
  }), n.jd = new ut(ro), {
    start: n,
    tokens: Pr({
      groups: e
    }, yp)
  };
}
function Y3(t, e) {
  const n = X3(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = n.length, s = [];
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
function X3(t) {
  const e = [], n = t.length;
  let r = 0;
  for (; r < n; ) {
    let s = t.charCodeAt(r), i, o = s < 55296 || s > 56319 || r + 1 === n || (i = t.charCodeAt(r + 1)) < 56320 || i > 57343 ? t[r] : t.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function un(t, e, n, r, s) {
  let i;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    t.j[a] ? i = t.j[a] : (i = new ut(r), i.jr = s.slice(), t.j[a] = i), t = i;
  }
  return i = new ut(n), i.jr = s.slice(), t.j[e[o - 1]] = i, i;
}
function Sd(t) {
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
const xs = {
  defaultProtocol: "http",
  events: null,
  format: Cd,
  formatHref: Cd,
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
function vc(t, e) {
  e === void 0 && (e = null);
  let n = Pr({}, xs);
  t && (n = Pr(n, t instanceof vc ? t.o : t));
  const r = n.ignoreTags, s = [];
  for (let i = 0; i < r.length; i++)
    s.push(r[i].toUpperCase());
  this.o = n, e && (this.defaultRender = e), this.ignoreTags = s;
}
vc.prototype = {
  o: xs,
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
    return s && (typeof s == "object" ? (s = n.t in s ? s[n.t] : xs[t], typeof s == "function" && r && (s = s(e, n))) : typeof s == "function" && r && (s = s(e, n.t, n)), s);
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
function Cd(t) {
  return t;
}
function bp(t, e) {
  this.t = "token", this.v = t, this.tk = e;
}
bp.prototype = {
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
    return t === void 0 && (t = xs.defaultProtocol), {
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
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), u && Pr(o, u), {
      tagName: s,
      attributes: o,
      content: i,
      eventListeners: f
    };
  }
};
function jo(t, e) {
  class n extends bp {
    constructor(s, i) {
      super(s, i), this.t = t;
    }
  }
  for (const r in e)
    n.prototype[r] = e[r];
  return n.t = t, n;
}
const Ed = jo("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), Md = jo("text"), Q3 = jo("nl"), Gs = jo("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(t) {
    return t === void 0 && (t = xs.defaultProtocol), this.hasProtocol() ? this.v : `${t}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const t = this.tk;
    return t.length >= 2 && t[0].t !== ws && t[1].t === _n;
  }
}), kt = (t) => new ut(t);
function Z3(t) {
  let {
    groups: e
  } = t;
  const n = e.domain.concat([Vi, Ki, wn, Ui, qi, Gi, Ji, Yi, Ft, hc, Xi, Qi, Zi, eo, Vt, ro, cs, no]), r = [Wi, _n, mc, Ht, gc, to, yc, bc, Li, Pi, ls, as, ji, Ti, Oi, Ri, Ii, Ni, zi, $i, Di, Bi, Hi, Fi], s = [Vi, Wi, Ki, Ui, qi, Gi, Ji, Yi, Ft, ls, as, Xi, Qi, Zi, eo, to, Vt, ro, cs, no], i = kt(), o = W(i, cs);
  le(o, s, o), le(o, e.domain, o);
  const l = kt(), a = kt(), c = kt();
  le(i, e.domain, l), le(i, e.scheme, a), le(i, e.slashscheme, c), le(l, s, o), le(l, e.domain, l);
  const u = W(l, wn);
  W(o, wn, u), W(a, wn, u), W(c, wn, u);
  const f = W(o, Ht);
  le(f, s, o), le(f, e.domain, o);
  const h = kt();
  le(u, e.domain, h), le(h, e.domain, h);
  const g = W(h, Ht);
  le(g, e.domain, h);
  const y = kt(Ed);
  le(g, e.tld, y), le(g, e.utld, y), W(u, ws, y);
  const v = W(h, Ft);
  le(v, e.domain, h), le(y, e.domain, h), W(y, Ht, g), W(y, Ft, v);
  const k = W(y, _n);
  le(k, e.numeric, Ed);
  const E = W(l, Ft), T = W(l, Ht);
  le(E, e.domain, l), le(T, s, o), le(T, e.domain, l);
  const j = kt(Gs);
  le(T, e.tld, j), le(T, e.utld, j), le(j, e.domain, l), le(j, s, o), W(j, Ht, T), W(j, Ft, E), W(j, wn, u);
  const d = W(j, _n), m = kt(Gs);
  le(d, e.numeric, m);
  const p = kt(Gs), b = kt();
  le(p, n, p), le(p, r, b), le(b, n, p), le(b, r, b), W(j, Vt, p), W(m, Vt, p);
  const w = W(a, _n), _ = W(c, _n), x = W(_, Vt), M = W(x, Vt);
  le(a, e.domain, l), W(a, Ht, T), W(a, Ft, E), le(c, e.domain, l), W(c, Ht, T), W(c, Ft, E), le(w, e.domain, p), W(w, Vt, p), le(M, e.domain, p), le(M, n, p), W(M, Vt, p);
  const O = [
    [ls, as],
    // {}
    [Ti, ji],
    // []
    [Oi, Ri],
    // ()
    [Li, Pi],
    // <>
    [Ii, Ni],
    // （）
    [zi, $i],
    // 「」
    [Di, Bi],
    // 『』
    [Hi, Fi]
    // ＜＞
  ];
  for (let L = 0; L < O.length; L++) {
    const [I, z] = O[L], S = W(p, I);
    W(b, I, S), W(S, z, p);
    const R = kt(Gs);
    le(S, n, R);
    const N = kt();
    le(S, r), le(R, n, R), le(R, r, N), le(N, n, R), le(N, r, N), W(R, z, p), W(N, z, p);
  }
  return W(i, ws, j), W(i, pc, Q3), {
    start: i,
    tokens: yp
  };
}
function ew(t, e, n) {
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
      o.length > 0 && (i.push(ul(Md, e, o)), o = []), s -= h, u -= h;
      const g = f.t, y = n.slice(s - u, s);
      i.push(ul(g, e, y));
    }
  }
  return o.length > 0 && i.push(ul(Md, e, o)), i;
}
function ul(t, e, n) {
  const r = n[0].s, s = n[n.length - 1].e, i = e.slice(r, s);
  return new t(i, n);
}
const tw = typeof console < "u" && console && console.warn || (() => {
}), nw = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", _e = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function rw() {
  ut.groups = {}, _e.scanner = null, _e.parser = null, _e.tokenQueue = [], _e.pluginQueue = [], _e.customSchemes = [], _e.initialized = !1;
}
function Ad(t, e) {
  if (e === void 0 && (e = !1), _e.initialized && tw(`linkifyjs: already initialized - will not register custom scheme "${t}" ${nw}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(t))
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  _e.customSchemes.push([t, e]);
}
function sw() {
  _e.scanner = J3(_e.customSchemes);
  for (let t = 0; t < _e.tokenQueue.length; t++)
    _e.tokenQueue[t][1]({
      scanner: _e.scanner
    });
  _e.parser = Z3(_e.scanner.tokens);
  for (let t = 0; t < _e.pluginQueue.length; t++)
    _e.pluginQueue[t][1]({
      scanner: _e.scanner,
      parser: _e.parser
    });
  _e.initialized = !0;
}
function iw(t) {
  return _e.initialized || sw(), ew(_e.parser.start, t, Y3(_e.scanner.start, t));
}
function wc(t, e, n) {
  if (e === void 0 && (e = null), n === void 0 && (n = null), e && typeof e == "object") {
    if (n)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    n = e, e = null;
  }
  const r = new vc(n), s = iw(t), i = [];
  for (let o = 0; o < s.length; o++) {
    const l = s[o];
    l.isLink && (!e || l.t === e) && r.check(l) && i.push(l.toFormattedObject(r));
  }
  return i;
}
function ow(t) {
  return new Qe({
    key: new Ze("autolink"),
    appendTransaction: (e, n, r) => {
      const s = e.some((c) => c.docChanged) && !n.doc.eq(r.doc), i = e.some((c) => c.getMeta("preventAutolink"));
      if (!s || i)
        return;
      const { tr: o } = r, l = ab(n.doc, [...e]);
      if (mb(l).forEach(({ newRange: c }) => {
        const u = ub(r.doc, c, (g) => g.isTextblock);
        let f, h;
        if (u.length > 1 ? (f = u[0], h = r.doc.textBetween(f.pos, f.pos + f.node.nodeSize, void 0, " ")) : u.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (f = u[0], h = r.doc.textBetween(f.pos, c.to, void 0, " ")), f && h) {
          const g = h.split(" ").filter((k) => k !== "");
          if (g.length <= 0)
            return !1;
          const y = g[g.length - 1], v = f.pos + h.lastIndexOf(y);
          if (!y)
            return !1;
          wc(y).filter((k) => k.isLink).map((k) => ({
            ...k,
            from: v + k.start + 1,
            to: v + k.end + 1
          })).filter((k) => r.schema.marks.code ? !r.doc.rangeHasMark(k.from, k.to, r.schema.marks.code) : !0).filter((k) => t.validate ? t.validate(k.value) : !0).forEach((k) => {
            uc(k.from, k.to, r.doc).some((E) => E.mark.type === t.type) || o.addMark(k.from, k.to, t.type.create({
              href: k.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function lw(t) {
  return new Qe({
    key: new Ze("handleClickLink"),
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
        const a = fb(e.state, t.type.name), c = r.target, u = (s = c?.href) !== null && s !== void 0 ? s : a.href, f = (i = c?.target) !== null && i !== void 0 ? i : a.target;
        return c && u ? (window.open(u, f), !0) : !1;
      }
    }
  });
}
function aw(t) {
  return new Qe({
    key: new Ze("handlePasteLink"),
    props: {
      handlePaste: (e, n, r) => {
        const { state: s } = e, { selection: i } = s, { empty: o } = i;
        if (o)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = wc(l).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : (t.editor.commands.setMark(t.type, {
          href: a.href
        }), !0);
      }
    }
  });
}
Tt.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((t) => {
      if (typeof t == "string") {
        Ad(t);
        return;
      }
      Ad(t.scheme, t.optionalSlashes);
    });
  },
  onDestroy() {
    rw();
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
      Rn({
        find: (t) => {
          const e = [];
          if (t) {
            const n = wc(t).filter((r) => r.isLink);
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
    return this.options.autolink && t.push(ow({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && t.push(lw({
      type: this.type
    })), this.options.linkOnPaste && t.push(aw({
      editor: this.editor,
      type: this.type
    })), t;
  }
});
const cw = (t) => Re({
  find: /--$/,
  replace: t ?? "—"
}), uw = (t) => Re({
  find: /\.\.\.$/,
  replace: t ?? "…"
}), dw = (t) => Re({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(")$/,
  replace: t ?? "“"
}), fw = (t) => Re({
  find: /"$/,
  replace: t ?? "”"
}), hw = (t) => Re({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(')$/,
  replace: t ?? "‘"
}), pw = (t) => Re({
  find: /'$/,
  replace: t ?? "’"
}), mw = (t) => Re({
  find: /<-$/,
  replace: t ?? "←"
}), gw = (t) => Re({
  find: /->$/,
  replace: t ?? "→"
}), yw = (t) => Re({
  find: /\(c\)$/,
  replace: t ?? "©"
}), bw = (t) => Re({
  find: /\(tm\)$/,
  replace: t ?? "™"
}), vw = (t) => Re({
  find: /\(sm\)$/,
  replace: t ?? "℠"
}), ww = (t) => Re({
  find: /\(r\)$/,
  replace: t ?? "®"
}), xw = (t) => Re({
  find: /(?:^|\s)(1\/2)\s$/,
  replace: t ?? "½"
}), _w = (t) => Re({
  find: /\+\/-$/,
  replace: t ?? "±"
}), kw = (t) => Re({
  find: /!=$/,
  replace: t ?? "≠"
}), Sw = (t) => Re({
  find: /<<$/,
  replace: t ?? "«"
}), Cw = (t) => Re({
  find: />>$/,
  replace: t ?? "»"
}), Ew = (t) => Re({
  find: /\d+\s?([*x])\s?\d+$/,
  replace: t ?? "×"
}), Mw = (t) => Re({
  find: /\^2$/,
  replace: t ?? "²"
}), Aw = (t) => Re({
  find: /\^3$/,
  replace: t ?? "³"
}), Tw = (t) => Re({
  find: /(?:^|\s)(1\/4)\s$/,
  replace: t ?? "¼"
}), jw = (t) => Re({
  find: /(?:^|\s)(3\/4)\s$/,
  replace: t ?? "¾"
});
Xe.create({
  name: "typography",
  addInputRules() {
    const t = [];
    return this.options.emDash !== !1 && t.push(cw(this.options.emDash)), this.options.ellipsis !== !1 && t.push(uw(this.options.ellipsis)), this.options.openDoubleQuote !== !1 && t.push(dw(this.options.openDoubleQuote)), this.options.closeDoubleQuote !== !1 && t.push(fw(this.options.closeDoubleQuote)), this.options.openSingleQuote !== !1 && t.push(hw(this.options.openSingleQuote)), this.options.closeSingleQuote !== !1 && t.push(pw(this.options.closeSingleQuote)), this.options.leftArrow !== !1 && t.push(mw(this.options.leftArrow)), this.options.rightArrow !== !1 && t.push(gw(this.options.rightArrow)), this.options.copyright !== !1 && t.push(yw(this.options.copyright)), this.options.trademark !== !1 && t.push(bw(this.options.trademark)), this.options.servicemark !== !1 && t.push(vw(this.options.servicemark)), this.options.registeredTrademark !== !1 && t.push(ww(this.options.registeredTrademark)), this.options.oneHalf !== !1 && t.push(xw(this.options.oneHalf)), this.options.plusMinus !== !1 && t.push(_w(this.options.plusMinus)), this.options.notEqual !== !1 && t.push(kw(this.options.notEqual)), this.options.laquo !== !1 && t.push(Sw(this.options.laquo)), this.options.raquo !== !1 && t.push(Cw(this.options.raquo)), this.options.multiplication !== !1 && t.push(Ew(this.options.multiplication)), this.options.superscriptTwo !== !1 && t.push(Mw(this.options.superscriptTwo)), this.options.superscriptThree !== !1 && t.push(Aw(this.options.superscriptThree)), this.options.oneQuarter !== !1 && t.push(Tw(this.options.oneQuarter)), this.options.threeQuarters !== !1 && t.push(jw(this.options.threeQuarters)), t;
  }
});
Tt.create({
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
        const n = Ms(t, this.type);
        return Object.entries(n).some(([, s]) => !!s) ? !0 : e.unsetMark(this.name);
      }
    };
  }
});
const Ow = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/, Rw = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;
Tt.create({
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
      rr({
        find: Ow,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Rn({
        find: Rw,
        type: this.type
      })
    ];
  }
});
Xe.create({
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
function Lw(t) {
  var e;
  const { char: n, allowSpaces: r, allowedPrefixes: s, startOfLine: i, $position: o } = t, l = zb(n), a = new RegExp(`\\s${l}$`), c = i ? "^" : "", u = r ? new RegExp(`${c}${l}.*?(?=\\s${l}|$)`, "gm") : new RegExp(`${c}(?:^)?${l}[^\\s${l}]*`, "gm"), f = ((e = o.nodeBefore) === null || e === void 0 ? void 0 : e.isText) && o.nodeBefore.text;
  if (!f)
    return null;
  const h = o.pos - f.length, g = Array.from(f.matchAll(u)).pop();
  if (!g || g.input === void 0 || g.index === void 0)
    return null;
  const y = g.input.slice(Math.max(0, g.index - 1), g.index), v = new RegExp(`^[${s?.join("")}\0]?$`).test(y);
  if (s !== null && !v)
    return null;
  const k = h + g.index;
  let E = k + g[0].length;
  return r && a.test(f.slice(E - 1, E + 1)) && (g[0] += " ", E += 1), k < o.pos && E >= o.pos ? {
    range: {
      from: k,
      to: E
    },
    query: g[0].slice(n.length),
    text: g[0]
  } : null;
}
const Pw = new Ze("suggestion");
function Iw({ pluginKey: t = Pw, editor: e, char: n = "@", allowSpaces: r = !1, allowedPrefixes: s = [" "], startOfLine: i = !1, decorationTag: o = "span", decorationClass: l = "suggestion", command: a = () => null, items: c = () => [], render: u = () => ({}), allow: f = () => !0, findSuggestionMatch: h = Lw }) {
  let g;
  const y = u?.(), v = new Qe({
    key: t,
    view() {
      return {
        update: async (k, E) => {
          var T, j, d, m, p, b, w;
          const _ = (T = this.key) === null || T === void 0 ? void 0 : T.getState(E), x = (j = this.key) === null || j === void 0 ? void 0 : j.getState(k.state), M = _.active && x.active && _.range.from !== x.range.from, O = !_.active && x.active, L = _.active && !x.active, I = !O && !L && _.query !== x.query, z = O || M, S = I && !M, R = L || M;
          if (!z && !S && !R)
            return;
          const N = R && !z ? _ : x, q = k.dom.querySelector(`[data-decoration-id="${N.decorationId}"]`);
          g = {
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
              const { decorationId: J } = (re = this.key) === null || re === void 0 ? void 0 : re.getState(e.state), ce = k.dom.querySelector(`[data-decoration-id="${J}"]`);
              return ce?.getBoundingClientRect() || null;
            } : null
          }, z && ((d = y?.onBeforeStart) === null || d === void 0 || d.call(y, g)), S && ((m = y?.onBeforeUpdate) === null || m === void 0 || m.call(y, g)), (S || z) && (g.items = await c({
            editor: e,
            query: N.query
          })), R && ((p = y?.onExit) === null || p === void 0 || p.call(y, g)), S && ((b = y?.onUpdate) === null || b === void 0 || b.call(y, g)), z && ((w = y?.onStart) === null || w === void 0 || w.call(y, g));
        },
        destroy: () => {
          var k;
          g && ((k = y?.onExit) === null || k === void 0 || k.call(y, g));
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
      apply(k, E, T, j) {
        const { isEditable: d } = e, { composing: m } = e.view, { selection: p } = k, { empty: b, from: w } = p, _ = { ...E };
        if (_.composing = m, d && (b || e.view.composing)) {
          (w < E.range.from || w > E.range.to) && !m && !E.composing && (_.active = !1);
          const x = h({
            char: n,
            allowSpaces: r,
            allowedPrefixes: s,
            startOfLine: i,
            $position: p.$from
          }), M = `id_${Math.floor(Math.random() * 4294967295)}`;
          x && f({ editor: e, state: j, range: x.range }) ? (_.active = !0, _.decorationId = E.decorationId ? E.decorationId : M, _.range = x.range, _.query = x.query, _.text = x.text) : _.active = !1;
        } else
          _.active = !1;
        return _.active || (_.decorationId = null, _.range = { from: 0, to: 0 }, _.query = null, _.text = null), _;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(k, E) {
        var T;
        const { active: j, range: d } = v.getState(k.state);
        return j && ((T = y?.onKeyDown) === null || T === void 0 ? void 0 : T.call(y, { view: k, event: E, range: d })) || !1;
      },
      // Setup decorator on the currently active suggestion.
      decorations(k) {
        const { active: E, range: T, decorationId: j } = v.getState(k);
        return E ? ke.create(k.doc, [
          dt.inline(T.from, T.to, {
            nodeName: o,
            class: l,
            "data-decoration-id": j
          })
        ]) : null;
      }
    }
  });
  return v;
}
const Nw = new Ze("mention");
Ee.create({
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
        pluginKey: Nw,
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
      Iw({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
var zw = { exports: {} };
(function(t) {
  (function() {
    function e(d) {
      var m = {
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
        return JSON.parse(JSON.stringify(m));
      var p = {};
      for (var b in m)
        m.hasOwnProperty(b) && (p[b] = m[b].defaultValue);
      return p;
    }
    function n() {
      var d = e(!0), m = {};
      for (var p in d)
        d.hasOwnProperty(p) && (m[p] = !0);
      return m;
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
    r.helper = {}, r.extensions = {}, r.setOption = function(d, m) {
      return o[d] = m, this;
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
      var m = a[d];
      l = d;
      for (var p in m)
        m.hasOwnProperty(p) && (o[p] = m[p]);
    }, r.getFlavor = function() {
      return l;
    }, r.getFlavorOptions = function(d) {
      if (a.hasOwnProperty(d))
        return a[d];
    }, r.getDefaultOptions = function(d) {
      return e(d);
    }, r.subParser = function(d, m) {
      if (r.helper.isString(d))
        if (typeof m < "u")
          s[d] = m;
        else {
          if (s.hasOwnProperty(d))
            return s[d];
          throw Error("SubParser named " + d + " not registered!");
        }
    }, r.extension = function(d, m) {
      if (!r.helper.isString(d))
        throw Error("Extension 'name' must be a string");
      if (d = r.helper.stdExtName(d), r.helper.isUndefined(m)) {
        if (!i.hasOwnProperty(d))
          throw Error("Extension named " + d + " is not registered!");
        return i[d];
      } else {
        typeof m == "function" && (m = m()), r.helper.isArray(m) || (m = [m]);
        var p = c(m, d);
        if (p.valid)
          i[d] = m;
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
    function c(d, m) {
      var p = m ? "Error in " + m + " extension->" : "Error in unnamed extension", b = {
        valid: !0,
        error: ""
      };
      r.helper.isArray(d) || (d = [d]);
      for (var w = 0; w < d.length; ++w) {
        var _ = p + " sub-extension " + w + ": ", x = d[w];
        if (typeof x != "object")
          return b.valid = !1, b.error = _ + "must be an object, but " + typeof x + " given", b;
        if (!r.helper.isString(x.type))
          return b.valid = !1, b.error = _ + 'property "type" must be a string, but ' + typeof x.type + " given", b;
        var M = x.type = x.type.toLowerCase();
        if (M === "language" && (M = x.type = "lang"), M === "html" && (M = x.type = "output"), M !== "lang" && M !== "output" && M !== "listener")
          return b.valid = !1, b.error = _ + "type " + M + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', b;
        if (M === "listener") {
          if (r.helper.isUndefined(x.listeners))
            return b.valid = !1, b.error = _ + '. Extensions of type "listener" must have a property called "listeners"', b;
        } else if (r.helper.isUndefined(x.filter) && r.helper.isUndefined(x.regex))
          return b.valid = !1, b.error = _ + M + ' extensions must define either a "regex" property or a "filter" method', b;
        if (x.listeners) {
          if (typeof x.listeners != "object")
            return b.valid = !1, b.error = _ + '"listeners" property must be an object but ' + typeof x.listeners + " given", b;
          for (var O in x.listeners)
            if (x.listeners.hasOwnProperty(O) && typeof x.listeners[O] != "function")
              return b.valid = !1, b.error = _ + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + O + " must be a function but " + typeof x.listeners[O] + " given", b;
        }
        if (x.filter) {
          if (typeof x.filter != "function")
            return b.valid = !1, b.error = _ + '"filter" must be a function, but ' + typeof x.filter + " given", b;
        } else if (x.regex) {
          if (r.helper.isString(x.regex) && (x.regex = new RegExp(x.regex, "g")), !(x.regex instanceof RegExp))
            return b.valid = !1, b.error = _ + '"regex" property must either be a string or a RegExp object, but ' + typeof x.regex + " given", b;
          if (r.helper.isUndefined(x.replace))
            return b.valid = !1, b.error = _ + '"regex" extensions must implement a replace string or function', b;
        }
      }
      return b;
    }
    r.validateExtension = function(d) {
      var m = c(d, null);
      return m.valid ? !0 : (console.warn(m.error), !1);
    }, r.hasOwnProperty("helper") || (r.helper = {}), r.helper.isString = function(d) {
      return typeof d == "string" || d instanceof String;
    }, r.helper.isFunction = function(d) {
      var m = {};
      return d && m.toString.call(d) === "[object Function]";
    }, r.helper.isArray = function(d) {
      return Array.isArray(d);
    }, r.helper.isUndefined = function(d) {
      return typeof d > "u";
    }, r.helper.forEach = function(d, m) {
      if (r.helper.isUndefined(d))
        throw new Error("obj param is required");
      if (r.helper.isUndefined(m))
        throw new Error("callback param is required");
      if (!r.helper.isFunction(m))
        throw new Error("callback param must be a function/closure");
      if (typeof d.forEach == "function")
        d.forEach(m);
      else if (r.helper.isArray(d))
        for (var p = 0; p < d.length; p++)
          m(d[p], p, d);
      else if (typeof d == "object")
        for (var b in d)
          d.hasOwnProperty(b) && m(d[b], b, d);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, r.helper.stdExtName = function(d) {
      return d.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function u(d, m) {
      var p = m.charCodeAt(0);
      return "¨E" + p + "E";
    }
    r.helper.escapeCharactersCallback = u, r.helper.escapeCharacters = function(d, m, p) {
      var b = "([" + m.replace(/([\[\]\\])/g, "\\$1") + "])";
      p && (b = "\\\\" + b);
      var w = new RegExp(b, "g");
      return d = d.replace(w, u), d;
    }, r.helper.unescapeHTMLEntities = function(d) {
      return d.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var f = function(d, m, p, b) {
      var w = b || "", _ = w.indexOf("g") > -1, x = new RegExp(m + "|" + p, "g" + w.replace(/g/g, "")), M = new RegExp(m, w.replace(/g/g, "")), O = [], L, I, z, S, R;
      do
        for (L = 0; z = x.exec(d); )
          if (M.test(z[0]))
            L++ || (I = x.lastIndex, S = I - z[0].length);
          else if (L && !--L) {
            R = z.index + z[0].length;
            var N = {
              left: { start: S, end: I },
              match: { start: I, end: z.index },
              right: { start: z.index, end: R },
              wholeMatch: { start: S, end: R }
            };
            if (O.push(N), !_)
              return O;
          }
      while (L && (x.lastIndex = I));
      return O;
    };
    r.helper.matchRecursiveRegExp = function(d, m, p, b) {
      for (var w = f(d, m, p, b), _ = [], x = 0; x < w.length; ++x)
        _.push([
          d.slice(w[x].wholeMatch.start, w[x].wholeMatch.end),
          d.slice(w[x].match.start, w[x].match.end),
          d.slice(w[x].left.start, w[x].left.end),
          d.slice(w[x].right.start, w[x].right.end)
        ]);
      return _;
    }, r.helper.replaceRecursiveRegExp = function(d, m, p, b, w) {
      if (!r.helper.isFunction(m)) {
        var _ = m;
        m = function() {
          return _;
        };
      }
      var x = f(d, p, b, w), M = d, O = x.length;
      if (O > 0) {
        var L = [];
        x[0].wholeMatch.start !== 0 && L.push(d.slice(0, x[0].wholeMatch.start));
        for (var I = 0; I < O; ++I)
          L.push(
            m(
              d.slice(x[I].wholeMatch.start, x[I].wholeMatch.end),
              d.slice(x[I].match.start, x[I].match.end),
              d.slice(x[I].left.start, x[I].left.end),
              d.slice(x[I].right.start, x[I].right.end)
            )
          ), I < O - 1 && L.push(d.slice(x[I].wholeMatch.end, x[I + 1].wholeMatch.start));
        x[O - 1].wholeMatch.end < d.length && L.push(d.slice(x[O - 1].wholeMatch.end)), M = L.join("");
      }
      return M;
    }, r.helper.regexIndexOf = function(d, m, p) {
      if (!r.helper.isString(d))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(m instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var b = d.substring(p || 0).search(m);
      return b >= 0 ? b + (p || 0) : b;
    }, r.helper.splitAtIndex = function(d, m) {
      if (!r.helper.isString(d))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [d.substring(0, m), d.substring(m)];
    }, r.helper.encodeEmailAddress = function(d) {
      var m = [
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
          p = m[Math.floor(Math.random() * 2)](p);
        else {
          var b = Math.random();
          p = b > 0.9 ? m[2](p) : b > 0.45 ? m[1](p) : m[0](p);
        }
        return p;
      }), d;
    }, r.helper.padEnd = function(m, p, b) {
      return p = p >> 0, b = String(b || " "), m.length > p ? String(m) : (p = p - m.length, p > b.length && (b += b.repeat(p / b.length)), String(m) + b.slice(0, p));
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
      var m = {}, p = [], b = [], w = {}, _ = l, x = {
        parsed: {},
        raw: "",
        format: ""
      };
      M();
      function M() {
        d = d || {};
        for (var S in o)
          o.hasOwnProperty(S) && (m[S] = o[S]);
        if (typeof d == "object")
          for (var R in d)
            d.hasOwnProperty(R) && (m[R] = d[R]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof d + " was passed instead.");
        m.extensions && r.helper.forEach(m.extensions, O);
      }
      function O(S, R) {
        if (R = R || null, r.helper.isString(S))
          if (S = r.helper.stdExtName(S), R = S, r.extensions[S]) {
            console.warn("DEPRECATION WARNING: " + S + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), L(r.extensions[S], S);
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
              b.push(S[q]);
              break;
          }
          if (S[q].hasOwnProperty("listeners"))
            for (var re in S[q].listeners)
              S[q].listeners.hasOwnProperty(re) && I(re, S[q].listeners[re]);
        }
      }
      function L(S, R) {
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
              b.push(S[q]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function I(S, R) {
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
        return I(S, R), this;
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
          outputModifiers: b,
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
`), S = S.replace(/\u00A0/g, "&nbsp;"), m.smartIndentationFix && (S = z(S)), S = `

` + S + `

`, S = r.subParser("detab")(S, m, R), S = S.replace(/^[ \t]+$/mg, ""), r.helper.forEach(p, function(N) {
          S = r.subParser("runExtension")(N, S, m, R);
        }), S = r.subParser("metadata")(S, m, R), S = r.subParser("hashPreCodeTags")(S, m, R), S = r.subParser("githubCodeBlocks")(S, m, R), S = r.subParser("hashHTMLBlocks")(S, m, R), S = r.subParser("hashCodeTags")(S, m, R), S = r.subParser("stripLinkDefinitions")(S, m, R), S = r.subParser("blockGamut")(S, m, R), S = r.subParser("unhashHTMLSpans")(S, m, R), S = r.subParser("unescapeSpecialChars")(S, m, R), S = S.replace(/¨D/g, "$$"), S = S.replace(/¨T/g, "¨"), S = r.subParser("completeHTMLDocument")(S, m, R), r.helper.forEach(b, function(N) {
          S = r.subParser("runExtension")(N, S, m, R);
        }), x = R.metadata, S;
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
          for (var be = 0; be < Te.childNodes.length; ++be) {
            var $e = Te.childNodes[be];
            $e.nodeType === 3 ? !/\S/.test($e.nodeValue) && !/^[ ]+$/.test($e.nodeValue) ? (Te.removeChild($e), --be) : ($e.nodeValue = $e.nodeValue.split(`
`).join(" "), $e.nodeValue = $e.nodeValue.replace(/(\s)+/g, "$1")) : $e.nodeType === 1 && Me($e);
          }
        }
        function Ae(Te) {
          for (var be = Te.querySelectorAll("pre"), $e = [], qe = 0; qe < be.length; ++qe)
            if (be[qe].childElementCount === 1 && be[qe].firstChild.tagName.toLowerCase() === "code") {
              var ar = be[qe].firstChild.innerHTML.trim(), zt = be[qe].firstChild.getAttribute("data-language") || "";
              if (zt === "")
                for (var cr = be[qe].firstChild.className.split(" "), $n = 0; $n < cr.length; ++$n) {
                  var C = cr[$n].match(/^language-(.+)$/);
                  if (C !== null) {
                    zt = C[1];
                    break;
                  }
                }
              ar = r.helper.unescapeHTMLEntities(ar), $e.push(ar), be[qe].outerHTML = '<precode language="' + zt + '" precodenum="' + qe.toString() + '"></precode>';
            } else
              $e.push(be[qe].innerHTML), be[qe].innerHTML = "", be[qe].setAttribute("prenum", qe.toString());
          return $e;
        }
        return J;
      }, this.setOption = function(S, R) {
        m[S] = R;
      }, this.getOption = function(S) {
        return m[S];
      }, this.getOptions = function() {
        return m;
      }, this.addExtension = function(S, R) {
        R = R || null, O(S, R);
      }, this.useExtension = function(S) {
        O(S);
      }, this.setFlavor = function(S) {
        if (!a.hasOwnProperty(S))
          throw Error(S + " flavor was not found");
        var R = a[S];
        _ = S;
        for (var N in R)
          R.hasOwnProperty(N) && (m[N] = R[N]);
      }, this.getFlavor = function() {
        return _;
      }, this.removeExtension = function(S) {
        r.helper.isArray(S) || (S = [S]);
        for (var R = 0; R < S.length; ++R) {
          for (var N = S[R], q = 0; q < p.length; ++q)
            p[q] === N && p.splice(q, 1);
          for (var re = 0; re < b.length; ++re)
            b[re] === N && b.splice(re, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: p,
          output: b
        };
      }, this.getMetadata = function(S) {
        return S ? x.raw : x.parsed;
      }, this.getMetadataFormat = function() {
        return x.format;
      }, this._setMetadataPair = function(S, R) {
        x.parsed[S] = R;
      }, this._setMetadataFormat = function(S) {
        x.format = S;
      }, this._setMetadataRaw = function(S) {
        x.raw = S;
      };
    }, r.subParser("anchors", function(d, m, p) {
      d = p.converter._dispatch("anchors.before", d, m, p);
      var b = function(w, _, x, M, O, L, I) {
        if (r.helper.isUndefined(I) && (I = ""), x = x.toLowerCase(), w.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          M = "";
        else if (!M)
          if (x || (x = _.toLowerCase().replace(/ ?\n/g, " ")), M = "#" + x, !r.helper.isUndefined(p.gUrls[x]))
            M = p.gUrls[x], r.helper.isUndefined(p.gTitles[x]) || (I = p.gTitles[x]);
          else
            return w;
        M = M.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var z = '<a href="' + M + '"';
        return I !== "" && I !== null && (I = I.replace(/"/g, "&quot;"), I = I.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), z += ' title="' + I + '"'), m.openLinksInNewWindow && !/^#/.test(M) && (z += ' rel="noopener noreferrer" target="¨E95Eblank"'), z += ">" + _ + "</a>", z;
      };
      return d = d.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, b), d = d.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        b
      ), d = d.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        b
      ), d = d.replace(/\[([^\[\]]+)]()()()()()/g, b), m.ghMentions && (d = d.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(w, _, x, M, O) {
        if (x === "\\")
          return _ + M;
        if (!r.helper.isString(m.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var L = m.ghMentionsLink.replace(/\{u}/g, O), I = "";
        return m.openLinksInNewWindow && (I = ' rel="noopener noreferrer" target="¨E95Eblank"'), _ + '<a href="' + L + '"' + I + ">" + M + "</a>";
      })), d = p.converter._dispatch("anchors.after", d, m, p), d;
    });
    var h = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, g = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, y = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, v = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, k = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, E = function(d) {
      return function(m, p, b, w, _, x, M) {
        b = b.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var O = b, L = "", I = "", z = p || "", S = M || "";
        return /^www\./i.test(b) && (b = b.replace(/^www\./i, "http://www.")), d.excludeTrailingPunctuationFromURLs && x && (L = x), d.openLinksInNewWindow && (I = ' rel="noopener noreferrer" target="¨E95Eblank"'), z + '<a href="' + b + '"' + I + ">" + O + "</a>" + L + S;
      };
    }, T = function(d, m) {
      return function(p, b, w) {
        var _ = "mailto:";
        return b = b || "", w = r.subParser("unescapeSpecialChars")(w, d, m), d.encodeEmails ? (_ = r.helper.encodeEmailAddress(_ + w), w = r.helper.encodeEmailAddress(w)) : _ = _ + w, b + '<a href="' + _ + '">' + w + "</a>";
      };
    };
    r.subParser("autoLinks", function(d, m, p) {
      return d = p.converter._dispatch("autoLinks.before", d, m, p), d = d.replace(y, E(m)), d = d.replace(k, T(m, p)), d = p.converter._dispatch("autoLinks.after", d, m, p), d;
    }), r.subParser("simplifiedAutoLinks", function(d, m, p) {
      return m.simplifiedAutoLink && (d = p.converter._dispatch("simplifiedAutoLinks.before", d, m, p), m.excludeTrailingPunctuationFromURLs ? d = d.replace(g, E(m)) : d = d.replace(h, E(m)), d = d.replace(v, T(m, p)), d = p.converter._dispatch("simplifiedAutoLinks.after", d, m, p)), d;
    }), r.subParser("blockGamut", function(d, m, p) {
      return d = p.converter._dispatch("blockGamut.before", d, m, p), d = r.subParser("blockQuotes")(d, m, p), d = r.subParser("headers")(d, m, p), d = r.subParser("horizontalRule")(d, m, p), d = r.subParser("lists")(d, m, p), d = r.subParser("codeBlocks")(d, m, p), d = r.subParser("tables")(d, m, p), d = r.subParser("hashHTMLBlocks")(d, m, p), d = r.subParser("paragraphs")(d, m, p), d = p.converter._dispatch("blockGamut.after", d, m, p), d;
    }), r.subParser("blockQuotes", function(d, m, p) {
      d = p.converter._dispatch("blockQuotes.before", d, m, p), d = d + `

`;
      var b = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return m.splitAdjacentBlockquotes && (b = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), d = d.replace(b, function(w) {
        return w = w.replace(/^[ \t]*>[ \t]?/gm, ""), w = w.replace(/¨0/g, ""), w = w.replace(/^[ \t]+$/gm, ""), w = r.subParser("githubCodeBlocks")(w, m, p), w = r.subParser("blockGamut")(w, m, p), w = w.replace(/(^|\n)/g, "$1  "), w = w.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(_, x) {
          var M = x;
          return M = M.replace(/^  /mg, "¨0"), M = M.replace(/¨0/g, ""), M;
        }), r.subParser("hashBlock")(`<blockquote>
` + w + `
</blockquote>`, m, p);
      }), d = p.converter._dispatch("blockQuotes.after", d, m, p), d;
    }), r.subParser("codeBlocks", function(d, m, p) {
      d = p.converter._dispatch("codeBlocks.before", d, m, p), d += "¨0";
      var b = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return d = d.replace(b, function(w, _, x) {
        var M = _, O = x, L = `
`;
        return M = r.subParser("outdent")(M, m, p), M = r.subParser("encodeCode")(M, m, p), M = r.subParser("detab")(M, m, p), M = M.replace(/^\n+/g, ""), M = M.replace(/\n+$/g, ""), m.omitExtraWLInCodeBlocks && (L = ""), M = "<pre><code>" + M + L + "</code></pre>", r.subParser("hashBlock")(M, m, p) + O;
      }), d = d.replace(/¨0/, ""), d = p.converter._dispatch("codeBlocks.after", d, m, p), d;
    }), r.subParser("codeSpans", function(d, m, p) {
      return d = p.converter._dispatch("codeSpans.before", d, m, p), typeof d > "u" && (d = ""), d = d.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(b, w, _, x) {
          var M = x;
          return M = M.replace(/^([ \t]*)/g, ""), M = M.replace(/[ \t]*$/g, ""), M = r.subParser("encodeCode")(M, m, p), M = w + "<code>" + M + "</code>", M = r.subParser("hashHTMLSpans")(M, m, p), M;
        }
      ), d = p.converter._dispatch("codeSpans.after", d, m, p), d;
    }), r.subParser("completeHTMLDocument", function(d, m, p) {
      if (!m.completeHTMLDocument)
        return d;
      d = p.converter._dispatch("completeHTMLDocument.before", d, m, p);
      var b = "html", w = `<!DOCTYPE HTML>
`, _ = "", x = `<meta charset="utf-8">
`, M = "", O = "";
      typeof p.metadata.parsed.doctype < "u" && (w = "<!DOCTYPE " + p.metadata.parsed.doctype + `>
`, b = p.metadata.parsed.doctype.toString().toLowerCase(), (b === "html" || b === "html5") && (x = '<meta charset="utf-8">'));
      for (var L in p.metadata.parsed)
        if (p.metadata.parsed.hasOwnProperty(L))
          switch (L.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              _ = "<title>" + p.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              b === "html" || b === "html5" ? x = '<meta charset="' + p.metadata.parsed.charset + `">
` : x = '<meta name="charset" content="' + p.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              M = ' lang="' + p.metadata.parsed[L] + '"', O += '<meta name="' + L + '" content="' + p.metadata.parsed[L] + `">
`;
              break;
            default:
              O += '<meta name="' + L + '" content="' + p.metadata.parsed[L] + `">
`;
          }
      return d = w + "<html" + M + `>
<head>
` + _ + x + O + `</head>
<body>
` + d.trim() + `
</body>
</html>`, d = p.converter._dispatch("completeHTMLDocument.after", d, m, p), d;
    }), r.subParser("detab", function(d, m, p) {
      return d = p.converter._dispatch("detab.before", d, m, p), d = d.replace(/\t(?=\t)/g, "    "), d = d.replace(/\t/g, "¨A¨B"), d = d.replace(/¨B(.+?)¨A/g, function(b, w) {
        for (var _ = w, x = 4 - _.length % 4, M = 0; M < x; M++)
          _ += " ";
        return _;
      }), d = d.replace(/¨A/g, "    "), d = d.replace(/¨B/g, ""), d = p.converter._dispatch("detab.after", d, m, p), d;
    }), r.subParser("ellipsis", function(d, m, p) {
      return m.ellipsis && (d = p.converter._dispatch("ellipsis.before", d, m, p), d = d.replace(/\.\.\./g, "…"), d = p.converter._dispatch("ellipsis.after", d, m, p)), d;
    }), r.subParser("emoji", function(d, m, p) {
      if (!m.emoji)
        return d;
      d = p.converter._dispatch("emoji.before", d, m, p);
      var b = /:([\S]+?):/g;
      return d = d.replace(b, function(w, _) {
        return r.helper.emojis.hasOwnProperty(_) ? r.helper.emojis[_] : w;
      }), d = p.converter._dispatch("emoji.after", d, m, p), d;
    }), r.subParser("encodeAmpsAndAngles", function(d, m, p) {
      return d = p.converter._dispatch("encodeAmpsAndAngles.before", d, m, p), d = d.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), d = d.replace(/<(?![a-z\/?$!])/gi, "&lt;"), d = d.replace(/</g, "&lt;"), d = d.replace(/>/g, "&gt;"), d = p.converter._dispatch("encodeAmpsAndAngles.after", d, m, p), d;
    }), r.subParser("encodeBackslashEscapes", function(d, m, p) {
      return d = p.converter._dispatch("encodeBackslashEscapes.before", d, m, p), d = d.replace(/\\(\\)/g, r.helper.escapeCharactersCallback), d = d.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, r.helper.escapeCharactersCallback), d = p.converter._dispatch("encodeBackslashEscapes.after", d, m, p), d;
    }), r.subParser("encodeCode", function(d, m, p) {
      return d = p.converter._dispatch("encodeCode.before", d, m, p), d = d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, r.helper.escapeCharactersCallback), d = p.converter._dispatch("encodeCode.after", d, m, p), d;
    }), r.subParser("escapeSpecialCharsWithinTagAttributes", function(d, m, p) {
      d = p.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", d, m, p);
      var b = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, w = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return d = d.replace(b, function(_) {
        return _.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), d = d.replace(w, function(_) {
        return _.replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), d = p.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", d, m, p), d;
    }), r.subParser("githubCodeBlocks", function(d, m, p) {
      return m.ghCodeBlocks ? (d = p.converter._dispatch("githubCodeBlocks.before", d, m, p), d += "¨0", d = d.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(b, w, _, x) {
        var M = m.omitExtraWLInCodeBlocks ? "" : `
`;
        return x = r.subParser("encodeCode")(x, m, p), x = r.subParser("detab")(x, m, p), x = x.replace(/^\n+/g, ""), x = x.replace(/\n+$/g, ""), x = "<pre><code" + (_ ? ' class="' + _ + " language-" + _ + '"' : "") + ">" + x + M + "</code></pre>", x = r.subParser("hashBlock")(x, m, p), `

¨G` + (p.ghCodeBlocks.push({ text: b, codeblock: x }) - 1) + `G

`;
      }), d = d.replace(/¨0/, ""), p.converter._dispatch("githubCodeBlocks.after", d, m, p)) : d;
    }), r.subParser("hashBlock", function(d, m, p) {
      return d = p.converter._dispatch("hashBlock.before", d, m, p), d = d.replace(/(^\n+|\n+$)/g, ""), d = `

¨K` + (p.gHtmlBlocks.push(d) - 1) + `K

`, d = p.converter._dispatch("hashBlock.after", d, m, p), d;
    }), r.subParser("hashCodeTags", function(d, m, p) {
      d = p.converter._dispatch("hashCodeTags.before", d, m, p);
      var b = function(w, _, x, M) {
        var O = x + r.subParser("encodeCode")(_, m, p) + M;
        return "¨C" + (p.gHtmlSpans.push(O) - 1) + "C";
      };
      return d = r.helper.replaceRecursiveRegExp(d, b, "<code\\b[^>]*>", "</code>", "gim"), d = p.converter._dispatch("hashCodeTags.after", d, m, p), d;
    }), r.subParser("hashElement", function(d, m, p) {
      return function(b, w) {
        var _ = w;
        return _ = _.replace(/\n\n/g, `
`), _ = _.replace(/^\n/, ""), _ = _.replace(/\n+$/g, ""), _ = `

¨K` + (p.gHtmlBlocks.push(_) - 1) + `K

`, _;
      };
    }), r.subParser("hashHTMLBlocks", function(d, m, p) {
      d = p.converter._dispatch("hashHTMLBlocks.before", d, m, p);
      var b = [
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
      m.backslashEscapesHTMLTags && (d = d.replace(/\\<(\/?[^>]+?)>/g, function(S, R) {
        return "&lt;" + R + "&gt;";
      }));
      for (var _ = 0; _ < b.length; ++_)
        for (var x, M = new RegExp("^ {0,3}(<" + b[_] + "\\b[^>]*>)", "im"), O = "<" + b[_] + "\\b[^>]*>", L = "</" + b[_] + ">"; (x = r.helper.regexIndexOf(d, M)) !== -1; ) {
          var I = r.helper.splitAtIndex(d, x), z = r.helper.replaceRecursiveRegExp(I[1], w, O, L, "im");
          if (z === I[1])
            break;
          d = I[0].concat(z);
        }
      return d = d.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(d, m, p)
      ), d = r.helper.replaceRecursiveRegExp(d, function(S) {
        return `

¨K` + (p.gHtmlBlocks.push(S) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), d = d.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(d, m, p)
      ), d = p.converter._dispatch("hashHTMLBlocks.after", d, m, p), d;
    }), r.subParser("hashHTMLSpans", function(d, m, p) {
      d = p.converter._dispatch("hashHTMLSpans.before", d, m, p);
      function b(w) {
        return "¨C" + (p.gHtmlSpans.push(w) - 1) + "C";
      }
      return d = d.replace(/<[^>]+?\/>/gi, function(w) {
        return b(w);
      }), d = d.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(w) {
        return b(w);
      }), d = d.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(w) {
        return b(w);
      }), d = d.replace(/<[^>]+?>/gi, function(w) {
        return b(w);
      }), d = p.converter._dispatch("hashHTMLSpans.after", d, m, p), d;
    }), r.subParser("unhashHTMLSpans", function(d, m, p) {
      d = p.converter._dispatch("unhashHTMLSpans.before", d, m, p);
      for (var b = 0; b < p.gHtmlSpans.length; ++b) {
        for (var w = p.gHtmlSpans[b], _ = 0; /¨C(\d+)C/.test(w); ) {
          var x = RegExp.$1;
          if (w = w.replace("¨C" + x + "C", p.gHtmlSpans[x]), _ === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++_;
        }
        d = d.replace("¨C" + b + "C", w);
      }
      return d = p.converter._dispatch("unhashHTMLSpans.after", d, m, p), d;
    }), r.subParser("hashPreCodeTags", function(d, m, p) {
      d = p.converter._dispatch("hashPreCodeTags.before", d, m, p);
      var b = function(w, _, x, M) {
        var O = x + r.subParser("encodeCode")(_, m, p) + M;
        return `

¨G` + (p.ghCodeBlocks.push({ text: w, codeblock: O }) - 1) + `G

`;
      };
      return d = r.helper.replaceRecursiveRegExp(d, b, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), d = p.converter._dispatch("hashPreCodeTags.after", d, m, p), d;
    }), r.subParser("headers", function(d, m, p) {
      d = p.converter._dispatch("headers.before", d, m, p);
      var b = isNaN(parseInt(m.headerLevelStart)) ? 1 : parseInt(m.headerLevelStart), w = m.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, _ = m.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      d = d.replace(w, function(O, L) {
        var I = r.subParser("spanGamut")(L, m, p), z = m.noHeaderId ? "" : ' id="' + M(L) + '"', S = b, R = "<h" + S + z + ">" + I + "</h" + S + ">";
        return r.subParser("hashBlock")(R, m, p);
      }), d = d.replace(_, function(O, L) {
        var I = r.subParser("spanGamut")(L, m, p), z = m.noHeaderId ? "" : ' id="' + M(L) + '"', S = b + 1, R = "<h" + S + z + ">" + I + "</h" + S + ">";
        return r.subParser("hashBlock")(R, m, p);
      });
      var x = m.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      d = d.replace(x, function(O, L, I) {
        var z = I;
        m.customizedHeaderId && (z = I.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var S = r.subParser("spanGamut")(z, m, p), R = m.noHeaderId ? "" : ' id="' + M(I) + '"', N = b - 1 + L.length, q = "<h" + N + R + ">" + S + "</h" + N + ">";
        return r.subParser("hashBlock")(q, m, p);
      });
      function M(O) {
        var L, I;
        if (m.customizedHeaderId) {
          var z = O.match(/\{([^{]+?)}\s*$/);
          z && z[1] && (O = z[1]);
        }
        return L = O, r.helper.isString(m.prefixHeaderId) ? I = m.prefixHeaderId : m.prefixHeaderId === !0 ? I = "section-" : I = "", m.rawPrefixHeaderId || (L = I + L), m.ghCompatibleHeaderId ? L = L.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : m.rawHeaderId ? L = L.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : L = L.replace(/[^\w]/g, "").toLowerCase(), m.rawPrefixHeaderId && (L = I + L), p.hashLinkCounts[L] ? L = L + "-" + p.hashLinkCounts[L]++ : p.hashLinkCounts[L] = 1, L;
      }
      return d = p.converter._dispatch("headers.after", d, m, p), d;
    }), r.subParser("horizontalRule", function(d, m, p) {
      d = p.converter._dispatch("horizontalRule.before", d, m, p);
      var b = r.subParser("hashBlock")("<hr />", m, p);
      return d = d.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, b), d = d.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, b), d = d.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, b), d = p.converter._dispatch("horizontalRule.after", d, m, p), d;
    }), r.subParser("images", function(d, m, p) {
      d = p.converter._dispatch("images.before", d, m, p);
      var b = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, w = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, _ = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, x = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, M = /!\[([^\[\]]+)]()()()()()/g;
      function O(I, z, S, R, N, q, re, J) {
        return R = R.replace(/\s/g, ""), L(I, z, S, R, N, q, re, J);
      }
      function L(I, z, S, R, N, q, re, J) {
        var ce = p.gUrls, Me = p.gTitles, Ae = p.gDimensions;
        if (S = S.toLowerCase(), J || (J = ""), I.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          R = "";
        else if (R === "" || R === null)
          if ((S === "" || S === null) && (S = z.toLowerCase().replace(/ ?\n/g, " ")), R = "#" + S, !r.helper.isUndefined(ce[S]))
            R = ce[S], r.helper.isUndefined(Me[S]) || (J = Me[S]), r.helper.isUndefined(Ae[S]) || (N = Ae[S].width, q = Ae[S].height);
          else
            return I;
        z = z.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), R = R.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var Te = '<img src="' + R + '" alt="' + z + '"';
        return J && r.helper.isString(J) && (J = J.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), Te += ' title="' + J + '"'), N && q && (N = N === "*" ? "auto" : N, q = q === "*" ? "auto" : q, Te += ' width="' + N + '"', Te += ' height="' + q + '"'), Te += " />", Te;
      }
      return d = d.replace(x, L), d = d.replace(_, O), d = d.replace(w, L), d = d.replace(b, L), d = d.replace(M, L), d = p.converter._dispatch("images.after", d, m, p), d;
    }), r.subParser("italicsAndBold", function(d, m, p) {
      d = p.converter._dispatch("italicsAndBold.before", d, m, p);
      function b(w, _, x) {
        return _ + w + x;
      }
      return m.literalMidWordUnderscores ? (d = d.replace(/\b___(\S[\s\S]*?)___\b/g, function(w, _) {
        return b(_, "<strong><em>", "</em></strong>");
      }), d = d.replace(/\b__(\S[\s\S]*?)__\b/g, function(w, _) {
        return b(_, "<strong>", "</strong>");
      }), d = d.replace(/\b_(\S[\s\S]*?)_\b/g, function(w, _) {
        return b(_, "<em>", "</em>");
      })) : (d = d.replace(/___(\S[\s\S]*?)___/g, function(w, _) {
        return /\S$/.test(_) ? b(_, "<strong><em>", "</em></strong>") : w;
      }), d = d.replace(/__(\S[\s\S]*?)__/g, function(w, _) {
        return /\S$/.test(_) ? b(_, "<strong>", "</strong>") : w;
      }), d = d.replace(/_([^\s_][\s\S]*?)_/g, function(w, _) {
        return /\S$/.test(_) ? b(_, "<em>", "</em>") : w;
      })), m.literalMidWordAsterisks ? (d = d.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(w, _, x) {
        return b(x, _ + "<strong><em>", "</em></strong>");
      }), d = d.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(w, _, x) {
        return b(x, _ + "<strong>", "</strong>");
      }), d = d.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(w, _, x) {
        return b(x, _ + "<em>", "</em>");
      })) : (d = d.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(w, _) {
        return /\S$/.test(_) ? b(_, "<strong><em>", "</em></strong>") : w;
      }), d = d.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(w, _) {
        return /\S$/.test(_) ? b(_, "<strong>", "</strong>") : w;
      }), d = d.replace(/\*([^\s*][\s\S]*?)\*/g, function(w, _) {
        return /\S$/.test(_) ? b(_, "<em>", "</em>") : w;
      })), d = p.converter._dispatch("italicsAndBold.after", d, m, p), d;
    }), r.subParser("lists", function(d, m, p) {
      function b(x, M) {
        p.gListLevel++, x = x.replace(/\n{2,}$/, `
`), x += "¨0";
        var O = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, L = /\n[ \t]*\n(?!¨0)/.test(x);
        return m.disableForced4SpacesIndentedSublists && (O = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), x = x.replace(O, function(I, z, S, R, N, q, re) {
          re = re && re.trim() !== "";
          var J = r.subParser("outdent")(N, m, p), ce = "";
          return q && m.tasklists && (ce = ' class="task-list-item" style="list-style-type: none;"', J = J.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var Me = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return re && (Me += " checked"), Me += ">", Me;
          })), J = J.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(Me) {
            return "¨A" + Me;
          }), z || J.search(/\n{2,}/) > -1 ? (J = r.subParser("githubCodeBlocks")(J, m, p), J = r.subParser("blockGamut")(J, m, p)) : (J = r.subParser("lists")(J, m, p), J = J.replace(/\n$/, ""), J = r.subParser("hashHTMLBlocks")(J, m, p), J = J.replace(/\n\n+/g, `

`), L ? J = r.subParser("paragraphs")(J, m, p) : J = r.subParser("spanGamut")(J, m, p)), J = J.replace("¨A", ""), J = "<li" + ce + ">" + J + `</li>
`, J;
        }), x = x.replace(/¨0/g, ""), p.gListLevel--, M && (x = x.replace(/\s+$/, "")), x;
      }
      function w(x, M) {
        if (M === "ol") {
          var O = x.match(/^ *(\d+)\./);
          if (O && O[1] !== "1")
            return ' start="' + O[1] + '"';
        }
        return "";
      }
      function _(x, M, O) {
        var L = m.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, I = m.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, z = M === "ul" ? L : I, S = "";
        if (x.search(z) !== -1)
          (function N(q) {
            var re = q.search(z), J = w(x, M);
            re !== -1 ? (S += `

<` + M + J + `>
` + b(q.slice(0, re), !!O) + "</" + M + `>
`, M = M === "ul" ? "ol" : "ul", z = M === "ul" ? L : I, N(q.slice(re))) : S += `

<` + M + J + `>
` + b(q, !!O) + "</" + M + `>
`;
          })(x);
        else {
          var R = w(x, M);
          S = `

<` + M + R + `>
` + b(x, !!O) + "</" + M + `>
`;
        }
        return S;
      }
      return d = p.converter._dispatch("lists.before", d, m, p), d += "¨0", p.gListLevel ? d = d.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(x, M, O) {
          var L = O.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return _(M, L, !0);
        }
      ) : d = d.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(x, M, O, L) {
          var I = L.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return _(O, I, !1);
        }
      ), d = d.replace(/¨0/, ""), d = p.converter._dispatch("lists.after", d, m, p), d;
    }), r.subParser("metadata", function(d, m, p) {
      if (!m.metadata)
        return d;
      d = p.converter._dispatch("metadata.before", d, m, p);
      function b(w) {
        p.metadata.raw = w, w = w.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), w = w.replace(/\n {4}/g, " "), w.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(_, x, M) {
          return p.metadata.parsed[x] = M, "";
        });
      }
      return d = d.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(w, _, x) {
        return b(x), "¨M";
      }), d = d.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(w, _, x) {
        return _ && (p.metadata.format = _), b(x), "¨M";
      }), d = d.replace(/¨M/g, ""), d = p.converter._dispatch("metadata.after", d, m, p), d;
    }), r.subParser("outdent", function(d, m, p) {
      return d = p.converter._dispatch("outdent.before", d, m, p), d = d.replace(/^(\t|[ ]{1,4})/gm, "¨0"), d = d.replace(/¨0/g, ""), d = p.converter._dispatch("outdent.after", d, m, p), d;
    }), r.subParser("paragraphs", function(d, m, p) {
      d = p.converter._dispatch("paragraphs.before", d, m, p), d = d.replace(/^\n+/g, ""), d = d.replace(/\n+$/g, "");
      for (var b = d.split(/\n{2,}/g), w = [], _ = b.length, x = 0; x < _; x++) {
        var M = b[x];
        M.search(/¨(K|G)(\d+)\1/g) >= 0 ? w.push(M) : M.search(/\S/) >= 0 && (M = r.subParser("spanGamut")(M, m, p), M = M.replace(/^([ \t]*)/g, "<p>"), M += "</p>", w.push(M));
      }
      for (_ = w.length, x = 0; x < _; x++) {
        for (var O = "", L = w[x], I = !1; /¨(K|G)(\d+)\1/.test(L); ) {
          var z = RegExp.$1, S = RegExp.$2;
          z === "K" ? O = p.gHtmlBlocks[S] : I ? O = r.subParser("encodeCode")(p.ghCodeBlocks[S].text, m, p) : O = p.ghCodeBlocks[S].codeblock, O = O.replace(/\$/g, "$$$$"), L = L.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, O), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(L) && (I = !0);
        }
        w[x] = L;
      }
      return d = w.join(`
`), d = d.replace(/^\n+/g, ""), d = d.replace(/\n+$/g, ""), p.converter._dispatch("paragraphs.after", d, m, p);
    }), r.subParser("runExtension", function(d, m, p, b) {
      if (d.filter)
        m = d.filter(m, b.converter, p);
      else if (d.regex) {
        var w = d.regex;
        w instanceof RegExp || (w = new RegExp(w, "g")), m = m.replace(w, d.replace);
      }
      return m;
    }), r.subParser("spanGamut", function(d, m, p) {
      return d = p.converter._dispatch("spanGamut.before", d, m, p), d = r.subParser("codeSpans")(d, m, p), d = r.subParser("escapeSpecialCharsWithinTagAttributes")(d, m, p), d = r.subParser("encodeBackslashEscapes")(d, m, p), d = r.subParser("images")(d, m, p), d = r.subParser("anchors")(d, m, p), d = r.subParser("autoLinks")(d, m, p), d = r.subParser("simplifiedAutoLinks")(d, m, p), d = r.subParser("emoji")(d, m, p), d = r.subParser("underline")(d, m, p), d = r.subParser("italicsAndBold")(d, m, p), d = r.subParser("strikethrough")(d, m, p), d = r.subParser("ellipsis")(d, m, p), d = r.subParser("hashHTMLSpans")(d, m, p), d = r.subParser("encodeAmpsAndAngles")(d, m, p), m.simpleLineBreaks ? /\n\n¨K/.test(d) || (d = d.replace(/\n+/g, `<br />
`)) : d = d.replace(/  +\n/g, `<br />
`), d = p.converter._dispatch("spanGamut.after", d, m, p), d;
    }), r.subParser("strikethrough", function(d, m, p) {
      function b(w) {
        return m.simplifiedAutoLink && (w = r.subParser("simplifiedAutoLinks")(w, m, p)), "<del>" + w + "</del>";
      }
      return m.strikethrough && (d = p.converter._dispatch("strikethrough.before", d, m, p), d = d.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(w, _) {
        return b(_);
      }), d = p.converter._dispatch("strikethrough.after", d, m, p)), d;
    }), r.subParser("stripLinkDefinitions", function(d, m, p) {
      var b = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, w = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      d += "¨0";
      var _ = function(x, M, O, L, I, z, S) {
        return M = M.toLowerCase(), d.toLowerCase().split(M).length - 1 < 2 ? x : (O.match(/^data:.+?\/.+?;base64,/) ? p.gUrls[M] = O.replace(/\s/g, "") : p.gUrls[M] = r.subParser("encodeAmpsAndAngles")(O, m, p), z ? z + S : (S && (p.gTitles[M] = S.replace(/"|'/g, "&quot;")), m.parseImgDimensions && L && I && (p.gDimensions[M] = {
          width: L,
          height: I
        }), ""));
      };
      return d = d.replace(w, _), d = d.replace(b, _), d = d.replace(/¨0/, ""), d;
    }), r.subParser("tables", function(d, m, p) {
      if (!m.tables)
        return d;
      var b = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, w = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function _(I) {
        return /^:[ \t]*--*$/.test(I) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(I) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(I) ? ' style="text-align:center;"' : "";
      }
      function x(I, z) {
        var S = "";
        return I = I.trim(), (m.tablesHeaderId || m.tableHeaderId) && (S = ' id="' + I.replace(/ /g, "_").toLowerCase() + '"'), I = r.subParser("spanGamut")(I, m, p), "<th" + S + z + ">" + I + `</th>
`;
      }
      function M(I, z) {
        var S = r.subParser("spanGamut")(I, m, p);
        return "<td" + z + ">" + S + `</td>
`;
      }
      function O(I, z) {
        for (var S = `<table>
<thead>
<tr>
`, R = I.length, N = 0; N < R; ++N)
          S += I[N];
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
      function L(I) {
        var z, S = I.split(`
`);
        for (z = 0; z < S.length; ++z)
          /^ {0,3}\|/.test(S[z]) && (S[z] = S[z].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(S[z]) && (S[z] = S[z].replace(/\|[ \t]*$/, "")), S[z] = r.subParser("codeSpans")(S[z], m, p);
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
          return I;
        for (z = 0; z < N.length; ++z)
          J.push(_(N[z]));
        for (z = 0; z < R.length; ++z)
          r.helper.isUndefined(J[z]) && (J[z] = ""), re.push(x(R[z], J[z]));
        for (z = 0; z < q.length; ++z) {
          for (var Me = [], Ae = 0; Ae < re.length; ++Ae)
            r.helper.isUndefined(q[z][Ae]), Me.push(M(q[z][Ae], J[Ae]));
          ce.push(Me);
        }
        return O(re, ce);
      }
      return d = p.converter._dispatch("tables.before", d, m, p), d = d.replace(/\\(\|)/g, r.helper.escapeCharactersCallback), d = d.replace(b, L), d = d.replace(w, L), d = p.converter._dispatch("tables.after", d, m, p), d;
    }), r.subParser("underline", function(d, m, p) {
      return m.underline && (d = p.converter._dispatch("underline.before", d, m, p), m.literalMidWordUnderscores ? (d = d.replace(/\b___(\S[\s\S]*?)___\b/g, function(b, w) {
        return "<u>" + w + "</u>";
      }), d = d.replace(/\b__(\S[\s\S]*?)__\b/g, function(b, w) {
        return "<u>" + w + "</u>";
      })) : (d = d.replace(/___(\S[\s\S]*?)___/g, function(b, w) {
        return /\S$/.test(w) ? "<u>" + w + "</u>" : b;
      }), d = d.replace(/__(\S[\s\S]*?)__/g, function(b, w) {
        return /\S$/.test(w) ? "<u>" + w + "</u>" : b;
      })), d = d.replace(/(_)/g, r.helper.escapeCharactersCallback), d = p.converter._dispatch("underline.after", d, m, p)), d;
    }), r.subParser("unescapeSpecialChars", function(d, m, p) {
      return d = p.converter._dispatch("unescapeSpecialChars.before", d, m, p), d = d.replace(/¨E(\d+)E/g, function(b, w) {
        var _ = parseInt(w);
        return String.fromCharCode(_);
      }), d = p.converter._dispatch("unescapeSpecialChars.after", d, m, p), d;
    }), r.subParser("makeMarkdown.blockquote", function(d, m) {
      var p = "";
      if (d.hasChildNodes())
        for (var b = d.childNodes, w = b.length, _ = 0; _ < w; ++_) {
          var x = r.subParser("makeMarkdown.node")(b[_], m);
          x !== "" && (p += x);
        }
      return p = p.trim(), p = "> " + p.split(`
`).join(`
> `), p;
    }), r.subParser("makeMarkdown.codeBlock", function(d, m) {
      var p = d.getAttribute("language"), b = d.getAttribute("precodenum");
      return "```" + p + `
` + m.preList[b] + "\n```";
    }), r.subParser("makeMarkdown.codeSpan", function(d) {
      return "`" + d.innerHTML + "`";
    }), r.subParser("makeMarkdown.emphasis", function(d, m) {
      var p = "";
      if (d.hasChildNodes()) {
        p += "*";
        for (var b = d.childNodes, w = b.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(b[_], m);
        p += "*";
      }
      return p;
    }), r.subParser("makeMarkdown.header", function(d, m, p) {
      var b = new Array(p + 1).join("#"), w = "";
      if (d.hasChildNodes()) {
        w = b + " ";
        for (var _ = d.childNodes, x = _.length, M = 0; M < x; ++M)
          w += r.subParser("makeMarkdown.node")(_[M], m);
      }
      return w;
    }), r.subParser("makeMarkdown.hr", function() {
      return "---";
    }), r.subParser("makeMarkdown.image", function(d) {
      var m = "";
      return d.hasAttribute("src") && (m += "![" + d.getAttribute("alt") + "](", m += "<" + d.getAttribute("src") + ">", d.hasAttribute("width") && d.hasAttribute("height") && (m += " =" + d.getAttribute("width") + "x" + d.getAttribute("height")), d.hasAttribute("title") && (m += ' "' + d.getAttribute("title") + '"'), m += ")"), m;
    }), r.subParser("makeMarkdown.links", function(d, m) {
      var p = "";
      if (d.hasChildNodes() && d.hasAttribute("href")) {
        var b = d.childNodes, w = b.length;
        p = "[";
        for (var _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(b[_], m);
        p += "](", p += "<" + d.getAttribute("href") + ">", d.hasAttribute("title") && (p += ' "' + d.getAttribute("title") + '"'), p += ")";
      }
      return p;
    }), r.subParser("makeMarkdown.list", function(d, m, p) {
      var b = "";
      if (!d.hasChildNodes())
        return "";
      for (var w = d.childNodes, _ = w.length, x = d.getAttribute("start") || 1, M = 0; M < _; ++M)
        if (!(typeof w[M].tagName > "u" || w[M].tagName.toLowerCase() !== "li")) {
          var O = "";
          p === "ol" ? O = x.toString() + ". " : O = "- ", b += O + r.subParser("makeMarkdown.listItem")(w[M], m), ++x;
        }
      return b += `
<!-- -->
`, b.trim();
    }), r.subParser("makeMarkdown.listItem", function(d, m) {
      for (var p = "", b = d.childNodes, w = b.length, _ = 0; _ < w; ++_)
        p += r.subParser("makeMarkdown.node")(b[_], m);
      return /\n$/.test(p) ? p = p.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : p += `
`, p;
    }), r.subParser("makeMarkdown.node", function(d, m, p) {
      p = p || !1;
      var b = "";
      if (d.nodeType === 3)
        return r.subParser("makeMarkdown.txt")(d, m);
      if (d.nodeType === 8)
        return "<!--" + d.data + `-->

`;
      if (d.nodeType !== 1)
        return "";
      var w = d.tagName.toLowerCase();
      switch (w) {
        case "h1":
          p || (b = r.subParser("makeMarkdown.header")(d, m, 1) + `

`);
          break;
        case "h2":
          p || (b = r.subParser("makeMarkdown.header")(d, m, 2) + `

`);
          break;
        case "h3":
          p || (b = r.subParser("makeMarkdown.header")(d, m, 3) + `

`);
          break;
        case "h4":
          p || (b = r.subParser("makeMarkdown.header")(d, m, 4) + `

`);
          break;
        case "h5":
          p || (b = r.subParser("makeMarkdown.header")(d, m, 5) + `

`);
          break;
        case "h6":
          p || (b = r.subParser("makeMarkdown.header")(d, m, 6) + `

`);
          break;
        case "p":
          p || (b = r.subParser("makeMarkdown.paragraph")(d, m) + `

`);
          break;
        case "blockquote":
          p || (b = r.subParser("makeMarkdown.blockquote")(d, m) + `

`);
          break;
        case "hr":
          p || (b = r.subParser("makeMarkdown.hr")(d, m) + `

`);
          break;
        case "ol":
          p || (b = r.subParser("makeMarkdown.list")(d, m, "ol") + `

`);
          break;
        case "ul":
          p || (b = r.subParser("makeMarkdown.list")(d, m, "ul") + `

`);
          break;
        case "precode":
          p || (b = r.subParser("makeMarkdown.codeBlock")(d, m) + `

`);
          break;
        case "pre":
          p || (b = r.subParser("makeMarkdown.pre")(d, m) + `

`);
          break;
        case "table":
          p || (b = r.subParser("makeMarkdown.table")(d, m) + `

`);
          break;
        case "code":
          b = r.subParser("makeMarkdown.codeSpan")(d, m);
          break;
        case "em":
        case "i":
          b = r.subParser("makeMarkdown.emphasis")(d, m);
          break;
        case "strong":
        case "b":
          b = r.subParser("makeMarkdown.strong")(d, m);
          break;
        case "del":
          b = r.subParser("makeMarkdown.strikethrough")(d, m);
          break;
        case "a":
          b = r.subParser("makeMarkdown.links")(d, m);
          break;
        case "img":
          b = r.subParser("makeMarkdown.image")(d, m);
          break;
        default:
          b = d.outerHTML + `

`;
      }
      return b;
    }), r.subParser("makeMarkdown.paragraph", function(d, m) {
      var p = "";
      if (d.hasChildNodes())
        for (var b = d.childNodes, w = b.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(b[_], m);
      return p = p.trim(), p;
    }), r.subParser("makeMarkdown.pre", function(d, m) {
      var p = d.getAttribute("prenum");
      return "<pre>" + m.preList[p] + "</pre>";
    }), r.subParser("makeMarkdown.strikethrough", function(d, m) {
      var p = "";
      if (d.hasChildNodes()) {
        p += "~~";
        for (var b = d.childNodes, w = b.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(b[_], m);
        p += "~~";
      }
      return p;
    }), r.subParser("makeMarkdown.strong", function(d, m) {
      var p = "";
      if (d.hasChildNodes()) {
        p += "**";
        for (var b = d.childNodes, w = b.length, _ = 0; _ < w; ++_)
          p += r.subParser("makeMarkdown.node")(b[_], m);
        p += "**";
      }
      return p;
    }), r.subParser("makeMarkdown.table", function(d, m) {
      var p = "", b = [[], []], w = d.querySelectorAll("thead>tr>th"), _ = d.querySelectorAll("tbody>tr"), x, M;
      for (x = 0; x < w.length; ++x) {
        var O = r.subParser("makeMarkdown.tableCell")(w[x], m), L = "---";
        if (w[x].hasAttribute("style")) {
          var I = w[x].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (I) {
            case "text-align:left;":
              L = ":---";
              break;
            case "text-align:right;":
              L = "---:";
              break;
            case "text-align:center;":
              L = ":---:";
              break;
          }
        }
        b[0][x] = O.trim(), b[1][x] = L;
      }
      for (x = 0; x < _.length; ++x) {
        var z = b.push([]) - 1, S = _[x].getElementsByTagName("td");
        for (M = 0; M < w.length; ++M) {
          var R = " ";
          typeof S[M] < "u" && (R = r.subParser("makeMarkdown.tableCell")(S[M], m)), b[z].push(R);
        }
      }
      var N = 3;
      for (x = 0; x < b.length; ++x)
        for (M = 0; M < b[x].length; ++M) {
          var q = b[x][M].length;
          q > N && (N = q);
        }
      for (x = 0; x < b.length; ++x) {
        for (M = 0; M < b[x].length; ++M)
          x === 1 ? b[x][M].slice(-1) === ":" ? b[x][M] = r.helper.padEnd(b[x][M].slice(-1), N - 1, "-") + ":" : b[x][M] = r.helper.padEnd(b[x][M], N, "-") : b[x][M] = r.helper.padEnd(b[x][M], N);
        p += "| " + b[x].join(" | ") + ` |
`;
      }
      return p.trim();
    }), r.subParser("makeMarkdown.tableCell", function(d, m) {
      var p = "";
      if (!d.hasChildNodes())
        return "";
      for (var b = d.childNodes, w = b.length, _ = 0; _ < w; ++_)
        p += r.subParser("makeMarkdown.node")(b[_], m, !0);
      return p.trim();
    }), r.subParser("makeMarkdown.txt", function(d) {
      var m = d.nodeValue;
      return m = m.replace(/ +/g, " "), m = m.replace(/¨NBSP;/g, " "), m = r.helper.unescapeHTMLEntities(m), m = m.replace(/([*_~|`])/g, "\\$1"), m = m.replace(/^(\s*)>/g, "\\$1>"), m = m.replace(/^#/gm, "\\#"), m = m.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), m = m.replace(/^( {0,3}\d+)\./gm, "$1\\."), m = m.replace(/^( {0,3})([+-])/gm, "$1\\$2"), m = m.replace(/]([\s]*)\(/g, "\\]$1\\("), m = m.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), m;
    });
    var j = this;
    t.exports ? t.exports = r : j.showdown = r;
  }).call(Fa);
})(zw);
ho([]);
let $w = document.querySelector('link[rel="icon"]');
$w.href;
_s({});
_s({});
const Qt = /* @__PURE__ */ Object.create(null);
Qt.open = "0";
Qt.close = "1";
Qt.ping = "2";
Qt.pong = "3";
Qt.message = "4";
Qt.upgrade = "5";
Qt.noop = "6";
const ci = /* @__PURE__ */ Object.create(null);
Object.keys(Qt).forEach((t) => {
  ci[Qt[t]] = t;
});
const oa = { type: "error", data: "parser error" }, vp = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", wp = typeof ArrayBuffer == "function", xp = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, xc = ({ type: t, data: e }, n, r) => vp && e instanceof Blob ? n ? r(e) : Td(e, r) : wp && (e instanceof ArrayBuffer || xp(e)) ? n ? r(e) : Td(new Blob([e]), r) : r(Qt[t] + (e || "")), Td = (t, e) => {
  const n = new FileReader();
  return n.onload = function() {
    const r = n.result.split(",")[1];
    e("b" + (r || ""));
  }, n.readAsDataURL(t);
};
function jd(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let dl;
function Dw(t, e) {
  if (vp && t.data instanceof Blob)
    return t.data.arrayBuffer().then(jd).then(e);
  if (wp && (t.data instanceof ArrayBuffer || xp(t.data)))
    return e(jd(t.data));
  xc(t, !1, (n) => {
    dl || (dl = new TextEncoder()), e(dl.encode(n));
  });
}
const Od = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Jr = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < Od.length; t++)
  Jr[Od.charCodeAt(t)] = t;
const Bw = (t) => {
  let e = t.length * 0.75, n = t.length, r, s = 0, i, o, l, a;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const c = new ArrayBuffer(e), u = new Uint8Array(c);
  for (r = 0; r < n; r += 4)
    i = Jr[t.charCodeAt(r)], o = Jr[t.charCodeAt(r + 1)], l = Jr[t.charCodeAt(r + 2)], a = Jr[t.charCodeAt(r + 3)], u[s++] = i << 2 | o >> 4, u[s++] = (o & 15) << 4 | l >> 2, u[s++] = (l & 3) << 6 | a & 63;
  return c;
}, Hw = typeof ArrayBuffer == "function", _c = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: _p(t, e)
    };
  const n = t.charAt(0);
  return n === "b" ? {
    type: "message",
    data: Fw(t.substring(1), e)
  } : ci[n] ? t.length > 1 ? {
    type: ci[n],
    data: t.substring(1)
  } : {
    type: ci[n]
  } : oa;
}, Fw = (t, e) => {
  if (Hw) {
    const n = Bw(t);
    return _p(n, e);
  } else
    return { base64: !0, data: t };
}, _p = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, kp = "", Vw = (t, e) => {
  const n = t.length, r = new Array(n);
  let s = 0;
  t.forEach((i, o) => {
    xc(i, !1, (l) => {
      r[o] = l, ++s === n && e(r.join(kp));
    });
  });
}, Ww = (t, e) => {
  const n = t.split(kp), r = [];
  for (let s = 0; s < n.length; s++) {
    const i = _c(n[s], e);
    if (r.push(i), i.type === "error")
      break;
  }
  return r;
};
function Kw() {
  return new TransformStream({
    transform(t, e) {
      Dw(t, (n) => {
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
let fl;
function Js(t) {
  return t.reduce((e, n) => e + n.length, 0);
}
function Ys(t, e) {
  if (t[0].length === e)
    return t.shift();
  const n = new Uint8Array(e);
  let r = 0;
  for (let s = 0; s < e; s++)
    n[s] = t[0][r++], r === t[0].length && (t.shift(), r = 0);
  return t.length && r < t[0].length && (t[0] = t[0].slice(r)), n;
}
function Uw(t, e) {
  fl || (fl = new TextDecoder());
  const n = [];
  let r = 0, s = -1, i = !1;
  return new TransformStream({
    transform(o, l) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (Js(n) < 1)
            break;
          const a = Ys(n, 1);
          i = (a[0] & 128) === 128, s = a[0] & 127, s < 126 ? r = 3 : s === 126 ? r = 1 : r = 2;
        } else if (r === 1) {
          if (Js(n) < 2)
            break;
          const a = Ys(n, 2);
          s = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), r = 3;
        } else if (r === 2) {
          if (Js(n) < 8)
            break;
          const a = Ys(n, 8), c = new DataView(a.buffer, a.byteOffset, a.length), u = c.getUint32(0);
          if (u > Math.pow(2, 21) - 1) {
            l.enqueue(oa);
            break;
          }
          s = u * Math.pow(2, 32) + c.getUint32(4), r = 3;
        } else {
          if (Js(n) < s)
            break;
          const a = Ys(n, s);
          l.enqueue(_c(i ? a : fl.decode(a), e)), r = 0;
        }
        if (s === 0 || s > t) {
          l.enqueue(oa);
          break;
        }
      }
    }
  });
}
const Sp = 4;
function ze(t) {
  if (t)
    return qw(t);
}
function qw(t) {
  for (var e in ze.prototype)
    t[e] = ze.prototype[e];
  return t;
}
ze.prototype.on = ze.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
ze.prototype.once = function(t, e) {
  function n() {
    this.off(t, n), e.apply(this, arguments);
  }
  return n.fn = e, this.on(t, n), this;
};
ze.prototype.off = ze.prototype.removeListener = ze.prototype.removeAllListeners = ze.prototype.removeEventListener = function(t, e) {
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
ze.prototype.emit = function(t) {
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
ze.prototype.emitReserved = ze.prototype.emit;
ze.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
ze.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const Ct = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")();
function Cp(t, ...e) {
  return e.reduce((n, r) => (t.hasOwnProperty(r) && (n[r] = t[r]), n), {});
}
const Gw = Ct.setTimeout, Jw = Ct.clearTimeout;
function Oo(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = Gw.bind(Ct), t.clearTimeoutFn = Jw.bind(Ct)) : (t.setTimeoutFn = Ct.setTimeout.bind(Ct), t.clearTimeoutFn = Ct.clearTimeout.bind(Ct));
}
const Yw = 1.33;
function Xw(t) {
  return typeof t == "string" ? Qw(t) : Math.ceil((t.byteLength || t.size) * Yw);
}
function Qw(t) {
  let e = 0, n = 0;
  for (let r = 0, s = t.length; r < s; r++)
    e = t.charCodeAt(r), e < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || e >= 57344 ? n += 3 : (r++, n += 4);
  return n;
}
function Zw(t) {
  let e = "";
  for (let n in t)
    t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
  return e;
}
function e8(t) {
  let e = {}, n = t.split("&");
  for (let r = 0, s = n.length; r < s; r++) {
    let i = n[r].split("=");
    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return e;
}
class t8 extends Error {
  constructor(e, n, r) {
    super(e), this.description = n, this.context = r, this.type = "TransportError";
  }
}
class kc extends ze {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, Oo(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
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
    return super.emitReserved("error", new t8(e, n, r)), this;
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
    const n = _c(e, this.socket.binaryType);
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
    const n = Zw(e);
    return n.length ? "?" + n : "";
  }
}
const Ep = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), la = 64, n8 = {};
let Rd = 0, Xs = 0, Ld;
function Pd(t) {
  let e = "";
  do
    e = Ep[t % la] + e, t = Math.floor(t / la);
  while (t > 0);
  return e;
}
function Mp() {
  const t = Pd(+/* @__PURE__ */ new Date());
  return t !== Ld ? (Rd = 0, Ld = t) : t + "." + Pd(Rd++);
}
for (; Xs < la; Xs++)
  n8[Ep[Xs]] = Xs;
let Ap = !1;
try {
  Ap = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const r8 = Ap;
function Tp(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || r8))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new Ct[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function s8() {
}
const i8 = function() {
  return new Tp({
    xdomain: !1
  }).responseType != null;
}();
class o8 extends kc {
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
    this.supportsBinary = i8 && !n, this.opts.withCredentials && (this.cookieJar = void 0);
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
    Ww(e, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
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
    this.writable = !1, Vw(e, (n) => {
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
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = Mp()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Creates a request.
   *
   * @param {String} method
   * @private
   */
  request(e = {}) {
    return Object.assign(e, { xd: this.xd, cookieJar: this.cookieJar }, this.opts), new Jt(this.uri(), e);
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
class Jt extends ze {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, n) {
    super(), Oo(this, n), this.opts = n, this.method = n.method || "GET", this.uri = e, this.data = n.data !== void 0 ? n.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const n = Cp(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this.opts.xd;
    const r = this.xhr = new Tp(n);
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
    typeof document < "u" && (this.index = Jt.requestsCount++, Jt.requests[this.index] = this);
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
      if (this.xhr.onreadystatechange = s8, e)
        try {
          this.xhr.abort();
        } catch {
        }
      typeof document < "u" && delete Jt.requests[this.index], this.xhr = null;
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
Jt.requestsCount = 0;
Jt.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", Id);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in Ct ? "pagehide" : "unload";
    addEventListener(t, Id, !1);
  }
}
function Id() {
  for (let t in Jt.requests)
    Jt.requests.hasOwnProperty(t) && Jt.requests[t].abort();
}
const Sc = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, n) => n(e, 0), Qs = Ct.WebSocket || Ct.MozWebSocket, Nd = !0, l8 = "arraybuffer", zd = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class a8 extends kc {
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
    const e = this.uri(), n = this.opts.protocols, r = zd ? {} : Cp(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
    try {
      this.ws = Nd && !zd ? n ? new Qs(e, n) : new Qs(e) : new Qs(e, n, r);
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
      xc(r, this.supportsBinary, (i) => {
        const o = {};
        try {
          Nd && this.ws.send(i);
        } catch {
        }
        s && Sc(() => {
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
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = Mp()), this.supportsBinary || (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @private
   */
  check() {
    return !!Qs;
  }
}
class c8 extends kc {
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
        const n = Uw(Number.MAX_SAFE_INTEGER, this.socket.binaryType), r = e.readable.pipeThrough(n).getReader(), s = Kw();
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
        s && Sc(() => {
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
const u8 = {
  websocket: a8,
  webtransport: c8,
  polling: o8
}, d8 = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, f8 = [
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
function aa(t) {
  if (t.length > 2e3)
    throw "URI too long";
  const e = t, n = t.indexOf("["), r = t.indexOf("]");
  n != -1 && r != -1 && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
  let s = d8.exec(t || ""), i = {}, o = 14;
  for (; o--; )
    i[f8[o]] = s[o] || "";
  return n != -1 && r != -1 && (i.source = e, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = h8(i, i.path), i.queryKey = p8(i, i.query), i;
}
function h8(t, e) {
  const n = /\/{2,9}/g, r = e.replace(n, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && r.splice(0, 1), e.slice(-1) == "/" && r.splice(r.length - 1, 1), r;
}
function p8(t, e) {
  const n = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(r, s, i) {
    s && (n[s] = i);
  }), n;
}
let jp = class yr extends ze {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, n = {}) {
    super(), this.binaryType = l8, this.writeBuffer = [], e && typeof e == "object" && (n = e, e = null), e ? (e = aa(e), n.hostname = e.host, n.secure = e.protocol === "https" || e.protocol === "wss", n.port = e.port, e.query && (n.query = e.query)) : n.host && (n.hostname = aa(n.host).host), Oo(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = n.transports || [
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
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = e8(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
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
    n.EIO = Sp, n.transport = e, this.id && (n.sid = this.id);
    const r = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new u8[e](r);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && yr.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
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
    yr.priorWebsocketSuccess = !1;
    const s = () => {
      r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (f) => {
        if (!r)
          if (f.type === "pong" && f.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            yr.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
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
    if (this.readyState = "open", yr.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
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
      if (s && (n += Xw(s)), r > 0 && n > this.maxPayload)
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
    yr.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
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
jp.protocol = Sp;
function m8(t, e = "", n) {
  let r = t;
  n = n || typeof location < "u" && location, t == null && (t = n.protocol + "//" + n.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = n.protocol + t : t = n.host + t), /^(https?|wss?):\/\//.test(t) || (typeof n < "u" ? t = n.protocol + "//" + t : t = "https://" + t), r = aa(t)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/";
  const i = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return r.id = r.protocol + "://" + i + ":" + r.port + e, r.href = r.protocol + "://" + i + (n && n.port === r.port ? "" : ":" + r.port), r;
}
const g8 = typeof ArrayBuffer == "function", y8 = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Op = Object.prototype.toString, b8 = typeof Blob == "function" || typeof Blob < "u" && Op.call(Blob) === "[object BlobConstructor]", v8 = typeof File == "function" || typeof File < "u" && Op.call(File) === "[object FileConstructor]";
function Cc(t) {
  return g8 && (t instanceof ArrayBuffer || y8(t)) || b8 && t instanceof Blob || v8 && t instanceof File;
}
function ui(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let n = 0, r = t.length; n < r; n++)
      if (ui(t[n]))
        return !0;
    return !1;
  }
  if (Cc(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return ui(t.toJSON(), !0);
  for (const n in t)
    if (Object.prototype.hasOwnProperty.call(t, n) && ui(t[n]))
      return !0;
  return !1;
}
function w8(t) {
  const e = [], n = t.data, r = t;
  return r.data = ca(n, e), r.attachments = e.length, { packet: r, buffers: e };
}
function ca(t, e) {
  if (!t)
    return t;
  if (Cc(t)) {
    const n = { _placeholder: !0, num: e.length };
    return e.push(t), n;
  } else if (Array.isArray(t)) {
    const n = new Array(t.length);
    for (let r = 0; r < t.length; r++)
      n[r] = ca(t[r], e);
    return n;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const n = {};
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (n[r] = ca(t[r], e));
    return n;
  }
  return t;
}
function x8(t, e) {
  return t.data = ua(t.data, e), delete t.attachments, t;
}
function ua(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let n = 0; n < t.length; n++)
      t[n] = ua(t[n], e);
  else if (typeof t == "object")
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (t[n] = ua(t[n], e));
  return t;
}
const _8 = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], k8 = 5;
var de;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(de || (de = {}));
class S8 {
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
    return (e.type === de.EVENT || e.type === de.ACK) && ui(e) ? this.encodeAsBinary({
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
    const n = w8(e), r = this.encodeAsString(n.packet), s = n.buffers;
    return s.unshift(r), s;
  }
}
function $d(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class Ec extends ze {
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
      r || n.type === de.BINARY_ACK ? (n.type = r ? de.EVENT : de.ACK, this.reconstructor = new C8(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (Cc(e) || e.base64)
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
      if (Ec.isPayloadValid(r.type, i))
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
        return $d(n);
      case de.DISCONNECT:
        return n === void 0;
      case de.CONNECT_ERROR:
        return typeof n == "string" || $d(n);
      case de.EVENT:
      case de.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && _8.indexOf(n[0]) === -1);
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
class C8 {
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
      const n = x8(this.reconPack, this.buffers);
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
const E8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Ec,
  Encoder: S8,
  get PacketType() {
    return de;
  },
  protocol: k8
}, Symbol.toStringTag, { value: "Module" }));
function Ot(t, e, n) {
  return t.on(e, n), function() {
    t.off(e, n);
  };
}
const M8 = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Rp extends ze {
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
      Ot(e, "open", this.onopen.bind(this)),
      Ot(e, "packet", this.onpacket.bind(this)),
      Ot(e, "error", this.onerror.bind(this)),
      Ot(e, "close", this.onclose.bind(this))
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
    if (M8.hasOwnProperty(e))
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
function Dr(t) {
  t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
}
Dr.prototype.duration = function() {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), n = Math.floor(e * this.jitter * t);
    t = Math.floor(e * 10) & 1 ? t + n : t - n;
  }
  return Math.min(t, this.max) | 0;
};
Dr.prototype.reset = function() {
  this.attempts = 0;
};
Dr.prototype.setMin = function(t) {
  this.ms = t;
};
Dr.prototype.setMax = function(t) {
  this.max = t;
};
Dr.prototype.setJitter = function(t) {
  this.jitter = t;
};
class da extends ze {
  constructor(e, n) {
    var r;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (n = e, e = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, Oo(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5), this.backoff = new Dr({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = e;
    const s = n.parser || E8;
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
    this.engine = new jp(this.uri, this.opts);
    const n = this.engine, r = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const s = Ot(n, "open", function() {
      r.onopen(), e && e();
    }), i = (l) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", l), e ? e(l) : this.maybeReconnectOnOpen();
    }, o = Ot(n, "error", i);
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
    this.subs.push(Ot(e, "ping", this.onping.bind(this)), Ot(e, "data", this.ondata.bind(this)), Ot(e, "error", this.onerror.bind(this)), Ot(e, "close", this.onclose.bind(this)), Ot(this.decoder, "decoded", this.ondecoded.bind(this)));
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
    Sc(() => {
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
    return r ? this._autoConnect && !r.active && r.connect() : (r = new Rp(this, e, n), this.nsps[e] = r), r;
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
const Fr = {};
function hl(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const n = m8(t, e.path || "/socket.io"), r = n.source, s = n.id, i = n.path, o = Fr[s] && i in Fr[s].nsps, l = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return l ? a = new da(r, e) : (Fr[s] || (Fr[s] = new da(r, e)), a = Fr[s]), n.query && !e.query && (e.query = n.queryKey), a.socket(n.path, e);
}
Object.assign(hl, {
  Manager: da,
  Socket: Rp,
  io: hl,
  connect: hl
});
const A8 = /* @__PURE__ */ wt({
  name: "AuthorizationMessage",
  components: {
    Spinner: d0
  }
}), T8 = { class: "h-screen flex flex-col justify-around items-center bg-gray-400" }, j8 = { class: "block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100" }, O8 = /* @__PURE__ */ ae("p", { class: "text-center text-3xl font-bold text-red-300" }, "Please scan your employee ID to continue.", -1);
function R8(t, e, n, r, s, i) {
  const o = We("Spinner");
  return ne(), pe("div", T8, [
    ae("div", j8, [
      Ce(o, { class: "w-8 mb-4 mx-auto" }),
      O8
    ])
  ]);
}
const Lp = /* @__PURE__ */ rt(A8, [["render", R8]]), L8 = {
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
    const n = ho(0), r = Kn(() => {
      const i = Math.floor(n.value / 60), o = n.value % 60;
      return n.value > 0 ? `Timeout in ${i}m ${o}s` : "Session Timed Out.";
    }), s = () => {
      const i = Date.now();
      n.value = Math.floor((t.tokenExpiration - i) / 1e3);
    };
    return Zm(() => {
      clearInterval(e), t.tokenExpiration && t.tokenExpiration > Date.now() && (e = setInterval(s, 1e3), s());
    }), Ra(() => {
      clearInterval(e);
    }), {
      timeLeftDisplay: r
    };
  }
}, P8 = { class: "text-black-500 xl:text-2xl" }, I8 = /* @__PURE__ */ ae("strong", null, "Employee:", -1), N8 = {
  key: 0,
  class: "text-gray-500 text-m xl:text-xl"
};
function z8(t, e, n, r, s, i) {
  return ne(), pe("div", P8, [
    I8,
    er(" " + ft(n.employeeName) + " ", 1),
    n.tokenExpiration ? (ne(), pe("div", N8, ft(r.timeLeftDisplay), 1)) : Je("", !0)
  ]);
}
const $8 = /* @__PURE__ */ rt(L8, [["render", z8]]), D8 = /* @__PURE__ */ wt({
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
      const e = await Wt("timeclock.www.job_timeclock.log_start_time_of_jobcard", { employee_id: this.employee_id, start_time: this.start_time_frappe, jobcard_name: t.name });
      e?.status === "success" ? (console.log("Start Time sent."), this.taskStarted = !0, this.start_timer(this.startTime)) : (console.log("did not work."), console.log(e.job_card));
    },
    start_timer(t) {
      this.interval = setInterval(() => {
        const n = (/* @__PURE__ */ new Date()).getTime() - t.getTime(), r = Math.floor(n / (1e3 * 60 * 60)), s = Math.floor(n % (1e3 * 60 * 60) / (1e3 * 60)), i = Math.floor(n % (1e3 * 60) / 1e3);
        this.elapsedTime = `${r.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
      }, 1e3);
    },
    async stopTask(t) {
      this.endTime = /* @__PURE__ */ new Date(), this.end_time_frappe = this.get_time_in_string(this.endTime), (await Wt("timeclock.www.job_timeclock.log_end_time_of_jobcard", { employee_id: this.employee_id, end_time: this.end_time_frappe, jobcard_name: t.name }))?.status === "success" ? (console.log("End Time sent."), clearInterval(this.interval), this.taskStarted = !1) : console.log("End job card did not work.");
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
}), B8 = /* @__PURE__ */ ae("h4", { class: "font-bold text-xl" }, "Task Timer", -1), H8 = {
  key: 2,
  class: "text-gray-700 text-md font-family-sans"
};
function F8(t, e, n, r, s, i) {
  return ne(), pe("div", null, [
    B8,
    t.taskStarted === !1 && t.completed_jobCard === !1 ? (ne(), pe("button", {
      key: 0,
      class: "bg-green-400 text-white font-normal lg:text-3xl focus:bg-green-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
      onClick: e[0] || (e[0] = (o) => t.startTask(t.jobCard))
    }, "Start Timer")) : Je("", !0),
    t.taskStarted && t.completed_jobCard === !1 ? (ne(), pe("button", {
      key: 1,
      class: "bg-red-400 text-white font-normal lg:text-3xl focus:bg-red-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
      onClick: e[1] || (e[1] = (o) => t.stopTask(t.jobCard))
    }, "Stop Timer")) : Je("", !0),
    ae("button", {
      class: "bg-gray-800 text-white font-normal lg:text-3xl focus:bg-gray-200 rounded-md px-2 py-4 lg:px-8 lg:py-8",
      onClick: e[2] || (e[2] = (...o) => t.complete_task && t.complete_task(...o))
    }, "Complete"),
    t.completed_jobCard === !1 ? (ne(), pe("p", H8, ft(t.elapsedTime), 1)) : Je("", !0)
  ]);
}
const Pp = /* @__PURE__ */ rt(D8, [["render", F8]]), V8 = {}, W8 = { class: "card divide-y divide-gray-100 rounded-md border border-gray-200 flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 mt-2 mb-2" };
function K8(t, e) {
  return ne(), pe("div", W8, [
    vr(t.$slots, "default")
  ]);
}
const Ro = /* @__PURE__ */ rt(V8, [["render", K8]]), U8 = /* @__PURE__ */ wt({
  name: "WorkOrderWidget",
  components: {
    Card: Ro
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
}), q8 = { class: "flex flex-col" }, G8 = { class: "text-xl xl:text-4xl" }, J8 = {
  key: 0,
  class: "text-lg"
}, Y8 = {
  key: 0,
  class: "px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"
};
function X8(t, e, n, r, s, i) {
  const o = We("Card");
  return ne(), tt(o, {
    onClick: t.click,
    class: Ut([{ "bg-blue-100": t.isSelected }, "overflow-hidden"])
  }, {
    default: sn(() => [
      ae("div", q8, [
        ae("h3", G8, ft(t.workOrder.production_item), 1),
        t.selected === !1 ? (ne(), pe("span", J8, ft(t.workOrder.name), 1)) : Je("", !0)
      ]),
      t.selected === !1 ? (ne(), pe("span", Y8, ft(t.workOrder.status), 1)) : Je("", !0)
    ]),
    _: 1
  }, 8, ["onClick", "class"]);
}
const Q8 = /* @__PURE__ */ rt(U8, [["render", X8]]);
var Z8 = typeof global == "object" && global && global.Object === Object && global, ex = typeof self == "object" && self && self.Object === Object && self, Ip = Z8 || ex || Function("return this")(), so = Ip.Symbol, Np = Object.prototype, tx = Np.hasOwnProperty, nx = Np.toString, Vr = so ? so.toStringTag : void 0;
function rx(t) {
  var e = tx.call(t, Vr), n = t[Vr];
  try {
    t[Vr] = void 0;
    var r = !0;
  } catch {
  }
  var s = nx.call(t);
  return r && (e ? t[Vr] = n : delete t[Vr]), s;
}
var sx = Object.prototype, ix = sx.toString;
function ox(t) {
  return ix.call(t);
}
var lx = "[object Null]", ax = "[object Undefined]", Dd = so ? so.toStringTag : void 0;
function cx(t) {
  return t == null ? t === void 0 ? ax : lx : Dd && Dd in Object(t) ? rx(t) : ox(t);
}
function ux(t) {
  return t != null && typeof t == "object";
}
var dx = "[object Symbol]";
function fx(t) {
  return typeof t == "symbol" || ux(t) && cx(t) == dx;
}
var hx = /\s/;
function px(t) {
  for (var e = t.length; e-- && hx.test(t.charAt(e)); )
    ;
  return e;
}
var mx = /^\s+/;
function gx(t) {
  return t && t.slice(0, px(t) + 1).replace(mx, "");
}
function io(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var Bd = NaN, yx = /^[-+]0x[0-9a-f]+$/i, bx = /^0b[01]+$/i, vx = /^0o[0-7]+$/i, wx = parseInt;
function Hd(t) {
  if (typeof t == "number")
    return t;
  if (fx(t))
    return Bd;
  if (io(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = io(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = gx(t);
  var n = bx.test(t);
  return n || vx.test(t) ? wx(t.slice(2), n ? 2 : 8) : yx.test(t) ? Bd : +t;
}
var pl = function() {
  return Ip.Date.now();
}, xx = "Expected a function", _x = Math.max, kx = Math.min;
function di(t, e, n) {
  var r, s, i, o, l, a, c = 0, u = !1, f = !1, h = !0;
  if (typeof t != "function")
    throw new TypeError(xx);
  e = Hd(e) || 0, io(n) && (u = !!n.leading, f = "maxWait" in n, i = f ? _x(Hd(n.maxWait) || 0, e) : i, h = "trailing" in n ? !!n.trailing : h);
  function g(p) {
    var b = r, w = s;
    return r = s = void 0, c = p, o = t.apply(w, b), o;
  }
  function y(p) {
    return c = p, l = setTimeout(E, e), u ? g(p) : o;
  }
  function v(p) {
    var b = p - a, w = p - c, _ = e - b;
    return f ? kx(_, i - w) : _;
  }
  function k(p) {
    var b = p - a, w = p - c;
    return a === void 0 || b >= e || b < 0 || f && w >= i;
  }
  function E() {
    var p = pl();
    if (k(p))
      return T(p);
    l = setTimeout(E, v(p));
  }
  function T(p) {
    return l = void 0, h && r ? g(p) : (r = s = void 0, o);
  }
  function j() {
    l !== void 0 && clearTimeout(l), c = 0, r = a = s = l = void 0;
  }
  function d() {
    return l === void 0 ? o : T(pl());
  }
  function m() {
    var p = pl(), b = k(p);
    if (r = arguments, s = this, a = p, b) {
      if (l === void 0)
        return y(a);
      if (f)
        return clearTimeout(l), l = setTimeout(E, e), g(a);
    }
    return l === void 0 && (l = setTimeout(E, e)), o;
  }
  return m.cancel = j, m.flush = d, m;
}
var Sx = "Expected a function";
function Cx(t, e, n) {
  var r = !0, s = !0;
  if (typeof t != "function")
    throw new TypeError(Sx);
  return io(n) && (r = "leading" in n ? !!n.leading : r, s = "trailing" in n ? !!n.trailing : s), di(t, e, {
    leading: r,
    maxWait: e,
    trailing: s
  });
}
var Ex = !!(typeof window < "u" && window.document && window.document.createElement), Mx = Ex;
const zp = /* @__PURE__ */ Va(Mx);
var wr = function() {
  return wr = Object.assign || function(e) {
    for (var n, r = 1, s = arguments.length; r < s; r++) {
      n = arguments[r];
      for (var i in n)
        Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, wr.apply(this, arguments);
}, br = null, Fd = null;
zp && window.addEventListener("resize", function() {
  Fd !== window.devicePixelRatio && (Fd = window.devicePixelRatio, br = null);
});
function Vd() {
  if (br === null) {
    if (typeof document > "u")
      return br = 0, br;
    var t = document.body, e = document.createElement("div");
    e.classList.add("simplebar-hide-scrollbar"), t.appendChild(e);
    var n = e.getBoundingClientRect().right;
    t.removeChild(e), br = n;
  }
  return br;
}
function $p(t) {
  return !t || !t.ownerDocument || !t.ownerDocument.defaultView ? window : t.ownerDocument.defaultView;
}
function Dp(t) {
  return !t || !t.ownerDocument ? document : t.ownerDocument;
}
var Bp = function(t) {
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
function Hp(t, e) {
  var n;
  t && (n = t.classList).add.apply(n, e.split(" "));
}
function Fp(t, e) {
  t && e.split(" ").forEach(function(n) {
    t.classList.remove(n);
  });
}
function Vp(t) {
  return ".".concat(t.split(" ").join("."));
}
var Ax = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getElementWindow: $p,
  getElementDocument: Dp,
  getOptions: Bp,
  addClasses: Hp,
  removeClasses: Fp,
  classNamesToQuery: Vp
}), dn = $p, ml = Dp, Tx = Bp, fn = Hp, hn = Fp, at = Vp, oo = (
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
        var s = dn(r.el);
        r.scrollXTicking || (s.requestAnimationFrame(r.scrollX), r.scrollXTicking = !0), r.scrollYTicking || (s.requestAnimationFrame(r.scrollY), r.scrollYTicking = !0), r.isScrolling || (r.isScrolling = !0, fn(r.el, r.classNames.scrolling)), r.showScrollbar("x"), r.showScrollbar("y"), r.onStopScrolling();
      }, this.scrollX = function() {
        r.axis.x.isOverflowing && r.positionScrollbar("x"), r.scrollXTicking = !1;
      }, this.scrollY = function() {
        r.axis.y.isOverflowing && r.positionScrollbar("y"), r.scrollYTicking = !1;
      }, this._onStopScrolling = function() {
        hn(r.el, r.classNames.scrolling), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isScrolling = !1;
      }, this.onMouseEnter = function() {
        r.isMouseEntering || (fn(r.el, r.classNames.mouseEntered), r.showScrollbar("x"), r.showScrollbar("y"), r.isMouseEntering = !0), r.onMouseEntered();
      }, this._onMouseEntered = function() {
        hn(r.el, r.classNames.mouseEntered), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isMouseEntering = !1;
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
        var i, o, l, a, c, u, f, h, g, y, v;
        if (!(!r.draggedAxis || !r.contentWrapperEl)) {
          var k, E = r.axis[r.draggedAxis].track, T = (o = (i = E.rect) === null || i === void 0 ? void 0 : i[r.axis[r.draggedAxis].sizeAttr]) !== null && o !== void 0 ? o : 0, j = r.axis[r.draggedAxis].scrollbar, d = (a = (l = r.contentWrapperEl) === null || l === void 0 ? void 0 : l[r.axis[r.draggedAxis].scrollSizeAttr]) !== null && a !== void 0 ? a : 0, m = parseInt((u = (c = r.elStyles) === null || c === void 0 ? void 0 : c[r.axis[r.draggedAxis].sizeAttr]) !== null && u !== void 0 ? u : "0px", 10);
          s.preventDefault(), s.stopPropagation(), r.draggedAxis === "y" ? k = s.pageY : k = s.pageX;
          var p = k - ((h = (f = E.rect) === null || f === void 0 ? void 0 : f[r.axis[r.draggedAxis].offsetAttr]) !== null && h !== void 0 ? h : 0) - r.axis[r.draggedAxis].dragOffset;
          p = r.draggedAxis === "x" && r.isRtl ? ((y = (g = E.rect) === null || g === void 0 ? void 0 : g[r.axis[r.draggedAxis].sizeAttr]) !== null && y !== void 0 ? y : 0) - j.size - p : p;
          var b = p / (T - j.size), w = b * (d - m);
          r.draggedAxis === "x" && r.isRtl && (w = !((v = t.getRtlHelpers()) === null || v === void 0) && v.isScrollingToNegative ? -w : w), r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = w;
        }
      }, this.onEndDrag = function(s) {
        var i = ml(r.el), o = dn(r.el);
        s.preventDefault(), s.stopPropagation(), hn(r.el, r.classNames.dragging), i.removeEventListener("mousemove", r.drag, !0), i.removeEventListener("mouseup", r.onEndDrag, !0), r.removePreventClickId = o.setTimeout(function() {
          i.removeEventListener("click", r.preventClick, !0), i.removeEventListener("dblclick", r.preventClick, !0), r.removePreventClickId = null;
        });
      }, this.preventClick = function(s) {
        s.preventDefault(), s.stopPropagation();
      }, this.el = e, this.options = wr(wr({}, t.defaultOptions), n), this.classNames = wr(wr({}, t.defaultOptions.classNames), n.classNames), this.axis = {
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
      this.onMouseMove = Cx(this._onMouseMove, 64), this.onWindowResize = di(this._onWindowResize, 64, { leading: !0 }), this.onStopScrolling = di(this._onStopScrolling, this.stopScrollDelay), this.onMouseEntered = di(this._onMouseEntered, this.stopScrollDelay), this.init();
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
        return this.contentWrapperEl && getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display === "none" || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style ? 0 : Vd();
      } catch {
        return Vd();
      }
    }, t.getOffset = function(e) {
      var n = e.getBoundingClientRect(), r = ml(e), s = dn(e);
      return {
        top: n.top + (s.pageYOffset || r.documentElement.scrollTop),
        left: n.left + (s.pageXOffset || r.documentElement.scrollLeft)
      };
    }, t.prototype.init = function() {
      zp && (this.initDOM(), this.rtlHelpers = t.getRtlHelpers(), this.scrollbarWidth = this.getScrollbarWidth(), this.recalculate(), this.initListeners());
    }, t.prototype.initDOM = function() {
      var e, n;
      this.wrapperEl = this.el.querySelector(at(this.classNames.wrapper)), this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector(at(this.classNames.contentWrapper)), this.contentEl = this.options.contentNode || this.el.querySelector(at(this.classNames.contentEl)), this.offsetEl = this.el.querySelector(at(this.classNames.offset)), this.maskEl = this.el.querySelector(at(this.classNames.mask)), this.placeholderEl = this.findChild(this.wrapperEl, at(this.classNames.placeholder)), this.heightAutoObserverWrapperEl = this.el.querySelector(at(this.classNames.heightAutoObserverWrapperEl)), this.heightAutoObserverEl = this.el.querySelector(at(this.classNames.heightAutoObserverEl)), this.axis.x.track.el = this.findChild(this.el, "".concat(at(this.classNames.track)).concat(at(this.classNames.horizontal))), this.axis.y.track.el = this.findChild(this.el, "".concat(at(this.classNames.track)).concat(at(this.classNames.vertical))), this.axis.x.scrollbar.el = ((e = this.axis.x.track.el) === null || e === void 0 ? void 0 : e.querySelector(at(this.classNames.scrollbar))) || null, this.axis.y.scrollbar.el = ((n = this.axis.y.track.el) === null || n === void 0 ? void 0 : n.querySelector(at(this.classNames.scrollbar))) || null, this.options.autoHide || (fn(this.axis.x.scrollbar.el, this.classNames.visible), fn(this.axis.y.scrollbar.el, this.classNames.visible));
    }, t.prototype.initListeners = function() {
      var e = this, n, r = dn(this.el);
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
        var e = dn(this.el);
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
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && !this.axis[e].scrollbar.isVisible && (fn(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !0);
    }, t.prototype.hideScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && this.axis[e].scrollbar.isVisible && (hn(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !1);
    }, t.prototype.hideNativeScrollbar = function() {
      this.offsetEl && (this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px", this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px");
    }, t.prototype.onMouseMoveForAxis = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e];
      !n.track.el || !n.scrollbar.el || (n.track.rect = n.track.el.getBoundingClientRect(), n.scrollbar.rect = n.scrollbar.el.getBoundingClientRect(), this.isWithinBounds(n.track.rect) ? (this.showScrollbar(e), fn(n.track.el, this.classNames.hover), this.isWithinBounds(n.scrollbar.rect) ? fn(n.scrollbar.el, this.classNames.hover) : hn(n.scrollbar.el, this.classNames.hover)) : (hn(n.track.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e)));
    }, t.prototype.onMouseLeaveForAxis = function(e) {
      e === void 0 && (e = "y"), hn(this.axis[e].track.el, this.classNames.hover), hn(this.axis[e].scrollbar.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e);
    }, t.prototype.onDragStart = function(e, n) {
      var r;
      n === void 0 && (n = "y");
      var s = ml(this.el), i = dn(this.el), o = this.axis[n].scrollbar, l = n === "y" ? e.pageY : e.pageX;
      this.axis[n].dragOffset = l - (((r = o.rect) === null || r === void 0 ? void 0 : r[this.axis[n].offsetAttr]) || 0), this.draggedAxis = n, fn(this.el, this.classNames.dragging), s.addEventListener("mousemove", this.drag, !0), s.addEventListener("mouseup", this.onEndDrag, !0), this.removePreventClickId === null ? (s.addEventListener("click", this.preventClick, !0), s.addEventListener("dblclick", this.preventClick, !0)) : (i.clearTimeout(this.removePreventClickId), this.removePreventClickId = null);
    }, t.prototype.onTrackClick = function(e, n) {
      var r = this, s, i, o, l;
      n === void 0 && (n = "y");
      var a = this.axis[n];
      if (!(!this.options.clickOnTrack || !a.scrollbar.el || !this.contentWrapperEl)) {
        e.preventDefault();
        var c = dn(this.el);
        this.axis[n].scrollbar.rect = a.scrollbar.el.getBoundingClientRect();
        var u = this.axis[n].scrollbar, f = (i = (s = u.rect) === null || s === void 0 ? void 0 : s[this.axis[n].offsetAttr]) !== null && i !== void 0 ? i : 0, h = parseInt((l = (o = this.elStyles) === null || o === void 0 ? void 0 : o[this.axis[n].sizeAttr]) !== null && l !== void 0 ? l : "0px", 10), g = this.contentWrapperEl[this.axis[n].scrollOffsetAttr], y = n === "y" ? this.mouseY - f : this.mouseX - f, v = y < 0 ? -1 : 1, k = v === -1 ? g - h : g + h, E = 40, T = function() {
          r.contentWrapperEl && (v === -1 ? g > k && (g -= E, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = g, c.requestAnimationFrame(T)) : g < k && (g += E, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = g, c.requestAnimationFrame(T)));
        };
        T();
      }
    }, t.prototype.getContentElement = function() {
      return this.contentEl;
    }, t.prototype.getScrollElement = function() {
      return this.contentWrapperEl;
    }, t.prototype.removeListeners = function() {
      var e = dn(this.el);
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
    }, t.getOptions = Tx, t.helpers = Ax, t;
  }()
), qn = function() {
  return qn = Object.assign || function(e) {
    for (var n, r = 1, s = arguments.length; r < s; r++) {
      n = arguments[r];
      for (var i in n)
        Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, qn.apply(this, arguments);
}, jx = {
  beforeUnmount: "beforeUnmount",
  unmount: "unmount"
}, Wr;
function Ox(t) {
  var e, n = t.h, r = t.emit, s = t.slots, i = t.props, o = function(a) {
    return r("scroll", a);
  }, l = qn(qn({}, oo.defaultOptions.classNames), i.classNames);
  return n("div", qn({ ref: "element" }, {
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
          n("div", qn(qn({}, {
            onScroll: o,
            class: l.contentWrapper,
            tabIndex: 0,
            role: "region",
            "aria-label": i.ariaLabel || oo.defaultOptions.ariaLabel
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
var Rx = /* @__PURE__ */ wt((Wr = {
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
    for (var t = oo.getOptions(this.$refs.element.attributes), e = 0, n = Object.entries(this.$props); e < n.length; e++) {
      var r = n[e], s = r[0], i = r[1];
      i != null && typeof i != "function" && (t[s] = i);
    }
    this.SimpleBar = new oo(this.$refs.element, t), this.scrollElement = this.$refs.scrollElement, this.contentElement = this.$refs.contentElement;
  }
}, Wr[jx.beforeUnmount] = function() {
  var t;
  (t = this.SimpleBar) === null || t === void 0 || t.unMount(), this.SimpleBar = void 0;
}, Wr.methods = {
  recalculate: function() {
    var t;
    (t = this.SimpleBar) === null || t === void 0 || t.recalculate();
  }
}, /**
 * Note that createElement argument is only provided in <=vue@2.7.x,
 * in other versions it's a context object that we do not use.
 */
Wr.render = function(t) {
  var e = this;
  return Ox({
    h: typeof t == "function" ? t : Da,
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
}, Wr));
const Lx = /* @__PURE__ */ wt({
  name: "Column",
  components: {
    Simplebar: Rx
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
}), Px = { class: "px-4 py-6 sm:px-0" }, Ix = { class: "text-lg leading-6 font-medium text-gray-900" }, Nx = { class: "mt-1 text-sm text-gray-500" };
function zx(t, e, n, r, s, i) {
  const o = We("Simplebar");
  return ne(), tt(o, {
    class: "flex-none transition ease-in-out duration-500 py-6 sm:px-6 lg:px-8",
    transition: "expand"
  }, {
    default: sn(() => [
      ae("div", Px, [
        ae("h3", Ix, ft(t.title), 1),
        ae("p", Nx, ft(t.description), 1)
      ]),
      vr(t.$slots, "default")
    ]),
    _: 3
  });
}
const Wp = /* @__PURE__ */ rt(Lx, [["render", zx]]), $x = /* @__PURE__ */ wt({
  name: "WorkOrderList",
  components: {
    WorkOrderWidget: Q8,
    Column: Wp
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
function Dx(t, e, n, r, s, i) {
  const o = We("WorkOrderWidget"), l = We("Column");
  return ne(), tt(l, {
    class: Ut({ "w-full": !t.selectedWorkOrder, "w-1/2": t.selectedWorkOrder }),
    title: "Work Orders",
    description: "Select a work order to view job cards"
  }, {
    default: sn(() => [
      ae("div", null, [
        (ne(!0), pe(Pe, null, La(t.workOrders, (a) => (ne(), tt(o, {
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
const Bx = /* @__PURE__ */ rt($x, [["render", Dx]]), Hx = {
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
function Fx(t, e, n, r, s, i) {
  return ne(), pe(Pe, null, [
    ae("button", {
      class: "btn",
      onClick: e[0] || (e[0] = (...o) => i.starttimer && i.starttimer(...o))
    }, "Start"),
    ae("button", {
      class: "btn",
      onClick: e[1] || (e[1] = (...o) => i.stoptimer && i.stoptimer(...o))
    }, "Stop")
  ], 64);
}
const Vx = /* @__PURE__ */ rt(Hx, [["render", Fx], ["__scopeId", "data-v-dbc45126"]]), Wx = /* @__PURE__ */ wt({
  name: "JobCardWidget",
  components: {
    Button: Vx,
    Card: Ro,
    TimerWidget: Pp
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
}), Kx = { class: "w-2/5" };
function Ux(t, e, n, r, s, i) {
  const o = We("TimerWidget"), l = We("Card");
  return ne(), tt(l, { class: "flex flex-row font-sans text-black text-lg lg:text-4xl" }, {
    default: sn(() => [
      ae("div", Kx, ft(t.jobCard.operation), 1),
      Ce(o, {
        class: "w-3/5",
        jobCard: t.jobCard,
        employee_id: t.employee_id
      }, null, 8, ["jobCard", "employee_id"])
    ]),
    _: 1
  });
}
const qx = /* @__PURE__ */ rt(Wx, [["render", Ux]]), Gx = /* @__PURE__ */ wt({
  name: "JobCards",
  components: {
    JobCardWidget: qx,
    Column: Wp
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
}), Jx = { id: "JobCards" };
function Yx(t, e, n, r, s, i) {
  const o = We("JobCardWidget"), l = We("Column");
  return ne(), tt(l, {
    title: "Job Cards",
    description: "Select a job card to start the timer",
    class: "w-1/2"
  }, {
    default: sn(() => [
      ae("div", Jx, [
        (ne(!0), pe(Pe, null, La(t.jobCards, (a) => (ne(), tt(o, {
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
const Xx = /* @__PURE__ */ rt(Gx, [["render", Yx]]), Qx = /* @__PURE__ */ wt({
  name: "Employee List",
  components: {
    Card: Ro
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
}), Zx = { class: "flex-row overflow-x-auto w-screen" }, e_ = { class: "text-4xl center font-thin" };
function t_(t, e, n, r, s, i) {
  const o = We("Card");
  return ne(), pe("div", Zx, [
    (ne(!0), pe(Pe, null, La(t.employees, (l) => (ne(), tt(o, {
      class: "w-full p-4 m-4 bg-white shadow-lg rounded-lg box-border h-20 hover:bg-blue-300 justify_content:center",
      key: l.id,
      onClick: (a) => t.send_employee(l)
    }, {
      default: sn(() => [
        ae("h1", e_, ft(l.name), 1)
      ]),
      _: 2
    }, 1032, ["onClick"]))), 128))
  ]);
}
const Kp = /* @__PURE__ */ rt(Qx, [["render", t_]]), n_ = /* @__PURE__ */ wt({
  name: "LogInModule",
  components: {
    Card: Ro,
    Button: s0
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
      (await Wt("timeclock.www.job_timeclock.verify_login", t))?.status === "success" ? (this.verified = !0, this.authenticated = !0, this.$emit("submit_login", this.authenticated)) : (this.error_message = "Incorrect Login and/or Password. Please try again.", this.password = "");
    },
    return_trigger() {
      this.return_triggered = !0, this.$emit("return_triggered", this.return_triggered);
    }
  },
  unmounted() {
    this.password = "", this.verified = !1, this.error_message = "", this.return_triggered = !1;
  }
}), Up = (t) => (Aa("data-v-fea387e5"), t = t(), Ta(), t), r_ = { class: "backdrop" }, s_ = /* @__PURE__ */ Up(() => /* @__PURE__ */ ae("h3", null, "Username:", -1)), i_ = /* @__PURE__ */ Up(() => /* @__PURE__ */ ae("h3", null, "Password:", -1));
function o_(t, e, n, r, s, i) {
  const o = We("Card");
  return ne(), pe("div", r_, [
    Ce(o, { class: "card" }, {
      default: sn(() => [
        s_,
        er(),
        Fc(ae("input", {
          type: "email",
          required: "",
          "onUpdate:modelValue": e[0] || (e[0] = (l) => t.email = l)
        }, null, 512), [
          [yu, t.email]
        ]),
        i_,
        er(),
        Fc(ae("input", {
          type: "password",
          required: "",
          "onUpdate:modelValue": e[1] || (e[1] = (l) => t.password = l)
        }, null, 512), [
          [yu, t.password]
        ]),
        er(" " + ft(this.error_message) + " ", 1),
        ae("button", {
          class: "btn",
          onClick: e[2] || (e[2] = (l) => t.submit_login(this.email, this.password))
        }, " Submit "),
        ae("button", {
          class: "btn",
          onClick: e[3] || (e[3] = (...l) => t.return_trigger && t.return_trigger(...l))
        }, " Return ")
      ]),
      _: 1
    })
  ]);
}
const l_ = /* @__PURE__ */ rt(n_, [["render", o_], ["__scopeId", "data-v-fea387e5"]]), a_ = /* @__PURE__ */ wt({
  name: "StartScreen",
  components: {
    EmployeeList: Kp,
    LogInModule: l_,
    AuthorizationMessage: Lp
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
}), Mc = (t) => (Aa("data-v-5fe76613"), t = t(), Ta(), t), c_ = {
  key: 0,
  class: "h-screen flex flex-col justify-around items-center"
}, u_ = /* @__PURE__ */ Mc(() => /* @__PURE__ */ ae("p", { class: "text-4xl" }, "or", -1)), d_ = { key: 1 }, f_ = { key: 2 }, h_ = /* @__PURE__ */ Mc(() => /* @__PURE__ */ ae("h1", { class: "text-3xl font-bold top-50" }, "Employee List", -1)), p_ = /* @__PURE__ */ Mc(() => /* @__PURE__ */ ae("p", null, "Click who you are:", -1));
function m_(t, e, n, r, s, i) {
  const o = We("AuthorizationMessage"), l = We("LogInModule"), a = We("EmployeeList");
  return ne(), pe(Pe, null, [
    t.log_in === !1 && this.authenticated === !1 ? (ne(), pe("div", c_, [
      ae("button", {
        class: "bg-green-300 rounded-full text-center-white me-2 mb-2 px-5 py-2 active:bg-green-500 focus:outline-none focus:ring focus:ring-green-200",
        onClick: e[0] || (e[0] = (...c) => t.log_in_module && t.log_in_module(...c))
      }, "ERP Log In"),
      u_,
      Ce(o)
    ])) : Je("", !0),
    t.log_in ? (ne(), pe("div", d_, [
      Ce(l, {
        onReturn_triggered: t.return_triggered,
        onSubmit_login: t.return_auth
      }, null, 8, ["onReturn_triggered", "onSubmit_login"])
    ])) : Je("", !0),
    t.log_in === !1 && this.authenticated ? (ne(), pe("div", f_, [
      h_,
      p_,
      Ce(a, {
        employees: t.employees,
        onSend_employee: t.return_employee
      }, null, 8, ["employees", "onSend_employee"])
    ])) : Je("", !0)
  ], 64);
}
const g_ = /* @__PURE__ */ rt(a_, [["render", m_], ["__scopeId", "data-v-5fe76613"]]), y_ = /* @__PURE__ */ wt({
  name: "JobTimeClock",
  components: {
    AuthorizationMessage: Lp,
    JobCardList: Xx,
    SessionTimer: $8,
    TimerWidget: Pp,
    WorkOrderList: Bx,
    EmployeeList: Kp,
    StartScreen: g_
  },
  data() {
    return {
      employeeId: "",
      employeeName: "",
      header: "Job Timeclock",
      jobCards: [],
      selectedWorkOrder: null,
      showAuthMessage: !1,
      token: Hg("token", null),
      tokenExpiration: 0,
      workOrders: [],
      activeSession: !1,
      employeeLoggedIn: !1,
      employees: []
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
      const t = await Wt("timeclock.www.job_timeclock.check_for_erp_log_in", {});
      t.user_id === "Guest" ? console.log(t.user_id) : console.log("Session logged in", t.user_id);
    },
    // async test_erp_log_in(){
    //     const response = await FrappeCall('login', { usr: 'Administrator', pwd: 'admin' });
    //     console.log(response);
    // },
    async authenticateEmployee(t) {
      const e = await Wt("timeclock.www.job_timeclock.authenticate_employee", { rfid: t });
      e?.status === "success" ? (this.token = e.token, this.activeSession = !0, e.last_checkin === "OUT" ? this.log_employee_in(this.token) : this.employeeLoggedIn = !0, await this.getWorkOrders()) : (console.log("Sorry! You are not authenticated."), console.log(e.message), this.activeSession = !1);
    },
    async decodeToken() {
      const t = Wg(this.token);
      this.tokenExpiration = t.exp * 1e3, this.employeeId = t.employee_id, this.employeeName = t.employee_name, console.log("Hurrah! You are authenticated as ", t.employee_name);
      const e = Date.now(), n = this.tokenExpiration - e;
      this.resetTimer(n);
    },
    async getWorkOrders() {
      const t = await Wt("timeclock.www.job_timeclock.get_work_orders", { token: this.token });
      t?.status === "success" ? (this.token = t.token, this.workOrders = t.work_orders) : (this.workOrders = [], this.activeSession = !1);
    },
    selectWorkOrder(t) {
      this.selectedWorkOrder = t, this.getJobCards(t.name);
    },
    async getJobCards(t) {
      const e = await Wt("timeclock.www.job_timeclock.get_job_cards", { token: this.token, work_order: t });
      e?.status === "success" ? (this.token = e.token, this.jobCards = e.job_cards, this.time_logs = e.time_logs) : (this.jobCards = [], this.activeSession = !1);
    },
    // These functions are to turn off the session once it is done. 
    setSessionFalse() {
      this.activeSession = !1, console.log("Logged out of Job Time Clock Session");
    },
    startTimer(t) {
      setTimeout(this.setSessionFalse, t);
    },
    resetTimer(t) {
      clearTimeout(this.timeoutId), this.startTimer(t);
    },
    async log_employee_in(t) {
      this.date = /* @__PURE__ */ new Date();
      const e = this.date.getUTCFullYear(), n = this.date.getUTCMonth() + 1, r = this.date.getUTCDate(), s = this.date.getUTCHours(), i = this.date.getUTCMinutes();
      this.date.getUTCSeconds();
      const o = (c) => c < 10 ? "0" + c : c, l = `${e}-${o(n)}-${o(r)} ${o(s - 5)}:${o(i)}`;
      (await Wt("timeclock.www.job_timeclock.log_in_employee", { token: t, time: l }))?.status === "success" ? console.log("You are now logged in.") : console.log("did not work. You are still logged out:");
    },
    switchEmployee() {
      this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "";
    },
    async log_out_employee(t) {
      const e = /* @__PURE__ */ new Date(), n = e.getUTCFullYear(), r = e.getUTCMonth() + 1, s = e.getUTCDate(), i = e.getUTCHours(), o = e.getUTCMinutes();
      e.getUTCSeconds();
      const l = (u) => u < 10 ? "0" + u : u, a = `${n}-${l(r)}-${l(s)} ${l(i - 5)}:${l(o)}`, c = await Wt("timeclock.www.job_timeclock.log_out_employee", { token: t, time: a });
      c?.status === "success" ? (console.log("You are now logged out.", c.log), this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "", this.employees = []) : console.log("Did not work. You are still logged in:", c.log);
    },
    async get_employees() {
      const t = await Wt("timeclock.www.job_timeclock.get_employees");
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
    }
  },
  mounted() {
    this.token && this.getWorkOrders(), this.check_for_erp_log_in(), this.employees = this.get_employees();
    const t = Ug.attachTo(document, {
      onScan: this.authenticateEmployee,
      ignoreIfFocusOn: ".frappe-input"
    });
    this.scanner = t, Cr(
      () => this.token,
      (e) => {
        e !== this.token ? this.decodeToken() : e && this.decodeToken();
      },
      { immediate: !0 }
    );
  }
}), b_ = { class: "block rounded-lg bg-gray-300 fixed w-screen overflow-hidden" }, v_ = { class: "mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between" }, w_ = {
  key: 0,
  class: "flex h-screen overflow-hidden pt-16"
}, x_ = { key: 1 };
function __(t, e, n, r, s, i) {
  const o = We("SessionTimer"), l = We("WorkOrderList"), a = We("JobCardList"), c = We("AuthorizationMessage");
  return ne(), pe(Pe, null, [
    ae("header", b_, [
      ae("div", v_, [
        ae("button", {
          class: "text-4xl font-bold tracking-tight text-gray-900",
          onClick: e[0] || (e[0] = (...u) => t.refresh_page && t.refresh_page(...u))
        }, ft(t.header), 1),
        t.activeSession ? (ne(), pe("button", {
          key: 0,
          class: "bg-teal-300 hover:bg-teal-400 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100",
          onClick: e[1] || (e[1] = (u) => t.log_out_employee(this.token))
        }, "Clock Out")) : Je("", !0),
        t.activeSession ? (ne(), pe("button", {
          key: 1,
          class: "bg-green-500 hover:bg-green-600 text-white font-normal lg:text-3xl py-4 px-4 rounded ring-2 ring-offset-1 ring-gray-100",
          onClick: e[2] || (e[2] = (...u) => t.switchEmployee && t.switchEmployee(...u))
        }, "Switch Employee")) : Je("", !0),
        t.activeSession ? (ne(), tt(o, {
          key: 2,
          employeeName: t.employeeName,
          tokenExpiration: t.tokenExpiration
        }, null, 8, ["employeeName", "tokenExpiration"])) : Je("", !0)
      ])
    ]),
    t.activeSession ? (ne(), pe("main", w_, [
      Ce(l, {
        workOrders: t.workOrders,
        selectedWorkOrder: t.selectedWorkOrder,
        onSelect: t.selectWorkOrder
      }, null, 8, ["workOrders", "selectedWorkOrder", "onSelect"]),
      Ce(Ba, { name: "job_card_list" }, {
        default: sn(() => [
          t.selectedWorkOrder ? (ne(), tt(a, {
            key: 0,
            name: "job_cards_comp",
            jobCards: t.jobCards,
            employee_id: this.employeeId
          }, null, 8, ["jobCards", "employee_id"])) : Je("", !0)
        ]),
        _: 1
      })
    ])) : (ne(), pe("main", x_, [
      Ce(c)
    ]))
  ], 64);
}
const k_ = /* @__PURE__ */ rt(y_, [["render", __], ["__scopeId", "data-v-1b52d809"]]);
let S_ = xg(k_);
S_.mount("#app");
