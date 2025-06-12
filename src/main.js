// Phaser + Vue integration point
import Phaser from 'phaser';
import Historia from './scenes/historia.js';  
import Fase1 from './scenes/Fase1.js';
import Fase2 from './scenes/Fase2.js';
import Fase3 from './scenes/Fase3.js';
import Fase4 from './scenes/Fase4.js';
import Creditos from './scenes/Creditos.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'app',
  backgroundColor: '#000000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [Historia, Fase1, Fase2, Fase3, Fase4, Creditos] // <-- Agora inicia na Historia
};

const game = new Phaser.Game(config);


