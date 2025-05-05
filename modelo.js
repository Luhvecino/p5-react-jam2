import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

function Modelo({movS}) {
  const sketchRef = useRef();  
  const movSRef = useRef(movS); // mantemos o valor mais recente
  
  useEffect(() => {
    movSRef.current = movS; // atualiza o valor da ref sempre que a prop mudar
  }, [movS]);

  useEffect(() => {
    const s = (p) => {

      p.setup = () => {        
        p.createCanvas(500, 500);  
        
        

      };

      p.draw = () => {
        p.background(0);   





    };
};
    const myp5 = new p5(s, sketchRef.current);
    return () => {
      myp5.remove();
    };
  }, []); 
  

  return <div ref={sketchRef}></div>;
}

export default Modelo;


