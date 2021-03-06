// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.
(function () {
    var a;
    var b;
    var c = this;
    var d = "Index out of range";
    var e = "Sequence contains no elements.";
    var f = "Invalid operation";
    if (typeof ProvideCustomL2ORootObject == "undefined") b = c.L2O = {};
    else b = ProvideCustomL2ORootObject();
    var g = function () { };
    var h = function () {
        return new Date().getTime();
    };
    var i = function (I, J) {
        return I === J;
    };
    var j = function (I) {
        return I;
    };
    var k = function (I) {
        var J = [];
        for (var K = 0; K < I.length; K++) J.push(I[K]);
        return J;
    };
    var l = b.Enumerable = function (I) {
        this.GetEnumerator = I;
    };
    var m = l.Create = function (I) {
        return new l(I);
    };
    var n = l.Return = function (I) {
        return m(function () {
            var J = false;
            return H(function () {
                if (J) return false;
                J = true;
                return true;
            }, function () {
                return I;
            }, j);
        });
    };
    var o = l.Never = function () {
        return m(function () {
            return H(function () {
                while (true);
            }, j, j);
        });
    };
    var p = l.Throw = function (I) {
        return m(function () {
            return H(function () {
                throw I;
            }, j, j);
        });
    };
    var q = l.Empty = function () {
        return m(function () {
            return H(function () {
                return false;
            }, j, j);
        });
    };
    var r = l.FromArray = function (I) {
        return m(function () {
            var J = 0;
            var K;
            return H(function () {
                if (J < I.length) {
                    K = I[J++];
                    return true;
                }
                return false;
            }, function () {
                return K;
            }, j);
        });
    };
    var s = l.Concat = function () {
        return r(arguments).SelectMany(j);
    };
    var t = l.If = function (I, J, K) {
        if (elseSoure === a) K = q();
        return EnumerableEx.Defer(function () {
            return I() ? J : K;
        });
    };
    var u = l.While = function (I, J) {
        return A(J).TakeWhile(I).SelectMany(j);
    };
    var v = l.DoWhile = function (I, J) {
        return I.Concat(u(J, I));
    };
    var w = l.Case = function (I, J, K) {
        if (K === a) K = q();
        return B(function () {
            var L = J[I()];
            if (L === a) L = K;
            return L;
        });
    };
    var x = l.For = function (I, J) {
        return I.Select(J).SelectMany(j);
    };
    var y = l.Let = function (I, J) {
        return B(function () {
            return J(I);
        });
    };
    var z = l.Range = function (I, J) {
        return m(function () {
            var K = I - 1;
            var L = I + J - 1;
            return H(function () {
                if (K < L) {
                    K++;
                    return true;
                } else return false;
            }, function () {
                return K;
            }, j);
        });
    };
    var A = l.Repeat = function (I, J) {
        return m(function () {
            var K = J;
            if (K === a) K = -1;
            return H(function () {
                if (K != 0) {
                    K--;
                    return true;
                } else return false;
            }, function () {
                return I;
            }, j);
        });
    };
    var B = l.Defer = function (I) {
        return m(function () {
            var J;
            return H(function () {
                if (J === a) J = I().GetEnumerator();
                return J.MoveNext();
            }, function () {
                return J.GetCurrent();
            }, function () {
                J.Dispose();
            });
        });
    };
    var C = l.Using = function (I, J) {
        return B(function () {
            var K = I();
            return J(K).
                Finally(function () {
                    K.Dispose();
                });
        });
    };
    var D = l.Generate = function (I, J, K, L) {
        return m(function () {
            var M;
            var N;
            var O = false;
            return H(function () {
                if (!O) {
                    M = I;
                    O = true;
                } else {
                    M = K(M);
                    if (!J(M)) return false;
                }
                N = L(M);
                return true;
            }, function () {
                return N;
            }, j);
        });
    };
    var E = l.
    Catch = function () {
        var I = arguments;
        return m(function () {
            var J;
            var K = 0;
            var L;
            return H(function () {
                while (K < I.length) {
                    if (L === a) L = I[K++].GetEnumerator();
                    try {
                        var M = L.MoveNext();
                        if (M) J = L.GetCurrent();
                        return M;
                    } catch (N) {
                        L.Dispose();
                        L = a;
                    }
                }
            }, function () {
                return J;
            }, function () {
                if (L !== a) L.Dispose();
            });
        });
    };
    var F = l.OnErrorResumeNext = function () {
        var I = arguments;
        return m(function () {
            var J;
            var K = 0;
            var L;
            return H(function () {
                while (K < I.length) {
                    if (L === a) L = I[K++].GetEnumerator();
                    try {
                        var M = L.MoveNext();
                        if (M) {
                            J = L.GetCurrent();
                            return true;
                        }
                    } catch (N) { }
                    L.Dispose();
                    L = a;
                }
                return false;
            }, function () {
                return J;
            }, function () {
                if (L !== a) L.Dispose();
            });
        });
    };
    l.prototype = {
        Select: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L = 0;
                var M;
                return H(function () {
                    if (M === a) M = J.GetEnumerator();
                    if (!M.MoveNext()) return false;
                    K = I(M.GetCurrent(), L++);
                    return true;
                }, function () {
                    return K;
                }, function () {
                    M.Dispose();
                });
            });
        },
        Where: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L = 0;
                var M;
                return H(function () {
                    if (M === a) M = J.GetEnumerator();
                    while (true) {
                        if (!M.MoveNext()) return false;
                        K = M.GetCurrent();
                        if (I(K, L++)) return true;
                    }
                }, function () {
                    return K;
                }, function () {
                    M.Dispose();
                });
            });
        },
        SelectMany: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L = 0;
                var M;
                var N;
                return H(function () {
                    if (M === a) M = J.GetEnumerator();
                    while (true) {
                        if (N === a) {
                            if (!M.MoveNext()) return false;
                            N = I(M.GetCurrent()).GetEnumerator();
                        }
                        if (N.MoveNext()) {
                            K = N.GetCurrent();
                            return true;
                        } else {
                            N.Dispose();
                            N = a;
                        }
                    }
                }, function () {
                    return K;
                }, function () {
                    if (N !== a) N.Dispose();
                    M.Dispose();
                });
            });
        },
        ForEach: function (I) {
            var J = this.GetEnumerator();
            try {
                while (J.MoveNext()) I(J.GetCurrent());
            } finally {
                J.Dispose();
            }
        },
        a: function (I, J) {
            var K = k(J);
            K.unshift(this);
            return I.apply(undefined, K);
        },
        Concat: function () {
            return this.a(s, arguments);
        },
        Zip: function (I, J) {
            var K = this;
            return m(function () {
                var L;
                var M;
                var N;
                return H(function () {
                    if (L === a) {
                        L = K.GetEnumerator();
                        M = I.GetEnumerator();
                    }
                    if (L.MoveNext() && M.MoveNext()) {
                        N = J(L.GetCurrent(), M.GetCurrent());
                        return true;
                    }
                    return false;
                }, function () {
                    return N;
                }, function () {
                    L.Dispose();
                    M.Dispose();
                });
            });
        },
        Take: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L;
                var M = I;
                return H(function () {
                    if (L === a) L = J.GetEnumerator();
                    if (M == 0) return false;
                    if (!L.MoveNext()) {
                        M = 0;
                        return false;
                    }
                    M--;
                    K = L.GetCurrent();
                    return true;
                }, function () {
                    return K;
                }, function () {
                    L.Dispose();
                });
            });
        },
        TakeWhile: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L = 0;
                var M;
                return H(function () {
                    if (M === a) M = J.GetEnumerator();
                    if (!M.MoveNext()) return false;
                    K = M.GetCurrent();
                    if (!I(K, L++)) return false;
                    return true;
                }, function () {
                    return K;
                }, function () {
                    M.Dispose();
                });
            });
        },
        Skip: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L = false;
                var M;
                return H(function () {
                    if (M === a) M = J.GetEnumerator();
                    if (!L) {
                        for (var N = 0; N < I; N++) {
                            if (!M.MoveNext()) return false;
                        }
                        L = true;
                    }
                    if (!M.MoveNext()) return false;
                    K = M.GetCurrent();
                    return true;
                }, function () {
                    return K;
                }, function () {
                    M.Dispose();
                });
            });
        },
        SkipWhile: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L = false;
                var M;
                return H(function () {
                    if (M === a) M = J.GetEnumerator();
                    if (!L) {
                        while (true) {
                            if (!M.MoveNext()) return false;
                            if (!I(M.GetCurrent())) {
                                K = M.GetCurrent();
                                return true;
                            }
                        }
                        L = true;
                    }
                    if (!M.MoveNext()) return false;
                    K = M.GetCurrent();
                    return true;
                }, function () {
                    return K;
                }, function () {
                    M.Dispose();
                });
            });
        },
        Do: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L;
                return H(function () {
                    if (L === a) L = J.GetEnumerator();
                    if (!L.MoveNext()) return false;
                    K = L.GetCurrent();
                    I(K);
                    return true;
                }, function () {
                    return K;
                }, function () {
                    L.Dispose();
                });
            });
        },
        First: function (I) {
            var J = this.GetEnumerator();
            while (J.MoveNext()) {
                var K = J.GetCurrent();
                if (I === a || I(K)) return K;
            }
            throw e;
        },
        FirstOrDefault: function (I) {
            var J = this.GetEnumerator();
            while (J.MoveNext()) {
                var K = J.GetCurrent();
                if (I === a || I(K)) return K;
            }
            return a;
        },
        Last: function (I) {
            var J = false;
            var K;
            var L = this.GetEnumerator();
            while (L.MoveNext()) {
                var M = L.GetCurrent();
                if (I === a || I(M)) {
                    J = true;
                    K = M;
                }
            }
            if (J) return K;
            throw e;
        },
        LastOrDefault: function (I) {
            var J = false;
            var K;
            var L = this.GetEnumerator();
            while (L.MoveNext()) {
                var M = L.GetCurrent();
                if (I === a || I(M)) {
                    J = true;
                    K = M;
                }
            }
            if (J) return K;
            throw a;
        },
        Single: function (I) {
            if (I) return this.Where(I).Single();
            var J = this.GetEnumerator();
            while (J.MoveNext()) {
                var K = J.GetCurrent();
                if (J.MoveNext()) throw f;
                return K;
            }
            throw e;
        },
        SingleOrDefault: function (I) {
            if (I) return this.Where(I).Single();
            var J = this.GetEnumerator();
            while (J.MoveNext()) {
                var K = J.GetCurrent();
                if (J.MoveNext()) throw f;
                return K;
            }
            return a;
        },
        ElementAt: function (I) {
            return this.Skip(I).First();
        },
        ElementAtOrDefault: function (I) {
            return this.Skip(I).FirstOrDefault();
        },
        ToArray: function () {
            var I = [];
            var J = this.GetEnumerator();
            while (J.MoveNext()) I.push(J.GetCurrent());
            J.Dispose();
            return I;
        },
        Reverse: function () {
            var I = [];
            var J = this.GetEnumerator();
            while (J.MoveNext()) I.unshift(J.GetCurrent());
            J.Dispose();
            return r(I);
        },
        Finally: function (I) {
            var J = this;
            return m(function () {
                var K = J.GetEnumerator();
                return H(function () {
                    return K.MoveNext();
                }, function () {
                    return K.GetCurrent();
                }, function () {
                    K.Dispose();
                    I();
                });
            });
        },
        Retry: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L;
                var M = I;
                if (M === a) M = -1;
                return H(function () {
                    if (L === a) L = J.GetEnumerator();
                    while (true) try {
                        if (L.MoveNext()) {
                            K = L.GetCurrent();
                            return true;
                        } else return false;
                    } catch (N) {
                        if (M-- == 0) throw N;
                    }
                }, function () {
                    return K;
                }, function () {
                    L.Dispose();
                });
            });
        },
        StartWith: function () {
            return s(r(arguments), this);
        },
        DistinctUntilChanged: function (I, J) {
            if (J === a) J = i;
            var K = this;
            return m(function () {
                var L;
                var M = 0;
                var N;
                return H(function () {
                    if (N === a) N = K.GetEnumerator();
                    while (true) {
                        if (!N.MoveNext()) return false;
                        var O = N.GetCurrent();
                        if (!i(L, O)) {
                            L = O;
                            return true;
                        }
                    }
                }, function () {
                    return L;
                }, function () {
                    N.Dispose();
                });
            });
        },
        BufferWithCount: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L;
                return H(function () {
                    if (L === a) L = J.GetEnumerator();
                    K = [];
                    for (var M = 0; M < I; M++) {
                        if (!L.MoveNext()) return M > 0;
                        K.push(L.GetCurrent());
                    }
                    return true;
                }, function () {
                    return K;
                }, function () {
                    L.Dispose();
                });
            });
        },
        SkipLast: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L;
                var M = [];
                return H(function () {
                    if (L === a) L = J.GetEnumerator();
                    while (true) {
                        if (!L.MoveNext()) return false;
                        M.push(L.GetCurrent());
                        if (M.length > I) {
                            K = M.shift();
                            return true;
                        }
                    }
                }, function () {
                    return K;
                }, function () {
                    L.Dispose();
                });
            });
        },
        TakeLast: function (I) {
            var J = this;
            return m(function () {
                var K;
                var L;
                var M;
                return H(function () {
                    if (L === a) L = J.GetEnumerator();
                    if (M === a) {
                        M = [];
                        while (L.MoveNext()) {
                            M.push(L.GetCurrent());
                            if (M.length > I) M.shift();
                        }
                    }
                    if (M.length == 0) return false;
                    K = M.shift();
                    return true;
                }, function () {
                    return K;
                }, function () {
                    L.Dispose();
                });
            });
        },
        Repeat: function (I) {
            var J = this;
            return A(0, I).SelectMany(function () {
                return J;
            });
        },
        Scan: function (I, J) {
            var K = this;
            return B(function () {
                var L;
                var M = false;
                return K.Select(function (N) {
                    if (M) L = J(L, N);
                    else {
                        L = J(I, N);
                        M = true;
                    }
                    return L;
                });
            });
        },
        Scan0: function (I, J) {
            return this.Scan(I, J).StartWith(I);
        },
        Scan1: function (I) {
            var J = this;
            return B(function () {
                var K;
                var L = false;
                return J.Select(function (M) {
                    if (L) K = I(K, M);
                    else {
                        K = M;
                        L = true;
                    }
                    return K;
                });
            });
        }
    };
    var G = b.Enumerator = function (I, J, K) {
        this.MoveNext = I;
        this.GetCurrent = J;
        this.Dispose = K;
    };
    var H = G.Create = function (I, J, K) {
        var L = false;
        return new G(function () {
            if (L) return false;
            var M = I();
            if (!M) {
                L = true;
                K();
            }
            return M;
        }, J, function () {
            if (!L) {
                K();
                L = true;
            }
        });
    };
})();