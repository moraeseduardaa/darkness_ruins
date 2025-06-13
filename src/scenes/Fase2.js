import Phaser from 'phaser';

class Fase2 extends Phaser.Scene {
  constructor() {
    super('Fase2');
  }

  preload() {
    this.load.image('mapa_fase2','assets/Mapas/fase2a.png');
    this.load.image('coracoes','assets/Personagens/hud_coracoes.png');
    this.load.image('moeda','assets/Personagens/moeda.png');
    this.load.image('vilao1','assets/Personagens/vilao1.png');
    this.load.spritesheet('lina_frente','assets/Sprites/lina/andando/sprite-sheet-andando-de-frente.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_costas','assets/Sprites/lina/andando/sprite_sheet_lina_andando_costas.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_direita','assets/Sprites/lina/andando/sprite-sheet-lina-andando-direita.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_esquerda','assets/Sprites/lina/andando/sprite-sheet-andando-esquerda.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_morrendo','assets/Sprites/lina/morrendo/sprite-sheet-morrendo.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_frente','assets/Sprites/lina/atacando/sprite-sheet-ataque-de-frente.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_costas','assets/Sprites/lina/atacando/sprite-sheet-atacando-de-costas.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_direita','assets/Sprites/lina/atacando/sprite-sheet-ataque-direita.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_esquerda','assets/Sprites/lina/atacando/sprite-sheet-ataque-esquerda.png',{frameWidth:128,frameHeight:128});
  }

