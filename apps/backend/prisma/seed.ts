import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env") });

import { PrismaClient, WorkPriceType, WorkStatus } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.work.deleteMany();
  console.log("Cleared existing works.");

  await prisma.work.createMany({
    data: [
      {
        slug: "classic-ring-001",
        titleZh: "流光戒指",
        titleEn: "Luminous Ring",
        subtitleZh: "18K 金手工鍛造",
        descriptionZh:
          "以最純粹的 18K 金為材，經由師傅雙手反覆鍛造，呈現出柔和而充滿生命力的光澤。戒面的弧度如月牙般舒展，配戴後與肌膚相互輝映。",
        storyZh:
          "這枚戒指的設計靈感來自清晨第一道陽光穿透薄霧的瞬間，師傅耗費三週反覆調整金屬的厚度與弧度，才找到那個完美的平衡點。",
        categoryId: "ring",
        materials: ["18K 金"],
        techniques: ["手工鍛造", "拋光"],
        dimensions: "戒圍 12 號，可調整",
        year: "2024",
        priceType: WorkPriceType.fixed,
        price: 128000,
        currency: "TWD",
        isAvailable: true,
        isCustomizable: true,
        isFeatured: true,
        status: WorkStatus.published,
        coverImage: "",
        sortOrder: 1,
      },
      {
        slug: "celestial-necklace-001",
        titleZh: "星軌項鍊",
        titleEn: "Celestial Necklace",
        subtitleZh: "18K 金 × 天然鑽石",
        descriptionZh:
          "以 18K 金為軌道，嵌入七顆天然鑽石，模擬星體繞行的軌跡。鏈身採手工編織工法，輕盈柔韌，貼合頸部曲線，日夜皆宜佩戴。",
        storyZh:
          "師傅在山頂仰望星空的那個夜晚，決定將這道美麗的弧線化為金工作品。每顆鑽石的位置都經過精密計算，還原星體之間真實的相對距離。",
        categoryId: "necklace",
        materials: ["18K 金", "天然鑽石 0.35ct"],
        techniques: ["手工編織", "爪鑲", "拋光"],
        dimensions: "鏈長 45cm，可調整至 40cm",
        year: "2024",
        priceType: WorkPriceType.fixed,
        price: 256000,
        currency: "TWD",
        isAvailable: true,
        isCustomizable: false,
        isFeatured: true,
        status: WorkStatus.published,
        coverImage: "",
        sortOrder: 2,
      },
      {
        slug: "jade-bracelet-001",
        titleZh: "山嵐手環",
        titleEn: "Mountain Mist Bracelet",
        subtitleZh: "18K 金 × 天然翡翠",
        descriptionZh:
          "精選緬甸天然翡翠，以 18K 金手工鑲嵌而成。翡翠深邃的綠意與金屬的暖光相互映襯，呈現出東方美學中含蓄而高貴的氣韻。",
        storyZh:
          "這塊翡翠在礦石堆中沉睡了數百年，等待著遇見合適的師傅將其喚醒。師傅花了整整一個月觀察石頭的紋路與光澤，才決定這枚鑲嵌的形式。",
        categoryId: "bracelet",
        materials: ["18K 金", "天然翡翠 A 貨"],
        techniques: ["包鑲", "手工拋光", "車花"],
        dimensions: "內徑 58mm，手圍 17–18cm 適用",
        year: "2025",
        priceType: WorkPriceType.inquiry,
        currency: "TWD",
        isAvailable: true,
        isCustomizable: false,
        isFeatured: true,
        status: WorkStatus.published,
        coverImage: "",
        sortOrder: 3,
      },
      {
        slug: "drop-earring-001",
        titleZh: "水滴耳環",
        titleEn: "Raindrop Earrings",
        subtitleZh: "18K 金手工失蠟鑄造",
        descriptionZh:
          "以失蠟鑄造工法打造的水滴耳環，細膩的表面紋理模擬雨滴落在金屬上的瞬間。輕盈的重量讓佩戴者幾乎感受不到存在，卻在轉頭之間留下難忘的一抹光芒。",
        storyZh:
          "某個梅雨季的午後，師傅看著窗玻璃上的雨滴緩緩滑落，拿起筆記本畫下了這個設計。三個月後，這份草圖終於化為一對值得傳承的耳環。",
        categoryId: "earring",
        materials: ["18K 金"],
        techniques: ["失蠟鑄造", "手工修整", "霧面拋光"],
        dimensions: "長 3.2cm × 寬 1.1cm，重 3.2g / 對",
        year: "2025",
        priceType: WorkPriceType.inquiry,
        currency: "TWD",
        isAvailable: true,
        isCustomizable: true,
        isFeatured: true,
        status: WorkStatus.published,
        coverImage: "",
        sortOrder: 4,
      },
    ],
  });

  console.log("Seeding complete. 4 works inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
