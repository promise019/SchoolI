export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf';
  url: string;
  thumbnail?: string;
  courseCode?: string;
}

export const ACADEMIC_RESOURCES: Resource[] = [
  {
    id: 'v1',
    title: 'Introduction to Artificial Intelligence',
    description: 'A comprehensive overview of AI concepts, history, and future trends.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ad79nYk2kEg',
    thumbnail: 'https://img.youtube.com/vi/ad79nYk2kEg/maxresdefault.jpg',
    courseCode: 'CSC 411'
  },
  {
    id: 'v2',
    title: 'Data Structures and Algorithms',
    description: 'Learn fundamental data structures and algorithmic complexity.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=8hly31xKli0',
    thumbnail: 'https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg',
    courseCode: 'CSC 211'
  },
  {
    id: 'p1',
    title: 'JAMB Syllabus for Computer Science',
    description: 'Official requirements and topic breakdown for CS students.',
    type: 'pdf',
    url: 'https://www.jamb.gov.ng/Syllabus/ComputerScience.pdf',
    courseCode: 'GENERAL'
  },
  {
    id: 'p2',
    title: 'Operating Systems - Lecture Notes',
    description: 'Detailed notes on process management, memory, and file systems.',
    type: 'pdf',
    url: 'https://example.com/os-notes.pdf',
    courseCode: 'CSC 311'
  },
  {
    id: 'v3',
    title: 'Quantum Computing for Beginners',
    description: 'Understanding qubits, superposition, and entanglement.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=QuR969uMICM',
    thumbnail: 'https://img.youtube.com/vi/QuR969uMICM/maxresdefault.jpg',
    courseCode: 'CSC 421'
  }
];

export const getRecommendedResources = (query: string): Resource[] => {
  const lowercaseQuery = query.toLowerCase();
  return ACADEMIC_RESOURCES.filter(r => 
    r.title.toLowerCase().includes(lowercaseQuery) || 
    r.description.toLowerCase().includes(lowercaseQuery) ||
    r.courseCode?.toLowerCase().includes(lowercaseQuery)
  );
};
