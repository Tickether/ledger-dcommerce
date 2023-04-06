import Link from "next/link";
import Image from 'next/image';
import { Attributes, Product } from "../models/models";

interface ProductProps {
    product: Product
}

const ProductComponent = ({product}: ProductProps) => {


    return (
        <div className="product">
            <Link href={`/${product.title}`}>
                <div className="productContainer">
                    <img 
                        src={product.media[0].gateway} 
                        alt="" 
                        className="rentalImg" 
                    />
                    <div className="productDetails">
                        <div className="productTitle">
                            <h2>{product.title}</h2>
                        </div>
                        <div className="productDesc">
                            <p>{product.description}</p>
                        </div>
                        <div className="productAttr">
                            {(product.rawMetadata.attributes).map((attributes: Attributes)=>(
                                <div key={attributes.trait_type}>
                                {attributes.trait_type}

                                </div>
                            ))}
                        </div>
                        
                        
                    </div>
                    
                </div>
            </Link>
        </div>
    );
}

export default ProductComponent;