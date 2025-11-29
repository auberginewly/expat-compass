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
@Table(name = "forum_reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false, length = 20)
    private String targetType; // post, comment

    @Column(nullable = false)
    private Long targetId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false, length = 20)
    private String status = "pending";

    @ManyToOne
    @JoinColumn(name = "handled_by")
    private User handledBy;

    @Column
    private OffsetDateTime handledAt;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    protected Report() {
    }

    public Report(User reporter, String targetType, Long targetId, String reason) {
        this.reporter = reporter;
        this.targetType = targetType;
        this.targetId = targetId;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public User getReporter() {
        return reporter;
    }

    public String getTargetType() {
        return targetType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public String getReason() {
        return reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(User handledBy) {
        this.handledBy = handledBy;
    }

    public OffsetDateTime getHandledAt() {
        return handledAt;
    }

    public void setHandledAt(OffsetDateTime handledAt) {
        this.handledAt = handledAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}

