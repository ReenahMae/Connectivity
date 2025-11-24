package com.appdevg4.phishers.Entity;
import jakarta.persistence.*;

@Entity
@Table(name = "users")

public class UserEntity {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;

}
