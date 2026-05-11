package com.learning.platform.dto;

import com.learning.platform.model.Enrollment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnrollmentDTO {
    private Long id;
    private Long userId;
    private Long courseId;
    private String courseTitle;
    private String courseImage;
    private String instructor;
    private Integer totalLessons;
    private Integer completedLessons;
    private Double progressPercentage;
    private String status;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;

    public static EnrollmentDTO fromEntity(Enrollment enrollment, Integer completedLessons) {
        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setUserId(enrollment.getUser().getId());
        dto.setCourseId(enrollment.getCourse().getId());
        dto.setCourseTitle(enrollment.getCourse().getTitle());
        dto.setCourseImage(enrollment.getCourse().getImageUrl());
        dto.setInstructor(enrollment.getCourse().getInstructor());
        dto.setTotalLessons(enrollment.getCourse().getLessons() != null ? enrollment.getCourse().getLessons().size() : 0);
        dto.setCompletedLessons(completedLessons);
        dto.setStatus(enrollment.getStatus().name());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        dto.setCompletedAt(enrollment.getCompletedAt());

        int total = dto.getTotalLessons();
        dto.setProgressPercentage(total > 0 ? Math.round((completedLessons * 100.0 / total) * 100.0) / 100.0 : 0.0);
        return dto;
    }
}
