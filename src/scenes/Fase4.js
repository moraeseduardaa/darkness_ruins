import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  init(data) {
    this.vida = 100; 
    this.danoExtra = data.danoExtra || 0;
    this.temEscudo = data.temEscudo || false;
    this.moedasColetadas = data.moedasColetadas || 0;
  }

  preload() {
    this.load.image('mapa_fase4', 'assets/Mapas/fase4a.png');
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');
    this.load.image('moeda', 'assets/Personagens/moeda.png');
    this.load.image('ghorn', 'assets/Personagens/ghorn.png');
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/andando/sprite-sheet-andando-de-frente.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/andando/sprite_sheet_lina_andando_costas.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/andando/sprite-sheet-lina-andando-direita.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/andando/sprite-sheet-andando-esquerda.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_morrendo', 'assets/Sprites/lina/morrendo/sprite-sheet-morrendo.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_frente', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-de-frente.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_costas', 'assets/Sprites/lina/atacando/sprite-sheet-atacando-de-costas.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_direita', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-direita.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('lina_ataque_esquerda', 'assets/Sprites/lina/atacando/sprite-sheet-ataque-esquerda.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('thorn_morrendo', 'assets/Sprites/thorn/SPRITE_SHEET_THORN_MORRENDO.png', { frameWidth: 256, frameHeight: 256 });
    this.load.audio('som_faca', 'assets/audio/som_faca.mp3');
  }

  create() {
    this.add.image(0, 0, 'mapa_fase4').setOrigin(0).setDisplaySize(1920, 1920);
    this.physics.world.setBounds(0, 0, 1920, 1920);
    this.cameras.main.setBounds(0, 0, 1920, 1920);
    this.somFaca = this.sound.add('som_faca', { volume: 0.2 }); 

    this.lina = this.physics.add.sprite(960, 960, 'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);

    this.morta = false;
    this.atacando = false;

    this.criarAnimacoes();
    this.criarControles();
    this.criarHUD();
    this.criarMoedas();
    this.criarVilao();

    this.input.keyboard.on('keydown-C', () => {
      if (!this.scene.isActive('LojaScene')) {
        this.scene.launch('LojaScene', { parent: this });
        this.scene.pause();
      }
    });
  }

  criarAnimacoes() {
    [['andar_frente', 'lina_frente'], ['andar_costas', 'lina_costas'], ['andar_direita', 'lina_direita'], ['andar_esquerda', 'lina_esquerda']].forEach(([key, sprite]) => {
      this.anims.create({ key, frames: this.anims.generateFrameNumbers(sprite, { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
    });
    this.anims.create({ key: 'lina_morrendo', frames: this.anims.generateFrameNumbers('lina_morrendo', { start: 0, end: 5 }), frameRate: 8 });
    this.anims.create({ key: 'ataque_frente', frames: this.anims.generateFrameNumbers('lina_ataque_frente', { start: 0, end: 7 }), frameRate: 10 });
    this.anims.create({ key: 'ataque_costas', frames: this.anims.generateFrameNumbers('lina_ataque_costas', { start: 0, end: 7 }), frameRate: 10 });
    this.anims.create({ key: 'ataque_direita', frames: this.anims.generateFrameNumbers('lina_ataque_direita', { start: 0, end: 7 }), frameRate: 10 });
    this.anims.create({ key: 'ataque_esquerda', frames: this.anims.generateFrameNumbers('lina_ataque_esquerda', { start: 0, end: 7 }), frameRate: 10 });
    this.anims.create({
      key: 'thorn_morrendo',
      frames: this.anims.generateFrameNumbers('thorn_morrendo', { start: 0, end: 15 }), // 16 frames
      frameRate: 6,
      repeat: 0
    });
  }

  criarControles() {
    this.teclas = this.input.keyboard.addKeys({ cima: 'W', baixo: 'S', esquerda: 'A', direita: 'D', atacar: 'SPACE' });
  }

  criarHUD() {
    const padding = 20;
    this.coracoes = [...Array(5)].map((_, i) =>
      this.add.image(padding + i * 45, padding, 'coracoes').setScale(0.06).setScrollFactor(0)
    );
    const centroX = this.scale.width / 2;
    this.iconeMoeda = this.add.image(centroX, 28, 'moeda').setScale(0.05).setScrollFactor(0).setOrigin(1, 0.5);
    this.textoMoedas = this.add.text(centroX, 28, `${this.moedasColetadas}`, {
      fontSize: '26px', fontFamily: 'Georgia', color: '#ffffff'
    }).setOrigin(0, 0.5).setScrollFactor(0);
  }

  criarMoedas() {
    this.moedas = this.physics.add.group();
    const posicoes = [
      [200, 200], [400, 400], [600, 600], [800, 800], //[960, 960],
      [1200, 1200], [1600, 1600], [300, 1500], [1700, 300], [1800, 1800]
    ];
    posicoes.forEach(([x, y]) => {
      const moeda = this.moedas.create(x, y, 'moeda').setScale(0.06);
      moeda.body.setAllowGravity(false);
    });
    this.physics.add.overlap(this.lina, this.moedas, (_, moeda) => {
      moeda.destroy();
      this.moedasColetadas++;
      this.atualizarHUD();
    });
  }

  atualizarHUD() {
    this.textoMoedas.setText(`${this.moedasColetadas}`);
    const visiveis = Math.ceil(this.vida / 20);
    this.coracoes.forEach((c, i) => c.setVisible(i < visiveis));
  }

  criarVilao() {
    this.vilao = this.physics.add.sprite(960, 400, 'ghorn').setScale(0.2);
    this.vilao.vida = 125;
    this.vilao.barraVida = this.add.graphics().setDepth(1);
    this.vilao.morrendo = false;
  }

  update() {
    if (this.morta) return;

    const spd = 200;
    let vx = 0, vy = 0;

    if (this.teclas.cima.isDown) { vy = -spd; this.playAnim('andar_costas'); this.direcao = 'costas'; }
    else if (this.teclas.baixo.isDown) { vy = spd; this.playAnim('andar_frente'); this.direcao = 'frente'; }
    else if (this.teclas.direita.isDown) { vx = spd; this.playAnim('andar_direita'); this.direcao = 'direita'; }
    else if (this.teclas.esquerda.isDown) { vx = -spd; this.playAnim('andar_esquerda'); this.direcao = 'esquerda'; }
    else if (!this.atacando) this.lina.anims.stop();

    this.lina.setVelocity(vx, vy);

    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar) && !this.atacando && !this.morta) {
      this.atacando = true;
      this.somFaca.play();
      const animAtk = {
        'frente': 'ataque_frente',
        'costas': 'ataque_costas',
        'direita': 'ataque_direita',
        'esquerda': 'ataque_esquerda'
      }[this.direcao || 'frente'];
      this.lina.play(animAtk);

      this.time.delayedCall(400, () => {
        this.atacando = false;
        if (!this.morta) {
          this.playAnim('andar_frente');
        }
      });
      if (Phaser.Math.Distance.Between(this.lina.x, this.lina.y, this.vilao.x, this.vilao.y) < 80 && this.vilao.active && !this.vilao.morrendo) {
        this.vilao.vida -= (5 + this.danoExtra);
        if (this.vilao.vida <= 0) {
          this.vilao.morrendo = true;
          this.vilao.barraVida.destroy();
          this.vilao.anims.play('thorn_morrendo', true);
          this.vilao.once('animationcomplete', () => {
            this.vilao.destroy();
            this.vitoria();
          });
        }
      }
    }

    if (this.vilao.active) {
      const dist = Phaser.Math.Distance.Between(this.lina.x, this.lina.y, this.vilao.x, this.vilao.y);
      if (dist > 20) this.physics.moveToObject(this.vilao, this.lina, 80); // velocidade aumentada
      else this.vilao.setVelocity(0);

      this.vilao.barraVida.clear();
      const p = Math.max(this.vilao.vida / 100, 0);
      this.vilao.barraVida.fillStyle(0x000000).fillRect(this.vilao.x - 30, this.vilao.y - this.vilao.displayHeight / 2 - 15, 60, 8);
      this.vilao.barraVida.fillStyle(0xff0000).fillRect(this.vilao.x - 29, this.vilao.y - this.vilao.displayHeight / 2 - 14, 58 * p, 6);

      if (dist < 100 && this.vida > 0) {
        const danoRecebido = this.temEscudo ? 0.20 : 0.35;


        this.vida -= danoRecebido;
        this.atualizarHUD();
        if (this.vida <= 0 && !this.morta) {
          this.morta = true;
          this.atacando = false;
          this.lina.setVelocity(0);
          this.lina.anims.play('lina_morrendo', true);
          this.lina.once('animationcomplete', () => {
            this.scene.start('GameOver', { moedasColetadas: this.moedasColetadas });
          });
        }
      }
    }
  }

  vitoria() {
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('creditos_finais', {
        moedasColetadas: this.moedasColetadas
      });
    });
  }

  playAnim(anim) {
    if (this.lina.anims.currentAnim?.key !== anim) this.lina.anims.play(anim, true);
  }
}

export default Fase4;
