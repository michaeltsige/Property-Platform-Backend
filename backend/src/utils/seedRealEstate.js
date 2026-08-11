const mongoose = require('mongoose');
const Property = require('../models/Property');
const User = require('../models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const sampleProperties = [
  {
    title: "Modern 4-Bedroom Villa with Panoramic Terrace",
    description: "Luxurious architectural villa situated in the prestigious Bole district of Addis Ababa. Features an expansive open-plan living room, private rooftop terrace with city views, landscaped garden, and high-spec kitchen fixtures.",
    location: {
      address: "12 Bole Atlas Road",
      city: "Addis Ababa",
      state: "Addis Ababa",
      country: "Ethiopia",
      coordinates: { lat: 8.995, lng: 38.788 }
    },
    price: 450000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_villa_terrace_1",
        caption: "Villa Exterior and Garden"
      },
      {
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_villa_terrace_2",
        caption: "Spacious Living Area"
      }
    ],
    status: "published",
    category: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    amenities: ["Rooftop Terrace", "Garden", "Security", "Parking"]
  },
  {
    title: "Luxury 2-Bedroom Apartment in Kazanchis",
    description: "Sleek and contemporary high-rise apartment near international organizations in Kazanchis. Includes floor-to-ceiling windows, 24/7 security, backup generator, and underground parking.",
    location: {
      address: "45 Kazanchis Avenue",
      city: "Addis Ababa",
      state: "Addis Ababa",
      country: "Ethiopia",
      coordinates: { lat: 9.018, lng: 38.775 }
    },
    price: 180000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_apt_kazanchis_1",
        caption: "Apartment Building Exterior"
      },
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_apt_kazanchis_2",
        caption: "Modern Living & Dining Area"
      }
    ],
    status: "published",
    category: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    amenities: ["Elevator", "Security", "Generator", "Parking"]
  },
  {
    title: "Executive Family Home with Garden in CMC",
    description: "Spacious standalone family home located in the tranquil residential neighborhood of CMC. Offers 5 bedrooms, large manicured compound, staff quarters, and modern bathrooms.",
    location: {
      address: "88 CMC Residential Zone",
      city: "Addis Ababa",
      state: "Addis Ababa",
      country: "Ethiopia",
      coordinates: { lat: 9.023, lng: 38.845 }
    },
    price: 380000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_cmc_home_1",
        caption: "Property Frontage and Compound"
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_cmc_home_2",
        caption: "Modern Bathroom Interior"
      }
    ],
    status: "published",
    category: "house",
    bedrooms: 5,
    bathrooms: 4,
    area: 420,
    amenities: ["Garden", "Staff Quarters", "Security", "Parking"]
  },
  {
    title: "Prime Commercial Office Suite in Bole Medhanialem",
    description: "Modern commercial office space located in the vibrant business center of Bole Medhanialem. Equipped with high-speed fiber connectivity, elevator access, and executive conference rooms.",
    location: {
      address: "204 Bole Medhanialem Plaza",
      city: "Addis Ababa",
      state: "Addis Ababa",
      country: "Ethiopia",
      coordinates: { lat: 8.991, lng: 38.789 }
    },
    price: 320000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_office_bole_1",
        caption: "Executive Open Office Suite"
      }
    ],
    status: "published",
    category: "commercial",
    area: 250,
    amenities: ["Fiber Internet", "Elevator", "Conference Room", "Generator"]
  },
  {
    title: "Charming 3-Bedroom Villa in Dire Dawa",
    description: "Beautifully maintained tropical villa featuring shaded verandas, terracotta tiling, and airy high-ceiling rooms in the heart of Dire Dawa.",
    location: {
      address: "15 Queen of Sheba Way",
      city: "Dire Dawa",
      state: "Dire Dawa",
      country: "Ethiopia",
      coordinates: { lat: 9.593, lng: 41.866 }
    },
    price: 210000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        publicId: "seed_diredawa_1",
        caption: "Villa Exterior and Shaded Patio"
      }
    ],
    status: "published",
    category: "villa",
    bedrooms: 3,
    bathrooms: 2,
    area: 280,
    amenities: ["Veranda", "Garden", "Air Conditioning", "Parking"]
  }
];

const seedProperties = async () => {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error("ERROR: No MONGODB_URI found in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas for seeding properties...");

    let defaultOwner = await User.findOne({});
    if (!defaultOwner) {
      console.log("No users found. Creating a default owner user...");
      defaultOwner = await User.create({
        name: "Michael Tsige",
        email: "michaeltsigecherenet@gmail.com",
        password: "password123",
        role: "owner"
      });
    }

    console.log(`Using owner ID: ${defaultOwner._id} (${defaultOwner.email})`);

    const deleteResult = await Property.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} old properties.`);

    const propertiesWithOwner = sampleProperties.map(p => ({
      ...p,
      owner: defaultOwner._id
    }));

    const inserted = await Property.insertMany(propertiesWithOwner);
    console.log(`Successfully seeded ${inserted.length} real estate properties with high-res architectural photography!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedProperties();
}

module.exports = seedProperties;
