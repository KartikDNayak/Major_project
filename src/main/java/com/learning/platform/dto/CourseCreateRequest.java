package com.learning.platform.dto;

import lombok.Data;
import java.util.List;

@Data
public class CourseCreateRequest {
    private String title;
    private String description;
    private String duration;
    private String category;
    private String instructor;
    private String imageUrl;
    private Double rating;
    private Boolean featured;
    private List<LessonRequest> lessons;

    @Data
    public static class LessonRequest {
        private String title;
        private String description;
        private String duration;
        private String videoUrl;
        private Integer orderIndex;
    }
}
