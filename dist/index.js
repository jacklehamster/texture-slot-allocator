var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/avl/dist/avl.js
var require_avl = __commonJS((exports, module) => {
  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.AVLTree = factory());
  })(exports, function() {
    function print(root, printNode) {
      if (printNode === undefined)
        printNode = function(n) {
          return n.key;
        };
      var out = [];
      row(root, "", true, function(v) {
        return out.push(v);
      }, printNode);
      return out.join("");
    }
    function row(root, prefix, isTail, out, printNode) {
      if (root) {
        out("" + prefix + (isTail ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ") + printNode(root) + "\n");
        var indent = prefix + (isTail ? "    " : "\u2502   ");
        if (root.left) {
          row(root.left, indent, false, out, printNode);
        }
        if (root.right) {
          row(root.right, indent, true, out, printNode);
        }
      }
    }
    function isBalanced(root) {
      if (root === null) {
        return true;
      }
      var lh = height(root.left);
      var rh = height(root.right);
      if (Math.abs(lh - rh) <= 1 && isBalanced(root.left) && isBalanced(root.right)) {
        return true;
      }
      return false;
    }
    function height(node) {
      return node ? 1 + Math.max(height(node.left), height(node.right)) : 0;
    }
    function loadRecursive(parent, keys, values, start, end) {
      var size = end - start;
      if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var key = keys[middle];
        var data = values[middle];
        var node = { key, data, parent };
        node.left = loadRecursive(node, keys, values, start, middle);
        node.right = loadRecursive(node, keys, values, middle + 1, end);
        return node;
      }
      return null;
    }
    function markBalance(node) {
      if (node === null) {
        return 0;
      }
      var lh = markBalance(node.left);
      var rh = markBalance(node.right);
      node.balanceFactor = lh - rh;
      return Math.max(lh, rh) + 1;
    }
    function sort(keys, values, left, right, compare) {
      if (left >= right) {
        return;
      }
      var pivot = keys[left + right >> 1];
      var i = left - 1;
      var j = right + 1;
      while (true) {
        do {
          i++;
        } while (compare(keys[i], pivot) < 0);
        do {
          j--;
        } while (compare(keys[j], pivot) > 0);
        if (i >= j) {
          break;
        }
        var tmp = keys[i];
        keys[i] = keys[j];
        keys[j] = tmp;
        tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
      }
      sort(keys, values, left, j, compare);
      sort(keys, values, j + 1, right, compare);
    }
    function DEFAULT_COMPARE(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    }
    function rotateLeft(node) {
      var rightNode = node.right;
      node.right = rightNode.left;
      if (rightNode.left) {
        rightNode.left.parent = node;
      }
      rightNode.parent = node.parent;
      if (rightNode.parent) {
        if (rightNode.parent.left === node) {
          rightNode.parent.left = rightNode;
        } else {
          rightNode.parent.right = rightNode;
        }
      }
      node.parent = rightNode;
      rightNode.left = node;
      node.balanceFactor += 1;
      if (rightNode.balanceFactor < 0) {
        node.balanceFactor -= rightNode.balanceFactor;
      }
      rightNode.balanceFactor += 1;
      if (node.balanceFactor > 0) {
        rightNode.balanceFactor += node.balanceFactor;
      }
      return rightNode;
    }
    function rotateRight(node) {
      var leftNode = node.left;
      node.left = leftNode.right;
      if (node.left) {
        node.left.parent = node;
      }
      leftNode.parent = node.parent;
      if (leftNode.parent) {
        if (leftNode.parent.left === node) {
          leftNode.parent.left = leftNode;
        } else {
          leftNode.parent.right = leftNode;
        }
      }
      node.parent = leftNode;
      leftNode.right = node;
      node.balanceFactor -= 1;
      if (leftNode.balanceFactor > 0) {
        node.balanceFactor -= leftNode.balanceFactor;
      }
      leftNode.balanceFactor -= 1;
      if (node.balanceFactor < 0) {
        leftNode.balanceFactor += node.balanceFactor;
      }
      return leftNode;
    }
    var AVLTree = function AVLTree(comparator, noDuplicates) {
      if (noDuplicates === undefined)
        noDuplicates = false;
      this._comparator = comparator || DEFAULT_COMPARE;
      this._root = null;
      this._size = 0;
      this._noDuplicates = !!noDuplicates;
    };
    var prototypeAccessors = { size: { configurable: true } };
    AVLTree.prototype.destroy = function destroy() {
      return this.clear();
    };
    AVLTree.prototype.clear = function clear() {
      this._root = null;
      this._size = 0;
      return this;
    };
    prototypeAccessors.size.get = function() {
      return this._size;
    };
    AVLTree.prototype.contains = function contains(key) {
      if (this._root) {
        var node = this._root;
        var comparator = this._comparator;
        while (node) {
          var cmp = comparator(key, node.key);
          if (cmp === 0) {
            return true;
          } else if (cmp < 0) {
            node = node.left;
          } else {
            node = node.right;
          }
        }
      }
      return false;
    };
    AVLTree.prototype.next = function next(node) {
      var successor = node;
      if (successor) {
        if (successor.right) {
          successor = successor.right;
          while (successor.left) {
            successor = successor.left;
          }
        } else {
          successor = node.parent;
          while (successor && successor.right === node) {
            node = successor;
            successor = successor.parent;
          }
        }
      }
      return successor;
    };
    AVLTree.prototype.prev = function prev(node) {
      var predecessor = node;
      if (predecessor) {
        if (predecessor.left) {
          predecessor = predecessor.left;
          while (predecessor.right) {
            predecessor = predecessor.right;
          }
        } else {
          predecessor = node.parent;
          while (predecessor && predecessor.left === node) {
            node = predecessor;
            predecessor = predecessor.parent;
          }
        }
      }
      return predecessor;
    };
    AVLTree.prototype.forEach = function forEach(callback) {
      var current = this._root;
      var s = [], done = false, i = 0;
      while (!done) {
        if (current) {
          s.push(current);
          current = current.left;
        } else {
          if (s.length > 0) {
            current = s.pop();
            callback(current, i++);
            current = current.right;
          } else {
            done = true;
          }
        }
      }
      return this;
    };
    AVLTree.prototype.range = function range(low, high, fn, ctx) {
      var Q = [];
      var compare = this._comparator;
      var node = this._root, cmp;
      while (Q.length !== 0 || node) {
        if (node) {
          Q.push(node);
          node = node.left;
        } else {
          node = Q.pop();
          cmp = compare(node.key, high);
          if (cmp > 0) {
            break;
          } else if (compare(node.key, low) >= 0) {
            if (fn.call(ctx, node)) {
              return this;
            }
          }
          node = node.right;
        }
      }
      return this;
    };
    AVLTree.prototype.keys = function keys() {
      var current = this._root;
      var s = [], r = [], done = false;
      while (!done) {
        if (current) {
          s.push(current);
          current = current.left;
        } else {
          if (s.length > 0) {
            current = s.pop();
            r.push(current.key);
            current = current.right;
          } else {
            done = true;
          }
        }
      }
      return r;
    };
    AVLTree.prototype.values = function values() {
      var current = this._root;
      var s = [], r = [], done = false;
      while (!done) {
        if (current) {
          s.push(current);
          current = current.left;
        } else {
          if (s.length > 0) {
            current = s.pop();
            r.push(current.data);
            current = current.right;
          } else {
            done = true;
          }
        }
      }
      return r;
    };
    AVLTree.prototype.at = function at(index) {
      var current = this._root;
      var s = [], done = false, i = 0;
      while (!done) {
        if (current) {
          s.push(current);
          current = current.left;
        } else {
          if (s.length > 0) {
            current = s.pop();
            if (i === index) {
              return current;
            }
            i++;
            current = current.right;
          } else {
            done = true;
          }
        }
      }
      return null;
    };
    AVLTree.prototype.minNode = function minNode() {
      var node = this._root;
      if (!node) {
        return null;
      }
      while (node.left) {
        node = node.left;
      }
      return node;
    };
    AVLTree.prototype.maxNode = function maxNode() {
      var node = this._root;
      if (!node) {
        return null;
      }
      while (node.right) {
        node = node.right;
      }
      return node;
    };
    AVLTree.prototype.min = function min() {
      var node = this._root;
      if (!node) {
        return null;
      }
      while (node.left) {
        node = node.left;
      }
      return node.key;
    };
    AVLTree.prototype.max = function max() {
      var node = this._root;
      if (!node) {
        return null;
      }
      while (node.right) {
        node = node.right;
      }
      return node.key;
    };
    AVLTree.prototype.isEmpty = function isEmpty() {
      return !this._root;
    };
    AVLTree.prototype.pop = function pop() {
      var node = this._root, returnValue = null;
      if (node) {
        while (node.left) {
          node = node.left;
        }
        returnValue = { key: node.key, data: node.data };
        this.remove(node.key);
      }
      return returnValue;
    };
    AVLTree.prototype.popMax = function popMax() {
      var node = this._root, returnValue = null;
      if (node) {
        while (node.right) {
          node = node.right;
        }
        returnValue = { key: node.key, data: node.data };
        this.remove(node.key);
      }
      return returnValue;
    };
    AVLTree.prototype.find = function find(key) {
      var root = this._root;
      var subtree = root, cmp;
      var compare = this._comparator;
      while (subtree) {
        cmp = compare(key, subtree.key);
        if (cmp === 0) {
          return subtree;
        } else if (cmp < 0) {
          subtree = subtree.left;
        } else {
          subtree = subtree.right;
        }
      }
      return null;
    };
    AVLTree.prototype.insert = function insert(key, data) {
      if (!this._root) {
        this._root = {
          parent: null,
          left: null,
          right: null,
          balanceFactor: 0,
          key,
          data
        };
        this._size++;
        return this._root;
      }
      var compare = this._comparator;
      var node = this._root;
      var parent = null;
      var cmp = 0;
      if (this._noDuplicates) {
        while (node) {
          cmp = compare(key, node.key);
          parent = node;
          if (cmp === 0) {
            return null;
          } else if (cmp < 0) {
            node = node.left;
          } else {
            node = node.right;
          }
        }
      } else {
        while (node) {
          cmp = compare(key, node.key);
          parent = node;
          if (cmp <= 0) {
            node = node.left;
          } else {
            node = node.right;
          }
        }
      }
      var newNode = {
        left: null,
        right: null,
        balanceFactor: 0,
        parent,
        key,
        data
      };
      var newRoot;
      if (cmp <= 0) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
      while (parent) {
        cmp = compare(parent.key, key);
        if (cmp < 0) {
          parent.balanceFactor -= 1;
        } else {
          parent.balanceFactor += 1;
        }
        if (parent.balanceFactor === 0) {
          break;
        } else if (parent.balanceFactor < -1) {
          if (parent.right.balanceFactor === 1) {
            rotateRight(parent.right);
          }
          newRoot = rotateLeft(parent);
          if (parent === this._root) {
            this._root = newRoot;
          }
          break;
        } else if (parent.balanceFactor > 1) {
          if (parent.left.balanceFactor === -1) {
            rotateLeft(parent.left);
          }
          newRoot = rotateRight(parent);
          if (parent === this._root) {
            this._root = newRoot;
          }
          break;
        }
        parent = parent.parent;
      }
      this._size++;
      return newNode;
    };
    AVLTree.prototype.remove = function remove(key) {
      if (!this._root) {
        return null;
      }
      var node = this._root;
      var compare = this._comparator;
      var cmp = 0;
      while (node) {
        cmp = compare(key, node.key);
        if (cmp === 0) {
          break;
        } else if (cmp < 0) {
          node = node.left;
        } else {
          node = node.right;
        }
      }
      if (!node) {
        return null;
      }
      var returnValue = node.key;
      var max, min;
      if (node.left) {
        max = node.left;
        while (max.left || max.right) {
          while (max.right) {
            max = max.right;
          }
          node.key = max.key;
          node.data = max.data;
          if (max.left) {
            node = max;
            max = max.left;
          }
        }
        node.key = max.key;
        node.data = max.data;
        node = max;
      }
      if (node.right) {
        min = node.right;
        while (min.left || min.right) {
          while (min.left) {
            min = min.left;
          }
          node.key = min.key;
          node.data = min.data;
          if (min.right) {
            node = min;
            min = min.right;
          }
        }
        node.key = min.key;
        node.data = min.data;
        node = min;
      }
      var parent = node.parent;
      var pp = node;
      var newRoot;
      while (parent) {
        if (parent.left === pp) {
          parent.balanceFactor -= 1;
        } else {
          parent.balanceFactor += 1;
        }
        if (parent.balanceFactor < -1) {
          if (parent.right.balanceFactor === 1) {
            rotateRight(parent.right);
          }
          newRoot = rotateLeft(parent);
          if (parent === this._root) {
            this._root = newRoot;
          }
          parent = newRoot;
        } else if (parent.balanceFactor > 1) {
          if (parent.left.balanceFactor === -1) {
            rotateLeft(parent.left);
          }
          newRoot = rotateRight(parent);
          if (parent === this._root) {
            this._root = newRoot;
          }
          parent = newRoot;
        }
        if (parent.balanceFactor === -1 || parent.balanceFactor === 1) {
          break;
        }
        pp = parent;
        parent = parent.parent;
      }
      if (node.parent) {
        if (node.parent.left === node) {
          node.parent.left = null;
        } else {
          node.parent.right = null;
        }
      }
      if (node === this._root) {
        this._root = null;
      }
      this._size--;
      return returnValue;
    };
    AVLTree.prototype.load = function load(keys, values, presort) {
      if (keys === undefined)
        keys = [];
      if (values === undefined)
        values = [];
      if (this._size !== 0) {
        throw new Error("bulk-load: tree is not empty");
      }
      var size = keys.length;
      if (presort) {
        sort(keys, values, 0, size - 1, this._comparator);
      }
      this._root = loadRecursive(null, keys, values, 0, size);
      markBalance(this._root);
      this._size = size;
      return this;
    };
    AVLTree.prototype.isBalanced = function isBalanced$1() {
      return isBalanced(this._root);
    };
    AVLTree.prototype.toString = function toString(printNode) {
      return print(this._root, printNode);
    };
    Object.defineProperties(AVLTree.prototype, prototypeAccessors);
    AVLTree.default = AVLTree;
    return AVLTree;
  });
});

