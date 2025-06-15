import Phaser from 'phaser';

class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    this.load.image('gameover_reiniciar', '/assets/Creditos/gameover_reiniciar.png'); 
    this.load.audio('musica_gameover', 'assets/audio/musica_gameover.mp3');

  }

  create() {
    const { width, height } = this.sys.game.canvas;

    
    this.cameras.main.setBackgroundColor('#000000');

    const imagem = this.add.image(width / 2, height / 2, 'gameover_reiniciar');
    imagem.setOrigin(0.5).setScale(0.7);


    const botao = this.add.rectangle(width / 2, height / 2 + 155, 380, 90, 0x000000, 0).setInteractive();

    botao.on('pointerdown', () => {
      this.scene.start('Fase1'); 
    });

    botao.on('pointerover', () => {
      botao.setFillStyle(0xffffff, 0.05); 
    });

    botao.on('pointerout', () => {
      botao.setFillStyle(0x000000, 0);
    });

    this.sound.add('musica_gameover', { loop: false, volume: 0.6 }).play();

  }
}

export default GameOver;
