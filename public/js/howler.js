/*!
 *  howler.js v1.1.20
 *  howlerjs.com
 *
 *  (c) 2013-2014, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
! function () {
  var e = {}, t = null,
    n = !0,
    r = !1;
  try {
    "undefined" != typeof AudioContext ? t = new AudioContext : "undefined" !=
      typeof webkitAudioContext ? t = new webkitAudioContext : n = !1
  } catch (i) {
    n = !1
  }
  if (!n)
    if ("undefined" != typeof Audio) try {
      new Audio
    } catch (i) {
      r = !0
    } else r = !0;
  if (n) {
    var s = void 0 === t.createGain ? t.createGainNode() : t.createGain();
    s.gain.value = 1, s.connect(t.destination)
  }
  var o = function () {
    this._volume = 1, this._muted = !1, this.usingWebAudio = n, this.noAudio =
      r, this._howls = []
  };
  o.prototype = {
    volume: function (e) {
      var t = this;
      if (e = parseFloat(e), e >= 0 && 1 >= e) {
        t._volume = e, n && (s.gain.value = e);
        for (var r in t._howls)
          if (t._howls.hasOwnProperty(r) && t._howls[r]._webAudio === !1)
            for (var i = 0; i < t._howls[r]._audioNode.length; i++) t._howls[r]
              ._audioNode[i].volume = t._howls[r]._volume * t._volume;
        return t
      }
      return n ? s.gain.value : t._volume
    },
    mute: function () {
      return this._setMuted(!0), this
    },
    unmute: function () {
      return this._setMuted(!1), this
    },
    _setMuted: function (e) {
      var t = this;
      t._muted = e, n && (s.gain.value = e ? 0 : t._volume);
      for (var r in t._howls)
        if (t._howls.hasOwnProperty(r) && t._howls[r]._webAudio === !1)
          for (var i = 0; i < t._howls[r]._audioNode.length; i++) t._howls[r]._audioNode[
            i].muted = e
    }
  };
  var u = new o,
    a = null;
  if (!r) {
    a = new Audio;
    var f = {
      mp3: !! a.canPlayType("audio/mpeg;").replace(/^no$/, ""),
      opus: !! a.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
      ogg: !! a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
      wav: !! a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
      m4a: !! (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(
        /^no$/, ""),
      mp4: !! (a.canPlayType("audio/x-mp4;") || a.canPlayType("audio/aac;")).replace(
        /^no$/, ""),
      weba: !! a.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
    }
  }
  var l = function (e) {
    var t = this;
    t._autoplay = e.autoplay || !1, t._buffer = e.buffer || !1, t._duration = e
      .duration || 0, t._format = e.format || null, t._loop = e.loop || !1, t._loaded = !
      1, t._sprite = e.sprite || {}, t._src = e.src || "", t._pos3d = e.pos3d ||
      [0, 0, -.5], t._volume = void 0 !== e.volume ? e.volume : 1, t._urls = e.urls ||
      [], t._rate = e.rate || 1, t._model = e.model || null, t._onload = [e.onload ||
        function () {}
    ], t._onloaderror = [e.onloaderror || function () {}], t._onend = [e.onend ||
      function () {}
    ], t._onpause = [e.onpause || function () {}], t._onplay = [e.onplay ||
      function () {}
    ], t._onendTimer = [], t._webAudio = n && !t._buffer, t._audioNode = [], t._webAudio &&
      t._setupAudioNode(), u._howls.push(t), t.load()
  };
  if (l.prototype = {
    load: function () {
      var t = this,
        n = null;
      if (r) return void t.on("loaderror");
      for (var i = 0; i < t._urls.length; i++) {
        var s, a;
        if (t._format) s = t._format;
        else {
          if (a = t._urls[i].toLowerCase().split("?")[0], s = a.match(
            /.+\.([^?]+)(\?|$)/), s = s && s.length >= 2 ? s : a.match(
            /data\:audio\/([^?]+);/), !s) return void t.on("loaderror");
          s = s[1]
        } if (f[s]) {
          n = t._urls[i];
          break
        }
      }
      if (!n) return void t.on("loaderror");
      if (t._src = n, t._webAudio) c(t, n);
      else {
        var l = new Audio;
        l.addEventListener("error", function () {
          l.error && 4 === l.error.code && (o.noAudio = !0), t.on(
            "loaderror", {
              type: l.error ? l.error.code : 0
            })
        }, !1), t._audioNode.push(l), l.src = n, l._pos = 0, l.preload =
          "auto", l.volume = u._muted ? 0 : t._volume * u.volume(), e[n] = t;
        var h = function () {
          t._duration = Math.ceil(10 * l.duration) / 10, 0 === Object.getOwnPropertyNames(
            t._sprite).length && (t._sprite = {
            _default: [0, 1e3 * t._duration]
          }), t._loaded || (t._loaded = !0, t.on("load")), t._autoplay && t.play(),
            l.removeEventListener("canplaythrough", h, !1)
        };
        l.addEventListener("canplaythrough", h, !1), l.load()
      }
      return t
    },
    urls: function (e) {
      var t = this;
      return e ? (t.stop(), t._urls = "string" == typeof e ? [e] : e, t._loaded = !
        1, t.load(), t) : t._urls
    },
    play: function (e, n) {
      var r = this;
      return "function" == typeof e && (n = e), e && "function" != typeof e ||
        (e = "_default"), r._loaded ? r._sprite[e] ? (r._inactiveNode(
        function (i) {
          i._sprite = e;
          var s, o = i._pos > 0 ? i._pos : r._sprite[e][0] / 1e3,
            a = r._sprite[e][1] / 1e3 - i._pos,
            f = !(!r._loop && !r._sprite[e][2]),
            l = "string" == typeof n ? n : Math.round(Date.now() * Math.random()) +
              "";
          if (function () {
            var t = {
              id: l,
              sprite: e,
              loop: f
            };
            s = setTimeout(function () {
              !r._webAudio && f && r.stop(t.id).play(e, t.id), r._webAudio && !
                f && (r._nodeById(t.id).paused = !0, r._nodeById(t.id)._pos =
                  0), r._webAudio || f || r.stop(t.id), r.on("end", l)
            }, 1e3 * a), r._onendTimer.push({
              timer: s,
              id: t.id
            })
          }(), r._webAudio) {
            var c = r._sprite[e][0] / 1e3,
              h = r._sprite[e][1] / 1e3;
            i.id = l, i.paused = !1, p(r, [f, c, h], l), r._playStart = t.currentTime,
              i.gain.value = r._volume, void 0 === i.bufferSource.start ? i
              .bufferSource.noteGrainOn(0, o, a) : i.bufferSource.start(0,
                o, a)
          } else {
            if (4 !== i.readyState && (i.readyState || !navigator.isCocoonJS))
              return r._clearEndTimer(l),
            function () {
              var t = r,
                s = e,
                o = n,
                u = i,
                a = function () {
                  t.play(s, o), u.removeEventListener("canplaythrough", a, !
                    1)
                };
              u.addEventListener("canplaythrough", a, !1)
            }(), r;
            i.readyState = 4, i.id = l, i.currentTime = o, i.muted = u._muted ||
              i.muted, i.volume = r._volume * u.volume(), setTimeout(
                function () {
                  i.play()
                }, 0)
          }
          return r.on("play"), "function" == typeof n && n(l), r
        }), r) : ("function" == typeof n && n(), r) : (r.on("load", function () {
        r.play(e, n)
      }), r)
    },
    pause: function (e) {
      var t = this;
      if (!t._loaded) return t.on("play", function () {
        t.pause(e)
      }), t;
      t._clearEndTimer(e);
      var n = e ? t._nodeById(e) : t._activeNode();
      if (n)
        if (n._pos = t.pos(null, e), t._webAudio) {
          if (!n.bufferSource || n.paused) return t;
          n.paused = !0, void 0 === n.bufferSource.stop ? n.bufferSource.noteOff(
            0) : n.bufferSource.stop(0)
        } else n.pause();
      return t.on("pause"), t
    },
    stop: function (e) {
      var t = this;
      if (!t._loaded) return t.on("play", function () {
        t.stop(e)
      }), t;
      t._clearEndTimer(e);
      var n = e ? t._nodeById(e) : t._activeNode();
      if (n)
        if (n._pos = 0, t._webAudio) {
          if (!n.bufferSource || n.paused) return t;
          n.paused = !0, void 0 === n.bufferSource.stop ? n.bufferSource.noteOff(
            0) : n.bufferSource.stop(0)
        } else isNaN(n.duration) || (n.pause(), n.currentTime = 0);
      return t
    },
    mute: function (e) {
      var t = this;
      if (!t._loaded) return t.on("play", function () {
        t.mute(e)
      }), t;
      var n = e ? t._nodeById(e) : t._activeNode();
      return n && (t._webAudio ? n.gain.value = 0 : n.muted = !0), t
    },
    unmute: function (e) {
      var t = this;
      if (!t._loaded) return t.on("play", function () {
        t.unmute(e)
      }), t;
      var n = e ? t._nodeById(e) : t._activeNode();
      return n && (t._webAudio ? n.gain.value = t._volume : n.muted = !1), t
    },
    volume: function (e, t) {
      var n = this;
      if (e = parseFloat(e), e >= 0 && 1 >= e) {
        if (n._volume = e, !n._loaded) return n.on("play", function () {
          n.volume(e, t)
        }), n;
        var r = t ? n._nodeById(t) : n._activeNode();
        return r && (n._webAudio ? r.gain.value = e : r.volume = e * u.volume()),
          n
      }
      return n._volume
    },
    loop: function (e) {
      var t = this;
      return "boolean" == typeof e ? (t._loop = e, t) : t._loop
    },
    sprite: function (e) {
      var t = this;
      return "object" == typeof e ? (t._sprite = e, t) : t._sprite
    },
    pos: function (e, n) {
      var r = this;
      if (!r._loaded) return r.on("load", function () {
        r.pos(e)
      }), "number" == typeof e ? r : r._pos || 0;
      e = parseFloat(e);
      var i = n ? r._nodeById(n) : r._activeNode();
      if (i) return e >= 0 ? (r.pause(n), i._pos = e, r.play(i._sprite, n), r) :
        r._webAudio ? i._pos + (t.currentTime - r._playStart) : i.currentTime;
      if (e >= 0) return r;
      for (var s = 0; s < r._audioNode.length; s++)
        if (r._audioNode[s].paused && 4 === r._audioNode[s].readyState) return r
          ._webAudio ? r._audioNode[s]._pos : r._audioNode[s].currentTime
    },
    pos3d: function (e, t, n, r) {
      var i = this;
      if (t = void 0 !== t && t ? t : 0, n = void 0 !== n && n ? n : -.5, !i._loaded)
        return i.on("play", function () {
          i.pos3d(e, t, n, r)
        }), i;
      if (!(e >= 0 || 0 > e)) return i._pos3d;
      if (i._webAudio) {
        var s = r ? i._nodeById(r) : i._activeNode();
        s && (i._pos3d = [e, t, n], s.panner.setPosition(e, t, n), s.panner.panningModel =
          i._model || "HRTF")
      }
      return i
    },
    fade: function (e, t, n, r, i) {
      var s = this,
        o = Math.abs(e - t),
        u = e > t ? "down" : "up",
        a = o / .01,
        f = n / a;
      if (!s._loaded) return s.on("load", function () {
        s.fade(e, t, n, r, i)
      }), s;
      s.volume(e, i);
      for (var l = 1; a >= l; l++)! function () {
        var e = s._volume + ("up" === u ? .01 : -.01) * l,
          n = Math.round(1e3 * e) / 1e3,
          o = t;
        setTimeout(function () {
          s.volume(n, i), n === o && r && r()
        }, f * l)
      }()
    },
    fadeIn: function (e, t, n) {
      return this.volume(0).play().fade(0, e, t, n)
    },
    fadeOut: function (e, t, n, r) {
      var i = this;
      return i.fade(i._volume, e, t, function () {
        n && n(), i.pause(r), i.on("end")
      }, r)
    },
    _nodeById: function (e) {
      for (var t = this, n = t._audioNode[0], r = 0; r < t._audioNode.length; r++)
        if (t._audioNode[r].id === e) {
          n = t._audioNode[r];
          break
        }
      return n
    },
    _activeNode: function () {
      for (var e = this, t = null, n = 0; n < e._audioNode.length; n++)
        if (!e._audioNode[n].paused) {
          t = e._audioNode[n];
          break
        }
      return e._drainPool(), t
    },
    _inactiveNode: function (e) {
      for (var t = this, n = null, r = 0; r < t._audioNode.length; r++)
        if (t._audioNode[r].paused && 4 === t._audioNode[r].readyState) {
          e(t._audioNode[r]), n = !0;
          break
        }
      if (t._drainPool(), !n) {
        var i;
        t._webAudio ? (i = t._setupAudioNode(), e(i)) : (t.load(), i = t._audioNode[
          t._audioNode.length - 1], i.addEventListener(navigator.isCocoonJS ?
          "canplaythrough" : "loadedmetadata", function () {
            e(i)
          }))
      }
    },
    _drainPool: function () {
      var e, t = this,
        n = 0;
      for (e = 0; e < t._audioNode.length; e++) t._audioNode[e].paused && n++;
      for (e = t._audioNode.length - 1; e >= 0 && !(5 >= n); e--) t._audioNode[
        e].paused && (t._webAudio && t._audioNode[e].disconnect(0), n--, t._audioNode
        .splice(e, 1))
    },
    _clearEndTimer: function (e) {
      for (var t = this, n = 0, r = 0; r < t._onendTimer.length; r++)
        if (t._onendTimer[r].id === e) {
          n = r;
          break
        }
      var i = t._onendTimer[n];
      i && (clearTimeout(i.timer), t._onendTimer.splice(n, 1))
    },
    _setupAudioNode: function () {
      var e = this,
        n = e._audioNode,
        r = e._audioNode.length;
      return n[r] = void 0 === t.createGain ? t.createGainNode() : t.createGain(),
        n[r].gain.value = e._volume, n[r].paused = !0, n[r]._pos = 0, n[r].readyState =
        4, n[r].connect(s), n[r].panner = t.createPanner(), n[r].panner.panningModel =
        e._model || "equalpower", n[r].panner.setPosition(e._pos3d[0], e._pos3d[
          1], e._pos3d[2]), n[r].panner.connect(n[r]), n[r]
    },
    on: function (e, t) {
      var n = this,
        r = n["_on" + e];
      if ("function" == typeof t) r.push(t);
      else
        for (var i = 0; i < r.length; i++) t ? r[i].call(n, t) : r[i].call(n);
      return n
    },
    off: function (e, t) {
      for (var n = this, r = n["_on" + e], i = "" + t, s = 0; s < r.length; s++)
        if (i === "" + r[s]) {
          r.splice(s, 1);
          break
        }
      return n
    },
    unload: function () {
      for (var t = this, n = t._audioNode, r = 0; r < t._audioNode.length; r++)
        n[r].paused || t.stop(n[r].id), t._webAudio ? n[r].disconnect(0) : n[
          r].src = "";
      for (r = 0; r < t._onendTimer.length; r++) clearTimeout(t._onendTimer[r]
        .timer);
      var i = u._howls.indexOf(t);
      null !== i && i >= 0 && u._howls.splice(i, 1), delete e[t._src], t =
        null
    }
  }, n) var c = function (n, r) {
    if (r in e) n._duration = e[r].duration, h(n);
    else {
      var i = new XMLHttpRequest;
      i.open("GET", r, !0), i.responseType = "arraybuffer", i.onload = function () {
        t.decodeAudioData(i.response, function (t) {
          t && (e[r] = t, h(n, t))
        }, function () {
          n.on("loaderror")
        })
      }, i.onerror = function () {
        n._webAudio && (n._buffer = !0, n._webAudio = !1, n._audioNode = [],
          delete n._gainNode, n.load())
      };
      try {
        i.send()
      } catch (s) {
        i.onerror()
      }
    }
  }, h = function (e, t) {
      e._duration = t ? t.duration : e._duration, 0 === Object.getOwnPropertyNames(
        e._sprite).length && (e._sprite = {
        _default: [0, 1e3 * e._duration]
      }), e._loaded || (e._loaded = !0, e.on("load")), e._autoplay && e.play()
    }, p = function (n, r, i) {
      var s = n._nodeById(i);
      s.bufferSource = t.createBufferSource(), s.bufferSource.buffer = e[n._src],
        s.bufferSource.connect(s.panner), s.bufferSource.loop = r[0], r[0] && (
          s.bufferSource.loopStart = r[1], s.bufferSource.loopEnd = r[1] + r[2]
      ), s.bufferSource.playbackRate.value = n._rate
    };
  "function" == typeof define && define.amd && define(function () {
    return {
      Howler: u,
      Howl: l
    }
  }), "undefined" != typeof exports && (exports.Howler = u, exports.Howl = l),
    "undefined" != typeof window && (window.Howler = u, window.Howl = l)
}();