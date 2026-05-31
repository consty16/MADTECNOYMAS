import { type LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  title: string;
  price?: string;
  image: string;
  category: 'oferta' | 'destacado' | 'smartwatch' | 'herramientas' | 'nuevo' | 'audio' | 'electricidad' | 'informatica' | 'accesorios';
  description?: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export const CATALOG_IMAGES = [
  '/catalogo-1.jpg',
  '/catalogo-2.jpg',
  '/catalogo-3.jpg',
  '/catalogo-4.jpg',
  '/catalogo-5.jpg',
  '/catalogo-6.jpg',
  '/catalogo-7.jpg',
  '/catalogo-8.jpg',
  '/catalogo-9.jpg'
];

export const OFFER_BANNER_IMAGES = [
  '/oferta-banner-1.jpg',
  '/oferta-banner-2.jpg',
  '/oferta-banner-3.jpg'
];

export const PRODUCTS: Product[] = [
  { id: '1', title: 'Altavoz Bluetooth', image: '/altavoz.png', category: 'audio', price: '15.900' },
  { id: '2', title: 'Auricular Negro', image: '/auricularnegro.png', category: 'audio', price: '12.500' },
  { id: '3', title: 'Base Inalámbrica', image: '/baseinalambrica.png', category: 'electricidad', price: '18.900' },
  { id: '4', title: 'Cargador Duo', image: '/caragdorduo.png', category: 'electricidad', price: '9.800' },
  { id: '5', title: 'Cargador Auto', image: '/cargadorauto.png', category: 'electricidad', price: '7.500' },
  { id: '6', title: 'Case Disco Duro', image: '/casedisco.png', category: 'informatica', price: '8.200' },
  { id: '7', title: 'Herramienta de Corte', image: '/corte.png', category: 'herramientas', price: '5.400' },
  { id: '8', title: 'Destornillador', image: '/destornillador.png', category: 'herramientas', price: '4.200' },
  { id: '9', title: 'Espejo con Luz', image: '/espejo.png', category: 'accesorios', price: '14.500' },
  { id: '10', title: 'Pendrive Essager', image: '/essagerpend.png', category: 'informatica', price: '6.900' },
  { id: '11', title: 'Samsung Galaxy Fit', image: '/fitsamsung.png', category: 'smartwatch', price: '45.000' },
  { id: '12', title: 'Foco LED', image: '/foco.png', category: 'electricidad', price: '3.500' },
  { id: '13', title: 'Set de Herramientas', image: '/herramientas.png', category: 'herramientas', price: '22.000' },
  { id: '14', title: 'Linterna LED', image: '/ledlinterna.png', category: 'electricidad', price: '6.800' },
  { id: '15', title: 'Kit de Limpieza', image: '/limpieza.png', category: 'accesorios', price: '4.500' },
  { id: '16', title: 'Auriculares M25', image: '/m25auric.png', category: 'audio', price: '19.900' },
  { id: '17', title: 'Malla con Hebilla', image: '/malla-con-hebilla.png', category: 'smartwatch', price: '8.500' },
  { id: '18', title: 'Malla Metálica Mixta', image: '/malla-metalica-mixta.png', category: 'smartwatch', price: '12.000' },
  { id: '19', title: 'Malla Abrojo', image: '/mallaabrojo.png', category: 'smartwatch', price: '7.500' },
  { id: '20', title: 'Malla Ajustable', image: '/mallaajustable.png', category: 'smartwatch', price: '7.500' },
  { id: '21', title: 'Malla Cierre', image: '/mallacierre.png', category: 'smartwatch', price: '9.000' },
  { id: '22', title: 'Malla con Botones', image: '/malla-con-botones.png', category: 'smartwatch', price: '8.500' },
  { id: '23', title: 'Malla Corrediza', image: '/mallacorrediza.png', category: 'smartwatch', price: '8.500' },
  { id: '24', title: 'Malla Manual', image: '/mallamanual.png', category: 'smartwatch', price: '7.500' },
  { id: '25', title: 'Malla Naranja Duo', image: '/mallanaranjaduo.png', category: 'smartwatch', price: '9.500' },
  { id: '26', title: 'Malla Presión', image: '/mallapresion.png', category: 'smartwatch', price: '7.500' },
  { id: '27', title: 'Mini Pen', image: '/minipen.png', category: 'accesorios', price: '3.200' },
  { id: '28', title: 'Mouse Negro', image: '/mousenegro.png', category: 'informatica', price: '6.500' },
  { id: '29', title: 'Pendrive Dual', image: '/pendrivedual.png', category: 'informatica', price: '11.500' },
  { id: '30', title: 'Point Mercado Libre', image: '/pointML.png', category: 'accesorios', price: '15.000' },
  { id: '31', title: 'Porta Dedos', image: '/portadedos.png', category: 'accesorios', price: '1.500' },
  { id: '32', title: 'Destornillador de Precisión', image: '/presicion.png', category: 'herramientas', price: '12.500' },
  { id: '33', title: 'Protector de Pantalla', image: '/protector.png', category: 'accesorios', price: '2.500' },
  { id: '34', title: 'Set Jakemy', image: '/setjakemy.png', category: 'herramientas', price: '35.000' },
  { id: '35', title: 'Funda de Silicona', image: '/silicona.png', category: 'accesorios', price: '4.500' },
  { id: '36', title: 'Funda TPU Gris', image: '/tpugris.png', category: 'accesorios', price: '3.500' },
  { id: '37', title: 'Funda TPU Negro', image: '/tpunegro.png', category: 'accesorios', price: '3.500' },
  { id: '38', title: 'Funda TPU Oscuro', image: '/tpuoscuro.png', category: 'accesorios', price: '3.500' },
  { id: '39', title: 'Funda TPU Silicona', image: '/tpusilicona.png', category: 'accesorios', price: '4.500' },
  { id: '40', title: 'TV Box', image: '/tvbox.png', category: 'informatica', price: '45.000' },
  { id: '41', title: 'Ventilador de Mano', image: '/ventiladordemano.png', category: 'electricidad', price: '5.500' },
  { id: '42', title: 'Producto Xiaomi', image: '/xiaomi.png', category: 'informatica', price: '18.000' },
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    user: 'Carlos G.',
    rating: 5,
    comment: 'Excelente atención y los productos son de primera calidad. El TV Box vuela!',
    date: 'Hace 2 días'
  },
  {
    id: '2',
    user: 'Mariana P.',
    rating: 5,
    comment: 'Compré un smartwatch y me llegó en el día. Muy confiables.',
    date: 'Hace 1 semana'
  },
  {
    id: '3',
    user: 'Jorge L.',
    rating: 4,
    comment: 'Muy buenos precios y variedad. El asesoramiento por WhatsApp fue clave.',
    date: 'Hace 3 días'
  }
];

