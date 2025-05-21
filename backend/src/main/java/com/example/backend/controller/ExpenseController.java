package com.example.backend.controller;

import com.example.backend.dto.ExpenseDto;
import com.example.backend.dto.ExpenseRequest;
import com.example.backend.model.Expense;
import com.example.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // Create a new expense
    @PostMapping("/create")
    public ResponseEntity<ExpenseDto> createExpense(@RequestBody ExpenseRequest request) {
        ExpenseDto createdExpense = expenseService.createExpense(request);
        return ResponseEntity.ok(createdExpense);
    }

    // Get all expenses for a user
    @GetMapping()
    public ResponseEntity<List<ExpenseDto>> getUserExpenses() {
        List<ExpenseDto> expenses = expenseService.getUserExpenses();
        return ResponseEntity.ok(expenses);
    }

    // Delete expense by ID
    @DeleteMapping("/{expense_id}")
    public ResponseEntity<?> deleteExpense(@PathVariable ("expense_id") Long expenseId) {
        try {
            expenseService.deleteExpense(expenseId);
            return ResponseEntity.ok("Expense deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting expense: " + e.getMessage());
        }
    }

    // Update expense by ID
    @PutMapping("/{expense_id}")
    public ResponseEntity<?> updateExpense(@PathVariable ("expense_id") Long expenseId, @RequestBody ExpenseRequest request) {
        try {
            ExpenseDto updatedExpense = expenseService.updateExpense(expenseId, request);
            return ResponseEntity.ok(updatedExpense);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating expense: " + e.getMessage());
        }
    }
}
