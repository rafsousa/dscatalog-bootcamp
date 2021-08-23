import { Category, ProductsResponse } from 'core/types/Product';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import Pagination from 'core/components/Pagination';
import { toast } from 'react-toastify';
import CardLoader from '../Loaders/ProductCardLoader';
import ProductFilters from 'core/components/ProductFilters';
import './styles.scss'

const List = () => {
    // quando a lista de produtos estiver disponível
    // popular um estado no componente, e listar os produtos dinamicamente

    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const history = useHistory();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>();

    // o userCallback memoriza o componente
    const getProducts = useCallback(() => {
        const params = {
            page: activePage,
            linesPerPage: 4,
            direction : 'DESC',
            orderBy: 'id',
            name,
            categoryId: category?.id
        }

        // iniciar o loader
        setIsLoading(true);

        // Ao inves do fetch a melhor opcao e usar o axios
        makeRequest({ url: '/products', params })
        .then(response => setProductsResponse(response.data))
        .finally(() => {
            // finalizar o loader
            setIsLoading(false);
        })
    }, [activePage, name, category]);

    // quando o componente iniciar, buscar a lista de produtos
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const handleChangeName = (name: string) => {
        setActivePage(0);
        setName(name);
    }

    const handleChangeCategory = (category: Category) => {
        setActivePage(0);
        setCategory(category);
    }

    const clearFilters = () => {
        setActivePage(0);
        setCategory(undefined);
        setName('');
     }

    const handleCreate = () => {
        history.push('/admin/products/create');
    }
    
    const onRemove = (productId: number) => {
        const confirm = window.confirm("Deseja excluir o produto ?");

        if (confirm) {
            makePrivateRequest({ url: `/products/${productId}`, method: 'DELETE' })
                .then(() => {
                    toast.info('Produto excluido com sucesso!')
                    getProducts();
                    // Redireciona para a listagem de produtos
                    // history.push('/admin/products');
                })
                .catch(() => {
                    toast.error('Erro ao excluir produto!');
                })
        }
    }
   
    return (
        <div className="admin-products-list">
            <div className="filter-admin-product">
                <div className="button-add">
                    <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                        ADICIONAR
                    </button>
                </div>
                <ProductFilters 
                    name={name}
                    category={category}
                    handleChangeCategory={handleChangeCategory}
                    handleChangeName={handleChangeName}
                    clearFilters={clearFilters}
                />
            </div>
            <div className="admin-list-container">
                {isLoading ? <CardLoader /> :(
                    productsResponse?.content.map(product => (
                        <Card product={product} key={product.id} onRemove={onRemove} />
                    ))
                )}
                {productsResponse && (
                    <Pagination
                        totalPages={productsResponse?.totalPages} 
                        activePage={activePage}
                        onChange={page => setActivePage(page)}
                    />
                )}
            </div>
        </div>
    )
}

export default List;