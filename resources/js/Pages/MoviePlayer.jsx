import React, { useState, useMemo, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { X, Server, Film, Globe } from "lucide-react";
import { motion } from "framer-motion";

// تعريف السيرفرات المتاحة وروابط التضمين الخاصة بها
const SERVER_OPTIONS = [
    {
        id: 1,
        name_en: "Rakan (VidSrc v3)",
        name_ar: "راكان (VidSrc v3)",
        description_en: "Generally better quality. Supports movies and series.",
        description_ar: "جودة عامة أفضل. يدعم الأفلام والمسلسلات.",
        embedUrl: (tmdbId) =>
            `https://vidsrc.cc/v3/embed/movie/${tmdbId}?autoPlay=true`,
    },
    {
        id: 2,
        name_en: "Bard (MoviesAPI Club)",
        name_ar: "بارد (MoviesAPI Club)",
        description_en: "Recommended for recent movies. Alternative source.",
        description_ar: "موصى به للأفلام الحديثة. مصدر بديل.",
        embedUrl: (tmdbId) => `https://moviesapi.club/v/${tmdbId}`,
    },
    {
        id: 3,
        name_en: "Xayah (VidSrc.me)",
        name_ar: "كسايا (VidSrc.me)",
        description_en:
            "Recommended for recent movies. Another alternative source.",
        description_ar: "موصى به للأفلام الحديثة. مصدر بديل آخر.",
        embedUrl: (tmdbId) => `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
    },
    {
        id: 4,
        name_en: "Ekko (Player.VideasY)",
        name_ar: "إيكو (Player.VideasY)",
        description_en: "May have 4K movies. Generally better quality.",
        description_ar: "قد يحتوي على أفلام 4K. جودة عامة أفضل.",
        embedUrl: (tmdbId) => `https://player.videasy.net/movie/${tmdbId}`,
    },
    {
        id: 5,
        name_en: "Naafiri (VidSrc.su)",
        name_ar: "نافييري (VidSrc.su)",
        description_en: "May have 4K movies. Generally better quality.",
        description_ar: "قد يحتوي على أفلام 4K. جودة عامة أفضل.",
        embedUrl: (tmdbId) => `https://vidsrc.su/embed/movie/${tmdbId}`,
    },
    {
        id: 6,
        name_en: "Ryze (Vidlink.pro)",
        name_ar: "رايز (Vidlink.pro)",
        description_en: "Generally better quality. Alternative source.",
        description_ar: "جودة عامة أفضل. مصدر بديل.",
        embedUrl: (tmdbId) =>
            `https://vidlink.pro/movie/${tmdbId}?title=true&poster=true&autoplay=false`,
    },
];

// النصوص المترجمة
const translations = {
    en: {
        title: "Watch Full Movie",
        serverSelection: "Server Selection",
        serverNote:
            "If the current server is not working, you can switch to another one.",
        importantNote:
            "Important Note: These servers are external sources. They may contain ads or stop working at any time.",
        subtitleSupport:
            "Subtitle Support: Arabic subtitle support depends on the selected server. Try switching servers to find the best one.",
        error: "Error: Movie ID not found.",
        selectServer: "Please select a server to watch.",
        back: "Back",
    },
    ar: {
        title: "مشاهدة الفيلم بالكامل",
        serverSelection: "اختيار السيرفر",
        serverNote: "إذا لم يعمل السيرفر الحالي، يمكنك التبديل إلى سيرفر آخر.",
        importantNote:
            "ملاحظة هامة: هذه السيرفرات هي مصادر خارجية. قد تحتوي على إعلانات أو تتوقف عن العمل في أي وقت.",
        subtitleSupport:
            "دعم الترجمة: يعتمد دعم الترجمة العربية على السيرفر المختار. جرب التبديل بين السيرفرات للعثور على الأفضل.",
        error: "خطأ: لم يتم العثور على معرف الفيلم.",
        selectServer: "الرجاء اختيار سيرفر للمشاهدة.",
        back: "عودة",
    },
};

// إضافة CSS مخصص لشريط التمرير (Scrollbar) ولمنع الإعلانات
const customStyles = `
    /* Custom Scrollbar for Server List */
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1f2937; /* Dark track */
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #4b5563; /* Gray thumb */
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
    }

    /* Basic Ad-Blocking CSS (to hide common ad-related elements in the iframe's parent page) */
    /* Note: This is a best-effort attempt. True ad-blocking requires a browser extension. */
    iframe[src*="ad"], iframe[src*="pop"], div[id*="ad"], div[class*="ad-container"], div[class*="pop-up"] {
        display: none !important;
    }
`;

const MoviePlayer = ({ tmdbId, movieTitle, isDarkMode = true }) => {
    // حالة اللغة: 'en' هو الأساس كما طلب المستخدم
    const [lang, setLang] = useState("en");

    // تطبيق اللغة العربية افتراضياً إذا لم يكن هناك تفضيل سابق
    useEffect(() => {
        // يمكنك هنا قراءة تفضيل اللغة من LocalStorage إذا كنت تدعمه
        // حالياً، سنبقيها على 'en' كما طلب المستخدم
        // setLang(localStorage.getItem('lang') || 'en');
    }, []);

    const t = translations[lang]; // وظيفة الترجمة

    // حالة لتحديد السيرفر النشط، نبدأ بالسيرفر الأول افتراضياً
    const [activeServerId, setActiveServerId] = useState(SERVER_OPTIONS[0].id);

    // حساب رابط التضمين النشط بناءً على TMDB ID والسيرفر المختار
    const activeEmbedUrl = useMemo(() => {
        if (!tmdbId) return null;
        const server = SERVER_OPTIONS.find((s) => s.id === activeServerId);
        return server ? server.embedUrl(tmdbId) : null;
    }, [tmdbId, activeServerId]);

    if (!tmdbId) {
        return <div className="text-white text-center p-10">{t.error}</div>;
    }

    // تحديد اتجاه النص بناءً على اللغة
    const dir = lang === "ar" ? "rtl" : "ltr";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col p-4 ${
                isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
            dir={dir}
        >
            <Head title={`${t.title}: ${movieTitle || tmdbId}`} />

            {/* تضمين الـ CSS المخصص */}
            <style>{customStyles}</style>

            {/* شريط العنوان والتحكم */}
            <div
                className={`flex justify-between items-center p-4 border-b border-gray-700 ${
                    dir === "rtl" ? "flex-row-reverse" : "flex-row"
                }`}
            >
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Film className="w-6 h-6 text-red-500" />
                    {t.title}: {movieTitle || `TMDB ID: ${tmdbId}`}
                </h1>

                <div className="flex items-center gap-3">
                    {/* زر تبديل اللغة */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300"
                        title={
                            lang === "ar"
                                ? "Switch to English"
                                : "التبديل إلى العربية"
                        }
                    >
                        <Globe className="w-5 h-5" />
                    </motion.button>

                    {/* زر العودة */}
                    <Link href={route("home")}>
                        <motion.button
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
                            title={t.back}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* محتوى المشغل والسيرفرات */}
            <div
                className={`flex flex-col lg:flex-row flex-grow overflow-hidden p-4 gap-4 ${
                    dir === "rtl" ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
            >
                {/* قسم المشغل */}
                <div className="lg:w-3/4 w-full h-full lg:h-auto bg-black rounded-xl shadow-2xl overflow-hidden">
                    {activeEmbedUrl ? (
                        <iframe
                            key={activeServerId}
                            src={activeEmbedUrl}
                            title={`${
                                movieTitle || tmdbId
                            } Player - Server ${activeServerId}`}
                            allowFullScreen
                            frameBorder="0"
                            scrolling="no"
                            className="w-full h-full"
                            onError={() =>
                                console.error(
                                    `Server ${activeServerId} failed to load.`
                                )
                            }
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50">
                            {t.selectServer}
                        </div>
                    )}
                </div>

                {/* قسم اختيار السيرفرات */}
                <div className="lg:w-1/4 w-full lg:h-full overflow-y-auto space-y-3 p-2 rounded-xl bg-gray-800/50 custom-scrollbar">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-gray-700 pb-2">
                        <Server className="w-5 h-5" />
                        {t.serverSelection}
                    </h2>
                    <p className="text-sm text-gray-400">{t.serverNote}</p>
                    {SERVER_OPTIONS.map((server) => (
                        <motion.button
                            key={server.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveServerId(server.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                                activeServerId === server.id
                                    ? "bg-red-600 border-red-600 text-white shadow-lg"
                                    : "bg-gray-700/50 border-gray-700 hover:bg-gray-700 text-gray-200"
                            }`}
                            dir="ltr" // لضمان قراءة أسماء السيرفرات بشكل صحيح
                        >
                            <p className="font-semibold">
                                {lang === "ar"
                                    ? server.name_ar
                                    : server.name_en}
                            </p>
                            <p className="text-xs mt-1 opacity-80">
                                {lang === "ar"
                                    ? server.description_ar
                                    : server.description_en}
                            </p>
                        </motion.button>
                    ))}
                    <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg text-sm text-yellow-300">
                        <p>**{t.importantNote}**</p>
                        <p className="mt-1">**{t.subtitleSupport}**</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MoviePlayer;
