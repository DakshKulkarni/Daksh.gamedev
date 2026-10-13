import * as THREE from './vendor/three.module.js';

// Original real-time art: a portal above a procedural basalt landscape.
const container = document.querySelector('#world-scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
} catch {
  container.classList.add('scene-unavailable');
}
if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x101e42, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  container.classList.add('scene-ready');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101e42, .042);
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 100);
  const world = new THREE.Group(); scene.add(world);
  const portal = new THREE.Group(); portal.position.set(0, .25, 0); portal.rotation.y = -.17; world.add(portal);
  scene.add(new THREE.AmbientLight(0xc5d6ff, 1.1));
  const sun = new THREE.DirectionalLight(0xd7ff3f, 4); sun.position.set(3, 4, 4); scene.add(sun);
  const backlight = new THREE.DirectionalLight(0x466aff, 2); backlight.position.set(-4, 3, -4); scene.add(backlight);
  const light = new THREE.PointLight(0xd7ff3f, 65, 16, 2); light.position.set(0, 0, 2); scene.add(light);
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xd7ff3f, emissive: 0xbedf1d, emissiveIntensity: 3, roughness: .3, metalness: .3 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x1b2d58, roughness: .8, metalness: .45 });
  const radius = 2.24;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .042, 12, 180), ringMaterial); portal.add(ring);
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(radius - .13, .012, 6, 180), ringMaterial); portal.add(innerRing);
  for (let i = 0; i < 6; i++) {
    const halo = new THREE.Mesh(new THREE.TorusGeometry(radius, .07 + i * .032, 8, 160), new THREE.MeshBasicMaterial({ color: 0xd7ff3f, transparent: true, opacity: .085 / (i + 1), blending: THREE.AdditiveBlending, depthWrite: false }));
    portal.add(halo);
  }
  const outer = new THREE.Mesh(new THREE.TorusGeometry(radius + .11, .10, 4, 90), darkMaterial); outer.rotation.z = Math.PI / 4; portal.add(outer);
  const segmented = new THREE.Group(); portal.add(segmented);
  for (let i = 0; i < 42; i++) {
    const angle = (i / 42) * Math.PI * 2;
    const block = new THREE.Mesh(new THREE.BoxGeometry(.14, .27, .15), darkMaterial);
    block.position.set(Math.sin(angle) * (radius + .25), Math.cos(angle) * (radius + .25), 0);
    block.rotation.z = -angle; segmented.add(block);
    if (i % 3 === 0) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(.018, .12, .025), ringMaterial);
      tick.position.set(Math.sin(angle) * (radius + .44), Math.cos(angle) * (radius + .44), .1); tick.rotation.z = -angle; segmented.add(tick);
    }
  }
  const uniforms = { uTime: { value: 0 }, uMotion: { value: 1 } };
  const disk = new THREE.Mesh(new THREE.CircleGeometry(radius - .08, 100), new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `varying vec2 vUv; uniform float uTime;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){vec2 p=vUv-.5;float r=length(p)*2.;float a=atan(p.y,p.x);float n=noise(p*9.+uTime*.05);float n2=noise(p*18.-uTime*.035);float edge=pow(r,5.);float swirl=sin(a*6.+r*23.-uTime*.3+n*5.)*.5+.5;float glow=edge*.38+swirl*edge*.16+n*n2*.045;vec3 c=vec3(.018,.035,.085)+vec3(.65,1.,.10)*glow;float alpha=smoothstep(1.,.95,r);gl_FragColor=vec4(c,alpha*.98);}`
  }));
  disk.position.z = -.05; portal.add(disk);
  // A seeded generator keeps the scene stable across page loads.
  let seed = 310; const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const basalt = new THREE.MeshStandardMaterial({ color: 0x172851, roughness: .9, metalness: .25, flatShading: true });
  const geometry = new THREE.CylinderGeometry(.52, .57, 1, 6, 1);
  const landscape = new THREE.InstancedMesh(geometry, basalt, 310);
  const matrix = new THREE.Matrix4(); const quaternion = new THREE.Quaternion();
  for (let i = 0; i < 310; i++) {
    const x = (random() - .5) * 24;
    const z = (random() - .5) * 18 - 1;
    const height = .3 + random() * 1.5 + (z < -4 ? random() * 2.2 : 0);
    matrix.compose(new THREE.Vector3(x, -3.25 + height / 2, z), quaternion, new THREE.Vector3(.5 + random() * .6, height, .5 + random() * .6));
    landscape.setMatrixAt(i, matrix);
  }
  world.add(landscape);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x101e42, roughness: .55, metalness: .45 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -3.3; world.add(floor);
  const grid = new THREE.GridHelper(55, 55, 0x6b8435, 0x263968); grid.position.y = -3.28; grid.material.transparent = true; grid.material.opacity = .27; world.add(grid);
  const sparks = new Float32Array(240 * 3);
  for (let i = 0; i < 240; i++) { sparks[i * 3] = (random() - .5) * 17; sparks[i * 3 + 1] = (random() - .5) * 9; sparks[i * 3 + 2] = (random() - .5) * 10; }
  const sparkGeometry = new THREE.BufferGeometry(); sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparks, 3));
  const particles = new THREE.Points(sparkGeometry, new THREE.PointsMaterial({ color: 0xd7ff3f, size: .024, transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false })); world.add(particles);
  const shards = new THREE.Group(); world.add(shards);
  for (let i = 0; i < 12; i++) {
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(.08 + random() * .12, 0), darkMaterial);
    const a = random() * Math.PI * 2;
    rock.position.set(Math.cos(a) * (2.8 + random()), .25 + Math.sin(a) * (2.8 + random()), random() * 2 - 1);
    rock.rotation.set(random() * 4, random() * 4, 0); shards.add(rock);
  }
  const pointer = { x: 0, y: 0 }; const current = { x: 0, y: 0 };
  window.addEventListener('pointermove', e => { pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  let visible = true, off = window.portfolioMotionOff || false;
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { rootMargin: '150px' }).observe(container);
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    portal.position.x = 0;
  }
  let elapsed = 0, previous = 0, frame = 0;
  resize();
  new ResizeObserver(() => {
    resize();
    if (!frame) frame = requestAnimationFrame(render);
  }).observe(container);
  function render(time) {
    frame = requestAnimationFrame(render);
    if (!visible || document.hidden) { previous = time; return; }
    const delta = Math.min((time - previous) / 1000, .05); previous = time;
    if (!off) elapsed += delta;
    const progress = window.portfolioSceneProgress || 0;
    current.x += ((off ? 0 : pointer.x) - current.x) * .04;
    current.y += ((off ? 0 : pointer.y) - current.y) * .04;
    const mobile = innerWidth < 640;
    const startDistance = mobile ? 9 : 12;
    camera.position.set(current.x * .28 * (1 - progress), .7 - current.y * .2 * (1 - progress) - progress * .45, startDistance + (.9 - startDistance) * progress);
    camera.lookAt(0, -.05 + progress * .30, 0);
    uniforms.uTime.value = elapsed;
    segmented.rotation.z = off ? 0 : elapsed * .025;
    particles.rotation.y = off ? 0 : elapsed * .012;
    particles.position.y = off ? 0 : Math.sin(elapsed * .2) * .15;
    shards.rotation.z = off ? 0 : Math.sin(elapsed * .15) * .025;
    renderer.render(scene, camera);
    if (off) { cancelAnimationFrame(frame); frame = 0; }
  }
  window.addEventListener('portfolio:motion', e => {
    off = e.detail.off;
    if (!frame) frame = requestAnimationFrame(render);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !frame) frame = requestAnimationFrame(render); });
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(frame); frame = 0; container.classList.remove('scene-ready'); });
  renderer.domElement.addEventListener('webglcontextrestored', () => { container.classList.add('scene-ready'); frame = requestAnimationFrame(render); });
  frame = requestAnimationFrame(render);
}
