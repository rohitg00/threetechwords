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
  // Define characters that can be transformed
  const matrixMap: Record<string, string> = {
    'a': '4',
    'e': '3',
    'i': '1',
    'o': '0',
    's': '5',
    't': '7',
    'b': '8',
    'g': '6',
    'z': '2'
  };
  
  return text.toLowerCase().split('').map(char => {
    if (matrixMap[char]) {
      // Add matrix number before the character only
      return `${matrixMap[char]}${char}`;
    }
    return char;
  }).join('');
}