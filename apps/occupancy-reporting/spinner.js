export function createSpinner(text) {
  if (!process.stdout.isTTY) {
    console.log(text);
    return {
      stop(finalText) {
        if (finalText) console.log(finalText);
      }
    };
  }

  const frames = ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'];
  let frameIndex = 0;

  const render = () => {
    const frame = frames[frameIndex];
    frameIndex = (frameIndex + 1) % frames.length;
    process.stdout.write(`\r${text} ${frame}`);
  };

  render();
  const interval = setInterval(render, 80);

  return {
    stop(finalText) {
      clearInterval(interval);
      if (typeof process.stdout.clearLine === 'function') {
        process.stdout.clearLine(0);
      }
      if (typeof process.stdout.cursorTo === 'function') {
        process.stdout.cursorTo(0);
      } else {
        process.stdout.write('\r');
      }
      if (finalText) {
        console.log(finalText);
      }
    }
  };
}
