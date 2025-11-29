package com.expats.nanchang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.expats.nanchang")
@EntityScan(basePackages = "com.expats.nanchang.core")
@EnableJpaRepositories(basePackages = "com.expats.nanchang.infrastructure")
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}

