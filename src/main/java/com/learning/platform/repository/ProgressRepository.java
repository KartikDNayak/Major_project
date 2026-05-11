package com.learning.platform.repository;

import com.learning.platform.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByEnrollmentId(Long enrollmentId);

    Optional<Progress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.enrollment.id = :enrollmentId AND p.completed = true")
    Long countCompletedByEnrollmentId(@Param("enrollmentId") Long enrollmentId);
}
