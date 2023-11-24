function L(q,J=(Y)=>Y.key){var Y=[];return E(q,"",!0,(K)=>Y.push(K),J),Y.join("")}var E=function(q,J,Y,K,$){if(q){K(`${J}${Y?"\u2514\u2500\u2500 ":"\u251C\u2500\u2500 "}${$(q)}\n`);const G=J+(Y?"    ":"\u2502   ");if(q.left)E(q.left,G,!1,K,$);if(q.right)E(q.right,G,!0,K,$)}};function P(q){if(q===null)return!0;var J=j(q.left),Y=j(q.right);if(Math.abs(J-Y)<=1&&P(q.left)&&P(q.right))return!0;return!1}var j=function(q){return q?1+Math.max(j(q.left),j(q.right)):0};function F(q,J,Y,K,$){const G=$-K;if(G>0){const O=K+Math.floor(G/2),Q=J[O],Z=Y[O],C={key:Q,data:Z,parent:q};return C.left=F(C,J,Y,K,O),C.right=F(C,J,Y,O+1,$),C}return null}function M(q){if(q===null)return 0;const J=M(q.left),Y=M(q.right);return q.balanceFactor=J-Y,Math.max(J,Y)+1}function D(q,J,Y,K,$){if(Y>=K)return;const G=q[Y+K>>1];let O=Y-1,Q=K+1;while(!0){do O++;while($(q[O],G)<0);do Q--;while($(q[Q],G)>0);if(O>=Q)break;let Z=q[O];q[O]=q[Q],q[Q]=Z,Z=J[O],J[O]=J[Q],J[Q]=Z}D(q,J,Y,Q,$),D(q,J,Q+1,K,$)}var z=function(q,J){return q>J?1:q<J?-1:0},H=function(q){var J=q.right;if(q.right=J.left,J.left)J.left.parent=q;if(J.parent=q.parent,J.parent)if(J.parent.left===q)J.parent.left=J;else J.parent.right=J;if(q.parent=J,J.left=q,q.balanceFactor+=1,J.balanceFactor<0)q.balanceFactor-=J.balanceFactor;if(J.balanceFactor+=1,q.balanceFactor>0)J.balanceFactor+=q.balanceFactor;return J},U=function(q){var J=q.left;if(q.left=J.right,q.left)q.left.parent=q;if(J.parent=q.parent,J.parent)if(J.parent.left===q)J.parent.left=J;else J.parent.right=J;if(q.parent=J,J.right=q,q.balanceFactor-=1,J.balanceFactor>0)q.balanceFactor-=J.balanceFactor;if(J.balanceFactor-=1,q.balanceFactor<0)J.balanceFactor+=q.balanceFactor;return J};class X{constructor(q,J=!1){this._comparator=q||z,this._root=null,this._size=0,this._noDuplicates=!!J}destroy(){return this.clear()}clear(){return this._root=null,this._size=0,this}get size(){return this._size}contains(q){if(this._root){var J=this._root,Y=this._comparator;while(J){var K=Y(q,J.key);if(K===0)return!0;else if(K<0)J=J.left;else J=J.right}}return!1}next(q){var J=q;if(J)if(J.right){J=J.right;while(J.left)J=J.left}else{J=q.parent;while(J&&J.right===q)q=J,J=J.parent}return J}prev(q){var J=q;if(J)if(J.left){J=J.left;while(J.right)J=J.right}else{J=q.parent;while(J&&J.left===q)q=J,J=J.parent}return J}forEach(q){var J=this._root,Y=[],K=!1,$=0;while(!K)if(J)Y.push(J),J=J.left;else if(Y.length>0)J=Y.pop(),q(J,$++),J=J.right;else K=!0;return this}range(q,J,Y,K){const $=[],G=this._comparator;let O=this._root,Q;while($.length!==0||O)if(O)$.push(O),O=O.left;else{if(O=$.pop(),Q=G(O.key,J),Q>0)break;else if(G(O.key,q)>=0){if(Y.call(K,O))return this}O=O.right}return this}keys(){var q=this._root,J=[],Y=[],K=!1;while(!K)if(q)J.push(q),q=q.left;else if(J.length>0)q=J.pop(),Y.push(q.key),q=q.right;else K=!0;return Y}values(){var q=this._root,J=[],Y=[],K=!1;while(!K)if(q)J.push(q),q=q.left;else if(J.length>0)q=J.pop(),Y.push(q.data),q=q.right;else K=!0;return Y}at(q){var J=this._root,Y=[],K=!1,$=0;while(!K)if(J)Y.push(J),J=J.left;else if(Y.length>0){if(J=Y.pop(),$===q)return J;$++,J=J.right}else K=!0;return null}minNode(){var q=this._root;if(!q)return null;while(q.left)q=q.left;return q}maxNode(){var q=this._root;if(!q)return null;while(q.right)q=q.right;return q}min(){var q=this._root;if(!q)return null;while(q.left)q=q.left;return q.key}max(){var q=this._root;if(!q)return null;while(q.right)q=q.right;return q.key}isEmpty(){return!this._root}pop(){var q=this._root,J=null;if(q){while(q.left)q=q.left;J={key:q.key,data:q.data},this.remove(q.key)}return J}popMax(){var q=this._root,J=null;if(q){while(q.right)q=q.right;J={key:q.key,data:q.data},this.remove(q.key)}return J}find(q){var J=this._root,Y=J,K,$=this._comparator;while(Y)if(K=$(q,Y.key),K===0)return Y;else if(K<0)Y=Y.left;else Y=Y.right;return null}insert(q,J){if(!this._root)return this._root={parent:null,left:null,right:null,balanceFactor:0,key:q,data:J},this._size++,this._root;var Y=this._comparator,K=this._root,$=null,G=0;if(this._noDuplicates)while(K)if(G=Y(q,K.key),$=K,G===0)return null;else if(G<0)K=K.left;else K=K.right;else while(K)if(G=Y(q,K.key),$=K,G<=0)K=K.left;else K=K.right;var O={left:null,right:null,balanceFactor:0,parent:$,key:q,data:J},Q;if(G<=0)$.left=O;else $.right=O;while($){if(G=Y($.key,q),G<0)$.balanceFactor-=1;else $.balanceFactor+=1;if($.balanceFactor===0)break;else if($.balanceFactor<-1){if($.right.balanceFactor===1)U($.right);if(Q=H($),$===this._root)this._root=Q;break}else if($.balanceFactor>1){if($.left.balanceFactor===-1)H($.left);if(Q=U($),$===this._root)this._root=Q;break}$=$.parent}return this._size++,O}remove(q){if(!this._root)return null;var J=this._root,Y=this._comparator,K=0;while(J)if(K=Y(q,J.key),K===0)break;else if(K<0)J=J.left;else J=J.right;if(!J)return null;var $=J.key,G,O;if(J.left){G=J.left;while(G.left||G.right){while(G.right)G=G.right;if(J.key=G.key,J.data=G.data,G.left)J=G,G=G.left}J.key=G.key,J.data=G.data,J=G}if(J.right){O=J.right;while(O.left||O.right){while(O.left)O=O.left;if(J.key=O.key,J.data=O.data,O.right)J=O,O=O.right}J.key=O.key,J.data=O.data,J=O}var Q=J.parent,Z=J,C;while(Q){if(Q.left===Z)Q.balanceFactor-=1;else Q.balanceFactor+=1;if(Q.balanceFactor<-1){if(Q.right.balanceFactor===1)U(Q.right);if(C=H(Q),Q===this._root)this._root=C;Q=C}else if(Q.balanceFactor>1){if(Q.left.balanceFactor===-1)H(Q.left);if(C=U(Q),Q===this._root)this._root=C;Q=C}if(Q.balanceFactor===-1||Q.balanceFactor===1)break;Z=Q,Q=Q.parent}if(J.parent)if(J.parent.left===J)J.parent.left=null;else J.parent.right=null;if(J===this._root)this._root=null;return this._size--,$}load(q=[],J=[],Y){if(this._size!==0)throw new Error("bulk-load: tree is not empty");const K=q.length;if(Y)D(q,J,0,K-1,this._comparator);return this._root=F(null,q,J,0,K),M(this._root),this._size=K,this}isBalanced(){return P(this._root)}toString(q){return L(this._root,q)}}X.default=X;class B{size;slotNumber;x;y;textureIndex;parent;sibbling;textureSizeLimits;constructor(q,J,Y,K){this.textureSizeLimits=Y?.textureSizeLimits??K??{min:A,max:R},this.size=q,this.slotNumber=J,this.parent=Y,this.sibbling=void 0;const{x:$,y:G,textureIndex:O}=this.calculatePosition(q,J);this.x=$,this.y=G,this.textureIndex=O}calculateTextureIndex(q,J){const[Y,K]=q,$=this.textureSizeLimits.max/Y*(this.textureSizeLimits.max/K);return Math.floor(J/$)}calculatePosition(q,J){const[Y,K]=q,$=this.textureSizeLimits.max/Y,G=this.textureSizeLimits.max/K,O=J%$*Y,Q=Math.floor(J/$)%G*K;return{x:O,y:Q,textureIndex:this.calculateTextureIndex(q,J)}}getTag(){return B.getTag(this)}static getTag(q){return`${q.size[0]}x${q.size[1]}-#${q.slotNumber}-[${q.textureIndex}]`}static positionToTextureSlot(q,J,Y,K,$){const[G,O]=Y,Q=$.textureSizeLimits.max/G,C=$.textureSizeLimits.max/G*($.textureSizeLimits.max/O)*K+J/O*Q+q/G;return new B(Y,C,$)}getPosition(){return{x:this.x,y:this.y,size:this.size,textureIndex:this.textureIndex}}canSplitHorizontally(){const[,q]=this.size;return q>this.textureSizeLimits.min}canSplitVertically(){const[q]=this.size;return q>this.textureSizeLimits.min}splitHorizontally(){const{x:q,y:J,size:Y,textureIndex:K}=this,[$,G]=Y;if(!this.canSplitHorizontally())throw new Error(`Cannot split texture slot of size ${$} horizontally`);const O=$/2,Q=B.positionToTextureSlot(q,J,[O,G],K,this),Z=B.positionToTextureSlot(q+O,J,[O,G],K,this);return Q.sibbling=Z,Z.sibbling=Q,[Q,Z]}splitVertically(){const{x:q,y:J,size:Y,textureIndex:K}=this,[$,G]=Y;if(!this.canSplitVertically())throw new Error(`Cannot split texture slot of size ${G} vertically`);const O=G/2,Q=B.positionToTextureSlot(q,J,[$,O],K,this),Z=B.positionToTextureSlot(q,J+O,[$,O],K,this);return Q.sibbling=Z,Z.sibbling=Q,[Q,Z]}}function _(q,J){return Math.max(J,Math.pow(2,Math.ceil(Math.log(q)/Math.log(2))))}function v(q,J,Y,K){if(Y<1)throw new Error("Invalid count");const $=_(q,K.min),G=_(J,K.min),O=new Map;let Q=K.min;for(let Z=1;Z<=Y;Z++){Q=_($*Z,K.min);const C=_(G*Math.ceil(Y/Z),K.min);O.set(Q,C)}for(let Z=Q;Z<=K.max;Z*=2)if(!O.has(Z))O.set(Z,G);return O}var g=!1,A=16,R=4096,S=16;class W{textureSlots=new X((q,J)=>{const Y=q.size[0]*q.size[1]-J.size[0]*J.size[1];if(Y!==0)return Y;return q.slotNumber-J.slotNumber},!1);allocatedTextures={};minTextureSize;maxTextureSize;constructor({numTextureSheets:q,minTextureSize:J,maxTextureSize:Y}={},K){let $=q??S;if(this.minTextureSize=J??A,this.maxTextureSize=Y??R,K)$=Math.min($,K.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS)),this.maxTextureSize=Math.min(this.maxTextureSize,K.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE)),this.minTextureSize=Math.min(this.minTextureSize,this.maxTextureSize);for(let G=0;G<$;G++)this.textureSlots.insert(new B([this.maxTextureSize,this.maxTextureSize],G,void 0,{min:this.minTextureSize,max:this.maxTextureSize}))}allocate(q,J,Y=1){const{size:K,slotNumber:$,x:G,y:O,textureIndex:Q}=this.allocateHelper(q,J,Y);return{size:K,slotNumber:$,x:G,y:O,textureIndex:Q}}deallocate(q){if(!this.isSlotUsed(q))throw new Error("Slot is not allocated");const J=this.allocatedTextures[B.getTag(q)];this.deallocateHelper(J)}allocateHelper(q,J,Y=1){const K=v(q,J,Y,{min:this.minTextureSize,max:this.maxTextureSize}),$=this.findSlot(K);if(!$)throw new Error(`Could not find a slot for texture to fit ${Y} sprites of size ${q}x${J}`);this.textureSlots.remove($);const[G,O]=this.bestFit(K,$);return this.fitSlot($,G,O)}findSlot(q){for(let J=0;J<this.textureSlots.size;J++){const K=this.textureSlots.at(J).key,[$,G]=K.size;if(q.get($)<=G)return K}return null}calculateRatio(q,J){return Math.max(q/J,J/q)}bestFit(q,J){const[Y,K]=J.size;let $=J.textureSizeLimits.max;return q.forEach((G,O)=>{if(O<=Y&&G<=K){const Q=O*G,Z=q.get($)*$;if(Q<Z)$=O;else if(Q===Z){if(this.calculateRatio(O,G)<this.calculateRatio($,q.get($)))$=O}}}),[$,q.get($)]}isSlotUsed(q){return!!this.allocatedTextures[B.getTag(q)]}deallocateHelper(q){if(q.parent&&q.sibbling&&!this.isSlotUsed(q.sibbling)){const J=q.sibbling;if(this.textureSlots.remove(J),g&&this.textureSlots.find(q))throw new Error("Slot is not expected to be in the tree");const Y=q.parent;this.deallocateHelper(Y);return}this.textureSlots.insert(q),delete this.allocatedTextures[q.getTag()]}trySplitHorizontally(q,J,Y){if(q.canSplitHorizontally()){const[K,$]=q.splitHorizontally();if(K.size[0]>=J)return this.textureSlots.insert($),this.fitSlot(K,J,Y)}return null}trySplitVertically(q,J,Y){if(q.canSplitVertically()){const[K,$]=q.splitVertically();if(K.size[1]>=Y)return this.textureSlots.insert($),this.fitSlot(K,J,Y)}return null}fitSlot(q,J,Y){if(this.allocatedTextures[q.getTag()]=q,q.size[0]>q.size[1]){const K=this.trySplitHorizontally(q,J,Y)??this.trySplitVertically(q,J,Y);if(K)return K}else{const K=this.trySplitVertically(q,J,Y)??this.trySplitHorizontally(q,J,Y);if(K)return K}return q}listSlots(){this.textureSlots.forEach((q)=>{console.log(q.key?.getTag())})}}class b{q;constructor(q=[]){this.images=q}addImage(q,J=1,Y=1){this.images.push({image:q,cols:J,rows:Y})}clear(){this.images.length=0}async getImage(q){const Y=await(await fetch(q)).blob();return await createImageBitmap(Y)}async loadImage(q){if(typeof q!=="string")return q;return await this.getImage(q)}async pack(q={}){const J=[],Y=await Promise.all(this.images.map(async($)=>{const G=$.image;if(typeof G==="string")throw new Error("ImagePacker: image is not loaded");const O=G.naturalWidth??G.displayWidth??G.width?.baseValue?.value??G.width,Q=G.naturalHeight??G.displayHeight??G.height?.baseValue?.value??G.height,Z=$.cols||1,C=$.rows||1;return{image:await this.loadImage($.image),cols:Z,rows:C,spriteWidth:O/Z,spriteHeight:Q/C,count:C*Z}})),K=new W(q);return Y.sort(($,G)=>{const O=$.cols*$.spriteWidth+$.rows*$.spriteHeight;return G.cols*G.spriteWidth+G.rows*G.spriteHeight-O}),Y.forEach(($)=>{const{image:G,spriteWidth:O,spriteHeight:Q,count:Z}=$,C=K.allocate(O,Q,Z);if(C.textureIndex>=J.length){const V=new OffscreenCanvas(K.maxTextureSize,K.maxTextureSize);J.push(V)}const I=J[C.textureIndex].getContext("2d");if(!I)throw new Error("Failed to get 2d context");I.imageSmoothingEnabled=!0;const[k,y]=C.size,N=Math.floor(k/O),T=Math.floor(y/Q);for(let V=0;V<Z;V++){const f=C.x+V%N*O,w=C.y+Math.floor(V/T)*Q;I.drawImage(G,0,0,O,Q,f,w,O,Q)}}),J}}export{W as TextureSlotAllocator,b as ImagePacker};

//# debugId=ADB59CBE0F7990E864756e2164756e21
