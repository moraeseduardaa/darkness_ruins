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

    // Fundo
    const capa = this.add.image(width / 2, height / 2, 'capa');
    const scaleX = width / capa.width;
    const scaleY = height / capa.height;
    const scale = Math.max(scaleX, scaleY);
    capa.setScale(scale).setDepth(-1);

    // Escalas ajustadas
    const escalaPlay = 0.25;
    const escalaInstrucoes = 0.30;
    const escalaHoverPlay = 0.28;
    const escalaHoverInstrucoes = 0.33;

    // Botão PLAY
    const botaoY = height - 350;
    const botaoPlay = this.add.image(width / 2, botaoY, 'botao_play')
      .setScale(escalaPlay)
      .setInteractive({ useHandCursor: true });

    botaoPlay.on('pointerdown', () => {
      this.scene.start('Fase1');
    });

    botaoPlay.on('pointerover', () => botaoPlay.setScale(escalaHoverPlay));
    botaoPlay.on('pointerout', () => botaoPlay.setScale(escalaPlay));

    // Botão INSTRUÇÕES
    const botaoInstrucoesY = botaoY + 120;
    const botaoInstrucoes = this.add.image(width / 2, botaoInstrucoesY, 'botao_instrucoes')
      .setScale(escalaInstrucoes)
      .setInteractive({ useHandCursor: true });

    botaoInstrucoes.on('pointerdown', () => {
      console.log('Botão INSTRUÇÕES clicado (ação futura aqui)');
    });

    botaoInstrucoes.on('pointerover', () => botaoInstrucoes.setScale(escalaHoverInstrucoes));
    botaoInstrucoes.on('pointerout', () => botaoInstrucoes.setScale(escalaInstrucoes));
  }
}

export default CreditosIniciais;
