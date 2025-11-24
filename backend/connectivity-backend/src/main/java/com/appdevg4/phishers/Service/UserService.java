    package com.appdevg4.phishers.Service;

    import org.springframework.stereotype.Service;
    import org.springframework.beans.factory.annotation.Autowired;
    import com.appdevg4.phishers.Repository.UserRepository;
    import com.appdevg4.phishers.Entity.UserEntity;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

    import java.util.Optional;
    import java.util.List;

    @Service
    public class UserService {

        @Autowired
        private UserRepository userRepository;

        private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // --- Registration ---
        public UserEntity registerUser(String fname, String lname, String email, String password) throws Exception {
            if (userRepository.findByEmail(email).isPresent()) {
                throw new Exception("Email already in use");
            }

            // Hash the password before saving
            String hashedPassword = passwordEncoder.encode(password);
            UserEntity newUser = new UserEntity(fname, lname, email, hashedPassword);
            return userRepository.save(newUser);
        }

        // --- Login ---
        public UserEntity loginUser(String email, String password) {
            UserEntity user = userRepository.findByEmail(email).orElse(null);
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
            return null; // login failed
        }

        // --- Fetch single user by email ---
        public Optional<UserEntity> getUserByEmail(String email) {
            return userRepository.findByEmail(email);
        }

        // --- Fetch all users ---
        public List<UserEntity> getAllUsers() {
            return userRepository.findAll();
        }
    }
