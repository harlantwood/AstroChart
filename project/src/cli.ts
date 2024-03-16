import { JSDOM } from 'jsdom'
import { Command } from 'commander';
import { Chart } from './index'

export function cli() {
  const options = getOptions();
  const svgString = svg(options)
  console.log(svgString)
}

function getOptions() {
  const program = new Command();
  program
    .requiredOption('-r, --radix <string>', 'Radix data in JSON format')
    .option('-t, --transits <string>', 'Transit data in JSON format')
    .option('-c, --corners <boolean>', 'Whether to display As, Ic, Mc, Ds', true)
    // .option('-d, --debug <boolean>', 'Enable debug mode', false);

  const argv = process.argv;
  program.parse(argv);

  const options = program.opts();
  return options;
}

export function svg(options: { [key: string]: any }) {
  const dataRadix = JSON.parse(options.radix);
  const dataTransit = options.transits ? JSON.parse(options.transits) : null;
  const debug = options.debug;

  if (global.document != undefined) { // for jest, in jsdom mode
    document.body.innerHTML = '<div id="chart"></div>';
  } else { // for node, in cli mode
    const dom = new JSDOM('<div id="paper"></div>');
    global.document = dom.window.document;
  }
  const chart = new Chart('paper', 800, 800, { MARGIN: 100, SYMBOL_SCALE: 0.8 });
  const radix = chart.radix(dataRadix);

  if (options.corners) {
    radix.addPointsOfInterest({
      As: [dataRadix.cusps[0]],
      Ic: [dataRadix.cusps[3]],
      Ds: [dataRadix.cusps[6]],
      Mc: [dataRadix.cusps[9]],
    })
  }

  if (dataTransit) {
    const transit = radix.transit(dataTransit);
    transit.aspects();
  } else {
    radix.aspects();
  }

  const svgNode = document.querySelector('svg')!;
  svgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgString = svgNode.outerHTML;

  return svgString;
}
