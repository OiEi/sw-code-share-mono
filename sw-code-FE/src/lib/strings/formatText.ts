const oneMBSize = 104_857_6;

export const resizeText = (inputText: string): string => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(inputText);
    
  if (encoded.length <= 2 * oneMBSize) return inputText;
    
  return new TextDecoder('utf-8', { fatal: false }).decode(encoded.slice(0, 2 * oneMBSize));
};