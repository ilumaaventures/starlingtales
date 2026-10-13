import React from 'react';
import Icon from './Icon';
import GetStartedButton from './GetStartedButton';

import { formatPrice } from '../constants';

export default function ProductCard({ product, isWishlisted, onWishlist, onQuickView, onAddToCart }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white border border-[#E8DFC8]/40 shadow-[0_2px_12px_rgba(44,62,53,0.07)] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(44,62,53,0.12)] flex flex-col h-full justify-between" data-product-id={product.id}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2] flex items-center justify-center p-3">
        <button
          className="h-full w-full text-left flex items-center justify-center"
          type="button"
          onClick={() => onQuickView(product.id)}
          aria-label={`View details of ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-350 group-hover:scale-105 motion-reduce:group-hover:scale-100 drop-shadow-sm"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x600?text=Starling+Tales";
            }}
          />
        </button>

        {product.badge ? (
          <span className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-widest leading-tight uppercase pointer-events-none text-white ${
            product.badge.toLowerCase().replace(/\s+/g, '-') === 'bestseller' ? 'bg-gold' :
            product.badge.toLowerCase().replace(/\s+/g, '-') === 'new' ? 'bg-blue-soft' :
            product.badge.toLowerCase().replace(/\s+/g, '-') === 'sale' ? 'bg-danger' :
            product.badge.toLowerCase().replace(/\s+/g, '-') === 'gift-set' ? 'bg-brown-warm' :
            'bg-text-dark text-cream'
          }`} aria-label={product.badge}>
            {product.badge}
          </span>
        ) : null}

        <div className="absolute inset-0 z-10 flex flex-col items-end justify-between p-3 bg-cream/0 opacity-0 transition-all duration-220 group-hover:opacity-100 group-hover:bg-cream/12 group-focus-within:opacity-100 group-focus-within:bg-cream/12" role="group" aria-label={`Quick actions for ${product.name}`}>
          <div className="flex flex-col items-end">
            <button
              className={`flex h-11 w-11 items-center justify-center border-none rounded-full mb-2 bg-white text-text-dark shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-150 hover:bg-blue-light hover:scale-108 focus-visible:bg-blue-light focus-visible:scale-108 ${isWishlisted ? 'text-danger fill-danger' : ''}`}
              type="button"
              data-product-id={product.id}
              aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`}
              title="Save to Wishlist"
              onClick={(event) => {
                event.stopPropagation()
                onWishlist(product.id)
              }}
            >
              <Icon name="heart" className={`h-5 w-5 ${isWishlisted ? 'fill-danger text-danger' : ''}`} />
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center border-none rounded-full mb-2 bg-white text-text-dark shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-150 hover:bg-blue-light hover:scale-108 focus-visible:bg-blue-light focus-visible:scale-108"
              type="button"
              aria-label={`Quick view ${product.name}`}
              title="Quick View"
              onClick={(event) => {
                event.stopPropagation()
                onQuickView(product.id)
              }}
            >
              <Icon name="eye" className="h-5 w-5" />
            </button>
          </div>

          <button
            className="absolute bottom-0 inset-x-0 flex h-11 items-center justify-center gap-2 border-none bg-text-dark text-cream text-xs font-medium tracking-[0.16em] uppercase translate-y-full transition-all duration-220 group-hover:translate-y-0 group-focus-within:translate-y-0 hover:bg-blue-soft focus-visible:translate-y-0 focus-visible:bg-blue-soft"
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product.id, product.variants[0]?.sku, 1)
            }}
          >
            <Icon name="bag" className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-5 pb-5 flex flex-col flex-1 justify-between">
        <div>
          {product.category && !/^[0-9a-fA-F]{24}$/.test(product.category) && (
            <p className="mb-1 text-blue-soft text-[10px] font-medium tracking-widest uppercase">
              {product.category}
            </p>
          )}
          <h3 className="mb-1 text-text-dark font-display text-lg font-semibold line-clamp-2 min-h-[56px]">{product.name}</h3>
          <p className="min-h-[54px] mb-2.5 text-text-muted text-xs font-light leading-normal line-clamp-3">{product.tagline}</p>

          <div className="flex items-center gap-1.25 mb-2.5" aria-label={`Rated ${product.rating} out of 5`}>
            <span className="text-gold text-xs tracking-normal" aria-hidden="true">
              ★★★★★
            </span>
            <span className="text-text-dark text-xs font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-text-muted text-[11px]">({product.reviews})</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3.5">
            <span className="text-text-dark text-lg font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-text-muted text-sm line-through">{formatPrice(product.originalPrice)}</span>
            ) : null}
          </div>

          <div className="flex items-center gap-2.5">
            <GetStartedButton
              className="flex-1 text-xs font-semibold uppercase tracking-wider h-11"
              onClick={() => onQuickView(product.id)}
              aria-label={`View details of ${product.name}`}
            >
              View Details
            </GetStartedButton>
            <button
              className={`flex h-11 w-11 items-center justify-center border border-cream-dark rounded bg-cream text-text-muted transition-colors duration-200 ${
                isWishlisted ? 'border-danger bg-red-50 text-danger' : 'hover:border-danger hover:bg-red-50 hover:text-danger focus-visible:border-danger focus-visible:bg-red-50 focus-visible:text-danger'
              }`}
              type="button"
              data-product-id={product.id}
              onClick={() => onWishlist(product.id)}
              aria-label={`Toggle wishlist for ${product.name}`}
            >
              <Icon name="heart" className={`h-5 w-5 ${isWishlisted ? 'fill-danger text-danger' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
