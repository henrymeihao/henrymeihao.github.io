import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' });
const nodes = [...document.querySelectorAll('code.language-mermaid')].map(code => {
  const diagram = document.createElement('div');
  diagram.className = 'mermaid';
  diagram.style.cssText = 'overflow-x:auto;margin:1.5em 0;text-align:center';
  diagram.textContent = code.textContent;
  code.parentElement.replaceWith(diagram);
  return diagram;
});
if (nodes.length) mermaid.run({ nodes }).then(() => {
  for (const node of nodes) {
    const svg = node.querySelector('svg');
    if (svg) { svg.style.width = '100%'; svg.style.height = 'auto'; }
  }
}).catch(console.error);
