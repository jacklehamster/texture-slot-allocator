// /Users/vincent/texture-slot-allocator/example/node_modules/texture-slot-allocator/dist/index.js
var y = function(q, J = (Y) => Y.key) {
  var Y = [];
  return v(q, "", true, (K) => Y.push(K), J), Y.join("");
};
var H = function(q) {
  if (q === null)
    return true;
  var J = P(q.left), Y = P(q.right);
  if (Math.abs(J - Y) <= 1 && H(q.left) && H(q.right))
    return true;
  return false;
};
var U = function(q, J, Y, K, $) {
  const C = $ - K;
  if (C > 0) {
    const O = K + Math.floor(C / 2), G = J[O], Q = Y[O], Z = { key: G, data: Q, parent: q };
    return Z.left = U(Z, J, Y, K, O), Z.right = U(Z, J, Y, O + 1, $), Z;
  }
  return null;
};
var _ = function(q) {
  if (q === null)
    return 0;
  const J = _(q.left), Y = _(q.right);
  return q.balanceFactor = J - Y, Math.max(J, Y) + 1;
};
var W = function(q, J, Y, K, $) {
  if (Y >= K)
    return;
  const C = q[Y + K >> 1];
  let O = Y - 1, G = K + 1;
  while (true) {
    do
      O++;
    while ($(q[O], C) < 0);
    do
      G--;
    while ($(q[G], C) > 0);
    if (O >= G)
      break;
    let Q = q[O];
    q[O] = q[G], q[G] = Q, Q = J[O], J[O] = J[G], J[G] = Q;
  }
  W(q, J, Y, G, $), W(q, J, G + 1, K, $);
};
var R = function(q, J) {
  return Math.max(J, Math.pow(2, Math.ceil(Math.log(q) / Math.log(2))));
};
var N = function(q, J, Y, K) {
  if (Y < 1)
    throw new Error("Invalid count");
  const $ = R(q, K.min), C = R(J, K.min), O = new Map;
  let G = K.min;
  for (let Q = 1;Q <= Y; Q++) {
    G = R($ * Q, K.min);
    const Z = R(C * Math.ceil(Y / Q), K.min);
    O.set(G, Z);
  }
  for (let Q = G;Q <= K.max; Q *= 2)
    if (!O.has(Q))
      O.set(Q, C);
  return O;
};
var v = function(q, J, Y, K, $) {
  if (q) {
    K(`${J}${Y ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}${$(q)}\n`);
    const C = J + (Y ? "    " : "\u2502   ");
    if (q.left)
      v(q.left, C, false, K, $);
    if (q.right)
      v(q.right, C, true, K, $);
  }
};
var P = function(q) {
  return q ? 1 + Math.max(P(q.left), P(q.right)) : 0;
};
var x = function(q, J) {
  return q > J ? 1 : q < J ? -1 : 0;
};
var A = function(q) {
  var J = q.right;
  if (q.right = J.left, J.left)
    J.left.parent = q;
  if (J.parent = q.parent, J.parent)
    if (J.parent.left === q)
      J.parent.left = J;
    else
      J.parent.right = J;
  if (q.parent = J, J.left = q, q.balanceFactor += 1, J.balanceFactor < 0)
    q.balanceFactor -= J.balanceFactor;
  if (J.balanceFactor += 1, q.balanceFactor > 0)
    J.balanceFactor += q.balanceFactor;
  return J;
};
var E = function(q) {
  var J = q.left;
  if (q.left = J.right, q.left)
    q.left.parent = q;
  if (J.parent = q.parent, J.parent)
    if (J.parent.left === q)
      J.parent.left = J;
    else
      J.parent.right = J;
  if (q.parent = J, J.right = q, q.balanceFactor -= 1, J.balanceFactor > 0)
    q.balanceFactor -= J.balanceFactor;
  if (J.balanceFactor -= 1, q.balanceFactor < 0)
    J.balanceFactor += q.balanceFactor;
  return J;
};

