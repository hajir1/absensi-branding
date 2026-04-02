package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.AbsensiResponse;
import com.absensi.absensiv2.dtos.UserRequest;
import com.absensi.absensiv2.dtos.UserResponse;
import com.absensi.absensiv2.dtos.WebResponse;
import com.absensi.absensiv2.models.Absensi;
import com.absensi.absensiv2.models.Divisi;
import com.absensi.absensiv2.models.Role;
import com.absensi.absensiv2.models.User;
import com.absensi.absensiv2.repositories.DivisiRepository;
import com.absensi.absensiv2.repositories.RoleRepository;
import com.absensi.absensiv2.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final DivisiRepository divisiRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public WebResponse<UserResponse> createUser(UserRequest req, MultipartFile foto) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email Sudah Ada");
        }

        User user = new User();
        user.setIsVerify(false);
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setNim(req.getNim());
        if(req.getMentorId() != null){
            User mentor = userRepository.findById(req.getMentorId())
                .orElseThrow(() -> new RuntimeException("Nama Mentor Tidak Ditemukan"));
            user.setMentor(mentor);
        }
        if(req.getRoleId() != null){
            Role role = roleRepository.findById(req.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Nama Role Tidak Ditemukan"));
            user.setRole(role);
        }
        if(req.getDivisiId() != null){
            Divisi divisi = divisiRepository.findById(req.getDivisiId())
                    .orElseThrow(() -> new RuntimeException("Nama Role Tidak Ditemukan"));
            user.setDivisi(divisi);    // ✅ FIX
        }
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        if (foto != null && !foto.isEmpty()) {
            try {
                String uploadDir = "D:/all-tugas/basdat-smt2/upload-img/profile/";
                new File(uploadDir).mkdirs();

                String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                foto.transferTo(new File(uploadDir + fileName));

                user.setFoto(fileName); // simpan nama/path di DB

            } catch (IOException e) {
                e.printStackTrace(); // atau pakai logger
                throw new RuntimeException("Upload gagal: " + e.getMessage());
            }
        }
        User saved = userRepository.save(user);

        UserResponse response = mapToResponse(saved);

        return WebResponse.<UserResponse>builder()
                .data(response)
                .build();
    }
    @Override
    public WebResponse<UserResponse> getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Email Not Found"));

        UserResponse response = mapToResponse(user);

        return WebResponse.<UserResponse>builder()
                .data(response)
                .errors(null)
                .build();
    }

    @Override
    public List<UserResponse> getUserByRole(String name) {

        roleRepository.findByNama(name)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return userRepository.findByRole_Nama(name)   // ⭐ PAKAI ENTITY
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public WebResponse<UserResponse> updateUser(UserRequest req, MultipartFile foto, String userId) {
        User existingUser = userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));
        if(req.getUsername() != null){
            existingUser.setUsername(req.getUsername());
        }
        if(req.getNim() != null){
            existingUser.setNim(req.getNim());
        }

        if(req.getRoleId() != null){
            Role role = roleRepository.findById(req.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            existingUser.setRole(role);

        }
        if(req.getDivisiId() != null){
            Divisi divisi = divisiRepository.findById(req.getDivisiId())
                    .orElseThrow(() -> new RuntimeException("Divisi not found"));
            existingUser.setDivisi(divisi);

        }



        if(req.getMentorId() != null && req.getMentorId() != 0){
            User mentor = userRepository.findById(req.getMentorId())
                    .orElseThrow(() -> new RuntimeException("Nama Mentor Tidak Ditemukan"));
            existingUser.setMentor(mentor);
        }
        if(req.getPassword() != null && !req.getPassword().isEmpty()){
            existingUser.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        if (foto != null && !foto.isEmpty()) {
            try {
                String uploadDir = "D:/all-tugas/basdat-smt2/upload-img/profile/";
                new File(uploadDir).mkdirs();

                // 1. Hapus foto lama
                if (existingUser.getFoto() != null) {
                    File oldFile = new File(uploadDir + existingUser.getFoto());
                    if (oldFile.exists()) {
                        oldFile.delete(); // hapus file lama
                    }
                }

                // 2. Simpan foto baru
                String fileName = System.currentTimeMillis() + "_" + foto.getOriginalFilename();
                foto.transferTo(new File(uploadDir + fileName));

                // 3. Update existingUser
                existingUser.setFoto(fileName);

            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Upload gagal: " + e.getMessage());
            }
        }
        User updatedUser = userRepository.save(existingUser);

        UserResponse response = mapToResponse(updatedUser);

        return WebResponse.<UserResponse>builder()
                .data(response)
                .errors(null)
                .build();
    }

    @Override
    public void deleteUser(String userId) {

        User existingUser = userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));

        if (existingUser.getFoto() != null) {
            try {
                String uploadDir = "D:/all-tugas/basdat-smt2/upload-img/profile/";
                new File(uploadDir).mkdirs();

                File oldFile = new File(uploadDir + existingUser.getFoto());
                    if (oldFile.exists()) {
                        oldFile.delete(); // hapus file lama
                    }

            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(e.getMessage());
            }
        }
        if(existingUser.getIsVerify() == true){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User Terverifikasi Tidak Bisa Dihapus");
        }else{
            userRepository.delete(existingUser);
        }
    }

    @Override
    public WebResponse<UserResponse> getUserById(String userId) {
        User user = userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Id Not Found"));

        UserResponse response = mapToResponse(user);

        return WebResponse.<UserResponse>builder()
                .data(response)
                .errors(null)
                .build();

    }

    @Override
    public Page<UserResponse> getAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);

        Page<User> userPage;

        if (search != null && !search.isBlank()) {
            userPage =
                    userRepository
                            .findByUsernameContainingIgnoreCase(
                                    search,
                                    pageable
                            );
        } else {
            userPage =
                    userRepository
                            .findAllByOrderByCreatedAtDesc(pageable);
        }

        return userPage.map(this::mapToResponse);
    }

    private UserResponse mapToResponse(User user) {
        Role role = user.getRole();
        Divisi divisi = user.getDivisi();
        User mentor = user.getMentor();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .roleId(
                        Optional.ofNullable(role)
                                .map(Role::getId)
                                .orElse(null)
                )
                .roleName(
                        Optional.ofNullable(role)
                                .map(Role::getNama)
                                .orElse(null)
                )
                .divisiId(divisi != null ? divisi.getId() : null)
                .divisiName(divisi != null ? divisi.getNama() : "null")
                .mentorId(mentor != null ? mentor.getId() : null)
                .mentorName(mentor != null ? mentor.getUsername() : "null")
                .nim(user.getNim())
                .isVerify(String.valueOf(user.getIsVerify()))
                .foto(user.getFoto())
                .email(user.getEmail())
                .created_at(user.getCreatedAt())
                .updated_at(user.getUpdatedAt())
                .build();
    }
}
