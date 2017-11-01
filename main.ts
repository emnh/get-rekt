

import * as pixi from "pixi.js";

const atlasWidth = 1024;
const atlasHeight = 1024;
const tileWidth = 32;
const tileHeight = 32;

const tilesX = 100;
const tilesY = 100;
const width = tileWidth * tilesX;
const height = tileHeight * tilesY;

const renderer =
  new pixi.WebGLRenderer({
    width: width,
    height: height,
    backgroundColor: 0xFFFFFF,
    // backgroundColor: 0x0,
    antialias: true});

const parent = <HTMLDivElement> document.querySelector("#pixiContainer");
parent.appendChild(renderer.view);

const stage = new pixi.Container();

function getBuilding(id : string) {
  const baseImg = <HTMLImageElement> document.querySelector("#" + id);
  const baseTexture = pixi.Texture.from(baseImg);
  const baseSprite = new pixi.Sprite(baseTexture);
  baseSprite.scale.x = baseSprite.scale.y = 1.5;
  return baseSprite;
}

const baseImg2 = <HTMLImageElement> document.querySelector("#baseTexture2");
const baseTexture2 = pixi.Texture.from(baseImg2);
const baseSprite2 = new pixi.Sprite(baseTexture2);

const atlas = <HTMLImageElement> document.querySelector("#spritesheet");
const texture = pixi.BaseTexture.from(atlas);
const tiles : pixi.Texture[] = [];
var i = 0;
for (var y = 0; y < atlasHeight; y += tileHeight) {
  for (var x = 0; x < atlasWidth; x += tileWidth) {
    const tile = new PIXI.Texture(texture, new PIXI.Rectangle(x, y, tileWidth, tileHeight));
    tiles[i] = tile;
    i++;
  }
}

const atlas2 = <HTMLImageElement> document.querySelector("#spritesheet2");
const texture2 = pixi.BaseTexture.from(atlas2);
const tiles2 : pixi.Texture[] = [];
var i = 0;
for (var y = 0; y < atlasHeight; y += tileHeight) {
  for (var x = 0; x < atlasWidth; x += tileWidth) {
    const tile = new PIXI.Texture(texture2, new PIXI.Rectangle(x, y, tileWidth, tileHeight));
    tiles2[i] = tile;
    i++;
  }
}

// stage.addChild(new pixi.Sprite(tiles[0]));

fetch("lpc.json")
.then(function(response) {
  response.json().then(function(data) {
    // console.log("json", data);
  });
});


function addBase() {
  const baseSprite = getBuilding("baseTexture");
  stage.addChild(baseSprite);
  baseSprite.x = baseSprite.y = 600;

  const templeSprite = getBuilding("templeTexture");
  stage.addChild(templeSprite);
  templeSprite.x = templeSprite.y = 500;

  const barrackSprite = getBuilding("barrackTexture");
  stage.addChild(barrackSprite);
  barrackSprite.x = barrackSprite.y = 700;

  stage.addChild(baseSprite2);
  baseSprite2.x = 400;
  baseSprite2.y = baseSprite.x;
}

const fruitSprites : pixi.Sprite[] = [];

function addFruits() {
  return fetch("lpc2.json")
    .then(function(response) {
      const fruits : number[] = [];
      response.json().then(function(data) {
        console.log("json", data);
        for (var tpi in data.tileproperties) {
          const props = data.tileproperties[tpi];
          if (props.Category == "Food") {
            fruits.push(parseInt(tpi));
          }
        }

        const numFruits = 5000;
        for (var i = 0; i < numFruits; i++) {
          const sprite = new pixi.Sprite(tiles2[fruits[i % fruits.length]]);
          sprite.x = Math.floor(Math.random() * (width - tileWidth));
          sprite.y = Math.floor(Math.random() * (height - tileHeight));
          stage.addChild(sprite);
          fruitSprites.push(sprite);
        }
      });
    });
}

function addMap() {
  return fetch("map.json")
    .then(function(response) {
      response.json().then(function(data) {
        // console.log("json", data);

        stage.scale.x = width / (tileWidth * data.layers[0].height);
        stage.scale.y = height / (tileHeight * data.layers[0].height);

        for (var layerIndex = 0; layerIndex < data.layers.length; layerIndex++) {
          const layer = data.layers[layerIndex];
          for (var y = 0; y < layer.height; y++) {
            for (var x = 0; x < layer.height; x++) {
              const tileIndex = layer.data[y * layer.height + x];
              const sprite = new pixi.Sprite(tiles[tileIndex - 1]);
              sprite.x = x * tileWidth;
              sprite.y = y * tileHeight;
              stage.addChild(sprite);
            }
          }
        }
        console.log("done with sprites");
      });
    });
}

addMap()
  .then(addFruits)
  .then(addBase);

function getTime() {
  return new Date().getTime();
}

function draw() {
  const time = getTime();

  for (var i = 0; i < fruitSprites.length; i++) {
    fruitSprites[i].anchor.set(0.5);
    fruitSprites[i].rotation = Math.sin(time / 100.0) * 1.0;
  }

  renderer.render(stage);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
