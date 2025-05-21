package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExpenseDto {
    private Long id;
    private String title;
    private String description;
    private Double amount;
    private String categoryName;
    private String colour;
    private LocalDateTime date;
}
