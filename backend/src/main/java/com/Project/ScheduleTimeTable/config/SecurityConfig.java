// package com.Project.ScheduleTimeTable.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import com.Project.ScheduleTimeTable.security.CustomUserDetailsService;
// import com.Project.ScheduleTimeTable.security.JwtAuthenticationFilter;

// @Configuration
// @EnableMethodSecurity
// public class SecurityConfig {

//     private final CustomUserDetailsService customUserDetailsService;
//     private final PasswordEncoder passwordEncoder;
//     private final JwtAuthenticationFilter jwtAuthenticationFilter;

//     public SecurityConfig(
//             CustomUserDetailsService customUserDetailsService,
//             PasswordEncoder passwordEncoder,
//             JwtAuthenticationFilter jwtAuthenticationFilter) {

//         this.customUserDetailsService = customUserDetailsService;
//         this.passwordEncoder = passwordEncoder;
//         this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//     }

//     @Bean
//     public DaoAuthenticationProvider authenticationProvider() {

//         DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//         provider.setUserDetailsService(customUserDetailsService);
//         provider.setPasswordEncoder(passwordEncoder);

//         return provider;
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(
//             AuthenticationConfiguration configuration) throws Exception {

//         return configuration.getAuthenticationManager();
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

//     http
//         .csrf(csrf -> csrf.disable())

//         .sessionManagement(session ->
//             session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//         )

//         .authenticationProvider(authenticationProvider())

//         .addFilterBefore(
//             jwtAuthenticationFilter,
//             UsernamePasswordAuthenticationFilter.class
//         )

//         .authorizeHttpRequests(auth -> auth

//             .requestMatchers(
//                 "/swagger-ui/**",
//                 "/swagger-ui.html",
//                 "/api-docs/**"
//             ).permitAll()

//             .requestMatchers("/api/auth/**")
//             .permitAll()

//             .requestMatchers("/api/admin/**")
//             .hasRole("ADMIN")

//             .requestMatchers("/api/teacher/**")
//             .hasRole("TEACHER")

//             .requestMatchers("/api/student/**")
//             .hasRole("STUDENT")

//             .requestMatchers("/api/parent/**")
//             .hasRole("PARENT")

//             .anyRequest()
//             .authenticated()
//         );

//         return http.build();
//     }
// }


package com.Project.ScheduleTimeTable.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.Project.ScheduleTimeTable.security.CustomUserDetailsService;
import com.Project.ScheduleTimeTable.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            CustomUserDetailsService customUserDetailsService,
            PasswordEncoder passwordEncoder,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.customUserDetailsService = customUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // ================= AUTHENTICATION PROVIDER =================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    // ================= AUTHENTICATION MANAGER =================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    // ================= CORS =================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // ================= SECURITY =================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // Enable CORS
            .cors(cors -> cors.configurationSource(
                    corsConfigurationSource()
            ))

            // Disable CSRF for JWT REST API
            .csrf(csrf -> csrf.disable())

            // JWT = stateless
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authenticationProvider(
                    authenticationProvider()
            )

            // JWT filter
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            )

            // ================= AUTHORIZATION =================

            .authorizeHttpRequests(auth -> auth

                // IMPORTANT: allow browser preflight
                .requestMatchers(
                        org.springframework.http.HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()

                // Swagger
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/api-docs/**"
                ).permitAll()

                // Authentication
                .requestMatchers(
                        "/api/auth/**"
                ).permitAll()

                // Admin
                .requestMatchers(
                        "/api/admin/**"
                ).hasRole("ADMIN")

                // Teacher
                .requestMatchers(
                        "/api/teacher/**"
                ).hasRole("TEACHER")

                // Student
                .requestMatchers(
                        "/api/student/**"
                ).hasRole("STUDENT")

                // Parent
                .requestMatchers(
                        "/api/parent/**"
                ).hasRole("PARENT")

                // Everything else requires authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }
}