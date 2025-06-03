package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    private String title;
    private String description;
    private Double amount;
    private String type;
    private String categoryName;
    private LocalDateTime date;
}
