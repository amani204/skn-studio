import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder pricing — roughly bucketed by distance from Alger, just to make
// checkout testable end-to-end. Replace these for real once the admin
// dashboard's delivery rate management is built (or edit directly in Prisma Studio).
const wilayas: { code: number; name: string; home: number; desk: number }[] = [
  { code: 1, name: "Adrar", home: 900, desk: 750 },
  { code: 2, name: "Chlef", home: 450, desk: 350 },
  { code: 3, name: "Laghouat", home: 650, desk: 500 },
  { code: 4, name: "Oum El Bouaghi", home: 550, desk: 400 },
  { code: 5, name: "Batna", home: 550, desk: 400 },
  { code: 6, name: "Béjaïa", home: 450, desk: 350 },
  { code: 7, name: "Biskra", home: 600, desk: 450 },
  { code: 8, name: "Béchar", home: 850, desk: 700 },
  { code: 9, name: "Blida", home: 400, desk: 300 },
  { code: 10, name: "Bouira", home: 450, desk: 350 },
  { code: 11, name: "Tamanrasset", home: 1000, desk: 850 },
  { code: 12, name: "Tébessa", home: 600, desk: 450 },
  { code: 13, name: "Tlemcen", home: 550, desk: 400 },
  { code: 14, name: "Tiaret", home: 500, desk: 400 },
  { code: 15, name: "Tizi Ouzou", home: 450, desk: 350 },
  { code: 16, name: "Alger", home: 350, desk: 250 },
  { code: 17, name: "Djelfa", home: 550, desk: 400 },
  { code: 18, name: "Jijel", home: 500, desk: 400 },
  { code: 19, name: "Sétif", home: 500, desk: 400 },
  { code: 20, name: "Saïda", home: 600, desk: 450 },
  { code: 21, name: "Skikda", home: 500, desk: 400 },
  { code: 22, name: "Sidi Bel Abbès", home: 550, desk: 400 },
  { code: 23, name: "Annaba", home: 550, desk: 400 },
  { code: 24, name: "Guelma", home: 550, desk: 400 },
  { code: 25, name: "Constantine", home: 500, desk: 400 },
  { code: 26, name: "Médéa", home: 450, desk: 350 },
  { code: 27, name: "Mostaganem", home: 500, desk: 400 },
  { code: 28, name: "M'Sila", home: 550, desk: 400 },
  { code: 29, name: "Mascara", home: 550, desk: 400 },
  { code: 30, name: "Ouargla", home: 700, desk: 550 },
  { code: 31, name: "Oran", home: 500, desk: 400 },
  { code: 32, name: "El Bayadh", home: 700, desk: 550 },
  { code: 33, name: "Illizi", home: 1000, desk: 850 },
  { code: 34, name: "Bordj Bou Arréridj", home: 500, desk: 400 },
  { code: 35, name: "Boumerdès", home: 400, desk: 300 },
  { code: 36, name: "El Tarf", home: 550, desk: 400 },
  { code: 37, name: "Tindouf", home: 1000, desk: 850 },
  { code: 38, name: "Tissemsilt", home: 500, desk: 400 },
  { code: 39, name: "El Oued", home: 700, desk: 550 },
  { code: 40, name: "Khenchela", home: 600, desk: 450 },
  { code: 41, name: "Souk Ahras", home: 600, desk: 450 },
  { code: 42, name: "Tipaza", home: 400, desk: 300 },
  { code: 43, name: "Mila", home: 500, desk: 400 },
  { code: 44, name: "Aïn Defla", home: 450, desk: 350 },
  { code: 45, name: "Naâma", home: 750, desk: 600 },
  { code: 46, name: "Aïn Témouchent", home: 550, desk: 400 },
  { code: 47, name: "Ghardaïa", home: 700, desk: 550 },
  { code: 48, name: "Relizane", home: 500, desk: 400 },
  { code: 49, name: "Timimoun", home: 950, desk: 800 },
  { code: 50, name: "Bordj Badji Mokhtar", home: 1000, desk: 850 },
  { code: 51, name: "Ouled Djellal", home: 650, desk: 500 },
  { code: 52, name: "Béni Abbès", home: 900, desk: 750 },
  { code: 53, name: "In Salah", home: 1000, desk: 850 },
  { code: 54, name: "In Guezzam", home: 1050, desk: 900 },
  { code: 55, name: "Touggourt", home: 700, desk: 550 },
  { code: 56, name: "Djanet", home: 1050, desk: 900 },
  { code: 57, name: "El M'Ghair", home: 700, desk: 550 },
  { code: 58, name: "El Meniaa", home: 800, desk: 650 },
];

async function main() {
  for (const w of wilayas) {
    await prisma.deliveryRate.upsert({
      where: { wilayaCode: w.code },
      update: {}, // don't overwrite if you've already customized it
      create: {
        wilaya: w.name,
        wilayaCode: w.code,
        homePrice: w.home,
        deskPrice: w.desk,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${wilayas.length} wilayas.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());