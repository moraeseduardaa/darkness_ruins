import Phaser from 'phaser';

class Fase3 extends Phaser.Scene {
  constructor() {
    super('Fase3');
  }

  preload() {
    this.load.image('vilao1', 'assets/Personagens/vilao1.png');
    this.load.image('mapa_floresta', 'assets/Mapas/fase3a.png'); // NOVA imagem correta e ampliada
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/lina andando de frente-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/lina andando costas-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/lina andando direita-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/lina andando esquerda-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    document.body.style.overflow = 'hidden';

    const largura = 1920;
    const altura = 1920;

    this.fundo = this.add.image(0, 0, 'mapa_floresta')
      .setOrigin(0)
      .setDepth(-2)
      .setDisplaySize(largura, altura);

    this.physics.world.setBounds(0, 0, largura, altura);
    this.cameras.main.setBounds(0, 0, largura, altura);

    this.add.text(largura / 2, 30, 'Fase 3 - Floresta das Ruínas', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(2);

    this.lina = this.physics.add.sprite(largura / 2, altura / 2, 'lina_frente', 0).setScale(2);
    this.lina.setCollideWorldBounds(true);
    this.lina.setImmovable(true);
    this.vida = 100;

    this.cameras.main.startFollow(this.lina);

    this.anims.create({ key: 'andar_frente', frames: this.anims.generateFrameNumbers('lina_frente', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_costas', frames: this.anims.generateFrameNumbers('lina_costas', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_direita', frames: this.anims.generateFrameNumbers('lina_direita', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_esquerda', frames: this.anims.generateFrameNumbers('lina_esquerda', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });

    this.coracoes = [];
    for (let i = 0; i < 5; i++) {
      const coracao = this.add.image(0.5 + i * 45, 0.5, 'coracoes')
        .setScale(0.06)
        .setScrollFactor(0)
        .setDepth(2)
        .setOrigin(0, 0);
      this.coracoes.push(coracao);
    }

    this.teclas = this.input.keyboard.addKeys({
      cima: 'W', baixo: 'S', esquerda: 'A', direita: 'D', atacar: 'SPACE'
    });

    this.ogros = [];
    this.spawnIndex = 0;
    this.spawnOffsets = [
      [200, -100], [-200, -100],
      [200, 100], [-200, 100],
      [150, -150], [-150, 150]
    ];

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
          this.vida -= 10;
          this.atualizarCoracoes();
          this.lina.setTint(0xff0000);
          this.time.delayedCall(200, () => this.lina.clearTint());
          ogro.lastAttackTime = now;
          if (this.vida <= 0) {
            this.scene.restart();
          }
        }
      }, null, this);
    }
  }

  update() {
    if (!this.teclas || !this.lina) return;

    const speed = 200;
    const { cima, baixo, esquerda, direita, atacar } = this.teclas;
    let moving = false;
    let vx = 0;
    let vy = 0;

    if (cima.isDown) {
      vy = -speed;
      this.lina.anims.play('andar_costas', true);
      moving = true;
    } else if (baixo.isDown) {
      vy = speed;
      this.lina.anims.play('andar_frente', true);
      moving = true;
    } else if (direita.isDown) {
      vx = speed;
      this.lina.anims.play('andar_direita', true);
      moving = true;
    } else if (esquerda.isDown) {
      vx = -speed;
      this.lina.anims.play('andar_esquerda', true);
      moving = true;
    }

    this.lina.body.setVelocity(vx, vy);
    if (!moving) this.lina.anims.stop();

    if (Phaser.Input.Keyboard.JustDown(atacar)) {
      this.ogros.forEach(ogro => {
        const distancia = Phaser.Math.Distance.BetweenPoints(this.lina, ogro);
        if (distancia < 80 && ogro.vida > 0) {
          ogro.vida -= 5;
          if (ogro.vida <= 0) {
            ogro.barraVida.clear();
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
          this.scene.start('Fase4');
        });
      }
    }
  }
}

export default Fase3;
