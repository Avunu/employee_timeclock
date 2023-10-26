function Rl(t, e) {
  const n = /* @__PURE__ */ Object.create(null), r = t.split(",");
  for (let i = 0; i < r.length; i++)
    n[r[i]] = !0;
  return e ? (i) => !!n[i.toLowerCase()] : (i) => !!n[i];
}
const we = {}, pr = [], Tt = () => {
}, zp = () => !1, Dp = /^on[^a-z]/, Ds = (t) => Dp.test(t), Il = (t) => t.startsWith("onUpdate:"), Fe = Object.assign, Nl = (t, e) => {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}, Bp = Object.prototype.hasOwnProperty, de = (t, e) => Bp.call(t, e), ie = Array.isArray, hr = (t) => Bs(t) === "[object Map]", Uu = (t) => Bs(t) === "[object Set]", oe = (t) => typeof t == "function", ze = (t) => typeof t == "string", Ll = (t) => typeof t == "symbol", _e = (t) => t !== null && typeof t == "object", qu = (t) => _e(t) && oe(t.then) && oe(t.catch), Gu = Object.prototype.toString, Bs = (t) => Gu.call(t), $p = (t) => Bs(t).slice(8, -1), Ju = (t) => Bs(t) === "[object Object]", zl = (t) => ze(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, Wi = /* @__PURE__ */ Rl(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), $s = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (n) => e[n] || (e[n] = t(n));
}, Hp = /-(\w)/g, Ut = $s((t) => t.replace(Hp, (e, n) => n ? n.toUpperCase() : "")), Fp = /\B([A-Z])/g, Or = $s(
  (t) => t.replace(Fp, "-$1").toLowerCase()
), Hs = $s(
  (t) => t.charAt(0).toUpperCase() + t.slice(1)
), io = $s(
  (t) => t ? `on${Hs(t)}` : ""
), ri = (t, e) => !Object.is(t, e), so = (t, e) => {
  for (let n = 0; n < t.length; n++)
    t[n](e);
}, ts = (t, e, n) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, Wp = (t) => {
  const e = parseFloat(t);
  return isNaN(e) ? t : e;
};
let Va;
const Bo = () => Va || (Va = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Dl(t) {
  if (ie(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = ze(r) ? qp(r) : Dl(r);
      if (i)
        for (const s in i)
          e[s] = i[s];
    }
    return e;
  } else {
    if (ze(t))
      return t;
    if (_e(t))
      return t;
  }
}
const Vp = /;(?![^(]*\))/g, Kp = /:([^]+)/, Up = /\/\*[^]*?\*\//g;
function qp(t) {
  const e = {};
  return t.replace(Up, "").split(Vp).forEach((n) => {
    if (n) {
      const r = n.split(Kp);
      r.length > 1 && (e[r[0].trim()] = r[1].trim());
    }
  }), e;
}
function Ft(t) {
  let e = "";
  if (ze(t))
    e = t;
  else if (ie(t))
    for (let n = 0; n < t.length; n++) {
      const r = Ft(t[n]);
      r && (e += r + " ");
    }
  else if (_e(t))
    for (const n in t)
      t[n] && (e += n + " ");
  return e.trim();
}
const Gp = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Jp = /* @__PURE__ */ Rl(Gp);
function Yu(t) {
  return !!t || t === "";
}
const _t = (t) => ze(t) ? t : t == null ? "" : ie(t) || _e(t) && (t.toString === Gu || !oe(t.toString)) ? JSON.stringify(t, Xu, 2) : String(t), Xu = (t, e) => e && e.__v_isRef ? Xu(t, e.value) : hr(e) ? {
  [`Map(${e.size})`]: [...e.entries()].reduce((n, [r, i]) => (n[`${r} =>`] = i, n), {})
} : Uu(e) ? {
  [`Set(${e.size})`]: [...e.values()]
} : _e(e) && !ie(e) && !Ju(e) ? String(e) : e;
let pt;
class Yp {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this.effects = [], this.cleanups = [], this.parent = pt, !e && pt && (this.index = (pt.scopes || (pt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(e) {
    if (this._active) {
      const n = pt;
      try {
        return pt = this, e();
      } finally {
        pt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    pt = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    pt = this.parent;
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
function Xp(t, e = pt) {
  e && e.active && e.effects.push(t);
}
function Qu() {
  return pt;
}
function Qp(t) {
  pt && pt.cleanups.push(t);
}
const Bl = (t) => {
  const e = new Set(t);
  return e.w = 0, e.n = 0, e;
}, Zu = (t) => (t.w & wn) > 0, ed = (t) => (t.n & wn) > 0, Zp = ({ deps: t }) => {
  if (t.length)
    for (let e = 0; e < t.length; e++)
      t[e].w |= wn;
}, eh = (t) => {
  const { deps: e } = t;
  if (e.length) {
    let n = 0;
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      Zu(i) && !ed(i) ? i.delete(t) : e[n++] = i, i.w &= ~wn, i.n &= ~wn;
    }
    e.length = n;
  }
}, $o = /* @__PURE__ */ new WeakMap();
let Fr = 0, wn = 1;
const Ho = 30;
let Et;
const Fn = Symbol(""), Fo = Symbol("");
class $l {
  constructor(e, n = null, r) {
    this.fn = e, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, Xp(this, r);
  }
  run() {
    if (!this.active)
      return this.fn();
    let e = Et, n = gn;
    for (; e; ) {
      if (e === this)
        return;
      e = e.parent;
    }
    try {
      return this.parent = Et, Et = this, gn = !0, wn = 1 << ++Fr, Fr <= Ho ? Zp(this) : Ka(this), this.fn();
    } finally {
      Fr <= Ho && eh(this), wn = 1 << --Fr, Et = this.parent, gn = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    Et === this ? this.deferStop = !0 : this.active && (Ka(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function Ka(t) {
  const { deps: e } = t;
  if (e.length) {
    for (let n = 0; n < e.length; n++)
      e[n].delete(t);
    e.length = 0;
  }
}
let gn = !0;
const td = [];
function jr() {
  td.push(gn), gn = !1;
}
function Pr() {
  const t = td.pop();
  gn = t === void 0 ? !0 : t;
}
function ut(t, e, n) {
  if (gn && Et) {
    let r = $o.get(t);
    r || $o.set(t, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || r.set(n, i = Bl()), nd(i);
  }
}
function nd(t, e) {
  let n = !1;
  Fr <= Ho ? ed(t) || (t.n |= wn, n = !Zu(t)) : n = !t.has(Et), n && (t.add(Et), Et.deps.push(t));
}
function Zt(t, e, n, r, i, s) {
  const o = $o.get(t);
  if (!o)
    return;
  let l = [];
  if (e === "clear")
    l = [...o.values()];
  else if (n === "length" && ie(t)) {
    const a = Number(r);
    o.forEach((c, d) => {
      (d === "length" || d >= a) && l.push(c);
    });
  } else
    switch (n !== void 0 && l.push(o.get(n)), e) {
      case "add":
        ie(t) ? zl(n) && l.push(o.get("length")) : (l.push(o.get(Fn)), hr(t) && l.push(o.get(Fo)));
        break;
      case "delete":
        ie(t) || (l.push(o.get(Fn)), hr(t) && l.push(o.get(Fo)));
        break;
      case "set":
        hr(t) && l.push(o.get(Fn));
        break;
    }
  if (l.length === 1)
    l[0] && Wo(l[0]);
  else {
    const a = [];
    for (const c of l)
      c && a.push(...c);
    Wo(Bl(a));
  }
}
function Wo(t, e) {
  const n = ie(t) ? t : [...t];
  for (const r of n)
    r.computed && Ua(r);
  for (const r of n)
    r.computed || Ua(r);
}
function Ua(t, e) {
  (t !== Et || t.allowRecurse) && (t.scheduler ? t.scheduler() : t.run());
}
const th = /* @__PURE__ */ Rl("__proto__,__v_isRef,__isVue"), rd = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Ll)
), nh = /* @__PURE__ */ Hl(), rh = /* @__PURE__ */ Hl(!1, !0), ih = /* @__PURE__ */ Hl(!0), qa = /* @__PURE__ */ sh();
function sh() {
  const t = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((e) => {
    t[e] = function(...n) {
      const r = pe(this);
      for (let s = 0, o = this.length; s < o; s++)
        ut(r, "get", s + "");
      const i = r[e](...n);
      return i === -1 || i === !1 ? r[e](...n.map(pe)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((e) => {
    t[e] = function(...n) {
      jr();
      const r = pe(this)[e].apply(this, n);
      return Pr(), r;
    };
  }), t;
}
function oh(t) {
  const e = pe(this);
  return ut(e, "has", t), e.hasOwnProperty(t);
}
function Hl(t = !1, e = !1) {
  return function(r, i, s) {
    if (i === "__v_isReactive")
      return !t;
    if (i === "__v_isReadonly")
      return t;
    if (i === "__v_isShallow")
      return e;
    if (i === "__v_raw" && s === (t ? e ? kh : ad : e ? ld : od).get(r))
      return r;
    const o = ie(r);
    if (!t) {
      if (o && de(qa, i))
        return Reflect.get(qa, i, s);
      if (i === "hasOwnProperty")
        return oh;
    }
    const l = Reflect.get(r, i, s);
    return (Ll(i) ? rd.has(i) : th(i)) || (t || ut(r, "get", i), e) ? l : Ye(l) ? o && zl(i) ? l : l.value : _e(l) ? t ? Vl(l) : mi(l) : l;
  };
}
const lh = /* @__PURE__ */ id(), ah = /* @__PURE__ */ id(!0);
function id(t = !1) {
  return function(n, r, i, s) {
    let o = n[r];
    if (kr(o) && Ye(o) && !Ye(i))
      return !1;
    if (!t && (!ns(i) && !kr(i) && (o = pe(o), i = pe(i)), !ie(n) && Ye(o) && !Ye(i)))
      return o.value = i, !0;
    const l = ie(n) && zl(r) ? Number(r) < n.length : de(n, r), a = Reflect.set(n, r, i, s);
    return n === pe(s) && (l ? ri(i, o) && Zt(n, "set", r, i) : Zt(n, "add", r, i)), a;
  };
}
function ch(t, e) {
  const n = de(t, e);
  t[e];
  const r = Reflect.deleteProperty(t, e);
  return r && n && Zt(t, "delete", e, void 0), r;
}
function uh(t, e) {
  const n = Reflect.has(t, e);
  return (!Ll(e) || !rd.has(e)) && ut(t, "has", e), n;
}
function dh(t) {
  return ut(t, "iterate", ie(t) ? "length" : Fn), Reflect.ownKeys(t);
}
const sd = {
  get: nh,
  set: lh,
  deleteProperty: ch,
  has: uh,
  ownKeys: dh
}, fh = {
  get: ih,
  set(t, e) {
    return !0;
  },
  deleteProperty(t, e) {
    return !0;
  }
}, ph = /* @__PURE__ */ Fe(
  {},
  sd,
  {
    get: rh,
    set: ah
  }
), Fl = (t) => t, Fs = (t) => Reflect.getPrototypeOf(t);
function wi(t, e, n = !1, r = !1) {
  t = t.__v_raw;
  const i = pe(t), s = pe(e);
  n || (e !== s && ut(i, "get", e), ut(i, "get", s));
  const { has: o } = Fs(i), l = r ? Fl : n ? Ul : ii;
  if (o.call(i, e))
    return l(t.get(e));
  if (o.call(i, s))
    return l(t.get(s));
  t !== i && t.get(e);
}
function _i(t, e = !1) {
  const n = this.__v_raw, r = pe(n), i = pe(t);
  return e || (t !== i && ut(r, "has", t), ut(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
}
function ki(t, e = !1) {
  return t = t.__v_raw, !e && ut(pe(t), "iterate", Fn), Reflect.get(t, "size", t);
}
function Ga(t) {
  t = pe(t);
  const e = pe(this);
  return Fs(e).has.call(e, t) || (e.add(t), Zt(e, "add", t, t)), this;
}
function Ja(t, e) {
  e = pe(e);
  const n = pe(this), { has: r, get: i } = Fs(n);
  let s = r.call(n, t);
  s || (t = pe(t), s = r.call(n, t));
  const o = i.call(n, t);
  return n.set(t, e), s ? ri(e, o) && Zt(n, "set", t, e) : Zt(n, "add", t, e), this;
}
function Ya(t) {
  const e = pe(this), { has: n, get: r } = Fs(e);
  let i = n.call(e, t);
  i || (t = pe(t), i = n.call(e, t)), r && r.call(e, t);
  const s = e.delete(t);
  return i && Zt(e, "delete", t, void 0), s;
}
function Xa() {
  const t = pe(this), e = t.size !== 0, n = t.clear();
  return e && Zt(t, "clear", void 0, void 0), n;
}
function xi(t, e) {
  return function(r, i) {
    const s = this, o = s.__v_raw, l = pe(o), a = e ? Fl : t ? Ul : ii;
    return !t && ut(l, "iterate", Fn), o.forEach((c, d) => r.call(i, a(c), a(d), s));
  };
}
function Si(t, e, n) {
  return function(...r) {
    const i = this.__v_raw, s = pe(i), o = hr(s), l = t === "entries" || t === Symbol.iterator && o, a = t === "keys" && o, c = i[t](...r), d = n ? Fl : e ? Ul : ii;
    return !e && ut(
      s,
      "iterate",
      a ? Fo : Fn
    ), {
      // iterator protocol
      next() {
        const { value: f, done: h } = c.next();
        return h ? { value: f, done: h } : {
          value: l ? [d(f[0]), d(f[1])] : d(f),
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
function tn(t) {
  return function(...e) {
    return t === "delete" ? !1 : this;
  };
}
function hh() {
  const t = {
    get(s) {
      return wi(this, s);
    },
    get size() {
      return ki(this);
    },
    has: _i,
    add: Ga,
    set: Ja,
    delete: Ya,
    clear: Xa,
    forEach: xi(!1, !1)
  }, e = {
    get(s) {
      return wi(this, s, !1, !0);
    },
    get size() {
      return ki(this);
    },
    has: _i,
    add: Ga,
    set: Ja,
    delete: Ya,
    clear: Xa,
    forEach: xi(!1, !0)
  }, n = {
    get(s) {
      return wi(this, s, !0);
    },
    get size() {
      return ki(this, !0);
    },
    has(s) {
      return _i.call(this, s, !0);
    },
    add: tn("add"),
    set: tn("set"),
    delete: tn("delete"),
    clear: tn("clear"),
    forEach: xi(!0, !1)
  }, r = {
    get(s) {
      return wi(this, s, !0, !0);
    },
    get size() {
      return ki(this, !0);
    },
    has(s) {
      return _i.call(this, s, !0);
    },
    add: tn("add"),
    set: tn("set"),
    delete: tn("delete"),
    clear: tn("clear"),
    forEach: xi(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    t[s] = Si(
      s,
      !1,
      !1
    ), n[s] = Si(
      s,
      !0,
      !1
    ), e[s] = Si(
      s,
      !1,
      !0
    ), r[s] = Si(
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
  mh,
  gh,
  yh,
  bh
] = /* @__PURE__ */ hh();
function Wl(t, e) {
  const n = e ? t ? bh : yh : t ? gh : mh;
  return (r, i, s) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? r : Reflect.get(
    de(n, i) && i in r ? n : r,
    i,
    s
  );
}
const vh = {
  get: /* @__PURE__ */ Wl(!1, !1)
}, wh = {
  get: /* @__PURE__ */ Wl(!1, !0)
}, _h = {
  get: /* @__PURE__ */ Wl(!0, !1)
}, od = /* @__PURE__ */ new WeakMap(), ld = /* @__PURE__ */ new WeakMap(), ad = /* @__PURE__ */ new WeakMap(), kh = /* @__PURE__ */ new WeakMap();
function xh(t) {
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
function Sh(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : xh($p(t));
}
function mi(t) {
  return kr(t) ? t : Kl(
    t,
    !1,
    sd,
    vh,
    od
  );
}
function Ch(t) {
  return Kl(
    t,
    !1,
    ph,
    wh,
    ld
  );
}
function Vl(t) {
  return Kl(
    t,
    !0,
    fh,
    _h,
    ad
  );
}
function Kl(t, e, n, r, i) {
  if (!_e(t) || t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = i.get(t);
  if (s)
    return s;
  const o = Sh(t);
  if (o === 0)
    return t;
  const l = new Proxy(
    t,
    o === 2 ? r : n
  );
  return i.set(t, l), l;
}
function mr(t) {
  return kr(t) ? mr(t.__v_raw) : !!(t && t.__v_isReactive);
}
function kr(t) {
  return !!(t && t.__v_isReadonly);
}
function ns(t) {
  return !!(t && t.__v_isShallow);
}
function cd(t) {
  return mr(t) || kr(t);
}
function pe(t) {
  const e = t && t.__v_raw;
  return e ? pe(e) : t;
}
function ud(t) {
  return ts(t, "__v_skip", !0), t;
}
const ii = (t) => _e(t) ? mi(t) : t, Ul = (t) => _e(t) ? Vl(t) : t;
function dd(t) {
  gn && Et && (t = pe(t), nd(t.dep || (t.dep = Bl())));
}
function fd(t, e) {
  t = pe(t);
  const n = t.dep;
  n && Wo(n);
}
function Ye(t) {
  return !!(t && t.__v_isRef === !0);
}
function Ws(t) {
  return pd(t, !1);
}
function Eh(t) {
  return pd(t, !0);
}
function pd(t, e) {
  return Ye(t) ? t : new Mh(t, e);
}
class Mh {
  constructor(e, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? e : pe(e), this._value = n ? e : ii(e);
  }
  get value() {
    return dd(this), this._value;
  }
  set value(e) {
    const n = this.__v_isShallow || ns(e) || kr(e);
    e = n ? e : pe(e), ri(e, this._rawValue) && (this._rawValue = e, this._value = n ? e : ii(e), fd(this));
  }
}
function hd(t) {
  return Ye(t) ? t.value : t;
}
const Ah = {
  get: (t, e, n) => hd(Reflect.get(t, e, n)),
  set: (t, e, n, r) => {
    const i = t[e];
    return Ye(i) && !Ye(n) ? (i.value = n, !0) : Reflect.set(t, e, n, r);
  }
};
function md(t) {
  return mr(t) ? t : new Proxy(t, Ah);
}
class Th {
  constructor(e, n, r, i) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new $l(e, () => {
      this._dirty || (this._dirty = !0, fd(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !i, this.__v_isReadonly = r;
  }
  get value() {
    const e = pe(this);
    return dd(e), (e._dirty || !e._cacheable) && (e._dirty = !1, e._value = e.effect.run()), e._value;
  }
  set value(e) {
    this._setter(e);
  }
}
function Oh(t, e, n = !1) {
  let r, i;
  const s = oe(t);
  return s ? (r = t, i = Tt) : (r = t.get, i = t.set), new Th(r, i, s || !i, n);
}
function yn(t, e, n, r) {
  let i;
  try {
    i = r ? t(...r) : t();
  } catch (s) {
    Vs(s, e, n);
  }
  return i;
}
function Ot(t, e, n, r) {
  if (oe(t)) {
    const s = yn(t, e, n, r);
    return s && qu(s) && s.catch((o) => {
      Vs(o, e, n);
    }), s;
  }
  const i = [];
  for (let s = 0; s < t.length; s++)
    i.push(Ot(t[s], e, n, r));
  return i;
}
function Vs(t, e, n, r = !0) {
  const i = e ? e.vnode : null;
  if (e) {
    let s = e.parent;
    const o = e.proxy, l = n;
    for (; s; ) {
      const c = s.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](t, o, l) === !1)
            return;
      }
      s = s.parent;
    }
    const a = e.appContext.config.errorHandler;
    if (a) {
      yn(
        a,
        null,
        10,
        [t, o, l]
      );
      return;
    }
  }
  jh(t, n, i, r);
}
function jh(t, e, n, r = !0) {
  console.error(t);
}
let si = !1, Vo = !1;
const Je = [];
let Wt = 0;
const gr = [];
let Qt = null, jn = 0;
const gd = /* @__PURE__ */ Promise.resolve();
let ql = null;
function yd(t) {
  const e = ql || gd;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function Ph(t) {
  let e = Wt + 1, n = Je.length;
  for (; e < n; ) {
    const r = e + n >>> 1;
    oi(Je[r]) < t ? e = r + 1 : n = r;
  }
  return e;
}
function Gl(t) {
  (!Je.length || !Je.includes(
    t,
    si && t.allowRecurse ? Wt + 1 : Wt
  )) && (t.id == null ? Je.push(t) : Je.splice(Ph(t.id), 0, t), bd());
}
function bd() {
  !si && !Vo && (Vo = !0, ql = gd.then(wd));
}
function Rh(t) {
  const e = Je.indexOf(t);
  e > Wt && Je.splice(e, 1);
}
function Ih(t) {
  ie(t) ? gr.push(...t) : (!Qt || !Qt.includes(
    t,
    t.allowRecurse ? jn + 1 : jn
  )) && gr.push(t), bd();
}
function Qa(t, e = si ? Wt + 1 : 0) {
  for (; e < Je.length; e++) {
    const n = Je[e];
    n && n.pre && (Je.splice(e, 1), e--, n());
  }
}
function vd(t) {
  if (gr.length) {
    const e = [...new Set(gr)];
    if (gr.length = 0, Qt) {
      Qt.push(...e);
      return;
    }
    for (Qt = e, Qt.sort((n, r) => oi(n) - oi(r)), jn = 0; jn < Qt.length; jn++)
      Qt[jn]();
    Qt = null, jn = 0;
  }
}
const oi = (t) => t.id == null ? 1 / 0 : t.id, Nh = (t, e) => {
  const n = oi(t) - oi(e);
  if (n === 0) {
    if (t.pre && !e.pre)
      return -1;
    if (e.pre && !t.pre)
      return 1;
  }
  return n;
};
function wd(t) {
  Vo = !1, si = !0, Je.sort(Nh);
  const e = Tt;
  try {
    for (Wt = 0; Wt < Je.length; Wt++) {
      const n = Je[Wt];
      n && n.active !== !1 && yn(n, null, 14);
    }
  } finally {
    Wt = 0, Je.length = 0, vd(), si = !1, ql = null, (Je.length || gr.length) && wd();
  }
}
function Lh(t, e, ...n) {
  if (t.isUnmounted)
    return;
  const r = t.vnode.props || we;
  let i = n;
  const s = e.startsWith("update:"), o = s && e.slice(7);
  if (o && o in r) {
    const d = `${o === "modelValue" ? "model" : o}Modifiers`, { number: f, trim: h } = r[d] || we;
    h && (i = n.map((g) => ze(g) ? g.trim() : g)), f && (i = n.map(Wp));
  }
  let l, a = r[l = io(e)] || // also try camelCase event handler (#2249)
  r[l = io(Ut(e))];
  !a && s && (a = r[l = io(Or(e))]), a && Ot(
    a,
    t,
    6,
    i
  );
  const c = r[l + "Once"];
  if (c) {
    if (!t.emitted)
      t.emitted = {};
    else if (t.emitted[l])
      return;
    t.emitted[l] = !0, Ot(
      c,
      t,
      6,
      i
    );
  }
}
function _d(t, e, n = !1) {
  const r = e.emitsCache, i = r.get(t);
  if (i !== void 0)
    return i;
  const s = t.emits;
  let o = {}, l = !1;
  if (!oe(t)) {
    const a = (c) => {
      const d = _d(c, e, !0);
      d && (l = !0, Fe(o, d));
    };
    !n && e.mixins.length && e.mixins.forEach(a), t.extends && a(t.extends), t.mixins && t.mixins.forEach(a);
  }
  return !s && !l ? (_e(t) && r.set(t, null), null) : (ie(s) ? s.forEach((a) => o[a] = null) : Fe(o, s), _e(t) && r.set(t, o), o);
}
function Ks(t, e) {
  return !t || !Ds(e) ? !1 : (e = e.slice(2).replace(/Once$/, ""), de(t, e[0].toLowerCase() + e.slice(1)) || de(t, Or(e)) || de(t, e));
}
let Xe = null, Us = null;
function rs(t) {
  const e = Xe;
  return Xe = t, Us = t && t.type.__scopeId || null, e;
}
function zh(t) {
  Us = t;
}
function Dh() {
  Us = null;
}
function Rr(t, e = Xe, n) {
  if (!e || t._n)
    return t;
  const r = (...i) => {
    r._d && cc(-1);
    const s = rs(e);
    let o;
    try {
      o = t(...i);
    } finally {
      rs(s), r._d && cc(1);
    }
    return o;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function oo(t) {
  const {
    type: e,
    vnode: n,
    proxy: r,
    withProxy: i,
    props: s,
    propsOptions: [o],
    slots: l,
    attrs: a,
    emit: c,
    render: d,
    renderCache: f,
    data: h,
    setupState: g,
    ctx: y,
    inheritAttrs: v
  } = t;
  let k, E;
  const T = rs(t);
  try {
    if (n.shapeFlag & 4) {
      const u = i || r;
      k = Ht(
        d.call(
          u,
          u,
          f,
          s,
          g,
          h,
          y
        )
      ), E = a;
    } else {
      const u = e;
      k = Ht(
        u.length > 1 ? u(
          s,
          { attrs: a, slots: l, emit: c }
        ) : u(
          s,
          null
          /* we know it doesn't need it */
        )
      ), E = e.props ? a : Bh(a);
    }
  } catch (u) {
    Yr.length = 0, Vs(u, t, 1), k = Ne(_n);
  }
  let j = k;
  if (E && v !== !1) {
    const u = Object.keys(E), { shapeFlag: m } = j;
    u.length && m & 7 && (o && u.some(Il) && (E = $h(
      E,
      o
    )), j = xr(j, E));
  }
  return n.dirs && (j = xr(j), j.dirs = j.dirs ? j.dirs.concat(n.dirs) : n.dirs), n.transition && (j.transition = n.transition), k = j, rs(T), k;
}
const Bh = (t) => {
  let e;
  for (const n in t)
    (n === "class" || n === "style" || Ds(n)) && ((e || (e = {}))[n] = t[n]);
  return e;
}, $h = (t, e) => {
  const n = {};
  for (const r in t)
    (!Il(r) || !(r.slice(9) in e)) && (n[r] = t[r]);
  return n;
};
function Hh(t, e, n) {
  const { props: r, children: i, component: s } = t, { props: o, children: l, patchFlag: a } = e, c = s.emitsOptions;
  if (e.dirs || e.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return r ? Za(r, o, c) : !!o;
    if (a & 8) {
      const d = e.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        const h = d[f];
        if (o[h] !== r[h] && !Ks(c, h))
          return !0;
      }
    }
  } else
    return (i || l) && (!l || !l.$stable) ? !0 : r === o ? !1 : r ? o ? Za(r, o, c) : !0 : !!o;
  return !1;
}
function Za(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length)
    return !0;
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    if (e[s] !== t[s] && !Ks(n, s))
      return !0;
  }
  return !1;
}
function Fh({ vnode: t, parent: e }, n) {
  for (; e && e.subTree === t; )
    (t = e.vnode).el = n, e = e.parent;
}
const Wh = (t) => t.__isSuspense;
function Vh(t, e) {
  e && e.pendingBranch ? ie(t) ? e.effects.push(...t) : e.effects.push(t) : Ih(t);
}
function Kh(t, e) {
  return Jl(t, null, e);
}
const Ci = {};
function yr(t, e, n) {
  return Jl(t, e, n);
}
function Jl(t, e, { immediate: n, deep: r, flush: i, onTrack: s, onTrigger: o } = we) {
  var l;
  const a = Qu() === ((l = Be) == null ? void 0 : l.scope) ? Be : null;
  let c, d = !1, f = !1;
  if (Ye(t) ? (c = () => t.value, d = ns(t)) : mr(t) ? (c = () => t, r = !0) : ie(t) ? (f = !0, d = t.some((u) => mr(u) || ns(u)), c = () => t.map((u) => {
    if (Ye(u))
      return u.value;
    if (mr(u))
      return lr(u);
    if (oe(u))
      return yn(u, a, 2);
  })) : oe(t) ? e ? c = () => yn(t, a, 2) : c = () => {
    if (!(a && a.isUnmounted))
      return h && h(), Ot(
        t,
        a,
        3,
        [g]
      );
  } : c = Tt, e && r) {
    const u = c;
    c = () => lr(u());
  }
  let h, g = (u) => {
    h = T.onStop = () => {
      yn(u, a, 4);
    };
  }, y;
  if (ci)
    if (g = Tt, e ? n && Ot(e, a, 3, [
      c(),
      f ? [] : void 0,
      g
    ]) : c(), i === "sync") {
      const u = $m();
      y = u.__watcherHandles || (u.__watcherHandles = []);
    } else
      return Tt;
  let v = f ? new Array(t.length).fill(Ci) : Ci;
  const k = () => {
    if (T.active)
      if (e) {
        const u = T.run();
        (r || d || (f ? u.some(
          (m, p) => ri(m, v[p])
        ) : ri(u, v))) && (h && h(), Ot(e, a, 3, [
          u,
          // pass undefined as the old value when it's changed for the first time
          v === Ci ? void 0 : f && v[0] === Ci ? [] : v,
          g
        ]), v = u);
      } else
        T.run();
  };
  k.allowRecurse = !!e;
  let E;
  i === "sync" ? E = k : i === "post" ? E = () => ot(k, a && a.suspense) : (k.pre = !0, a && (k.id = a.uid), E = () => Gl(k));
  const T = new $l(c, E);
  e ? n ? k() : v = T.run() : i === "post" ? ot(
    T.run.bind(T),
    a && a.suspense
  ) : T.run();
  const j = () => {
    T.stop(), a && a.scope && Nl(a.scope.effects, T);
  };
  return y && y.push(j), j;
}
function Uh(t, e, n) {
  const r = this.proxy, i = ze(t) ? t.includes(".") ? kd(r, t) : () => r[t] : t.bind(r, r);
  let s;
  oe(e) ? s = e : (s = e.handler, n = e);
  const o = Be;
  Sr(this);
  const l = Jl(i, s.bind(r), n);
  return o ? Sr(o) : Wn(), l;
}
function kd(t, e) {
  const n = e.split(".");
  return () => {
    let r = t;
    for (let i = 0; i < n.length && r; i++)
      r = r[n[i]];
    return r;
  };
}
function lr(t, e) {
  if (!_e(t) || t.__v_skip || (e = e || /* @__PURE__ */ new Set(), e.has(t)))
    return t;
  if (e.add(t), Ye(t))
    lr(t.value, e);
  else if (ie(t))
    for (let n = 0; n < t.length; n++)
      lr(t[n], e);
  else if (Uu(t) || hr(t))
    t.forEach((n) => {
      lr(n, e);
    });
  else if (Ju(t))
    for (const n in t)
      lr(t[n], e);
  return t;
}
function An(t, e, n, r) {
  const i = t.dirs, s = e && e.dirs;
  for (let o = 0; o < i.length; o++) {
    const l = i[o];
    s && (l.oldValue = s[o].value);
    let a = l.dir[r];
    a && (jr(), Ot(a, n, 8, [
      t.el,
      l,
      t,
      e
    ]), Pr());
  }
}
function Jt(t, e) {
  return oe(t) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => Fe({ name: t.name }, e, { setup: t }))()
  ) : t;
}
const qr = (t) => !!t.type.__asyncLoader, xd = (t) => t.type.__isKeepAlive;
function qh(t, e) {
  Sd(t, "a", e);
}
function Gh(t, e) {
  Sd(t, "da", e);
}
function Sd(t, e, n = Be) {
  const r = t.__wdc || (t.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return t();
  });
  if (qs(e, r, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      xd(i.parent.vnode) && Jh(r, e, n, i), i = i.parent;
  }
}
function Jh(t, e, n, r) {
  const i = qs(
    e,
    t,
    r,
    !0
    /* prepend */
  );
  Yl(() => {
    Nl(r[e], i);
  }, n);
}
function qs(t, e, n = Be, r = !1) {
  if (n) {
    const i = n[t] || (n[t] = []), s = e.__weh || (e.__weh = (...o) => {
      if (n.isUnmounted)
        return;
      jr(), Sr(n);
      const l = Ot(e, n, t, o);
      return Wn(), Pr(), l;
    });
    return r ? i.unshift(s) : i.push(s), s;
  }
}
const en = (t) => (e, n = Be) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!ci || t === "sp") && qs(t, (...r) => e(...r), n)
), Yh = en("bm"), Xh = en("m"), Qh = en("bu"), Zh = en("u"), em = en("bum"), Yl = en("um"), tm = en("sp"), nm = en(
  "rtg"
), rm = en(
  "rtc"
);
function im(t, e = Be) {
  qs("ec", t, e);
}
const Cd = "components";
function at(t, e) {
  return om(Cd, t, !0, e) || t;
}
const sm = Symbol.for("v-ndc");
function om(t, e, n = !0, r = !1) {
  const i = Xe || Be;
  if (i) {
    const s = i.type;
    if (t === Cd) {
      const l = zm(
        s,
        !1
        /* do not include inferred name to avoid breaking existing code */
      );
      if (l && (l === e || l === Ut(e) || l === Hs(Ut(e))))
        return s;
    }
    const o = (
      // local registration
      // check instance[type] first which is resolved for options API
      ec(i[t] || s[t], e) || // global registration
      ec(i.appContext[t], e)
    );
    return !o && r ? s : o;
  }
}
function ec(t, e) {
  return t && (t[e] || t[Ut(e)] || t[Hs(Ut(e))]);
}
function Ed(t, e, n, r) {
  let i;
  const s = n && n[r];
  if (ie(t) || ze(t)) {
    i = new Array(t.length);
    for (let o = 0, l = t.length; o < l; o++)
      i[o] = e(t[o], o, void 0, s && s[o]);
  } else if (typeof t == "number") {
    i = new Array(t);
    for (let o = 0; o < t; o++)
      i[o] = e(o + 1, o, void 0, s && s[o]);
  } else if (_e(t))
    if (t[Symbol.iterator])
      i = Array.from(
        t,
        (o, l) => e(o, l, void 0, s && s[l])
      );
    else {
      const o = Object.keys(t);
      i = new Array(o.length);
      for (let l = 0, a = o.length; l < a; l++) {
        const c = o[l];
        i[l] = e(t[c], c, l, s && s[l]);
      }
    }
  else
    i = [];
  return n && (n[r] = i), i;
}
function ar(t, e, n = {}, r, i) {
  if (Xe.isCE || Xe.parent && qr(Xe.parent) && Xe.parent.isCE)
    return e !== "default" && (n.name = e), Ne("slot", n, r && r());
  let s = t[e];
  s && s._c && (s._d = !1), fe();
  const o = s && Md(s(n)), l = it(
    Ge,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      o && o.key || `_${e}`
    },
    o || (r ? r() : []),
    o && t._ === 1 ? 64 : -2
  );
  return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), s && s._c && (s._d = !0), l;
}
function Md(t) {
  return t.some((e) => ls(e) ? !(e.type === _n || e.type === Ge && !Md(e.children)) : !0) ? t : null;
}
const Ko = (t) => t ? Dd(t) ? na(t) || t.proxy : Ko(t.parent) : null, Gr = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Fe(/* @__PURE__ */ Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => Ko(t.parent),
    $root: (t) => Ko(t.root),
    $emit: (t) => t.emit,
    $options: (t) => Xl(t),
    $forceUpdate: (t) => t.f || (t.f = () => Gl(t.update)),
    $nextTick: (t) => t.n || (t.n = yd.bind(t.proxy)),
    $watch: (t) => Uh.bind(t)
  })
), lo = (t, e) => t !== we && !t.__isScriptSetup && de(t, e), lm = {
  get({ _: t }, e) {
    const { ctx: n, setupState: r, data: i, props: s, accessCache: o, type: l, appContext: a } = t;
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
        if (lo(r, e))
          return o[e] = 1, r[e];
        if (i !== we && de(i, e))
          return o[e] = 2, i[e];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (c = t.propsOptions[0]) && de(c, e)
        )
          return o[e] = 3, s[e];
        if (n !== we && de(n, e))
          return o[e] = 4, n[e];
        Uo && (o[e] = 0);
      }
    }
    const d = Gr[e];
    let f, h;
    if (d)
      return e === "$attrs" && ut(t, "get", e), d(t);
    if (
      // css module (injected by vue-loader)
      (f = l.__cssModules) && (f = f[e])
    )
      return f;
    if (n !== we && de(n, e))
      return o[e] = 4, n[e];
    if (
      // global properties
      h = a.config.globalProperties, de(h, e)
    )
      return h[e];
  },
  set({ _: t }, e, n) {
    const { data: r, setupState: i, ctx: s } = t;
    return lo(i, e) ? (i[e] = n, !0) : r !== we && de(r, e) ? (r[e] = n, !0) : de(t.props, e) || e[0] === "$" && e.slice(1) in t ? !1 : (s[e] = n, !0);
  },
  has({
    _: { data: t, setupState: e, accessCache: n, ctx: r, appContext: i, propsOptions: s }
  }, o) {
    let l;
    return !!n[o] || t !== we && de(t, o) || lo(e, o) || (l = s[0]) && de(l, o) || de(r, o) || de(Gr, o) || de(i.config.globalProperties, o);
  },
  defineProperty(t, e, n) {
    return n.get != null ? t._.accessCache[e] = 0 : de(n, "value") && this.set(t, e, n.value, null), Reflect.defineProperty(t, e, n);
  }
};
function am() {
  return cm().slots;
}
function cm() {
  const t = Rm();
  return t.setupContext || (t.setupContext = $d(t));
}
function tc(t) {
  return ie(t) ? t.reduce(
    (e, n) => (e[n] = null, e),
    {}
  ) : t;
}
let Uo = !0;
function um(t) {
  const e = Xl(t), n = t.proxy, r = t.ctx;
  Uo = !1, e.beforeCreate && nc(e.beforeCreate, t, "bc");
  const {
    // state
    data: i,
    computed: s,
    methods: o,
    watch: l,
    provide: a,
    inject: c,
    // lifecycle
    created: d,
    beforeMount: f,
    mounted: h,
    beforeUpdate: g,
    updated: y,
    activated: v,
    deactivated: k,
    beforeDestroy: E,
    beforeUnmount: T,
    destroyed: j,
    unmounted: u,
    render: m,
    renderTracked: p,
    renderTriggered: b,
    errorCaptured: w,
    serverPrefetch: S,
    // public API
    expose: x,
    inheritAttrs: A,
    // assets
    components: B,
    directives: L,
    filters: R
  } = e;
  if (c && dm(c, r, null), o)
    for (const O in o) {
      const I = o[O];
      oe(I) && (r[O] = I.bind(n));
    }
  if (i) {
    const O = i.call(n, n);
    _e(O) && (t.data = mi(O));
  }
  if (Uo = !0, s)
    for (const O in s) {
      const I = s[O], W = oe(I) ? I.bind(n, n) : oe(I.get) ? I.get.bind(n, n) : Tt, te = !oe(I) && oe(I.set) ? I.set.bind(n) : Tt, U = Pn({
        get: W,
        set: te
      });
      Object.defineProperty(r, O, {
        enumerable: !0,
        configurable: !0,
        get: () => U.value,
        set: (le) => U.value = le
      });
    }
  if (l)
    for (const O in l)
      Ad(l[O], r, n, O);
  if (a) {
    const O = oe(a) ? a.call(n) : a;
    Reflect.ownKeys(O).forEach((I) => {
      ym(I, O[I]);
    });
  }
  d && nc(d, t, "c");
  function _(O, I) {
    ie(I) ? I.forEach((W) => O(W.bind(n))) : I && O(I.bind(n));
  }
  if (_(Yh, f), _(Xh, h), _(Qh, g), _(Zh, y), _(qh, v), _(Gh, k), _(im, w), _(rm, p), _(nm, b), _(em, T), _(Yl, u), _(tm, S), ie(x))
    if (x.length) {
      const O = t.exposed || (t.exposed = {});
      x.forEach((I) => {
        Object.defineProperty(O, I, {
          get: () => n[I],
          set: (W) => n[I] = W
        });
      });
    } else
      t.exposed || (t.exposed = {});
  m && t.render === Tt && (t.render = m), A != null && (t.inheritAttrs = A), B && (t.components = B), L && (t.directives = L);
}
function dm(t, e, n = Tt) {
  ie(t) && (t = qo(t));
  for (const r in t) {
    const i = t[r];
    let s;
    _e(i) ? "default" in i ? s = Jr(
      i.from || r,
      i.default,
      !0
      /* treat default function as factory */
    ) : s = Jr(i.from || r) : s = Jr(i), Ye(s) ? Object.defineProperty(e, r, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : e[r] = s;
  }
}
function nc(t, e, n) {
  Ot(
    ie(t) ? t.map((r) => r.bind(e.proxy)) : t.bind(e.proxy),
    e,
    n
  );
}
function Ad(t, e, n, r) {
  const i = r.includes(".") ? kd(n, r) : () => n[r];
  if (ze(t)) {
    const s = e[t];
    oe(s) && yr(i, s);
  } else if (oe(t))
    yr(i, t.bind(n));
  else if (_e(t))
    if (ie(t))
      t.forEach((s) => Ad(s, e, n, r));
    else {
      const s = oe(t.handler) ? t.handler.bind(n) : e[t.handler];
      oe(s) && yr(i, s, t);
    }
}
function Xl(t) {
  const e = t.type, { mixins: n, extends: r } = e, {
    mixins: i,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = t.appContext, l = s.get(e);
  let a;
  return l ? a = l : !i.length && !n && !r ? a = e : (a = {}, i.length && i.forEach(
    (c) => is(a, c, o, !0)
  ), is(a, e, o)), _e(e) && s.set(e, a), a;
}
function is(t, e, n, r = !1) {
  const { mixins: i, extends: s } = e;
  s && is(t, s, n, !0), i && i.forEach(
    (o) => is(t, o, n, !0)
  );
  for (const o in e)
    if (!(r && o === "expose")) {
      const l = fm[o] || n && n[o];
      t[o] = l ? l(t[o], e[o]) : e[o];
    }
  return t;
}
const fm = {
  data: rc,
  props: ic,
  emits: ic,
  // objects
  methods: Wr,
  computed: Wr,
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
  components: Wr,
  directives: Wr,
  // watch
  watch: hm,
  // provide / inject
  provide: rc,
  inject: pm
};
function rc(t, e) {
  return e ? t ? function() {
    return Fe(
      oe(t) ? t.call(this, this) : t,
      oe(e) ? e.call(this, this) : e
    );
  } : e : t;
}
function pm(t, e) {
  return Wr(qo(t), qo(e));
}
function qo(t) {
  if (ie(t)) {
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
function Wr(t, e) {
  return t ? Fe(/* @__PURE__ */ Object.create(null), t, e) : e;
}
function ic(t, e) {
  return t ? ie(t) && ie(e) ? [.../* @__PURE__ */ new Set([...t, ...e])] : Fe(
    /* @__PURE__ */ Object.create(null),
    tc(t),
    tc(e ?? {})
  ) : e;
}
function hm(t, e) {
  if (!t)
    return e;
  if (!e)
    return t;
  const n = Fe(/* @__PURE__ */ Object.create(null), t);
  for (const r in e)
    n[r] = nt(t[r], e[r]);
  return n;
}
function Td() {
  return {
    app: null,
    config: {
      isNativeTag: zp,
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
let mm = 0;
function gm(t, e) {
  return function(r, i = null) {
    oe(r) || (r = Fe({}, r)), i != null && !_e(i) && (i = null);
    const s = Td(), o = /* @__PURE__ */ new Set();
    let l = !1;
    const a = s.app = {
      _uid: mm++,
      _component: r,
      _props: i,
      _container: null,
      _context: s,
      _instance: null,
      version: Hm,
      get config() {
        return s.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return o.has(c) || (c && oe(c.install) ? (o.add(c), c.install(a, ...d)) : oe(c) && (o.add(c), c(a, ...d))), a;
      },
      mixin(c) {
        return s.mixins.includes(c) || s.mixins.push(c), a;
      },
      component(c, d) {
        return d ? (s.components[c] = d, a) : s.components[c];
      },
      directive(c, d) {
        return d ? (s.directives[c] = d, a) : s.directives[c];
      },
      mount(c, d, f) {
        if (!l) {
          const h = Ne(
            r,
            i
          );
          return h.appContext = s, d && e ? e(h, c) : t(h, c, f), l = !0, a._container = c, c.__vue_app__ = a, na(h.component) || h.component.proxy;
        }
      },
      unmount() {
        l && (t(null, a._container), delete a._container.__vue_app__);
      },
      provide(c, d) {
        return s.provides[c] = d, a;
      },
      runWithContext(c) {
        ss = a;
        try {
          return c();
        } finally {
          ss = null;
        }
      }
    };
    return a;
  };
}
let ss = null;
function ym(t, e) {
  if (Be) {
    let n = Be.provides;
    const r = Be.parent && Be.parent.provides;
    r === n && (n = Be.provides = Object.create(r)), n[t] = e;
  }
}
function Jr(t, e, n = !1) {
  const r = Be || Xe;
  if (r || ss) {
    const i = r ? r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : ss._context.provides;
    if (i && t in i)
      return i[t];
    if (arguments.length > 1)
      return n && oe(e) ? e.call(r && r.proxy) : e;
  }
}
function bm(t, e, n, r = !1) {
  const i = {}, s = {};
  ts(s, Js, 1), t.propsDefaults = /* @__PURE__ */ Object.create(null), Od(t, e, i, s);
  for (const o in t.propsOptions[0])
    o in i || (i[o] = void 0);
  n ? t.props = r ? i : Ch(i) : t.type.props ? t.props = i : t.props = s, t.attrs = s;
}
function vm(t, e, n, r) {
  const {
    props: i,
    attrs: s,
    vnode: { patchFlag: o }
  } = t, l = pe(i), [a] = t.propsOptions;
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
        let h = d[f];
        if (Ks(t.emitsOptions, h))
          continue;
        const g = e[h];
        if (a)
          if (de(s, h))
            g !== s[h] && (s[h] = g, c = !0);
          else {
            const y = Ut(h);
            i[y] = Go(
              a,
              l,
              y,
              g,
              t,
              !1
              /* isAbsent */
            );
          }
        else
          g !== s[h] && (s[h] = g, c = !0);
      }
    }
  } else {
    Od(t, e, i, s) && (c = !0);
    let d;
    for (const f in l)
      (!e || // for camelCase
      !de(e, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = Or(f)) === f || !de(e, d))) && (a ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[d] !== void 0) && (i[f] = Go(
        a,
        l,
        f,
        void 0,
        t,
        !0
        /* isAbsent */
      )) : delete i[f]);
    if (s !== l)
      for (const f in s)
        (!e || !de(e, f)) && (delete s[f], c = !0);
  }
  c && Zt(t, "set", "$attrs");
}
function Od(t, e, n, r) {
  const [i, s] = t.propsOptions;
  let o = !1, l;
  if (e)
    for (let a in e) {
      if (Wi(a))
        continue;
      const c = e[a];
      let d;
      i && de(i, d = Ut(a)) ? !s || !s.includes(d) ? n[d] = c : (l || (l = {}))[d] = c : Ks(t.emitsOptions, a) || (!(a in r) || c !== r[a]) && (r[a] = c, o = !0);
    }
  if (s) {
    const a = pe(n), c = l || we;
    for (let d = 0; d < s.length; d++) {
      const f = s[d];
      n[f] = Go(
        i,
        a,
        f,
        c[f],
        t,
        !de(c, f)
      );
    }
  }
  return o;
}
function Go(t, e, n, r, i, s) {
  const o = t[n];
  if (o != null) {
    const l = de(o, "default");
    if (l && r === void 0) {
      const a = o.default;
      if (o.type !== Function && !o.skipFactory && oe(a)) {
        const { propsDefaults: c } = i;
        n in c ? r = c[n] : (Sr(i), r = c[n] = a.call(
          null,
          e
        ), Wn());
      } else
        r = a;
    }
    o[
      0
      /* shouldCast */
    ] && (s && !l ? r = !1 : o[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === Or(n)) && (r = !0));
  }
  return r;
}
function jd(t, e, n = !1) {
  const r = e.propsCache, i = r.get(t);
  if (i)
    return i;
  const s = t.props, o = {}, l = [];
  let a = !1;
  if (!oe(t)) {
    const d = (f) => {
      a = !0;
      const [h, g] = jd(f, e, !0);
      Fe(o, h), g && l.push(...g);
    };
    !n && e.mixins.length && e.mixins.forEach(d), t.extends && d(t.extends), t.mixins && t.mixins.forEach(d);
  }
  if (!s && !a)
    return _e(t) && r.set(t, pr), pr;
  if (ie(s))
    for (let d = 0; d < s.length; d++) {
      const f = Ut(s[d]);
      sc(f) && (o[f] = we);
    }
  else if (s)
    for (const d in s) {
      const f = Ut(d);
      if (sc(f)) {
        const h = s[d], g = o[f] = ie(h) || oe(h) ? { type: h } : Fe({}, h);
        if (g) {
          const y = ac(Boolean, g.type), v = ac(String, g.type);
          g[
            0
            /* shouldCast */
          ] = y > -1, g[
            1
            /* shouldCastTrue */
          ] = v < 0 || y < v, (y > -1 || de(g, "default")) && l.push(f);
        }
      }
    }
  const c = [o, l];
  return _e(t) && r.set(t, c), c;
}
function sc(t) {
  return t[0] !== "$";
}
function oc(t) {
  const e = t && t.toString().match(/^\s*(function|class) (\w+)/);
  return e ? e[2] : t === null ? "null" : "";
}
function lc(t, e) {
  return oc(t) === oc(e);
}
function ac(t, e) {
  return ie(e) ? e.findIndex((n) => lc(n, t)) : oe(e) && lc(e, t) ? 0 : -1;
}
const Pd = (t) => t[0] === "_" || t === "$stable", Ql = (t) => ie(t) ? t.map(Ht) : [Ht(t)], wm = (t, e, n) => {
  if (e._n)
    return e;
  const r = Rr((...i) => Ql(e(...i)), n);
  return r._c = !1, r;
}, Rd = (t, e, n) => {
  const r = t._ctx;
  for (const i in t) {
    if (Pd(i))
      continue;
    const s = t[i];
    if (oe(s))
      e[i] = wm(i, s, r);
    else if (s != null) {
      const o = Ql(s);
      e[i] = () => o;
    }
  }
}, Id = (t, e) => {
  const n = Ql(e);
  t.slots.default = () => n;
}, _m = (t, e) => {
  if (t.vnode.shapeFlag & 32) {
    const n = e._;
    n ? (t.slots = pe(e), ts(e, "_", n)) : Rd(
      e,
      t.slots = {}
    );
  } else
    t.slots = {}, e && Id(t, e);
  ts(t.slots, Js, 1);
}, km = (t, e, n) => {
  const { vnode: r, slots: i } = t;
  let s = !0, o = we;
  if (r.shapeFlag & 32) {
    const l = e._;
    l ? n && l === 1 ? s = !1 : (Fe(i, e), !n && l === 1 && delete i._) : (s = !e.$stable, Rd(e, i)), o = e;
  } else
    e && (Id(t, e), o = { default: 1 });
  if (s)
    for (const l in i)
      !Pd(l) && !(l in o) && delete i[l];
};
function Jo(t, e, n, r, i = !1) {
  if (ie(t)) {
    t.forEach(
      (h, g) => Jo(
        h,
        e && (ie(e) ? e[g] : e),
        n,
        r,
        i
      )
    );
    return;
  }
  if (qr(r) && !i)
    return;
  const s = r.shapeFlag & 4 ? na(r.component) || r.component.proxy : r.el, o = i ? null : s, { i: l, r: a } = t, c = e && e.r, d = l.refs === we ? l.refs = {} : l.refs, f = l.setupState;
  if (c != null && c !== a && (ze(c) ? (d[c] = null, de(f, c) && (f[c] = null)) : Ye(c) && (c.value = null)), oe(a))
    yn(a, l, 12, [o, d]);
  else {
    const h = ze(a), g = Ye(a);
    if (h || g) {
      const y = () => {
        if (t.f) {
          const v = h ? de(f, a) ? f[a] : d[a] : a.value;
          i ? ie(v) && Nl(v, s) : ie(v) ? v.includes(s) || v.push(s) : h ? (d[a] = [s], de(f, a) && (f[a] = d[a])) : (a.value = [s], t.k && (d[t.k] = a.value));
        } else
          h ? (d[a] = o, de(f, a) && (f[a] = o)) : g && (a.value = o, t.k && (d[t.k] = o));
      };
      o ? (y.id = -1, ot(y, n)) : y();
    }
  }
}
const ot = Vh;
function xm(t) {
  return Sm(t);
}
function Sm(t, e) {
  const n = Bo();
  n.__VUE__ = !0;
  const {
    insert: r,
    remove: i,
    patchProp: s,
    createElement: o,
    createText: l,
    createComment: a,
    setText: c,
    setElementText: d,
    parentNode: f,
    nextSibling: h,
    setScopeId: g = Tt,
    insertStaticContent: y
  } = t, v = (C, M, P, D = null, z = null, K = null, J = !1, V = null, q = !!M.dynamicChildren) => {
    if (C === M)
      return;
    C && !Dr(C, M) && (D = Ie(C), le(C, z, K, !0), C = null), M.patchFlag === -2 && (q = !1, M.dynamicChildren = null);
    const { type: $, ref: Q, shapeFlag: Y } = M;
    switch ($) {
      case Gs:
        k(C, M, P, D);
        break;
      case _n:
        E(C, M, P, D);
        break;
      case ao:
        C == null && T(M, P, D, J);
        break;
      case Ge:
        B(
          C,
          M,
          P,
          D,
          z,
          K,
          J,
          V,
          q
        );
        break;
      default:
        Y & 1 ? m(
          C,
          M,
          P,
          D,
          z,
          K,
          J,
          V,
          q
        ) : Y & 6 ? L(
          C,
          M,
          P,
          D,
          z,
          K,
          J,
          V,
          q
        ) : (Y & 64 || Y & 128) && $.process(
          C,
          M,
          P,
          D,
          z,
          K,
          J,
          V,
          q,
          It
        );
    }
    Q != null && z && Jo(Q, C && C.ref, K, M || C, !M);
  }, k = (C, M, P, D) => {
    if (C == null)
      r(
        M.el = l(M.children),
        P,
        D
      );
    else {
      const z = M.el = C.el;
      M.children !== C.children && c(z, M.children);
    }
  }, E = (C, M, P, D) => {
    C == null ? r(
      M.el = a(M.children || ""),
      P,
      D
    ) : M.el = C.el;
  }, T = (C, M, P, D) => {
    [C.el, C.anchor] = y(
      C.children,
      M,
      P,
      D,
      C.el,
      C.anchor
    );
  }, j = ({ el: C, anchor: M }, P, D) => {
    let z;
    for (; C && C !== M; )
      z = h(C), r(C, P, D), C = z;
    r(M, P, D);
  }, u = ({ el: C, anchor: M }) => {
    let P;
    for (; C && C !== M; )
      P = h(C), i(C), C = P;
    i(M);
  }, m = (C, M, P, D, z, K, J, V, q) => {
    J = J || M.type === "svg", C == null ? p(
      M,
      P,
      D,
      z,
      K,
      J,
      V,
      q
    ) : S(
      C,
      M,
      z,
      K,
      J,
      V,
      q
    );
  }, p = (C, M, P, D, z, K, J, V) => {
    let q, $;
    const { type: Q, props: Y, shapeFlag: Z, transition: se, dirs: ae } = C;
    if (q = C.el = o(
      C.type,
      K,
      Y && Y.is,
      Y
    ), Z & 8 ? d(q, C.children) : Z & 16 && w(
      C.children,
      q,
      null,
      D,
      z,
      K && Q !== "foreignObject",
      J,
      V
    ), ae && An(C, null, D, "created"), b(q, C, C.scopeId, J, D), Y) {
      for (const he in Y)
        he !== "value" && !Wi(he) && s(
          q,
          he,
          null,
          Y[he],
          K,
          C.children,
          D,
          z,
          be
        );
      "value" in Y && s(q, "value", null, Y.value), ($ = Y.onVnodeBeforeMount) && Lt($, D, C);
    }
    ae && An(C, null, D, "beforeMount");
    const ye = (!z || z && !z.pendingBranch) && se && !se.persisted;
    ye && se.beforeEnter(q), r(q, M, P), (($ = Y && Y.onVnodeMounted) || ye || ae) && ot(() => {
      $ && Lt($, D, C), ye && se.enter(q), ae && An(C, null, D, "mounted");
    }, z);
  }, b = (C, M, P, D, z) => {
    if (P && g(C, P), D)
      for (let K = 0; K < D.length; K++)
        g(C, D[K]);
    if (z) {
      let K = z.subTree;
      if (M === K) {
        const J = z.vnode;
        b(
          C,
          J,
          J.scopeId,
          J.slotScopeIds,
          z.parent
        );
      }
    }
  }, w = (C, M, P, D, z, K, J, V, q = 0) => {
    for (let $ = q; $ < C.length; $++) {
      const Q = C[$] = V ? ln(C[$]) : Ht(C[$]);
      v(
        null,
        Q,
        M,
        P,
        D,
        z,
        K,
        J,
        V
      );
    }
  }, S = (C, M, P, D, z, K, J) => {
    const V = M.el = C.el;
    let { patchFlag: q, dynamicChildren: $, dirs: Q } = M;
    q |= C.patchFlag & 16;
    const Y = C.props || we, Z = M.props || we;
    let se;
    P && Tn(P, !1), (se = Z.onVnodeBeforeUpdate) && Lt(se, P, M, C), Q && An(M, C, P, "beforeUpdate"), P && Tn(P, !0);
    const ae = z && M.type !== "foreignObject";
    if ($ ? x(
      C.dynamicChildren,
      $,
      V,
      P,
      D,
      ae,
      K
    ) : J || I(
      C,
      M,
      V,
      null,
      P,
      D,
      ae,
      K,
      !1
    ), q > 0) {
      if (q & 16)
        A(
          V,
          M,
          Y,
          Z,
          P,
          D,
          z
        );
      else if (q & 2 && Y.class !== Z.class && s(V, "class", null, Z.class, z), q & 4 && s(V, "style", Y.style, Z.style, z), q & 8) {
        const ye = M.dynamicProps;
        for (let he = 0; he < ye.length; he++) {
          const je = ye[he], St = Y[je], Qn = Z[je];
          (Qn !== St || je === "value") && s(
            V,
            je,
            St,
            Qn,
            z,
            C.children,
            P,
            D,
            be
          );
        }
      }
      q & 1 && C.children !== M.children && d(V, M.children);
    } else
      !J && $ == null && A(
        V,
        M,
        Y,
        Z,
        P,
        D,
        z
      );
    ((se = Z.onVnodeUpdated) || Q) && ot(() => {
      se && Lt(se, P, M, C), Q && An(M, C, P, "updated");
    }, D);
  }, x = (C, M, P, D, z, K, J) => {
    for (let V = 0; V < M.length; V++) {
      const q = C[V], $ = M[V], Q = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        q.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (q.type === Ge || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Dr(q, $) || // - In the case of a component, it could contain anything.
        q.shapeFlag & 70) ? f(q.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          P
        )
      );
      v(
        q,
        $,
        Q,
        null,
        D,
        z,
        K,
        J,
        !0
      );
    }
  }, A = (C, M, P, D, z, K, J) => {
    if (P !== D) {
      if (P !== we)
        for (const V in P)
          !Wi(V) && !(V in D) && s(
            C,
            V,
            P[V],
            null,
            J,
            M.children,
            z,
            K,
            be
          );
      for (const V in D) {
        if (Wi(V))
          continue;
        const q = D[V], $ = P[V];
        q !== $ && V !== "value" && s(
          C,
          V,
          $,
          q,
          J,
          M.children,
          z,
          K,
          be
        );
      }
      "value" in D && s(C, "value", P.value, D.value);
    }
  }, B = (C, M, P, D, z, K, J, V, q) => {
    const $ = M.el = C ? C.el : l(""), Q = M.anchor = C ? C.anchor : l("");
    let { patchFlag: Y, dynamicChildren: Z, slotScopeIds: se } = M;
    se && (V = V ? V.concat(se) : se), C == null ? (r($, P, D), r(Q, P, D), w(
      M.children,
      P,
      Q,
      z,
      K,
      J,
      V,
      q
    )) : Y > 0 && Y & 64 && Z && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    C.dynamicChildren ? (x(
      C.dynamicChildren,
      Z,
      P,
      z,
      K,
      J,
      V
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (M.key != null || z && M === z.subTree) && Nd(
      C,
      M,
      !0
      /* shallow */
    )) : I(
      C,
      M,
      P,
      Q,
      z,
      K,
      J,
      V,
      q
    );
  }, L = (C, M, P, D, z, K, J, V, q) => {
    M.slotScopeIds = V, C == null ? M.shapeFlag & 512 ? z.ctx.activate(
      M,
      P,
      D,
      J,
      q
    ) : R(
      M,
      P,
      D,
      z,
      K,
      J,
      q
    ) : N(C, M, q);
  }, R = (C, M, P, D, z, K, J) => {
    const V = C.component = Pm(
      C,
      D,
      z
    );
    if (xd(C) && (V.ctx.renderer = It), Im(V), V.asyncDep) {
      if (z && z.registerDep(V, _), !C.el) {
        const q = V.subTree = Ne(_n);
        E(null, q, M, P);
      }
      return;
    }
    _(
      V,
      C,
      M,
      P,
      z,
      K,
      J
    );
  }, N = (C, M, P) => {
    const D = M.component = C.component;
    if (Hh(C, M, P))
      if (D.asyncDep && !D.asyncResolved) {
        O(D, M, P);
        return;
      } else
        D.next = M, Rh(D.update), D.update();
    else
      M.el = C.el, D.vnode = M;
  }, _ = (C, M, P, D, z, K, J) => {
    const V = () => {
      if (C.isMounted) {
        let { next: Q, bu: Y, u: Z, parent: se, vnode: ae } = C, ye = Q, he;
        Tn(C, !1), Q ? (Q.el = ae.el, O(C, Q, J)) : Q = ae, Y && so(Y), (he = Q.props && Q.props.onVnodeBeforeUpdate) && Lt(he, se, Q, ae), Tn(C, !0);
        const je = oo(C), St = C.subTree;
        C.subTree = je, v(
          St,
          je,
          // parent may have changed if it's in a teleport
          f(St.el),
          // anchor may have changed if it's in a fragment
          Ie(St),
          C,
          z,
          K
        ), Q.el = je.el, ye === null && Fh(C, je.el), Z && ot(Z, z), (he = Q.props && Q.props.onVnodeUpdated) && ot(
          () => Lt(he, se, Q, ae),
          z
        );
      } else {
        let Q;
        const { el: Y, props: Z } = M, { bm: se, m: ae, parent: ye } = C, he = qr(M);
        if (Tn(C, !1), se && so(se), !he && (Q = Z && Z.onVnodeBeforeMount) && Lt(Q, ye, M), Tn(C, !0), Y && Xn) {
          const je = () => {
            C.subTree = oo(C), Xn(
              Y,
              C.subTree,
              C,
              z,
              null
            );
          };
          he ? M.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !C.isUnmounted && je()
          ) : je();
        } else {
          const je = C.subTree = oo(C);
          v(
            null,
            je,
            P,
            D,
            C,
            z,
            K
          ), M.el = je.el;
        }
        if (ae && ot(ae, z), !he && (Q = Z && Z.onVnodeMounted)) {
          const je = M;
          ot(
            () => Lt(Q, ye, je),
            z
          );
        }
        (M.shapeFlag & 256 || ye && qr(ye.vnode) && ye.vnode.shapeFlag & 256) && C.a && ot(C.a, z), C.isMounted = !0, M = P = D = null;
      }
    }, q = C.effect = new $l(
      V,
      () => Gl($),
      C.scope
      // track it in component's effect scope
    ), $ = C.update = () => q.run();
    $.id = C.uid, Tn(C, !0), $();
  }, O = (C, M, P) => {
    M.component = C;
    const D = C.vnode.props;
    C.vnode = M, C.next = null, vm(C, M.props, D, P), km(C, M.children, P), jr(), Qa(), Pr();
  }, I = (C, M, P, D, z, K, J, V, q = !1) => {
    const $ = C && C.children, Q = C ? C.shapeFlag : 0, Y = M.children, { patchFlag: Z, shapeFlag: se } = M;
    if (Z > 0) {
      if (Z & 128) {
        te(
          $,
          Y,
          P,
          D,
          z,
          K,
          J,
          V,
          q
        );
        return;
      } else if (Z & 256) {
        W(
          $,
          Y,
          P,
          D,
          z,
          K,
          J,
          V,
          q
        );
        return;
      }
    }
    se & 8 ? (Q & 16 && be($, z, K), Y !== $ && d(P, Y)) : Q & 16 ? se & 16 ? te(
      $,
      Y,
      P,
      D,
      z,
      K,
      J,
      V,
      q
    ) : be($, z, K, !0) : (Q & 8 && d(P, ""), se & 16 && w(
      Y,
      P,
      D,
      z,
      K,
      J,
      V,
      q
    ));
  }, W = (C, M, P, D, z, K, J, V, q) => {
    C = C || pr, M = M || pr;
    const $ = C.length, Q = M.length, Y = Math.min($, Q);
    let Z;
    for (Z = 0; Z < Y; Z++) {
      const se = M[Z] = q ? ln(M[Z]) : Ht(M[Z]);
      v(
        C[Z],
        se,
        P,
        null,
        z,
        K,
        J,
        V,
        q
      );
    }
    $ > Q ? be(
      C,
      z,
      K,
      !0,
      !1,
      Y
    ) : w(
      M,
      P,
      D,
      z,
      K,
      J,
      V,
      q,
      Y
    );
  }, te = (C, M, P, D, z, K, J, V, q) => {
    let $ = 0;
    const Q = M.length;
    let Y = C.length - 1, Z = Q - 1;
    for (; $ <= Y && $ <= Z; ) {
      const se = C[$], ae = M[$] = q ? ln(M[$]) : Ht(M[$]);
      if (Dr(se, ae))
        v(
          se,
          ae,
          P,
          null,
          z,
          K,
          J,
          V,
          q
        );
      else
        break;
      $++;
    }
    for (; $ <= Y && $ <= Z; ) {
      const se = C[Y], ae = M[Z] = q ? ln(M[Z]) : Ht(M[Z]);
      if (Dr(se, ae))
        v(
          se,
          ae,
          P,
          null,
          z,
          K,
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
        const se = Z + 1, ae = se < Q ? M[se].el : D;
        for (; $ <= Z; )
          v(
            null,
            M[$] = q ? ln(M[$]) : Ht(M[$]),
            P,
            ae,
            z,
            K,
            J,
            V,
            q
          ), $++;
      }
    } else if ($ > Z)
      for (; $ <= Y; )
        le(C[$], z, K, !0), $++;
    else {
      const se = $, ae = $, ye = /* @__PURE__ */ new Map();
      for ($ = ae; $ <= Z; $++) {
        const ft = M[$] = q ? ln(M[$]) : Ht(M[$]);
        ft.key != null && ye.set(ft.key, $);
      }
      let he, je = 0;
      const St = Z - ae + 1;
      let Qn = !1, Ha = 0;
      const zr = new Array(St);
      for ($ = 0; $ < St; $++)
        zr[$] = 0;
      for ($ = se; $ <= Y; $++) {
        const ft = C[$];
        if (je >= St) {
          le(ft, z, K, !0);
          continue;
        }
        let Nt;
        if (ft.key != null)
          Nt = ye.get(ft.key);
        else
          for (he = ae; he <= Z; he++)
            if (zr[he - ae] === 0 && Dr(ft, M[he])) {
              Nt = he;
              break;
            }
        Nt === void 0 ? le(ft, z, K, !0) : (zr[Nt - ae] = $ + 1, Nt >= Ha ? Ha = Nt : Qn = !0, v(
          ft,
          M[Nt],
          P,
          null,
          z,
          K,
          J,
          V,
          q
        ), je++);
      }
      const Fa = Qn ? Cm(zr) : pr;
      for (he = Fa.length - 1, $ = St - 1; $ >= 0; $--) {
        const ft = ae + $, Nt = M[ft], Wa = ft + 1 < Q ? M[ft + 1].el : D;
        zr[$] === 0 ? v(
          null,
          Nt,
          P,
          Wa,
          z,
          K,
          J,
          V,
          q
        ) : Qn && (he < 0 || $ !== Fa[he] ? U(Nt, P, Wa, 2) : he--);
      }
    }
  }, U = (C, M, P, D, z = null) => {
    const { el: K, type: J, transition: V, children: q, shapeFlag: $ } = C;
    if ($ & 6) {
      U(C.component.subTree, M, P, D);
      return;
    }
    if ($ & 128) {
      C.suspense.move(M, P, D);
      return;
    }
    if ($ & 64) {
      J.move(C, M, P, It);
      return;
    }
    if (J === Ge) {
      r(K, M, P);
      for (let Y = 0; Y < q.length; Y++)
        U(q[Y], M, P, D);
      r(C.anchor, M, P);
      return;
    }
    if (J === ao) {
      j(C, M, P);
      return;
    }
    if (D !== 2 && $ & 1 && V)
      if (D === 0)
        V.beforeEnter(K), r(K, M, P), ot(() => V.enter(K), z);
      else {
        const { leave: Y, delayLeave: Z, afterLeave: se } = V, ae = () => r(K, M, P), ye = () => {
          Y(K, () => {
            ae(), se && se();
          });
        };
        Z ? Z(K, ae, ye) : ye();
      }
    else
      r(K, M, P);
  }, le = (C, M, P, D = !1, z = !1) => {
    const {
      type: K,
      props: J,
      ref: V,
      children: q,
      dynamicChildren: $,
      shapeFlag: Q,
      patchFlag: Y,
      dirs: Z
    } = C;
    if (V != null && Jo(V, null, P, C, !0), Q & 256) {
      M.ctx.deactivate(C);
      return;
    }
    const se = Q & 1 && Z, ae = !qr(C);
    let ye;
    if (ae && (ye = J && J.onVnodeBeforeUnmount) && Lt(ye, M, C), Q & 6)
      Me(C.component, P, D);
    else {
      if (Q & 128) {
        C.suspense.unmount(P, D);
        return;
      }
      se && An(C, null, M, "beforeUnmount"), Q & 64 ? C.type.remove(
        C,
        M,
        P,
        z,
        It,
        D
      ) : $ && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (K !== Ge || Y > 0 && Y & 64) ? be(
        $,
        M,
        P,
        !1,
        !0
      ) : (K === Ge && Y & 384 || !z && Q & 16) && be(q, M, P), D && ge(C);
    }
    (ae && (ye = J && J.onVnodeUnmounted) || se) && ot(() => {
      ye && Lt(ye, M, C), se && An(C, null, M, "unmounted");
    }, P);
  }, ge = (C) => {
    const { type: M, el: P, anchor: D, transition: z } = C;
    if (M === Ge) {
      Ee(P, D);
      return;
    }
    if (M === ao) {
      u(C);
      return;
    }
    const K = () => {
      i(P), z && !z.persisted && z.afterLeave && z.afterLeave();
    };
    if (C.shapeFlag & 1 && z && !z.persisted) {
      const { leave: J, delayLeave: V } = z, q = () => J(P, K);
      V ? V(C.el, K, q) : q();
    } else
      K();
  }, Ee = (C, M) => {
    let P;
    for (; C !== M; )
      P = h(C), i(C), C = P;
    i(M);
  }, Me = (C, M, P) => {
    const { bum: D, scope: z, update: K, subTree: J, um: V } = C;
    D && so(D), z.stop(), K && (K.active = !1, le(J, C, M, P)), V && ot(V, M), ot(() => {
      C.isUnmounted = !0;
    }, M), M && M.pendingBranch && !M.isUnmounted && C.asyncDep && !C.asyncResolved && C.suspenseId === M.pendingId && (M.deps--, M.deps === 0 && M.resolve());
  }, be = (C, M, P, D = !1, z = !1, K = 0) => {
    for (let J = K; J < C.length; J++)
      le(C[J], M, P, D, z);
  }, Ie = (C) => C.shapeFlag & 6 ? Ie(C.component.subTree) : C.shapeFlag & 128 ? C.suspense.next() : h(C.anchor || C.el), qe = (C, M, P) => {
    C == null ? M._vnode && le(M._vnode, null, null, !0) : v(M._vnode || null, C, M, null, null, null, P), Qa(), vd(), M._vnode = C;
  }, It = {
    p: v,
    um: le,
    m: U,
    r: ge,
    mt: R,
    mc: w,
    pc: I,
    pbc: x,
    n: Ie,
    o: t
  };
  let Mn, Xn;
  return e && ([Mn, Xn] = e(
    It
  )), {
    render: qe,
    hydrate: Mn,
    createApp: gm(qe, Mn)
  };
}
function Tn({ effect: t, update: e }, n) {
  t.allowRecurse = e.allowRecurse = n;
}
function Nd(t, e, n = !1) {
  const r = t.children, i = e.children;
  if (ie(r) && ie(i))
    for (let s = 0; s < r.length; s++) {
      const o = r[s];
      let l = i[s];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = i[s] = ln(i[s]), l.el = o.el), n || Nd(o, l)), l.type === Gs && (l.el = o.el);
    }
}
function Cm(t) {
  const e = t.slice(), n = [0];
  let r, i, s, o, l;
  const a = t.length;
  for (r = 0; r < a; r++) {
    const c = t[r];
    if (c !== 0) {
      if (i = n[n.length - 1], t[i] < c) {
        e[r] = i, n.push(r);
        continue;
      }
      for (s = 0, o = n.length - 1; s < o; )
        l = s + o >> 1, t[n[l]] < c ? s = l + 1 : o = l;
      c < t[n[s]] && (s > 0 && (e[r] = n[s - 1]), n[s] = r);
    }
  }
  for (s = n.length, o = n[s - 1]; s-- > 0; )
    n[s] = o, o = e[o];
  return n;
}
const Em = (t) => t.__isTeleport, Ge = Symbol.for("v-fgt"), Gs = Symbol.for("v-txt"), _n = Symbol.for("v-cmt"), ao = Symbol.for("v-stc"), Yr = [];
let At = null;
function fe(t = !1) {
  Yr.push(At = t ? null : []);
}
function Mm() {
  Yr.pop(), At = Yr[Yr.length - 1] || null;
}
let li = 1;
function cc(t) {
  li += t;
}
function Ld(t) {
  return t.dynamicChildren = li > 0 ? At || pr : null, Mm(), li > 0 && At && At.push(t), t;
}
function Qe(t, e, n, r, i, s) {
  return Ld(
    ve(
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
function it(t, e, n, r, i) {
  return Ld(
    Ne(
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
function ls(t) {
  return t ? t.__v_isVNode === !0 : !1;
}
function Dr(t, e) {
  return t.type === e.type && t.key === e.key;
}
const Js = "__vInternal", zd = ({ key: t }) => t ?? null, Vi = ({
  ref: t,
  ref_key: e,
  ref_for: n
}) => (typeof t == "number" && (t = "" + t), t != null ? ze(t) || Ye(t) || oe(t) ? { i: Xe, r: t, k: e, f: !!n } : t : null);
function ve(t, e = null, n = null, r = 0, i = null, s = t === Ge ? 0 : 1, o = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && zd(e),
    ref: e && Vi(e),
    scopeId: Us,
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
    ctx: Xe
  };
  return l ? (Zl(a, n), s & 128 && t.normalize(a)) : n && (a.shapeFlag |= ze(n) ? 8 : 16), li > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  At && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && At.push(a), a;
}
const Ne = Am;
function Am(t, e = null, n = null, r = 0, i = null, s = !1) {
  if ((!t || t === sm) && (t = _n), ls(t)) {
    const l = xr(
      t,
      e,
      !0
      /* mergeRef: true */
    );
    return n && Zl(l, n), li > 0 && !s && At && (l.shapeFlag & 6 ? At[At.indexOf(t)] = l : At.push(l)), l.patchFlag |= -2, l;
  }
  if (Dm(t) && (t = t.__vccOpts), e) {
    e = Tm(e);
    let { class: l, style: a } = e;
    l && !ze(l) && (e.class = Ft(l)), _e(a) && (cd(a) && !ie(a) && (a = Fe({}, a)), e.style = Dl(a));
  }
  const o = ze(t) ? 1 : Wh(t) ? 128 : Em(t) ? 64 : _e(t) ? 4 : oe(t) ? 2 : 0;
  return ve(
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
function Tm(t) {
  return t ? cd(t) || Js in t ? Fe({}, t) : t : null;
}
function xr(t, e, n = !1) {
  const { props: r, ref: i, patchFlag: s, children: o } = t, l = e ? ea(r || {}, e) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t.type,
    props: l,
    key: l && zd(l),
    ref: e && e.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? ie(i) ? i.concat(Vi(e)) : [i, Vi(e)] : Vi(e)
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
    patchFlag: e && t.type !== Ge ? s === -1 ? 16 : s | 16 : s,
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
    ssContent: t.ssContent && xr(t.ssContent),
    ssFallback: t.ssFallback && xr(t.ssFallback),
    el: t.el,
    anchor: t.anchor,
    ctx: t.ctx,
    ce: t.ce
  };
}
function ai(t = " ", e = 0) {
  return Ne(Gs, null, t, e);
}
function fn(t = "", e = !1) {
  return e ? (fe(), it(_n, null, t)) : Ne(_n, null, t);
}
function Ht(t) {
  return t == null || typeof t == "boolean" ? Ne(_n) : ie(t) ? Ne(
    Ge,
    null,
    // #3666, avoid reference pollution when reusing vnode
    t.slice()
  ) : typeof t == "object" ? ln(t) : Ne(Gs, null, String(t));
}
function ln(t) {
  return t.el === null && t.patchFlag !== -1 || t.memo ? t : xr(t);
}
function Zl(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (e == null)
    e = null;
  else if (ie(e))
    n = 16;
  else if (typeof e == "object")
    if (r & 65) {
      const i = e.default;
      i && (i._c && (i._d = !1), Zl(t, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = e._;
      !i && !(Js in e) ? e._ctx = Xe : i === 3 && Xe && (Xe.slots._ === 1 ? e._ = 1 : (e._ = 2, t.patchFlag |= 1024));
    }
  else
    oe(e) ? (e = { default: e, _ctx: Xe }, n = 32) : (e = String(e), r & 64 ? (n = 16, e = [ai(e)]) : n = 8);
  t.children = e, t.shapeFlag |= n;
}
function ea(...t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    for (const i in r)
      if (i === "class")
        e.class !== r.class && (e.class = Ft([e.class, r.class]));
      else if (i === "style")
        e.style = Dl([e.style, r.style]);
      else if (Ds(i)) {
        const s = e[i], o = r[i];
        o && s !== o && !(ie(s) && s.includes(o)) && (e[i] = s ? [].concat(s, o) : o);
      } else
        i !== "" && (e[i] = r[i]);
  }
  return e;
}
function Lt(t, e, n, r = null) {
  Ot(t, e, 7, [
    n,
    r
  ]);
}
const Om = Td();
let jm = 0;
function Pm(t, e, n) {
  const r = t.type, i = (e ? e.appContext : t.appContext) || Om, s = {
    uid: jm++,
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
    scope: new Yp(
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
    propsOptions: jd(r, i),
    emitsOptions: _d(r, i),
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
  return s.ctx = { _: s }, s.root = e ? e.root : s, s.emit = Lh.bind(null, s), t.ce && t.ce(s), s;
}
let Be = null;
const Rm = () => Be || Xe;
let ta, Zn, uc = "__VUE_INSTANCE_SETTERS__";
(Zn = Bo()[uc]) || (Zn = Bo()[uc] = []), Zn.push((t) => Be = t), ta = (t) => {
  Zn.length > 1 ? Zn.forEach((e) => e(t)) : Zn[0](t);
};
const Sr = (t) => {
  ta(t), t.scope.on();
}, Wn = () => {
  Be && Be.scope.off(), ta(null);
};
function Dd(t) {
  return t.vnode.shapeFlag & 4;
}
let ci = !1;
function Im(t, e = !1) {
  ci = e;
  const { props: n, children: r } = t.vnode, i = Dd(t);
  bm(t, n, i, e), _m(t, r);
  const s = i ? Nm(t, e) : void 0;
  return ci = !1, s;
}
function Nm(t, e) {
  const n = t.type;
  t.accessCache = /* @__PURE__ */ Object.create(null), t.proxy = ud(new Proxy(t.ctx, lm));
  const { setup: r } = n;
  if (r) {
    const i = t.setupContext = r.length > 1 ? $d(t) : null;
    Sr(t), jr();
    const s = yn(
      r,
      t,
      0,
      [t.props, i]
    );
    if (Pr(), Wn(), qu(s)) {
      if (s.then(Wn, Wn), e)
        return s.then((o) => {
          dc(t, o, e);
        }).catch((o) => {
          Vs(o, t, 0);
        });
      t.asyncDep = s;
    } else
      dc(t, s, e);
  } else
    Bd(t, e);
}
function dc(t, e, n) {
  oe(e) ? t.type.__ssrInlineRender ? t.ssrRender = e : t.render = e : _e(e) && (t.setupState = md(e)), Bd(t, n);
}
let fc;
function Bd(t, e, n) {
  const r = t.type;
  if (!t.render) {
    if (!e && fc && !r.render) {
      const i = r.template || Xl(t).template;
      if (i) {
        const { isCustomElement: s, compilerOptions: o } = t.appContext.config, { delimiters: l, compilerOptions: a } = r, c = Fe(
          Fe(
            {
              isCustomElement: s,
              delimiters: l
            },
            o
          ),
          a
        );
        r.render = fc(i, c);
      }
    }
    t.render = r.render || Tt;
  }
  Sr(t), jr(), um(t), Pr(), Wn();
}
function Lm(t) {
  return t.attrsProxy || (t.attrsProxy = new Proxy(
    t.attrs,
    {
      get(e, n) {
        return ut(t, "get", "$attrs"), e[n];
      }
    }
  ));
}
function $d(t) {
  const e = (n) => {
    t.exposed = n || {};
  };
  return {
    get attrs() {
      return Lm(t);
    },
    slots: t.slots,
    emit: t.emit,
    expose: e
  };
}
function na(t) {
  if (t.exposed)
    return t.exposeProxy || (t.exposeProxy = new Proxy(md(ud(t.exposed)), {
      get(e, n) {
        if (n in e)
          return e[n];
        if (n in Gr)
          return Gr[n](t);
      },
      has(e, n) {
        return n in e || n in Gr;
      }
    }));
}
function zm(t, e = !0) {
  return oe(t) ? t.displayName || t.name : t.name || e && t.__name;
}
function Dm(t) {
  return oe(t) && "__vccOpts" in t;
}
const Pn = (t, e) => Oh(t, e, ci);
function Hd(t, e, n) {
  const r = arguments.length;
  return r === 2 ? _e(e) && !ie(e) ? ls(e) ? Ne(t, null, [e]) : Ne(t, e) : Ne(t, null, e) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ls(n) && (n = [n]), Ne(t, e, n));
}
const Bm = Symbol.for("v-scx"), $m = () => Jr(Bm), Hm = "3.3.4", Fm = "http://www.w3.org/2000/svg", Rn = typeof document < "u" ? document : null, pc = Rn && /* @__PURE__ */ Rn.createElement("template"), Wm = {
  insert: (t, e, n) => {
    e.insertBefore(t, n || null);
  },
  remove: (t) => {
    const e = t.parentNode;
    e && e.removeChild(t);
  },
  createElement: (t, e, n, r) => {
    const i = e ? Rn.createElementNS(Fm, t) : Rn.createElement(t, n ? { is: n } : void 0);
    return t === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
  },
  createText: (t) => Rn.createTextNode(t),
  createComment: (t) => Rn.createComment(t),
  setText: (t, e) => {
    t.nodeValue = e;
  },
  setElementText: (t, e) => {
    t.textContent = e;
  },
  parentNode: (t) => t.parentNode,
  nextSibling: (t) => t.nextSibling,
  querySelector: (t) => Rn.querySelector(t),
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
      pc.innerHTML = r ? `<svg>${t}</svg>` : t;
      const l = pc.content;
      if (r) {
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
};
function Vm(t, e, n) {
  const r = t._vtc;
  r && (e = (e ? [e, ...r] : [...r]).join(" ")), e == null ? t.removeAttribute("class") : n ? t.setAttribute("class", e) : t.className = e;
}
function Km(t, e, n) {
  const r = t.style, i = ze(n);
  if (n && !i) {
    if (e && !ze(e))
      for (const s in e)
        n[s] == null && Yo(r, s, "");
    for (const s in n)
      Yo(r, s, n[s]);
  } else {
    const s = r.display;
    i ? e !== n && (r.cssText = n) : e && t.removeAttribute("style"), "_vod" in t && (r.display = s);
  }
}
const hc = /\s*!important$/;
function Yo(t, e, n) {
  if (ie(n))
    n.forEach((r) => Yo(t, e, r));
  else if (n == null && (n = ""), e.startsWith("--"))
    t.setProperty(e, n);
  else {
    const r = Um(t, e);
    hc.test(n) ? t.setProperty(
      Or(r),
      n.replace(hc, ""),
      "important"
    ) : t[r] = n;
  }
}
const mc = ["Webkit", "Moz", "ms"], co = {};
function Um(t, e) {
  const n = co[e];
  if (n)
    return n;
  let r = Ut(e);
  if (r !== "filter" && r in t)
    return co[e] = r;
  r = Hs(r);
  for (let i = 0; i < mc.length; i++) {
    const s = mc[i] + r;
    if (s in t)
      return co[e] = s;
  }
  return e;
}
const gc = "http://www.w3.org/1999/xlink";
function qm(t, e, n, r, i) {
  if (r && e.startsWith("xlink:"))
    n == null ? t.removeAttributeNS(gc, e.slice(6, e.length)) : t.setAttributeNS(gc, e, n);
  else {
    const s = Jp(e);
    n == null || s && !Yu(n) ? t.removeAttribute(e) : t.setAttribute(e, s ? "" : n);
  }
}
function Gm(t, e, n, r, i, s, o) {
  if (e === "innerHTML" || e === "textContent") {
    r && o(r, i, s), t[e] = n ?? "";
    return;
  }
  const l = t.tagName;
  if (e === "value" && l !== "PROGRESS" && // custom elements may use _value internally
  !l.includes("-")) {
    t._value = n;
    const c = l === "OPTION" ? t.getAttribute("value") : t.value, d = n ?? "";
    c !== d && (t.value = d), n == null && t.removeAttribute(e);
    return;
  }
  let a = !1;
  if (n === "" || n == null) {
    const c = typeof t[e];
    c === "boolean" ? n = Yu(n) : n == null && c === "string" ? (n = "", a = !0) : c === "number" && (n = 0, a = !0);
  }
  try {
    t[e] = n;
  } catch {
  }
  a && t.removeAttribute(e);
}
function Jm(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function Ym(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
function Xm(t, e, n, r, i = null) {
  const s = t._vei || (t._vei = {}), o = s[e];
  if (r && o)
    o.value = r;
  else {
    const [l, a] = Qm(e);
    if (r) {
      const c = s[e] = t1(r, i);
      Jm(t, l, c, a);
    } else
      o && (Ym(t, l, o, a), s[e] = void 0);
  }
}
const yc = /(?:Once|Passive|Capture)$/;
function Qm(t) {
  let e;
  if (yc.test(t)) {
    e = {};
    let r;
    for (; r = t.match(yc); )
      t = t.slice(0, t.length - r[0].length), e[r[0].toLowerCase()] = !0;
  }
  return [t[2] === ":" ? t.slice(3) : Or(t.slice(2)), e];
}
let uo = 0;
const Zm = /* @__PURE__ */ Promise.resolve(), e1 = () => uo || (Zm.then(() => uo = 0), uo = Date.now());
function t1(t, e) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    Ot(
      n1(r, n.value),
      e,
      5,
      [r]
    );
  };
  return n.value = t, n.attached = e1(), n;
}
function n1(t, e) {
  if (ie(e)) {
    const n = t.stopImmediatePropagation;
    return t.stopImmediatePropagation = () => {
      n.call(t), t._stopped = !0;
    }, e.map((r) => (i) => !i._stopped && r && r(i));
  } else
    return e;
}
const bc = /^on[a-z]/, r1 = (t, e, n, r, i = !1, s, o, l, a) => {
  e === "class" ? Vm(t, r, i) : e === "style" ? Km(t, n, r) : Ds(e) ? Il(e) || Xm(t, e, n, r, o) : (e[0] === "." ? (e = e.slice(1), !0) : e[0] === "^" ? (e = e.slice(1), !1) : i1(t, e, r, i)) ? Gm(
    t,
    e,
    r,
    s,
    o,
    l,
    a
  ) : (e === "true-value" ? t._trueValue = r : e === "false-value" && (t._falseValue = r), qm(t, e, r, i));
};
function i1(t, e, n, r) {
  return r ? !!(e === "innerHTML" || e === "textContent" || e in t && bc.test(e) && oe(n)) : e === "spellcheck" || e === "draggable" || e === "translate" || e === "form" || e === "list" && t.tagName === "INPUT" || e === "type" && t.tagName === "TEXTAREA" || bc.test(e) && ze(n) ? !1 : e in t;
}
const s1 = /* @__PURE__ */ Fe({ patchProp: r1 }, Wm);
let vc;
function o1() {
  return vc || (vc = xm(s1));
}
const l1 = (...t) => {
  const e = o1().createApp(...t), { mount: n } = e;
  return e.mount = (r) => {
    const i = a1(r);
    if (!i)
      return;
    const s = e._component;
    !oe(s) && !s.render && !s.template && (s.template = i.innerHTML), i.innerHTML = "";
    const o = n(i, !1, i instanceof SVGElement);
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), o;
  }, e;
};
function a1(t) {
  return ze(t) ? document.querySelector(t) : t;
}
function c1(t) {
  return Qu() ? (Qp(t), !0) : !1;
}
function ra(t) {
  return typeof t == "function" ? t() : hd(t);
}
const u1 = typeof window < "u" && typeof document < "u", d1 = Object.prototype.toString, f1 = (t) => d1.call(t) === "[object Object]", p1 = () => {
};
function h1(t, e) {
  function n(...r) {
    return new Promise((i, s) => {
      Promise.resolve(t(() => e.apply(this, r), { fn: e, thisArg: this, args: r })).then(i).catch(s);
    });
  }
  return n;
}
const Fd = (t) => t();
function m1(t = Fd) {
  const e = Ws(!0);
  function n() {
    e.value = !1;
  }
  function r() {
    e.value = !0;
  }
  const i = (...s) => {
    e.value && t(...s);
  };
  return { isActive: Vl(e), pause: n, resume: r, eventFilter: i };
}
function g1(t, e, n = {}) {
  const {
    eventFilter: r = Fd,
    ...i
  } = n;
  return yr(
    t,
    h1(
      r,
      e
    ),
    i
  );
}
function y1(t, e, n = {}) {
  const {
    eventFilter: r,
    ...i
  } = n, { eventFilter: s, pause: o, resume: l, isActive: a } = m1(r);
  return { stop: g1(
    t,
    e,
    {
      ...i,
      eventFilter: s
    }
  ), pause: o, resume: l, isActive: a };
}
function b1(t) {
  var e;
  const n = ra(t);
  return (e = n?.$el) != null ? e : n;
}
const Xo = u1 ? window : void 0;
function wc(...t) {
  let e, n, r, i;
  if (typeof t[0] == "string" || Array.isArray(t[0]) ? ([n, r, i] = t, e = Xo) : [e, n, r, i] = t, !e)
    return p1;
  Array.isArray(n) || (n = [n]), Array.isArray(r) || (r = [r]);
  const s = [], o = () => {
    s.forEach((d) => d()), s.length = 0;
  }, l = (d, f, h, g) => (d.addEventListener(f, h, g), () => d.removeEventListener(f, h, g)), a = yr(
    () => [b1(e), ra(i)],
    ([d, f]) => {
      if (o(), !d)
        return;
      const h = f1(f) ? { ...f } : f;
      s.push(
        ...n.flatMap((g) => r.map((y) => l(d, g, y, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    a(), o();
  };
  return c1(c), c;
}
const Ei = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Mi = "__vueuse_ssr_handlers__", v1 = /* @__PURE__ */ w1();
function w1() {
  return Mi in Ei || (Ei[Mi] = Ei[Mi] || {}), Ei[Mi];
}
function _1(t, e) {
  return v1[t] || e;
}
function k1(t) {
  return t == null ? "any" : t instanceof Set ? "set" : t instanceof Map ? "map" : t instanceof Date ? "date" : typeof t == "boolean" ? "boolean" : typeof t == "string" ? "string" : typeof t == "object" ? "object" : Number.isNaN(t) ? "any" : "number";
}
const x1 = {
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
}, _c = "vueuse-storage";
function S1(t, e, n, r = {}) {
  var i;
  const {
    flush: s = "pre",
    deep: o = !0,
    listenToStorageChanges: l = !0,
    writeDefaults: a = !0,
    mergeDefaults: c = !1,
    shallow: d,
    window: f = Xo,
    eventFilter: h,
    onError: g = (w) => {
      console.error(w);
    }
  } = r, y = (d ? Eh : Ws)(e);
  if (!n)
    try {
      n = _1("getDefaultStorage", () => {
        var w;
        return (w = Xo) == null ? void 0 : w.localStorage;
      })();
    } catch (w) {
      g(w);
    }
  if (!n)
    return y;
  const v = ra(e), k = k1(v), E = (i = r.serializer) != null ? i : x1[k], { pause: T, resume: j } = y1(
    y,
    () => u(y.value),
    { flush: s, deep: o, eventFilter: h }
  );
  return f && l && (wc(f, "storage", b), wc(f, _c, p)), b(), y;
  function u(w) {
    try {
      if (w == null)
        n.removeItem(t);
      else {
        const S = E.write(w), x = n.getItem(t);
        x !== S && (n.setItem(t, S), f && f.dispatchEvent(new CustomEvent(_c, {
          detail: {
            key: t,
            oldValue: x,
            newValue: S,
            storageArea: n
          }
        })));
      }
    } catch (S) {
      g(S);
    }
  }
  function m(w) {
    const S = w ? w.newValue : n.getItem(t);
    if (S == null)
      return a && v !== null && n.setItem(t, E.write(v)), v;
    if (!w && c) {
      const x = E.read(S);
      return typeof c == "function" ? c(x, v) : k === "object" && !Array.isArray(x) ? { ...v, ...x } : x;
    } else
      return typeof S != "string" ? S : E.read(S);
  }
  function p(w) {
    b(w.detail);
  }
  function b(w) {
    if (!(w && w.storageArea !== n)) {
      if (w && w.key == null) {
        y.value = v;
        return;
      }
      if (!(w && w.key !== t)) {
        T();
        try {
          w?.newValue !== E.write(y.value) && (y.value = m(w));
        } catch (S) {
          g(S);
        } finally {
          w ? yd(j) : j();
        }
      }
    }
  }
}
function Qo(t) {
  this.message = t;
}
Qo.prototype = new Error(), Qo.prototype.name = "InvalidCharacterError";
var kc = typeof window < "u" && window.atob && window.atob.bind(window) || function(t) {
  var e = String(t).replace(/=+$/, "");
  if (e.length % 4 == 1)
    throw new Qo("'atob' failed: The string to be decoded is not correctly encoded.");
  for (var n, r, i = 0, s = 0, o = ""; r = e.charAt(s++); ~r && (n = i % 4 ? 64 * n + r : r, i++ % 4) ? o += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0)
    r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(r);
  return o;
};
function C1(t) {
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
      return decodeURIComponent(kc(n).replace(/(.)/g, function(r, i) {
        var s = i.charCodeAt(0).toString(16).toUpperCase();
        return s.length < 2 && (s = "0" + s), "%" + s;
      }));
    }(e);
  } catch {
    return kc(e);
  }
}
function as(t) {
  this.message = t;
}
function E1(t, e) {
  if (typeof t != "string")
    throw new as("Invalid token specified");
  var n = (e = e || {}).header === !0 ? 0 : 1;
  try {
    return JSON.parse(C1(t.split(".")[n]));
  } catch (r) {
    throw new as("Invalid token specified: " + r.message);
  }
}
as.prototype = new Error(), as.prototype.name = "InvalidTokenError";
var ia = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function sa(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Wd = { exports: {} };
(function(t, e) {
  (function(n, r) {
    t.exports = r();
  })(ia, function() {
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
          var l = new KeyboardEvent("keydown", o);
          document.dispatchEvent(l);
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
        var s = r.scannerDetectionData, o = s.options, l = s.options.singleScanQty, a = s.vars.firstCharTime, c = s.vars.lastCharTime, d = {}, f;
        switch (!0) {
          case i.length < o.minLength:
            d = {
              message: "Receieved code is shorter then minimal length"
            };
            break;
          case c - a > i.length * o.avgTimeByChar:
            d = {
              message: "Receieved code was not entered in time"
            };
            break;
          default:
            return o.onScan.call(r, i, l), f = new CustomEvent(
              "scan",
              {
                detail: {
                  scanCode: i,
                  qty: l
                }
              }
            ), r.dispatchEvent(f), n._reinitialize(r), !0;
        }
        return d.scanCode = i, d.scanDuration = c - a, d.avgTimeByChar = o.avgTimeByChar, d.minLength = o.minLength, o.onScanError.call(r, d), f = new CustomEvent(
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
        var i = n._getNormalizedKeyNum(r), s = this.scannerDetectionData.options, o = this.scannerDetectionData.vars, l = !1;
        if (s.onKeyDetect.call(this, i, r) !== !1 && !n._isFocusOnIgnoredElement(this)) {
          if (s.scanButtonKeyCode !== !1 && i == s.scanButtonKeyCode) {
            o.longPressed || (o.longPressTimer = setTimeout(s.onScanButtonLongPress, s.scanButtonLongPressTime, this), o.longPressed = !0);
            return;
          }
          switch (!0) {
            case (o.firstCharTime && s.suffixKeyCodes.indexOf(i) !== -1):
              r.preventDefault(), r.stopImmediatePropagation(), l = !0;
              break;
            case (!o.firstCharTime && s.prefixKeyCodes.indexOf(i) !== -1):
              r.preventDefault(), r.stopImmediatePropagation(), l = !1;
              break;
            default:
              var a = s.keyCodeMapper.call(this, r);
              if (a === null)
                return;
              o.accumulatedString += a, s.preventDefault && r.preventDefault(), s.stopPropagation && r.stopImmediatePropagation(), l = !1;
              break;
          }
          o.firstCharTime || (o.firstCharTime = Date.now()), o.lastCharTime = Date.now(), o.testTimer && clearTimeout(o.testTimer), l ? (n._validateScanCode(this, o.accumulatedString), o.testTimer = !1) : o.testTimer = setTimeout(n._validateScanCode, s.timeBeforeScanTest, this, o.accumulatedString), s.onKeyProcess.call(this, a, r);
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
})(Wd);
var M1 = Wd.exports;
const A1 = /* @__PURE__ */ sa(M1);
function fo(t, e) {
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
const xt = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, i] of e)
    n[r] = i;
  return n;
};
var Vd = { exports: {} };
(function(t, e) {
  (function(r, i) {
    t.exports = i();
  })(typeof self < "u" ? self : ia, function() {
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
        return i.m = n, i.c = r, i.d = function(s, o, l) {
          i.o(s, o) || Object.defineProperty(s, o, {
            /******/
            configurable: !1,
            /******/
            enumerable: !0,
            /******/
            get: l
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
              var l = function() {
                function a() {
                }
                a.prototype = /* @__PURE__ */ Object.create(null);
                function c(E, T) {
                  for (var j = T.length, u = 0; u < j; ++u)
                    v(E, T[u]);
                }
                var d = {}.hasOwnProperty;
                function f(E, T) {
                  E[T] = !0;
                }
                function h(E, T) {
                  for (var j in T)
                    d.call(T, j) && (E[j] = !!T[j]);
                }
                var g = /\s+/;
                function y(E, T) {
                  for (var j = T.split(g), u = j.length, m = 0; m < u; ++m)
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
                  var u = new a();
                  c(u, T);
                  var m = [];
                  for (var p in u)
                    u[p] && m.push(p);
                  return m.join(" ");
                }
                return k;
              }();
              typeof n < "u" && n.exports ? n.exports = l : (s = [], o = function() {
                return l;
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
            ), l = i(
              /*! ../internals/call-with-safe-iteration-closing */
              "./node_modules/core-js/internals/call-with-safe-iteration-closing.js"
            ), a = i(
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
              var y = o(g), v = typeof this == "function" ? this : Array, k = arguments.length, E = k > 1 ? arguments[1] : void 0, T = E !== void 0, j = 0, u = f(y), m, p, b, w;
              if (T && (E = s(E, k > 2 ? arguments[2] : void 0, 2)), u != null && !(v == Array && a(u)))
                for (w = u.call(y), p = new v(); !(b = w.next()).done; j++)
                  d(
                    p,
                    j,
                    T ? l(w, E, [b.value, j], !0) : b.value
                  );
              else
                for (m = c(y.length), p = new v(m); m > j; j++)
                  d(p, j, T ? E(y[j], j) : y[j]);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-indexed-object */
              "./node_modules/core-js/internals/to-indexed-object.js"
            ), o = i(
              /*! ../internals/to-length */
              "./node_modules/core-js/internals/to-length.js"
            ), l = i(
              /*! ../internals/to-absolute-index */
              "./node_modules/core-js/internals/to-absolute-index.js"
            );
            n.exports = function(a) {
              return function(c, d, f) {
                var h = s(c), g = o(h.length), y = l(f, g), v;
                if (a && d != d) {
                  for (; g > y; )
                    if (v = h[y++], v != v)
                      return !0;
                } else
                  for (; g > y; y++)
                    if ((a || y in h) && h[y] === d)
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/a-function */
              "./node_modules/core-js/internals/a-function.js"
            );
            n.exports = function(o, l, a) {
              if (s(o), l === void 0)
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
                  return function(c, d) {
                    return o.call(l, c, d);
                  };
                case 3:
                  return function(c, d, f) {
                    return o.call(l, c, d, f);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            );
            n.exports = function(o, l, a, c) {
              try {
                return c ? l(s(a)[0], a[1]) : l(a);
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
            ), o = s("iterator"), l = !1;
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
            n.exports = function(d, f) {
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
                }, d(g);
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
            ), l = o("toStringTag"), a = s(function() {
              return arguments;
            }()) == "Arguments", c = function(d, f) {
              try {
                return d[f];
              } catch {
              }
            };
            n.exports = function(d) {
              var f, h, g;
              return d === void 0 ? "Undefined" : d === null ? "Null" : typeof (h = c(f = Object(d), l)) == "string" ? h : a ? s(f) : (g = s(f)) == "Object" && typeof f.callee == "function" ? "Arguments" : g;
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
            ), l = i(
              /*! ../internals/object-get-own-property-descriptor */
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
            ), a = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            );
            n.exports = function(c, d) {
              for (var f = o(d), h = a.f, g = l.f, y = 0; y < f.length; y++) {
                var v = f[y];
                s(c, v) || h(c, v, g(d, v));
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
            ), l = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            ), a = i(
              /*! ../internals/set-to-string-tag */
              "./node_modules/core-js/internals/set-to-string-tag.js"
            ), c = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), d = function() {
              return this;
            };
            n.exports = function(f, h, g) {
              var y = h + " Iterator";
              return f.prototype = o(s, { next: l(1, g) }), a(f, y, !1, !0), c[y] = d, f;
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
            ), l = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            );
            n.exports = function(a, c, d) {
              var f = s(c);
              f in a ? o.f(a, f, l(0, d)) : a[f] = d;
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
            ), l = i(
              /*! ../internals/object-get-prototype-of */
              "./node_modules/core-js/internals/object-get-prototype-of.js"
            ), a = i(
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
            ), h = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), g = i(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), y = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), v = i(
              /*! ../internals/iterators-core */
              "./node_modules/core-js/internals/iterators-core.js"
            ), k = v.IteratorPrototype, E = v.BUGGY_SAFARI_ITERATORS, T = h("iterator"), j = "keys", u = "values", m = "entries", p = function() {
              return this;
            };
            n.exports = function(b, w, S, x, A, B, L) {
              o(S, w, x);
              var R = function(Ee) {
                if (Ee === A && W)
                  return W;
                if (!E && Ee in O)
                  return O[Ee];
                switch (Ee) {
                  case j:
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
              }, N = w + " Iterator", _ = !1, O = b.prototype, I = O[T] || O["@@iterator"] || A && O[A], W = !E && I || R(A), te = w == "Array" && O.entries || I, U, le, ge;
              if (te && (U = l(te.call(new b())), k !== Object.prototype && U.next && (!g && l(U) !== k && (a ? a(U, k) : typeof U[T] != "function" && d(U, T, p)), c(U, N, !0, !0), g && (y[N] = p))), A == u && I && I.name !== u && (_ = !0, W = function() {
                return I.call(this);
              }), (!g || L) && O[T] !== W && d(O, T, W), y[w] = W, A)
                if (le = {
                  values: R(u),
                  keys: B ? W : R(j),
                  entries: R(m)
                }, L)
                  for (ge in le)
                    (E || _ || !(ge in O)) && f(O, ge, le[ge]);
                else
                  s({ target: w, proto: !0, forced: E || _ }, le);
              return le;
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
            ), l = s.document, a = o(l) && o(l.createElement);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/object-get-own-property-descriptor */
              "./node_modules/core-js/internals/object-get-own-property-descriptor.js"
            ).f, l = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), a = i(
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
            n.exports = function(h, g) {
              var y = h.target, v = h.global, k = h.stat, E, T, j, u, m, p;
              if (v ? T = s : k ? T = s[y] || c(y, {}) : T = (s[y] || {}).prototype, T)
                for (j in g) {
                  if (m = g[j], h.noTargetGet ? (p = o(T, j), u = p && p.value) : u = T[j], E = f(v ? j : y + (k ? "." : "#") + j, h.forced), !E && u !== void 0) {
                    if (typeof m == typeof u)
                      continue;
                    d(m, u);
                  }
                  (h.sham || u && u.sham) && l(m, "sham", !0), a(T, j, m, h);
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
            ), l = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), a = l("iterator");
            n.exports = function(c) {
              if (c != null)
                return c[a] || c["@@iterator"] || o[s(c)];
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
              var o = "object", l = function(a) {
                return a && a.Math == Math && a;
              };
              n.exports = // eslint-disable-next-line no-undef
              l(typeof globalThis == o && globalThis) || l(typeof window == o && window) || l(typeof self == o && self) || l(typeof s == o && s) || // eslint-disable-next-line no-new-func
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
            ), l = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            );
            n.exports = s ? function(a, c, d) {
              return o.f(a, c, l(1, d));
            } : function(a, c, d) {
              return a[c] = d, a;
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
            ), l = i(
              /*! ../internals/document-create-element */
              "./node_modules/core-js/internals/document-create-element.js"
            );
            n.exports = !s && !o(function() {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), o = i(
              /*! ../internals/classof-raw */
              "./node_modules/core-js/internals/classof-raw.js"
            ), l = "".split;
            n.exports = s(function() {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/native-weak-map */
              "./node_modules/core-js/internals/native-weak-map.js"
            ), o = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), l = i(
              /*! ../internals/is-object */
              "./node_modules/core-js/internals/is-object.js"
            ), a = i(
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
            ), h = o.WeakMap, g, y, v, k = function(b) {
              return v(b) ? y(b) : g(b, {});
            }, E = function(b) {
              return function(w) {
                var S;
                if (!l(w) || (S = y(w)).type !== b)
                  throw TypeError("Incompatible receiver, " + b + " required");
                return S;
              };
            };
            if (s) {
              var T = new h(), j = T.get, u = T.has, m = T.set;
              g = function(b, w) {
                return m.call(T, b, w), w;
              }, y = function(b) {
                return j.call(T, b) || {};
              }, v = function(b) {
                return u.call(T, b);
              };
            } else {
              var p = d("state");
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), o = i(
              /*! ../internals/iterators */
              "./node_modules/core-js/internals/iterators.js"
            ), l = s("iterator"), a = Array.prototype;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/fails */
              "./node_modules/core-js/internals/fails.js"
            ), o = /#|\.prototype\./, l = function(h, g) {
              var y = c[a(h)];
              return y == f ? !0 : y == d ? !1 : typeof g == "function" ? s(g) : !!g;
            }, a = l.normalize = function(h) {
              return String(h).replace(o, ".").toLowerCase();
            }, c = l.data = {}, d = l.NATIVE = "N", f = l.POLYFILL = "P";
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
            ), l = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), a = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), c = i(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), d = a("iterator"), f = !1, h = function() {
              return this;
            }, g, y, v;
            [].keys && (v = [].keys(), "next" in v ? (y = s(s(v)), y !== Object.prototype && (g = y)) : f = !0), g == null && (g = {}), !c && !l(g, d) && o(g, d, h), n.exports = {
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
            ), l = s.WeakMap;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), o = i(
              /*! ../internals/object-define-properties */
              "./node_modules/core-js/internals/object-define-properties.js"
            ), l = i(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            ), a = i(
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
            ), h = f("IE_PROTO"), g = "prototype", y = function() {
            }, v = function() {
              var k = d("iframe"), E = l.length, T = "<", j = "script", u = ">", m = "java" + j + ":", p;
              for (k.style.display = "none", c.appendChild(k), k.src = String(m), p = k.contentWindow.document, p.open(), p.write(T + j + u + "document.F=Object" + T + "/" + j + u), p.close(), v = p.F; E--; )
                delete v[g][l[E]];
              return v();
            };
            n.exports = Object.create || function(E, T) {
              var j;
              return E !== null ? (y[g] = s(E), j = new y(), y[g] = null, j[h] = E) : j = v(), T === void 0 ? j : o(j, T);
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ), l = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), a = i(
              /*! ../internals/object-keys */
              "./node_modules/core-js/internals/object-keys.js"
            );
            n.exports = s ? Object.defineProperties : function(d, f) {
              l(d);
              for (var h = a(f), g = h.length, y = 0, v; g > y; )
                o.f(d, v = h[y++], f[v]);
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
            ), l = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), a = i(
              /*! ../internals/to-primitive */
              "./node_modules/core-js/internals/to-primitive.js"
            ), c = Object.defineProperty;
            r.f = s ? c : function(f, h, g) {
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/descriptors */
              "./node_modules/core-js/internals/descriptors.js"
            ), o = i(
              /*! ../internals/object-property-is-enumerable */
              "./node_modules/core-js/internals/object-property-is-enumerable.js"
            ), l = i(
              /*! ../internals/create-property-descriptor */
              "./node_modules/core-js/internals/create-property-descriptor.js"
            ), a = i(
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
            ), h = Object.getOwnPropertyDescriptor;
            r.f = s ? h : function(y, v) {
              if (y = a(y), v = c(v, !0), f)
                try {
                  return h(y, v);
                } catch {
                }
              if (d(y, v))
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/object-keys-internal */
              "./node_modules/core-js/internals/object-keys-internal.js"
            ), o = i(
              /*! ../internals/enum-bug-keys */
              "./node_modules/core-js/internals/enum-bug-keys.js"
            ), l = o.concat("length", "prototype");
            r.f = Object.getOwnPropertyNames || function(c) {
              return s(c, l);
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
            ), l = i(
              /*! ../internals/shared-key */
              "./node_modules/core-js/internals/shared-key.js"
            ), a = i(
              /*! ../internals/correct-prototype-getter */
              "./node_modules/core-js/internals/correct-prototype-getter.js"
            ), c = l("IE_PROTO"), d = Object.prototype;
            n.exports = a ? Object.getPrototypeOf : function(f) {
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
            ), l = i(
              /*! ../internals/array-includes */
              "./node_modules/core-js/internals/array-includes.js"
            ), a = i(
              /*! ../internals/hidden-keys */
              "./node_modules/core-js/internals/hidden-keys.js"
            ), c = l(!1);
            n.exports = function(d, f) {
              var h = o(d), g = 0, y = [], v;
              for (v in h)
                !s(a, v) && s(h, v) && y.push(v);
              for (; f.length > g; )
                s(h, v = f[g++]) && (~c(y, v) || y.push(v));
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
            n.exports = Object.keys || function(a) {
              return s(a, o);
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
            var s = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, l = o && !s.call({ 1: 2 }, 1);
            r.f = l ? function(c) {
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
              var o = !1, l = {}, a;
              try {
                a = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, a.call(l, []), o = l instanceof Array;
              } catch {
              }
              return function(d, f) {
                return s(d, f), o ? a.call(d, f) : d.__proto__ = f, d;
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
            ), l = i(
              /*! ../internals/object-get-own-property-symbols */
              "./node_modules/core-js/internals/object-get-own-property-symbols.js"
            ), a = i(
              /*! ../internals/an-object */
              "./node_modules/core-js/internals/an-object.js"
            ), c = s.Reflect;
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
            ), l = i(
              /*! ../internals/hide */
              "./node_modules/core-js/internals/hide.js"
            ), a = i(
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
            ), h = f.get, g = f.enforce, y = String(d).split("toString");
            o("inspectSource", function(v) {
              return d.call(v);
            }), (n.exports = function(v, k, E, T) {
              var j = T ? !!T.unsafe : !1, u = T ? !!T.enumerable : !1, m = T ? !!T.noTargetGet : !1;
              if (typeof E == "function" && (typeof k == "string" && !a(E, "name") && l(E, "name", k), g(E).source = y.join(typeof k == "string" ? k : "")), v === s) {
                u ? v[k] = E : c(k, E);
                return;
              } else
                j ? !m && v[k] && (u = !0) : delete v[k];
              u ? v[k] = E : l(v, k, E);
            })(Function.prototype, "toString", function() {
              return typeof this == "function" && h(this).source || d.call(this);
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
            n.exports = function(l, a) {
              try {
                o(s, l, a);
              } catch {
                s[l] = a;
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/object-define-property */
              "./node_modules/core-js/internals/object-define-property.js"
            ).f, o = i(
              /*! ../internals/has */
              "./node_modules/core-js/internals/has.js"
            ), l = i(
              /*! ../internals/well-known-symbol */
              "./node_modules/core-js/internals/well-known-symbol.js"
            ), a = l("toStringTag");
            n.exports = function(c, d, f) {
              c && !o(c = f ? c : c.prototype, a) && s(c, a, { configurable: !0, value: d });
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
            ), l = s("keys");
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/set-global */
              "./node_modules/core-js/internals/set-global.js"
            ), l = i(
              /*! ../internals/is-pure */
              "./node_modules/core-js/internals/is-pure.js"
            ), a = "__core-js_shared__", c = s[a] || o(a, {});
            (n.exports = function(d, f) {
              return c[d] || (c[d] = f !== void 0 ? f : {});
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/to-integer */
              "./node_modules/core-js/internals/to-integer.js"
            ), o = i(
              /*! ../internals/require-object-coercible */
              "./node_modules/core-js/internals/require-object-coercible.js"
            );
            n.exports = function(l, a, c) {
              var d = String(o(l)), f = s(a), h = d.length, g, y;
              return f < 0 || f >= h ? c ? "" : void 0 : (g = d.charCodeAt(f), g < 55296 || g > 56319 || f + 1 === h || (y = d.charCodeAt(f + 1)) < 56320 || y > 57343 ? c ? d.charAt(f) : g : c ? d.slice(f, f + 2) : (g - 55296 << 10) + (y - 56320) + 65536);
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
            ), o = Math.max, l = Math.min;
            n.exports = function(a, c) {
              var d = s(a);
              return d < 0 ? o(d + c, 0) : l(d, c);
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
            n.exports = function(l) {
              return s(o(l));
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
            n.exports = function(l) {
              return l > 0 ? o(s(l), 9007199254740991) : 0;
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
            n.exports = function(o, l) {
              if (!s(o))
                return o;
              var a, c;
              if (l && typeof (a = o.toString) == "function" && !s(c = a.call(o)) || typeof (a = o.valueOf) == "function" && !s(c = a.call(o)) || !l && typeof (a = o.toString) == "function" && !s(c = a.call(o)))
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
            n.exports = function(l, a) {
              if (o(l), !s(a) && a !== null)
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
          function(n, r, i) {
            var s = i(
              /*! ../internals/global */
              "./node_modules/core-js/internals/global.js"
            ), o = i(
              /*! ../internals/shared */
              "./node_modules/core-js/internals/shared.js"
            ), l = i(
              /*! ../internals/uid */
              "./node_modules/core-js/internals/uid.js"
            ), a = i(
              /*! ../internals/native-symbol */
              "./node_modules/core-js/internals/native-symbol.js"
            ), c = s.Symbol, d = o("wks");
            n.exports = function(f) {
              return d[f] || (d[f] = a && c[f] || (a ? c : l)("Symbol." + f));
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
            ), l = i(
              /*! ../internals/check-correctness-of-iteration */
              "./node_modules/core-js/internals/check-correctness-of-iteration.js"
            ), a = !l(function(c) {
              Array.from(c);
            });
            s({ target: "Array", stat: !0, forced: a }, {
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
            ), l = i(
              /*! ../internals/define-iterator */
              "./node_modules/core-js/internals/define-iterator.js"
            ), a = "String Iterator", c = o.set, d = o.getterFor(a);
            l(String, "String", function(f) {
              c(this, {
                type: a,
                string: String(f),
                index: 0
              });
            }, function() {
              var h = d(this), g = h.string, y = h.index, v;
              return y >= g.length ? { value: void 0, done: !0 } : (v = s(g, y, !0), h.index += v.length, { value: v, done: !1 });
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
            var s = Object.assign || function(v) {
              for (var k = 1; k < arguments.length; k++) {
                var E = arguments[k];
                for (var T in E)
                  Object.prototype.hasOwnProperty.call(E, T) && (v[T] = E[T]);
              }
              return v;
            }, o = function() {
              function v(k, E) {
                for (var T = 0; T < E.length; T++) {
                  var j = E[T];
                  j.enumerable = j.enumerable || !1, j.configurable = !0, "value" in j && (j.writable = !0), Object.defineProperty(k, j.key, j);
                }
              }
              return function(k, E, T) {
                return E && v(k.prototype, E), T && v(k, T), k;
              };
            }(), l = i(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), a = f(l), c = i(
              /*! ./default-attrs.json */
              "./src/default-attrs.json"
            ), d = f(c);
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
                h(this, v), this.name = k, this.contents = E, this.tags = T, this.attrs = s({}, d.default, { class: "feather feather-" + k });
              }
              return o(v, [{
                key: "toSvg",
                value: function() {
                  var E = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, T = s({}, this.attrs, E, { class: (0, a.default)(this.attrs.class, E.class) });
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
          function(n, r, i) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var s = i(
              /*! ./icon */
              "./src/icon.js"
            ), o = f(s), l = i(
              /*! ../dist/icons.json */
              "./dist/icons.json"
            ), a = f(l), c = i(
              /*! ./tags.json */
              "./src/tags.json"
            ), d = f(c);
            function f(h) {
              return h && h.__esModule ? h : { default: h };
            }
            r.default = Object.keys(a.default).map(function(h) {
              return new o.default(h, a.default[h], d.default[h]);
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
          function(n, r, i) {
            var s = i(
              /*! ./icons */
              "./src/icons.js"
            ), o = f(s), l = i(
              /*! ./to-svg */
              "./src/to-svg.js"
            ), a = f(l), c = i(
              /*! ./replace */
              "./src/replace.js"
            ), d = f(c);
            function f(h) {
              return h && h.__esModule ? h : { default: h };
            }
            n.exports = { icons: o.default, toSvg: a.default, replace: d.default };
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
              for (var v = 1; v < arguments.length; v++) {
                var k = arguments[v];
                for (var E in k)
                  Object.prototype.hasOwnProperty.call(k, E) && (y[E] = k[E]);
              }
              return y;
            }, o = i(
              /*! classnames/dedupe */
              "./node_modules/classnames/dedupe.js"
            ), l = d(o), a = i(
              /*! ./icons */
              "./src/icons.js"
            ), c = d(a);
            function d(y) {
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
              var T = c.default[E].toSvg(s({}, v, k, { class: (0, l.default)(v.class, k.class) })), j = new DOMParser().parseFromString(T, "image/svg+xml"), u = j.querySelector("svg");
              y.parentNode.replaceChild(u, y);
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
          function(n, r, i) {
            Object.defineProperty(r, "__esModule", {
              value: !0
            });
            var s = i(
              /*! ./icons */
              "./src/icons.js"
            ), o = l(s);
            function l(c) {
              return c && c.__esModule ? c : { default: c };
            }
            function a(c) {
              var d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              if (console.warn("feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead."), !c)
                throw new Error("The required `key` (icon name) parameter is missing.");
              if (!o.default[c])
                throw new Error("No icon matching '" + c + "'. See the complete list of icons at https://feathericons.com");
              return o.default[c].toSvg(d);
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
})(Vd);
var T1 = Vd.exports;
const Zo = /* @__PURE__ */ sa(T1), xc = Object.keys(Zo.icons), po = {
  props: {
    name: {
      type: String,
      required: !0,
      validator(t) {
        const e = xc.includes(t);
        return e || (console.groupCollapsed(
          "[frappe-ui] name property for feather-icon must be one of "
        ), console.dir(xc), console.groupEnd()), e;
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
    let t = Zo.icons[this.name];
    return t || (t = Zo.icons.circle), Hd(
      "svg",
      ea(
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
}, O1 = {
  name: "LoadingIndicator"
}, j1 = {
  class: "max-w-xs animate-spin",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, P1 = /* @__PURE__ */ ve("circle", {
  class: "opacity-25",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), R1 = /* @__PURE__ */ ve("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), I1 = [
  P1,
  R1
];
function N1(t, e, n, r, i, s) {
  return fe(), Qe("svg", j1, I1);
}
const L1 = /* @__PURE__ */ xt(O1, [["render", N1]]);
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
var Sc;
(function(t) {
  t.pop = "pop", t.push = "push";
})(Sc || (Sc = {}));
var Cc;
(function(t) {
  t.back = "back", t.forward = "forward", t.unknown = "";
})(Cc || (Cc = {}));
var Ec;
(function(t) {
  t[t.aborted = 4] = "aborted", t[t.cancelled = 8] = "cancelled", t[t.duplicated = 16] = "duplicated";
})(Ec || (Ec = {}));
const z1 = Symbol("");
function D1() {
  return Jr(z1);
}
const B1 = ["disabled", "ariaLabel"], $1 = /* @__PURE__ */ Jt({
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
    const e = t, n = am(), r = D1(), i = Pn(() => {
      let d = {
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
        solid: d,
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
    }), s = Pn(() => ({
      sm: "h-4",
      md: "h-4.5",
      lg: "h-5",
      xl: "h-6",
      "2xl": "h-6"
    })[e.size]), o = Pn(() => e.disabled || e.loading), l = Pn(() => a.value ? e.label : null), a = Pn(() => e.icon || n.icon), c = () => {
      if (e.route)
        return r.push(e.route);
      if (e.link)
        return window.open(e.link, "_blank");
    };
    return (d, f) => (fe(), Qe("button", ea(d.$attrs, {
      class: i.value,
      onClick: c,
      disabled: o.value,
      ariaLabel: l.value
    }), [
      d.loading ? (fe(), it(L1, {
        key: 0,
        class: Ft({
          "h-3 w-3": d.size == "sm",
          "h-[13.5px] w-[13.5px]": d.size == "md",
          "h-[15px] w-[15px]": d.size == "lg",
          "h-4.5 w-4.5": d.size == "xl" || d.size == "2xl"
        })
      }, null, 8, ["class"])) : d.$slots.prefix || d.iconLeft ? ar(d.$slots, "prefix", { key: 1 }, () => [
        d.iconLeft ? (fe(), it(po, {
          key: 0,
          name: d.iconLeft,
          class: Ft(s.value),
          "aria-hidden": "true"
        }, null, 8, ["name", "class"])) : fn("", !0)
      ]) : fn("", !0),
      d.loading && d.loadingText ? (fe(), Qe(Ge, { key: 2 }, [
        ai(_t(d.loadingText), 1)
      ], 64)) : a.value && !d.loading ? (fe(), Qe(Ge, { key: 3 }, [
        d.icon ? (fe(), it(po, {
          key: 0,
          name: d.icon,
          class: Ft(s.value),
          "aria-label": d.label
        }, null, 8, ["name", "class", "aria-label"])) : d.$slots.icon ? ar(d.$slots, "icon", { key: 1 }) : fn("", !0)
      ], 64)) : (fe(), Qe("span", {
        key: 4,
        class: Ft({ "sr-only": a.value })
      }, [
        ar(d.$slots, "default", {}, () => [
          ai(_t(d.label), 1)
        ])
      ], 2)),
      ar(d.$slots, "suffix", {}, () => [
        d.iconRight ? (fe(), it(po, {
          key: 0,
          name: d.iconRight,
          class: Ft(s.value),
          "aria-hidden": "true"
        }, null, 8, ["name", "class"])) : fn("", !0)
      ])
    ], 16, B1));
  }
});
const H1 = {}, Kd = (t) => (zh("data-v-48d21730"), t = t(), Dh(), t), F1 = {
  class: "spinner",
  viewBox: "0 0 50 50"
}, W1 = /* @__PURE__ */ Kd(() => /* @__PURE__ */ ve("defs", null, [
  /* @__PURE__ */ ve("linearGradient", {
    id: "gradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, [
    /* @__PURE__ */ ve("stop", {
      offset: "0%",
      "stop-color": "rgba(0,110,219,1)"
    }),
    /* @__PURE__ */ ve("stop", {
      offset: "100%",
      "stop-color": "rgba(255,255,255,0)"
    })
  ])
], -1)), V1 = /* @__PURE__ */ Kd(() => /* @__PURE__ */ ve("circle", {
  stroke: "url(#gradient)",
  class: "spinner-path",
  cx: "25",
  cy: "25",
  r: "20",
  fill: "none",
  "stroke-width": "5"
}, null, -1)), K1 = [
  W1,
  V1
];
function U1(t, e) {
  return fe(), Qe("svg", F1, K1);
}
const q1 = /* @__PURE__ */ xt(H1, [["render", U1], ["__scopeId", "data-v-48d21730"]]);
function Ud(t, e, n) {
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
      let o = Ud(i.content, s.content, n + 1);
      if (o != null)
        return o;
    }
    n += i.nodeSize;
  }
}
function qd(t, e, n, r) {
  for (let i = t.childCount, s = e.childCount; ; ) {
    if (i == 0 || s == 0)
      return i == s ? null : { a: n, b: r };
    let o = t.child(--i), l = e.child(--s), a = o.nodeSize;
    if (o == l) {
      n -= a, r -= a;
      continue;
    }
    if (!o.sameMarkup(l))
      return { a: n, b: r };
    if (o.isText && o.text != l.text) {
      let c = 0, d = Math.min(o.text.length, l.text.length);
      for (; c < d && o.text[o.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, n--, r--;
      return { a: n, b: r };
    }
    if (o.content.size || l.content.size) {
      let c = qd(o.content, l.content, n - 1, r - 1);
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
  nodesBetween(e, n, r, i = 0, s) {
    for (let o = 0, l = 0; l < n; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, i + l, s || null, o) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, n - d), r, i + d);
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
  textBetween(e, n, r, i) {
    let s = "", o = !0;
    return this.nodesBetween(e, n, (l, a) => {
      l.isText ? (s += l.text.slice(Math.max(e, a) - a, n - a), o = !r) : l.isLeaf ? (i ? s += typeof i == "function" ? i(l) : i : l.type.spec.leafText && (s += l.type.spec.leafText(l)), o = !r) : !o && l.isBlock && (s += r, o = !0);
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
        let l = this.content[s], a = o + l.nodeSize;
        a > e && ((o < e || a > n) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, n - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, n - o - 1))), r.push(l), i += l.nodeSize), o = a;
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
    return Ud(this, e, n);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, n = this.size, r = e.size) {
    return qd(this, e, n, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, n = -1) {
    if (e == 0)
      return Ai(0, e);
    if (e == this.size)
      return Ai(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, i = 0; ; r++) {
      let s = this.child(r), o = i + s.nodeSize;
      if (o >= e)
        return o == e || n > 0 ? Ai(r + 1, o) : Ai(r, i);
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
const ho = { index: 0, offset: 0 };
function Ai(t, e) {
  return ho.index = t, ho.offset = e, ho;
}
function el(t, e) {
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
      if (!el(t[r], e[r]))
        return !1;
  } else {
    for (let r in t)
      if (!(r in e) || !el(t[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in t))
        return !1;
  }
  return !0;
}
let ht = class tl {
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
    return this == e || this.type == e.type && el(this.attrs, e.attrs);
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
      return tl.none;
    if (e instanceof tl)
      return [e];
    let n = e.slice();
    return n.sort((r, i) => r.type.rank - i.type.rank), n;
  }
};
ht.none = [];
class G1 extends Error {
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
    let r = Jd(this.content, e + this.openStart, n);
    return r && new G(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, n) {
    return new G(Gd(this.content, e + this.openStart, n + this.openStart), this.openStart, this.openEnd);
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
function Gd(t, e, n) {
  let { index: r, offset: i } = t.findIndex(e), s = t.maybeChild(r), { index: o, offset: l } = t.findIndex(n);
  if (i == e || s.isText) {
    if (l != n && !t.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return t.cut(0, e).append(t.cut(n));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return t.replaceChild(r, s.copy(Gd(s.content, e - i - 1, n - i - 1)));
}
function Jd(t, e, n, r) {
  let { index: i, offset: s } = t.findIndex(e), o = t.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, n) ? null : t.cut(0, e).append(n).append(t.cut(e));
  let l = Jd(o.content, e - s - 1, n);
  return l && t.replaceChild(i, o.copy(l));
}
class nl {
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
function J1(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t) {
    let r = t[n];
    if (!r.hasDefault)
      return null;
    e[n] = r.default;
  }
  return e;
}
function Y1(t, e) {
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
function X1(t) {
  let e = /* @__PURE__ */ Object.create(null);
  if (t)
    for (let n in t)
      e[n] = new Q1(t[n]);
  return e;
}
class Q1 {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class oa {
  /**
  @internal
  */
  constructor(e, n, r, i) {
    this.name = e, this.rank = n, this.schema = r, this.spec = i, this.attrs = X1(i.attrs), this.excluded = null;
    let s = J1(this.attrs);
    this.instance = s ? new ht(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new ht(this, Y1(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, n) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new oa(s, i++, n, o)), r;
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
let Yd = class rl {
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
    let r = new Ac(this, n, !1);
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
    let r = new Ac(this, n, !0);
    return r.addAll(e, n.from, n.to), G.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, n, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (tg(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || n.matchesContext(s.context))) {
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
      let o = this.styles[s], l = o.style;
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
    function r(i) {
      let s = i.priority == null ? 50 : i.priority, o = 0;
      for (; o < n.length; o++) {
        let l = n[o];
        if ((l.priority == null ? 50 : l.priority) < s)
          break;
      }
      n.splice(o, 0, i);
    }
    for (let i in e.marks) {
      let s = e.marks[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = Tc(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = Tc(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new rl(e, rl.schemaRules(e)));
  }
};
const Xd = {
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
}, Z1 = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Qd = { ol: !0, ul: !0 }, cs = 1, us = 2, Xr = 4;
function Mc(t, e, n) {
  return e != null ? (e ? cs : 0) | (e === "full" ? us : 0) : t && t.whitespace == "pre" ? cs | us : n & ~Xr;
}
class Ti {
  constructor(e, n, r, i, s, o, l) {
    this.type = e, this.attrs = n, this.marks = r, this.pendingMarks = i, this.solid = s, this.options = l, this.content = [], this.activeMarks = ht.none, this.stashMarks = [], this.match = o || (l & Xr ? null : e.contentMatch);
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
    if (!(this.options & cs)) {
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
      (this.type ? this.type.allowsMarkType(i.type) : rg(i.type, e)) && !i.isInSet(this.activeMarks) && (this.activeMarks = i.addToSet(this.activeMarks), this.pendingMarks = i.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Xd.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Ac {
  constructor(e, n, r) {
    this.parser = e, this.options = n, this.isOpen = r, this.open = 0;
    let i = n.topNode, s, o = Mc(null, n.preserveWhitespace, 0) | (r ? Xr : 0);
    i ? s = new Ti(i.type, i.attrs, ht.none, ht.none, !0, n.topMatch || i.type.contentMatch, o) : r ? s = new Ti(null, null, ht.none, ht.none, !0, null, o) : s = new Ti(e.schema.topNodeType, null, ht.none, ht.none, !0, null, o), this.nodes = [s], this.find = n.findPositions, this.needsBlock = !1;
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
    let i = this.readStyles(ng(r));
    if (!i)
      return;
    let [s, o] = i, l = this.top;
    for (let a = 0; a < o.length; a++)
      this.removePendingMark(o[a], l);
    for (let a = 0; a < s.length; a++)
      this.addPendingMark(s[a]);
    n();
    for (let a = 0; a < s.length; a++)
      this.removePendingMark(s[a], l);
    for (let a = 0; a < o.length; a++)
      this.addPendingMark(o[a]);
  }
  addTextNode(e) {
    let n = e.nodeValue, r = this.top;
    if (r.options & us || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (r.options & cs)
        r.options & us ? n = n.replace(/\r\n?/g, `
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
    Qd.hasOwnProperty(r) && this.parser.normalizeLists && eg(e);
    let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (i = this.parser.matchTag(e, this, n));
    if (s ? s.ignore : Z1.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!s || s.skip || s.closeParent) {
      s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
      let o, l = this.top, a = this.needsBlock;
      if (Xd.hasOwnProperty(r))
        l.content.length && l.content[0].isInline && this.open && (this.open--, l = this.top), o = !0, l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      s && s.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), o && this.sync(l), this.needsBlock = a;
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
    let n = ht.none, r = ht.none;
    for (let i = 0; i < e.length; i += 2)
      for (let s = void 0; ; ) {
        let o = this.parser.matchStyle(e[i], e[i + 1], this, s);
        if (!o)
          break;
        if (o.ignore)
          return null;
        if (o.clearMark ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
          o.clearMark(l) && (r = l.addToSet(r));
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
    let l = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (n.getContent)
      this.findInside(e), n.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof n.contentElement == "string" ? a = e.querySelector(n.contentElement) : typeof n.contentElement == "function" ? a = n.contentElement(e) : n.contentElement && (a = n.contentElement), this.findAround(e, a, !0), this.addAll(a);
    }
    i && this.sync(l) && this.open--, o && this.removePendingMark(o, l);
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
    let o = Mc(e, i, s.options);
    s.options & Xr && s.content.length == 0 && (o |= Xr), this.nodes.push(new Ti(e, n, s.activeMarks, s.pendingMarks, r, null, o)), this.open++;
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
    let n = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = n[l];
        if (c == "") {
          if (l == n.length - 1 || l == 0)
            continue;
          for (; a >= s; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let d = a > 0 || a == 0 && i ? this.nodes[a].type : r && a >= s ? r.node(a - s).type : null;
          if (!d || d.name != c && d.groups.indexOf(c) == -1)
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
    let n = ig(e, this.top.pendingMarks);
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
function eg(t) {
  for (let e = t.firstChild, n = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Qd.hasOwnProperty(r) && n ? (n.appendChild(e), e = n) : r == "li" ? n = e : r && (n = null);
  }
}
function tg(t, e) {
  return (t.matches || t.msMatchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector).call(t, e);
}
function ng(t) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, n, r = [];
  for (; n = e.exec(t); )
    r.push(n[1], n[2].trim());
  return r;
}
function Tc(t) {
  let e = {};
  for (let n in t)
    e[n] = t[n];
  return e;
}
function rg(t, e) {
  let n = e.schema.nodes;
  for (let r in n) {
    let i = n[r];
    if (!i.allowsMarkType(t))
      continue;
    let s = [], o = (l) => {
      s.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: d } = l.edge(a);
        if (c == e || s.indexOf(d) < 0 && o(d))
          return !0;
      }
    };
    if (o(i.contentMatch))
      return !0;
  }
}
function ig(t, e) {
  for (let n = 0; n < e.length; n++)
    if (t.eq(e[n]))
      return e[n];
}
class Bn {
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
    r || (r = mo(n).createDocumentFragment());
    let i = r, s = [];
    return e.forEach((o) => {
      if (s.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < s.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(s[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < s.length; )
          i = s.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], d = this.serializeMark(c, o.isInline, n);
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
    let { dom: r, contentDOM: i } = Bn.renderSpec(mo(n), this.nodes[e.type.name](e));
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
    return i && Bn.renderSpec(mo(r), i(e, n));
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
    let o, l = r ? e.createElementNS(r, i) : e.createElement(i), a = n[1], c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let d in a)
        if (a[d] != null) {
          let f = d.indexOf(" ");
          f > 0 ? l.setAttributeNS(d.slice(0, f), d.slice(f + 1), a[d]) : l.setAttribute(d, a[d]);
        }
    }
    for (let d = c; d < n.length; d++) {
      let f = n[d];
      if (f === 0) {
        if (d < n.length - 1 || d > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: h, contentDOM: g } = Bn.renderSpec(e, f, r);
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
    return e.cached.domSerializer || (e.cached.domSerializer = new Bn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let n = Oc(e.nodes);
    return n.text || (n.text = (r) => r.text), n;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Oc(e.marks);
  }
}
function Oc(t) {
  let e = {};
  for (let n in t) {
    let r = t[n].spec.toDOM;
    r && (e[n] = r);
  }
  return e;
}
function mo(t) {
  return t.document || window.document;
}
const Zd = 65535, ef = Math.pow(2, 16);
function sg(t, e) {
  return t + e * ef;
}
function jc(t) {
  return t & Zd;
}
function og(t) {
  return (t - (t & Zd)) / ef;
}
const tf = 1, nf = 2, Ki = 4, rf = 8;
class il {
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
    return (this.delInfo & rf) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (tf | Ki)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (nf | Ki)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Ki) > 0;
  }
}
class vt {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, n = !1) {
    if (this.ranges = e, this.inverted = n, !e.length && vt.empty)
      return vt.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let n = 0, r = jc(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        n += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + n + og(e);
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
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], d = this.ranges[l + o], f = a + c;
      if (e <= f) {
        let h = c ? e == a ? -1 : e == f ? 1 : n : n, g = a + i + (h < 0 ? 0 : d);
        if (r)
          return g;
        let y = e == (n < 0 ? a : f) ? null : sg(l / 3, e - a), v = e == a ? nf : e == f ? tf : Ki;
        return (n < 0 ? e != a : e != f) && (v |= rf), new il(g, v, y);
      }
      i += d - c;
    }
    return r ? e + i : new il(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, n) {
    let r = 0, i = jc(n), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], d = a + c;
      if (e <= d && l == i * 3)
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
    for (let i = 0, s = 0; i < this.ranges.length; i += 3) {
      let o = this.ranges[i], l = o - (this.inverted ? s : 0), a = o + (this.inverted ? 0 : s), c = this.ranges[i + n], d = this.ranges[i + r];
      e(l, l + c, a, a + d), s += d - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new vt(this.ranges, !this.inverted);
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
    return e == 0 ? vt.empty : new vt(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
vt.empty = new vt([]);
class br {
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
    return new br(this.maps, this.mirror, e, n);
  }
  /**
  @internal
  */
  copy() {
    return new br(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
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
    let e = new br();
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
      let o = this.maps[s], l = o.mapResult(e, n);
      if (l.recover != null) {
        let a = this.getMirror(s);
        if (a != null && a > s && a < this.to) {
          s = a, e = this.maps[a].recover(l.recover);
          continue;
        }
      }
      i |= l.delInfo, e = l.pos;
    }
    return r ? e : new il(e, i, null);
  }
}
const go = /* @__PURE__ */ Object.create(null);
class dt {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return vt.empty;
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
    let r = go[n.stepType];
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
    if (e in go)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return go[e] = n, n.prototype.jsonID = e, n;
  }
}
class Le {
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
    return new Le(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new Le(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, n, r, i) {
    try {
      return Le.ok(e.replace(n, r, i));
    } catch (s) {
      if (s instanceof G1)
        return Le.fail(s.message);
      throw s;
    }
  }
}
function la(t, e, n) {
  let r = [];
  for (let i = 0; i < t.childCount; i++) {
    let s = t.child(i);
    s.content.size && (s = s.copy(la(s.content, e, s))), s.isInline && (s = e(s, n, i)), r.push(s);
  }
  return H.fromArray(r);
}
class pn extends dt {
  /**
  Create a mark step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new G(la(n.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), n.openStart, n.openEnd);
    return Le.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new Vt(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new pn(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof pn && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new pn(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new pn(n.from, n.to, e.markFromJSON(n.mark));
  }
}
dt.jsonID("addMark", pn);
class Vt extends dt {
  /**
  Create a mark-removing step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = new G(la(n.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), n.openStart, n.openEnd);
    return Le.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new pn(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new Vt(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Vt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Vt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Vt(n.from, n.to, e.markFromJSON(n.mark));
  }
}
dt.jsonID("removeMark", Vt);
class hn extends dt {
  /**
  Create a node mark step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Le.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.addToSet(n.marks));
    return Le.fromReplace(e, this.pos, this.pos + 1, new G(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    if (n) {
      let r = this.mark.addToSet(n.marks);
      if (r.length == n.marks.length) {
        for (let i = 0; i < n.marks.length; i++)
          if (!n.marks[i].isInSet(r))
            return new hn(this.pos, n.marks[i]);
        return new hn(this.pos, this.mark);
      }
    }
    return new Cr(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new hn(n.pos, this.mark);
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
    return new hn(n.pos, e.markFromJSON(n.mark));
  }
}
dt.jsonID("addNodeMark", hn);
class Cr extends dt {
  /**
  Create a mark-removing step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Le.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.removeFromSet(n.marks));
    return Le.fromReplace(e, this.pos, this.pos + 1, new G(H.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    return !n || !this.mark.isInSet(n.marks) ? this : new hn(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Cr(n.pos, this.mark);
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
    return new Cr(n.pos, e.markFromJSON(n.mark));
  }
}
dt.jsonID("removeNodeMark", Cr);
class We extends dt {
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
    return this.structure && sl(e, this.from, this.to) ? Le.fail("Structure replace would overwrite content") : Le.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new vt([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new We(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deletedAcross && r.deletedAcross ? null : new We(n.pos, Math.max(n.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof We) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let n = this.slice.size + e.slice.size == 0 ? G.empty : new G(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new We(this.from, this.to + (e.to - e.from), n, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let n = this.slice.size + e.slice.size == 0 ? G.empty : new G(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new We(e.from, this.to, n, this.structure);
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
    return new We(n.from, n.to, G.fromJSON(e, n.slice), !!n.structure);
  }
}
dt.jsonID("replace", We);
class $e extends dt {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, n, r, i, s, o, l = !1) {
    super(), this.from = e, this.to = n, this.gapFrom = r, this.gapTo = i, this.slice = s, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (sl(e, this.from, this.gapFrom) || sl(e, this.gapTo, this.to)))
      return Le.fail("Structure gap-replace would overwrite content");
    let n = e.slice(this.gapFrom, this.gapTo);
    if (n.openStart || n.openEnd)
      return Le.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, n.content);
    return r ? Le.fromReplace(e, this.from, this.to, r) : Le.fail("Content does not fit in gap");
  }
  getMap() {
    return new vt([
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
    return new $e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = e.map(this.gapFrom, -1), s = e.map(this.gapTo, 1);
    return n.deletedAcross && r.deletedAcross || i < n.pos || s > r.pos ? null : new $e(n.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new $e(n.from, n.to, n.gapFrom, n.gapTo, G.fromJSON(e, n.slice), n.insert, !!n.structure);
  }
}
dt.jsonID("replaceAround", $e);
function sl(t, e, n) {
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
function lg(t, e, n, r) {
  let i = [], s = [], o, l;
  t.doc.nodesBetween(e, n, (a, c, d) => {
    if (!a.isInline)
      return;
    let f = a.marks;
    if (!r.isInSet(f) && d.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), g = Math.min(c + a.nodeSize, n), y = r.addToSet(f);
      for (let v = 0; v < f.length; v++)
        f[v].isInSet(y) || (o && o.to == h && o.mark.eq(f[v]) ? o.to = g : i.push(o = new Vt(h, g, f[v])));
      l && l.to == h ? l.to = g : s.push(l = new pn(h, g, r));
    }
  }), i.forEach((a) => t.step(a)), s.forEach((a) => t.step(a));
}
function ag(t, e, n, r) {
  let i = [], s = 0;
  t.doc.nodesBetween(e, n, (o, l) => {
    if (!o.isInline)
      return;
    s++;
    let a = null;
    if (r instanceof oa) {
      let c = o.marks, d;
      for (; d = r.isInSet(c); )
        (a || (a = [])).push(d), c = d.removeFromSet(c);
    } else
      r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, n);
      for (let d = 0; d < a.length; d++) {
        let f = a[d], h;
        for (let g = 0; g < i.length; g++) {
          let y = i[g];
          y.step == s - 1 && f.eq(i[g].style) && (h = y);
        }
        h ? (h.to = c, h.step = s) : i.push({ style: f, from: Math.max(l, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => t.step(new Vt(o.from, o.to, o.style)));
}
function cg(t, e, n, r = n.contentMatch) {
  let i = t.doc.nodeAt(e), s = [], o = e + 1;
  for (let l = 0; l < i.childCount; l++) {
    let a = i.child(l), c = o + a.nodeSize, d = r.matchType(a.type);
    if (!d)
      s.push(new We(o, c, G.empty));
    else {
      r = d;
      for (let f = 0; f < a.marks.length; f++)
        n.allowsMarkType(a.marks[f].type) || t.step(new Vt(o, c, a.marks[f]));
      if (a.isText && !n.spec.code) {
        let f, h = /\r?\n|\r/g, g;
        for (; f = h.exec(a.text); )
          g || (g = new G(H.from(n.schema.text(" ", n.allowedMarks(a.marks))), 0, 0)), s.push(new We(o + f.index, o + f.index + f[0].length, g));
      }
    }
    o = c;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(H.empty, !0);
    t.replace(o, o, new G(l, 0, 0));
  }
  for (let l = s.length - 1; l >= 0; l--)
    t.step(s[l]);
}
function ug(t, e, n) {
  return (e == 0 || t.canReplace(e, t.childCount)) && (n == t.childCount || t.canReplace(0, n));
}
function Ir(t) {
  let n = t.parent.content.cutByIndex(t.startIndex, t.endIndex);
  for (let r = t.depth; ; --r) {
    let i = t.$from.node(r), s = t.$from.index(r), o = t.$to.indexAfter(r);
    if (r < t.depth && i.canReplace(s, o, n))
      return r;
    if (r == 0 || i.type.spec.isolating || !ug(i, s, o))
      break;
  }
  return null;
}
function dg(t, e, n) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), l = i.after(s + 1), a = o, c = l, d = H.empty, f = 0;
  for (let y = s, v = !1; y > n; y--)
    v || r.index(y) > 0 ? (v = !0, d = H.from(r.node(y).copy(d)), f++) : a--;
  let h = H.empty, g = 0;
  for (let y = s, v = !1; y > n; y--)
    v || i.after(y + 1) < i.end(y) ? (v = !0, h = H.from(i.node(y).copy(h)), g++) : c++;
  t.step(new $e(a, c, o, l, new G(d.append(h), f, g), d.size - f, !0));
}
function aa(t, e, n = null, r = t) {
  let i = fg(t, e), s = i && pg(r, e);
  return s ? i.map(Pc).concat({ type: e, attrs: n }).concat(s.map(Pc)) : null;
}
function Pc(t) {
  return { type: t, attrs: null };
}
function fg(t, e) {
  let { parent: n, startIndex: r, endIndex: i } = t, s = n.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return n.canReplaceWith(r, i, o) ? s : null;
}
function pg(t, e) {
  let { parent: n, startIndex: r, endIndex: i } = t, s = n.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++)
    a = a.matchType(n.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function hg(t, e, n) {
  let r = H.empty;
  for (let o = n.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = n[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = H.from(n[o].type.create(n[o].attrs, r));
  }
  let i = e.start, s = e.end;
  t.step(new $e(i, s, i, s, new G(r, 0, 0), n.length, !0));
}
function mg(t, e, n, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = t.steps.length;
  t.doc.nodesBetween(e, n, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, i) && gg(t.doc, t.mapping.slice(s).map(l), r)) {
      t.clearIncompatible(t.mapping.slice(s).map(l, 1), r);
      let a = t.mapping.slice(s), c = a.map(l, 1), d = a.map(l + o.nodeSize, 1);
      return t.step(new $e(c, d, c + 1, d - 1, new G(H.from(r.create(i, null, o.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function gg(t, e, n) {
  let r = t.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, n);
}
function yg(t, e, n, r, i) {
  let s = t.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  n || (n = s.type);
  let o = n.create(r, null, i || s.marks);
  if (s.isLeaf)
    return t.replaceWith(e, e + s.nodeSize, o);
  if (!n.validContent(s.content))
    throw new RangeError("Invalid content for node type " + n.name);
  t.step(new $e(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new G(H.from(o), 0, 0), 1, !0));
}
function vr(t, e, n = 1, r) {
  let i = t.resolve(e), s = i.depth - n, o = r && r[r.length - 1] || i.parent;
  if (s < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, d = n - 2; c > s; c--, d--) {
    let f = i.node(c), h = i.index(c);
    if (f.type.spec.isolating)
      return !1;
    let g = f.content.cutByIndex(h, f.childCount), y = r && r[d + 1];
    y && (g = g.replaceChild(0, y.type.create(y.attrs)));
    let v = r && r[d] || f;
    if (!f.canReplace(h + 1, f.childCount) || !v.type.validContent(g))
      return !1;
  }
  let l = i.indexAfter(s), a = r && r[0];
  return i.node(s).canReplaceWith(l, l, a ? a.type : i.node(s + 1).type);
}
function bg(t, e, n = 1, r) {
  let i = t.doc.resolve(e), s = H.empty, o = H.empty;
  for (let l = i.depth, a = i.depth - n, c = n - 1; l > a; l--, c--) {
    s = H.from(i.node(l).copy(s));
    let d = r && r[c];
    o = H.from(d ? d.type.create(d.attrs, o) : i.node(l).copy(o));
  }
  t.step(new We(e, e, new G(s.append(o), n, n), !0));
}
function Sn(t, e) {
  let n = t.resolve(e), r = n.index();
  return sf(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function sf(t, e) {
  return !!(t && e && !t.isLeaf && t.canAppend(e));
}
function Ys(t, e, n = -1) {
  let r = t.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, l = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : n > 0 ? (s = r.node(i + 1), l++, o = r.node(i).maybeChild(l)) : (s = r.node(i).maybeChild(l - 1), o = r.node(i + 1)), s && !s.isTextblock && sf(s, o) && r.node(i).canReplace(l, l + 1))
      return e;
    if (i == 0)
      break;
    e = n < 0 ? r.before(i) : r.after(i);
  }
}
function vg(t, e, n) {
  let r = new We(e - n, e + n, G.empty, !0);
  t.step(r);
}
function wg(t, e, n) {
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
function of(t, e, n) {
  let r = t.resolve(e);
  if (!n.content.size)
    return e;
  let i = n.content;
  for (let s = 0; s < n.openStart; s++)
    i = i.firstChild.content;
  for (let s = 1; s <= (n.openStart == 0 && n.size ? 2 : 1); s++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), d = !1;
      if (s == 1)
        d = c.canReplace(a, a, i);
      else {
        let f = c.contentMatchAt(a).findWrapping(i.firstChild.type);
        d = f && c.canReplaceWith(a, a, f[0]);
      }
      if (d)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function ca(t, e, n = e, r = G.empty) {
  if (e == n && !r.size)
    return null;
  let i = t.resolve(e), s = t.resolve(n);
  return lf(i, s, r) ? new We(e, n, r) : new _g(i, s, r).fit();
}
function lf(t, e, n) {
  return !n.openStart && !n.openEnd && t.start() == e.start() && t.parent.canReplace(t.index(), e.index(), n.content);
}
class _g {
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
    let s = this.placed, o = r.depth, l = i.depth;
    for (; o && l && s.childCount == 1; )
      s = s.firstChild.content, o--, l--;
    let a = new G(s, o, l);
    return e > -1 ? new $e(r.pos, e, this.$to.pos, this.$to.end(), a, n) : a.size || r.pos != this.$to.pos ? new We(r.pos, i.pos, a) : null;
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
        r ? (s = yo(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], d, f = null;
          if (n == 1 && (o ? c.matchType(o.type) || (f = c.fillBefore(H.from(o), !1)) : s && a.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, inject: f };
          if (n == 2 && o && (d = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, wrap: d };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, i = yo(e, n);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new G(e, n + 1, Math.max(r, i.size + n >= e.size - r ? n + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, i = yo(e, n);
    if (i.childCount <= 1 && n > 0) {
      let s = e.size - n <= n + i.size;
      this.unplaced = new G(Vr(e, n - 1, 1), n - 1, s ? n - 1 : r);
    } else
      this.unplaced = new G(Vr(e, n, 1), n, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: n, parent: r, inject: i, wrap: s }) {
    for (; this.depth > n; )
      this.closeFrontierNode();
    if (s)
      for (let v = 0; v < s.length; v++)
        this.openFrontierNode(s[v]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, d = [], { match: f, type: h } = this.frontier[n];
    if (i) {
      for (let v = 0; v < i.childCount; v++)
        d.push(i.child(v));
      f = f.matchFragment(i);
    }
    let g = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let v = l.child(c), k = f.matchType(v.type);
      if (!k)
        break;
      c++, (c > 1 || a == 0 || v.content.size) && (f = k, d.push(af(v.mark(h.allowedMarks(v.marks)), c == 1 ? a : 0, c == l.childCount ? g : -1)));
    }
    let y = c == l.childCount;
    y || (g = -1), this.placed = Kr(this.placed, n, H.from(d)), this.frontier[n].match = f, y && g < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let v = 0, k = l; v < g; v++) {
      let E = k.lastChild;
      this.frontier.push({ type: E.type, match: E.contentMatchAt(E.childCount) }), k = E.content;
    }
    this.unplaced = y ? e == 0 ? G.empty : new G(Vr(o.content, e - 1, 1), e - 1, g < 0 ? o.openEnd : e - 1) : new G(Vr(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], n;
    if (!e.type.isTextblock || !bo(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (n = this.findCloseLevel(this.$to)) && n.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e:
      for (let n = Math.min(this.depth, e.depth); n >= 0; n--) {
        let { match: r, type: i } = this.frontier[n], s = n < e.depth && e.end(n + 1) == e.pos + (e.depth - (n + 1)), o = bo(e, n, i, r, s);
        if (o) {
          for (let l = n - 1; l >= 0; l--) {
            let { match: a, type: c } = this.frontier[l], d = bo(e, l, c, a, !0);
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
    n.fit.childCount && (this.placed = Kr(this.placed, n.depth, n.fit)), e = n.move;
    for (let r = n.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, n = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Kr(this.placed, this.depth, H.from(e.create(n, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let n = this.frontier.pop().match.fillBefore(H.empty, !0);
    n.childCount && (this.placed = Kr(this.placed, this.frontier.length, n));
  }
}
function Vr(t, e, n) {
  return e == 0 ? t.cutByIndex(n, t.childCount) : t.replaceChild(0, t.firstChild.copy(Vr(t.firstChild.content, e - 1, n)));
}
function Kr(t, e, n) {
  return e == 0 ? t.append(n) : t.replaceChild(t.childCount - 1, t.lastChild.copy(Kr(t.lastChild.content, e - 1, n)));
}
function yo(t, e) {
  for (let n = 0; n < e; n++)
    t = t.firstChild.content;
  return t;
}
function af(t, e, n) {
  if (e <= 0)
    return t;
  let r = t.content;
  return e > 1 && (r = r.replaceChild(0, af(r.firstChild, e - 1, r.childCount == 1 ? n - 1 : 0))), e > 0 && (r = t.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(t.type.contentMatch.matchFragment(r).fillBefore(H.empty, !0)))), t.copy(r);
}
function bo(t, e, n, r, i) {
  let s = t.node(e), o = i ? t.indexAfter(e) : t.index(e);
  if (o == s.childCount && !n.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, o);
  return l && !kg(n, s.content, o) ? l : null;
}
function kg(t, e, n) {
  for (let r = n; r < e.childCount; r++)
    if (!t.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function xg(t) {
  return t.spec.defining || t.spec.definingForContent;
}
function Sg(t, e, n, r) {
  if (!r.size)
    return t.deleteRange(e, n);
  let i = t.doc.resolve(e), s = t.doc.resolve(n);
  if (lf(i, s, r))
    return t.step(new We(e, n, r));
  let o = uf(i, t.doc.resolve(n));
  o[o.length - 1] == 0 && o.pop();
  let l = -(i.depth + 1);
  o.unshift(l);
  for (let h = i.depth, g = i.pos - 1; h > 0; h--, g--) {
    let y = i.node(h).type.spec;
    if (y.defining || y.definingAsContext || y.isolating)
      break;
    o.indexOf(h) > -1 ? l = h : i.before(h) == g && o.splice(1, 0, -h);
  }
  let a = o.indexOf(l), c = [], d = r.openStart;
  for (let h = r.content, g = 0; ; g++) {
    let y = h.firstChild;
    if (c.push(y), g == r.openStart)
      break;
    h = y.content;
  }
  for (let h = d - 1; h >= 0; h--) {
    let g = c[h], y = xg(g.type);
    if (y && !g.sameMarkup(i.node(Math.abs(l) - 1)))
      d = h;
    else if (y || !g.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let g = (h + d + 1) % (r.openStart + 1), y = c[g];
    if (y)
      for (let v = 0; v < o.length; v++) {
        let k = o[(v + a) % o.length], E = !0;
        k < 0 && (E = !1, k = -k);
        let T = i.node(k - 1), j = i.index(k - 1);
        if (T.canReplaceWith(j, j, y.type, y.marks))
          return t.replace(i.before(k), E ? s.after(k) : n, new G(cf(r.content, 0, r.openStart, g), g, r.openEnd));
      }
  }
  let f = t.steps.length;
  for (let h = o.length - 1; h >= 0 && (t.replace(e, n, r), !(t.steps.length > f)); h--) {
    let g = o[h];
    g < 0 || (e = i.before(g), n = s.after(g));
  }
}
function cf(t, e, n, r, i) {
  if (e < n) {
    let s = t.firstChild;
    t = t.replaceChild(0, s.copy(cf(s.content, e + 1, n, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(t).append(t);
    t = o.append(s.matchFragment(o).fillBefore(H.empty, !0));
  }
  return t;
}
function Cg(t, e, n, r) {
  if (!r.isInline && e == n && t.doc.resolve(e).parent.content.size) {
    let i = wg(t.doc, e, r.type);
    i != null && (e = n = i);
  }
  t.replaceRange(e, n, new G(H.from(r), 0, 0));
}
function Eg(t, e, n) {
  let r = t.doc.resolve(e), i = t.doc.resolve(n), s = uf(r, i);
  for (let o = 0; o < s.length; o++) {
    let l = s[o], a = o == s.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return t.delete(r.start(l), i.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), i.indexAfter(l - 1))))
      return t.delete(r.before(l), i.after(l));
  }
  for (let o = 1; o <= r.depth && o <= i.depth; o++)
    if (e - r.start(o) == r.depth - o && n > r.end(o) && i.end(o) - n != i.depth - o)
      return t.delete(r.before(o), n);
  t.delete(e, n);
}
function uf(t, e) {
  let n = [], r = Math.min(t.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = t.start(i);
    if (s < t.pos - (t.depth - i) || e.end(i) > e.pos + (e.depth - i) || t.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == t.depth && i == e.depth && t.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && n.push(i);
  }
  return n;
}
class wr extends dt {
  /**
  Construct an attribute step.
  */
  constructor(e, n, r) {
    super(), this.pos = e, this.attr = n, this.value = r;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return Le.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in n.attrs)
      r[s] = n.attrs[s];
    r[this.attr] = this.value;
    let i = n.type.create(r, null, n.marks);
    return Le.fromReplace(e, this.pos, this.pos + 1, new G(H.from(i), 0, n.isLeaf ? 0 : 1));
  }
  getMap() {
    return vt.empty;
  }
  invert(e) {
    return new wr(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new wr(n.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.pos != "number" || typeof n.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new wr(n.pos, n.attr, n.value);
  }
}
dt.jsonID("attr", wr);
let Er = class extends Error {
};
Er = function t(e) {
  let n = Error.call(this, e);
  return n.__proto__ = t.prototype, n;
};
Er.prototype = Object.create(Error.prototype);
Er.prototype.constructor = Er;
Er.prototype.name = "TransformError";
class df {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new br();
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
      throw new Er(n.failed);
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
    let i = ca(this.doc, e, n, r);
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
    return Sg(this, e, n, r), this;
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
    return Cg(this, e, n, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, n) {
    return Eg(this, e, n), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, n) {
    return dg(this, e, n), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, n = 1) {
    return vg(this, e, n), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, n) {
    return hg(this, e, n), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, n = e, r, i = null) {
    return mg(this, e, n, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, n, r = null, i) {
    return yg(this, e, n, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  */
  setNodeAttribute(e, n, r) {
    return this.step(new wr(e, n, r)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, n) {
    return this.step(new hn(e, n)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, n) {
    if (!(n instanceof ht)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (n = n.isInSet(r.marks), !n)
        return this;
    }
    return this.step(new Cr(e, n)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, n = 1, r) {
    return bg(this, e, n, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, n, r) {
    return lg(this, e, n, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, n, r) {
    return ag(this, e, n, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, n, r) {
    return cg(this, e, n, r), this;
  }
}
const vo = /* @__PURE__ */ Object.create(null);
class re {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, n, r) {
    this.$anchor = e, this.$head = n, this.ranges = r || [new ff(e.min(n), e.max(n))];
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
    for (let l = 0; l < n.openEnd; l++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], d = e.mapping.slice(s);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? G.empty : n), l == 0 && Nc(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, n) {
    let r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: o, $to: l } = i[s], a = e.mapping.slice(r), c = a.map(o.pos), d = a.map(l.pos);
      s ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, n), Nc(e, r, n.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new ne(e) : nr(e.node(0), e.parent, e.pos, e.index(), n, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = n < 0 ? nr(e.node(0), e.node(s), e.before(s + 1), e.index(s), n, r) : nr(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, n, r);
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
    return this.findFrom(e, n) || this.findFrom(e, -n) || new jt(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return nr(e, e, 0, 0, 1) || new jt(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return nr(e, e, e.content.size, e.childCount, -1) || new jt(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, n) {
    if (!n || !n.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = vo[n.type];
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
    if (e in vo)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return vo[e] = n, n.prototype.jsonID = e, n;
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
re.prototype.visible = !0;
class ff {
  /**
  Create a range.
  */
  constructor(e, n) {
    this.$from = e, this.$to = n;
  }
}
let Rc = !1;
function Ic(t) {
  !Rc && !t.parent.inlineContent && (Rc = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + t.parent.type.name + ")"));
}
class ne extends re {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, n = e) {
    Ic(e), Ic(n), super(e, n);
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
      return re.near(r);
    let i = e.resolve(n.map(this.anchor));
    return new ne(i.parent.inlineContent ? i : r, r);
  }
  replace(e, n = G.empty) {
    if (super.replace(e, n), n == G.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof ne && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Xs(this.anchor, this.head);
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
      let s = re.findFrom(n, r, !0) || re.findFrom(n, -r, !0);
      if (s)
        n = s.$head;
      else
        return re.near(n, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = n : (e = (re.findFrom(e, -r, !0) || re.findFrom(e, r, !0)).$anchor, e.pos < n.pos != i < 0 && (e = n))), new ne(e, n);
  }
}
re.jsonID("text", ne);
class Xs {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new Xs(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return ne.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class ee extends re {
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
    return r ? re.near(s) : new ee(s);
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
    return new ua(this.anchor);
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
re.jsonID("node", ee);
class ua {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: n, pos: r } = e.mapResult(this.anchor);
    return n ? new Xs(r, r) : new ua(r);
  }
  resolve(e) {
    let n = e.resolve(this.anchor), r = n.nodeAfter;
    return r && ee.isSelectable(r) ? new ee(n) : re.near(n);
  }
}
class jt extends re {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, n = G.empty) {
    if (n == G.empty) {
      e.delete(0, e.doc.content.size);
      let r = re.atStart(e.doc);
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
    return new jt(e);
  }
  map(e) {
    return new jt(e);
  }
  eq(e) {
    return e instanceof jt;
  }
  getBookmark() {
    return Mg;
  }
}
re.jsonID("all", jt);
const Mg = {
  map() {
    return this;
  },
  resolve(t) {
    return new jt(t);
  }
};
function nr(t, e, n, r, i, s = !1) {
  if (e.inlineContent)
    return ne.create(t, n);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!s && ee.isSelectable(l))
        return ee.create(t, n - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = nr(t, l, n + i, i < 0 ? l.childCount : 0, i, s);
      if (a)
        return a;
    }
    n += l.nodeSize * i;
  }
  return null;
}
function Nc(t, e, n) {
  let r = t.steps.length - 1;
  if (r < e)
    return;
  let i = t.steps[r];
  if (!(i instanceof We || i instanceof $e))
    return;
  let s = t.mapping.maps[r], o;
  s.forEach((l, a, c, d) => {
    o == null && (o = d);
  }), t.setSelection(re.near(t.doc.resolve(o), n));
}
function Lc(t, e) {
  return !e || !t ? t : t.bind(e);
}
class Oi {
  constructor(e, n, r) {
    this.name = e, this.init = Lc(n.init, r), this.apply = Lc(n.apply, r);
  }
}
new Oi("doc", {
  init(t) {
    return t.doc || t.schema.topNodeType.createAndFill();
  },
  apply(t) {
    return t.doc;
  }
}), new Oi("selection", {
  init(t, e) {
    return t.selection || re.atStart(e.doc);
  },
  apply(t) {
    return t.selection;
  }
}), new Oi("storedMarks", {
  init(t) {
    return t.storedMarks || null;
  },
  apply(t, e, n, r) {
    return r.selection.$cursor ? t.storedMarks : null;
  }
}), new Oi("scrollToSelection", {
  init() {
    return 0;
  },
  apply(t, e) {
    return t.scrolledIntoView ? e + 1 : e;
  }
});
function pf(t, e, n) {
  for (let r in t) {
    let i = t[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = pf(i, e, {})), n[r] = i;
  }
  return n;
}
class et {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && pf(e.props, this, this.props), this.key = e.key ? e.key.key : hf("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const wo = /* @__PURE__ */ Object.create(null);
function hf(t) {
  return t in wo ? t + "$" + ++wo[t] : (wo[t] = 0, t + "$");
}
class tt {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = hf(e);
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
const Gn = function(t) {
  for (var e = 0; ; e++)
    if (t = t.previousSibling, !t)
      return e;
}, mf = function(t, e, n, r) {
  return n && (zc(t, e, n, r, -1) || zc(t, e, n, r, 1));
}, Ag = /^(img|br|input|textarea|hr)$/i;
function zc(t, e, n, r, i) {
  for (; ; ) {
    if (t == n && e == r)
      return !0;
    if (e == (i < 0 ? 0 : ds(t))) {
      let s = t.parentNode;
      if (!s || s.nodeType != 1 || da(t) || Ag.test(t.nodeName) || t.contentEditable == "false")
        return !1;
      e = Gn(t) + (i < 0 ? 0 : 1), t = s;
    } else if (t.nodeType == 1) {
      if (t = t.childNodes[e + (i < 0 ? -1 : 0)], t.contentEditable == "false")
        return !1;
      e = i < 0 ? ds(t) : 0;
    } else
      return !1;
  }
}
function ds(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function Tg(t, e, n) {
  for (let r = e == 0, i = e == ds(t); r || i; ) {
    if (t == n)
      return !0;
    let s = Gn(t);
    if (t = t.parentNode, !t)
      return !1;
    r = r && s == 0, i = i && s == ds(t);
  }
}
function da(t) {
  let e;
  for (let n = t; n && !(e = n.pmViewDesc); n = n.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == t || e.contentDOM == t);
}
const gf = function(t) {
  return t.focusNode && mf(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset);
};
function yf(t, e) {
  let n = document.createEvent("Event");
  return n.initEvent("keydown", !0, !0), n.keyCode = t, n.key = n.code = e, n;
}
const qt = typeof navigator < "u" ? navigator : null, Dc = typeof document < "u" ? document : null, Cn = qt && qt.userAgent || "", ol = /Edge\/(\d+)/.exec(Cn), bf = /MSIE \d/.exec(Cn), ll = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Cn), gi = !!(bf || ll || ol), vf = bf ? document.documentMode : ll ? +ll[1] : ol ? +ol[1] : 0, Qs = !gi && /gecko\/(\d+)/i.test(Cn);
Qs && +(/Firefox\/(\d+)/.exec(Cn) || [0, 0])[1];
const al = !gi && /Chrome\/(\d+)/.exec(Cn), Jn = !!al, Og = al ? +al[1] : 0, Yn = !gi && !!qt && /Apple Computer/.test(qt.vendor), fa = Yn && (/Mobile\/\w+/.test(Cn) || !!qt && qt.maxTouchPoints > 2), yt = fa || (qt ? /Mac/.test(qt.platform) : !1), jg = qt ? /Win/.test(qt.platform) : !1, yi = /Android \d/.test(Cn), pa = !!Dc && "webkitFontSmoothing" in Dc.documentElement.style, Pg = pa ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Rg(t, e = null) {
  let n = t.domSelectionRange(), r = t.state.doc;
  if (!n.focusNode)
    return null;
  let i = t.docView.nearestDesc(n.focusNode), s = i && i.size == 0, o = t.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (gf(n)) {
    for (a = l; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && ee.isSelectable(d) && i.parent && !(d.isInline && Tg(n.focusNode, n.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new ee(o == f ? l : r.resolve(f));
    }
  } else {
    let d = t.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
    if (d < 0)
      return null;
    a = r.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || t.state.selection.head < l.pos && !s ? 1 : -1;
    c = _f(t, a, l, d);
  }
  return c;
}
function wf(t) {
  return t.editable ? t.hasFocus() : zg(t) && document.activeElement && document.activeElement.contains(t.dom);
}
function ha(t, e = !1) {
  let n = t.state.selection;
  if (Lg(t, n), !!wf(t)) {
    if (!e && t.input.mouseDown && t.input.mouseDown.allowDefault && Jn) {
      let r = t.domSelectionRange(), i = t.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && mf(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        t.input.mouseDown.delayedSelectionSync = !0, t.domObserver.setCurSelection();
        return;
      }
    }
    if (t.domObserver.disconnectSelection(), t.cursorWrapper)
      Ng(t);
    else {
      let { anchor: r, head: i } = n, s, o;
      Bc && !(n instanceof ne) && (n.$from.parent.inlineContent || (s = $c(t, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = $c(t, n.to))), t.docView.setSelection(r, i, t.root, e), Bc && (s && Hc(s), o && Hc(o)), n.visible ? t.dom.classList.remove("ProseMirror-hideselection") : (t.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ig(t));
    }
    t.domObserver.setCurSelection(), t.domObserver.connectSelection();
  }
}
const Bc = Yn || Jn && Og < 63;
function $c(t, e) {
  let { node: n, offset: r } = t.docView.domFromPos(e, 0), i = r < n.childNodes.length ? n.childNodes[r] : null, s = r ? n.childNodes[r - 1] : null;
  if (Yn && i && i.contentEditable == "false")
    return _o(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return _o(i);
    if (s)
      return _o(s);
  }
}
function _o(t) {
  return t.contentEditable = "true", Yn && t.draggable && (t.draggable = !1, t.wasDraggable = !0), t;
}
function Hc(t) {
  t.contentEditable = "false", t.wasDraggable && (t.draggable = !0, t.wasDraggable = null);
}
function Ig(t) {
  let e = t.dom.ownerDocument;
  e.removeEventListener("selectionchange", t.input.hideSelectionGuard);
  let n = t.domSelectionRange(), r = n.anchorNode, i = n.anchorOffset;
  e.addEventListener("selectionchange", t.input.hideSelectionGuard = () => {
    (n.anchorNode != r || n.anchorOffset != i) && (e.removeEventListener("selectionchange", t.input.hideSelectionGuard), setTimeout(() => {
      (!wf(t) || t.state.selection.visible) && t.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Ng(t) {
  let e = t.domSelection(), n = document.createRange(), r = t.cursorWrapper.dom, i = r.nodeName == "IMG";
  i ? n.setEnd(r.parentNode, Gn(r) + 1) : n.setEnd(r, 0), n.collapse(!1), e.removeAllRanges(), e.addRange(n), !i && !t.state.selection.visible && gi && vf <= 11 && (r.disabled = !0, r.disabled = !1);
}
function Lg(t, e) {
  if (e instanceof ee) {
    let n = t.docView.descAt(e.from);
    n != t.lastSelectedViewDesc && (Fc(t), n && n.selectNode(), t.lastSelectedViewDesc = n);
  } else
    Fc(t);
}
function Fc(t) {
  t.lastSelectedViewDesc && (t.lastSelectedViewDesc.parent && t.lastSelectedViewDesc.deselectNode(), t.lastSelectedViewDesc = void 0);
}
function _f(t, e, n, r) {
  return t.someProp("createSelectionBetween", (i) => i(t, e, n)) || ne.between(e, n, r);
}
function zg(t) {
  let e = t.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return t.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (t.editable || t.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function cl(t, e) {
  let { $anchor: n, $head: r } = t.selection, i = e > 0 ? n.max(r) : n.min(r), s = i.parent.inlineContent ? i.depth ? t.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && re.findFrom(s, e);
}
function In(t, e) {
  return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Wc(t, e, n) {
  let r = t.state.selection;
  if (r instanceof ne) {
    if (!r.empty || n.indexOf("s") > -1)
      return !1;
    if (t.endOfTextblock(e > 0 ? "forward" : "backward")) {
      let i = cl(t.state, e);
      return i && i instanceof ee ? In(t, i) : !1;
    } else if (!(yt && n.indexOf("m") > -1)) {
      let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
      if (!s || s.isText)
        return !1;
      let l = e < 0 ? i.pos - s.nodeSize : i.pos;
      return s.isAtom || (o = t.docView.descAt(l)) && !o.contentDOM ? ee.isSelectable(s) ? In(t, new ee(e < 0 ? t.state.doc.resolve(i.pos - s.nodeSize) : i)) : pa ? In(t, new ne(t.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
    }
  } else {
    if (r instanceof ee && r.node.isInline)
      return In(t, new ne(e > 0 ? r.$to : r.$from));
    {
      let i = cl(t.state, e);
      return i ? In(t, i) : !1;
    }
  }
}
function fs(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function Qr(t, e) {
  if (t.contentEditable == "false")
    return !0;
  let n = t.pmViewDesc;
  return n && n.size == 0 && (e < 0 || t.nextSibling || t.nodeName != "BR");
}
function er(t, e) {
  return e < 0 ? Dg(t) : Bg(t);
}
function Dg(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let i, s, o = !1;
  for (Qs && n.nodeType == 1 && r < fs(n) && Qr(n.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (n.nodeType != 1)
        break;
      {
        let l = n.childNodes[r - 1];
        if (Qr(l, -1))
          i = n, s = --r;
        else if (l.nodeType == 3)
          n = l, r = n.nodeValue.length;
        else
          break;
      }
    } else {
      if (kf(n))
        break;
      {
        let l = n.previousSibling;
        for (; l && Qr(l, -1); )
          i = n.parentNode, s = Gn(l), l = l.previousSibling;
        if (l)
          n = l, r = fs(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = 0;
        }
      }
    }
  o ? ul(t, n, r) : i && ul(t, i, s);
}
function Bg(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let i = fs(n), s, o;
  for (; ; )
    if (r < i) {
      if (n.nodeType != 1)
        break;
      let l = n.childNodes[r];
      if (Qr(l, 1))
        s = n, o = ++r;
      else
        break;
    } else {
      if (kf(n))
        break;
      {
        let l = n.nextSibling;
        for (; l && Qr(l, 1); )
          s = l.parentNode, o = Gn(l) + 1, l = l.nextSibling;
        if (l)
          n = l, r = 0, i = fs(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && ul(t, s, o);
}
function kf(t) {
  let e = t.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function $g(t, e) {
  for (; t && e == t.childNodes.length && !da(t); )
    e = Gn(t) + 1, t = t.parentNode;
  for (; t && e < t.childNodes.length; ) {
    let n = t.childNodes[e];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = 0;
  }
}
function Hg(t, e) {
  for (; t && !e && !da(t); )
    e = Gn(t), t = t.parentNode;
  for (; t && e; ) {
    let n = t.childNodes[e - 1];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = t.childNodes.length;
  }
}
function ul(t, e, n) {
  if (e.nodeType != 3) {
    let s, o;
    (o = $g(e, n)) ? (e = o, n = 0) : (s = Hg(e, n)) && (e = s, n = s.nodeValue.length);
  }
  let r = t.domSelection();
  if (gf(r)) {
    let s = document.createRange();
    s.setEnd(e, n), s.setStart(e, n), r.removeAllRanges(), r.addRange(s);
  } else
    r.extend && r.extend(e, n);
  t.domObserver.setCurSelection();
  let { state: i } = t;
  setTimeout(() => {
    t.state == i && ha(t);
  }, 50);
}
function Vc(t, e) {
  let n = t.state.doc.resolve(e);
  if (!(Jn || jg) && n.parent.inlineContent) {
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
function Kc(t, e, n) {
  let r = t.state.selection;
  if (r instanceof ne && !r.empty || n.indexOf("s") > -1 || yt && n.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || t.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = cl(t.state, e);
    if (o && o instanceof ee)
      return In(t, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, l = r instanceof jt ? re.near(o, e) : re.findFrom(o, e);
    return l ? In(t, l) : !1;
  }
  return !1;
}
function Uc(t, e) {
  if (!(t.state.selection instanceof ne))
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
function qc(t, e, n) {
  t.domObserver.stop(), e.contentEditable = n, t.domObserver.start();
}
function Fg(t) {
  if (!Yn || t.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: n } = t.domSelectionRange();
  if (e && e.nodeType == 1 && n == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    qc(t, r, "true"), setTimeout(() => qc(t, r, "false"), 20);
  }
  return !1;
}
function Wg(t) {
  let e = "";
  return t.ctrlKey && (e += "c"), t.metaKey && (e += "m"), t.altKey && (e += "a"), t.shiftKey && (e += "s"), e;
}
function Vg(t, e) {
  let n = e.keyCode, r = Wg(e);
  if (n == 8 || yt && n == 72 && r == "c")
    return Uc(t, -1) || er(t, -1);
  if (n == 46 && !e.shiftKey || yt && n == 68 && r == "c")
    return Uc(t, 1) || er(t, 1);
  if (n == 13 || n == 27)
    return !0;
  if (n == 37 || yt && n == 66 && r == "c") {
    let i = n == 37 ? Vc(t, t.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Wc(t, i, r) || er(t, i);
  } else if (n == 39 || yt && n == 70 && r == "c") {
    let i = n == 39 ? Vc(t, t.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Wc(t, i, r) || er(t, i);
  } else {
    if (n == 38 || yt && n == 80 && r == "c")
      return Kc(t, -1, r) || er(t, -1);
    if (n == 40 || yt && n == 78 && r == "c")
      return Fg(t) || Kc(t, 1, r) || er(t, 1);
    if (r == (yt ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90))
      return !0;
  }
  return !1;
}
function xf(t, e) {
  t.someProp("transformCopied", (g) => {
    e = g(e, t);
  });
  let n = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let g = r.firstChild;
    n.push(g.type.name, g.attrs != g.type.defaultAttrs ? g.attrs : null), r = g.content;
  }
  let o = t.someProp("clipboardSerializer") || Bn.fromSchema(t.state.schema), l = Tf(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, d, f = 0;
  for (; c && c.nodeType == 1 && (d = Af[c.nodeName.toLowerCase()]); ) {
    for (let g = d.length - 1; g >= 0; g--) {
      let y = l.createElement(d[g]);
      for (; a.firstChild; )
        y.appendChild(a.firstChild);
      a.appendChild(y), f++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${f ? ` -${f}` : ""} ${JSON.stringify(n)}`);
  let h = t.someProp("clipboardTextSerializer", (g) => g(e, t)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: h };
}
function Sf(t, e, n, r, i) {
  let s = i.parent.type.spec.code, o, l;
  if (!n && !e)
    return null;
  let a = e && (r || s || !n);
  if (a) {
    if (t.someProp("transformPastedText", (h) => {
      e = h(e, s || r, t);
    }), s)
      return e ? new G(H.from(t.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : G.empty;
    let f = t.someProp("clipboardTextParser", (h) => h(e, i, r, t));
    if (f)
      l = f;
    else {
      let h = i.marks(), { schema: g } = t.state, y = Bn.fromSchema(g);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((v) => {
        let k = o.appendChild(document.createElement("p"));
        v && k.appendChild(y.serializeNode(g.text(v, h)));
      });
    }
  } else
    t.someProp("transformPastedHTML", (f) => {
      n = f(n, t);
    }), o = qg(n), pa && Gg(o);
  let c = o && o.querySelector("[data-pm-slice]"), d = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (d && d[3])
    for (let f = +d[3]; f > 0; f--) {
      let h = o.firstChild;
      for (; h && h.nodeType != 1; )
        h = h.nextSibling;
      if (!h)
        break;
      o = h;
    }
  if (l || (l = (t.someProp("clipboardParser") || t.someProp("domParser") || Yd.fromSchema(t.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || d),
    context: i,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !Kg.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), d)
    l = Jg(Gc(l, +d[1], +d[2]), d[4]);
  else if (l = G.maxOpen(Ug(l.content, i), !0), l.openStart || l.openEnd) {
    let f = 0, h = 0;
    for (let g = l.content.firstChild; f < l.openStart && !g.type.spec.isolating; f++, g = g.firstChild)
      ;
    for (let g = l.content.lastChild; h < l.openEnd && !g.type.spec.isolating; h++, g = g.lastChild)
      ;
    l = Gc(l, f, h);
  }
  return t.someProp("transformPasted", (f) => {
    l = f(l, t);
  }), l;
}
const Kg = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Ug(t, e) {
  if (t.childCount < 2)
    return t;
  for (let n = e.depth; n >= 0; n--) {
    let i = e.node(n).contentMatchAt(e.index(n)), s, o = [];
    if (t.forEach((l) => {
      if (!o)
        return;
      let a = i.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && s.length && Ef(a, s, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Mf(o[o.length - 1], s.length));
        let d = Cf(l, a);
        o.push(d), i = i.matchType(d.type), s = a;
      }
    }), o)
      return H.from(o);
  }
  return t;
}
function Cf(t, e, n = 0) {
  for (let r = e.length - 1; r >= n; r--)
    t = e[r].create(null, H.from(t));
  return t;
}
function Ef(t, e, n, r, i) {
  if (i < t.length && i < e.length && t[i] == e[i]) {
    let s = Ef(t, e, n, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == t.length - 1 ? n.type : t[i + 1]))
      return r.copy(r.content.append(H.from(Cf(n, t, i + 1))));
  }
}
function Mf(t, e) {
  if (e == 0)
    return t;
  let n = t.content.replaceChild(t.childCount - 1, Mf(t.lastChild, e - 1)), r = t.contentMatchAt(t.childCount).fillBefore(H.empty, !0);
  return t.copy(n.append(r));
}
function dl(t, e, n, r, i, s) {
  let o = e < 0 ? t.firstChild : t.lastChild, l = o.content;
  return t.childCount > 1 && (s = 0), i < r - 1 && (l = dl(l, e, n, r, i + 1, s)), i >= n && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, s <= i).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(H.empty, !0))), t.replaceChild(e < 0 ? 0 : t.childCount - 1, o.copy(l));
}
function Gc(t, e, n) {
  return e < t.openStart && (t = new G(dl(t.content, -1, e, t.openStart, 0, t.openEnd), e, t.openEnd)), n < t.openEnd && (t = new G(dl(t.content, 1, n, t.openEnd, 0, 0), t.openStart, n)), t;
}
const Af = {
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
let Jc = null;
function Tf() {
  return Jc || (Jc = document.implementation.createHTMLDocument("title"));
}
function qg(t) {
  let e = /^(\s*<meta [^>]*>)*/.exec(t);
  e && (t = t.slice(e[0].length));
  let n = Tf().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(t), i;
  if ((i = r && Af[r[1].toLowerCase()]) && (t = i.map((s) => "<" + s + ">").join("") + t + i.map((s) => "</" + s + ">").reverse().join("")), n.innerHTML = t, i)
    for (let s = 0; s < i.length; s++)
      n = n.querySelector(i[s]) || n;
  return n;
}
function Gg(t) {
  let e = t.querySelectorAll(Jn ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "), r);
  }
}
function Jg(t, e) {
  if (!t.size)
    return t;
  let n = t.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return t;
  }
  let { content: i, openStart: s, openEnd: o } = t;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = n.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    i = H.from(a.create(r[l + 1], i)), s++, o++;
  }
  return new G(i, s, o);
}
const Pt = {}, mt = {};
function mn(t, e) {
  t.input.lastSelectionOrigin = e, t.input.lastSelectionTime = Date.now();
}
mt.keydown = (t, e) => {
  let n = e;
  if (t.input.shiftKey = n.keyCode == 16 || n.shiftKey, !jf(t, n) && (t.input.lastKeyCode = n.keyCode, t.input.lastKeyCodeTime = Date.now(), !(yi && Jn && n.keyCode == 13)))
    if (n.keyCode != 229 && t.domObserver.forceFlush(), fa && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
      let r = Date.now();
      t.input.lastIOSEnter = r, t.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        t.input.lastIOSEnter == r && (t.someProp("handleKeyDown", (i) => i(t, yf(13, "Enter"))), t.input.lastIOSEnter = 0);
      }, 200);
    } else
      t.someProp("handleKeyDown", (r) => r(t, n)) || Vg(t, n) ? n.preventDefault() : mn(t, "key");
};
mt.keyup = (t, e) => {
  e.keyCode == 16 && (t.input.shiftKey = !1);
};
mt.keypress = (t, e) => {
  let n = e;
  if (jf(t, n) || !n.charCode || n.ctrlKey && !n.altKey || yt && n.metaKey)
    return;
  if (t.someProp("handleKeyPress", (i) => i(t, n))) {
    n.preventDefault();
    return;
  }
  let r = t.state.selection;
  if (!(r instanceof ne) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(n.charCode);
    !/[\r\n]/.test(i) && !t.someProp("handleTextInput", (s) => s(t, r.$from.pos, r.$to.pos, i)) && t.dispatch(t.state.tr.insertText(i).scrollIntoView()), n.preventDefault();
  }
};
function Zs(t) {
  return { left: t.clientX, top: t.clientY };
}
function Yg(t, e) {
  let n = e.x - t.clientX, r = e.y - t.clientY;
  return n * n + r * r < 100;
}
function ma(t, e, n, r, i) {
  if (r == -1)
    return !1;
  let s = t.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (t.someProp(e, (l) => o > s.depth ? l(t, n, s.nodeAfter, s.before(o), i, !0) : l(t, n, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function _r(t, e, n) {
  t.focused || t.focus();
  let r = t.state.tr.setSelection(e);
  n == "pointer" && r.setMeta("pointer", !0), t.dispatch(r);
}
function Xg(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.doc.resolve(e), r = n.nodeAfter;
  return r && r.isAtom && ee.isSelectable(r) ? (_r(t, new ee(n), "pointer"), !0) : !1;
}
function Qg(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.selection, r, i;
  n instanceof ee && (r = n.node);
  let s = t.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let l = o > s.depth ? s.nodeAfter : s.node(o);
    if (ee.isSelectable(l)) {
      r && n.$from.depth > 0 && o >= n.$from.depth && s.before(n.$from.depth + 1) == n.$from.pos ? i = s.before(n.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (_r(t, ee.create(t.state.doc, i), "pointer"), !0) : !1;
}
function Zg(t, e, n, r, i) {
  return ma(t, "handleClickOn", e, n, r) || t.someProp("handleClick", (s) => s(t, e, r)) || (i ? Qg(t, n) : Xg(t, n));
}
function e0(t, e, n, r) {
  return ma(t, "handleDoubleClickOn", e, n, r) || t.someProp("handleDoubleClick", (i) => i(t, e, r));
}
function t0(t, e, n, r) {
  return ma(t, "handleTripleClickOn", e, n, r) || t.someProp("handleTripleClick", (i) => i(t, e, r)) || n0(t, n, r);
}
function n0(t, e, n) {
  if (n.button != 0)
    return !1;
  let r = t.state.doc;
  if (e == -1)
    return r.inlineContent ? (_r(t, ne.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), l = i.before(s);
    if (o.inlineContent)
      _r(t, ne.create(r, l + 1, l + 1 + o.content.size), "pointer");
    else if (ee.isSelectable(o))
      _r(t, ee.create(r, l), "pointer");
    else
      continue;
    return !0;
  }
}
function ga(t) {
  return ps(t);
}
const Of = yt ? "metaKey" : "ctrlKey";
Pt.mousedown = (t, e) => {
  let n = e;
  t.input.shiftKey = n.shiftKey;
  let r = ga(t), i = Date.now(), s = "singleClick";
  i - t.input.lastClick.time < 500 && Yg(n, t.input.lastClick) && !n[Of] && (t.input.lastClick.type == "singleClick" ? s = "doubleClick" : t.input.lastClick.type == "doubleClick" && (s = "tripleClick")), t.input.lastClick = { time: i, x: n.clientX, y: n.clientY, type: s };
  let o = t.posAtCoords(Zs(n));
  o && (s == "singleClick" ? (t.input.mouseDown && t.input.mouseDown.done(), t.input.mouseDown = new r0(t, o, n, !!r)) : (s == "doubleClick" ? e0 : t0)(t, o.pos, o.inside, n) ? n.preventDefault() : mn(t, "pointer"));
};
class r0 {
  constructor(e, n, r, i) {
    this.view = e, this.pos = n, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Of], this.allowDefault = r.shiftKey;
    let s, o;
    if (n.inside > -1)
      s = e.state.doc.nodeAt(n.inside), o = n.inside;
    else {
      let d = e.state.doc.resolve(n.pos);
      s = d.parent, o = d.depth ? d.before() : 0;
    }
    const l = i ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a ? a.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof ee && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Qs && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), mn(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => ha(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let n = this.pos;
    this.view.state.doc != this.startDoc && (n = this.view.posAtCoords(Zs(e))), this.updateAllowDefault(e), this.allowDefault || !n ? mn(this.view, "pointer") : Zg(this.view, n.pos, n.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Yn && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Jn && !this.view.state.selection.visible && Math.min(Math.abs(n.pos - this.view.state.selection.from), Math.abs(n.pos - this.view.state.selection.to)) <= 2) ? (_r(this.view, re.near(this.view.state.doc.resolve(n.pos)), "pointer"), e.preventDefault()) : mn(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), mn(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Pt.touchstart = (t) => {
  t.input.lastTouch = Date.now(), ga(t), mn(t, "pointer");
};
Pt.touchmove = (t) => {
  t.input.lastTouch = Date.now(), mn(t, "pointer");
};
Pt.contextmenu = (t) => ga(t);
function jf(t, e) {
  return t.composing ? !0 : Yn && Math.abs(e.timeStamp - t.input.compositionEndedAt) < 500 ? (t.input.compositionEndedAt = -2e8, !0) : !1;
}
const i0 = yi ? 5e3 : -1;
mt.compositionstart = mt.compositionupdate = (t) => {
  if (!t.composing) {
    t.domObserver.flush();
    let { state: e } = t, n = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      t.markCursor = t.state.storedMarks || n.marks(), ps(t, !0), t.markCursor = null;
    else if (ps(t), Qs && e.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
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
  Pf(t, i0);
};
mt.compositionend = (t, e) => {
  t.composing && (t.input.composing = !1, t.input.compositionEndedAt = e.timeStamp, t.input.compositionPendingChanges = t.domObserver.pendingRecords().length ? t.input.compositionID : 0, t.input.compositionPendingChanges && Promise.resolve().then(() => t.domObserver.flush()), t.input.compositionID++, Pf(t, 20));
};
function Pf(t, e) {
  clearTimeout(t.input.composingTimeout), e > -1 && (t.input.composingTimeout = setTimeout(() => ps(t), e));
}
function s0(t) {
  for (t.composing && (t.input.composing = !1, t.input.compositionEndedAt = o0()); t.input.compositionNodes.length > 0; )
    t.input.compositionNodes.pop().markParentsDirty();
}
function o0() {
  let t = document.createEvent("Event");
  return t.initEvent("event", !0, !0), t.timeStamp;
}
function ps(t, e = !1) {
  if (!(yi && t.domObserver.flushingSoon >= 0)) {
    if (t.domObserver.forceFlush(), s0(t), e || t.docView && t.docView.dirty) {
      let n = Rg(t);
      return n && !n.eq(t.state.selection) ? t.dispatch(t.state.tr.setSelection(n)) : t.updateState(t.state), !0;
    }
    return !1;
  }
}
function l0(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.dom.parentNode.appendChild(document.createElement("div"));
  n.appendChild(e), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), t.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    n.parentNode && n.parentNode.removeChild(n), t.focus();
  }, 50);
}
const Mr = gi && vf < 15 || fa && Pg < 604;
Pt.copy = mt.cut = (t, e) => {
  let n = e, r = t.state.selection, i = n.type == "cut";
  if (r.empty)
    return;
  let s = Mr ? null : n.clipboardData, o = r.content(), { dom: l, text: a } = xf(t, o);
  s ? (n.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", a)) : l0(t, l), i && t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function a0(t) {
  return t.openStart == 0 && t.openEnd == 0 && t.content.childCount == 1 ? t.content.firstChild : null;
}
function c0(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.input.shiftKey || t.state.selection.$from.parent.type.spec.code, r = t.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
  n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = t.input.shiftKey && t.input.lastKeyCode != 45;
  setTimeout(() => {
    t.focus(), r.parentNode && r.parentNode.removeChild(r), n ? fl(t, r.value, null, i, e) : fl(t, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function fl(t, e, n, r, i) {
  let s = Sf(t, e, n, r, t.state.selection.$from);
  if (t.someProp("handlePaste", (a) => a(t, i, s || G.empty)))
    return !0;
  if (!s)
    return !1;
  let o = a0(s), l = o ? t.state.tr.replaceSelectionWith(o, r) : t.state.tr.replaceSelection(s);
  return t.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
mt.paste = (t, e) => {
  let n = e;
  if (t.composing && !yi)
    return;
  let r = Mr ? null : n.clipboardData, i = t.input.shiftKey && t.input.lastKeyCode != 45;
  r && fl(t, r.getData("text/plain"), r.getData("text/html"), i, n) ? n.preventDefault() : c0(t, n);
};
class u0 {
  constructor(e, n) {
    this.slice = e, this.move = n;
  }
}
const Rf = yt ? "altKey" : "ctrlKey";
Pt.dragstart = (t, e) => {
  let n = e, r = t.input.mouseDown;
  if (r && r.done(), !n.dataTransfer)
    return;
  let i = t.state.selection, s = i.empty ? null : t.posAtCoords(Zs(n));
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof ee ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      t.dispatch(t.state.tr.setSelection(ee.create(t.state.doc, r.mightDrag.pos)));
    else if (n.target && n.target.nodeType == 1) {
      let c = t.docView.nearestDesc(n.target, !0);
      c && c.node.type.spec.draggable && c != t.docView && t.dispatch(t.state.tr.setSelection(ee.create(t.state.doc, c.posBefore)));
    }
  }
  let o = t.state.selection.content(), { dom: l, text: a } = xf(t, o);
  n.dataTransfer.clearData(), n.dataTransfer.setData(Mr ? "Text" : "text/html", l.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Mr || n.dataTransfer.setData("text/plain", a), t.dragging = new u0(o, !n[Rf]);
};
Pt.dragend = (t) => {
  let e = t.dragging;
  window.setTimeout(() => {
    t.dragging == e && (t.dragging = null);
  }, 50);
};
mt.dragover = mt.dragenter = (t, e) => e.preventDefault();
mt.drop = (t, e) => {
  let n = e, r = t.dragging;
  if (t.dragging = null, !n.dataTransfer)
    return;
  let i = t.posAtCoords(Zs(n));
  if (!i)
    return;
  let s = t.state.doc.resolve(i.pos), o = r && r.slice;
  o ? t.someProp("transformPasted", (y) => {
    o = y(o, t);
  }) : o = Sf(t, n.dataTransfer.getData(Mr ? "Text" : "text/plain"), Mr ? null : n.dataTransfer.getData("text/html"), !1, s);
  let l = !!(r && !n[Rf]);
  if (t.someProp("handleDrop", (y) => y(t, n, o || G.empty, l))) {
    n.preventDefault();
    return;
  }
  if (!o)
    return;
  n.preventDefault();
  let a = o ? of(t.state.doc, s.pos, o) : s.pos;
  a == null && (a = s.pos);
  let c = t.state.tr;
  l && c.deleteSelection();
  let d = c.mapping.map(a), f = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, h = c.doc;
  if (f ? c.replaceRangeWith(d, d, o.content.firstChild) : c.replaceRange(d, d, o), c.doc.eq(h))
    return;
  let g = c.doc.resolve(d);
  if (f && ee.isSelectable(o.content.firstChild) && g.nodeAfter && g.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new ee(g));
  else {
    let y = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((v, k, E, T) => y = T), c.setSelection(_f(t, g, c.doc.resolve(y)));
  }
  t.focus(), t.dispatch(c.setMeta("uiEvent", "drop"));
};
Pt.focus = (t) => {
  t.input.lastFocus = Date.now(), t.focused || (t.domObserver.stop(), t.dom.classList.add("ProseMirror-focused"), t.domObserver.start(), t.focused = !0, setTimeout(() => {
    t.docView && t.hasFocus() && !t.domObserver.currentSelection.eq(t.domSelectionRange()) && ha(t);
  }, 20));
};
Pt.blur = (t, e) => {
  let n = e;
  t.focused && (t.domObserver.stop(), t.dom.classList.remove("ProseMirror-focused"), t.domObserver.start(), n.relatedTarget && t.dom.contains(n.relatedTarget) && t.domObserver.currentSelection.clear(), t.focused = !1);
};
Pt.beforeinput = (t, e) => {
  if (Jn && yi && e.inputType == "deleteContentBackward") {
    t.domObserver.flushSoon();
    let { domChangeCount: r } = t.input;
    setTimeout(() => {
      if (t.input.domChangeCount != r || (t.dom.blur(), t.focus(), t.someProp("handleKeyDown", (s) => s(t, yf(8, "Backspace")))))
        return;
      let { $cursor: i } = t.state.selection;
      i && i.pos > 0 && t.dispatch(t.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let t in mt)
  Pt[t] = mt[t];
function ui(t, e) {
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
class hs {
  constructor(e, n) {
    this.toDOM = e, this.spec = n || Vn, this.side = this.spec.side || 0;
  }
  map(e, n, r, i) {
    let { pos: s, deleted: o } = e.mapResult(n.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new ct(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof hs && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && ui(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class bn {
  constructor(e, n) {
    this.attrs = e, this.spec = n || Vn;
  }
  map(e, n, r, i) {
    let s = e.map(n.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(n.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new ct(s, o, this);
  }
  valid(e, n) {
    return n.from < n.to;
  }
  eq(e) {
    return this == e || e instanceof bn && ui(this.attrs, e.attrs) && ui(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof bn;
  }
  destroy() {
  }
}
class ya {
  constructor(e, n) {
    this.attrs = e, this.spec = n || Vn;
  }
  map(e, n, r, i) {
    let s = e.mapResult(n.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(n.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new ct(s.pos - r, o.pos - r, this);
  }
  valid(e, n) {
    let { index: r, offset: i } = e.content.findIndex(n.from), s;
    return i == n.from && !(s = e.child(r)).isText && i + s.nodeSize == n.to;
  }
  eq(e) {
    return this == e || e instanceof ya && ui(this.attrs, e.attrs) && ui(this.spec, e.spec);
  }
  destroy() {
  }
}
class ct {
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
    return new ct(e, n, this.type);
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
    return new ct(e, e, new hs(n, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, n, r, i) {
    return new ct(e, n, new bn(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, n, r, i) {
    return new ct(e, n, new ya(r, i));
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
    return this.type instanceof bn;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof hs;
  }
}
const rr = [], Vn = {};
class xe {
  /**
  @internal
  */
  constructor(e, n) {
    this.local = e.length ? e : rr, this.children = n.length ? n : rr;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, n) {
    return n.length ? ms(n, e, 0, Vn) : rt;
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
      let l = this.local[o];
      l.from <= n && l.to >= e && (!s || s(l.spec)) && r.push(l.copy(l.from + i, l.to + i));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < n && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, n - l, r, i + l, s);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, n, r) {
    return this == rt || e.maps.length == 0 ? this : this.mapInner(e, n, 0, 0, r || Vn);
  }
  /**
  @internal
  */
  mapInner(e, n, r, i, s) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, i);
      a && a.type.valid(n, a) ? (o || (o = [])).push(a) : s.onRemove && s.onRemove(this.local[l].spec);
    }
    return this.children.length ? d0(this.children, o || [], e, n, r, i, s) : o ? new xe(o.sort(Kn), rr) : rt;
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
    e.forEach((l, a) => {
      let c = a + r, d;
      if (d = Nf(n, l, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < a; )
          s += 3;
        i[s] == a ? i[s + 2] = i[s + 2].addInner(l, d, c + 1) : i.splice(s, 0, a, a + l.nodeSize, ms(d, l, c + 1, Vn)), s += 3;
      }
    });
    let o = If(s ? Lf(n) : n, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new xe(o.length ? this.local.concat(o).sort(Kn) : this.local, i || this.children);
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
      let o, l = r[s] + n, a = r[s + 1] + n;
      for (let d = 0, f; d < e.length; d++)
        (f = e[d]) && f.from > l && f.to < a && (e[d] = null, (o || (o = [])).push(f));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[s + 2].removeInner(o, l + 1);
      c != rt ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let l = 0; l < i.length; l++)
            i[l].eq(o, n) && (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
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
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let s = e + 1, o = s + n.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > s && a.type instanceof bn) {
        let c = Math.max(s, a.from) - s, d = Math.min(o, a.to) - s;
        c < d && (i || (i = [])).push(a.copy(c, d));
      }
    }
    if (i) {
      let l = new xe(i.sort(Kn), rr);
      return r ? new Nn([l, r]) : l;
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
    return ba(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == rt)
      return rr;
    if (e.inlineContent || !this.local.some(bn.is))
      return this.local;
    let n = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof bn || n.push(this.local[r]);
    return n;
  }
}
xe.empty = new xe([], []);
xe.removeOverlap = ba;
const rt = xe.empty;
class Nn {
  constructor(e) {
    this.members = e;
  }
  map(e, n) {
    const r = this.members.map((i) => i.map(e, n, Vn));
    return Nn.from(r);
  }
  forChild(e, n) {
    if (n.isLeaf)
      return xe.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, n);
      s != rt && (s instanceof Nn ? r = r.concat(s.members) : r.push(s));
    }
    return Nn.from(r);
  }
  eq(e) {
    if (!(e instanceof Nn) || e.members.length != this.members.length)
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
    return n ? ba(r ? n : n.sort(Kn)) : rr;
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
        return new Nn(e.every((n) => n instanceof xe) ? e : e.reduce((n, r) => n.concat(r instanceof xe ? r : r.members), []));
    }
  }
}
function d0(t, e, n, r, i, s, o) {
  let l = t.slice();
  for (let c = 0, d = s; c < n.maps.length; c++) {
    let f = 0;
    n.maps[c].forEach((h, g, y, v) => {
      let k = v - y - (g - h);
      for (let E = 0; E < l.length; E += 3) {
        let T = l[E + 1];
        if (T < 0 || h > T + d - f)
          continue;
        let j = l[E] + d - f;
        g >= j ? l[E + 1] = h <= j ? -2 : -1 : y >= i && k && (l[E] += k, l[E + 1] += k);
      }
      f += k;
    }), d = n.maps[c].map(d, -1);
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        a = !0, l[c + 1] = -1;
        continue;
      }
      let d = n.map(t[c] + s), f = d - i;
      if (f < 0 || f >= r.content.size) {
        a = !0;
        continue;
      }
      let h = n.map(t[c + 1] + s, -1), g = h - i, { index: y, offset: v } = r.content.findIndex(f), k = r.maybeChild(y);
      if (k && v == f && v + k.nodeSize == g) {
        let E = l[c + 2].mapInner(n, k, d + 1, t[c] + s + 1, o);
        E != rt ? (l[c] = f, l[c + 1] = g, l[c + 2] = E) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = f0(l, t, e, n, i, s, o), d = ms(c, r, 0, o);
    e = d.local;
    for (let f = 0; f < l.length; f += 3)
      l[f + 1] < 0 && (l.splice(f, 3), f -= 3);
    for (let f = 0, h = 0; f < d.children.length; f += 3) {
      let g = d.children[f];
      for (; h < l.length && l[h] < g; )
        h += 3;
      l.splice(h, 0, d.children[f], d.children[f + 1], d.children[f + 2]);
    }
  }
  return new xe(e.sort(Kn), l);
}
function If(t, e) {
  if (!e || !t.length)
    return t;
  let n = [];
  for (let r = 0; r < t.length; r++) {
    let i = t[r];
    n.push(new ct(i.from + e, i.to + e, i.type));
  }
  return n;
}
function f0(t, e, n, r, i, s, o) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let f = a.local[d].map(r, i, c);
      f ? n.push(f) : o.onRemove && o.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3)
      l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < t.length; a += 3)
    t[a + 1] == -1 && l(t[a + 2], e[a] + s + 1);
  return n;
}
function Nf(t, e, n) {
  if (e.isLeaf)
    return null;
  let r = n + e.nodeSize, i = null;
  for (let s = 0, o; s < t.length; s++)
    (o = t[s]) && o.from > n && o.to < r && ((i || (i = [])).push(o), t[s] = null);
  return i;
}
function Lf(t) {
  let e = [];
  for (let n = 0; n < t.length; n++)
    t[n] != null && e.push(t[n]);
  return e;
}
function ms(t, e, n, r) {
  let i = [], s = !1;
  e.forEach((l, a) => {
    let c = Nf(t, l, a + n);
    if (c) {
      s = !0;
      let d = ms(c, l, n + a + 1, r);
      d != rt && i.push(a, a + l.nodeSize, d);
    }
  });
  let o = If(s ? Lf(t) : t, -n).sort(Kn);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || i.length ? new xe(o, i) : rt;
}
function Kn(t, e) {
  return t.from - e.from || t.to - e.to;
}
function ba(t) {
  let e = t;
  for (let n = 0; n < e.length - 1; n++) {
    let r = e[n];
    if (r.from != r.to)
      for (let i = n + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == t && (e = t.slice()), e[i] = s.copy(s.from, r.to), Yc(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == t && (e = t.slice()), e[n] = r.copy(r.from, s.from), Yc(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Yc(t, e, n) {
  for (; e < t.length && Kn(n, t[e]) > 0; )
    e++;
  t.splice(e, 0, n);
}
var kn = {
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
}, gs = {
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
}, p0 = typeof navigator < "u" && /Mac/.test(navigator.platform), h0 = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Ve = 0; Ve < 10; Ve++)
  kn[48 + Ve] = kn[96 + Ve] = String(Ve);
for (var Ve = 1; Ve <= 24; Ve++)
  kn[Ve + 111] = "F" + Ve;
for (var Ve = 65; Ve <= 90; Ve++)
  kn[Ve] = String.fromCharCode(Ve + 32), gs[Ve] = String.fromCharCode(Ve);
for (var ko in kn)
  gs.hasOwnProperty(ko) || (gs[ko] = kn[ko]);
function m0(t) {
  var e = p0 && t.metaKey && t.shiftKey && !t.ctrlKey && !t.altKey || h0 && t.shiftKey && t.key && t.key.length == 1 || t.key == "Unidentified", n = !e && t.key || (t.shiftKey ? gs : kn)[t.keyCode] || t.key || "Unidentified";
  return n == "Esc" && (n = "Escape"), n == "Del" && (n = "Delete"), n == "Left" && (n = "ArrowLeft"), n == "Up" && (n = "ArrowUp"), n == "Right" && (n = "ArrowRight"), n == "Down" && (n = "ArrowDown"), n;
}
const g0 = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function y0(t) {
  let e = t.split(/-(?!$)/), n = e[e.length - 1];
  n == "Space" && (n = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      g0 ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), s && (n = "Shift-" + n), n;
}
function b0(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t)
    e[y0(n)] = t[n];
  return e;
}
function xo(t, e, n = !0) {
  return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), n && e.shiftKey && (t = "Shift-" + t), t;
}
function zf(t) {
  let e = b0(t);
  return function(n, r) {
    let i = m0(r), s, o = e[xo(i, r)];
    if (o && o(n.state, n.dispatch, n))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let l = e[xo(i, r, !1)];
        if (l && l(n.state, n.dispatch, n))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || i.charCodeAt(0) > 127) && (s = kn[r.keyCode]) && s != i) {
        let l = e[xo(s, r)];
        if (l && l(n.state, n.dispatch, n))
          return !0;
      }
    }
    return !1;
  };
}
const v0 = (t, e) => t.selection.empty ? !1 : (e && e(t.tr.deleteSelection().scrollIntoView()), !0);
function w0(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("backward", t) : n.parentOffset > 0) ? null : n;
}
const _0 = (t, e, n) => {
  let r = w0(t, n);
  if (!r)
    return !1;
  let i = Df(r);
  if (!i) {
    let o = r.blockRange(), l = o && Ir(o);
    return l == null ? !1 : (e && e(t.tr.lift(o, l).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (!s.type.spec.isolating && Hf(t, i, e))
    return !0;
  if (r.parent.content.size == 0 && (Ar(s, "end") || ee.isSelectable(s))) {
    let o = ca(t.doc, r.before(), r.after(), G.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = t.tr.step(o);
        l.setSelection(Ar(s, "end") ? re.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : ee.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(t.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function Ar(t, e, n = !1) {
  for (let r = t; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (n && r.childCount != 1)
      return !1;
  }
  return !1;
}
const k0 = (t, e, n) => {
  let { $head: r, empty: i } = t.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("backward", t) : r.parentOffset > 0)
      return !1;
    s = Df(r);
  }
  let o = s && s.nodeBefore;
  return !o || !ee.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(ee.create(t.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Df(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      if (t.index(e) > 0)
        return t.doc.resolve(t.before(e + 1));
      if (t.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function x0(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("forward", t) : n.parentOffset < n.parent.content.size) ? null : n;
}
const S0 = (t, e, n) => {
  let r = x0(t, n);
  if (!r)
    return !1;
  let i = Bf(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Hf(t, i, e))
    return !0;
  if (r.parent.content.size == 0 && (Ar(s, "start") || ee.isSelectable(s))) {
    let o = ca(t.doc, r.before(), r.after(), G.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = t.tr.step(o);
        l.setSelection(Ar(s, "start") ? re.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : ee.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(t.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, C0 = (t, e, n) => {
  let { $head: r, empty: i } = t.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("forward", t) : r.parentOffset < r.parent.content.size)
      return !1;
    s = Bf(r);
  }
  let o = s && s.nodeAfter;
  return !o || !ee.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(ee.create(t.doc, s.pos)).scrollIntoView()), !0);
};
function Bf(t) {
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
const E0 = (t, e) => {
  let n = t.selection, r = n instanceof ee, i;
  if (r) {
    if (n.node.isTextblock || !Sn(t.doc, n.from))
      return !1;
    i = n.from;
  } else if (i = Ys(t.doc, n.from, -1), i == null)
    return !1;
  if (e) {
    let s = t.tr.join(i);
    r && s.setSelection(ee.create(s.doc, i - t.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, M0 = (t, e) => {
  let n = t.selection, r;
  if (n instanceof ee) {
    if (n.node.isTextblock || !Sn(t.doc, n.to))
      return !1;
    r = n.to;
  } else if (r = Ys(t.doc, n.to, 1), r == null)
    return !1;
  return e && e(t.tr.join(r).scrollIntoView()), !0;
}, A0 = (t, e) => {
  let { $from: n, $to: r } = t.selection, i = n.blockRange(r), s = i && Ir(i);
  return s == null ? !1 : (e && e(t.tr.lift(i, s).scrollIntoView()), !0);
}, T0 = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (e && e(t.tr.insertText(`
`).scrollIntoView()), !0);
};
function $f(t) {
  for (let e = 0; e < t.edgeCount; e++) {
    let { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
const O0 = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  if (!n.parent.type.spec.code || !n.sameParent(r))
    return !1;
  let i = n.node(-1), s = n.indexAfter(-1), o = $f(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let l = n.after(), a = t.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(re.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, j0 = (t, e) => {
  let n = t.selection, { $from: r, $to: i } = n;
  if (n instanceof jt || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = $f(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, l = t.tr.insert(o, s.createAndFill());
    l.setSelection(ne.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, P0 = (t, e) => {
  let { $cursor: n } = t.selection;
  if (!n || n.parent.content.size)
    return !1;
  if (n.depth > 1 && n.after() != n.end(-1)) {
    let s = n.before();
    if (vr(t.doc, s))
      return e && e(t.tr.split(s).scrollIntoView()), !0;
  }
  let r = n.blockRange(), i = r && Ir(r);
  return i == null ? !1 : (e && e(t.tr.lift(r, i).scrollIntoView()), !0);
}, R0 = (t, e) => {
  let { $from: n, to: r } = t.selection, i, s = n.sharedDepth(r);
  return s == 0 ? !1 : (i = n.before(s), e && e(t.tr.setSelection(ee.create(t.doc, i))), !0);
};
function I0(t, e, n) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (n && n(t.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || Sn(t.doc, e.pos)) ? !1 : (n && n(t.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Hf(t, e, n) {
  let r = e.nodeBefore, i = e.nodeAfter, s, o;
  if (r.type.spec.isolating || i.type.spec.isolating)
    return !1;
  if (I0(t, e, n))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (s = (o = r.contentMatchAt(r.childCount)).findWrapping(i.type)) && o.matchType(s[0] || i.type).validEnd) {
    if (n) {
      let f = e.pos + i.nodeSize, h = H.empty;
      for (let v = s.length - 1; v >= 0; v--)
        h = H.from(s[v].create(null, h));
      h = H.from(r.copy(h));
      let g = t.tr.step(new $e(e.pos - 1, f, e.pos, f, new G(h, 1, 0), s.length, !0)), y = f + 2 * s.length;
      Sn(g.doc, y) && g.join(y), n(g.scrollIntoView());
    }
    return !0;
  }
  let a = re.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), d = c && Ir(c);
  if (d != null && d >= e.depth)
    return n && n(t.tr.lift(c, d).scrollIntoView()), !0;
  if (l && Ar(i, "start", !0) && Ar(r, "end")) {
    let f = r, h = [];
    for (; h.push(f), !f.isTextblock; )
      f = f.lastChild;
    let g = i, y = 1;
    for (; !g.isTextblock; g = g.firstChild)
      y++;
    if (f.canReplace(f.childCount, f.childCount, g.content)) {
      if (n) {
        let v = H.empty;
        for (let E = h.length - 1; E >= 0; E--)
          v = H.from(h[E].copy(v));
        let k = t.tr.step(new $e(e.pos - h.length, e.pos + i.nodeSize, e.pos + y, e.pos + i.nodeSize - y, new G(v, h.length, 0), 0, !0));
        n(k.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ff(t) {
  return function(e, n) {
    let r = e.selection, i = t < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (n && n(e.tr.setSelection(ne.create(e.doc, t < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const N0 = Ff(-1), L0 = Ff(1);
function z0(t, e = null) {
  return function(n, r) {
    let { $from: i, $to: s } = n.selection, o = i.blockRange(s), l = o && aa(o, t, e);
    return l ? (r && r(n.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Xc(t, e = null) {
  return function(n, r) {
    let i = !1;
    for (let s = 0; s < n.selection.ranges.length && !i; s++) {
      let { $from: { pos: o }, $to: { pos: l } } = n.selection.ranges[s];
      n.doc.nodesBetween(o, l, (a, c) => {
        if (i)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(t, e)))
          if (a.type == t)
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
        let { $from: { pos: l }, $to: { pos: a } } = n.selection.ranges[o];
        s.setBlockType(l, a, t, e);
      }
      r(s.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function D0(t, e = null) {
  return function(n, r) {
    let { $from: i, $to: s } = n.selection, o = i.blockRange(s), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && i.node(o.depth - 1).type.compatibleContent(t) && o.startIndex == 0) {
      if (i.index(o.depth - 1) == 0)
        return !1;
      let d = n.doc.resolve(o.start - 2);
      a = new nl(d, d, o.depth), o.endIndex < o.parent.childCount && (o = new nl(i, n.doc.resolve(s.end(o.depth)), o.depth)), l = !0;
    }
    let c = aa(a, t, e, o);
    return c ? (r && r(B0(n.tr, o, c, l, t).scrollIntoView()), !0) : !1;
  };
}
function B0(t, e, n, r, i) {
  let s = H.empty;
  for (let d = n.length - 1; d >= 0; d--)
    s = H.from(n[d].type.create(n[d].attrs, s));
  t.step(new $e(e.start - (r ? 2 : 0), e.end, e.start, e.end, new G(s, 0, 0), n.length, !0));
  let o = 0;
  for (let d = 0; d < n.length; d++)
    n[d].type == i && (o = d + 1);
  let l = n.length - o, a = e.start + n.length - (r ? 2 : 0), c = e.parent;
  for (let d = e.startIndex, f = e.endIndex, h = !0; d < f; d++, h = !1)
    !h && vr(t.doc, a, l) && (t.split(a, l), a += 2 * l), a += c.child(d).nodeSize;
  return t;
}
function $0(t) {
  return function(e, n) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == t);
    return s ? n ? r.node(s.depth - 1).type == t ? H0(e, n, t, s) : F0(e, n, s) : !0 : !1;
  };
}
function H0(t, e, n, r) {
  let i = t.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new $e(s - 1, o, s, o, new G(H.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new nl(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const l = Ir(r);
  if (l == null)
    return !1;
  i.lift(r, l);
  let a = i.mapping.map(s, -1) - 1;
  return Sn(i.doc, a) && i.join(a), e(i.scrollIntoView()), !0;
}
function F0(t, e, n) {
  let r = t.tr, i = n.parent;
  for (let g = n.end, y = n.endIndex - 1, v = n.startIndex; y > v; y--)
    g -= i.child(y).nodeSize, r.delete(g - 1, g + 1);
  let s = r.doc.resolve(n.start), o = s.nodeAfter;
  if (r.mapping.map(n.end) != n.start + s.nodeAfter.nodeSize)
    return !1;
  let l = n.startIndex == 0, a = n.endIndex == i.childCount, c = s.node(-1), d = s.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, o.content.append(a ? H.empty : H.from(i))))
    return !1;
  let f = s.pos, h = f + o.nodeSize;
  return r.step(new $e(f - (l ? 1 : 0), h + (a ? 1 : 0), f + 1, h - 1, new G((l ? H.empty : H.from(i.copy(H.empty))).append(a ? H.empty : H.from(i.copy(H.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function W0(t) {
  return function(e, n) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == t);
    if (!s)
      return !1;
    let o = s.startIndex;
    if (o == 0)
      return !1;
    let l = s.parent, a = l.child(o - 1);
    if (a.type != t)
      return !1;
    if (n) {
      let c = a.lastChild && a.lastChild.type == l.type, d = H.from(c ? t.create() : null), f = new G(H.from(t.create(null, H.from(l.type.create(null, d)))), c ? 3 : 1, 0), h = s.start, g = s.end;
      n(e.tr.step(new $e(h - (c ? 3 : 1), g, h, g, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Wf(t) {
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
class V0 {
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
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...d) => {
      const f = a(...d)(o);
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
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, l = [], a = !!e, c = e || s.tr, d = () => (!a && n && !c.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(c), l.every((h) => h === !0)), f = {
      ...Object.fromEntries(Object.entries(r).map(([h, g]) => [h, (...v) => {
        const k = this.buildProps(c, n), E = g(...v)(k);
        return l.push(E), f;
      }])),
      run: d
    };
    return f;
  }
  createCan(e) {
    const { rawCommands: n, state: r } = this, i = !1, s = e || r.tr, o = this.buildProps(s, i);
    return {
      ...Object.fromEntries(Object.entries(n).map(([a, c]) => [a, (...d) => c(...d)({ ...o, dispatch: void 0 })])),
      chain: () => this.createChain(s, i)
    };
  }
  buildProps(e, n = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, l = {
      tr: e,
      editor: i,
      view: o,
      state: Wf({
        state: s,
        transaction: e
      }),
      dispatch: n ? () => {
      } : void 0,
      chain: () => this.createChain(e, n),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([a, c]) => [a, (...d) => c(...d)(l)]));
      }
    };
    return l;
  }
}
function Pe(t, e, n) {
  return t.config[e] === void 0 && t.parent ? Pe(t.parent, e, n) : typeof t.config[e] == "function" ? t.config[e].bind({
    ...n,
    parent: t.parent ? Pe(t.parent, e, n) : null
  }) : t.config[e];
}
function K0(t) {
  const e = t.filter((i) => i.type === "extension"), n = t.filter((i) => i.type === "node"), r = t.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: n,
    markExtensions: r
  };
}
function Ke(t, e) {
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
    return Object.entries(n).forEach(([i, s]) => {
      if (!r[i]) {
        r[i] = s;
        return;
      }
      if (i === "class") {
        const l = s ? s.split(" ") : [], a = r[i] ? r[i].split(" ") : [], c = l.filter((d) => !a.includes(d));
        r[i] = [...a, ...c].join(" ");
      } else
        i === "style" ? r[i] = [r[i], s].join("; ") : r[i] = s;
    }), r;
  }, {});
}
function U0(t) {
  return typeof t == "function";
}
function Se(t, e = void 0, ...n) {
  return U0(t) ? e ? t.bind(e)(...n) : t(...n) : t;
}
function q0(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}
class bi {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
class G0 {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
function J0(t) {
  return Object.prototype.toString.call(t).slice(8, -1);
}
function So(t) {
  return J0(t) !== "Object" ? !1 : t.constructor === Object && Object.getPrototypeOf(t) === Object.prototype;
}
function eo(t, e) {
  const n = { ...t };
  return So(t) && So(e) && Object.keys(e).forEach((r) => {
    So(e[r]) ? r in t ? n[r] = eo(t[r], e[r]) : Object.assign(n, { [r]: e[r] }) : Object.assign(n, { [r]: e[r] });
  }), n;
}
class Ue {
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
    return new Ue(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = eo(this.options, e), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new Ue(e);
    return n.parent = this, this.child = n, n.name = e.name ? e.name : n.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = Se(Pe(n, "addOptions", {
      name: n.name
    })), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function Y0(t, e, n) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = n || {};
  let l = "", a = !0;
  return t.nodesBetween(r, i, (c, d, f, h) => {
    var g;
    const y = o?.[c.type.name];
    y ? (c.isBlock && !a && (l += s, a = !0), f && (l += y({
      node: c,
      pos: d,
      parent: f,
      index: h,
      range: e
    }))) : c.isText ? (l += (g = c?.text) === null || g === void 0 ? void 0 : g.slice(Math.max(r, d) - d, i - d), a = !1) : c.isBlock && !a && (l += s, a = !0);
  }), l;
}
function X0(t) {
  return Object.fromEntries(Object.entries(t.nodes).filter(([, e]) => e.spec.toText).map(([e, n]) => [e, n.spec.toText]));
}
Ue.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new et({
        key: new tt("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: t } = this, { state: e, schema: n } = t, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((d) => d.$from.pos)), l = Math.max(...s.map((d) => d.$to.pos)), a = X0(n);
            return Y0(r, { from: o, to: l }, {
              textSerializers: a
            });
          }
        }
      })
    ];
  }
});
const Q0 = () => ({ editor: t, view: e }) => (requestAnimationFrame(() => {
  var n;
  t.isDestroyed || (e.dom.blur(), (n = window?.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), Z0 = (t = !1) => ({ commands: e }) => e.setContent("", t), e2 = () => ({ state: t, tr: e, dispatch: n }) => {
  const { selection: r } = e, { ranges: i } = r;
  return n && i.forEach(({ $from: s, $to: o }) => {
    t.doc.nodesBetween(s.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: d } = e, f = c.resolve(d.map(a)), h = c.resolve(d.map(a + l.nodeSize)), g = f.blockRange(h);
      if (!g)
        return;
      const y = Ir(g);
      if (l.type.isTextblock) {
        const { defaultType: v } = f.parent.contentMatchAt(f.index());
        e.setNodeMarkup(g.start, v);
      }
      (y || y === 0) && e.lift(g, y);
    });
  }), !0;
}, t2 = (t) => (e) => t(e), n2 = () => ({ state: t, dispatch: e }) => j0(t, e), r2 = (t, e) => ({ editor: n, tr: r }) => {
  const { state: i } = n, s = i.doc.slice(t.from, t.to);
  r.deleteRange(t.from, t.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new ne(r.doc.resolve(o - 1))), !0;
}, i2 = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, r = n.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = t.selection.$anchor;
  for (let s = i.depth; s > 0; s -= 1)
    if (i.node(s).type === r.type) {
      if (e) {
        const l = i.before(s), a = i.after(s);
        t.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, s2 = (t) => ({ tr: e, state: n, dispatch: r }) => {
  const i = Ke(t, n.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const a = s.before(o), c = s.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, o2 = (t) => ({ tr: e, dispatch: n }) => {
  const { from: r, to: i } = t;
  return n && e.delete(r, i), !0;
}, l2 = () => ({ state: t, dispatch: e }) => v0(t, e), a2 = () => ({ commands: t }) => t.keyboardShortcut("Enter"), c2 = () => ({ state: t, dispatch: e }) => O0(t, e);
function ys(t, e, n = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => n.strict ? e[i] === t[i] : q0(e[i]) ? e[i].test(t[i]) : e[i] === t[i]) : !0;
}
function pl(t, e, n = {}) {
  return t.find((r) => r.type === e && ys(r.attrs, n));
}
function u2(t, e, n = {}) {
  return !!pl(t, e, n);
}
function va(t, e, n = {}) {
  if (!t || !e)
    return;
  let r = t.parent.childAfter(t.parentOffset);
  if (t.parentOffset === r.offset && r.offset !== 0 && (r = t.parent.childBefore(t.parentOffset)), !r.node)
    return;
  const i = pl([...r.node.marks], e, n);
  if (!i)
    return;
  let s = r.index, o = t.start() + r.offset, l = s + 1, a = o + r.node.nodeSize;
  for (pl([...r.node.marks], e, n); s > 0 && i.isInSet(t.parent.child(s - 1).marks); )
    s -= 1, o -= t.parent.child(s).nodeSize;
  for (; l < t.parent.childCount && u2([...t.parent.child(l).marks], e, n); )
    a += t.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function En(t, e) {
  if (typeof t == "string") {
    if (!e.marks[t])
      throw Error(`There is no mark type named '${t}'. Maybe you forgot to add the extension?`);
    return e.marks[t];
  }
  return t;
}
const d2 = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  const s = En(t, r.schema), { doc: o, selection: l } = n, { $from: a, from: c, to: d } = l;
  if (i) {
    const f = va(a, s, e);
    if (f && f.from <= c && f.to >= d) {
      const h = ne.create(o, f.from, f.to);
      n.setSelection(h);
    }
  }
  return !0;
}, f2 = (t) => (e) => {
  const n = typeof t == "function" ? t(e) : t;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](e))
      return !0;
  return !1;
};
function Vf(t) {
  return t instanceof ne;
}
function $n(t = 0, e = 0, n = 0) {
  return Math.min(Math.max(t, e), n);
}
function p2(t, e = null) {
  if (!e)
    return null;
  const n = re.atStart(t), r = re.atEnd(t);
  if (e === "start" || e === !0)
    return n;
  if (e === "end")
    return r;
  const i = n.from, s = r.to;
  return e === "all" ? ne.create(t, $n(0, i, s), $n(t.content.size, i, s)) : ne.create(t, $n(e, i, s), $n(e, i, s));
}
function wa() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const h2 = (t = null, e = {}) => ({ editor: n, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    wa() && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), e?.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && t === null || t === !1)
    return !0;
  if (s && t === null && !Vf(n.state.selection))
    return o(), !0;
  const l = p2(i.doc, t) || n.state.selection, a = n.state.selection.eq(l);
  return s && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, m2 = (t, e) => (n) => t.every((r, i) => e(r, { ...n, index: i })), g2 = (t, e) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, t, e);
function Qc(t) {
  const e = `<body>${t}</body>`;
  return new window.DOMParser().parseFromString(e, "text/html").body;
}
function bs(t, e, n) {
  if (n = {
    slice: !0,
    parseOptions: {},
    ...n
  }, typeof t == "object" && t !== null)
    try {
      return Array.isArray(t) && t.length > 0 ? H.fromArray(t.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(t);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", t, "Error:", r), bs("", e, n);
    }
  if (typeof t == "string") {
    const r = Yd.fromSchema(e);
    return n.slice ? r.parseSlice(Qc(t), n.parseOptions).content : r.parse(Qc(t), n.parseOptions);
  }
  return bs("", e, n);
}
function y2(t, e, n) {
  const r = t.steps.length - 1;
  if (r < e)
    return;
  const i = t.steps[r];
  if (!(i instanceof We || i instanceof $e))
    return;
  const s = t.mapping.maps[r];
  let o = 0;
  s.forEach((l, a, c, d) => {
    o === 0 && (o = d);
  }), t.setSelection(re.near(t.doc.resolve(o), n));
}
const b2 = (t) => t.toString().startsWith("<"), v2 = (t, e, n) => ({ tr: r, dispatch: i, editor: s }) => {
  if (i) {
    n = {
      parseOptions: {},
      updateSelection: !0,
      ...n
    };
    const o = bs(e, s.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...n.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof t == "number" ? { from: t, to: t } : { from: t.from, to: t.to }, c = !0, d = !0;
    if ((b2(o) ? o : [o]).forEach((h) => {
      h.check(), c = c ? h.isText && h.marks.length === 0 : !1, d = d ? h.isBlock : !1;
    }), l === a && d) {
      const { parent: h } = r.doc.resolve(l);
      h.isTextblock && !h.type.spec.code && !h.childCount && (l -= 1, a += 1);
    }
    c ? Array.isArray(e) ? r.insertText(e.map((h) => h.text || "").join(""), l, a) : typeof e == "object" && e && e.text ? r.insertText(e.text, l, a) : r.insertText(e, l, a) : r.replaceWith(l, a, o), n.updateSelection && y2(r, r.steps.length - 1, -1);
  }
  return !0;
}, w2 = () => ({ state: t, dispatch: e }) => E0(t, e), _2 = () => ({ state: t, dispatch: e }) => M0(t, e), k2 = () => ({ state: t, dispatch: e }) => _0(t, e), x2 = () => ({ state: t, dispatch: e }) => S0(t, e), S2 = () => ({ tr: t, state: e, dispatch: n }) => {
  try {
    const r = Ys(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), n && n(t), !0);
  } catch {
    return !1;
  }
}, C2 = () => ({ state: t, dispatch: e, tr: n }) => {
  try {
    const r = Ys(t.doc, t.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), e && e(n), !0);
  } catch {
    return !1;
  }
};
function _a() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function E2(t) {
  const e = t.split(/-(?!$)/);
  let n = e[e.length - 1];
  n === "Space" && (n = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      wa() || _a() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (n = `Alt-${n}`), i && (n = `Ctrl-${n}`), o && (n = `Meta-${n}`), s && (n = `Shift-${n}`), n;
}
const M2 = (t) => ({ editor: e, view: n, tr: r, dispatch: i }) => {
  const s = E2(t).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    n.someProp("handleKeyDown", (c) => c(n, l));
  });
  return a?.steps.forEach((c) => {
    const d = c.map(r.mapping);
    d && i && r.maybeStep(d);
  }), !0;
};
function ka(t, e, n = {}) {
  const { from: r, to: i, empty: s } = t.selection, o = e ? Ke(e, t.schema) : null, l = [];
  t.doc.nodesBetween(r, i, (f, h) => {
    if (f.isText)
      return;
    const g = Math.max(r, h), y = Math.min(i, h + f.nodeSize);
    l.push({
      node: f,
      from: g,
      to: y
    });
  });
  const a = i - r, c = l.filter((f) => o ? o.name === f.node.type.name : !0).filter((f) => ys(f.node.attrs, n, { strict: !1 }));
  return s ? !!c.length : c.reduce((f, h) => f + h.to - h.from, 0) >= a;
}
const A2 = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const i = Ke(t, n.schema);
  return ka(n, i, e) ? A0(n, r) : !1;
}, T2 = () => ({ state: t, dispatch: e }) => P0(t, e), O2 = (t) => ({ state: e, dispatch: n }) => {
  const r = Ke(t, e.schema);
  return $0(r)(e, n);
}, j2 = () => ({ state: t, dispatch: e }) => T0(t, e);
function xa(t, e) {
  return e.nodes[t] ? "node" : e.marks[t] ? "mark" : null;
}
function Zc(t, e) {
  const n = typeof e == "string" ? [e] : e;
  return Object.keys(t).reduce((r, i) => (n.includes(i) || (r[i] = t[i]), r), {});
}
const P2 = (t, e) => ({ tr: n, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = xa(typeof t == "string" ? t : t.name, r.schema);
  return l ? (l === "node" && (s = Ke(t, r.schema)), l === "mark" && (o = En(t, r.schema)), i && n.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
      s && s === c.type && n.setNodeMarkup(d, void 0, Zc(c.attrs, e)), o && c.marks.length && c.marks.forEach((f) => {
        o === f.type && n.addMark(d, d + c.nodeSize, o.create(Zc(f.attrs, e)));
      });
    });
  }), !0) : !1;
}, R2 = () => ({ tr: t, dispatch: e }) => (e && t.scrollIntoView(), !0), I2 = () => ({ tr: t, commands: e }) => e.setTextSelection({
  from: 0,
  to: t.doc.content.size
}), N2 = () => ({ state: t, dispatch: e }) => k0(t, e), L2 = () => ({ state: t, dispatch: e }) => C0(t, e), z2 = () => ({ state: t, dispatch: e }) => R0(t, e), D2 = () => ({ state: t, dispatch: e }) => L0(t, e), B2 = () => ({ state: t, dispatch: e }) => N0(t, e);
function $2(t, e, n = {}) {
  return bs(t, e, { slice: !1, parseOptions: n });
}
const H2 = (t, e = !1, n = {}) => ({ tr: r, editor: i, dispatch: s }) => {
  const { doc: o } = r, l = $2(t, i.schema, n);
  return s && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function vi(t, e) {
  const n = En(e, t.schema), { from: r, to: i, empty: s } = t.selection, o = [];
  s ? (t.storedMarks && o.push(...t.storedMarks), o.push(...t.selection.$head.marks())) : t.doc.nodesBetween(r, i, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === n.name);
  return l ? { ...l.attrs } : {};
}
function F2(t, e) {
  const n = new df(t);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      n.step(i);
    });
  }), n;
}
function W2(t) {
  for (let e = 0; e < t.edgeCount; e += 1) {
    const { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
function V2(t, e, n) {
  const r = [];
  return t.nodesBetween(e.from, e.to, (i, s) => {
    n(i) && r.push({
      node: i,
      pos: s
    });
  }), r;
}
function Kf(t, e) {
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
function Sa(t) {
  return (e) => Kf(e.$from, t);
}
function K2(t, e) {
  const n = Ke(e, t.schema), { from: r, to: i } = t.selection, s = [];
  t.doc.nodesBetween(r, i, (l) => {
    s.push(l);
  });
  const o = s.reverse().find((l) => l.type.name === n.name);
  return o ? { ...o.attrs } : {};
}
function U2(t, e) {
  const n = xa(typeof e == "string" ? e : e.name, t.schema);
  return n === "node" ? K2(t, e) : n === "mark" ? vi(t, e) : {};
}
function q2(t, e = JSON.stringify) {
  const n = {};
  return t.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(n, i) ? !1 : n[i] = !0;
  });
}
function G2(t) {
  const e = q2(t);
  return e.length === 1 ? e : e.filter((n, r) => !e.filter((s, o) => o !== r).some((s) => n.oldRange.from >= s.oldRange.from && n.oldRange.to <= s.oldRange.to && n.newRange.from >= s.newRange.from && n.newRange.to <= s.newRange.to));
}
function J2(t) {
  const { mapping: e, steps: n } = t, r = [];
  return e.maps.forEach((i, s) => {
    const o = [];
    if (i.ranges.length)
      i.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = n[s];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(s).map(l, -1), d = e.slice(s).map(a), f = e.invert().map(c, -1), h = e.invert().map(d);
      r.push({
        oldRange: {
          from: f,
          to: h
        },
        newRange: {
          from: c,
          to: d
        }
      });
    });
  }), G2(r);
}
function Ca(t, e, n) {
  const r = [];
  return t === e ? n.resolve(t).marks().forEach((i) => {
    const s = n.resolve(t - 1), o = va(s, i.type);
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
function Ui(t, e, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const i = t.find((s) => s.type === e && s.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function Y2(t, e, n = {}) {
  const { empty: r, ranges: i } = t.selection, s = e ? En(e, t.schema) : null;
  if (r)
    return !!(t.storedMarks || t.selection.$from.marks()).filter((f) => s ? s.name === f.type.name : !0).find((f) => ys(f.attrs, n, { strict: !1 }));
  let o = 0;
  const l = [];
  if (i.forEach(({ $from: f, $to: h }) => {
    const g = f.pos, y = h.pos;
    t.doc.nodesBetween(g, y, (v, k) => {
      if (!v.isText && !v.marks.length)
        return;
      const E = Math.max(g, k), T = Math.min(y, k + v.nodeSize), j = T - E;
      o += j, l.push(...v.marks.map((u) => ({
        mark: u,
        from: E,
        to: T
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((f) => s ? s.name === f.mark.type.name : !0).filter((f) => ys(f.mark.attrs, n, { strict: !1 })).reduce((f, h) => f + h.to - h.from, 0), c = l.filter((f) => s ? f.mark.type !== s && f.mark.type.excludes(s) : !0).reduce((f, h) => f + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function eu(t, e) {
  const { nodeExtensions: n } = K0(e), r = n.find((o) => o.name === t);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = Se(Pe(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function X2(t, e, n) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (Vf(i) && (s = i.$cursor), s) {
    const l = (r = t.storedMarks) !== null && r !== void 0 ? r : s.marks();
    return !!n.isInSet(l) || !l.some((a) => a.type.excludes(n));
  }
  const { ranges: o } = i;
  return o.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? t.doc.inlineContent && t.doc.type.allowsMarkType(n) : !1;
    return t.doc.nodesBetween(l.pos, a.pos, (d, f, h) => {
      if (c)
        return !1;
      if (d.isInline) {
        const g = !h || h.type.allowsMarkType(n), y = !!n.isInSet(d.marks) || !d.marks.some((v) => v.type.excludes(n));
        c = g && y;
      }
      return !c;
    }), c;
  });
}
const Q2 = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  const { selection: s } = n, { empty: o, ranges: l } = s, a = En(t, r.schema);
  if (i)
    if (o) {
      const c = vi(r, a);
      n.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const d = c.$from.pos, f = c.$to.pos;
        r.doc.nodesBetween(d, f, (h, g) => {
          const y = Math.max(g, d), v = Math.min(g + h.nodeSize, f);
          h.marks.find((E) => E.type === a) ? h.marks.forEach((E) => {
            a === E.type && n.addMark(y, v, a.create({
              ...E.attrs,
              ...e
            }));
          }) : n.addMark(y, v, a.create(e));
        });
      });
  return X2(r, n, a);
}, Z2 = (t, e) => ({ tr: n }) => (n.setMeta(t, e), !0), ey = (t, e = {}) => ({ state: n, dispatch: r, chain: i }) => {
  const s = Ke(t, n.schema);
  return s.isTextblock ? i().command(({ commands: o }) => Xc(s, e)(n) ? !0 : o.clearNodes()).command(({ state: o }) => Xc(s, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, ty = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, i = $n(t, 0, r.content.size), s = ee.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, ny = (t) => ({ tr: e, dispatch: n }) => {
  if (n) {
    const { doc: r } = e, { from: i, to: s } = typeof t == "number" ? { from: t, to: t } : t, o = ne.atStart(r).from, l = ne.atEnd(r).to, a = $n(i, o, l), c = $n(s, o, l), d = ne.create(r, a, c);
    e.setSelection(d);
  }
  return !0;
}, ry = (t) => ({ state: e, dispatch: n }) => {
  const r = Ke(t, e.schema);
  return W0(r)(e, n);
};
function tu(t, e) {
  const n = t.storedMarks || t.selection.$to.parentOffset && t.selection.$from.marks();
  if (n) {
    const r = n.filter((i) => e?.includes(i.type.name));
    t.tr.ensureMarks(r);
  }
}
const iy = ({ keepMarks: t = !0 } = {}) => ({ tr: e, state: n, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: l, $to: a } = s, c = i.extensionManager.attributes, d = Ui(c, l.node().type.name, l.node().attrs);
  if (s instanceof ee && s.node.isBlock)
    return !l.parentOffset || !vr(o, l.pos) ? !1 : (r && (t && tu(n, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const f = a.parentOffset === a.parent.content.size;
    s instanceof ne && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : W2(l.node(-1).contentMatchAt(l.indexAfter(-1)));
    let g = f && h ? [
      {
        type: h,
        attrs: d
      }
    ] : void 0, y = vr(e.doc, e.mapping.map(l.pos), 1, g);
    if (!g && !y && vr(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (y = !0, g = h ? [
      {
        type: h,
        attrs: d
      }
    ] : void 0), y && (e.split(e.mapping.map(l.pos), 1, g), h && !f && !l.parentOffset && l.parent.type !== h)) {
      const v = e.mapping.map(l.before()), k = e.doc.resolve(v);
      l.node(-1).canReplaceWith(k.index(), k.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    t && tu(n, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, sy = (t) => ({ tr: e, state: n, dispatch: r, editor: i }) => {
  var s;
  const o = Ke(t, n.schema), { $from: l, $to: a } = n.selection, c = n.selection.node;
  if (c && c.isBlock || l.depth < 2 || !l.sameParent(a))
    return !1;
  const d = l.node(-1);
  if (d.type !== o)
    return !1;
  const f = i.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== o || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (r) {
      let k = H.empty;
      const E = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let b = l.depth - E; b >= l.depth - 3; b -= 1)
        k = H.from(l.node(b).copy(k));
      const T = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, j = Ui(f, l.node().type.name, l.node().attrs), u = ((s = o.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(j)) || void 0;
      k = k.append(H.from(o.createAndFill(null, u) || void 0));
      const m = l.before(l.depth - (E - 1));
      e.replace(m, l.after(-T), new G(k, 4 - E, 0));
      let p = -1;
      e.doc.nodesBetween(m, e.doc.content.size, (b, w) => {
        if (p > -1)
          return !1;
        b.isTextblock && b.content.size === 0 && (p = w + 1);
      }), p > -1 && e.setSelection(ne.near(e.doc.resolve(p))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null, g = Ui(f, d.type.name, d.attrs), y = Ui(f, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const v = h ? [
    { type: o, attrs: g },
    { type: h, attrs: y }
  ] : [{ type: o, attrs: g }];
  if (!vr(e.doc, l.pos, 2))
    return !1;
  if (r) {
    const { selection: k, storedMarks: E } = n, { splittableMarks: T } = i.extensionManager, j = E || k.$to.parentOffset && k.$from.marks();
    if (e.split(l.pos, 2, v).scrollIntoView(), !j || !r)
      return !0;
    const u = j.filter((m) => T.includes(m.type.name));
    e.ensureMarks(u);
  }
  return !0;
}, Co = (t, e) => {
  const n = Sa((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const i = t.doc.nodeAt(r);
  return n.node.type === i?.type && Sn(t.doc, n.pos) && t.join(n.pos), !0;
}, Eo = (t, e) => {
  const n = Sa((o) => o.type === e)(t.selection);
  if (!n)
    return !0;
  const r = t.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const i = t.doc.nodeAt(r);
  return n.node.type === i?.type && Sn(t.doc, r) && t.join(r), !0;
}, oy = (t, e, n, r = {}) => ({ editor: i, tr: s, state: o, dispatch: l, chain: a, commands: c, can: d }) => {
  const { extensions: f, splittableMarks: h } = i.extensionManager, g = Ke(t, o.schema), y = Ke(e, o.schema), { selection: v, storedMarks: k } = o, { $from: E, $to: T } = v, j = E.blockRange(T), u = k || v.$to.parentOffset && v.$from.marks();
  if (!j)
    return !1;
  const m = Sa((p) => eu(p.type.name, f))(v);
  if (j.depth >= 1 && m && j.depth - m.depth <= 1) {
    if (m.node.type === g)
      return c.liftListItem(y);
    if (eu(m.node.type.name, f) && g.validContent(m.node.content) && l)
      return a().command(() => (s.setNodeMarkup(m.pos, g), !0)).command(() => Co(s, g)).command(() => Eo(s, g)).run();
  }
  return !n || !u || !l ? a().command(() => d().wrapInList(g, r) ? !0 : c.clearNodes()).wrapInList(g, r).command(() => Co(s, g)).command(() => Eo(s, g)).run() : a().command(() => {
    const p = d().wrapInList(g, r), b = u.filter((w) => h.includes(w.type.name));
    return s.ensureMarks(b), p ? !0 : c.clearNodes();
  }).wrapInList(g, r).command(() => Co(s, g)).command(() => Eo(s, g)).run();
}, ly = (t, e = {}, n = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = n, o = En(t, r.schema);
  return Y2(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, ay = (t, e, n = {}) => ({ state: r, commands: i }) => {
  const s = Ke(t, r.schema), o = Ke(e, r.schema);
  return ka(r, s, n) ? i.setNode(o) : i.setNode(s, n);
}, cy = (t, e = {}) => ({ state: n, commands: r }) => {
  const i = Ke(t, n.schema);
  return ka(n, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, uy = () => ({ state: t, dispatch: e }) => {
  const n = t.plugins;
  for (let r = 0; r < n.length; r += 1) {
    const i = n[r];
    let s;
    if (i.spec.isInputRules && (s = i.getState(t))) {
      if (e) {
        const o = t.tr, l = s.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (s.text) {
          const a = o.doc.resolve(s.from).marks();
          o.replaceWith(s.from, s.to, t.schema.text(s.text, a));
        } else
          o.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, dy = () => ({ tr: t, dispatch: e }) => {
  const { selection: n } = t, { empty: r, ranges: i } = n;
  return r || e && i.forEach((s) => {
    t.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, fy = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = n, a = En(t, r.schema), { $from: c, empty: d, ranges: f } = l;
  if (!i)
    return !0;
  if (d && o) {
    let { from: h, to: g } = l;
    const y = (s = c.marks().find((k) => k.type === a)) === null || s === void 0 ? void 0 : s.attrs, v = va(c, a, y);
    v && (h = v.from, g = v.to), n.removeMark(h, g, a);
  } else
    f.forEach((h) => {
      n.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return n.removeStoredMark(a), !0;
}, py = (t, e = {}) => ({ tr: n, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = xa(typeof t == "string" ? t : t.name, r.schema);
  return l ? (l === "node" && (s = Ke(t, r.schema)), l === "mark" && (o = En(t, r.schema)), i && n.selection.ranges.forEach((a) => {
    const c = a.$from.pos, d = a.$to.pos;
    r.doc.nodesBetween(c, d, (f, h) => {
      s && s === f.type && n.setNodeMarkup(h, void 0, {
        ...f.attrs,
        ...e
      }), o && f.marks.length && f.marks.forEach((g) => {
        if (o === g.type) {
          const y = Math.max(h, c), v = Math.min(h + f.nodeSize, d);
          n.addMark(y, v, o.create({
            ...g.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, hy = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const i = Ke(t, n.schema);
  return z0(i, e)(n, r);
}, my = (t, e = {}) => ({ state: n, dispatch: r }) => {
  const i = Ke(t, n.schema);
  return D0(i, e)(n, r);
};
var gy = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Q0,
  clearContent: Z0,
  clearNodes: e2,
  command: t2,
  createParagraphNear: n2,
  cut: r2,
  deleteCurrentNode: i2,
  deleteNode: s2,
  deleteRange: o2,
  deleteSelection: l2,
  enter: a2,
  exitCode: c2,
  extendMarkRange: d2,
  first: f2,
  focus: h2,
  forEach: m2,
  insertContent: g2,
  insertContentAt: v2,
  joinUp: w2,
  joinDown: _2,
  joinBackward: k2,
  joinForward: x2,
  joinItemBackward: S2,
  joinItemForward: C2,
  keyboardShortcut: M2,
  lift: A2,
  liftEmptyBlock: T2,
  liftListItem: O2,
  newlineInCode: j2,
  resetAttributes: P2,
  scrollIntoView: R2,
  selectAll: I2,
  selectNodeBackward: N2,
  selectNodeForward: L2,
  selectParentNode: z2,
  selectTextblockEnd: D2,
  selectTextblockStart: B2,
  setContent: H2,
  setMark: Q2,
  setMeta: Z2,
  setNode: ey,
  setNodeSelection: ty,
  setTextSelection: ny,
  sinkListItem: ry,
  splitBlock: iy,
  splitListItem: sy,
  toggleList: oy,
  toggleMark: ly,
  toggleNode: ay,
  toggleWrap: cy,
  undoInputRule: uy,
  unsetAllMarks: dy,
  unsetMark: fy,
  updateAttributes: py,
  wrapIn: hy,
  wrapInList: my
});
Ue.create({
  name: "commands",
  addCommands() {
    return {
      ...gy
    };
  }
});
Ue.create({
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
Ue.create({
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
Ue.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const t = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: d, $anchor: f } = a, { pos: h, parent: g } = f, y = f.parent.isTextblock ? l.doc.resolve(h - 1) : f, v = y.parent.type.spec.isolating, k = f.pos - f.parentOffset, E = v && y.parent.childCount === 1 ? k === f.pos : re.atStart(c).from === h;
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
    return wa() || _a() ? s : i;
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
          const { empty: i, from: s, to: o } = e.selection, l = re.atStart(e.doc).from, a = re.atEnd(e.doc).to;
          if (i || !(s === l && o === a) || !(n.doc.textBetween(0, n.doc.content.size, " ", " ").length === 0))
            return;
          const f = n.tr, h = Wf({
            state: n,
            transaction: f
          }), { commands: g } = new V0({
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
Ue.create({
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
function Un(t) {
  return new bi({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const i = Se(t.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: s } = e, o = r[r.length - 1], l = r[0];
      if (o) {
        const a = l.search(/\S/), c = n.from + l.indexOf(o), d = c + o.length;
        if (Ca(n.from, n.to, e.doc).filter((g) => g.mark.type.excluded.find((v) => v === t.type && v !== g.mark.type)).filter((g) => g.to > c).length)
          return null;
        d < n.to && s.delete(d, n.to), c > n.from && s.delete(n.from + a, c);
        const h = n.from + a + o.length;
        s.addMark(n.from + a, h, t.type.create(i || {})), s.removeStoredMark(t.type);
      }
    }
  });
}
function Uf(t) {
  return new bi({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      const i = Se(t.getAttributes, void 0, r) || {}, { tr: s } = e, o = n.from;
      let l = n.to;
      const a = t.type.create(i);
      if (r[1]) {
        const c = r[0].lastIndexOf(r[1]);
        let d = o + c;
        d > l ? d = l : l = d + r[1].length;
        const f = r[0][r[0].length - 1];
        s.insertText(f, o + r[0].length - 1), s.replaceWith(d, l, a);
      } else
        r[0] && s.insert(o - 1, t.type.create(i)).delete(s.mapping.map(o), s.mapping.map(l));
      s.scrollIntoView();
    }
  });
}
function hl(t) {
  return new bi({
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
  return new bi({
    find: t.find,
    handler: ({ state: e, range: n, match: r }) => {
      let i = t.replace, s = n.from;
      const o = n.to;
      if (r[1]) {
        const l = r[0].lastIndexOf(r[1]);
        i += r[0].slice(l + r[1].length), s += l;
        const a = s - o;
        a > 0 && (i = r[0].slice(l - a, l) + i, s = o);
      }
      e.tr.insertText(i, s, o);
    }
  });
}
function di(t) {
  return new bi({
    find: t.find,
    handler: ({ state: e, range: n, match: r, chain: i }) => {
      const s = Se(t.getAttributes, void 0, r) || {}, o = e.tr.delete(n.from, n.to), a = o.doc.resolve(n.from).blockRange(), c = a && aa(a, t.type, s);
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
        i().updateAttributes(f, s).run();
      }
      const d = o.doc.resolve(n.from - 1).nodeBefore;
      d && d.type === t.type && Sn(o.doc, n.from - 1) && (!t.joinPredicate || t.joinPredicate(r, d)) && o.join(n.from - 1);
    }
  });
}
class kt {
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
    return new kt(e);
  }
  configure(e = {}) {
    const n = this.extend();
    return n.options = eo(this.options, e), n.storage = Se(Pe(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
  extend(e = {}) {
    const n = new kt(e);
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
      const a = o.find((c) => c?.type.name === n.name);
      return a && r.removeStoredMark(a), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
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
    return n.options = eo(this.options, e), n.storage = Se(Pe(n, "addStorage", {
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
function xn(t) {
  return new G0({
    find: t.find,
    handler: ({ state: e, range: n, match: r, pasteEvent: i }) => {
      const s = Se(t.getAttributes, void 0, r, i);
      if (s === !1 || s === null)
        return null;
      const { tr: o } = e, l = r[r.length - 1], a = r[0];
      let c = n.to;
      if (l) {
        const d = a.search(/\S/), f = n.from + a.indexOf(l), h = f + l.length;
        if (Ca(n.from, n.to, e.doc).filter((y) => y.mark.type.excluded.find((k) => k === t.type && k !== y.mark.type)).filter((y) => y.to > f).length)
          return null;
        h < n.to && o.delete(h, n.to), f > n.from && o.delete(n.from + d, f), c = n.from + d + l.length, o.addMark(n.from + d, c, t.type.create(s || {})), o.removeStoredMark(t.type);
      }
    }
  });
}
function yy(t) {
  return t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
const by = /^\s*>\s$/, vy = Ce.create({
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
      di({
        find: by,
        type: this.type
      })
    ];
  }
}), wy = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/, _y = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g, ky = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/, xy = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g, Sy = kt.create({
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
      Un({
        find: wy,
        type: this.type
      }),
      Un({
        find: ky,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      xn({
        find: _y,
        type: this.type
      }),
      xn({
        find: xy,
        type: this.type
      })
    ];
  }
}), Cy = Ce.create({
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
}), nu = kt.create({
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
        const n = vi(t, this.type);
        return Object.entries(n).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), ru = /^\s*([-+*])\s$/, Ey = Ce.create({
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
      toggleBulletList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(Cy.name, this.editor.getAttributes(nu.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let t = di({
      find: ru,
      type: this.type
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = di({
      find: ru,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: () => this.editor.getAttributes(nu.name),
      editor: this.editor
    })), [
      t
    ];
  }
}), My = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/, Ay = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g, Ty = kt.create({
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
      Un({
        find: My,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      xn({
        find: Ay,
        type: this.type
      })
    ];
  }
}), Oy = /^```([a-z]+)?[\s\n]$/, jy = /^~~~([a-z]+)?[\s\n]$/, Py = Ce.create({
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
        const { state: e } = t, { selection: n } = e, { $from: r, empty: i } = n;
        if (!i || r.parent.type !== this.type)
          return !1;
        const s = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !s || !o ? !1 : t.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: t }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = t, { selection: n, doc: r } = e, { $from: i, empty: s } = n;
        if (!s || i.parent.type !== this.type || !(i.parentOffset === i.parent.nodeSize - 2))
          return !1;
        const l = i.after();
        return l === void 0 || r.nodeAt(l) ? !1 : t.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      hl({
        find: Oy,
        type: this.type,
        getAttributes: (t) => ({
          language: t[1]
        })
      }),
      hl({
        find: jy,
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
            return o.replaceSelectionWith(this.type.create({ language: s })), o.setSelection(ne.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(n.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), t.dispatch(o), !0;
          }
        }
      })
    ];
  }
}), Ry = Ce.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function Iy(t = {}) {
  return new et({
    view(e) {
      return new Ny(e, t);
    }
  });
}
class Ny {
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
      let l = e.nodeBefore, a = e.nodeAfter;
      if (l || a) {
        let c = this.editorView.nodeDOM(this.cursorPos - (l ? l.nodeSize : 0));
        if (c) {
          let d = c.getBoundingClientRect(), f = l ? d.bottom : d.top;
          l && a && (f = (f + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), r = { left: d.left, right: d.right, top: f - this.width / 2, bottom: f + this.width / 2 };
        }
      }
    }
    if (!r) {
      let l = this.editorView.coordsAtPos(this.cursorPos);
      r = { left: l.left - this.width / 2, right: l.left + this.width / 2, top: l.top, bottom: l.bottom };
    }
    let i = this.editorView.dom.offsetParent;
    this.element || (this.element = i.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", n), this.element.classList.toggle("prosemirror-dropcursor-inline", !n);
    let s, o;
    if (!i || i == document.body && getComputedStyle(i).position == "static")
      s = -pageXOffset, o = -pageYOffset;
    else {
      let l = i.getBoundingClientRect();
      s = l.left - i.scrollLeft, o = l.top - i.scrollTop;
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
        let l = of(this.editorView.state.doc, o, this.editorView.dragging.slice);
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
const Ly = Ue.create({
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
      Iy(this.options)
    ];
  }
});
class Ae extends re {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    return Ae.valid(r) ? new Ae(r) : re.near(r);
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
    return new Ea(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let n = e.parent;
    if (n.isTextblock || !zy(e) || !Dy(e))
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
          let l = e.node(o);
          if (n > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
            s = l.child(n > 0 ? e.indexAfter(o) : e.index(o) - 1);
            break;
          } else if (o == 0)
            return null;
          i += n;
          let a = e.doc.resolve(i);
          if (Ae.valid(a))
            return a;
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
          let l = e.doc.resolve(i);
          if (Ae.valid(l))
            return l;
        }
        return null;
      }
  }
}
Ae.prototype.visible = !1;
Ae.findFrom = Ae.findGapCursorFrom;
re.jsonID("gapcursor", Ae);
class Ea {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new Ea(e.map(this.pos));
  }
  resolve(e) {
    let n = e.resolve(this.pos);
    return Ae.valid(n) ? new Ae(n) : re.near(n);
  }
}
function zy(t) {
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
function Dy(t) {
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
function By() {
  return new et({
    props: {
      decorations: Wy,
      createSelectionBetween(t, e, n) {
        return e.pos == n.pos && Ae.valid(n) ? new Ae(n) : null;
      },
      handleClick: Hy,
      handleKeyDown: $y,
      handleDOMEvents: { beforeinput: Fy }
    }
  });
}
const $y = zf({
  ArrowLeft: ji("horiz", -1),
  ArrowRight: ji("horiz", 1),
  ArrowUp: ji("vert", -1),
  ArrowDown: ji("vert", 1)
});
function ji(t, e) {
  const n = t == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, s) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof ne) {
      if (!s.endOfTextblock(n) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = Ae.findGapCursorFrom(l, e, a);
    return c ? (i && i(r.tr.setSelection(new Ae(c))), !0) : !1;
  };
}
function Hy(t, e, n) {
  if (!t || !t.editable)
    return !1;
  let r = t.state.doc.resolve(e);
  if (!Ae.valid(r))
    return !1;
  let i = t.posAtCoords({ left: n.clientX, top: n.clientY });
  return i && i.inside > -1 && ee.isSelectable(t.state.doc.nodeAt(i.inside)) ? !1 : (t.dispatch(t.state.tr.setSelection(new Ae(r))), !0);
}
function Fy(t, e) {
  if (e.inputType != "insertCompositionText" || !(t.state.selection instanceof Ae))
    return !1;
  let { $from: n } = t.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(t.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = H.empty;
  for (let o = r.length - 1; o >= 0; o--)
    i = H.from(r[o].createAndFill(null, i));
  let s = t.state.tr.replace(n.pos, n.pos, new G(i, 0, 0));
  return s.setSelection(ne.near(s.doc.resolve(n.pos + 1))), t.dispatch(s), !1;
}
function Wy(t) {
  if (!(t.selection instanceof Ae))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", xe.create(t.doc, [ct.widget(t.selection.head, e, { key: "gapcursor" })]);
}
const Vy = Ue.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      By()
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
}), Ky = Ce.create({
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
          const { selection: i, storedMarks: s } = n;
          if (i.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: l } = r.extensionManager, a = s || i.$to.parentOffset && i.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: d }) => {
            if (d && a && o) {
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
}), Uy = Ce.create({
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
    return this.options.levels.map((t) => hl({
      find: new RegExp(`^(#{1,${t}})\\s$`),
      type: this.type,
      getAttributes: {
        level: t
      }
    }));
  }
});
var vs = 200, He = function() {
};
He.prototype.append = function(e) {
  return e.length ? (e = He.from(e), !this.length && e || e.length < vs && this.leafAppend(e) || this.length < vs && e.leafPrepend(this) || this.appendInner(e)) : this;
};
He.prototype.prepend = function(e) {
  return e.length ? He.from(e).append(this) : this;
};
He.prototype.appendInner = function(e) {
  return new qy(this, e);
};
He.prototype.slice = function(e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = this.length), e >= n ? He.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, n));
};
He.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
He.prototype.forEach = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length), n <= r ? this.forEachInner(e, n, r, 0) : this.forEachInvertedInner(e, n, r, 0);
};
He.prototype.map = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(s, o) {
    return i.push(e(s, o));
  }, n, r), i;
};
He.from = function(e) {
  return e instanceof He ? e : e && e.length ? new qf(e) : He.empty;
};
var qf = /* @__PURE__ */ function(t) {
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
  }, e.prototype.forEachInner = function(i, s, o, l) {
    for (var a = s; a < o; a++)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, s, o, l) {
    for (var a = s - 1; a >= o; a--)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= vs)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= vs)
      return new e(i.flatten().concat(this.values));
  }, n.length.get = function() {
    return this.values.length;
  }, n.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, n), e;
}(He);
He.empty = new qf([]);
var qy = /* @__PURE__ */ function(t) {
  function e(n, r) {
    t.call(this), this.left = n, this.right = r, this.length = n.length + r.length, this.depth = Math.max(n.depth, r.depth) + 1;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i < l && this.left.forEachInner(r, i, Math.min(s, l), o) === !1 || s > l && this.right.forEachInner(r, Math.max(i - l, 0), Math.min(this.length, s) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i > l && this.right.forEachInvertedInner(r, i - l, Math.max(s, l) - l, o + l) === !1 || s < l && this.left.forEachInvertedInner(r, Math.min(i, l), s, o) === !1)
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
}(He);
const Gy = 500;
class Mt {
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
    let o = e.tr, l, a, c = [], d = [];
    return this.items.forEach((f, h) => {
      if (!f.step) {
        i || (i = this.remapping(r, h + 1), s = i.maps.length), s--, d.push(f);
        return;
      }
      if (i) {
        d.push(new zt(f.map));
        let g = f.step.map(i.slice(s)), y;
        g && o.maybeStep(g).doc && (y = o.mapping.maps[o.mapping.maps.length - 1], c.push(new zt(y, void 0, void 0, c.length + d.length))), s--, y && i.appendMap(y, s);
      } else
        o.maybeStep(f.step);
      if (f.selection)
        return l = i ? f.selection.map(i.slice(s)) : f.selection, a = new Mt(this.items.slice(0, r).append(d.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, n, r, i) {
    let s = [], o = this.eventCount, l = this.items, a = !i && l.length ? l.get(l.length - 1) : null;
    for (let d = 0; d < e.steps.length; d++) {
      let f = e.steps[d].invert(e.docs[d]), h = new zt(e.mapping.maps[d], f, n), g;
      (g = a && a.merge(h)) && (h = g, d ? s.pop() : l = l.slice(0, l.length - 1)), s.push(h), n && (o++, n = void 0), i || (a = h);
    }
    let c = o - r.depth;
    return c > Yy && (l = Jy(l, c), o -= c), new Mt(l.append(s), o);
  }
  remapping(e, n) {
    let r = new br();
    return this.items.forEach((i, s) => {
      let o = i.mirrorOffset != null && s - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, o);
    }, e, n), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Mt(this.items.append(e.map((n) => new zt(n))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, n) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - n), s = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, i);
    let a = n;
    this.items.forEach((h) => {
      let g = s.getMirror(--a);
      if (g == null)
        return;
      o = Math.min(o, g);
      let y = s.maps[g];
      if (h.step) {
        let v = e.steps[g].invert(e.docs[g]), k = h.selection && h.selection.map(s.slice(a + 1, g));
        k && l++, r.push(new zt(y, v, k));
      } else
        r.push(new zt(y));
    }, i);
    let c = [];
    for (let h = n; h < o; h++)
      c.push(new zt(s.maps[h]));
    let d = this.items.slice(0, i).append(c).append(r), f = new Mt(d, l);
    return f.emptyItemCount() > Gy && (f = f.compress(this.items.length - r.length)), f;
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
    return this.items.forEach((o, l) => {
      if (l >= e)
        i.push(o), o.selection && s++;
      else if (o.step) {
        let a = o.step.map(n.slice(r)), c = a && a.getMap();
        if (r--, c && n.appendMap(c, r), a) {
          let d = o.selection && o.selection.map(n.slice(r));
          d && s++;
          let f = new zt(c.invert(), a, d), h, g = i.length - 1;
          (h = i.length && i[g].merge(f)) ? i[g] = h : i.push(f);
        }
      } else
        o.map && r--;
    }, this.items.length, 0), new Mt(He.from(i.reverse()), s);
  }
}
Mt.empty = new Mt(He.empty, 0);
function Jy(t, e) {
  let n;
  return t.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return n = i, !1;
  }), t.slice(n);
}
class zt {
  constructor(e, n, r, i) {
    this.map = e, this.step = n, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let n = e.step.merge(this.step);
      if (n)
        return new zt(n.getMap().invert(), n, this.selection);
    }
  }
}
class an {
  constructor(e, n, r, i, s) {
    this.done = e, this.undone = n, this.prevRanges = r, this.prevTime = i, this.prevComposition = s;
  }
}
const Yy = 20;
function Xy(t, e, n, r) {
  let i = n.getMeta(vn), s;
  if (i)
    return i.historyState;
  n.getMeta(Zy) && (t = new an(t.done, t.undone, null, 0, -1));
  let o = n.getMeta("appendedTransaction");
  if (n.steps.length == 0)
    return t;
  if (o && o.getMeta(vn))
    return o.getMeta(vn).redo ? new an(t.done.addTransform(n, void 0, r, qi(e)), t.undone, iu(n.mapping.maps[n.steps.length - 1]), t.prevTime, t.prevComposition) : new an(t.done, t.undone.addTransform(n, void 0, r, qi(e)), null, t.prevTime, t.prevComposition);
  if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = n.getMeta("composition"), a = t.prevTime == 0 || !o && t.prevComposition != l && (t.prevTime < (n.time || 0) - r.newGroupDelay || !Qy(n, t.prevRanges)), c = o ? Mo(t.prevRanges, n.mapping) : iu(n.mapping.maps[n.steps.length - 1]);
    return new an(t.done.addTransform(n, a ? e.selection.getBookmark() : void 0, r, qi(e)), Mt.empty, c, n.time, l ?? t.prevComposition);
  } else
    return (s = n.getMeta("rebased")) ? new an(t.done.rebased(n, s), t.undone.rebased(n, s), Mo(t.prevRanges, n.mapping), t.prevTime, t.prevComposition) : new an(t.done.addMaps(n.mapping.maps), t.undone.addMaps(n.mapping.maps), Mo(t.prevRanges, n.mapping), t.prevTime, t.prevComposition);
}
function Qy(t, e) {
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
function iu(t) {
  let e = [];
  return t.forEach((n, r, i, s) => e.push(i, s)), e;
}
function Mo(t, e) {
  if (!t)
    return null;
  let n = [];
  for (let r = 0; r < t.length; r += 2) {
    let i = e.map(t[r], 1), s = e.map(t[r + 1], -1);
    i <= s && n.push(i, s);
  }
  return n;
}
function Gf(t, e, n, r) {
  let i = qi(e), s = vn.get(e).spec.config, o = (r ? t.undone : t.done).popEvent(e, i);
  if (!o)
    return;
  let l = o.selection.resolve(o.transform.doc), a = (r ? t.done : t.undone).addTransform(o.transform, e.selection.getBookmark(), s, i), c = new an(r ? a : o.remaining, r ? o.remaining : a, null, 0, -1);
  n(o.transform.setSelection(l).setMeta(vn, { redo: r, historyState: c }).scrollIntoView());
}
let Ao = !1, su = null;
function qi(t) {
  let e = t.plugins;
  if (su != e) {
    Ao = !1, su = e;
    for (let n = 0; n < e.length; n++)
      if (e[n].spec.historyPreserveItems) {
        Ao = !0;
        break;
      }
  }
  return Ao;
}
const vn = new tt("history"), Zy = new tt("closeHistory");
function eb(t = {}) {
  return t = {
    depth: t.depth || 100,
    newGroupDelay: t.newGroupDelay || 500
  }, new et({
    key: vn,
    state: {
      init() {
        return new an(Mt.empty, Mt.empty, null, 0, -1);
      },
      apply(e, n, r) {
        return Xy(n, r, e, t);
      }
    },
    config: t,
    props: {
      handleDOMEvents: {
        beforeinput(e, n) {
          let r = n.inputType, i = r == "historyUndo" ? Jf : r == "historyRedo" ? Yf : null;
          return i ? (n.preventDefault(), i(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const Jf = (t, e) => {
  let n = vn.getState(t);
  return !n || n.done.eventCount == 0 ? !1 : (e && Gf(n, t, e, !1), !0);
}, Yf = (t, e) => {
  let n = vn.getState(t);
  return !n || n.undone.eventCount == 0 ? !1 : (e && Gf(n, t, e, !0), !0);
}, tb = Ue.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: t, dispatch: e }) => Jf(t, e),
      redo: () => ({ state: t, dispatch: e }) => Yf(t, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      eb(this.options)
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
}), nb = Ce.create({
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
        return n.parentOffset === 0 ? r.insertContentAt(Math.max(n.pos - 2, 0), { type: this.name }) : r.insertContent({ type: this.name }), r.command(({ tr: i, dispatch: s }) => {
          var o;
          if (s) {
            const { $to: l } = i.selection, a = l.end();
            if (l.nodeAfter)
              l.nodeAfter.isTextblock ? i.setSelection(ne.create(i.doc, l.pos + 1)) : l.nodeAfter.isBlock ? i.setSelection(ee.create(i.doc, l.pos)) : i.setSelection(ne.create(i.doc, l.pos));
            else {
              const c = (o = l.parent.type.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.create();
              c && (i.insert(a, c), i.setSelection(ne.create(i.doc, a + 1)));
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
      Uf({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), rb = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/, ib = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g, sb = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/, ob = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g, lb = kt.create({
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
      Un({
        find: rb,
        type: this.type
      }),
      Un({
        find: sb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      xn({
        find: ib,
        type: this.type
      }),
      xn({
        find: ob,
        type: this.type
      })
    ];
  }
}), ab = Ce.create({
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
}), cb = Ce.create({
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
}), ou = kt.create({
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
        const n = vi(t, this.type);
        return Object.entries(n).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
}), lu = /^(\d+)\.\s$/, ub = Ce.create({
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
      toggleOrderedList: () => ({ commands: t, chain: e }) => this.options.keepAttributes ? e().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(cb.name, this.editor.getAttributes(ou.name)).run() : t.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let t = di({
      find: lu,
      type: this.type,
      getAttributes: (e) => ({ start: +e[1] }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1]
    });
    return (this.options.keepMarks || this.options.keepAttributes) && (t = di({
      find: lu,
      type: this.type,
      keepMarks: this.options.keepMarks,
      keepAttributes: this.options.keepAttributes,
      getAttributes: (e) => ({ start: +e[1], ...this.editor.getAttributes(ou.name) }),
      joinPredicate: (e, n) => n.childCount + n.attrs.start === +e[1],
      editor: this.editor
    })), [
      t
    ];
  }
}), db = Ce.create({
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
}), fb = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/, pb = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g, hb = kt.create({
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
    return _a() ? t["Mod-Shift-s"] = () => this.editor.commands.toggleStrike() : t["Ctrl-Shift-s"] = () => this.editor.commands.toggleStrike(), t;
  },
  addInputRules() {
    return [
      Un({
        find: fb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      xn({
        find: pb,
        type: this.type
      })
    ];
  }
}), mb = Ce.create({
  name: "text",
  group: "inline"
});
Ue.create({
  name: "starterKit",
  addExtensions() {
    var t, e, n, r, i, s, o, l, a, c, d, f, h, g, y, v, k, E;
    const T = [];
    return this.options.blockquote !== !1 && T.push(vy.configure((t = this.options) === null || t === void 0 ? void 0 : t.blockquote)), this.options.bold !== !1 && T.push(Sy.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && T.push(Ey.configure((n = this.options) === null || n === void 0 ? void 0 : n.bulletList)), this.options.code !== !1 && T.push(Ty.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && T.push(Py.configure((i = this.options) === null || i === void 0 ? void 0 : i.codeBlock)), this.options.document !== !1 && T.push(Ry.configure((s = this.options) === null || s === void 0 ? void 0 : s.document)), this.options.dropcursor !== !1 && T.push(Ly.configure((o = this.options) === null || o === void 0 ? void 0 : o.dropcursor)), this.options.gapcursor !== !1 && T.push(Vy.configure((l = this.options) === null || l === void 0 ? void 0 : l.gapcursor)), this.options.hardBreak !== !1 && T.push(Ky.configure((a = this.options) === null || a === void 0 ? void 0 : a.hardBreak)), this.options.heading !== !1 && T.push(Uy.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && T.push(tb.configure((d = this.options) === null || d === void 0 ? void 0 : d.history)), this.options.horizontalRule !== !1 && T.push(nb.configure((f = this.options) === null || f === void 0 ? void 0 : f.horizontalRule)), this.options.italic !== !1 && T.push(lb.configure((h = this.options) === null || h === void 0 ? void 0 : h.italic)), this.options.listItem !== !1 && T.push(ab.configure((g = this.options) === null || g === void 0 ? void 0 : g.listItem)), this.options.orderedList !== !1 && T.push(ub.configure((y = this.options) === null || y === void 0 ? void 0 : y.orderedList)), this.options.paragraph !== !1 && T.push(db.configure((v = this.options) === null || v === void 0 ? void 0 : v.paragraph)), this.options.strike !== !1 && T.push(hb.configure((k = this.options) === null || k === void 0 ? void 0 : k.strike)), this.options.text !== !1 && T.push(mb.configure((E = this.options) === null || E === void 0 ? void 0 : E.text)), T;
  }
});
Ue.create({
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
            return t.descendants((l, a) => {
              const c = r >= a && r <= a + l.nodeSize, d = !l.isLeaf && !l.childCount;
              if ((c || !this.options.showOnlyCurrent) && d) {
                const f = [this.options.emptyNodeClass];
                o && f.push(this.options.emptyEditorClass);
                const h = ct.node(a, a + l.nodeSize, {
                  class: f.join(" "),
                  "data-placeholder": typeof this.options.placeholder == "function" ? this.options.placeholder({
                    editor: this.editor,
                    node: l,
                    pos: a,
                    hasAnchor: c
                  }) : this.options.placeholder
                });
                i.push(h);
              }
              return this.options.includeChildren;
            }), xe.create(t, i);
          }
        }
      })
    ];
  }
});
Ue.create({
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
var ml, gl;
if (typeof WeakMap < "u") {
  let t = /* @__PURE__ */ new WeakMap();
  ml = (e) => t.get(e), gl = (e, n) => (t.set(e, n), n);
} else {
  const t = [];
  let n = 0;
  ml = (r) => {
    for (let i = 0; i < t.length; i += 2)
      if (t[i] == r)
        return t[i + 1];
  }, gl = (r, i) => (n == 10 && (n = 0), t[n++] = r, t[n++] = i);
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
      for (let l = 1; s < this.width && this.map[e + l] == n; l++)
        s++;
      for (let l = 1; o < this.height && this.map[e + this.width * l] == n; l++)
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
      right: l,
      top: a,
      bottom: c
    } = this.findCell(e);
    return {
      left: Math.min(n, o),
      top: Math.min(i, a),
      right: Math.max(r, l),
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
        const l = (t + 1) * this.width;
        for (; o < l && this.map[o] < i; )
          o++;
        return o == l ? s - 1 : this.map[o];
      }
      i = s;
    }
  }
  // Find the table map for the given table node.
  static get(t) {
    return ml(t) || gl(t, gb(t));
  }
};
function gb(t) {
  if (t.type.spec.tableRole != "table")
    throw new RangeError("Not a table node: " + t.type.name);
  const e = yb(t), n = t.childCount, r = [];
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
      const v = f.child(y), { colspan: k, rowspan: E, colwidth: T } = v.attrs;
      for (let j = 0; j < E; j++) {
        if (j + c >= n) {
          (s || (s = [])).push({
            type: "overlong_rowspan",
            pos: d,
            n: E - j
          });
          break;
        }
        const u = i + j * e;
        for (let m = 0; m < k; m++) {
          r[u + m] == 0 ? r[u + m] = d : (s || (s = [])).push({
            type: "collision",
            row: c,
            pos: d,
            n: k - m
          });
          const p = T && T[m];
          if (p) {
            const b = (u + m) % e * 2, w = o[b];
            w == null || w != p && o[b + 1] == 1 ? (o[b] = p, o[b + 1] = 1) : w == p && o[b + 1]++;
          }
        }
      }
      i += k, d += v.nodeSize;
    }
    const h = (c + 1) * e;
    let g = 0;
    for (; i < h; )
      r[i++] == 0 && g++;
    g && (s || (s = [])).push({ type: "missing", row: c, n: g }), d++;
  }
  const l = new Te(e, n, r, s);
  let a = !1;
  for (let c = 0; !a && c < o.length; c += 2)
    o[c] != null && o[c + 1] < n && (a = !0);
  return a && bb(l, o, t), l;
}
function yb(t) {
  let e = -1, n = !1;
  for (let r = 0; r < t.childCount; r++) {
    const i = t.child(r);
    let s = 0;
    if (n)
      for (let o = 0; o < r; o++) {
        const l = t.child(o);
        for (let a = 0; a < l.childCount; a++) {
          const c = l.child(a);
          o + c.attrs.rowspan > r && (s += c.attrs.colspan);
        }
      }
    for (let o = 0; o < i.childCount; o++) {
      const l = i.child(o);
      s += l.attrs.colspan, l.attrs.rowspan > 1 && (n = !0);
    }
    e == -1 ? e = s : e != s && (e = Math.max(e, s));
  }
  return e;
}
function bb(t, e, n) {
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
    let l = null;
    const a = o.attrs;
    for (let c = 0; c < a.colspan; c++) {
      const d = (i + c) % t.width, f = e[d * 2];
      f != null && (!a.colwidth || a.colwidth[c] != f) && ((l || (l = vb(a)))[c] = f);
    }
    l && t.problems.unshift({
      type: "colwidth mismatch",
      pos: s,
      colwidth: l
    });
  }
}
function vb(t) {
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
var un = new tt("selectingCells");
function Nr(t) {
  for (let e = t.depth - 1; e > 0; e--)
    if (t.node(e).type.spec.tableRole == "row")
      return t.node(0).resolve(t.before(e + 1));
  return null;
}
function wb(t) {
  for (let e = t.depth; e > 0; e--) {
    const n = t.node(e).type.spec.tableRole;
    if (n === "cell" || n === "header_cell")
      return t.node(e);
  }
  return null;
}
function Rt(t) {
  const e = t.selection.$head;
  for (let n = e.depth; n > 0; n--)
    if (e.node(n).type.spec.tableRole == "row")
      return !0;
  return !1;
}
function to(t) {
  const e = t.selection;
  if ("$anchorCell" in e && e.$anchorCell)
    return e.$anchorCell.pos > e.$headCell.pos ? e.$anchorCell : e.$headCell;
  if ("node" in e && e.node && e.node.type.spec.tableRole == "cell")
    return e.$anchor;
  const n = Nr(e.$head) || _b(e.$head);
  if (n)
    return n;
  throw new RangeError(`No cell found around position ${e.head}`);
}
function _b(t) {
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
function yl(t) {
  return t.parent.type.spec.tableRole == "row" && !!t.nodeAfter;
}
function kb(t) {
  return t.node(0).resolve(t.pos + t.nodeAfter.nodeSize);
}
function Ma(t, e) {
  return t.depth == e.depth && t.pos >= e.start(-1) && t.pos <= e.end(-1);
}
function Xf(t, e, n) {
  const r = t.node(-1), i = Te.get(r), s = t.start(-1), o = i.nextCell(t.pos - s, e, n);
  return o == null ? null : t.node(0).resolve(s + o);
}
function qn(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan - n };
  return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(e, n), r.colwidth.some((i) => i > 0) || (r.colwidth = null)), r;
}
function Qf(t, e, n = 1) {
  const r = { ...t, colspan: t.colspan + n };
  if (r.colwidth) {
    r.colwidth = r.colwidth.slice();
    for (let i = 0; i < n; i++)
      r.colwidth.splice(e, 0, 0);
  }
  return r;
}
function xb(t, e, n) {
  const r = Ze(e.type.schema).header_cell;
  for (let i = 0; i < t.height; i++)
    if (e.nodeAt(t.map[n + i * t.width]).type != r)
      return !1;
  return !0;
}
var ue = class extends re {
  // A table selection is identified by its anchor and head cells. The
  // positions given to this constructor should point _before_ two
  // cells in the same table. They may be the same, to select a single
  // cell.
  constructor(t, e = t) {
    const n = t.node(-1), r = Te.get(n), i = t.start(-1), s = r.rectBetween(
      t.pos - i,
      e.pos - i
    ), o = t.node(0), l = r.cellsInRect(s).filter((c) => c != e.pos - i);
    l.unshift(e.pos - i);
    const a = l.map((c) => {
      const d = n.nodeAt(c);
      if (!d)
        throw RangeError(`No cell with offset ${c} found`);
      const f = i + c + 1;
      return new ff(
        o.resolve(f),
        o.resolve(f + d.content.size)
      );
    });
    super(a[0].$from, a[0].$to, a), this.$anchorCell = t, this.$headCell = e;
  }
  map(t, e) {
    const n = t.resolve(e.map(this.$anchorCell.pos)), r = t.resolve(e.map(this.$headCell.pos));
    if (yl(n) && yl(r) && Ma(n, r)) {
      const i = this.$anchorCell.node(-1) != n.node(-1);
      return i && this.isRowSelection() ? ue.rowSelection(n, r) : i && this.isColSelection() ? ue.colSelection(n, r) : new ue(n, r);
    }
    return ne.between(n, r);
  }
  // Returns a rectangular slice of table rows containing the selected
  // cells.
  content() {
    const t = this.$anchorCell.node(-1), e = Te.get(t), n = this.$anchorCell.start(-1), r = e.rectBetween(
      this.$anchorCell.pos - n,
      this.$headCell.pos - n
    ), i = {}, s = [];
    for (let l = r.top; l < r.bottom; l++) {
      const a = [];
      for (let c = l * e.width + r.left, d = r.left; d < r.right; d++, c++) {
        const f = e.map[c];
        if (i[f])
          continue;
        i[f] = !0;
        const h = e.findCell(f);
        let g = t.nodeAt(f);
        if (!g)
          throw RangeError(`No cell with offset ${f} found`);
        const y = r.left - h.left, v = h.right - r.right;
        if (y > 0 || v > 0) {
          let k = g.attrs;
          if (y > 0 && (k = qn(k, 0, y)), v > 0 && (k = qn(
            k,
            k.colspan - v,
            v
          )), h.left < r.left) {
            if (g = g.type.createAndFill(k), !g)
              throw RangeError(
                `Could not create cell with attrs ${JSON.stringify(k)}`
              );
          } else
            g = g.type.create(k, g.content);
        }
        if (h.top < r.top || h.bottom > r.bottom) {
          const k = {
            ...g.attrs,
            rowspan: Math.min(h.bottom, r.bottom) - Math.max(h.top, r.top)
          };
          h.top < r.top ? g = g.type.createAndFill(k) : g = g.type.create(k, g.content);
        }
        a.push(g);
      }
      s.push(t.child(l).copy(H.from(a)));
    }
    const o = this.isColSelection() && this.isRowSelection() ? t : s;
    return new G(H.from(o), 1, 1);
  }
  replace(t, e = G.empty) {
    const n = t.steps.length, r = this.ranges;
    for (let s = 0; s < r.length; s++) {
      const { $from: o, $to: l } = r[s], a = t.mapping.slice(n);
      t.replace(
        a.map(o.pos),
        a.map(l.pos),
        s ? G.empty : e
      );
    }
    const i = re.findFrom(
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
    const n = t.node(-1), r = Te.get(n), i = t.start(-1), s = r.findCell(t.pos - i), o = r.findCell(e.pos - i), l = t.node(0);
    return s.top <= o.top ? (s.top > 0 && (t = l.resolve(i + r.map[s.left])), o.bottom < r.height && (e = l.resolve(
      i + r.map[r.width * (r.height - 1) + o.right - 1]
    ))) : (o.top > 0 && (e = l.resolve(i + r.map[o.left])), s.bottom < r.height && (t = l.resolve(
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
    const n = t.node(-1), r = Te.get(n), i = t.start(-1), s = r.findCell(t.pos - i), o = r.findCell(e.pos - i), l = t.node(0);
    return s.left <= o.left ? (s.left > 0 && (t = l.resolve(
      i + r.map[s.top * r.width]
    )), o.right < r.width && (e = l.resolve(
      i + r.map[r.width * (o.top + 1) - 1]
    ))) : (o.left > 0 && (e = l.resolve(i + r.map[o.top * r.width])), s.right < r.width && (t = l.resolve(
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
    return new Zf(this.$anchorCell.pos, this.$headCell.pos);
  }
};
ue.prototype.visible = !1;
re.jsonID("cell", ue);
var Zf = class {
  constructor(t, e) {
    this.anchor = t, this.head = e;
  }
  map(t) {
    return new Zf(t.map(this.anchor), t.map(this.head));
  }
  resolve(t) {
    const e = t.resolve(this.anchor), n = t.resolve(this.head);
    return e.parent.type.spec.tableRole == "row" && n.parent.type.spec.tableRole == "row" && e.index() < e.parent.childCount && n.index() < n.parent.childCount && Ma(e, n) ? new ue(e, n) : re.near(n, 1);
  }
};
function Sb(t) {
  if (!(t.selection instanceof ue))
    return null;
  const e = [];
  return t.selection.forEachCell((n, r) => {
    e.push(
      ct.node(r, r + n.nodeSize, { class: "selectedCell" })
    );
  }), xe.create(t.doc, e);
}
function Cb({ $from: t, $to: e }) {
  if (t.pos == e.pos || t.pos < t.pos - 6)
    return !1;
  let n = t.pos, r = e.pos, i = t.depth;
  for (; i >= 0 && !(t.after(i + 1) < t.end(i)); i--, n++)
    ;
  for (let s = e.depth; s >= 0 && !(e.before(s + 1) > e.start(s)); s--, r--)
    ;
  return n == r && /row|table/.test(t.node(i).type.spec.tableRole);
}
function Eb({ $from: t, $to: e }) {
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
function Mb(t, e, n) {
  const r = (e || t).selection, i = (e || t).doc;
  let s, o;
  if (r instanceof ee && (o = r.node.type.spec.tableRole)) {
    if (o == "cell" || o == "header_cell")
      s = ue.create(i, r.from);
    else if (o == "row") {
      const l = i.resolve(r.from + 1);
      s = ue.rowSelection(l, l);
    } else if (!n) {
      const l = Te.get(r.node), a = r.from + 1, c = a + l.map[l.width * l.height - 1];
      s = ue.create(i, a + 1, c);
    }
  } else
    r instanceof ne && Cb(r) ? s = ne.create(i, r.from) : r instanceof ne && Eb(r) && (s = ne.create(i, r.$from.start(), r.$from.end()));
  return s && (e || (e = t.tr)).setSelection(s), e;
}
var Ab = new tt("fix-tables");
function ep(t, e, n, r) {
  const i = t.childCount, s = e.childCount;
  e:
    for (let o = 0, l = 0; o < s; o++) {
      const a = e.child(o);
      for (let c = l, d = Math.min(i, o + 3); c < d; c++)
        if (t.child(c) == a) {
          l = c + 1, n += a.nodeSize;
          continue e;
        }
      r(a, n), l < i && t.child(l).sameMarkup(a) ? ep(t.child(l), a, n + 1, r) : a.nodesBetween(0, a.content.size, r, n + 1), n += a.nodeSize;
    }
}
function tp(t, e) {
  let n;
  const r = (i, s) => {
    i.type.spec.tableRole == "table" && (n = Tb(t, i, s, n));
  };
  return e ? e.doc != t.doc && ep(e.doc, t.doc, 0, r) : t.doc.descendants(r), n;
}
function Tb(t, e, n, r) {
  const i = Te.get(e);
  if (!i.problems)
    return r;
  r || (r = t.tr);
  const s = [];
  for (let a = 0; a < i.height; a++)
    s.push(0);
  for (let a = 0; a < i.problems.length; a++) {
    const c = i.problems[a];
    if (c.type == "collision") {
      const d = e.nodeAt(c.pos);
      if (!d)
        continue;
      const f = d.attrs;
      for (let h = 0; h < f.rowspan; h++)
        s[c.row + h] += c.n;
      r.setNodeMarkup(
        r.mapping.map(n + 1 + c.pos),
        null,
        qn(f, f.colspan - c.n, c.n)
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
  let o, l;
  for (let a = 0; a < s.length; a++)
    s[a] && (o == null && (o = a), l = a);
  for (let a = 0, c = n + 1; a < i.height; a++) {
    const d = e.child(a), f = c + d.nodeSize, h = s[a];
    if (h > 0) {
      let g = "cell";
      d.firstChild && (g = d.firstChild.type.spec.tableRole);
      const y = [];
      for (let k = 0; k < h; k++) {
        const E = Ze(t.schema)[g].createAndFill();
        E && y.push(E);
      }
      const v = (a == 0 || o == a - 1) && l == a ? c + 1 : f - 1;
      r.insert(r.mapping.map(v), y);
    }
    c = f;
  }
  return r.setMeta(Ab, { fixTables: !0 });
}
function Ob(t) {
  if (!t.size)
    return null;
  let { content: e, openStart: n, openEnd: r } = t;
  for (; e.childCount == 1 && (n > 0 && r > 0 || e.child(0).type.spec.tableRole == "table"); )
    n--, r--, e = e.child(0).content;
  const i = e.child(0), s = i.type.spec.tableRole, o = i.type.schema, l = [];
  if (s == "row")
    for (let a = 0; a < e.childCount; a++) {
      let c = e.child(a).content;
      const d = a ? 0 : Math.max(0, n - 1), f = a < e.childCount - 1 ? 0 : Math.max(0, r - 1);
      (d || f) && (c = bl(
        Ze(o).row,
        new G(c, d, f)
      ).content), l.push(c);
    }
  else if (s == "cell" || s == "header_cell")
    l.push(
      n || r ? bl(
        Ze(o).row,
        new G(e, n, r)
      ).content : e
    );
  else
    return null;
  return jb(o, l);
}
function jb(t, e) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    for (let o = s.childCount - 1; o >= 0; o--) {
      const { rowspan: l, colspan: a } = s.child(o).attrs;
      for (let c = i; c < i + l; c++)
        n[c] = (n[c] || 0) + a;
    }
  }
  let r = 0;
  for (let i = 0; i < n.length; i++)
    r = Math.max(r, n[i]);
  for (let i = 0; i < n.length; i++)
    if (i >= e.length && e.push(H.empty), n[i] < r) {
      const s = Ze(t).cell.createAndFill(), o = [];
      for (let l = n[i]; l < r; l++)
        o.push(s);
      e[i] = e[i].append(H.from(o));
    }
  return { height: e.length, width: r, rows: e };
}
function bl(t, e) {
  const n = t.createAndFill();
  return new df(n).replace(0, n.content.size, e).doc;
}
function Pb({ width: t, height: e, rows: n }, r, i) {
  if (t != r) {
    const s = [], o = [];
    for (let l = 0; l < n.length; l++) {
      const a = n[l], c = [];
      for (let d = s[l] || 0, f = 0; d < r; f++) {
        let h = a.child(f % a.childCount);
        d + h.attrs.colspan > r && (h = h.type.createChecked(
          qn(
            h.attrs,
            h.attrs.colspan,
            d + h.attrs.colspan - r
          ),
          h.content
        )), c.push(h), d += h.attrs.colspan;
        for (let g = 1; g < h.attrs.rowspan; g++)
          s[l + g] = (s[l + g] || 0) + h.attrs.colspan;
      }
      o.push(H.from(c));
    }
    n = o, t = r;
  }
  if (e != i) {
    const s = [];
    for (let o = 0, l = 0; o < i; o++, l++) {
      const a = [], c = n[l % e];
      for (let d = 0; d < c.childCount; d++) {
        let f = c.child(d);
        o + f.attrs.rowspan > i && (f = f.type.create(
          {
            ...f.attrs,
            rowspan: Math.max(1, i - f.attrs.rowspan)
          },
          f.content
        )), a.push(f);
      }
      s.push(H.from(a));
    }
    n = s, e = i;
  }
  return { width: t, height: e, rows: n };
}
function Rb(t, e, n, r, i, s, o) {
  const l = t.doc.type.schema, a = Ze(l);
  let c, d;
  if (i > e.width)
    for (let f = 0, h = 0; f < e.height; f++) {
      const g = n.child(f);
      h += g.nodeSize;
      const y = [];
      let v;
      g.lastChild == null || g.lastChild.type == a.cell ? v = c || (c = a.cell.createAndFill()) : v = d || (d = a.header_cell.createAndFill());
      for (let k = e.width; k < i; k++)
        y.push(v);
      t.insert(t.mapping.slice(o).map(h - 1 + r), y);
    }
  if (s > e.height) {
    const f = [];
    for (let y = 0, v = (e.height - 1) * e.width; y < Math.max(e.width, i); y++) {
      const k = y >= e.width ? !1 : n.nodeAt(e.map[v + y]).type == a.header_cell;
      f.push(
        k ? d || (d = a.header_cell.createAndFill()) : c || (c = a.cell.createAndFill())
      );
    }
    const h = a.row.create(null, H.from(f)), g = [];
    for (let y = e.height; y < s; y++)
      g.push(h);
    t.insert(t.mapping.slice(o).map(r + n.nodeSize - 2), g);
  }
  return !!(c || d);
}
function au(t, e, n, r, i, s, o, l) {
  if (o == 0 || o == e.height)
    return !1;
  let a = !1;
  for (let c = i; c < s; c++) {
    const d = o * e.width + c, f = e.map[d];
    if (e.map[d - e.width] == f) {
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
function cu(t, e, n, r, i, s, o, l) {
  if (o == 0 || o == e.width)
    return !1;
  let a = !1;
  for (let c = i; c < s; c++) {
    const d = c * e.width + o, f = e.map[d];
    if (e.map[d - 1] == f) {
      a = !0;
      const h = n.nodeAt(f), g = e.colCount(f), y = t.mapping.slice(l).map(f + r);
      t.setNodeMarkup(
        y,
        null,
        qn(
          h.attrs,
          o - g,
          h.attrs.colspan - (o - g)
        )
      ), t.insert(
        y + h.nodeSize,
        h.type.createAndFill(
          qn(h.attrs, 0, o - g)
        )
      ), c += h.attrs.rowspan - 1;
    }
  }
  return a;
}
function uu(t, e, n, r, i) {
  let s = n ? t.doc.nodeAt(n - 1) : t.doc;
  if (!s)
    throw new Error("No table found");
  let o = Te.get(s);
  const { top: l, left: a } = r, c = a + i.width, d = l + i.height, f = t.tr;
  let h = 0;
  function g() {
    if (s = n ? f.doc.nodeAt(n - 1) : f.doc, !s)
      throw new Error("No table found");
    o = Te.get(s), h = f.mapping.maps.length;
  }
  Rb(f, o, s, n, c, d, h) && g(), au(f, o, s, n, a, c, l, h) && g(), au(f, o, s, n, a, c, d, h) && g(), cu(f, o, s, n, l, d, a, h) && g(), cu(f, o, s, n, l, d, c, h) && g();
  for (let y = l; y < d; y++) {
    const v = o.positionAt(y, a, s), k = o.positionAt(y, c, s);
    f.replace(
      f.mapping.slice(h).map(v + n),
      f.mapping.slice(h).map(k + n),
      new G(i.rows[y - l], 0, 0)
    );
  }
  g(), f.setSelection(
    new ue(
      f.doc.resolve(n + o.positionAt(l, a, s)),
      f.doc.resolve(n + o.positionAt(d - 1, c - 1, s))
    )
  ), e(f);
}
var Ib = zf({
  ArrowLeft: Pi("horiz", -1),
  ArrowRight: Pi("horiz", 1),
  ArrowUp: Pi("vert", -1),
  ArrowDown: Pi("vert", 1),
  "Shift-ArrowLeft": Ri("horiz", -1),
  "Shift-ArrowRight": Ri("horiz", 1),
  "Shift-ArrowUp": Ri("vert", -1),
  "Shift-ArrowDown": Ri("vert", 1),
  Backspace: Ii,
  "Mod-Backspace": Ii,
  Delete: Ii,
  "Mod-Delete": Ii
});
function Gi(t, e, n) {
  return n.eq(t.selection) ? !1 : (e && e(t.tr.setSelection(n).scrollIntoView()), !0);
}
function Pi(t, e) {
  return (n, r, i) => {
    if (!i)
      return !1;
    const s = n.selection;
    if (s instanceof ue)
      return Gi(
        n,
        r,
        re.near(s.$headCell, e)
      );
    if (t != "horiz" && !s.empty)
      return !1;
    const o = np(i, t, e);
    if (o == null)
      return !1;
    if (t == "horiz")
      return Gi(
        n,
        r,
        re.near(n.doc.resolve(s.head + e), e)
      );
    {
      const l = n.doc.resolve(o), a = Xf(l, t, e);
      let c;
      return a ? c = re.near(a, 1) : e < 0 ? c = re.near(n.doc.resolve(l.before(-1)), -1) : c = re.near(n.doc.resolve(l.after(-1)), 1), Gi(n, r, c);
    }
  };
}
function Ri(t, e) {
  return (n, r, i) => {
    if (!i)
      return !1;
    const s = n.selection;
    let o;
    if (s instanceof ue)
      o = s;
    else {
      const a = np(i, t, e);
      if (a == null)
        return !1;
      o = new ue(n.doc.resolve(a));
    }
    const l = Xf(o.$headCell, t, e);
    return l ? Gi(
      n,
      r,
      new ue(o.$anchorCell, l)
    ) : !1;
  };
}
function Ii(t, e) {
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
function Nb(t, e) {
  const n = t.state.doc, r = Nr(n.resolve(e));
  return r ? (t.dispatch(t.state.tr.setSelection(new ue(r))), !0) : !1;
}
function Lb(t, e, n) {
  if (!Rt(t.state))
    return !1;
  let r = Ob(n);
  const i = t.state.selection;
  if (i instanceof ue) {
    r || (r = {
      width: 1,
      height: 1,
      rows: [
        H.from(
          bl(Ze(t.state.schema).cell, n)
        )
      ]
    });
    const s = i.$anchorCell.node(-1), o = i.$anchorCell.start(-1), l = Te.get(s).rectBetween(
      i.$anchorCell.pos - o,
      i.$headCell.pos - o
    );
    return r = Pb(r, l.right - l.left, l.bottom - l.top), uu(t.state, t.dispatch, o, l, r), !0;
  } else if (r) {
    const s = to(t.state), o = s.start(-1);
    return uu(
      t.state,
      t.dispatch,
      o,
      Te.get(s.node(-1)).findCell(s.pos - o),
      r
    ), !0;
  } else
    return !1;
}
function zb(t, e) {
  var n;
  if (e.ctrlKey || e.metaKey)
    return;
  const r = du(t, e.target);
  let i;
  if (e.shiftKey && t.state.selection instanceof ue)
    s(t.state.selection.$anchorCell, e), e.preventDefault();
  else if (e.shiftKey && r && (i = Nr(t.state.selection.$anchor)) != null && ((n = To(t, e)) == null ? void 0 : n.pos) != i.pos)
    s(i, e), e.preventDefault();
  else if (!r)
    return;
  function s(a, c) {
    let d = To(t, c);
    const f = un.getState(t.state) == null;
    if (!d || !Ma(a, d))
      if (f)
        d = a;
      else
        return;
    const h = new ue(a, d);
    if (f || !t.state.selection.eq(h)) {
      const g = t.state.tr.setSelection(h);
      f && g.setMeta(un, a.pos), t.dispatch(g);
    }
  }
  function o() {
    t.root.removeEventListener("mouseup", o), t.root.removeEventListener("dragstart", o), t.root.removeEventListener("mousemove", l), un.getState(t.state) != null && t.dispatch(t.state.tr.setMeta(un, -1));
  }
  function l(a) {
    const c = a, d = un.getState(t.state);
    let f;
    if (d != null)
      f = t.state.doc.resolve(d);
    else if (du(t, c.target) != r && (f = To(t, e), !f))
      return o();
    f && s(f, c);
  }
  t.root.addEventListener("mouseup", o), t.root.addEventListener("dragstart", o), t.root.addEventListener("mousemove", l);
}
function np(t, e, n) {
  if (!(t.state.selection instanceof ne))
    return null;
  const { $head: r } = t.state.selection;
  for (let i = r.depth - 1; i >= 0; i--) {
    const s = r.node(i);
    if ((n < 0 ? r.index(i) : r.indexAfter(i)) != (n < 0 ? 0 : s.childCount))
      return null;
    if (s.type.spec.tableRole == "cell" || s.type.spec.tableRole == "header_cell") {
      const l = r.before(i), a = e == "vert" ? n > 0 ? "down" : "up" : n > 0 ? "right" : "left";
      return t.endOfTextblock(a) ? l : null;
    }
  }
  return null;
}
function du(t, e) {
  for (; e && e != t.dom; e = e.parentNode)
    if (e.nodeName == "TD" || e.nodeName == "TH")
      return e;
  return null;
}
function To(t, e) {
  const n = t.posAtCoords({
    left: e.clientX,
    top: e.clientY
  });
  return n && n ? Nr(t.state.doc.resolve(n.pos)) : null;
}
var Db = class {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), vl(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type != this.node.type ? !1 : (this.node = e, vl(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
  }
};
function vl(t, e, n, r, i, s) {
  var o;
  let l = 0, a = !0, c = e.firstChild;
  const d = t.firstChild;
  if (d) {
    for (let f = 0, h = 0; f < d.childCount; f++) {
      const { colspan: g, colwidth: y } = d.child(f).attrs;
      for (let v = 0; v < g; v++, h++) {
        const k = i == h ? s : y && y[v], E = k ? k + "px" : "";
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
var wt = new tt(
  "tableColumnResizing"
);
function Bb({
  handleWidth: t = 5,
  cellMinWidth: e = 25,
  View: n = Db,
  lastColumnResizable: r = !0
} = {}) {
  const i = new et({
    key: wt,
    state: {
      init(s, o) {
        return i.spec.props.nodeViews[Ze(o.schema).table.name] = (l, a) => new n(l, e, a), new Ji(-1, !1);
      },
      apply(s, o) {
        return o.apply(s);
      }
    },
    props: {
      attributes: (s) => {
        const o = wt.getState(s);
        return o && o.activeHandle > -1 ? { class: "resize-cursor" } : {};
      },
      handleDOMEvents: {
        mousemove: (s, o) => {
          $b(
            s,
            o,
            t,
            e,
            r
          );
        },
        mouseleave: (s) => {
          Hb(s);
        },
        mousedown: (s, o) => {
          Fb(s, o, e);
        }
      },
      decorations: (s) => {
        const o = wt.getState(s);
        if (o && o.activeHandle > -1)
          return Gb(s, o.activeHandle);
      },
      nodeViews: {}
    }
  });
  return i;
}
var Ji = class {
  constructor(t, e) {
    this.activeHandle = t, this.dragging = e;
  }
  apply(t) {
    const e = this, n = t.getMeta(wt);
    if (n && n.setHandle != null)
      return new Ji(n.setHandle, !1);
    if (n && n.setDragging !== void 0)
      return new Ji(e.activeHandle, n.setDragging);
    if (e.activeHandle > -1 && t.docChanged) {
      let r = t.mapping.map(e.activeHandle, -1);
      return yl(t.doc.resolve(r)) || (r = -1), new Ji(r, e.dragging);
    }
    return e;
  }
};
function $b(t, e, n, r, i) {
  const s = wt.getState(t.state);
  if (s && !s.dragging) {
    const o = Vb(e.target);
    let l = -1;
    if (o) {
      const { left: a, right: c } = o.getBoundingClientRect();
      e.clientX - a <= n ? l = fu(t, e, "left", n) : c - e.clientX <= n && (l = fu(t, e, "right", n));
    }
    if (l != s.activeHandle) {
      if (!i && l !== -1) {
        const a = t.state.doc.resolve(l), c = a.node(-1), d = Te.get(c), f = a.start(-1);
        if (d.colCount(a.pos - f) + a.nodeAfter.attrs.colspan - 1 == d.width - 1)
          return;
      }
      rp(t, l);
    }
  }
}
function Hb(t) {
  const e = wt.getState(t.state);
  e && e.activeHandle > -1 && !e.dragging && rp(t, -1);
}
function Fb(t, e, n) {
  const r = wt.getState(t.state);
  if (!r || r.activeHandle == -1 || r.dragging)
    return !1;
  const i = t.state.doc.nodeAt(r.activeHandle), s = Wb(t, r.activeHandle, i.attrs);
  t.dispatch(
    t.state.tr.setMeta(wt, {
      setDragging: { startX: e.clientX, startWidth: s }
    })
  );
  function o(a) {
    window.removeEventListener("mouseup", o), window.removeEventListener("mousemove", l);
    const c = wt.getState(t.state);
    c?.dragging && (Kb(
      t,
      c.activeHandle,
      pu(c.dragging, a, n)
    ), t.dispatch(
      t.state.tr.setMeta(wt, { setDragging: null })
    ));
  }
  function l(a) {
    if (!a.which)
      return o(a);
    const c = wt.getState(t.state);
    if (c && c.dragging) {
      const d = pu(c.dragging, a, n);
      Ub(t, c.activeHandle, d, n);
    }
  }
  return window.addEventListener("mouseup", o), window.addEventListener("mousemove", l), e.preventDefault(), !0;
}
function Wb(t, e, { colspan: n, colwidth: r }) {
  const i = r && r[r.length - 1];
  if (i)
    return i;
  const s = t.domAtPos(e);
  let l = s.node.childNodes[s.offset].offsetWidth, a = n;
  if (r)
    for (let c = 0; c < n; c++)
      r[c] && (l -= r[c], a--);
  return l / a;
}
function Vb(t) {
  for (; t && t.nodeName != "TD" && t.nodeName != "TH"; )
    t = t.classList && t.classList.contains("ProseMirror") ? null : t.parentNode;
  return t;
}
function fu(t, e, n, r) {
  const i = n == "right" ? -r : r, s = t.posAtCoords({
    left: e.clientX + i,
    top: e.clientY
  });
  if (!s)
    return -1;
  const { pos: o } = s, l = Nr(t.state.doc.resolve(o));
  if (!l)
    return -1;
  if (n == "right")
    return l.pos;
  const a = Te.get(l.node(-1)), c = l.start(-1), d = a.map.indexOf(l.pos - c);
  return d % a.width == 0 ? -1 : c + a.map[d - 1];
}
function pu(t, e, n) {
  const r = e.clientX - t.startX;
  return Math.max(n, t.startWidth + r);
}
function rp(t, e) {
  t.dispatch(
    t.state.tr.setMeta(wt, { setHandle: e })
  );
}
function Kb(t, e, n) {
  const r = t.state.doc.resolve(e), i = r.node(-1), s = Te.get(i), o = r.start(-1), l = s.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, a = t.state.tr;
  for (let c = 0; c < s.height; c++) {
    const d = c * s.width + l;
    if (c && s.map[d] == s.map[d - s.width])
      continue;
    const f = s.map[d], h = i.nodeAt(f).attrs, g = h.colspan == 1 ? 0 : l - s.colCount(f);
    if (h.colwidth && h.colwidth[g] == n)
      continue;
    const y = h.colwidth ? h.colwidth.slice() : qb(h.colspan);
    y[g] = n, a.setNodeMarkup(o + f, null, { ...h, colwidth: y });
  }
  a.docChanged && t.dispatch(a);
}
function Ub(t, e, n, r) {
  const i = t.state.doc.resolve(e), s = i.node(-1), o = i.start(-1), l = Te.get(s).colCount(i.pos - o) + i.nodeAfter.attrs.colspan - 1;
  let a = t.domAtPos(i.start(-1)).node;
  for (; a && a.nodeName != "TABLE"; )
    a = a.parentNode;
  a && vl(
    s,
    a.firstChild,
    a,
    r,
    l,
    n
  );
}
function qb(t) {
  return Array(t).fill(0);
}
function Gb(t, e) {
  const n = [], r = t.doc.resolve(e), i = r.node(-1);
  if (!i)
    return xe.empty;
  const s = Te.get(i), o = r.start(-1), l = s.colCount(r.pos - o) + r.nodeAfter.attrs.colspan;
  for (let a = 0; a < s.height; a++) {
    const c = l + a * s.width - 1;
    if ((l == s.width || s.map[c] != s.map[c + 1]) && (a == 0 || s.map[c] != s.map[c - s.width])) {
      const d = s.map[c], f = o + d + i.nodeAt(d).nodeSize - 1, h = document.createElement("div");
      h.className = "column-resize-handle", n.push(ct.widget(f, h));
    }
  }
  return xe.create(t.doc, n);
}
function Yt(t) {
  const e = t.selection, n = to(t), r = n.node(-1), i = n.start(-1), s = Te.get(r);
  return { ...e instanceof ue ? s.rectBetween(
    e.$anchorCell.pos - i,
    e.$headCell.pos - i
  ) : s.findCell(n.pos - i), tableStart: i, map: s, table: r };
}
function ip(t, { map: e, tableStart: n, table: r }, i) {
  let s = i > 0 ? -1 : 0;
  xb(e, r, i + s) && (s = i == 0 || i == e.width ? null : 0);
  for (let o = 0; o < e.height; o++) {
    const l = o * e.width + i;
    if (i > 0 && i < e.width && e.map[l - 1] == e.map[l]) {
      const a = e.map[l], c = r.nodeAt(a);
      t.setNodeMarkup(
        t.mapping.map(n + a),
        null,
        Qf(c.attrs, i - e.colCount(a))
      ), o += c.attrs.rowspan - 1;
    } else {
      const a = s == null ? Ze(r.type.schema).cell : r.nodeAt(e.map[l + s]).type, c = e.positionAt(o, i, r);
      t.insert(t.mapping.map(n + c), a.createAndFill());
    }
  }
  return t;
}
function Jb(t, e) {
  if (!Rt(t))
    return !1;
  if (e) {
    const n = Yt(t);
    e(ip(t.tr, n, n.left));
  }
  return !0;
}
function Yb(t, e) {
  if (!Rt(t))
    return !1;
  if (e) {
    const n = Yt(t);
    e(ip(t.tr, n, n.right));
  }
  return !0;
}
function Xb(t, { map: e, table: n, tableStart: r }, i) {
  const s = t.mapping.maps.length;
  for (let o = 0; o < e.height; ) {
    const l = o * e.width + i, a = e.map[l], c = n.nodeAt(a), d = c.attrs;
    if (i > 0 && e.map[l - 1] == a || i < e.width - 1 && e.map[l + 1] == a)
      t.setNodeMarkup(
        t.mapping.slice(s).map(r + a),
        null,
        qn(d, i - e.colCount(a))
      );
    else {
      const f = t.mapping.slice(s).map(r + a);
      t.delete(f, f + c.nodeSize);
    }
    o += d.rowspan;
  }
}
function Qb(t, e) {
  if (!Rt(t))
    return !1;
  if (e) {
    const n = Yt(t), r = t.tr;
    if (n.left == 0 && n.right == n.map.width)
      return !1;
    for (let i = n.right - 1; Xb(r, n, i), i != n.left; i--) {
      const s = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!s)
        throw RangeError("No table found");
      n.table = s, n.map = Te.get(s);
    }
    e(r);
  }
  return !0;
}
function Zb(t, e, n) {
  var r;
  const i = Ze(e.type.schema).header_cell;
  for (let s = 0; s < t.width; s++)
    if (((r = e.nodeAt(t.map[s + n * t.width])) == null ? void 0 : r.type) != i)
      return !1;
  return !0;
}
function sp(t, { map: e, tableStart: n, table: r }, i) {
  var s;
  let o = n;
  for (let c = 0; c < i; c++)
    o += r.child(c).nodeSize;
  const l = [];
  let a = i > 0 ? -1 : 0;
  Zb(e, r, i + a) && (a = i == 0 || i == e.height ? null : 0);
  for (let c = 0, d = e.width * i; c < e.width; c++, d++)
    if (i > 0 && i < e.height && e.map[d] == e.map[d - e.width]) {
      const f = e.map[d], h = r.nodeAt(f).attrs;
      t.setNodeMarkup(n + f, null, {
        ...h,
        rowspan: h.rowspan + 1
      }), c += h.colspan - 1;
    } else {
      const f = a == null ? Ze(r.type.schema).cell : (s = r.nodeAt(e.map[d + a * e.width])) == null ? void 0 : s.type, h = f?.createAndFill();
      h && l.push(h);
    }
  return t.insert(o, Ze(r.type.schema).row.create(null, l)), t;
}
function ev(t, e) {
  if (!Rt(t))
    return !1;
  if (e) {
    const n = Yt(t);
    e(sp(t.tr, n, n.top));
  }
  return !0;
}
function tv(t, e) {
  if (!Rt(t))
    return !1;
  if (e) {
    const n = Yt(t);
    e(sp(t.tr, n, n.bottom));
  }
  return !0;
}
function nv(t, { map: e, table: n, tableStart: r }, i) {
  let s = 0;
  for (let a = 0; a < i; a++)
    s += n.child(a).nodeSize;
  const o = s + n.child(i).nodeSize, l = t.mapping.maps.length;
  t.delete(s + r, o + r);
  for (let a = 0, c = i * e.width; a < e.width; a++, c++) {
    const d = e.map[c];
    if (i > 0 && d == e.map[c - e.width]) {
      const f = n.nodeAt(d).attrs;
      t.setNodeMarkup(t.mapping.slice(l).map(d + r), null, {
        ...f,
        rowspan: f.rowspan - 1
      }), a += f.colspan - 1;
    } else if (i < e.width && d == e.map[c + e.width]) {
      const f = n.nodeAt(d), h = f.attrs, g = f.type.create(
        { ...h, rowspan: f.attrs.rowspan - 1 },
        f.content
      ), y = e.positionAt(i + 1, a, n);
      t.insert(t.mapping.slice(l).map(r + y), g), a += h.colspan - 1;
    }
  }
}
function rv(t, e) {
  if (!Rt(t))
    return !1;
  if (e) {
    const n = Yt(t), r = t.tr;
    if (n.top == 0 && n.bottom == n.map.height)
      return !1;
    for (let i = n.bottom - 1; nv(r, n, i), i != n.top; i--) {
      const s = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
      if (!s)
        throw RangeError("No table found");
      n.table = s, n.map = Te.get(n.table);
    }
    e(r);
  }
  return !0;
}
function hu(t) {
  const e = t.content;
  return e.childCount == 1 && e.child(0).isTextblock && e.child(0).childCount == 0;
}
function iv({ width: t, height: e, map: n }, r) {
  let i = r.top * t + r.left, s = i, o = (r.bottom - 1) * t + r.left, l = i + (r.right - r.left - 1);
  for (let a = r.top; a < r.bottom; a++) {
    if (r.left > 0 && n[s] == n[s - 1] || r.right < t && n[l] == n[l + 1])
      return !0;
    s += t, l += t;
  }
  for (let a = r.left; a < r.right; a++) {
    if (r.top > 0 && n[i] == n[i - t] || r.bottom < e && n[o] == n[o + t])
      return !0;
    i++, o++;
  }
  return !1;
}
function mu(t, e) {
  const n = t.selection;
  if (!(n instanceof ue) || n.$anchorCell.pos == n.$headCell.pos)
    return !1;
  const r = Yt(t), { map: i } = r;
  if (iv(i, r))
    return !1;
  if (e) {
    const s = t.tr, o = {};
    let l = H.empty, a, c;
    for (let d = r.top; d < r.bottom; d++)
      for (let f = r.left; f < r.right; f++) {
        const h = i.map[d * i.width + f], g = r.table.nodeAt(h);
        if (!(o[h] || !g))
          if (o[h] = !0, a == null)
            a = h, c = g;
          else {
            hu(g) || (l = l.append(g.content));
            const y = s.mapping.map(h + r.tableStart);
            s.delete(y, y + g.nodeSize);
          }
      }
    if (a == null || c == null)
      return !0;
    if (s.setNodeMarkup(a + r.tableStart, null, {
      ...Qf(
        c.attrs,
        c.attrs.colspan,
        r.right - r.left - c.attrs.colspan
      ),
      rowspan: r.bottom - r.top
    }), l.size) {
      const d = a + 1 + c.content.size, f = hu(c) ? a + 1 : d;
      s.replaceWith(f + r.tableStart, d + r.tableStart, l);
    }
    s.setSelection(
      new ue(s.doc.resolve(a + r.tableStart))
    ), e(s);
  }
  return !0;
}
function gu(t, e) {
  const n = Ze(t.schema);
  return sv(({ node: r }) => n[r.type.spec.tableRole])(t, e);
}
function sv(t) {
  return (e, n) => {
    var r;
    const i = e.selection;
    let s, o;
    if (i instanceof ue) {
      if (i.$anchorCell.pos != i.$headCell.pos)
        return !1;
      s = i.$anchorCell.nodeAfter, o = i.$anchorCell.pos;
    } else {
      if (s = wb(i.$from), !s)
        return !1;
      o = (r = Nr(i.$from)) == null ? void 0 : r.pos;
    }
    if (s == null || o == null || s.attrs.colspan == 1 && s.attrs.rowspan == 1)
      return !1;
    if (n) {
      let l = s.attrs;
      const a = [], c = l.colwidth;
      l.rowspan > 1 && (l = { ...l, rowspan: 1 }), l.colspan > 1 && (l = { ...l, colspan: 1 });
      const d = Yt(e), f = e.tr;
      for (let g = 0; g < d.right - d.left; g++)
        a.push(
          c ? {
            ...l,
            colwidth: c && c[g] ? [c[g]] : null
          } : l
        );
      let h;
      for (let g = d.top; g < d.bottom; g++) {
        let y = d.map.positionAt(g, d.left, d.table);
        g == d.top && (y += s.nodeSize);
        for (let v = d.left, k = 0; v < d.right; v++, k++)
          v == d.left && g == d.top || f.insert(
            h = f.mapping.map(y + d.tableStart, 1),
            t({ node: s, row: g, col: v }).createAndFill(a[k])
          );
      }
      f.setNodeMarkup(
        o,
        t({ node: s, row: d.top, col: d.left }),
        a[0]
      ), i instanceof ue && f.setSelection(
        new ue(
          f.doc.resolve(i.$anchorCell.pos),
          h ? f.doc.resolve(h) : void 0
        )
      ), n(f);
    }
    return !0;
  };
}
function ov(t, e) {
  return function(n, r) {
    if (!Rt(n))
      return !1;
    const i = to(n);
    if (i.nodeAfter.attrs[t] === e)
      return !1;
    if (r) {
      const s = n.tr;
      n.selection instanceof ue ? n.selection.forEachCell((o, l) => {
        o.attrs[t] !== e && s.setNodeMarkup(l, null, {
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
function lv(t) {
  return function(e, n) {
    if (!Rt(e))
      return !1;
    if (n) {
      const r = Ze(e.schema), i = Yt(e), s = e.tr, o = i.map.cellsInRect(
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
      ), l = o.map((a) => i.table.nodeAt(a));
      for (let a = 0; a < o.length; a++)
        l[a].type == r.header_cell && s.setNodeMarkup(
          i.tableStart + o[a],
          r.cell,
          l[a].attrs
        );
      if (s.steps.length == 0)
        for (let a = 0; a < o.length; a++)
          s.setNodeMarkup(
            i.tableStart + o[a],
            r.header_cell,
            l[a].attrs
          );
      n(s);
    }
    return !0;
  };
}
function yu(t, e, n) {
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
function fi(t, e) {
  return e = e || { useDeprecatedLogic: !1 }, e.useDeprecatedLogic ? lv(t) : function(n, r) {
    if (!Rt(n))
      return !1;
    if (r) {
      const i = Ze(n.schema), s = Yt(n), o = n.tr, l = yu("row", s, i), a = yu(
        "column",
        s,
        i
      ), d = (t === "column" ? l : t === "row" ? a : !1) ? 1 : 0, f = t == "column" ? {
        left: 0,
        top: d,
        right: 1,
        bottom: s.map.height
      } : t == "row" ? {
        left: d,
        top: 0,
        right: s.map.width,
        bottom: 1
      } : s, h = t == "column" ? a ? i.cell : i.header_cell : t == "row" ? l ? i.cell : i.header_cell : i.cell;
      s.map.cellsInRect(f).forEach((g) => {
        const y = g + s.tableStart, v = o.doc.nodeAt(y);
        v && o.setNodeMarkup(y, h, v.attrs);
      }), r(o);
    }
    return !0;
  };
}
fi("row", {
  useDeprecatedLogic: !0
});
fi("column", {
  useDeprecatedLogic: !0
});
var av = fi("cell", {
  useDeprecatedLogic: !0
});
function cv(t, e) {
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
function bu(t) {
  return function(e, n) {
    if (!Rt(e))
      return !1;
    const r = cv(to(e), t);
    if (r == null)
      return !1;
    if (n) {
      const i = e.doc.resolve(r);
      n(
        e.tr.setSelection(ne.between(i, kb(i))).scrollIntoView()
      );
    }
    return !0;
  };
}
function uv(t, e) {
  const n = t.selection.$anchor;
  for (let r = n.depth; r > 0; r--)
    if (n.node(r).type.spec.tableRole == "table")
      return e && e(
        t.tr.delete(n.before(r), n.after(r)).scrollIntoView()
      ), !0;
  return !1;
}
function dv({
  allowTableNodeSelection: t = !1
} = {}) {
  return new et({
    key: un,
    // This piece of state is used to remember when a mouse-drag
    // cell-selection is happening, so that it can continue even as
    // transactions (which might move its anchor cell) come in.
    state: {
      init() {
        return null;
      },
      apply(e, n) {
        const r = e.getMeta(un);
        if (r != null)
          return r == -1 ? null : r;
        if (n == null || !e.docChanged)
          return n;
        const { deleted: i, pos: s } = e.mapping.mapResult(n);
        return i ? null : s;
      }
    },
    props: {
      decorations: Sb,
      handleDOMEvents: {
        mousedown: zb
      },
      createSelectionBetween(e) {
        return un.getState(e.state) != null ? e.state.selection : null;
      },
      handleTripleClick: Nb,
      handleKeyDown: Ib,
      handlePaste: Lb
    },
    appendTransaction(e, n, r) {
      return Mb(
        r,
        tp(r, n),
        t
      );
    }
  });
}
function vu(t, e, n, r, i, s) {
  let o = 0, l = !0, a = e.firstChild;
  const c = t.firstChild;
  for (let d = 0, f = 0; d < c.childCount; d += 1) {
    const { colspan: h, colwidth: g } = c.child(d).attrs;
    for (let y = 0; y < h; y += 1, f += 1) {
      const v = i === f ? s : g && g[y], k = v ? `${v}px` : "";
      o += v || r, v || (l = !1), a ? (a.style.width !== k && (a.style.width = k), a = a.nextSibling) : e.appendChild(document.createElement("col")).style.width = k;
    }
  }
  for (; a; ) {
    const d = a.nextSibling;
    a.parentNode.removeChild(a), a = d;
  }
  l ? (n.style.width = `${o}px`, n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = `${o}px`);
}
class fv {
  constructor(e, n) {
    this.node = e, this.cellMinWidth = n, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.colgroup = this.table.appendChild(document.createElement("colgroup")), vu(e, this.colgroup, this.table, n), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(e) {
    return e.type !== this.node.type ? !1 : (this.node = e, vu(e, this.colgroup, this.table, this.cellMinWidth), !0);
  }
  ignoreMutation(e) {
    return e.type === "attributes" && (e.target === this.table || this.colgroup.contains(e.target));
  }
}
function wu(t, e) {
  return e ? t.createChecked(null, e) : t.createAndFill();
}
function pv(t) {
  if (t.cached.tableNodeTypes)
    return t.cached.tableNodeTypes;
  const e = {};
  return Object.keys(t.nodes).forEach((n) => {
    const r = t.nodes[n];
    r.spec.tableRole && (e[r.spec.tableRole] = r);
  }), t.cached.tableNodeTypes = e, e;
}
function hv(t, e, n, r, i) {
  const s = pv(t), o = [], l = [];
  for (let c = 0; c < n; c += 1) {
    const d = wu(s.cell, i);
    if (d && l.push(d), r) {
      const f = wu(s.header_cell, i);
      f && o.push(f);
    }
  }
  const a = [];
  for (let c = 0; c < e; c += 1)
    a.push(s.row.createChecked(null, r && c === 0 ? o : l));
  return s.table.createChecked(null, a);
}
function mv(t) {
  return t instanceof ue;
}
const Ni = ({ editor: t }) => {
  const { selection: e } = t.state;
  if (!mv(e))
    return !1;
  let n = 0;
  const r = Kf(e.ranges[0].$from, (s) => s.type.name === "table");
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
      View: fv,
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
    return ["table", me(this.options.HTMLAttributes, t), ["tbody", 0]];
  },
  addCommands() {
    return {
      insertTable: ({ rows: t = 3, cols: e = 3, withHeaderRow: n = !0 } = {}) => ({ tr: r, dispatch: i, editor: s }) => {
        const o = hv(s.schema, t, e, n);
        if (i) {
          const l = r.selection.anchor + 1;
          r.replaceSelectionWith(o).scrollIntoView().setSelection(ne.near(r.doc.resolve(l)));
        }
        return !0;
      },
      addColumnBefore: () => ({ state: t, dispatch: e }) => Jb(t, e),
      addColumnAfter: () => ({ state: t, dispatch: e }) => Yb(t, e),
      deleteColumn: () => ({ state: t, dispatch: e }) => Qb(t, e),
      addRowBefore: () => ({ state: t, dispatch: e }) => ev(t, e),
      addRowAfter: () => ({ state: t, dispatch: e }) => tv(t, e),
      deleteRow: () => ({ state: t, dispatch: e }) => rv(t, e),
      deleteTable: () => ({ state: t, dispatch: e }) => uv(t, e),
      mergeCells: () => ({ state: t, dispatch: e }) => mu(t, e),
      splitCell: () => ({ state: t, dispatch: e }) => gu(t, e),
      toggleHeaderColumn: () => ({ state: t, dispatch: e }) => fi("column")(t, e),
      toggleHeaderRow: () => ({ state: t, dispatch: e }) => fi("row")(t, e),
      toggleHeaderCell: () => ({ state: t, dispatch: e }) => av(t, e),
      mergeOrSplit: () => ({ state: t, dispatch: e }) => mu(t, e) ? !0 : gu(t, e),
      setCellAttribute: (t, e) => ({ state: n, dispatch: r }) => ov(t, e)(n, r),
      goToNextCell: () => ({ state: t, dispatch: e }) => bu(1)(t, e),
      goToPreviousCell: () => ({ state: t, dispatch: e }) => bu(-1)(t, e),
      fixTables: () => ({ state: t, dispatch: e }) => (e && tp(t), !0),
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
      Backspace: Ni,
      "Mod-Backspace": Ni,
      Delete: Ni,
      "Mod-Delete": Ni
    };
  },
  addProseMirrorPlugins() {
    return [
      ...this.options.resizable && this.editor.isEditable ? [
        Bb({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          // @ts-ignore (incorrect type)
          View: this.options.View,
          // TODO: PR for @types/prosemirror-tables
          // @ts-ignore (incorrect type)
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      dv({
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
    return ["td", me(this.options.HTMLAttributes, t), 0];
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
    return ["th", me(this.options.HTMLAttributes, t), 0];
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
    return ["tr", me(this.options.HTMLAttributes, t), 0];
  }
});
const _u = (t) => new Promise((e) => {
  let n = new FileReader();
  n.onloadend = () => {
    e(n.result);
  }, n.readAsDataURL(t);
}), gv = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
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
      Uf({
        find: gv,
        type: this.type,
        getAttributes: (t) => {
          const [, , e, n, r] = t;
          return { src: n, alt: e, title: r };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    return [yv()];
  }
});
const yv = () => new et({
  props: {
    handlePaste(t, e, n) {
      const r = Array.from(e.clipboardData?.items || []), { schema: i } = t.state;
      return r.forEach((s) => {
        const o = s.getAsFile();
        o && s.type.indexOf("image") === 0 && (e.preventDefault(), _u(o).then((l) => {
          const a = i.nodes.image.create({
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
        const { schema: i } = t.state, s = t.posAtCoords({
          left: e.clientX,
          top: e.clientY
        });
        return s ? (r.forEach(async (o) => {
          _u(o).then((l) => {
            const a = i.nodes.image.create({
              src: l
            }), c = t.state.tr.insert(s.pos, a);
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
        let i = document.createElement("div");
        i.className = "absolute top-0 right-0 text-xs m-2 bg-gray-800 text-white px-2 py-1 rounded-md", i.innerHTML = "Video", n.append(i);
      }
      return n.append(r), {
        dom: n
      };
    };
  }
});
const bv = "aaa1rp3barth4b0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0faromeo7ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4vianca6w0s2x0a2z0ure5ba0by2idu3namex3narepublic11d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2ntley5rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re2s2c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y0eats7k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0cast4mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking0channel11l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dabur3d1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t0isalat7u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0at2delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d0network8tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntdoor4ier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0ardian6cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5gtv3iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0eles2s3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6logistics9properties14fh2g1h1i0a1ds2m1nder2le4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3ncaster5ia3d0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4de2k2psy3ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0cys3drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7serati6ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic3tual5v1w1x1y1z2na0b1goya4me2tura4vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rthwesternmutual14on4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9dnavy5lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3ssagens7y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0america6xi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cher3ks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0a1b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp2w2ell3ia1ksha5oes2p0ping5uji3w0time7i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ffany5ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0channel7ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lkswagen7vo3te1ing3o2yage5u0elos6wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4finity6ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2", vv = "ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5تصالات6رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2", Tr = (t, e) => {
  for (const n in e)
    t[n] = e[n];
  return t;
}, wl = "numeric", _l = "ascii", kl = "alpha", Yi = "asciinumeric", Li = "alphanumeric", xl = "domain", op = "emoji", wv = "scheme", _v = "slashscheme", ku = "whitespace";
function kv(t, e) {
  return t in e || (e[t] = []), e[t];
}
function Hn(t, e, n) {
  e[wl] && (e[Yi] = !0, e[Li] = !0), e[_l] && (e[Yi] = !0, e[kl] = !0), e[Yi] && (e[Li] = !0), e[kl] && (e[Li] = !0), e[Li] && (e[xl] = !0), e[op] && (e[xl] = !0);
  for (const r in e) {
    const i = kv(r, n);
    i.indexOf(t) < 0 && i.push(t);
  }
}
function xv(t, e) {
  const n = {};
  for (const r in e)
    e[r].indexOf(t) >= 0 && (n[r] = !0);
  return n;
}
function lt(t) {
  t === void 0 && (t = null), this.j = {}, this.jr = [], this.jd = null, this.t = t;
}
lt.groups = {};
lt.prototype = {
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
    r = r || lt.groups;
    let i;
    return e && e.j ? i = e : (i = new lt(e), n && r && Hn(e, n, r)), this.jr.push([t, i]), i;
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
    r = r || lt.groups;
    const i = this;
    if (e && e.j)
      return i.j[t] = e, e;
    const s = e;
    let o, l = i.go(t);
    if (l ? (o = new lt(), Tr(o.j, l.j), o.jr.push.apply(o.jr, l.jr), o.jd = l.jd, o.t = l.t) : o = new lt(), s) {
      if (r)
        if (o.t && typeof o.t == "string") {
          const a = Tr(xv(o.t, r), n);
          Hn(s, a, r);
        } else
          n && Hn(s, n, r);
      o.t = s;
    }
    return i.j[t] = o, o;
  }
};
const X = (t, e, n, r, i) => t.ta(e, n, r, i), gt = (t, e, n, r, i) => t.tr(e, n, r, i), xu = (t, e, n, r, i) => t.ts(e, n, r, i), F = (t, e, n, r, i) => t.tt(e, n, r, i), Xt = "WORD", Sl = "UWORD", pi = "LOCALHOST", Cl = "TLD", El = "UTLD", Xi = "SCHEME", ir = "SLASH_SCHEME", Aa = "NUM", lp = "WS", Ta = "NL", cr = "OPENBRACE", Zr = "OPENBRACKET", ei = "OPENANGLEBRACKET", ti = "OPENPAREN", Ln = "CLOSEBRACE", ur = "CLOSEBRACKET", dr = "CLOSEANGLEBRACKET", zn = "CLOSEPAREN", ws = "AMPERSAND", _s = "APOSTROPHE", ks = "ASTERISK", cn = "AT", xs = "BACKSLASH", Ss = "BACKTICK", Cs = "CARET", dn = "COLON", Oa = "COMMA", Es = "DOLLAR", Dt = "DOT", Ms = "EQUALS", ja = "EXCLAMATION", Bt = "HYPHEN", As = "PERCENT", Ts = "PIPE", Os = "PLUS", js = "POUND", Ps = "QUERY", Pa = "QUOTE", Ra = "SEMI", $t = "SLASH", ni = "TILDE", Rs = "UNDERSCORE", ap = "EMOJI", Is = "SYM";
var cp = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD: Xt,
  UWORD: Sl,
  LOCALHOST: pi,
  TLD: Cl,
  UTLD: El,
  SCHEME: Xi,
  SLASH_SCHEME: ir,
  NUM: Aa,
  WS: lp,
  NL: Ta,
  OPENBRACE: cr,
  OPENBRACKET: Zr,
  OPENANGLEBRACKET: ei,
  OPENPAREN: ti,
  CLOSEBRACE: Ln,
  CLOSEBRACKET: ur,
  CLOSEANGLEBRACKET: dr,
  CLOSEPAREN: zn,
  AMPERSAND: ws,
  APOSTROPHE: _s,
  ASTERISK: ks,
  AT: cn,
  BACKSLASH: xs,
  BACKTICK: Ss,
  CARET: Cs,
  COLON: dn,
  COMMA: Oa,
  DOLLAR: Es,
  DOT: Dt,
  EQUALS: Ms,
  EXCLAMATION: ja,
  HYPHEN: Bt,
  PERCENT: As,
  PIPE: Ts,
  PLUS: Os,
  POUND: js,
  QUERY: Ps,
  QUOTE: Pa,
  SEMI: Ra,
  SLASH: $t,
  TILDE: ni,
  UNDERSCORE: Rs,
  EMOJI: ap,
  SYM: Is
});
const tr = /[a-z]/, Oo = /\p{L}/u, jo = /\p{Emoji}/u, Po = /\d/, Su = /\s/, Cu = `
`, Sv = "️", Cv = "‍";
let zi = null, Di = null;
function Ev(t) {
  t === void 0 && (t = []);
  const e = {};
  lt.groups = e;
  const n = new lt();
  zi == null && (zi = Eu(bv)), Di == null && (Di = Eu(vv)), F(n, "'", _s), F(n, "{", cr), F(n, "[", Zr), F(n, "<", ei), F(n, "(", ti), F(n, "}", Ln), F(n, "]", ur), F(n, ">", dr), F(n, ")", zn), F(n, "&", ws), F(n, "*", ks), F(n, "@", cn), F(n, "`", Ss), F(n, "^", Cs), F(n, ":", dn), F(n, ",", Oa), F(n, "$", Es), F(n, ".", Dt), F(n, "=", Ms), F(n, "!", ja), F(n, "-", Bt), F(n, "%", As), F(n, "|", Ts), F(n, "+", Os), F(n, "#", js), F(n, "?", Ps), F(n, '"', Pa), F(n, "/", $t), F(n, ";", Ra), F(n, "~", ni), F(n, "_", Rs), F(n, "\\", xs);
  const r = gt(n, Po, Aa, {
    [wl]: !0
  });
  gt(r, Po, r);
  const i = gt(n, tr, Xt, {
    [_l]: !0
  });
  gt(i, tr, i);
  const s = gt(n, Oo, Sl, {
    [kl]: !0
  });
  gt(s, tr), gt(s, Oo, s);
  const o = gt(n, Su, lp, {
    [ku]: !0
  });
  F(n, Cu, Ta, {
    [ku]: !0
  }), F(o, Cu), gt(o, Su, o);
  const l = gt(n, jo, ap, {
    [op]: !0
  });
  gt(l, jo, l), F(l, Sv, l);
  const a = F(l, Cv);
  gt(a, jo, l);
  const c = [[tr, i]], d = [[tr, null], [Oo, s]];
  for (let f = 0; f < zi.length; f++)
    nn(n, zi[f], Cl, Xt, c);
  for (let f = 0; f < Di.length; f++)
    nn(n, Di[f], El, Sl, d);
  Hn(Cl, {
    tld: !0,
    ascii: !0
  }, e), Hn(El, {
    utld: !0,
    alpha: !0
  }, e), nn(n, "file", Xi, Xt, c), nn(n, "mailto", Xi, Xt, c), nn(n, "http", ir, Xt, c), nn(n, "https", ir, Xt, c), nn(n, "ftp", ir, Xt, c), nn(n, "ftps", ir, Xt, c), Hn(Xi, {
    scheme: !0,
    ascii: !0
  }, e), Hn(ir, {
    slashscheme: !0,
    ascii: !0
  }, e), t = t.sort((f, h) => f[0] > h[0] ? 1 : -1);
  for (let f = 0; f < t.length; f++) {
    const h = t[f][0], y = t[f][1] ? {
      [wv]: !0
    } : {
      [_v]: !0
    };
    h.indexOf("-") >= 0 ? y[xl] = !0 : tr.test(h) ? Po.test(h) ? y[Yi] = !0 : y[_l] = !0 : y[wl] = !0, xu(n, h, h, y);
  }
  return xu(n, "localhost", pi, {
    ascii: !0
  }), n.jd = new lt(Is), {
    start: n,
    tokens: Tr({
      groups: e
    }, cp)
  };
}
function Mv(t, e) {
  const n = Av(e.replace(/[A-Z]/g, (l) => l.toLowerCase())), r = n.length, i = [];
  let s = 0, o = 0;
  for (; o < r; ) {
    let l = t, a = null, c = 0, d = null, f = -1, h = -1;
    for (; o < r && (a = l.go(n[o])); )
      l = a, l.accepts() ? (f = 0, h = 0, d = l) : f >= 0 && (f += n[o].length, h++), c += n[o].length, s += n[o].length, o++;
    s -= f, o -= h, c -= f, i.push({
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
function Av(t) {
  const e = [], n = t.length;
  let r = 0;
  for (; r < n; ) {
    let i = t.charCodeAt(r), s, o = i < 55296 || i > 56319 || r + 1 === n || (s = t.charCodeAt(r + 1)) < 56320 || s > 57343 ? t[r] : t.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function nn(t, e, n, r, i) {
  let s;
  const o = e.length;
  for (let l = 0; l < o - 1; l++) {
    const a = e[l];
    t.j[a] ? s = t.j[a] : (s = new lt(r), s.jr = i.slice(), t.j[a] = s), t = s;
  }
  return s = new lt(n), s.jr = i.slice(), t.j[e[o - 1]] = s, s;
}
function Eu(t) {
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
const hi = {
  defaultProtocol: "http",
  events: null,
  format: Mu,
  formatHref: Mu,
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
function Ia(t, e) {
  e === void 0 && (e = null);
  let n = Tr({}, hi);
  t && (n = Tr(n, t instanceof Ia ? t.o : t));
  const r = n.ignoreTags, i = [];
  for (let s = 0; s < r.length; s++)
    i.push(r[s].toUpperCase());
  this.o = n, e && (this.defaultRender = e), this.ignoreTags = i;
}
Ia.prototype = {
  o: hi,
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
    return i && (typeof i == "object" ? (i = n.t in i ? i[n.t] : hi[t], typeof i == "function" && r && (i = i(e, n))) : typeof i == "function" && r && (i = i(e, n.t, n)), i);
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
function Mu(t) {
  return t;
}
function up(t, e) {
  this.t = "token", this.v = t, this.tk = e;
}
up.prototype = {
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
    return t === void 0 && (t = hi.defaultProtocol), {
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
    const e = this, n = this.toHref(t.get("defaultProtocol")), r = t.get("formatHref", n, this), i = t.get("tagName", n, e), s = this.toFormattedString(t), o = {}, l = t.get("className", n, e), a = t.get("target", n, e), c = t.get("rel", n, e), d = t.getObj("attributes", n, e), f = t.getObj("events", n, e);
    return o.href = r, l && (o.class = l), a && (o.target = a), c && (o.rel = c), d && Tr(o, d), {
      tagName: i,
      attributes: o,
      content: s,
      eventListeners: f
    };
  }
};
function no(t, e) {
  class n extends up {
    constructor(i, s) {
      super(i, s), this.t = t;
    }
  }
  for (const r in e)
    n.prototype[r] = e[r];
  return n.t = t, n;
}
const Au = no("email", {
  isLink: !0,
  toHref() {
    return "mailto:" + this.toString();
  }
}), Tu = no("text"), Tv = no("nl"), On = no("url", {
  isLink: !0,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(t) {
    return t === void 0 && (t = hi.defaultProtocol), this.hasProtocol() ? this.v : `${t}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const t = this.tk;
    return t.length >= 2 && t[0].t !== pi && t[1].t === dn;
  }
}), De = (t) => new lt(t);
function Ov(t) {
  let {
    groups: e
  } = t;
  const n = e.domain.concat([ws, ks, cn, xs, Ss, Cs, Es, Ms, Bt, Aa, As, Ts, Os, js, $t, Is, ni, Rs]), r = [_s, dr, Ln, ur, zn, dn, Oa, Dt, ja, ei, cr, Zr, ti, Ps, Pa, Ra], i = [ws, _s, ks, xs, Ss, Cs, Ln, Es, Ms, Bt, cr, As, Ts, Os, js, Ps, $t, Is, ni, Rs], s = De(), o = F(s, ni);
  X(o, i, o), X(o, e.domain, o);
  const l = De(), a = De(), c = De();
  X(s, e.domain, l), X(s, e.scheme, a), X(s, e.slashscheme, c), X(l, i, o), X(l, e.domain, l);
  const d = F(l, cn);
  F(o, cn, d), F(a, cn, d), F(c, cn, d);
  const f = F(o, Dt);
  X(f, i, o), X(f, e.domain, o);
  const h = De();
  X(d, e.domain, h), X(h, e.domain, h);
  const g = F(h, Dt);
  X(g, e.domain, h);
  const y = De(Au);
  X(g, e.tld, y), X(g, e.utld, y), F(d, pi, y);
  const v = F(h, Bt);
  X(v, e.domain, h), X(y, e.domain, h), F(y, Dt, g), F(y, Bt, v);
  const k = F(y, dn);
  X(k, e.numeric, Au);
  const E = F(l, Bt), T = F(l, Dt);
  X(E, e.domain, l), X(T, i, o), X(T, e.domain, l);
  const j = De(On);
  X(T, e.tld, j), X(T, e.utld, j), X(j, e.domain, l), X(j, i, o), F(j, Dt, T), F(j, Bt, E), F(j, cn, d);
  const u = F(j, dn), m = De(On);
  X(u, e.numeric, m);
  const p = De(On), b = De();
  X(p, n, p), X(p, r, b), X(b, n, p), X(b, r, b), F(j, $t, p), F(m, $t, p);
  const w = F(a, dn), S = F(c, dn), x = F(S, $t), A = F(x, $t);
  X(a, e.domain, l), F(a, Dt, T), F(a, Bt, E), X(c, e.domain, l), F(c, Dt, T), F(c, Bt, E), X(w, e.domain, p), F(w, $t, p), X(A, e.domain, p), X(A, n, p), F(A, $t, p);
  const B = F(p, cr), L = F(p, Zr), R = F(p, ei), N = F(p, ti);
  F(b, cr, B), F(b, Zr, L), F(b, ei, R), F(b, ti, N), F(B, Ln, p), F(L, ur, p), F(R, dr, p), F(N, zn, p), F(B, Ln, p);
  const _ = De(On), O = De(On), I = De(On), W = De(On);
  X(B, n, _), X(L, n, O), X(R, n, I), X(N, n, W);
  const te = De(), U = De(), le = De(), ge = De();
  return X(B, r), X(L, r), X(R, r), X(N, r), X(_, n, _), X(O, n, O), X(I, n, I), X(W, n, W), X(_, r, _), X(O, r, O), X(I, r, I), X(W, r, W), X(te, n, te), X(U, n, O), X(le, n, I), X(ge, n, W), X(te, r, te), X(U, r, U), X(le, r, le), X(ge, r, ge), F(O, ur, p), F(I, dr, p), F(W, zn, p), F(_, Ln, p), F(U, ur, p), F(le, dr, p), F(ge, zn, p), F(te, zn, p), F(s, pi, j), F(s, Ta, Tv), {
    start: s,
    tokens: cp
  };
}
function jv(t, e, n) {
  let r = n.length, i = 0, s = [], o = [];
  for (; i < r; ) {
    let l = t, a = null, c = null, d = 0, f = null, h = -1;
    for (; i < r && !(a = l.go(n[i].t)); )
      o.push(n[i++]);
    for (; i < r && (c = a || l.go(n[i].t)); )
      a = null, l = c, l.accepts() ? (h = 0, f = l) : h >= 0 && h++, i++, d++;
    if (h < 0)
      i -= d, i < r && (o.push(n[i]), i++);
    else {
      o.length > 0 && (s.push(Ro(Tu, e, o)), o = []), i -= h, d -= h;
      const g = f.t, y = n.slice(i - d, i);
      s.push(Ro(g, e, y));
    }
  }
  return o.length > 0 && s.push(Ro(Tu, e, o)), s;
}
function Ro(t, e, n) {
  const r = n[0].s, i = n[n.length - 1].e, s = e.slice(r, i);
  return new t(s, n);
}
const Pv = typeof console < "u" && console && console.warn || (() => {
}), Rv = "until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.", ke = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: !1
};
function Iv() {
  lt.groups = {}, ke.scanner = null, ke.parser = null, ke.tokenQueue = [], ke.pluginQueue = [], ke.customSchemes = [], ke.initialized = !1;
}
function Ou(t, e) {
  if (e === void 0 && (e = !1), ke.initialized && Pv(`linkifyjs: already initialized - will not register custom scheme "${t}" ${Rv}`), !/^[0-9a-z]+(-[0-9a-z]+)*$/.test(t))
    throw new Error(`linkifyjs: incorrect scheme format.
 1. Must only contain digits, lowercase ASCII letters or "-"
 2. Cannot start or end with "-"
 3. "-" cannot repeat`);
  ke.customSchemes.push([t, e]);
}
function Nv() {
  ke.scanner = Ev(ke.customSchemes);
  for (let t = 0; t < ke.tokenQueue.length; t++)
    ke.tokenQueue[t][1]({
      scanner: ke.scanner
    });
  ke.parser = Ov(ke.scanner.tokens);
  for (let t = 0; t < ke.pluginQueue.length; t++)
    ke.pluginQueue[t][1]({
      scanner: ke.scanner,
      parser: ke.parser
    });
  ke.initialized = !0;
}
function Lv(t) {
  return ke.initialized || Nv(), jv(ke.parser.start, t, Mv(ke.scanner.start, t));
}
function dp(t, e, n) {
  if (e === void 0 && (e = null), n === void 0 && (n = null), e && typeof e == "object") {
    if (n)
      throw Error(`linkifyjs: Invalid link type ${e}; must be a string`);
    n = e, e = null;
  }
  const r = new Ia(n), i = Lv(t), s = [];
  for (let o = 0; o < i.length; o++) {
    const l = i[o];
    l.isLink && (!e || l.t === e) && s.push(l.toFormattedObject(r));
  }
  return s;
}
function zv(t) {
  return new et({
    key: new tt("autolink"),
    appendTransaction: (e, n, r) => {
      const i = e.some((c) => c.docChanged) && !n.doc.eq(r.doc), s = e.some((c) => c.getMeta("preventAutolink"));
      if (!i || s)
        return;
      const { tr: o } = r, l = F2(n.doc, [...e]);
      if (J2(l).forEach(({ newRange: c }) => {
        const d = V2(r.doc, c, (g) => g.isTextblock);
        let f, h;
        if (d.length > 1 ? (f = d[0], h = r.doc.textBetween(f.pos, f.pos + f.node.nodeSize, void 0, " ")) : d.length && r.doc.textBetween(c.from, c.to, " ", " ").endsWith(" ") && (f = d[0], h = r.doc.textBetween(f.pos, c.to, void 0, " ")), f && h) {
          const g = h.split(" ").filter((k) => k !== "");
          if (g.length <= 0)
            return !1;
          const y = g[g.length - 1], v = f.pos + h.lastIndexOf(y);
          if (!y)
            return !1;
          dp(y).filter((k) => k.isLink).map((k) => ({
            ...k,
            from: v + k.start + 1,
            to: v + k.end + 1
          })).filter((k) => r.schema.marks.code ? !r.doc.rangeHasMark(k.from, k.to, r.schema.marks.code) : !0).filter((k) => t.validate ? t.validate(k.value) : !0).forEach((k) => {
            Ca(k.from, k.to, r.doc).some((E) => E.mark.type === t.type) || o.addMark(k.from, k.to, t.type.create({
              href: k.href
            }));
          });
        }
      }), !!o.steps.length)
        return o;
    }
  });
}
function Dv(t) {
  return new et({
    key: new tt("handleClickLink"),
    props: {
      handleClick: (e, n, r) => {
        var i, s;
        if (r.button !== 0 || r.target.nodeName !== "A")
          return !1;
        const l = U2(e.state, t.type.name), a = r.target, c = (i = a?.href) !== null && i !== void 0 ? i : l.href, d = (s = a?.target) !== null && s !== void 0 ? s : l.target;
        return a && c ? (e.editable && window.open(c, d), !0) : !1;
      }
    }
  });
}
kt.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach((t) => {
      if (typeof t == "string") {
        Ou(t);
        return;
      }
      Ou(t.scheme, t.optionalSlashes);
    });
  },
  onDestroy() {
    Iv();
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
    return ["a", me(this.options.HTMLAttributes, t), 0];
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
      xn({
        find: (t) => dp(t).filter((e) => this.options.validate ? this.options.validate(e.value) : !0).filter((e) => e.isLink).map((e) => ({
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
    return this.options.autolink && t.push(zv({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && t.push(Dv({
      type: this.type
    })), t;
  }
});
const Bv = (t) => Oe({
  find: /--$/,
  replace: t ?? "—"
}), $v = (t) => Oe({
  find: /\.\.\.$/,
  replace: t ?? "…"
}), Hv = (t) => Oe({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(")$/,
  replace: t ?? "“"
}), Fv = (t) => Oe({
  find: /"$/,
  replace: t ?? "”"
}), Wv = (t) => Oe({
  find: /(?:^|[\s{[(<'"\u2018\u201C])(')$/,
  replace: t ?? "‘"
}), Vv = (t) => Oe({
  find: /'$/,
  replace: t ?? "’"
}), Kv = (t) => Oe({
  find: /<-$/,
  replace: t ?? "←"
}), Uv = (t) => Oe({
  find: /->$/,
  replace: t ?? "→"
}), qv = (t) => Oe({
  find: /\(c\)$/,
  replace: t ?? "©"
}), Gv = (t) => Oe({
  find: /\(tm\)$/,
  replace: t ?? "™"
}), Jv = (t) => Oe({
  find: /\(sm\)$/,
  replace: t ?? "℠"
}), Yv = (t) => Oe({
  find: /\(r\)$/,
  replace: t ?? "®"
}), Xv = (t) => Oe({
  find: /(?:^|\s)(1\/2)$/,
  replace: t ?? "½"
}), Qv = (t) => Oe({
  find: /\+\/-$/,
  replace: t ?? "±"
}), Zv = (t) => Oe({
  find: /!=$/,
  replace: t ?? "≠"
}), e3 = (t) => Oe({
  find: /<<$/,
  replace: t ?? "«"
}), t3 = (t) => Oe({
  find: />>$/,
  replace: t ?? "»"
}), n3 = (t) => Oe({
  find: /\d+\s?([*x])\s?\d+$/,
  replace: t ?? "×"
}), r3 = (t) => Oe({
  find: /\^2$/,
  replace: t ?? "²"
}), i3 = (t) => Oe({
  find: /\^3$/,
  replace: t ?? "³"
}), s3 = (t) => Oe({
  find: /(?:^|\s)(1\/4)$/,
  replace: t ?? "¼"
}), o3 = (t) => Oe({
  find: /(?:^|\s)(3\/4)$/,
  replace: t ?? "¾"
});
Ue.create({
  name: "typography",
  addInputRules() {
    const t = [];
    return this.options.emDash !== !1 && t.push(Bv(this.options.emDash)), this.options.ellipsis !== !1 && t.push($v(this.options.ellipsis)), this.options.openDoubleQuote !== !1 && t.push(Hv(this.options.openDoubleQuote)), this.options.closeDoubleQuote !== !1 && t.push(Fv(this.options.closeDoubleQuote)), this.options.openSingleQuote !== !1 && t.push(Wv(this.options.openSingleQuote)), this.options.closeSingleQuote !== !1 && t.push(Vv(this.options.closeSingleQuote)), this.options.leftArrow !== !1 && t.push(Kv(this.options.leftArrow)), this.options.rightArrow !== !1 && t.push(Uv(this.options.rightArrow)), this.options.copyright !== !1 && t.push(qv(this.options.copyright)), this.options.trademark !== !1 && t.push(Gv(this.options.trademark)), this.options.servicemark !== !1 && t.push(Jv(this.options.servicemark)), this.options.registeredTrademark !== !1 && t.push(Yv(this.options.registeredTrademark)), this.options.oneHalf !== !1 && t.push(Xv(this.options.oneHalf)), this.options.plusMinus !== !1 && t.push(Qv(this.options.plusMinus)), this.options.notEqual !== !1 && t.push(Zv(this.options.notEqual)), this.options.laquo !== !1 && t.push(e3(this.options.laquo)), this.options.raquo !== !1 && t.push(t3(this.options.raquo)), this.options.multiplication !== !1 && t.push(n3(this.options.multiplication)), this.options.superscriptTwo !== !1 && t.push(r3(this.options.superscriptTwo)), this.options.superscriptThree !== !1 && t.push(i3(this.options.superscriptThree)), this.options.oneQuarter !== !1 && t.push(s3(this.options.oneQuarter)), this.options.threeQuarters !== !1 && t.push(o3(this.options.threeQuarters)), t;
  }
});
kt.create({
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
        const n = vi(t, this.type);
        return Object.entries(n).some(([, i]) => !!i) ? !0 : e.unsetMark(this.name);
      }
    };
  }
});
const l3 = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/, a3 = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;
kt.create({
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
      Un({
        find: l3,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      xn({
        find: a3,
        type: this.type
      })
    ];
  }
});
Ue.create({
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
function c3(t) {
  var e;
  const { char: n, allowSpaces: r, allowedPrefixes: i, startOfLine: s, $position: o } = t, l = yy(n), a = new RegExp(`\\s${l}$`), c = s ? "^" : "", d = r ? new RegExp(`${c}${l}.*?(?=\\s${l}|$)`, "gm") : new RegExp(`${c}(?:^)?${l}[^\\s${l}]*`, "gm"), f = ((e = o.nodeBefore) === null || e === void 0 ? void 0 : e.isText) && o.nodeBefore.text;
  if (!f)
    return null;
  const h = o.pos - f.length, g = Array.from(f.matchAll(d)).pop();
  if (!g || g.input === void 0 || g.index === void 0)
    return null;
  const y = g.input.slice(Math.max(0, g.index - 1), g.index), v = new RegExp(`^[${i?.join("")}\0]?$`).test(y);
  if (i !== null && !v)
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
const u3 = new tt("suggestion");
function d3({ pluginKey: t = u3, editor: e, char: n = "@", allowSpaces: r = !1, allowedPrefixes: i = [" "], startOfLine: s = !1, decorationTag: o = "span", decorationClass: l = "suggestion", command: a = () => null, items: c = () => [], render: d = () => ({}), allow: f = () => !0 }) {
  let h;
  const g = d?.(), y = new et({
    key: t,
    view() {
      return {
        update: async (v, k) => {
          var E, T, j, u, m, p, b;
          const w = (E = this.key) === null || E === void 0 ? void 0 : E.getState(k), S = (T = this.key) === null || T === void 0 ? void 0 : T.getState(v.state), x = w.active && S.active && w.range.from !== S.range.from, A = !w.active && S.active, B = w.active && !S.active, L = !A && !B && w.query !== S.query, R = A || x, N = L && !x, _ = B || x;
          if (!R && !N && !_)
            return;
          const O = _ && !R ? w : S, I = v.dom.querySelector(`[data-decoration-id="${O.decorationId}"]`);
          h = {
            editor: e,
            range: O.range,
            query: O.query,
            text: O.text,
            items: [],
            command: (W) => {
              a({
                editor: e,
                range: O.range,
                props: W
              });
            },
            decorationNode: I,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: I ? () => {
              var W;
              const { decorationId: te } = (W = this.key) === null || W === void 0 ? void 0 : W.getState(e.state), U = v.dom.querySelector(`[data-decoration-id="${te}"]`);
              return U?.getBoundingClientRect() || null;
            } : null
          }, R && ((j = g?.onBeforeStart) === null || j === void 0 || j.call(g, h)), N && ((u = g?.onBeforeUpdate) === null || u === void 0 || u.call(g, h)), (N || R) && (h.items = await c({
            editor: e,
            query: O.query
          })), _ && ((m = g?.onExit) === null || m === void 0 || m.call(g, h)), N && ((p = g?.onUpdate) === null || p === void 0 || p.call(g, h)), R && ((b = g?.onStart) === null || b === void 0 || b.call(g, h));
        },
        destroy: () => {
          var v;
          h && ((v = g?.onExit) === null || v === void 0 || v.call(g, h));
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
      apply(v, k, E, T) {
        const { isEditable: j } = e, { composing: u } = e.view, { selection: m } = v, { empty: p, from: b } = m, w = { ...k };
        if (w.composing = u, j && (p || e.view.composing)) {
          (b < k.range.from || b > k.range.to) && !u && !k.composing && (w.active = !1);
          const S = c3({
            char: n,
            allowSpaces: r,
            allowedPrefixes: i,
            startOfLine: s,
            $position: m.$from
          }), x = `id_${Math.floor(Math.random() * 4294967295)}`;
          S && f({ editor: e, state: T, range: S.range }) ? (w.active = !0, w.decorationId = k.decorationId ? k.decorationId : x, w.range = S.range, w.query = S.query, w.text = S.text) : w.active = !1;
        } else
          w.active = !1;
        return w.active || (w.decorationId = null, w.range = { from: 0, to: 0 }, w.query = null, w.text = null), w;
      }
    },
    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(v, k) {
        var E;
        const { active: T, range: j } = y.getState(v.state);
        return T && ((E = g?.onKeyDown) === null || E === void 0 ? void 0 : E.call(g, { view: v, event: k, range: j })) || !1;
      },
      // Setup decorator on the currently active suggestion.
      decorations(v) {
        const { active: k, range: E, decorationId: T } = y.getState(v);
        return k ? xe.create(v.doc, [
          ct.inline(E.from, E.to, {
            nodeName: o,
            class: l,
            "data-decoration-id": T
          })
        ]) : null;
      }
    }
  });
  return y;
}
const f3 = new tt("mention");
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
        pluginKey: f3,
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
      me({ "data-type": this.name }, this.options.HTMLAttributes, e),
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
        return i ? (e.doc.nodesBetween(s - 1, s, (o, l) => {
          if (o.type.name === this.name)
            return n = !0, t.insertText(this.options.suggestion.char || "", l, l + o.nodeSize), !1;
        }), n) : !1;
      })
    };
  },
  addProseMirrorPlugins() {
    return [
      d3({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
var p3 = { exports: {} };
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
      var p = {};
      for (var b in m)
        m.hasOwnProperty(b) && (p[b] = m[b].defaultValue);
      return p;
    }
    function n() {
      var u = e(!0), m = {};
      for (var p in u)
        u.hasOwnProperty(p) && (m[p] = !0);
      return m;
    }
    var r = {}, i = {}, s = {}, o = e(!0), l = "vanilla", a = {
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
      if (!a.hasOwnProperty(u))
        throw Error(u + " flavor was not found");
      r.resetOptions();
      var m = a[u];
      l = u;
      for (var p in m)
        m.hasOwnProperty(p) && (o[p] = m[p]);
    }, r.getFlavor = function() {
      return l;
    }, r.getFlavorOptions = function(u) {
      if (a.hasOwnProperty(u))
        return a[u];
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
        var p = c(m, u);
        if (p.valid)
          s[u] = m;
        else
          throw Error(p.error);
      }
    }, r.getAllExtensions = function() {
      return s;
    }, r.removeExtension = function(u) {
      delete s[u];
    }, r.resetExtensions = function() {
      s = {};
    };
    function c(u, m) {
      var p = m ? "Error in " + m + " extension->" : "Error in unnamed extension", b = {
        valid: !0,
        error: ""
      };
      r.helper.isArray(u) || (u = [u]);
      for (var w = 0; w < u.length; ++w) {
        var S = p + " sub-extension " + w + ": ", x = u[w];
        if (typeof x != "object")
          return b.valid = !1, b.error = S + "must be an object, but " + typeof x + " given", b;
        if (!r.helper.isString(x.type))
          return b.valid = !1, b.error = S + 'property "type" must be a string, but ' + typeof x.type + " given", b;
        var A = x.type = x.type.toLowerCase();
        if (A === "language" && (A = x.type = "lang"), A === "html" && (A = x.type = "output"), A !== "lang" && A !== "output" && A !== "listener")
          return b.valid = !1, b.error = S + "type " + A + ' is not recognized. Valid values: "lang/language", "output/html" or "listener"', b;
        if (A === "listener") {
          if (r.helper.isUndefined(x.listeners))
            return b.valid = !1, b.error = S + '. Extensions of type "listener" must have a property called "listeners"', b;
        } else if (r.helper.isUndefined(x.filter) && r.helper.isUndefined(x.regex))
          return b.valid = !1, b.error = S + A + ' extensions must define either a "regex" property or a "filter" method', b;
        if (x.listeners) {
          if (typeof x.listeners != "object")
            return b.valid = !1, b.error = S + '"listeners" property must be an object but ' + typeof x.listeners + " given", b;
          for (var B in x.listeners)
            if (x.listeners.hasOwnProperty(B) && typeof x.listeners[B] != "function")
              return b.valid = !1, b.error = S + '"listeners" property must be an hash of [event name]: [callback]. listeners.' + B + " must be a function but " + typeof x.listeners[B] + " given", b;
        }
        if (x.filter) {
          if (typeof x.filter != "function")
            return b.valid = !1, b.error = S + '"filter" must be a function, but ' + typeof x.filter + " given", b;
        } else if (x.regex) {
          if (r.helper.isString(x.regex) && (x.regex = new RegExp(x.regex, "g")), !(x.regex instanceof RegExp))
            return b.valid = !1, b.error = S + '"regex" property must either be a string or a RegExp object, but ' + typeof x.regex + " given", b;
          if (r.helper.isUndefined(x.replace))
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
        for (var p = 0; p < u.length; p++)
          m(u[p], p, u);
      else if (typeof u == "object")
        for (var b in u)
          u.hasOwnProperty(b) && m(u[b], b, u);
      else
        throw new Error("obj does not seem to be an array or an iterable object");
    }, r.helper.stdExtName = function(u) {
      return u.replace(/[_?*+\/\\.^-]/g, "").replace(/\s/g, "").toLowerCase();
    };
    function d(u, m) {
      var p = m.charCodeAt(0);
      return "¨E" + p + "E";
    }
    r.helper.escapeCharactersCallback = d, r.helper.escapeCharacters = function(u, m, p) {
      var b = "([" + m.replace(/([\[\]\\])/g, "\\$1") + "])";
      p && (b = "\\\\" + b);
      var w = new RegExp(b, "g");
      return u = u.replace(w, d), u;
    }, r.helper.unescapeHTMLEntities = function(u) {
      return u.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    var f = function(u, m, p, b) {
      var w = b || "", S = w.indexOf("g") > -1, x = new RegExp(m + "|" + p, "g" + w.replace(/g/g, "")), A = new RegExp(m, w.replace(/g/g, "")), B = [], L, R, N, _, O;
      do
        for (L = 0; N = x.exec(u); )
          if (A.test(N[0]))
            L++ || (R = x.lastIndex, _ = R - N[0].length);
          else if (L && !--L) {
            O = N.index + N[0].length;
            var I = {
              left: { start: _, end: R },
              match: { start: R, end: N.index },
              right: { start: N.index, end: O },
              wholeMatch: { start: _, end: O }
            };
            if (B.push(I), !S)
              return B;
          }
      while (L && (x.lastIndex = R));
      return B;
    };
    r.helper.matchRecursiveRegExp = function(u, m, p, b) {
      for (var w = f(u, m, p, b), S = [], x = 0; x < w.length; ++x)
        S.push([
          u.slice(w[x].wholeMatch.start, w[x].wholeMatch.end),
          u.slice(w[x].match.start, w[x].match.end),
          u.slice(w[x].left.start, w[x].left.end),
          u.slice(w[x].right.start, w[x].right.end)
        ]);
      return S;
    }, r.helper.replaceRecursiveRegExp = function(u, m, p, b, w) {
      if (!r.helper.isFunction(m)) {
        var S = m;
        m = function() {
          return S;
        };
      }
      var x = f(u, p, b, w), A = u, B = x.length;
      if (B > 0) {
        var L = [];
        x[0].wholeMatch.start !== 0 && L.push(u.slice(0, x[0].wholeMatch.start));
        for (var R = 0; R < B; ++R)
          L.push(
            m(
              u.slice(x[R].wholeMatch.start, x[R].wholeMatch.end),
              u.slice(x[R].match.start, x[R].match.end),
              u.slice(x[R].left.start, x[R].left.end),
              u.slice(x[R].right.start, x[R].right.end)
            )
          ), R < B - 1 && L.push(u.slice(x[R].wholeMatch.end, x[R + 1].wholeMatch.start));
        x[B - 1].wholeMatch.end < u.length && L.push(u.slice(x[B - 1].wholeMatch.end)), A = L.join("");
      }
      return A;
    }, r.helper.regexIndexOf = function(u, m, p) {
      if (!r.helper.isString(u))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      if (!(m instanceof RegExp))
        throw "InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp";
      var b = u.substring(p || 0).search(m);
      return b >= 0 ? b + (p || 0) : b;
    }, r.helper.splitAtIndex = function(u, m) {
      if (!r.helper.isString(u))
        throw "InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string";
      return [u.substring(0, m), u.substring(m)];
    }, r.helper.encodeEmailAddress = function(u) {
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
      return u = u.replace(/./g, function(p) {
        if (p === "@")
          p = m[Math.floor(Math.random() * 2)](p);
        else {
          var b = Math.random();
          p = b > 0.9 ? m[2](p) : b > 0.45 ? m[1](p) : m[0](p);
        }
        return p;
      }), u;
    }, r.helper.padEnd = function(m, p, b) {
      return p = p >> 0, b = String(b || " "), m.length > p ? String(m) : (p = p - m.length, p > b.length && (b += b.repeat(p / b.length)), String(m) + b.slice(0, p));
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
      var m = {}, p = [], b = [], w = {}, S = l, x = {
        parsed: {},
        raw: "",
        format: ""
      };
      A();
      function A() {
        u = u || {};
        for (var _ in o)
          o.hasOwnProperty(_) && (m[_] = o[_]);
        if (typeof u == "object")
          for (var O in u)
            u.hasOwnProperty(O) && (m[O] = u[O]);
        else
          throw Error("Converter expects the passed parameter to be an object, but " + typeof u + " was passed instead.");
        m.extensions && r.helper.forEach(m.extensions, B);
      }
      function B(_, O) {
        if (O = O || null, r.helper.isString(_))
          if (_ = r.helper.stdExtName(_), O = _, r.extensions[_]) {
            console.warn("DEPRECATION WARNING: " + _ + " is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"), L(r.extensions[_], _);
            return;
          } else if (!r.helper.isUndefined(s[_]))
            _ = s[_];
          else
            throw Error('Extension "' + _ + '" could not be loaded. It was either not found or is not a valid extension.');
        typeof _ == "function" && (_ = _()), r.helper.isArray(_) || (_ = [_]);
        var I = c(_, O);
        if (!I.valid)
          throw Error(I.error);
        for (var W = 0; W < _.length; ++W) {
          switch (_[W].type) {
            case "lang":
              p.push(_[W]);
              break;
            case "output":
              b.push(_[W]);
              break;
          }
          if (_[W].hasOwnProperty("listeners"))
            for (var te in _[W].listeners)
              _[W].listeners.hasOwnProperty(te) && R(te, _[W].listeners[te]);
        }
      }
      function L(_, O) {
        typeof _ == "function" && (_ = _(new r.Converter())), r.helper.isArray(_) || (_ = [_]);
        var I = c(_, O);
        if (!I.valid)
          throw Error(I.error);
        for (var W = 0; W < _.length; ++W)
          switch (_[W].type) {
            case "lang":
              p.push(_[W]);
              break;
            case "output":
              b.push(_[W]);
              break;
            default:
              throw Error("Extension loader error: Type unrecognized!!!");
          }
      }
      function R(_, O) {
        if (!r.helper.isString(_))
          throw Error("Invalid argument in converter.listen() method: name must be a string, but " + typeof _ + " given");
        if (typeof O != "function")
          throw Error("Invalid argument in converter.listen() method: callback must be a function, but " + typeof O + " given");
        w.hasOwnProperty(_) || (w[_] = []), w[_].push(O);
      }
      function N(_) {
        var O = _.match(/^\s*/)[0].length, I = new RegExp("^\\s{0," + O + "}", "gm");
        return _.replace(I, "");
      }
      this._dispatch = function(O, I, W, te) {
        if (w.hasOwnProperty(O))
          for (var U = 0; U < w[O].length; ++U) {
            var le = w[O][U](O, I, this, W, te);
            le && typeof le < "u" && (I = le);
          }
        return I;
      }, this.listen = function(_, O) {
        return R(_, O), this;
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
        return _ = _.replace(/¨/g, "¨T"), _ = _.replace(/\$/g, "¨D"), _ = _.replace(/\r\n/g, `
`), _ = _.replace(/\r/g, `
`), _ = _.replace(/\u00A0/g, "&nbsp;"), m.smartIndentationFix && (_ = N(_)), _ = `

` + _ + `

`, _ = r.subParser("detab")(_, m, O), _ = _.replace(/^[ \t]+$/mg, ""), r.helper.forEach(p, function(I) {
          _ = r.subParser("runExtension")(I, _, m, O);
        }), _ = r.subParser("metadata")(_, m, O), _ = r.subParser("hashPreCodeTags")(_, m, O), _ = r.subParser("githubCodeBlocks")(_, m, O), _ = r.subParser("hashHTMLBlocks")(_, m, O), _ = r.subParser("hashCodeTags")(_, m, O), _ = r.subParser("stripLinkDefinitions")(_, m, O), _ = r.subParser("blockGamut")(_, m, O), _ = r.subParser("unhashHTMLSpans")(_, m, O), _ = r.subParser("unescapeSpecialChars")(_, m, O), _ = _.replace(/¨D/g, "$$"), _ = _.replace(/¨T/g, "¨"), _ = r.subParser("completeHTMLDocument")(_, m, O), r.helper.forEach(b, function(I) {
          _ = r.subParser("runExtension")(I, _, m, O);
        }), x = O.metadata, _;
      }, this.makeMarkdown = this.makeMd = function(_, O) {
        if (_ = _.replace(/\r\n/g, `
`), _ = _.replace(/\r/g, `
`), _ = _.replace(/>[ \t]+</, ">¨NBSP;<"), !O)
          if (window && window.document)
            O = window.document;
          else
            throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM");
        var I = O.createElement("div");
        I.innerHTML = _;
        var W = {
          preList: Ee(I)
        };
        ge(I);
        for (var te = I.childNodes, U = "", le = 0; le < te.length; le++)
          U += r.subParser("makeMarkdown.node")(te[le], W);
        function ge(Me) {
          for (var be = 0; be < Me.childNodes.length; ++be) {
            var Ie = Me.childNodes[be];
            Ie.nodeType === 3 ? !/\S/.test(Ie.nodeValue) && !/^[ ]+$/.test(Ie.nodeValue) ? (Me.removeChild(Ie), --be) : (Ie.nodeValue = Ie.nodeValue.split(`
`).join(" "), Ie.nodeValue = Ie.nodeValue.replace(/(\s)+/g, "$1")) : Ie.nodeType === 1 && ge(Ie);
          }
        }
        function Ee(Me) {
          for (var be = Me.querySelectorAll("pre"), Ie = [], qe = 0; qe < be.length; ++qe)
            if (be[qe].childElementCount === 1 && be[qe].firstChild.tagName.toLowerCase() === "code") {
              var It = be[qe].firstChild.innerHTML.trim(), Mn = be[qe].firstChild.getAttribute("data-language") || "";
              if (Mn === "")
                for (var Xn = be[qe].firstChild.className.split(" "), C = 0; C < Xn.length; ++C) {
                  var M = Xn[C].match(/^language-(.+)$/);
                  if (M !== null) {
                    Mn = M[1];
                    break;
                  }
                }
              It = r.helper.unescapeHTMLEntities(It), Ie.push(It), be[qe].outerHTML = '<precode language="' + Mn + '" precodenum="' + qe.toString() + '"></precode>';
            } else
              Ie.push(be[qe].innerHTML), be[qe].innerHTML = "", be[qe].setAttribute("prenum", qe.toString());
          return Ie;
        }
        return U;
      }, this.setOption = function(_, O) {
        m[_] = O;
      }, this.getOption = function(_) {
        return m[_];
      }, this.getOptions = function() {
        return m;
      }, this.addExtension = function(_, O) {
        O = O || null, B(_, O);
      }, this.useExtension = function(_) {
        B(_);
      }, this.setFlavor = function(_) {
        if (!a.hasOwnProperty(_))
          throw Error(_ + " flavor was not found");
        var O = a[_];
        S = _;
        for (var I in O)
          O.hasOwnProperty(I) && (m[I] = O[I]);
      }, this.getFlavor = function() {
        return S;
      }, this.removeExtension = function(_) {
        r.helper.isArray(_) || (_ = [_]);
        for (var O = 0; O < _.length; ++O) {
          for (var I = _[O], W = 0; W < p.length; ++W)
            p[W] === I && p.splice(W, 1);
          for (var te = 0; te < b.length; ++te)
            b[te] === I && b.splice(te, 1);
        }
      }, this.getAllExtensions = function() {
        return {
          language: p,
          output: b
        };
      }, this.getMetadata = function(_) {
        return _ ? x.raw : x.parsed;
      }, this.getMetadataFormat = function() {
        return x.format;
      }, this._setMetadataPair = function(_, O) {
        x.parsed[_] = O;
      }, this._setMetadataFormat = function(_) {
        x.format = _;
      }, this._setMetadataRaw = function(_) {
        x.raw = _;
      };
    }, r.subParser("anchors", function(u, m, p) {
      u = p.converter._dispatch("anchors.before", u, m, p);
      var b = function(w, S, x, A, B, L, R) {
        if (r.helper.isUndefined(R) && (R = ""), x = x.toLowerCase(), w.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          A = "";
        else if (!A)
          if (x || (x = S.toLowerCase().replace(/ ?\n/g, " ")), A = "#" + x, !r.helper.isUndefined(p.gUrls[x]))
            A = p.gUrls[x], r.helper.isUndefined(p.gTitles[x]) || (R = p.gTitles[x]);
          else
            return w;
        A = A.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var N = '<a href="' + A + '"';
        return R !== "" && R !== null && (R = R.replace(/"/g, "&quot;"), R = R.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), N += ' title="' + R + '"'), m.openLinksInNewWindow && !/^#/.test(A) && (N += ' rel="noopener noreferrer" target="¨E95Eblank"'), N += ">" + S + "</a>", N;
      };
      return u = u.replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g, b), u = u.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        b
      ), u = u.replace(
        /\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,
        b
      ), u = u.replace(/\[([^\[\]]+)]()()()()()/g, b), m.ghMentions && (u = u.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gmi, function(w, S, x, A, B) {
        if (x === "\\")
          return S + A;
        if (!r.helper.isString(m.ghMentionsLink))
          throw new Error("ghMentionsLink option must be a string");
        var L = m.ghMentionsLink.replace(/\{u}/g, B), R = "";
        return m.openLinksInNewWindow && (R = ' rel="noopener noreferrer" target="¨E95Eblank"'), S + '<a href="' + L + '"' + R + ">" + A + "</a>";
      })), u = p.converter._dispatch("anchors.after", u, m, p), u;
    });
    var h = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi, g = /([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi, y = /()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi, v = /(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gmi, k = /<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, E = function(u) {
      return function(m, p, b, w, S, x, A) {
        b = b.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var B = b, L = "", R = "", N = p || "", _ = A || "";
        return /^www\./i.test(b) && (b = b.replace(/^www\./i, "http://www.")), u.excludeTrailingPunctuationFromURLs && x && (L = x), u.openLinksInNewWindow && (R = ' rel="noopener noreferrer" target="¨E95Eblank"'), N + '<a href="' + b + '"' + R + ">" + B + "</a>" + L + _;
      };
    }, T = function(u, m) {
      return function(p, b, w) {
        var S = "mailto:";
        return b = b || "", w = r.subParser("unescapeSpecialChars")(w, u, m), u.encodeEmails ? (S = r.helper.encodeEmailAddress(S + w), w = r.helper.encodeEmailAddress(w)) : S = S + w, b + '<a href="' + S + '">' + w + "</a>";
      };
    };
    r.subParser("autoLinks", function(u, m, p) {
      return u = p.converter._dispatch("autoLinks.before", u, m, p), u = u.replace(y, E(m)), u = u.replace(k, T(m, p)), u = p.converter._dispatch("autoLinks.after", u, m, p), u;
    }), r.subParser("simplifiedAutoLinks", function(u, m, p) {
      return m.simplifiedAutoLink && (u = p.converter._dispatch("simplifiedAutoLinks.before", u, m, p), m.excludeTrailingPunctuationFromURLs ? u = u.replace(g, E(m)) : u = u.replace(h, E(m)), u = u.replace(v, T(m, p)), u = p.converter._dispatch("simplifiedAutoLinks.after", u, m, p)), u;
    }), r.subParser("blockGamut", function(u, m, p) {
      return u = p.converter._dispatch("blockGamut.before", u, m, p), u = r.subParser("blockQuotes")(u, m, p), u = r.subParser("headers")(u, m, p), u = r.subParser("horizontalRule")(u, m, p), u = r.subParser("lists")(u, m, p), u = r.subParser("codeBlocks")(u, m, p), u = r.subParser("tables")(u, m, p), u = r.subParser("hashHTMLBlocks")(u, m, p), u = r.subParser("paragraphs")(u, m, p), u = p.converter._dispatch("blockGamut.after", u, m, p), u;
    }), r.subParser("blockQuotes", function(u, m, p) {
      u = p.converter._dispatch("blockQuotes.before", u, m, p), u = u + `

`;
      var b = /(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm;
      return m.splitAdjacentBlockquotes && (b = /^ {0,3}>[\s\S]*?(?:\n\n)/gm), u = u.replace(b, function(w) {
        return w = w.replace(/^[ \t]*>[ \t]?/gm, ""), w = w.replace(/¨0/g, ""), w = w.replace(/^[ \t]+$/gm, ""), w = r.subParser("githubCodeBlocks")(w, m, p), w = r.subParser("blockGamut")(w, m, p), w = w.replace(/(^|\n)/g, "$1  "), w = w.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(S, x) {
          var A = x;
          return A = A.replace(/^  /mg, "¨0"), A = A.replace(/¨0/g, ""), A;
        }), r.subParser("hashBlock")(`<blockquote>
` + w + `
</blockquote>`, m, p);
      }), u = p.converter._dispatch("blockQuotes.after", u, m, p), u;
    }), r.subParser("codeBlocks", function(u, m, p) {
      u = p.converter._dispatch("codeBlocks.before", u, m, p), u += "¨0";
      var b = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g;
      return u = u.replace(b, function(w, S, x) {
        var A = S, B = x, L = `
`;
        return A = r.subParser("outdent")(A, m, p), A = r.subParser("encodeCode")(A, m, p), A = r.subParser("detab")(A, m, p), A = A.replace(/^\n+/g, ""), A = A.replace(/\n+$/g, ""), m.omitExtraWLInCodeBlocks && (L = ""), A = "<pre><code>" + A + L + "</code></pre>", r.subParser("hashBlock")(A, m, p) + B;
      }), u = u.replace(/¨0/, ""), u = p.converter._dispatch("codeBlocks.after", u, m, p), u;
    }), r.subParser("codeSpans", function(u, m, p) {
      return u = p.converter._dispatch("codeSpans.before", u, m, p), typeof u > "u" && (u = ""), u = u.replace(
        /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(b, w, S, x) {
          var A = x;
          return A = A.replace(/^([ \t]*)/g, ""), A = A.replace(/[ \t]*$/g, ""), A = r.subParser("encodeCode")(A, m, p), A = w + "<code>" + A + "</code>", A = r.subParser("hashHTMLSpans")(A, m, p), A;
        }
      ), u = p.converter._dispatch("codeSpans.after", u, m, p), u;
    }), r.subParser("completeHTMLDocument", function(u, m, p) {
      if (!m.completeHTMLDocument)
        return u;
      u = p.converter._dispatch("completeHTMLDocument.before", u, m, p);
      var b = "html", w = `<!DOCTYPE HTML>
`, S = "", x = `<meta charset="utf-8">
`, A = "", B = "";
      typeof p.metadata.parsed.doctype < "u" && (w = "<!DOCTYPE " + p.metadata.parsed.doctype + `>
`, b = p.metadata.parsed.doctype.toString().toLowerCase(), (b === "html" || b === "html5") && (x = '<meta charset="utf-8">'));
      for (var L in p.metadata.parsed)
        if (p.metadata.parsed.hasOwnProperty(L))
          switch (L.toLowerCase()) {
            case "doctype":
              break;
            case "title":
              S = "<title>" + p.metadata.parsed.title + `</title>
`;
              break;
            case "charset":
              b === "html" || b === "html5" ? x = '<meta charset="' + p.metadata.parsed.charset + `">
` : x = '<meta name="charset" content="' + p.metadata.parsed.charset + `">
`;
              break;
            case "language":
            case "lang":
              A = ' lang="' + p.metadata.parsed[L] + '"', B += '<meta name="' + L + '" content="' + p.metadata.parsed[L] + `">
`;
              break;
            default:
              B += '<meta name="' + L + '" content="' + p.metadata.parsed[L] + `">
`;
          }
      return u = w + "<html" + A + `>
<head>
` + S + x + B + `</head>
<body>
` + u.trim() + `
</body>
</html>`, u = p.converter._dispatch("completeHTMLDocument.after", u, m, p), u;
    }), r.subParser("detab", function(u, m, p) {
      return u = p.converter._dispatch("detab.before", u, m, p), u = u.replace(/\t(?=\t)/g, "    "), u = u.replace(/\t/g, "¨A¨B"), u = u.replace(/¨B(.+?)¨A/g, function(b, w) {
        for (var S = w, x = 4 - S.length % 4, A = 0; A < x; A++)
          S += " ";
        return S;
      }), u = u.replace(/¨A/g, "    "), u = u.replace(/¨B/g, ""), u = p.converter._dispatch("detab.after", u, m, p), u;
    }), r.subParser("ellipsis", function(u, m, p) {
      return m.ellipsis && (u = p.converter._dispatch("ellipsis.before", u, m, p), u = u.replace(/\.\.\./g, "…"), u = p.converter._dispatch("ellipsis.after", u, m, p)), u;
    }), r.subParser("emoji", function(u, m, p) {
      if (!m.emoji)
        return u;
      u = p.converter._dispatch("emoji.before", u, m, p);
      var b = /:([\S]+?):/g;
      return u = u.replace(b, function(w, S) {
        return r.helper.emojis.hasOwnProperty(S) ? r.helper.emojis[S] : w;
      }), u = p.converter._dispatch("emoji.after", u, m, p), u;
    }), r.subParser("encodeAmpsAndAngles", function(u, m, p) {
      return u = p.converter._dispatch("encodeAmpsAndAngles.before", u, m, p), u = u.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), u = u.replace(/<(?![a-z\/?$!])/gi, "&lt;"), u = u.replace(/</g, "&lt;"), u = u.replace(/>/g, "&gt;"), u = p.converter._dispatch("encodeAmpsAndAngles.after", u, m, p), u;
    }), r.subParser("encodeBackslashEscapes", function(u, m, p) {
      return u = p.converter._dispatch("encodeBackslashEscapes.before", u, m, p), u = u.replace(/\\(\\)/g, r.helper.escapeCharactersCallback), u = u.replace(/\\([`*_{}\[\]()>#+.!~=|:-])/g, r.helper.escapeCharactersCallback), u = p.converter._dispatch("encodeBackslashEscapes.after", u, m, p), u;
    }), r.subParser("encodeCode", function(u, m, p) {
      return u = p.converter._dispatch("encodeCode.before", u, m, p), u = u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/([*_{}\[\]\\=~-])/g, r.helper.escapeCharactersCallback), u = p.converter._dispatch("encodeCode.after", u, m, p), u;
    }), r.subParser("escapeSpecialCharsWithinTagAttributes", function(u, m, p) {
      u = p.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before", u, m, p);
      var b = /<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi, w = /<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi;
      return u = u.replace(b, function(S) {
        return S.replace(/(.)<\/?code>(?=.)/g, "$1`").replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), u = u.replace(w, function(S) {
        return S.replace(/([\\`*_~=|])/g, r.helper.escapeCharactersCallback);
      }), u = p.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after", u, m, p), u;
    }), r.subParser("githubCodeBlocks", function(u, m, p) {
      return m.ghCodeBlocks ? (u = p.converter._dispatch("githubCodeBlocks.before", u, m, p), u += "¨0", u = u.replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function(b, w, S, x) {
        var A = m.omitExtraWLInCodeBlocks ? "" : `
`;
        return x = r.subParser("encodeCode")(x, m, p), x = r.subParser("detab")(x, m, p), x = x.replace(/^\n+/g, ""), x = x.replace(/\n+$/g, ""), x = "<pre><code" + (S ? ' class="' + S + " language-" + S + '"' : "") + ">" + x + A + "</code></pre>", x = r.subParser("hashBlock")(x, m, p), `

¨G` + (p.ghCodeBlocks.push({ text: b, codeblock: x }) - 1) + `G

`;
      }), u = u.replace(/¨0/, ""), p.converter._dispatch("githubCodeBlocks.after", u, m, p)) : u;
    }), r.subParser("hashBlock", function(u, m, p) {
      return u = p.converter._dispatch("hashBlock.before", u, m, p), u = u.replace(/(^\n+|\n+$)/g, ""), u = `

¨K` + (p.gHtmlBlocks.push(u) - 1) + `K

`, u = p.converter._dispatch("hashBlock.after", u, m, p), u;
    }), r.subParser("hashCodeTags", function(u, m, p) {
      u = p.converter._dispatch("hashCodeTags.before", u, m, p);
      var b = function(w, S, x, A) {
        var B = x + r.subParser("encodeCode")(S, m, p) + A;
        return "¨C" + (p.gHtmlSpans.push(B) - 1) + "C";
      };
      return u = r.helper.replaceRecursiveRegExp(u, b, "<code\\b[^>]*>", "</code>", "gim"), u = p.converter._dispatch("hashCodeTags.after", u, m, p), u;
    }), r.subParser("hashElement", function(u, m, p) {
      return function(b, w) {
        var S = w;
        return S = S.replace(/\n\n/g, `
`), S = S.replace(/^\n/, ""), S = S.replace(/\n+$/g, ""), S = `

¨K` + (p.gHtmlBlocks.push(S) - 1) + `K

`, S;
      };
    }), r.subParser("hashHTMLBlocks", function(u, m, p) {
      u = p.converter._dispatch("hashHTMLBlocks.before", u, m, p);
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
      ], w = function(_, O, I, W) {
        var te = _;
        return I.search(/\bmarkdown\b/) !== -1 && (te = I + p.converter.makeHtml(O) + W), `

¨K` + (p.gHtmlBlocks.push(te) - 1) + `K

`;
      };
      m.backslashEscapesHTMLTags && (u = u.replace(/\\<(\/?[^>]+?)>/g, function(_, O) {
        return "&lt;" + O + "&gt;";
      }));
      for (var S = 0; S < b.length; ++S)
        for (var x, A = new RegExp("^ {0,3}(<" + b[S] + "\\b[^>]*>)", "im"), B = "<" + b[S] + "\\b[^>]*>", L = "</" + b[S] + ">"; (x = r.helper.regexIndexOf(u, A)) !== -1; ) {
          var R = r.helper.splitAtIndex(u, x), N = r.helper.replaceRecursiveRegExp(R[1], w, B, L, "im");
          if (N === R[1])
            break;
          u = R[0].concat(N);
        }
      return u = u.replace(
        /(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(u, m, p)
      ), u = r.helper.replaceRecursiveRegExp(u, function(_) {
        return `

¨K` + (p.gHtmlBlocks.push(_) - 1) + `K

`;
      }, "^ {0,3}<!--", "-->", "gm"), u = u.replace(
        /(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,
        r.subParser("hashElement")(u, m, p)
      ), u = p.converter._dispatch("hashHTMLBlocks.after", u, m, p), u;
    }), r.subParser("hashHTMLSpans", function(u, m, p) {
      u = p.converter._dispatch("hashHTMLSpans.before", u, m, p);
      function b(w) {
        return "¨C" + (p.gHtmlSpans.push(w) - 1) + "C";
      }
      return u = u.replace(/<[^>]+?\/>/gi, function(w) {
        return b(w);
      }), u = u.replace(/<([^>]+?)>[\s\S]*?<\/\1>/g, function(w) {
        return b(w);
      }), u = u.replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g, function(w) {
        return b(w);
      }), u = u.replace(/<[^>]+?>/gi, function(w) {
        return b(w);
      }), u = p.converter._dispatch("hashHTMLSpans.after", u, m, p), u;
    }), r.subParser("unhashHTMLSpans", function(u, m, p) {
      u = p.converter._dispatch("unhashHTMLSpans.before", u, m, p);
      for (var b = 0; b < p.gHtmlSpans.length; ++b) {
        for (var w = p.gHtmlSpans[b], S = 0; /¨C(\d+)C/.test(w); ) {
          var x = RegExp.$1;
          if (w = w.replace("¨C" + x + "C", p.gHtmlSpans[x]), S === 10) {
            console.error("maximum nesting of 10 spans reached!!!");
            break;
          }
          ++S;
        }
        u = u.replace("¨C" + b + "C", w);
      }
      return u = p.converter._dispatch("unhashHTMLSpans.after", u, m, p), u;
    }), r.subParser("hashPreCodeTags", function(u, m, p) {
      u = p.converter._dispatch("hashPreCodeTags.before", u, m, p);
      var b = function(w, S, x, A) {
        var B = x + r.subParser("encodeCode")(S, m, p) + A;
        return `

¨G` + (p.ghCodeBlocks.push({ text: w, codeblock: B }) - 1) + `G

`;
      };
      return u = r.helper.replaceRecursiveRegExp(u, b, "^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>", "^ {0,3}</code>\\s*</pre>", "gim"), u = p.converter._dispatch("hashPreCodeTags.after", u, m, p), u;
    }), r.subParser("headers", function(u, m, p) {
      u = p.converter._dispatch("headers.before", u, m, p);
      var b = isNaN(parseInt(m.headerLevelStart)) ? 1 : parseInt(m.headerLevelStart), w = m.smoothLivePreview ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm, S = m.smoothLivePreview ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;
      u = u.replace(w, function(B, L) {
        var R = r.subParser("spanGamut")(L, m, p), N = m.noHeaderId ? "" : ' id="' + A(L) + '"', _ = b, O = "<h" + _ + N + ">" + R + "</h" + _ + ">";
        return r.subParser("hashBlock")(O, m, p);
      }), u = u.replace(S, function(B, L) {
        var R = r.subParser("spanGamut")(L, m, p), N = m.noHeaderId ? "" : ' id="' + A(L) + '"', _ = b + 1, O = "<h" + _ + N + ">" + R + "</h" + _ + ">";
        return r.subParser("hashBlock")(O, m, p);
      });
      var x = m.requireSpaceBeforeHeadingText ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;
      u = u.replace(x, function(B, L, R) {
        var N = R;
        m.customizedHeaderId && (N = R.replace(/\s?\{([^{]+?)}\s*$/, ""));
        var _ = r.subParser("spanGamut")(N, m, p), O = m.noHeaderId ? "" : ' id="' + A(R) + '"', I = b - 1 + L.length, W = "<h" + I + O + ">" + _ + "</h" + I + ">";
        return r.subParser("hashBlock")(W, m, p);
      });
      function A(B) {
        var L, R;
        if (m.customizedHeaderId) {
          var N = B.match(/\{([^{]+?)}\s*$/);
          N && N[1] && (B = N[1]);
        }
        return L = B, r.helper.isString(m.prefixHeaderId) ? R = m.prefixHeaderId : m.prefixHeaderId === !0 ? R = "section-" : R = "", m.rawPrefixHeaderId || (L = R + L), m.ghCompatibleHeaderId ? L = L.replace(/ /g, "-").replace(/&amp;/g, "").replace(/¨T/g, "").replace(/¨D/g, "").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, "").toLowerCase() : m.rawHeaderId ? L = L.replace(/ /g, "-").replace(/&amp;/g, "&").replace(/¨T/g, "¨").replace(/¨D/g, "$").replace(/["']/g, "-").toLowerCase() : L = L.replace(/[^\w]/g, "").toLowerCase(), m.rawPrefixHeaderId && (L = R + L), p.hashLinkCounts[L] ? L = L + "-" + p.hashLinkCounts[L]++ : p.hashLinkCounts[L] = 1, L;
      }
      return u = p.converter._dispatch("headers.after", u, m, p), u;
    }), r.subParser("horizontalRule", function(u, m, p) {
      u = p.converter._dispatch("horizontalRule.before", u, m, p);
      var b = r.subParser("hashBlock")("<hr />", m, p);
      return u = u.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm, b), u = u.replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm, b), u = u.replace(/^ {0,2}( ?_){3,}[ \t]*$/gm, b), u = p.converter._dispatch("horizontalRule.after", u, m, p), u;
    }), r.subParser("images", function(u, m, p) {
      u = p.converter._dispatch("images.before", u, m, p);
      var b = /!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, w = /!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g, S = /!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g, x = /!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g, A = /!\[([^\[\]]+)]()()()()()/g;
      function B(R, N, _, O, I, W, te, U) {
        return O = O.replace(/\s/g, ""), L(R, N, _, O, I, W, te, U);
      }
      function L(R, N, _, O, I, W, te, U) {
        var le = p.gUrls, ge = p.gTitles, Ee = p.gDimensions;
        if (_ = _.toLowerCase(), U || (U = ""), R.search(/\(<?\s*>? ?(['"].*['"])?\)$/m) > -1)
          O = "";
        else if (O === "" || O === null)
          if ((_ === "" || _ === null) && (_ = N.toLowerCase().replace(/ ?\n/g, " ")), O = "#" + _, !r.helper.isUndefined(le[_]))
            O = le[_], r.helper.isUndefined(ge[_]) || (U = ge[_]), r.helper.isUndefined(Ee[_]) || (I = Ee[_].width, W = Ee[_].height);
          else
            return R;
        N = N.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), O = O.replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback);
        var Me = '<img src="' + O + '" alt="' + N + '"';
        return U && r.helper.isString(U) && (U = U.replace(/"/g, "&quot;").replace(r.helper.regexes.asteriskDashAndColon, r.helper.escapeCharactersCallback), Me += ' title="' + U + '"'), I && W && (I = I === "*" ? "auto" : I, W = W === "*" ? "auto" : W, Me += ' width="' + I + '"', Me += ' height="' + W + '"'), Me += " />", Me;
      }
      return u = u.replace(x, L), u = u.replace(S, B), u = u.replace(w, L), u = u.replace(b, L), u = u.replace(A, L), u = p.converter._dispatch("images.after", u, m, p), u;
    }), r.subParser("italicsAndBold", function(u, m, p) {
      u = p.converter._dispatch("italicsAndBold.before", u, m, p);
      function b(w, S, x) {
        return S + w + x;
      }
      return m.literalMidWordUnderscores ? (u = u.replace(/\b___(\S[\s\S]*?)___\b/g, function(w, S) {
        return b(S, "<strong><em>", "</em></strong>");
      }), u = u.replace(/\b__(\S[\s\S]*?)__\b/g, function(w, S) {
        return b(S, "<strong>", "</strong>");
      }), u = u.replace(/\b_(\S[\s\S]*?)_\b/g, function(w, S) {
        return b(S, "<em>", "</em>");
      })) : (u = u.replace(/___(\S[\s\S]*?)___/g, function(w, S) {
        return /\S$/.test(S) ? b(S, "<strong><em>", "</em></strong>") : w;
      }), u = u.replace(/__(\S[\s\S]*?)__/g, function(w, S) {
        return /\S$/.test(S) ? b(S, "<strong>", "</strong>") : w;
      }), u = u.replace(/_([^\s_][\s\S]*?)_/g, function(w, S) {
        return /\S$/.test(S) ? b(S, "<em>", "</em>") : w;
      })), m.literalMidWordAsterisks ? (u = u.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g, function(w, S, x) {
        return b(x, S + "<strong><em>", "</em></strong>");
      }), u = u.replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g, function(w, S, x) {
        return b(x, S + "<strong>", "</strong>");
      }), u = u.replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g, function(w, S, x) {
        return b(x, S + "<em>", "</em>");
      })) : (u = u.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g, function(w, S) {
        return /\S$/.test(S) ? b(S, "<strong><em>", "</em></strong>") : w;
      }), u = u.replace(/\*\*(\S[\s\S]*?)\*\*/g, function(w, S) {
        return /\S$/.test(S) ? b(S, "<strong>", "</strong>") : w;
      }), u = u.replace(/\*([^\s*][\s\S]*?)\*/g, function(w, S) {
        return /\S$/.test(S) ? b(S, "<em>", "</em>") : w;
      })), u = p.converter._dispatch("italicsAndBold.after", u, m, p), u;
    }), r.subParser("lists", function(u, m, p) {
      function b(x, A) {
        p.gListLevel++, x = x.replace(/\n{2,}$/, `
`), x += "¨0";
        var B = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm, L = /\n[ \t]*\n(?!¨0)/.test(x);
        return m.disableForced4SpacesIndentedSublists && (B = /(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm), x = x.replace(B, function(R, N, _, O, I, W, te) {
          te = te && te.trim() !== "";
          var U = r.subParser("outdent")(I, m, p), le = "";
          return W && m.tasklists && (le = ' class="task-list-item" style="list-style-type: none;"', U = U.replace(/^[ \t]*\[(x|X| )?]/m, function() {
            var ge = '<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"';
            return te && (ge += " checked"), ge += ">", ge;
          })), U = U.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g, function(ge) {
            return "¨A" + ge;
          }), N || U.search(/\n{2,}/) > -1 ? (U = r.subParser("githubCodeBlocks")(U, m, p), U = r.subParser("blockGamut")(U, m, p)) : (U = r.subParser("lists")(U, m, p), U = U.replace(/\n$/, ""), U = r.subParser("hashHTMLBlocks")(U, m, p), U = U.replace(/\n\n+/g, `

`), L ? U = r.subParser("paragraphs")(U, m, p) : U = r.subParser("spanGamut")(U, m, p)), U = U.replace("¨A", ""), U = "<li" + le + ">" + U + `</li>
`, U;
        }), x = x.replace(/¨0/g, ""), p.gListLevel--, A && (x = x.replace(/\s+$/, "")), x;
      }
      function w(x, A) {
        if (A === "ol") {
          var B = x.match(/^ *(\d+)\./);
          if (B && B[1] !== "1")
            return ' start="' + B[1] + '"';
        }
        return "";
      }
      function S(x, A, B) {
        var L = m.disableForced4SpacesIndentedSublists ? /^ ?\d+\.[ \t]/gm : /^ {0,3}\d+\.[ \t]/gm, R = m.disableForced4SpacesIndentedSublists ? /^ ?[*+-][ \t]/gm : /^ {0,3}[*+-][ \t]/gm, N = A === "ul" ? L : R, _ = "";
        if (x.search(N) !== -1)
          (function I(W) {
            var te = W.search(N), U = w(x, A);
            te !== -1 ? (_ += `

<` + A + U + `>
` + b(W.slice(0, te), !!B) + "</" + A + `>
`, A = A === "ul" ? "ol" : "ul", N = A === "ul" ? L : R, I(W.slice(te))) : _ += `

<` + A + U + `>
` + b(W, !!B) + "</" + A + `>
`;
          })(x);
        else {
          var O = w(x, A);
          _ = `

<` + A + O + `>
` + b(x, !!B) + "</" + A + `>
`;
        }
        return _;
      }
      return u = p.converter._dispatch("lists.before", u, m, p), u += "¨0", p.gListLevel ? u = u.replace(
        /^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(x, A, B) {
          var L = B.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return S(A, L, !0);
        }
      ) : u = u.replace(
        /(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,
        function(x, A, B, L) {
          var R = L.search(/[*+-]/g) > -1 ? "ul" : "ol";
          return S(B, R, !1);
        }
      ), u = u.replace(/¨0/, ""), u = p.converter._dispatch("lists.after", u, m, p), u;
    }), r.subParser("metadata", function(u, m, p) {
      if (!m.metadata)
        return u;
      u = p.converter._dispatch("metadata.before", u, m, p);
      function b(w) {
        p.metadata.raw = w, w = w.replace(/&/g, "&amp;").replace(/"/g, "&quot;"), w = w.replace(/\n {4}/g, " "), w.replace(/^([\S ]+): +([\s\S]+?)$/gm, function(S, x, A) {
          return p.metadata.parsed[x] = A, "";
        });
      }
      return u = u.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function(w, S, x) {
        return b(x), "¨M";
      }), u = u.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function(w, S, x) {
        return S && (p.metadata.format = S), b(x), "¨M";
      }), u = u.replace(/¨M/g, ""), u = p.converter._dispatch("metadata.after", u, m, p), u;
    }), r.subParser("outdent", function(u, m, p) {
      return u = p.converter._dispatch("outdent.before", u, m, p), u = u.replace(/^(\t|[ ]{1,4})/gm, "¨0"), u = u.replace(/¨0/g, ""), u = p.converter._dispatch("outdent.after", u, m, p), u;
    }), r.subParser("paragraphs", function(u, m, p) {
      u = p.converter._dispatch("paragraphs.before", u, m, p), u = u.replace(/^\n+/g, ""), u = u.replace(/\n+$/g, "");
      for (var b = u.split(/\n{2,}/g), w = [], S = b.length, x = 0; x < S; x++) {
        var A = b[x];
        A.search(/¨(K|G)(\d+)\1/g) >= 0 ? w.push(A) : A.search(/\S/) >= 0 && (A = r.subParser("spanGamut")(A, m, p), A = A.replace(/^([ \t]*)/g, "<p>"), A += "</p>", w.push(A));
      }
      for (S = w.length, x = 0; x < S; x++) {
        for (var B = "", L = w[x], R = !1; /¨(K|G)(\d+)\1/.test(L); ) {
          var N = RegExp.$1, _ = RegExp.$2;
          N === "K" ? B = p.gHtmlBlocks[_] : R ? B = r.subParser("encodeCode")(p.ghCodeBlocks[_].text, m, p) : B = p.ghCodeBlocks[_].codeblock, B = B.replace(/\$/g, "$$$$"), L = L.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/, B), /^<pre\b[^>]*>\s*<code\b[^>]*>/.test(L) && (R = !0);
        }
        w[x] = L;
      }
      return u = w.join(`
`), u = u.replace(/^\n+/g, ""), u = u.replace(/\n+$/g, ""), p.converter._dispatch("paragraphs.after", u, m, p);
    }), r.subParser("runExtension", function(u, m, p, b) {
      if (u.filter)
        m = u.filter(m, b.converter, p);
      else if (u.regex) {
        var w = u.regex;
        w instanceof RegExp || (w = new RegExp(w, "g")), m = m.replace(w, u.replace);
      }
      return m;
    }), r.subParser("spanGamut", function(u, m, p) {
      return u = p.converter._dispatch("spanGamut.before", u, m, p), u = r.subParser("codeSpans")(u, m, p), u = r.subParser("escapeSpecialCharsWithinTagAttributes")(u, m, p), u = r.subParser("encodeBackslashEscapes")(u, m, p), u = r.subParser("images")(u, m, p), u = r.subParser("anchors")(u, m, p), u = r.subParser("autoLinks")(u, m, p), u = r.subParser("simplifiedAutoLinks")(u, m, p), u = r.subParser("emoji")(u, m, p), u = r.subParser("underline")(u, m, p), u = r.subParser("italicsAndBold")(u, m, p), u = r.subParser("strikethrough")(u, m, p), u = r.subParser("ellipsis")(u, m, p), u = r.subParser("hashHTMLSpans")(u, m, p), u = r.subParser("encodeAmpsAndAngles")(u, m, p), m.simpleLineBreaks ? /\n\n¨K/.test(u) || (u = u.replace(/\n+/g, `<br />
`)) : u = u.replace(/  +\n/g, `<br />
`), u = p.converter._dispatch("spanGamut.after", u, m, p), u;
    }), r.subParser("strikethrough", function(u, m, p) {
      function b(w) {
        return m.simplifiedAutoLink && (w = r.subParser("simplifiedAutoLinks")(w, m, p)), "<del>" + w + "</del>";
      }
      return m.strikethrough && (u = p.converter._dispatch("strikethrough.before", u, m, p), u = u.replace(/(?:~){2}([\s\S]+?)(?:~){2}/g, function(w, S) {
        return b(S);
      }), u = p.converter._dispatch("strikethrough.after", u, m, p)), u;
    }), r.subParser("stripLinkDefinitions", function(u, m, p) {
      var b = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm, w = /^ {0,3}\[([^\]]+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm;
      u += "¨0";
      var S = function(x, A, B, L, R, N, _) {
        return A = A.toLowerCase(), u.toLowerCase().split(A).length - 1 < 2 ? x : (B.match(/^data:.+?\/.+?;base64,/) ? p.gUrls[A] = B.replace(/\s/g, "") : p.gUrls[A] = r.subParser("encodeAmpsAndAngles")(B, m, p), N ? N + _ : (_ && (p.gTitles[A] = _.replace(/"|'/g, "&quot;")), m.parseImgDimensions && L && R && (p.gDimensions[A] = {
          width: L,
          height: R
        }), ""));
      };
      return u = u.replace(w, S), u = u.replace(b, S), u = u.replace(/¨0/, ""), u;
    }), r.subParser("tables", function(u, m, p) {
      if (!m.tables)
        return u;
      var b = /^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm, w = /^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm;
      function S(R) {
        return /^:[ \t]*--*$/.test(R) ? ' style="text-align:left;"' : /^--*[ \t]*:[ \t]*$/.test(R) ? ' style="text-align:right;"' : /^:[ \t]*--*[ \t]*:$/.test(R) ? ' style="text-align:center;"' : "";
      }
      function x(R, N) {
        var _ = "";
        return R = R.trim(), (m.tablesHeaderId || m.tableHeaderId) && (_ = ' id="' + R.replace(/ /g, "_").toLowerCase() + '"'), R = r.subParser("spanGamut")(R, m, p), "<th" + _ + N + ">" + R + `</th>
`;
      }
      function A(R, N) {
        var _ = r.subParser("spanGamut")(R, m, p);
        return "<td" + N + ">" + _ + `</td>
`;
      }
      function B(R, N) {
        for (var _ = `<table>
<thead>
<tr>
`, O = R.length, I = 0; I < O; ++I)
          _ += R[I];
        for (_ += `</tr>
</thead>
<tbody>
`, I = 0; I < N.length; ++I) {
          _ += `<tr>
`;
          for (var W = 0; W < O; ++W)
            _ += N[I][W];
          _ += `</tr>
`;
        }
        return _ += `</tbody>
</table>
`, _;
      }
      function L(R) {
        var N, _ = R.split(`
`);
        for (N = 0; N < _.length; ++N)
          /^ {0,3}\|/.test(_[N]) && (_[N] = _[N].replace(/^ {0,3}\|/, "")), /\|[ \t]*$/.test(_[N]) && (_[N] = _[N].replace(/\|[ \t]*$/, "")), _[N] = r.subParser("codeSpans")(_[N], m, p);
        var O = _[0].split("|").map(function(Me) {
          return Me.trim();
        }), I = _[1].split("|").map(function(Me) {
          return Me.trim();
        }), W = [], te = [], U = [], le = [];
        for (_.shift(), _.shift(), N = 0; N < _.length; ++N)
          _[N].trim() !== "" && W.push(
            _[N].split("|").map(function(Me) {
              return Me.trim();
            })
          );
        if (O.length < I.length)
          return R;
        for (N = 0; N < I.length; ++N)
          U.push(S(I[N]));
        for (N = 0; N < O.length; ++N)
          r.helper.isUndefined(U[N]) && (U[N] = ""), te.push(x(O[N], U[N]));
        for (N = 0; N < W.length; ++N) {
          for (var ge = [], Ee = 0; Ee < te.length; ++Ee)
            r.helper.isUndefined(W[N][Ee]), ge.push(A(W[N][Ee], U[Ee]));
          le.push(ge);
        }
        return B(te, le);
      }
      return u = p.converter._dispatch("tables.before", u, m, p), u = u.replace(/\\(\|)/g, r.helper.escapeCharactersCallback), u = u.replace(b, L), u = u.replace(w, L), u = p.converter._dispatch("tables.after", u, m, p), u;
    }), r.subParser("underline", function(u, m, p) {
      return m.underline && (u = p.converter._dispatch("underline.before", u, m, p), m.literalMidWordUnderscores ? (u = u.replace(/\b___(\S[\s\S]*?)___\b/g, function(b, w) {
        return "<u>" + w + "</u>";
      }), u = u.replace(/\b__(\S[\s\S]*?)__\b/g, function(b, w) {
        return "<u>" + w + "</u>";
      })) : (u = u.replace(/___(\S[\s\S]*?)___/g, function(b, w) {
        return /\S$/.test(w) ? "<u>" + w + "</u>" : b;
      }), u = u.replace(/__(\S[\s\S]*?)__/g, function(b, w) {
        return /\S$/.test(w) ? "<u>" + w + "</u>" : b;
      })), u = u.replace(/(_)/g, r.helper.escapeCharactersCallback), u = p.converter._dispatch("underline.after", u, m, p)), u;
    }), r.subParser("unescapeSpecialChars", function(u, m, p) {
      return u = p.converter._dispatch("unescapeSpecialChars.before", u, m, p), u = u.replace(/¨E(\d+)E/g, function(b, w) {
        var S = parseInt(w);
        return String.fromCharCode(S);
      }), u = p.converter._dispatch("unescapeSpecialChars.after", u, m, p), u;
    }), r.subParser("makeMarkdown.blockquote", function(u, m) {
      var p = "";
      if (u.hasChildNodes())
        for (var b = u.childNodes, w = b.length, S = 0; S < w; ++S) {
          var x = r.subParser("makeMarkdown.node")(b[S], m);
          x !== "" && (p += x);
        }
      return p = p.trim(), p = "> " + p.split(`
`).join(`
> `), p;
    }), r.subParser("makeMarkdown.codeBlock", function(u, m) {
      var p = u.getAttribute("language"), b = u.getAttribute("precodenum");
      return "```" + p + `
` + m.preList[b] + "\n```";
    }), r.subParser("makeMarkdown.codeSpan", function(u) {
      return "`" + u.innerHTML + "`";
    }), r.subParser("makeMarkdown.emphasis", function(u, m) {
      var p = "";
      if (u.hasChildNodes()) {
        p += "*";
        for (var b = u.childNodes, w = b.length, S = 0; S < w; ++S)
          p += r.subParser("makeMarkdown.node")(b[S], m);
        p += "*";
      }
      return p;
    }), r.subParser("makeMarkdown.header", function(u, m, p) {
      var b = new Array(p + 1).join("#"), w = "";
      if (u.hasChildNodes()) {
        w = b + " ";
        for (var S = u.childNodes, x = S.length, A = 0; A < x; ++A)
          w += r.subParser("makeMarkdown.node")(S[A], m);
      }
      return w;
    }), r.subParser("makeMarkdown.hr", function() {
      return "---";
    }), r.subParser("makeMarkdown.image", function(u) {
      var m = "";
      return u.hasAttribute("src") && (m += "![" + u.getAttribute("alt") + "](", m += "<" + u.getAttribute("src") + ">", u.hasAttribute("width") && u.hasAttribute("height") && (m += " =" + u.getAttribute("width") + "x" + u.getAttribute("height")), u.hasAttribute("title") && (m += ' "' + u.getAttribute("title") + '"'), m += ")"), m;
    }), r.subParser("makeMarkdown.links", function(u, m) {
      var p = "";
      if (u.hasChildNodes() && u.hasAttribute("href")) {
        var b = u.childNodes, w = b.length;
        p = "[";
        for (var S = 0; S < w; ++S)
          p += r.subParser("makeMarkdown.node")(b[S], m);
        p += "](", p += "<" + u.getAttribute("href") + ">", u.hasAttribute("title") && (p += ' "' + u.getAttribute("title") + '"'), p += ")";
      }
      return p;
    }), r.subParser("makeMarkdown.list", function(u, m, p) {
      var b = "";
      if (!u.hasChildNodes())
        return "";
      for (var w = u.childNodes, S = w.length, x = u.getAttribute("start") || 1, A = 0; A < S; ++A)
        if (!(typeof w[A].tagName > "u" || w[A].tagName.toLowerCase() !== "li")) {
          var B = "";
          p === "ol" ? B = x.toString() + ". " : B = "- ", b += B + r.subParser("makeMarkdown.listItem")(w[A], m), ++x;
        }
      return b += `
<!-- -->
`, b.trim();
    }), r.subParser("makeMarkdown.listItem", function(u, m) {
      for (var p = "", b = u.childNodes, w = b.length, S = 0; S < w; ++S)
        p += r.subParser("makeMarkdown.node")(b[S], m);
      return /\n$/.test(p) ? p = p.split(`
`).join(`
    `).replace(/^ {4}$/gm, "").replace(/\n\n+/g, `

`) : p += `
`, p;
    }), r.subParser("makeMarkdown.node", function(u, m, p) {
      p = p || !1;
      var b = "";
      if (u.nodeType === 3)
        return r.subParser("makeMarkdown.txt")(u, m);
      if (u.nodeType === 8)
        return "<!--" + u.data + `-->

`;
      if (u.nodeType !== 1)
        return "";
      var w = u.tagName.toLowerCase();
      switch (w) {
        case "h1":
          p || (b = r.subParser("makeMarkdown.header")(u, m, 1) + `

`);
          break;
        case "h2":
          p || (b = r.subParser("makeMarkdown.header")(u, m, 2) + `

`);
          break;
        case "h3":
          p || (b = r.subParser("makeMarkdown.header")(u, m, 3) + `

`);
          break;
        case "h4":
          p || (b = r.subParser("makeMarkdown.header")(u, m, 4) + `

`);
          break;
        case "h5":
          p || (b = r.subParser("makeMarkdown.header")(u, m, 5) + `

`);
          break;
        case "h6":
          p || (b = r.subParser("makeMarkdown.header")(u, m, 6) + `

`);
          break;
        case "p":
          p || (b = r.subParser("makeMarkdown.paragraph")(u, m) + `

`);
          break;
        case "blockquote":
          p || (b = r.subParser("makeMarkdown.blockquote")(u, m) + `

`);
          break;
        case "hr":
          p || (b = r.subParser("makeMarkdown.hr")(u, m) + `

`);
          break;
        case "ol":
          p || (b = r.subParser("makeMarkdown.list")(u, m, "ol") + `

`);
          break;
        case "ul":
          p || (b = r.subParser("makeMarkdown.list")(u, m, "ul") + `

`);
          break;
        case "precode":
          p || (b = r.subParser("makeMarkdown.codeBlock")(u, m) + `

`);
          break;
        case "pre":
          p || (b = r.subParser("makeMarkdown.pre")(u, m) + `

`);
          break;
        case "table":
          p || (b = r.subParser("makeMarkdown.table")(u, m) + `

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
      var p = "";
      if (u.hasChildNodes())
        for (var b = u.childNodes, w = b.length, S = 0; S < w; ++S)
          p += r.subParser("makeMarkdown.node")(b[S], m);
      return p = p.trim(), p;
    }), r.subParser("makeMarkdown.pre", function(u, m) {
      var p = u.getAttribute("prenum");
      return "<pre>" + m.preList[p] + "</pre>";
    }), r.subParser("makeMarkdown.strikethrough", function(u, m) {
      var p = "";
      if (u.hasChildNodes()) {
        p += "~~";
        for (var b = u.childNodes, w = b.length, S = 0; S < w; ++S)
          p += r.subParser("makeMarkdown.node")(b[S], m);
        p += "~~";
      }
      return p;
    }), r.subParser("makeMarkdown.strong", function(u, m) {
      var p = "";
      if (u.hasChildNodes()) {
        p += "**";
        for (var b = u.childNodes, w = b.length, S = 0; S < w; ++S)
          p += r.subParser("makeMarkdown.node")(b[S], m);
        p += "**";
      }
      return p;
    }), r.subParser("makeMarkdown.table", function(u, m) {
      var p = "", b = [[], []], w = u.querySelectorAll("thead>tr>th"), S = u.querySelectorAll("tbody>tr"), x, A;
      for (x = 0; x < w.length; ++x) {
        var B = r.subParser("makeMarkdown.tableCell")(w[x], m), L = "---";
        if (w[x].hasAttribute("style")) {
          var R = w[x].getAttribute("style").toLowerCase().replace(/\s/g, "");
          switch (R) {
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
        b[0][x] = B.trim(), b[1][x] = L;
      }
      for (x = 0; x < S.length; ++x) {
        var N = b.push([]) - 1, _ = S[x].getElementsByTagName("td");
        for (A = 0; A < w.length; ++A) {
          var O = " ";
          typeof _[A] < "u" && (O = r.subParser("makeMarkdown.tableCell")(_[A], m)), b[N].push(O);
        }
      }
      var I = 3;
      for (x = 0; x < b.length; ++x)
        for (A = 0; A < b[x].length; ++A) {
          var W = b[x][A].length;
          W > I && (I = W);
        }
      for (x = 0; x < b.length; ++x) {
        for (A = 0; A < b[x].length; ++A)
          x === 1 ? b[x][A].slice(-1) === ":" ? b[x][A] = r.helper.padEnd(b[x][A].slice(-1), I - 1, "-") + ":" : b[x][A] = r.helper.padEnd(b[x][A], I, "-") : b[x][A] = r.helper.padEnd(b[x][A], I);
        p += "| " + b[x].join(" | ") + ` |
`;
      }
      return p.trim();
    }), r.subParser("makeMarkdown.tableCell", function(u, m) {
      var p = "";
      if (!u.hasChildNodes())
        return "";
      for (var b = u.childNodes, w = b.length, S = 0; S < w; ++S)
        p += r.subParser("makeMarkdown.node")(b[S], m, !0);
      return p.trim();
    }), r.subParser("makeMarkdown.txt", function(u) {
      var m = u.nodeValue;
      return m = m.replace(/ +/g, " "), m = m.replace(/¨NBSP;/g, " "), m = r.helper.unescapeHTMLEntities(m), m = m.replace(/([*_~|`])/g, "\\$1"), m = m.replace(/^(\s*)>/g, "\\$1>"), m = m.replace(/^#/gm, "\\#"), m = m.replace(/^(\s*)([-=]{3,})(\s*)$/, "$1\\$2$3"), m = m.replace(/^( {0,3}\d+)\./gm, "$1\\."), m = m.replace(/^( {0,3})([+-])/gm, "$1\\$2"), m = m.replace(/]([\s]*)\(/g, "\\]$1\\("), m = m.replace(/^ {0,3}\[([\S \t]*?)]:/gm, "\\[$1]:"), m;
    });
    var j = this;
    t.exports ? t.exports = r : j.showdown = r;
  }).call(ia);
})(p3);
Ws([]);
let h3 = document.querySelector('link[rel="icon"]');
h3.href;
mi({});
mi({});
const Gt = /* @__PURE__ */ Object.create(null);
Gt.open = "0";
Gt.close = "1";
Gt.ping = "2";
Gt.pong = "3";
Gt.message = "4";
Gt.upgrade = "5";
Gt.noop = "6";
const Qi = /* @__PURE__ */ Object.create(null);
Object.keys(Gt).forEach((t) => {
  Qi[Gt[t]] = t;
});
const Ml = { type: "error", data: "parser error" }, fp = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", pp = typeof ArrayBuffer == "function", hp = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer, Na = ({ type: t, data: e }, n, r) => fp && e instanceof Blob ? n ? r(e) : ju(e, r) : pp && (e instanceof ArrayBuffer || hp(e)) ? n ? r(e) : ju(new Blob([e]), r) : r(Gt[t] + (e || "")), ju = (t, e) => {
  const n = new FileReader();
  return n.onload = function() {
    const r = n.result.split(",")[1];
    e("b" + (r || ""));
  }, n.readAsDataURL(t);
};
function Pu(t) {
  return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
let Io;
function m3(t, e) {
  if (fp && t.data instanceof Blob)
    return t.data.arrayBuffer().then(Pu).then(e);
  if (pp && (t.data instanceof ArrayBuffer || hp(t.data)))
    return e(Pu(t.data));
  Na(t, !1, (n) => {
    Io || (Io = new TextEncoder()), e(Io.encode(n));
  });
}
const Ru = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ur = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let t = 0; t < Ru.length; t++)
  Ur[Ru.charCodeAt(t)] = t;
const g3 = (t) => {
  let e = t.length * 0.75, n = t.length, r, i = 0, s, o, l, a;
  t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
  const c = new ArrayBuffer(e), d = new Uint8Array(c);
  for (r = 0; r < n; r += 4)
    s = Ur[t.charCodeAt(r)], o = Ur[t.charCodeAt(r + 1)], l = Ur[t.charCodeAt(r + 2)], a = Ur[t.charCodeAt(r + 3)], d[i++] = s << 2 | o >> 4, d[i++] = (o & 15) << 4 | l >> 2, d[i++] = (l & 3) << 6 | a & 63;
  return c;
}, y3 = typeof ArrayBuffer == "function", La = (t, e) => {
  if (typeof t != "string")
    return {
      type: "message",
      data: mp(t, e)
    };
  const n = t.charAt(0);
  return n === "b" ? {
    type: "message",
    data: b3(t.substring(1), e)
  } : Qi[n] ? t.length > 1 ? {
    type: Qi[n],
    data: t.substring(1)
  } : {
    type: Qi[n]
  } : Ml;
}, b3 = (t, e) => {
  if (y3) {
    const n = g3(t);
    return mp(n, e);
  } else
    return { base64: !0, data: t };
}, mp = (t, e) => {
  switch (e) {
    case "blob":
      return t instanceof Blob ? t : new Blob([t]);
    case "arraybuffer":
    default:
      return t instanceof ArrayBuffer ? t : t.buffer;
  }
}, gp = String.fromCharCode(30), v3 = (t, e) => {
  const n = t.length, r = new Array(n);
  let i = 0;
  t.forEach((s, o) => {
    Na(s, !1, (l) => {
      r[o] = l, ++i === n && e(r.join(gp));
    });
  });
}, w3 = (t, e) => {
  const n = t.split(gp), r = [];
  for (let i = 0; i < n.length; i++) {
    const s = La(n[i], e);
    if (r.push(s), s.type === "error")
      break;
  }
  return r;
};
function _3() {
  return new TransformStream({
    transform(t, e) {
      m3(t, (n) => {
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
let No;
function Bi(t) {
  return t.reduce((e, n) => e + n.length, 0);
}
function $i(t, e) {
  if (t[0].length === e)
    return t.shift();
  const n = new Uint8Array(e);
  let r = 0;
  for (let i = 0; i < e; i++)
    n[i] = t[0][r++], r === t[0].length && (t.shift(), r = 0);
  return t.length && r < t[0].length && (t[0] = t[0].slice(r)), n;
}
function k3(t, e) {
  No || (No = new TextDecoder());
  const n = [];
  let r = 0, i = -1, s = !1;
  return new TransformStream({
    transform(o, l) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (Bi(n) < 1)
            break;
          const a = $i(n, 1);
          s = (a[0] & 128) === 128, i = a[0] & 127, i < 126 ? r = 3 : i === 126 ? r = 1 : r = 2;
        } else if (r === 1) {
          if (Bi(n) < 2)
            break;
          const a = $i(n, 2);
          i = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), r = 3;
        } else if (r === 2) {
          if (Bi(n) < 8)
            break;
          const a = $i(n, 8), c = new DataView(a.buffer, a.byteOffset, a.length), d = c.getUint32(0);
          if (d > Math.pow(2, 53 - 32) - 1) {
            l.enqueue(Ml);
            break;
          }
          i = d * Math.pow(2, 32) + c.getUint32(4), r = 3;
        } else {
          if (Bi(n) < i)
            break;
          const a = $i(n, i);
          l.enqueue(La(s ? a : No.decode(a), e)), r = 0;
        }
        if (i === 0 || i > t) {
          l.enqueue(Ml);
          break;
        }
      }
    }
  });
}
const yp = 4;
function Re(t) {
  if (t)
    return x3(t);
}
function x3(t) {
  for (var e in Re.prototype)
    t[e] = Re.prototype[e];
  return t;
}
Re.prototype.on = Re.prototype.addEventListener = function(t, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
};
Re.prototype.once = function(t, e) {
  function n() {
    this.off(t, n), e.apply(this, arguments);
  }
  return n.fn = e, this.on(t, n), this;
};
Re.prototype.off = Re.prototype.removeListener = Re.prototype.removeAllListeners = Re.prototype.removeEventListener = function(t, e) {
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
Re.prototype.emit = function(t) {
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
Re.prototype.emitReserved = Re.prototype.emit;
Re.prototype.listeners = function(t) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
};
Re.prototype.hasListeners = function(t) {
  return !!this.listeners(t).length;
};
const bt = (() => typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")())();
function bp(t, ...e) {
  return e.reduce((n, r) => (t.hasOwnProperty(r) && (n[r] = t[r]), n), {});
}
const S3 = bt.setTimeout, C3 = bt.clearTimeout;
function ro(t, e) {
  e.useNativeTimers ? (t.setTimeoutFn = S3.bind(bt), t.clearTimeoutFn = C3.bind(bt)) : (t.setTimeoutFn = bt.setTimeout.bind(bt), t.clearTimeoutFn = bt.clearTimeout.bind(bt));
}
const E3 = 1.33;
function M3(t) {
  return typeof t == "string" ? A3(t) : Math.ceil((t.byteLength || t.size) * E3);
}
function A3(t) {
  let e = 0, n = 0;
  for (let r = 0, i = t.length; r < i; r++)
    e = t.charCodeAt(r), e < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || e >= 57344 ? n += 3 : (r++, n += 4);
  return n;
}
function T3(t) {
  let e = "";
  for (let n in t)
    t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
  return e;
}
function O3(t) {
  let e = {}, n = t.split("&");
  for (let r = 0, i = n.length; r < i; r++) {
    let s = n[r].split("=");
    e[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
  }
  return e;
}
class j3 extends Error {
  constructor(e, n, r) {
    super(e), this.description = n, this.context = r, this.type = "TransportError";
  }
}
class za extends Re {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, ro(this, e), this.opts = e, this.query = e.query, this.socket = e.socket;
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
    return super.emitReserved("error", new j3(e, n, r)), this;
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
    const n = La(e, this.socket.binaryType);
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
    const n = T3(e);
    return n.length ? "?" + n : "";
  }
}
const vp = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), Al = 64, P3 = {};
let Iu = 0, Hi = 0, Nu;
function Lu(t) {
  let e = "";
  do
    e = vp[t % Al] + e, t = Math.floor(t / Al);
  while (t > 0);
  return e;
}
function wp() {
  const t = Lu(+/* @__PURE__ */ new Date());
  return t !== Nu ? (Iu = 0, Nu = t) : t + "." + Lu(Iu++);
}
for (; Hi < Al; Hi++)
  P3[vp[Hi]] = Hi;
let _p = !1;
try {
  _p = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const R3 = _p;
function kp(t) {
  const e = t.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || R3))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new bt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
function I3() {
}
const N3 = function() {
  return new kp({
    xdomain: !1
  }).responseType != null;
}();
class L3 extends za {
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
    this.supportsBinary = N3 && !n, this.opts.withCredentials && (this.cookieJar = void 0);
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
    w3(e, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this.polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this.poll());
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
    this.writable = !1, v3(e, (n) => {
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
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = wp()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(e, n);
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
class Kt extends Re {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, n) {
    super(), ro(this, n), this.opts = n, this.method = n.method || "GET", this.uri = e, this.data = n.data !== void 0 ? n.data : null, this.create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  create() {
    var e;
    const n = bp(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this.opts.xd;
    const r = this.xhr = new kp(n);
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
      if (this.xhr.onreadystatechange = I3, e)
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
    attachEvent("onunload", zu);
  else if (typeof addEventListener == "function") {
    const t = "onpagehide" in bt ? "pagehide" : "unload";
    addEventListener(t, zu, !1);
  }
}
function zu() {
  for (let t in Kt.requests)
    Kt.requests.hasOwnProperty(t) && Kt.requests[t].abort();
}
const Da = (() => typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, n) => n(e, 0))(), Fi = bt.WebSocket || bt.MozWebSocket, Du = !0, z3 = "arraybuffer", Bu = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class D3 extends za {
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
    const e = this.uri(), n = this.opts.protocols, r = Bu ? {} : bp(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
    try {
      this.ws = Du && !Bu ? n ? new Fi(e, n) : new Fi(e) : new Fi(e, n, r);
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
      Na(r, this.supportsBinary, (s) => {
        const o = {};
        try {
          Du && this.ws.send(s);
        } catch {
        }
        i && Da(() => {
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
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = wp()), this.supportsBinary || (n.b64 = 1), this.createUri(e, n);
  }
  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @private
   */
  check() {
    return !!Fi;
  }
}
class B3 extends za {
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
        const n = k3(Number.MAX_SAFE_INTEGER, this.socket.binaryType), r = e.readable.pipeThrough(n).getReader(), i = _3();
        i.readable.pipeTo(e.writable), this.writer = i.writable.getWriter();
        const s = () => {
          r.read().then(({ done: l, value: a }) => {
            l || (this.onPacket(a), s());
          }).catch((l) => {
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
        i && Da(() => {
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
const $3 = {
  websocket: D3,
  webtransport: B3,
  polling: L3
}, H3 = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, F3 = [
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
function Tl(t) {
  const e = t, n = t.indexOf("["), r = t.indexOf("]");
  n != -1 && r != -1 && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
  let i = H3.exec(t || ""), s = {}, o = 14;
  for (; o--; )
    s[F3[o]] = i[o] || "";
  return n != -1 && r != -1 && (s.source = e, s.host = s.host.substring(1, s.host.length - 1).replace(/;/g, ":"), s.authority = s.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), s.ipv6uri = !0), s.pathNames = W3(s, s.path), s.queryKey = V3(s, s.query), s;
}
function W3(t, e) {
  const n = /\/{2,9}/g, r = e.replace(n, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && r.splice(0, 1), e.slice(-1) == "/" && r.splice(r.length - 1, 1), r;
}
function V3(t, e) {
  const n = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(r, i, s) {
    i && (n[i] = s);
  }), n;
}
let xp = class sr extends Re {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, n = {}) {
    super(), this.binaryType = z3, this.writeBuffer = [], e && typeof e == "object" && (n = e, e = null), e ? (e = Tl(e), n.hostname = e.host, n.secure = e.protocol === "https" || e.protocol === "wss", n.port = e.port, e.query && (n.query = e.query)) : n.host && (n.hostname = Tl(n.host).host), ro(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = n.transports || [
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
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = O3(this.opts.query)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingTimeoutTimer = null, typeof addEventListener == "function" && (this.opts.closeOnBeforeunload && (this.beforeunloadEventListener = () => {
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
    n.EIO = yp, n.transport = e, this.id && (n.sid = this.id);
    const r = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new $3[e](r);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  open() {
    let e;
    if (this.opts.rememberUpgrade && sr.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
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
    sr.priorWebsocketSuccess = !1;
    const i = () => {
      r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (f) => {
        if (!r)
          if (f.type === "pong" && f.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            sr.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              r || this.readyState !== "closed" && (d(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const h = new Error("probe error");
            h.transport = n.name, this.emitReserved("upgradeError", h);
          }
      }));
    };
    function s() {
      r || (r = !0, d(), n.close(), n = null);
    }
    const o = (f) => {
      const h = new Error("probe error: " + f);
      h.transport = n.name, s(), this.emitReserved("upgradeError", h);
    };
    function l() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function c(f) {
      n && f.name !== n.name && s();
    }
    const d = () => {
      n.removeListener("open", i), n.removeListener("error", o), n.removeListener("close", l), this.off("close", a), this.off("upgrading", c);
    };
    n.once("open", i), n.once("error", o), n.once("close", l), this.once("close", a), this.once("upgrading", c), this.upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      r || n.open();
    }, 200) : n.open();
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    if (this.readyState = "open", sr.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush(), this.readyState === "open" && this.opts.upgrade) {
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
      if (i && (n += M3(i)), r > 0 && n > this.maxPayload)
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
    sr.priorWebsocketSuccess = !1, this.emitReserved("error", e), this.onClose("transport error", e);
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
xp.protocol = yp;
function K3(t, e = "", n) {
  let r = t;
  n = n || typeof location < "u" && location, t == null && (t = n.protocol + "//" + n.host), typeof t == "string" && (t.charAt(0) === "/" && (t.charAt(1) === "/" ? t = n.protocol + t : t = n.host + t), /^(https?|wss?):\/\//.test(t) || (typeof n < "u" ? t = n.protocol + "//" + t : t = "https://" + t), r = Tl(t)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/";
  const s = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return r.id = r.protocol + "://" + s + ":" + r.port + e, r.href = r.protocol + "://" + s + (n && n.port === r.port ? "" : ":" + r.port), r;
}
const U3 = typeof ArrayBuffer == "function", q3 = (t) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer, Sp = Object.prototype.toString, G3 = typeof Blob == "function" || typeof Blob < "u" && Sp.call(Blob) === "[object BlobConstructor]", J3 = typeof File == "function" || typeof File < "u" && Sp.call(File) === "[object FileConstructor]";
function Ba(t) {
  return U3 && (t instanceof ArrayBuffer || q3(t)) || G3 && t instanceof Blob || J3 && t instanceof File;
}
function Zi(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (Array.isArray(t)) {
    for (let n = 0, r = t.length; n < r; n++)
      if (Zi(t[n]))
        return !0;
    return !1;
  }
  if (Ba(t))
    return !0;
  if (t.toJSON && typeof t.toJSON == "function" && arguments.length === 1)
    return Zi(t.toJSON(), !0);
  for (const n in t)
    if (Object.prototype.hasOwnProperty.call(t, n) && Zi(t[n]))
      return !0;
  return !1;
}
function Y3(t) {
  const e = [], n = t.data, r = t;
  return r.data = Ol(n, e), r.attachments = e.length, { packet: r, buffers: e };
}
function Ol(t, e) {
  if (!t)
    return t;
  if (Ba(t)) {
    const n = { _placeholder: !0, num: e.length };
    return e.push(t), n;
  } else if (Array.isArray(t)) {
    const n = new Array(t.length);
    for (let r = 0; r < t.length; r++)
      n[r] = Ol(t[r], e);
    return n;
  } else if (typeof t == "object" && !(t instanceof Date)) {
    const n = {};
    for (const r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (n[r] = Ol(t[r], e));
    return n;
  }
  return t;
}
function X3(t, e) {
  return t.data = jl(t.data, e), delete t.attachments, t;
}
function jl(t, e) {
  if (!t)
    return t;
  if (t && t._placeholder === !0) {
    if (typeof t.num == "number" && t.num >= 0 && t.num < e.length)
      return e[t.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(t))
    for (let n = 0; n < t.length; n++)
      t[n] = jl(t[n], e);
  else if (typeof t == "object")
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && (t[n] = jl(t[n], e));
  return t;
}
const Q3 = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Z3 = 5;
var ce;
(function(t) {
  t[t.CONNECT = 0] = "CONNECT", t[t.DISCONNECT = 1] = "DISCONNECT", t[t.EVENT = 2] = "EVENT", t[t.ACK = 3] = "ACK", t[t.CONNECT_ERROR = 4] = "CONNECT_ERROR", t[t.BINARY_EVENT = 5] = "BINARY_EVENT", t[t.BINARY_ACK = 6] = "BINARY_ACK";
})(ce || (ce = {}));
class ew {
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
    return (e.type === ce.EVENT || e.type === ce.ACK) && Zi(e) ? this.encodeAsBinary({
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
    const n = Y3(e), r = this.encodeAsString(n.packet), i = n.buffers;
    return i.unshift(r), i;
  }
}
function $u(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
class $a extends Re {
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
      r || n.type === ce.BINARY_ACK ? (n.type = r ? ce.EVENT : ce.ACK, this.reconstructor = new tw(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (Ba(e) || e.base64)
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
      if ($a.isPayloadValid(r.type, s))
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
        return $u(n);
      case ce.DISCONNECT:
        return n === void 0;
      case ce.CONNECT_ERROR:
        return typeof n == "string" || $u(n);
      case ce.EVENT:
      case ce.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && Q3.indexOf(n[0]) === -1);
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
class tw {
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
      const n = X3(this.reconPack, this.buffers);
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
const nw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: $a,
  Encoder: ew,
  get PacketType() {
    return ce;
  },
  protocol: Z3
}, Symbol.toStringTag, { value: "Module" }));
function Ct(t, e, n) {
  return t.on(e, n), function() {
    t.off(e, n);
  };
}
const rw = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Cp extends Re {
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
      Ct(e, "open", this.onopen.bind(this)),
      Ct(e, "packet", this.onpacket.bind(this)),
      Ct(e, "error", this.onerror.bind(this)),
      Ct(e, "close", this.onclose.bind(this))
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
    if (rw.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (n.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const r = {
      type: ce.EVENT,
      data: n
    };
    if (r.options = {}, r.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const o = this.ids++, l = n.pop();
      this._registerAckCallback(o, l), r.id = o;
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
      n.push((o, l) => r ? o ? s(o) : i(l) : i(o)), this.emit(e, ...n);
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
function Lr(t) {
  t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
}
Lr.prototype.duration = function() {
  var t = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), n = Math.floor(e * this.jitter * t);
    t = Math.floor(e * 10) & 1 ? t + n : t - n;
  }
  return Math.min(t, this.max) | 0;
};
Lr.prototype.reset = function() {
  this.attempts = 0;
};
Lr.prototype.setMin = function(t) {
  this.ms = t;
};
Lr.prototype.setMax = function(t) {
  this.max = t;
};
Lr.prototype.setJitter = function(t) {
  this.jitter = t;
};
class Pl extends Re {
  constructor(e, n) {
    var r;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (n = e, e = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, ro(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5), this.backoff = new Lr({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = e;
    const i = n.parser || nw;
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
    this.engine = new xp(this.uri, this.opts);
    const n = this.engine, r = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const i = Ct(n, "open", function() {
      r.onopen(), e && e();
    }), s = (l) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", l), e ? e(l) : this.maybeReconnectOnOpen();
    }, o = Ct(n, "error", s);
    if (this._timeout !== !1) {
      const l = this._timeout, a = this.setTimeoutFn(() => {
        i(), s(new Error("timeout")), n.close();
      }, l);
      this.opts.autoUnref && a.unref(), this.subs.push(() => {
        this.clearTimeoutFn(a);
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
    this.subs.push(Ct(e, "ping", this.onping.bind(this)), Ct(e, "data", this.ondata.bind(this)), Ct(e, "error", this.onerror.bind(this)), Ct(e, "close", this.onclose.bind(this)), Ct(this.decoder, "decoded", this.ondecoded.bind(this)));
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
    Da(() => {
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
    return r ? this._autoConnect && !r.active && r.connect() : (r = new Cp(this, e, n), this.nsps[e] = r), r;
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
const Br = {};
function Lo(t, e) {
  typeof t == "object" && (e = t, t = void 0), e = e || {};
  const n = K3(t, e.path || "/socket.io"), r = n.source, i = n.id, s = n.path, o = Br[i] && s in Br[i].nsps, l = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return l ? a = new Pl(r, e) : (Br[i] || (Br[i] = new Pl(r, e)), a = Br[i]), n.query && !e.query && (e.query = n.queryKey), a.socket(n.path, e);
}
Object.assign(Lo, {
  Manager: Pl,
  Socket: Cp,
  io: Lo,
  connect: Lo
});
const iw = Jt({
  name: "AuthorizationMessage",
  components: {
    Spinner: q1
  }
}), sw = { class: "flex flex-col items-center justify-center min-h-screen" }, ow = /* @__PURE__ */ ve("p", null, "Please scan your employee ID to continue.", -1);
function lw(t, e, n, r, i, s) {
  const o = at("Spinner");
  return fe(), Qe("div", sw, [
    Ne(o, { class: "w-8 mb-4" }),
    ow
  ]);
}
const aw = /* @__PURE__ */ xt(iw, [["render", lw]]), cw = {
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
    const n = Ws(0), r = Pn(() => {
      const s = Math.floor(n.value / 60), o = n.value % 60;
      return `${s}m ${o}s`;
    }), i = () => {
      const s = Date.now();
      n.value = Math.floor((t.tokenExpiration - s) / 1e3);
    };
    return Kh(() => {
      clearInterval(e), t.tokenExpiration && t.tokenExpiration > Date.now() && (e = setInterval(i, 1e3), i());
    }), Yl(() => {
      clearInterval(e);
    }), {
      timeLeftDisplay: r
    };
  }
}, uw = { class: "text-gray-500 text-sm" }, dw = /* @__PURE__ */ ve("strong", null, "Employee:", -1), fw = { key: 0 };
function pw(t, e, n, r, i, s) {
  return fe(), Qe("div", uw, [
    dw,
    ai(" " + _t(n.employeeName) + " ", 1),
    n.tokenExpiration ? (fe(), Qe("div", fw, " Timeout in " + _t(r.timeLeftDisplay), 1)) : fn("", !0)
  ]);
}
const hw = /* @__PURE__ */ xt(cw, [["render", pw]]), mw = Jt({
  name: "TimerWidget",
  data() {
    return {
      taskStarted: !1,
      startTime: /* @__PURE__ */ new Date(),
      elapsedTime: "00:00:00",
      interval: null
      // Adjust as necessary
    };
  },
  methods: {
    startTask() {
      this.taskStarted = !0, this.startTime = /* @__PURE__ */ new Date(), this.interval = setInterval(() => {
        const e = (/* @__PURE__ */ new Date()).getTime() - this.startTime.getTime(), n = Math.floor(e / (1e3 * 60 * 60)), r = Math.floor(e % (1e3 * 60 * 60) / (1e3 * 60)), i = Math.floor(e % (1e3 * 60) / 1e3);
        this.elapsedTime = `${n.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
      }, 1e3);
    },
    stopTask() {
      this.taskStarted = !1, clearInterval(this.interval);
    }
  },
  mounted() {
  },
  unmounted() {
    clearInterval(this.interval);
  }
}), gw = {
  key: 0,
  class: "fixed bottom-4 right-4 p-4 bg-gray-200 rounded-lg shadow-md"
}, yw = /* @__PURE__ */ ve("h4", { class: "font-bold text-xl" }, "Task Timer", -1), bw = { class: "text-gray-700" };
function vw(t, e, n, r, i, s) {
  return t.taskStarted ? (fe(), Qe("div", gw, [
    yw,
    ve("p", bw, _t(t.elapsedTime), 1)
  ])) : fn("", !0);
}
const ww = /* @__PURE__ */ xt(mw, [["render", vw]]), _w = {}, kw = { class: "card divide-y divide-gray-100 rounded-md border border-gray-200 flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 mt-2 mb-2" };
function xw(t, e) {
  return fe(), Qe("div", kw, [
    ar(t.$slots, "default")
  ]);
}
const Ep = /* @__PURE__ */ xt(_w, [["render", xw]]), Sw = Jt({
  name: "WorkOrderWidget",
  components: {
    Card: Ep
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
  }
}), Cw = { class: "flex flex-col" }, Ew = { class: "font-semibold text-gray-900" }, Mw = { class: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" };
function Aw(t, e, n, r, i, s) {
  const o = at("Card");
  return fe(), it(o, {
    onClick: e[0] || (e[0] = (l) => t.$emit("click", t.workOrder)),
    class: Ft({ "bg-blue-100": t.isSelected })
  }, {
    default: Rr(() => [
      ve("div", Cw, [
        ve("span", Ew, _t(t.workOrder.name), 1),
        ve("span", null, _t(t.workOrder.production_item), 1)
      ]),
      ve("span", Mw, _t(t.workOrder.status), 1)
    ]),
    _: 1
  }, 8, ["class"]);
}
const Tw = /* @__PURE__ */ xt(Sw, [["render", Aw]]);
var Ow = typeof global == "object" && global && global.Object === Object && global;
const jw = Ow;
var Pw = typeof self == "object" && self && self.Object === Object && self, Rw = jw || Pw || Function("return this")();
const Mp = Rw;
var Iw = Mp.Symbol;
const Ns = Iw;
var Ap = Object.prototype, Nw = Ap.hasOwnProperty, Lw = Ap.toString, $r = Ns ? Ns.toStringTag : void 0;
function zw(t) {
  var e = Nw.call(t, $r), n = t[$r];
  try {
    t[$r] = void 0;
    var r = !0;
  } catch {
  }
  var i = Lw.call(t);
  return r && (e ? t[$r] = n : delete t[$r]), i;
}
var Dw = Object.prototype, Bw = Dw.toString;
function $w(t) {
  return Bw.call(t);
}
var Hw = "[object Null]", Fw = "[object Undefined]", Hu = Ns ? Ns.toStringTag : void 0;
function Ww(t) {
  return t == null ? t === void 0 ? Fw : Hw : Hu && Hu in Object(t) ? zw(t) : $w(t);
}
function Vw(t) {
  return t != null && typeof t == "object";
}
var Kw = "[object Symbol]";
function Uw(t) {
  return typeof t == "symbol" || Vw(t) && Ww(t) == Kw;
}
var qw = /\s/;
function Gw(t) {
  for (var e = t.length; e-- && qw.test(t.charAt(e)); )
    ;
  return e;
}
var Jw = /^\s+/;
function Yw(t) {
  return t && t.slice(0, Gw(t) + 1).replace(Jw, "");
}
function Ls(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var Fu = 0 / 0, Xw = /^[-+]0x[0-9a-f]+$/i, Qw = /^0b[01]+$/i, Zw = /^0o[0-7]+$/i, e_ = parseInt;
function Wu(t) {
  if (typeof t == "number")
    return t;
  if (Uw(t))
    return Fu;
  if (Ls(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = Ls(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = Yw(t);
  var n = Qw.test(t);
  return n || Zw.test(t) ? e_(t.slice(2), n ? 2 : 8) : Xw.test(t) ? Fu : +t;
}
var t_ = function() {
  return Mp.Date.now();
};
const zo = t_;
var n_ = "Expected a function", r_ = Math.max, i_ = Math.min;
function es(t, e, n) {
  var r, i, s, o, l, a, c = 0, d = !1, f = !1, h = !0;
  if (typeof t != "function")
    throw new TypeError(n_);
  e = Wu(e) || 0, Ls(n) && (d = !!n.leading, f = "maxWait" in n, s = f ? r_(Wu(n.maxWait) || 0, e) : s, h = "trailing" in n ? !!n.trailing : h);
  function g(p) {
    var b = r, w = i;
    return r = i = void 0, c = p, o = t.apply(w, b), o;
  }
  function y(p) {
    return c = p, l = setTimeout(E, e), d ? g(p) : o;
  }
  function v(p) {
    var b = p - a, w = p - c, S = e - b;
    return f ? i_(S, s - w) : S;
  }
  function k(p) {
    var b = p - a, w = p - c;
    return a === void 0 || b >= e || b < 0 || f && w >= s;
  }
  function E() {
    var p = zo();
    if (k(p))
      return T(p);
    l = setTimeout(E, v(p));
  }
  function T(p) {
    return l = void 0, h && r ? g(p) : (r = i = void 0, o);
  }
  function j() {
    l !== void 0 && clearTimeout(l), c = 0, r = a = i = l = void 0;
  }
  function u() {
    return l === void 0 ? o : T(zo());
  }
  function m() {
    var p = zo(), b = k(p);
    if (r = arguments, i = this, a = p, b) {
      if (l === void 0)
        return y(a);
      if (f)
        return clearTimeout(l), l = setTimeout(E, e), g(a);
    }
    return l === void 0 && (l = setTimeout(E, e)), o;
  }
  return m.cancel = j, m.flush = u, m;
}
var s_ = "Expected a function";
function o_(t, e, n) {
  var r = !0, i = !0;
  if (typeof t != "function")
    throw new TypeError(s_);
  return Ls(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), es(t, e, {
    leading: r,
    maxWait: e,
    trailing: i
  });
}
var l_ = !!(typeof window < "u" && window.document && window.document.createElement), a_ = l_;
const Tp = /* @__PURE__ */ sa(a_);
var fr = function() {
  return fr = Object.assign || function(e) {
    for (var n, r = 1, i = arguments.length; r < i; r++) {
      n = arguments[r];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s]);
    }
    return e;
  }, fr.apply(this, arguments);
}, or = null, Vu = null;
Tp && window.addEventListener("resize", function() {
  Vu !== window.devicePixelRatio && (Vu = window.devicePixelRatio, or = null);
});
function Ku() {
  if (or === null) {
    if (typeof document > "u")
      return or = 0, or;
    var t = document.body, e = document.createElement("div");
    e.classList.add("simplebar-hide-scrollbar"), t.appendChild(e);
    var n = e.getBoundingClientRect().right;
    t.removeChild(e), or = n;
  }
  return or;
}
function Op(t) {
  return !t || !t.ownerDocument || !t.ownerDocument.defaultView ? window : t.ownerDocument.defaultView;
}
function jp(t) {
  return !t || !t.ownerDocument ? document : t.ownerDocument;
}
var Pp = function(t) {
  var e = {}, n = Array.prototype.reduce.call(t, function(r, i) {
    var s = i.name.match(/data-simplebar-(.+)/);
    if (s) {
      var o = s[1].replace(/\W+(.)/g, function(l, a) {
        return a.toUpperCase();
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
function Rp(t, e) {
  var n;
  t && (n = t.classList).add.apply(n, e.split(" "));
}
function Ip(t, e) {
  t && e.split(" ").forEach(function(n) {
    t.classList.remove(n);
  });
}
function Np(t) {
  return ".".concat(t.split(" ").join("."));
}
var c_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getElementWindow: Op,
  getElementDocument: jp,
  getOptions: Pp,
  addClasses: Rp,
  removeClasses: Ip,
  classNamesToQuery: Np
}), rn = Op, Do = jp, u_ = Pp, sn = Rp, on = Ip, st = Np, zs = (
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
        var i = rn(r.el);
        r.scrollXTicking || (i.requestAnimationFrame(r.scrollX), r.scrollXTicking = !0), r.scrollYTicking || (i.requestAnimationFrame(r.scrollY), r.scrollYTicking = !0), r.isScrolling || (r.isScrolling = !0, sn(r.el, r.classNames.scrolling)), r.showScrollbar("x"), r.showScrollbar("y"), r.onStopScrolling();
      }, this.scrollX = function() {
        r.axis.x.isOverflowing && r.positionScrollbar("x"), r.scrollXTicking = !1;
      }, this.scrollY = function() {
        r.axis.y.isOverflowing && r.positionScrollbar("y"), r.scrollYTicking = !1;
      }, this._onStopScrolling = function() {
        on(r.el, r.classNames.scrolling), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isScrolling = !1;
      }, this.onMouseEnter = function() {
        r.isMouseEntering || (sn(r.el, r.classNames.mouseEntered), r.showScrollbar("x"), r.showScrollbar("y"), r.isMouseEntering = !0), r.onMouseEntered();
      }, this._onMouseEntered = function() {
        on(r.el, r.classNames.mouseEntered), r.options.autoHide && (r.hideScrollbar("x"), r.hideScrollbar("y")), r.isMouseEntering = !1;
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
        var s, o, l, a, c, d, f, h, g, y, v;
        if (!(!r.draggedAxis || !r.contentWrapperEl)) {
          var k, E = r.axis[r.draggedAxis].track, T = (o = (s = E.rect) === null || s === void 0 ? void 0 : s[r.axis[r.draggedAxis].sizeAttr]) !== null && o !== void 0 ? o : 0, j = r.axis[r.draggedAxis].scrollbar, u = (a = (l = r.contentWrapperEl) === null || l === void 0 ? void 0 : l[r.axis[r.draggedAxis].scrollSizeAttr]) !== null && a !== void 0 ? a : 0, m = parseInt((d = (c = r.elStyles) === null || c === void 0 ? void 0 : c[r.axis[r.draggedAxis].sizeAttr]) !== null && d !== void 0 ? d : "0px", 10);
          i.preventDefault(), i.stopPropagation(), r.draggedAxis === "y" ? k = i.pageY : k = i.pageX;
          var p = k - ((h = (f = E.rect) === null || f === void 0 ? void 0 : f[r.axis[r.draggedAxis].offsetAttr]) !== null && h !== void 0 ? h : 0) - r.axis[r.draggedAxis].dragOffset;
          p = r.draggedAxis === "x" && r.isRtl ? ((y = (g = E.rect) === null || g === void 0 ? void 0 : g[r.axis[r.draggedAxis].sizeAttr]) !== null && y !== void 0 ? y : 0) - j.size - p : p;
          var b = p / (T - j.size), w = b * (u - m);
          r.draggedAxis === "x" && r.isRtl && (w = !((v = t.getRtlHelpers()) === null || v === void 0) && v.isScrollingToNegative ? -w : w), r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = w;
        }
      }, this.onEndDrag = function(i) {
        var s = Do(r.el), o = rn(r.el);
        i.preventDefault(), i.stopPropagation(), on(r.el, r.classNames.dragging), s.removeEventListener("mousemove", r.drag, !0), s.removeEventListener("mouseup", r.onEndDrag, !0), r.removePreventClickId = o.setTimeout(function() {
          s.removeEventListener("click", r.preventClick, !0), s.removeEventListener("dblclick", r.preventClick, !0), r.removePreventClickId = null;
        });
      }, this.preventClick = function(i) {
        i.preventDefault(), i.stopPropagation();
      }, this.el = e, this.options = fr(fr({}, t.defaultOptions), n), this.classNames = fr(fr({}, t.defaultOptions.classNames), n.classNames), this.axis = {
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
      this.onMouseMove = o_(this._onMouseMove, 64), this.onWindowResize = es(this._onWindowResize, 64, { leading: !0 }), this.onStopScrolling = es(this._onStopScrolling, this.stopScrollDelay), this.onMouseEntered = es(this._onMouseEntered, this.stopScrollDelay), this.init();
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
        return this.contentWrapperEl && getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar").display === "none" || "scrollbarWidth" in document.documentElement.style || "-ms-overflow-style" in document.documentElement.style ? 0 : Ku();
      } catch {
        return Ku();
      }
    }, t.getOffset = function(e) {
      var n = e.getBoundingClientRect(), r = Do(e), i = rn(e);
      return {
        top: n.top + (i.pageYOffset || r.documentElement.scrollTop),
        left: n.left + (i.pageXOffset || r.documentElement.scrollLeft)
      };
    }, t.prototype.init = function() {
      Tp && (this.initDOM(), this.rtlHelpers = t.getRtlHelpers(), this.scrollbarWidth = this.getScrollbarWidth(), this.recalculate(), this.initListeners());
    }, t.prototype.initDOM = function() {
      var e, n;
      this.wrapperEl = this.el.querySelector(st(this.classNames.wrapper)), this.contentWrapperEl = this.options.scrollableNode || this.el.querySelector(st(this.classNames.contentWrapper)), this.contentEl = this.options.contentNode || this.el.querySelector(st(this.classNames.contentEl)), this.offsetEl = this.el.querySelector(st(this.classNames.offset)), this.maskEl = this.el.querySelector(st(this.classNames.mask)), this.placeholderEl = this.findChild(this.wrapperEl, st(this.classNames.placeholder)), this.heightAutoObserverWrapperEl = this.el.querySelector(st(this.classNames.heightAutoObserverWrapperEl)), this.heightAutoObserverEl = this.el.querySelector(st(this.classNames.heightAutoObserverEl)), this.axis.x.track.el = this.findChild(this.el, "".concat(st(this.classNames.track)).concat(st(this.classNames.horizontal))), this.axis.y.track.el = this.findChild(this.el, "".concat(st(this.classNames.track)).concat(st(this.classNames.vertical))), this.axis.x.scrollbar.el = ((e = this.axis.x.track.el) === null || e === void 0 ? void 0 : e.querySelector(st(this.classNames.scrollbar))) || null, this.axis.y.scrollbar.el = ((n = this.axis.y.track.el) === null || n === void 0 ? void 0 : n.querySelector(st(this.classNames.scrollbar))) || null, this.options.autoHide || (sn(this.axis.x.scrollbar.el, this.classNames.visible), sn(this.axis.y.scrollbar.el, this.classNames.visible));
    }, t.prototype.initListeners = function() {
      var e = this, n, r = rn(this.el);
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
        var e = rn(this.el);
        this.elStyles = e.getComputedStyle(this.el), this.isRtl = this.elStyles.direction === "rtl";
        var n = this.contentEl.offsetWidth, r = this.heightAutoObserverEl.offsetHeight <= 1, i = this.heightAutoObserverEl.offsetWidth <= 1 || n > 0, s = this.contentWrapperEl.offsetWidth, o = this.elStyles.overflowX, l = this.elStyles.overflowY;
        this.contentEl.style.padding = "".concat(this.elStyles.paddingTop, " ").concat(this.elStyles.paddingRight, " ").concat(this.elStyles.paddingBottom, " ").concat(this.elStyles.paddingLeft), this.wrapperEl.style.margin = "-".concat(this.elStyles.paddingTop, " -").concat(this.elStyles.paddingRight, " -").concat(this.elStyles.paddingBottom, " -").concat(this.elStyles.paddingLeft);
        var a = this.contentEl.scrollHeight, c = this.contentEl.scrollWidth;
        this.contentWrapperEl.style.height = r ? "auto" : "100%", this.placeholderEl.style.width = i ? "".concat(n || c, "px") : "auto", this.placeholderEl.style.height = "".concat(a, "px");
        var d = this.contentWrapperEl.offsetHeight;
        this.axis.x.isOverflowing = n !== 0 && c > n, this.axis.y.isOverflowing = a > d, this.axis.x.isOverflowing = o === "hidden" ? !1 : this.axis.x.isOverflowing, this.axis.y.isOverflowing = l === "hidden" ? !1 : this.axis.y.isOverflowing, this.axis.x.forceVisible = this.options.forceVisible === "x" || this.options.forceVisible === !0, this.axis.y.forceVisible = this.options.forceVisible === "y" || this.options.forceVisible === !0, this.hideNativeScrollbar();
        var f = this.axis.x.isOverflowing ? this.scrollbarWidth : 0, h = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
        this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > s - h, this.axis.y.isOverflowing = this.axis.y.isOverflowing && a > d - f, this.axis.x.scrollbar.size = this.getScrollbarSize("x"), this.axis.y.scrollbar.size = this.getScrollbarSize("y"), this.axis.x.scrollbar.el && (this.axis.x.scrollbar.el.style.width = "".concat(this.axis.x.scrollbar.size, "px")), this.axis.y.scrollbar.el && (this.axis.y.scrollbar.el.style.height = "".concat(this.axis.y.scrollbar.size, "px")), this.positionScrollbar("x"), this.positionScrollbar("y"), this.toggleTrackVisibility("x"), this.toggleTrackVisibility("y");
      }
    }, t.prototype.getScrollbarSize = function(e) {
      var n, r;
      if (e === void 0 && (e = "y"), !this.axis[e].isOverflowing || !this.contentEl)
        return 0;
      var i = this.contentEl[this.axis[e].scrollSizeAttr], s = (r = (n = this.axis[e].track.el) === null || n === void 0 ? void 0 : n[this.axis[e].offsetSizeAttr]) !== null && r !== void 0 ? r : 0, o = s / i, l;
      return l = Math.max(~~(o * s), this.options.scrollbarMinSize), this.options.scrollbarMaxSize && (l = Math.min(l, this.options.scrollbarMaxSize)), l;
    }, t.prototype.positionScrollbar = function(e) {
      var n, r, i;
      e === void 0 && (e = "y");
      var s = this.axis[e].scrollbar;
      if (!(!this.axis[e].isOverflowing || !this.contentWrapperEl || !s.el || !this.elStyles)) {
        var o = this.contentWrapperEl[this.axis[e].scrollSizeAttr], l = ((n = this.axis[e].track.el) === null || n === void 0 ? void 0 : n[this.axis[e].offsetSizeAttr]) || 0, a = parseInt(this.elStyles[this.axis[e].sizeAttr], 10), c = this.contentWrapperEl[this.axis[e].scrollOffsetAttr];
        c = e === "x" && this.isRtl && (!((r = t.getRtlHelpers()) === null || r === void 0) && r.isScrollOriginAtZero) ? -c : c, e === "x" && this.isRtl && (c = !((i = t.getRtlHelpers()) === null || i === void 0) && i.isScrollingToNegative ? c : -c);
        var d = c / (o - a), f = ~~((l - s.size) * d);
        f = e === "x" && this.isRtl ? -f + (l - s.size) : f, s.el.style.transform = e === "x" ? "translate3d(".concat(f, "px, 0, 0)") : "translate3d(0, ".concat(f, "px, 0)");
      }
    }, t.prototype.toggleTrackVisibility = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e].track.el, r = this.axis[e].scrollbar.el;
      !n || !r || !this.contentWrapperEl || (this.axis[e].isOverflowing || this.axis[e].forceVisible ? (n.style.visibility = "visible", this.contentWrapperEl.style[this.axis[e].overflowAttr] = "scroll", this.el.classList.add("".concat(this.classNames.scrollable, "-").concat(e))) : (n.style.visibility = "hidden", this.contentWrapperEl.style[this.axis[e].overflowAttr] = "hidden", this.el.classList.remove("".concat(this.classNames.scrollable, "-").concat(e))), this.axis[e].isOverflowing ? r.style.display = "block" : r.style.display = "none");
    }, t.prototype.showScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && !this.axis[e].scrollbar.isVisible && (sn(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !0);
    }, t.prototype.hideScrollbar = function(e) {
      e === void 0 && (e = "y"), this.axis[e].isOverflowing && this.axis[e].scrollbar.isVisible && (on(this.axis[e].scrollbar.el, this.classNames.visible), this.axis[e].scrollbar.isVisible = !1);
    }, t.prototype.hideNativeScrollbar = function() {
      this.offsetEl && (this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px", this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-".concat(this.scrollbarWidth, "px") : "0px");
    }, t.prototype.onMouseMoveForAxis = function(e) {
      e === void 0 && (e = "y");
      var n = this.axis[e];
      !n.track.el || !n.scrollbar.el || (n.track.rect = n.track.el.getBoundingClientRect(), n.scrollbar.rect = n.scrollbar.el.getBoundingClientRect(), this.isWithinBounds(n.track.rect) ? (this.showScrollbar(e), sn(n.track.el, this.classNames.hover), this.isWithinBounds(n.scrollbar.rect) ? sn(n.scrollbar.el, this.classNames.hover) : on(n.scrollbar.el, this.classNames.hover)) : (on(n.track.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e)));
    }, t.prototype.onMouseLeaveForAxis = function(e) {
      e === void 0 && (e = "y"), on(this.axis[e].track.el, this.classNames.hover), on(this.axis[e].scrollbar.el, this.classNames.hover), this.options.autoHide && this.hideScrollbar(e);
    }, t.prototype.onDragStart = function(e, n) {
      var r;
      n === void 0 && (n = "y");
      var i = Do(this.el), s = rn(this.el), o = this.axis[n].scrollbar, l = n === "y" ? e.pageY : e.pageX;
      this.axis[n].dragOffset = l - (((r = o.rect) === null || r === void 0 ? void 0 : r[this.axis[n].offsetAttr]) || 0), this.draggedAxis = n, sn(this.el, this.classNames.dragging), i.addEventListener("mousemove", this.drag, !0), i.addEventListener("mouseup", this.onEndDrag, !0), this.removePreventClickId === null ? (i.addEventListener("click", this.preventClick, !0), i.addEventListener("dblclick", this.preventClick, !0)) : (s.clearTimeout(this.removePreventClickId), this.removePreventClickId = null);
    }, t.prototype.onTrackClick = function(e, n) {
      var r = this, i, s, o, l;
      n === void 0 && (n = "y");
      var a = this.axis[n];
      if (!(!this.options.clickOnTrack || !a.scrollbar.el || !this.contentWrapperEl)) {
        e.preventDefault();
        var c = rn(this.el);
        this.axis[n].scrollbar.rect = a.scrollbar.el.getBoundingClientRect();
        var d = this.axis[n].scrollbar, f = (s = (i = d.rect) === null || i === void 0 ? void 0 : i[this.axis[n].offsetAttr]) !== null && s !== void 0 ? s : 0, h = parseInt((l = (o = this.elStyles) === null || o === void 0 ? void 0 : o[this.axis[n].sizeAttr]) !== null && l !== void 0 ? l : "0px", 10), g = this.contentWrapperEl[this.axis[n].scrollOffsetAttr], y = n === "y" ? this.mouseY - f : this.mouseX - f, v = y < 0 ? -1 : 1, k = v === -1 ? g - h : g + h, E = 40, T = function() {
          r.contentWrapperEl && (v === -1 ? g > k && (g -= E, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = g, c.requestAnimationFrame(T)) : g < k && (g += E, r.contentWrapperEl[r.axis[n].scrollOffsetAttr] = g, c.requestAnimationFrame(T)));
        };
        T();
      }
    }, t.prototype.getContentElement = function() {
      return this.contentEl;
    }, t.prototype.getScrollElement = function() {
      return this.contentWrapperEl;
    }, t.prototype.removeListeners = function() {
      var e = rn(this.el);
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
    }, t.getOptions = u_, t.helpers = c_, t;
  }()
), Dn = function() {
  return Dn = Object.assign || function(e) {
    for (var n, r = 1, i = arguments.length; r < i; r++) {
      n = arguments[r];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s]);
    }
    return e;
  }, Dn.apply(this, arguments);
}, d_ = {
  beforeUnmount: "beforeUnmount",
  unmount: "unmount"
}, Hr;
function f_(t) {
  var e, n = t.h, r = t.emit, i = t.slots, s = t.props, o = function(a) {
    return r("scroll", a);
  }, l = Dn(Dn({}, zs.defaultOptions.classNames), s.classNames);
  return n("div", Dn({ ref: "element" }, {
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
          n("div", Dn(Dn({}, {
            onScroll: o,
            class: l.contentWrapper,
            tabIndex: 0,
            role: "region",
            "aria-label": s.ariaLabel || zs.defaultOptions.ariaLabel
          }), { ref: "scrollElement" }), [
            n("div", { class: l.contentEl, ref: "contentElement" }, (e = i.default) === null || e === void 0 ? void 0 : e.call(i))
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
var p_ = Jt((Hr = {
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
    for (var t = zs.getOptions(this.$refs.element.attributes), e = 0, n = Object.entries(this.$props); e < n.length; e++) {
      var r = n[e], i = r[0], s = r[1];
      s != null && typeof s != "function" && (t[i] = s);
    }
    this.SimpleBar = new zs(this.$refs.element, t), this.scrollElement = this.$refs.scrollElement, this.contentElement = this.$refs.contentElement;
  }
}, Hr[d_.beforeUnmount] = function() {
  var t;
  (t = this.SimpleBar) === null || t === void 0 || t.unMount(), this.SimpleBar = void 0;
}, Hr.methods = {
  recalculate: function() {
    var t;
    (t = this.SimpleBar) === null || t === void 0 || t.recalculate();
  }
}, /**
 * Note that createElement argument is only provided in <=vue@2.7.x,
 * in other versions it's a context object that we do not use.
 */
Hr.render = function(t) {
  var e = this;
  return f_({
    h: typeof t == "function" ? t : Hd,
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
}, Hr));
const h_ = Jt({
  name: "Column",
  components: {
    Simplebar: p_
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
}), m_ = { class: "px-4 py-6 sm:px-0" }, g_ = { class: "text-lg leading-6 font-medium text-gray-900" }, y_ = { class: "mt-1 text-sm text-gray-500" };
function b_(t, e, n, r, i, s) {
  const o = at("Simplebar");
  return fe(), it(o, {
    class: "flex-none transition ease-in-out duration-500 py-6 sm:px-6 lg:px-8",
    transition: "expand"
  }, {
    default: Rr(() => [
      ve("div", m_, [
        ve("h3", g_, _t(t.title), 1),
        ve("p", y_, _t(t.description), 1)
      ]),
      ar(t.$slots, "default")
    ]),
    _: 3
  });
}
const Lp = /* @__PURE__ */ xt(h_, [["render", b_]]), v_ = Jt({
  name: "WorkOrderList",
  components: {
    WorkOrderWidget: Tw,
    Column: Lp
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
}), w_ = { id: "WorkOrders" };
function __(t, e, n, r, i, s) {
  const o = at("WorkOrderWidget"), l = at("Column");
  return fe(), it(l, {
    class: Ft({ "w-full": !t.selectedWorkOrder, "w-1/2": t.selectedWorkOrder }),
    title: "Work Orders",
    description: "Select a work order to view job cards"
  }, {
    default: Rr(() => [
      ve("div", w_, [
        (fe(!0), Qe(Ge, null, Ed(t.workOrders, (a) => (fe(), it(o, {
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
const k_ = /* @__PURE__ */ xt(v_, [["render", __]]), x_ = Jt({
  name: "JobCardWidget",
  components: {
    Button: $1,
    Card: Ep
  },
  props: {
    jobCard: {
      type: Object,
      default: () => {
      }
    }
  },
  methods: {
    toggleTimer(t) {
      this.$emit("toggleTimer", t);
    }
  }
});
function S_(t, e, n, r, i, s) {
  const o = at("Button"), l = at("Card");
  return fe(), it(l, null, {
    default: Rr(() => [
      ai(_t(t.jobCard.operation) + " ", 1),
      Ne(o, {
        onClick: e[0] || (e[0] = (a) => t.toggleTimer(t.jobCard.status)),
        label: t.jobCard.status === "started" ? "Stop" : "Start"
      }, null, 8, ["label"])
    ]),
    _: 1
  });
}
const C_ = /* @__PURE__ */ xt(x_, [["render", S_]]), E_ = Jt({
  name: "JobCards",
  components: {
    JobCardWidget: C_,
    Column: Lp
  },
  props: {
    jobCards: {
      type: Array,
      default: () => []
    }
  }
}), M_ = { id: "JobCards" };
function A_(t, e, n, r, i, s) {
  const o = at("JobCardWidget"), l = at("Column");
  return fe(), it(l, {
    title: "Job Cards",
    description: "Select a job card to start the timer",
    class: "w-1/2"
  }, {
    default: Rr(() => [
      ve("div", M_, [
        (fe(!0), Qe(Ge, null, Ed(t.jobCards, (a) => (fe(), it(o, {
          key: a.name,
          jobCard: a
        }, null, 8, ["jobCard"]))), 128))
      ])
    ]),
    _: 1
  });
}
const T_ = /* @__PURE__ */ xt(E_, [["render", A_]]), O_ = Jt({
  name: "JobTimeClock",
  components: {
    AuthorizationMessage: aw,
    JobCardList: T_,
    SessionTimer: hw,
    TimerWidget: ww,
    WorkOrderList: k_
  },
  data() {
    return {
      employeeId: "",
      employeeName: "",
      header: "Job Timeclock",
      jobCards: [],
      selectedWorkOrder: null,
      showAuthMessage: !1,
      token: S1("token", null),
      tokenExpiration: 0,
      workOrders: []
    };
  },
  computed: {
    isSessionActive() {
      const t = Date.now();
      return this.tokenExpiration && this.tokenExpiration > t;
    }
  },
  methods: {
    async authenticateEmployee(t) {
      const e = await fo("timeclock.www.job_timeclock.authenticate_employee", { rfid: t });
      e?.status === "success" ? (this.token = e.token, await this.getWorkOrders()) : console.log("Sorry! You are not authenticated.");
    },
    async decodeToken() {
      const t = E1(this.token);
      this.tokenExpiration = t.exp * 1e3, this.employeeId = t.employee_id, this.employeeName = t.employee_name, console.log("Hurrah! You are authenticated as ", t.employee_name);
    },
    async getWorkOrders() {
      const t = await fo("timeclock.www.job_timeclock.get_work_orders", { token: this.token });
      t?.status === "success" ? (this.token = t.token, this.workOrders = t.work_orders, console.log(this.workOrders)) : this.workOrders = [];
    },
    selectWorkOrder(t) {
      this.selectedWorkOrder = t, this.getJobCards(t.name);
    },
    async getJobCards(t) {
      const e = await fo("timeclock.www.job_timeclock.get_job_cards", { token: this.token, work_order: t });
      e?.status === "success" ? (this.token = e.token, this.jobCards = e.job_cards) : this.jobCards = [];
    }
  },
  mounted() {
    this.token && this.getWorkOrders();
    const t = A1.attachTo(document, {
      onScan: this.authenticateEmployee,
      ignoreIfFocusOn: ".frappe-input"
    });
    window.scanner = t, yr(() => this.token, (e) => {
      e && this.decodeToken();
    }, { immediate: !0 });
  }
}), j_ = { class: "bg-white shadow fixed w-screen top-0 z-10 h-20" }, P_ = { class: "mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center" }, R_ = { class: "text-3xl font-bold tracking-tight text-gray-900" }, I_ = {
  key: 0,
  class: "flex h-screen overflow-hidden pt-16"
}, N_ = { key: 1 };
function L_(t, e, n, r, i, s) {
  const o = at("SessionTimer"), l = at("WorkOrderList"), a = at("JobCardList"), c = at("TimerWidget"), d = at("AuthorizationMessage");
  return fe(), Qe(Ge, null, [
    ve("header", j_, [
      ve("div", P_, [
        ve("h1", R_, _t(t.header), 1),
        t.isSessionActive ? (fe(), it(o, {
          key: 0,
          employeeName: t.employeeName,
          tokenExpiration: t.tokenExpiration
        }, null, 8, ["employeeName", "tokenExpiration"])) : fn("", !0)
      ])
    ]),
    t.isSessionActive ? (fe(), Qe("main", I_, [
      Ne(l, {
        workOrders: t.workOrders,
        selectedWorkOrder: t.selectedWorkOrder,
        onSelect: t.selectWorkOrder
      }, null, 8, ["workOrders", "selectedWorkOrder", "onSelect"]),
      t.selectedWorkOrder ? (fe(), it(a, {
        key: 0,
        jobCards: t.jobCards,
        onToggleTimer: t.toggleTimer
      }, null, 8, ["jobCards", "onToggleTimer"])) : fn("", !0),
      Ne(c, {
        ref: "timerRef",
        class: "fixed bottom-4 right-4"
      }, null, 512)
    ])) : (fe(), Qe("main", N_, [
      Ne(d)
    ]))
  ], 64);
}
const z_ = /* @__PURE__ */ xt(O_, [["render", L_]]);
let D_ = l1(z_);
D_.mount("#app");
