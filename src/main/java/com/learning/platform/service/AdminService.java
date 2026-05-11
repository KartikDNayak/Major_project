package com.learning.platform.service;

import com.learning.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalEnrollments", enrollmentRepository.count());
        stats.put("categories", courseRepository.findAllCategories());
        return stats;
    }
}
