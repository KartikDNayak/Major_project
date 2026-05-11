package com.learning.platform.controller;

import com.learning.platform.dto.ApiResponse;
import com.learning.platform.dto.CourseDTO;
import com.learning.platform.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses()));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getFeaturedCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getFeaturedCourses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> searchCourses(@RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success(courseService.searchCourses(query)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCoursesByCategory(category)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCategories()));
    }
}
