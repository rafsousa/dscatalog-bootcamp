import { ProductsResponse } from 'core/types/Product';
import { makeRequest } from 'core/utils/request';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import Pagination from 'core/components/Pagination';

const List = () => {
    // quando a lista de produtos estiver disponível
    // popular um estado no componente, e listar os produtos dinamicamente

    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const history = useHistory();

    // quando o componente iniciar, buscar a lista de produtos
    useEffect(() => {

        const params = {
            page: activePage,
            linesPerPage: 4
        }

        // iniciar o loader
        setIsLoading(true);

        // Ao inves do fetch a melhor opcao e usar o axios
        makeRequest({url: '/products', params})
        .then(response => setProductsResponse(response.data))
        .finally(() => {
            // finalizar o loader
            setIsLoading(false);
        })
    }, [activePage]);

    const handleCreate = () => {
        history.push('/admin/products/create');
    }
    
    return (
        <div className="admin-products-list">
            <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                ADICIONAR
            </button>
            <div className="admin-list-container">
                {productsResponse?.content.map(product => (
                    <Card product={product} key={product.id} />
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