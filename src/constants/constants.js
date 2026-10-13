export const FREE_SHIPPING_THRESHOLD = 5000;

export function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export const navLinks = [
  "Home",
  "Our Residents",
  "Gift Hampers",
  "Nursery Collection",
  "About Us",
];

export const pillars = [
  {
    title: "Thoughtful Materials",
    text: "Made with gentle fabrics and safe, high quality fillings",
    icon: "leaf",
  },
  // {
  //   title: "Made With Love",
  //   text: "Handcrafted with care in every little detail",
  //   icon: "heart",
  // },
  {
    title: "Perfect For Gifting",
    text: "Beautifully packaged for meaningful moments",
    icon: "gift",
  },
  {
    title: "Timeless Keepsakes",
    text: "Created to be loved today and treasured always",
    icon: "star",
  },
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Benny Dog ",
    tagline: "The quiet little dreamer with a heart full of wonder.",
    price: 2299,
    originalPrice: 2599,
    image: "https://starlingtales.vercel.app/2.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/16.jpeg",
      "https://starlingtales.vercel.app/9.jpeg",
    ],
    category: "Dolls",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 124,
    inStock: true,
    description:
      "Lovingly handcrafted with soft fabrics and calming details. Dreamer Doll is made for bedtime cuddles, storytelling moments, and comforting little rituals. Each doll is stitched with care and attention to every tiny detail.",
    details: [
      "Height: approx 30cm",
      "Material: 100% cotton outer, hypoallergenic filling",
      "Hand wash only, cold water",
      "Suitable for ages 0+",
      "CE certified & safety tested",
    ],
    tags: ["doll", "handmade", "gift"],
    variants: [
      { label: "Small (25cm)", sku: "DD-SM" },
      { label: "Standard (30cm)", sku: "DD-ST" },
      { label: "Large (38cm)", sku: "DD-LG" },
    ],
  },
  {
    id: 2,
    name: "ELLIE ELEPHANT",
    tagline: "Gentle, wise, and endlessly comforting.",
    price: 2099,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/11.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/3.jpeg",
      "https://starlingtales.vercel.app/5.jpeg",
    ],
    category: "Soft Toys",
    badge: "New",
    rating: 4.8,
    reviews: 87,
    inStock: true,
    description:
      "Ellie brings calm energy, soft hugs, and timeless nursery charm. Made with the gentlest fabrics for little hands to hold tight.",
    details: [
      "Height: approx 28cm",
      "Material: plush velvet outer, PP cotton fill",
      "Surface wash only",
      "Suitable for ages 0+",
      "CE certified",
    ],
    tags: ["elephant", "soft toy", "nursery"],
    variants: [
      { label: "Grey", sku: "EE-GR" },
      { label: "Blue", sku: "EE-BL" },
    ],
  },
  {
    id: 3,
    name: "MILO MONKEY",
    tagline: "Playful, cheerful, and always ready for tiny adventures.",
    price: 2199,
    originalPrice: 2499,
    image: "https://starlingtales.vercel.app/13.jpeg",
    gallery: ["https://starlingtales.vercel.app/13.jpeg"],
    category: "Soft Toys",
    badge: "Bestseller",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    description:
      "Kiki reminds little ones that love is the safest place to land. Her front pocket holds surprises - a tiny joey, a note, or whatever the day brings.",
    details: [
      "Height: approx 32cm",
      "Material: knitted cotton",
      "Hand wash only",
      "Suitable for ages 1+",
      "CE certified",
    ],
    tags: ["kangaroo", "knitted", "gift"],
    variants: [{ label: "Natural Cream", sku: "KK-NC" }],
  },
  {
    id: 4,
    name: "Kiki Kangaroo  ",
    tagline: "Loyal, lovable, and made for everyday companionship.",
    price: 2099,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/1.jpeg",
    gallery: ["https://starlingtales.vercel.app/1.jpeg"],
    category: "Soft Toys",
    badge: null,
    rating: 4.7,
    reviews: 56,
    inStock: true,
    description:
      "Benny is the soft friend for sleepy afternoons and treasured memories. Complete with a cosy polka-dot blanket in every set.",
    details: [
      "Includes matching blanket",
      "Height: approx 26cm",
      "Material: crocheted cotton",
      "Spot clean only",
      "Suitable for ages 0+",
    ],
    tags: ["dog", "crochet", "bundle"],
    variants: [
      { label: "With Blanket", sku: "BD-BL" },
      { label: "Without Blanket", sku: "BD-NB" },
    ],
  },
  {
    id: 5,
    name: "Bunny Backpack",
    tagline: "A little lamb, a lot of love.",
    price: 2399,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/4.jpeg",
    gallery: ["https://starlingtales.vercel.app/4.jpeg"],
    category: "Soft Toys",
    badge: "New",
    rating: 5,
    reviews: 34,
    inStock: true,
    description:
      "Soft cuddles. Pure comfort. Buttercup wears her pink bow proudly and comes with a tiny golden bell - a gentle jingle for every cuddle.",
    details: [
      "Height: approx 22cm",
      "Material: boucle fabric & corduroy trim",
      "Spot clean",
      "Suitable for ages 0+",
      "CE certified",
    ],
    tags: ["lamb", "white", "pink", "soft"],
    variants: [{ label: "White/Pink", sku: "BL-WP" }],
  },
  {
    id: 6,
    name: "Bunny Family Basket",
    tagline: "Handmade with love, dressed for adventure.",
    price: 2599,
    originalPrice: 2899,
    image: "https://starlingtales.vercel.app/14.jpeg",
    gallery: ["https://starlingtales.vercel.app/13.jpeg"],
    category: "Dolls",
    badge: "Sale",
    rating: 4.8,
    reviews: 91,
    inStock: true,
    description:
      "With her denim plaid dress, braided yarn hair, and matching cowgirl hat, this doll is as charming as they come. Fully handcrafted, every stitch placed with intention.",
    details: [
      "Height: approx 34cm",
      "Material: cotton fabric, yarn hair",
      "Hand wash cold",
      "Suitable for ages 3+",
      "Handmade - slight variations are part of the charm",
    ],
    tags: ["doll", "cowgirl", "blue", "handmade"],
    variants: [
      { label: "Blue Plaid", sku: "CG-BP" },
      { label: "Pink Plaid", sku: "CG-PP" },
    ],
  },
  {
    id: 7,
    name: "Dreamer Doll",
    tagline: "Your little one's adventure companion.",
    price: 2799,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/6.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/8.jpeg",
      "https://starlingtales.vercel.app/7.jpeg",
    ],
    category: "Accessories",
    badge: "Personalised",
    rating: 4.9,
    reviews: 178,
    inStock: true,
    description:
      "A waffle-knit toddler backpack with a plush bunny friend tucked in the front pocket. Available with personalised embroidered name on the pocket.",
    details: [
      "Dimensions: 28cm x 22cm x 10cm",
      "Material: waffle cotton, plush bunny",
      "Wipe clean",
      "Suitable for ages 2+",
      "Custom name embroidery available",
    ],
    tags: ["backpack", "bunny", "personalised", "toddler"],
    variants: [
      { label: "Sage Green", sku: "BB-SG" },
      { label: "Dusty Pink", sku: "BB-DP" },
    ],
  },
  {
    id: 8,
    name: "Unicorn Quilt",
    tagline: "A magical quilt for little dreamers.",
    price: 2499,
    originalPrice: 2999,
    image: "https://starlingtales.vercel.app/10.jpeg",
    gallery: ["https://starlingtales.vercel.app/4.jpeg"],
    category: "Nursery",
    badge: "Sale",
    rating: 4.7,
    reviews: 62,
    inStock: true,
    description:
      "Pastel unicorns, rainbows, and wildflowers quilt-stitched onto the softest cotton. Reversible plaid backing. A forever piece for every nursery.",
    details: [
      "Size: 100cm x 130cm",
      "Material: 100% cotton muslin",
      "Machine wash gentle, cold",
      "Suitable for ages 0+",
      "Reversible design",
    ],
    tags: ["quilt", "nursery", "unicorn", "pastel"],
    variants: [{ label: "Pastel Multi", sku: "UQ-PM" }],
  },
  {
    id: 9,
    name: "Cowgirl Doll",
    tagline: "Three best friends in their cosy home.",
    price: 3499,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/12.jpeg",
    gallery: ["https://starlingtales.vercel.app/14.jpeg"],
    category: "Gift Hampers",
    badge: "Gift Set",
    rating: 5,
    reviews: 47,
    inStock: true,
    description:
      "Three handcrafted linen bunnies - each uniquely dressed - nestled in a personalised rope basket. Perfect as a nursery gift or sibling set.",
    details: [
      "Includes 3 bunnies + rope basket",
      "Bunnies: approx 25cm each",
      "Basket: 22cm diameter",
      "Personalised letter patch available",
      "Handmade - each set unique",
    ],
    tags: ["bunny", "gift set", "basket", "personalised"],
    variants: [{ label: "Set of 3", sku: "BFB-3" }],
  },
  {
    id: 10,
    name: "Toy Storage Unicorn",
    tagline: "From gift hamper to toy storage - grows with the child.",
    price: 2199,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/6.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/6.jpeg",
      "https://starlingtales.vercel.app/10.jpeg",
      "https://starlingtales.vercel.app/12.jpeg",
    ],
    category: "Nursery",
    badge: null,
    rating: 4.6,
    reviews: 29,
    inStock: true,
    description:
      "A striped fabric unicorn that doubles as a toy storage basket. Fill it with gifts, then use it as a beloved nursery storage piece for years.",
    details: [
      "Dimensions: 40cm wide x 30cm tall",
      "Material: ticking stripe cotton",
      "Wipe clean",
      "Suitable from birth",
      "Can hold up to 3kg",
    ],
    tags: ["storage", "unicorn", "nursery", "dual-use"],
    variants: [{ label: "Natural Stripe", sku: "TSU-NS" }],
  },
  {
    id: 11,
    name: "Striped Storage Basket",
    tagline: "Practical, charming, and perfect for nursery organization.",
    price: 2899,
    originalPrice: 3199,
    image: "https://starlingtales.vercel.app/10.jpeg",
    gallery: ["https://starlingtales.vercel.app/10.jpeg"],
    category: "Nursery",
    badge: "New",
    rating: 4.8,
    reviews: 14,
    inStock: true,
    description:
      "A versatile ticking stripe canvas storage basket that keeps playrooms tidy and stylish. Handcrafted with sturdy cotton canvas and soft handles for easy carrying.",
    details: [
      "Dimensions: 35cm diameter x 40cm tall",
      "Material: 100% cotton canvas outer",
      "Wipe clean only",
      "Sturdy woven handles",
    ],
    tags: ["storage", "striped", "nursery"],
    variants: [{ label: "Natural Stripe", sku: "SSB-NS" }],
  },
  {
    id: 12,
    name: "Classic Toy Organiser",
    tagline: "Keep play spaces beautiful and clutter-free.",
    price: 2999,
    originalPrice: null,
    image: "https://starlingtales.vercel.app/12.jpeg",
    gallery: ["https://starlingtales.vercel.app/12.jpeg"],
    category: "Nursery",
    badge: null,
    rating: 4.9,
    reviews: 18,
    inStock: true,
    description:
      "A beautifully structured storage bag designed to hold blankets, soft toys, and nursery essentials. Made with premium heavy-weight cotton that stands upright.",
    details: [
      "Dimensions: 38cm wide x 35cm tall",
      "Material: durable ticking canvas",
      "Spot clean",
      "Foldable for easy storage",
    ],
    tags: ["storage", "basket", "nursery"],
    variants: [{ label: "Grey Stripe", sku: "CTO-GS" }],
  },
];