  create() {
    this.add.image(0,0,'mapa_fase2').setOrigin(0).setDisplaySize(1920,1920);
    this.physics.world.setBounds(0,0,1920,1920);
    this.cameras.main.setBounds(0,0,1920,1920);

    this.lina = this.physics.add.sprite(960,960,'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);
    this.vida = 100; this.danoExtra = 0; this.temEscudo = false; this.morta = false; this.transicaoFeita = false;
    this.totalOgrosGerados = 0; this.maxOgros = 15;

    this.criarAnimacoes();
    this.criarControles();
    this.criarOgros();

    this.spawnTimer = this.time.addEvent({
      delay: 4000, loop: true, callback: () => {
        if (this.totalOgrosGerados < this.maxOgros) this.spawnNovaOnda();
      }
    });

    this.input.keyboard.on('keydown-C', ()=> {
      if (!this.scene.isActive('LojaScene')) {
        this.scene.launch('LojaScene',{parent:this});
        this.scene.pause();
      }
    });
  }

  criarAnimacoes() {
    [['andar_frente','lina_frente'],['andar_costas','lina_costas'],['andar_direita','lina_direita'],['andar_esquerda','lina_esquerda']].forEach(([key,sprite]) => {
      this.anims.create({ key, frames: this.anims.generateFrameNumbers(sprite,{start:0,end:7}), frameRate:8, repeat:-1 });
    });
    this.anims.create({ key:'lina_morrendo', frames: this.anims.generateFrameNumbers('lina_morrendo',{start:0,end:5}), frameRate:8 });
    this.anims.create({ key:'ataque_frente', frames: this.anims.generateFrameNumbers('lina_ataque_frente',{start:0,end:7}), frameRate:10 });
    this.anims.create({ key:'ataque_costas', frames: this.anims.generateFrameNumbers('lina_ataque_costas',{start:0,end:7}), frameRate:10 });
    this.anims.create({ key:'ataque_direita', frames: this.anims.generateFrameNumbers('lina_ataque_direita',{start:0,end:7}), frameRate:10 });
    this.anims.create({ key:'ataque_esquerda', frames: this.anims.generateFrameNumbers('lina_ataque_esquerda',{start:0,end:7}), frameRate:10 });
  }

  criarControles() {
    this.teclas = this.input.keyboard.addKeys({ cima:'W',baixo:'S',esquerda:'A',direita:'D', atacar:'SPACE' });
  }

  atualizarHUD() {
    this.textoMoedas.setText(`🪙 ${this.moedasColetadas}`);
    const visiveis = Math.ceil(this.vida/20);
    this.coracoes.forEach((c,i)=>c.setVisible(i<visiveis));
  }

  criarOgros() {
    this.ogros = this.physics.add.group();
  }

  spawnNovaOnda() {
      const posicoes = [
        [200,-100],[-200,-100],[200,100],[-200,100],[150,-150],[-150,150],
        [250,250],[-250,250],[0,-250],[250,0],[-250,0],[0,250],
        [300,-300],[-300,300],[300,0]
      ];
      Phaser.Utils.Array.Shuffle(posicoes);
      const quantidade = Math.min(3, this.maxOgros - this.totalOgrosGerados);
      for (let i = 0; i < quantidade; i++) {
        const [dx, dy] = posicoes[this.totalOgrosGerados];
        const ogro = this.ogros.create(960+dx,960+dy,'vilao1').setScale(0.1);
        ogro.vida = 25;
        ogro.barraVida = this.add.graphics().setDepth(1);
        this.totalOgrosGerados++;
      }
    }

//----------------------------------------------------------------

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

      //loja
      if (this.textoMoedasHUD) {
      this.textoMoedasHUD.setText(`🪙 ${this.moedasColetadas}`);
    }
      this.atualizarTextoMoedas();
      }
    //loja
    abrirLoja() {
      this.lojaAberta = true;

      const largura = this.sys.game.canvas.width;
      const altura = this.sys.game.canvas.height;

      const fundo = this.add.rectangle(largura / 2, altura / 2, largura * 0.6, altura * 0.6, 0x222222, 0.50)
        .setDepth(10)
        .setStrokeStyle(4, 0xffffff)
        .setScrollFactor(0);

      const texto = this.add.text(largura / 2, altura / 2 - 120, '🛒 LOJA DE PODERES', {
        fontSize: '32px',
        fontFamily: 'IM Fell English SC',
        fontStyle: 'bold',
        color: '#8B4513',
        stroke: '#1a1a1a',
        strokeThickness: 0.5
      }).setOrigin(0.5).setDepth(11).setScrollFactor(0);

      this.textoMoedasLoja = this.add.text(largura / 2, altura / 2 + 100, `🪙 Moedas: ${this.moedasColetadas}`, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#00000044',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5).setDepth(11).setScrollFactor(0);

      this.botoesLoja = [fundo, texto, this.textoMoedasLoja];

      const opcoes = [
        {
          texto: '🩸 +1 Vida (4 moedas)',
          acao: () => {
            if (this.moedasColetadas >= 4) {
              this.vida = Math.min(this.vida + 20, 100);
              this.moedasColetadas -= 4;
              this.atualizarTextoMoedas();
            } else {
              this.mostrarAvisoMoedasInsuficientes(largura, altura);
            }
          }
        },
        {
          texto: '🛡️ Escudo Temporário (2 moedas)',
          acao: () => {
            if (this.moedasColetadas >= 2) {
              this.temEscudo = true;
              this.moedasColetadas -= 2;
              this.atualizarTextoMoedas();
              this.time.delayedCall(5000, () => this.temEscudo = false);
            } else {
              this.mostrarAvisoMoedasInsuficientes(largura, altura);
            }
          }
        },
        {
          texto: '💥 +Dano Temporário (3 moedas)',
          acao: () => {
            if (this.moedasColetadas >= 3) {
              this.danoExtra = true;
              this.moedasColetadas -= 3;
              this.atualizarTextoMoedas();
              this.time.delayedCall(5000, () => this.danoExtra = false);
            } else {
              this.mostrarAvisoMoedasInsuficientes(largura, altura);
            }
          }
        }
      ];

      opcoes.forEach((op, i) => {
        const botao = this.add.text(largura / 2, altura / 2 - 20 + i * 60, op.texto, {
          fontSize: '16px',
          fontFamily: 'Cinzel',
          padding: { x: 20, y: 10 },
          backgroundColor: '#333',
          color: '#ffffff',
          align: 'center',
          fixedWidth: 250
        })
          .setOrigin(0.5)
          .setDepth(11)
          .setInteractive()
          .setScrollFactor(0);

        botao.on('pointerover', () => {
          botao.setStyle({ backgroundColor: '#666', color: '#87CEFA' });
        });
        botao.on('pointerout', () => {
          botao.setStyle({ backgroundColor: '#444', color: '#ffffff' });
        });
        botao.on('pointerdown', () => {
          op.acao();
          this.fecharLoja();
        });

        this.botoesLoja.push(botao);
      });
    }

    fecharLoja() {
      this.lojaAberta = false;
      this.botoesLoja.forEach(b => b.destroy());
    }

    atualizarTextoMoedas() {
      if (this.textoMoedasLoja) {
        this.textoMoedasLoja.setText(`🪙 Moedas: ${this.moedasColetadas}`);
      }
      if (this.textoMoedasTela) {
        this.textoMoedasTela.setText(`🪙 ${this.moedasColetadas}`);
      }
    }

    mostrarAvisoMoedasInsuficientes(largura, altura) {
      const aviso = this.add.text(largura / 2, altura / 2 + 130, 'Moedas insuficientes!', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ff5555',
        backgroundColor: '#000000aa',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5).setDepth(12).setScrollFactor(0);

      this.time.delayedCall(2000, () => {
        aviso.destroy();
      });

  }
}

export default Fase2;
