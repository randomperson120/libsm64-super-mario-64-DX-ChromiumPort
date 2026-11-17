# libsm64-super-mario-64-DX-ChromiumPort
This project is a port of Super Mario 64 to HTML, designed for Chromium and Android. The entire game fits into a single .html file: you open it in your browser, select your ROM, and start playing. There is no need for installation or a server.

Mario’s movement is not merely emulated; it uses the game’s original code, derived from a decompilation of SM64 via libsm64 and compiled into WebAssembly. The physics, animations, sound, music, and collision systems are all sourced from this code. The levels, objects, bosses, camera systems, and menus are implemented in JavaScript, built upon that foundation and loaded directly from your ROM.
