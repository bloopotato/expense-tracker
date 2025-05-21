package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExpenseRequest {
    private String title;
    private String description;
    private Double amount;
    private String categoryName;
    private LocalDateTime date;
}
