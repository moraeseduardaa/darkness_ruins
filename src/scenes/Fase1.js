import Phaser from 'phaser';

class Fase1 extends Phaser.Scene {
  constructor() {
    super('Fase1'); // Nome da cena
  }

  preload() {
    // Carregamento dos recursos
    this.load.image('npc_inicio', 'assets/Personagens/npc_inicio.png');
    this.load.image('vilao1', 'assets/Personagens/vilao1.png');
    this.load.image('mapa_vilarejo', 'assets/Mapas/fase1a.png');
    this.load.image('coracoes', 'assets/Personagens/hud_coracoes.png');

    // Sprites da personagem Lina (quatro direções)
    this.load.spritesheet('lina_frente', 'assets/Sprites/lina/lina andando de frente-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_costas', 'assets/Sprites/lina/lina andando costas-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_direita', 'assets/Sprites/lina/lina andando direita-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('lina_esquerda', 'assets/Sprites/lina/lina andando esquerda-sprite-sheet.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    document.body.style.overflow = 'hidden'; // Esconde rolagem do navegador

    const largura = 1920;
    const altura = 1920;

    // Adiciona imagem de fundo
    this.fundo = this.add.image(0, 0, 'mapa_vilarejo')
      .setOrigin(0, 0)
      .setDepth(-2)
      .setDisplaySize(largura, altura);

    // Define os limites da física e da câmera
    this.physics.world.setBounds(0, 0, largura, altura);
    this.cameras.main.setBounds(0, 0, largura, altura);

    const larguraTela = this.sys.game.canvas.width;
    const alturaTela = this.sys.game.canvas.height;

    // Introdução: painel escuro, NPC e texto explicativo
    const fundoEscuro = this.add.rectangle(
      larguraTela / 2, alturaTela / 2, larguraTela, alturaTela, 0x000000, 0.8
    ).setDepth(2);

    const imagemIntro = this.add.image(
      larguraTela / 2, alturaTela / 2 - 50, 'npc_inicio'
    ).setScale(0.18).setDepth(3);

    const textoIntro = this.add.text(
      larguraTela / 2, alturaTela / 2 + 100,
      'Olá, Lina!\nUse W, A, S, D para se mover e SPACE para atacar.\nVocê enfrentará 4 fases cheias de perigos.\nSupere todas... e derrote Ghorn na fase final para salvar a ilha!',
      {
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: larguraTela * 0.8 },
      }
    ).setOrigin(0.5).setDepth(3);

    // Após 5 segundos, remove a introdução e inicia a fase
    this.time.delayedCall(5000, () => {
      fundoEscuro.destroy();
      imagemIntro.destroy();
      textoIntro.destroy();
      this.iniciarFase();
    });
  }

  iniciarFase() {
    // Mensagem inicial
    this.add.text(1920 / 2, 30, 'Bem-vindo à Fase 1', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(2);

    // Criação da Lina
    this.lina = this.physics.add.sprite(960, 960, 'lina_frente', 0).setScale(2);
    this.lina.setCollideWorldBounds(true);
    this.lina.setImmovable(true);
    this.vida = 100;

    // Câmera segue a personagem
    this.cameras.main.startFollow(this.lina);

    // Criação das animações da Lina
    this.anims.create({ key: 'andar_frente', frames: this.anims.generateFrameNumbers('lina_frente', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_costas', frames: this.anims.generateFrameNumbers('lina_costas', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_direita', frames: this.anims.generateFrameNumbers('lina_direita', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'andar_esquerda', frames: this.anims.generateFrameNumbers('lina_esquerda', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });

    // Criação dos corações da HUD
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

    // Teclas de movimentação e ataque
    this.teclas = this.input.keyboard.addKeys({ cima: 'W', baixo: 'S', esquerda: 'A', direita: 'D', atacar: 'SPACE' });

    // Lista de ogros e posições de spawn
    this.ogros = [];
    this.spawnIndex = 0;
    this.spawnOffsets = [[200, -100], [-200, -100], [200, 100], [-200, 100], [150, -150], [-150, 150]];

    // Gera 3 ondas de ogros
    this.spawnOgroWave(2);
    this.time.addEvent({ delay: 7000, callback: () => this.spawnOgroWave(2) });
    this.time.addEvent({ delay: 14000, callback: () => this.spawnOgroWave(2) });
  }

  atualizarCoracoes() {
    // Atualiza visibilidade dos corações com base na vida
    const coracoesVisiveis = Math.ceil(this.vida / 20);
    this.coracoes.forEach((c, i) => {
      c.setVisible(i < coracoesVisiveis);
    });
  }

  spawnOgroWave(qtd) {
    // Gera ogros nas posições definidas
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

      // Colisão entre Lina e ogro
      this.physics.add.collider(this.lina, ogro, () => {
        const now = this.time.now;
        if (now - ogro.lastAttackTime > 1000 && this.vida > 0) {
          this.vida -= 10;
          this.atualizarCoracoes();
          this.lina.setTint(0xff0000); // efeito de dano
          this.time.delayedCall(200, () => this.lina.clearTint());
          ogro.lastAttackTime = now;

          if (this.vida <= 0) {
            this.scene.restart(); // reinicia a fase
          }
        }
      }, null, this);
    }
  }

  update() {
    if (!this.lina) return;

    const speed = 200;
    const { cima, baixo, esquerda, direita, atacar } = this.teclas;
    let moving = false;
    this.lina.body.setVelocity(0);
    let vx = 0;
    let vy = 0;

    // Movimento e animações da Lina
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

    // Ataque com espaço
    if (Phaser.Input.Keyboard.JustDown(atacar)) {
      this.lina.setScale(2); // efeito de ataque
      this.time.delayedCall(150, () => {
        this.lina.setScale(2); // reset visual
      });

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

    // Movimento dos ogros e atualização da barra de vida
    this.ogros.forEach(ogro => {
      if (ogro.active) {
        this.physics.moveToObject(ogro, this.lina, 25); // ogro persegue Lina

        // Barra de vida desenhada sobre o ogro
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

    // Verifica se todos os ogros foram derrotados para mudar de fase
    const totalOgrosEsperados = this.spawnOffsets.length;
    if (this.ogros.length === totalOgrosEsperados && this.ogros.every(o => !o.active)) {
      if (!this.transicaoIniciada) {
        this.transicaoIniciada = true;
        this.cameras.main.fadeOut(1000, 0, 0, 0); // efeito de fade
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Fase2'); // transição para a próxima fase
        });
      }
    }
  }
}

export default Fase1;
