import Phaser from 'phaser';

class LojaScene extends Phaser.Scene {
  constructor() { super('LojaScene'); }
  init(data) { this.parent = data.parent; }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width * 0.6, height * 0.6, 0x000000, 0.4)
    .setStrokeStyle(3, 0xf1e4c2)
    .setDepth(1);
    this.add.text(width / 2, height / 2 - 130, '📜 LOJA DE PODERES 📜', {
    fontSize: '30px',
    fontFamily: 'Georgia',
    color: '#f1e4c2',
    stroke: '#4a3b60',
    strokeThickness: 2,
    shadow: { blur: 3, color: '#000', offsetX: 1, offsetY: 1 }
  }).setOrigin(0.5).setDepth(2);
  this.aviso = this.add.text(width / 2, height / 2 + 160, '', {
    fontSize: '18px',
    fontFamily: 'Verdana',
    color: '#ff5555'
  }).setOrigin(0.5).setDepth(3);
  this.criarBotao(height / 2 - 30, '❤️ +1 Vida (2 moedas)', 2, () => {
    this.parent.vida = Math.min(this.parent.vida + 20, 100);
  });
  this.criarBotao(height / 2 + 30, '🛡️ Escudo (1 moeda)', 1, () => {
    this.parent.temEscudo = true;
  });
  this.criarBotao(height / 2 + 90, '🗡️ +Dano (3 moedas)', 3, () => {
    this.parent.danoExtra += 5;
  });
  this.input.keyboard.on('keydown-C', () => this.fecharLoja());
}

 criarBotao(y, texto, custo, efeito) {
  const botao = this.add.text(this.scale.width / 2, y, texto, {
    fontSize: '20px',
    fontFamily: 'Georgia',
    backgroundColor: '#4c2a57', 
    color: '#ffffff',
    padding: { x: 25, y: 10 },
    align: 'center'
  })
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(2);
  botao.on('pointerover', () => {
    botao.setStyle({ backgroundColor: '#7e4a90' }); 
    botao.setShadow(2, 2, '#ffd700', 4, true, true);
  });
  botao.on('pointerout', () => {
    botao.setStyle({ backgroundColor: '#4c2a57' }); 
    botao.setShadow(0, 0, '', 0); 
  });
  botao.on('pointerdown', () => {
    if (this.parent.moedasColetadas >= custo) {
      efeito();
      this.parent.moedasColetadas -= custo;
      this.parent.atualizarHUD();
      this.fecharLoja();
    } else {
      this.aviso.setText('⚠️ Moedas insuficientes!');
      this.time.delayedCall(1500, () => this.aviso.setText(''));
    }
  });
}
 fecharLoja() { this.scene.stop(); this.parent.scene.resume(); }
}
class Fase1 extends Phaser.Scene {
  constructor() { super('Fase1'); }

