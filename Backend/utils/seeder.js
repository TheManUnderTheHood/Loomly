import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../src/db/index.js"; // Adjust path if your connectDB is elsewhere
import { Product } from "../src/models/product.model.js";
import { Category } from "../src/models/category.model.js";

dotenv.config({ path: "./.env" });

// --- Dummy Data ---
// You can expand this with more products or use a library like Faker.js

const dummyCategories = [
  { name: "Old Money", slug: "old-money" },
  { name: "Streetwear", slug: "streetwear" },
  { name: "Ethnic", slug: "ethnic" },
  { name: "Formals", slug: "formals" },
  { name: "Men T-Shirts", slug: "men-tshirts" },
  { name: "Women Tops", slug: "women-tops" },
];

const dummyProducts = [
  {
    name: "Classic Linen Shirt",
    description: "A timeless button-down shirt crafted from premium, breathable linen. Perfect for a sophisticated yet relaxed look. Features a crisp collar and mother-of-pearl buttons.",
    price: 89.99,
    categorySlug: "old-money", // We'll use this slug to find the right category ID later
    stock: 50,
    productImage: {
      public_id: "flasher_demo/old_money_1",
      url: "https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/27629660/2024/2/27/1fa4f461-3c48-4db4-961c-8ccf47693a961709030852943LOREMWomenDialStrapsAnalogueWatchLR346TshirtsMANGOMANMenShir1.jpg",
    },
    trending: true,
  },
  {
    name: "Vintage Graphic Tee",
    description: "Heavyweight cotton tee with a faded, vintage-inspired graphic print on the front. Features a relaxed fit and dropped shoulders for a perfect streetwear silhouette.",
    price: 45.0,
    categorySlug: "streetwear",
    stock: 120,
    productImage: {
      public_id: "flasher_demo/streetwear_1",
      url: "https://m.media-amazon.com/images/I/81GuZKNuWtL._UY350_.jpg",
    },
    trending: true,
  },
  {
    name: "Embroidered Silk Kurta",
    description: "An elegant silk-blend kurta featuring intricate embroidery along the neckline and cuffs. A perfect choice for festive occasions and cultural events.",
    price: 129.5,
    categorySlug: "ethnic",
    stock: 30,
    productImage: {
      public_id: "flasher_demo/ethnic_1",
      url: "https://cdn.sareesaga.com/image/cache/data18/sea-green-embroidered-dupion-silk-kurta-178198-1000x1375.jpg",
    },
    trending: true,
  },
  {
    name: "Slim-Fit Pinstripe Suit",
    description: "A modern take on a classic pinstripe suit. Tailored for a sharp, slim fit, this suit is crafted from a high-quality wool blend for all-day comfort and style.",
    price: 349.99,
    categorySlug: "formals",
    stock: 25,
    productImage: {
      public_id: "flasher_demo/formals_1",
      url: "https://images.hawesandcurtis.com/tr:w-600,q-80/JK/JKSRUS43-G01V-172618-800px-1040px.jpg",
    },
    trending: false,
  },
  {
    name: "Cyber-Glitch Hoodie",
    description: "A bold, oversized hoodie with a high-definition glitch art graphic. Made from a soft fleece-lined fabric, it's the ultimate statement piece for any streetwear enthusiast.",
    price: 95.0,
    categorySlug: "streetwear",
    stock: 80,
    productImage: {
      public_id: "flasher_demo/streetwear_2",
      url: "https://imgs.search.brave.com/lGQINK98sykk3v95QhspeEnZpVoFn5wpEwxBRImDi_g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/d2hpdGV2aWN0b3Jp/YS5jb20vV2hhdC1B/cmUtdGhlLUZhc2hp/b24tVHJlbmRzLWZv/ci1HZW4tWi0xMS5q/cGc",
    },
    trending: true,
  },
  {
    name: "Minimalist Crewneck Tee",
    description: "The perfect basic. This t-shirt is made from ultra-soft pima cotton and features a clean, classic crewneck design. Available in multiple essential colors.",
    price: 29.99,
    categorySlug: "men-tshirts",
    stock: 200,
    productImage: {
      public_id: "flasher_demo/tshirt_1",
      url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    },
    trending: false,
  },
  {
    name: "Flowy Bell-Sleeve Top",
    description: "A romantic and chic top with dramatic bell sleeves and a delicate floral pattern. Made from a lightweight, flowy fabric, it's perfect for a day out or a casual evening.",
    price: 55.0,
    categorySlug: "women-tops",
    stock: 75,
    productImage: {
      public_id: "flasher_demo/women_top_1",
      url: "https://m.media-amazon.com/images/I/71OMQsNmJ2L._UY1100_.jpg",
    },
    trending: false,
  },
  {
    name: "Tailored Wool Peacoat",
    description: "A classic double-breasted peacoat made from a rich, warm wool blend. Features a timeless design with notched lapels and anchor-engraved buttons.",
    price: 220.0,
    categorySlug: "old-money",
    stock: 40,
    productImage: {
      public_id: "flasher_demo/old_money_2",
      url: "https://media.karenmillen.com/i/karenmillen/bkk19770_camel_xl?$product_image_main_mobile$&fmt=webp",
    },
    trending: false,
  },
];

// --- Seeder Logic ---

const importData = async () => {
  try {
    // 1. Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("Old data destroyed!");

    // 2. Insert new categories
    const createdCategories = await Category.insertMany(dummyCategories);
    console.log("Categories imported!");

    // 3. Map category slugs to their new _id values
    const categoryMap = createdCategories.reduce((acc, category) => {
      acc[category.slug] = category._id;
      return acc;
    }, {});

    // 4. Prepare products with the correct category _id
    const productsWithCategoryIds = dummyProducts.map((product) => {
      return {
        ...product,
        category: categoryMap[product.categorySlug],
      };
    });

    // 5. Insert new products
    await Product.insertMany(productsWithCategoryIds);
    console.log("Products imported!");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// --- Execution ---

const runSeeder = async () => {
  await connectDB(); // Establish database connection first

  if (process.argv[2] === "-d") {
    // If you run `node seeder.js -d`, it will destroy data
    destroyData();
  } else {
    // Otherwise, it will import data
    importData();
  }
};

runSeeder();