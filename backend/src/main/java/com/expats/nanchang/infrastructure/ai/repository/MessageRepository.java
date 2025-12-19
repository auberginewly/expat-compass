package com.expats.nanchang.infrastructure.ai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expats.nanchang.core.ai.domain.Conversation;
import com.expats.nanchang.core.ai.domain.Message;

/**
 * 消息数据访问接口
 */
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
}

