package com.example.backend.mappers;

import com.example.backend.model.Category;
import com.example.backend.util.TransactionType;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class CustomMapperMethods {
    @Named("mapCategoryToName")
    public String mapCategoryToName(Category category) {
        return category != null ? category.getName() : null;
    }

    @Named("mapCategoryToColour")
    public String mapCategoryToColour(Category category) {
        return category != null ? category.getColour() : null;
    }

    @Named("mapTypeToString")
    public String mapTypeToString(TransactionType type) { return type.name(); }

    @Named("mapStringToType")
    public TransactionType mapStringToType(String type) { return type != null ? TransactionType.valueOf(type) : null; }
}
