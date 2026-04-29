export const adminUsers = [
  { id: 'ADM-001', name: 'Joshua Otieno', role: 'Super Admin', email: 'joshua@diceministry.org', scope: 'All portals', status: 'Active' },
  { id: 'ADM-002', name: 'Grace Njeri', role: 'Instructor', email: 'grace.njeri@diceministry.org', scope: 'Ignite cohort', status: 'Active' },
  { id: 'ADM-003', name: 'Mark Were', role: 'Admissions Officer', email: 'mark.were@diceministry.org', scope: 'Applications', status: 'Pending Invite' },
  { id: 'ADM-004', name: 'Lydia Mwangi', role: 'Content Manager', email: 'lydia.mwangi@diceministry.org', scope: 'Course library', status: 'Active' },
];

export const students = [
  { id: 'STU-2401', initials: 'SM', name: 'Sarah Mulupi', email: 'sarah.mulupi@example.com', cohort: 'SURGE 24', progress: 100, status: 'Completed', track: 'Peer Mentoring', mentor: 'Grace Njeri' },
  { id: 'STU-2508', initials: 'JD', name: 'John Doe', email: 'john.doe@example.com', cohort: 'Ignite 25', progress: 45, status: 'Active', track: 'Discipleship Foundations', mentor: 'Mark Omondi' },
  { id: 'STU-2512', initials: 'AN', name: 'Achieng Naliaka', email: 'achieng.n@example.com', cohort: 'Ignite 25', progress: 23, status: 'At Risk', track: 'Digital Literacy', mentor: 'Grace Njeri' },
  { id: 'STU-2516', initials: 'PM', name: 'Peter Maina', email: 'peter.maina@example.com', cohort: 'Ignite 25', progress: 12, status: 'New Admit', track: 'Orientation', mentor: 'Maurice Agunda' },
];

export const applications = [
  { id: 'APP-2501', name: 'Lynette Atieno', school: "St. Mary's Keris", status: 'Needs Review', submitted: 'Today, 09:40', track: 'Ignite 2025', documents: ['KCSE Result Slip', 'Pastor Recommendation'] },
  { id: 'APP-2502', name: 'Dennis Kimani', school: 'Baba Dogo High', status: 'Interview Ready', submitted: 'Yesterday, 16:10', track: 'Ignite 2025', documents: ['National ID', 'Transcript'] },
  { id: 'APP-2503', name: 'Joy Wambui', school: 'Kahawa Girls', status: 'Approved', submitted: 'Apr 23, 11:15', track: 'Ignite 2025', documents: ['KCSE Result Slip', 'Guardian Consent'] },
];

export const courses = [
  { id: 'discipleship-foundations', title: 'Discipleship Foundations', status: 'Published', modules: 4, units: 12, type: 'Text + assignments', students: 65, updated: 'Today, 08:20' },
  { id: 'peer-mentoring-life-skills', title: 'Peer Mentoring & Practical Life Skills', status: 'Draft', modules: 3, units: 8, type: 'Text only', students: 58, updated: 'Yesterday, 15:40' },
  { id: 'basic-computer-skills', title: 'Basic Computer Skills', status: 'Published', modules: 5, units: 14, type: 'Text + documents', students: 72, updated: 'Apr 25, 09:05' },
];

