const brandName = "Art Gallery";
const contactText = "Please contact us through the contact information provided on this website.";

const english = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    updated: "Last updated: April 2026",
    intro: `${brandName} respects your privacy and is committed to protecting your personal information in accordance with applicable data protection laws, including PIPEDA and, where applicable, GDPR.`,
    sections: [
      {
        title: "Information We Collect",
        body: [
          "We may collect account information such as name, email address, and encrypted password.",
          "We may collect contact and order information such as shipping address and phone number for delivery or order-related communication.",
          "Payment details are processed securely by third-party providers. We do not store full credit card information.",
          "If third-party login is enabled, we may receive basic profile information such as name and email address.",
          "We may collect technical and usage data such as IP address, browser type, device information, pages visited, and interactions.",
        ],
      },
      {
        title: "How We Use Your Information",
        body: [
          "We use personal information to create and manage accounts, process and fulfill orders, arrange shipping, communicate about purchases or inquiries, improve the website, and help detect fraud or unauthorized activity.",
        ],
      },
      {
        title: "Legal Basis for Processing",
        body: [
          "Where applicable, we process data based on performance of a contract, legitimate interests such as website improvement and security, and consent where required.",
        ],
      },
      {
        title: "Payments",
        body: [
          "Payments may be processed by third-party providers such as Stripe or PayPal.",
          "We do not collect or store full payment details. Payment data is handled directly by those providers according to their own privacy policies.",
        ],
      },
      {
        title: "Authentication Services",
        body: [
          "If third-party login such as Google OAuth is offered, using that service authorizes us to receive the basic profile information required to create or access your account.",
        ],
      },
      {
        title: "Sharing of Information",
        body: [
          "We do not sell, rent, or trade personal data.",
          "We may share information with trusted third parties only when necessary, including payment processors, shipping carriers, hosting providers, and infrastructure providers.",
        ],
      },
      {
        title: "Cookies & Tracking Technologies",
        body: [
          "We use cookies and similar technologies to maintain login sessions, improve user experience, and analyze website performance.",
          "You may control cookies through your browser settings.",
        ],
      },
      {
        title: "Data Retention and Security",
        body: [
          "We retain personal information only as long as necessary to fulfill orders, provide services, comply with legal or accounting obligations, and resolve disputes.",
          "We use appropriate technical and organizational measures to protect personal information, but no system can guarantee absolute security.",
        ],
      },
      {
        title: "Your Rights and Contact",
        body: [
          "Depending on your location, you may have the right to access, correct, delete, or withdraw consent for your personal data.",
          contactText,
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Service",
    updated: "Last updated: April 2026",
    intro: `By accessing or purchasing from ${brandName}, you agree to these Terms of Service.`,
    sections: [
      {
        title: "Overview",
        body: [
          `This website is operated by ${brandName}. These terms apply to visitors, customers, and account holders.`,
        ],
      },
      {
        title: "Products and Artwork",
        body: [
          "Artworks sold on this website may include original works or limited editions created by the artist and are subject to availability.",
          "Colors may vary slightly due to screen settings. Each artwork is unique and may contain natural variations.",
        ],
      },
      {
        title: "Orders and Payments",
        body: [
          "Payments may be accepted through Stripe, PayPal, or other supported providers.",
          "Orders are confirmed only after successful payment.",
          "We reserve the right to refuse or cancel orders in cases of fraud, error, or availability issues.",
        ],
      },
      {
        title: "Accounts",
        body: [
          "When creating an account, you agree to provide accurate information, keep login credentials secure, and be responsible for activity under your account.",
          "We reserve the right to suspend accounts if misuse is detected.",
        ],
      },
      {
        title: "Shipping",
        body: [
          "Orders are shipped to the address provided at checkout. Delivery times vary by location.",
          "Customers are responsible for providing correct shipping details. We are not responsible for carrier delays or lost packages caused by incorrect address information.",
        ],
      },
      {
        title: "Returns and Refunds",
        body: [
          "Due to the nature of original artwork, all sales are final except where artwork arrives damaged.",
          "If artwork arrives damaged, contact us within 48 hours with photos of the artwork and packaging. We will review and may offer a replacement, partial refund, or full refund where appropriate.",
        ],
      },
      {
        title: "Intellectual Property",
        body: [
          "All artworks, images, and website content remain the intellectual property of the artist or rights holder.",
          "Purchasing artwork does not grant reproduction, commercial usage, distribution, NFT minting, modification, or derivative-work rights unless agreed in writing.",
        ],
      },
      {
        title: "Limitation of Liability",
        body: [
          "We are not liable for indirect or incidental damages, losses related to misuse of the website, or interruptions from third-party services such as payment, hosting, or shipping providers.",
        ],
      },
      {
        title: "Modifications, Law, and Contact",
        body: [
          "We may update these terms at any time. Changes take effect when posted.",
          "These terms are governed by the laws of Canada.",
          contactText,
        ],
      },
    ],
  },
  policies: {
    eyebrow: "Orders",
    title: "Refund, Shipping, and Commission Terms",
    updated: "Last updated: April 2026",
    intro: "These terms explain how refunds, shipping, and custom artwork commissions are handled.",
    sections: [
      {
        title: "Refund Policy",
        body: [
          "Each artwork is carefully created and handled with attention to detail.",
          "Due to the nature of original artwork, all sales are final. Returns or exchanges are not accepted except when an item arrives damaged.",
          "If artwork arrives damaged, contact us within 48 hours of delivery and provide photos of the artwork and packaging.",
          "After review, we may offer a replacement if possible, a partial refund, or a full refund.",
          "Original artworks, limited edition pieces, and custom or commissioned works are non-returnable.",
          "Slight color variations caused by screens are not considered defects. Buyers are responsible for providing the correct shipping address.",
        ],
      },
      {
        title: "Shipping Policy",
        body: [
          "We ship worldwide from Canada.",
          "Orders are usually processed within 3 to 7 business days.",
          "Estimated shipping time is 2 to 7 days in Canada, 5 to 10 days in the United States, and 7 to 21 days internationally. These estimates are not guaranteed.",
          "Shipping fees may be calculated at checkout or handled as a flat rate depending on the order setup.",
          "Tracking information will be provided once the order ships.",
          "International customers are responsible for import taxes and customs duties.",
          "We are not responsible for carrier delays, customs delays, or lost packages after shipment.",
        ],
      },
      {
        title: "Commission Terms",
        body: [
          "Custom artwork commissions may be available upon request.",
          "The usual process includes inquiry, concept discussion, price agreement, payment, creation, and delivery.",
          "Full payment or a deposit may be required before work begins. Payments may be processed through Stripe or PayPal once payment features are enabled.",
          "Limited revisions may be offered during the sketch phase. Major changes after completion may incur additional fees.",
          "The timeline depends on project complexity and will be estimated before work begins.",
          "Commissioned artworks are non-refundable and non-returnable.",
          "The artist retains creative control while respecting the agreed direction.",
          "The artist retains copyright of commissioned work unless otherwise agreed in writing.",
        ],
      },
    ],
  },
};

const french = {
  privacy: {
    ...english.privacy,
    eyebrow: "Confidentialite",
    title: "Politique de confidentialite",
    updated: "Derniere mise a jour : avril 2026",
    intro: `${brandName} respecte votre vie privee et s'engage a proteger vos renseignements personnels conformement aux lois applicables, dont la LPRPDE et, le cas echeant, le RGPD.`,
  },
  terms: {
    ...english.terms,
    eyebrow: "Conditions",
    title: "Conditions d'utilisation",
    updated: "Derniere mise a jour : avril 2026",
    intro: `En consultant ou en achetant sur ${brandName}, vous acceptez ces conditions d'utilisation.`,
  },
  policies: {
    ...english.policies,
    eyebrow: "Commandes",
    title: "Remboursement, livraison et commissions",
    updated: "Derniere mise a jour : avril 2026",
    intro: "Ces conditions expliquent la gestion des remboursements, de la livraison et des commandes personnalisees.",
  },
};

const chinese = {
  privacy: {
    ...english.privacy,
    eyebrow: "隐私",
    title: "隐私政策",
    updated: "最后更新：2026 年 4 月",
    intro: `${brandName} 尊重您的隐私，并会根据适用的数据保护法律保护您的个人信息，包括 PIPEDA 以及在适用情况下的 GDPR。`,
  },
  terms: {
    ...english.terms,
    eyebrow: "条款",
    title: "使用条款",
    updated: "最后更新：2026 年 4 月",
    intro: `访问或购买 ${brandName} 的商品，即表示您同意这些使用条款。`,
  },
  policies: {
    ...english.policies,
    eyebrow: "订单",
    title: "退款、配送与委托创作条款",
    updated: "最后更新：2026 年 4 月",
    intro: "这些条款说明退款、配送以及定制艺术品委托创作的处理方式。",
  },
};

const legalContent = {
  en: english,
  fr: french,
  zh: chinese,
};

export function getLegalDocument(locale, key) {
  return legalContent[locale]?.[key] ?? legalContent.fr[key] ?? legalContent.en[key];
}
