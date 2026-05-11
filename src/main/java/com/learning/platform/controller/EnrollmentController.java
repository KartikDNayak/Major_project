package com.learning.platform.controller;

import com.learning.platform.dto.ApiResponse;
import com.learning.platform.dto.EnrollmentDTO;
import com.learning.platform.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<EnrollmentDTO>> enroll(
            @RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        Long courseId = request.get("courseId");
        return ResponseEntity.ok(ApiResponse.success("Enrolled successfully", 
                enrollmentService.enrollUser(userId, courseId)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> getUserEnrollments(
            @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getUserEnrollments(userId)));
    }

    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<ApiResponse<EnrollmentDTO>> getEnrollment(
            @PathVariable Long userId, @PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollment(userId, courseId)));
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkEnrollment(
            @RequestParam Long userId, @RequestParam Long courseId) {
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.isEnrolled(userId, courseId)));
    }

    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<ApiResponse<String>> dropEnrollment(@PathVariable Long enrollmentId) {
        enrollmentService.dropEnrollment(enrollmentId);
        return ResponseEntity.ok(ApiResponse.success("Enrollment dropped", null));
    }
}
