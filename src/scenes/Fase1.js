import Phaser from 'phaser';

class LojaScene extends Phaser.Scene {
  constructor() { super('LojaScene'); }

  init(data) { this.parent = data.parent; }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width/2, height/2, width*0.6, height*0.6, 0x222222, 0.6)
      .setStrokeStyle(4, 0xffffff).setDepth(1);

    this.add.text(width/2, height/2-150, '🛒 LOJA', {
      fontSize: '32px', fontFamily: 'Arial', color: '#fff'
    }).setOrigin(0.5).setDepth(2);

    this.aviso = this.add.text(width/2, height/2+150, '', {
      fontSize: '18px', color: '#ff5555'
    }).setOrigin(0.5).setDepth(3);

    this.criarBotao(height/2-40, '+1 Vida (2 moedas)', 2, () => {
      this.parent.vida = Math.min(this.parent.vida+20, 100);
    });
    this.criarBotao(height/2+20, 'Escudo (1 moedas)', 1, () => {
      this.parent.temEscudo = true;
    });
    this.criarBotao(height/2+80, '+Dano (3 moedas)', 3, () => {
      this.parent.danoExtra += 5;
    });

    this.input.keyboard.on('keydown-C', () => this.fecharLoja());
  }

  criarBotao(y, texto, custo, efeito) {
    const botao = this.add.text(this.scale.width/2, y, texto, {
      fontSize: '18px', backgroundColor: '#333', color: '#fff', padding:{x:20,y:10}
    }).setOrigin(0.5).setInteractive().setDepth(2);

    botao.on('pointerdown', () => {
      if (this.parent.moedasColetadas >= custo) {
        efeito();
        this.parent.moedasColetadas -= custo;
        this.parent.atualizarHUD();
        this.fecharLoja();
      } else {
        this.aviso.setText('Moedas insuficientes!');
        this.time.delayedCall(1500, ()=>this.aviso.setText(''));
      }
    });
  }

  fecharLoja() {
    this.scene.stop();
    this.parent.scene.resume();
  }
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
  }

  create() {
    this.add.image(0,0,'mapa_fase1').setOrigin(0).setDisplaySize(1920,1920);
    this.physics.world.setBounds(0,0,1920,1920);
    this.cameras.main.setBounds(0,0,1920,1920);

    this.lina = this.physics.add.sprite(960,960,'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);
    this.vida = 100; this.danoExtra = 0; this.temEscudo = false; this.morta = false;
    this.transicaoFeita = false; // Novo controle de transição

    this.criarAnimacoes();
    this.criarControles();
    this.criarHUD();
    this.criarMoedas();
    this.criarOgros();

    this.input.keyboard.on('keydown-C', ()=> {
      if (!this.scene.isActive('LojaScene')) {
        this.scene.launch('LojaScene',{parent:this});
        this.scene.pause();
      }
    });
  }

  criarAnimacoes() {
    [['andar_frente','lina_frente'],['andar_costas','lina_costas'],['andar_direita','lina_direita'],['andar_esquerda','lina_esquerda']]
    .forEach(([key,sprite]) => {
      this.anims.create({ key, frames: this.anims.generateFrameNumbers(sprite,{start:0,end:7}), frameRate:8, repeat:-1 });
    });
    this.anims.create({ key:'lina_morrendo', frames: this.anims.generateFrameNumbers('lina_morrendo',{start:0,end:5}), frameRate:8 });
  }

  criarControles() {
    this.teclas = this.input.keyboard.addKeys({ cima:'W',baixo:'S',esquerda:'A',direita:'D', atacar:'SPACE' });
  }

  criarHUD() {
    const padding = 20;
    this.coracoes = [...Array(5)].map((_,i)=>this.add.image(padding+i*45,padding,'coracoes').setScale(0.06).setScrollFactor(0));
    this.textoMoedas = this.add.text(800, 20, `🪙 0`, {fontSize:'22px',color:'#fff'}).setScrollFactor(0);
    this.moedasColetadas = 0;
  }

  criarMoedas() {
    this.moedas = this.physics.add.group();
    [[700,800],[1100,1000],[1300,900]].forEach(([x,y]) => {
      const moeda = this.moedas.create(x,y,'moeda').setScale(0.06);
      moeda.body.setAllowGravity(false);
    });
    this.physics.add.overlap(this.lina,this.moedas,(lina,moeda)=>{
      moeda.destroy();
      this.moedasColetadas++;
      this.atualizarHUD();
    });
  }

  atualizarHUD() {
    this.textoMoedas.setText(`🪙 ${this.moedasColetadas}`);
    const visiveis = Math.ceil(this.vida/20);
    this.coracoes.forEach((c,i)=>c.setVisible(i<visiveis));
  }

  criarOgros() {
    this.ogros = this.physics.add.group();
    [[200,-100],[-200,-100],[200,100],[-200,100],[150,-150],[-150,150]].forEach(([dx,dy]) => {
      const ogro = this.ogros.create(960+dx,960+dy,'vilao1').setScale(0.1);
      ogro.vida = 25;
      ogro.barraVida = this.add.graphics().setDepth(1);
    });
  }

  update() {
    if (this.morta) return;
    const spd = 200;
    let vx=0, vy=0;

    if (this.teclas.cima.isDown) { vy=-spd; this.playAnim('andar_costas'); }
    else if (this.teclas.baixo.isDown) { vy=spd; this.playAnim('andar_frente'); }
    else if (this.teclas.direita.isDown) { vx=spd; this.playAnim('andar_direita'); }
    else if (this.teclas.esquerda.isDown) { vx=-spd; this.playAnim('andar_esquerda'); }
    else this.lina.anims.stop();

    this.lina.setVelocity(vx, vy);

    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar)) {
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

      if (dist<60 && this.vida>0) {
        this.vida -= this.temEscudo?0:0.1;
        this.atualizarHUD();
        if (this.vida<=0) {
          this.morta = true;
          this.lina.anims.play('lina_morrendo',true);
          this.lina.once('animationcomplete',()=>this.scene.start('MenuPrincipal'));
        }
      }
    });

    if (this.ogros.countActive() === 0 && !this.transicaoFeita) {
      this.transicaoFeita = true;
      this.cameras.main.fadeOut(1000,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete',()=>{
        this.scene.start('Fase2');
      });
    }
  }

  playAnim(anim) {
    if (this.lina.anims.currentAnim?.key!==anim) this.lina.anims.play(anim,true);
  }
}

export { Fase1, LojaScene };