export const RESIDENTS = [
  {
    id: "res-1",
    name: "Benny Dog ",
    tagline: "The quiet little dreamer with a heart full of wonder.",
    image: "https://starlingtales.vercel.app/16.jpeg",
    gallery: ["16.jpeg", "9.jpeg"],
    description:
      "Benny is a gentle soul who loves cozy blanket forts, listening to the soft patter of rain, and dreaming up adventures in the clouds. He is the perfect companion for peaceful afternoons, quiet reading hours, and gentle bedtime rituals.",
    personality: [
      { label: "Favorite Activity", value: "Cloud gazing & blanket forts" },
      { label: "Dream", value: "To touch a shooting star" },
      { label: "Secret Talent", value: "Whispering sweet dreams" },
    ],
    productId: 1,
  },
  {
    id: "res-2",
    name: "ELLIE ELEPHANT",
    tagline: "Gentle, wise, and endlessly comforting.",
    image: "https://starlingtales.vercel.app/17.jpeg",
    gallery: ["3.jpeg", "5.jpeg"],
    description:
      "With her soft velvet ears and kind eyes, Ellie is a patient listener and a steady friend. She loves sharing tea parties with invisible cakes, listening to old nursery rhymes, and wrapping little hands in warm, comforting hugs.",
    personality: [
      { label: "Favorite Activity", value: "Listening to lullabies" },
      { label: "Dream", value: "To paint the nursery sky" },
      { label: "Secret Talent", value: "Remembering every story" },
    ],
    productId: 2,
  },
  {
    id: "res-3",
    name: "DREAMER DOLL",
    tagline: "Playful, cheerful, and always ready for tiny adventures.",
    image: "https://starlingtales.vercel.app/8.jpeg",
    gallery: ["8.jpeg", "7.jpeg"],
    description:
      "Dreamer doll is a bundle of joy who believes that every day is a brand new adventure. She loves swinging from branch to branch (or chair to chair!), playing peek-a-boo, and bringing giggles and bright smiles to every room.",
    personality: [
      { label: "Favorite Activity", value: "Acrobatic tricks & peek-a-boo" },
      { label: "Dream", value: "To build a ladder to the moon" },
      { label: "Secret Talent", value: "Making anyone laugh" },
    ],
    productId: 7,
  },
  {
    id: "res-4",
    name: "Kiki Kangaroo",
    tagline: "Loyal, lovable, and made for everyday companionship.",
    image: "https://starlingtales.vercel.app/1.jpeg",
    gallery: ["https://starlingtales.vercel.app/1.jpeg"],
    description:
      "Kiki reminds little ones that love is the safest place to land. Her front pocket holds little surprises—a tiny joey, secret notes, or precious treasures found during outdoor walks. She is always ready to bounce into fun!",
    personality: [
      { label: "Favorite Activity", value: "Collecting pocket treasures" },
      { label: "Dream", value: "To jump over a rainbow" },
      { label: "Secret Talent", value: "Keeping secrets safe" },
    ],
    productId: 4,
  },
];

