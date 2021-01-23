package com.devsuperior.dscatalog.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dscatalog.dto.CategoryDTO;
import com.devsuperior.dscatalog.entities.Category;
import com.devsuperior.dscatalog.repositories.CategoryRepository;
import com.devsuperior.dscatalog.services.exceptions.DatabaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository repository;
	
	@Transactional(readOnly = true) // O framework garante a transacao com o BD e nao loca o registro
	public List<CategoryDTO> findAll() {
		List<Category> list = repository.findAll();
		
//		List<CategoryDTO> listDto = new ArrayList<>();
		
//		for (Category cat : list) {
//			listDto.add(new CategoryDTO(cat));
//		}
		
//		return listDto;
	
		// A linha abaixo faz o mesmo do codigo acima comentado
		return list.stream().map(x -> new CategoryDTO(x)).collect(Collectors.toList());
		
	}

	@Transactional(readOnly = true) // O framework garante a transacao com o BD e nao loca o registro
	public CategoryDTO findById(Long id) {
		Optional<Category> obj = repository.findById(id);
		
		Category entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entidade não encontrada"));
		
		return new CategoryDTO(entity);
		
	}

	@Transactional
	public CategoryDTO insert(CategoryDTO dto) {
		Category entity = new Category();
		
		entity.setName(dto.getName());
		entity = repository.save(entity);
		
		return new CategoryDTO(entity);
		
	}

	@Transactional
	public CategoryDTO update(Long id, CategoryDTO dto) {

		try {
			// Instancia a entidade na memoria sem fazer acesso ao BD
			Category entity = repository.getOne(id);
			
			entity.setName(dto.getName());
			
			entity = repository.save(entity);

			return new CategoryDTO(entity);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("ID não localizado : " + id);
		}
	
	}

	public void delete(Long id) {
		
		try {
			repository.deleteById(id);
		
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("ID não localizado : " + id);
		}
		catch (DataIntegrityViolationException e) {
			throw new DatabaseException("Violação de Integridade");
		}
		
	}
	
}
