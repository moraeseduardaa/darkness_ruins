import Phaser from 'phaser';

class CreditosIniciais extends Phaser.Scene {
  constructor() {
    super('CreditosIniciais');
  }

  preload() {
    this.load.image('capa', '/assets/Creditos/capa_darkness.png');
    this.load.image('botao_play', '/assets/Creditos/play1.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    const capa = this.add.image(width / 2, height / 2, 'capa');
    const scaleX = width / capa.width;
    const scaleY = height / capa.height;
    const scale = Math.max(scaleX, scaleY);
    capa.setScale(scale).setDepth(-1);

    const botaoY = height - 250; 
    const botao = this.add.image(width / 2, botaoY, 'botao_play')
      .setScale(0.25)
      .setInteractive({ useHandCursor: true });

    botao.on('pointerdown', () => {
      this.scene.start('Fase1');
    });

    botao.on('pointerover', () => {
      botao.setScale(0.28);
    });

    botao.on('pointerout', () => {
      botao.setScale(0.25);
    });
  }
}

export default CreditosIniciais;
