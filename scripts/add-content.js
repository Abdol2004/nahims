if (!globalThis.crypto) globalThis.crypto = require('crypto').webcrypto;
require('dotenv').config();
const mongoose = require('mongoose');
const { News, Material } = require('../models');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // ── Academic Materials ─────────────────────────────────────
  const materials = [
    {
      title: 'Introduction to Health Information Management',
      description: 'WHO overview of health information systems — roles, functions, and global standards for HIM students.',
      category: '100 Level – Foundation',
      icon: 'book-open',
      file: 'https://iris.who.int/bitstream/handle/10665/43747/9789241594882_eng.pdf'
    },
    {
      title: 'ICD-10 Instruction Manual (Volume 2)',
      description: 'Official WHO ICD-10 instruction manual — essential guide to disease classification, coding rules, and mortality coding.',
      category: '300 Level – Clinical Coding',
      icon: 'file-text',
      file: 'https://apps.who.int/iris/bitstream/handle/10665/246208/9789241549165-V2-eng.pdf'
    },
    {
      title: 'World Health Statistics 2024',
      description: 'Annual WHO compilation of health statistics — health indicators, SDG monitoring data, and global health trends.',
      category: '200 Level – Health Statistics',
      icon: 'bar-chart-2',
      file: 'https://iris.who.int/bitstream/handle/10665/376618/9789240094703-eng.pdf'
    },
    {
      title: 'Health Management Information Systems (HMIS) Framework',
      description: "Comprehensive guide to HMIS design, data quality, and implementation — core subject for Nigeria's health records system.",
      category: '300 Level – HMIS',
      icon: 'database',
      file: 'https://iris.who.int/bitstream/handle/10665/44214/9789241564120_eng.pdf'
    },
    {
      title: 'Health Informatics: Digital Tools in Healthcare',
      description: 'Introduction to eHealth, electronic health records (EHR), DHIS2, and digital health transformation in Africa.',
      category: '400 Level – Health Informatics',
      icon: 'cpu',
      file: 'https://iris.who.int/bitstream/handle/10665/352396/9789240037908-eng.pdf'
    },
    {
      title: 'Medical Terminology Simplified',
      description: 'A student-friendly guide to medical prefixes, suffixes, root words, and body systems terminology for HIM exams.',
      category: '100 Level – Foundation',
      icon: 'book',
      file: ''
    },
    {
      title: 'Nigeria Health Sector Reform Programme Guide',
      description: 'Federal Ministry of Health Nigeria roadmap for health system strengthening — context for HIM practice in Nigeria.',
      category: 'Nigeria Health Policy',
      icon: 'flag',
      file: ''
    },
    {
      title: 'Disease Coding & Classification (ICD-11 Overview)',
      description: 'WHO ICD-11 introduction — the new international standard for disease classification replacing ICD-10 globally.',
      category: '400 Level – Advanced Coding',
      icon: 'layers',
      file: 'https://icd.who.int/docs/ICD-11%20Reference%20Guide.pdf'
    },
    {
      title: 'Hospital Records Management Manual',
      description: 'Practical manual on hospital record-keeping, filing systems, retention schedules, and confidentiality for HIM students.',
      category: '200 Level – Records Management',
      icon: 'archive',
      file: ''
    },
    {
      title: 'Health Data Quality: A 10-Step Guide',
      description: 'WHO/MEASURE Evaluation guide to assessing and improving health data quality — applicable to DHIS2 and facility records.',
      category: '300 Level – Data Quality',
      icon: 'check-circle',
      file: 'https://www.measureevaluation.org/resources/publications/tr-18-201/at_download/document'
    }
  ];

  let added = 0;
  for (const m of materials) {
    const exists = await Material.findOne({ title: m.title });
    if (!exists) {
      await Material.create(m);
      added++;
      console.log('Material added:', m.title);
    } else {
      console.log('Material already exists:', m.title);
    }
  }
  console.log(`\nMaterials: ${added} added.`);

  // ── Health Awareness News ──────────────────────────────────
  const news = [
    {
      title: 'World Health Day 2026: Stand with Science',
      slug: 'world-health-day-2026',
      category: 'Health Awareness',
      date: '2026-04-07',
      author: 'NAHIMS SW Editorial',
      excerpt: 'On April 7, 2026, WHO marked World Health Day under the theme "Stand with Science" — a call to defend evidence-based public health and counter misinformation affecting communities worldwide.',
      content: 'World Health Day 2026 was observed on April 7 under the global theme "Stand with Science." The World Health Organization launched this year\'s campaign to champion the role of scientific research in health policy, vaccine development, and disease management. In Nigeria, the Federal Ministry of Health organized awareness campaigns in all geopolitical zones, emphasizing evidence-based healthcare and the importance of health data in decision-making. NAHIMS SW urges all HIM students to actively promote health literacy and accurate health information in their communities.',
      published: true
    },
    {
      title: 'World Malaria Day 2026: Accelerating the Fight Against Malaria',
      slug: 'world-malaria-day-2026',
      category: 'Health Awareness',
      date: '2026-04-25',
      author: 'NAHIMS SW Editorial',
      excerpt: 'Marked annually on April 25, World Malaria Day 2026 focused on accelerating the fight against malaria in Africa. Nigeria accounts for nearly 27% of global malaria cases, making it a priority health challenge for HIM students to document and combat.',
      content: 'World Malaria Day, observed every April 25, highlighted the urgent need to maintain progress against malaria in sub-Saharan Africa. WHO reported that Nigeria continues to bear the highest malaria burden globally, accounting for approximately 27% of worldwide cases. The 2026 campaign urged governments to sustain funding for insecticide-treated nets (ITNs), indoor residual spraying, and rapid diagnostic testing. For NAHIMS SW members, malaria data quality — accurate recording, coding (ICD-10: B50-B54), and reporting — is a critical responsibility. HIM professionals ensure malaria data feeds into DHIS2 systems that guide national elimination strategies.',
      published: true
    },
    {
      title: 'World No Tobacco Day 2026: Protecting Youth from Tobacco Industry Tactics',
      slug: 'world-no-tobacco-day-2026',
      category: 'Health Awareness',
      date: '2026-05-31',
      author: 'NAHIMS SW Editorial',
      excerpt: "WHO's World No Tobacco Day on May 31, 2026 focused on protecting young people from the tobacco and nicotine industry's aggressive marketing. Tobacco kills over 8 million people annually, with Africa facing increasing industry targeting.",
      content: "World No Tobacco Day is observed every May 31. The 2026 theme — \"Protecting Youth from Tobacco Industry Interference\" — drew attention to aggressive marketing strategies targeting young Africans, including flavored e-cigarettes and social media campaigns. In Nigeria, the National Tobacco Control Act prohibits tobacco advertising but enforcement challenges remain. Health Information Management professionals play a key role by ensuring accurate coding of tobacco-related diseases (ICD-10: F17, Z87.891), which informs policy decisions. NAHIMS SW encourages all chapters to organize campus health awareness activities on tobacco prevention.",
      published: true
    },
    {
      title: 'World Hypertension Day 2026: Measure Your Blood Pressure Accurately',
      slug: 'world-hypertension-day-2026',
      category: 'Health Awareness',
      date: '2026-05-17',
      author: 'NAHIMS SW Editorial',
      excerpt: 'World Hypertension Day on May 17, 2026 highlighted the growing burden of high blood pressure in Nigeria, where nearly 1 in 3 adults is hypertensive. Accurate health records and patient monitoring are central to managing this silent killer.',
      content: 'World Hypertension Day is observed on May 17 each year. The 2026 theme — "Measure Your Blood Pressure Accurately, Control It, Live Longer" — urged health facilities to ensure proper blood pressure measurement and documentation. In Nigeria, hypertension affects an estimated 32% of adults and is a leading cause of stroke, heart failure, and kidney disease. Health Information Management professionals ensure hypertension data (ICD-10: I10-I15) is accurately recorded in patient files, enabling longitudinal care tracking and national non-communicable disease (NCD) monitoring. NAHIMS SW calls on all chapters to participate in blood pressure screening outreaches.',
      published: true
    },
    {
      title: 'World Blood Donor Day 2026: Donating Blood is an Act of Solidarity',
      slug: 'world-blood-donor-day-2026',
      category: 'Health Awareness',
      date: '2026-06-14',
      author: 'NAHIMS SW Editorial',
      excerpt: 'Marked on June 14 each year, World Blood Donor Day 2026 celebrated voluntary blood donors and highlighted the critical need for safe blood supplies. Nigeria faces a significant blood shortage, making voluntary donation campaigns essential.',
      content: 'World Blood Donor Day is commemorated on June 14 to honor the birthday of Karl Landsteiner, who discovered the ABO blood group system. The 2026 global theme was "Donating Blood is an Act of Solidarity — Join the Effort and Save Lives." Nigeria has one of the lowest blood donation rates in Africa — approximately 0.5 units per 1,000 people compared to the WHO target of 10 units. Health Information Management students are encouraged to understand blood bank data management, transfusion reaction documentation, and haemovigilance reporting, which are critical HIM competencies in hospital blood banks.',
      published: true
    },
    {
      title: 'Nigeria Expands National Health Insurance Coverage in 2026',
      slug: 'nigeria-nhia-expansion-2026',
      category: 'Nigeria Health News',
      date: '2026-03-15',
      author: 'NAHIMS SW Editorial',
      excerpt: 'The National Health Insurance Authority (NHIA) announced a major expansion of the Basic Health Care Provision Fund (BHCPF) to cover more Nigerians. This development creates significant demand for HIM professionals skilled in insurance coding and claims management.',
      content: "Nigeria's National Health Insurance Authority (NHIA) launched an expanded rollout of the Basic Health Care Provision Fund (BHCPF) in early 2026, targeting 3 million additional beneficiaries in underserved communities. Under the National Health Act, the BHCPF allocates 1% of the Consolidated Revenue Fund to primary healthcare. The expansion creates new HIM career opportunities in insurance claims processing, diagnosis-related group (DRG) coding, and health record auditing. NAHIMS SW members are encouraged to develop competencies in insurance documentation, as demand for skilled HIM professionals in the insurance sector continues to grow.",
      published: true
    },
    {
      title: 'WHO Releases Updated Global Health Statistics 2026',
      slug: 'who-global-health-statistics-2026',
      category: 'Global Health',
      date: '2026-05-20',
      author: 'NAHIMS SW Editorial',
      excerpt: 'The World Health Organization released its 2026 World Health Statistics report, tracking progress toward Sustainable Development Goal 3 (Good Health and Well-Being). The report highlights gains in maternal mortality reduction but flags concerning NCD trends in Africa.',
      content: "The WHO 2026 World Health Statistics report provides the latest data on health indicators across 194 member states. Key findings relevant to Nigeria and West Africa include: maternal mortality continues declining (though Nigeria remains above sub-Saharan average), malaria interventions have prevented an estimated 2.2 billion cases since 2000, non-communicable diseases now account for 41 million deaths annually globally, and digital health adoption is accelerating with 90% of countries now using DHIS2. For HIM students, understanding these global statistics provides essential context for understanding the value of accurate health data collection and management in achieving health development goals.",
      published: true
    },
    {
      title: 'Digital Health Transformation: DHIS2 Rollout Across Nigeria Health Facilities',
      slug: 'dhis2-nigeria-rollout-2026',
      category: 'Health Informatics',
      date: '2026-02-10',
      author: 'NAHIMS SW Editorial',
      excerpt: "Nigeria's Federal Ministry of Health has scaled up DHIS2 adoption across secondary and tertiary health facilities. HIM professionals are at the center of this digital transformation, managing data entry, validation, and reporting.",
      content: "Nigeria's national eHealth Strategy 2021-2030 has accelerated the rollout of DHIS2 (District Health Information Software 2) to health facilities nationwide. As of 2026, over 12,000 health facilities are reporting on DHIS2, a significant increase from 4,000 in 2020. Health Information Management professionals play a central role in this transition — managing facility-level data entry, ensuring data completeness, validating reports, and generating analytical outputs for health planners. NAHIMS SW encourages all students to seek DHIS2 training opportunities, as proficiency in this system is increasingly listed as a requirement in HIM job postings across Nigeria.",
      published: true
    }
  ];

  let newsAdded = 0;
  for (const article of news) {
    const exists = await News.findOne({ slug: article.slug });
    if (!exists) {
      await News.create(article);
      newsAdded++;
      console.log('News added:', article.title);
    } else {
      console.log('News already exists:', article.slug);
    }
  }
  console.log(`\nNews: ${newsAdded} added.`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch(err => { console.error(err); process.exit(1); });
