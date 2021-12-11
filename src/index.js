import Phaser from 'phaser'; 
import PlayScene from './scenes/playScene';
import MenuScene from './scenes/menuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/pauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POOSITION = {x:WIDTH/10,y:HEIGHT/2};
const shared_config = {
    width:WIDTH,
    height:HEIGHT,
    startPosition:BIRD_POOSITION
}

const Scenes = [PreloadScene , MenuScene,ScoreScene , PlayScene,PauseScene];
const initScenes = () => Scenes.map(Scene =>new Scene(shared_config));

const config = {
    type:Phaser.AUTO,//wgl = web graphic library
    ...shared_config,
    pixelArt:true,
    physics:{
        default:'arcade',
        arcade:{
            debug : true
        }
    },
    scene:initScenes()
}
    new Phaser.Game(config);