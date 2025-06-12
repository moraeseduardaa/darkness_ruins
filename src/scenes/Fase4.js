import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  preload() {
    this.load.image('ghorn', 'assets/Personagens/ghorn.png');
    this.load.image('mapa_labirinto', 'assets/Mapas/fase4a.png');
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');

    // Movimentação
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/lina andando de frente-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/lina andando costas-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/lina andando direita-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/lina andando esquerda-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });

    // Ataques e morte
    this.load.spritesheet('lina_ataque_frente', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-de-frente.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_costas', 'assets/Sprites/lina/atacando/sprite-sheet-atacando-de-costas.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_direita', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-direita.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_esquerda', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-esquerda.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_morrendo', 'assets/Sprites/lina/morrendo/sprite-sheet-morrendo.png', { frameWidth: 128, frameHeight: 128 });
  }

  create() {
    document.body.style.overflow = 'hidden';

    const largura = 1920;
    const altura = 1920;

    this.add.image(0, 0, 'mapa_labirinto')
      .setOrigin(0)
      .setDepth(-2)
      .setDisplaySize(largura, altura);

    this.physics.world.setBounds(0, 0, largura, altura);
    this.cameras.main.setBounds(0, 0, largura, altura);

    const fundoEscuro = this.add.rectangle(960, 960, largura, altura, 0x000000, 0.8).setDepth(2);
    const imagemIntro = this.add.image(960, 910, 'ghorn').setScale(0.25).setDepth(3);
    const textoIntro = this.add.text(960, 1050, 'Derrote Ghorn e salve a ilha!', {
      fontSize: '24px', color: '#ff4444', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(3);

    this.time.delayedCall(4000, () => {
      fundoEscuro.destroy();
      imagemIntro.destroy();
      textoIntro.destroy();
      this.iniciarFase();
    });

    this.teclas = this.input.keyboard.addKeys({
      cima: 'W', baixo: 'S', esquerda: 'A', direita: 'D', atacar: 'SPACE'
    });
  }

  iniciarFase() {
    this.lina = this.physics.add.sprite(960, 1060, 'lina_frente', 0).setScale(2);
    this.lina.setCollideWorldBounds(true);
    this.lina.vida = 100;
    this.lina.morta = false;
    this.direcaoLina = 'frente';
    this.estaAtacando = false;

    this.cameras.main.startFollow(this.lina);

    this.ghorn = this.physics.add.sprite(960, 760, 'ghorn').setScale(0.18);
    this.ghorn.vida = 100;
    this.ghorn.setCollideWorldBounds(true);
    this.ghorn.setImmovable(true);
    this.ghorn.barraVida = this.add.graphics();
    this.ghorn.lastAttackTime = 0;
    this.ghorn.speed = 20;

    this.physics.add.overlap(this.lina, this.ghorn, () => {
      const now = this.time.now;
      if (now - this.ghorn.lastAttackTime > 1000 && !this.lina.morta) {
        this.lina.vida -= 25;
        this.lina.setTint(0xff0000);
        this.time.delayedCall(200, () => this.lina.clearTint());
        this.ghorn.lastAttackTime = now;

        if (this.lina.vida <= 0 && !this.lina.morta) {
          this.lina.morta = true;
          this.lina.anims.play('lina_morrendo', true);
          this.lina.once('animationcomplete', () => {
            this.scene.restart();
          });
        }
      }
    });

    this.ghorn.atualizarBarraVida = () => {
      const barraX = this.ghorn.x - 40;
      const barraY = this.ghorn.y - this.ghorn.displayHeight / 2 - 16;
      const vida = Math.max(this.ghorn.vida, 0);
      const proporcao = vida / 100;

      this.ghorn.barraVida.clear();
      this.ghorn.barraVida.fillStyle(0x000000);
      this.ghorn.barraVida.fillRect(barraX, barraY, 80, 10);
      this.ghorn.barraVida.fillStyle(0xff0000);
      this.ghorn.barraVida.fillRect(barraX + 1, barraY + 1, 78 * proporcao, 8);
      this.ghorn.barraVida.setDepth(2);
    };

    // Animações
    this.anims.create({ key: 'andar_frente', frames: this.anims.generateFrameNumbers('lina_frente', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_costas', frames: this.anims.generateFrameNumbers('lina_costas', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_direita', frames: this.anims.generateFrameNumbers('lina_direita', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_esquerda', frames: this.anims.generateFrameNumbers('lina_esquerda', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });

    this.anims.create({ key: 'ataque_frente', frames: this.anims.generateFrameNumbers('lina_ataque_frente', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_costas', frames: this.anims.generateFrameNumbers('lina_ataque_costas', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_direita', frames: this.anims.generateFrameNumbers('lina_ataque_direita', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_esquerda', frames: this.anims.generateFrameNumbers('lina_ataque_esquerda', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'lina_morrendo', frames: this.anims.generateFrameNumbers('lina_morrendo', { start: 0, end: 7 }), frameRate: 8 });

    // Corações
    this.coracoes = [];
    for (let i = 0; i < 5; i++) {
      const coracao = this.add.image(0.5 + i * 45, 0.5, 'coracoes')
        .setScale(0.06)
        .setScrollFactor(0)
        .setDepth(2)
        .setOrigin(0, 0);
      this.coracoes.push(coracao);
    }
  }

  update() {
    if (!this.lina || !this.teclas || this.lina.morta) return;
  
    const speed = 200;
    const { cima, baixo, esquerda, direita, atacar } = this.teclas;
    let moving = false;
    this.lina.body.setVelocity(0);
    let vx = 0;
    let vy = 0;

    if (cima.isDown) {
      vy = -speed;
      this.lina.anims.play('andar_costas', true);
      moving = true;
      this.direcaoLina = 'costas';
    } else if (baixo.isDown) {
      vy = speed;
      this.lina.anims.play('andar_frente', true);
      moving = true;
      this.direcaoLina = 'frente';
    } else if (direita.isDown) {
      vx = speed;
      this.lina.anims.play('andar_direita', true);
      moving = true;
      this.direcaoLina = 'direita';
    } else if (esquerda.isDown) {
      vx = -speed;
      this.lina.anims.play('andar_esquerda', true);
      moving = true;
      this.direcaoLina = 'esquerda';
    }

    this.lina.body.setVelocity(vx, vy);
    if (!moving) this.lina.anims.stop();

    if (Phaser.Input.Keyboard.JustDown(atacar)) {
      let anim = 'ataque_frente';
      let vx = 0;
      let vy = 0;
      if (this.direcaoLina === 'direita') {
        anim = 'ataque_direita';
        vx = speed;
      } else if (this.direcaoLina === 'esquerda') {
        anim = 'ataque_esquerda';
        vx = -speed;
      } else if (this.direcaoLina === 'costas') {
        anim = 'ataque_costas';
        vy = -speed;
      } else if (this.direcaoLina === 'frente') {
        anim = 'ataque_frente';
        vy = speed;
      }
      this.lina.setTexture('lina_' + anim);
      this.lina.anims.play(anim, true);
      this.lina.setScale(0.8);
      this.lina.body.setVelocity(vx, vy);
      this.time.delayedCall(400, () => {
        this.lina.anims.stop();
        this.lina.setScale(0.8);
        this.lina.body.setVelocity(0, 0);
        this.lina.setTexture('lina_frente');
      });
      this.estaAtacando = true;
      this.time.delayedCall(300, () => {
        this.estaAtacando = false;
      });

      const distancia = Phaser.Math.Distance.Between(this.lina.x, this.lina.y, this.ghorn.x, this.ghorn.y);
      if (distancia < 80 && this.ghorn.vida > 0) {
        this.ghorn.vida -= 5;
        if (this.ghorn.vida <= 0) {
          this.ghorn.barraVida.clear();
          this.ghorn.destroy();
        }
      }

      this.time.delayedCall(400, () => {
        this.estaAtacando = false;
        this.lina.setTexture('lina_frente');
      });
    }

    // Atualiza corações da Lina
    const coracoesVisiveis = Math.ceil(this.lina.vida / 20);
    this.coracoes.forEach((c, i) => {
      c.setVisible(i < coracoesVisiveis);
    });
  }
}

export default Fase4;
