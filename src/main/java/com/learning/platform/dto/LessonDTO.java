package com.learning.platform.dto;

import com.learning.platform.model.Lesson;
import lombok.Data;

@Data
public class LessonDTO {
    private Long id;
    private String title;
    private String description;
    private String duration;
    private String videoUrl;
    private Integer orderIndex;
    private Boolean completed;

    public static LessonDTO fromEntity(Lesson lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setDescription(lesson.getDescription());
        dto.setDuration(lesson.getDuration());
        dto.setVideoUrl(lesson.getVideoUrl());
        dto.setOrderIndex(lesson.getOrderIndex());
        dto.setCompleted(false);
        return dto;
    }
}
