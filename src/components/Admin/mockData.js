// Mock data for TPO Admin Dashboard

export const STUDENTS = [
    { id: 1, name: 'Aarav Sharma', branch: 'CSE', cgpa: 8.9, backlogs: 0, year: 2025, email: 'aarav@college.edu', phone: '9876543210', gender: 'Male' },
    { id: 2, name: 'Priya Patel', branch: 'CSE', cgpa: 9.2, backlogs: 0, year: 2025, email: 'priya@college.edu', phone: '9876543211', gender: 'Female' },
    { id: 3, name: 'Ravi Kumar', branch: 'ECE', cgpa: 7.4, backlogs: 1, year: 2025, email: 'ravi@college.edu', phone: '9876543212', gender: 'Male' },
    { id: 4, name: 'Sneha Reddy', branch: 'CSE', cgpa: 8.1, backlogs: 0, year: 2025, email: 'sneha@college.edu', phone: '9876543213', gender: 'Female' },
    { id: 5, name: 'Arjun Mehta', branch: 'ME', cgpa: 7.8, backlogs: 2, year: 2025, email: 'arjun@college.edu', phone: '9876543214', gender: 'Male' },
    { id: 6, name: 'Ananya Singh', branch: 'CSE', cgpa: 9.5, backlogs: 0, year: 2025, email: 'ananya@college.edu', phone: '9876543215', gender: 'Female' },
    { id: 7, name: 'Karthik Iyer', branch: 'IT', cgpa: 8.3, backlogs: 0, year: 2025, email: 'karthik@college.edu', phone: '9876543216', gender: 'Male' },
    { id: 8, name: 'Deepa Nair', branch: 'ECE', cgpa: 7.1, backlogs: 3, year: 2025, email: 'deepa@college.edu', phone: '9876543217', gender: 'Female' },
    { id: 9, name: 'Vikram Joshi', branch: 'CSE', cgpa: 8.7, backlogs: 0, year: 2025, email: 'vikram@college.edu', phone: '9876543218', gender: 'Male' },
    { id: 10, name: 'Meera Desai', branch: 'IT', cgpa: 8.0, backlogs: 1, year: 2025, email: 'meera@college.edu', phone: '9876543219', gender: 'Female' },
    { id: 11, name: 'Rahul Gupta', branch: 'ME', cgpa: 6.9, backlogs: 2, year: 2025, email: 'rahul@college.edu', phone: '9876543220', gender: 'Male' },
    { id: 12, name: 'Ishita Verma', branch: 'CSE', cgpa: 9.0, backlogs: 0, year: 2025, email: 'ishita@college.edu', phone: '9876543221', gender: 'Female' },
    { id: 13, name: 'Suresh Babu', branch: 'ECE', cgpa: 7.6, backlogs: 0, year: 2025, email: 'suresh@college.edu', phone: '9876543222', gender: 'Male' },
    { id: 14, name: 'Kavya Menon', branch: 'IT', cgpa: 8.5, backlogs: 0, year: 2025, email: 'kavya@college.edu', phone: '9876543223', gender: 'Female' },
    { id: 15, name: 'Aditya Rao', branch: 'CSE', cgpa: 7.3, backlogs: 1, year: 2025, email: 'aditya@college.edu', phone: '9876543224', gender: 'Male' },
    { id: 16, name: 'Nisha Agarwal', branch: 'ME', cgpa: 8.2, backlogs: 0, year: 2026, email: 'nisha@college.edu', phone: '9876543225', gender: 'Female' },
    { id: 17, name: 'Rohan Das', branch: 'CSE', cgpa: 8.8, backlogs: 0, year: 2026, email: 'rohan@college.edu', phone: '9876543226', gender: 'Male' },
    { id: 18, name: 'Tanvi Kulkarni', branch: 'ECE', cgpa: 7.9, backlogs: 0, year: 2026, email: 'tanvi@college.edu', phone: '9876543227', gender: 'Female' },
    { id: 19, name: 'Manish Tiwari', branch: 'IT', cgpa: 6.5, backlogs: 4, year: 2026, email: 'manish@college.edu', phone: '9876543228', gender: 'Male' },
    { id: 20, name: 'Pooja Hegde', branch: 'CSE', cgpa: 9.1, backlogs: 0, year: 2026, email: 'pooja@college.edu', phone: '9876543229', gender: 'Female' },
];

export const BRANCHES = ['CSE', 'IT', 'ECE', 'ME'];

export const DRIVES = [
    {
        id: 1,
        company: 'TCS Digital',
        role: 'Software Developer',
        package: '7 LPA',
        driveDate: '2025-03-15',
        criteria: { minCgpa: 7.0, maxBacklogs: 0, branches: ['CSE', 'IT', 'ECE'], year: 2025 },
        status: 'active',
        notified: true,
    },
    {
        id: 2,
        company: 'Infosys',
        role: 'Systems Engineer',
        package: '3.6 LPA',
        driveDate: '2025-03-20',
        criteria: { minCgpa: 6.0, maxBacklogs: 2, branches: ['CSE', 'IT', 'ECE', 'ME'], year: 2025 },
        status: 'active',
        notified: true,
    },
    {
        id: 3,
        company: 'Google',
        role: 'SDE Intern',
        package: '40 LPA',
        driveDate: '2025-04-01',
        criteria: { minCgpa: 8.5, maxBacklogs: 0, branches: ['CSE'], year: 2025 },
        status: 'upcoming',
        notified: false,
    },
];

export const NOTIFICATIONS = [
    { id: 1, driveId: 1, company: 'TCS Digital', sentAt: '2025-03-01T10:30:00', count: 8, status: 'delivered' },
    { id: 2, driveId: 2, company: 'Infosys', sentAt: '2025-03-05T14:00:00', count: 14, status: 'delivered' },
];

export const INTERVIEW_SLOTS = [
    { id: 1, driveId: 1, studentId: 2, date: '2025-03-15', startTime: '09:00', endTime: '09:30' },
    { id: 2, driveId: 1, studentId: 6, date: '2025-03-15', startTime: '09:30', endTime: '10:00' },
    { id: 3, driveId: 1, studentId: 9, date: '2025-03-15', startTime: '10:00', endTime: '10:30' },
];

// Utility: compute eligible students for a given criteria
export function getEligibleStudents(criteria) {
    return STUDENTS.filter(s => {
        if (s.cgpa < criteria.minCgpa) return false;
        if (s.backlogs > criteria.maxBacklogs) return false;
        if (!criteria.branches.includes(s.branch)) return false;
        if (criteria.year && s.year !== criteria.year) return false;
        return true;
    });
}
