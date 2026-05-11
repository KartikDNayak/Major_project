package com.learning.platform.dto;

import com.learning.platform.model.Course;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String duration;
    private String category;
    private String instructor;
    private String imageUrl;
    private Double rating;
    private Boolean featured;
    private Integer totalStudents;
    private Integer totalLessons;
    private List<LessonDTO> lessons;

    public static CourseDTO fromEntity(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setDuration(course.getDuration());
        dto.setCategory(course.getCategory());
        dto.setInstructor(course.getInstructor());
        dto.setImageUrl(course.getImageUrl());
        dto.setRating(course.getRating());
        dto.setFeatured(course.getFeatured());
        dto.setTotalStudents(course.getTotalStudents());
        dto.setTotalLessons(course.getLessons() != null ? course.getLessons().size() : 0);
        if (course.getLessons() != null) {
            dto.setLessons(course.getLessons().stream()
                    .map(LessonDTO::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