export const courseCatalog = [
  {
    id: 'discipleship-foundations',
    title: 'Discipleship Foundations',
    synopsis: 'Biblical foundations, spiritual disciplines, and Christ-centered character formation.',
    progress: 45,
    moduleCount: 4,
    unitCount: 12,
    mentor: 'Grace Njeri',
    nextUnit: 'The Grace of God',
    duration: '6 weeks',
    badges: ['Core Ignite', 'Reflection tasks', 'Reading units'],
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Faith',
        status: 'Completed',
        units: [
          { id: 'u1', title: 'What is Faith?', type: 'Reading unit', duration: '18 min', completed: true },
          { id: 'u2', title: 'The Grace of God', type: 'Text + notes', duration: '25 min', completed: false, active: true },
          { id: 'u3', title: 'Repentance and Renewal', type: 'Reading unit', duration: '14 min', completed: false },
        ],
      },
      {
        id: 'm2',
        title: 'Discipleship Habits',
        status: 'In progress',
        units: [
          { id: 'u1', title: 'Prayer in Everyday Life', type: 'Reading unit', duration: '21 min', completed: false },
          { id: 'u2', title: 'Walking with Scripture', type: 'Reading unit', duration: '17 min', completed: false },
        ],
      },
      {
        id: 'm3',
        title: 'Service and Evangelism',
        status: 'Locked',
        units: [
          { id: 'u1', title: 'Serving with Compassion', type: 'Workshop', duration: '20 min', completed: false },
          { id: 'u2', title: 'Sharing Your Story', type: 'Assignment', duration: '30 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'peer-mentoring-life-skills',
    title: 'Peer Mentoring & Practical Life Skills',
    synopsis: 'Practical decision-making, mentorship culture, and life-direction planning for Ignite students.',
    progress: 20,
    moduleCount: 3,
    unitCount: 8,
    mentor: 'Maurice Agunda',
    nextUnit: 'Discovering Purpose',
    duration: '8 weeks',
    badges: ['Cohort lab', 'Mentor guided'],
    modules: [
      {
        id: 'm1',
        title: 'Identity and Purpose',
        status: 'In progress',
        units: [
          { id: 'u1', title: 'Discovering Purpose', type: 'Facilitated lesson', duration: '16 min', completed: false, active: true },
          { id: 'u2', title: 'Values and Boundaries', type: 'Worksheet', duration: '24 min', completed: false },
        ],
      },
      {
        id: 'm2',
        title: 'Peer Mentoring Practice',
        status: 'Locked',
        units: [
          { id: 'u1', title: 'Healthy Conversations', type: 'Role play', duration: '18 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'basic-computer-skills',
    title: 'Basic Computer Skills',
    synopsis: 'Introductory productivity tools, file handling, and digital workplace confidence.',
    progress: 85,
    moduleCount: 5,
    unitCount: 14,
    mentor: 'Lydia Mwangi',
    nextUnit: 'Presentations and Slide Design',
    duration: '5 weeks',
    badges: ['Practical files', 'Downloadable templates'],
    modules: [
      {
        id: 'm1',
        title: 'Computer Basics',
        status: 'Completed',
        units: [
          { id: 'u1', title: 'File Management', type: 'Hands-on lab', duration: '22 min', completed: true },
        ],
      },
      {
        id: 'm4',
        title: 'Productivity Tools',
        status: 'In progress',
        units: [
          { id: 'u1', title: 'Spreadsheets for Beginners', type: 'Workshop', duration: '28 min', completed: true },
          { id: 'u2', title: 'Presentations and Slide Design', type: 'Workshop', duration: '20 min', completed: false, active: true },
        ],
      },
    ],
  },
];

export const assignments = [
  { id: 'ASG-401', title: 'Unit 3 Reflection Essay', course: 'Discipleship Foundations', due: 'Tomorrow, 11:59 PM', submissions: 28, pending: 6, format: 'PDF or DOCX', status: 'Open' },
  { id: 'ASG-402', title: 'Career Vision Worksheet', course: 'Peer Mentoring & Practical Life Skills', due: 'Apr 30, 5:00 PM', submissions: 20, pending: 3, format: 'PDF only', status: 'Reviewing' },
  { id: 'ASG-403', title: 'Spreadsheet Practice File', course: 'Basic Computer Skills', due: 'May 2, 9:00 AM', submissions: 12, pending: 12, format: 'XLSX or PDF', status: 'Open' },
];

export const studentAssignments = [
  {
    id: 'ASG-401',
    title: 'Unit 3 Reflection Essay',
    courseId: 'discipleship-foundations',
    course: 'Discipleship Foundations',
    due: 'Tomorrow, 11:59 PM',
    status: 'Pending',
    grade: null,
    instructions: 'Submit a one-page reflection on how grace shapes daily decisions, with at least two scripture references.',
    accepted: 'DOCX or PDF under 10MB',
  },
  {
    id: 'ASG-402',
    title: 'Career Vision Worksheet',
    courseId: 'peer-mentoring-life-skills',
    course: 'Peer Mentoring & Practical Life Skills',
    due: 'Apr 30, 5:00 PM',
    status: 'Submitted',
    grade: null,
    instructions: 'Upload your completed worksheet and a brief paragraph about your next three growth goals.',
    accepted: 'PDF only',
  },
  {
    id: 'ASG-403',
    title: 'Spreadsheet Practice File',
    courseId: 'basic-computer-skills',
    course: 'Basic Computer Skills',
    due: 'May 2, 9:00 AM',
    status: 'Graded',
    grade: '94%',
    instructions: 'Create a formatted attendance tracker and submit the spreadsheet file plus exported PDF.',
    accepted: 'XLSX or PDF',
  },
];

export const announcements = [
  { id: 'ANN-01', title: 'Ignite 2025 applications close Friday', audience: 'Public + Admin', channel: 'Banner + Email', status: 'Scheduled', date: 'Apr 30, 7:00 AM' },
  { id: 'ANN-02', title: 'Unit 4 materials are live', audience: 'Students', channel: 'Portal notification', status: 'Sent', date: 'Apr 26, 2:00 PM' },
  { id: 'ANN-03', title: 'Royal Servants briefing uploaded', audience: 'Instructors', channel: 'Email + Documents', status: 'Draft', date: 'Unscheduled' },
];

export const documents = [
  { id: 'DOC-11', name: 'Ignite 2025 Admissions Checklist.pdf', category: 'Admissions', owner: 'Mark Were', access: 'Admin only', updated: 'Today, 10:14' },
  { id: 'DOC-12', name: 'Mentor Handbook.docx', category: 'Training', owner: 'Grace Njeri', access: 'Instructors', updated: 'Yesterday, 13:22' },
  { id: 'DOC-13', name: 'Student Progress Template.xlsx', category: 'Reporting', owner: 'Joshua Otieno', access: 'Admin team', updated: 'Apr 24, 08:45' },
];

export const adminThreads = [
  { id: 'TH-01', name: 'Instructor Davis', subject: 'Assignment follow-up', unread: 2, lastMessage: 'Can we extend the deadline for Peter Maina?', time: '10:45 AM' },
  { id: 'TH-02', name: 'Admissions Team', subject: 'Application review queue', unread: 0, lastMessage: 'Three new referrals from Reign Ministries.', time: 'Yesterday' },
  { id: 'TH-03', name: 'Finance Desk', subject: 'Donor report request', unread: 1, lastMessage: 'Need current student impact metrics by Friday.', time: 'Apr 25' },
];

export const studentThreads = [
  { id: 'TH-S1', name: 'Instructor Davis', subject: 'Assignment follow-up', unread: 1, lastMessage: 'Your reflection is strong. Add one more scripture link before final submission.', time: '10:45 AM' },
  { id: 'TH-S2', name: 'Cohort Announcements', subject: 'Ignite 2025 schedule', unread: 0, lastMessage: 'Saturday community service details are now live in your cohort board.', time: 'Yesterday' },
  { id: 'TH-S3', name: 'Mentor Grace Njeri', subject: 'Prayer check-in', unread: 0, lastMessage: 'Let us take fifteen minutes after class tomorrow to go over your goals.', time: 'Apr 25' },
];

export function getCourseById(courseId: string) {
  return courseCatalog.find((course) => course.id === courseId) ?? courseCatalog[0];
}

export function getStudentById(studentId: string) {
  return students.find((student) => student.id === studentId) ?? students[0];
}
