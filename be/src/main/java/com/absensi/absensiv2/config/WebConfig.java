package com.absensi.absensiv2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/profile/**")
                .addResourceLocations("file:///D:/all-tugas/basdat-smt2/upload-img/profile/");

        registry.addResourceHandler("/absensi/**")
                .addResourceLocations("file:///D:/all-tugas/basdat-smt2/upload-img/absensi/");
    }
}