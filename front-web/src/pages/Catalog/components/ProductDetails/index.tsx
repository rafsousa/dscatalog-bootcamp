import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReactComponent as ArrowIcon } from '../../../../core/assets/images/arrow.svg';
import { Product } from '../../../../core/types/Product';
import { makeRequest } from '../../../../core/utils/request';
import ProductDescriptionLoader from '../Loaders/ProductDescriptionLoader';
import ProductInfoLoader from '../Loaders/ProductInfoLoader';
import ProductPrice from '../ProductPrice';
import './styles.scss'

type ParamsType = {
    productId: string;
}


const ProductDetails = () => {
    const { productId } = useParams<ParamsType>();
    const [product, setProduct] = useState<Product>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        setIsLoading(true);

        makeRequest({url: `/products/${productId}`})
            .then(response => setProduct(response.data))
            .finally(() => setIsLoading(false))
    }, [productId]);
    
    return (
        <div className="product-details-container">
            <div className="card-base border-radius-20 productDetails">
                <div className="product-details-info">
                <Link to='/products' className='product-details-goback'>
                    <ArrowIcon className="icon-goback" />
                    <h1 className='text-goback'>VOLTAR</h1>
                </Link>
                    {isLoading ? ( <ProductInfoLoader /> ) : (
                        <>
                            <div className="product-details-card">
                                <img alt={product?.imgUrl} src={product?.imgUrl} className="product-details-image" />
                            </div>
                            <div className="product-info-fields">
                                <h1 className="product-details-name">
                                    {product?.name}
                                </h1>
                                {product?.price && <ProductPrice price={product?.price}/> }
                            </div>
                        </>
                    )}
                </div>
                <div className="product-details-card product-description">
                        {isLoading ? <ProductDescriptionLoader /> : (
                            <>
                                <h1 className="product-description-title">
                                    Descrição do produto
                                </h1>
                                <p className="product-description-text">
                                    {product?.description}
                                </p>
                            </>
                        )}
                    </div>
            </div>
        </div>

    );
};

export default ProductDetails;