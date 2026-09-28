import type { BranchOption } from './branchPicker';

const CAMP_ONE_NAME = "Dr. Agarwal\u2019s Eye Check-up camp";

/** Pinned entries required by seed data and Playwright tests */
const PINNED_BRANCHES: BranchOption[] = [
  {
    id: 'BR-CHE-001',
    city: 'Nanganallur, Chennai',
    address: '24 & 26, Swathi, 29th St, NCBS Colony, Nanganallur, Chennai, TN 600061',
    campId: '1',
    campName: CAMP_ONE_NAME,
  },
  {
    id: 'BR-CHE-002',
    city: 'Velachery, Chennai',
    address: 'Plot 12, Velachery Main Road, Chennai, TN 600042',
    campId: '1',
    campName: CAMP_ONE_NAME,
  },
  {
    id: 'BR-CHE-001-C5',
    city: 'Nanganallur, Chennai',
    address: '24 & 26, Swathi, 29th St, NCBS Colony, Nanganallur, Chennai, TN 600061',
    campId: '5',
    campName: CAMP_ONE_NAME,
  },
  {
    id: 'BR-CHE-002-C5',
    city: 'Velachery, Chennai',
    address: 'Plot 12, Velachery Main Road, Chennai, TN 600042',
    campId: '5',
    campName: CAMP_ONE_NAME,
  },
  {
    id: 'BR-CBE-001',
    city: 'Coimbatore',
    address: '88, Avinashi Road, Peelamedu, Coimbatore, TN 641004',
    campId: '2',
    campName: 'Glaucoma Detection Drive',
  },
  {
    id: 'BR-TRY-001',
    city: 'Trichy',
    address: '15, Thillai Nagar, Trichy, TN 620018',
    campId: '4',
    campName: 'Pediatric Vision Screening Camp',
  },
  {
    id: 'BR-SLM-001',
    city: 'Salem',
    address: '22, Omalur Main Road, Salem, TN 636004',
    campId: '3',
    campName: 'Diabetic Retinopathy Check-up',
  },
];

interface CityTemplate {
  code: string;
  city: string;
  areas: string[];
  pinPrefix: string;
  campId: string;
  campName: string;
}

const CITY_TEMPLATES: CityTemplate[] = [
  {
    code: 'CHE',
    city: 'Chennai',
    areas: [
      'Nanganallur',
      'Velachery',
      'Anna Nagar',
      'T Nagar',
      'Adyar',
      'Porur',
      'Tambaram',
      'Chromepet',
      'Mylapore',
      'Egmore',
      'Ambattur',
      'Sholinganallur',
      'Perungudi',
      'Guindy',
      'Kodambakkam',
    ],
    pinPrefix: '600',
    campId: '1',
    campName: CAMP_ONE_NAME,
  },
  {
    code: 'CBE',
    city: 'Coimbatore',
    areas: ['Peelamedu', 'Ramanathapuram', 'RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Singanallur', 'Saravanampatti'],
    pinPrefix: '641',
    campId: '2',
    campName: 'Glaucoma Detection Drive',
  },
  {
    code: 'MDU',
    city: 'Madurai',
    areas: ['Chokkikulam', 'Anna Nagar', 'KK Nagar', 'Simmakkal', 'Tallakulam', 'Bypass Road'],
    pinPrefix: '625',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Madurai',
  },
  {
    code: 'TRY',
    city: 'Trichy',
    areas: ['Thillai Nagar', 'Cantonment', 'Srirangam', 'Woraiyur', 'Puthur'],
    pinPrefix: '620',
    campId: '4',
    campName: 'Pediatric Vision Screening Camp',
  },
  {
    code: 'SLM',
    city: 'Salem',
    areas: ['Omalur Road', 'Saradha College Road', 'Hasthampatti', 'Five Roads', 'Suramangalam'],
    pinPrefix: '636',
    campId: '3',
    campName: 'Diabetic Retinopathy Check-up',
  },
  {
    code: 'ERD',
    city: 'Erode',
    areas: ['Perundurai Road', 'Brough Road', 'Sathy Road', 'Central Bus Stand'],
    pinPrefix: '638',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Erode',
  },
  {
    code: 'TNJ',
    city: 'Thanjavur',
    areas: ['Medical College Road', 'Gandhiji Road', 'Trichy Road', 'Old Bus Stand'],
    pinPrefix: '613',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Thanjavur',
  },
  {
    code: 'VLR',
    city: 'Vellore',
    areas: ['Katpadi', 'Sathuvachari', 'Bagayam', 'Odugathur Road'],
    pinPrefix: '632',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Vellore',
  },
  {
    code: 'TUP',
    city: 'Tiruppur',
    areas: ['Kumaran Road', 'Avinashi Road', 'PN Road', 'Kangeyam Road'],
    pinPrefix: '641',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Tiruppur',
  },
  {
    code: 'TVM',
    city: 'Tirunelveli',
    areas: ['Palayamkottai', 'Thachanallur', 'Pettai', 'Vannarapettai'],
    pinPrefix: '627',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Tirunelveli',
  },
  {
    code: 'TUT',
    city: 'Tuticorin',
    areas: ['Beach Road', 'Palayamkottai Road', 'Millerpuram', 'Thoothukudi Central'],
    pinPrefix: '628',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Tuticorin',
  },
  {
    code: 'KPM',
    city: 'Kanchipuram',
    areas: ['GST Road', 'Sriperumbudur Road', 'Walajabad', 'Temple Town'],
    pinPrefix: '631',
    campId: '0',
    campName: 'Dr. Agarwal\u2019s Eye Hospital — Kanchipuram',
  },
];

const STREET_NAMES = [
  'Main Road',
  'Cross Street',
  'Gandhi Nagar',
  'Nehru Street',
  'Hospital Road',
  'Station Road',
  'Bypass Road',
  'Ring Road',
  'Market Street',
  'College Road',
];

function generateBranches(targetCount: number): BranchOption[] {
  const pinnedIds = new Set(PINNED_BRANCHES.map((b) => b.id));
  const generated: BranchOption[] = [];
  let serial = 1;

  while (PINNED_BRANCHES.length + generated.length < targetCount) {
    for (const template of CITY_TEMPLATES) {
      if (PINNED_BRANCHES.length + generated.length >= targetCount) break;

      for (const area of template.areas) {
        if (PINNED_BRANCHES.length + generated.length >= targetCount) break;

        const id = `BR-${template.code}-${String(serial).padStart(3, '0')}`;
        serial += 1;
        if (pinnedIds.has(id)) continue;

        const street = STREET_NAMES[serial % STREET_NAMES.length];
        const plot = (serial % 120) + 1;
        const pinSuffix = String(100 + (serial % 900)).padStart(3, '0');
        const cityLabel = template.city === 'Chennai' ? `${area}, Chennai` : template.city;

        generated.push({
          id,
          city: cityLabel,
          address: `${plot}, ${street}, ${area}, ${template.city}, TN ${template.pinPrefix}${pinSuffix}`,
          campId: template.campId,
          campName: template.campName,
        });
      }
    }
  }

  return generated;
}

export const branchCatalog: BranchOption[] = [...PINNED_BRANCHES, ...generateBranches(150)];
