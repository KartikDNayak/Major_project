package com.learning.platform.dto;

import com.learning.platform.model.Progress;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProgressDTO {
    private Long id;
    private Long enrollmentId;
    private Long lessonId;
    private String lessonTitle;
    private Boolean completed;
    private LocalDateTime completedAt;

    public static ProgressDTO fromEntity(Progress progress) {
        ProgressDTO dto = new ProgressDTO();
        dto.setId(progress.getId());
        dto.setEnrollmentId(progress.getEnrollment().getId());
        dto.setLessonId(progress.getLesson().getId());
        dto.setLessonTitle(progress.getLesson().getTitle());
        dto.setCompleted(progress.getCompleted());
        dto.setCompletedAt(progress.getCompletedAt());
        return dto;
    }
}
