package com.Project.ScheduleTimeTable.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.ScheduleTimeTable.enums.Role;
import com.Project.ScheduleTimeTable.enums.Status;
import com.Project.ScheduleTimeTable.model.User;

@Repository

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByRole(Role role);

    List<User> findByStatus(Status status);

}