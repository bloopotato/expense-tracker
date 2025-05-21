package com.example.backend.service;

import com.example.backend.dto.ExpenseDto;
import com.example.backend.dto.ExpenseRequest;
import com.example.backend.mappers.ExpenseMapper;
import com.example.backend.model.Category;
import com.example.backend.model.Expense;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private CategoryRepository catRepo;

    @Autowired
    private ExpenseRepository expenseRepo;

    @Autowired
    private ExpenseMapper expenseMapper;

    @Autowired
    private SecurityUtil securityUtil;

    public ExpenseDto createExpense(ExpenseRequest request) {
        User user = securityUtil.getUser();
        Category category = catRepo.findByUserAndNameIgnoreCase(user, request.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Expense expense = expenseMapper.requestToModel(request);
        expense.setUser(user);
        expense.setCategory(category);
        Expense savedExpense = expenseRepo.save(expense);
        return expenseMapper.toDto(savedExpense);
    }

    public List<ExpenseDto> getUserExpenses() {
        User user = securityUtil.getUser();
        List<Expense> expenses =  expenseRepo.findAllByUser(user);
        return expenses.stream()
                .map(expenseMapper::toDto)
                .toList();
    }

    public void deleteExpense(Long expenseId) {
        User user = securityUtil.getUser();
        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().equals(user)) {
            throw new RuntimeException("You do not have permission to delete this expense");
        }
        expenseRepo.delete(expense);
    }

    public ExpenseDto updateExpense(Long expenseId, ExpenseRequest request) {
        User user = securityUtil.getUser();
        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        if (!expense.getUser().equals(user)) {
            throw new RuntimeException("You do not have permission to update this expense");
        }
        if (request.getCategoryName() != null) {
            Category category = catRepo.findByUserAndNameIgnoreCase(user, request.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            expense.setCategory(category);
        }
        expenseMapper.updateModelFromRequest(request, expense);
        Expense updatedExpense = expenseRepo.save(expense);
        return expenseMapper.toDto(updatedExpense);
    }
}