// src/texture/TextureSlotAllocator.ts
var import_avl = __toESM(require_avl(), 1);

// src/texture/TextureSlot.ts
class TextureSlot {
  size;
  slotNumber;
  x;
  y;
  textureIndex;
  parent;
  sibbling;
  textureSizeLimits;
  constructor(size, slotNumber, parent, textureSizeLimits) {
    this.textureSizeLimits = parent?.textureSizeLimits ?? textureSizeLimits ?? { min: DEFAULT_MIN_TEXTURE_SIZE, max: DEFAULT_MAX_TEXTURE_SIZE };
    this.size = size;
    this.slotNumber = slotNumber;
    this.parent = parent;
    this.sibbling = undefined;
    const { x, y, textureIndex } = this.calculatePosition(size, slotNumber);
    this.x = x;
    this.y = y;
    this.textureIndex = textureIndex;
  }
  calculateTextureIndex(size, slotNumber) {
    const [w, h] = size;
    const slotsPerTexture = this.textureSizeLimits.max / w * (this.textureSizeLimits.max / h);
    return Math.floor(slotNumber / slotsPerTexture);
  }
  calculatePosition(size, slotNumber) {
    const [w, h] = size;
    const slotsPerRow = this.textureSizeLimits.max / w;
    const slotsPerColumn = this.textureSizeLimits.max / h;
    const x = slotNumber % slotsPerRow * w;
    const y = Math.floor(slotNumber / slotsPerRow) % slotsPerColumn * h;
    return { x, y, textureIndex: this.calculateTextureIndex(size, slotNumber) };
  }
  getTag() {
    return TextureSlot.getTag(this);
  }
  static getTag(slot) {
    return `${slot.size[0]}x${slot.size[1]}-#${slot.slotNumber}`;
  }
  static positionToTextureSlot(x, y, size, textureIndex, parent) {
    const [w, h] = size;
    const slotsPerRow = parent.textureSizeLimits.max / w;
    const slotsPerTexture = parent.textureSizeLimits.max / w * (parent.textureSizeLimits.max / h);
    const slotNumber = slotsPerTexture * textureIndex + y / h * slotsPerRow + x / w;
    return new TextureSlot(size, slotNumber, parent);
  }
  getPosition() {
    return { x: this.x, y: this.y, size: this.size, textureIndex: this.textureIndex };
  }
  canSplitHorizontally() {
    const [, h] = this.size;
    return h > this.textureSizeLimits.min;
  }
  canSplitVertically() {
    const [w] = this.size;
    return w > this.textureSizeLimits.min;
  }
  splitHorizontally() {
    const { x, y, size, textureIndex } = this;
    const [w, h] = size;
    if (!this.canSplitHorizontally()) {
      throw new Error(`Cannot split texture slot of size ${w} horizontally`);
    }
    const halfWidth = w / 2;
    const left = TextureSlot.positionToTextureSlot(x, y, [halfWidth, h], textureIndex, this);
    const right = TextureSlot.positionToTextureSlot(x + halfWidth, y, [halfWidth, h], textureIndex, this);
    left.sibbling = right;
    right.sibbling = left;
    return [left, right];
  }
  splitVertically() {
    const { x, y, size, textureIndex } = this;
    const [w, h] = size;
    if (!this.canSplitVertically()) {
      throw new Error(`Cannot split texture slot of size ${h} vertically`);
    }
    const halfHeight = h / 2;
    const top = TextureSlot.positionToTextureSlot(x, y, [w, halfHeight], textureIndex, this);
    const bottom = TextureSlot.positionToTextureSlot(x, y + halfHeight, [w, halfHeight], textureIndex, this);
    top.sibbling = bottom;
    bottom.sibbling = top;
    return [top, bottom];
  }
}

