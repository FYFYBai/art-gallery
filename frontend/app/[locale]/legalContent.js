const brandName = "Sylvaine Art";

const contact = {
  en: "Please contact us through the contact information provided on this website.",
  fr: "Veuillez nous contacter au moyen des coordonnées indiquées sur ce site.",
  zh: "请通过本网站提供的联系方式与我们联系。",
};

const english = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    intro: `${brandName} respects your privacy and is committed to protecting your personal information in accordance with applicable data protection laws, including PIPEDA and, where applicable, GDPR.`,
    sections: [
      {
        title: "Information We Collect",
        body: [
          "We may collect account information such as name, email address, encrypted password, verification status, and login activity.",
          "We may collect contact and order information such as shipping address, order history, refund request details, and order-related communication.",
          "Payments are processed by Stripe Checkout. We do not store full card details.",
          "We may collect technical and usage data such as IP address, browser type, device information, pages visited, and interactions.",
        ],
      },
      {
        title: "How We Use Your Information",
        body: [
          "We use personal information to create and manage accounts, process and fulfill orders, arrange shipping, communicate about purchases or inquiries, review refund requests, improve the website, and help detect fraud or unauthorized activity.",
        ],
      },
      {
        title: "Payments",
        body: [
          "Payments are handled through Stripe. Stripe processes payment details according to its own privacy and security practices.",
          "We store limited Stripe references such as checkout session, payment intent, and refund identifiers so we can reconcile orders and refunds.",
        ],
      },
      {
        title: "Sharing of Information",
        body: [
          "We do not sell, rent, or trade personal data.",
          "We may share information with trusted third parties only when necessary, including payment processors, email providers, shipping carriers, hosting providers, and infrastructure providers.",
        ],
      },
      {
        title: "Cookies and Analytics",
        body: [
          "We use cookies and similar technologies to maintain login sessions, improve user experience, and analyze website performance.",
          "Page views are stored in aggregated form to avoid collecting unnecessary raw tracking data.",
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
          contact.en,
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Service",
    updated: "Last updated: May 2026",
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
          "Artworks sold on this website are original or limited pieces created by the artist and are subject to availability.",
          "Colors may vary slightly due to screen settings. Each artwork is unique and may contain natural variations.",
        ],
      },
      {
        title: "Orders and Payments",
        body: [
          "Payments are accepted through Stripe Checkout.",
          "Orders are confirmed only after successful payment confirmation.",
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
          "Due to the nature of original artwork, all sales are final except where artwork arrives damaged or where we approve a refund request at our discretion.",
          "If artwork arrives damaged, contact us within 48 hours with photos of the artwork and packaging.",
          "Refund requests submitted through the account page are reviewed manually. Approval is not automatic.",
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
        title: "Law and Contact",
        body: [
          "These terms are governed by the laws of Canada and the applicable laws of Quebec.",
          "We may update these terms at any time. Changes take effect when posted.",
          contact.en,
        ],
      },
    ],
  },
  policies: {
    eyebrow: "Orders",
    title: "Refund, Shipping, and Commission Terms",
    updated: "Last updated: May 2026",
    intro: "These terms explain how refunds, shipping, and custom artwork commissions are handled.",
    sections: [
      {
        title: "Refund Policy",
        body: [
          "Each artwork is carefully created and handled with attention to detail.",
          "Due to the nature of original artwork, all sales are final. Returns or exchanges are not accepted except when an item arrives damaged or a refund request is approved at our discretion.",
          "If artwork arrives damaged, contact us within 48 hours of delivery and provide photos of the artwork and packaging.",
          "After review, we may offer a replacement if possible, a partial refund, or a full refund.",
          "Original artworks, limited edition pieces, and custom or commissioned works are non-returnable unless otherwise agreed in writing.",
          "Slight color variations caused by screens are not considered defects. Buyers are responsible for providing the correct shipping address.",
        ],
      },
      {
        title: "Shipping Policy",
        body: [
          "Orders ship from Canada.",
          "Orders are usually processed within 3 to 7 business days after payment confirmation.",
          "Estimated shipping time is 2 to 7 days in Canada, 5 to 10 days in the United States, and 7 to 21 days internationally. These estimates are not guaranteed.",
          "Shipping fees are not finalized yet and must be confirmed before production checkout goes live.",
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
          "Full payment or a deposit may be required before work begins.",
          "Limited revisions may be offered during the sketch phase. Major changes after completion may incur additional fees.",
          "The timeline depends on project complexity and will be estimated before work begins.",
          "Commissioned artworks are non-refundable and non-returnable unless otherwise agreed in writing.",
          "The artist retains creative control while respecting the agreed direction.",
          "The artist retains copyright of commissioned work unless otherwise agreed in writing.",
        ],
      },
    ],
  },
};

