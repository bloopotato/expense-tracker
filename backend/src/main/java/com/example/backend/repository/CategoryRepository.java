package com.example.backend.repository;

import com.example.backend.model.Category;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findAllByUser(User user);

    boolean existsByUserAndNameIgnoreCase(User user, String name);

    Optional<Category> findByUserAndNameIgnoreCase(User user, String name);
}