export const HAMPER_OCCASIONS = [
  "All Hampers",
  "Newborn & Baby Shower",
  "Milestone & Birthday",
  "Personalised Sets",
  "Sibling & Twins",
  "Heritage Keepsakes",
];

export const HAMPER_PERKS = [
  {
    icon: "gift",
    title: "Artisanal Keepsake Box",
    description:
      "Nestled inside reusable woven baskets or handcrafted pine boxes tied with botanical satin ribbon.",
  },
  {
    icon: "heart",
    title: "Handwritten Calligraphy Card",
    description:
      "Complimentary custom wax-sealed note with your personalized heartfelt message.",
  },
  {
    icon: "leaf",
    title: "100% Gentle & Organic",
    description:
      "Pure cotton muslin, hypoallergenic plush fibers, and baby-safe non-toxic natural dyes.",
  },
  {
    icon: "truck",
    title: "White Glove Pan-India Delivery",
    description:
      "Carefully bubble-protected and delivered promptly for surprise milestone moments.",
  },
];

export const GIFT_HAMPERS = [
  {
    id: "hamper-1",
    name: "The Heirloom Welcome Hamper",
    tagline:
      "A signature newborn welcome gift with hand-stitched companion and cosy muslin essentials.",
    price: 3999,
    originalPrice: 4599,
    image: "https://starlingtales.vercel.app/19.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/19.jpeg",
      "https://starlingtales.vercel.app/2.jpeg",
      "https://starlingtales.vercel.app/16.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Newborn & Baby Shower",
    badge: "Bestseller",
    rating: 5.0,
    reviews: 64,
    inStock: true,
    description:
      "A timeless newborn greeting set presented in a reusable woven cotton rope basket. Features our beloved Benny Dog companion, an organic waffle-knit blanket, a natural beechwood rattle, and a personalised calligraphy gift note.",
    includedItems: [
      "Handmade Benny Dog Plush Companion (30cm)",
      "100% Organic Cotton Waffle Blanket (100x120cm)",
      "Smooth Natural Beechwood Rattle with gentle chime",
      "Embroidered Starling Muslin Keepsake Drawstring Pouch",
      "Wax-Sealed Hand-Calligraphed Welcome Card",
      "Handcrafted Woven Rope Basket with Linen Liner",
    ],
    details: [
      "Basket Dimensions: 32cm dia x 22cm ht",
      "Materials: 100% Organic Muslin Cotton & Hypoallergenic Plush",
      "Care: Spot clean basket, machine wash gentle for textiles",
      "Certification: CE Certified & Non-toxic infant safe",
      "Suitable from birth (0m+)",
    ],
    tags: ["newborn", "hamper", "bestseller", "benny", "baby shower"],
    variants: [
      { label: "Classic Cream Basket", sku: "HMP-HW-CC" },
      { label: "Warm Sage Basket", sku: "HMP-HW-WS" },
      { label: "Dusty Rose Basket", sku: "HMP-HW-DR" },
    ],
  },
  {
    id: "hamper-2",
    name: "Bunny Family Keepsake Basket",
    tagline:
      "Three handcrafted linen bunnies in their bespoke embroidered home.",
    price: 4499,
    originalPrice: 4999,
    image: "https://starlingtales.vercel.app/14.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/14.jpeg",
      "https://starlingtales.vercel.app/12.jpeg",
      "https://starlingtales.vercel.app/13.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Sibling & Twins",
    badge: "Gift Set",
    rating: 4.9,
    reviews: 48,
    inStock: true,
    description:
      "Three handcrafted linen bunnies—each with their own bespoke clothing—nestled inside an embroidered storage basket. Perfect for nursery decor, sibling gifting, or twin baby celebrations.",
    includedItems: [
      "3 Handcrafted Linen Bunny Companions (25cm each)",
      "Hand-stitched Outfits (Denim pinafore, floral romper, knitted dungarees)",
      "Premium Thick-Woven Rope Nursery Basket (26cm dia)",
      "Personalised Embroidered Initial Patch",
      "Botanical Gifting Tag with Dried Lavender Sachet",
    ],
    details: [
      "Set includes 3 bunnies + 1 basket",
      "Dimensions: 26cm dia x 20cm ht",
      "Material: Cotton linen blend with hypoallergenic polyfill",
      "Spot clean only",
      "Suitable for ages 1+",
    ],
    tags: ["bunnies", "triplet", "siblings", "basket", "keepsake"],
    variants: [
      { label: "Pastel Meadow Trio", sku: "HMP-BF-PM" },
      { label: "Autumn Earth Trio", sku: "HMP-BF-AE" },
    ],
  },
  {
    id: "hamper-3",
    name: "Nursery Woodland Symphony Set",
    tagline:
      "A dreamscape collection featuring Ellie Elephant and reversible unicorn muslin quilt.",
    price: 4899,
    originalPrice: 5499,
    image: "https://starlingtales.vercel.app/11.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/11.jpeg",
      "https://starlingtales.vercel.app/10.jpeg",
      "https://starlingtales.vercel.app/3.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Newborn & Baby Shower",
    badge: "Luxury",
    rating: 4.9,
    reviews: 52,
    inStock: true,
    description:
      "An enchanting nursery curation uniting our beloved Ellie Elephant with a reversible unicorn muslin quilt, soft knitted baby booties, and a hardbound illustrated bedtime chronicle.",
    includedItems: [
      "Ellie Elephant Plush Companion with Velvet Accents (28cm)",
      "Reversible Unicorn & Wildflowers Muslin Quilt (100x130cm)",
      "Handmade Knitted Organic Cotton Booties",
      "Starling Tales Bedtime Storybook & Bookmark",
      "Signature Pine Wood Keepsake Crate with Slide Lid",
    ],
    details: [
      "Pine Crate Dimensions: 35cm x 28cm x 15cm",
      "Quilt: 4-layer 100% breathable organic cotton muslin",
      "Safe from birth (0m+)",
      "Re-usable heirloom wooden storage chest",
    ],
    tags: ["elephant", "quilt", "woodland", "nursery", "luxury"],
    variants: [
      { label: "Dove Grey & Sage", sku: "HMP-WS-DGS" },
      { label: "Blush & Ivory", sku: "HMP-WS-BI" },
    ],
  },
  {
    id: "hamper-4",
    name: "The Little Dreamer Celebration Trunk",
    tagline:
      "An imaginative toddler milestone gift with Dreamer Doll & personalised waffle backpack.",
    price: 5299,
    originalPrice: 5999,
    image: "https://starlingtales.vercel.app/6.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/6.jpeg",
      "https://starlingtales.vercel.app/8.jpeg",
      "https://starlingtales.vercel.app/7.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Milestone & Birthday",
    badge: "Personalised",
    rating: 4.8,
    reviews: 39,
    inStock: true,
    description:
      "The ultimate 1st, 2nd, or 3rd birthday milestone gift. Features our expressive Dreamer Doll paired with a waffle-knit toddler backpack (customizable with your child's embroidered name) and wooden milestone adventure discs.",
    includedItems: [
      "Handcrafted Dreamer Doll in Linen Pinafore (30cm)",
      "Waffle-Knit Toddler Backpack with Front Companion Pocket",
      "Set of 6 Double-Sided Wooden Milestone Adventure Discs",
      "Embroidered Custom Name Tag for Backpack",
      "Festive Gifting Box with Ribbon & Confetti Keepsake",
    ],
    details: [
      "Backpack: 28cm x 22cm x 10cm with adjustable straps",
      "Doll: 100% cotton with soft hypoallergenic filling",
      "Embroidery included in package price",
      "Suitable for ages 1 to 5 years",
    ],
    tags: ["dreamer", "backpack", "birthday", "toddler", "personalised"],
    variants: [
      { label: "Sage Green Backpack + Doll", sku: "HMP-LD-SG" },
      { label: "Dusty Pink Backpack + Doll", sku: "HMP-LD-DP" },
    ],
  },
  {
    id: "hamper-5",
    name: "Sweet Serenade Newborn Basket",
    tagline:
      "Gentle kangaroo companion with hidden pocket surprises and organic swaddles.",
    price: 3699,
    originalPrice: 4199,
    image: "https://starlingtales.vercel.app/1.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/1.jpeg",
      "https://starlingtales.vercel.app/13.jpeg",
      "https://starlingtales.vercel.app/19.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Newborn & Baby Shower",
    badge: "New",
    rating: 4.9,
    reviews: 27,
    inStock: true,
    description:
      "A poetic tribute to unconditional love. Kiki Kangaroo holds a tiny removable joey in her front pouch, accompanied by a pack of two butter-soft organic muslin swaddles and a soothing natural silicone & wood teether ring.",
    includedItems: [
      "Kiki Kangaroo Knitted Companion with Joey (32cm)",
      "Pair of Organic Cotton Muslin Swaddles (110x110cm)",
      "Beechwood & Food-Grade Silicone Star Teether",
      "Starling Tales Lullaby Keepsake Audio Card",
      "Hand-woven Seagrass Hamper Basket with Handles",
    ],
    details: [
      "Basket: 30cm dia x 18cm ht",
      "Swaddles: Pre-washed, ultra-breathable GOTS certified cotton",
      "Teether: 100% BPA-free, lead-free, non-toxic",
      "Suitable from birth (0m+)",
    ],
    tags: ["kangaroo", "swaddle", "newborn", "teether", "serenade"],
    variants: [
      { label: "Natural Ochre & Oatmeal", sku: "HMP-SS-NO" },
      { label: "Powder Blue & Cloud", sku: "HMP-SS-PB" },
    ],
  },
  {
    id: "hamper-6",
    name: "Tiny Explorer Milestone Hamper",
    tagline:
      "Playful Milo Monkey set in a ticking stripe storage bin for joyful days ahead.",
    price: 4199,
    originalPrice: 4699,
    image: "https://starlingtales.vercel.app/13.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/13.jpeg",
      "https://starlingtales.vercel.app/10.jpeg",
      "https://starlingtales.vercel.app/12.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Milestone & Birthday",
    badge: "Gift Set",
    rating: 4.8,
    reviews: 31,
    inStock: true,
    description:
      "For little adventurers ready to explore every corner. Milo Monkey brings lively cheer alongside a ticking-stripe nursery storage basket, organic cuddle blanket, and illustrated growth milestone chart.",
    includedItems: [
      "Milo Monkey Handcrafted Knitted Companion (30cm)",
      "Ticking Stripe Heavy Canvas Storage Tub (35x40cm)",
      "Organic Honeycomb Cuddle Blanket (90x110cm)",
      "Canvas Hanging Height & Milestone Growth Chart",
      "Personalised Wooden Gift Tag",
    ],
    details: [
      "Tub stands upright on its own with double stitched handles",
      "Growth chart measures up to 150cm with wooden hanging frame",
      "Suitable for ages 6m+",
    ],
    tags: ["monkey", "milo", "storage", "growth chart", "explorer"],
    variants: [
      { label: "Mocha Stripe", sku: "HMP-TE-MS" },
      { label: "French Blue Stripe", sku: "HMP-TE-FS" },
    ],
  },
  {
    id: "hamper-7",
    name: "Buttercup Lamb & Floral Dreams Box",
    tagline:
      "Pure boucle softness with matching vintage velvet bonnet and floral swaddle.",
    price: 3799,
    originalPrice: 4299,
    image: "https://starlingtales.vercel.app/4.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/4.jpeg",
      "https://starlingtales.vercel.app/19.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Personalised Sets",
    badge: "New",
    rating: 5.0,
    reviews: 21,
    inStock: true,
    description:
      "A soothing pastel dream box designed for peaceful naps and sweet photography keepsakes. Features Buttercup Lamb with a gentle jingle bell, a vintage-style cotton bonnet, and a botanical botanical-print swaddle.",
    includedItems: [
      "Buttercup Lamb Boucle Soft Toy with Silver Bell (22cm)",
      "Vintage Frill Cotton Bonnet (0-6m or 6-12m)",
      "Botanical Meadow Organic Muslin Swaddle (120x120cm)",
      "Handcrafted Wooden Hairbrush with Soft Goat Hair Bristles",
      "Matte Sage Presentation Box with Gold Foil Lettering",
    ],
    details: [
      "Presentation Box: 28cm x 24cm x 12cm",
      "Lamb: Ultra-soft boucle with cotton lining",
      "Brush: 100% natural goat bristles, safe for baby cradle cap",
      "Suitable from birth (0m+)",
    ],
    tags: ["lamb", "buttercup", "bonnet", "photography", "floral"],
    variants: [
      { label: "0-6 Months (Ivory/Rose)", sku: "HMP-BL-06" },
      { label: "6-12 Months (Ivory/Rose)", sku: "HMP-BL-612" },
    ],
  },
  {
    id: "hamper-8",
    name: "The Royal Starling Heritage Trunk",
    tagline:
      "The ultimate luxury grand keepsake trunk with two heirloom toys & twin quilts.",
    price: 7999,
    originalPrice: 8999,
    image: "https://starlingtales.vercel.app/12.jpeg",
    gallery: [
      "https://starlingtales.vercel.app/12.jpeg",
      "https://starlingtales.vercel.app/19.jpeg",
      "https://starlingtales.vercel.app/14.jpeg",
      "https://starlingtales.vercel.app/10.jpeg",
    ],
    category: "Gift Hampers",
    occasion: "Heritage Keepsakes",
    badge: "Luxury",
    rating: 5.0,
    reviews: 19,
    inStock: true,
    description:
      "Our most prestigious grand gifting experience. Housed in an artisan handcrafted wooden vintage memory trunk with brass latches. Contains two handmade companion toys of your choice, luxury quilts, silver-plated memory vial, and personalized leather monogram tag.",
    includedItems: [
      "2 Choice of Starling Heirloom Companions (Benny, Ellie, Dreamer, Kiki, or Milo)",
      "1 Handcrafted Muslin Quilt + 1 Organic Waffle Blanket",
      "Hand-Hammered Keepsake Silver Milestone Vial",
      "Custom Engraved Genuine Leather Monogram Trunk Luggage Tag",
      "Solid Wood Heritage Keepsake Trunk with Brass Fasteners",
      "Framed Starling Certificate of Authenticity & Calligraphy Letter",
    ],
    details: [
      "Trunk Dimensions: 45cm x 32cm x 22cm",
      "Solid sustainable pine with vintage brass hardware",
      "Engraving and personalization included",
      "Lifelong keepsake for heirloom preservation",
    ],
    tags: ["heritage", "luxury", "trunk", "grand", "keepsake", "royal"],
    variants: [
      { label: "Benny & Ellie Duo Set", sku: "HMP-RH-BE" },
      { label: "Dreamer Doll & Milo Duo Set", sku: "HMP-RH-DM" },
      { label: "Custom Selected Duo Set", sku: "HMP-RH-CS" },
    ],
  },
];

