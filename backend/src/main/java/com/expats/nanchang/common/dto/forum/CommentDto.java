package com.expats.nanchang.common.dto.forum;

import com.expats.nanchang.core.forum.domain.Comment;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * 评论DTO
 * 用于API响应，避免实体序列化问题
 */
public record CommentDto(
        Long id,
        AuthorDto author,
        String content,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        Long parentId,
        List<CommentDto> replies  // 回复列表
) {
    public static CommentDto from(Comment comment) {
        // 安全地获取作者信息
        AuthorDto authorDto = null;
        try {
            if (comment.getAuthor() != null) {
                authorDto = AuthorDto.from(comment.getAuthor());
            }
        } catch (Exception e) {
            // 如果无法访问作者，创建一个默认的AuthorDto
            authorDto = new AuthorDto(null, "未知用户", null);
        }

        // 安全地获取父评论ID
        Long parentId = null;
        try {
            if (comment.getParent() != null) {
                parentId = comment.getParent().getId();
            }
        } catch (Exception e) {
            // 忽略
        }

        return new CommentDto(
                comment.getId(),
                authorDto,
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                parentId,
                null  // 回复列表由服务层填充
        );
    }

    public record AuthorDto(
            Long id,
            String displayName,
            String avatarUrl
    ) {
        public static AuthorDto from(com.expats.nanchang.core.identity.domain.User user) {
            return new AuthorDto(
                    user.getId(),
                    user.getDisplayName() != null ? user.getDisplayName() : user.getEmail().split("@")[0],
                    user.getAvatarUrl()
            );
        }
    }
}

