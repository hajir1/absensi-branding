package com.absensi.absensiv2.repositories;

import com.absensi.absensiv2.models.Absensi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AbsensiRepository extends JpaRepository<Absensi, Integer> {

    List<Absensi> findByUserId(Integer userId);

    Page<Absensi> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Absensi> findByUser_UsernameContainingIgnoreCase(
            String username,
            Pageable pageable
    );

    Page<Absensi> findByUser_IdAndUser_UsernameContainingIgnoreCase(
            Integer userId,
            String username,
            Pageable pageable
    );
    Page<Absensi> findByUserIdOrderByCreatedAtDesc(
            Integer userId,
            Pageable pageable
    );
    Page<Absensi> findByUser_Mentor_IdAndUser_UsernameContainingIgnoreCase(Integer mentorId,
                                                           String username,
                                                           Pageable pageable);
    Page<Absensi> findByUser_Mentor_IdOrderByCreatedAtDesc(
            Integer mentorId,
            Pageable pageable
    );
    Page<Absensi> findByIsPrivateAndUser_UsernameContainingIgnoreCase(
            Boolean n,String username,
            Pageable pageable
    );
    Page<Absensi> findByIsPrivateOrderByCreatedAtDesc(
            Boolean n,
            Pageable pageable
    );

    List<Absensi> findByUser_Mentor_IdAndUser_UsernameContainingIgnoreCase(Integer mentorId,
                                                                           String username
                                                                           );
    List<Absensi> findByUser_Mentor_IdOrderByCreatedAtDesc(
            Integer mentorId
    );

    //    @Query("""
//        DELIMITER $$
//
//        CREATE PROCEDURE find_absensi_by_mentor_and_username (
//            IN p_mentor_id INT,
//            IN p_username VARCHAR(255)
//        )
//        BEGIN
//            SELECT a.*
//            FROM absensi a
//            JOIN users u ON a.user_id = u.id
//            JOIN mentors m ON u.mentor_id = m.id
//            WHERE m.id = p_mentor_id
//              AND LOWER(u.username) LIKE LOWER(CONCAT('%', p_username, '%'));
//        END $$
//
//        DELIMITER ;
//    """)
    @Query("""
        SELECT a FROM Absensi a
        WHERE a.user.mentor.id = :mentorId
        AND (
            (:start IS NULL OR :end IS NULL)
            OR a.createdAt BETWEEN :start AND :end
        )
        AND (
            :search IS NULL OR :search = '' OR
            LOWER(a.user.username) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        ORDER BY a.createdAt DESC
        """)
            List<Absensi> findByMentorMonthAndSearch(
                    @Param("mentorId") Integer mentorId,
                    @Param("start") LocalDateTime start,
                    @Param("end") LocalDateTime end,
                    @Param("search") String search
            );
}