import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  preload() {
    this.load.image('lina', 'assets/Personagens/lina.png');
    this.load.image('ghorn', 'assets/Personagens/ghorn.png');
    this.load.image('mapa_labirinto', 'assets/Mapas/mapa_labirinto.png');
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/lina andando de frente-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/lina andando costas-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/lina andando direita-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/lina andando esquerda-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    document.body.style.overflow = 'hidden';
    this.scale.resize(window.innerWidth, window.innerHeight);
    const largura = this.sys.game.canvas.width;
    const altura = this.sys.game.canvas.height;

    this.fundo = this.add.image(largura / 2, altura / 2, 'mapa_labirinto').setDepth(-2);
    this.fundo.setDisplaySize(largura, altura);

    const fundoEscuro = this.add.rectangle(largura / 2, altura / 2, largura, altura, 0x000000, 0.8);
    fundoEscuro.setDepth(-1);

    const imagemIntro = this.add.image(largura / 2, altura / 2 - 50, 'ghorn');
    imagemIntro.setScale(0.25);
    imagemIntro.setDepth(0);

    const textoIntro = this.add.text(largura / 2, altura / 2 + 100, 'Derrote Ghorn e salve a ilha!', {
      fontSize: '24px',
      color: '#ff4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    textoIntro.setDepth(0);

    this.time.delayedCall(3000, () => {
      fundoEscuro.destroy();
      imagemIntro.destroy();
      textoIntro.destroy();
      this.iniciarFase();
    });

    this.teclas = this.input.keyboard.addKeys({
      cima: 'W',
      baixo: 'S',
      esquerda: 'A',
      direita: 'D',
      atacar: 'SPACE'
    });

    window.addEventListener('resize', () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      const novaLargura = this.sys.game.canvas.width;
      const novaAltura = this.sys.game.canvas.height;
      this.fundo.setDisplaySize(novaLargura, novaAltura);
    });
  }

  iniciarFase() {
    const largura = this.sys.game.canvas.width;
    const altura = this.sys.game.canvas.height;

    this.lina = this.physics.add.sprite(largura / 2, altura / 2 + 100, 'lina_frente', 0).setScale(2);
    this.lina.setCollideWorldBounds(true);

    this.anims.create({ key: 'andar_frente', frames: this.anims.generateFrameNumbers('lina_frente', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_costas', frames: this.anims.generateFrameNumbers('lina_costas', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_direita', frames: this.anims.generateFrameNumbers('lina_direita', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_esquerda', frames: this.anims.generateFrameNumbers('lina_esquerda', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
  }

  update() {
    if (!this.lina) return;

    const velocidade = 200;
    let vx = 0;
    let vy = 0;
    let animacao = null;

    if (this.teclas.cima.isDown) {
      vy = -velocidade;
      animacao = 'andar_costas';
    } else if (this.teclas.baixo.isDown) {
      vy = velocidade;
      animacao = 'andar_frente';
    } else if (this.teclas.direita.isDown) {
      vx = velocidade;
      animacao = 'andar_direita';
    } else if (this.teclas.esquerda.isDown) {
      vx = -velocidade;
      animacao = 'andar_esquerda';
    }

    this.lina.setVelocity(vx, vy);

    if (animacao) {
      this.lina.anims.play(animacao, true);
    } else {
      this.lina.anims.stop();
    }
  }
}

export default Fase4;