const french = {
  privacy: {
    eyebrow: "Confidentialité",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : mai 2026",
    intro: `${brandName} respecte votre vie privée et s’engage à protéger vos renseignements personnels conformément aux lois applicables, dont la LPRPDE et, le cas échéant, le RGPD.`,
    sections: [
      {
        title: "Renseignements recueillis",
        body: [
          "Nous pouvons recueillir des renseignements de compte, comme le nom, l’adresse email, le mot de passe chiffré, l’état de vérification et l’activité de connexion.",
          "Nous pouvons recueillir des renseignements de contact et de commande, comme l’adresse de livraison, l’historique des commandes, les détails de demandes de remboursement et les communications liées aux commandes.",
          "Les paiements sont traités par Stripe Checkout. Nous ne stockons pas les détails complets des cartes bancaires.",
          "Nous pouvons recueillir des données techniques et d’utilisation, comme l’adresse IP, le type de navigateur, l’appareil, les pages consultées et les interactions.",
        ],
      },
      {
        title: "Utilisation des renseignements",
        body: [
          "Nous utilisons les renseignements personnels pour créer et gérer les comptes, traiter les commandes, organiser la livraison, communiquer au sujet des achats ou demandes, examiner les demandes de remboursement, améliorer le site et aider à détecter la fraude ou les accès non autorisés.",
        ],
      },
      {
        title: "Paiements",
        body: [
          "Les paiements sont traités par Stripe. Stripe traite les détails de paiement selon ses propres pratiques de confidentialité et de sécurité.",
          "Nous conservons des références Stripe limitées, comme les identifiants de session de paiement, d’intention de paiement et de remboursement, afin de rapprocher commandes et remboursements.",
        ],
      },
      {
        title: "Partage des renseignements",
        body: [
          "Nous ne vendons, louons ni échangeons les données personnelles.",
          "Nous pouvons partager des renseignements avec des tiers de confiance seulement lorsque nécessaire, notamment les processeurs de paiement, fournisseurs d’email, transporteurs, hébergeurs et fournisseurs d’infrastructure.",
        ],
      },
      {
        title: "Cookies et statistiques",
        body: [
          "Nous utilisons des cookies et technologies similaires pour maintenir les sessions de connexion, améliorer l’expérience utilisateur et analyser la performance du site.",
          "Les vues de pages sont conservées sous forme agrégée afin d’éviter la collecte inutile de données brutes de suivi.",
        ],
      },
      {
        title: "Conservation et sécurité",
        body: [
          "Nous conservons les renseignements personnels seulement aussi longtemps que nécessaire pour traiter les commandes, fournir les services, respecter les obligations légales ou comptables et résoudre les différends.",
          "Nous utilisons des mesures techniques et organisationnelles appropriées pour protéger les renseignements personnels, mais aucun système ne peut garantir une sécurité absolue.",
        ],
      },
      {
        title: "Vos droits et contact",
        body: [
          "Selon votre lieu de résidence, vous pouvez avoir le droit d’accéder à vos données, de les corriger, de les supprimer ou de retirer votre consentement.",
          contact.fr,
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Conditions",
    title: "Conditions d’utilisation",
    updated: "Dernière mise à jour : mai 2026",
    intro: `En consultant ou en achetant sur ${brandName}, vous acceptez ces conditions d’utilisation.`,
    sections: [
      {
        title: "Aperçu",
        body: [
          `Ce site est exploité par ${brandName}. Ces conditions s’appliquent aux visiteurs, clients et titulaires de compte.`,
        ],
      },
      {
        title: "Produits et œuvres",
        body: [
          "Les œuvres vendues sur ce site sont des pièces originales ou limitées créées par l’artiste et offertes selon disponibilité.",
          "Les couleurs peuvent varier légèrement selon les réglages d’écran. Chaque œuvre est unique et peut présenter des variations naturelles.",
        ],
      },
      {
        title: "Commandes et paiements",
        body: [
          "Les paiements sont acceptés par Stripe Checkout.",
          "Les commandes sont confirmées seulement après confirmation du paiement.",
          "Nous nous réservons le droit de refuser ou d’annuler une commande en cas de fraude, d’erreur ou de problème de disponibilité.",
        ],
      },
      {
        title: "Comptes",
        body: [
          "En créant un compte, vous acceptez de fournir des renseignements exacts, de protéger vos identifiants et d’être responsable de l’activité liée à votre compte.",
          "Nous nous réservons le droit de suspendre un compte en cas d’utilisation abusive.",
        ],
      },
      {
        title: "Livraison",
        body: [
          "Les commandes sont expédiées à l’adresse fournie au paiement. Les délais varient selon la destination.",
          "Le client est responsable de fournir des renseignements de livraison exacts. Nous ne sommes pas responsables des retards de transporteur ni des colis perdus en raison d’une adresse incorrecte.",
        ],
      },
      {
        title: "Retours et remboursements",
        body: [
          "En raison de la nature des œuvres originales, toutes les ventes sont finales, sauf si l’œuvre arrive endommagée ou si nous approuvons une demande de remboursement à notre discrétion.",
          "Si une œuvre arrive endommagée, contactez-nous dans les 48 heures avec des photos de l’œuvre et de l’emballage.",
          "Les demandes de remboursement soumises depuis le compte sont examinées manuellement. L’approbation n’est pas automatique.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        body: [
          "Toutes les œuvres, images et contenus du site demeurent la propriété intellectuelle de l’artiste ou du titulaire des droits.",
          "L’achat d’une œuvre n’accorde aucun droit de reproduction, d’usage commercial, de distribution, de création de NFT, de modification ou d’œuvre dérivée, sauf accord écrit.",
        ],
      },
      {
        title: "Droit applicable et contact",
        body: [
          "Ces conditions sont régies par les lois du Canada et les lois applicables du Québec.",
          "Nous pouvons mettre ces conditions à jour à tout moment. Les changements prennent effet lorsqu’ils sont publiés.",
          contact.fr,
        ],
      },
    ],
  },
  policies: {
    eyebrow: "Commandes",
    title: "Remboursement, livraison et commissions",
    updated: "Dernière mise à jour : mai 2026",
    intro: "Ces conditions expliquent la gestion des remboursements, de la livraison et des commandes personnalisées.",
    sections: [
      {
        title: "Politique de remboursement",
        body: [
          "Chaque œuvre est créée et manipulée avec soin.",
          "En raison de la nature des œuvres originales, toutes les ventes sont finales. Les retours ou échanges ne sont pas acceptés, sauf si l’article arrive endommagé ou si une demande de remboursement est approuvée à notre discrétion.",
          "Si une œuvre arrive endommagée, contactez-nous dans les 48 heures suivant la livraison et fournissez des photos de l’œuvre et de l’emballage.",
          "Après examen, nous pouvons offrir un remplacement si possible, un remboursement partiel ou un remboursement complet.",
          "Les œuvres originales, pièces en édition limitée et commandes personnalisées ne sont pas retournables, sauf accord écrit.",
          "Les légères variations de couleur causées par les écrans ne sont pas considérées comme des défauts. L’acheteur est responsable de fournir la bonne adresse de livraison.",
        ],
      },
      {
        title: "Politique de livraison",
        body: [
          "Les commandes sont expédiées depuis le Canada.",
          "Les commandes sont habituellement traitées dans les 3 à 7 jours ouvrables suivant la confirmation du paiement.",
          "Le délai estimé est de 2 à 7 jours au Canada, 5 à 10 jours aux États-Unis et 7 à 21 jours à l’international. Ces estimations ne sont pas garanties.",
          "Les frais de livraison ne sont pas encore finalisés et doivent être confirmés avant la mise en production du paiement.",
          "Les informations de suivi seront fournies lorsque la commande sera expédiée.",
          "Les clients internationaux sont responsables des taxes d’importation et droits de douane.",
          "Nous ne sommes pas responsables des retards de transporteur, des retards douaniers ni des colis perdus après expédition.",
        ],
      },
      {
        title: "Conditions de commission",
        body: [
          "Des œuvres personnalisées peuvent être offertes sur demande.",
          "Le processus habituel comprend la demande, la discussion du concept, l’accord sur le prix, le paiement, la création et la livraison.",
          "Un paiement complet ou un dépôt peut être exigé avant le début du travail.",
          "Des révisions limitées peuvent être offertes à l’étape de croquis. Des changements majeurs après achèvement peuvent entraîner des frais supplémentaires.",
          "Le calendrier dépend de la complexité du projet et sera estimé avant le début du travail.",
          "Les œuvres commandées sont non remboursables et non retournables, sauf accord écrit.",
          "L’artiste conserve le contrôle créatif tout en respectant la direction convenue.",
          "L’artiste conserve les droits d’auteur de l’œuvre commandée, sauf accord écrit contraire.",
        ],
      },
    ],
  },
};

const chinese = {
  privacy: {
    eyebrow: "隐私",
    title: "隐私政策",
    updated: "最后更新：2026 年 5 月",
    intro: `${brandName} 尊重您的隐私，并会根据适用的数据保护法律保护您的个人信息，包括 PIPEDA 以及在适用情况下的 GDPR。`,
    sections: [
      {
        title: "我们收集的信息",
        body: [
          "我们可能收集账户信息，例如姓名、电子邮箱、加密后的密码、邮箱验证状态和登录活动。",
          "我们可能收集联系方式和订单信息，例如配送地址、订单历史、退款请求详情以及与订单相关的沟通内容。",
          "付款通过 Stripe Checkout 处理。我们不会存储完整的银行卡信息。",
          "我们可能收集技术和使用数据，例如 IP 地址、浏览器类型、设备信息、访问页面和互动记录。",
        ],
      },
      {
        title: "信息用途",
        body: [
          "我们使用个人信息来创建和管理账户、处理订单、安排配送、沟通购买或咨询事项、审核退款请求、改进网站，并帮助发现欺诈或未经授权的活动。",
        ],
      },
      {
        title: "付款",
        body: [
          "付款由 Stripe 处理。Stripe 会按照其自身的隐私和安全规则处理付款信息。",
          "我们会保存有限的 Stripe 引用信息，例如结账会话、付款意图和退款标识，用于核对订单和退款。",
        ],
      },
      {
        title: "信息共享",
        body: [
          "我们不会出售、出租或交易个人数据。",
          "仅在必要时，我们会与可信第三方共享信息，包括支付处理方、邮件服务方、承运商、托管服务商和基础设施服务商。",
        ],
      },
      {
        title: "Cookie 与统计",
        body: [
          "我们使用 Cookie 和类似技术来维持登录会话、改善用户体验并分析网站表现。",
          "页面浏览数据以汇总形式保存，以避免收集不必要的原始追踪数据。",
        ],
      },
      {
        title: "数据保存与安全",
        body: [
          "我们仅在处理订单、提供服务、履行法律或会计义务以及解决争议所需的期间内保存个人信息。",
          "我们会采取适当的技术和组织措施保护个人信息，但任何系统都无法保证绝对安全。",
        ],
      },
      {
        title: "您的权利与联系方式",
        body: [
          "根据您所在地区，您可能有权访问、更正、删除个人数据，或撤回同意。",
          contact.zh,
        ],
      },
    ],
  },
  terms: {
    eyebrow: "条款",
    title: "服务条款",
    updated: "最后更新：2026 年 5 月",
    intro: `访问或购买 ${brandName} 的商品，即表示您同意本服务条款。`,
    sections: [
      {
        title: "概述",
        body: [
          `本网站由 ${brandName} 运营。本条款适用于访客、客户和账户持有人。`,
        ],
      },
      {
        title: "产品与作品",
        body: [
          "本网站出售的作品为艺术家创作的原创或限量作品，并受库存情况限制。",
          "由于屏幕设置不同，颜色可能略有差异。每件作品都是独特的，可能存在自然变化。",
        ],
      },
      {
        title: "订单与付款",
        body: [
          "付款通过 Stripe Checkout 接受。",
          "订单仅在付款成功确认后成立。",
          "如出现欺诈、错误或库存问题，我们保留拒绝或取消订单的权利。",
        ],
      },
      {
        title: "账户",
        body: [
          "创建账户时，您同意提供准确信息、妥善保管登录凭据，并对账户下的活动负责。",
          "如发现滥用行为，我们保留暂停账户的权利。",
        ],
      },
      {
        title: "配送",
        body: [
          "订单会寄送至结账时提供的地址。配送时间因地区而异。",
          "客户负责提供正确的配送信息。因地址错误导致的承运商延误或包裹遗失，我们不承担责任。",
        ],
      },
      {
        title: "退货与退款",
        body: [
          "由于原创作品的性质，除作品到达时损坏或我们酌情批准退款请求外，所有销售均为最终销售。",
          "如果作品到达时损坏，请在 48 小时内联系我们，并提供作品和包装照片。",
          "通过账户页面提交的退款请求将由人工审核，提交请求并不代表自动批准。",
        ],
      },
      {
        title: "知识产权",
        body: [
          "所有作品、图片和网站内容仍归艺术家或权利持有人所有。",
          "购买作品并不授予复制、商业使用、分发、铸造 NFT、修改或创作衍生作品的权利，除非另有书面协议。",
        ],
      },
      {
        title: "适用法律与联系方式",
        body: [
          "本条款受加拿大法律及魁北克适用法律管辖。",
          "我们可能随时更新本条款。更新内容发布后即生效。",
          contact.zh,
        ],
      },
    ],
  },
  policies: {
    eyebrow: "订单",
    title: "退款、配送与委托创作条款",
    updated: "最后更新：2026 年 5 月",
    intro: "本条款说明退款、配送和定制作品委托的处理方式。",
    sections: [
      {
        title: "退款政策",
        body: [
          "每件作品都经过细致创作和谨慎处理。",
          "由于原创作品的性质，所有销售均为最终销售。除商品到达时损坏或退款请求由我们酌情批准外，不接受退货或换货。",
          "如果作品到达时损坏，请在送达后 48 小时内联系我们，并提供作品和包装照片。",
          "审核后，我们可能在可行时提供替换、部分退款或全额退款。",
          "原创作品、限量作品和定制或委托创作作品不可退回，除非另有书面协议。",
          "屏幕造成的轻微色差不视为缺陷。买家负责提供正确的配送地址。",
        ],
      },
      {
        title: "配送政策",
        body: [
          "订单从加拿大寄出。",
          "订单通常在付款确认后的 3 至 7 个工作日内处理。",
          "预计配送时间为加拿大境内 2 至 7 天、美国 5 至 10 天、国际 7 至 21 天。这些时间仅为估计，并不保证。",
          "配送费用尚未最终确定，必须在正式上线付款前确认。",
          "订单发货后会提供物流追踪信息。",
          "国际客户需自行承担进口税和关税。",
          "订单发货后，对于承运商延误、海关延误或包裹遗失，我们不承担责任。",
        ],
      },
      {
        title: "委托创作条款",
        body: [
          "可根据请求提供定制作品委托。",
          "通常流程包括咨询、概念讨论、价格确认、付款、创作和交付。",
          "开始创作前可能需要支付全款或定金。",
          "草图阶段可能提供有限修改。完成后的重大修改可能产生额外费用。",
          "创作周期取决于项目复杂度，并会在开始前预估。",
          "委托创作作品不可退款、不可退回，除非另有书面协议。",
          "艺术家在尊重约定方向的同时保留创作控制权。",
          "除非另有书面约定，艺术家保留委托作品的版权。",
        ],
      },
    ],
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
