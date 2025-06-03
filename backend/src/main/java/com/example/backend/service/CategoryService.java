package com.example.backend.service;

import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.mappers.CategoryMapper;
import com.example.backend.model.Category;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.SecurityUtil;
import com.example.backend.util.TransactionType;
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

    private static final Map<String, List<String>> DEFAULT_CATEGORIES = Map.of(
            "Food", List.of("#eaad34", "EXPENSE"),
            "Transport", List.of("#d35c54", "EXPENSE"),
            "Entertainment", List.of("#6d9ff3", "EXPENSE"),
            "Health", List.of("#7750c1", "EXPENSE"),
            "Utilities", List.of("#83bc6b", "EXPENSE"),
            "Income", List.of("#9941bb", "INCOME")
    );

    public CategoryDto createCategory(CategoryRequest request) {
        User user = securityUtil.getUser();
        boolean exists = catRepo.existsByUserAndNameIgnoreCase(user, request.getName());
        if (exists) {
            throw new RuntimeException("Category already exists");
        }
        request.setType(request.getType().toUpperCase());   // Auto capitalise to fit enum
        Category category = catMapper.requestToModel(request);
        category.setUser(user);
        Category savedCategory = catRepo.save(category);
        return catMapper.toDto(savedCategory);
    }

    public void createDefaultCategories(User user) {
        DEFAULT_CATEGORIES.forEach((name, list) -> {
            Category category = new Category();
            category.setName(name);
            category.setColour(list.get(0));
            category.setType(TransactionType.valueOf(list.get(1).toUpperCase()));
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
        request.setType(request.getType().toUpperCase());   // Auto capitalise to fit enum
        catMapper.updateModelFromRequest(request, category);
        Category savedCat = catRepo.save(category);
        return catMapper.toDto(savedCat);
    }
}
