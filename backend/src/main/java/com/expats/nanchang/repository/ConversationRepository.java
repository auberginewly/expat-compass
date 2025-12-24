package com.expats.nanchang.repository;

import com.expats.nanchang.domain.Conversation;
import com.expats.nanchang.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * 会话数据访问接口
 */
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    List<Conversation> findByUserOrderByUpdatedAtDesc(User user);
    
    /**
     * 根据用户删除所有会话
     */
    void deleteByUser(User user);
}

