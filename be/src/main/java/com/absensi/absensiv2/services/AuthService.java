package com.absensi.absensiv2.services;

import com.absensi.absensiv2.dtos.*;
import io.github.bucket4j.Bucket;

public interface AuthService {
    WebResponse<UserResponse> registerUser(RegisterRequest req);
    TokenResponse login(LoginRequest req);
    Bucket resolveBucket(String ip);
}
