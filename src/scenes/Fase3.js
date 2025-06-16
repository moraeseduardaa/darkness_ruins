import Phaser from 'phaser';

class Fase3 extends Phaser.Scene {
  constructor() {
    super('Fase3');
  }

  init(data) {
    this.vida = 100; 
    this.danoExtra = data.danoExtra || 0;
    this.temEscudo = data.temEscudo || false;
    this.moedasColetadas = data.moedasColetadas || 0;
  }

  preload() {
    this.load.image('mapa_fase3','assets/Mapas/fase3a.png');
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
    this.load.audio('som_faca', 'assets/audio/som_faca.mp3');
  }

  create() {
    this.add.image(0,0,'mapa_fase3').setOrigin(0).setDisplaySize(1920,1920);
    this.physics.world.setBounds(0,0,1920,1920);
    this.cameras.main.setBounds(0,0,1920,1920);
    this.somFaca = this.sound.add('som_faca', { volume: 0.2 }); 

    this.lina = this.physics.add.sprite(960,960,'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);
    this.morta = false;
    this.atacando = false;
    this.transicaoFeita = false;

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
    const centroX = this.scale.width / 2;
    this.iconeMoeda = this.add.image(centroX, 28, 'moeda')
      .setScale(0.05)
      .setScrollFactor(0)
      .setOrigin(1, 0.5);
    this.textoMoedas = this.add.text(centroX, 28, `${this.moedasColetadas}`, {
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
      [200, 200],     [1700, 200],   [200, 1700],    [1700, 1700], // [960, 960],
      [500, 1000],   [1400, 1000],  [960, 400],     [960, 1500],   [300, 300],
      [400, 600],    [600, 400],    [1500, 400],    [400, 1500],   [1500, 1500],
      [800, 300],    [300, 800],    [1600, 300],    [300, 1600],   [1600, 1600],
      [1200, 300],   [300, 1200],   [1600, 1200],   [1200, 1600],
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
    [
      [250,250],[1700,300],[1500,1500],[500,1700],
      [900,600],[600,1300],[1750,1750],[1300,400],
      [350,1750],[1850,1100],[1100,1850],[1850,1850],
      [800,800],[1600,800],[800,1600],[1600,1600]
    ].forEach(([x,y]) => {
      const ogro = this.ogros.create(x,y,'vilao1').setScale(0.12);
      ogro.vida = 40;
      ogro.barraVida = this.add.graphics().setDepth(1);
    });
  }
  update() {
    if (this.morta) return;
    const spd = 200; let vx=0, vy=0;

    if (this.teclas.cima.isDown) { vy=-spd; this.playAnim('andar_costas'); this.direcao='costas'; }
    else if (this.teclas.baixo.isDown) { vy=spd; this.playAnim('andar_frente'); this.direcao='frente'; }
    else if (this.teclas.direita.isDown) { vx=spd; this.playAnim('andar_direita'); this.direcao='direita'; }
    else if (this.teclas.esquerda.isDown) { vx=-spd; this.playAnim('andar_esquerda'); this.direcao='esquerda'; }
    else if (!this.atacando) this.lina.anims.stop();
    else this.lina.anims.stop();

    this.lina.setVelocity(vx, vy);

    if (Phaser.Input.Keyboard.JustDown(this.teclas.atacar) && !this.atacando && !this.morta) {
      this.atacando = true;   
      this.somFaca.play();
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
      const p = Math.max(ogro.vida/35,0);
      ogro.barraVida.fillStyle(0x000000).fillRect(ogro.x-30,ogro.y-ogro.displayHeight/2-15,60,8);
      ogro.barraVida.fillStyle(0xff0000).fillRect(ogro.x-29,ogro.y-ogro.displayHeight/2-14,58*p,6);

      if (dist < 70 && this.vida > 0) {
        const danoRecebido = this.temEscudo ? 0.15 : 0.2;
        this.vida -= danoRecebido;
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

    if (this.ogros.countActive() === 0 && !this.transicaoFeita) {
      this.transicaoFeita = true;
      this.cameras.main.fadeOut(1000,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete',()=>{
        this.scene.start('Fase4', {
          vida: this.vida,
          danoExtra: this.danoExtra,
          temEscudo: this.temEscudo,
          moedasColetadas: this.moedasColetadas
        });
      });
    }
  }

  playAnim(anim) {
    if (this.lina.anims.currentAnim?.key!==anim) this.lina.anims.play(anim,true);
  }
}

export default Fase3;
