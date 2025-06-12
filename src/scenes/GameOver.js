import Phaser from 'phaser';

class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    this.load.image('gameover_reiniciar', '/assets/Creditos/gameover_reiniciar.png'); // imagem com fundo preto e botão
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Fundo preto
    this.cameras.main.setBackgroundColor('#000000');

    // Centraliza a imagem de "Game Over" com botão reiniciar
    const imagem = this.add.image(width / 2, height / 2, 'gameover_reiniciar');
    imagem.setOrigin(0.5).setScale(0.7);

    // Área clicável para reiniciar — agora cobre todo o botão
    const botao = this.add.rectangle(width / 2, height / 2 + 155, 380, 90, 0x000000, 0).setInteractive();

    botao.on('pointerdown', () => {
      this.scene.start('CreditosIniciais'); // volta pro menu
    });

    botao.on('pointerover', () => {
      botao.setFillStyle(0xffffff, 0.05); // leve destaque (opcional)
    });

    botao.on('pointerout', () => {
      botao.setFillStyle(0x000000, 0);
    });
  }
}

export default GameOver;
