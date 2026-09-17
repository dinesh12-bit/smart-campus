package com.smartcampus.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomCode;

    @Column(nullable = false)
    private String name;

    private String building;

    private Integer floor;

    @Enumerated(EnumType.STRING)
    private DataSource dataSource;
}