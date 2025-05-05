import { useEffect } from 'react';
import 'p5/lib/addons/p5.sound';

const Instrucao = () => {
  useEffect(() => {
    const sketch = (p) => {
      let nota1;

      p.preload = () => {
        nota1 = p.loadSound('/sons/nota1.wav');
      };

      p.setup = () => {
        p.createCanvas(400, 200);
      };

      p.draw = () => {
        p.background(50);
        p.fill(255);
        p.text('Clique para tocar o som', 50, 100);
      };

      p.mousePressed = () => {
        if (nota1 && nota1.isLoaded()) {
          nota1.play();
        }
      };
    };

    const p5Instance = new window.p5(sketch, document.getElementById('p5-container'));

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div id="p5-container"></div>;
};

export default Instrucao;