// src/texture/TextureUtils.ts
function getMinTextureSlotSize(size, minSize) {
  return Math.max(minSize, Math.pow(2, Math.ceil(Math.log(size) / Math.log(2))));
}
function getFlexSizes(w, h, count, textureSizeLimits) {
  if (count < 1) {
    throw new Error("Invalid count");
  }
  const wFixed = getMinTextureSlotSize(w, textureSizeLimits.min), hFixed = getMinTextureSlotSize(h, textureSizeLimits.min);
  const flexSizes = new Map;
  let wSize = textureSizeLimits.min;
  for (let i = 1;i <= count; i++) {
    wSize = getMinTextureSlotSize(wFixed * i, textureSizeLimits.min);
    const hSize = getMinTextureSlotSize(hFixed * Math.ceil(count / i), textureSizeLimits.min);
    flexSizes.set(wSize, hSize);
  }
  for (let size = wSize;size <= textureSizeLimits.max; size *= 2) {
    if (!flexSizes.has(size)) {
      flexSizes.set(size, hFixed);
    }
  }
  return flexSizes;
}

// src/texture/TextureSlotAllocator.ts
var DEBUG = false;
var DEFAULT_MIN_TEXTURE_SIZE = 16;
var DEFAULT_MAX_TEXTURE_SIZE = 4096;
var DEFAULT_NUM_TEXTURE_SHEETS = 16;

