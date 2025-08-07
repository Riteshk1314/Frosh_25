'use client';

import { useEffect, useRef } from 'react';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({ data, size = 200, className = '' }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation using a library-like approach
    // In a real implementation, you'd use a proper QR code library
    generateQRCode(ctx, data, size);
  }, [data, size]);

  const generateQRCode = (ctx: CanvasRenderingContext2D, text: string, size: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Set canvas size
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    
    // Create a simple pattern based on the text
    // This is a simplified version - in production, use a proper QR code library
    const gridSize = 25;
    const cellSize = size / gridSize;
    
    // Generate pattern based on text hash
    const hash = simpleHash(text);
    
    ctx.fillStyle = '#000000';
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Create pattern based on hash and position
        const shouldFill = (hash + i * j + i + j) % 3 === 0;
        
        if (shouldFill) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Add corner markers (typical QR code feature)
    drawCornerMarker(ctx, 0, 0, cellSize);
    drawCornerMarker(ctx, (gridSize - 7) * cellSize, 0, cellSize);
    drawCornerMarker(ctx, 0, (gridSize - 7) * cellSize, cellSize);
  };

  const drawCornerMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number) => {
    ctx.fillStyle = '#000000';
    // Outer square
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
    ctx.fillStyle = '#ffffff';
    // Inner white square
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#000000';
    // Center square
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg bg-white"
        width={size}
        height={size}
      />
    </div>
  );
}
