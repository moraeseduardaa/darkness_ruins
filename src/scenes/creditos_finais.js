import Phaser from 'phaser';

class Creditos extends Phaser.Scene {
  constructor() {
    super('Creditos');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Cor de fundo escura
    this.cameras.main.setBackgroundColor('#000000');

    // Título dos créditos
    this.add.text(width / 2, 80, 'CRÉDITOS FINAIS', {
      fontSize: '40px',
      fontFamily: 'Georgia',
      color: '#FFD700', // Dourado
    }).setOrigin(0.5).setDepth(1);

    // Texto dos créditos, centralizado e animado
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

Obrigado por jogar!
`, {
      fontSize: '22px',
      color: '#ffffff',
      align: 'center',
      fontFamily: 'Georgia',
      wordWrap: { width: width * 0.8 }
    }).setOrigin(0.5);

    // Animação de rolagem (letreiro subindo)
    this.tweens.add({
      targets: texto,
      y: -texto.height,
      duration: 20000,
      ease: 'Linear'
    });

    // Fade in inicial
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