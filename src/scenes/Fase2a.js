import Phaser from 'phaser';

class LojaScene2 extends Phaser.Scene {
  constructor() { super('LojaScene2'); }
  init(data) { this.parent = data.parent; }
  // ...existing code da loja igual Fase1...
}

class Fase2a extends Phaser.Scene {
  constructor() { super('Fase2a'); }

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

  create(data) {
    this.add.image(0,0,'mapa_fase2').setOrigin(0).setDisplaySize(1920,1920);
    this.physics.world.setBounds(0,0,1920,1920);
    this.cameras.main.setBounds(0,0,1920,1920);

    this.lina = this.physics.add.sprite(960,960,'lina_frente').setScale(0.8).setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.lina);
    this.vida = data?.vida ?? 100;
    this.danoExtra = data?.danoExtra ?? 0;
    this.temEscudo = false;
    this.morta = false;
    this.transicaoFeita = false;
    this.totalOgrosGerados = 0;
    this.maxOgros = 15;
    this.moedasColetadas = data?.moedasColetadas ?? 0;

    this.criarAnimacoes();
    this.criarControles();
    this.criarHUD();
    this.criarOgros();

    this.spawnTimer = this.time.addEvent({
      delay: 4000, loop: true, callback: () => {
        if (this.totalOgrosGerados < this.maxOgros) this.spawnNovaOnda();
      }
    });

    this.input.keyboard.on('keydown-C', ()=> {
      if (!this.scene.isActive('LojaScene2')) {
        this.scene.launch('LojaScene2',{parent:this});
        this.scene.pause();
      }
    });
  }

  criarAnimacoes() {
    // ...existing code igual Fase1...
  }

  criarControles() {
    // ...existing code igual Fase1...
  }

  criarHUD() {
    // Não cria corações nem moedas do zero, só atualiza HUD com valores recebidos
    const padding = 20;
    this.coracoes = [...Array(5)].map((_,i)=>this.add.image(padding+i*45,padding,'coracoes').setScale(0.06).setScrollFactor(0));
    this.textoMoedas = this.add.text(800, 20, `🪙 ${this.moedasColetadas}` , {fontSize:'22px',color:'#fff'}).setScrollFactor(0);
    this.atualizarHUD();
  }

  criarOgros() {
    // ...existing code igual Fase1...
  }

  spawnNovaOnda() {
    // ...existing code igual Fase1...
  }

  update() {
    // ...existing code igual Fase1...
  }

  playAnim(anim) {
    // ...existing code igual Fase1...
  }
}

export { Fase2a, LojaScene2 };
