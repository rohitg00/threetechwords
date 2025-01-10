import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TECHMIND ASCII art animation frames
export const asciiFrames = [
  `
 ████████╗███████╗ ██████╗██╗  ██╗███╗   ███╗██╗███╗   ██╗██████╗ 
 ╚══██╔══╝██╔════╝██╔════╝██║  ██║████╗ ████║██║████╗  ██║██╔══██╗
    ██║   █████╗  ██║     ███████║██╔████╔██║██║██╔██╗ ██║██║  ██║
    ██║   ██╔══╝  ██║     ██╔══██║██║╚██╔╝██║██║██║╚██╗██║██║  ██║
    ██║   ███████╗╚██████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██████╔╝
    ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ 
`,
  `
 ▀█▀ █▀▀ █▀▀ █░█ █▀▄▀█ █ █▄░█ █▀▄
 ░█░ ██▄ █▄▄ █▀█ █░▀░█ █ █░▀█ █▄▀
`,
  `
 ╔╦╗╔═╗╔═╗╦ ╦╔╦╗╦╔╗╔╔╦╗
  ║ ║╣ ║  ╠═╣║║║║║║║ ║║
  ╩ ╚═╝╚═╝╩ ╩╩ ╩╩╝╚╝═╩╝
`
];

// Function to transform text into "hacker speak"
export function transformText(text: string): string {
  const leetSpeak: Record<string, string> = {
    'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7'
  };

  return text.toLowerCase().split('').map(char => 
    leetSpeak[char] || char
  ).join('');
}

// Function to add matrix-like characters around text
export function matrixify(text: string): string {
  // Convert text to uppercase for Matrix style
  const upperText = text.toUpperCase();
  
  // Add Matrix-style characters
  const matrixChars = '01';
  let result = '';
  
  for (let i = 0; i < upperText.length; i++) {
    const char = upperText[i];
    // Add a random matrix character before each letter
    if (char !== ' ') {
      result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
    }
    result += char;
    // Add a random matrix character after each letter
    if (char !== ' ') {
      result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
    }
  }
  
  return result;
}