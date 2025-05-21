package com.example.backend.service;

import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.mappers.CategoryMapper;
import com.example.backend.model.Category;
import com.example.backend.model.Expense;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository catRepo;

    @Autowired
    private CategoryMapper catMapper;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SecurityUtil securityUtil;

    private static final Map<String, String> DEFAULT_CATEGORIES = Map.of(
            "Food", "#111111",
            "Transport", "#222222",
            "Entertainment", "#333333",
            "Health", "#444444",
            "Utilities", "#555555"
    );

    public CategoryDto createCategory(CategoryRequest request) {
        User user = securityUtil.getUser();
        boolean exists = catRepo.existsByUserAndNameIgnoreCase(user, request.getName());
        if (exists) {
            throw new RuntimeException("Category already exists");
        }
        Category category = catMapper.requestToModel(request);
        category.setUser(user);
        Category savedCategory = catRepo.save(category);
        return catMapper.toDto(savedCategory);
    }

    public void createDefaultCategories(User user) {
        DEFAULT_CATEGORIES.forEach((name, colour) -> {
            Category category = new Category();
            category.setName(name);
            category.setColour(colour);
            category.setUser(user);
            catRepo.save(category);
        });
    }

    public List<CategoryDto> getUserCategories() {
        User user = securityUtil.getUser();
        List<Category> categories = catRepo.findAllByUser(user);
        return categories.stream()
                .map(catMapper::toDto)
                .toList();
    }

    public void deleteCategory(Integer categoryId) {
        User user = securityUtil.getUser();
        Category category = catRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (!category.getUser().equals(user)) {
            throw new RuntimeException("You do not have permission to delete this category");
        }
        catRepo.delete(category);
    }

    public CategoryDto updateCategory(Integer categoryId, CategoryRequest request) {
        User user = securityUtil.getUser();
        Category category = catRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (!category.getUser().equals(user)) {
            throw new RuntimeException("You do not have permission to update this category");
        }
        catMapper.updateModelFromRequest(request, category);
        Category savedCat = catRepo.save(category);
        return catMapper.toDto(savedCat);
    }
}
