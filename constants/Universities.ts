/**
 * University Data Constants for SchoolI
 * Target Universities: UniUyo, UniCross, UniCal
 */

export interface University {
  id: string;
  name: string;
  fullName: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landmarks: {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    color: string;
    queue?: number;
    waitTime?: string;
  }[];
  docs: string[];
  processes: {
    id: string;
    title: string;
    steps: string[];
    estimatedTime: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const UNIVERSITIES: University[] = [
  {
    id: 'uniuyo',
    name: 'UniUyo',
    fullName: 'University of Uyo',
    location: 'Uyo, Akwa Ibom State',
    coordinates: { lat: 5.0416, lng: 7.9142 },
    landmarks: [
      { id: '1', name: 'University Library', type: 'Academic', lat: 5.0410, lng: 7.9130, color: '#6366F1' },
      { id: '2', name: 'Senate House', type: 'Administrative', lat: 5.0425, lng: 7.9150, color: '#F59E0B' },
      { id: '3', name: 'ICT Center', type: 'Technical', lat: 5.0400, lng: 7.9120, color: '#8B5CF6' },
      { id: '4', name: 'Student Union Building', type: 'Social', lat: 5.0430, lng: 7.9160, color: '#EC4899' },
    ],
    docs: [
      'Admission Letter',
      'JAMB Result Slip',
      'O-Level Result (WAEC/NECO)',
      'Birth Certificate',
      'Certificate of Origin',
      'Acceptance Fee Receipt'
    ],
    processes: [
      {
        id: 'registration',
        title: 'Admission Registration',
        steps: [
          'Pay Acceptance Fee',
          'Online Bio-data Update',
          'Faculty Screening',
          'Central Registration'
        ],
        estimatedTime: '3-5 Days'
      },
      {
        id: 'hostel',
        title: 'Hostel Allocation',
        steps: [
          'Online Application',
          'Payment of Hostel Fee',
          'Room Allocation',
          'Bed Space Verification'
        ],
        estimatedTime: '2 Days'
      }
    ],
    faqs: [
      { q: 'Where is the Senate building located?', a: 'The Senate building is located at the Town Campus, near the main gate.' },
      { q: 'How do I pay my school fees?', a: 'Payments are done via the university portal through Remita.' }
    ]
  },
  {
    id: 'unicross',
    name: 'UniCross',
    fullName: 'Cross River University of Technology',
    location: 'Calabar, Cross River State',
    coordinates: { lat: 4.9745, lng: 8.3475 },
    landmarks: [
      { id: '1', name: 'Admin Block', type: 'Administrative', lat: 4.9740, lng: 8.3470, color: '#F59E0B' },
      { id: '2', name: 'ETF Hall', type: 'Academic', lat: 4.9750, lng: 8.3480, color: '#6366F1' },
    ],
    docs: [
      'JAMB Admission Letter',
      'State of Origin Certificate',
      'Attestation Letter',
      'Passport Photographs',
      'First School Leaving Certificate'
    ],
    processes: [
      {
        id: 'clearance',
        title: 'Departmental Clearance',
        steps: [
          'Verification of Results',
          'Payment of Departmental Dues',
          'HOD Approval'
        ],
        estimatedTime: '1-2 Days'
      }
    ],
    faqs: [
      { q: 'Is there health insurance for students?', a: 'Yes, TISHIP covers all registered students.' }
    ]
  },
  {
    id: 'unical',
    name: 'UniCal',
    fullName: 'University of Calabar',
    location: 'Calabar, Cross River State',
    coordinates: { lat: 4.9536, lng: 8.3444 },
    landmarks: [
      { id: '1', name: 'Senate Chambers', type: 'Administrative', lat: 4.9530, lng: 8.3440, color: '#F59E0B' },
      { id: '2', name: 'Medical School', type: 'Academic', lat: 4.9550, lng: 8.3450, color: '#10B981' },
    ],
    docs: [
      'Post-UTME Screening Result',
      'LGA Identification',
      'Medical Report',
      'Reference Letter'
    ],
    processes: [
      {
        id: 'screening',
        title: 'Freshers Screening',
        steps: [
          'Document Collation',
          'Medical Exam',
          'Library Orientation'
        ],
        estimatedTime: '4 Days'
      }
    ],
    faqs: [
      { q: 'Where do I get my ID card?', a: 'ID cards are processed at the ICT center.' }
    ]
  }
];
