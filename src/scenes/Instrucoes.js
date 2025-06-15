import Phaser from 'phaser';

class Instrucoes extends Phaser.Scene {
  constructor() {
    super('Instrucoes');
  }

  preload() {
    this.load.image('controles', 'assets/Personagens/controles.png');
    this.load.image('andar', 'assets/Personagens/andar.png');
    this.load.image('space', 'assets/Personagens/space.png');
    this.load.image('teclaC', 'assets/Personagens/teclaC.png');
    this.load.image('npccontrole', 'assets/Personagens/npccontrole.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000).setDepth(-1);

    this.add.image(width / 2, height * 0.15, 'controles')
      .setScale(0.3)
      .setDepth(1)
      .setOrigin(0.5);

     this.add.image(width / 3.2, height * 0.15, 'npccontrole')
      .setScale(0.15)
      .setDepth(1)
      .setOrigin(0.5);

    this.add.image(width * 0.25, height * 0.56, 'andar')
      .setScale(0.25)
      .setDepth(1)
      .setOrigin(0.5);

    this.add.text(width * 0.25, height * 0.72,
      'Usado para movimentar o personagem',
      {
        fontFamily: 'Pixelify Sans',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.25 },
      }
    ).setOrigin(0.5).setDepth(1);

    this.add.image(width * 0.5, height * 0.54, 'space')
      .setScale(0.25)
      .setDepth(1)
      .setOrigin(0.5);

    this.add.text(width * 0.5, height * 0.72,
      'Usado para atacar\n os inimigos',
      {
        fontFamily: 'Pixelify Sans',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.25 },
      }
    ).setOrigin(0.5).setDepth(1);

    this.add.image(width * 0.75, height * 0.54, 'teclaC')
      .setScale(0.15)
      .setDepth(1)
      .setOrigin(0.5);

    this.add.text(width * 0.75, height * 0.72,
      'Pressione C para abrir/fechar a loja \nItens disponíveis: Vida, Escudo e Dano',
      {
        fontFamily: 'Pixelify Sans',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.25 },
      }
    ).setOrigin(0.5).setDepth(1);

    this.add.text(width / 2, height - 50, 'Pressione ESC para voltar ao menu', {
      fontFamily: 'Pixelify Sans',
      fontSize: '18px',
      color: '#aaaaaa',
    }).setOrigin(0.5).setDepth(1);

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('CreditosIniciais');
    });
  }
}

export default Instrucoes;
