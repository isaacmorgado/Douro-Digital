import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// ── Canvas & Renderer ───────────────────────────────────────────────
const canvas = document.querySelector('.c-hero-canvas');
if (!canvas) throw new Error('hero-rain: .c-hero-canvas not found');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// ── Scene ────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const uniforms = {
  u_time:       { value: 0 },
  u_resolution: { value: new THREE.Vector2() },
  u_mouse:      { value: new THREE.Vector2(0.5, 0.5) },
};

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;

varying vec2 vUv;

// ── hash ──────────────────────────────────────────────────────────
float hash(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

// ── single rain layer ─────────────────────────────────────────────
float rainLayer(vec2 uv, float colCount, float speed, float streakLen, float brightness, float wind) {
  // wind shear
  uv.x += uv.y * wind * 0.5;

  float col   = floor(uv.x * colCount);
  float cellX = fract(uv.x * colCount);

  // per-column randoms
  float rSpeed  = 0.6 + 0.8 * hash(col * 1.17);
  float rOffset = hash(col * 3.71);
  float rLen    = 0.7 + 0.6 * hash(col * 7.13);
  float rBright = 0.5 + 0.5 * hash(col * 13.37);

  // vertical fall (inverted so streaks fall downward)
  float fall = fract(-uv.y + u_time * speed * rSpeed + rOffset);

  // streak shape: bright head + dimmer tail
  float head = smoothstep(0.0, 0.02, fall) * smoothstep(streakLen * rLen, streakLen * rLen * 0.3, fall);
  float tail = smoothstep(0.0, 0.01, fall) * smoothstep(streakLen * rLen, 0.0, fall) * 0.3;
  float streak = head + tail;

  // horizontal mask — thin centered line
  float width = 0.08 + 0.04 * hash(col * 19.91);
  float hMask = smoothstep(0.5 - width, 0.5, cellX) * smoothstep(0.5 + width, 0.5, cellX);

  return streak * hMask * brightness * rBright;
}

void main() {
  vec2 uv = vUv;
  float wind = (u_mouse.x - 0.5) * 1.5;

  // ── three layers (near / mid / far) ───────────────────────────
  float near = rainLayer(uv, 60.0,  0.4,  0.15, 1.0,  wind);
  float mid  = rainLayer(uv, 40.0,  0.25, 0.10, 0.5,  wind * 0.6);
  float far  = rainLayer(uv, 90.0,  0.15, 0.06, 0.25, wind * 0.3);

  float rain = near + mid + far;

  // ── cursor glow ────────────────────────────────────────────────
  vec2 mouseUV = u_mouse;
  mouseUV.y = 1.0 - mouseUV.y; // flip Y to match UV space
  vec2 glowDist = uv - mouseUV;
  glowDist.y *= 0.4;
  float glow = exp(-length(glowDist) * 2.0) * 0.35;

  // ── colors ─────────────────────────────────────────────────────
  vec3 bg       = vec3(0.05, 0.01, 0.01);
  vec3 rainCol  = vec3(0.6, 0.02, 0.03);
  vec3 glowCol  = vec3(0.8, 0.08, 0.05);

  float rainBoost = exp(-length(glowDist) * 1.5) * 0.8;
  vec3 color = bg + rainCol * rain * (1.0 + rainBoost) + glowCol * glow;

  // ── CCTV scanlines ────────────────────────────────────────────
  float scanline = sin(vUv.x * u_resolution.x * 0.5) * 0.5 + 0.5;
  scanline = pow(scanline, 1.5);
  color *= mix(1.0, scanline, 0.25);

  // ── flickering static bars ──────────────────────────────────────
  float staticBar = hash(floor(vUv.x * u_resolution.x * 0.25) + floor(u_time * 8.0));
  color += (staticBar - 0.5) * 0.06;

  // ── rolling bar ───────────────────────────────────────────────
  float barPos = fract(u_time * 0.04);
  float barDist = abs(fract(vUv.y - barPos) - 0.5);
  float bar = smoothstep(0.12, 0.0, barDist);
  color += color * bar * 0.06;

  // ── noise grain ───────────────────────────────────────────────
  float grain = fract(sin(dot(vUv * u_resolution + u_time, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.08;

  // ── vignette ───────────────────────────────────────────────────
  float vig = 1.0 - smoothstep(0.2, 0.9, distance(vUv, vec2(0.5)));
  color *= vig;

  // ── top / bottom fade ──────────────────────────────────────────
  float edgeFade = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
  color *= edgeFade;

  gl_FragColor = vec4(color, 1.0);
}
`;

const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

// ── Logo Scene ──────────────────────────────────────────────────────
const logoScene = new THREE.Scene();
const logoCam = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
logoCam.position.set(0, 0, 30);

// Lighting — 4 lights
const keyLight = new THREE.DirectionalLight(0xff3322, 4.0);
keyLight.position.set(5, 5, 8);
logoScene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x991111, 1.5);
fillLight.position.set(-5, 2, 5);
logoScene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xff4444, 2.0);
rimLight.position.set(0, 3, -5);
logoScene.add(rimLight);

logoScene.add(new THREE.AmbientLight(0x441111, 0.8));

const frontLight = new THREE.DirectionalLight(0xff2200, 0.8);
frontLight.position.set(0, 0, 10);
logoScene.add(frontLight);

// Procedural environment map — dark studio with colored point lights
const pmremGen = new THREE.PMREMGenerator(renderer);
pmremGen.compileEquirectangularShader();
const envScene = new THREE.Scene();
envScene.background = new THREE.Color(0x0a0a0a);
const envLight1 = new THREE.PointLight(0xff2200, 150, 50);
envLight1.position.set(5, 5, 5);
envScene.add(envLight1);
const envLight2 = new THREE.PointLight(0xff1100, 150, 50);
envLight2.position.set(-5, -2, 3);
envScene.add(envLight2);
const envMap = pmremGen.fromScene(envScene, 0.04).texture;
pmremGen.dispose();
envScene.clear();

// Gunmetal material
const gunmetalMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x3a3a40),
  metalness: 0.95,
  roughness: 0.3,
  clearcoat: 0.3,
  clearcoatRoughness: 0.4,
  envMap,
  envMapIntensity: 2.0,
});

// Grunge metal texture — scratched/worn surface detail
const texLoader = new THREE.TextureLoader();
const grungeTex = texLoader.load('../images/grunge-metal.jpg');
grungeTex.wrapS = grungeTex.wrapT = THREE.RepeatWrapping;
gunmetalMat.bumpMap = grungeTex;
gunmetalMat.bumpScale = 0.6;
gunmetalMat.roughnessMap = grungeTex;

// Inject spatial noise into roughness for spotted/dirty look
gunmetalMat.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <roughnessmap_fragment>',
    /* glsl */ `
    #include <roughnessmap_fragment>
    // spotted roughness variation
    vec3 noisePos = vViewPosition * 5.0;
    float n = fract(sin(dot(noisePos.xy, vec2(12.9898, 78.233))) * 43758.5453);
    n += fract(sin(dot(noisePos.yz, vec2(39.346, 11.135))) * 22578.1459);
    n = (n - 1.0) * 0.15;
    roughnessFactor = clamp(roughnessFactor + n, 0.0, 1.0);
    `
  );
};

// OBJ loading
let logoMesh = null;
new OBJLoader().load('../models/logo.obj', (obj) => {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = gunmetalMat;
    }
  });

  // Center geometry via bounding box
  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  obj.position.sub(center);

  // Scale to ~40% viewport width at fov=35, z=30
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const targetSize = 2 * 30 * Math.tan(THREE.MathUtils.degToRad(35 / 2)) * 0.55;
  const s = targetSize / maxDim;
  obj.scale.setScalar(s);

  logoScene.add(obj);
  logoMesh = obj;
});

// Logo tilt state
const logoRot = { x: 0, y: 0 };

// ── Mouse / Touch ────────────────────────────────────────────────────
const rawMouse  = { x: 0.5, y: 0.5 };
const smoothMouse = { x: 0.5, y: 0.5 };
const parentEl = canvas.parentElement;

function onPointer(px, py) {
  const rect = canvas.getBoundingClientRect();
  rawMouse.x = (px - rect.left) / rect.width;
  rawMouse.y = (py - rect.top) / rect.height;
}

function isOverCanvas(px, py) {
  const rect = canvas.getBoundingClientRect();
  return px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
}

document.addEventListener('mousemove', (e) => {
  if (isOverCanvas(e.clientX, e.clientY)) {
    onPointer(e.clientX, e.clientY);
  } else {
    rawMouse.x = 0.5; rawMouse.y = 0.5;
  }
});

document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  if (isOverCanvas(t.clientX, t.clientY)) {
    onPointer(t.clientX, t.clientY);
  }
}, { passive: true });

document.addEventListener('touchend', () => { rawMouse.x = 0.5; rawMouse.y = 0.5; });

function updateMouse() {
  smoothMouse.x += (rawMouse.x - smoothMouse.x) * 0.08;
  smoothMouse.y += (rawMouse.y - smoothMouse.y) * 0.08;
  uniforms.u_mouse.value.set(smoothMouse.x, smoothMouse.y);
}

// ── Resize ───────────────────────────────────────────────────────────
function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== w || canvas.height !== h) {
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(w, h);
    logoCam.aspect = w / h;
    logoCam.updateProjectionMatrix();
  }
}

if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(resize).observe(parentEl);
}

// ── Animation Loop ───────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // skip when hero scrolled out of view
  if (window.scrollY > window.innerHeight * 1.2) return;

  resize();
  updateMouse();
  const t = clock.getElapsedTime();
  uniforms.u_time.value = t;

  // Pass 1: rain (ortho)
  renderer.clear();
  renderer.render(scene, camera);

  // Pass 2: logo on top (perspective) — clear depth only, keep rain pixels
  renderer.clearDepth();
  if (logoMesh) {
    const targetY = (smoothMouse.x - 0.5) * (Math.PI * 13 / 90);  // ±13°
    const targetX = (smoothMouse.y - 0.5) * (Math.PI * 6 / 90);   // ±6°
    logoRot.y += (targetY - logoRot.y) * 0.04;
    logoRot.x += (targetX - logoRot.x) * 0.04;
    logoMesh.rotation.y = logoRot.y;
    logoMesh.rotation.x = logoRot.x;
    logoMesh.position.y = Math.sin(t * 0.5) * 0.15;
  }
  renderer.render(logoScene, logoCam);
}

resize();
animate();
