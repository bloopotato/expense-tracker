package com.example.backend.mappers;

import com.example.backend.model.Category;
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
}
