document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const mainContent = document.getElementById("main-content");

  [
    "#top",
    ".iris-entry",
    "#start-here",
    "#pathway",
    "#ebook",
    "#knowledge",
    "#register",
    "#register-details",
    "#decision-details",
    "#tools-store",
    "#systems",
    "#about",
    ".responsibility",
    "#faq",
    "#channels",
    ".cta"
  ].forEach((selector) => {
    const section = mainContent.querySelector(selector);
    if (section) mainContent.appendChild(section);
  });

  const brokerCard = document.querySelector(".decision-card--broker");
  const registerContainer = document.querySelector("#register > .container");
  const compactRegistrationGrid = registerContainer?.querySelector(".registration-grid--compact");

  if (brokerCard && registerContainer) {
    brokerCard.classList.add("decision-card--broker-restored");
    registerContainer.insertBefore(brokerCard, compactRegistrationGrid || null);
  }

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (window.location.hash) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const initialTarget = document.querySelector(window.location.hash);
        if (!initialTarget) return;

        const headerOffset = header.getBoundingClientRect().bottom + 22;
        const targetTop = window.scrollY + initialTarget.getBoundingClientRect().top - headerOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
      });
    });
  }

  const modalShell = document.getElementById("modal-shell");
  const modalBody = document.getElementById("modal-body");
  const modalClose = modalShell.querySelector(".modal__close");
  const imageLightbox = document.getElementById("image-lightbox");
  const imageLightboxImage = document.getElementById("image-lightbox-image");
  const imageLightboxTitle = document.getElementById("image-lightbox-title");
  const imageLightboxCount = document.getElementById("image-lightbox-count");
  const imageLightboxOriginal = document.getElementById("image-lightbox-original");
  const imageLightboxClose = imageLightbox.querySelector(".image-lightbox__close");
  const imageLightboxPrev = imageLightbox.querySelector("[data-image-lightbox-prev]");
  const imageLightboxNext = imageLightbox.querySelector("[data-image-lightbox-next]");
  let lastFocusedElement = null;
  let lightboxLastFocusedElement = null;
  let activeGalleryImages = [];
  let activeGalleryTitle = "";
  let activeImageIndex = 0;

  const icon = (name) => `<svg class="icon"><use href="#icon-${name}"></use></svg>`;

  const learningRoutes = {
    beginner: {
      title: "เริ่มจากการเข้าใจภาพรวมก่อนเลือกขั้นตอนถัดไป",
      description: "คุณยังไม่ต้องรีบเลือกบริการหรือเครื่องมือ เริ่มจากคำศัพท์ พื้นฐานตลาด และการมองความเสี่ยงให้เป็นก่อน",
      steps: [
        ["Broker คืออะไร", "รู้จักหน้าที่และเช็กลิสต์พื้นฐาน"],
        ["พื้นฐาน Risk Management", "รู้ก่อนว่าตัวเองรับความเสี่ยงได้แค่ไหน"],
        ["เริ่ม Trade Journal", "บันทึกเพื่อเห็นพฤติกรรมของตัวเอง"]
      ]
    },
    ready: {
      title: "เตรียมเครื่องมือให้พร้อม โดยไม่ข้ามเรื่องความเสี่ยง",
      description: "เมื่อเริ่มเข้าใจภาพรวมแล้ว ให้จัด setup ทีละชิ้น ตรวจความพร้อมทางการเงิน และกำหนดขอบเขตของตัวเองก่อนใช้งานจริง",
      steps: [
        ["ติดตั้ง MT5 ให้เรียบร้อย", "เช็กบัญชี ระบบ และจุดที่ควรถามก่อนกดต่อ"],
        ["ทำ Money Check ก่อน Deposit", "ใช้เฉพาะเงินที่ไม่กระทบชีวิตประจำวัน"],
        ["รู้จักหน้าที่ของ GSS / TTS", "ให้เครื่องมือช่วยมองข้อมูล ไม่ใช่คิดแทนเรา"]
      ]
    },
    growth: {
      title: "พัฒนาจากการเทรดเป็นครั้ง ๆ ไปสู่การฝึกแบบมีระบบ",
      description: "ถ้าคุณพร้อมจริงจังขึ้น ให้เอา journal, review, feedback และการเรียนรู้เป็นลำดับมาเชื่อมกัน เพื่อเห็น blind spot เร็วขึ้น",
      steps: [
        ["กำหนดแผนก่อนเข้าเทรด", "แยกเหตุผล แผนความเสี่ยง และจุดยอมรับว่าแผนผิด"],
        ["Review จาก Trade Journal", "หาพฤติกรรมที่เกิดซ้ำ ไม่ใช่ดูแค่ผลลัพธ์"],
        ["เลือกการดูแลที่ตรงจุด", "เรียน ใช้เครื่องมือ และขอ feedback เมื่อจำเป็น"]
      ]
    }
  };

  const systems = {
    class: {
      kicker: "01 / STRUCTURED LEARNING",
      title: "คลาสเรียนที่ช่วยให้คุณเห็นภาพทั้งระบบ",
      description: "เรียนตั้งแต่พื้นฐาน การอ่านกราฟ การวางแผน ความเสี่ยง และจิตวิทยาการเทรด เป้าหมายไม่ใช่ทำให้คุณจำสูตร แต่ทำให้คุณรู้ว่ากำลังตัดสินใจอะไรอยู่",
      points: [
        "เรียนรู้เป็นลำดับ ไม่กระโดดข้ามพื้นฐาน",
        "เข้าใจ Risk Management ควบคู่กับการอ่านกราฟ",
        "เน้นการคิดและนำไปฝึกต่อได้จริง"
      ]
    },
    tools: {
      kicker: "02 / ANALYSIS TOOLS",
      title: "เลือกเครื่องมือให้ตรงสไตล์เทรด",
      description: "ดูแพ็กหลัก ราคา และหน้าซื้อที่เชื่อมกับการดูแลจากไอริสได้จากจุดเดียว",
      points: [
        "เริ่มจากดูว่าคุณต้องการเครื่องมือช่วยอ่านข้อมูลด้านไหน",
        "ซื้อและติดตั้งผ่านช่องทางที่เชื่อมการดูแลกับไอริส",
        "ใช้คู่กับแผนเทรดและ Risk Management ไม่ใช่ใช้แทนการตัดสินใจ"
      ]
    },
    community: {
      kicker: "03 / LONG-TERM CARE",
      title: "คอมมูนิตี้ที่ช่วยให้คุณไม่ต้องแก้ทุกอย่างคนเดียว",
      description: "พื้นที่เรียนรู้ต่อเนื่องสำหรับคนที่อยากพัฒนาการเทรดอย่างจริงจัง มีคำถาม มี blind spot และอยากได้มุมมองที่ตรงเพื่อกลับไปฝึกต่อ",
      points: [
        "ถามและทบทวนปัญหาที่เจอระหว่างฝึก",
        "เรียนรู้จากกระบวนการ ไม่ใช่ไล่ตามจุดเข้า",
        "มีพื้นที่เติบโตต่อหลังตัดสินใจเริ่ม"
      ]
    },
    partner: {
      kicker: "04 / BROKER PLAN",
      title: "ศึกษาข้อมูล Broker และเลือกบัญชีให้เหมาะกับแผนของคุณ",
      description: "เริ่มจากเข้าใจว่า broker ทำหน้าที่อะไร บัญชีแต่ละแบบต่างกันอย่างไร และต้องวางแผนเงินกับความเสี่ยงของตัวเองแบบไหน",
      points: [
        "เข้าใจบทบาทของ broker ก่อนเปิดบัญชี",
        "วางแผน Deposit และ Withdrawal ให้เข้าใจก่อนเริ่ม",
        "เลือกบัญชีที่ดูแลง่าย เช่น Standard Account หากต้องการให้ไอริสช่วยจัดขั้นตอนต่อ"
      ]
    }
  };

  const serviceRoutes = {
    broker: {
      kicker: "BROKER SETUP / CONNEXTFX",
      title: "ศึกษาขั้นตอน ConnextFX และเลือกบัญชีให้เหมาะ",
      lead: "ConnextFX มีบัญชี Micro, Ultra, Ultra Gold, No Swap และ Standard พร้อม MT5 หากต้องการเริ่มแบบอ่านง่าย ให้ดู Standard Account เป็นฐานก่อน แล้วค่อยเทียบกับบัญชีเฉพาะทางตามสไตล์เทรดของคุณ",
      points: [
        "อ่านขั้นตอนสมัครและตรวจข้อมูลที่ต้องใช้ให้ครบก่อน",
        "ข้อมูลจาก Connext ระบุว่า Connext LTD เป็น Securities Dealer ใน Seychelles เลขทะเบียน 8434071-1 และใบอนุญาต FSA SD155",
        "Leverage ไม่ใช่ตัวเลขเดียว ข้อมูลบัญชีระบุสูงสุด 1:500-1:2000 ตามประเภทบัญชีและเงื่อนไข",
        "ในเว็บนี้สรุป Spread เป็นจุด เช่น Standard 12 จุด, Ultra 6 จุด, Ultra Gold 16 จุด, No Swap 15 จุด และ Micro 14 จุด",
        "ข้อแตกต่างที่ควรเข้าใจคือบัญชีหลายแบบ MT5, Demo, EA, Hedging, NBP และค่าใช้จ่าย เพื่อเลือกให้เหมาะกับแผนของตัวเอง",
        "สรุปกรอบกำกับดูแลไว้ให้เห็นที่มาอย่างชัดเจน เพื่อให้เริ่มจากความเข้าใจ ไม่ใช่เดาจากคำโฆษณา",
        "ถ้าต้องการให้ไอริสช่วยดูเส้นทางก่อนเริ่ม ให้คุยทาง LINE ได้เลย"
      ],
      note: "ข้อมูลนี้เป็นสรุปเพื่อให้คุณเข้าใจภาพรวมก่อนเริ่มใช้งาน ไอริสจะช่วยพาดูขั้นตอนต่อ โดยการเทรด CFDs และ Forex ยังมีความเสี่ยงสูงจาก Leverage",
      actions: [
        ["อ่านขั้นตอนสมัคร Broker", "https://drive.google.com/drive/folders/1cVbSq6dGnOUO7dOrTLVisBLgBnaVsMnH"],
        ["เปิดหน้าสมัคร ConnextFX", "https://clients.svg.connextfx.com/th/links/go/2117"],
        ["กรอกแบบฟอร์มลงทะเบียน", "https://forms.gle/ed2uJS32YavvkF8J8"],
        ["ดูรายละเอียดประเภทบัญชี", "https://global.connextfx.com/trading/trading-account"],
        ["ดูข้อมูล Leverage", "https://global.connextfx.com/trading-conditions/leverage"],
        ["ดูข้อมูล Regulation", "https://global.connextfx.com/about/regulation"],
        ["เริ่มแชทกับไอริส", "https://lin.ee/J6u5PlE"]
      ]
    }
  };

  const resources = {
    broker: {
      kicker: "START HERE / BROKER",
      title: "ConnextFX มีหลายบัญชี เลือกจากแผนและความพร้อมของคุณ",
      lead: "Broker คือผู้ให้บริการที่เชื่อมการส่งคำสั่งและการใช้งานบัญชีเทรด สำหรับ ConnextFX มีบัญชี 5 แบบและ MT5 หากต้องการเริ่มแบบอ่านง่าย ให้ดู Standard Account เป็นฐานก่อน แล้วค่อยเทียบกับบัญชีเฉพาะทางตามสไตล์เทรดของคุณ",
      points: [
        "บัญชีที่แสดงคือ Micro, Ultra, Ultra Gold, No Swap และ Standard โดย Minimum First Deposit ล่าสุดระบุ $0",
        "Standard Account ระบุ Spread เริ่ม 12 จุด และ Leverage สูงสุด 1:2000",
        "ข้อมูลจาก Connext ระบุว่า Connext LTD ได้รับอนุญาตจาก FSA Seychelles เลขใบอนุญาต SD155 และมีรายชื่อใน regulated entities ของ FSA Seychelles",
        "จุดที่ต่างจากหลาย broker คือมีบัญชีหลายแบบให้เทียบตามแผน ทั้ง Standard, Ultra, Micro, Ultra Gold และ No Swap พร้อม MT5",
        "กรอบวางแผนเงินที่ใช้ในเว็บไซต์นี้คือ 1,000 / 5,000 / 10,000 / 100,000 USD เพื่อช่วยคิดเรื่องระบบและความเสี่ยง ไม่ใช่คำแนะนำเฉพาะบุคคล",
        "Leverage อาจปรับตาม Equity สินทรัพย์ ช่วงข่าว และสภาพตลาด ไอริสจะพาดูรายละเอียดอีกครั้งในขั้นตอนสมัคร",
        "สรุปกรอบกำกับดูแลไว้ให้เห็นที่มาอย่างชัดเจน เพื่อให้เริ่มจากความเข้าใจ ไม่ใช่เดาจากคำโฆษณา",
        "ทำความเข้าใจนิติบุคคล ฝาก ถอน Spread แบบจุด และค่าใช้จ่ายบัญชีก่อนสมัคร เพื่อวางแผนเงินให้เหมาะกับตัวเอง",
        "อย่าแชร์รหัสผ่าน OTP หรือข้อมูลลับให้บุคคลอื่น",
        "Broker เป็นผู้ให้บริการ ส่วนไอริสช่วยจัดเส้นทางให้คุณเข้าใจและตัดสินใจได้เป็นระบบมากขึ้น"
      ],
      note: "ข้อมูลนี้เป็นสรุปเพื่อการทำความเข้าใจและวางแผน ตัวเลขทุนเป็นกรอบคิด ไม่ใช่คำแนะนำการลงทุนเฉพาะบุคคล"
    },
    classInfo: {
      kicker: "PRIVATE CLASS / ONE OFFER",
      title: "Private Class ครบจบในเส้นทางเดียว 24,900 บาท",
      lead: "คลาสนี้ถูกวางเป็นเส้นทางหลักสำหรับคนที่อยากเรียนให้ครบ ตั้งแต่ Basic ถึง Advanced ก่อนนำเงินไปใช้ในตลาดจริง เรียนตลอดชีพ พร้อมเข้า Discord และมีไอริสช่วยดูขั้นตอนต่อ",
      points: [
        "เป็นคลาสหลักที่ออกแบบให้เรียนครบในเส้นทางเดียว ตั้งแต่พื้นฐาน การอ่านกราฟ ความเสี่ยง จิตวิทยา ไปจนถึงการต่อยอด",
        "เหมาะกับคนที่อยากเริ่มจากความรู้ก่อน แล้วค่อยวางแผนเรื่อง Broker, เครื่องมือ และการเทรดจริง",
        "จ่ายครั้งเดียวและกลับมาทบทวนได้ในระยะยาว พร้อมเข้า Discord เพื่อให้การเรียนไม่จบแค่วันสมัคร",
        "มีอาจารย์และไอริสเป็นคนช่วยดูเส้นทางการเรียนรู้ ไม่ต้องเริ่มแบบเดาคนเดียว",
        "ถ้ายังไม่พร้อมจ่ายก้อนเดียว ค่อย ๆ วางแผนเก็บก่อน เพราะการเรียนรู้ควรมาก่อนการรีบเทรด",
        "คลาสนี้เน้นความรู้และการฝึก ไม่ใช่การรับประกันผลลัพธ์จากตลาด"
      ],
      note: "ข้อมูลคลาสยืนยันจากไอริสเมื่อ 03 JUN 2026 หากต้องการดูรายละเอียดผู้สอนหรือเส้นทางเรียน สามารถเริ่มแชทกับไอริสก่อนสมัครได้โดยตรง"
    },
    mt5: {
      kicker: "SETUP GUIDE / MT5",
      title: "ติดตั้ง MT5 แบบมีสติ ทีละขั้น",
      lead: "อย่ารีบกดทุกอย่างตามภาพที่เห็นจากคนอื่น ให้เริ่มจากขั้นตอนที่ไอริสจัดไว้ และทำความเข้าใจว่ากำลังเชื่อมบัญชีอะไรอยู่",
      points: [
        "ใช้ช่องทางดาวน์โหลดที่ไอริสพาเช็กให้ในขั้นตอน",
        "ดูให้ตรงว่าใช้งานบัญชี Demo หรือบัญชีจริง",
        "เก็บข้อมูลเข้าสู่ระบบไว้ในที่ปลอดภัย และไม่ส่งต่อให้ผู้อื่น",
        "หากหน้าจอหรือชื่อ Server ไม่ตรง ให้ส่งภาพให้ไอริสช่วยดูจุดต่อไป"
      ],
      note: "ถ้าหน้าระบบเปลี่ยนจากภาพคู่มือ ให้ส่งภาพหน้าจอให้ไอริสช่วยดูจุดต่อไป"
    },
    deposit: {
      kicker: "MONEY CHECK / DEPOSIT",
      title: "ข้อมูล Deposit ที่ควรอ่านให้ครบก่อนตัดสินใจ",
      lead: "เริ่มจากทำความเข้าใจ Deposit, Withdrawal และกรอบบัญชีให้ชัด เพื่อให้ไอริสช่วยดูแผนเงินและขั้นตอนต่อได้ตรงขึ้น",
      points: [
        "แยกค่าใช้จ่ายจำเป็น เงินฉุกเฉิน และภาระที่ต้องชำระออกจากการวางแผนของตัวเอง",
        "กำหนดขอบเขตการเรียนรู้และความเสี่ยงของตัวเองก่อนเริ่ม",
        "อ่านขั้นตอนฝาก ถอน และข้อมูลบัญชีให้ครบก่อนยืนยัน",
        "ถ้ายังไม่ชัด ให้ส่งคำถามให้ไอริสช่วยเรียงลำดับก่อน ไม่ต้องรีบข้ามขั้น"
      ],
      note: "ไอริสใช้ตัวเลข Deposit เป็นกรอบวางแผน ไม่ใช่คำแนะนำเฉพาะบุคคล เพราะแต่ละคนมีเงินทุน ภาระ และความเสี่ยงที่รับได้ต่างกัน"
    },
    risk: {
      kicker: "RISK FIRST / FOUNDATION",
      title: "ก่อนคิดว่าจะได้เท่าไหร่ ให้รู้ก่อนว่าเสียได้แค่ไหน",
      lead: "Risk Management ไม่ใช่ส่วนเสริม แต่เป็นแกนของการอยู่รอดในตลาด เริ่มจากกำหนดขอบเขตที่ชัด และยอมรับว่าแผนที่ดีต้องมีจุดที่บอกว่าเราคิดผิดได้",
      points: [
        "กำหนดความเสี่ยงต่อครั้งก่อนเปิดออเดอร์",
        "ใช้ Stop Loss ตามแผน ไม่ขยับเพราะเสียดาย",
        "หลีกเลี่ยงการเพิ่มขนาดการเทรดเพราะต้องการเอาคืน",
        "Review พฤติกรรมหลังจบ เพื่อแก้ระบบ ไม่ใช่โทษตลาด"
      ],
      note: "เนื้อหานี้เป็นกรอบการศึกษาและการทบทวนทั่วไป ไม่ใช่คำแนะนำเฉพาะบุคคล"
    },
    tools: {
      kicker: "TOOLS / GSS & TTS",
      title: "เลือกเครื่องมือจากสไตล์เทรดของคุณ",
      lead: "Algo Prime คือแพลตฟอร์มซื้อเครื่องมือ ส่วน GSS / TTS คือชุดหลักที่แนะนำสำหรับเริ่มต้น",
      points: [
        "ถ้าอยากใช้จริง ให้ดูแพ็กเสียเงินที่ครบกว่าเป็นหลัก",
        "รอบ 4 เดือนขึ้นไปเหมาะกับการฝึกต่อเนื่องมากกว่าลองสั้น ๆ",
        "หลังติดตั้งให้ส่งข้อมูลให้ไอริสดูแลต่อ เพื่อจัดขั้นตอนให้ถูกทาง"
      ],
      note: "ไอริสจะพาคุณดูราคาและรอบชำระในขั้นตอนซื้อ เพื่อเลือกแพ็กให้เหมาะกับแผนการฝึก"
    },
    journal: {
      kicker: "DISCIPLINE / JOURNAL",
      title: "Journal ที่ดีไม่ต้องเยอะ แต่ต้องทำให้คุณเห็นตัวเอง",
      lead: "สิ่งที่ควรบันทึกคือข้อมูลที่ช่วยให้ตัดสินใจดีขึ้นครั้งถัดไป ไม่ใช่เขียนยาวจนไม่อยากกลับมา review",
      points: [
        "เหตุผลก่อนเข้าเทรด และบริบทที่เห็นตอนนั้น",
        "จุดเข้า จุดออก Stop Loss และขนาดความเสี่ยง",
        "อารมณ์ระหว่างตัดสินใจ เช่น กลัว พลาด รีบ หรืออยากเอาคืน",
        "หนึ่งสิ่งที่ทำได้ดี และหนึ่งสิ่งที่จะปรับครั้งถัดไป"
      ],
      note: "จุดสำคัญคือทำต่อเนื่องและกลับมา review ไม่ใช่แค่กรอกให้ครบ"
    },
    mindset: {
      kicker: "MINDSET / REALITY CHECK",
      title: "ถ้าเปลี่ยนแผนทุกครั้งที่อยากได้เร็วขึ้น คุณยังไม่ได้เทรดเป็นระบบ",
      lead: "Quick Win ทำให้รู้สึกว่าต้องรีบ แต่ยิ่งรีบ คุณยิ่งมองไม่เห็นว่ากำลังตัดสินใจจากแผนหรือจากอารมณ์ ลองหยุดและถามตัวเองให้ตรงก่อน",
      points: [
        "ตอนนี้มีแผน หรือแค่กลัวพลาดโอกาส",
        "ขนาดการเทรดมาจากระบบ หรือมาจากความอยากเอาคืน",
        "ถ้าแผนผิด คุณรู้หรือยังว่าจะหยุดตรงไหน",
        "หลังจบ คุณพร้อม review การตัดสินใจโดยไม่โทษตลาดหรือไม่"
      ],
      note: "ความคมไม่ได้มีไว้ตำหนิตัวเอง แต่มีไว้ทำให้เห็นสิ่งที่แก้ได้จริง"
    },
    learning: {
      kicker: "LEARNING PATH / SYSTEM",
      title: "คอนเทนต์สร้างความเข้าใจ แต่การฝึกสร้างทักษะ",
      lead: "เส้นทางที่ดีไม่ได้เร่งให้คุณซื้อทุกอย่างพร้อมกัน แต่ช่วยให้รู้ว่าแต่ละช่วงควรทำอะไร และเมื่อไรที่ควรขอ feedback เพิ่ม",
      points: [
        "เริ่มจากคอนเทนต์และคลังความรู้เพื่อเห็นภาพรวม",
        "เรียนรู้เป็นลำดับเมื่ออยากเข้าใจลึกขึ้น",
        "ใช้เครื่องมือเมื่อรู้หน้าที่และข้อจำกัดของมัน",
        "เข้าคอมมูนิตี้หรือขอ feedback เพื่อเห็น blind spot ของตัวเอง"
      ],
      note: "เลือกตามความพร้อม ไม่จำเป็นต้องเริ่มทุกอย่างในวันเดียว"
    }
  };

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  navToggle.addEventListener("click", () => {
    const nextState = !navMenu.classList.contains("is-open");
    navMenu.classList.toggle("is-open", nextState);
    navToggle.setAttribute("aria-expanded", String(nextState));
    body.classList.toggle("menu-open", nextState);
  });

  navMenu.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const revealElements = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px" });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const renderRoute = (stage) => {
    const route = learningRoutes[stage];
    document.getElementById("route-title").textContent = route.title;
    document.getElementById("route-description").textContent = route.description;
    document.getElementById("route-steps").innerHTML = route.steps
      .map(([title, detail], index) => `
        <li>
          <span>0${index + 1}</span>
          <strong>${title}</strong>
          <small>${detail}</small>
        </li>
      `)
      .join("");
  };

  document.querySelectorAll(".path-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".path-card").forEach((item) => {
        const isCurrent = item === card;
        item.classList.toggle("is-active", isCurrent);
        item.setAttribute("aria-selected", String(isCurrent));
      });
      renderRoute(card.dataset.stage);
    });
  });

  const renderSystem = (systemKey) => {
    const system = systems[systemKey];
    document.getElementById("system-kicker").textContent = system.kicker;
    document.getElementById("system-title").textContent = system.title;
    document.getElementById("system-description").textContent = system.description;
    document.getElementById("system-points").innerHTML = system.points
      .map((point) => `<li>${icon("check")}<span>${point}</span></li>`)
      .join("");
  };

  document.querySelectorAll(".system-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".system-tab").forEach((item) => {
        const isCurrent = item === tab;
        item.classList.toggle("is-active", isCurrent);
        item.setAttribute("aria-selected", String(isCurrent));
      });
      renderSystem(tab.dataset.system);
    });
  });

  const directorySearchIndex = [
    {
      type: "ความรู้",
      title: "Broker คืออะไร และทำหน้าที่อะไร",
      description: "ทำความเข้าใจบทบาทของ broker และข้อมูลบัญชีก่อนเลือกใช้งาน",
      search: "broker โบรกเกอร์ เปิดบัญชี ฝากเงิน deposit เริ่มต้น",
      resource: "broker",
      action: "อ่านสรุป"
    },
    {
      type: "ความรู้",
      title: "ติดตั้ง MT5 แบบไม่งง",
      description: "เช็กลิสต์ก่อนดาวน์โหลด เชื่อมบัญชี และตรวจ Server",
      search: "mt5 metatrader ติดตั้ง setup server demo account",
      resource: "mt5",
      action: "เปิดเช็กลิสต์"
    },
    {
      type: "ความรู้",
      title: "ข้อมูล Deposit ที่ควรอ่านให้ครบ",
      description: "วางแผนฝาก ถอน และกรอบบัญชีให้เข้าใจก่อนเริ่ม",
      search: "deposit dep ฝากเงิน เติมเงิน ถอนเงิน ความเสี่ยง",
      resource: "deposit",
      action: "อ่านเพื่อวางแผนให้ชัด"
    },
    {
      type: "ความรู้",
      title: "Risk Management เริ่มจากอะไร",
      description: "วางขอบเขตความเสี่ยง Stop Loss และขนาดการเทรดอย่างมีระบบ",
      search: "risk management stop loss lot size ความเสี่ยง",
      resource: "risk",
      action: "อ่านหลักคิด"
    },
    {
      type: "ความรู้",
      title: "GSS / TTS คืออะไร ใช้ตอนไหน",
      description: "ดูว่า Algo Prime คืออะไร และทำไม GSS / TTS ถึงเป็นชุดหลักที่ควรเริ่มดู",
      search: "gss tts algo prime tools เครื่องมือ วิเคราะห์",
      resource: "tools",
      action: "ดูหน้าที่ของเครื่องมือ"
    },
    {
      type: "ชุดเครื่องมือ",
      title: "ดูชุดเครื่องมือ Algo Prime ที่ไอริสจัดไว้",
      description: "ดูภาพรวมเครื่องมือ ตั้งแต่ชุด SRD ไปจนถึง GSS / TTS Full Package ที่เหมาะกับการใช้งานจริง",
      search: "algo prime catalog product tools เครื่องมือ ราคา ฟรี ซื้อ gss tts srd market structure volume",
      url: "https://algoprime.co/sign-up?ref=1db8c3e7-e0a5-46d4-b2d3-fc2e598402be",
      external: true,
      action: "เปิดเส้นทางเครื่องมือ"
    },
    {
      type: "ความรู้",
      title: "Trade Journal ที่ใช้จริงควรมีอะไร",
      description: "เริ่มบันทึกและ Review การตัดสินใจของตัวเอง",
      search: "journal trade journal review วินัย ระบบ บันทึก",
      resource: "journal",
      action: "เปิดโครงสร้าง Journal"
    },
    {
      type: "เส้นทางดูแล",
      title: "ปรึกษาไอริสทาง LINE",
      description: "เริ่มจากคุยกับไอริสโดยตรง เพื่อให้ไอริสช่วยจัดทางที่เหมาะกับเป้าหมายของคุณ",
      search: "line ไลน์ ติดต่อ ปรึกษา iris เริ่มต้น",
      url: "https://lin.ee/J6u5PlE",
      external: true,
      action: "เปิด LINE"
    },
    {
      type: "ศูนย์ลงทะเบียน",
      title: "รวมเส้นทางดูแลและแบบฟอร์มสำคัญ",
      description: "เลือกเส้นทางที่เหมาะกับคุณ ไม่ว่าจะเป็น Broker, Private Class, เครื่องมือ Algo Prime หรือการติดตามข้อมูล แล้วทำตามลำดับได้จากจุดเดียว",
      search: "register registration ลงทะเบียน สมัคร form แบบฟอร์ม ขั้นตอน broker class tools signal",
      url: "#register",
      internal: true,
      action: "เปิดศูนย์ลงทะเบียน"
    },
    {
      type: "เส้นทางดูแล",
      title: "Private Class ครบจบในเส้นทางเดียว",
      description: "ราคา 24,900 บาท เรียนตั้งแต่ Basic ถึง Advanced เรียนตลอดชีพ เข้า Discord และมีไอริสช่วยดูขั้นตอนต่อ",
      search: "private class คลาส เรียน คอร์ส สอนเทรด อาจารย์เอิร์ธ earth 24900 24,900 ตลอดชีพ discord ออนไลน์ ออฟไลน์",
      resource: "classInfo",
      action: "อ่านรายละเอียดคลาส"
    },
    {
      type: "เส้นทางดูแล",
      title: "ศึกษาขั้นตอน ConnextFX",
      description: "อ่านข้อมูลบัญชี Leverage ข้อดี ข้อควรพิจารณา และวิธีสมัคร ConnextFX",
      search: "connextfx connext broker เปิดพอร์ต สมัคร ลงทะเบียน ฝาก ถอน leverage standard ultra micro no swap ultra gold mt5 spread commission",
      service: "broker",
      action: "ดูรายละเอียด"
    },
    {
      type: "ขั้นตอน",
      title: "อ่านขั้นตอนสมัคร Broker",
      description: "เปิดคู่มือสมัคร ConnextFX ก่อนกรอกข้อมูล",
      search: "connextfx broker คู่มือ ขั้นตอน สมัคร",
      url: "https://drive.google.com/drive/folders/1cVbSq6dGnOUO7dOrTLVisBLgBnaVsMnH",
      external: true,
      action: "เปิดคู่มือ"
    },
    {
      type: "ขั้นตอน",
      title: "เปิดหน้าสมัคร ConnextFX",
      description: "ลิงก์หน้าสมัคร ConnextFX สำหรับผู้ที่อ่านข้อมูลและต้องการดูขั้นตอนต่อ",
      search: "connextfx broker link เปิดพอร์ต account",
      url: "https://clients.svg.connextfx.com/th/links/go/2117",
      external: true,
      action: "เปิดหน้าสมัคร"
    },
    {
      type: "แบบฟอร์ม",
      title: "ลงทะเบียน Broker หลังสมัคร",
      description: "ส่งข้อมูลลงทะเบียนเพื่อให้ไอริสช่วยดูแลต่อ",
      search: "connextfx broker form แบบฟอร์ม ลงทะเบียน",
      url: "https://forms.gle/ed2uJS32YavvkF8J8",
      external: true,
      action: "เปิดแบบฟอร์ม"
    },
    {
      type: "เส้นทางดูแล",
      title: "ซื้อและติดตั้งเครื่องมือใน Algo Prime",
      description: "เปิดเส้นทาง 3 ข้อ ตั้งแต่ดูคู่มือภาพ สมัครและเลือกเครื่องมือผ่านช่องทางที่เชื่อมการดูแล ไปจนถึงส่งข้อมูลหลังติดตั้ง",
      search: "algo prime gss tts tools ติดตั้ง เครื่องมือ สมัคร",
      url: "#tools-store",
      internal: true,
      action: "เปิดขั้นตอน 3 ข้อ"
    },
    {
      type: "ขั้นตอน",
      title: "เริ่มสมัครและซื้อเครื่องมือ",
      description: "เปิดเส้นทาง 3 ข้อก่อนซื้อ เพื่อไม่ให้ข้ามขั้นตอนสำคัญ",
      search: "algo prime gss tts สมัคร signup เครื่องมือ ซื้อ purchase link iris referral",
      url: "#tools-store",
      internal: true,
      action: "เปิดขั้นตอน 3 ข้อ"
    },
    {
      type: "ขั้นตอน",
      title: "อ่านคู่มือติดตั้ง GSS / TTS",
      description: "ดูภาพขั้นตอนการสมัคร ซื้อ และติดตั้งเครื่องมือใน Algo Prime ก่อนเริ่มใช้งาน",
      search: "algo prime gss tts คู่มือ ขั้นตอน ติดตั้ง",
      url: "#tools-store",
      internal: true,
      action: "เปิดขั้นตอน 3 ข้อ"
    },
    {
      type: "แบบฟอร์ม",
      title: "ลงทะเบียนเครื่องมือหลังติดตั้ง",
      description: "กรอกแบบฟอร์มเมื่อ GSS / TTS พร้อมใช้งานแล้ว",
      search: "algo prime gss tts form แบบฟอร์ม ลงทะเบียน ติดตั้ง",
      url: "https://forms.gle/fMTeSbf9XsWfS9qPA",
      external: true,
      action: "เปิดแบบฟอร์ม"
    },
    {
      type: "เส้นทางดูแล",
      title: "ข้อมูลและช่องทางติดตามทองคำ",
      description: "อ่านรายละเอียดก่อนเลือกติดตามข้อมูลต่อ และใช้วิจารณญาณของตัวเองเสมอ",
      search: "gold signal ซิกแนล ทองคำ community กลุ่ม",
      url: "https://forms.gle/iawLHDWnZjtB6EgN6",
      external: true,
      action: "ดูแบบฟอร์มติดตามข้อมูล"
    },
    {
      type: "ช่องทาง",
      title: "YouTube: Break 2 the Money",
      description: "ติดตามคอนเทนต์จากไอริสบน YouTube",
      search: "youtube break 2 the money วิดีโอ คลิป",
      url: "https://youtube.com/@irisbreak_2?si=hmRPktSXe8ROgiUe",
      external: true,
      action: "เปิด YouTube"
    },
    {
      type: "ช่องทาง",
      title: "TikTok: Break 2 The Money",
      description: "ติดตามคอนเทนต์สั้นจากไอริสบน TikTok",
      search: "tiktok break 2 the money tradinginvestigationunit คลิปสั้น",
      url: "https://www.tiktok.com/@tradinginvestigationunit",
      external: true,
      action: "เปิด TikTok"
    },
    {
      type: "ช่องทาง",
      title: "Instagram: irisbreak2",
      description: "ติดตามไอริสบน Instagram",
      search: "instagram ig irisbreak2 social ติดตาม",
      url: "https://www.instagram.com/irisbreak2?igsh=ejM2ZzlmOHd3cnA2&utm_source=qr",
      external: true,
      action: "เปิด Instagram"
    },
    {
      type: "E-book",
      title: "รับ E-book สำหรับเริ่มต้น",
      description: "ตอบคำถามสั้น ๆ แล้วทัก LINE หาไอริสพร้อมข้อความที่เตรียมไว้ เพื่อให้ไอริสดูแลต่อได้ตรงจุด",
      search: "ebook e-book อีบุ๊ก หนังสือ คู่มือ เริ่มต้น forex line oa แจกฟรี",
      url: "#ebook",
      internal: true,
      action: "เปิดขั้นตอนรับ E-book"
    },
    {
      type: "ข้อมูล",
      title: "เลือกหัวข้อคำตอบกับไอริส",
      description: "ไอริสรวบรวมหัวข้อสำคัญ ขั้นตอนสมัคร คู่มือติดตั้ง แบบฟอร์ม และช่องทางติดต่อที่จำเป็นไว้ให้เลือกจากที่เดียว",
      search: "break 2 the money ข้อมูล คำตอบ ขั้นตอน สมัคร คู่มือ แบบฟอร์ม ช่องทาง ติดต่อ",
      url: "#knowledge",
      internal: true,
      action: "เปิด Answer Desk"
    }
  ];

  const knowledgeSearch = document.getElementById("knowledge-search");
  const filterButtons = document.querySelectorAll(".filter-button");
  const knowledgeCards = document.querySelectorAll(".knowledge-card");
  const knowledgeCount = document.getElementById("knowledge-count");
  const knowledgeEmpty = document.getElementById("knowledge-empty");
  const siteSearchResults = document.getElementById("site-search-results");
  const popularSearches = document.querySelectorAll("[data-search-query]");
  const popularSearchButtons = Array.from(popularSearches);
  let activeFilter = "all";

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const matchesSearchQuery = (text, query) => {
    const normalizedText = text.toLowerCase();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return terms.every((term) => {
      if (/^[a-z0-9]+$/i.test(term)) {
        return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`, "i").test(normalizedText);
      }
      return normalizedText.includes(term);
    });
  };

  const renderDirectoryAction = (item) => {
    if (item.resource) {
      return `<button class="search-result__action" type="button" data-directory-resource="${item.resource}">${item.action}${icon("arrow-right")}</button>`;
    }
    if (item.service) {
      return `<button class="search-result__action" type="button" data-directory-service="${item.service}">${item.action}${icon("arrow-right")}</button>`;
    }
    if (item.internal) {
      return `<a class="search-result__action" href="${item.url}">${item.action}${icon("arrow-right")}</a>`;
    }
    return `<a class="search-result__action" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.action}${icon("arrow-up-right")}</a>`;
  };

  const renderDirectoryResults = (query) => {
    if (!query) {
      siteSearchResults.hidden = true;
      siteSearchResults.innerHTML = "";
      return;
    }

    const matches = directorySearchIndex
      .filter((item) => matchesSearchQuery(`${item.title} ${item.description} ${item.search}`, query))
      .slice(0, 8);

    siteSearchResults.hidden = false;

    if (!matches.length) {
      siteSearchResults.innerHTML = `
        <div class="search-results__empty">
          <p class="eyebrow">NO DIRECT MATCH</p>
          <h4>ยังไม่เจอคำตอบที่ตรงกับคำค้นนี้</h4>
          <p>ลองเลือกหัวข้อหลักด้านบน หรือให้ไอริสช่วยจัดทางที่เหมาะกับคุณทาง LINE</p>
          <a class="search-result__action" href="https://lin.ee/J6u5PlE" target="_blank" rel="noopener noreferrer">
            เริ่มแชทกับไอริส
            ${icon("arrow-up-right")}
          </a>
        </div>
      `;
      return;
    }

    siteSearchResults.innerHTML = `
      <div class="search-results__head">
        <span>พบ ${matches.length} รายการที่เกี่ยวข้อง</span>
        <small>เลือกเปิดคำตอบหรือขั้นตอนที่ตรงกับสิ่งที่คุณกำลังหา</small>
      </div>
      <div class="search-results__grid">
        ${matches.map((item) => `
          <article class="search-result">
            <span>${item.type}</span>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            ${renderDirectoryAction(item)}
          </article>
        `).join("")}
      </div>
    `;
  };

  const updateKnowledge = () => {
    const query = knowledgeSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    knowledgeCards.forEach((card) => {
      const filterMatches = activeFilter === "all" || card.dataset.category === activeFilter;
      const searchMatches = !query || matchesSearchQuery(`${card.dataset.search} ${card.textContent}`, query);
      const shouldShow = filterMatches && searchMatches;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    knowledgeCount.textContent = `${visibleCount} บทความ`;
    knowledgeEmpty.hidden = visibleCount > 0;
    renderDirectoryResults(query);
  };

  knowledgeSearch.addEventListener("input", updateKnowledge);
  knowledgeSearch.addEventListener("focus", () => {
    knowledgeSearch.blur();
  });
  knowledgeSearch.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    knowledgeSearch.blur();
  });

  const chooseKnowledgeTopic = (button) => {
    knowledgeSearch.value = button.dataset.searchQuery || "";
    popularSearchButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    updateKnowledge();
    knowledgeSearch.blur();
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-search-query]");
    if (!button || !popularSearchButtons.includes(button)) return;
    event.preventDefault();
    chooseKnowledgeTopic(button);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      updateKnowledge();
    });
  });

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const expanded = question.getAttribute("aria-expanded") === "true";
      question.setAttribute("aria-expanded", String(!expanded));
      answer.hidden = expanded;
    });
  });

  const toolShowcase = document.querySelector("[data-tool-showcase]");

  if (toolShowcase) {
    const toolOptions = Array.from(toolShowcase.querySelectorAll("[data-tool-option]"));
    const toolPreview = {
      card: toolShowcase.querySelector(".tool-choice-preview"),
      image: toolShowcase.querySelector("[data-tool-preview-image]"),
      tag: toolShowcase.querySelector("[data-tool-preview-tag]"),
      price: toolShowcase.querySelector("[data-tool-preview-price]"),
      month: toolShowcase.querySelector("[data-tool-preview-month]"),
      four: toolShowcase.querySelector("[data-tool-preview-four]"),
      year: toolShowcase.querySelector("[data-tool-preview-year]"),
      recommendation: toolShowcase.querySelector("[data-tool-preview-recommendation]"),
      title: toolShowcase.querySelector("[data-tool-preview-title]"),
      copy: toolShowcase.querySelector("[data-tool-preview-copy]"),
      level: toolShowcase.querySelector("[data-tool-preview-level]"),
      link: toolShowcase.querySelector("[data-tool-preview-link]")
    };
    let toolImageFallbackTimer;

    const applyToolImageFallback = () => {
      if (!toolPreview.image || toolPreview.image.dataset.fallbackApplied === "true") return;
      toolPreview.image.dataset.fallbackApplied = "true";
      toolPreview.image.src = "workspace.png";
      toolPreview.image.alt = "ภาพประกอบพื้นที่ทำงานและการวางแผนเทรดของ Iris";
    };

    const scheduleToolImageFallback = () => {
      if (!toolPreview.image) return;
      window.clearTimeout(toolImageFallbackTimer);
      toolImageFallbackTimer = window.setTimeout(() => {
        if (!toolPreview.image.complete || toolPreview.image.naturalWidth === 0) {
          applyToolImageFallback();
        }
      }, 1800);
    };

    const activateToolOption = (button, shouldMovePreview = false) => {
      const data = button.dataset;
      toolOptions.forEach((option) => {
        const isActive = option === button;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-selected", String(isActive));
      });

      if (toolPreview.image && data.image) {
        toolPreview.image.dataset.fallbackApplied = "false";
        toolPreview.image.src = data.image;
        toolPreview.image.alt = data.alt || data.title || "ตัวอย่างเครื่องมือใน Algo Prime";
        scheduleToolImageFallback();
      }
      if (toolPreview.tag) toolPreview.tag.textContent = data.tag || "";
      if (toolPreview.price) toolPreview.price.textContent = data.price || "";
      if (toolPreview.month) toolPreview.month.textContent = data.month || "";
      if (toolPreview.four) toolPreview.four.textContent = data.four || "";
      if (toolPreview.year) toolPreview.year.textContent = data.year || "";
      if (toolPreview.recommendation) toolPreview.recommendation.textContent = data.recommendation || "";
      if (toolPreview.title) toolPreview.title.textContent = data.title || "";
      if (toolPreview.copy) toolPreview.copy.textContent = data.copy || "";
      if (toolPreview.level) toolPreview.level.textContent = data.level || "";
      if (toolPreview.link && data.link) toolPreview.link.href = data.link;

      if (shouldMovePreview && toolPreview.card) {
        window.setTimeout(() => {
          const isCompact = window.matchMedia("(max-width: 860px)").matches;
          if (isCompact) {
            const previewTop = toolPreview.card.getBoundingClientRect().top + window.pageYOffset;
            const maxTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const top = Math.min(Math.max(previewTop - 88, 0), maxTop);
            window.scrollTo({
              top,
              behavior: reducedMotion ? "auto" : "smooth"
            });
          } else {
            toolPreview.card.scrollIntoView({
              behavior: reducedMotion ? "auto" : "smooth",
              block: "nearest"
            });
          }
        }, 40);
      }
    };

    toolOptions.forEach((button) => {
      button.addEventListener("click", () => activateToolOption(button, true));
    });

    if (toolPreview.image) {
      toolPreview.image.addEventListener("error", () => {
        applyToolImageFallback();
      });
      scheduleToolImageFallback();
    }
  }

  const openModal = (html) => {
    lastFocusedElement = document.activeElement;
    modalBody.innerHTML = html;
    modalShell.hidden = false;
    body.classList.add("modal-open");
    modalClose.focus();
  };

  const closeModal = () => {
    if (!imageLightbox.hidden) closeImageLightbox();
    modalShell.hidden = true;
    body.classList.remove("modal-open");
    modalBody.innerHTML = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const updateImageLightbox = () => {
    const src = activeGalleryImages[activeImageIndex];
    const current = String(activeImageIndex + 1).padStart(2, "0");
    const total = String(activeGalleryImages.length).padStart(2, "0");
    imageLightboxTitle.textContent = `${activeGalleryTitle} / ภาพ ${current}`;
    imageLightboxImage.src = src;
    imageLightboxImage.alt = `${activeGalleryTitle} ภาพที่ ${activeImageIndex + 1}`;
    imageLightboxCount.textContent = `ภาพ ${current} / ${total}`;
    imageLightboxOriginal.href = src;
    const hasMultipleImages = activeGalleryImages.length > 1;
    imageLightboxPrev.disabled = !hasMultipleImages;
    imageLightboxNext.disabled = !hasMultipleImages;
  };

  const openImageLightbox = ({ images, title, index }) => {
    lightboxLastFocusedElement = document.activeElement;
    activeGalleryImages = images;
    activeGalleryTitle = title;
    activeImageIndex = index;
    updateImageLightbox();
    imageLightbox.hidden = false;
    body.classList.add("image-lightbox-open");
    imageLightboxClose.focus();
  };

  const closeImageLightbox = () => {
    imageLightbox.hidden = true;
    body.classList.remove("image-lightbox-open");
    imageLightboxImage.removeAttribute("src");
    if (lightboxLastFocusedElement) lightboxLastFocusedElement.focus();
  };

  const moveImageLightbox = (direction) => {
    if (activeGalleryImages.length < 2) return;
    activeImageIndex = (activeImageIndex + direction + activeGalleryImages.length) % activeGalleryImages.length;
    updateImageLightbox();
  };

  const brokerGuideImages = Array.from(
    { length: 7 },
    (_, index) => `assets/connext-guide/connext-step-${index + 1}.webp`
  );

  const brokerFormPreviewImages = Array.from(
    { length: 4 },
    (_, index) => `assets/connext-guide/broker-form-preview-${index + 1}.webp`
  );

  const algoGuideImages = Array.from(
    { length: 4 },
    (_, index) => `assets/algo-guide/algo-step-${index + 1}.webp`
  );

  const algoPaymentGuideImages = ["assets/algo-guide/algo-payment-truemoney.webp"];

  const openImageGallery = ({ kicker, title, lead, images, note, galleryClass = "" }) => {
    openModal(`
      <p class="eyebrow">${kicker}</p>
      <h2 id="modal-title">${title}</h2>
      <p class="modal__lead">${lead}</p>
      <div class="guide-gallery ${galleryClass}">
        ${images.map((src, index) => `
          <button class="guide-gallery__item" type="button" data-guide-image-index="${index}" aria-label="ขยาย ${title} ภาพที่ ${index + 1}">
            <img src="${src}" alt="${title} ภาพที่ ${index + 1}" loading="lazy" decoding="async" />
            <em>แตะเพื่อขยาย</em>
            <span>${String(index + 1).padStart(2, "0")}</span>
          </button>
        `).join("")}
      </div>
      <p class="modal__note">${note}</p>
    `);
    modalBody.querySelectorAll("[data-guide-image-index]").forEach((button) => {
      button.addEventListener("click", () => openImageLightbox({
        images,
        title,
        index: Number(button.dataset.guideImageIndex)
      }));
    });
  };

  document.querySelectorAll("[data-open-broker-guide]").forEach((button) => {
    button.addEventListener("click", () => openImageGallery({
      kicker: "CONNEXTFX / VISUAL GUIDE",
      title: "คู่มือสมัคร ConnextFX แบบดูทีละขั้น",
      lead: "เปิดดูภาพเรียงจาก 01 ถึง 07 ก่อนสมัครจริง กดที่ภาพเพื่อขยายเต็มหน้าจอได้",
      images: brokerGuideImages,
      note: "คู่มือนี้ช่วยดูตำแหน่งที่ต้องกด หากหน้าระบบ ConnextFX เปลี่ยนไปจากภาพ ให้ส่งภาพหน้าจอให้ไอริสช่วยดูจุดต่อไป"
    }));
  });

  document.querySelectorAll("[data-open-broker-form-preview]").forEach((button) => {
    button.addEventListener("click", () => openImageGallery({
      kicker: "BACK-OFFICE FORM / PREVIEW",
      title: "ตัวอย่างข้อมูลที่ต้องกรอกหลังสมัคร Broker",
      lead: "ภาพตัวอย่างนี้ช่วยให้เตรียมข้อมูลก่อนเปิดแบบฟอร์มจริง เช่น LINE ID, Username ConnextFX และข้อมูลสำหรับให้ไอริสดูแลต่อ",
      images: brokerFormPreviewImages,
      note: "กรอกข้อมูลจริงผ่าน Google Form เท่านั้น ไม่ต้องส่งรหัสผ่าน OTP หรือข้อมูลลับให้บุคคลอื่น"
    }));
  });

  document.querySelectorAll("[data-open-algo-guide]").forEach((button) => {
    button.addEventListener("click", () => openImageGallery({
      kicker: "ALGO PRIME / VISUAL GUIDE",
      title: "คู่มือสมัคร ซื้อ และติดตั้งเครื่องมือ Algo Prime",
      lead: "เปิดดูภาพเรียงจาก 01 ถึง 04 แล้วทำตามทีละขั้น ตั้งแต่สมัครสมาชิก ซื้อเครื่องมือ ติดตั้ง ไปจนถึงเปิดใช้ใน TradingView กดที่ภาพเพื่อขยายเต็มหน้าจอได้",
      images: algoGuideImages,
      galleryClass: "guide-gallery--wide",
      note: "ไอริสจะพาดูราคาและรอบชำระในขั้นตอนซื้อ หากหน้าระบบเปลี่ยนไปจากภาพ ให้ส่งภาพหน้าจอให้ไอริสช่วยดูจุดต่อไป"
    }));
  });

  document.querySelectorAll("[data-open-algo-payment-guide]").forEach((button) => {
    button.addEventListener("click", () => openImageGallery({
      kicker: "OPTIONAL PAYMENT HELP",
      title: "ตัวเลือกเสริม: วิธีสร้างบัตร TrueMoney",
      lead: "เปิดดูเฉพาะเมื่อคุณต้องการตัวช่วยเรื่องบัตรสำหรับชำระเงิน ขั้นตอนนี้ไม่ใช่ขั้นตอนบังคับสำหรับทุกคน",
      images: algoPaymentGuideImages,
      galleryClass: "guide-gallery--wide",
      note: "เก็บเลขบัตร วันหมดอายุ CVV และ OTP เป็นความลับ ไม่ต้องส่งข้อมูลเหล่านี้ให้ไอริสหรือบุคคลอื่น"
    }));
  });

  modalShell.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  imageLightbox.querySelectorAll("[data-close-image-lightbox]").forEach((element) => {
    element.addEventListener("click", closeImageLightbox);
  });

  imageLightboxPrev.addEventListener("click", () => moveImageLightbox(-1));
  imageLightboxNext.addEventListener("click", () => moveImageLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (!imageLightbox.hidden) {
      if (event.key === "Escape") closeImageLightbox();
      if (event.key === "ArrowLeft") moveImageLightbox(-1);
      if (event.key === "ArrowRight") moveImageLightbox(1);
      return;
    }
    if (event.key === "Escape" && !modalShell.hidden) closeModal();
  });

  const openResourceModal = (resourceKey) => {
    const resource = resources[resourceKey];
    openModal(`
        <p class="eyebrow">${resource.kicker}</p>
        <h2 id="modal-title">${resource.title}</h2>
        <p class="modal__lead">${resource.lead}</p>
        <ul class="modal__list">
          ${resource.points.map((point) => `<li>${icon("check")}<span>${point}</span></li>`).join("")}
        </ul>
        <p class="modal__note">${resource.note}</p>
      `);
  };

  document.querySelectorAll("[data-resource]").forEach((button) => {
    button.addEventListener("click", () => openResourceModal(button.dataset.resource));
  });

  const openServiceModal = (serviceKey) => {
    const service = serviceRoutes[serviceKey];
    openModal(`
        <p class="eyebrow">${service.kicker}</p>
        <h2 id="modal-title">${service.title}</h2>
        <p class="modal__lead">${service.lead}</p>
        <ul class="modal__list">
          ${service.points.map((point) => `<li>${icon("check")}<span>${point}</span></li>`).join("")}
        </ul>
        <div class="modal__actions">
          ${service.actions.map(([label, url], index) => `
            <a class="button ${index === 0 ? "button--primary" : "button--ghost"}" href="${url}" target="_blank" rel="noopener noreferrer">
              ${label}
              ${icon("arrow-up-right")}
            </a>
          `).join("")}
        </div>
        <p class="modal__note">${service.note}</p>
      `);
  };

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => openServiceModal(button.dataset.service));
  });

  siteSearchResults.addEventListener("click", (event) => {
    const resourceButton = event.target.closest("[data-directory-resource]");
    const serviceButton = event.target.closest("[data-directory-service]");
    if (resourceButton) openResourceModal(resourceButton.dataset.directoryResource);
    if (serviceButton) openServiceModal(serviceButton.dataset.directoryService);
  });

  const contactMarkup = `
    <p class="eyebrow">NEXT STEP / TALK WITH IRIS</p>
    <h2 id="modal-title">เริ่มจากบอกว่าตอนนี้คุณอยู่ตรงไหน</h2>
    <p class="modal__lead">
      ถ้าคุณอยากให้ไอริสช่วยจัดทางว่าจะเริ่มจากคลาส เครื่องมือ Broker หรือการเตรียมตัวก่อน
      ทัก LINE เพื่อคุยกับไอริสได้ตรง ๆ แล้วค่อยเลือกเส้นทางที่เหมาะกับคุณ
    </p>
    <ul class="modal__list">
      <li>${icon("check")}<span>บอกได้ว่าตอนนี้เพิ่งเริ่ม กำลังเตรียมพร้อม หรืออยากพัฒนาระบบ</span></li>
      <li>${icon("check")}<span>คุยเรื่องคลาส เครื่องมือ หรือเส้นทางที่ควรเริ่มได้แบบตรงจุด</span></li>
      <li>${icon("check")}<span>ไอริสจะช่วยเรียงลำดับข้อมูลให้เหมาะกับเป้าหมายและความพร้อมของคุณ</span></li>
    </ul>
    <div class="modal__actions">
      <a class="button button--primary" href="https://lin.ee/J6u5PlE" target="_blank" rel="noopener noreferrer">
        เปิด LINE คุยกับไอริส
        ${icon("arrow-up-right")}
      </a>
      <a class="button button--ghost" href="#channels" data-modal-close-on-click>
        ดูเส้นทางทั้งหมด
        ${icon("arrow-right")}
      </a>
    </div>
    <p class="modal__note">LINE คือช่องทางที่ไอริสใช้ดูแลคำถามและช่วยจัดลำดับขั้นตอนให้คุณไปต่อได้ง่ายขึ้น</p>
  `;

  document.querySelectorAll("[data-open-contact]").forEach((button) => {
    button.addEventListener("click", () => openModal(contactMarkup));
  });

  modalShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close-on-click]")) closeModal();
  });

  const ebookForm = document.getElementById("ebook-form");
  const ebookResult = document.getElementById("ebook-result");
  const ebookSummary = document.getElementById("ebook-line-message");
  const ebookCopyButton = document.querySelector("[data-copy-ebook-summary]");
  const ebookLineLink = document.getElementById("ebook-line-link");
  const irisLineMessageBase = "https://line.me/R/oaMessage/%40326crutz/?";

  if (ebookForm && ebookResult && ebookSummary) {
    ebookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(ebookForm);
      const lineMessage = [
        "EBOOK",
        "ขอรับ E-book สำหรับผู้เริ่มต้น",
        "",
        `สถานะตอนนี้: ${formData.get("ebook-stage")}`,
        `เรื่องที่อยากเริ่มเข้าใจก่อน: ${formData.get("ebook-focus")}`,
        `สิ่งที่อยากให้ไอริสรู้: ${formData.get("ebook-reason")}`,
        `อยากไปต่อแบบไหน: ${formData.get("ebook-next-step")}`,
        "",
        "รบกวนไอริสส่ง E-book และแนะนำลำดับที่เหมาะกับหนู/ผมต่อได้เลยค่ะ/ครับ"
      ].join("\n");
      ebookSummary.textContent = lineMessage;
      if (ebookLineLink) {
        ebookLineLink.href = `${irisLineMessageBase}${encodeURIComponent(lineMessage)}`;
      }
      ebookResult.hidden = false;
      ebookResult.focus({ preventScroll: true });
      ebookResult.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
  }

  if (ebookCopyButton) {
    ebookCopyButton.addEventListener("click", async () => {
      const originalLabel = ebookCopyButton.textContent;
      try {
        await navigator.clipboard.writeText(ebookSummary.textContent);
        ebookCopyButton.textContent = "คัดลอกแล้ว";
      } catch {
        const fallback = document.createElement("textarea");
        fallback.value = ebookSummary.textContent;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        fallback.remove();
        ebookCopyButton.textContent = "คัดลอกแล้ว";
      }

      window.setTimeout(() => {
        ebookCopyButton.textContent = originalLabel;
      }, 1800);
    });
  }

  if (ebookLineLink && ebookSummary) {
    ebookLineLink.addEventListener("click", () => {
      if (!ebookSummary.textContent.trim()) return;
      navigator.clipboard?.writeText(ebookSummary.textContent).catch(() => {});
    });
  }

  const observedSections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-menu > a[href^='#']");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-38% 0px -52%" });

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
});
