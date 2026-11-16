export const imageVersion = 1;

export const characters = {
  boy: { src: '/characters/boy.png' },
  girl: { src: '/characters/girl.png' }
};

export const GAME_DATA = {
  ui: {
    title: { en: "Bond Master", ar: "خبير السندات" },
    pickHero: { en: "Pick your hero!", ar: "اختر بطلك!" },
    boy: { en: "Boy", ar: "ولد" },
    girl: { en: "Girl", ar: "بنت" },
    matchHint: { en: "Match ❓ with 💡", ar: "طابق ❓ مع 💡" },
    stageLabel: { en: "Stage {n} · {title}", ar: "المرحلة {n} · {title}" },
    stageComplete: { en: "Stage complete!", ar: "اكتملت المرحلة!" },
    next: { en: "Next", ar: "التالي" },
    nextArrow: { en: "▶", ar: "◀" },
    playAgain: { en: "Play again", ar: "العب مرة أخرى" },
    finalTitle: { en: "Bond Master", ar: "خبير السندات" },
    finalSubtitle: { en: "You mastered the bond market!", ar: "لقد أتقنت عالم السندات!" },
    turnUpright: { en: "Turn your phone upright 📱", ar: "اجعل الهاتف عموديًا 📱" },
    turnUprightSub: {
      en: "Rotate your device to continue playing.",
      ar: "أدر هاتفك للوضع العمودي للمتابعة."
    },
    langSwitch: { en: "العربية | English", ar: "العربية | English" },
    muteLabel: { en: "Toggle sound", ar: "تبديل الصوت" },
    stagesAria: { en: "Stages", ar: "المراحل" },
    pairsAria: { en: "Matches in current stage", ar: "التطابقات في المرحلة الحالية" },
    heroAria: { en: "Active Hero", ar: "البطل النشط" }
  },
  heroes: [
    { id: "boy", nameKey: "boy", emoji: "👦" },
    { id: "girl", nameKey: "girl", emoji: "👧" }
  ],
  stages: [
    {
      stageNum: 1,
      title: { en: "What are Bonds?", ar: "ما هي السندات؟" },
      topicEmoji: "📜",
      recap: {
        en: "A bond is a loan you give.",
        ar: "السند قرضٌ تقدّمه لغيرك."
      },
      pairs: [
        {
          id: 1,
          q: { text: { en: "What is a bond?", ar: "ما هو السند؟" }, emoji: "📜" },
          a: { text: { en: "A loan you give", ar: "قرض تُقرضه" }, emoji: "🤝" }
        },
        {
          id: 2,
          q: { text: { en: "Who issues bonds?", ar: "من يُصدر السندات؟" }, emoji: "🏛️" },
          a: { text: { en: "Governments & companies", ar: "الحكومات والشركات" }, emoji: "🏢" }
        },
        {
          id: 3,
          q: { text: { en: "What is face value?", ar: "ما هي القيمة الاسمية؟" }, emoji: "💵" },
          a: { text: { en: "Amount you get back", ar: "المبلغ الذي تستردّه" }, emoji: "🔙" }
        },
        {
          id: 4,
          q: { text: { en: "What is maturity?", ar: "ما هو تاريخ الاستحقاق؟" }, emoji: "⏰" },
          a: { text: { en: "Payback day", ar: "يوم السداد" }, emoji: "📅" }
        },
        {
          id: 5,
          q: { text: { en: "A bondholder is a…?", ar: "حامل السند هو…؟" }, emoji: "🙋" },
          a: { text: { en: "Lender", ar: "مُقرِض" }, emoji: "🤝" }
        }
      ]
    },
    {
      stageNum: 2,
      title: { en: "How Yield Works", ar: "كيف يعمل العائد؟" },
      topicEmoji: "📈",
      recap: {
        en: "Yield is what you earn each year.",
        ar: "العائد هو ما تكسبه كل سنة."
      },
      pairs: [
        {
          id: 6,
          q: { text: { en: "What is a coupon?", ar: "ما هي القسيمة؟" }, emoji: "🎟️" },
          a: { text: { en: "The bond's interest payment", ar: "فائدة السند المدفوعة" }, emoji: "💰" }
        },
        {
          id: 7,
          q: { text: { en: "What is yield?", ar: "ما هو العائد؟" }, emoji: "📈" },
          a: { text: { en: "Your return, as a %", ar: "ربحك السنوي بالنسبة المئوية" }, emoji: "💯" }
        },
        {
          id: 8,
          q: { text: { en: "Pay $100, earn $5/year", ar: "تدفع 100$ وتكسب 5$ كل سنة" }, emoji: "🪙" },
          a: { text: { en: "5%", ar: "5%" }, emoji: "5️⃣" }
        },
        {
          id: 9,
          q: { text: { en: "Bond price UP ⬆️. Yield?", ar: "سعر السند يرتفع ⬆️. العائد؟" }, emoji: "⚖️" },
          a: { text: { en: "Goes DOWN ⬇️", ar: "ينخفض ⬇️" }, emoji: "📉" }
        },
        {
          id: 10,
          q: { text: { en: "Bond price DOWN ⬇️. Yield?", ar: "سعر السند ينخفض ⬇️. العائد؟" }, emoji: "🔻" },
          a: { text: { en: "Goes UP ⬆️", ar: "يرتفع ⬆️" }, emoji: "📈" }
        }
      ]
    },
    {
      stageNum: 3,
      title: { en: "The Yield Curve", ar: "منحنى العائد" },
      topicEmoji: "📊",
      recap: {
        en: "The curve compares short and long bonds.",
        ar: "المنحنى يقارن السندات القصيرة والطويلة."
      },
      pairs: [
        {
          id: 11,
          q: { text: { en: "What is a yield curve?", ar: "ما هو منحنى العائد؟" }, emoji: "📊" },
          a: { text: { en: "Yields: short to long bonds", ar: "عوائد السندات من القصيرة للطويلة" }, emoji: "↗️" }
        },
        {
          id: 12,
          q: { text: { en: "A normal curve goes…?", ar: "المنحنى العادي يتجه…؟" }, emoji: "🙂" },
          a: { text: { en: "Up ↗️", ar: "لأعلى ↗️" }, emoji: "📈" }
        },
        {
          id: 13,
          q: { text: { en: "Curve turns upside down", ar: "المنحنى ينقلب رأسًا على عقب" }, emoji: "🙃" },
          a: { text: { en: "Warning sign ⚠️", ar: "علامة تحذير ⚠️" }, emoji: "🚨" }
        },
        {
          id: 14,
          q: { text: { en: "Why long bonds pay more?", ar: "لماذا تدفع السندات الطويلة أكثر؟" }, emoji: "⏳" },
          a: { text: { en: "Longer wait = more risk", ar: "انتظار أطول = مخاطرة أكبر" }, emoji: "🎲" }
        },
        {
          id: 15,
          q: { text: { en: "A flat curve means…?", ar: "المنحنى المسطّح يعني…؟" }, emoji: "➖" },
          a: { text: { en: "Same yield, short or long", ar: "عائد متساوٍ، قصير أو طويل" }, emoji: "🟰" }
        }
      ]
    },
    {
      stageNum: 4,
      title: { en: "Why Rates Matter", ar: "لماذا تهم أسعار الفائدة؟" },
      topicEmoji: "🏦",
      recap: {
        en: "Interest rates move bond prices.",
        ar: "أسعار الفائدة تحرّك أسعار السندات."
      },
      pairs: [
        {
          id: 16,
          q: { text: { en: "Who sets the main rate?", ar: "من يحدد سعر الفائدة الرئيسي؟" }, emoji: "🏦" },
          a: { text: { en: "The central bank", ar: "البنك المركزي" }, emoji: "🏛️" }
        },
        {
          id: 17,
          q: { text: { en: "Rates go UP. Borrowing is…?", ar: "الفائدة ترتفع ⬆️. الاقتراض؟" }, emoji: "⬆️" },
          a: { text: { en: "More expensive", ar: "أغلى" }, emoji: "💸" }
        },
        {
          id: 18,
          q: { text: { en: "Rates UP. Old bond prices?", ar: "الفائدة ترتفع ⬆️. سعر السندات القديمة؟" }, emoji: "📜" },
          a: { text: { en: "Go DOWN", ar: "ينخفض" }, emoji: "⬇️" }
        },
        {
          id: 19,
          q: { text: { en: "Rates DOWN. New bonds pay…?", ar: "الفائدة تنخفض ⬇️. السندات الجديدة تدفع…؟" }, emoji: "⬇️" },
          a: { text: { en: "Less interest", ar: "فائدة أقل" }, emoji: "📉" }
        },
        {
          id: 20,
          q: { text: { en: "Rates go DOWN. Borrowing is…?", ar: "الفائدة تنخفض ⬇️. الاقتراض؟" }, emoji: "⬇️" },
          a: { text: { en: "Cheaper", ar: "أرخص" }, emoji: "🛍️" }
        }
      ]
    }
  ]
};
