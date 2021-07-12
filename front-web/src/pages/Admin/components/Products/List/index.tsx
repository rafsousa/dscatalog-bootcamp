import { ProductsResponse } from 'core/types/Product';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import Pagination from 'core/components/Pagination';
import { toast } from 'react-toastify';

const List = () => {
    // quando a lista de produtos estiver disponível
    // popular um estado no componente, e listar os produtos dinamicamente

    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const history = useHistory();

    // o userCallback memoriza o componente
    const getProducts = useCallback(() => {
        const params = {
            page: activePage,
            linesPerPage: 4,
            direction : 'DESC',
            orderBy: 'id'
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
    }, [activePage]);

    // quando o componente iniciar, buscar a lista de produtos
    useEffect(() => {
        getProducts();
    }, [getProducts]);

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
            <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                ADICIONAR
            </button>
            <div className="admin-list-container">
                {productsResponse?.content.map(product => (
                    <Card product={product} key={product.id} onRemove={onRemove} />
                ))}
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