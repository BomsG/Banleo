import { Product, LookbookItem } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'LUXE PERFORMANCE POLO',
    price: 120,
    image: 'https://picsum.photos/seed/polo1/600/800',
    category: 'NEW ARRIVALS',
    is_new: true,
  },
  {
    id: '2',
    name: 'PREMIUM COTTON TEE',
    price: 85,
    image: 'https://picsum.photos/seed/tee1/600/800',
    category: 'NEW ARRIVALS',
  },
  {
    id: '3',
    name: 'RELAXED LINEN SHIRT',
    price: 150,
    image: 'https://picsum.photos/seed/shirt1/600/800',
    category: 'NEW ARRIVALS',
    is_sale: true,
  },
  {
    id: '4',
    name: 'LUXE PERFORMANCE POLO - BLACK',
    price: 120,
    image: 'https://picsum.photos/seed/polo2/600/800',
    category: 'NEW ARRIVALS',
  },
  {
    id: '5',
    name: 'ESSENTIAL CARGO PANTS',
    price: 180,
    image: 'https://picsum.photos/seed/pants1/600/800',
    category: 'MEN',
  },
  {
    id: '6',
    name: 'OVERSIZED HOODIE',
    price: 140,
    image: 'https://picsum.photos/seed/hoodie1/600/800',
    category: 'MEN',
  },
  {
    id: '7',
    name: 'SILK MIDI DRESS',
    price: 250,
    image: 'https://picsum.photos/seed/dress1/600/800',
    category: 'WOMEN',
  },
  {
    id: '8',
    name: 'TAILORED BLAZER',
    price: 320,
    image: 'https://picsum.photos/seed/blazer1/600/800',
    category: 'WOMEN',
  },
];

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-1',
    title: 'URBAN NOMAD',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    description: 'A collection inspired by the rhythm of the city. Effortless layers and modern silhouettes for the modern explorer.',
    products: ['1', '5', '6'],
  },
  {
    id: 'look-2',
    title: 'COASTAL ELEGANCE',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    description: 'Breezy linens and soft tones. Perfect for sunset walks and seaside dinners.',
    products: ['3', '7'],
  },
  {
    id: 'look-3',
    title: 'MIDNIGHT LUXE',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop',
    description: 'Sophisticated evening wear. Sharp tailoring meets premium fabrics for a night to remember.',
    products: ['4', '8'],
  },
  {
    id: 'look-4',
    title: 'MINIMALIST ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
    description: 'The foundation of every wardrobe. Clean lines and timeless pieces that never go out of style.',
    products: ['2', '4'],
  },
];
