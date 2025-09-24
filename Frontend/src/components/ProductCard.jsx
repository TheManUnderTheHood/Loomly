import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/product/${product._id}`} className="block group">
    <div className="relative overflow-hidden rounded-md">
      <img
        src={product.productImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
        alt={product.name}
        className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
         <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors duration-300 truncate">{product.name}</h3>
            <p className="text-md text-white font-semibold">${product.price}</p>
         </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;