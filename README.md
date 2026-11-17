# libsm64-super-mario-64-DX-ChromiumPort
This project is a port of Super Mario 64 to HTML, designed for Chromium and Android. The entire game fits into a single .html file: you open it in your browser, select your ROM, and start playing. There is no need for installation or a server.

Mario’s movement is not merely emulated; it uses the game’s original code, derived from a decompilation of SM64 via libsm64 and compiled into WebAssembly. The physics, animations, sound, music, and collision systems are all sourced from this original code. The levels, objects, bosses, camera systems, and menus are programmed in JavaScript, built upon that foundation, and are loaded directly from your ROM. This was an experiment to see how much of the game could run in HTML if an AI handled the implementation—and it appears to have been a success.

What’s included
The world of SM64: the castle (inside and out), the courses, the secret levels, the three Bowser stages—complete with their boss fights (grab his tail, spin him around, and toss him into the mines)—as well as the ending with Peach and the staff credits.
Playable characters:
Mario.
Luigi (L key): unlocked with 5 stars. He is a very fast swimmer, but he doesn’t jump as high and runs slightly slower.
Wario (3 key): uses his model from SM64 DS. He can jump higher than anyone else, but he is a very slow swimmer.
Yoshi (4 key): uses his model from SM64 DS. Unlocked by finding his egg at the bottom of Jolly Roger Bay.
Voices: each character features their voice lines from SM64 DS.
Character-specific levels: some levels are restricted to certain characters. Icons in the pause menu indicate which characters can enter each level.
Skins: available via the "SKINS" option in the pause menu.
Mario: Old SMG4, NES, NES + Flower, SMB3, and the arcade *Mario Bros.* version.
Luigi: NES, NES SMB, arcade version, and Waluigi.
Yoshi: red, blue, and yellow.


Online multiplayer (co-op):
You can create a public lobby, which is automatically visible to other players on the same network. Simply press "Join" to enter.
You can see other players—along with their chosen characters, skins, and animations—with their names displayed above them.
Features include a chat system, a shared star count, and a "Go to" button that allows you to travel directly to another player's location.
To play with someone on a different network, you can connect using codes.
The host can configure the lobby settings, including:
maximum number of players (from 1 to 10);
friendly fire;
competitive mode (the player with the most stars wins);
a synchronized speedrun timer for all participants.



Android: version with touch controls—joystick, A/B/Z, START, camera, character-specific buttons, and a chat feature with a "send" button.
Extras:
N. Sanity Island (from *Crash Twinsanity*) included as an Easter egg, featuring breakable crates. Accessible via the Crash icon in the ROM menu.
"SHUTUP" code for the final battle against Bowser.
Hidden level selector.
"Open doors" version, with all star doors unlocked.


Controls (PC)
Action	Keyboard	Controller
Move	WASD / Arrow keys	Left stick
Jump (A)	Space / X	A
Attack (B)	J / C	X
Crouch (Z)	K / Z / Shift	LB / LT
Pause / START	Enter	—
Camera	Q / E, drag with mouse, scroll wheel	Right stick
Luigi / Wario / Yoshi	L / 3 / 4	—
Online panel / chat	F8 / Tab	—
FPS / log	F / O	—

How to play
Download the .html file: the standard version, the "open doors" version, or the Android version.
Open it in Chrome, Edge, or any Chromium-based browser. On Android, open it using Chrome from your file manager.
Select your Super Mario 64 (USA).z64 ROM and press START.



Known limitations
The game is not 100% complete. Many enemies and objects are programmed by hand, level by level. Some platforms that should be moving remain stationary, and Tall, Tall Mountain, Rainbow Ride, and Wing Mario Over the Rainbow are not yet included.
For online play, each player must have their own ROM. Some highly restricted networks may not allow direct connections.

Credits
Super Mario 64 and Super Mario 64 DS © Nintendo. A non-profit fan project, not affiliated with Nintendo. The ROM is not distributed.
libsm64 and the SM64 decompilation project.
Models and sounds from SM64 DS: The Models Resource / The Sounds Resource.
"Mario64" font by sinnyboi (FontStruct, for non-commercial use).
N. Sanity Island: Crash Twinsanity © Activision.
Honorable mention: Claude AI & RandomPerson/MrSonic.
