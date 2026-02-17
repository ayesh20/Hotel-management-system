package com.nsbm.group_04.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 1. Allow ALL endpoints in this app
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000") // 2. Allow React (Vite usually uses 5173)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 3. Allow these actions
                        .allowedHeaders("*") // 4. Allow all headers
                        .allowCredentials(true);
            }
        };
    }
}