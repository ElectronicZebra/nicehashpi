# nicehashpi
DIY Raspberry PI Display for Nicehash stats

Prerequisites :
1. RaspberryPi 3b+ or higher
2. RaspberryPi 3.5 inch SPI TFT LCD Display
3. SD Card 16GB or higher -- image it with Raspberry Pi OS Lite
4. Power Cable & Charger/Battery Bank
5. HDMI Cable to install pi display software
6. Keyboard

Build the Device :
1. Burn the OS in SD Card & 
2. Place the LCD dislay on GPIO Pins
3. Plug in HDMI to TV
4. Plug in Power
5. Allow to install/Expand OS.
6. Install Display driver http://www.lcdwiki.com/3.5inch_RPi_Display & Setup Screen Orientation  +180 degree
7. reboot the device , now LCD should have display.

Software & Install:
1. Get Nicehash BTCAddress, apiKey, apiSecret & orgId - https://www.nicehash.com/my/settings/keys DO NOT SHARE THIS INFORMATION WITH ANYONE
Note : please provide least required permission & enable 2factor auth if not already.
2. Install NPM and NodeJS on raspberrypi
3. clone this project to RaspberryPi /home/pi/app etc
update credentials in index.js
build project using npm install in project directory

Run
1. in project folder : node index.js
2. to start on boot follow this 
3. sudo nano /home/pi/.bashrc
4. add to last line and reboot --->
5. sudo node /home/pi/projectfolder/index.js

Njoy!!