class TextureSlotAllocator2 {
  textureSlots = new import_avl.default((slot1, slot2) => {
    const sizeDiff = slot1.size[0] * slot1.size[1] - slot2.size[0] * slot2.size[1];
    if (sizeDiff !== 0) {
      return sizeDiff;
    }
    return slot1.slotNumber - slot2.slotNumber;
  }, false);
  allocatedTextures = {};
  minTextureSize;
  maxTextureSize;
  numTextureSheets;
  initialSlots = [];
  constructor({ numTextureSheets, minTextureSize, maxTextureSize, excludeTexture } = {}, gl) {
    this.numTextureSheets = numTextureSheets ?? DEFAULT_NUM_TEXTURE_SHEETS;
    this.minTextureSize = minTextureSize ?? DEFAULT_MIN_TEXTURE_SIZE;
    this.maxTextureSize = maxTextureSize ?? DEFAULT_MAX_TEXTURE_SIZE;
    if (gl) {
      this.numTextureSheets = Math.min(this.numTextureSheets, gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS));
      this.maxTextureSize = Math.min(this.maxTextureSize, gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE));
      this.minTextureSize = Math.min(this.minTextureSize, this.maxTextureSize);
    }
    for (let i = 0;i < this.numTextureSheets; i++) {
      if (excludeTexture?.(i)) {
        continue;
      }
      this.initialSlots.push(new TextureSlot([this.maxTextureSize, this.maxTextureSize], i, undefined, {
        min: this.minTextureSize,
        max: this.maxTextureSize
      }));
    }
    this.initialSlots.forEach((slot) => this.textureSlots.insert(slot));
  }
  allocate(w, h, count = 1) {
    const { size, slotNumber, x, y, textureIndex } = this.allocateHelper(w, h, count);
    return { size, slotNumber, x, y, textureIndex };
  }
  deallocate(slot) {
    if (!this.isSlotUsed(slot)) {
      throw new Error("Slot is not allocated");
    }
    const textureSlot = this.allocatedTextures[TextureSlot.getTag(slot)];
    this.deallocateHelper(textureSlot);
  }
  get countUsedTextureSheets() {
    return this.initialSlots.filter((slot) => this.isSlotUsed(slot)).length;
  }
  allocateHelper(w, h, count = 1) {
    const flexSizes = getFlexSizes(w, h, count, { min: this.minTextureSize, max: this.maxTextureSize });
    const slot = this.findSlot(flexSizes);
    if (!slot) {
      throw new Error(`Could not find a slot for texture to fit ${count} sprites of size ${w}x${h}`);
    }
    this.textureSlots.remove(slot);
    const [bestWidth, bestHeight] = this.bestFit(flexSizes, slot);
    return this.fitSlot(slot, bestWidth, bestHeight);
  }
  findSlot(flexSizes) {
    for (let i = 0;i < this.textureSlots.size; i++) {
      const slot = this.textureSlots.at(i);
      const textureSlot = slot.key;
      const [w, h] = textureSlot.size;
      if (flexSizes.get(w) <= h) {
        return textureSlot;
      }
    }
    return null;
  }
  calculateRatio(w, h) {
    return Math.max(w / h, h / w);
  }
  bestFit(flexSizes, slot) {
    const [slotWidth, slotHeight] = slot.size;
    let bestWidth = slot.textureSizeLimits.max;
    flexSizes.forEach((hSize, wSize) => {
      if (wSize <= slotWidth && hSize <= slotHeight) {
        const product = wSize * hSize;
        const bestProduct = flexSizes.get(bestWidth) * bestWidth;
        if (product < bestProduct) {
          bestWidth = wSize;
        } else if (product === bestProduct) {
          const ratio = this.calculateRatio(wSize, hSize);
          if (ratio < this.calculateRatio(bestWidth, flexSizes.get(bestWidth))) {
            bestWidth = wSize;
          }
        }
      }
    });
    return [bestWidth, flexSizes.get(bestWidth)];
  }
  isSlotUsed(slot) {
    return !!this.allocatedTextures[TextureSlot.getTag(slot)];
  }
  deallocateHelper(slot) {
    if (slot.parent && slot.sibbling && !this.isSlotUsed(slot.sibbling)) {
      const sibbling = slot.sibbling;
      this.textureSlots.remove(sibbling);
      if (DEBUG && this.textureSlots.find(slot)) {
        throw new Error("Slot is not expected to be in the tree");
      }
      const parent = slot.parent;
      this.deallocateHelper(parent);
      return;
    }
    this.textureSlots.insert(slot);
    delete this.allocatedTextures[slot.getTag()];
  }
  trySplitHorizontally(slot, w, h) {
    if (slot.canSplitHorizontally()) {
      const [leftColumn, rightColumn] = slot.splitHorizontally();
      if (leftColumn.size[0] >= w) {
        this.textureSlots.insert(rightColumn);
        return this.fitSlot(leftColumn, w, h);
      }
    }
    return null;
  }
  trySplitVertically(slot, w, h) {
    if (slot.canSplitVertically()) {
      const [topRow, bottomRow] = slot.splitVertically();
      if (topRow.size[1] >= h) {
        this.textureSlots.insert(bottomRow);
        return this.fitSlot(topRow, w, h);
      }
    }
    return null;
  }
  fitSlot(slot, w, h) {
    this.allocatedTextures[slot.getTag()] = slot;
    if (slot.size[0] > slot.size[1]) {
      const splitAttempt = this.trySplitHorizontally(slot, w, h) ?? this.trySplitVertically(slot, w, h);
      if (splitAttempt) {
        return splitAttempt;
      }
    } else {
      const splitAttempt = this.trySplitVertically(slot, w, h) ?? this.trySplitHorizontally(slot, w, h);
      if (splitAttempt) {
        return splitAttempt;
      }
    }
    return slot;
  }
  listSlots() {
    this.textureSlots.forEach((node) => {
      console.log(node.key?.getTag());
    });
  }
}

