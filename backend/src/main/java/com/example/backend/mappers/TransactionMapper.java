package com.example.backend.mappers;

import com.example.backend.dto.TransactionDto;
import com.example.backend.dto.TransactionRequest;
import com.example.backend.model.Transaction;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = CustomMapperMethods.class)
public interface TransactionMapper {

    @Mapping(target = "type", source = "type", qualifiedByName = "mapTypeToString")
    @Mapping(target = "categoryName", source = "category", qualifiedByName = "mapCategoryToName")
    @Mapping(target = "colour", source = "category", qualifiedByName = "mapCategoryToColour")
    TransactionDto toDto(Transaction transaction);

    @Mapping(target = "type", source = "type", qualifiedByName = "mapStringToType")
    Transaction requestToModel(TransactionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateModelFromRequest(TransactionRequest request, @MappingTarget Transaction transaction);
}
