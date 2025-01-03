# WebGL Car Soccer Game

We thought it would be cool to be able to have a multiplayer rocket leauge-like game that you can play at school. So, we made that happen. 

This game is **heavily** inspired by *rocket leauge*. Although rocket leauge itself is much more complex, this game is based on a very similar gameplay style.

Players have the ability to fully control the car using a keyboard or a game controller (tested on DualShock 3).

To make the game more interesting, cars have the ability to jump, and players can put the vehicles back on their wheels if the car falls over. Full control instructions are located in the lower left corner of the screen.

After hitting the ball into the opponent's goal, the match score changes and the points are displayed on the scoreboard at the top of the page.

## Link to the project page

[benji-pooh.github.io/carballs/](benji-pooh.github.io/carballs/)
## Technical description

The script code responsible for generating the visuals, main page, and more is in the `js/script.js` file.

### 3D objects

In the project, we used models in the `.json` format loaded by the three.js library. They were generated using Blender and exported in such a way that they could be correctly read from a text file.

Due to limited hardware capabilities, we used three-dimensional low-poly models of trees to make the gameplay as smooth as possible. The elements constituting the boundaries of the pitch were created by us manually in Blender. 

### Camera

We used a perspective camera (`PerspectiveCamera`) that follows a point between two players, and its distance changes in such a way as to show both players.

### Light

Two light sources were used in the program:

- `HemisphereLight` - responsible for the overall brightness of the entire scene
- `DirectionalLight` - adds shadows and stronger lighting from the "sun" side

### Physics

Physical elements are calculated in two ways:
- `ConvexMesh` - cars - this is quite computationally intensive
- `BoxMesh/SphereMesh` - lower (but sufficient) accuracy of the ball and board boundaries

### Technologies and libraries used

- Three.js & Physi.js libraries
- Models exported using Blender
- GameController library to support controller control via the browser Gamepad API.
- Tree models: https://blendswap.com/blend/19242
- Car models: https://free3d.com/3d-model/low-poly-car--49763.html
- Bumper models created independently in Blender

### Debug mode

After opening the page with the `?debug` parameter in the address, there are statistics of the display of frames per second, and a panel with physics settings, which can be changed during the game.

[Game page - debug mode with parameters and FPS counter](https://benji-pooh.github.io/carballs/?debug)

Debug mode allows you to change just about anything.

## Game controls

Player 1 can use a pad instead of a keyboard. The images of the keys corresponding to the DualShock (PlayStation) pads are shown.

![](docs/controls.png)

## Screenshots

### Gameplay screen
![](docs/img1.png)

### Conquering a point is signaled by a change in the color of the beam

![](docs/img2.png)

## Thanks to the original developers:

- Karol Musur
- Jacek Nitychoruk
- Unofficial fork by ben(@benpolb/benji-pooh)
