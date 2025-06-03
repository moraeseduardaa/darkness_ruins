import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  preload() {
    this.load.image('lina', 'assets/Personagens/lina.png');
    this.load.image('ghorn', 'assets/Personagens/ghorn.png');
    this.load.image('mapa_labirinto', 'assets/Mapas/mapa_labirinto.png');
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina andando de frente-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina andando costas-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina andando direita-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina andando esquerda-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Fundo do labirinto
    this.add.image(centerX, centerY, 'mapa_labirinto')
      .setDepth(-1)
      .setOrigin(0.5)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Título da fase
    this.add.text(centerX - 150, 50, 'Fase Final - Labirinto das Ruínas', {
      fontSize: '20px',
      color: '#ff6666',
    });

    // Lina com corpo físico e tamanho padronizado
    this.lina = this.physics.add.sprite(centerX, centerY + 100, 'lina_frente', 0).setScale(2);
    this.lina.setCollideWorldBounds(true);
    this.lina.setImmovable(true);

    // Animações da Lina
    this.anims.create({ key: 'andar_frente', frames: this.anims.generateFrameNumbers('lina_frente', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_costas', frames: this.anims.generateFrameNumbers('lina_costas', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_direita', frames: this.anims.generateFrameNumbers('lina_direita', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_esquerda', frames: this.anims.generateFrameNumbers('lina_esquerda', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });

    // Ghorn aparece por alguns segundos
    const bossIntro = this.add.image(centerX, centerY, 'ghorn').setScale(0.23);
    this.tweens.add({
      targets: bossIntro,
      alpha: { from: 0.6, to: 1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Após 3 segundos, remove a imagem e cria o boss físico
    this.time.delayedCall(3000, () => {
      bossIntro.destroy();
      this.ghorn = this.physics.add.sprite(centerX, centerY, 'ghorn').setScale(0.23);
      this.ghorn.vida = 100;
      this.ghorn.setImmovable(true);
      this.ghorn.setCollideWorldBounds(true);
      this.ghorn.barraVida = this.add.graphics();
      // Colisão com Lina
      this.physics.add.collider(this.lina, this.ghorn, () => {
        const now = this.time.now;
        if (!this.ghorn.lastAttackTime || now - this.ghorn.lastAttackTime > 1000) {
          // Dano na Lina
          this.lina.setTint(0xff0000);
          this.time.delayedCall(200, () => this.lina.clearTint());
          this.ghorn.lastAttackTime = now;
        }
      }, null, this);
    });

    // Texto explicativo
    this.add.text(centerX - 160, centerY + 200, 'Derrote Ghorn e salve a ilha!\nAperte ENTER para ver os créditos.', {
      fontSize: '16px',
      color: '#ffffff',
    });

    // Teclas
    this.teclas = this.input.keyboard.addKeys({
      cima: 'W',
      baixo: 'S',
      esquerda: 'A',
      direita: 'D',
      atacar: 'SPACE',
    });
  }

  update() {
    const speed = 2;
    const { cima, baixo, esquerda, direita, avancar } = this.teclas;

    // Movimento da Lina
    if (cima.isDown) {
      this.lina.setVelocityY(-speed);
      this.lina.anims.play('andar_costas', true);
    } else if (baixo.isDown) {
      this.lina.setVelocityY(speed);
      this.lina.anims.play('andar_frente', true);
    } else {
      this.lina.setVelocityY(0);
    }

    if (esquerda.isDown) {
      this.lina.setVelocityX(-speed);
      this.lina.anims.play('andar_esquerda', true);
    } else if (direita.isDown) {
      this.lina.setVelocityX(speed);
      this.lina.anims.play('andar_direita', true);
    } else {
      this.lina.setVelocityX(0);
    }

    // Transição para créditos
    if (Phaser.Input.Keyboard.JustDown(avancar)) {
      this.scene.start('Creditos');
    }
  }
}

export default Fase4;