  preload() {
    this.load.image('mapa_fase1','assets/Mapas/fase1a.png');
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
    this.add.image(0,0,'mapa_fase1').setOrigin(0).setDisplaySize(1920,1920);
    this.physics.world.setBounds(0,0,1920,1920);
    this.cameras.main.setBounds(0,0,1920,1920);

    this.lina = this.physics.add.sprite(960,960,'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);
    this.vida = 100; this.danoExtra = 0; this.temEscudo = false; this.morta = false; this.transicaoFeita = false;
    this.atacando = false;
    this.totalOgrosGerados = 0; this.maxOgros = 15;

    this.criarAnimacoes();
    this.criarControles();
    this.criarHUD();
    this.criarMoedas();
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

  criarHUD() {
    const padding = 20;
    this.coracoes = [...Array(5)].map((_, i) =>
      this.add.image(padding + i * 45, padding, 'coracoes')
        .setScale(0.06)
        .setScrollFactor(0)
    );
    this.moedasColetadas = 0;
    const centroX = this.scale.width / 2;
    this.iconeMoeda = this.add.image(centroX, 28, 'moeda')
      .setScale(0.05)
      .setScrollFactor(0)
      .setOrigin(1, 0.5);
    this.textoMoedas = this.add.text(centroX, 28, '0', {
      fontSize: '26px',
      fontFamily: 'Georgia',
      color: '#ffffff'
    })
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
  }

  criarMoedas() {
    this.moedas = this.physics.add.group();
  
    const posicoes = [
      [200, 200],     
      [1700, 200],   
      [200, 1700],    
      [1700, 1700],  
      [960, 960],  
      [500, 1000],   
      [1400, 1000], 
      [960, 400], 
      [960, 1500],
      [300, 300]      
    ];
    
    posicoes.forEach(([x, y]) => {
      const moeda = this.moedas.create(x, y, 'moeda').setScale(0.06);
      moeda.body.setAllowGravity(false);
    });
  
    this.physics.add.overlap(this.lina, this.moedas, (lina, moeda) => {
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

  update() {
    if (this.morta) return;
    const spd = 200; let vx=0, vy=0;

    if (this.teclas.cima.isDown) { vy=-spd; this.playAnim('andar_costas'); this.direcao='costas'; }
    else if (this.teclas.baixo.isDown) { vy=spd; this.playAnim('andar_frente'); this.direcao='frente'; }
    else if (this.teclas.direita.isDown) { vx=spd; this.playAnim('andar_direita'); this.direcao='direita'; }
    else if (this.teclas.esquerda.isDown) { vx=-spd; this.playAnim('andar_esquerda'); this.direcao='esquerda'; }
    else if (!this.atacando) this.lina.anims.stop();

    this.lina.setVelocity(vx, vy);

    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar) && !this.atacando && !this.morta) {
      this.atacando = true;
      const animAtk = {
        'frente':'ataque_frente', 'costas':'ataque_costas',
        'direita':'ataque_direita', 'esquerda':'ataque_esquerda'
      }[this.direcao || 'frente'];
      this.lina.play(animAtk);
      
      this.time.delayedCall(400, () => {
        this.atacando = false;
        if (!this.morta) {
          this.playAnim('andar_frente');
        }
      });

      this.ogros.getChildren().forEach(ogro => {
        if (Phaser.Math.Distance.Between(this.lina.x,this.lina.y,ogro.x,ogro.y)<80) {
          ogro.vida -= (5 + this.danoExtra);
          if (ogro.vida<=0) { ogro.barraVida.destroy(); ogro.destroy(); }
        }
      });
    }

    this.ogros.getChildren().forEach(ogro => {
      const dist = Phaser.Math.Distance.Between(this.lina.x,this.lina.y,ogro.x,ogro.y);
      if (dist>20) this.physics.moveToObject(ogro,this.lina,25); else ogro.setVelocity(0);
      ogro.barraVida.clear();
      const p = Math.max(ogro.vida/25,0);
      ogro.barraVida.fillStyle(0x000000).fillRect(ogro.x-30,ogro.y-ogro.displayHeight/2-15,60,8);
      ogro.barraVida.fillStyle(0xff0000).fillRect(ogro.x-29,ogro.y-ogro.displayHeight/2-14,58*p,6);

      if (dist<50 && this.vida>0) {
        this.vida -= this.temEscudo?0:0.1;
        this.atualizarHUD();
        if (this.vida <= 0 && !this.morta) {
          this.morta = true;
          this.atacando = false;
          this.lina.setVelocity(0);
          this.lina.anims.stop(); 
          this.lina.anims.play('lina_morrendo', true);
          this.lina.once('animationcomplete', () => {
            this.scene.start('GameOver', {
              moedasColetadas: this.moedasColetadas
            });
          });
        }
        
      }
    });

    if (this.totalOgrosGerados === this.maxOgros && this.ogros.countActive() === 0 && !this.transicaoFeita) {
      this.transicaoFeita = true;
      this.cameras.main.fadeOut(1000,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete',()=>{ 
      this.scene.start('Fase2', {
        vida: this.vida,
        danoExtra: this.danoExtra,
        temEscudo: this.temEscudo,
        moedasColetadas: this.moedasColetadas
      }); });
    }
  }

  playAnim(anim) {
    if (this.lina.anims.currentAnim?.key!==anim) this.lina.anims.play(anim,true);
  }
}

export { Fase1, LojaScene };
