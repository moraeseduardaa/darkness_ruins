import Phaser from 'phaser';

class Creditos extends Phaser.Scene {
  constructor() {
    super('Creditos');
  }

  preload() {
    this.load.image('creditos_final', 'assets/Creditos/creditos_finais.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    const fundo = this.add.image(width / 2, height / 2, 'creditos_final');
    fundo.setScale(Math.max(width / fundo.width, height / fundo.height)).setDepth(-1);

    // Texto dos créditos
    const texto = this.add.text(width / 2, height + 100, `
Parabéns, herói(a)!
Você salvou a ilha da escuridão eterna!

Este jogo foi criado com coragem, café e criatividade por:

Eduarda Pereira de Moraes
Gabrielly Rossi Araujo
Johan Gabriel da Silva dos Santos
Jose Armando Ventura
Mariana Moreira Lima
Pietra Rolim Mendes
`, {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      fontFamily: 'Georgia, serif',
      wordWrap: { width: width * 0.8 }
    }).setOrigin(0.5);

    // Animação
    this.tweens.add({
      targets: texto,
      y: -300,
      duration: 15000,
      ease: 'Linear'
    });

    // Fade in suave no texto
    texto.alpha = 0;
    this.tweens.add({
      targets: texto,
      alpha: 1,
      duration: 3000,
      ease: 'Power2'
    });
  }
}

export default Creditos;