package com.example.backend.mappers;

import com.example.backend.dto.CategoryDto;
import com.example.backend.dto.CategoryRequest;
import com.example.backend.model.Category;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);

    Category requestToModel(CategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateModelFromRequest(CategoryRequest request, @MappingTarget Category category);
}
