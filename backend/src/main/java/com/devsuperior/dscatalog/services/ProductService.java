package com.devsuperior.dscatalog.services;

import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.devsuperior.dscatalog.dto.CategoryDTO;
import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.dto.UriDTO;
import com.devsuperior.dscatalog.entities.Category;
import com.devsuperior.dscatalog.entities.Product;
import com.devsuperior.dscatalog.repositories.CategoryRepository;
import com.devsuperior.dscatalog.repositories.ProductRepository;
import com.devsuperior.dscatalog.services.exceptions.DatabaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepository repository;

	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private S3Service s3Service;
	
	@Transactional(readOnly = true) // O framework garante a transacao com o BD e nao loca o registro
	public Page<ProductDTO> findAllPaged(Long categoryId, String name, PageRequest pageRequest) {
		
		List<Category> categories = (categoryId == 0) ? null : Arrays.asList(categoryRepository.getOne(categoryId));
		
		Page<Product> page = repository.find(categories, name, pageRequest);
		
		repository.find(page.toList());
		
		return page.map(x -> new ProductDTO(x, x.getCategories()));
		
	}

	@Transactional(readOnly = true) // O framework garante a transacao com o BD e nao loca o registro
	public ProductDTO findById(Long id) {
		Optional<Product> obj = repository.findById(id);
		
		Product entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entidade não encontrada"));
		
		return new ProductDTO(entity, entity.getCategories());
		
	}

	@Transactional
	public ProductDTO insert(ProductDTO dto) {
		Product entity = new Product();
		copyDtoToEntity(dto, entity);
        // ATENCAO - INICIO
		// Codigo somente para testar o front end
		// Despois pode remover
		if (entity.getCategories().size() == 0) {
			Category cat = categoryRepository.getOne(1L);
			entity.getCategories().add(cat);
		}
        // ATENCAO - FIM
		entity = repository.save(entity);
		return new ProductDTO(entity);
		
	}

	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {

		try {
			// Instancia a entidade na memoria sem fazer acesso ao BD
			Product entity = repository.getOne(id);
			
			copyDtoToEntity(dto, entity);
			
	        // ATENCAO - INICIO
			// Codigo somente para testar o front end
			// Despois pode remover
			if (entity.getCategories().size() == 0) {
				Category cat = categoryRepository.getOne(1L);
				entity.getCategories().add(cat);
			}
	        // ATENCAO - FIM
			
			entity = repository.save(entity);

			return new ProductDTO(entity);

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

	// Metodo auxiliar 
	private void copyDtoToEntity(ProductDTO dto, Product entity) {

		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setImgUrl(dto.getImgUrl());
		entity.setPrice(dto.getPrice());
		entity.setDate(dto.getDate());
		
		entity.getCategories().clear(); // Limpa a lista
		
		for (CategoryDTO catDTO : dto.getCategories()) {
			Category category = categoryRepository.getOne(catDTO.getId());
			entity.getCategories().add(category);
		}
		
	}

	public UriDTO uploadFile(MultipartFile file) {
		URL url = s3Service.uploadFile(file);
		return new UriDTO(url.toString());
	}

}
