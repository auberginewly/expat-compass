package com.expats.nanchang.core.ai.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "message_knowledge")
public class MessageKnowledge {

    @Id
    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @Id
    @ManyToOne
    @JoinColumn(name = "knowledge_id", nullable = false)
    private KnowledgeBase knowledge;

    @Column(precision = 5, scale = 4)
    private BigDecimal relevanceScore;

    protected MessageKnowledge() {
    }

    public MessageKnowledge(Message message, KnowledgeBase knowledge) {
        this.message = message;
        this.knowledge = knowledge;
    }

    public Message getMessage() {
        return message;
    }

    public KnowledgeBase getKnowledge() {
        return knowledge;
    }

    public BigDecimal getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(BigDecimal relevanceScore) {
        this.relevanceScore = relevanceScore;
    }
}

