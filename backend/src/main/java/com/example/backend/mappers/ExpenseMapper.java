package com.example.backend.mappers;

import com.example.backend.dto.ExpenseDto;
import com.example.backend.dto.ExpenseRequest;
import com.example.backend.model.Expense;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = CustomMapperMethods.class)
public interface ExpenseMapper {

    @Mapping(target = "categoryName", source = "category", qualifiedByName = "mapCategoryToName")
    @Mapping(target = "colour", source = "category", qualifiedByName = "mapCategoryToColour")
    ExpenseDto toDto(Expense expense);

    Expense requestToModel(ExpenseRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateModelFromRequest(ExpenseRequest request, @MappingTarget Expense expense);
}
