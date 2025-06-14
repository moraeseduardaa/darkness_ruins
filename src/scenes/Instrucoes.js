import Phaser from 'phaser';

class Instrucoes extends Phaser.Scene {
  constructor() {
    super('Instrucoes');
  }

  preload() {
    this.load.image('npc_inicio', 'assets/Personagens/npc_inicio.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setDepth(-1);

    this.add.image(width / 2, height / 2 - 100, 'npc_inicio')
      .setScale(0.18)
      .setDepth(1);

    this.add.text(width / 2, height / 2 + 90,
      'Olá, Lina!\nUse W, A, S, D para se mover e SPACE para atacar.\nDurante a partida, pressione C para abrir a loja.\nPara fechar a loja, aperte C novamente ou compre algo.',
      {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width * 0.85 },
      }
    ).setOrigin(0.5).setDepth(1);

    this.add.text(width / 2, height - 60, 'Pressione ESC para voltar ao menu', {
      fontSize: '18px',
      color: '#aaaaaa',
    }).setOrigin(0.5).setDepth(1);

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('CreditosIniciais');
    });
  }
}

export default Instrucoes;
