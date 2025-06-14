import Phaser from 'phaser';

class Fase4 extends Phaser.Scene {
  constructor() {
    super('Fase4');
  }

  init(data) {
    this.vida = data.vida || 100;
    this.danoExtra = data.danoExtra || 0;
    this.temEscudo = data.temEscudo || false;
    this.moedasColetadas = data.moedasColetadas || 0;
  }

  preload() {
    this.load.image('mapa_fase4','assets/Mapas/fase4a.png');
    this.load.image('coracoes','assets/Personagens/hud_coracoes.png');
    this.load.image('moeda','assets/Personagens/moeda.png');
    this.load.image('ghorn','assets/Personagens/ghorn.png');
    this.load.spritesheet('lina_frente','assets/Sprites/lina/andando/sprite-sheet-andando-de-frente.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_costas','assets/Sprites/lina/andando/sprite_sheet_lina_andando_costas.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_direita','assets/Sprites/lina/andando/sprite-sheet-lina-andando-direita.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_esquerda','assets/Sprites/lina/andando-esquerda.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_morrendo','assets/Sprites/lina/morrendo/sprite-sheet-morrendo.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_frente','assets/Sprites/lina/atacando/sprite-sheet-ataque-de-frente.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_costas','assets/Sprites/lina/atacando/sprite-sheet-atacando-de-costas.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_direita','assets/Sprites/lina/atacando/sprite-sheet-ataque-direita.png',{frameWidth:128,frameHeight:128});
    this.load.spritesheet('lina_ataque_esquerda','assets/Sprites/lina/atacando/sprite-sheet-ataque-esquerda.png',{frameWidth:128,frameHeight:128});

  }

  create() {
    this.add.image(0,0,'mapa_fase4').setOrigin(0).setDisplaySize(1920,1920);
    this.physics.world.setBounds(0,0,1920,1920);
    this.cameras.main.setBounds(0,0,1920,1920);

    this.lina = this.physics.add.sprite(960,960,'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);
    this.morta = false;
    this.transicaoFeita = false;

    this.criarAnimacoes();
    this.criarControles();
    this.criarHUD();
    this.criarMoedas();
    this.criarGhorn();

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
    this.coracoes = [...Array(5)].map((_,i)=>this.add.image(padding+i*45,padding,'coracoes').setScale(0.06).setScrollFactor(0));
    this.textoMoedas = this.add.text(800, 20, `🪙 ${this.moedasColetadas}`, {fontSize:'22px',color:'#fff'}).setScrollFactor(0);
    this.atualizarHUD();
  }

  criarMoedas() {
    this.moedas = this.physics.add.group();
    [[600,400],[1300,800],[800,1400]].forEach(([x,y]) => {
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
    const visiveis = Math.ceil(this.vida / 20);
    this.coracoes.forEach((c, i) => c.setVisible(i < visiveis));
  }

  criarGhorn() {
    this.ghorn = this.physics.add.sprite(1500, 1000, 'ghorn').setScale(0.2);
    this.ghorn.vida = 100;
    this.ghorn.barraVida = this.add.graphics().setDepth(1);
  }

  update() {
if (this.morta) return;
    const spd = 200; let vx=0, vy=0;

    if (this.teclas.cima.isDown) { vy=-spd; this.playAnim('andar_costas'); this.direcao='costas'; }
    else if (this.teclas.baixo.isDown) { vy=spd; this.playAnim('andar_frente'); this.direcao='frente'; }
    else if (this.teclas.direita.isDown) { vx=spd; this.playAnim('andar_direita'); this.direcao='direita'; }
    else if (this.teclas.esquerda.isDown) { vx=-spd; this.playAnim('andar_esquerda'); this.direcao='esquerda'; }
    else this.lina.anims.stop();

    this.lina.setVelocity(vx, vy);

    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar)) {
      const animAtk = {
        'frente':'ataque_frente', 'costas':'ataque_costas',
        'direita':'ataque_direita', 'esquerda':'ataque_esquerda'
      }[this.direcao || 'frente'];
      this.lina.play(animAtk);
      this.time.delayedCall(400, ()=> this.playAnim('andar_frente'));

    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar)) {
      if (Phaser.Math.Distance.Between(this.lina.x,this.lina.y,this.ghorn.x,this.ghorn.y)<100) {
        this.ghorn.vida -= (5 + this.danoExtra);
        if (this.ghorn.vida <= 0) {
          this.ghorn.barraVida.destroy();
          this.ghorn.destroy();
          this.ghorn = null;

          this.cameras.main.fadeOut(1000,0,0,0);
          this.cameras.main.once('camerafadeoutcomplete',()=>{
            // Substitua por 'TelaFinal' ou o que quiser
            this.scene.start('CreditosIniciais', {
              vida: this.vida,
              danoExtra: this.danoExtra,
              temEscudo: this.temEscudo,
              moedasColetadas: this.moedasColetadas
            });
          });
        }
      }
    }
  }

    const dist = Phaser.Math.Distance.Between(this.lina.x,this.lina.y,this.ghorn.x,this.ghorn.y);
    if (dist > 20) {
      this.physics.moveToObject(this.ghorn, this.lina, 40);
    } else {
      this.ghorn.setVelocity(0);
    }

    this.ghorn.barraVida.clear();
    const p = Math.max(this.ghorn.vida / 100, 0);
    this.ghorn.barraVida.fillStyle(0x000000).fillRect(this.ghorn.x-40,this.ghorn.y-this.ghorn.displayHeight/2-20,80,10);
    this.ghorn.barraVida.fillStyle(0xff0000).fillRect(this.ghorn.x-39,this.ghorn.y-this.ghorn.displayHeight/2-19,78*p,8);

    if (dist<60 && this.vida>0) {
      this.vida -= this.temEscudo?0:0.1;
      this.atualizarHUD();
      if (this.vida<=0) {
        this.morta = true;
        this.lina.anims.play('lina_morrendo',true);
        this.lina.once('animationcomplete',()=>{
        this.scene.start('Fase1');
        });
      }
    }
  }

  playAnim(anim) {
    if (this.lina.anims.currentAnim?.key!==anim) this.lina.anims.play(anim,true);
  }
}

export default Fase4;
