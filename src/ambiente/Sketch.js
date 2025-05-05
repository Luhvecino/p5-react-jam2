// src/components/Sketch.js
import React, { useRef, useEffect } from 'react';
import p5 from "p5";
import 'p5/lib/addons/p5.sound';

let angle = 0;
let radius = 275;
let staticBalls = [];
let soundMap; 
let agendaIndex = 0;
let startTime;
let letras = ['A', 'S', 'J', 'K', 'L'];
let dificult = 1.75;

let mostrarNota = false;
let mostrarErro = false;
let notaX = 0;
let notaY = 0;
let sequencia = 0;
let score = 0;
let vidas = [true, true, true]; // 3 vidas

let qntFinal = 16;
let FinalMusic = qntFinal;
let FinalMusicGera = qntFinal;

let jogoAcabou = false;

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
    
      let nota1, nota2, nota3, nota4, nota5, nota6, nota7;
      let palheta, notaTocada, notaTocada2, violao, vida, errou;

      p.preload = () => {
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

      };

      //Frenquência e sequência com que as notas aparecem.
      const spawnAgenda = [
        { time: 500 * dificult, sound: 'nota1' },
        { time: 1000 * dificult, sound: 'nota2' },
        { time: 1500 * dificult, sound: 'nota3' },
        { time: 2000 * dificult, sound: 'nota2' },

        { time: 2500 * dificult, sound: 'nota4' },
        { time: 3000 * dificult, sound: 'nota2' },
        { time: 3500 * dificult, sound: 'nota5' },
        { time: 3750 * dificult, sound: 'nota3' },

        { time: 4500 * dificult, sound: 'nota6' },
        { time: 5000 * dificult, sound: 'nota2' },
        { time: 5500 * dificult, sound: 'nota3' },
        { time: 6000 * dificult, sound: 'nota2' },

        { time: 6500 * dificult, sound: 'nota7' },
        { time: 7000 * dificult, sound: 'nota2' },
        { time: 7500 * dificult, sound: 'nota3' },
        { time: 8000 * dificult, sound: 'nota2' },
      ];

     
      p.setup = () => {                 
        p.createCanvas(p.windowWidth, p.windowHeight);
        startTime = p.millis(); 
      };

      p.draw = () => {
            soundMap = { nota1, nota2, nota3, nota4, nota5, nota6, nota7 };   
            
            p.background(220);
           
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
            //Instrução
            let diametro = 60;
            let spacing = 150;
            let totalWidth = spacing * (letras.length - 1);
            let startX = (p.width - totalWidth) / 2;
            let y1 = 50;
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            for (let i = 0; i < colorOptions.length; i++) {
              let x = startX + i * spacing;
              
              // Extrai a cor e a letra do objeto
              let { color, letra } = colorOptions[i];
              let [r, g, b] = color;
              
              // Desenha o círculo
              p.fill(r, g, b);
              p.strokeWeight(1);
              p.stroke(51);
              p.circle(x, y1, diametro);
              
              // Desenha a letra preta no centro
              p.fill(0);
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(16);
              p.text(letra, x, y1);
            }           
            
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
            
            // Atualiza ângulo
            angle += 0.03;
            
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
              p.fill(255); 
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(24);
              p.text(b.letra, b.x, b.y);    
                  
            }
        updateStaticBalls();       
        checarColisoes(x, y);
        
        if (mostrarNota && notaTocada && sequencia < 5) {
          p.imageMode(p.CENTER);
          p.image(notaTocada, notaX, notaY, 250, 250); // ajusta o tamanho conforme necessário         
        }
        if (mostrarNota && notaTocada && sequencia >= 5) {
          p.imageMode(p.CENTER);
          p.image(notaTocada2, notaX, notaY, 500, 500); // ajusta o tamanho conforme necessário         
        }  
        if (mostrarErro && errou ) {
          p.imageMode(p.CENTER);
          p.image(errou, 0, 0, 500, 500); // ajusta o tamanho conforme necessário         
        }  
        
            // lógica normal do jogo
          
        const vidaSize = 100;
        
        for (let i = 0; i < vidas.length; i++) {
          if (vidas[i] && vida) {
            p.image(vida, -600 + i * (vidaSize + 10), -200, vidaSize, vidaSize);
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
          p.pop();  
          p.noLoop();
          p.keyPressed = () => {
            reiniciarJogo();
          }
        }
      };
      
      //Functions ------------------

      function reiniciarJogo() {   
        angle = 0;
        radius = 275;

        staticBalls = [];
        soundMap = undefined; // ou recarregar os sons, se necessário
        agendaIndex = 0;

        startTime = p.millis(); // recomeça a agenda

        letras = ['A', 'S', 'J', 'K', 'L'];
        dificult = 1.75; // se ela muda durante o jogo

        mostrarNota = false;
        mostrarErro = false;
        notaX = 0;
        notaY = 0;

        sequencia = 0;
        score = 0;

        vidas = [true, true, true]; // resetar para 3 vidas

        FinalMusic = qntFinal;
        FinalMusicGera = qntFinal;

        jogoAcabou = false;
        p.loop(); // retoma o draw() se tiver usado p.noLoop()
      }

      function spawnStaticBall(x, y, angle, soundName) {
        if (!soundMap) {
          console.warn("soundMap ainda não foi inicializado.");
          return;
        }

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
      
      function checarColisoes(x, y) {        
        p.keyPressed = function () {
          let tecla = p.key.toUpperCase();        
          for (let i = staticBalls.length - 1; i >= 0; i--) {
            let b = staticBalls[i];
            let d = p.dist(x, y, b.x, b.y);        
            if (b.letra === tecla && d < 50) {
              
              console.log("final:",FinalMusic);
              if (b.som && b.som.isLoaded()) {
                b.som.setVolume(0.5);
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
                if (vidas.length < 3) {
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


