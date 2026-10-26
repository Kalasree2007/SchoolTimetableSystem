package com.Project.ScheduleTimeTable.dto.request;


import com.Project.ScheduleTimeTable.enums.Role;
import com.Project.ScheduleTimeTable.enums.Status;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {



    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 50, message = "Full name must contain 3 to 50 characters")
    private String fullName;



    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Phone number must contain valid 10 digits"
    )
    private String phoneNumber;



    @NotBlank(message = "Email is required")
    @Email(
        message = "Enter a valid email address"
    )
    private String email;



    @NotNull(message = "Role is required")
    private Role role;



    @NotNull(message = "Status is required")
    private Status status;

}