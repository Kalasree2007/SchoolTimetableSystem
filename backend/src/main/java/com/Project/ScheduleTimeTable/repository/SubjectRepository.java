package com.Project.ScheduleTimeTable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.model.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findBySubjectCode(String subjectCode);

    Optional<Subject> findBySubjectName(String subjectName);

    boolean existsBySubjectCode(String subjectCode);

    boolean existsBySubjectName(String subjectName);

}