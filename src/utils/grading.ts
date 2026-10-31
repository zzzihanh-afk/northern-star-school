export interface GradeResult {
  grade: string;
  gradePoint: number;
  remarks: string;
}

export function calculateGrade(marksObtained: number, totalMarks: number = 100): GradeResult {
  if (totalMarks <= 0) {
    return { grade: 'F', gradePoint: 0.0, remarks: 'Invalid' };
  }

  const percentage = (marksObtained / totalMarks) * 100;

  if (percentage >= 80) {
    return { grade: 'A+', gradePoint: 5.0, remarks: 'Outstanding' };
  } else if (percentage >= 70) {
    return { grade: 'A', gradePoint: 4.0, remarks: 'Excellent' };
  } else if (percentage >= 60) {
    return { grade: 'A-', gradePoint: 3.5, remarks: 'Very Good' };
  } else if (percentage >= 50) {
    return { grade: 'B', gradePoint: 3.0, remarks: 'Good' };
  } else if (percentage >= 40) {
    return { grade: 'C', gradePoint: 2.0, remarks: 'Satisfactory' };
  } else if (percentage >= 33) {
    return { grade: 'D', gradePoint: 1.0, remarks: 'Pass' };
  } else {
    return { grade: 'F', gradePoint: 0.0, remarks: 'Fail' };
  }
}

export function calculateOverallGpa(subjects: { marksObtained: number; totalMarks: number; isOptional?: boolean }[]): {
  gpa: number;
  grade: string;
  totalMarksObtained: number;
  maxTotalMarks: number;
  hasFailed: boolean;
} {
  if (!subjects.length) {
    return { gpa: 0, grade: 'F', totalMarksObtained: 0, maxTotalMarks: 0, hasFailed: false };
  }

  let totalMarksObtained = 0;
  let maxTotalMarks = 0;
  let gradePointSum = 0;
  let countableSubjects = 0;
  let hasFailed = false;

  for (const sub of subjects) {
    totalMarksObtained += sub.marksObtained;
    maxTotalMarks += sub.totalMarks;
    const { gradePoint, grade } = calculateGrade(sub.marksObtained, sub.totalMarks);

    if (grade === 'F') {
      hasFailed = true;
    }

    // Optional 4th subject logic in Bangladesh: points above 2.0 are added
    if (sub.isOptional) {
      if (gradePoint > 2.0) {
        gradePointSum += (gradePoint - 2.0);
      }
    } else {
      gradePointSum += gradePoint;
      countableSubjects++;
    }
  }

  if (hasFailed || countableSubjects === 0) {
    return {
      gpa: 0.0,
      grade: 'F',
      totalMarksObtained,
      maxTotalMarks,
      hasFailed: true,
    };
  }

  let gpa = gradePointSum / countableSubjects;
  if (gpa > 5.0) gpa = 5.0;
  gpa = Math.round(gpa * 100) / 100;

  let overallGrade = 'F';
  if (gpa >= 5.0) overallGrade = 'A+';
  else if (gpa >= 4.0) overallGrade = 'A';
  else if (gpa >= 3.5) overallGrade = 'A-';
  else if (gpa >= 3.0) overallGrade = 'B';
  else if (gpa >= 2.0) overallGrade = 'C';
  else if (gpa >= 1.0) overallGrade = 'D';

  return {
    gpa,
    grade: overallGrade,
    totalMarksObtained,
    maxTotalMarks,
    hasFailed: false,
  };
}