// src/image/ImagePacker.ts
class ImagePacker {
  images;
  constructor(images = []) {
    this.images = images;
  }
  addImage(id, image, cols = 1, rows = 1) {
    this.images.push({ id, image, cols, rows });
  }
  clear() {
    this.images.length = 0;
  }
  async getImage(src) {
    const response = await fetch(src);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  }
  async loadImage(image) {
    if (typeof image !== "string") {
      return image;
    }
    return await this.getImage(image);
  }
  async pack(props = {}) {
    const canvases = [];
    const imageInfos = await Promise.all(this.images.map(async (image) => {
      const img = image.image;
      if (typeof img === "string") {
        throw new Error("ImagePacker: image is not loaded");
      }
      const width = img.naturalWidth ?? img.displayWidth ?? img.width?.baseValue?.value ?? img.width;
      const height = img.naturalHeight ?? img.displayHeight ?? img.height?.baseValue?.value ?? img.height;
      const cols = image.cols || 1;
      const rows = image.rows || 1;
      return {
        id: image.id,
        image: await this.loadImage(image.image),
        cols,
        rows,
        spriteWidth: width / cols,
        spriteHeight: height / rows,
        count: rows * cols
      };
    }));
    const allocator = new TextureSlotAllocator2(props);
    imageInfos.sort((info1, info2) => {
      const size1 = info1.cols * info1.spriteWidth + info1.rows * info1.spriteHeight;
      const size2 = info2.cols * info2.spriteWidth + info2.rows * info2.spriteHeight;
      return size2 - size1;
    });
    const slots = [];
    imageInfos.forEach((imageInfo) => {
      const { id, image, spriteWidth, spriteHeight, count } = imageInfo;
      const slot = allocator.allocate(spriteWidth, spriteHeight, count);
      if (slot.textureIndex >= canvases.length) {
        const canvas2 = new OffscreenCanvas(allocator.maxTextureSize, allocator.maxTextureSize);
        canvases.push(canvas2);
      }
      const canvas = canvases[slot.textureIndex];
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get 2d context");
      }
      ctx.imageSmoothingEnabled = true;
      const [slotWidth, slotHeight] = slot.size;
      const slotCols = Math.floor(slotWidth / spriteWidth);
      const slotRows = Math.floor(slotHeight / spriteHeight);
      for (let i = 0;i < count; i++) {
        const x = slot.x + i % slotCols * spriteWidth;
        const y = slot.y + Math.floor(i / slotRows) * spriteHeight;
        ctx.drawImage(image, 0, 0, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
      }
      slots.push({ id, slot });
    });
    slots.sort((a, b) => a.id.localeCompare(b.id));
    const compact = slots.map(({ id, slot }) => [id, TextureSlot.getTag(slot)]);
    const images = await Promise.all(canvases.map((canvas) => createImageBitmap(canvas)));
    return {
      images,
      slots,
      compact: Object.fromEntries(compact),
      textureSize: allocator.maxTextureSize
    };
  }
}
export {
  TextureSlotAllocator2 as TextureSlotAllocator,
  ImagePacker
};