class D {
  constructor(q, J = false) {
    this._comparator = q || x, this._root = null, this._size = 0, this._noDuplicates = !!J;
  }
  destroy() {
    return this.clear();
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  get size() {
    return this._size;
  }
  contains(q) {
    if (this._root) {
      var J = this._root, Y = this._comparator;
      while (J) {
        var K = Y(q, J.key);
        if (K === 0)
          return true;
        else if (K < 0)
          J = J.left;
        else
          J = J.right;
      }
    }
    return false;
  }
  next(q) {
    var J = q;
    if (J)
      if (J.right) {
        J = J.right;
        while (J.left)
          J = J.left;
      } else {
        J = q.parent;
        while (J && J.right === q)
          q = J, J = J.parent;
      }
    return J;
  }
  prev(q) {
    var J = q;
    if (J)
      if (J.left) {
        J = J.left;
        while (J.right)
          J = J.right;
      } else {
        J = q.parent;
        while (J && J.left === q)
          q = J, J = J.parent;
      }
    return J;
  }
  forEach(q) {
    var J = this._root, Y = [], K = false, $ = 0;
    while (!K)
      if (J)
        Y.push(J), J = J.left;
      else if (Y.length > 0)
        J = Y.pop(), q(J, $++), J = J.right;
      else
        K = true;
    return this;
  }
  range(q, J, Y, K) {
    const $ = [], C = this._comparator;
    let O = this._root, G;
    while ($.length !== 0 || O)
      if (O)
        $.push(O), O = O.left;
      else {
        if (O = $.pop(), G = C(O.key, J), G > 0)
          break;
        else if (C(O.key, q) >= 0) {
          if (Y.call(K, O))
            return this;
        }
        O = O.right;
      }
    return this;
  }
  keys() {
    var q = this._root, J = [], Y = [], K = false;
    while (!K)
      if (q)
        J.push(q), q = q.left;
      else if (J.length > 0)
        q = J.pop(), Y.push(q.key), q = q.right;
      else
        K = true;
    return Y;
  }
  values() {
    var q = this._root, J = [], Y = [], K = false;
    while (!K)
      if (q)
        J.push(q), q = q.left;
      else if (J.length > 0)
        q = J.pop(), Y.push(q.data), q = q.right;
      else
        K = true;
    return Y;
  }
  at(q) {
    var J = this._root, Y = [], K = false, $ = 0;
    while (!K)
      if (J)
        Y.push(J), J = J.left;
      else if (Y.length > 0) {
        if (J = Y.pop(), $ === q)
          return J;
        $++, J = J.right;
      } else
        K = true;
    return null;
  }
  minNode() {
    var q = this._root;
    if (!q)
      return null;
    while (q.left)
      q = q.left;
    return q;
  }
  maxNode() {
    var q = this._root;
    if (!q)
      return null;
    while (q.right)
      q = q.right;
    return q;
  }
  min() {
    var q = this._root;
    if (!q)
      return null;
    while (q.left)
      q = q.left;
    return q.key;
  }
  max() {
    var q = this._root;
    if (!q)
      return null;
    while (q.right)
      q = q.right;
    return q.key;
  }
  isEmpty() {
    return !this._root;
  }
  pop() {
    var q = this._root, J = null;
    if (q) {
      while (q.left)
        q = q.left;
      J = { key: q.key, data: q.data }, this.remove(q.key);
    }
    return J;
  }
  popMax() {
    var q = this._root, J = null;
    if (q) {
      while (q.right)
        q = q.right;
      J = { key: q.key, data: q.data }, this.remove(q.key);
    }
    return J;
  }
  find(q) {
    var J = this._root, Y = J, K, $ = this._comparator;
    while (Y)
      if (K = $(q, Y.key), K === 0)
        return Y;
      else if (K < 0)
        Y = Y.left;
      else
        Y = Y.right;
    return null;
  }
  insert(q, J) {
    if (!this._root)
      return this._root = { parent: null, left: null, right: null, balanceFactor: 0, key: q, data: J }, this._size++, this._root;
    var Y = this._comparator, K = this._root, $ = null, C = 0;
    if (this._noDuplicates)
      while (K)
        if (C = Y(q, K.key), $ = K, C === 0)
          return null;
        else if (C < 0)
          K = K.left;
        else
          K = K.right;
    else
      while (K)
        if (C = Y(q, K.key), $ = K, C <= 0)
          K = K.left;
        else
          K = K.right;
    var O = { left: null, right: null, balanceFactor: 0, parent: $, key: q, data: J }, G;
    if (C <= 0)
      $.left = O;
    else
      $.right = O;
    while ($) {
      if (C = Y($.key, q), C < 0)
        $.balanceFactor -= 1;
      else
        $.balanceFactor += 1;
      if ($.balanceFactor === 0)
        break;
      else if ($.balanceFactor < -1) {
        if ($.right.balanceFactor === 1)
          E($.right);
        if (G = A($), $ === this._root)
          this._root = G;
        break;
      } else if ($.balanceFactor > 1) {
        if ($.left.balanceFactor === -1)
          A($.left);
        if (G = E($), $ === this._root)
          this._root = G;
        break;
      }
      $ = $.parent;
    }
    return this._size++, O;
  }
  remove(q) {
    if (!this._root)
      return null;
    var J = this._root, Y = this._comparator, K = 0;
    while (J)
      if (K = Y(q, J.key), K === 0)
        break;
      else if (K < 0)
        J = J.left;
      else
        J = J.right;
    if (!J)
      return null;
    var $ = J.key, C, O;
    if (J.left) {
      C = J.left;
      while (C.left || C.right) {
        while (C.right)
          C = C.right;
        if (J.key = C.key, J.data = C.data, C.left)
          J = C, C = C.left;
      }
      J.key = C.key, J.data = C.data, J = C;
    }
    if (J.right) {
      O = J.right;
      while (O.left || O.right) {
        while (O.left)
          O = O.left;
        if (J.key = O.key, J.data = O.data, O.right)
          J = O, O = O.right;
      }
      J.key = O.key, J.data = O.data, J = O;
    }
    var G = J.parent, Q = J, Z;
    while (G) {
      if (G.left === Q)
        G.balanceFactor -= 1;
      else
        G.balanceFactor += 1;
      if (G.balanceFactor < -1) {
        if (G.right.balanceFactor === 1)
          E(G.right);
        if (Z = A(G), G === this._root)
          this._root = Z;
        G = Z;
      } else if (G.balanceFactor > 1) {
        if (G.left.balanceFactor === -1)
          A(G.left);
        if (Z = E(G), G === this._root)
          this._root = Z;
        G = Z;
      }
      if (G.balanceFactor === -1 || G.balanceFactor === 1)
        break;
      Q = G, G = G.parent;
    }
    if (J.parent)
      if (J.parent.left === J)
        J.parent.left = null;
      else
        J.parent.right = null;
    if (J === this._root)
      this._root = null;
    return this._size--, $;
  }
  load(q = [], J = [], Y) {
    if (this._size !== 0)
      throw new Error("bulk-load: tree is not empty");
    const K = q.length;
    if (Y)
      W(q, J, 0, K - 1, this._comparator);
    return this._root = U(null, q, J, 0, K), _(this._root), this._size = K, this;
  }
  isBalanced() {
    return H(this._root);
  }
  toString(q) {
    return y(this._root, q);
  }
}
D.default = D;

class B {
  size;
  slotNumber;
  x;
  y;
  textureIndex;
  parent;
  sibbling;
  textureSizeLimits;
  constructor(q, J, Y, K) {
    this.textureSizeLimits = Y?.textureSizeLimits ?? K ?? { min: b, max: k }, this.size = q, this.slotNumber = J, this.parent = Y, this.sibbling = undefined;
    const { x: $, y: C, textureIndex: O } = this.calculatePosition(q, J);
    this.x = $, this.y = C, this.textureIndex = O;
  }
  calculateTextureIndex(q, J) {
    const [Y, K] = q, $ = this.textureSizeLimits.max / Y * (this.textureSizeLimits.max / K);
    return Math.floor(J / $);
  }
  calculatePosition(q, J) {
    const [Y, K] = q, $ = this.textureSizeLimits.max / Y, C = this.textureSizeLimits.max / K, O = J % $ * Y, G = Math.floor(J / $) % C * K;
    return { x: O, y: G, textureIndex: this.calculateTextureIndex(q, J) };
  }
  getTag() {
    return B.getTag(this);
  }
  static getTag(q) {
    return `${q.size[0]}x${q.size[1]}-#${q.slotNumber}`;
  }
  static positionToTextureSlot(q, J, Y, K, $) {
    const [C, O] = Y, G = $.textureSizeLimits.max / C, Z = $.textureSizeLimits.max / C * ($.textureSizeLimits.max / O) * K + J / O * G + q / C;
    return new B(Y, Z, $);
  }
  getPosition() {
    return { x: this.x, y: this.y, size: this.size, textureIndex: this.textureIndex };
  }
  canSplitHorizontally() {
    const [, q] = this.size;
    return q > this.textureSizeLimits.min;
  }
  canSplitVertically() {
    const [q] = this.size;
    return q > this.textureSizeLimits.min;
  }
  splitHorizontally() {
    const { x: q, y: J, size: Y, textureIndex: K } = this, [$, C] = Y;
    if (!this.canSplitHorizontally())
      throw new Error(`Cannot split texture slot of size ${$} horizontally`);
    const O = $ / 2, G = B.positionToTextureSlot(q, J, [O, C], K, this), Q = B.positionToTextureSlot(q + O, J, [O, C], K, this);
    return G.sibbling = Q, Q.sibbling = G, [G, Q];
  }
  splitVertically() {
    const { x: q, y: J, size: Y, textureIndex: K } = this, [$, C] = Y;
    if (!this.canSplitVertically())
      throw new Error(`Cannot split texture slot of size ${C} vertically`);
    const O = C / 2, G = B.positionToTextureSlot(q, J, [$, O], K, this), Q = B.positionToTextureSlot(q, J + O, [$, O], K, this);
    return G.sibbling = Q, Q.sibbling = G, [G, Q];
  }
}
var m = false;
var b = 16;
var k = 4096;
var p = 16;

class I {
  textureSlots = new D((q, J) => {
    const Y = q.size[0] * q.size[1] - J.size[0] * J.size[1];
    if (Y !== 0)
      return Y;
    return q.slotNumber - J.slotNumber;
  }, false);
  allocatedTextures = {};
  minTextureSize;
  maxTextureSize;
  numTextureSheets;
  initialSlots = [];
  constructor({ numTextureSheets: q, minTextureSize: J, maxTextureSize: Y, excludeTexture: K } = {}, $) {
    if (this.numTextureSheets = q ?? p, this.minTextureSize = J ?? b, this.maxTextureSize = Y ?? k, $)
      this.numTextureSheets = Math.min(this.numTextureSheets, $.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS)), this.maxTextureSize = Math.min(this.maxTextureSize, $.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE)), this.minTextureSize = Math.min(this.minTextureSize, this.maxTextureSize);
    for (let C = 0;C < this.numTextureSheets; C++) {
      if (K?.(C))
        continue;
      this.initialSlots.push(new B([this.maxTextureSize, this.maxTextureSize], C, undefined, { min: this.minTextureSize, max: this.maxTextureSize }));
    }
    this.initialSlots.forEach((C) => this.textureSlots.insert(C));
  }
  allocate(q, J, Y = 1) {
    const { size: K, slotNumber: $, x: C, y: O, textureIndex: G } = this.allocateHelper(q, J, Y);
    return { size: K, slotNumber: $, x: C, y: O, textureIndex: G };
  }
  deallocate(q) {
    if (!this.isSlotUsed(q))
      throw new Error("Slot is not allocated");
    const J = this.allocatedTextures[B.getTag(q)];
    this.deallocateHelper(J);
  }
  get countUsedTextureSheets() {
    return this.initialSlots.filter((q) => this.isSlotUsed(q)).length;
  }
  allocateHelper(q, J, Y = 1) {
    const K = N(q, J, Y, { min: this.minTextureSize, max: this.maxTextureSize }), $ = this.findSlot(K);
    if (!$)
      throw new Error(`Could not find a slot for texture to fit ${Y} sprites of size ${q}x${J}`);
    this.textureSlots.remove($);
    const [C, O] = this.bestFit(K, $);
    return this.fitSlot($, C, O);
  }
  findSlot(q) {
    for (let J = 0;J < this.textureSlots.size; J++) {
      const K = this.textureSlots.at(J).key, [$, C] = K.size;
      if (q.get($) <= C)
        return K;
    }
    return null;
  }
  calculateRatio(q, J) {
    return Math.max(q / J, J / q);
  }
  bestFit(q, J) {
    const [Y, K] = J.size;
    let $ = J.textureSizeLimits.max;
    return q.forEach((C, O) => {
      if (O <= Y && C <= K) {
        const G = O * C, Q = q.get($) * $;
        if (G < Q)
          $ = O;
        else if (G === Q) {
          if (this.calculateRatio(O, C) < this.calculateRatio($, q.get($)))
            $ = O;
        }
      }
    }), [$, q.get($)];
  }
  isSlotUsed(q) {
    return !!this.allocatedTextures[B.getTag(q)];
  }
  deallocateHelper(q) {
    if (q.parent && q.sibbling && !this.isSlotUsed(q.sibbling)) {
      const J = q.sibbling;
      if (this.textureSlots.remove(J), m && this.textureSlots.find(q))
        throw new Error("Slot is not expected to be in the tree");
      const Y = q.parent;
      this.deallocateHelper(Y);
      return;
    }
    this.textureSlots.insert(q), delete this.allocatedTextures[q.getTag()];
  }
  trySplitHorizontally(q, J, Y) {
    if (q.canSplitHorizontally()) {
      const [K, $] = q.splitHorizontally();
      if (K.size[0] >= J)
        return this.textureSlots.insert($), this.fitSlot(K, J, Y);
    }
    return null;
  }
  trySplitVertically(q, J, Y) {
    if (q.canSplitVertically()) {
      const [K, $] = q.splitVertically();
      if (K.size[1] >= Y)
        return this.textureSlots.insert($), this.fitSlot(K, J, Y);
    }
    return null;
  }
  fitSlot(q, J, Y) {
    if (this.allocatedTextures[q.getTag()] = q, q.size[0] > q.size[1]) {
      const K = this.trySplitHorizontally(q, J, Y) ?? this.trySplitVertically(q, J, Y);
      if (K)
        return K;
    } else {
      const K = this.trySplitVertically(q, J, Y) ?? this.trySplitHorizontally(q, J, Y);
      if (K)
        return K;
    }
    return q;
  }
}

