import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  preload() {
    this.load.image('ghorn', 'assets/Personagens/ghorn.png');
    this.load.image('mapa_labirinto', 'assets/Mapas/mapa_labirinto.png');
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/andando-de-frente.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/andando-de-costas.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/andando-direita.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/andando-esquerda.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_frente', 'assets/Sprites/lina/atacando-de-frente.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_costas', 'assets/Sprites/lina/gif ataque de costas.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_direita', 'assets/Sprites/lina/atacando-direita.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_esquerda', 'assets/Sprites/lina/atacando-esquerda.gif', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_morrendo', 'assets/Sprites/lina/morrendo.gif', { frameWidth: 128, frameHeight: 128 });
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

    this.lina = this.physics.add.sprite(largura / 2, altura / 2 + 100, 'lina_frente', 0).setScale(1);
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
    this.anims.create({ key: 'ataque_frente', frames: this.anims.generateFrameNumbers('lina_ataque_frente', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'ataque_costas', frames: this.anims.generateFrameNumbers('lina_ataque_costas', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'ataque_direita', frames: this.anims.generateFrameNumbers('lina_ataque_direita', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'ataque_esquerda', frames: this.anims.generateFrameNumbers('lina_ataque_esquerda', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'lina_morrendo', frames: this.anims.generateFrameNumbers('lina_morrendo', { start: 0, end: 5 }), frameRate: 8, repeat: 0 });
  }

  update() {
    if (!this.lina) return;

    const velocidade = 200;
    let vx = 0;
    let vy = 0;
    let animacao = null;
    let direcao = this.lina.direcao || 'frente';

    if (this.teclas.cima.isDown) {
      vy = -velocidade;
      animacao = 'andar_costas';
      direcao = 'costas';
    } else if (this.teclas.baixo.isDown) {
      vy = velocidade;
      animacao = 'andar_frente';
      direcao = 'frente';
    } else if (this.teclas.direita.isDown) {
      vx = velocidade;
      animacao = 'andar_direita';
      direcao = 'direita';
    } else if (this.teclas.esquerda.isDown) {
      vx = -velocidade;
      animacao = 'andar_esquerda';
      direcao = 'esquerda';
    }
    this.lina.direcao = direcao;
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
        // Animação de ataque conforme direção
        let animAtk = 'ataque_frente';
        if (this.lina.direcao === 'costas') animAtk = 'ataque_costas';
        else if (this.lina.direcao === 'direita') animAtk = 'ataque_direita';
        else if (this.lina.direcao === 'esquerda') animAtk = 'ataque_esquerda';
        this.lina.anims.play(animAtk, true);
        this.ghorn.vida -= 5;
        this.lina.setScale(2.2);
        this.time.delayedCall(120, () => {
          this.lina.setScale(2);
        });
        if (this.ghorn.vida <= 0) {
          this.ghorn.barraVida.clear();
          this.ghorn.destroy();
        }
      }
    }

    // Morte da Lina
    if (this.lina.vida !== undefined && this.lina.vida <= 0 && !this.lina.morta) {
      this.lina.morta = true;
      this.lina.anims.play('lina_morrendo', true);
      this.lina.setVelocity(0, 0);
      this.time.delayedCall(800, () => {
        this.scene.restart();
      });
    }
  }
}

export default Fase4;
