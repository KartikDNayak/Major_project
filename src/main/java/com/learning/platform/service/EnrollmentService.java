package com.learning.platform.service;

import com.learning.platform.dto.EnrollmentDTO;
import com.learning.platform.model.Course;
import com.learning.platform.model.Enrollment;
import com.learning.platform.model.User;
import com.learning.platform.repository.CourseRepository;
import com.learning.platform.repository.EnrollmentRepository;
import com.learning.platform.repository.ProgressRepository;
import com.learning.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ProgressRepository progressRepository;

    @Transactional
    public EnrollmentDTO enrollUser(Long userId, Long courseId) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Already enrolled in this course");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(Enrollment.Status.ACTIVE);

        Enrollment saved = enrollmentRepository.save(enrollment);

        // Update total students
        course.setTotalStudents(course.getTotalStudents() + 1);
        courseRepository.save(course);

        return EnrollmentDTO.fromEntity(saved, 0);
    }

    public List<EnrollmentDTO> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(e -> {
                    Long completed = progressRepository.countCompletedByEnrollmentId(e.getId());
                    return EnrollmentDTO.fromEntity(e, completed.intValue());
                })
                .collect(Collectors.toList());
    }

    public EnrollmentDTO getEnrollment(Long userId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        Long completed = progressRepository.countCompletedByEnrollmentId(enrollment.getId());
        return EnrollmentDTO.fromEntity(enrollment, completed.intValue());
    }

    public boolean isEnrolled(Long userId, Long courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    @Transactional
    public void dropEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        enrollment.setStatus(Enrollment.Status.DROPPED);
        enrollmentRepository.save(enrollment);
    }
}
