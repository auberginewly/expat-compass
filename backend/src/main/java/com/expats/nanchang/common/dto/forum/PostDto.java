package com.expats.nanchang.common.dto.forum;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * 帖子DTO
 */
public record PostDto(
        Long id,
        AuthorDto author,
        String title,
        String content,
        List<String> tags,
        List<String> images,
        String status,
        Integer viewCount,
        Integer likeCount,
        Integer commentCount,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        OffsetDateTime lastActivityAt
) {
    public record AuthorDto(
            Long id,
            String email,
            String displayName,
            String avatarUrl
    ) {
    }
}

