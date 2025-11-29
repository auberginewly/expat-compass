package com.expats.nanchang.core.identity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Short id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> nameI18n;

    protected Role() {
    }

    public Role(String code, Map<String, String> nameI18n) {
        this.code = code;
        this.nameI18n = nameI18n;
    }

    public Short getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public Map<String, String> getNameI18n() {
        return nameI18n;
    }
}

