import Phaser from 'phaser';

class CreditosIniciais extends Phaser.Scene {
  constructor() {
    super('CreditosIniciais');
  }

  preload() {
    this.load.image('capa', '/assets/Creditos/capa_darkness.png');
    this.load.image('botao_play', '/assets/Creditos/play1.png');
    this.load.image('botao_instrucoes', '/assets/Creditos/instrucoes.png');
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    const capa = this.add.image(width / 2, height / 2, 'capa');
    const scaleX = width / capa.width;
    const scaleY = height / capa.height;
    const scale = Math.max(scaleX, scaleY);
    capa.setScale(scale).setDepth(-1);

    const escalaPlay = 0.25;
    const escalaInstrucoes = 0.30;
    const escalaHoverPlay = 0.28;
    const escalaHoverInstrucoes = 0.33;

    const botaoY = height - 350;
    const botaoPlay = this.add.image(width / 2, botaoY, 'botao_play')
      .setScale(escalaPlay)
      .setInteractive({ useHandCursor: true });

    const areaPlay = this.add.rectangle(width / 2, botaoY, botaoPlay.width * escalaPlay, botaoPlay.height * escalaPlay, 0x000000, 0)
      .setOrigin(0.8)
      .setInteractive({ useHandCursor: true });

    areaPlay.on('pointerdown', (pointer) => {
      if (Phaser.Geom.Rectangle.Contains(areaPlay.getBounds(), pointer.x, pointer.y)) {
        this.scene.start('Intro');
      }
    });
    areaPlay.on('pointerover', () => botaoPlay.setScale(escalaHoverPlay));
    areaPlay.on('pointerout', () => botaoPlay.setScale(escalaPlay));

    botaoPlay.on('pointerover', () => botaoPlay.setScale(escalaHoverPlay));
    botaoPlay.on('pointerout', () => botaoPlay.setScale(escalaPlay));

    const botaoInstrucoesY = botaoY + 120;
    const botaoInstrucoes = this.add.image(width / 2, botaoInstrucoesY, 'botao_instrucoes')
      .setScale(escalaInstrucoes)
      .setInteractive({ useHandCursor: true });

    const areaInstrucoes = this.add.rectangle(width / 2, botaoInstrucoesY, botaoInstrucoes.width * escalaInstrucoes, botaoInstrucoes.height * escalaInstrucoes, 0x000000, 0)
      .setOrigin(0.4)
      .setInteractive({ useHandCursor: true });

    areaInstrucoes.on('pointerdown', (pointer) => {
      if (Phaser.Geom.Rectangle.Contains(areaInstrucoes.getBounds(), pointer.x, pointer.y)) {
        console.log('Botão INSTRUÇÕES clicado (ação futura aqui)');
      }
    });
    areaInstrucoes.on('pointerover', () => botaoInstrucoes.setScale(escalaHoverInstrucoes));
    areaInstrucoes.on('pointerout', () => botaoInstrucoes.setScale(escalaInstrucoes));

    botaoInstrucoes.on('pointerover', () => botaoInstrucoes.setScale(escalaHoverInstrucoes));
    botaoInstrucoes.on('pointerout', () => botaoInstrucoes.setScale(escalaInstrucoes));
  }
}

export default CreditosIniciais;
