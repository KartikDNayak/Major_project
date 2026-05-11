package com.learning.platform.service;

import com.learning.platform.dto.CourseCreateRequest;
import com.learning.platform.dto.CourseDTO;
import com.learning.platform.model.Course;
import com.learning.platform.model.Lesson;
import com.learning.platform.repository.CourseRepository;
import com.learning.platform.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getFeaturedCourses() {
        return courseRepository.findByFeaturedTrue().stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return CourseDTO.fromEntity(course);
    }

    public List<CourseDTO> searchCourses(String query) {
        return courseRepository.searchCourses(query).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getCoursesByCategory(String category) {
        return courseRepository.findByCategoryIgnoreCase(category).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return courseRepository.findAllCategories();
    }

    @Transactional
    public CourseDTO createCourse(CourseCreateRequest request) {
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setDuration(request.getDuration());
        course.setCategory(request.getCategory());
        course.setInstructor(request.getInstructor());
        course.setImageUrl(request.getImageUrl());
        course.setRating(request.getRating());
        course.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);

        Course savedCourse = courseRepository.save(course);

        if (request.getLessons() != null) {
            for (CourseCreateRequest.LessonRequest lr : request.getLessons()) {
                Lesson lesson = new Lesson();
                lesson.setTitle(lr.getTitle());
                lesson.setDescription(lr.getDescription());
                lesson.setDuration(lr.getDuration());
                lesson.setVideoUrl(lr.getVideoUrl());
                lesson.setOrderIndex(lr.getOrderIndex());
                lesson.setCourse(savedCourse);
                lessonRepository.save(lesson);
            }
        }

        return CourseDTO.fromEntity(courseRepository.findById(savedCourse.getId()).orElseThrow());
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseCreateRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setDuration(request.getDuration());
        course.setCategory(request.getCategory());
        course.setInstructor(request.getInstructor());
        course.setImageUrl(request.getImageUrl());
        course.setRating(request.getRating());
        course.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);

        // Clear and re-add lessons
        course.getLessons().clear();
        if (request.getLessons() != null) {
            for (CourseCreateRequest.LessonRequest lr : request.getLessons()) {
                Lesson lesson = new Lesson();
                lesson.setTitle(lr.getTitle());
                lesson.setDescription(lr.getDescription());
                lesson.setDuration(lr.getDuration());
                lesson.setVideoUrl(lr.getVideoUrl());
                lesson.setOrderIndex(lr.getOrderIndex());
                lesson.setCourse(course);
                course.getLessons().add(lesson);
            }
        }

        return CourseDTO.fromEntity(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
