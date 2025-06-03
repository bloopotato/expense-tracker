package com.example.backend.service;

import com.example.backend.dto.TransactionDto;
import com.example.backend.dto.TransactionRequest;
import com.example.backend.mappers.TransactionMapper;
import com.example.backend.model.Category;
import com.example.backend.model.Transaction;
import com.example.backend.model.User;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private CategoryRepository catRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private TransactionMapper transactionMapper;

    @Autowired
    private SecurityUtil securityUtil;

    public TransactionDto createTransaction(TransactionRequest request) {
        User user = securityUtil.getUser();
        Category category = catRepo.findByUserAndNameIgnoreCase(user, request.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Transaction transaction = transactionMapper.requestToModel(request);
        transaction.setUser(user);
        transaction.setCategory(category);
        category.setCount(category.getCount() + 1); // Increment category
        catRepo.save(category);
        Transaction savedTransaction = transactionRepo.save(transaction);
        return transactionMapper.toDto(savedTransaction);
    }

    public List<TransactionDto> getUserTransactions() {
        User user = securityUtil.getUser();
        List<Transaction> transaction =  transactionRepo.findAllByUser(user);
        return transaction.stream()
                .map(transactionMapper::toDto)
                .toList();
    }

    public void deleteTransaction(Long transactionId) {
        User user = securityUtil.getUser();
        Transaction transaction = transactionRepo.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().equals(user)) {
            throw new RuntimeException("You do not have permission to delete this transaction");
        }
        Category category = transaction.getCategory();
        category.setCount(category.getCount() - 1); // Decrement category
        catRepo.save(category);
        transactionRepo.delete(transaction);
    }

    public TransactionDto updateTransaction(Long transactionId, TransactionRequest request) {
        User user = securityUtil.getUser();
        Transaction transaction = transactionRepo.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().equals(user)) {
            throw new RuntimeException("You do not have permission to update this transaction");
        }
        if (request.getCategoryName() != null) {
            Category category = catRepo.findByUserAndNameIgnoreCase(user, request.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            // Decrement from original
            transaction.getCategory().setCount(transaction.getCategory().getCount() - 1);
            transaction.setCategory(category);
        }
        // Update category count
        transaction.getCategory().setCount(transaction.getCategory().getCount() + 1);
        transactionMapper.updateModelFromRequest(request, transaction);
        Transaction updatedTransaction = transactionRepo.save(transaction);
        return transactionMapper.toDto(updatedTransaction);
    }
}