class T {
  q;
  constructor(q = []) {
    this.images = q;
  }
  addImage(q, J, Y = 1, K = 1) {
    this.images.push({ id: q, image: J, cols: Y, rows: K });
  }
  clear() {
    this.images.length = 0;
  }
  async getImage(q) {
    const Y = await (await fetch(q)).blob();
    return await createImageBitmap(Y);
  }
  async loadImage(q) {
    if (typeof q !== "string")
      return q;
    return await this.getImage(q);
  }
  async pack(q = {}) {
    const J = [], Y = await Promise.all(this.images.map(async (G) => {
      const Q = G.image;
      if (typeof Q === "string")
        throw new Error("ImagePacker: image is not loaded");
      const Z = Q.naturalWidth ?? Q.displayWidth ?? Q.width?.baseValue?.value ?? Q.width, X = Q.naturalHeight ?? Q.displayHeight ?? Q.height?.baseValue?.value ?? Q.height, V = G.cols || 1, j = G.rows || 1;
      return { id: G.id, image: await this.loadImage(G.image), cols: V, rows: j, spriteWidth: Z / V, spriteHeight: X / j, count: j * V };
    })), K = new I(q);
    Y.sort((G, Q) => {
      const Z = G.cols * G.spriteWidth + G.rows * G.spriteHeight;
      return Q.cols * Q.spriteWidth + Q.rows * Q.spriteHeight - Z;
    });
    const $ = [];
    Y.forEach((G) => {
      const { id: Q, image: Z, spriteWidth: X, spriteHeight: V, count: j } = G, F = K.allocate(X, V, j);
      if (F.textureIndex >= J.length) {
        const M = new OffscreenCanvas(K.maxTextureSize, K.maxTextureSize);
        J.push(M);
      }
      const L = J[F.textureIndex].getContext("2d");
      if (!L)
        throw new Error("Failed to get 2d context");
      L.imageSmoothingEnabled = true;
      const [f, w] = F.size, z = Math.floor(f / X), g = Math.floor(w / V);
      for (let M = 0;M < j; M++) {
        const S = F.x + M % z * X, h = F.y + Math.floor(M / g) * V;
        L.drawImage(Z, 0, 0, X, V, S, h, X, V);
      }
      $.push({ id: Q, slot: F });
    }), $.sort((G, Q) => G.id.localeCompare(Q.id));
    const C = $.map(({ id: G, slot: Q }) => [G, B.getTag(Q)]);
    return { images: await Promise.all(J.map((G) => createImageBitmap(G))), slots: $, compact: Object.fromEntries(C), textureSize: K.maxTextureSize };
  }
}
export {
  T as ImagePacker
};
