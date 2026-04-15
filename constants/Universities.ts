/**
 * University Data Constants for SchoolI
 * Target Universities: UniUyo, UniCross, UniCal
 */

export interface University {
  id: string;
  name: string;
  fullName: string;
  location: string;
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
