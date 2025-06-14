import Phaser from 'phaser';

class Creditos extends Phaser.Scene {
  constructor() {
    super('creditos_finais');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    this.cameras.main.setBackgroundColor('#000000');

    const texto = this.add.text(width / 2, height + 100, `
Parabéns, herói(a)!
Você salvou a ilha da escuridão eterna!

Este jogo foi criado com coragem, café e criatividade por:

Eduarda Pereira de Moraes  
Gabrielly Rossi Araujo  
Johan Gabriel da Silva dos Santos  
Mariana Moreira Lima  
Pietra Rolim Mendes

Obrigado por jogar!

Especial agradecimento ao professor Hugo Fumero,  
pela orientação e inspiração ao longo do projeto.
`, {
      fontSize: '22px',
      color: '#ffffff',
      align: 'center',
      fontFamily: 'Georgia',
      wordWrap: { width: width * 0.8 }
    }).setOrigin(0.5);

    this.tweens.add({
      targets: texto,
      y: -texto.height,
      duration: 20000,
      ease: 'Linear'
    });

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
