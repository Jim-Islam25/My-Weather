import { useEffect, useState } from 'react';

export const contrastColour = (bg: string) => {
  const rgb = bg.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
  const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
  return brightness > 128 ? '#000' : '#fff';
};

export const useDynamicTextColour = () => {
  const [colour, setColour] = useState('#fff');

  useEffect(() => {
    const update = () => {
      const body = getComputedStyle(document.body);
      const can = document.createElement('canvas');
      can.width = 1; can.height = 1;
      const ctx = can.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 1, 0);
      grad.addColorStop(0, body.backgroundImage.includes('1d2b64') ? '#1d2b64' : '#f8cdda');
      grad.addColorStop(1, body.backgroundImage.includes('485563') ? '#485563' : '#1d2b64');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setColour(contrastColour(`rgb(${r},${g},${b})`));
    };
    update();
    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, []);
  return colour;
};