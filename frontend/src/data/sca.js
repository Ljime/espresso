// SCA Flavor Wheel descriptors — L1 → L2 → L3
// Based on the Specialty Coffee Association Coffee Taster's Flavor Wheel (2016)
// Original rendering — not a reproduction of copyrighted artwork

export const SCA_WHEEL = [
  {
    id: 'floral', label: 'Floral', color: '#E8A0BF',
    children: [
      {
        id: 'floral-black-tea', label: 'Black Tea', color: '#C47E9B',
        children: []
      },
      {
        id: 'floral-floral', label: 'Floral', color: '#D4A0C0',
        children: [
          { id: 'chamomile', label: 'Chamomile' },
          { id: 'rose', label: 'Rose' },
          { id: 'jasmine', label: 'Jasmine' },
        ]
      },
    ]
  },
  {
    id: 'fruity', label: 'Fruity', color: '#E05C5C',
    children: [
      {
        id: 'berry', label: 'Berry', color: '#C03060',
        children: [
          { id: 'blackberry', label: 'Blackberry' },
          { id: 'raspberry', label: 'Raspberry' },
          { id: 'blueberry', label: 'Blueberry' },
          { id: 'strawberry', label: 'Strawberry' },
        ]
      },
      {
        id: 'dried-fruit', label: 'Dried Fruit', color: '#A0522D',
        children: [
          { id: 'raisin', label: 'Raisin' },
          { id: 'prune', label: 'Prune' },
        ]
      },
      {
        id: 'other-fruit', label: 'Other Fruit', color: '#E07B39',
        children: [
          { id: 'coconut', label: 'Coconut' },
          { id: 'cherry', label: 'Cherry' },
          { id: 'pomegranate', label: 'Pomegranate' },
          { id: 'pineapple', label: 'Pineapple' },
          { id: 'grape', label: 'Grape' },
          { id: 'apple', label: 'Apple' },
          { id: 'peach', label: 'Peach' },
          { id: 'pear', label: 'Pear' },
        ]
      },
      {
        id: 'citrus-fruit', label: 'Citrus Fruit', color: '#F0A500',
        children: [
          { id: 'grapefruit', label: 'Grapefruit' },
          { id: 'orange', label: 'Orange' },
          { id: 'lemon', label: 'Lemon' },
          { id: 'lime', label: 'Lime' },
        ]
      },
    ]
  },
  {
    id: 'sour-fermented', label: 'Sour/Fermented', color: '#A8C050',
    children: [
      {
        id: 'sour', label: 'Sour', color: '#88A030',
        children: [
          { id: 'sour-aromatics', label: 'Sour Aromatics' },
          { id: 'acetic-acid', label: 'Acetic Acid' },
          { id: 'butyric-acid', label: 'Butyric Acid' },
          { id: 'isovaleric-acid', label: 'Isovaleric Acid' },
          { id: 'citric-acid', label: 'Citric Acid' },
          { id: 'malic-acid', label: 'Malic Acid' },
        ]
      },
      {
        id: 'alcohol-fermented', label: 'Alcohol/Fermented', color: '#C8B820',
        children: [
          { id: 'winey', label: 'Winey' },
          { id: 'whiskey', label: 'Whiskey' },
          { id: 'fermented', label: 'Fermented' },
          { id: 'overripe', label: 'Overripe' },
        ]
      },
    ]
  },
  {
    id: 'green-vegetative', label: 'Green/Vegetative', color: '#50A060',
    children: [
      {
        id: 'olive-oil', label: 'Olive Oil', color: '#608040',
        children: []
      },
      {
        id: 'raw', label: 'Raw', color: '#407060',
        children: []
      },
      {
        id: 'green-vegetative-sub', label: 'Green/Vegetative', color: '#509060',
        children: [
          { id: 'under-ripe', label: 'Under-ripe' },
          { id: 'peapod', label: 'Peapod' },
          { id: 'fresh', label: 'Fresh' },
          { id: 'dark-green', label: 'Dark Green' },
          { id: 'vegetative', label: 'Vegetative' },
          { id: 'hay-like', label: 'Hay-like' },
          { id: 'herb-like', label: 'Herb-like' },
        ]
      },
      {
        id: 'beany', label: 'Beany', color: '#708050',
        children: []
      },
    ]
  },
  {
    id: 'other', label: 'Other', color: '#A09090',
    children: [
      {
        id: 'papery-musty', label: 'Papery/Musty', color: '#907870',
        children: [
          { id: 'stale', label: 'Stale' },
          { id: 'cardboard', label: 'Cardboard' },
          { id: 'papery', label: 'Papery' },
          { id: 'woody', label: 'Woody' },
          { id: 'moldy-damp', label: 'Moldy/Damp' },
          { id: 'musty-dusty', label: 'Musty/Dusty' },
          { id: 'musty-earthy', label: 'Musty/Earthy' },
          { id: 'animalic', label: 'Animalic' },
          { id: 'meaty-brothy', label: 'Meaty/Brothy' },
          { id: 'phenolic', label: 'Phenolic' },
        ]
      },
      {
        id: 'chemical', label: 'Chemical', color: '#806880',
        children: [
          { id: 'bitter', label: 'Bitter' },
          { id: 'salty', label: 'Salty' },
          { id: 'medicinal', label: 'Medicinal' },
          { id: 'petroleum', label: 'Petroleum' },
          { id: 'skunky', label: 'Skunky' },
          { id: 'rubber', label: 'Rubber' },
        ]
      },
    ]
  },
  {
    id: 'roasted', label: 'Roasted', color: '#5C3A1E',
    children: [
      {
        id: 'pipe-tobacco', label: 'Pipe Tobacco', color: '#7A5230',
        children: []
      },
      {
        id: 'tobacco', label: 'Tobacco', color: '#8A6040',
        children: []
      },
      {
        id: 'burnt', label: 'Burnt', color: '#3A2010',
        children: [
          { id: 'acrid', label: 'Acrid' },
          { id: 'ashy', label: 'Ashy' },
          { id: 'smoky', label: 'Smoky' },
          { id: 'brown-roast', label: 'Brown Roast' },
        ]
      },
      {
        id: 'cereal', label: 'Cereal', color: '#A08050',
        children: [
          { id: 'grain', label: 'Grain' },
          { id: 'malt', label: 'Malt' },
        ]
      },
    ]
  },
  {
    id: 'spices', label: 'Spices', color: '#C07840',
    children: [
      {
        id: 'pungent', label: 'Pungent', color: '#A05828',
        children: []
      },
      {
        id: 'pepper', label: 'Pepper', color: '#804838',
        children: []
      },
      {
        id: 'brown-spice', label: 'Brown Spice', color: '#C09060',
        children: [
          { id: 'anise', label: 'Anise' },
          { id: 'nutmeg', label: 'Nutmeg' },
          { id: 'cinnamon', label: 'Cinnamon' },
          { id: 'clove', label: 'Clove' },
        ]
      },
    ]
  },
  {
    id: 'nutty-cocoa', label: 'Nutty/Cocoa', color: '#7B4F2E',
    children: [
      {
        id: 'nutty', label: 'Nutty', color: '#9B6F3E',
        children: [
          { id: 'peanuts', label: 'Peanuts' },
          { id: 'hazelnut', label: 'Hazelnut' },
          { id: 'almond', label: 'Almond' },
        ]
      },
      {
        id: 'cocoa', label: 'Cocoa', color: '#5B3018',
        children: [
          { id: 'chocolate', label: 'Chocolate' },
          { id: 'dark-chocolate', label: 'Dark Chocolate' },
        ]
      },
    ]
  },
  {
    id: 'sweet', label: 'Sweet', color: '#E8C060',
    children: [
      {
        id: 'brown-sugar', label: 'Brown Sugar', color: '#C8A040',
        children: [
          { id: 'molasses', label: 'Molasses' },
          { id: 'maple-syrup', label: 'Maple Syrup' },
          { id: 'caramelized', label: 'Caramelized' },
          { id: 'honey', label: 'Honey' },
        ]
      },
      {
        id: 'vanilla', label: 'Vanilla', color: '#E8E0A0',
        children: []
      },
      {
        id: 'vanillin', label: 'Vanillin', color: '#D0C890',
        children: []
      },
      {
        id: 'overall-sweet', label: 'Overall Sweet', color: '#F0D070',
        children: []
      },
      {
        id: 'sweet-aromatics', label: 'Sweet Aromatics', color: '#E8D060',
        children: []
      },
    ]
  },
];

