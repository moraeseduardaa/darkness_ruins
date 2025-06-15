import Phaser from 'phaser';
import CreditosIniciais from './scenes/creditos_iniciais.js';
import Intro from './scenes/intro.js';
import { Fase1, LojaScene } from './scenes/Fase1.js';
import Fase2 from './scenes/Fase2.js';
import Fase3 from './scenes/Fase3.js';
import Fase4 from './scenes/Fase4.js';
import creditos_finais from './scenes/creditos_finais.js';
import GameOver from './scenes/GameOver.js';
import Instrucoes from './scenes/Instrucoes.js'; // ✅ nova cena adicionada aqui

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
    Instrucoes,       // ✅ adicionada aqui também
    Fase1,
    Fase2,
    Fase3,
    Fase4,
    creditos_finais,
    LojaScene,
    Intro,
    GameOver
  ]
};

const game = new Phaser.Game(config);
