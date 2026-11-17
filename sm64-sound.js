// sm64-sound.js — cómo carga el port el sm64.wasm (libsm64 compilada a WebAssembly)
// y cómo recibe los sonidos de Mario para poder cambiar sus voces (Luigi, Wario, Yoshi).
//
// Es el mismo código que va dentro del HTML del port, sacado a un módulo aparte.
//
//   import { loadSm64 } from './sm64-sound.js';
//   const sm64 = await loadSm64('sm64.wasm', {
//     onLog: text => console.log('[libsm64]', text),
//     onSound: (bits, pos) => { ... },     // cada sonido que pide libsm64 (ver abajo)
//   });
//   sm64.E.sm64_global_init(romPtr, texturePtr);   // las funciones de libsm64 están en sm64.E

const decoder = new TextDecoder();

/**
 * Carga el sm64.wasm y conecta las tres funciones que pide en `env`:
 *  - js_log(ptr, len):        texto de registro de libsm64 (UTF-8 en la memoria del wasm)
 *  - js_play_sound(bits, pos): cada petición de sonido. `bits` es el SOUND_ARG de SM64 y
 *                              `pos` un puntero a 3 floats (posición del sonido)
 *  - js_abort():              libsm64 abortó
 * Después llama a sm64js_register_sound_callback(): sin esa llamada el wasm no avisa de los sonidos.
 *
 * @param {string|ArrayBuffer|Uint8Array} wasm  URL del .wasm o sus bytes
 * @param {{onLog?: (text: string) => void, onSound?: (bits: number, pos: number) => void}} hooks
 */
export async function loadSm64(wasm, hooks = {}) {
  const bytes = typeof wasm === 'string' ? await (await fetch(wasm)).arrayBuffer() : wasm;
  let mem = null;
  const { instance } = await WebAssembly.instantiate(bytes, {
    env: {
      js_log: (p, l) => { if (hooks.onLog) hooks.onLog(decoder.decode(new Uint8Array(mem.buffer, p, l)).replace(/\n$/, '')); },
      js_play_sound: (bits, pos) => { if (hooks.onSound) hooks.onSound(bits >>> 0, pos); },
      js_abort: () => { throw new Error('libsm64 abort'); },
    },
  });
  const E = instance.exports;
  mem = E.memory;
  try { E.sm64js_register_sound_callback(); } catch (e) { /* un wasm sin esta función no avisa de los sonidos */ }
  const sm64 = { E, get memory() { return E.memory; } };
  sm64.cancelSound = (bits, pos) => cancelSoundRequest(sm64, bits, pos);
  return sm64;
}

/**
 * Separa un SOUND_ARG de SM64 en sus campos:
 * bits = banco << 28 | playFlags << 24 | id << 16 | prioridad << 8 | flags2 << 4 | 1   (audio_defines.h de libsm64)
 * El banco 2 son las voces de Mario.
 */
export function soundFields(bits) {
  return { bank: (bits >>> 28) & 0xF, playFlags: (bits >>> 24) & 0xF, id: (bits >>> 16) & 0xFF, priority: (bits >>> 8) & 0xFF, flags2: (bits >>> 4) & 0xF };
}

/** Construye un SOUND_ARG (por ejemplo, para sm64_play_sound_global). */
export const SND = (bank, playFlags, id, priority, flags2) => ((bank << 28) | (playFlags << 24) | (id << 16) | (priority << 8) | (flags2 << 4) | 1) >>> 0;

// ---- anular un sonido de libsm64 (para poner otra voz en su lugar)
// Cuando llega js_play_sound, la petición (bits, pos) ya está en la cola de sonidos de libsm64 (sSoundRequests).
// Se busca ese par de enteros en la memoria del wasm y se le pone id 0xFF: libsm64 descarta los ids que no existen en el banco.
// La primera vez se recorre toda la memoria; después solo alrededor de donde se encontró.
const cancelState = new WeakMap();
export function cancelSoundRequest(sm64, bits, pos) {
  const st = cancelState.get(sm64) || { addr: -1, fails: 0, noScan: false };
  cancelState.set(sm64, st);
  const u = new Uint32Array(sm64.memory.buffer);
  const find = (a, b) => { for (let i = a; i < b - 1; i++) if (u[i] === bits && u[i + 1] === pos) return i; return -1; };
  let i = -1;
  if (st.addr >= 0) i = find(Math.max(0, st.addr - 1024), Math.min(u.length, st.addr + 1024));
  if (i < 0 && !st.noScan) {
    i = find(0, u.length);
    if (i >= 0) st.addr = i;
    else if (++st.fails > 3) st.noScan = true;      // no se encuentra la cola: se deja de buscar (suena la voz original)
  }
  if (i < 0) return false;
  u[i] = ((bits & 0xF000FFFF) | (0xFF << 16)) >>> 0;
  return true;
}

// ---- ejemplo: cambiar las voces de Mario por las de otro personaje
// voices: { idDeVozDeMario: AudioBuffer }, por ejemplo { 0x04: yahooDeLuigi }
export function voiceSwapper(sm64, audioCtx, voices, { gain = 0.9 } = {}) {
  let current = null;
  return (bits, pos) => {
    const f = soundFields(bits);
    if (f.bank !== 2) return;                         // solo voces
    const buf = voices[f.id];
    if (!buf || audioCtx.state !== 'running') return;  // sin muestra: suena la voz de Mario
    if (!cancelSoundRequest(sm64, bits, pos)) return;
    try { if (current) current.stop(); } catch (e) {}
    const s = audioCtx.createBufferSource(), g = audioCtx.createGain();
    g.gain.value = gain; s.buffer = buf; s.connect(g); g.connect(audioCtx.destination); s.start();
    current = s;
  };
}
