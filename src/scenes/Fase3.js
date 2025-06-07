import Phaser from 'phaser';

class Fase3 extends Phaser.Scene {
  constructor() {
    super('Fase3');
  }

  preload() {
    this.load.image('vilao1', 'assets/Personagens/vilao1.png');
    this.load.image('mapa_floresta', 'assets/Mapas/mapa_floresta.png');
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
    const { width, height } = this.sys.game.canvas;

    // Fundo e título
    const fundo = this.add.image(width / 2, height / 2, 'mapa_floresta')
      .setDepth(-2)
      .setDisplaySize(width, height)
      .setName('fundo');
    this.add.text(width / 2, 30, 'Fase 3', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(2);

    // Lina
    this.lina = this.physics.add.sprite(width / 2, height / 2, 'lina_frente', 0).setScale(1);
    this.lina.setCollideWorldBounds(true);
    this.lina.setImmovable(true);
    this.vida = 100;

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
    
        // Corações
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
    
        // Teclas
        this.teclas = this.input.keyboard.addKeys({
          cima: 'W',
          baixo: 'S',
          esquerda: 'A',
          direita: 'D',
          atacar: 'SPACE',
        });
    
        // Ogros
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
    
        window.addEventListener('resize', () => {
          this.scale.resize(window.innerWidth, window.innerHeight);
          const w = this.sys.game.canvas.width;
          const h = this.sys.game.canvas.height;
          this.children.getByName('fundo')?.setDisplaySize(w, h);
        });
      }
    
      atualizarCoracoes() {
        const coracoesVisiveis = Math.ceil(this.vida / 20);
        this.coracoes.forEach((c, i) => {
          c.setVisible(i < coracoesVisiveis);
        });
      }
    
      spawnOgroWave(qtd) {
        const { width, height } = this.sys.game.canvas;
    
        for (let i = 0; i < qtd && this.spawnIndex < this.spawnOffsets.length; i++) {
          const [dx, dy] = this.spawnOffsets[this.spawnIndex];
          const ogro = this.physics.add.image(width / 2 + dx, height / 2 + dy, 'vilao1').setScale(0.11);
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
              this.vida -= 10; // Dano reduzido de 20 para 10
              this.atualizarCoracoes();
              this.lina.setTint(0xff0000);
              this.time.delayedCall(200, () => this.lina.clearTint());
              ogro.lastAttackTime = now;
              if (this.vida <= 0) {
                this.lina.anims.play('morrendo', true);
                this.time.delayedCall(800, () => this.scene.restart());
              }
            }
          }, null, this);
        }
      }
    
      update() {
        const speed = 200; 
        const { cima, baixo, esquerda, direita, atacar, avancar } = this.teclas;
        let moving = false;
        this.lina.body.setVelocity(0);
        let vx = 0;
        let vy = 0;
    
        // Impede comandos se Lina estiver morrendo
        if (this.lina.anims.currentAnim && this.lina.anims.currentAnim.key === 'lina_morrendo') {
          this.lina.body.setVelocity(0);
          return;
        }
    
        if (cima.isDown) {
          vy = -speed;
          this.lina.anims.play('andar_costas', true);
          this.ultimaDirecao = 'costas';
          moving = true;
        } else if (baixo.isDown) {
          vy = speed;
          this.lina.anims.play('andar_frente', true);
          this.ultimaDirecao = 'frente';
          moving = true;
        } else if (direita.isDown) {
          vx = speed;
          this.lina.anims.play('andar_direita', true);
          this.ultimaDirecao = 'direita';
          moving = true;
        } else if (esquerda.isDown) {
          vx = -speed;
          this.lina.anims.play('andar_esquerda', true);
          this.ultimaDirecao = 'esquerda';
          moving = true;
        }
        this.lina.body.setVelocity(vx, vy);
        if (!moving && (!this.lina.anims.currentAnim || !this.lina.anims.currentAnim.key.startsWith('ataque'))) this.lina.anims.stop();
    
        // Ataque
        if (Phaser.Input.Keyboard.JustDown(atacar) && (!this.lina.anims.currentAnim || !this.lina.anims.currentAnim.key.startsWith('ataque'))) {
          let anim = 'ataque_frente';
          if (this.ultimaDirecao === 'costas') anim = 'ataque_costas';
          else if (this.ultimaDirecao === 'direita') anim = 'ataque_direita';
          else if (this.ultimaDirecao === 'esquerda') anim = 'ataque_esquerda';
          this.lina.anims.play(anim, true);
          this.lina.setScale(1);
          this.lina.body.setVelocity(0);
          this.lina.isAttacking = true;
          this.lina.ogrosAtingidos = new Set();
          this.lina.once('animationcomplete', () => {
            this.lina.isAttacking = false;
            this.lina.ogrosAtingidos = undefined;
          });
        }
        if (this.lina.isAttacking && this.lina.anims.currentAnim && this.lina.anims.currentAnim.key.startsWith('ataque')) {
          this.ogros.forEach(ogro => {
            if (!ogro.active) return;
            if (this.lina.ogrosAtingidos && this.lina.ogrosAtingidos.has(ogro)) return;
            const distancia = Phaser.Math.Distance.BetweenPoints(this.lina, ogro);
            if (distancia < 80 && ogro.vida > 0) {
              ogro.vida -= 5;
              if (ogro.vida <= 0) {
                ogro.barraVida.clear();
                ogro.destroy();
              }
              if (this.lina.ogrosAtingidos) this.lina.ogrosAtingidos.add(ogro);
            }
          });
        }
        if (this.lina.isAttacking) {
          this.lina.body.setVelocity(0);
          return;
        }
    
        // Barra de vida
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
    if (
      this.ogros.length === totalOgrosEsperados &&
      this.ogros.every(o => !o.active)
    ) {
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
