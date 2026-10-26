package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.Parent;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Long> {

    Optional<Parent> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

}