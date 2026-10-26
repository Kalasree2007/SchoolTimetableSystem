package com.Project.ScheduleTimeTable.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String admissionNumber;

    @Column(nullable = false)
    private LocalDate admissionDate;

    @Column(nullable = false)
    private String rollNumber;

    @Column(nullable = false)
    private String semester;

    @Column(nullable = false)
    private boolean active = true;

    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonBackReference(value = "user-student")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="class_id",nullable = false)
    @JsonBackReference(value = "class-student")
    private ClassEntity classEntity;

    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "student")
    @JsonManagedReference(value = "student-parent")
    private Parent parent;

    @PrePersist
    public void onCreate(){

        createdAt=LocalDateTime.now();
        updatedAt=LocalDateTime.now();

    }

    @PreUpdate
    public void onUpdate(){

        updatedAt=LocalDateTime.now();

    }

}