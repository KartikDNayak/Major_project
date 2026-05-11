package com.learning.platform.controller;

import com.learning.platform.dto.ApiResponse;
import com.learning.platform.dto.CourseCreateRequest;
import com.learning.platform.dto.CourseDTO;
import com.learning.platform.service.AdminService;
import com.learning.platform.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    private final CourseService courseService;
    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(
            @RequestBody CourseCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Course created", 
                courseService.createCourse(request)));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(
            @PathVariable Long id, @RequestBody CourseCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Course updated", 
                courseService.updateCourse(id, request)));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted", null));
    }
}
