"use client";

import { useState, useEffect, useRef } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-+*';

export function useScramble(targetText: string, delay: number = 0, duration: number = 800) {
  const [text, setText] = useState('');
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let isCancelled = false;
    
    const animate = (time: number) => {
      if (isCancelled) return;
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      
      if (elapsed < duration) {
        // Calculate how many correct characters we should have
        const progress = elapsed / duration;
        const correctCharsCount = Math.floor(progress * targetText.length);
        
        let newText = '';
        for (let i = 0; i < targetText.length; i++) {
          if (i < correctCharsCount || targetText[i] === ' ') {
            newText += targetText[i];
          } else {
            newText += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }
        }
        setText(newText);
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setText(targetText);
      }
    };
    
    timeout = setTimeout(() => {
      if (!isCancelled) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }, delay);
    
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [targetText, delay, duration]);

  return text;
}