export const HAMPER_TESTIMONIALS = [
  {
    name: "Aanya Singhania",
    location: "Mumbai",
    occasion: "Sister's Baby Shower",
    comment:
      "The Heirloom Welcome Hamper took everyone's breath away! The presentation with the wax seal, the softness of the Benny Dog toy, and the organic blanket felt like an old European fairytale. Worth every rupee.",
    rating: 5,
  },
  {
    name: "Rohan & Devika Verma",
    location: "Bengaluru",
    occasion: "First Birthday Gift",
    comment:
      "Ordered the Little Dreamer Celebration Trunk for our niece. The personalized embroidery on the waffle backpack was exquisite. She hugs her Dreamer Doll to sleep every single night.",
    rating: 5,
  },
  {
    name: "Priyanka Nair",
    location: "New Delhi",
    occasion: "Twin Nephews Arrival",
    comment:
      "Finding a hamper fit for twins was tough until I found the Bunny Family Keepsake Basket. The craftsmanship is pure poetry. Arrived safely packaged without a single crease.",
    rating: 5,
  },
];

export const HAMPER_FAQS = [
  {
    question: "Can I include a personalized handwritten message?",
    answer:
      "Absolutely! Every Starling Tales gift hamper includes a complimentary archival calligraphy card. During checkout or by contacting our concierge, you can specify your exact message, which will be hand-lettered and sealed with our signature botanical wax stamp.",
  },
  {
    question: "Are all items inside safe for newborn babies?",
    answer:
      "Yes, 100%. All plush companions are stitched with hypoallergenic cotton and safety-tested details. All textiles are made from GOTS-certified organic cotton, and wooden items are crafted from untreated natural beechwood with non-toxic finishes.",
  },
  {
    question: "How are the gift hampers packed for shipping?",
    answer:
      "Each hamper is placed within its decorative keepsake container (woven basket or wooden pine chest), wrapped in botanical tissue paper, tied with a satin ribbon, and then encased in heavy-duty protective double-corrugated shipping cartons to arrive in pristine condition.",
  },
  {
    question: "Can I create a custom hamper or request corporate/bulk gifting?",
    answer:
      "Yes! Our gifting concierge can assist you with custom curated sets, corporate baby gifting, baby shower favors, and personalized monograms. Use our 'Build Your Own Hamper' option or reach out directly to our team.",
  },
];
