package com.Project.ScheduleTimeTable.service.Impl;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Project.ScheduleTimeTable.dto.request.ChangePasswordRequest;
import com.Project.ScheduleTimeTable.dto.request.LoginRequest;
import com.Project.ScheduleTimeTable.dto.request.RegisterRequest;
import com.Project.ScheduleTimeTable.dto.request.UpdateUserRequest;
import com.Project.ScheduleTimeTable.dto.response.LoginResponse;
import com.Project.ScheduleTimeTable.dto.response.UserResponse;
import com.Project.ScheduleTimeTable.enums.Role;
import com.Project.ScheduleTimeTable.enums.Status;
import com.Project.ScheduleTimeTable.exception.InvalidCredentialsException;
import com.Project.ScheduleTimeTable.exception.ResourceNotFoundException;
import com.Project.ScheduleTimeTable.exception.UnauthorizedException;
import com.Project.ScheduleTimeTable.exception.UserAlreadyExistsException;
import com.Project.ScheduleTimeTable.model.User;
import com.Project.ScheduleTimeTable.repository.UserRepository;
import com.Project.ScheduleTimeTable.security.JwtService;
import com.Project.ScheduleTimeTable.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public LoginResponse register(RegisterRequest request) {


        if(userRepository.existsByEmail(request.getEmail())){

            throw new UserAlreadyExistsException(
                    "Email already registered"
            );
        }


        User user = new User();


        user.setFullName(request.getFullName());

        user.setEmail(request.getEmail());


        user.setPassword(
               passwordEncoder.encode(request.getPassword())
        );


        user.setPhoneNumber(request.getPhoneNumber());


        user.setRole(
                request.getRole() != null
                        ? request.getRole()
                        : Role.STUDENT
        );


        user.setStatus(Status.ACTIVE);


        user.setCreatedAt(LocalDateTime.now());

        user.setUpdatedAt(LocalDateTime.now());


        User savedUser = userRepository.save(user);



        String token = jwtService.generateToken(
            savedUser.getEmail()
        );



        return LoginResponse.builder()

            .token(token)

            .email(savedUser.getEmail())

            .role(savedUser.getRole())

            .message("Registration successful")

            .build();

    }

    @Override
    public LoginResponse login(LoginRequest request) {


        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        )
                );


        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );


        } catch (Exception e) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );

        }



        String token = jwtService.generateToken(
                user.getEmail()
        );



        return LoginResponse.builder()

            .token(token)

            .email(user.getEmail())

            .role(user.getRole())

            .message("Login successful")

            .build();

    }

    @Override
    public UserResponse getUserById(Long id) {


        User user = userRepository.findById(id)

            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id
                    )
            );


            if(user.getStatus() == Status.INACTIVE){

                throw new UnauthorizedException(
                "User account is inactive"
            );

}
        return UserResponse.builder()

            .id(user.getId())

            .fullName(user.getFullName())

            .email(user.getEmail())

            .phoneNumber(user.getPhoneNumber())

            .role(user.getRole())

            .status(user.getStatus())

            .createdAt(user.getCreatedAt())

            .updatedAt(user.getUpdatedAt())

            .build();

    }

    @Override
    public List<UserResponse> getAllUsers() {


        List<User> users = userRepository.findAll();


        return users.stream()
            .map(user -> UserResponse.builder()

                    .id(user.getId())

                    .fullName(user.getFullName())

                    .email(user.getEmail())

                    .phoneNumber(user.getPhoneNumber())

                    .role(user.getRole())

                    .status(user.getStatus())

                    .createdAt(user.getCreatedAt())

                    .updatedAt(user.getUpdatedAt())

                    .build()
            )
            .toList();

    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {


        User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id
                    )
            );



        if(request.getFullName() != null) {

            user.setFullName(
                request.getFullName()
            );

        }



        if(request.getEmail() != null) {

            if(!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {

                throw new UserAlreadyExistsException(
                    "Email already registered"
            );
        }


        user.setEmail(
                request.getEmail()
        );

    }



        if(request.getPhoneNumber() != null) {
            user.setPhoneNumber(
                request.getPhoneNumber()
            );
        }



        if(request.getRole() != null) {

            user.setRole(
                request.getRole()
            );

        }



        if(request.getStatus() != null) {

            user.setStatus(
                request.getStatus()
            );

        }
        user.setUpdatedAt(
            LocalDateTime.now()
        );

        User updatedUser = userRepository.save(user);
        return UserResponse.builder()

            .id(updatedUser.getId())

            .fullName(updatedUser.getFullName())

            .email(updatedUser.getEmail())

            .phoneNumber(updatedUser.getPhoneNumber())

            .role(updatedUser.getRole())

            .status(updatedUser.getStatus())

            .build();

    }

    @Override
    public void deleteUser(Long id) {


        User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id
                    )
            );


        userRepository.delete(user);

    }

    @Override
    public void changePassword(Long id, ChangePasswordRequest request) {


        User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id
                    )
            );


    // Verify current password

        if(!passwordEncoder.matches(
            request.getCurrentPassword(),
            user.getPassword()
        )){

            throw new InvalidCredentialsException(
                "Current password is incorrect"
            );

        }

        

    // Set new encrypted password

        user.setPassword(
            passwordEncoder.encode(
                    request.getNewPassword()
            )
        );


        user.setUpdatedAt(
            LocalDateTime.now()
        );


        userRepository.save(user);

    }

    @Override
    public UserResponse getCurrentUser() {


        String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();


        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found"
                    )
            );


        return mapToUserResponse(user);

    }

    private UserResponse mapToUserResponse(User user){

        return UserResponse.builder()

            .id(user.getId())

            .fullName(user.getFullName())

            .email(user.getEmail())

            .phoneNumber(user.getPhoneNumber())

            .role(user.getRole())

            .status(user.getStatus())

            .createdAt(user.getCreatedAt())

            .updatedAt(user.getUpdatedAt())

            .build();
    }

    @Override
    public List<UserResponse> getUsersByRole(Role role) {


        List<User> users = userRepository.findByRole(role);


        return users.stream()
            .map(user -> new UserResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getRole(),
                    user.getStatus(),
                    user.getCreatedAt(),
                    user.getUpdatedAt()
            ))
            .toList();

    }

    @Override
    public void activateUser(Long id) {


        User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id
                    )
            );


        user.setStatus(Status.ACTIVE);

        user.setUpdatedAt(LocalDateTime.now());


        userRepository.save(user);

    }

    @Override
    public void deactivateUser(Long id) {


        User user = userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id
                    )
            );


        user.setStatus(Status.INACTIVE);

        user.setUpdatedAt(LocalDateTime.now());


        userRepository.save(user);

    }

    @Override
    public User findUserById(Long id) {

        return userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "User not found with id : " + id));
    }
    
}