// Flatten to a lookup map: id → { label, color, l1, l2 }
export function buildDescriptorMap() {
  const map = {};
  for (const l1 of SCA_WHEEL) {
    for (const l2 of l1.children) {
      if (l2.children && l2.children.length > 0) {
        for (const l3 of l2.children) {
          map[l3.id] = { label: l3.label, color: l1.color, l1: l1.label, l2: l2.label };
        }
      } else {
        map[l2.id] = { label: l2.label, color: l1.color, l1: l1.label, l2: null };
      }
    }
    // Also map L1 itself as selectable
    map[l1.id] = { label: l1.label, color: l1.color, l1: l1.label, l2: null };
  }
  return map;
}

export const DESCRIPTOR_MAP = buildDescriptorMap();

// Shot colour swatches (Prismacolor-referenced)
export const SHOT_COLOURS = [
  { no: '935',  name: 'Black',         hex: '#000000' },
  { no: '1099', name: 'Espresso',      hex: '#4B3621' },
  { no: '947',  name: 'Dark Umber',    hex: '#5B3A29' },
  { no: '948',  name: 'Sepia',         hex: '#704214' },
  { no: '946',  name: 'Dark Brown',    hex: '#654321' },
  { no: '1094', name: 'Sandbar Brown', hex: '#A67B5B' },
  { no: '941',  name: 'Light Umber',   hex: '#A1866F' },
  { no: '918',  name: 'Orange',        hex: '#FF7F00' },
  { no: '1003', name: 'Yellow Orange', hex: '#FFA500' },
  { no: '915',  name: 'Lemon Yellow',  hex: '#FFF44F' },
];

// Crema colour swatches
export const CREMA_COLOURS = [
  { no: '940',  name: 'Sand Ochre',      hex: '#C2A878' },
  { no: '942',  name: 'Yellow Ochre',    hex: '#C79F4B' },
  { no: '943',  name: 'Burnt Ochre',     hex: '#CC7722' },
  { no: '1034', name: 'Goldenrod',       hex: '#DAA520' },
  { no: '917',  name: 'Sunburst Yellow', hex: '#FFDF00' },
];

export const ROAST_LEVELS = ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark', 'Very Dark'];
export const PROCESSES = ['Washed', 'Natural', 'Honey', 'Anaerobic', 'Wet-Hulled', 'Other'];
