import { JSDOM } from 'jsdom';
import { svg } from './cli';

describe('svg()', () => {
  const options: { [key: string]: any } = {}

  options.radix = JSON.stringify({
    planets: {
      Sun: [60],
      Moon: [120],
    },
    cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
  });

  describe('radix with NO transits', () => {
    it('has the expected SVG elements', () => {
      const svgString = svg(options)
      const svgElement = JSDOM.fragment(svgString).querySelector('svg')!;
      expect(svgElement).not.toBeNull();
      expect(svgElement.querySelector('g#paper-astrology-radix')).not.toBeNull();
      expect(svgElement.querySelector('g#paper-astrology-transit')).toBeNull();
    })
  })

  describe('radix with transits', () => {
    it('has the expected SVG elements', () => {
      options.transits = JSON.stringify({
        planets: {
          Mars: [0],
          Venus: [180],
        },
        cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
      });
      const svgString = svg(options)
      const svgElement = JSDOM.fragment(svgString).querySelector('svg')!;
      expect(svgElement).not.toBeNull();
      expect(svgElement.querySelector('g#paper-astrology-radix')).not.toBeNull();
      expect(svgElement.querySelector('g#paper-astrology-transit')).not.toBeNull();

      console.log(`bin/astrochart --radix '${options.radix}' --transits '${options.transits}' > chart.svg`)
    })
  })
})
