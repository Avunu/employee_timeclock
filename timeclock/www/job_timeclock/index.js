function Ba(t, e) {
  const n = /* @__PURE__ */ Object.create(null), r = t.split(",");
  for (let i = 0; i < r.length; i++)
    n[r[i]] = !0;
  return e ? (i) => !!n[i.toLowerCase()] : (i) => !!n[i];
}
const _e = {}, vr = [], jt = () => {
}, nh = () => !1, rh = /^on[^a-z]/, Fs = (t) => rh.test(t), $a = (t) => t.startsWith("onUpdate:"), Re = Object.assign, Ha = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, ih = Object.prototype.hasOwnProperty, de = (t, e) => ih.call(t, e), ne = Array.isArray, wr = (t) => Ws(t) === "[object Map]", sd = (t) => Ws(t) === "[object Set]", oe = (t) => typeof t == "function", Ie = (t) => typeof t == "string", Fa = (t) => typeof t == "symbol", we = (t) => t !== null && typeof t == "object", od = (t) => we(t) && oe(t.then) && oe(t.catch), ad = Object.prototype.toString, Ws = (t) => ad.call(t), sh = (t) => Ws(t).slice(8, -1), ld = (t) => Ws(t) === "[object Object]", Wa = (t) => Ie(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Ki = /* @__PURE__ */ Ba(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Vs = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, oh = /-(\w)/g, qt = Vs((t) => t.replace(oh, (e, n) => n ? n.toUpperCase() : "")), ah = /\B([A-Z])/g, Ir = Vs(
  (t) => t.replace(ah, "-$1").toLowerCase()
), Us = Vs(
  (t) => t.charAt(0).toUpperCase() + t.slice(1)
), co = Vs(
  (t) => t ? `on${Us(t)}` : ""
), oi = (t, e) => !Object.is(t, e), uo = (t, e) => {
  for (let n = 0; n < t.length; n++)
    t[n](e);
}, ss = (t, e, n) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, lh = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
}, ch = (t) => {
  const e = Ie(t) ? Number(t) : NaN;
  return isNaN(e) ? t : e;
};
let tc;
const Vo = () => tc || (tc = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Va(t) {
  if (ne(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = Ie(r) ? ph(r) : Va(r);
      if (i)
        for (const s in i)
          e[s] = i[s];
    }
    return e;
  } else {
    if (Ie(t))
      return t;
    if (we(t))
      return t;
  }
}
const uh = /;(?![^(]*\))/g, dh = /:([^]+)/, fh = /\/\*[^]*?\*\//g;
function ph(t) {
  const e = {};
  return t.replace(fh, "").split(uh).forEach((n) => {
    if (n) {
      const r = n.split(dh);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function yi(t) {
  let e = "";
  if (Ie(t))
    e = t;
  else if (ne(t))
    for (let n = 0; n < t.length; n++) {
      const r = yi(t[n]);
      r && (e += r + " ");
    }
  else if (we(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
const hh = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", mh = /* @__PURE__ */ Ba(hh);
function cd(t) {
  return !!t || t === "";
}
const Pt = (t) => Ie(t) ? t : t == null ? "" : ne(t) || we(t) && (t.toString === ad || !oe(t.toString)) ? JSON.stringify(t, ud, 2) : String(t), ud = (t, e) => e && e.__v_isRef ? ud(t, e.value) : wr(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce((n, [r, i]) => (n[`${r} =>`] = i, n), {})
} : sd(e) ? {
  [`Set(${e.size})`]: [...e.values()]
} : we(e) && !ne(e) && !ld(e) ? String(e) : e;
let ft;
class gh {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this.parent = ft, !e && ft && (this.index = (ft.scopes || (ft.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(e) {
    if (this._active) {
      const n = ft;
      try {
        return ft = this, e();
      } finally {
        ft = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ft = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    ft = this.parent;
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
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function yh(t, e = ft) {
  e && e.active && e.effects.push(t);
}
function dd() {
  return ft;
}
function bh(t) {
  ft && ft.cleanups.push(t);
}
const Ua = (t) => {
  const e = new Set(t);
  return e.w = 0, e.n = 0, e;
}, fd = (t) => (t.w & Sn) > 0, pd = (t) => (t.n & Sn) > 0, vh = ({ deps: t }) => {
  if (t.length)
    for (let e = 0; e < t.length; e++)
      t[e].w |= Sn;
}, wh = (t) => {
  const { deps: e } = t;
  if (e.length) {
    let n = 0;
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      fd(i) && !pd(i) ? i.delete(t) : e[n++] = i, i.w &= ~Sn, i.n &= ~Sn;
    }
    e.length = n;
  }
}, Uo = /* @__PURE__ */ new WeakMap();
let Kr = 0, Sn = 1;
const Ko = 30;
let At;
const Jn = Symbol(""), qo = Symbol("");
class Ka {
  constructor(e, n = null, r) {
    this.fn = e, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, yh(this, r);
  }
  run() {
    if (!this.active)
      return this.fn();
    let e = At, n = wn;
    for (; e; ) {
      if (e === this)
        return;
      e = e.parent;
    }
    try {
      return this.parent = At, At = this, wn = !0, Sn = 1 << ++Kr, Kr <= Ko ? vh(this) : nc(this), this.fn();
    } finally {
      Kr <= Ko && wh(this), Sn = 1 << --Kr, At = this.parent, wn = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    At === this ? this.deferStop = !0 : this.active && (nc(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function nc(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let n = 0; n < e.length; n++)
      e[n].delete(t);
    e.length = 0;
  }
}
let wn = !0;
const hd = [];
function Lr() {
  hd.push(wn), wn = !1;
}
function zr() {
  const t = hd.pop();
  wn = t === void 0 ? !0 : t;
}
function ct(t, e, n) {
  if (wn && At) {
    let r = Uo.get(t);
    r || Uo.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || r.set(n, i = Ua()), md(i);
  }
}
function md(t, e) {
  let n = !1;
  Kr <= Ko ? pd(t) || (t.n |= Sn, n = !fd(t)) : n = !t.has(At), n && (t.add(At), At.deps.push(t));
}
function en(t, e, n, r, i, s) {
  const o = Uo.get(t);
  if (!o)
    return;
  let a = [];
  if (e === "clear")
    a = [...o.values()];
  else if (n === "length" && ne(t)) {
    const l = Number(r);
    o.forEach((c, d) => {
      (d === "length" || d >= l) && a.push(c);
    });
  } else
    switch (n !== void 0 && a.push(o.get(n)), e) {
      case "add":
        ne(t) ? Wa(n) && a.push(o.get("length")) : (a.push(o.get(Jn)), wr(t) && a.push(o.get(qo)));
        break;
      case "delete":
        ne(t) || (a.push(o.get(Jn)), wr(t) && a.push(o.get(qo)));
        break;
      case "set":
        wr(t) && a.push(o.get(Jn));
        break;
    }
  if (a.length === 1)
    a[0] && Go(a[0]);
  else {
    const l = [];
    for (const c of a)
      c && l.push(...c);
    Go(Ua(l));
  }
}
function Go(t, e) {
  const n = ne(t) ? t : [...t];
  for (const r of n)
    r.computed && rc(r);
  for (const r of n)
    r.computed || rc(r);
}
function rc(t, e) {
  (t !== At || t.allowRecurse) && (t.scheduler ? t.scheduler() : t.run());
}
const _h = /* @__PURE__ */ Ba("__proto__,__v_isRef,__isVue"), gd = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Fa)
), kh = /* @__PURE__ */ qa(), xh = /* @__PURE__ */ qa(!1, !0), Sh = /* @__PURE__ */ qa(!0), ic = /* @__PURE__ */ Ch();
function Ch() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const r = fe(this);
      for (let s = 0, o = this.length; s < o; s++)
        ct(r, "get", s + "");
      const i = r[e](...n);
      return i === -1 || i === !1 ? r[e](...n.map(fe)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      Lr();
      const r = fe(this)[e].apply(this, n);
      return zr(), r;
    };
  }), t;
}
function Eh(t) {
  const e = fe(this);
  return ct(e, "has", t), e.hasOwnProperty(t);
}
function qa(t = !1, e = !1) {
  return function(r, i, s) {
    if (i === "__v_isReactive")
      return !t;
    if (i === "__v_isReadonly")
      return t;
    if (i === "__v_isShallow")
      return e;
    if (i === "__v_raw" && s === (t ? e ? Fh : _d : e ? wd : vd).get(r))
      return r;
    const o = ne(r);
    if (!t) {
      if (o && de(ic, i))
        return Reflect.get(ic, i, s);
      if (i === "hasOwnProperty")
        return Eh;
    }
    const a = Reflect.get(r, i, s);
    return (Fa(i) ? gd.has(i) : _h(i)) || (t || ct(r, "get", i), e) ? a : Xe(a) ? o && Wa(i) ? a : a.value : we(a) ? t ? Ya(a) : bi(a) : a;
  };
}
const Mh = /* @__PURE__ */ yd(), Ah = /* @__PURE__ */ yd(!0);
function yd(t = !1) {
  return function(n, r, i, s) {
    let o = n[r];
    if (Ar(o) && Xe(o) && !Xe(i))
      return !1;
    if (!t && (!as(i) && !Ar(i) && (o = fe(o), i = fe(i)), !ne(n) && Xe(o) && !Xe(i)))
      return o.value = i, !0;
    const a = ne(n) && Wa(r) ? Number(r) < n.length : de(n, r), l = Reflect.set(n, r, i, s);
    return n === fe(s) && (a ? oi(i, o) && en(n, "set", r, i) : en(n, "add", r, i)), l;
  };
}
function Th(t, e) {
  const n = de(t, e);
  t[e];
  const r = Reflect.deleteProperty(t, e);
  return r && n && en(t, "delete", e, void 0), r;
}
function Oh(t, e) {
  const n = Reflect.has(t, e);
  return (!Fa(e) || !gd.has(e)) && ct(t, "has", e), n;
}
function jh(t) {
  return ct(t, "iterate", ne(t) ? "length" : Jn), Reflect.ownKeys(t);
}
const bd = {
  get: kh,
  set: Mh,
  deleteProperty: Th,
  has: Oh,
  ownKeys: jh
}, Ph = {
  get: Sh,
  set(t, e) {
    return !0;
  },
  deleteProperty(t, e) {
    return !0;
  }
}, Nh = /* @__PURE__ */ Re(
  {},
  bd,
  {
    get: xh,
    set: Ah
  }
), Ga = (t) => t, Ks = (t) => Reflect.getPrototypeOf(t);
function xi(t, e, n = !1, r = !1) {
  t = t.__v_raw;
  const i = fe(t), s = fe(e);
  n || (e !== s && ct(i, "get", e), ct(i, "get", s));
  const { has: o } = Ks(i), a = r ? Ga : n ? Qa : ai;
  if (o.call(i, e))
    return a(t.get(e));
  if (o.call(i, s))
    return a(t.get(s));
  t !== i && t.get(e);
}
function Si(t, e = !1) {
  const n = this.__v_raw, r = fe(n), i = fe(t);
  return e || (t !== i && ct(r, "has", t), ct(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
}
function Ci(t, e = !1) {
  return t = t.__v_raw, !e && ct(fe(t), "iterate", Jn), Reflect.get(t, "size", t);
}
function sc(t) {
  t = fe(t);
  const e = fe(this);
  return Ks(e).has.call(e, t) || (e.add(t), en(e, "add", t, t)), this;
}
function oc(t, e) {
  e = fe(e);
  const n = fe(this), { has: r, get: i } = Ks(n);
  let s = r.call(n, t);
  s || (t = fe(t), s = r.call(n, t));
  const o = i.call(n, t);
  return n.set(t, e), s ? oi(e, o) && en(n, "set", t, e) : en(n, "add", t, e), this;
}
function ac(t) {
  const e = fe(this), { has: n, get: r } = Ks(e);
  let i = n.call(e, t);
  i || (t = fe(t), i = n.call(e, t)), r && r.call(e, t);
  const s = e.delete(t);
  return i && en(e, "delete", t, void 0), s;
}
function lc() {
  const t = fe(this), e = t.size !== 0, n = t.clear();
  return e && en(t, "clear", void 0, void 0), n;
}
function Ei(t, e) {
  return function(r, i) {
    const s = this, o = s.__v_raw, a = fe(o), l = e ? Ga : t ? Qa : ai;
    return !t && ct(a, "iterate", Jn), o.forEach((c, d) => r.call(i, l(c), l(d), s));
  };
}
function Mi(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, s = fe(i), o = wr(s), a = t === "entries" || t === Symbol.iterator && o, l = t === "keys" && o, c = i[t](...r), d = n ? Ga : e ? Qa : ai;
    return !e && ct(
      s,
      "iterate",
      l ? qo : Jn
    ), {
      // iterator protocol
      next() {
        const { value: f, done: p } = c.next();
        return p ? { value: f, done: p } : {
          value: a ? [d(f[0]), d(f[1])] : d(f),
          done: p
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function nn(t) {
  return function(...e) {
    return t === "delete" ? !1 : this;
  };
}
function Rh() {
  const t = {
    get(s) {
      return xi(this, s);
    },
    get size() {
      return Ci(this);
    },
    has: Si,
    add: sc,
    set: oc,
    delete: ac,
    clear: lc,
    forEach: Ei(!1, !1)
  }, e = {
    get(s) {
      return xi(this, s, !1, !0);
    },
    get size() {
      return Ci(this);
    },
    has: Si,
    add: sc,
    set: oc,
    delete: ac,
    clear: lc,
    forEach: Ei(!1, !0)
  }, n = {
    get(s) {
      return xi(this, s, !0);
    },
    get size() {
      return Ci(this, !0);
    },
    has(s) {
      return Si.call(this, s, !0);
    },
    add: nn("add"),
    set: nn("set"),
    delete: nn("delete"),
    clear: nn("clear"),
    forEach: Ei(!0, !1)
  }, r = {
    get(s) {
      return xi(this, s, !0, !0);
    },
    get size() {
      return Ci(this, !0);
    },
    has(s) {
      return Si.call(this, s, !0);
    },
    add: nn("add"),
    set: nn("set"),
    delete: nn("delete"),
    clear: nn("clear"),
    forEach: Ei(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = Mi(
      s,
      !1,
      !1
    ), n[s] = Mi(
      s,
      !0,
      !1
    ), e[s] = Mi(
      s,
      !1,
      !0
    ), r[s] = Mi(
      s,
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
  Ih,
  Lh,
  zh,
  Dh
] = /* @__PURE__ */ Rh();
function Ja(t, e) {
  const n = e ? t ? Dh : zh : t ? Lh : Ih;
  return (r, i, s) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    de(n, i) && i in r ? n : r,
    i,
    s
  );
}
const Bh = {
  get: /* @__PURE__ */ Ja(!1, !1)
}, $h = {
  get: /* @__PURE__ */ Ja(!1, !0)
}, Hh = {
  get: /* @__PURE__ */ Ja(!0, !1)
}, vd = /* @__PURE__ */ new WeakMap(), wd = /* @__PURE__ */ new WeakMap(), _d = /* @__PURE__ */ new WeakMap(), Fh = /* @__PURE__ */ new WeakMap();
function Wh(t) {
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
function Vh(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : Wh(sh(t));
}
function bi(t) {
  return Ar(t) ? t : Xa(
    t,
    !1,
    bd,
    Bh,
    vd
  );
}
function Uh(t) {
  return Xa(
    t,
    !1,
    Nh,
    $h,
    wd
  );
}
function Ya(t) {
  return Xa(
    t,
    !0,
    Ph,
    Hh,
    _d
  );
}
function Xa(t, e, n, r, i) {
  if (!we(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = i.get(t);
  if (s)
    return s;
  const o = Vh(t);
  if (o === 0)
    return t;
  const a = new Proxy(
    t,
    o === 2 ? r : n
  );
  return i.set(t, a), a;
}
function _r(t) {
  return Ar(t) ? _r(t.__v_raw) : !!(t && t.__v_isReactive);
}
function Ar(t) {
  return !!(t && t.__v_isReadonly);
}
function as(t) {
  return !!(t && t.__v_isShallow);
}
function kd(t) {
  return _r(t) || Ar(t);
}
function fe(t) {
  const e = t && t.__v_raw;
  return e ? fe(e) : t;
}
function xd(t) {
  return ss(t, "__v_skip", !0), t;
}
const ai = (t) => we(t) ? bi(t) : t, Qa = (t) => we(t) ? Ya(t) : t;
function Sd(t) {
  wn && At && (t = fe(t), md(t.dep || (t.dep = Ua())));
}
function Cd(t, e) {
  t = fe(t);
  const n = t.dep;
  n && Go(n);
}
function Xe(t) {
  return !!(t && t.__v_isRef === !0);
}
function qs(t) {
  return Ed(t, !1);
}
function Kh(t) {
  return Ed(t, !0);
}
function Ed(t, e) {
  return Xe(t) ? t : new qh(t, e);
}
class qh {
  constructor(e, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? e : fe(e), this._value = n ? e : ai(e);
  }
  get value() {
    return Sd(this), this._value;
  }
  set value(e) {
    const n = this.__v_isShallow || as(e) || Ar(e);
    e = n ? e : fe(e), oi(e, this._rawValue) && (this._rawValue = e, this._value = n ? e : ai(e), Cd(this));
  }
}
function Md(t) {
  return Xe(t) ? t.value : t;
}
const Gh = {
  get: (t, e, n) => Md(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const i = t[e];
    return Xe(i) && !Xe(n) ? (i.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function Ad(t) {
  return _r(t) ? t : new Proxy(t, Gh);
}
class Jh {
  constructor(e, n, r, i) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new Ka(e, () => {
      this._dirty || (this._dirty = !0, Cd(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !i, this.__v_isReadonly = r;
  }
  get value() {
    const e = fe(this);
    return Sd(e), (e._dirty || !e._cacheable) && (e._dirty = !1, e._value = e.effect.run()), e._value;
  }
  set value(e) {
    this._setter(e);
  }
}
function Yh(t, e, n = !1) {
  let r, i;
  const s = oe(t);
  return s ? (r = t, i = jt) : (r = t.get, i = t.set), new Jh(r, i, s || !i, n);
}
function _n(t, e, n, r) {
  let i;
  try {
    i = r ? t(...r) : t();
  } catch (s) {
    Gs(s, e, n);
  }
  return i;
}
function kt(t, e, n, r) {
  if (oe(t)) {
    const s = _n(t, e, n, r);
    return s && od(s) && s.catch((o) => {
      Gs(o, e, n);
    }), s;
  }
  const i = [];
  for (let s = 0; s < t.length; s++)
    i.push(kt(t[s], e, n, r));
  return i;
}
function Gs(t, e, n, r = !0) {
  const i = e ? e.vnode : null;
  if (e) {
    let s = e.parent;
    const o = e.proxy, a = n;
    for (; s; ) {
      const c = s.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](t, o, a) === !1)
            return;
      }
      s = s.parent;
    }
    const l = e.appContext.config.errorHandler;
    if (l) {
      _n(
        l,
        null,
        10,
        [t, o, a]
      );
      return;
    }
  }
  Xh(t, n, i, r);
}
function Xh(t, e, n, r = !0) {
  console.error(t);
}
let li = !1, Jo = !1;
const Ye = [];
let Vt = 0;
const kr = [];
let Zt = null, Dn = 0;
const Td = /* @__PURE__ */ Promise.resolve();
let Za = null;
function Od(t) {
  const e = Za || Td;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function Qh(t) {
  let e = Vt + 1, n = Ye.length;
  for (; e < n; ) {
    const r = e + n >>> 1;
    ci(Ye[r]) < t ? e = r + 1 : n = r;
  }
  return e;
}
function el(t) {
  (!Ye.length || !Ye.includes(
    t,
    li && t.allowRecurse ? Vt + 1 : Vt
  )) && (t.id == null ? Ye.push(t) : Ye.splice(Qh(t.id), 0, t), jd());
}
function jd() {
  !li && !Jo && (Jo = !0, Za = Td.then(Nd));
}
function Zh(t) {
  const e = Ye.indexOf(t);
  e > Vt && Ye.splice(e, 1);
}
function em(t) {
  ne(t) ? kr.push(...t) : (!Zt || !Zt.includes(
    t,
    t.allowRecurse ? Dn + 1 : Dn
  )) && kr.push(t), jd();
}
function cc(t, e = li ? Vt + 1 : 0) {
  for (; e < Ye.length; e++) {
    const n = Ye[e];
    n && n.pre && (Ye.splice(e, 1), e--, n());
  }
}
function Pd(t) {
  if (kr.length) {
    const e = [...new Set(kr)];
    if (kr.length = 0, Zt) {
      Zt.push(...e);
      return;
    }
    for (Zt = e, Zt.sort((n, r) => ci(n) - ci(r)), Dn = 0; Dn < Zt.length; Dn++)
      Zt[Dn]();
    Zt = null, Dn = 0;
  }
}
const ci = (t) => t.id == null ? 1 / 0 : t.id, tm = (t, e) => {
  const n = ci(t) - ci(e);
  if (n === 0) {
    if (t.pre && !e.pre)
      return -1;
    if (e.pre && !t.pre)
      return 1;
  }
  return n;
};
function Nd(t) {
  Jo = !1, li = !0, Ye.sort(tm);
  const e = jt;
  try {
    for (Vt = 0; Vt < Ye.length; Vt++) {
      const n = Ye[Vt];
      n && n.active !== !1 && _n(n, null, 14);
    }
  } finally {
    Vt = 0, Ye.length = 0, Pd(), li = !1, Za = null, (Ye.length || kr.length) && Nd();
  }
}
function nm(t, e, ...n) {
  if (t.isUnmounted)
    return;
  const r = t.vnode.props || _e;
  let i = n;
  const s = e.startsWith("update:"), o = s && e.slice(7);
  if (o && o in r) {
    const d = `${o === "modelValue" ? "model" : o}Modifiers`, { number: f, trim: p } = r[d] || _e;
    p && (i = n.map((g) => Ie(g) ? g.trim() : g)), f && (i = n.map(lh));
  }
  let a, l = r[a = co(e)] || // also try camelCase event handler (#2249)
  r[a = co(qt(e))];
  !l && s && (l = r[a = co(Ir(e))]), l && kt(
    l,
    t,
    6,
    i
  );
  const c = r[a + "Once"];
  if (c) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[a])
      return;
    t.emitted[a] = !0, kt(
      c,
      t,
      6,
      i
    );
  }
}
function Rd(t, e, n = !1) {
  const r = e.emitsCache, i = r.get(t);
  if (i !== void 0)
    return i;
  const s = t.emits;
  let o = {}, a = !1;
  if (!oe(t)) {
    const l = (c) => {
      const d = Rd(c, e, !0);
      d && (a = !0, Re(o, d));
    };
    !n && e.mixins.length && e.mixins.forEach(l), t.extends && l(t.extends), t.mixins && t.mixins.forEach(l);
  }
  return !s && !a ? (we(t) && r.set(t, null), null) : (ne(s) ? s.forEach((l) => o[l] = null) : Re(o, s), we(t) && r.set(t, o), o);
}
function Js(t, e) {
  return !t || !Fs(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), de(t, e[0].toLowerCase() + e.slice(1)) || de(t, Ir(e)) || de(t, e));
}
let Qe = null, Ys = null;
function ls(t) {
  const e = Qe;
  return Qe = t, Ys = t && t.type.__scopeId || null, e;
}
function tl(t) {
  Ys = t;
}
function nl() {
  Ys = null;
}
function An(t, e = Qe, n) {
  if (!e || t._n)
    return t;
  const r = (...i) => {
    r._d && _c(-1);
    const s = ls(e);
    let o;
    try {
      o = t(...i);
    } finally {
      ls(s), r._d && _c(1);
    }
    return o;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function fo(t) {
  const {
    type: e,
    vnode: n,
    proxy: r,
    withProxy: i,
    props: s,
    propsOptions: [o],
    slots: a,
    attrs: l,
    emit: c,
    render: d,
    renderCache: f,
    data: p,
    setupState: g,
    ctx: y,
    inheritAttrs: w
  } = t;
  let x, E;
  const T = ls(t);
  try {
    if (n.shapeFlag & 4) {
      const u = i || r;
      x = Wt(
        d.call(
          u,
          u,
          f,
          s,
          g,
          p,
          y
        )
      ), E = l;
    } else {
      const u = e;
      x = Wt(
        u.length > 1 ? u(
          s,
          { attrs: l, slots: a, emit: c }
        ) : u(
          s,
          null
          /* we know it doesn't need it */
        )
      ), E = e.props ? l : rm(l);
    }
  } catch (u) {
    Zr.length = 0, Gs(u, t, 1), x = De(xt);
  }
  let P = x;
  if (E && w !== !1) {
    const u = Object.keys(E), { shapeFlag: m } = P;
    u.length && m & 7 && (o && u.some($a) && (E = im(
      E,
      o
    )), P = Cn(P, E));
  }
  return n.dirs && (P = Cn(P), P.dirs = P.dirs ? P.dirs.concat(n.dirs) : n.dirs), n.transition && (P.transition = n.transition), x = P, ls(T), x;
}
const rm = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || Fs(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, im = (t, e) => {
  const n = {};
  for (const r in t)
    (!$a(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function sm(t, e, n) {
  const { props: r, children: i, component: s } = t, { props: o, children: a, patchFlag: l } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return r ? uc(r, o, c) : !!o;
    if (l & 8) {
      const d = e.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        const p = d[f];
        if (o[p] !== r[p] && !Js(c, p))
          return !0;
      }
    }
  } else
    return (i || a) && (!a || !a.$stable) ? !0 : r === o ? !1 : r ? o ? uc(r, o, c) : !0 : !!o;
  return !1;
}
function uc(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    if (e[s] !== t[s] && !Js(n, s))
      return !0;
  }
  return !1;
}
function om({ vnode: t, parent: e }, n) {
  for (; e && e.subTree === t; )
    (t = e.vnode).el = n, e = e.parent;
}
const am = (t) => t.__isSuspense;
function lm(t, e) {
  e && e.pendingBranch ? ne(t) ? e.effects.push(...t) : e.effects.push(t) : em(t);
}
function cm(t, e) {
  return rl(t, null, e);
}
const Ai = {};
function xr(t, e, n) {
  return rl(t, e, n);
}
function rl(t, e, { immediate: n, deep: r, flush: i, onTrack: s, onTrigger: o } = _e) {
  var a;
  const l = dd() === ((a = He) == null ? void 0 : a.scope) ? He : null;
  let c, d = !1, f = !1;
  if (Xe(t) ? (c = () => t.value, d = as(t)) : _r(t) ? (c = () => t, r = !0) : ne(t) ? (f = !0, d = t.some((u) => _r(u) || as(u)), c = () => t.map((u) => {
    if (Xe(u))
      return u.value;
    if (_r(u))
      return hr(u);
    if (oe(u))
      return _n(u, l, 2);
  })) : oe(t) ? e ? c = () => _n(t, l, 2) : c = () => {
    if (!(l && l.isUnmounted))
      return p && p(), kt(
        t,
        l,
        3,
        [g]
      );
  } : c = jt, e && r) {
    const u = c;
    c = () => hr(u());
  }
  let p, g = (u) => {
    p = T.onStop = () => {
      _n(u, l, 4);
    };
  }, y;
  if (di)
    if (g = jt, e ? n && kt(e, l, 3, [
      c(),
      f ? [] : void 0,
      g
    ]) : c(), i === "sync") {
      const u = s1();
      y = u.__watcherHandles || (u.__watcherHandles = []);
    } else
      return jt;
  let w = f ? new Array(t.length).fill(Ai) : Ai;
  const x = () => {
    if (T.active)
      if (e) {
        const u = T.run();
        (r || d || (f ? u.some(
          (m, h) => oi(m, w[h])
        ) : oi(u, w))) && (p && p(), kt(e, l, 3, [
          u,
          // pass undefined as the old value when it's changed for the first time
          w === Ai ? void 0 : f && w[0] === Ai ? [] : w,
          g
        ]), w = u);
      } else
        T.run();
  };
  x.allowRecurse = !!e;
  let E;
  i === "sync" ? E = x : i === "post" ? E = () => st(x, l && l.suspense) : (x.pre = !0, l && (x.id = l.uid), E = () => el(x));
  const T = new Ka(c, E);
  e ? n ? x() : w = T.run() : i === "post" ? st(
    T.run.bind(T),
    l && l.suspense
  ) : T.run();
  const P = () => {
    T.stop(), l && l.scope && Ha(l.scope.effects, T);
  };
  return y && y.push(P), P;
}
function um(t, e, n) {
  const r = this.proxy, i = Ie(t) ? t.includes(".") ? Id(r, t) : () => r[t] : t.bind(r, r);
  let s;
  oe(e) ? s = e : (s = e.handler, n = e);
  const o = He;
  Tr(this);
  const a = rl(i, s.bind(r), n);
  return o ? Tr(o) : Yn(), a;
}
function Id(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let i = 0; i < n.length && r; i++)
      r = r[n[i]];
    return r;
  };
}
function hr(t, e) {
  if (!we(t) || t.__v_skip || (e = e || /* @__PURE__ */ new Set(), e.has(t)))
    return t;
  if (e.add(t), Xe(t))
    hr(t.value, e);
  else if (ne(t))
    for (let n = 0; n < t.length; n++)
      hr(t[n], e);
  else if (sd(t) || wr(t))
    t.forEach((n) => {
      hr(n, e);
    });
  else if (ld(t))
    for (const n in t)
      hr(t[n], e);
  return t;
}
function Nn(t, e, n, r) {
  const i = t.dirs, s = e && e.dirs;
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    s && (a.oldValue = s[o].value);
    let l = a.dir[r];
    l && (Lr(), kt(l, n, 8, [
      t.el,
      a,
      t,
      e
    ]), zr());
  }
}
function dm() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return $d(() => {
    t.isMounted = !0;
  }), Hd(() => {
    t.isUnmounting = !0;
  }), t;
}
const gt = [Function, Array], Ld = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: gt,
  onEnter: gt,
  onAfterEnter: gt,
  onEnterCancelled: gt,
  // leave
  onBeforeLeave: gt,
  onLeave: gt,
  onAfterLeave: gt,
  onLeaveCancelled: gt,
  // appear
  onBeforeAppear: gt,
  onAppear: gt,
  onAfterAppear: gt,
  onAppearCancelled: gt
}, fm = {
  name: "BaseTransition",
  props: Ld,
  setup(t, { slots: e }) {
    const n = Xm(), r = dm();
    let i;
    return () => {
      const s = e.default && Dd(e.default(), !0);
      if (!s || !s.length)
        return;
      let o = s[0];
      if (s.length > 1) {
        for (const w of s)
          if (w.type !== xt) {
            o = w;
            break;
          }
      }
      const a = fe(t), { mode: l } = a;
      if (r.isLeaving)
        return po(o);
      const c = dc(o);
      if (!c)
        return po(o);
      const d = Yo(
        c,
        a,
        r,
        n
      );
      Xo(c, d);
      const f = n.subTree, p = f && dc(f);
      let g = !1;
      const { getTransitionKey: y } = c.type;
      if (y) {
        const w = y();
        i === void 0 ? i = w : w !== i && (i = w, g = !0);
      }
      if (p && p.type !== xt && (!Bn(c, p) || g)) {
        const w = Yo(
          p,
          a,
          r,
          n
        );
        if (Xo(p, w), l === "out-in")
          return r.isLeaving = !0, w.afterLeave = () => {
            r.isLeaving = !1, n.update.active !== !1 && n.update();
          }, po(o);
        l === "in-out" && c.type !== xt && (w.delayLeave = (x, E, T) => {
          const P = zd(
            r,
            p
          );
          P[String(p.key)] = p, x._leaveCb = () => {
            E(), x._leaveCb = void 0, delete d.delayedLeave;
          }, d.delayedLeave = T;
        });
      }
      return o;
    };
  }
}, pm = fm;
function zd(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(e.type, r)), r;
}
function Yo(t, e, n, r) {
  const {
    appear: i,
    mode: s,
    persisted: o = !1,
    onBeforeEnter: a,
    onEnter: l,
    onAfterEnter: c,
    onEnterCancelled: d,
    onBeforeLeave: f,
    onLeave: p,
    onAfterLeave: g,
    onLeaveCancelled: y,
    onBeforeAppear: w,
    onAppear: x,
    onAfterAppear: E,
    onAppearCancelled: T
  } = e, P = String(t.key), u = zd(n, t), m = (v, S) => {
    v && kt(
      v,
      r,
      9,
      S
    );
  }, h = (v, S) => {
    const k = S[1];
    m(v, S), ne(v) ? v.every((M) => M.length <= 1) && k() : v.length <= 1 && k();
  }, b = {
    mode: s,
    persisted: o,
    beforeEnter(v) {
      let S = a;
      if (!n.isMounted)
        if (i)
          S = w || a;
        else
          return;
      v._leaveCb && v._leaveCb(
        !0
        /* cancelled */
      );
      const k = u[P];
      k && Bn(t, k) && k.el._leaveCb && k.el._leaveCb(), m(S, [v]);
    },
    enter(v) {
      let S = l, k = c, M = d;
      if (!n.isMounted)
        if (i)
          S = x || l, k = E || c, M = T || d;
        else
          return;
      let j = !1;
      const R = v._enterCb = (N) => {
        j || (j = !0, N ? m(M, [v]) : m(k, [v]), b.delayedLeave && b.delayedLeave(), v._enterCb = void 0);
      };
      S ? h(S, [v, R]) : R();
    },
    leave(v, S) {
      const k = String(t.key);
      if (v._enterCb && v._enterCb(
        !0
        /* cancelled */
      ), n.isUnmounting)
        return S();
      m(f, [v]);
      let M = !1;
      const j = v._leaveCb = (R) => {
        M || (M = !0, S(), R ? m(y, [v]) : m(g, [v]), v._leaveCb = void 0, u[k] === t && delete u[k]);
      };
      u[k] = t, p ? h(p, [v, j]) : j();
    },
    clone(v) {
      return Yo(v, e, n, r);
    }
  };
  return b;
}
function po(t) {
  if (Xs(t))
    return t = Cn(t), t.children = null, t;
}
function dc(t) {
  return Xs(t) ? t.children ? t.children[0] : void 0 : t;
}
function Xo(t, e) {
  t.shapeFlag & 6 && t.component ? Xo(t.component.subTree, e) : t.shapeFlag & 128 ? (t.ssContent.transition = e.clone(t.ssContent), t.ssFallback.transition = e.clone(t.ssFallback)) : t.transition = e;
}
function Dd(t, e = !1, n) {
  let r = [], i = 0;
  for (let s = 0; s < t.length; s++) {
    let o = t[s];
    const a = n == null ? o.key : String(n) + String(o.key != null ? o.key : s);
    o.type === Ve ? (o.patchFlag & 128 && i++, r = r.concat(
      Dd(o.children, e, a)
    )) : (e || o.type !== xt) && r.push(a != null ? Cn(o, { key: a }) : o);
  }
  if (i > 1)
    for (let s = 0; s < r.length; s++)
      r[s].patchFlag = -2;
  return r;
}
function Yt(t, e) {
  return oe(t) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => Re({ name: t.name }, e, { setup: t }))()
  ) : t;
}
const Xr = (t) => !!t.type.__asyncLoader, Xs = (t) => t.type.__isKeepAlive;
function hm(t, e) {
  Bd(t, "a", e);
}
function mm(t, e) {
  Bd(t, "da", e);
}
function Bd(t, e, n = He) {
  const r = t.__wdc || (t.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return t();
  });
  if (Qs(e, r, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      Xs(i.parent.vnode) && gm(r, e, n, i), i = i.parent;
  }
}
function gm(t, e, n, r) {
  const i = Qs(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  il(() => {
    Ha(r[e], i);
  }, n);
}
function Qs(t, e, n = He, r = !1) {
  if (n) {
    const i = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      if (n.isUnmounted)
        return;
      Lr(), Tr(n);
      const a = kt(e, n, t, o);
      return Yn(), zr(), a;
    });
    return r ? i.unshift(s) : i.push(s), s;
  }
}
const tn = (t) => (e, n = He) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!di || t === "sp") && Qs(t, (...r) => e(...r), n)
), ym = tn("bm"), $d = tn("m"), bm = tn("bu"), vm = tn("u"), Hd = tn("bum"), il = tn("um"), wm = tn("sp"), _m = tn(
  "rtg"
), km = tn(
  "rtc"
);
function xm(t, e = He) {
  Qs("ec", t, e);
}
const Fd = "components";
function at(t, e) {
  return Cm(Fd, t, !0, e) || t;
}
const Sm = Symbol.for("v-ndc");
function Cm(t, e, n = !0, r = !1) {
  const i = Qe || He;
  if (i) {
    const s = i.type;
    if (t === Fd) {
      const a = n1(
        s,
        !1
        /* do not include inferred name to avoid breaking existing code */
      );
      if (a && (a === e || a === qt(e) || a === Us(qt(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      fc(i[t] || s[t], e) || // global registration
      fc(i.appContext[t], e)
    );
    return !o && r ? s : o;
  }
}
function fc(t, e) {
  return t && (t[e] || t[qt(e)] || t[Us(qt(e))]);
}
function sl(t, e, n, r) {
  let i;
  const s = n && n[r];
  if (ne(t) || Ie(t)) {
    i = new Array(t.length);
    for (let o = 0, a = t.length; o < a; o++)
      i[o] = e(t[o], o, void 0, s && s[o]);
  } else if (typeof t == "number") {
    i = new Array(t);
    for (let o = 0; o < t; o++)
      i[o] = e(o + 1, o, void 0, s && s[o]);
  } else if (we(t))
    if (t[Symbol.iterator])
      i = Array.from(
        t,
        (o, a) => e(o, a, void 0, s && s[a])
      );
    else {
      const o = Object.keys(t);
      i = new Array(o.length);
      for (let a = 0, l = o.length; a < l; a++) {
        const c = o[a];
        i[a] = e(t[c], c, a, s && s[a]);
      }
    }
  else
    i = [];
  return n && (n[r] = i), i;
}
function Wd(t, e, n = {}, r, i) {
  if (Qe.isCE || Qe.parent && Xr(Qe.parent) && Qe.parent.isCE)
    return e !== "default" && (n.name = e), De("slot", n, r && r());
  let s = t[e];
  s && s._c && (s._d = !1), pe();
  const o = s && Vd(s(n)), a = St(
    Ve,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      o && o.key || `_${e}`
    },
    o || (r ? r() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !i && a.scopeId && (a.slotScopeIds = [a.scopeId + "-s"]), s && s._c && (s._d = !0), a;
}
function Vd(t) {
  return t.some((e) => ds(e) ? !(e.type === xt || e.type === Ve && !Vd(e.children)) : !0) ? t : null;
}
const Qo = (t) => t ? tf(t) ? dl(t) || t.proxy : Qo(t.parent) : null, Qr = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Re(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => Qo(t.parent),
    $root: (t) => Qo(t.root),
    $emit: (t) => t.emit,
    $options: (t) => ol(t),
    $forceUpdate: (t) => t.f || (t.f = () => el(t.update)),
    $nextTick: (t) => t.n || (t.n = Od.bind(t.proxy)),
    $watch: (t) => um.bind(t)
  })
), ho = (t, e) => t !== _e && !t.__isScriptSetup && de(t, e), Em = {
  get({ _: t }, e) {
    const { ctx: n, setupState: r, data: i, props: s, accessCache: o, type: a, appContext: l } = t;
    let c;
    if (e[0] !== "$") {
      const g = o[e];
      if (g !== void 0)
        switch (g) {
          case 1:
            return r[e];
          case 2:
            return i[e];
          case 4:
            return n[e];
          case 3:
            return s[e];
        }
      else {
        if (ho(r, e))
          return o[e] = 1, r[e];
        if (i !== _e && de(i, e))
          return o[e] = 2, i[e];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (c = t.propsOptions[0]) && de(c, e)
        )
          return o[e] = 3, s[e];
        if (n !== _e && de(n, e))
          return o[e] = 4, n[e];
        Zo && (o[e] = 0);
      }
    }
    const d = Qr[e];
    let f, p;
    if (d)
      return e === "$attrs" && ct(t, "get", e), d(t);
    if (
      // css module (injected by vue-loader)
      (f = a.__cssModules) && (f = f[e])
    )
      return f;
    if (n !== _e && de(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      p = l.config.globalProperties, de(p, e)
    )
      return p[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: i, ctx: s } = t;
    return ho(i, e) ? (i[e] = n, !0) : r !== _e && de(r, e) ? (r[e] = n, !0) : de(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: i, propsOptions: s }
  }, o) {
    let a;
    return !!n[o] || t !== _e && de(t, o) || ho(e, o) || (a = s[0]) && de(a, o) || de(r, o) || de(Qr, o) || de(i.config.globalProperties, o);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : de(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function pc(t) {
  return ne(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let Zo = !0;
function Mm(t) {
  const e = ol(t), n = t.proxy, r = t.ctx;
  Zo = !1, e.beforeCreate && hc(e.beforeCreate, t, "bc");
  const {
    // state
    data: i,
    computed: s,
    methods: o,
    watch: a,
    provide: l,
    inject: c,
    // lifecycle
    created: d,
    beforeMount: f,
    mounted: p,
    beforeUpdate: g,
    updated: y,
    activated: w,
    deactivated: x,
    beforeDestroy: E,
    beforeUnmount: T,
    destroyed: P,
    unmounted: u,
    render: m,
    renderTracked: h,
    renderTriggered: b,
    errorCaptured: v,
    serverPrefetch: S,
    // public API
    expose: k,
    inheritAttrs: M,
    // assets
    components: j,
    directives: R,
    filters: N
  } = e;
  if (c && Am(c, r, null), o)
    for (const O in o) {
      const L = o[O];
      oe(L) && (r[O] = L.bind(n));
    }
  if (i) {
    const O = i.call(n, n);
    we(O) && (t.data = bi(O));
  }
  if (Zo = !0, s)
    for (const O in s) {
      const L = s[O], W = oe(L) ? L.bind(n, n) : oe(L.get) ? L.get.bind(n, n) : jt, te = !oe(L) && oe(L.set) ? L.set.bind(n) : jt, K = rf({
        get: W,
        set: te
      });
      Object.defineProperty(r, O, {
        enumerable: !0,
        configurable: !0,
        get: () => K.value,
        set: (ae) => K.value = ae
      });
    }
  if (a)
    for (const O in a)
      Ud(a[O], r, n, O);
  if (l) {
    const O = oe(l) ? l.call(n) : l;
    Reflect.ownKeys(O).forEach((L) => {
      Rm(L, O[L]);
    });
  }
  d && hc(d, t, "c");
  function _(O, L) {
    ne(L) ? L.forEach((W) => O(W.bind(n))) : L && O(L.bind(n));
  }
  if (_(ym, f), _($d, p), _(bm, g), _(vm, y), _(hm, w), _(mm, x), _(xm, v), _(km, h), _(_m, b), _(Hd, T), _(il, u), _(wm, S), ne(k))
    if (k.length) {
      const O = t.exposed || (t.exposed = {});
      k.forEach((L) => {
        Object.defineProperty(O, L, {
          get: () => n[L],
          set: (W) => n[L] = W
        });
      });
    } else
      t.exposed || (t.exposed = {});
  m && t.render === jt && (t.render = m), M != null && (t.inheritAttrs = M), j && (t.components = j), R && (t.directives = R);
}
function Am(t, e, n = jt) {
  ne(t) && (t = ea(t));
  for (const r in t) {
    const i = t[r];
    let s;
    we(i) ? "default" in i ? s = qi(
      i.from || r,
      i.default,
      !0
      /* treat default function as factory */
    ) : s = qi(i.from || r) : s = qi(i), Xe(s) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[r] = s;
  }
}
function hc(t, e, n) {
  kt(
    ne(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Ud(t, e, n, r) {
  const i = r.includes(".") ? Id(n, r) : () => n[r];
  if (Ie(t)) {
    const s = e[t];
    oe(s) && xr(i, s);
  } else if (oe(t))
    xr(i, t.bind(n));
  else if (we(t))
    if (ne(t))
      t.forEach((s) => Ud(s, e, n, r));
    else {
      const s = oe(t.handler) ? t.handler.bind(n) : e[t.handler];
      oe(s) && xr(i, s, t);
    }
}
function ol(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: i,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, a = s.get(e);
  let l;
  return a ? l = a : !i.length && !n && !r ? l = e : (l = {}, i.length && i.forEach(
    (c) => cs(l, c, o, !0)
  ), cs(l, e, o)), we(e) && s.set(e, l), l;
}
function cs(t, e, n, r = !1) {
  const { mixins: i, extends: s } = e;
  s && cs(t, s, n, !0), i && i.forEach(
    (o) => cs(t, o, n, !0)
  );
  for (const o in e)
    if (!(r && o === "expose")) {
      const a = Tm[o] || n && n[o];
      t[o] = a ? a(t[o], e[o]) : e[o];
    }
  return t;
}
const Tm = {
  data: mc,
  props: gc,
  emits: gc,
  // objects
  methods: qr,
  computed: qr,
  // lifecycle
  beforeCreate: nt,
  created: nt,
  beforeMount: nt,
  mounted: nt,
  beforeUpdate: nt,
  updated: nt,
  beforeDestroy: nt,
  beforeUnmount: nt,
  destroyed: nt,
  unmounted: nt,
  activated: nt,
  deactivated: nt,
  errorCaptured: nt,
  serverPrefetch: nt,
  // assets
  components: qr,
  directives: qr,
  // watch
  watch: jm,
  // provide / inject
  provide: mc,
  inject: Om
};
function mc(t, e) {
  return e ? t ? function() {
    return Re(
      oe(t) ? t.call(this, this) : t,
      oe(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function Om(t, e) {
  return qr(ea(t), ea(e));
}
function ea(t) {
  if (ne(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++)
      e[t[n]] = t[n];
    return e;
  }
  return t;
}
function nt(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function qr(t, e) {
  return t ? Re(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function gc(t, e) {
  return t ? ne(t) && ne(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Re(
    /* @__PURE__ */ Object.create(null),
    pc(t),
    pc(e ?? {})
  ) : e;
}
function jm(t, e) {
  if (!t)
    return e;
  if (!e)
    return t;
  const n = Re(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = nt(t[r], e[r]);
  return n;
}
function Kd() {
  return {
    app: null,
    config: {
      isNativeTag: nh,
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
let Pm = 0;
function Nm(t, e) {
  return function(r, i = null) {
    oe(r) || (r = Re({}, r)), i != null && !we(i) && (i = null);
    const s = Kd(), o = /* @__PURE__ */ new Set();
    let a = !1;
    const l = s.app = {
      _uid: Pm++,
      _component: r,
      _props: i,
      _container: null,
      _context: s,
      _instance: null,
      version: o1,
      get config() {
        return s.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return o.has(c) || (c && oe(c.install) ? (o.add(c), c.install(l, ...d)) : oe(c) && (o.add(c), c(l, ...d))), l;
      },
      mixin(c) {
        return s.mixins.includes(c) || s.mixins.push(c), l;
      },
      component(c, d) {
        return d ? (s.components[c] = d, l) : s.components[c];
      },
      directive(c, d) {
        return d ? (s.directives[c] = d, l) : s.directives[c];
      },
      mount(c, d, f) {
        if (!a) {
          const p = De(
            r,
            i
          );
          return p.appContext = s, d && e ? e(p, c) : t(p, c, f), a = !0, l._container = c, c.__vue_app__ = l, dl(p.component) || p.component.proxy;
        }
      },
      unmount() {
        a && (t(null, l._container), delete l._container.__vue_app__);
      },
      provide(c, d) {
        return s.provides[c] = d, l;
      },
      runWithContext(c) {
        us = l;
        try {
          return c();
        } finally {
          us = null;
        }
      }
    };
    return l;
  };
}
let us = null;
function Rm(t, e) {
  if (He) {
    let n = He.provides;
    const r = He.parent && He.parent.provides;
    r === n && (n = He.provides = Object.create(r)), n[t] = e;
  }
}
function qi(t, e, n = !1) {
  const r = He || Qe;
  if (r || us) {
    const i = r ? r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : us._context.provides;
    if (i && t in i)
      return i[t];
    if (arguments.length > 1)
      return n && oe(e) ? e.call(r && r.proxy) : e;
  }
}
function Im(t, e, n, r = !1) {
  const i = {}, s = {};
  ss(s, eo, 1), t.propsDefaults = /* @__PURE__ */ Object.create(null), qd(t, e, i, s);
  for (const o in t.propsOptions[0])
    o in i || (i[o] = void 0);
  n ? t.props = r ? i : Uh(i) : t.type.props ? t.props = i : t.props = s, t.attrs = s;
}
function Lm(t, e, n, r) {
  const {
    props: i,
    attrs: s,
    vnode: { patchFlag: o }
  } = t, a = fe(i), [l] = t.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (r || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const d = t.vnode.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        let p = d[f];
        if (Js(t.emitsOptions, p))
          continue;
        const g = e[p];
        if (l)
          if (de(s, p))
            g !== s[p] && (s[p] = g, c = !0);
          else {
            const y = qt(p);
            i[y] = ta(
              l,
              a,
              y,
              g,
              t,
              !1
              /* isAbsent */
            );
          }
        else
          g !== s[p] && (s[p] = g, c = !0);
      }
    }
  } else {
    qd(t, e, i, s) && (c = !0);
    let d;
    for (const f in a)
      (!e || // for camelCase
      !de(e, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = Ir(f)) === f || !de(e, d))) && (l ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[d] !== void 0) && (i[f] = ta(
        l,
        a,
        f,
        void 0,
        t,
        !0
        /* isAbsent */
      )) : delete i[f]);
    if (s !== a)
      for (const f in s)
        (!e || !de(e, f)) && (delete s[f], c = !0);
  }
  c && en(t, "set", "$attrs");
}
function qd(t, e, n, r) {
  const [i, s] = t.propsOptions;
  let o = !1, a;
  if (e)
    for (let l in e) {
      if (Ki(l))
        continue;
      const c = e[l];
      let d;
      i && de(i, d = qt(l)) ? !s || !s.includes(d) ? n[d] = c : (a || (a = {}))[d] = c : Js(t.emitsOptions, l) || (!(l in r) || c !== r[l]) && (r[l] = c, o = !0);
    }
  if (s) {
    const l = fe(n), c = a || _e;
    for (let d = 0; d < s.length; d++) {
      const f = s[d];
      n[f] = ta(
        i,
        l,
        f,
        c[f],
        t,
        !de(c, f)
      );
    }
  }
  return o;
}
function ta(t, e, n, r, i, s) {
  const o = t[n];
  if (o != null) {
    const a = de(o, "default");
    if (a && r === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && oe(l)) {
        const { propsDefaults: c } = i;
        n in c ? r = c[n] : (Tr(i), r = c[n] = l.call(
          null,
          e
        ), Yn());
      } else
        r = l;
    }
    o[
      0
      /* shouldCast */
    ] && (s && !a ? r = !1 : o[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === Ir(n)) && (r = !0));
  }
  return r;
}
function Gd(t, e, n = !1) {
  const r = e.propsCache, i = r.get(t);
  if (i)
    return i;
  const s = t.props, o = {}, a = [];
  let l = !1;
  if (!oe(t)) {
    const d = (f) => {
      l = !0;
      const [p, g] = Gd(f, e, !0);
      Re(o, p), g && a.push(...g);
    };
    !n && e.mixins.length && e.mixins.forEach(d), t.extends && d(t.extends), t.mixins && t.mixins.forEach(d);
  }
  if (!s && !l)
    return we(t) && r.set(t, vr), vr;
  if (ne(s))
    for (let d = 0; d < s.length; d++) {
      const f = qt(s[d]);
      yc(f) && (o[f] = _e);
    }
  else if (s)
    for (const d in s) {
      const f = qt(d);
      if (yc(f)) {
        const p = s[d], g = o[f] = ne(p) || oe(p) ? { type: p } : Re({}, p);
        if (g) {
          const y = wc(Boolean, g.type), w = wc(String, g.type);
          g[
            0
            /* shouldCast */
          ] = y > -1, g[
            1
            /* shouldCastTrue */
          ] = w < 0 || y < w, (y > -1 || de(g, "default")) && a.push(f);
        }
      }
    }
  const c = [o, a];
  return we(t) && r.set(t, c), c;
}
function yc(t) {
  return t[0] !== "$";
}
function bc(t) {
  const e = t && t.toString().match(/^\s*(function|class) (\w+)/);
  return e ? e[2] : t === null ? "null" : "";
}
function vc(t, e) {
  return bc(t) === bc(e);
}
function wc(t, e) {
  return ne(e) ? e.findIndex((n) => vc(n, t)) : oe(e) && vc(e, t) ? 0 : -1;
}
const Jd = (t) => t[0] === "_" || t === "$stable", al = (t) => ne(t) ? t.map(Wt) : [Wt(t)], zm = (t, e, n) => {
  if (e._n)
    return e;
  const r = An((...i) => al(e(...i)), n);
  return r._c = !1, r;
}, Yd = (t, e, n) => {
  const r = t._ctx;
  for (const i in t) {
    if (Jd(i))
      continue;
    const s = t[i];
    if (oe(s))
      e[i] = zm(i, s, r);
    else if (s != null) {
      const o = al(s);
      e[i] = () => o;
    }
  }
}, Xd = (t, e) => {
  const n = al(e);
  t.slots.default = () => n;
}, Dm = (t, e) => {
  if (t.vnode.shapeFlag & 32) {
    const n = e._;
    n ? (t.slots = fe(e), ss(e, "_", n)) : Yd(
      e,
      t.slots = {}
    );
  } else
    t.slots = {}, e && Xd(t, e);
  ss(t.slots, eo, 1);
}, Bm = (t, e, n) => {
  const { vnode: r, slots: i } = t;
  let s = !0, o = _e;
  if (r.shapeFlag & 32) {
    const a = e._;
    a ? n && a === 1 ? s = !1 : (Re(i, e), !n && a === 1 && delete i._) : (s = !e.$stable, Yd(e, i)), o = e;
  } else
    e && (Xd(t, e), o = { default: 1 });
  if (s)
    for (const a in i)
      !Jd(a) && !(a in o) && delete i[a];
};
function na(t, e, n, r, i = !1) {
  if (ne(t)) {
    t.forEach(
      (p, g) => na(
        p,
        e && (ne(e) ? e[g] : e),
        n,
        r,
        i
      )
    );
    return;
  }
  if (Xr(r) && !i)
    return;
  const s = r.shapeFlag & 4 ? dl(r.component) || r.component.proxy : r.el, o = i ? null : s, { i: a, r: l } = t, c = e && e.r, d = a.refs === _e ? a.refs = {} : a.refs, f = a.setupState;
  if (c != null && c !== l && (Ie(c) ? (d[c] = null, de(f, c) && (f[c] = null)) : Xe(c) && (c.value = null)), oe(l))
    _n(l, a, 12, [o, d]);
  else {
    const p = Ie(l), g = Xe(l);
    if (p || g) {
      const y = () => {
        if (t.f) {
          const w = p ? de(f, l) ? f[l] : d[l] : l.value;
          i ? ne(w) && Ha(w, s) : ne(w) ? w.includes(s) || w.push(s) : p ? (d[l] = [s], de(f, l) && (f[l] = d[l])) : (l.value = [s], t.k && (d[t.k] = l.value));
        } else
          p ? (d[l] = o, de(f, l) && (f[l] = o)) : g && (l.value = o, t.k && (d[t.k] = o));
      };
      o ? (y.id = -1, st(y, n)) : y();
    }
  }
}
const st = lm;
function $m(t) {
  return Hm(t);
}
function Hm(t, e) {
  const n = Vo();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: i,
    patchProp: s,
    createElement: o,
    createText: a,
    createComment: l,
    setText: c,
    setElementText: d,
    parentNode: f,
    nextSibling: p,
    setScopeId: g = jt,
    insertStaticContent: y
  } = t, w = (C, A, I, B = null, D = null, U = null, J = !1, V = null, q = !!A.dynamicChildren) => {
    if (C === A)
      return;
    C && !Bn(C, A) && (B = Le(C), ae(C, D, U, !0), C = null), A.patchFlag === -2 && (q = !1, A.dynamicChildren = null);
    const { type: $, ref: Q, shapeFlag: Y } = A;
    switch ($) {
      case Zs:
        x(C, A, I, B);
        break;
      case xt:
        E(C, A, I, B);
        break;
      case mo:
        C == null && T(A, I, B, J);
        break;
      case Ve:
        j(
          C,
          A,
          I,
          B,
          D,
          U,
          J,
          V,
          q
        );
        break;
      default:
        Y & 1 ? m(
          C,
          A,
          I,
          B,
          D,
          U,
          J,
          V,
          q
        ) : Y & 6 ? R(
          C,
          A,
          I,
          B,
          D,
          U,
          J,
          V,
          q
        ) : (Y & 64 || Y & 128) && $.process(
          C,
          A,
          I,
          B,
          D,
          U,
          J,
          V,
          q,
          Lt
        );
    }
    Q != null && D && na(Q, C && C.ref, U, A || C, !A);
  }, x = (C, A, I, B) => {
    if (C == null)
      r(
        A.el = a(A.children),
        I,
        B
      );
    else {
      const D = A.el = C.el;
      A.children !== C.children && c(D, A.children);
    }
  }, E = (C, A, I, B) => {
    C == null ? r(
      A.el = l(A.children || ""),
      I,
      B
    ) : A.el = C.el;
  }, T = (C, A, I, B) => {
    [C.el, C.anchor] = y(
      C.children,
      A,
      I,
      B,
      C.el,
      C.anchor
    );
  }, P = ({ el: C, anchor: A }, I, B) => {
    let D;
    for (; C && C !== A; )
      D = p(C), r(C, I, B), C = D;
    r(A, I, B);
  }, u = ({ el: C, anchor: A }) => {
    let I;
    for (; C && C !== A; )
      I = p(C), i(C), C = I;
    i(A);
  }, m = (C, A, I, B, D, U, J, V, q) => {
    J = J || A.type === "svg", C == null ? h(
      A,
      I,
      B,
      D,
      U,
      J,
      V,
      q
    ) : S(
      C,
      A,
      D,
      U,
      J,
      V,
      q
    );
  }, h = (C, A, I, B, D, U, J, V) => {
    let q, $;
    const { type: Q, props: Y, shapeFlag: Z, transition: se, dirs: le } = C;
    if (q = C.el = o(
      C.type,
      U,
      Y && Y.is,
      Y
    ), Z & 8 ? d(q, C.children) : Z & 16 && v(
      C.children,
      q,
      null,
      B,
      D,
      U && Q !== "foreignObject",
      J,
      V
    ), le && Nn(C, null, B, "created"), b(q, C, C.scopeId, J, B), Y) {
      for (const he in Y)
        he !== "value" && !Ki(he) && s(
          q,
          he,
          null,
          Y[he],
          U,
          C.children,
          B,
          D,
          ve
        );
      "value" in Y && s(q, "value", null, Y.value), ($ = Y.onVnodeBeforeMount) && Dt($, B, C);
    }
    le && Nn(C, null, B, "beforeMount");
    const be = (!D || D && !D.pendingBranch) && se && !se.persisted;
    be && se.beforeEnter(q), r(q, A, I), (($ = Y && Y.onVnodeMounted) || be || le) && st(() => {
      $ && Dt($, B, C), be && se.enter(q), le && Nn(C, null, B, "mounted");
    }, D);
  }, b = (C, A, I, B, D) => {
    if (I && g(C, I), B)
      for (let U = 0; U < B.length; U++)
        g(C, B[U]);
    if (D) {
      let U = D.subTree;
      if (A === U) {
        const J = D.vnode;
        b(
          C,
          J,
          J.scopeId,
          J.slotScopeIds,
          D.parent
        );
      }
    }
  }, v = (C, A, I, B, D, U, J, V, q = 0) => {
    for (let $ = q; $ < C.length; $++) {
      const Q = C[$] = V ? un(C[$]) : Wt(C[$]);
      w(
        null,
        Q,
        A,
        I,
        B,
        D,
        U,
        J,
        V
      );
    }
  }, S = (C, A, I, B, D, U, J) => {
    const V = A.el = C.el;
    let { patchFlag: q, dynamicChildren: $, dirs: Q } = A;
    q |= C.patchFlag & 16;
    const Y = C.props || _e, Z = A.props || _e;
    let se;
    I && Rn(I, !1), (se = Z.onVnodeBeforeUpdate) && Dt(se, I, A, C), Q && Nn(A, C, I, "beforeUpdate"), I && Rn(I, !0);
    const le = D && A.type !== "foreignObject";
    if ($ ? k(
      C.dynamicChildren,
      $,
      V,
      I,
      B,
      le,
      U
    ) : J || L(
      C,
      A,
      V,
      null,
      I,
      B,
      le,
      U,
      !1
    ), q > 0) {
      if (q & 16)
        M(
          V,
          A,
          Y,
          Z,
          I,
          B,
          D
        );
      else if (q & 2 && Y.class !== Z.class && s(V, "class", null, Z.class, D), q & 4 && s(V, "style", Y.style, Z.style, D), q & 8) {
        const be = A.dynamicProps;
        for (let he = 0; he < be.length; he++) {
          const je = be[he], Et = Y[je], sr = Z[je];
          (sr !== Et || je === "value") && s(
            V,
            je,
            Et,
            sr,
            D,
            C.children,
            I,
            B,
            ve
          );
        }
      }
      q & 1 && C.children !== A.children && d(V, A.children);
    } else
      !J && $ == null && M(
        V,
        A,
        Y,
        Z,
        I,
        B,
        D
      );
    ((se = Z.onVnodeUpdated) || Q) && st(() => {
      se && Dt(se, I, A, C), Q && Nn(A, C, I, "updated");
    }, B);
  }, k = (C, A, I, B, D, U, J) => {
    for (let V = 0; V < A.length; V++) {
      const q = C[V], $ = A[V], Q = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        q.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (q.type === Ve || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Bn(q, $) || // - In the case of a component, it could contain anything.
        q.shapeFlag & 70) ? f(q.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          I
        )
      );
      w(
        q,
        $,
        Q,
        null,
        B,
        D,
        U,
        J,
        !0
      );
    }
  }, M = (C, A, I, B, D, U, J) => {
    if (I !== B) {
      if (I !== _e)
        for (const V in I)
          !Ki(V) && !(V in B) && s(
            C,
            V,
            I[V],
            null,
            J,
            A.children,
            D,
            U,
            ve
          );
      for (const V in B) {
        if (Ki(V))
          continue;
        const q = B[V], $ = I[V];
        q !== $ && V !== "value" && s(
          C,
          V,
          $,
          q,
          J,
          A.children,
          D,
          U,
          ve
        );
      }
      "value" in B && s(C, "value", I.value, B.value);
    }
  }, j = (C, A, I, B, D, U, J, V, q) => {
    const $ = A.el = C ? C.el : a(""), Q = A.anchor = C ? C.anchor : a("");
    let { patchFlag: Y, dynamicChildren: Z, slotScopeIds: se } = A;
    se && (V = V ? V.concat(se) : se), C == null ? (r($, I, B), r(Q, I, B), v(
      A.children,
      I,
      Q,
      D,
      U,
      J,
      V,
      q
    )) : Y > 0 && Y & 64 && Z && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    C.dynamicChildren ? (k(
      C.dynamicChildren,
      Z,
      I,
      D,
      U,
      J,
      V
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (A.key != null || D && A === D.subTree) && Qd(
      C,
      A,
      !0
      /* shallow */
    )) : L(
      C,
      A,
      I,
      Q,
      D,
      U,
      J,
      V,
      q
    );
  }, R = (C, A, I, B, D, U, J, V, q) => {
    A.slotScopeIds = V, C == null ? A.shapeFlag & 512 ? D.ctx.activate(
      A,
      I,
      B,
      J,
      q
    ) : N(
      A,
      I,
      B,
      D,
      U,
      J,
      q
    ) : z(C, A, q);
  }, N = (C, A, I, B, D, U, J) => {
    const V = C.component = Ym(
      C,
      B,
      D
    );
    if (Xs(C) && (V.ctx.renderer = Lt), Qm(V), V.asyncDep) {
      if (D && D.registerDep(V, _), !C.el) {
        const q = V.subTree = De(xt);
        E(null, q, A, I);
      }
      return;
    }
    _(
      V,
      C,
      A,
      I,
      D,
      U,
      J
    );
  }, z = (C, A, I) => {
    const B = A.component = C.component;
    if (sm(C, A, I))
      if (B.asyncDep && !B.asyncResolved) {
        O(B, A, I);
        return;
      } else
        B.next = A, Zh(B.update), B.update();
    else
      A.el = C.el, B.vnode = A;
  }, _ = (C, A, I, B, D, U, J) => {
    const V = () => {
      if (C.isMounted) {
        let { next: Q, bu: Y, u: Z, parent: se, vnode: le } = C, be = Q, he;
        Rn(C, !1), Q ? (Q.el = le.el, O(C, Q, J)) : Q = le, Y && uo(Y), (he = Q.props && Q.props.onVnodeBeforeUpdate) && Dt(he, se, Q, le), Rn(C, !0);
        const je = fo(C), Et = C.subTree;
        C.subTree = je, w(
          Et,
          je,
          // parent may have changed if it's in a teleport
          f(Et.el),
          // anchor may have changed if it's in a fragment
          Le(Et),
          C,
          D,
          U
        ), Q.el = je.el, be === null && om(C, je.el), Z && st(Z, D), (he = Q.props && Q.props.onVnodeUpdated) && st(
          () => Dt(he, se, Q, le),
          D
        );
      } else {
        let Q;
        const { el: Y, props: Z } = A, { bm: se, m: le, parent: be } = C, he = Xr(A);
        if (Rn(C, !1), se && uo(se), !he && (Q = Z && Z.onVnodeBeforeMount) && Dt(Q, be, A), Rn(C, !0), Y && ir) {
          const je = () => {
            C.subTree = fo(C), ir(
              Y,
              C.subTree,
              C,
              D,
              null
            );
          };
          he ? A.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !C.isUnmounted && je()
          ) : je();
        } else {
          const je = C.subTree = fo(C);
          w(
            null,
            je,
            I,
            B,
            C,
            D,
            U
          ), A.el = je.el;
        }
        if (le && st(le, D), !he && (Q = Z && Z.onVnodeMounted)) {
          const je = A;
          st(
            () => Dt(Q, be, je),
            D
          );
        }
        (A.shapeFlag & 256 || be && Xr(be.vnode) && be.vnode.shapeFlag & 256) && C.a && st(C.a, D), C.isMounted = !0, A = I = B = null;
      }
    }, q = C.effect = new Ka(
      V,
      () => el($),
      C.scope
      // track it in component's effect scope
    ), $ = C.update = () => q.run();
    $.id = C.uid, Rn(C, !0), $();
  }, O = (C, A, I) => {
    A.component = C;
    const B = C.vnode.props;
    C.vnode = A, C.next = null, Lm(C, A.props, B, I), Bm(C, A.children, I), Lr(), cc(), zr();
  }, L = (C, A, I, B, D, U, J, V, q = !1) => {
    const $ = C && C.children, Q = C ? C.shapeFlag : 0, Y = A.children, { patchFlag: Z, shapeFlag: se } = A;
    if (Z > 0) {
      if (Z & 128) {
        te(
          $,
          Y,
          I,
          B,
          D,
          U,
          J,
          V,
          q
        );
        return;
      } else if (Z & 256) {
        W(
          $,
          Y,
          I,
          B,
          D,
          U,
          J,
          V,
          q
        );
        return;
      }
    }
    se & 8 ? (Q & 16 && ve($, D, U), Y !== $ && d(I, Y)) : Q & 16 ? se & 16 ? te(
      $,
      Y,
      I,
      B,
      D,
      U,
      J,
      V,
      q
    ) : ve($, D, U, !0) : (Q & 8 && d(I, ""), se & 16 && v(
      Y,
      I,
      B,
      D,
      U,
      J,
      V,
      q
    ));
  }, W = (C, A, I, B, D, U, J, V, q) => {
    C = C || vr, A = A || vr;
    const $ = C.length, Q = A.length, Y = Math.min($, Q);
    let Z;
    for (Z = 0; Z < Y; Z++) {
      const se = A[Z] = q ? un(A[Z]) : Wt(A[Z]);
      w(
        C[Z],
        se,
        I,
        null,
        D,
        U,
        J,
        V,
        q
      );
    }
    $ > Q ? ve(
      C,
      D,
      U,
      !0,
      !1,
      Y
    ) : v(
      A,
      I,
      B,
      D,
      U,
      J,
      V,
      q,
      Y
    );
  }, te = (C, A, I, B, D, U, J, V, q) => {
    let $ = 0;
    const Q = A.length;
    let Y = C.length - 1, Z = Q - 1;
    for (; $ <= Y && $ <= Z; ) {
      const se = C[$], le = A[$] = q ? un(A[$]) : Wt(A[$]);
      if (Bn(se, le))
        w(
          se,
          le,
          I,
          null,
          D,
          U,
          J,
          V,
          q
        );
      else
        break;
      $++;
    }
    for (; $ <= Y && $ <= Z; ) {
      const se = C[Y], le = A[Z] = q ? un(A[Z]) : Wt(A[Z]);
      if (Bn(se, le))
        w(
          se,
          le,
          I,
          null,
          D,
          U,
          J,
          V,
          q
        );
      else
        break;
      Y--, Z--;
    }
    if ($ > Y) {
      if ($ <= Z) {
        const se = Z + 1, le = se < Q ? A[se].el : B;
        for (; $ <= Z; )
          w(
            null,
            A[$] = q ? un(A[$]) : Wt(A[$]),
            I,
            le,
            D,
            U,
            J,
            V,
            q
          ), $++;
      }
    } else if ($ > Z)
      for (; $ <= Y; )
        ae(C[$], D, U, !0), $++;
    else {
      const se = $, le = $, be = /* @__PURE__ */ new Map();
      for ($ = le; $ <= Z; $++) {
        const dt = A[$] = q ? un(A[$]) : Wt(A[$]);
        dt.key != null && be.set(dt.key, $);
      }
      let he, je = 0;
      const Et = Z - le + 1;
      let sr = !1, Ql = 0;
      const Hr = new Array(Et);
      for ($ = 0; $ < Et; $++)
        Hr[$] = 0;
      for ($ = se; $ <= Y; $++) {
        const dt = C[$];
        if (je >= Et) {
          ae(dt, D, U, !0);
          continue;
        }
        let zt;
        if (dt.key != null)
          zt = be.get(dt.key);
        else
          for (he = le; he <= Z; he++)
            if (Hr[he - le] === 0 && Bn(dt, A[he])) {
              zt = he;
              break;
            }
        zt === void 0 ? ae(dt, D, U, !0) : (Hr[zt - le] = $ + 1, zt >= Ql ? Ql = zt : sr = !0, w(
          dt,
          A[zt],
          I,
          null,
          D,
          U,
          J,
          V,
          q
        ), je++);
      }
      const Zl = sr ? Fm(Hr) : vr;
      for (he = Zl.length - 1, $ = Et - 1; $ >= 0; $--) {
        const dt = le + $, zt = A[dt], ec = dt + 1 < Q ? A[dt + 1].el : B;
        Hr[$] === 0 ? w(
          null,
          zt,
          I,
          ec,
          D,
          U,
          J,
          V,
          q
        ) : sr && (he < 0 || $ !== Zl[he] ? K(zt, I, ec, 2) : he--);
      }
    }
  }, K = (C, A, I, B, D = null) => {
    const { el: U, type: J, transition: V, children: q, shapeFlag: $ } = C;
    if ($ & 6) {
      K(C.component.subTree, A, I, B);
      return;
    }
    if ($ & 128) {
      C.suspense.move(A, I, B);
      return;
    }
    if ($ & 64) {
      J.move(C, A, I, Lt);
      return;
    }
    if (J === Ve) {
      r(U, A, I);
      for (let Y = 0; Y < q.length; Y++)
        K(q[Y], A, I, B);
      r(C.anchor, A, I);
      return;
    }
    if (J === mo) {
      P(C, A, I);
      return;
    }
    if (B !== 2 && $ & 1 && V)
      if (B === 0)
        V.beforeEnter(U), r(U, A, I), st(() => V.enter(U), D);
      else {
        const { leave: Y, delayLeave: Z, afterLeave: se } = V, le = () => r(U, A, I), be = () => {
          Y(U, () => {
            le(), se && se();
          });
        };
        Z ? Z(U, le, be) : be();
      }
    else
      r(U, A, I);
  }, ae = (C, A, I, B = !1, D = !1) => {
    const {
      type: U,
      props: J,
      ref: V,
      children: q,
      dynamicChildren: $,
      shapeFlag: Q,
      patchFlag: Y,
      dirs: Z
    } = C;
    if (V != null && na(V, null, I, C, !0), Q & 256) {
      A.ctx.deactivate(C);
      return;
    }
    const se = Q & 1 && Z, le = !Xr(C);
    let be;
    if (le && (be = J && J.onVnodeBeforeUnmount) && Dt(be, A, C), Q & 6)
      Me(C.component, I, B);
    else {
      if (Q & 128) {
        C.suspense.unmount(I, B);
        return;
      }
      se && Nn(C, null, A, "beforeUnmount"), Q & 64 ? C.type.remove(
        C,
        A,
        I,
        D,
        Lt,
        B
      ) : $ && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (U !== Ve || Y > 0 && Y & 64) ? ve(
        $,
        A,
        I,
        !1,
        !0
      ) : (U === Ve && Y & 384 || !D && Q & 16) && ve(q, A, I), B && ye(C);
    }
    (le && (be = J && J.onVnodeUnmounted) || se) && st(() => {
      be && Dt(be, A, C), se && Nn(C, null, A, "unmounted");
    }, I);
  }, ye = (C) => {
    const { type: A, el: I, anchor: B, transition: D } = C;
    if (A === Ve) {
      Ee(I, B);
      return;
    }
    if (A === mo) {
      u(C);
      return;
    }
    const U = () => {
      i(I), D && !D.persisted && D.afterLeave && D.afterLeave();
    };
    if (C.shapeFlag & 1 && D && !D.persisted) {
      const { leave: J, delayLeave: V } = D, q = () => J(I, U);
      V ? V(C.el, U, q) : q();
    } else
      U();
  }, Ee = (C, A) => {
    let I;
    for (; C !== A; )
      I = p(C), i(C), C = I;
    i(A);
  }, Me = (C, A, I) => {
    const { bum: B, scope: D, update: U, subTree: J, um: V } = C;
    B && uo(B), D.stop(), U && (U.active = !1, ae(J, C, A, I)), V && st(V, A), st(() => {
      C.isUnmounted = !0;
    }, A), A && A.pendingBranch && !A.isUnmounted && C.asyncDep && !C.asyncResolved && C.suspenseId === A.pendingId && (A.deps--, A.deps === 0 && A.resolve());
  }, ve = (C, A, I, B = !1, D = !1, U = 0) => {
    for (let J = U; J < C.length; J++)
      ae(C[J], A, I, B, D);
  }, Le = (C) => C.shapeFlag & 6 ? Le(C.component.subTree) : C.shapeFlag & 128 ? C.suspense.next() : p(C.anchor || C.el), Je = (C, A, I) => {
    C == null ? A._vnode && ae(A._vnode, null, null, !0) : w(A._vnode || null, C, A, null, null, null, I), cc(), Pd(), A._vnode = C;
  }, Lt = {
    p: w,
    um: ae,
    m: K,
    r: ye,
    mt: N,
    mc: v,
    pc: L,
    pbc: k,
    n: Le,
    o: t
  };
  let Pn, ir;
  return e && ([Pn, ir] = e(
    Lt
  )), {
    render: Je,
    hydrate: Pn,
    createApp: Nm(Je, Pn)
  };
}
function Rn({ effect: t, update: e }, n) {
  t.allowRecurse = e.allowRecurse = n;
}
function Qd(t, e, n = !1) {
  const r = t.children, i = e.children;
  if (ne(r) && ne(i))
    for (let s = 0; s < r.length; s++) {
      const o = r[s];
      let a = i[s];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[s] = un(i[s]), a.el = o.el), n || Qd(o, a)), a.type === Zs && (a.el = o.el);
    }
}
function Fm(t) {
  const e = t.slice(), n = [0];
  let r, i, s, o, a;
  const l = t.length;
  for (r = 0; r < l; r++) {
    const c = t[r];
    if (c !== 0) {
      if (i = n[n.length - 1], t[i] < c) {
        e[r] = i, n.push(r);
        continue;
      }
      for (s = 0, o = n.length - 1; s < o; )
        a = s + o >> 1, t[n[a]] < c ? s = a + 1 : o = a;
      c < t[n[s]] && (s > 0 && (e[r] = n[s - 1]), n[s] = r);
    }
  }
  for (s = n.length, o = n[s - 1]; s-- > 0; )
    n[s] = o, o = e[o];
  return n;
}
const Wm = (t) => t.__isTeleport, Ve = Symbol.for("v-fgt"), Zs = Symbol.for("v-txt"), xt = Symbol.for("v-cmt"), mo = Symbol.for("v-stc"), Zr = [];
let Ot = null;
function pe(t = !1) {
  Zr.push(Ot = t ? null : []);
}
function Vm() {
  Zr.pop(), Ot = Zr[Zr.length - 1] || null;
}
let ui = 1;
function _c(t) {
  ui += t;
}
function Zd(t) {
  return t.dynamicChildren = ui > 0 ? Ot || vr : null, Vm(), ui > 0 && Ot && Ot.push(t), t;
}
function ze(t, e, n, r, i, s) {
  return Zd(
    me(
      t,
      e,
      n,
      r,
      i,
      s,
      !0
      /* isBlock */
    )
  );
}
function St(t, e, n, r, i) {
  return Zd(
    De(
      t,
      e,
      n,
      r,
      i,
      !0
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function ds(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Bn(t, e) {
  return t.type === e.type && t.key === e.key;
}
const eo = "__vInternal", ef = ({ key: t }) => t ?? null, Gi = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? Ie(t) || Xe(t) || oe(t) ? { i: Qe, r: t, k: e, f: !!n } : t : null);
function me(t, e = null, n = null, r = 0, i = null, s = t === Ve ? 0 : 1, o = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && ef(e),
    ref: e && Gi(e),
    scopeId: Ys,
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
    shapeFlag: s,
    patchFlag: r,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Qe
  };
  return a ? (cl(l, n), s & 128 && t.normalize(l)) : n && (l.shapeFlag |= Ie(n) ? 8 : 16), ui > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ot && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && Ot.push(l), l;
}
const De = Um;
function Um(t, e = null, n = null, r = 0, i = null, s = !1) {
  if ((!t || t === Sm) && (t = xt), ds(t)) {
    const a = Cn(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && cl(a, n), ui > 0 && !s && Ot && (a.shapeFlag & 6 ? Ot[Ot.indexOf(t)] = a : Ot.push(a)), a.patchFlag |= -2, a;
  }
  if (r1(t) && (t = t.__vccOpts), e) {
    e = Km(e);
    let { class: a, style: l } = e;
    a && !Ie(a) && (e.class = yi(a)), we(l) && (kd(l) && !ne(l) && (l = Re({}, l)), e.style = Va(l));
  }
  const o = Ie(t) ? 1 : am(t) ? 128 : Wm(t) ? 64 : we(t) ? 4 : oe(t) ? 2 : 0;
  return me(
    t,
    e,
    n,
    r,
    i,
    o,
    s,
    !0
  );
}
function Km(t) {
  return t ? kd(t) || eo in t ? Re({}, t) : t : null;
}
function Cn(t, e, n = !1) {
  const { props: r, ref: i, patchFlag: s, children: o } = t, a = e ? qm(r || {}, e) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: a,
    key: a && ef(a),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? ne(i) ? i.concat(Gi(e)) : [i, Gi(e)] : Gi(e)
    ) : i,
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
    patchFlag: e && t.type !== Ve ? s === -1 ? 16 : s | 16 : s,
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
    ssContent: t.ssContent && Cn(t.ssContent),
    ssFallback: t.ssFallback && Cn(t.ssFallback),
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
}
function ll(t = " ", e = 0) {
  return De(Zs, null, t, e);
}
function gn(t = "", e = !1) {
  return e ? (pe(), St(xt, null, t)) : De(xt, null, t);
}
function Wt(t) {
  return t == null || typeof t == "boolean" ? De(xt) : ne(t) ? De(
    Ve,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : typeof t == "object" ? un(t) : De(Zs, null, String(t));
}
function un(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : Cn(t);
}
function cl(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (ne(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const i = e.default;
      i && (i._c && (i._d = !1), cl(t, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = e._;
      !i && !(eo in e) ? e._ctx = Qe : i === 3 && Qe && (Qe.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else
    oe(e) ? (e = { default: e, _ctx: Qe }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [ll(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function qm(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const i in r)
      if (i === "class")
        e.class !== r.class && (e.class = yi([e.class, r.class]));
      else if (i === "style")
        e.style = Va([e.style, r.style]);
      else if (Fs(i)) {
        const s = e[i], o = r[i];
        o && s !== o && !(ne(s) && s.includes(o)) && (e[i] = s ? [].concat(s, o) : o);
      } else
        i !== "" && (e[i] = r[i]);
  }
  return e;
}
function Dt(t, e, n, r = null) {
  kt(t, e, 7, [
    n,
    r
  ]);
}
const Gm = Kd();
let Jm = 0;
function Ym(t, e, n) {
  const r = t.type, i = (e ? e.appContext : t.appContext) || Gm, s = {
    uid: Jm++,
    vnode: t,
    type: r,
    parent: e,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new gh(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: e ? e.provides : Object.create(i.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Gd(r, i),
    emitsOptions: Rd(r, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: _e,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: _e,
    data: _e,
    props: _e,
    attrs: _e,
    slots: _e,
    refs: _e,
    setupState: _e,
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = nm.bind(null, s), t.ce && t.ce(s), s;
}
let He = null;
const Xm = () => He || Qe;
let ul, or, kc = "__VUE_INSTANCE_SETTERS__";
(or = Vo()[kc]) || (or = Vo()[kc] = []), or.push((t) => He = t), ul = (t) => {
  or.length > 1 ? or.forEach((e) => e(t)) : or[0](t);
};
const Tr = (t) => {
  ul(t), t.scope.on();
}, Yn = () => {
  He && He.scope.off(), ul(null);
};
function tf(t) {
  return t.vnode.shapeFlag & 4;
}
let di = !1;
function Qm(t, e = !1) {
  di = e;
  const { props: n, children: r } = t.vnode, i = tf(t);
  Im(t, n, i, e), Dm(t, r);
  const s = i ? Zm(t, e) : void 0;
  return di = !1, s;
}
function Zm(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = xd(new Proxy(t.ctx, Em));
  const { setup: r } = n;
  if (r) {
    const i = t.setupContext = r.length > 1 ? t1(t) : null;
    Tr(t), Lr();
    const s = _n(
      r,
      t,
      0,
      [t.props, i]
    );
    if (zr(), Yn(), od(s)) {
      if (s.then(Yn, Yn), e)
        return s.then((o) => {
          xc(t, o, e);
        }).catch((o) => {
          Gs(o, t, 0);
        });
      t.asyncDep = s;
    } else
      xc(t, s, e);
  } else
    nf(t, e);
}
function xc(t, e, n) {
  oe(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : we(e) && (t.setupState = Ad(e)), nf(t, n);
}
let Sc;
function nf(t, e, n) {
  const r = t.type;
  if (!t.render) {
    if (!e && Sc && !r.render) {
      const i = r.template || ol(t).template;
      if (i) {
        const { isCustomElement: s, compilerOptions: o } = t.appContext.config, { delimiters: a, compilerOptions: l } = r, c = Re(
          Re(
            {
              isCustomElement: s,
              delimiters: a
            },
            o
          ),
          l
        );
        r.render = Sc(i, c);
      }
    }
    t.render = r.render || jt;
  }
  Tr(t), Lr(), Mm(t), zr(), Yn();
}
function e1(t) {
  return t.attrsProxy || (t.attrsProxy = new Proxy(
    t.attrs,
    {
      get(e, n) {
        return ct(t, "get", "$attrs"), e[n];
      }
    }
  ));
}
function t1(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    get attrs() {
      return e1(t);
    },
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function dl(t) {
  if (t.exposed)
    return t.exposeProxy || (t.exposeProxy = new Proxy(Ad(xd(t.exposed)), {
      get(e, n) {
        if (n in e)
          return e[n];
        if (n in Qr)
          return Qr[n](t);
      },
      has(e, n) {
        return n in e || n in Qr;
      }
    }));
}
function n1(t, e = !0) {
  return oe(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function r1(t) {
  return oe(t) && "__vccOpts" in t;
}
const rf = (t, e) => Yh(t, e, di);
function sf(t, e, n) {
  const r = arguments.length;
  return r === 2 ? we(e) && !ne(e) ? ds(e) ? De(t, null, [e]) : De(t, e) : De(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ds(n) && (n = [n]), De(t, e, n));
}
const i1 = Symbol.for("v-scx"), s1 = () => qi(i1), o1 = "3.3.4", a1 = "http://www.w3.org/2000/svg", $n = typeof document < "u" ? document : null, Cc = $n && /* @__PURE__ */ $n.createElement("template"), l1 = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const i = e ? $n.createElementNS(a1, t) : $n.createElement(t, n ? { is: n } : void 0);
    return t === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
  },
  createText: (t) => $n.createTextNode(t),
  createComment: (t) => $n.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => $n.querySelector(t),
  setScopeId(t, e) {
    t.setAttribute(e, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(t, e, n, r, i, s) {
    const o = n ? n.previousSibling : e.lastChild;
    if (i && (i === s || i.nextSibling))
      for (; e.insertBefore(i.cloneNode(!0), n), !(i === s || !(i = i.nextSibling)); )
        ;
    else {
      Cc.innerHTML = r ? `<svg>${t}</svg>` : t;
      const a = Cc.content;
      if (r) {
        const l = a.firstChild;
        for (; l.firstChild; )
          a.appendChild(l.firstChild);
        a.removeChild(l);
      }
      e.insertBefore(a, n);
    }
    return [
      // first
      o ? o.nextSibling : e.firstChild,
      // last
      n ? n.previousSibling : e.lastChild
    ];
  }
};
function c1(t, e, n) {
  const r = t._vtc;
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
function u1(t, e, n) {
  const r = t.style, i = Ie(n);
  if (n && !i) {
    if (e && !Ie(e))
      for (const s in e)
        n[s] == null && ra(r, s, "");
    for (const s in n)
      ra(r, s, n[s]);
  } else {
    const s = r.display;
    i ? e !== n && (r.cssText = n) : e && t.removeAttribute("style"), "_vod" in t && (r.display = s);
  }
}
const Ec = /\s*!important$/;
function ra(t, e, n) {
  if (ne(n))
    n.forEach((r) => ra(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = d1(t, e);
    Ec.test(n) ? t.setProperty(
      Ir(r),
      n.replace(Ec, ""),
      "important"
    ) : t[r] = n;
  }
}
const Mc = ["Webkit", "Moz", "ms"], go = {};
function d1(t, e) {
  const n = go[e];
  if (n)
    return n;
  let r = qt(e);
  if (r !== "filter" && r in t)
    return go[e] = r;
  r = Us(r);
  for (let i = 0; i < Mc.length; i++) {
    const s = Mc[i] + r;
    if (s in t)
      return go[e] = s;
  }
  return e;
}
const Ac = "http://www.w3.org/1999/xlink";
function f1(t, e, n, r, i) {
  if (r && e.startsWith("xlink:"))
    n == null ? t.removeAttributeNS(Ac, e.slice(6, e.length)) : t.setAttributeNS(Ac, e, n);
  else {
    const s = mh(e);
    n == null || s && !cd(n) ? t.removeAttribute(e) : t.setAttribute(e, s ? "" : n);
  }
}
function p1(t, e, n, r, i, s, o) {
  if (e === "innerHTML" || e === "textContent") {
    r && o(r, i, s), t[e] = n ?? "";
    return;
  }
  const a = t.tagName;
  if (e === "value" && a !== "PROGRESS" && // custom elements may use _value internally
  !a.includes("-")) {
    t._value = n;
    const c = a === "OPTION" ? t.getAttribute("value") : t.value, d = n ?? "";
    c !== d && (t.value = d), n == null && t.removeAttribute(e);
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const c = typeof t[e];
    c === "boolean" ? n = cd(n) : n == null && c === "string" ? (n = "", l = !0) : c === "number" && (n = 0, l = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  l && t.removeAttribute(e);
}
function h1(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function m1(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
function g1(t, e, n, r, i = null) {
  const s = t._vei || (t._vei = {}), o = s[e];
  if (r && o)
    o.value = r;
  else {
    const [a, l] = y1(e);
    if (r) {
      const c = s[e] = w1(r, i);
      h1(t, a, c, l);
    } else
      o && (m1(t, a, o, l), s[e] = void 0);
  }
}
const Tc = /(?:Once|Passive|Capture)$/;
function y1(t) {
  let e;
  if (Tc.test(t)) {
    e = {};
    let r;
    for (; r = t.match(Tc); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Ir(t.slice(2)), e];
}
let yo = 0;
const b1 = /* @__PURE__ */ Promise.resolve(), v1 = () => yo || (b1.then(() => yo = 0), yo = Date.now());
function w1(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    kt(
      _1(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = v1(), n;
}
function _1(t, e) {
  if (ne(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map((r) => (i) => !i._stopped && r && r(i));
  } else
    return e;
}
const Oc = /^on[a-z]/, k1 = (t, e, n, r, i = !1, s, o, a, l) => {
  e === "class" ? c1(t, r, i) : e === "style" ? u1(t, n, r) : Fs(e) ? $a(e) || g1(t, e, n, r, o) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : x1(t, e, r, i)) ? p1(
    t,
    e,
    r,
    s,
    o,
    a,
    l
  ) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), f1(t, e, r, i));
};
function x1(t, e, n, r) {
  return r ? !!(e === "innerHTML" || e === "textContent" || e in t && Oc.test(e) && oe(n)) : e === "spellcheck" || e === "draggable" || e === "translate" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA" || Oc.test(e) && Ie(n) ? !1 : e in t;
}
const rn = "transition", Fr = "animation", fl = (t, { slots: e }) => sf(pm, S1(t), e);
fl.displayName = "Transition";
const of = {
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
fl.props = /* @__PURE__ */ Re(
  {},
  Ld,
  of
);
const In = (t, e = []) => {
  ne(t) ? t.forEach((n) => n(...e)) : t && t(...e);
}, jc = (t) => t ? ne(t) ? t.some((e) => e.length > 1) : t.length > 1 : !1;
function S1(t) {
  const e = {};
  for (const j in t)
    j in of || (e[j] = t[j]);
  if (t.css === !1)
    return e;
  const {
    name: n = "v",
    type: r,
    duration: i,
    enterFromClass: s = `${n}-enter-from`,
    enterActiveClass: o = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: l = s,
    appearActiveClass: c = o,
    appearToClass: d = a,
    leaveFromClass: f = `${n}-leave-from`,
    leaveActiveClass: p = `${n}-leave-active`,
    leaveToClass: g = `${n}-leave-to`
  } = t, y = C1(i), w = y && y[0], x = y && y[1], {
    onBeforeEnter: E,
    onEnter: T,
    onEnterCancelled: P,
    onLeave: u,
    onLeaveCancelled: m,
    onBeforeAppear: h = E,
    onAppear: b = T,
    onAppearCancelled: v = P
  } = e, S = (j, R, N) => {
    Ln(j, R ? d : a), Ln(j, R ? c : o), N && N();
  }, k = (j, R) => {
    j._isLeaving = !1, Ln(j, f), Ln(j, g), Ln(j, p), R && R();
  }, M = (j) => (R, N) => {
    const z = j ? b : T, _ = () => S(R, j, N);
    In(z, [R, _]), Pc(() => {
      Ln(R, j ? l : s), sn(R, j ? d : a), jc(z) || Nc(R, r, w, _);
    });
  };
  return Re(e, {
    onBeforeEnter(j) {
      In(E, [j]), sn(j, s), sn(j, o);
    },
    onBeforeAppear(j) {
      In(h, [j]), sn(j, l), sn(j, c);
    },
    onEnter: M(!1),
    onAppear: M(!0),
    onLeave(j, R) {
      j._isLeaving = !0;
      const N = () => k(j, R);
      sn(j, f), A1(), sn(j, p), Pc(() => {
        j._isLeaving && (Ln(j, f), sn(j, g), jc(u) || Nc(j, r, x, N));
      }), In(u, [j, N]);
    },
    onEnterCancelled(j) {
      S(j, !1), In(P, [j]);
    },
    onAppearCancelled(j) {
      S(j, !0), In(v, [j]);
    },
    onLeaveCancelled(j) {
      k(j), In(m, [j]);
    }
  });
}
function C1(t) {
  if (t == null)
    return null;
  if (we(t))
    return [bo(t.enter), bo(t.leave)];
  {
    const e = bo(t);
    return [e, e];
  }
}
function bo(t) {
  return ch(t);
}
function sn(t, e) {
  e.split(/\s+/).forEach((n) => n && t.classList.add(n)), (t._vtc || (t._vtc = /* @__PURE__ */ new Set())).add(e);
}
function Ln(t, e) {
  e.split(/\s+/).forEach((r) => r && t.classList.remove(r));
  const { _vtc: n } = t;
  n && (n.delete(e), n.size || (t._vtc = void 0));
}
function Pc(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let E1 = 0;
function Nc(t, e, n, r) {
  const i = t._endId = ++E1, s = () => {
    i === t._endId && r();
  };
  if (n)
    return setTimeout(s, n);
  const { type: o, timeout: a, propCount: l } = M1(t, e);
  if (!o)
    return r();
  const c = o + "end";
  let d = 0;
  const f = () => {
    t.removeEventListener(c, p), s();
  }, p = (g) => {
    g.target === t && ++d >= l && f();
  };
  setTimeout(() => {
    d < l && f();
  }, a + 1), t.addEventListener(c, p);
}
function M1(t, e) {
  const n = window.getComputedStyle(t), r = (y) => (n[y] || "").split(", "), i = r(`${rn}Delay`), s = r(`${rn}Duration`), o = Rc(i, s), a = r(`${Fr}Delay`), l = r(`${Fr}Duration`), c = Rc(a, l);
  let d = null, f = 0, p = 0;
  e === rn ? o > 0 && (d = rn, f = o, p = s.length) : e === Fr ? c > 0 && (d = Fr, f = c, p = l.length) : (f = Math.max(o, c), d = f > 0 ? o > c ? rn : Fr : null, p = d ? d === rn ? s.length : l.length : 0);
  const g = d === rn && /\b(transform|all)(,|$)/.test(
    r(`${rn}Property`).toString()
  );
  return {
    type: d,
    timeout: f,
    propCount: p,
    hasTransform: g
  };
}
function Rc(t, e) {
  for (; t.length < e.length; )
    t = t.concat(t);
  return Math.max(...e.map((n, r) => Ic(n) + Ic(t[r])));
}
function Ic(t) {
  return Number(t.slice(0, -1).replace(",", ".")) * 1e3;
}
function A1() {
  return document.body.offsetHeight;
}
const T1 = /* @__PURE__ */ Re({ patchProp: k1 }, l1);
let Lc;
function O1() {
  return Lc || (Lc = $m(T1));
}
const j1 = (...t) => {
  const e = O1().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const i = P1(r);
    if (!i)
      return;
    const s = e._component;
    !oe(s) && !s.render && !s.template && (s.template = i.innerHTML), i.innerHTML = "";
    const o = n(i, !1, i instanceof SVGElement);
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), o;
  }, e;
};
function P1(t) {
  return Ie(t) ? document.querySelector(t) : t;
}
function N1(t) {
  return dd() ? (bh(t), !0) : !1;
}
function pl(t) {
  return typeof t == "function" ? t() : Md(t);
}
const R1 = typeof window < "u" && typeof document < "u", I1 = Object.prototype.toString, L1 = (t) => I1.call(t) === "[object Object]", z1 = () => {
};
function D1(t, e) {
  function n(...r) {
    return new Promise((i, s) => {
      Promise.resolve(t(() => e.apply(this, r), { fn: e, thisArg: this, args: r })).then(i).catch(s);
    });
  }
  return n;
}
const af = (t) => t();
function B1(t = af) {
  const e = qs(!0);
  function n() {
    e.value = !1;
  }
  function r() {
    e.value = !0;
  }
  const i = (...s) => {
    e.value && t(...s);
  };
  return { isActive: Ya(e), pause: n, resume: r, eventFilter: i };
}
function $1(t, e, n = {}) {
  const {
    eventFilter: r = af,
    ...i
  } = n;
  return xr(
    t,
    D1(
      r,
      e
    ),
    i
  );
}
function H1(t, e, n = {}) {
  const {
    eventFilter: r,
    ...i
  } = n, { eventFilter: s, pause: o, resume: a, isActive: l } = B1(r);
  return { stop: $1(
    t,
    e,
    {
      ...i,
      eventFilter: s
    }
  ), pause: o, resume: a, isActive: l };
}
function F1(t) {
  var e;
  const n = pl(t);
  return (e = n?.$el) != null ? e : n;
}
const ia = R1 ? window : void 0;
function zc(...t) {
  let e, n, r, i;
  if (typeof t[0] == "string" || Array.isArray(t[0]) ? ([n, r, i] = t, e = ia) : [e, n, r, i] = t, !e)
    return z1;
  Array.isArray(n) || (n = [n]), Array.isArray(r) || (r = [r]);
  const s = [], o = () => {
    s.forEach((d) => d()), s.length = 0;
  }, a = (d, f, p, g) => (d.addEventListener(f, p, g), () => d.removeEventListener(f, p, g)), l = xr(
    () => [F1(e), pl(i)],
    ([d, f]) => {
      if (o(), !d)
        return;
      const p = L1(f) ? { ...f } : f;
      s.push(
        ...n.flatMap((g) => r.map((y) => a(d, g, y, p)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    l(), o();
  };
  return N1(c), c;
}
const Ti = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Oi = "__vueuse_ssr_handlers__", W1 = /* @__PURE__ */ V1();
function V1() {
  return Oi in Ti || (Ti[Oi] = Ti[Oi] || {}), Ti[Oi];
}
function U1(t, e) {
  return W1[t] || e;
}
function K1(t) {
  return t == null ? "any" : t instanceof Set ? "set" : t instanceof Map ? "map" : t instanceof Date ? "date" : typeof t == "boolean" ? "boolean" : typeof t == "string" ? "string" : typeof t == "object" ? "object" : Number.isNaN(t) ? "any" : "number";
}
const q1 = {
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
}, Dc = "vueuse-storage";
function G1(t, e, n, r = {}) {
  var i;
  const {
    flush: s = "pre",
    deep: o = !0,
    listenToStorageChanges: a = !0,
    writeDefaults: l = !0,
    mergeDefaults: c = !1,
    shallow: d,
    window: f = ia,
    eventFilter: p,
    onError: g = (v) => {
      console.error(v);
    }
  } = r, y = (d ? Kh : qs)(e);
  if (!n)
    try {
      n = U1("getDefaultStorage", () => {
        var v;
        return (v = ia) == null ? void 0 : v.localStorage;
      })();
    } catch (v) {
      g(v);
    }
  if (!n)
    return y;
  const w = pl(e), x = K1(w), E = (i = r.serializer) != null ? i : q1[x], { pause: T, resume: P } = H1(
    y,
    () => u(y.value),
    { flush: s, deep: o, eventFilter: p }
  );
  return f && a && (zc(f, "storage", b), zc(f, Dc, h)), b(), y;
  function u(v) {
    try {
      if (v == null)
        n.removeItem(t);
      else {
        const S = E.write(v), k = n.getItem(t);
        k !== S && (n.setItem(t, S), f && f.dispatchEvent(new CustomEvent(Dc, {
          detail: {
            key: t,
            oldValue: k,
            newValue: S,
            storageArea: n
          }
        })));
      }
    } catch (S) {
      g(S);
    }
  }
  function m(v) {
    const S = v ? v.newValue : n.getItem(t);
    if (S == null)
      return l && w !== null && n.setItem(t, E.write(w)), w;
    if (!v && c) {
      const k = E.read(S);
      return typeof c == "function" ? c(k, w) : x === "object" && !Array.isArray(k) ? { ...w, ...k } : k;
    } else
      return typeof S != "string" ? S : E.read(S);
  }
  function h(v) {
    b(v.detail);
  }
  function b(v) {
    if (!(v && v.storageArea !== n)) {
      if (v && v.key == null) {
        y.value = w;
        return;
      }
      if (!(v && v.key !== t)) {
        T();
        try {
          v?.newValue !== E.write(y.value) && (y.value = m(v));
        } catch (S) {
          g(S);
        } finally {
          v ? Od(P) : P();
        }
      }
    }
  }
}
function sa(t) {
  this.message = t;
}
sa.prototype = new Error(), sa.prototype.name = "InvalidCharacterError";
var Bc = typeof window < "u" && window.atob && window.atob.bind(window) || function(t) {
  var e = String(t).replace(/=+$/, "");
  if (e.length % 4 == 1)
    throw new sa("'atob' failed: The string to be decoded is not correctly encoded.");
  for (var n, r, i = 0, s = 0, o = ""; r = e.charAt(s++); ~r && (n = i % 4 ? 64 * n + r : r, i++ % 4) ? o += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)
    r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(r);
  return o;
};
function J1(t) {
  var e = t.replace(/-/g, "+").replace(/_/g, "/");
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
      throw "Illegal base64url string!";
  }
  try {
    return function(n) {
      return decodeURIComponent(Bc(n).replace(/(.)/g, function(r, i) {
        var s = i.charCodeAt(0).toString(16).toUpperCase();
        return s.length < 2 && (s = "0" + s), "%" + s;
      }));
    }(e);
  } catch {
    return Bc(e);
  }
}
function fs(t) {
  this.message = t;
}
function Y1(t, e) {
  if (typeof t != "string")
    throw new fs("Invalid token specified");
  var n = (e = e || {}).header === !0 ? 0 : 1;
  try {
    return JSON.parse(J1(t.split(".")[n]));
  } catch (r) {
    throw new fs("Invalid token specified: " + r.message);
  }
}
fs.prototype = new Error(), fs.prototype.name = "InvalidTokenError";
var hl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ml(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var lf = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(hl, function() {
    var n = {
      /**
       * 
       * @param DomElement oDomElement
       * @param Object oOptions
       * @return self
       */
      attachTo: function(r, i) {
        if (r.scannerDetectionData !== void 0)
          throw new Error("onScan.js is already initialized for DOM element " + r);
        var s = {
          onScan: function(o, a) {
          },
          // Callback after detection of a successfull scanning:  function(){sScancode, iCount)}()
          onScanError: function(o) {
          },
          // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
          onKeyProcess: function(o, a) {
          },
          // Callback after receiving and processing a char (scanned char in parameter)
          onKeyDetect: function(o, a) {
          },
          // Callback after detecting a keyDown (key char in parameter) - in contrast to onKeyProcess, this fires for non-character keys like tab, arrows, etc. too!
          onPaste: function(o, a) {
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
        return i = this._mergeOptions(s, i), r.scannerDetectionData = {
          options: i,
          vars: {
            firstCharTime: 0,
            lastCharTime: 0,
            accumulatedString: "",
            testTimer: !1,
            longPressTimeStart: 0,
            longPressed: !1
          }
        }, i.reactToPaste === !0 && r.addEventListener("paste", this._handlePaste, i.captureEvents), i.scanButtonKeyCode !== !1 && r.addEventListener("keyup", this._handleKeyUp, i.captureEvents), (i.reactToKeydown === !0 || i.scanButtonKeyCode !== !1) && r.addEventListener("keydown", this._handleKeyDown, i.captureEvents), this;
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
      setOptions: function(r, i) {
        switch (r.scannerDetectionData.options.reactToPaste) {
          case !0:
            i.reactToPaste === !1 && r.removeEventListener("paste", this._handlePaste);
            break;
          case !1:
            i.reactToPaste === !0 && r.addEventListener("paste", this._handlePaste);
            break;
        }
        switch (r.scannerDetectionData.options.scanButtonKeyCode) {
          case !1:
            i.scanButtonKeyCode !== !1 && r.addEventListener("keyup", this._handleKeyUp);
            break;
          default:
            i.scanButtonKeyCode === !1 && r.removeEventListener("keyup", this._handleKeyUp);
            break;
        }
        return r.scannerDetectionData.options = this._mergeOptions(r.scannerDetectionData.options, i), this._reinitialize(r), this;
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
        var i = this._getNormalizedKeyNum(r);
        switch (!0) {
          case (i >= 48 && i <= 90):
          case (i >= 106 && i <= 111):
            if (r.key !== void 0 && r.key !== "")
              return r.key;
            var s = String.fromCharCode(i);
            switch (r.shiftKey) {
              case !1:
                s = s.toLowerCase();
                break;
              case !0:
                s = s.toUpperCase();
                break;
            }
            return s;
          case (i >= 96 && i <= 105):
            return 0 + (i - 96);
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
      simulate: function(r, i) {
        return this._reinitialize(r), Array.isArray(i) ? i.forEach(function(s) {
          var o = {};
          (typeof s == "object" || typeof s == "function") && s !== null ? o = s : o.keyCode = parseInt(s);
          var a = new KeyboardEvent("keydown", o);
          document.dispatchEvent(a);
        }) : this._validateScanCode(r, i), this;
      },
      /**
       * @private
       * @param DomElement oDomElement
       * @return void
       */
      _reinitialize: function(r) {
        var i = r.scannerDetectionData.vars;
        i.firstCharTime = 0, i.lastCharTime = 0, i.accumulatedString = "";
      },
      /**
       * @private
       * @param DomElement oDomElement
          * @return boolean
       */
      _isFocusOnIgnoredElement: function(r) {
        var i = r.scannerDetectionData.options.ignoreIfFocusOn;
        if (!i)
          return !1;
        var s = document.activeElement;
        if (Array.isArray(i)) {
          for (var o = 0; o < i.length; o++)
            if (s.matches(i[o]) === !0)
              return !0;
        } else if (s.matches(i))
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
      _validateScanCode: function(r, i) {
        var s = r.scannerDetectionData, o = s.options, a = s.options.singleScanQty, l = s.vars.firstCharTime, c = s.vars.lastCharTime, d = {}, f;
        switch (!0) {
          case i.length < o.minLength:
            d = {
              message: "Receieved code is shorter then minimal length"
            };
            break;
          case c - l > i.length * o.avgTimeByChar:
            d = {
              message: "Receieved code was not entered in time"
            };
            break;
          default:
            return o.onScan.call(r, i, a), f = new CustomEvent(
              "scan",
              {
                detail: {
                  scanCode: i,
                  qty: a
                }
              }
            ), r.dispatchEvent(f), n._reinitialize(r), !0;
        }
        return d.scanCode = i, d.scanDuration = c - l, d.avgTimeByChar = o.avgTimeByChar, d.minLength = o.minLength, o.onScanError.call(r, d), f = new CustomEvent(
          "scanError",
          { detail: d }
        ), r.dispatchEvent(f), n._reinitialize(r), !1;
      },
      /**
       * @private
       * @param Object oDefaults
       * @param Object oOptions
       * @return Object
       */
      _mergeOptions: function(r, i) {
        var s = {}, o;
        for (o in r)
          Object.prototype.hasOwnProperty.call(r, o) && (s[o] = r[o]);
        for (o in i)
          Object.prototype.hasOwnProperty.call(i, o) && (s[o] = i[o]);
        return s;
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
        var i = n._getNormalizedKeyNum(r), s = this.scannerDetectionData.options, o = this.scannerDetectionData.vars, a = !1;
        if (s.onKeyDetect.call(this, i, r) !== !1 && !n._isFocusOnIgnoredElement(this)) {
          if (s.scanButtonKeyCode !== !1 && i == s.scanButtonKeyCode) {
            o.longPressed || (o.longPressTimer = setTimeout(s.onScanButtonLongPress, s.scanButtonLongPressTime, this), o.longPressed = !0);
            return;
          }
          switch (!0) {
            case (o.firstCharTime && s.suffixKeyCodes.indexOf(i) !== -1):
              r.preventDefault(), r.stopImmediatePropagation(), a = !0;
              break;
            case (!o.firstCharTime && s.prefixKeyCodes.indexOf(i) !== -1):
              r.preventDefault(), r.stopImmediatePropagation(), a = !1;
              break;
            default:
              var l = s.keyCodeMapper.call(this, r);
              if (l === null)
                return;
              o.accumulatedString += l, s.preventDefault && r.preventDefault(), s.stopPropagation && r.stopImmediatePropagation(), a = !1;
              break;
          }
          o.firstCharTime || (o.firstCharTime = Date.now()), o.lastCharTime = Date.now(), o.testTimer && clearTimeout(o.testTimer), a ? (n._validateScanCode(this, o.accumulatedString), o.testTimer = !1) : o.testTimer = setTimeout(n._validateScanCode, s.timeBeforeScanTest, this, o.accumulatedString), s.onKeyProcess.call(this, l, r);
        }
      },
      /**
       * @private
       * @param Event e
       * @return void
       */
      _handlePaste: function(r) {
        var i = this.scannerDetectionData.options, s = this.scannerDetectionData.vars, o = (event.clipboardData || window.clipboardData).getData("text");
        n._isFocusOnIgnoredElement(this) || (r.preventDefault(), i.stopPropagation && r.stopImmediatePropagation(), i.onPaste.call(this, o, event), s.firstCharTime = 0, s.lastCharTime = 0, n._validateScanCode(this, o));
      },
      /**
       * @private
       * @param KeyboardEvent e
       * @return void
       */
      _handleKeyUp: function(r) {
        if (!n._isFocusOnIgnoredElement(this)) {
          var i = n._getNormalizedKeyNum(r);
          i == this.scannerDetectionData.options.scanButtonKeyCode && (clearTimeout(this.scannerDetectionData.vars.longPressTimer), this.scannerDetectionData.vars.longPressed = !1);
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
})(lf);
var X1 = lf.exports;
const Q1 = /* @__PURE__ */ ml(X1);
function dn(t, e) {
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
const mt = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, i] of e)
    n[r] = i;
  return n;
};
var cf = { exports: {} };
(function(t, e) {
  (function(r, i) {
    t.exports = i();
  })(typeof self < "u" ? self : hl, function() {
    return (
      /******/
      function(n) {
        var r = {};
        function i(s) {
          if (r[s])
            return r[s].exports;
          var o = r[s] = {
            /******/
            i: s,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return n[s].call(o.exports, o, o.exports, i), o.l = !0, o.exports;
        }
        return i.m = n, i.c = r, i.d = function(s, o, a) {
          i.o(s, o) || Object.defineProperty(s, o, {
            /******/
            configurable: !1,
            /******/
            enumerable: !0,
            /******/
            get: a
            /******/
          });
        }, i.r = function(s) {
          Object.defineProperty(s, "__esModule", { value: !0 });
        }, i.n = function(s) {
          var o = s && s.__esModule ? (
            /******/
            function() {
              return s.default;
            }
          ) : (
            /******/
            function() {
              return s;
            }
          );
          return i.d(o, "a", o), o;
        }, i.o = function(s, o) {
          return Object.prototype.hasOwnProperty.call(s, o);
        }, i.p = "", i(i.s = 0);
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
          function(n, r, i) {
            var s, o;
            /*!
              Copyright (c) 2016 Jed Watson.
              Licensed under the MIT License (MIT), see
              http://jedwatson.github.io/classnames
            */
            (function() {
              var a = function() {
                function l() {
                }
                l.prototype = /* @__PURE__ */ Object.create(null);
                function c(E, T) {
                  for (var P = T.length, u = 0; u < P; ++u)
                    w(E, T[u]);
                }
                var d = {}.hasOwnProperty;
                function f(E, T) {
                  E[T] = !0;
                }
                function p(E, T) {
                  for (var P in T)
                    d.call(T, P) && (E[P] = !!T[P]);
                }
                var g = /\s+/;
                function y(E, T) {
                  for (var P = T.split(g), u = P.length, m = 0; m < u; ++m)
                    E[P[m]] = !0;
                }
                function w(E, T) {
                  if (T) {
                    var P = typeof T;
                    P === "string" ? y(E, T) : Array.isArray(T) ? c(E, T) : P === "object" ? p(E, T) : P === "number" && f(E, T);
                  }
                }
                function x() {
                  for (var E = arguments.length, T = Array(E), P = 0; P < E; P++)
                    T[P] = arguments[P];
                  var u = new l();
                  c(u, T);
                  var m = [];
                  for (var h in u)
                    u[h] && m.push(h);
                  return m.join(" ");
                }
                return x;
              }();
              typeof n < "u" && n.exports ? n.exports = a : (s = [], o = function() {
                return a;
              }.apply(r, s), o !== void 0 && (n.exports = o));
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
          function(n, r, i) {
            i(
              /*! ../../modules/es.string.iterator */
              "./node_modules/core-js/modules/es.string.iterator.js"
            ), i(
              /*! ../../modules/es.array.from */
              "./node_modules/core-js/modules/es.array.from.js"
            );
            var s = i(
              /*! ../../internals/path */
              "./node_modules/core-js/internals/path.js"
            );
            n.exports = s.Array.from;
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
            n.exports = function(i) {
              if (typeof i != "function")
                throw TypeError(String(i) + " is not a function");
              return i;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            );
            n.exports = function(o) {
              if (!s(o))
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/bind-context */
              "./node_modules/core-js/internals/bind-context.js"
            ), o = i(
              /*! ../internals/to-object */
              "./node_modules/core-js/internals/to-object.js"
            ), a = i(
              /*! ../internals/call-with-safe-iteration-closing */
              "./node_modules/core-js/internals/call-with-safe-iteration-closing.js"
            ), l = i(
              /*! ../internals/is-array-iterator-method */
              "./node_modules/core-js/internals/is-array-iterator-method.js"
            ), c = i(
              /*! ../internals/to-length */
              "./node_modules/core-js/internals/to-length.js"
            ), d = i(
              /*! ../internals/create-property */
              "./node_modules/core-js/internals/create-property.js"
            ), f = i(
              /*! ../internals/get-iterator-method */
              "./node_modules/core-js/internals/get-iterator-method.js"
            );
            n.exports = function(g) {
              var y = o(g), w = typeof this == "function" ? this : Array, x = arguments.length, E = x > 1 ? arguments[1] : void 0, T = E !== void 0, P = 0, u = f(y), m, h, b, v;
              if (T && (E = s(E, x > 2 ? arguments[2] : void 0, 2)), u != null && !(w == Array && l(u)))
                for (v = u.call(y), h = new w(); !(b = v.next()).done; P++)
                  d(
                    h,
                    P,
                    T ? a(v, E, [b.value, P], !0) : b.value
                  );
              else
                for (m = c(y.length), h = new w(m); m > P; P++)
                  d(h, P, T ? E(y[P], P) : y[P]);
              return h.length = P, h;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), o = i(
              /*! ../internals/to-length */
              "./node_modules/core-js/internals/to-length.js"
            ), a = i(
              /*! ../internals/to-absolute-index */
              "./node_modules/core-js/internals/to-absolute-index.js"
            );
            n.exports = function(l) {
              return function(c, d, f) {
                var p = s(c), g = o(p.length), y = a(f, g), w;
                if (l && d != d) {
                  for (; g > y; )
                    if (w = p[y++], w != w)
                      return !0;
                } else
                  for (; g > y; y++)
                    if ((l || y in p) && p[y] === d)
                      return l || y || 0;
                return !l && -1;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/a-function */
              "./node_modules/core-js/internals/a-function.js"
            );
            n.exports = function(o, a, l) {
              if (s(o), a === void 0)
                return o;
              switch (l) {
                case 0:
                  return function() {
                    return o.call(a);
                  };
                case 1:
                  return function(c) {
                    return o.call(a, c);
                  };
                case 2:
                  return function(c, d) {
                    return o.call(a, c, d);
                  };
                case 3:
                  return function(c, d, f) {
                    return o.call(a, c, d, f);
                  };
              }
              return function() {
                return o.apply(a, arguments);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            );
            n.exports = function(o, a, l, c) {
              try {
                return c ? a(s(l)[0], l[1]) : a(l);
              } catch (f) {
                var d = o.return;
                throw d !== void 0 && s(d.call(o)), f;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), o = s("iterator"), a = !1;
            try {
              var l = 0, c = {
                next: function() {
                  return { done: !!l++ };
                },
                return: function() {
                  a = !0;
                }
              };
              c[o] = function() {
                return this;
              }, Array.from(c, function() {
                throw 2;
              });
            } catch {
            }
            n.exports = function(d, f) {
              if (!f && !a)
                return !1;
              var p = !1;
              try {
                var g = {};
                g[o] = function() {
                  return {
                    next: function() {
                      return { done: p = !0 };
                    }
                  };
                }, d(g);
              } catch {
              }
              return p;
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
            var i = {}.toString;
            n.exports = function(s) {
              return i.call(s).slice(8, -1);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/classof-raw */
              "./node_modules/core-js/internals/classof-raw.js"
            ), o = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), a = o("toStringTag"), l = s(function() {
              return arguments;
            }()) == "Arguments", c = function(d, f) {
              try {
                return d[f];
              } catch {
              }
            };
            n.exports = function(d) {
              var f, p, g;
              return d === void 0 ? "Undefined" : d === null ? "Null" : typeof (p = c(f = Object(d), a)) == "string" ? p : l ? s(f) : (g = s(f)) == "Object" && typeof f.callee == "function" ? "Arguments" : g;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), o = i(
              /*! ../internals/own-keys */
              "./node_modules/core-js/internals/own-keys.js"
            ), a = i(
              /*! ../internals/object-get-own-property-descriptor */
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
            ), l = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            );
            n.exports = function(c, d) {
              for (var f = o(d), p = l.f, g = a.f, y = 0; y < f.length; y++) {
                var w = f[y];
                s(c, w) || p(c, w, g(d, w));
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            );
            n.exports = !s(function() {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/iterators-core */
              "./node_modules/core-js/internals/iterators-core.js"
            ).IteratorPrototype, o = i(
              /*! ../internals/object-create */
              "./node_modules/core-js/internals/object-create.js"
            ), a = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            ), l = i(
              /*! ../internals/set-to-string-tag */
              "./node_modules/core-js/internals/set-to-string-tag.js"
            ), c = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), d = function() {
              return this;
            };
            n.exports = function(f, p, g) {
              var y = p + " Iterator";
              return f.prototype = o(s, { next: a(1, g) }), l(f, y, !1, !0), c[y] = d, f;
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
            n.exports = function(i, s) {
              return {
                enumerable: !(i & 1),
                configurable: !(i & 2),
                writable: !(i & 4),
                value: s
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), o = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), a = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            );
            n.exports = function(l, c, d) {
              var f = s(c);
              f in l ? o.f(l, f, a(0, d)) : l[f] = d;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/export */
              "./node_modules/core-js/internals/export.js"
            ), o = i(
              /*! ../internals/create-iterator-constructor */
              "./node_modules/core-js/internals/create-iterator-constructor.js"
            ), a = i(
              /*! ../internals/object-get-prototype-of */
              "./node_modules/core-js/internals/object-get-prototype-of.js"
            ), l = i(
              /*! ../internals/object-set-prototype-of */
              "./node_modules/core-js/internals/object-set-prototype-of.js"
            ), c = i(
              /*! ../internals/set-to-string-tag */
              "./node_modules/core-js/internals/set-to-string-tag.js"
            ), d = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), f = i(
              /*! ../internals/redefine */
              "./node_modules/core-js/internals/redefine.js"
            ), p = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), g = i(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), y = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), w = i(
              /*! ../internals/iterators-core */
              "./node_modules/core-js/internals/iterators-core.js"
            ), x = w.IteratorPrototype, E = w.BUGGY_SAFARI_ITERATORS, T = p("iterator"), P = "keys", u = "values", m = "entries", h = function() {
              return this;
            };
            n.exports = function(b, v, S, k, M, j, R) {
              o(S, v, k);
              var N = function(Ee) {
                if (Ee === M && W)
                  return W;
                if (!E && Ee in O)
                  return O[Ee];
                switch (Ee) {
                  case P:
                    return function() {
                      return new S(this, Ee);
                    };
                  case u:
                    return function() {
                      return new S(this, Ee);
                    };
                  case m:
                    return function() {
                      return new S(this, Ee);
                    };
                }
                return function() {
                  return new S(this);
                };
              }, z = v + " Iterator", _ = !1, O = b.prototype, L = O[T] || O["@@iterator"] || M && O[M], W = !E && L || N(M), te = v == "Array" && O.entries || L, K, ae, ye;
              if (te && (K = a(te.call(new b())), x !== Object.prototype && K.next && (!g && a(K) !== x && (l ? l(K, x) : typeof K[T] != "function" && d(K, T, h)), c(K, z, !0, !0), g && (y[z] = h))), M == u && L && L.name !== u && (_ = !0, W = function() {
                return L.call(this);
              }), (!g || R) && O[T] !== W && d(O, T, W), y[v] = W, M)
                if (ae = {
                  values: N(u),
                  keys: j ? W : N(P),
                  entries: N(m)
                }, R)
                  for (ye in ae)
                    (E || _ || !(ye in O)) && f(O, ye, ae[ye]);
                else
                  s({ target: v, proto: !0, forced: E || _ }, ae);
              return ae;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            );
            n.exports = !s(function() {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), a = s.document, l = o(a) && o(a.createElement);
            n.exports = function(c) {
              return l ? a.createElement(c) : {};
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/object-get-own-property-descriptor */
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
            ).f, a = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), l = i(
              /*! ../internals/redefine */
              "./node_modules/core-js/internals/redefine.js"
            ), c = i(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), d = i(
              /*! ../internals/copy-constructor-properties */
              "./node_modules/core-js/internals/copy-constructor-properties.js"
            ), f = i(
              /*! ../internals/is-forced */
              "./node_modules/core-js/internals/is-forced.js"
            );
            n.exports = function(p, g) {
              var y = p.target, w = p.global, x = p.stat, E, T, P, u, m, h;
              if (w ? T = s : x ? T = s[y] || c(y, {}) : T = (s[y] || {}).prototype, T)
                for (P in g) {
                  if (m = g[P], p.noTargetGet ? (h = o(T, P), u = h && h.value) : u = T[P], E = f(w ? P : y + (x ? "." : "#") + P, p.forced), !E && u !== void 0) {
                    if (typeof m == typeof u)
                      continue;
                    d(m, u);
                  }
                  (p.sham || u && u.sham) && a(m, "sham", !0), l(T, P, m, p);
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
            n.exports = function(i) {
              try {
                return !!i();
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            );
            n.exports = s("native-function-to-string", Function.toString);
          }
        ),
        /***/
        "./node_modules/core-js/internals/get-iterator-method.js": (
          /*!***************************************************************!*\
            !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
            \***************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, i) {
            var s = i(
              /*! ../internals/classof */
              "./node_modules/core-js/internals/classof.js"
            ), o = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), a = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), l = a("iterator");
            n.exports = function(c) {
              if (c != null)
                return c[l] || c["@@iterator"] || o[s(c)];
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
          function(n, r, i) {
            (function(s) {
              var o = "object", a = function(l) {
                return l && l.Math == Math && l;
              };
              n.exports = // eslint-disable-next-line no-undef
              a(typeof globalThis == o && globalThis) || a(typeof window == o && window) || a(typeof self == o && self) || a(typeof s == o && s) || // eslint-disable-next-line no-new-func
              Function("return this")();
            }).call(this, i(
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
            var i = {}.hasOwnProperty;
            n.exports = function(s, o) {
              return i.call(s, o);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), a = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            );
            n.exports = s ? function(l, c, d) {
              return o.f(l, c, a(1, d));
            } : function(l, c, d) {
              return l[c] = d, l;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = s.document;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), a = i(
              /*! ../internals/document-create-element */
              "./node_modules/core-js/internals/document-create-element.js"
            );
            n.exports = !s && !o(function() {
              return Object.defineProperty(a("div"), "a", {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), o = i(
              /*! ../internals/classof-raw */
              "./node_modules/core-js/internals/classof-raw.js"
            ), a = "".split;
            n.exports = s(function() {
              return !Object("z").propertyIsEnumerable(0);
            }) ? function(l) {
              return o(l) == "String" ? a.call(l, "") : Object(l);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/native-weak-map */
              "./node_modules/core-js/internals/native-weak-map.js"
            ), o = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), a = i(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), l = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), c = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), d = i(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), f = i(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), p = o.WeakMap, g, y, w, x = function(b) {
              return w(b) ? y(b) : g(b, {});
            }, E = function(b) {
              return function(v) {
                var S;
                if (!a(v) || (S = y(v)).type !== b)
                  throw TypeError("Incompatible receiver, " + b + " required");
                return S;
              };
            };
            if (s) {
              var T = new p(), P = T.get, u = T.has, m = T.set;
              g = function(b, v) {
                return m.call(T, b, v), v;
              }, y = function(b) {
                return P.call(T, b) || {};
              }, w = function(b) {
                return u.call(T, b);
              };
            } else {
              var h = d("state");
              f[h] = !0, g = function(b, v) {
                return l(b, h, v), v;
              }, y = function(b) {
                return c(b, h) ? b[h] : {};
              }, w = function(b) {
                return c(b, h);
              };
            }
            n.exports = {
              set: g,
              get: y,
              has: w,
              enforce: x,
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), o = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), a = s("iterator"), l = Array.prototype;
            n.exports = function(c) {
              return c !== void 0 && (o.Array === c || l[a] === c);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), o = /#|\.prototype\./, a = function(p, g) {
              var y = c[l(p)];
              return y == f ? !0 : y == d ? !1 : typeof g == "function" ? s(g) : !!g;
            }, l = a.normalize = function(p) {
              return String(p).replace(o, ".").toLowerCase();
            }, c = a.data = {}, d = a.NATIVE = "N", f = a.POLYFILL = "P";
            n.exports = a;
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
            n.exports = function(i) {
              return typeof i == "object" ? i !== null : typeof i == "function";
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/object-get-prototype-of */
              "./node_modules/core-js/internals/object-get-prototype-of.js"
            ), o = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), a = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), l = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), c = i(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), d = l("iterator"), f = !1, p = function() {
              return this;
            }, g, y, w;
            [].keys && (w = [].keys(), "next" in w ? (y = s(s(w)), y !== Object.prototype && (g = y)) : f = !0), g == null && (g = {}), !c && !a(g, d) && o(g, d, p), n.exports = {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            );
            n.exports = !!Object.getOwnPropertySymbols && !s(function() {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/function-to-string */
              "./node_modules/core-js/internals/function-to-string.js"
            ), a = s.WeakMap;
            n.exports = typeof a == "function" && /native code/.test(o.call(a));
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-create.js": (
          /*!*********************************************************!*\
            !*** ./node_modules/core-js/internals/object-create.js ***!
            \*********************************************************/
          /*! no static exports found */
          /***/
          function(n, r, i) {
            var s = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), o = i(
              /*! ../internals/object-define-properties */
              "./node_modules/core-js/internals/object-define-properties.js"
            ), a = i(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            ), l = i(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), c = i(
              /*! ../internals/html */
              "./node_modules/core-js/internals/html.js"
            ), d = i(
              /*! ../internals/document-create-element */
              "./node_modules/core-js/internals/document-create-element.js"
            ), f = i(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), p = f("IE_PROTO"), g = "prototype", y = function() {
            }, w = function() {
              var x = d("iframe"), E = a.length, T = "<", P = "script", u = ">", m = "java" + P + ":", h;
              for (x.style.display = "none", c.appendChild(x), x.src = String(m), h = x.contentWindow.document, h.open(), h.write(T + P + u + "document.F=Object" + T + "/" + P + u), h.close(), w = h.F; E--; )
                delete w[g][a[E]];
              return w();
            };
            n.exports = Object.create || function(E, T) {
              var P;
              return E !== null ? (y[g] = s(E), P = new y(), y[g] = null, P[p] = E) : P = w(), T === void 0 ? P : o(P, T);
            }, l[p] = !0;
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-define-properties.js": (
          /*!********************************************************************!*\
            !*** ./node_modules/core-js/internals/object-define-properties.js ***!
            \********************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), a = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), l = i(
              /*! ../internals/object-keys */
              "./node_modules/core-js/internals/object-keys.js"
            );
            n.exports = s ? Object.defineProperties : function(d, f) {
              a(d);
              for (var p = l(f), g = p.length, y = 0, w; g > y; )
                o.f(d, w = p[y++], f[w]);
              return d;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/ie8-dom-define */
              "./node_modules/core-js/internals/ie8-dom-define.js"
            ), a = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), l = i(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), c = Object.defineProperty;
            r.f = s ? c : function(f, p, g) {
              if (a(f), p = l(p, !0), a(g), o)
                try {
                  return c(f, p, g);
                } catch {
                }
              if ("get" in g || "set" in g)
                throw TypeError("Accessors not supported");
              return "value" in g && (f[p] = g.value), f;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/object-property-is-enumerable */
              "./node_modules/core-js/internals/object-property-is-enumerable.js"
            ), a = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            ), l = i(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), c = i(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), d = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), f = i(
              /*! ../internals/ie8-dom-define */
              "./node_modules/core-js/internals/ie8-dom-define.js"
            ), p = Object.getOwnPropertyDescriptor;
            r.f = s ? p : function(y, w) {
              if (y = l(y), w = c(w, !0), f)
                try {
                  return p(y, w);
                } catch {
                }
              if (d(y, w))
                return a(!o.f.call(y, w), y[w]);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/object-keys-internal */
              "./node_modules/core-js/internals/object-keys-internal.js"
            ), o = i(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            ), a = o.concat("length", "prototype");
            r.f = Object.getOwnPropertyNames || function(c) {
              return s(c, a);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), o = i(
              /*! ../internals/to-object */
              "./node_modules/core-js/internals/to-object.js"
            ), a = i(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), l = i(
              /*! ../internals/correct-prototype-getter */
              "./node_modules/core-js/internals/correct-prototype-getter.js"
            ), c = a("IE_PROTO"), d = Object.prototype;
            n.exports = l ? Object.getPrototypeOf : function(f) {
              return f = o(f), s(f, c) ? f[c] : typeof f.constructor == "function" && f instanceof f.constructor ? f.constructor.prototype : f instanceof Object ? d : null;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), o = i(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), a = i(
              /*! ../internals/array-includes */
              "./node_modules/core-js/internals/array-includes.js"
            ), l = i(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), c = a(!1);
            n.exports = function(d, f) {
              var p = o(d), g = 0, y = [], w;
              for (w in p)
                !s(l, w) && s(p, w) && y.push(w);
              for (; f.length > g; )
                s(p, w = f[g++]) && (~c(y, w) || y.push(w));
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/object-keys-internal */
              "./node_modules/core-js/internals/object-keys-internal.js"
            ), o = i(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            );
            n.exports = Object.keys || function(l) {
              return s(l, o);
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
          function(n, r, i) {
            var s = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, a = o && !s.call({ 1: 2 }, 1);
            r.f = a ? function(c) {
              var d = o(this, c);
              return !!d && d.enumerable;
            } : s;
          }
        ),
        /***/
        "./node_modules/core-js/internals/object-set-prototype-of.js": (
          /*!*******************************************************************!*\
            !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
            \*******************************************************************/
          /*! no static exports found */
          /***/
          function(n, r, i) {
            var s = i(
              /*! ../internals/validate-set-prototype-of-arguments */
              "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js"
            );
            n.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
              var o = !1, a = {}, l;
              try {
                l = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, l.call(a, []), o = a instanceof Array;
              } catch {
              }
              return function(d, f) {
                return s(d, f), o ? l.call(d, f) : d.__proto__ = f, d;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/object-get-own-property-names */
              "./node_modules/core-js/internals/object-get-own-property-names.js"
            ), a = i(
              /*! ../internals/object-get-own-property-symbols */
              "./node_modules/core-js/internals/object-get-own-property-symbols.js"
            ), l = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), c = s.Reflect;
            n.exports = c && c.ownKeys || function(f) {
              var p = o.f(l(f)), g = a.f;
              return g ? p.concat(g(f)) : p;
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
          function(n, r, i) {
            n.exports = i(
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), a = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), l = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), c = i(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), d = i(
              /*! ../internals/function-to-string */
              "./node_modules/core-js/internals/function-to-string.js"
            ), f = i(
              /*! ../internals/internal-state */
              "./node_modules/core-js/internals/internal-state.js"
            ), p = f.get, g = f.enforce, y = String(d).split("toString");
            o("inspectSource", function(w) {
              return d.call(w);
            }), (n.exports = function(w, x, E, T) {
              var P = T ? !!T.unsafe : !1, u = T ? !!T.enumerable : !1, m = T ? !!T.noTargetGet : !1;
              if (typeof E == "function" && (typeof x == "string" && !l(E, "name") && a(E, "name", x), g(E).source = y.join(typeof x == "string" ? x : "")), w === s) {
                u ? w[x] = E : c(x, E);
                return;
              } else
                P ? !m && w[x] && (u = !0) : delete w[x];
              u ? w[x] = E : a(w, x, E);
            })(Function.prototype, "toString", function() {
              return typeof this == "function" && p(this).source || d.call(this);
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
            n.exports = function(i) {
              if (i == null)
                throw TypeError("Can't call method on " + i);
              return i;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            );
            n.exports = function(a, l) {
              try {
                o(s, a, l);
              } catch {
                s[a] = l;
              }
              return l;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ).f, o = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), a = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), l = a("toStringTag");
            n.exports = function(c, d, f) {
              c && !o(c = f ? c : c.prototype, l) && s(c, l, { configurable: !0, value: d });
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), o = i(
              /*! ../internals/uid */
              "./node_modules/core-js/internals/uid.js"
            ), a = s("keys");
            n.exports = function(l) {
              return a[l] || (a[l] = o(l));
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), a = i(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), l = "__core-js_shared__", c = s[l] || o(l, {});
            (n.exports = function(d, f) {
              return c[d] || (c[d] = f !== void 0 ? f : {});
            })("versions", []).push({
              version: "3.1.3",
              mode: a ? "pure" : "global",
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = i(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(a, l, c) {
              var d = String(o(a)), f = s(l), p = d.length, g, y;
              return f < 0 || f >= p ? c ? "" : void 0 : (g = d.charCodeAt(f), g < 55296 || g > 56319 || f + 1 === p || (y = d.charCodeAt(f + 1)) < 56320 || y > 57343 ? c ? d.charAt(f) : g : c ? d.slice(f, f + 2) : (g - 55296 << 10) + (y - 56320) + 65536);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = Math.max, a = Math.min;
            n.exports = function(l, c) {
              var d = s(l);
              return d < 0 ? o(d + c, 0) : a(d, c);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/indexed-object */
              "./node_modules/core-js/internals/indexed-object.js"
            ), o = i(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(a) {
              return s(o(a));
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
            var i = Math.ceil, s = Math.floor;
            n.exports = function(o) {
              return isNaN(o = +o) ? 0 : (o > 0 ? s : i)(o);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = Math.min;
            n.exports = function(a) {
              return a > 0 ? o(s(a), 9007199254740991) : 0;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(o) {
              return Object(s(o));
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            );
            n.exports = function(o, a) {
              if (!s(o))
                return o;
              var l, c;
              if (a && typeof (l = o.toString) == "function" && !s(c = l.call(o)) || typeof (l = o.valueOf) == "function" && !s(c = l.call(o)) || !a && typeof (l = o.toString) == "function" && !s(c = l.call(o)))
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
            var i = 0, s = Math.random();
            n.exports = function(o) {
              return "Symbol(".concat(o === void 0 ? "" : o, ")_", (++i + s).toString(36));
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), o = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            );
            n.exports = function(a, l) {
              if (o(a), !s(l) && l !== null)
                throw TypeError("Can't set " + String(l) + " as a prototype");
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), a = i(
              /*! ../internals/uid */
              "./node_modules/core-js/internals/uid.js"
            ), l = i(
              /*! ../internals/native-symbol */
              "./node_modules/core-js/internals/native-symbol.js"
            ), c = s.Symbol, d = o("wks");
            n.exports = function(f) {
              return d[f] || (d[f] = l && c[f] || (l ? c : a)("Symbol." + f));
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/export */
              "./node_modules/core-js/internals/export.js"
            ), o = i(
              /*! ../internals/array-from */
              "./node_modules/core-js/internals/array-from.js"
            ), a = i(
              /*! ../internals/check-correctness-of-iteration */
              "./node_modules/core-js/internals/check-correctness-of-iteration.js"
            ), l = !a(function(c) {
              Array.from(c);
            });
            s({ target: "Array", stat: !0, forced: l }, {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/string-at */
              "./node_modules/core-js/internals/string-at.js"
            ), o = i(
              /*! ../internals/internal-state */
              "./node_modules/core-js/internals/internal-state.js"
            ), a = i(
              /*! ../internals/define-iterator */
              "./node_modules/core-js/internals/define-iterator.js"
            ), l = "String Iterator", c = o.set, d = o.getterFor(l);
            a(String, "String", function(f) {
              c(this, {
                type: l,
                string: String(f),
                index: 0
              });
            }, function() {
              var p = d(this), g = p.string, y = p.index, w;
              return y >= g.length ? { value: void 0, done: !0 } : (w = s(g, y, !0), p.index += w.length, { value: w, done: !1 });
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
            var i;
            i = function() {
              return this;
            }();
            try {
              i = i || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (i = window);
            }
            n.exports = i;
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
          function(n, r, i) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var s = Object.assign || function(w) {
              for (var x = 1; x < arguments.length; x++) {
                var E = arguments[x];
                for (var T in E)
                  Object.prototype.hasOwnProperty.call(E, T) && (w[T] = E[T]);
              }
              return w;
            }, o = function() {
              function w(x, E) {
                for (var T = 0; T < E.length; T++) {
                  var P = E[T];
                  P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(x, P.key, P);
                }
              }
              return function(x, E, T) {
                return E && w(x.prototype, E), T && w(x, T), x;
              };
            }(), a = i(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), l = f(a), c = i(
              /*! ./default-attrs.json */
              "./src/default-attrs.json"
            ), d = f(c);
            function f(w) {
              return w && w.__esModule ? w : { default: w };
            }
            function p(w, x) {
              if (!(w instanceof x))
                throw new TypeError("Cannot call a class as a function");
            }
            var g = function() {
              function w(x, E) {
                var T = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
                p(this, w), this.name = x, this.contents = E, this.tags = T, this.attrs = s({}, d.default, { class: "feather feather-" + x });
              }
              return o(w, [{
                key: "toSvg",
                value: function() {
                  var E = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, T = s({}, this.attrs, E, { class: (0, l.default)(this.attrs.class, E.class) });
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
              }]), w;
            }();
            function y(w) {
              return Object.keys(w).map(function(x) {
                return x + '="' + w[x] + '"';
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
          function(n, r, i) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var s = i(
              /*! ./icon */
              "./src/icon.js"
            ), o = f(s), a = i(
              /*! ../dist/icons.json */
              "./dist/icons.json"
            ), l = f(a), c = i(
              /*! ./tags.json */
              "./src/tags.json"
            ), d = f(c);
            function f(p) {
              return p && p.__esModule ? p : { default: p };
            }
            r.default = Object.keys(l.default).map(function(p) {
              return new o.default(p, l.default[p], d.default[p]);
            }).reduce(function(p, g) {
              return p[g.name] = g, p;
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
          function(n, r, i) {
            var s = i(
              /*! ./icons */
              "./src/icons.js"
            ), o = f(s), a = i(
              /*! ./to-svg */
              "./src/to-svg.js"
            ), l = f(a), c = i(
              /*! ./replace */
              "./src/replace.js"
            ), d = f(c);
            function f(p) {
              return p && p.__esModule ? p : { default: p };
            }
            n.exports = { icons: o.default, toSvg: l.default, replace: d.default };
          }
        ),
        /***/
        "./src/replace.js": (
          /*!************************!*\
            !*** ./src/replace.js ***!
            \************************/
          /*! no static exports found */
          /***/
          function(n, r, i) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var s = Object.assign || function(y) {
              for (var w = 1; w < arguments.length; w++) {
                var x = arguments[w];
                for (var E in x)
                  Object.prototype.hasOwnProperty.call(x, E) && (y[E] = x[E]);
              }
              return y;
            }, o = i(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), a = d(o), l = i(
              /*! ./icons */
              "./src/icons.js"
            ), c = d(l);
            function d(y) {
              return y && y.__esModule ? y : { default: y };
            }
            function f() {
              var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
              if (typeof document > "u")
                throw new Error("`feather.replace()` only works in a browser environment.");
              var w = document.querySelectorAll("[data-feather]");
              Array.from(w).forEach(function(x) {
                return p(x, y);
              });
            }
            function p(y) {
              var w = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, x = g(y), E = x["data-feather"];
              delete x["data-feather"];
              var T = c.default[E].toSvg(s({}, w, x, { class: (0, a.default)(w.class, x.class) })), P = new DOMParser().parseFromString(T, "image/svg+xml"), u = P.querySelector("svg");
              y.parentNode.replaceChild(u, y);
            }
            function g(y) {
              return Array.from(y.attributes).reduce(function(w, x) {
                return w[x.name] = x.value, w;
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
          function(n, r, i) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var s = i(
              /*! ./icons */
              "./src/icons.js"
            ), o = a(s);
            function a(c) {
              return c && c.__esModule ? c : { default: c };
            }
            function l(c) {
              var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              if (console.warn("feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead."), !c)
                throw new Error("The required `key` (icon name) parameter is missing.");
              if (!o.default[c])
                throw new Error("No icon matching '" + c + "'. See the complete list of icons at https://feathericons.com");
              return o.default[c].toSvg(d);
            }
            r.default = l;
          }
        ),
        /***/
        0: (
          /*!**************************************************!*\
            !*** multi core-js/es/array/from ./src/index.js ***!
            \**************************************************/
          /*! no static exports found */
          /***/
          function(n, r, i) {
            i(
              /*! core-js/es/array/from */
              "./node_modules/core-js/es/array/from.js"
            ), n.exports = i(
              /*! /home/runner/work/feather/feather/src/index.js */
              "./src/index.js"
            );
          }
        )
        /******/
      })
    );
  });
})(cf);
var Z1 = cf.exports;
const eg = /* @__PURE__ */ ml(Z1);
Object.keys(eg.icons);
const tg = {}, uf = (t) => (tl("data-v-48d21730"), t = t(), nl(), t), ng = {
  class: "spinner",
  viewBox: "0 0 50 50"
}, rg = /* @__PURE__ */ uf(() => /* @__PURE__ */ me("defs", null, [
  /* @__PURE__ */ me("linearGradient", {
    id: "gradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, [
    /* @__PURE__ */ me("stop", {
      offset: "0%",
      "stop-color": "rgba(0,110,219,1)"
    }),
    /* @__PURE__ */ me("stop", {
      offset: "100%",
      "stop-color": "rgba(255,255,255,0)"
    })
  ])
], -1)), ig = /* @__PURE__ */ uf(() => /* @__PURE__ */ me("circle", {
  stroke: "url(#gradient)",
  class: "spinner-path",
  cx: "25",
  cy: "25",
  r: "20",
  fill: "none",
  "stroke-width": "5"
}, null, -1)), sg = [
  rg,
  ig
];
function og(t, e) {
  return pe(), ze("svg", ng, sg);
}
const ag = /* @__PURE__ */ mt(tg, [["render", og], ["__scopeId", "data-v-48d21730"]]);
function df(t, e, n) {
  for (let r = 0; ; r++) {
    if (r == t.childCount || r == e.childCount)
      return t.childCount == e.childCount ? null : n;
    let i = t.child(r), s = e.child(r);
    if (i == s) {
      n += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(s))
      return n;
    if (i.isText && i.text != s.text) {
      for (let o = 0; i.text[o] == s.text[o]; o++)
        n++;
      return n;
    }
    if (i.content.size || s.content.size) {
      let o = df(i.content, s.content, n + 1);
      if (o != null)
        return o;
    }
    n += i.nodeSize;
  }
}
function ff(t, e, n, r) {
  for (let i = t.childCount, s = e.childCount; ; ) {
    if (i == 0 || s == 0)
      return i == s ? null : { a: n, b: r };
    let o = t.child(--i), a = e.child(--s), l = o.nodeSize;
    if (o == a) {
      n -= l, r -= l;
      continue;
    }
    if (!o.sameMarkup(a))
      return { a: n, b: r };
    if (o.isText && o.text != a.text) {
      let c = 0, d = Math.min(o.text.length, a.text.length);
      for (; c < d && o.text[o.text.length - c - 1] == a.text[a.text.length - c - 1]; )
        c++, n--, r--;
      return { a: n, b: r };
    }
    if (o.content.size || a.content.size) {
      let c = ff(o.content, a.content, n - 1, r - 1);
      if (c)
        return c;
    }
    n -= l, r -= l;
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
  nodesBetween(e, n, r, i = 0, s) {
    for (let o = 0, a = 0; a < n; o++) {
      let l = this.content[o], c = a + l.nodeSize;
      if (c > e && r(l, i + a, s || null, o) !== !1 && l.content.size) {
        let d = a + 1;
        l.nodesBetween(Math.max(0, e - d), Math.min(l.content.size, n - d), r, i + d);
      }
      a = c;
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
  textBetween(e, n, r, i) {
    let s = "", o = !0;
    return this.nodesBetween(e, n, (a, l) => {
      a.isText ? (s += a.text.slice(Math.max(e, l) - l, n - l), o = !r) : a.isLeaf ? (i ? s += typeof i == "function" ? i(a) : i : a.type.spec.leafText && (s += a.type.spec.leafText(a)), o = !r) : !o && a.isBlock && (s += r, o = !0);
    }, 0), s;
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
    let n = this.lastChild, r = e.firstChild, i = this.content.slice(), s = 0;
    for (n.isText && n.sameMarkup(r) && (i[i.length - 1] = n.withText(n.text + r.text), s = 1); s < e.content.length; s++)
      i.push(e.content[s]);
    return new H(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, n = this.size) {
    if (e == 0 && n == this.size)
      return this;
    let r = [], i = 0;
    if (n > e)
      for (let s = 0, o = 0; o < n; s++) {
        let a = this.content[s], l = o + a.nodeSize;
        l > e && ((o < e || l > n) && (a.isText ? a = a.cut(Math.max(0, e - o), Math.min(a.text.length, n - o)) : a = a.cut(Math.max(0, e - o - 1), Math.min(a.content.size, n - o - 1))), r.push(a), i += a.nodeSize), o = l;
      }
    return new H(r, i);
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
    let i = this.content.slice(), s = this.size + n.nodeSize - r.nodeSize;
    return i[e] = n, new H(i, s);
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
      let i = this.content[n];
      e(i, r, n), r += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, n = 0) {
    return df(this, e, n);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, n = this.size, r = e.size) {
    return ff(this, e, n, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, n = -1) {
    if (e == 0)
      return ji(0, e);
    if (e == this.size)
      return ji(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, i = 0; ; r++) {
      let s = this.child(r), o = i + s.nodeSize;
      if (o >= e)
        return o == e || n > 0 ? ji(r + 1, o) : ji(r, i);
      i = o;
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
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (n || (n = e.slice(0, i)), n[n.length - 1] = s.withText(n[n.length - 1].text + s.text)) : n && n.push(s);
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
const vo = { index: 0, offset: 0 };
function ji(t, e) {
  return vo.index = t, vo.offset = e, vo;
}
function oa(t, e) {
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
      if (!oa(t[r], e[r]))
        return !1;
  } else {
    for (let r in t)
      if (!(r in e) || !oa(t[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in t))
        return !1;
  }
  return !0;
}
let pt = class aa {
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
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      if (this.eq(s))
        return e;
      if (this.type.excludes(s.type))
        n || (n = e.slice(0, i));
      else {
        if (s.type.excludes(this.type))
          return e;
        !r && s.type.rank > this.type.rank && (n || (n = e.slice(0, i)), n.push(this), r = !0), n && n.push(s);
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
    return this == e || this.type == e.type && oa(this.attrs, e.attrs);
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
      return aa.none;
    if (e instanceof aa)
      return [e];
    let n = e.slice();
    return n.sort((r, i) => r.type.rank - i.type.rank), n;
  }
};
pt.none = [];
class lg extends Error {
}
class G {
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
    let r = hf(this.content, e + this.openStart, n);
    return r && new G(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, n) {
    return new G(pf(this.content, e + this.openStart, n + this.openStart), this.openStart, this.openEnd);
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
      return G.empty;
    let r = n.openStart || 0, i = n.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new G(H.fromJSON(e, n.content), r, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, n = !0) {
    let r = 0, i = 0;
    for (let s = e.firstChild; s && !s.isLeaf && (n || !s.type.spec.isolating); s = s.firstChild)
      r++;
    for (let s = e.lastChild; s && !s.isLeaf && (n || !s.type.spec.isolating); s = s.lastChild)
      i++;
    return new G(e, r, i);
  }
}
G.empty = new G(H.empty, 0, 0);
function pf(t, e, n) {
  let { index: r, offset: i } = t.findIndex(e), s = t.maybeChild(r), { index: o, offset: a } = t.findIndex(n);
  if (i == e || s.isText) {
    if (a != n && !t.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return t.cut(0, e).append(t.cut(n));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return t.replaceChild(r, s.copy(pf(s.content, e - i - 1, n - i - 1)));
}
function hf(t, e, n, r) {
  let { index: i, offset: s } = t.findIndex(e), o = t.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, n) ? null : t.cut(0, e).append(n).append(t.cut(e));
  let a = hf(o.content, e - s - 1, n);
  return a && t.replaceChild(i, o.copy(a));
}
class la {
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
function cg(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t) {
    let r = t[n];
    if (!r.hasDefault)
      return null;
    e[n] = r.default;
  }
  return e;
}
function ug(t, e) {
  let n = /* @__PURE__ */ Object.create(null);
  for (let r in t) {
    let i = e && e[r];
    if (i === void 0) {
      let s = t[r];
      if (s.hasDefault)
        i = s.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    n[r] = i;
  }
  return n;
}
function dg(t) {
  let e = /* @__PURE__ */ Object.create(null);
  if (t)
    for (let n in t)
      e[n] = new fg(t[n]);
  return e;
}
class fg {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class gl {
  /**
  @internal
  */
  constructor(e, n, r, i) {
    this.name = e, this.rank = n, this.schema = r, this.spec = i, this.attrs = dg(i.attrs), this.excluded = null;
    let s = cg(this.attrs);
    this.instance = s ? new pt(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new pt(this, ug(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, n) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new gl(s, i++, n, o)), r;
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
let mf = class ca {
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
      let i = e.nodes[r.node];
      return i.contentMatch.matchType(i);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, n = {}) {
    let r = new Hc(this, n, !1);
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
    let r = new Hc(this, n, !0);
    return r.addAll(e, n.from, n.to), G.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, n, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (mg(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || n.matchesContext(s.context))) {
        if (s.getAttrs) {
          let o = s.getAttrs(e);
          if (o === !1)
            continue;
          s.attrs = o || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, n, r, i) {
    for (let s = i ? this.styles.indexOf(i) + 1 : 0; s < this.styles.length; s++) {
      let o = this.styles[s], a = o.style;
      if (!(a.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != n))) {
        if (o.getAttrs) {
          let l = o.getAttrs(n);
          if (l === !1)
            continue;
          o.attrs = l || void 0;
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
    function r(i) {
      let s = i.priority == null ? 50 : i.priority, o = 0;
      for (; o < n.length; o++) {
        let a = n[o];
        if ((a.priority == null ? 50 : a.priority) < s)
          break;
      }
      n.splice(o, 0, i);
    }
    for (let i in e.marks) {
      let s = e.marks[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = Fc(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = Fc(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new ca(e, ca.schemaRules(e)));
  }
};
const gf = {
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
}, pg = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, yf = { ol: !0, ul: !0 }, ps = 1, hs = 2, ei = 4;
function $c(t, e, n) {
  return e != null ? (e ? ps : 0) | (e === "full" ? hs : 0) : t && t.whitespace == "pre" ? ps | hs : n & ~ei;
}
class Pi {
  constructor(e, n, r, i, s, o, a) {
    this.type = e, this.attrs = n, this.marks = r, this.pendingMarks = i, this.solid = s, this.options = a, this.content = [], this.activeMarks = pt.none, this.stashMarks = [], this.match = o || (a & ei ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let n = this.type.contentMatch.fillBefore(H.from(e));
      if (n)
        this.match = this.type.contentMatch.matchFragment(n);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & ps)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
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
      let i = r[n];
      (this.type ? this.type.allowsMarkType(i.type) : yg(i.type, e)) && !i.isInSet(this.activeMarks) && (this.activeMarks = i.addToSet(this.activeMarks), this.pendingMarks = i.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !gf.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Hc {
  constructor(e, n, r) {
    this.parser = e, this.options = n, this.isOpen = r, this.open = 0;
    let i = n.topNode, s, o = $c(null, n.preserveWhitespace, 0) | (r ? ei : 0);
    i ? s = new Pi(i.type, i.attrs, pt.none, pt.none, !0, n.topMatch || i.type.contentMatch, o) : r ? s = new Pi(null, null, pt.none, pt.none, !0, null, o) : s = new Pi(e.schema.topNodeType, null, pt.none, pt.none, !0, null, o), this.nodes = [s], this.find = n.findPositions, this.needsBlock = !1;
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
    let i = this.readStyles(gg(r));
    if (!i)
      return;
    let [s, o] = i, a = this.top;
    for (let l = 0; l < o.length; l++)
      this.removePendingMark(o[l], a);
    for (let l = 0; l < s.length; l++)
      this.addPendingMark(s[l]);
    n();
    for (let l = 0; l < s.length; l++)
      this.removePendingMark(s[l], a);
    for (let l = 0; l < o.length; l++)
      this.addPendingMark(o[l]);
  }
  addTextNode(e) {
    let n = e.nodeValue, r = this.top;
    if (r.options & hs || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (r.options & ps)
        r.options & hs ? n = n.replace(/\r\n?/g, `
`) : n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let i = r.content[r.content.length - 1], s = e.previousSibling;
        (!i || s && s.nodeName == "BR" || i.isText && /[ \t\r\n\u000c]$/.test(i.text)) && (n = n.slice(1));
      }
      n && this.insertNode(this.parser.schema.text(n)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, n) {
    let r = e.nodeName.toLowerCase(), i;
    yf.hasOwnProperty(r) && this.parser.normalizeLists && hg(e);
    let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (i = this.parser.matchTag(e, this, n));
    if (s ? s.ignore : pg.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!s || s.skip || s.closeParent) {
      s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
      let o, a = this.top, l = this.needsBlock;
      if (gf.hasOwnProperty(r))
        a.content.length && a.content[0].isInline && this.open && (this.open--, a = this.top), o = !0, a.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      s && s.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), o && this.sync(a), this.needsBlock = l;
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, s, s.consuming === !1 ? i : void 0);
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
    let n = pt.none, r = pt.none;
    for (let i = 0; i < e.length; i += 2)
      for (let s = void 0; ; ) {
        let o = this.parser.matchStyle(e[i], e[i + 1], this, s);
        if (!o)
          break;
        if (o.ignore)
          return null;
        if (o.clearMark ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((a) => {
          o.clearMark(a) && (r = a.addToSet(r));
        }) : n = this.parser.schema.marks[o.mark].create(o.attrs).addToSet(n), o.consuming === !1)
          s = o;
        else
          break;
      }
    return [n, r];
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, n, r) {
    let i, s, o;
    n.node ? (s = this.parser.schema.nodes[n.node], s.isLeaf ? this.insertNode(s.create(n.attrs)) || this.leafFallback(e) : i = this.enter(s, n.attrs || null, n.preserveWhitespace)) : (o = this.parser.schema.marks[n.mark].create(n.attrs), this.addPendingMark(o));
    let a = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (n.getContent)
      this.findInside(e), n.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l));
    else {
      let l = e;
      typeof n.contentElement == "string" ? l = e.querySelector(n.contentElement) : typeof n.contentElement == "function" ? l = n.contentElement(e) : n.contentElement && (l = n.contentElement), this.findAround(e, l, !0), this.addAll(l);
    }
    i && this.sync(a) && this.open--, o && this.removePendingMark(o, a);
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, n, r) {
    let i = n || 0;
    for (let s = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; s != o; s = s.nextSibling, ++i)
      this.findAtPoint(e, i), this.addDOM(s);
    this.findAtPoint(e, i);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e) {
    let n, r;
    for (let i = this.open; i >= 0; i--) {
      let s = this.nodes[i], o = s.findWrapping(e);
      if (o && (!n || n.length > o.length) && (n = o, r = s, !o.length) || s.solid)
        break;
    }
    if (!n)
      return !1;
    this.sync(r);
    for (let i = 0; i < n.length; i++)
      this.enterInner(n[i], null, !1);
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
      for (let i = 0; i < e.marks.length; i++)
        (!n.type || n.type.allowsMarkType(e.marks[i].type)) && (r = e.marks[i].addToSet(r));
      return n.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, n, r) {
    let i = this.findPlace(e.create(n));
    return i && this.enterInner(e, n, !0, r), i;
  }
  // Open a node of the given type
  enterInner(e, n = null, r = !1, i) {
    this.closeExtra();
    let s = this.top;
    s.applyPending(e), s.match = s.match && s.match.matchType(e);
    let o = $c(e, i, s.options);
    s.options & ei && s.content.length == 0 && (o |= ei), this.nodes.push(new Pi(e, n, s.activeMarks, s.pendingMarks, r, null, o)), this.open++;
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
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
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
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && n.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
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
    let n = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), o = (a, l) => {
      for (; a >= 0; a--) {
        let c = n[a];
        if (c == "") {
          if (a == n.length - 1 || a == 0)
            continue;
          for (; l >= s; l--)
            if (o(a - 1, l))
              return !0;
          return !1;
        } else {
          let d = l > 0 || l == 0 && i ? this.nodes[l].type : r && l >= s ? r.node(l - s).type : null;
          if (!d || d.name != c && d.groups.indexOf(c) == -1)
            return !1;
          l--;
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
    let n = bg(e, this.top.pendingMarks);
    n && this.top.stashMarks.push(n), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, n) {
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r];
      if (i.pendingMarks.lastIndexOf(e) > -1)
        i.pendingMarks = e.removeFromSet(i.pendingMarks);
      else {
        i.activeMarks = e.removeFromSet(i.activeMarks);
        let o = i.popFromStashMark(e);
        o && i.type && i.type.allowsMarkType(o.type) && (i.activeMarks = o.addToSet(i.activeMarks));
      }
      if (i == n)
        break;
    }
  }
}
function hg(t) {
  for (let e = t.firstChild, n = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && yf.hasOwnProperty(r) && n ? (n.appendChild(e), e = n) : r == "li" ? n = e : r && (n = null);
  }
}
function mg(t, e) {
  return (t.matches || t.msMatchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector).call(t, e);
}
function gg(t) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, n, r = [];
  for (; n = e.exec(t); )
    r.push(n[1], n[2].trim());
  return r;
}
function Fc(t) {
  let e = {};
  for (let n in t)
    e[n] = t[n];
  return e;
}
function yg(t, e) {
  let n = e.schema.nodes;
  for (let r in n) {
    let i = n[r];
    if (!i.allowsMarkType(t))
      continue;
    let s = [], o = (a) => {
      s.push(a);
      for (let l = 0; l < a.edgeCount; l++) {
        let { type: c, next: d } = a.edge(l);
        if (c == e || s.indexOf(d) < 0 && o(d))
          return !0;
      }
    };
    if (o(i.contentMatch))
      return !0;
  }
}
function bg(t, e) {
  for (let n = 0; n < e.length; n++)
    if (t.eq(e[n]))
      return e[n];
}
class Kn {
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
    r || (r = wo(n).createDocumentFragment());
    let i = r, s = [];
    return e.forEach((o) => {
      if (s.length || o.marks.length) {
        let a = 0, l = 0;
        for (; a < s.length && l < o.marks.length; ) {
          let c = o.marks[l];
          if (!this.marks[c.type.name]) {
            l++;
            continue;
          }
          if (!c.eq(s[a][0]) || c.type.spec.spanning === !1)
            break;
          a++, l++;
        }
        for (; a < s.length; )
          i = s.pop()[1];
        for (; l < o.marks.length; ) {
          let c = o.marks[l++], d = this.serializeMark(c, o.isInline, n);
          d && (s.push([c, i]), i.appendChild(d.dom), i = d.contentDOM || d.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(o, n));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, n) {
    let { dom: r, contentDOM: i } = Kn.renderSpec(wo(n), this.nodes[e.type.name](e));
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, n, i);
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
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let s = this.serializeMark(e.marks[i], e.isInline, n);
      s && ((s.contentDOM || s.dom).appendChild(r), r = s.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, n, r = {}) {
    let i = this.marks[e.type.name];
    return i && Kn.renderSpec(wo(r), i(e, n));
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
    let i = n[0], s = i.indexOf(" ");
    s > 0 && (r = i.slice(0, s), i = i.slice(s + 1));
    let o, a = r ? e.createElementNS(r, i) : e.createElement(i), l = n[1], c = 1;
    if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
      c = 2;
      for (let d in l)
        if (l[d] != null) {
          let f = d.indexOf(" ");
          f > 0 ? a.setAttributeNS(d.slice(0, f), d.slice(f + 1), l[d]) : a.setAttribute(d, l[d]);
        }
    }
    for (let d = c; d < n.length; d++) {
      let f = n[d];
      if (f === 0) {
        if (d < n.length - 1 || d > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: a, contentDOM: a };
      } else {
        let { dom: p, contentDOM: g } = Kn.renderSpec(e, f, r);
        if (a.appendChild(p), g) {
          if (o)
            throw new RangeError("Multiple content holes");
          o = g;
        }
      }
    }
    return { dom: a, contentDOM: o };
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Kn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let n = Wc(e.nodes);
    return n.text || (n.text = (r) => r.text), n;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Wc(e.marks);
  }
}
function Wc(t) {
  let e = {};
  for (let n in t) {
    let r = t[n].spec.toDOM;
    r && (e[n] = r);
  }
  return e;
}
function wo(t) {
  return t.document || window.document;
}
const bf = 65535, vf = Math.pow(2, 16);
function vg(t, e) {
  return t + e * vf;
}
function Vc(t) {
  return t & bf;
}
function wg(t) {
  return (t - (t & bf)) / vf;
}
const wf = 1, _f = 2, Ji = 4, kf = 8;
class ua {
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
    return (this.delInfo & kf) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (wf | Ji)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (_f | Ji)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Ji) > 0;
  }
}
class wt {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, n = !1) {
    if (this.ranges = e, this.inverted = n, !e.length && wt.empty)
      return wt.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let n = 0, r = Vc(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        n += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + n + wg(e);
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
    let i = 0, s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? i : 0);
      if (l > e)
        break;
      let c = this.ranges[a + s], d = this.ranges[a + o], f = l + c;
      if (e <= f) {
        let p = c ? e == l ? -1 : e == f ? 1 : n : n, g = l + i + (p < 0 ? 0 : d);
        if (r)
          return g;
        let y = e == (n < 0 ? l : f) ? null : vg(a / 3, e - l), w = e == l ? _f : e == f ? wf : Ji;
        return (n < 0 ? e != l : e != f) && (w |= kf), new ua(g, w, y);
      }
      i += d - c;
    }
    return r ? e + i : new ua(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, n) {
    let r = 0, i = Vc(n), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? r : 0);
      if (l > e)
        break;
      let c = this.ranges[a + s], d = l + c;
      if (e <= d && a == i * 3)
        return !0;
      r += this.ranges[a + o] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let n = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, s = 0; i < this.ranges.length; i += 3) {
      let o = this.ranges[i], a = o - (this.inverted ? s : 0), l = o + (this.inverted ? 0 : s), c = this.ranges[i + n], d = this.ranges[i + r];
      e(a, a + c, l, l + d), s += d - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new wt(this.ranges, !this.inverted);
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
    return e == 0 ? wt.empty : new wt(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
wt.empty = new wt([]);
class Sr {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e = [], n, r = 0, i = e.length) {
    this.maps = e, this.mirror = n, this.from = r, this.to = i;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, n = this.maps.length) {
    return new Sr(this.maps, this.mirror, e, n);
  }
  /**
  @internal
  */
  copy() {
    return new Sr(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
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
      let i = e.getMirror(n);
      this.appendMap(e.maps[n], i != null && i < n ? r + i : void 0);
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
      let i = e.getMirror(n);
      this.appendMap(e.maps[n].invert(), i != null && i > n ? r - i - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new Sr();
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
    let i = 0;
    for (let s = this.from; s < this.to; s++) {
      let o = this.maps[s], a = o.mapResult(e, n);
      if (a.recover != null) {
        let l = this.getMirror(s);
        if (l != null && l > s && l < this.to) {
          s = l, e = this.maps[l].recover(a.recover);
          continue;
        }
      }
      i |= a.delInfo, e = a.pos;
    }
    return r ? e : new ua(e, i, null);
  }
}
const _o = /* @__PURE__ */ Object.create(null);
class ut {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return wt.empty;
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
    let r = _o[n.stepType];
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
    if (e in _o)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return _o[e] = n, n.prototype.jsonID = e, n;
  }
}
class Be {
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
    return new Be(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new Be(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, n, r, i) {
    try {
      return Be.ok(e.replace(n, r, i));
    } catch (s) {
      if (s instanceof lg)
        return Be.fail(s.message);
      throw s;
    }
  }
}
function yl(t, e, n) {
  let r = [];
  for (let i = 0; i < t.childCount; i++) {
    let s = t.child(i);
    s.content.size && (s = s.copy(yl(s.content, e, s))), s.isInline && (s = e(s, n, i)), r.push(s);
  }
  return H.fromArray(r);
}
class yn extends ut {
  /**
  Create a mark step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new G(yl(n.content, (o, a) => !o.isAtom || !a.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), n.openStart, n.openEnd);
    return Be.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new Ut(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new yn(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof yn && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new yn(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new yn(n.from, n.to, e.markFromJSON(n.mark));
  }
}
ut.jsonID("addMark", yn);
class Ut extends ut {
  /**
  Create a mark-removing step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = new G(yl(n.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), n.openStart, n.openEnd);
    return Be.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new yn(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new Ut(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ut && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ut(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Ut(n.from, n.to, e.markFromJSON(n.mark));
  }
}
ut.jsonID("removeMark", Ut);
class bn extends ut {
  /**
  Create a node mark step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Be.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.addToSet(n.marks));
    return Be.fromReplace(e, this.pos, this.pos + 1, new G(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    if (n) {
      let r = this.mark.addToSet(n.marks);
      if (r.length == n.marks.length) {
        for (let i = 0; i < n.marks.length; i++)
          if (!n.marks[i].isInSet(r))
            return new bn(this.pos, n.marks[i]);
        return new bn(this.pos, this.mark);
      }
    }
    return new Or(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new bn(n.pos, this.mark);
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
    return new bn(n.pos, e.markFromJSON(n.mark));
  }
}
ut.jsonID("addNodeMark", bn);
class Or extends ut {
  /**
  Create a mark-removing step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Be.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.removeFromSet(n.marks));
    return Be.fromReplace(e, this.pos, this.pos + 1, new G(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    return !n || !this.mark.isInSet(n.marks) ? this : new bn(this.pos, this.mark);
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
ut.jsonID("removeNodeMark", Or);
class Ue extends ut {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, n, r, i = !1) {
    super(), this.from = e, this.to = n, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && da(e, this.from, this.to) ? Be.fail("Structure replace would overwrite content") : Be.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new wt([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Ue(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deletedAcross && r.deletedAcross ? null : new Ue(n.pos, Math.max(n.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Ue) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let n = this.slice.size + e.slice.size == 0 ? G.empty : new G(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new Ue(this.from, this.to + (e.to - e.from), n, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let n = this.slice.size + e.slice.size == 0 ? G.empty : new G(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new Ue(e.from, this.to, n, this.structure);
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
    return new Ue(n.from, n.to, G.fromJSON(e, n.slice), !!n.structure);
  }
}
ut.jsonID("replace", Ue);
class Fe extends ut {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, n, r, i, s, o, a = !1) {
    super(), this.from = e, this.to = n, this.gapFrom = r, this.gapTo = i, this.slice = s, this.insert = o, this.structure = a;
  }
  apply(e) {
    if (this.structure && (da(e, this.from, this.gapFrom) || da(e, this.gapTo, this.to)))
      return Be.fail("Structure gap-replace would overwrite content");
    let n = e.slice(this.gapFrom, this.gapTo);
    if (n.openStart || n.openEnd)
      return Be.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, n.content);
    return r ? Be.fromReplace(e, this.from, this.to, r) : Be.fail("Content does not fit in gap");
  }
  getMap() {
    return new wt([
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
    return new Fe(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = e.map(this.gapFrom, -1), s = e.map(this.gapTo, 1);
    return n.deletedAcross && r.deletedAcross || i < n.pos || s > r.pos ? null : new Fe(n.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new Fe(n.from, n.to, n.gapFrom, n.gapTo, G.fromJSON(e, n.slice), n.insert, !!n.structure);
  }
}
ut.jsonID("replaceAround", Fe);
function da(t, e, n) {
  let r = t.resolve(e), i = n - e, s = r.depth;
  for (; i > 0 && s > 0 && r.indexAfter(s) == r.node(s).childCount; )
    s--, i--;
  if (i > 0) {
    let o = r.node(s).maybeChild(r.indexAfter(s));
    for (; i > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, i--;
    }
  }
  return !1;
}
function _g(t, e, n, r) {
  let i = [], s = [], o, a;
  t.doc.nodesBetween(e, n, (l, c, d) => {
    if (!l.isInline)
      return;
    let f = l.marks;
    if (!r.isInSet(f) && d.type.allowsMarkType(r.type)) {
      let p = Math.max(c, e), g = Math.min(c + l.nodeSize, n), y = r.addToSet(f);
      for (let w = 0; w < f.length; w++)
        f[w].isInSet(y) || (o && o.to == p && o.mark.eq(f[w]) ? o.to = g : i.push(o = new Ut(p, g, f[w])));
      a && a.to == p ? a.to = g : s.push(a = new yn(p, g, r));
    }
  }), i.forEach((l) => t.step(l)), s.forEach((l) => t.step(l));
}
function kg(t, e, n, r) {
  let i = [], s = 0;
  t.doc.nodesBetween(e, n, (o, a) => {
    if (!o.isInline)
      return;
    s++;
    let l = null;
    if (r instanceof gl) {
      let c = o.marks, d;
      for (; d = r.isInSet(c); )
        (l || (l = [])).push(d), c = d.removeFromSet(c);
    } else
      r ? r.isInSet(o.marks) && (l = [r]) : l = o.marks;
    if (l && l.length) {
      let c = Math.min(a + o.nodeSize, n);
      for (let d = 0; d < l.length; d++) {
        let f = l[d], p;
        for (let g = 0; g < i.length; g++) {
          let y = i[g];
          y.step == s - 1 && f.eq(i[g].style) && (p = y);
        }
        p ? (p.to = c, p.step = s) : i.push({ style: f, from: Math.max(a, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => t.step(new Ut(o.from, o.to, o.style)));
}
function xg(t, e, n, r = n.contentMatch) {
  let i = t.doc.nodeAt(e), s = [], o = e + 1;
  for (let a = 0; a < i.childCount; a++) {
    let l = i.child(a), c = o + l.nodeSize, d = r.matchType(l.type);
    if (!d)
      s.push(new Ue(o, c, G.empty));
    else {
      r = d;
      for (let f = 0; f < l.marks.length; f++)
        n.allowsMarkType(l.marks[f].type) || t.step(new Ut(o, c, l.marks[f]));
      if (l.isText && !n.spec.code) {
        let f, p = /\r?\n|\r/g, g;
        for (; f = p.exec(l.text); )
          g || (g = new G(H.from(n.schema.text(" ", n.allowedMarks(l.marks))), 0, 0)), s.push(new Ue(o + f.index, o + f.index + f[0].length, g));
      }
    }
    o = c;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(H.empty, !0);
    t.replace(o, o, new G(a, 0, 0));
  }
  for (let a = s.length - 1; a >= 0; a--)
    t.step(s[a]);
}
function Sg(t, e, n) {
  return (e == 0 || t.canReplace(e, t.childCount)) && (n == t.childCount || t.canReplace(0, n));
}
function Dr(t) {
  let n = t.parent.content.cutByIndex(t.startIndex, t.endIndex);
  for (let r = t.depth; ; --r) {
    let i = t.$from.node(r), s = t.$from.index(r), o = t.$to.indexAfter(r);
    if (r < t.depth && i.canReplace(s, o, n))
      return r;
    if (r == 0 || i.type.spec.isolating || !Sg(i, s, o))
      break;
  }
  return null;
}
function Cg(t, e, n) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), a = i.after(s + 1), l = o, c = a, d = H.empty, f = 0;
  for (let y = s, w = !1; y > n; y--)
    w || r.index(y) > 0 ? (w = !0, d = H.from(r.node(y).copy(d)), f++) : l--;
  let p = H.empty, g = 0;
  for (let y = s, w = !1; y > n; y--)
    w || i.after(y + 1) < i.end(y) ? (w = !0, p = H.from(i.node(y).copy(p)), g++) : c++;
  t.step(new Fe(l, c, o, a, new G(d.append(p), f, g), d.size - f, !0));
}
function bl(t, e, n = null, r = t) {
  let i = Eg(t, e), s = i && Mg(r, e);
  return s ? i.map(Uc).concat({ type: e, attrs: n }).concat(s.map(Uc)) : null;
}
function Uc(t) {
  return { type: t, attrs: null };
}
function Eg(t, e) {
  let { parent: n, startIndex: r, endIndex: i } = t, s = n.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return n.canReplaceWith(r, i, o) ? s : null;
}
function Mg(t, e) {
  let { parent: n, startIndex: r, endIndex: i } = t, s = n.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(n.child(c).type);
  return !l || !l.validEnd ? null : o;
}
function Ag(t, e, n) {
  let r = H.empty;
  for (let o = n.length - 1; o >= 0; o--) {
    if (r.size) {
      let a = n[o].type.contentMatch.matchFragment(r);
      if (!a || !a.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = H.from(n[o].type.create(n[o].attrs, r));
  }
  let i = e.start, s = e.end;
  t.step(new Fe(i, s, i, s, new G(r, 0, 0), n.length, !0));
}
function Tg(t, e, n, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = t.steps.length;
  t.doc.nodesBetween(e, n, (o, a) => {
    if (o.isTextblock && !o.hasMarkup(r, i) && Og(t.doc, t.mapping.slice(s).map(a), r)) {
      t.clearIncompatible(t.mapping.slice(s).map(a, 1), r);
      let l = t.mapping.slice(s), c = l.map(a, 1), d = l.map(a + o.nodeSize, 1);
      return t.step(new Fe(c, d, c + 1, d - 1, new G(H.from(r.create(i, null, o.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function Og(t, e, n) {
  let r = t.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, n);
}
function jg(t, e, n, r, i) {
  let s = t.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  n || (n = s.type);
  let o = n.create(r, null, i || s.marks);
  if (s.isLeaf)
    return t.replaceWith(e, e + s.nodeSize, o);
  if (!n.validContent(s.content))
    throw new RangeError("Invalid content for node type " + n.name);
  t.step(new Fe(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new G(H.from(o), 0, 0), 1, !0));
}
function Cr(t, e, n = 1, r) {
  let i = t.resolve(e), s = i.depth - n, o = r && r[r.length - 1] || i.parent;
  if (s < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, d = n - 2; c > s; c--, d--) {
    let f = i.node(c), p = i.index(c);
    if (f.type.spec.isolating)
      return !1;
    let g = f.content.cutByIndex(p, f.childCount), y = r && r[d + 1];
    y && (g = g.replaceChild(0, y.type.create(y.attrs)));
    let w = r && r[d] || f;
    if (!f.canReplace(p + 1, f.childCount) || !w.type.validContent(g))
      return !1;
  }
  let a = i.indexAfter(s), l = r && r[0];
  return i.node(s).canReplaceWith(a, a, l ? l.type : i.node(s + 1).type);
}
function Pg(t, e, n = 1, r) {
  let i = t.doc.resolve(e), s = H.empty, o = H.empty;
  for (let a = i.depth, l = i.depth - n, c = n - 1; a > l; a--, c--) {
    s = H.from(i.node(a).copy(s));
    let d = r && r[c];
    o = H.from(d ? d.type.create(d.attrs, o) : i.node(a).copy(o));
  }
  t.step(new Ue(e, e, new G(s.append(o), n, n), !0));
}
function Tn(t, e) {
  let n = t.resolve(e), r = n.index();
  return xf(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function xf(t, e) {
  return !!(t && e && !t.isLeaf && t.canAppend(e));
}
function to(t, e, n = -1) {
  let r = t.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, a = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : n > 0 ? (s = r.node(i + 1), a++, o = r.node(i).maybeChild(a)) : (s = r.node(i).maybeChild(a - 1), o = r.node(i + 1)), s && !s.isTextblock && xf(s, o) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = n < 0 ? r.before(i) : r.after(i);
  }
}
function Ng(t, e, n) {
  let r = new Ue(e - n, e + n, G.empty, !0);
  t.step(r);
}
function Rg(t, e, n) {
  let r = t.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), n))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.index(i);
      if (r.node(i).canReplaceWith(s, s, n))
        return r.before(i + 1);
      if (s > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.indexAfter(i);
      if (r.node(i).canReplaceWith(s, s, n))
        return r.after(i + 1);
      if (s < r.node(i).childCount)
        return null;
    }
  return null;
}
function Sf(t, e, n) {
  let r = t.resolve(e);
  if (!n.content.size)
    return e;
  let i = n.content;
  for (let s = 0; s < n.openStart; s++)
    i = i.firstChild.content;
  for (let s = 1; s <= (n.openStart == 0 && n.size ? 2 : 1); s++)
    for (let o = r.depth; o >= 0; o--) {
      let a = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, l = r.index(o) + (a > 0 ? 1 : 0), c = r.node(o), d = !1;
      if (s == 1)
        d = c.canReplace(l, l, i);
      else {
        let f = c.contentMatchAt(l).findWrapping(i.firstChild.type);
        d = f && c.canReplaceWith(l, l, f[0]);
      }
      if (d)
        return a == 0 ? r.pos : a < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function vl(t, e, n = e, r = G.empty) {
  if (e == n && !r.size)
    return null;
  let i = t.resolve(e), s = t.resolve(n);
  return Cf(i, s, r) ? new Ue(e, n, r) : new Ig(i, s, r).fit();
}
function Cf(t, e, n) {
  return !n.openStart && !n.openEnd && t.start() == e.start() && t.parent.canReplace(t.index(), e.index(), n.content);
}
class Ig {
  constructor(e, n, r) {
    this.$from = e, this.$to = n, this.unplaced = r, this.frontier = [], this.placed = H.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = H.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), n = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let s = this.placed, o = r.depth, a = i.depth;
    for (; o && a && s.childCount == 1; )
      s = s.firstChild.content, o--, a--;
    let l = new G(s, o, a);
    return e > -1 ? new Fe(r.pos, e, this.$to.pos, this.$to.end(), l, n) : l.size || r.pos != this.$to.pos ? new Ue(r.pos, i.pos, l) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let n = this.unplaced.content, r = 0, i = this.unplaced.openEnd; r < e; r++) {
      let s = n.firstChild;
      if (n.childCount > 1 && (i = 0), s.type.spec.isolating && i <= r) {
        e = r;
        break;
      }
      n = s.content;
    }
    for (let n = 1; n <= 2; n++)
      for (let r = n == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i, s = null;
        r ? (s = ko(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let a = this.depth; a >= 0; a--) {
          let { type: l, match: c } = this.frontier[a], d, f = null;
          if (n == 1 && (o ? c.matchType(o.type) || (f = c.fillBefore(H.from(o), !1)) : s && l.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, inject: f };
          if (n == 2 && o && (d = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, wrap: d };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, i = ko(e, n);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new G(e, n + 1, Math.max(r, i.size + n >= e.size - r ? n + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, i = ko(e, n);
    if (i.childCount <= 1 && n > 0) {
      let s = e.size - n <= n + i.size;
      this.unplaced = new G(Gr(e, n - 1, 1), n - 1, s ? n - 1 : r);
    } else
      this.unplaced = new G(Gr(e, n, 1), n, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: n, parent: r, inject: i, wrap: s }) {
    for (; this.depth > n; )
      this.closeFrontierNode();
    if (s)
      for (let w = 0; w < s.length; w++)
        this.openFrontierNode(s[w]);
    let o = this.unplaced, a = r ? r.content : o.content, l = o.openStart - e, c = 0, d = [], { match: f, type: p } = this.frontier[n];
    if (i) {
      for (let w = 0; w < i.childCount; w++)
        d.push(i.child(w));
      f = f.matchFragment(i);
    }
    let g = a.size + e - (o.content.size - o.openEnd);
    for (; c < a.childCount; ) {
      let w = a.child(c), x = f.matchType(w.type);
      if (!x)
        break;
      c++, (c > 1 || l == 0 || w.content.size) && (f = x, d.push(Ef(w.mark(p.allowedMarks(w.marks)), c == 1 ? l : 0, c == a.childCount ? g : -1)));
    }
    let y = c == a.childCount;
    y || (g = -1), this.placed = Jr(this.placed, n, H.from(d)), this.frontier[n].match = f, y && g < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let w = 0, x = a; w < g; w++) {
      let E = x.lastChild;
      this.frontier.push({ type: E.type, match: E.contentMatchAt(E.childCount) }), x = E.content;
    }
    this.unplaced = y ? e == 0 ? G.empty : new G(Gr(o.content, e - 1, 1), e - 1, g < 0 ? o.openEnd : e - 1) : new G(Gr(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], n;
    if (!e.type.isTextblock || !xo(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (n = this.findCloseLevel(this.$to)) && n.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e:
      for (let n = Math.min(this.depth, e.depth); n >= 0; n--) {
        let { match: r, type: i } = this.frontier[n], s = n < e.depth && e.end(n + 1) == e.pos + (e.depth - (n + 1)), o = xo(e, n, i, r, s);
        if (o) {
          for (let a = n - 1; a >= 0; a--) {
            let { match: l, type: c } = this.frontier[a], d = xo(e, a, c, l, !0);
            if (!d || d.childCount)
              continue e;
          }
          return { depth: n, fit: o, move: s ? e.doc.resolve(e.after(n + 1)) : e };
        }
      }
  }
  close(e) {
    let n = this.findCloseLevel(e);
    if (!n)
      return null;
    for (; this.depth > n.depth; )
      this.closeFrontierNode();
    n.fit.childCount && (this.placed = Jr(this.placed, n.depth, n.fit)), e = n.move;
    for (let r = n.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, n = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Jr(this.placed, this.depth, H.from(e.create(n, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let n = this.frontier.pop().match.fillBefore(H.empty, !0);
    n.childCount && (this.placed = Jr(this.placed, this.frontier.length, n));
  }
}
function Gr(t, e, n) {
  return e == 0 ? t.cutByIndex(n, t.childCount) : t.replaceChild(0, t.firstChild.copy(Gr(t.firstChild.content, e - 1, n)));
}
function Jr(t, e, n) {
  return e == 0 ? t.append(n) : t.replaceChild(t.childCount - 1, t.lastChild.copy(Jr(t.lastChild.content, e - 1, n)));
}
function ko(t, e) {
  for (let n = 0; n < e; n++)
    t = t.firstChild.content;
  return t;
}
function Ef(t, e, n) {
  if (e <= 0)
    return t;
  let r = t.content;
  return e > 1 && (r = r.replaceChild(0, Ef(r.firstChild, e - 1, r.childCount == 1 ? n - 1 : 0))), e > 0 && (r = t.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(t.type.contentMatch.matchFragment(r).fillBefore(H.empty, !0)))), t.copy(r);
}
function xo(t, e, n, r, i) {
  let s = t.node(e), o = i ? t.indexAfter(e) : t.index(e);
  if (o == s.childCount && !n.compatibleContent(s.type))
    return null;
  let a = r.fillBefore(s.content, !0, o);
  return a && !Lg(n, s.content, o) ? a : null;
}
function Lg(t, e, n) {
  for (let r = n; r < e.childCount; r++)
    if (!t.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function zg(t) {
  return t.spec.defining || t.spec.definingForContent;
}
function Dg(t, e, n, r) {
  if (!r.size)
    return t.deleteRange(e, n);
  let i = t.doc.resolve(e), s = t.doc.resolve(n);
  if (Cf(i, s, r))
    return t.step(new Ue(e, n, r));
  let o = Af(i, t.doc.resolve(n));
  o[o.length - 1] == 0 && o.pop();
  let a = -(i.depth + 1);
  o.unshift(a);
  for (let p = i.depth, g = i.pos - 1; p > 0; p--, g--) {
    let y = i.node(p).type.spec;
    if (y.defining || y.definingAsContext || y.isolating)
      break;
    o.indexOf(p) > -1 ? a = p : i.before(p) == g && o.splice(1, 0, -p);
  }
  let l = o.indexOf(a), c = [], d = r.openStart;
  for (let p = r.content, g = 0; ; g++) {
    let y = p.firstChild;
    if (c.push(y), g == r.openStart)
      break;
    p = y.content;
  }
  for (let p = d - 1; p >= 0; p--) {
    let g = c[p], y = zg(g.type);
    if (y && !g.sameMarkup(i.node(Math.abs(a) - 1)))
      d = p;
    else if (y || !g.type.isTextblock)
      break;
  }
  for (let p = r.openStart; p >= 0; p--) {
    let g = (p + d + 1) % (r.openStart + 1), y = c[g];
    if (y)
      for (let w = 0; w < o.length; w++) {
        let x = o[(w + l) % o.length], E = !0;
        x < 0 && (E = !1, x = -x);
        let T = i.node(x - 1), P = i.index(x - 1);
        if (T.canReplaceWith(P, P, y.type, y.marks))
          return t.replace(i.before(x), E ? s.after(x) : n, new G(Mf(r.content, 0, r.openStart, g), g, r.openEnd));
      }
  }
  let f = t.steps.length;
  for (let p = o.length - 1; p >= 0 && (t.replace(e, n, r), !(t.steps.length > f)); p--) {
    let g = o[p];
    g < 0 || (e = i.before(g), n = s.after(g));
  }
}
function Mf(t, e, n, r, i) {
  if (e < n) {
    let s = t.firstChild;
    t = t.replaceChild(0, s.copy(Mf(s.content, e + 1, n, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(t).append(t);
    t = o.append(s.matchFragment(o).fillBefore(H.empty, !0));
  }
  return t;
}
function Bg(t, e, n, r) {
  if (!r.isInline && e == n && t.doc.resolve(e).parent.content.size) {
    let i = Rg(t.doc, e, r.type);
    i != null && (e = n = i);
  }
  t.replaceRange(e, n, new G(H.from(r), 0, 0));
}
function $g(t, e, n) {
  let r = t.doc.resolve(e), i = t.doc.resolve(n), s = Af(r, i);
  for (let o = 0; o < s.length; o++) {
    let a = s[o], l = o == s.length - 1;
    if (l && a == 0 || r.node(a).type.contentMatch.validEnd)
      return t.delete(r.start(a), i.end(a));
    if (a > 0 && (l || r.node(a - 1).canReplace(r.index(a - 1), i.indexAfter(a - 1))))
      return t.delete(r.before(a), i.after(a));
  }
  for (let o = 1; o <= r.depth && o <= i.depth; o++)
    if (e - r.start(o) == r.depth - o && n > r.end(o) && i.end(o) - n != i.depth - o)
      return t.delete(r.before(o), n);
  t.delete(e, n);
}
function Af(t, e) {
  let n = [], r = Math.min(t.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = t.start(i);
    if (s < t.pos - (t.depth - i) || e.end(i) > e.pos + (e.depth - i) || t.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == t.depth && i == e.depth && t.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && n.push(i);
  }
  return n;
}
class Er extends ut {
  /**
  Construct an attribute step.
  */
  constructor(e, n, r) {
    super(), this.pos = e, this.attr = n, this.value = r;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Be.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in n.attrs)
      r[s] = n.attrs[s];
    r[this.attr] = this.value;
    let i = n.type.create(r, null, n.marks);
    return Be.fromReplace(e, this.pos, this.pos + 1, new G(H.from(i), 0, n.isLeaf ? 0 : 1));
  }
  getMap() {
    return wt.empty;
  }
  invert(e) {
    return new Er(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Er(n.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.pos != "number" || typeof n.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Er(n.pos, n.attr, n.value);
  }
}
ut.jsonID("attr", Er);
let jr = class extends Error {
};
jr = function t(e) {
  let n = Error.call(this, e);
  return n.__proto__ = t.prototype, n;
};
jr.prototype = Object.create(Error.prototype);
jr.prototype.constructor = jr;
jr.prototype.name = "TransformError";
class Tf {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Sr();
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
      throw new jr(n.failed);
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
  replace(e, n = e, r = G.empty) {
    let i = vl(this.doc, e, n, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, n, r) {
    return this.replace(e, n, new G(H.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, n) {
    return this.replace(e, n, G.empty);
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
    return Dg(this, e, n, r), this;
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
    return Bg(this, e, n, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, n) {
    return $g(this, e, n), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, n) {
    return Cg(this, e, n), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, n = 1) {
    return Ng(this, e, n), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, n) {
    return Ag(this, e, n), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, n = e, r, i = null) {
    return Tg(this, e, n, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, n, r = null, i) {
    return jg(this, e, n, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  */
  setNodeAttribute(e, n, r) {
    return this.step(new Er(e, n, r)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, n) {
    return this.step(new bn(e, n)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, n) {
    if (!(n instanceof pt)) {
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
    return Pg(this, e, n, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, n, r) {
    return _g(this, e, n, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, n, r) {
    return kg(this, e, n, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, n, r) {
    return xg(this, e, n, r), this;
  }
}
const So = /* @__PURE__ */ Object.create(null);
class ie {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, n, r) {
    this.$anchor = e, this.$head = n, this.ranges = r || [new Of(e.min(n), e.max(n))];
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
  replace(e, n = G.empty) {
    let r = n.content.lastChild, i = null;
    for (let a = 0; a < n.openEnd; a++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let a = 0; a < o.length; a++) {
      let { $from: l, $to: c } = o[a], d = e.mapping.slice(s);
      e.replaceRange(d.map(l.pos), d.map(c.pos), a ? G.empty : n), a == 0 && Gc(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, n) {
    let r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: o, $to: a } = i[s], l = e.mapping.slice(r), c = l.map(o.pos), d = l.map(a.pos);
      s ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, n), Gc(e, r, n.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new re(e) : cr(e.node(0), e.parent, e.pos, e.index(), n, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = n < 0 ? cr(e.node(0), e.node(s), e.before(s + 1), e.index(s), n, r) : cr(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, n, r);
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
    return this.findFrom(e, n) || this.findFrom(e, -n) || new Nt(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return cr(e, e, 0, 0, 1) || new Nt(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return cr(e, e, e.content.size, e.childCount, -1) || new Nt(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, n) {
    if (!n || !n.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = So[n.type];
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
    if (e in So)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return So[e] = n, n.prototype.jsonID = e, n;
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
    return re.between(this.$anchor, this.$head).getBookmark();
  }
}
ie.prototype.visible = !0;
class Of {
  /**
  Create a range.
  */
  constructor(e, n) {
    this.$from = e, this.$to = n;
  }
}
let Kc = !1;
function qc(t) {
  !Kc && !t.parent.inlineContent && (Kc = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + t.parent.type.name + ")"));
}
class re extends ie {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, n = e) {
    qc(e), qc(n), super(e, n);
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
      return ie.near(r);
    let i = e.resolve(n.map(this.anchor));
    return new re(i.parent.inlineContent ? i : r, r);
  }
  replace(e, n = G.empty) {
    if (super.replace(e, n), n == G.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof re && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new no(this.anchor, this.head);
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
    return new re(e.resolve(n.anchor), e.resolve(n.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, n, r = n) {
    let i = e.resolve(n);
    return new this(i, r == n ? i : e.resolve(r));
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
    let i = e.pos - n.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !n.parent.inlineContent) {
      let s = ie.findFrom(n, r, !0) || ie.findFrom(n, -r, !0);
      if (s)
        n = s.$head;
      else
        return ie.near(n, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = n : (e = (ie.findFrom(e, -r, !0) || ie.findFrom(e, r, !0)).$anchor, e.pos < n.pos != i < 0 && (e = n))), new re(e, n);
  }
}
ie.jsonID("text", re);
class no {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new no(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return re.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class ee extends ie {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let n = e.nodeAfter, r = e.node(0).resolve(e.pos + n.nodeSize);
    super(e, r), this.node = n;
  }
  map(e, n) {
    let { deleted: r, pos: i } = n.mapResult(this.anchor), s = e.resolve(i);
    return r ? ie.near(s) : new ee(s);
  }
  content() {
    return new G(H.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof ee && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new wl(this.anchor);
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
ie.jsonID("node", ee);
class wl {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: n, pos: r } = e.mapResult(this.anchor);
    return n ? new no(r, r) : new wl(r);
  }
  resolve(e) {
    let n = e.resolve(this.anchor), r = n.nodeAfter;
    return r && ee.isSelectable(r) ? new ee(n) : ie.near(n);
  }
}
class Nt extends ie {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, n = G.empty) {
    if (n == G.empty) {
      e.delete(0, e.doc.content.size);
      let r = ie.atStart(e.doc);
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
    return new Nt(e);
  }
  map(e) {
    return new Nt(e);
  }
  eq(e) {
    return e instanceof Nt;
  }
  getBookmark() {
    return Hg;
  }
}
ie.jsonID("all", Nt);
const Hg = {
  map() {
    return this;
  },
  resolve(t) {
    return new Nt(t);
  }
};
function cr(t, e, n, r, i, s = !1) {
  if (e.inlineContent)
    return re.create(t, n);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let a = e.child(o);
    if (a.isAtom) {
      if (!s && ee.isSelectable(a))
        return ee.create(t, n - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = cr(t, a, n + i, i < 0 ? a.childCount : 0, i, s);
      if (l)
        return l;
    }
    n += a.nodeSize * i;
  }
  return null;
}
function Gc(t, e, n) {
  let r = t.steps.length - 1;
  if (r < e)
    return;
  let i = t.steps[r];
  if (!(i instanceof Ue || i instanceof Fe))
    return;
  let s = t.mapping.maps[r], o;
  s.forEach((a, l, c, d) => {
    o == null && (o = d);
  }), t.setSelection(ie.near(t.doc.resolve(o), n));
}
function Jc(t, e) {
  return !e || !t ? t : t.bind(e);
}
class Ni {
  constructor(e, n, r) {
    this.name = e, this.init = Jc(n.init, r), this.apply = Jc(n.apply, r);
  }
}
new Ni("doc", {
  init(t) {
    return t.doc || t.schema.topNodeType.createAndFill();
  },
  apply(t) {
    return t.doc;
  }
}), new Ni("selection", {
  init(t, e) {
    return t.selection || ie.atStart(e.doc);
  },
  apply(t) {
    return t.selection;
  }
}), new Ni("storedMarks", {
  init(t) {
    return t.storedMarks || null;
  },
  apply(t, e, n, r) {
    return r.selection.$cursor ? t.storedMarks : null;
  }
}), new Ni("scrollToSelection", {
  init() {
    return 0;
  },
  apply(t, e) {
    return t.scrolledIntoView ? e + 1 : e;
  }
});
function jf(t, e, n) {
  for (let r in t) {
    let i = t[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = jf(i, e, {})), n[r] = i;
  }
  return n;
}
class et {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && jf(e.props, this, this.props), this.key = e.key ? e.key.key : Pf("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Co = /* @__PURE__ */ Object.create(null);
function Pf(t) {
  return t in Co ? t + "$" + ++Co[t] : (Co[t] = 0, t + "$");
}
class tt {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Pf(e);
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
const tr = function(t) {
  for (var e = 0; ; e++)
    if (t = t.previousSibling, !t)
      return e;
}, Nf = function(t, e, n, r) {
  return n && (Yc(t, e, n, r, -1) || Yc(t, e, n, r, 1));
}, Fg = /^(img|br|input|textarea|hr)$/i;
function Yc(t, e, n, r, i) {
  for (; ; ) {
    if (t == n && e == r)
      return !0;
    if (e == (i < 0 ? 0 : ms(t))) {
      let s = t.parentNode;
      if (!s || s.nodeType != 1 || _l(t) || Fg.test(t.nodeName) || t.contentEditable == "false")
        return !1;
      e = tr(t) + (i < 0 ? 0 : 1), t = s;
    } else if (t.nodeType == 1) {
      if (t = t.childNodes[e + (i < 0 ? -1 : 0)], t.contentEditable == "false")
        return !1;
      e = i < 0 ? ms(t) : 0;
    } else
      return !1;
  }
}
function ms(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function Wg(t, e, n) {
  for (let r = e == 0, i = e == ms(t); r || i; ) {
    if (t == n)
      return !0;
    let s = tr(t);
    if (t = t.parentNode, !t)
      return !1;
    r = r && s == 0, i = i && s == ms(t);
  }
}
function _l(t) {
  let e;
  for (let n = t; n && !(e = n.pmViewDesc); n = n.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == t || e.contentDOM == t);
}
const Rf = function(t) {
  return t.focusNode && Nf(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset);
};
function If(t, e) {
  let n = document.createEvent("Event");
  return n.initEvent("keydown", !0, !0), n.keyCode = t, n.key = n.code = e, n;
}
const Gt = typeof navigator < "u" ? navigator : null, Xc = typeof document < "u" ? document : null, On = Gt && Gt.userAgent || "", fa = /Edge\/(\d+)/.exec(On), Lf = /MSIE \d/.exec(On), pa = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(On), vi = !!(Lf || pa || fa), zf = Lf ? document.documentMode : pa ? +pa[1] : fa ? +fa[1] : 0, ro = !vi && /gecko\/(\d+)/i.test(On);
ro && +(/Firefox\/(\d+)/.exec(On) || [0, 0])[1];
const ha = !vi && /Chrome\/(\d+)/.exec(On), nr = !!ha, Vg = ha ? +ha[1] : 0, rr = !vi && !!Gt && /Apple Computer/.test(Gt.vendor), kl = rr && (/Mobile\/\w+/.test(On) || !!Gt && Gt.maxTouchPoints > 2), bt = kl || (Gt ? /Mac/.test(Gt.platform) : !1), Ug = Gt ? /Win/.test(Gt.platform) : !1, wi = /Android \d/.test(On), xl = !!Xc && "webkitFontSmoothing" in Xc.documentElement.style, Kg = xl ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function qg(t, e = null) {
  let n = t.domSelectionRange(), r = t.state.doc;
  if (!n.focusNode)
    return null;
  let i = t.docView.nearestDesc(n.focusNode), s = i && i.size == 0, o = t.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
  if (o < 0)
    return null;
  let a = r.resolve(o), l, c;
  if (Rf(n)) {
    for (l = a; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && ee.isSelectable(d) && i.parent && !(d.isInline && Wg(n.focusNode, n.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new ee(o == f ? a : r.resolve(f));
    }
  } else {
    let d = t.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
    if (d < 0)
      return null;
    l = r.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || t.state.selection.head < a.pos && !s ? 1 : -1;
    c = Bf(t, l, a, d);
  }
  return c;
}
function Df(t) {
  return t.editable ? t.hasFocus() : Xg(t) && document.activeElement && document.activeElement.contains(t.dom);
}
function Sl(t, e = !1) {
  let n = t.state.selection;
  if (Yg(t, n), !!Df(t)) {
    if (!e && t.input.mouseDown && t.input.mouseDown.allowDefault && nr) {
      let r = t.domSelectionRange(), i = t.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && Nf(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        t.input.mouseDown.delayedSelectionSync = !0, t.domObserver.setCurSelection();
        return;
      }
    }
    if (t.domObserver.disconnectSelection(), t.cursorWrapper)
      Jg(t);
    else {
      let { anchor: r, head: i } = n, s, o;
      Qc && !(n instanceof re) && (n.$from.parent.inlineContent || (s = Zc(t, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = Zc(t, n.to))), t.docView.setSelection(r, i, t.root, e), Qc && (s && eu(s), o && eu(o)), n.visible ? t.dom.classList.remove("ProseMirror-hideselection") : (t.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Gg(t));
    }
    t.domObserver.setCurSelection(), t.domObserver.connectSelection();
  }
}
const Qc = rr || nr && Vg < 63;
function Zc(t, e) {
  let { node: n, offset: r } = t.docView.domFromPos(e, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, s = r ? n.childNodes[r - 1] : null;
  if (rr && i && i.contentEditable == "false")
    return Eo(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return Eo(i);
    if (s)
      return Eo(s);
  }
}
function Eo(t) {
  return t.contentEditable = "true", rr && t.draggable && (t.draggable = !1, t.wasDraggable = !0), t;
}
function eu(t) {
  t.contentEditable = "false", t.wasDraggable && (t.draggable = !0, t.wasDraggable = null);
}
function Gg(t) {
  let e = t.dom.ownerDocument;
  e.removeEventListener("selectionchange", t.input.hideSelectionGuard);
  let n = t.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
  e.addEventListener("selectionchange", t.input.hideSelectionGuard = () => {
    (n.anchorNode != r || n.anchorOffset != i) && (e.removeEventListener("selectionchange", t.input.hideSelectionGuard), setTimeout(() => {
      (!Df(t) || t.state.selection.visible) && t.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Jg(t) {
  let e = t.domSelection(), n = document.createRange(), r = t.cursorWrapper.dom, i = r.nodeName == "IMG";
  i ? n.setEnd(r.parentNode, tr(r) + 1) : n.setEnd(r, 0), n.collapse(!1), e.removeAllRanges(), e.addRange(n), !i && !t.state.selection.visible && vi && zf <= 11 && (r.disabled = !0, r.disabled = !1);
}
function Yg(t, e) {
  if (e instanceof ee) {
    let n = t.docView.descAt(e.from);
    n != t.lastSelectedViewDesc && (tu(t), n && n.selectNode(), t.lastSelectedViewDesc = n);
  } else
    tu(t);
}
function tu(t) {
  t.lastSelectedViewDesc && (t.lastSelectedViewDesc.parent && t.lastSelectedViewDesc.deselectNode(), t.lastSelectedViewDesc = void 0);
}
function Bf(t, e, n, r) {
  return t.someProp("createSelectionBetween", (i) => i(t, e, n)) || re.between(e, n, r);
}
function Xg(t) {
  let e = t.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return t.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (t.editable || t.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function ma(t, e) {
  let { $anchor: n, $head: r } = t.selection, i = e > 0 ? n.max(r) : n.min(r), s = i.parent.inlineContent ? i.depth ? t.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && ie.findFrom(s, e);
}
function Hn(t, e) {
  return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()), !0;
}
function nu(t, e, n) {
  let r = t.state.selection;
  if (r instanceof re) {
    if (!r.empty || n.indexOf("s") > -1)
      return !1;
    if (t.endOfTextblock(e > 0 ? "forward" : "backward")) {
      let i = ma(t.state, e);
      return i && i instanceof ee ? Hn(t, i) : !1;
    } else if (!(bt && n.indexOf("m") > -1)) {
      let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
      if (!s || s.isText)
        return !1;
      let a = e < 0 ? i.pos - s.nodeSize : i.pos;
      return s.isAtom || (o = t.docView.descAt(a)) && !o.contentDOM ? ee.isSelectable(s) ? Hn(t, new ee(e < 0 ? t.state.doc.resolve(i.pos - s.nodeSize) : i)) : xl ? Hn(t, new re(t.state.doc.resolve(e < 0 ? a : a + s.nodeSize))) : !1 : !1;
    }
  } else {
    if (r instanceof ee && r.node.isInline)
      return Hn(t, new re(e > 0 ? r.$to : r.$from));
    {
      let i = ma(t.state, e);
      return i ? Hn(t, i) : !1;
    }
  }
}
function gs(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function ti(t, e) {
  if (t.contentEditable == "false")
    return !0;
  let n = t.pmViewDesc;
  return n && n.size == 0 && (e < 0 || t.nextSibling || t.nodeName != "BR");
}
function ar(t, e) {
  return e < 0 ? Qg(t) : Zg(t);
}
function Qg(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let i, s, o = !1;
  for (ro && n.nodeType == 1 && r < gs(n) && ti(n.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (n.nodeType != 1)
        break;
      {
        let a = n.childNodes[r - 1];
        if (ti(a, -1))
          i = n, s = --r;
        else if (a.nodeType == 3)
          n = a, r = n.nodeValue.length;
        else
          break;
      }
    } else {
      if ($f(n))
        break;
      {
        let a = n.previousSibling;
        for (; a && ti(a, -1); )
          i = n.parentNode, s = tr(a), a = a.previousSibling;
        if (a)
          n = a, r = gs(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = 0;
        }
      }
    }
  o ? ga(t, n, r) : i && ga(t, i, s);
}
function Zg(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let i = gs(n), s, o;
  for (; ; )
    if (r < i) {
      if (n.nodeType != 1)
        break;
      let a = n.childNodes[r];
      if (ti(a, 1))
        s = n, o = ++r;
      else
        break;
    } else {
      if ($f(n))
        break;
      {
        let a = n.nextSibling;
        for (; a && ti(a, 1); )
          s = a.parentNode, o = tr(a) + 1, a = a.nextSibling;
        if (a)
          n = a, r = 0, i = gs(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && ga(t, s, o);
}
function $f(t) {
  let e = t.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function e0(t, e) {
  for (; t && e == t.childNodes.length && !_l(t); )
    e = tr(t) + 1, t = t.parentNode;
  for (; t && e < t.childNodes.length; ) {
    let n = t.childNodes[e];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = 0;
  }
}
function t0(t, e) {
  for (; t && !e && !_l(t); )
    e = tr(t), t = t.parentNode;
  for (; t && e; ) {
    let n = t.childNodes[e - 1];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = t.childNodes.length;
  }
}
function ga(t, e, n) {
  if (e.nodeType != 3) {
    let s, o;
    (o = e0(e, n)) ? (e = o, n = 0) : (s = t0(e, n)) && (e = s, n = s.nodeValue.length);
  }
  let r = t.domSelection();
  if (Rf(r)) {
    let s = document.createRange();
    s.setEnd(e, n), s.setStart(e, n), r.removeAllRanges(), r.addRange(s);
  } else
    r.extend && r.extend(e, n);
  t.domObserver.setCurSelection();
  let { state: i } = t;
  setTimeout(() => {
    t.state == i && Sl(t);
  }, 50);
}
function ru(t, e) {
  let n = t.state.doc.resolve(e);
  if (!(nr || Ug) && n.parent.inlineContent) {
    let i = t.coordsAtPos(e);
    if (e > n.start()) {
      let s = t.coordsAtPos(e - 1), o = (s.top + s.bottom) / 2;
      if (o > i.top && o < i.bottom && Math.abs(s.left - i.left) > 1)
        return s.left < i.left ? "ltr" : "rtl";
    }
    if (e < n.end()) {
      let s = t.coordsAtPos(e + 1), o = (s.top + s.bottom) / 2;
      if (o > i.top && o < i.bottom && Math.abs(s.left - i.left) > 1)
        return s.left > i.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(t.dom).direction == "rtl" ? "rtl" : "ltr";
}
function iu(t, e, n) {
  let r = t.state.selection;
  if (r instanceof re && !r.empty || n.indexOf("s") > -1 || bt && n.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || t.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = ma(t.state, e);
    if (o && o instanceof ee)
      return Hn(t, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, a = r instanceof Nt ? ie.near(o, e) : ie.findFrom(o, e);
    return a ? Hn(t, a) : !1;
  }
  return !1;
}
function su(t, e) {
  if (!(t.state.selection instanceof re))
    return !0;
  let { $head: n, $anchor: r, empty: i } = t.state.selection;
  if (!n.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (t.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let s = !n.textOffset && (e < 0 ? n.nodeBefore : n.nodeAfter);
  if (s && !s.isText) {
    let o = t.state.tr;
    return e < 0 ? o.delete(n.pos - s.nodeSize, n.pos) : o.delete(n.pos, n.pos + s.nodeSize), t.dispatch(o), !0;
  }
  return !1;
}
function ou(t, e, n) {
  t.domObserver.stop(), e.contentEditable = n, t.domObserver.start();
}
function n0(t) {
  if (!rr || t.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: n } = t.domSelectionRange();
  if (e && e.nodeType == 1 && n == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    ou(t, r, "true"), setTimeout(() => ou(t, r, "false"), 20);
  }
  return !1;
}
function r0(t) {
  let e = "";
  return t.ctrlKey && (e += "c"), t.metaKey && (e += "m"), t.altKey && (e += "a"), t.shiftKey && (e += "s"), e;
}
function i0(t, e) {
  let n = e.keyCode, r = r0(e);
  if (n == 8 || bt && n == 72 && r == "c")
    return su(t, -1) || ar(t, -1);
  if (n == 46 && !e.shiftKey || bt && n == 68 && r == "c")
    return su(t, 1) || ar(t, 1);
  if (n == 13 || n == 27)
    return !0;
  if (n == 37 || bt && n == 66 && r == "c") {
    let i = n == 37 ? ru(t, t.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return nu(t, i, r) || ar(t, i);
  } else if (n == 39 || bt && n == 70 && r == "c") {
    let i = n == 39 ? ru(t, t.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return nu(t, i, r) || ar(t, i);
  } else {
    if (n == 38 || bt && n == 80 && r == "c")
      return iu(t, -1, r) || ar(t, -1);
    if (n == 40 || bt && n == 78 && r == "c")
      return n0(t) || iu(t, 1, r) || ar(t, 1);
    if (r == (bt ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90))
      return !0;
  }
  return !1;
}
function Hf(t, e) {
  t.someProp("transformCopied", (g) => {
    e = g(e, t);
  });
  let n = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let g = r.firstChild;
    n.push(g.type.name, g.attrs != g.type.defaultAttrs ? g.attrs : null), r = g.content;
  }
  let o = t.someProp("clipboardSerializer") || Kn.fromSchema(t.state.schema), a = qf(), l = a.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: a }));
  let c = l.firstChild, d, f = 0;
  for (; c && c.nodeType == 1 && (d = Kf[c.nodeName.toLowerCase()]); ) {
    for (let g = d.length - 1; g >= 0; g--) {
      let y = a.createElement(d[g]);
      for (; l.firstChild; )
        y.appendChild(l.firstChild);
      l.appendChild(y), f++;
    }
    c = l.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${f ? ` -${f}` : ""} ${JSON.stringify(n)}`);
  let p = t.someProp("clipboardTextSerializer", (g) => g(e, t)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: p };
}
function Ff(t, e, n, r, i) {
  let s = i.parent.type.spec.code, o, a;
  if (!n && !e)
    return null;
  let l = e && (r || s || !n);
  if (l) {
    if (t.someProp("transformPastedText", (p) => {
      e = p(e, s || r, t);
    }), s)
      return e ? new G(H.from(t.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : G.empty;
    let f = t.someProp("clipboardTextParser", (p) => p(e, i, r, t));
    if (f)
      a = f;
    else {
      let p = i.marks(), { schema: g } = t.state, y = Kn.fromSchema(g);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((w) => {
        let x = o.appendChild(document.createElement("p"));
        w && x.appendChild(y.serializeNode(g.text(w, p)));
      });
    }
  } else
    t.someProp("transformPastedHTML", (f) => {
      n = f(n, t);
    }), o = a0(n), xl && l0(o);
  let c = o && o.querySelector("[data-pm-slice]"), d = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (d && d[3])
    for (let f = +d[3]; f > 0; f--) {
      let p = o.firstChild;
      for (; p && p.nodeType != 1; )
        p = p.nextSibling;
      if (!p)
        break;
      o = p;
    }
  if (a || (a = (t.someProp("clipboardParser") || t.someProp("domParser") || mf.fromSchema(t.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || d),
    context: i,
    ruleFromNode(p) {
      return p.nodeName == "BR" && !p.nextSibling && p.parentNode && !s0.test(p.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), d)
    a = c0(au(a, +d[1], +d[2]), d[4]);
  else if (a = G.maxOpen(o0(a.content, i), !0), a.openStart || a.openEnd) {
    let f = 0, p = 0;
    for (let g = a.content.firstChild; f < a.openStart && !g.type.spec.isolating; f++, g = g.firstChild)
      ;
    for (let g = a.content.lastChild; p < a.openEnd && !g.type.spec.isolating; p++, g = g.lastChild)
      ;
    a = au(a, f, p);
  }
  return t.someProp("transformPasted", (f) => {
    a = f(a, t);
  }), a;
}
const s0 = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function o0(t, e) {
  if (t.childCount < 2)
    return t;
  for (let n = e.depth; n >= 0; n--) {
    let i = e.node(n).contentMatchAt(e.index(n)), s, o = [];
    if (t.forEach((a) => {
      if (!o)
        return;
      let l = i.findWrapping(a.type), c;
      if (!l)
        return o = null;
      if (c = o.length && s.length && Vf(l, s, a, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Uf(o[o.length - 1], s.length));
        let d = Wf(a, l);
        o.push(d), i = i.matchType(d.type), s = l;
      }
    }), o)
      return H.from(o);
  }
  return t;
}
function Wf(t, e, n = 0) {
  for (let r = e.length - 1; r >= n; r--)
    t = e[r].create(null, H.from(t));
  return t;
}
function Vf(t, e, n, r, i) {
  if (i < t.length && i < e.length && t[i] == e[i]) {
    let s = Vf(t, e, n, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == t.length - 1 ? n.type : t[i + 1]))
      return r.copy(r.content.append(H.from(Wf(n, t, i + 1))));
  }
}
function Uf(t, e) {
  if (e == 0)
    return t;
  let n = t.content.replaceChild(t.childCount - 1, Uf(t.lastChild, e - 1)), r = t.contentMatchAt(t.childCount).fillBefore(H.empty, !0);
  return t.copy(n.append(r));
}
function ya(t, e, n, r, i, s) {
  let o = e < 0 ? t.firstChild : t.lastChild, a = o.content;
  return t.childCount > 1 && (s = 0), i < r - 1 && (a = ya(a, e, n, r, i + 1, s)), i >= n && (a = e < 0 ? o.contentMatchAt(0).fillBefore(a, s <= i).append(a) : a.append(o.contentMatchAt(o.childCount).fillBefore(H.empty, !0))), t.replaceChild(e < 0 ? 0 : t.childCount - 1, o.copy(a));
}
function au(t, e, n) {
  return e < t.openStart && (t = new G(ya(t.content, -1, e, t.openStart, 0, t.openEnd), e, t.openEnd)), n < t.openEnd && (t = new G(ya(t.content, 1, n, t.openEnd, 0, 0), t.openStart, n)), t;
}
const Kf = {
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
let lu = null;
function qf() {
  return lu || (lu = document.implementation.createHTMLDocument("title"));
}
function a0(t) {
  let e = /^(\s*<meta [^>]*>)*/.exec(t);
  e && (t = t.slice(e[0].length));
  let n = qf().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(t), i;
  if ((i = r && Kf[r[1].toLowerCase()]) && (t = i.map((s) => "<" + s + ">").join("") + t + i.map((s) => "</" + s + ">").reverse().join("")), n.innerHTML = t, i)
    for (let s = 0; s < i.length; s++)
      n = n.querySelector(i[s]) || n;
  return n;
}
function l0(t) {
  let e = t.querySelectorAll(nr ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "), r);
  }
}
function c0(t, e) {
  if (!t.size)
    return t;
  let n = t.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return t;
  }
  let { content: i, openStart: s, openEnd: o } = t;
  for (let a = r.length - 2; a >= 0; a -= 2) {
    let l = n.nodes[r[a]];
    if (!l || l.hasRequiredAttrs())
      break;
    i = H.from(l.create(r[a + 1], i)), s++, o++;
  }
  return new G(i, s, o);
}
const Rt = {}, ht = {};
function vn(t, e) {
  t.input.lastSelectionOrigin = e, t.input.lastSelectionTime = Date.now();
}
ht.keydown = (t, e) => {
  let n = e;
  if (t.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Jf(t, n) && (t.input.lastKeyCode = n.keyCode, t.input.lastKeyCodeTime = Date.now(), !(wi && nr && n.keyCode == 13)))
    if (n.keyCode != 229 && t.domObserver.forceFlush(), kl && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
      let r = Date.now();
      t.input.lastIOSEnter = r, t.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        t.input.lastIOSEnter == r && (t.someProp("handleKeyDown", (i) => i(t, If(13, "Enter"))), t.input.lastIOSEnter = 0);
      }, 200);
    } else
      t.someProp("handleKeyDown", (r) => r(t, n)) || i0(t, n) ? n.preventDefault() : vn(t, "key");
};
ht.keyup = (t, e) => {
  e.keyCode == 16 && (t.input.shiftKey = !1);
};
ht.keypress = (t, e) => {
  let n = e;
  if (Jf(t, n) || !n.charCode || n.ctrlKey && !n.altKey || bt && n.metaKey)
    return;
  if (t.someProp("handleKeyPress", (i) => i(t, n))) {
    n.preventDefault();
    return;
  }
  let r = t.state.selection;
  if (!(r instanceof re) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(n.charCode);
    !/[\r\n]/.test(i) && !t.someProp("handleTextInput", (s) => s(t, r.$from.pos, r.$to.pos, i)) && t.dispatch(t.state.tr.insertText(i).scrollIntoView()), n.preventDefault();
  }
};
function io(t) {
  return { left: t.clientX, top: t.clientY };
}
function u0(t, e) {
  let n = e.x - t.clientX, r = e.y - t.clientY;
  return n * n + r * r < 100;
}
function Cl(t, e, n, r, i) {
  if (r == -1)
    return !1;
  let s = t.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (t.someProp(e, (a) => o > s.depth ? a(t, n, s.nodeAfter, s.before(o), i, !0) : a(t, n, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function Mr(t, e, n) {
  t.focused || t.focus();
  let r = t.state.tr.setSelection(e);
  n == "pointer" && r.setMeta("pointer", !0), t.dispatch(r);
}
function d0(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.doc.resolve(e), r = n.nodeAfter;
  return r && r.isAtom && ee.isSelectable(r) ? (Mr(t, new ee(n), "pointer"), !0) : !1;
}
function f0(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.selection, r, i;
  n instanceof ee && (r = n.node);
  let s = t.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let a = o > s.depth ? s.nodeAfter : s.node(o);
    if (ee.isSelectable(a)) {
      r && n.$from.depth > 0 && o >= n.$from.depth && s.before(n.$from.depth + 1) == n.$from.pos ? i = s.before(n.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (Mr(t, ee.create(t.state.doc, i), "pointer"), !0) : !1;
}
function p0(t, e, n, r, i) {
  return Cl(t, "handleClickOn", e, n, r) || t.someProp("handleClick", (s) => s(t, e, r)) || (i ? f0(t, n) : d0(t, n));
}
function h0(t, e, n, r) {
  return Cl(t, "handleDoubleClickOn", e, n, r) || t.someProp("handleDoubleClick", (i) => i(t, e, r));
}
function m0(t, e, n, r) {
  return Cl(t, "handleTripleClickOn", e, n, r) || t.someProp("handleTripleClick", (i) => i(t, e, r)) || g0(t, n, r);
}
function g0(t, e, n) {
  if (n.button != 0)
    return !1;
  let r = t.state.doc;
  if (e == -1)
    return r.inlineContent ? (Mr(t, re.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), a = i.before(s);
    if (o.inlineContent)
      Mr(t, re.create(r, a + 1, a + 1 + o.content.size), "pointer");
    else if (ee.isSelectable(o))
      Mr(t, ee.create(r, a), "pointer");
    else
      continue;
    return !0;
  }
}
function El(t) {
  return ys(t);
}
const Gf = bt ? "metaKey" : "ctrlKey";
Rt.mousedown = (t, e) => {
  let n = e;
  t.input.shiftKey = n.shiftKey;
  let r = El(t), i = Date.now(), s = "singleClick";
  i - t.input.lastClick.time < 500 && u0(n, t.input.lastClick) && !n[Gf] && (t.input.lastClick.type == "singleClick" ? s = "doubleClick" : t.input.lastClick.type == "doubleClick" && (s = "tripleClick")), t.input.lastClick = { time: i, x: n.clientX, y: n.clientY, type: s };
  let o = t.posAtCoords(io(n));
  o && (s == "singleClick" ? (t.input.mouseDown && t.input.mouseDown.done(), t.input.mouseDown = new y0(t, o, n, !!r)) : (s == "doubleClick" ? h0 : m0)(t, o.pos, o.inside, n) ? n.preventDefault() : vn(t, "pointer"));
};
class y0 {
  constructor(e, n, r, i) {
    this.view = e, this.pos = n, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Gf], this.allowDefault = r.shiftKey;
    let s, o;
    if (n.inside > -1)
      s = e.state.doc.nodeAt(n.inside), o = n.inside;
    else {
      let d = e.state.doc.resolve(n.pos);
      s = d.parent, o = d.depth ? d.before() : 0;
    }
    const a = i ? null : r.target, l = a ? e.docView.nearestDesc(a, !0) : null;
    this.target = l ? l.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof ee && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && ro && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), vn(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Sl(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let n = this.pos;
    this.view.state.doc != this.startDoc && (n = this.view.posAtCoords(io(e))), this.updateAllowDefault(e), this.allowDefault || !n ? vn(this.view, "pointer") : p0(this.view, n.pos, n.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    rr && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    nr && !this.view.state.selection.visible && Math.min(Math.abs(n.pos - this.view.state.selection.from), Math.abs(n.pos - this.view.state.selection.to)) <= 2) ? (Mr(this.view, ie.near(this.view.state.doc.resolve(n.pos)), "pointer"), e.preventDefault()) : vn(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), vn(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Rt.touchstart = (t) => {
  t.input.lastTouch = Date.now(), El(t), vn(t, "pointer");
};
Rt.touchmove = (t) => {
  t.input.lastTouch = Date.now(), vn(t, "pointer");
};
Rt.contextmenu = (t) => El(t);
function Jf(t, e) {
  return t.composing ? !0 : rr && Math.abs(e.timeStamp - t.input.compositionEndedAt) < 500 ? (t.input.compositionEndedAt = -2e8, !0) : !1;
}
const b0 = wi ? 5e3 : -1;
ht.compositionstart = ht.compositionupdate = (t) => {
  if (!t.composing) {
    t.domObserver.flush();
    let { state: e } = t, n = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      t.markCursor = t.state.storedMarks || n.marks(), ys(t, !0), t.markCursor = null;
    else if (ys(t), ro && e.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
      let r = t.domSelectionRange();
      for (let i = r.focusNode, s = r.focusOffset; i && i.nodeType == 1 && s != 0; ) {
        let o = s < 0 ? i.lastChild : i.childNodes[s - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          t.domSelection().collapse(o, o.nodeValue.length);
          break;
        } else
          i = o, s = -1;
      }
    }
    t.input.composing = !0;
  }
  Yf(t, b0);
};
ht.compositionend = (t, e) => {
  t.composing && (t.input.composing = !1, t.input.compositionEndedAt = e.timeStamp, t.input.compositionPendingChanges = t.domObserver.pendingRecords().length ? t.input.compositionID : 0, t.input.compositionPendingChanges && Promise.resolve().then(() => t.domObserver.flush()), t.input.compositionID++, Yf(t, 20));
};
function Yf(t, e) {
  clearTimeout(t.input.composingTimeout), e > -1 && (t.input.composingTimeout = setTimeout(() => ys(t), e));
}
function v0(t) {
  for (t.composing && (t.input.composing = !1, t.input.compositionEndedAt = w0()); t.input.compositionNodes.length > 0; )
    t.input.compositionNodes.pop().markParentsDirty();
}
function w0() {
  let t = document.createEvent("Event");
  return t.initEvent("event", !0, !0), t.timeStamp;
}
function ys(t, e = !1) {
  if (!(wi && t.domObserver.flushingSoon >= 0)) {
    if (t.domObserver.forceFlush(), v0(t), e || t.docView && t.docView.dirty) {
      let n = qg(t);
      return n && !n.eq(t.state.selection) ? t.dispatch(t.state.tr.setSelection(n)) : t.updateState(t.state), !0;
    }
    return !1;
  }
}
function _0(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.dom.parentNode.appendChild(document.createElement("div"));
  n.appendChild(e), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), t.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    n.parentNode && n.parentNode.removeChild(n), t.focus();
  }, 50);
}
const Pr = vi && zf < 15 || kl && Kg < 604;
Rt.copy = ht.cut = (t, e) => {
  let n = e, r = t.state.selection, i = n.type == "cut";
  if (r.empty)
    return;
  let s = Pr ? null : n.clipboardData, o = r.content(), { dom: a, text: l } = Hf(t, o);
  s ? (n.preventDefault(), s.clearData(), s.setData("text/html", a.innerHTML), s.setData("text/plain", l)) : _0(t, a), i && t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function k0(t) {
  return t.openStart == 0 && t.openEnd == 0 && t.content.childCount == 1 ? t.content.firstChild : null;
}
function x0(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.input.shiftKey || t.state.selection.$from.parent.type.spec.code, r = t.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
  n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = t.input.shiftKey && t.input.lastKeyCode != 45;
  setTimeout(() => {
    t.focus(), r.parentNode && r.parentNode.removeChild(r), n ? ba(t, r.value, null, i, e) : ba(t, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function ba(t, e, n, r, i) {
  let s = Ff(t, e, n, r, t.state.selection.$from);
  if (t.someProp("handlePaste", (l) => l(t, i, s || G.empty)))
    return !0;
  if (!s)
    return !1;
  let o = k0(s), a = o ? t.state.tr.replaceSelectionWith(o, r) : t.state.tr.replaceSelection(s);
  return t.dispatch(a.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
ht.paste = (t, e) => {
  let n = e;
  if (t.composing && !wi)
    return;
  let r = Pr ? null : n.clipboardData, i = t.input.shiftKey && t.input.lastKeyCode != 45;
  r && ba(t, r.getData("text/plain"), r.getData("text/html"), i, n) ? n.preventDefault() : x0(t, n);
};
class S0 {
  constructor(e, n) {
    this.slice = e, this.move = n;
  }
}
const Xf = bt ? "altKey" : "ctrlKey";
Rt.dragstart = (t, e) => {
  let n = e, r = t.input.mouseDown;
  if (r && r.done(), !n.dataTransfer)
    return;
  let i = t.state.selection, s = i.empty ? null : t.posAtCoords(io(n));
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof ee ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      t.dispatch(t.state.tr.setSelection(ee.create(t.state.doc, r.mightDrag.pos)));
    else if (n.target && n.target.nodeType == 1) {
      let c = t.docView.nearestDesc(n.target, !0);
      c && c.node.type.spec.draggable && c != t.docView && t.dispatch(t.state.tr.setSelection(ee.create(t.state.doc, c.posBefore)));
    }
  }
  let o = t.state.selection.content(), { dom: a, text: l } = Hf(t, o);
  n.dataTransfer.clearData(), n.dataTransfer.setData(Pr ? "Text" : "text/html", a.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Pr || n.dataTransfer.setData("text/plain", l), t.dragging = new S0(o, !n[Xf]);
};
Rt.dragend = (t) => {
  let e = t.dragging;
  window.setTimeout(() => {
    t.dragging == e && (t.dragging = null);
  }, 50);
};
ht.dragover = ht.dragenter = (t, e) => e.preventDefault();
ht.drop = (t, e) => {
  let n = e, r = t.dragging;
  if (t.dragging = null, !n.dataTransfer)
    return;
  let i = t.posAtCoords(io(n));
  if (!i)
    return;
  let s = t.state.doc.resolve(i.pos), o = r && r.slice;
  o ? t.someProp("transformPasted", (y) => {
    o = y(o, t);
  }) : o = Ff(t, n.dataTransfer.getData(Pr ? "Text" : "text/plain"), Pr ? null : n.dataTransfer.getData("text/html"), !1, s);
  let a = !!(r && !n[Xf]);
  if (t.someProp("handleDrop", (y) => y(t, n, o || G.empty, a))) {
    n.preventDefault();
    return;
  }
  if (!o)
    return;
  n.preventDefault();
  let l = o ? Sf(t.state.doc, s.pos, o) : s.pos;
  l == null && (l = s.pos);
  let c = t.state.tr;
  a && c.deleteSelection();
  let d = c.mapping.map(l), f = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, p = c.doc;
  if (f ? c.replaceRangeWith(d, d, o.content.firstChild) : c.replaceRange(d, d, o), c.doc.eq(p))
    return;
  let g = c.doc.resolve(d);
  if (f && ee.isSelectable(o.content.firstChild) && g.nodeAfter && g.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new ee(g));
  else {
    let y = c.mapping.map(l);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((w, x, E, T) => y = T), c.setSelection(Bf(t, g, c.doc.resolve(y)));
  }
  t.focus(), t.dispatch(c.setMeta("uiEvent", "drop"));
};
Rt.focus = (t) => {
  t.input.lastFocus = Date.now(), t.focused || (t.domObserver.stop(), t.dom.classList.add("ProseMirror-focused"), t.domObserver.start(), t.focused = !0, setTimeout(() => {
    t.docView && t.hasFocus() && !t.domObserver.currentSelection.eq(t.domSelectionRange()) && Sl(t);
  }, 20));
};
Rt.blur = (t, e) => {
  let n = e;
  t.focused && (t.domObserver.stop(), t.dom.classList.remove("ProseMirror-focused"), t.domObserver.start(), n.relatedTarget && t.dom.contains(n.relatedTarget) && t.domObserver.currentSelection.clear(), t.focused = !1);
};
Rt.beforeinput = (t, e) => {
  if (nr && wi && e.inputType == "deleteContentBackward") {
    t.domObserver.flushSoon();
    let { domChangeCount: r } = t.input;
    setTimeout(() => {
      if (t.input.domChangeCount != r || (t.dom.blur(), t.focus(), t.someProp("handleKeyDown", (s) => s(t, If(8, "Backspace")))))
        return;
      let { $cursor: i } = t.state.selection;
      i && i.pos > 0 && t.dispatch(t.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let t in ht)
  Rt[t] = ht[t];
function fi(t, e) {
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
class bs {
  constructor(e, n) {
    this.toDOM = e, this.spec = n || Xn, this.side = this.spec.side || 0;
  }
  map(e, n, r, i) {
    let { pos: s, deleted: o } = e.mapResult(n.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new lt(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof bs && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && fi(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class kn {
  constructor(e, n) {
    this.attrs = e, this.spec = n || Xn;
  }
  map(e, n, r, i) {
    let s = e.map(n.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(n.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new lt(s, o, this);
  }
  valid(e, n) {
    return n.from < n.to;
  }
  eq(e) {
    return this == e || e instanceof kn && fi(this.attrs, e.attrs) && fi(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof kn;
  }
  destroy() {
  }
}
class Ml {
  constructor(e, n) {
    this.attrs = e, this.spec = n || Xn;
  }
  map(e, n, r, i) {
    let s = e.mapResult(n.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(n.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new lt(s.pos - r, o.pos - r, this);
  }
  valid(e, n) {
    let { index: r, offset: i } = e.content.findIndex(n.from), s;
    return i == n.from && !(s = e.child(r)).isText && i + s.nodeSize == n.to;
  }
  eq(e) {
    return this == e || e instanceof Ml && fi(this.attrs, e.attrs) && fi(this.spec, e.spec);
  }
  destroy() {
  }
}
class lt {
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
    return new lt(e, n, this.type);
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
    return new lt(e, e, new bs(n, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, n, r, i) {
    return new lt(e, n, new kn(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, n, r, i) {
    return new lt(e, n, new Ml(r, i));
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
    return this.type instanceof kn;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof bs;
  }
}
const ur = [], Xn = {};
class xe {
  /**
  @internal
  */
  constructor(e, n) {
    this.local = e.length ? e : ur, this.children = n.length ? n : ur;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, n) {
    return n.length ? vs(n, e, 0, Xn) : rt;
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
    let i = [];
    return this.findInner(e ?? 0, n ?? 1e9, i, 0, r), i;
  }
  findInner(e, n, r, i, s) {
    for (let o = 0; o < this.local.length; o++) {
      let a = this.local[o];
      a.from <= n && a.to >= e && (!s || s(a.spec)) && r.push(a.copy(a.from + i, a.to + i));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < n && this.children[o + 1] > e) {
        let a = this.children[o] + 1;
        this.children[o + 2].findInner(e - a, n - a, r, i + a, s);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, n, r) {
    return this == rt || e.maps.length == 0 ? this : this.mapInner(e, n, 0, 0, r || Xn);
  }
  /**
  @internal
  */
  mapInner(e, n, r, i, s) {
    let o;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a].map(e, r, i);
      l && l.type.valid(n, l) ? (o || (o = [])).push(l) : s.onRemove && s.onRemove(this.local[a].spec);
    }
    return this.children.length ? C0(this.children, o || [], e, n, r, i, s) : o ? new xe(o.sort(Qn), ur) : rt;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, n) {
    return n.length ? this == rt ? xe.create(e, n) : this.addInner(e, n, 0) : this;
  }
  addInner(e, n, r) {
    let i, s = 0;
    e.forEach((a, l) => {
      let c = l + r, d;
      if (d = Zf(n, a, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < l; )
          s += 3;
        i[s] == l ? i[s + 2] = i[s + 2].addInner(a, d, c + 1) : i.splice(s, 0, l, l + a.nodeSize, vs(d, a, c + 1, Xn)), s += 3;
      }
    });
    let o = Qf(s ? ep(n) : n, -r);
    for (let a = 0; a < o.length; a++)
      o[a].type.valid(e, o[a]) || o.splice(a--, 1);
    return new xe(o.length ? this.local.concat(o).sort(Qn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == rt ? this : this.removeInner(e, 0);
  }
  removeInner(e, n) {
    let r = this.children, i = this.local;
    for (let s = 0; s < r.length; s += 3) {
      let o, a = r[s] + n, l = r[s + 1] + n;
      for (let d = 0, f; d < e.length; d++)
        (f = e[d]) && f.from > a && f.to < l && (e[d] = null, (o || (o = [])).push(f));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[s + 2].removeInner(o, a + 1);
      c != rt ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let a = 0; a < i.length; a++)
            i[a].eq(o, n) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new xe(i, r) : rt;
  }
  /**
  @internal
  */
  forChild(e, n) {
    if (this == rt)
      return this;
    if (n.isLeaf)
      return xe.empty;
    let r, i;
    for (let a = 0; a < this.children.length; a += 3)
      if (this.children[a] >= e) {
        this.children[a] == e && (r = this.children[a + 2]);
        break;
      }
    let s = e + 1, o = s + n.content.size;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a];
      if (l.from < o && l.to > s && l.type instanceof kn) {
        let c = Math.max(s, l.from) - s, d = Math.min(o, l.to) - s;
        c < d && (i || (i = [])).push(l.copy(c, d));
      }
    }
    if (i) {
      let a = new xe(i.sort(Qn), ur);
      return r ? new Fn([a, r]) : a;
    }
    return r || rt;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof xe) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return Al(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == rt)
      return ur;
    if (e.inlineContent || !this.local.some(kn.is))
      return this.local;
    let n = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof kn || n.push(this.local[r]);
    return n;
  }
}
xe.empty = new xe([], []);
xe.removeOverlap = Al;
const rt = xe.empty;
class Fn {
  constructor(e) {
    this.members = e;
  }
  map(e, n) {
    const r = this.members.map((i) => i.map(e, n, Xn));
    return Fn.from(r);
  }
  forChild(e, n) {
    if (n.isLeaf)
      return xe.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, n);
      s != rt && (s instanceof Fn ? r = r.concat(s.members) : r.push(s));
    }
    return Fn.from(r);
  }
  eq(e) {
    if (!(e instanceof Fn) || e.members.length != this.members.length)
      return !1;
    for (let n = 0; n < this.members.length; n++)
      if (!this.members[n].eq(e.members[n]))
        return !1;
    return !0;
  }
  locals(e) {
    let n, r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].localsInner(e);
      if (s.length)
        if (!n)
          n = s;
        else {
          r && (n = n.slice(), r = !1);
          for (let o = 0; o < s.length; o++)
            n.push(s[o]);
        }
    }
    return n ? Al(r ? n : n.sort(Qn)) : ur;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return rt;
      case 1:
        return e[0];
      default:
        return new Fn(e.every((n) => n instanceof xe) ? e : e.reduce((n, r) => n.concat(r instanceof xe ? r : r.members), []));
    }
  }
}
function C0(t, e, n, r, i, s, o) {
  let a = t.slice();
  for (let c = 0, d = s; c < n.maps.length; c++) {
    let f = 0;
    n.maps[c].forEach((p, g, y, w) => {
      let x = w - y - (g - p);
      for (let E = 0; E < a.length; E += 3) {
        let T = a[E + 1];
        if (T < 0 || p > T + d - f)
          continue;
        let P = a[E] + d - f;
        g >= P ? a[E + 1] = p <= P ? -2 : -1 : y >= i && x && (a[E] += x, a[E + 1] += x);
      }
      f += x;
    }), d = n.maps[c].map(d, -1);
  }
  let l = !1;
  for (let c = 0; c < a.length; c += 3)
    if (a[c + 1] < 0) {
      if (a[c + 1] == -2) {
        l = !0, a[c + 1] = -1;
        continue;
      }
      let d = n.map(t[c] + s), f = d - i;
      if (f < 0 || f >= r.content.size) {
        l = !0;
        continue;
      }
      let p = n.map(t[c + 1] + s, -1), g = p - i, { index: y, offset: w } = r.content.findIndex(f), x = r.maybeChild(y);
      if (x && w == f && w + x.nodeSize == g) {
        let E = a[c + 2].mapInner(n, x, d + 1, t[c] + s + 1, o);
        E != rt ? (a[c] = f, a[c + 1] = g, a[c + 2] = E) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = E0(a, t, e, n, i, s, o), d = vs(c, r, 0, o);
    e = d.local;
    for (let f = 0; f < a.length; f += 3)
      a[f + 1] < 0 && (a.splice(f, 3), f -= 3);
    for (let f = 0, p = 0; f < d.children.length; f += 3) {
      let g = d.children[f];
      for (; p < a.length && a[p] < g; )
        p += 3;
      a.splice(p, 0, d.children[f], d.children[f + 1], d.children[f + 2]);
    }
  }
  return new xe(e.sort(Qn), a);
}
function Qf(t, e) {
  if (!e || !t.length)
    return t;
  let n = [];
  for (let r = 0; r < t.length; r++) {
    let i = t[r];
    n.push(new lt(i.from + e, i.to + e, i.type));
  }
  return n;
}
function E0(t, e, n, r, i, s, o) {
  function a(l, c) {
    for (let d = 0; d < l.local.length; d++) {
      let f = l.local[d].map(r, i, c);
      f ? n.push(f) : o.onRemove && o.onRemove(l.local[d].spec);
    }
    for (let d = 0; d < l.children.length; d += 3)
      a(l.children[d + 2], l.children[d] + c + 1);
  }
  for (let l = 0; l < t.length; l += 3)
    t[l + 1] == -1 && a(t[l + 2], e[l] + s + 1);
  return n;
}
function Zf(t, e, n) {
  if (e.isLeaf)
    return null;
  let r = n + e.nodeSize, i = null;
  for (let s = 0, o; s < t.length; s++)
    (o = t[s]) && o.from > n && o.to < r && ((i || (i = [])).push(o), t[s] = null);
  return i;
}
function ep(t) {
  let e = [];
  for (let n = 0; n < t.length; n++)
    t[n] != null && e.push(t[n]);
  return e;
}
function vs(t, e, n, r) {
  let i = [], s = !1;
  e.forEach((a, l) => {
    let c = Zf(t, a, l + n);
    if (c) {
      s = !0;
      let d = vs(c, a, n + l + 1, r);
      d != rt && i.push(l, l + a.nodeSize, d);
    }
  });
  let o = Qf(s ? ep(t) : t, -n).sort(Qn);
  for (let a = 0; a < o.length; a++)
    o[a].type.valid(e, o[a]) || (r.onRemove && r.onRemove(o[a].spec), o.splice(a--, 1));
  return o.length || i.length ? new xe(o, i) : rt;
}
function Qn(t, e) {
  return t.from - e.from || t.to - e.to;
}
function Al(t) {
  let e = t;
  for (let n = 0; n < e.length - 1; n++) {
    let r = e[n];
    if (r.from != r.to)
      for (let i = n + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == t && (e = t.slice()), e[i] = s.copy(s.from, r.to), cu(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == t && (e = t.slice()), e[n] = r.copy(r.from, s.from), cu(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function cu(t, e, n) {
  for (; e < t.length && Qn(n, t[e]) > 0; )
    e++;
  t.splice(e, 0, n);
}
var En = {
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
}, ws = {
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
}, M0 = typeof navigator < "u" && /Mac/.test(navigator.platform), A0 = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Ke = 0; Ke < 10; Ke++)
  En[48 + Ke] = En[96 + Ke] = String(Ke);
for (var Ke = 1; Ke <= 24; Ke++)
  En[Ke + 111] = "F" + Ke;
for (var Ke = 65; Ke <= 90; Ke++)
  En[Ke] = String.fromCharCode(Ke + 32), ws[Ke] = String.fromCharCode(Ke);
for (var Mo in En)
  ws.hasOwnProperty(Mo) || (ws[Mo] = En[Mo]);
function T0(t) {
  var e = M0 && t.metaKey && t.shiftKey && !t.ctrlKey && !t.altKey || A0 && t.shiftKey && t.key && t.key.length == 1 || t.key == "Unidentified", n = !e && t.key || (t.shiftKey ? ws : En)[t.keyCode] || t.key || "Unidentified";
  return n == "Esc" && (n = "Escape"), n == "Del" && (n = "Delete"), n == "Left" && (n = "ArrowLeft"), n == "Up" && (n = "ArrowUp"), n == "Right" && (n = "ArrowRight"), n == "Down" && (n = "ArrowDown"), n;
}
const O0 = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function j0(t) {
  let e = t.split(/-(?!$)/), n = e[e.length - 1];
  n == "Space" && (n = " ");
  let r, i, s, o;
  for (let a = 0; a < e.length - 1; a++) {
    let l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      o = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      s = !0;
    else if (/^mod$/i.test(l))
      O0 ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), s && (n = "Shift-" + n), n;
}
function P0(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t)
    e[j0(n)] = t[n];
  return e;
}
function Ao(t, e, n = !0) {
  return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), n && e.shiftKey && (t = "Shift-" + t), t;
}
function tp(t) {
  let e = P0(t);
  return function(n, r) {
    let i = T0(r), s, o = e[Ao(i, r)];
    if (o && o(n.state, n.dispatch, n))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let a = e[Ao(i, r, !1)];
        if (a && a(n.state, n.dispatch, n))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || i.charCodeAt(0) > 127) && (s = En[r.keyCode]) && s != i) {
        let a = e[Ao(s, r)];
        if (a && a(n.state, n.dispatch, n))
          return !0;
      }
    }
    return !1;
  };
}
const N0 = (t, e) => t.selection.empty ? !1 : (e && e(t.tr.deleteSelection().scrollIntoView()), !0);
function R0(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("backward", t) : n.parentOffset > 0) ? null : n;
}
const I0 = (t, e, n) => {
  let r = R0(t, n);
  if (!r)
    return !1;
  let i = np(r);
  if (!i) {
    let o = r.blockRange(), a = o && Dr(o);
    return a == null ? !1 : (e && e(t.tr.lift(o, a).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (!s.type.spec.isolating && sp(t, i, e))
    return !0;
  if (r.parent.content.size == 0 && (Nr(s, "end") || ee.isSelectable(s))) {
    let o = vl(t.doc, r.before(), r.after(), G.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = t.tr.step(o);
        a.setSelection(Nr(s, "end") ? ie.findFrom(a.doc.resolve(a.mapping.map(i.pos, -1)), -1) : ee.create(a.doc, i.pos - s.nodeSize)), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(t.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function Nr(t, e, n = !1) {
  for (let r = t; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (n && r.childCount != 1)
      return !1;
  }
  return !1;
}
const L0 = (t, e, n) => {
  let { $head: r, empty: i } = t.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("backward", t) : r.parentOffset > 0)
      return !1;
    s = np(r);
  }
  let o = s && s.nodeBefore;
  return !o || !ee.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(ee.create(t.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function np(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      if (t.index(e) > 0)
        return t.doc.resolve(t.before(e + 1));
      if (t.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function z0(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("forward", t) : n.parentOffset < n.parent.content.size) ? null : n;
}
const D0 = (t, e, n) => {
  let r = z0(t, n);
  if (!r)
    return !1;
  let i = rp(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (sp(t, i, e))
    return !0;
  if (r.parent.content.size == 0 && (Nr(s, "start") || ee.isSelectable(s))) {
    let o = vl(t.doc, r.before(), r.after(), G.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = t.tr.step(o);
        a.setSelection(Nr(s, "start") ? ie.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : ee.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(t.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, B0 = (t, e, n) => {
  let { $head: r, empty: i } = t.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("forward", t) : r.parentOffset < r.parent.content.size)
      return !1;
    s = rp(r);
  }
  let o = s && s.nodeAfter;
  return !o || !ee.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(ee.create(t.doc, s.pos)).scrollIntoView()), !0);
};
function rp(t) {
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
const $0 = (t, e) => {
  let n = t.selection, r = n instanceof ee, i;
  if (r) {
    if (n.node.isTextblock || !Tn(t.doc, n.from))
      return !1;
    i = n.from;
  } else if (i = to(t.doc, n.from, -1), i == null)
    return !1;
  if (e) {
    let s = t.tr.join(i);
    r && s.setSelection(ee.create(s.doc, i - t.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, H0 = (t, e) => {
  let n = t.selection, r;
  if (n instanceof ee) {
    if (n.node.isTextblock || !Tn(t.doc, n.to))
      return !1;
    r = n.to;
  } else if (r = to(t.doc, n.to, 1), r == null)
    return !1;
  return e && e(t.tr.join(r).scrollIntoView()), !0;
}, F0 = (t, e) => {
  let { $from: n, $to: r } = t.selection, i = n.blockRange(r), s = i && Dr(i);
  return s == null ? !1 : (e && e(t.tr.lift(i, s).scrollIntoView()), !0);
}, W0 = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (e && e(t.tr.insertText(`
`).scrollIntoView()), !0);
};
function ip(t) {
  for (let e = 0; e < t.edgeCount; e++) {
    let { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
const V0 = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  if (!n.parent.type.spec.code || !n.sameParent(r))
    return !1;
  let i = n.node(-1), s = n.indexAfter(-1), o = ip(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let a = n.after(), l = t.tr.replaceWith(a, a, o.createAndFill());
    l.setSelection(ie.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, U0 = (t, e) => {
  let n = t.selection, { $from: r, $to: i } = n;
  if (n instanceof Nt || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = ip(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = t.tr.insert(o, s.createAndFill());
    a.setSelection(re.create(a.doc, o + 1)), e(a.scrollIntoView());
  }
  return !0;
}, K0 = (t, e) => {
  let { $cursor: n } = t.selection;
  if (!n || n.parent.content.size)
    return !1;
  if (n.depth > 1 && n.after() != n.end(-1)) {
    let s = n.before();
    if (Cr(t.doc, s))
      return e && e(t.tr.split(s).scrollIntoView()), !0;
  }
  let r = n.blockRange(), i = r && Dr(r);
  return i == null ? !1 : (e && e(t.tr.lift(r, i).scrollIntoView()), !0);
}, q0 = (t, e) => {
  let { $from: n, to: r } = t.selection, i, s = n.sharedDepth(r);
  return s == 0 ? !1 : (i = n.before(s), e && e(t.tr.setSelection(ee.create(t.doc, i))), !0);
};
function G0(t, e, n) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (n && n(t.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || Tn(t.doc, e.pos)) ? !1 : (n && n(t.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function sp(t, e, n) {
  let r = e.nodeBefore, i = e.nodeAfter, s, o;
  if (r.type.spec.isolating || i.type.spec.isolating)
    return !1;
  if (G0(t, e, n))
    return !0;
  let a = e.parent.canReplace(e.index(), e.index() + 1);
  if (a && (s = (o = r.contentMatchAt(r.childCount)).findWrapping(i.type)) && o.matchType(s[0] || i.type).validEnd) {
    if (n) {
      let f = e.pos + i.nodeSize, p = H.empty;
      for (let w = s.length - 1; w >= 0; w--)
        p = H.from(s[w].create(null, p));
      p = H.from(r.copy(p));
      let g = t.tr.step(new Fe(e.pos - 1, f, e.pos, f, new G(p, 1, 0), s.length, !0)), y = f + 2 * s.length;
      Tn(g.doc, y) && g.join(y), n(g.scrollIntoView());
    }
    return !0;
  }
  let l = ie.findFrom(e, 1), c = l && l.$from.blockRange(l.$to), d = c && Dr(c);
  if (d != null && d >= e.depth)
    return n && n(t.tr.lift(c, d).scrollIntoView()), !0;
  if (a && Nr(i, "start", !0) && Nr(r, "end")) {
    let f = r, p = [];
    for (; p.push(f), !f.isTextblock; )
      f = f.lastChild;
    let g = i, y = 1;
    for (; !g.isTextblock; g = g.firstChild)
      y++;
    if (f.canReplace(f.childCount, f.childCount, g.content)) {
      if (n) {
        let w = H.empty;
        for (let E = p.length - 1; E >= 0; E--)
          w = H.from(p[E].copy(w));
        let x = t.tr.step(new Fe(e.pos - p.length, e.pos + i.nodeSize, e.pos + y, e.pos + i.nodeSize - y, new G(w, p.length, 0), 0, !0));
        n(x.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function op(t) {
  return function(e, n) {
    let r = e.selection, i = t < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (n && n(e.tr.setSelection(re.create(e.doc, t < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const J0 = op(-1), Y0 = op(1);
function X0(t, e = null) {
  return function(n, r) {
    let { $from: i, $to: s } = n.selection, o = i.blockRange(s), a = o && bl(o, t, e);
    return a ? (r && r(n.tr.wrap(o, a).scrollIntoView()), !0) : !1;
  };
}
function uu(t, e = null) {
  return function(n, r) {
    let i = !1;
    for (let s = 0; s < n.selection.ranges.length && !i; s++) {
      let { $from: { pos: o }, $to: { pos: a } } = n.selection.ranges[s];
      n.doc.nodesBetween(o, a, (l, c) => {
        if (i)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(t, e)))
          if (l.type == t)
            i = !0;
          else {
            let d = n.doc.resolve(c), f = d.index();
            i = d.parent.canReplaceWith(f, f + 1, t);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let s = n.tr;
      for (let o = 0; o < n.selection.ranges.length; o++) {
        let { $from: { pos: a }, $to: { pos: l } } = n.selection.ranges[o];
        s.setBlockType(a, l, t, e);
      }
      r(s.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Q0(t, e = null) {
  return function(n, r) {
    let { $from: i, $to: s } = n.selection, o = i.blockRange(s), a = !1, l = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && i.node(o.depth - 1).type.compatibleContent(t) && o.startIndex == 0) {
      if (i.index(o.depth - 1) == 0)
        return !1;
      let d = n.doc.resolve(o.start - 2);
      l = new la(d, d, o.depth), o.endIndex < o.parent.childCount && (o = new la(i, n.doc.resolve(s.end(o.depth)), o.depth)), a = !0;
    }
    let c = bl(l, t, e, o);
    return c ? (r && r(Z0(n.tr, o, c, a, t).scrollIntoView()), !0) : !1;
  };
}
function Z0(t, e, n, r, i) {
  let s = H.empty;
  for (let d = n.length - 1; d >= 0; d--)
    s = H.from(n[d].type.create(n[d].attrs, s));
  t.step(new Fe(e.start - (r ? 2 : 0), e.end, e.start, e.end, new G(s, 0, 0), n.length, !0));
  let o = 0;
  for (let d = 0; d < n.length; d++)
    n[d].type == i && (o = d + 1);
  let a = n.length - o, l = e.start + n.length - (r ? 2 : 0), c = e.parent;
  for (let d = e.startIndex, f = e.endIndex, p = !0; d < f; d++, p = !1)
    !p && Cr(t.doc, l, a) && (t.split(l, a), l += 2 * a), l += c.child(d).nodeSize;
  return t;
}
function e2(t) {
  return function(e, n) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == t);
    return s ? n ? r.node(s.depth - 1).type == t ? t2(e, n, t, s) : n2(e, n, s) : !0 : !1;
  };
}
function t2(t, e, n, r) {
  let i = t.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new Fe(s - 1, o, s, o, new G(H.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new la(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const a = Dr(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.mapping.map(s, -1) - 1;
  return Tn(i.doc, l) && i.join(l), e(i.scrollIntoView()), !0;
}
function n2(t, e, n) {
  let r = t.tr, i = n.parent;
  for (let g = n.end, y = n.endIndex - 1, w = n.startIndex; y > w; y--)
    g -= i.child(y).nodeSize, r.delete(g - 1, g + 1);
  let s = r.doc.resolve(n.start), o = s.nodeAfter;
  if (r.mapping.map(n.end) != n.start + s.nodeAfter.nodeSize)
    return !1;
  let a = n.startIndex == 0, l = n.endIndex == i.childCount, c = s.node(-1), d = s.index(-1);
  if (!c.canReplace(d + (a ? 0 : 1), d + 1, o.content.append(l ? H.empty : H.from(i))))
    return !1;
  let f = s.pos, p = f + o.nodeSize;
  return r.step(new Fe(f - (a ? 1 : 0), p + (l ? 1 : 0), f + 1, p - 1, new G((a ? H.empty : H.from(i.copy(H.empty))).append(l ? H.empty : H.from(i.copy(H.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function r2(t) {
  return function(e, n) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == t);
    if (!s)
      return !1;
    let o = s.startIndex;
    if (o == 0)
      return !1;
    let a = s.parent, l = a.child(o - 1);
    if (l.type != t)
      return !1;
    if (n) {
      let c = l.lastChild && l.lastChild.type == a.type, d = H.from(c ? t.create() : null), f = new G(H.from(t.create(null, H.from(a.type.create(null, d)))), c ? 3 : 1, 0), p = s.start, g = s.end;
      n(e.tr.step(new Fe(p - (c ? 3 : 1), g, p, g, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function ap(t) {
  const { state: e, transaction: n } = t;
  let { selection: r } = n, { doc: i } = n, { storedMarks: s } = n;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    filterTransaction: e.filterTransaction,
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return s;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = n.selection, i = n.doc, s = n.storedMarks, n;
    }
  };
}
class i2 {
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
    const { rawCommands: e, editor: n, state: r } = this, { view: i } = n, { tr: s } = r, o = this.buildProps(s);
    return Object.fromEntries(Object.entries(e).map(([a, l]) => [a, (...d) => {
      const f = l(...d)(o);
      return !s.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(s), f;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, n = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, a = [], l = !!e, c = e || s.tr, d = () => (!l && n && !c.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(c), a.every((p) => p === !0)), f = {
      ...Object.fromEntries(Object.entries(r).map(([p, g]) => [p, (...w) => {
        const x = this.buildProps(c, n), E = g(...w)(x);
        return a.push(E), f;
      }])),
      run: d
    };
    return f;
  }
  createCan(e) {
    const { rawCommands: n, state: r } = this, i = !1, s = e || r.tr, o = this.buildProps(s, i);
    return {
      ...Object.fromEntries(Object.entries(n).map(([l, c]) => [l, (...d) => c(...d)({ ...o, dispatch: void 0 })])),
      chain: () => this.createChain(s, i)
    };
  }
  buildProps(e, n = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, a = {
      tr: e,
      editor: i,
      view: o,
      state: ap({
        state: s,
        transaction: e
      }),
      dispatch: n ? () => {
      } : void 0,
      chain: () => this.createChain(e, n),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([l, c]) => [l, (...d) => c(...d)(a)]));
      }
    };
    return a;
  }
}
function Pe(t, e, n) {
  return t.config[e] === void 0 && t.parent ? Pe(t.parent, e, n) : typeof t.config[e] == "function" ? t.config[e].bind({
    ...n,
    parent: t.parent ? Pe(t.parent, e, n) : null
  }) : t.config[e];
}
function s2(t) {
  const e = t.filter((i) => i.type === "extension"), n = t.filter((i) => i.type === "node"), r = t.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: n,
    markExtensions: r
  };
}
function qe(t, e) {
  if (typeof t == "string") {
    if (!e.nodes[t])
      throw Error(`There is no node type named '${t}'. Maybe you forgot to add the extension?`);
    return e.nodes[t];
  }
  return t;
}
function ge(...t) {
  return t.filter((e) => !!e).reduce((e, n) => {
    const r = { ...e };
    return Object.entries(n).forEach(([i, s]) => {
      if (!r[i]) {
        r[i] = s;
        return;
      }
      if (i === "class") {
        const a = s ? s.split(" ") : [], l = r[i] ? r[i].split(" ") : [], c = a.filter((d) => !l.includes(d));
        r[i] = [...l, ...c].join(" ");
      } else
        i === "style" ? r[i] = [r[i], s].join("; ") : r[i] = s;
    }), r;
  }, {});
}
function o2(t) {
  return typeof t == "function";
}
function Se(t, e = void 0, ...n) {
  return o2(t) ? e ? t.bind(e)(...n) : t(...n) : t;
}
function a2(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}
class _i {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
class l2 {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
function c2(t) {
  return Object.prototype.toString.call(t).slice(8, -1);
}
function To(t) {
  return c2(t) !== "Object" ? !1 : t.constructor === Object && Object.getPrototypeOf(t) === Object.prototype;
}
function so(t, e) {
  const n = { ...t };
  return To(t) && To(e) && Object.keys(e).forEach((r) => {
    To(e[r]) ? r in t ? n[r] = so(t[r], e[r]) : Object.assign(n, { [r]: e[r] }) : Object.assign(n, { [r]: e[r] });
  }), n;
}
class Ge {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Se(Pe(this, "addOptions", {
      name: this.name
    }))), this.storage = Se(Pe(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ge(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = so(this.options, e), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Ge(e);
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Pe(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function u2(t, e, n) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = n || {};
  let a = "", l = !0;
  return t.nodesBetween(r, i, (c, d, f, p) => {
    var g;
    const y = o?.[c.type.name];
    y ? (c.isBlock && !l && (a += s, l = !0), f && (a += y({
      node: c,
      pos: d,
      parent: f,
      index: p,
      range: e
    }))) : c.isText ? (a += (g = c?.text) === null || g === void 0 ? void 0 : g.slice(Math.max(r, d) - d, i - d), l = !1) : c.isBlock && !l && (a += s, l = !0);
  }), a;
}
function d2(t) {
  return Object.fromEntries(Object.entries(t.nodes).filter(([, e]) => e.spec.toText).map(([e, n]) => [e, n.spec.toText]));
}
Ge.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new et({
        key: new tt("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: t } = this, { state: e, schema: n } = t, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((d) => d.$from.pos)), a = Math.max(...s.map((d) => d.$to.pos)), l = d2(n);
            return u2(r, { from: o, to: a }, {
              textSerializers: l
            });
          }
        }
      })
    ];
  }
});
const f2 = () => ({ editor: t, view: e }) => (requestAnimationFrame(() => {
  var n;
  t.isDestroyed || (e.dom.blur(), (n = window?.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), p2 = (t = !1) => ({ commands: e }) => e.setContent("", t), h2 = () => ({ state: t, tr: e, dispatch: n }) => {
  const { selection: r } = e, { ranges: i } = r;
  return n && i.forEach(({ $from: s, $to: o }) => {
    t.doc.nodesBetween(s.pos, o.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: d } = e, f = c.resolve(d.map(l)), p = c.resolve(d.map(l + a.nodeSize)), g = f.blockRange(p);
      if (!g)
        return;
      const y = Dr(g);
      if (a.type.isTextblock) {
        const { defaultType: w } = f.parent.contentMatchAt(f.index());
        e.setNodeMarkup(g.start, w);
      }
      (y || y === 0) && e.lift(g, y);
    });
  }), !0;
}, m2 = (t) => (e) => t(e), g2 = () => ({ state: t, dispatch: e }) => U0(t, e), y2 = (t, e) => ({ editor: n, tr: r }) => {
  const { state: i } = n, s = i.doc.slice(t.from, t.to);
  r.deleteRange(t.from, t.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new re(r.doc.resolve(o - 1))), !0;
}, b2 = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, r = n.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = t.selection.$anchor;
  for (let s = i.depth; s > 0; s -= 1)
    if (i.node(s).type === r.type) {
      if (e) {
        const a = i.before(s), l = i.after(s);
        t.delete(a, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, v2 = (t) => ({ tr: e, state: n, dispatch: r }) => {
  const i = qe(t, n.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const l = s.before(o), c = s.after(o);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, w2 = (t) => ({ tr: e, dispatch: n }) => {
  const { from: r, to: i } = t;
  return n && e.delete(r, i), !0;
}, _2 = () => ({ state: t, dispatch: e }) => N0(t, e), k2 = () => ({ commands: t }) => t.keyboardShortcut("Enter"), x2 = () => ({ state: t, dispatch: e }) => V0(t, e);
function _s(t, e, n = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => n.strict ? e[i] === t[i] : a2(e[i]) ? e[i].test(t[i]) : e[i] === t[i]) : !0;
}
function va(t, e, n = {}) {
  return t.find((r) => r.type === e && _s(r.attrs, n));
}
function S2(t, e, n = {}) {
  return !!va(t, e, n);
}
function Tl(t, e, n = {}) {
  if (!t || !e)
    return;
  let r = t.parent.childAfter(t.parentOffset);
  if (t.parentOffset === r.offset && r.offset !== 0 && (r = t.parent.childBefore(t.parentOffset)), !r.node)
    return;
  const i = va([...r.node.marks], e, n);
  if (!i)
    return;
  let s = r.index, o = t.start() + r.offset, a = s + 1, l = o + r.node.nodeSize;
  for (va([...r.node.marks], e, n); s > 0 && i.isInSet(t.parent.child(s - 1).marks); )
    s -= 1, o -= t.parent.child(s).nodeSize;
  for (; a < t.parent.childCount && S2([...t.parent.child(a).marks], e, n); )
    l += t.parent.child(a).nodeSize, a += 1;
  return {
    from: o,
    to: l
  };
}
function jn(t, e) {
  if (typeof t == "string") {
    if (!e.marks[t])
      throw Error(`There is no mark type named '${t}'. Maybe you forgot to add the extension?`);
    return e.marks[t];
  }
  return t;
}
const C2 = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  const s = jn(t, r.schema), { doc: o, selection: a } = n, { $from: l, from: c, to: d } = a;
  if (i) {
    const f = Tl(l, s, e);
    if (f && f.from <= c && f.to >= d) {
      const p = re.create(o, f.from, f.to);
      n.setSelection(p);
    }
  }
  return !0;
}, E2 = (t) => (e) => {
  const n = typeof t == "function" ? t(e) : t;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](e))
      return !0;
  return !1;
};
function lp(t) {
  return t instanceof re;
}
function qn(t = 0, e = 0, n = 0) {
  return Math.min(Math.max(t, e), n);
}
function M2(t, e = null) {
  if (!e)
    return null;
  const n = ie.atStart(t), r = ie.atEnd(t);
  if (e === "start" || e === !0)
    return n;
  if (e === "end")
    return r;
  const i = n.from, s = r.to;
  return e === "all" ? re.create(t, qn(0, i, s), qn(t.content.size, i, s)) : re.create(t, qn(e, i, s), qn(e, i, s));
}
function Ol() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const A2 = (t = null, e = {}) => ({ editor: n, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    Ol() && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), e?.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && t === null || t === !1)
    return !0;
  if (s && t === null && !lp(n.state.selection))
    return o(), !0;
  const a = M2(i.doc, t) || n.state.selection, l = n.state.selection.eq(a);
  return s && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, T2 = (t, e) => (n) => t.every((r, i) => e(r, { ...n, index: i })), O2 = (t, e) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, t, e);
function du(t) {
  const e = `<body>${t}</body>`;
  return new window.DOMParser().parseFromString(e, "text/html").body;
}
function ks(t, e, n) {
  if (n = {
    slice: !0,
    parseOptions: {},
    ...n
  }, typeof t == "object" && t !== null)
    try {
      return Array.isArray(t) && t.length > 0 ? H.fromArray(t.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(t);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", t, "Error:", r), ks("", e, n);
    }
  if (typeof t == "string") {
    const r = mf.fromSchema(e);
    return n.slice ? r.parseSlice(du(t), n.parseOptions).content : r.parse(du(t), n.parseOptions);
  }
  return ks("", e, n);
}
function j2(t, e, n) {
  const r = t.steps.length - 1;
  if (r < e)
    return;
  const i = t.steps[r];
  if (!(i instanceof Ue || i instanceof Fe))
    return;
  const s = t.mapping.maps[r];
  let o = 0;
  s.forEach((a, l, c, d) => {
    o === 0 && (o = d);
  }), t.setSelection(ie.near(t.doc.resolve(o), n));
}
const P2 = (t) => t.toString().startsWith("<"), N2 = (t, e, n) => ({ tr: r, dispatch: i, editor: s }) => {
  if (i) {
    n = {
      parseOptions: {},
      updateSelection: !0,
      ...n
    };
    const o = ks(e, s.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...n.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: a, to: l } = typeof t == "number" ? { from: t, to: t } : { from: t.from, to: t.to }, c = !0, d = !0;
    if ((P2(o) ? o : [o]).forEach((p) => {
      p.check(), c = c ? p.isText && p.marks.length === 0 : !1, d = d ? p.isBlock : !1;
    }), a === l && d) {
      const { parent: p } = r.doc.resolve(a);
      p.isTextblock && !p.type.spec.code && !p.childCount && (a -= 1, l += 1);
    }
    c ? Array.isArray(e) ? r.insertText(e.map((p) => p.text || "").join(""), a, l) : typeof e == "object" && e && e.text ? r.insertText(e.text, a, l) : r.insertText(e, a, l) : r.replaceWith(a, l, o), n.updateSelection && j2(r, r.steps.length - 1, -1);
  }
  return !0;
}, R2 = () => ({ state: t, dispatch: e }) => $0(t, e), I2 = () => ({ state: t, dispatch: e }) => H0(t, e), L2 = () => ({ state: t, dispatch: e }) => I0(t, e), z2 = () => ({ state: t, dispatch: e }) => D0(t, e), D2 = () => ({ tr: t, state: e, dispatch: n }) => {
  try {
    const r = to(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), n && n(t), !0);
  } catch {
    return !1;
  }
}, B2 = () => ({ state: t, dispatch: e, tr: n }) => {
  try {
    const r = to(t.doc, t.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), e && e(n), !0);
  } catch {
    return !1;
  }
};
function jl() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function $2(t) {
  const e = t.split(/-(?!$)/);
  let n = e[e.length - 1];
  n === "Space" && (n = " ");
  let r, i, s, o;
  for (let a = 0; a < e.length - 1; a += 1) {
    const l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      o = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      s = !0;
    else if (/^mod$/i.test(l))
      Ol() || jl() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), s && (n = `Shift-${n}`), n;
}
const H2 = (t) => ({ editor: e, view: n, tr: r, dispatch: i }) => {
  const s = $2(t).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    n.someProp("handleKeyDown", (c) => c(n, a));
  });
  return l?.steps.forEach((c) => {
    const d = c.map(r.mapping);
    d && i && r.maybeStep(d);
  }), !0;
};
function Pl(t, e, n = {}) {
  const { from: r, to: i, empty: s } = t.selection, o = e ? qe(e, t.schema) : null, a = [];
  t.doc.nodesBetween(r, i, (f, p) => {
    if (f.isText)
      return;
    const g = Math.max(r, p), y = Math.min(i, p + f.nodeSize);
    a.push({
      node: f,
      from: g,
      to: y
    });
  });
  const l = i - r, c = a.filter((f) => o ? o.name === f.node.type.name : !0).filter((f) => _s(f.node.attrs, n, { strict: !1 }));
  return s ? !!c.length : c.reduce((f, p) => f + p.to - p.from, 0) >= l;
}
const F2 = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const i = qe(t, n.schema);
  return Pl(n, i, e) ? F0(n, r) : !1;
}, W2 = () => ({ state: t, dispatch: e }) => K0(t, e), V2 = (t) => ({ state: e, dispatch: n }) => {
  const r = qe(t, e.schema);
  return e2(r)(e, n);
}, U2 = () => ({ state: t, dispatch: e }) => W0(t, e);
function Nl(t, e) {
  return e.nodes[t] ? "node" : e.marks[t] ? "mark" : null;
}
function fu(t, e) {
  const n = typeof e == "string" ? [e] : e;
  return Object.keys(t).reduce((r, i) => (n.includes(i) || (r[i] = t[i]), r), {});
}
const K2 = (t, e) => ({ tr: n, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Nl(typeof t == "string" ? t : t.name, r.schema);
  return a ? (a === "node" && (s = qe(t, r.schema)), a === "mark" && (o = jn(t, r.schema)), i && n.selection.ranges.forEach((l) => {
    r.doc.nodesBetween(l.$from.pos, l.$to.pos, (c, d) => {
      s && s === c.type && n.setNodeMarkup(d, void 0, fu(c.attrs, e)), o && c.marks.length && c.marks.forEach((f) => {
        o === f.type && n.addMark(d, d + c.nodeSize, o.create(fu(f.attrs, e)));
      });
    });
  }), !0) : !1;
}, q2 = () => ({ tr: t, dispatch: e }) => (e && t.scrollIntoView(), !0), G2 = () => ({ tr: t, commands: e }) => e.setTextSelection({
  from: 0,
  to: t.doc.content.size
}), J2 = () => ({ state: t, dispatch: e }) => L0(t, e), Y2 = () => ({ state: t, dispatch: e }) => B0(t, e), X2 = () => ({ state: t, dispatch: e }) => q0(t, e), Q2 = () => ({ state: t, dispatch: e }) => Y0(t, e), Z2 = () => ({ state: t, dispatch: e }) => J0(t, e);
function ey(t, e, n = {}) {
  return ks(t, e, { slice: !1, parseOptions: n });
}
const ty = (t, e = !1, n = {}) => ({ tr: r, editor: i, dispatch: s }) => {
  const { doc: o } = r, a = ey(t, i.schema, n);
  return s && r.replaceWith(0, o.content.size, a).setMeta("preventUpdate", !e), !0;
};
function ki(t, e) {
  const n = jn(e, t.schema), { from: r, to: i, empty: s } = t.selection, o = [];
  s ? (t.storedMarks && o.push(...t.storedMarks), o.push(...t.selection.$head.marks())) : t.doc.nodesBetween(r, i, (l) => {
    o.push(...l.marks);
  });
  const a = o.find((l) => l.type.name === n.name);
  return a ? { ...a.attrs } : {};
}
function ny(t, e) {
  const n = new Tf(t);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      n.step(i);
    });
  }), n;
}
function ry(t) {
  for (let e = 0; e < t.edgeCount; e += 1) {
    const { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
function iy(t, e, n) {
  const r = [];
  return t.nodesBetween(e.from, e.to, (i, s) => {
    n(i) && r.push({
      node: i,
      pos: s
    });
  }), r;
}
function cp(t, e) {
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
function Rl(t) {
  return (e) => cp(e.$from, t);
}
function sy(t, e) {
  const n = qe(e, t.schema), { from: r, to: i } = t.selection, s = [];
  t.doc.nodesBetween(r, i, (a) => {
    s.push(a);
  });
  const o = s.reverse().find((a) => a.type.name === n.name);
  return o ? { ...o.attrs } : {};
}
function oy(t, e) {
  const n = Nl(typeof e == "string" ? e : e.name, t.schema);
  return n === "node" ? sy(t, e) : n === "mark" ? ki(t, e) : {};
}
function ay(t, e = JSON.stringify) {
  const n = {};
  return t.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(n, i) ? !1 : n[i] = !0;
  });
}
function ly(t) {
  const e = ay(t);
  return e.length === 1 ? e : e.filter((n, r) => !e.filter((s, o) => o !== r).some((s) => n.oldRange.from >= s.oldRange.from && n.oldRange.to <= s.oldRange.to && n.newRange.from >= s.newRange.from && n.newRange.to <= s.newRange.to));
}
function cy(t) {
  const { mapping: e, steps: n } = t, r = [];
  return e.maps.forEach((i, s) => {
    const o = [];
    if (i.ranges.length)
      i.forEach((a, l) => {
        o.push({ from: a, to: l });
      });
    else {
      const { from: a, to: l } = n[s];
      if (a === void 0 || l === void 0)
        return;
      o.push({ from: a, to: l });
    }
    o.forEach(({ from: a, to: l }) => {
      const c = e.slice(s).map(a, -1), d = e.slice(s).map(l), f = e.invert().map(c, -1), p = e.invert().map(d);
      r.push({
        oldRange: {
          from: f,
          to: p
        },
        newRange: {
          from: c,
          to: d
        }
      });
    });
  }), ly(r);
}
function Il(t, e, n) {
  const r = [];
  return t === e ? n.resolve(t).marks().forEach((i) => {
    const s = n.resolve(t - 1), o = Tl(s, i.type);
    o && r.push({
      mark: i,
      ...o
    });
  }) : n.nodesBetween(t, e, (i, s) => {
    r.push(...i.marks.map((o) => ({
      from: s,
      to: s + i.nodeSize,
      mark: o
    })));
  }), r;
}
function Yi(t, e, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const i = t.find((s) => s.type === e && s.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function uy(t, e, n = {}) {
  const { empty: r, ranges: i } = t.selection, s = e ? jn(e, t.schema) : null;
  if (r)
    return !!(t.storedMarks || t.selection.$from.marks()).filter((f) => s ? s.name === f.type.name : !0).find((f) => _s(f.attrs, n, { strict: !1 }));
  let o = 0;
  const a = [];
  if (i.forEach(({ $from: f, $to: p }) => {
    const g = f.pos, y = p.pos;
    t.doc.nodesBetween(g, y, (w, x) => {
      if (!w.isText && !w.marks.length)
        return;
      const E = Math.max(g, x), T = Math.min(y, x + w.nodeSize), P = T - E;
      o += P, a.push(...w.marks.map((u) => ({
        mark: u,
        from: E,
        to: T
      })));
    });
  }), o === 0)
    return !1;
  const l = a.filter((f) => s ? s.name === f.mark.type.name : !0).filter((f) => _s(f.mark.attrs, n, { strict: !1 })).reduce((f, p) => f + p.to - p.from, 0), c = a.filter((f) => s ? f.mark.type !== s && f.mark.type.excludes(s) : !0).reduce((f, p) => f + p.to - p.from, 0);
  return (l > 0 ? l + c : l) >= o;
}
function pu(t, e) {
  const { nodeExtensions: n } = s2(e), r = n.find((o) => o.name === t);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = Se(Pe(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function dy(t, e, n) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (lp(i) && (s = i.$cursor), s) {
    const a = (r = t.storedMarks) !== null && r !== void 0 ? r : s.marks();
    return !!n.isInSet(a) || !a.some((l) => l.type.excludes(n));
  }
  const { ranges: o } = i;
  return o.some(({ $from: a, $to: l }) => {
    let c = a.depth === 0 ? t.doc.inlineContent && t.doc.type.allowsMarkType(n) : !1;
    return t.doc.nodesBetween(a.pos, l.pos, (d, f, p) => {
      if (c)
        return !1;
      if (d.isInline) {
        const g = !p || p.type.allowsMarkType(n), y = !!n.isInSet(d.marks) || !d.marks.some((w) => w.type.excludes(n));
        c = g && y;
      }
      return !c;
    }), c;
  });
}
const fy = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  const { selection: s } = n, { empty: o, ranges: a } = s, l = jn(t, r.schema);
  if (i)
    if (o) {
      const c = ki(r, l);
      n.addStoredMark(l.create({
        ...c,
        ...e
      }));
    } else
      a.forEach((c) => {
        const d = c.$from.pos, f = c.$to.pos;
        r.doc.nodesBetween(d, f, (p, g) => {
          const y = Math.max(g, d), w = Math.min(g + p.nodeSize, f);
          p.marks.find((E) => E.type === l) ? p.marks.forEach((E) => {
            l === E.type && n.addMark(y, w, l.create({
              ...E.attrs,
              ...e
            }));
          }) : n.addMark(y, w, l.create(e));
        });
      });
  return dy(r, n, l);
}, py = (t, e) => ({ tr: n }) => (n.setMeta(t, e), !0), hy = (t, e = {}) => ({ state: n, dispatch: r, chain: i }) => {
  const s = qe(t, n.schema);
  return s.isTextblock ? i().command(({ commands: o }) => uu(s, e)(n) ? !0 : o.clearNodes()).command(({ state: o }) => uu(s, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, my = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, i = qn(t, 0, r.content.size), s = ee.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, gy = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, { from: i, to: s } = typeof t == "number" ? { from: t, to: t } : t, o = re.atStart(r).from, a = re.atEnd(r).to, l = qn(i, o, a), c = qn(s, o, a), d = re.create(r, l, c);
    e.setSelection(d);
  }
  return !0;
}, yy = (t) => ({ state: e, dispatch: n }) => {
  const r = qe(t, e.schema);
  return r2(r)(e, n);
};
function hu(t, e) {
  const n = t.storedMarks || t.selection.$to.parentOffset && t.selection.$from.marks();
  if (n) {
    const r = n.filter((i) => e?.includes(i.type.name));
    t.tr.ensureMarks(r);
  }
}
const by = ({ keepMarks: t = !0 } = {}) => ({ tr: e, state: n, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: a, $to: l } = s, c = i.extensionManager.attributes, d = Yi(c, a.node().type.name, a.node().attrs);
  if (s instanceof ee && s.node.isBlock)
    return !a.parentOffset || !Cr(o, a.pos) ? !1 : (r && (t && hu(n, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  if (r) {
    const f = l.parentOffset === l.parent.content.size;
    s instanceof re && e.deleteSelection();
    const p = a.depth === 0 ? void 0 : ry(a.node(-1).contentMatchAt(a.indexAfter(-1)));
    let g = f && p ? [
      {
        type: p,
        attrs: d
      }
    ] : void 0, y = Cr(e.doc, e.mapping.map(a.pos), 1, g);
    if (!g && !y && Cr(e.doc, e.mapping.map(a.pos), 1, p ? [{ type: p }] : void 0) && (y = !0, g = p ? [
      {
        type: p,
        attrs: d
      }
    ] : void 0), y && (e.split(e.mapping.map(a.pos), 1, g), p && !f && !a.parentOffset && a.parent.type !== p)) {
      const w = e.mapping.map(a.before()), x = e.doc.resolve(w);
      a.node(-1).canReplaceWith(x.index(), x.index() + 1, p) && e.setNodeMarkup(e.mapping.map(a.before()), p);
    }
    t && hu(n, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, vy = (t) => ({ tr: e, state: n, dispatch: r, editor: i }) => {
  var s;
  const o = qe(t, n.schema), { $from: a, $to: l } = n.selection, c = n.selection.node;
  if (c && c.isBlock || a.depth < 2 || !a.sameParent(l))
    return !1;
  const d = a.node(-1);
  if (d.type !== o)
    return !1;
  const f = i.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== o || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (r) {
      let x = H.empty;
      const E = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let b = a.depth - E; b >= a.depth - 3; b -= 1)
        x = H.from(a.node(b).copy(x));
      const T = a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3, P = Yi(f, a.node().type.name, a.node().attrs), u = ((s = o.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(P)) || void 0;
      x = x.append(H.from(o.createAndFill(null, u) || void 0));
      const m = a.before(a.depth - (E - 1));
      e.replace(m, a.after(-T), new G(x, 4 - E, 0));
      let h = -1;
      e.doc.nodesBetween(m, e.doc.content.size, (b, v) => {
        if (h > -1)
          return !1;
        b.isTextblock && b.content.size === 0 && (h = v + 1);
      }), h > -1 && e.setSelection(re.near(e.doc.resolve(h))), e.scrollIntoView();
    }
    return !0;
  }
  const p = l.pos === a.end() ? d.contentMatchAt(0).defaultType : null, g = Yi(f, d.type.name, d.attrs), y = Yi(f, a.node().type.name, a.node().attrs);
  e.delete(a.pos, l.pos);
  const w = p ? [
    { type: o, attrs: g },
    { type: p, attrs: y }
  ] : [{ type: o, attrs: g }];
  if (!Cr(e.doc, a.pos, 2))
    return !1;
  if (r) {
    const { selection: x, storedMarks: E } = n, { splittableMarks: T } = i.extensionManager, P = E || x.$to.parentOffset && x.$from.marks();
    if (e.split(a.pos, 2, w).scrollIntoView(), !P || !r)
      return !0;
    const u = P.filter((m) => T.includes(m.type.name));
    e.ensureMarks(u);
  }
  return !0;
}, Oo = (t, e) => {
  const n = Rl((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const i = t.doc.nodeAt(r);
  return n.node.type === i?.type && Tn(t.doc, n.pos) && t.join(n.pos), !0;
}, jo = (t, e) => {
  const n = Rl((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const i = t.doc.nodeAt(r);
  return n.node.type === i?.type && Tn(t.doc, r) && t.join(r), !0;
}, wy = (t, e, n, r = {}) => ({ editor: i, tr: s, state: o, dispatch: a, chain: l, commands: c, can: d }) => {
  const { extensions: f, splittableMarks: p } = i.extensionManager, g = qe(t, o.schema), y = qe(e, o.schema), { selection: w, storedMarks: x } = o, { $from: E, $to: T } = w, P = E.blockRange(T), u = x || w.$to.parentOffset && w.$from.marks();
  if (!P)
    return !1;
  const m = Rl((h) => pu(h.type.name, f))(w);
  if (P.depth >= 1 && m && P.depth - m.depth <= 1) {
    if (m.node.type === g)
      return c.liftListItem(y);
    if (pu(m.node.type.name, f) && g.validContent(m.node.content) && a)
      return l().command(() => (s.setNodeMarkup(m.pos, g), !0)).command(() => Oo(s, g)).command(() => jo(s, g)).run();
  }
  return !n || !u || !a ? l().command(() => d().wrapInList(g, r) ? !0 : c.clearNodes()).wrapInList(g, r).command(() => Oo(s, g)).command(() => jo(s, g)).run() : l().command(() => {
    const h = d().wrapInList(g, r), b = u.filter((v) => p.includes(v.type.name));
    return s.ensureMarks(b), h ? !0 : c.clearNodes();
  }).wrapInList(g, r).command(() => Oo(s, g)).command(() => jo(s, g)).run();
}, _y = (t, e = {}, n = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = n, o = jn(t, r.schema);
  return uy(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, ky = (t, e, n = {}) => ({ state: r, commands: i }) => {
  const s = qe(t, r.schema), o = qe(e, r.schema);
  return Pl(r, s, n) ? i.setNode(o) : i.setNode(s, n);
}, xy = (t, e = {}) => ({ state: n, commands: r }) => {
  const i = qe(t, n.schema);
  return Pl(n, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, Sy = () => ({ state: t, dispatch: e }) => {
  const n = t.plugins;
  for (let r = 0; r < n.length; r += 1) {
    const i = n[r];
    let s;
    if (i.spec.isInputRules && (s = i.getState(t))) {
      if (e) {
        const o = t.tr, a = s.transform;
        for (let l = a.steps.length - 1; l >= 0; l -= 1)
          o.step(a.steps[l].invert(a.docs[l]));
        if (s.text) {
          const l = o.doc.resolve(s.from).marks();
          o.replaceWith(s.from, s.to, t.schema.text(s.text, l));
        } else
          o.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, Cy = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, { empty: r, ranges: i } = n;
  return r || e && i.forEach((s) => {
    t.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Ey = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: a } = n, l = jn(t, r.schema), { $from: c, empty: d, ranges: f } = a;
  if (!i)
    return !0;
  if (d && o) {
    let { from: p, to: g } = a;
    const y = (s = c.marks().find((x) => x.type === l)) === null || s === void 0 ? void 0 : s.attrs, w = Tl(c, l, y);
    w && (p = w.from, g = w.to), n.removeMark(p, g, l);
  } else
    f.forEach((p) => {
      n.removeMark(p.$from.pos, p.$to.pos, l);
    });
  return n.removeStoredMark(l), !0;
}, My = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Nl(typeof t == "string" ? t : t.name, r.schema);
  return a ? (a === "node" && (s = qe(t, r.schema)), a === "mark" && (o = jn(t, r.schema)), i && n.selection.ranges.forEach((l) => {
    const c = l.$from.pos, d = l.$to.pos;
    r.doc.nodesBetween(c, d, (f, p) => {
      s && s === f.type && n.setNodeMarkup(p, void 0, {
        ...f.attrs,
        ...e
      }), o && f.marks.length && f.marks.forEach((g) => {
        if (o === g.type) {
          const y = Math.max(p, c), w = Math.min(p + f.nodeSize, d);
          n.addMark(y, w, o.create({
            ...g.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, Ay = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const i = qe(t, n.schema);
  return X0(i, e)(n, r);
}, Ty = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const i = qe(t, n.schema);
  return Q0(i, e)(n, r);
};
var Oy = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: f2,
  clearContent: p2,
  clearNodes: h2,
  command: m2,
  createParagraphNear: g2,
  cut: y2,
  deleteCurrentNode: b2,
  deleteNode: v2,
  deleteRange: w2,
  deleteSelection: _2,
  enter: k2,
  exitCode: x2,
  extendMarkRange: C2,
  first: E2,
  focus: A2,
  forEach: T2,
  insertContent: O2,
  insertContentAt: N2,
  joinUp: R2,
  joinDown: I2,
  joinBackward: L2,
  joinForward: z2,
  joinItemBackward: D2,
  joinItemForward: B2,
  keyboardShortcut: H2,
  lift: F2,
  liftEmptyBlock: W2,
  liftListItem: V2,
  newlineInCode: U2,
  resetAttributes: K2,
  scrollIntoView: q2,
  selectAll: G2,
  selectNodeBackward: J2,
  selectNodeForward: Y2,
  selectParentNode: X2,
  selectTextblockEnd: Q2,
  selectTextblockStart: Z2,
  setContent: ty,
  setMark: fy,
  setMeta: py,
  setNode: hy,
  setNodeSelection: my,
  setTextSelection: gy,
  sinkListItem: yy,
  splitBlock: by,
  splitListItem: vy,
  toggleList: wy,
  toggleMark: _y,
  toggleNode: ky,
  toggleWrap: xy,
  undoInputRule: Sy,
  unsetAllMarks: Cy,
  unsetMark: Ey,
  updateAttributes: My,
  wrapIn: Ay,
  wrapInList: Ty
});
Ge.create({
  name: "commands",
  addCommands() {
    return {
      ...Oy
    };
  }
});
Ge.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new et({
        key: new tt("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
Ge.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: t } = this;
    return [
      new et({
        key: new tt("focusEvents"),
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
Ge.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const t = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: d, $anchor: f } = l, { pos: p, parent: g } = f, y = f.parent.isTextblock ? a.doc.resolve(p - 1) : f, w = y.parent.type.spec.isolating, x = f.pos - f.parentOffset, E = w && y.parent.childCount === 1 ? x === f.pos : ie.atStart(c).from === p;
        return !d || !E || !g.type.isTextblock || g.textContent.length ? !1 : o.clearNodes();
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
    }, i = {
      ...r
    }, s = {
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
    return Ol() || jl() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new et({
        key: new tt("clearDocument"),
        appendTransaction: (t, e, n) => {
          if (!(t.some((y) => y.docChanged) && !e.doc.eq(n.doc)))
            return;
          const { empty: i, from: s, to: o } = e.selection, a = ie.atStart(e.doc).from, l = ie.atEnd(e.doc).to;
          if (i || !(s === a && o === l) || !(n.doc.textBetween(0, n.doc.content.size, " ", " ").length === 0))
            return;
          const f = n.tr, p = ap({
            state: n,
            transaction: f
          }), { commands: g } = new i2({
            editor: this.editor,
            state: p
          });
          if (g.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
});
Ge.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new et({
        key: new tt("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
function Zn(t) {
  return new _i({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const i = Se(t.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: s } = e, o = r[r.length - 1], a = r[0];
      if (o) {
        const l = a.search(/\S/), c = n.from + a.indexOf(o), d = c + o.length;
        if (Il(n.from, n.to, e.doc).filter((g) => g.mark.type.excluded.find((w) => w === t.type && w !== g.mark.type)).filter((g) => g.to > c).length)
          return null;
        d < n.to && s.delete(d, n.to), c > n.from && s.delete(n.from + l, c);
        const p = n.from + l + o.length;
        s.addMark(n.from + l, p, t.type.create(i || {})), s.removeStoredMark(t.type);
      }
    }
  });
}
function up(t) {
  return new _i({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const i = Se(t.getAttributes, void 0, r) || {}, { tr: s } = e, o = n.from;
      let a = n.to;
      const l = t.type.create(i);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let d = o + c;
        d > a ? d = a : a = d + r[1].length;
        const f = r[0][r[0].length - 1];
        s.insertText(f, o + r[0].length - 1), s.replaceWith(d, a, l);
      } else
        r[0] && s.insert(o - 1, t.type.create(i)).delete(s.mapping.map(o), s.mapping.map(a));
      s.scrollIntoView();
    }
  });
}
function wa(t) {
  return new _i({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const i = e.doc.resolve(n.from), s = Se(t.getAttributes, void 0, r) || {};
      if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), t.type))
        return null;
      e.tr.delete(n.from, n.to).setBlockType(n.from, n.from, t.type, s);
    }
  });
}
function Oe(t) {
  return new _i({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      let i = t.replace, s = n.from;
      const o = n.to;
      if (r[1]) {
        const a = r[0].lastIndexOf(r[1]);
        i += r[0].slice(a + r[1].length), s += a;
        const l = s - o;
        l > 0 && (i = r[0].slice(a - l, a) + i, s = o);
      }
      e.tr.insertText(i, s, o);
    }
  });
}
function pi(t) {
  return new _i({
    find: t.find,
    handler: ({ state: e, range: n, match: r, chain: i }) => {
      const s = Se(t.getAttributes, void 0, r) || {}, o = e.tr.delete(n.from, n.to), l = o.doc.resolve(n.from).blockRange(), c = l && bl(l, t.type, s);
      if (!c)
        return null;
      if (o.wrap(l, c), t.keepMarks && t.editor) {
        const { selection: f, storedMarks: p } = e, { splittableMarks: g } = t.editor.extensionManager, y = p || f.$to.parentOffset && f.$from.marks();
        if (y) {
          const w = y.filter((x) => g.includes(x.type.name));
          o.ensureMarks(w);
        }
      }
      if (t.keepAttributes) {
        const f = t.type.name === "bulletList" || t.type.name === "orderedList" ? "listItem" : "taskList";
        i().updateAttributes(f, s).run();
      }
      const d = o.doc.resolve(n.from - 1).nodeBefore;
      d && d.type === t.type && Tn(o.doc, n.from - 1) && (!t.joinPredicate || t.joinPredicate(r, d)) && o.join(n.from - 1);
    }
  });
}
class Ct {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Se(Pe(this, "addOptions", {
      name: this.name
    }))), this.storage = Se(Pe(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ct(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = so(this.options, e), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Ct(e);
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Pe(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  static handleExit({ editor: e, mark: n }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const o = i.marks();
      if (!!!o.find((c) => c?.type.name === n.name))
        return !1;
      const l = o.find((c) => c?.type.name === n.name);
      return l && r.removeStoredMark(l), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
class Ce {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = Se(Pe(this, "addOptions", {
      name: this.name
    }))), this.storage = Se(Pe(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ce(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = so(this.options, e), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Ce(e);
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Pe(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function Mn(t) {
  return new l2({
    find: t.find,
    handler: ({ state: e, range: n, match: r, pasteEvent: i }) => {
      const s = Se(t.getAttributes, void 0, r, i);
      if (s === !1 || s === null)
        return null;
      const { tr: o } = e, a = r[r.length - 1], l = r[0];
      let c = n.to;
      if (a) {
        const d = l.search(/\S/), f = n.from + l.indexOf(a), p = f + a.length;
        if (Il(n.from, n.to, e.doc).filter((y) => y.mark.type.excluded.find((x) => x === t.type && x !== y.mark.type)).filter((y) => y.to > f).length)
          return null;
        p < n.to && o.delete(p, n.to), f > n.from && o.delete(n.from + d, f), c = n.from + d + a.length, o.addMark(n.from + d, c, t.type.create(s || {})), o.removeStoredMark(t.type);
      }
    }
  });
}
function jy(t) {
  return t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
const Py = /^\s*>\s$/, Ny = Ce.create({
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
    return ["blockquote", ge(this.options.HTMLAttributes, t), 0];
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
      pi({
        find: Py,
        type: this.type
      })
    ];
  }
}), Ry = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/, Iy = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g, Ly = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/, zy = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g, Dy = Ct.create({
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
    return ["strong", ge(this.options.HTMLAttributes, t), 0];
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
      Zn({
        find: Ry,
        type: this.type
      }),
      Zn({
        find: Ly,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Mn({
        find: Iy,
        type: this.type
      }),
      Mn({
        find: zy,
        type: this.type
      })
    ];
  }
}), By = Ce.create({
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
    return ["li", ge(this.options.HTMLAttributes, t), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), mu = Ct.create({
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
    return ["span", ge(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: t, commands: e }) => {
        const n = ki(t, this.type);
        return Object.entries(n).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), gu = /^\s*([-+*])\s$/, $y = Ce.create({
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
    return ["ul", ge(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(By.name, this.editor.getAttributes(mu.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let t = pi({
      find: gu,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = pi({
      find: gu,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(mu.name),
      editor: this.editor
    })), [
      t
    ];
  }
}), Hy = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/, Fy = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g, Wy = Ct.create({
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
    return ["code", ge(this.options.HTMLAttributes, t), 0];
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
      Zn({
        find: Hy,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Mn({
        find: Fy,
        type: this.type
      })
    ];
  }
}), Vy = /^```([a-z]+)?[\s\n]$/, Uy = /^~~~([a-z]+)?[\s\n]$/, Ky = Ce.create({
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
          const { languageClassPrefix: n } = this.options, s = [...((e = t.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((o) => o.startsWith(n)).map((o) => o.replace(n, ""))[0];
          return s || null;
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
      ge(this.options.HTMLAttributes, e),
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
        const { state: e } = t, { selection: n } = e, { $from: r, empty: i } = n;
        if (!i || r.parent.type !== this.type)
          return !1;
        const s = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !s || !o ? !1 : t.chain().command(({ tr: a }) => (a.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: t }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = t, { selection: n, doc: r } = e, { $from: i, empty: s } = n;
        if (!s || i.parent.type !== this.type || !(i.parentOffset === i.parent.nodeSize - 2))
          return !1;
        const a = i.after();
        return a === void 0 || r.nodeAt(a) ? !1 : t.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      wa({
        find: Vy,
        type: this.type,
        getAttributes: (t) => ({
          language: t[1]
        })
      }),
      wa({
        find: Uy,
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
      new et({
        key: new tt("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (t, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const n = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), i = r ? JSON.parse(r) : void 0, s = i?.mode;
            if (!n || !s)
              return !1;
            const { tr: o } = t.state;
            return o.replaceSelectionWith(this.type.create({ language: s })), o.setSelection(re.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(n.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), t.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), qy = Ce.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function Gy(t = {}) {
  return new et({
    view(e) {
      return new Jy(e, t);
    }
  });
}
class Jy {
  constructor(e, n) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = n.width) !== null && r !== void 0 ? r : 1, this.color = n.color === !1 ? void 0 : n.color || "black", this.class = n.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((i) => {
      let s = (o) => {
        this[i](o);
      };
      return e.dom.addEventListener(i, s), { name: i, handler: s };
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
      let a = e.nodeBefore, l = e.nodeAfter;
      if (a || l) {
        let c = this.editorView.nodeDOM(this.cursorPos - (a ? a.nodeSize : 0));
        if (c) {
          let d = c.getBoundingClientRect(), f = a ? d.bottom : d.top;
          a && l && (f = (f + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), r = { left: d.left, right: d.right, top: f - this.width / 2, bottom: f + this.width / 2 };
        }
      }
    }
    if (!r) {
      let a = this.editorView.coordsAtPos(this.cursorPos);
      r = { left: a.left - this.width / 2, right: a.left + this.width / 2, top: a.top, bottom: a.bottom };
    }
    let i = this.editorView.dom.offsetParent;
    this.element || (this.element = i.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", n), this.element.classList.toggle("prosemirror-dropcursor-inline", !n);
    let s, o;
    if (!i || i == document.body && getComputedStyle(i).position == "static")
      s = -pageXOffset, o = -pageYOffset;
    else {
      let a = i.getBoundingClientRect();
      s = a.left - i.scrollLeft, o = a.top - i.scrollTop;
    }
    this.element.style.left = r.left - s + "px", this.element.style.top = r.top - o + "px", this.element.style.width = r.right - r.left + "px", this.element.style.height = r.bottom - r.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let n = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = n && n.inside >= 0 && this.editorView.state.doc.nodeAt(n.inside), i = r && r.type.spec.disableDropCursor, s = typeof i == "function" ? i(this.editorView, n, e) : i;
    if (n && !s) {
      let o = n.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let a = Sf(this.editorView.state.doc, o, this.editorView.dragging.slice);
        a != null && (o = a);
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
const Yy = Ge.create({
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
      Gy(this.options)
    ];
  }
});
class Ae extends ie {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    return Ae.valid(r) ? new Ae(r) : ie.near(r);
  }
  content() {
    return G.empty;
  }
  eq(e) {
    return e instanceof Ae && e.head == this.head;
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
    return new Ae(e.resolve(n.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new Ll(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let n = e.parent;
    if (n.isTextblock || !Xy(e) || !Qy(e))
      return !1;
    let r = n.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let i = n.contentMatchAt(e.index()).defaultType;
    return i && i.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, n, r = !1) {
    e:
      for (; ; ) {
        if (!r && Ae.valid(e))
          return e;
        let i = e.pos, s = null;
        for (let o = e.depth; ; o--) {
          let a = e.node(o);
          if (n > 0 ? e.indexAfter(o) < a.childCount : e.index(o) > 0) {
            s = a.child(n > 0 ? e.indexAfter(o) : e.index(o) - 1);
            break;
          } else if (o == 0)
            return null;
          i += n;
          let l = e.doc.resolve(i);
          if (Ae.valid(l))
            return l;
        }
        for (; ; ) {
          let o = n > 0 ? s.firstChild : s.lastChild;
          if (!o) {
            if (s.isAtom && !s.isText && !ee.isSelectable(s)) {
              e = e.doc.resolve(i + s.nodeSize * n), r = !1;
              continue e;
            }
            break;
          }
          s = o, i += n;
          let a = e.doc.resolve(i);
          if (Ae.valid(a))
            return a;
        }
        return null;
      }
  }
}
Ae.prototype.visible = !1;
Ae.findFrom = Ae.findGapCursorFrom;
ie.jsonID("gapcursor", Ae);
class Ll {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new Ll(e.map(this.pos));
  }
  resolve(e) {
    let n = e.resolve(this.pos);
    return Ae.valid(n) ? new Ae(n) : ie.near(n);
  }
}
function Xy(t) {
  for (let e = t.depth; e >= 0; e--) {
    let n = t.index(e), r = t.node(e);
    if (n == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(n - 1); ; i = i.lastChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Qy(t) {
  for (let e = t.depth; e >= 0; e--) {
    let n = t.indexAfter(e), r = t.node(e);
    if (n == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(n); ; i = i.firstChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Zy() {
  return new et({
    props: {
      decorations: rb,
      createSelectionBetween(t, e, n) {
        return e.pos == n.pos && Ae.valid(n) ? new Ae(n) : null;
      },
      handleClick: tb,
      handleKeyDown: eb,
      handleDOMEvents: { beforeinput: nb }
    }
  });
}
const eb = tp({
  ArrowLeft: Ri("horiz", -1),
  ArrowRight: Ri("horiz", 1),
  ArrowUp: Ri("vert", -1),
  ArrowDown: Ri("vert", 1)
});
function Ri(t, e) {
  const n = t == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, s) {
    let o = r.selection, a = e > 0 ? o.$to : o.$from, l = o.empty;
    if (o instanceof re) {
      if (!s.endOfTextblock(n) || a.depth == 0)
        return !1;
      l = !1, a = r.doc.resolve(e > 0 ? a.after() : a.before());
    }
    let c = Ae.findGapCursorFrom(a, e, l);
    return c ? (i && i(r.tr.setSelection(new Ae(c))), !0) : !1;
  };
}
function tb(t, e, n) {
  if (!t || !t.editable)
    return !1;
  let r = t.state.doc.resolve(e);
  if (!Ae.valid(r))
    return !1;
  let i = t.posAtCoords({ left: n.clientX, top: n.clientY });
  return i && i.inside > -1 && ee.isSelectable(t.state.doc.nodeAt(i.inside)) ? !1 : (t.dispatch(t.state.tr.setSelection(new Ae(r))), !0);
}
function nb(t, e) {
  if (e.inputType != "insertCompositionText" || !(t.state.selection instanceof Ae))
    return !1;
  let { $from: n } = t.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(t.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = H.empty;
  for (let o = r.length - 1; o >= 0; o--)
    i = H.from(r[o].createAndFill(null, i));
  let s = t.state.tr.replace(n.pos, n.pos, new G(i, 0, 0));
  return s.setSelection(re.near(s.doc.resolve(n.pos + 1))), t.dispatch(s), !1;
}
function rb(t) {
  if (!(t.selection instanceof Ae))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", xe.create(t.doc, [lt.widget(t.selection.head, e, { key: "gapcursor" })]);
}
const ib = Ge.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      Zy()
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
      allowGapCursor: (e = Se(Pe(t, "allowGapCursor", n))) !== null && e !== void 0 ? e : null
    };
  }
}), sb = Ce.create({
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
    return ["br", ge(this.options.HTMLAttributes, t)];
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
          const { selection: i, storedMarks: s } = n;
          if (i.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: a } = r.extensionManager, l = s || i.$to.parentOffset && i.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: d }) => {
            if (d && l && o) {
              const f = l.filter((p) => a.includes(p.type.name));
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
}), ob = Ce.create({
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
    return [`h${this.options.levels.includes(t.attrs.level) ? t.attrs.level : this.options.levels[0]}`, ge(this.options.HTMLAttributes, e), 0];
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
    return this.options.levels.map((t) => wa({
      find: new RegExp(`^(#{1,${t}})\\s$`),
      type: this.type,
      getAttributes: {
        level: t
      }
    }));
  }
});
var xs = 200, We = function() {
};
We.prototype.append = function(e) {
  return e.length ? (e = We.from(e), !this.length && e || e.length < xs && this.leafAppend(e) || this.length < xs && e.leafPrepend(this) || this.appendInner(e)) : this;
};
We.prototype.prepend = function(e) {
  return e.length ? We.from(e).append(this) : this;
};
We.prototype.appendInner = function(e) {
  return new ab(this, e);
};
We.prototype.slice = function(e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = this.length), e >= n ? We.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, n));
};
We.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
We.prototype.forEach = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length), n <= r ? this.forEachInner(e, n, r, 0) : this.forEachInvertedInner(e, n, r, 0);
};
We.prototype.map = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(s, o) {
    return i.push(e(s, o));
  }, n, r), i;
};
We.from = function(e) {
  return e instanceof We ? e : e && e.length ? new dp(e) : We.empty;
};
var dp = /* @__PURE__ */ function(t) {
  function e(r) {
    t.call(this), this.values = r;
  }
  t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
  var n = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, s) {
    return i == 0 && s == this.length ? this : new e(this.values.slice(i, s));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, s, o, a) {
    for (var l = s; l < o; l++)
      if (i(this.values[l], a + l) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, s, o, a) {
    for (var l = s - 1; l >= o; l--)
      if (i(this.values[l], a + l) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= xs)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= xs)
      return new e(i.flatten().concat(this.values));
  }, n.length.get = function() {
    return this.values.length;
  }, n.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, n), e;
}(We);
We.empty = new dp([]);
var ab = /* @__PURE__ */ function(t) {
  function e(n, r) {
    t.call(this), this.left = n, this.right = r, this.length = n.length + r.length, this.depth = Math.max(n.depth, r.depth) + 1;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, s, o) {
    var a = this.left.length;
    if (i < a && this.left.forEachInner(r, i, Math.min(s, a), o) === !1 || s > a && this.right.forEachInner(r, Math.max(i - a, 0), Math.min(this.length, s) - a, o + a) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, s, o) {
    var a = this.left.length;
    if (i > a && this.right.forEachInvertedInner(r, i - a, Math.max(s, a) - a, o + a) === !1 || s < a && this.left.forEachInvertedInner(r, Math.min(i, a), s, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var s = this.left.length;
    return i <= s ? this.left.slice(r, i) : r >= s ? this.right.slice(r - s, i - s) : this.left.slice(r, s).append(this.right.slice(0, i - s));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(We);
const lb = 500;
class Tt {
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
    let i, s;
    n && (i = this.remapping(r, this.items.length), s = i.maps.length);
    let o = e.tr, a, l, c = [], d = [];
    return this.items.forEach((f, p) => {
      if (!f.step) {
        i || (i = this.remapping(r, p + 1), s = i.maps.length), s--, d.push(f);
        return;
      }
      if (i) {
        d.push(new Bt(f.map));
        let g = f.step.map(i.slice(s)), y;
        g && o.maybeStep(g).doc && (y = o.mapping.maps[o.mapping.maps.length - 1], c.push(new Bt(y, void 0, void 0, c.length + d.length))), s--, y && i.appendMap(y, s);
      } else
        o.maybeStep(f.step);
      if (f.selection)
        return a = i ? f.selection.map(i.slice(s)) : f.selection, l = new Tt(this.items.slice(0, r).append(d.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: l, transform: o, selection: a };
  }
  // Create a new branch with the given transform added.
  addTransform(e, n, r, i) {
    let s = [], o = this.eventCount, a = this.items, l = !i && a.length ? a.get(a.length - 1) : null;
    for (let d = 0; d < e.steps.length; d++) {
      let f = e.steps[d].invert(e.docs[d]), p = new Bt(e.mapping.maps[d], f, n), g;
      (g = l && l.merge(p)) && (p = g, d ? s.pop() : a = a.slice(0, a.length - 1)), s.push(p), n && (o++, n = void 0), i || (l = p);
    }
    let c = o - r.depth;
    return c > ub && (a = cb(a, c), o -= c), new Tt(a.append(s), o);
  }
  remapping(e, n) {
    let r = new Sr();
    return this.items.forEach((i, s) => {
      let o = i.mirrorOffset != null && s - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, o);
    }, e, n), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Tt(this.items.append(e.map((n) => new Bt(n))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, n) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - n), s = e.mapping, o = e.steps.length, a = this.eventCount;
    this.items.forEach((p) => {
      p.selection && a--;
    }, i);
    let l = n;
    this.items.forEach((p) => {
      let g = s.getMirror(--l);
      if (g == null)
        return;
      o = Math.min(o, g);
      let y = s.maps[g];
      if (p.step) {
        let w = e.steps[g].invert(e.docs[g]), x = p.selection && p.selection.map(s.slice(l + 1, g));
        x && a++, r.push(new Bt(y, w, x));
      } else
        r.push(new Bt(y));
    }, i);
    let c = [];
    for (let p = n; p < o; p++)
      c.push(new Bt(s.maps[p]));
    let d = this.items.slice(0, i).append(c).append(r), f = new Tt(d, a);
    return f.emptyItemCount() > lb && (f = f.compress(this.items.length - r.length)), f;
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
    let n = this.remapping(0, e), r = n.maps.length, i = [], s = 0;
    return this.items.forEach((o, a) => {
      if (a >= e)
        i.push(o), o.selection && s++;
      else if (o.step) {
        let l = o.step.map(n.slice(r)), c = l && l.getMap();
        if (r--, c && n.appendMap(c, r), l) {
          let d = o.selection && o.selection.map(n.slice(r));
          d && s++;
          let f = new Bt(c.invert(), l, d), p, g = i.length - 1;
          (p = i.length && i[g].merge(f)) ? i[g] = p : i.push(f);
        }
      } else
        o.map && r--;
    }, this.items.length, 0), new Tt(We.from(i.reverse()), s);
  }
}
Tt.empty = new Tt(We.empty, 0);
function cb(t, e) {
  let n;
  return t.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return n = i, !1;
  }), t.slice(n);
}
class Bt {
  constructor(e, n, r, i) {
    this.map = e, this.step = n, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let n = e.step.merge(this.step);
      if (n)
        return new Bt(n.getMap().invert(), n, this.selection);
    }
  }
}
class fn {
  constructor(e, n, r, i, s) {
    this.done = e, this.undone = n, this.prevRanges = r, this.prevTime = i, this.prevComposition = s;
  }
}
const ub = 20;
function db(t, e, n, r) {
  let i = n.getMeta(xn), s;
  if (i)
    return i.historyState;
  n.getMeta(pb) && (t = new fn(t.done, t.undone, null, 0, -1));
  let o = n.getMeta("appendedTransaction");
  if (n.steps.length == 0)
    return t;
  if (o && o.getMeta(xn))
    return o.getMeta(xn).redo ? new fn(t.done.addTransform(n, void 0, r, Xi(e)), t.undone, yu(n.mapping.maps[n.steps.length - 1]), t.prevTime, t.prevComposition) : new fn(t.done, t.undone.addTransform(n, void 0, r, Xi(e)), null, t.prevTime, t.prevComposition);
  if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let a = n.getMeta("composition"), l = t.prevTime == 0 || !o && t.prevComposition != a && (t.prevTime < (n.time || 0) - r.newGroupDelay || !fb(n, t.prevRanges)), c = o ? Po(t.prevRanges, n.mapping) : yu(n.mapping.maps[n.steps.length - 1]);
    return new fn(t.done.addTransform(n, l ? e.selection.getBookmark() : void 0, r, Xi(e)), Tt.empty, c, n.time, a ?? t.prevComposition);
  } else
    return (s = n.getMeta("rebased")) ? new fn(t.done.rebased(n, s), t.undone.rebased(n, s), Po(t.prevRanges, n.mapping), t.prevTime, t.prevComposition) : new fn(t.done.addMaps(n.mapping.maps), t.undone.addMaps(n.mapping.maps), Po(t.prevRanges, n.mapping), t.prevTime, t.prevComposition);
}
function fb(t, e) {
  if (!e)
    return !1;
  if (!t.docChanged)
    return !0;
  let n = !1;
  return t.mapping.maps[0].forEach((r, i) => {
    for (let s = 0; s < e.length; s += 2)
      r <= e[s + 1] && i >= e[s] && (n = !0);
  }), n;
}
function yu(t) {
  let e = [];
  return t.forEach((n, r, i, s) => e.push(i, s)), e;
}
function Po(t, e) {
  if (!t)
    return null;
  let n = [];
  for (let r = 0; r < t.length; r += 2) {
    let i = e.map(t[r], 1), s = e.map(t[r + 1], -1);
    i <= s && n.push(i, s);
  }
  return n;
}
function fp(t, e, n, r) {
  let i = Xi(e), s = xn.get(e).spec.config, o = (r ? t.undone : t.done).popEvent(e, i);
  if (!o)
    return;
  let a = o.selection.resolve(o.transform.doc), l = (r ? t.done : t.undone).addTransform(o.transform, e.selection.getBookmark(), s, i), c = new fn(r ? l : o.remaining, r ? o.remaining : l, null, 0, -1);
  n(o.transform.setSelection(a).setMeta(xn, { redo: r, historyState: c }).scrollIntoView());
}
let No = !1, bu = null;
function Xi(t) {
  let e = t.plugins;
  if (bu != e) {
    No = !1, bu = e;
    for (let n = 0; n < e.length; n++)
      if (e[n].spec.historyPreserveItems) {
        No = !0;
        break;
      }
  }
  return No;
}
const xn = new tt("history"), pb = new tt("closeHistory");
function hb(t = {}) {
  return t = {
    depth: t.depth || 100,
    newGroupDelay: t.newGroupDelay || 500
  }, new et({
    key: xn,
    state: {
      init() {
        return new fn(Tt.empty, Tt.empty, null, 0, -1);
      },
      apply(e, n, r) {
        return db(n, r, e, t);
      }
    },
    config: t,
    props: {
      handleDOMEvents: {
        beforeinput(e, n) {
          let r = n.inputType, i = r == "historyUndo" ? pp : r == "historyRedo" ? hp : null;
          return i ? (n.preventDefault(), i(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const pp = (t, e) => {
  let n = xn.getState(t);
  return !n || n.done.eventCount == 0 ? !1 : (e && fp(n, t, e, !1), !0);
}, hp = (t, e) => {
  let n = xn.getState(t);
  return !n || n.undone.eventCount == 0 ? !1 : (e && fp(n, t, e, !0), !0);
}, mb = Ge.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: t, dispatch: e }) => pp(t, e),
      redo: () => ({ state: t, dispatch: e }) => hp(t, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      hb(this.options)
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Mod-Z": () => this.editor.commands.undo(),
      "Mod-y": () => this.editor.commands.redo(),
      "Mod-Y": () => this.editor.commands.redo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Shift-Mod-Z": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
}), gb = Ce.create({
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
    return ["hr", ge(this.options.HTMLAttributes, t)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: t, state: e }) => {
        const { $to: n } = e.selection, r = t();
        return n.parentOffset === 0 ? r.insertContentAt(Math.max(n.pos - 2, 0), { type: this.name }) : r.insertContent({ type: this.name }), r.command(({ tr: i, dispatch: s }) => {
          var o;
          if (s) {
            const { $to: a } = i.selection, l = a.end();
            if (a.nodeAfter)
              a.nodeAfter.isTextblock ? i.setSelection(re.create(i.doc, a.pos + 1)) : a.nodeAfter.isBlock ? i.setSelection(ee.create(i.doc, a.pos)) : i.setSelection(re.create(i.doc, a.pos));
            else {
              const c = (o = a.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (i.insert(l, c), i.setSelection(re.create(i.doc, l + 1)));
            }
            i.scrollIntoView();
          }
          return !0;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      up({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), yb = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/, bb = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g, vb = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/, wb = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g, _b = Ct.create({
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
    return ["em", ge(this.options.HTMLAttributes, t), 0];
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
      Zn({
        find: yb,
        type: this.type
      }),
      Zn({
        find: vb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Mn({
        find: bb,
        type: this.type
      }),
      Mn({
        find: wb,
        type: this.type
      })
    ];
  }
}), kb = Ce.create({
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
    return ["li", ge(this.options.HTMLAttributes, t), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), xb = Ce.create({
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
    return ["li", ge(this.options.HTMLAttributes, t), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), vu = Ct.create({
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
    return ["span", ge(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: t, commands: e }) => {
        const n = ki(t, this.type);
        return Object.entries(n).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), wu = /^(\d+)\.\s$/, Sb = Ce.create({
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
    return e === 1 ? ["ol", ge(this.options.HTMLAttributes, n), 0] : ["ol", ge(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(xb.name, this.editor.getAttributes(vu.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let t = pi({
      find: wu,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = pi({
      find: wu,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(vu.name) }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1],
      editor: this.editor
    })), [
      t
    ];
  }
}), Cb = Ce.create({
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
    return ["p", ge(this.options.HTMLAttributes, t), 0];
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
}), Eb = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/, Mb = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g, Ab = Ct.create({
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
    return ["s", ge(this.options.HTMLAttributes, t), 0];
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
    return jl() ? t["Mod-Shift-s"] = () => this.editor.commands.toggleStrike() : t["Ctrl-Shift-s"] = () => this.editor.commands.toggleStrike(), t;
  },
  addInputRules() {
    return [
      Zn({
        find: Eb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Mn({
        find: Mb,
        type: this.type
      })
    ];
  }
}), Tb = Ce.create({
  name: "text",
  group: "inline"
});
Ge.create({
  name: "starterKit",
  addExtensions() {
    var t, e, n, r, i, s, o, a, l, c, d, f, p, g, y, w, x, E;
    const T = [];
    return this.options.blockquote !== !1 && T.push(Ny.configure((t = this.options) === null || t === void 0 ? void 0 : t.blockquote)), this.options.bold !== !1 && T.push(Dy.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && T.push($y.configure((n = this.options) === null || n === void 0 ? void 0 : n.bulletList)), this.options.code !== !1 && T.push(Wy.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && T.push(Ky.configure((i = this.options) === null || i === void 0 ? void 0 : i.codeBlock)), this.options.document !== !1 && T.push(qy.configure((s = this.options) === null || s === void 0 ? void 0 : s.document)), this.options.dropcursor !== !1 && T.push(Yy.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && T.push(ib.configure((a = this.options) === null || a === void 0 ? void 0 : a.gapcursor)), this.options.hardBreak !== !1 && T.push(sb.configure((l = this.options) === null || l === void 0 ? void 0 : l.hardBreak)), this.options.heading !== !1 && T.push(ob.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && T.push(mb.configure((d = this.options) === null || d === void 0 ? void 0 : d.history)), this.options.horizontalRule !== !1 && T.push(gb.configure((f = this.options) === null || f === void 0 ? void 0 : f.horizontalRule)), this.options.italic !== !1 && T.push(_b.configure((p = this.options) === null || p === void 0 ? void 0 : p.italic)), this.options.listItem !== !1 && T.push(kb.configure((g = this.options) === null || g === void 0 ? void 0 : g.listItem)), this.options.orderedList !== !1 && T.push(Sb.configure((y = this.options) === null || y === void 0 ? void 0 : y.orderedList)), this.options.paragraph !== !1 && T.push(Cb.configure((w = this.options) === null || w === void 0 ? void 0 : w.paragraph)), this.options.strike !== !1 && T.push(Ab.configure((x = this.options) === null || x === void 0 ? void 0 : x.strike)), this.options.text !== !1 && T.push(Tb.configure((E = this.options) === null || E === void 0 ? void 0 : E.text)), T;
  }
});
Ge.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      placeholder: "Write something …",
      showOnlyWhenEditable: !0,
      showOnlyCurrent: !0,
      includeChildren: !1
    };
  },
  addProseMirrorPlugins() {
    return [
      new et({
        key: new tt("placeholder"),
        props: {
          decorations: ({ doc: t, selection: e }) => {
            const n = this.editor.isEditable || !this.options.showOnlyWhenEditable, { anchor: r } = e, i = [];
            if (!n)
              return null;
            const s = t.type.createAndFill(), o = s?.sameMarkup(t) && s.content.findDiffStart(t.content) === null;
            return t.descendants((a, l) => {
              const c = r >= l && r <= l + a.nodeSize, d = !a.isLeaf && !a.childCount;
              if ((c || !this.options.showOnlyCurrent) && d) {
                const f = [this.options.emptyNodeClass];
                o && f.push(this.options.emptyEditorClass);
                const p = lt.node(l, l + a.nodeSize, {
                  class: f.join(" "),
                  "data-placeholder": typeof this.options.placeholder == "function" ? this.options.placeholder({
                    editor: this.editor,
                    node: a,
                    pos: l,
                    hasAnchor: c
                  }) : this.options.placeholder
                });
                i.push(p);
              }
              return this.options.includeChildren;
            }), xe.create(t, i);
          }
        }
      })
    ];
  }
});
Ge.create({
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
var _a, ka;
if (typeof WeakMap < "u") {
  let t = /* @__PURE__ */ new WeakMap();
  _a = (e) => t.get(e), ka = (e, n) => (t.set(e, n), n);
} else {
  const t = [];
  let n = 0;
  _a = (r) => {
    for (let i = 0; i < t.length; i += 2)
      if (t[i] == r)
        return t[i + 1];
  }, ka = (r, i) => (n == 10 && (n = 0), t[n++] = r, t[n++] = i);
}
var Te = class {
  constructor(t, e, n, r) {
    this.width = t, this.height = e, this.map = n, this.problems = r;
  }
  // Find the dimensions of the cell at the given position.
  findCell(t) {
    for (let e = 0; e < this.map.length; e++) {
      const n = this.map[e];
      if (n != t)
        continue;
      const r = e % this.width, i = e / this.width | 0;
      let s = r + 1, o = i + 1;
      for (let a = 1; s < this.width && this.map[e + a] == n; a++)
        s++;
      for (let a = 1; o < this.height && this.map[e + this.width * a] == n; a++)
        o++;
      return { left: r, top: i, right: s, bottom: o };
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
    const { left: r, right: i, top: s, bottom: o } = this.findCell(t);
    return e == "horiz" ? (n < 0 ? r == 0 : i == this.width) ? null : this.map[s * this.width + (n < 0 ? r - 1 : i)] : (n < 0 ? s == 0 : o == this.height) ? null : this.map[r + this.width * (n < 0 ? s - 1 : o)];
  }
  // Get the rectangle spanning the two given cells.
  rectBetween(t, e) {
    const {
      left: n,
      right: r,
      top: i,
      bottom: s
    } = this.findCell(t), {
      left: o,
      right: a,
      top: l,
      bottom: c
    } = this.findCell(e);
    return {
      left: Math.min(n, o),
      top: Math.min(i, l),
      right: Math.max(r, a),
      bottom: Math.max(s, c)
    };
  }
  // Return the position of all cells that have the top left corner in
  // the given rectangle.
  cellsInRect(t) {
    const e = [], n = {};
    for (let r = t.top; r < t.bottom; r++)
      for (let i = t.left; i < t.right; i++) {
        const s = r * this.width + i, o = this.map[s];
        n[o] || (n[o] = !0, !(i == t.left && i && this.map[s - 1] == o || r == t.top && r && this.map[s - this.width] == o) && e.push(o));
      }
    return e;
  }
  // Return the position at which the cell at the given row and column
  // starts, or would start, if a cell started there.
  positionAt(t, e, n) {
    for (let r = 0, i = 0; ; r++) {
      const s = i + n.child(r).nodeSize;
      if (r == t) {
        let o = e + t * this.width;
        const a = (t + 1) * this.width;
        for (; o < a && this.map[o] < i; )
          o++;
        return o == a ? s - 1 : this.map[o];
      }
      i = s;
    }
  }
  // Find the table map for the given table node.
  static get(t) {
    return _a(t) || ka(t, Ob(t));
  }
};
function Ob(t) {
  if (t.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + t.type.name);
  const e = jb(t), n = t.childCount, r = [];
  let i = 0, s = null;
  const o = [];
  for (let c = 0, d = e * n; c < d; c++)
    r[c] = 0;
  for (let c = 0, d = 0; c < n; c++) {
    const f = t.child(c);
    d++;
    for (let y = 0; ; y++) {
      for (; i < r.length && r[i] != 0; )
        i++;
      if (y == f.childCount)
        break;
      const w = f.child(y), { colspan: x, rowspan: E, colwidth: T } = w.attrs;
      for (let P = 0; P < E; P++) {
        if (P + c >= n) {
          (s || (s = [])).push({
            type: "overlong_rowspan",
            pos: d,
            n: E - P
          });
          break;
        }
        const u = i + P * e;
        for (let m = 0; m < x; m++) {
          r[u + m] == 0 ? r[u + m] = d : (s || (s = [])).push({
            type: "collision",
            row: c,
            pos: d,
            n: x - m
          });
          const h = T && T[m];
          if (h) {
            const b = (u + m) % e * 2, v = o[b];
            v == null || v != h && o[b + 1] == 1 ? (o[b] = h, o[b + 1] = 1) : v == h && o[b + 1]++;
          }
        }
      }
      i += x, d += w.nodeSize;
    }
    const p = (c + 1) * e;
    let g = 0;
    for (; i < p; )
      r[i++] == 0 && g++;
    g && (s || (s = [])).push({ type: "missing", row: c, n: g }), d++;
  }
  const a = new Te(e, n, r, s);
  let l = !1;
  for (let c = 0; !l && c < o.length; c += 2)
    o[c] != null && o[c + 1] < n && (l = !0);
  return l && Pb(a, o, t), a;
}
function jb(t) {
  let e = -1, n = !1;
  for (let r = 0; r < t.childCount; r++) {
    const i = t.child(r);
    let s = 0;
    if (n)
      for (let o = 0; o < r; o++) {
        const a = t.child(o);
        for (let l = 0; l < a.childCount; l++) {
          const c = a.child(l);
          o + c.attrs.rowspan > r && (s += c.attrs.colspan);
        }
      }
    for (let o = 0; o < i.childCount; o++) {
      const a = i.child(o);
      s += a.attrs.colspan, a.attrs.rowspan > 1 && (n = !0);
    }
    e == -1 ? e = s : e != s && (e = Math.max(e, s));
  }
  return e;
}
function Pb(t, e, n) {
  t.problems || (t.problems = []);
  const r = {};
  for (let i = 0; i < t.map.length; i++) {
    const s = t.map[i];
    if (r[s])
      continue;
    r[s] = !0;
    const o = n.nodeAt(s);
    if (!o)
      throw new RangeError(`No cell with offset ${s} found`);
    let a = null;
    const l = o.attrs;
    for (let c = 0; c < l.colspan; c++) {
      const d = (i + c) % t.width, f = e[d * 2];
      f != null && (!l.colwidth || l.colwidth[c] != f) && ((a || (a = Nb(l)))[c] = f);
    }
    a && t.problems.unshift({
      type: "colwidth mismatch",
      pos: s,
      colwidth: a
    });
  }
}
function Nb(t) {
  if (t.colwidth)
    return t.colwidth.slice();
  const e = [];
  for (let n = 0; n < t.colspan; n++)
    e.push(0);
  return e;
}
function Ze(t) {
  let e = t.cached.tableNodeTypes;
  if (!e) {
    e = t.cached.tableNodeTypes = {};
    for (const n in t.nodes) {
      const r = t.nodes[n], i = r.spec.tableRole;
      i && (e[i] = r);
    }
  }
  return e;
}
var hn = new tt("selectingCells");
function Br(t) {
  for (let e = t.depth - 1; e > 0; e--)
    if (t.node(e).type.spec.tableRole == "row")
      return t.node(0).resolve(t.before(e + 1));
  return null;
}
function Rb(t) {
  for (let e = t.depth; e > 0; e--) {
    const n = t.node(e).type.spec.tableRole;
    if (n === "cell" || n === "header_cell")
      return t.node(e);
  }
  return null;
}
function It(t) {
  const e = t.selection.$head;
  for (let n = e.depth; n > 0; n--)
    if (e.node(n).type.spec.tableRole == "row")
      return !0;
  return !1;
}
function oo(t) {
  const e = t.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const n = Br(e.$head) || Ib(e.$head);
  if (n)
    return n;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function Ib(t) {
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
function xa(t) {
  return t.parent.type.spec.tableRole == "row" && !!t.nodeAfter;
}
function Lb(t) {
  return t.node(0).resolve(t.pos + t.nodeAfter.nodeSize);
}
function zl(t, e) {
  return t.depth == e.depth && t.pos >= e.start(-1) && t.pos <= e.end(-1);
}
function mp(t, e, n) {
  const r = t.node(-1), i = Te.get(r), s = t.start(-1), o = i.nextCell(t.pos - s, e, n);
  return o == null ? null : t.node(0).resolve(s + o);
}
function er(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan - n };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, n), r.colwidth.some((i) => i > 0) || (r.colwidth = null)), r;
}
function gp(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan + n };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let i = 0; i < n; i++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function zb(t, e, n) {
  const r = Ze(e.type.schema).header_cell;
  for (let i = 0; i < t.height; i++)
    if (e.nodeAt(t.map[n + i * t.width]).type != r)
      return !1;
  return !0;
}
var ue = class extends ie {
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  constructor(t, e = t) {
    const n = t.node(-1), r = Te.get(n), i = t.start(-1), s = r.rectBetween(
      t.pos - i,
      e.pos - i
    ), o = t.node(0), a = r.cellsInRect(s).filter((c) => c != e.pos - i);
    a.unshift(e.pos - i);
    const l = a.map((c) => {
      const d = n.nodeAt(c);
      if (!d)
        throw RangeError(`No cell with offset ${c} found`);
      const f = i + c + 1;
      return new Of(
        o.resolve(f),
        o.resolve(f + d.content.size)
      );
    });
    super(l[0].$from, l[0].$to, l), this.$anchorCell = t, this.$headCell = e;
  }
  map(t, e) {
    const n = t.resolve(e.map(this.$anchorCell.pos)), r = t.resolve(e.map(this.$headCell.pos));
    if (xa(n) && xa(r) && zl(n, r)) {
      const i = this.$anchorCell.node(-1) != n.node(-1);
      return i && this.isRowSelection() ? ue.rowSelection(n, r) : i && this.isColSelection() ? ue.colSelection(n, r) : new ue(n, r);
    }
    return re.between(n, r);
  }
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  content() {
    const t = this.$anchorCell.node(-1), e = Te.get(t), n = this.$anchorCell.start(-1), r = e.rectBetween(
      this.$anchorCell.pos - n,
      this.$headCell.pos - n
    ), i = {}, s = [];
    for (let a = r.top; a < r.bottom; a++) {
      const l = [];
      for (let c = a * e.width + r.left, d = r.left; d < r.right; d++, c++) {
        const f = e.map[c];
        if (i[f])
          continue;
        i[f] = !0;
        const p = e.findCell(f);
        let g = t.nodeAt(f);
        if (!g)
          throw RangeError(`No cell with offset ${f} found`);
        const y = r.left - p.left, w = p.right - r.right;
        if (y > 0 || w > 0) {
          let x = g.attrs;
          if (y > 0 && (x = er(x, 0, y)), w > 0 && (x = er(
            x,
            x.colspan - w,
            w
          )), p.left < r.left) {
            if (g = g.type.createAndFill(x), !g)
              throw RangeError(
                `Could not create cell with attrs ${JSON.stringify(x)}`
              );
          } else
            g = g.type.create(x, g.content);
        }
        if (p.top < r.top || p.bottom > r.bottom) {
          const x = {
            ...g.attrs,
            rowspan: Math.min(p.bottom, r.bottom) - Math.max(p.top, r.top)
          };
          p.top < r.top ? g = g.type.createAndFill(x) : g = g.type.create(x, g.content);
        }
        l.push(g);
      }
      s.push(t.child(a).copy(H.from(l)));
    }
    const o = this.isColSelection() && this.isRowSelection() ? t : s;
    return new G(H.from(o), 1, 1);
  }
  replace(t, e = G.empty) {
    const n = t.steps.length, r = this.ranges;
    for (let s = 0; s < r.length; s++) {
      const { $from: o, $to: a } = r[s], l = t.mapping.slice(n);
      t.replace(
        l.map(o.pos),
        l.map(a.pos),
        s ? G.empty : e
      );
    }
    const i = ie.findFrom(
      t.doc.resolve(t.mapping.slice(n).map(this.to)),
      -1
    );
    i && t.setSelection(i);
  }
  replaceWith(t, e) {
    this.replace(t, new G(H.from(e), 0, 0));
  }
  forEachCell(t) {
    const e = this.$anchorCell.node(-1), n = Te.get(e), r = this.$anchorCell.start(-1), i = n.cellsInRect(
      n.rectBetween(
        this.$anchorCell.pos - r,
        this.$headCell.pos - r
      )
    );
    for (let s = 0; s < i.length; s++)
      t(e.nodeAt(i[s]), r + i[s]);
  }
  // True if this selection goes all the way from the top to the
  // bottom of the table.
  isColSelection() {
    const t = this.$anchorCell.index(-1), e = this.$headCell.index(-1);
    if (Math.min(t, e) > 0)
      return !1;
    const n = t + this.$anchorCell.nodeAfter.attrs.rowspan, r = e + this.$headCell.nodeAfter.attrs.rowspan;
    return Math.max(n, r) == this.$headCell.node(-1).childCount;
  }
  // Returns the smallest column selection that covers the given anchor
  // and head cell.
  static colSelection(t, e = t) {
    const n = t.node(-1), r = Te.get(n), i = t.start(-1), s = r.findCell(t.pos - i), o = r.findCell(e.pos - i), a = t.node(0);
    return s.top <= o.top ? (s.top > 0 && (t = a.resolve(i + r.map[s.left])), o.bottom < r.height && (e = a.resolve(
      i + r.map[r.width * (r.height - 1) + o.right - 1]
    ))) : (o.top > 0 && (e = a.resolve(i + r.map[o.left])), s.bottom < r.height && (t = a.resolve(
      i + r.map[r.width * (r.height - 1) + s.right - 1]
    ))), new ue(t, e);
  }
  // True if this selection goes all the way from the left to the
  // right of the table.
  isRowSelection() {
    const t = this.$anchorCell.node(-1), e = Te.get(t), n = this.$anchorCell.start(-1), r = e.colCount(this.$anchorCell.pos - n), i = e.colCount(this.$headCell.pos - n);
    if (Math.min(r, i) > 0)
      return !1;
    const s = r + this.$anchorCell.nodeAfter.attrs.colspan, o = i + this.$headCell.nodeAfter.attrs.colspan;
    return Math.max(s, o) == e.width;
  }
  eq(t) {
    return t instanceof ue && t.$anchorCell.pos == this.$anchorCell.pos && t.$headCell.pos == this.$headCell.pos;
  }
  // Returns the smallest row selection that covers the given anchor
  // and head cell.
  static rowSelection(t, e = t) {
    const n = t.node(-1), r = Te.get(n), i = t.start(-1), s = r.findCell(t.pos - i), o = r.findCell(e.pos - i), a = t.node(0);
    return s.left <= o.left ? (s.left > 0 && (t = a.resolve(
      i + r.map[s.top * r.width]
    )), o.right < r.width && (e = a.resolve(
      i + r.map[r.width * (o.top + 1) - 1]
    ))) : (o.left > 0 && (e = a.resolve(i + r.map[o.top * r.width])), s.right < r.width && (t = a.resolve(
      i + r.map[r.width * (s.top + 1) - 1]
    ))), new ue(t, e);
  }
  toJSON() {
    return {
      type: "cell",
      anchor: this.$anchorCell.pos,
      head: this.$headCell.pos
    };
  }
  static fromJSON(t, e) {
    return new ue(t.resolve(e.anchor), t.resolve(e.head));
  }
  static create(t, e, n = e) {
    return new ue(t.resolve(e), t.resolve(n));
  }
  getBookmark() {
    return new yp(this.$anchorCell.pos, this.$headCell.pos);
  }
};
ue.prototype.visible = !1;
ie.jsonID("cell", ue);
var yp = class {
  constructor(t, e) {
    this.anchor = t, this.head = e;
  }
  map(t) {
    return new yp(t.map(this.anchor), t.map(this.head));
  }
  resolve(t) {
    const e = t.resolve(this.anchor), n = t.resolve(this.head);
    return e.parent.type.spec.tableRole == "row" && n.parent.type.spec.tableRole == "row" && e.index() < e.parent.childCount && n.index() < n.parent.childCount && zl(e, n) ? new ue(e, n) : ie.near(n, 1);
  }
};
function Db(t) {
  if (!(t.selection instanceof ue))
    return null;
  const e = [];
  return t.selection.forEachCell((n, r) => {
    e.push(
      lt.node(r, r + n.nodeSize, { class: "selectedCell" })
    );
  }), xe.create(t.doc, e);
}
function Bb({ $from: t, $to: e }) {
  if (t.pos == e.pos || t.pos < t.pos - 6)
    return !1;
  let n = t.pos, r = e.pos, i = t.depth;
  for (; i >= 0 && !(t.after(i + 1) < t.end(i)); i--, n++)
    ;
  for (let s = e.depth; s >= 0 && !(e.before(s + 1) > e.start(s)); s--, r--)
    ;
  return n == r && /row|table/.test(t.node(i).type.spec.tableRole);
}
function $b({ $from: t, $to: e }) {
  let n, r;
  for (let i = t.depth; i > 0; i--) {
    const s = t.node(i);
    if (s.type.spec.tableRole === "cell" || s.type.spec.tableRole === "header_cell") {
      n = s;
      break;
    }
  }
  for (let i = e.depth; i > 0; i--) {
    const s = e.node(i);
    if (s.type.spec.tableRole === "cell" || s.type.spec.tableRole === "header_cell") {
      r = s;
      break;
    }
  }
  return n !== r && e.parentOffset === 0;
}
function Hb(t, e, n) {
  const r = (e || t).selection, i = (e || t).doc;
  let s, o;
  if (r instanceof ee && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      s = ue.create(i, r.from);
    else if (o == "row") {
      const a = i.resolve(r.from + 1);
      s = ue.rowSelection(a, a);
    } else if (!n) {
      const a = Te.get(r.node), l = r.from + 1, c = l + a.map[a.width * a.height - 1];
      s = ue.create(i, l + 1, c);
    }
  } else
    r instanceof re && Bb(r) ? s = re.create(i, r.from) : r instanceof re && $b(r) && (s = re.create(i, r.$from.start(), r.$from.end()));
  return s && (e || (e = t.tr)).setSelection(s), e;
}
var Fb = new tt("fix-tables");
function bp(t, e, n, r) {
  const i = t.childCount, s = e.childCount;
  e:
    for (let o = 0, a = 0; o < s; o++) {
      const l = e.child(o);
      for (let c = a, d = Math.min(i, o + 3); c < d; c++)
        if (t.child(c) == l) {
          a = c + 1, n += l.nodeSize;
          continue e;
        }
      r(l, n), a < i && t.child(a).sameMarkup(l) ? bp(t.child(a), l, n + 1, r) : l.nodesBetween(0, l.content.size, r, n + 1), n += l.nodeSize;
    }
}
function vp(t, e) {
  let n;
  const r = (i, s) => {
    i.type.spec.tableRole == "table" && (n = Wb(t, i, s, n));
  };
  return e ? e.doc != t.doc && bp(e.doc, t.doc, 0, r) : t.doc.descendants(r), n;
}
function Wb(t, e, n, r) {
  const i = Te.get(e);
  if (!i.problems)
    return r;
  r || (r = t.tr);
  const s = [];
  for (let l = 0; l < i.height; l++)
    s.push(0);
  for (let l = 0; l < i.problems.length; l++) {
    const c = i.problems[l];
    if (c.type == "collision") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      const f = d.attrs;
      for (let p = 0; p < f.rowspan; p++)
        s[c.row + p] += c.n;
      r.setNodeMarkup(
        r.mapping.map(n + 1 + c.pos),
        null,
        er(f, f.colspan - c.n, c.n)
      );
    } else if (c.type == "missing")
      s[c.row] += c.n;
    else if (c.type == "overlong_rowspan") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      r.setNodeMarkup(r.mapping.map(n + 1 + c.pos), null, {
        ...d.attrs,
        rowspan: d.attrs.rowspan - c.n
      });
    } else if (c.type == "colwidth mismatch") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      r.setNodeMarkup(r.mapping.map(n + 1 + c.pos), null, {
        ...d.attrs,
        colwidth: c.colwidth
      });
    }
  }
  let o, a;
  for (let l = 0; l < s.length; l++)
    s[l] && (o == null && (o = l), a = l);
  for (let l = 0, c = n + 1; l < i.height; l++) {
    const d = e.child(l), f = c + d.nodeSize, p = s[l];
    if (p > 0) {
      let g = "cell";
      d.firstChild && (g = d.firstChild.type.spec.tableRole);
      const y = [];
      for (let x = 0; x < p; x++) {
        const E = Ze(t.schema)[g].createAndFill();
        E && y.push(E);
      }
      const w = (l == 0 || o == l - 1) && a == l ? c + 1 : f - 1;
      r.insert(r.mapping.map(w), y);
    }
    c = f;
  }
  return r.setMeta(Fb, { fixTables: !0 });
}
function Vb(t) {
  if (!t.size)
    return null;
  let { content: e, openStart: n, openEnd: r } = t;
  for (; e.childCount == 1 && (n > 0 && r > 0 || e.child(0).type.spec.tableRole == "table"); )
    n--, r--, e = e.child(0).content;
  const i = e.child(0), s = i.type.spec.tableRole, o = i.type.schema, a = [];
  if (s == "row")
    for (let l = 0; l < e.childCount; l++) {
      let c = e.child(l).content;
      const d = l ? 0 : Math.max(0, n - 1), f = l < e.childCount - 1 ? 0 : Math.max(0, r - 1);
      (d || f) && (c = Sa(
        Ze(o).row,
        new G(c, d, f)
      ).content), a.push(c);
    }
  else if (s == "cell" || s == "header_cell")
    a.push(
      n || r ? Sa(
        Ze(o).row,
        new G(e, n, r)
      ).content : e
    );
  else
    return null;
  return Ub(o, a);
}
function Ub(t, e) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    for (let o = s.childCount - 1; o >= 0; o--) {
      const { rowspan: a, colspan: l } = s.child(o).attrs;
      for (let c = i; c < i + a; c++)
        n[c] = (n[c] || 0) + l;
    }
  }
  let r = 0;
  for (let i = 0; i < n.length; i++)
    r = Math.max(r, n[i]);
  for (let i = 0; i < n.length; i++)
    if (i >= e.length && e.push(H.empty), n[i] < r) {
      const s = Ze(t).cell.createAndFill(), o = [];
      for (let a = n[i]; a < r; a++)
        o.push(s);
      e[i] = e[i].append(H.from(o));
    }
  return { height: e.length, width: r, rows: e };
}
function Sa(t, e) {
  const n = t.createAndFill();
  return new Tf(n).replace(0, n.content.size, e).doc;
}
function Kb({ width: t, height: e, rows: n }, r, i) {
  if (t != r) {
    const s = [], o = [];
    for (let a = 0; a < n.length; a++) {
      const l = n[a], c = [];
      for (let d = s[a] || 0, f = 0; d < r; f++) {
        let p = l.child(f % l.childCount);
        d + p.attrs.colspan > r && (p = p.type.createChecked(
          er(
            p.attrs,
            p.attrs.colspan,
            d + p.attrs.colspan - r
          ),
          p.content
        )), c.push(p), d += p.attrs.colspan;
        for (let g = 1; g < p.attrs.rowspan; g++)
          s[a + g] = (s[a + g] || 0) + p.attrs.colspan;
      }
      o.push(H.from(c));
    }
    n = o, t = r;
  }
  if (e != i) {
    const s = [];
    for (let o = 0, a = 0; o < i; o++, a++) {
      const l = [], c = n[a % e];
      for (let d = 0; d < c.childCount; d++) {
        let f = c.child(d);
        o + f.attrs.rowspan > i && (f = f.type.create(
          {
            ...f.attrs,
            rowspan: Math.max(1, i - f.attrs.rowspan)
          },
          f.content
        )), l.push(f);
      }
      s.push(H.from(l));
    }
    n = s, e = i;
  }
  return { width: t, height: e, rows: n };
}
function qb(t, e, n, r, i, s, o) {
  const a = t.doc.type.schema, l = Ze(a);
  let c, d;
  if (i > e.width)
    for (let f = 0, p = 0; f < e.height; f++) {
      const g = n.child(f);
      p += g.nodeSize;
      const y = [];
      let w;
      g.lastChild == null || g.lastChild.type == l.cell ? w = c || (c = l.cell.createAndFill()) : w = d || (d = l.header_cell.createAndFill());
      for (let x = e.width; x < i; x++)
        y.push(w);
      t.insert(t.mapping.slice(o).map(p - 1 + r), y);
    }
  if (s > e.height) {
    const f = [];
    for (let y = 0, w = (e.height - 1) * e.width; y < Math.max(e.width, i); y++) {
      const x = y >= e.width ? !1 : n.nodeAt(e.map[w + y]).type == l.header_cell;
      f.push(
        x ? d || (d = l.header_cell.createAndFill()) : c || (c = l.cell.createAndFill())
      );
    }
    const p = l.row.create(null, H.from(f)), g = [];
    for (let y = e.height; y < s; y++)
      g.push(p);
    t.insert(t.mapping.slice(o).map(r + n.nodeSize - 2), g);
  }
  return !!(c || d);
}
function _u(t, e, n, r, i, s, o, a) {
  if (o == 0 || o == e.height)
    return !1;
  let l = !1;
  for (let c = i; c < s; c++) {
    const d = o * e.width + c, f = e.map[d];
    if (e.map[d - e.width] == f) {
      l = !0;
      const p = n.nodeAt(f), { top: g, left: y } = e.findCell(f);
      t.setNodeMarkup(t.mapping.slice(a).map(f + r), null, {
        ...p.attrs,
        rowspan: o - g
      }), t.insert(
        t.mapping.slice(a).map(e.positionAt(o, y, n)),
        p.type.createAndFill({
          ...p.attrs,
          rowspan: g + p.attrs.rowspan - o
        })
      ), c += p.attrs.colspan - 1;
    }
  }
  return l;
}
function ku(t, e, n, r, i, s, o, a) {
  if (o == 0 || o == e.width)
    return !1;
  let l = !1;
  for (let c = i; c < s; c++) {
    const d = c * e.width + o, f = e.map[d];
    if (e.map[d - 1] == f) {
      l = !0;
      const p = n.nodeAt(f), g = e.colCount(f), y = t.mapping.slice(a).map(f + r);
      t.setNodeMarkup(
        y,
        null,
        er(
          p.attrs,
          o - g,
          p.attrs.colspan - (o - g)
        )
      ), t.insert(
        y + p.nodeSize,
        p.type.createAndFill(
          er(p.attrs, 0, o - g)
        )
      ), c += p.attrs.rowspan - 1;
    }
  }
  return l;
}
function xu(t, e, n, r, i) {
  let s = n ? t.doc.nodeAt(n - 1) : t.doc;
  if (!s)
    throw new Error("No table found");
  let o = Te.get(s);
  const { top: a, left: l } = r, c = l + i.width, d = a + i.height, f = t.tr;
  let p = 0;
  function g() {
    if (s = n ? f.doc.nodeAt(n - 1) : f.doc, !s)
      throw new Error("No table found");
    o = Te.get(s), p = f.mapping.maps.length;
  }
  qb(f, o, s, n, c, d, p) && g(), _u(f, o, s, n, l, c, a, p) && g(), _u(f, o, s, n, l, c, d, p) && g(), ku(f, o, s, n, a, d, l, p) && g(), ku(f, o, s, n, a, d, c, p) && g();
  for (let y = a; y < d; y++) {
    const w = o.positionAt(y, l, s), x = o.positionAt(y, c, s);
    f.replace(
      f.mapping.slice(p).map(w + n),
      f.mapping.slice(p).map(x + n),
      new G(i.rows[y - a], 0, 0)
    );
  }
  g(), f.setSelection(
    new ue(
      f.doc.resolve(n + o.positionAt(a, l, s)),
      f.doc.resolve(n + o.positionAt(d - 1, c - 1, s))
    )
  ), e(f);
}
var Gb = tp({
  ArrowLeft: Ii("horiz", -1),
  ArrowRight: Ii("horiz", 1),
  ArrowUp: Ii("vert", -1),
  ArrowDown: Ii("vert", 1),
  "Shift-ArrowLeft": Li("horiz", -1),
  "Shift-ArrowRight": Li("horiz", 1),
  "Shift-ArrowUp": Li("vert", -1),
  "Shift-ArrowDown": Li("vert", 1),
  Backspace: zi,
  "Mod-Backspace": zi,
  Delete: zi,
  "Mod-Delete": zi
});
function Qi(t, e, n) {
  return n.eq(t.selection) ? !1 : (e && e(t.tr.setSelection(n).scrollIntoView()), !0);
}
function Ii(t, e) {
  return (n, r, i) => {
    if (!i)
      return !1;
    const s = n.selection;
    if (s instanceof ue)
      return Qi(
        n,
        r,
        ie.near(s.$headCell, e)
      );
    if (t != "horiz" && !s.empty)
      return !1;
    const o = wp(i, t, e);
    if (o == null)
      return !1;
    if (t == "horiz")
      return Qi(
        n,
        r,
        ie.near(n.doc.resolve(s.head + e), e)
      );
    {
      const a = n.doc.resolve(o), l = mp(a, t, e);
      let c;
      return l ? c = ie.near(l, 1) : e < 0 ? c = ie.near(n.doc.resolve(a.before(-1)), -1) : c = ie.near(n.doc.resolve(a.after(-1)), 1), Qi(n, r, c);
    }
  };
}
function Li(t, e) {
  return (n, r, i) => {
    if (!i)
      return !1;
    const s = n.selection;
    let o;
    if (s instanceof ue)
      o = s;
    else {
      const l = wp(i, t, e);
      if (l == null)
        return !1;
      o = new ue(n.doc.resolve(l));
    }
    const a = mp(o.$headCell, t, e);
    return a ? Qi(
      n,
      r,
      new ue(o.$anchorCell, a)
    ) : !1;
  };
}
function zi(t, e) {
  const n = t.selection;
  if (!(n instanceof ue))
    return !1;
  if (e) {
    const r = t.tr, i = Ze(t.schema).cell.createAndFill().content;
    n.forEachCell((s, o) => {
      s.content.eq(i) || r.replace(
        r.mapping.map(o + 1),
        r.mapping.map(o + s.nodeSize - 1),
        new G(i, 0, 0)
      );
    }), r.docChanged && e(r);
  }
  return !0;
}
function Jb(t, e) {
  const n = t.state.doc, r = Br(n.resolve(e));
  return r ? (t.dispatch(t.state.tr.setSelection(new ue(r))), !0) : !1;
}
function Yb(t, e, n) {
  if (!It(t.state))
    return !1;
  let r = Vb(n);
  const i = t.state.selection;
  if (i instanceof ue) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        H.from(
          Sa(Ze(t.state.schema).cell, n)
        )
      ]
    });
    const s = i.$anchorCell.node(-1), o = i.$anchorCell.start(-1), a = Te.get(s).rectBetween(
      i.$anchorCell.pos - o,
      i.$headCell.pos - o
    );
    return r = Kb(r, a.right - a.left, a.bottom - a.top), xu(t.state, t.dispatch, o, a, r), !0;
  } else if (r) {
    const s = oo(t.state), o = s.start(-1);
    return xu(
      t.state,
      t.dispatch,
      o,
      Te.get(s.node(-1)).findCell(s.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function Xb(t, e) {
  var n;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = Su(t, e.target);
  let i;
  if (e.shiftKey && t.state.selection instanceof ue)
    s(t.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (i = Br(t.state.selection.$anchor)) != null && ((n = Ro(t, e)) == null ? void 0 : n.pos) != i.pos)
    s(i, e), e.preventDefault();
  else if (!r)
    return;
  function s(l, c) {
    let d = Ro(t, c);
    const f = hn.getState(t.state) == null;
    if (!d || !zl(l, d))
      if (f)
        d = l;
      else
        return;
    const p = new ue(l, d);
    if (f || !t.state.selection.eq(p)) {
      const g = t.state.tr.setSelection(p);
      f && g.setMeta(hn, l.pos), t.dispatch(g);
    }
  }
  function o() {
    t.root.removeEventListener("mouseup", o), t.root.removeEventListener("dragstart", o), t.root.removeEventListener("mousemove", a), hn.getState(t.state) != null && t.dispatch(t.state.tr.setMeta(hn, -1));
  }
  function a(l) {
    const c = l, d = hn.getState(t.state);
    let f;
    if (d != null)
      f = t.state.doc.resolve(d);
    else if (Su(t, c.target) != r && (f = Ro(t, e), !f))
      return o();
    f && s(f, c);
  }
  t.root.addEventListener("mouseup", o), t.root.addEventListener("dragstart", o), t.root.addEventListener("mousemove", a);
}
function wp(t, e, n) {
  if (!(t.state.selection instanceof re))
    return null;
  const { $head: r } = t.state.selection;
  for (let i = r.depth - 1; i >= 0; i--) {
    const s = r.node(i);
    if ((n < 0 ? r.index(i) : r.indexAfter(i)) != (n < 0 ? 0 : s.childCount))
      return null;
    if (s.type.spec.tableRole == "cell" || s.type.spec.tableRole == "header_cell") {
      const a = r.before(i), l = e == "vert" ? n > 0 ? "down" : "up" : n > 0 ? "right" : "left";
      return t.endOfTextblock(l) ? a : null;
    }
  }
  return null;
}
function Su(t, e) {
  for (; e && e != t.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function Ro(t, e) {
  const n = t.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return n && n ? Br(t.state.doc.resolve(n.pos)) : null;
}
var Qb = class {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Ca(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, Ca(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function Ca(t, e, n, r, i, s) {
  var o;
  let a = 0, l = !0, c = e.firstChild;
  const d = t.firstChild;
  if (d) {
    for (let f = 0, p = 0; f < d.childCount; f++) {
      const { colspan: g, colwidth: y } = d.child(f).attrs;
      for (let w = 0; w < g; w++, p++) {
        const x = i == p ? s : y && y[w], E = x ? x + "px" : "";
        a += x || r, x || (l = !1), c ? (c.style.width != E && (c.style.width = E), c = c.nextSibling) : e.appendChild(document.createElement("col")).style.width = E;
      }
    }
    for (; c; ) {
      const f = c.nextSibling;
      (o = c.parentNode) == null || o.removeChild(c), c = f;
    }
    l ? (n.style.width = a + "px", n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = a + "px");
  }
}
var _t = new tt(
  "tableColumnResizing"
);
function Zb({
  handleWidth: t = 5,
  cellMinWidth: e = 25,
  View: n = Qb,
  lastColumnResizable: r = !0
} = {}) {
  const i = new et({
    key: _t,
    state: {
      init(s, o) {
        return i.spec.props.nodeViews[Ze(o.schema).table.name] = (a, l) => new n(a, e, l), new Zi(-1, !1);
      },
      apply(s, o) {
        return o.apply(s);
      }
    },
    props: {
      attributes: (s) => {
        const o = _t.getState(s);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (s, o) => {
          ev(
            s,
            o,
            t,
            e,
            r
          );
        },
        mouseleave: (s) => {
          tv(s);
        },
        mousedown: (s, o) => {
          nv(s, o, e);
        }
      },
      decorations: (s) => {
        const o = _t.getState(s);
        if (o && o.activeHandle > -1)
          return lv(s, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return i;
}
var Zi = class {
  constructor(t, e) {
    this.activeHandle = t, this.dragging = e;
  }
  apply(t) {
    const e = this, n = t.getMeta(_t);
    if (n && n.setHandle != null)
      return new Zi(n.setHandle, !1);
    if (n && n.setDragging !== void 0)
      return new Zi(e.activeHandle, n.setDragging);
    if (e.activeHandle > -1 && t.docChanged) {
      let r = t.mapping.map(e.activeHandle, -1);
      return xa(t.doc.resolve(r)) || (r = -1), new Zi(r, e.dragging);
    }
    return e;
  }
};
function ev(t, e, n, r, i) {
  const s = _t.getState(t.state);
  if (s && !s.dragging) {
    const o = iv(e.target);
    let a = -1;
    if (o) {
      const { left: l, right: c } = o.getBoundingClientRect();
      e.clientX - l <= n ? a = Cu(t, e, "left", n) : c - e.clientX <= n && (a = Cu(t, e, "right", n));
    }
    if (a != s.activeHandle) {
      if (!i && a !== -1) {
        const l = t.state.doc.resolve(a), c = l.node(-1), d = Te.get(c), f = l.start(-1);
        if (d.colCount(l.pos - f) + l.nodeAfter.attrs.colspan - 1 == d.width - 1)
          return;
      }
      _p(t, a);
    }
  }
}
function tv(t) {
  const e = _t.getState(t.state);
  e && e.activeHandle > -1 && !e.dragging && _p(t, -1);
}
function nv(t, e, n) {
  const r = _t.getState(t.state);
  if (!r || r.activeHandle == -1 || r.dragging)
    return !1;
  const i = t.state.doc.nodeAt(r.activeHandle), s = rv(t, r.activeHandle, i.attrs);
  t.dispatch(
    t.state.tr.setMeta(_t, {
      setDragging: { startX: e.clientX, startWidth: s }
    })
  );
  function o(l) {
    window.removeEventListener("mouseup", o), window.removeEventListener("mousemove", a);
    const c = _t.getState(t.state);
    c?.dragging && (sv(
      t,
      c.activeHandle,
      Eu(c.dragging, l, n)
    ), t.dispatch(
      t.state.tr.setMeta(_t, { setDragging: null })
    ));
  }
  function a(l) {
    if (!l.which)
      return o(l);
    const c = _t.getState(t.state);
    if (c && c.dragging) {
      const d = Eu(c.dragging, l, n);
      ov(t, c.activeHandle, d, n);
    }
  }
  return window.addEventListener("mouseup", o), window.addEventListener("mousemove", a), e.preventDefault(), !0;
}
function rv(t, e, { colspan: n, colwidth: r }) {
  const i = r && r[r.length - 1];
  if (i)
    return i;
  const s = t.domAtPos(e);
  let a = s.node.childNodes[s.offset].offsetWidth, l = n;
  if (r)
    for (let c = 0; c < n; c++)
      r[c] && (a -= r[c], l--);
  return a / l;
}
function iv(t) {
  for (; t && t.nodeName != "TD" && t.nodeName != "TH"; )
    t = t.classList && t.classList.contains("ProseMirror") ? null : t.parentNode;
  return t;
}
function Cu(t, e, n, r) {
  const i = n == "right" ? -r : r, s = t.posAtCoords({
    left: e.clientX + i,
    top: e.clientY
  });
  if (!s)
    return -1;
  const { pos: o } = s, a = Br(t.state.doc.resolve(o));
  if (!a)
    return -1;
  if (n == "right")
    return a.pos;
  const l = Te.get(a.node(-1)), c = a.start(-1), d = l.map.indexOf(a.pos - c);
  return d % l.width == 0 ? -1 : c + l.map[d - 1];
}
function Eu(t, e, n) {
  const r = e.clientX - t.startX;
  return Math.max(n, t.startWidth + r);
}
function _p(t, e) {
  t.dispatch(
    t.state.tr.setMeta(_t, { setHandle: e })
  );
}
function sv(t, e, n) {
  const r = t.state.doc.resolve(e), i = r.node(-1), s = Te.get(i), o = r.start(-1), a = s.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, l = t.state.tr;
  for (let c = 0; c < s.height; c++) {
    const d = c * s.width + a;
    if (c && s.map[d] == s.map[d - s.width])
      continue;
    const f = s.map[d], p = i.nodeAt(f).attrs, g = p.colspan == 1 ? 0 : a - s.colCount(f);
    if (p.colwidth && p.colwidth[g] == n)
      continue;
    const y = p.colwidth ? p.colwidth.slice() : av(p.colspan);
    y[g] = n, l.setNodeMarkup(o + f, null, { ...p, colwidth: y });
  }
  l.docChanged && t.dispatch(l);
}
function ov(t, e, n, r) {
  const i = t.state.doc.resolve(e), s = i.node(-1), o = i.start(-1), a = Te.get(s).colCount(i.pos - o) + i.nodeAfter.attrs.colspan - 1;
  let l = t.domAtPos(i.start(-1)).node;
  for (; l && l.nodeName != "TABLE"; )
    l = l.parentNode;
  l && Ca(
    s,
    l.firstChild,
    l,
    r,
    a,
    n
  );
}
function av(t) {
  return Array(t).fill(0);
}
function lv(t, e) {
  const n = [], r = t.doc.resolve(e), i = r.node(-1);
  if (!i)
    return xe.empty;
  const s = Te.get(i), o = r.start(-1), a = s.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let l = 0; l < s.height; l++) {
    const c = a + l * s.width - 1;
    if ((a == s.width || s.map[c] != s.map[c + 1]) && (l == 0 || s.map[c] != s.map[c - s.width])) {
      const d = s.map[c], f = o + d + i.nodeAt(d).nodeSize - 1, p = document.createElement("div");
      p.className = "column-resize-handle", n.push(lt.widget(f, p));
    }
  }
  return xe.create(t.doc, n);
}
function Xt(t) {
  const e = t.selection, n = oo(t), r = n.node(-1), i = n.start(-1), s = Te.get(r);
  return { ...e instanceof ue ? s.rectBetween(
    e.$anchorCell.pos - i,
    e.$headCell.pos - i
  ) : s.findCell(n.pos - i), tableStart: i, map: s, table: r };
}
function kp(t, { map: e, tableStart: n, table: r }, i) {
  let s = i > 0 ? -1 : 0;
  zb(e, r, i + s) && (s = i == 0 || i == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const a = o * e.width + i;
    if (i > 0 && i < e.width && e.map[a - 1] == e.map[a]) {
      const l = e.map[a], c = r.nodeAt(l);
      t.setNodeMarkup(
        t.mapping.map(n + l),
        null,
        gp(c.attrs, i - e.colCount(l))
      ), o += c.attrs.rowspan - 1;
    } else {
      const l = s == null ? Ze(r.type.schema).cell : r.nodeAt(e.map[a + s]).type, c = e.positionAt(o, i, r);
      t.insert(t.mapping.map(n + c), l.createAndFill());
    }
  }
  return t;
}
function cv(t, e) {
  if (!It(t))
    return !1;
  if (e) {
    const n = Xt(t);
    e(kp(t.tr, n, n.left));
  }
  return !0;
}
function uv(t, e) {
  if (!It(t))
    return !1;
  if (e) {
    const n = Xt(t);
    e(kp(t.tr, n, n.right));
  }
  return !0;
}
function dv(t, { map: e, table: n, tableStart: r }, i) {
  const s = t.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const a = o * e.width + i, l = e.map[a], c = n.nodeAt(l), d = c.attrs;
    if (i > 0 && e.map[a - 1] == l || i < e.width - 1 && e.map[a + 1] == l)
      t.setNodeMarkup(
        t.mapping.slice(s).map(r + l),
        null,
        er(d, i - e.colCount(l))
      );
    else {
      const f = t.mapping.slice(s).map(r + l);
      t.delete(f, f + c.nodeSize);
    }
    o += d.rowspan;
  }
}
function fv(t, e) {
  if (!It(t))
    return !1;
  if (e) {
    const n = Xt(t), r = t.tr;
    if (n.left == 0 && n.right == n.map.width)
      return !1;
    for (let i = n.right - 1; dv(r, n, i), i != n.left; i--) {
      const s = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!s)
        throw RangeError("No table found");
      n.table = s, n.map = Te.get(s);
    }
    e(r);
  }
  return !0;
}
function pv(t, e, n) {
  var r;
  const i = Ze(e.type.schema).header_cell;
  for (let s = 0; s < t.width; s++)
    if (((r = e.nodeAt(t.map[s + n * t.width])) == null ? void 0 : r.type) != i)
      return !1;
  return !0;
}
function xp(t, { map: e, tableStart: n, table: r }, i) {
  var s;
  let o = n;
  for (let c = 0; c < i; c++)
    o += r.child(c).nodeSize;
  const a = [];
  let l = i > 0 ? -1 : 0;
  pv(e, r, i + l) && (l = i == 0 || i == e.height ? null : 0);
  for (let c = 0, d = e.width * i; c < e.width; c++, d++)
    if (i > 0 && i < e.height && e.map[d] == e.map[d - e.width]) {
      const f = e.map[d], p = r.nodeAt(f).attrs;
      t.setNodeMarkup(n + f, null, {
        ...p,
        rowspan: p.rowspan + 1
      }), c += p.colspan - 1;
    } else {
      const f = l == null ? Ze(r.type.schema).cell : (s = r.nodeAt(e.map[d + l * e.width])) == null ? void 0 : s.type, p = f?.createAndFill();
      p && a.push(p);
    }
  return t.insert(o, Ze(r.type.schema).row.create(null, a)), t;
}
function hv(t, e) {
  if (!It(t))
    return !1;
  if (e) {
    const n = Xt(t);
    e(xp(t.tr, n, n.top));
  }
  return !0;
}
function mv(t, e) {
  if (!It(t))
    return !1;
  if (e) {
    const n = Xt(t);
    e(xp(t.tr, n, n.bottom));
  }
  return !0;
}
function gv(t, { map: e, table: n, tableStart: r }, i) {
  let s = 0;
  for (let l = 0; l < i; l++)
    s += n.child(l).nodeSize;
  const o = s + n.child(i).nodeSize, a = t.mapping.maps.length;
  t.delete(s + r, o + r);
  for (let l = 0, c = i * e.width; l < e.width; l++, c++) {
    const d = e.map[c];
    if (i > 0 && d == e.map[c - e.width]) {
      const f = n.nodeAt(d).attrs;
      t.setNodeMarkup(t.mapping.slice(a).map(d + r), null, {
        ...f,
        rowspan: f.rowspan - 1
      }), l += f.colspan - 1;
    } else if (i < e.width && d == e.map[c + e.width]) {
      const f = n.nodeAt(d), p = f.attrs, g = f.type.create(
        { ...p, rowspan: f.attrs.rowspan - 1 },
        f.content
      ), y = e.positionAt(i + 1, l, n);
      t.insert(t.mapping.slice(a).map(r + y), g), l += p.colspan - 1;
    }
  }
}
function yv(t, e) {
  if (!It(t))
    return !1;
  if (e) {
    const n = Xt(t), r = t.tr;
    if (n.top == 0 && n.bottom == n.map.height)
      return !1;
    for (let i = n.bottom - 1; gv(r, n, i), i != n.top; i--) {
      const s = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!s)
        throw RangeError("No table found");
      n.table = s, n.map = Te.get(n.table);
    }
    e(r);
  }
  return !0;
}
function Mu(t) {
  const e = t.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function bv({ width: t, height: e, map: n }, r) {
  let i = r.top * t + r.left, s = i, o = (r.bottom - 1) * t + r.left, a = i + (r.right - r.left - 1);
  for (let l = r.top; l < r.bottom; l++) {
    if (r.left > 0 && n[s] == n[s - 1] || r.right < t && n[a] == n[a + 1])
      return !0;
    s += t, a += t;
  }
  for (let l = r.left; l < r.right; l++) {
    if (r.top > 0 && n[i] == n[i - t] || r.bottom < e && n[o] == n[o + t])
      return !0;
    i++, o++;
  }
  return !1;
}
function Au(t, e) {
  const n = t.selection;
  if (!(n instanceof ue) || n.$anchorCell.pos == n.$headCell.pos)
    return !1;
  const r = Xt(t), { map: i } = r;
  if (bv(i, r))
    return !1;
  if (e) {
    const s = t.tr, o = {};
    let a = H.empty, l, c;
    for (let d = r.top; d < r.bottom; d++)
      for (let f = r.left; f < r.right; f++) {
        const p = i.map[d * i.width + f], g = r.table.nodeAt(p);
        if (!(o[p] || !g))
          if (o[p] = !0, l == null)
            l = p, c = g;
          else {
            Mu(g) || (a = a.append(g.content));
            const y = s.mapping.map(p + r.tableStart);
            s.delete(y, y + g.nodeSize);
          }
      }
    if (l == null || c == null)
      return !0;
    if (s.setNodeMarkup(l + r.tableStart, null, {
      ...gp(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), a.size) {
      const d = l + 1 + c.content.size, f = Mu(c) ? l + 1 : d;
      s.replaceWith(f + r.tableStart, d + r.tableStart, a);
    }
    s.setSelection(
      new ue(s.doc.resolve(l + r.tableStart))
    ), e(s);
  }
  return !0;
}
function Tu(t, e) {
  const n = Ze(t.schema);
  return vv(({ node: r }) => n[r.type.spec.tableRole])(t, e);
}
function vv(t) {
  return (e, n) => {
    var r;
    const i = e.selection;
    let s, o;
    if (i instanceof ue) {
      if (i.$anchorCell.pos != i.$headCell.pos)
        return !1;
      s = i.$anchorCell.nodeAfter, o = i.$anchorCell.pos;
    } else {
      if (s = Rb(i.$from), !s)
        return !1;
      o = (r = Br(i.$from)) == null ? void 0 : r.pos;
    }
    if (s == null || o == null || s.attrs.colspan == 1 && s.attrs.rowspan == 1)
      return !1;
    if (n) {
      let a = s.attrs;
      const l = [], c = a.colwidth;
      a.rowspan > 1 && (a = { ...a, rowspan: 1 }), a.colspan > 1 && (a = { ...a, colspan: 1 });
      const d = Xt(e), f = e.tr;
      for (let g = 0; g < d.right - d.left; g++)
        l.push(
          c ? {
            ...a,
            colwidth: c && c[g] ? [c[g]] : null
          } : a
        );
      let p;
      for (let g = d.top; g < d.bottom; g++) {
        let y = d.map.positionAt(g, d.left, d.table);
        g == d.top && (y += s.nodeSize);
        for (let w = d.left, x = 0; w < d.right; w++, x++)
          w == d.left && g == d.top || f.insert(
            p = f.mapping.map(y + d.tableStart, 1),
            t({ node: s, row: g, col: w }).createAndFill(l[x])
          );
      }
      f.setNodeMarkup(
        o,
        t({ node: s, row: d.top, col: d.left }),
        l[0]
      ), i instanceof ue && f.setSelection(
        new ue(
          f.doc.resolve(i.$anchorCell.pos),
          p ? f.doc.resolve(p) : void 0
        )
      ), n(f);
    }
    return !0;
  };
}
function wv(t, e) {
  return function(n, r) {
    if (!It(n))
      return !1;
    const i = oo(n);
    if (i.nodeAfter.attrs[t] === e)
      return !1;
    if (r) {
      const s = n.tr;
      n.selection instanceof ue ? n.selection.forEachCell((o, a) => {
        o.attrs[t] !== e && s.setNodeMarkup(a, null, {
          ...o.attrs,
          [t]: e
        });
      }) : s.setNodeMarkup(i.pos, null, {
        ...i.nodeAfter.attrs,
        [t]: e
      }), r(s);
    }
    return !0;
  };
}
function _v(t) {
  return function(e, n) {
    if (!It(e))
      return !1;
    if (n) {
      const r = Ze(e.schema), i = Xt(e), s = e.tr, o = i.map.cellsInRect(
        t == "column" ? {
          left: i.left,
          top: 0,
          right: i.right,
          bottom: i.map.height
        } : t == "row" ? {
          left: 0,
          top: i.top,
          right: i.map.width,
          bottom: i.bottom
        } : i
      ), a = o.map((l) => i.table.nodeAt(l));
      for (let l = 0; l < o.length; l++)
        a[l].type == r.header_cell && s.setNodeMarkup(
          i.tableStart + o[l],
          r.cell,
          a[l].attrs
        );
      if (s.steps.length == 0)
        for (let l = 0; l < o.length; l++)
          s.setNodeMarkup(
            i.tableStart + o[l],
            r.header_cell,
            a[l].attrs
          );
      n(s);
    }
    return !0;
  };
}
function Ou(t, e, n) {
  const r = e.map.cellsInRect({
    left: 0,
    top: 0,
    right: t == "row" ? e.map.width : 1,
    bottom: t == "column" ? e.map.height : 1
  });
  for (let i = 0; i < r.length; i++) {
    const s = e.table.nodeAt(r[i]);
    if (s && s.type !== n.header_cell)
      return !1;
  }
  return !0;
}
function hi(t, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? _v(t) : function(n, r) {
    if (!It(n))
      return !1;
    if (r) {
      const i = Ze(n.schema), s = Xt(n), o = n.tr, a = Ou("row", s, i), l = Ou(
        "column",
        s,
        i
      ), d = (t === "column" ? a : t === "row" ? l : !1) ? 1 : 0, f = t == "column" ? {
        left: 0,
        top: d,
        right: 1,
        bottom: s.map.height
      } : t == "row" ? {
        left: d,
        top: 0,
        right: s.map.width,
        bottom: 1
      } : s, p = t == "column" ? l ? i.cell : i.header_cell : t == "row" ? a ? i.cell : i.header_cell : i.cell;
      s.map.cellsInRect(f).forEach((g) => {
        const y = g + s.tableStart, w = o.doc.nodeAt(y);
        w && o.setNodeMarkup(y, p, w.attrs);
      }), r(o);
    }
    return !0;
  };
}
hi("row", {
  useDeprecatedLogic: !0
});
hi("column", {
  useDeprecatedLogic: !0
});
var kv = hi("cell", {
  useDeprecatedLogic: !0
});
function xv(t, e) {
  if (e < 0) {
    const n = t.nodeBefore;
    if (n)
      return t.pos - n.nodeSize;
    for (let r = t.index(-1) - 1, i = t.before(); r >= 0; r--) {
      const s = t.node(-1).child(r), o = s.lastChild;
      if (o)
        return i - 1 - o.nodeSize;
      i -= s.nodeSize;
    }
  } else {
    if (t.index() < t.parent.childCount - 1)
      return t.pos + t.nodeAfter.nodeSize;
    const n = t.node(-1);
    for (let r = t.indexAfter(-1), i = t.after(); r < n.childCount; r++) {
      const s = n.child(r);
      if (s.childCount)
        return i + 1;
      i += s.nodeSize;
    }
  }
  return null;
}
function ju(t) {
  return function(e, n) {
    if (!It(e))
      return !1;
    const r = xv(oo(e), t);
    if (r == null)
      return !1;
    if (n) {
      const i = e.doc.resolve(r);
      n(
        e.tr.setSelection(re.between(i, Lb(i))).scrollIntoView()
      );
    }
    return !0;
  };
}
function Sv(t, e) {
  const n = t.selection.$anchor;
  for (let r = n.depth; r > 0; r--)
    if (n.node(r).type.spec.tableRole == "table")
      return e && e(
        t.tr.delete(n.before(r), n.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function Cv({
  allowTableNodeSelection: t = !1
} = {}) {
  return new et({
    key: hn,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, n) {
        const r = e.getMeta(hn);
        if (r != null)
          return r == -1 ? null : r;
        if (n == null || !e.docChanged)
          return n;
        const { deleted: i, pos: s } = e.mapping.mapResult(n);
        return i ? null : s;
      }
    },
    props: {
      decorations: Db,
      handleDOMEvents: {
        mousedown: Xb
      },
      createSelectionBetween(e) {
        return hn.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: Jb,
      handleKeyDown: Gb,
      handlePaste: Yb
    },
    appendTransaction(e, n, r) {
      return Hb(
        r,
        vp(r, n),
        t
      );
    }
  });
}
function Pu(t, e, n, r, i, s) {
  let o = 0, a = !0, l = e.firstChild;
  const c = t.firstChild;
  for (let d = 0, f = 0; d < c.childCount; d += 1) {
    const { colspan: p, colwidth: g } = c.child(d).attrs;
    for (let y = 0; y < p; y += 1, f += 1) {
      const w = i === f ? s : g && g[y], x = w ? `${w}px` : "";
      o += w || r, w || (a = !1), l ? (l.style.width !== x && (l.style.width = x), l = l.nextSibling) : e.appendChild(document.createElement("col")).style.width = x;
    }
  }
  for (; l; ) {
    const d = l.nextSibling;
    l.parentNode.removeChild(l), l = d;
  }
  a ? (n.style.width = `${o}px`, n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = `${o}px`);
}
class Ev {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Pu(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, Pu(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function Nu(t, e) {
  return e ? t.createChecked(null, e) : t.createAndFill();
}
function Mv(t) {
  if (t.cached.tableNodeTypes)
    return t.cached.tableNodeTypes;
  const e = {};
  return Object.keys(t.nodes).forEach((n) => {
    const r = t.nodes[n];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), t.cached.tableNodeTypes = e, e;
}
function Av(t, e, n, r, i) {
  const s = Mv(t), o = [], a = [];
  for (let c = 0; c < n; c += 1) {
    const d = Nu(s.cell, i);
    if (d && a.push(d), r) {
      const f = Nu(s.header_cell, i);
      f && o.push(f);
    }
  }
  const l = [];
  for (let c = 0; c < e; c += 1)
    l.push(s.row.createChecked(null, r && c === 0 ? o : a));
  return s.table.createChecked(null, l);
}
function Tv(t) {
  return t instanceof ue;
}
const Di = ({ editor: t }) => {
  const { selection: e } = t.state;
  if (!Tv(e))
    return !1;
  let n = 0;
  const r = cp(e.ranges[0].$from, (s) => s.type.name === "table");
  return r?.node.descendants((s) => {
    if (s.type.name === "table")
      return !1;
    ["tableCell", "tableHeader"].includes(s.type.name) && (n += 1);
  }), n === e.ranges.length ? (t.commands.deleteTable(), !0) : !1;
};
Ce.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: !1,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: Ev,
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
  renderHTML({ HTMLAttributes: t }) {
    return ["table", ge(this.options.HTMLAttributes, t), ["tbody", 0]];
  },
  addCommands() {
    return {
      insertTable: ({ rows: t = 3, cols: e = 3, withHeaderRow: n = !0 } = {}) => ({ tr: r, dispatch: i, editor: s }) => {
        const o = Av(s.schema, t, e, n);
        if (i) {
          const a = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(re.near(r.doc.resolve(a)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: t, dispatch: e }) => cv(t, e),
      addColumnAfter: () => ({ state: t, dispatch: e }) => uv(t, e),
      deleteColumn: () => ({ state: t, dispatch: e }) => fv(t, e),
      addRowBefore: () => ({ state: t, dispatch: e }) => hv(t, e),
      addRowAfter: () => ({ state: t, dispatch: e }) => mv(t, e),
      deleteRow: () => ({ state: t, dispatch: e }) => yv(t, e),
      deleteTable: () => ({ state: t, dispatch: e }) => Sv(t, e),
      mergeCells: () => ({ state: t, dispatch: e }) => Au(t, e),
      splitCell: () => ({ state: t, dispatch: e }) => Tu(t, e),
      toggleHeaderColumn: () => ({ state: t, dispatch: e }) => hi("column")(t, e),
      toggleHeaderRow: () => ({ state: t, dispatch: e }) => hi("row")(t, e),
      toggleHeaderCell: () => ({ state: t, dispatch: e }) => kv(t, e),
      mergeOrSplit: () => ({ state: t, dispatch: e }) => Au(t, e) ? !0 : Tu(t, e),
      setCellAttribute: (t, e) => ({ state: n, dispatch: r }) => wv(t, e)(n, r),
      goToNextCell: () => ({ state: t, dispatch: e }) => ju(1)(t, e),
      goToPreviousCell: () => ({ state: t, dispatch: e }) => ju(-1)(t, e),
      fixTables: () => ({ state: t, dispatch: e }) => (e && vp(t), !0),
      setCellSelection: (t) => ({ tr: e, dispatch: n }) => {
        if (n) {
          const r = ue.create(e.doc, t.anchorCell, t.headCell);
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
      Backspace: Di,
      "Mod-Backspace": Di,
      Delete: Di,
      "Mod-Delete": Di
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        Zb({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      Cv({
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
      tableRole: Se(Pe(t, "tableRole", e))
    };
  }
});
Ce.create({
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
    return ["td", ge(this.options.HTMLAttributes, t), 0];
  }
});
Ce.create({
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
    return ["th", ge(this.options.HTMLAttributes, t), 0];
  }
});
Ce.create({
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
    return ["tr", ge(this.options.HTMLAttributes, t), 0];
  }
});
const Ru = (t) => new Promise((e) => {
  let n = new FileReader();
  n.onloadend = () => {
    e(n.result);
  }, n.readAsDataURL(t);
}), Ov = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
Ce.create({
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
    return ["img", ge(this.options.HTMLAttributes, t)];
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
      up({
        find: Ov,
        type: this.type,
        getAttributes: (t) => {
          const [, , e, n, r] = t;
          return { src: n, alt: e, title: r };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    return [jv()];
  }
});
const jv = () => new et({
  props: {
    handlePaste(t, e, n) {
      const r = Array.from(e.clipboardData?.items || []), { schema: i } = t.state;
      return r.forEach((s) => {
        const o = s.getAsFile();
        o && s.type.indexOf("image") === 0 && (e.preventDefault(), Ru(o).then((a) => {
          const l = i.nodes.image.create({
            src: a
          }), c = t.state.tr.replaceSelectionWith(l);
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
        const { schema: i } = t.state, s = t.posAtCoords({
          left: e.clientX,
          top: e.clientY
        });
        return s ? (r.forEach(async (o) => {
          Ru(o).then((a) => {
            const l = i.nodes.image.create({
              src: a
            }), c = t.state.tr.insert(s.pos, l);
            t.dispatch(c);
          });
        }), !0) : !1;
      }
    }
  }
});
Ce.create({
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
    return ["video", ge(t)];
  },
  addNodeView() {
    return ({ editor: t, node: e }) => {
      const n = document.createElement("div");
      n.className = "relative aspect-w-16 aspect-h-9" + (t.isEditable ? " cursor-pointer" : "");
      const r = document.createElement("video");
      if (t.isEditable && (r.className = "pointer-events-none"), r.src = e.attrs.src, !t.isEditable)
        r.setAttribute("controls", "");
      else {
        let i = document.createElement("div");
        i.className = "absolute top-0 right-0 text-xs m-2 bg-gray-800 text-white px-2 py-1 rounded-md", i.innerHTML = "Video", n.append(i);
      }
      return n.append(r), {
        dom: n
      };
    };
  }
});
const Pv = "aaa1rp3barth4b0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0faromeo7ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re2s2c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y0eats7k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking0channel11l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t0isalat7u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0at2delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d0network8tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntdoor4ier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5gtv3iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0eles2s3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1nder2le4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster5ia3d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4de2k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0cys3drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7serati6ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic3tual5v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rthwesternmutual14on4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3ssagens7y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cher3ks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w0time7i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ffany5ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0channel7ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lkswagen7vo3te1ing3o2yage5u0elos6wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", Nv = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5تصالات6رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Rr = (t, e) => {
  for (const n in e)
    t[n] = e[n];
  return t;
}, Ea = "numeric", Ma = "ascii", Aa = "alpha", es = "asciinumeric", Bi = "alphanumeric", Ta = "domain", Sp = "emoji", Rv = "scheme", Iv = "slashscheme", Iu = "whitespace";
function Lv(t, e) {
  return t in e || (e[t] = []), e[t];
}
function Gn(t, e, n) {
  e[Ea] && (e[es] = !0, e[Bi] = !0), e[Ma] && (e[es] = !0, e[Aa] = !0), e[es] && (e[Bi] = !0), e[Aa] && (e[Bi] = !0), e[Bi] && (e[Ta] = !0), e[Sp] && (e[Ta] = !0);
  for (const r in e) {
    const i = Lv(r, n);
    i.indexOf(t) < 0 && i.push(t);
  }
}
function zv(t, e) {
  const n = {};
  for (const r in e)
    e[r].indexOf(t) >= 0 && (n[r] = !0);
  return n;
}
function ot(t) {
  t === void 0 && (t = null), this.j = {}, this.jr = [], this.jd = null, this.t = t;
}
ot.groups = {};
ot.prototype = {
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
      const i = e.jr[r][0], s = e.jr[r][1];
      if (s && i.test(t))
        return s;
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
    for (let i = 0; i < t.length; i++)
      this.tt(t[i], e, n, r);
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
    r = r || ot.groups;
    let i;
    return e && e.j ? i = e : (i = new ot(e), n && r && Gn(e, n, r)), this.jr.push([t, i]), i;
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
    let i = this;
    const s = t.length;
    if (!s)
      return i;
    for (let o = 0; o < s - 1; o++)
      i = i.tt(t[o]);
    return i.tt(t[s - 1], e, n, r);
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
    r = r || ot.groups;
    const i = this;
    if (e && e.j)
      return i.j[t] = e, e;
    const s = e;
    let o, a = i.go(t);
    if (a ? (o = new ot(), Rr(o.j, a.j), o.jr.push.apply(o.jr, a.jr), o.jd = a.jd, o.t = a.t) : o = new ot(), s) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const l = Rr(zv(o.t, r), n);
          Gn(s, l, r);
        } else
          n && Gn(s, n, r);
      o.t = s;
    }
    return i.j[t] = o, o;
  }
};
const X = (t, e, n, r, i) => t.ta(e, n, r, i), yt = (t, e, n, r, i) => t.tr(e, n, r, i), Lu = (t, e, n, r, i) => t.ts(e, n, r, i), F = (t, e, n, r, i) => t.tt(e, n, r, i), Qt = "WORD", Oa = "UWORD", mi = "LOCALHOST", ja = "TLD", Pa = "UTLD", ts = "SCHEME", dr = "SLASH_SCHEME", Dl = "NUM", Cp = "WS", Bl = "NL", mr = "OPENBRACE", ni = "OPENBRACKET", ri = "OPENANGLEBRACKET", ii = "OPENPAREN", Wn = "CLOSEBRACE", gr = "CLOSEBRACKET", yr = "CLOSEANGLEBRACKET", Vn = "CLOSEPAREN", Ss = "AMPERSAND", Cs = "APOSTROPHE", Es = "ASTERISK", pn = "AT", Ms = "BACKSLASH", As = "BACKTICK", Ts = "CARET", mn = "COLON", $l = "COMMA", Os = "DOLLAR", $t = "DOT", js = "EQUALS", Hl = "EXCLAMATION", Ht = "HYPHEN", Ps = "PERCENT", Ns = "PIPE", Rs = "PLUS", Is = "POUND", Ls = "QUERY", Fl = "QUOTE", Wl = "SEMI", Ft = "SLASH", si = "TILDE", zs = "UNDERSCORE", Ep = "EMOJI", Ds = "SYM";
var Mp = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: Qt,
  UWORD: Oa,
  LOCALHOST: mi,
  TLD: ja,
  UTLD: Pa,
  SCHEME: ts,
  SLASH_SCHEME: dr,
  NUM: Dl,
  WS: Cp,
  NL: Bl,
  OPENBRACE: mr,
  OPENBRACKET: ni,
  OPENANGLEBRACKET: ri,
  OPENPAREN: ii,
  CLOSEBRACE: Wn,
  CLOSEBRACKET: gr,
  CLOSEANGLEBRACKET: yr,
  CLOSEPAREN: Vn,
  AMPERSAND: Ss,
  APOSTROPHE: Cs,
  ASTERISK: Es,
  AT: pn,
  BACKSLASH: Ms,
  BACKTICK: As,
  CARET: Ts,
  COLON: mn,
  COMMA: $l,
  DOLLAR: Os,
  DOT: $t,
  EQUALS: js,
  EXCLAMATION: Hl,
  HYPHEN: Ht,
  PERCENT: Ps,
  PIPE: Ns,
  PLUS: Rs,
  POUND: Is,
  QUERY: Ls,
  QUOTE: Fl,
  SEMI: Wl,
  SLASH: Ft,
  TILDE: si,
  UNDERSCORE: zs,
  EMOJI: Ep,
  SYM: Ds
});
const lr = /[a-z]/, Io = /\p{L}/u, Lo = /\p{Emoji}/u, zo = /\d/, zu = /\s/, Du = `
`, Dv = "️", Bv = "‍";
let $i = null, Hi = null;
function $v(t) {
  t === void 0 && (t = []);
  const e = {};
  ot.groups = e;
  const n = new ot();
  $i == null && ($i = Bu(Pv)), Hi == null && (Hi = Bu(Nv)), F(n, "'", Cs), F(n, "{", mr), F(n, "[", ni), F(n, "<", ri), F(n, "(", ii), F(n, "}", Wn), F(n, "]", gr), F(n, ">", yr), F(n, ")", Vn), F(n, "&", Ss), F(n, "*", Es), F(n, "@", pn), F(n, "`", As), F(n, "^", Ts), F(n, ":", mn), F(n, ",", $l), F(n, "$", Os), F(n, ".", $t), F(n, "=", js), F(n, "!", Hl), F(n, "-", Ht), F(n, "%", Ps), F(n, "|", Ns), F(n, "+", Rs), F(n, "#", Is), F(n, "?", Ls), F(n, '"', Fl), F(n, "/", Ft), F(n, ";", Wl), F(n, "~", si), F(n, "_", zs), F(n, "\\", Ms);
  const r = yt(n, zo, Dl, {
    [Ea]: !0
  });
  yt(r, zo, r);
  const i = yt(n, lr, Qt, {
    [Ma]: !0
  });
  yt(i, lr, i);
  const s = yt(n, Io, Oa, {
    [Aa]: !0
  });
  yt(s, lr), yt(s, Io, s);
  const o = yt(n, zu, Cp, {
    [Iu]: !0
  });
  F(n, Du, Bl, {
    [Iu]: !0
  }), F(o, Du), yt(o, zu, o);
  const a = yt(n, Lo, Ep, {
    [Sp]: !0
  });
  yt(a, Lo, a), F(a, Dv, a);
  const l = F(a, Bv);
  yt(l, Lo, a);
  const c = [[lr, i]], d = [[lr, null], [Io, s]];
  for (let f = 0; f < $i.length; f++)
    on(n, $i[f], ja, Qt, c);
  for (let f = 0; f < Hi.length; f++)
    on(n, Hi[f], Pa, Oa, d);
  Gn(ja, {
    tld: !0,
    ascii: !0
  }, e), Gn(Pa, {
    utld: !0,
    alpha: !0
  }, e), on(n, "file", ts, Qt, c), on(n, "mailto", ts, Qt, c), on(n, "http", dr, Qt, c), on(n, "https", dr, Qt, c), on(n, "ftp", dr, Qt, c), on(n, "ftps", dr, Qt, c), Gn(ts, {
    scheme: !0,
    ascii: !0
  }, e), Gn(dr, {
    slashscheme: !0,
    ascii: !0
  }, e), t = t.sort((f, p) => f[0] > p[0] ? 1 : -1);
  for (let f = 0; f < t.length; f++) {
    const p = t[f][0], y = t[f][1] ? {
      [Rv]: !0
    } : {
      [Iv]: !0
    };
    p.indexOf("-") >= 0 ? y[Ta] = !0 : lr.test(p) ? zo.test(p) ? y[es] = !0 : y[Ma] = !0 : y[Ea] = !0, Lu(n, p, p, y);
  }
  return Lu(n, "localhost", mi, {
    ascii: !0
  }), n.jd = new ot(Ds), {
    start: n,
    tokens: Rr({
      groups: e
    }, Mp)
  };
}
function Hv(t, e) {
  const n = Fv(e.replace(/[A-Z]/g, (a) => a.toLowerCase())), r = n.length, i = [];
  let s = 0, o = 0;
  for (; o < r; ) {
    let a = t, l = null, c = 0, d = null, f = -1, p = -1;
    for (; o < r && (l = a.go(n[o])); )
      a = l, a.accepts() ? (f = 0, p = 0, d = a) : f >= 0 && (f += n[o].length, p++), c += n[o].length, s += n[o].length, o++;
    s -= f, o -= p, c -= f, i.push({
      t: d.t,
      // token type/name
      v: e.slice(s - c, s),
      // string value
      s: s - c,
      // start index
      e: s
      // end index (excluding)
    });
  }
  return i;
}
function Fv(t) {
  const e = [], n = t.length;
  let r = 0;
  for (; r < n; ) {
    let i = t.charCodeAt(r), s, o = i < 55296 || i > 56319 || r + 1 === n || (s = t.charCodeAt(r + 1)) < 56320 || s > 57343 ? t[r] : t.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function on(t, e, n, r, i) {
  let s;
  const o = e.length;
  for (let a = 0; a < o - 1; a++) {
    const l = e[a];
    t.j[l] ? s = t.j[l] : (s = new ot(r), s.jr = i.slice(), t.j[l] = s), t = s;
  }
  return s = new ot(n), s.jr = i.slice(), t.j[e[o - 1]] = s, s;
}
function Bu(t) {
  const e = [], n = [];
  let r = 0, i = "0123456789";
  for (; r < t.length; ) {
    let s = 0;
    for (; i.indexOf(t[r + s]) >= 0; )
      s++;
    if (s > 0) {
      e.push(n.join(""));
      for (let o = parseInt(t.substring(r, r + s), 10); o > 0; o--)
        n.pop();
      r += s;
    } else
      n.push(t[r]), r++;
  }
  return e;
}
const gi = {
  defaultProtocol: "http",
  events: null,
  format: $u,
  formatHref: $u,
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
function Vl(t, e) {
  e === void 0 && (e = null);
  let n = Rr({}, gi);
  t && (n = Rr(n, t instanceof Vl ? t.o : t));
  const r = n.ignoreTags, i = [];
  for (let s = 0; s < r.length; s++)
    i.push(r[s].toUpperCase());
  this.o = n, e && (this.defaultRender = e), this.ignoreTags = i;
}
Vl.prototype = {
  o: gi,
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
    let i = this.o[t];
    return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : gi[t], typeof i == "function" && r && (i = i(e, n))) : typeof i == "function" && r && (i = i(e, n.t, n)), i);
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
function $u(t) {
  return t;
}
function Ap(t, e) {
  this.t = "token", this.v = t, this.tk = e;
}
Ap.prototype = {
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
    return t === void 0 && (t = gi.defaultProtocol), {
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
    const e = this, n = this.toHref(t.get("defaultProtocol")), r = t.get("formatHref", n, this), i = t.get("tagName", n, e), s = this.toFormattedString(t), o = {}, a = t.get("className", n, e), l = t.get("target", n, e), c = t.get("rel", n, e), d = t.getObj("attributes", n, e), f = t.getObj("events", n, e);
    return o.href = r, a && (o.class = a), l && (o.target = l), c && (o.rel = c), d && Rr(o, d), {
      tagName: i,
      attributes: o,
      content: s,
      eventListeners: f
    };
  }
};
function ao(t, e) {
  class n extends Ap {
    constructor(i, s) {
      super(i, s), this.t = t;
    }
  }
  for (const r in e)
    n.prototype[r] = e[r];
  return n.t = t, n;
}
const Hu = ao("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), Fu = ao("text"), Wv = ao("nl"), zn = ao("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(t) {
    return t === void 0 && (t = gi.defaultProtocol), this.hasProtocol() ? this.v : `${t}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const t = this.tk;
    return t.length >= 2 && t[0].t !== mi && t[1].t === mn;
  }
}), $e = (t) => new ot(t);
function Vv(t) {
  let {
    groups: e
  } = t;
  const n = e.domain.concat([Ss, Es, pn, Ms, As, Ts, Os, js, Ht, Dl, Ps, Ns, Rs, Is, Ft, Ds, si, zs]), r = [Cs, yr, Wn, gr, Vn, mn, $l, $t, Hl, ri, mr, ni, ii, Ls, Fl, Wl], i = [Ss, Cs, Es, Ms, As, Ts, Wn, Os, js, Ht, mr, Ps, Ns, Rs, Is, Ls, Ft, Ds, si, zs], s = $e(), o = F(s, si);
  X(o, i, o), X(o, e.domain, o);
  const a = $e(), l = $e(), c = $e();
  X(s, e.domain, a), X(s, e.scheme, l), X(s, e.slashscheme, c), X(a, i, o), X(a, e.domain, a);
  const d = F(a, pn);
  F(o, pn, d), F(l, pn, d), F(c, pn, d);
  const f = F(o, $t);
  X(f, i, o), X(f, e.domain, o);
  const p = $e();
  X(d, e.domain, p), X(p, e.domain, p);
  const g = F(p, $t);
  X(g, e.domain, p);
  const y = $e(Hu);
  X(g, e.tld, y), X(g, e.utld, y), F(d, mi, y);
  const w = F(p, Ht);
  X(w, e.domain, p), X(y, e.domain, p), F(y, $t, g), F(y, Ht, w);
  const x = F(y, mn);
  X(x, e.numeric, Hu);
  const E = F(a, Ht), T = F(a, $t);
  X(E, e.domain, a), X(T, i, o), X(T, e.domain, a);
  const P = $e(zn);
  X(T, e.tld, P), X(T, e.utld, P), X(P, e.domain, a), X(P, i, o), F(P, $t, T), F(P, Ht, E), F(P, pn, d);
  const u = F(P, mn), m = $e(zn);
  X(u, e.numeric, m);
  const h = $e(zn), b = $e();
  X(h, n, h), X(h, r, b), X(b, n, h), X(b, r, b), F(P, Ft, h), F(m, Ft, h);
  const v = F(l, mn), S = F(c, mn), k = F(S, Ft), M = F(k, Ft);
  X(l, e.domain, a), F(l, $t, T), F(l, Ht, E), X(c, e.domain, a), F(c, $t, T), F(c, Ht, E), X(v, e.domain, h), F(v, Ft, h), X(M, e.domain, h), X(M, n, h), F(M, Ft, h);
  const j = F(h, mr), R = F(h, ni), N = F(h, ri), z = F(h, ii);
  F(b, mr, j), F(b, ni, R), F(b, ri, N), F(b, ii, z), F(j, Wn, h), F(R, gr, h), F(N, yr, h), F(z, Vn, h), F(j, Wn, h);
  const _ = $e(zn), O = $e(zn), L = $e(zn), W = $e(zn);
  X(j, n, _), X(R, n, O), X(N, n, L), X(z, n, W);
  const te = $e(), K = $e(), ae = $e(), ye = $e();
  return X(j, r), X(R, r), X(N, r), X(z, r), X(_, n, _), X(O, n, O), X(L, n, L), X(W, n, W), X(_, r, _), X(O, r, O), X(L, r, L), X(W, r, W), X(te, n, te), X(K, n, O), X(ae, n, L), X(ye, n, W), X(te, r, te), X(K, r, K), X(ae, r, ae), X(ye, r, ye), F(O, gr, h), F(L, yr, h), F(W, Vn, h), F(_, Wn, h), F(K, gr, h), F(ae, yr, h), F(ye, Vn, h), F(te, Vn, h), F(s, mi, P), F(s, Bl, Wv), {
    start: s,
    tokens: Mp
  };
}
function Uv(t, e, n) {
  let r = n.length, i = 0, s = [], o = [];
  for (; i < r; ) {
    let a = t, l = null, c = null, d = 0, f = null, p = -1;
    for (; i < r && !(l = a.go(n[i].t)); )
      o.push(n[i++]);
    for (; i < r && (c = l || a.go(n[i].t)); )
      l = null, a = c, a.accepts() ? (p = 0, f = a) : p >= 0 && p++, i++, d++;
    if (p < 0)
      i -= d, i < r && (o.push(n[i]), i++);
    else {
      o.length > 0 && (s.push(Do(Fu, e, o)), o = []), i -= p, d -= p;
      const g = f.t, y = n.slice(i - d, i);
      s.push(Do(g, e, y));
    }
  }
  return o.length > 0 && s.push(Do(Fu, e, o)), s;
}
function Do(t, e, n) {
  const r = n[0].s, i = n[n.length - 1].e, s = e.slice(r, i);
  return new t(s, n);
}
const Kv = typeof console < "u" && console && console.warn || (() => {
}), qv = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", ke = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function Gv() {
  ot.groups = {}, ke.scanner = null, ke.parser = null, ke.tokenQueue = [], ke.pluginQueue = [], ke.customSchemes = [], ke.initialized = !1;
}
function Wu(t, e) {
  if (e === void 0 && (e = !1), ke.initialized && Kv(`linkifyjs: already initialized - will not register custom scheme "${t}" ${qv}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(t))
    throw new Error(`linkifyjs: incorrect scheme format.
 1. Must only contain digits, lowercase ASCII letters or "-"
 2. Cannot start or end with "-"
 3. "-" cannot repeat`);
  ke.customSchemes.push([t, e]);
}
function Jv() {
  ke.scanner = $v(ke.customSchemes);
  for (let t = 0; t < ke.tokenQueue.length; t++)
    ke.tokenQueue[t][1]({
      scanner: ke.scanner
    });
  ke.parser = Vv(ke.scanner.tokens);
  for (let t = 0; t < ke.pluginQueue.length; t++)
    ke.pluginQueue[t][1]({
      scanner: ke.scanner,
      parser: ke.parser
    });
  ke.initialized = !0;
}
function Yv(t) {
  return ke.initialized || Jv(), Uv(ke.parser.start, t, Hv(ke.scanner.start, t));
}
function Tp(t, e, n) {
  if (e === void 0 && (e = null), n === void 0 && (n = null), e && typeof e == "object") {
    if (n)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    n = e, e = null;
  }
  const r = new Vl(n), i = Yv(t), s = [];
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    a.isLink && (!e || a.t === e) && s.push(a.toFormattedObject(r));
  }
  return s;
}
function Xv(t) {
  return new et({
    key: new tt("autolink"),
    appendTransaction: (e, n, r) => {
      const i = e.some((c) => c.docChanged) && !n.doc.eq(r.doc), s = e.some((c) => c.getMeta("preventAutolink"));
      if (!i || s)
        return;
      const { tr: o } = r, a = ny(n.doc, [...e]);
      if (cy(a).forEach(({ newRange: c }) => {
        const d = iy(r.doc, c, (g) => g.isTextblock);
        let f, p;
        if (d.length > 1 ? (f = d[0], p = r.doc.textBetween(f.pos, f.pos + f.node.nodeSize, void 0, " ")) : d.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (f = d[0], p = r.doc.textBetween(f.pos, c.to, void 0, " ")), f && p) {
          const g = p.split(" ").filter((x) => x !== "");
          if (g.length <= 0)
            return !1;
          const y = g[g.length - 1], w = f.pos + p.lastIndexOf(y);
          if (!y)
            return !1;
          Tp(y).filter((x) => x.isLink).map((x) => ({
            ...x,
            from: w + x.start + 1,
            to: w + x.end + 1
          })).filter((x) => r.schema.marks.code ? !r.doc.rangeHasMark(x.from, x.to, r.schema.marks.code) : !0).filter((x) => t.validate ? t.validate(x.value) : !0).forEach((x) => {
            Il(x.from, x.to, r.doc).some((E) => E.mark.type === t.type) || o.addMark(x.from, x.to, t.type.create({
              href: x.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function Qv(t) {
  return new et({
    key: new tt("handleClickLink"),
    props: {
      handleClick: (e, n, r) => {
        var i, s;
        if (r.button !== 0 || r.target.nodeName !== "A")
          return !1;
        const a = oy(e.state, t.type.name), l = r.target, c = (i = l?.href) !== null && i !== void 0 ? i : a.href, d = (s = l?.target) !== null && s !== void 0 ? s : a.target;
        return l && c ? (e.editable && window.open(c, d), !0) : !1;
      }
    }
  });
}
Ct.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((t) => {
      if (typeof t == "string") {
        Wu(t);
        return;
      }
      Wu(t.scheme, t.optionalSlashes);
    });
  },
  onDestroy() {
    Gv();
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
    return ["a", ge(this.options.HTMLAttributes, t), 0];
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
      Mn({
        find: (t) => Tp(t).filter((e) => this.options.validate ? this.options.validate(e.value) : !0).filter((e) => e.isLink).map((e) => ({
          text: e.value,
          index: e.start,
          data: e
        })),
        type: this.type,
        getAttributes: (t, e) => {
          var n, r;
          const i = (n = e.clipboardData) === null || n === void 0 ? void 0 : n.getData("text/html"), s = /href="([^"]*)"/, o = i?.match(s);
          return o ? {
            href: o[1]
          } : {
            href: (r = t.data) === null || r === void 0 ? void 0 : r.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const t = [];
    return this.options.autolink && t.push(Xv({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && t.push(Qv({
      type: this.type
    })), t;
  }
});
const Zv = (t) => Oe({
  find: /--$/,
  replace: t ?? "—"
}), e3 = (t) => Oe({
  find: /\.\.\.$/,
  replace: t ?? "…"
}), t3 = (t) => Oe({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(")$/,
  replace: t ?? "“"
}), n3 = (t) => Oe({
  find: /"$/,
  replace: t ?? "”"
}), r3 = (t) => Oe({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(')$/,
  replace: t ?? "‘"
}), i3 = (t) => Oe({
  find: /'$/,
  replace: t ?? "’"
}), s3 = (t) => Oe({
  find: /<-$/,
  replace: t ?? "←"
}), o3 = (t) => Oe({
  find: /->$/,
  replace: t ?? "→"
}), a3 = (t) => Oe({
  find: /\(c\)$/,
  replace: t ?? "©"
}), l3 = (t) => Oe({
  find: /\(tm\)$/,
  replace: t ?? "™"
}), c3 = (t) => Oe({
  find: /\(sm\)$/,
  replace: t ?? "℠"
}), u3 = (t) => Oe({
  find: /\(r\)$/,
  replace: t ?? "®"
}), d3 = (t) => Oe({
  find: /(?:^|\s)(1\/2)$/,
  replace: t ?? "½"
}), f3 = (t) => Oe({
  find: /\+\/-$/,
  replace: t ?? "±"
}), p3 = (t) => Oe({
  find: /!=$/,
  replace: t ?? "≠"
}), h3 = (t) => Oe({
  find: /<<$/,
  replace: t ?? "«"
}), m3 = (t) => Oe({
  find: />>$/,
  replace: t ?? "»"
}), g3 = (t) => Oe({
  find: /\d+\s?([*x])\s?\d+$/,
  replace: t ?? "×"
}), y3 = (t) => Oe({
  find: /\^2$/,
  replace: t ?? "²"
}), b3 = (t) => Oe({
  find: /\^3$/,
  replace: t ?? "³"
}), v3 = (t) => Oe({
  find: /(?:^|\s)(1\/4)$/,
  replace: t ?? "¼"
}), w3 = (t) => Oe({
  find: /(?:^|\s)(3\/4)$/,
  replace: t ?? "¾"
});
Ge.create({
  name: "typography",
  addInputRules() {
    const t = [];
    return this.options.emDash !== !1 && t.push(Zv(this.options.emDash)), this.options.ellipsis !== !1 && t.push(e3(this.options.ellipsis)), this.options.openDoubleQuote !== !1 && t.push(t3(this.options.openDoubleQuote)), this.options.closeDoubleQuote !== !1 && t.push(n3(this.options.closeDoubleQuote)), this.options.openSingleQuote !== !1 && t.push(r3(this.options.openSingleQuote)), this.options.closeSingleQuote !== !1 && t.push(i3(this.options.closeSingleQuote)), this.options.leftArrow !== !1 && t.push(s3(this.options.leftArrow)), this.options.rightArrow !== !1 && t.push(o3(this.options.rightArrow)), this.options.copyright !== !1 && t.push(a3(this.options.copyright)), this.options.trademark !== !1 && t.push(l3(this.options.trademark)), this.options.servicemark !== !1 && t.push(c3(this.options.servicemark)), this.options.registeredTrademark !== !1 && t.push(u3(this.options.registeredTrademark)), this.options.oneHalf !== !1 && t.push(d3(this.options.oneHalf)), this.options.plusMinus !== !1 && t.push(f3(this.options.plusMinus)), this.options.notEqual !== !1 && t.push(p3(this.options.notEqual)), this.options.laquo !== !1 && t.push(h3(this.options.laquo)), this.options.raquo !== !1 && t.push(m3(this.options.raquo)), this.options.multiplication !== !1 && t.push(g3(this.options.multiplication)), this.options.superscriptTwo !== !1 && t.push(y3(this.options.superscriptTwo)), this.options.superscriptThree !== !1 && t.push(b3(this.options.superscriptThree)), this.options.oneQuarter !== !1 && t.push(v3(this.options.oneQuarter)), this.options.threeQuarters !== !1 && t.push(w3(this.options.threeQuarters)), t;
  }
});
Ct.create({
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
    return ["span", ge(this.options.HTMLAttributes, t), 0];
  },
  addCommands() {
    return {
      removeEmptyTextStyle: () => ({ state: t, commands: e }) => {
        const n = ki(t, this.type);
        return Object.entries(n).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
});
const _3 = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/, k3 = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;
Ct.create({
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
    return ["mark", ge(this.options.HTMLAttributes, t), 0];
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
      Zn({
        find: _3,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      Mn({
        find: k3,
        type: this.type
      })
    ];
  }
});
Ge.create({
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
function x3(t) {
  var e;
  const { char: n, allowSpaces: r, allowedPrefixes: i, startOfLine: s, $position: o } = t, a = jy(n), l = new RegExp(`\\s${a}$`), c = s ? "^" : "", d = r ? new RegExp(`${c}${a}.*?(?=\\s${a}|$)`, "gm") : new RegExp(`${c}(?:^)?${a}[^\\s${a}]*`, "gm"), f = ((e = o.nodeBefore) === null || e === void 0 ? void 0 : e.isText) && o.nodeBefore.text;
  if (!f)
    return null;
  const p = o.pos - f.length, g = Array.from(f.matchAll(d)).pop();
  if (!g || g.input === void 0 || g.index === void 0)
    return null;
  const y = g.input.slice(Math.max(0, g.index - 1), g.index), w = new RegExp(`^[${i?.join("")}\0]?$`).test(y);
  if (i !== null && !w)
    return null;
  const x = p + g.index;
  let E = x + g[0].length;
  return r && l.test(f.slice(E - 1, E + 1)) && (g[0] += " ", E += 1), x < o.pos && E >= o.pos ? {
    range: {
      from: x,
      to: E
    },
    query: g[0].slice(n.length),
    text: g[0]
  } : null;
}
const S3 = new tt("suggestion");
function C3({ pluginKey: t = S3, editor: e, char: n = "@", allowSpaces: r = !1, allowedPrefixes: i = [" "], startOfLine: s = !1, decorationTag: o = "span", decorationClass: a = "suggestion", command: l = () => null, items: c = () => [], render: d = () => ({}), allow: f = () => !0 }) {
  let p;
  const g = d?.(), y = new et({
    key: t,
    view() {
      return {
        update: async (w, x) => {
          var E, T, P, u, m, h, b;
          const v = (E = this.key) === null || E === void 0 ? void 0 : E.getState(x), S = (T = this.key) === null || T === void 0 ? void 0 : T.getState(w.state), k = v.active && S.active && v.range.from !== S.range.from, M = !v.active && S.active, j = v.active && !S.active, R = !M && !j && v.query !== S.query, N = M || k, z = R && !k, _ = j || k;
          if (!N && !z && !_)
            return;
          const O = _ && !N ? v : S, L = w.dom.querySelector(`[data-decoration-id="${O.decorationId}"]`);
          p = {
            editor: e,
            range: O.range,
            query: O.query,
            text: O.text,
            items: [],
            command: (W) => {
              l({
                editor: e,
                range: O.range,
                props: W
              });
            },
            decorationNode: L,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: L ? () => {
              var W;
              const { decorationId: te } = (W = this.key) === null || W === void 0 ? void 0 : W.getState(e.state), K = w.dom.querySelector(`[data-decoration-id="${te}"]`);
              return K?.getBoundingClientRect() || null;
            } : null
          }, N && ((P = g?.onBeforeStart) === null || P === void 0 || P.call(g, p)), z && ((u = g?.onBeforeUpdate) === null || u === void 0 || u.call(g, p)), (z || N) && (p.items = await c({
            editor: e,
            query: O.query
          })), _ && ((m = g?.onExit) === null || m === void 0 || m.call(g, p)), z && ((h = g?.onUpdate) === null || h === void 0 || h.call(g, p)), N && ((b = g?.onStart) === null || b === void 0 || b.call(g, p));
        },
        destroy: () => {
          var w;
          p && ((w = g?.onExit) === null || w === void 0 || w.call(g, p));
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
      apply(w, x, E, T) {
        const { isEditable: P } = e, { composing: u } = e.view, { selection: m } = w, { empty: h, from: b } = m, v = { ...x };
        if (v.composing = u, P && (h || e.view.composing)) {
          (b < x.range.from || b > x.range.to) && !u && !x.composing && (v.active = !1);
          const S = x3({
            char: n,
            allowSpaces: r,
            allowedPrefixes: i,
            startOfLine: s,
            $position: m.$from
          }), k = `id_${Math.floor(Math.random() * 4294967295)}`;
          S && f({ editor: e, state: T, range: S.range }) ? (v.active = !0, v.decorationId = x.decorationId ? x.decorationId : k, v.range = S.range, v.query = S.query, v.text = S.text) : v.active = !1;
        } else
          v.active = !1;
        return v.active || (v.decorationId = null, v.range = { from: 0, to: 0 }, v.query = null, v.text = null), v;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(w, x) {
        var E;
        const { active: T, range: P } = y.getState(w.state);
        return T && ((E = g?.onKeyDown) === null || E === void 0 ? void 0 : E.call(g, { view: w, event: x, range: P })) || !1;
      },
      // Setup decorator on the currently active suggestion.
      decorations(w) {
        const { active: x, range: E, decorationId: T } = y.getState(w);
        return x ? xe.create(w.doc, [
          lt.inline(E.from, E.to, {
            nodeName: o,
            class: a,
            "data-decoration-id": T
          })
        ]) : null;
      }
    }
  });
  return y;
}
const E3 = new tt("mention");
Ce.create({
  name: "mention",
  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options: t, node: e }) {
        var n;
        return `${t.suggestion.char}${(n = e.attrs.label) !== null && n !== void 0 ? n : e.attrs.id}`;
      },
      suggestion: {
        char: "@",
        pluginKey: E3,
        command: ({ editor: t, range: e, props: n }) => {
          var r, i;
          const s = t.view.state.selection.$to.nodeAfter;
          ((r = s?.text) === null || r === void 0 ? void 0 : r.startsWith(" ")) && (e.to += 1), t.chain().focus().insertContentAt(e, [
            {
              type: this.name,
              attrs: n
            },
            {
              type: "text",
              text: " "
            }
          ]).run(), (i = window.getSelection()) === null || i === void 0 || i.collapseToEnd();
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
    return [
      "span",
      ge({ "data-type": this.name }, this.options.HTMLAttributes, e),
      this.options.renderLabel({
        options: this.options,
        node: t
      })
    ];
  },
  renderText({ node: t }) {
    return this.options.renderLabel({
      options: this.options,
      node: t
    });
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr: t, state: e }) => {
        let n = !1;
        const { selection: r } = e, { empty: i, anchor: s } = r;
        return i ? (e.doc.nodesBetween(s - 1, s, (o, a) => {
          if (o.type.name === this.name)
            return n = !0, t.insertText(this.options.suggestion.char || "", a, a + o.nodeSize), !1;
        }), n) : !1;
      })
    };
  },
  addProseMirrorPlugins() {
    return [
      C3({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
var M3 = { exports: {} };
(function(t) {
  (function() {
    function e(u) {
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
      if (u === !1)
        return JSON.parse(JSON.stringify(m));
      var h = {};
      for (var b in m)
        m.hasOwnProperty(b) && (h[b] = m[b].defaultValue);
      return h;
    }
    function n() {
      var u = e(!0), m = {};
      for (var h in u)
        u.hasOwnProperty(h) && (m[h] = !0);
      return m;
    }
    var r = {}, i = {}, s = {}, o = e(!0), a = "vanilla", l = {
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
    r.helper = {}, r.extensions = {}, r.setOption = function(u, m) {
      return o[u] = m, this;
    }, r.getOption = function(u) {
      return o[u];
    }, r.getOptions = function() {
      return o;
    }, r.resetOptions = function() {
      o = e(!0);
    }, r.setFlavor = function(u) {
      if (!l.hasOwnProperty(u))
        throw Error(u + " flavor was not found");
      r.resetOptions();
      var m = l[u];
      a = u;
      for (var h in m)
        m.hasOwnProperty(h) && (o[h] = m[h]);
    }, r.getFlavor = function() {
      return a;
    }, r.getFlavorOptions = function(u) {
      if (l.hasOwnProperty(u))
        return l[u];
    }, r.getDefaultOptions = function(u) {
      return e(u);
    }, r.subParser = function(u, m) {
      if (r.helper.isString(u))
        if (typeof m < "u")
          i[u] = m;
        else {
          if (i.hasOwnProperty(u))
            return i[u];
          throw Error("SubParser named " + u + " not registered!");
        }
    }, r.extension = function(u, m) {
      if (!r.helper.isString(u))
        throw Error("Extension 'name' must be a string");
      if (u = r.helper.stdExtName(u), r.helper.isUndefined(m)) {
        if (!s.hasOwnProperty(u))
          throw Error("Extension named " + u + " is not registered!");
        return s[u];
      } else {
        typeof m == "function" && (m = m()), r.helper.isArray(m) || (m = [m]);
        var h = c(m, u);
        if (h.valid)
          s[u] = m;
        else
          throw Error(h.error);
      }
    }, r.getAllExtensions = function() {
      return s;
    }, r.removeExtension = function(u) {
      delete s[u];
    }, r.resetExtensions = function() {
      s = {};
    };
    function c(u, m) {
      var h = m ? "Error in " + m + " extension->" : "Error in unnamed extension", b = {
        valid: !0,
        error: ""
      };
      r.helper.isArray(u) || (u = [u]);
      for (var v = 0; v < u.length; ++v) {
        var S = h + " sub-extension " + v + ": ", k = u[v];
        if (typeof k != "object")
          return b.valid = !1, b.error = S + "must be an object, but " + typeof k + " given", b;
        if (!r.helper.isString(k.type))
          return b.valid = !1, b.error = S + 'property "type" must be a string, but ' + typeof k.type + " given", b;
        var M = k.type = k.type.toLowerCase();
        if (M === "language" && (M = k.type = "lang"), M === "html" && (M = k.type = "output"), M !== "lang" && M !== "output" && M !== "listener")
          return b.valid = !1, b.error = S + "type " + M + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', b;
        if (M === "listener") {
          if (r.helper.isUndefined(k.listeners))
            return b.valid = !1, b.error = S + '. Extensions of type "listener" must have a property called "listeners"', b;
        } else if (r.helper.isUndefined(k.filter) && r.helper.isUndefined(k.regex))
          return b.valid = !1, b.error = S + M + ' extensions must define either a "regex" property or a "filter" method', b;
        if (k.listeners) {
          if (typeof k.listeners != "object")
            return b.valid = !1, b.error = S + '"listeners" property must be an object but ' + typeof k.listeners + " given", b;
          for (var j in k.listeners)
            if (k.listeners.hasOwnProperty(j) && typeof k.listeners[j] != "function")
              return b.valid = !1, b.error = S + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + j + " must be a function but " + typeof k.listeners[j] + " given", b;
        }
        if (k.filter) {
          if (typeof k.filter != "function")
            return b.valid = !1, b.error = S + '"filter" must be a function, but ' + typeof k.filter + " given", b;
        } else if (k.regex) {
          if (r.helper.isString(k.regex) && (k.regex = new RegExp(k.regex, "g")), !(k.regex instanceof RegExp))
            return b.valid = !1, b.error = S + '"regex" property must either be a string or a RegExp object, but ' + typeof k.regex + " given", b;
          if (r.helper.isUndefined(k.replace))
            return b.valid = !1, b.error = S + '"regex" extensions must implement a replace string or function', b;
        }
      }
      return b;
    }
    r.validateExtension = function(u) {
      var m = c(u, null);
      return m.valid ? !0 : (console.warn(m.error), !1);
    }, r.hasOwnProperty("helper") || (r.helper = {}), r.helper.isString = function(u) {
      return typeof u == "string" || u instanceof String;
    }, r.helper.isFunction = function(u) {
      var m = {};
      return u && m.toString.call(u) === "[object Function]";
    }, r.helper.isArray = function(u) {
      return Array.isArray(u);
    }, r.helper.isUndefined = function(u) {
      return typeof u > "u";
    }, r.helper.forEach = function(u, m) {
      if (r.helper.isUndefined(u))
        throw new Error("obj param is required");
      if (r.helper.isUndefined(m))
        throw new Error("callback param is required");
      if (!r.helper.isFunction(m))
        throw new Error("callback param must be a function/closure");
      if (typeof u.forEach == "function")
        u.forEach(m);
      else if (r.helper.isArray(u))
        for (var h = 0; h < u.length; h++)
          m(u[h], h, u);
      else if (typeof u == "object")
        for (var b in u)
          u.hasOwnProperty(b) && m(u[b], b, u);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, r.helper.stdExtName = function(u) {
      return u.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function d(u, m) {
      var h = m.charCodeAt(0);
      return "¨E" + h + "E";
    }
    r.helper.escapeCharactersCallback = d, r.helper.escapeCharacters = function(u, m, h) {
      var b = "([" + m.replace(/([\[\]\\])/g, "\\$1") + "])";
      h && (b = "\\\\" + b);
      var v = new RegExp(b, "g");
      return u = u.replace(v, d), u;
    }, r.helper.unescapeHTMLEntities = function(u) {
      return u.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var f = function(u, m, h, b) {
      var v = b || "", S = v.indexOf("g") > -1, k = new RegExp(m + "|" + h, "g" + v.replace(/g/g, "")), M = new RegExp(m, v.replace(/g/g, "")), j = [], R, N, z, _, O;
      do
        for (R = 0; z = k.exec(u); )
          if (M.test(z[0]))
            R++ || (N = k.lastIndex, _ = N - z[0].length);
          else if (R && !--R) {
            O = z.index + z[0].length;
            var L = {
              left: { start: _, end: N },
              match: { start: N, end: z.index },
              right: { start: z.index, end: O },
              wholeMatch: { start: _, end: O }
            };
            if (j.push(L), !S)
              return j;
          }
      while (R && (k.lastIndex = N));
      return j;
    };
    r.helper.matchRecursiveRegExp = function(u, m, h, b) {
      for (var v = f(u, m, h, b), S = [], k = 0; k < v.length; ++k)
        S.push([
          u.slice(v[k].wholeMatch.start, v[k].wholeMatch.end),
          u.slice(v[k].match.start, v[k].match.end),
          u.slice(v[k].left.start, v[k].left.end),
          u.slice(v[k].right.start, v[k].right.end)
        ]);
      return S;
    }, r.helper.replaceRecursiveRegExp = function(u, m, h, b, v) {
      if (!r.helper.isFunction(m)) {
        var S = m;
        m = function() {
          return S;
        };
      }
      var k = f(u, h, b, v), M = u, j = k.length;
      if (j > 0) {
        var R = [];
        k[0].wholeMatch.start !== 0 && R.push(u.slice(0, k[0].wholeMatch.start));
        for (var N = 0; N < j; ++N)
          R.push(
            m(
              u.slice(k[N].wholeMatch.start, k[N].wholeMatch.end),
              u.slice(k[N].match.start, k[N].match.end),
              u.slice(k[N].left.start, k[N].left.end),
              u.slice(k[N].right.start, k[N].right.end)
            )
          ), N < j - 1 && R.push(u.slice(k[N].wholeMatch.end, k[N + 1].wholeMatch.start));
        k[j - 1].wholeMatch.end < u.length && R.push(u.slice(k[j - 1].wholeMatch.end)), M = R.join("");
      }
      return M;
    }, r.helper.regexIndexOf = function(u, m, h) {
      if (!r.helper.isString(u))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(m instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var b = u.substring(h || 0).search(m);
      return b >= 0 ? b + (h || 0) : b;
    }, r.helper.splitAtIndex = function(u, m) {
      if (!r.helper.isString(u))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [u.substring(0, m), u.substring(m)];
    }, r.helper.encodeEmailAddress = function(u) {
      var m = [
        function(h) {
          return "&#" + h.charCodeAt(0) + ";";
        },
        function(h) {
          return "&#x" + h.charCodeAt(0).toString(16) + ";";
        },
        function(h) {
          return h;
        }
      ];
      return u = u.replace(/./g, function(h) {
        if (h === "@")
          h = m[Math.floor(Math.random() * 2)](h);
        else {
          var b = Math.random();
          h = b > 0.9 ? m[2](h) : b > 0.45 ? m[1](h) : m[0](h);
        }
        return h;
      }), u;
    }, r.helper.padEnd = function(m, h, b) {
      return h = h >> 0, b = String(b || " "), m.length > h ? String(m) : (h = h - m.length, h > b.length && (b += b.repeat(h / b.length)), String(m) + b.slice(0, h));
    }, typeof console > "u" && (console = {
      warn: function(u) {
        alert(u);
      },
      log: function(u) {
        alert(u);
      },
      error: function(u) {
        throw u;
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
    }, r.Converter = function(u) {
      var m = {}, h = [], b = [], v = {}, S = a, k = {
        parsed: {},
        raw: "",
        format: ""
      };
      M();
      function M() {
        u = u || {};
        for (var _ in o)
          o.hasOwnProperty(_) && (m[_] = o[_]);
        if (typeof u == "object")
          for (var O in u)
            u.hasOwnProperty(O) && (m[O] = u[O]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof u + " was passed instead.");
        m.extensions && r.helper.forEach(m.extensions, j);
      }
      function j(_, O) {
        if (O = O || null, r.helper.isString(_))
          if (_ = r.helper.stdExtName(_), O = _, r.extensions[_]) {
            console.warn("DEPRECATION WARNING: " + _ + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), R(r.extensions[_], _);
            return;
          } else if (!r.helper.isUndefined(s[_]))
            _ = s[_];
          else
            throw Error('Extension "' + _ + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof _ == "function" && (_ = _()), r.helper.isArray(_) || (_ = [_]);
        var L = c(_, O);
        if (!L.valid)
          throw Error(L.error);
        for (var W = 0; W < _.length; ++W) {
          switch (_[W].type) {
            case "lang":
              h.push(_[W]);
              break;
            case "output":
              b.push(_[W]);
              break;
          }
          if (_[W].hasOwnProperty("listeners"))
            for (var te in _[W].listeners)
              _[W].listeners.hasOwnProperty(te) && N(te, _[W].listeners[te]);
        }
      }
      function R(_, O) {
        typeof _ == "function" && (_ = _(new r.Converter())), r.helper.isArray(_) || (_ = [_]);
        var L = c(_, O);
        if (!L.valid)
          throw Error(L.error);
        for (var W = 0; W < _.length; ++W)
          switch (_[W].type) {
            case "lang":
              h.push(_[W]);
              break;
            case "output":
              b.push(_[W]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function N(_, O) {
        if (!r.helper.isString(_))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof _ + " given");
        if (typeof O != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof O + " given");
        v.hasOwnProperty(_) || (v[_] = []), v[_].push(O);
      }
      function z(_) {
        var O = _.match(/^\s*/)[0].length, L = new RegExp("^\\s{0," + O + "}", "gm");
        return _.replace(L, "");
      }
      this._dispatch = function(O, L, W, te) {
        if (v.hasOwnProperty(O))
          for (var K = 0; K < v[O].length; ++K) {
            var ae = v[O][K](O, L, this, W, te);
            ae && typeof ae < "u" && (L = ae);
          }
        return L;
      }, this.listen = function(_, O) {
        return N(_, O), this;
      }, this.makeHtml = function(_) {
        if (!_)
          return _;
        var O = {
          gHtmlBlocks: [],
          gHtmlMdBlocks: [],
          gHtmlSpans: [],
          gUrls: {},
          gTitles: {},
          gDimensions: {},
          gListLevel: 0,
          hashLinkCounts: {},
          langExtensions: h,
          outputModifiers: b,
          converter: this,
          ghCodeBlocks: [],
          metadata: {
            parsed: {},
            raw: "",
            format: ""
          }
        };
        return _ = _.replace(/¨/g, "¨T"), _ = _.replace(/\$/g, "¨D"), _ = _.replace(/\r\n/g, `
`), _ = _.replace(/\r/g, `
`), _ = _.replace(/\u00A0/g, "&nbsp;"), m.smartIndentationFix && (_ = z(_)), _ = `

` + _ + `

`, _ = r.subParser("detab")(_, m, O), _ = _.replace(/^[ \t]+$/mg, ""), r.helper.forEach(h, function(L) {
          _ = r.subParser("runExtension")(L, _, m, O);
        }), _ = r.subParser("metadata")(_, m, O), _ = r.subParser("hashPreCodeTags")(_, m, O), _ = r.subParser("githubCodeBlocks")(_, m, O), _ = r.subParser("hashHTMLBlocks")(_, m, O), _ = r.subParser("hashCodeTags")(_, m, O), _ = r.subParser("stripLinkDefinitions")(_, m, O), _ = r.subParser("blockGamut")(_, m, O), _ = r.subParser("unhashHTMLSpans")(_, m, O), _ = r.subParser("unescapeSpecialChars")(_, m, O), _ = _.replace(/¨D/g, "$$"), _ = _.replace(/¨T/g, "¨"), _ = r.subParser("completeHTMLDocument")(_, m, O), r.helper.forEach(b, function(L) {
          _ = r.subParser("runExtension")(L, _, m, O);
        }), k = O.metadata, _;
      }, this.makeMarkdown = this.makeMd = function(_, O) {
        if (_ = _.replace(/\r\n/g, `
`), _ = _.replace(/\r/g, `
`), _ = _.replace(/>[ \t]+</, ">¨NBSP;<"), !O)
          if (window && window.document)
            O = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var L = O.createElement("div");
        L.innerHTML = _;
        var W = {
          preList: Ee(L)
        };
        ye(L);
        for (var te = L.childNodes, K = "", ae = 0; ae < te.length; ae++)
          K += r.subParser("makeMarkdown.node")(te[ae], W);
        function ye(Me) {
          for (var ve = 0; ve < Me.childNodes.length; ++ve) {
            var Le = Me.childNodes[ve];
            Le.nodeType === 3 ? !/\S/.test(Le.nodeValue) && !/^[ ]+$/.test(Le.nodeValue) ? (Me.removeChild(Le), --ve) : (Le.nodeValue = Le.nodeValue.split(`
`).join(" "), Le.nodeValue = Le.nodeValue.replace(/(\s)+/g, "$1")) : Le.nodeType === 1 && ye(Le);
          }
        }
        function Ee(Me) {
          for (var ve = Me.querySelectorAll("pre"), Le = [], Je = 0; Je < ve.length; ++Je)
            if (ve[Je].childElementCount === 1 && ve[Je].firstChild.tagName.toLowerCase() === "code") {
              var Lt = ve[Je].firstChild.innerHTML.trim(), Pn = ve[Je].firstChild.getAttribute("data-language") || "";
              if (Pn === "")
                for (var ir = ve[Je].firstChild.className.split(" "), C = 0; C < ir.length; ++C) {
                  var A = ir[C].match(/^language-(.+)$/);
                  if (A !== null) {
                    Pn = A[1];
                    break;
                  }
                }
              Lt = r.helper.unescapeHTMLEntities(Lt), Le.push(Lt), ve[Je].outerHTML = '<precode language="' + Pn + '" precodenum="' + Je.toString() + '"></precode>';
            } else
              Le.push(ve[Je].innerHTML), ve[Je].innerHTML = "", ve[Je].setAttribute("prenum", Je.toString());
          return Le;
        }
        return K;
      }, this.setOption = function(_, O) {
        m[_] = O;
      }, this.getOption = function(_) {
        return m[_];
      }, this.getOptions = function() {
        return m;
      }, this.addExtension = function(_, O) {
        O = O || null, j(_, O);
      }, this.useExtension = function(_) {
        j(_);
      }, this.setFlavor = function(_) {
        if (!l.hasOwnProperty(_))
          throw Error(_ + " flavor was not found");
        var O = l[_];
        S = _;
        for (var L in O)
          O.hasOwnProperty(L) && (m[L] = O[L]);
      }, this.getFlavor = function() {
        return S;
      }, this.removeExtension = function(_) {
        r.helper.isArray(_) || (_ = [_]);
        for (var O = 0; O < _.length; ++O) {
          for (var L = _[O], W = 0; W < h.length; ++W)
            h[W] === L && h.splice(W, 1);
          for (var te = 0; te < b.length; ++te)
            b[te] === L && b.splice(te, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: h,
          output: b
        };
      }, this.getMetadata = function(_) {
        return _ ? k.raw : k.parsed;
      }, this.getMetadataFormat = function() {
        return k.format;
      }, this._setMetadataPair = function(_, O) {
        k.parsed[_] = O;
      }, this._setMetadataFormat = function(_) {
        k.format = _;
      }, this._setMetadataRaw = function(_) {
        k.raw = _;
      };
    }, r.subParser("anchors", function(u, m, h) {
      u = h.converter._dispatch("anchors.before", u, m, h);
      var b = function(v, S, k, M, j, R, N) {
        if (r.helper.isUndefined(N) && (N = ""), k = k.toLowerCase(), v.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          M = "";
        else if (!M)
          if (k || (k = S.toLowerCase().replace(/ ?\n/g, " ")), M = "#" + k, !r.helper.isUndefined(h.gUrls[k]))
            M = h.gUrls[k], r.helper.isUndefined(h.gTitles[k]) || (N = h.gTitles[k]);
          else
            return v;
        M = M.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var z = '<a href="' + M + '"';
        return N !== "" && N !== null && (N = N.replace(/"/g, "&quot;"), N = N.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), z += ' title="' + N + '"'), m.openLinksInNewWindow && !/^#/.test(M) && (z += ' rel="noopener noreferrer" target="¨E95Eblank"'), z += ">" + S + "</a>", z;
      };
      return u = u.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, b), u = u.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        b
      ), u = u.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        b
      ), u = u.replace(/\[([^\[\]]+)]()()()()()/g, b), m.ghMentions && (u = u.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(v, S, k, M, j) {
        if (k === "\\")
          return S + M;
        if (!r.helper.isString(m.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var R = m.ghMentionsLink.replace(/\{u}/g, j), N = "";
        return m.openLinksInNewWindow && (N = ' rel="noopener noreferrer" target="¨E95Eblank"'), S + '<a href="' + R + '"' + N + ">" + M + "</a>";
      })), u = h.converter._dispatch("anchors.after", u, m, h), u;
    });
    var p = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, g = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, y = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, w = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, x = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, E = function(u) {
      return function(m, h, b, v, S, k, M) {
        b = b.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var j = b, R = "", N = "", z = h || "", _ = M || "";
        return /^www\./i.test(b) && (b = b.replace(/^www\./i, "http://www.")), u.excludeTrailingPunctuationFromURLs && k && (R = k), u.openLinksInNewWindow && (N = ' rel="noopener noreferrer" target="¨E95Eblank"'), z + '<a href="' + b + '"' + N + ">" + j + "</a>" + R + _;
      };
    }, T = function(u, m) {
      return function(h, b, v) {
        var S = "mailto:";
        return b = b || "", v = r.subParser("unescapeSpecialChars")(v, u, m), u.encodeEmails ? (S = r.helper.encodeEmailAddress(S + v), v = r.helper.encodeEmailAddress(v)) : S = S + v, b + '<a href="' + S + '">' + v + "</a>";
      };
    };
    r.subParser("autoLinks", function(u, m, h) {
      return u = h.converter._dispatch("autoLinks.before", u, m, h), u = u.replace(y, E(m)), u = u.replace(x, T(m, h)), u = h.converter._dispatch("autoLinks.after", u, m, h), u;
    }), r.subParser("simplifiedAutoLinks", function(u, m, h) {
      return m.simplifiedAutoLink && (u = h.converter._dispatch("simplifiedAutoLinks.before", u, m, h), m.excludeTrailingPunctuationFromURLs ? u = u.replace(g, E(m)) : u = u.replace(p, E(m)), u = u.replace(w, T(m, h)), u = h.converter._dispatch("simplifiedAutoLinks.after", u, m, h)), u;
    }), r.subParser("blockGamut", function(u, m, h) {
      return u = h.converter._dispatch("blockGamut.before", u, m, h), u = r.subParser("blockQuotes")(u, m, h), u = r.subParser("headers")(u, m, h), u = r.subParser("horizontalRule")(u, m, h), u = r.subParser("lists")(u, m, h), u = r.subParser("codeBlocks")(u, m, h), u = r.subParser("tables")(u, m, h), u = r.subParser("hashHTMLBlocks")(u, m, h), u = r.subParser("paragraphs")(u, m, h), u = h.converter._dispatch("blockGamut.after", u, m, h), u;
    }), r.subParser("blockQuotes", function(u, m, h) {
      u = h.converter._dispatch("blockQuotes.before", u, m, h), u = u + `

`;
      var b = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return m.splitAdjacentBlockquotes && (b = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), u = u.replace(b, function(v) {
        return v = v.replace(/^[ \t]*>[ \t]?/gm, ""), v = v.replace(/¨0/g, ""), v = v.replace(/^[ \t]+$/gm, ""), v = r.subParser("githubCodeBlocks")(v, m, h), v = r.subParser("blockGamut")(v, m, h), v = v.replace(/(^|\n)/g, "$1  "), v = v.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(S, k) {
          var M = k;
          return M = M.replace(/^  /mg, "¨0"), M = M.replace(/¨0/g, ""), M;
        }), r.subParser("hashBlock")(`<blockquote>
` + v + `
</blockquote>`, m, h);
      }), u = h.converter._dispatch("blockQuotes.after", u, m, h), u;
    }), r.subParser("codeBlocks", function(u, m, h) {
      u = h.converter._dispatch("codeBlocks.before", u, m, h), u += "¨0";
      var b = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return u = u.replace(b, function(v, S, k) {
        var M = S, j = k, R = `
`;
        return M = r.subParser("outdent")(M, m, h), M = r.subParser("encodeCode")(M, m, h), M = r.subParser("detab")(M, m, h), M = M.replace(/^\n+/g, ""), M = M.replace(/\n+$/g, ""), m.omitExtraWLInCodeBlocks && (R = ""), M = "<pre><code>" + M + R + "</code></pre>", r.subParser("hashBlock")(M, m, h) + j;
      }), u = u.replace(/¨0/, ""), u = h.converter._dispatch("codeBlocks.after", u, m, h), u;
    }), r.subParser("codeSpans", function(u, m, h) {
      return u = h.converter._dispatch("codeSpans.before", u, m, h), typeof u > "u" && (u = ""), u = u.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(b, v, S, k) {
          var M = k;
          return M = M.replace(/^([ \t]*)/g, ""), M = M.replace(/[ \t]*$/g, ""), M = r.subParser("encodeCode")(M, m, h), M = v + "<code>" + M + "</code>", M = r.subParser("hashHTMLSpans")(M, m, h), M;
        }
      ), u = h.converter._dispatch("codeSpans.after", u, m, h), u;
    }), r.subParser("completeHTMLDocument", function(u, m, h) {
      if (!m.completeHTMLDocument)
        return u;
      u = h.converter._dispatch("completeHTMLDocument.before", u, m, h);
      var b = "html", v = `<!DOCTYPE HTML>
`, S = "", k = `<meta charset="utf-8">
`, M = "", j = "";
      typeof h.metadata.parsed.doctype < "u" && (v = "<!DOCTYPE " + h.metadata.parsed.doctype + `>
`, b = h.metadata.parsed.doctype.toString().toLowerCase(), (b === "html" || b === "html5") && (k = '<meta charset="utf-8">'));
      for (var R in h.metadata.parsed)
        if (h.metadata.parsed.hasOwnProperty(R))
          switch (R.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              S = "<title>" + h.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              b === "html" || b === "html5" ? k = '<meta charset="' + h.metadata.parsed.charset + `">
` : k = '<meta name="charset" content="' + h.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              M = ' lang="' + h.metadata.parsed[R] + '"', j += '<meta name="' + R + '" content="' + h.metadata.parsed[R] + `">
`;
              break;
            default:
              j += '<meta name="' + R + '" content="' + h.metadata.parsed[R] + `">
`;
          }
      return u = v + "<html" + M + `>
<head>
` + S + k + j + `</head>
<body>
` + u.trim() + `
</body>
</html>`, u = h.converter._dispatch("completeHTMLDocument.after", u, m, h), u;
    }), r.subParser("detab", function(u, m, h) {
      return u = h.converter._dispatch("detab.before", u, m, h), u = u.replace(/\t(?=\t)/g, "    "), u = u.replace(/\t/g, "¨A¨B"), u = u.replace(/¨B(.+?)¨A/g, function(b, v) {
        for (var S = v, k = 4 - S.length % 4, M = 0; M < k; M++)
          S += " ";
        return S;
      }), u = u.replace(/¨A/g, "    "), u = u.replace(/¨B/g, ""), u = h.converter._dispatch("detab.after", u, m, h), u;
    }), r.subParser("ellipsis", function(u, m, h) {
      return m.ellipsis && (u = h.converter._dispatch("ellipsis.before", u, m, h), u = u.replace(/\.\.\./g, "…"), u = h.converter._dispatch("ellipsis.after", u, m, h)), u;
    }), r.subParser("emoji", function(u, m, h) {
      if (!m.emoji)
        return u;
      u = h.converter._dispatch("emoji.before", u, m, h);
      var b = /:([\S]+?):/g;
      return u = u.replace(b, function(v, S) {
        return r.helper.emojis.hasOwnProperty(S) ? r.helper.emojis[S] : v;
      }), u = h.converter._dispatch("emoji.after", u, m, h), u;
    }), r.subParser("encodeAmpsAndAngles", function(u, m, h) {
      return u = h.converter._dispatch("encodeAmpsAndAngles.before", u, m, h), u = u.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), u = u.replace(/<(?![a-z\/?$!])/gi, "&lt;"), u = u.replace(/</g, "&lt;"), u = u.replace(/>/g, "&gt;"), u = h.converter._dispatch("encodeAmpsAndAngles.after", u, m, h), u;
    }), r.subParser("encodeBackslashEscapes", function(u, m, h) {
      return u = h.converter._dispatch("encodeBackslashEscapes.before", u, m, h), u = u.replace(/\\(\\)/g, r.helper.escapeCharactersCallback), u = u.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, r.helper.escapeCharactersCallback), u = h.converter._dispatch("encodeBackslashEscapes.after", u, m, h), u;
    }), r.subParser("encodeCode", function(u, m, h) {
      return u = h.converter._dispatch("encodeCode.before", u, m, h), u = u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, r.helper.escapeCharactersCallback), u = h.converter._dispatch("encodeCode.after", u, m, h), u;
    }), r.subParser("escapeSpecialCharsWithinTagAttributes", function(u, m, h) {
      u = h.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", u, m, h);
      var b = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, v = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return u = u.replace(b, function(S) {
        return S.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), u = u.replace(v, function(S) {
        return S.replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), u = h.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", u, m, h), u;
    }), r.subParser("githubCodeBlocks", function(u, m, h) {
      return m.ghCodeBlocks ? (u = h.converter._dispatch("githubCodeBlocks.before", u, m, h), u += "¨0", u = u.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(b, v, S, k) {
        var M = m.omitExtraWLInCodeBlocks ? "" : `
`;
        return k = r.subParser("encodeCode")(k, m, h), k = r.subParser("detab")(k, m, h), k = k.replace(/^\n+/g, ""), k = k.replace(/\n+$/g, ""), k = "<pre><code" + (S ? ' class="' + S + " language-" + S + '"' : "") + ">" + k + M + "</code></pre>", k = r.subParser("hashBlock")(k, m, h), `

¨G` + (h.ghCodeBlocks.push({ text: b, codeblock: k }) - 1) + `G

`;
      }), u = u.replace(/¨0/, ""), h.converter._dispatch("githubCodeBlocks.after", u, m, h)) : u;
    }), r.subParser("hashBlock", function(u, m, h) {
      return u = h.converter._dispatch("hashBlock.before", u, m, h), u = u.replace(/(^\n+|\n+$)/g, ""), u = `

¨K` + (h.gHtmlBlocks.push(u) - 1) + `K

`, u = h.converter._dispatch("hashBlock.after", u, m, h), u;
    }), r.subParser("hashCodeTags", function(u, m, h) {
      u = h.converter._dispatch("hashCodeTags.before", u, m, h);
      var b = function(v, S, k, M) {
        var j = k + r.subParser("encodeCode")(S, m, h) + M;
        return "¨C" + (h.gHtmlSpans.push(j) - 1) + "C";
      };
      return u = r.helper.replaceRecursiveRegExp(u, b, "<code\\b[^>]*>", "</code>", "gim"), u = h.converter._dispatch("hashCodeTags.after", u, m, h), u;
    }), r.subParser("hashElement", function(u, m, h) {
      return function(b, v) {
        var S = v;
        return S = S.replace(/\n\n/g, `
`), S = S.replace(/^\n/, ""), S = S.replace(/\n+$/g, ""), S = `

¨K` + (h.gHtmlBlocks.push(S) - 1) + `K

`, S;
      };
    }), r.subParser("hashHTMLBlocks", function(u, m, h) {
      u = h.converter._dispatch("hashHTMLBlocks.before", u, m, h);
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
      ], v = function(_, O, L, W) {
        var te = _;
        return L.search(/\bmarkdown\b/) !== -1 && (te = L + h.converter.makeHtml(O) + W), `

¨K` + (h.gHtmlBlocks.push(te) - 1) + `K

`;
      };
      m.backslashEscapesHTMLTags && (u = u.replace(/\\<(\/?[^>]+?)>/g, function(_, O) {
        return "&lt;" + O + "&gt;";
      }));
      for (var S = 0; S < b.length; ++S)
        for (var k, M = new RegExp("^ {0,3}(<" + b[S] + "\\b[^>]*>)", "im"), j = "<" + b[S] + "\\b[^>]*>", R = "</" + b[S] + ">"; (k = r.helper.regexIndexOf(u, M)) !== -1; ) {
          var N = r.helper.splitAtIndex(u, k), z = r.helper.replaceRecursiveRegExp(N[1], v, j, R, "im");
          if (z === N[1])
            break;
          u = N[0].concat(z);
        }
      return u = u.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(u, m, h)
      ), u = r.helper.replaceRecursiveRegExp(u, function(_) {
        return `

¨K` + (h.gHtmlBlocks.push(_) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), u = u.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(u, m, h)
      ), u = h.converter._dispatch("hashHTMLBlocks.after", u, m, h), u;
    }), r.subParser("hashHTMLSpans", function(u, m, h) {
      u = h.converter._dispatch("hashHTMLSpans.before", u, m, h);
      function b(v) {
        return "¨C" + (h.gHtmlSpans.push(v) - 1) + "C";
      }
      return u = u.replace(/<[^>]+?\/>/gi, function(v) {
        return b(v);
      }), u = u.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(v) {
        return b(v);
      }), u = u.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(v) {
        return b(v);
      }), u = u.replace(/<[^>]+?>/gi, function(v) {
        return b(v);
      }), u = h.converter._dispatch("hashHTMLSpans.after", u, m, h), u;
    }), r.subParser("unhashHTMLSpans", function(u, m, h) {
      u = h.converter._dispatch("unhashHTMLSpans.before", u, m, h);
      for (var b = 0; b < h.gHtmlSpans.length; ++b) {
        for (var v = h.gHtmlSpans[b], S = 0; /¨C(\d+)C/.test(v); ) {
          var k = RegExp.$1;
          if (v = v.replace("¨C" + k + "C", h.gHtmlSpans[k]), S === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++S;
        }
        u = u.replace("¨C" + b + "C", v);
      }
      return u = h.converter._dispatch("unhashHTMLSpans.after", u, m, h), u;
    }), r.subParser("hashPreCodeTags", function(u, m, h) {
      u = h.converter._dispatch("hashPreCodeTags.before", u, m, h);
      var b = function(v, S, k, M) {
        var j = k + r.subParser("encodeCode")(S, m, h) + M;
        return `

¨G` + (h.ghCodeBlocks.push({ text: v, codeblock: j }) - 1) + `G

`;
      };
      return u = r.helper.replaceRecursiveRegExp(u, b, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), u = h.converter._dispatch("hashPreCodeTags.after", u, m, h), u;
    }), r.subParser("headers", function(u, m, h) {
      u = h.converter._dispatch("headers.before", u, m, h);
      var b = isNaN(parseInt(m.headerLevelStart)) ? 1 : parseInt(m.headerLevelStart), v = m.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, S = m.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      u = u.replace(v, function(j, R) {
        var N = r.subParser("spanGamut")(R, m, h), z = m.noHeaderId ? "" : ' id="' + M(R) + '"', _ = b, O = "<h" + _ + z + ">" + N + "</h" + _ + ">";
        return r.subParser("hashBlock")(O, m, h);
      }), u = u.replace(S, function(j, R) {
        var N = r.subParser("spanGamut")(R, m, h), z = m.noHeaderId ? "" : ' id="' + M(R) + '"', _ = b + 1, O = "<h" + _ + z + ">" + N + "</h" + _ + ">";
        return r.subParser("hashBlock")(O, m, h);
      });
      var k = m.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      u = u.replace(k, function(j, R, N) {
        var z = N;
        m.customizedHeaderId && (z = N.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var _ = r.subParser("spanGamut")(z, m, h), O = m.noHeaderId ? "" : ' id="' + M(N) + '"', L = b - 1 + R.length, W = "<h" + L + O + ">" + _ + "</h" + L + ">";
        return r.subParser("hashBlock")(W, m, h);
      });
      function M(j) {
        var R, N;
        if (m.customizedHeaderId) {
          var z = j.match(/\{([^{]+?)}\s*$/);
          z && z[1] && (j = z[1]);
        }
        return R = j, r.helper.isString(m.prefixHeaderId) ? N = m.prefixHeaderId : m.prefixHeaderId === !0 ? N = "section-" : N = "", m.rawPrefixHeaderId || (R = N + R), m.ghCompatibleHeaderId ? R = R.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : m.rawHeaderId ? R = R.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : R = R.replace(/[^\w]/g, "").toLowerCase(), m.rawPrefixHeaderId && (R = N + R), h.hashLinkCounts[R] ? R = R + "-" + h.hashLinkCounts[R]++ : h.hashLinkCounts[R] = 1, R;
      }
      return u = h.converter._dispatch("headers.after", u, m, h), u;
    }), r.subParser("horizontalRule", function(u, m, h) {
      u = h.converter._dispatch("horizontalRule.before", u, m, h);
      var b = r.subParser("hashBlock")("<hr />", m, h);
      return u = u.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, b), u = u.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, b), u = u.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, b), u = h.converter._dispatch("horizontalRule.after", u, m, h), u;
    }), r.subParser("images", function(u, m, h) {
      u = h.converter._dispatch("images.before", u, m, h);
      var b = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, v = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, S = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, k = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, M = /!\[([^\[\]]+)]()()()()()/g;
      function j(N, z, _, O, L, W, te, K) {
        return O = O.replace(/\s/g, ""), R(N, z, _, O, L, W, te, K);
      }
      function R(N, z, _, O, L, W, te, K) {
        var ae = h.gUrls, ye = h.gTitles, Ee = h.gDimensions;
        if (_ = _.toLowerCase(), K || (K = ""), N.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          O = "";
        else if (O === "" || O === null)
          if ((_ === "" || _ === null) && (_ = z.toLowerCase().replace(/ ?\n/g, " ")), O = "#" + _, !r.helper.isUndefined(ae[_]))
            O = ae[_], r.helper.isUndefined(ye[_]) || (K = ye[_]), r.helper.isUndefined(Ee[_]) || (L = Ee[_].width, W = Ee[_].height);
          else
            return N;
        z = z.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), O = O.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var Me = '<img src="' + O + '" alt="' + z + '"';
        return K && r.helper.isString(K) && (K = K.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), Me += ' title="' + K + '"'), L && W && (L = L === "*" ? "auto" : L, W = W === "*" ? "auto" : W, Me += ' width="' + L + '"', Me += ' height="' + W + '"'), Me += " />", Me;
      }
      return u = u.replace(k, R), u = u.replace(S, j), u = u.replace(v, R), u = u.replace(b, R), u = u.replace(M, R), u = h.converter._dispatch("images.after", u, m, h), u;
    }), r.subParser("italicsAndBold", function(u, m, h) {
      u = h.converter._dispatch("italicsAndBold.before", u, m, h);
      function b(v, S, k) {
        return S + v + k;
      }
      return m.literalMidWordUnderscores ? (u = u.replace(/\b___(\S[\s\S]*?)___\b/g, function(v, S) {
        return b(S, "<strong><em>", "</em></strong>");
      }), u = u.replace(/\b__(\S[\s\S]*?)__\b/g, function(v, S) {
        return b(S, "<strong>", "</strong>");
      }), u = u.replace(/\b_(\S[\s\S]*?)_\b/g, function(v, S) {
        return b(S, "<em>", "</em>");
      })) : (u = u.replace(/___(\S[\s\S]*?)___/g, function(v, S) {
        return /\S$/.test(S) ? b(S, "<strong><em>", "</em></strong>") : v;
      }), u = u.replace(/__(\S[\s\S]*?)__/g, function(v, S) {
        return /\S$/.test(S) ? b(S, "<strong>", "</strong>") : v;
      }), u = u.replace(/_([^\s_][\s\S]*?)_/g, function(v, S) {
        return /\S$/.test(S) ? b(S, "<em>", "</em>") : v;
      })), m.literalMidWordAsterisks ? (u = u.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(v, S, k) {
        return b(k, S + "<strong><em>", "</em></strong>");
      }), u = u.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(v, S, k) {
        return b(k, S + "<strong>", "</strong>");
      }), u = u.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(v, S, k) {
        return b(k, S + "<em>", "</em>");
      })) : (u = u.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(v, S) {
        return /\S$/.test(S) ? b(S, "<strong><em>", "</em></strong>") : v;
      }), u = u.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(v, S) {
        return /\S$/.test(S) ? b(S, "<strong>", "</strong>") : v;
      }), u = u.replace(/\*([^\s*][\s\S]*?)\*/g, function(v, S) {
        return /\S$/.test(S) ? b(S, "<em>", "</em>") : v;
      })), u = h.converter._dispatch("italicsAndBold.after", u, m, h), u;
    }), r.subParser("lists", function(u, m, h) {
      function b(k, M) {
        h.gListLevel++, k = k.replace(/\n{2,}$/, `
`), k += "¨0";
        var j = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, R = /\n[ \t]*\n(?!¨0)/.test(k);
        return m.disableForced4SpacesIndentedSublists && (j = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), k = k.replace(j, function(N, z, _, O, L, W, te) {
          te = te && te.trim() !== "";
          var K = r.subParser("outdent")(L, m, h), ae = "";
          return W && m.tasklists && (ae = ' class="task-list-item" style="list-style-type: none;"', K = K.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var ye = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return te && (ye += " checked"), ye += ">", ye;
          })), K = K.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(ye) {
            return "¨A" + ye;
          }), z || K.search(/\n{2,}/) > -1 ? (K = r.subParser("githubCodeBlocks")(K, m, h), K = r.subParser("blockGamut")(K, m, h)) : (K = r.subParser("lists")(K, m, h), K = K.replace(/\n$/, ""), K = r.subParser("hashHTMLBlocks")(K, m, h), K = K.replace(/\n\n+/g, `

`), R ? K = r.subParser("paragraphs")(K, m, h) : K = r.subParser("spanGamut")(K, m, h)), K = K.replace("¨A", ""), K = "<li" + ae + ">" + K + `</li>
`, K;
        }), k = k.replace(/¨0/g, ""), h.gListLevel--, M && (k = k.replace(/\s+$/, "")), k;
      }
      function v(k, M) {
        if (M === "ol") {
          var j = k.match(/^ *(\d+)\./);
          if (j && j[1] !== "1")
            return ' start="' + j[1] + '"';
        }
        return "";
      }
      function S(k, M, j) {
        var R = m.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, N = m.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, z = M === "ul" ? R : N, _ = "";
        if (k.search(z) !== -1)
          (function L(W) {
            var te = W.search(z), K = v(k, M);
            te !== -1 ? (_ += `

<` + M + K + `>
` + b(W.slice(0, te), !!j) + "</" + M + `>
`, M = M === "ul" ? "ol" : "ul", z = M === "ul" ? R : N, L(W.slice(te))) : _ += `

<` + M + K + `>
` + b(W, !!j) + "</" + M + `>
`;
          })(k);
        else {
          var O = v(k, M);
          _ = `

<` + M + O + `>
` + b(k, !!j) + "</" + M + `>
`;
        }
        return _;
      }
      return u = h.converter._dispatch("lists.before", u, m, h), u += "¨0", h.gListLevel ? u = u.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(k, M, j) {
          var R = j.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return S(M, R, !0);
        }
      ) : u = u.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(k, M, j, R) {
          var N = R.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return S(j, N, !1);
        }
      ), u = u.replace(/¨0/, ""), u = h.converter._dispatch("lists.after", u, m, h), u;
    }), r.subParser("metadata", function(u, m, h) {
      if (!m.metadata)
        return u;
      u = h.converter._dispatch("metadata.before", u, m, h);
      function b(v) {
        h.metadata.raw = v, v = v.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), v = v.replace(/\n {4}/g, " "), v.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(S, k, M) {
          return h.metadata.parsed[k] = M, "";
        });
      }
      return u = u.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(v, S, k) {
        return b(k), "¨M";
      }), u = u.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(v, S, k) {
        return S && (h.metadata.format = S), b(k), "¨M";
      }), u = u.replace(/¨M/g, ""), u = h.converter._dispatch("metadata.after", u, m, h), u;
    }), r.subParser("outdent", function(u, m, h) {
      return u = h.converter._dispatch("outdent.before", u, m, h), u = u.replace(/^(\t|[ ]{1,4})/gm, "¨0"), u = u.replace(/¨0/g, ""), u = h.converter._dispatch("outdent.after", u, m, h), u;
    }), r.subParser("paragraphs", function(u, m, h) {
      u = h.converter._dispatch("paragraphs.before", u, m, h), u = u.replace(/^\n+/g, ""), u = u.replace(/\n+$/g, "");
      for (var b = u.split(/\n{2,}/g), v = [], S = b.length, k = 0; k < S; k++) {
        var M = b[k];
        M.search(/¨(K|G)(\d+)\1/g) >= 0 ? v.push(M) : M.search(/\S/) >= 0 && (M = r.subParser("spanGamut")(M, m, h), M = M.replace(/^([ \t]*)/g, "<p>"), M += "</p>", v.push(M));
      }
      for (S = v.length, k = 0; k < S; k++) {
        for (var j = "", R = v[k], N = !1; /¨(K|G)(\d+)\1/.test(R); ) {
          var z = RegExp.$1, _ = RegExp.$2;
          z === "K" ? j = h.gHtmlBlocks[_] : N ? j = r.subParser("encodeCode")(h.ghCodeBlocks[_].text, m, h) : j = h.ghCodeBlocks[_].codeblock, j = j.replace(/\$/g, "$$$$"), R = R.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, j), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(R) && (N = !0);
        }
        v[k] = R;
      }
      return u = v.join(`
`), u = u.replace(/^\n+/g, ""), u = u.replace(/\n+$/g, ""), h.converter._dispatch("paragraphs.after", u, m, h);
    }), r.subParser("runExtension", function(u, m, h, b) {
      if (u.filter)
        m = u.filter(m, b.converter, h);
      else if (u.regex) {
        var v = u.regex;
        v instanceof RegExp || (v = new RegExp(v, "g")), m = m.replace(v, u.replace);
      }
      return m;
    }), r.subParser("spanGamut", function(u, m, h) {
      return u = h.converter._dispatch("spanGamut.before", u, m, h), u = r.subParser("codeSpans")(u, m, h), u = r.subParser("escapeSpecialCharsWithinTagAttributes")(u, m, h), u = r.subParser("encodeBackslashEscapes")(u, m, h), u = r.subParser("images")(u, m, h), u = r.subParser("anchors")(u, m, h), u = r.subParser("autoLinks")(u, m, h), u = r.subParser("simplifiedAutoLinks")(u, m, h), u = r.subParser("emoji")(u, m, h), u = r.subParser("underline")(u, m, h), u = r.subParser("italicsAndBold")(u, m, h), u = r.subParser("strikethrough")(u, m, h), u = r.subParser("ellipsis")(u, m, h), u = r.subParser("hashHTMLSpans")(u, m, h), u = r.subParser("encodeAmpsAndAngles")(u, m, h), m.simpleLineBreaks ? /\n\n¨K/.test(u) || (u = u.replace(/\n+/g, `<br />
`)) : u = u.replace(/  +\n/g, `<br />
`), u = h.converter._dispatch("spanGamut.after", u, m, h), u;
    }), r.subParser("strikethrough", function(u, m, h) {
      function b(v) {
        return m.simplifiedAutoLink && (v = r.subParser("simplifiedAutoLinks")(v, m, h)), "<del>" + v + "</del>";
      }
      return m.strikethrough && (u = h.converter._dispatch("strikethrough.before", u, m, h), u = u.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(v, S) {
        return b(S);
      }), u = h.converter._dispatch("strikethrough.after", u, m, h)), u;
    }), r.subParser("stripLinkDefinitions", function(u, m, h) {
      var b = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, v = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      u += "¨0";
      var S = function(k, M, j, R, N, z, _) {
        return M = M.toLowerCase(), u.toLowerCase().split(M).length - 1 < 2 ? k : (j.match(/^data:.+?\/.+?;base64,/) ? h.gUrls[M] = j.replace(/\s/g, "") : h.gUrls[M] = r.subParser("encodeAmpsAndAngles")(j, m, h), z ? z + _ : (_ && (h.gTitles[M] = _.replace(/"|'/g, "&quot;")), m.parseImgDimensions && R && N && (h.gDimensions[M] = {
          width: R,
          height: N
        }), ""));
      };
      return u = u.replace(v, S), u = u.replace(b, S), u = u.replace(/¨0/, ""), u;
    }), r.subParser("tables", function(u, m, h) {
      if (!m.tables)
        return u;
      var b = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, v = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function S(N) {
        return /^:[ \t]*--*$/.test(N) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(N) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(N) ? ' style="text-align:center;"' : "";
      }
      function k(N, z) {
        var _ = "";
        return N = N.trim(), (m.tablesHeaderId || m.tableHeaderId) && (_ = ' id="' + N.replace(/ /g, "_").toLowerCase() + '"'), N = r.subParser("spanGamut")(N, m, h), "<th" + _ + z + ">" + N + `</th>
`;
      }
      function M(N, z) {
        var _ = r.subParser("spanGamut")(N, m, h);
        return "<td" + z + ">" + _ + `</td>
`;
      }
      function j(N, z) {
        for (var _ = `<table>
<thead>
<tr>
`, O = N.length, L = 0; L < O; ++L)
          _ += N[L];
        for (_ += `</tr>
</thead>
<tbody>
`, L = 0; L < z.length; ++L) {
          _ += `<tr>
`;
          for (var W = 0; W < O; ++W)
            _ += z[L][W];
          _ += `</tr>
`;
        }
        return _ += `</tbody>
</table>
`, _;
      }
      function R(N) {
        var z, _ = N.split(`
`);
        for (z = 0; z < _.length; ++z)
          /^ {0,3}\|/.test(_[z]) && (_[z] = _[z].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(_[z]) && (_[z] = _[z].replace(/\|[ \t]*$/, "")), _[z] = r.subParser("codeSpans")(_[z], m, h);
        var O = _[0].split("|").map(function(Me) {
          return Me.trim();
        }), L = _[1].split("|").map(function(Me) {
          return Me.trim();
        }), W = [], te = [], K = [], ae = [];
        for (_.shift(), _.shift(), z = 0; z < _.length; ++z)
          _[z].trim() !== "" && W.push(
            _[z].split("|").map(function(Me) {
              return Me.trim();
            })
          );
        if (O.length < L.length)
          return N;
        for (z = 0; z < L.length; ++z)
          K.push(S(L[z]));
        for (z = 0; z < O.length; ++z)
          r.helper.isUndefined(K[z]) && (K[z] = ""), te.push(k(O[z], K[z]));
        for (z = 0; z < W.length; ++z) {
          for (var ye = [], Ee = 0; Ee < te.length; ++Ee)
            r.helper.isUndefined(W[z][Ee]), ye.push(M(W[z][Ee], K[Ee]));
          ae.push(ye);
        }
        return j(te, ae);
      }
      return u = h.converter._dispatch("tables.before", u, m, h), u = u.replace(/\\(\|)/g, r.helper.escapeCharactersCallback), u = u.replace(b, R), u = u.replace(v, R), u = h.converter._dispatch("tables.after", u, m, h), u;
    }), r.subParser("underline", function(u, m, h) {
      return m.underline && (u = h.converter._dispatch("underline.before", u, m, h), m.literalMidWordUnderscores ? (u = u.replace(/\b___(\S[\s\S]*?)___\b/g, function(b, v) {
        return "<u>" + v + "</u>";
      }), u = u.replace(/\b__(\S[\s\S]*?)__\b/g, function(b, v) {
        return "<u>" + v + "</u>";
      })) : (u = u.replace(/___(\S[\s\S]*?)___/g, function(b, v) {
        return /\S$/.test(v) ? "<u>" + v + "</u>" : b;
      }), u = u.replace(/__(\S[\s\S]*?)__/g, function(b, v) {
        return /\S$/.test(v) ? "<u>" + v + "</u>" : b;
      })), u = u.replace(/(_)/g, r.helper.escapeCharactersCallback), u = h.converter._dispatch("underline.after", u, m, h)), u;
    }), r.subParser("unescapeSpecialChars", function(u, m, h) {
      return u = h.converter._dispatch("unescapeSpecialChars.before", u, m, h), u = u.replace(/¨E(\d+)E/g, function(b, v) {
        var S = parseInt(v);
        return String.fromCharCode(S);
      }), u = h.converter._dispatch("unescapeSpecialChars.after", u, m, h), u;
    }), r.subParser("makeMarkdown.blockquote", function(u, m) {
      var h = "";
      if (u.hasChildNodes())
        for (var b = u.childNodes, v = b.length, S = 0; S < v; ++S) {
          var k = r.subParser("makeMarkdown.node")(b[S], m);
          k !== "" && (h += k);
        }
      return h = h.trim(), h = "> " + h.split(`
`).join(`
> `), h;
    }), r.subParser("makeMarkdown.codeBlock", function(u, m) {
      var h = u.getAttribute("language"), b = u.getAttribute("precodenum");
      return "```" + h + `
` + m.preList[b] + "\n```";
    }), r.subParser("makeMarkdown.codeSpan", function(u) {
      return "`" + u.innerHTML + "`";
    }), r.subParser("makeMarkdown.emphasis", function(u, m) {
      var h = "";
      if (u.hasChildNodes()) {
        h += "*";
        for (var b = u.childNodes, v = b.length, S = 0; S < v; ++S)
          h += r.subParser("makeMarkdown.node")(b[S], m);
        h += "*";
      }
      return h;
    }), r.subParser("makeMarkdown.header", function(u, m, h) {
      var b = new Array(h + 1).join("#"), v = "";
      if (u.hasChildNodes()) {
        v = b + " ";
        for (var S = u.childNodes, k = S.length, M = 0; M < k; ++M)
          v += r.subParser("makeMarkdown.node")(S[M], m);
      }
      return v;
    }), r.subParser("makeMarkdown.hr", function() {
      return "---";
    }), r.subParser("makeMarkdown.image", function(u) {
      var m = "";
      return u.hasAttribute("src") && (m += "![" + u.getAttribute("alt") + "](", m += "<" + u.getAttribute("src") + ">", u.hasAttribute("width") && u.hasAttribute("height") && (m += " =" + u.getAttribute("width") + "x" + u.getAttribute("height")), u.hasAttribute("title") && (m += ' "' + u.getAttribute("title") + '"'), m += ")"), m;
    }), r.subParser("makeMarkdown.links", function(u, m) {
      var h = "";
      if (u.hasChildNodes() && u.hasAttribute("href")) {
        var b = u.childNodes, v = b.length;
        h = "[";
        for (var S = 0; S < v; ++S)
          h += r.subParser("makeMarkdown.node")(b[S], m);
        h += "](", h += "<" + u.getAttribute("href") + ">", u.hasAttribute("title") && (h += ' "' + u.getAttribute("title") + '"'), h += ")";
      }
      return h;
    }), r.subParser("makeMarkdown.list", function(u, m, h) {
      var b = "";
      if (!u.hasChildNodes())
        return "";
      for (var v = u.childNodes, S = v.length, k = u.getAttribute("start") || 1, M = 0; M < S; ++M)
        if (!(typeof v[M].tagName > "u" || v[M].tagName.toLowerCase() !== "li")) {
          var j = "";
          h === "ol" ? j = k.toString() + ". " : j = "- ", b += j + r.subParser("makeMarkdown.listItem")(v[M], m), ++k;
        }
      return b += `
<!-- -->
`, b.trim();
    }), r.subParser("makeMarkdown.listItem", function(u, m) {
      for (var h = "", b = u.childNodes, v = b.length, S = 0; S < v; ++S)
        h += r.subParser("makeMarkdown.node")(b[S], m);
      return /\n$/.test(h) ? h = h.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : h += `
`, h;
    }), r.subParser("makeMarkdown.node", function(u, m, h) {
      h = h || !1;
      var b = "";
      if (u.nodeType === 3)
        return r.subParser("makeMarkdown.txt")(u, m);
      if (u.nodeType === 8)
        return "<!--" + u.data + `-->

`;
      if (u.nodeType !== 1)
        return "";
      var v = u.tagName.toLowerCase();
      switch (v) {
        case "h1":
          h || (b = r.subParser("makeMarkdown.header")(u, m, 1) + `

`);
          break;
        case "h2":
          h || (b = r.subParser("makeMarkdown.header")(u, m, 2) + `

`);
          break;
        case "h3":
          h || (b = r.subParser("makeMarkdown.header")(u, m, 3) + `

`);
          break;
        case "h4":
          h || (b = r.subParser("makeMarkdown.header")(u, m, 4) + `

`);
          break;
        case "h5":
          h || (b = r.subParser("makeMarkdown.header")(u, m, 5) + `

`);
          break;
        case "h6":
          h || (b = r.subParser("makeMarkdown.header")(u, m, 6) + `

`);
          break;
        case "p":
          h || (b = r.subParser("makeMarkdown.paragraph")(u, m) + `

`);
          break;
        case "blockquote":
          h || (b = r.subParser("makeMarkdown.blockquote")(u, m) + `

`);
          break;
        case "hr":
          h || (b = r.subParser("makeMarkdown.hr")(u, m) + `

`);
          break;
        case "ol":
          h || (b = r.subParser("makeMarkdown.list")(u, m, "ol") + `

`);
          break;
        case "ul":
          h || (b = r.subParser("makeMarkdown.list")(u, m, "ul") + `

`);
          break;
        case "precode":
          h || (b = r.subParser("makeMarkdown.codeBlock")(u, m) + `

`);
          break;
        case "pre":
          h || (b = r.subParser("makeMarkdown.pre")(u, m) + `

`);
          break;
        case "table":
          h || (b = r.subParser("makeMarkdown.table")(u, m) + `

`);
          break;
        case "code":
          b = r.subParser("makeMarkdown.codeSpan")(u, m);
          break;
        case "em":
        case "i":
          b = r.subParser("makeMarkdown.emphasis")(u, m);
          break;
        case "strong":
        case "b":
          b = r.subParser("makeMarkdown.strong")(u, m);
          break;
        case "del":
          b = r.subParser("makeMarkdown.strikethrough")(u, m);
          break;
        case "a":
          b = r.subParser("makeMarkdown.links")(u, m);
          break;
        case "img":
          b = r.subParser("makeMarkdown.image")(u, m);
          break;
        default:
          b = u.outerHTML + `

`;
      }
      return b;
    }), r.subParser("makeMarkdown.paragraph", function(u, m) {
      var h = "";
      if (u.hasChildNodes())
        for (var b = u.childNodes, v = b.length, S = 0; S < v; ++S)
          h += r.subParser("makeMarkdown.node")(b[S], m);
      return h = h.trim(), h;
    }), r.subParser("makeMarkdown.pre", function(u, m) {
      var h = u.getAttribute("prenum");
      return "<pre>" + m.preList[h] + "</pre>";
    }), r.subParser("makeMarkdown.strikethrough", function(u, m) {
      var h = "";
      if (u.hasChildNodes()) {
        h += "~~";
        for (var b = u.childNodes, v = b.length, S = 0; S < v; ++S)
          h += r.subParser("makeMarkdown.node")(b[S], m);
        h += "~~";
      }
      return h;
    }), r.subParser("makeMarkdown.strong", function(u, m) {
      var h = "";
      if (u.hasChildNodes()) {
        h += "**";
        for (var b = u.childNodes, v = b.length, S = 0; S < v; ++S)
          h += r.subParser("makeMarkdown.node")(b[S], m);
        h += "**";
      }
      return h;
    }), r.subParser("makeMarkdown.table", function(u, m) {
      var h = "", b = [[], []], v = u.querySelectorAll("thead>tr>th"), S = u.querySelectorAll("tbody>tr"), k, M;
      for (k = 0; k < v.length; ++k) {
        var j = r.subParser("makeMarkdown.tableCell")(v[k], m), R = "---";
        if (v[k].hasAttribute("style")) {
          var N = v[k].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (N) {
            case "text-align:left;":
              R = ":---";
              break;
            case "text-align:right;":
              R = "---:";
              break;
            case "text-align:center;":
              R = ":---:";
              break;
          }
        }
        b[0][k] = j.trim(), b[1][k] = R;
      }
      for (k = 0; k < S.length; ++k) {
        var z = b.push([]) - 1, _ = S[k].getElementsByTagName("td");
        for (M = 0; M < v.length; ++M) {
          var O = " ";
          typeof _[M] < "u" && (O = r.subParser("makeMarkdown.tableCell")(_[M], m)), b[z].push(O);
        }
      }
      var L = 3;
      for (k = 0; k < b.length; ++k)
        for (M = 0; M < b[k].length; ++M) {
          var W = b[k][M].length;
          W > L && (L = W);
        }
      for (k = 0; k < b.length; ++k) {
        for (M = 0; M < b[k].length; ++M)
          k === 1 ? b[k][M].slice(-1) === ":" ? b[k][M] = r.helper.padEnd(b[k][M].slice(-1), L - 1, "-") + ":" : b[k][M] = r.helper.padEnd(b[k][M], L, "-") : b[k][M] = r.helper.padEnd(b[k][M], L);
        h += "| " + b[k].join(" | ") + ` |
`;
      }
      return h.trim();
    }), r.subParser("makeMarkdown.tableCell", function(u, m) {
      var h = "";
      if (!u.hasChildNodes())
        return "";
      for (var b = u.childNodes, v = b.length, S = 0; S < v; ++S)
        h += r.subParser("makeMarkdown.node")(b[S], m, !0);
      return h.trim();
    }), r.subParser("makeMarkdown.txt", function(u) {
      var m = u.nodeValue;
      return m = m.replace(/ +/g, " "), m = m.replace(/¨NBSP;/g, " "), m = r.helper.unescapeHTMLEntities(m), m = m.replace(/([*_~|`])/g, "\\$1"), m = m.replace(/^(\s*)>/g, "\\$1>"), m = m.replace(/^#/gm, "\\#"), m = m.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), m = m.replace(/^( {0,3}\d+)\./gm, "$1\\."), m = m.replace(/^( {0,3})([+-])/gm, "$1\\$2"), m = m.replace(/]([\s]*)\(/g, "\\]$1\\("), m = m.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), m;
    });
    var P = this;
    t.exports ? t.exports = r : P.showdown = r;
  }).call(hl);
})(M3);
qs([]);
let A3 = document.querySelector('link[rel="icon"]');
A3.href;
bi({});
bi({});
const Jt = /* @__PURE__ */ Object.create(null);
Jt.open = "0";
Jt.close = "1";
Jt.ping = "2";
Jt.pong = "3";
Jt.message = "4";
Jt.upgrade = "5";
Jt.noop = "6";
const ns = /* @__PURE__ */ Object.create(null);
Object.keys(Jt).forEach((t) => {
  ns[Jt[t]] = t;
});
const Na = { type: "error", data: "parser error" }, Op = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", jp = typeof ArrayBuffer == "function", Pp = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, Ul = ({ type: t, data: e }, n, r) => Op && e instanceof Blob ? n ? r(e) : Vu(e, r) : jp && (e instanceof ArrayBuffer || Pp(e)) ? n ? r(e) : Vu(new Blob([e]), r) : r(Jt[t] + (e || "")), Vu = (t, e) => {
  const n = new FileReader();
  return n.onload = function() {
    const r = n.result.split(",")[1];
    e("b" + (r || ""));
  }, n.readAsDataURL(t);
};
function Uu(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let Bo;
function T3(t, e) {
  if (Op && t.data instanceof Blob)
    return t.data.arrayBuffer().then(Uu).then(e);
  if (jp && (t.data instanceof ArrayBuffer || Pp(t.data)))
    return e(Uu(t.data));
  Ul(t, !1, (n) => {
    Bo || (Bo = new TextEncoder()), e(Bo.encode(n));
  });
}
const Ku = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Yr = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < Ku.length; t++)
  Yr[Ku.charCodeAt(t)] = t;
const O3 = (t) => {
  let e = t.length * 0.75, n = t.length, r, i = 0, s, o, a, l;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const c = new ArrayBuffer(e), d = new Uint8Array(c);
  for (r = 0; r < n; r += 4)
    s = Yr[t.charCodeAt(r)], o = Yr[t.charCodeAt(r + 1)], a = Yr[t.charCodeAt(r + 2)], l = Yr[t.charCodeAt(r + 3)], d[i++] = s << 2 | o >> 4, d[i++] = (o & 15) << 4 | a >> 2, d[i++] = (a & 3) << 6 | l & 63;
  return c;
}, j3 = typeof ArrayBuffer == "function", Kl = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: Np(t, e)
    };
  const n = t.charAt(0);
  return n === "b" ? {
    type: "message",
    data: P3(t.substring(1), e)
  } : ns[n] ? t.length > 1 ? {
    type: ns[n],
    data: t.substring(1)
  } : {
    type: ns[n]
  } : Na;
}, P3 = (t, e) => {
  if (j3) {
    const n = O3(t);
    return Np(n, e);
  } else
    return { base64: !0, data: t };
}, Np = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, Rp = String.fromCharCode(30), N3 = (t, e) => {
  const n = t.length, r = new Array(n);
  let i = 0;
  t.forEach((s, o) => {
    Ul(s, !1, (a) => {
      r[o] = a, ++i === n && e(r.join(Rp));
    });
  });
}, R3 = (t, e) => {
  const n = t.split(Rp), r = [];
  for (let i = 0; i < n.length; i++) {
    const s = Kl(n[i], e);
    if (r.push(s), s.type === "error")
      break;
  }
  return r;
};
function I3() {
  return new TransformStream({
    transform(t, e) {
      T3(t, (n) => {
        const r = n.length;
        let i;
        if (r < 126)
          i = new Uint8Array(1), new DataView(i.buffer).setUint8(0, r);
        else if (r < 65536) {
          i = new Uint8Array(3);
          const s = new DataView(i.buffer);
          s.setUint8(0, 126), s.setUint16(1, r);
        } else {
          i = new Uint8Array(9);
          const s = new DataView(i.buffer);
          s.setUint8(0, 127), s.setBigUint64(1, BigInt(r));
        }
        t.data && typeof t.data != "string" && (i[0] |= 128), e.enqueue(i), e.enqueue(n);
      });
    }
  });
}
let $o;
function Fi(t) {
  return t.reduce((e, n) => e + n.length, 0);
}
function Wi(t, e) {
  if (t[0].length === e)
    return t.shift();
  const n = new Uint8Array(e);
  let r = 0;
  for (let i = 0; i < e; i++)
    n[i] = t[0][r++], r === t[0].length && (t.shift(), r = 0);
  return t.length && r < t[0].length && (t[0] = t[0].slice(r)), n;
}
function L3(t, e) {
  $o || ($o = new TextDecoder());
  const n = [];
  let r = 0, i = -1, s = !1;
  return new TransformStream({
    transform(o, a) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (Fi(n) < 1)
            break;
          const l = Wi(n, 1);
          s = (l[0] & 128) === 128, i = l[0] & 127, i < 126 ? r = 3 : i === 126 ? r = 1 : r = 2;
        } else if (r === 1) {
          if (Fi(n) < 2)
            break;
          const l = Wi(n, 2);
          i = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0), r = 3;
        } else if (r === 2) {
          if (Fi(n) < 8)
            break;
          const l = Wi(n, 8), c = new DataView(l.buffer, l.byteOffset, l.length), d = c.getUint32(0);
          if (d > Math.pow(2, 53 - 32) - 1) {
            a.enqueue(Na);
            break;
          }
          i = d * Math.pow(2, 32) + c.getUint32(4), r = 3;
        } else {
          if (Fi(n) < i)
            break;
          const l = Wi(n, i);
          a.enqueue(Kl(s ? l : $o.decode(l), e)), r = 0;
        }
        if (i === 0 || i > t) {
          a.enqueue(Na);
          break;
        }
      }
    }
  });
}
const Ip = 4;
function Ne(t) {
  if (t)
    return z3(t);
}
function z3(t) {
  for (var e in Ne.prototype)
    t[e] = Ne.prototype[e];
  return t;
}
Ne.prototype.on = Ne.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
Ne.prototype.once = function(t, e) {
  function n() {
    this.off(t, n), e.apply(this, arguments);
  }
  return n.fn = e, this.on(t, n), this;
};
Ne.prototype.off = Ne.prototype.removeListener = Ne.prototype.removeAllListeners = Ne.prototype.removeEventListener = function(t, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var n = this._callbacks["$" + t];
  if (!n)
    return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + t], this;
  for (var r, i = 0; i < n.length; i++)
    if (r = n[i], r === e || r.fn === e) {
      n.splice(i, 1);
      break;
    }
  return n.length === 0 && delete this._callbacks["$" + t], this;
};
Ne.prototype.emit = function(t) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), n = this._callbacks["$" + t], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  if (n) {
    n = n.slice(0);
    for (var r = 0, i = n.length; r < i; ++r)
      n[r].apply(this, e);
  }
  return this;
};
Ne.prototype.emitReserved = Ne.prototype.emit;
Ne.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
Ne.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const vt = (() => typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")())();
function Lp(t, ...e) {
  return e.reduce((n, r) => (t.hasOwnProperty(r) && (n[r] = t[r]), n), {});
}
const D3 = vt.setTimeout, B3 = vt.clearTimeout;
function lo(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = D3.bind(vt), t.clearTimeoutFn = B3.bind(vt)) : (t.setTimeoutFn = vt.setTimeout.bind(vt), t.clearTimeoutFn = vt.clearTimeout.bind(vt));
}
const $3 = 1.33;
function H3(t) {
  return typeof t == "string" ? F3(t) : Math.ceil((t.byteLength || t.size) * $3);
}
function F3(t) {
  let e = 0, n = 0;
  for (let r = 0, i = t.length; r < i; r++)
    e = t.charCodeAt(r), e < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || e >= 57344 ? n += 3 : (r++, n += 4);
  return n;
}
function W3(t) {
  let e = "";
  for (let n in t)
    t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
  return e;
}
function V3(t) {
  let e = {}, n = t.split("&");
  for (let r = 0, i = n.length; r < i; r++) {
    let s = n[r].split("=");
    e[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
  }
  return e;
}
class U3 extends Error {
  constructor(e, n, r) {
    super(e), this.description = n, this.context = r, this.type = "TransportError";
  }
}
class ql extends Ne {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, lo(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
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
    return super.emitReserved("error", new U3(e, n, r)), this;
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
    const n = Kl(e, this.socket.binaryType);
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
    const n = W3(e);
    return n.length ? "?" + n : "";
  }
}
const zp = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), Ra = 64, K3 = {};
let qu = 0, Vi = 0, Gu;
function Ju(t) {
  let e = "";
  do
    e = zp[t % Ra] + e, t = Math.floor(t / Ra);
  while (t > 0);
  return e;
}
function Dp() {
  const t = Ju(+/* @__PURE__ */ new Date());
  return t !== Gu ? (qu = 0, Gu = t) : t + "." + Ju(qu++);
}
for (; Vi < Ra; Vi++)
  K3[zp[Vi]] = Vi;
let Bp = !1;
try {
  Bp = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const q3 = Bp;
function $p(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || q3))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new vt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function G3() {
}
const J3 = function() {
  return new $p({
    xdomain: !1
  }).responseType != null;
}();
class Y3 extends ql {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), this.polling = !1, typeof location < "u") {
      const r = location.protocol === "https:";
      let i = location.port;
      i || (i = r ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || i !== e.port;
    }
    const n = e && e.forceBase64;
    this.supportsBinary = J3 && !n, this.opts.withCredentials && (this.cookieJar = void 0);
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
    R3(e, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
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
    this.writable = !1, N3(e, (n) => {
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
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = Dp()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Creates a request.
   *
   * @param {String} method
   * @private
   */
  request(e = {}) {
    return Object.assign(e, { xd: this.xd, cookieJar: this.cookieJar }, this.opts), new Kt(this.uri(), e);
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
    r.on("success", n), r.on("error", (i, s) => {
      this.onError("xhr post error", i, s);
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
class Kt extends Ne {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, n) {
    super(), lo(this, n), this.opts = n, this.method = n.method || "GET", this.uri = e, this.data = n.data !== void 0 ? n.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const n = Lp(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this.opts.xd;
    const r = this.xhr = new $p(n);
    try {
      r.open(this.method, this.uri, !0);
      try {
        if (this.opts.extraHeaders) {
          r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
          for (let i in this.opts.extraHeaders)
            this.opts.extraHeaders.hasOwnProperty(i) && r.setRequestHeader(i, this.opts.extraHeaders[i]);
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
        var i;
        r.readyState === 3 && ((i = this.opts.cookieJar) === null || i === void 0 || i.parseCookies(r)), r.readyState === 4 && (r.status === 200 || r.status === 1223 ? this.onLoad() : this.setTimeoutFn(() => {
          this.onError(typeof r.status == "number" ? r.status : 0);
        }, 0));
      }, r.send(this.data);
    } catch (i) {
      this.setTimeoutFn(() => {
        this.onError(i);
      }, 0);
      return;
    }
    typeof document < "u" && (this.index = Kt.requestsCount++, Kt.requests[this.index] = this);
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
      if (this.xhr.onreadystatechange = G3, e)
        try {
          this.xhr.abort();
        } catch {
        }
      typeof document < "u" && delete Kt.requests[this.index], this.xhr = null;
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
Kt.requestsCount = 0;
Kt.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", Yu);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in vt ? "pagehide" : "unload";
    addEventListener(t, Yu, !1);
  }
}
function Yu() {
  for (let t in Kt.requests)
    Kt.requests.hasOwnProperty(t) && Kt.requests[t].abort();
}
const Gl = (() => typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, n) => n(e, 0))(), Ui = vt.WebSocket || vt.MozWebSocket, Xu = !0, X3 = "arraybuffer", Qu = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Q3 extends ql {
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
    const e = this.uri(), n = this.opts.protocols, r = Qu ? {} : Lp(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
    try {
      this.ws = Xu && !Qu ? n ? new Ui(e, n) : new Ui(e) : new Ui(e, n, r);
    } catch (i) {
      return this.emitReserved("error", i);
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
      const r = e[n], i = n === e.length - 1;
      Ul(r, this.supportsBinary, (s) => {
        const o = {};
        try {
          Xu && this.ws.send(s);
        } catch {
        }
        i && Gl(() => {
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
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = Dp()), this.supportsBinary || (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @private
   */
  check() {
    return !!Ui;
  }
}
class Z3 extends ql {
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
        const n = L3(Number.MAX_SAFE_INTEGER, this.socket.binaryType), r = e.readable.pipeThrough(n).getReader(), i = I3();
        i.readable.pipeTo(e.writable), this.writer = i.writable.getWriter();
        const s = () => {
          r.read().then(({ done: a, value: l }) => {
            a || (this.onPacket(l), s());
          }).catch((a) => {
          });
        };
        s();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this.writer.write(o).then(() => this.onOpen());
      });
    }));
  }
  write(e) {
    this.writable = !1;
    for (let n = 0; n < e.length; n++) {
      const r = e[n], i = n === e.length - 1;
      this.writer.write(r).then(() => {
        i && Gl(() => {
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
const ew = {
  websocket: Q3,
  webtransport: Z3,
  polling: Y3
}, tw = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, nw = [
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
function Ia(t) {
  const e = t, n = t.indexOf("["), r = t.indexOf("]");
  n != -1 && r != -1 && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
  let i = tw.exec(t || ""), s = {}, o = 14;
  for (; o--; )
    s[nw[o]] = i[o] || "";
  return n != -1 && r != -1 && (s.source = e, s.host = s.host.substring(1, s.host.length - 1).replace(/;/g, ":"), s.authority = s.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), s.ipv6uri = !0), s.pathNames = rw(s, s.path), s.queryKey = iw(s, s.query), s;
}
function rw(t, e) {
  const n = /\/{2,9}/g, r = e.replace(n, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && r.splice(0, 1), e.slice(-1) == "/" && r.splice(r.length - 1, 1), r;
}
function iw(t, e) {
  const n = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(r, i, s) {
    i && (n[i] = s);
  }), n;
}
let Hp = class fr extends Ne {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, n = {}) {
    super(), this.binaryType = X3, this.writeBuffer = [], e && typeof e == "object" && (n = e, e = null), e ? (e = Ia(e), n.hostname = e.host, n.secure = e.protocol === "https" || e.protocol === "wss", n.port = e.port, e.query && (n.query = e.query)) : n.host && (n.hostname = Ia(n.host).host), lo(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = n.transports || [
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
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = V3(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
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
    n.EIO = Ip, n.transport = e, this.id && (n.sid = this.id);
    const r = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new ew[e](r);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && fr.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
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
    fr.priorWebsocketSuccess = !1;
    const i = () => {
      r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (f) => {
        if (!r)
          if (f.type === "pong" && f.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            fr.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              r || this.readyState !== "closed" && (d(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const p = new Error("probe error");
            p.transport = n.name, this.emitReserved("upgradeError", p);
          }
      }));
    };
    function s() {
      r || (r = !0, d(), n.close(), n = null);
    }
    const o = (f) => {
      const p = new Error("probe error: " + f);
      p.transport = n.name, s(), this.emitReserved("upgradeError", p);
    };
    function a() {
      o("transport closed");
    }
    function l() {
      o("socket closed");
    }
    function c(f) {
      n && f.name !== n.name && s();
    }
    const d = () => {
      n.removeListener("open", i), n.removeListener("error", o), n.removeListener("close", a), this.off("close", l), this.off("upgrading", c);
    };
    n.once("open", i), n.once("error", o), n.once("close", a), this.once("close", l), this.once("upgrading", c), this.upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      r || n.open();
    }, 200) : n.open();
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    if (this.readyState = "open", fr.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
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
      const i = this.writeBuffer[r].data;
      if (i && (n += H3(i)), r > 0 && n > this.maxPayload)
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
  sendPacket(e, n, r, i) {
    if (typeof n == "function" && (i = n, n = void 0), typeof r == "function" && (i = r, r = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    r = r || {}, r.compress = r.compress !== !1;
    const s = {
      type: e,
      data: n,
      options: r
    };
    this.emitReserved("packetCreate", s), this.writeBuffer.push(s), i && this.once("flush", i), this.flush();
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
    fr.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
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
    const i = e.length;
    for (; r < i; r++)
      ~this.transports.indexOf(e[r]) && n.push(e[r]);
    return n;
  }
};
Hp.protocol = Ip;
function sw(t, e = "", n) {
  let r = t;
  n = n || typeof location < "u" && location, t == null && (t = n.protocol + "//" + n.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = n.protocol + t : t = n.host + t), /^(https?|wss?):\/\//.test(t) || (typeof n < "u" ? t = n.protocol + "//" + t : t = "https://" + t), r = Ia(t)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/";
  const s = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return r.id = r.protocol + "://" + s + ":" + r.port + e, r.href = r.protocol + "://" + s + (n && n.port === r.port ? "" : ":" + r.port), r;
}
const ow = typeof ArrayBuffer == "function", aw = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Fp = Object.prototype.toString, lw = typeof Blob == "function" || typeof Blob < "u" && Fp.call(Blob) === "[object BlobConstructor]", cw = typeof File == "function" || typeof File < "u" && Fp.call(File) === "[object FileConstructor]";
function Jl(t) {
  return ow && (t instanceof ArrayBuffer || aw(t)) || lw && t instanceof Blob || cw && t instanceof File;
}
function rs(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let n = 0, r = t.length; n < r; n++)
      if (rs(t[n]))
        return !0;
    return !1;
  }
  if (Jl(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return rs(t.toJSON(), !0);
  for (const n in t)
    if (Object.prototype.hasOwnProperty.call(t, n) && rs(t[n]))
      return !0;
  return !1;
}
function uw(t) {
  const e = [], n = t.data, r = t;
  return r.data = La(n, e), r.attachments = e.length, { packet: r, buffers: e };
}
function La(t, e) {
  if (!t)
    return t;
  if (Jl(t)) {
    const n = { _placeholder: !0, num: e.length };
    return e.push(t), n;
  } else if (Array.isArray(t)) {
    const n = new Array(t.length);
    for (let r = 0; r < t.length; r++)
      n[r] = La(t[r], e);
    return n;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const n = {};
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (n[r] = La(t[r], e));
    return n;
  }
  return t;
}
function dw(t, e) {
  return t.data = za(t.data, e), delete t.attachments, t;
}
function za(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let n = 0; n < t.length; n++)
      t[n] = za(t[n], e);
  else if (typeof t == "object")
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (t[n] = za(t[n], e));
  return t;
}
const fw = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], pw = 5;
var ce;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(ce || (ce = {}));
class hw {
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
    return (e.type === ce.EVENT || e.type === ce.ACK) && rs(e) ? this.encodeAsBinary({
      type: e.type === ce.EVENT ? ce.BINARY_EVENT : ce.BINARY_ACK,
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
    return (e.type === ce.BINARY_EVENT || e.type === ce.BINARY_ACK) && (n += e.attachments + "-"), e.nsp && e.nsp !== "/" && (n += e.nsp + ","), e.id != null && (n += e.id), e.data != null && (n += JSON.stringify(e.data, this.replacer)), n;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const n = uw(e), r = this.encodeAsString(n.packet), i = n.buffers;
    return i.unshift(r), i;
  }
}
function Zu(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class Yl extends Ne {
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
      const r = n.type === ce.BINARY_EVENT;
      r || n.type === ce.BINARY_ACK ? (n.type = r ? ce.EVENT : ce.ACK, this.reconstructor = new mw(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (Jl(e) || e.base64)
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
    if (ce[r.type] === void 0)
      throw new Error("unknown packet type " + r.type);
    if (r.type === ce.BINARY_EVENT || r.type === ce.BINARY_ACK) {
      const s = n + 1;
      for (; e.charAt(++n) !== "-" && n != e.length; )
        ;
      const o = e.substring(s, n);
      if (o != Number(o) || e.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      r.attachments = Number(o);
    }
    if (e.charAt(n + 1) === "/") {
      const s = n + 1;
      for (; ++n && !(e.charAt(n) === "," || n === e.length); )
        ;
      r.nsp = e.substring(s, n);
    } else
      r.nsp = "/";
    const i = e.charAt(n + 1);
    if (i !== "" && Number(i) == i) {
      const s = n + 1;
      for (; ++n; ) {
        const o = e.charAt(n);
        if (o == null || Number(o) != o) {
          --n;
          break;
        }
        if (n === e.length)
          break;
      }
      r.id = Number(e.substring(s, n + 1));
    }
    if (e.charAt(++n)) {
      const s = this.tryParse(e.substr(n));
      if (Yl.isPayloadValid(r.type, s))
        r.data = s;
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
      case ce.CONNECT:
        return Zu(n);
      case ce.DISCONNECT:
        return n === void 0;
      case ce.CONNECT_ERROR:
        return typeof n == "string" || Zu(n);
      case ce.EVENT:
      case ce.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && fw.indexOf(n[0]) === -1);
      case ce.ACK:
      case ce.BINARY_ACK:
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
class mw {
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
      const n = dw(this.reconPack, this.buffers);
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
const gw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Yl,
  Encoder: hw,
  get PacketType() {
    return ce;
  },
  protocol: pw
}, Symbol.toStringTag, { value: "Module" }));
function Mt(t, e, n) {
  return t.on(e, n), function() {
    t.off(e, n);
  };
}
const yw = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Wp extends Ne {
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
      Mt(e, "open", this.onopen.bind(this)),
      Mt(e, "packet", this.onpacket.bind(this)),
      Mt(e, "error", this.onerror.bind(this)),
      Mt(e, "close", this.onclose.bind(this))
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
    if (yw.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (n.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const r = {
      type: ce.EVENT,
      data: n
    };
    if (r.options = {}, r.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const o = this.ids++, a = n.pop();
      this._registerAckCallback(o, a), r.id = o;
    }
    const i = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
    return this.flags.volatile && (!i || !this.connected) || (this.connected ? (this.notifyOutgoingListeners(r), this.packet(r)) : this.sendBuffer.push(r)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, n) {
    var r;
    const i = (r = this.flags.timeout) !== null && r !== void 0 ? r : this._opts.ackTimeout;
    if (i === void 0) {
      this.acks[e] = n;
      return;
    }
    const s = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let o = 0; o < this.sendBuffer.length; o++)
        this.sendBuffer[o].id === e && this.sendBuffer.splice(o, 1);
      n.call(this, new Error("operation has timed out"));
    }, i);
    this.acks[e] = (...o) => {
      this.io.clearTimeoutFn(s), n.apply(this, [null, ...o]);
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
    return new Promise((i, s) => {
      n.push((o, a) => r ? o ? s(o) : i(a) : i(o)), this.emit(e, ...n);
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
    e.push((i, ...s) => r !== this._queue[0] ? void 0 : (i !== null ? r.tryCount > this._opts.retries && (this._queue.shift(), n && n(i)) : (this._queue.shift(), n && n(null, ...s)), r.pending = !1, this._drainQueue())), this._queue.push(r), this._drainQueue();
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
      type: ce.CONNECT,
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
        case ce.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case ce.EVENT:
        case ce.BINARY_EVENT:
          this.onevent(e);
          break;
        case ce.ACK:
        case ce.BINARY_ACK:
          this.onack(e);
          break;
        case ce.DISCONNECT:
          this.ondisconnect();
          break;
        case ce.CONNECT_ERROR:
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
    return function(...i) {
      r || (r = !0, n.packet({
        type: ce.ACK,
        id: e,
        data: i
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
    return this.connected && this.packet({ type: ce.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
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
function $r(t) {
  t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
}
$r.prototype.duration = function() {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), n = Math.floor(e * this.jitter * t);
    t = Math.floor(e * 10) & 1 ? t + n : t - n;
  }
  return Math.min(t, this.max) | 0;
};
$r.prototype.reset = function() {
  this.attempts = 0;
};
$r.prototype.setMin = function(t) {
  this.ms = t;
};
$r.prototype.setMax = function(t) {
  this.max = t;
};
$r.prototype.setJitter = function(t) {
  this.jitter = t;
};
class Da extends Ne {
  constructor(e, n) {
    var r;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (n = e, e = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, lo(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5), this.backoff = new $r({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = e;
    const i = n.parser || gw;
    this.encoder = new i.Encoder(), this.decoder = new i.Decoder(), this._autoConnect = n.autoConnect !== !1, this._autoConnect && this.open();
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
    this.engine = new Hp(this.uri, this.opts);
    const n = this.engine, r = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = Mt(n, "open", function() {
      r.onopen(), e && e();
    }), s = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), e ? e(a) : this.maybeReconnectOnOpen();
    }, o = Mt(n, "error", s);
    if (this._timeout !== !1) {
      const a = this._timeout, l = this.setTimeoutFn(() => {
        i(), s(new Error("timeout")), n.close();
      }, a);
      this.opts.autoUnref && l.unref(), this.subs.push(() => {
        this.clearTimeoutFn(l);
      });
    }
    return this.subs.push(i), this.subs.push(o), this;
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
    this.subs.push(Mt(e, "ping", this.onping.bind(this)), Mt(e, "data", this.ondata.bind(this)), Mt(e, "error", this.onerror.bind(this)), Mt(e, "close", this.onclose.bind(this)), Mt(this.decoder, "decoded", this.ondecoded.bind(this)));
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
    Gl(() => {
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
    return r ? this._autoConnect && !r.active && r.connect() : (r = new Wp(this, e, n), this.nsps[e] = r), r;
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
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((i) => {
          i ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", i)) : e.onreconnect();
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
const Wr = {};
function Ho(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const n = sw(t, e.path || "/socket.io"), r = n.source, i = n.id, s = n.path, o = Wr[i] && s in Wr[i].nsps, a = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let l;
  return a ? l = new Da(r, e) : (Wr[i] || (Wr[i] = new Da(r, e)), l = Wr[i]), n.query && !e.query && (e.query = n.queryKey), l.socket(n.path, e);
}
Object.assign(Ho, {
  Manager: Da,
  Socket: Wp,
  io: Ho,
  connect: Ho
});
const bw = Yt({
  name: "AuthorizationMessage",
  components: {
    Spinner: ag
  }
}), vw = { class: "flex flex-col items-center justify-center min-h-screen" }, ww = /* @__PURE__ */ me("p", null, "Please scan your employee ID to continue.", -1);
function _w(t, e, n, r, i, s) {
  const o = at("Spinner");
  return pe(), ze("div", vw, [
    De(o, { class: "w-8 mb-4" }),
    ww
  ]);
}
const kw = /* @__PURE__ */ mt(bw, [["render", _w]]), xw = {
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
    const n = qs(0), r = rf(() => {
      const s = Math.floor(n.value / 60), o = n.value % 60;
      return n.value > 0 ? `Timeout in ${s}m ${o}s` : "Session Timed Out.";
    }), i = () => {
      const s = Date.now();
      n.value = Math.floor((t.tokenExpiration - s) / 1e3);
    };
    return cm(() => {
      clearInterval(e), t.tokenExpiration && t.tokenExpiration > Date.now() && (e = setInterval(i, 1e3), i());
    }), il(() => {
      clearInterval(e);
    }), {
      timeLeftDisplay: r
    };
  }
}, Sw = { class: "text-black-500 text-h2" }, Cw = /* @__PURE__ */ me("strong", null, "Employee:", -1), Ew = {
  key: 0,
  class: "text-gray-500 text-h4"
};
function Mw(t, e, n, r, i, s) {
  return pe(), ze("div", Sw, [
    Cw,
    ll(" " + Pt(n.employeeName) + " ", 1),
    n.tokenExpiration ? (pe(), ze("div", Ew, Pt(r.timeLeftDisplay), 1)) : gn("", !0)
  ]);
}
const Aw = /* @__PURE__ */ mt(xw, [["render", Mw]]), Tw = Yt({
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
      const e = t.getUTCFullYear(), n = t.getUTCMonth() + 1, r = t.getUTCDate(), i = t.getUTCHours(), s = t.getUTCMinutes(), o = t.getUTCSeconds(), a = (c) => c < 10 ? "0" + c : c;
      return `${e}-${a(n)}-${a(r)} ${a(i - 5)}:${a(s)}:${a(o)}`;
    },
    async startTask(t) {
      this.startTime = /* @__PURE__ */ new Date(), this.start_time_frappe = this.get_time_in_string(this.startTime);
      const e = await dn("timeclock.www.job_timeclock.log_start_time_of_jobcard", { employee_id: this.employee_id, start_time: this.start_time_frappe, jobcard_name: t.name });
      e?.status === "success" ? (console.log("Start Time sent."), this.taskStarted = !0, this.start_timer(this.startTime)) : (console.log("did not work."), console.log(e.job_card));
    },
    start_timer(t) {
      this.interval = setInterval(() => {
        const n = (/* @__PURE__ */ new Date()).getTime() - t.getTime(), r = Math.floor(n / (1e3 * 60 * 60)), i = Math.floor(n % (1e3 * 60 * 60) / (1e3 * 60)), s = Math.floor(n % (1e3 * 60) / 1e3);
        this.elapsedTime = `${r.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      }, 1e3);
    },
    async stopTask(t) {
      this.endTime = /* @__PURE__ */ new Date(), this.end_time_frappe = this.get_time_in_string(this.endTime), (await dn("timeclock.www.job_timeclock.log_end_time_of_jobcard", { employee_id: this.employee_id, end_time: this.end_time_frappe, jobcard_name: t.name }))?.status === "success" ? (console.log("End Time sent."), clearInterval(this.interval), this.taskStarted = !1) : console.log("End job card did not work.");
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
});
const Ow = (t) => (tl("data-v-598c1326"), t = t(), nl(), t), jw = /* @__PURE__ */ Ow(() => /* @__PURE__ */ me("h4", { class: "font-bold text-xl justify-right" }, "Task Timer", -1)), Pw = {
  key: 2,
  class: "text-gray-700"
};
function Nw(t, e, n, r, i, s) {
  return pe(), ze("div", null, [
    jw,
    t.taskStarted === !1 && t.completed_jobCard === !1 ? (pe(), ze("button", {
      key: 0,
      class: "btn",
      onClick: e[0] || (e[0] = (o) => t.startTask(t.jobCard))
    }, "Start Timer")) : gn("", !0),
    t.taskStarted && t.completed_jobCard === !1 ? (pe(), ze("button", {
      key: 1,
      class: "stop",
      onClick: e[1] || (e[1] = (o) => t.stopTask(t.jobCard))
    }, "Stop Timer")) : gn("", !0),
    me("button", {
      class: "complete",
      onClick: e[2] || (e[2] = (...o) => t.complete_task && t.complete_task(...o))
    }, "Complete"),
    t.completed_jobCard === !1 ? (pe(), ze("p", Pw, Pt(t.elapsedTime), 1)) : gn("", !0)
  ]);
}
const Vp = /* @__PURE__ */ mt(Tw, [["render", Nw], ["__scopeId", "data-v-598c1326"]]), Rw = {}, Iw = { class: "card divide-y divide-gray-100 rounded-md border border-gray-200 flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 mt-2 mb-2" };
function Lw(t, e) {
  return pe(), ze("div", Iw, [
    Wd(t.$slots, "default")
  ]);
}
const Xl = /* @__PURE__ */ mt(Rw, [["render", Lw]]), zw = Yt({
  name: "WorkOrderWidget",
  components: {
    Card: Xl
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
  mounted() {
  }
}), Dw = { class: "flex flex-col" }, Bw = { class: "font-semibold text-xl-gray-500" }, $w = { class: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" };
function Hw(t, e, n, r, i, s) {
  const o = at("Card");
  return pe(), St(o, {
    onClick: e[0] || (e[0] = (a) => t.$emit("click", t.workOrder)),
    class: yi({ "bg-blue-100": t.isSelected })
  }, {
    default: An(() => [
      me("div", Dw, [
        me("h3", Bw, Pt(t.workOrder.production_item), 1),
        me("span", null, Pt(t.workOrder.name), 1)
      ]),
      me("span", $w, Pt(t.workOrder.status), 1)
    ]),
    _: 1
  }, 8, ["class"]);
}
const Fw = /* @__PURE__ */ mt(zw, [["render", Hw]]);
var Ww = typeof global == "object" && global && global.Object === Object && global;
const Vw = Ww;
var Uw = typeof self == "object" && self && self.Object === Object && self, Kw = Vw || Uw || Function("return this")();
const Up = Kw;
var qw = Up.Symbol;
const Bs = qw;
var Kp = Object.prototype, Gw = Kp.hasOwnProperty, Jw = Kp.toString, Vr = Bs ? Bs.toStringTag : void 0;
function Yw(t) {
  var e = Gw.call(t, Vr), n = t[Vr];
  try {
    t[Vr] = void 0;
    var r = !0;
  } catch {
  }
  var i = Jw.call(t);
  return r && (e ? t[Vr] = n : delete t[Vr]), i;
}
var Xw = Object.prototype, Qw = Xw.toString;
function Zw(t) {
  return Qw.call(t);
}
var e_ = "[object Null]", t_ = "[object Undefined]", ed = Bs ? Bs.toStringTag : void 0;
function n_(t) {
  return t == null ? t === void 0 ? t_ : e_ : ed && ed in Object(t) ? Yw(t) : Zw(t);
}
function r_(t) {
  return t != null && typeof t == "object";
}
var i_ = "[object Symbol]";
function s_(t) {
  return typeof t == "symbol" || r_(t) && n_(t) == i_;
}
var o_ = /\s/;
function a_(t) {
  for (var e = t.length; e-- && o_.test(t.charAt(e)); )
    ;
  return e;
}
var l_ = /^\s+/;
function c_(t) {
  return t && t.slice(0, a_(t) + 1).replace(l_, "");
}
function $s(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var td = 0 / 0, u_ = /^[-+]0x[0-9a-f]+$/i, d_ = /^0b[01]+$/i, f_ = /^0o[0-7]+$/i, p_ = parseInt;
function nd(t) {
  if (typeof t == "number")
    return t;
  if (s_(t))
    return td;
  if ($s(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = $s(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = c_(t);
  var n = d_.test(t);
  return n || f_.test(t) ? p_(t.slice(2), n ? 2 : 8) : u_.test(t) ? td : +t;
}
var h_ = function() {
  return Up.Date.now();
};
const Fo = h_;
var m_ = "Expected a function", g_ = Math.max, y_ = Math.min;
function is(t, e, n) {
  var r, i, s, o, a, l, c = 0, d = !1, f = !1, p = !0;
  if (typeof t != "function")
    throw new TypeError(m_);
  e = nd(e) || 0, $s(n) && (d = !!n.leading, f = "maxWait" in n, s = f ? g_(nd(n.maxWait) || 0, e) : s, p = "trailing" in n ? !!n.trailing : p);
  function g(h) {
    var b = r, v = i;
    return r = i = void 0, c = h, o = t.apply(v, b), o;
  }
  function y(h) {
    return c = h, a = setTimeout(E, e), d ? g(h) : o;
  }
  function w(h) {
    var b = h - l, v = h - c, S = e - b;
    return f ? y_(S, s - v) : S;
  }
  function x(h) {
    var b = h - l, v = h - c;
    return l === void 0 || b >= e || b < 0 || f && v >= s;
  }
  function E() {
    var h = Fo();
    if (x(h))
      return T(h);
    a = setTimeout(E, w(h));
  }
  function T(h) {
    return a = void 0, p && r ? g(h) : (r = i = void 0, o);
  }
  function P() {
    a !== void 0 && clearTimeout(a), c = 0, r = l = i = a = void 0;
  }
  function u() {
    return a === void 0 ? o : T(Fo());
  }
  function m() {
    var h = Fo(), b = x(h);
    if (r = arguments, i = this, l = h, b) {
      if (a === void 0)
        return y(l);
      if (f)
        return clearTimeout(a), a = setTimeout(E, e), g(l);
    }
    return a === void 0 && (a = setTimeout(E, e)), o;
  }
  return m.cancel = P, m.flush = u, m;
}
var b_ = "Expected a function";
function v_(t, e, n) {
  var r = !0, i = !0;
  if (typeof t != "function")
    throw new TypeError(b_);
  return $s(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), is(t, e, {
    leading: r,
    maxWait: e,
    trailing: i
  });
}
var w_ = !!(typeof window < "u" && window.document && window.document.createElement), __ = w_;
const qp = /* @__PURE__ */ ml(__);
var br = function() {
  return br = Object.assign || function(e) {
    for (var n, r = 1, i = arguments.length; r < i; r++) {
      n = arguments[r];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s]);
    }
    return e;
  }, br.apply(this, arguments);
}, pr = null, rd = null;
qp && window.addEventListener("resize", function() {
  rd !== window.devicePixelRatio && (rd = window.devicePixelRatio, pr = null);
});
function id() {
  if (pr === null) {
    if (typeof document > "u")
      return pr = 0, pr;
    var t = document.body, e = document.createElement("div");
    e.classList.add("simplebar-hide-scrollbar"), t.appendChild(e);
    var n = e.getBoundingClientRect().right;
    t.removeChild(e), pr = n;
  }
  return pr;
}
function Gp(t) {
  return !t || !t.ownerDocument || !t.ownerDocument.defaultView ? window : t.ownerDocument.defaultView;
}
function Jp(t) {
  return !t || !t.ownerDocument ? document : t.ownerDocument;
}
var Yp = function(t) {
  var e = {}, n = Array.prototype.reduce.call(t, function(r, i) {
    var s = i.name.match(/data-simplebar-(.+)/);
    if (s) {
      var o = s[1].replace(/\W+(.)/g, function(a, l) {
        return l.toUpperCase();
      });
      switch (i.value) {
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
          r[o] = i.value;
      }
    }
    return r;
  }, e);
  return n;
};
function Xp(t, e) {
  var n;
  t && (n = t.classList).add.apply(n, e.split(" "));
}
function Qp(t, e) {
  t && e.split(" ").forEach(function(n) {
    t.classList.remove(n);
  });
}
function Zp(t) {
  return ".".concat(t.split(" ").join("."));
}
var k_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getElementWindow: Gp,
  getElementDocument: Jp,
  getOptions: Yp,
  addClasses: Xp,
  removeClasses: Qp,
  classNamesToQuery: Zp
}), an = Gp, Wo = Jp, x_ = Yp, ln = Xp, cn = Qp, it = Zp, Hs = (
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
        var i = an(r.el);
        r.scrollXTicking || (i.requestAnimationFrame(r.scrollX), r.scrollXTicking = !0), r.scrollYTicking || (i.requestAnimationFrame(r.scrollY), r.scrollYTicking = !0), r.isScrolling || (r.isScrolling = !0, ln(r.el, r.classNames.scrolling)), r.showScrollbar("x"), r.showScrollbar("y"), r.onStopScrolling();
      }, this.scrollX = function() {
        r.axis.x.isOverflowing && r.positionScrollbar("x"), r.scrollXTicking = !1;
      }, this.scrollY = function() {
        r.axis.y.isOverflowing && r.positionScrollbar("y"), r.scrollYTicking = !1;
      }, this._onStopScrolling = function() {
        cn(r.el, r.classNames.scrolling), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isScrolling = !1;
      }, this.onMouseEnter = function() {
        r.isMouseEntering || (ln(r.el, r.classNames.mouseEntered), r.showScrollbar("x"), r.showScrollbar("y"), r.isMouseEntering = !0), r.onMouseEntered();
      }, this._onMouseEntered = function() {
        cn(r.el, r.classNames.mouseEntered), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isMouseEntering = !1;
      }, this._onMouseMove = function(i) {
        r.mouseX = i.clientX, r.mouseY = i.clientY, (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseMoveForAxis("x"), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseMoveForAxis("y");
      }, this.onMouseLeave = function() {
        r.onMouseMove.cancel(), (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseLeaveForAxis("x"), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseLeaveForAxis("y"), r.mouseX = -1, r.mouseY = -1;
      }, this._onWindowResize = function() {
        r.scrollbarWidth = r.getScrollbarWidth(), r.hideNativeScrollbar();
      }, this.onPointerEvent = function(i) {
        if (!(!r.axis.x.track.el || !r.axis.y.track.el || !r.axis.x.scrollbar.el || !r.axis.y.scrollbar.el)) {
          var s, o;
          r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect(), r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect(), (r.axis.x.isOverflowing || r.axis.x.forceVisible) && (s = r.isWithinBounds(r.axis.x.track.rect)), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && (o = r.isWithinBounds(r.axis.y.track.rect)), (s || o) && (i.stopPropagation(), i.type === "pointerdown" && i.pointerType !== "touch" && (s && (r.axis.x.scrollbar.rect = r.axis.x.scrollbar.el.getBoundingClientRect(), r.isWithinBounds(r.axis.x.scrollbar.rect) ? r.onDragStart(i, "x") : r.onTrackClick(i, "x")), o && (r.axis.y.scrollbar.rect = r.axis.y.scrollbar.el.getBoundingClientRect(), r.isWithinBounds(r.axis.y.scrollbar.rect) ? r.onDragStart(i, "y") : r.onTrackClick(i, "y"))));
        }
      }, this.drag = function(i) {
        var s, o, a, l, c, d, f, p, g, y, w;
        if (!(!r.draggedAxis || !r.contentWrapperEl)) {
          var x, E = r.axis[r.draggedAxis].track, T = (o = (s = E.rect) === null || s === void 0 ? void 0 : s[r.axis[r.draggedAxis].sizeAttr]) !== null && o !== void 0 ? o : 0, P = r.axis[r.draggedAxis].scrollbar, u = (l = (a = r.contentWrapperEl) === null || a === void 0 ? void 0 : a[r.axis[r.draggedAxis].scrollSizeAttr]) !== null && l !== void 0 ? l : 0, m = parseInt((d = (c = r.elStyles) === null || c === void 0 ? void 0 : c[r.axis[r.draggedAxis].sizeAttr]) !== null && d !== void 0 ? d : "0px", 10);
          i.preventDefault(), i.stopPropagation(), r.draggedAxis === "y" ? x = i.pageY : x = i.pageX;
          var h = x - ((p = (f = E.rect) === null || f === void 0 ? void 0 : f[r.axis[r.draggedAxis].offsetAttr]) !== null && p !== void 0 ? p : 0) - r.axis[r.draggedAxis].dragOffset;
          h = r.draggedAxis === "x" && r.isRtl ? ((y = (g = E.rect) === null || g === void 0 ? void 0 : g[r.axis[r.draggedAxis].sizeAttr]) !== null && y !== void 0 ? y : 0) - P.size - h : h;
          var b = h / (T - P.size), v = b * (u - m);
          r.draggedAxis === "x" && r.isRtl && (v = !((w = t.getRtlHelpers()) === null || w === void 0) && w.isScrollingToNegative ? -v : v), r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = v;
        }
      }, this.onEndDrag = function(i) {
        var s = Wo(r.el), o = an(r.el);
        i.preventDefault(), i.stopPropagation(), cn(r.el, r.classNames.dragging), s.removeEventListener("mousemove", r.drag, !0), s.removeEventListener("mouseup", r.onEndDrag, !0), r.removePreventClickId = o.setTimeout(function() {
          s.removeEventListener("click", r.preventClick, !0), s.removeEventListener("dblclick", r.preventClick, !0), r.removePreventClickId = null;
        });
      }, this.preventClick = function(i) {
        i.preventDefault(), i.stopPropagation();
      }, this.el = e, this.options = br(br({}, t.defaultOptions), n), this.classNames = br(br({}, t.defaultOptions.classNames), n.classNames), this.axis = {
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
      this.onMouseMove = v_(this._onMouseMove, 64), this.onWindowResize = is(this._onWindowResize, 64, { leading: !0 }), this.onStopScrolling = is(this._onStopScrolling, this.stopScrollDelay), this.onMouseEntered = is(this._onMouseEntered, this.stopScrollDelay), this.init();
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
      var i = t.getOffset(n), s = t.getOffset(r);
      n.scrollLeft = -999;
      var o = t.getOffset(r);
      return document.body.removeChild(n), t.rtlHelpers = {
        // determines if the scrolling is responding with negative values
        isScrollOriginAtZero: i.left !== s.left,
        // determines if the origin scrollbar position is inverted or not (positioned on left or right)
        isScrollingToNegative: s.left !== o.left
      }, t.rtlHelpers;
    }, t.prototype.getScrollbarWidth = function() {
      try {
        return this.contentWrapperEl && getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display === "none" || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style ? 0 : id();
      } catch {
        return id();
      }
    }, t.getOffset = function(e) {
      var n = e.getBoundingClientRect(), r = Wo(e), i = an(e);
      return {
        top: n.top + (i.pageYOffset || r.documentElement.scrollTop),
        left: n.left + (i.pageXOffset || r.documentElement.scrollLeft)
      };
    }, t.prototype.init = function() {
      qp && (this.initDOM(), this.rtlHelpers = t.getRtlHelpers(), this.scrollbarWidth = this.getScrollbarWidth(), this.recalculate(), this.initListeners());
    }, t.prototype.initDOM = function() {
      var e, n;
      this.wrapperEl = this.el.querySelector(it(this.classNames.wrapper)), this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector(it(this.classNames.contentWrapper)), this.contentEl = this.options.contentNode || this.el.querySelector(it(this.classNames.contentEl)), this.offsetEl = this.el.querySelector(it(this.classNames.offset)), this.maskEl = this.el.querySelector(it(this.classNames.mask)), this.placeholderEl = this.findChild(this.wrapperEl, it(this.classNames.placeholder)), this.heightAutoObserverWrapperEl = this.el.querySelector(it(this.classNames.heightAutoObserverWrapperEl)), this.heightAutoObserverEl = this.el.querySelector(it(this.classNames.heightAutoObserverEl)), this.axis.x.track.el = this.findChild(this.el, "".concat(it(this.classNames.track)).concat(it(this.classNames.horizontal))), this.axis.y.track.el = this.findChild(this.el, "".concat(it(this.classNames.track)).concat(it(this.classNames.vertical))), this.axis.x.scrollbar.el = ((e = this.axis.x.track.el) === null || e === void 0 ? void 0 : e.querySelector(it(this.classNames.scrollbar))) || null, this.axis.y.scrollbar.el = ((n = this.axis.y.track.el) === null || n === void 0 ? void 0 : n.querySelector(it(this.classNames.scrollbar))) || null, this.options.autoHide || (ln(this.axis.x.scrollbar.el, this.classNames.visible), ln(this.axis.y.scrollbar.el, this.classNames.visible));
    }, t.prototype.initListeners = function() {
      var e = this, n, r = an(this.el);
      if (this.el.addEventListener("mouseenter", this.onMouseEnter), this.el.addEventListener("pointerdown", this.onPointerEvent, !0), this.el.addEventListener("mousemove", this.onMouseMove), this.el.addEventListener("mouseleave", this.onMouseLeave), (n = this.contentWrapperEl) === null || n === void 0 || n.addEventListener("scroll", this.onScroll), r.addEventListener("resize", this.onWindowResize), !!this.contentEl) {
        if (window.ResizeObserver) {
          var i = !1, s = r.ResizeObserver || ResizeObserver;
          this.resizeObserver = new s(function() {
            i && r.requestAnimationFrame(function() {
              e.recalculate();
            });
          }), this.resizeObserver.observe(this.el), this.resizeObserver.observe(this.contentEl), r.requestAnimationFrame(function() {
            i = !0;
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
        var e = an(this.el);
        this.elStyles = e.getComputedStyle(this.el), this.isRtl = this.elStyles.direction === "rtl";
        var n = this.contentEl.offsetWidth, r = this.heightAutoObserverEl.offsetHeight <= 1, i = this.heightAutoObserverEl.offsetWidth <= 1 || n > 0, s = this.contentWrapperEl.offsetWidth, o = this.elStyles.overflowX, a = this.elStyles.overflowY;
        this.contentEl.style.padding = "".concat(this.elStyles.paddingTop, " ").concat(this.elStyles.paddingRight, " ").concat(this.elStyles.paddingBottom, " ").concat(this.elStyles.paddingLeft), this.wrapperEl.style.margin = "-".concat(this.elStyles.paddingTop, " -").concat(this.elStyles.paddingRight, " -").concat(this.elStyles.paddingBottom, " -").concat(this.elStyles.paddingLeft);
        var l = this.contentEl.scrollHeight, c = this.contentEl.scrollWidth;
        this.contentWrapperEl.style.height = r ? "auto" : "100%", this.placeholderEl.style.width = i ? "".concat(n || c, "px") : "auto", this.placeholderEl.style.height = "".concat(l, "px");
        var d = this.contentWrapperEl.offsetHeight;
        this.axis.x.isOverflowing = n !== 0 && c > n, this.axis.y.isOverflowing = l > d, this.axis.x.isOverflowing = o === "hidden" ? !1 : this.axis.x.isOverflowing, this.axis.y.isOverflowing = a === "hidden" ? !1 : this.axis.y.isOverflowing, this.axis.x.forceVisible = this.options.forceVisible === "x" || this.options.forceVisible === !0, this.axis.y.forceVisible = this.options.forceVisible === "y" || this.options.forceVisible === !0, this.hideNativeScrollbar();
        var f = this.axis.x.isOverflowing ? this.scrollbarWidth : 0, p = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
        this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > s - p, this.axis.y.isOverflowing = this.axis.y.isOverflowing && l > d - f, this.axis.x.scrollbar.size = this.getScrollbarSize("x"), this.axis.y.scrollbar.size = this.getScrollbarSize("y"), this.axis.x.scrollbar.el && (this.axis.x.scrollbar.el.style.width = "".concat(this.axis.x.scrollbar.size, "px")), this.axis.y.scrollbar.el && (this.axis.y.scrollbar.el.style.height = "".concat(this.axis.y.scrollbar.size, "px")), this.positionScrollbar("x"), this.positionScrollbar("y"), this.toggleTrackVisibility("x"), this.toggleTrackVisibility("y");
      }
    }, t.prototype.getScrollbarSize = function(e) {
      var n, r;
      if (e === void 0 && (e = "y"), !this.axis[e].isOverflowing || !this.contentEl)
        return 0;
      var i = this.contentEl[this.axis[e].scrollSizeAttr], s = (r = (n = this.axis[e].track.el) === null || n === void 0 ? void 0 : n[this.axis[e].offsetSizeAttr]) !== null && r !== void 0 ? r : 0, o = s / i, a;
      return a = Math.max(~~(o * s), this.options.scrollbarMinSize), this.options.scrollbarMaxSize && (a = Math.min(a, this.options.scrollbarMaxSize)), a;
    }, t.prototype.positionScrollbar = function(e) {
      var n, r, i;
      e === void 0 && (e = "y");
      var s = this.axis[e].scrollbar;
      if (!(!this.axis[e].isOverflowing || !this.contentWrapperEl || !s.el || !this.elStyles)) {
        var o = this.contentWrapperEl[this.axis[e].scrollSizeAttr], a = ((n = this.axis[e].track.el) === null || n === void 0 ? void 0 : n[this.axis[e].offsetSizeAttr]) || 0, l = parseInt(this.elStyles[this.axis[e].sizeAttr], 10), c = this.contentWrapperEl[this.axis[e].scrollOffsetAttr];
        c = e === "x" && this.isRtl && (!((r = t.getRtlHelpers()) === null || r === void 0) && r.isScrollOriginAtZero) ? -c : c, e === "x" && this.isRtl && (c = !((i = t.getRtlHelpers()) === null || i === void 0) && i.isScrollingToNegative ? c : -c);
        var d = c / (o - l), f = ~~((a - s.size) * d);
        f = e === "x" && this.isRtl ? -f + (a - s.size) : f, s.el.style.transform = e === "x" ? "translate3d(".concat(f, "px, 0, 0)") : "translate3d(0, ".concat(f, "px, 0)");
      }
    }, t.prototype.toggleTrackVisibility = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e].track.el, r = this.axis[e].scrollbar.el;
      !n || !r || !this.contentWrapperEl || (this.axis[e].isOverflowing || this.axis[e].forceVisible ? (n.style.visibility = "visible", this.contentWrapperEl.style[this.axis[e].overflowAttr] = "scroll", this.el.classList.add("".concat(this.classNames.scrollable, "-").concat(e))) : (n.style.visibility = "hidden", this.contentWrapperEl.style[this.axis[e].overflowAttr] = "hidden", this.el.classList.remove("".concat(this.classNames.scrollable, "-").concat(e))), this.axis[e].isOverflowing ? r.style.display = "block" : r.style.display = "none");
    }, t.prototype.showScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && !this.axis[e].scrollbar.isVisible && (ln(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !0);
    }, t.prototype.hideScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && this.axis[e].scrollbar.isVisible && (cn(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !1);
    }, t.prototype.hideNativeScrollbar = function() {
      this.offsetEl && (this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px", this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px");
    }, t.prototype.onMouseMoveForAxis = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e];
      !n.track.el || !n.scrollbar.el || (n.track.rect = n.track.el.getBoundingClientRect(), n.scrollbar.rect = n.scrollbar.el.getBoundingClientRect(), this.isWithinBounds(n.track.rect) ? (this.showScrollbar(e), ln(n.track.el, this.classNames.hover), this.isWithinBounds(n.scrollbar.rect) ? ln(n.scrollbar.el, this.classNames.hover) : cn(n.scrollbar.el, this.classNames.hover)) : (cn(n.track.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e)));
    }, t.prototype.onMouseLeaveForAxis = function(e) {
      e === void 0 && (e = "y"), cn(this.axis[e].track.el, this.classNames.hover), cn(this.axis[e].scrollbar.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e);
    }, t.prototype.onDragStart = function(e, n) {
      var r;
      n === void 0 && (n = "y");
      var i = Wo(this.el), s = an(this.el), o = this.axis[n].scrollbar, a = n === "y" ? e.pageY : e.pageX;
      this.axis[n].dragOffset = a - (((r = o.rect) === null || r === void 0 ? void 0 : r[this.axis[n].offsetAttr]) || 0), this.draggedAxis = n, ln(this.el, this.classNames.dragging), i.addEventListener("mousemove", this.drag, !0), i.addEventListener("mouseup", this.onEndDrag, !0), this.removePreventClickId === null ? (i.addEventListener("click", this.preventClick, !0), i.addEventListener("dblclick", this.preventClick, !0)) : (s.clearTimeout(this.removePreventClickId), this.removePreventClickId = null);
    }, t.prototype.onTrackClick = function(e, n) {
      var r = this, i, s, o, a;
      n === void 0 && (n = "y");
      var l = this.axis[n];
      if (!(!this.options.clickOnTrack || !l.scrollbar.el || !this.contentWrapperEl)) {
        e.preventDefault();
        var c = an(this.el);
        this.axis[n].scrollbar.rect = l.scrollbar.el.getBoundingClientRect();
        var d = this.axis[n].scrollbar, f = (s = (i = d.rect) === null || i === void 0 ? void 0 : i[this.axis[n].offsetAttr]) !== null && s !== void 0 ? s : 0, p = parseInt((a = (o = this.elStyles) === null || o === void 0 ? void 0 : o[this.axis[n].sizeAttr]) !== null && a !== void 0 ? a : "0px", 10), g = this.contentWrapperEl[this.axis[n].scrollOffsetAttr], y = n === "y" ? this.mouseY - f : this.mouseX - f, w = y < 0 ? -1 : 1, x = w === -1 ? g - p : g + p, E = 40, T = function() {
          r.contentWrapperEl && (w === -1 ? g > x && (g -= E, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = g, c.requestAnimationFrame(T)) : g < x && (g += E, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = g, c.requestAnimationFrame(T)));
        };
        T();
      }
    }, t.prototype.getContentElement = function() {
      return this.contentEl;
    }, t.prototype.getScrollElement = function() {
      return this.contentWrapperEl;
    }, t.prototype.removeListeners = function() {
      var e = an(this.el);
      this.el.removeEventListener("mouseenter", this.onMouseEnter), this.el.removeEventListener("pointerdown", this.onPointerEvent, !0), this.el.removeEventListener("mousemove", this.onMouseMove), this.el.removeEventListener("mouseleave", this.onMouseLeave), this.contentWrapperEl && this.contentWrapperEl.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onWindowResize), this.mutationObserver && this.mutationObserver.disconnect(), this.resizeObserver && this.resizeObserver.disconnect(), this.onMouseMove.cancel(), this.onWindowResize.cancel(), this.onStopScrolling.cancel(), this.onMouseEntered.cancel();
    }, t.prototype.unMount = function() {
      this.removeListeners();
    }, t.prototype.isWithinBounds = function(e) {
      return this.mouseX >= e.left && this.mouseX <= e.left + e.width && this.mouseY >= e.top && this.mouseY <= e.top + e.height;
    }, t.prototype.findChild = function(e, n) {
      var r = e.matches || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector;
      return Array.prototype.filter.call(e.children, function(i) {
        return r.call(i, n);
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
    }, t.getOptions = x_, t.helpers = k_, t;
  }()
), Un = function() {
  return Un = Object.assign || function(e) {
    for (var n, r = 1, i = arguments.length; r < i; r++) {
      n = arguments[r];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s]);
    }
    return e;
  }, Un.apply(this, arguments);
}, S_ = {
  beforeUnmount: "beforeUnmount",
  unmount: "unmount"
}, Ur;
function C_(t) {
  var e, n = t.h, r = t.emit, i = t.slots, s = t.props, o = function(l) {
    return r("scroll", l);
  }, a = Un(Un({}, Hs.defaultOptions.classNames), s.classNames);
  return n("div", Un({ ref: "element" }, {
    "data-simplebar": "init"
  }), [
    n("div", {
      class: a.wrapper
    }, [
      n("div", { class: a.heightAutoObserverWrapperEl }, [
        n("div", { class: a.heightAutoObserverEl })
      ]),
      n("div", { class: a.mask }, [
        n("div", { class: a.offset }, [
          n("div", Un(Un({}, {
            onScroll: o,
            class: a.contentWrapper,
            tabIndex: 0,
            role: "region",
            "aria-label": s.ariaLabel || Hs.defaultOptions.ariaLabel
          }), { ref: "scrollElement" }), [
            n("div", { class: a.contentEl, ref: "contentElement" }, (e = i.default) === null || e === void 0 ? void 0 : e.call(i))
          ])
        ])
      ]),
      n("div", { class: a.placeholder })
    ]),
    n("div", { class: "".concat(a.track, " simplebar-horizontal") }, [
      n("div", { class: a.scrollbar })
    ]),
    n("div", { class: "".concat(a.track, " simplebar-vertical") }, [
      n("div", { class: a.scrollbar })
    ])
  ]);
}
var E_ = Yt((Ur = {
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
    for (var t = Hs.getOptions(this.$refs.element.attributes), e = 0, n = Object.entries(this.$props); e < n.length; e++) {
      var r = n[e], i = r[0], s = r[1];
      s != null && typeof s != "function" && (t[i] = s);
    }
    this.SimpleBar = new Hs(this.$refs.element, t), this.scrollElement = this.$refs.scrollElement, this.contentElement = this.$refs.contentElement;
  }
}, Ur[S_.beforeUnmount] = function() {
  var t;
  (t = this.SimpleBar) === null || t === void 0 || t.unMount(), this.SimpleBar = void 0;
}, Ur.methods = {
  recalculate: function() {
    var t;
    (t = this.SimpleBar) === null || t === void 0 || t.recalculate();
  }
}, /**
 * Note that createElement argument is only provided in <=vue@2.7.x,
 * in other versions it's a context object that we do not use.
 */
Ur.render = function(t) {
  var e = this;
  return C_({
    h: typeof t == "function" ? t : sf,
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
}, Ur));
const M_ = Yt({
  name: "Column",
  components: {
    Simplebar: E_
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
}), A_ = { class: "px-4 py-6 sm:px-0" }, T_ = { class: "text-lg leading-6 font-medium text-gray-900" }, O_ = { class: "mt-1 text-sm text-gray-500" };
function j_(t, e, n, r, i, s) {
  const o = at("Simplebar");
  return pe(), St(o, {
    class: "flex-none transition ease-in-out duration-500 py-6 sm:px-6 lg:px-8",
    transition: "expand"
  }, {
    default: An(() => [
      me("div", A_, [
        me("h3", T_, Pt(t.title), 1),
        me("p", O_, Pt(t.description), 1)
      ]),
      Wd(t.$slots, "default")
    ]),
    _: 3
  });
}
const eh = /* @__PURE__ */ mt(M_, [["render", j_]]), P_ = Yt({
  name: "WorkOrderList",
  components: {
    WorkOrderWidget: Fw,
    Column: eh
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
      this.selectedWorkOrder && this.selectedWorkOrder.name === t.name ? this.$emit("select", null) : this.$emit("select", t);
    }
  }
}), N_ = { id: "WorkOrders" };
function R_(t, e, n, r, i, s) {
  const o = at("WorkOrderWidget"), a = at("Column");
  return pe(), St(a, {
    class: yi({ "w-full": !t.selectedWorkOrder, "w-1/2": t.selectedWorkOrder }),
    title: "Work Orders",
    description: "Select a work order to view job cards"
  }, {
    default: An(() => [
      me("div", N_, [
        (pe(!0), ze(Ve, null, sl(t.workOrders, (l) => (pe(), St(o, {
          key: l.name,
          workOrder: l,
          isSelected: t.selectedWorkOrder && t.selectedWorkOrder.name === l.name,
          onClick: (c) => t.selectWorkOrder(l)
        }, null, 8, ["workOrder", "isSelected", "onClick"]))), 128))
      ])
    ]),
    _: 1
  }, 8, ["class"]);
}
const I_ = /* @__PURE__ */ mt(P_, [["render", R_]]);
const L_ = {
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
function z_(t, e, n, r, i, s) {
  return pe(), ze(Ve, null, [
    me("button", {
      class: "btn",
      onClick: e[0] || (e[0] = (...o) => s.starttimer && s.starttimer(...o))
    }, "Start"),
    me("button", {
      class: "btn",
      onClick: e[1] || (e[1] = (...o) => s.stoptimer && s.stoptimer(...o))
    }, "Stop")
  ], 64);
}
const D_ = /* @__PURE__ */ mt(L_, [["render", z_], ["__scopeId", "data-v-dbc45126"]]), B_ = Yt({
  name: "JobCardWidget",
  components: {
    Button: D_,
    Card: Xl,
    TimerWidget: Vp
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
});
function $_(t, e, n, r, i, s) {
  const o = at("TimerWidget"), a = at("Card");
  return pe(), St(a, { class: "card_title" }, {
    default: An(() => [
      ll(Pt(t.jobCard.operation) + " ", 1),
      De(o, {
        class: "timer",
        jobCard: t.jobCard,
        employee_id: t.employee_id
      }, null, 8, ["jobCard", "employee_id"])
    ]),
    _: 1
  });
}
const H_ = /* @__PURE__ */ mt(B_, [["render", $_], ["__scopeId", "data-v-28dabc95"]]), F_ = Yt({
  name: "JobCards",
  components: {
    JobCardWidget: H_,
    Column: eh
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
}), W_ = { id: "JobCards" };
function V_(t, e, n, r, i, s) {
  const o = at("JobCardWidget"), a = at("Column");
  return pe(), St(a, {
    title: "Job Cards",
    description: "Select a job card to start the timer",
    class: "w-1/2"
  }, {
    default: An(() => [
      me("div", W_, [
        (pe(!0), ze(Ve, null, sl(t.jobCards, (l) => (pe(), St(o, {
          name: "job_card_widget",
          key: l.name,
          jobCard: l,
          employee_id: t.employee_id
        }, null, 8, ["jobCard", "employee_id"]))), 128))
      ])
    ]),
    _: 1
  });
}
const U_ = /* @__PURE__ */ mt(F_, [["render", V_]]), K_ = Yt({
  name: "Employee List",
  components: {
    Card: Xl
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
}), q_ = { class: "text-3xl center font-thin" };
function G_(t, e, n, r, i, s) {
  const o = at("Card");
  return pe(), ze("div", null, [
    (pe(!0), ze(Ve, null, sl(t.employees, (a) => (pe(), St(o, {
      class: "w-screen w-1/2 p-4 m-4 bg-white shadow-lg rounded-lg box-border h-20 hover:bg-gray-300 justify_content:center",
      key: a.id,
      onClick: (l) => t.send_employee(a)
    }, {
      default: An(() => [
        me("h1", q_, Pt(a.name), 1)
      ]),
      _: 2
    }, 1032, ["onClick"]))), 128))
  ]);
}
const J_ = /* @__PURE__ */ mt(K_, [["render", G_]]), Y_ = Yt({
  name: "JobTimeClock",
  components: {
    AuthorizationMessage: kw,
    JobCardList: U_,
    SessionTimer: Aw,
    TimerWidget: Vp,
    WorkOrderList: I_,
    EmployeeList: J_
  },
  data() {
    return {
      employeeId: "",
      employeeName: "",
      header: "Job Timeclock",
      jobCards: [],
      selectedWorkOrder: null,
      showAuthMessage: !1,
      token: G1("token", null),
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
    async authenticateEmployee(t) {
      const e = await dn("timeclock.www.job_timeclock.authenticate_employee", { rfid: t });
      e?.status === "success" ? (this.token = e.token, this.activeSession = !0, e.last_checkin === "OUT" ? this.log_employee_in(this.token) : this.employeeLoggedIn = !0, await this.getWorkOrders()) : (console.log("Sorry! You are not authenticated."), this.activeSession = !1);
    },
    async decodeToken() {
      const t = Y1(this.token);
      this.tokenExpiration = t.exp * 1e3, this.employeeId = t.employee_id, this.employeeName = t.employee_name, console.log("Hurrah! You are authenticated as ", t.employee_name);
      const e = Date.now(), n = this.tokenExpiration - e;
      this.resetTimer(n);
    },
    async getWorkOrders() {
      const t = await dn("timeclock.www.job_timeclock.get_work_orders", { token: this.token });
      t?.status === "success" ? (this.token = t.token, this.workOrders = t.work_orders) : (this.workOrders = [], this.activeSession = !1);
    },
    selectWorkOrder(t) {
      this.selectedWorkOrder = t, this.getJobCards(t.name);
    },
    async getJobCards(t) {
      const e = await dn("timeclock.www.job_timeclock.get_job_cards", { token: this.token, work_order: t });
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
      const e = this.date.getUTCFullYear(), n = this.date.getUTCMonth() + 1, r = this.date.getUTCDate(), i = this.date.getUTCHours(), s = this.date.getUTCMinutes();
      this.date.getUTCSeconds();
      const o = (c) => c < 10 ? "0" + c : c, a = `${e}-${o(n)}-${o(r)} ${o(i - 5)}:${o(s)}`;
      (await dn("timeclock.www.job_timeclock.log_in_employee", { token: t, time: a }))?.status === "success" ? console.log("You are now logged in.") : console.log("did not work. You are still logged out:");
    },
    switchEmployee() {
      this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "";
    },
    async log_out_employee(t) {
      const e = /* @__PURE__ */ new Date(), n = e.getUTCFullYear(), r = e.getUTCMonth() + 1, i = e.getUTCDate(), s = e.getUTCHours(), o = e.getUTCMinutes();
      e.getUTCSeconds();
      const a = (d) => d < 10 ? "0" + d : d, l = `${n}-${a(r)}-${a(i)} ${a(s - 5)}:${a(o)}`, c = await dn("timeclock.www.job_timeclock.log_out_employee", { token: t, time: l });
      c?.status === "success" ? (console.log("You are now logged out.", c.log), this.activeSession = !1, this.token = null, this.tokenExpiration = 0, this.jobCards = [], this.selectedWorkOrder = null, this.workOrders = [], this.employeeId = "", this.employeeName = "", this.employees = []) : console.log("Did not work. You are still logged in:", c.log);
    },
    async get_employees() {
      const t = await dn("timeclock.www.job_timeclock.get_employees");
      t?.status === "success" && (this.employees = t.employees);
    },
    get_token_from_employee(t) {
      this.authenticateEmployee(t.sCode);
    }
  },
  mounted() {
    this.token && this.getWorkOrders(), this.employees = this.get_employees();
    const t = Q1.attachTo(document, {
      onScan: this.authenticateEmployee,
      ignoreIfFocusOn: ".frappe-input"
    });
    this.scanner = t, xr(
      () => this.token,
      (e) => {
        e !== this.token ? this.decodeToken() : e && this.decodeToken();
      },
      { immediate: !0 }
    );
  }
});
const th = (t) => (tl("data-v-e4547ce9"), t = t(), nl(), t), X_ = { class: "bg-white shadow fixed w-screen top-0 z-10 h-20" }, Q_ = { class: "mx-auto px-4 py-6 sm:px-6 lg:px-8 flex h-center items-center justify-between" }, Z_ = { class: "text-3xl font-bold tracking-tight text-gray-900" }, e8 = {
  key: 0,
  class: "flex h-screen overflow-hidden pt-16"
}, t8 = {
  key: 1,
  class: "bg-white fixed w-auto top-100 z-50 h-20"
}, n8 = /* @__PURE__ */ th(() => /* @__PURE__ */ me("h1", { class: "text-3xl font-bold top-50" }, "Employee List", -1)), r8 = /* @__PURE__ */ th(() => /* @__PURE__ */ me("p", null, "Click who you are:", -1));
function i8(t, e, n, r, i, s) {
  const o = at("SessionTimer"), a = at("WorkOrderList"), l = at("JobCardList"), c = at("EmployeeList");
  return pe(), ze(Ve, null, [
    me("header", X_, [
      me("div", Q_, [
        me("h1", Z_, Pt(t.header), 1),
        t.activeSession ? (pe(), ze("button", {
          key: 0,
          class: "bg-teal-300 hover:bg-teal-400 text-white font-normal py-2 px-8 rounded",
          onClick: e[0] || (e[0] = (d) => t.log_out_employee(this.token))
        }, "Clock Out")) : gn("", !0),
        t.activeSession ? (pe(), ze("button", {
          key: 1,
          class: "bg-green-500 hover:bg-green-600 text-white font-normal py-2 px-4 rounded",
          onClick: e[1] || (e[1] = (...d) => t.switchEmployee && t.switchEmployee(...d))
        }, "Switch Employee")) : gn("", !0),
        t.activeSession ? (pe(), St(o, {
          key: 2,
          employeeName: t.employeeName,
          tokenExpiration: t.tokenExpiration
        }, null, 8, ["employeeName", "tokenExpiration"])) : gn("", !0)
      ])
    ]),
    t.activeSession ? (pe(), ze("main", e8, [
      De(a, {
        workOrders: t.workOrders,
        selectedWorkOrder: t.selectedWorkOrder,
        onSelect: t.selectWorkOrder
      }, null, 8, ["workOrders", "selectedWorkOrder", "onSelect"]),
      De(fl, { name: "job_card_list" }, {
        default: An(() => [
          t.selectedWorkOrder ? (pe(), St(l, {
            key: 0,
            name: "job_cards_comp",
            jobCards: t.jobCards,
            employee_id: this.employeeId
          }, null, 8, ["jobCards", "employee_id"])) : gn("", !0)
        ]),
        _: 1
      })
    ])) : (pe(), ze("main", t8, [
      n8,
      r8,
      De(c, {
        employees: t.employees,
        onSend_employee: t.get_token_from_employee
      }, null, 8, ["employees", "onSend_employee"])
    ]))
  ], 64);
}
const s8 = /* @__PURE__ */ mt(Y_, [["render", i8], ["__scopeId", "data-v-e4547ce9"]]);
let o8 = j1(s8);
o8.mount("#app");
