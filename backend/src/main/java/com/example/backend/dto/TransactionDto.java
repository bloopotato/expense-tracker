package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private Long id;
    private String title;
    private String description;
    private Double amount;
    private String type;
    private String categoryName;
    private String colour;
    private LocalDateTime date;
}
