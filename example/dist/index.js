// /Users/vincent/texture-slot-allocator/example/node_modules/texture-slot-allocator/dist/index.js
var y = function(q, J = (Y) => Y.key) {
  var Y = [];
  return v(q, "", true, (K) => Y.push(K), J), Y.join("");
};
var D = function(q) {
  if (q === null)
    return true;
  var J = H(q.left), Y = H(q.right);
  if (Math.abs(J - Y) <= 1 && D(q.left) && D(q.right))
    return true;
  return false;
};
var U = function(q, J, Y, K, $) {
  const Q = $ - K;
  if (Q > 0) {
    const O = K + Math.floor(Q / 2), G = J[O], C = Y[O], Z = { key: G, data: C, parent: q };
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
var I = function(q, J, Y, K, $) {
  if (Y >= K)
    return;
  const Q = q[Y + K >> 1];
  let O = Y - 1, G = K + 1;
  while (true) {
    do
      O++;
    while ($(q[O], Q) < 0);
    do
      G--;
    while ($(q[G], Q) > 0);
    if (O >= G)
      break;
    let C = q[O];
    q[O] = q[G], q[G] = C, C = J[O], J[O] = J[G], J[G] = C;
  }
  I(q, J, Y, G, $), I(q, J, G + 1, K, $);
};
var A = function(q, J) {
  return Math.max(J, Math.pow(2, Math.ceil(Math.log(q) / Math.log(2))));
};
var N = function(q, J, Y, K) {
  if (Y < 1)
    throw new Error("Invalid count");
  const $ = A(q, K.min), Q = A(J, K.min), O = new Map;
  let G = K.min;
  for (let C = 1;C <= Y; C++) {
    G = A($ * C, K.min);
    const Z = A(Q * Math.ceil(Y / C), K.min);
    O.set(G, Z);
  }
  for (let C = G;C <= K.max; C *= 2)
    if (!O.has(C))
      O.set(C, Q);
  return O;
};
var v = function(q, J, Y, K, $) {
  if (q) {
    K(`${J}${Y ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}${$(q)}\n`);
    const Q = J + (Y ? "    " : "\u2502   ");
    if (q.left)
      v(q.left, Q, false, K, $);
    if (q.right)
      v(q.right, Q, true, K, $);
  }
};
var H = function(q) {
  return q ? 1 + Math.max(H(q.left), H(q.right)) : 0;
};
var x = function(q, J) {
  return q > J ? 1 : q < J ? -1 : 0;
};
var W = function(q) {
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

class F {
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
    const $ = [], Q = this._comparator;
    let O = this._root, G;
    while ($.length !== 0 || O)
      if (O)
        $.push(O), O = O.left;
      else {
        if (O = $.pop(), G = Q(O.key, J), G > 0)
          break;
        else if (Q(O.key, q) >= 0) {
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
    var Y = this._comparator, K = this._root, $ = null, Q = 0;
    if (this._noDuplicates)
      while (K)
        if (Q = Y(q, K.key), $ = K, Q === 0)
          return null;
        else if (Q < 0)
          K = K.left;
        else
          K = K.right;
    else
      while (K)
        if (Q = Y(q, K.key), $ = K, Q <= 0)
          K = K.left;
        else
          K = K.right;
    var O = { left: null, right: null, balanceFactor: 0, parent: $, key: q, data: J }, G;
    if (Q <= 0)
      $.left = O;
    else
      $.right = O;
    while ($) {
      if (Q = Y($.key, q), Q < 0)
        $.balanceFactor -= 1;
      else
        $.balanceFactor += 1;
      if ($.balanceFactor === 0)
        break;
      else if ($.balanceFactor < -1) {
        if ($.right.balanceFactor === 1)
          E($.right);
        if (G = W($), $ === this._root)
          this._root = G;
        break;
      } else if ($.balanceFactor > 1) {
        if ($.left.balanceFactor === -1)
          W($.left);
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
    var $ = J.key, Q, O;
    if (J.left) {
      Q = J.left;
      while (Q.left || Q.right) {
        while (Q.right)
          Q = Q.right;
        if (J.key = Q.key, J.data = Q.data, Q.left)
          J = Q, Q = Q.left;
      }
      J.key = Q.key, J.data = Q.data, J = Q;
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
    var G = J.parent, C = J, Z;
    while (G) {
      if (G.left === C)
        G.balanceFactor -= 1;
      else
        G.balanceFactor += 1;
      if (G.balanceFactor < -1) {
        if (G.right.balanceFactor === 1)
          E(G.right);
        if (Z = W(G), G === this._root)
          this._root = Z;
        G = Z;
      } else if (G.balanceFactor > 1) {
        if (G.left.balanceFactor === -1)
          W(G.left);
        if (Z = E(G), G === this._root)
          this._root = Z;
        G = Z;
      }
      if (G.balanceFactor === -1 || G.balanceFactor === 1)
        break;
      C = G, G = G.parent;
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
      I(q, J, 0, K - 1, this._comparator);
    return this._root = U(null, q, J, 0, K), _(this._root), this._size = K, this;
  }
  isBalanced() {
    return D(this._root);
  }
  toString(q) {
    return y(this._root, q);
  }
}
F.default = F;

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
    const { x: $, y: Q, textureIndex: O } = this.calculatePosition(q, J);
    this.x = $, this.y = Q, this.textureIndex = O;
  }
  calculateTextureIndex(q, J) {
    const [Y, K] = q, $ = this.textureSizeLimits.max / Y * (this.textureSizeLimits.max / K);
    return Math.floor(J / $);
  }
  calculatePosition(q, J) {
    const [Y, K] = q, $ = this.textureSizeLimits.max / Y, Q = this.textureSizeLimits.max / K, O = J % $ * Y, G = Math.floor(J / $) % Q * K;
    return { x: O, y: G, textureIndex: this.calculateTextureIndex(q, J) };
  }
  getTag() {
    return B.getTag(this);
  }
  static getTag(q) {
    return `${q.size[0]}x${q.size[1]}-#${q.slotNumber}`;
  }
  static positionToTextureSlot(q, J, Y, K, $) {
    const [Q, O] = Y, G = $.textureSizeLimits.max / Q, Z = $.textureSizeLimits.max / Q * ($.textureSizeLimits.max / O) * K + J / O * G + q / Q;
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
    const { x: q, y: J, size: Y, textureIndex: K } = this, [$, Q] = Y;
    if (!this.canSplitHorizontally())
      throw new Error(`Cannot split texture slot of size ${$} horizontally`);
    const O = $ / 2, G = B.positionToTextureSlot(q, J, [O, Q], K, this), C = B.positionToTextureSlot(q + O, J, [O, Q], K, this);
    return G.sibbling = C, C.sibbling = G, [G, C];
  }
  splitVertically() {
    const { x: q, y: J, size: Y, textureIndex: K } = this, [$, Q] = Y;
    if (!this.canSplitVertically())
      throw new Error(`Cannot split texture slot of size ${Q} vertically`);
    const O = Q / 2, G = B.positionToTextureSlot(q, J, [$, O], K, this), C = B.positionToTextureSlot(q, J + O, [$, O], K, this);
    return G.sibbling = C, C.sibbling = G, [G, C];
  }
}
var m = false;
var b = 16;
var k = 4096;
var p = 16;

class R {
  textureSlots = new F((q, J) => {
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
    for (let Q = 0;Q < this.numTextureSheets; Q++) {
      if (K?.(Q))
        continue;
      this.initialSlots.push(new B([this.maxTextureSize, this.maxTextureSize], Q, undefined, { min: this.minTextureSize, max: this.maxTextureSize }));
    }
    this.initialSlots.forEach((Q) => this.textureSlots.insert(Q));
  }
  allocate(q, J, Y = 1) {
    const { size: K, slotNumber: $, x: Q, y: O, textureIndex: G } = this.allocateHelper(q, J, Y);
    return { size: K, slotNumber: $, x: Q, y: O, textureIndex: G };
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
    const [Q, O] = this.bestFit(K, $);
    return this.fitSlot($, Q, O);
  }
  findSlot(q) {
    for (let J = 0;J < this.textureSlots.size; J++) {
      const K = this.textureSlots.at(J).key, [$, Q] = K.size;
      if (q.get($) <= Q)
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
    return q.forEach((Q, O) => {
      if (O <= Y && Q <= K) {
        const G = O * Q, C = q.get($) * $;
        if (G < C)
          $ = O;
        else if (G === C) {
          if (this.calculateRatio(O, Q) < this.calculateRatio($, q.get($)))
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
  listSlots() {
    this.textureSlots.forEach((q) => {
      console.log(q.key?.getTag());
    });
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
      const C = G.image;
      if (typeof C === "string")
        throw new Error("ImagePacker: image is not loaded");
      const Z = C.naturalWidth ?? C.displayWidth ?? C.width?.baseValue?.value ?? C.width, X = C.naturalHeight ?? C.displayHeight ?? C.height?.baseValue?.value ?? C.height, V = G.cols || 1, j = G.rows || 1;
      return { id: G.id, image: await this.loadImage(G.image), cols: V, rows: j, spriteWidth: Z / V, spriteHeight: X / j, count: j * V };
    })), K = new R(q);
    Y.sort((G, C) => {
      const Z = G.cols * G.spriteWidth + G.rows * G.spriteHeight;
      return C.cols * C.spriteWidth + C.rows * C.spriteHeight - Z;
    });
    const $ = [];
    Y.forEach((G) => {
      const { id: C, image: Z, spriteWidth: X, spriteHeight: V, count: j } = G, M = K.allocate(X, V, j);
      if (M.textureIndex >= J.length) {
        const P = new OffscreenCanvas(K.maxTextureSize, K.maxTextureSize);
        J.push(P);
      }
      const L = J[M.textureIndex].getContext("2d");
      if (!L)
        throw new Error("Failed to get 2d context");
      L.imageSmoothingEnabled = true;
      const [f, w] = M.size, g = Math.floor(f / X), z = Math.floor(w / V);
      for (let P = 0;P < j; P++) {
        const S = M.x + P % g * X, h = M.y + Math.floor(P / z) * V;
        L.drawImage(Z, 0, 0, X, V, S, h, X, V);
      }
      $.push({ id: C, slot: M });
    }), $.sort((G, C) => G.id.localeCompare(C.id));
    const Q = $.map(({ id: G, slot: C }) => [G, B.getTag(C)]);
    return { images: await Promise.all(J.map((G) => createImageBitmap(G))), slots: $, compact: Object.fromEntries(Q), textureSize: K.maxTextureSize };
  }
}
export {
  T as ImagePacker
};
