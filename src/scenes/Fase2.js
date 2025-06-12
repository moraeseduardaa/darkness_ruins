import Phaser from 'phaser';

class Fase2 extends Phaser.Scene {
  constructor() {
    super('Fase2');
  }

  preload() {
    this.load.image('vilao1', 'assets/Personagens/vilao1.png');
    this.load.image('mapa_fase2', 'assets/Mapas/fase2a.png');
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/andando/sprite-sheet-andando-de-frente.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/andando/sprite_sheet_lina_andando_costas.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/andando/sprite-sheet-lina-andando-direita.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/andando/sprite-sheet-andando-esquerda.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_frente', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-de-frente.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_costas', 'assets/Sprites/lina/atacando/sprite-sheet-atacando-de-costas.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_direita', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-direita.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_esquerda', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-esquerda.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_morrendo', 'assets/Sprites/lina/morrendo/sprite-sheet-morrendo.png', { frameWidth: 128, frameHeight: 128 });
  }

  create() {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';

    this.scale.resize(window.innerWidth, window.innerHeight);
    const largura = 1920;
    const altura = 1920;

    this.add.image(0, 0, 'mapa_fase2')
      .setOrigin(0)
      .setDepth(-2)
      .setDisplaySize(largura, altura);

    this.physics.world.setBounds(0, 0, largura, altura);
    this.cameras.main.setBounds(0, 0, largura, altura);

    this.add.text(largura / 2, 30, 'Bem-vindo à Fase 2', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(2);

    this.iniciarFase();
  }

  iniciarFase() {
    this.lina = this.physics.add.sprite(960, 960, 'lina_frente', 0).setScale(0.8);
    this.lina.setCollideWorldBounds(true);
    this.lina.setImmovable(true);
    this.vida = 100;
    this.direcaoLina = 'frente';

    this.cameras.main.startFollow(this.lina);

    this.anims.create({ key: 'andar_frente', frames: this.anims.generateFrameNumbers('lina_frente', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_costas', frames: this.anims.generateFrameNumbers('lina_costas', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_direita', frames: this.anims.generateFrameNumbers('lina_direita', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_esquerda', frames: this.anims.generateFrameNumbers('lina_esquerda', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_frente', frames: this.anims.generateFrameNumbers('lina_ataque_frente', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_costas', frames: this.anims.generateFrameNumbers('lina_ataque_costas', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_direita', frames: this.anims.generateFrameNumbers('lina_ataque_direita', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'ataque_esquerda', frames: this.anims.generateFrameNumbers('lina_ataque_esquerda', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'lina_morrendo', frames: this.anims.generateFrameNumbers('lina_morrendo', { start: 0, end: 5 }), frameRate: 8, repeat: 1 });

    this.coracoes = [];
    const totalCoracoes = 5;
    for (let i = 0; i < totalCoracoes; i++) {
      const coracao = this.add.image(0.5 + i * 45, 0.5, 'coracoes')
        .setScale(0.06)
        .setScrollFactor(0)
        .setDepth(2)
        .setOrigin(0, 0);
      this.coracoes.push(coracao);
    }

    this.teclas = this.input.keyboard.addKeys({ cima: 'W', baixo: 'S', esquerda: 'A', direita: 'D', atacar: 'SPACE' });

    this.ogros = [];
    this.spawnIndex = 0;
    this.spawnOffsets = [[200, -100], [-200, -100], [200, 100], [-200, 100], [150, -150], [-150, 150]];

    this.spawnOgroWave(2);
    this.time.addEvent({ delay: 7000, callback: () => this.spawnOgroWave(2) });
    this.time.addEvent({ delay: 14000, callback: () => this.spawnOgroWave(2) });
  }

  atualizarCoracoes() {
    const coracoesVisiveis = Math.ceil(this.vida / 20);
    this.coracoes.forEach((c, i) => {
      c.setVisible(i < coracoesVisiveis);
    });
  }

  spawnOgroWave(qtd) {
    for (let i = 0; i < qtd && this.spawnIndex < this.spawnOffsets.length; i++) {
      const [dx, dy] = this.spawnOffsets[this.spawnIndex];
      const ogro = this.physics.add.sprite(960 + dx, 960 + dy, 'vilao1').setScale(0.11);
      ogro.vida = 25;
      ogro.setImmovable(true);
      ogro.setPushable(false);
      ogro.barraVida = this.add.graphics();
      ogro.lastAttackTime = 0;

      this.ogros.push(ogro);
      this.spawnIndex++;

      this.physics.add.collider(this.lina, ogro, () => {
        const now = this.time.now;
        if (now - ogro.lastAttackTime > 1000 && this.vida > 0) {
          this.vida -= 25;
          this.atualizarCoracoes();
          this.lina.setTint(0xff0000);
          this.time.delayedCall(200, () => this.lina.clearTint());
          ogro.lastAttackTime = now;
          if (this.vida <= 0) {
            this.lina.anims.play('lina_morrendo', true);
            this.lina.setScale(0.8);
            this.lina.once('animationcomplete', () => {
              this.scene.restart();
            });
            this.vida = -9999;
            return;
          }
        }
      }, null, this);
    }
  }

  update() {
    if (!this.lina) return;
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
      this.ogros.forEach(ogro => {
        const distancia = Phaser.Math.Distance.BetweenPoints(this.lina, ogro);
        if (distancia < 80 && ogro.vida > 0) {
          ogro.vida -= 5;
          if (ogro.vida <= 0) {
            ogro.barraVida.clear();
            ogro.active = false;
            ogro.destroy();
          }
        }
      });
    }

    this.ogros.forEach(ogro => {
      if (ogro.active) {
        this.physics.moveToObject(ogro, this.lina, 25);
        const barraX = ogro.x - 30;
        const barraY = ogro.y - ogro.displayHeight / 2 - 10;
        const largura = 60;
        const altura = 8;
        const vida = Math.max(ogro.vida, 0);
        const proporcao = vida / 25;

        ogro.barraVida.clear();
        ogro.barraVida.fillStyle(0x000000);
        ogro.barraVida.fillRect(barraX, barraY, largura, altura);
        ogro.barraVida.fillStyle(0xff0000);
        ogro.barraVida.fillRect(barraX + 1, barraY + 1, (largura - 2) * proporcao, altura - 2);
        ogro.barraVida.setDepth(2);
      }
    });

    const totalOgrosEsperados = this.spawnOffsets.length;
    if (this.ogros.length === totalOgrosEsperados && this.ogros.every(o => !o.active)) {
      if (!this.transicaoIniciada) {
        this.transicaoIniciada = true;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Fase3');
        });
      }
    }
  }
}

export default Fase2;
