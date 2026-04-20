import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedProducts = [
  {
    name: "Golden Oud",
    description: "A rich, deep base of Cambodian oud with top notes of saffron and honey.",
    price: 185.00,
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
    category: "The Oud Series",
    stock: 50
  },
  {
    name: "Midnight Rose",
    description: "Damask rose entwined with dark patchouli and a hint of vanilla bean.",
    price: 145.00,
    imageUrl: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800",
    category: "Floral Essence",
    stock: 30
  },
  {
    name: "Desert Silk",
    description: "Light white musk and soft cashmere with a breath of desert wind.",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
    category: "Mystic Night",
    stock: 25
  },
  {
    name: "Saffron Bloom",
    description: "Exotic saffron and jasmine layered over a warm amber base.",
    price: 160.00,
    imageUrl: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=800",
    category: "Floral Essence",
    stock: 15
  }
];

async function seed() {
  const productsCol = collection(db, 'products');
  const existing = await getDocs(productsCol);
  
  if (existing.empty) {
    console.log("Seeding database...");
    for (const prod of seedProducts) {
      await addDoc(productsCol, prod);
    }
    console.log("Seeding complete.");
  } else {
    console.log("Database already has products.");
  }
}

seed();
