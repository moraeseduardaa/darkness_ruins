import Phaser from 'phaser';

class CreditosIniciais extends Phaser.Scene {
  constructor() {
    super('CreditosIniciais');
  }

  preload() {
    this.load.image('capa', '/assets/Creditos/capa_darkness.png');
    this.load.image('botao_play', '/assets/Creditos/play1.png');
    this.load.image('botao_instrucoes', '/assets/Creditos/instrucoes.png');
    this.load.audio('musica_entrada', 'assets/audio/musica_entrada.mp3');

  }

  create() {
  if (!this.sound.get('musica_entrada')) {
  const musica = this.sound.add('musica_entrada', { loop: true, volume: 0.07 });
  musica.play();
}
    const { width, height } = this.sys.game.canvas;

    const capa = this.add.image(width / 2, height / 2, 'capa');
    const scale = Math.max(width / capa.width, height / capa.height);
    capa.setScale(scale).setDepth(-1);

    const escalaNormal = 0.25;
    const escalaHover = 0.28;
    const espacamento = 130;
    const botaoPlayY = height - 300;
    const botaoInstrucoesY = botaoPlayY + espacamento;

    const botaoPlay = this.add.image(width / 2, botaoPlayY, 'botao_play').setScale(escalaNormal);

    const larguraPlay = botaoPlay.width * escalaNormal;
    const alturaPlay = botaoPlay.height * escalaNormal;

    const areaPlay = this.add.zone(width / 2, botaoPlayY, larguraPlay, alturaPlay)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    areaPlay.on('pointerdown', () => {
    this.scene.start('Intro');
    });
    areaPlay.on('pointerover', () => botaoPlay.setScale(escalaHover));
    areaPlay.on('pointerout', () => botaoPlay.setScale(escalaNormal));
       
    const botaoInstrucoes = this.add.image(width / 2, botaoInstrucoesY, 'botao_instrucoes').setScale(escalaNormal);

    const larguraInstrucoes = botaoInstrucoes.width * escalaNormal;
    const alturaInstrucoes = botaoInstrucoes.height * escalaNormal;

    const areaInstrucoes = this.add.zone(width / 2, botaoInstrucoesY, larguraInstrucoes, alturaInstrucoes)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    areaInstrucoes.on('pointerdown', () => this.scene.start('Instrucoes'));
    areaInstrucoes.on('pointerover', () => botaoInstrucoes.setScale(escalaHover));
    areaInstrucoes.on('pointerout', () => botaoInstrucoes.setScale(escalaNormal));
  }
}

export default CreditosIniciais;
