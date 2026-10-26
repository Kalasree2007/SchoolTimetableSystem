package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.ClassEntity;

@Repository
public interface ClassEntityRepository extends JpaRepository<ClassEntity, Long> {

    Optional<ClassEntity> findByClassCode(String classCode);

    boolean existsByClassCode(String classCode);

}