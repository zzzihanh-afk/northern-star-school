import { describe, it, expect } from 'vitest';
import { calculateGrade, calculateOverallGpa } from '../src/utils/grading';

describe('Grading System (Bangladesh Standard)', () => {
  it('correctly assigns grades and grade points based on percentage', () => {
    // 80%+ is A+ (5.0)
    expect(calculateGrade(80, 100)).toEqual({ grade: 'A+', gradePoint: 5.0, remarks: 'Outstanding' });
    expect(calculateGrade(95, 100)).toEqual({ grade: 'A+', gradePoint: 5.0, remarks: 'Outstanding' });

    // 70-79% is A (4.0)
    expect(calculateGrade(75, 100)).toEqual({ grade: 'A', gradePoint: 4.0, remarks: 'Excellent' });

    // 60-69% is A- (3.5)
    expect(calculateGrade(65, 100)).toEqual({ grade: 'A-', gradePoint: 3.5, remarks: 'Very Good' });

    // 50-59% is B (3.0)
    expect(calculateGrade(55, 100)).toEqual({ grade: 'B', gradePoint: 3.0, remarks: 'Good' });

    // 40-49% is C (2.0)
    expect(calculateGrade(45, 100)).toEqual({ grade: 'C', gradePoint: 2.0, remarks: 'Satisfactory' });

    // 33-39% is D (1.0)
    expect(calculateGrade(35, 100)).toEqual({ grade: 'D', gradePoint: 1.0, remarks: 'Pass' });

    // Below 33% is F (0.0)
    expect(calculateGrade(30, 100)).toEqual({ grade: 'F', gradePoint: 0.0, remarks: 'Fail' });
  });

  it('calculates overall GPA accurately across compulsory and optional subjects', () => {
    const subjects = [
      { marksObtained: 85, totalMarks: 100 }, // A+ (5.0)
      { marksObtained: 82, totalMarks: 100 }, // A+ (5.0)
      { marksObtained: 75, totalMarks: 100 }, // A (4.0)
      { marksObtained: 70, totalMarks: 100 }, // A (4.0)
    ];

    const result = calculateOverallGpa(subjects);
    expect(result.gpa).toBe(4.5);
    expect(result.grade).toBe('A');
    expect(result.hasFailed).toBe(false);
  });

  it('fails overall if any compulsory subject is failed', () => {
    const subjects = [
      { marksObtained: 90, totalMarks: 100 },
      { marksObtained: 25, totalMarks: 100 }, // Fail
    ];

    const result = calculateOverallGpa(subjects);
    expect(result.gpa).toBe(0.0);
    expect(result.grade).toBe('F');
    expect(result.hasFailed).toBe(true);
  });
});
