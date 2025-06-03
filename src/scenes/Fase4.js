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

    // Ghorn
    this.ghorn = this.physics.add.sprite(largura / 2, altura / 2 - 100, 'ghorn').setScale(0.18);
    this.ghorn.vida = 100;
    this.ghorn.setImmovable(true); 
    this.ghorn.setCollideWorldBounds(true);
    this.ghorn.body.checkCollision.none = true; 
    this.ghorn.barraVida = this.add.graphics();
    this.ghorn.lastAttackTime = 0;
    this.ghorn.speed = 20; 

    // Ataque do Ghorn
    this.physics.add.overlap(this.lina, this.ghorn, () => {
      const now = this.time.now;
      if (now - this.ghorn.lastAttackTime > 1000 && (!this.lina.morta)) {
        if (!this.lina.vida) this.lina.vida = 100;
        this.lina.vida -= 25;
        this.lina.setTint(0xff0000);
        this.time.delayedCall(200, () => this.lina.clearTint());
        this.ghorn.lastAttackTime = now;
        if (this.lina.vida <= 0) {
          this.lina.morta = true;
          this.scene.restart();
        }
      }
    }, null, this);

    // Barra de vida do Ghorn
    this.ghorn.atualizarBarraVida = () => {
      const barraX = this.ghorn.x - 40;
      const barraY = this.ghorn.y - this.ghorn.displayHeight / 2 - 16;
      const larguraBarra = 80;
      const alturaBarra = 10;
      const vida = Math.max(this.ghorn.vida, 0);
      const proporcao = vida / 100;
      this.ghorn.barraVida.clear();
      this.ghorn.barraVida.fillStyle(0x000000);
      this.ghorn.barraVida.fillRect(barraX, barraY, larguraBarra, alturaBarra);
      this.ghorn.barraVida.fillStyle(0xff0000);
      this.ghorn.barraVida.fillRect(barraX + 1, barraY + 1, (larguraBarra - 2) * proporcao, alturaBarra - 2);
      this.ghorn.barraVida.setDepth(2);
    };

    // Animações da Lina
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

    // Movimento do Ghorn
    if (this.ghorn && this.lina && !this.lina.morta) {
      const distancia = Phaser.Math.Distance.Between(this.ghorn.x, this.ghorn.y, this.lina.x, this.lina.y);
      if (distancia > 5) {
        this.physics.moveToObject(this.ghorn, this.lina, this.ghorn.speed);
      } else {
        this.ghorn.setVelocity(0, 0);
      }
      this.ghorn.atualizarBarraVida();
    }

    // Ataque da Lina
    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar) && this.ghorn && !this.lina.morta) {
      const distancia = Phaser.Math.Distance.Between(this.lina.x, this.lina.y, this.ghorn.x, this.ghorn.y);
      if (distancia < 80 && this.ghorn.vida > 0) {
        this.ghorn.vida -= 5; 
        this.lina.setScale(2.2);
        this.time.delayedCall(120, () => this.lina.setScale(2));
        if (this.ghorn.vida <= 0) {
          this.ghorn.barraVida.clear();
          this.ghorn.destroy();
        }
      }
    }
  }
}

export default Fase4;
