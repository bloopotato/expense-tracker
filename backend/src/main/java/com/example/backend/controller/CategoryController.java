package com.example.backend.controller;

import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.model.Category;
import com.example.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService catService;

    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest request) {
        try {
            CategoryDto createdCategory = catService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{category_id}")
    public ResponseEntity<?> deleteCategory(@PathVariable ("category_id") Integer categoryId) {
        try {
            catService.deleteCategory(categoryId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Collections.singletonMap("message", "Category deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/{category_id}")
    public ResponseEntity<?> updateCategory(@PathVariable ("category_id") Integer categoryId, @RequestBody CategoryRequest request) {
        try {
            CategoryDto updatedCategory = catService.updateCategory(categoryId, request);
            return ResponseEntity.ok(updatedCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping()
    public ResponseEntity<List<CategoryDto>> getUserCategories() {
        List<CategoryDto> categories = catService.getUserCategories();
        return ResponseEntity.ok(categories);
    }
}
