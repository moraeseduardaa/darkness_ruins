import Phaser from 'phaser';
import CreditosIniciais from './scenes/creditos_iniciais.js';
import Fase1 from './scenes/Fase1.js';
import Fase2 from './scenes/Fase2.js';
import Fase3 from './scenes/Fase3.js';
import Fase4 from './scenes/Fase4.js';
import creditos_finais from './scenes/creditos_finais.js';
import GameOver from './scenes/GameOver.js'; // ✅ importa a cena Game Over

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
  scene: [
    CreditosIniciais,
    Fase1,
    Fase2,
    Fase3,
    Fase4,
    creditos_finais,
    GameOver // ✅ adiciona a cena aqui
  ]
};

const game = new Phaser.Game(config);
