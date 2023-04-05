import Link from "next/link";
import Image from 'next/image';
import { Product } from "../models/models";

interface ProductProps {
    product: Product
}

const ProductComponent = ({product}: ProductProps) => {


    return (
        <div>
            <Link href={`/${product.title}`}>
                <div className="rentalContainer">
                    <img 
                        src={product.media[0].gateway} 
                        alt="" 
                        className="rentalImg" 
                    />
                    <div className="rentalDetails">
                        <h2 className="siTitle">{product.title}</h2>
                    </div>
                    
                </div>
            </Link>
        </div>
    );
}

export default ProductComponent;