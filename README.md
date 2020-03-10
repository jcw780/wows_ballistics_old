# World of Warships Ballistics Calculator
### Link
https://jcw780.github.io/wows_ballistics/
## Code Information
### Languages
- HTML, CSS, JS
### Backend Source
- Wasm backend: https://github.com/jcw780/ShellCPP
## Functionality
### Calculate shell performance at impact and in flight
- Belt/Deck penetration - Belt/Deck Impact Angle - Impact Velocity - Flight Time
- Includes all shell types (AP, HE, SAP)
### Calculate Critical Angles
- Maximum angle for penetration - Minimum angle for fusing - Lateral ricochet angles
### Calculate AP performance post penetration
- Shell detonation distance after penetration - Checking whether the armor is thick enough to arm the shell
## Development Status
- Currently still recently released so expect changes 
- Calculations may be refined if contradicting data is provided
### Possible Future Features
- Directly download graphs without browser extension
- Raw data
### Updates
#### 3/9/2020 [f6399ca](https://github.com/jcw780/wows_ballistics/commit/f6399ca4cf2d605ad5e167da2cae0f6d6a1003f9)
- Improved collapsibles 
- Improved color scheme
- Added Chart settings
- Changed site name and link - redirect added for origin link
#### 3/6/2020 
- Improved formatting
- Added support for different shell types [374e9e4](https://github.com/jcw780/wows_ballistics/commit/f3b819676b6698b9bd6ca26e0ecfb33a83a8653d)
- Added Chart Titles [8c95e1e](https://github.com/jcw780/wows_ballistics/commit/63d331c73d632a57886f0d828cc022f8002bc93e)
- Various internal refactors
#### 3/2/2020 [b710e99](https://github.com/jcw780/wows_ballistics/commit/4becb9de0ebf969d60625ef05ffff83192d1ae82)
- Added version 0.9.1.1 shells
#### 2/29/2020
- Added critical lateral angle graphs
#### 1/15/2020 
- Fixed bug with penetration calculations, Fixed bug where buttons won't work on iOS
#### 1/13/2020 
- Added custom graph labels
#### 1/9/2020 
- First Release 

