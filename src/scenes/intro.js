import Phaser from 'phaser';

class Intro extends Phaser.Scene {
  constructor() {
    super('Intro');
  }

  preload() {
    this.load.image('npc_inicio', 'assets/Personagens/npc_inicio.png');
    this.load.image('lina', 'assets/Personagens/lina.png');
    this.load.image('fase4a', 'assets/Mapas/fase4a.png');
    this.load.image('logo', 'assets/Personagens/logo.png'); 

    this.load.audio('thorn1', 'assets/audio/thorn1.mp3');
    this.load.audio('lina2', 'assets/audio/lina2.mp3');
    this.load.audio('thorn3', 'assets/audio/thorn3.mp3');
    this.load.audio('lina4', 'assets/audio/lina4.mp3');
    this.load.audio('thorn5', 'assets/audio/thorn5.mp3');
    this.load.audio('lina6', 'assets/audio/lina6.mp3');
    this.load.audio('thorn7', 'assets/audio/thorn7.mp3');
    this.load.audio('musica_entrada', 'assets/audio/musica_entrada.mp3');

  }

  create() {

    const larguraTela = this.sys.game.config.width;
    const alturaTela = this.sys.game.config.height;

    this.cameras.main.fadeIn(1500, 0, 0, 0);

    this.add.image(larguraTela / 2, alturaTela / 2, 'fase4a').setDepth(0).setDisplaySize(larguraTela, alturaTela);
    this.add.rectangle(larguraTela / 2, alturaTela / 2, larguraTela, alturaTela, 0x000000, 0.8).setDepth(1);
    this.add.image(larguraTela / 2, 80, 'logo').setOrigin(0.5).setDepth(3).setScale(0.25);

    this.gornImage = this.add.image(larguraTela * 0.25, alturaTela / 2 - 50, 'npc_inicio').setScale(0.18).setDepth(2);
    this.linaImage = this.add.image(larguraTela * 0.75, alturaTela / 2 - 50, 'lina').setScale(0.18).setDepth(2);

    this.dialogo = [
      { personagem: 'GORN', texto: 'Lina, que bom que chegou. A ilha está em perigo!' },
      { personagem: 'LINA', texto: 'O que aconteceu?' },
      { personagem: 'GORN', texto: 'Thorn despertou uma energia sombria. Ele criou exércitos de ogros para protegê-lo. A cada dia, sua força cresce.' },
      { personagem: 'LINA', texto: 'E como posso derrotar ele?' },
      { personagem: 'GORN', texto: 'Você precisará atravessar o vilarejo, as cavernas e a floresta, enfrentando os ogros até chegar ao labirinto onde Thorn o espera.' },
      { personagem: 'LINA', texto: 'Parece perigoso... Mas eu estou pronta.' },
      { personagem: 'GORN', texto: 'Lembre-se: coragem e estratégia serão suas maiores armas. Agora vá, o destino da ilha depende de você.' }
    ];

    this.falaAtual = 0;

    this.textoGorn = this.add.text(larguraTela * 0.25, alturaTela / 2 + 150, '', {
      fontFamily: 'Pixelify Sans',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: larguraTela * 0.35 }
    }).setOrigin(0.5).setDepth(3);

    this.textoLina = this.add.text(larguraTela * 0.75, alturaTela / 2 + 150, '', {
      fontFamily: 'Pixelify Sans',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: larguraTela * 0.35 }
    }).setOrigin(0.5).setDepth(3);

    this.pressEnter = this.add.text(larguraTela / 2, alturaTela - 50, "Pressione ENTER", {
      fontFamily: 'Pixelify Sans',
      fontSize: '18px',
      color: '#cccccc'
    }).setOrigin(0.5).setDepth(3);

    this.tweens.add({
      targets: this.pressEnter,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    this.mostrarFala();

    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.digitando) return;
      this.falaAtual++;
      if (this.falaAtual >= this.dialogo.length) {
        this.cameras.main.fadeOut(1500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
        this.sound.get('musica_entrada')?.stop(); 
        this.scene.start('Fase1');
        });
      } else {
        this.mostrarFala();
      }
    });
  }

  mostrarFala() {
    const fala = this.dialogo[this.falaAtual];

    this.textoGorn.setText('');
    this.textoLina.setText('');

    this.tocarAudio(this.falaAtual);

    if (fala.personagem === 'GORN') {
      this.gornImage.setTint(0xffffff);
      this.linaImage.setTint(0x666666);
      this.typeText(this.textoGorn, fala.personagem + ':\n' + fala.texto);
    } else {
      this.linaImage.setTint(0xffffff);
      this.gornImage.setTint(0x666666);
      this.typeText(this.textoLina, fala.personagem + ':\n' + fala.texto);
    }
  }

  tocarAudio(falaIndex) {
    const ordem = ['thorn1', 'lina2', 'thorn3', 'lina4', 'thorn5', 'lina6', 'thorn7'];
    const audioKey = ordem[falaIndex];
    if (this.audioAtual) {
      this.audioAtual.stop();
    }
    this.audioAtual = this.sound.add(audioKey);
    this.audioAtual.play();
  }

  typeText(textObject, fullText) {
    const length = fullText.length;
    let i = 0;
    this.digitando = true;

    this.time.addEvent({
      delay: 30,
      repeat: length - 1,
      callback: () => {
        textObject.setText(fullText.substr(0, i + 1));
        i++;
        if (i === length) {
          this.digitando = false;
        }
      }
    });
  }
}

export default Intro;
