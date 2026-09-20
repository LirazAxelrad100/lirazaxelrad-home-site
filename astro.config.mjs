import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://lirazaxelrad.com",
  output: "static",
  trailingSlash: "never",
  // Old WordPress URLs that are still in Google's index. A 301 hands their
  // ranking to the page that replaced them instead of throwing it away.
  // trailingSlash: "never" turns the slash forms Google indexed into a 308
  // onto these keys first, so only the slashless form needs listing here.
  redirects: {
    "/about-me": "/about",
    "/mbsr": "/meditation",

    // The old blog's mindfulness category archive.
    "/category/מיינדפולנס": "/meditation",
    "/category/%D7%9E%D7%99%D7%99%D7%A0%D7%93%D7%A4%D7%95%D7%9C%D7%A0%D7%A1": "/meditation",

    // Every post moved to Substack keeping its slug, so the old
    // /YYYY/MM/DD/<slug>/ URL maps onto /p/<slug>. Regenerate with
    // scripts/make-post-redirects.mjs if posts are ever added there.
    "/2020/09/07/mbsr-mindfulness-based-stress-reduction-training-in-berlin": "https://lirazaxelrad.substack.com/p/mbsr-mindfulness-based-stress-reduction-training-in-berlin", // MBSR – שינוי פנימי באמצעות אימון מוחי
    "/2020/10/15/product-management-consultancy": "https://lirazaxelrad.substack.com/p/product-management-consultancy", // ניהול מוצר – ייעוץ ומנטורינג
    "/2020/12/05/strolling": "https://lirazaxelrad.substack.com/p/strolling", // שוטטות
    "/2021/01/01/searching-and-comparing": "https://lirazaxelrad.substack.com/p/searching-and-comparing", // חיפושים והשוואות
    "/2021/01/17/stories-from-tel-aviv": "https://lirazaxelrad.substack.com/p/stories-from-tel-aviv", // פכים קטנים מתקופה לא קצרה בתל אביב
    "/2021/02/07/upekkha": "https://lirazaxelrad.substack.com/p/upekkha", // אופקה, תירגול, פקספקטיבה רחבה וכרטיס טיסה שאין מ
    "/2021/04/24/home-retreat": "https://lirazaxelrad.substack.com/p/home-retreat", // ריטריט, בית. ריטריט בבית
    "/2021/08/28/a-world-coming-into-being": "https://lirazaxelrad.substack.com/p/a-world-coming-into-being", // ״לראות עולם נברא״
    "/2022/01/23/cold-days-empty-streets": "https://lirazaxelrad.substack.com/p/cold-days-empty-streets", // ימים קרים, רחובות ריקים
    "/2022/03/13/spring_fever": "https://lirazaxelrad.substack.com/p/spring_fever", // התפרצות. התפוצצות. קדחת אביב. זאת אני הקודחת!
    "/2022/05/15/strolling_again": "https://lirazaxelrad.substack.com/p/strolling_again", // שוטטות
    "/2022/10/01/cranes_over_tel_aviv": "https://lirazaxelrad.substack.com/p/cranes_over_tel_aviv", // עגורנים בשמי תל אביב
    "/2022/10/23/why_to_practice_meditation": "https://lirazaxelrad.substack.com/p/why_to_practice_meditation", // למה לתרגל?
    "/2022/11/12/berlin_9-11_memories_and_changes": "https://lirazaxelrad.substack.com/p/berlin_9-11_memories_and_changes", // מלחמת העולם הראשונה, ליל הבדולח, נפילת החומה, בח
    "/2022/12/17/a_year_without_tabak": "https://lirazaxelrad.substack.com/p/a_year_without_tabak", // שנה בלי סיגריה, טבק, עשן. שנה טובה
    "/2023/04/10/trust_again": "https://lirazaxelrad.substack.com/p/trust_again", // איך אני מחזירה לעצמי את האמון בבני אדם
    "/2023/05/13/reading_primo_levy_in_berlin": "https://lirazaxelrad.substack.com/p/reading_primo_levy_in_berlin", // בני אדם. יהודים. בני אדם יהודים. ״עדיף לשאת עוול
    "/2023/08/18/happening_-annie_-ernaux": "https://lirazaxelrad.substack.com/p/happening_-annie_-ernaux", // ״האירוע״: פמיניזים שמתממש בחיים
    "/2023/09/22/untangling_the_threads": "https://lirazaxelrad.substack.com/p/untangling_the_threads", // זה לא הזמן שסמיך, זה אנחנו
    "/2024/02/02/my_mother_is_dead": "https://lirazaxelrad.substack.com/p/my_mother_is_dead", // אמא רותי מתה
    "/2024/03/16/everything_is_ok": "https://lirazaxelrad.substack.com/p/everything_is_ok", // הכל בסדר
    "/2024/05/19/walking_in_berlin_may_2024": "https://lirazaxelrad.substack.com/p/walking_in_berlin_may_2024", // שיטוט של בוקר, ברלין, מאי 2024
    "/2024/07/13/the-present": "https://lirazaxelrad.substack.com/p/the-present", // ״לא במקרה ההווה נקרא The present״
    "/2024/11/02/tel-aviv-oct-2024": "https://lirazaxelrad.substack.com/p/tel-aviv-oct-2024", // ״גבר, גבר, גבר״, צעק בחור שהלך בשדרות בין ציון ל
    "/2025/04/20/together_on_the_floor": "https://lirazaxelrad.substack.com/p/together_on_the_floor", // ביחד, על המחצלות
    "/2025/09/12/what-do-you-think-about-the-war": "https://lirazaxelrad.substack.com/p/what-do-you-think-about-the-war", // אי אפשר גם לא לעשות סיפור וגם לעשות סיפור
    "/2025/10/19/wating-in-october": "https://lirazaxelrad.substack.com/p/wating-in-october", // אוקטובר הטוב?
    "/2025/10/24/first-hours-in-india": "https://lirazaxelrad.substack.com/p/first-hours-in-india", // שעות ראשונות בהודו
    "/2025/10/31/everything-that-is-human": "https://lirazaxelrad.substack.com/p/everything-that-is-human", // לקסיקון אנושי
    "/2025/11/07/full-moon-arunachala": "https://lirazaxelrad.substack.com/p/full-moon-arunachala", // אבא שלי נפטר, פול מון, אזכרה לרבין, חוטים מתרופפ
    "/2025/11/15/no-filters": "https://lirazaxelrad.substack.com/p/no-filters", // חיים לא מפולטרים
    "/2025/11/17/walking-against-the-flow": "https://lirazaxelrad.substack.com/p/walking-against-the-flow", // דברים שראיתי כשהלכתי הפוך מהזרם
    "/2025/11/30/reading-satipathana-group-invite": "https://lirazaxelrad.substack.com/p/reading-satipathana-group-invite", // הזמנה לסדרת מפגשי קריאה, הרהור ותרגול
    "/2026/02/08/what_the_heart_wants": "https://lirazaxelrad.substack.com/p/what_the_heart_wants", // החזרה לברלין: הגירה, אזרחות, סרטן, קרח, כמיהה של
    "/2026/03/13/white-trails-in-the-sky-forest-exhibition": "https://lirazaxelrad.substack.com/p/white-trails-in-the-sky-forest-exhibition", // שובלים לבנים בשמיים. יער. תערוכה
    "/2026/03/27/going-on-a-three-month-meditation-retreat": "https://lirazaxelrad.substack.com/p/going-on-a-three-month-meditation-retreat", // לקראת יציאה לריטריט מדיטציה של שלושה חודשים
    "/2026/07/04/on-three-month-meditation-retreat": "https://lirazaxelrad.substack.com/p/on-three-month-meditation-retreat", // לשכב על דשא כלשהו, מתחת לעץ כלשהו, להסתכל על חתי
    "/2026/07/06/invitation-to-read-reflect-and-practice": "https://lirazaxelrad.substack.com/p/invitation-to-read-reflect-and-practice", // הזמנה לסדרת מפגשי קריאה, הרהור ותרגול, חלק ב׳
    "/2026/07/23/854": "https://lirazaxelrad.substack.com/p/854", // מה עושים עם המחשבות?
    "/2026/08/09/247": "https://lirazaxelrad.substack.com/p/247", // המקום בו נגמרו לי התוכניות
    "/2026/08/16/ai": "https://lirazaxelrad.substack.com/p/ai", // פייסבוק, רעל, טיך נאט האן, למה אני מתרגלת, וגם A
    "/2026/08/31/a25": "https://lirazaxelrad.substack.com/p/a25", // ״אנחנו זקוקים למראות״
    "/2026/09/06/22f": "https://lirazaxelrad.substack.com/p/22f", // שיפוצים ברחוב שאחריהם הכל נשאר אותו הדבר
    "/2026/09/20/902": "https://lirazaxelrad.substack.com/p/902", // רוצה שינוי אבל שלא יכאב
  },
  adapter: vercel(),
  server: { port: 3000 },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
