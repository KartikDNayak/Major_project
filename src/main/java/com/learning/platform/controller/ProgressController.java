package com.learning.platform.controller;

import com.learning.platform.dto.ApiResponse;
import com.learning.platform.dto.ProgressDTO;
import com.learning.platform.dto.ProgressUpdateRequest;
import com.learning.platform.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProgressController {
    private final ProgressService progressService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProgressDTO>> updateProgress(
            @RequestBody ProgressUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Progress updated", 
                progressService.updateProgress(request)));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public ResponseEntity<ApiResponse<List<ProgressDTO>>> getProgress(
            @PathVariable Long enrollmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                progressService.getProgressByEnrollment(enrollmentId)));
    }

    @GetMapping("/enrollment/{enrollmentId}/percentage")
    public ResponseEntity<ApiResponse<Double>> getPercentage(
            @PathVariable Long enrollmentId) {
        return ResponseEntity.ok(ApiResponse.success(
                progressService.getProgressPercentage(enrollmentId)));
    }
}
