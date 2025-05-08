import React, { useEffect } from 'react';
import p5 from "p5";
import 'p5/lib/addons/p5.sound';

let angle = 0;
let rotacao = 0;
let notaX = 0;
let notaY = 0;
let sequencia = 0;
let score = 0;
let agendaIndex = 0;
let radius = 275;
let staticBalls = [];
let etapa = 0;
let vidas = [true, true, true, true, true, true, true, true, true, true]; 
let mostrarNota = false;
let mostrarErro = false;
let telaInicial = false;
let introducao = true;
let tutorial = false;
let jogoAcabou = false;
let startTime;
let dificult;
let soundMap; 
let qntFinal;
let FinalMusic = qntFinal;
let FinalMusicGera = qntFinal;
let opacidade = 0;
let fadeOut = false;
let fadeIn = false;

const colorOptions = [
  { color: [0, 0, 255], letra: 'A' },
  { color: [255, 255, 0], letra: 'S' },
  { color: [0, 255, 0], letra: 'J' },
  { color: [255, 0, 0], letra: 'K' },
  { color: [128, 0, 128], letra: 'L' }
];

//function Sketch({movS}) {
const Sketch = () => {
    useEffect(() => {
      const sketch = (p) => {
    
      let nota1, nota2, nota3, nota4, nota5, nota6, nota7, intro;
      let palheta, notaTocada, notaTocada2, violao, vida, errou, notas, exemplo;

      p.preload = () => {
        intro = p.loadSound('/sons/intro.mp3');
        nota1 = p.loadSound('/sons/nota1.wav');
        nota2 = p.loadSound('/sons/nota2.wav');
        nota3 = p.loadSound('/sons/nota3.wav');
        nota4 = p.loadSound('/sons/nota4.wav');
        nota5 = p.loadSound('/sons/nota5.wav');
        nota6 = p.loadSound('/sons/nota6.wav');
        nota7 = p.loadSound('/sons/nota7.wav');

        palheta = p.loadImage('/img/palheta.png');
        notaTocada = p.loadImage('/img/notaTocada.png');
        notaTocada2 = p.loadImage('/img/notaTocada2.png');
        violao = p.loadImage('/img/violao.png');
        vida = p.loadImage('/img/vida.png');
        errou = p.loadImage('/img/errou.png');
        notas = p.loadImage('/img/notas.png');
        exemplo = p.loadImage('/img/exemplo.gif');
      };

       p.setup = () => {                 
        p.createCanvas(p.windowWidth, p.windowHeight); 
        startTime = p.millis();     
        // Toca a música quando o usuário interagir
        p.userStartAudio().then(() => {
          if (!intro.isPlaying()) {
            intro.loop();
          }
        });        
      };

      p.draw = () => {        
        soundMap = { nota1, nota2, nota3, nota4, nota5, nota6, nota7 };   

        if(introducao){
          perguntinha();
          return;
        } 

        if(tutorial){
          apresentaJogo();
          return;
        }
        
        if (telaInicial) {
          escolherDificuldade();  
          return;          
        }

        //Frenquência e sequência com que as notas aparecem.
        const spawnAgenda = [
          { time: 2000 * dificult, sound: 'nota1' },
          { time: 2500 * dificult, sound: 'nota2' },
          { time: 3000 * dificult, sound: 'nota3' },
          { time: 3500 * dificult, sound: 'nota2' },

          { time: 4000 * dificult, sound: 'nota4' },
          { time: 4500 * dificult, sound: 'nota2' },
          { time: 5000 * dificult, sound: 'nota5' },
          { time: 5500 * dificult, sound: 'nota3' },

          { time: 6000 * dificult, sound: 'nota6' },
          { time: 6500 * dificult, sound: 'nota2' },
          { time: 7000 * dificult, sound: 'nota3' },
          { time: 7500 * dificult, sound: 'nota2' },

          { time: 8000 * dificult, sound: 'nota7' },
          { time: 8500 * dificult, sound: 'nota2' },
          { time: 9000 * dificult, sound: 'nota3' },
          { time: 9500 * dificult, sound: 'nota2' },
        ];
        
        //p.background(220);
        
        //circulo central
        p.push()
        p.fill(0)
        p.circle(p.width / 2, p.height / 2, radius*2.5);
        p.pop()       
        
        p.image(violao, p.width / 2 + 950, p.height/2, p.Width, p.Height );              
        
        p.push()
        p.strokeWeight(1);
        p.textSize(25);
        p.fill(250,0,0)
        p.text("Pontuação:", 100, 50);
        p.fill(150,150,150)
        p.text(parseInt(score), 200, 50);
        p.pop()

        p.translate(p.width / 2, p.height / 2); 
        
        // Posição da bolinha girando
        let x = radius * p.cos(angle);
        let y = radius * p.sin(angle);
        
        // Desenha a bolinha girando
        let movingRadius = 30;
          
        if (palheta) {
          let size = 80;
          p.imageMode(p.CENTER);
          p.image(palheta, x, y, size, size); 
        }       
        
        angle += rotacao;
        
        let elapsed = p.millis() - startTime;
        
        // Checa se é hora de spawnar a próxima bolinha
        if (agendaIndex < spawnAgenda.length && elapsed >= spawnAgenda[agendaIndex].time && FinalMusicGera >= 0 ) {
          spawnStaticBall(x, y, angle, spawnAgenda[agendaIndex].sound);
          FinalMusicGera--;
          agendaIndex++;
        }
        
        // Quando termina, reinicia para fazer o loop
        if (agendaIndex >= spawnAgenda.length ) {
          agendaIndex = 0;
          startTime = p.millis(); 
        }        
            
        for (let b of staticBalls) {
          let d = p.dist(x, y, b.x, b.y);
          if (!b.activated && d < movingRadius) {
            b.activated = true;                 
            console.log("gera:",FinalMusicGera);
          }    
          p.fill(b.color[0], b.color[1], b.color[2]);          
          p.circle(b.x, b.y, 50);
          p.stroke(51);
          p.fill(0); 
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(24);
          p.text(b.letra, b.x, b.y);    
              
        }

        updateStaticBalls();       
        checarColisoes(x, y);
        
        if (mostrarNota && notaTocada && sequencia < 5) {
          p.imageMode(p.CENTER);
          p.image(notaTocada, notaX, notaY, 500, 500); // ajusta o tamanho conforme necessário         
        }
        if (mostrarNota && notaTocada && sequencia >= 5) {
          p.imageMode(p.CENTER);
          p.image(notaTocada2, notaX, notaY, 1000, 1000); // ajusta o tamanho conforme necessário         
        }  
        if (mostrarErro && errou ) {
          p.imageMode(p.CENTER);
          p.image(errou, 0, 0, 500, 500); // ajusta o tamanho conforme necessário         
        } 
                              
        const vidaSize = 100;
        
        for (let i = 0; i < vidas.length; i++) {
          if (vidas[i] && vida) {
            p.image(vida, -550 + i * (vidaSize + 10), -400, vidaSize, vidaSize);
          }
        }
        
        if (FinalMusic < 0 || vidas.length === 0) {
          jogoAcabou = true;
        }        
        
        if (jogoAcabou) {
          p.push();
          p.background(0, 150); // escurece com leve transparência
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(50);
          p.text("FIM DE JOGO", 0, 0 - 30);
          p.textSize(30);
          p.text("Pontuação: " + Math.floor(score), 0, 0 + 20);
          p.text("Aperte qualquer tecla para sair ", 0, 0 + 120);
          p.pop();  
          p.noLoop();          
          p.keyPressed = () => {
            reiniciarJogo();
            telaInicial = true;
            if (!intro.isPlaying()) {
            intro.loop();
          }
          }
        }
      };
      
      //Functions ------------------

      function perguntinha(){
        p.background(30);

        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(60);
        p.text("--> Herói do violão <--", p.width / 2, p.height / 2 - 320);

        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(40);
        p.text("Use o mouse para escolher uma opção", p.width / 2, p.height / 2 - 220);

        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(40);
        p.text("Deseja fazer o tutorial do jogo ?", p.width / 2, p.height / 2 - 120);
      
        p.textSize(28);
        p.rectMode(p.CENTER);
        p.noStroke();
      
        let btnX = p.width / 2 ; 
        let btnY = p.height / 2 ;

        // Sim
        if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY - 70  && p.mouseY < btnY - 10) {          
          p.fill(200, 100, 100); 
        } else {
          p.fill(100);          
        }
        p.rect(p.width / 2, p.height / 2 - 40, 200, 50);
        p.fill(0);
        p.text("Sim", p.width / 2, p.height / 2 - 40);   
        
        // com certeza
        if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 75  && p.mouseY < btnY + 135) {
          p.fill(200, 100, 100); 
        } else {
          p.fill(100);
        }
        p.rect(p.width / 2, p.height / 2 + 100, 200, 50);
        p.fill(0);
        p.text("Com certeza", p.width / 2, p.height / 2 + 100);

        p.mousePressed = () => {   
          if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY - 70  && p.mouseY < btnY - 10) {     
            introducao = false; 
            tutorial = true;     
            etapa = 1;   
            //telaInicial = true;        
                
          }
          if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 75  && p.mouseY < btnY + 135) {
            introducao = false;
            tutorial = true;
            etapa = 1;
            //telaInicial = true;  

          }
        } 
      }

      function apresentaJogo(){
        p.background(30);
        
        //etapa 1
        
        if (etapa === 1 && notas) {
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(40);
          p.text("Essa são as notas", p.width / 2, p.height / 2 - 220);
          p.imageMode(p.CENTER);
          p.image(notas, p.width / 2, p.height / 2, 693, 210); // ajusta o tamanho conforme necessário
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(40);
          p.text("cada nota tem uma COR e LETRA referente a uma tecla do teclado", p.width / 2, p.height / 2 + 220 );  
        }  

        let btnX = p.width / 2 ; 
        let btnY = p.height / 2  ;
        if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 310 && p.mouseY < btnY + 380) {          
          p.fill(200, 100, 100); 
        } else {
          p.fill(100);          
        }
        p.mousePressed = () => {   
          if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 310 && p.mouseY < btnY + 380 && fadeOut === false) {     
            introducao = false; 
            tutorial = true; 
            fadeOut = true;
            opacidade = 0;               
            //telaInicial = true;    
          }
        }
        p.rect(p.width / 2, p.height / 2 + 350, 200, 50);
        p.fill(0);
        p.text("Próximo", p.width / 2, p.height / 2 + 350);   

        if (etapa === 2) {
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(40);
          p.text("essa é a palheta", p.width / 2, p.height / 2 - 420);
          p.text("ela orbita a boca do violão", p.width / 2, p.height / 2 - 380);
          p.imageMode(p.CENTER);
          p.image(palheta, p.width / 2, p.height / 2, 128, 128);                    
        }  

        if (etapa === 3) {
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(40);
          p.text("Toda vez que a palheta fica na mesma posição que a nota", p.width / 2, p.height / 2 - 420);
          p.text("você terá que clicar a tecla referente a nota", p.width / 2, p.height / 2 - 380);
          p.text("obs: As notas tem padrão de cor e letra, mas não de sequência.", p.width / 2, p.height / 2 - 340);
          p.imageMode(p.CENTER);
          p.image(exemplo, p.width / 2, p.height / 2, 1000, 600);         
        } 

        if(etapa >= 4){          
          etapa = 4;
          tutorial = false;
          telaInicial = true;

        }


        if (fadeOut) {
          p.noStroke();
          p.fill(0, opacidade);
          p.rect(0, 0, p.windowWidth *2, p.windowHeight*2);
      
          opacidade += 1; // velocidade do fade
          if (opacidade >= 255) {
            opacidade = 255;
            fadeOut = false; 
            etapa++;      
            fadeIn = true;      
          }
        }

        if (fadeIn) {
          p.noStroke();
          p.fill(0, opacidade);
          p.rect(0, 0, p.windowWidth *2, p.windowHeight*2);
      
          opacidade -= 1; // velocidade do fade
          if (opacidade <= 0) {
            opacidade = 0;
            fadeOut = false;                   
            fadeIn = false;      
          }
        }
      }
            
      function escolherDificuldade(){  
        
        p.background(30);
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(40);
        p.text("Escolha a Dificuldade", p.width / 2, p.height / 2 - 120);
      
        p.textSize(28);
        p.rectMode(p.CENTER);
        p.noStroke();
      
        // Coordenadas e tamanho do botão
        let btnX = p.width / 2 ; // centralizado horizontalmente
        let btnY = p.height / 2 ;

        // Botão 1
        if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY - 70  && p.mouseY < btnY - 10) {          
          p.fill(200, 100, 100); // Hover
        } else {
          p.fill(100);          
        }
        p.rect(p.width / 2, p.height / 2 - 40, 200, 50);
        p.fill(0);
        p.text("Fácil", p.width / 2, p.height / 2 - 40);           
      
        // Botão Médio
        if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 5  && p.mouseY < btnY +65) {
          p.fill(200, 100, 100);           
        } else {
          p.fill(100);
        }
        p.rect(p.width / 2, p.height / 2 + 30, 200, 50);
        p.fill(0);
        p.text("Médio", p.width / 2, p.height / 2 + 30);

        // Botão Difícil
        if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 75  && p.mouseY < btnY + 135) {
          p.fill(200, 100, 100); // Hover
        } else {
          p.fill(100);
        }
        p.rect(p.width / 2, p.height / 2 + 100, 200, 50);
        p.fill(0);
        p.text("Difícil", p.width / 2, p.height / 2 + 100);

        p.mousePressed = () => {   
          if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY - 70  && p.mouseY < btnY - 10 && telaInicial === true) {  
            if (intro.isPlaying()) {
              intro.stop(); 
            }
            rotacao = 0.03;
            qntFinal = 16;
            dificult = 2.0;
            telaInicial = false;
            jogoAcabou = false;
            reiniciarJogo(); 
          } 
          if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 5  && p.mouseY < btnY +65 && telaInicial === true) {
            if (intro.isPlaying()) {
              intro.stop(); 
            }           
            rotacao = 0.03;
            qntFinal = 32;
            dificult = 1.0;
            telaInicial = false;
            jogoAcabou = false;
            reiniciarJogo();  
          } 
          if (p.mouseX > btnX - 100  && p.mouseX < btnX + 100  && p.mouseY > btnY + 75  && p.mouseY < btnY + 135 && telaInicial === true) {
            if (intro.isPlaying()) {
              intro.stop(); 
            }
            rotacao = 0.04;
            qntFinal = 128;
            dificult = 0.9;
            telaInicial = false;
            jogoAcabou = false;
            reiniciarJogo();  
          }
        }         
      }      

      //Resteta todas as variáveis importantes
      function reiniciarJogo() {           
        angle = 0;
        radius = 275;
        staticBalls = [];
        soundMap = undefined; 
        agendaIndex = 0;
        startTime = p.millis(); 
        mostrarNota = false;
        mostrarErro = false;
        notaX = 0;
        notaY = 0;
        sequencia = 0;
        score = 0;
        vidas = [true, true, true, true, true, true, true, true, true, true]; // resetar para 3 vidas
        FinalMusic = qntFinal;
        FinalMusicGera = qntFinal;
        jogoAcabou = false;
        p.loop(); // retoma o draw() se tiver usado p.noLoop()
      }
      //gera as bolinhas/notas que serão destruidas.
      function spawnStaticBall(x, y, angle, soundName) { 
        let som = soundMap[soundName] || null;
        let normalX = -p.sin(angle);
        let normalY = p.cos(angle);
        let offset = -200;      
        let spawnX = x + normalX * offset;
        let spawnY = y + normalY * offset;      
        let opcao = p.random(colorOptions);
      
        staticBalls.push({
          x: spawnX,
          y: spawnY,
          destinoX: x,
          destinoY: y,
          color: opcao.color,
          letra: opcao.letra,
          activated: false,
          som: som
        });     
       }

      // movimenta as bolinhas/notas até a Boca do violão
      function updateStaticBalls() {
        for (let ball of staticBalls) {
          let dx = ball.destinoX - ball.x;
          let dy = ball.destinoY - ball.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
      
          if (dist > 1) {
            let speed = 2;
            let vx = (dx / dist) * speed;
            let vy = (dy / dist) * speed;
      
            ball.x += vx;
            ball.y += vy;
          } else {
            // Quando estiver perto o suficiente, fixa no destino
            ball.x = ball.destinoX;
            ball.y = ball.destinoY;
          }
        }
      }
      
      // gerencia mecanicas relacionadas a colisão
      function checarColisoes(x, y) {        
        p.keyPressed = function () {
          let tecla = p.key.toUpperCase();        
          for (let i = staticBalls.length - 1; i >= 0; i--) {
            let b = staticBalls[i];
            let d = p.dist(x, y, b.x, b.y);        
            if (b.letra === tecla && d < 50) {
              
              console.log("final:",FinalMusic);
              if (b.som && b.som.isLoaded()) {
                //b.som.setVolume(0.5);
                b.som.play(); 
              }    
              if(sequencia < 5){
                score = score + 5;
              }
              if(sequencia >= 5 ){
                score = score + 10;
              }
              if(sequencia > 10){
                score = score * 1.1;
                if (vidas.length < 10) {
                  vidas.push(true); // adiciona uma vida
                }
              }
              notaX = b.x;
              notaY = b.y;  
              mostrarNota = true;              
              staticBalls.splice(i, 1); // remove a bolinha 
              setTimeout(() => {
                mostrarNota = false;
              }, 150);              
              sequencia++;  
              FinalMusic--;            
              break;
            }
            if (b.letra !== tecla && d < 50) {
              if (vidas.length > 0) {
                vidas.pop(); // remove uma vida
              } 
            }
          }
        };

        for (let j = staticBalls.length - 1; j >= 0; j--) {
          let b = staticBalls[j];
          let d = p.dist(x, y, b.x, b.y); 
          if (d < 10 && !b.activationTime) {            
            b.activationTime = p.millis();
          }
                    
          if (b.activationTime && p.millis() - b.activationTime >= 500) {
            mostrarErro = true;
            sequencia = 0;            
            FinalMusic--;
            if (vidas.length > 0) {
              vidas.pop(); // remove uma vida
            }          

            staticBalls.splice(j, 1); 

            setTimeout(() => {
              mostrarErro = false;
            }, 150);
            break;
          }
        }        
      } 
      
      
    };
    const p5Instance = new window.p5(sketch, document.getElementById('p5-container'));

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div id="p5-container"></div>;
};

export default Sketch;