export const REEL_VIDEOS = [
  {
    id: '1',
    url: '/adelanto-pre-video.mp4',
    title: 'Adelanto Pre Video'
  },
  {
    id: '2',
    url: '/base-inalambrica-samsung.mp4',
    title: 'Base Inalámbrica Samsung'
  },
  {
    id: '3',
    url: '/destornillador-xiaomi.mp4',
    title: 'Destornillador Xiaomi'
  },
  {
    id: '4',
    url: '/galaxytab-venta.mp4',
    title: 'Galaxy Tab Venta'
  },
  {
    id: '5',
    url: '/GALAXYTABA9PLUS.mp4',
    title: 'Galaxy Tab A9 Plus'
  },
  {
    id: '6',
    url: '/GALAXYTABHUMANOIDE.mp4',
    title: 'Galaxy Tab Humanoide'
  },
  {
    id: '7',
    url: '/jakemy-herramientas.mp4',
    title: 'Jakemy Herramientas'
  },
  {
    id: '8',
    url: '/kit-jakemy.mp4',
    title: 'Kit Jakemy'
  },
  {
    id: '9',
    url: '/samsung-fit3.mp4',
    title: 'Samsung Fit 3'
  },
  {
    id: '10',
    url: '/set-jakemy-video.mp4',
    title: 'Set Jakemy'
  },
  {
    id: '11',
    url: '/SILLA.mp4',
    title: 'Silla Gamer'
  },
  {
    id: '12',
    url: '/altavoz-portatil-redmi.mp4',
    title: 'Altavoz Portátil Redmi'
  }
];
