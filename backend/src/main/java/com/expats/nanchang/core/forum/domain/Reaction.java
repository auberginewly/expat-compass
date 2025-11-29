package com.expats.nanchang.core.forum.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.expats.nanchang.core.identity.domain.User;

import java.time.OffsetDateTime;

@Entity
@Table(name = "forum_reactions", uniqueConstraints = {
    @jakarta.persistence.UniqueConstraint(
        columnNames = {"user_id", "target_type", "target_id", "reaction_type"}
    )
})
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String targetType; // post, comment

    @Column(nullable = false)
    private Long targetId;

    @Column(nullable = false, length = 20)
    private String reactionType; // like, bookmark

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    protected Reaction() {
    }

    public Reaction(User user, String targetType, Long targetId, String reactionType) {
        this.user = user;
        this.targetType = targetType;
        this.targetId = targetId;
        this.reactionType = reactionType;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTargetType() {
        return targetType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public String getReactionType() {
        return reactionType;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}

