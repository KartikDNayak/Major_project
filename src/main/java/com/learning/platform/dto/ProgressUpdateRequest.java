package com.learning.platform.dto;

import lombok.Data;

@Data
public class ProgressUpdateRequest {
    private Long enrollmentId;
    private Long lessonId;
    private Boolean completed;
}
