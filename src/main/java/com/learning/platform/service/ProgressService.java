package com.learning.platform.service;

import com.learning.platform.dto.ProgressDTO;
import com.learning.platform.dto.ProgressUpdateRequest;
import com.learning.platform.model.Enrollment;
import com.learning.platform.model.Lesson;
import com.learning.platform.model.Progress;
import com.learning.platform.repository.EnrollmentRepository;
import com.learning.platform.repository.LessonRepository;
import com.learning.platform.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressRepository progressRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public ProgressDTO updateProgress(ProgressUpdateRequest request) {
        Enrollment enrollment = enrollmentRepository.findById(request.getEnrollmentId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Progress progress = progressRepository.findByEnrollmentIdAndLessonId(
                request.getEnrollmentId(), request.getLessonId())
                .orElseGet(() -> {
                    Progress p = new Progress();
                    p.setEnrollment(enrollment);
                    p.setLesson(lesson);
                    return p;
                });

        progress.setCompleted(request.getCompleted());
        if (Boolean.TRUE.equals(request.getCompleted())) {
            progress.setCompletedAt(LocalDateTime.now());
        } else {
            progress.setCompletedAt(null);
        }

        Progress saved = progressRepository.save(progress);

        // Check if course completed
        long totalLessons = enrollment.getCourse().getLessons().size();
        long completedLessons = progressRepository.countCompletedByEnrollmentId(enrollment.getId());
        if (totalLessons > 0 && totalLessons == completedLessons) {
            enrollment.setStatus(Enrollment.Status.COMPLETED);
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollmentRepository.save(enrollment);
        } else if (enrollment.getStatus() == Enrollment.Status.COMPLETED) {
            enrollment.setStatus(Enrollment.Status.ACTIVE);
            enrollment.setCompletedAt(null);
            enrollmentRepository.save(enrollment);
        }

        return ProgressDTO.fromEntity(saved);
    }

    public List<ProgressDTO> getProgressByEnrollment(Long enrollmentId) {
        return progressRepository.findByEnrollmentId(enrollmentId).stream()
                .map(ProgressDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Double getProgressPercentage(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        long total = enrollment.getCourse().getLessons().size();
        if (total == 0) return 0.0;
        long completed = progressRepository.countCompletedByEnrollmentId(enrollmentId);
        return Math.round((completed * 100.0 / total) * 100.0) / 100.0;
    }
}
