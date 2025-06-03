package com.example.backend.controller;

import com.example.backend.dto.TransactionDto;
import com.example.backend.dto.TransactionRequest;
import com.example.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Create a new transaction
    @PostMapping("/create")
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody TransactionRequest request) {
        TransactionDto createdTransaction = transactionService.createTransaction(request);
        return ResponseEntity.ok(createdTransaction);
    }

    // Get all transactions for a user
    @GetMapping()
    public ResponseEntity<List<TransactionDto>> getUserTransactions() {
        List<TransactionDto> transactions = transactionService.getUserTransactions();
        return ResponseEntity.ok(transactions);
    }

    // Delete transaction by ID
    @DeleteMapping("/{transaction_id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable ("transaction_id") Long transactionId) {
        try {
            transactionService.deleteTransaction(transactionId);
            return ResponseEntity.ok("transaction deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting transaction: " + e.getMessage());
        }
    }

    // Update transaction by ID
    @PutMapping("/{transaction_id}")
    public ResponseEntity<?> updateTransaction(@PathVariable ("transaction_id") Long transactionId, @RequestBody TransactionRequest request) {
        try {
            TransactionDto updatedTransaction = transactionService.updateTransaction(transactionId, request);
            return ResponseEntity.ok(updatedTransaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating transaction: " + e.getMessage());
        }
    }

    // Group transactions by date
    @GetMapping("/group")
    public Map<String, Map<LocalDate, List<TransactionDto>>> groupTransactionsByDate() {
        List<TransactionDto> allTransactions = new ArrayList<>(transactionService.getUserTransactions());

        // Use user's local timezone (should be dynamic)
        ZoneId utcZone = ZoneOffset.UTC;
        ZoneId userZone = ZoneId.of("Asia/Singapore");

        // Sort by DATE and TIME
        allTransactions.sort(
                Comparator
                        .comparing((TransactionDto tx) -> tx.getDate().atZone(utcZone).withZoneSameInstant(userZone).toLocalDate()).reversed()
                        .thenComparing(tx -> tx.getDate().atZone(utcZone).withZoneSameInstant(userZone), Comparator.reverseOrder())
        );

        // Group by MONTH then DATE
        return allTransactions.stream()
                .collect(Collectors.groupingBy(
                        tx -> {
                            LocalDate localDate = tx.getDate()
                                    .atZone(utcZone)
                                    .withZoneSameInstant(userZone)
                                    .toLocalDate();
                            return String.format("%d-%02d", localDate.getYear(), localDate.getMonthValue());
                        },
                        LinkedHashMap::new,
                        Collectors.groupingBy(
                                tx -> tx.getDate()
                                        .atZone(utcZone)
                                        .withZoneSameInstant(userZone)
                                        .toLocalDate(),
                                LinkedHashMap::new,
                                Collectors.toList()
                        )
                ));
    }

}
