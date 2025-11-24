package com.appdevg4.phishers.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")   // maps root URL
    public String home() {
        return "Backend is working!";
    }

    @GetMapping("/hello")  // optional extra test endpoint
    public String hello() {
        return "Hello from Spring Boot!";
    }
}
